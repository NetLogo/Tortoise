// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import utest._

import scala.scalajs.js

import org.nlogo.tortoise.compiler.TestUtilities.{
  modelToCompilationRequest,
  validModel
}

object LiteralConverterTest extends TestSuite {
  def tests = utest.Tests {

    "works with simple code"-{
      val compilationRequest = modelToCompilationRequest(validModel)
      val result = LiteralConverter.compileRunString(compilationRequest, "crt 100 [ fd 100 ]", false, js.Array(), "observer")
      val expected = """(function() { var R = ProcedurePrims.ask(world.turtleManager.createTurtles(100, ""), function() { SelfManager.self().fd(100); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(0, 3, R); return R; } })"""
      assert(expected == result)
    }

    // The code compiles inside a `to __run [...] __turtlecode ` wrapper, but the positions baked into the JS have to be
    // relative to the run string, since that is all the outside world has to point at.  -Jeremy B August 2026
    "emits source positions relative to the run string"-{
      val compilationRequest = modelToCompilationRequest(validModel)
      val result = LiteralConverter.compileRunString(compilationRequest, "fd 1 fd 2 / 0", false, js.Array(), "turtle")
      assert(result.contains("PrimChecks.math.div(10, 11,"))
    }

    // The wrapper's length varies with the procedure variables and the agent kind, so the rebasing has to be measured
    // from the wrapper actually emitted rather than assumed.
    "keeps source positions relative to the run string as the wrapper changes"-{
      val compilationRequest = modelToCompilationRequest(validModel)
      val result = LiteralConverter.compileRunString(compilationRequest, "fd 1 fd 2 / 0", false, js.Array("a", "bcd"), "turtle")
      assert(result.contains("PrimChecks.math.div(10, 11,"))
    }

    "emits source positions relative to a runresult string"-{
      val compilationRequest = modelToCompilationRequest(validModel)
      val result = LiteralConverter.compileRunString(compilationRequest, "5 + 2 / 0", true, js.Array(), "observer")
      assert(result.contains("PrimChecks.math.div(6, 7,"))
    }

    "translates expected compiler error gracefully"-{
      val compilationRequest = modelToCompilationRequest(validModel)
      try {
        LiteralConverter.compileRunString(compilationRequest, "set s 100", false, js.Array(), "observer")
      } catch {
        case ex: LiteralConverter.WrappedException =>
          val result = ex.message
          val expected = "Nothing named S has been defined."
          assert(expected == result)
      }
    }

    "compiles the run string in the caller's agent context"-{
      val compilationRequest = modelToCompilationRequest(validModel)
      try {
        LiteralConverter.compileRunString(compilationRequest, "hatch 1", false, js.Array(), "patch")
      } catch {
        case ex: LiteralConverter.WrappedException =>
          val result = ex.message
          val expected = "You can't use HATCH in a patch context, because HATCH is turtle-only."
          assert(expected == result)
      }
    }

  }
}
