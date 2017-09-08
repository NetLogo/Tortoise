// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  org.nlogo.core.Shape.{
    Circle      => CoreCircle,
    Element     => CoreElement,
    Line        => CoreLine,
    LinkLine    => CoreLinkLine,
    LinkShape   => CoreLinkShape,
    Polygon     => CorePolygon,
    Rectangle   => CoreRectangle,
    VectorShape => CoreVectorShape,
    RgbColor
  }

case class JsonCircle(
  color:  RgbColor,
  filled: Boolean,
  marked: Boolean,
  x:      Int,
  y:      Int,
  diam:   Int
) extends CoreCircle {
  val diameter: Int = diam
}

case class JsonLine(
  color:  RgbColor,
  filled: Boolean,
  marked: Boolean,
  x1:     Int,
  y1:     Int,
  x2:     Int,
  y2:     Int
) extends CoreLine {

  val startPoint: (Int, Int) = (x1, y1)
  val endPoint:   (Int, Int) = (x2, y2)
}

case class JsonRectangle(
  color:  RgbColor,
  filled: Boolean,
  marked: Boolean,
  xmin:   Int,
  ymin:   Int,
  xmax:   Int,
  ymax:   Int
) extends CoreRectangle {

  val upperLeftCorner:  (Int, Int) = (xmin, ymin)
  val lowerRightCorner: (Int, Int) = (xmax, ymax)
}

case class JsonPolygon(
  color:  RgbColor,
  filled: Boolean,
  marked: Boolean,
  xcors:  Seq[Int],
  ycors:  Seq[Int]
) extends CorePolygon {
  val points: Seq[(Int, Int)] = xcors zip ycors
}

case class JsonVectorShape(
  var name:           String,
  rotate:             Boolean,
  editableColorIndex: Int,
  elements:           Seq[CoreElement]
) extends CoreVectorShape {
  val rotatable = rotate
}

case class JsonLinkLine(
  `x-offset`:     Double,
  `is-visible`:   Boolean,
  `dash-pattern`: Seq[Float]
) extends CoreLinkLine {
  val xcor        = `x-offset`
  val isVisible   = `is-visible`
  val dashChoices = `dash-pattern`
}

case class JsonLinkShape(
  var name:              String,
  curviness:             Double,
  lines:                 Seq[CoreLinkLine],
  `direction-indicator`: CoreVectorShape
) extends CoreLinkShape {
  val linkLines = lines
  val indicator = `direction-indicator`
}
