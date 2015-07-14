// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  json.{ Jsonify, JsonReader, ShapeToJsonConverters, TortoiseJson, WidgetToJson },
    JsonReader.{ OptionalJsonReader, tortoiseJsAsStringSeq, tortoiseJs2String },
    ShapeToJsonConverters.{ readLinkShapes, readVectorShapes },
    TortoiseJson.JsObject,
    WidgetToJson.{ widget2Json, readWidgetJson, readWidgetsJson }

import
  org.nlogo.core.{ Model, Shape, Widget },
    Shape.{ LinkShape, VectorShape }

case class ExportRequest(
  code:         String,
  info:         Option[String],
  widgets:      Seq[Widget],
  turtleShapes: Option[Seq[VectorShape]],
  linkShapes:   Option[Seq[LinkShape]]
) {
  def toModel: Model =
    Model(
      code         = code,
      widgets      = widgets.toList,
      info         = info                       getOrElse "",
      turtleShapes = turtleShapes.map(_.toList) getOrElse Model.defaultShapes,
      linkShapes   = linkShapes.map(_.toList)   getOrElse Model.defaultLinkShapes)
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
}

case class CompilationRequest(
  code:         String,
  info:         Option[String],
  widgets:      Seq[Widget],
  commands:     Option[Seq[String]],
  turtleShapes: Option[Seq[VectorShape]],
  linkShapes:   Option[Seq[LinkShape]]
) {

  val allCommands: Seq[String] = commands.getOrElse(Seq())

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
