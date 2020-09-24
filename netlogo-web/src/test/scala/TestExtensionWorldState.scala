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
    CompiledModel.fromNlogoContents(nlogo, compiler) valueOr ((nel) => throw new Exception(s"This test is seriously borked: ${nel.list.toList.mkString}"))
  }

  test("creating extension objects doesn't blow up") { fixture =>
    fixture.eval(model.compiledCode)
    evalCommand("make-extension-objects")

    val arr = s"""{{array: (agentset, 50 turtles) (agentset, 25 patches)}}"""
    val mat = s"""{{matrix:  [ [ 10 10 10 10 10 ][ 10 10 10 10 10 ][ 10 10 10 10 10 ][ 10 10 10 10 10 ] ]}}"""
    val nlm = s"""{{nlmap:  ["gold" ${arr}] ["silver" 100] ["bronze" false]}}"""
    val tab = s"""{{table: [["apples" [0 10 20]] ["oranges" ["monkey" "purple" "dishwasher"]] ["plums" true]]}}"""
    val lis = s"""[10 ${tab} true balloons ${arr} ${mat} ${nlm}]"""
    assert(arr == evalReporter("(word arr)"))
    assert(mat == evalReporter("(word mat)"))
    assert(nlm == evalReporter("(word nlm)"))
    assert(tab == evalReporter("(word tab)"))
    assert(lis == evalReporter("(word lis)"))
  }

  test("extension objects remain unchanged with world state export and import") { fixture =>
    fixture.eval(model.compiledCode)
    evalCommand("make-extension-objects")
    fixture.eval("var state = workspace.world.exportState()")
    fixture.eval("workspace.world.clearAll()")
    fixture.eval("workspace.world.importState(state)")

    assert(fixture.eval("world.observer.getGlobal('nlm').gold === world.observer.getGlobal('arr')") === true)

    val arr = s"""{{array: (agentset, 50 turtles) (agentset, 25 patches)}}"""
    val mat = s"""{{matrix:  [ [ 10 10 10 10 10 ][ 10 10 10 10 10 ][ 10 10 10 10 10 ][ 10 10 10 10 10 ] ]}}"""
    val nlm = s"""{{nlmap:  ["gold" ${arr}] ["silver" 100] ["bronze" false]}}"""
    val tab = s"""{{table: [["apples" [0 10 20]] ["oranges" ["monkey" "purple" "dishwasher"]] ["plums" true]]}}"""
    val lis = s"""[10 ${tab} true balloons ${arr} ${mat} ${nlm}]"""
    assert(arr == evalReporter("(word arr)"))
    assert(mat == evalReporter("(word mat)"))
    assert(nlm == evalReporter("(word nlm)"))
    assert(tab == evalReporter("(word tab)"))
    assert(lis == evalReporter("(word lis)"))

    evalCommand("array:set arr 0 (n-of 33 turtles)")
    val arr33 = s"""{{array: (agentset, 33 turtles) (agentset, 25 patches)}}"""
    val nlm33 = s"""{{nlmap:  ["gold" ${arr33}] ["silver" 100] ["bronze" false]}}"""
    assert(arr33 == evalReporter("(word arr)"))
    assert(nlm33 == evalReporter("(word nlm)"))
  }

  private def evalCommand(netlogo: String): AnyRef =
    evalModel(netlogo, model.compileRawCommand)

  private def evalReporter(netlogo: String): AnyRef =
    evalModel(netlogo, model.compileReporter)

  private def evalModel(netlogo: String, evaluator: (String) => CompiledModel.CompileResult[String]): AnyRef = {
    val result = evaluator(netlogo) valueOr ((nel) => throw new Exception(nel.list.toList.mkString))
    engine.eval(result)
  }

}
