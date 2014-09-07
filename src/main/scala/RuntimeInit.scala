// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

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

  def init: String =
    s"""var workspace     = tortoise_require('engine/workspace')($genBreedObjects)($genWorkspaceArgs);
       |var BreedManager  = workspace.breedManager;
       |var LayoutManager = workspace.layoutManager;
       |var LinkPrims     = workspace.linkPrims;
       |var ListPrims     = workspace.listPrims;
       |var Prims         = workspace.prims;
       |var SelfPrims     = workspace.selfPrims;
       |var SelfManager   = workspace.selfManager;
       |var Updater       = workspace.updater;
       |var world         = workspace.world;
       |
       |var Call           = tortoise_require('util/call');
       |var ColorModel     = tortoise_require('util/colormodel');
       |var Exception      = tortoise_require('util/exception');
       |var Trig           = tortoise_require('util/trig');
       |var Type           = tortoise_require('util/typechecker');
       |var notImplemented = tortoise_require('util/notimplemented');
       |
       |var Dump      = tortoise_require('engine/dump');
       |var Link      = tortoise_require('engine/core/link');
       |var LinkSet   = tortoise_require('engine/core/linkset');
       |var Nobody    = tortoise_require('engine/core/nobody');
       |var PatchSet  = tortoise_require('engine/core/patchset');
       |var Turtle    = tortoise_require('engine/core/turtle');
       |var TurtleSet = tortoise_require('engine/core/turtleset');
       |var Tasks     = tortoise_require('engine/prim/tasks');
       |
       |var AgentModel     = tortoise_require('agentmodel');
       |var Denuller       = tortoise_require('nashorn/denuller');
       |var Random         = tortoise_require('shim/random');
       |var StrictMath     = tortoise_require('shim/strictmath');
       |""".stripMargin

  private def genBreedObjects: String = {
    val breedObjs =
      program.breeds.values.map {
        b =>
          val name        = s"'${b.name}'"
          val singular    = s"'${b.singular.toLowerCase}'"
          val varNames    = mkJSArrStr(b.owns map (_.toLowerCase) map wrapInQuotes)
          val directedStr = if (b.isLinkBreed) s", isDirected: ${b.isDirected}" else ""
          s"""{ name: $name, singular: $singular, varNames: $varNames$directedStr }"""
      }
    mkJSArrStr(breedObjs)
  }

  private def genWorkspaceArgs: String = {

    import scala.collection.JavaConverters.asScalaBufferConverter

    def shapeList(shapes: ShapeList): String = {
      import scala.collection.JavaConverters.asScalaSetConverter
      if (shapes.getNames.asScala.nonEmpty)
        JSONSerializer.serialize(shapes)
      else
        "{}"
    }

    def parseTurtleShapes(strings: Array[String]): ShapeList =
      new ShapeList(AgentKind.Turtle, VectorShape.parseShapes(strings, Version.version).asScala)

    def parseLinkShapes(strings: Array[String]): ShapeList =
      new ShapeList(AgentKind.Link, LinkShape.parseShapes(strings, Version.version).asScala)

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

    val turtleShapesJson = shapeList(parseTurtleShapes(model.turtleShapes.toArray))
    val linkShapesJson   = shapeList(parseLinkShapes(model.linkShapes.toArray))

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
