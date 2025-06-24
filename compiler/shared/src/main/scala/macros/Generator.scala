// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.tortoise.compiler.Jsonify
import org.nlogo.tortoise.compiler.CompiledWidget._

import org.nlogo.tortoise.compiler.json._
import ShapeToJsonConverters._

object Generator {
  def main(args: Array[String]): Unit = {
    generateReaders()
    generateWidgetWriters()
    generateOtherWriters()
  }

  def generateReaders(): Unit = {
    Jsonify.writeFile(Jsonify.readerGenerator[JsonLine]())
    Jsonify.writeFile(Jsonify.readerGenerator[JsonCircle]())
    Jsonify.writeFile(Jsonify.readerGenerator[JsonRectangle]())
    Jsonify.writeFile(Jsonify.readerGenerator[JsonPolygon]())
    Jsonify.writeFile(Jsonify.readerGenerator[JsonVectorShape]())
    Jsonify.writeFile(Jsonify.readerGenerator[JsonLinkShape]())
    Jsonify.writeFile(Jsonify.readerGenerator[JsonLinkLine]())
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.WorldDimensions](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.Pen](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.Button](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.Chooser](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.InputBox](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.Monitor](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.Output](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.Plot](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.Slider](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.Switch](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.TextBox](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.View](Seq("org.nlogo.tortoise.compiler.json.WidgetRead._")))
    Jsonify.writeFile(Jsonify.readerGenerator[org.nlogo.core.ExternalResource]())
  }

  def generateOtherWriters(): Unit = {
    import JsonWriter._
    import org.nlogo.tortoise.compiler.WidgetCompilation._
    Jsonify.writeFile(Jsonify.writerGenerator[SourceCompilation    ]("org.nlogo.tortoise.compiler"))
    Jsonify.writeFile(Jsonify.writerGenerator[UpdateableCompilation]("org.nlogo.tortoise.compiler"))
    Jsonify.writeFile(Jsonify.writerGenerator[PlotWidgetCompilation]("org.nlogo.tortoise.compiler"))
    Jsonify.writeFile(Jsonify.writerGenerator[SliderCompilation    ]("org.nlogo.tortoise.compiler"))
  }

  def generateWidgetWriters(): Unit = {
    import WidgetWrite._
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.WorldDimensions]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.Button         ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.Chooser        ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.InputBox       ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.Monitor        ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.Output         ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.Pen            ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.Plot           ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.Slider         ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.Switch         ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.TextBox        ]())
    Jsonify.writeFile(Jsonify.writerGenerator[org.nlogo.core.View           ]())
  }
}
