// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.nlogo.tortoise.compiler.{ CompiledPen, CompiledPlot, PlotCompiler, WidgetCompilation, json },
    WidgetCompilation.{ PlotWidgetCompilation, UpdateableCompilation },
    json.WidgetSamples.{ plot => plotWidget }

import
  jsengine.GraalJS

import org.scalatest.OneInstancePerTest
import org.scalatest.funsuite.AnyFunSuite

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationOps

class PlotCompilerTest extends AnyFunSuite with OneInstancePerTest {

  lazy val jsRuntime = {
    val e = (new GraalJS())
    e.setupTortoise()
    e.eval("modelConfig = {};")
    e.eval("modelPlotOps = {};")
    e.eval("function PlotOps() {};")
    // Capture the pens each plot is built with, so a test can tell which ones survived compilation.
    e.eval("var lastPlot = null; function Plot(name, pens) { lastPlot = { name: name, pens: pens }; };")
    e.eval("""PenBundle = { Pen: function(display) { this.display = display; }, State: function() {}
             |           , DisplayMode: { Line: 0, Bar: 1, Point: 2 } };""".stripMargin)
    e
  }

  def compiledPlot(compilationV: ValidationNel[Exception, PlotWidgetCompilation]) =
    new CompiledPlot(plotWidget, "plot-abc", compilationV)

  def plotJs(plot: CompiledPlot): String =
    PlotCompiler.formatPlots(Seq(plot)).filter(_.provides == "modelConfig.plots").head.toJS

  def compilePlotWidgetV(compilationV: ValidationNel[Exception, PlotWidgetCompilation]): String =
    plotJs(compiledPlot(compilationV))

  def workingPen(display: String): CompiledPen =
    new CompiledPen(
      plotWidget.pens.head.copy(display = display)
    , UpdateableCompilation("function() {}", "function() {}").successNel[Exception]
    )

  def failingPen(display: String, message: String): CompiledPen =
    new CompiledPen(
      plotWidget.pens.head.copy(display = display)
    , new Exception(message).failureNel[UpdateableCompilation]
    )

  def plotCount(): Double =
    jsRuntime.eval("modelConfig.plots.length").asInstanceOf[Double]

  def penNames(): Seq[String] =
    jsRuntime.eval("lastPlot.pens.map( (p) => p.display ).join(',')").asInstanceOf[String] match {
      case ""    => Seq()
      case names => names.split(",").toSeq
    }

  test("a plot that fails to compile is left out") {
    jsRuntime.eval(compilePlotWidgetV(new Exception("plot plot-abc has problems").failureNel))
    assert(plotCount() == 0)
  }

  test("a pen that fails to compile is left out") {
    val widgetCompilation =
      PlotWidgetCompilation("function() {}", "function() {}", Seq(failingPen("pen-abc", "pen has problems")))
        .successNel[Exception]
    jsRuntime.eval(compilePlotWidgetV(widgetCompilation))
    // The plot itself compiled, so it is still here -- just without the pen.
    assert(plotCount() == 1)
    assert(penNames().isEmpty)
  }

  test("one bad pen does not take the plot's good pens with it") {
    val pens = Seq(workingPen("good-pen"), failingPen("bad-pen", "pen has problems"), workingPen("other-good-pen"))
    val widgetCompilation =
      PlotWidgetCompilation("function() {}", "function() {}", pens).successNel[Exception]
    jsRuntime.eval(compilePlotWidgetV(widgetCompilation))
    assert(plotCount() == 1)
    assert(penNames() == Seq("good-pen", "other-good-pen"))
  }

  test("returns valid javascript when plots are correct") {
    val widgetCompilation =
      PlotWidgetCompilation("function() {}", "function() {}", Seq()).successNel[Exception]
    jsRuntime.eval(compilePlotWidgetV(widgetCompilation))
    assert(plotCount() == 1)
  }
}
