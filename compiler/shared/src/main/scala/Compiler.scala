// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.{ core, parse },
    core.{ AgentKind, CompilerException, FrontEndInterface, Model, ProcedureDefinition, Program, SourceWrapping, StructureResults },
      FrontEndInterface.{ ProceduresMap, NoProcedures },
    parse.FrontEnd

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationOps

import CompilerFlags.WidgetPropagation
import CompilerLike.Compilation
import TortoiseSymbol.JsStatement

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
    val init              = new RuntimeInit(result.program, result.widgets, model, compilerFlags.onTickCallback).init
    val plotConfig        = PlotCompiler.formatPlots(result.widgets)
    val procedures        = ProcedureCompiler.formatProcedures(result.compiledProcedures)
    val interfaceGlobalJs = result.interfaceGlobalCommands.map(
      (v: ValidationNel[CompilerException, String]) => v.fold(
        ces => s"""modelConfig.dialog.notify("Error(s) in interface global init: ${ces.map(_.getMessage).list.toList.mkString(", ")}")""",
        identity)).mkString("\n")

    val interfaceInit = JsStatement("interfaceInit", interfaceGlobalJs, Seq("world", "procedures", "modelConfig"))
    TortoiseLoader.integrateSymbols(init ++ plotConfig ++ procedures :+
                                    JsStatement("global.modelConfig", Polyfills.content) :+
                                    resolveModelConfig :+ interfaceInit)
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

  // To compile more procedures after the main body is compiled
  def compileProceduresIncremental(logo:          String,
                                   oldProcedures: ProceduresMap = NoProcedures,
                                   program:       Program       = Program.empty(), 
                                   overriding:    Seq[String]   = Seq())
            (implicit compilerFlags: CompilerFlags = CompilerFlags.Default): String = {
    
    // In order to compile existing procedures, we have to remove the one from the procedure map first
    val (defs, results): (Seq[ProcedureDefinition], StructureResults) =
    frontEnd.frontEnd(logo,
                      program = program,
                      oldProcedures = oldProcedures.filter({ case (name, procedure) => !overriding.contains(name) }),
                      extensionManager = NLWExtensionManager,
                      subprogram = false)

    implicit val context   = new CompilerContext(logo)
    val compiledProcedures = new ProcedureCompiler(handlers).compileProcedures(defs)

    // Here we don't want the full symbols..
    val symbols = ProcedureCompiler.formatProcedures(compiledProcedures)
    symbols.map(_.toJS).mkString("", "\n", "\n")
  }

  def compileMoreProcedures(model:         Model,
                            program:       Program,
                            oldProcedures: ProceduresMap)
                  : (Seq[ProcedureDefinition], Program, ProceduresMap) = {
    val (defs, results): (Seq[ProcedureDefinition], StructureResults) =
      frontEnd.frontEnd(model.code,
                        program = program,
                        oldProcedures = oldProcedures,
                        extensionManager = NLWExtensionManager,
                        subprogram = false)
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

    implicit val context   = new CompilerContext(model.code)
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
                      oldProcedures: ProceduresMap,
                      program:       Program,
                      raw:           Boolean       = false)
            (implicit compilerFlags: CompilerFlags): String = {

    val header  = SourceWrapping.getHeader(AgentKind.Observer, commands)
    val footer  = SourceWrapping.getFooter(commands)
    val wrapped = s"$header$logo$footer"

    implicit val context     = new CompilerContext(wrapped)
    implicit val procContext = ProcedureContext(!raw, Seq())

    val (defs, _) =
      frontEnd.frontEnd( wrapped, oldProcedures = oldProcedures
                       , program = program, extensionManager = NLWExtensionManager)

    val pd =
      if (compilerFlags.optimizationsEnabled)
        Optimizer(defs.head)
      else
        defs.head

    if (commands)
      handlers.commands(pd.statements, true, !raw)
    else
      handlers.reporter(pd.statements.stmts(1).args(0))

  }

  private def resolveModelConfig: JsStatement = {
    val js = """var modelConfig =
               |  (
               |    (typeof global !== "undefined" && global !== null) ? global :
               |    (typeof window !== "undefined" && window !== null) ? window :
               |    {}
               |  ).modelConfig || {};""".stripMargin
    JsStatement("modelConfig", js, Seq("global.modelConfig"))
  }

  // This is a workaround for GraalJS interop - we need string bytes in `exportFile`, but GraalJS converts
  // JVM strings to JS strings.  So convert them back!  -JMB Feb 2019
  def getBytes(value: String): Array[Byte] = value.getBytes(java.nio.charset.StandardCharsets.UTF_8)

}
