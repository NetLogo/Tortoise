// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock
package ext

import
  org.nlogo.core.{ Model, View }

// Fuzzing suite for the `nw` (Network) extension.  See `ExtensionFuzzSuite` for how the docking-based fuzzing works.
//
// This is currently a single sample primitive proving the harness end-to-end; the remaining nw primitives (radius,
// distance/path, other centralities, clustering/communities, generators, and eventually the file-based save/load prims)
// slot in as additional `test`/`fuzz` blocks against the same or similar models.
class TestNWFuzz extends ExtensionFuzzSuite {

  // Curated seeds that always run in CI and locally.  Promote any random seed that surfaces a real bug into this list.
  override def fixedSeeds = Seq(1L, 2L, 42L, 1337L)

  val undirectedModel = Model(
    code    = ExtensionFuzzSuite.undirectedModelCode
  , widgets = List(View.square(3))
  )

  // Centralities are floating point, so we compare at a fixed precision to absorb last-digit IEEE-754 differences
  // between the JVM and JS math while still catching any genuine algorithmic divergence.
  test("closeness-centrality: random undirected graphs") { implicit fixture => import fixture._
    openModel(undirectedModel, shouldAutoInstallLibs = true)
    fuzz("closeness-centrality") { run =>
      buildRandomUndirectedNetwork(run)
      compare("map [ t -> [ precision nw:closeness-centrality 6 ] of t ] sort turtles")
    }
  }

}
