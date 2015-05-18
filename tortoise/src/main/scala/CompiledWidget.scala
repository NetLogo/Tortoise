// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  json.{ Jsonify, JsonWritable, JsonWriter, TortoiseJson, WidgetToJson },
    JsonWriter._,
    TortoiseJson.{ fields, JsArray, JsBool, JsInt, JsObject, JsString },
    WidgetToJson.widget2Json

import
  org.nlogo.core.{ CompilerException, Widget }

import
  scalaz.ValidationNel

case class CompiledWidget(widgetData: Widget, widgetCompilation: WidgetCompilation)

object CompiledWidget {
  implicit def compileWidget2Json(compiledWidget: CompiledWidget): JsonWritable =
    new JsonWritable {
      def toJsonObj = JsObject(
        WidgetCompilation.widgetCompilation2Json(compiledWidget.widgetCompilation).asInstanceOf[JsObject].props ++
        compiledWidget.widgetData.toJsonObj.asInstanceOf[JsObject].props)
    }

  implicit object compiledWidgets2Json extends JsonWriter[Seq[CompiledWidget]] {
    def apply(l: Seq[CompiledWidget]) = JsArray(l.map(_.toJsonObj))
  }
}

sealed trait WidgetCompilation

object WidgetCompilation {
  type CompiledStringV = ValidationNel[Exception, String]
  case object NotCompiled extends WidgetCompilation
  case class SourceCompilation(
    compiledSource: CompiledStringV) extends WidgetCompilation
  case class UpdateableCompilation(
    compiledSetupCode: CompiledStringV,
    compiledUpdateCode: CompiledStringV) extends WidgetCompilation
  case class PlotWidgetCompilation(
    compiledSetupCode: CompiledStringV,
    compiledUpdateCode: CompiledStringV,
    compiledPens: Seq[CompiledWidget]) extends WidgetCompilation
  case class SliderCompilation(compiledMin: CompiledStringV,
    compiledMax: CompiledStringV,
    compiledStep: CompiledStringV) extends WidgetCompilation

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
          "result" -> JsArray(es.list.toList.map(compileError2Json)))),
        success => JsObject(fields(
          "success" -> JsBool(true),
          "result" -> JsString(success))))
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
