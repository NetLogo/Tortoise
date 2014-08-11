// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import
  org.nlogo.{ api, core, shape },
    api.{ AgentVariables, Program, ShapeList, Version },
    core.{ AgentKind, Model },
    shape.{ LinkShape, VectorShape }

import
  org.nlogo.tortoise.json.JSONSerializer

// RuntimeInit generates JavaScript code that does any initialization that needs to happen
// before any user code runs, for example creating patches

class RuntimeInit(program: Program, model: Model) {


  def init = {

    import scala.collection.JavaConverters._

    def shapeList(shapes: ShapeList) =
      if (shapes.getNames.isEmpty)
        "{}"
      else
        JSONSerializer.serialize(shapes)

    def parseTurtleShapes(strings: Array[String]): ShapeList =
      new ShapeList(AgentKind.Turtle, VectorShape.parseShapes(strings, Version.version).asScala)

    def parseLinkShapes(strings: Array[String]): ShapeList =
      new ShapeList(AgentKind.Link, LinkShape.parseShapes(strings, Version.version).asScala)

    val turtleShapesJson = shapeList(parseTurtleShapes(model.turtleShapes.toArray))
    val linkShapesJson = shapeList(parseLinkShapes(model.linkShapes.toArray))
    val view = model.view
    import view._
    globals + turtlesOwn + patchesOwn + linksOwn +
      s"world = new World($minPxcor, $maxPxcor, $minPycor, $maxPycor, $patchSize, " +
      s"$wrappingAllowedInX, $wrappingAllowedInY, $turtleShapesJson, $linkShapesJson, " +
      s"${program.interfaceGlobals.size});\n" +
      breeds + "\n"
  }

  // if there are any globals,
  // tell the runtime how many there are, it will initialize them all to 0.
  // if not, do nothing.
  def globals = vars(program.globals, "Globals")

  // tell the runtime how many *-own variables there are
  val turtleBuiltinCount =
    AgentVariables.getImplicitTurtleVariables.size
  val patchBuiltinCount =
    AgentVariables.getImplicitPatchVariables.size
  val linkBuiltinCount =
    AgentVariables.getImplicitLinkVariables.size
  def turtlesOwn =
    vars(program.turtlesOwn.drop(turtleBuiltinCount), "TurtlesOwn")
  def patchesOwn =
    vars(program.patchesOwn.drop(patchBuiltinCount), "PatchesOwn")
  def linksOwn =
    vars(program.linksOwn.drop(linkBuiltinCount), "LinksOwn")
  def breeds =
    program.breeds.values.map(
      b =>
        s"""Breeds.add("${b.name}", "${b.singular.toLowerCase}");\n""" +
          s"""Breeds.get("${b.name}").vars =""" +
          b.owns.mkString("[\"", "\", \"", "\"]") +
          ";"
    ).mkString("\n")

  private def vars(s: Seq[String], initPath: String) =
    if (s.nonEmpty) s"$initPath.init(${s.size});\n"
    else ""

}
