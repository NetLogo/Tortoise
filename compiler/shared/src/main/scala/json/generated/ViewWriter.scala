// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object ViewWriter extends JsonWriter[org.nlogo.core.View] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.View): TortoiseJson.JsObject = {
    val map = ListMap(
      ("x" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.x)),
      ("y" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.y)),
      ("width" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.width)),
      ("height" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.height)),
      ("dimensions" -> org.nlogo.tortoise.compiler.json.WidgetWrite.dims2Json.write(o.dimensions)),
      ("fontSize" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.fontSize)),
      ("updateMode" -> org.nlogo.tortoise.compiler.json.WidgetWrite.updateMode2Json.write(o.updateMode)),
      ("showTickCounter" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.showTickCounter)),
      ("tickCounterLabel" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.tickCounterLabel)),
      ("frameRate" -> org.nlogo.tortoise.compiler.json.JsonWriter.double2TortoiseJs.write(o.frameRate)),
      ("type" -> Some(TortoiseJson.JsString("view")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
