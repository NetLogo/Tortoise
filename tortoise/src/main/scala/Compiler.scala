// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

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
    val modelConfig       = PlotCompiler.formatPlots(result.widgets)
    val procedures        = ProcedureCompiler.formatProcedures(result.compiledProcedures)
    val interfaceGlobalJs = result.interfaceGlobalCommands.map(
      (v: ValidationNel[CompilerException, String]) => v.fold(
        ces => s"""modelConfig.output.write("Error(s) in interface global init: ${ces.map(_.getMessage).list.mkString(", ")}")""",
        identity)).mkString("\n")

    val interfaceInit = JsStatement("interfaceInit", interfaceGlobalJs, Seq("world", "procedures", "modelConfig"))
    TortoiseLoader.integrateSymbols(Seq(init, modelConfig, procedures).flatten :+ interfaceInit)
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

  def compileMoreProcedures(model:         Model,
                            program:       Program,
                            oldProcedures: ProceduresMap)
                  (implicit compilerFlags: CompilerFlags):
                  (Seq[ProcedureDefinition], Program, ProceduresMap) = {
    val (defs, results): (Seq[ProcedureDefinition], StructureResults) =
      frontEnd.frontEnd(model.code, program = program, oldProcedures = oldProcedures)
    (defs, results.program, results.procedures)
  }

  def compileProcedures(model:         Model)
              (implicit compilerFlags: CompilerFlags): Compilation = {
    val (procedureDefs, program, procedures) = compileMoreProcedures(
      model,
      Program.empty.copy(interfaceGlobals = model.interfaceGlobals),
      FrontEndInterface.NoProcedures)
    val validatedCompileCommand  = validate(s => compileCommands(s, procedures, program)) _
    val validatedCompileReporter = validate(s => compileReporter(s, procedures, program)) _
    val interface                = model.interfaceGlobalCommands.map(validatedCompileCommand)
    val compiledProcedures       = new ProcedureCompiler(handlers).compileProcedures(procedureDefs)
    val compiledWidgets          = new WidgetCompiler(validatedCompileCommand, validatedCompileReporter)
      .compileWidgets(model.widgets)
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
                      program:       Program       = Program.empty())
            (implicit compilerFlags: CompilerFlags = CompilerFlags.Default): String = {
    val header  = SourceWrapping.getHeader(AgentKind.Observer, commands)
    val footer  = SourceWrapping.getFooter(commands)
    val wrapped = s"$header$logo$footer"
    val (defs, _) = frontEnd.frontEnd(wrapped, oldProcedures = oldProcedures, program = program)
    if (commands)
      handlers.commands(defs.head.statements)
    else
      handlers.reporter(defs.head.statements.stmts(1).args(0))
  }

}