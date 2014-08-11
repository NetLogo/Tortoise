package org.nlogo.tortoise

import org.nlogo.api.Program
import org.nlogo.nvm.FrontEndInterface._
import org.nlogo.core.Model

trait CompilerLike {
  def compileReporter(logo: String, oldProcedures: ProceduresMap, program: Program): String
  def compileCommands(logo: String, oldProcedures: ProceduresMap, program: Program): String
  def compileProcedures(model: Model): (String, Program, ProceduresMap)
  def compileProcedures(code: String): (String, Program, ProceduresMap) =
    compileProcedures(Model(code))
}
