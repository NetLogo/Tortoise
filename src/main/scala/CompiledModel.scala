package org.nlogo.tortoise

import
  org.nlogo.{ core, api, compile, nvm },
    api.{ CompilerException, model, Program },
      model.ModelReader,
    compile.front.FrontEnd,
    core.{ AgentKind, Model, View },
      AgentKind._,
    nvm.{ DefaultParserServices, FrontEndInterface },
      FrontEndInterface.{ ProceduresMap, NoProcedures }

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationV

case class CompiledModel(compiledCode: String        = "",
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
      CompiledModel(code, program, procedures, c)
  }

  def fromNlogoContents(contents: String, compiler: CompilerLike = Compiler): CompiledModelV = {
    val model = ModelReader.parseModel(contents, new DefaultParserServices(FrontEnd))
    fromModel(model)
  }

  def fromCode(netlogoCode: String, compiler: CompilerLike = Compiler): CompiledModelV =
    fromModel(Model(netlogoCode, List(View.square(16))))

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
