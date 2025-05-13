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

  def main(argv: Array[String]): Unit = {
    workspace.AbstractWorkspace.setHeadlessProperty()

    val compiler = new Compiler()
    val compilation = compiler.compileProcedures(defaultModel)
    jsRuntime.setupTortoise()
    jsRuntime.eval(compiler.toJS(compilation))
    System.err.println("Tortoise Shell 1.0")
    for(line <- input.takeWhile(!isQuit(_)))
      printingExceptions {
        run(compiler.compileRawCommands(line, compilation.procedures, compilation.program))
      }
  }

  def run(js: String): Unit = {
    printingExceptions {
      val (output, json) = jsRuntime.run(js)
      Seq(output)
        .filter(_.nonEmpty)
        .foreach(x => println(x.trim))
    }
  }

  private def printingExceptions(body: => Unit): Unit = {
    try body
    catch { case e: Exception => println(e) }
  }

}
// scalastyle:on regex
