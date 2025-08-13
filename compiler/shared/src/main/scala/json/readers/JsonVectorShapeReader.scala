// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import scalaz._
import scalaz.Validation.FlatMap.ValidationFlatMapRequested

import org.nlogo.tortoise.compiler.json.{ JsonReader, ShapeToJsonConverters }
import ShapeToJsonConverters._

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object JsonVectorShapeReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.tortoise.compiler.json.JsonVectorShape] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.tortoise.compiler.json.JsonVectorShape] = {

    val v0 = JsonReader.readField[scala.Predef.String](jsObject, "name")
    val v1 = JsonReader.readField[scala.Boolean](jsObject, "rotate")
    val v2 = JsonReader.readField[scala.Int](jsObject, "editableColorIndex")
    val v3 = JsonReader.readField[scala.collection.immutable.Seq[org.nlogo.core.Shape.Element]](jsObject, "elements")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.flatMap(
            (c2) => v3.map(
              (c3) =>
                new org.nlogo.tortoise.compiler.json.JsonVectorShape(c0, c1, c2, c3)
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
