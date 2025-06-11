// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import scalaz.{ Failure, NonEmptyList, ValidationNel }

import scala.quoted.{ Expr, Quotes, Type }

import org.nlogo.tortoise.compiler.json.{ JsonWriter, ShapeToJsonConverters, WidgetWrite }
import ShapeToJsonConverters._
import WidgetWrite.intOption2Json
import org.nlogo.tortoise.compiler.CompiledWidget._

object Jsonify {

  private val generatedInfoText =
    """|This file was automatically generated.  It should not be directly modified.  Modifications should be made to the
       |`Jsonify.readerGenerator()` or `Jsonify.writerGenerator()` and the appropriate `Generator` should be re-run.""".stripMargin
  private val generatedInfo = generatedInfoText.split("\n").map( (l) => s"// $l" ).mkString("\n")

  inline def writerGenerator[S](inline pkg: String = "org.nlogo.tortoise.compiler.json"): (String, String) = ${ writerGeneratorCode[S]('pkg) }

  def writerGeneratorCode[S](pkgExpr: Expr[String])(using s: Type[S], q: Quotes): Expr[(String, String)] = {
    import q.reflect.*

    val pkg = pkgExpr.valueOrAbort

    val sRepr = TypeRepr.of[S]
    val classSymbol = sRepr.classSymbol.getOrElse(???)
    val constructor = classSymbol.primaryConstructor
    val constructorMethodType = constructor.info match {
      case mt: MethodType => mt
      case pt: PolyType   => pt.resType.asInstanceOf[MethodType]
      case other => report.errorAndAbort(s"Unexpected constructor type: ${other} - ${constructor.typeRef} on ${other.show} for ${sRepr.show}")
    }
    val fieldNames = constructorMethodType.paramNames
    val fieldTypes = constructorMethodType.paramTypes

    val converters = fieldTypes.map( (fieldType) => {
      val targetTypeRepr = TypeRepr.of[JsonWriter].appliedTo(List(fieldType))
      val implicitSearchResult = Implicits.search(targetTypeRepr)
      implicitSearchResult match {
        case res: ImplicitSearchSuccess =>
          val inferredType = res.tree.tpe
          inferredType.show

        case res: ImplicitSearchFailure =>
          report.errorAndAbort(s"Failed to find an implicit type to convert ${fieldType.show}.")
      }
    })
    val fieldPairsNoType = fieldNames.zip(converters).map({ case (fieldName, converter) => s"(\"$fieldName\" -> $converter.write(o.$fieldName))" })
    val camelName = s"${classSymbol.name.head.toLower}${classSymbol.name.tail}"
    val fieldPairs = fieldPairsNoType :+ s"(\"type\" -> Some(TortoiseJson.JsString(\"${camelName}\")))"

    val objectName = s"${classSymbol.name}Writer"
    val caseClassName = sRepr.show

    val r = s"""// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package $pkg
${if ("org.nlogo.tortoise.compiler.json" != pkg) { "\nimport org.nlogo.tortoise.compiler.json._\n" } else { "" }}
$generatedInfo

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object $objectName extends JsonWriter[$caseClassName] {
  import collection.immutable.ListMap

  def apply(o: $caseClassName): TortoiseJson.JsObject = {
    val map = ListMap(
      ${fieldPairs.mkString(",\n      ")}
    ).collect({ case (a, Some(b)) => (a, b) })
    val result = TortoiseJson.JsObject(map)
    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
"""

    Expr((objectName, r))
  }

  inline def readerGenerator[S](inline extraImports: Seq[String] = Seq()): (String, String) = ${ readerGeneratorCode[S]('extraImports) }

  def readerGeneratorCode[S](extraImportsExpr: Expr[Seq[String]])(using s: Type[S], q: Quotes): Expr[(String, String)] = {
    import q.reflect.*

    val extraImports = extraImportsExpr.valueOrAbort
    val extraImportsString = if (extraImports.isEmpty) { "" } else { extraImports.mkString("\nimport ", "\nimport ", "\n") }

    val sRepr = TypeRepr.of[S]
    val classSymbol = sRepr.classSymbol.getOrElse(???)
    val constructor = classSymbol.primaryConstructor
    val constructorMethodType = constructor.info match {
      case mt: MethodType => mt
      case pt: PolyType   => pt.resType.asInstanceOf[MethodType]
      case other => report.errorAndAbort(s"Unexpected constructor type: ${other} - ${constructor.typeRef} on ${other.show} for ${sRepr.show}")
    }
    val fieldNames = constructorMethodType.paramNames
    val fieldTypes = constructorMethodType.paramTypes
    val fields = fieldNames.zip(fieldTypes).zipWithIndex.map({ case ((name, fieldType), i) =>
      (name, fieldType.show, s"v$i", s"c$i")
    })

    val objectName = s"${classSymbol.name}Reader"
    val caseClassName = sRepr.show

    val fieldValidations = fields.map( (f) =>
      s"""val ${f._3} = JsonReader.readField[${f._2}](jsObject, "${f._1}")"""
    )

    val constructorArgs = fields.map( (f) => f._4 ).mkString(", ")

    def createNestedMaps(i: Int = 0): Array[String] = {
      if (i >= (fields.length - 1)) {
        s"""|v$i.map(
            |  (c$i) =>
            |    new $caseClassName($constructorArgs)
            |)""".stripMargin.split("\n")
      } else {
        val nestedLines = createNestedMaps(i + 1)
        s"""|v$i.flatMap(
            |  (c$i) => ${nestedLines.head}
            |  ${nestedLines.tail.mkString("\n  ")}
            |)""".stripMargin.split("\n")
      }
    }

    val nestedMapLines = createNestedMaps()

    val r = s"""// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import scalaz._
import Scalaz._
import scalaz.Validation.FlatMap.ValidationFlatMapRequested

import org.nlogo.tortoise.compiler.json.{ ElementReader, JsonReader, ShapeToJsonConverters }
import ElementReader._
import WidgetToJson.readWidgetsJson
import ShapeToJsonConverters._
$extraImportsString
$generatedInfo

// scalastyle:off method.length
// scalastyle:off cyclomatic.complexity
// scalastyle:off line.size.limit
implicit object $objectName extends JsonReader[TortoiseJson.JsObject, $caseClassName] {
  def apply(jsObject: TortoiseJson.JsObject): ValidationNel[String, $caseClassName] = {

    ${fieldValidations.mkString("\n    ")}

    val result =
      ${nestedMapLines.mkString("\n      ")}

    result
  }
}
// scalastyle:on method.length
// scalastyle:on cyclomatic.complexity
// scalastyle:on line.size.limit
""".stripMargin

    Expr((objectName, r))
  }

  import java.io.File
  import java.nio.file.{ Files, Paths }

  inline def writeFile(inline genResult: (String, String), inline dir: String = "gen-shared"): Unit = ${ writeFileCode('genResult, 'dir) }

  def writeFileCode(genResultExpr: Expr[(String, String)], dirExpr: Expr[String])(using q: Quotes): Expr[Unit] = {
    import q.reflect.*

    val genResult = genResultExpr.valueOrAbort
    val dir = dirExpr.valueOrAbort
    val parentDirPath = Paths.get("target", dir)
    Files.createDirectories(parentDirPath)
    val path = Paths.get(parentDirPath.toString, s"${genResult._1}.scala")
    val code = genResult._2
    Files.write(path, code.getBytes())
    '{ println("hi") }
  }

}
