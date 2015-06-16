// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.core.{ CompilerException, FrontEndInterface, Model, ProcedureDefinition, Program },
    FrontEndInterface.ProceduresMap

import
  scalaz.ValidationNel

trait CompilerLike {
  import CompilerLike.Compilation

  def toJS(result:           Compilation)
    (implicit compilerFlags: CompilerFlags): String

  def compileReporter(logo: String, oldProcedures: ProceduresMap, program: Program)
    (implicit compilerFlags: CompilerFlags): String

  def compileCommands(logo: String, oldProcedures: ProceduresMap, program: Program)
    (implicit compilerFlags: CompilerFlags): String

  def compileProcedures(model: Model)
    (implicit compilerFlags: CompilerFlags): Compilation

  def compileProcedures(code: String)
    (implicit compilerFlags: CompilerFlags): Compilation = compileProcedures(Model(code))
}

object CompilerLike {
  case class Compilation(
    compiledProcedures:      Seq[(String, Map[String, String])],
    widgets:                 Seq[CompiledWidget],
    interfaceGlobalCommands: Seq[ValidationNel[CompilerException, String]],
    model:                   Model,
    procedures:              ProceduresMap,
    program:                 Program
  )
}

case class CompilerFlags(
  generateUnimplemented: Boolean,
  onTickCallback: String = "function(){}")

object CompilerFlags {
  implicit val Default = CompilerFlags(generateUnimplemented = false)
}
