// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ core, api, headless, nvm },
  nvm.FrontEndInterface.{ ProceduresMap, NoProcedures },
  headless.lang, lang._,
  org.nlogo.api.Femto,
  org.scalatest.Assertions._,
  org.scalatest.exceptions.TestPendingException,
  org.nlogo.tortoise.nashorn.Nashorn

trait TortoiseFinder extends lang.Finder {
  val nashorn = new Nashorn
  def freebies: Map[String, String]
  def notImplemented(s: String) = {
    info(s)
    throw new TestPendingException
  }
  override def shouldRun(t: LanguageTest, mode: TestMode) =
    mode == NormalMode && super.shouldRun(t, mode)
  override def withFixture[T](name: String)(body: AbstractFixture => T): T =
    freebies.get(name.stripSuffix(" (NormalMode)")) match {
      case None =>
        body(new TortoiseFixture(name, nashorn, notImplemented _))
      case Some(x) if x.contains("TOO SLOW") =>
        notImplemented("TOO SLOW")
      case Some(excuse) =>
        try
          body(new TortoiseFixture(name, nashorn, notImplemented _))
        catch {
          case _: TestPendingException =>
            // ignore; we'll hit the fail() below
          case ex: Exception =>
            notImplemented(ex + ": LAME EXCUSE: " + excuse)
        }
        fail("LAME EXCUSE WASN'T NEEDED: " + excuse)
    }
}

class TestReporters extends lang.TestReporters with TortoiseFinder {
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

class TestCommands extends lang.TestCommands with TortoiseFinder {
  override val freebies = Map[String, String](
    // significant (early exit)
    "Stop::ReportFromForeach" -> "no non-local exit from foreach",
    // significant (string representation)
    "CommandTasks::*ToString3" -> "command task string representation doesn't match",
    "CommandTasks::*ToString4" -> "command task string representation doesn't match",
    "CommandTasks::*ToString5" -> "command task string representation doesn't match",
    "CommandTasks::*ToString6" -> "command task string representation doesn't match",
    // significant (misc.)
    "CommandTasks::command-task-body-gets-agent-type-check" -> "agent type checking not supported",
    "Random::Random3" -> "`random` doesn't handle fractional parts correctly",
    // should be handled in rewrite
    "Agentsets::AgentSetEquality"      -> "Dead agents in agentsets are handled incorrectly",
    "Agentsets::LinkAgentsetDeadLinks" -> "Dead agents in agentsets are handled incorrectly",
    "Death::DeadLinks1"                -> "Dead agents in agentsets are handled incorrectly",
    "Death::DeadTurtles10"             -> "Dead agents in agentsets are handled incorrectly",
    "Death::DeadTurtles9"              -> "Dead agents in agentsets are handled incorrectly",
    "OneOf::OneOfDyingTurtles"         -> "Dead agents in agentsets are handled incorrectly",
    "Interaction::Interaction3b1"                                             -> "correct answer requires empty init block optimization",
    "Interaction::Interaction3b2"                                             -> "correct answer requires empty init block optimization",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksFrom" -> "correct answer requires empty init block optimization",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksTo"   -> "correct answer requires empty init block optimization",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksWith" -> "correct answer requires empty init block optimization",
    "TurtlesHere::TurtlesHereCheckOrder1"                                     -> "correct answer requires empty init block optimization",
    "TurtlesHere::TurtlesHereCheckOrder2"                                     -> "correct answer requires empty init block optimization",
    "TurtlesHere::TurtlesHereCheckOrder3"                                     -> "correct answer requires empty init block optimization",
    "TurtlesHere::TurtlesHereCheckOrder4"                                     -> "correct answer requires empty init block optimization",
    "Agentsets::Agentsets4" -> "TOO SLOW (because creating links requires looking up existing links)",
    "Links::LinksInitBlock" -> "TOO SLOW (because creating links requires looking up existing links)",
    // significant; uncertain how to solve (`RandomNOfIsFair<X>`s could possibly be solved by making it faster to write agent variables, but maybe not)
    "Random::RandomNOfIsFairForABreed"                        -> "TOO SLOW",
    "Random::RandomNOfIsFairForAList"                         -> "TOO SLOW",
    "Random::RandomNOfIsFairForAnAgentsetConstructedOnTheFly" -> "TOO SLOW",
    "Random::RandomNOfIsFairForLinks"                         -> "TOO SLOW",
    "Random::RandomNOfIsFairForPatches"                       -> "TOO SLOW",
    "Random::RandomNOfIsFairForTurtles"                       -> "TOO SLOW",
    // requires features
    "Tie::Tie2Nonrigid" -> "tie-mode link variable not implemented; ties not implemented at all",
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
    // needs compiler changes
    "ReporterTasks::CloseOverLocal1" -> "Creates a function named 'const', which is a reserved keyword in JavaScript",
    "Errors::task-variable-not-in-task" -> "Necessary check must be moved up into the front-end of the compiler",
    "Let::LetOfVarToItself1"            -> "Necessary check must be moved up into the front-end of the compiler",
    "Let::LetOfVarToItself2"            -> "Necessary check must be moved up into the front-end of the compiler",
    "Let::LetOfVarToItself3"            -> "Necessary check must be moved up into the front-end of the compiler",
    "Let::LetOfVarToItselfInsideAsk"    -> "Necessary check must be moved up into the front-end of the compiler",
    "TypeChecking::SetVariable"         -> "Necessary check must be moved up into the front-end of the compiler"
  )
}

class TortoiseFixture(name: String, nashorn: Nashorn, notImplemented: String => Nothing)
extends AbstractFixture {

  override def defaultDimensions = core.WorldDimensions.square(5)
  var program: api.Program = api.Program.empty
  var procs: ProceduresMap = NoProcedures

  override def declare(source: String, dimensions: core.WorldDimensions) {
    val (js, p, m) =
      try Compiler.compileProcedures(source, dimensions = dimensions)
      catch catcher
    program = p
    procs = m
    nashorn.eval(js)
  }

  override def readFromString(literal: String): AnyRef =
    try nashorn.eval(Compiler.compileReporter(literal))
    catch catcher

  override def open(path: String) = ???

  override def open(model: headless.ModelCreator.Model) {
    declare(model.code)
  }

  override def runCommand(command: Command, mode: TestMode) {
    val wrappedCommand = command.kind match {
      case core.AgentKind.Observer =>
        command.command
      case core.AgentKind.Turtle =>
        "ask turtles [ " + command.command + "\n]"
      case core.AgentKind.Patch =>
        "ask patches [ " + command.command + "\n]"
      case core.AgentKind.Link =>
        "ask links [ " + command.command + "\n]"
    }
    def js = Compiler.compileCommands(wrappedCommand, procs, program)
    command.result match {
      case Success(_) =>
        try nashorn.run(js)
        catch catcher
      case CompileError(msg) =>
        expectCompileError(js, msg)
      case r =>
        notImplemented("unknown result type: " + r.getClass.getSimpleName)
    }
  }

  private def expectCompileError(js: => String, msg: String) {
    try {
      try js catch catcher
      fail("no CompilerException occurred")
    }
    catch {
      case ex: api.CompilerException =>
        assertResult(msg)(ex.getMessage)
    }
  }

  override def runReporter(reporter: Reporter, mode: TestMode) {
    def js = Compiler.compileReporter(reporter.reporter, procs, program)
    reporter.result match {
      case Success(expectedResult) =>
        val actualResult =
          try nashorn.eval(js)
          catch catcher
        checkResult(mode, reporter.reporter, expectedResult, actualResult)
      case CompileError(msg) =>
        expectCompileError(js, msg)
      case r =>
        notImplemented("unknown result type: " + r.getClass.getSimpleName)
    }
  }

  // kludginess ahead - ST 8/28/13

  val notImplementedMessages = Seq(
    "unknown primitive: ",
    "unknown settable: ",
    "unknown language feature: ")

  val catcher: PartialFunction[Throwable, Nothing] = {
    case ex: IllegalArgumentException
          if notImplementedMessages.exists(ex.getMessage.startsWith) =>
        notImplemented(ex.getMessage)
  }

}
