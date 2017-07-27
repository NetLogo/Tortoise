// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import play.api.libs.json.
  { Json,
    JsNull    => JNull,
    JsBoolean => JBoolean,
    JsString  => JString,
    JsObject  => JObject,
    JsArray   => JArray,
    JsNumber  => JNumber,
    JsValue   => JValue
  }

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

object JsonLibrary {

  type Native = JValue

  def toNative(tj: TortoiseJson): Native =
    tj match {
      case JsNull          => JNull
      case JsInt(i)        => JNumber(i)
      case JsDouble(d)     => JNumber(d)
      case JsString(s)     => JString(s)
      case JsBool(b)       => JBoolean(b)
      case JsArray(a)      => JArray(a.map(toNative))
      case JsObject(props) => JObject(props.toMap.mapValues(toNative).toSeq)
    }

  def toTortoise(nativeValue: Native): TortoiseJson =
    nativeValue match {
      case JNull        => JsNull
      case JNumber(n)   => if (n.isValidInt) JsInt(n.intValue) else JsDouble(n.doubleValue)
      case JString(s)   => JsString(s)
      case JBoolean(b)  => JsBool(b)
      case arr: JArray  => JsArray(arr.value.map(toTortoise).toList)
      case obj: JObject =>
        val m = obj.value.keys.map((k) => k -> toTortoise(obj(k)))
        JsObject(fields(m.toSeq: _*))
      case x            => throw new Exception(s"$x is a mysterious thing")
    }

  def nativeToString(n: Native): String =
    Json.stringify(n)

}
