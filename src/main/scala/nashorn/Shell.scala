// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise
package nashorn

import org.nlogo.{ api, workspace }

object Shell extends workspace.Shell {

  object Defaults {
    val src = ""
    val dim = api.WorldDimensions.square(16)
  }

  val nashorn = new Nashorn

  def main(argv: Array[String]) {
    workspace.AbstractWorkspace.setHeadlessProperty()
    val (js, program, procedures) =
      Compiler.compileProcedures(
        Defaults.src, dimensions = Defaults.dim)
    nashorn.eval(js)
    System.err.println("Tortoise Shell 1.0")
    for(line <- input.takeWhile(!isQuit(_)))
      printingExceptions {
        run(Compiler.compileCommands(line, procedures, program))
      }
  }

  def run(js: String) {
    printingExceptions {
      val (output, json) = nashorn.run(js)
      Seq(output) // , json)
        .filter(_.nonEmpty)
        .foreach(x => println(x.trim))
    }
  }

  private def printingExceptions(body: => Unit) {
    try body
    catch { case e: Exception => println(e) }
  }

}
