// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.core.{ model, LiteralParser, Model, Slider, View },
  model.ModelReader

import json.{ JsonLibrary, JsonReader, TortoiseJson, WidgetToJson },
  TortoiseJson._,
  JsonLibrary.toNative,
  JsonReader.{ jsObject2RichJsObject, jsArray2RichJsArray }

import scala.scalajs.js

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
      val result = compiledModel.props("result").asInstanceOf[JsArray]
      assert("END expected" == result.elems(0).asInstanceOf[JsObject][String]("message"))
      assert(2147483647 == result.elems(0).asInstanceOf[JsObject][Int]("start"))
      assert(2147483647 == result.elems(0).asInstanceOf[JsObject][Int]("end"))
    }

    "testModelHasInfo"-{
      assert(compileModel(validModel)[String]("info") == "some model info here")
    }

    "testModelHasCode"-{
      assert(compileModel(validModel)[String]("code") == "to foo fd 1 end")
    }

    "testModelHasResult"-{
      assert(compileModel(validModel)[String]("result").contains("function foo"))
    }

    "testModelHasSuccess"-{
      assert(compileModel(validModel)[Boolean]("success"))
    }

    "testModelHasView"-{
      withWidget(compileModel(validModel), "view", view =>
          assert(view[Int]("left") == 0))
    }

    "testModelWithCompileWidget"-{
      val compiledModel = compileModel(validModel.copy(
        widgets = Slider(display = "steps", varName = "steps")::validModel.widgets))
      assert(compiledModel[Boolean]("success"))
      withWidget(compiledModel, "slider", slider =>
        Seq("compiledStep", "compiledMax", "compiledMin").foreach { field =>
          assert(slider[JsObject](field).apply[Boolean]("success"))
          assert(slider[JsObject](field).apply[String]("result").nonEmpty)
        })
    }

    "TestModelWithInvalidWidgets"-{
      val compiledModel = compileModel(validModel.copy(
        widgets = Slider(display = "steps", varName = "steps", min = "qwerty")::validModel.widgets))
      assert(compiledModel[Boolean]("success"))
      withWidget(compiledModel, "slider", {slider =>
          assert(slider[JsObject]("compiledMin").apply[Boolean]("success") == false)
          assert(slider[JsObject]("compiledMin").apply[JsArray]("result").elems.nonEmpty) })
    }

    "testCompilesCommands"-{
      val compiledModel = compileModel(validModel, Seq("ask turtles [fd 1]"))
      val commands = compiledModel[JsArray]("commands")
      assert(commands.elems.nonEmpty)
      assert(commands[JsObject](0).apply[Boolean]("success"))
      assert(commands[JsObject](0).apply[String]("result").nonEmpty)
    }

    "testReturnsErrorWhenCommandsAreOfWrongType"-{
      val formattedModel = ModelReader.formatModel(validModel, literalParser)
      val commands = toNative(JsString("foobar"))
      val compiledModel = withBrowserCompiler(_.fromNlogo(formattedModel, commands))
      assert(! compiledModel[Boolean]("success"))
      assert(compiledModel[JsArray]("result").apply[JsObject](0).apply[String]("message") ==
        "commands must be an Array of String")
    }

    "testCompilesReporters"-{
      val compiledModel = compileModel(validModel)
      assert(compiledModel[JsArray]("reporters").elems.isEmpty)
    }

    "testCompilesFromModel"-{
      val compiledModel = withBrowserCompiler(_.fromModel(
        toNative(JsString(validModel.code)),
        toNative(JsArray(validModel.widgets.map(WidgetToJson.widget2Json(_).toJsonObj))),
        toNative(JsArray(Seq(JsString("ask turtles [fd 1]"))))))
      assert(compiledModel[Boolean]("success"))
    }
  }

  private val validModel: Model = Model(
    code = "to foo fd 1 end",
    widgets = List(View()),
    info = "some model info here")

  private def withWidget(compiledModel: JsObject, widgetType: String, f: JsObject => Unit): Unit = {
    val compiledWidgets = compiledModel[JsArray]("widgets")
      .elems.map(_.asInstanceOf[JsObject])
    assert(compiledWidgets.exists(widget => widget[String]("type") == widgetType))
    compiledWidgets.find(widget => widget[String]("type") == widgetType).map(f)
  }

  private def compileModel(s: String): JsObject =
    withBrowserCompiler(_.fromNlogo(s))

  private def compileModel(m: Model, commands: Seq[String] = Seq()): JsObject =
    withBrowserCompiler { b =>
      val formattedModel = ModelReader.formatModel(m, literalParser)
      val formattedCommands = toNative(JsArray(commands.map(s => JsString(s))))
      b.fromNlogo(formattedModel, formattedCommands)
    }

  private def withBrowserCompiler(f: BrowserCompiler => JsonLibrary.Native): JsObject =
    JsonLibrary.toTortoise(f(new BrowserCompiler)).asInstanceOf[JsObject]

  private val literalParser = new LiteralParser {
    def readFromString(s: String): AnyRef = throw new Exception("LiteralParser used unexpectedly")
    def readNumberFromString(source: String): AnyRef = throw new Exception("LiteralParser used unexpectedly")
  }
}
