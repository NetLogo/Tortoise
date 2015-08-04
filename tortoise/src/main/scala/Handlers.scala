// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  JsOps.{ jsArrayString, jsFunction, indented }

import
  org.nlogo.core.{ AstNode, CommandBlock, Dump, LogoList, Nobody, Pure, ReporterApp,
                   ReporterBlock, Statements, Token }

trait Handlers extends EveryIDProvider {

  def prims: Prims

  def fun(node:          AstNode,
          isReporter:    Boolean = false,
          isTask:        Boolean = false)
    (implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val taskHeader =
      if (isTask)
        "var taskArguments = arguments;\n"
      else
        ""
    val body = taskHeader +
      (if (isReporter)
        s"return ${reporter(node)};"
      else
        commands(node))
    def isTrivialReporter(node: AstNode): Boolean =
      node match {
        case block: ReporterBlock =>
          isTrivialReporter(block.app)
        case app: ReporterApp =>
          app.args.isEmpty && app.reporter.isInstanceOf[Pure]
        case _ =>
          false
      }
    if (body.isEmpty)
      jsFunction()
    else
      jsFunction(body = body)
  }

  // The "abstract" syntax trees we get from the front end aren't totally abstract in that they have
  // CommandBlock wrappers around Statements objects and ReporterBlock wrappers around Reporter
  // objects, representing the concrete syntax of square brackets, but at this stage of compilation
  // the brackets are irrelevant.  So when we see a block we just immediately recurse into it.

  def commands(node: AstNode, catchStop: Boolean = true)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String =
    incrementingContext { context =>
      node match {
        case block: CommandBlock =>
          commands(block.statements)(compilerFlags, context)
        case statements: Statements =>
          val generatedJS =
            statements.stmts.map(prims.generateCommand(_)(compilerFlags, context))
              .filter(_.nonEmpty)
              .mkString("\n")
              if (catchStop && statements.nonLocalExit)
                commandBlockContext(generatedJS)
              else
                generatedJS
      }
    }

  def reporter(node: AstNode)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String =
    incrementingContext { context =>
      node match {
        case block: ReporterBlock =>
          reporter(block.app)(compilerFlags, context)
        case app: ReporterApp =>
          prims.reporter(app)(compilerFlags, context)
      }
    }

  private def incrementingContext[T](f: CompilerContext => T)(implicit context: CompilerContext): T =
    f(context.copy(blockLevel = context.blockLevel + 1))

  def literal(obj: AnyRef): String = obj match {
    case ll: LogoList =>
      jsArrayString(ll.map(literal))
    case Nobody =>
      "Nobody"
    case x =>
      Dump.logoObject(x, readable = true, exporting = false)
  }

  def ident(s: String): String = JSIdentProvider(s)

  def unusedVarname(token: Token, hint: String = ""): String =
    s"_${hint}_${token.start}_${token.end}"

  def reporterProcContext(reporterJS: String): String =
    s"""|try {
        |${indented(reporterJS)}
        |  throw new Error("Reached end of reporter procedure without REPORT being called.");
        |} catch (e) {
        |  if (e instanceof Exception.ReportInterrupt) {
        |    return e.message;
        |  } else {
        |    throw e;
        |  }
        |}""".stripMargin

  def commandBlockContext(commandJS: String): String =
    s"""|try {
        |${indented(commandJS)}
        |} catch (e) {
        |  if (e instanceof Exception.StopInterrupt) {
        |    return e;
        |  } else {
        |    throw e;
        |  }
        |}""".stripMargin

}
