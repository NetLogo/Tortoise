// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  org.json4s.{ JArray, JBool, JDecimal, JDouble, JField, JInt, JLong, JNothing, JNull, JObject, JSet, JString, JValue, native },
    native.JsonMethods.{ compact, render }

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

object JsonLibrary {

  type Native = JValue

  def toNative(tj: TortoiseJson): Native =
    tj match {
      case JsNull          => JNull
      case JsInt(i)        => JInt(i)
      case JsDouble(d)     => JDouble(d)
      case JsString(s)     => JString(s)
      case JsBool(b)       => JBool(b)
      case JsArray(a)      => JArray(a.map(toNative).toList)
      case JsObject(props) => JObject(props.map { case (k, v) => JField(k, toNative(v)) }.toList)
    }

  // scalastyle:off cyclomatic.complexity
  def toTortoise(n: Native): TortoiseJson =
    n match {
      case JNull | JNothing => JsNull
      case JInt(i)          => JsInt(i.toInt)
      case JDouble(d)       => JsDouble(d)
      case JDecimal(d)      => JsDouble(d.toDouble)
      case JLong(l)         => JsDouble(l.toDouble)
      case JString(s)       => JsString(s)
      case JBool(b)         => JsBool(b)
      case JArray(a)        => JsArray(a.map(toTortoise).toList)
      case JObject(props)   => JsObject(fields(props.map { case JField(k, v) => (k, toTortoise(v)) }: _*))
      case x                => throw new Exception(s"$x is a mysterious thing")
    }
  // scalastyle:on cyclomatic.complexity

  def nativeToString(n: Native): String =
    compact(render(n))

}
