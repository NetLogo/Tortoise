// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise
package dock

import org.nlogo.api

class TestMath extends DockingSuite {

  test("sin") { implicit fixture => import fixture._
    for(theta <- -360 to 360 by 5)
      compare(s"sin $theta")
  }

  test("cos") { implicit fixture => import fixture._
    for(theta <- -360 to 360 by 5)
      compare(s"cos $theta")
  }

  test("unary minus") { implicit fixture => import fixture._
    declare("globals [g]")
    testCommand("set g 5")
    compare("(- g)")
    compare("(- (- g))")
  }

  test("mean") { implicit fixture => import fixture._
    compare("mean [1]")
    compare("mean [1 4 9 16]")
  }

  test("mod") { implicit fixture => import fixture._
    declare("globals [g]")
    testCommand("set g 5")
    compare("g mod 3")
    // TODO compare("(- g) mod 3")
    // TODO compare("g mod -3")
  }

  test("sum") { implicit fixture => import fixture._
    declare("to-report compute report sum [pycor] of neighbors end",
      api.WorldDimensions.square(1))
    // first make sure just doing the computation doesn't make the RNG diverge
    testCommand("ask patches [ let s compute ]")
    // might as well check the result too
    testCommand("ask patches [ output-print compute ]")
  }

  test("int") { implicit fixture => import fixture._
    declare("globals [g]")
    testCommand("set g 5.3")
    compare("int g")
    compare("int (g / 2)")
    testCommand("set g -5.3")
    compare("int g")
    compare("int (g / 2)")
  }

  test("precision") { implicit fixture => import fixture._
    compare("precision 12122.4321 2")
    compare("precision 12122.4321 0")
    compare("precision 12122.4321 -2")
    for(_ <- 1 to 20)
      compare("precision (random-float 10.2312 * random-float 23124.25 / random-float 3.24) (random 10 - 5)")
  }

}
