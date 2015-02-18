// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.{ api, drawing },
    api.Color,
    drawing.DrawingAction, DrawingAction._

import org.json4s._

sealed trait DrawingActionConverter[T <: DrawingAction] extends JsonConverter[T] {

  protected def typ: String

  final override protected def baseProps: JObject =
    JObject(List(
      "type" -> JString(typ)))
}

object DrawingActionToJsonConverters {
  implicit def drawingAction2Json(target: DrawingAction): JsonWritable =
    target match {
      case ClearDrawing => ClearDrawingConverter
      case s: StampImage => new StampImageConverter(s)
      case d: DrawLine   => new DrawLineConverter(d)
      case x => throw new Exception(s"IMPLEMENT ME! $x")
    }
}

object ClearDrawingConverter extends DrawingActionConverter[ClearDrawing.type] {
  val target = ClearDrawing
  val typ = "clear-drawing"
  val extraProps = JObject(List())
}

class StampImageConverter(val target: StampImage) extends DrawingActionConverter[StampImage] {
  val typ = "stamp-image"
  val extraProps = JObject(List())
}

class DrawLineConverter(val target: DrawLine) extends DrawingActionConverter[DrawLine] {
  val typ = "line"

  def color: List[Int] = {
    val awtColor = Color.getColor(target.penColor)
    List(awtColor.getRed, awtColor.getGreen, awtColor.getBlue)
  }

  val extraProps = JObject(List(
    "fromX" -> JDouble(target.x1),
    "fromY" -> JDouble(target.y1),
    "rgb" -> JArray(color.map(JInt(_))),
    "size" -> JDouble(target.penSize),
    "toX" -> JDouble(target.x2),
    "toY" -> JDouble(target.y2),
    "penMode" -> JString(target.penMode)
  ))
}
