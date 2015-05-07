// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

trait JsOps {
  // Intended to take in a NetLogo identifier (e.g. breed names, varnames, `turtles-own` varnames) and give back a
  // string for use in JavaScript.  We cannot simply wrap the string in single quotes, since single quotes are
  // actually valid characters in NetLogo identifiers!  --JAB (2/26/15)
  def jsString(ident: String): String =
    '"' + ident + '"'
}
