// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import org.nlogo.core.{ Model, View, WorldDimensions }

class TestLabels extends DockingSuite {
  test("turtle label - string") { implicit fixture => import fixture._
    testCommand("""crt 1 [ set label "foo" ]""")
  }
  test("turtle label - number") { implicit fixture => import fixture._
    testCommand("crt 1 [ set label 9 ]")
  }
  test("turtle label - self") { implicit fixture => import fixture._
    testCommand("crt 1 [ set label self ]")
  }
  test("turtle label - list") { implicit fixture => import fixture._
    testCommand("crt 1 [ set label [1 2 3] ]")
  }
  test("patch label - string") { implicit fixture => import fixture._
    testCommand("""ask patch 0 0 [ set plabel "bar" ]""")
  }
  test("patch label - number") { implicit fixture => import fixture._
    testCommand("ask patch 0 0 [ set plabel 9 ]")
  }
  test("patch label - self") { implicit fixture => import fixture._
    testCommand("ask patch 0 0 [ set plabel self ]")
  }
  test("patch label - list") { implicit fixture => import fixture._
    testCommand("ask patch 0 0 [ set plabel [1 2 3] ]")
  }
  test("patch label - mixed") { implicit fixture => import fixture._
    declare(Model(widgets = List(View(dimensions = WorldDimensions(minPxcor = -1, maxPxcor = 1, minPycor = -1, maxPycor = 1)))))
    testCommand("ask n-of 3 patches [ set plabel self ]")
    testCommand("""ask one-of patches with [plabel != ""] [ set plabel "" ]""")
    testCommand("""ask one-of patches with [plabel != ""] [ set plabel "" ]""")
    testCommand("""ask one-of patches with [plabel != ""] [ set plabel "" ]""")
    testCommand("""ask patches [ set plabel "" ]""")
  }
  test("link label - string") { implicit fixture => import fixture._
    testCommand("""crt 2 [ create-links-with other turtles [ set label "foo" ] ]""")
  }
  test("link label - number") { implicit fixture => import fixture._
    testCommand("""crt 2 [ create-links-with other turtles [ set label 9 ] ]""")
  }
  test("link label - self") { implicit fixture => import fixture._
    testCommand("""crt 2 [ create-links-with other turtles [ set label self ] ]""")
  }
  test("link label - list") { implicit fixture => import fixture._
    testCommand("""crt 2 [ create-links-with other turtles [ set label [1 2 3] ] ]""")
  }
}
