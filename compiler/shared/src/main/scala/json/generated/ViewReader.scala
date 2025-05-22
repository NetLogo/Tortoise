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
implicit object ViewReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.core.View] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.core.View] = {

    val v0 = JsonReader.readField[scala.Int](jsObject, "x")
    val v1 = JsonReader.readField[scala.Int](jsObject, "y")
    val v2 = JsonReader.readField[scala.Int](jsObject, "width")
    val v3 = JsonReader.readField[scala.Int](jsObject, "height")
    val v4 = JsonReader.readField[org.nlogo.core.WorldDimensions](jsObject, "dimensions")
    val v5 = JsonReader.readField[scala.Int](jsObject, "fontSize")
    val v6 = JsonReader.readField[org.nlogo.core.UpdateMode](jsObject, "updateMode")
    val v7 = JsonReader.readField[scala.Boolean](jsObject, "showTickCounter")
    val v8 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "tickCounterLabel")
    val v9 = JsonReader.readField[scala.Double](jsObject, "frameRate")

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
                        (c8) => v9.map(
                          (c9) =>
                            new org.nlogo.core.View(c0, c1, c2, c3, c4, c5, c6, c7, c8, c9)
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
