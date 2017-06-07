package org.nlogo.tortoise

import
  org.nlogo.core.{ Command, Syntax, Reporter },
    Syntax.{ NumberType, PatchsetType }

import 
  org.nlogo.core.{ prim, AstTransformer, ProcedureDefinition, ReporterApp, Statement, NetLogoCore, ReporterBlock, CommandBlock },
    prim.{ _const, _fd, _other, _any, _count, _with, _patches, _procedurevariable, _patchvariable, _observervariable, _equal, _createturtles, _createorderedturtles, _hatch }

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

  class _fdlessthan1 extends Command {
    override def syntax = 
      Syntax.commandSyntax(agentClassString = "-T--")
  }

  object FdLessThan1Transformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _fd, Seq(ReporterApp(_const(value: java.lang.Double), _, _)), _) if ((value > -1) && (value < 1)) => statement.copy(command = new _fdlessthan1)
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _hatchfast(val breedName: String) extends Command {
    override def syntax = 
      Syntax.commandSyntax(agentClassString = "-T--")
  }
  object HatchFastTransformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _hatch, Seq(_, cmdBlock: CommandBlock), _) if cmdBlock.statements.stmts.isEmpty => statement.copy(command = new _hatchfast(command.breedName: String))
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _crtfast(val breedName: String) extends Command {
    override def syntax = 
      Syntax.commandSyntax(agentClassString = "-T--")
  }
  object CrtFastTransformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _createturtles, Seq(ReporterApp(reporter: _const, args, loc), cmdBlock: CommandBlock), _) if cmdBlock.statements.stmts.isEmpty =>
          statement.copy(command = new _crtfast(command.breedName: String), args = Seq(new ReporterApp(reporter, args, loc), cmdBlock))
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _crofast(val breedName: String) extends Command {
    override def syntax = 
      Syntax.commandSyntax(agentClassString = "-T--")
  }
  object CroFastTransformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _createorderedturtles, Seq(_, cmdBlock: CommandBlock), _) if cmdBlock.statements.stmts.isEmpty =>
          statement.copy(command = new _crofast(command.breedName: String))
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _anyother extends Reporter {
    override def syntax = 
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType), ret = Syntax.BooleanType)
  }

  object AnyOtherTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(reporter: _any, Seq(ReporterApp(other: _other, otherArgs, _)), _) => ra.copy(reporter = new _anyother, args = otherArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  class _countother extends Reporter {
    override def syntax = 
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType), ret = Syntax.BooleanType)
  }

  object CountOtherTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(reporter: _count, Seq(ReporterApp(other: _other, countArgs, _)), _) => ra.copy(reporter = new _countother, args = countArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  class _patchcol extends Reporter {
    override def syntax = 
      Syntax.reporterSyntax(ret = PatchsetType, right = List(NumberType))
  }

  class _patchrow extends Reporter {
    override def syntax = 
      Syntax.reporterSyntax(ret = PatchsetType, right = List(NumberType))
  }

  object WithTransformer extends AstTransformer {
    val pxcor: Int = NetLogoCore.agentVariables.implicitPatchVariableTypeMap.keys.toList.indexOf("PXCOR")
    val pycor: Int = NetLogoCore.agentVariables.implicitPatchVariableTypeMap.keys.toList.indexOf("PYCOR")
    def patchRegion(p: _patchvariable, newRa: ReporterApp, ra: ReporterApp): ReporterApp = {
      p.vn match {
        case `pxcor` if unchangingInWith(newRa) => ra.copy(reporter = new _patchcol, args = Seq(newRa))
        case `pycor` if unchangingInWith(newRa) => ra.copy(reporter = new _patchrow, args = Seq(newRa))
        case _ => super.visitReporterApp(ra)
      }
    }
    def unchangingInWith(repApp: ReporterApp): Boolean = {
      repApp match {
        case ReporterApp(const: _const, _, _) => true
        case ReporterApp(observerRep: _observervariable, _, _) => true
        case ReporterApp(procedureRep: _procedurevariable, _, _) => true
        case _ => false
      }
    }
    object PatchVarEqualExpression {
      def unapply(repApp: ReporterApp): Option[(_patchvariable, ReporterApp)] = 
        repApp match {
          case ReporterApp(equal: _equal, Seq(ReporterApp(p: _patchvariable, patchArgs, patchSrc), newRa: ReporterApp), _) => Some((p, newRa))
          case ReporterApp(equal: _equal, Seq(newRa: ReporterApp, ReporterApp(p: _patchvariable, patchArgs, patchSrc)), _) => Some((p, newRa))
          case _ => None
        }
    }
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(reporter: _with, Seq(ReporterApp(patches: _patches, _, _), ReporterBlock(PatchVarEqualExpression(p, newRa), _)), _) => {
          patchRegion(p, newRa, ra)
        }
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  def apply(pd: ProcedureDefinition): ProcedureDefinition = {
    val newDef = Fd1Transformer.visitProcedureDefinition(pd)
    val newDef1 = FdLessThan1Transformer.visitProcedureDefinition(newDef)
    val newDef2 = CountOtherTransformer.visitProcedureDefinition(newDef1)
    val newDef3 = WithTransformer.visitProcedureDefinition(newDef2)
    val newDef4 = CrtFastTransformer.visitProcedureDefinition(newDef3)
    val newDef5 = CroFastTransformer.visitProcedureDefinition(newDef4)
    val newDef6 = HatchFastTransformer.visitProcedureDefinition(newDef5)
    AnyOtherTransformer.visitProcedureDefinition(newDef6)
  }
}
