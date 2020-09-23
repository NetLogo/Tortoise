// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.nlogo.tortoise.compiler.CompiledModel

import
  scala.io.Source

class TestExtensionWorldState extends SimpleSuite {

  private val model = {
    val input = Source.fromFile("resources/test/models/ExtensionStateTest.nlogo")
    val nlogo = input.mkString
    input.close()
    CompiledModel.fromNlogoContents(nlogo) valueOr ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
  }

  test("creating extension objects doesn't blow up") { fixture =>
    fixture.eval(model.compiledCode)
    evalCommand("make-extension-objects")
  }

  test("extension objects remain unchanged with world state export and import") { fixture =>
    fixture.eval(model.compiledCode)
    evalCommand("make-extension-objects")
    fixture.eval("var state = workspace.world.exportState();")
    fixture.eval("workspace.world.clearAll();")
    fixture.eval("workspace.world.importState(state);")
  }

  private def evalCommand(netlogo: String): AnyRef =
    evalModel(netlogo, model.compileRawCommand)

  private def evalModel(netlogo: String, evaluator: (String) => CompiledModel.CompileResult[String]): AnyRef = {
    val result = evaluator(netlogo) valueOr ((nel) => throw new Exception(nel.list.toList.mkString))
    engine.eval(result)
  }

}
