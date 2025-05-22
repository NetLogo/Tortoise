// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import scalaz._
import Scalaz._
import scalaz.Validation.FlatMap.ValidationFlatMapRequested

import org.nlogo.tortoise.compiler.json.{ ElementReader, JsonReader, ShapeToJsonConverters }
import ElementReader._
import WidgetToJson.readWidgetsJson
import ShapeToJsonConverters._

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object JsonRectangleReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.tortoise.compiler.json.JsonRectangle] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.tortoise.compiler.json.JsonRectangle] = {

    val v0 = JsonReader.readField[org.nlogo.core.Shape.RgbColor](jsObject, "color")
    val v1 = JsonReader.readField[scala.Boolean](jsObject, "filled")
    val v2 = JsonReader.readField[scala.Boolean](jsObject, "marked")
    val v3 = JsonReader.readField[scala.Int](jsObject, "xmin")
    val v4 = JsonReader.readField[scala.Int](jsObject, "ymin")
    val v5 = JsonReader.readField[scala.Int](jsObject, "xmax")
    val v6 = JsonReader.readField[scala.Int](jsObject, "ymax")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.flatMap(
            (c2) => v3.flatMap(
              (c3) => v4.flatMap(
                (c4) => v5.flatMap(
                  (c5) => v6.map(
                    (c6) =>
                      new org.nlogo.tortoise.compiler.json.JsonRectangle(c0, c1, c2, c3, c4, c5, c6)
                  )
                )
              )
            )
          )
        )
      )

    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
