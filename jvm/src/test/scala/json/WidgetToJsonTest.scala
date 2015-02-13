// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.core.{ Button, Chooseable, Chooser, Col, Horizontal, InputBox, LogoList, Monitor, Num,
    Output, Pen, Plot, Slider,  Str, Switch, TextBox, UpdateMode, View, Widget }

import
  org.scalatest.FunSuite

import
  scalaz.Scalaz.ToValidationOps

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

import
  WidgetToJson._

class WidgetToJsonTest extends FunSuite {

  (testJsons zip testWidgets).foreach {
    case ((name, json), (_, widget)) =>

      test(s"writes $name") {
        assertResult(json)(widget.toJsonObj)
      }

      test(s"reads $name") {
        val readWidget = WidgetToJson.read(json)
        assert(readWidget.isSuccess, readWidget)
        assertResult(widget.successNel[String])(readWidget)
      }

      test(s"round-trips $name") {
        assertResult(json.successNel[String])(WidgetToJson.read(json).map(_.toJsonObj))
        assertResult(widget.successNel[String])(
          WidgetToJson.read(widget.toJsonObj.asInstanceOf[JsObject]))
      }

      test(s"round-trips $name with serialization") {
        val fullySerializedValue = JsonLibrary.toTortoise(JsonLibrary.toNative(widget.toJsonObj))
        assertResult(WidgetToJson.read(fullySerializedValue.asInstanceOf[JsObject]))(widget.successNel[String])
      }

  }

  test("fails to read without a type") {
    assertResult("no conversion available".failureNel)(WidgetToJson.read(JsObject(fields())))
  }

  test("errors when reading bad output") {
    assertResult("could not convert JsNull$ to int".failureNel)(
        WidgetToJson.read(locatableJsObject(
          "type"     -> JsString("output"),
          "fontSize" -> JsNull
        )))
  }

  def locatableJsObject(fs: (String, TortoiseJson)*): JsObject =
    JsObject(fields(
      "left"      -> JsInt(1),
      "top"       -> JsInt(2),
      "right"     -> JsInt(3),
      "bottom"    -> JsInt(4)) ++ fs)

  def testJsons: Map[String, JsObject] = Map(

    "slider" -> locatableJsObject(
      "type"      -> JsString("slider"),
      "display"   -> JsString("abc"),
      "varName"   -> JsString("foobar"),
      "min"       -> JsString("5"),
      "max"       -> JsString("25"),
      "default"   -> JsDouble(10.0),
      "units"     -> JsString("bazzes"),
      "direction" -> JsString("horizontal"),
      "step"      -> JsString("1")),

    "switch" -> locatableJsObject(
      "type"    -> JsString("switch"),
      "display" -> JsString("abc"),
      "varName" -> JsString("foobar"),
      "on"      -> JsBool(true)),

    "buttonNoName" -> locatableJsObject(
      "type"       -> JsString("button"),
      "source"     -> JsString("foobar"),
      "forever"    -> JsBool(false),
      "buttonType" -> JsString("TURTLE"),
      "actionKey"  -> JsString("A")),

    "buttonWithName" -> locatableJsObject(
      "type"       -> JsString("button"),
      "display"    -> JsString("press this"),
      "source"     -> JsString("foobar"),
      "forever"    -> JsBool(false),
      "buttonType" -> JsString("OBSERVER"),
      "actionKey"  -> JsNull),

    "chooser" -> locatableJsObject(
      "type"          -> JsString("chooser"),
      "display"       -> JsString("abc"),
      "varName"       -> JsString("foobar"),
      "currentChoice" -> JsInt(0),
      "choices"       -> JsArray(Seq(
        JsDouble(10.0),
        JsString("def"),
        JsArray(Seq(JsString("xyz"))),
        JsBool(false)
      ))),

    "inputBox[Double]" -> locatableJsObject(
        "type"      -> JsString("inputBox"),
        "varName"   -> JsString("foobar"),
        "value"     -> JsDouble(25.0),
        "multiline" -> JsBool(false),
        "boxtype"   -> JsString(Num.name)),

    "inputBox[Int]" -> locatableJsObject(
      "type"      -> JsString("inputBox"),
      "varName"   -> JsString("foobar"),
      "value"     -> JsInt(15),
      "multiline" -> JsBool(false),
      "boxtype"   -> JsString(Col.name)),

    "inputBox[String]" -> locatableJsObject(
      "type"      -> JsString("inputBox"),
      "varName"   -> JsString("foobar"),
      "value"     -> JsString("baz"),
      "multiline" -> JsBool(false),
      "boxtype"   -> JsString(Str.name)),

    "monitor" -> locatableJsObject(
      "type"      -> JsString("monitor"),
      "display"   -> JsString("abc"),
      "source"    -> JsString("reporter"),
      "precision" -> JsInt(3),
      "fontSize"  -> JsInt(10)),

    "monitorNil" -> locatableJsObject(
      "type"      -> JsString("monitor"),
      "source"    -> JsString("reporter"),
      "precision" -> JsInt(3),
      "fontSize"  -> JsInt(10)),

    "pen" -> JsObject(fields(
      "type"       -> JsString("pen"),
      "display"    -> JsString("abc"),
      "interval"   -> JsDouble(2),
      "mode"       -> JsInt(0),
      "color"      -> JsInt(15),
      "inLegend"   -> JsBool(true),
      "setupCode"  -> JsString("setup"),
      "updateCode" -> JsString("update"))),

    "plot" -> {
      val penJson = Pen("abc", 2, 0, 15, true, "setup", "update").toJsonObj
      locatableJsObject(
        "type"       -> JsString("plot"),
        "display"    -> JsString("abc"),
        "xAxis"      -> JsString("time"),
        "yAxis"      -> JsString("height"),
        "xmin"       -> JsDouble(0),
        "xmax"       -> JsDouble(100),
        "ymin"       -> JsDouble(50),
        "ymax"       -> JsDouble(200),
        "autoPlotOn" -> JsBool(true),
        "legendOn"   -> JsBool(false),
        "setupCode"  -> JsString("setup"),
        "updateCode" -> JsString("update"),
        "pens"       -> JsArray(Seq(penJson)))},

    "output" -> locatableJsObject(
      "type"     -> JsString("output"),
      "fontSize" -> JsInt(10)),

    "textBox" -> locatableJsObject(
      "type"        -> JsString("textBox"),
      "display"     -> JsString("abc"),
      "fontSize"    -> JsInt(10),
      "color"       -> JsDouble(25.0),
      "transparent" -> JsBool(false)),

    "view"    -> locatableJsObject(
      "type"               -> JsString("view"),
      "patchSize"          -> JsDouble(25.0),
      "fontSize"           -> JsInt(8),
      "wrappingAllowedInX" -> JsBool(true),
      "wrappingAllowedInY" -> JsBool(false),
      "minPxcor"           -> JsInt(10),
      "maxPxcor"           -> JsInt(9),
      "minPycor"           -> JsInt(8),
      "maxPycor"           -> JsInt(7),
      "updateMode"         -> JsString("Continuous"),
      "showTickCounter"    -> JsBool(false),
      "tickCounterLabel"   -> JsString("tocks"),
      "frameRate"          -> JsDouble(50.0))
  )

  def testWidgets: Map[String, Widget] = Map(
    "slider"         -> Slider("abc", 1, 2, 3, 4, "foobar", "5", "25", 10.0, "1", Some("bazzes"), Horizontal),
    "switch"         -> Switch("abc", 1, 2, 3, 4, "foobar", true),
    "buttonNoName"   -> Button(None, 1, 2, 3, 4, "foobar", false, "TURTLE", "A"),
    "buttonWithName" -> Button(Some("press this"), 1, 2, 3, 4, "foobar", false),
    "chooser" -> {
      val choices = List(
        Chooseable(10.0: java.lang.Double),
        Chooseable("def"),
        Chooseable(LogoList("xyz")),
        Chooseable(false: java.lang.Boolean))
      Chooser("abc", 1, 2, 3, 4, "foobar", choices, 0)
    },
    "inputBox[Double]" -> InputBox[Double](1, 2, 3, 4, "foobar", 25.0, false, Num),
    "inputBox[Int]"    -> InputBox[Int](1, 2, 3, 4, "foobar", 15, false, Col),
    "inputBox[String]" -> InputBox[String](1, 2, 3, 4, "foobar", "baz", false, Str),
    "monitor"          -> Monitor(Some("abc"), 1, 2, 3, 4, "reporter", 3, 10),
    "monitorNil"       -> Monitor(None, 1, 2, 3, 4, "reporter", 3, 10),
    "pen"              -> Pen("abc", 2, 0, 15, true, "setup", "update"),
    "plot"             -> {
      val pen = Pen("abc", 2, 0, 15, true, "setup", "update")
      Plot("abc", 1, 2, 3, 4,
        "time", "height", 0, 100, 50, 200,
        autoPlotOn = true, legendOn = false,
        setupCode = "setup", updateCode = "update", pens = List(pen))
    },
    "ouput"   -> Output(1, 2, 3, 4, 10),
    "textBox" -> TextBox("abc", 1, 2, 3, 4, 10, 25.0, false),
    "view"    -> View(1, 2, 3, 4, 25.0, 8, true, false, 10, 9, 8, 7, UpdateMode.Continuous, false, "tocks", 50.0)
  )
}
