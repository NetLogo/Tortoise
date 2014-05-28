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
    val workspaceArgs = s"$globalNames, $interfaceGlobalNames, $minPxcor, $maxPxcor, $minPycor, $maxPycor, $patchSize, " +
      s"$wrappingAllowedInX, $wrappingAllowedInY, $turtleShapesJson, $linkShapesJson"

     s"""var workspace     = require('engine/workspace')($workspaceArgs);
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
        |$turtlesOwn$patchesOwn$linksOwn$breeds""".stripMargin
  }

  private def globalNames = mkJSArrStr(program.globals map Compiler.sanitizeVarName)

  private def interfaceGlobalNames = mkJSArrStr(program.interfaceGlobals map Compiler.sanitizeVarName)

  // tell the runtime how many *-own variables there are
  val turtleBuiltinCount =
    api.AgentVariables.getImplicitTurtleVariables.size
  val patchBuiltinCount =
    api.AgentVariables.getImplicitPatchVariables.size
  val linkBuiltinCount =
    api.AgentVariables.getImplicitLinkVariables.size
  def turtlesOwn =
    vars(program.turtlesOwn.drop(turtleBuiltinCount), "TurtlesOwn")
  def patchesOwn =
    vars(program.patchesOwn.drop(patchBuiltinCount), "PatchesOwn")
  def linksOwn =
    vars(program.linksOwn.drop(linkBuiltinCount), "LinksOwn")
  def breeds =
    program.breeds.values.map(
      b =>
        s"""BreedManager.add("${b.name}", "${b.singular.toLowerCase}");\n""" +
          s"""BreedManager.get("${b.name}").vars =""" +
          b.owns.mkString("[\"", "\", \"", "\"]") +
          ";"
    ).mkString("\n")

  private def vars(s: Seq[String], initPath: String) =
    if (s.nonEmpty) s"$initPath.init(${s.size});\n"
    else ""

  private def mkJSArrStr(arrayValues: Seq[String]): String =
    arrayValues.mkString("['", "', '", "']")

}
