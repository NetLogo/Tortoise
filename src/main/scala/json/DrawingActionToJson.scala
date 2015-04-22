// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.{ api, drawing },
    api.Color,
    drawing.{ TurtleStamp, LinkStamp, DrawingAction },
      DrawingAction.{ ClearDrawing, DrawLine, StampImage }

import
  org.json4s.{ JArray, JDouble, JInt, JObject, JString }

sealed trait DrawingActionConverter[T <: DrawingAction] extends JsonConverter[T] {

  protected def `type`: String

  override protected def baseProps: JObject =
    JObject(List("type" -> JString(`type`)))

  protected def colorList(c: AnyRef): List[Int] = {
    val awtColor = Color.getColor(c)
    List(awtColor.getRed, awtColor.getGreen, awtColor.getBlue)
  }

}

object DrawingActionToJsonConverters {
  implicit def drawingAction2Json(target: DrawingAction): JsonWritable =
    target match {
      case ClearDrawing  => ClearDrawingConverter
      case s: StampImage => new StampImageConverter(s)
      case d: DrawLine   => new DrawLineConverter(d)
      case x             => throw new Exception(s"IMPLEMENT ME! $x")
    }
}

object ClearDrawingConverter extends DrawingActionConverter[ClearDrawing.type] {
  override protected val target     = ClearDrawing
  override protected val `type`     = "clear-drawing"
  override protected val extraProps = JObject(Nil)
}

class StampImageConverter(override protected val target: StampImage) extends DrawingActionConverter[StampImage] {

  override protected val `type` = "stamp-image"

  private val (agentType, stampProperties) =
    target.stamp match {

      case t: TurtleStamp =>
        import t._
        val obj =
          JObject(
            "color"     -> JArray(colorList(color).map(JInt(_))),
            "heading"   -> JDouble(heading),
            "size"      -> JDouble(size),
            "x"         -> JDouble(x),
            "y"         -> JDouble(y),
            "shapeName" -> JString(shapeName)
          )

        ("turtle", obj)

      case l: LinkStamp   =>
        import l._
        val obj =
          JObject(
            "color"     -> JArray(colorList(color).map(JInt(_))),
            "heading"   -> JDouble(heading),
            "midpointX" -> JDouble(midpointX),
            "midpointY" -> JDouble(midpointY),
            "shapeName" -> JString(shapeName),
            "x1"        -> JDouble(x1),
            "x2"        -> JDouble(x2),
            "y1"        -> JDouble(y1),
            "y2"        -> JDouble(y2)
          )

        ("link", obj)

    }

  override protected val extraProps =
    JObject(List(
      "agentType" -> JString(agentType),
      "stamp"     -> stampProperties
    ))

}

class DrawLineConverter(override protected val target: DrawLine) extends DrawingActionConverter[DrawLine] {

  override protected val `type` = "line"

  import target._

  override protected val extraProps =
    JObject(List(
      "fromX"   -> JDouble(x1),
      "fromY"   -> JDouble(y1),
      "rgb"     -> JArray(colorList(penColor).map(JInt(_))),
      "size"    -> JDouble(penSize),
      "toX"     -> JDouble(x2),
      "toY"     -> JDouble(y2),
      "penMode" -> JString(penMode)
    ))

}
