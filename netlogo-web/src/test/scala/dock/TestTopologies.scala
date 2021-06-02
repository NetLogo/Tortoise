// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import org.nlogo.core.{ Model, View, WorldDimensions }

class TestTopologies extends DockingSuite {

  val default = View(dimensions = WorldDimensions(minPxcor = -8, maxPxcor = 9, minPycor = -10, maxPycor = 11))

  def inAllTopologies(name: String, decls: String = "", baseView: View = default)(fn: DockingFixture => Unit) {
    case class Topo(name: String, wrapX: Boolean, wrapY: Boolean) {
      val view = baseView.copy(dimensions = baseView.dimensions.copy(wrappingAllowedInX = wrapX, wrappingAllowedInY = wrapY))
    }
    val topos = Seq(
      Topo("torus", true, true),
      Topo("vertcyl", true, false),
      Topo("horizcyl", false, true),
      Topo("box", false, false)
    )
    for(topo <- topos)
      test(s"$name in ${topo.name}") { fixture =>
        fixture.declare(Model(code = decls, widgets = List(topo.view)))
        fn(fixture)
      }
  }

  inAllTopologies("distance") {
    implicit fixture => import fixture._
    testCommand("cro 8")
    testCommand("ask turtles [ fd 5 ]")
    testCommand("ask turtles [ output-print distance turtle 0 ]")
    testCommand("ask turtles [ output-print distance patch 0 0 ]")
    testCommand("ask patches [ output-print distance turtle 0 ]")
    testCommand("ask patches [ output-print distance patch 0 0 ]")
    testCommand("ask turtles [ fd 3 ]")
    testCommand("ask turtles [ output-print distance turtle 0 ]")
    testCommand("ask turtles [ output-print distance patch 0 0 ]")
    testCommand("ask patches [ output-print distance turtle 0 ]")
  }

  inAllTopologies("distancexy") {
    implicit fixture => import fixture._
    testCommand("cro 8")
    testCommand("ask turtles [ fd 1 ]")
    testCommand("ask turtles [ output-print distancexy 1.2 2.3 ]")
    testCommand("ask patches [ output-print distancexy 1.2 2.3 ]")
    testCommand("ask turtles [ fd 5 ]")
    testCommand("ask turtles [ output-print distancexy -2.2 -5.3 ]")
  }

  inAllTopologies("setxy wraps") {
    implicit fixture => import fixture._
    testCommand("crt 20")
    for (i <- 0 to 19)
      testCommand(s"ask turtle $i [ setxy (random 30 - 15) (random 30 - 15) ]")
  }

  inAllTopologies("set xcor wraps") {
    implicit fixture => import fixture._
    testCommand("crt 20")
    for (i <- 0 to 19)
      testCommand(s"ask turtle $i [ set xcor (random 30 - 15) ]")
  }

  inAllTopologies("set ycor wraps") {
    implicit fixture => import fixture._
    testCommand("crt 20")
    for (i <- 0 to 19)
      testCommand(s"ask turtle $i [ set ycor (random 30 - 15) ]")
  }

  inAllTopologies("edge wrapping") {
    implicit fixture => import fixture._
    testCommand("cro 20")
    testCommand("ask turtles [ fd 14 ]")
  }

  inAllTopologies("diffuse", decls = "patches-own [chemical]") {
    implicit fixture => import fixture._
    testCommand("ask patches [ set chemical (random 168) / ((random 24) + 1) ]")
    compare("[ chemical ] of patches")
    testCommand("diffuse chemical 0.6")
    compare("[ chemical ] of patches")
    testCommand("diffuse chemical 0.6")
    compare("[ chemical ] of patches")
    testCommand("diffuse chemical 0.6")
    compare("[ chemical ] of patches")
    testCommand("diffuse chemical .99")
    compare("[ chemical ] of patches")
  }

  inAllTopologies("neighbors") {
    implicit fixture => import fixture._
    testCommand("""ask patches [ ask neighbors [ output-print self ]]""")
    testCommand("""ask patches [ ask neighbors4 [ output-print self ]]""")
    testCommand("ask patches [ sprout 1 ]")
    testCommand("""ask turtles [ ask neighbors4 [ output-print self ]]""")
  }

  inAllTopologies("face turtle", baseView = View.square(4)) {
    implicit fixture => import fixture._
    testCommand("ask patches [ sprout 1 ]")
    for (i <- 1 to 80)
      testCommand(s"ask turtles [ face turtle $i ]")
  }

  inAllTopologies("face patch", baseView = View.square(4)) {
    implicit fixture => import fixture._
    testCommand("ask patches [ sprout 1 ]")
    for (x <- -4 to 4)
      for (y <- -4 to 4)
        testCommand(s"ask turtles [ face patch $x $y ]")
  }

  inAllTopologies("facexy", baseView = View.square(4)) {
    implicit fixture => import fixture._
    testCommand("ask patches [ sprout 1 ]")
    for (_ <- 0 to 10)
      testCommand("ask turtles [ facexy ((random 8) / ((random 8) + 1) - 4) ((random 8) / ((random 8) + 1) - 4) ]")
  }

  inAllTopologies("link wraps", baseView = View.square(4)) {
    implicit fixture => import fixture._
    testCommand("ask patch 3 0 [ sprout 1 ]")
    testCommand("ask patch -3 0 [ sprout 1 ]")
    testCommand("ask patch 0 -3 [ sprout 1 ]")
    testCommand("ask patch 0 0 [ sprout 1 ]")
    testCommand("ask patch 0 3 [ sprout 1 ]")
    testCommand("ask turtles [ create-links-with other turtles ]")
    testCommand("ask turtles [ set xcor xcor - 1 ]")
  }

  inAllTopologies("in-radius turtles", baseView = View(dimensions = WorldDimensions(minPxcor = -4, maxPxcor = 3, minPycor = -2, maxPycor = 6))) {
    implicit fixture => import fixture._
    testCommand("crt 50 [ setxy random-xcor random-ycor ]")
    testCommand("ask turtles [ output-print self let radius random 10 output-print radius output-print [ who ] of turtles in-radius radius ]")
    testCommand("ask turtles [ output-print self let radius random-float 17.3934 output-print radius output-print [ who ] of turtles in-radius radius ]")
  }

  inAllTopologies("in-radius turtles seeking patches", baseView = View(dimensions = WorldDimensions(minPxcor = -4, maxPxcor = 3, minPycor = -2, maxPycor = 6))) {
    implicit fixture => import fixture._
    testCommand("crt 50 [ setxy random-xcor random-ycor ]")
    testCommand("ask turtles [ output-print self let radius random 10 output-print radius output-print [ list pxcor pycor ] of patches in-radius radius ]")
    testCommand("ask turtles [ output-print self let radius random-float 7.3934 output-print radius output-print [ list pxcor pycor ] of patches in-radius radius ]")
  }

  inAllTopologies("in-radius patches", baseView = View(dimensions = WorldDimensions(minPxcor = -4, maxPxcor = 3, minPycor = -2, maxPycor = 6))) {
    implicit fixture => import fixture._
    testCommand("ask n-of 10 patches [ output-print self let radius random 10 output-print radius output-print [ list pxcor pycor ] of patches in-radius radius ]")
    testCommand("ask n-of 10 patches [ output-print self let radius random-float 17.3934 output-print radius output-print [ list pxcor pycor ] of patches in-radius radius ]")
  }

  inAllTopologies("in-radius patches seeking turtles", baseView = View(dimensions = WorldDimensions(minPxcor = -4, maxPxcor = 3, minPycor = -2, maxPycor = 6))) {
    implicit fixture => import fixture._
    testCommand("crt 50 [ setxy random-xcor random-ycor ]")
    testCommand("ask n-of 10 patches [ output-print self let radius random 10 output-print radius output-print [ who ] of turtles in-radius radius ]")
    testCommand("ask n-of 10 patches [ output-print self let radius random-float 7.3934 output-print radius output-print [ who ] of turtles in-radius radius ]")
  }

  inAllTopologies("in-radius turtle breeds", decls = "breed [mice mouse] breed [frogs frog]", baseView = View(dimensions = WorldDimensions(minPxcor = -4, maxPxcor = 3, minPycor = -2, maxPycor = 6))) {
    implicit fixture => import fixture._
    testCommand("create-mice 50 [ setxy random-xcor random-ycor ]")
    testCommand("create-frogs 50 [ setxy random-xcor random-ycor ]")
    testCommand("ask n-of 25 mice [ output-print self let radius random 10 output-print radius output-print [ who ] of mice in-radius radius ]")
    testCommand("ask n-of 25 frogs [ output-print self let radius random-float 17.3934 output-print radius output-print [ who ] of frogs in-radius radius ]")
    testCommand("ask n-of 25 mice [ output-print self let radius random 10 output-print radius output-print [ who ] of turtles in-radius radius ]")
    testCommand("ask n-of 25 frogs [ output-print self let radius random-float 17.3934 output-print radius output-print [ who ] of mice in-radius radius ]")
    testCommand("ask n-of 25 mice [ output-print self let radius random 10 output-print radius output-print [ list pxcor pycor ] of patches in-radius radius ]")
    testCommand("ask n-of 25 frogs [ output-print self let radius random-float 7.3934 output-print radius output-print [ list pxcor pycor ] of patches in-radius radius ]")
  }

  inAllTopologies("in-cone turtle breeds", decls = "breed [mice mouse] breed [frogs frog]", baseView = View(dimensions = WorldDimensions(minPxcor = -4, maxPxcor = 3, minPycor = -2, maxPycor = 6))) {
    implicit fixture => import fixture._
    testCommand("create-mice 50 [ setxy random-xcor random-ycor ]")
    testCommand("create-frogs 50 [ setxy random-xcor random-ycor ]")
    testCommand("""| ask n-of 25 turtles [
                   |   output-print self
                   |   let radius random 10
                   |   let angle random 180
                   |   output-print (word "radius " radius)
                   |   output-print (word "angle " angle)
                   |   output-print [ who ] of turtles in-cone radius angle
                   | ]""".stripMargin)
    testCommand("""| ask n-of 25 frogs [
                   |   output-print self
                   |   let radius random-float 17.3934
                   |   let angle random 180
                   |   output-print (word "radius " radius)
                   |   output-print (word "angle " angle)
                   |   output-print [ who ] of frogs in-cone radius angle
                   | ]""".stripMargin)
    testCommand("""| ask n-of 25 mice [
                   |   output-print self
                   |   let radius random 10
                   |   let angle random 180
                   |   output-print (word "radius " radius)
                   |   output-print (word "angle " angle)
                   |   output-print [ who ] of turtles in-cone radius angle
                   | ]""".stripMargin)
    testCommand("""| ask n-of 25 turtles [
                   |   output-print self
                   |   let radius random 10
                   |   let angle random 180
                   |   output-print (word "radius " radius)
                   |   output-print (word "angle " angle)
                   |   output-print [ list pxcor pycor ] of patches in-cone radius angle
                   | ]""".stripMargin)
    testCommand("""| ask n-of 25 mice [
                   |   output-print self
                   |   let radius random 10
                   |   let angle random 180
                   |   output-print (word "radius " radius)
                   |   output-print (word "angle " angle)
                   |   output-print [ list pxcor pycor ] of patches in-cone radius angle
                   | ]""".stripMargin)
    testCommand("""| ask n-of 25 frogs [
                   |   output-print self
                   |   let radius random-float 7.3934
                   |   let angle random 180
                   |   output-print (word "radius " radius)
                   |   output-print (word "angle " angle)
                   |   output-print [ list pxcor pycor ] of patches in-cone radius angle
                   | ]""".stripMargin)
  }

  inAllTopologies("distance move") {
    implicit fixture => import fixture._
    testCommand("crt 50 [ setxy random-xcor random-ycor ]")
    testCommand("ask turtles [ create-link-with one-of other turtles ]")
    for (_ <- 1 to 5) {
      testCommand("ask turtles [ face one-of other turtles ]")
      testCommand("ask turtles [ fd 0.1 * distance one-of other turtles ]")
    }
  }

  inAllTopologies("layout-spring") {
    implicit fixture => import fixture._
    testCommand("crt 10 [ setxy random-xcor random-ycor ]")
    testCommand("ask turtles [ create-links-with other turtles ]")
    testCommand("repeat 5 [ layout-spring turtles links .1 .2 .3 ]")
    testCommand("repeat 5 [ layout-spring turtles with [ ycor > 0 ] links .1 .2 .3 ]")
    testCommand("repeat 5 [ layout-spring turtles [ my-links ] of turtle 0 .1 .2 .3 ]")
    testCommand("repeat 5 [ layout-spring turtles with [ ycor > 0 ] [ my-links ] of turtle 0 .1 .2 .3 ]")
  }

}
