// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.core.SourceLocation

trait CompiledProcedure {
  val code: String
  val name: String

  def format: String
}

case class CompiledCommand(val name: String, location: SourceLocation, val code: String) extends CompiledProcedure {
  def format: String = s"""ProcedurePrims.defineCommand("$name", ${location.start}, ${location.end}, $code)"""
}

case class CompiledReporter(val name: String, location: SourceLocation, val code: String) extends CompiledProcedure {
  def format: String = s"""ProcedurePrims.defineReporter("$name", ${location.start}, ${location.end}, $code)"""
}
