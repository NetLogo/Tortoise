// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

object JSIdentProvider {

  def apply(ident: String): String = {
    // NetLogo identifiers are *almost* a superset of JavaScript's, which makes it very hard to avoid
    // collisions in the JS-valid names.  But thankfully NetLogo's identifiers are case insensitive.
    // So it's easiest to ensure unique, safe, JS identifiers by making the NetLogo versions lower case,
    // then munging with upper-case characters to differentiate them.  -Jeremy B March 2021
    val lowerCase = (s: String) => s.toLowerCase
    (lowerCase andThen sanitizeInvalidChars andThen sanitizeKeywords andThen sanitizePrefixes)(ident)
  }

  private def sanitizeInvalidChars(ident: String): String =
    InvalidCharToValid.foldLeft(ident) { case (id, (char, replacement)) => id.replaceAll(char, replacement) }

  private def sanitizeKeywords(ident: String): String =
    Keywords.foldLeft(ident) { case (id, kw) => if (id != kw) id else s"_${id.toUpperCase}_" }

  private def sanitizePrefixes(ident: String): String =
    RiskyPrefixes.foldLeft(ident) { case (s, pat) => pat.r.replaceAllIn(s, m => s"${m.group(1).toUpperCase}_${m.group(2)}") }

  private val InvalidCharToValid = Map(
    "-" -> "H",
    "!" -> "_EXC_",
    "#" -> "_POU_",
    "\\$" -> "_DOL_",
    "%" -> "_PER_",
    "\\^" -> "_CAR_",
    "\\&" -> "_AMP_",
    "\\*" -> "_AST_",
    "<" -> "_LT_",
    ">" -> "_GT_",
    "/" -> "_SL_",
    "\\." -> "_DOT_",
    "\\?" -> "_Q",
    "=" -> "_EQ",
    "\\+" -> "_PLU_",
    ":" -> "_COL_",
    "'" -> "_PRI_"
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
    "world",
    "yield"
  )

}
