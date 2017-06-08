// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.jsengine

import java.io.{ PrintWriter, StringWriter }
import javax.script.ScriptContext
import jdk.nashorn.api.scripting.NashornScriptEngineFactory

import
  org.nlogo.{ api, core },
    api.MersenneTwisterFast,
    core.{ LogoList, Nobody, Resource }

// There are two main entry points here: run() and eval().  The former runs compiled commands and
// collects all the lines of output and JSON updates generated.  The latter runs a compiled reporter
// and returns a single result value.

class Nashorn {

  // at some point we'll need to have separate instances instead of a singleton - ST 1/18/13
  // the (null) became necessary when we upgraded to sbt 0.13. I don't understand why.
  // classloaders, go figure! - ST 8/26/13
  // scalastyle:off null
  val engine = (new NashornScriptEngineFactory).getScriptEngine("--language=es6")
  // scalastyle:on null

  val versionNumber: String = engine.getFactory.getEngineVersion

  val engineScope = engine.getBindings(ScriptContext.ENGINE_SCOPE)
  engineScope.put("window", engineScope) // Some libraries expect to find a `window` object --JAB (8/21/14)

  // ensure exact matching results
  engine.put("StrictMath", Strict)

  for (lib <- jsLibs)
    engine.eval(Resource.asString(lib))

  // returns anything that got output-printed along the way, and any JSON
  // generated too
  def run(script: String): (String, String) = {
    runWithoutWrapping(wrapInFunction(script))
  }

  def eval(script: String): AnyRef =
    fromNashorn(engine.eval(script))

  // translate from Nashorn values to NetLogo values
  def fromNashorn(jsValue: AnyRef): AnyRef =
    jsValue match {
      case a: jdk.nashorn.api.scripting.ScriptObjectMirror if a.isArray =>
        LogoList.fromIterator(
          Iterator.from(0)
            .map(x => fromNashorn(a.get(x.toString)))
            .take(a.get("length").asInstanceOf[Number].intValue))
      case a: jdk.nashorn.api.scripting.ScriptObjectMirror if a.get("id") == -1 =>
        Nobody
      // this should probably reject unknown types instead of passing them through.
      // known types: java.lang.Double, java.lang.Boolean, String
      case l: java.lang.Long =>
        l.toDouble : java.lang.Double
      case i: java.lang.Integer =>
        i.toDouble : java.lang.Double
      case x if x == engine.get("Nobody") =>
        Nobody
      case x =>
        x
    }

  protected def runWithoutWrapping(script: String): (String, String) = {
    val sw = new StringWriter
    engine.getContext.setWriter(new PrintWriter(sw))
    engine.eval(script)
    (sw.toString, engine.eval("JSON.stringify(Updater.collectUpdates())").toString)
  }

  protected def wrapInFunction(script: String): String =
    s"(function () {\n $script \n }).call(this);"

}

// ADDING SOMETHING TO THIS OBJECT?
// WELL, ARE YA, PUNK?
// If you are, open your browser's console and type in "Math.<the name of that thing>".
// If it returns `undefined`, you need to add it to 'strictmath.coffee', too!
// Or, maybe just consult this page to figure out if it's a part of the spec or not:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
// --JAB (11/4/13)
object Strict {
  val PI:                          Double = StrictMath.PI
  def abs(x: Double):              Double = StrictMath.abs(x)
  def acos(x: Double):             Double = StrictMath.acos(x)
  def asin(x: Double):             Double = StrictMath.asin(x)
  def atan2(x: Double, y: Double): Double = StrictMath.atan2(x, y)
  def ceil(x: Double):             Double = StrictMath.ceil(x)
  def cos(x: Double):              Double = StrictMath.cos(x)
  def exp(x: Double):              Double = StrictMath.exp(x)
  def floor(x: Double):            Double = StrictMath.floor(x)
  def log(x: Double):              Double = StrictMath.log(x)
  // Don't bother trying to add `max` or `min`.  They're variadic in JS and binary on the JVM.
  // Doesn't translate well. --JAB (2/18/15)
  def pow(x: Double, y: Double):   Double = StrictMath.pow(x, y)
  def round(x: Double):            Double = StrictMath.round(x)
  def sin(x: Double):              Double = StrictMath.sin(x)
  def sqrt(x: Double):             Double = StrictMath.sqrt(x)
  def tan(x: Double):              Double = StrictMath.tan(x)
  def toDegrees(x: Double):        Double = StrictMath.toDegrees(x)
  def toRadians(x: Double):        Double = StrictMath.toRadians(x)
  def truncate(x: Double):         Double = x.toInt
}
