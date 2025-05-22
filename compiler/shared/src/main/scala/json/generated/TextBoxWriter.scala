// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object TextBoxWriter extends JsonWriter[org.nlogo.core.TextBox] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.core.TextBox): TortoiseJson.JsObject = {
    val map = ListMap(
      ("display" -> org.nlogo.tortoise.compiler.json.WidgetWrite.stringOption2Json.write(o.display)),
      ("x" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.x)),
      ("y" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.y)),
      ("width" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.width)),
      ("height" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.height)),
      ("fontSize" -> org.nlogo.tortoise.compiler.json.JsonWriter.int2TortoiseJs.write(o.fontSize)),
      ("markdown" -> org.nlogo.tortoise.compiler.json.JsonWriter.bool2TortoiseJs.write(o.markdown)),
      ("textColorLight" -> org.nlogo.tortoise.compiler.json.WidgetWrite.intOption2Json.write(o.textColorLight)),
      ("textColorDark" -> org.nlogo.tortoise.compiler.json.WidgetWrite.intOption2Json.write(o.textColorDark)),
      ("backgroundLight" -> org.nlogo.tortoise.compiler.json.WidgetWrite.intOption2Json.write(o.backgroundLight)),
      ("backgroundDark" -> org.nlogo.tortoise.compiler.json.WidgetWrite.intOption2Json.write(o.backgroundDark)),
      ("type" -> Some(TortoiseJson.JsString("textBox")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
