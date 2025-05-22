package org.nlogo.tortoise.compiler.macros

object StubGenerator {
  def main(args: Array[String]): Unit = {
    generateReaders()
    generateWidgetWriters()
    generateOtherWriters()
  }

  def generateReaders(): Unit = {
    writeFile(readerStub("org.nlogo.tortoise.compiler.json", "JsonLine"))
    writeFile(readerStub("org.nlogo.tortoise.compiler.json", "JsonCircle"))
    writeFile(readerStub("org.nlogo.tortoise.compiler.json", "JsonRectangle"))
    writeFile(readerStub("org.nlogo.tortoise.compiler.json", "JsonPolygon"))
    writeFile(readerStub("org.nlogo.tortoise.compiler.json", "JsonVectorShape"))
    writeFile(readerStub("org.nlogo.tortoise.compiler.json", "JsonLinkShape"))
    writeFile(readerStub("org.nlogo.tortoise.compiler.json", "JsonLinkLine"))
    writeFile(readerStub("org.nlogo.core", "WorldDimensions"))
    writeFile(readerStub("org.nlogo.core", "Pen"))
    writeFile(readerStub("org.nlogo.core", "Button"))
    writeFile(readerStub("org.nlogo.core", "Chooser"))
    writeFile(readerStub("org.nlogo.core", "InputBox"))
    writeFile(readerStub("org.nlogo.core", "Monitor"))
    writeFile(readerStub("org.nlogo.core", "Output"))
    writeFile(readerStub("org.nlogo.core", "Plot"))
    writeFile(readerStub("org.nlogo.core", "Slider"))
    writeFile(readerStub("org.nlogo.core", "Switch"))
    writeFile(readerStub("org.nlogo.core", "TextBox"))
    writeFile(readerStub("org.nlogo.core", "View"))
  }

  def readerStub(pkg: String, name: String): (String, String) = {
    val r = s"""
package org.nlogo.tortoise.compiler.json

implicit object ${name}Reader extends JsonReader[TortoiseJson.JsObject, $pkg.$name] {
  def apply(jsObject: TortoiseJson.JsObject) = {
    ???
  }
}
"""

    (s"${name}Reader", r)

  }

  def generateOtherWriters(): Unit = {
    writeFile(writerStub("org.nlogo.tortoise.compiler.WidgetCompilation", "SourceCompilation", "org.nlogo.tortoise.compiler"))
    writeFile(writerStub("org.nlogo.tortoise.compiler.WidgetCompilation", "UpdateableCompilation", "org.nlogo.tortoise.compiler"))
    writeFile(writerStub("org.nlogo.tortoise.compiler.WidgetCompilation", "PlotWidgetCompilation", "org.nlogo.tortoise.compiler"))
    writeFile(writerStub("org.nlogo.tortoise.compiler.WidgetCompilation", "SliderCompilation", "org.nlogo.tortoise.compiler"))
  }

  def generateWidgetWriters(): Unit = {
    writeFile(writerStub("org.nlogo.core", "WorldDimensions"))
    writeFile(writerStub("org.nlogo.core", "Button"))
    writeFile(writerStub("org.nlogo.core", "Chooser"))
    writeFile(writerStub("org.nlogo.core", "InputBox"))
    writeFile(writerStub("org.nlogo.core", "Monitor"))
    writeFile(writerStub("org.nlogo.core", "Output"))
    writeFile(writerStub("org.nlogo.core", "Pen"))
    writeFile(writerStub("org.nlogo.core", "Plot"))
    writeFile(writerStub("org.nlogo.core", "Slider"))
    writeFile(writerStub("org.nlogo.core", "Switch"))
    writeFile(writerStub("org.nlogo.core", "TextBox"))
    writeFile(writerStub("org.nlogo.core", "View"))
  }

  def writerStub(pkg: String, name: String, pkgOverride: String = "org.nlogo.tortoise.compiler.json"): (String, String) = {
    val r = s"""
package $pkgOverride
${if ("org.nlogo.tortoise.compiler.json" != pkgOverride) { "\nimport org.nlogo.tortoise.compiler.json._\n" } else { "" }}
implicit object ${name}Writer extends JsonWriter[$pkg.$name] {
  import collection.immutable.ListMap

  def apply(o: $pkg.$name): TortoiseJson.JsObject = {
    ???
  }
}"""

    return (s"${name}Writer", r)
  }

  def writeFile(data: (String, String)): Unit = {
    val fullPath = java.nio.file.Paths.get("target", s"${data._1}.scala")
    java.nio.file.Files.write(fullPath, data._2.getBytes())
    println(s"wrote $fullPath")
  }
}
