// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import jsengine.Nashorn
import org.scalatest.FunSuite

class TestEngineType extends FunSuite {

  test("engine name") {
    assertResult("Oracle Nashorn") {
      (new Nashorn).engine.getFactory.getEngineName
    }
  }

}
