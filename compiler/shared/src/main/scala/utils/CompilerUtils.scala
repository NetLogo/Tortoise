// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.utils

import org.nlogo.core.{ CompilerException, Token }

object CompilerErrors {
  def failCompilation(msg: String): Nothing =
    failCompilation(msg, Token.Eof.start, Token.Eof.end, Token.Eof.filename)

  def failCompilation(msg: String, token: Token): Nothing =
    failCompilation(msg, token.start, token.end, token.filename)

  def failCompilation(msg: String, start: Int, end: Int, filename: String): Nothing =
    throw new CompilerException(msg, start, end, filename)
}
