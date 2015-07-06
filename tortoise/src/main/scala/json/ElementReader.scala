// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  JsonReader.JsonSequenceReader

import
  org.nlogo.core.Shape.{ Element, RgbColor }

import
  TortoiseJson.{ JsInt, JsObject, JsString }

import
  scalaz.{ syntax, Scalaz, Validation, ValidationNel },
    Scalaz.ToValidationOps,
    syntax.nel._

object ElementReader {
  type ElementV = ValidationNel[String, Element]

  implicit object tortoiseJs2SeqInt extends JsonSequenceReader[Int] {
    def convertElem(json: TortoiseJson): ValidationNel[String, Int] =
      json match {
        case JsInt(i) => i.success
        case other    =>
          s"Expected all coordinates to be ints, found $other".failureNel
      }

    def nonArrayErrorString(json: TortoiseJson): String =
      s"Expected an array of ints, found $json"
  }
  implicit object tortoiseJs2RgbColor extends JsonReader[TortoiseJson, RgbColor] {
    import scala.util.matching.Regex
    def apply(json: TortoiseJson): ValidationNel[String, RgbColor] = {
      val colorRegex = """rgba\((\d+), (\d+), (\d+), ([.0-9]+)\)""".r
      json match {
        case JsString(colorRegex(rawR, rawG, rawB, rawA)) =>
          Validation.fromTryCatchNonFatal(
            RgbColor(rawR.toInt, rawG.toInt, rawB.toInt, (rawA.toDouble * 255.0).toInt)
          ).leftMap(e => s"problem deserializing RGBA color value: ${e.getMessage}".wrapNel)
        case other => s"could not convert $json to RGBA color".failureNel
      }
    }
  }

  private lazy val readerMap: Map[String, JsObject => ElementV] = Map(
    "line"      -> Jsonify.reader[JsObject, JsonLine],
    "circle"    -> Jsonify.reader[JsObject, JsonCircle],
    "rectangle" -> Jsonify.reader[JsObject, JsonRectangle],
    "polygon"   -> Jsonify.reader[JsObject, JsonPolygon]
  )

  def unapply(tpe: String): Option[JsObject => ElementV] =
    readerMap.get(tpe)
}
