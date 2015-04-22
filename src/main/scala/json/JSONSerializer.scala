// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.json

import
  java.lang.{ Boolean => JavaBoolean, Double => JavaDouble, Integer => JavaInt, Long => JavaLong, String => JavaString }

import
  org.nlogo.{ core, mirror, drawing },
    core.{ AgentVariables, LogoList, Shape, ShapeList },
    drawing.DrawingAction,
    mirror.{ AgentKey, Birth, Change, Death, Kind, Mirrorables, Update },
      Mirrorables.{ Link, Observer, Patch, Turtle, World }

import
  org.json4s.{ JArray, JBool, JDouble, JField, JInt, JNull, JObject, JString, JValue, native },
    native.JsonMethods.{ compact, render }

object JSONSerializer {

  def serialize(u: Update): String =
    (serializeToJObject _ andThen render andThen compact)(u)

  def serialize(v: AnyRef): String =
    (toJValue _ andThen render andThen compact)(v)

  def serializeWithViewUpdates(update: Update, viewUpdates: Seq[DrawingAction] = Seq()) = {
    import DrawingActionToJsonConverters.drawingAction2Json
    val serializedUpdate = serializeToJObject(update)
    val jsonViewUpdates  = "drawingEvents" -> JArray(viewUpdates.map(_.toJsonObj).toList)
    val withViewUpdates  = serializedUpdate.obj :+ jsonViewUpdates
    compact(render(JObject(withViewUpdates: _*)))
  }

  private def serializeToJObject(update: Update): JObject = {

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

    val fieldsByKind = (births ++ changes ++ deaths).groupBy(_._1).mapValues(_.map(_._2))

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

    JObject(objectsByKey: _*)
  }

  private def toJValue(v: AnyRef): JValue = {
    import ShapeToJsonConverters.shape2Json
    v match {
      case d: JavaDouble  =>
        if (d.intValue == d.doubleValue)
          JInt(d.intValue)
        else
          JDouble(d.doubleValue)
      case i: JavaInt             => JInt(i.intValue)
      case i: JavaLong            => JInt(i.intValue)
      case b: JavaBoolean         => JBool(b)
      case s: JavaString          => JString(s)
      case s: ShapeList           => JObject((s.shapes map (shape => shape.name -> shape.toJsonObj)).toList)
      case s: Shape               => s.toJsonObj
      case l: LogoList            => JArray((l.toVector map toJValue).toList)
      case (x: AnyRef, y: AnyRef) => JArray(List(toJValue(x), toJValue(y)))
      case Some(x: AnyRef)        => toJValue(x)
      case None                   => JNull
      case x                      => JString("XXX IMPLEMENT ME") // JString(v.toString)
    }
  }

  private def getImplicitVariables(kind: Kind): Seq[String] =
    kind match {
      case Turtle => AgentVariables.getImplicitTurtleVariables
      case Patch  => AgentVariables.getImplicitPatchVariables
      case Link   => AgentVariables.getImplicitLinkVariables ++ Array("SIZE", "HEADING", "MIDPOINTX", "MIDPOINTY", "DIRECTED?")
      // Note that all cases can be replaced by _. However, we don't deal with linethickness yet, need to address that.
      case _      => 0 until kind.Variables.maxId map (kind.Variables.apply(_).toString)
    }

}
