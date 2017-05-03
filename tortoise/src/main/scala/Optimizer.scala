package org.nlogo.tortoise

import
  org.nlogo.core.{ Command, Syntax, Reporter }

import 
	org.nlogo.core.{ prim, AstTransformer, ProcedureDefinition, ReporterApp, Statement },
		prim.{ _const, _fd }

object Optimizer {

	class _fdone extends Command {
    override def syntax =
      Syntax.commandSyntax(agentClassString = "-T--")
  }
  object Fd1Transformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _fd, Seq(ReporterApp(reporter: _const, _, _)), _) if reporter.value == 1 => statement.copy(command = new _fdone, args = Seq())
        case _ => super.visitStatement(statement)
      }
  	}
	}

}