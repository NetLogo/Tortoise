// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import org.nlogo.api.{ ExtensionManager, LibraryManager }
import org.nlogo.core.LibraryStatus

object ExtensionsUpdater {
  def main(args: Array[String]): Unit = {
    val libraryManager = new LibraryManager(ExtensionManager.userExtensionsPath, () => {})
    val updateableLibs = libraryManager.getExtensionInfos.filter(_.status == LibraryStatus.CanUpdate)
    updateableLibs.foreach( (libInfo) => {
      println(s"Updating extension: ${libInfo.name}")
      libraryManager.installExtension(libInfo)
    })
  }
}
