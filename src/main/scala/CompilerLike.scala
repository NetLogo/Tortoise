package org.nlogo.tortoise

import org.nlogo.api.Program
import org.nlogo.nvm.FrontEndInterface._
import org.nlogo.core.Model

trait CompilerLike {
  def compileReporter(logo: String,
                      oldProcedures: ProceduresMap = NoProcedures,
                      program: Program = Program.empty()): String

  def compileCommands(logo: String,
                      oldProcedures: ProceduresMap = NoProcedures,
                      program: Program = Program.empty()): String

  def compileProcedures(code: String): (String, Program, ProceduresMap) = compileProcedures(Model(code = code))

  def compileProcedures(model: Model) : (String, Program, ProceduresMap)
}
