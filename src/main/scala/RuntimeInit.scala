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

  def init: String = {

    val turtlesOwn = {
      val builtinCount = AgentVariables.getImplicitTurtleVariables.size
      vars(program.turtlesOwn.drop(builtinCount), "TurtlesOwn")
    }

    val patchesOwn = {
      val builtinCount = AgentVariables.getImplicitPatchVariables.size
      vars(program.patchesOwn.drop(builtinCount), "PatchesOwn")
    }

    val linksOwn = {
      val builtinCount = AgentVariables.getImplicitLinkVariables.size
      vars(program.linksOwn.drop(builtinCount), "LinksOwn")
    }

    genInitJS(genBreedObjects, genWorkspaceArgs, turtlesOwn, patchesOwn, linksOwn)

  }

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

    val globalNames          = mkJSArrStr(program.globals          map (_.toLowerCase) map wrapInQuotes)
    val interfaceGlobalNames = mkJSArrStr(program.interfaceGlobals map (_.toLowerCase) map wrapInQuotes)

    val turtleShapesJson = shapeList(parseTurtleShapes(model.turtleShapes.toArray))
    val linkShapesJson   = shapeList(parseLinkShapes(model.linkShapes.toArray))

    val view = model.view
    import view._

    s"$globalNames, $interfaceGlobalNames, $minPxcor, $maxPxcor, $minPycor, $maxPycor, $patchSize, " +
      s"$wrappingAllowedInX, $wrappingAllowedInY, $turtleShapesJson, $linkShapesJson"

  }

  private def vars(s: Seq[String], initPath: String): String =
    if (s.nonEmpty)
      s"$initPath.init(${s.size});\n"
    else
      ""

  private def wrapInQuotes(str: String): String =
    s"'$str'"

  private def mkJSArrStr(arrayValues: Iterable[String]): String =
    if (arrayValues.nonEmpty)
      arrayValues.mkString("[", ", ", "]")
    else
      "[]"

  private def genInitJS(breedObjects: String, workspaceArgs: String, turtlesOwn: String, patchesOwn: String, linksOwn: String): String =
    s"""var workspace     = require('engine/workspace')($breedObjects)($workspaceArgs);
       |var AgentSet      = workspace.agentSet;
       |var BreedManager  = workspace.breedManager;
       |var LayoutManager = workspace.layoutManager;
       |var LinkPrims     = workspace.linkPrims;
       |var Prims         = workspace.prims;
       |var Updater       = workspace.updater;
       |var world         = workspace.world;
       |var TurtlesOwn    = world.turtlesOwn;
       |var PatchesOwn    = world.patchesOwn;
       |var LinksOwn      = world.linksOwn;
       |
       |var Call       = require('engine/call');
       |var ColorModel = require('engine/colormodel');
       |var Dump       = require('engine/dump');
       |var Exception  = require('engine/exception');
       |var Link       = require('engine/link');
       |var LinkSet    = require('engine/linkset');
       |var Nobody     = require('engine/nobody');
       |var PatchSet   = require('engine/patchset');
       |var Tasks      = require('engine/tasks');
       |var Trig       = require('engine/trig');
       |var Turtle     = require('engine/turtle');
       |var TurtleSet  = require('engine/turtleset');
       |var Type       = require('engine/typechecker');
       |
       |var AgentModel     = require('integration/agentmodel');
       |var Denuller       = require('integration/denuller');
       |var notImplemented = require('integration/notimplemented');
       |var Random         = require('integration/random');
       |var StrictMath     = require('integration/strictmath');
       |
       |$turtlesOwn$patchesOwn$linksOwn""".stripMargin

}

