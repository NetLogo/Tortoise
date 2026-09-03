// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.scalatest.funsuite.AnyFunSuite

import
  org.nlogo.core.{ AstNode, CommandBlock, Expression, FrontEndInterface, Model => CModel, Program, ReporterApp,
                   ReporterBlock, Statement, Statements, View }

import
  org.nlogo.core.prim.{ _commandlambda, _reporterlambda }

import
  AgentContext.{ All, AnyAgent, Link, Nothing, Observer, Patch, Turtle }

class AgentContextTest extends AnyFunSuite {

  private val compiler = new Compiler()

  test("agent class strings convert both ways") {
    assertResult(All)(AgentContext.fromAgentClassString("OTPL"))
    assertResult(Turtle)(AgentContext.fromAgentClassString("-T--"))
    assertResult(Turtle | Patch)(AgentContext.fromAgentClassString("-TP-"))
    assertResult(Nothing)(AgentContext.fromAgentClassString("----"))
    assertResult("OTPL")(AgentContext.toAgentClassString(All))
    assertResult("---L")(AgentContext.toAgentClassString(Link))
  }

  test("a context satisfies a requirement when every kind it allows is allowed") {
    assert(AgentContext.isSatisfiedBy(Turtle, Turtle))
    assert(AgentContext.isSatisfiedBy(All, Turtle))
    assert(AgentContext.isSatisfiedBy(Turtle | Patch, Patch))
    // Nothing runs, so nothing can go wrong.
    assert(AgentContext.isSatisfiedBy(Turtle, Nothing))
    assert(!AgentContext.isSatisfiedBy(Turtle, AnyAgent))
    assert(!AgentContext.isSatisfiedBy(Turtle, All))
    assert(!AgentContext.isSatisfiedBy(Turtle, Observer))
  }

  test("statically known ask contexts") {
    assertResult(Turtle)(contextAt("to foo ask turtles [ fd 1 ] end", "fd"))
    assertResult(Patch)(contextAt("to foo ask patches [ sprout 1 ] end", "sprout"))
    assertResult(Link)(contextAt("to foo ask links [ __ignore link-length ] end", "link-length"))
    assertResult(Turtle)(contextAt("to foo ask (turtle-set turtle 0) [ fd 1 ] end", "fd"))
  }

  test("breed agentsets are known contexts") {
    val code = "breed [ mice mouse ] to foo ask mice [ fd 1 ] end"
    assertResult(Turtle)(contextAt(code, "fd"))
  }

  test("asking a single agent is a known context, though desktop treats it as unknown") {
    assertResult(Turtle)(contextAt("to foo ask turtle 0 [ fd 1 ] end", "fd"))
  }

  test("asking something whose kind isn't known leaves the context unknown") {
    assertResult(AnyAgent)(contextAt("to foo [a] ask a [ fd 1 ] end", "fd"))
    assertResult(AnyAgent)(contextAt("to foo ask one-of patches [ set pcolor red ] end", "set"))
    assertResult(AnyAgent)(contextAt("to foo ask myself [ fd 1 ] end", "fd"))
  }

  test("`with` takes its context from the agentset, `of` does not") {
    assertResult(Turtle)(contextAt("to foo __ignore turtles with [who > 1] end", "who"))
    // `of` puts its block first, and desktop only ever looks at the first argument.
    assertResult(AnyAgent)(contextAt("to foo __ignore [dx] of turtles end", "dx"))
  }

  test("sort-by takes an anonymous reporter, not a block, so its body is unconstrained") {
    assertResult(All)(contextAt("to foo __ignore sort-by [who] turtles end", "who"))
  }

  test("prims that name a fixed block context") {
    assertResult(Turtle)(contextAt("to foo ask patches [ sprout 1 [ fd 1 ] ] end", "fd"))
    assertResult(Turtle)(contextAt("to foo ask turtles [ hatch 1 [ fd 1 ] ] end", "fd"))
    assertResult(Turtle)(contextAt("to foo crt 1 [ fd 1 ] end", "fd"))
  }

  test("control structures keep the enclosing context") {
    assertResult(Turtle)(contextAt("to foo ask turtles [ if true [ fd 1 ] ] end", "fd"))
    assertResult(Turtle)(contextAt("to foo ask turtles [ repeat 2 [ fd 1 ] ] end", "fd"))
    assertResult(Observer)(contextAt("to foo if true [ crt 1 ] end", "crt"))
  }

  test("a procedure body starts in the context the front end inferred for it") {
    assertResult(Turtle)(contextAt("to foo fd 1 end", "fd"))
    assertResult(Observer)(contextAt("to foo crt 1 end", "crt"))
    // Nothing in this body is restricted, so it could be called by anyone.
    assertResult(All)(contextAt("to foo print 1 end", "print"))
  }

  test("anonymous procedure bodies are unconstrained by where they were written") {
    assertResult(All)(contextAt("to foo foreach [1] [ x -> fd x ] end", "fd"))
    assertResult(All)(contextAt("to foo ask turtles [ foreach [1] [ x -> fd x ] ] end", "fd"))
    assertResult(All)(contextAt("to foo let f [ -> fd 1 ] run f end", "fd"))
  }

  test("requirements come from the prim, or from the callee for a procedure call") {
    assertResult(Turtle)(requirementAt("to foo ask turtles [ fd 1 ] end", "fd"))
    assertResult(Patch)(requirementAt("to foo ask patches [ sprout 1 ] end", "sprout"))
    assertResult(Turtle | Patch)(requirementAt("to foo foreach [1] [ x -> __ignore neighbors ] end", "neighbors"))
    assertResult(Turtle)(requirementAt("to t-only fd 1 end to foo foreach [1] [ x -> t-only ] end", "t-only"))
  }

  test("a requirement is narrowed by the context the front end found it in, as desktop's is") {
    // NEIGHBORS is turtle/patch, but inside `ask turtles` desktop records just the turtle, and checks just the turtle.
    assertResult(Turtle)(requirementAt("to foo ask turtles [ __ignore neighbors ] end", "neighbors"))
  }

  // These give you the context and requirement at the first prim with the given name, walking the way the compiler
  // will.
  //
  // `walk` models the descent `Handlers` and `Prims` make, it isn't the compiler itself, so it can only test the rules
  // the two share: `contextOfBlock`, `requirementOf`, `contextOfAnonymousProcedure`.  It deliberately leaves out what
  // happens once a context is known, meaning the `provenBy` narrowing along a statement list and the decision to emit a
  // guard at all.  The `guardsIn` tests below cover those, since they read the compiler's own output, and that's where
  // to add a case when the two could disagree.
  //
  // Keep this in step with `Handlers.commands` and `Arguments.get` if the descent changes.  -Jeremy B September 2026

  private def contextAt(code: String, primName: String): Int =
    findFirst(code, primName)._1

  private def requirementAt(code: String, primName: String): Int =
    findFirst(code, primName)._2

  private def findFirst(code: String, primName: String): (Int, Int) = {
    val found = defsFor(code).flatMap( (pd) =>
      walk(pd.statements, AgentContext.fromAgentClassString(pd.procedure.agentClassString))
    )
    found.find(_._1.equalsIgnoreCase(primName)).map( (f) => (f._2, f._3) ).getOrElse(
      throw new IllegalArgumentException(s"no prim named $primName in: $code, found ${found.map(_._1).mkString(", ")}")
    )
  }

  // A statement's check proves its requirement for everything that follows it in the same list.  So a run of statements
  // needing the same kind is guarded once, at the position desktop's interpreter would fail at.
  test("a proven kind covers the rest of the statement list") {
    assertResult(1)(guardCount("to foo [a] ask a [ fd 1 rt 5 set heading 90 ] end"))
  }

  test("the proof reaches into blocks that inherit the enclosing context") {
    assertResult(1)(guardCount("to foo [a] ask a [ fd 1 if true [ rt 5 ] ] end"))
  }

  test("a statement needing more than the proof covers still gets its own check") {
    // `set color` is turtle-or-link, which doesn't prove the turtle `fd` needs.
    val js = guardsIn("to foo [a] ask a [ set color red fd 1 ] end")
    assertResult(Seq("10", "2"))(js.map(_._1))
  }

  test("a block that rebinds self starts over from its own context") {
    // The outer `fd` proves turtle, but the inner ask is a fresh context.
    assertResult(2)(guardCount("to foo [a] ask a [ fd 1 ask link-neighbors [ fd 1 ] ] end"))
  }

  // The block's agents get checked once, before iterating, and only when they could be the wrong kind.

  test("a block run for agents of a known kind is not checked") {
    assertResult(0)(setGuardCount("to foo __ignore [dx] of turtles end"))
    assertResult(0)(setGuardCount("to foo __ignore [dx] of turtles with [who > 1] end"))
    assertResult(0)(setGuardCount("to foo __ignore sort-on [dx] turtles end"))
    assertResult(0)(setGuardCount("to foo __ignore max-n-of 3 turtles [dx] end"))
    // `neighbors` is turtle-or-patch, which patches satisfy.
    assertResult(0)(setGuardCount("to foo __ignore [count neighbors] of patches end"))
  }

  // These report the kind of the agentset they were handed, but their return type says only "an agentset", or less, so
  // the kind has to come from the argument.
  test("a block run for agents of a filtered or sampled set is not checked") {
    assertResult(0)(setGuardCount("to foo ask turtles [ __ignore count turtles in-radius 1 with [color = yellow] ] end"))
    assertResult(0)(setGuardCount("to foo ask turtles [ __ignore [dx] of turtles in-radius 1 ] end"))
    assertResult(0)(setGuardCount("to foo ask turtles [ __ignore [dx] of turtles in-cone 1 90 ] end"))
    assertResult(0)(setGuardCount("to foo __ignore [dx] of n-of 3 turtles end"))
    assertResult(0)(setGuardCount("to foo __ignore [dx] of up-to-n-of 3 turtles end"))
    assertResult(0)(setGuardCount("to foo __ignore [dx] of max-n-of 3 turtles [who] end"))
    assertResult(0)(setGuardCount("to foo __ignore [dx] of min-n-of 3 turtles [who] end"))
    // The kind still has to survive a nesting of them.
    assertResult(0)(setGuardCount("to foo ask turtles [ __ignore [dx] of n-of 2 (turtles in-radius 1) ] end"))
  }

  test("a filtered or sampled set of an unknown kind is still checked") {
    assertResult(1)(setGuardCount("to foo [a] __ignore [dx] of n-of 3 a end"))
    assertResult(1)(setGuardCount("to foo ask turtles [ __ignore [dx] of a-set-of 1 ] end to-report a-set-of [n] report nobody end"))
  }

  test("the block of an `n-of` family prim gets its context from the agentset, not the count") {
    assertResult(Turtle)(contextAt("to foo __ignore max-n-of 3 turtles [dx] end", "dx"))
    assertResult(Patch)(contextAt("to foo __ignore min-n-of 3 patches [pxcor] end", "pxcor"))
  }

  test("a block run for agents of an unknown kind is checked") {
    assertResult(1)(setGuardCount("to foo [a] __ignore [dx] of a end"))
    assertResult(1)(setGuardCount("to foo [a] __ignore sort-on [dx] a end"))
    assertResult(1)(setGuardCount("to foo [a] __ignore max-n-of 3 a [dx] end"))
  }

  test("a block run for agents of the wrong known kind is still checked, and fails at runtime as desktop does") {
    // Desktop makes this a runtime error rather than a compile error, so we emit the check even though nothing about it
    // can succeed.
    assertResult(1)(setGuardCount("to foo __ignore [dx] of patches end"))
  }

  private val SetGuardCall = """PrimChecks\.context\.assertAgentSetKind\(""".r

  private def setGuardCount(code: String): Int =
    SetGuardCall.findAllMatchIn(jsFor(code)).length

  // Only `world.turtles()` and `world.patches()` themselves are rejected, and by identity, so the check is only worth
  // emitting for an expression that could be holding one of them.

  test("asking something that could be the whole set is checked") {
    assertResult(1)(askGuardCount("to foo [a] ask a [ fd 1 ] end"))
    assertResult(1)(askGuardCount("to foo [a] ask turtles [ fd 1 ] fd 1 end"))
    assertResult(1)(askGuardCount("to foo [a] ask ifelse-value true [ turtles ] [ a ] [ fd 1 ] end"))
    // `one-of` reports a single agent for an agentset, but for a list it reports whatever the list holds.
    assertResult(1)(askGuardCount("to foo [a] ask one-of (list turtles patches) [ fd 1 ] end"))
  }

  test("asking a set the prim built itself is not checked") {
    assertResult(0)(askGuardCount("to foo ask turtles-here [ fd 1 ] end"))
    assertResult(0)(askGuardCount("to foo ask link-neighbors [ fd 1 ] end"))
    assertResult(0)(askGuardCount("to foo ask turtles with [who > 1] [ fd 1 ] end"))
    assertResult(0)(askGuardCount("to foo ask n-of 3 turtles [ fd 1 ] end"))
    assertResult(0)(askGuardCount("to foo ask other turtles [ fd 1 ] end"))
    assertResult(0)(askGuardCount("to foo ask neighbors [ set pcolor red ] end"))
  }

  test("asking something that isn't a turtleset or a patchset is not checked") {
    assertResult(0)(askGuardCount("to foo ask my-links [ set color red ] end"))
    assertResult(0)(askGuardCount("to foo ask patch-here [ set pcolor red ] end"))
    assertResult(0)(askGuardCount("to foo ask one-of turtles [ fd 1 ] end"))
    assertResult(0)(askGuardCount("to foo ask myself [ fd 1 ] end"))
  }

  private val AskGuardCall = """PrimChecks\.context\.assertAskAllowed\(""".r

  private def askGuardCount(code: String): Int =
    AskGuardCall.findAllMatchIn(jsFor(code)).length

  private val GuardCall = """PrimChecks\.context\.assertKind\((\d+), '([^']+)'""".r

  private def guardsIn(code: String): Seq[(String, String)] =
    GuardCall.findAllMatchIn(jsFor(code)).map( (m) => (m.group(1), m.group(2)) ).toSeq

  private def guardCount(code: String): Int =
    guardsIn(code).length

  private def jsFor(code: String): String = {
    val model = CModel(code, List(View.square(16)))
    compiler.toJS(compiler.compileProcedures(model)(using CompilerFlags.Default))(using CompilerFlags.Default)
  }

  private def defsFor(code: String) = {
    val model = CModel(code, List(View.square(16)))
    val (defs, _, _) = compiler.compileMoreProcedures(model, Program.empty(), FrontEndInterface.NoProcedures)
    defs
  }

  // This gives back (name, context, requirement) for every instruction, in source order.
  private def walk(node: AstNode, context: Int): Seq[(String, Int, Int)] =
    node match {

      case ss: Statements =>
        ss.stmts.flatMap(walk(_, context))

      case s: Statement =>
        (s.command.token.text, context, AgentContext.requirementOf(s.command)) +: walkArgs(s, s.args, context)

      case r: ReporterApp =>
        val isLambda = r.reporter.isInstanceOf[_commandlambda] || r.reporter.isInstanceOf[_reporterlambda]
        val args     = if (isLambda) r.args.flatMap(walk(_, All)) else walkArgs(r, r.args, context)
        (r.reporter.token.text, context, AgentContext.requirementOf(r.reporter)) +: args

      case b: CommandBlock  => walk(b.statements, context)
      case b: ReporterBlock => walk(b.app, context)
      case _                => Seq()

    }

  private def walkArgs(app: org.nlogo.core.Application, args: Seq[Expression], context: Int)
    : Seq[(String, Int, Int)] = {
    val blockContext = AgentContext.contextOfBlock(app, context)
    args.flatMap {
      case b: CommandBlock  => walk(b, blockContext)
      case b: ReporterBlock => walk(b, blockContext)
      case e                => walk(e, context)
    }
  }

}
