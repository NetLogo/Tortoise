// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  json.{ Jsonify, JsonLibrary, JsonReader, JsonWritable, JsonWriter, TortoiseJson, WidgetToJson },
    JsonLibrary.{ Native => NativeJson },
    JsonWriter._,
    TortoiseJson._,
    WidgetToJson.{ widget2Json, readWidgetJson }

import
  org.nlogo.core.{ AgentKind, CompilerException, FrontEndInterface, Model, Widget }

import
  scala.reflect.ClassTag

import
  scala.scalajs.js.annotation.JSExport

import
  scalaz.{ NonEmptyList, Scalaz, std, Validation, ValidationNel },
    std.list._,
    Scalaz.ToValidationOps,
    Validation.FlatMap.ValidationFlatMapRequested

import
  CompiledModel.CompileResult

@JSExport("BrowserCompiler")
class BrowserCompiler {

  import BrowserCompiler._

  @JSExport
  def fromModel(codeJson: NativeJson, widgetJson: NativeJson, commandJson: NativeJson): NativeJson = {
    val compilationResult =
      for {
        code        <- readNative[String](codeJson)
        widgets     <- readArray[Widget](widgetJson, "widgets")
        commands    <- readArray[String](commandJson, "commands")
        compilation <- compilingModel(_.fromModel(Model(code = code, widgets = widgets)), compileCommands(commands))
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

  private def compilingModel(
    f: CompiledModel.type => ValidationNel[CompilerException, CompiledModel],
    g: (CompiledModel, ModelCompilation) => ModelCompilation = (a, b) => b): ValidationNel[Failure, ModelCompilation] =
    Validation.fromTryCatchThrowable[ValidationNel[Failure, ModelCompilation], Throwable](
      f(CompiledModel).leftMap(_.map(e => FailureCompilerException(e)))
        .map(m => g(m, ModelCompilation.fromCompiledModel(m, compileWidgets(m))))
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
    JsonReader.read(JsonLibrary.toTortoise(n))(ev).leftMap(_.map(s => FailureString(s)))

  private def sanitizeSource(s: String) =
    s.replace("\\n", "\n").replace("\\\\", "\\").replace("\\\"", "\"")

  private val toKind = Map(
    "OBSERVER" -> AgentKind.Observer,
    "TURTLE"   -> AgentKind.Turtle,
    "PATCH"    -> AgentKind.Patch,
    "LINK"     -> AgentKind.Link)

  private def compileWidgets(compiledModel: CompiledModel): List[CompiledWidget] = {
    import org.nlogo.core.{Plot, Button, Slider, Monitor, Pen, Widget}
    def compileCmd(code: String, agentType: String = "OBSERVER"): CompiledStringV =
      compiledModel.compileCommand(sanitizeSource(code), toKind(agentType.toUpperCase))
    def compileRep(code: String): CompiledStringV =
      compiledModel.compileReporter(sanitizeSource(code))
    def compilePen(pen: Pen): CompiledWidget =
      CompiledWidget(
        pen, UpdateableCompilation(compileCmd(pen.setupCode), compileCmd(pen.updateCode)))
    compiledModel.model.widgets.map { w: Widget =>
      CompiledWidget(w,
        w match {
        case b: Button      => SourceCompilation(compileCmd(b.source, b.buttonType))
        case m: Monitor     => SourceCompilation(compileRep(m.source))
        case p: Plot        =>
          PlotWidgetCompilation(compileCmd(p.setupCode), compileCmd(p.updateCode), p.pens.map(compilePen))
        case s: Slider      =>
          SliderCompilation(compileRep(s.min), compileRep(s.max), compileRep(s.step))
        case _ => NotCompiled
      })
    }
  }
}

object BrowserCompiler {

  type CompiledModelV  = CompileResult[CompiledModel]
  type CompiledStringV = CompileResult[String]

  implicit object compileError2Json extends JsonWriter[Throwable] {
    def apply(ex: Throwable): TortoiseJson =
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
  }

  implicit object compileFailure2Json extends JsonWriter[Failure] {
    def apply(f: Failure): TortoiseJson =
      f match {
        case FailureCompilerException(ce) => ce.toJsonObj
        case FailureException(e)          => e.toJsonObj
        case FailureString(s)             =>
          JsObject(fields("message" -> JsString(s)))
      }
  }

  implicit object compileResult2Json extends JsonWriter[CompiledStringV] {
    def apply(compileResult: CompiledStringV): TortoiseJson =
      compileResult.fold(
        es => JsObject(fields(
          "success" -> JsBool(false),
          "result" -> JsArray(es.list.toList.map((e: Exception) => e.toJsonObj)))),
      success => JsObject(fields(
        "success" -> JsBool(true),
        "result" -> JsString(success))))
  }

  implicit object compiledWidgets2Json extends JsonWriter[Seq[CompiledWidget]] {
    def apply(l: Seq[CompiledWidget]) = JsArray(l.map(_.toJsonObj))
  }

  implicit object compiledCommands2Json extends JsonWriter[Seq[CompiledStringV]] {
    def apply(l: Seq[CompiledStringV]) = JsArray(l.map(compileResult2Json))
  }

  implicit object compilation2JsonWriter extends JsonWriter[ValidationNel[Failure, ModelCompilation]] {
    private def compilationSuccessJson(success: ModelCompilation): TortoiseJson = {
      val compilation = Jsonify.writer[ModelCompilation, TortoiseJson](success)
      JsObject(compilation.asInstanceOf[JsObject].props +
        ("success" -> JsBool(true)))
    }
    private def compilationFailureJson(failures: NonEmptyList[Failure]): JsObject =
      JsObject(fields(
        "success" -> JsBool(false),
        "result"  -> JsArray(failures.list.toList.map(_.toJsonObj))))

    def apply(compileResult: ValidationNel[Failure, ModelCompilation]): TortoiseJson =
      compileResult.fold(compilationFailureJson, compilationSuccessJson)
  }

  implicit object widgetCompilation2Json extends JsonWriter[WidgetCompilation] {
    import BrowserCompiler.compiledWidgets2Json

    def apply(widgetCompilation: WidgetCompilation): TortoiseJson =
      widgetCompilation match {
        case NotCompiled              => JsObject(fields())
        case s: SourceCompilation     => Jsonify.writer[SourceCompilation, TortoiseJson](s)
        case u: UpdateableCompilation => Jsonify.writer[UpdateableCompilation, TortoiseJson](u)
        case p: PlotWidgetCompilation => Jsonify.writer[PlotWidgetCompilation, TortoiseJson](p)
        case s: SliderCompilation     => Jsonify.writer[SliderCompilation, TortoiseJson](s)
      }
  }

  implicit def exception2Json(ex: Throwable): JsonWritable =
    JsonWriter.convert(ex)

  implicit def failure2Json(f: Failure): JsonWritable =
    JsonWriter.convert(f)

  implicit def compileWidget2Json(compiledWidget: CompiledWidget): JsonWritable =
    new JsonWritable {
      def toJsonObj = JsObject(
        widgetCompilation2Json(compiledWidget.widgetCompilation).asInstanceOf[JsObject].props ++
        compiledWidget.widgetData.toJsonObj.asInstanceOf[JsObject].props)
    }

  implicit def compilationResult2Json(modelCompilation: ValidationNel[Failure, ModelCompilation]): JsonWritable =
    JsonWriter.convert(modelCompilation)

  case class CompiledWidget(widgetData: Widget, widgetCompilation: WidgetCompilation)

  sealed trait WidgetCompilation
  case object NotCompiled extends WidgetCompilation
  case class SourceCompilation(
    compiledSource: CompiledStringV) extends WidgetCompilation
  case class UpdateableCompilation(
    compiledSetupCode: CompiledStringV,
    compiledUpdateCode: CompiledStringV) extends WidgetCompilation
  case class PlotWidgetCompilation(
    compiledSetupCode: CompiledStringV,
    compiledUpdateCode: CompiledStringV,
    compiledPens: Seq[CompiledWidget]) extends WidgetCompilation
  case class SliderCompilation(compiledMin: CompiledStringV,
    compiledMax: CompiledStringV,
    compiledStep: CompiledStringV) extends WidgetCompilation

  case class ModelCompilation(
    result: String,
    code: String,
    info: String,
    widgets: Seq[CompiledWidget],
    commands: Seq[CompiledStringV] = Seq(),
    reporters: Seq[CompiledStringV] = Seq())

  object ModelCompilation {
    def fromCompiledModel(compiledModel: CompiledModel, widgets: Seq[CompiledWidget]): ModelCompilation =
      ModelCompilation(
        compiledModel.compiledCode,
        compiledModel.model.code,
        compiledModel.model.info,
        widgets)
  }

  sealed trait Failure
  case class FailureString(str: String) extends Failure
  case class FailureException(exception: Throwable) extends Failure
  case class FailureCompilerException(exception: CompilerException) extends Failure

}
