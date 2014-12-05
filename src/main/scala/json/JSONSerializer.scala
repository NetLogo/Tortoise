// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import org.json4s._
import org.json4s.native.JsonMethods._

import
  org.nlogo.{ api, core, mirror },
    api.{ Shape, ShapeList },
    core.{ AgentVariables, LogoList },
    mirror._
import Mirrorables._

import scala.collection.JavaConverters._

import ShapeToJsonConverters._

object JSONSerializer {

  def serialize(update: Update): String = {

    def births: Seq[(Kind, JField)] =
      for {
        Birth(AgentKey(kind, id), values) <- update.births
        varNames = getImplicitVariables(kind)
        varFields = varNames zip values.map(toJValue)
      } yield kind -> JField(id.toString, JObject(varFields: _*))

    def changes: Seq[(Kind, JField)] =
      for {
        (AgentKey(kind, id), changes) <- update.changes
        varNames = getImplicitVariables(kind)
        implicitVars = for {
          Change(varIndex, value) <- changes
          varName = if (varNames.length > varIndex) varNames(varIndex) else varIndex.toString
        } yield varName -> toJValue(value)
      } yield kind -> JField(id.toString, JObject(implicitVars: _*))

    def deaths: Seq[(Kind, JField)] =
      for {
        Death(AgentKey(kind, id)) <- update.deaths if kind != Patch
      } yield kind -> JField(id.toString, JObject(JField("WHO", JInt(-1))))

    val fieldsByKind: Map[Kind, Seq[JField]] =
      (births ++ changes ++ deaths)
        .groupBy(_._1) // group by kinds
        .mapValues(_.map(_._2)) // remove kind from pairs

    val keysToKind = Seq(
      "turtles" -> Turtle,
      "patches" -> Patch,
      "world" -> World,
      "links" -> Link,
      "observer" -> Observer
    )

    val objectsByKey: Seq[(String, JObject)] =
      for {
        (key, kind) <- keysToKind
        fields = fieldsByKind.getOrElse(kind, Seq())
      } yield key -> JObject(fields: _*)

    compact(render(JObject(objectsByKey: _*)))
  }

  def serialize(v: AnyRef): String = {
    compact(render(toJValue(v)))
  }

  def toJValue(v: AnyRef): JValue = v match {
    case d: java.lang.Double  =>
      if (d.intValue == d.doubleValue)
        JInt(d.intValue)
      else
        JDouble(d.doubleValue)
    case i: java.lang.Integer    => JInt(i.intValue)
    case i: java.lang.Long       => JInt(i.intValue)
    case b: java.lang.Boolean    => JBool(b)
    case s: java.lang.String     => JString(s)
    case s: ShapeList            => JObject((s.getShapes.asScala map (shape => shape.getName -> shape.toJsonObj)).toList)
    case s: Shape                => s.toJsonObj
    case l: LogoList             => JArray((l.toVector map toJValue).toList)
    case (x: AnyRef, y: AnyRef)  => JArray(List(toJValue(x), toJValue(y)))
    case Some(x: AnyRef)         => toJValue(x)
    case None                    => JNull
    case x                       => JString("XXX IMPLEMENT ME") // JString(v.toString)
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
