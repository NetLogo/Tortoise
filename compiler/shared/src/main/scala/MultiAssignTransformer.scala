// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.core.{ AstTransformer, ProcedureDefinition, ReporterApp, Statement, Statements }
import org.nlogo.core.prim.{ _let, _multiassignitem }

object MultiAssignTransformer {
  // NetLogo desktop creates synthetic let statements for _multiassign that get their values from an intermediate
  // construct that holds the list of values to be assigned.  This is necessary there because they can't translate it to
  // a real destructured assignment.  In JavaScript we can use a destructured assignment language construct, so we have
  // no need of the synthetic extras.  So we sot them.  -Jeremy B November 2023
  object MultiLetRemover extends AstTransformer {
    private def dropMultiLetStmts(stmts: Seq[Statement]): Seq[Statement] = {
      val results = stmts.filter( (s) => {
        !(s.command.isInstanceOf[_let] &&
          s.args.length == 1 &&
          s.args(0).isInstanceOf[ReporterApp] &&
          s.args(0).asInstanceOf[ReporterApp].reporter.isInstanceOf[_multiassignitem])
      })
      results
    }

    override def visitStatements(statements: Statements): Statements = {
      val newStmts = dropMultiLetStmts(statements.stmts).map(super.visitStatement)
      statements.copy(stmts = newStmts)
    }

  }

  def apply(pd: ProcedureDefinition): ProcedureDefinition =
    (
      MultiLetRemover.visitProcedureDefinition
    )(pd)
}
