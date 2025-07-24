// This file is related to the NetLogo Web (NLW) project
// Please see org:NetLogo/Galapagos/app/assets/javascript/beak/nlw-extensions-loader.js
// for more details. This change was introduced in https://github.com/NetLogo/NetLogo/pull/2508
// Omar Ibrahim, 2025
package org.nlogo.tortoise.compiler

import scala.scalajs.js
import scala.scalajs.js.annotation.JSGlobal
import play.api.libs.json.{  JsValue, Json }

// window.NLWExtensionsLoader is a global object and is
// gauranteed to be available before 
@js.native
@JSGlobal("NLWExtensionsLoader")
object JSNLWExtensionsLoader extends js.Object {
  def getPrimitivesFromURL(url: String): js.UndefOr[js.Object] = js.native
  def appendURLProtocol(url: String): String = js.native
}

object NLWExtensionsLoader {
  def getPrimitivesFromURL(url: String): Option[JsValue] = {
    val result = JSNLWExtensionsLoader.getPrimitivesFromURL(url)
    if (result == null || result == js.undefined) {
      None
    } else {
      val json = Json.parse(js.JSON.stringify(result))
      Some(json)
    }
  }

  def appendURLProtocol(url: String): String = {
    JSNLWExtensionsLoader.appendURLProtocol(url)
  }
}