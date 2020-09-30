// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import org.nlogo.core.{ Model, View, Output }

class TestExtensionImportExport extends DockingSuite {

  val model = Model(
    code = "extensions [table export-the import-a] globals [x y]"
  , widgets = List(
      View.square(1)
      // The `Output` widget is included just to make sure the exported data looks identical to desktop
      // -Jeremy B September 2020
    , Output(1, 2, 3, 4, 10)
    )
  )

  test("table values are equal") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x table:make")
    testCommand("table:put x \"soccer\" [0 10 20]")
    compare("x")
  }

  def skipLines(count: Int) =
    (s: String) => {
      val lines = s.split('\n')
      lines.drop(count).mkString("\n")
    }

  test("table values are equal when exported") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x table:make")
    testCommand("table:put x \"soccer\" [0 10 20]")
    testCommand("set y export-the:world")
    // the "meta" header information is different between web and desktop as it includes the runtime engine version
    // as well as the date/time of generation.  So just skip it and assume it's close enough. -Jeremy B September 2020
    val skipper = skipLines(3)
    compareMunged("y", skipper, skipper)
  }

}
