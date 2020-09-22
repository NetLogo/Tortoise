// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  jsengine.GraalJS

import
  org.nlogo.tortoise.compiler.CompiledModel

import
  scala.io.Source

import
  org.scalatest.FunSuite

class TestExtensionWorldState extends FunSuite {

  private val model = {
    val input = Source.fromFile("resources/test/models/ExtensionStateTest.nlogo")
    val nlogo = input.mkString
    input.close()
    CompiledModel.fromNlogoContents(nlogo) valueOr ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
  }

  test("creating extension objects doesn't blow up") {
    engine.eval(model.compiledCode)
    evalNLCommand("make-extension-objects")
  }

  private lazy val engine = {
    val preCode = ""
    val engine = new GraalJS
    engine.setupTortoise
    engine.eval(preCode)
    engine
  }

  private def evalNLCommand(netlogo: String): AnyRef =
    evalNL(netlogo, model.compileRawCommand)

  private def evalNL(netlogo: String, evaluator: (String) => CompiledModel.CompileResult[String]): AnyRef = {
    val result = evaluator(netlogo) valueOr ((nel) => throw new Exception(nel.list.toList.mkString))
    engine.eval(result)
  }
}
