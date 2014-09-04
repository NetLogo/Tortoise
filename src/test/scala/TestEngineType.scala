// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import org.scalatest.FunSuite
import jsengine.nashorn.Nashorn

class TestEngineType extends FunSuite {

  test("engine name") {
    assertResult("Oracle Nashorn") {
      (new Nashorn).engine.getFactory.getEngineName
    }
  }

}
