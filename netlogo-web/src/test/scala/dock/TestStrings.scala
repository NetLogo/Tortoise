// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import org.nlogo.core.Model

class TestStrings extends DockingSuite {

  test("word 0") { implicit fixture => import fixture._
    compare("(word)")
  }

  test("word 1") { implicit fixture => import fixture._
    compare("(word 1)")
  }

  test("word") { implicit fixture => import fixture._
    compare("(word 1 2 3)") // 123, and hopefully not, god forbid, 6
  }

  test("word on list") { implicit fixture => import fixture._
    compare("(word [1 [2 [3 4] 5] 6])")
  }

  test("print list") { implicit fixture => import fixture._
    testCommand("output-print [1 [2 [3 4] 5] 6]")
  }

  test("length") { implicit fixture => import fixture._
    compare("length \"\"")
    compare("length \"HELLO WORLD\"")
  }

  // --- string extension (uses crypto-js for md5) ---

  private val stringModel = Model(code = "extensions [string]")

  test("string:md5") { implicit fixture => import fixture._
    openModel(stringModel, shouldAutoInstallLibs = true)
    compare("""string:md5 "hello"""")
    compare("string:md5 \"\"")
    compare("""string:md5 "The quick brown fox jumps over the lazy dog"""")
  }

  test("string:message-digest-5 alias") { implicit fixture => import fixture._
    openModel(stringModel, shouldAutoInstallLibs = true)
    compare("""string:message-digest-5 "hello"""")
  }

  test("string:hash-code") { implicit fixture => import fixture._
    openModel(stringModel, shouldAutoInstallLibs = true)
    compare("""string:hash-code "hello"""")
    compare("string:hash-code \"\"")
  }

  test("string:upper-case and string:lower-case") { implicit fixture => import fixture._
    openModel(stringModel, shouldAutoInstallLibs = true)
    compare("""string:upper-case "Hello World"""")
    compare("""string:lower-case "Hello World"""")
  }

  test("string:trim") { implicit fixture => import fixture._
    openModel(stringModel, shouldAutoInstallLibs = true)
    compare("""string:trim "  hello  """")
    compare("""string:trim "hello"""")
  }

  test("string:split-on") { implicit fixture => import fixture._
    openModel(stringModel, shouldAutoInstallLibs = true)
    compare("""string:split-on "," "a,b,c"""")
    compare("""string:split-on "," "no-commas"""")
  }

  test("string:explode") { implicit fixture => import fixture._
    openModel(stringModel, shouldAutoInstallLibs = true)
    compare("""string:explode "abc"""")
    compare("string:explode \"\"")
  }
}
