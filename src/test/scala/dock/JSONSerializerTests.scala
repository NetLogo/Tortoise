package org.nlogo.tortoise.dock

import org.json4s.JsonDSL.string2jvalue
import org.json4s.native.JsonMethods.{ compact, pretty, parse, render => jsRender }
import org.json4s.string2JsonInput
import org.nlogo.mirror._, Mirroring._, Mirrorables._
import org.nlogo.{ core, api }, api.Version
import org.scalatest.FunSuite
import org.scalatest.Matchers
import org.nlogo.nvm
import org.nlogo.headless._, lang._
import org.nlogo.shape.VectorShape
import org.nlogo.tortoise.json.JSONSerializer

import collection.JavaConverters._

class JSONSerializerTests extends FixtureSuite with Matchers {

  def mirrorables(implicit fixture: Fixture): Iterable[Mirrorable] =
    Mirrorables.allMirrorables(fixture.workspace.world)

  test("JSONSerializer basic commands") { implicit fixture =>
    val commands = Seq(
      "cro 1" ->
        """|{
          |  "turtles":{
          |    "0":{
          |      "WHO":0,
          |      "COLOR":5,
          |      "HEADING":0,
          |      "XCOR":0,
          |      "YCOR":0,
          |      "SHAPE":"default",
          |      "LABEL":"",
          |      "LABEL-COLOR":9.9,
          |      "BREED":"TURTLES",
          |      "HIDDEN?":false,
          |      "SIZE":1,
          |      "PEN-SIZE":1,
          |      "PEN-MODE":"up"
          |    }
          |  },
          |  "patches":{
          |
          |  }
          |  "world": {
          |  }
          |  "links": {
          |  }
          |  "observer": {
          |  }
          |}""".stripMargin,
      "ask turtles [ fd 1 ]" ->
        """|{
          |  "turtles":{
          |    "0":{
          |      "YCOR":1
          |    }
          |  },
          |  "patches":{
          |
          |  }
          |  "world": {
          |  }
          |  "links": {
          |  }
          |  "observer": {
          |  }
          |}""".stripMargin,
      "watch turtle 0" ->
        """|{
          |  "turtles":{
          |  },
          |  "patches":{
          |
          |  }
          |  "world": {
          |  }
          |  "links": {
          |  }
          |  "observer": {
          |    "0":{"targetAgent":[1,0],"perspective":3}
          |  }
          |}""".stripMargin,
      "ask turtles [ die ]" ->
        """|{
          |  "turtles":{
          |    "0":{
          |      "WHO":-1
          |    }
          |  },
          |  "patches":{
          |
          |  }
          |  "world": {
          |  }
          |  "links": {
          |  }
          |  "observer": {
          |    "0":{"targetAgent":[1,-1]}
          |  }
          |}""".stripMargin)
      .map {
        case (cmd, json) => // prettify:
          (cmd, jsRender(parse(json)))
      }
    // so we don't need ASM, and to save time - ST 11/14/13
    fixture.workspace.flags = nvm.CompilerFlags(useGenerator = false)
    ModelCreator.open(fixture.workspace, core.WorldDimensions.square(1))
    val (initialState, _) = Mirroring.diffs(Map(), mirrorables)
    commands.foldLeft(initialState) {
      case (previousState, (cmd, expectedJSON)) =>
        fixture.workspace.command(cmd)
        val (nextState, update) = Mirroring.diffs(previousState, mirrorables)
        val json = jsRender(parse(JSONSerializer.serialize(update)))
        val format = compact _
        format(json) should equal(format(expectedJSON))
        nextState
    }
  }

  test("JSONSerializer shapes") { implicit fixture =>
    val shapeList = new api.ShapeList(
      core.AgentKind.Turtle,
      VectorShape.parseShapes(api.ModelReader.defaultShapes.toArray, api.Version.version).asScala
    )

    val shapes = Seq(
        "default" ->
          """|{
             |  "rotate":true,
             |  "elements":[{
             |      "xcors":[150,40,150,260],
             |      "ycors":[5,250,205,250],
             |      "type":"polygon",
             |      "color":"rgba(141, 141, 141, 1.0)",
             |      "filled":true,
             |      "marked":true
             |  }]
             |}""".stripMargin,
        "person"  ->
          """|{
             |  "rotate":false,
             |  "elements":[{
             |      "x":110,
             |      "y":5,
             |      "diam":80,
             |      "type":"circle",
             |      "color":"rgba(141, 141, 141, 1.0)",
             |      "filled":true,
             |      "marked":true
             |    },{
             |      "xcors":[105,120,90,105,135,150,165,195,210,180,195],
             |      "ycors":[90,195,285,300,300,225,300,300,285,195,90],
             |      "type":"polygon",
             |      "color":"rgba(141, 141, 141, 1.0)",
             |      "filled":true,
             |      "marked":true
             |    },{
             |      "xmin":127,
             |      "ymin":79,
             |      "xmax":172,
             |      "ymax":94,
             |      "type":"rectangle",
             |      "color":"rgba(141, 141, 141, 1.0)",
             |      "filled":true,
             |      "marked":true
             |    },{
             |      "xcors":[195,240,225,165],
             |      "ycors":[90,150,180,105],
             |      "type":"polygon",
             |      "color":"rgba(141, 141, 141, 1.0)",
             |      "filled":true,
             |      "marked":true
             |    },{
             |      "xcors":[105,60,75,135],
             |      "ycors":[90,150,180,105],
             |      "type":"polygon",
             |      "color":"rgba(141, 141, 141, 1.0)",
             |      "filled":true,
             |      "marked":true
             |  }]
             |}""".stripMargin
      ) map {
        case (shapeName, json) =>
          (shapeList.shape(shapeName), jsRender(parse(json)))
      }

    shapes foreach {
      case (shape, expectedJSON) =>
        val json = jsRender(parse(JSONSerializer.serialize(shape)))
        pretty(json) should equal(pretty(expectedJSON))
    }
  }

}
