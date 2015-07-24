// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  json.{ Jsonify, JsonWritable, JsonWriter, TortoiseJson, WidgetToJson },
    JsonWriter._,
    TortoiseJson.{ fields, JsArray, JsBool, JsInt, JsObject, JsString },
    WidgetToJson.widget2Json

import
  org.nlogo.core.{ CompilerException, Pen, Plot, Widget }

import
  scalaz.ValidationNel

import
  WidgetCompilation.{ PlotWidgetCompilation, UpdateableCompilation }

case class CompiledWidget(widgetData: Widget, widgetCompilation: ValidationNel[Exception, WidgetCompilation])

class CompiledPlot(val plot:               Plot,
                   val cleanDisplay:       String,
                   val plotWidgetCompilation: ValidationNel[Exception, PlotWidgetCompilation])
  extends CompiledWidget(plot, plotWidgetCompilation)

class CompiledPen(val pen:               Pen,
                  updateableCompilation: ValidationNel[Exception, UpdateableCompilation])
  extends CompiledWidget(pen, updateableCompilation) {
    override val widgetCompilation: ValidationNel[Exception, UpdateableCompilation] = updateableCompilation
  }

object CompiledWidget {

  def compiledWidgetToJson(compiledWidget: CompiledWidget): JsObject =
    JsObject(
      compiledWidget.widgetCompilation.fold(
        (e) => fields(),
        WidgetCompilation.widgetCompilation2Json(_).asInstanceOf[JsObject].props) ++
      compiledWidget.widgetData.toJsonObj.asInstanceOf[JsObject].props)

  implicit def compiledWidget2Json(compiledWidget: CompiledWidget): JsonWritable =
    new JsonWritable {
      def toJsonObj = compiledWidgetToJson(compiledWidget)
    }

  implicit object compiledPen2Json extends JsonWriter[CompiledPen] {
    def apply(compiledPen: CompiledPen): TortoiseJson =
      compiledWidgetToJson(compiledPen)
  }

  implicit object compiledPens2Json extends JsonWriter[Seq[CompiledPen]] {
    def apply(compiledPens: Seq[CompiledPen]): TortoiseJson =
      JsArray(compiledPens.map(compiledPen2Json(_)))
  }

  implicit object compiledWidgets2Json extends JsonWriter[Seq[CompiledWidget]] {
    def apply(l: Seq[CompiledWidget]): TortoiseJson = JsArray(l.map(_.toJsonObj))
  }
}

sealed trait WidgetCompilation {
  import WidgetCompilation.NamedFunction

  def compiledElements: Seq[NamedFunction] = Seq()

  def fold[T](init: T)(f: (T, NamedFunction) => T): T =
    compiledElements.foldLeft(init)(f)
}

object WidgetCompilation {
  type CompiledStringV = ValidationNel[Exception, String]

  type NamedFunction = (String, String)

  case object NotCompiled extends WidgetCompilation
  case class SourceCompilation(
    compiledSource: String) extends WidgetCompilation {
    override def compiledElements: Seq[NamedFunction] = Seq(
      "compiledSource" -> compiledSource)
  }
  case class UpdateableCompilation(
    compiledSetupCode: String,
    compiledUpdateCode: String) extends WidgetCompilation {
      override def compiledElements: Seq[NamedFunction] =
        Seq("compiledSetupCode"  -> compiledSetupCode,
            "compiledUpdateCode" -> compiledUpdateCode)
    }
  case class PlotWidgetCompilation(
    compiledSetupCode: String,
    compiledUpdateCode: String,
    compiledPens: Seq[CompiledPen]) extends WidgetCompilation {
      override def compiledElements: Seq[NamedFunction] =
        Seq("compiledSetupCode"  -> compiledSetupCode,
            "compiledUpdateCode" -> compiledUpdateCode)
  }
  case class SliderCompilation(
    compiledMin: String,
    compiledMax: String,
    compiledStep: String) extends WidgetCompilation {
      override def compiledElements: Seq[NamedFunction] =
        Seq("compiledMin"  -> compiledMin,
            "compiledMax"  -> compiledMax,
            "compiledStep" -> compiledStep)
  }

  implicit object compileError2Json extends JsonWriter[Throwable] {
    def apply(ex: Throwable): TortoiseJson =
      ex match {
        case compilerException: CompilerException =>
          JsObject(fields(
            "message" -> JsString(compilerException.getMessage),
            "start"   -> JsInt(compilerException.start),
            "end"     -> JsInt(compilerException.end)))
        case otherException                       =>
          JsObject(fields(
            "message" -> JsString(otherException.getMessage)))
      }
  }

  implicit object widgetCompilation2Json extends JsonWriter[WidgetCompilation] {
    def apply(widgetCompilation: WidgetCompilation): TortoiseJson =
      widgetCompilation match {
        case NotCompiled              => JsObject(fields())
        case s: SourceCompilation     => Jsonify.writer[SourceCompilation, TortoiseJson](s)
        case u: UpdateableCompilation => Jsonify.writer[UpdateableCompilation, TortoiseJson](u)
        case p: PlotWidgetCompilation => Jsonify.writer[PlotWidgetCompilation, TortoiseJson](p)
        case s: SliderCompilation     => Jsonify.writer[SliderCompilation, TortoiseJson](s)
      }
  }
}
