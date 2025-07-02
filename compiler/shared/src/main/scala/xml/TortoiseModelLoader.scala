// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.xml

import org.nlogo.core.Model
import org.nlogo.core.model.{ ModelXMLLoader, XMLElement }

import scala.util.Try

object TortoiseModelLoader {
  val supportedSections = Seq(
    "code"
  , "widgets"
  , "info"
  , "turtleShapes"
  , "linkShapes"
  , "resources"
  , "org.nlogo.modelsection.modelsettings"
  )

  def read(source: String): Try[Model] = {
    val parser      = new SimpleXMLParser(source)
    val elements    = parser.parse()
    val root        = elements.head
    val extras      = root.children.filter( (c) => !TortoiseModelLoader.supportedSections.contains(c.name) )
    val maybeModel  = ModelXMLLoader.loadBasics(root, defaultInfo)
    // We cannot properly parse the optional sections, some because they're desktop only and some because we don't know
    // what they are, so we just store the XML data to be written back in later on. -Jeremy B July 2025
    maybeModel.map( (model) => model.withOptionalSection[Seq[XMLElement]]("tortoiseExtrasHolder", Some(extras), Seq()) )
  }

  def write(model: Model): String = {
    val writer  = new SimpleXmlWriter()
    val extras  = model.optionalSectionValue[Seq[XMLElement]]("tortoiseExtrasHolder").getOrElse(Seq())
    val keepers = model.optionalSections.filter( (s) => s.key != "tortoiseExtrasHolder" )
    ModelXMLLoader.writeBasics(writer, model.copy(optionalSections = keepers), (w, _) => {
      extras.foreach( (extra) => w.element(extra) )
    })
    writer.toString
  }

  val defaultInfo = """## WHAT IS IT?

(a general understanding of what the model is trying to show or explain)

## HOW IT WORKS

(what rules the agents use to create the overall behavior of the model)

## HOW TO USE IT

(how to use the model, including a description of each of the items in the Interface tab)

## THINGS TO NOTICE

(suggested things for the user to notice while running the model)

## THINGS TO TRY

(suggested things for the user to try to do (move sliders, switches, etc.) with the model)

## EXTENDING THE MODEL

(suggested things to add or change in the Code tab to make the model more complicated, detailed, accurate, etc.)

## NETLOGO FEATURES

(interesting or unusual features of NetLogo that the model uses, particularly in the Code tab; or where workarounds were needed for missing features)

## RELATED MODELS

(models in the NetLogo Models Library and elsewhere which are of related interest)

## CREDITS AND REFERENCES

(a reference to the model's URL on the web if it has one, as well as any other necessary credits, citations, and links)
"""

}
