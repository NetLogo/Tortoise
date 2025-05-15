// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  java.lang.{ Boolean => JBoolean, Double => JDouble, Integer => JInteger }

import
  org.nlogo.core.{ AgentKind, BoxedValue, Button, Chooseable, Chooser, Direction, Horizontal,
                   InputBox, LogoList, Monitor, NumericInput, Output, Pen,
                   Plot, Slider, StringInput, Switch,
                   TextBox, UpdateMode, Vertical, View, Widget, WorldDimensions },
    NumericInput.{ ColorLabel, NumberLabel },
    StringInput.{ CommandLabel, StringLabel, ReporterLabel }

import
  org.nlogo.tortoise.macros.json.Jsonify

import
  scalaz.{ Scalaz, Success, Validation, NonEmptyList, ValidationNel },
    Validation.FlatMap.ValidationFlatMapRequested,
    Scalaz.ToValidationOps

import
  TortoiseJson.{ JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

object WidgetRead {
  implicit object tortoiseJs2NilString extends JsonReader[TortoiseJson, String] {
    def apply(json: TortoiseJson): ValidationNel[String, String] = json match {
      case JsNull      => "NIL".successNel
      case JsString(s) => s.successNel
      case other       => s"could not convert ${other.getClass.getSimpleName} to String".failureNel
    }
  }

  implicit object tortoiseJs2UpdateMode extends JsonReader[TortoiseJson, UpdateMode] {
    def apply(t: TortoiseJson): ValidationNel[String, UpdateMode] = t match {
      case JsString(s) if s.toUpperCase == "CONTINUOUS" =>
        UpdateMode.Continuous.successNel
      case JsString(s) if s.toUpperCase == "TICKBASED"  =>
        UpdateMode.TickBased.successNel
      case other                                        =>
        s"View update mode can only be 'Continuous' or 'TickBased' but was $other".failureNel
    }
  }

  implicit object tortoiseJs2AgentKind extends JsonReader[TortoiseJson, AgentKind] {
    def apply(t: TortoiseJson): ValidationNel[String, AgentKind] = t match {
      case JsString(s) if s.toUpperCase == "OBSERVER"  =>
        AgentKind.Observer.successNel
      case JsString(s) if s.toUpperCase == "TURTLE"  =>
        AgentKind.Turtle.successNel
      case JsString(s) if s.toUpperCase == "PATCH"  =>
        AgentKind.Patch.successNel
      case JsString(s) if s.toUpperCase == "LINK"  =>
        AgentKind.Link.successNel
      case other                                        =>
        s"Agent kind can only be 'Observer', 'Turtle', 'Patch', or 'Link' but was $other".failureNel
    }
  }

  implicit object tortoiseJs2WorldDimensions extends JsonReader[TortoiseJson, WorldDimensions] {
    override def apply(t: TortoiseJson): ValidationNel[String, WorldDimensions] =
      Jsonify.reader[JsObject, WorldDimensions](t.asInstanceOf[JsObject])
  }

  implicit object tortoiseJs2OptionString extends JsonReader[TortoiseJson, Option[String]] {
    override def read(key: String, json: Option[TortoiseJson]): ValidationNel[String, Option[String]] =
      json.map( j =>
          apply(j).leftMap(value => NonEmptyList(s"$value is an invalid value for $key")))
            .getOrElse(None.successNel)

    def apply(t: TortoiseJson): ValidationNel[String, Option[String]] =
      t match {
        case JsNull          => None.successNel
        case JsString("NIL") => None.successNel
        case JsString(s)     => Some(s).successNel
        case other           => other.toString.failureNel
      }
  }

  implicit object tortoiseJs2OptionChar extends JsonReader[TortoiseJson, Option[Char]] {
    override def read(key: String, json: Option[TortoiseJson]): ValidationNel[String, Option[Char]] =
      json.map(j =>
          apply(j).leftMap(value => NonEmptyList(s"$value is an invalid value for $key")))
            .getOrElse(None.successNel)

    def apply(t: TortoiseJson): ValidationNel[String, Option[Char]] =
      t match {
        case JsNull                       => None.successNel
        case JsString("NIL")              => None.successNel
        case JsString(s) if s.length == 1 => Some(s.head).successNel
        case other                        => other.toString.failureNel
      }
  }
  implicit object tortoiseJs2OptionInt extends JsonReader[TortoiseJson, Option[Int]] {
    override def read(key: String, json: Option[TortoiseJson]): ValidationNel[String, Option[Int]] =
      json.map(j =>
          apply(j).leftMap(value => NonEmptyList(s"$value is an invalid value for $key")))
            .getOrElse(None.successNel)

    def apply(t: TortoiseJson): ValidationNel[String, Option[Int]] =
      t match {
        case JsNull          => None.successNel
        case JsString("NIL") => None.successNel
        case JsString(s)     => Some(s.toInt).successNel
        case other           => other.toString.failureNel
      }
  }

  implicit object tortoiseJs2Direction extends JsonReader[TortoiseJson, Direction] {
    def apply(t: TortoiseJson): ValidationNel[String, Direction] = t match {
      case JsString(s) if s.toUpperCase == "HORIZONTAL" =>
        Horizontal.successNel
      case JsString(s) if s.toUpperCase == "VERTICAL"   =>
        Vertical.successNel
      case other                                        =>
        s"Slider direction can only be 'Horizontal' or 'Vertical' but was $other".failureNel
    }
  }

  implicit object tortoiseJs2BoxedValue extends JsonReader[TortoiseJson, BoxedValue] {

    private val stringDisplayToLabelMap = Set(CommandLabel, ReporterLabel, StringLabel).map(x => x.display -> x).toMap

    // scalastyle:off cyclomatic.complexity
    def apply(t: TortoiseJson): ValidationNel[String, BoxedValue] = {
      t.asInstanceOf[JsObject].props.toSeq.sortBy(_._1) match {
        case Seq(("type", JsString(label)), ("value", JsInt(value))) if label == ColorLabel.display =>
          NumericInput(value, ColorLabel).successNel
        case Seq(("type", JsString(label)), ("value", JsDouble(value))) if label == ColorLabel.display =>
          NumericInput(value, ColorLabel).successNel
        case Seq(("type", JsString(label)), ("value", JsInt(value))) if label == NumberLabel.display =>
          NumericInput(value, NumberLabel).successNel
        case Seq(("type",  JsString(label)), ("value", JsDouble(value))) if label == NumberLabel.display =>
          NumericInput(value, NumberLabel).successNel
        case Seq(("multiline", JsBool(multiline)), ("type", JsString(label)), ("value", JsString(value))) =>
          StringInput(value, stringDisplayToLabelMap(label), multiline).successNel
        case other =>
          (s"Invalid input box: $other").failureNel
      }
    }
    // scalastyle:on cyclomatic.complexity

  }

  implicit object tortoiseJs2Chooseable extends JsonReader[TortoiseJson, List[Chooseable]] {
    import org.nlogo.core.{ ChooseableDouble, ChooseableList, ChooseableBoolean, ChooseableString }
    def apply(t: TortoiseJson): ValidationNel[String, List[Chooseable]] = t match {
      case JsArray(els) => (els map chooseableElement).foldLeft(List[Chooseable]().successNel[String]) {
        case (validList, c) => validList.flatMap(chooseables => c.map(chooseables :+ _))
      }
      case other        => s"choices must be a list of chooseable values - found $other".failureNel
    }

    def chooseableElement(t: TortoiseJson): ValidationNel[String, Chooseable] = t match {
      case JsDouble(d)    => ChooseableDouble(d).successNel
      case JsInt(i)       => ChooseableDouble(i.toDouble).successNel
      case JsString(s)    => ChooseableString(s).successNel
      case JsBool(b)      => ChooseableBoolean(b).successNel
      case JsArray(elems) => toLogoList(elems).map(ChooseableList.apply)
      case other          => s"Could not convert $other to a chooseable value".failureNel
    }

    private def toLogoList(els: Seq[TortoiseJson]): ValidationNel[String, LogoList] =
      els.foldLeft(LogoList.Empty.successNel[String]) {
        case (acc, el) => acc.flatMap(l =>
            el match {
              case JsDouble(d) => l.lput(d: JDouble).successNel
              case JsInt(i)    => l.lput(i: JInteger).successNel
              case JsBool(b)   => l.lput(b: JBoolean).successNel
              case JsString(s) => l.lput(s).successNel
              case JsArray(a)  => toLogoList(a).map(newList => l.lput(newList))
              case x           => s"could not convert $x to a chooseable value".failureNel
            })
      }
  }

  implicit object tortoiseJs2PenList extends JsonReader[TortoiseJson, List[Pen]] {
    private def penListError = s"Must supply a list of pens".failureNel

    def apply(json: TortoiseJson): ValidationNel[String, List[Pen]] = json match {
      case JsArray(els) => els.foldLeft(List[Pen]().successNel[String]) {
        case (acc, j@JsObject(_)) =>
          acc.flatMap(l => Jsonify.reader[JsObject, Pen](j).map(newPen => l :+ newPen))
        case (acc, other) => penListError
      }
      case other => penListError
    }
  }

  private val readerMap: Map[String, JsObject => ValidationNel[String, Widget]] = {
    Map(
      "button"   -> Jsonify.reader[JsObject, Button],
      "chooser"  -> Jsonify.reader[JsObject, Chooser],
      "inputBox" -> Jsonify.reader[JsObject, InputBox],
      "monitor"  -> Jsonify.reader[JsObject, Monitor],
      "output"   -> Jsonify.reader[JsObject, Output],
      "plot"     -> Jsonify.reader[JsObject, Plot],
      "slider"   -> Jsonify.reader[JsObject, Slider],
      "switch"   -> Jsonify.reader[JsObject, Switch],
      "textBox"  -> Jsonify.reader[JsObject, TextBox],
      "view"     -> Jsonify.reader[JsObject, View]
    )
  }

  def unapply(widgetType: String): Option[JsObject => ValidationNel[String, Widget]] =
    readerMap.get(widgetType)
}
