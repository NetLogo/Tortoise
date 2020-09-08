// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import CompiledModel.CompileResult

import scalaz.{ ValidationNel, Scalaz },
  Scalaz.ToValidationOps

case class ModelCompilation(
  model: ValidationNel[TortoiseFailure, CompiledModel],
  code: String,
  info: String,
  widgets: Seq[CompiledWidget],
  commands: Seq[CompileResult[String]] = Seq(),
  reporters: Seq[CompileResult[String]] = Seq())

object ModelCompilation {
  def fromCompiledModel(compiledModel: CompiledModel): ModelCompilation =
    ModelCompilation(
      compiledModel.successNel,
      compiledModel.model.code,
      compiledModel.model.info,
      compiledModel.widgets)
}
