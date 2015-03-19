// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.scalatest.{ FunSuite, ParallelTestExecution }

import
  org.nlogo.tortoise.jsengine.Rhino,
  org.mozilla.javascript.NativeArray

import
  scala.collection.JavaConversions._

class ModelDumpTests extends FunSuite {
  val engineSource = io.Source.fromFile("js/target/tortoisejs-opt.js").mkString

  val rhinoEngine = (new Rhino).engine

  val compilationFunction: Array[AnyRef] => AnyRef = {
    rhinoEngine.eval(engineSource)
    rhinoEngine.function(
      "function(s) { return (new BrowserCompiler()).fromModel(s); }")
  }

  for (path <- Model.models.map(_.path).distinct) {
    test(s"outputs correct model javascript for ${path}") {
      val modelContents = io.Source.fromFile(path).mkString
      try {
        val compilationResult = compilationFunction(Array[Object](modelContents))
          .asInstanceOf[java.util.Map[String, AnyRef]]
        assert(compilationResult.get("success").asInstanceOf[Boolean])
        val genaratedJs = compilationResult.get("result").toString.trim
        assertResult(expectedCompilation(path))(genaratedJs)
        val widgets = compilationResult.get("widgets")
          .asInstanceOf[NativeArray]
        assert(widgets.listIterator.hasNext)
        widgets.iterator.foreach { widget =>
          val widgetMap = widget.asInstanceOf[java.util.Map[String, AnyRef]]
          assert(widgetMap.get("type").isInstanceOf[String])
        }
      } catch {
        case e: org.mozilla.javascript.JavaScriptException =>
          println(e.details)
          throw e
      }
    }
  }

  private def expectedCompilation(path: String) = {
    val modelName = path.split('/').last.split('.')(0)
    val expectedJs = io.Source.fromFile(s"resources/test/dumps/$modelName.js").mkString
    cleanExpectedJs(expectedJs.trim)
  }

  // scala.js `toString` for numeric value gives different results than in jvm
  // We need to do a little cleanup to match the outputs
  // 2/17/15 RG
  private def cleanExpectedJs(rawJs: String): String = {
    val stripTrailingZeros = """(\d)\.0(\D)""".r
    val strippedOfTrailingZeros = stripTrailingZeros.replaceAllIn(
      rawJs.trim, m => m.group(1) + m.group(2))
    val scientificNotation = """(\d)+E(-?)(\d+)""".r
    scientificNotation.replaceAllIn(
      strippedOfTrailingZeros, m => m.group(2) match {
        case "-" => s"0.${"0" * (m.group(3).toInt - 1)}${m.group(1)}"
        case ""  => s"${m.group(1)}${"0" * m.group(3).toInt}"
      })
  }
}
