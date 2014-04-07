// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ core, api, compile => ast, nvm, workspace },
   nvm.FrontEndInterface.{ ProceduresMap, NoProcedures }

import collection.JavaConverters._

// there are three main entry points here:
//   compile{Reporter, Commands, Procedures}
// all three take NetLogo, return JavaScript.

// the dependencies between the classes in this package are as follows:
// - Compiler calls Handlers
// - Handlers calls Prims
// - Prims calls back to Handlers

object Compiler {

  val frontEnd: ast.FrontEndInterface = ast.front.FrontEnd

  def compileReporter(logo: String,
    oldProcedures: ProceduresMap = NoProcedures,
    program: api.Program = api.Program.empty()): String =
    compile(logo, commands = false, oldProcedures, program)

  def compileCommands(logo: String,
    oldProcedures: ProceduresMap = NoProcedures,
    program: api.Program = api.Program.empty()): String =
    compile(logo, commands = true, oldProcedures, program)

  def compileProcedures(
      logo: String,
      interfaceGlobals: Seq[String] = Seq(),
      interfaceGlobalCommands: String = "",
      dimensions: core.WorldDimensions = core.WorldDimensions.square(0),
      turtleShapeList: api.ShapeList = new api.ShapeList(core.AgentKind.Turtle),
      linkShapeList: api.ShapeList = new api.ShapeList(core.AgentKind.Link))
      : (String, api.Program, ProceduresMap) = {
    val (defs, results): (Seq[ast.ProcedureDefinition], nvm.StructureResults) =
      frontEnd.frontEnd(logo,
        program = api.Program.empty.copy(interfaceGlobals = interfaceGlobals))
    val init = new RuntimeInit(results.program, dimensions,
      turtleShapeList, linkShapeList)
    val main =
      defs.map(compileProcedureDef).mkString("", "\n", "\n")
    val interface =
      compileCommands(interfaceGlobalCommands, program = results.program)
    val js = init.init + main + interface
    if (results.program.linkBreeds.nonEmpty)
      throw new IllegalArgumentException("unknown language feature: link breeds")
    (js, results.program, results.procedures)
  }

  private def compileProcedureDef(pd: ast.ProcedureDefinition): String = {
    val name = Handlers.ident(pd.procedure.name)
    val body = Handlers.commands(pd.statements)
    val args = pd.procedure.args.map(Handlers.ident).mkString(", ")
    s"""|function $name($args) {
        |  return Procedures.stoppably(function() {
        |${Handlers.indented(body, 2)}
        |  });
        |}""".stripMargin
  }

  // How this works:
  // - the header/footer stuff wraps the code in `to` or `to-report`
  // - the compile returns a Seq, whose head is a ProcedureDefinition
  //   containing some Statements (the procedure body)
  // - in the reporter case, the procedure body starts with the
  //   `__observer-code` command followed by the `report` command, so the
  //   actual reporter is the first (and only) argument to `report`

  private def compile(logo: String, commands: Boolean,
      oldProcedures: ProceduresMap = NoProcedures,
      program: api.Program = api.Program.empty()): String = {

    val wrapped =
      workspace.Evaluator.getHeader(core.AgentKind.Observer, commands) +
        logo + workspace.Evaluator.getFooter(commands)
    val (defs, _) = frontEnd.frontEnd(wrapped, oldProcedures, program)

    val (body, jsFuncGenerator) =
      if (commands)
        (Handlers.commands(defs.head.statements), (body: String) => s"function() {$body}")
      else
        (Handlers.reporter(defs.head.statements.stmts(1).args(0)), (body: String) => s"function() { return $body; }")

    if (body.trim.nonEmpty)
      s"Procedures.stoppably(${jsFuncGenerator(body)})"
    else
      body

  }

}
