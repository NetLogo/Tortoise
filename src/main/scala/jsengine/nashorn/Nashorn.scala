// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.jsengine
package nashorn

import
  java.io.{ PrintWriter, StringWriter }

import
  javax.script.{ ScriptContext, ScriptEngineManager }

import org.nlogo.api, api.MersenneTwisterFast
import org.nlogo.core.Resource

// There are two main entry points here: run() and eval().  The former runs compiled commands and
// collects all the lines of output and JSON updates generated.  The latter runs a compiled reporter
// and returns a single result value.

class Nashorn {

  // at some point we'll need to have separate instances instead of a singleton - ST 1/18/13
  // the (null) became necessary when we upgraded to sbt 0.13. I don't understand why.
  // classloaders, go figure! - ST 8/26/13
  val engine = new ScriptEngineManager(null).getEngineByName("nashorn").ensuring(_ != null, "JavaScript engine unavailable")

  val versionNumber: String = engine.getFactory.getEngineVersion

  val engineScope = engine.getBindings(ScriptContext.ENGINE_SCOPE)
  engineScope.put("window", engineScope) // Some libraries (e.g. lodash) expect to find a `window` object --JAB (8/21/14)

  // make a random number generator available
  engine.put("Random",    new MersenneTwisterFast)
  engine.put("AuxRandom", new MersenneTwisterFast)

  // ensure exact matching results
  engine.put("StrictMath", Strict)

  for (lib <- jsLibs)
    engine.eval(Resource.asString(lib))

  // returns anything that got output-printed along the way, and any JSON
  // generated too
  def run(script: String): (String, String) = {
    val sw = new StringWriter
    engine.getContext.setWriter(new PrintWriter(sw))
    engine.eval(s"(function () {\n $script \n }).call(this);")
    (sw.toString, engine.eval("JSON.stringify(Updater.collectUpdates())").toString)
  }

  def eval(script: String): AnyRef =
    fromNashorn(engine.eval(script))

  // translate from Nashorn values to NetLogo values
  def fromNashorn(jsValue: AnyRef): AnyRef =
    jsValue match {
      case a: jdk.nashorn.api.scripting.ScriptObjectMirror if a.isArray =>
        api.LogoList.fromIterator(
          Iterator.from(0)
            .map(x => fromNashorn(a.get(x)))
            .take(a.get("length").asInstanceOf[Number].intValue))
      // this should probably reject unknown types instead of passing them through.
      // known types: java.lang.Double, java.lang.Boolean, String
      case l: java.lang.Long =>
        l.toDouble : java.lang.Double
      case i: java.lang.Integer =>
        i.toDouble : java.lang.Double
      case x if x == engine.get("Nobody") =>
        api.Nobody
      case x =>
        x
    }

}
