// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw.jsengine

import java.io.ByteArrayOutputStream

import org.graalvm.polyglot.{ Context, Value }

import scala.io.Source

import org.nlogo.core.{ LogoList, Nobody, Resource }

class GraalJS {
  var baos = new ByteArrayOutputStream
  var jsRuntime = Context.newBuilder("js").out(baos).allowHostAccess(true).build

  val versionNumber: String = jsRuntime.getEngine.getVersion

  def reset(): Unit = {
    baos = new ByteArrayOutputStream
    jsRuntime.close()
    jsRuntime = Context.newBuilder("js").out(baos).allowHostAccess(true).build
    setupTortoise()
    ()
  }

  def setupTortoise(): Unit = {
    evalRaw("window = { }")

    for (lib <- jsLibs)
      evalRaw(Resource.asString(lib))

    put("StrictMath", Strict)
    evalRaw("var strictmath = tortoise_require('shim/strictmath')")
    evalRaw("Object.getOwnPropertyNames(StrictMath).forEach( (prop) => strictmath[ prop ] = StrictMath[ prop ] )")
    evalRaw("javax = { }")
    ()
  }

  def evalRaw(script: String): Value = {
    val result = jsRuntime.eval("js", script)
    result
  }

  def eval(script: String): AnyRef = {
    val result = evalRaw(script)
    fromGraalJS(result)
  }

  def evalAndDump(script: String): String = {
    val result = evalRaw(script)
    fromGraalJS( jsRuntime.eval("js", "workspace.dump").execute(result) ).toString
  }

  // scalastyle:off cyclomatic.complexity
  def fromGraalJS(jsValue: Value): AnyRef = {
    jsValue match {
      case _ if jsValue.hasArrayElements => fromGraalArray( jsValue )
      case _ if jsValue.isNumber         => jsValue.asDouble.asInstanceOf[AnyRef]
      case _ if jsValue.isString         => jsValue.asString.asInstanceOf[AnyRef]
      case _ if jsValue.isBoolean        => jsValue.asBoolean.asInstanceOf[AnyRef]
      case _ if (jsValue.hasMember("id") && jsValue.getMember("id").asDouble == -1) => Nobody
      case n if (jsRuntime.eval("js", "function(n) { return (n === Nobody); }").execute(n).asBoolean) => Nobody
      case _                             => jsValue
    }
  }
  // scalastyle:on cyclomatic.complexity

  def fromGraalArray(jsValue: Value): LogoList = {
    val values = 0L.to(jsValue.getArraySize - 1).map( (i) => fromGraalJS( jsValue.getArrayElement(i) ) )
    LogoList.fromIterator( values.iterator )
  }

  def put(name: String, value: Any): Unit = {
    jsRuntime.getBindings("js").putMember(name, value)
  }

  def run(script: String): (String, String) = {
    runWithoutWrapping(wrapInFunction(script))
  }

  protected def runWithoutWrapping(script: String): (String, String) = {
    baos.reset
    evalRaw(script)
    (baos.toString, evalRaw("JSON.stringify(Updater.collectUpdates())").toString)
  }

  protected def wrapInFunction(script: String): String =
    s"(function () {\n $script \n }).call(this);"

  def smoke(): Value = {
    val compilerSource = Source.fromURL(getClass.getResource("/tortoise-compiler.js")).mkString
    val result = evalRaw(compilerSource)
    result
  }
}
