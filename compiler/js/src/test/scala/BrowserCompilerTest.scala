// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import ExportRequest.NlogoFileVersion

import
  org.nlogo.core.{ model, Model => CModel, Slider, Switch, View },
    model.ModelReader

import
  json.{ JsonLibrary, JsonLinkLine, JsonLinkShape, JsonReader, JsonVectorShape, ShapeToJsonConverters, TortoiseJson, WidgetToJson },
    JsonLibrary.{ Native => NativeJson, toNative, nativeToString },
    JsonReader.{ jsObject2RichJsObject, jsArray2RichJsArray },
    ShapeToJsonConverters.shape2Json,
    TortoiseJson.{ fields, JsArray, JsObject, JsString },
    WidgetToJson.widget2Json

import scala.collection.immutable.ListMap

import scala.scalajs.js

import utest._

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
      assert(compiledModel.apply[JsObject]("model").apply[JsArray]("result").apply[JsObject](0).apply[String]("message") == "No such primitive: NODAP:INIT")
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
        "3 + 1"              -> "PrimChecks.math.plus(3, 1)",
        "apples"             -> """world.observer.getGlobal(\"apples\")""",
        "oranges"            -> """world.observer.getGlobal(\"oranges\")""",
        "3 + apples"         -> """PrimChecks.math.plus(3, PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal(\"apples\")))""",
        "3 + (bananas 8 10)" -> """PrimChecks.math.plus(3, PrimChecks.validator.checkArg('+', 1, PrimChecks.procedure.callReporter(\"bananas\", 8, 10)))""",

        "(3 / apples + (bananas 9001 3) > 0) or oranges" ->
          """(Prims.gt(PrimChecks.math.plus(PrimChecks.math.div(3, PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal(\"apples\"))), PrimChecks.validator.checkArg('+', 1, PrimChecks.procedure.callReporter(\"bananas\", 9001, 3))), 0) || PrimChecks.validator.checkArg('OR', 2, world.observer.getGlobal(\"oranges\")))""",

        "sum [xcor] of turtles" ->
          """PrimChecks.list.sum(PrimChecks.validator.checkArg('SUM', 8, PrimChecks.agentset.of(world.turtles(), function() { return PrimChecks.turtle.getVariable(\"xcor\"); })))""",

        "any? turtles" -> "PrimChecks.agentset.any(world.turtles())",
        "any? apples"  -> """PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, world.observer.getGlobal(\"apples\")))""",
        "[color] of turtles" ->
          """PrimChecks.agentset.of(world.turtles(), function() { return SelfManager.self().getVariable(\"color\"); })""",
        "[color] of apples"  ->
          """PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, world.observer.getGlobal(\"apples\")), function() { return SelfManager.self().getVariable(\"color\"); })"""
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
          """R = ProcedurePrims.ask(world.turtles(), function() { SelfManager.self().fd(world.observer.getGlobal(\"apples\")); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }""",

        "clear-all reset-ticks create-turtles (bananas 2 3)" ->
          """world.clearAll();\nworld.ticker.reset();\nworld.turtleManager.createTurtles(PrimChecks.procedure.callReporter(\"bananas\", 2, 3), \"\");"""
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

      val expected = makeSuccess("""ProcedurePrims.defineCommand(\"foo\", (function() { SelfManager.self().right(-(150)); }))""")
      assert(expected == result)
    }

  }

  private def makeSuccess(code: String): String =
    s"""{"success":true,"result":"${code}"}"""

  private def isSuccess(compiledModel: JsObject): Boolean =
    compiledModel[JsObject]("model").apply[Boolean]("success")

  private def compiledJs(compiledModel: JsObject): String =
    compiledModel[JsObject]("model").apply[String]("result")

  private def modelToCompilationRequest(model: CModel): NativeJson =
    modelToCompilationRequest(model, fields())

  private def modelToCompilationRequest(model: CModel, additionalFields: ListMap[String, TortoiseJson]): NativeJson = {
    val reqObj = JsObject(
      fields(
        "code"         -> JsString(model.code),
        "info"         -> JsString(model.info),
        "version"      -> JsString(model.version),
        "linkShapes"   -> JsArray(model.linkShapes.map(_.toJsonObj)),
        "turtleShapes" -> JsArray(model.turtleShapes.map(_.toJsonObj)),
        "widgets"      -> JsArray(model.widgets.map(widget2Json(_).toJsonObj))) ++
      additionalFields)
    toNative(reqObj)
  }

  private val validModel: CModel = {
    val vectorShape = JsonVectorShape("custom", false, 0, Seq())
    val linkLine  = JsonLinkLine(0.0, true, Seq(0.0f, 1.0f))
    val linkShape = JsonLinkShape("custom2", 1.0, Seq(linkLine, linkLine, linkLine), vectorShape)
    CModel(
      code         = "to foo fd 1 end",
      widgets      = List(View()),
      info         = "some model info here",
      version      = NlogoFileVersion,
      linkShapes   = CModel.defaultLinkShapes :+ linkShape,
      turtleShapes = CModel.defaultShapes :+ vectorShape)
  }

  private val widgetyModel: CModel =
    validModel.copy(widgets = validModel.widgets :+ Slider(variable = Option("apples")) :+ Switch(variable = Option("oranges")))

  private def assertErrorMessage(compiledModel: JsObject, message: String): Unit =
    assert(
      compiledModel[JsObject]("model")
        .apply[JsArray]("result")
        .apply[JsObject](0)
        .apply[String]("message") == message)

  private def withWidget(compiledModel: JsObject, widgetType: String, f: JsObject => Unit): Unit = {
    // this song and dance is to turn a string with Javascript Objects containing functions
    // into TortoiseJson objects
    val widgetsString = compiledModel[String]("widgets")
    val widgetsJson = JsonLibrary.toTortoise(js.eval(widgetsString))

    widgetsJson match {
      case JsArray(elems) =>
        val compiledWidgets = elems.collect { case jo : JsObject => jo }
        val selectedWidget  = ((widget: JsObject) => widget[String]("type") == widgetType)
        assert(compiledWidgets.exists(selectedWidget))
        f(compiledWidgets.find(selectedWidget).get)
      case _ => throw new Exception(s"Invalid widget set $widgetsString")
    }
  }

  private def compileModel(s: String): JsObject =
    withBrowserCompiler(_.fromNlogo(s))

  private def compileModel(m: CModel, commands: Seq[String] = Seq()): JsObject =
    withBrowserCompiler { b =>
      val formattedModel    = ModelReader.formatModel(m)
      val formattedCommands = toNative(JsArray(commands.map(s => JsString(s))))
      b.fromNlogo(formattedModel, formattedCommands)
    }

  private def withBrowserCompiler(f: BrowserCompiler => JsonLibrary.Native): JsObject =
    JsonLibrary.toTortoise(f(new BrowserCompiler)).asInstanceOf[JsObject]

}
