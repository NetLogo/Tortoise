// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.{ api, core },
    api.Dump,
    core.{ AstNode, CommandBlock, LogoList, Nobody, Pure, ReporterApp, ReporterBlock, Statements, Token }

trait Handlers extends EveryIDProvider {

  def prims: Prims

  def fun(node: AstNode, isReporter: Boolean = false, isTask: Boolean = false): String = {
    val taskHeader =
      if (isTask)
        "var taskArguments = arguments;\n"
      else
        ""
    val body = taskHeader +
      (if (isReporter)
         "return " + reporter(node) + ";"
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
      "function() {}"
    else if (isTrivialReporter(node))
      s"function() { $body }"
    else
      s"""|function() {
          |${indented(body)}
          |}""".stripMargin
  }

  // The "abstract" syntax trees we get from the front end aren't totally abstract in that they have
  // CommandBlock wrappers around Statements objects and ReporterBlock wrappers around Reporter
  // objects, representing the concrete syntax of square brackets, but at this stage of compilation
  // the brackets are irrelevant.  So when we see a block we just immediately recurse into it.

  def commands(node: AstNode): String =
    node match {
      case block: CommandBlock =>
        commands(block.statements)
      case statements: Statements =>
        statements.stmts.map(prims.generateCommand)
          .filter(_.nonEmpty)
          .mkString("\n")
    }

  def reporter(node: AstNode): String = node match {
    case block: ReporterBlock =>
      reporter(block.app)
    case app: ReporterApp =>
    prims.reporter(app)
  }

  def literal(obj: AnyRef): String = obj match {
    case ll: LogoList =>
      ll.map(literal).mkString("[", ", ", "]")
    case Nobody =>
      "Nobody"
    case x =>
      Dump.logoObject(x, readable = true, exporting = false)
  }

  def indented(s: String): String =
    s.lines.map("  " + _).mkString("\n")

  // bogus, will need work - ST 9/13/13
  def ident(name: String): String = {
    def initialUpper(s: String): String =
      java.lang.Character.toUpperCase(s.head) + s.tail
    def initialLower(s: String): String =
      java.lang.Character.toLowerCase(s.head) + s.tail
    val camel = initialLower(name.toLowerCase.split('-').map(initialUpper).mkString)
    camel
      .replaceAll("\\?", "_p")
      .replaceAll("%", "_percent_")
  }

  def unusedVarname(token: Token, hint: String = ""): String = {
    s"_${hint}_${token.start}_${token.end}"
  }
}
