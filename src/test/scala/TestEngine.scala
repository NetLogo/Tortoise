// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import rhino.{ Rhino => MRhino }
import org.scalatest.FunSuite

// just basic smoke tests that basic Tortoise engine functionality is there,
// without involving the Tortoise compiler

class TestEngine extends FunSuite {

  test("can eval a number literal") {
    assertResult(Double.box(2)) {
      val rhino = new MRhino
      rhino.eval("2.0")
    }
  }

  test("empty world") {
    val rhino = new MRhino
    rhino.eval("world = new World(-1, 1, -1, 1)")
    rhino.eval("world.clearAll()")
    assertResult(Double.box(9)) {
      rhino.eval("AgentSet.count(world.patches())")
    }
  }

}
