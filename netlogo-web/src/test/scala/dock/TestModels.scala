// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import
  org.nlogo.tortoise.tags.SlowTest

import
  org.nlogo.tortoise.compiler.Model

class TestModels extends DockingSuite {
  for(model <- Model.models)
    test(model.name, SlowTest) { implicit fixture => import fixture._
      open(model.path, model.dimensions)
      testCommand(model.setup)
      for(_ <- 1 to model.repetitions)
        testCommand(model.go)
      model.metrics.foreach(compare)
    }
}
