// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import org.scalatest.FunSuite

class JSIdentProviderTest extends FunSuite {

  test("lowercases identifiers") {
    "netLogo" manglesTo "netlogo"
  }

  test("H-splits dash-separated identifiers") {
    "net-logo" manglesTo "netHlogo"
  }

  test("escapes characters that are invalid in JS identifiers") {
    "netlogo?" manglesTo "netlogo_Q"
    "netlogo!" manglesTo "netlogo_EXC_"
    "netlogo=" manglesTo "netlogo_EQ"
  }

  test("escapes identifiers that are JS keywords") {
    "switch" manglesTo "_SWITCH_"
  }

  test("doesn't mangle identifiers that only partially contain JS keywords") {
    "switch-colors" manglesTo "switchHcolors"
  }

  test("changes names that are likely to clash with JS browser-specific methods") {
    "onclose" manglesTo "ON_close"
    "is-finite" manglesTo "IS_Hfinite"
    "screen-x" manglesTo "SCREEN_Hx"
    "scroll-x" manglesTo "SCROLL_Hx"
    "webkit-storage-info" manglesTo "WEBKIT_HstorageHinfo"
    "moz-contact" manglesTo "MOZ_Hcontact"
    "ms-pac-man" manglesTo "MS_HpacHman"
  }

  test("doesn't mangle identifiers that only partially contain parts of browser-specific methods' names") {
    "teardown-onclose" manglesTo "teardownHonclose"
  }

  private implicit class TestString(str: String) {
    def manglesTo(expected: String): Unit = { assertResult(expected)(JSIdentProvider(str)); () }
  }

}
