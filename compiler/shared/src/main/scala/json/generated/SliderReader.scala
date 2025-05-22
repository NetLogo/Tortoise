// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import scalaz._
import Scalaz._
import scalaz.Validation.FlatMap.ValidationFlatMapRequested

import org.nlogo.tortoise.compiler.json.{ ElementReader, JsonReader, ShapeToJsonConverters }
import ElementReader._
import WidgetToJson.readWidgetsJson
import ShapeToJsonConverters._

import org.nlogo.tortoise.compiler.json.WidgetRead._

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object SliderReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.core.Slider] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.core.Slider] = {

    val v0 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "variable")
    val v1 = JsonReader.readField[scala.Int](jsObject, "x")
    val v2 = JsonReader.readField[scala.Int](jsObject, "y")
    val v3 = JsonReader.readField[scala.Int](jsObject, "width")
    val v4 = JsonReader.readField[scala.Int](jsObject, "height")
    val v5 = JsonReader.readField[scala.Boolean](jsObject, "oldSize")
    val v6 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "display")
    val v7 = JsonReader.readField[scala.Predef.String](jsObject, "min")
    val v8 = JsonReader.readField[scala.Predef.String](jsObject, "max")
    val v9 = JsonReader.readField[scala.Double](jsObject, "default")
    val v10 = JsonReader.readField[scala.Predef.String](jsObject, "step")
    val v11 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "units")
    val v12 = JsonReader.readField[org.nlogo.core.Direction](jsObject, "direction")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.flatMap(
            (c2) => v3.flatMap(
              (c3) => v4.flatMap(
                (c4) => v5.flatMap(
                  (c5) => v6.flatMap(
                    (c6) => v7.flatMap(
                      (c7) => v8.flatMap(
                        (c8) => v9.flatMap(
                          (c9) => v10.flatMap(
                            (c10) => v11.flatMap(
                              (c11) => v12.map(
                                (c12) =>
                                  new org.nlogo.core.Slider(c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12)
                              )
                            )
                          )
                        )
                      )
                    )
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
