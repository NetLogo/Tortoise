// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.core.{ Button, Chooser, Col, InputBox,
    InputBoxType, Monitor, Num, Output, Pen, Plot, Slider, Switch, TextBox, View, Widget }

import
  scalaz.{ Scalaz, syntax, NonEmptyList, Validation, ValidationNel },
    Scalaz.ToValidationOps,
    syntax.std.option._,
    Validation.FlatMap.ValidationFlatMapRequested

import
  TortoiseJson.{ fields, JsBool, JsDouble, JsInt, JsObject, JsString }

import
  TortoiseJson.{ JsBool, JsDouble, JsInt, JsObject, JsString, fields }

object WidgetToJson {
  import WidgetRead._

  implicit object readWidgetJson extends JsonReader[TortoiseJson, Widget] {
    import scalaz.syntax.ToValidationOps
    def apply(json: TortoiseJson): ValidationNel[String, Widget] =
      json match {
        case j: JsObject =>
          j.props.get("type").toSuccess(NonEmptyList("no conversion available")).flatMap {
            case JsString("button")   => Jsonify.reader[JsObject, Button](j)
            case JsString("chooser")  => Jsonify.reader[JsObject, Chooser](j)
            case JsString("inputBox") =>
              j.props.get("boxtype").toSuccess(NonEmptyList("must supply boxtype for inputBox"))
                .flatMap(tortoiseJs2InputBoxType)
                .flatMap {
                  case Num => Jsonify.reader[JsObject, InputBox[Double]](j)
                  case Col => Jsonify.reader[JsObject, InputBox[Int]](j)
                  case _   => Jsonify.reader[JsObject, InputBox[String]](j)
                }
            case JsString("monitor")  => Jsonify.reader[JsObject, Monitor](j)
            case JsString("output")   => Jsonify.reader[JsObject, Output](j)
            case JsString("pen")      => Jsonify.reader[JsObject, Pen](j)
            case JsString("plot")     => Jsonify.reader[JsObject, Plot](j)
            case JsString("slider")   => Jsonify.reader[JsObject, Slider](j)
            case JsString("switch")   => Jsonify.reader[JsObject, Switch](j)
            case JsString("textBox")  => Jsonify.reader[JsObject, TextBox](j)
            case JsString("view")     => Jsonify.reader[JsObject, View](j)
            case other                => s"unknown widget type $other".failureNel[Widget]
          }
        case other => "Widgets must be represented as a JSON Object".failureNel[Widget]
      }
  }

  def read(json: TortoiseJson): ValidationNel[String, Widget] =
    JsonReader.read[Widget](json)

  implicit def widget2Json(w: Widget): JsonWritable =
    new JsonWritable {
      import WidgetWrite._
      def toJsonObj =
        w match {
          case b: Button      => Jsonify.writer[Button, TortoiseJson](b)
          case c: Chooser     => Jsonify.writer[Chooser, TortoiseJson](c)
          case i: InputBox[_] => new InputBoxConverter(i).toJsonObj
          case m: Monitor     => Jsonify.writer[Monitor, TortoiseJson](m)
          case o: Output      => Jsonify.writer[Output, TortoiseJson](o)
          case p: Pen         => Jsonify.writer[Pen, TortoiseJson](p)
          case p: Plot        => Jsonify.writer[Plot, TortoiseJson](p)
          case s: Slider      => Jsonify.writer[Slider, TortoiseJson](s)
          case s: Switch      => Jsonify.writer[Switch, TortoiseJson](s)
          case t: TextBox     => Jsonify.writer[TextBox, TortoiseJson](t)
          case v: View        => Jsonify.writer[View, TortoiseJson](v)
        }
    }

  class InputBoxConverter(target: InputBox[_]) extends JsonWritable {
    import WidgetWrite._
    def jsonVal(a: Any, boxtype: InputBoxType): TortoiseJson =
      (boxtype, a) match {
        case (Col, i: Int)    => JsInt(i)
        case (Num, d: Double) => JsDouble(d)
        case (_,   s: String) => JsString(s)
        case _                => throw new Exception("Invalid inputbox!")
      }

    val toJsonObj = JsObject(fields(
      "type"      -> "inputBox",
      "varName"   -> target.varName,
      "left"      -> JsInt(target.left),
      "top"       -> JsInt(target.top),
      "right"     -> JsInt(target.right),
      "bottom"    -> JsInt(target.bottom),
      "multiline" -> JsBool(target.multiline),
      "value"     -> jsonVal(target.value, target.boxtype),
      "boxtype"   -> target.boxtype.name))
  }
}
