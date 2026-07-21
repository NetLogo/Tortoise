// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import scalaz._
import scalaz.Validation.FlatMap.ValidationFlatMapRequested

import org.nlogo.tortoise.compiler.json.JsonReader
import WidgetToJson.readWidgetsJson

import org.nlogo.tortoise.compiler.ExportRequest._

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object ExportRequestReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.tortoise.compiler.ExportRequest] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.tortoise.compiler.ExportRequest] = {

    val v0 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "title")
    val v1 = JsonReader.readField[scala.Predef.String](jsObject, "code")
    val v2 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "info")
    val v3 = JsonReader.readField[scala.collection.immutable.Seq[org.nlogo.core.Widget]](jsObject, "widgets")
    val v4 = JsonReader.readField[scala.Option[scala.collection.immutable.Seq[org.nlogo.core.Shape.VectorShape]]](jsObject, "turtleShapes")
    val v5 = JsonReader.readField[scala.Option[scala.collection.immutable.Seq[org.nlogo.core.Shape.LinkShape]]](jsObject, "linkShapes")
    val v6 = JsonReader.readField[scala.Option[scala.collection.immutable.Seq[org.nlogo.core.ExternalResource]]](jsObject, "resources")
    val v7 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "version")

    val result =
      v0.flatMap(
        (c0) => v1.flatMap(
          (c1) => v2.flatMap(
            (c2) => v3.flatMap(
              (c3) => v4.flatMap(
                (c4) => v5.flatMap(
                  (c5) => v6.flatMap(
                    (c6) => v7.map(
                      (c7) =>
                        new org.nlogo.tortoise.compiler.ExportRequest(c0, c1, c2, c3, c4, c5, c6, c7)
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
