// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  java.io.{ File, PrintWriter }

import
  scala.collection.mutable.ArrayBuffer

import
  scalatags.Text.TypedTag

trait BrowserReporter {

  import scalatags.Text.all.raw
  import scalatags.Text.attrs.{ href, src, `type` }
  import scalatags.Text.implicits.{ stringAttr, stringFrag }
  import scalatags.Text.tags.{ a, body, div, h3, head, html, li, script, ul }
  import scalatags.Text.tags2.title

  private type HTML = TypedTag[String]

  protected def writeReportDocument(filename: String, failedTestReports: Map[String, Seq[String]]): Unit =
    writeToFile(filename) (
      html(
        head(title("Tortoise Test Failures")),
        body(failedSuites(failedTestReports): _*)
      )
    )

  protected def writeFixtureDocument(filename: String, fixture: ArrayBuffer[String]): Unit =
    writeToFile(filename) (
      html(head(
        script(`type` :=  "text/javascript", src := "../classes/js/tortoise-engine.js"),
        script(`type` :=  "text/javascript", raw(fixture.mkString("\n")))
      ))
    )

  private def writeToFile(name: String)(html: HTML): Unit = {

    val parent = new File("./target/last-test-run-reports")
    val file   = new File(parent, genFileName(name))
    parent.mkdirs()

    val fileWriter = new PrintWriter(file)
    fileWriter.write(html.toString)
    fileWriter.close()

  }

  private def failedSuites(suite: Map[String, Seq[String]]): Seq[HTML] =
    suite.map {
      case (suiteName: String, testNames: Seq[String]) =>
        div(
          h3(suiteName),
          ul(reportElements(testNames): _*)
        )
    }.toSeq

  private def reportElements(failedTestNames: Seq[String]): Seq[HTML] =
    failedTestNames.map(s => li(a(href := genFileName(s), s)))

  private def genFileName(s: String): String =
    s.replaceAll("::", "_")
      .replaceAll("\\s+", "-")
      .replaceAll("\\(", "")
      .replaceAll("\\)", "") ++ ".html"

}
