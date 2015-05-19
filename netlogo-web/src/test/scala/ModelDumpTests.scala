// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  java.{ io => jio, util => jutil},
    jio.FileWriter,
    jutil.{ List => JList, Map => JMap }

import
  jsengine.Rhino

import
  org.mozilla.javascript.{ ConsString, JavaScriptException }

import
  org.scalatest.{ FunSuite, TestFailedException }

import
  scala.{ collection, io, util },
    collection.JavaConversions._,
    io.Source,
    util.matching.Regex

class ModelDumpTests extends FunSuite {

  val compilationFunction: Array[AnyRef] => (JMap[String, AnyRef], JList[AnyRef]) = {
    val engineSource   = resourceText("/tortoise.js")
    val rhinoEngine    = (new Rhino).engine
    rhinoEngine.eval(engineSource)
    rhinoEngine.function("function(s) { return (new BrowserCompiler()).fromNlogo(s); }") andThen {
      compilationObject =>
        val compilation  = compilationObject.asInstanceOf[JMap[String, AnyRef]]
        val widgetString = compilation("widgets").asInstanceOf[ConsString].toString
        val widgets      = rhinoEngine.eval(widgetString).asInstanceOf[JList[AnyRef]]
        (compilation, widgets)
    }
  }

  for (path <- Model.models.map(_.path).distinct) {
    test(s"outputs correct model javascript for ${path}") {
      try {
        val modelContents                = Source.fromFile(path).mkString
        val (compilationResult, widgets) = compilationFunction(Array[Object](modelContents))
        assert(compilationResult("success").asInstanceOf[Boolean])

        val genaratedJs = cleanJsNumbers(compilationResult("result").toString.trim)
        loggingGeneratedJs(genaratedJs, path) {
          assertResult(archivedCompilation(path))(genaratedJs)
        }

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

  private def loggingGeneratedJs(genaratedJs: String, path: String)(runTest: => Unit): Unit =
    try {
      runTest
    } catch {
      case e: TestFailedException =>
        val fw = new FileWriter(s"target/netlogoweb-${path.split('/').last}.js")
        fw.write(genaratedJs, 0, genaratedJs.length)
        fw.close()
        throw e
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
