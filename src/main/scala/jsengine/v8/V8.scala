// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.jsengine
package v8

import
  java.{ io, nio },
    io.{ ByteArrayInputStream, InputStream },
    nio.charset.StandardCharsets.UTF_8

import
  scala.{ sys, util },
    sys.process.Process,
    util.Try

import
  org.nlogo.core.Resource

class V8 {

  private val ValidVersionRegex = """(v\d[\d.]*)""".r

  val versionNumber = Try(Process(Seq("node", "--version")).lines.toList.last).flatMap {
    case ValidVersionRegex(x) => Try(s"Node.js $x")
    case x                    => Try(throw new Exception(s"'$x' is not a proper version number"))
  }.transform(Try(_), {
    case ex: Exception => Try(throw new Exception("Node.js does not appear to be installed correctly on this machine.", ex))
  }).get

  private val process = Process(Seq("node", "-p"))

  // NOTE: Each call to `eval` creates a new `node` process; the environment is not persisted across processes --JAB (1/30/14)
  def eval(js: String): String = {

    val is     = s"window=global;${V8.depsStr};$js".toIS
    val result = (process #< is).lines.toList.mkString("\n")
    is.close()

    // It's a hack, but... whatevs for now. --JAB (1/30/14)
    if (result != "[Function: AgentModel]")
      result
    else
      "undefined"

  }

  private implicit class Str2IS(str: String) {
    def toIS: InputStream = new ByteArrayInputStream(str.getBytes(UTF_8))
  }

}

object V8 {
  private lazy val depsStr = jsLibs map Resource.asString mkString ";"
}
