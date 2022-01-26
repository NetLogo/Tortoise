// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.scalatest.funsuite.AnyFunSuite

import org.nlogo.core.{ PrimitiveReporter, Syntax }

class NLWExtensionManagerTest extends AnyFunSuite {

  test("basic extension with no prims works") {
    val json = """{ "name": "smoke", "prims": [] }"""
    val expected = new Extension {
      def getName: String = "smoke"
      def getPrims: Seq[ExtensionPrim] = Seq()
    }
    val actual = CreateExtension(json)
    compareExtensions(expected, actual)
  }

  test("extension with multiple prims works") {
    val prim1Json = """{
      "name": "alpha-of",
      "argTypes": ["number"],
      "returnType": "number"
    }"""
    val prim2Json = """{
      "name": "cherry-count",
      "argTypes": ["number", "list"],
      "returnType": "number"
    }"""
    val json = s"""{
      "name": "test"
    , "prims": [ ${prim1Json}, ${prim2Json} ]
    }"""
    val actual = CreateExtension(json)

    val expectedPrim1 = createReporter(List(1), 1, "alpha-of")
    val expectedPrim2 = createReporter(List(1, 8), 1, "cherry-count")
    val expected = new Extension {
      def getName: String = "test"
      def getPrims: Seq[ExtensionPrim] = Seq(expectedPrim1, expectedPrim2)
    }
    compareExtensions(expected, actual)
  }

  test("prims with multi-type parameters works") {
    val primJson = """{
      "name": "alpha-of",
      "argTypes": [{ "types": ["list", "number"] }],
      "returnType": "number"
    }"""
    val json = s"""{
      "name": "test"
    , "prims": [ ${primJson}]
    }"""
    val actual = CreateExtension(json)

    val expectedPrim = createReporter(List(9), 1, "alpha-of")
    val expected = new Extension {
      def getName: String = "test"
      def getPrims: Seq[ExtensionPrim] = Seq(expectedPrim)
    }
    compareExtensions(expected, actual)
  }

  def createReporter(
    right: List[Int]
  , ret: Int
  , name: String
  , agentClassString: String = "OTPL"
  , blockAgentClassString: Option[String] = None): ExtensionPrim =
    new ExtensionPrim(
      new PrimitiveReporter {
        override def getSyntax: Syntax = Syntax.reporterSyntax(
          right                 = right
        , ret                   = ret
        , agentClassString      = agentClassString
        , blockAgentClassString = blockAgentClassString
        )
      }
    , name
    )

  def comparePrims(expected: ExtensionPrim, actual: ExtensionPrim) = {
    assertResult(expected.name)(actual.name)
    assertResult(expected.primitive.getSyntax)(actual.primitive.getSyntax)
  }

  def compareExtensions(expected: Extension, actual: Extension) = {
    assertResult(expected.getName)(actual.getName)
    val expectedPrims = expected.getPrims
    val actualPrims   = actual.getPrims
    assertResult(expectedPrims.length)(actualPrims.length)
    expectedPrims.zip(actualPrims).foreach((t) => comparePrims(t._1, t._2))
  }

}
