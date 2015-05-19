// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

object JsOps {
  // Intended to take in a NetLogo identifier (e.g. breed names, varnames, `turtles-own` varnames) and give back a
  // string for use in JavaScript.  We cannot simply wrap the string in single quotes, since single quotes are
  // actually valid characters in NetLogo identifiers!  --JAB (2/26/15)
  def jsString(ident: String): String =
    '"' + ident + '"'

  def sanitizeNil(s: String): String =
    if (s != "NIL") s.replaceAllLiterally("'", "\\'") else ""

  def jsArrayString(arrayValues: Iterable[String], separator: String=" "): String =
    if (arrayValues.nonEmpty)
      arrayValues.mkString("[", s",$separator", "]")
    else
      "[]"

  def jsFunction(args: Seq[String] = Seq(), body: String = ""): String = {
    val jsArgs = args.mkString("(", ", ", ")")
    if (body.length == 0)
      s"function$jsArgs {}"
    else if (body.lines.length < 2 && body.length < 100)
      s"function$jsArgs { $body }"
    else
      s"""|function$jsArgs {
          |${indented(body)}
          |}""".stripMargin
  }

  def thunkifyProcedure(str: String): String =
    if (str.nonEmpty) jsFunction(body = s"$str;") else jsFunction()

  def thunkifyFunction(str: String): String =
    if (str.nonEmpty) jsFunction(body = s"return $str;") else jsFunction()

  def indented(s: String): String =
    s.lines.map("  " + _).mkString("\n")
}
