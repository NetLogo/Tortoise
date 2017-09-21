// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JsOps.{ jsArrayString, jsFunction, jsString, jsReplace }

import
  org.nlogo.{ core, tortoise },
    core.{ AgentKind, AgentVariables, Model, Program, ShapeList },
    tortoise.compiler.json.JsonSerializer

import
  TortoiseSymbol.{ JsDeclare, JsDepend, JsRequire, WorkspaceInit }

// RuntimeInit generates JavaScript code that does any initialization that needs to happen
// before any user code runs, for example creating patches

class RuntimeInit(program: Program, widgets: Seq[CompiledWidget], model: Model, onTickFunction: String = jsFunction()) {

  def init: Seq[TortoiseSymbol] = Seq(
    JsDeclare("turtleShapes", shapeList(new ShapeList(AgentKind.Turtle, ShapeList.shapesToMap(model.turtleShapes)))),
    JsDeclare("linkShapes",   shapeList(new ShapeList(AgentKind.Link,   ShapeList.shapesToMap(model.linkShapes)))),

    WorkspaceInit(
        Seq(
          Seq(genBreedObjects)
        , genBreedsOwnArgs
        , Seq(s"'${jsReplace(model.code)}'")
        , Seq(jsArrayString(widgets.map(_.toJsonObj.toString)))
        , Seq("tortoise_require(\"extensions/all\").dumpers()")
        , genWorkspaceArgs
        )
      , Seq("turtleShapes", "linkShapes")
    ),

    workspaceDeclare("BreedManager"),
    workspaceDeclare("ExportPrims"),
    workspaceDeclare("LayoutManager"),
    workspaceDeclare("LinkPrims"),
    workspaceDeclare("ListPrims"),
    workspaceDeclare("MousePrims"),
    workspaceDeclare("OutputPrims"),
    workspaceDeclare("plotManager"),
    workspaceDeclare("Prims"),
    workspaceDeclare("PrintPrims"),
    workspaceDeclare("SelfPrims"),
    workspaceDeclare("SelfManager"),
    workspaceDeclare("UserDialogPrims"),
    workspaceDeclare("Updater"),
    workspaceDeclare("world"),

    JsRequire("Exception",      "util/exception"),
    JsRequire("NLMath",         "util/nlmath"),
    JsRequire("notImplemented", "util/notimplemented"),
    JsRequire("ColorModel",     "engine/core/colormodel"),
    JsRequire("Link",           "engine/core/link"),
    JsRequire("LinkSet",        "engine/core/linkset"),
    JsRequire("PatchSet",       "engine/core/patchset"),
    JsRequire("Turtle",         "engine/core/turtle"),
    JsRequire("TurtleSet",      "engine/core/turtleset"),
    JsRequire("NLType",         "engine/core/typechecker"),
    JsRequire("Tasks",          "engine/prim/tasks"),
    JsRequire("AgentModel",     "agentmodel"),
    JsRequire("Meta",           "meta"),
    JsRequire("Random",         "shim/random"),
    JsRequire("StrictMath",     "shim/strictmath"),

    JsDepend("Extensions", "extensions/all", ".initialize", Seq("workspace"))

  )

  private def genBreedObjects: String = {
    val breedObjects = (program.breeds.values ++ program.linkBreeds.values).map {
      b =>
        val name        = jsString(b.name)
        val singular    = jsString(b.singular.toLowerCase)
        val varNames    = jsArrayString(b.owns map (_.toLowerCase) map jsString)
        val directedStr = if (b.isLinkBreed) s", isDirected: ${b.isDirected}" else ""
        s"""{ name: $name, singular: $singular, varNames: $varNames$directedStr }"""
    }.toSeq
    jsArrayString(breedObjects)
  }

  private def genBreedsOwnArgs: Seq[String] = {

    // The turtle varnames information is only used by the `Turtle` class, which already has intrinsic knowledge of many
    // variables (often in special-cased form, e.g. `color`), so we should only bother passing in turtles-own variables
    // that aren't intrinsic to the class. --JAB (5/29/14)
    val linkVarNames   = program.linksOwn   diff AgentVariables.getImplicitLinkVariables
    val turtleVarNames = program.turtlesOwn diff AgentVariables.getImplicitTurtleVariables

    val linksOwnNames   = jsArrayString(linkVarNames   map (_.toLowerCase) map jsString)
    val turtlesOwnNames = jsArrayString(turtleVarNames map (_.toLowerCase) map jsString)

    Seq(turtlesOwnNames, linksOwnNames)
  }

  private def genWorkspaceArgs: Seq[String] = {

    val patchVarNames  = program.patchesOwn diff AgentVariables.getImplicitPatchVariables

    val globalNames          = jsArrayString(program.globals          map (_.toLowerCase) map jsString)
    val interfaceGlobalNames = jsArrayString(program.interfaceGlobals map (_.toLowerCase) map jsString)
    val patchesOwnNames      = jsArrayString(patchVarNames            map (_.toLowerCase) map jsString)

    val view = model.view
    import view._

    Seq(globalNames, interfaceGlobalNames, patchesOwnNames, minPxcor, maxPxcor, minPycor, maxPycor, patchSize,
      wrappingAllowedInX, wrappingAllowedInY, "turtleShapes", "linkShapes", onTickFunction).map(_.toString)
  }

  private def shapeList(shapes: ShapeList): String =
    if (shapes.names.nonEmpty)
      JsonSerializer.serialize(shapes)
    else
      "{}"

  private def workspaceDeclare(declarationName: String): JsDeclare = {
    val camelCased = declarationName.head.toLower + declarationName.tail
    JsDeclare(declarationName, s"workspace.$camelCased", Seq("workspace"))
  }

}
