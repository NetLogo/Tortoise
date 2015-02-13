// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  java.util.{ List => JList, Map => JMap }

import
  org.mozilla.javascript.JavaScriptException

import
  org.scalatest.FunSuite

import
  scala.{ collection, io, util },
    collection.JavaConversions._,
    io.Source,
    util.matching.Regex

import
  jsengine.Rhino

class ModelDumpTests extends FunSuite {

  val compilationFunction: Array[AnyRef] => AnyRef = {
    val engineSource   = resourceText("/tortoise.js")
    val rhinoEngine    = (new Rhino).engine
    rhinoEngine.eval(engineSource)
    rhinoEngine.function("function(s) { return (new BrowserCompiler()).fromNlogo(s); }")
  }

  for (path <- Model.models.map(_.path).distinct) {
    test(s"outputs correct model javascript for ${path}") {
      try {
        val modelContents     = Source.fromFile(path).mkString
        val compilationResult =
          compilationFunction(Array[Object](modelContents))
            .asInstanceOf[JMap[String, AnyRef]]
        assert(compilationResult("success").asInstanceOf[Boolean])

        val genaratedJs = compilationResult("result").toString.trim
        assertResult(archivedCompilation(path))(genaratedJs)

        val widgets = compilationResult("widgets").asInstanceOf[JList[AnyRef]]
        assert(widgets.nonEmpty)
        widgets.foreach {
          widget =>
            val widgetMap = widget.asInstanceOf[JMap[String, AnyRef]]
            assert(widgetMap.get("type").isInstanceOf[String])
        }

        assert(compilationResult("code").toString.contains("to"))

        if (! path.contains("benchmark"))
          assert(compilationResult("info").toString.contains("WHAT IS IT"))
      } catch {
        case e: JavaScriptException =>
          println(e.details)
          throw e
      }
    }
  }

  private def archivedCompilation(path: String) = {
    val modelName = path.split('/').last.split('.')(0)
    cleanJsNumbers(resourceText(s"/dumps/$modelName.js").trim)
  }

  // scala.js `toString` for numeric values gives different results than jvm scala.
  // We need do a little cleanup to match the outputs - 2/17/15 RG
  private def cleanJsNumbers(rawJs: String): String = {
    val trailingZeroNumbers  =
      new Regex("""(\d)\.0(\D)""", "digitBefore", "nonDigitAfter")
    val scientificNotation   =
      new Regex("""(\d)+E(-?)(\d+)""", "coefficient", "sign", "exponent")
    val trailingZerosRemoved = trailingZeroNumbers.replaceAllIn(rawJs, {
      m =>
        s"${m.group("digitBefore")}${m.group("nonDigitAfter")}"
    })
    scientificNotation.replaceAllIn(trailingZerosRemoved, {
      m =>
        m.group("sign") match {
          case "-" => s"0.${"0" * (m.group("exponent").toInt - 1)}${m.group("coefficient")}"
          case ""  => s"${m.group("coefficient")}${"0" * m.group("exponent").toInt}"
        }
    })
  }

  private def resourceText(path: String) =
    Source.fromURL(getClass.getResource(path)).mkString
}
