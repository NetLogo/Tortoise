// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{ Application, AstNode, Expression, Instruction, Reporter, ReporterApp, ReporterBlock,
                   SourceLocatable, Statement, Syntax }

import
  org.nlogo.core.prim,
    prim.{ _call, _callreport, Lambda }

// We work out agent context as masks the engine can test against.  The rules follow NetLogo's `parse.AgentTypeChecker`,
// which has already run over the AST by the time we get here.  It annotates every instruction with the context it was
// found in, and every procedure with the context it may be called from.
//
// So why do it all over again?  Because the annotation on its own can't tell us whether the context was *known*.  `fd`
// is annotated "-T--" whether it sits in `ask turtles [ ... ]` or in `ask some-variable [ ... ]`, and only the second
// one needs a check.
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

  // When desktop can't pin down a block's agent kind, this is what it settles for: some agent, but not the observer.
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

  // Which context does a block argument of the current prim run in?  Prims with no block class of their own (`if`,
  // `while`, `foreach`) run their blocks in the enclosing context, and `hatch` and friends name a fixed one.  A "?"
  // means it comes from the prim's agentset argument and nothing else, which is how `ask`, `with`, and `all?` work.
  // `of` keeps its block there instead, so it lands on `AnyAgent` here and `guardBlockAgents` asks its agents itself.
  //
  // Anonymous procedures don't come through here.  Their bodies aren't constrained by the enclosing context, so they
  // compile against `All`.  -Jeremy B August 2026
  def contextOfBlock(app: Application, enclosing: Int): Int =
    app.instruction.syntax.blockAgentClassString match {
      case None      => enclosing
      case Some("?") => kindOfAgentsAt(app, agentSetArgOf(app.instruction))
      case Some(acs) => fromAgentClassString(acs)
    }

  // Which argument does a prim's agentset come from?  This is only for the prims that take one and then report or run a
  // block for the kind they were given.  Desktop assumes the first argument, both here and in `getReportedAgentType`,
  // which is wrong for the `n-of` family, where the count comes first.  Desktop only loses a little precision by that,
  // since it checks every instruction at runtime anyway.  We decide whether to emit a check at all, so it costs us
  // checks we could have elided.  -Jeremy B September 2026
  private def agentSetArgOf(instruction: Instruction): Int =
    instruction match {
      case _: prim.etc._nof | _: prim.etc._uptonof | _: prim.etc._maxnof | _: prim.etc._minnof => 1
      case _                                                                                   => 0
    }

  // These filter or sample the agentset they were handed, so they report that agentset's kind, but their return type
  // says only that some agentset is coming back.  Desktop's `getReportedAgentType` covers that case just when the type
  // is exactly `AgentType`/`AgentsetType`, so these fall through to "-TPL" there.
  private def reportsItsAgentSetKind(reporter: Reporter): Boolean =
    reporter match {
      case _: prim._inradius | _: prim.etc._incone | _: prim.etc._nof | _: prim.etc._uptonof => true
      case _                                                                                 => false
    }

  def kindOfReportedAgent(app: ReporterApp): Int = {
    val ret = agentSetTypeOf(app) & ~Syntax.NobodyType
    if (ret == Syntax.TurtleType || ret == Syntax.TurtlesetType)
      Turtle
    else if (ret == Syntax.PatchType || ret == Syntax.PatchsetType)
      Patch
    else if (ret == Syntax.LinkType || ret == Syntax.LinksetType)
      Link
    else if (ret == Syntax.AgentType || ret == Syntax.AgentsetType || reportsItsAgentSetKind(app.reporter))
      // Prims like `with` and `at-points` report the same kind they were given.
      kindOfAgentsAt(app, agentSetArgOf(app.reporter))
    else
      AnyAgent
  }

  def contextOfAnonymousProcedure(lambda: Lambda): Int =
    lambda match {
      case i: Instruction => i.blockAgentClassString.map(fromAgentClassString).getOrElse(All)
      case _              => All
    }

  // The check can't go where the anonymous procedure was written, since the context there says nothing about who'll end
  // up running it.  So it goes at the top of the body instead.
  def guardAnonymousProcedure(required: Int, primName: String, node: AstNode, bodyJs: String): String =
    if (isSatisfiedBy(required, All))
      bodyJs
    else {
      val location = node.sourceLocation
      s"PrimChecks.context.assertKind($required, '$primName', ${location.start}, ${location.end});\n$bodyJs"
    }

  // `ask` rejects only the world's own turtles and patches agentsets, and it does that by identity
  // (`agentset == world.turtles()` in desktop's `_ask`), not by syntax.  A `let` variable holding `turtles` is rejected
  // too.
  //
  // So we need the check whenever the expression might be holding one of those two objects, and that rules out two
  // whole classes of expression: one that can't report a turtleset or a patchset at all, and one that reports an
  // agentset of its own.  Anything we can't classify still gets the check.  -Jeremy B August 2026
  def canBeWholeAgentSet(exp: Expression): Boolean =
    if ((agentSetTypeOf(exp) & (Syntax.TurtlesetType | Syntax.PatchsetType)) == 0)
      false
    else
      exp match {
        case r: ReporterApp => !reportsAnotherAgentSet(r.reporter)
        case _              => true
      }

  // `one-of` can report anything, since it can take an arbitrary list.  But when it's handed an agentset it reports a
  // single agent, and that's a very common case, so we do a little extra work here to keep it unchecked.
  // -Jeremy B September 2026
  //
  // `kindOfReportedAgent` goes through here too, so `ask one-of turtles [ ... ]` gets a turtle context instead of
  // "some agent" and everything in the block goes unchecked.  Desktop can't do that, its `getReportedAgentType` only
  // ever looks at the return type.  -Jeremy B September 2026
  private def agentSetTypeOf(exp: Expression): Int =
    exp match {
      case r: ReporterApp if r.reporter.isInstanceOf[prim._oneof] =>
        if (r.args.headOption.exists( (a) => (a.reportedType() & Syntax.ListType) != 0 ))
          r.reportedType()
        else
          Syntax.AgentType
      case _ =>
        exp.reportedType()
    }

  // These report an agentset of their own rather than the world's: a set built on the spot, or a stored one (a breed,
  // `no-turtles`) that is never the identical object `ask` rejects.  Only prims that can report a turtleset or a
  // patchset need to be here, the rest are handled by type.  -Jeremy B September 2026
  private def reportsAnotherAgentSet(reporter: Reporter): Boolean =
    reporter match {
      case _: prim._breed                 | _: prim._breedon              | _: prim._inradius   |
           _: prim._neighbors             | _: prim._neighbors4           | _: prim._other      |
           _: prim._turtleson             | _: prim._whoarenot            | _: prim._with       |
           _: prim.etc._atpoints          | _: prim.etc._bothends         | _: prim.etc._breedat |
           _: prim.etc._breedhere         | _: prim.etc._incone           | _: prim.etc._maxnof |
           _: prim.etc._inlinkneighbors   | _: prim.etc._linkneighbors    | _: prim.etc._minnof |
           _: prim.etc._nof               | _: prim.etc._nopatches        | _: prim.etc._noturtles |
           _: prim.etc._outlinkneighbors  | _: prim.etc._patchset         | _: prim.etc._turtlesat |
           _: prim.etc._turtleset         | _: prim.etc._turtleshere      | _: prim.etc._uptonof |
           _: prim.etc._withmax           | _: prim.etc._withmin          | _: Optimizer._otherwith => true
      case _                                                                                       => false
    }

  // Can code needing `required` run in `context` without a runtime check?
  def isSatisfiedBy(required: Int, context: Int): Boolean =
    (context & ~required) == 0

  // Desktop's interpreter tests every command it runs against the context it's running in.  So a command whose context
  // we can't pin down at compile time gets the same test, in the same place.
  def guardStatement(stmt: Statement, statementJs: String, context: Int): String = {
    val required = requirementOf(stmt.command)
    if (statementJs.isEmpty || isSatisfiedBy(required, context))
      statementJs
    else
      s"PrimChecks.context.assertKind($required, ${primArgs(stmt, stmt.command)});\n$statementJs"
  }

  // Desktop's `_of`, `_with`, and friends check the agents they're about to run a block for once, before iterating,
  // against the strictest thing the block contains.  We do the same, and hand back the agents expression wrapped when a
  // check is needed.  `agentsIndex` is the argument the agents come from, which isn't the same for every prim.  `of`
  // takes its block first, `with` and `max-n-of` take it last.
  def guardBlockAgents(app: Application, blockIndex: Int, agentsIndex: Int, agentsJs: String, context: Int): String =
    app.args.lift(blockIndex) match {
      case Some(block: ReporterBlock) if isFusedVariableOf(app, block) =>
        agentsJs
      case Some(block: ReporterBlock) =>
        val required = requirementOf(block.app.reporter)
        // `of` names the agents in its second argument, where `contextOfBlock` can't see them, since it follows desktop
        // in only ever looking at the first.  So ask the agents themselves too.  -Jeremy B September 2026
        if (isSatisfiedBy(required, contextOfBlock(app, context)) || isSatisfiedBy(required, kindOfAgentsAt(app, agentsIndex)))
          agentsJs
        else
          s"PrimChecks.context.assertAgentSetKind($required, $agentsJs, ${primArgs(app, app.instruction)})"
      case _ =>
        agentsJs
    }

  private def kindOfAgentsAt(app: Application, agentsIndex: Int): Int =
    app.args.lift(agentsIndex) match {
      case Some(r: ReporterApp) => kindOfReportedAgent(r)
      case _                    => AnyAgent
    }

  // Desktop's middle end fuses `[ <an agent variable> ] of <agentset>` into a single prim (`_turtlevariableof` and
  // friends) that reads the variable agent by agent and reports its own error, so the agentset never gets an agent-kind
  // check there.  `[ who ] of links` is a variable error on desktop, not a context error.
  private def isFusedVariableOf(app: Application, block: ReporterBlock): Boolean =
    app.instruction.isInstanceOf[prim._of] && (block.app.reporter match {
      case _: prim._turtlevariable | _: prim._patchvariable | _: prim._linkvariable |
           _: prim._turtleorlinkvariable | _: prim._breedvariable | _: prim._linkbreedvariable => true
      case _                                                                                   => false
    })

  // Prims the optimizer synthesized have no token of their own, so the name falls back to the class and the position
  // comes from the node in the tree.
  private def primArgs(node: SourceLocatable, instruction: Instruction): String = {
    val name     = Option(instruction.token).map(_.text).getOrElse(instruction.getClass.getSimpleName.stripPrefix("_"))
    val location = node.sourceLocation
    s"'${name.toLowerCase}', ${location.start}, ${location.end}"
  }

}
