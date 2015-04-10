// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  java.awt.Color

import
  org.nlogo.core.Shape.{ RgbColor, Element, Circle, Line, Polygon, Rectangle }

import org.json4s._
import scala.language.implicitConversions

sealed trait ElemConverter[T <: Element] extends JsonConverter[T] {

  protected def typ: String = target.getClass.getSimpleName.toString.toLowerCase

  final override protected def baseProps: JObject =
    JObject(List(
      "type"   -> JString(typ),
      "color"  -> serializeColor(target.color),
      "filled" -> JBool(target.filled),
      "marked" -> JBool(target.marked)
    ))

  private def serializeColor(c: RgbColor): JValue = {
    val (r, g, b, a) = (c.red, c.green, c.blue, c.alpha / 255.0)
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
      "xcors" -> JArray((target.xCoords map (x => JInt(x.intValue))).toList),
      "ycors" -> JArray((target.yCoords map (x => JInt(x.intValue))).toList)
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
      "x"    -> JInt(target.x.toInt),
      "y"    -> JInt(target.y.toInt),
      "diam" -> JInt(target.diameter.toInt)
    ))
  }

  class LineConverter(override protected val target: Line) extends ElemConverter[Line] {
    override protected val typ        = "line"
    override protected val extraProps = JObject(List(
      "x1" -> JInt(target.startPoint._1),
      "y1" -> JInt(target.startPoint._2),
      "x2" -> JInt(target.endPoint._1),
      "y2" -> JInt(target.endPoint._2)
    ))
  }

  class OtherConverter(override protected val target: Element) extends ElemConverter[Element] {
    override protected val extraProps = JObject(List())
  }

}

