// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object SwitchWriter extends JsonWriter[org.nlogo.core.Switch] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.Switch): TortoiseJson.JsObject = {
    val map = ListMap(
      ("variable" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.variable)),
      ("x" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.x)),
      ("y" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.y)),
      ("width" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.width)),
      ("height" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.height)),
      ("oldSize" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.oldSize)),
      ("display" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.display)),
      ("on" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.on)),
      ("type" -> Some(TortoiseJson.JsString("switch")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
