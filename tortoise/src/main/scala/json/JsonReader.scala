// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import scala.reflect.ClassTag

import TortoiseJson._

trait LowPriorityImplicitReaders {

  implicit object boolean2TortoiseJs extends JsonReader[TortoiseJson, Boolean] {
    def apply(t: TortoiseJson) = t match {
      case JsBool(b) => Right(b)
      case o         => incompatibleClass(o.getClass, classOf[Boolean])
    }
  }

  abstract class NumberConversion[S](implicit targetClass: ClassTag[S]) extends JsonReader[TortoiseJson, S] {
    def apply(t: TortoiseJson) = t match {
      case JsInt(i)    => convertInt(i)
      case JsDouble(d) => convertDouble(d)
      case o           => incompatibleClass(o.getClass, targetClass.runtimeClass)
    }

    def convertInt(i: Int): Either[String, S]
    def convertDouble(d: Double): Either[String, S]
  }

  implicit object tortoiseJs2Int extends NumberConversion[Int] {
    def convertInt(i: Int) = Right(i)
    def convertDouble(d: Double) =
      if (d.isValidInt)
        Right(d.toInt)
      else
        Left(s"The value $d could not be converted to an Int")
  }

  implicit object tortoiseJs2Double extends NumberConversion[Double] {
    def convertInt(i: Int) = Right(i.toDouble)
    def convertDouble(d: Double) = Right(d)
  }

  implicit object tortoiseJs2String extends JsonReader[TortoiseJson, String] {
    def apply(json: TortoiseJson): Either[String, String] = json match {
      case JsString(s) => Right(s)
      case other       => Left(s"could not convert ${other.getClass.getSimpleName} to String")
    }
  }
}

trait JsonReader[T <: TortoiseJson, S] extends (T => Either[String, S]) {
  def read(key: String, json: Option[T]): Either[String, S] =
    json.toRight(s"could not find key $key").right.flatMap(apply)
  def apply(json: T): Either[String, S]
  protected def incompatibleClass(from: Class[_], to: Class[_]): Either[String, S] =
    Left(s"could not convert ${from.getSimpleName} to ${to.getSimpleName}")

}

object JsonReader extends LowPriorityImplicitReaders {
  def readField[A](o: JsObject, key: String)(implicit ev: JsonReader[TortoiseJson, A]): Either[String, A] = ev.read(key, o.props.get(key))
}