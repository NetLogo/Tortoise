// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  JavascriptObject.{ ElementValue, JsFunction, JsonValueElement }

import
  json.{ JsonLibrary, JsonReader, TortoiseJson, WidgetSamples, WidgetToJson },
    JsonLibrary.{ toNative, nativeToString },
    JsonReader._,
    TortoiseJson.{ fields, JsArray, JsBool, JsInt, JsObject, JsString },
    WidgetSamples.{ buttonBadAgent => invalidButtonWidget,
                    buttonNoName   => turtleButtonWidget,
                    buttonWithName => buttonWidget,
                    monitor        => monitorWidget,
                    plot,
                    reporterSlider,
                    slider         => sliderWidget,
                    textBox        => textBoxWidget,
                    widgetJsons },
    WidgetToJson.widget2Json

import
  org.nlogo.core.{ CompilerException, Widget }

import
  org.scalatest.FunSuite

import
  scalaz.{ NonEmptyList, Scalaz, std },
    Scalaz.ToValidationOps,
    std.option.optionSyntax._

import
  WidgetCompilation.{ CompiledStringV, NotCompiled, SliderCompilation, SourceCompilation }

class WidgetCompilerTest extends FunSuite {
  val commandMap = Map(
    "foobar"                 -> "foobar()",
    "ask turtles [ foobar ]" -> "AgentSet.ask(world.turtles, function() { foobar; })")

  val reporterMap = Map(
    "0"                   -> "0",
    "count turtles"       -> "turtles.length()",
    "count turtles / 100" -> "turtles.length() / 100",
    "reporter"            -> "globalVar()")

  def compileCommand(logo: String): CompiledStringV = {
    commandMap.get(logo).toSuccess(NonEmptyList(new Exception("Expected command")))
  }

  def compileReporter(logo: String): CompiledStringV =
    reporterMap.get(logo).toSuccess(NonEmptyList(new Exception("Expected reporter")))

  def compileWidgets(ws: Widget*): JavascriptObject = {
    val compiledWidget =
      new WidgetCompiler(compileCommand, compileReporter).compileWidgets(ws).head
    WidgetCompiler.formatWidget(compiledWidget)
  }

  test("widgetCompiler returns a JavascriptObject corresponding to a given widget") {
    val compiledWidget = compileWidgets(textBoxWidget)
    assert(compiledWidget("left").hasValueOf(JsInt(1)))
  }

  test("WidgetCompiler returns a monitor widget with the widget reporter as a function and a currentValue of empty-string") {
    val compiledWidget = compileWidgets(monitorWidget)
    val expectedCompilation = JsFunction(Seq(), Seq("return globalVar();"))
    assert(compiledWidget("reporter").hasValueOf(expectedCompilation))
  }

  test("WidgetCompiler returns a monitor widget with errors when compilation fails") {
    val compiledWidget = compileWidgets(monitorWidget.copy(source = "error"))
    val failureResult  = JsArray(Seq(JsObject(fields("message" -> JsString("Expected reporter")))))
    val compiledSourceFailure = JsObject(fields("success" -> JsBool(false), "result" -> failureResult))
    assert(compiledWidget("compiledSource").hasValueOf(compiledSourceFailure))
  }

  test("WidgetCompiler returns a slider with getMin, getMax, getStep functions") {
    val compiledSlider = compileWidgets(reporterSlider)
    val expectedValues = Map[String, JsFunction](
      "getMax"  -> JsFunction(Seq(), Seq("return turtles.length();")),
      "getMin"  -> JsFunction(Seq(), Seq("return 0;")),
      "getStep" -> JsFunction(Seq(), Seq("return turtles.length() / 100;")))
    expectedValues.foreach {
      case (key, function) => assert(compiledSlider(key).hasValueOf(function))
    }
  }

  test("Compiles button widgets") {
    val compiledButton = compileWidgets(buttonWidget)
    val successResult = JsObject(fields("success" -> JsBool(true), "result" -> JsString("foobar()")))
    assert(compiledButton("compiledSource").hasValueOf(successResult))
  }

  test("Compiles buttons which have an agent type by asking agents of that type") {
    val compiledButton = compileWidgets(turtleButtonWidget)
    val successResult = JsObject(fields("success" -> JsBool(true),
                                        "result"  -> JsString("AgentSet.ask(world.turtles, function() { foobar; })")))
    assert(compiledButton("compiledSource").hasValueOf(successResult))
  }

  test("Raises an error when the wrong kind of agent is asked to do something") {
    intercept[IllegalArgumentException] { compileWidgets(invalidButtonWidget) }
    ()
  }

  test("Raises an error when two plots with the same name are detected") {
    intercept[CompilerException] { compileWidgets(plot, plot) }
    ()
  }

  implicit class RichJavascriptObjectProperty(prop: Option[ElementValue]) {
    def isPresent: Boolean          = prop.nonEmpty
    def hasValueOf(f: JsFunction)   = prop.map(_ == f).getOrElse(false)
    def hasValueOf(j: TortoiseJson) = prop.map(_ == JsonValueElement(j)).getOrElse(false)
  }
}
