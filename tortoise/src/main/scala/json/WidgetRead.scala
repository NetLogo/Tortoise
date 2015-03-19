// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise.json

import
  org.nlogo.core.{ Button, Chooseable, Chooser, Col, Direction, Horizontal, InputBox, InputBoxType, LogoList, Monitor, Num, Output, Pen, Plot, Slider, Str, StrCommand, StrReporter, Switch, TextBox, UpdateMode, Vertical, View, Widget }

import TortoiseJson._

object WidgetRead {
  implicit object tortoiseJs2NilString extends JsonReader[TortoiseJson, String] {
    def apply(json: TortoiseJson): Either[String, String] = json match {
      case JsNull      => Right("NIL")
      case JsString(s) => Right(s)
      case other       => Left(s"could not convert ${other.getClass.getSimpleName} to String")
    }
  }

  implicit object tortoiseJs2UpdateMode extends JsonReader[TortoiseJson, UpdateMode] {
    def apply(t: TortoiseJson) = t match {
      case JsString(s) if s.toUpperCase == "CONTINUOUS" =>
        Right(UpdateMode.Continuous)
      case JsString(s) if s.toUpperCase == "TICKBASED"  =>
        Right(UpdateMode.TickBased)
      case other                  =>
        Left(s"View update mode can only be 'Continuous' or 'TickBased' but was $other")
    }
  }

  implicit object tortoiseJs2OptionString extends JsonReader[TortoiseJson, Option[String]] {
    override def read(key: String, json: Option[TortoiseJson]): Either[String, Option[String]] =
      json.map(j =>
          apply(j).left.map(value => s"$value is an invalid value for $key"))
            .getOrElse(Right(None))

            def apply(t: TortoiseJson): Either[String, Option[String]] =
              t match {
                case JsNull          => Right(None)
                case JsString("NIL") => Right(None)
                case JsString(s)     => Right(Some(s))
                case other           => Left(other.toString)
              }
  }

  implicit object tortoiseJs2Direction extends JsonReader[TortoiseJson, Direction] {
    def apply(t: TortoiseJson) = t match {
      case JsString(s) if s.toUpperCase == "HORIZONTAL" =>
        Right(Horizontal)
      case JsString(s) if s.toUpperCase == "VERTICAL"   =>
        Right(Vertical)
      case other                                        =>
        Left(s"Slider direction can only be 'Horizontal' or 'Vertical' but was $other")
    }
  }

  implicit object tortoiseJs2InputBoxType extends JsonReader[TortoiseJson, InputBoxType] {
    private def invalidType(s: String): String = s"Invalid input box type $s"
    def apply(t: TortoiseJson) = t match {
      case JsString(s) =>
        List(Num, Str, StrReporter, StrCommand, Col).find(_.name == s).toRight(invalidType(s))
      case other => Left(invalidType(other.toString))
    }
  }

  implicit object tortoiseJs2Chooseable extends JsonReader[TortoiseJson, List[Chooseable]] {
    import org.nlogo.core.{ ChooseableDouble, ChooseableList, ChooseableBoolean, ChooseableString }
    def apply(t: TortoiseJson): Either[String, List[Chooseable]] = t match {
      case JsArray(els) => els.foldLeft(Right(List[Chooseable]()): Either[String, List[Chooseable]]) {
        case (either, e) => either.right.flatMap((l: List[Chooseable]) =>
            chooseableElement(e).right.map((newChooseable: Chooseable) => l :+ newChooseable))
      }
        case other        => Left(s"choices must be a list of chooseable values - found $other")
    }

    def chooseableElement(t: TortoiseJson): Either[String, Chooseable] = t match {
      case JsDouble(d)  => Right(ChooseableDouble(d))
      case JsString(s)  => Right(ChooseableString(s))
      case JsBool(b)    => Right(ChooseableBoolean(b))
      case JsArray(elems) =>
        def toLogoList(els: Seq[TortoiseJson]): Either[String, LogoList] =
          els.foldLeft(Right(LogoList.Empty): Either[String, LogoList]) {
            case (acc, el) => acc.right.flatMap(l =>
                el match {
                  case JsDouble(d) => Right(l.lput(d: java.lang.Double))
                  case JsInt(i)    => Right(l.lput(i: java.lang.Integer))
                  case JsBool(b)   => Right(l.lput(b: java.lang.Boolean))
                  case JsString(s) => Right(l.lput(s))
                  case JsArray(a)  =>
                    toLogoList(a).right.map(newList => l.lput(newList))
                  case x           => Left(s"could not convert $x to a chooseable value")
                })
          }
        toLogoList(elems).right.map(ChooseableList)
                  case other        => Left(s"Could not convert $other to a chooseable value")
    }
  }

  implicit object tortoiseJs2PenList extends JsonReader[TortoiseJson, List[Pen]] {
    private def penListError = Left(s"Must supply a list of pens")

    def apply(json: TortoiseJson): Either[String, List[Pen]] = json match {
      case JsArray(els) => els.foldLeft(Right(List()): Either[String, List[Pen]]) {
        case (acc, j@JsObject(_)) => acc.right.flatMap(l =>
            Jsonify.reader[JsObject, Pen](j).right.map(newElement => l :+ newElement))
        case (acc, other) => penListError
      }
        case other        => penListError
    }
  }
}
