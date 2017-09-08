// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  org.nlogo.core.ShapeList

import
  ShapeToJsonConverters.shape2Json

import
  TortoiseJson.{ fields, JsObject }

object ShapeListToJsonConverter {
  implicit def shapeList2Json(shapeList: ShapeList): JsonWritable =
    new JsonWritableShapeList(shapeList)

  class JsonWritableShapeList(shapeList: ShapeList) extends JsonWritable {
    def toJsonObj: JsObject =
      JsObject(fields(shapeList.shapes map(shape => shape.name -> shape.toJsonObj): _*))
  }
}
