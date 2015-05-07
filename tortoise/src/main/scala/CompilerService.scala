// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

// Adds ability to compile NetLogo => JS from command line
//
// Example:
//   cat models/Sample\ Models/Biology/Wolf\ Sheep\ Predation.nlogo | \
//     ./sbt 'run-main org.nlogo.tortoise.CompilerService'

import
  scala.io.Source

import
  scalaz.NonEmptyList

object CompilerService {

  def main(args: Array[String]) {

    val input =
      args match {
        case Array(nlogoPath) => Source.fromFile(nlogoPath)
        case _                => Source.fromInputStream(System.in)
      }
    val nlogo = input.mkString
    input.close()

    val model = CompiledModel.fromNlogoContents(nlogo) valueOr {
      case NonEmptyList(head, _*) => throw head
    }

    // scalastyle:off regex
    println(model.compiledCode)
    // scalastyle:on regex

  }

}
