// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  TortoiseJson._

import
  scala.scalajs.js,
    js.{ Any => JAny, Array => JArray, Object => JObject, Dynamic, Dictionary, JSON, typeOf, prim },
      prim.{ Number => JNumber, Boolean => JBoolean, String => JString }

object JsonLibrary {
  type Native = JAny

  def toNative(tj: TortoiseJson): Native =
    tj match {
      case JsNull => JAny.fromUnit(())
      case JsInt(i) => JAny.fromInt(i)
      case JsDouble(d) => JAny.fromDouble(d)
      case JsString(s) => JAny.fromString(s)
      case JsBool(b) => JAny.fromBoolean(b)
      case JsArray(a) => JArray(a.map(toNative): _*)
      case JsObject(props) =>
        Dictionary(props.map { case (k, v) => (k, toNative(v)) }.toSeq: _*)
    }

  def toTortoise(n: Native): TortoiseJson =
    if (n == null)
      JsNull
    else typeOf(n) match {
      case "number" =>
        val convertedNumber: Double = n.asInstanceOf[JNumber]
        if (convertedNumber.isValidInt)
          JsInt(convertedNumber.toInt)
        else
          JsDouble(convertedNumber)
      case "undefined" => JsNull
      case "string"    => JsString(n.asInstanceOf[JString]: String)
      case "boolean"   => JsBool(n.asInstanceOf[JBoolean]: Boolean)
      case "object" if JArray.isArray(n) =>
        JsArray(n.asInstanceOf[JArray[Native]].map { (x: Native) =>
          toTortoise(x)
        }.toList)
      case "object"    =>
        val dict = n.asInstanceOf[Dictionary[Native]]
        val fieldValues = JObject.keys(dict).toList.map(
          k => (k, toTortoise(dict(k))))
        JsObject(fields(fieldValues: _*))
    }

  def nativeToString(n: Native): String =
    JSON.stringify(n)
}
