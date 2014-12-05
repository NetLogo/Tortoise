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
  override val freebies = Map[String, String](
    // obscure
    "Lists::Sort2" -> "sorting heterogeneous lists doesn't work",
    "Lists::Sort3" -> "sorting heterogeneous lists doesn't work",
    "Lists::Sort5" -> "sorting heterogeneous lists doesn't work",
    // perhaps never to be supported
    "RunResult::RunResult1" -> "run/runresult on strings not supported",
    "RunResult::RunResult2" -> "run/runresult on strings not supported",
    "RunResult::RunResult3" -> "run/runresult on strings not supported"
  )
}

class TestCommands extends TCommands with TortoiseFinder {
  override val freebies = Map[String, String](
    // requires features
    "Random::RandomNOfIsFairForAList" -> "`n-of` not implemented for lists",
    // requires handling of non-local exit (see in JVM NetLogo: `NonLocalExit`, `_report`, `_foreach`, `_run`)
    "Stop::ReportFromForeach" -> "no non-local exit from foreach",
    // Significant: Requires the optimizer to be turned on
    "Interaction::Interaction3b1"                                             -> "ASSUMES OPTIMIZATION: empty init block",
    "Interaction::Interaction3b2"                                             -> "ASSUMES OPTIMIZATION: empty init block",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksFrom" -> "ASSUMES OPTIMIZATION: empty init block",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksTo"   -> "ASSUMES OPTIMIZATION: empty init block",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksWith" -> "ASSUMES OPTIMIZATION: empty init block",
    "TurtlesHere::TurtlesHereCheckOrder1"                                     -> "ASSUMES OPTIMIZATION: empty init block",
    "TurtlesHere::TurtlesHereCheckOrder2"                                     -> "ASSUMES OPTIMIZATION: empty init block",
    "TurtlesHere::TurtlesHereCheckOrder3"                                     -> "ASSUMES OPTIMIZATION: empty init block",
    "TurtlesHere::TurtlesHereCheckOrder4"                                     -> "ASSUMES OPTIMIZATION: empty init block",
    // requires Tortoise compiler changes
    "CommandTasks::*ToString3" -> "command task string representation doesn't match",
    "CommandTasks::*ToString4" -> "command task string representation doesn't match",
    "CommandTasks::*ToString5" -> "command task string representation doesn't match",
    "CommandTasks::*ToString6" -> "command task string representation doesn't match",
    // needs 'headless' compiler changes
    "ReporterTasks::CloseOverLocal1" -> "Creates a function named 'const', which is a reserved keyword in JavaScript",
    "CommandTasks::command-task-body-gets-agent-type-check" -> "Necessary check must be moved up into the front-end of the compiler",
    "Errors::task-variable-not-in-task"                     -> "Necessary check must be moved up into the front-end of the compiler",
    "Let::LetOfVarToItself1"                                -> "Necessary check must be moved up into the front-end of the compiler",
    "Let::LetOfVarToItself2"                                -> "Necessary check must be moved up into the front-end of the compiler",
    "Let::LetOfVarToItself3"                                -> "Necessary check must be moved up into the front-end of the compiler",
    "Let::LetOfVarToItselfInsideAsk"                        -> "Necessary check must be moved up into the front-end of the compiler",
    "TypeChecking::SetVariable"                             -> "Necessary check must be moved up into the front-end of the compiler",
    // perhaps never to be supported
    "ControlStructures::Run1"                  -> "run/runresult on strings not supported",
    "ControlStructures::Run2"                  -> "run/runresult on strings not supported",
    "ControlStructures::Run3"                  -> "run/runresult on strings not supported",
    "ControlStructures::Run4"                  -> "run/runresult on strings not supported",
    "ControlStructures::Run5"                  -> "run/runresult on strings not supported",
    "ControlStructures::Run6"                  -> "run/runresult on strings not supported",
    "ControlStructures::Run7"                  -> "run/runresult on strings not supported",
    "ControlStructures::Run8"                  -> "run/runresult on strings not supported",
    "Run::LuisIzquierdoRun1"                   -> "run/runresult on strings not supported",
    "Run::LuisIzquierdoRun2"                   -> "run/runresult on strings not supported",
    "Run::LuisIzquierdoRunResult1"             -> "run/runresult on strings not supported",
    "Run::LuisIzquierdoRunResult2"             -> "run/runresult on strings not supported",
    "Run::run-evaluate-string-input-only-once" -> "run/runresult on strings not supported"
  )
}

