// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import scalaz._
import scalaz.Validation.FlatMap.ValidationFlatMapRequested

import org.nlogo.tortoise.compiler.json.JsonReader

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object OutputReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.core.Output] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.core.Output] = {

    val v0 = JsonReader.readField[scala.Int](jsObject, "x")
    val v1 = JsonReader.readField[scala.Int](jsObject, "y")
    val v2 = JsonReader.readField[scala.Int](jsObject, "width")
    val v3 = JsonReader.readField[scala.Int](jsObject, "height")
    val v4 = JsonReader.readField[scala.Int](jsObject, "fontSize")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.flatMap(
            (c2) => v3.flatMap(
              (c3) => v4.map(
                (c4) =>
                  new org.nlogo.core.Output(c0, c1, c2, c3, c4)
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
