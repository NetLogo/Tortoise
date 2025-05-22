// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object PenWriter extends JsonWriter[org.nlogo.core.Pen] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.Pen): TortoiseJson.JsObject = {
    val map = ListMap(
      ("display" -> org.nlogo.tortoise.compiler.json.WidgetWrite.string2NillableTortoiseJs.write(o.display)),
      ("interval" -> org.nlogo.tortoise.compiler.json.JsonWriter.double2TortoiseJs.write(o.interval)),
      ("mode" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.mode)),
      ("color" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.color)),
      ("inLegend" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.inLegend)),
      ("setupCode" -> org.nlogo.tortoise.compiler.json.WidgetWrite.string2NillableTortoiseJs.write(o.setupCode)),
      ("updateCode" -> org.nlogo.tortoise.compiler.json.WidgetWrite.string2NillableTortoiseJs.write(o.updateCode)),
      ("type" -> Some(TortoiseJson.JsString("pen")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
