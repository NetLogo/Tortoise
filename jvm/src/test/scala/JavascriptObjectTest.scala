// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  JavascriptObject.JsonValueElement

import
  json.{ JsonLibrary, TortoiseJson },
    JsonLibrary.{ nativeToString, toNative },
    TortoiseJson.{ fields, JsObject, JsString }

import
  org.scalatest.FunSuite

class JavascriptObjectTest extends FunSuite {
  val jsObject   = JsObject(fields("foo" -> JsString("bar")))
  val jsObject2  = JsObject(fields("baz" -> JsString("qux")))
  val jsFunction = JavascriptObject.JsFunction(Seq(), Seq("return 2;"))

  test("writes an empty object as an empty javascript object") {
    assertResult("{}")(new JavascriptObject().toJsString)
  }

  test("writes a javascript object just like tortoise json") {
    val javascriptObject = new JavascriptObject().addObjectProperties(jsObject)
    assertResult(nativeToString(toNative(jsObject)))(javascriptObject.toJsString)
  }

  test("writes a javascript object holding just a single named function") {
    val javascriptObject = new JavascriptObject("foo" -> jsFunction)
    assertResult("""{"foo":function(){return 2;}}""")(javascriptObject.toJsString)
  }

  test("writes a javascript object that has had functions added") {
    val javascriptObject = new JavascriptObject().addObjectProperties(jsObject).addFunction("baz", jsFunction)
    assertResult("""{"baz":function(){return 2;},"foo":"bar"}""")(javascriptObject.toJsString)
  }

  test("writes a javascript named function that has had values added") {
    val javascriptObject = new JavascriptObject("baz" -> jsFunction).addObjectProperties(jsObject)
    assertResult("""{"foo":"bar","baz":function(){return 2;}}""")(javascriptObject.toJsString)
  }

  test("can be queried about elements") {
    val javascriptObject = new JavascriptObject("baz" -> jsFunction).addObjectProperties(jsObject)
    assertResult(Some(jsFunction))(javascriptObject("baz"))
    assertResult(Some(JsonValueElement(JsString("bar"))))(javascriptObject("foo"))
  }

  test("asJsonObject returns a JsObject instead of a string, with function values excluded") {
    val javascriptObject = new JavascriptObject().addObjectProperties(jsObject)
    assertResult(jsObject)(javascriptObject.jsonSerializableSubobject)
  }

  test("asJsonObject return a JsObject with all jsObjects merged") {
    val javascriptObject = new JavascriptObject().addObjectProperties(jsObject).addObjectProperties(jsObject2)
    assertResult(JsObject(fields("foo" -> JsString("bar"), "baz" -> JsString("qux"))))(javascriptObject.jsonSerializableSubobject)
  }
}
