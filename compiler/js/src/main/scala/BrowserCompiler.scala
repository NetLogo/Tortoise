// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  CompiledModel.CompileResult

import
  json.{ JsonLibrary, JsonReader, JsonWritable, JsonWriter, TortoiseJson },
    JsonLibrary.{ Native => NativeJson, toTortoise },
    JsonWriter.string2TortoiseJs,
    TortoiseJson._

import
  org.nlogo.tortoise.macros.json.Jsonify

import
  org.nlogo.core.{ CompilerException, model },
    model.ModelReader

import org.nlogo.parse.CompilerUtilities

import
  scala.reflect.ClassTag

import
  scala.scalajs.js

import
  scala.scalajs.js.annotation.{ JSExport, JSExportTopLevel }

import
  scalaz.{ NonEmptyList, Scalaz, std, Validation, ValidationNel },
    std.list._,
    Scalaz.ToValidationOps,
    Validation.FlatMap.ValidationFlatMapRequested

@JSExportTopLevel("BrowserCompiler")
class BrowserCompiler {

  import BrowserCompiler._

  // scalastyle:off null
  private var lastCompiledModel: CompiledModel = null
  // scalastyle:on null

  @JSExport
  def fromModel(compilationRequest: NativeJson): NativeJson = {
    val compiledRequest = compileRequest(compilationRequest)
    JsonLibrary.toNative(compiledRequest.toJsonObj)
  }

  @JSExport
  def fromNlogo(contents: String, commandJson: NativeJson): NativeJson = {

    val compilationResult =
      for {
        commands      <- readArray[String](commandJson, "commands")
        compiledModel =  CompiledModel.fromNlogoContents(contents)
        compilation   <- transformErrorsAndUpdateModel(compiledModel, compileExtras(commands, Seq()))
      } yield compilation

    JsonLibrary.toNative(compilationResult.toJsonObj)

  }

  @JSExport
  def fromNlogo(contents: String): NativeJson =
    JsonLibrary.toNative(transformErrorsAndUpdateModel(CompiledModel.fromNlogoContents(contents)).toJsonObj)

  @JSExport
  def exportNlogo(exportRequest: NativeJson): NativeJson = {

    val model =
      for {
        tortoiseReq   <- readNative[JsObject](exportRequest)
        parsedRequest <- ExportRequest.read(tortoiseReq).leftMap(_.map(FailureString))
      } yield ModelReader.formatModel(parsedRequest.toModel)

    JsonLibrary.toNative(model.leftMap(_.map(fail => fail: TortoiseFailure)).toJsonObj)

  }

  @JSExport
  def isReporter(code: String): Boolean =
    CompilerUtilities.isReporter(
        code
      , this.lastCompiledModel.compilation.program
      , this.lastCompiledModel.compilation.procedures
      , NLWExtensionManager
    )

  @JSExport
  def compileCommand(command: String): NativeJson = {
    val results: CompiledStringV = lastCompiledModel.compileCommand(command)
    JsonLibrary.toNative(compileResult2Json.apply(results))
  }

  @JSExport
  def compileReporter(command: String): NativeJson = {
    val results: CompiledStringV = lastCompiledModel.compileReporter(command)
    JsonLibrary.toNative(compileResult2Json.apply(results))
  }

  @JSExport
  def compileRawCommand(command: String): NativeJson = {
    val results: CompiledStringV = lastCompiledModel.compileRawCommand(command)
    JsonLibrary.toNative(compileResult2Json.apply(results))
  }

  @JSExport
  def compileProceduresIncremental(command: String, overriding: js.Array[String]): NativeJson = {
    val overridingSeq: Seq[String] = overriding
    val results: CompiledStringV   = lastCompiledModel.compileProceduresIncremental(command, overridingSeq)
    JsonLibrary.toNative(compileResult2Json.apply(results))
  }

  private def compileRequest(compilationRequest: NativeJson): ValidationNel[TortoiseFailure, ModelCompilation] = {

    val compilationResult =
      for {
        tortoiseReq   <- readNative[JsObject](compilationRequest)
        parsedRequest <- CompilationRequest.read(tortoiseReq).leftMap(_.map(FailureString))
        compiledModel =  CompiledModel.fromModel(parsedRequest.toModel).leftMap(_.map(ex => ex: Exception))
        compilation   <- transformErrorsAndUpdateModel(
          compiledModel,
          compileExtras(parsedRequest.allCommands, parsedRequest.allReporters)
        )
      } yield compilation

    compilationResult.leftMap(_.map(fail => fail: TortoiseFailure))

  }

  private def transformErrorsAndUpdateModel(
    compiledModelWithExceptions: ValidationNel[Exception, CompiledModel],
    updateCompilation:           (CompiledModel, ModelCompilation) => ModelCompilation = (a, b) => b
  ): ValidationNel[TortoiseFailure, ModelCompilation] = {

    val compiledModelWithFailures = compiledModelWithExceptions.leftMap(_.map {
      case e: CompilerException => FailureCompilerException(e): TortoiseFailure
      case e: Exception         => FailureException        (e): TortoiseFailure
    })

    val compilation = compiledModelWithFailures.map(compiledModel => {
      this.lastCompiledModel = compiledModel
      updateCompilation(compiledModel, ModelCompilation.fromCompiledModel(compiledModel))
    })
    val validatedCompilation = Validation.fromTryCatchThrowable[ValidationNel[TortoiseFailure, ModelCompilation], Throwable](compilation)

    validatedCompilation.fold(
      error => (FailureException(error): TortoiseFailure).failureNel[ModelCompilation],
      success => success
    )

  }

  private def readArray[A](native: NativeJson, name: String)
    (implicit ct: ClassTag[A], ev: JsonReader[TortoiseJson, A]): ValidationNel[TortoiseFailure, List[A]] = {

    def defaultError = FailureString(s"$name must be an Array of ${ct.runtimeClass.getSimpleName}")

    readNative[JsArray](native).orElse(defaultError.failureNel).flatMap {
      arr =>
        val validations = arr.elems.map(e => JsonReader.read(e)(ev).bimap(_ map FailureString, List(_)))
        validations.foldLeft(List.empty[A].successNel[FailureString])(_ +++ _).leftMap(_.map(fail => fail: TortoiseFailure))
    }.leftMap(_.map(fail => fail: TortoiseFailure))

  }

  private def compileExtras(commands: Seq[String], reporters: Seq[String])
    (model: CompiledModel, compilation: ModelCompilation): ModelCompilation = {
    compilation.copy(
      commands  = commands. map(model.compileCommand(_)),
      reporters = reporters.map(model.compileReporter(_))
    )
  }

  private def readNative[A](n: NativeJson)(implicit ev: JsonReader[TortoiseJson, A]): ValidationNel[TortoiseFailure, A] =
    JsonReader.read(toTortoise(n))(ev).leftMap(_.map(s => FailureString(s)))

}

object BrowserCompiler {

  import TortoiseFailure.exception2Json

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

  implicit object export2JsonWriter extends JsonWriter[ValidationNel[TortoiseFailure, String]] {
    def apply(compileResult: ValidationNel[TortoiseFailure, String]): TortoiseJson =
      compileResult.fold(
        failureJson,
        success =>
          JsObject(successJson(success).props + ("success" -> JsBool(true))))

    private def failureJson(failures: NonEmptyList[TortoiseFailure]): JsObject =
      JsObject(fields(
        "success" -> JsBool(false),
        "result"  -> JsArray(failures.list.toList.map(_.toJsonObj))))

    private def successJson(success: String): JsObject =
      JsObject(fields("result" -> JsString(success)))
  }

  implicit object modelCompilationNel2Json extends JsonWriter[ValidationNel[TortoiseFailure, CompiledModel]] {
    def apply(compileResult: ValidationNel[TortoiseFailure, CompiledModel]): TortoiseJson =
      compileResult.fold(
        failureJson,
        success =>
          JsObject(fields(
            "success" -> JsBool(true),
            "result"  -> JsString(success.compiledCode))))

    private def failureJson(failures: NonEmptyList[TortoiseFailure]): JsObject =
      JsObject(fields(
        "success" -> JsBool(false),
        "result"  -> JsArray(failures.list.toList.map(_.toJsonObj))))
  }

  implicit object compilation2JsonWriter extends JsonWriter[ModelCompilation] {
    override def apply(success: ModelCompilation): JsObject =
      Jsonify.writer[ModelCompilation, TortoiseJson](success).asInstanceOf[JsObject]
  }

  implicit def compilationResult2Json(modelCompilationV: ValidationNel[TortoiseFailure, ModelCompilation]): JsonWritable =
    // We fold up any errors that occurred outside the scope of the CompiledModel into
    // the CompiledModel result so we can avoid looking at 5 different success keys
    JsonWriter.convert(
      modelCompilationV.fold(
      errors => ModelCompilation(model = errors.failure, "", "", Seq()),
      success => success))

  implicit def exportResult2Json(exportResult: ValidationNel[TortoiseFailure, String]): JsonWritable =
    JsonWriter.convert(exportResult)

}
