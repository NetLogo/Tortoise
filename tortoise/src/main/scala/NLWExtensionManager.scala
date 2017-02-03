// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import scala.collection.immutable.Map

import org.nlogo.api.Argument
import org.nlogo.api.Context
import org.nlogo.core.ErrorSource
import org.nlogo.core.ExtensionManager
import org.nlogo.core.Primitive
import org.nlogo.core.PrimitiveCommand
import org.nlogo.core.PrimitiveReporter
import org.nlogo.core.Pure
import org.nlogo.core.Syntax, Syntax.{ BooleanType, CommandType, ListType, StringType, WildcardType }

case class ExtensionPrim(primitive: Primitive, name: String)

private trait Extension {

  def getName : String
  def getPrims: Seq[ExtensionPrim]

  protected def extCommand(right: List[Int]) =
    new PrimitiveCommand {
      override def getSyntax: Syntax = Syntax.commandSyntax(right = right)
    }

  protected def extReporter(right: List[Int], ret: Int) =
    new PrimitiveReporter {
      override def getSyntax: Syntax = Syntax.reporterSyntax(right = right, ret = ret)
    }

}

object NLWExtensionManager extends ExtensionManager {

  import org.nlogo.core.{ CompilerException, Token }

  private val primNameToPrimMap: Map[String, Primitive] = {
    val extensions   = Seq[Extension]()
    val extPrimPairs = extensions.flatMap(extension => extension.getPrims.map(prim => (extension.getName, prim)))
    val shoutedPairs = extPrimPairs.map { case (extName, ExtensionPrim(prim, name)) => (s"$extName:$name".toUpperCase, prim) }
    shoutedPairs.toMap
  }

  override def anyExtensionsLoaded: Boolean = true

  override def finishFullCompilation(): Unit = ???

  override def importExtension(jarPath: String, errors: ErrorSource): Unit = ???

  override def replaceIdentifier(name: String): Primitive =
    primNameToPrimMap.getOrElse(
      name,
      if (name.contains(":"))
        throw new CompilerException(s"No such primitive: $name", Token.Eof.start, Token.Eof.end, Token.Eof.filename)
      else
        // scalastyle:off null
        null
        // scalastyle:on null
    )

  override def readExtensionObject(extensionName: String, typeName: String, value: String): org.nlogo.core.ExtensionObject = ???

  override def startFullCompilation(): Unit = ???

}
