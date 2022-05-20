// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import ExportRequest.NlogoFileVersion

import org.nlogo.core.{ Model => CModel, Slider, Switch, View }
import org.nlogo.core.model.ModelReader

import json.{ JsonLibrary, JsonLinkLine, JsonLinkShape, JsonVectorShape, TortoiseJson }
import json.JsonLibrary.{ Native => NativeJson, toNative }
import json.JsonReader.{ jsObject2RichJsObject, jsArray2RichJsArray }
import json.ShapeToJsonConverters.shape2Json
import json.TortoiseJson.{ fields, JsArray, JsObject, JsString }
import json.WidgetToJson.widget2Json

import scala.collection.immutable.ListMap

import scala.scalajs.js

object TestUtilities {

  def assertErrorMessage(compiledModel: JsObject, message: String): Unit =
    assert(
      compiledModel[JsObject]("model")
        .apply[JsArray]("result")
        .apply[JsObject](0)
        .apply[String]("message") == message)

  def withWidget(compiledModel: JsObject, widgetType: String, f: JsObject => Unit): Unit = {
    // this song and dance is to turn a string with Javascript Objects containing functions
    // into TortoiseJson objects
    val widgetsString: String = compiledModel[String]("widgets")
    val widgetObj:     js.Any = new js.Object(js.eval(widgetsString))
    val widgetsJson           = JsonLibrary.toTortoise(widgetObj)

    widgetsJson match {
      case JsArray(elems) =>
        val compiledWidgets = elems.collect { case jo : JsObject => jo }
        val selectedWidget  = ((widget: JsObject) => widget[String]("type") == widgetType)
        assert(compiledWidgets.exists(selectedWidget))
        f(compiledWidgets.find(selectedWidget).get)
      case _ => throw new Exception(s"Invalid widget set $widgetsString")
    }
  }

  def compileModel(s: String): JsObject =
    withBrowserCompiler(_.fromNlogo(s))

  def compileModel(m: CModel, commands: Seq[String] = Seq()): JsObject =
    withBrowserCompiler { b =>
      val formattedModel    = ModelReader.formatModel(m)
      val formattedCommands = toNative(JsArray(commands.map(s => JsString(s))))
      b.fromNlogo(formattedModel, formattedCommands)
    }

  def withBrowserCompiler(f: BrowserCompiler => JsonLibrary.Native): JsObject =
    JsonLibrary.toTortoise(f(new BrowserCompiler)).asInstanceOf[JsObject]

  def makeSuccess(code: String): String =
    s"""{"success":true,"result":"${code}"}"""

  def isSuccess(compiledModel: JsObject): Boolean =
    compiledModel[JsObject]("model").apply[Boolean]("success")

  def compiledJs(compiledModel: JsObject): String =
    compiledModel[JsObject]("model").apply[String]("result")

  def modelToCompilationRequest(model: CModel): NativeJson =
    modelToCompilationRequest(model, fields())

  def modelToCompilationRequest(model: CModel, additionalFields: ListMap[String, TortoiseJson]): NativeJson = {
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

  val validModel: CModel = {
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

  val widgetyModel: CModel =
    validModel.copy(widgets = validModel.widgets :+ Slider(variable = Option("apples")) :+ Switch(variable = Option("oranges")))


}
