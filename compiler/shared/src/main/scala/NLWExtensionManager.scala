// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.nlogo.core.{
  ErrorSource
, ExtensionManager
, Primitive
, PrimitiveCommand
, PrimitiveReporter
, Syntax
}

import org.nlogo.core.Syntax.{
  NormalPrecedence
, AgentsetType
, AgentType
, BooleanBlockType
, BooleanType
, BracketedType
, CodeBlockType
, CommandBlockType
, CommandType
, LinksetType
, LinkType
, ListType
, NobodyType
, NumberBlockType
, NumberType
, OptionalType
, OtherBlockType
, PatchsetType
, PatchType
, ReadableType
, ReferenceType
, RepeatableType
, ReporterBlockType
, ReporterType
, StringType
, SymbolType
, TurtlesetType
, TurtleType
, WildcardType
, VoidType
}

import org.nlogo.tortoise.compiler.utils.CompilerUtils.failCompilation

case class ExtensionPrim(primitive: Primitive, name: String)

trait Extension {
  def getName : String
  def getPrims: Seq[ExtensionPrim]
}

object CreateExtension {

  import play.api.libs.json.{ JsValue, Json, JsArray, JsObject, JsString }

  def apply(json: String): Extension = {
    val jsExt = Json.parse(json)
    new Extension {
      override def getName: String = {
        jsExt("name").as[String]
      }
      override def getPrims: Seq[ExtensionPrim] = {
        try {
          jsExt("prims").as[JsArray].value.map(convertToExtensionPrim).toSeq
        } catch {
          case e: Exception => throw new Exception(s"Problem parsing extension definition JSON.  ${e.getMessage}", e)
        }
      }
    }
  }

  private def convertToExtensionPrim(jsPrim: JsValue): ExtensionPrim = {

    val returnType            = (jsPrim \ "returnType").asOpt[String].getOrElse("unit")
    val isReporter            = (returnType != "unit")
    val args                  = jsPrim("argTypes").as[JsArray].value.map(convertArgToTypeInt)
    val returnInt             = typeNameToTypeInt(returnType)
    val defaultArgCount       = (jsPrim \ "defaultArgCount").asOpt[Int]
    val minimumArgCount       = (jsPrim \ "minimumArgCount").asOpt[Int]
    val agentClassString      = (jsPrim \ "agentClassString").asOpt[String].getOrElse("OTPL")
    val blockAgentClassString = (jsPrim \ "blockAgentClassString").asOpt[String]

    val prim =
      if (isReporter) {
        val isInfix          = (jsPrim \ "isInfix").asOpt[Boolean].getOrElse(false)
        val (left, right)    = if (isInfix) (args.head, args.tail) else (VoidType, args)
        val precedenceOffset = (jsPrim \ "precedenceOffset").asOpt[Int].getOrElse(0)
        val precedence       = NormalPrecedence + precedenceOffset
        new PrimitiveReporter {
          override def getSyntax: Syntax = Syntax.reporterSyntax(
            left                  = left
          , right                 = right.toList
          , ret                   = returnInt
          , precedence            = precedence
          , defaultOption         = defaultArgCount
          , minimumOption         = minimumArgCount
          , agentClassString      = agentClassString
          , blockAgentClassString = blockAgentClassString
          )
        }
      } else {
        new PrimitiveCommand {
          override def getSyntax: Syntax = Syntax.commandSyntax(
            right                 = args.toList
          , defaultOption         = defaultArgCount
          , minimumOption         = minimumArgCount
          , agentClassString      = agentClassString
          , blockAgentClassString = blockAgentClassString
          )
        }
      }

    ExtensionPrim(prim, jsPrim("name").as[String])

  }

  private def convertArgToTypeInt(jsArg: JsValue): Int = {
    jsArg match {
      case s: JsString => typeNameToTypeInt(s.value)
      case o: JsObject => {

        val isRepeatable = (jsArg \ "isRepeatable").asOpt[Boolean].getOrElse(false)
        val isOptional   = (jsArg \ "isOptional"  ).asOpt[Boolean].getOrElse(false)

        val primaryMask = if (o.keys.contains("type")) {
          typeNameToTypeInt((o \ "type").as[String])
        } else {
          val typeMasks = (o \ "types").as[JsArray].value.map( (typeName) => typeNameToTypeInt(typeName.as[String]) )
          typeMasks.fold(0)( (a, b) => a | b )
        }
        val isRepeatableMask = if (isRepeatable) RepeatableType else 0
        val isOptionalMask   = if (isOptional)   OptionalType   else 0

        primaryMask | isRepeatableMask | isOptionalMask

      }
      case _ => throw new Exception("Primitive argument types must be a string value or an object with the necessary fields.")
    }
  }

  // scalastyle:off cyclomatic.complexity
  private def typeNameToTypeInt(typeName: String): Int = {
    typeName match {
      case "agentset"      => AgentsetType
      case "agent"         => AgentType
      case "booleanblock"  => BooleanBlockType
      case "boolean"       => BooleanType
      case "bracketed"     => BracketedType
      case "codeblock"     => CodeBlockType
      case "commandblock"  => CommandBlockType
      case "command"       => CommandType
      case "linkset"       => LinksetType
      case "link"          => LinkType
      case "list"          => ListType
      case "nobody"        => NobodyType
      case "numberblock"   => NumberBlockType
      case "number"        => NumberType
      case "optional"      => OptionalType
      case "otherblock"    => OtherBlockType
      case "patchset"      => PatchsetType
      case "patch"         => PatchType
      case "readable"      => ReadableType
      case "reference"     => ReferenceType
      case "repeatable"    => RepeatableType
      case "reporterblock" => ReporterBlockType
      case "reporter"      => ReporterType
      case "string"        => StringType
      case "symbol"        => SymbolType
      case "turtleset"     => TurtlesetType
      case "turtle"        => TurtleType
      case "wildcard"      => WildcardType
      case "unit"          => VoidType
      case unk => throw new Exception(s"Unknown type given in extension: $unk")
    }
  }
  // scalastyle:on cyclomatic.complexity
}

class NLWExtensionManager extends ExtensionManager {

  import org.nlogo.tortoise.macros.ExtDefReader
  import scala.collection.mutable.{ Map => MMap, Set => MSet }

  private val extNameToExtMap                            = ExtDefReader.getAll().map(CreateExtension.apply).map(x => (x.getName, x)).toMap
  private val primNameToPrimMap: MMap[String, Primitive] = MMap()

  val importedExtensions: MSet[String] = MSet()

  override def anyExtensionsLoaded: Boolean = true

  override def finishFullCompilation(): Unit = ()

  override def importExtension(extName: String, errors: ErrorSource): Unit = {
    val extension    = extNameToExtMap.getOrElse(extName, failCompilation(s"No such extension: ${extName}"))
    val extPrimPairs = extension.getPrims.map(prim => (extension.getName, prim))
    val shoutedPairs = extPrimPairs.map { case (extName, ExtensionPrim(prim, name)) => (s"$extName:$name".toUpperCase, prim) }
    primNameToPrimMap ++= shoutedPairs
    importedExtensions.add(extName)
    ()
  }

  override def replaceIdentifier(name: String): Primitive =
    primNameToPrimMap.getOrElse(
      name,
      // scalastyle:off null
      null
      // scalastyle:on null
    )

  override def readExtensionObject(extensionName: String, typeName: String, value: String): org.nlogo.core.ExtensionObject = ???

  // This is a workaround for `Compiler.compileProceduresIncremental()`.  The parser calls `startFullCompilation()`
  // when it runs, but when compiling individual procedures we won't have the `extensions` declaration in the code.
  // This gives us a simple way to keep extensions loaded when using that function, without needing to dive into
  // the parser code to provide some way to skip the `startFullCompilation` step.  -Jeremy B June 2021
  private var shouldRetainExtensions = false
  def retainExtensionsOnNextCompile(): Unit =
    shouldRetainExtensions = true

  override def startFullCompilation(): Unit = {
    if (shouldRetainExtensions) {
      shouldRetainExtensions = false
    } else {
      primNameToPrimMap.clear()
    }
  }

}
