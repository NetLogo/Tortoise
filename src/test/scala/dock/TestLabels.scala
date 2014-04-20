// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise
package dock

class TestLabels extends DockingSuite {
  test("turtle label 0") { implicit fixture => import fixture._
    testCommand("""crt 1 [ set label "foo" ]""")
  }
  test("turtle label 1") { implicit fixture => import fixture._
    testCommand("crt 1 [ set label 9 ]")
  }
  test("turtle label 2") { implicit fixture => import fixture._
    testCommand("crt 1 [ set label self ]")
  }
  test("patch label 0") { implicit fixture => import fixture._
    testCommand("""ask patch 0 0 [ set plabel "bar" ]""")
  }
  test("patch label 1") { implicit fixture => import fixture._
    testCommand("ask patch 0 0 [ set plabel 9 ]")
  }
  test("patch label 2") { implicit fixture => import fixture._
    testCommand("ask patch 0 0 [ set plabel self ]")
  }
}
