package org.nlogo.tortoise

import org.scalatest.FunSuite
import Compiler.{compileCommands, compileReporter}
import org.nlogo.api
import scalaz.{Scalaz, Success, Failure, NonEmptyList, ValidationNel}

class CompiledModelTest extends FunSuite {

  def assertSameException(expected: api.CompilerException, observed: api.CompilerException) = {
    assertResult(expected.toString)(observed.toString)
    assertResult(expected.start)(observed.start)
    assertResult(expected.end)(observed.end)
    assertResult(expected.filename)(observed.filename)
  }
    

  def testValidCommand(model: CompiledModel, command: String) =
    assertResult(
      compileCommands(command, model.procedures, model.program)
    )(
      model.compileCommand(command).valueOr(exNel => throw exNel.head)
    )

  def testValidReporter(model: CompiledModel, reporter: String) =
    assertResult(
      compileReporter(reporter, model.procedures, model.program)
    )(
      model.compileReporter(reporter).valueOr(exNel => throw exNel.head)
    )

  def testInvalid(code: String, expected: => String, observed: => ValidationNel[api.CompilerException, String]) = try {
    expected
    fail("Bad test: Code that should not have compiled did: " + code)
  } catch {
    case expectedEx: api.CompilerException =>
      observed match {
        case Success(_) => fail("This code should not have compiled: " + code)
        case Failure(NonEmptyList(ex)) => assertSameException(expectedEx, ex)
        case f => fail("Code gave more than one failure: " + f)
      }
  }

  def testInvalidCommand(model: CompiledModel, command: String) =
    testInvalid(command,
                compileCommands(command, model.procedures, model.program),
                model.compileCommand(command))

  def testInvalidReporter(model: CompiledModel, reporter: String) =
    testInvalid(reporter,
                compileReporter(reporter, model.procedures, model.program),
                model.compileReporter(reporter))

  test("default model valid") {
    testValidCommand(CompiledModel.defaultModel, "crt 1")
    testValidReporter(CompiledModel.defaultModel, "count turtles")
  }

  test("default model invalid") {
    testInvalidCommand(CompiledModel.defaultModel, "crt \"foo\"")
    testInvalidReporter(CompiledModel.defaultModel, "[fd 1] of turtles")
  }

  val model = CompiledModel.fromCode(
    s"""|to go
        |end
        |to-report count-things
        |  report count turtles
        |end""".stripMargin) match {
    case Success(m: CompiledModel) => m
    case Failure(NonEmptyList(ex: api.CompilerException, t)) => throw ex
  }

  test("custom procedures valid") {
    testValidCommand(model, "go")
    testValidReporter(model, "count-things")
  }

  test("custom procedures invalid") {
    testInvalidCommand(model, "count-things")
    testInvalidReporter(model, "go")
  }
}
