// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.core.{ model, LiteralParser, Model, Slider, View },
  model.ModelReader

import json.{ JsonLibrary, JsonReader, TortoiseJson },
  TortoiseJson._,
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

    "testEmptyModel"-{
      val compiledModel = compileModel(Model())
      assert(compiledModel[Boolean]("success"))
    }

    "testInvalidModel"-{
      val compiledModel = compileModel(Model(code = "to foo fd 1"))
      assert(! compiledModel[Boolean]("success"))
      val result = compiledModel.props("result").asInstanceOf[JsArray]
      assert("END expected" == result.elems(0).asInstanceOf[JsObject][String]("message"))
      assert(2147483647 == result.elems(0).asInstanceOf[JsObject][Int]("start"))
      assert(2147483647 == result.elems(0).asInstanceOf[JsObject][Int]("end"))
    }

    "testModelWithWidgets"-{
      val compiledModel = compileModel(Model(
        code = "to foo fd steps end",
        widgets = List(Slider(display = "steps", varName = "steps"), View())))
      assert(compiledModel[Boolean]("success"))
      withWidget(compiledModel, "slider", {slider =>
          assert(slider[String]("compiledStep").nonEmpty)
          assert(slider[String]("compiledMin").nonEmpty)
          assert(slider[String]("compiledMax").nonEmpty)})
      withWidget(compiledModel, "view", {view => assert(view[Int]("left") == 0)})
    }

    "TestModelWithInvalidWidgets"-{
      val compiledModel = compileModel(Model(
        code = "to foo fd steps end",
        widgets = List(Slider(display = "steps", varName = "steps", min = "qwerty"), View())))
      withWidget(compiledModel, "slider", { slider =>
        assert(slider[JsArray]("compiledMin").elems.nonEmpty)
        assert(slider[JsArray]("compiledMin").apply[JsObject](0).apply[String]("message").nonEmpty)})
    }
  }

  private def withWidget(compiledModel: JsObject, widgetType: String, f: JsObject => Unit): Unit = {
    val compiledWidgets = compiledModel[JsArray]("widgets")
      .elems.map(_.asInstanceOf[JsObject])
    assert(compiledWidgets.exists(widget => widget[String]("type") == widgetType))
    compiledWidgets.find(widget => widget[String]("type") == widgetType).map(f)
  }

  private def compileModel(s: String): JsObject = {
    val b = new BrowserCompiler
    JsonLibrary.toTortoise(b.fromModel(s)).asInstanceOf[JsObject]
  }

  private def compileModel(m: Model): JsObject = {
    val b = new BrowserCompiler
    val literalParser = new LiteralParser {
      def readFromString(s: String): AnyRef = throw new Exception("LiteralParser used unexpectedly")
      def readNumberFromString(source: String): AnyRef = throw new Exception("LiteralParser used unexpectedly")
    }
    JsonLibrary.toTortoise(b.fromModel(ModelReader.formatModel(m, literalParser))).asInstanceOf[JsObject]
  }
}
