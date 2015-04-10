// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.{ api, drawing },
    api.Color,
    drawing.{ TurtleStamp, LinkStamp, DrawingAction },
      DrawingAction._

import org.json4s._

sealed trait DrawingActionConverter[T <: DrawingAction] extends JsonConverter[T] {

  protected def typ: String

  final override protected def baseProps: JObject =
    JObject(List(
      "type" -> JString(typ)))

  protected def colorList(c: AnyRef): List[Int] = {
    val awtColor = Color.getColor(c)
    List(awtColor.getRed, awtColor.getGreen, awtColor.getBlue)
  }
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

  private val (agentType, stampProperties) = target.stamp match {
    case t: TurtleStamp =>
      import t._
      ("turtle", JObject(
        "color" -> JArray(colorList(color).map(JInt(_))),
        "heading" -> JDouble(heading),
        "size" -> JDouble(size),
        "x" -> JDouble(x),
        "y" -> JDouble(y),
        "shapeName" -> JString(shapeName)))
      case l: LinkStamp   =>
        import l._
        ("link"  , JObject(
          "color" -> JArray(colorList(color).map(JInt(_))),
          "heading" -> JDouble(heading),
          "midpointX" -> JDouble(midpointX),
          "midpointY" -> JDouble(midpointY),
          "shapeName" -> JString(shapeName),
          "x1" -> JDouble(x1),
          "x2" -> JDouble(x2),
          "y1" -> JDouble(y1),
          "y2" -> JDouble(y2)
        ))
  }

  val extraProps = JObject(List(
    "agentType" -> JString(agentType),
    "stamp"      -> stampProperties
  ))
}

class DrawLineConverter(val target: DrawLine) extends DrawingActionConverter[DrawLine] {
  val typ = "line"

  import target._

  val extraProps = JObject(List(
    "fromX" -> JDouble(x1),
    "fromY" -> JDouble(y1),
    "rgb" -> JArray(colorList(penColor).map(JInt(_))),
    "size" -> JDouble(penSize),
    "toX" -> JDouble(x2),
    "toY" -> JDouble(y2),
    "penMode" -> JString(penMode)
  ))
}
