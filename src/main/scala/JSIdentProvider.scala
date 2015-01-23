// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

object JSIdentProvider {

  def apply(ident: String): String =
    (performCamelCasing _ andThen sanitizeInvalidChars andThen sanitizeKeywords andThen sanitizePrefixes)(ident)

  private def performCamelCasing(ident: String): String = {
    val performTitleCasing = (s: String) => s.toLowerCase.split('-').map(_.capitalize).mkString
    val lowercaseFirstChar = (s: String) => s.head.toLower + s.tail
    (performTitleCasing andThen lowercaseFirstChar)(ident)
  }

  private def sanitizeInvalidChars(ident: String): String =
    InvalidCharToValid.foldLeft(ident) { case (id, (char, replacement)) => id.replaceAll(char, replacement) }

  private def sanitizeKeywords(ident: String): String =
    Keywords.foldLeft(ident) { case (id, kw) => if (id != kw) id else s"_${id}_" }


  private def sanitizePrefixes(ident: String): String =
    RiskyPrefixes.foldLeft(ident) { case (s, pat) => pat.r.replaceAllIn(s, m => s"${m.group(1)}_${m.group(2)}") }

  private val InvalidCharToValid = Map(
    "!" -> "_exclamation_",
    "#" -> "_pound_",
    "\\$" -> "_dollar_",
    "%" -> "_percent_",
    "\\^" -> "_caret_",
    "\\&" -> "_ampersand_",
    "\\*" -> "_asterisk_",
    "<" -> "_lessthan_",
    ">" -> "_greaterthan_",
    "/" -> "_slash_",
    "\\." -> "_dot_",
    "\\?" -> "_p",
    "=" -> "_eq",
    "\\+" -> "_plus_",
    ":" -> "_colon_",
    "'" -> "_prime_"
  )

  private val RiskyPrefixes = Seq(
    """^(is)([A-Z].*)$""",
    """^(on)([a-z].*)$""",
    """^(screen)([A-Z].*)$""",
    """^(scroll)([A-Zb].*)$""",
    """^(webkit)([A-Z].*)$""",
    """^(moz)([A-Z].*)$""",
    """^(ms)([A-Z].*)$"""
  )

  private val Keywords = Seq(
    "alert",
    "atob",
    "break",
    "blur",
    "btoa",
    "case",
    "catch",
    "class",
    "clear",
    "close",
    "closed",
    "console",
    "content",
    "copy",
    "const",
    "confirm",
    "console",
    "constructor",
    "continue",
    "crypto",
    "debugger",
    "default",
    "delete",
    "do",
    "document",
    "dump",
    "else",
    "enum",
    "escape",
    "eval",
    "event",
    "export",
    "extends",
    "external",
    "false",
    "finally",
    "find",
    "focus",
    "for",
    "frames",
    "function",
    "history",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "inspect",
    "interface",
    "keys",
    "length",
    "let",
    "location",
    "localStorage",
    "monitor",
    "moveBy",
    "moveTo",
    "name",
    "navigator",
    "new",
    "null",
    "open",
    "opener",
    "package",
    "parent",
    "parseFloat",
    "parseInt",
    "performance",
    "print",
    "private",
    "profile",
    "profileEnd",
    "prompt",
    "protected",
    "public",
    "return",
    "screen",
    "scroll",
    "setInterval",
    "setTimeout",
    "static",
    "status",
    "statusbar",
    "stop",
    "super",
    "switch",
    "table",
    "this",
    "throw",
    "toolbar",
    "toString",
    "top",
    "true",
    "try",
    "typeof",
    "updateCommands",
    "undefined",
    "unescape",
    "uneval",
    "unmonitor",
    "unwatch",
    "valueOf",
    "values",
    "var",
    "void",
    "while",
    "window",
    "with",
    "yield"
  )

}
