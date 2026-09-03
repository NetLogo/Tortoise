// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{
    CommandBlock,
    Expression,
    Instruction,
    ProcedureDefinition,
    ReporterApp,
    ReporterBlock,
    SourceLocation,
    Statement,
    Statements
  }

// Code compiled inside a synthetic wrapper (a `run` string, the command center, a widget) needs the wrapper's header
// subtracted back out.  Otherwise every position is off by the header's length and points into a string the user never
// saw.  We do it at emission time, so every consumer of the positions gets them right.  -Jeremy B August 2026
object SourceRebaser {

  def apply(pd: ProcedureDefinition, offset: Int): ProcedureDefinition =
    if (offset <= 0)
      pd
    else
      pd.copy(statements = rebase(pd.statements, offset))

  private def shift(position: Int, offset: Int): Int =
    math.max(0, position - offset)

  private def shift(location: SourceLocation, offset: Int): SourceLocation =
    location.copy(start = shift(location.start, offset), end = shift(location.end, offset))

  private def rebase(instruction: Instruction, offset: Int): Unit = {
    if (instruction.token != null)
      instruction.token = instruction.token.copy()(shift(instruction.token.sourceLocation, offset))
  }

  private def rebase(statements: Statements, offset: Int): Statements =
    statements.copy(stmts = statements.stmts.map( (s) => rebase(s, offset) ))

  private def rebase(statement: Statement, offset: Int): Statement = {
    rebase(statement.command, offset)
    statement.copy(args = statement.args.map( (e) => rebase(e, offset) ), location = shift(statement.sourceLocation, offset))
  }

  private def rebase(app: ReporterApp, offset: Int): ReporterApp = {
    rebase(app.reporter, offset)
    app.copy(args = app.args.map( (e) => rebase(e, offset) ), location = shift(app.sourceLocation, offset))
  }

  private def rebase(expression: Expression, offset: Int): Expression =
    expression match {
      case r: ReporterApp   => rebase(r, offset)
      case b: ReporterBlock => b.copy(app = rebase(b.app, offset), location = shift(b.sourceLocation, offset))
      // `CommandBlock.copy()` ignores the location you give it, so we have to rebuild the block.
      case c: CommandBlock  => new CommandBlock(rebase(c.statements, offset), shift(c.sourceLocation, offset), c.synthetic)
      case e                => e
    }

}
