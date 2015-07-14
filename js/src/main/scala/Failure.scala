// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  json.{ JsonReader, JsonWritable, JsonWriter, TortoiseJson },
    TortoiseJson.{ fields, JsInt, JsObject, JsString }

import
  org.nlogo.core.CompilerException

sealed trait Failure
case class FailureString(str: String) extends Failure
case class FailureException(exception: Throwable) extends Failure
case class FailureCompilerException(exception: CompilerException) extends Failure

object Failure {
  implicit object compileFailure2Json extends JsonWriter[Failure] {
    def apply(f: Failure): TortoiseJson =
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

  implicit def failure2Json(f: Failure): JsonWritable =
    JsonWriter.convert(f)

  implicit def exception2Json(ex: Throwable): JsonWritable =
    JsonWriter.convert(ex)
}
