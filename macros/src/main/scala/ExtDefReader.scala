// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.macros

import java.io.{ File, FilenameFilter }

import scala.io.Source

import scala.quoted.{ Expr, Quotes }

object ExtDefReader {

  inline def getAll(): Seq[String] = ${ getAllCode() }

  def getAllCode()(using Quotes): Expr[Seq[String]] = {
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

    Expr[Seq[String]](extDefs)

  }

}
