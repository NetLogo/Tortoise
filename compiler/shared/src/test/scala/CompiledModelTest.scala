// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.scalatest.FunSuite

import
  scalaz.NonEmptyList

import
  org.nlogo.core.{ CompilerException, Model => CModel, View }

import
  CompiledModel.CompileResult

class CompiledModelTest extends FunSuite {

  private val goodModelCode =
    s"""|to go
        |end
        |to-report count-things
        |  report count turtles
        |end""".stripMargin

  private val emptyModel = unsafeGenModelFromCode("")
  private val goodModel  = unsafeGenModelFromCode(goodModelCode)

  test("model from code") {
    testModelCode(goodModelCode, isValid)
  }

  test("invalid model from code") {
    val badModelCode =
      s"""|to go
          |  foobar
          |end""".stripMargin
    testModelCode(badModelCode, isInvalid)
  }

  test("invalid model from nlogo") {
    assert(CompiledModel.fromNlogoContents("").isFailure)
  }

  test("model with unimplemented primitives can be compiled") {
    val unimplemented =
      s"""|to go
          |  no-display
          |end""".stripMargin
    testModelCode(unimplemented, isInvalid, CompilerFlags(generateUnimplemented = false))
    testModelCode(unimplemented, isValid,   CompilerFlags(generateUnimplemented = true))
  }

  test("custom procedures valid") {
    implicit val m = goodModel
    testValidCommand ("go")
    testValidReporter("count-things")
  }

  test("custom procedures invalid") {
    implicit val m = goodModel
    testInvalidCommand ("count-things")
    testInvalidReporter("go")
  }

  test("default model valid") {
    implicit val m = emptyModel
    testValidCommand ("crt 1")
    testValidReporter("count turtles")
  }

  test("default model invalid") {
    implicit val m = emptyModel
    testInvalidCommand ("crt \"foo\"")
    testInvalidReporter("[fd 1] of turtles")
  }

  private def testValidCommand(code: String)(implicit model: CompiledModel) =
    testSnippet(code, isReporter = false, isValid)

  private def testValidReporter(code: String)(implicit model: CompiledModel) =
    testSnippet(code, isReporter = true, isValid)

  private def testInvalidCommand(code: String)(implicit model: CompiledModel) =
    testSnippet(code, isReporter = false, isInvalid)

  private def testInvalidReporter(code: String)(implicit model: CompiledModel) =
    testSnippet(code, isReporter = true, isInvalid)

  type TestFunc = (String, (String) => String, (String) => CompileResult[String]) => Unit

  private def testSnippet(code:       String,
                          isReporter: Boolean,
                          runTest:    TestFunc)
                (implicit model:      CompiledModel): Unit = {

    val (compileFunc, modelCompileFunc) =
      if (isReporter)
        (Compiler.compileReporter _, model.compileReporter _)
      else
        (Compiler.compileCommands _, model.compileCommand(_: String))

    val genJS = compileFunc(_: String, model.procedures, model.program)

    runTest(code, genJS, modelCompileFunc)

  }

  private def testModelCode(modelCode:     String,
                            runTest:       TestFunc,
                            compilerFlags: CompilerFlags = CompilerFlags.Default): Unit = {

    val genJS         = (codeToModel                                                  andThen
                        ((m: CModel) => Compiler.compileProcedures(m)(compilerFlags)) andThen
                        Compiler.toJS)(_)
    val genValidation = (code: String) => CompiledModel.fromCode(code)(compilerFlags) map (_.compiledCode)

    runTest(modelCode, genJS, genValidation)

  }

  private def isValid(code:                String,
                      genExpectedStr:      (String) => String,
                      genActualValidation: (String) => CompileResult[String]): Unit = {
    val expectedCode = genExpectedStr(code)
    val actualCode   =
      genActualValidation(code) valueOr { case NonEmptyList(head, _) => fail(codeFailedWithError(code, head)) }
    assertResult(expectedCode)(actualCode)
    ()
  }

  private def isInvalid(code:                String,
                        throwOrGetStr:       (String) => String,
                        genActualValidation: (String) => CompileResult[String]): Unit =
    try fail(badCodeCompiled(code, throwOrGetStr(code)))
    catch {
      case expectedEx: CompilerException =>
        genActualValidation(code).fold(
          {
            case NonEmptyList(head, _) => assertSameException(expectedEx, head)
            case nel                   => fail(codeGaveMoreThanOneError(code, nel))
          },
          result => fail(badCodeCompiledTo(code, result))
        )
    }

  private def assertSameException(expected: CompilerException, observed: CompilerException): Unit = {
    assertResult(expected.toString)(observed.toString)
    assertResult(expected.start)(observed.start)
    assertResult(expected.end)(observed.end)
    assertResult(expected.filename)(observed.filename)
    ()
  }

  private def unsafeGenModelFromCode(code: String): CompiledModel =
    CompiledModel.fromCode(code) valueOr { case NonEmptyList(head, _) => throw head }

  private val codeToModel = (code: String) =>
    CModel(code, List(View.square(16)))

  private val badCodeCompiled = (code: String, expected: String) =>
    s"""Bad test: This code should not have compiled
       |$code
       |It compiled to
       |$expected
       |""".stripMargin

  private val codeFailedWithError = (code: String, error: CompilerException) =>
    s"""The following code failed with the given error:
       |$code
       |
       |$error
       |""".stripMargin

  private val badCodeCompiledTo = (code: String, output: String) =>
    s"""This code should not have compiled
       |$code
       |It compiled to
       |$output
       |""".stripMargin

  private val codeGaveMoreThanOneError = (code: String, failures: NonEmptyList[CompilerException]) =>
    s"""This code gave more than one failure
       |$code
       |
       |$failures
       |""".stripMargin

}
