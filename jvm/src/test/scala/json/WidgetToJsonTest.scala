// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  JsonLibrary.{ toTortoise, toNative }

import
  org.scalatest.FunSuite

import
  scalaz.Scalaz.ToValidationOps

import
  TortoiseJson.{ fields, JsNull, JsObject, JsString }

import
  WidgetSamples.{ locatableJsObject, testWidgets, widgetJsons }

import
  WidgetToJson._

class WidgetToJsonTest extends FunSuite {

  (widgetJsons zip testWidgets).foreach {
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
        val fullySerializedValue = toTortoise(toNative(widget.toJsonObj))
        assertResult(WidgetToJson.read(fullySerializedValue.asInstanceOf[JsObject]))(widget.successNel[String])
      }

  }

  test("fails to read without a type") {
    val failure =
      "Widgets must be represented as a JSON Object with type specified".failureNel
    assertResult(failure)(WidgetToJson.read(JsObject(fields())))
  }

  test("errors when reading bad output") {
    assertResult("could not convert JsNull$ to int".failureNel)(
        WidgetToJson.read(locatableJsObject(
          "type"     -> JsString("output"),
          "fontSize" -> JsNull
        )))
  }

}
