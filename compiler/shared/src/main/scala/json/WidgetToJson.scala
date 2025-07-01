// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  JsonReader.JsonSequenceReader

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
        case _ =>
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
      def toJsonObj: JsObject =
        (w match {
          case b: Button   => ButtonWriter(b)
          case c: Chooser  => ChooserWriter(c)
          case i: InputBox => InputBoxWriter(i)
          case m: Monitor  => MonitorWriter(m)
          case o: Output   => OutputWriter(o)
          case p: Pen      => PenWriter(p)
          case p: Plot     => PlotWriter(p)
          case s: Slider   => SliderWriter(s)
          case s: Switch   => SwitchWriter(s)
          case t: TextBox  => TextBoxWriter(t)
          case v: View     => ViewWriter(v)
          case _           => CompilerUtils.failCompilation(s"Unknown widget type encountered: ${w.toString}")
        }).asInstanceOf[JsObject]
    }
    // scalastyle:on cyclomatic.complexity

}
