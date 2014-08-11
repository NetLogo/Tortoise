package org.nlogo.tortoise

import
  org.nlogo.{ api, core, nvm },
    api.Program,
    core.Model,
    nvm.FrontEndInterface.ProceduresMap

trait CompilerLike {
  def compileReporter(logo: String, oldProcedures: ProceduresMap, program: Program): String
  def compileCommands(logo: String, oldProcedures: ProceduresMap, program: Program): String
  def compileProcedures(model: Model): (String, Program, ProceduresMap)
  def compileProcedures(code: String): (String, Program, ProceduresMap) =
    compileProcedures(Model(code))
}
