// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import ExportRequest.NlogoFileVersion

import org.nlogo.core.{ ExternalResource, Model => CModel, Slider, Switch, View }
import org.nlogo.tortoise.compiler.xml.TortoiseModelLoader

import json.{ JsonLibrary, JsonLinkLine, JsonLinkShape, JsonVectorShape, TortoiseJson }
import json.JsonLibrary.{ Native => NativeJson, toNative }
import json.JsonReader.{ jsObject2RichJsObject, jsArray2RichJsArray }
import json.ShapeToJsonConverters.shape2Json
import json.TortoiseJson.{ fields, JsArray, JsObject, JsString }
import json.WidgetToJson.widget2Json

import scala.collection.immutable.ListMap

import scala.scalajs.js

object TestUtilities {

  def assertErrorMessage(compiledModel: JsObject, message: String): Unit =
    assert(
      compiledModel[JsObject]("model")
        .apply[JsArray]("result")
        .apply[JsObject](0)
        .apply[String]("message") == message)

  def withWidget(compiledModel: JsObject, widgetType: String, f: JsObject => Unit): Unit = {
    // this song and dance is to turn a string with Javascript Objects containing functions
    // into TortoiseJson objects
    val widgetsString: String = compiledModel[String]("widgets")
    val widgetObj:     js.Any = new js.Object(js.eval(widgetsString))
    val widgetsJson           = JsonLibrary.toTortoise(widgetObj)

    widgetsJson match {
      case JsArray(elems) =>
        val compiledWidgets = elems.collect { case jo : JsObject => jo }
        val selectedWidget  = ((widget: JsObject) => widget[String]("type") == widgetType)
        assert(compiledWidgets.exists(selectedWidget))
        f(compiledWidgets.find(selectedWidget).get)
      case _ => throw new Exception(s"Invalid widget set $widgetsString")
    }
  }

  def compileModel(s: String): JsObject =
    withBrowserCompiler(_.fromNlogoXML(s))

  def compileModel(m: CModel, commands: Seq[String] = Seq()): JsObject =
    withBrowserCompiler { b =>
      val formattedModel    = TortoiseModelLoader.write(m)
      val formattedCommands = toNative(JsArray(commands.map(s => JsString(s))))
      b.fromNlogoXML(formattedModel, formattedCommands)
    }

  def withBrowserCompiler(f: BrowserCompiler => JsonLibrary.Native): JsObject =
    JsonLibrary.toTortoise(f(new BrowserCompiler)).asInstanceOf[JsObject]

  def makeSuccess(code: String): String =
    s"""{"success":true,"result":"${code}"}"""

  def isSuccess(compiledModel: JsObject): Boolean =
    compiledModel[JsObject]("model").apply[Boolean]("success")

  def compiledJs(compiledModel: JsObject): String =
    compiledModel[JsObject]("model").apply[String]("result")

  def resourceToJson(resource: ExternalResource): JsObject =
    JsObject(fields(
      "name"      -> JsString(resource.name),
      "extension" -> JsString(resource.extension),
      "data"      -> JsString(resource.data)
    ))

  def modelToCompilationRequest(model: CModel): NativeJson =
    modelToCompilationRequest(model, fields())

  def modelToCompilationRequest(model: CModel, additionalFields: ListMap[String, TortoiseJson]): NativeJson = {
    val titleField = model.title.map( (t) => fields("title" -> JsString(t)) ).getOrElse(fields())
    val reqObj = JsObject(
      titleField ++
      fields(
        "code"         -> JsString(model.code),
        "info"         -> JsString(model.info),
        "version"      -> JsString(model.version),
        "linkShapes"   -> JsArray(model.linkShapes.map(_.toJsonObj)),
        "turtleShapes" -> JsArray(model.turtleShapes.map(_.toJsonObj)),
        "resources"    -> JsArray(model.resources.map(resourceToJson)),
        "widgets"      -> JsArray(model.widgets.map(widget2Json(_).toJsonObj))) ++
      additionalFields)
    toNative(reqObj)
  }

  val validModel: CModel = {
    val vectorShape = JsonVectorShape("custom", false, 0, Seq())
    val linkLine  = JsonLinkLine(0.0, true, Seq(0.0f, 1.0f))
    val linkShape = JsonLinkShape("custom2", 1.0, Seq(linkLine, linkLine, linkLine), vectorShape)
    val textResource = ExternalResource("text-resource-1", "txt", "How many plums per pound of pumpernickle per provided plate perchance?")
    CModel(
      title        = Some("validModel"),
      code         = "to foo fd 1 end",
      widgets      = List(View()),
      info         = "some model info here",
      version      = NlogoFileVersion,
      linkShapes   = CModel.defaultLinkShapes :+ linkShape,
      turtleShapes = CModel.defaultTurtleShapes :+ vectorShape,
      resources    = Seq(textResource)
    )
  }

  val widgetyModel: CModel =
    validModel.copy(widgets = validModel.widgets :+ Slider(variable = Option("apples")) :+ Switch(variable = Option("oranges")))

  val oldFormatModelContents: String = """to setup
  clear-all
  set-default-shape turtles "circle"
  draw-walls
  create-turtles 5                      ;; create some turtles
    [ randomize ]                       ;; place them randomly
  reset-ticks
end

; draws the boundaries (walls) of the "billiard table"
to draw-walls
  ; draw left and right walls
  ask patches with [abs pxcor = max-pxcor]
    [ set pcolor blue ]
  ; draw top and bottom walls
  ask patches with [abs pycor = max-pycor]
    [ set pcolor blue ]
end

; set random location
to randomize
  setxy random-xcor random-ycor
  if pcolor = blue       ; if it's on the wall...
    [ randomize ]        ; ...try again
end

to go
  ask turtles [
    ifelse leave-trace?             ;; the turtle puts its pen up or down depending on the
      [ pen-down ]                  ;;   value of the LEAVE-TRACE? switch
      [ pen-up ]
    bounce
    fd 0.1
  ]
  tick
end

;; this procedure checks the coordinates and makes the turtles
;; reflect according to the law that the angle of reflection is
;; equal to the angle of incidence
to bounce  ;; turtle procedure
  ; check: hitting left or right wall?
  if abs [pxcor] of patch-ahead 0.1 = max-pxcor
    ; if so, reflect heading around x axis
    [ set heading (- heading) ]
  ; check: hitting top or bottom wall?
  if abs [pycor] of patch-ahead 0.1 = max-pycor
    ; if so, reflect heading around y axis
    [ set heading (180 - heading) ]
end


; Public Domain:
; To the extent possible under law, Uri Wilensky has waived all
; copyright and related or neighboring rights to this model.
@#$#@#$#@
GRAPHICS-WINDOW
175
10
511
347
-1
-1
8.0
1
10
1
1
1
0
0
0
1
-20
20
-20
20
1
1
1
ticks
30.0

BUTTON
17
51
75
84
NIL
setup
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

BUTTON
88
51
143
84
go
go
T
1
T
OBSERVER
NIL
NIL
NIL
NIL
0

SWITCH
18
105
147
138
leave-trace?
leave-trace?
1
1
-1000

@#$#@#$#@
## WHAT IS IT?

This demo shows how to make turtles bounce off the walls.

<!-- 2004 -->
@#$#@#$#@
default
true
0
Polygon -7500403 true true 150 5 40 250 150 205 260 250

circle
false
0
Circle -7500403 true true 0 0 300
@#$#@#$#@
NetLogo 6.4.0
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
default
0.0
-0.2 0 0.0 1.0
0.0 1 1.0 0.0
0.2 0 0.0 1.0
link direction
true
0
Line -7500403 true 150 150 90 180
Line -7500403 true 150 150 210 180
@#$#@#$#@
0
@#$#@#$#@
"""

  val xmlFormatContents = """<?xml version="1.0" encoding="utf-8" ?>
<model version="NetLogo 7.1.0-internal1">
  <code><![CDATA[
to setup
  clear-all
  set-default-shape turtles "circle"
  draw-walls
  create-turtles 5                      ;; create some turtles
    [ randomize ]                       ;; place them randomly
  reset-ticks
end

; draws the boundaries (walls) of the "billiard table"
to draw-walls
  ; draw left and right walls
  ask patches with [abs pxcor = max-pxcor]
    [ set pcolor blue ]
  ; draw top and bottom walls
  ask patches with [abs pycor = max-pycor]
    [ set pcolor blue ]
end

; set random location
to randomize
  setxy random-xcor random-ycor
  if pcolor = blue       ; if it's on the wall...
    [ randomize ]        ; ...try again
end

to go
  ask turtles [
    ifelse leave-trace?             ;; the turtle puts its pen up or down depending on the
      [ pen-down ]                  ;;   value of the LEAVE-TRACE? switch
      [ pen-up ]
    bounce
    fd 0.1
  ]
  tick
end

;; this procedure checks the coordinates and makes the turtles
;; reflect according to the law that the angle of reflection is
;; equal to the angle of incidence
to bounce  ;; turtle procedure
  ; check: hitting left or right wall?
  if abs [pxcor] of patch-ahead 0.1 = max-pxcor
    ; if so, reflect heading around x axis
    [ set heading (- heading) ]
  ; check: hitting top or bottom wall?
  if abs [pycor] of patch-ahead 0.1 = max-pycor
    ; if so, reflect heading around y axis
    [ set heading (180 - heading) ]
end


; Public Domain:
; To the extent possible under law, Uri Wilensky has waived all
; copyright and related or neighboring rights to this model.
]]></code>
  <widgets>
    <view x="175" wrappingAllowedX="false" y="10" frameRate="30" minPycor="-20" height="337" showTickCounter="true" patchSize="8" fontSize="10" wrappingAllowedY="false" width="336" tickCounterLabel="ticks" maxPycor="20" updateMode="1" maxPxcor="20" minPxcor="-20"></view>
    <button x="17" y="51" height="33" disableUntilTicks="false" forever="false" kind="Observer" width="58" sizeVersion="0">setup</button>
    <button x="88" y="51" height="33" disableUntilTicks="true" forever="true" kind="Observer" display="go" width="55" sizeVersion="0">go</button>
    <switch x="18" y="105" height="33" on="false" variable="leave-trace?" display="leave-trace?" width="129" sizeVersion="0"></switch>
  </widgets>
  <info><![CDATA[
## WHAT IS IT?

This demo shows how to make turtles bounce off the walls.

<!-- 2004 -->
]]></info>
  <turtleShapes>
    <shape name="default" rotatable="true" editableColorIndex="0">
      <polygon color="-1920102913" filled="true" marked="true">
        <point x="150" y="5"></point>
        <point x="40" y="250"></point>
        <point x="150" y="205"></point>
        <point x="260" y="250"></point>
      </polygon>
    </shape>
    <shape name="circle" rotatable="false" editableColorIndex="0">
      <circle x="0" y="0" marked="true" color="-1920102913" diameter="300" filled="true"></circle>
    </shape>
  </turtleShapes>
  <linkShapes>
    <shape name="default" curviness="0">
      <lines>
        <line x="-0.2" visible="false">
          <dash value="0"></dash>
          <dash value="1"></dash>
        </line>
        <line x="0" visible="true">
          <dash value="1"></dash>
          <dash value="0"></dash>
        </line>
        <line x="0.2" visible="false">
          <dash value="0"></dash>
          <dash value="1"></dash>
        </line>
      </lines>
      <indicator>
        <shape name="link direction" rotatable="true" editableColorIndex="0">
          <line endX="90" startY="150" marked="true" color="-1920102913" endY="180" startX="150"></line>
          <line endX="210" startY="150" marked="true" color="-1920102913" endY="180" startX="150"></line>
        </shape>
      </indicator>
    </shape>
  </linkShapes>
</model>
"""

}
