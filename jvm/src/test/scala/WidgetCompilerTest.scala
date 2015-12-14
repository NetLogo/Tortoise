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
                    pen            => penWidget,
                    plot           => plotWidget,
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
  scalaz.{ NonEmptyList, Scalaz, std, ValidationNel },
    Scalaz.ToValidationOps,
    std.option.optionSyntax._

import
  WidgetCompilation.{ CompiledStringV, NotCompiled, SliderCompilation, SourceCompilation }

import
  WidgetCompiler.formatWidget

class WidgetCompilerTest extends FunSuite {
  val commandMap = Map(
    "foobar"                 -> "foobar()",
    "ask turtles [ foobar ]" -> "AgentSet.ask(world.turtles, function() { foobar; })",
    "setup"                  -> "procedures.setup()",
    "update"                 -> "procedures.update()")

  val reporterMap = Map(
    "0"                   -> "0",
    "count turtles"       -> "turtles.length()",
    "count turtles / 100" -> "turtles.length() / 100",
    "reporter"            -> "globalVar()")

  def compileCommand(logo: String): CompiledStringV =
    commandMap.get(logo).toSuccess(NonEmptyList(new Exception("Expected command")))

  def compileReporter(logo: String): CompiledStringV =
    reporterMap.get(logo).toSuccess(NonEmptyList(new Exception("Expected reporter")))

  def compileWidgets(ws: Widget*): Seq[CompiledWidget] =
    new WidgetCompiler(compileCommand, compileReporter).compileWidgets(ws)

  def compileWidget(w: Widget): CompiledWidget = compileWidgets(w).head

  def assertHasWidgetData(compiledWidget: CompiledWidget, widgetData: Widget): Unit =
    assert(compiledWidget.widgetData == widgetData)

  def assertIsSuccess(compiledWidget: CompiledWidget): Unit =
    compiledWidget.widgetCompilation.fold(_ => fail("expected success"), _ => ())

  def assertIsFailure(compiledWidget: CompiledWidget): Unit =
    compiledWidget.widgetCompilation.fold(_ => (), _ => fail("expected failure"))

  def assertHasErrors(compiledWidget: CompiledWidget, errors: String*): Unit =
    assert(
      compiledWidget.widgetCompilation.fold(
        es      =>
          errors.forall(
            name => es.list.toList.exists(_.getMessage.contains(name))),
        success => fail("compilation should have failed")))

  def assertContains(jsObject: JavascriptObject, jsonObject: JsObject): Unit =
    assert(
      jsObject.jsonSerializableSubobject.props.filterKeys(jsonObject.props.keySet.contains) ==
        jsonObject.props)

  def assertHasFunctions(jsObject: JavascriptObject, values: Map[String, JsFunction]): Unit =
    values.foreach {
      case (key, function) => assert(jsObject(key).exists(_ == function))
    }

  def assertHasValues(jsObject: JavascriptObject, values: Map[String, TortoiseJson]): Unit =
    values.foreach {
      case (key, value) => assert(jsObject(key).exists(_ == JsonValueElement(value)))
    }

  def compiledWidget(compilation: ValidationNel[Exception, WidgetCompilation]): CompiledWidget =
    CompiledWidget(monitorWidget, compilation)

  Map(
    "monitor" -> monitorWidget,
    "button"  -> buttonWidget,
    "plot"    -> plotWidget,
    "slider"  -> reporterSlider).foreach {
      case (name, widget) =>
        test(s"compileWidgets returns a compiled $name widget") {
          val compiledWidget = compileWidget(widget)
          assertHasWidgetData(compiledWidget, widget)
          assertIsSuccess(compiledWidget)
        }
    }

  test("compileWidgets returns a compiled turtle button widget") {
    val compiledButton = compileWidget(turtleButtonWidget)
    assertIsSuccess(compiledButton)
    assertHasWidgetData(compiledButton, turtleButtonWidget)
    compiledButton.widgetCompilation.fold(
      e => fail(),
      c => c match {
        case SourceCompilation(source) =>
          assert(source == "AgentSet.ask(world.turtles, function() { foobar; })")
        case _ => fail("compilation should have succeeded")
      })
  }

  Seq(
    ("slider",
      reporterSlider.copy(min = "error", max = "error", step = "error"),
      Seq("slider", "min", "max", "step")),
    ("monitor",
      monitorWidget.copy(source = "error"),
      Seq("abc", "reporter", "monitor")),
    ("button",
      buttonWidget.copy(source = "fatal-error"),
      Seq("press this", "source", "button")),
    ("plot",
      plotWidget.copy(setupCode = "fatal-error"),
      Seq("plot", "abc", "setup"))).foreach {
        case (name, widget, errors) =>
          test(s"compileWidgets returns a $name widget with errors when compilation fails") {
            val compiledWidget = compileWidget(widget)
            assertHasWidgetData(compiledWidget, widget)
            assertIsFailure(compiledWidget)
            assertHasErrors(compiledWidget, errors: _*)
          }
      }

   test("errors on bad pen widgets") {
     val badPenPlot = plotWidget.copy(pens = List(penWidget.copy(setupCode = "fatal-error")))
     compileWidget(badPenPlot)
       .asInstanceOf[CompiledPlot].plotWidgetCompilation
       .fold(
         es  => fail("expected plot compilation to succeed, pen compilation to fail"),
         { pwc =>
            assert(pwc.compiledPens.forall(_.widgetCompilation.isFailure))
            assertHasErrors(pwc.compiledPens.head , "pen", "abc", "setup")
         })
   }

  test("compileWidgets errors when the wrong kind of agent is asked to do something") {
    intercept[IllegalArgumentException] { compileWidget(invalidButtonWidget) }
    ()
  }

  test("compileWidgets errors when two plots with the same name are detected") {
    intercept[CompilerException] { compileWidgets(plotWidget, plotWidget) }
    ()
  }

  val compilationSuccess = Map(
    "compilation" -> JsObject(fields(
      "success"     -> JsBool(true),
      "messages"    -> JsArray(Seq()))))

  test("formatWidgets formats SourceCompilation widget, preserving data") {
    val goodWidget = compiledWidget(SourceCompilation("globalVar()").successNel)
    val widgetJsObject = formatWidget(goodWidget)
    val expectedFunctions = Map("reporter" -> JsFunction(Seq(), Seq("return globalVar();")))

    assertContains(widgetJsObject, monitorWidget.toJsonObj.asInstanceOf[JsObject])
    assertHasValues(widgetJsObject, compilationSuccess)
    assertHasFunctions(widgetJsObject, expectedFunctions)
  }

  test("formatWidgets formats slider with getMin, getMax, getStep") {
    val sliderCompilation =
      SliderCompilation("0", "turtles.length()", "turtles.length() / 100")

    val formattedSlider = formatWidget(CompiledWidget(reporterSlider, sliderCompilation.successNel))

    val expectedValues = Map[String, JsFunction](
      "getMin"  -> JsFunction(Seq(), Seq("return 0;")),
      "getMax"  -> JsFunction(Seq(), Seq("return turtles.length();")),
      "getStep" -> JsFunction(Seq(), Seq("return turtles.length() / 100;")))

    assertContains(formattedSlider,  reporterSlider.toJsonObj.asInstanceOf[JsObject])
    assertHasValues(formattedSlider, compilationSuccess)
    assertHasFunctions(formattedSlider, expectedValues)
  }

  test("formatWidgets formats button widgets") {
    val formattedButton =
      formatWidget(CompiledWidget(buttonWidget, SourceCompilation("foobar()").successNel))

    val compiledSource = Map("compiledSource" -> JsString("foobar()"))

    assertHasValues(formattedButton, compiledSource)
    assertHasValues(formattedButton, compilationSuccess)
  }

  test("formatWidgets formats failing SourceCompilation widget") {
    val failingWidget  = compiledWidget(new Exception("Expected reporter").failureNel)
    val widgetJsObject = formatWidget(failingWidget)
    val compilationFailure = Map(
      "compilation" -> JsObject(fields(
        "success"     -> JsBool(false),
        "messages"    -> JsArray(Seq(JsString("Expected reporter"))))))

    assertContains(widgetJsObject, monitorWidget.toJsonObj.asInstanceOf[JsObject])
    assertHasValues(widgetJsObject, compilationFailure)
  }
}
