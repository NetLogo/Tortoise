// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

// Adds ability to compile NetLogo => JS from command line
//
// Example:
//   cat models/Sample\ Models/Biology/Wolf\ Sheep\ Predation.nlogo | \
//     ./sbt 'run-main org.nlogo.tortoise.CompilerService'

import
  org.nlogo.{ core, api, nvm, shape, workspace },
    core.WorldDimensions,
    api.{ ModelReader, ModelSection },
    workspace.WidgetParser

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

  val defaultTurtleShapes = parseTurtleShapes(api.ModelReader.defaultShapes.toArray)
  val defaultLinkShapes = parseLinkShapes(api.ModelReader.defaultLinkShapes.toArray)

  def compile(contents: String): String = {

    val modelMap  = ModelReader.parseModel(contents)
    val interface = modelMap(ModelSection.Interface)
    val nlogo     = modelMap(ModelSection.Code).mkString("\n")

    val turtleShapes = {
      val shapes = parseTurtleShapes(modelMap(ModelSection.TurtleShapes).toArray)
      if (shapes.getNames.isEmpty)
        defaultTurtleShapes
      else
        shapes
    }

    val linkShapes = {
      val shapes = parseLinkShapes(modelMap(ModelSection.LinkShapes).toArray)
      if (shapes.getNames.isEmpty)
        defaultLinkShapes
      else
        shapes
    }

    val frontEnd: nvm.FrontEndInterface =
      org.nlogo.compile.front.FrontEnd

    val (iGlobals, _, _, _, iGlobalCmds) =
      new WidgetParser(new nvm.DefaultParserServices(frontEnd))
        .parseWidgets(interface)

    val patchSize = interface(7).toDouble
    val Seq(wrapX, wrapY, _, minX, maxX, minY, maxY) =
      14 to 20 map { x => interface(x).toInt }
    val dimensions = WorldDimensions(
      minX, maxX, minY, maxY, patchSize, wrapX != 0, wrapY != 0)

    val (js, _, _) =
      Compiler.compileProcedures(
        nlogo, iGlobals, iGlobalCmds.toString, dimensions,
        turtleShapes, linkShapes)

    js
  }

}
