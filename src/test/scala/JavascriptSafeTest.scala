// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import org.scalatest.FunSuite

class JavascriptSafeTest extends FunSuite {
  test("lowercases identifiers that are camel-cased") {
    assertResult("netlogo")(JavascriptSafe("netLogo"))
  }

  test("camel-cases dash-separated identifiers") {
    assertResult("netLogo")(JavascriptSafe("net-logo"))
  }

  test("does not change identifiers which are not javascript primitives or top-level methods") {
    assertResult("netlogo")(JavascriptSafe("netlogo"))
  }

  test("escapes javascript-significant punctuation") {
    assertResult("netlogo_p")(JavascriptSafe("netlogo?"))
    assertResult("netlogo_exclamation_")(JavascriptSafe("netlogo!"))
    assertResult("netlogo_eq")(JavascriptSafe("netlogo="))
  }

  test("escapes javascript-significant whole identifiers") {
    assertResult("_switch_")(JavascriptSafe("switch"))
  }

  test("leaves identifiers containing javascript builtins unchanged") {
    assertResult("switchColors")(JavascriptSafe("switch-colors"))
  }

  test("changes names which are likely to clash with javascript browser-specific methods") {
    assertResult("on_close")(JavascriptSafe("onclose"))
    assertResult("is_Finite")(JavascriptSafe("is-finite"))
    assertResult("screen_X")(JavascriptSafe("screen-x"))
    assertResult("scroll_X")(JavascriptSafe("scroll-x"))
    assertResult("webkit_StorageInfo")(JavascriptSafe("webkit-storage-info"))
    assertResult("moz_Contact")(JavascriptSafe("moz-contact"))
    assertResult("ms_PacMan")(JavascriptSafe("ms-pac-man"))
  }

  test("leaves identifiers containing parts of browser-specific methods unchanged") {
    assertResult("teardownOnclose")(JavascriptSafe("teardown-onclose"))
  }
}
