// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.scalatest.{ Tag, BeforeAndAfterAll, exceptions },
    exceptions.TestPendingException

import
  org.nlogo.headless.test.{ AbstractFixture, Command, Finder, LanguageTest, NormalMode, CommandTests, TestMode, ReporterTests }

import
  org.nlogo.tortoise.tags.{ LanguageTest => TortoiseLanguageTag}

private[tortoise] trait TortoiseFinder extends Finder with BeforeAndAfterAll with BrowserReporter with TestLogger {

  protected def freebies: Map[String, String]

  override def shouldRun(t: LanguageTest, mode: TestMode) =
    mode == NormalMode && super.shouldRun(t, mode)

  def genFixture(name: String): AbstractFixture = new TortoiseFixture(name, engine, notImplemented) {
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

  override protected def test(name: String, otherTags: Tag*)
                             (testFun: => Any)
                             (implicit pos: org.scalactic.source.Position): Unit =
    super.test(name, (Seq(TortoiseLanguageTag) ++ otherTags):_*)(testFun)(pos)

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

class TestReporters extends ReporterTests with TortoiseFinder {
  override val freebies = Map(
    "Version::Version_2D" -> "Assumes JVM NetLogo version numbers"
  )
}

class TestCommands extends CommandTests with TortoiseFinder {
  import Freebies._
  override val freebies = Map[String, String](
    // requires handling of non-local exit (see in JVM NetLogo: `NonLocalExit`, `_report`, `_foreach`, `_run`)
    "Every::EveryLosesScope"  -> "NetLogo Web does not support distinct jobs"
  ) ++ incErrorDetectCommands ++ preferExtensionsCommands ++ headlessCommands ++ awaitingFixCommands
}

private[tortoise] object Freebies {

  def incErrorDetectCommands   = asFreebieMap(  incErrorDetectCommandNames,   incErrorDetectStr)
  def headlessCommands         = asFreebieMap(        headlessCommandNames,  headlessCommandStr)
  def preferExtensionsCommands = asFreebieMap(preferExtensionsCommandNames, preferExtensionsStr)
  def awaitingFixCommands      = asFreebieMap(     awaitingFixCommandNames,      awaitingFixStr)

  private def asFreebieMap(names: Seq[String], msg: String) = names.map(_ -> msg).toMap

  private val incErrorDetectStr = "Tortoise error detection and reporting not complete"
  private val incErrorDetectCommandNames = Seq(
    "Ask::AskAllTurtles",
    "Ask::AskAllPatches",
    "Breeds::SetBreedToNonBreed",
    "ComparingAgents::ComparingLinks",
    "DeadTurtles::DeadTurtles1",
    "DeadTurtles::DeadTurtles5",
    "DeadTurtles::DeadTurtles6",
    "Face::FaceAgentset",
    "Interaction::Interaction5",
    "Interaction::PatchTriesTurtleReporter",
    "Links::LinksNotAllowed",
    "Links::LinkNotAllowed_2D",
    "Links::LinkCreationTypeChecking_2D",
    "MoveTo::MoveTo_2D",
    "Random::OneOfWithAgentSets",
    "Sort::SortByBadReporter",
    "TypeChecking::AgentClassChecking1",
    "TypeChecking::AgentClassChecking3a",
    "TypeChecking::AgentClassChecking3b",
    "TypeChecking::RunRetainsAgentContext"
  )

  private val headlessCommandStr = "This test relies of behavior that only makes sense in Headless"
  private val headlessCommandNames = Seq(
    "UserPrimitives::UserReporters_Headless"
  )

  private val preferExtensionsStr = "Supplanted by extension-based tests (e.g. Fetch, Import-A)"
  private val preferExtensionsCommandNames =
    Seq(
      "ImportPatchesAndDrawing::ImportPcolors_2D"
    , "ImportPatchesAndDrawing::ImportPcolorsTopologyTest_2D"
    , "ImportWorld::RoundTripWithUTF8Chars"
    )

  private val awaitingFixStr = "Known issue waiting on a proper fix or implementation"
  private val awaitingFixCommandNames =
    Seq(
      "Timer::Timer1"
    )

}
