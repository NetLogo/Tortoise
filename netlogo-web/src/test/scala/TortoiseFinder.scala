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
  import Freebies._
  override val freebies = Map(
    "Version::Version_2D" -> "Assumes JVM NetLogo version numbers"
  ) ++ incErrorDetectReporters
}

class TestCommands extends CommandTests with TortoiseFinder {
  import Freebies._
  override val freebies = Map[String, String](
    // requires handling of non-local exit (see in JVM NetLogo: `NonLocalExit`, `_report`, `_foreach`, `_run`)
    "Every::EveryLosesScope"  -> "NetLogo Web does not support distinct jobs"
  ) ++ incErrorDetectCommands ++ preferExtensionsCommands ++ lameCommands ++ awaitingFixCommands
}

private[tortoise] object Freebies {

  def incErrorDetectCommands     = asFreebieMap(  incErrorDetectCommandNames, incErrorDetectStr)
  def lameCommands               = asFreebieMap(            lameCommandNames, lameCommandStr)
  def preferExtensionsCommands   = asFreebieMap(preferExtensionsCommandNames, preferExtensionsStr)
  def awaitingFixCommands        = asFreebieMap(            awaitingFixNames, awaitingFixStr)

  def incErrorDetectReporters    = asFreebieMap(incErrorDetectReporterNames, incErrorDetectStr)

  private def asFreebieMap(names: Seq[String], msg: String) = names.map(_ -> msg).toMap

  private val incErrorDetectStr = "Tortoise error detection and reporting not complete"
  private val incErrorDetectReporterNames = Seq(
    "Lists::Lput5",
    "Lists::ListFirst1",
    "Lists::ListReplaceIt2",
    "Lists::ReduceEmpty",
    "Lists::ListItem1",
    "Lists::ListItem2",
    "Lists::ListLast1",
    "Lists::ListLength3",
    "Lists::ListRemoveItem4",
    "Lists::ListRemoveItem5",
    "Lists::ListRemoveItem6",
    "Lists::ListReplItem2",
    "Lists::ListReplItem3",
    "Lists::ListButFirst3",
    "Lists::ListButLast3",
    "Lists::ListSubList6",
    "Lists::ListSubList8",
    "Lists::ListSubList9",
    "Lists::ListSubList12",
    "Lists::SortBy5",
    "RunResult::RunResult4",
    "RunResult::RunResult5",
    "Strings::StrButFirst2",
    "Strings::StrButLast2",
    "Strings::StrRemoveItem4",
    "Strings::StrRemoveItem5",
    "Strings::StrRemoveItem6"
  )
  private val incErrorDetectCommandNames = Seq(
    "Agentsets::Agentsets3",
    "Agentsets::Agentsets4_2D",
    // The Iterator.withBoolCheck() adds a very rudimentary type check which
    // addresses some Agentsets::OtherWithOptsShowCorrectErrorName failures.
    // But in core/headless they use differing agent sets for arrays and trees.
    // This causes the Agentsets::OtherWithOptsShowCorrectErrorName test
    // to fail for being "out of order".  Not much we can do about that, short
    // of implementing an agent set tree in Tortoise.  Just noting it here for
    // reference if someone tries tracking down those differences.
    // -JMB July 2017.
    "Agentsets::OtherWithOptsShowCorrectErrorName",
    "AgentsetBuilding::TurtleSet_2D",
    "AgentsetBuilding::PatchSet2_2D",
    "AgentsetBuilding::LinkSet_2D",
    "AnyAll::All5_2D",
    "Ask::AskAllTurtles",
    "Ask::AskAllPatches",
    "Breeds::SetBreedToNonBreed",
    "CommandLambda::*WrongTypeOfTask1",
    "CommandLambda::WrongTypeOfTask2",
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
    "Lists::RemoveBug997FirstArgMustBeStringIfSecondArgIsString",
    "Lists::FilterTypeError",
    "MoveTo::MoveTo_2D",
    "Patch::SetVariableRuntime_2D",
    "RGB::PatchesRGBColor_2D",
    "RGB::TurtlesRGBColor",
    "RGB::LinksRGBColor",
    "Random::RandomNOfWithLists",
    "Random::OneOfWithAgentSets",
    "Sort::SortByBadReporter",
    "Sort::SortingTypeErrors",
    "Sort::sort-on-rejects-mixed-types",
    "Sum::SumOfExceedsNumericRange",
    "Turtles::Turtles1a",
    "TurtlesOn::TurtlesOn1_2D",
    "TypeChecking::AgentClassChecking1",
    "TypeChecking::AgentClassChecking3a",
    "TypeChecking::AgentClassChecking3b"
  )

  private val lameCommandStr = "This test is LAME!"
  private val lameCommandNames = Seq(
    "UserPrimitives::UserReporters_Headless"
  )

  private val preferExtensionsStr = "Supplanted by extension-based tests (e.g. Fetch, Import-A)"
  private val preferExtensionsCommandNames =
    Seq(
      "ImportPatchesAndDrawing::ImportPcolors_2D"
    , "ImportPatchesAndDrawing::ImportPcolorsTopologyTest_2D"
    , "ImportWorld::RoundTripWithUTF8Chars"
    )

  private val awaitingFixStr = "Known issue waiting on a proper fix"
  private val awaitingFixNames =
    Seq(
    )

}
