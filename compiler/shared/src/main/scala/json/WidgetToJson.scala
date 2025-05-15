// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  JsonReader.JsonSequenceReader

import
  org.nlogo.tortoise.macros.json.Jsonify

import
  org.nlogo.core.{ Button, Chooser, InputBox, Monitor, Output
                 , Pen, Plot, Slider, Switch, TextBox, View, Widget }

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationOps

import
  scala.language.implicitConversions

import
  TortoiseJson.{ JsField, JsObject, JsString }

import
  org.nlogo.tortoise.compiler.utils.CompilerUtils

object WidgetToJson {
  implicit object readWidgetJson extends JsonReader[TortoiseJson, Widget] {
    def apply(json: TortoiseJson): ValidationNel[String, Widget] = {
      val matchType = JsField("type")
      json match {
        case j@JsObject(matchType(JsString(WidgetRead(reader)))) =>
          reader(j)
        case other =>
          "Widgets must be represented as a JSON Object with type specified".failureNel[Widget]
      }
    }
  }

  implicit object readWidgetsJson extends JsonSequenceReader[Widget] {
    def nonArrayErrorString(json: TortoiseJson): String =
      s"expected an array of Widgets, found $json"

    def convertElem(json: TortoiseJson): ValidationNel[String, Widget] = readWidgetJson(json)
  }

  def read(json: TortoiseJson): ValidationNel[String, Widget] =
    JsonReader.read[Widget](json)

  // scalastyle:off cyclomatic.complexity
  implicit def widget2Json(w: Widget): JsonWritable =
    new JsonWritable {
      import WidgetWrite._
      def toJsonObj: JsObject =
        (w match {
          case b: Button   => Jsonify.writer[Button, TortoiseJson](b)
          case c: Chooser  => Jsonify.writer[Chooser, TortoiseJson](c)
          case i: InputBox => Jsonify.writer[InputBox, TortoiseJson](i)
          case m: Monitor  => Jsonify.writer[Monitor, TortoiseJson](m)
          case o: Output   => Jsonify.writer[Output, TortoiseJson](o)
          case p: Pen      => Jsonify.writer[Pen, TortoiseJson](p)
          case p: Plot     => Jsonify.writer[Plot, TortoiseJson](p)
          case s: Slider   => Jsonify.writer[Slider, TortoiseJson](s)
          case s: Switch   => Jsonify.writer[Switch, TortoiseJson](s)
          case t: TextBox  => Jsonify.writer[TextBox, TortoiseJson](t)
          case v: View     => Jsonify.writer[View, TortoiseJson](v)
          case _           => CompilerUtils.failCompilation(s"Unknown widget type encountered: ${w.toString}")
        }).asInstanceOf[JsObject]
    }
    // scalastyle:on cyclomatic.complexity

}
