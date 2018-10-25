// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{
    ErrorSource, ExtensionManager, Primitive, PrimitiveCommand, PrimitiveReporter,
    Syntax
  }, Syntax.{
    NormalPrecedence, AgentsetType, AgentType, BooleanBlockType, BooleanType,
    BracketedType, CodeBlockType, CommandBlockType, CommandType, LinksetType,
    LinkType, ListType, NobodyType, NumberBlockType, NumberType, OptionalType,
    OtherBlockType, PatchsetType, PatchType, ReadableType, ReferenceType,
    RepeatableType, ReporterBlockType, ReporterType, StringType, SymbolType,
    TurtlesetType, TurtleType, WildcardType, VoidType
  }

case class ExtensionPrim(primitive: Primitive, name: String, actionName: String)

private trait Extension {
  def getName : String
  def getPrims: Seq[ExtensionPrim]
}

private object CreateExtension {

  import play.api.libs.json.{ JsValue, Json, JsArray, JsError, JsSuccess }

  def apply(json: String): Extension = {
    val jsExt = Json.parse(json)
    new Extension {
      override def getName: String = {
        jsExt("name").as[String]
      }
      override def getPrims: Seq[ExtensionPrim] = {
        try {
          jsExt("prims").as[JsArray].value.map(convertToExtensionPrim)
        } catch {
          case e: Exception => throw new Exception(s"Problem parsing extension definition JSON.  ${e.getMessage}", e)
        }
      }
    }
  }

  private def convertToExtensionPrim(jsPrim: JsValue): ExtensionPrim = {
    val returnType    = (jsPrim \ "returnType").asOpt[String].getOrElse("unit")
    val isReporter    = (returnType != "unit")
    val args          = jsPrim("argTypes").as[JsArray].value.map(convertArgToTypeInt)
    val returnInt     = typeNameToTypeInt(returnType)
    val defaultOption = (jsPrim \ "defaultOption").asOpt[Int]
    val prim          = if (isReporter) {
      val isInfix          = (jsPrim \ "isInfix").asOpt[Boolean].getOrElse(false)
      val (left, right)    = if (isInfix) (args.head, args.tail) else (VoidType, args)
      val precedenceOffset = (jsPrim \ "precedenceOffset").asOpt[Int].getOrElse(0)
      val precedence       = NormalPrecedence + precedenceOffset
      new PrimitiveReporter {
        override def getSyntax: Syntax = Syntax.reporterSyntax(
          left          = left,
          right         = right.toList,
          ret           = returnInt,
          precedence    = precedence,
          defaultOption = defaultOption
        )
      }
    } else
      new PrimitiveCommand {
        override def getSyntax: Syntax = Syntax.commandSyntax(right = args.toList, defaultOption = defaultOption)
      }
    ExtensionPrim(prim, jsPrim("name").as[String], jsPrim("actionName").as[String])
  }

  private def convertArgToTypeInt(jsArg: JsValue): Int = {
    (jsArg \ "type").validate[String] match {
      case JsError(_) =>
        typeNameToTypeInt(jsArg.as[String])
      case JsSuccess(typeName, _) => {

        val isRepeatable = (jsArg \ "isRepeatable").asOpt[Boolean].getOrElse(false)
        val isOptional   = (jsArg \ "isOptional"  ).asOpt[Boolean].getOrElse(false)

        val primaryMask      = typeNameToTypeInt(typeName)
        val isRepeatableMask = if (isRepeatable) RepeatableType else 0
        val isOptionalMask   = if (isOptional)   OptionalType   else 0

        primaryMask | isRepeatableMask | isOptionalMask

      }
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
object NLWExtensionManager extends ExtensionManager {

  import org.nlogo.core.{ CompilerException, Token }
  import org.nlogo.tortoise.compiler.ExtDefReader
  import scala.collection.mutable.{ Map => MMap }

  private val extNameToExtMap                            = ExtDefReader.getAll().map(CreateExtension.apply).map(x => (x.getName, x)).toMap
  private val primNameToPrimMap: MMap[String, Primitive] = MMap()

  override def anyExtensionsLoaded: Boolean = true

  override def finishFullCompilation(): Unit = ()

  override def importExtension(extName: String, errors: ErrorSource): Unit = {
    val extension    = extNameToExtMap.getOrElse(extName, throwCompilerError(s"No such extension: ${extName}"))
    val extPrimPairs = extension.getPrims.map(prim => (extension.getName, prim))
    val shoutedPairs = extPrimPairs.map { case (extName, ExtensionPrim(prim, name, _)) => (s"$extName:$name".toUpperCase, prim) }
    primNameToPrimMap ++= shoutedPairs
  }

  override def replaceIdentifier(name: String): Primitive =
    primNameToPrimMap.getOrElse(
      name,
      if (name.contains(":"))
        throwCompilerError(s"No such primitive: $name")
      else
        // scalastyle:off null
        null
        // scalastyle:on null
    )

  override def readExtensionObject(extensionName: String, typeName: String, value: String): org.nlogo.core.ExtensionObject = ???

  override def startFullCompilation(): Unit = {
    primNameToPrimMap.clear()
  }

  private def throwCompilerError(cause: String) =
    throw new CompilerException(cause, Token.Eof.start, Token.Eof.end, Token.Eof.filename)

}
