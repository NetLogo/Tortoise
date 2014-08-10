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
                         procedures:   ProceduresMap = NoProcedures) {

  import CompiledModel.{ AskableKind, CompileResult, validate }

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
}

object CompiledModel {

  type CompileResult[T] = ValidationNel[CompilerException, T]

  private type CompiledModelV = CompileResult[CompiledModel]

  def fromModel(model: Model): CompiledModelV = validate {
    (c) => (CompiledModel.apply _).tupled(c.compileProcedures(model))
  }

  def fromNlogoContents(contents: String): CompiledModelV = {
    val model = ModelReader.parseModel(contents, new DefaultParserServices(FrontEnd))
    fromModel(model)
  }

  def fromCode(netlogoCode: String): CompiledModelV =
    fromModel(Model(netlogoCode, List(View.square(16))))

  private def validate[T](compileFunc: (Compiler.type) => T): CompileResult[T] =
    try compileFunc(Compiler).successNel
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
