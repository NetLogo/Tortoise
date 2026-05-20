// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import org.nlogo.workspace.ExtensionInstaller

object ExtensionsInstaller {
  def main(args: Array[String]): Unit = {
    // In theory these are auto-installed by the `shouldAutoInstallLibs`, something about the API 6.1 and the NetLogo
    // version of 7 is causing a hiccup.  This is just a workaround and should be fixed at some point.  -Jeremy B May 2025
    ExtensionInstaller.main(Seq("array", "table", "export-the", "import-a", "matrix", "resource", "string").toArray)
  }
}
