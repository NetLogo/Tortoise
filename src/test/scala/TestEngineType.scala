// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.scalatest.FunSuite
import rhino.Rhino

class TestEngineType extends FunSuite {

  test("engine name") {
    assertResult("Oracle Nashorn") {
      (new Rhino).engine.getFactory.getEngineName
    }
  }

}
