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
  WidgetCompilation.{ CompiledStringV, PlotWidgetCompilation, UpdateableCompilation }

case class CompiledWidget(widgetData: Widget, widgetCompilation: WidgetCompilation)

class CompiledPlot(val plot:               Plot,
                   val cleanDisplay:       String,
                   val compiledSetupCode:  CompiledStringV,
                   val compiledUpdateCode: CompiledStringV,
                   val compiledPens:       Seq[CompiledPen])
  extends CompiledWidget(plot, PlotWidgetCompilation(compiledSetupCode, compiledUpdateCode, compiledPens))

class CompiledPen(val pen:                Pen,
                  val compiledSetupCode:  CompiledStringV,
                  val compiledUpdateCode: CompiledStringV)
  extends CompiledWidget(pen, UpdateableCompilation(compiledSetupCode, compiledUpdateCode))

object CompiledWidget {
  implicit def compileWidget2Json(compiledWidget: CompiledWidget): JsonWritable =
    new JsonWritable {
      def toJsonObj = JsObject(
        WidgetCompilation.widgetCompilation2Json(compiledWidget.widgetCompilation).asInstanceOf[JsObject].props ++
        compiledWidget.widgetData.toJsonObj.asInstanceOf[JsObject].props)
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

  type NamedFunction = (String, CompiledStringV)

  case object NotCompiled extends WidgetCompilation
  case class SourceCompilation(
    compiledSource: CompiledStringV) extends WidgetCompilation {
    override def compiledElements: Seq[NamedFunction] = Seq(
      "compiledSource" -> compiledSource)
  }
  case class UpdateableCompilation(
    compiledSetupCode: CompiledStringV,
    compiledUpdateCode: CompiledStringV) extends WidgetCompilation {
      override def compiledElements: Seq[NamedFunction] =
        Seq("compiledSetupCode"  -> compiledSetupCode,
            "compiledUpdateCode" -> compiledUpdateCode)
  }
  case class PlotWidgetCompilation(
    compiledSetupCode: CompiledStringV,
    compiledUpdateCode: CompiledStringV,
    compiledPens: Seq[CompiledWidget]) extends WidgetCompilation {
      override def compiledElements: Seq[NamedFunction] =
        Seq("compiledSetupCode"  -> compiledSetupCode,
            "compiledUpdateCode" -> compiledUpdateCode)
  }
  case class SliderCompilation(
    compiledMin: CompiledStringV,
    compiledMax: CompiledStringV,
    compiledStep: CompiledStringV) extends WidgetCompilation {
      override def compiledElements: Seq[NamedFunction] =
        Seq("compiledMax"  -> compiledMax,
            "compiledMin"  -> compiledMin,
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

  implicit object compileResult2Json extends JsonWriter[CompiledStringV] {
    def apply(compileResult: CompiledStringV): TortoiseJson =
      compileResult.fold(
        es => JsObject(fields(
          "success" -> JsBool(false),
          "result"  -> JsArray(es.list.toList.map(compileError2Json)))),
        success => JsObject(fields(
          "success" -> JsBool(true),
          "result"  -> JsString(success))))
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
