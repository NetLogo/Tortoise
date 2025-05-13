// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  java.{ io => jio, util => jutil},
    jio.FileWriter,
    jutil.{ Map => JMap }

import
  org.nlogo.tortoise.compiler.Model

import jsengine.GraalJS

import org.graalvm.polyglot.Value

import scala.jdk.CollectionConverters._

import org.scalatest.exceptions.TestFailedException
import org.scalatest.funsuite.AnyFunSuite

import org.nlogo.tortoise.tags.SlowTest

import
  scala.{ io, util },
    io.Source,
    util.matching.Regex

class ModelDumpTests extends AnyFunSuite {

  def graalValueToSequence(value: Value): Seq[Value] = {
    0L.to(value.getArraySize - 1).map( value.getArrayElement )
  }

  val engine       = new GraalJS()
  val engineSource = resourceText("/tortoise-compiler.js")
  engine.evalRaw(engineSource)

  val compilationFunction: String => (JMap[String, AnyRef], Seq[JMap[String, AnyRef]]) = modelCode => {
    engine.evalRaw("__bc = new BrowserCompiler()")
    engine.put("__modelCode", modelCode)
    val value = engine.evalRaw("(function() { __compilation = __bc.fromNlogo(__modelCode); return __compilation; })()")
    val compilation = value.as(classOf[JMap[String, AnyRef]])
    val widgetString = compilation.asScala("widgets").toString
    val widgets      = graalValueToSequence(engine.evalRaw(widgetString)).map( (w) => w.as(classOf[JMap[String, AnyRef]]) )
    (compilation, widgets)
  }

  case class SimpleModel(path: String, filename: String)

  val uniqueModels = Model.models.map( (m) => new SimpleModel(m.path, m.filename) ).toSet
  for (model <- uniqueModels) {
    test(s"compiled model javascript tests for ${model.filename}", SlowTest) {
      println(model.path)
      try {
        val modelContents                 = Source.fromFile(model.path).mkString
        val (compilationResultJ, widgets) = compilationFunction(modelContents)
        val compilationResult             = compilationResultJ.asScala
        val modelResult                   = compilationResult("model").asInstanceOf[JMap[String,AnyRef]]
        assert(modelResult.get("success").asInstanceOf[Boolean])

        val generatedJs = cleanJsNumbers(modelResult.get("result").toString.trim)
        loggingGeneratedJs(generatedJs, model.filename) {
          assertResult(
            archivedCompilation(model.filename), "Compiled model Javascript changed from prior dump"
          )(generatedJs)
          ()
        }

        assert(widgets.nonEmpty)
        widgets.foreach { widget => assert(widget.get("type").isInstanceOf[String]) }

        assert(compilationResult("code").toString.contains("to"))

        if (!model.path.contains("benchmark") && !model.path.contains("test/models/"))
          assert(compilationResult("info").toString.contains("WHAT IS IT"))
      } catch {
        case e: Exception =>
          println(e)
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
        println(s"Source dump changed, actual JS written to $failPath")
        throw e
      case e: Exception =>
        val failPath = s"target/${filename}.js"
        val fw = new FileWriter(failPath)
        fw.write(generatedJs, 0, generatedJs.length)
        fw.close()
        println(s"Runtime exception, reference JS written to $failPath")
        throw e

    }

  // scala.js `toString` for numeric values gives different results than jvm scala.
  // We need do a little cleanup to match the outputs - 2/17/15 RG
  private def cleanJsNumbers(rawJs: String): String = {
    // the raw JS contains the NetLogo code, which contains escaped characters, which we have to remove to process
    val unRawJs = rawJs.replace("\\n", " ")
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
