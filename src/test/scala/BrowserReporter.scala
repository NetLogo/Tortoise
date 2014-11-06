// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  java.io.{ File, PrintWriter }

import
  scala.collection.mutable.ArrayBuffer

trait BrowserReporter {
  protected def writeReportDocument(filename: String, failedTestReports: Map[String, Seq[String]]): Unit = {
    val str = s"""|<!DOCTYPE html>
                  |<html>
                  |  <head><title>Tortoise Test Failures</title></head>
                  |  <body>
                  |    ${failedSuites(failedTestReports).mkString("\n")}
                  |  </body>
                  |</html>""".stripMargin
    writeToFile(filename, str)
  }

  protected def writeFixtureDocument(filename: String, fixture: ArrayBuffer[String]): Unit = {
    val str = s"""|<!DOCTYPE html>
                  |<html>
                  |  <head>
                  |    <script type="text/javascript" src="../classes/js/tortoise-engine.js"></script>
                  |    <script type="text/javascript">
                  |      ${fixture.mkString("\n")}
                  |    </script>
                  |  </head>
                  |</html>""".stripMargin
    writeToFile(filename, str)
  }

  private def writeToFile(name: String, contents: String): Unit = {
    val parent = new File("./target/last-test-run-reports")
    val file   = new File(parent, genFileName(name))
    parent.mkdirs()

    val fileWriter = new PrintWriter(file)
    fileWriter.write(contents)
    fileWriter.close()
  }

  private def failedSuites(suite: Map[String, Seq[String]]): Iterable[String] =
    suite.map {
      case (suiteName: String, testNames: Seq[String]) =>
        s"""|<h3>$suiteName</h3>
            |<ul>${reportElements(testNames).mkString("\n")}</ul>""".stripMargin
    }

  private def reportElements(failedTestNames: Seq[String]): Seq[String] =
    failedTestNames.map(s => s"""<li><a href="${genFileName(s)}">$s</a></li>""")


  private def genFileName(s: String): String =
    s.replaceAll("::", "_")
      .replaceAll("\\s+", "-")
      .replaceAll("\\(", "")
      .replaceAll("\\)", "") ++ ".html"

}
