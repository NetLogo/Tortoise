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

  for (model <- Model.models) {
    test(s"compiled model javascript tests for ${model.name}", SlowTest) {
      println(model.path)
      try {
        import scala.collection.JavaConverters.{ collectionAsScalaIterable, mapAsScalaMap }
        val modelContents                  = Source.fromFile(model.path).mkString
        val (compilationResultJ, widgetsJ) = compilationFunction(Array[Object](modelContents))
        val compilationResult              = mapAsScalaMap(compilationResultJ)
        val widgets                        = collectionAsScalaIterable(widgetsJ)
        val modelResult                    = compilationResult("model").asInstanceOf[JMap[String,AnyRef]]
        assert(modelResult.get("success").asInstanceOf[Boolean])

        val generatedJs = cleanJsNumbers(modelResult.get("result").toString.trim)
        loggingGeneratedJs(generatedJs, model.filename) {
          assertResult(
            archivedCompilation(model.filename), "Compiled model Javascript changed from prior dump"
          )(generatedJs)
          ()
        }

        assert(widgets.nonEmpty)
        widgets.foreach {
          widget =>
            val widgetMap = widget.asInstanceOf[JMap[String, AnyRef]]
            assert(widgetMap.get("type").isInstanceOf[String])
        }

        assert(compilationResult("code").toString.contains("to"))

        if (! model.path.contains("benchmark"))
          assert(compilationResult("info").toString.contains("WHAT IS IT"))
      } catch {
        case e: JavaScriptException =>
          println(e.details)
          throw e
      }
    }
  }

  private def archivedCompilation(modelName: String) = {
    cleanJsNumbers(resourceText(s"/dumps/$modelName.js").trim)
  }

  private def loggingGeneratedJs(generatedJs: String, filename: String)(runTest: => Unit): Unit =
    try {
      runTest
    } catch {
      case e: TestFailedException =>
        val failPath = s"target/${filename}.js"
        val fw = new FileWriter(failPath)
        fw.write(generatedJs, 0, generatedJs.length)
        fw.close()
        println(s"Failed test, actual JS written to $failPath")
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
