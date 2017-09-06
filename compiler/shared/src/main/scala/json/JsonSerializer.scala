// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  java.lang.{ Double => JDouble, Integer => JInteger, Long => JLong, Boolean => JBoolean, String => JString }

import
  JsonLibrary.{ nativeToString, toNative }

import
  org.nlogo.{ core, drawing, mirror },
    core.{ AgentVariables, LogoList, Shape, ShapeList },
    drawing.DrawingAction,
    mirror.{ AgentKey, Birth, Change, Death, Kind, Mirrorables, Update },
      Mirrorables.{ Link, Observer, Patch, Turtle, World }

import
  scala.collection.immutable.ListMap

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsNull, JsObject, JsString }

object JsonSerializer {

  def serialize(u: Update): String =
    (serializeToJsObject _ andThen toNative andThen nativeToString)(u)

  def serialize(v: AnyRef): String =
    (toJValue _ andThen toNative andThen nativeToString)(v)

  def serializeWithViewUpdates(update: Update, viewUpdates: Seq[DrawingAction] = Seq()): String = {
    import DrawingActionToJsonConverters.drawingAction2Json
    val serializedUpdate = serializeToJsObject(update)
    val jsonViewUpdates  = "drawingEvents" -> JsArray(viewUpdates.map(_.toJsonObj))
    val withViewUpdates  = serializedUpdate.props + jsonViewUpdates
    nativeToString(toNative(JsObject(withViewUpdates)))
  }

  private def serializeToJsObject(update: Update): JsObject = {

    def births: Seq[(Kind, (Long, TortoiseJson))] =
      for {
        Birth(AgentKey(kind, id), values) <- update.births.sortBy(_.agent.id)
        varNames  = getImplicitVariables(kind)
        varFields = varNames zip values.map(toJValue)
      } yield kind -> ((id, JsObject(fields(varFields: _*))))

    def changes: Seq[(Kind, (Long, TortoiseJson))] =
      for {
        (AgentKey(kind, id), changes) <- update.changes
        varNames = getImplicitVariables(kind)
        implicitVars = for {
          Change(varIndex, value) <- changes
          varName = if (varNames.length > varIndex) varNames(varIndex) else varIndex.toString
        } yield varName -> toJValue(value)
      } yield kind -> ((id, JsObject(fields(implicitVars: _*))))

    def deaths: Seq[(Kind, (Long, TortoiseJson))] =
      for {
        Death(AgentKey(kind, id)) <- update.deaths.sortBy(_.agent.id) if kind != Patch
      } yield kind -> ((id, JsObject(fields("WHO" -> JsInt(-1)))))

    val fieldsByKind: Map[Kind, ListMap[String, TortoiseJson]] =
      (births ++ changes ++ deaths)
        .groupBy(_._1) // group by kinds
        .mapValues(v => fields(v.map(_._2).sortBy(_._1).map(t => (t._1.toString, t._2)): _*)) // remove kind from pairs

    val keysToKind = Seq(
      "turtles"  -> Turtle,
      "patches"  -> Patch,
      "world"    -> World,
      "links"    -> Link,
      "observer" -> Observer
    )

    val objectsByKey: Seq[(String, JsObject)] =
      for {
        (key, kind) <- keysToKind
        objectFields = fieldsByKind.getOrElse(kind, fields())
      } yield key -> JsObject(objectFields)

    JsObject(fields(objectsByKey: _*))
  }

  def toJValue(v: AnyRef): TortoiseJson =
    (javaPrimsToJson orElse logoPrimsToJson orElse scalaPrimsToJson)
      .applyOrElse(v, (x: AnyRef) => JsString("XXX IMPLEMENT ME"))

  private val javaPrimsToJson: PartialFunction[AnyRef, TortoiseJson] = {
    case d: JDouble if d.doubleValue.isValidInt => JsInt(d.intValue)
    case d: JDouble                             => JsDouble(d.doubleValue)
    case i: JInteger                            => JsInt(i.intValue)
    case i: JLong                               => JsInt(i.intValue)
    case b: JBoolean                            => JsBool(b)
    case s: JString                             => JsString(s)
  }

  private val logoPrimsToJson: PartialFunction[AnyRef, TortoiseJson] = {
    import ShapeToJsonConverters.shape2Json
    {
      case s: ShapeList => JsObject(fields(s.shapes.map(shape => shape.name -> shape.toJsonObj): _*))
      case s: Shape     => s.toJsonObj
      case l: LogoList  => JsArray((l.toVector map toJValue).toList)
    }
  }

  private val scalaPrimsToJson: PartialFunction[AnyRef, TortoiseJson] = {
    case (x: AnyRef, y: AnyRef) => JsArray(List(toJValue(x), toJValue(y)))
    case Some(x: AnyRef)        => toJValue(x)
    case None                   => JsNull
  }

  def getImplicitVariables(kind: Kind): Seq[String] =
    kind match {
      case Turtle => AgentVariables.getImplicitTurtleVariables
      case Patch  => AgentVariables.getImplicitPatchVariables
      case Link   => AgentVariables.getImplicitLinkVariables ++ Array("SIZE", "HEADING", "MIDPOINTX", "MIDPOINTY", "DIRECTED?")
      // Note that all cases can be replaced by _. However, we don't deal with linethickness yet, need to address that.
      case _      => 0 until kind.Variables.maxId map (kind.Variables.apply(_).toString)
    }

}
