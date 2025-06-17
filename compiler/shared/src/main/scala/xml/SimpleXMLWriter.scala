// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.xml

import org.nlogo.core.model.{ NLogoXMLWriter, XMLElement }

class SimpleXmlWriter extends NLogoXMLWriter {
  private val builder = new StringBuilder()
  private var indent = 0
  private var waitingForAttributes = false
  private var lastStarted = ""

  private def push(): Unit = {
    indent = indent + 1
  }

  private def pop(): Unit = {
    indent = indent - 1
  }

  def margin: String = List.fill(indent)("  ").mkString

  def linebreak(): Unit = {
    builder.append("\n")
  }

  def startDocument(): Unit = {
    builder.append("""<? version="1.0" encoding="utf-8" ?>""")
  }

  def endDocument(): Unit = {
    linebreak()
  }

  def startElement(e: String): Unit = {
    maybeCloseAttributes()
    linebreak()
    builder.append(s"$margin<$e")
    waitingForAttributes = true
    lastStarted = e
    push()
  }

  private def maybeCloseAttributes(): Unit = {
    if (waitingForAttributes) {
      builder.append(">")
      waitingForAttributes = false
    }
  }

  def endElement(e: String): Unit = {
    maybeCloseAttributes()
    if (lastStarted != e) { linebreak() }
    builder.append(s"</$e>")
    pop()
  }

  def attribute(name: String, value: String): Unit = {
    builder.append(s" $name=\"$value\"")
  }

  def escapedText(text: String): Unit = {
    maybeCloseAttributes()
    if (text.contains('<') || text.contains('>') || text.contains('&'))
      val cdataText = "]]>".r.replaceAllIn(text, s"]]${XMLElement.CDataEscape}>")
      builder.append(s"<![CDATA[$cdataText]]>")
    else
      builder.append(text)
  }

  def element(el: XMLElement): Unit = {
    startElement(el.name)

    el.attributes.foreach( (key, value) => attribute(key, value) )

    if (el.text.isEmpty)
      el.children.foreach(element)
    else
      escapedText(el.text)

    endElement(el.name)
  }

  def close(): Unit = {}

  override def toString(): String = {
    builder.toString
  }
}
