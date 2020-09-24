// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.scalatest.fixture.FunSuite

import
  org.nlogo.core.{ FrontEndInterface, Model, Program },
      FrontEndInterface.NoProcedures

import
  jsengine.GraalJS

import
  org.nlogo.tortoise.compiler.{ Compiler, Compilation }

trait SimpleSuite extends FunSuite with TestLogger {

  val compiler = new Compiler()

  override type FixtureParam = SimpleFixture

  override def withFixture(test: OneArgTest) = {

    val fixture = new SimpleFixture(compiler, engine)

    loggingFailures(suiteName, test.name, {
      val outcome = withFixture(test.toNoArgTest(fixture))
      if (outcome.isFailed || outcome.isExceptional) {
        testFailed(this.getClass.getName, test.name)
      }
      outcome
    })

  }

}

class SimpleFixture(compiler: Compiler, engine: GraalJS) {

  private val procedures = NoProcedures
  private val program    = Program.empty()

  private val compileCommands = compiler.compileRawCommands(_: String, procedures, program)
  private val compileReporter = compiler.compileReporter(_: String, procedures, program)
  val eval                    = engine.eval _

  private val compilation = Compilation(Seq(), Seq(), Seq(), Model(), procedures, program)
  private val js          = compiler.toJS(compilation)

  eval(js)

  evalCommand("clear-all random-seed 0")

  def evalCommand(netLogoCommand: String): AnyRef =
    (compileCommands andThen eval)(netLogoCommand)

  def evalReporter(nlCode: String): AnyRef =
    (compileReporter andThen eval)(nlCode)

}
