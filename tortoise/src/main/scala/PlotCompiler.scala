// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  JsOps.{ jsArrayString, jsFunction, jsString, sanitizeNil, thunkifyFunction, thunkifyProcedure }

import
  org.nlogo.core.{ Color, CompilerException, Model, Pen, Plot, Token }

import
  scalaz.{ Success, syntax, NonEmptyList, ValidationNel },
    syntax.{ apply => applysyntax, ToValidationOps },
      applysyntax._

import
  TortoiseSymbol.{ JsDeclare, JsStatement, JsRequire }

import
  WidgetCompilation.UpdateableCompilation

object PlotCompiler {
  private def getOrElse(expr: String)(`default`: String): String =
    s"""(typeof $expr !== "undefined" && $expr !== null) ? $expr : ${`default`}"""

  def formatPlots(widgets: Seq[CompiledWidget]): Seq[TortoiseSymbol] = {
    val plots = widgets.collect { case cp: CompiledPlot => cp }

    // If `javax` exists, we're in Nashorn, and, therefore, testing --JAB (3/2/15)
    val defaultModelConfigOutput = s"""|if (typeof javax !== "undefined") {
                                       |  modelConfig.output = {
                                       |    clear: ${jsFunction()},
                                       |    write: ${jsFunction(Seq("str"), "context.getWriter().print(str);")}
                                       |  }
                                       |}""".stripMargin

    Seq(
      JsRequire("PenBundle", "engine/plot/pen"),
      JsRequire("Plot",      "engine/plot/plot"),
      JsRequire("PlotOps",   "engine/plot/plotops"),

      JsDeclare("modelConfig",  getOrElse("window.modelConfig")("{}")),
      JsDeclare("modelPlotOps", getOrElse("modelConfig.plotOps")("{}"), Seq("modelConfig")),

      JsStatement(
        "modelConfig.plots",
        s"modelConfig.plots = ${jsArrayString(plots.map(_.toJS))};",
        Seq("PenBundle", "Plot", "PlotOps", "modelConfig", "modelPlotOps")),
      JsStatement("modelConfig.output", defaultModelConfigOutput, Seq("modelConfig")))
  }

  implicit class RichCompiledPlot(compiledPlot: CompiledPlot) {
    import compiledPlot.{ cleanDisplay, plotWidgetCompilation }

    def toJS: String =
      plotWidgetCompilation.fold(
        showPlotErrors,
        pwc => constructNewPlot(pwc.compiledSetupCode, pwc.compiledUpdateCode, pwc.compiledPens))

    private def constructNewPlot(compiledSetup: String, compiledUpdate: String, compiledPens: Seq[CompiledPen]): String = {
      import compiledPlot.plot._

      val noop         = thunkifyProcedure("")
      val arity2Noop   = thunkifyFunction(noop)
      val emptyPlotOps = s"new PlotOps($noop, $noop, $noop, $arity2Noop, $arity2Noop, $arity2Noop, $arity2Noop)"

      val plotPens   = jsArrayString(compiledPens.map(penToJS), "\n")
      // TODO: Figure how this fits in...
      // .fold(
      //  e => "console.log(\"error\");",
      //  pens => jsArrayString(pens, "\n"))

      val args =
        Seq("name", "pens", "plotOps", jsString(sanitizeNil(xAxis)), jsString(sanitizeNil(yAxis)),
          legendOn, xmin, xmax, ymin, ymax, "setup", "update").mkString(", ")

      var plotContructor =
        s"""|var name    = '$cleanDisplay';
            |var plotOps = ${getOrElse("modelPlotOps[name]")(emptyPlotOps)};
            |var pens    = $plotPens;
            |var setup   = $compiledSetup;
            |var update  = $compiledUpdate;
            |return new Plot($args);""".stripMargin

      s"(${jsFunction(body = plotContructor)})()"
    }

    private def showPlotErrors(es: NonEmptyList[Exception]): String = {
      val formattedErrors = es.map(_.getMessage).list.mkString(", ")
      s"""modelConfig.output.write("Errors in plot $cleanDisplay initialization $formattedErrors");"""
    }

    def penToJS(compiledPen: CompiledPen): String = {
      def constructNewPen(pen: Pen)(compilation: UpdateableCompilation): String = {
        import pen._

        val state =
          s"new PenBundle.State(${Color.getClosestColorNumberByARGB(color)}, $interval, ${displayModeToJS(mode)})"
        s"new PenBundle.Pen('$display', plotOps.makePenOps, false, $state, ${compilation.compiledSetupCode}, ${compilation.compiledUpdateCode})"
      }

      def displayModeToJS(mode: Int): String =
        s"PenBundle.DisplayMode.${mode match {
          case 0 => "Line"
          case 1 => "Bar"
          case 2 => "Point"
          case _ => "Line"
        }}"

      def showPenErrors(pen: Pen)(ces: NonEmptyList[Exception]): String = {
        val formattedErrors = ces.map(_.getMessage).list.mkString(", ")
        s"""modelConfig.output.write("Errors in pen ${pen.display} initialization $formattedErrors");"""
      }

      compiledPen.widgetCompilation.fold(
        showPenErrors(compiledPen.pen), constructNewPen(compiledPen.pen))
    }
  }
}
