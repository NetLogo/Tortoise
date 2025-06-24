// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import json.{ CompilationRequestReader, ExportRequestReader, JsonReader, ShapeToJsonConverters, TortoiseJson, WidgetToJson }
import JsonReader.{ OptionalJsonReader, tortoiseJsAsStringSeq, tortoiseJs2String }
import ShapeToJsonConverters.{ readLinkShapes, readVectorShapes }
import TortoiseJson.JsObject
import WidgetToJson.{ readWidgetsJson }

import org.nlogo.core.{ ExternalResource, Model, Shape, Widget }
import Shape.{ LinkShape, VectorShape }

case class ExportRequest(
  code:         String,
  info:         Option[String],
  widgets:      Seq[Widget],
  turtleShapes: Option[Seq[VectorShape]],
  linkShapes:   Option[Seq[LinkShape]],
  resources:    Option[Seq[ExternalResource]],
  version:      Option[String]
) {
  def toModel: Model =
    Model(
      code         = code,
      widgets      = widgets.toList,
      info         = info                       getOrElse "",
      turtleShapes = turtleShapes.map(_.toList) getOrElse Model.defaultTurtleShapes,
      linkShapes   = linkShapes.map(_.toList)   getOrElse Model.defaultLinkShapes,
      resources    = resources                  getOrElse Seq(),
      version      = version                    getOrElse ExportRequest.NlogoFileVersion)
}

private[tortoise] trait RequestSharedImplicits {
  implicit object optionalStringReader extends OptionalJsonReader[String] {
    override val transform = tortoiseJs2String
  }

  implicit object optionalVectorShapes extends OptionalJsonReader[Seq[VectorShape]] {
    override val transform = readVectorShapes
  }

  implicit object optionalLinkShapes extends OptionalJsonReader[Seq[LinkShape]] {
    override val transform = readLinkShapes
  }

  implicit object optionalExternalResources extends OptionalJsonReader[Seq[ExternalResource]] {
    override val transform = tortoiseJs2ExternalResources
  }

  import JsonReader.JsonSequenceReader
  import scalaz.ValidationNel
  import scalaz.Scalaz.ToValidationOps

  implicit val tortoiseJs2ExternalResources: JsonSequenceReader[ExternalResource] = new JsonSequenceReader[ExternalResource] {
    def convertElem(json: TortoiseJson): ValidationNel[String, ExternalResource] =
      json match {
        case jso: JsObject => org.nlogo.tortoise.compiler.json.ExternalResourceReader(jso)
        case _             => s"Expected external resource JSON object, but got $json".failureNel
      }

    def nonArrayErrorString(json: TortoiseJson): String =
      s"Expected external resources as an array of objects, got $json"
  }

}

object ExportRequest extends RequestSharedImplicits {
  val read = ExportRequestReader
  final val NlogoFileVersion = "NetLogo 7.0.0-beta0"
}

case class CompilationRequest(
  code:         String,
  info:         Option[String],
  version:      Option[String],
  widgets:      Seq[Widget],
  commands:     Option[Seq[String]],
  reporters:    Option[Seq[String]],
  turtleShapes: Option[Seq[VectorShape]],
  linkShapes:   Option[Seq[LinkShape]],
  resources:    Option[Seq[ExternalResource]]
) {

  val allCommands:  Seq[String] = commands. getOrElse(Seq())
  val allReporters: Seq[String] = reporters.getOrElse(Seq())

  def toModel: Model =
    Model(
      code         = code,
      widgets      = widgets.toList,
      info         = info                       getOrElse "",
      turtleShapes = turtleShapes.map(_.toList) getOrElse Model.defaultTurtleShapes,
      linkShapes   = linkShapes.map(_.toList)   getOrElse Model.defaultLinkShapes,
      resources    = resources                  getOrElse Seq())
}

object CompilationRequest extends RequestSharedImplicits {
  implicit object optionalSeqReader extends OptionalJsonReader[Seq[String]] {
    override val transform = tortoiseJsAsStringSeq
  }

  val read = CompilationRequestReader
}
