// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import jsengine.GraalJS

import
  org.nlogo.tortoise.compiler.CompiledModel

import
  scala.{ io, util },
    io.Source,
    util.Try

import
  org.scalatest.{ FunSuite, Tag }

class TestPlotting extends FunSuite with PlottingHelpers {

  testPlotting("`testPlotting` helper doesn't passively explode") { (engine) =>
    assertResult(Double.box(0))(engine.eval("0"))
    ()
  }

  testPlotting("Default plot pen is the first one") { (engine) =>
    implicit val e = engine
    setPlot(Plots.ClassPlot.name)
    assertPenNameIs(Plots.ClassPlot.Pens.Low.name)
    setupPlots()
    assertPenNameIs(Plots.ClassPlot.Pens.Low.name)
    setup()
    assertPenNameIs(Plots.ClassPlot.Pens.Low.name)
    ()
  }

  testPlotting("auto-plot-on / auto-plot-off") { (engine) =>

    import Plots._

    implicit val e = engine

    setPlot(ClassHistogram.name)
    assertAutoplottingness(ClassHistogram.isAutoplotting)

    setPlot(ClassPlot.name)
    assertAutoplottingness(ClassPlot.isAutoplotting)

    setPlot(Gini.name)
    assertAutoplottingness(Gini.isAutoplotting)

    setPlot(Lorenz.name)
    assertAutoplottingness(Lorenz.isAutoplotting)

    setPlot(Default.name)
    assertAutoplottingness(Default.isAutoplotting)
    disableAutoplotting()
    assertIsntAutoplotting()
    disableAutoplotting()
    assertIsntAutoplotting()
    enableAutoplotting()
    assertIsAutoplotting()

    ()

  }

  testPlotting("clear-plot") { (engine) =>

    import Plots._

    implicit val e = engine

    val tempPenName = "temp1"

    setPlot(Lorenz.name)

    setColor(111)
    setInterval(-20)
    setDisplayMode(Bar)
    raisePen()

    setPen(Lorenz.Pens.Equal.name)
    setDisplayMode(Point)
    setInterval(102)
    setColor(3)

    createTempPen(tempPenName)

    setPlot(ClassPlot.name)
    createTempPen(tempPenName)

    setPlot(ClassHistogram.name)
    createTempPen(tempPenName)

    setPlot(Gini.name)
    createTempPen(tempPenName)

    setPlot(Lorenz.name)
    setAxisRange(-10, -9)(e, X)
    setAxisRange(9,   10)(e, Y)

    clearPlot()

    {
      import Lorenz.Pens._
      assertPenDoesntExist(tempPenName)
      assertPenProperties(Lorenz.name, false, Lorenz.color, Lorenz.interval, Lorenz.mode, Down)
      setPen(Equal.name)
      assertPenProperties(Equal.name, false, Equal.color, Equal.interval, Equal.mode, Down)
    }

    assertAxisRangeIs(Lorenz.xmin, Lorenz.xmax)(e, X)
    assertAxisRangeIs(Lorenz.ymin, Lorenz.ymax)(e, Y)

    setPlot(ClassPlot.name)
    assertPenExists(tempPenName)

    setPlot(ClassHistogram.name)
    assertPenExists(tempPenName)

    setPlot(Gini.name)
    assertPenExists(tempPenName)

    ()

  }

  testPlotting("create-temporary-plot-pen") { (engine) =>

    implicit val e = engine

    assertIsntTemp()

    createTempPen("apples")
    assertPenProperties("apples", true, 0, 1, Line, Down)

    clearAllPlots()
    assertIsntTemp()

    ()

  }

  testPlotting("plot / plotxy / set-plot-pen-interval ") { (engine) =>

    implicit val e = engine

    // Test `plot`
    plot(10)
    assertYs(10)
    plot(500)
    assertYs(10, 500)
    plot(2)
    assertYs(10, 500, 2)
    plot(-13)
    assertYs(10, 500, 2, -13)
    plot(256)
    assertYs(10, 500, 2, -13, 256)

    // Test `set-plot-pen-interval`
    clearPlot()
    setInterval(23)
    plot(10)
    assertXYs(0 -> 10)
    plot(50)
    assertXYs(0 -> 10, 23 -> 50)
    plot(2)
    assertXYs(0 -> 10, 23 -> 50, 46 -> 2)
    plot(17)
    assertXYs(0 -> 10, 23 -> 50, 46 -> 2, 69 -> 17)

    // Test that `clear-plot` resets interval
    clearPlot()
    plot(10)
    assertXYs(0 -> 10)
    plot(50)
    assertXYs(0 -> 10, 1 -> 50)

    // Test `plotxy`
    clearPlot()
    plotxy(12, 53)
    assertXYs(12 -> 53)
    plotxy(9, 22)
    assertXYs(12 -> 53, 9 -> 22)
    plotxy(100002, -1)
    assertXYs(12 -> 53, 9 -> 22, 100002 -> -1)
    plotxy(0, 1031)
    assertXYs(12 -> 53, 9 -> 22, 100002 -> -1, 0 -> 1031)

    // Test `plotxy` and `plot` intermixed
    clearPlot()
    plotxy(12, 53)
    assertXYs(12 -> 53)
    plot(9)
    assertXYs(12 -> 53, 13 -> 9)
    plotxy(100002, -1)
    assertXYs(12 -> 53, 13 -> 9, 100002 -> -1)
    plotxy(100004, 101)
    assertXYs(12 -> 53, 13 -> 9, 100002 -> -1, 100004 -> 101)
    plot(98)
    assertXYs(12 -> 53, 13 -> 9, 100002 -> -1, 100004 -> 101, 100005 -> 98)
    plotxy(0, 1031)
    assertXYs(12 -> 53, 13 -> 9, 100002 -> -1, 100004 -> 101, 100005 -> 98, 0 -> 1031)
    plot(15)
    assertXYs(12 -> 53, 13 -> 9, 100002 -> -1, 100004 -> 101, 100005 -> 98, 0 -> 1031, 1 -> 15)

    ()

  }

  testPlotting("histogram") { (engine) =>

    implicit val e = engine

    // Test `histogram` basics
    clearPlot()
    histogram(5, 19, 2, 107, -123, 2, 2, 2, 0, 1, 93)
    assertXYs(2 -> 4, 5 -> 1, 1 -> 1, 0 -> 1, 19 -> 1)
    histogram()
    assertXYs()
    histogram(12, 9, -12, 5)
    assertXYs(12 -> 1, 9 -> 1, 5 -> 1)
    histogram(5, 19, 2, 107, -123, 2, 2, 2, 0, 1, 93)
    assertXYs(2 -> 4, 5 -> 1, 1 -> 1, 0 -> 1, 19 -> 1)

    // Test `histogram` with different interval
    // Buckets should be: { 0: [0, 1, 2, 2, 2, 2], 1: [5], 3: [19] }
    clearPlot()
    setInterval(5)
    histogram(5, 19, 2, 107, -123, 2, 2, 2, 0, 1, 93)
    assertXYs(0 -> 6, 5 -> 1, 15 -> 1)

    // Test `histogram` with negative xMin
    // Buckets should be: { -25: [-123], 0: [0, 1, 2, 2, 2, 2], 1: [5], 3: [19] }
    clearPlot()
    setAxisRange(-125, 20)(e, X)
    setInterval(5)
    histogram(5, 19, 2, 107, -123, 2, 2, 2, 0, 1, 93)
    assertXYs(-125 -> 1, 0 -> 6, 5 -> 1, 15 -> 1)

    ()

  }

  testPlotting("plot-pen-exists?") { (engine) =>

    import Plots.Lorenz._

    implicit val e = engine

    assertPenDoesntExist(Pens.Lorenz.name)
    setPlot(name)
    assertPenExists(Pens.Lorenz.name)
    assertPenExists(Pens.Equal.name)
    assertPenDoesntExist(Plots.Gini.Pens.Default.name)
    assertPenDoesntExist(Plots.ClassPlot.Pens.Up.name)

    ()

  }

  testPlotting("plot-pen-reset") { (engine) =>

    import Plots.Default.Pens.Default._

    implicit val e = engine

    val newColor       = 111
    val newInterval    = -20
    val newDisplayMode = Bar

    assertPenProperties(name, false, color, interval, mode, Down)

    resetPen()
    assertPenProperties(name, false, color, interval, mode, Down)

    setColor(newColor)
    assertPenProperties(name, false, newColor, interval, mode, Down)
    setInterval(newInterval)
    assertPenProperties(name, false, newColor, newInterval, mode, Down)
    setDisplayMode(newDisplayMode)
    assertPenProperties(name, false, newColor, newInterval, newDisplayMode, Down)
    raisePen()
    assertPenProperties(name, false, newColor, newInterval, newDisplayMode, Up)

    resetPen()
    assertPenProperties(name, false, color, interval, mode, Down)

    ()

  }

  testPlotting("plot-pen-up / plot-pen-down") { (engine) =>

    implicit val e = engine

    assertPenModeIs(Down)
    lowerPen()
    assertPenModeIs(Down)
    raisePen()
    assertPenModeIs(Up)
    lowerPen()
    assertPenModeIs(Down)

    ()

  }

  testPlotting("set-current-plot") { (engine) =>

    implicit val e = engine

    assertPlotNameIs(Plots.Default.name)
    setPlot(Plots.ClassHistogram.name)
    assertPlotNameIs(Plots.ClassHistogram.name)
    setPlot(Plots.Gini.name)
    assertPlotNameIs(Plots.Gini.name)

    ()

  }

  testPlotting("set-current-plot-pen") { (engine) =>

    import Plots.Lorenz._

    implicit val e = engine

    setPlot(name)
    assertPenNameIs(Pens.Lorenz.name)
    setPen(Pens.Equal.name)
    assertPenNameIs(Pens.Equal.name)
    setPen(Pens.Lorenz.name)
    assertPenNameIs(Pens.Lorenz.name)

  }

  testPlotting("set-plot-pen-color") { (engine) =>

    implicit val e = engine

    assertColorIs(Plots.Default.Pens.Default.color)
    setColor(113)
    assertColorIs(113)
    setColor(2)
    assertColorIs(2)
    resetPen()
    assertColorIs(105)

    ()

  }

  testPlotting("set-plot-pen-mode") { (engine) =>

    implicit val e = engine

    assertDisplayModeIs(Plots.Default.Pens.Default.mode)
    setDisplayMode(Point)
    assertDisplayModeIs(Point)
    setDisplayMode(Line)
    assertDisplayModeIs(Line)
    setDisplayMode(Bar)
    assertDisplayModeIs(Bar)

    ()

  }

  testPlotting("set-plot-x-range / set-plot-y-range") { (engine) =>

    import Plots.Default._

    implicit val e = engine

    def runForAxis(initialMin: Double, initialMax: Double)(implicit axis: Axis) = {

      assertAxisRangeIs(initialMin, initialMax)
      setAxisRange(100, 1000)
      assertAxisRangeIs(100, 1000)
      setAxisRange(-23, 901)
      assertAxisRangeIs(-23, 901)

      assertResult(true)(Try(setAxisRange(10, 0)).isFailure)

      ()

    }

    runForAxis(xmin, xmax)(X)
    runForAxis(ymin, ymax)(Y)

    ()

  }

  testPlotting("setup-plots") { (engine) =>

    implicit val e    = engine
    implicit val axis = Y

    setPlot(Plots.ClassPlot.name)
    setup()
    assertAxisRangeIs(0, 250)
    setAxisRange(4, 8)
    assertAxisRangeIs(4, 8)
    setupPlots()
    assertAxisRangeIs(0, 250)

  }

}

trait PlottingHelpers {

  self: FunSuite =>

  private val compiler = new org.nlogo.tortoise.compiler.Compiler()

  private val model = {
    val input = Source.fromFile("models/Sample Models/Social Science/Economics/Wealth Distribution.nlogo")
    val nlogo = input.mkString
    input.close()
    CompiledModel.fromNlogoContents(nlogo, compiler) valueOr ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
  }

  protected object Plots {

    object ClassPlot {
      val name           = "Class Plot"
      val isAutoplotting = true
      val xmin           = 0
      val xmax           = 50
      val ymin           = 0
      val ymax           = 250
      object Pens {
        object Low {
          val name     = "low"
          val color    = 15
          val mode     = Line
          val interval = 1
        }
        object Mid {
          val name     = "mid"
          val color    = 55
          val mode     = Line
          val interval = 1
        }
        object Up {
          val name     = "up"
          val color    = 105
          val mode     = Line
          val interval = 1
        }
      }
    }

    object ClassHistogram {
      val name           = "Class Histogram"
      val isAutoplotting = false
      val xmin           = 0
      val xmax           = 3
      val ymin           = 0
      val ymax           = 250
      object Pens {
        object Default {
          val name     = "default"
          val color    = 15
          val mode     = Bar
          val interval = 1
        }
      }
    }

    object Lorenz {
      val name           = "Lorenz Curve"
      val isAutoplotting = false
      val xmin           = 0
      val xmax           = 100
      val ymin           = 0
      val ymax           = 100
      object Pens {
        object Lorenz {
          val name     = "lorenz"
          val color    = 15
          val mode     = Line
          val interval = 1
        }
        object Equal {
          val name     = "equal"
          val color    = 0
          val mode     = Line
          val interval = 100
        }
      }
    }

    object Gini {
      val name           = "Gini-Index v. Time"
      val isAutoplotting = true
      val xmin           = 0
      val xmax           = 50
      val ymin           = 0
      val ymax           = 1
      object Pens {
        object Default {
          val name     = "default"
          val color    = 105
          val mode     = Line
          val interval = 1
        }
      }
    }

    val Default = Gini

  }

  protected def evalJS(js: String)(implicit engine: GraalJS): AnyRef =
    engine.eval(js)

  protected def evalNLReporter(netlogo: String)(implicit engine: GraalJS): AnyRef =
    evalNL(netlogo, model.compileReporter)

  protected def evalNLCommand(netlogo: String)(implicit engine: GraalJS): AnyRef =
    evalNL(netlogo, model.compileRawCommand)

  private def evalNL(netlogo: String, evaluator: (String) => CompiledModel.CompileResult[String])(implicit engine: GraalJS): AnyRef = {
    val result = evaluator(netlogo) valueOr ((nel) => throw new Exception(nel.list.toList.mkString))
    engine.eval(result)
  }


  protected def assertAutoplottingness(ness: Boolean) (implicit e: GraalJS): Unit = { assertResult(Boolean.box(ness))(evalJS(s"$pathToPlot.isAutoplotting"))                                          ; () }
  protected def assertColorIs(color: Double)          (implicit e: GraalJS): Unit = { assertResult(Double.box(color))(evalJS(s"$pathToPen.getColor()"))                                               ; () }
  protected def assertDisplayModeIs(mode: DisplayMode)(implicit e: GraalJS): Unit = {
    assertResult(
      evalJS(s"PenBundle.DisplayMode.displayModeToString(PenBundle.DisplayMode.${mode.toDisplayModeStr})"))(
        evalJS(s"PenBundle.DisplayMode.displayModeToString($pathToPen.getDisplayMode())"))
    ()
  }
  protected def assertIntervalIs(interval: Double)    (implicit e: GraalJS): Unit = { assertResult(Double.box(interval))(evalJS(s"$pathToState.interval"))                                            ; () }
  protected def assertIsAutoplotting()                (implicit e: GraalJS): Unit = { assertAutoplottingness(true)                                                                                    ; () }
  protected def assertIsntAutoplotting()              (implicit e: GraalJS): Unit = { assertAutoplottingness(false)                                                                                   ; () }
  protected def assertIsntTemp()                      (implicit e: GraalJS): Unit = { assertResult(Boolean.box(false))(evalJS(s"$pathToPen.isTemp"))                                                  ; () }
  protected def assertIsTemp()                        (implicit e: GraalJS): Unit = { assertResult(Boolean.box(true))(evalJS(s"$pathToPen.isTemp"))                                                   ; () }
  protected def assertPenExists(penName: String)      (implicit e: GraalJS): Unit = { assertResult(Boolean.box(true))(evalNLReporter(s"""plot-pen-exists? "$penName""""))                             ; () }
  protected def assertPenDoesntExist(penName: String) (implicit e: GraalJS): Unit = { assertResult(Boolean.box(false))(evalNLReporter(s"""plot-pen-exists? "$penName""""))                            ; () }
  protected def assertPenModeIs(penMode: PenMode)     (implicit e: GraalJS): Unit = {
    assertResult(
      evalJS(s"PenBundle.PenMode.penModeToBool(PenBundle.PenMode.${penMode.toPenModeStr})"))(
        evalJS(s"PenBundle.PenMode.penModeToBool($pathToState.mode)"))
    ()
  }
  protected def assertPenNameIs(name: String)         (implicit e: GraalJS): Unit = { assertResult(name)(evalJS(s"$pathToPen.name"))                                                                  ; () }
  protected def assertPlotNameIs(name: String)        (implicit e: GraalJS): Unit = { assertResult(name)(evalNLReporter("plot-name"))                                                                 ; () }
  protected def assertYs(ys: Int*)                    (implicit e: GraalJS): Unit = { assertXYs(ys.zipWithIndex map (_.swap): _*)                                                                     ; () }

  protected def assertAxisRangeIs(min: Double, max: Double)(implicit e: GraalJS, axis: Axis): Unit = {
    assertResult(Double.box(min))(evalNLReporter(s"plot-${axis.toAxisStr}-min"))
    assertResult(Double.box(max))(evalNLReporter(s"plot-${axis.toAxisStr}-max"))
    ()
  }

  protected def assertPenProperties(name: String, isTemp: Boolean, color: Double, interval: Double, displayMode: DisplayMode, penMode: PenMode)(implicit e: GraalJS): Unit = {
    assertPenNameIs(name)
    if (isTemp) assertIsTemp() else assertIsntTemp()
    assertColorIs(color)
    assertIntervalIs(interval)
    assertDisplayModeIs(displayMode)
    assertPenModeIs(penMode)
    ()
  }

  protected def assertXYs(xys: (Int, Int)*)(implicit e: GraalJS): Unit = {
    val expectedStr = xys.map(_.toString).sorted.mkString(",")
    val actualStr   = evalJS(s"$pathToPen._points.map(function(p){ return '(' + p.x + ',' + p.y + ')'; }).sort().toString()")
    assertResult(expectedStr)(actualStr)
    ()
  }

  protected def clearPlot()                      (implicit e: GraalJS) = evalNLCommand("clear-plot")
  protected def clearAllPlots()                  (implicit e: GraalJS) = evalNLCommand("clear-all-plots")
  protected def createTempPen(name: String)      (implicit e: GraalJS) = evalNLCommand(s"""create-temporary-plot-pen \"$name\"""")
  protected def disableAutoplotting()            (implicit e: GraalJS) = evalNLCommand("auto-plot-off")
  protected def enableAutoplotting()             (implicit e: GraalJS) = evalNLCommand("auto-plot-on")
  protected def histogram(ys: Double*)           (implicit e: GraalJS) = evalNLCommand(s"histogram ${ys.mkString("[", " ", "]")}")
  protected def lowerPen()                       (implicit e: GraalJS) = evalNLCommand("plot-pen-down")
  protected def plot(y: Double)                  (implicit e: GraalJS) = evalNLCommand(s"plot $y")
  protected def plotxy(x: Double, y: Double)     (implicit e: GraalJS) = evalNLCommand(s"plotxy $x $y")
  protected def raisePen()                       (implicit e: GraalJS) = evalNLCommand("plot-pen-up")
  protected def resetPen()                       (implicit e: GraalJS) = evalNLCommand("plot-pen-reset")
  protected def setColor(color: Double)          (implicit e: GraalJS) = evalNLCommand(s"set-plot-pen-color $color")
  protected def setInterval(x: Double)           (implicit e: GraalJS) = evalNLCommand(s"set-plot-pen-interval $x")
  protected def setDisplayMode(mode: DisplayMode)(implicit e: GraalJS) = evalNLCommand(s"set-plot-pen-mode ${mode.toInt}")
  protected def setPlot(name: String)            (implicit e: GraalJS) = evalNLCommand(s"""set-current-plot "$name"""")
  protected def setPen(name: String)             (implicit e: GraalJS) = evalNLCommand(s"""set-current-plot-pen "$name"""")
  protected def setup()                          (implicit e: GraalJS) = evalNLCommand("setup")
  protected def setupPlots()                     (implicit e: GraalJS) = evalNLCommand("setup-plots")

  protected def setAxisRange(min: Double, max: Double)(implicit e: GraalJS, axis: Axis) =
    evalNLCommand(s"set-plot-${axis.toAxisStr}-range $min $max")

  sealed protected trait Axis { def toAxisStr: String }
  protected case object X extends Axis { override def toAxisStr = "x" }
  protected case object Y extends Axis { override def toAxisStr = "y" }

  sealed protected trait DisplayMode { def toDisplayModeStr: String; def toInt: Int }
  case object Line extends DisplayMode  { override def toDisplayModeStr = "Line";  override def toInt = 0 }
  case object Bar extends DisplayMode   { override def toDisplayModeStr = "Bar";   override def toInt = 1 }
  case object Point extends DisplayMode { override def toDisplayModeStr = "Point"; override def toInt = 2 }

  sealed protected trait PenMode { def toPenModeStr: String }
  protected case object Down extends PenMode { override def toPenModeStr = "Down" }
  protected case object Up   extends PenMode { override def toPenModeStr = "Up" }

  protected lazy val engine = {

    val preCode =
      """var PenBundle = tortoise_require('engine/plot/pen');
        |var PlotOps   = tortoise_require('engine/plot/plotops');
        |
        |var DummyOps = (function() {
        |  var resize      = function() {};
        |  var reset       = function() {};
        |  var registerPen = function() {};
        |
        |  var resetPen       = function() { return function() {}; };
        |  var addPoint       = function() { return function() {}; };
        |  var updatePenMode  = function() { return function() {}; };
        |  var updatePenColor = function() { return function() {}; };
        |
        |  return new PlotOps(resize, reset, registerPen, resetPen, addPoint, updatePenMode, updatePenColor);
        |})()
        |
        |window.modelConfig = {
        |  plotOps: {
        |    'test-plot': DummyOps
        |  }
        |};""".stripMargin

    val engine = new GraalJS
    engine.setupTortoise
    engine.eval(preCode)
    engine

  }

  protected def testPlotting(name: String, tags: Tag*)(testFun: (GraalJS) => Unit): Unit = {
    test(name, tags: _*) {
      engine.eval(model.compiledCode)
      testFun(engine)
    }
  }

  protected val pathToPlot  = "plotManager._currentPlotMaybe._value"
  protected val pathToPen   = s"$pathToPlot._currentPenMaybe._value"
  protected val pathToState = s"$pathToPen._state"

}
