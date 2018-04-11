// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  org.nlogo.core.{ AgentKind, Button, Chooseable, Chooser, Horizontal, InputBox, LogoList, Monitor,
                   NumericInput, Output, Pen, Plot, Slider, StringInput, Switch, TextBox,
                   UpdateMode, View, Widget, WorldDimensions },
    AgentKind.Turtle,
    NumericInput.{ ColorLabel, NumberLabel },
    StringInput.StringLabel

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsObject, JsString }

object WidgetSamples {

  val slider         = Slider(Option("foobar"), 1, 2, 3, 4, Option("abc"), "5", "25", 10.0, "1", Some("bazzes"), Horizontal)
  val reporterSlider = Slider(Option("foobar"), 1, 2, 3, 4, Option("abc"), "0", "count turtles", 10.0, "count turtles / 100", Some("bazzes"), Horizontal)
  val switch         = Switch(Option("foobar"), 1, 2, 3, 4, Option("abc"), true)
  val buttonNoName   = Button(Option("foobar"), 1, 2, 3, 4, None, false, Turtle, Option('A'))
  val buttonWithName = Button(Option("foobar"), 1, 2, 3, 4, Some("press this"), false)
  val chooser        = {
    val choices = List(
      Chooseable(Double.box(10.0)),
      Chooseable("def"),
      Chooseable(LogoList("xyz")),
      Chooseable(Boolean.box(false)))
    Chooser(Option("foobar"), 1, 2, 3, 4, Option("abc"), choices, 0)
  }
  val inputBoxNumber = InputBox(Option("foobar"), 1, 2, 3, 4, NumericInput(25.0, NumberLabel))
  val inputBoxColor  = InputBox(Option("foobar"), 1, 2, 3, 4, NumericInput(15, ColorLabel))
  val inputBoxString = InputBox(Option("foobar"), 1, 2, 3, 4, StringInput("baz", StringLabel, false))
  val monitor        = Monitor(Some("reporter"), 1, 2, 3, 4, Option("abc"), 3, 10)
  val monitorNil     = Monitor(Some("reporter"), 1, 2, 3, 4, None, 3, 10)
  val plot           = {
    val pen = Pen("abc", 2, 0, 15, true, "setup", "update")
    Plot(Option("abc"), 1, 2, 3, 4,
      Option("time"), Option("height"), 0, 100, 50, 200,
      autoPlotOn = true, legendOn = false,
      setupCode = "setup", updateCode = "update", pens = List(pen))
  }
  val ouput          = Output(1, 2, 3, 4, 10)
  val textBox        = TextBox(Option("abc"), 1, 2, 3, 4, 10, 25.0, false)
  val view           = View(1, 2, 3, 4, WorldDimensions(10, 9, 8, 7, 25.0, true, false), 8, UpdateMode.Continuous, false, Option("tocks"), 50.0)

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
      "variable"  -> JsString("foobar"),
      "min"       -> JsString("5"),
      "max"       -> JsString("25"),
      "default"   -> JsDouble(10.0),
      "units"     -> JsString("bazzes"),
      "direction" -> JsString("horizontal"),
      "step"      -> JsString("1")),

    "switch" -> locatableJsObject(
      "type"     -> JsString("switch"),
      "display"  -> JsString("abc"),
      "variable" -> JsString("foobar"),
      "on"       -> JsBool(true)),

    "buttonNoName" -> locatableJsObject(
      "type"                   -> JsString("button"),
      "source"                 -> JsString("foobar"),
      "forever"                -> JsBool(false),
      "disableUntilTicksStart" -> JsBool(false),
      "buttonKind"             -> JsString("Turtle"),
      "actionKey"              -> JsString("A")),

    "buttonWithName" -> locatableJsObject(
      "type"                   -> JsString("button"),
      "display"                -> JsString("press this"),
      "source"                 -> JsString("foobar"),
      "forever"                -> JsBool(false),
      "disableUntilTicksStart" -> JsBool(false),
      "buttonKind"             -> JsString("Observer")),

    "chooser" -> locatableJsObject(
      "type"          -> JsString("chooser"),
      "display"       -> JsString("abc"),
      "variable"      -> JsString("foobar"),
      "currentChoice" -> JsInt(0),
      "choices"       -> JsArray(Seq(
        JsDouble(10.0),
        JsString("def"),
        JsArray(Seq(JsString("xyz"))),
        JsBool(false)
      ))),

    "inputBox[number]" -> locatableJsObject(
        "type"       -> JsString("inputBox"),
        "variable"   -> JsString("foobar"),
        "boxedValue" -> JsObject(fields(
          "value" -> JsDouble(25.0),
          "type"  -> JsString(NumberLabel.display)
        ))
    ),

    "inputBox[color]" -> locatableJsObject(
      "type"      -> JsString("inputBox"),
      "variable"  -> JsString("foobar"),
      "boxedValue" -> JsObject(fields(
        "value" -> JsDouble(15),
        "type"  -> JsString(ColorLabel.display)
      ))
    ),

    "inputBox[string]" -> locatableJsObject(
      "type"      -> JsString("inputBox"),
      "variable"  -> JsString("foobar"),
      "boxedValue" -> JsObject(fields(
        "value" -> JsString("baz"),
        "multiline" -> JsBool(false),
        "type"  -> JsString(StringLabel.display)
      ))
    ),

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
      "fontSize"           -> JsInt(8),
      "updateMode"         -> JsString("Continuous"),
      "showTickCounter"    -> JsBool(false),
      "tickCounterLabel"   -> JsString("tocks"),
      "frameRate"          -> JsDouble(50.0),
      "dimensions"         -> JsObject(fields(
        "patchSize"          -> JsDouble(25.0),
        "wrappingAllowedInX" -> JsBool(true),
        "wrappingAllowedInY" -> JsBool(false),
        "minPxcor"           -> JsInt(10),
        "maxPxcor"           -> JsInt(9),
        "minPycor"           -> JsInt(8),
        "maxPycor"           -> JsInt(7)
      ))
    )
  )

  def testWidgets: Map[String, Widget] = Map(
    "slider"           -> slider,
    "switch"           -> switch,
    "buttonNoName"     -> buttonNoName,
    "buttonWithName"   -> buttonWithName,
    "chooser"          -> chooser,
    "inputBox[number]" -> inputBoxNumber,
    "inputBox[color]"  -> inputBoxColor,
    "inputBox[string]" -> inputBoxString,
    "monitor"          -> monitor,
    "monitorNil"       -> monitorNil,
    "plot"             -> plot,
    "ouput"            -> ouput,
    "textBox"          -> textBox,
    "view"             -> view
  )
}
