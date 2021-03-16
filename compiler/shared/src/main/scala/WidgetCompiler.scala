// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JavascriptObject.JsFunction

import
  json.{ JsonWriter, TortoiseJson },
    JsonWriter._,
    TortoiseJson.JsObject

import
  JsOps.{ jsArrayString, sanitizeNil, thunkifyFunction, thunkifyProcedure }

import
  org.nlogo.core.{ Button, CompilerException, Monitor, Pen, Plot, Slider, Token, Widget }

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

        val Seq(compiledSetup, compiledUpdate) =
          Seq("setup" -> p.setupCode, "update" -> p.updateCode).map {
            case (name, code) =>
              compileInContext(code, cleanDisplay).contextualizeError("plot", cleanDisplay, name)
          }

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
    val invalidPlots =
      widgets.filter(_.isInstanceOf[Plot]).groupBy {
        case p: Plot => p.display
      }.filter(_._2.size > 1)
    if (invalidPlots.nonEmpty) {
      import Token.Eof
      val message =
        s"Having multiple plots with same display name is not supported. Duplicate names detected: ${invalidPlots.keys.mkString(", ")}"
      throw new CompilerException(message, Eof.start, Eof.end, Eof.filename)
    }
  }

  private def addContext(s: String) =
    s"var R = null;\n$s"

  private def compileButton(b: Button): ValidationNel[Exception, SourceCompilation] = {
    def askWithKind(kind: String)(command: String): String = {
      def fail(kind: String): Nothing =
        throw new IllegalArgumentException(s"This type of agent cannot be asked: $kind")

      def askBlock(agents: String)(logoAsk: String): String =
        s"ask $agents [ $logoAsk ]"

      val kindToAgentSetString = Map[String, String => String](
        "OBSERVER" -> identity _,
        "TURTLE"   -> askBlock("turtles") _,
        "PATCH"    -> askBlock("patches") _,
        "LINK"     -> askBlock("links")   _)

      kindToAgentSetString.getOrElse(kind, fail(kind)).apply(command)
    }

    def sanitizeSource(s: String) =
      s.replace("\\n", "\n").replace("\\\\", "\\").replace("\\\"", "\"")

    val asked     = askWithKind(b.buttonKind.toString.toUpperCase)(b.source.getOrElse(""))
    val sanitized = sanitizeSource(asked)
    compileCommand(sanitized)
      .contextualizeError("button", b.display.orElse(b.source).getOrElse(""), "source")
      .map( (s) => SourceCompilation.apply(addContext(s)) )
  }

  private def compileMonitor(m: Monitor): ExceptionValidation[SourceCompilation] =
    compileReporter(m.source.getOrElse(""))
      .contextualizeError("monitor", m.display.orElse(m.source).getOrElse(""), "reporter")
      .map(SourceCompilation.apply _)

  private def compileSlider(s: Slider): ExceptionValidation[SliderCompilation] = {
    def sliderError(name: String, reporter: String): ExceptionValidation[String] =
      compileReporter(reporter).contextualizeError("slider", s.display.getOrElse(s.varName), name)

    val Seq(max, min, step) =
      Seq("min" -> s.min, "max" -> s.max, "step" -> s.step).map((sliderError _).tupled)

    Apply[ExceptionValidation].apply3(max, min, step)(SliderCompilation.apply)
  }

  private def compilePen(ownerName: String)(pen: Pen): CompiledPen = {
    val Seq(setup, update) = Seq("setup" -> pen.setupCode, "update" -> pen.updateCode).map {
      case (name, code) =>
        compileInContext(code,  ownerName, Option(pen.display))
          .contextualizeError("pen", Option(pen.display).getOrElse(""), name)
    }

    new CompiledPen(pen, Apply[ExceptionValidation].apply2(setup, update)(UpdateableCompilation.apply))
  }

  private def compileInContext(code: String, plotNameRaw: String, penNameOpt: Option[String] = None): CompiledStringV = {
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
