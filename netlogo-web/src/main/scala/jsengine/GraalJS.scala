// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw.jsengine

import org.graalvm.polyglot.{ Context, Value }

import scala.io.Source

class GraalJS {
  val graalEngine: Context = Context.newBuilder("js").allowHostAccess(true).build

  def eval(script: String): Value = {
    val result = graalEngine.eval("js", script)
    result
  }

  def put(name: String, value: Any): Unit = {
    graalEngine.getBindings("js").putMember(name, value)
  }

  def smoke(): Value = {
    val compilerSource = Source.fromURL(getClass.getResource("/tortoise-compiler.js")).mkString
    val result = eval(compilerSource)
    result
  }
}
