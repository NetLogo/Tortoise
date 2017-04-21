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

  class _fdlessthan1 extends Command {
    override def syntax = 
      Syntax.commandSyntax(agentClassString = "-T--")
  }

  class _randomconst extends Command {
    override def syntax = 
      Syntax.commandSyntax(agentClassString = "OTPL")
  }

  object Optimizer {
    def apply(pd: ProcedureDefinition): ProcedureDefinition = {
      Fd1Transformer.visitProcedureDefinition(pd)
    }
  }

  object Fd1Transformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _fd, Seq(ReporterApp(reporter: _const, _, _)), _) if reporter.value == 1 => statement.copy(command = new _fdone, args = Seq())
        case _ => super.visitStatement(statement)
      }
    }
  }

  object FdLessThan1Transformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement.command match {
        case f: _fd => statement.args(0) match {
          case ra: ReporterApp => ra.reporter match {
            case c: _const => c.value match {
              case d: java.lang.Double if ((d > -1) && (d < 1)) => statement.copy(command = new _fdlessthan1)
              case _ => super.visitStatement(statement)
            }
            case _ => super.visitStatement(statement)
          }
          case _ => super.visitStatement(statement)
        }
        case _ => super.visitStatement(statement)
      }
    }
  }

  object AnyOtherTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(reporter: _any, Seq(other: _other, _*), _) => ra.copy(reporter = new _anyother)
        case _ => super.visitReporterApp(ra)
      }
    }
  }
}
