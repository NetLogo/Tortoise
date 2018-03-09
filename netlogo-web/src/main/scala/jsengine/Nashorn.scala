// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw.jsengine

import java.io.{ PrintWriter, StringWriter }
import javax.script.ScriptContext
import jdk.nashorn.api.scripting.NashornScriptEngineFactory

import
  org.nlogo.core.{ LogoList, Nobody, Resource }

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

  for (polyfill <- Nashorn.polyfills)
    engine.eval(polyfill)

  // returns anything that got output-printed along the way, and any JSON
  // generated too
  def run(script: String): (String, String) = {
    runWithoutWrapping(wrapInFunction(script))
  }

  def eval(script: String): AnyRef =
    fromNashorn(engine.eval(script))

  def evalAndDump(script: String): String = {

    val result = engine.eval(script)

    import scala.collection.JavaConverters.mapAsJavaMapConverter
    val tempVar  = "__netlogoTempVar"
    val bindings = engine.createBindings
    bindings.putAll(engineScope.asInstanceOf[java.util.Map[String, Any]])
    bindings.putAll(Map[String, Any](tempVar -> result).asJava)

    engine.eval(s"workspace.dump($tempVar)", bindings).toString

  }

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

object Nashorn {
  // scalastyle:off method.length
  private def polyfills =
    Seq(
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat#Polyfill
      """|String.prototype.repeat = function(count) {
         |  'use strict';
         |  if (this == null) {
         |    throw new TypeError('can\'t convert ' + this + ' to object');
         |  }
         |  var str = '' + this;
         |  count = +count;
         |  if (count != count) {
         |    count = 0;
         |  }
         |  if (count < 0) {
         |    throw new RangeError('repeat count must be non-negative');
         |  }
         |  if (count == Infinity) {
         |    throw new RangeError('repeat count must be less than infinity');
         |  }
         |  count = Math.floor(count);
         |  if (str.length == 0 || count == 0) {
         |    return '';
         |  }
         |  // Ensuring count is a 31-bit integer allows us to heavily optimize the
         |  // main part. But anyway, most current (August 2014) browsers can't handle
         |  // strings 1 << 28 chars or longer, so:
         |  if (str.length * count >= 1 << 28) {
         |    throw new RangeError('repeat count must not overflow maximum string size');
         |  }
         |  var rpt = '';
         |  for (var i = 0; i < count; i++) {
         |    rpt += str;
         |  }
         |  return rpt;
         |};"""
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart#Polyfill
    , """|String.prototype.padStart = function padStart(targetLength,padString) {
         |  targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
         |  padString = String(padString || ' ');
         |  if (this.length > targetLength) {
         |    return String(this);
         |  }
         |  else {
         |    targetLength = targetLength-this.length;
         |    if (targetLength > padString.length) {
         |      padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
         |    }
         |    return padString.slice(0,targetLength) + String(this);
         |  }
         |};"""
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
    , """|Object.defineProperty(Object, "assign", {
         |  value: function assign(target, varArgs) { // .length of function is 2
         |    'use strict';
         |    if (target == null) { // TypeError if undefined or null
         |      throw new TypeError('Cannot convert undefined or null to object');
         |    }
         |
         |    var to = Object(target);
         |
         |    for (var index = 1; index < arguments.length; index++) {
         |      var nextSource = arguments[index];
         |
         |      if (nextSource != null) { // Skip over if undefined or null
         |        for (var nextKey in nextSource) {
         |          // Avoid bugs when hasOwnProperty is shadowed
         |          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
         |            to[nextKey] = nextSource[nextKey];
         |          }
         |        }
         |      }
         |    }
         |    return to;
         |  },
         |  writable: true,
         |  configurable: true
         |});"""
    ).map(_.stripMargin)

}
// scalastyle:on method.length

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
