// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import scala.scalajs.js,
    js.{ Any => JSAny, eval, annotation },
      annotation.JSExport

import org.nlogo.core.{ CompilerException, Model, Program, FrontEndInterface, AgentKind },
    FrontEndInterface.{ ProceduresMap, NoProcedures }

import json.{ JsonWriter, WidgetToJson, TortoiseJson, JsonLibrary },
    TortoiseJson._,
    WidgetToJson.widget2Json

import scalaz.ValidationNel

import scala.{ collection, util },
  collection.immutable.ListMap,
  util.Try

@JSExport("BrowserCompiler")
class BrowserCompiler {
  @JSExport
  def fromModel(contents: String): JsonLibrary.Native =
    (Try[TortoiseJson](
      CompiledModel
        .fromNlogoContents(contents)
        .fold(errors    => result(false, JsArray(errors.list.toList.map(jsonifiedError))),
          compiledModel => result(true,  JsString(compiledModel.compiledCode),
                "widgets" -> JsArray(compileWidgets(compiledModel))))
    ) recover {
      case e: Exception => result(false, JsArray(List(jsonifiedError(e))))
    }).map(JsonLibrary.toNative).get

  private def jsonifiedError(ex: Exception): TortoiseJson =
    ex match {
      case compilerException: CompilerException =>
        JsObject(fields(
          "message" -> JsString(compilerException.getMessage),
          "start"   -> JsInt(compilerException.start),
          "end"     -> JsInt(compilerException.end)))
      case otherException                       =>
        JsObject(fields(
          "message" -> JsString(otherException.getMessage)))
    }

  private def result(success: Boolean, result: TortoiseJson, others: (String, TortoiseJson)*): JsObject =
    JsObject(fields(
      "success" -> JsBool(success),
      "result"  -> result) ++
    fields(others: _*))

  private def sanitizeSource(s: String) =
    s.replace("\\n", "\n").replace("\\\\", "\\").replace("\\\"", "\"")

  private def toKind(agentType: String): AgentKind =
    agentType.toUpperCase match {
      case "OBSERVER" => AgentKind.Observer
      case "TURTLE"   => AgentKind.Turtle
      case "PATCH"    => AgentKind.Patch
      case "LINK"     => AgentKind.Link
    }

  implicit object compileResult2Json extends JsonWriter[ValidationNel[Exception, String]] {
    def apply(compileResult: ValidationNel[Exception, String]): TortoiseJson =
      compileResult.fold(
        es => JsArray(es.list.toList.map(jsonifiedError)),
        success => JsString(success))
  }

  private def compileWidgets(compiledModel: CompiledModel): List[TortoiseJson] = {
    import org.nlogo.core.{Plot, Button, Slider, Monitor, Pen, Widget}
    def compileCmd(code: String, agentType: String = "OBSERVER"): TortoiseJson =
      compiledModel.compileCommand(sanitizeSource(code), toKind(agentType))
    def compileRep(code: String): TortoiseJson =
      compiledModel.compileReporter(sanitizeSource(code))
    def compilePen(pen: Pen): TortoiseJson =
      JsObject(pen.toJsonObj.asInstanceOf[JsObject].props ++ ListMap(
        "compiledSetupCode" -> compileCmd(pen.setupCode),
        "compiledUpdateCode" -> compileCmd(pen.updateCode)))
    compiledModel.model.widgets.map { w: Widget =>
      val additionalCompiledProperties: ListMap[String, TortoiseJson] = w match {
        case b: Button      => ListMap(
          "compiledSource" -> compileCmd(b.source, b.buttonType))
        case p: Plot        => ListMap(
          "compiledSetupCode"  -> compileCmd(p.setupCode),
          "compiledUpdateCode" -> compileCmd(p.updateCode),
          "compiledPens"       -> JsArray(p.pens.map(compilePen)))
        case s: Slider      => ListMap(
          "compiledMin"  -> compileRep(s.min),
          "compiledMax"  -> compileRep(s.max),
          "compiledStep" -> compileRep(s.step))
        case m: Monitor     => ListMap(
          "compiledSource" -> compileRep(m.source))
        case _ => ListMap()
      }
      JsObject(
        w.toJsonObj.asInstanceOf[JsObject].props ++ additionalCompiledProperties)
    }
  }
}
