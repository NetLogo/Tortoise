package org.nlogo.tortoise.v8

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

  private val ValidVersionRegex = """v\d[\d.]*""".r

  Try(Process(Seq("node", "--version")).lines.toList.last).flatMap {
    case x @ ValidVersionRegex() => Try(x)
    case x                       => Try(throw new Exception(s"'$x' is not a proper version number"))
  }.recover {
    case ex: Exception => Try(throw new Exception("Node.js does not appear to be installed correctly on this machine.", ex))
  }.get

  private val process = Process(Seq("node", "-p"))

  // NOTE: Each call to `eval` creates a new `node` process; the environment is not persisted across processes --JAB (1/30/14)
  def eval(js: String): String = {

    val is     = s"${V8.depsStr};$js".toIS
    val result = (process #< is).lines.toList.mkString("\n")
    is.close()

    // It's a hack, but... whatevs for now. --JAB (1/30/14)
    if (result != "[Function: AgentModel]")
      result
    else
      "undefined"

  }

  implicit class Str2IS(str: String) {
    def toIS: InputStream = new ByteArrayInputStream(str.getBytes(UTF_8))
  }

}

object V8 {
  private lazy val depsStr = org.nlogo.tortoise.jsengine.jsLibs map Resource.asString mkString ";"
}
