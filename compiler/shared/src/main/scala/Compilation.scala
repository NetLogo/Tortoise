// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{ CompilerException, FrontEndInterface, Model, Program },
    FrontEndInterface.ProceduresMap

import
  scalaz.ValidationNel

case class Compilation(
  compiledProcedures:      Seq[CompiledProcedure],
  widgets:                 Seq[CompiledWidget],
  interfaceGlobalCommands: Seq[ValidationNel[CompilerException, String]],
  model:                   Model,
  procedures:              ProceduresMap,
  program:                 Program
)
