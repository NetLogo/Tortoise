// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  scalaz.NonEmptyList

import org.scalatest.FunSuite
import org.nlogo.core.Resource

class TestModelDumps extends FunSuite {
  for(model <- Model.models) {
    test(model.name) {
      val expected =
        scala.util.Try(Resource.asString(s"/dumps/${model.filename}.js"))
          .getOrElse("").trim
      val modelContents = io.Source.fromFile(model.path).mkString
      val compiledModel = CompiledModel.fromNlogoContents(modelContents) valueOr { case NonEmptyList(head, _) => throw head }
      val actual        = compiledModel.compiledCode.trim
      if (expected != actual) {
        val path = s"target/${model.filename}.js"
        println(s"actual JS written to $path")
        val w = new java.io.FileWriter(path)
        w.write(actual + "\n")
        w.close()
      }
      assertResult(expected)(actual)
    }
  }
}
