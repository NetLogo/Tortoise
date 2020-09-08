// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  json.{ JsonWritable, JsonWriter, TortoiseJson },
    TortoiseJson.{ fields, JsInt, JsObject, JsString }

import
  org.nlogo.core.CompilerException

sealed trait TortoiseFailure
case class FailureString(str: String) extends TortoiseFailure
case class FailureException(exception: Throwable) extends TortoiseFailure
case class FailureCompilerException(exception: CompilerException) extends TortoiseFailure

object TortoiseFailure {
  implicit object compileFailure2Json extends JsonWriter[TortoiseFailure] {
    def apply(f: TortoiseFailure): TortoiseJson =
      f match {
        case FailureCompilerException(ce) => ce.toJsonObj
        case FailureException(e)          => e.toJsonObj
        case FailureString(s)             =>
          JsObject(fields("message" -> JsString(s)))
      }
  }

  implicit object compileError2Json extends JsonWriter[Throwable] {
    def apply(ex: Throwable): TortoiseJson =
      ex match {
        case compilerException: CompilerException =>
          JsObject(fields(
            "message" -> JsString(compilerException.getMessage),
            "start"   -> JsInt(compilerException.start),
            "end"     -> JsInt(compilerException.end)))
        case otherException                       =>
          JsObject(fields(
            "message" -> JsString(otherException.getMessage)))
      }
  }

  implicit def failure2Json(f: TortoiseFailure): JsonWritable =
    JsonWriter.convert(f)

  implicit def exception2Json(ex: Throwable): JsonWritable =
    JsonWriter.convert(ex)
}
