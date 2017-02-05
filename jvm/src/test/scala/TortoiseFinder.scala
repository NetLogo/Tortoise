// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.scalatest.{ Tag, BeforeAndAfterAll, exceptions },
    exceptions.TestPendingException

import
  org.nlogo.headless.test.{ AbstractFixture, Command, Finder, LanguageTest, NormalMode, CommandTests, TestMode, ReporterTests }

import
  org.nlogo.tortoise.tags.{ SlowTest => TortoiseSlowTag, LanguageTest => TortoiseLanguageTag}

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

  override def test(name: String, otherTags: Tag*)(testFun: => Unit) =
    super.test(name, (Seq(TortoiseLanguageTag) ++ otherTags):_*)(testFun)

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
  ) ++ evalNotSupportedReporters ++ incErrorDetectReporters ++ cmdTaskRepMismatchCommands ++
  fixedOnHexyBranchReporters
}

class TestCommands extends CommandTests with TortoiseFinder {
  import Freebies._
  override val freebies = Map[String, String](
    // requires handling of non-local exit (see in JVM NetLogo: `NonLocalExit`, `_report`, `_foreach`, `_run`)
    "Every::EveryLosesScope"  -> "NetLogo Web does not support distinct jobs"
  ) ++ incErrorDetectCommands ++ emptyInitBlockCommands ++
       evalNotSupportedCommands ++ lameCommands ++ fixedOnHexyBranchCommands
}

private[tortoise] object Freebies {

  def incErrorDetectCommands     = asFreebieMap(incErrorDetectCommandNames,     incErrorDetectStr)
  def emptyInitBlockCommands     = asFreebieMap(emptyInitBlockCommandNames,     emptyInitBlockStr)
  def evalNotSupportedCommands   = asFreebieMap(evalNotSupportedCommandNames,   evalNotSupportedStr)
  def cmdTaskRepMismatchCommands = asFreebieMap(cmdTaskRepMismatchCommandNames, cmdTaskRepMismatchStr)
  def lameCommands               = asFreebieMap(lameCommandNames,               lameCommandStr)
  def fixedOnHexyBranchCommands  = asFreebieMap(fixedOnHexyBranchCommandNames,  fixedOnHexyBranchStr)

  def incErrorDetectReporters    = asFreebieMap(incErrorDetectReporterNames,    incErrorDetectStr)
  def evalNotSupportedReporters  = asFreebieMap(evalNotSupportedReporterNames,  evalNotSupportedStr)
  def fixedOnHexyBranchReporters = asFreebieMap(fixedOnHexyBranchReporterNames, fixedOnHexyBranchStr)

  private def asFreebieMap(names: Seq[String], msg: String) = names.map(_ -> msg).toMap

  // Significant: Requires the optimizer to be turned on
  private val emptyInitBlockStr = "ASSUMES OPTIMIZATION: empty init block"
  private val emptyInitBlockCommandNames = Seq(
    "DeadTurtles::TurtleDiesWhileIteratingOverItsSet",
    "Interaction::Interaction3b",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksFrom",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksTo",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksWith",
    "TurtlesHere::TurtlesHereCheckOrder1",
    "TurtlesHere::TurtlesHereCheckOrder2",
    "TurtlesHere::TurtlesHereCheckOrder3",
    "TurtlesHere::TurtlesHereCheckOrder4"
  )

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
    "Numbers::Sqrt1",
    "Numbers::Sqrt4",
    "Numbers::Atan4",
    "Numbers::Exponentiation3",
    "Numbers::Log5",
    "Numbers::Log6",
    "Numbers::Max1",
    "Numbers::Min1",
    "Numbers::Mean1",
    "Numbers::Variance1",
    "Numbers::Variance2",
    "RunResult::RunResult4",
    "RunResult::RunResult5",
    "Strings::StrButFirst2",
    "Strings::StrButLast2",
    "Strings::StrRemoveItem4",
    "Strings::StrRemoveItem5",
    "Strings::StrRemoveItem6"
  )
  private val incErrorDetectCommandNames = Seq(
    "Agentsets::Agentsets2",
    "Agentsets::Agentsets3",
    "Agentsets::Agentsets4_2D",
    "Agentsets::LinkAgentsetDeadLinks",
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
    "Interaction::Interaction13",
    "Interaction::PatchTriesTurtleReporter",
    "Links::LinksNotAllowed",
    "Links::LinkNotAllowed_2D",
    "Links::LinkCreationTypeChecking_2D",
    "Lists::RemoveBug997FirstArgMustBeStringIfSecondArgIsString",
    "Lists::FilterTypeError",
    "Math::CatchNumbersOutsideDoubleRangeOfIntegers",
    "MoveTo::MoveTo_2D",
    "Patch::SetVariableRuntime_2D",
    "RGB::PatchesRGBColor_2D",
    "RGB::TurtlesRGBColor",
    "RGB::LinksRGBColor",
    "Random::RandomOneOfWithLists",
    "Random::RandomNOfWithLists",
    "Random::OneOfWithAgentSets",
    "Random::RejectBadSeeds",
    "Sort::SortingTypeErrors",
    "Sort::sort-on-rejects-mixed-types",
    "Turtles::Turtles1a",
    "TurtlesOn::TurtlesOn1_2D",
    "TypeChecking::AgentClassChecking1",
    "TypeChecking::AgentClassChecking3a",
    "TypeChecking::AgentClassChecking3b"
    )

  private val fixedOnHexyBranchStr = "this scoping/early abort test is fixed on the 'wip-hexy' branch"
  private val fixedOnHexyBranchReporterNames = Seq(
    "CommandLambda::LoopBindings1",
    "CommandLambda::StopFromLambda2",
    "CommandLambda::ReportFromLambda2"
  )
  private val fixedOnHexyBranchCommandNames = Seq(
    "Stop::StopFromForeach1",
    "Stop::StopFromForeach2",
    "Stop::StopFromForeach3",
    "Stop::StopFromForeachInsideReporterProcedure",
    "Stop::StopFromNestedForeachInsideReporterProcedure",
    "Stop::ReportFromForeachInsideProcedure",
    "Stop::StopLambda1"
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
    "Errors::CarefullyWithLambda2",
    "Run::LuisIzquierdoRun1",
    "Run::LuisIzquierdoRun2",
    "Run::LuisIzquierdoRunResult1",
    "Run::LuisIzquierdoRunResult2",
    "Run::run-evaluate-string-input-only-once"
  )

  // requires Tortoise compiler changes
  private val cmdTaskRepMismatchStr = "command task string representation doesn't match"
  private val cmdTaskRepMismatchCommandNames = Seq(
    "CommandLambda::*ToString3",
    "CommandLambda::*ToString4",
    "CommandLambda::*ToString5",
    "CommandLambda::*ToString6"
  )

  private val lameCommandStr = "This test is LAME!"
  private val lameCommandNames = Seq(
    "UserPrimitives::UserReporters_Headless"
  )

}
