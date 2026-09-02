// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import JsOps.{ jsArrayString, jsFunction }

import org.nlogo.core.{
  Application,
  AstNode,
  CommandBlock,
  Dump,
  LogoList,
  Nobody => NlogoNobody,
  ReporterApp,
  ReporterBlock,
  Statements,
  Token
}
import org.nlogo.core.prim.{ _commandlambda, _reporterlambda, Lambda }

import org.nlogo.tortoise.compiler.utils.CompilerErrors

trait Handlers extends EveryIDProvider {

  def prims: Prims

  def blockCommands(app: Application, node: AstNode, useCompileArgs: Boolean = true)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String =
    commands(node, useCompileArgs)(using compilerFlags, compilerContext.inBlockOf(app), procContext)

  def blockReporter(app: Application, node: AstNode, useCompileArgs: Boolean = true)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String =
    reporter(node, useCompileArgs)(using compilerFlags, compilerContext.inBlockOf(app), procContext)

  def blockFun(app: Application, node: AstNode, isReporter: Boolean = false)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String = {
    implicit val blockContext: CompilerContext = compilerContext.inBlockOf(app)
    val body = if (isReporter) s"return ${reporter(node)};" else commands(node)
    jsFunction(body = body)
  }

  def task(lambda: Lambda, node: AstNode)
          (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String = {
    val bodyContext = AgentContext.contextOfAnonymousProcedure(lambda)
    implicit val lambdaContext: CompilerContext = compilerContext.copy(agentContext = bodyContext)
    val compileTimeArgs  = lambda.argumentNames.map(JSIdentProvider.apply)
    val useCompileArgs   = !lambda.synthetic || !lambda.arguments.isVariadic
    val (primName, body) = lambda match {
      case _: _reporterlambda => ("runresult", s"return ${reporter(node, useCompileArgs)};")
      case _: _commandlambda  => ("run",       commands(node, useCompileArgs))
      case _ =>
        CompilerErrors.failCompilation(s"Unknown lambda type (not reporter or command): ${node.toString}", node.start, node.end, node.filename)
    }
    val checkedArgs = if (compileTimeArgs.length == 0) {
      body
    } else {
      val sourceStart = node.sourceLocation.start
      val sourceEnd   = node.sourceLocation.end
      s"""PrimChecks.procedure.runArgCountCheck('$primName', $sourceStart, $sourceEnd, ${compileTimeArgs.length}, arguments.length);
          |$body""".stripMargin
    }
    val fullBody = AgentContext.guardAnonymousProcedure(bodyContext, primName, node, checkedArgs)
    jsFunction(args = compileTimeArgs, body = fullBody)
  }

  // The "abstract" syntax trees we get from the front end aren't totally abstract in that they have
  // CommandBlock wrappers around Statements objects and ReporterBlock wrappers around Reporter
  // objects, representing the concrete syntax of square brackets, but at this stage of compilation
  // the brackets are irrelevant.  So when we see a block we just immediately recurse into it.

  def commands(node: AstNode, useCompileArgs: Boolean = true)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String =
    incrementingContext { context =>
      node match {
        case block: CommandBlock =>
          commands(block.statements, useCompileArgs)(using compilerFlags, context, procContext)

        case statements: Statements =>
          val (_, generated) =
            statements.stmts.foldLeft((context, Seq[String]())) { case ((stmtContext, acc), stmt) =>
              val js      = prims.generateCommand(stmt, useCompileArgs)(using compilerFlags, stmtContext, procContext)
              val guarded = AgentContext.guardStatement(stmt, js, stmtContext.agentContext)
              (stmtContext.provenBy(stmt.command), acc :+ guarded)
            }
          generated.filter(_.nonEmpty).mkString("\n")

      case _ =>
        CompilerErrors.failCompilation(s"Unknown command node: ${node.toString}", node.start, node.end, node.filename)

      }
    }

  def reporter(node: AstNode, useCompileArgs: Boolean = true)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String =
    incrementingContext { context =>
      node match {
        case block: ReporterBlock =>
          reporter(block.app, useCompileArgs)(using compilerFlags, context, procContext)

        case app: ReporterApp =>
          prims.reporter(app, useCompileArgs)(using compilerFlags, context, procContext)

      case _ =>
        CompilerErrors.failCompilation(s"Unknown reporter node: ${node.toString}", node.start, node.end, node.filename)

      }
    }

  private def incrementingContext[T](f: CompilerContext => T)(implicit context: CompilerContext): T =
    f(context.copy(blockLevel = context.blockLevel + 1))

  def literal(obj: AnyRef): String = obj match {
    case ll: LogoList =>
      jsArrayString(ll.map(literal))
    case NlogoNobody =>
      "Nobody"
    case x =>
      Dump.logoObject(x, readable = true, exporting = false)
  }

  def unusedVarname(token: Token, hint: String = ""): String =
    s"_${hint}_${token.start}_${token.end}"

}
