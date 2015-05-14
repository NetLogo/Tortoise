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

object WidgetToJson {
  import WidgetRead._

  implicit object readWidgetJson extends JsonReader[TortoiseJson, Widget] {
    import scalaz.syntax.ToValidationOps
    def apply(json: TortoiseJson): ValidationNel[String, Widget] = {
      def failure(unexpectedType: AnyRef) = s"unknown widget type $unexpectedType".failureNel[Widget]
      json match {
        case j: JsObject =>
          j.props.get("type").toSuccess(NonEmptyList("no conversion available")).flatMap {
            case JsString(widgetType) => readerMap.getOrElse(widgetType, failure _).apply(j)
            case other                => failure(other)
          }
        case other => "Widgets must be represented as a JSON Object".failureNel[Widget]
      }
    }

    private val readerMap: Map[String, JsObject => ValidationNel[String, Widget]] =
      Map(
        "button"   -> Jsonify.reader[JsObject, Button],
        "chooser"  -> Jsonify.reader[JsObject, Chooser],
        "inputBox" -> inputBoxReader _,
        "monitor"  -> Jsonify.reader[JsObject, Monitor],
        "output"   -> Jsonify.reader[JsObject, Output],
        "pen"      -> Jsonify.reader[JsObject, Pen],
        "plot"     -> Jsonify.reader[JsObject, Plot],
        "slider"   -> Jsonify.reader[JsObject, Slider],
        "switch"   -> Jsonify.reader[JsObject, Switch],
        "textBox"  -> Jsonify.reader[JsObject, TextBox],
        "view"     -> Jsonify.reader[JsObject, View]
      )

    private def inputBoxReader(j: JsObject): ValidationNel[String, Widget] =
      j.props.get("boxtype").toSuccess(NonEmptyList("must supply boxtype for inputBox"))
        .flatMap(tortoiseJs2InputBoxType)
        .flatMap {
          case Num => Jsonify.reader[JsObject, InputBox[Double]](j)
          case Col => Jsonify.reader[JsObject, InputBox[Int]](j)
          case _   => Jsonify.reader[JsObject, InputBox[String]](j)
        }
  }

  def read(json: TortoiseJson): ValidationNel[String, Widget] =
    JsonReader.read[Widget](json)

  // scalastyle:off cyclomatic.complexity
  implicit def widget2Json(w: Widget): JsonWritable =
    new JsonWritable {
      import WidgetWrite._
      def toJsonObj: TortoiseJson =
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
    // scalastyle:on cyclomatic.complexity

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
