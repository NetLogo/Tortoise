// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.core.{ Command, Syntax }

import
  org.nlogo.core.{ prim, AstTransformer, ProcedureDefinition, ReporterApp, Statement },
    prim.{ _const, _fd }

package optimize {
  class _fdone extends Command {
    override def syntax =
      Syntax.commandSyntax(agentClassString = "-T--")
  }

  object Optimizer {
    def apply(pd: ProcedureDefinition): ProcedureDefinition = {
      Fd1Transformer.visitProcedureDefinition(pd)
    }
  }

  object Fd1Transformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement.command match {
        case f: _fd => statement.args(0) match {
          case ra: ReporterApp => ra.reporter match {
            case c: _const if c.value == 1 => statement.copy(command = new _fdone, args = Seq())
            case _ => super.visitStatement(statement)
          }
          case _ => super.visitStatement(statement)
        }
        case _   => super.visitStatement(statement)
      }
    }
  }
}
