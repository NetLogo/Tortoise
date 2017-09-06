// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  JsonWriter.ListConversion

import
  org.nlogo.core.{ AgentKind, BoxedValue, Chooseable, ChooseableBoolean, ChooseableDouble,
                   ChooseableList, ChooseableString, Direction, NumericInput, Pen, StringInput,
                   UpdateMode, WorldDimensions },
    NumericInput.{ ColorLabel, NumberLabel }

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

object WidgetWrite {

  implicit object direction2Json extends JsonWriter[Direction] {
    def apply(d: Direction): TortoiseJson = JsString(d.toString.toLowerCase)
  }

  implicit object updateMode2Json extends JsonWriter[UpdateMode] {
    def apply(um: UpdateMode): TortoiseJson = JsString(um.toString)
  }

  implicit object agentKind2Json extends JsonWriter[AgentKind] {
    def apply(ak: AgentKind): TortoiseJson = JsString(ak.toString)
  }

  implicit object string2NillableTortoiseJs extends JsonWriter[String] {
    def apply(s: String): TortoiseJson = if (s == "NIL") JsNull else JsString(s)
  }

  implicit object boxedValue2Json extends JsonWriter[BoxedValue] {
    def apply(bv: BoxedValue): TortoiseJson =
      bv match {
        case NumericInput(value, label: ColorLabel.type) =>
          JsObject(fields("value" -> JsInt(value.toInt), "type" -> JsString(label.display)))
        case NumericInput(value, label: NumberLabel.type) =>
          JsObject(fields("value" -> JsDouble(value),    "type" -> JsString(label.display)))
        case StringInput (value, label, isMultiline) =>
          JsObject(fields("value" -> JsString(value),    "type" -> JsString(label.display)
                        , "multiline" -> JsBool(isMultiline)))
      }
  }

  implicit object pen2Json extends JsonWriter[Pen] {
    def apply(p: Pen): TortoiseJson = Jsonify.writer[Pen, TortoiseJson](p)
  }

  implicit object dims2Json extends JsonWriter[WorldDimensions] {
    def apply(wd: WorldDimensions): TortoiseJson = {
      val JsObject(props) = Jsonify.writer[WorldDimensions, TortoiseJson](wd)
      val pairsWithoutTypeField = props.filterKeys(_ != "type").toSeq
      JsObject(fields(pairsWithoutTypeField: _*))
    }
  }

  implicit object charOption2Json extends OptionWriter[Char] {
    // in general, get is not safe, but we're checking it in write
    def apply(s: Option[Char]): TortoiseJson = JsString(s.get.toString)
  }

  implicit object stringOption2Json extends OptionWriter[String] {
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

  trait OptionWriter[T] extends JsonWriter[Option[T]] {
    override def write(s: Option[T]): Option[TortoiseJson] =
      s.map(v => apply(Some(v)))
  }

}
