// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.{ api, compile => ast, core, nvm, workspace },
    api.CompilerException,
    nvm.FrontEndInterface.{ ProceduresMap, NoProcedures }

import collection.JavaConverters._

// there are three main entry points here:
//   compile{Reporter, Commands, Procedures}
// all three take NetLogo, return JavaScript.

// the dependencies between the classes in this package are as follows:
// - Compiler calls Handlers
// - Handlers calls Prims
// - Prims calls back to Handlers

object Compiler extends CompilerLike {

  val frontEnd: ast.FrontEndInterface = ast.front.FrontEnd

  def compileReporter(logo: String,
    oldProcedures: ProceduresMap = NoProcedures,
    program: api.Program = api.Program.empty()): String =
    compile(logo, commands = false, oldProcedures, program)

  def compileCommands(logo: String,
    oldProcedures: ProceduresMap = NoProcedures,
    program: api.Program = api.Program.empty()): String =
    compile(logo, commands = true, oldProcedures, program)

  def compileProcedures(model: core.Model) : (String, api.Program, ProceduresMap) = {
    val (defs, results): (Seq[ast.ProcedureDefinition], nvm.StructureResults) =
      frontEnd.frontEnd(model.code,
        program = api.Program.empty.copy(interfaceGlobals = model.interfaceGlobals))
    val init = new RuntimeInit(results.program, model)
    val main =
      defs.map(compileProcedureDef).mkString("", "\n", "\n")
    val interface =
      compileCommands(model.interfaceGlobalCommands.mkString("\n"), program = results.program)
    val js = init.init + main + interface
    if (results.program.linkBreeds.nonEmpty)
      throw new CompilerException("unknown language feature: link breeds", 1, 1, "")
    (js, results.program, results.procedures)
  }

  private def compileProcedureDef(pd: ast.ProcedureDefinition): String = {
    val name = Handlers.ident(pd.procedure.name)
    val body = Handlers.commands(pd.statements)
    val args = pd.procedure.args.map(Handlers.ident).mkString(", ")
    s"""|function $name($args) {
        |${Handlers.indented(body)}
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
    if (commands)
      Handlers.commands(defs.head.statements)
    else
      Handlers.reporter(defs.head.statements.stmts(1).args(0))
  }

}
