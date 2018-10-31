// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.macros

import java.io.{ File, FilenameFilter }

import scala.io.Source
import scala.reflect.macros.whitebox.Context

object ExtDefReader {

  def getAll(): Seq[String] = macro getAll_impl


  // scalastyle:off method.name
  def getAll_impl(c: Context)(): c.Expr[Seq[String]] = {
  // scalastyle:on method.name

    import c.universe._

    val fileFilter =
      new FilenameFilter {
        override def accept(dir: File, name: String) = name.endsWith(".json")
      }

    val extDir  = new File("engine/src/main/coffee/extensions/")
    val extDefs =
      extDir.listFiles(fileFilter).toSeq.map {
        file =>
          val src = Source.fromFile(file)
          val out = src.mkString
          src.close()
          out
      }

    c.Expr[Seq[String]](q"Seq(..$extDefs)")

  }

}
