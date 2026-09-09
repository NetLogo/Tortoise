// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JavascriptObject.{ JsFunction, JsonValueElement }

import
  json.{ TortoiseJson, WidgetSamples, WidgetToJson },
    TortoiseJson.{ fields, JsArray, JsBool, JsInt, JsObject, JsString },
    WidgetSamples.{ buttonNoName   => turtleButtonWidget,
                    buttonWithName => buttonWidget,
                    monitor        => monitorWidget,
                    plot           => plotWidget,
                    reporterSlider },
    WidgetToJson.widget2Json

import
  org.nlogo.core.{ CompilerException, Widget }

import
  org.scalatest.funsuite.AnyFunSuite

import
  scalaz.{ NonEmptyList, Scalaz, std, ValidationNel },
    Scalaz.ToValidationOps,
    std.option.optionSyntax._

import
  WidgetCompilation.{ CompiledStringV, SliderCompilation, SourceCompilation }

import
  WidgetCompiler.formatWidget

class WidgetCompilerTest extends AnyFunSuite {
  val commandMap = Map(
      "foobar" -> "foobar()"
    , "setup"  -> "procedures.setup()"
    , "update" -> "procedures.update()"
    , "ifelse count turtles = 0 [ stop ] [ ask turtles [ foobar ] ]" ->
      "AgentSet.ask(world.turtles, function() { foobar; })"
  )

  val reporterMap = Map(
    "0"                   -> "0",
    "count turtles"       -> "turtles.length()",
    "count turtles / 100" -> "turtles.length() / 100",
    "reporter"            -> "globalVar()")

  def compileCommand(logo: String): CompiledStringV =
    commandMap.get(logo).toSuccess(NonEmptyList(new Exception("WidgetCompilerTest: Did not get one of our pre-approved commands to 'compile'.")))

  def compileReporter(logo: String): CompiledStringV =
    reporterMap.get(logo).toSuccess(NonEmptyList(new Exception("WidgetCompilerTest: Did not get one of our pre-approved reporters to 'compile'.")))

  def compileWidgets(ws: Widget*): Seq[CompiledWidget] =
    new WidgetCompiler(compileCommand, compileReporter).compileWidgets(ws)

  def compileWidget(w: Widget): CompiledWidget = compileWidgets(w).head

  def assertHasWidgetData(compiledWidget: CompiledWidget, widgetData: Widget): Unit = {
    assert(compiledWidget.widgetData == widgetData)
    ()
  }

  def assertIsSuccess(compiledWidget: CompiledWidget): Unit =
    compiledWidget.widgetCompilation.fold(ex => fail(s"expected success: $ex"), _ => ())

  def assertIsFailure(compiledWidget: CompiledWidget): Unit =
    compiledWidget.widgetCompilation.fold(_ => (), _ => fail("expected failure"))

  def assertHasErrors(compiledWidget: CompiledWidget, errors: String*): Unit = {
    assert(
      compiledWidget.widgetCompilation.fold(
        es =>
          errors.forall(
            name => es.list.toList.exists(_.getMessage.contains(name))),
        _  => fail("compilation should have failed")))
    ()
  }

  def assertContains(jsObject: JavascriptObject, jsonObject: JsObject): Unit = {
    assert(
      jsObject.jsonSerializableSubobject.props.view.filterKeys(jsonObject.props.keySet.contains).toMap ==
        jsonObject.props.toMap)
    ()
  }

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
      _ => fail(),
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
      monitorWidget.copy(source = Option("error")),
      Seq("abc", "reporter", "monitor")),
    ("button",
      buttonWidget.copy(source = Option("fatal-error")),
      Seq("press this", "source", "button")),
    ("plot",
      plotWidget.copy(setupCode = "fatal-error"),
      Seq("plot", "plot-abc", "setup"))).foreach {
        case (name, widget, errors) =>
          test(s"compileWidgets returns a $name widget with errors when compilation fails") {
            val compiledWidget = compileWidget(widget)
            assertHasWidgetData(compiledWidget, widget)
            assertIsFailure(compiledWidget)
            assertHasErrors(compiledWidget, errors*)
          }
      }

   test("errors on bad pen widgets") {
     val badPenPlot = plotWidget.copy(pens = List(plotWidget.pens.head.copy(setupCode = "fatal-error")))
     compileWidget(badPenPlot)
       .asInstanceOf[CompiledPlot].plotWidgetCompilation
       .fold(
         _ => fail("expected plot compilation to succeed, pen compilation to fail"),
         { pwc =>
            assert(pwc.compiledPens.forall(_.updateableCompilation.isFailure))
            assert(
              pwc.compiledPens.head.updateableCompilation.fold(
                es =>
                  Seq("pen", "pen-abc", "setup").forall(
                    name => es.list.toList.exists(_.getMessage.contains(name))),
                _  => fail("compilation should have failed")))
         })
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
        "messages"    -> JsArray(Seq(JsObject(fields("message" -> JsString("Expected reporter"))))))))

    assertContains(widgetJsObject, monitorWidget.toJsonObj.asInstanceOf[JsObject])
    assertHasValues(widgetJsObject, compilationFailure)
  }

  test("a failing widget reports the source location and field of the error") {
    val failure: ValidationNel[Exception, WidgetCompilation] =
      NonEmptyList[Exception](
        new WidgetCompilerException( "monitor 'foo' - monitor.reporter: Expected reporter", 4, 9, ""
                                   , "monitor", "foo", "reporter")).failure[WidgetCompilation]
    val widgetJsObject = formatWidget(compiledWidget(failure))
    val compilationFailure = Map(
      "compilation" -> JsObject(fields(
        "success"  -> JsBool(false),
        "messages" -> JsArray(Seq(JsObject(fields(
          "message" -> JsString("monitor 'foo' - monitor.reporter: Expected reporter"),
          "start"   -> JsInt(4),
          "end"     -> JsInt(9),
          "widget"  -> JsString("foo"),
          "field"   -> JsString("reporter"))))))))

    assertHasValues(widgetJsObject, compilationFailure)
  }

  test("contextualizeError keeps the source location of a CompilerException") {
    import WidgetCompiler.ValidationContextualizer

    val failure: CompiledStringV =
      NonEmptyList[Exception](new CompilerException("Expected reporter", 4, 9, "")).failure[String]
    val contextualized = failure.contextualizeError("monitor", "foo", "reporter")

    contextualized.fold(
      es => es.list.toList.head match {
        case we: WidgetCompilerException =>
          assert(we.start       == 4)
          assert(we.end         == 9)
          assert(we.widgetType  == "monitor")
          assert(we.widgetName  == "foo")
          assert(we.widgetField == "reporter")
          assert(we.getMessage  == "monitor 'foo' - monitor.reporter: Expected reporter")
        case other => fail(s"expected a WidgetCompilerException, got: $other")
      },
      _ => fail("compilation should have failed"))
    ()
  }

  // A turtle button's code is wrapped in an `ask` before compiling, so an error's offsets have to come back out of that
  // wrapper to mean anything against the button's own source.  -Jeremy B September 2026
  test("a failing turtle button reports offsets against its own source") {
    val askWrapper = "ifelse count turtles = 0 [ stop ] [ ask turtles [ "
    val failInWrapper = (_: String) =>
      NonEmptyList[Exception](
        new CompilerException("Nothing named FOOBAR here", askWrapper.length, askWrapper.length + 6, "")
      ).failure[String]

    val compiled =
      new WidgetCompiler(failInWrapper, compileReporter).compileWidgets(Seq(turtleButtonWidget)).head

    compiled.widgetCompilation.fold(
      es => es.list.toList.head match {
        case we: WidgetCompilerException => assert(we.start == 0 && we.end == 6)
        case other                       => fail(s"expected a WidgetCompilerException, got: $other")
      },
      _ => fail("compilation should have failed"))
    ()
  }
}
