// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock
package ext

import
  org.nlogo.core.{ Model, View }

// Fuzzing suite for the `nw` (Network) extension.  See `ExtensionFuzzSuite` for how the docking-based fuzzing works:
// identical NetLogo code runs through headless desktop NetLogo (the oracle) and the compiled JS engine, and any
// divergence in reporter output, world state, or RNG state fails the test.  This is the only place in the Tortoise
// repo where the nw prims are checked against desktop, so it carries the parity guarantee for the whole extension.
//
// Coverage is grouped by primitive family below: per-turtle metrics, whole-graph metrics, distance/path queries,
// component/clique/community decompositions, and the graph generators.  Each block throws many randomly-generated
// graphs (or, for generators, random-but-valid parameters) at a primitive.
class TestNWFuzz extends ExtensionFuzzSuite {

  // Curated seeds that always run in CI and locally.  Promote any random seed that surfaces a real bug into this list.
  // A spread of fixed seeds is baked in (rather than relying on the volatile random runs) so failures reproduce
  // deterministically and can be triaged reliably.
  override def fixedSeeds =
    Seq(1L, 2L, 42L, 1337L, 8675309L, 20260714L, 271828L, 161803L, 999983L, 4294967311L)

  // A few extra random graphs per prim on top of the fixed seeds for local probing.  CI disables random runs entirely
  // (TORTOISE_FUZZ_NO_RANDOM), so it only ever sees the reproducible `fixedSeeds`.
  override def randomRunCount: Int = 10

  val undirectedModel = Model(code = ExtensionFuzzSuite.undirectedModelCode, widgets = List(View.square(5)))
  val directedModel   = Model(code = ExtensionFuzzSuite.directedModelCode,   widgets = List(View.square(5)))
  val generatorModel  = Model(code = ExtensionFuzzSuite.generatorModelCode,  widgets = List(View.square(5)))

  // --- reporter builders ---------------------------------------------------------------------------------------------
  //
  // Metrics are floating point, so we compare at a fixed precision to absorb last-digit IEEE-754 differences between
  // the JVM and JS math while still catching genuine algorithmic divergence.  Prims that can report `false` (an
  // unreachable target, a disconnected graph) are guarded so we never call `precision` on a boolean.

  private val digits = 6

  // A per-turtle numeric reporter, evaluated for every turtle in `who` order and reduced to a stable list.
  private def perTurtle(expr: String): String =
    s"map [ t -> [ ifelse-value is-number? ($expr) [ precision ($expr) $digits ] [ ($expr) ] ] of t ] sort turtles"

  // A single whole-graph numeric reporter.
  private def graphNum(expr: String): String =
    s"ifelse-value is-number? ($expr) [ precision ($expr) $digits ] [ ($expr) ]"

  // Desktop's Dump renders small magnitudes in scientific notation (e.g. "1.94E-4") while Tortoise renders plain
  // decimals ("0.000194").  That is an engine-wide number-formatting difference, unrelated to the nw prims, so for
  // these numeric comparisons we canonicalize every number token to a fixed plain-decimal form on both sides before
  // comparing -- otherwise a numerically-identical result would spuriously fail on formatting alone.
  private val numberToken = """-?\d+\.?\d*(?:[Ee]-?\d+)?""".r
  private def canonNums(s: String): String =
    numberToken.replaceAllIn(s, m => java.util.regex.Matcher.quoteReplacement(f"${m.matched.toDouble}%.6f"))

  private def compareNums(reporter: String)(implicit fixture: DockingFixture): Unit =
    fixture.compareMunged(reporter, canonNums, canonNums)

  // A prim that reports a list of agentsets (components/cliques/communities).  Normalize away both the ordering of the
  // sets and the ordering within each set so we compare the *partition*, not an incidental traversal order.  Note we
  // `sort` each agentset (deterministic, who-order) rather than using `[who] of set`, whose agentset iteration would
  // consume the world RNG and desync the docked RNG-state check.
  private def partition(expr: String): String =
    s"sort map [ s -> (word map [ x -> [who] of x ] sort s) ] ($expr)"

  // ===== per-turtle metrics ==========================================================================================

  test("closeness-centrality: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("closeness-centrality") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(perTurtle("nw:closeness-centrality"))
    }
  }

  test("closeness-centrality: random directed graphs") { implicit fixture => import fixture._
    openModel(directedModel, shouldAutoInstallLibs = true)
    fuzz("closeness-centrality-directed") { run =>
      buildRandomDirectedNetwork(run)
      compareNums(perTurtle("nw:closeness-centrality"))
    }
  }

  test("weighted-closeness-centrality: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("weighted-closeness-centrality") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(perTurtle("nw:weighted-closeness-centrality weight"))
    }
  }

  test("betweenness-centrality: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("betweenness-centrality") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(perTurtle("nw:betweenness-centrality"))
    }
  }

  test("betweenness-centrality: random directed graphs") { implicit fixture => import fixture._
    openModel(directedModel, shouldAutoInstallLibs = true)
    fuzz("betweenness-centrality-directed") { run =>
      buildRandomDirectedNetwork(run)
      compareNums(perTurtle("nw:betweenness-centrality"))
    }
  }

  test("eigenvector-centrality: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("eigenvector-centrality") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(perTurtle("nw:eigenvector-centrality"))
    }
  }

  test("eigenvector-centrality: random directed graphs") { implicit fixture => import fixture._
    openModel(directedModel, shouldAutoInstallLibs = true)
    fuzz("eigenvector-centrality-directed") { run =>
      buildRandomDirectedNetwork(run)
      compareNums(perTurtle("nw:eigenvector-centrality"))
    }
  }

  test("page-rank: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("page-rank") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(perTurtle("nw:page-rank"))
    }
  }

  test("page-rank: random directed graphs") { implicit fixture => import fixture._
    openModel(directedModel, shouldAutoInstallLibs = true)
    fuzz("page-rank-directed") { run =>
      buildRandomDirectedNetwork(run)
      compareNums(perTurtle("nw:page-rank"))
    }
  }

  test("clustering-coefficient: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("clustering-coefficient") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(perTurtle("nw:clustering-coefficient"))
    }
  }

  test("clustering-coefficient: random directed graphs") { implicit fixture => import fixture._
    openModel(directedModel, shouldAutoInstallLibs = true)
    fuzz("clustering-coefficient-directed") { run =>
      buildRandomDirectedNetwork(run)
      compareNums(perTurtle("nw:clustering-coefficient"))
    }
  }

  // ===== distance / path queries =====================================================================================
  //
  // Distances (BFS/Dijkstra shortest-path lengths) are deterministic, so they are a clean parity check.  The path
  // *reconstruction* prims break ties with the world RNG, so they double as an RNG-parity check between the engines.

  test("distance-to: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("distance-to") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(perTurtle("nw:distance-to turtle 0"))
    }
  }

  test("distance-to: random directed graphs") { implicit fixture => import fixture._
    openModel(directedModel, shouldAutoInstallLibs = true)
    fuzz("distance-to-directed") { run =>
      buildRandomDirectedNetwork(run)
      compareNums(perTurtle("nw:distance-to turtle 0"))
    }
  }

  test("weighted-distance-to: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("weighted-distance-to") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(perTurtle("nw:weighted-distance-to turtle 0 weight"))
    }
  }

  test("turtles-on-path-to: random undirected graphs (RNG-parity)") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("turtles-on-path-to") { run =>
      buildRandomUndirectedNetwork(run)
      compare("map [ t -> [ (word nw:turtles-on-path-to turtle 0) ] of t ] sort turtles")
    }
  }

  // `path-to` reports the *links* on a shortest path.  Desktop computes the turtle path (same successor-
  // cache forward walk as `turtles-on-path-to`, consuming the same RNG) and then converts turtles to
  // links, drawing one extra `rng.nextInt(links.size)` per hop -- even when only one link connects the
  // pair.  `word`-ing the result keeps the prim to one call per turtle (a second call would re-draw RNG
  // and desync) and renders `false`/empty uniformly on both engines.  -Jeremy B July 2026
  test("path-to: random undirected graphs (RNG-parity)") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("path-to") { run =>
      buildRandomUndirectedNetwork(run)
      compare("map [ t -> [ (word nw:path-to turtle 0) ] of t ] sort turtles")
    }
  }

  test("turtles-on-weighted-path-to: random undirected graphs (RNG-parity)") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("turtles-on-weighted-path-to") { run =>
      buildRandomUndirectedNetwork(run)
      // Like `turtles-on-path-to` but the successor cache comes from a reverse Dijkstra from the
      // destination (desktop `cachingDijkstra(reverse = true)`) instead of a reverse BFS.  Weights are
      // continuous (`1 + random-float 5`), so exact distance ties -- the only case where the successor
      // list has more than one entry and the heap's tie-break order would matter -- are effectively
      // impossible, leaving the forward walk deterministic modulo the per-hop `nextInt` draw.
      compare("map [ t -> [ (word nw:turtles-on-weighted-path-to turtle 0 weight) ] of t ] sort turtles")
    }
  }

  test("weighted-path-to: random undirected graphs (RNG-parity)") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("weighted-path-to") { run =>
      buildRandomUndirectedNetwork(run)
      // `weighted-path-to` = the reverse-Dijkstra turtle path (above) plus the per-hop `turtlesToLinks`
      // link-selection draws, exactly paralleling `path-to` vs `turtles-on-path-to`.
      compare("map [ t -> [ (word nw:weighted-path-to turtle 0 weight) ] of t ] sort turtles")
    }
  }

  // ===== whole-graph metrics =========================================================================================

  test("mean-path-length: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("mean-path-length") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(graphNum("nw:mean-path-length"))
    }
  }

  test("mean-weighted-path-length: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("mean-weighted-path-length") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(graphNum("nw:mean-weighted-path-length weight"))
    }
  }

  test("modularity: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("modularity") { run =>
      buildRandomUndirectedNetwork(run)
      // Feed a deterministic partition (the weak components) so the value depends only on graph structure.
      // Modularity is undefined (0/0) on an edge-less graph: desktop `nw:modularity` leaks `NaN` there
      // (a desktop bug -- NaN should not escape into a NetLogo value), and `precision NaN` then throws on
      // the desktop side.  NLW guards `totalArcWeight = 0` and returns 0, the more correct behavior.  So we
      // only dock modularity when the graph actually has links; on edge-less graphs both sides report 0 and
      // the degenerate NaN path is never taken.  A language test in `../NW-Extension/tests.txt` records the
      // desktop NaN leak for the NW maintainers to fix.  -Jeremy B July 2026
      compareNums("ifelse-value (count uedges > 0) [ precision (nw:modularity nw:weak-component-clusters) 6 ] [ 0 ]")
    }
  }

  // The weak-component partition above can never have a link crossing a community boundary, so it leaves the
  // `totalIn`/`totalOut` bookkeeping for boundary links unchecked -- that gap hid a real bug.  Partitioning on
  // `who mod 2` is an arbitrary split that puts links across the boundary for essentially any random graph, which is
  // also what real usage (hand-built partitions, louvain output) looks like.  Both parities are docked because
  // desktop counts an undirected boundary link once via `outEdges` and once via `inEdges`, while a directed one is
  // counted only from the end that owns it.  -Jeremy B July 2026
  private def modularityOfParity(edgeBreed: String): String =
    s"ifelse-value (count $edgeBreed > 0) " +
    "[ precision (nw:modularity (list turtles with [ who mod 2 = 0 ] turtles with [ who mod 2 = 1 ])) 6 ] [ 0 ]"

  test("modularity: arbitrary partition with crossing links, random undirected graphs") { implicit fixture =>
    import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("modularity-crossing") { run =>
      buildRandomUndirectedNetwork(run)
      compareNums(modularityOfParity("uedges"))
    }
  }

  test("modularity: arbitrary partition with crossing links, random directed graphs") { implicit fixture =>
    import fixture._
    openModel(directedModel, shouldAutoInstallLibs = true)
    fuzz("modularity-crossing-directed") { run =>
      buildRandomDirectedNetwork(run)
      compareNums(modularityOfParity("dedges"))
    }
  }

  // ===== components / cliques / communities ==========================================================================

  test("weak-component-clusters: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("weak-component-clusters") { run =>
      buildRandomUndirectedNetwork(run)
      compare(partition("nw:weak-component-clusters"))
    }
  }

  test("bicomponent-clusters: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("bicomponent-clusters") { run =>
      buildRandomUndirectedNetwork(run)
      compare(partition("nw:bicomponent-clusters"))
    }
  }

  test("maximal-cliques: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("maximal-cliques") { run =>
      buildRandomUndirectedNetwork(run)
      compare(partition("nw:maximal-cliques"))
    }
  }

  test("biggest-maximal-cliques: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("biggest-maximal-cliques") { run =>
      buildRandomUndirectedNetwork(run)
      compare(partition("nw:biggest-maximal-cliques"))
    }
  }

  // ===== generators ==================================================================================================
  //
  // Generators are docked at the command level: `testCommand` runs the build in both engines and the harness compares
  // full world state and RNG state, so an identical structure (down to who-order, coordinates, and RNG position) is
  // required to pass.  The structural generators (ring/star/wheel/lattice) are deterministic; the random ones
  // (random/preferential-attachment/watts-strogatz/small-world) additionally exercise RNG parity.

  // Runs a generator built from `commandOf(n)` for random-but-valid sizes, docking each build.
  private def fuzzGenerator(model: Model, label: String, minN: Int, spread: Int)
                           (commandOf: Int => String)
                           (implicit fixture: DockingFixture): Unit = {
    import fixture._
    openModel(model, shouldAutoInstallLibs = true)
    fuzz(label) { run =>
      val nlSeed = run.rng.nextInt()
      val n      = run.rng.nextInt(spread) + minN
      testCommand("clear-all")
      testCommand(s"random-seed $nlSeed")
      testCommand(commandOf(n))
    }
  }

  test("generate-ring: random sizes") { implicit fixture =>
    fuzzGenerator(generatorModel, "generate-ring", minN = 3, spread = 10)(n => s"nw:generate-ring turtles links $n [ ]")
  }

  test("generate-star: random sizes") { implicit fixture =>
    fuzzGenerator(generatorModel, "generate-star", minN = 1, spread = 12)(n => s"nw:generate-star turtles links $n [ ]")
  }

  test("generate-wheel: random sizes") { implicit fixture =>
    fuzzGenerator(generatorModel, "generate-wheel", minN = 4, spread = 10)(n => s"nw:generate-wheel turtles links $n [ ]")
  }

  test("generate-wheel-inward: random sizes") { implicit fixture =>
    fuzzGenerator(generatorModel, "generate-wheel-inward", minN = 4, spread = 10)(n => s"nw:generate-wheel-inward turtles dedges $n [ ]")
  }

  test("generate-wheel-outward: random sizes") { implicit fixture =>
    fuzzGenerator(generatorModel, "generate-wheel-outward", minN = 4, spread = 10)(n => s"nw:generate-wheel-outward turtles dedges $n [ ]")
  }

  // NOTE: `nw:generate-lattice-2d` and `nw:generate-small-world` (Kleinberg) are deliberately only *structurally*
  // equivalent to desktop, not bit/RNG-equivalent, because we chose not to re-implement the JUNG library's exact
  // algorithms.  This docking harness always compares full world *and* RNG state (even `compare` does), so those two
  // can't be validated here without a structural-only comparison the fixture doesn't currently support.  They are
  // intentionally omitted rather than left as guaranteed failures.

  test("generate-random: random sizes and probabilities") { implicit fixture => import fixture._
    openModel(generatorModel, shouldAutoInstallLibs = true)
    fuzz("generate-random") { run =>
      val nlSeed = run.rng.nextInt()
      val n      = run.rng.nextInt(maxTurtles) + 1
      val prob   = run.rng.nextDouble()
      testCommand("clear-all")
      testCommand(s"random-seed $nlSeed")
      testCommand(f"nw:generate-random turtles links $n%d $prob%.4f [ ]")
    }
  }

  test("generate-preferential-attachment: random sizes") { implicit fixture => import fixture._
    openModel(generatorModel, shouldAutoInstallLibs = true)
    fuzz("generate-preferential-attachment") { run =>
      val nlSeed    = run.rng.nextInt()
      val minDegree = run.rng.nextInt(3) + 1
      val n         = minDegree + 1 + run.rng.nextInt(maxTurtles) // must exceed min-degree
      testCommand("clear-all")
      testCommand(s"random-seed $nlSeed")
      testCommand(s"nw:generate-preferential-attachment turtles links $n $minDegree [ ]")
    }
  }

  test("generate-watts-strogatz: random sizes") { implicit fixture => import fixture._
    openModel(generatorModel, shouldAutoInstallLibs = true)
    fuzz("generate-watts-strogatz") { run =>
      val nlSeed = run.rng.nextInt()
      val n      = run.rng.nextInt(10) + 6              // keep a few nodes so a valid neighborhood exists
      val maxNbr = math.max(1, math.ceil(n / 2.0 - 1).toInt)
      val nbr    = run.rng.nextInt(maxNbr) + 1
      val rewire = run.rng.nextDouble()
      testCommand("clear-all")
      testCommand(s"random-seed $nlSeed")
      testCommand(f"nw:generate-watts-strogatz turtles links $n%d $nbr%d $rewire%.4f [ ]")
    }
  }

  // A neighborhood size of 0 is legal for any node count (and is the *only* legal value when n is 2), but the fuzz
  // above always picks at least 1, which left the empty-ring case untested.  Desktop's `(1 to 0)` is empty, so this
  // must produce turtles with no links and no RNG draws at all -- the rewire probability is still varied to prove no
  // draws are consumed, since the docking fixture compares RNG state.  -Jeremy B July 2026
  test("generate-watts-strogatz: zero neighborhood size") { implicit fixture => import fixture._
    openModel(generatorModel, shouldAutoInstallLibs = true)
    fuzz("generate-watts-strogatz-zero-neighborhood") { run =>
      val nlSeed = run.rng.nextInt()
      val n      = run.rng.nextInt(6) + 2 // n of 2 admits only a neighborhood size of 0
      val rewire = run.rng.nextDouble()
      testCommand("clear-all")
      testCommand(s"random-seed $nlSeed")
      testCommand(f"nw:generate-watts-strogatz turtles links $n%d 0 $rewire%.4f [ ]")
    }
  }

}
