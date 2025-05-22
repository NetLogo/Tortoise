// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object ChooserWriter extends JsonWriter[org.nlogo.core.Chooser] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.Chooser): TortoiseJson.JsObject = {
    val map = ListMap(
      ("variable" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.variable)),
      ("x" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.x)),
      ("y" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.y)),
      ("width" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.width)),
      ("height" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.height)),
      ("oldSize" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.oldSize)),
      ("display" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.display)),
      ("choices" -> org.nlogo.tortoise.compiler.json.WidgetWrite.chooseables2TortoiseJs.write(o.choices)),
      ("currentChoice" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.currentChoice)),
      ("type" -> Some(TortoiseJson.JsString("chooser")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
