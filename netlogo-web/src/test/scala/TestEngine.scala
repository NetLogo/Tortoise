// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import jsengine.GraalJS
import org.scalatest.FunSuite

// just basic smoke tests that basic Tortoise engine functionality is there,
// without involving the Tortoise compiler

class TestEngine extends FunSuite {

  test("can eval a number literal") {
    assertResult(Double.box(2)) {
      val jsRuntime = new GraalJS
      jsRuntime.eval("2.0")
    }
  }

  test("empty world") {
    val jsRuntime = new GraalJS
    jsRuntime.setupTortoise
    jsRuntime.eval("""var workspace = tortoise_require('engine/workspace')({})([])([], [])('')({})([])([], [], [], -1, 1, -1, 1, 1, true, true);
                   |var SelfManager = workspace.selfManager;
                   |var Extensions  = {};
                   |var world       = workspace.world;""".stripMargin)
    jsRuntime.eval("world.clearAll()")
    assertResult(Double.box(9)) {
      jsRuntime.eval("world.patches().size()")
    }
  }

  test("JSON parsing isn't borked for integer keys") {
    val jsRuntime = new GraalJS
    val test = """[{"0":{"X":0},"2":{"X":0}}]"""
    val escaped = test.replaceAll("\"", "\\\\\"")
    assertResult(test) {
      jsRuntime.eval(s"""JSON.stringify(JSON.parse("$escaped"))""")
    }
  }

}
