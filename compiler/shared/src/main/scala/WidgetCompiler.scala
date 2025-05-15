// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JavascriptObject.JsFunction

import json.TortoiseJson.JsObject

import
  JsOps.{ jsArrayString, sanitizeNil, thunkifyFunction, thunkifyProcedure }

import
  org.nlogo.core.{ Button, Monitor, Pen, Plot, Slider, Widget }

import
  org.nlogo.tortoise.compiler.utils.CompilerUtils

import
  scalaz.{ Apply, Scalaz, Success, ValidationNel },
    Scalaz.ToValidationOps

import
  WidgetCompilation._

import
  WidgetCompiler.{ ExceptionValidation, ValidationContextualizer }


class WidgetCompiler(
  compileCommand:  String => CompiledStringV,
  compileReporter: String => CompiledStringV
) {

  def compileWidgets(widgets: Seq[Widget]): Seq[CompiledWidget] = {
    validatePlots(widgets)
    widgets.map(compileWidget)
  }

  private def compileWidget(w: Widget): CompiledWidget =
    w match {
      case p: Plot    =>
        val cleanDisplay = sanitizeNil(p.display.getOrElse(""))

        val compiledSetup  = compileInPlotContext(p.setupCode,  cleanDisplay).contextualizeError("plot", cleanDisplay, "setup")
        val compiledUpdate = compileInPlotContext(p.updateCode, cleanDisplay).contextualizeError("plot", cleanDisplay, "update")

        val compilation =
          Apply[ExceptionValidation].apply2(compiledSetup, compiledUpdate)(
            PlotWidgetCompilation(_, _, p.pens.map(compilePen(cleanDisplay))))
        new CompiledPlot(p, cleanDisplay, compilation)

      case b: Button  => CompiledWidget(b, compileButton(b))
      case m: Monitor => CompiledWidget(m, compileMonitor(m))
      case s: Slider  => CompiledWidget(s, compileSlider(s))
      case _          => CompiledWidget(w, NotCompiled.successNel)
    }

  private def validatePlots(widgets: Seq[Widget]): Unit = {
    val plots = widgets.flatMap({
      case p: Plot => Some(p)
      case _       => None
    })
    val invalidPlots = plots.groupBy( (p) => p.display ).filter(_._2.size > 1)
    if (invalidPlots.nonEmpty) {
      val message =
        s"Having multiple plots with same display name is not supported. Duplicate names detected: ${invalidPlots.keys.mkString(", ")}"
      CompilerUtils.failCompilation(message)
    }
  }

  private def compileButton(b: Button): ValidationNel[Exception, SourceCompilation] = {
    def askWithKind(kind: String)(command: String): String = {
      def fail(kind: String): Nothing =
        throw new IllegalArgumentException(s"This type of agent cannot be asked: $kind")

      def askBlock(agents: String, checkAllDead: Boolean)(logoAsk: String): String = {
        val ask = s"ask $agents [ $logoAsk ]"
        if (!checkAllDead) {
          ask
        } else {
          s"ifelse count $agents = 0 [ stop ] [ $ask ]"
        }
      }

      val kindToAgentSetString = Map[String, String => String](
        "OBSERVER" -> identity[String],
        "TURTLE"   -> askBlock("turtles", true),
        "PATCH"    -> askBlock("patches", false),
        "LINK"     -> askBlock("links",   true)
      )

      kindToAgentSetString.getOrElse(kind, fail(kind)).apply(command)
    }

    def sanitizeSource(s: String) =
      s.replace("\\n", "\n").replace("\\\\", "\\").replace("\\\"", "\"")

    val asked     = askWithKind(b.buttonKind.toString.toUpperCase)(b.source.getOrElse(""))
    val sanitized = sanitizeSource(asked)
    compileCommand(sanitized)
      .contextualizeError("button", b.display.orElse(b.source).getOrElse(""), "source")
      .map(SourceCompilation.apply)
  }

  private def compileMonitor(m: Monitor): ExceptionValidation[SourceCompilation] =
    compileReporter(m.source.getOrElse(""))
      .map( (f) => s"ProcedurePrims.rng.withAux(${thunkifyFunction(f)})" )
      .contextualizeError("monitor", m.display.orElse(m.source).getOrElse(""), "reporter")
      .map(SourceCompilation.apply)

  private def compileSlider(s: Slider): ExceptionValidation[SliderCompilation] = {
    def sliderError(name: String, reporter: String): ExceptionValidation[String] =
      compileReporter(reporter)
        .map( (f) => s"ProcedurePrims.rng.withAux(${thunkifyFunction(f)})" )
        .contextualizeError("slider", s.display.getOrElse(s.varName), name)

    val min  = sliderError("min",  s.min)
    val max  = sliderError("max",  s.max)
    val step = sliderError("step", s.step)

    Apply[ExceptionValidation].apply3(max, min, step)(SliderCompilation.apply)
  }

  private def compilePen(ownerName: String)(pen: Pen): CompiledPen = {
    def comp(name: String, code: String) =
      compileInPlotContext(code, ownerName, Option(pen.display))
        .contextualizeError("pen", Option(pen.display).getOrElse(""), name)

    val setup  = comp("setup",  pen.setupCode)
    val update = comp("update", pen.updateCode)

    new CompiledPen(pen, Apply[ExceptionValidation].apply2(setup, update)(UpdateableCompilation.apply))
  }

  private def compileInPlotContext(code: String, plotNameRaw: String, penNameOpt: Option[String] = None): CompiledStringV = {
    val penName       = penNameOpt map (name => s"'$name'") getOrElse "undefined"
    val inPlotContext = (f: String) => s"ProcedurePrims.runInPlotContext('$plotNameRaw', $penName, $f)"
    if (code.trim.isEmpty)
      thunkifyProcedure("").successNel
    else
      compileCommand(code) map thunkifyProcedure map
        (inPlotContext andThen thunkifyFunction)
  }
}

object WidgetCompiler {
  type ExceptionValidation[T] = ValidationNel[Exception, T]

  val monitorRenames = Map(
    "compiledSource" -> "reporter")

  val sliderRenames = Map(
    "compiledMin"  -> "getMin",
    "compiledMax"  -> "getMax",
    "compiledStep" -> "getStep")

  def formatWidgets(cws: Seq[CompiledWidget]): String =
    jsArrayString(cws.map(formatWidget(_).toJsString), "\n")

  def formatWidget(compiledWidget: CompiledWidget): JavascriptObject = {
      val javascriptObject =
        new JavascriptObject().addObjectProperties(compiledWidget.toJsonObj.asInstanceOf[JsObject])

      compiledWidget match {
        case CompiledWidget(monitor: Monitor, Success(comp: SourceCompilation)) =>
          comp.fold(javascriptObject)(addCompiledField(monitorRenames))
        case CompiledWidget(slider:  Slider,  Success(comp: SliderCompilation)) =>
          comp.fold(javascriptObject)(addCompiledField(sliderRenames))
        case cw => javascriptObject
      }
    }

  private def addCompiledField(fnNames: Map[String, String])
    (javascriptObject: JavascriptObject, compileResult: (String, String)) =
    compileResult match {
      case (fieldName, body) =>
        javascriptObject.addFunction(fnNames(fieldName), JsFunction(Seq(), Seq(s"return $body;")))
    }

  implicit class ValidationContextualizer(validation: CompiledStringV) {
    def contextualizeError(widgetType: String, widgetName: String, widgetField: String): CompiledStringV = {
      val context = s"$widgetType '$widgetName' - $widgetType.$widgetField"
      validation.leftMap(_.map(e => new Exception(s"$context: ${e.getMessage}")))
    }
  }
}
