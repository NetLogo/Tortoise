// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw.jsengine

import java.io.{ByteArrayInputStream, InputStream}
import java.nio.charset.StandardCharsets.UTF_8

import org.nlogo.core.Resource

import scala.sys.process.Process
import scala.util.Try

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
    case ex: Throwable => Try(throw new Exception(smErrorInstructions, ex))
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
    (process #< is).lazyLines.toList.init.last match {
      case ValidResultRegex(result) =>
        is.close()
        result

      case _ =>
        throw new Exception("I dunno, man, I dunno.")
    }
  }

  private implicit class Str2IS(str: String) {
    def toIS: InputStream = new ByteArrayInputStream(str.getBytes(UTF_8))
  }

}

object SpiderMonkey {
  private lazy val depsStr = jsLibs map Resource.asString mkString ";"
}
