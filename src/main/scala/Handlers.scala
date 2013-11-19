// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ api, compile => ast }

object Handlers {

  def fun(node: ast.AstNode): String =
    s"function() { ${commands(node)} }"

  // The "abstract" syntax trees we get from the front end aren't totally abstract in that they have
  // CommandBlock wrappers around Statements objects and ReporterBlock wrappers around Reporter
  // objects, representing the concrete syntax of square brackets, but at this stage of compilation
  // the brackets are irrelevant.  So when we see a block we just immediately recurse into it.

  def commands(node: ast.AstNode): String =
    node match {
      case block: ast.CommandBlock =>
        commands(block.statements)
      case statements: ast.Statements =>
        statements.map(Prims.generateCommand)
          .filter(_.nonEmpty)
          .mkString("\n")
    }

  def reporter(node: ast.AstNode): String = node match {
    case block: ast.ReporterBlock =>
      reporter(block.app)
    case app: ast.ReporterApp =>
      Prims.reporter(app)
  }

  def literal(x: AnyRef): String = x match {
    case ll: api.LogoList =>
      ll.map(literal).mkString("[", ", ", "]")
    case x =>
      api.Dump.logoObject(x, readable = true, exporting = false)
  }

  // bogus, will need work - ST 9/13/13
  def ident(s: String): String =
    s.replaceAll("-", "_")
     .replaceAll("\\?", "_P")

}
