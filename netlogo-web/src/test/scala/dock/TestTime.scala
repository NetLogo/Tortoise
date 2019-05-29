// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import
  org.scalacheck.Gen

import
  org.scalatestplus.scalacheck.ScalaCheckDrivenPropertyChecks

class TestTime extends SimpleSuite with ScalaCheckDrivenPropertyChecks {

  test("date-and-time format") {
    fixture =>

      val DateRegex = raw"""(\d\d):(\d\d):(\d\d)\.(\d\d\d) (?:AM|PM) (\d\d)-([A-Z][a-z][a-z])-(2\d\d\d)""".r
      val months    = Set("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

      forAll(Gen.delay(Gen.const(fixture.evaluate("date-and-time")))) {
        time =>

          val timeStr = time.toString
          assert(DateRegex.pattern.matcher(timeStr).matches(),
                 s"'$timeStr' didn't meet expected format of 'hh:mm:ss.SSS a dd-MMM-yyyy'")

          val DateRegex(hours, minutes, seconds, millis, date, month, year) = timeStr

          assertWithinRange(hours.  toInt, 1,    12)
          assertWithinRange(minutes.toInt, 0,    59)
          assertWithinRange(seconds.toInt, 0,    59)
          assertWithinRange(millis. toInt, 0,    999)
          assertWithinRange(date.   toInt, 1,    31)
          assertWithinRange(year.   toInt, 2015, 2999)

          assert(months(month), s"Value '$month' is not within '$months'")

      }

  }

  private def assertWithinRange[T](x: => T, min: T, max: T)(implicit ev: Numeric[T]): Unit = {
    assert(ev.lteq(x, max) && ev.gteq(x, min), s"$x is not within the range [$min, $max].")
    ()
  }

}
