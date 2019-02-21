// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.scalatest.{ exceptions, Assertions },
    Assertions.{ assertResult, fail },
    exceptions.{ TestPendingException, TestFailedException }

import
  org.graalvm.polyglot.PolyglotException

import
  org.nlogo.{ core, headless },
    core.{ AgentKind, CompilerException, FrontEndInterface, Model => CModel, Program, View },
      FrontEndInterface.{ ProceduresMap, NoProcedures },
    headless.test.{ AbstractFixture, Command, Compile, CompileError, RuntimeError, Reporter, Success, TestMode }

import
  org.nlogo.tortoise.compiler.Compiler

import jsengine.GraalJS

class TortoiseFixture(name: String, engine: GraalJS, notImplemented: (String) => Nothing) extends Fixture {

  private var program: Program = Program.empty
  private var procs: ProceduresMap = NoProcedures

  private def modelJS(model: CModel): String = {
    val compilation = cautiously(Compiler.compileProcedures(model))
    program = compilation.program
    procs   = compilation.procedures
    Compiler.toJS(compilation)
  }

  override def declare(model: CModel): Unit = {
    engine.eval(modelJS(model))
    ()
  }

  override def readFromString(literal: String): AnyRef =
    cautiously(engine.eval(Compiler.compileReporter(literal)))

  override def runCommand(command: Command, mode: TestMode): Unit = {
    lazy val js = Compiler.compileCommands(wrapCommand(command), procs, program)
    command.result match {
      case Success(_) =>
        cautiously{ engine.run(js); () }
      case CompileError(msg) =>
        expectCompileError(js, msg)
      case RuntimeError(msg) =>
        expectRuntimeError(cautiously(engine.run(js)), msg)
      case r =>
        notImplemented(s"unknown result type: ${r.getClass.getSimpleName}")
    }
  }

  override def runReporter(reporter: Reporter, mode: TestMode): Unit = {
    lazy val js = "var letVars = { }; " + Compiler.compileReporter(reporter.reporter, procs, program)
    reporter.result match {
      case Success(expectedResult) =>
        val actualResult = cautiously(engine.eval(js))
        checkResult(mode, reporter.reporter, expectedResult, actualResult)
      case CompileError(msg) =>
        expectCompileError(js, msg)
      case RuntimeError(msg) =>
        expectRuntimeError(cautiously(engine.run(js)), msg)
      case r =>
        notImplemented(s"unknown result type: ${r.getClass.getSimpleName}")
    }
  }

  override def checkCompile(model: CModel, compile: Compile): Unit = {
    lazy val js = modelJS(model)
    compile.result match {
      case Success(expectedResult) =>
        engine.eval(js)
      case CompileError(msg) =>
        expectCompileError(js, msg)
      case r =>
        notImplemented(s"unknown result type: ${r.getClass.getSimpleName}")
    }
    ()
  }

  private def expectCompileError(js: => String, msg: String): Unit = {
    try {
      cautiously(js)
      fail("no CompilerException occurred")
    }
    catch {
      case ex: CompilerException =>
        assertResult(msg)(ex.getMessage)
        ()
    }
  }

  private def expectRuntimeError(res: => Any, msg: String): Unit = {
    try {
      res
      fail("no RuntimeError occurred")
    }
    catch {
      case ex: PolyglotException =>
        val AfterFirstColonRegex        = "^.*?: (.*)".r
        val AfterFirstColonRegex(exMsg) = ex.getMessage
        assertResult(msg)(exMsg)
        ()
      case e: TestFailedException => throw e
      case e: TestPendingException => throw e
      case e: Exception => fail(s"expected RuntimeError, but got ${e.getClass.getSimpleName}")
    }
  }

  private def cautiously[T](t: => T): T = {
    val notImplementedMessages = Seq("unimplemented primitive: ", "unknown settable: ", "unknown language feature: ")
    try t
    catch {
      case ex: CompilerException if notImplementedMessages.exists(ex.getMessage.startsWith) =>
        notImplemented(ex.getMessage)
    }
  }

}

private[tortoise] trait Fixture extends AbstractFixture {

  override def defaultView = View.square(5)

  override def open(path: String, shouldAutoInstallLibs: Boolean = false): Unit = ???

  override def openModel(model: CModel, shouldAutoInstallLibs: Boolean = false): Unit =
    declare(model)

  protected def wrapCommand(command: Command): String =
    command.kind match {
      case AgentKind.Observer => command.command
      case AgentKind.Turtle   => s"ask turtles [ ${command.command}\n]"
      case AgentKind.Patch    => s"ask patches [ ${command.command}\n]"
      case AgentKind.Link     => s"ask links [ ${command.command}\n]"
    }

}
