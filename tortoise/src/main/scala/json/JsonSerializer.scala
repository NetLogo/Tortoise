// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import TortoiseJson._
import JsonLibrary._

import
  org.nlogo.{ core, mirror },
    core.{ AgentVariables, LogoList, Shape, ShapeList },
    mirror._
import Mirrorables._

import ShapeToJsonConverters._

import scala.collection.immutable.ListMap

object JsonSerializer {

  def serialize(update: Update): String = {

    def births: Seq[(Kind, (Long, TortoiseJson))] =
      for {
        Birth(AgentKey(kind, id), values) <- update.births.sortBy(_.agent.id)
        varNames = getImplicitVariables(kind)
        varFields = varNames zip values.map(toJValue)
      } yield kind -> ((id, JsObject(sequentialFields(varFields))))

    def changes: Seq[(Kind, (Long, TortoiseJson))] =
      for {
        (AgentKey(kind, id), changes) <- update.changes
        varNames = getImplicitVariables(kind)
        implicitVars = for {
          Change(varIndex, value) <- changes
          varName = if (varNames.length > varIndex) varNames(varIndex) else varIndex.toString
        } yield varName -> toJValue(value)
      } yield kind -> ((id, JsObject(sequentialFields(implicitVars))))

    def deaths: Seq[(Kind, (Long, TortoiseJson))] =
      for {
        Death(AgentKey(kind, id)) <- update.deaths.sortBy(_.agent.id) if kind != Patch
      } yield kind -> ((id, JsObject(fields("WHO" -> JsInt(-1)))))

    val fieldsByKind: Map[Kind, ListMap[String, TortoiseJson]] =
      (births ++ changes ++ deaths)
        .groupBy(_._1) // group by kinds
        .mapValues(v => sequentialFields(v.map(_._2).sortBy(_._1).map(t => (t._1.toString, t._2)))) // remove kind from pairs

    val keysToKind = Seq(
      "turtles" -> Turtle,
      "patches" -> Patch,
      "world" -> World,
      "links" -> Link,
      "observer" -> Observer
    )

    val objectsByKey: Seq[(String, JsObject)] =
      for {
        (key, kind) <- keysToKind
        objectFields = fieldsByKind.getOrElse(kind, fields())
      } yield key -> JsObject(objectFields)

    nativeToString(toNative(JsObject(sequentialFields(objectsByKey))))
  }

  def serialize(v: AnyRef): String = {
    nativeToString(toNative(toJValue(v)))
  }

  def toJValue(v: AnyRef): TortoiseJson = v match {
    case d: java.lang.Double  =>
      if (d.intValue == d.doubleValue)
        JsInt(d.intValue)
      else
        JsDouble(d.doubleValue)
    case i: java.lang.Integer    => JsInt(i.intValue)
    case i: java.lang.Long       => JsInt(i.intValue)
    case b: java.lang.Boolean    => JsBool(b)
    case s: java.lang.String     => JsString(s)
    case s: ShapeList            => JsObject(
      sequentialFields(s.shapes.map (shape => shape.name -> shape.toJsonObj)))
    case s: Shape                => s.toJsonObj
    case l: LogoList             => JsArray((l.toVector map toJValue).toList)
    case (x: AnyRef, y: AnyRef)  => JsArray(List(toJValue(x), toJValue(y)))
    case Some(x: AnyRef)         => toJValue(x)
    case None                    => JsNull
    case x                       => JsString("XXX IMPLEMENT ME") // JString(v.toString)
  }

  def getImplicitVariables(kind: Kind): Seq[String] =
    kind match {
      case Turtle => AgentVariables.getImplicitTurtleVariables
      case Patch  => AgentVariables.getImplicitPatchVariables
      case Link   => AgentVariables.getImplicitLinkVariables ++ Array("SIZE", "HEADING", "MIDPOINTX", "MIDPOINTY")
      // Note that all cases can be replaced by _. However, we don't deal with linethickness yet, need to address that.
      case _      => 0 until kind.Variables.maxId map (kind.Variables.apply(_).toString)
    }

}
