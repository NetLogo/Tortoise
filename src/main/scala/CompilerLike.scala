package org.nlogo.tortoise

import org.nlogo.api.{CompilerException, Program}
import org.nlogo.nvm.FrontEndInterface._
import org.nlogo.core.Model

trait CompilerLike {
  @throws[CompilerException]
  def compileReporter(logo: String,
                      oldProcedures: ProceduresMap = NoProcedures,
                      program: Program = Program.empty()): String

  @throws[CompilerException]
  def compileCommands(logo: String,
                      oldProcedures: ProceduresMap = NoProcedures,
                      program: Program = Program.empty()): String

  @throws[CompilerException]
  def compileProcedures(code: String): (String, Program, ProceduresMap) = compileProcedures(Model(code = code))

  @throws[CompilerException]
  def compileProcedures(model: Model) : (String, Program, ProceduresMap)
}
