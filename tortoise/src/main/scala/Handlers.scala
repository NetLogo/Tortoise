// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.core.{ AstNode, CommandBlock, Dump, LogoList, Nobody, Pure, ReporterApp,
                   ReporterBlock, Statements, Token }

trait Handlers extends EveryIDProvider with JsOps {

  def prims: Prims

  def fun(    node:          AstNode,
              isReporter:    Boolean = false,
              isTask:        Boolean = false)
    (implicit compilerFlags: CompilerFlags): String = {
    val taskHeader =
      if (isTask)
        "var taskArguments = arguments;\n"
      else
        ""
    val body = taskHeader +
      (if (isReporter)
        s"return ${reporter(node)};"
      else
        commands(node))
    def isTrivialReporter(node: AstNode): Boolean =
      node match {
        case block: ReporterBlock =>
          isTrivialReporter(block.app)
        case app: ReporterApp =>
          app.args.isEmpty && app.reporter.isInstanceOf[Pure]
        case _ =>
          false
      }
    if (body.isEmpty)
      jsFunction()
    else
      jsFunction(body = body)
  }

  // The "abstract" syntax trees we get from the front end aren't totally abstract in that they have
  // CommandBlock wrappers around Statements objects and ReporterBlock wrappers around Reporter
  // objects, representing the concrete syntax of square brackets, but at this stage of compilation
  // the brackets are irrelevant.  So when we see a block we just immediately recurse into it.

  def commands(node: AstNode)(implicit compilerFlags: CompilerFlags): String =
    node match {
      case block: CommandBlock =>
        commands(block.statements)
      case statements: Statements =>
        statements.stmts.map(prims.generateCommand)
          .filter(_.nonEmpty)
          .mkString("\n")
    }

  def reporter(node: AstNode)(implicit compilerFlags: CompilerFlags): String = node match {
    case block: ReporterBlock =>
      reporter(block.app)
    case app: ReporterApp =>
    prims.reporter(app)
  }

  def literal(obj: AnyRef): String = obj match {
    case ll: LogoList =>
      jsArrayString(ll.map(literal))
    case Nobody =>
      "Nobody"
    case x =>
      Dump.logoObject(x, readable = true, exporting = false)
  }

  def ident(s: String): String = JSIdentProvider(s)

  def unusedVarname(token: Token, hint: String = ""): String =
    s"_${hint}_${token.start}_${token.end}"

}
