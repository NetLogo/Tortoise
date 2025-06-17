// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import java.io.{ ByteArrayInputStream, CharArrayWriter, InputStreamReader, PrintWriter }
import java.time.{ Duration, Instant }

import org.nlogo.tortoise.compiler.Model
import org.nlogo.tortoise.tags.SlowTest

class TestModels extends DockingSuite {

  val chunksCount = 9

  val importsLambdas = Set("BeeSmart Hive Finding", "State Machine Example")

  val (nonExportables, exportables) = Model.models.partition((m) => (importsLambdas)(m.name))

  for (model <- nonExportables) {
    val testName = s"0: no export - ${model.name}"
    test(testName, SlowTest) { implicit fixture =>
      engine.reset()

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

    val name = model.name

    def exportWorld(fixture: DockingFixture): (String, String) = {

      val caw = new CharArrayWriter
      fixture.workspace.exportWorld(new PrintWriter(caw))
      val desktopCSV = caw.toString

      val webCSV = fixture.evalJS("ImportExportPrims.exportWorldRaw()").asInstanceOf[String]

      (desktopCSV, webCSV)

    }

    def testReimport(platformName: String, fixture: DockingFixture, originalCSV: String): Unit = {

      val start = Instant.now()

      fixture.runDocked {
        _.importWorld(new InputStreamReader(new ByteArrayInputStream(originalCSV.getBytes)))
      } {
        (engine) =>
          engine.put("__nonsenseWorldCSV", originalCSV)
          engine.run("ImportExportPrims.importWorldRaw(__nonsenseWorldCSV)")
      }

      val importDuration = Duration.between(start, Instant.now())
      println(s"    import time: ${importDuration.toMillis}")
      val (desktopCSV, webCSV) = exportWorld(fixture)
      val exportDuration = Duration.between(start, Instant.now())
      println(s"    export time: ${exportDuration.toMillis}")

      compareExports(desktopCSV, webCSV, platformName)
      val compareDuration = Duration.between(start, Instant.now())
      println(s"    compare time: ${compareDuration.toMillis}")

      if (model.repetitions > 0)
        fixture.testCommand(model.go) // Just to be sure that there were no errors or anything on import

      model.metrics.foreach(fixture.compare)
      val cleanupDuration = Duration.between(start, Instant.now())
      println(s"    metrics time: ${cleanupDuration.toMillis}")

    }

    val chunk = 1 + Integer.valueOf(chunksCount * count / exportables.size)
    count = count + 1
    val testName = s"$chunk: export-world - ${name}"
    test(testName, SlowTest) { implicit fixture =>
      engine.reset()

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

      val (desktopOriginalCSV, webOriginalCSV) = exportWorld(fixture)

      println("  comparing exports")
      compareExports(desktopOriginalCSV, webOriginalCSV, "First pass")

      println("  running desktop imports")
      testReimport("from-desktop", fixture, desktopOriginalCSV)

      println("  running web imports")
      testReimport("from-web", fixture, webOriginalCSV)

    }

  }

  private def compareExports(exportResultNLD: String, exportResultNLW: String, msgPrefix: String): Unit = {

    // Just check the patch size (not the image base64) --JAB (2/12/19)
    val transformDrawing =
      (str: String) => (str: scala.collection.immutable.StringOps).linesIterator.toSeq.init.mkString("\n")

    // Trim off plot bounds --JAB (1/3/18)
    val transformPlots =
      (str: String) => str.replaceAll("""("x min","x max","y min","y max",[^\n]*\n)(?:"[^"]*",){4}""", "$1")

    val ignore = (_: String) => ""

    val transformers: Map[String, (String) => String] =
      val strIdent = (s: String) => identity(s)
      Map( "RANDOM STATE" -> strIdent
         , "GLOBALS"      -> strIdent
         , "TURTLES"      -> strIdent
         , "PATCHES"      -> strIdent
         , "LINKS"        -> strIdent
         , "DRAWING"      -> transformDrawing
         , "PLOTS"        -> transformPlots
         , "OUTPUT"       -> strIdent
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
