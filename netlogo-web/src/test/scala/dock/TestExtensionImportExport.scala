// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import org.nlogo.core.{ Model, View, Output }

class TestExtensionImportExport extends DockingSuite {

  val model = Model(
    code = "extensions [array table export-the import-a matrix] globals [x y z]"
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

  // the "meta" header information is different between web and desktop as it includes the runtime engine version
  // as well as the date/time of generation.  So just skip it and assume it's close enough. -Jeremy B September 2020
  val headerSkipper = skipLines(3)

  test("table values are equal when exported") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x table:make")
    testCommand("table:put x \"soccer\" [0 10 20]")
    testCommand("set y export-the:world")
    compareMunged("y", headerSkipper, headerSkipper)
  }

  test("array values are equal when exported") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x array:from-list [\"soccer\" [0 10 20]]")
    testCommand("set y export-the:world")
    compareMunged("y", headerSkipper, headerSkipper)
  }

  test("matrix values are equal when exported") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x matrix:from-row-list [[1 2 3] [4 5 6]]")
    testCommand("set y export-the:world")
    compareMunged("y", headerSkipper, headerSkipper)
  }

  test("multiple extension values are exported correctly") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("""
      set x (list
        (table:make)
        (array:from-list ["soccer" [0 10 20]])
        (matrix:from-row-list [[1 2 3] [4 5 6]])
      )
    """)
    testCommand("table:put (item 0 x) \"futbol\" [3 13 23]")
    testCommand("set y export-the:world")
    compareMunged("y", headerSkipper, headerSkipper)
  }

  test("nested extension values are exported correctly") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set z (array:from-list [\"soccer\" [0 10 20]])")
    testCommand("""
      set x (list
        (table:make)
        z
        (matrix:from-row-list [[1 2 3] [4 5 6]])
      )
    """)
    testCommand("table:put (item 0 x) \"futbol\" [3 13 23]")
    testCommand("table:put (item 0 x) \"fencing\" z")
    testCommand("set y export-the:world")
    compareMunged("y", headerSkipper, headerSkipper)
  }

}
