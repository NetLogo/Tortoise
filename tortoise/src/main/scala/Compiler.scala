// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  CompilerFlags.WidgetPropagation

import
  CompilerLike.Compilation

import
  org.nlogo.{ core, parse },
    core.{ AgentKind, CompilerException, FrontEndInterface, Model, ProcedureDefinition, Program, SourceWrapping, StructureResults },
      FrontEndInterface.{ ProceduresMap, NoProcedures },
    parse.FrontEnd

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationOps

import
  JsOps.jsFunction

import
  TortoiseSymbol.JsStatement

// there are four main entry points here:
//   compile{Reporter, Commands}
// take NetLogo, return JavaScript.
//   compileProcedures
// takes NetLogo, returns a "Compilation", which can be sent to
//    toJS
//  which takes a Compilation and returns JavaScript

// The division between compileProcedures and toJS makes it easier for clients, such as
// Galapagos, to deal with compiled components which are *not* procedures,
// things like widgets, plots, and interface initialization. compileProcedures will raise
// an error if the procedures cannot be compiled, if other components cannot be compiled,
// those components will contain (or be) a failed validation. toJS translates the
// entire Compilation into a ready-to-execute JavaScript model. We separate these
// functions in order to allow non-critical compilation concerns to fail while still
// allowing procedure compilation to succeed. We return those failures in order to allow
// Galapagos to make a decision about how to behave when a part of compilation fails.
// RG 6/17/2015

// the dependencies between the classes in this package are as follows:
// - Compiler calls Handlers
// - Handlers calls Prims
// - Prims calls back to Handlers
object Compiler extends CompilerLike {

  self =>

  private val prims:    Prims    = new Prims    { override lazy val handlers = self.handlers }
  private val handlers: Handlers = new Handlers { override lazy val prims    = self.prims }

  val frontEnd: FrontEndInterface = FrontEnd

  def toJS(result:           Compilation)
    (implicit compilerFlags: CompilerFlags = CompilerFlags.Default) : String = {
    import result.model
    val init              = new RuntimeInit(result.program, model, compilerFlags.onTickCallback).init
    val plotConfig        = PlotCompiler.formatPlots(result.widgets)
    val procedures        = ProcedureCompiler.formatProcedures(result.compiledProcedures)
    val interfaceGlobalJs = result.interfaceGlobalCommands.map(
      (v: ValidationNel[CompilerException, String]) => v.fold(
        ces => s"""modelConfig.dialog.notify("Error(s) in interface global init: ${ces.map(_.getMessage).list.toList.mkString(", ")}")""",
        identity)).mkString("\n")

    val interfaceInit = JsStatement("interfaceInit", interfaceGlobalJs, Seq("world", "procedures", "modelConfig"))
    TortoiseLoader.integrateSymbols(init ++ plotConfig ++ procedures
                                         :+ outputConfig :+ dialogConfig
                                         :+ worldConfig :+ interfaceInit)
  }

  def compileReporter(logo:          String,
                      oldProcedures: ProceduresMap = NoProcedures,
                      program:       Program       = Program.empty())
            (implicit compilerFlags: CompilerFlags = CompilerFlags.Default): String =
    compile(logo, commands = false, oldProcedures, program)

  def compileCommands(logo:          String,
                      oldProcedures: ProceduresMap = NoProcedures,
                      program:       Program       = Program.empty())
            (implicit compilerFlags: CompilerFlags = CompilerFlags.Default): String =
    compile(logo, commands = true, oldProcedures, program)

  override def compileRawCommands(logo:          String,
                                  oldProcedures: ProceduresMap = NoProcedures,
                                  program:       Program       = Program.empty())
            (implicit compilerFlags: CompilerFlags = CompilerFlags.Default): String =
    compile(logo, commands = true, oldProcedures, program, true)

  def compileMoreProcedures(model:         Model,
                            program:       Program,
                            oldProcedures: ProceduresMap)
                  (implicit compilerFlags: CompilerFlags):
                  (Seq[ProcedureDefinition], Program, ProceduresMap) = {
    val (defs, results): (Seq[ProcedureDefinition], StructureResults) =
      frontEnd.frontEnd(model.code,
                        program = program,
                        oldProcedures = oldProcedures,
                        extensionManager = NLWExtensionManager)
    (defs, results.program, results.procedures)
  }

  def compileProcedures(model:         Model)
              (implicit compilerFlags: CompilerFlags): Compilation = {

    val (procedureDefs, program, procedures) =
      {
        val prog  = Program.empty.copy(interfaceGlobals = model.interfaceGlobals)
        val procs = FrontEndInterface.NoProcedures
        compileMoreProcedures(model, prog, procs)
      }

    val compiledProcedures = new ProcedureCompiler(handlers).compileProcedures(procedureDefs)

    val compiledWidgets =
      {
        val flags             = compilerFlags.copy(propagationStyle = WidgetPropagation)
        val compileStoppableV = validate(s => compileCommands(s, procedures, program)(flags)) _ andThen (_.leftMap(_.map(ex => ex: Exception)))
        val compileReporterV  = validate(s => compileReporter(s, procedures, program))        _ andThen (_.leftMap(_.map(ex => ex: Exception)))
        new WidgetCompiler(compileStoppableV, compileReporterV).compileWidgets(model.widgets)
      }

    val interface =
      {
        val validatedCompileCommand = validate(s => compileRawCommands(s, procedures, program)) _
        model.interfaceGlobalCommands.map(validatedCompileCommand)
      }

    Compilation(compiledProcedures, compiledWidgets, interface, model, procedures, program)

  }

  private def validate(compileFunc: String => String)(arg: String): CompiledModel.CompileResult[String] = {
    try compileFunc(arg).successNel[CompilerException]
    catch {
      case ex: CompilerException => ex.failureNel[String]
    }
  }

  // How this works:
  // - the header/footer stuff wraps the code in `to` or `to-report`
  // - the compile returns a Seq, whose head is a ProcedureDefinition
  //   containing some Statements (the procedure body)
  // - in the reporter case, the procedure body starts with the
  //   `__observer-code` command followed by the `report` command, so the
  //   actual reporter is the first (and only) argument to `report`

  private def compile(logo:          String,
                      commands:      Boolean,
                      oldProcedures: ProceduresMap = NoProcedures,
                      program:       Program       = Program.empty(),
                      raw:           Boolean       = false)
            (implicit compilerFlags: CompilerFlags = CompilerFlags.Default): String = {
    val header  = SourceWrapping.getHeader(AgentKind.Observer, commands)
    val footer  = SourceWrapping.getFooter(commands)
    val wrapped = s"$header$logo$footer"
    val (defs, _) = frontEnd.frontEnd(wrapped, oldProcedures = oldProcedures, program = program, extensionManager = NLWExtensionManager)
    val pd = optimize.Optimizer(defs.head)
    if (commands)
      handlers.commands(pd.statements, true, !raw)
    else
      handlers.reporter(pd.statements.stmts(1).args(0))
  }

  private def outputConfig: JsStatement =
    genConfig("output", Map("clear" -> jsFunction(),
                            "write" -> jsFunction(Seq("str"), "context.getWriter().print(str);")))

  private def dialogConfig: JsStatement =
    genConfig("dialog", Map("confirm" -> jsFunction(Seq("str"), "return true;"),
                            "input"   -> jsFunction(Seq("str"), "return 'dummy implementation';"),
                            "notify"  -> jsFunction(Seq("str")),
                            "yesOrNo" -> jsFunction(Seq("str"), "return true;")))


  private def worldConfig: JsStatement =
    genConfig("world", Map("resizeWorld" -> jsFunction(Seq("agent"))))

  private def exportingConfig: JsStatement =
    genConfig("exporting", Map("output" -> jsFunction(Seq("filename"))))

  private def genConfig(configName: String, functionDefs: Map[String, String]): JsStatement = {

    val configPath = s"modelConfig.$configName"
    val defsStr    = functionDefs.map { case (k, v) => s"$k: $v" }.mkString("{\n|    ", ",\n|    ", "\n|  }")

    // If `javax` exists, we're in Nashorn, and, therefore, testing --JAB (3/2/15)
    val configStr =
      s"""|if (typeof javax !== "undefined") {
          |  $configPath = $defsStr
          |}""".stripMargin

    JsStatement(configPath, configStr, Seq("modelConfig"))

  }

}
