// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.tortoise.compiler.json._

// This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
// `Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object UpdateableCompilationWriter extends JsonWriter[org.nlogo.tortoise.compiler.WidgetCompilation.UpdateableCompilation] {
  import collection.immutable.ListMap

  def apply(o: org.nlogo.tortoise.compiler.WidgetCompilation.UpdateableCompilation): TortoiseJson.JsObject = {
    val map = ListMap(
      ("compiledSetupCode" -> org.nlogo.tortoise.compiler.json.JsonWriter.string2TortoiseJs.write(o.compiledSetupCode)),
      ("compiledUpdateCode" -> org.nlogo.tortoise.compiler.json.JsonWriter.string2TortoiseJs.write(o.compiledUpdateCode)),
      ("type" -> Some(TortoiseJson.JsString("updateableCompilation")))
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
