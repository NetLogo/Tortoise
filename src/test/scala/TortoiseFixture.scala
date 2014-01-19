// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ api, headless, nvm },
  nvm.FrontEndInterface.{ ProceduresMap, NoProcedures },
  headless.lang, lang._,
  org.nlogo.util.Femto,
  org.scalatest.Assertions._

trait TortoiseFinder extends lang.Finder {
  def freebies: Map[String, String]
  override def shouldRun(t: LanguageTest, mode: TestMode) =
    mode == NormalMode && super.shouldRun(t, mode)
  override def withFixture[T](name: String)(body: AbstractFixture => T): T =
    freebies.get(name.stripSuffix(" (NormalMode)")) match {
      case None =>
        body(new TortoiseFixture(name))
      case Some("TOO SLOW") =>
        cancel("TOO SLOW")
      case Some(excuse) =>
        try body(new TortoiseFixture(name))
        catch {
          case _: org.scalatest.exceptions.TestCanceledException =>
            // ignore; we'll hit the fail() below
          case ex: Exception =>
            cancel(ex + ": LAME EXCUSE: " + excuse)
        }
        fail("LAME EXCUSE WASN'T NEEDED: " + excuse)
    }
}

class TestReporters extends lang.TestReporters with TortoiseFinder {
  override val freebies =
    Map(
      // obscure
      "Lists::Sort2" -> "sorting heterogeneous lists doesn't work",
      "Lists::Sort3" -> "sorting heterogeneous lists doesn't work",
      "Lists::Sort5" -> "sorting heterogeneous lists doesn't work"
    )
}

class TestCommands extends lang.TestCommands with TortoiseFinder {
  override val freebies = Map[String, String](
    // to be investigated
    "AgentsetBuilding::EmptyPatchSet" -> "???",
    "Agentsets::AgentSetEquality" -> "???",
    "Agentsets::LinkAgentsetDeadLinks" -> "???",
    "Agentsets::RemoveDuplicates" -> "???",
    "Breeds::TestIsBreed" -> "???",
    "ComparingAgents::ComparingPatches" -> "???",
    "DeadTurtles::DeadTurtles9" -> "???",
    "Equality::two-dead-turtles-are-equal" -> "???",
    "Equality::dead-turtle-equals-nobody" -> "???",
    "Equality::two-dead-links-are-equal" -> "???",
    "Equality::dead-link-equals-nobody" -> "???",
    "InCone::InConeCornerOrigin3" -> "???",
    "Links::Links1" -> "???",
    "Links::LinkCantChangeBreeds" -> "???",
    "Neighbors::Neighbors2Torus" -> "???",
    "OneOf::OneOfDyingTurtles" -> "???",
    "PatchAhead::PatchRightAndAhead" -> "???",
    "PatchAhead::PatchLeftAndAhead" -> "???",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksWith" -> "???",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksTo" -> "???",
    "RandomOrderInitialization::TestRandomOrderInitializationCreateLinksFrom" -> "???",
    "SelfMyself::Myself1" -> "???",
    "TurtlesHere::TurtlesHere1" -> "???",
    "TurtlesHere::PatchDoesOtherTurtlesHere" -> "???",
    "TurtlesHere::PatchDoesOtherBreedHere" -> "???",
    "TypeChecking::SetVariable" -> "???",
    // egregious
    "Turtles::Turtles7" -> "colors don't wrap to [0,140)",
    "Links::Links2" -> "colors don't wrap to [0,140)",
    // significant
    "Agentsets::Agentsets4" -> "TOO SLOW",
    "Links::LinksInitBlock" -> "TOO SLOW",
    "Random::RandomNOfIsFairForTurtles" -> "TOO SLOW",
    "Random::RandomNOfIsFairForLinks" -> "TOO SLOW",
    "Random::RandomNOfIsFairForABreed" -> "TOO SLOW",
    "Random::RandomNOfIsFairForPatches" -> "TOO SLOW",
    "Random::RandomNOfIsFairForAnAgentsetConstructedOnTheFly" -> "TOO SLOW",
    "Random::RandomNOfIsFairForAList" -> "TOO SLOW",
    "Agentsets::AgentsetEquality" -> "'special' agentsets not supported",
    "Tie::Tie2Nonrigid" -> "tie-mode link variable not implemented",
    // obscure
    "Let::LetOfVarToItself1" -> "???",
    "Let::LetOfVarToItself2" -> "???",
    "Let::LetOfVarToItself3" -> "???",
    "Let::LetOfVarToItselfInsideAsk" -> "???"
  )
}

class TortoiseFixture(name: String)
extends AbstractFixture {

  override def defaultDimensions = api.WorldDimensions.square(5)
  val rhino = new org.nlogo.tortoise.rhino.Rhino
  var program: api.Program = api.Program.empty
  var procs: ProceduresMap = NoProcedures

  override def declare(source: String, dimensions: api.WorldDimensions) {
    val (js, p, m) =
      try Compiler.compileProcedures(source, dimensions = dimensions)
      catch catcher
    program = p
    procs = m
    rhino.eval(js)
  }

  override def readFromString(literal: String): AnyRef =
    try rhino.eval(Compiler.compileReporter(literal))
    catch catcher

  override def open(path: String) = ???

  override def open(model: headless.ModelCreator.Model) {
    declare(model.code)
  }

  override def runCommand(command: Command, mode: TestMode) {
    val wrappedCommand = command.kind match {
      case api.AgentKind.Observer =>
        command.command
      case api.AgentKind.Turtle =>
        "ask turtles [ " + command.command + "\n]"
      case api.AgentKind.Patch =>
        "ask patches [ " + command.command + "\n]"
      case api.AgentKind.Link =>
        "ask links [ " + command.command + "\n]"
    }
    def js = Compiler.compileCommands(wrappedCommand, procs, program)
    command.result match {
      case Success(_) =>
        try rhino.run(js)
        catch catcher
      case CompileError(msg) =>
        expectCompileError(js, msg)
      case r =>
        cancel("unknown result type: " + r.getClass.getSimpleName)
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
          try rhino.eval(js)
          catch catcher
        checkResult(mode, reporter.reporter, expectedResult, actualResult)
      case CompileError(msg) =>
        expectCompileError(js, msg)
      case r =>
        cancel("unknown result type: " + r.getClass.getSimpleName)
    }
  }

  // kludginess ahead - ST 8/28/13

  val cancelers = Seq(
    "unknown primitive: ",
    "unknown settable: ",
    "unknown language feature: ")

  val catcher: PartialFunction[Throwable, Nothing] = {
    case ex: IllegalArgumentException
          if cancelers.exists(ex.getMessage.startsWith) =>
        cancel(ex.getMessage)
  }

}
