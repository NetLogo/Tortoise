// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.{ api, core, tortoise },
    api.{ AgentVariables, Program, ShapeList },
    core.Model,
    tortoise.json.JSONSerializer

// RuntimeInit generates JavaScript code that does any initialization that needs to happen
// before any user code runs, for example creating patches

class RuntimeInit(program: Program, model: Model) {

  def init: String =
    s"""var workspace     = tortoise_engine.workspace($genBreedObjects)($genWorkspaceArgs);
       |var BreedManager  = workspace.breedManager;
       |var LayoutManager = workspace.layoutManager;
       |var LinkPrims     = workspace.linkPrims;
       |var Prims         = workspace.prims;
       |var SelfPrims     = workspace.selfPrims;
       |var SelfManager   = workspace.selfManager;
       |var Updater       = workspace.updater;
       |var world         = workspace.world;
       |
       |var Call           = util.call;
       |var ColorModel     = util.colormodel;
       |var Exception      = util.exception;
       |var Trig           = util.trig;
       |var Type           = util.typechecker;
       |var notImplemented = util.notimplemented;
       |
       |var Dump      = tortoise_engine.dump;
       |var Link      = tortoise_engine.core.link;
       |var LinkSet   = tortoise_engine.core.linkset;
       |var Nobody    = tortoise_engine.core.nobody;
       |var PatchSet  = tortoise_engine.core.patchset;
       |var Turtle    = tortoise_engine.core.turtle;
       |var TurtleSet = tortoise_engine.core.turtleset;
       |var Tasks     = tortoise_engine.prim.tasks;
       |
       |var AgentModel     = agentmodel;
       |var Denuller       = nashorn.denuller;
       |var Random         = shim.random;
       |var StrictMath     = shim.strictmath;""".stripMargin

  private def genBreedObjects: String = {
    val breedObjs =
      program.breeds.values.map {
        b =>
          val name     = s"'${b.name}'"
          val singular = s"'${b.singular.toLowerCase}'"
          val varNames = mkJSArrStr(b.owns map (_.toLowerCase) map wrapInQuotes)
          s"""{ name: $name, singular: $singular, varNames: $varNames }"""
      }
    mkJSArrStr(breedObjs)
  }

  private def genWorkspaceArgs: String = {

    def shapeList(shapes: ShapeList): String = {
      import scala.collection.JavaConverters.asScalaSetConverter
      if (shapes.getNames.asScala.nonEmpty)
        JSONSerializer.serialize(shapes)
      else
        "{}"
    }

    // The turtle varnames information is only used by the `Turtle` class, which already has intrinsic knowledge of many
    // variables (often in special-cased form, e.g. `color`), so we should only bother passing in turtles-own variables
    // that aren't intrinsic to the class. --JAB (5/29/14)
    val linkVarNames   = program.linksOwn   diff AgentVariables.getImplicitLinkVariables
    val patchVarNames  = program.patchesOwn diff AgentVariables.getImplicitPatchVariables
    val turtleVarNames = program.turtlesOwn diff AgentVariables.getImplicitTurtleVariables

    val globalNames          = mkJSArrStr(program.globals          map (_.toLowerCase) map wrapInQuotes)
    val interfaceGlobalNames = mkJSArrStr(program.interfaceGlobals map (_.toLowerCase) map wrapInQuotes)
    val linksOwnNames        = mkJSArrStr(linkVarNames             map (_.toLowerCase) map wrapInQuotes)
    val patchesOwnNames      = mkJSArrStr(patchVarNames            map (_.toLowerCase) map wrapInQuotes)
    val turtlesOwnNames      = mkJSArrStr(turtleVarNames           map (_.toLowerCase) map wrapInQuotes)

    val turtleShapesJson = shapeList(CompilerService.parseTurtleShapes(model.turtleShapes.toArray))
    val linkShapesJson   = shapeList(CompilerService.parseLinkShapes(model.linkShapes.toArray))

    val view = model.view
    import view._

    s"$globalNames, $interfaceGlobalNames, $turtlesOwnNames, $linksOwnNames, $patchesOwnNames, $minPxcor, $maxPxcor, " +
      s"$minPycor, $maxPycor, $patchSize, $wrappingAllowedInX, $wrappingAllowedInY, $turtleShapesJson, $linkShapesJson"

  }

  private def wrapInQuotes(str: String): String =
    s"'$str'"

  private def mkJSArrStr(arrayValues: Iterable[String]): String =
    if (arrayValues.nonEmpty)
      arrayValues.mkString("[", ", ", "]")
    else
      "[]"

}
