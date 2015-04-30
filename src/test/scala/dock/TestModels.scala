// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise
package dock

import org.nlogo.util.SlowTest

class TestModels extends DockingSuite with SlowTest {
  for(model <- Model.models)
    test(model.name) { implicit fixture => import fixture._
      open(model.path, model.dimensions)
      testCommand(model.setup)
      for(_ <- 1 to model.repetitions)
        testCommand(model.go)
      model.metrics.foreach(compare)
    }
}
