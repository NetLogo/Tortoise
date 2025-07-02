// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  CompilerFlags.WidgetPropagation

import
  JsOps.{ indented, jsString, jsStringEscaped }

import org.nlogo.core.{
  AstNode,
  CommandBlock,
  Expression,
  prim,
  Reporter,
  ReporterApp,
  ReporterBlock,
  Statement,
  Syntax
}
import org.nlogo.core.prim.Lambda

import org.nlogo.tortoise.compiler.utils.CompilerErrors.failCompilation

// The Prim traits are split apart as follows
//                  JsOps
//                   |
//      +----> PrimUtils <------+
//      |            |          |
//  ReporterPrims<-+ | +--> CommandPrims
//                 | | |
//                 Prim
//
// The reason for this split is that (as of v0.5.5), scala.js will not compile
// a single Prim trait that handles both command and reporter prims.
// Having two separate traits makes the code a bit easier to manage, but
// the decision of whether there are separate traits or not could be revisited
// in the future after a scala.js upgrade shows that it won't break stuff (RG 3/30/2015)
trait PrimUtils {
  def handlers: Handlers

  protected def fixBN(breedName: String): String =
    Option(breedName) filter (_.nonEmpty) getOrElse "LINKS"

  protected def generateNotImplementedStub(primName: String): String =
    s"notImplemented(${jsString(primName)}, undefined)"

  object VariableReporter extends VariablePrims {
    def unapply(r: Reporter): Option[String] =
      procedureAndVarName(r, "get").map {
        case (proc: String, varName: String) =>
          val sourceStart = r.token.sourceLocation.start
          val sourceEnd   = r.token.sourceLocation.end
          s"$proc(${sourceStart}, ${sourceEnd}, ${jsString(varName)})"
      }
  }

  object VariableSetter extends VariablePrims {
    def unapply(r: Reporter): Option[String => String] =
      procedureAndVarName(r, "set").map {
        case (proc: String, varName: String) =>
          val sourceStart = r.token.sourceLocation.start
          val sourceEnd   = r.token.sourceLocation.end
          ((setValue: String) => s"$proc(${sourceStart}, ${sourceEnd}, ${jsString(varName)}, $setValue);")
      }
  }

  trait VariablePrims {
    protected def procedureAndVarName(r: Reporter, action: String): Option[(String, String)] = PartialFunction.condOpt(r) {
      case bv: prim._breedvariable        => (s"PrimChecks.turtle.${       action}Variable", bv.name.toLowerCase)
      case bv: prim._linkbreedvariable    => (s"PrimChecks.link.${         action}Variable", bv.name.toLowerCase)
      case tv: prim._turtlevariable       => (s"PrimChecks.turtle.${       action}Variable", tv.displayName.toLowerCase)
      case tv: prim._linkvariable         => (s"PrimChecks.link.${         action}Variable", tv.displayName.toLowerCase)
      case tv: prim._turtleorlinkvariable => (s"PrimChecks.turtleOrLink.${ action}Variable", tv.varName.toLowerCase)
      case pv: prim._patchvariable        => (s"PrimChecks.patch.${        action}Variable", pv.displayName.toLowerCase)
      }
  }

  def maybeStoreProcedureArgsForRun(actual: Int, context: ProcedureContext, code: String): String = {
    if (Arguments.allTypesAllowed(Syntax.CommandType, actual) || context.parameters.length == 0) {
      code
    } else {
      val lets = context.parameters.map( (arg) =>
        s"""ProcedurePrims.stack().currentContext().registerStringRunArg("${arg._1}", ${arg._2});"""
      ).mkString("\n")
      s"$lets\n$code"
    }
  }

  def maybeStoreProcedureArgsForRunResult(actual: Int, context: ProcedureContext, code: String): String = {
    if (Arguments.allTypesAllowed(Syntax.ReporterType, actual) || context.parameters.length == 0) {
      code
    } else {
      val lets = context.parameters.map( (arg) =>
        s"""ProcedurePrims.stack().currentContext().registerStringRunArg("${arg._1}", ${arg._2})"""
      ).mkString(",\n")
      s"($lets,\n$code)"
    }
  }

}

object ReporterPrims {

  def callArgs(name: String, args: Seq[String]): String = {
    (Seq(s""""${name.toLowerCase}"""") ++ args).mkString(", ")
  }

}

trait ReporterPrims extends PrimUtils {
  // scalastyle:off method.length
  // scalastyle:off cyclomatic.complexity
  // scalastyle:off line.size.limit
  def reporter(r: ReporterApp, useCompileArgs: Boolean = true)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String = {

    def sourceInfo =
      SourceInformation(r.reporter.token)

    def args: Arguments =
      Arguments(handlers, r, sourceInfo)

    // `and` and `or` need to short-circuit, so we check them a bit differently.  -Jeremy B February 2021
    def makeInfixBoolOp(op: String): String = {
      val left  = args.makeCheckedOp(0)
      val right = args.makeCheckedOp(1)
      s"($left $op $right)"
    }

    r.reporter match {

      // Basics stuff
      case SimplePrims.SimpleReporter(op)             => op
      case SimplePrims.UncheckedReporter(op)          => s"$op(${args.commas})"
      case SimplePrims.CheckedReporter(op)            => s"$op(${sourceInfo.start}, ${sourceInfo.end}, ${args.commasChecked})"
      case SimplePrims.CheckedPassThroughReporter(op) => s"$op(${args.commasChecked})"
      case SimplePrims.TypeCheck(check)               => s"NLType.checks.$check(${args.get(0)})"
      case VariableReporter(op)                       => op
      case p: prim._const                             => handlers.literal(p.value)
      case lv: prim._letvariable                      => JSIdentProvider(lv.let.name)
      case pv: prim._procedurevariable                => JSIdentProvider(pv.name)
      case lv: prim._lambdavariable                   => JSIdentProvider(lv.name)
      case ov: prim._observervariable                 => s"""world.observer.getGlobal("${ov.displayName.toLowerCase}")"""

      case call: prim._callreport =>
        s"""PrimChecks.procedure.callReporter(${sourceInfo.start}, ${sourceInfo.end}, ${ReporterPrims.callArgs(call.name, args.all)})"""

      // Blarg
      case w: prim._word               => s"StringPrims.word(${args.maybeConciseVarArgs(useCompileArgs, "WORD", w.syntax)})"
      case _: prim.etc._ifelsevalue    => generateIfElseValue(r.args)
      case prim._errormessage(Some(l)) => s"_error_${l.hashCode()}.message"

      // Boolean
      case _: prim._and => makeInfixBoolOp("&&")
      case _: prim._or  => makeInfixBoolOp("||")

      // Agentset filtering
      case _: prim.etc._all      => s"PrimChecks.agentset.all(${sourceInfo.start}, ${sourceInfo.end}, ${args.makeCheckedOp(0)}, ${handlers.fun(r.args(1), true)})"
      case _: prim.etc._maxnof   => s"PrimChecks.agentset.maxNOf(${sourceInfo.start}, ${sourceInfo.end}, ${args.makeCheckedOp(1)}, ${args.makeCheckedOp(0)}, ${handlers.fun(r.args(2), true)})"
      case _: prim.etc._maxoneof => s"PrimChecks.agentset.maxOneOf(${args.makeCheckedOp(0)}, ${handlers.fun(r.args(1), true)})"
      case _: prim.etc._minnof   => s"PrimChecks.agentset.minNOf(${sourceInfo.start}, ${sourceInfo.end}, ${args.makeCheckedOp(1)}, ${args.makeCheckedOp(0)}, ${handlers.fun(r.args(2), true)})"
      case _: prim.etc._minoneof => s"PrimChecks.agentset.minOneOf(${args.makeCheckedOp(0)}, ${handlers.fun(r.args(1), true)})"
      case _: prim._of           => s"PrimChecks.agentset.of(${args.makeCheckedOp(1)}, ${handlers.fun(r.args(0), isReporter = true)})"
      case _: prim.etc._sorton   => s"PrimChecks.agentset.sortOn(${sourceInfo.start}, ${sourceInfo.end}, ${args.makeCheckedOp(1)}, ${handlers.fun(r.args(0), true)})"
      case _: prim._with         => s"PrimChecks.agentset.with(${sourceInfo.start}, ${sourceInfo.end}, ${args.makeCheckedOp(0)}, ${handlers.fun(r.args(1), true)})"
      case _: prim.etc._withmax  => s"PrimChecks.agentset.withMax(${args.makeCheckedOp(0)}, ${handlers.fun(r.args(1), true)})"
      case _: prim.etc._withmin  => s"PrimChecks.agentset.withMin(${args.makeCheckedOp(0)}, ${handlers.fun(r.args(1), true)})"

      case _: Optimizer._countotherwith => s"PrimChecks.agentset.countOtherWith(${sourceInfo.start}, ${sourceInfo.end}, ${args.get(0)}, ${handlers.fun(r.args(1), true)})"
      case _: Optimizer._countwith      => s"PrimChecks.agentset.countWith(${sourceInfo.start}, ${sourceInfo.end}, ${args.get(0)}, ${handlers.fun(r.args(1), true)})"
      case _: Optimizer._otherwith      => s"PrimChecks.agentset.otherWith(${sourceInfo.start}, ${sourceInfo.end}, ${args.get(0)}, ${handlers.fun(r.args(1), true)})"
      case _: Optimizer._anyotherwith   => s"PrimChecks.agentset.anyOtherWith(${sourceInfo.start}, ${sourceInfo.end}, ${args.get(0)}, ${handlers.fun(r.args(1), true)})"
      case _: Optimizer._oneofwith      => s"PrimChecks.agentset.oneOfWith(${sourceInfo.start}, ${sourceInfo.end}, ${args.get(0)}, ${handlers.fun(r.args(1), true)})"
      case _: Optimizer._anywith        => s"PrimChecks.agentset.anyWith(${sourceInfo.start}, ${sourceInfo.end}, ${args.get(0)}, ${handlers.fun(r.args(1), true)})"
      case o: Optimizer._optimizecount  => s"PrimChecks.agentset.optimizeCount(${sourceInfo.start}, ${sourceInfo.end}, ${args.get(0)}, ${o.checkValue}, ${o.operator})"

      // agentset creators do their own, weird runtime checking with unique error messages, so we don't check their args.
      case _: prim.etc._linkset   => s"PrimChecks.agentset.linkSet(${sourceInfo.start}, ${sourceInfo.end}, ${if (useCompileArgs) { args.commas } else { "...arguments" }})"
      case _: prim.etc._patchset  => s"PrimChecks.agentset.patchSet(${sourceInfo.start}, ${sourceInfo.end}, ${if (useCompileArgs) { args.commas } else { "...arguments" }})"
      case _: prim.etc._turtleset => s"PrimChecks.agentset.turtleSet(${sourceInfo.start}, ${sourceInfo.end}, ${if (useCompileArgs) { args.commas } else { "...arguments" }})"

      case ns: Optimizer._nsum  => s"SelfManager.self()._optimalNSum(${jsString(ns.varName)})"
      case ns: Optimizer._nsum4 => s"SelfManager.self()._optimalNSum4(${jsString(ns.varName)})"

      case _: Optimizer._patchhereinternal => "SelfManager.self()._optimalPatchHereInternal()"
      case _: Optimizer._patchnorth        => "SelfManager.self()._optimalPatchNorth()"
      case _: Optimizer._patcheast         => "SelfManager.self()._optimalPatchEast()"
      case _: Optimizer._patchsouth        => "SelfManager.self()._optimalPatchSouth()"
      case _: Optimizer._patchwest         => "SelfManager.self()._optimalPatchWest()"
      case _: Optimizer._patchne           => "SelfManager.self()._optimalPatchNorthEast()"
      case _: Optimizer._patchse           => "SelfManager.self()._optimalPatchSouthEast()"
      case _: Optimizer._patchsw           => "SelfManager.self()._optimalPatchSouthWest()"
      case _: Optimizer._patchnw           => "SelfManager.self()._optimalPatchNorthWest()"

      // Lookup by breed
      case b: prim._breed                 => s"world.turtleManager.turtlesOfBreed(${jsString(b.breedName)})"
      case b: prim.etc._breedsingular     => s"PrimChecks.turtle.getTurtleOfBreed(${sourceInfo.start}, ${sourceInfo.end}, ${jsString(b.breedName)}, ${args.get(0)})"
      case b: prim.etc._linkbreed         => s"world.linkManager.linksOfBreed(${jsString(b.breedName)})"
      case p: prim.etc._linkbreedsingular => s"world.linkManager.getLink(${args.get(0)}, ${args.get(1)}, ${jsString(p.breedName)})"
      case b: prim.etc._breedat           => s"SelfManager.self().breedAt(${jsString(b.breedName)}, ${args.get(0)}, ${args.get(1)})"
      case b: prim.etc._breedhere         => s"SelfManager.self().breedHere(${jsString(b.breedName)})"
      case b: prim._breedon               => s"PrimChecks.agentset.breedOn(${jsString(b.breedName)}, ${args.makeCheckedOp(0)})"
      case b: Optimizer._anybreedon       => s"PrimChecks.agentset.anyBreedOn(${jsString(b.breedName)}, ${args.makeCheckedOp(0)})"
      case b: prim.etc._isbreed           => s"NLType.checks.isBreed(${jsString(b.breedName)}, ${args.get(0)})"

      // List prims
      case b: prim.etc._butfirst          => s"PrimChecks.list.butFirst('${b.token.text}', ${sourceInfo.start}, ${sourceInfo.end}, ${args.commasChecked})"
      case b: prim.etc._butlast           => s"PrimChecks.list.butLast('${b.token.text}', ${sourceInfo.start}, ${sourceInfo.end}, ${args.commasChecked})"
      case l: prim._list                  => s"ListPrims.list(${args.maybeConciseVarArgs(useCompileArgs, "LIST", l.syntax)})"
      case s: prim._sentence              => s"ListPrims.sentence(${args.maybeConciseVarArgs(useCompileArgs, "SENTENCE", s.syntax)})"

      // Link finding
      case p: prim.etc._inlinkfrom       => s"LinkPrims.inLinkFrom(${jsString(fixBN(p.breedName))}, ${args.get(0)})"
      case p: prim.etc._inlinkneighbor   => s"LinkPrims.isInLinkNeighbor(${jsString(fixBN(p.breedName))}, ${args.get(0)})"
      case p: prim.etc._inlinkneighbors  => s"LinkPrims.inLinkNeighbors(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._linkneighbor     => s"LinkPrims.isLinkNeighbor(${jsString(fixBN(p.breedName))}, ${args.get(0)})"
      case p: prim.etc._linkneighbors    => s"LinkPrims.linkNeighbors(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._linkwith         => s"LinkPrims.linkWith(${jsString(fixBN(p.breedName))}, ${args.get(0)})"
      case p: prim.etc._myinlinks        => s"LinkPrims.myInLinks(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._mylinks          => s"LinkPrims.myLinks(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._myoutlinks       => s"LinkPrims.myOutLinks(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._outlinkneighbor  => s"LinkPrims.isOutLinkNeighbor(${jsString(fixBN(p.breedName))}, ${args.get(0)})"
      case p: prim.etc._outlinkneighbors => s"LinkPrims.outLinkNeighbors(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._outlinkto        => s"LinkPrims.outLinkTo(${jsString(fixBN(p.breedName))}, ${args.get(0)})"

      case u: prim.etc._runresult        =>
        val argString = args.maybeConciseVarArgs(useCompileArgs, "RUNRESULT", u.syntax)
        val run = s"PrimChecks.procedure.runResult(${sourceInfo.start}, ${sourceInfo.end}, $argString)"
        maybeStoreProcedureArgsForRunResult(r.args(0).reportedType(), procContext, run)

      case _: prim.etc._checksyntax =>
        val check = s"ProcedurePrims.checkSyntax(${args.get(0)})"
        maybeStoreProcedureArgsForRun(r.args(0).reportedType(), procContext, check)

      case l: prim._reporterlambda =>
        generateTask(sourceInfo.start, sourceInfo.end, l, r.args(0), true, l.source)

      case l: prim._commandlambda  =>
        generateTask(sourceInfo.start, sourceInfo.end, l, r.args(0), false, l.source)

      case x: prim._externreport =>
        val ExtensionPrimRegex = """_externreport\(([^:]+):([^)]+)\)""".r
        (x.toString: @unchecked) match {
          case ExtensionPrimRegex(extName, primName) =>
            s"Extensions[${jsString(extName)}].prims[${jsString(primName)}](${args.commas})"
        }

      case ra: prim.etc._range =>
        generateRange(sourceInfo.start, sourceInfo.end, useCompileArgs, args.checked, ra.syntax)

      case _: prim._multiassignitem =>
        "__MULTI_SET_ARRAY.shift()"

      case _ if compilerFlags.generateUnimplemented =>
        generateNotImplementedStub(r.reporter.getClass.getName.drop(1))

      case _                                        =>
        failCompilation(s"unimplemented primitive: ${r.instruction}", r.instruction.token)

    }
  }
  // scalastyle:on method.length
  // scalastyle:on cyclomatic.complexity
  // scalastyle:on line.size.limit

  // scalastyle:off parameter.number
  private def generateTask(sourceStart: String, sourceEnd: String, lambda: Lambda, node: AstNode, isReporter: Boolean, source: Option[String])
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String = {
    val task       = handlers.task(lambda, node)
    val body       = jsStringEscaped(source.getOrElse(""))
    val isVariadic = lambda.arguments.isVariadic
    s"PrimChecks.task.checked($sourceStart, $sourceEnd, $task, $body, $isReporter, $isVariadic)"
  }
  // scalastyle:on parameter.number

  def generateIfElseValue(args: Seq[Expression])
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String = {
    if (args.length == 0)
      "Prims.ifElseValueMissingElse()"
    else if (args.length == 1)
      handlers.reporter(args(0))
    else
      s"(Prims.ifElseValueBooleanCheck(${handlers.reporter(args(0))}) ? ${handlers.reporter(args(1))} : ${generateIfElseValue(args.drop(2))})"
  }

  // The fact that there are three different functions for `range` is intentional--incredibly intentional.
  // The engine has this to say on the matter (with me acting as ventriloquist):
  // "Call with me with the correct number of arguments or GTFO."
  // I will open a can of whoop-ass on anyone who thinks differently. --Stone Cold J. Bertsche (3/16/17)
  def generateRange(sourceStart: String, sourceEnd: String, useCompileArgs: Boolean, args: Seq[String], syntax: Syntax): String =
    if (useCompileArgs) {
      args match {
        case Seq(a)       => s"ListPrims.rangeUnary($a)"
        case Seq(a, b)    => s"ListPrims.rangeBinary($a, $b)"
        case Seq(a, b, c) => s"PrimChecks.list.rangeTernary($sourceStart, $sourceEnd, $a, $b, $c)"
        case _            => throw new IllegalArgumentException("range expects at most three arguments")
      }
    } else {
      s"PrimChecks.list.rangeVariadic($sourceStart, $sourceEnd, ${Arguments.conciseVarArgs("RANGE", sourceStart, sourceEnd, syntax)})"
    }

}

trait CommandPrims extends PrimUtils {
  // scalastyle:off cyclomatic.complexity
  // scalastyle:off method.length
  def generateCommand(s: Statement, useCompileArgs: Boolean = true)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String = {

    def sourceInfo =
      SourceInformation(s.command.token)

    def args: Arguments =
      Arguments(handlers, s, sourceInfo)

    def getReferenceName: String = {
      val name = s.args(0).asInstanceOf[ReporterApp].reporter match {
        case p: prim._patchvariable => p.displayName.toLowerCase
        case x                      => failCompilation(s"unknown reference: ${x.getClass.getName}", s.instruction.token)
      }
      jsString(name)
    }

    /// custom generators for particular Commands
    def generateCall(call: prim._call): String = {
      val callCommand = s"ProcedurePrims.callCommand(${ReporterPrims.callArgs(call.name, args.all)})"
      if (!procContext.isProcedure && compilerContext.blockLevel < 2) {
        callCommand
      } else {
        val interrupt = if (compilerFlags.propagationStyle == WidgetPropagation && compilerContext.blockLevel == 1) {
          "StopInterrupt"
        } else {
          "DeathInterrupt"
        }
        s"var R = $callCommand; if (R === $interrupt) { return R; }"
      }
    }

    def generateSet: String = {
      s.args(0).asInstanceOf[ReporterApp].reporter match {
        case p: prim._letvariable =>
          val name = JSIdentProvider(p.let.name)
          s"""$name = ${args.get(1)}; ProcedurePrims.stack().currentContext().updateStringRunVar("${p.let.name}", $name);"""

        case p: prim._procedurevariable =>
          val name = JSIdentProvider(p.name)
          s"$name = ${args.get(1)};"

        case p: prim._lambdavariable =>
          s"${JSIdentProvider(p.name)} = ${args.get(1)};"

        case ov: prim._observervariable =>
          s"""world.observer.setGlobal("${ov.displayName.toLowerCase}", ${args.get(1)});"""

        case VariableSetter(setValue) =>
          setValue(args.get(1))

        case _ =>
          failCompilation("This isn't something you can use \"set\" on.", s.instruction.token)

      }
    }

    def generateMultiLet(multiLet: prim._multilet): String = {
      def serializeLetStructure(ml: prim._multilet): String = {
        ml.lets.map( (sl) => sl match {
          case nl: prim._multilet => serializeLetStructure(nl)
          case _                 => "0" // This could be `null` or `undefined` or `[]` since we don't need the var name, but this seems short and sweet.
        }).mkString("[", ", ", "]")
      }
      def letVarsToJSArray(ml: prim._multilet): String = {
        ml.lets.map( (sl) => sl match {
          case nl: prim._multilet => letVarsToJSArray(nl)
          case _                  => JSIdentProvider(sl.letList)
        }).mkString("[", ", ", "]")
      }
      def flattenLetVars(l: prim._abstractlet): Seq[String] = l match {
        case nl: prim._multilet => nl.lets.flatten(using flattenLetVars(_))
        case _                  => Seq(l.letList)
      }
      val letList: Seq[String] = multiLet.lets.flatten(using flattenLetVars(_))
      val regsString  = letList.map( (l) =>
        s"""ProcedurePrims.stack().currentContext().registerStringRunVar("${l}", ${JSIdentProvider(l)});"""
      ).mkString(" ")
      val letStructure = serializeLetStructure(multiLet)
      val argsString = s"PrimChecks.control.multiAssignHasEnoughArgs(${sourceInfo.start}, ${sourceInfo.end}, $letStructure, ${args.get(0)})"
      val namesString = letVarsToJSArray(multiLet)
      s"let $namesString = $argsString; $regsString"
    }

    def generateMultiSet(multiSet: prim._multiset): String = {
      def serializeSetStructure(ms: prim._multiset): String = {
        ms.sets.map( (ss) => ss match {
          case ns: prim._multiset => serializeSetStructure(ns)
          case _                  => "0" // This could be `null` or `undefined` or `[]` since we don't need the var name, but this seems short and sweet.
        }).mkString("[", ", ", "]")
      }
      val varsString = serializeSetStructure(multiSet)
      s"[__MULTI_SET_ARRAY] = [PrimChecks.control.linearizeAndValidateArgs(${sourceInfo.start}, ${sourceInfo.end}, $varsString, ${args.get(0)})];"
    }

    def generateLoop: String = {
      val body = args.get(0)
      s"""|while (true) {
          |${indented(body)}
          |};""".stripMargin
    }

    def generateRepeat: String = {
      val count = args.get(0)
      val body  = args.get(1)
      val i     = handlers.unusedVarname(s.command.token, "index")
      val j     = handlers.unusedVarname(s.command.token, "repeatcount")
      s"""|for (let $i = 0, $j = StrictMath.floor($count); $i < $j; $i++) {
          |${indented(body)}
          |}""".stripMargin
    }

    def generateWhile: String = {
      val pred = args.get(0)
      val body = args.get(1)
      s"""|while ($pred) {
          |${indented(body)}
          |}""".stripMargin
    }

    def generateIf: String = {
      val pred = args.get(0)
      val body = args.get(1)
      s"""|if ($pred) {
          |${indented(body)}
          |}""".stripMargin
    }

    def generateIfElse: String = {
        val clauses = List.range(0, s.args.length - 1, 2).map { i =>
          val bool = s.args(i)
          if (!(bool.isInstanceOf[ReporterApp] || bool.isInstanceOf[ReporterBlock])) {
            failCompilation("IFELSE expected a reporter here but got a block.", bool.start, bool.end, bool.filename)
          }
          val cmd = s.args(i + 1)
          if (!cmd.isInstanceOf[CommandBlock]) {
            failCompilation("IFELSE expected a command block here but got a TRUE/FALSE.", cmd.start, cmd.end, cmd.filename)
          }
          val pred      = handlers.reporter(bool)
          val thenBlock = handlers.commands(cmd)
          s"""|if ($pred) {
              |${indented(thenBlock)}
              |}""".stripMargin
        }
        val elseBlock = if (s.args.length % 2 == 0)
          ""
        else {
          val elseBlock = handlers.commands(s.args(s.args.length - 1))
          s"""|else {
              |${indented(elseBlock)}
              |}""".stripMargin
        }
        s"""|${clauses.mkString(" else ")}
            |${elseBlock}""".stripMargin
    }

    def generateCarefully(c: prim._carefully): String = {
      val errorName   = handlers.unusedVarname(s.command.token, "error")
      val doCarefully = args.get(0)
      val handleError = args.get(1).replaceAll(s"_error_${c.let.hashCode()}", errorName)
      s"""
        |try {
        |${indented(doCarefully)}
        |} catch ($errorName) {
        |${indented(handleError)}
        |}
      """.stripMargin
    }

    def generateCreateLink(name: String, breedName: String): String = {
      val other                = args.get(0)
      // This is so that we don't shuffle unnecessarily.  FD 10/31/2013
      val nonEmptyCommandBlock = s.args(1).asInstanceOf[CommandBlock].statements.stmts.nonEmpty
      val body                 = handlers.fun(s.args(1))
      addAskContext(s"LinkPrims.$name($other, ${jsString(fixBN(breedName))})", body, nonEmptyCommandBlock)
    }

    def generateCreateTurtles(ordered: Boolean): String = {
      val n = args.get(0)
      val name = if (ordered) "createOrderedTurtles" else "createTurtles"
      val breed =
        s.command match {
          case x: prim._createturtles => x.breedName
          case x: prim._createorderedturtles => x.breedName
          case x => throw new IllegalArgumentException("How did you get here with class of type " + x.getClass.getName)
        }
      val body = handlers.fun(s.args(1))
      addAskContext(s"world.turtleManager.$name($n, ${jsString(breed)})", body, true)
    }

    def optimalGenerateCreateTurtles(ordered: Boolean): String = {
      val n = handlers.reporter(s.args(0))
      val name = if (ordered) "createOrderedTurtles" else "createTurtles"
      val breed =
        s.command match {
          case x: Optimizer._crtfast => x.breedName
          case x: Optimizer._crofast => x.breedName
          case x                     => throw new IllegalArgumentException(s"How did you get here with class of type ${x.getClass.getName}")
        }
      s"world.turtleManager.$name($n, ${jsString(breed)});"
    }

    def generateSprout(breedName: String): String = {
      val n    = args.get(0)
      val body = handlers.fun(s.args(1))
      val trueBreedName = if (breedName.nonEmpty) breedName else "TURTLES"
      val sprouted = s"SelfManager.self().sprout($n, ${jsString(trueBreedName)})"
      addAskContext(sprouted, body, true)
    }

    def optimalGenerateSprout(breedName: String): String = {
      val n = args.get(0)
      val trueBreedName = if (breedName.nonEmpty) breedName else "TURTLES"
      s"SelfManager.self().sprout($n, ${jsString(trueBreedName)});"
    }

    def generateHatch(breedName: String): String = {
      val n = args.get(0)
      val body = handlers.fun(s.args(1))
      addAskContext(s"SelfManager.self().hatch($n, ${jsString(breedName)})", body, true)
    }

    def optimalGenerateHatch(breedName: String): String = {
      val n = args.get(0)
      s"SelfManager.self().hatch($n, ${jsString(breedName)});"
    }

    def generateEvery: String = {
      val time = args.get(0)
      val body = args.get(1)
      val everyId = handlers.nextEveryID()
      s"""|if (Prims.isThrottleTimeElapsed("$everyId", workspace.selfManager.self(), $time)) {
          |  Prims.resetThrottleTimerFor("$everyId", workspace.selfManager.self());
          |${indented(body)}
          |}""".stripMargin
    }

    def addAskContext(agents: String, code: String, shuffle: Boolean): String =
      addReturn(s"ProcedurePrims.ask($agents, $code, $shuffle)")

    def addReturn(code: String): String = {
      s"var R = $code; if (R !== undefined) { PrimChecks.procedure.preReturnCheck(${sourceInfo.start}, ${sourceInfo.end}, R); return R; }"
    }

    s.command match {
      case SimplePrims.SimpleCommand(op)             => if (op.isEmpty) "" else s"$op;"
      case SimplePrims.UncheckedCommand(op)          => s"$op(${args.commas});"
      case SimplePrims.CheckedCommand(op)            => s"$op(${sourceInfo.start}, ${sourceInfo.end}, ${args.commasChecked});"
      case SimplePrims.CheckedPassThroughCommand(op) => s"$op(${args.commasChecked});"

      case _: prim._set                  => generateSet
      case m: prim._multiset             => generateMultiSet(m)
      case _: prim._multiassignnest      => ""
      case _: prim.etc._loop             => generateLoop
      case _: prim._repeat               => generateRepeat
      case _: prim.etc._while            => generateWhile
      case _: prim.etc._if               => generateIf
      case _: prim.etc._ifelse           => generateIfElse
      case _: prim._ask                  => addAskContext(args.makeCheckedOp(0), handlers.fun(s.args(1)), true)
      case p: prim._carefully            => generateCarefully(p)
      case _: prim._createturtles        => generateCreateTurtles(ordered = false)
      case _: prim._createorderedturtles => generateCreateTurtles(ordered = true)
      case _: Optimizer._crtfast         => optimalGenerateCreateTurtles(ordered = false)
      case _: Optimizer._crofast         => optimalGenerateCreateTurtles(ordered = true)
      case s: prim._sprout               => generateSprout(s.breedName)
      case s: Optimizer._sproutfast      => optimalGenerateSprout(s.breedName)
      case p: prim.etc._createlinkfrom   => generateCreateLink("createLinkFrom",  p.breedName)
      case p: prim.etc._createlinksfrom  => generateCreateLink("createLinksFrom", p.breedName)
      case p: prim.etc._createlinkto     => generateCreateLink("createLinkTo",    p.breedName)
      case p: prim.etc._createlinksto    => generateCreateLink("createLinksTo",   p.breedName)
      case p: prim.etc._createlinkwith   => generateCreateLink("createLinkWith",  p.breedName)
      case p: prim.etc._createlinkswith  => generateCreateLink("createLinksWith", p.breedName)
      case _: prim.etc._every            => generateEvery
      case h: prim._hatch                => generateHatch(h.breedName)
      case h: Optimizer._hatchfast       => optimalGenerateHatch(h.breedName)
      case _: prim._bk                   => s"SelfManager.self().fd(-(${args.get(0)}));"
      case _: prim.etc._left             => s"SelfManager.self().right(-(${args.get(0)}));"
      case _: prim.etc._diffuse          => s"world.topology.diffuse($getReferenceName, ${args.get(1)}, false)"
      case _: prim.etc._diffuse4         => s"world.topology.diffuse($getReferenceName, ${args.get(1)}, true)"
      case _: prim.etc._uphill           => s"Prims.uphill($getReferenceName)"
      case _: prim.etc._uphill4          => s"Prims.uphill4($getReferenceName)"
      case _: prim.etc._downhill         => s"Prims.downhill($getReferenceName)"
      case _: prim.etc._downhill4        => s"Prims.downhill4($getReferenceName)"
      case _: prim.etc._setdefaultshape  => s"BreedManager.setDefaultShape(${args.get(0)}.getSpecialName(), ${args.get(1)})"
      case _: prim.etc._hidelink         => "SelfManager.self().setVariable('hidden?', true)"
      case _: prim.etc._showlink         => "SelfManager.self().setVariable('hidden?', false)"
      case call: prim._call              => generateCall(call)
      case _: prim._report               => s"return PrimChecks.procedure.report(${sourceInfo.start}, ${sourceInfo.end}, ${args.get(0)});"
      case _: prim.etc._ignore           => s"${args.get(0)};"

      case m: prim._multilet => generateMultiLet(m)
      case l: prim._let =>
        l.let.map(inner => {
          val name = JSIdentProvider(inner.name)
          s"""let $name = ${args.get(0)}; ProcedurePrims.stack().currentContext().registerStringRunVar("${inner.name}", $name);"""
        }).getOrElse("")


      case _: prim.etc._withlocalrandomness =>
        s"workspace.rng.withClone(function() { ${handlers.commands(s.args(0))} })"

      case r: prim._run =>
        val argString = args.maybeConciseVarArgs(useCompileArgs, "RUN", r.syntax)
        val run       = s"var R = PrimChecks.procedure.run(${sourceInfo.start}, ${sourceInfo.end}, $argString); if (R !== undefined) { return R; }"
        maybeStoreProcedureArgsForRun(s.args(0).reportedType(), procContext, run)

      case fe: prim.etc._foreach =>
        val argString = args.maybeConciseVarArgs(useCompileArgs, "FOREACH", fe.syntax)
        val code      = s"PrimChecks.task.forEach(${sourceInfo.start}, ${sourceInfo.end}, $argString)"
        addReturn(code)

      case x: prim._extern =>
        val ExtensionPrimRegex = """_extern\(([^:]+):([^)]+)\)""".r
        (x.toString: @unchecked) match {
          case ExtensionPrimRegex(extName, primName) =>
            s"Extensions[${jsString(extName)}].prims[${jsString(primName)}](${args.commas});"
        }

      case _ if compilerFlags.generateUnimplemented =>
        s"${generateNotImplementedStub(s.command.getClass.getName.drop(1))};"

      case _                                        =>
        failCompilation(s"unimplemented primitive: ${s.instruction}", s.instruction.token)

    }

  }
  // scalastyle:on method.length
  // scalastyle:on cyclomatic.complexity

}

trait Prims extends PrimUtils with CommandPrims with ReporterPrims
