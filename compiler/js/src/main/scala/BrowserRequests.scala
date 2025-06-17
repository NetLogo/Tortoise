// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import json.{ CompilationRequestReader, ExportRequestReader, JsonReader, ShapeToJsonConverters, TortoiseJson, WidgetToJson }
import JsonReader.{ OptionalJsonReader, tortoiseJsAsStringSeq, tortoiseJs2String }
import ShapeToJsonConverters.{ readLinkShapes, readVectorShapes }
import TortoiseJson.JsObject
import WidgetToJson.{ readWidgetsJson }

import org.nlogo.core.{ Model, Shape, Widget }
import Shape.{ LinkShape, VectorShape }

case class ExportRequest(
  code:         String,
  info:         Option[String],
  widgets:      Seq[Widget],
  turtleShapes: Option[Seq[VectorShape]],
  linkShapes:   Option[Seq[LinkShape]],
  version:      Option[String]
) {
  def toModel: Model =
    Model(
      code         = code,
      widgets      = widgets.toList,
      info         = info                       getOrElse "",
      turtleShapes = turtleShapes.map(_.toList) getOrElse Model.defaultTurtleShapes,
      linkShapes   = linkShapes.map(_.toList)   getOrElse Model.defaultLinkShapes,
      version      = version                    getOrElse ExportRequest.NlogoFileVersion)
}

private[tortoise] trait RequestSharedImplicits {
  implicit object optionalStringReader extends OptionalJsonReader[String] {
    override val transform = tortoiseJs2String
  }

  implicit object optionVectorShapes extends OptionalJsonReader[Seq[VectorShape]] {
    override val transform = readVectorShapes
  }

  implicit object optionLinkShapes extends OptionalJsonReader[Seq[LinkShape]] {
    override val transform = readLinkShapes
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
  linkShapes:   Option[Seq[LinkShape]]
) {

  val allCommands:  Seq[String] = commands. getOrElse(Seq())
  val allReporters: Seq[String] = reporters.getOrElse(Seq())

  def toModel: Model =
    Model(
      code         = code,
      widgets      = widgets.toList,
      info         = info                       getOrElse "",
      turtleShapes = turtleShapes.map(_.toList) getOrElse Model.defaultTurtleShapes,
      linkShapes   = linkShapes.map(_.toList)   getOrElse Model.defaultLinkShapes)
}

object CompilationRequest extends RequestSharedImplicits {
  implicit object optionalSeqReader extends OptionalJsonReader[Seq[String]] {
    override val transform = tortoiseJsAsStringSeq
  }

  val read = CompilationRequestReader
}
