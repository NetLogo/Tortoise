// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

trait CompiledProcedure {
  val code: String
  val name: String

  def format: String
}

case class CompiledCommand(val name: String, val code: String) extends CompiledProcedure {
  def format: String = s"""ProcedurePrims.defineCommand("$name", $code)"""
}

case class CompiledReporter(val name: String, val code: String) extends CompiledProcedure {
  def format: String = s"""ProcedurePrims.defineReporter("$name", $code)"""
}
