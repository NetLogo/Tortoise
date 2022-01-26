// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import jsengine.GraalJS
import org.scalatest.funsuite.AnyFunSuite

class TestEngineType extends AnyFunSuite {

  test("engine name") {
    assert((new GraalJS).jsRuntime.getEngine.getImplementationName.startsWith("Graal"))
  }

}
