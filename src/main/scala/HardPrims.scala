// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ compile => ast, nvm, prim }

object HardPrims {

  def generateWhile(w: ast.Statement): String = {
    val pred = Compiler.genReporterBlock(w.args.head)
    val body = Compiler.genCommandBlock(w.args.tail.head)
    s"""while ($pred) {
      |$body
      |}""".stripMargin
  }

  def generateIf(s: ast.Statement): String = {
    val pred = Compiler.genReporterApp(s.args.head)
    val body = Compiler.genCommandBlock(s.args.tail.head)
    s"""if ($pred) {
      |$body
      |}""".stripMargin
  }

  def generateIfElse(s: ast.Statement): String = {
    val pred      = Compiler.genReporterApp(s.args.head)
    val thenBlock = Compiler.genCommandBlock(s.args.tail.head)
    val elseBlock = Compiler.genCommandBlock(s.args.tail.tail.head)
    s"""if ($pred) {
      |$thenBlock
      |} else {
      |$elseBlock
      |}""".stripMargin
  }

  def generateAsk(s: ast.Statement, shuffle: Boolean): String = {
    val agents = Compiler.genReporterApp(s.args.head)
    val body   = fun(Compiler.genCommandBlock(s.args.tail.head))
    s"AgentSet.ask($agents, $shuffle, $body);"
  }

  def generateCreateLink(s: ast.Statement, name: String): String = {
    import org.nlogo.prim._
    val other = Compiler.genReporterApp(s.args.head)
    // This is so that we don't shuffle unnecessarily.  FD 10/31/2013
    val nonEmptyCommandBlock =
      s.args.tail.head.asInstanceOf[ast.CommandBlock]
        .statements.nonEmpty
    val body = fun(Compiler.genCommandBlock(s.args.tail.head))
    s"""AgentSet.ask(AgentSet.$name($other), $nonEmptyCommandBlock, $body);"""
  }

  def generateCreateTurtles(s: ast.Statement, ordered: Boolean): String = {
    import org.nlogo.prim._
    val n = Compiler.genReporterApp(s.args.head)
    val name = if (ordered) "createorderedturtles" else "createturtles"
    val breed =
      s.command match {
        case x: _createturtles => x.breedName
        case x: _createorderedturtles => x.breedName
        case x => throw new IllegalArgumentException("How did you get here with class of type " + x.getClass.getName)
      }
    val body = fun(Compiler.genCommandBlock(s.args.tail.head))
    s"""AgentSet.ask(world.$name($n, "$breed"), true, $body);"""
  }

  def generateSprout(s: ast.Statement): String = {
    val n = Compiler.genReporterApp(s.args.head)
    val body = fun(Compiler.genCommandBlock(s.args.tail.head))
    val breedName = s.command.asInstanceOf[prim._sprout].breedName
    s"""AgentSet.ask(Prims.sprout($n, "$breedName"), true, $body);"""
  }

  def generateHatch(s: ast.Statement, breedName: String): String = {
    val n = Compiler.genReporterApp(s.args.head)
    val body = fun(Compiler.genCommandBlock(s.args.tail.head))
    s"""AgentSet.ask(Prims.hatch($n, "$breedName"), true, $body);"""
  }

  def fun(body: String) = s"function(){ $body }"

}
