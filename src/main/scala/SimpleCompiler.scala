// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  scala.util.Try

import
  scalaz.State

import
  org.nlogo.{ api, compile, core, nvm },
    api.{ model, Program },
      model.ModelReader,
    compile.front.FrontEnd,
    core.Model,
    nvm.{ DefaultParserServices, FrontEndInterface },
      FrontEndInterface.{ NoProcedures, ProceduresMap }

case class SimpleCompiler(model:        Model,
                          program:      Program         = Program.empty(),
                          procedures:   ProceduresMap   = NoProcedures)

object SimpleCompilerOps {

  private val errorJS = """throw "NetLogo code failed to compile";"""

  def compiled = State[SimpleCompiler, String] {
    case compiler @ SimpleCompiler(model, program, procedures) =>
      val strCompilerOpt = carefullyCompile {
        val (js, newProgram, newProcedures) = Compiler.compileProcedures(model)
        (compiler.copy(program = newProgram, procedures = newProcedures), js)
      }
      strCompilerOpt getOrElse ((compiler, errorJS))
  }

  def runCommand(command: String) = State[SimpleCompiler, String] {
    case compiler @ SimpleCompiler(model, program, procedures) =>
      val strOpt = carefullyCompile(Compiler.compileCommands(command, procedures, program))
      val js     = strOpt getOrElse errorJS
      (compiler, js)
  }

  def runReporter(reporter: String) = State[SimpleCompiler, String] {
    case compiler @ SimpleCompiler(model, program, procedures) =>
      val strOpt = carefullyCompile(Compiler.compileReporter(reporter, procedures, program))
      val js     = strOpt getOrElse errorJS
      (compiler, js)
  }

  private def carefullyCompile[T](f: => T): Option[T] = Try(f).toOption

}

object SimpleCompiler {

  def fromNLogoFile(contents: String): SimpleCompiler = {
    val model = ModelReader.parseModel(contents, new DefaultParserServices(FrontEnd))
    SimpleCompiler(model)
  }

}
