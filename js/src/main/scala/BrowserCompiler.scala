// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  CompiledModel.CompileResult

import
  json.{ Jsonify, JsonLibrary, JsonReader, JsonWritable, JsonWriter, TortoiseJson },
    JsonLibrary.{ Native => NativeJson, toTortoise },
    JsonWriter.string2TortoiseJs,
    TortoiseJson._

import
  org.nlogo.core.{ CompilerException, LiteralParser, model },
    model.ModelReader

import
  scala.reflect.ClassTag

import
  scala.scalajs.js.annotation.JSExport

import
  scalaz.{ NonEmptyList, Scalaz, std, Validation, ValidationNel },
    std.list._,
    Scalaz.ToValidationOps,
    Validation.FlatMap.ValidationFlatMapRequested

@JSExport("BrowserCompiler")
class BrowserCompiler {

  import BrowserCompiler._

  @JSExport
  def fromModel(compilationRequest: NativeJson): NativeJson = {
    val compilationResult =
      for {
        tortoiseReq   <- readNative[JsObject](compilationRequest)
        parsedRequest <- CompilationRequest.read(tortoiseReq).leftMap(_.map(FailureString))
        compilation   <- compilingModel(
          _.fromModel(parsedRequest.toModel), compileCommands(parsedRequest.allCommands))
      } yield compilation

    JsonLibrary.toNative(compilationResult.toJsonObj)
  }

  @JSExport
  def fromNlogo(contents: String, commandJson: NativeJson): NativeJson = {
    val compilationResult =
      for {
        commands    <- readArray[String](commandJson, "commands")
        compilation <- compilingModel(_.fromNlogoContents(contents), compileCommands(commands))
      } yield compilation
    JsonLibrary.toNative(compilationResult.toJsonObj)
  }

  @JSExport
  def fromNlogo(contents: String): NativeJson =
    JsonLibrary.toNative(compilingModel(_.fromNlogoContents(contents)).toJsonObj)

  @JSExport
  def exportNlogo(exportRequest: NativeJson): NativeJson = {
    val model =
      for {
        tortoiseReq   <- readNative[JsObject](exportRequest)
        parsedRequest <- ExportRequest.read(tortoiseReq).leftMap(_.map(FailureString))
      } yield ModelReader.formatModel(parsedRequest.toModel, literalParser)

    JsonLibrary.toNative(model.toJsonObj)
  }

  private def compilingModel(
    f: CompiledModel.type => ValidationNel[Exception, CompiledModel],
    g: (CompiledModel, ModelCompilation) => ModelCompilation = (a, b) => b): ValidationNel[Failure, ModelCompilation] =
    Validation.fromTryCatchThrowable[ValidationNel[Failure, ModelCompilation], Throwable](
      f(CompiledModel).leftMap(_.map {
        case e: CompilerException => FailureCompilerException(e)
        case e: Exception         => FailureException(e)
      })
        .map(m => g(m, ModelCompilation.fromCompiledModel(m)))
    ).fold(
      error => FailureException(error).failureNel[ModelCompilation],
      success => success)

  private def readArray[A](native: NativeJson, name: String)
                          (implicit ct: ClassTag[A], ev: JsonReader[TortoiseJson, A]): ValidationNel[Failure, List[A]] = {

    def defaultError = FailureString(s"$name must be an Array of ${ct.runtimeClass.getSimpleName}")
    val arrV         = readNative[JsArray](native) orElse defaultError.failureNel

    arrV.flatMap {
      arr =>
        val validations = arr.elems.map(e => JsonReader.read(e)(ev).bimap(_ map FailureString, List(_)))
        validations.foldLeft(List.empty[A].successNel[Failure])(_ +++ _)
    }

  }

  private def compileCommands(commands: Seq[String])(model: CompiledModel, compilation: ModelCompilation): ModelCompilation =
    compilation.copy(commands = commands.map(model.compileCommand(_)))

  private def readNative[A](n: NativeJson)(implicit ev: JsonReader[TortoiseJson, A]): ValidationNel[Failure, A] =
    JsonReader.read(toTortoise(n))(ev).leftMap(_.map(s => FailureString(s)))
}

object BrowserCompiler {

  import Failure.exception2Json

  type CompiledModelV  = CompileResult[CompiledModel]
  type CompiledStringV = CompileResult[String]

  implicit object compileResult2Json extends JsonWriter[CompiledStringV] {
    def apply(compileResult: CompiledStringV): TortoiseJson =
      compileResult.fold(
        es => JsObject(fields(
          "success" -> JsBool(false),
          "result"  -> JsArray(es.list.toList.map((e: Exception) => e.toJsonObj)))),
      success => JsObject(fields(
        "success" -> JsBool(true),
        "result" -> JsString(success))))
  }

  implicit object compiledCommands2Json extends JsonWriter[Seq[CompiledStringV]] {
    def apply(l: Seq[CompiledStringV]): TortoiseJson = JsArray(l.map(compileResult2Json))
  }

  implicit object compiledWidgets2JsonString extends JsonWriter[Seq[CompiledWidget]] {
    def apply(widgets: Seq[CompiledWidget]): TortoiseJson =
      JsString(WidgetCompiler.formatWidgets(widgets))
  }

  implicit object export2JsonWriter extends JsonWriter[ValidationNel[Failure, String]] {
    def apply(compileResult: ValidationNel[Failure, String]): TortoiseJson =
      compileResult.fold(
        failureJson,
        success =>
          JsObject(successJson(success).props + ("success" -> JsBool(true))))

    private def failureJson(failures: NonEmptyList[Failure]): JsObject =
      JsObject(fields(
        "success" -> JsBool(false),
        "result"  -> JsArray(failures.list.toList.map(_.toJsonObj))))

    private def successJson(success: String): JsObject =
      JsObject(fields("result" -> JsString(success)))
  }

  implicit object modelCompilationNel2Json extends JsonWriter[ValidationNel[Failure, CompiledModel]] {
    def apply(compileResult: ValidationNel[Failure, CompiledModel]): TortoiseJson =
      compileResult.fold(
        failureJson,
        success =>
          JsObject(fields(
            "success" -> JsBool(true),
            "result"  -> JsString(success.compiledCode))))

    private def failureJson(failures: NonEmptyList[Failure]): JsObject =
      JsObject(fields(
        "success" -> JsBool(false),
        "result"  -> JsArray(failures.list.toList.map(_.toJsonObj))))
  }

  implicit object compilation2JsonWriter extends JsonWriter[ModelCompilation] {
    override def apply(success: ModelCompilation): JsObject =
      Jsonify.writer[ModelCompilation, TortoiseJson](success).asInstanceOf[JsObject]
  }

  implicit def compilationResult2Json(modelCompilationV: ValidationNel[Failure, ModelCompilation]): JsonWritable =
    // We fold up any errors that occurred outside the scope of the CompiledModel into
    // the CompiledModel result so we can avoid looking at 5 different success keys
    JsonWriter.convert(
      modelCompilationV.fold(
      errors => ModelCompilation(model = errors.failure, "", "", Seq()),
      success => success))

  case class ModelCompilation(
    model: ValidationNel[Failure, CompiledModel],
    code: String,
    info: String,
    widgets: Seq[CompiledWidget],
    commands: Seq[CompiledStringV] = Seq(),
    reporters: Seq[CompiledStringV] = Seq())

  implicit def exportResult2Json(exportResult: ValidationNel[Failure, String]): JsonWritable =
    JsonWriter.convert(exportResult)

  object ModelCompilation {
    def fromCompiledModel(compiledModel: CompiledModel): ModelCompilation =
      ModelCompilation(
        compiledModel.successNel,
        compiledModel.model.code,
        compiledModel.model.info,
        compiledModel.widgets)
  }

  object literalParser extends LiteralParser {
    def readFromString(s: String): AnyRef            = throw new Exception("Invalid NetLogo Web Model")
    def readNumberFromString(source: String): AnyRef = throw new Exception("Invalid NetLogo Web Model")
  }
}
