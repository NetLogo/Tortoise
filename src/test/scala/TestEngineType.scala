// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.scalatest.FunSuite
import rhino.{ Rhino => MRhino }

class TestEngineType extends FunSuite {

  test("engine name") {
    assertResult("Mozilla Rhino") {
      (new MRhino).engine.getFactory.getEngineName
    }
  }

}
