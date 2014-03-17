// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise
package dock

import org.nlogo.util.SlowTest

// each model gets its own suite, since currently it's not easy
// to get sbt+ScalaTest to run just a single test - ST 3/16/14

class TestFirefliesModel extends DockingSuite with SlowTest {
  test("fireflies") { implicit fixture => import fixture._
    open("models/Sample Models/Biology/Fireflies.nlogo")
    testCommand("resize-world -10 10 -10 10")
    testCommand("set number 150")
    testCommand("setup")
    for (_ <- 1 to 20)
      testCommand("go")
  }
}

class TestWolfModel extends DockingSuite with SlowTest {
  test("wolf no grass") { implicit fixture => import fixture._
    open("models/Sample Models/Biology/Wolf Sheep Predation.nlogo")
    testCommand("set grass? false")
    testCommand("setup")
    testCommand("repeat 40 [ go ]")
    testCommand("output-print count wolves output-print count sheep output-print grass")
  }
  test("wolf grass") { implicit fixture => import fixture._
    open("models/Sample Models/Biology/Wolf Sheep Predation.nlogo")
    testCommand("set grass? true")
    testCommand("setup")
    testCommand("repeat 10 [ go ]")
    testCommand("output-print count wolves output-print count sheep output-print grass")
  }
}

class TestTermitesModel extends DockingSuite with SlowTest {
  test("termites") { implicit fixture => import fixture._
    open("models/test/tortoise/Termites.nlogo")
    testCommand("setup")
    for (_ <- 1 to 20)
      testCommand("go")
  }
}

class TestBoilingModel extends DockingSuite with SlowTest {
  test("boiling") { implicit fixture => import fixture._
    open("models/Sample Models/Chemistry & Physics/Heat/Boiling.nlogo")
    testCommand("setup")
    for (_ <- 1 to 5)
      testCommand("go")
  }
}

class TestRopeModel extends DockingSuite with SlowTest {
  test("rope") { implicit fixture => import fixture._
    open("models/Sample Models/Chemistry & Physics/Waves/Rope.nlogo")
    testCommand("setup")
    for (_ <- 1 to 10)
      testCommand("go")
  }
}

class TestSandpileModel extends DockingSuite with SlowTest {
  test("sandpile random") { implicit fixture => import fixture._
    open("models/test/tortoise/Sandpile.nlogo")
    testCommand("setup-random")
    // this takes a while on Rhino, but it probably isn't a good test unless we run the
    // model for long enough for good avalanches to get going - ST 10/10/13
    for (_ <- 1 to 100)
      testCommand("go")
    compare("total")
    compare("sizes")
    compare("lifetimes")
  }
  test("sandpile uniform") { implicit fixture => import fixture._
    open("models/test/tortoise/Sandpile.nlogo")
    testCommand("setup-uniform 0")
    for (_ <- 1 to 10)
      testCommand("go")
    compare("total")
    compare("sizes")
    compare("lifetimes")
  }
}

class TestDLASimpleModel extends DockingSuite with SlowTest {
  test("dla simple") { implicit fixture => import fixture._
    open("models/Sample Models/Chemistry & Physics/Diffusion Limited Aggregation/DLA Simple.nlogo")
    testCommand("resize-world -20 20 -20 20")
    testCommand("setup")
    testCommand("set num-particles 100")
    for (_ <- 1 to 25)
      testCommand("go")
  }
}

class TestFireModel extends DockingSuite with SlowTest {
  test("fire") { implicit fixture => import fixture._
    open("models/Sample Models/Earth Science/Fire.nlogo")
    testCommand("setup")
    for (_ <- 1 to 10)
      testCommand("go")
  }
}

class TestLifeModel extends DockingSuite with SlowTest {
  test("life") { implicit fixture => import fixture._
    open("models/test/tortoise/Life Simple.nlogo")
    testCommand("setup")
    for (_ <- 1 to 30)
      testCommand("go")
    testCommand("""ask patches [output-print (word self " -> " living?) ]""")
  }
}

class TestLifeTurtleBasedModel extends DockingSuite with SlowTest {
  test("life") { implicit fixture => import fixture._
    open("models/test/tortoise/Life Turtle-Based.nlogo")
    testCommand("resize-world -10 10 -10 10")
    testCommand("setup-random")
    for (_ <- 1 to 10)
      testCommand("go")
  }
}

class TestClimateModel extends DockingSuite with SlowTest {
  test("climate") { implicit fixture => import fixture._
    open("models/Sample Models/Earth Science/Climate Change.nlogo")
    testCommand("setup")
    testCommand("add-cloud")
    testCommand("add-cloud")
    for (_ <- 1 to 10)
      testCommand("add-CO2")
    testCommand("remove-cloud")
    testCommand("add-cloud")
    for (_ <- 1 to 10) {
      testCommand("add-CO2")
      testCommand("go")
      testCommand("remove-CO2")
    }
    testCommand("remove-cloud")
    // unfortunately this takes quite a while on Rhino, but it isn't a good test unless we run the
    // model for long enough for the turtles to start interacting with each other and with the world
    // boundaries - ST 10/10/13
    for (_ <- 1 to 4)
      testCommand("repeat 50 [ go ]")
    compare("temperature")
  }
}

class TestMembraneModel extends DockingSuite with SlowTest {
  test("membrane") { implicit fixture => import fixture._
    open("models/Sample Models/Biology/Membrane Formation.nlogo")
    testCommand("resize-world -10 10 -10 10 set num-lipids 50 set num-water 150")
    testCommand("set num-lipids 50")
    testCommand("set num-water 50")
    testCommand("setup")
    testCommand("repeat 15 [ go ]")
  }
}

class TestSlimeModel extends DockingSuite with SlowTest {
  test("slime") { implicit fixture => import fixture._
    open("models/Sample Models/Biology/Slime.nlogo")
    testCommand("resize-world -10 10 -10 10")
    testCommand("set population 30")
    testCommand("setup")
    for (_ <- 1 to 10)
      testCommand("go")
  }
}

class TestVotingModel extends DockingSuite with SlowTest {
  test("voting") { implicit fixture => import fixture._
    open("models/Sample Models/Social Science/Voting.nlogo")
    testCommand("resize-world -10 10 -10 10")
    testCommand("setup")
    for (_ <- 1 to 10)
      testCommand("go")
  }
}

class TestPrefAttachModel extends DockingSuite with SlowTest {
  test("pref attach") { implicit fixture => import fixture._
    open("models/Sample Models/Networks/Preferential Attachment.nlogo")
    testCommand("resize-world -10 10 -10 10")
    testCommand("setup")
    testCommand("repeat 20 [ go ]")
    testCommand("resize-nodes")
    compare("[ size ] of turtles")
    testCommand("repeat 20 [ go ]")
    testCommand("resize-nodes")
    compare("[ size ] of turtles")
    testCommand("resize-nodes")
    compare("[ size ] of turtles")
  }
}

class TestVantsModel extends DockingSuite with SlowTest {
  test("vants") { implicit fixture => import fixture._
    open("models/test/tortoise/Vants.nlogo")
    testCommand("setup")
    for (_ <- 1 to 10)
      testCommand("go-forward")
    for (_ <- 1 to 10)
      testCommand("go-reverse")
  }
}

class TestVirusModel extends DockingSuite with SlowTest {
  test("Virus") { implicit fixture => import fixture._
    open("models/Sample Models/Biology/Virus.nlogo")
    testCommand("setup")
    for (_ <- 1 to 50)
      testCommand("go")
  }
}

class TestFollowerModel extends DockingSuite with SlowTest {
  test("Follower") { implicit fixture => import fixture._
    open("models/Sample Models/Art/Follower.nlogo")
    testCommand("setup")
    for (_ <- 1 to 25)
      testCommand("go")
  }
}

class TestLinkLatticeModel extends DockingSuite with SlowTest {
  test("Link Lattice Example") { implicit fixture => import fixture._
    open("models/Code Examples/Link Lattice Example.nlogo")
    testCommand("resize-world -6 6 -6 6")
    testCommand("setup-square")
    testCommand("setup-hex")
  }
}

class TestBenchmarks extends DockingSuite with SlowTest {
  test("Ants Benchmark") { implicit fixture => import fixture._
    open("models/test/benchmarks/Ants Benchmark.nlogo")
    testCommand("setup")
    testCommand("repeat 10 [ go ]")
    testCommand("ask turtle 0 [ move-to one-of patches with [shade-of? pcolor blue] ]")
    testCommand("repeat 10 [ go ]")
  }
  test("Bureaucrats Benchmark") { implicit fixture => import fixture._
    open("models/test/benchmarks/Bureaucrats Benchmark.nlogo")
    testCommand("setup")
    testCommand("repeat 50 [ go ]")
  }
  test("BZ Benchmark") { implicit fixture => import fixture._
    open("models/test/benchmarks/BZ Benchmark.nlogo")
    testCommand("resize-world -20 20 -20 20")
    testCommand("setup")
    testCommand("repeat 5 [ go ]")
  }
}
