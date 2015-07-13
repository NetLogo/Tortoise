// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import BrowserCompiler.literalParser

import
  org.nlogo.core.{ model, Model, Shape, Slider, View },
    model.ModelReader,
    Shape.LinkLine

import
  json.{ JsonLibrary, JsonLinkLine, JsonLinkShape, JsonReader, JsonVectorShape, ShapeToJsonConverters, TortoiseJson, WidgetToJson },
    JsonLibrary.{ Native => NativeJson, toNative },
    JsonReader.{ jsObject2RichJsObject, jsArray2RichJsArray },
    ShapeToJsonConverters.shape2Json,
    TortoiseJson.{ fields, JsArray, JsObject, JsString },
    WidgetToJson.widget2Json

import
  scala.{ collection, scalajs },
    collection.immutable.ListMap,
    scalajs.js,
      js.JSON

import utest._

object BrowserCompilerTest extends TestSuite {
  def tests = TestSuite {
    "testInvalidModels"-{
      val compiledModel = compileModel("")
      assert(! compiledModel[Boolean]("success"))
      assert(compiledModel[JsArray]("result").elems.nonEmpty)
    }

    "testInvalidModel"-{
      val compiledModel = compileModel(validModel.copy(code = "to foo fd 1"))
      assert(! compiledModel[Boolean]("success"))
      val result     = compiledModel.props("result").asInstanceOf[JsArray]
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
      assert(compileModel(validModel)[String]("result").contains("foo"))
    }

    "testModelHasSuccess"-{
      assert(compileModel(validModel)[Boolean]("success"))
    }

    "testModelHasView"-{
      withWidget(compileModel(validModel), "view", view => assert(view[Int]("left") == 0))
    }

    "testModelWithCompileWidget"-{
      val slider = Slider(display = "steps", varName = "steps")
      val compiledModel = compileModel(validModel.copy(widgets = slider::validModel.widgets))
      assert(compiledModel[Boolean]("success"))
      withWidget(compiledModel, "slider", slider =>
        Seq("compiledStep", "compiledMax", "compiledMin").foreach { field =>
          assert(slider[JsObject](field).apply[Boolean]("success"))
          assert(slider[JsObject](field).apply[String]("result").nonEmpty)
        })
    }

    "TestModelWithInvalidWidgets"-{
      val invalidSlider = Slider(display = "steps", varName = "steps", min = "qwerty")
      val compiledModel = compileModel(validModel.copy(widgets = invalidSlider::validModel.widgets))
      assert(compiledModel[Boolean]("success"))
      withWidget(compiledModel, "slider", {slider =>
          assert(slider[JsObject]("compiledMin").apply[Boolean]("success") == false)
          assert(slider[JsObject]("compiledMin").apply[JsArray]("result").elems.nonEmpty) })
    }

    "testCompilesCommands"-{
      val compiledModel = compileModel(validModel, Seq("ask turtles [fd 1]"))
      val commands      = compiledModel[JsArray]("commands")
      assert(commands.elems.nonEmpty)
      assert(commands[JsObject](0).apply[Boolean]("success"))
      assert(commands[JsObject](0).apply[String]("result").nonEmpty)
    }

    "testReturnsErrorWhenCommandsAreOfWrongType"-{
      val formattedModel = ModelReader.formatModel(validModel, literalParser)
      val commands       = toNative(JsString("foobar"))
      val compiledModel  = withBrowserCompiler(_.fromNlogo(formattedModel, commands))
      assert(! compiledModel[Boolean]("success"))
      assertErrorMessage(compiledModel, "commands must be an Array of String")
    }

    "testCompilesReporters"-{
      val compiledModel = compileModel(validModel)
      assert(compiledModel[JsArray]("reporters").elems.isEmpty)
    }

    "testCompilesFromModel"-{
      val compilationRequest =
        modelToCompilationRequest(validModel,
          fields("commands" -> JsArray(Seq(JsString("ask turtles [fd 1]")))))
      val compiledModel = withBrowserCompiler(_.fromModel(compilationRequest))
      assert(compiledModel[Boolean]("success"))
    }

    "testExportsNlogo"-{
      val exportResult = withBrowserCompiler(_.exportNlogo(modelToCompilationRequest(validModel)))
      assert(exportResult[Boolean]("success"))
      val exportedNlogo = exportResult[String]("result")
      val parsedModel = ModelReader.parseModel(exportedNlogo, literalParser)
      assert(parsedModel.code == validModel.code)
      assert(parsedModel.info == validModel.info)
      assert(parsedModel.widgets == validModel.widgets)
      assert(parsedModel.turtleShapes.last.name == "custom")
      assert(parsedModel.linkShapes.last.name == "custom2")
    }

    "testCompilationWithoutCommandsOK"-{
      val compiledModel = withBrowserCompiler(_.fromModel(modelToCompilationRequest(validModel)))
      assert(compiledModel[Boolean]("success"))
      val commands      = compiledModel[JsArray]("commands")
      assert(commands.elems.isEmpty)
    }

    "testCompilationPreservesCustomShapes"-{
      val compiledModel = withBrowserCompiler(_.fromModel(modelToCompilationRequest(validModel)))
      assert(compiledModel[Boolean]("success"))
      val compiledJs = compiledModel[String]("result")
      assert(compiledJs.contains("custom"))
      assert(compiledJs.contains("custom2"))
    }


    "testCompilationSucceedsWithJustCode"-{
      val compiledModel = withBrowserCompiler(_.fromModel(toNative(JsObject(fields(
        "code" -> JsString("to foo fd 1 end"),
        "widgets" -> JsArray(validModel.widgets.map(widget2Json(_).toJsonObj))
        )))))
      assert(compiledModel[Boolean]("success"))
    }
  }

  private def modelToCompilationRequest(model: Model): NativeJson =
    modelToCompilationRequest(model, fields())

  private def modelToCompilationRequest(model: Model, additionalFields: ListMap[String, TortoiseJson]): NativeJson = {
    val reqObj = JsObject(
      fields(
        "code"         -> JsString(model.code),
        "info"         -> JsString(model.info),
        "linkShapes"   -> JsArray(model.linkShapes.map(_.toJsonObj)),
        "turtleShapes" -> JsArray(model.turtleShapes.map(_.toJsonObj)),
        "widgets"      -> JsArray(model.widgets.map(widget2Json(_).toJsonObj))) ++
      additionalFields)
    toNative(reqObj)
  }

  private val validModel: Model = {
    val vectorShape = JsonVectorShape("custom", false, 0, Seq())
    val linkLine  = JsonLinkLine(0.0, true, Seq(0.0f, 1.0f))
    val linkShape = JsonLinkShape("custom2", 1.0, Seq(linkLine, linkLine, linkLine), vectorShape)
    Model(
      code         = "to foo fd 1 end",
      widgets      = List(View()),
      info         = "some model info here",
      linkShapes   = Model.defaultLinkShapes :+ linkShape,
      turtleShapes = Model.defaultShapes :+ vectorShape)
  }

  private def assertErrorMessage(compiledModel: JsObject, message: String): Unit =
    assert(compiledModel[JsArray]("result").apply[JsObject](0).apply[String]("message") == message)

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

  private def compileModel(m: Model, commands: Seq[String] = Seq()): JsObject =
    withBrowserCompiler { b =>
      val formattedModel    = ModelReader.formatModel(m, literalParser)
      val formattedCommands = toNative(JsArray(commands.map(s => JsString(s))))
      b.fromNlogo(formattedModel, formattedCommands)
    }

  private def withBrowserCompiler(f: BrowserCompiler => JsonLibrary.Native): JsObject =
    JsonLibrary.toTortoise(f(new BrowserCompiler)).asInstanceOf[JsObject]

}
