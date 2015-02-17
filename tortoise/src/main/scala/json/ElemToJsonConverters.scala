// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.core.Shape.{ Circle, Element, Line, Polygon, Rectangle, RgbColor }

import
  TortoiseJson._

import
  scala.language.implicitConversions

sealed trait ElemConverter[T <: Element] extends JsonConverter[T] {

  protected def typ: String = target.toString

  final override protected def baseProps: JsObject =
    JsObject(fields(
      "type"   -> JsString(typ),
      "color"  -> serializeColor(target.color),
      "filled" -> JsBool(target.filled),
      "marked" -> JsBool(target.marked)
    ))

  private def serializeColor(c: RgbColor): TortoiseJson = {
    val (r, g, b, a) = (c.red, c.green, c.blue, c.alpha / 255.0)
    JsString(s"rgba($r, $g, $b, $a)")
  }

}

object ElemToJsonConverters {

  implicit def elem2Json(target: Element): JsonWritable =
    target match {
      case p: Polygon   => new PolygonConverter(p)
      case r: Rectangle => new RectangleConverter(r)
      case c: Circle    => new CircleConverter(c)
      case l: Line      => new LineConverter(l)
      case e            => new OtherConverter(e)
    }

  class PolygonConverter(override protected val target: Polygon) extends ElemConverter[Polygon] {
    override protected val typ        = "polygon"
    override protected val extraProps = JsObject(fields(
      "xcors" -> JsArray((target.xCoords map (JsInt(_))).toList),
      "ycors" -> JsArray((target.yCoords map (JsInt(_))).toList)
    ))
  }

  class RectangleConverter(override protected val target: Rectangle) extends ElemConverter[Rectangle] {
    override protected val typ        = "rectangle"
    override protected val extraProps = JsObject(fields(
      "xmin" -> JsInt(target.upperLeftCorner._1),
      "ymin" -> JsInt(target.upperLeftCorner._2),
      "xmax" -> JsInt(target.lowerRightCorner._1),
      "ymax" -> JsInt(target.lowerRightCorner._2)
    ))
  }

  class CircleConverter(override protected val target: Circle) extends ElemConverter[Circle] {
    override protected val typ        = "circle"
    override protected val extraProps = JsObject(fields(
      "x"    -> JsInt(target.x),
      "y"    -> JsInt(target.y),
      "diam" -> JsInt(target.diameter)
    ))
  }

  class LineConverter(override protected val target: Line) extends ElemConverter[Line] {
    override protected val typ        = "line"
    override protected val extraProps = JsObject(fields(
      "x1" -> JsInt(target.startPoint._1),
      "y1" -> JsInt(target.startPoint._2),
      "x2" -> JsInt(target.endPoint._1),
      "y2" -> JsInt(target.endPoint._2)
    ))
  }

  class OtherConverter(override protected val target: Element) extends ElemConverter[Element] {
    override protected val extraProps = JsObject(fields())
  }

}

