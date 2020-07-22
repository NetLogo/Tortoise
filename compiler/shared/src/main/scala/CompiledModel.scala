// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  CompilerLike.Compilation

import
  org.nlogo.{ core, parse },
    core.{ model, CompilerException, Model, View },
    model.ModelReader,
    parse.CompilerUtilities

import
  scalaz.{ Scalaz, ValidationNel },
    Scalaz.ToValidationOps

case class CompiledModel(compiledCode: String        = "",
                         compilation:  Compilation,
                         private val compiler: CompilerLike = Compiler) {
  import CompiledModel.CompileResult

  val Compilation(_, widgets, _, model, procedures, program) = compilation

  def compileReporter(logo: String): CompileResult[String] = validate {
    _.compileReporter(logo, procedures, program)
  }

  def compileCommand(logo: String): CompileResult[String] = validate {
    _.compileCommands(logo, procedures, program)
  }

  def compileRawCommand(logo: String): CompileResult[String] = validate {
    _.compileRawCommands(logo, procedures, program)
  }
  
  def compileProceduresIncremental(logo: String, overriding: Seq[String]): CompileResult[String] = validate {
    _.compileProceduresIncremental(logo, procedures, program, overriding)
  }
  
  private val validate: (CompilerLike => String) => CompileResult[String] = CompiledModel.validate(compiler)

}

object CompiledModel {

  type CompileResult[T] = ValidationNel[CompilerException, T]

  private type CompiledModelV = CompileResult[CompiledModel]

  private val DefaultViewSize = 16

  def fromModel(model:         Model,
                compiler:      CompilerLike = Compiler)
      (implicit compilerFlags: CompilerFlags): CompiledModelV = validate(compiler) {
    (c) =>
      val compilation = c.compileProcedures(model)
      CompiledModel(compiler.toJS(compilation), compilation, c)
  }

  def fromNlogoContents(contents:      String,
                        compiler:      CompilerLike  = Compiler)
              (implicit compilerFlags: CompilerFlags): ValidationNel[Exception, CompiledModel] = {
    val validation =
      try fromModel(ModelReader.parseModel(contents, CompilerUtilities, Map()))
      catch {
        case e: RuntimeException => e.failureNel
      }
    validation.leftMap(_.map(ex => ex: Exception))
  }

  def fromCode(netlogoCode:   String,
               compiler:      CompilerLike = Compiler)
     (implicit compilerFlags: CompilerFlags): CompiledModelV =
    fromModel(Model(netlogoCode, List(View.square(DefaultViewSize))))

  def fromCompiledModel(netlogoCode:   String,
                        oldModel:      CompiledModel)
              (implicit compilerFlags: CompilerFlags): CompiledModelV = {
    val CompiledModel(_, compilation, compiler) = oldModel
    val model                                   = compilation.model
    fromModel(model.copy(code = netlogoCode), compiler)
  }

  private def validate[T](compiler: CompilerLike)(compileFunc: (CompilerLike) => T): CompileResult[T] =
    try compileFunc(compiler).successNel
    catch {
      case ex: CompilerException => ex.failureNel
    }

}
