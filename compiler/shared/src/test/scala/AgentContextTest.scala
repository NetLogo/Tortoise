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
    // NEIGHBORS is turtle/patch, but inside `ask turtles` desktop records -- and checks -- just the turtle.
    assertResult(Turtle)(requirementAt("to foo ask turtles [ __ignore neighbors ] end", "neighbors"))
  }

  // The context and requirement at the first prim with the given name, walking the way the compiler will.

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

  private def defsFor(code: String) = {
    val model = CModel(code, List(View.square(16)))
    val (defs, _, _) = compiler.compileMoreProcedures(model, Program.empty(), FrontEndInterface.NoProcedures)
    defs
  }

  // (name, context, requirement) for every instruction, in source order.
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
