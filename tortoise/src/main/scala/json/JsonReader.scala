// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  scala.reflect.ClassTag

import
  scalaz.{ syntax, Scalaz, NonEmptyList, Validation, ValidationNel },
    Validation.FlatMap.ValidationFlatMapRequested,
    Scalaz.ToValidationOps,
    syntax.std.option._

import
  TortoiseJson.{ JsArray, JsBool, JsDouble, JsInt, JsObject, JsString }

trait LowPriorityImplicitReaders {
  import JsonReader.JsonSequenceReader

  implicit object boolean2TortoiseJs extends JsonReader[TortoiseJson, Boolean] {
    def apply(t: TortoiseJson): ValidationNel[String, Boolean] = t match {
      case JsBool(b) => b.successNel
      case o         => incompatibleClass(o.getClass, classOf[Boolean])
    }
  }

  abstract class NumberConversion[S](implicit targetClass: ClassTag[S]) extends JsonReader[TortoiseJson, S] {
    def apply(t: TortoiseJson): ValidationNel[String, S] = t match {
      case JsInt(i)    => convertInt(i)
      case JsDouble(d) => convertDouble(d)
      case o           => incompatibleClass(o.getClass, targetClass.runtimeClass)
    }

    def convertInt(i: Int): ValidationNel[String, S]
    def convertDouble(d: Double): ValidationNel[String, S]
  }

  implicit object tortoiseJs2Int extends NumberConversion[Int] {
    def convertInt(i: Int):       ValidationNel[String, Int] = i.successNel
    def convertDouble(d: Double): ValidationNel[String, Int] =
      if (d.isValidInt)
        d.toInt.successNel
      else
        s"The value $d could not be converted to an Int".failureNel
  }

  implicit object tortoiseJs2Double extends NumberConversion[Double] {
    def convertInt(i: Int):       ValidationNel[String, Double] = i.toDouble.successNel
    def convertDouble(d: Double): ValidationNel[String, Double] = d.successNel
  }

  implicit object tortoiseJs2String extends JsonReader[TortoiseJson, String] {
    def apply(json: TortoiseJson): ValidationNel[String, String] = json match {
      case JsString(s) => s.successNel
      case other       => s"could not convert $other to String".failureNel
    }
  }

  implicit object tortoiseJsAsStringSeq extends JsonSequenceReader[String] {
    def nonArrayErrorString(json: TortoiseJson): String =
      s"expected an array of strings, found $json"

    def convertElem(json: TortoiseJson): ValidationNel[String, String] =
      tortoiseJs2String(json)
  }

  implicit object tortoiseJsAsJsObject extends JsonReader[TortoiseJson, JsObject] {
    def apply(json: TortoiseJson): ValidationNel[String, JsObject] = json match {
      case o: JsObject => o.successNel
      case x           => s"Expected Javascript Object, found $x".failureNel
    }
  }

  implicit object tortoiseJsAsJsArray extends JsonReader[TortoiseJson, JsArray] {
    def apply(json: TortoiseJson): ValidationNel[String, JsArray] = json match {
      case a: JsArray => a.successNel
      case x          => s"Expected Javascript Array, found $x".failureNel
    }
  }
}

trait JsonReader[T <: TortoiseJson, S] extends (T => ValidationNel[String, S]) {

  override def apply(json: T): ValidationNel[String, S]

  def read(key: String, json: Option[T]): ValidationNel[String, S] =
    json.toSuccess(NonEmptyList(s"could not find key $key")).flatMap(apply)

  protected def incompatibleClass(from: Class[_], to: Class[_]): ValidationNel[String, S] =
    s"could not convert ${from.getSimpleName} to ${to.getSimpleName}".failureNel

}

object JsonReader extends LowPriorityImplicitReaders {

  def readField[A](o: JsObject, key: String)(implicit ev: JsonReader[TortoiseJson, A]): ValidationNel[String, A] =
    ev.read(key, o.props.get(key))

  def read[A](t: TortoiseJson)(implicit ev: JsonReader[TortoiseJson, A]): ValidationNel[String, A] =
    ev(t)

  class RichJsObject(json: JsObject) {
    def apply[A](s: String)(implicit ev: JsonReader[TortoiseJson, A]): A =
      JsonReader.readField(json, s)(ev).getOrElse(throw new Exception(s"not able to find value for $s"))
  }

  class RichJsArray(json: JsArray) {
    def apply[A](i: Int)(implicit ev: JsonReader[TortoiseJson, A]): A =
      ev(json.elems(i)).getOrElse(throw new Exception(s"not able to find value at index $i"))
  }

  implicit def jsObject2RichJsObject(json: JsObject): RichJsObject =
    new RichJsObject(json)

  implicit def jsArray2RichJsArray(json: JsArray): RichJsArray =
    new RichJsArray(json)

  abstract class JsonSequenceReader[T] extends JsonReader[TortoiseJson, Seq[T]] {
    import scalaz.{ std, syntax },
      syntax.traverse._,
      std.list._

    def nonArrayErrorString(json: TortoiseJson): String
    def convertElem(json: TortoiseJson): ValidationNel[String, T]

    def apply(json: TortoiseJson): ValidationNel[String, Seq[T]] =
      json match {
        case JsArray(elems) => elems.map(convertElem).toList.sequenceU
        case other          => nonArrayErrorString(other).failureNel[Seq[T]]
      }
  }
}
