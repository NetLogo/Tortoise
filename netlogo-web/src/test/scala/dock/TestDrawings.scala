// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

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
