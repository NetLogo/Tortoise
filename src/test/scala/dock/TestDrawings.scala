// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise
package dock

class TestDrawings extends DockingSuite {
  test("pen line") { implicit fixture => import fixture._
    testCommand("crt 1")
    testCommand("ask turtles [ pd fd 1 ]")
    testCommand("ask turtles [ fd 5 right 2 fd 2 fd 3 left 10 fd 5 fd 2 ]")
  }
}
