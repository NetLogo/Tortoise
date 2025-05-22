// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

object GeneratorJS {
  import org.nlogo.tortoise.compiler.BrowserCompiler._
  Jsonify.writeFile(Jsonify.readerGenerator[ExportRequest](Seq("org.nlogo.tortoise.compiler.ExportRequest._")), "gen-js")
  Jsonify.writeFile(Jsonify.readerGenerator[CompilationRequest](Seq("org.nlogo.tortoise.compiler.CompilationRequest._")), "gen-js")
  Jsonify.writeFile(Jsonify.writerGenerator[ModelCompilation]("org.nlogo.tortoise.compiler"), "gen-js")
}
