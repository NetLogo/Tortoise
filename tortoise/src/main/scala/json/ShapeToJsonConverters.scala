// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.core.Shape, Shape.{ VectorShape, LinkShape, LinkLine }

import TortoiseJson._
import scala.language.implicitConversions

sealed trait ShapeConverter[T <: Shape] extends JsonConverter[T]

object ShapeToJsonConverters {

  implicit def shape2Json(shape: Shape): JsonWritable =
    shape match {
      case vs: VectorShape => new VectorShapeConverter(vs)
      case ls: LinkShape   => new LinkShapeConverter(ls)
    }

  class VectorShapeConverter(override protected val target: VectorShape) extends ShapeConverter[VectorShape] {
    import org.nlogo.tortoise.json.ElemToJsonConverters.elem2Json
    override protected val extraProps = JsObject(fields(
      "rotate"   -> JsBool(target.rotatable),
      "elements" -> JsArray((target.elements map (_.toJsonObj)).toList)
    ))
  }

  class LinkShapeConverter(override protected val target: LinkShape) extends ShapeConverter[LinkShape] {
    private def lineToJS(line: LinkLine): JsObject = {
      JsObject(fields(
        "x-offset"   -> JsDouble(line.xcor),
        "is-visible" -> JsBool(line.isVisible),
        "dashes"     -> JsArray(line.dashChoices.toList.map(x => JsDouble(x)))
      ))
    }

    override protected val extraProps: JsObject = {
      JsObject(fields(
        "direction-indicator" -> new VectorShapeConverter(target.indicator).toJsonObj,
        "curviness"           -> JsDouble(target.curviness),
        "lines"               -> JsArray(target.linkLines.map(lineToJS).toList)
      ))
    }
  }
}
