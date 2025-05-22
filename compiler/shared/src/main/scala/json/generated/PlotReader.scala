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
implicit object PlotReader extends JsonReader[TortoiseJson.JsObject, org.nlogo.core.Plot] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, org.nlogo.core.Plot] = {

    val v0 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "display")
    val v1 = JsonReader.readField[scala.Int](jsObject, "x")
    val v2 = JsonReader.readField[scala.Int](jsObject, "y")
    val v3 = JsonReader.readField[scala.Int](jsObject, "width")
    val v4 = JsonReader.readField[scala.Int](jsObject, "height")
    val v5 = JsonReader.readField[scala.Boolean](jsObject, "oldSize")
    val v6 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "xAxis")
    val v7 = JsonReader.readField[scala.Option[scala.Predef.String]](jsObject, "yAxis")
    val v8 = JsonReader.readField[scala.Double](jsObject, "xmin")
    val v9 = JsonReader.readField[scala.Double](jsObject, "xmax")
    val v10 = JsonReader.readField[scala.Double](jsObject, "ymin")
    val v11 = JsonReader.readField[scala.Double](jsObject, "ymax")
    val v12 = JsonReader.readField[scala.Boolean](jsObject, "autoPlotX")
    val v13 = JsonReader.readField[scala.Boolean](jsObject, "autoPlotY")
    val v14 = JsonReader.readField[scala.Boolean](jsObject, "legendOn")
    val v15 = JsonReader.readField[scala.Predef.String](jsObject, "setupCode")
    val v16 = JsonReader.readField[scala.Predef.String](jsObject, "updateCode")
    val v17 = JsonReader.readField[scala.collection.immutable.List[org.nlogo.core.Pen]](jsObject, "pens")

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
                              (c11) => v12.flatMap(
                                (c12) => v13.flatMap(
                                  (c13) => v14.flatMap(
                                    (c14) => v15.flatMap(
                                      (c15) => v16.flatMap(
                                        (c16) => v17.map(
                                          (c17) =>
                                            new org.nlogo.core.Plot(c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17)
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
