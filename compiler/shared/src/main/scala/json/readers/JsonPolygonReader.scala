// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import scalaz._
import scalaz.Validation.FlatMap.ValidationFlatMapRequested

import org.nlogo.tortoise.compiler.json.{ ElementReader, JsonReader }
import ElementReader._

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object JsonPolygonReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.tortoise.compiler.json.JsonPolygon] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.tortoise.compiler.json.JsonPolygon] = {

    val v0 = JsonReader.readField[org.nlogo.core.Shape.RgbColor](jsObject, "color")
    val v1 = JsonReader.readField[scala.Boolean](jsObject, "filled")
    val v2 = JsonReader.readField[scala.Boolean](jsObject, "marked")
    val v3 = JsonReader.readField[scala.collection.immutable.Seq[scala.Int]](jsObject, "xcors")
    val v4 = JsonReader.readField[scala.collection.immutable.Seq[scala.Int]](jsObject, "ycors")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.flatMap(
            (c2) => v3.flatMap(
              (c3) => v4.map(
                (c4) =>
                  new org.nlogo.tortoise.compiler.json.JsonPolygon(c0, c1, c2, c3, c4)
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
