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
    "RunResult::RunResult3" -> "run/runresult on strings not supported",
    "Lists::Lput5"                -> "Tortoise error detection and reporting not complete",
    "Lists::ListFirst1"           -> "Tortoise error detection and reporting not complete",
    "Lists::ListReplaceIt2"       -> "Tortoise error detection and reporting not complete",
    "Lists::ReduceEmpty"          -> "Tortoise error detection and reporting not complete",
    "Lists::MapNotEnoughInputs"   -> "Tortoise error detection and reporting not complete",
    "Lists::ListItem1"            -> "Tortoise error detection and reporting not complete",
    "Lists::ListItem2"            -> "Tortoise error detection and reporting not complete",
    "Lists::ListLast1"            -> "Tortoise error detection and reporting not complete",
    "Lists::ListLength3"          -> "Tortoise error detection and reporting not complete",
    "Lists::ListRemoveItem4"      -> "Tortoise error detection and reporting not complete",
    "Lists::ListRemoveItem5"      -> "Tortoise error detection and reporting not complete",
    "Lists::ListRemoveItem6"      -> "Tortoise error detection and reporting not complete",
    "Lists::ListReplItem2"        -> "Tortoise error detection and reporting not complete",
    "Lists::ListReplItem3"        -> "Tortoise error detection and reporting not complete",
    "Lists::ListButFirst3"        -> "Tortoise error detection and reporting not complete",
    "Lists::ListButLast3"         -> "Tortoise error detection and reporting not complete",
    "Lists::ListSubList6"         -> "Tortoise error detection and reporting not complete",
    "Lists::ListSubList8"         -> "Tortoise error detection and reporting not complete",
    "Lists::ListSubList9"         -> "Tortoise error detection and reporting not complete",
    "Lists::ListSubList12"        -> "Tortoise error detection and reporting not complete",
    "Numbers::Sqrt1"              -> "Tortoise error detection and reporting not complete",
    "Numbers::Sqrt4"              -> "Tortoise error detection and reporting not complete",
    "Numbers::DivByZero1"         -> "Tortoise error detection and reporting not complete",
    "Numbers::DivByZero2"         -> "Tortoise error detection and reporting not complete",
    "Numbers::DivByZero3"         -> "Tortoise error detection and reporting not complete",
    "Numbers::DivByZero4"         -> "Tortoise error detection and reporting not complete",
    "Numbers::DivByZero5"         -> "Tortoise error detection and reporting not complete",
    "Numbers::DivByZero6"         -> "Tortoise error detection and reporting not complete",
    "Numbers::Atan4"              -> "Tortoise error detection and reporting not complete",
    "Numbers::Exponentiation3"    -> "Tortoise error detection and reporting not complete",
    "Numbers::Log5"               -> "Tortoise error detection and reporting not complete",
    "Numbers::Log6"               -> "Tortoise error detection and reporting not complete",
    "Numbers::Max1"               -> "Tortoise error detection and reporting not complete",
    "Numbers::Min1"               -> "Tortoise error detection and reporting not complete",
    "Numbers::Mean1"              -> "Tortoise error detection and reporting not complete",
    "Numbers::Variance1"          -> "Tortoise error detection and reporting not complete",
    "Numbers::Variance2"          -> "Tortoise error detection and reporting not complete",
    "RunResult::RunResult4"       -> "Tortoise error detection and reporting not complete",
    "RunResult::RunResult5"       -> "Tortoise error detection and reporting not complete",
    "Strings::StrButFirst2"       -> "Tortoise error detection and reporting not complete",
    "Strings::StrButLast2"        -> "Tortoise error detection and reporting not complete",
    "Strings::StrRemoveItem4"     -> "Tortoise error detection and reporting not complete",
    "Strings::StrRemoveItem5"     -> "Tortoise error detection and reporting not complete",
    "Strings::StrRemoveItem6"     -> "Tortoise error detection and reporting not complete"
  )
}

class TestCommands extends TCommands with TortoiseFinder {
  override val freebies = Map[String, String](
    // requires features
    "Random::RandomNOfIsFairForAList" -> "`n-of` not implemented for lists",
    // requires handling of non-local exit (see in JVM NetLogo: `NonLocalExit`, `_report`, `_foreach`, `_run`)
    "Stop::ReportFromForeach" -> "no non-local exit from foreach",
    // Significant: Requires the optimizer to be turned on
    "Death::TurtleDiesWhileIteratingOverItsSet"                               -> "ASSUMES OPTIMIZATION: empty init block",
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
    "Run::run-evaluate-string-input-only-once" -> "run/runresult on strings not supported",
    "Agentsets::Agentsets2"                 -> "Tortoise error detection and reporting not complete",
    "Agentsets::Agentsets3"                 -> "Tortoise error detection and reporting not complete",
    "Agentsets::Agentsets4"                 -> "Tortoise error detection and reporting not complete",
    "Agentsets::LinkAgentsetDeadLinks"      -> "Tortoise error detection and reporting not complete",
    "AgentsetBuilding::TurtleSet"           -> "Tortoise error detection and reporting not complete",
    "AgentsetBuilding::PatchSet2"           -> "Tortoise error detection and reporting not complete",
    "AgentsetBuilding::LinkSet"             -> "Tortoise error detection and reporting not complete",
    "AnyAll::All5"                          -> "Tortoise error detection and reporting not complete",
    "Ask::AskAllTurtles"                    -> "Tortoise error detection and reporting not complete",
    "Ask::AskAllPatches"                    -> "Tortoise error detection and reporting not complete",
    "BooleanOperators::ShortCircuitAnd"     -> "Tortoise error detection and reporting not complete",
    "BooleanOperators::ShortCircuitOr"      -> "Tortoise error detection and reporting not complete",
    "Breeds::SetBreedToNonBreed"            -> "Tortoise error detection and reporting not complete",
    "CommandTasks::*WrongTypeOfTask1"       -> "Tortoise error detection and reporting not complete",
    "CommandTasks::WrongTypeOfTask2"        -> "Tortoise error detection and reporting not complete",
    "CommandTasks::NotEnoughInputs"         -> "Tortoise error detection and reporting not complete",
    "CommandTasks::NotEnoughInputsForeach"  -> "Tortoise error detection and reporting not complete",
    "ComparingAgents::ComparingLinks"       -> "Tortoise error detection and reporting not complete",
    "Death::DeadTurtles1"                   -> "Tortoise error detection and reporting not complete",
    "Death::DeadTurtles2"                   -> "Tortoise error detection and reporting not complete",
    "Death::DeadTurtles5"                   -> "Tortoise error detection and reporting not complete",
    "Death::DeadTurtles6"                   -> "Tortoise error detection and reporting not complete",
    "Face::FaceAgentset"                    -> "Tortoise error detection and reporting not complete",
    "Interaction::Interaction5"             -> "Tortoise error detection and reporting not complete",
    "Interaction::Interaction13"            -> "Tortoise error detection and reporting not complete",
    "Interaction::PatchTriesTurtleReporter" -> "Tortoise error detection and reporting not complete",
    "Links::CreateLinksTo"                  -> "Tortoise error detection and reporting not complete",
    "Links::CreateLinksFrom"                -> "Tortoise error detection and reporting not complete",
    "Links::CreateLinksWith"                -> "Tortoise error detection and reporting not complete",
    "Links::LinkFromToWith1"                -> "Tortoise error detection and reporting not complete",
    "Links::LinkCantChangeBreeds"           -> "Tortoise error detection and reporting not complete",
    "Links::LinksNotAllowed"                -> "Tortoise error detection and reporting not complete",
    "Links::LinkNotAllowed"                 -> "Tortoise error detection and reporting not complete",
    "Links::BadLinkBreeds"                  -> "Tortoise error detection and reporting not complete",
    "Links::LinkNeighborIsUndirectedOnly1"  -> "Tortoise error detection and reporting not complete",
    "Links::LinkCreationTypeChecking"       -> "Tortoise error detection and reporting not complete",
    "Lists::RemoveBug997FirstArgMustBeStringIfSecondArgIsString" -> "Tortoise error detection and reporting not complete",
    "Lists::FilterTypeError"                -> "Tortoise error detection and reporting not complete",
    "Math::CatchNumbersOutsideDoubleRangeOfIntegers" -> "Tortoise error detection and reporting not complete",
    "Math::DivideByZero"                    -> "Tortoise error detection and reporting not complete",
    "MoveTo::MoveTo"                        -> "Tortoise error detection and reporting not complete",
    "Patch::SetVariableRuntime"             -> "Tortoise error detection and reporting not complete",
    "RGB::PatchesRGBColor"                  -> "Tortoise error detection and reporting not complete",
    "RGB::TurtlesRGBColor"                  -> "Tortoise error detection and reporting not complete",
    "RGB::LinksRGBColor"                    -> "Tortoise error detection and reporting not complete",
    "Random::RandomOneOfWithLists"          -> "Tortoise error detection and reporting not complete",
    "Random::RandomNOfWithLists"            -> "Tortoise error detection and reporting not complete",
    "Random::OneOfWithAgentSets"            -> "Tortoise error detection and reporting not complete",
    "Random::RejectBadSeeds"                -> "Tortoise error detection and reporting not complete",
    "ReporterTasks::NotEnoughInputs"        -> "Tortoise error detection and reporting not complete",
    "Run::RunRejectExtraArgumentsIfFirstArgIsString" -> "Tortoise error detection and reporting not complete",
    "Run::RunResultRejectExtraArgumentsIfFirstArgIsString" -> "Tortoise error detection and reporting not complete",
    "Sort::SortingTypeErrors"                  -> "Tortoise error detection and reporting not complete",
    "Stop::ReportFromDynamicallyNestedForeach" -> "Tortoise error detection and reporting not complete",
    "Stop::StopFromForeach1"                   -> "Tortoise error detection and reporting not complete",
    "Stop::StopFromForeachInsideReporterProcedure" -> "Tortoise error detection and reporting not complete",
    "Stop::StopFromNestedForeachInsideReporterProcedure" -> "Tortoise error detection and reporting not complete",
    "Stop::FallOffEndOfReporterProcedure" -> "Tortoise error detection and reporting not complete",
    "Turtles::Turtles1a"                  -> "Tortoise error detection and reporting not complete",
    "TurtlesOn::TurtlesOn1"               -> "Tortoise error detection and reporting not complete",
    "TypeChecking::AgentClassChecking1"   -> "Tortoise error detection and reporting not complete",
    "TypeChecking::AgentClassChecking3a"  -> "Tortoise error detection and reporting not complete",
    "TypeChecking::AgentClassChecking3b"  -> "Tortoise error detection and reporting not complete"
  )
}
