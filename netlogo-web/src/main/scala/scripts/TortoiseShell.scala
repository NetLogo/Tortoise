// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo

import
  org.nlogo.tortoise.compiler.Compiler

import
  org.nlogo.tortoise.nlw.jsengine.GraalJS

// scalastyle:off regex
object TortoiseShell extends workspace.Shell {
  val size = 16

  val defaultModel = core.Model(code = "", widgets = List(core.View.square(size)))

  val jsRuntime = new GraalJS

  def main(argv: Array[String]) {
    workspace.AbstractWorkspace.setHeadlessProperty()
    val compilation = Compiler.compileProcedures(defaultModel)
    jsRuntime.setupTortoise
    jsRuntime.eval(Compiler.toJS(compilation))
    System.err.println("Tortoise Shell 1.0")
    for(line <- input.takeWhile(!isQuit(_)))
      printingExceptions {
        run(Compiler.compileRawCommands(line, compilation.procedures, compilation.program))
      }
  }

  def run(js: String) {
    printingExceptions {
      val (output, json) = jsRuntime.run(js)
      Seq(output)
        .filter(_.nonEmpty)
        .foreach(x => println(x.trim))
    }
  }

  private def printingExceptions(body: => Unit) {
    try body
    catch { case e: Exception => println(e) }
  }

}
// scalastyle:on regex
