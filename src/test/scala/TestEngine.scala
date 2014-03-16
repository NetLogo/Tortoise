// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import rhino.Rhino
import org.scalatest.FunSuite

// just basic smoke tests that basic Tortoise engine functionality is there,
// without involving the Tortoise compiler

class TestEngine extends FunSuite {

  test("can eval a number literal") {
    assertResult(Double.box(2)) {
      val rhino = new Rhino
      rhino.eval("2.0")
    }
  }

  test("empty world") {
    val rhino = new Rhino
    rhino.eval("world = new World(-1, 1, -1, 1)")
    rhino.eval("world.clearAll()")
    assertResult(Double.box(9)) {
      rhino.eval("AgentSet.count(world.patches())")
    }
  }

  test("JSON parsing isn't borked for integer keys") {
    val rhino = new Rhino
    val test = """[{"0":{"X":0},"2":{"X":0}}]"""
    val escaped = test.replaceAll("\"", "\\\\\"")
    assertResult(test) {
      rhino.eval(s"""JSON.stringify(Denuller.denull(JSON.parse("$escaped")))""")
    }
  }

}
