// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JsOps.{ jsFunction }

import
  org.nlogo.core.ProcedureDefinition

import
  ProcedureCompiler.CompiledProceduresDictionary

import
  TortoiseSymbol.JsDeclare

class ProcedureCompiler(handlers: Handlers)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext) {
  def compileProcedures(procedureDefs: Seq[ProcedureDefinition]): CompiledProceduresDictionary =
    procedureDefs.map(compileProcedureDef)

  private def compileProcedureDef(originalPd:            ProcedureDefinition)
                        (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): (String, Seq[String]) = {
    val pd = if (compilerFlags.optimizationsEnabled)
      Optimizer(originalPd)
    else
      originalPd
    val originalName = pd.procedure.name
    val safeName = handlers.ident(originalName)
    handlers.resetEveryID(safeName)
    val parameters = pd.procedure.args.map( (p) => (p, handlers.ident(p)) )
    implicit val procContext = ProcedureContext(true, parameters)
    val body =
      if (pd.procedure.isReporter) {
        val unwrappedBody = handlers.commands(pd.statements, false)
        handlers.reporterProcContext(unwrappedBody)
      } else
        handlers.commands(pd.statements, true, true)
    val functionJs = s"(${jsFunction(args = procContext.parameters.map(_._2), body = body)})"
    (functionJs, Seq(safeName, originalName).distinct)
  }
}

object ProcedureCompiler {
  type CompiledProceduresDictionary = Seq[(String, Seq[String])]

  def formatProcedures(procedures: CompiledProceduresDictionary): Seq[TortoiseSymbol] =
    Seq(JsDeclare("procedures", proceduresObject(procedures), Seq("workspace", "world")))

  def formatProceduresIncrementals(procedures: CompiledProceduresDictionary) : String = 
      procedures.map {
        case (js, names) =>
          names.map(name => s"""procs["$name"] = temp;""").mkString(s"temp = $js;\n", "\n", "")
      }.mkString("\n")

  private def proceduresObject(procedureDefs: CompiledProceduresDictionary) = {
    val procedureDefsJs = formatProceduresIncrementals(procedureDefs)
    val propertyFunctionBody =
      s"""|var procs = {};
          |var temp = undefined;
          |$procedureDefsJs
          |return procs;""".stripMargin
    s"(${jsFunction(body = propertyFunctionBody)})()"
  }
}
