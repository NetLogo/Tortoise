// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import jsengine.GraalJS
import org.scalatest.FunSuite

class TestEngineType extends FunSuite {

  test("engine name") {
    assert((new GraalJS).jsRuntime.getEngine.getImplementationName.startsWith("Graal"))
  }

}
