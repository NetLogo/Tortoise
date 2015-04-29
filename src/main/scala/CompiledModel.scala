// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.{ agent, api, core, parse },
    core.{ model, AgentKind, CompilerException, FrontEndInterface, Model, Program, View, LiteralParser },
      model.ModelReader,
      AgentKind._,
      FrontEndInterface.{ ProceduresMap, NoProcedures },
    parse.CompilerUtilities

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationOps

case class CompiledModel(compiledCode: String        = "",
                         model:        Model,
                         program:      Program       = Program.empty(),
                         procedures:   ProceduresMap = NoProcedures,
                         private val compiler: CompilerLike = Compiler) {

  import CompiledModel.{ AskableKind, CompileResult }

  def compileReporter(logo: String): CompileResult[String] = validate {
    _.compileReporter(logo, procedures, program)
  }

  def compileCommand(logo: String, kind: AgentKind = Observer): CompileResult[String] = {

    val command =
      if (kind == Observer)
        logo
      else
        s"""|ask ${kind.toSpecialAgentSetString} [
            |  $logo
            |]""".stripMargin

    validate {
      _.compileCommands(command, procedures, program)
    }

  }

  private val validate: (CompilerLike => String) => CompileResult[String] = CompiledModel.validate(compiler)

}

object CompiledModel {

  type CompileResult[T] = ValidationNel[CompilerException, T]

  private type CompiledModelV = CompileResult[CompiledModel]

  def fromModel(model: Model, compiler: CompilerLike = Compiler): CompiledModelV = validate(compiler) {
    (c) =>
      val (code, program, procedures) = c.compileProcedures(model)
      CompiledModel(code, model, program, procedures, c)
  }

  def fromNlogoContents(contents: String, compiler: CompilerLike = Compiler): CompiledModelV = {
    val model = ModelReader.parseModel(contents, CompilerUtilities)
    fromModel(model)
  }

  def fromCode(netlogoCode: String, compiler: CompilerLike = Compiler): CompiledModelV =
    fromModel(Model(netlogoCode, List(View.square(16))))

  def fromCompiledModel(netlogoCode: String, oldModel: CompiledModel): CompiledModelV = {
    val CompiledModel(_, model, _, _, compiler) = oldModel
    fromModel(model.copy(code = netlogoCode), compiler)
  }

  private def validate[T](compiler: CompilerLike)(compileFunc: (CompilerLike) => T): CompileResult[T] =
    try compileFunc(compiler).successNel
    catch {
      case ex: CompilerException => ex.failureNel
    }

  private implicit class AskableKind(kind: AgentKind) {
    def toSpecialAgentSetString: String =
      kind match {
        case Turtle   => "turtles"
        case Patch    => "patches"
        case Link     => "links"
        case _        => throw new IllegalArgumentException(s"This type of agent cannot be asked: $kind")
      }
  }

}
