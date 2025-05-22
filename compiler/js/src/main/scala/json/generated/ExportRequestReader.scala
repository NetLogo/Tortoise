// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import scalaz._
import Scalaz._
import scalaz.Validation.FlatMap.ValidationFlatMapRequested

import org.nlogo.tortoise.compiler.json.{ ElementReader, JsonReader, ShapeToJsonConverters }
import ElementReader._
import WidgetToJson.readWidgetsJson
import ShapeToJsonConverters._

import org.nlogo.tortoise.compiler.ExportRequest._

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object ExportRequestReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.tortoise.compiler.ExportRequest] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.tortoise.compiler.ExportRequest] = {

    val v0 = JsonReader.readField[scala.Predef.String](jsObject, "code")
    val v1 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "info")
    val v2 = JsonReader.readField[scala.collection.immutable.Seq[org.nlogo.core.Widget]](jsObject, "widgets")
    val v3 = JsonReader.readField[scala.Option[scala.collection.immutable.Seq[org.nlogo.core.Shape.VectorShape]]](jsObject, "turtleShapes")
    val v4 = JsonReader.readField[scala.Option[scala.collection.immutable.Seq[org.nlogo.core.Shape.LinkShape]]](jsObject, "linkShapes")
    val v5 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "version")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.flatMap(
            (c2) => v3.flatMap(
              (c3) => v4.flatMap(
                (c4) => v5.map(
                  (c5) =>
                    new org.nlogo.tortoise.compiler.ExportRequest(c0, c1, c2, c3, c4, c5)
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
