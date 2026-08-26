// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{ Application, AstNode, Expression, Instruction, ReporterApp, ReporterBlock, SourceLocatable,
                   Statement, Syntax }

import
  org.nlogo.core.prim,
    prim.{ _call, _callreport, Lambda }

// Agent-context inference, as masks the engine can test against.  The rules here follow NetLogo's
// `parse.AgentTypeChecker`, which has already run over the AST by the time we compile: it annotates every instruction
// with the context it was found in and every procedure with the context it may be called from.  We re-derive the
// context because the annotation alone can't tell us whether the context was *known*: `fd` is annotated "-T--"
// whether it sits in `ask turtles [ ... ]` or in `ask some-variable [ ... ]`, and only the second needs a check.
//
// Masks match `engine/core/agentkinds.coffee`.
//
// -Jeremy B August 2026
object AgentContext {

  val Nothing:  Int = 0
  val Observer: Int = 1
  val Turtle:   Int = 2
  val Patch:    Int = 4
  val Link:     Int = 8

  // Desktop's answer when a block's agent kind can't be determined: some agent, but not the observer.
  val AnyAgent: Int = Turtle | Patch | Link
  val All:      Int = Observer | AnyAgent

  private val bits = Seq(('O', Observer), ('T', Turtle), ('P', Patch), ('L', Link))

  // "OTPL", with '-' for kinds that aren't allowed, e.g. "-T--" for turtle-only.
  def fromAgentClassString(acs: String): Int =
    bits.foldLeft(Nothing) { case (mask, (char, bit)) =>
      if (acs.indexOf(char.toInt) != -1) mask | bit else mask
    }

  def toAgentClassString(mask: Int): String =
    bits.map { case (char, bit) => if ((mask & bit) != 0) char else '-' }.mkString

  def requirementOf(instruction: Instruction): Int = {
    val instructionMask = fromAgentClassString(instruction.agentClassString)
    instruction match {
      case _call(proc)       => instructionMask & fromAgentClassString(proc.agentClassString)
      case _callreport(proc) => instructionMask & fromAgentClassString(proc.agentClassString)
      case _                 => instructionMask
    }
  }

  // The context a block argument of the current prim runs in.  Prims with no block class of their own (`if`, `while`,
  // `foreach`) run their blocks in the enclosing context; `hatch` and friends name a fixed one; "?" means it comes
  // from the prim's first argument, which is how `ask`, `with`, and `all?` work.  Anonymous procedures are not
  // handled here, their bodies are unconstrained by the enclosing context, so they compile against `All`
  // -Jeremy B August 2026
  def contextOfBlock(app: Application, enclosing: Int): Int =
    app.instruction.syntax.blockAgentClassString match {
      case None      => enclosing
      case Some("?") => contextOfFirstArg(app)
      case Some(acs) => fromAgentClassString(acs)
    }

  // Desktop looks at the first argument and nothing else, so `[ dx ] of turtles`, whose first argument is the
  // reporter block, not the agentset, gets `AnyAgent` and a runtime check.  -Jeremy B August 2026
  private def contextOfFirstArg(app: Application): Int =
    app.args.headOption match {
      case Some(r: ReporterApp) => kindOfReportedAgent(r)
      case _                    => AnyAgent
    }

  def kindOfReportedAgent(app: ReporterApp): Int = {
    val ret = app.reporter.syntax.ret & ~Syntax.NobodyType
    if (ret == Syntax.TurtleType || ret == Syntax.TurtlesetType)
      Turtle
    else if (ret == Syntax.PatchType || ret == Syntax.PatchsetType)
      Patch
    else if (ret == Syntax.LinkType || ret == Syntax.LinksetType)
      Link
    else if (ret == Syntax.AgentType || ret == Syntax.AgentsetType)
      // Prims like `with` and `at-points` report the same kind they were given.
      contextOfFirstArg(app)
    else
      AnyAgent
  }

  def contextOfAnonymousProcedure(lambda: Lambda): Int =
    lambda match {
      case i: Instruction => i.blockAgentClassString.map(fromAgentClassString).getOrElse(All)
      case _              => All
    }

  // The check that goes at the top of an anonymous procedure's body, which is where it gets run.
  def guardAnonymousProcedure(required: Int, primName: String, node: AstNode, bodyJs: String): String =
    if (isSatisfiedBy(required, All))
      bodyJs
    else {
      val location = node.sourceLocation
      s"PrimChecks.context.assertKind($required, '$primName', ${location.start}, ${location.end});\n$bodyJs"
    }

  // `ask` rejects only the world's own turtles and patches agentsets, and by identity (`agents eq world.turtles`),
  // not by syntax.  A `let` variable holding `turtles` is rejected too.  So the check is needed whenever the
  // expression might be holding one of those sets, but an expression that *builds* an agentset, or that reports a
  // single agent, provably can't be one.  Anything we can't classify still gets the check.  -Jeremy B August 2026
  def canBeWholeAgentSet(exp: Expression): Boolean =
    exp match {
      case r: ReporterApp =>
        r.reporter match {
          case _: prim._breed         | _: prim.etc._linkbreed  | _: prim.etc._links      |
               _: prim.etc._turtleset | _: prim.etc._patchset   | _: prim.etc._linkset    |
               _: prim._with          | _: prim._other          | _: prim._neighbors      |
               _: prim._neighbors4    | _: prim._turtle         | _: prim.etc._patch      |
               _: prim.etc._link      | _: prim._oneof          | _: prim.etc._myself     |
               _: prim.etc._self      | _: Optimizer._otherwith | _: Optimizer._oneofwith |
               _: Optimizer._patchatreporter                                              => false
          case _                                                                          => true
        }
      case _ => true
    }

  // Can code needing `required` run in `context` without a runtime check?
  def isSatisfiedBy(required: Int, context: Int): Boolean =
    (context & ~required) == 0

  // Desktop's interpreter tests every command it runs against the context it's running in, so a command whose
  // context we can't pin down at compile time gets the same test, in the same place.
  def guardStatement(stmt: Statement, statementJs: String, context: Int): String = {
    val required = requirementOf(stmt.command)
    if (statementJs.isEmpty || isSatisfiedBy(required, context))
      statementJs
    else
      s"PrimChecks.context.assertKind($required, ${primArgs(stmt, stmt.command)});\n$statementJs"
  }

  // The check desktop's `_of`, `_with`, and friends make on the agents they're about to run a block for: one test,
  // before iterating, against the strictest thing the block contains.  Returns the agents expression, wrapped when a
  // check is needed.
  def guardBlockAgents(app: Application, blockIndex: Int, agentsJs: String, context: Int): String =
    app.args.lift(blockIndex) match {
      case Some(block: ReporterBlock) if isFusedVariableOf(app, block) =>
        agentsJs
      case Some(block: ReporterBlock) =>
        val required = requirementOf(block.app.reporter)
        if (isSatisfiedBy(required, contextOfBlock(app, context)))
          agentsJs
        else
          s"PrimChecks.context.assertAgentSetKind($required, $agentsJs, ${primArgs(app, app.instruction)})"
      case _ =>
        agentsJs
    }

  // Desktop's middle end fuses `[ <an agent variable> ] of <agentset>` into a single prim (`_turtlevariableof` and
  // friends) that reads the variable agent by agent and reports its own error, so the agentset never gets an
  // agent-kind check there.  `[ who ] of links` is a variable error on desktop, not a context error.
  private def isFusedVariableOf(app: Application, block: ReporterBlock): Boolean =
    app.instruction.isInstanceOf[prim._of] && (block.app.reporter match {
      case _: prim._turtlevariable | _: prim._patchvariable | _: prim._linkvariable |
           _: prim._turtleorlinkvariable | _: prim._breedvariable | _: prim._linkbreedvariable => true
      case _                                                                                   => false
    })

  // Prims the optimizer synthesized have no token of their own, so the name falls back to the class and the
  // position comes from the node in the source tree.
  private def primArgs(node: SourceLocatable, instruction: Instruction): String = {
    val name     = Option(instruction.token).map(_.text).getOrElse(instruction.getClass.getSimpleName.stripPrefix("_"))
    val location = node.sourceLocation
    s"'${name.toLowerCase}', ${location.start}, ${location.end}"
  }

}
