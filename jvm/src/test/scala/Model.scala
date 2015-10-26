// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

case class Model(
    path: String,
    variation: String = "",
    dimensions: Option[(Int, Int, Int, Int)] = None,
    setup: String = "setup",
    go: String = "go",
    repetitions: Int,
    metrics: Seq[String] = Seq()) {
  def filename = new java.io.File(path).getName.stripSuffix(".nlogo")
  def name =
    if (variation.isEmpty)
      filename
    else
      s"$filename (${variation})"
}

object Model {
  // benchmarks, then Code Examples, then Sample Models
  val models = Seq[Model](
    Model(
      path = "models/test/benchmarks/Ants Benchmark.nlogo",
      dimensions = Some((-20, 20, -20, 20)),
      repetitions = 3,
      go =
        "repeat 10 [ go ] " +
        "ask turtle 0 [ move-to one-of patches with [shade-of? pcolor blue] ]"
    ),
    Model(
      path = "models/test/benchmarks/Bureaucrats Benchmark.nlogo",
      dimensions = Some((0, 29, 0, 29)),
      repetitions = 200
    ),
    Model(
      path = "models/test/benchmarks/BZ Benchmark.nlogo",
      dimensions = Some((-20, 20, -20, 20)),
      repetitions = 5
    ),
    Model(
      path = "models/test/benchmarks/Heatbugs Benchmark.nlogo",
      dimensions = Some((0, 19, 0, 19)),
      repetitions = 10
    ),
    Model(
      path = "models/test/benchmarks/GasLabCirc Benchmark.nlogo",
      dimensions = Some((-20, 20, -20, 20)),
      setup = "set number 50  setup",
      repetitions = 50
    ),
    Model(
      path = "models/Sample Models/Networks/Diffusion on a Directed Network.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/test/benchmarks/GasLabNew Benchmark.nlogo",
      repetitions = 25
    ),
    Model(
      path = "models/test/benchmarks/CA1D Benchmark.nlogo",
      dimensions = Some((-9, 9, -4, 4)),
      setup = "setup-random",
      repetitions = 20
    ),
    Model(
      path = "models/test/benchmarks/GridWalk Benchmark.nlogo",
      dimensions = Some((-10, 10, -10, 10)),
      repetitions = 20
    ),
    Model(
      path = "models/Code Examples/Link Breeds Example.nlogo",
      dimensions = Some((-6, 6, -6, 6)),
      repetitions = 0
    ),
    Model(
      path = "models/Code Examples/Link Lattice Example.nlogo",
      dimensions = Some((-6, 6, -6, 6)),
      setup = "setup-square",
      repetitions = 1,
      go = "setup-hex"
    ),
    Model(
      path = "models/Code Examples/State Machine Example.nlogo",
      dimensions = Some((-19, 19, -19, 19)),
      setup = "set number 100  setup",
      repetitions = 100
    ),
    Model(
      path = "models/Code Examples/Tie System Example.nlogo",
      repetitions = 20,
      go = "ask suns [ rt 1 ] tick ask suns [ rt 1 ] tick ask suns [ fd 0.1 ] tick"
    ),
    Model(
      path = "models/Code Examples/Box Drawing Example.nlogo",
      setup = "set edge 2",
      go = "setup-corner",
      repetitions = 1
    ),
    Model(
      path = "models/Sample Models/Biology/Fireflies.nlogo",
      dimensions = Some((-10, 10, -10, 10)),
      setup = "set number 150  setup",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Wolf Sheep Predation.nlogo",
      variation = "no grass, no labels",
      setup = "set grass? true  setup",
      repetitions = 10,
      metrics = Seq("count wolves", "count sheep", "grass")
    ),
    Model(
      path = "models/Sample Models/Biology/Wolf Sheep Predation.nlogo",
      variation = "grass, labels",
      setup = "set grass? true  set show-energy? true  setup",
      repetitions = 10,
      metrics = Seq("count wolves", "count sheep", "grass")
    ),
    Model(
      path = "models/test/benchmarks/Wolf Benchmark.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Heat/Boiling.nlogo",
      dimensions = Some((-15, 15, -15, 15)),
      repetitions = 5
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Waves/Rope.nlogo",
      dimensions = Some((0, 40, -20, 20)),
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Sandpile.nlogo",
      variation = "random",
      dimensions = Some((-15, 15, -15, 15)),
      setup = """setup-random  set drop-location "center"""",
      repetitions = 100,
      metrics = Seq("total", "sizes", "lifetimes")
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Sandpile.nlogo",
      variation = "uniform",
      dimensions = Some((-15, 15, -15, 15)),
      setup = """setup-uniform 0  set drop-location "center"""",
      repetitions = 100,
      metrics = Seq("total", "sizes", "lifetimes")
    ),
    Model(
      path = "models/IABM Textbook/chapter 3/DLA Extensions/DLA Simple.nlogo",
      dimensions = Some((-20, 20, -20, 20)),
      setup = "setup   set num-particles 100",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Earth Science/Fire.nlogo",
      dimensions = Some((-19, 19, -19, 19)),
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Computer Science/Cellular Automata/Life.nlogo",
      dimensions = Some((-15, 15, -15, 15)),
      setup = "setup-random",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Computer Science/Cellular Automata/Life Turtle-Based.nlogo",
      dimensions = Some((-15, 15, -15, 15)),
      setup = "setup-random",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Earth Science/Climate Change.nlogo",
      setup =
        "setup add-cloud add-cloud " +
        "repeat 10 [ add-CO2 ] " +
        "remove-cloud add-cloud " +
        "repeat 10 [ add-CO2 go remove-CO2 ] " +
        "remove-cloud",
      // unfortunately this takes quite a while on Nashorn, but it isn't a good test unless we run the
      // model for long enough for the turtles to start interacting with each other and with the world
      // boundaries - ST 10/10/13
      repetitions = 4,
      go = "repeat 50 [ go ]",
      metrics = Seq("temperature")
    ),
    Model(
      path = "models/Sample Models/Biology/Membrane Formation.nlogo",
      dimensions = Some((-10, 10, -10, 10)),
      setup = "set num-lipids 40 set num-water 100  setup",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Biology/Slime.nlogo",
      dimensions = Some((-10, 10, -10, 10)),
      setup = "set population 30  setup",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Social Science/Voting.nlogo",
      dimensions = Some((-10, 10, -10, 10)),
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Networks/Preferential Attachment.nlogo",
      dimensions = Some((-10, 10, -10, 10)),
      repetitions = 20,
      go = "go  resize-nodes",
      metrics = Seq("[size] of turtles")
    ),
    Model(
      path = "models/Sample Models/Computer Science/Vants.nlogo",
      dimensions = Some((-25, 25, -25, 25)),
      repetitions = 1,
      go =
        "repeat 10 [ go-forward ] " +
        "repeat 10 [ go-reverse ]"
    ),
    Model(
      path = "models/Sample Models/Biology/Virus.nlogo",
      repetitions = 40
    ),
    Model(
      path = "models/Sample Models/Art/Follower.nlogo",
      dimensions = Some((-15, 15, -15, 15)),
      setup = "set population 500  setup",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/GasLab/GasLab Free Gas.nlogo",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Biology/AIDS.nlogo",
      repetitions = 100
    ),
    Model(
      path = "models/Sample Models/Earth Science/Erosion.nlogo",
      dimensions = Some((-12, 12, -12, 12)),
      repetitions = 100
    ),
    Model(
      path = "models/Sample Models/Social Science/Segregation.nlogo",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Social Science/Wealth Distribution.nlogo",
      repetitions = 30
    ),
    Model(
      path = "models/Sample Models/Social Science/Traffic Basic.nlogo",
      repetitions = 50
    ),
    Model(
      path = "models/Sample Models/Biology/Flocking.nlogo",
      repetitions = 50
    ),
    Model(
      path = "models/Sample Models/Social Science/Traffic Grid.nlogo",
      repetitions = 30
    ),
    Model(
      setup = "set cycle-pollution? true  setup",
      path = "models/Sample Models/Biology/Evolution/Peppered Moths.nlogo",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Biology/Fur.nlogo",
      dimensions = Some((-10, 10, -10, 10)),
      repetitions = 6
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Ising.nlogo",
      dimensions = Some((-10, 10, -10, 10)),
      setup = "setup",
      repetitions = 150
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Genetic Drift/GenDrift P global.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Genetic Drift/GenDrift P local.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Genetic Drift/GenDrift T interact.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Genetic Drift/GenDrift T reproduce.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Social Science/Ethnocentrism.nlogo",
      setup = "setup-full",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Social Science/Party.nlogo",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Mathematics/Mousetraps.nlogo",
      dimensions = Some((-20, 20, -20, 20)),
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Mathematics/Probability/ProbLab/Random Basic.nlogo",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Mathematics/Rugby.nlogo",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Networks/Team Assembly.nlogo",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Biology/Rabbits Grass Weeds.nlogo",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Networks/Virus on a Network.nlogo",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Computer Science/PageRank.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Cooperation.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/Code Examples/Patch Coordinates Example.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Mathematics/Fractals/Tree Simple.nlogo",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Radioactivity/Unverified/Reactor X-Section.nlogo",
      setup = "setup release-neutron",
      go = "auto-react",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/BeeSmart Hive Finding.nlogo",
      repetitions = 50
    ),
    Model(
      path  = "models/Sample Models/Mathematics/Turtles Circling.nlogo",
      setup = "setup " +
              "draw-circle clear-drawing draw-circle " +
              "ask turtles [ set shape \"turtle\" set shape \"circle\" set shape \"turtle\" ] " +
              "ask turtles [ pen-down ]",
      go    = "repeat 50 [ all-circle ] " +
              "repeat 50 [ zero-circle ]",
      repetitions = 1
    ),
    Model(
      path  = "models/Sample Models/Biology/Evolution/Sunflower Biomorphs.nlogo",
      setup = "setup set asexual? false",
      go    = "go handle-mouse-down",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Mathematics/Probability/ProbLab/Dice Stalagmite.nlogo",
      repetitions = 50
    ),
    Model(
      path = "models/Code Examples/Many Regions Example.nlogo",
      repetitions = 50
    ),
    Model(
      path  = "models/Code Examples/HSB and RGB Example.nlogo",
      setup = "",
      go    = "set hue (random 361) set saturation (random 101) set brightness (random 101) " +
              "set rgb-red (random 256) set rgb-green (random 256) set rgb-blue (random 256) " +
              "let hsb-str (word hue \",\" saturation \",\" brightness) " +
              "let rgb-str (word hsb hue saturation brightness) " +
              "error (word hsb-str \" and also \" rgb-str) " +
              "go",
      repetitions = 20
    ),
    Model(
      path = "models/Curricular Models/BEAGLE Evolution/Plant Speciation.nlogo",
      repetitions = 20
    ),
    Model(
      path = "models/IABM Textbook/chapter 2/Simple Economy.nlogo",
      repetitions = 10
    ),
    Model(
      path = "models/Curricular Models/Urban Suite/Urban Suite - Recycling.nlogo",
      repetitions = 30
    ),
    Model(
      path = "models/Curricular Models/epiDEM/epiDEM Travel and Control.nlogo",
      repetitions = 40
    ),
    Model(
      path = "models/Curricular Models/Connected Chemistry/Connected Chemistry Gas Combustion.nlogo",
      repetitions = 100
    ),
    Model(
      path = "models/Curricular Models/ModelSim/Evolution/Bacteria Hunt Speeds.nlogo",
      go   = "go " +
             "if (ticks mod 5 = 0) [ ask one-of bacteria [ death ] ]",
      repetitions = 100
    ),
    Model(
      path = "models/Sample Models/Biology/Autumn.nlogo",
      repetitions = 60
    )
  )
}
