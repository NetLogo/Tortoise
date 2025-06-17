// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.xml

import org.nlogo.core.model.XMLElement

import scala.{ Option, None, Some }

object SimpleXMLParser {
  val CDATA_START = "<![CDATA["
  val CDATA_END   = "]]>"
}

// Hopefully this is straightforward.  The idea is a super-simple XML parser suited to just NetLogo's file format.  The
// `TextCursor` helper class has whatever convenience methods make implementing the parser as easy as possible.  We try
// to have a single-pass parse as a very basic state machine with the minimum amount of generated string instances, only
// copying them once necessary.  -Jeremy B June 2025

class SimpleXMLParser(text: String) {

  val reader = new TextCursor(text)

  def parse(): Seq[XMLElement] = {
    var elements = Seq[XMLElement]()
    reader.skipWhiteSpace()
    while (reader.hasMore()) {
      reader.matches("<?", "<") match {
        case Some("<?") =>
          parseStartingElement()

        case Some("<")  =>
          val newElements = parseElements()
          elements = elements :++ newElements

        case _ =>
          throw new Exception("PARSING ERROR: Malformed XML file; expected a header or root element.")
      }
      reader.skipWhiteSpace()
    }

    elements
  }

  def parseAttribute(): (String, String) = {
    val nameStart = reader.getCurrentIndex
    reader.skipUntil('=')
    val nameEnd = reader.getCurrentIndex
    reader.munch('=')
    reader.munch('"')
    val valStart = reader.getCurrentIndex
    reader.skipUntil('"')
    val valEnd = reader.getCurrentIndex
    reader.next()
    (reader.substring(nameStart, nameEnd), reader.substring(valStart, valEnd))
  }

  def parseAttributes(): (String, Map[String, String]) = {
    var attributes = Map[String, String]()
    reader.skipWhiteSpace()
    var terminator = reader.matches("/>", ">")
    while (reader.hasMore() && !terminator.isDefined) {
      val a = parseAttribute()
      attributes = attributes + (a._1 -> a._2)
      reader.skipWhiteSpace()
      terminator = reader.matches("/>", ">")
    }
    (terminator.getOrElse(throw new Exception("PARSING ERROR: Was not able to find a proper terminator for an element opening.")), attributes)
  }

  def parseCdata(): String = {
    reader.munch(SimpleXMLParser.CDATA_START)
    val start = reader.getCurrentIndex
    reader.skipUntil(SimpleXMLParser.CDATA_END)
    val end = reader.getCurrentIndex
    reader.munch(SimpleXMLParser.CDATA_END)
    val result = reader.substring(start, end)
    result
  }

  def parseElementClose(name: String): Unit = {
    reader.munch("</")
    reader.skipWhiteSpace()
    reader.munch(name)
    reader.skipWhiteSpace()
    reader.munch(">")
  }

  def parseText(): String = {
    val start = reader.getCurrentIndex
    reader.skipUntil("</")
    val end = reader.getCurrentIndex
    reader.substring(start, end)
  }

  def parseElementContent(): (String, Seq[XMLElement]) = {
    reader.skipWhiteSpace()

    reader.matches(SimpleXMLParser.CDATA_START, "<") match {
      case Some(SimpleXMLParser.CDATA_START) =>
        (parseCdata(), Seq())

      case Some("<") =>
        val elements = parseElements()
        reader.skipWhiteSpace()
        ("", elements)

      case _ =>
        val text = parseText()
        (text, Seq())
    }
  }

  def parseElement(): Option[XMLElement] = {
    if (reader.matches("<!--")) {
      parseComment()
      None
    } else {
      reader.munch('<')
      val start      = reader.getCurrentIndex
      val terminator = reader.skipUntil("white-space", "/>", ">")
      val end        = reader.getCurrentIndex
      val name       = reader.substring(start, end)

      val (elementTerminator, attributes) =
        if (terminator != "white-space") { (terminator, Map[String, String]()) } else { parseAttributes() }

      reader.munch(elementTerminator)

      val (text, children) =
        if (elementTerminator == "/>") {
          ("", Seq())
        } else {
          val content = parseElementContent()
          parseElementClose(name)
          content
        }

      Some(new XMLElement(name, attributes, text, children))
    }
  }

  def parseElements(): Seq[XMLElement] = {
    var elements = Seq[Option[XMLElement]]()
    while (reader.hasMore() && !reader.matches("</")) {
      val element = parseElement()
      elements = elements :+ element
      reader.skipWhiteSpace()
    }
    elements.flatMap( (e) => e )
  }

  def parseStartingElement(): Unit = {
    reader.skipUntil("?>")
    reader.munch("?>")
  }

  def parseComment(): Unit = {
    reader.skipUntil("-->")
    reader.munch("-->")
  }
}

object TextCursor {
  val WHITE_SPACE_CHARS = Seq(' ', '\t', '\n', '\r')

  val WHITE_SPACE_CHECK = (r: TextCursor) => r.isWhiteSpace()

  private val BUILT_IN_CHECKS = Map[String, (TextCursor) => Boolean](
    ("white-space" -> WHITE_SPACE_CHECK)
  )
}

class TextCursor(text: String) {
  var currentIndex = 0

  def getCurrentIndex: Int = currentIndex

  def currentChar(): Char = {
    text.charAt(currentIndex)
  }

  def hasMore(): Boolean = {
    (currentIndex < text.length)
  }

  def generateException(msg: String): Exception = {
    new Exception(s"PARSING ERROR: $msg")
  }

  def munch(c: Char): Unit = {
    if (!matches(c)) {
      val exception = if (hasMore()) { s"found character '${currentChar()}'" } else { "was at end of the content" }
      throw generateException(s"Expected to munch a character '$c' but $exception.")
    }
    next(1)
  }

  def munch(s: String): Unit = {
    if (!matches(s)) {
      val start = currentChar()
      val end   = Math.min(start + s.length, text.length)
      val exception = if (hasMore()) { s"found string '${substring(start, end)}'" } else { "was at end of the content" }
      throw generateException(s"Expected to munch a string '$s' but $exception.")
    }
    next(s.length)
  }

  def next(i: Int = 1): Unit = {
    currentIndex = currentIndex + i
  }

  def skipUntil(check: Char): Unit = {
    while (hasMore() && !matches(check)) {
      next()
    }
    if (!matches(check)) {
      throw generateException(s"Expected to skip until a character '$check' but reached end of the content.")
    }
  }

  def skipUntil(check: String): Unit = {
    while (hasMore() && !matches(check)) {
      next()
    }
    if (!matches(check)) {
      throw generateException(s"Expected to skip until a string '$check' but reached end of the content.")
    }
  }

  // scalastyle:off return
  def skipUntil(checks: String*): String = {
    val realChecks = checks.map( (c) => (c, TextCursor.BUILT_IN_CHECKS.getOrElse(c, (r) => r.matches(c) )) )
    while (hasMore()) {
      val found = realChecks.find( (c) => c._2(this) )
      if (found.isDefined) {
        return found.get._1
      }
      next()
    }
      throw generateException(s"Expected to skip until one of the strings ${checks.mkString("('", "', '", "')")} but reached end of the content.")
  }
  // scalastyle:on return

  def substring(start: Int, end: Int): String = {
    text.substring(start, end)
  }

  def isWhiteSpace(): Boolean = {
    TextCursor.WHITE_SPACE_CHARS.contains(currentChar())
  }

  def skipWhiteSpace(): Unit = {
    while (hasMore() && isWhiteSpace()) {
      next()
    }
  }

  def matches(c: Char): Boolean = {
    (currentIndex < text.length && c == text.charAt(currentIndex))
  }

  // scalastyle:off return
  def matches(m: String): Boolean = {
    if (currentIndex + m.length > text.length) {
      return false
    }
    var i = 0
    while (i < m.length) {
      val peekIndex = currentIndex + i
      if (!peekMatches(m.charAt(i), peekIndex)) {
        return false
      }
      i = i + 1
    }
    true
  }

  def matches(checks: String*): Option[String] = {
    checks.find( (m) => matches(m) ).map( (m) => Some(m) ).getOrElse(None)
  }

  private def peekMatches(c: Char, peekIndex: Int): Boolean = {
    (c == text.charAt(peekIndex))
  }
}
