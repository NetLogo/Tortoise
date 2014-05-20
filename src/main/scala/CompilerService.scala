// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

// Adds ability to compile NetLogo => JS from command line
//
// Example:
//   cat models/Sample\ Models/Biology/Wolf\ Sheep\ Predation.nlogo | \
//     ./sbt 'run-main org.nlogo.tortoise.CompilerService'

import
  org.nlogo.{ core, api, nvm, shape, workspace },
    api.model.{ ModelReader, WidgetReader }

// This and app/models/local/NetLogoCompiler.scala over in the Galapagos repo have very similar
// functionality; the duplication could/should be eliminated. - ST 4/1/14

object CompilerService {

  def main(args: Array[String]) {
    val input =
      args match {
        case Array(nlogoPath) => io.Source.fromFile(nlogoPath)
        case _                => io.Source.fromInputStream(System.in)
      }
    try println(compile(input.mkString))
    finally input.close()
  }

  import collection.JavaConverters._
  def parseTurtleShapes(strings: Array[String]): api.ShapeList =
    new api.ShapeList(core.AgentKind.Turtle,
      shape.VectorShape.parseShapes(strings, api.Version.version).asScala)
  def parseLinkShapes(strings: Array[String]): api.ShapeList =
    new api.ShapeList(core.AgentKind.Link,
      shape.LinkShape.parseShapes(strings, api.Version.version).asScala)

  def compile(contents: String): String = {

    val frontEnd: nvm.FrontEndInterface = org.nlogo.compile.front.FrontEnd
    val model = ModelReader.parseModel(contents, new nvm.DefaultParserServices(frontEnd))
    val (js, _, _) = Compiler.compileProcedures(model)
    js
  }

}
