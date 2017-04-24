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
      val newDef = Fd1Transformer.visitProcedureDefinition(pd)
      FdLessThan1Transformer.visitProcedureDefinition(newDef)
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
      statement match {
        case Statement(command: _fd, Seq(ReporterApp(_const(value: java.lang.Double), _, _)), _) if ((value > -1) && (value < 1)) => statement.copy(command = new _fdlessthan1)
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
