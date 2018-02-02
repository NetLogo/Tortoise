// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import scala.io.Source
import scala.util.Try

import org.nlogo.tortoise.compiler.Model
import org.nlogo.tortoise.tags.SlowTest

class TestModels extends DockingSuite {

  val usesDrawingEvents = Set("Fireworks", "GasLab Free Gas", "Hill Climbing Example", "Many Regions Example", "Tree Simple", "Turtles Circling")
  val importsLambdas    = Set("BeeSmart Hive Finding", "State Machine Example")

  val (nonExportables, exportables) = Model.models.partition((m) => (importsLambdas | usesDrawingEvents)(m.name))

  for (model <- nonExportables) {
    test(model.name, SlowTest) { implicit fixture =>
      fixture.open(model.path, model.dimensions)
      fixture.testCommand(model.setup)
      for(_ <- 1 to model.repetitions)
        fixture.testCommand(model.go)
      model.metrics.foreach(fixture.compare)
    }
  }

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

      val outBase = if (inPlatform == Web) FromWeb else FromDesktop

      fixture.testCommand(s"""import-world "${csv(inPlatform, Original)}" """)
      fixture.testCommand(s"""export-world (ifelse-value netlogo-web? [ "${csv(Web, outBase)}"] [ "${csv(Desktop, outBase)}" ])""")

      compareExports(readFile(csv(Desktop, outBase)), readFile(csv(Web, outBase)), outBase.toString)

      if (model.repetitions > 0)
        fixture.testCommand(model.go) // Just to be sure that there were no errors or anything on import

      model.metrics.foreach(fixture.compare)

    }

    test(s"export-world - ${name}", SlowTest) { implicit fixture =>

      fixture.open(model.path, model.dimensions)
      fixture.testCommand(model.setup)
      for (_ <- 1 to model.repetitions)
        fixture.testCommand(model.go)

      model.metrics.foreach(fixture.compare)

      fixture.testCommand(s"""export-world (ifelse-value netlogo-web? [ "${csv(Web, Original)}" ] [ "${csv(Desktop, Original)}" ])""")

      compareExports(readFile(csv(Desktop, Original)), readFile(csv(Web, Original)), "First pass")

      testReimport(Desktop, fixture)
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
