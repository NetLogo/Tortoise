// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.{ api, drawing },
    api.Color,
    drawing.{ DrawingAction, LinkStamp, TurtleStamp },
      DrawingAction.{ ClearDrawing, DrawLine, StampImage }

import
  TortoiseJson.{ fields, JsArray, JsDouble, JsInt, JsObject, JsString }

sealed trait DrawingActionConverter[T <: DrawingAction] extends JsonConverter[T] {

  protected def `type`: String

  override protected def baseProps: JsObject =
    JsObject(fields("type" -> JsString(`type`)))

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
  override protected val extraProps = JsObject(fields())
}

class StampImageConverter(override protected val target: StampImage) extends DrawingActionConverter[StampImage] {

  override protected val `type` = "stamp-image"

  private val (agentType, stampProperties) =
    target.stamp match {

      case t: TurtleStamp =>
        import t._
        val obj =
          JsObject(fields(
            "color"     -> JsArray(colorList(color) map JsInt),
            "heading"   -> JsDouble(heading),
            "size"      -> JsDouble(size),
            "x"         -> JsDouble(x),
            "y"         -> JsDouble(y),
            "shapeName" -> JsString(shapeName)
          ))

        ("turtle", obj)

      case l: LinkStamp   =>
        import l._
        val obj =
          JsObject(fields(
            "color"     -> JsArray(colorList(color) map JsInt),
            "heading"   -> JsDouble(heading),
            "midpointX" -> JsDouble(midpointX),
            "midpointY" -> JsDouble(midpointY),
            "shapeName" -> JsString(shapeName),
            "x1"        -> JsDouble(x1),
            "x2"        -> JsDouble(x2),
            "y1"        -> JsDouble(y1),
            "y2"        -> JsDouble(y2)
          ))

        ("link", obj)

    }

  override protected val extraProps =
    JsObject(fields(
      "agentType" -> JsString(agentType),
      "stamp"     -> stampProperties
    ))

}

class DrawLineConverter(override protected val target: DrawLine) extends DrawingActionConverter[DrawLine] {

  override protected val `type` = "line"

  import target._

  override protected val extraProps =
    JsObject(fields(
      "fromX"   -> JsDouble(x1),
      "fromY"   -> JsDouble(y1),
      "rgb"     -> JsArray(colorList(penColor) map JsInt),
      "size"    -> JsDouble(penSize),
      "toX"     -> JsDouble(x2),
      "toY"     -> JsDouble(y2),
      "penMode" -> JsString(penMode)
    ))

}
