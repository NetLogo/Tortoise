// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.nlogo.core.{ FrontEndInterface, Program },
    FrontEndInterface.NoProcedures

// Code inside a `run` string compiles inside a wrapper of our own making, so the source positions it carries are
// positions in that string, not in the model.  And they escape to the UI as model positions: Galapagos counts newlines
// up to `sourceStart` to get a line number, then selects `sourceStart`..`sourceEnd` in the code editor.  So we report
// an error from a run string at the `run` call instead.  -Jeremy B August 2026
class TestRunStringErrors extends SimpleSuite {

  private def positionsOfError(fixture: SimpleFixture, command: String): String = {
    val js = compiler.compileRawCommands(command, NoProcedures, Program.empty())
    fixture.eval(s"""|(function() {
                     |  try { $js }
                     |  catch (ex) {
                     |    if (ex.sourceStart === undefined) { return "no positions: " + ex.message; }
                     |    return [ex.sourceStart._value, ex.sourceEnd._value].toString();
                     |  }
                     |  return "no error";
                     |})()""".stripMargin).toString
  }

  test("a compile error in a run string is reported at the run call") {
    fixture =>
      // `run` starts at 14 in `ask patches [ run "fd 1" ]`
      assertResult("14,17")(positionsOfError(fixture, """ask patches [ run "fd 1" ]"""))
  }

  test("a runtime error in a run string is reported at the run call") {
    fixture =>
      fixture.evalCommand("create-turtles 1")
      assertResult("14,17")(positionsOfError(fixture, """ask turtles [ run "fd 1 / 0" ]"""))
  }

  test("a runtime error in a runresult string is reported at the runresult call") {
    fixture =>
      // `runresult` starts at 9 in `__ignore runresult "1 / 0"`
      assertResult("9,18")(positionsOfError(fixture, """__ignore runresult "1 / 0""""))
  }

  test("an error outside a run string keeps its own positions") {
    fixture =>
      // `/` starts at 11 in `__ignore 1 / 0`, a position in the command itself and not in the
      // `to __evaluator [] __observercode ` wrapper it compiles inside.
      assertResult("11,12")(positionsOfError(fixture, """__ignore 1 / 0"""))
  }

}
