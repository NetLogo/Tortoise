// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  scala.{ annotation, scalajs },
    annotation.meta.field,
    scalajs.js.annotation.{ JSExport, JSExportTopLevel }

import
  org.nlogo.{ core, parse },
    core.{ LiteralParser, LogoList, Nobody => NlogoNobody },
    parse.CompilerUtilities

@JSExportTopLevel("Converter")
object LiteralConverter {

  class WrappedException(@(JSExport @field) val message: String) extends Throwable

  @JSExport
  def nlStrToJS(string: String): AnyRef = {
    nlToJS(StandardLiteralParser.readFromString(string))
  }

  private def nlToJS(value: => AnyRef): AnyRef = {

    import scala.scalajs.js.JSConverters.genTravConvertible2JSRichGenTrav

    def nlValueToJSValue: PartialFunction[AnyRef, AnyRef] = {
      case l: LogoList => l.toList.map(nlValueToJSValue).toJSArray
      case NlogoNobody => Nobody
      case x           => x
    }

    try nlValueToJSValue(value)
    catch {
      case ex: Exception => throw new WrappedException(ex.getMessage)
    }

  }

}

object StandardLiteralParser extends LiteralParser {

  override def readFromString(string: String): AnyRef =
    CompilerUtilities.readFromString(string)

  override def readNumberFromString(string: String): AnyRef =
    CompilerUtilities.readNumberFromString(string)

}
