// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import collection.immutable.ListMap

sealed trait TortoiseJson {
  override def toString: String = JsonLibrary.nativeToString(JsonLibrary.toNative(this))
}

object TortoiseJson {

  case object JsNull                                         extends TortoiseJson
  case class  JsInt   (i: Int)                               extends TortoiseJson
  case class  JsDouble(d: Double)                            extends TortoiseJson
  case class  JsString(s: String)                            extends TortoiseJson
  case class  JsBool  (b: Boolean)                           extends TortoiseJson
  case class  JsArray (elems: Seq[TortoiseJson])             extends TortoiseJson
  case class  JsObject(props: ListMap[String, TortoiseJson]) extends TortoiseJson

  def fields(pairs: (String, TortoiseJson)*): ListMap[String, TortoiseJson] =
    ListMap(pairs: _*)

}
