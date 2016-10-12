// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  JsOps.{ indented, jsFunction }

import
  org.nlogo.core.ProcedureDefinition

import
  ProcedureCompiler.CompiledProceduresDictionary

import
  TortoiseSymbol.JsDeclare

class ProcedureCompiler(handlers: Handlers)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext) {
  def compileProcedures(procedureDefs: Seq[ProcedureDefinition]): CompiledProceduresDictionary =
    procedureDefs.map(compileProcedureDef)

  private def compileProcedureDef(pd:            ProcedureDefinition)
                        (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): (String, Seq[String]) = {
    val originalName = pd.procedure.name
    val safeName = handlers.ident(originalName)
    handlers.resetEveryID(safeName)
    val body =
      if (pd.procedure.isReporter) {
        val unwrappedBody = handlers.commands(pd.statements, false)
        handlers.reporterProcContext(unwrappedBody)
      } else
        handlers.commands(pd.statements, true, true)
    val args = pd.procedure.args.map(handlers.ident)
    val functionJs = s"(${jsFunction(args = args, body = body)})"
    (functionJs, Seq(safeName, originalName).distinct)
  }
}

object ProcedureCompiler {
  type CompiledProceduresDictionary = Seq[(String, Seq[String])]

  def formatProcedures(procedures: CompiledProceduresDictionary): Seq[TortoiseSymbol] =
    Seq(JsDeclare("procedures", proceduresObject(procedures), Seq("workspace", "world")))

  private def proceduresObject(procedureDefs: CompiledProceduresDictionary) = {
    val procedureDefsJs =
      procedureDefs.map {
        case (js, names) =>
          names.map(name => s"""procs["$name"] = temp;""").mkString(s"temp = $js;\n", "\n", "")
      }.mkString("\n")
    val propertyFunctionBody =
      s"""|var procs = {};
          |var temp = undefined;
          |$procedureDefsJs
          |return procs;""".stripMargin
    s"(${jsFunction(body = propertyFunctionBody)})()"
  }
}
