// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.nlogo.tortoise.compiler.{ CompiledPen, CompiledPlot, PlotCompiler, WidgetCompilation, json },
    WidgetCompilation.PlotWidgetCompilation,
    json.WidgetSamples.{ plot => plotWidget }

import
  jsengine.GraalJS

import org.scalatest.OneInstancePerTest
import org.scalatest.funsuite.AnyFunSuite

import
  scalaz.{ NonEmptyList, Scalaz, ValidationNel },
    Scalaz.ToValidationOps

class PlotCompilerTest extends AnyFunSuite with OneInstancePerTest {
  class FakeDialog {
    var alertsReceived = Seq[String]()

    def notify(s: String): Unit =
      alertsReceived = alertsReceived :+ s
  }

  lazy val dialog = new FakeDialog()

  lazy val jsRuntime = {
    val e = (new GraalJS())
    e.setupTortoise()
    e.put("fakeDialog", dialog)
    e.eval("modelConfig = { dialog: fakeDialog };")
    e.eval("modelPlotOps = {};")
    e.eval("function PlotOps() {};")
    e.eval("function Plot() {};")
    e
  }

  def compiledPlot(compilationV: ValidationNel[Exception, PlotWidgetCompilation]) =
    new CompiledPlot(plotWidget, "plot-abc", compilationV)

  def plotJs(plot: CompiledPlot): String =
    PlotCompiler.formatPlots(Seq(plot)).filter(_.provides == "modelConfig.plots").head.toJS

  def compilePlotWidgetV(compilationV: ValidationNel[Exception, PlotWidgetCompilation]): String =
    plotJs(compiledPlot(compilationV))

  test("returns valid javascript when plots have errors") {
    val generatedJs =
      compilePlotWidgetV(new Exception("plot plot-abc has problems").failureNel)
    jsRuntime.eval(generatedJs)
    assert(dialog.alertsReceived.head == "Error: plot plot-abc has problems")
  }

  test("returns valid javascript when pens have errors") {
    val errantPen = new CompiledPen(plotWidget.pens.head, new Exception("pen has problems").failureNel)
    val widgetCompilation =
      PlotWidgetCompilation("function() {}", "function() {}", Seq(errantPen)).successNel[Exception]
    val generatedJs = compilePlotWidgetV(widgetCompilation)
    jsRuntime.eval(generatedJs)
    assert(dialog.alertsReceived.head == "Error: pen-abc, pen has problems")
  }

  test("returns multiple errors when there are multiple pen errors") {
    val errantPens = new CompiledPen(plotWidget.pens.head, NonEmptyList(new Exception("pen a has problems"), new Exception("pen b has problems")).failure)
    val widgetCompilation =
      PlotWidgetCompilation("function() {}", "function() {}", Seq(errantPens)).successNel[Exception]
    val generatedJs = compilePlotWidgetV(widgetCompilation)
    jsRuntime.eval(generatedJs)
    assert(dialog.alertsReceived.head == "Error: pen-abc, pen a has problems, pen b has problems")
  }

  test("returns valid javascript when plots are correct") {
    val widgetCompilation =
      PlotWidgetCompilation("function() {}", "function() {}", Seq()).successNel[Exception]
    val generatedJs = compilePlotWidgetV(widgetCompilation)
    jsRuntime.eval(generatedJs)
    assert(dialog.alertsReceived.isEmpty)
  }
}
