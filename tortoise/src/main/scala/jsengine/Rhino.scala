// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.jsengine

import
  org.mozilla.javascript.{ Context, ContextAction, ContextFactory,
    Function, Scriptable, ScriptableObject, Undefined }

/* We use the Rhino engine to test scala.js-generated javascript.
 * We would like to use Nashorn for this, but Nashorn can't yet
 * handle reading in javascript of the size/complexity that scala.js generates.
 * When major Nashorn upgrades are released, Nashorn should be reassesed
 * for suitability. If it works, this class should be deleted and
 * the Rhino dependency removed from the project. RG 4/13/2015
 */
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
        Seq("java", "scala", "com", "org")
          .foreach(ScriptableObject.putProperty(scope, _, Undefined.instance))
        scope
      }
    }).asInstanceOf[ScriptableObject]


  def engine: RhinoEngine = new RhinoEngine(factory, scope)

  class RhinoEngine(contextFactory: ContextFactory, scope: Scriptable) {
    def withContext[A <: AnyRef](f: Context => A): A =
      contextFactory.call(new ContextAction {
        override def run(cx: Context): AnyRef = f(cx)
      }).asInstanceOf[A]

    // scalastyle:off null
    // We use nulls here as the Rhino SecurityDomain, since we're not concerned with security
    // RG 5/22/15
    def eval(js: String): AnyRef =
      withContext(_.evaluateString(scope, js, "<eval>", 1, null))

    def function(js: String): Array[AnyRef] => AnyRef = {
      val rhinoFunction =
        withContext(_.compileFunction(scope, js, "<compiledFunction>", 1, null)).asInstanceOf[Function]

      ((a: Array[AnyRef]) => withContext(rhinoFunction.call(_, scope, scope, a)))
    }
    //scalastyle:on null
  }
}
