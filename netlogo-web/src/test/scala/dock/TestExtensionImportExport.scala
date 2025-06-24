// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import org.nlogo.core.{ Model, Output, Pen, Plot, View }
import org.nlogo.workspace.ExtensionInstaller

class TestExtensionImportExport extends DockingSuite {

  // In theory these are auto-installed by the `shouldAutoInstallLibs`, something about the API 6.1 and the NetLogo
  // version of 7 is causing a hiccup.  This is just a workaround and should be fixed at some point.  -Jeremy B May 2025
  ExtensionInstaller.main(Seq("array", "table", "export-the", "import-a", "matrix", "resource").toArray)

  val model = Model(
    code = "extensions [array table export-the import-a matrix resource] globals [x y z]"
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

  test("table values export and import") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x table:make")
    testCommand("table:put x \"soccer\" [0 10 20]")
    testCommand("set y export-the:world")
    compareMunged("y", headerSkipper, headerSkipper)

    testCommand("set x 0")
    testCommand("import-a:world y")
    compare("x")
  }

  test("array values export and import") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x array:from-list [\"soccer\" [0 10 20]]")
    testCommand("set y export-the:world")
    compareMunged("y", headerSkipper, headerSkipper)

    testCommand("set x 0")
    testCommand("import-a:world y")
    compare("x")
  }

  test("matrix values export and import") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x matrix:from-row-list [[1 2 3] [4 5 6]]")
    testCommand("set y export-the:world")
    compareMunged("y", headerSkipper, headerSkipper)

    testCommand("set x 0")
    testCommand("import-a:world y")
    compare("x")
  }

  test("different extension values export and import") { implicit fixture => import fixture._
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

    testCommand("set x 0")
    testCommand("import-a:world y")
    compare("x")
  }

  test("nested extension values export and import") { implicit fixture => import fixture._
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

    testCommand("set x 0")
    testCommand("set z 0")

    // I'd love to be able to check that these imports work the same between desktop and web, but
    // desktop doesn't support importing nested extension objects, even if the references are not circular.
    // so we'll leave this here to maybe be enabled someday once desktop catches up with web.
    // https://github.com/NetLogo/NetLogo/issues/12
    // -Jeremy B October 2020.
    // testCommand("import-a:world y")
    // compare("x")
  }

  // We split out tests for multiple extension object values at once because we cannot guarantee the
  // order the extension objects are written to the exported CSV data.  Indeed, `array`, `table`, and `matrix`
  // all give the objects in order of a hash set, which is non-deterministic.  So we will not test the exported
  // data, but we will test the re-imported data to make sure it's the same.
  // -Jeremy B October 2020
  test("multiple table values export and import") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("set x (list table:make table:make table:make)")
    testCommand("table:put (item 0 x) \"euchre\" [6 9 12]")
    testCommand("table:put (item 1 x) \"bags\" [0 10 20]")
    testCommand("table:put (item 2 x) \"soccer\" [0 10 20]")
    testCommand("set y export-the:world")
    testCommand("set x 0")
    testCommand("import-a:world y")
    compare("x")
  }

  test("multiple array values export and import") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("""set x (list
      array:from-list ["euchre" [6 9 12]]
      array:from-list ["bags" [5 5 5]]
      array:from-list ["soccer" [0 10 20]]
    )""")
    testCommand("set y export-the:world")
    testCommand("set x 0")
    testCommand("import-a:world y")
    compare("x")
  }

  test("multiple matrix values export and import") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("""set x (list
      matrix:from-row-list [[3 3 3] [2 2 2] [1 1 1]]
      matrix:from-row-list [[11 22] [33 44]]
      matrix:from-row-list [[1 2 3] [4 5 6]]
    )""")
    testCommand("set y export-the:world")
    testCommand("set x 0")
    testCommand("import-a:world y")
    compare("x")
  }

  test("multiple different extension values export and import") { implicit fixture => import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    testCommand("""
      set x (list
        table:make
        table:make
        table:make
        array:from-list ["euchre" [6 9 12]]
        array:from-list ["bags" [5 5 5]]
        array:from-list ["soccer" [0 10 20]]
        matrix:from-row-list [[3 3 3] [2 2 2] [1 1 1]]
        matrix:from-row-list [[11 22] [33 44]]
        matrix:from-row-list [[1 2 3] [4 5 6]]
      )
    """)
    testCommand("table:put (item 0 x) \"euchre\" [6 9 12]")
    testCommand("table:put (item 1 x) \"bags\" [0 10 20]")
    testCommand("table:put (item 2 x) \"soccer\" [0 10 20]")
    testCommand("set y export-the:world")
    testCommand("set x 0")
    testCommand("import-a:world y")
    compare("x")
  }

  test("table export with plot works") { implicit fixture => import fixture._
    val plotModel = Model(
      code = "extensions [table export-the] globals [x y z]"
    , widgets = List(
        View.square(1)
      , Plot(display = Some("plot1"), pens = List(Pen(display = "pen1"), Pen(display = "pen2")))
      )
    )
    openModel(plotModel, shouldAutoInstallLibs = true)

    compare("export-the:plot \"plot1\"")

    testCommand("set x table:make")
    testCommand("set y export-the:plot \"plot1\"")

    compare("y")
  }

}
