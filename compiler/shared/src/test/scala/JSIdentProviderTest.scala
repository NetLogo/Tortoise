// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.scalatest.FunSuite

class JSIdentProviderTest extends FunSuite {

  test("lowercases identifiers") {
    "netLogo" manglesTo "netlogo"
  }

  test("camel-cases dash-separated identifiers") {
    "net-logo" manglesTo "netLogo"
  }

  test("escapes characters that are invalid in JS identifiers") {
    "netlogo?" manglesTo "netlogo_p"
    "netlogo!" manglesTo "netlogo_exclamation_"
    "netlogo=" manglesTo "netlogo_eq"
  }

  test("escapes identifiers that are JS keywords") {
    "switch" manglesTo "_switch_"
  }

  test("doesn't mangle identifiers that only partially contain JS keywords") {
    "switch-colors" manglesTo "switchColors"
  }

  test("changes names that are likely to clash with JS browser-specific methods") {
    "onclose" manglesTo "on_close"
    "is-finite" manglesTo "is_Finite"
    "screen-x" manglesTo "screen_X"
    "scroll-x" manglesTo "scroll_X"
    "webkit-storage-info" manglesTo "webkit_StorageInfo"
    "moz-contact" manglesTo "moz_Contact"
    "ms-pac-man" manglesTo "ms_PacMan"
  }

  test("doesn't mangle identifiers that only partially contain parts of browser-specific methods' names") {
    "teardown-onclose" manglesTo "teardownOnclose"
  }

  private implicit class TestString(str: String) {
    def manglesTo(expected: String): Unit = { assertResult(expected)(JSIdentProvider(str)); () }
  }

}
