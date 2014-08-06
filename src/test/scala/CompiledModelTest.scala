package org.nlogo.tortoise

import org.scalatest.FunSuite
import Compiler.{compileCommands, compileReporter}
import org.nlogo.api
import org.nlogo.core
import scalaz.{Scalaz, Success, Failure, NonEmptyList, ValidationNel}

class CompiledModelTest extends FunSuite {

  def assertSameException(expected: api.CompilerException, observed: api.CompilerException) = {
    assertResult(expected.toString)(observed.toString)
    assertResult(expected.start)(observed.start)
    assertResult(expected.end)(observed.end)
    assertResult(expected.filename)(observed.filename)
  }

  def testValid(code: String, expected: => String, observed: => ValidationNel[api.CompilerException, String]) =
    assertResult(expected)(observed.valueOr(exceptionNel =>
      fail(s"The following code failed with the given error:\n$code\n\n${exceptionNel.head}\n")
    ))

  def testValidCommand(model: CompiledModel, command: String) =
    testValid(command,
              compileCommands(command, model.procedures, model.program),
              model.compileCommand(command))

  def testValidReporter(model: CompiledModel, reporter: String) =
    testValid(reporter,
              compileReporter(reporter, model.procedures, model.program),
              model.compileReporter(reporter))

  def testInvalid(code: String, expected: => String, observed: => ValidationNel[api.CompilerException, String]) = try {
    expected
    fail(s"Bad test: This code should not have compiled\n$code\nIt compiled to\n$expected\n")
  } catch {
    case expectedEx: api.CompilerException =>
      observed match {
        case Success(s) => fail(s"This code should not have compiled\n$code\nIt compiled to\n$s\n")
        case Failure(NonEmptyList(ex)) => assertSameException(expectedEx, ex)
        case f => fail(s"This code gave more than one failure\n$code\n\n$f\n")
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

  val modelCode =
    s"""|to go
        |end
        |to-report count-things
        |  report count turtles
        |end""".stripMargin
  def modelValidation = CompiledModel.fromCode(modelCode)
  def model = modelValidation.valueOr(x => throw x.head)

  val badModelCode =
    s"""|to go
        |  foobar
        |end""".stripMargin
  def badModelValidation = CompiledModel.fromCode(badModelCode)

  test("model from code") {
    testValid(modelCode,
              Compiler.compileProcedures(core.Model(modelCode, widgets = List(core.View.square(16))))._1,
              modelValidation map { _.compiledCode })
  }

  test("invalid model from code") {
    testInvalid(badModelCode,
                Compiler.compileProcedures(core.Model(badModelCode, widgets = List(core.View.square(16))))._1,
                badModelValidation map { _.compiledCode })
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
