// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object SliderWriter extends JsonWriter[org.nlogo.core.Slider] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.Slider): TortoiseJson.JsObject = {
    val map = ListMap(
      ("variable" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.variable)),
      ("x" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.x)),
      ("y" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.y)),
      ("width" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.width)),
      ("height" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.height)),
      ("oldSize" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.oldSize)),
      ("display" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.display)),
      ("min" -> org.nlogo.tortoise.compiler.json.WidgetWrite.string2NillableTortoiseJs.write(o.min)),
      ("max" -> org.nlogo.tortoise.compiler.json.WidgetWrite.string2NillableTortoiseJs.write(o.max)),
      ("default" -> org.nlogo.tortoise.compiler.json.JsonWriter.double2TortoiseJs.write(o.default)),
      ("step" -> org.nlogo.tortoise.compiler.json.WidgetWrite.string2NillableTortoiseJs.write(o.step)),
      ("units" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.units)),
      ("direction" -> org.nlogo.tortoise.compiler.json.WidgetWrite.direction2Json.write(o.direction)),
      ("type" -> Some(TortoiseJson.JsString("slider")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
