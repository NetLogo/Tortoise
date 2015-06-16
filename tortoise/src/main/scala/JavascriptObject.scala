// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  JavascriptObject.{ ElementValue, JavascriptElement, JsFunction, JsonValueElement }

import
  json.{ JsonLibrary, TortoiseJson },
    JsonLibrary.{ nativeToString, toNative },
    TortoiseJson.{ fields, JsObject }

import
  JsOps.jsFunction

import
  scala.collection.immutable.ListMap

// JavascriptObject represents a fully-featured javascript object.
// We need it because functions can't be rendered out using TortoiseJson/JsObject.
// This gives us the freedom to combine functions and data in one object. RG 5/22/15
class JavascriptObject(elements: JavascriptElement*) {
  lazy val elementMap = ListMap(elements: _*)

  def addFunction(key: String, function: JsFunction): JavascriptObject =
    new JavascriptObject(((key -> function) +: elements): _*)

  def addObjectProperties(jsObject: JsObject): JavascriptObject =
    new JavascriptObject(
      (jsObject.props.toSeq.map(t => t._1 -> JsonValueElement(t._2)) ++ elements): _*)

  def toJsString: String =
    elements.map(t => (t._2.renderField(t._1))).mkString("{", ",", "}")

  def apply(key: String): Option[ElementValue] =
    elementMap.get(key)

  lazy val jsonSerializableSubobject: JsObject =
    JsObject(elements.map(t => t._2.jsObjectProps(t._1)).foldLeft(fields())(_ ++ _))
}

object JavascriptObject {
  type JavascriptElement = (String, ElementValue)

  trait ElementValue {
    def renderField(k: String):   String
    def jsObjectProps(k: String): ListMap[String, TortoiseJson] =
      ListMap[String, TortoiseJson]()
  }

  case class JsFunction(args: Seq[String], body: Seq[String]) extends ElementValue {
    def renderField(name: String): String =
      s""""$name":$toJsString"""
    def toJsString: String =
      jsFunction(args, body.mkString("\n"))
  }

  case class JsonValueElement(json: TortoiseJson) extends ElementValue {
    override def jsObjectProps(k: String): ListMap[String, TortoiseJson] =
      ListMap(k -> json)
    def renderField(name: String): String = {
      val jsObject = JsObject(fields(name -> json))
      stripOutermostBraces(nativeToString(toNative(jsObject)))
    }
    private def stripOutermostBraces(s: String) =
      s.drop(1).dropRight(1)
  }
}
