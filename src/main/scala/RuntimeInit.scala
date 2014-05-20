// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ core, api }

// RuntimeInit generates JavaScript code that does any initialization that needs to happen
// before any user code runs, for example creating patches

class RuntimeInit(program: api.Program, model: core.Model) {

  import scala.collection.JavaConverters._
  import org.nlogo.tortoise.json.JSONSerializer

  def init = {
    def shapeList(shapes: api.ShapeList) =
      if(shapes.getNames.isEmpty)
        "{}"
      else
        JSONSerializer.serialize(shapes)
    val turtleShapesJson = shapeList(CompilerService.parseTurtleShapes(model.turtleShapes.toArray))
    val linkShapesJson = shapeList(CompilerService.parseLinkShapes(model.linkShapes.toArray))
    val view = model.view
    import view._
    globals + turtlesOwn + patchesOwn +
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
    api.AgentVariables.getImplicitTurtleVariables.size
  val patchBuiltinCount =
    api.AgentVariables.getImplicitPatchVariables.size
  def turtlesOwn =
    vars(program.turtlesOwn.drop(turtleBuiltinCount), "TurtlesOwn")
  def patchesOwn =
    vars(program.patchesOwn.drop(patchBuiltinCount), "PatchesOwn")
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
