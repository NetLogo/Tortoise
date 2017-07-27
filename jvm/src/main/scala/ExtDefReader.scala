// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import java.nio.file.{ Files, FileSystems }
import scala.collection.JavaConverters.asScalaIteratorConverter
import scala.io.Source

object ExtDefReader {
  def getAll(): Seq[String] =
    try {
      Files.newDirectoryStream(FileSystems.getDefault.getPath("jvm/src/main/coffee/extensions"), "*.json").iterator.asScala.map {
        file =>
          val src = Source.fromFile(file.toFile)
          val str = src.mkString
          src.close()
          str
      }.toSeq
    } catch {
      case _: Exception => Seq()
    }
}
