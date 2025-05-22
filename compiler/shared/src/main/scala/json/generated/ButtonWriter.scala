// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object ButtonWriter extends JsonWriter[org.nlogo.core.Button] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.Button): TortoiseJson.JsObject = {
    val map = ListMap(
      ("source" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.source)),
      ("x" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.x)),
      ("y" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.y)),
      ("width" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.width)),
      ("height" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.height)),
      ("oldSize" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.oldSize)),
      ("display" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.display)),
      ("forever" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.forever)),
      ("buttonKind" -> org.nlogo.tortoise.compiler.json.WidgetWrite.agentKind2Json.write(o.buttonKind)),
      ("actionKey" -> org.nlogo.tortoise.compiler.json.WidgetWrite.charOption2Json.write(o.actionKey)),
      ("disableUntilTicksStart" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.disableUntilTicksStart)),
      ("type" -> Some(TortoiseJson.JsString("button")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
