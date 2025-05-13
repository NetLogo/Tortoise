// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  scala.scalajs.js.{ Any => JAny, Array => JArray, Dictionary, JSON, typeOf }

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

import org.nlogo.tortoise.compiler.utils.CompilerUtils

object JsonLibrary {

  type Native = JAny

  def toNative(tj: TortoiseJson): Native =
    tj match {
      // scalastyle:off null
      case JsNull          => null // as of scala.js 0.6.2 JAny.fromUnit(()) is undefined, not null - RG 5/19/15
      // scalastyle:on null
      case JsInt(i)        => JAny.fromInt(i)
      case JsDouble(d)     => JAny.fromDouble(d)
      case JsString(s)     => JAny.fromString(s)
      case JsBool(b)       => JAny.fromBoolean(b)
      case JsArray(a)      => JArray(a.map(toNative): _*)
      case JsObject(props) => Dictionary(props.toMap.view.mapValues(toNative).toSeq: _*)
    }

  // scalastyle:off cyclomatic.complexity
  def toTortoise(nativeValue: Native): TortoiseJson =
    (nativeValue, typeOf(nativeValue)) match {
      // scalastyle:off null
      // scala.js represents javascript null as jvm null. RG 22/5/15
      case (null,                         _)                             => JsNull
      // scalastyle:on null
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
        // Pattern match impossible, since `Dictionary` is raw JS --JAB (4/27/15)
        val d        = JAny.wrapDictionary(nativeValue.asInstanceOf[Dictionary[Native]])
        val mappings = d.keys.map(k => k -> toTortoise(d(k)))
        JsObject(fields(mappings.toSeq: _*))

      case _ =>
        CompilerUtils.failCompilation(s"Unknown native value type encountered: ${nativeValue.toString}")
    }
  // scalastyle:on cyclomatic.complexity

  def nativeToString(n: Native): String =
    JSON.stringify(n)

}
