// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw.jsengine

trait JSEngine {
  type T
  def engine: T
  def eval(js: String): String
}

trait JSEngineCompanion {

  protected type T <: JSEngine

  def cleanSlate: T
  def version:    String

  def name:                  String = this.getClass.getSimpleName.init
  def freshEval(js: String): String = cleanSlate.eval(js)

}

object JSEngine {

  implicit class GraalEngine(override val engine: GraalJS) extends JSEngine {
    override type T = GraalJS
    override def eval(js: String): String = engine.evalAndDump(js)
  }

  implicit class V8Engine(override val engine: V8) extends JSEngine {
    override type T = V8
    override def eval(js: String): String = engine.eval(js).toString
  }

  implicit class SpiderMonkeyEngine(override val engine: SpiderMonkey) extends JSEngine {
    override type T = SpiderMonkey
    override def eval(js: String): String = engine.eval(js).toString
  }

  object GraalJS extends JSEngineCompanion {
    override protected type T = GraalEngine
    override def cleanSlate: T = {
      val graal = (new GraalJS)
      graal.setupTortoise()
      graal
    }
    override def version: String = cleanSlate.engine.versionNumber
  }

  object SpiderMonkey extends JSEngineCompanion {
    override protected type T       = SpiderMonkeyEngine
    override def cleanSlate: T      = new SpiderMonkey
    override def version:    String = cleanSlate.engine.versionNumber
  }

  object V8 extends JSEngineCompanion {
    override protected type T       = V8Engine
    override def cleanSlate: T      = new V8
    override def version:    String = cleanSlate.engine.versionNumber
  }

}
