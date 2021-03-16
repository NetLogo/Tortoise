// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JsOps.{ jsArrayString, jsFunction }

import
  org.nlogo.core.{ AstNode, CommandBlock, Dump, LogoList, Nobody => NlogoNobody, ReporterApp,
                   ReporterBlock, Statements, Token }

trait Handlers extends EveryIDProvider {

  def prims: Prims

  def fun(node: AstNode, isReporter: Boolean = false)
         (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String = {
    val body = if (isReporter) s"return ${reporter(node)};" else commands(node)
    jsFunction(body = body)
  }

  def task(node: AstNode, isReporter: Boolean = false, args: Seq[String] = Seq())
          (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String = {
    val body = if (isReporter) s"return ${reporter(node)};" else commands(node)
    val fullBody =
      if (args.length > 0)
        s"""PrimChecks.procedure.runArgCountCheck(${args.length}, arguments.length);
          |$body""".stripMargin
      else
        s"""$body""".stripMargin
    jsFunction(args = args, body = fullBody)
  }

  // The "abstract" syntax trees we get from the front end aren't totally abstract in that they have
  // CommandBlock wrappers around Statements objects and ReporterBlock wrappers around Reporter
  // objects, representing the concrete syntax of square brackets, but at this stage of compilation
  // the brackets are irrelevant.  So when we see a block we just immediately recurse into it.

  def commands(node: AstNode)
              (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String =
    incrementingContext { context =>
      node match {
        case block: CommandBlock =>
          commands(block.statements)(compilerFlags, context, procContext)
        case statements: Statements =>
          val generatedJS =
            statements.stmts.map(prims.generateCommand(_)(compilerFlags, context, procContext))
              .filter(_.nonEmpty)
              .mkString("\n")
          generatedJS
      }
    }

  def reporter(node: AstNode)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext, procContext: ProcedureContext): String =
    incrementingContext { context =>
      node match {
        case block: ReporterBlock =>
          reporter(block.app)(compilerFlags, context, procContext)
        case app: ReporterApp =>
          prims.reporter(app)(compilerFlags, context, procContext)
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
