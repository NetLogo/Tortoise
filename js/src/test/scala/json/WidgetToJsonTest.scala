// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  JsonLibrary.{ toTortoise, toNative }

import
  scalaz.Scalaz.ToValidationOps

import
  TortoiseJson.{ fields, JsNull, JsObject, JsString }

import
  utest._

import
  WidgetSamples.{ locatableJsObject, testWidgets, widgetJsons }

import
  WidgetToJson.{ read => readWidget, widget2Json }

object WidgetToJsonTest extends TestSuite {
  val tests = TestSuite {
    "test serialization, deserialization, round-tripping"-{
      (widgetJsons zip testWidgets).foreach {
        case ((name, json), (_, widget)) =>
          assert(json == widget.toJsonObj)

          val deserializedWidget = readWidget(json)
          assert(deserializedWidget.isSuccess)
          assert(deserializedWidget.getOrElse(null) == widget)

          val roundTripSerialized = toTortoise(toNative(json)).asInstanceOf[JsObject]
          val readObject = readWidget(roundTripSerialized)

          assert(readObject.isSuccess)
          assert(readObject.getOrElse(null).toJsonObj == json)
          assert(widget.successNel[String] ==
            readWidget(widget.toJsonObj.asInstanceOf[JsObject]))
      }
    }

  "fails to read without a type"-{
    assert("no conversion available".failureNel == readWidget(JsObject(fields())))
  }

  "errors when reading bad output"-{
    println(WidgetToJson.read(locatableJsObject(
      "type"     -> JsString("output"),
      "fontSize" -> JsNull)))
    assert(
      "could not convert JsNull to int".failureNel ==
        WidgetToJson.read(locatableJsObject(
          "type"     -> JsString("output"),
          "fontSize" -> JsNull
        )))
  }
  }
}
