// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  scala.{ io, util },
    io.Source,
    util.Try

import
  org.scalatest.{ FunSuite, Tag }

import
  jsengine.nashorn.Nashorn

class TestPlotting extends FunSuite with PlottingHelpers {

  testPlotting("`testPlotting` helper doesn't passively explode") { (nashorn) =>
    assertResult(Double.box(0))(nashorn.eval("0"))
  }

  testPlotting("auto-plot-on / auto-plot-off") { (nashorn) =>

    implicit val n = nashorn

    assertAutoplottingness(Plots.Default.isAutoplotting)
    disableAutoplotting()
    assertIsntAutoplotting()
    disableAutoplotting()
    assertIsntAutoplotting()
    enableAutoplotting()
    assertIsAutoplotting()

  }

  testPlotting("clear-plot") { (nashorn) =>

    import Plots._

    implicit val n = nashorn

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
    setAxisRange(-10, -9)(n, X)
    setAxisRange(9,   10)(n, Y)

    clearPlot()

    {
      import Lorenz.Pens._
      assertPenDoesntExist(tempPenName)
      assertPenProperties(Lorenz.name, false, Lorenz.color, Lorenz.interval, Lorenz.mode, Down)
      setPen(Equal.name)
      assertPenProperties(Equal.name, false, Equal.color, Equal.interval, Equal.mode, Down)
    }

    assertAxisRangeIs(Lorenz.xmin, Lorenz.xmax)(n, X)
    assertAxisRangeIs(Lorenz.ymin, Lorenz.ymax)(n, Y)

    setPlot(ClassPlot.name)
    assertPenExists(tempPenName)

    setPlot(ClassHistogram.name)
    assertPenExists(tempPenName)

    setPlot(Gini.name)
    assertPenExists(tempPenName)

  }

  testPlotting("create-temporary-plot-pen") { (nashorn) =>

    implicit val n = nashorn

    assertIsntTemp()

    createTempPen("apples")
    assertPenProperties("apples", true, 0, 1, Line, Down)

    clearAllPlots()
    assertIsntTemp()

  }

  testPlotting("plot / plotxy / histogram / set-plot-pen-interval ") { (nashorn) =>

    implicit val n = nashorn

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

    // Test `histogram`
    clearPlot()
    histogram(5, 19, 2, 107, -123, 2, 2, 2, 0, 1, 93)
    assertYs(5, 19, 2, 107, -123, 2, 2, 2, 0, 1, 93)
    histogram()
    assertYs()
    histogram(12, 9, -12, 5)
    assertYs(12, 9, -12, 5)
    histogram(5, 19, 2, 107, -123, 2, 2, 2, 0, 1, 93)
    assertYs(5, 19, 2, 107, -123, 2, 2, 2, 0, 1, 93)

  }

  testPlotting("plot-pen-exists?") { (nashorn) =>

    import Plots.Lorenz._

    implicit val n = nashorn

    assertPenDoesntExist(Pens.Lorenz.name)
    setPlot(name)
    assertPenExists(Pens.Lorenz.name)
    assertPenExists(Pens.Equal.name)
    assertPenDoesntExist(Plots.Gini.Pens.Default.name)
    assertPenDoesntExist(Plots.ClassPlot.Pens.Up.name)

  }

  testPlotting("plot-pen-reset") { (nashorn) =>

    import Plots.Default.Pens.Default._

    implicit val n = nashorn

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

  }

  testPlotting("plot-pen-up / plot-pen-down") { (nashorn) =>

    implicit val n = nashorn

    assertPenModeIs(Down)
    lowerPen()
    assertPenModeIs(Down)
    raisePen()
    assertPenModeIs(Up)
    lowerPen()
    assertPenModeIs(Down)

  }

  testPlotting("set-current-plot") { (nashorn) =>

    implicit val n = nashorn

    assertPlotNameIs(Plots.Default.name)
    setPlot(Plots.ClassHistogram.name)
    assertPlotNameIs(Plots.ClassHistogram.name)
    setPlot(Plots.Gini.name)
    assertPlotNameIs(Plots.Gini.name)

  }

  testPlotting("set-current-plot-pen") { (nashorn) =>

    import Plots.Lorenz._

    implicit val n = nashorn

    setPlot(name)
    assertPenNameIs(Pens.Lorenz.name)
    setPen(Pens.Equal.name)
    assertPenNameIs(Pens.Equal.name)
    setPen(Pens.Lorenz.name)
    assertPenNameIs(Pens.Lorenz.name)

  }

  testPlotting("set-plot-pen-color") { (nashorn) =>

    implicit val n = nashorn

    assertColorIs(Plots.Default.Pens.Default.color)
    setColor(113)
    assertColorIs(113)
    setColor(2)
    assertColorIs(2)
    resetPen()
    assertColorIs(105)

  }

  testPlotting("set-plot-pen-mode") { (nashorn) =>

    implicit val n = nashorn

    assertDisplayModeIs(Plots.Default.Pens.Default.mode)
    setDisplayMode(Point)
    assertDisplayModeIs(Point)
    setDisplayMode(Line)
    assertDisplayModeIs(Line)
    setDisplayMode(Bar)
    assertDisplayModeIs(Bar)

  }

  testPlotting("set-plot-x-range / set-plot-y-range") { (nashorn) =>

    import Plots.Default._

    implicit val n = nashorn

    def runForAxis(initialMin: Double, initialMax: Double)(implicit axis: Axis) = {

      assertAxisRangeIs(initialMin, initialMax)
      setAxisRange(100, 1000)
      assertAxisRangeIs(100, 1000)
      setAxisRange(-23, 901)
      assertAxisRangeIs(-23, 901)

      assertResult(true)(Try(setAxisRange(10, 0)).isFailure)

    }

    runForAxis(xmin, xmax)(X)
    runForAxis(ymin, ymax)(Y)

  }

}

trait PlottingHelpers {

  self: FunSuite =>

  private val model = {
    val input = Source.fromFile("models/Sample Models/Social Science/Wealth Distribution.nlogo")
    val nlogo = input.mkString
    input.close()
    CompiledModel.fromNlogoContents(nlogo) valueOr ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.mkString}"))
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

  protected def evalJS(js: String)(implicit nashorn: Nashorn): AnyRef =
    nashorn.eval(js)

  protected def evalNLReporter(netlogo: String)(implicit nashorn: Nashorn): AnyRef =
    evalNL(netlogo, model.compileReporter)

  protected def evalNLCommand(netlogo: String)(implicit nashorn: Nashorn): AnyRef =
    evalNL(netlogo, model.compileCommand(_))

  private def evalNL(netlogo: String, evaluator: (String) => CompiledModel.CompileResult[String])(implicit nashorn: Nashorn): AnyRef = {
    val result = evaluator(netlogo) valueOr ((nel) => throw new Exception(nel.list.mkString))
    nashorn.eval(result)
  }


  protected def assertAutoplottingness(ness: Boolean) (implicit n: Nashorn) = assertResult(Boolean.box(ness))(evalJS(s"$pathToPlot.isAutoplotting"))
  protected def assertColorIs(color: Double)          (implicit n: Nashorn) = assertResult(Double.box(color))(evalJS(s"$pathToPen.getColor()"))
  protected def assertDisplayModeIs(mode: DisplayMode)(implicit n: Nashorn) = assertResult(evalJS(s"PenBundle.DisplayMode.${mode.toDisplayModeStr}"))(evalJS(s"$pathToPen.getDisplayMode()"))
  protected def assertIntervalIs(interval: Double)    (implicit n: Nashorn) = assertResult(Double.box(interval))(evalJS(s"$pathToState.interval"))
  protected def assertIsAutoplotting()                (implicit n: Nashorn) = assertAutoplottingness(true)
  protected def assertIsntAutoplotting()              (implicit n: Nashorn) = assertAutoplottingness(false)
  protected def assertIsntTemp()                      (implicit n: Nashorn) = assertResult(Boolean.box(false))(evalJS(s"$pathToPen.isTemp"))
  protected def assertIsTemp()                        (implicit n: Nashorn) = assertResult(Boolean.box(true))(evalJS(s"$pathToPen.isTemp"))
  protected def assertPenExists(penName: String)      (implicit n: Nashorn) = assertResult(Boolean.box(true))(evalNLReporter(s"""plot-pen-exists? "$penName""""))
  protected def assertPenDoesntExist(penName: String) (implicit n: Nashorn) = assertResult(Boolean.box(false))(evalNLReporter(s"""plot-pen-exists? "$penName""""))
  protected def assertPenModeIs(penMode: PenMode)     (implicit n: Nashorn) = assertResult(evalJS(s"PenBundle.PenMode.${penMode.toPenModeStr}"))(evalJS(s"$pathToState.mode"))
  protected def assertPenNameIs(name: String)         (implicit n: Nashorn) = assertResult(name)(evalJS(s"$pathToPen.name"))
  protected def assertPlotNameIs(name: String)        (implicit n: Nashorn) = assertResult(name)(evalNLReporter("plot-name"))
  protected def assertYs(ys: Int*)                    (implicit n: Nashorn) = assertXYs(ys.zipWithIndex map (_.swap): _*)

  protected def assertAxisRangeIs(min: Double, max: Double)(implicit n: Nashorn, axis: Axis) = {
    assertResult(Double.box(min))(evalNLReporter(s"plot-${axis.toAxisStr}-min"))
    assertResult(Double.box(max))(evalNLReporter(s"plot-${axis.toAxisStr}-max"))
  }

  protected def assertPenProperties(name: String, isTemp: Boolean, color: Double, interval: Double, displayMode: DisplayMode, penMode: PenMode)(implicit n: Nashorn) = {
    assertPenNameIs(name)
    if (isTemp) assertIsTemp() else assertIsntTemp()
    assertColorIs(color)
    assertIntervalIs(interval)
    assertDisplayModeIs(displayMode)
    assertPenModeIs(penMode)
  }

  protected def assertXYs(xys: (Int, Int)*)(implicit n: Nashorn) = {
    val expectedStr = xys.mkString(",")
    val actualStr   = evalJS(s"$pathToPen._points.map(function(p){ return '(' + p.x + ',' + p.y + ')'; }).toString()")
    assertResult(expectedStr)(actualStr)
  }

  protected def clearPlot()                      (implicit n: Nashorn) = evalNLCommand("clear-plot")
  protected def clearAllPlots()                  (implicit n: Nashorn) = evalNLCommand("clear-all-plots")
  protected def createTempPen(name: String)      (implicit n: Nashorn) = evalNLCommand(s"""create-temporary-plot-pen \"$name\"""")
  protected def disableAutoplotting()            (implicit n: Nashorn) = evalNLCommand("auto-plot-off")
  protected def enableAutoplotting()             (implicit n: Nashorn) = evalNLCommand("auto-plot-on")
  protected def histogram(ys: Double*)           (implicit n: Nashorn) = evalNLCommand(s"histogram ${ys.mkString("[", " ", "]")}")
  protected def lowerPen()                       (implicit n: Nashorn) = evalNLCommand("plot-pen-down")
  protected def plot(y: Double)                  (implicit n: Nashorn) = evalNLCommand(s"plot $y")
  protected def plotxy(x: Double, y: Double)     (implicit n: Nashorn) = evalNLCommand(s"plotxy $x $y")
  protected def raisePen()                       (implicit n: Nashorn) = evalNLCommand("plot-pen-up")
  protected def resetPen()                       (implicit n: Nashorn) = evalNLCommand("plot-pen-reset")
  protected def setColor(color: Double)          (implicit n: Nashorn) = evalNLCommand(s"set-plot-pen-color $color")
  protected def setInterval(x: Double)           (implicit n: Nashorn) = evalNLCommand(s"set-plot-pen-interval $x")
  protected def setDisplayMode(mode: DisplayMode)(implicit n: Nashorn) = evalNLCommand(s"set-plot-pen-mode ${mode.toInt}")
  protected def setPlot(name: String)            (implicit n: Nashorn) = evalNLCommand(s"""set-current-plot "$name"""")
  protected def setPen(name: String)             (implicit n: Nashorn) = evalNLCommand(s"""set-current-plot-pen "$name"""")

  protected def setAxisRange(min: Double, max: Double)(implicit n: Nashorn, axis: Axis) =
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

  protected def testPlotting(name: String, tags: Tag*)(testFun: (Nashorn) => Unit): Unit = {

    val preCode =
      """var PenBundle = tortoise_require('engine/plot/pen');
        |var PlotOps   = tortoise_require('engine/plot/plotops');
        |
        |var DummyOps = (function(_super) {
        |
        |    __hasProp = {}.hasOwnProperty;
        |    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
        |    __extends(DummyOps, _super);
        |
        |    function DummyOps() {
        |
        |      var resize      = function() {};
        |      var reset       = function() {};
        |      var registerPen = function() {};
        |
        |      var resetPen      = function() { return function() {}; };
        |      var addPoint      = function() { return function() {}; };
        |      var updatePenMode = function() { return function() {}; };
        |
        |      DummyOps.__super__.constructor.call(this, resize, reset, registerPen, resetPen, addPoint, updatePenMode);
        |
        |    }
        |
        |    return DummyOps;
        |
        |})(PlotOps);
        |
        |window.modelConfig = {
        |  plotOps: {
        |    'test-plot': new DummyOps()
        |  }
        |};""".stripMargin

    val nashorn = new Nashorn
    nashorn.eval(preCode)
    nashorn.eval(model.compiledCode)

    test(name, tags: _*)(testFun(nashorn))

  }

  protected val pathToPlot  = "plotManager._currentPlot"
  protected val pathToPen   = s"$pathToPlot._currentPen"
  protected val pathToState = s"$pathToPen._state"

}
