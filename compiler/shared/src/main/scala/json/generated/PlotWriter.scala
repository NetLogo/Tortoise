// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object PlotWriter extends JsonWriter[org.nlogo.core.Plot] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.Plot): TortoiseJson.JsObject = {
    val map = ListMap(
      ("display" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.display)),
      ("x" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.x)),
      ("y" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.y)),
      ("width" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.width)),
      ("height" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.height)),
      ("oldSize" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.oldSize)),
      ("xAxis" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.xAxis)),
      ("yAxis" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.yAxis)),
      ("xmin" -> org.nlogo.tortoise.compiler.json.JsonWriter.double2TortoiseJs.write(o.xmin)),
      ("xmax" -> org.nlogo.tortoise.compiler.json.JsonWriter.double2TortoiseJs.write(o.xmax)),
      ("ymin" -> org.nlogo.tortoise.compiler.json.JsonWriter.double2TortoiseJs.write(o.ymin)),
      ("ymax" -> org.nlogo.tortoise.compiler.json.JsonWriter.double2TortoiseJs.write(o.ymax)),
      ("autoPlotX" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.autoPlotX)),
      ("autoPlotY" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.autoPlotY)),
      ("legendOn" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.legendOn)),
      ("setupCode" -> org.nlogo.tortoise.compiler.json.WidgetWrite.string2NillableTortoiseJs.write(o.setupCode)),
      ("updateCode" -> org.nlogo.tortoise.compiler.json.WidgetWrite.string2NillableTortoiseJs.write(o.updateCode)),
      ("pens" -> org.nlogo.tortoise.compiler.json.WidgetWrite.pens2TortoiseJs.write(o.pens)),
      ("type" -> Some(TortoiseJson.JsString("plot")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
