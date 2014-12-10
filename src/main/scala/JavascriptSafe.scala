// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

object JavascriptSafe {
  def apply(ident: String): String = {
    val camel = initialLower(ident.toLowerCase.split('-').map(_.capitalize).mkString)
    val charSafeIdent = CharReplacementList.foldLeft(camel) {
      case (s, (char, replacement)) => s.replaceAll(char, replacement)
    }
    val idSafeIdent = KeywordReplacementList.foldLeft(charSafeIdent) {
      case (s, kw) => s.replaceAll( s"""^$kw$$""", s"_${kw}_")
    }
    SpecialReplacementList.foldLeft(idSafeIdent) {
      case (s, pat) => pat.r.replaceAllIn(s, m => s"${m.group(1)}_${m.group(2)}")
    }
  }

  private def initialLower(s: String): String =
    java.lang.Character.toLowerCase(s.head) + s.tail

  val CharReplacementList: Map[String, String] = Map(
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

  val SpecialReplacementList: Seq[String] = Seq(
    """^(is)([A-Z].*)$""",
    """^(on)([a-z].*)$""",
    """^(screen)([A-Z].*)$""",
    """^(scroll)([A-Zb].*)$""",
    """^(webkit)([A-Z].*)$""",
    """^(moz)([A-Z].*)$""",
    """^(ms)([A-Z].*)$"""
  )

  val KeywordReplacementList: Seq[String] = Seq(
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
