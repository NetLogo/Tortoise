// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
package org.nlogo.tortoise

import
  org.nlogo.core,
   core.{ Color, CompilerException, Model, Pen, Plot, Token }

private[tortoise] trait ModelConfigGenerator {

  private type CompileFunc = (String) => CompileString

  def genModelConfig(model: Model)(compileCommand: (String) => String): String = {

    // Janky, but I wrap it in a dummy class in order to avoid implicit resolution errors. --JAB (10/17/14)
    implicit val compile = compileCommand andThen CompileString.apply

    val invalidPlots = model.plots.groupBy(_.display).filter(_._2.size > 1)
    if (invalidPlots.nonEmpty) {
      import Token.Eof
      val message = s"Having multiple plots with same display name is not supported.  Duplicate names detected: ${invalidPlots.keys.mkString(", ")}"
      throw new CompilerException(message, Eof.start, Eof.end, Eof.filename)
    }

    // If `javax` exists, we're in Nashorn, and, therefore, testing --JAB (3/2/15)
    s"""var modelConfig  = ${getOrElse("window.modelConfig")("{}")};
       |var modelPlotOps = ${getOrElse("modelConfig.plotOps")("{}")};
       |
       |var PenBundle = tortoise_require('engine/plot/pen');
       |var Plot      = tortoise_require('engine/plot/plot');
       |var PlotOps   = tortoise_require('engine/plot/plotops');
       |
       |modelConfig.plots = ${model.plots.map(_.toJS).mkString("[", ", ", "]")};
       |if (typeof javax !== "undefined") { modelConfig.output = { clear: function(){}, write: function(str) { context.getWriter().print(str); } } }
       |
       |""".stripMargin

  }

  private val thunkifyProcedure = (str: String) => if (str.nonEmpty) s"function() { $str; }"        else "function() {}"
  private val thunkifyFunction  = (str: String) => if (str.nonEmpty) s"function() { return $str; }" else "function() {}"

  private val getOrElse = (expr: String) => (`default`: String) =>
    s"""(typeof $expr !== "undefined" && $expr !== null) ? $expr : ${`default`}"""

  private def compileInContext(code: String, plotNameRaw: String, penNameOpt: Option[String] = None)
                              (implicit compileCommand: CompileFunc): String = {
    val penName     = penNameOpt map (name => s"'$name'") getOrElse "undefined"
    val f           = (compileCommand andThen (_.value) andThen thunkifyProcedure)(code)
    val withContext = thunkifyProcedure(s"plotManager.withTemporaryContext('$plotNameRaw', $penName)($f)")
    thunkifyProcedure(s"workspace.rng.withAux($withContext)")
  }

  private implicit class EnhancedPlot(plot: Plot) {
    def toJS(implicit compileCommand: CompileFunc): String = {
      import plot._

      val noop       = thunkifyProcedure("")
      val arity2Noop = thunkifyFunction(noop)
      val plotOps    = s"new PlotOps($noop, $noop, $noop, $arity2Noop, $arity2Noop, $arity2Noop)"

      val cleanDisplay = sanitize(display)
      val plotPens     = pens.map(_.toJS(cleanDisplay)).mkString("[", ",\n", "]")
      val setup        = compileInContext(setupCode,  cleanDisplay)
      val update       = compileInContext(updateCode, cleanDisplay)

      s"""(function() {
           |  var name    = '$cleanDisplay';
           |  var plotOps = ${getOrElse("modelPlotOps[name]")(plotOps)};
           |  var pens    = $plotPens;
           |  var setup   = $setup;
           |  var update  = $update;
           |  return new Plot(name, pens, plotOps, '${sanitize(xAxis)}', '${sanitize(yAxis)}', $legendOn, $xmin, $xmax, $ymin, $ymax, setup, update);
           |})()""".stripMargin

    }
    private def sanitize(s: String): String = if (s != "NIL") s.replaceAllLiterally("'", "\\'") else ""
  }

  private implicit class EnhancedPen(pen: Pen) {

    def toJS(ownerName: String)(implicit compileCommand: CompileFunc): String = {
      import pen._
      val state  = s"new PenBundle.State(${Color.getClosestColorNumberByARGB(color)}, $interval, ${displayModeToJS(mode)})"
      val setup  = compileInContext(setupCode,  ownerName, Option(display))
      val update = compileInContext(updateCode, ownerName, Option(display))
      s"new PenBundle.Pen('$display', plotOps.makePenOps, false, $state, $setup, $update)"
    }

    private def displayModeToJS(mode: Int): String =
      s"PenBundle.DisplayMode.${mode match {
         case 0 => "Line"
         case 1 => "Bar"
         case 2 => "Point"
         case _ => "Line"
       }}"

  }

  private case class CompileString(value: String)

}
