// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{ Command, Syntax, Reporter },
    Syntax.{ NumberType, PatchsetType }

import
  org.nlogo.core.{ prim, AstTransformer, ProcedureDefinition, ReporterApp, Statement, NetLogoCore, CommandBlock, ReporterBlock },
    prim.{ _any, _const, _count, _createorderedturtles, _createturtles, _equal, _fd, _greaterthan, _hatch, _lessthan,
      _neighbors, _neighbors4, _not, _notequal, _observervariable, _of, _oneof, _other, _patchat, _patches, _patchvariable,
      _procedurevariable, _sprout, _sum, _with }

// scalastyle:off number.of.methods
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

  abstract class _patchatreporter extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.NumberType, Syntax.NumberType), ret = Syntax.AgentType)
  }

  class _patchhereinternal extends _patchatreporter {}
  class _patchnorth        extends _patchatreporter {}
  class _patcheast         extends _patchatreporter {}
  class _patchsouth        extends _patchatreporter {}
  class _patchwest         extends _patchatreporter {}
  class _patchne           extends _patchatreporter {}
  class _patchse           extends _patchatreporter {}
  class _patchsw           extends _patchatreporter {}
  class _patchnw           extends _patchatreporter {}

  object PatchAtTransformer extends AstTransformer {
    // scalastyle:off cyclomatic.complexity
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(reporter: _patchat,
          Seq(ReporterApp(_const(x: java.lang.Double), _, _),
            ReporterApp(_const(y: java.lang.Double), _, _)), _) =>
          (x, y) match {
            case _ if x ==  0 && y ==  0 => ra.copy(reporter = new _patchhereinternal )
            case _ if x ==  0 && y == -1 => ra.copy(reporter = new _patchsouth )
            case _ if x ==  0 && y ==  1 => ra.copy(reporter = new _patchnorth )
            case _ if x == -1 && y ==  0 => ra.copy(reporter = new _patchwest )
            case _ if x == -1 && y == -1 => ra.copy(reporter = new _patchsw )
            case _ if x == -1 && y ==  1 => ra.copy(reporter = new _patchnw )
            case _ if x ==  1 && y ==  0 => ra.copy(reporter = new _patcheast )
            case _ if x ==  1 && y == -1 => ra.copy(reporter = new _patchse )
            case _ if x ==  1 && y ==  1 => ra.copy(reporter = new _patchne )
            case _ => super.visitReporterApp(ra)
          }
        case _ => super.visitReporterApp(ra)
      }
    }
    // scalastyle:on cyclomatic.complexity
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

  class _countotherwith extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType, Syntax.ReporterBlockType), ret = Syntax.NumberType)
  }

  object CountOtherWithTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _count, Seq(ReporterApp(_: _otherwith, otherWithArgs, _)), _) =>
          ra.copy(reporter = new _countotherwith, args = otherWithArgs)
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

  class _anyotherwith extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType, Syntax.ReporterBlockType), ret = Syntax.BooleanType)
  }

  object AnyOtherWithTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _any, Seq(ReporterApp(_: _otherwith, otherWithArgs, _)), _) =>
          ra.copy(reporter = new _anyotherwith, args = otherWithArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  class _anywith extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType, Syntax.ReporterBlockType), ret = Syntax.BooleanType)
  }

  // _any(_with) => _anywith
  object AnyWith1Transformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _any, Seq(ReporterApp(_: _with, withArgs, _)), _) =>
          ra.copy(reporter = new _anywith, args = withArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  // _notequal(_countwith(*, *), _constdouble: 0.0) => _anywith(*, *)
  object AnyWith2Transformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _notequal, Seq(
              ReporterApp(_: _count, Seq(ReporterApp(_: _with, withArgs, _)), _),
              ReporterApp(reporter: _const, _, _)
            ), _) if reporter.value == 0 =>
          ra.copy(reporter = new _anywith, args = withArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  // _greaterthan(_countwith(*, *), _constdouble: 0.0) => _anywith(*, *)
  object AnyWith3Transformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _greaterthan, Seq(
              ReporterApp(_: _count, Seq(ReporterApp(_: _with, withArgs, _)), _),
              ReporterApp(reporter: _const, _, _)
            ), _) if reporter.value == 0 =>
          ra.copy(reporter = new _anywith, args = withArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  // _lessthan(_constdouble: 0.0, _countwith(*, *)) => _anywith(*, *)
  object AnyWith4Transformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _lessthan, Seq(
              ReporterApp(reporter: _const, _, _),
              ReporterApp(_: _count, Seq(ReporterApp(_: _with, withArgs, _)), _)
            ), _) if reporter.value == 0 =>
          ra.copy(reporter = new _anywith, args = withArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  // _equal(_countwith(*, *), _constdouble: 0.0) => _not(_anywith(*, *))
  object AnyWith5Transformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _equal, Seq(
              ReporterApp(_: _count, Seq(ReporterApp(_: _with, withArgs, _)), _),
              ReporterApp(reporter: _const, _, _)
            ), _) if reporter.value == 0 =>
          ra.copy(reporter = new _not, args = Seq(ra.copy(reporter = new _anywith, args = withArgs)))
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

  class _optimizecount(val operator: String, val checkValue: Double) extends Reporter {
    override def syntax: Syntax =
      Syntax.reporterSyntax(right = List(Syntax.AgentsetType), ret = Syntax.BooleanType)
  }
  // scalastyle:on number.of.types
  // scalastyle:on class.name

  object OptimizeCountTransformer extends AstTransformer {
    override def visitReporterApp(ra: ReporterApp): ReporterApp = {
      ra match {
        case ReporterApp(_: _notequal, Seq(
             ReporterApp(_: _count, countArgs, _),
             ReporterApp(reporter: _const, _, _)
          ), _) =>
          ra.copy(reporter = new _optimizecount("(a, b) => a !== b": String, reporter.value.asInstanceOf[Double]: Double), args = countArgs)
        case ReporterApp(_: _greaterthan, Seq(
             ReporterApp(_: _count, countArgs, _),
             ReporterApp(reporter: _const, _, _)
          ), _) =>
          ra.copy(reporter = new _optimizecount("(a, b) => a > b": String, reporter.value.asInstanceOf[Double]: Double), args = countArgs)
        case ReporterApp(_: _lessthan, Seq(
             ReporterApp(_: _count, countArgs, _),
             ReporterApp(reporter: _const, _, _)
          ), _) =>
          ra.copy(reporter = new _optimizecount("(a, b) => a < b": String, reporter.value.asInstanceOf[Double]: Double), args = countArgs)
        case ReporterApp(_: _equal, Seq(
             ReporterApp(_: _count, countArgs, _),
             ReporterApp(reporter: _const, _, _)
          ), _) =>
          ra.copy(reporter = new _optimizecount("(a, b) => a === b": String, reporter.value.asInstanceOf[Double]: Double), args = countArgs)
        case _ => super.visitReporterApp(ra)
      }
    }
  }

  def apply(pd: ProcedureDefinition): ProcedureDefinition =
    (Fd1Transformer            .visitProcedureDefinition _ andThen
     FdLessThan1Transformer    .visitProcedureDefinition   andThen
     WithTransformer           .visitProcedureDefinition   andThen
     CrtFastTransformer        .visitProcedureDefinition   andThen
     CroFastTransformer        .visitProcedureDefinition   andThen
     PatchAtTransformer        .visitProcedureDefinition   andThen
     HatchFastTransformer      .visitProcedureDefinition   andThen
     SproutFastTransformer     .visitProcedureDefinition   andThen
     NSumTransformer           .visitProcedureDefinition   andThen
     NSum4Transformer          .visitProcedureDefinition   andThen
     OneOfWithTransformer      .visitProcedureDefinition   andThen
     OtherWithTransformer      .visitProcedureDefinition   andThen
     AnyOtherWithTransformer   .visitProcedureDefinition   andThen
     AnyOtherTransformer       .visitProcedureDefinition   andThen
     WithOtherTransformer      .visitProcedureDefinition   andThen
     CountOtherWithTransformer .visitProcedureDefinition   andThen
     CountOtherTransformer     .visitProcedureDefinition   andThen
     AnyWith1Transformer       .visitProcedureDefinition   andThen
     AnyWith2Transformer       .visitProcedureDefinition   andThen
     AnyWith3Transformer       .visitProcedureDefinition   andThen
     AnyWith4Transformer       .visitProcedureDefinition   andThen
     AnyWith5Transformer       .visitProcedureDefinition   andThen
     OptimizeCountTransformer  .visitProcedureDefinition
    )(pd)

}
// scalastyle:on number.of.methods
