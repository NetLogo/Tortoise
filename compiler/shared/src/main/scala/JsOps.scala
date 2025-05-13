// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

// All of these type casts to `StringOps` are a workaround for dealing with
// this: https://github.com/scala/bug/issues/11125
// --JAB (4/10/20)
import scala.collection.immutable.StringOps

object JsOps {
  // Intended to take in a NetLogo identifier (e.g. breed names, varnames, `turtles-own` varnames) and give back a
  // string for use in JavaScript.  We cannot simply wrap the string in single quotes, since single quotes are
  // actually valid characters in NetLogo identifiers!  --JAB (2/26/15)
  def jsString(ident: String): String =
    s""""$ident""""

  def jsReplace(ident: String): String =
    ident.replace("\\", "\\\\").replace("\n", "\\n").replace("\"", "\\\"").replace("'", "\\'")

  def jsStringEscaped(ident: String): String = {
    jsString(jsReplace(ident))
  }

  def sanitizeNil(s: String): String =
    if (s != "NIL") s.replace("'", "\\'") else ""

  def jsArrayString(arrayValues: Iterable[String], separator: String=" "): String =
    if (arrayValues.nonEmpty)
      arrayValues.mkString("[", s",$separator", "]")
    else
      "[]"

  def jsFunction(args: Seq[String] = Seq(), body: String = ""): String = {
    val jsArgs = args.mkString("(", ", ", ")")
    if (body.length == 0)
      s"function$jsArgs {}"
    else if ((body: StringOps).linesIterator.length < 2 && body.length < 100)
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
    (s: StringOps).linesIterator.map("  " + _).mkString("\n")
}
