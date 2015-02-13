// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  scala.scalajs.js.{ Any => JAny, Array => JArray, Dictionary, JSON, Object => JObject, typeOf }

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

object JsonLibrary {

  type Native = JAny

  def toNative(tj: TortoiseJson): Native =
    tj match {
      case JsNull          => JAny.fromUnit(())
      case JsInt(i)        => JAny.fromInt(i)
      case JsDouble(d)     => JAny.fromDouble(d)
      case JsString(s)     => JAny.fromString(s)
      case JsBool(b)       => JAny.fromBoolean(b)
      case JsArray(a)      => JArray(a.map(toNative): _*)
      case JsObject(props) => Dictionary(props.toMap.mapValues(toNative).toSeq: _*)
    }

  def toTortoise(nativeValue: Native): TortoiseJson =
    (nativeValue, typeOf(nativeValue)) match {
      case (null,                         _)                             => JsNull
      case (_,                            "undefined" | "function")      => JsNull
      case (n,                            "number")                      =>
        val d = (n.asInstanceOf[Double])
        if (d.isValidInt)
          JsInt(d.toInt)
        else
          JsDouble(d)
      case (s,                            "string")                      => JsString(s.asInstanceOf[String])
      case (b,                            "boolean")                     => JsBool(b.asInstanceOf[Boolean])
      case (o: JArray[Native @unchecked], "object") if JArray.isArray(o) => JsArray(o.map(toTortoise(_: Native)).toList)
      case (_,                            "object")                      =>
        val d        = JAny.wrapDictionary(nativeValue.asInstanceOf[Dictionary[Native]]) // Pattern match impossible, since `Dictionary` is raw JS --JAB (4/27/15)
        val mappings = d.keys.map(k => k -> toTortoise(d(k)))
        JsObject(fields(mappings.toSeq: _*))
    }

  def nativeToString(n: Native): String =
    JSON.stringify(n)

}
