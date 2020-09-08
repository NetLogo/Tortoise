// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

// this is incremented each time a block of statements is entered
case class CompilerContext(blockLevel: Int = 0, source: String = "") {
  def this(source: String) = this(0, source)
}
