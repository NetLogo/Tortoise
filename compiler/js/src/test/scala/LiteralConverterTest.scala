// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import utest._

import scala.scalajs.js

import org.nlogo.tortoise.compiler.TestUtilities.{
  modelToCompilationRequest
, validModel
}

object LiteralConverterTest extends TestSuite {
  def tests = TestSuite {

    "works with simple code"-{
      val compilationRequest = modelToCompilationRequest(validModel)
      val result = LiteralConverter.compileRunString(compilationRequest, "crt 100 [ fd 100 ]", false, js.Array())
      val expected = """(function() { var R = ProcedurePrims.ask(world.turtleManager.createTurtles(100, ""), function() { SelfManager.self().fd(100); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; } })"""
      assert(expected == result)
    }

    "translates expected compiler error gracefully"-{
      val compilationRequest = modelToCompilationRequest(validModel)
      try {
        LiteralConverter.compileRunString(compilationRequest, "set s 100", false, js.Array())
      } catch {
        case ex: LiteralConverter.WrappedException =>
          val result = ex.message
          val expected = "Nothing named S has been defined."
          assert(expected == result)
      }
    }

  }
}
