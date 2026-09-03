// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.core.{
  Application,
  CommandBlock,
  Expression,
  Instruction,
  prim,
  ReporterApp,
  ReporterBlock,
  Syntax
}

import org.nlogo.tortoise.compiler.utils.CompilerErrors

object Arguments {
  // The magic number 21 here is for `Syntax.SymbolType` the largest mask value at the moment -Jeremy B February 2021
  // scalastyle:off magic.number
  private val types: Seq[Int] = Range(1, 21).map( (t) => Math.pow(2, t).asInstanceOf[Int] )
  // scalastyle:on magic.number

  def isSupported(mask: Int, t: Int): Boolean =
    (mask & t) != 0

  def allTypesAllowed(allowed: Int, actual: Int): Boolean =
    types.filter( (t) => !isSupported(allowed, t) && isSupported(actual, t) ).isEmpty

  def makeCheckedArgOps(a: Application, ops: Seq[String]): Seq[String] = {
    val syntax     = a.instruction.syntax
    val allAllowed = if (syntax.isInfix) {
      List(syntax.left) ++ syntax.right
    } else if (!syntax.isVariadic || (a.args.length <= syntax.right.length)) {
      syntax.right
    } else {
      val varStartIndex = syntax.right.indexWhere( (s) => Syntax.compatible(s, Syntax.RepeatableType) )
      val varEndIndex   = a.args.length - (syntax.right.length - varStartIndex)
      val varCount      = varEndIndex - varStartIndex + 1
      val varSyntax     = syntax.right(varStartIndex)
      val varAllowed    = removeRepeatable(varSyntax)
      a.args.zipWithIndex.map( { case (_, argIndex) =>
        if (argIndex < varStartIndex) {
          syntax.right(argIndex)
        } else if (argIndex < (varEndIndex + 1)) {
          varAllowed
        } else {
          syntax.right(argIndex - varCount + 1)
        }
      })
    }

    val argsWithTypes = allAllowed.zip(a.args).zip(ops)
    val sourceStart   = a.instruction.token.sourceLocation.start
    val sourceEnd     = a.instruction.token.sourceLocation.end
    val checkedArgs   = argsWithTypes.map( { case ((allowed: Int, exp: Expression), op: String) =>
      val runtime = runtimeAllowed(a.instruction, allowed)
      makeCheckedOp(a.instruction.token.text, sourceStart, sourceEnd, runtime, exp.reportedType(), op)
    })
    checkedArgs
  }

  // A few prims are narrower at compile time than they are at runtime.  Desktop's `_distance`, `_towards`, and
  // `_moveto` declare turtle-or-patch in their syntax, so a literal link is a compile error.  But their nvm
  // implementations call `argEvalAgent`, which only asks whether it got an agent at all and leaves the kind to the prim
  // itself.
  //
  // Matching that keeps both messages in step.  `distance nobody` names "an agent", and a link that arrives dynamically
  // gets the prim's own wording instead of an argument-type error.  -Jeremy B August 2026
  private def runtimeAllowed(instruction: Instruction, allowed: Int): Int =
    instruction match {
      case _: prim.etc._distance | _: prim.etc._towards | _: prim.etc._moveto => Syntax.AgentType
      case _                                                                  => allowed
    }

  def removeRepeatable(t: Int): Int = {
    t - (t & Syntax.RepeatableType)
  }

  def makeCheckedOp(prim: String, sourceStart: Int, sourceEnd: Int, allowed: Int, actual: Int, op: String): String = {
    if (allTypesAllowed(allowed, actual) || allowed == Syntax.WildcardType) {
      op
    } else {
      // at runtime, don't consider repeatable as its own real type
      s"PrimChecks.validator.checkArg('${prim.toUpperCase()}', $sourceStart, $sourceEnd, ${removeRepeatable(allowed)}, $op)"
    }
  }

  def makeCheckedOp(instruction: Instruction, i: Int, op: String, actual: Int): String = {
    val syntax = instruction.syntax
    val allowed = if (!syntax.isInfix) {
      syntax.right(i)
    } else {
      if (i == 0) syntax.left else syntax.right(i - 1)
    }
    val sourceStart = instruction.token.sourceLocation.start
    val sourceEnd   = instruction.token.sourceLocation.end
    Arguments.makeCheckedOp(instruction.token.text, sourceStart, sourceEnd, runtimeAllowed(instruction, allowed), actual, op)
  }

  def conciseVarArgs(primName: String, sourceStart: String, sourceEnd: String, syntax: Syntax): String = {
    // assumes variadic prims cannot be infix with a `left` value
    s"...PrimChecks.task.checkVarArgs('$primName', $sourceStart, $sourceEnd, [${syntax.right.mkString(", ")}], ...arguments)"
  }
}

case class Arguments(handlers: Handlers, a: Application, sourceInfo: SourceInformation)
  (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext) {

  def get(i: Int): String =
    a.args(i) match {
      case r: ReporterApp   => handlers.reporter(r)
      case b: ReporterBlock => handlers.blockReporter(a, b)
      case c: CommandBlock  => handlers.blockCommands(a, c)
      case _ =>
        CompilerErrors.failCompilation("Unexpected expression in argument list.", a.start, a.end, a.filename)
    }

  def all: Seq[String] =
    a.args.collect {
      case r: ReporterApp  => handlers.reporter(r)
      case c: CommandBlock => s"() => { ${handlers.blockCommands(a, c)} }"
    }

  def commas: String =
    all.mkString(", ")

  def checked: Seq[String] =
    Arguments.makeCheckedArgOps(a, all)

  def commasChecked: String =
    checked.mkString(", ")

  def makeCheckedOp(i: Int): String =
    Arguments.makeCheckedOp(a.instruction, i, get(i), a.args(i).reportedType())

  def maybeConciseVarArgs(useCompileArgs: Boolean, primName: String, syntax: Syntax): String = {
    if (useCompileArgs || !syntax.isVariadic) {
      commasChecked
    } else {
      Arguments.conciseVarArgs(primName, sourceInfo.start, sourceInfo.end, syntax)
    }
  }

}
