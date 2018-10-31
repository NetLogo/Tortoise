// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.core.Resource

object Polyfills {
  val content: String =
    try Resource.asString("/polyfills.js")
    catch { // In Galapagos (JVM compiler), we don't have the polyfills, and we don't really want them --JAB (10/31/18)
      case npe: NullPointerException => ""
    }
}
