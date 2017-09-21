// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  java.{ io => jio, util => jutil},
    jio.FileWriter,
    jutil.{ List => JList, Map => JMap }

import
  org.nlogo.tortoise.compiler.Model

import
  jsengine.Rhino

import
  org.mozilla.javascript.{ ConsString, JavaScriptException }

import
  org.scalatest.{ exceptions, FunSuite },
    exceptions.TestFailedException

import org.nlogo.tortoise.tags.SlowTest

import
  scala.{ io, util },
    io.Source,
    util.matching.Regex

class ModelDumpTests extends FunSuite {
  val rhinoEngine    = (new Rhino).engine
  val engineSource   = resourceText("/tortoise-compiler.js")
  rhinoEngine.eval(engineSource)

  val compilationFunction: Array[AnyRef] => (JMap[String, AnyRef], JList[AnyRef]) = {
    rhinoEngine.function("function(s) { return (new BrowserCompiler()).fromNlogo(s); }") andThen {
      compilationObject =>
        import scala.collection.JavaConverters.mapAsScalaMap
        val compilation  = compilationObject.asInstanceOf[JMap[String, AnyRef]]
        val widgetString = mapAsScalaMap(compilation)("widgets").asInstanceOf[ConsString].toString
        val widgets      = rhinoEngine.eval(widgetString).asInstanceOf[JList[AnyRef]]
        (compilation, widgets)
    }
  }

  for (path <- Model.models.map(_.path).distinct) {
    test(s"outputs correct model javascript for ${path}", SlowTest) {
      println(path)
      try {
        import scala.collection.JavaConverters.{ collectionAsScalaIterable, mapAsScalaMap }
        val modelContents                  = Source.fromFile(path).mkString
        val (compilationResultJ, widgetsJ) = compilationFunction(Array[Object](modelContents))
        val compilationResult              = mapAsScalaMap(compilationResultJ)
        val widgets                        = collectionAsScalaIterable(widgetsJ)
        val modelResult                    = compilationResult("model").asInstanceOf[JMap[String,AnyRef]]
        assert(modelResult.get("success").asInstanceOf[Boolean])

        val genaratedJs = cleanJsNumbers(modelResult.get("result").toString.trim)
        loggingGeneratedJs(genaratedJs, path) {
          assertResult(archivedCompilation(path))(genaratedJs)
          ()
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
    // the raw JS contains the NetLogo code, which contains escaped characters, which we have to remove to process
    val unRawJs = rawJs.replace("\\n", " ").replace("\\\"", "\"")
    val trailingZeroNumbers  =
      new Regex("""(\d)\.0(\D)""", "digitBefore", "nonDigitAfter")
    val scientificNotation   =
      new Regex("""(\d)+E(-?)(\d+)""", "coefficient", "sign", "exponent")
    val trailingZerosRemoved = trailingZeroNumbers.replaceAllIn(unRawJs, {
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
