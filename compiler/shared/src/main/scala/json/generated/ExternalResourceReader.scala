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
implicit object ExternalResourceReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.core.ExternalResource] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.core.ExternalResource] = {

    val v0 = JsonReader.readField[scala.Predef.String](jsObject, "name")
    val v1 = JsonReader.readField[scala.Predef.String](jsObject, "extension")
    val v2 = JsonReader.readField[scala.Predef.String](jsObject, "data")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.map(
            (c2) =>
              new org.nlogo.core.ExternalResource(c0, c1, c2)
          )
        )
      )

    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
