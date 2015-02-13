// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.core.{ FrontEndInterface, Model, Program },
    FrontEndInterface.ProceduresMap

trait CompilerLike {
  def compileReporter(logo: String, oldProcedures: ProceduresMap, program: Program)
    (implicit compilerFlags: CompilerFlags): String

  def compileCommands(logo: String, oldProcedures: ProceduresMap, program: Program)
    (implicit compilerFlags: CompilerFlags): String

  def compileProcedures(model: Model)
    (implicit compilerFlags: CompilerFlags): (String, Program, ProceduresMap)

  def compileProcedures(code: String)
    (implicit compilerFlags: CompilerFlags): (String, Program, ProceduresMap) = compileProcedures(Model(code))
}

case class CompilerFlags(generateUnimplemented: Boolean)

object CompilerFlags {
  implicit val Default = CompilerFlags(generateUnimplemented = false)
}
