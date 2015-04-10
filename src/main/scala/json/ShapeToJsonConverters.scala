// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.{ core, shape },
    core.Shape,
      Shape.{ LinkShape, VectorShape }

import org.json4s._
import scala.language.implicitConversions

sealed trait ShapeConverter[T <: Shape] extends JsonConverter[T]

object ShapeToJsonConverters {

  implicit def shape2Json(shape: Shape): JsonWritable =
    shape match {
      case vs: VectorShape => new VectorShapeConverter(vs)
      case ls: LinkShape   => new LinkShapeConverter(ls)
    }

  class VectorShapeConverter(override protected val target: VectorShape) extends ShapeConverter[VectorShape] {
    import scala.collection.JavaConverters._
    import org.nlogo.tortoise.json.ElemToJsonConverters.elem2Json
    override protected val extraProps = JObject(
      "rotate"   -> JBool(target.rotatable),
      "elements" -> JArray((target.elements.map (_.toJsonObj)).toList)
    )
  }

  class LinkShapeConverter(override protected val target: LinkShape) extends ShapeConverter[LinkShape] {

    private def lineToJS(index: Int): JObject = {
      val line = target.linkLines(index)
      JObject(
        "x-offset"     -> JDecimal(line.xcor),
        "is-visible"   -> JBool(line.isVisible),
        "dash-pattern" -> JArray(line.dashChoices.toList.map(x => JDecimal(x)))
      )
    }

    override protected val extraProps: JObject = {
      val dirIndicator = target.indicator.asInstanceOf[VectorShape]
      JObject(
        "direction-indicator" -> new VectorShapeConverter(dirIndicator).toJsonObj,
        "curviness"           -> JDecimal(target.curviness),
        "lines"               -> JArray(0 until 3 map lineToJS toList)
      )
    }

  }

}
