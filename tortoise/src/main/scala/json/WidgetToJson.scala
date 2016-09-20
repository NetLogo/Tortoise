// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  JsonReader.JsonSequenceReader

import
  org.nlogo.core.{ Button, Chooser, InputBox, Monitor, NumericInput, Output
                 , Pen, Plot, Slider, StringInput, Switch, TextBox, View, Widget },
    NumericInput.{ ColorLabel }

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationOps

import
  TortoiseJson.{ fields, JsBool, JsDouble, JsField, JsInt, JsObject, JsString }

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
          case b: Button      => Jsonify.writer[Button, TortoiseJson](b)
          case c: Chooser     => Jsonify.writer[Chooser, TortoiseJson](c)
          case i: InputBox    => Jsonify.writer[InputBox, TortoiseJson](i)
          case m: Monitor     => Jsonify.writer[Monitor, TortoiseJson](m)
          case o: Output      => Jsonify.writer[Output, TortoiseJson](o)
          case p: Pen         => Jsonify.writer[Pen, TortoiseJson](p)
          case p: Plot        => Jsonify.writer[Plot, TortoiseJson](p)
          case s: Slider      => Jsonify.writer[Slider, TortoiseJson](s)
          case s: Switch      => Jsonify.writer[Switch, TortoiseJson](s)
          case t: TextBox     => Jsonify.writer[TextBox, TortoiseJson](t)
          case v: View        => Jsonify.writer[View, TortoiseJson](v)
        }).asInstanceOf[JsObject]
    }
    // scalastyle:on cyclomatic.complexity

}
