// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.nlogo.core.{ Model, View }

import
  org.nlogo.tortoise.compiler.CompiledModel

class TestCheckSyntax extends SimpleSuite {

  private def checkSyntax(fixture: SimpleFixture, args: String): String = {
    val model         = Model(code = "", widgets = List(View.square(1)))
    val compiledModel = CompiledModel.fromModel(model, compiler) valueOr
      ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
    fixture.eval(compiledModel.compiledCode)
    fixture.eval(s"ProcedurePrims.checkSyntax($args)").toString
  }

  test("checkSyntax uses the current agent's context by default") {
    fixture =>
      assert(checkSyntax(fixture, "'set pcolor red'").contains("observer context"))
  }

  test("checkSyntax uses the given agent context") {
    fixture =>
      assertResult("")(checkSyntax(fixture, "'set pcolor red', 'patch'"))
      assertResult("")(checkSyntax(fixture, "'set pcolor red', 'turtle'"))
      assert(checkSyntax(fixture, "'set pcolor red', 'link'").contains("link context"))
  }

}
