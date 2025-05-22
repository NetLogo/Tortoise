// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.tortoise.compiler.json._

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object SliderCompilationWriter extends JsonWriter[org.nlogo.tortoise.compiler.WidgetCompilation.SliderCompilation] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.tortoise.compiler.WidgetCompilation.SliderCompilation): TortoiseJson.JsObject = {
    val map = ListMap(
      ("compiledMin" -> org.nlogo.tortoise.compiler.json.JsonWriter.string2TortoiseJs.write(o.compiledMin)),
      ("compiledMax" -> org.nlogo.tortoise.compiler.json.JsonWriter.string2TortoiseJs.write(o.compiledMax)),
      ("compiledStep" -> org.nlogo.tortoise.compiler.json.JsonWriter.string2TortoiseJs.write(o.compiledStep)),
      ("type" -> Some(TortoiseJson.JsString("sliderCompilation")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
