// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.jsengine

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

  implicit class NashornEngine(override val engine: Nashorn) extends JSEngine {
    override type T = Nashorn
    override def eval(js: String): String = engine.eval(js).toString
  }

  implicit class V8Engine(override val engine: V8) extends JSEngine {
    override type T = V8
    override def eval(js: String): String = engine.eval(js).toString
  }

  implicit class SpiderMonkeyEngine(override val engine: SpiderMonkey) extends JSEngine {
    override type T = SpiderMonkey
    override def eval(js: String): String = engine.eval(js).toString
  }

  implicit class RhinoEngine(override val engine: Rhino) extends JSEngine {
    override type T = Rhino
    override def eval(js: String): String = engine.eval(js).toString
  }

  object Nashorn extends JSEngineCompanion {
    override protected type T = NashornEngine
    override def cleanSlate = new Nashorn
    override def version    = cleanSlate.engine.versionNumber
  }

  object SpiderMonkey extends JSEngineCompanion {
    override protected type T = SpiderMonkeyEngine
    override def cleanSlate = new SpiderMonkey
    override def version    = cleanSlate.engine.versionNumber
  }

  object V8 extends JSEngineCompanion {
    override protected type T = V8Engine
    override def cleanSlate = new V8
    override def version    = cleanSlate.engine.versionNumber
  }

}

