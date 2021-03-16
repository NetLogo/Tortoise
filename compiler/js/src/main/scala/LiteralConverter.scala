// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  scala.{ annotation, scalajs },
    annotation.meta.field,
    scalajs.js.annotation.{ JSExport, JSExportTopLevel }

import scala.scalajs.js

import
  org.nlogo.{ core, parse },
    core.{ LiteralParser, LogoList, Nobody => NlogoNobody },
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

    import scala.scalajs.js.JSConverters.genTravConvertible2JSRichGenTrav

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
  def compileRunString(compilationRequest: NativeJson, runString: String, isRunResult: Boolean, procVars: js.Array[String]): String = {
    // The strings to run can end in comments like `; blah blah`, so the `\n` before the `end`s are necessary.
    val netLogoArgs = procVars.toList.mkString(" ")
    val code = if (isRunResult)
      s"to-report __run [$netLogoArgs] report ($runString\n) end"
    else
      s"to __run [$netLogoArgs] $runString\nend"

    val jsV = for {
      tortoiseReq   <- JsonReader.read[JsObject](toTortoise(compilationRequest)).leftMap(_.map(s => FailureString(s)))
      parsedReq     <- CompilationRequest.read(tortoiseReq).leftMap(_.map(FailureString))
      model         =  parsedReq.toModel
      compiledModel <- CompiledModel.fromModel(model, compiler)
      jsV           <- compiledModel.compileRunProcedure(code, isRunResult)
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
