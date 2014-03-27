// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import nashorn.Nashorn
import org.scalatest.FunSuite

// just basic smoke tests that basic Tortoise engine functionality is there,
// without involving the Tortoise compiler

class TestEngine extends FunSuite {

  test("can eval a number literal") {
    assertResult(Double.box(2)) {
      val nashorn = new Nashorn
      nashorn.eval("2.0")
    }
  }

  test("empty world") {
    val nashorn = new Nashorn
    nashorn.eval("world = new World(-1, 1, -1, 1)")
    nashorn.eval("world.clearAll()")
    assertResult(Double.box(9)) {
      nashorn.eval("AgentSet.count(world.patches())")
    }
  }

  test("JSON parsing isn't borked for integer keys") {
    val nashorn = new Nashorn
    val test = """[{"0":{"X":0},"2":{"X":0}}]"""
    val escaped = test.replaceAll("\"", "\\\\\"")
    assertResult(test) {
      nashorn.eval(s"""JSON.stringify(Denuller.denull(JSON.parse("$escaped")))""")
    }
  }

}
