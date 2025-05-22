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
implicit object JsonLinkShapeReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.tortoise.compiler.json.JsonLinkShape] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.tortoise.compiler.json.JsonLinkShape] = {

    val v0 = JsonReader.readField[scala.Predef.String](jsObject, "name")
    val v1 = JsonReader.readField[scala.Double](jsObject, "curviness")
    val v2 = JsonReader.readField[scala.collection.immutable.Seq[org.nlogo.core.Shape.LinkLine]](jsObject, "lines")
    val v3 = JsonReader.readField[org.nlogo.core.Shape.VectorShape](jsObject, "direction-indicator")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.flatMap(
            (c2) => v3.map(
              (c3) =>
                new org.nlogo.tortoise.compiler.json.JsonLinkShape(c0, c1, c2, c3)
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
