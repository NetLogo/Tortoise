// This file is related to the NetLogo Web (NLW) project
// Please see org:NetLogo/Galapagos/app/assets/javascript/beak/nlw-extensions-loader.js
// for more details. This change was introduced in https://github.com/NetLogo/NetLogo/pull/2508
// This is not supported in the JVM compiler.
// Omar Ibrahim, 2025
package org.nlogo.tortoise.compiler
import scala.annotation.unused

import play.api.libs.json.JsValue


object WrappedNLWExtensionsLoader {
  def getPrimitivesFromURL(url: String): Option[JsValue] = {
    throw new UnsupportedOperationException("WrappedNLWExtensionsLoader is not implemented in the JVM environment.")
  }
}
