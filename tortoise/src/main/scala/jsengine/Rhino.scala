package org.nlogo.tortoise.jsengine

import
  org.mozilla.javascript._

class Rhino {
  val versionNumber: String = "1.7R5"

  private val factory = new ContextFactory() {
    override def makeContext: Context = {
      val cx = super.makeContext
      cx.setOptimizationLevel(-1)
      cx
    }
  }

  private val scope: ScriptableObject = factory.call(
    new ContextAction {
      override def run(cx: Context): AnyRef = {
        val scope = cx.initStandardObjects()
        for (name <- Seq("java", "scala", "com", "org"))
          ScriptableObject.putProperty(scope, name, Undefined.instance)
          scope
      }
    }).asInstanceOf[ScriptableObject]


  def engine = new RhinoEngine(factory, scope)

  class RhinoEngine(val cf: ContextFactory, val scope: Scriptable) {
    def withContext[A <: AnyRef](f: Context => A): A =
      cf.call(new ContextAction {
        override def run(cx: Context): AnyRef = {
          f(cx)
      }}).asInstanceOf[A]

    def eval(js: String): AnyRef =
      withContext(_.evaluateString(scope, js, "<eval>", 1, null))

    def function(js: String): Array[AnyRef] => AnyRef = {
      val rhinoFunction = (withContext(
        _.compileFunction(scope, js, "<compiledFunction>", 1, null)).asInstanceOf[Function])

      { (a: Array[AnyRef]) => withContext { rhinoFunction.call(_, scope, scope, a) } }
    }
  }
}
