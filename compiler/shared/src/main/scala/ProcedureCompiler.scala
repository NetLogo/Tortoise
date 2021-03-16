// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JsOps.jsFunction

import
  org.nlogo.core.ProcedureDefinition

import
  TortoiseSymbol.JsStatement

class ProcedureCompiler(handlers: Handlers)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext) {
  def compileProcedures(procedureDefs: Seq[ProcedureDefinition]): Seq[CompiledProcedure] =
    procedureDefs.map(compileProcedureDef)

  private def compileProcedureDef(originalPd: ProcedureDefinition)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): CompiledProcedure = {

    val pd = if (compilerFlags.optimizationsEnabled)
      Optimizer(originalPd)
    else
      originalPd
    val name       = pd.procedure.name.toLowerCase
    val safeName   = JSIdentProvider(name)
    handlers.resetEveryID(safeName)
    val parameters = pd.procedure.args.map( (p) => (p, JSIdentProvider(p)) )
    implicit val procContext = ProcedureContext(true, parameters)
    val args       = procContext.parameters.map(_._2)
    val body       = handlers.commands(pd.statements)
    val functionJs = s"(${jsFunction(args = args, body = body)})"
    if (pd.procedure.isReporter)
      new CompiledReporter(name, functionJs)
    else
      new CompiledCommand(name, functionJs)
  }
}

object ProcedureCompiler {

  def formatProcedures(procedures: Seq[CompiledProcedure]): TortoiseSymbol = {
    val procedureDefs = ProcedureCompiler.formatProcedureBodies(procedures)
    JsStatement("procedures", procedureDefs, Seq("workspace", "world"))
  }

  def formatProcedureBodies(procedures: Seq[CompiledProcedure]): String =
    procedures.map(_.format).mkString("\n")

}
