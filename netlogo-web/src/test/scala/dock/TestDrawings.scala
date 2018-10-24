// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import org.nlogo.core.{ Model, View, WorldDimensions }

class TestDrawings extends DockingSuite {

  test("pen line") { implicit fixture => import fixture._
    testCommand("crt 1")
    testCommand("ask turtles [ pd fd 1 ]")
    testCommand("ask turtles [ pd right 90 bk 2 ]")
    testCommand("ask turtles [ pd left 90 jump 2 ]")
    testCommand("ask turtles [ pd left 90 jump -1.5 ]")
    testCommand("ask turtles [ fd 5 right 2 fd 2 fd 3 left 10 fd 5 fd 2 ]")
    testCommand("ask turtles [ set heading 30 jump 50 ]")
  }

  test("setxy lines with wrapping") { implicit fixture => import fixture._
    declare(Model(widgets = List(View(dimensions = WorldDimensions(minPxcor = -10, maxPxcor = 10, minPycor = -10, maxPycor = 10, 12.0, true, true)))))
    testCommand("crt 1")
    testCommand("ask turtles [ pu setxy 8 0 pd setxy -8 0 ]")
    testCommand("ask turtles [ pu setxy 8 0 pd setxy 13 0 ]")
    testCommand("ask turtles [ pu setxy 9 9.5 pd setxy -8.5 -8 ]")
    testCommand("ask turtles [ pu setxy 8 0 pd set xcor -8 ]")
    testCommand("ask turtles [ pu setxy 8 0 pd set xcor 13 ]")
    testCommand("ask turtles [ pu setxy 0 8 pd set ycor -8 ]")
    testCommand("ask turtles [ pu setxy 0 8 pd set ycor 13 ]")
  }

  test("setxy lines without wrapping") { implicit fixture => import fixture._
    declare(Model(widgets = List(View(dimensions = WorldDimensions(minPxcor = -10, maxPxcor = 10, minPycor = -10, maxPycor = 10, 12.0, false, false)))))
    testCommand("crt 1")
    testCommand("ask turtles [ pu setxy 8 0 pd setxy -8 0 ]")
    testCommand("ask turtles [ pu setxy 8 0 pd setxy 13 0 ]")
    testCommand("ask turtles [ pu setxy 9 9.5 pd setxy -8.5 -8 ]")
    testCommand("ask turtles [ pu setxy 8 0 pd set xcor -8 ]")
    testCommand("ask turtles [ pu setxy 8 0 pd set xcor 13 ]")
    testCommand("ask turtles [ pu setxy 0 8 pd set ycor -8 ]")
    testCommand("ask turtles [ pu setxy 0 8 pd set ycor 13 ]")
  }

  test("turtle stamps") { implicit fixture => import fixture._
    testCommand("crt 1 [ stamp fd 1 stamp ]")
    testCommand("crt 1 [ stamp fd 1 stamp ]")
    testCommand("ask turtles [ set heading random 360 fd 10 stamp fd 5 stamp fd -5 stamp ]")
  }

  test("link stamps") { implicit fixture => import fixture._
    testCommand("crt 2")
    testCommand("ask one-of turtles [create-link-with one-of other turtles]")
    testCommand("ask links [ stamp ]")
    testCommand("ask links [ stamp ]")
    testCommand("ask turtles [ fd 10 ]")
    testCommand("ask links [ stamp ]")
    testCommand("ask turtles [ right 20 fd 5 ]")
    testCommand("ask links [ stamp ]")
    testCommand("ask turtles [ right 20 fd 5 ]")
    testCommand("ask links [ stamp ]")
  }

  test("drawing layer chaos") { implicit fixture => import fixture._

    declare("""|to raise-hell
               |  let r (random 5)
               |  if-else r = 0 [
               |    if-else pen-mode = "down" [ pen-up ] [ pen-down ]
               |  ] [
               |    if-else r = 1 [
               |      pen-erase
               |    ] [
               |      if-else r = 2 [
               |        stamp
               |      ] [
               |        if-else r = 3 [
               |          stamp-erase
               |        ] [
               |          right 35
               |        ]
               |      ]
               |    ]
               |  ]
               |  fd 1
               |end
               |
               |to go
               |  if random 30 = 0 [ clear-drawing ]
               |  ask turtles [ raise-hell ]
               |end
               |""".stripMargin)

    testCommand("crt 30")

    for (_ <- 1 to 100)
      testCommand("go")

  }

}
