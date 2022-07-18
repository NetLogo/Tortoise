// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.core.Token

case class SourceInformation(token: Token) {

  def start: String =
    Option(token).flatMap( (t) => Option(t.sourceLocation) ).map(_.start.toString).getOrElse("null")

  def end: String =
    Option(token).flatMap( (t) => Option(t.sourceLocation) ).map(_.end.toString).getOrElse("null")

}
