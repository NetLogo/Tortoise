// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{ Command, Syntax, Reporter },
    Syntax.{ NumberType, PatchsetType }

import
  org.nlogo.core.{ prim, AstTransformer, ProcedureDefinition, ReporterApp, Statement, NetLogoCore, CommandBlock, ReporterBlock },
    prim.{ _any, _const, _count, _createorderedturtles, _createturtles, _equal, _fd, _hatch, _neighbors, _neighbors4
         , _observervariable, _of, _oneof, _other, _patches, _patchvariable, _procedurevariable, _sprout, _sum, _with }

object Optimizer {

  // scalastyle:off class.name
  // scalastyle:off number.of.types
  class _fdone extends Command {
    override def syntax: Syntax =
      Syntax.commandSyntax(agentClassString = "-T--")
  }
  object Fd1Transformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _fd, Seq(ReporterApp(reporter: _const, _, _)), _) if reporter.value == 1 =>
          statement.copy(command = new _fdone, args = Seq())
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _fdlessthan1 extends Command {
    override def syntax: Syntax =
      Syntax.commandSyntax(agentClassString = "-T--")
  }

  object FdLessThan1Transformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _fd, Seq(ReporterApp(_const(value: java.lang.Double), _, _)), _) if ((value > -1) && (value < 1)) =>
          statement.copy(command = new _fdlessthan1)
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _hatchfast(val breedName: String) extends Command {
    override def syntax: Syntax =
      Syntax.commandSyntax(agentClassString = "-T--")
  }

  object HatchFastTransformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _hatch, Seq(_, cmdBlock: CommandBlock), _) if cmdBlock.statements.stmts.isEmpty =>
          statement.copy(command = new _hatchfast(command.breedName: String))
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _sproutfast(val breedName: String) extends Command {
    override def syntax: Syntax =
      Syntax.commandSyntax(agentClassString = "--P-")
  }

  object SproutFastTransformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _sprout, Seq(_, cmdBlock: CommandBlock), _) if cmdBlock.statements.stmts.isEmpty =>
          statement.copy(command = new _sproutfast(command.breedName: String))
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _crtfast(val breedName: String) extends Command {
    override def syntax: Syntax =
      Syntax.commandSyntax(agentClassString = "-T--")
  }

  object CrtFastTransformer extends AstTransformer {
    override def visitStatement(statement: Statement): Statement = {
      statement match {
        case Statement(command: _createturtles, Seq(_, cmdBlock: CommandBlock), _) if cmdBlock.statements.stmts.isEmpty =>
          statement.copy(command = new _crtfast(command.breedName: String))
        case _ => super.visitStatement(statement)
      }
    }
  }

  class _crofast(val breedName: String) extends Command {
    override def syntax: Syntax =
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
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType), ret = Syntax.BooleanType)
  }

  object AnyOtherTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(reporter: _any, Seq(ReporterApp(other: _other, otherArgs, _)), _) =>
          ra.copy(reporter = new _anyother, args = otherArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  class _countother extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType), ret = Syntax.BooleanType)
  }

  object CountOtherTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(reporter: _count, Seq(ReporterApp(other: _other, countArgs, _)), _) =>
          ra.copy(reporter = new _countother, args = countArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  class _oneofwith extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType, Syntax.ReporterBlockType), ret = Syntax.AgentType)
  }

  object OneOfWithTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _oneof, Seq(ReporterApp(_: _with, args, _)), _) =>
          ra.copy(reporter = new _oneofwith, args = args)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  class _otherwith extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType, Syntax.ReporterBlockType), ret = Syntax.AgentsetType)
    }

  object OtherWithTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _other, Seq(ReporterApp(_: _with, otherArgs, _)), _) =>
          ra.copy(reporter = new _otherwith, args = otherArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  object WithOtherTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _with, Seq(ReporterApp(_: _other, otherArgs, _), x), _) =>
          ra.copy(reporter = new _otherwith, args = otherArgs :+ x)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  class NeighborTransformer extends AstTransformer {
    def visitNeighbor(ra: ReporterApp, check: Reporter => Boolean, make: String => Reporter): ReporterApp = {
      ra match {
        case ReporterApp(
               _: _sum
               , Seq(
                   ReporterApp(
                     _: _of
                   , Seq(ReporterBlock(ReporterApp(p: _patchvariable, _, _), _), rapp: ReporterApp)
                   , _
                   )
                 )
               , _
             ) if check(rapp.reporter) =>
          ra.copy(reporter = make(p.displayName.toLowerCase))
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  class _nsum(val varName: String) extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType), ret = Syntax.NumberType, agentClassString = "-TP-")
  }

  object NSumTransformer extends NeighborTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp =
      visitNeighbor(ra, (r) => r.isInstanceOf[_neighbors], (s) => new _nsum(s))
  }

  class _nsum4(val varName: String) extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType), ret = Syntax.NumberType, agentClassString = "-TP-")
  }

  object NSum4Transformer extends NeighborTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp =
      visitNeighbor(ra, (r) => r.isInstanceOf[_neighbors4], (s) => new _nsum4(s))
  }

  class _patchcol extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(ret = PatchsetType, right = List(NumberType))
  }

  class _patchrow extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(ret = PatchsetType, right = List(NumberType))
  }
  // scalastyle:on number.of.types
  // scalastyle:on class.name

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
        case ReporterApp(reporter: _with, Seq(ReporterApp(patches: _patches, _, _), ReporterBlock(PatchVarEqualExpression(p, newRa), _)), _) =>
          patchRegion(p, newRa, ra)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  def apply(pd: ProcedureDefinition): ProcedureDefinition =
    (Fd1Transformer        .visitProcedureDefinition _ andThen
     FdLessThan1Transformer.visitProcedureDefinition   andThen
     CountOtherTransformer .visitProcedureDefinition   andThen
     WithTransformer       .visitProcedureDefinition   andThen
     CrtFastTransformer    .visitProcedureDefinition   andThen
     CroFastTransformer    .visitProcedureDefinition   andThen
     HatchFastTransformer  .visitProcedureDefinition   andThen
     SproutFastTransformer .visitProcedureDefinition   andThen
     NSumTransformer       .visitProcedureDefinition   andThen
     NSum4Transformer      .visitProcedureDefinition   andThen
     OneOfWithTransformer  .visitProcedureDefinition   andThen
     AnyOtherTransformer   .visitProcedureDefinition   andThen
     WithOtherTransformer  .visitProcedureDefinition   andThen
     OtherWithTransformer  .visitProcedureDefinition
    )(pd)

}
