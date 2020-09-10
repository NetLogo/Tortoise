// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{ FrontEndInterface, Model, Program },
    FrontEndInterface.ProceduresMap

trait CompilerLike {

  def toJS(result:           Compilation)
    (implicit compilerFlags: CompilerFlags): String

  def compileReporter(logo: String, oldProcedures: ProceduresMap, program: Program)
    (implicit compilerFlags: CompilerFlags): String

  def compileCommands(logo: String, oldProcedures: ProceduresMap, program: Program)
    (implicit compilerFlags: CompilerFlags): String

  def compileRawCommands(logo: String, oldProcedures: ProceduresMap, program: Program)
    (implicit compilerFlags: CompilerFlags): String

  def compileProceduresIncremental(logo: String, oldProcedures: ProceduresMap, program: Program, overriding: Seq[String])
    (implicit compilerFlags: CompilerFlags): String

  def compileProcedures(model: Model)
    (implicit compilerFlags: CompilerFlags): Compilation

  def compileProcedures(code: String)
    (implicit compilerFlags: CompilerFlags): Compilation = compileProcedures(Model(code))

}
