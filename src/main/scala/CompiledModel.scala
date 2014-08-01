package org.nlogo.tortoise

import org.nlogo.{ core, api, compile, nvm, workspace },
   nvm.FrontEndInterface.{ ProceduresMap, NoProcedures }
import scalaz.{Scalaz, ValidationNel, Success, Failure, NonEmptyList},
  Scalaz.{ ToValidationV }


class CompiledModel(val compiledCode: String = "",
                    val procedures: ProceduresMap = NoProcedures,
                    val program: api.Program = api.Program.empty()) {

  def compileReporter(logo: String) = CompiledModel.validate {
    Compiler.compileReporter(logo, procedures, program)
  }

  def compileCommand(logo: String) = CompiledModel.validate {
    Compiler.compileCommands(logo, procedures, program)
  }

  def compileCommand(agentType: String, logo: String): ValidationNel[api.CompilerException, String] = {
    val command =
      if (agentType != "observer")
        s"""|ask $agentType [
            |  $logo
            |]""".stripMargin
      else
        logo
    compileCommand(command)
  }
}

object CompiledModel {
  def apply(compiledCode: String = "",
            procedures: ProceduresMap = NoProcedures,
            program: api.Program = api.Program.empty()) = {
    new CompiledModel(compiledCode, procedures, program)
  }
  def fromModel(model: core.Model) = validate {
    val (compiledCode, program, procedures) = Compiler.compileProcedures(model)
    CompiledModel(compiledCode, procedures, program)
  }

  def fromNlogoContents(contents: String) = {
    val model = api.model.ModelReader.parseModel(contents,
      new nvm.DefaultParserServices(compile.front.FrontEnd))
    CompiledModel.fromModel(model)
  }

  def fromCode(netlogoCode: String) =
    fromModel(core.Model(netlogoCode, widgets = List(core.View.square(16))))

  lazy val defaultModel: CompiledModel = fromCode("") match {
    case Success(m: CompiledModel) => m
    case Failure(NonEmptyList(h: api.CompilerException, t)) => throw h
  }

  def validate[T](compilationStmt: => T): ValidationNel[api.CompilerException, T] = try {
    compilationStmt.successNel
  } catch {
    case ex: api.CompilerException => ex.failureNel
  }

}
