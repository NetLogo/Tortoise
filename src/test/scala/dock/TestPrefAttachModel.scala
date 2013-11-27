// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise
package dock

import org.nlogo.util.SlowTest

class TestPrefAttachModel extends DockingSuite with SlowTest {

  test("pref attach") { implicit fixture => import fixture._
    open("models/Sample Models/Networks/Preferential Attachment.nlogo")
    testCommand("resize-world -10 10 -10 10")
    testCommand("setup")
    testCommand("repeat 20 [ go ]")
    testCommand("resize-nodes")
    compare("[ size ] of turtles")
    testCommand("repeat 20 [ go ]")
    testCommand("resize-nodes")
    compare("[ size ] of turtles")
    testCommand("resize-nodes")
    compare("[ size ] of turtles")
  }
}
