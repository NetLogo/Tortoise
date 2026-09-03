// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  scala.{ annotation, scalajs },
    annotation.meta.field,
    scalajs.js.annotation.{ JSExport, JSExportTopLevel }

import scala.scalajs.js

import
  org.nlogo.{ core, parse },
    core.{ AgentKind, LiteralParser, LogoList, Nobody => NlogoNobody, SourceWrapping },
    parse.CompilerUtilities

import
    json.{ JsonLibrary, JsonReader, TortoiseJson },
      JsonLibrary.{ Native => NativeJson, toTortoise },
      TortoiseJson._

import
  scalaz.{ Validation, syntax },
    Validation.FlatMap.ValidationFlatMapRequested,
    syntax.foldable._

@JSExportTopLevel("Converter")
object LiteralConverter {

  private val compiler = new Compiler()

  class WrappedException(@(JSExport @field) val message: String) extends Throwable {
    override def getMessage: String = message
    override def toString: String = getMessage
  }

  @JSExport
  def stringToJSValue(value: String): AnyRef = {
    nlToJS(StandardLiteralParser.readFromString(value))
  }

  private def nlToJS(value: => AnyRef): AnyRef = {

    import scala.scalajs.js.JSConverters.iterableOnceConvertible2JSRichIterableOnce

    def nlValueToJSValue: PartialFunction[AnyRef, AnyRef] = {
      case l: LogoList => l.toList.map(nlValueToJSValue).toJSArray
      case NlogoNobody => Nobody
      case x           => x
    }

    try nlValueToJSValue(value)
    catch {
      case ex: Exception => throw new WrappedException(ex.getMessage)
    }

  }

  @JSExport
  def compileRunString(compilationRequest: NativeJson, runString: String, isRunResult: Boolean,
                       procVars: js.Array[String], agentKind: String): String = {
    // The strings to run can end in comments like `; blah blah`, so the `\n` before the `end`s are necessary.
    val netLogoArgs = procVars.toList.mkString(" ")
    // Desktop compiles a `run` string in the context of whoever is running it, so a turtle-only prim in a patch's `run`
    // string is a compile error there.  The hint prim is how we tell the front end which context that is.
    // -Jeremy B August 2026
    val hint = SourceWrapping.agentKindHint(agentKind match {
      case "turtle" => AgentKind.Turtle
      case "patch"  => AgentKind.Patch
      case "link"   => AgentKind.Link
      case _        => AgentKind.Observer
    })
    // Measure the header including the args and the agent kind.  Positions in the generated JS get rebased by it, so
    // they point into `runString` instead of into this wrapper.  -Jeremy B August 2026
    val header = if (isRunResult)
      s"to-report __run [$netLogoArgs] $hint report ("
    else
      s"to __run [$netLogoArgs] $hint "

    val code = if (isRunResult)
      s"$header$runString\n) end"
    else
      s"$header$runString\nend"

    val jsV = for {
      tortoiseReq   <- JsonReader.read[JsObject](toTortoise(compilationRequest)).leftMap(_.map(s => FailureString(s)))
      parsedReq     <- CompilationRequest.read(tortoiseReq).leftMap(_.map(FailureString.apply))
      model         =  parsedReq.toModel
      compiledModel <- CompiledModel.fromModel(model, compiler)
      jsV           <- compiledModel.compileRunProcedure(code, isRunResult, header.length)
    } yield jsV

    val js = jsV.fold(
      errors => throw new WrappedException(errors.map((e) => e.asInstanceOf[Throwable].getMessage).toList.mkString("\n")),
      js     => js
    )

    val jsArgs = procVars.map(JSIdentProvider.apply).mkString(", ")
    if (isRunResult)
      s"(function($jsArgs) { return ($js); })"
    else
      s"(function($jsArgs) { $js })"
  }

}

object StandardLiteralParser extends LiteralParser {

  override def readFromString(string: String): AnyRef =
    CompilerUtilities.readFromString(string)

  override def readNumberFromString(string: String): AnyRef =
    CompilerUtilities.readNumberFromString(string)

}
