// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  json.{ JsonReader, ShapeToJsonConverters, TortoiseJson, WidgetToJson },
    JsonReader.{ OptionalJsonReader, tortoiseJsAsStringSeq, tortoiseJs2String },
    ShapeToJsonConverters.{ readLinkShapes, readVectorShapes },
    TortoiseJson.JsObject,
    WidgetToJson.{ readWidgetsJson }

import
  org.nlogo.tortoise.macros.json.Jsonify

import
  org.nlogo.core.{ Model, Shape, Widget },
    Shape.{ LinkShape, VectorShape }

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
      turtleShapes = turtleShapes.map(_.toList) getOrElse Model.defaultShapes,
      linkShapes   = linkShapes.map(_.toList)   getOrElse Model.defaultLinkShapes,
      version      = version                    getOrElse ExportRequest.NlogoFileVersion)
}

private[tortoise] trait RequestSharedImplicits {
  implicit object optionalStringReader extends OptionalJsonReader[String] {
    override val transform = tortoiseJs2String
  }

  implicit object optionVectorShapes extends OptionalJsonReader[Seq[VectorShape]] {
    override val transform = readVectorShapes _
  }

  implicit object optionLinkShapes extends OptionalJsonReader[Seq[LinkShape]] {
    override val transform = readLinkShapes _
  }
}

object ExportRequest extends RequestSharedImplicits {
  val read = Jsonify.reader[JsObject, ExportRequest]
  final val NlogoFileVersion = "NetLogo 6.4.0"
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
      turtleShapes = turtleShapes.map(_.toList) getOrElse Model.defaultShapes,
      linkShapes   = linkShapes.map(_.toList)   getOrElse Model.defaultLinkShapes)
}

object CompilationRequest extends RequestSharedImplicits {
  implicit object optionalSeqReader extends OptionalJsonReader[Seq[String]] {
    override val transform = tortoiseJsAsStringSeq
  }

  val read = Jsonify.reader[JsObject, CompilationRequest]
}
