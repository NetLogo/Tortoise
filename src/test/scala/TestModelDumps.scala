// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.scalatest.FunSuite
import org.nlogo.core.Resource

class TestModelDumps extends FunSuite {
  for(model <- Model.models) {
    test(model.name) {
      val expected =
        scala.util.Try(Resource.asString(s"/dumps/${model.filename}.js"))
          .getOrElse("").trim
      val modelContents = io.Source.fromFile(model.path).mkString
      val actual = CompilerService.compile(modelContents).trim
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
