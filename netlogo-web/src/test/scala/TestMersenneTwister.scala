// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import org.scalatest.fixture.FunSuite

class BrowserSuite extends FunSuite with TestLogger {

  class BrowserFixture(val eval: (String) => AnyRef)

  nashorn.eval(   "Random = new tortoise_require('shim/engine-scala').MersenneTwisterFast()")
  nashorn.eval("AuxRandom = new tortoise_require('shim/engine-scala').MersenneTwisterFast()")

  override type FixtureParam = BrowserFixture

  override def withFixture(test: OneArgTest) = {
    val fixture = new BrowserFixture(nashorn.eval)
    loggingFailures(suiteName, test.name, {
      val outcome = withFixture(test.toNoArgTest(fixture))
      if (outcome.isFailed || outcome.isExceptional) {
        testFailed(this.getClass.getName, test.name)
      }
      outcome
    })
  }

}

class TestMersenneTwister extends BrowserSuite {

  test("setSeed") { implicit fixture =>
    val result = fixture.eval("Random.setSeed(10); Random.nextInt()")
    assert((1 to 10).map(_ => fixture.eval("Random.setSeed(10); Random.nextInt()")).forall(_ == result))
    assert((1 to 10).map(_ => fixture.eval("Random.nextInt()")).forall(_ != result))
    assert(fixture.eval("Random.setSeed(11); Random.nextInt()") != result)
  }

  // Begun, this clone war has....
  test("clone") { implicit fixture =>

    val f = (name: String) => fixture.eval(s"$name.nextInt()")

    fixture.eval("Random.setSeed(10)")
    fixture.eval("var clone1 = Random.clone()")
    fixture.eval("var clone2 = clone1.clone()")
    fixture.eval("var clone3 = clone2.clone()")
    fixture.eval("var clone4 = Random.clone()")

    val rngs = Seq("Random", "clone1", "clone2", "clone3", "clone4")
    (1 to 1000).foreach(_ => assert(rngs.map(f).distinct.size == 1))

    fixture.eval("Random.setSeed(11)")
    val Seq(resultR, result1, result2, result3, result4) = rngs.map(f)

    assert(Seq(result1, result2, result3, result4).distinct.size == 1)
    assert(resultR != result1)

  }

  test("load/save/nextInt/nextDouble/nextGaussian") { implicit fixture =>

    fixture.eval("var clone = undefined")

    Seq("nextInt()", "nextInt(1000)", "nextDouble()", "nextGaussian()") foreach {
      fCall =>

        fixture.eval("clone = Random.clone()")
        fixture.eval("var initialState = clone.save()")

        assert(fixture.eval("initialState") == fixture.eval("clone.save()"))

        val call = s"clone.$fCall"

        val result = fixture.eval(call)

        val restoreState    = () => fixture.eval("clone.load(initialState)")
        val assertSameState = () => assert(result == fixture.eval(call))
        val assertDiffState = () => assert(result != fixture.eval(call))

        restoreState()
        assertSameState()

        restoreState()
        assertSameState()

        restoreState()
        fixture.eval("clone.setSeed(1501)")
        assertDiffState()

        restoreState()
        assertSameState()

        for (_ <- 1 to 10)
          fixture.eval(call)

        restoreState()
        assertSameState()

    }




  }

}
