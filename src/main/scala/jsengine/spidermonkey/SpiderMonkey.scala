// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.jsengine
package spidermonkey

import
  java.{ io, nio },
    io.{ ByteArrayInputStream, InputStream },
    nio.charset.StandardCharsets.UTF_8

import
  scala.{ sys, util } ,
    sys.process.Process,
    util.Try

import
  org.nlogo.core.Resource

class SpiderMonkey {

  private val ValidVersionRegex = """(?s).*\nVersion: JavaScript-(.*?)\n.*""".r
  private val ValidResultRegex  = """(?:js> )?(.*)""".r

  private val smErrorInstructions =
    """SpiderMonkey does not appear to be installed correctly on this machine.
      |Please download from http://ftp.mozilla.org/pub/mozilla.org/firefox/nightly/latest-trunk/ the version of JSShell
      |that is appropriate for your system and get the enclosed 'js' program onto your `PATH` as `spidermonkey`.
    """.stripMargin.trim

  // There's no easy flag for extracting the version number, unfortunately
  val versionNumber = Try(Process(Seq("spidermonkey", "--help")).!!).flatMap {
    case ValidVersionRegex(x) => Try(x)
    case x                    => Try(throw new Exception(s"`spidermonkey --help` did not return a proper version number"))
  }.transform(Try(_), {
    case ex: Exception => Try(throw new Exception(smErrorInstructions, ex))
  }).get

  private val process = Process(Seq("spidermonkey"))

  // NOTE: Each call to `eval` creates a new `spidermonkey` process; the environment is not persisted across processes --JAB (2/5/14)
  //
  // ANOTHER NOTE: This does not handle multi-line results very well, thanks to the following hard-to-handle behavior
  // with the example input "1+3;\n2+4;\n4+12;":
  //
  // """
  // js> 1+3;
  // js> 2+4;
  // js> 4+12;
  // js> 4
  // 6
  // 16
  // """
  //
  // Pretty nice, huh?  --JAB (2/5/14)
  def eval(js: String): String = {
    val is = s"window=this;${SpiderMonkey.depsStr};$js".toIS
    val ValidResultRegex(result) = (process #< is).lineStream.toList.init.last
    is.close()
    result
  }

  private implicit class Str2IS(str: String) {
    def toIS: InputStream = new ByteArrayInputStream(str.getBytes(UTF_8))
  }

}

object SpiderMonkey {
  private lazy val depsStr = jsLibs map Resource.asString mkString ";"
}

