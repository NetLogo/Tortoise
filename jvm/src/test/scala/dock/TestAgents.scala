// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise
package dock

import org.nlogo.core.{ Model, View}
import org.nlogo.tortoise.tags.SlowTest

class TestAgents extends DockingSuite {

  test("world dimensions", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(2))))
    compare("count patches")
  }

  test("world dimensions 2", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View(minPxcor = -3, maxPxcor = 4, minPycor = -5, maxPycor = 6))))
    compare("(list min-pxcor max-pxcor min-pycor max-pycor)")
    compare("(list world-width world-height)")
  }

  test("turtle creation 1", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 2")
    testCommand("cro 2")
  }

  test("turtle creation 2", SlowTest) { implicit fixture => import fixture._
    testCommand("output-print count turtles")
    testCommand("cro 1")
    testCommand("output-print count turtles")
    testCommand("cro 4")
    testCommand("output-print count turtles")
    testCommand("clear-all")
    testCommand("output-print count turtles")
  }

  test("turtle creation 3", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 300")
  }

  test("cro with init block", SlowTest) { implicit fixture => import fixture._
    testCommand("crt 4 [ output-print who ]")
  }

  test("crt with init block", SlowTest) { implicit fixture => import fixture._
    testCommand("crt 4 [ output-print color output-print heading ]")
  }

  test("random-xcor/ycor", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 10 [ setxy random-xcor random-ycor ]")
  }

  test("ask", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 3")
    testCommand("ask turtles [ output-print 0 ]")
  }

  test("turtle motion 1", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(1))))
    testCommand("cro 4 ask turtles [fd 1] ask turtles [output-print xcor output-print ycor]")
  }

  test("turtle motion 2", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(1))))
    testCommand("cro 8 ask turtles [fd 1] ask turtles [output-print xcor output-print ycor]")
  }

  test("turtle motion 3", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(4))))
    testCommand("cro 20 ask turtles [rt random 90 left random 90]")
    testCommand("ask turtles [rt random-float 360]")
  }

  test("turtle motion 8", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(3))))
    testCommand("crt 50 ask turtles [ repeat 50 [ fd random-float 3.1 / random-float 2.1 ] ]")
  }

  test("turtle move-to", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(4))))
    testCommand("create-turtles 20 ask turtles [ fd random 4 ]")
    testCommand("ask turtles [ move-to turtle random 20 ]")
    testCommand("ask turtles [ move-to patch (random 7 - 3) (random 7 - 3) ]")
  }

  test("turtle death 1", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 8")
    testCommand("ask turtles [die]")
    testCommand("ask turtles [output-print xcor]")
  }

  test("turtle death 2", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 5")
    testCommand("ask turtles with [who = 2] [ die ]")
    testCommand("ask turtles [output-print who]")
  }

  test("turtle death stops execution", SlowTest) { implicit fixture => import fixture._
    declare("""| to p1 [] die end
               | to p2 [] output-print "Never here" end
               |""".stripMargin)
    testCommand("cro 5")
    testCommand("ask turtles [ p1 p2 ]")
  }

  test("turtle size", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 1 ask turtles [ set size 5 ]")
    testCommand("ask turtles [ output-print size ]")
  }

  test("turtle color", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 1 ask turtles [ set color blue ]")
    testCommand("ask turtles [ output-print blue ]")
  }

  test("patches", SlowTest) { implicit fixture => import fixture._
    testCommand("ask patches [output-print pxcor]")
  }

  test("patch variables", SlowTest) { implicit fixture => import fixture._
    val src =
      """
        |patches-own [ living? live-neighbors ]
        |to cell-birth set living? true  set pcolor white end
        |to cell-death set living? false set pcolor black end
      """.stripMargin
    declare(src)
    testCommand("ask patches [cell-birth output-print living?]")
    testCommand("ask patches [cell-death output-print living?]")
  }

  test("patch order", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("""ask patches [ output-print self ]""")
  }

  test("turtles get patch variables", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("cro 5 ask turtles [ fd 1 ]")
    testCommand("""ask turtles [ output-print self ]""")
  }

  test("turtles set patch variables", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("cro 5 ask turtles [ fd 1 set pcolor blue ]")
    testCommand("ask turtles [output-print color]")
    testCommand("ask turtles [output-print pcolor]")
    testCommand("ask patches [output-print pcolor]")
  }

  test("with 1", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("ask patches with [true] [output-print pycor]")
  }

  test("with 1b", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("ask patches with [pcolor = black] [output-print pycor]")
  }

  test("with 2a", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("ask patches with [pxcor > 0 and pxcor < 2] [output-print pycor]")
  }

  test("with 2", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("ask patches with [pxcor = 1] [output-print pycor]")
  }

  test("with 3", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("ask patches with [pxcor = -3 and pycor = 2] [ output-print self ]")
  }

  test("with + turtles accessing turtle and patch vars", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("cro 5 ask turtles [fd 1]")
    testCommand("ask turtles with [pxcor =  1] [output-print pycor]")
    testCommand("ask turtles with [pxcor = -1] [output-print ycor]")
  }

  test("of", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(0))))
    testCommand("cro 5")
    testCommand("output-print sum [who] of turtles")
    testCommand("output-print [ pxcor ] of patch 0 0")
  }

  test("one-of", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(0))))
    testCommand("output-print one-of patches")
    testCommand("output-print one-of turtles")
    testCommand("create-turtles 2")
    testCommand("output-print one-of turtles")
  }

  test("get patch", SlowTest) { implicit fixture => import fixture._
    testCommand("output-print patch 0 0")
  }

  test("get turtle", SlowTest) { implicit fixture => import fixture._
    testCommand("cro 5")
    testCommand("ask turtles [ output-print self ]")
    testCommand("output-print turtle 1")
    testCommand("output-print turtle 8")
  }

  test("patch set", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("ask patches with [pxcor = -1 and pycor = 0] [ set pcolor green ]")
    testCommand("ask patch 0 0 [ set pcolor green ]")
    testCommand("output-print count patches with [pcolor = green]")
  }

  test("any", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(0))))
    testCommand("output-print any? patches")
    testCommand("output-print any? turtles")
    testCommand("cro 1")
    testCommand("output-print any? turtles")
  }

  test("all", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(4))))
    testCommand("crt 20 [ setxy random-xcor random-ycor ]")
    testCommand("output-print all? turtles [ pxcor > 0 ]")
    testCommand("output-print all? turtles [ pxcor > -10 ]")
  }

  test("dimensions", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View(minPxcor = -1, maxPxcor = 2, minPycor = -3, maxPycor = 4))))
    testCommand("output-print min-pxcor")
  }

  test("and, or", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("output-print count patches with [pxcor = 0 or pycor = 0]")
    testCommand("output-print count patches with [pxcor = 0 and pycor = 0]")
  }

  test("neighbors", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("""ask patches [ ask neighbors [ output-print self ]]""")
    testCommand("""ask patches [ ask neighbors4 [ output-print self ]]""")
    testCommand("ask patches [ sprout 1 ]")
    testCommand("""ask turtles [ ask neighbors4 [ output-print self ]]""")
  }

  test("setting a built-in patch variable", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("ask patches with [pxcor = 2 and pycor = 3] [ set pcolor green ]")
    testCommand("output-print count patches with [pcolor = green]")
    testCommand("ask patches [ output-print self output-print pcolor ]")
  }

  test("setting a patches-own variable", SlowTest) { implicit fixture => import fixture._
    declare(Model(code = "patches-own [foo]", widgets = List(View.square(5))))
    testCommand("ask patches with [pxcor = 2 and pycor = 3] [ set foo green ]")
    testCommand("output-print count patches with [foo = green]")
    testCommand("ask patches [ output-print self output-print foo ]")
  }

  test("clear-all clears patches", SlowTest) { implicit fixture => import fixture._
    declare("patches-own [p]")
    testCommand("ask patches [ set p 123 ]")
    testCommand("ask patches [ set pcolor green ]")
    testCommand("clear-all")
    testCommand("output-print count patches with [pcolor = green]")
  }

  test("sprout 1", SlowTest) { implicit fixture => import fixture._
    testCommand("ask patches with [pxcor >= 0] [ sprout 1 ]")
  }

  test("sprout 2", SlowTest) { implicit fixture => import fixture._
    testCommand("ask patches [ sprout 1 [ set color red ] ]")
  }

  test("turtle motion", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("crt 100")
    testCommand("ask turtles [ setxy random-xcor random-ycor ]")
    for (_ <- 1 to 10)
      testCommand("ask turtles [ fd 1 ]")
  }

  test("patch-ahead", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(2))))
    testCommand("cro 7")
    testCommand("ask turtles [ output-print patch-ahead 1 ]")
    testCommand("ask turtles [ output-print patch-ahead 100 ]")
  }

  test("can-move", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(2))))
    testCommand("cro 7")
    testCommand("ask turtles [ output-print can-move? 1 ]")
    testCommand("ask turtles [ output-print can-move? 100 ]")
  }

  test("turtles-here", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(2))))
    testCommand("ask patches [ sprout 2 ]")
    testCommand("output-print sum [count turtles-here] of turtles")
    compare("sum [count turtles-here] of turtles")
  }

  test("turtles-here 2", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(2))))
    testCommand("crt 20")
    testCommand("ask turtles [ set heading 0 fd .3 ]")
    testCommand("ask turtle 0 [ ask turtles-here [ output-print self ] ]")
    testCommand("ask turtles [ fd .3 ]")
    testCommand("ask turtle 0 [ ask turtles-here [ output-print self ] ]")
  }

  test("turtles-on", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(2))))
    testCommand("ask patches [ sprout 2 ]")
    compare("[ who ] of turtles-on turtle 0")
    compare("[ who ] of turtles-on patch 0 0")
    compare("[ [ who ] of turtles-on neighbors4 ] of patch 0 0")
    compare("[ [ who ] of turtles-on neighbors ] of patch 0 0")
    compare("[ [ who ] of turtles-on neighbors4 ] of turtle 0")
    compare("[ [ who ] of turtles-on neighbors ] of turtle 0")
    compare("[ who ] of turtles-on turtles with [ who > 3 ]")
  }

  test("turtles-at", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(2))))
    compare("[ who ] of [ turtles-at 0 0 ] of patch 0 0")
    compare("[ who ] of [ turtles-at 1 1 ] of patch 0 0")
    testCommand("ask patches [ sprout 2 ]")
    compare("[ who ] of [ turtles-at 0 0 ] of turtle 3")
    compare("[ who ] of [ turtles-at 1 1 ] of turtle 3")
    compare("[ who ] of [ turtles-at 0 0 ] of patch 0 0")
    compare("[ who ] of [ turtles-at 1 1 ] of patch 0 0")
  }

  test("set heading negative", SlowTest) { implicit fixture => import fixture._
    // should get normalized to 260
    testCommand("crt 1 [ set heading -100 ]")
  }

  test("shape downcasing", SlowTest) { implicit fixture => import fixture._
    workspace.world.turtleShapeList.add(DummyShape("turtle"))
    testCommand("""crt 1 [ set shape "TURTLE" output-print shape ]""")
  }

  test("turtle creation + procedure call", SlowTest) { implicit fixture => import fixture._
    declare("to foo cro 2 end")
    testCommand("foo")
  }

  test("patch-set construction", SlowTest) { implicit fixture => import fixture._
    declare(Model(code = "globals [p]", widgets = List(View.square(2))))
    testCommand("set p no-patches")
    compare("count p")
    compare("any? p")
    testCommand("set p (patch-set no-patches)")
    compare("count p")
    testCommand("set p (patch-set [neighbors] of patch 0 0)")
    compare("count p")
    testCommand("set p (patch-set [neighbors] of patch 0 0 [neighbors] of patch 1 0)")
    compare("count p")
    testCommand("set p (patch-set [neighbors] of [neighbors] of patch 0 0)")
    compare("count p")
  }

  test("myself", SlowTest) { implicit fixture => import fixture._
    declare("""|to f1 [ ]
               |  set heading [ pxcor ] of myself
               |end
               |to f2 [ ] f1 end
               |to f3 [ ] ask one-of turtles-here [ f2 ] end
               """.stripMargin)
    testCommand("ask patches [ sprout 2 [ set heading [ pycor ] of myself ] ]")
    testCommand("ask turtles [ output-print myself ]")
    testCommand("ask patches [ ask turtles-here [ f1 ] ]")
    testCommand("ask turtles [ ask patch-here [ ask turtles-here [ hatch 3 [ set heading [ pxcor ] of myself ] ] output-print myself ] ]")
    testCommand("ask patches [ f3 ]")
  }

  test("hide and show", SlowTest) { implicit fixture => import fixture._
    testCommand("crt 5")
    testCommand("ask turtles [ hide-turtle ]")
    testCommand("ask turtles [ hide-turtle ]")
    testCommand("ask turtles [ show-turtle ]")
    testCommand("ask turtles [ show-turtle ]")
  }

  test("patch-at", SlowTest) { implicit fixture => import fixture._
    testCommand("crt 100 [ setxy random-xcor random-ycor ]")
    // patch-at takes offsets, but we're giving it big numbers, to test wrapping
    testCommand("ask turtles [ output-print patch-at random-float 1000 random-float 1000 ]")
  }

  test("in-radius", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("crt 50 [ setxy random-xcor random-ycor ]")
    testCommand("ask turtles [ let s count turtles in-radius 2 ]")
  }

  test("n-of patches", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("ask n-of 15 patches [ output-print (list pxcor pycor) ]")
  }

  test("n-of turtles", SlowTest) { implicit fixture => import fixture._
    testCommand("crt 40")
    testCommand("ask n-of 20 turtles [ die ]")
    testCommand("ask n-of 10 turtles [ die ]")
    testCommand("ask n-of 5 turtles [ die ]")
  }

  test("min/max-one-of", SlowTest) { implicit fixture => import fixture._
    testCommand("crt 10")
    compare("[who] of min-one-of turtles [who * who]")
    compare("[who] of max-one-of turtles [who * who]")
    // RNG draws must match when breaking ties
    for(_ <- 0 until 10) {
      compare("[who] of min-one-of turtles [xcor]")
      compare("[who] of max-one-of turtles [xcor]")
    }
  }

  test("other", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(2))))
    testCommand("crt 10")
    testCommand("ask turtle 0 [ ask other turtles [ output-print self ] ]")
    testCommand("ask turtles [ ask other turtles-here [ output-print self ] ]")
    testCommand("ask patches [ ask other patches [ output-print self ] ]")
    testCommand("ask patches [ ask other turtles [ output-print self ] ]")
  }

  test("agentset equality", SlowTest) { implicit fixture => import fixture._
    compare("turtles = turtles")
    testCommand("crt 3")
    compare("turtles = turtles with [ who > 0 ]")
    testCommand("output-print turtles = turtles with [ who > -1 ]")
    compare("turtles with [ who > 0 ] = turtles with [ who > 0 ]")
  }

  test("watch", SlowTest) { implicit fixture => import fixture._
    declare(Model(widgets = List(View.square(5))))
    testCommand("crt 3")
    testCommand("ask turtles [ fd 1 ]")
    testCommand("watch turtle 0")
    testCommand("ask turtles [ rt 10 fd 2 ]")
    testCommand("watch turtle 1")
    testCommand("ask turtles [ rt 10 fd 2 ]")
    testCommand("reset-perspective")
    testCommand("ask turtle 0 [ watch-me ]")
    testCommand("ask turtles [ watch-me ]")
    testCommand("reset-perspective")
    testCommand("watch patch 0 0")
    testCommand("reset-perspective")
    testCommand("ask patch 0 1 [ watch-me ]")
  }
}
