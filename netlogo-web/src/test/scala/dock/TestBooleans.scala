// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

class TestBooleans extends DockingSuite {

  test("not") { implicit fixture => import fixture._
    compare("not true")
    compare("not false")
  }
}
