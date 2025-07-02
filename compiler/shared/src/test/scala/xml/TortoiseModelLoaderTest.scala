// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.xml

import org.nlogo.core.{ Model, View, WorldDimensions }

import org.nlogo.core.model.XMLElement

import
  org.scalatest.funsuite.AnyFunSuite

class TortoiseModelLoaderTest extends AnyFunSuite {

  test("TextCursor basics") {
    val reader = new TextCursor("<h1>Previously...</h1>")
    reader.skipWhiteSpace()
    assertResult(true)(reader.matches("<h1>"))
    reader.next(4)
    assertResult(true)(reader.matches("Previously"))
    assertResult("<h1>")(reader.substring(0, 4))
    val start = reader.getCurrentIndex
    val terminator = reader.skipUntil("</h1>", "</", "<")
    assertResult(17)(reader.getCurrentIndex)
    assertResult("</h1>")(terminator)
    val end = reader.getCurrentIndex
    assertResult("Previously...")(reader.substring(start, end))
  }

  test("TextCursor skipUntil") {
    val reader = new TextCursor("<h1>Previously...</h1>")
    reader.next(4)
    val start = reader.getCurrentIndex
    reader.skipUntil("</")
    val end = reader.getCurrentIndex
    assertResult("Previously...")(reader.substring(start, end))
  }

  test("SimpleXMLParser basics") {
    val parser = new SimpleXMLParser("<h1>Previously...</h1>")
    val results = parser.parse()
    val expected = Seq(XMLElement("h1", Map(), "Previously...", Seq()))
    assertResult(expected)(results)
  }

  test("SimpleXMLParser CDATA and comments") {
    val source = """<model version="NetLogo 7"><code><![CDATA[to setup end <xml-tags-don't-matter-here></xml>]]></code><!-- comment is ignored <xml /> --><info><![CDATA[# Hello! <h1> <h2> </p>]]></info></model>"""
    val parser = new SimpleXMLParser(source)
    val results = parser.parse()
    val expected = Seq(XMLElement("model", Map("version" -> "NetLogo 7"), "", Seq(XMLElement("code", Map(), "to setup end <xml-tags-don't-matter-here></xml>", Seq()), XMLElement("info", Map(), "# Hello! <h1> <h2> </p>", Seq()))))
    assertResult(expected)(results)
  }

  test("SimpleXMLParser widgets section") {
    val source = """
<model>
  <widgets>
    <view x="455" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-25" height="564" showTickCounter="true" patchSize="10.9804" fontSize="14" wrappingAllowedY="true" width="564" tickCounterLabel="ticks" maxPycor="25" updateMode="1" maxPxcor="25" minPxcor="-25"></view>
    <slider x="5" step="1.0" y="283" max="20.0" width="220" display="sheep-reproduce" height="50" min="1.0" direction="Horizontal" default="4.0" variable="sheep-reproduce" units="%"></slider>
    <monitor x="350" precision="0" y="498" height="60" fontSize="11" width="100" display="grass">count grass / 4</monitor>
    <plot x="5" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="pop." y="342" xMin="0.0" height="235" legend="true" xMax="100.0" yMin="0.0" width="340" xAxis="time" display="populations">
      <setup></setup>
      <update></update>
      <pen interval="1.0" mode="0" display="sheep" color="-612749" legend="true">
        <setup></setup>
        <update>plot count sheep</update>
      </pen>
      <pen interval="1.0" mode="0" display="wolves" color="-16449023" legend="true">
        <setup></setup>
        <update>plot count wolves</update>
      </pen>
      <pen interval="1.0" mode="0" display="grass / 4" color="-10899396" legend="true">
        <setup></setup>
        <update>if model-version = "sheep-wolves-grass" [ plot count grass / 4 ]</update>
      </pen>
    </plot>
    <note x="50" y="211" backgroundDark="0" fontSize="11" width="140" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Sheep settings</note>
    <chooser x="5" y="10" height="60" variable="model-version" current="1" width="220" display="model-version">
      <choice type="string" value="sheep-wolves"></choice>
      <choice type="string" value="sheep-wolves-grass"></choice>
    </chooser>
    <button x="80" y="145" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="95" display="setup">setup</button>
    <switch x="280" y="145" height="40" on="false" variable="show-energy?" width="115" display="show-energy?"></switch>
    <button x="180" y="145" height="40" disableUntilTicks="true" forever="true" kind="Observer" width="95" display="go">go</button>
  </widgets>
</model>
"""

    val expectedWidgets = Seq(
      XMLElement("view", Map("x" -> "455", "wrappingAllowedX" -> "true", "y" -> "10", "frameRate" -> "30.0", "minPycor" -> "-25", "height" -> "564", "showTickCounter" -> "true", "patchSize" -> "10.9804", "fontSize" -> "14", "wrappingAllowedY" -> "true", "width" -> "564", "tickCounterLabel" -> "ticks", "maxPycor" -> "25", "updateMode" -> "1", "maxPxcor" -> "25", "minPxcor" -> "-25"), "", Seq()),
      XMLElement("slider", Map("x" -> "5", "step" -> "1.0", "y" -> "283", "max" -> "20.0", "width" -> "220", "display" -> "sheep-reproduce", "height" -> "50", "min" -> "1.0", "direction" -> "Horizontal", "default" -> "4.0", "variable" -> "sheep-reproduce", "units" -> "%"), "", Seq()),
      XMLElement("monitor", Map("x" -> "350", "precision" -> "0", "y" -> "498", "height" -> "60", "fontSize" -> "11", "width" -> "100", "display" -> "grass"), "count grass / 4", Seq()),
      XMLElement("plot", Map("x" -> "5", "autoPlotX" -> "true", "yMax" -> "100.0", "autoPlotY" -> "true", "yAxis" -> "pop.", "y" -> "342", "xMin" -> "0.0", "height" -> "235", "legend" -> "true", "xMax" -> "100.0", "yMin" -> "0.0", "width" -> "340", "xAxis" -> "time", "display" -> "populations"), "", Seq(
        XMLElement("setup", Map(), "", Seq()),
        XMLElement("update", Map(), "", Seq()),
        XMLElement("pen", Map("interval" -> "1.0", "mode" -> "0", "display" -> "sheep", "color" -> "-612749", "legend" -> "true"), "", Seq(XMLElement("setup", Map(), "", Seq()), XMLElement("update", Map(), "plot count sheep", Seq()))),
        XMLElement("pen", Map("interval" -> "1.0", "mode" -> "0", "display" -> "wolves", "color" -> "-16449023", "legend" -> "true"), "", Seq(XMLElement("setup", Map(), "", Seq()), XMLElement("update", Map(), "plot count wolves", Seq()))),
        XMLElement("pen", Map("interval" -> "1.0", "mode" -> "0", "display" -> "grass / 4", "color" -> "-10899396", "legend" -> "true"), "", Seq(XMLElement("setup", Map(), "", Seq()), XMLElement("update", Map(), "if model-version = \"sheep-wolves-grass\" [ plot count grass / 4 ]", Seq())))
      )),
      XMLElement("note", Map("x" -> "50", "y" -> "211", "backgroundDark" -> "0", "fontSize" -> "11", "width" -> "140", "markdown" -> "false", "height" -> "18", "textColorDark" -> "-1", "textColorLight" -> "-16777216", "backgroundLight" -> "0"), "Sheep settings", Seq()),
      XMLElement("chooser", Map("x" -> "5", "y" -> "10", "height" -> "60", "variable" -> "model-version", "current" -> "1", "width" -> "220", "display" -> "model-version"), "", Seq(XMLElement("choice", Map("type" -> "string", "value" -> "sheep-wolves"), "", Seq()), XMLElement("choice", Map("type" -> "string", "value" -> "sheep-wolves-grass"), "", Seq()))),
      XMLElement("button", Map("x" -> "80", "y" -> "145", "height" -> "40", "disableUntilTicks" -> "false", "forever" -> "false", "kind" -> "Observer", "width" -> "95", "display" -> "setup"), "setup", Seq()),
      XMLElement("switch", Map("x" -> "280", "y" -> "145", "height" -> "40", "on" -> "false", "variable" -> "show-energy?", "width" -> "115", "display" -> "show-energy?"), "", Seq()),
      XMLElement("button", Map("x" -> "180", "y" -> "145", "height" -> "40", "disableUntilTicks" -> "true", "forever" -> "true", "kind" -> "Observer", "width" -> "95", "display" -> "go"), "go", Seq())
    )

    val parser   = new SimpleXMLParser(source)
    val results  = parser.parse()
    val expected = Seq(XMLElement("model", Map(), "", Seq(XMLElement("widgets", Map(), "", expectedWidgets))))
    assertResult(expected)(results)
  }

  test("SimpleXMLParser shapes") {
    val source = """
<model>
  <turtleShapes>
    <shape name="default" rotatable="true" editableColorIndex="0">
      <polygon color="-1920102913" filled="true" marked="true">
        <point x="150" y="5"></point>
        <point x="40" y="250"></point>
        <point x="150" y="205"></point>
        <point x="260" y="250"></point>
      </polygon>
    </shape>
    <shape name="box" rotatable="false" editableColorIndex="0">
      <polygon color="-1920102913" filled="true" marked="true">
        <point x="150" y="285"></point>
        <point x="285" y="225"></point>
        <point x="285" y="75"></point>
        <point x="150" y="135"></point>
      </polygon>
      <polygon color="-1920102913" filled="true" marked="true">
        <point x="150" y="135"></point>
        <point x="15" y="75"></point>
        <point x="150" y="15"></point>
        <point x="285" y="75"></point>
      </polygon>
      <polygon color="-1920102913" filled="true" marked="true">
        <point x="15" y="75"></point>
        <point x="15" y="225"></point>
        <point x="150" y="285"></point>
        <point x="150" y="135"></point>
      </polygon>
      <line endX="150" startY="285" marked="false" color="255" endY="135" startX="150"></line>
      <line endX="15" startY="135" marked="false" color="255" endY="75" startX="150"></line>
      <line endX="285" startY="135" marked="false" color="255" endY="75" startX="150"></line>
    </shape>
    <shape name="bug" rotatable="true" editableColorIndex="0">
      <circle x="96" y="182" marked="true" color="-1920102913" diameter="108" filled="true"></circle>
      <circle x="110" y="127" marked="true" color="-1920102913" diameter="80" filled="true"></circle>
      <circle x="110" y="75" marked="true" color="-1920102913" diameter="80" filled="true"></circle>
      <line endX="80" startY="100" marked="true" color="-1920102913" endY="30" startX="150"></line>
      <line endX="220" startY="100" marked="true" color="-1920102913" endY="30" startX="150"></line>
    </shape>
  </turtleShapes>
  <linkShapes>
    <shape name="default" curviness="0.0">
      <lines>
        <line x="-0.2" visible="false">
          <dash value="0.0"></dash>
          <dash value="1.0"></dash>
        </line>
        <line x="0.0" visible="true">
          <dash value="1.0"></dash>
          <dash value="0.0"></dash>
        </line>
        <line x="0.2" visible="false">
          <dash value="0.0"></dash>
          <dash value="1.0"></dash>
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
</model>"""

    val expectedShapes = Seq(XMLElement("turtleShapes", Map(), "", Seq(
      XMLElement("shape", Map("name" -> "default", "rotatable" -> "true", "editableColorIndex" -> "0"), "", Seq(XMLElement("polygon", Map("color" -> "-1920102913", "filled" -> "true", "marked" -> "true"), "", Seq(XMLElement("point", Map("x" -> "150", "y" -> "5"), "", Seq()), XMLElement("point", Map("x" -> "40", "y" -> "250"), "", Seq()), XMLElement("point", Map("x" -> "150", "y" -> "205"), "", Seq()), XMLElement("point", Map("x" -> "260", "y" -> "250"), "", Seq()))))),

      XMLElement("shape", Map("name" -> "box", "rotatable" -> "false", "editableColorIndex" -> "0"), "", Seq(XMLElement("polygon", Map("color" -> "-1920102913", "filled" -> "true", "marked" -> "true"), "", Seq(XMLElement("point", Map("x" -> "150", "y" -> "285"), "", Seq()), XMLElement("point", Map("x" -> "285", "y" -> "225"), "", Seq()), XMLElement("point", Map("x" -> "285", "y" -> "75"), "", Seq()), XMLElement("point", Map("x" -> "150", "y" -> "135"), "", Seq()))), XMLElement("polygon", Map("color" -> "-1920102913", "filled" -> "true", "marked" -> "true"), "", Seq(XMLElement("point", Map("x" -> "150", "y" -> "135"), "", Seq()), XMLElement("point", Map("x" -> "15", "y" -> "75"), "", Seq()), XMLElement("point", Map("x" -> "150", "y" -> "15"), "", Seq()), XMLElement("point", Map("x" -> "285", "y" -> "75"), "", Seq()))), XMLElement("polygon", Map("color" -> "-1920102913", "filled" -> "true", "marked" -> "true"), "", Seq(XMLElement("point", Map("x" -> "15", "y" -> "75"), "", Seq()), XMLElement("point", Map("x" -> "15", "y" -> "225"), "", Seq()), XMLElement("point", Map("x" -> "150", "y" -> "285"), "", Seq()), XMLElement("point", Map("x" -> "150", "y" -> "135"), "", Seq()))), XMLElement("line", Map("endX" -> "150", "startY" -> "285", "marked" -> "false", "color" -> "255", "endY" -> "135", "startX" -> "150"), "", Seq()), XMLElement("line", Map("endX" -> "15", "startY" -> "135", "marked" -> "false", "color" -> "255", "endY" -> "75", "startX" -> "150"), "", Seq()), XMLElement("line", Map("endX" -> "285", "startY" -> "135", "marked" -> "false", "color" -> "255", "endY" -> "75", "startX" -> "150"), "", Seq()))),

      XMLElement("shape", Map("name" -> "bug", "rotatable" -> "true", "editableColorIndex" -> "0"), "", Seq(XMLElement("circle", Map("x" -> "96", "y" -> "182", "marked" -> "true", "color" -> "-1920102913", "diameter" -> "108", "filled" -> "true"), "", Seq()), XMLElement("circle", Map("x" -> "110", "y" -> "127", "marked" -> "true", "color" -> "-1920102913", "diameter" -> "80", "filled" -> "true"), "", Seq()), XMLElement("circle", Map("x" -> "110", "y" -> "75", "marked" -> "true", "color" -> "-1920102913", "diameter" -> "80", "filled" -> "true"), "", Seq()), XMLElement("line", Map("endX" -> "80", "startY" -> "100", "marked" -> "true", "color" -> "-1920102913", "endY" -> "30", "startX" -> "150"), "", Seq()), XMLElement("line", Map("endX" -> "220", "startY" -> "100", "marked" -> "true", "color" -> "-1920102913", "endY" -> "30", "startX" -> "150"), "", Seq())))
    )),
    XMLElement("linkShapes", Map(), "", Seq(
      XMLElement("shape", Map("name" -> "default", "curviness" -> "0.0"), "", Seq(XMLElement("lines", Map(), "", Seq(XMLElement("line", Map("x" -> "-0.2", "visible" -> "false"), "", Seq(XMLElement("dash", Map("value" -> "0.0"), "", Seq()), XMLElement("dash", Map("value" -> "1.0"), "", Seq()))), XMLElement("line", Map("x" -> "0.0", "visible" -> "true"), "", Seq(XMLElement("dash", Map("value" -> "1.0"), "", Seq()), XMLElement("dash", Map("value" -> "0.0"), "", Seq()))), XMLElement("line", Map("x" -> "0.2", "visible" -> "false"), "", Seq(XMLElement("dash", Map("value" -> "0.0"), "", Seq()), XMLElement("dash", Map("value" -> "1.0"), "", Seq()))))), XMLElement("indicator", Map(), "", Seq(XMLElement("shape", Map("name" -> "link direction", "rotatable" -> "true", "editableColorIndex" -> "0"), "", Seq(XMLElement("line", Map("endX" -> "90", "startY" -> "150", "marked" -> "true", "color" -> "-1920102913", "endY" -> "180", "startX" -> "150"), "", Seq()), XMLElement("line", Map("endX" -> "210", "startY" -> "150", "marked" -> "true", "color" -> "-1920102913", "endY" -> "180", "startX" -> "150"), "", Seq())))))))
    )))

    val parser   = new SimpleXMLParser(source)
    val results  = parser.parse()
    val expected = Seq(XMLElement("model", Map(), "", expectedShapes))
    assertResult(expected)(results)
  }

  val simpleModelSource = """<?xml version="1.0" encoding="utf-8"?>
<model version="NetLogo 7.0.0-beta2">
  <code><![CDATA[to setup end <xml-tags-don't-matter-here></xml>]]></code>
  <widgets>
    <view x="455" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-25" height="564" showTickCounter="true" patchSize="10.9804" fontSize="14" wrappingAllowedY="true" width="564" tickCounterLabel="ticks" maxPycor="25" updateMode="1" maxPxcor="25" minPxcor="-25"></view>
  </widgets>
  <!-- comment is ignored <xml /> -->
  <info><![CDATA[# Hello! <h1> <h2> </p>]]></info>
  <turtleShapes></turtleShapes>
  <linkShapes></linkShapes>
  <unexpectedSection><![CDATA[Who knows what <evil> lurks in the CDATA sections of unexpected XML elements?]]></unexpectedSection>
</model>
"""

  test("TortoiseModelLoader reads very simple model") {
    val model = TortoiseModelLoader.read(simpleModelSource).get
    val expected = new Model("to setup end <xml-tags-don't-matter-here></xml>", Seq(View(455, 10, 564, 564, WorldDimensions(-25, 25, -25, 25, 10.9804, true, true), 14)), "# Hello! <h1> <h2> </p>", "NetLogo 7.0.0-beta2", Seq(), Seq())
    // The `Section` class doesn't have value-equality, so we just ignore them for now
    assertResult(expected)(model.copy(optionalSections = Seq()))
  }

  test("TortoiseModelLoader writes very simple model") {
    val model = TortoiseModelLoader.read(simpleModelSource).get
    val writtenSource = TortoiseModelLoader.write(model)

    val expected = """<?xml version="1.0" encoding="utf-8" ?>
<model version="NetLogo 7.0.0-beta2" snapToGrid="false">
  <code><![CDATA[to setup end <xml-tags-don't-matter-here></xml>]]></code>
  <widgets>
    <view x="455" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-25" height="564" showTickCounter="true" patchSize="10.9804" fontSize="14" wrappingAllowedY="true" width="564" tickCounterLabel="ticks" maxPycor="25" updateMode="1" maxPxcor="25" minPxcor="-25"></view>
  </widgets>
  <info><![CDATA[# Hello! <h1> <h2> </p>]]></info>
  <turtleShapes></turtleShapes>
  <linkShapes></linkShapes>
  <unexpectedSection><![CDATA[Who knows what <evil> lurks in the CDATA sections of unexpected XML elements?]]></unexpectedSection>
</model>
"""

    assertResult(expected)(writtenSource)
  }

}
