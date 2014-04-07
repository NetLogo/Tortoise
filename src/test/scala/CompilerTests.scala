// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.scalatest.FunSuite
import org.nlogo.api

// Mostly we test the compiler by running the results. But at least, occasionally we're interested
// in *exactly* what the JavaScript output looks like.

class CompilerTests extends FunSuite {

  /// compileReporter

  private def wrapReporter(reporter: String): String =
    s"Procedures.stoppably(function() { return $reporter; })"

  private def wrapCommand(block: String): String =
    s"Procedures.stoppably(function() {$block})"

  test("literals") {
    import Compiler.{compileReporter => compile}
    assertResult(wrapReporter("1"))(
      compile("1"))
    assertResult(wrapReporter("1"))(
      compile("1.0"))
    assertResult(wrapReporter("[]"))(
      compile("[]"))
    assertResult(wrapReporter("[1, [2], 3]"))(
      compile("[1 [2] 3]"))
  }

  test("arithmetic expressions") {
    import Compiler.{compileReporter => compile}
    assertResult(wrapReporter("(2 + 2)"))(
      compile("2 + 2"))
    assertResult(wrapReporter("((1 + 2) * 3)"))(
      compile("(1 + 2) * 3"))
    assertResult(wrapReporter("(1 + (2 * 3))"))(
      compile("1 + 2 * 3"))
    assertResult(wrapReporter("((1 + 2) + (3 + 4))"))(
      compile("(1 + 2) + (3 + 4)"))
  }

  test("equality"){
    import Compiler.{compileReporter => compile}
    assertResult(wrapReporter("Prims.equality(2, 2)"))(compile("2 = 2"))
    assertResult(wrapReporter("""Prims.equality("hello", "hello")"""))(compile(""""hello" = "hello""""))
  }

  test("reporters: word") {
    import Compiler.{compileReporter => compile}
    val input = "(word 1 2 3)"
    val expected = """(Dump("") + Dump(1) + Dump(2) + Dump(3))"""
    assertResult(wrapReporter(expected))(compile(input))
  }

  test("reporters: keep literal reporter on one line") {
    import Compiler.{compileReporter => compile}
    val input = "[0] of turtles"
    val expected = "AgentSet.of(world.turtles(), function() { return 0 })"
    assertResult(wrapReporter(expected))(compile(input))
  }

  test("reporters: map") {
    import Compiler.{compileReporter => compile}
    val input = "map [? * 2] [3 4]"
    val expected = """|Tasks.map(Tasks.reporterTask(function() {
                      |  return (arguments[0] * 2)
                      |}), [3, 4])""".stripMargin
    assertResult(wrapReporter(expected))(compile(input))
  }

  test("reporters: runresult") {
    import Compiler.{compileReporter => compile}
    val input = "(runresult task [?1 * ?2] 3 4)"
    val expected = """|(Tasks.reporterTask(function() {
                      |  return (arguments[0] * arguments[1])
                      |}))(3, 4)""".stripMargin
    assertResult(wrapReporter(expected))(compile(input))
  }

  // compileCommands

  test("commands: let") {
    import Compiler.{compileCommands => compile}
    val input = "let x 5 output-print x"
    val expected = """|var x = 5;
                      |Prims.outputPrint(x);""".stripMargin
    assertResult(wrapCommand(expected))(compile(input))
  }

  test("commands: ask simple") {
    import Compiler.{compileCommands => compile}
    val input = "ask turtles [fd 1]"
    val expected =
      """|AgentSet.ask(world.turtles(), true, function() {
         |  Prims.fd(1);
         |});""".stripMargin
    assertResult(wrapCommand(expected))(compile(input))
  }

  test("commands: ask patches with variable") {
    import Compiler.{compileCommands => compile}
    val input = "ask patches [output-print pxcor]"
    val expected =
      """|AgentSet.ask(world.patches(), true, function() {
         |  Prims.outputPrint(AgentSet.getPatchVariable(0));
         |});""".stripMargin
    assertResult(wrapCommand(expected))(compile(input))
  }

  test("commands: with") {
    import Compiler.{compileCommands => compile}
    val input = "ask patches with [pxcor = 1] [output-print pycor]"
    val expected =
       """|AgentSet.ask(AgentSet.agentFilter(world.patches(), function() {
          |  return Prims.equality(AgentSet.getPatchVariable(0), 1)
          |}), true, function() {
          |  Prims.outputPrint(AgentSet.getPatchVariable(1));
          |});""".stripMargin
    assertResult(wrapCommand(expected))(compile(input))
  }

  test("indentation 1") {
    import Compiler.{compileCommands => compile}
    val input = "ask turtles [ ask patches [ ask turtles [ fd 1 ] ] ]"
    val expected =
      """|AgentSet.ask(world.turtles(), true, function() {
         |  AgentSet.ask(world.patches(), true, function() {
         |    AgentSet.ask(world.turtles(), true, function() {
         |      Prims.fd(1);
         |    });
         |  });
         |});""".stripMargin
    assertResult(wrapCommand(expected))(compile(input))
  }

  test("indentation 2") {
    import Compiler.{compileCommands => compile}
    val input = "if any? turtles [ if not any? links [ fd 1 ] ]"
    val expected =
      """|if (AgentSet.any(world.turtles())) {
         |  if (!(AgentSet.any(world.links()))) {
         |    Prims.fd(1);
         |  }
         |}""".stripMargin
    assertResult(wrapCommand(expected))(compile(input))
  }

  /// compileProcedures

  test("command procedure") {
    import Compiler.{compileProcedures => compile}
    val input = "to foo output-print 5 end"
    val fooBody = wrapCommand(
      """
        |    Prims.outputPrint(5);
        |  """.stripMargin
    )
    val expected =
      s"""|world = new World(0, 0, 0, 0, 12.0, true, true, {}, {}, 0);
          |
          |function foo() {
          |  return $fooBody;
          |}
          |""".stripMargin
    assertResult(expected)(compile(input)._1)
  }

  test("globals: accessed by number") {
    import Compiler.{compileProcedures => compile}
    val input = "globals [x y z] to foo-bar? output-print z output-print y output-print x end"
    val fooBar_pBody = wrapCommand(
       """
         |    Prims.outputPrint(Globals.getGlobal(2));
         |    Prims.outputPrint(Globals.getGlobal(1));
         |    Prims.outputPrint(Globals.getGlobal(0));
         |  """.stripMargin
    )
    val expected =
     s"""|Globals.init(3);
         |world = new World(0, 0, 0, 0, 12.0, true, true, {}, {}, 0);
         |
         |function fooBar_p() {
         |  return $fooBar_pBody;
         |}
         |""".stripMargin
    assertResult(expected)(compile(input)._1)
  }

}
