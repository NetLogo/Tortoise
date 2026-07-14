// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock
package ext

import
  org.scalatest.exceptions.TestFailedException

import
  scala.util.Random

// Base for extension "fuzzing" suites.  These build on the docking fixture: identical NetLogo code is run through both
// headless desktop NetLogo (the oracle) and the compiled JS engine, and any divergence in world state, RNG state, or
// reporter output fails the test.  Because desktop *defines* correctness here, we can throw many randomly-generated
// inputs at a primitive without having to author expected values by hand.
//
// Seeding strategy (see `fuzz`):
//   - `fixedSeeds` always run, in CI and locally.  These are the regression guarantee; CI can only ever break on them.
//     Widen the net by adding seeds to the list.
//   - A handful of additional *random* seeds run by default, giving local development extra coverage every run.  They
//     are disabled when the `TORTOISE_FUZZ_NO_RANDOM` environment variable is set (CI does this), so an unrelated fuzz
//     hit can never break a deploy.
//
// Adding another extension is: subclass this, provide `fixedSeeds`, declare a model, and write `fuzz` blocks that call
// the primitives.  The generators and seed management here are extension-agnostic.
trait ExtensionFuzzSuite extends DockingSuite {

  // How many extra randomly-seeded runs to perform on top of `fixedSeeds`.  Override to fuzz harder locally.
  protected def randomRunCount: Int = 4

  // Seeds that always run, in CI and locally.  These are the only seeds CI can break on, so keep them curated:
  // when a random run surfaces a real divergence, promote its seed into this list to lock in the regression.
  protected def fixedSeeds: Seq[Long]

  private val randomDisabled: Boolean =
    sys.env.get("TORTOISE_FUZZ_NO_RANDOM").exists(_.trim.nonEmpty)

  // Carries the per-run seed and a seeded RNG used to *generate* the NetLogo setup (turtle counts, wiring, etc.).
  // Note this RNG is separate from NetLogo's own RNG: the generated model additionally calls `random-seed`, so the two
  // engines build identical graphs and the docking RNG-parity check stays meaningful.
  final case class FuzzRun(seed: Long, rng: Random, isRandom: Boolean)

  // Runs `body` once per fixed seed, then (unless disabled) once per random seed.  A failure on a random seed is
  // re-thrown with guidance: how to reproduce it, and a reminder that it is likely a *separate* issue from whatever the
  // developer is currently working on and should be triaged on its own rather than treated as "my change broke this".
  protected def fuzz(label: String)(body: FuzzRun => Unit): Unit = {
    val randomSeeds =
      if (randomDisabled) Seq.empty[Long]
      else Seq.fill(randomRunCount)(Random.nextLong())

    for (seed <- fixedSeeds)
      runOne(label, FuzzRun(seed, new Random(seed), isRandom = false), body)

    for (seed <- randomSeeds)
      runOne(label, FuzzRun(seed, new Random(seed), isRandom = true), body)
  }

  private def runOne(label: String, run: FuzzRun, body: FuzzRun => Unit): Unit =
    try body(run)
    catch {
      case ex: TestFailedException if run.isRandom =>
        throw new TestFailedException(randomFailureMessage(label, run.seed, ex.getMessage), 0)
    }

  private def randomFailureMessage(label: String, seed: Long, original: String): String =
    s"""|[$label] fuzz failure on RANDOM seed $seed.
        |
        |This came from a randomly-seeded fuzz run, so it may be UNRELATED to the change you are working on.
        |Prefer logging/triaging it as its own issue rather than assuming your current work caused it.
        |
        |To reproduce deterministically, add $seed to this suite's `fixedSeeds` and re-run.
        |To skip random runs entirely (e.g. to unblock unrelated work), set TORTOISE_FUZZ_NO_RANDOM=1.
        |
        |Original failure:
        |$original""".stripMargin

  // ----- Graph generators ---------------------------------------------------------------------------------------
  //
  // These emit runtime NetLogo commands (via the docking fixture's `testCommand`) that build a random network.  They
  // assume the model already declares `extensions [nw]`, the relevant link breeds, and a `weight` link variable; see
  // `ExtensionFuzzSuite.undirectedModelCode` / `directedModelCode` for the expected declarations.
  //
  // Every build starts with `clear-all` + `random-seed`, so successive fuzz iterations within one test are independent
  // and both engines stay in lock-step.

  protected val maxTurtles: Int = 12

  // Builds a random undirected network using the `uedges` breed, with random positive `weight`s on the links.
  protected def buildRandomUndirectedNetwork(run: FuzzRun)(implicit fixture: DockingFixture): Unit = {
    import fixture._
    // NetLogo's `random-seed` literal must fit in its integer range, so derive an int-sized seed for the model rather
    // than reusing the (possibly huge) generator seed.  It stays reproducible because it comes from the seeded RNG.
    val nlSeed = run.rng.nextInt()
    val n      = run.rng.nextInt(maxTurtles) + 1
    testCommand("clear-all")
    testCommand(s"random-seed $nlSeed")
    testCommand(s"create-turtles $n [ setxy random-xcor random-ycor ]")
    // each turtle links to a random subset of the others; overlapping requests are harmless (link already exists)
    testCommand("ask turtles [ create-uedges-with n-of (random count other turtles) other turtles ]")
    testCommand("ask uedges [ set weight (1 + random-float 5) ]")
  }

  // Builds a random directed network using the `dedges` breed, with random positive `weight`s on the links.  The
  // directed analogue of `buildRandomUndirectedNetwork`; see `ExtensionFuzzSuite.directedModelCode` for declarations.
  protected def buildRandomDirectedNetwork(run: FuzzRun)(implicit fixture: DockingFixture): Unit = {
    import fixture._
    val nlSeed = run.rng.nextInt()
    val n      = run.rng.nextInt(maxTurtles) + 1
    testCommand("clear-all")
    testCommand(s"random-seed $nlSeed")
    testCommand(s"create-turtles $n [ setxy random-xcor random-ycor ]")
    // each turtle points a directed edge at a random subset of the others (out-links)
    testCommand("ask turtles [ create-dedges-to n-of (random count other turtles) other turtles ]")
    testCommand("ask dedges [ set weight (1 + random-float 5) ]")
  }
}

object ExtensionFuzzSuite {

  // Declarations a suite's model needs for the undirected generator above.
  val undirectedModelCode: String =
    """|extensions [nw]
       |undirected-link-breed [uedges uedge]
       |uedges-own [weight]
       |""".stripMargin

  // Declarations a suite's model needs for the directed generator above.
  val directedModelCode: String =
    """|extensions [nw]
       |directed-link-breed [dedges dedge]
       |dedges-own [weight]
       |""".stripMargin

  // Declarations for the structural/random generators, which build into the built-in `links` (undirected) and the
  // `dedges` breed (used by the directed wheel generators).
  val generatorModelCode: String =
    """|extensions [nw]
       |directed-link-breed [dedges dedge]
       |""".stripMargin

}
