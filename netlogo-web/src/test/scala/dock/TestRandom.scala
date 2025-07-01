// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import
  org.scalacheck.Gen

import
  org.scalatestplus.scalacheck.ScalaCheckDrivenPropertyChecks

import
  org.nlogo.headless.test.Command

class TestRandom extends DockingSuite with ScalaCheckDrivenPropertyChecks {

  testRandomnessPrim("random",             "10000")
  testRandomnessPrim("random-exponential", "10000")
  testRandomnessPrim("random-float",       "10000")
  testRandomnessPrim("random-normal",      "10000 10000")
  testRandomnessPrim("random-poisson",     "10000")

  private def testRandomnessPrim(primName: String, args: String): Unit =
    test(primName) { implicit fixture => import fixture._
      forAll(Gen.oneOf(1 to 10000)) {
        seed =>
          runCommand(Command(s"random-seed $seed"))
          for (_ <- 1 to 10)
            compare(s"$primName $args")
      }
    }

}
