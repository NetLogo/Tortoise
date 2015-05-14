// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.nlogo.core.{ Button, Chooseable, Chooser, Col, Horizontal, InputBox, LogoList, Monitor, Num,
    Output, Pen, Plot, Slider,  Str, Switch, TextBox, UpdateMode, View, Widget }

import
  scalaz.Scalaz.ToValidationOps

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

object WidgetSamples {

  val slider         = Slider("abc", 1, 2, 3, 4, "foobar", "5", "25", 10.0, "1", Some("bazzes"), Horizontal)
  val switch         = Switch("abc", 1, 2, 3, 4, "foobar", true)
  val buttonNoName   = Button(None, 1, 2, 3, 4, "foobar", false, "TURTLE", "A")
  val buttonBadAgent = Button(None, 1, 2, 3, 4, "foobar", false, "FLUBBER", "A")
  val buttonWithName = Button(Some("press this"), 1, 2, 3, 4, "foobar", false)
  val chooser        = {
    val choices = List(
      Chooseable(Double.box(10.0)),
      Chooseable("def"),
      Chooseable(LogoList("xyz")),
      Chooseable(Boolean.box(false)))
    Chooser("abc", 1, 2, 3, 4, "foobar", choices, 0)
  }
  val inputBoxDouble = InputBox[Double](1, 2, 3, 4, "foobar", 25.0, false, Num)
  val inputBoxInt    = InputBox[Int](1, 2, 3, 4, "foobar", 15, false, Col)
  val inputBoxString = InputBox[String](1, 2, 3, 4, "foobar", "baz", false, Str)
  val monitor        = Monitor(Some("abc"), 1, 2, 3, 4, "reporter", 3, 10)
  val monitorNil     = Monitor(None, 1, 2, 3, 4, "reporter", 3, 10)
  val pen            = Pen("abc", 2, 0, 15, true, "setup", "update")
  val plot           = {
    val pen = Pen("abc", 2, 0, 15, true, "setup", "update")
    Plot("abc", 1, 2, 3, 4,
      "time", "height", 0, 100, 50, 200,
      autoPlotOn = true, legendOn = false,
      setupCode = "setup", updateCode = "update", pens = List(pen))
  }
  val ouput          = Output(1, 2, 3, 4, 10)
  val textBox        = TextBox("abc", 1, 2, 3, 4, 10, 25.0, false)
  val view           = View(1, 2, 3, 4, 25.0, 8, true, false, 10, 9, 8, 7, UpdateMode.Continuous, false, "tocks", 50.0)

  val penJson = JsObject(fields(
    "type"       -> JsString("pen"),
    "display"    -> JsString("abc"),
    "interval"   -> JsDouble(2),
    "mode"       -> JsInt(0),
    "color"      -> JsInt(15),
    "inLegend"   -> JsBool(true),
    "setupCode"  -> JsString("setup"),
    "updateCode" -> JsString("update")))

  def locatableJsObject(fs: (String, TortoiseJson)*): JsObject =
    JsObject(fields(
      "left"      -> JsInt(1),
      "top"       -> JsInt(2),
      "right"     -> JsInt(3),
      "bottom"    -> JsInt(4)) ++ fs)

  def widgetJsons: Map[String, JsObject] = Map(

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

    "pen" -> penJson,

    "plot" -> locatableJsObject(
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
        "pens"       -> JsArray(Seq(penJson))),

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
    "slider"           -> slider,
    "switch"           -> switch,
    "buttonNoName"     -> buttonNoName,
    "buttonWithName"   -> buttonWithName,
    "chooser"          -> chooser,
    "inputBox[Double]" -> inputBoxDouble,
    "inputBox[Int]"    -> inputBoxInt,
    "inputBox[String]" -> inputBoxString,
    "monitor"          -> monitor,
    "monitorNil"       -> monitorNil,
    "pen"              -> pen,
    "plot"             -> plot,
    "ouput"            -> ouput,
    "textBox"          -> textBox,
    "view"             -> view
  )
}
