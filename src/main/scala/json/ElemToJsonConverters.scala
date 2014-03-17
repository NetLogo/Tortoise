// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise.json

import
  java.awt.Color

import
  org.nlogo.shape.{ Circle, Element, Line, Polygon, Rectangle }

import org.json4s._
import scala.language.implicitConversions

sealed trait ElemConverter[T <: Element] extends JsonConverter[T] {

  protected def typ: String = target.toString

  final override protected def baseProps: JObject =
    JObject(List(
      "type"   -> JString(typ),
      "color"  -> serializeColor(target.getColor),
      "filled" -> JBool(target.filled),
      "marked" -> JBool(target.marked)
    ))

  private def serializeColor(c: Color): JValue = {
    val (r, g, b, a) = (c.getRed, c.getGreen, c.getBlue, c.getAlpha / 255.0)
    JString(s"rgba($r, $g, $b, $a)")
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
    import scala.collection.JavaConverters._
    override protected val typ        = "polygon"
    override protected val extraProps = JObject(List(
      "xcors" -> JArray((target.getXcoords.asScala map (x => JInt(x.intValue))).toList),
      "ycors" -> JArray((target.getYcoords.asScala map (x => JInt(x.intValue))).toList)
    ))
  }

  class RectangleConverter(override protected val target: Rectangle) extends ElemConverter[Rectangle] {
    override protected val typ        = "rectangle"
    override protected val extraProps = JObject(List(
      "xmin" -> JInt(target.getX.toInt),
      "ymin" -> JInt(target.getY.toInt),
      "xmax" -> JInt((target.getX + target.getWidth).toInt),
      "ymax" -> JInt((target.getY + target.getHeight).toInt)
    ))
  }

  class CircleConverter(override protected val target: Circle) extends ElemConverter[Circle] {
    override protected val typ        = "circle"
    override protected val extraProps = JObject(List(
      "x"    -> JInt(target.getBounds.getX.toInt),
      "y"    -> JInt(target.getBounds.getY.toInt),
      "diam" -> JInt(target.getBounds.getWidth.toInt)
    ))
  }

  class LineConverter(override protected val target: Line) extends ElemConverter[Line] {
    override protected val typ        = "line"
    override protected val extraProps = JObject(List(
      "x1" -> JInt(target.getStart.getX.toInt),
      "y1" -> JInt(target.getStart.getY.toInt),
      "x2" -> JInt(target.getEnd.getX.toInt),
      "y2" -> JInt(target.getEnd.getY.toInt)
    ))
  }

  class OtherConverter(override protected val target: Element) extends ElemConverter[Element] {
    override protected val extraProps = JObject(List())
  }

}

