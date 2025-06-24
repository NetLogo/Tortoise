// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  JsonReader.JsonSequenceReader

import
  org.nlogo.core.Shape,
    Shape.{ Element, LinkLine, LinkShape, VectorShape }

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationOps

import
  scala.language.implicitConversions

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsObject, JsString }

sealed trait ShapeConverter[T <: Shape] extends JsonConverter[T]

object ShapeToJsonConverters {
  implicit def shape2Json(shape: Shape): JsonWritable =
    shape match {
      case vs: VectorShape => new VectorShapeConverter(vs)
      case ls: LinkShape   => new LinkShapeConverter(ls)
    }

  implicit def linkLine2Json(line: LinkLine): JsonWritable =
    new JsonWritable {
      val toJsonObj =
        JsObject(fields(
          "x-offset"     -> JsDouble(line.xcor),
          "is-visible"   -> JsBool(line.isVisible),
          "dash-pattern" -> JsArray(line.dashChoices.map(JsDouble(_)))
        ))
    }

  implicit object tortoiseJs2ElementSeq extends JsonSequenceReader[Element] {
    def convertElem(json: TortoiseJson): ValidationNel[String, Element] =
      ElemToJsonConverters.read(json)

    def nonArrayErrorString(json: TortoiseJson): String =
      s"$json is not a valid shape element list"
  }

  implicit object tortoiseJs2FloatSeq extends JsonSequenceReader[Float] {
    import JsonReader.tortoiseJs2Double

    def convertElem(json: TortoiseJson): ValidationNel[String, Float] =
      tortoiseJs2Double.apply(json).map(_.toFloat)

    def nonArrayErrorString(json: TortoiseJson): String =
      s"$json was not an array of floats"
  }

  implicit object tortoiseJs2VectorShape extends JsonReader[TortoiseJson, VectorShape] {
    def apply(json: TortoiseJson): ValidationNel[String, VectorShape] =
      readVectorShape(json)
  }

  implicit object tortoiseJs2LinkLineSeq extends JsonSequenceReader[LinkLine] {
    def convertElem(json: TortoiseJson): ValidationNel[String, LinkLine] =
      readLinkLine(json)

    def nonArrayErrorString(json: TortoiseJson): String =
      s"Expected link lines as array of objects, got $json"
  }

  def readVectorShapes(json: TortoiseJson): ValidationNel[String, Seq[VectorShape]] =
    readShapes(tortoiseJs2VectorShapes, json)

  def readLinkShapes(json: TortoiseJson): ValidationNel[String, Seq[LinkShape]] =
    readShapes(tortoiseJs2LinkShapes, json)

  implicit val tortoiseJs2VectorShapes: JsonSequenceReader[VectorShape] = new JsonSequenceReader[VectorShape] {
    def convertElem(json: TortoiseJson): ValidationNel[String, VectorShape] =
      readVectorShape(json)

    def nonArrayErrorString(json: TortoiseJson): String =
      s"Expected vector shapes as array of objects, got $json"
  }

  implicit val tortoiseJs2LinkShapes: JsonSequenceReader[LinkShape] = new JsonSequenceReader[LinkShape] {
    def convertElem(json: TortoiseJson): ValidationNel[String, LinkShape] =
      readLinkShape(json)

    def nonArrayErrorString(json: TortoiseJson): String =
      s"Expected link shapes as array of objects, got $json"
  }

  private def addNameToObject(name: String, jsObj: TortoiseJson) =
    jsObj match {
      case JsObject(props) => JsObject(props + ("name" -> JsString(name)))
      case js              => js
    }

  private def readShapes[T](reader: JsonSequenceReader[T], shapes: TortoiseJson): ValidationNel[String, Seq[T]] = {
    shapes match {
      case JsObject(props) => reader(JsArray(props.map((addNameToObject).tupled).toSeq))
      case json            => reader(json)
    }
  }

  def readVectorShape(json: TortoiseJson): ValidationNel[String, VectorShape] =
    json match {
      case j: JsObject => JsonVectorShapeReader(j)
      case other       => s"Expected shape as json object, got $other".failureNel
    }

  def readLinkShape(json: TortoiseJson): ValidationNel[String, LinkShape] =
    json match {
      case j: JsObject => JsonLinkShapeReader(j)
      case other       => s"Expected shape as json object, got $other".failureNel
    }

  def readLinkLine(json: TortoiseJson): ValidationNel[String, LinkLine] =
    json match {
      case j: JsObject => JsonLinkLineReader(j)
      case _           => s"Expected link line json, found: $json".failureNel
    }

  class VectorShapeConverter(override protected val target: VectorShape) extends ShapeConverter[VectorShape] {
    import org.nlogo.tortoise.compiler.json.ElemToJsonConverters.elem2Json
    override protected val extraProps = JsObject(fields(
      "name"               -> JsString(target.name),
      "editableColorIndex" -> JsInt(target.editableColorIndex),
      "rotate"             -> JsBool(target.rotatable),
      "elements"           -> JsArray((target.elements map (_.toJsonObj)).toList)
    ))
  }

  class LinkShapeConverter(override protected val target: LinkShape) extends ShapeConverter[LinkShape] {
    override protected val extraProps: JsObject =
      JsObject(fields(
        "name"                -> JsString(target.name),
        "direction-indicator" -> new VectorShapeConverter(target.indicator).toJsonObj,
        "curviness"           -> JsDouble(target.curviness),
        "lines"               -> JsArray(target.linkLines.map(_.toJsonObj))
      ))
  }
}
