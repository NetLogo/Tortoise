// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import java.time.{ Duration, Instant }

import scala.io.Source
import scala.util.Try

import org.nlogo.tortoise.compiler.Model
import org.nlogo.tortoise.tags.SlowTest

class TestModels extends DockingSuite {

  val usesDrawingEvents = Set("Fireworks", "GasLab Free Gas", "Hill Climbing Example", "Many Regions Example", "Tree Simple", "Turtles Circling")
  val importsLambdas    = Set("BeeSmart Hive Finding", "State Machine Example")

  val (nonExportables, exportables) = Model.models.partition((m) => (importsLambdas | usesDrawingEvents)(m.name))

  for (model <- nonExportables) {
    val testName = s"0: no export - ${model.name}"
    test(testName, SlowTest) { implicit fixture =>
      engine.reset

      println(testName)

      fixture.open(model.path, model.dimensions, true)
      fixture.testCommand(model.setup)
      println(s"  running ${model.repetitions} reps: ")
      print("  ")
      for(i <- 1 to model.repetitions) {
        print(if (i % 10 == 0) "|" else ".")
        fixture.testCommand(model.go)
      }
      println()
      model.metrics.foreach(fixture.compare)
    }
  }

  var count = 0

  for (model <- exportables) {

    val name    = model.name
    val tempDir = System.getProperty("java.io.tmpdir")

    sealed trait Platform
    case object Desktop extends Platform
    case object Web     extends Platform

    sealed trait Base
    case object Original    extends Base { override def toString = "original"     }
    case object FromDesktop extends Base { override def toString = "from-desktop" }
    case object FromWeb     extends Base { override def toString = "from-web"     }

    def readFile(filename: String): String =
      Try(Source.fromFile(filename).mkString).getOrElse(throw new Exception(s"Could not find $filename")).trim

    def csv(platform: Platform, base: Base): String =
      s"$tempDir/NL${if (platform == Desktop) "D" else "W"}_${base}_$name.csv"

    def testReimport(inPlatform: Platform, fixture: DockingFixture): Unit = {
      val start = Instant.now()

      val outBase = if (inPlatform == Web) FromWeb else FromDesktop

      fixture.testCommand(s"""import-world "${csv(inPlatform, Original)}" """)
      val importDuration = Duration.between(start, Instant.now())
      println(s"    import time: ${importDuration.toMillis}")

      fixture.testCommand(s"""export-world (ifelse-value netlogo-web? [ "${csv(Web, outBase)}"] [ "${csv(Desktop, outBase)}" ])""")
      val exportDuration = Duration.between(start, Instant.now())
      println(s"    export time: ${exportDuration.toMillis}")

      compareExports(readFile(csv(Desktop, outBase)), readFile(csv(Web, outBase)), outBase.toString)
      val compareDuration = Duration.between(start, Instant.now())
      println(s"    compare time: ${compareDuration.toMillis}")

      if (model.repetitions > 0)
        fixture.testCommand(model.go) // Just to be sure that there were no errors or anything on import

      model.metrics.foreach(fixture.compare)
      val cleanupDuration = Duration.between(start, Instant.now())
      println(s"    metrics time: ${cleanupDuration.toMillis}")
    }

    val chunk = 1 + Integer.valueOf(4 * count / exportables.size)
    count = count + 1
    val testName = s"$chunk: export-world - ${name}"
    test(testName, SlowTest) { implicit fixture =>
      engine.reset

      println(testName)

      fixture.open(model.path, model.dimensions, true)
      fixture.testCommand(model.setup)
      println(s"  running ${model.repetitions} reps: ")
      print("  ")
      for (i <- 1 to model.repetitions) {
        print(if (i % 10 == 0) "|" else ".")
        fixture.testCommand(model.go)
      }
      println()

      println("  checking metrics")
      model.metrics.foreach(fixture.compare)

      println("  running export")
      fixture.testCommand(s"""export-world (ifelse-value netlogo-web? [ "${csv(Web, Original)}" ] [ "${csv(Desktop, Original)}" ])""")

      println("  comparing exports")
      compareExports(readFile(csv(Desktop, Original)), readFile(csv(Web, Original)), "First pass")

      println("  running desktop imports")
      testReimport(Desktop, fixture)
      println("  running web imports")
      testReimport(Web,     fixture)
    }

  }

  private def compareExports(exportResultNLD: String, exportResultNLW: String, msgPrefix: String): Unit = {

    // Trim off plot bounds --JAB (1/3/18)
    val transformPlots =
      (str: String) => str.replaceAll("""("x min","x max","y min","y max",[^\n]*\n)(?:"[^"]*",){4}""", "$1")

    val ignore = (_: String) => ""

    val transformers: Map[String, (String) => String] =
      Map( "RANDOM STATE" -> identity _
         , "GLOBALS"      -> identity _
         , "TURTLES"      -> identity _
         , "PATCHES"      -> identity _
         , "LINKS"        -> identity _
         , "DRAWING"      -> ignore
         , "PLOTS"        -> transformPlots
         , "OUTPUT"       -> identity _
         , "EXTENSIONS"   -> ignore
         )

    val toChunks = (text: String) => {
      val indexPairs   = transformers.keys.flatMap((label) => ("(?m)^\"" + label + "\"$").r.findFirstMatchIn(text).map(x => (label, x.start)).toSeq)
      val sorted       = indexPairs.toSeq.sortBy(_._2)
      val contentPairs =
        for (i <- 0 until sorted.length) yield {
          val (key, index) = sorted(i)
          val content =
            if (i != (sorted.length - 1))
              text.substring(index, sorted(i + 1)._2).trim
            else
              text.substring(index).trim
          val transformer = transformers(key)
          (key, transformer(content))
        }
      contentPairs.toMap
    }

    val chunksD = toChunks(exportResultNLD)
    val chunksW = toChunks(exportResultNLW)

    transformers.keys.foreach {
      key =>
        for (d <- chunksD.get(key); w <- chunksW.get(key)) {
          assertResult(d, s"$msgPrefix: $key did not export correctly")(w)
        }
    }

    ()

  }

}
