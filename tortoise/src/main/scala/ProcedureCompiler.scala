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

class ProcedureCompiler(handlers: Handlers)(implicit compilerFlags: CompilerFlags) {
  def compileProcedures(procedureDefs: Seq[ProcedureDefinition]): CompiledProceduresDictionary =
    procedureDefs.map(compileProcedureDef)

  private def compileProcedureDef(pd:            ProcedureDefinition)
                        (implicit compilerFlags: CompilerFlags): (String, Map[String, String]) = {
    val originalName = pd.procedure.name
    val safeName = handlers.ident(originalName)
    handlers.resetEveryID(safeName)
    val body = handlers.commands(pd.statements)
    val args = pd.procedure.args.map(handlers.ident)
    val functionJavascript = s"var $safeName = ${jsFunction(args = args, body = body)};"
    if (safeName != originalName)
      (functionJavascript, Map(originalName -> safeName, safeName -> safeName))
    else
      (functionJavascript, Map(safeName -> safeName))
  }
}

object ProcedureCompiler {
  type CompiledProceduresDictionary = Seq[(String, Map[String, String])]

  def formatProcedures(procedures: CompiledProceduresDictionary): Seq[TortoiseSymbol] =
    Seq(JsDeclare("procedures", proceduresObject(procedures), Seq("workspace", "world")))

  private def proceduresObject(procedureDefs: CompiledProceduresDictionary) = {
    val functionDeclarations = procedureDefs.map(_._1).mkString("\n")
    val propertyDeclarations = procedureDefs.map(_._2)
      .foldLeft(Map.empty[String, String])(_ ++ _)
      .toSeq.sortBy(_._1)
      .map(prop => s""""${prop._1}":${prop._2}""").mkString(",\n")
    val propertyFunctionBody =
    s"""|$functionDeclarations
        |return {
        |${indented(propertyDeclarations)}
        |};""".stripMargin
    s"(${jsFunction(body = propertyFunctionBody)})()"
  }
}
