// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.{ api, core, parse },
    core.{ AgentKind, FrontEndInterface, Model, ProcedureDefinition, Program, SourceWrapping, StructureResults },
      FrontEndInterface.{ ProceduresMap, NoProcedures },
    parse.FrontEnd

// there are three main entry points here:
//   compile{Reporter, Commands, Procedures}
// all three take NetLogo, return JavaScript.

// the dependencies between the classes in this package are as follows:
// - Compiler calls Handlers
// - Handlers calls Prims
// - Prims calls back to Handlers

object Compiler extends CompilerLike with ModelConfigGenerator {

  self =>

  private val prims:    Prims    = new Prims    { override lazy val handlers = self.handlers }
  private val handlers: Handlers = new Handlers { override lazy val prims    = self.prims }

  val frontEnd: FrontEndInterface = FrontEnd

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
                  (implicit compilerFlags: CompilerFlags): (String, Program, ProceduresMap) = {
    val (defs, results): (Seq[ProcedureDefinition], StructureResults) =
      frontEnd.frontEnd(model.code, program = program, oldProcedures = oldProcedures)
    val main = proceduresObject(defs.map(compileProcedureDef))
    (main, results.program, results.procedures)
  }

  def compileProcedures(model:         Model)
              (implicit compilerFlags: CompilerFlags): (String, Program, ProceduresMap) = {
    val (main, program, procedures) = compileMoreProcedures(
      model,
      Program.empty.copy(interfaceGlobals = model.interfaceGlobals),
      FrontEndInterface.NoProcedures)
    val init = new RuntimeInit(program, model)
    val interface =
      compileCommands(model.interfaceGlobalCommands.mkString("\n"), program = program)
    val modelConfig = genModelConfig(model)(compileCommands(_, procedures, program))
    val js = modelConfig + init.init + main + interface
    (js, program, procedures)
  }

  private def proceduresObject(procedureDefs: Seq[(String, Map[String, String])]) = {
    import handlers.indented
    val functionDeclarations = procedureDefs.map(_._1).mkString("\n")
    val propertyDeclarations = procedureDefs.map(_._2)
      .foldLeft(Map.empty[String, String])(_ ++ _)
      .toSeq.sortBy(_._1)
      .map(prop => s""""${prop._1}":${prop._2}""").mkString(",\n")
    s"""|var procedures = (function() {
        |${indented(functionDeclarations)}
        |  return {
        |${indented(indented(propertyDeclarations))}
        |  };
        |})();\n""".stripMargin
  }

  private def compileProcedureDef(pd:            ProcedureDefinition)
                        (implicit compilerFlags: CompilerFlags): (String, Map[String, String]) = {
    val originalName = pd.procedure.name
    val safeName = handlers.ident(originalName)
    handlers.resetEveryID(safeName)
    val body = handlers.commands(pd.statements)
    val args = pd.procedure.args.map(handlers.ident).mkString(", ")
    val functionJavascript = s"""|var $safeName = function($args) {
                                 |${handlers.indented(body)}
                                 |};""".stripMargin
    if (safeName != originalName)
      (functionJavascript, Map(originalName -> safeName, safeName -> safeName))
    else
      (functionJavascript, Map(safeName -> safeName))
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
