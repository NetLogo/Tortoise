// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  scala.language.implicitConversions

import
  JsonLibrary.{ nativeToString, toNative }

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsObject, JsString }

trait JsonWritable {
  def toJsonObj: JsObject
  def toJson   : String       = nativeToString(toNative(toJsonObj))
}

trait JsonConverter[T] extends JsonWritable {

  protected def target    : T
  protected def extraProps: JsObject
  protected def baseProps : JsObject = JsObject(fields())

  final override def toJsonObj: JsObject = JsObject(extraProps.props ++ baseProps.props)
}

trait JsonWriter[T] extends (T => TortoiseJson) {
  def write(target: T): Option[TortoiseJson] = Some(apply(target))
  def apply(target: T): TortoiseJson
}

object JsonWriter extends LowPriorityWriterImplicits {
  implicit def convert[T](target: T)(implicit ev: JsonWriter[T]): JsonWritable =
    new JsonWritable {
      def toJsonObj = ev(target).asInstanceOf[JsObject]
    }
}

trait LowPriorityWriterImplicits {
  implicit object string2TortoiseJs extends JsonWriter[String] {
    def apply(s: String): TortoiseJson  = JsString(s)
  }

  implicit object int2TortoiseJs extends JsonWriter[Int] {
    def apply(i: Int): TortoiseJson     = JsInt(i)
  }

  implicit object double2TortoiseJs extends JsonWriter[Double] {
    def apply(d: Double): TortoiseJson  = JsDouble(d)
  }

  implicit object bool2TortoiseJs extends JsonWriter[Boolean] {
    def apply(b: Boolean): TortoiseJson = JsBool(b)
  }

  class ListConversion[A](implicit ev: JsonWriter[A]) extends JsonWriter[List[A]] {
    def apply(l: List[A]): TortoiseJson = JsArray(l.map(ev))
  }
}
