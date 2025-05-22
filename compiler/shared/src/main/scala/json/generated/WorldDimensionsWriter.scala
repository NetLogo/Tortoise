// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object WorldDimensionsWriter extends JsonWriter[org.nlogo.core.WorldDimensions] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.WorldDimensions): TortoiseJson.JsObject = {
    val map = ListMap(
      ("minPxcor" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.minPxcor)),
      ("maxPxcor" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.maxPxcor)),
      ("minPycor" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.minPycor)),
      ("maxPycor" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.maxPycor)),
      ("patchSize" -> org.nlogo.tortoise.compiler.json.JsonWriter.double2TortoiseJs.write(o.patchSize)),
      ("wrappingAllowedInX" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.wrappingAllowedInX)),
      ("wrappingAllowedInY" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.wrappingAllowedInY)),
      ("type" -> Some(TortoiseJson.JsString("worldDimensions")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
