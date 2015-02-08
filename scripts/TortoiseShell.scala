// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo

import
  tortoise.{ Compiler, jsengine },
    jsengine.Nashorn

object TortoiseShell extends workspace.Shell {

  val defaultModel = core.Model(code = "", widgets = List(core.View.square(16)))

  val nashorn = new Nashorn

  def main(argv: Array[String]) {
    workspace.AbstractWorkspace.setHeadlessProperty()
    val (js, program, procedures) = Compiler.compileProcedures(defaultModel)
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
