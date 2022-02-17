// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  ElemToJsonConverters._

import
  org.nlogo.core.Shape.{ LinkLine => CoreLinkLine, RgbColor, VectorShape }

import
  org.scalacheck.Gen

import
  org.scalatest.funsuite.AnyFunSuite

import
  org.scalatestplus.scalacheck.ScalaCheckDrivenPropertyChecks

import
  scala.collection.immutable.ListMap

import
  scalaz.ValidationNel

import
  ShapeToJsonConverters._

import
  TortoiseJson.{ fields, JsArray, JsBool, JsInt, JsObject, JsString }

class JsonShapeConversionTest extends AnyFunSuite with ScalaCheckDrivenPropertyChecks {
  val genBoolean = Gen.oneOf(true, false)

  val genPoint = for {
    x <- Gen.posNum[Int]
    y <- Gen.posNum[Int]
  } yield (x, y)

  val genColor = for {
    r <- Gen.choose(0, 255)
    g <- Gen.choose(0, 255)
    b <- Gen.choose(0, 255)
    a <- Gen.choose(0, 255)
  } yield RgbColor(r, g, b, a)

  val genCircle = for {
    color    <- genColor
    filled   <- genBoolean
    marked   <- genBoolean
    x        <- Gen.posNum[Int]
    y        <- Gen.posNum[Int]
    diameter <- Gen.posNum[Int]
  } yield JsonCircle(color, filled, marked, x, y, diameter)

  val genLine = for {
    color  <- genColor
    filled <- genBoolean
    marked <- genBoolean
    x1     <- Gen.posNum[Int]
    y1     <- Gen.posNum[Int]
    x2     <- Gen.posNum[Int]
    y2     <- Gen.posNum[Int]
  } yield JsonLine(color, filled, marked, x1, y1, x2, y2)

  val genRectangle = for {
    color  <- genColor
    filled <- genBoolean
    marked <- genBoolean
    xmin   <- Gen.posNum[Int]
    ymin   <- Gen.posNum[Int]
    xmax   <- Gen.posNum[Int]
    ymax   <- Gen.posNum[Int]
  } yield JsonRectangle(color, filled, marked, xmin, ymin, xmax, ymax)

  val genPolygon = for {
    color  <- genColor
    filled <- genBoolean
    marked <- genBoolean
    points <- Gen.listOf(genPoint)
  } yield JsonPolygon(color, filled, marked, points.map(_._1), points.map(_._2))

  val genElem = Gen.oneOf(genCircle, genLine, genRectangle, genPolygon)

  val genLinkLine = for {
    xcor        <- Gen.choose(0.0, 10.0)
    isVisible   <- genBoolean
    dashChoices <- Gen.oneOf(CoreLinkLine.dashChoices.toSeq)
  } yield JsonLinkLine(xcor, isVisible, dashChoices)

  val genVectorShape = for {
    name               <- Gen.identifier
    rotatable          <- genBoolean
    editableColorIndex <- Gen.choose(0, 255)
    elements           <- Gen.listOf(genElem)
  } yield JsonVectorShape(name, rotatable, editableColorIndex, elements)

  val genLinkShape = for {
    name      <- Gen.identifier
    curviness <- Gen.chooseNum[Double](-10.0, 10.0)
    linkLines <- Gen.listOf(genLinkLine)
    indicator <- genVectorShape
  } yield JsonLinkShape(name, curviness, linkLines, indicator)

  val baseFields = ListMap[String, TortoiseJson](
    "color" -> JsString("rgba(1, 2, 3, 0)"),
    "filled" -> JsBool(true),
    "marked" -> JsBool(false)
  )

  val invalidFieldSets = Seq[ListMap[String, TortoiseJson]](
    fields(
      "type" -> JsString("line"),
      "color" -> JsString("rgba(123, 456, 789, ......)")),
    fields(
      "type"  -> JsString("polygon"),
      "xcors" -> JsArray(Seq(JsString("a"))),
      "ycors" -> JsArray(Seq(JsString("b")))),
    fields(
      "type"  -> JsString("polygon"),
      "xcors" -> JsString("a"),
      "ycors" -> JsString("b")),
    fields(
      "type" -> JsString("foobar"))
  )

  val genJsValue = Gen.oneOf(JsObject(fields()), JsArray(Seq()), JsInt(5), JsString("foo"), JsBool(false))

  val genField = for {
    key   <- Gen.identifier
    value <- genJsValue
  } yield key -> value

  val genJsFields = Gen.listOf(genField).map(fs => fields(fs: _*))

  val genJsObject = genJsFields.map(JsObject)

  val genInvalidFields = Gen.oneOf(invalidFieldSets)

  val genInvalidJsObject = for {
    invalidFields <- genInvalidFields
  } yield JsObject(baseFields ++ invalidFields)

  val genInvalidJson = Gen.oneOf(genJsValue, genJsObject, genInvalidJsObject)

  val genVectorShapeList = {
    val vectorShapes = Gen.listOf(genVectorShape)
    def shapeToNamedTuple(shape: VectorShape): (String, JsObject) = {
      val objectWithoutName = JsObject(shape.toJsonObj.asInstanceOf[JsObject].props - "name")
      shape.name -> objectWithoutName
    }
    Gen.oneOf(
      vectorShapes.map(shapes => JsArray(shapes.map(_.toJsonObj))),
      vectorShapes.map(shapes => JsObject(fields(shapes.map(shapeToNamedTuple): _*))))
  }

  Map[String, TortoiseJson => ValidationNel[String, _]](
    "elements"      -> ElemToJsonConverters.read,
    "link lines"    -> ShapeToJsonConverters.readLinkLine,
    "vector shapes" -> ShapeToJsonConverters.readVectorShape,
    "link shapes"   -> ShapeToJsonConverters.readLinkShape).foreach {
      case (name, reader) =>
        test(s"fails validation for invalid $name") {
          forAll(genInvalidJson) { j =>
            val deserializedV = reader(j)
            assert(deserializedV.isFailure)
          }
        }
    }

  test("converts elements to and from json") {
    testReversibleConversion(genElem, ElemToJsonConverters.read)
  }

  test("converts link lines to and from json") {
    testReversibleConversion(genLinkLine, ShapeToJsonConverters.readLinkLine)
  }

  test("converts vector shapes to and from json") {
    testReversibleConversion(genVectorShape, ShapeToJsonConverters.readVectorShape)
  }

  test("converts link shapes to and from json") {
    testReversibleConversion(genLinkShape, ShapeToJsonConverters.readLinkShape)
  }

  test("converts lists of shapes from json to vector shapes") {
    forAll(genVectorShapeList) {
      vsList =>
        val res = readVectorShapes(vsList)
        assert(res.isSuccess)
    }
  }

  def testReversibleConversion[T](gen: Gen[T], deserialize: TortoiseJson => ValidationNel[String, T])(implicit ev: T => JsonWritable): Unit =
    forAll(gen) { e =>
      val serialized = e.toJsonObj
      val deserializedV = deserialize(serialized)
      assert(deserializedV.isSuccess, s"""|deserialization on input:
                                          |$serialized
                                          |failed with error:
                                          |${deserializedV.swap.getOrElse("")}""".stripMargin)
      deserializedV.foreach(deserialized => assertResult(e)(deserialized))
    }
}
