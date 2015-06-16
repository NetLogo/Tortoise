// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  JsOps.{ jsArrayString, jsFunction, jsString, sanitizeNil, thunkifyFunction, thunkifyProcedure }

import
  org.nlogo.core.{ Color, CompilerException, Model, Pen, Plot, Token }

import
  scalaz.{ syntax, NonEmptyList, ValidationNel },
    syntax.{ apply => applysyntax, ToValidationOps },
      applysyntax._

import
  TortoiseSymbol.{ JsDeclare, JsStatement, JsRequire }

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
    import compiledPlot.{ cleanDisplay, compiledPens, compiledSetupCode, compiledUpdateCode }

    def toJS: String =
      (compiledSetupCode |@| compiledUpdateCode)(constructNewPlot)
        .fold(showPlotErrors, identity)

    private def constructNewPlot(compiledSetup: String, compiledUpdate: String): String = {
      import compiledPlot.plot._

      val noop       = thunkifyProcedure("")
      val arity2Noop = thunkifyFunction(noop)
      val plotOps    = s"new PlotOps($noop, $noop, $noop, $arity2Noop, $arity2Noop, $arity2Noop, $arity2Noop)"

      val plotPens   = jsArrayString(compiledPens.map(penToJS), "\n")

      val args =
        Seq("name", "pens", "plotOps", jsString(sanitizeNil(xAxis)), jsString(sanitizeNil(yAxis)),
          legendOn, xmin, xmax, ymin, ymax, "setup", "update").mkString(", ")

      var plotContructor =
        s"""|var name    = '$cleanDisplay';
            |var plotOps = ${getOrElse("modelPlotOps[name]")(plotOps)};
            |var pens    = $plotPens;
            |var setup   = $compiledSetup;
            |var update  = $compiledUpdate;
            |return new Plot($args);""".stripMargin

      s"(${jsFunction(body = plotContructor)})()"
    }

    private def showPlotErrors(ces: NonEmptyList[Exception]): String = {
      val formattedErrors = ces.map(_.getMessage).list.mkString(", ")
      s"""modelConfig.output.write("Errors in plot $cleanDisplay initialization $formattedErrors");"""
    }

    def penToJS(compiledPen: CompiledPen): String = {
      def constructNewPen(compiledSetup: String, compiledUpdate: String): String = {
        import compiledPen.pen._
        val state =
          s"new PenBundle.State(${Color.getClosestColorNumberByARGB(color)}, $interval, ${displayModeToJS(mode)})"
        s"new PenBundle.Pen('$display', plotOps.makePenOps, false, $state, $compiledSetup, $compiledUpdate)"
      }

      def displayModeToJS(mode: Int): String =
        s"PenBundle.DisplayMode.${mode match {
          case 0 => "Line"
          case 1 => "Bar"
          case 2 => "Point"
          case _ => "Line"
        }}"

      def showPenErrors(ces: NonEmptyList[Exception]): String = {
        val formattedErrors = ces.map(_.getMessage).list.mkString(", ")
        s"""modelConfig.output.write("Errors in pen ${compiledPen.pen.display} initialization $formattedErrors");"""
      }

      (compiledPen.compiledSetupCode |@| compiledPen.compiledUpdateCode)(constructNewPen)
        .fold(showPenErrors, identity)
    }
  }
}
