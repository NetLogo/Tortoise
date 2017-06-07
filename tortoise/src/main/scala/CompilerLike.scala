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

  def compileRawCommands(logo: String, oldProcedures: ProceduresMap, program: Program)
    (implicit compilerFlags: CompilerFlags): String

  def compileProcedures(model: Model)
    (implicit compilerFlags: CompilerFlags): Compilation

  def compileProcedures(code: String)
    (implicit compilerFlags: CompilerFlags): Compilation = compileProcedures(Model(code))
}

object CompilerLike {
  case class Compilation(
    compiledProcedures:      Seq[(String, Seq[String])],
    widgets:                 Seq[CompiledWidget],
    interfaceGlobalCommands: Seq[ValidationNel[CompilerException, String]],
    model:                   Model,
    procedures:              ProceduresMap,
    program:                 Program
  )
}

import CompilerFlags.{ PropagationStyle, NoPropagation }

case class CompilerFlags(
  generateUnimplemented: Boolean,
  onTickCallback:        String          = "function(){}",
  propagationStyle:      PropagationStyle = NoPropagation,
  optimizationsEnabled:   Boolean         = true
  )

object CompilerFlags {
  implicit val Default = CompilerFlags(generateUnimplemented = false)

  sealed trait PropagationStyle
  // never propagate out stops from called procedures
  case object NoPropagation     extends PropagationStyle
  // propagate out stops from called procedures to the first level
  case object WidgetPropagation extends PropagationStyle
}

// this is incremented each time a block of statements is entered
case class CompilerContext(blockLevel: Int = 0, source: String = "") {
  def this(source: String) = this(0, source)
}
