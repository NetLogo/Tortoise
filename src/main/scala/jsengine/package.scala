// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

package object jsengine {

  private val locator = new org.webjars.WebJarAssetLocator
  private def getLib(jsFileName: String): String = s"/${locator.getFullPath(jsFileName)}"

  val jsLibs = Seq("/js/tortoise-engine.js")

}
