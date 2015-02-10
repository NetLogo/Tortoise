// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.scalatest.{ BeforeAndAfterAll, exceptions },
    exceptions.TestPendingException

import
  org.nlogo.headless.lang.{ AbstractFixture, Command, Finder, LanguageTest, NormalMode, TestCommands => TCommands, TestMode, TestReporters => TReporters }

private[tortoise] trait TortoiseFinder extends Finder with BeforeAndAfterAll with BrowserReporter with TestLogger {

  protected def freebies: Map[String, String]

  override def shouldRun(t: LanguageTest, mode: TestMode) =
    mode == NormalMode && super.shouldRun(t, mode)

  def genFixture(name: String): AbstractFixture = new TortoiseFixture(name, nashorn, notImplemented) {
    override def checkResult(mode: TestMode, reporter: String, expectedResult: String, actualResult: AnyRef): Unit = {
      annotatePrevious(s"""NetLogo reporter for: $reporter
                          |expected result: $expectedResult
                          |actualResult: $actualResult""".stripMargin)
      super.checkResult(mode, reporter, expectedResult, actualResult)
    }

    override def runCommand(command: Command, mode: TestMode): Unit = {
      annotate(s"NetLogo generated code for: ${command.command}")
      super.runCommand(command, mode)
    }
  }

  override def runTest(t: LanguageTest, mode: TestMode): Unit =
    loggingFailures(t.suiteName, t.testName, { super.runTest(t, mode) })

  override def withFixture[T](name: String)(body: (AbstractFixture) => T): T =
    freebies.get(name.stripSuffix(" (NormalMode)")) match {
      case None =>
        body(genFixture(name))
      case Some(excuse) =>
        try body(genFixture(name))
        catch {
          case _: TestPendingException => // ignore; we'll hit the fail() below
          case ex: Exception =>
            val message =
              if (excuse.contains("ASSUMES OPTIMIZATION"))
                excuse
              else
                s"$ex: LAME EXCUSE: $excuse"
            notImplemented(message)
        }
        fail(s"LAME EXCUSE WASN'T NEEDED: $excuse")
    }

  protected def notImplemented(s: String): Nothing = {
    info(s)
    throw new TestPendingException
  }

}

class TestReporters extends TReporters with TortoiseFinder {
  import Freebies._
  override val freebies = sortingHeteroListReporters ++ evalNotSupportedReporters
}

class TestCommands extends TCommands with TortoiseFinder {
  import Freebies._
  override val freebies = Map[String, String](
    // requires handling of non-local exit (see in JVM NetLogo: `NonLocalExit`, `_report`, `_foreach`, `_run`)
    "Stop::ReportFromForeach" -> "no non-local exit from foreach"
  ) ++ emptyInitBlockCommands ++ evalNotSupportedCommands ++ cmdTaskRepMismatchCommands
}

private[tortoise] object Freebies {

  def emptyInitBlockCommands     = asFreebieMap(emptyInitBlockCommandNames,     emptyInitBlockStr)
  def evalNotSupportedCommands   = asFreebieMap(evalNotSupportedCommandNames,   evalNotSupportedStr)
  def cmdTaskRepMismatchCommands = asFreebieMap(cmdTaskRepMismatchCommandNames, cmdTaskRepMismatchStr)

  def evalNotSupportedReporters  = asFreebieMap(evalNotSupportedReporterNames,  evalNotSupportedStr)
  def sortingHeteroListReporters = asFreebieMap(sortingHeteroListReporterNames, sortingHeteroListStr)

  private def asFreebieMap(names: Seq[String], msg: String) = names.map(_ -> msg).toMap

  // Significant: Requires the optimizer to be turned on
  private val emptyInitBlockStr = "ASSUMES OPTIMIZATION: empty init block"
  private val emptyInitBlockCommandNames = Seq(
    "Death::TurtleDiesWhileIteratingOverItsSet",
    "Interaction::Interaction3b1",
    "Interaction::Interaction3b2",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksFrom",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksTo",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksWith",
    "TurtlesHere::TurtlesHereCheckOrder1",
    "TurtlesHere::TurtlesHereCheckOrder2",
    "TurtlesHere::TurtlesHereCheckOrder3",
    "TurtlesHere::TurtlesHereCheckOrder4"
  )

  // perhaps never to be supported
  private val evalNotSupportedStr = "run/runresult on strings not supported"
  private val evalNotSupportedReporterNames = Seq(
    "RunResult::RunResult1",
    "RunResult::RunResult2",
    "RunResult::RunResult3"
  )
  private val evalNotSupportedCommandNames = Seq(
    "ControlStructures::Run1",
    "ControlStructures::Run2",
    "ControlStructures::Run3",
    "ControlStructures::Run4",
    "ControlStructures::Run5",
    "ControlStructures::Run6",
    "ControlStructures::Run7",
    "ControlStructures::Run8",
    "Run::LuisIzquierdoRun1",
    "Run::LuisIzquierdoRun2",
    "Run::LuisIzquierdoRunResult1",
    "Run::LuisIzquierdoRunResult2",
    "Run::run-evaluate-string-input-only-once"
  )

  // requires Tortoise compiler changes
  private val cmdTaskRepMismatchStr = "command task string representation doesn't match"
  private val cmdTaskRepMismatchCommandNames = Seq(
    "CommandTasks::*ToString3",
    "CommandTasks::*ToString4",
    "CommandTasks::*ToString5",
    "CommandTasks::*ToString6"
  )

  // obscure
  private val sortingHeteroListStr = "sorting heterogeneous lists doesn't work"
  private val sortingHeteroListReporterNames = Seq(
    "Lists::Sort2",
    "Lists::Sort3",
    "Lists::Sort5"
  )

}

