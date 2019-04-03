// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JsOps.{ jsArrayString, jsFunction, jsString, sanitizeNil, thunkifyFunction, thunkifyProcedure }

import
  org.nlogo.core.{ Color, Pen }

import
  scalaz.NonEmptyList

import
  TortoiseSymbol.{ JsDeclare, JsStatement, JsRequire }

import
  WidgetCompilation.UpdateableCompilation

object PlotCompiler {

  trait PlotComponentRendition
  case class ErrorAlert(messages: Seq[String])       extends PlotComponentRendition
  case class SuccessfulComponent(plotObject: String) extends PlotComponentRendition

  def formatPlots(widgets: Seq[CompiledWidget]): Seq[TortoiseSymbol] = {

    val (plotObjects, plotErrors) =
      formatObjectsAndErrors(
        widgets.collect { case cp: CompiledPlot => cp }.map(_.renderJS),
        jsArrayString(_), es => alertFailure(es.mkString(", ")))

    Seq(
      JsRequire("PenBundle", "engine/plot/pen"),
      JsRequire("Plot",      "engine/plot/plot"),
      JsRequire("PlotOps",   "engine/plot/plotops"),

      JsDeclare("modelPlotOps", getOrElse("modelConfig.plotOps")("{}"), Seq("modelConfig")),

      JsStatement(
        "modelConfig.plots",
        s"modelConfig.plots = $plotObjects;$plotErrors",
        Seq("PenBundle", "Plot", "PlotOps", "modelConfig", "modelPlotOps")))
  }

  private def alertFailure(s: String) =
    s"""modelConfig.dialog.notify("Error: $s");"""

  private def formatObjectsAndErrors(
    renditions:         Seq[PlotComponentRendition],
    aggregateSuccesses: Seq[String] => String,
    aggregateFailures:  Seq[String] => String): (String, String) = {
      val successes = renditions.collect { case sp: SuccessfulComponent => sp.plotObject }
      val errors    = renditions.collect { case ea: ErrorAlert          => ea.messages }.flatten
      (aggregateSuccesses(successes),
        if (errors.isEmpty) "" else aggregateFailures(errors))
    }

  implicit class RichCompiledPlot(compiledPlot: CompiledPlot) {
    import compiledPlot.{ cleanDisplay, plotWidgetCompilation }

    def renderJS: PlotComponentRendition =
      plotWidgetCompilation.fold(
        showPlotErrors,
        pwc => constructNewPlot(pwc.compiledSetupCode, pwc.compiledUpdateCode, pwc.compiledPens))

    private def constructNewPlot(compiledSetup: String,
                                compiledUpdate: String,
                                compiledPens:   Seq[CompiledPen]): SuccessfulComponent = {
      import compiledPlot.plot._

      val noop         = thunkifyProcedure("")
      val arity2Noop   = thunkifyFunction(noop)
      val emptyPlotOps = s"new PlotOps($noop, $noop, $noop, $arity2Noop, $arity2Noop, $arity2Noop, $arity2Noop)"

      val (plotPens, penErrors) = formatObjectsAndErrors(compiledPens.map(renderPen),
        jsArrayString(_, "\n"), es => alertFailure(es.mkString(", ")))

      val args =
        Seq("name", "pens", "plotOps", jsString(sanitizeNil(xAxis.getOrElse(""))),
            jsString(sanitizeNil(yAxis.getOrElse(""))), legendOn, autoPlotOn, xmin,
            xmax, ymin, ymax, "setup", "update").mkString(", ")

      val plotConstructor =
        s"""|var name    = '$cleanDisplay';
            |var plotOps = ${getOrElse("modelPlotOps[name]")(emptyPlotOps)};
            |var pens    = $plotPens;$penErrors
            |var setup   = $compiledSetup;
            |var update  = $compiledUpdate;
            |return new Plot($args);""".stripMargin

      SuccessfulComponent(s"(${jsFunction(body = plotConstructor)})()")

    }

    private def showPlotErrors(es: NonEmptyList[Exception]): ErrorAlert =
      ErrorAlert(es.map(_.getMessage).list.toList)

    def renderPen(compiledPen: CompiledPen): PlotComponentRendition = {
      def constructNewPen(pen: Pen)(compilation: UpdateableCompilation): SuccessfulComponent = {
        import pen._

        val state  =
          s"new PenBundle.State(${Color.getClosestColorNumberByARGB(color)}, $interval, ${displayModeToJS(mode)})"
        val penArgs = Seq(s"'$display'", "plotOps.makePenOps", "false", state, compilation.compiledSetupCode, compilation.compiledUpdateCode)
        SuccessfulComponent(s"new PenBundle.Pen(${penArgs.mkString(", ")})")
      }

      def displayModeToJS(mode: Int): String =
        s"PenBundle.DisplayMode.${mode match {
          case 0 => "Line"
          case 1 => "Bar"
          case 2 => "Point"
          case _ => "Line"
        }}"

      def showPenErrors(pen: Pen)(ces: NonEmptyList[Exception]): ErrorAlert =
        ErrorAlert(ces.map(_.getMessage).list.toList)

      compiledPen.updateableCompilation.fold(showPenErrors(compiledPen.pen), constructNewPen(compiledPen.pen))
    }
  }

  private def getOrElse(expr: String)(`default`: String): String =
    s"""(typeof $expr !== "undefined" && $expr !== null) ? $expr : ${`default`}"""

}
