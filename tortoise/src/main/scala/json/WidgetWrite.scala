// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  JsonWriter.ListConversion

import
  org.nlogo.core.{ Chooseable, ChooseableBoolean, ChooseableDouble,
    ChooseableList, ChooseableString, Direction, Pen, UpdateMode }

import
  TortoiseJson.{ JsArray, JsBool, JsDouble, JsNull, JsString}

object WidgetWrite {
  implicit object direction2Json extends JsonWriter[Direction] {
    def apply(d: Direction): TortoiseJson = JsString(d.toString.toLowerCase)
  }

  implicit object updateMode2Json extends JsonWriter[UpdateMode] {
    def apply(um: UpdateMode): TortoiseJson = JsString(um.toString)
  }

  implicit object string2NillableTortoiseJs extends JsonWriter[String] {
    def apply(s: String): TortoiseJson = if (s == "NIL") JsNull else JsString(s)
  }

  implicit object pen2Json extends JsonWriter[Pen] {
    def apply(p: Pen): TortoiseJson = Jsonify.writer[Pen, TortoiseJson](p)
  }

  implicit object stringOption2Json extends JsonWriter[Option[String]] {
    override def write(s: Option[String]): Option[TortoiseJson] =
      s.map(v => apply(Some(v)))

    // in general, get is not safe, but we're checking it in write
    def apply(s: Option[String]): TortoiseJson = JsString(s.get)
  }

  implicit object chooseable2Json extends JsonWriter[Chooseable] {
    def apply(c: Chooseable): TortoiseJson =
      c match {
        case ChooseableDouble(d)  => JsDouble(d.doubleValue)
        case ChooseableString(s)  => JsString(s)
        case ChooseableBoolean(b) => JsBool(b)
        case ChooseableList(l)    => JsArray(l.map(v => chooseable2Json(Chooseable(v))).toList)
      }
  }

  implicit object pens2TortoiseJs extends ListConversion[Pen]
  implicit object chooseables2TortoiseJs extends ListConversion[Chooseable]
}
