// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.core.{ Slider }
import org.nlogo.core.model.ModelReader

import json.JsonLibrary.{ toNative, nativeToString, toTortoise }
import json.JsonReader.{ jsObject2RichJsObject, jsArray2RichJsArray }
import json.TortoiseJson.{ fields, JsArray, JsBool, JsInt, JsObject, JsString }
import json.WidgetToJson.widget2Json

import scala.scalajs.js
import scala.collection.immutable.ListMap

import utest._

import org.nlogo.tortoise.compiler.TestUtilities.{
  assertErrorMessage
, compiledJs
, compileModel
, isSuccess
, makeSuccess
, modelToCompilationRequest
, validModel
, widgetyModel
, withBrowserCompiler
, withWidget
}

object BrowserCompilerTest extends TestSuite {
  def tests = TestSuite {
    "testInvalidModel"-{
      val compiledModel = compileModel("")
      assert(! isSuccess(compiledModel))
      assert(compiledModel[JsObject]("model").apply[JsArray]("result").elems.nonEmpty)
    }

    "testErrantModel"-{
      val compiledModel = compileModel(validModel.copy(code = "to foo fd 1"))
      assert(! isSuccess(compiledModel))
      val result     = compiledModel[JsObject]("model").apply[JsArray]("result")
      val firstError = result.elems(0).asInstanceOf[JsObject]
      assertErrorMessage(compiledModel, "END expected")
      assert(2147483647     == firstError[Int]("start"))
      assert(2147483647     == firstError[Int]("end"))
    }

    "testModelHasInfo"-{
      assert(compileModel(validModel)[String]("info") == "some model info here")
    }

    "testModelHasCode"-{
      assert(compileModel(validModel)[String]("code") == "to foo fd 1 end")
    }

    "testModelHasResult"-{
      assert(compiledJs(compileModel(validModel)).contains("foo"))
    }

    "testModelHasSuccess"-{
      assert(isSuccess(compileModel(validModel)))
    }

    "testModelHasView"-{
      withWidget(compileModel(validModel), "view", view => assert(view[Int]("left") == 0))
    }

    "testModelWithCompileWidget"-{
      val slider = Slider(display = Option("steps"), variable = Option("steps"))
      val compiledModel = compileModel(validModel.copy(widgets = slider +: validModel.widgets))
      assert(isSuccess(compiledModel))
      withWidget(compiledModel, "slider", { slider =>
        assert(slider[JsObject]("compilation").apply[Boolean]("success"))
        assert(slider[JsObject]("compilation").apply[JsArray]("messages").elems.isEmpty)
      })
    }

    "TestModelWithInvalidWidgets"-{
      val invalidSlider = Slider(display = Option("steps"), variable = Option("steps"), min = "qwerty")
      val compiledModel = compileModel(validModel.copy(widgets = invalidSlider +: validModel.widgets))
      assert(isSuccess(compiledModel))
      withWidget(compiledModel, "slider", {slider =>
          assert(slider[JsObject]("compilation").apply[Boolean]("success") == false)
          assert(slider[JsObject]("compilation").apply[JsArray]("messages").elems.nonEmpty) })
    }

    "TestModelWithExtension"-{
      val compiledModel = compileModel(validModel.copy(code = "extensions [codap] to go codap:init [->] end " + validModel.code))
      assert(isSuccess(compiledModel))
      assert(compiledModel.apply[JsObject]("model").apply[String]("result").contains("""Extensions["CODAP"].prims["INIT"]("""))
    }

    "TestModelWithBadExtension"-{
      val compiledModel = compileModel(validModel.copy(code = "to go nodap:init [->] end " + validModel.code))
      assert(isSuccess(compiledModel) == false)
      assert(compiledModel.apply[JsObject]("model").apply[JsArray]("result").apply[JsObject](0).apply[String]("message") == "Nothing named NODAP:INIT has been defined.")
    }

    "testCompilesCommands"-{
      val compiledModel = compileModel(validModel, Seq("ask turtles [fd 1]"))
      val commands      = compiledModel[JsArray]("commands")
      assert(commands.elems.nonEmpty)
      assert(commands[JsObject](0).apply[Boolean]("success"))
      assert(commands[JsObject](0).apply[String]("result").nonEmpty)
    }

    "testReturnsErrorWhenCommandsAreOfWrongType"-{
      val formattedModel = ModelReader.formatModel(validModel)
      val commands       = toNative(JsString("foobar"))
      val compiledModel  = withBrowserCompiler(_.fromNlogo(formattedModel, commands))
      assert(! isSuccess(compiledModel))
      assertErrorMessage(compiledModel, "commands must be an Array of String")
    }

    "testReturnsReportersElement"-{
      val compiledModel = compileModel(validModel)
      assert(compiledModel[JsArray]("reporters").elems.isEmpty)
    }

    "testCompilesFromModel"-{
      val compilationRequest =
        modelToCompilationRequest(validModel,
          fields("commands" -> JsArray(Seq(JsString("ask turtles [fd 1]")))))
      val compiledModel = withBrowserCompiler(_.fromModel(compilationRequest))
      assert(isSuccess(compiledModel))
    }

    "testCompilesFromInvalidModel"-{
      val invalidModel = validModel.copy(code = "to foo fd 1")
      val compilationRequest =
        modelToCompilationRequest(invalidModel,
          fields("commands" -> JsArray(Seq(JsString("ask turtles [fd 1]")))))
      val compiledModel = withBrowserCompiler(_.fromModel(compilationRequest))
      assert(!isSuccess(compiledModel))
      assertErrorMessage(compiledModel, "END expected")
    }

    "testExportsNlogo"-{
      val exportResult = withBrowserCompiler(_.exportNlogo(modelToCompilationRequest(validModel)))
      assert(exportResult[Boolean]("success"))
      val exportedNlogo = exportResult[String]("result")
      val parsedModel = ModelReader.parseModel(exportedNlogo, StandardLiteralParser, Map())
      assert(parsedModel.code                   == validModel.code)
      assert(parsedModel.info                   == validModel.info)
      assert(parsedModel.version                == validModel.version)
      assert(parsedModel.widgets                == validModel.widgets)
      assert(parsedModel.turtleShapes.last.name == "custom")
      assert(parsedModel.linkShapes.last.name   == "custom2")
    }

    "testCompilationWithoutCommandsOK"-{
      val compiledModel = withBrowserCompiler(_.fromModel(modelToCompilationRequest(validModel)))
      assert(isSuccess(compiledModel))
      val commands      = compiledModel[JsArray]("commands")
      assert(commands.elems.isEmpty)
    }

    "testCompilationPreservesCustomShapes"-{
      val compiledModel = withBrowserCompiler(_.fromModel(modelToCompilationRequest(validModel)))
      assert(isSuccess(compiledModel))
      val js = compiledJs(compiledModel)
      assert(js.contains("custom"))
      assert(js.contains("custom2"))
    }


    "testCompilationSucceedsWithJustCode"-{
      val compiledModel = withBrowserCompiler(_.fromModel(toNative(JsObject(fields(
        "code" -> JsString("to foo fd 1 end"),
        "widgets" -> JsArray(validModel.widgets.map(widget2Json(_).toJsonObj))
        )))))
      assert(isSuccess(compiledModel))
    }

    "isReporterSucceeds"-{
      val compReq  =
        toNative(JsObject(fields(
          "code"    -> JsString("to foo fd 1 end\nto-report bananas [x y] report x * y end")
        , "widgets" -> JsArray(widgetyModel.widgets.map(widget2Json(_).toJsonObj))
        )))
      val compiler = new BrowserCompiler
      val strs     = Seq("3", "3 + 1", "apples", "oranges", "3 + apples", "3 + (bananas 8 10)", "(3 / apples + (bananas 9001 3) > 0) or oranges", "sum [xcor] of turtles")
      compiler.fromModel(compReq)
      assert(strs.map(code => compiler.isReporter(code)).forall(_ == true))
    }

    "isReporterFails"-{
      val compReq  =
        toNative(JsObject(fields(
          "code"    -> JsString("to foo fd 1 end\nto-report bananas [x y] report x * y end")
        , "widgets" -> JsArray(widgetyModel.widgets.map(widget2Json(_).toJsonObj))
        )))
      val compiler = new BrowserCompiler
      val strs     = Seq("create-turtle 1", "show true", "ask turtles [ set color red ]", "foo")
      compiler.fromModel(compReq)
      assert(strs.map(code => compiler.isReporter(code)).forall(_ == false))
    }

    "compileReporter succeeds"-{
      val compReq  =
        toNative(JsObject(fields(
          "code"    -> JsString("to foo fd 1 end\nto-report bananas [x y] report x * y end")
        , "widgets" -> JsArray(widgetyModel.widgets.map(widget2Json(_).toJsonObj))
        )))
      val compiler = new BrowserCompiler
      val reporters = Map(
        "3"                  -> "3",
        "3 + 1"              -> "PrimChecks.math.plus(51, 52, 3, 1)",
        "apples"             -> """world.observer.getGlobal(\"apples\")""",
        "oranges"            -> """world.observer.getGlobal(\"oranges\")""",
        "3 + apples"         -> """PrimChecks.math.plus(51, 52, 3, PrimChecks.validator.checkArg('+', 51, 52, 1, world.observer.getGlobal(\"apples\")))""",
        "3 + (bananas 8 10)" -> """PrimChecks.math.plus(51, 52, 3, PrimChecks.validator.checkArg('+', 51, 52, 1, PrimChecks.procedure.callReporter(54, 61, \"bananas\", 8, 10)))""",

        "(3 / apples + (bananas 9001 3) > 0) or oranges" ->
          """(Prims.gt(PrimChecks.math.plus(61, 62, PrimChecks.math.div(52, 53, 3, PrimChecks.validator.checkArg('/', 52, 53, 1, world.observer.getGlobal(\"apples\"))), PrimChecks.validator.checkArg('+', 61, 62, 1, PrimChecks.procedure.callReporter(64, 71, \"bananas\", 9001, 3))), 0) || PrimChecks.validator.checkArg('OR', 85, 87, 2, world.observer.getGlobal(\"oranges\")))""",

        "sum [xcor] of turtles" ->
          """PrimChecks.list.sum(49, 52, PrimChecks.validator.checkArg('SUM', 49, 52, 8, PrimChecks.agentset.of(world.turtles(), function() { return PrimChecks.turtle.getVariable(54, 58, \"xcor\"); })))""",

        "any? turtles" -> "PrimChecks.agentset.any(world.turtles())",
        "any? apples"  -> """PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 49, 53, 112, world.observer.getGlobal(\"apples\")))""",
        "[color] of turtles" ->
          """PrimChecks.agentset.of(world.turtles(), function() { return PrimChecks.turtleOrLink.getVariable(50, 55, \"color\"); })""",
        "[color] of apples"  ->
          """PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 57, 59, 1904, world.observer.getGlobal(\"apples\")), function() { return PrimChecks.turtleOrLink.getVariable(50, 55, \"color\"); })"""
      )
      compiler.fromModel(compReq)

      val results = reporters.keys.map(code => (code, nativeToString(compiler.compileReporter(code))))
      results.foreach({ case (code, result) =>
        val expected = makeSuccess(reporters.get(code).getOrElse("TEST KEY NOT FOUND?"))
        assert(expected == result)
      })
    }

    "compileCommand succeeds"-{
      val compReq  =
        toNative(JsObject(fields(
          "code"    -> JsString("to foo fd 1 end\nto-report bananas [x y] report x * y end")
        , "widgets" -> JsArray(widgetyModel.widgets.map(widget2Json(_).toJsonObj))
        )))
      val compiler = new BrowserCompiler
      compiler.fromModel(compReq)

      val commands = Map(
        "show \"hello!\"" ->
          """PrintPrims.show(SelfManager.self)(\"hello!\");""",

        "ask turtles [ fd apples ]" ->
          """var R = ProcedurePrims.ask(world.turtles(), function() { SelfManager.self().fd(world.observer.getGlobal(\"apples\")); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(33, 36, R); return R; }""",

        "clear-all reset-ticks create-turtles (bananas 2 3)" ->
          """world.clearAll();\nworld.ticker.reset();\nworld.turtleManager.createTurtles(PrimChecks.procedure.callReporter(71, 78, \"bananas\", 2, 3), \"\");"""
      )

      "with wrapped commands"-{
        val results = commands.keys.map(code => (code, nativeToString(compiler.compileCommand(code))))
        results.foreach({ case (code, result) =>
          val expected = makeSuccess(commands.get(code).getOrElse("TEST KEY NOT FOUND?"))
          assert(expected == result)
        })
      }

      "with raw commands"-{
        val resultsRaw = commands.keys.map(code => (code, nativeToString(compiler.compileRawCommand(code))))
        resultsRaw.foreach({ case (code, result) =>
          val expected = makeSuccess(commands.get(code).getOrElse("TEST KEY NOT FOUND?"))
          assert(expected == result)
        })
      }

    }

    "compileProceduresIncremental succeeds"-{
      val compReq  =
        toNative(JsObject(fields(
          "code"    -> JsString("to foo fd 1 end\nto-report bananas [x y] report x * y end")
        , "widgets" -> JsArray(widgetyModel.widgets.map(widget2Json(_).toJsonObj))
        )))
      val compiler = new BrowserCompiler
      compiler.fromModel(compReq)

      val result = nativeToString(compiler.compileProceduresIncremental("to foo left 150 end", js.Array("foo")))

      val expected = makeSuccess("""ProcedurePrims.defineCommand(\"foo\", 3, 16, (function() { SelfManager.self().right(-(150)); }))""")
      assert(expected == result)
    }

    "compileProceduresIncremental with extensions succeeds"-{
      val code = """extensions [ table ]
        to foo fd 1 end
        to-report bananas [x y] report x * y end
      """
      val compReq  =
        toNative(JsObject(fields(
          "code"    -> JsString(code)
        , "widgets" -> JsArray(widgetyModel.widgets.map(widget2Json(_).toJsonObj))
        )))
      val compiler = new BrowserCompiler
      compiler.fromModel(compReq)

      val newCode = "to foo let x table:make end"
      val innerRes = compiler.compileProceduresIncremental(newCode, js.Array("foo"))
      val result = nativeToString(innerRes)

      val expectedJS =
        """|ProcedurePrims.defineCommand(\"foo\", 3, 24, (function() {
           |  let x = Extensions[\"TABLE\"].prims[\"MAKE\"](); ProcedurePrims.stack().currentContext().registerStringRunVar(\"X\", x);
           |}))""".stripMargin.replaceAll("\n", "\\\\n")
      val expected = makeSuccess(expectedJS)
      assert(expected == result)
    }

    "introspection works"-{
       val code = """
        globals [ eggs hams ]
        turtles-own [ gourds ]
        patches-own [ mites ]
        breed [ wolves wolf ]
        breed [ birds bird ]
        wolves-own [ rings ]
        birds-own [ necklaces ]
        directed-link-breed [ streets street ]
        undirected-link-breed [ friendships friendship ]
        streets-own [ material-type ]
        friendships-own [ age ]
        to turtle-proc fd 1 set eggs 100 end
        to obs-proc ask turtles [ fd 1 ] set hams 100 end
        to-report luck-proc [x y] report (x + y) * eggs * hams end
      """
      val compReq =
        toNative(JsObject(fields(
          "code"    -> JsString(code)
        , "widgets" -> JsArray(widgetyModel.widgets.map(widget2Json(_).toJsonObj))
        )))
      val compiler      = new BrowserCompiler
      val compiledModel = compiler.fromModel(compReq)
      val compiledJs    = toTortoise(compiledModel).asInstanceOf[JsObject]

      assert(isSuccess(compiledJs))

      val globalVars = toTortoise(compiler.listGlobalVars())
      val expectedGlobalVars = Seq(
        JsObject(ListMap("name" -> JsString("apples"), "type" -> JsString("interface")))
      , JsObject(ListMap("name" -> JsString("oranges"), "type" -> JsString("interface")))
      , JsObject(ListMap("name" -> JsString("eggs"), "type" -> JsString("user")))
      , JsObject(ListMap("name" -> JsString("hams"), "type" -> JsString("user")))
      )
      assert(JsArray(expectedGlobalVars) == globalVars)

      val turtleVars = toTortoise(compiler.listTurtleVars())
      val expectedTurtleVars = Seq("gourds", "who", "ycor", "breed", "xcor", "size", "label-color"
      , "pen-size", "color", "shape", "label", "hidden?", "heading", "pen-mode").map(JsString.apply)
      assert(JsArray(expectedTurtleVars) == turtleVars)

      val patchVars = toTortoise(compiler.listPatchVars())
      val expectedPatchVars = Seq("pxcor", "plabel-color", "pcolor", "mites", "plabel", "pycor").map(JsString.apply)
      assert(JsArray(expectedPatchVars) == patchVars)

      val wolvesOwnVars = toTortoise(compiler.listOwnVarsForBreed("wolves"))
      val expectedWolvesOwnVars = Seq("rings").map(JsString.apply)
      assert(JsArray(expectedWolvesOwnVars) == wolvesOwnVars)
      val birdsOwnVars = toTortoise(compiler.listOwnVarsForBreed("birds"))
      val expectedBirdsOwnVars = Seq("necklaces").map(JsString.apply)
      assert(JsArray(expectedBirdsOwnVars) == birdsOwnVars)

      val wolvesVars = toTortoise(compiler.listVarsForBreed("wolves"))
      val expectedWolvesVars = Seq("rings").map(JsString.apply)
      assert(JsArray(expectedTurtleVars ++ expectedWolvesVars) == wolvesVars)
      val birdsVars = toTortoise(compiler.listVarsForBreed("birds"))
      val expectedBirdsVars = Seq("necklaces").map(JsString.apply)
      assert(JsArray(expectedTurtleVars ++ expectedBirdsVars) == birdsVars)

      val linkVars = toTortoise(compiler.listLinkVars())
      val expectedLinkVars = Seq("breed", "label-color", "thickness", "color", "shape", "label"
      , "hidden?", "tie-mode", "end1", "end2").map(JsString.apply)
      assert(JsArray(expectedLinkVars) == linkVars)

      val streetsOwnVars = toTortoise(compiler.listLinkOwnVarsForBreed("streets"))
      val expectedStreetsOwnVars = Seq("material-type").map(JsString.apply)
      assert(JsArray(expectedStreetsOwnVars) == streetsOwnVars)
      val friendshipsOwnVars = toTortoise(compiler.listLinkOwnVarsForBreed("friendships"))
      val expectedFriendshipsOwnVars = Seq("age").map(JsString.apply)
      assert(JsArray(expectedFriendshipsOwnVars) == friendshipsOwnVars)

      val streetsVars = toTortoise(compiler.listLinkVarsForBreed("streets"))
      val expectedStreetsVars = Seq("material-type").map(JsString.apply)
      assert(JsArray(expectedLinkVars ++ expectedStreetsVars) == streetsVars)
      val friendshipsVars = toTortoise(compiler.listLinkVarsForBreed("friendships"))
      val expectedFriendshipsVars = Seq("age").map(JsString.apply)
      assert(JsArray(expectedLinkVars ++ expectedFriendshipsVars) == friendshipsVars)

      val procs = toTortoise(compiler.listProcedures())
      val expectedProcs = JsArray(Seq(
        JsObject(
          ListMap(
            "argCount"            -> JsInt   (0)
          , "isReporter"          -> JsBool  (false)
          , "isUseableByObserver" -> JsBool  (false)
          , "isUseableByTurtles"  -> JsBool  (true)
          , "name"                -> JsString("turtle-proc")
          )
        )
      , JsObject(
          ListMap(
            "argCount"            -> JsInt   (0)
          , "isReporter"          -> JsBool  (false)
          , "isUseableByObserver" -> JsBool  (true)
          , "isUseableByTurtles"  -> JsBool  (true)
          , "name"                -> JsString("obs-proc")
          )
        )
      , JsObject(
          ListMap(
            "argCount"            -> JsInt   (2)
          , "isReporter"          -> JsBool  (true)
          , "isUseableByObserver" -> JsBool  (true)
          , "isUseableByTurtles"  -> JsBool  (true)
          , "name"                -> JsString("luck-proc")
          )
        )
      ))
      assert(expectedProcs == procs)

    }

  }

}
