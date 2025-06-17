// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

case class Model(
    path: String,
    variation: String = "",
    dimensions: Option[(Int, Int, Int, Int)] = None,
    setup: String = "setup",
    go: String = "go",
    repetitions: Int,
    metrics: Seq[String] = Seq()) {
  def filename = new java.io.File(path).getName.stripSuffix(".nlogox")
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
      path = "models/test/benchmarks/Ants Benchmark.nlogox",
      dimensions = Some((-20, 20, -20, 20)),
      repetitions = 3,
      go =
        "repeat 10 [ go ] " +
        "ask turtle 0 [ move-to one-of patches with [shade-of? pcolor blue] ]"
    ),
    Model(
      path = "models/test/benchmarks/Bureaucrats Benchmark.nlogox",
      dimensions = Some((0, 29, 0, 29)),
      repetitions = 200
    ),
    Model(
      path = "models/test/benchmarks/BZ Benchmark.nlogox",
      dimensions = Some((-20, 20, -20, 20)),
      repetitions = 5
    ),
    Model(
      path = "models/test/benchmarks/Heatbugs Benchmark.nlogox",
      dimensions = Some((0, 19, 0, 19)),
      repetitions = 10
    ),
    Model(
      path = "models/test/benchmarks/GasLabCirc Benchmark.nlogox",
      dimensions = Some((-20, 20, -20, 20)),
      setup = "set number 50  setup",
      repetitions = 50
    ),
    Model(
      path = "models/Sample Models/Networks/Diffusion on a Directed Network.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/test/benchmarks/GasLabNew Benchmark.nlogox",
      repetitions = 25
    ),
    Model(
      path = "models/test/benchmarks/CA1D Benchmark.nlogox",
      dimensions = Some((-9, 9, -4, 4)),
      setup = "setup-random",
      repetitions = 20
    ),
    Model(
      path = "models/test/benchmarks/GridWalk Benchmark.nlogox",
      dimensions = Some((-10, 10, -10, 10)),
      repetitions = 20
    ),
    Model(
      path = "models/Code Examples/Link Breeds Example.nlogox",
      dimensions = Some((-6, 6, -6, 6)),
      repetitions = 0
    ),
    Model(
      path = "models/Code Examples/Link Lattice Example.nlogox",
      dimensions = Some((-6, 6, -6, 6)),
      setup = "setup-square",
      repetitions = 1,
      go = "setup-hex"
    ),
    Model(
      path = "models/Code Examples/State Machine Example.nlogox",
      dimensions = Some((-19, 19, -19, 19)),
      setup = "set number 100  setup",
      repetitions = 100
    ),
    Model(
      path = "models/Code Examples/Tie System Example.nlogox",
      repetitions = 20,
      go = "ask suns [ rt 1 ] tick ask suns [ rt 1 ] tick ask suns [ fd 0.1 ] tick"
    ),
    Model(
      path = "models/Code Examples/Box Drawing Example.nlogox",
      setup = "set edge 2",
      go = "setup-corner",
      repetitions = 1
    ),
    Model(
      path = "models/Sample Models/Biology/Fireflies.nlogox",
      dimensions = Some((-10, 10, -10, 10)),
      setup = "set number 150  setup",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Wolf Sheep Predation.nlogox",
      variation = "no grass, no labels",
      setup = """set model-version "sheep-wolves"  setup  set max-sheep 10000""",
      repetitions = 10,
      metrics = Seq("count wolves", "count sheep", "count patches with [pcolor = green]")
    ),
    Model(
      path = "models/Sample Models/Biology/Wolf Sheep Predation.nlogox",
      variation = "grass, labels",
      setup = """set model-version "sheep-wolves-grass"  set show-energy? true  setup  set max-sheep 10000""",
      repetitions = 10,
      metrics = Seq("count wolves", "count sheep", "count patches with [pcolor = green]")
    ),
    Model(
      path = "models/test/benchmarks/Wolf Benchmark.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Boiling.nlogox",
      dimensions = Some((-15, 15, -15, 15)),
      repetitions = 5
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Waves/Rope.nlogox",
      dimensions = Some((0, 40, -20, 20)),
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Sandpile.nlogox",
      variation = "random",
      dimensions = Some((-15, 15, -15, 15)),
      setup = """setup-random  set drop-location "center"""",
      repetitions = 100,
      metrics = Seq("total", "sizes", "lifetimes")
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Sandpile.nlogox",
      variation = "uniform",
      dimensions = Some((-15, 15, -15, 15)),
      setup = """setup-uniform 0  set drop-location "center"""",
      repetitions = 100,
      metrics = Seq("total", "sizes", "lifetimes")
    ),
    Model(
      path = "models/IABM Textbook/chapter 3/DLA Extensions/DLA Simple.nlogox",
      dimensions = Some((-20, 20, -20, 20)),
      setup = "setup   set num-particles 100",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Earth Science/Fire.nlogox",
      dimensions = Some((-19, 19, -19, 19)),
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Computer Science/Cellular Automata/Life.nlogox",
      dimensions = Some((-15, 15, -15, 15)),
      setup = "setup-random",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Computer Science/Cellular Automata/Life Turtle-Based.nlogox",
      dimensions = Some((-15, 15, -15, 15)),
      setup = "setup-random",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Earth Science/Climate Change.nlogox",
      setup =
        "setup add-cloud add-cloud " +
        "repeat 10 [ add-CO2 ] " +
        "remove-cloud add-cloud " +
        "repeat 10 [ add-CO2 go remove-CO2 ] " +
        "remove-cloud",
      repetitions = 4,
      go = "repeat 50 [ go ]",
      metrics = Seq("temperature")
    ),
    Model(
      path = "models/Sample Models/Biology/Membrane Formation.nlogox",
      dimensions = Some((-10, 10, -10, 10)),
      setup = "set num-lipids 40 set num-water 100  setup",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Biology/Slime.nlogox",
      dimensions = Some((-10, 10, -10, 10)),
      setup = "set population 30  setup",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Social Science/Voting.nlogox",
      dimensions = Some((-10, 10, -10, 10)),
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Networks/Preferential Attachment.nlogox",
      dimensions = Some((-10, 10, -10, 10)),
      repetitions = 20,
      go = "go  resize-nodes",
      metrics = Seq("[size] of turtles")
    ),
    Model(
      path = "models/Sample Models/Computer Science/Vants.nlogox",
      dimensions = Some((-25, 25, -25, 25)),
      repetitions = 1,
      go =
        "repeat 10 [ go-forward ] " +
        "repeat 10 [ go-reverse ]"
    ),
    Model(
      path = "models/Sample Models/Biology/Virus.nlogox",
      repetitions = 40
    ),
    Model(
      path = "models/Sample Models/Art/Follower.nlogox",
      dimensions = Some((-15, 15, -15, 15)),
      setup = "set population 500  setup",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/GasLab/GasLab Free Gas.nlogox",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Biology/HIV.nlogox",
      repetitions = 100
    ),
    Model(
      path = "models/Sample Models/Earth Science/Erosion.nlogox",
      dimensions = Some((-12, 12, -12, 12)),
      repetitions = 100
    ),
    Model(
      path = "models/Sample Models/Social Science/Segregation.nlogox",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Social Science/Economics/Wealth Distribution.nlogox",
      repetitions = 30
    ),
    Model(
      path = "models/Sample Models/Social Science/Traffic Basic.nlogox",
      repetitions = 50
    ),
    Model(
      path = "models/Sample Models/Biology/Flocking.nlogox",
      repetitions = 50
    ),
    Model(
      path = "models/Sample Models/Social Science/Traffic Grid.nlogox",
      repetitions = 30
    ),
    Model(
      setup = "set cycle-pollution? true  setup",
      path = "models/Sample Models/Biology/Evolution/Peppered Moths.nlogox",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Biology/Fur.nlogox",
      dimensions = Some((-10, 10, -10, 10)),
      repetitions = 6
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Ising.nlogox",
      dimensions = Some((-10, 10, -10, 10)),
      setup = "setup",
      repetitions = 150
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Genetic Drift/GenDrift P global.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Genetic Drift/GenDrift P local.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Genetic Drift/GenDrift T interact.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Genetic Drift/GenDrift T reproduce.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Social Science/Ethnocentrism.nlogox",
      setup = "setup-full",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Social Science/Party.nlogox",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Mathematics/Mousetraps.nlogox",
      dimensions = Some((-20, 20, -20, 20)),
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Mathematics/Probability/ProbLab/Random Basic.nlogox",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Mathematics/Rugby.nlogox",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Networks/Team Assembly.nlogox",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Biology/Rabbits Grass Weeds.nlogox",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Networks/Virus on a Network.nlogox",
      repetitions = 25
    ),
    Model(
      path = "models/Sample Models/Computer Science/PageRank.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Curricular Models/BEAGLE Evolution/EACH/Cooperation.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Code Examples/Patch Coordinates Example.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Mathematics/Fractals/Tree Simple.nlogox",
      repetitions = 10
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Radioactivity/Unverified/Reactor X-Section.nlogox",
      setup = "setup release-neutron",
      go = "auto-react",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Biology/BeeSmart Hive Finding.nlogox",
      repetitions = 50
    ),
    Model(
      path  = "models/Sample Models/Mathematics/Turtles Circling.nlogox",
      setup = "setup " +
              "draw-circle clear-drawing draw-circle " +
              "ask turtles [ set shape \"turtle\" set shape \"circle\" set shape \"turtle\" ] " +
              "ask turtles [ pen-down ]",
      go    = "repeat 50 [ all-circle ] " +
              "repeat 50 [ zero-circle ]",
      repetitions = 1
    ),
    Model(
      path  = "models/Sample Models/Biology/Evolution/Sunflower Biomorphs.nlogox",
      setup = "setup set asexual? false",
      go    = "go handle-mouse-down",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Mathematics/Probability/ProbLab/Dice Stalagmite.nlogox",
      repetitions = 50
    ),
    Model(
      path = "models/Code Examples/Many Regions Example.nlogox",
      repetitions = 50
    ),
    Model(
      path  = "models/Code Examples/HSB and RGB Example.nlogox",
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
      path = "models/Curricular Models/BEAGLE Evolution/Plant Speciation.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/IABM Textbook/chapter 2/Simple Economy.nlogox",
      repetitions = 10
    ),
    Model(
      path = "models/Curricular Models/Urban Suite/Urban Suite - Recycling.nlogox",
      repetitions = 30
    ),
    Model(
      path = "models/Curricular Models/epiDEM/epiDEM Travel and Control.nlogox",
      repetitions = 40
    ),
    Model(
      path = "models/Curricular Models/Connected Chemistry/Connected Chemistry Gas Combustion.nlogox",
      repetitions = 100
    ),
    Model(
      path = "models/Curricular Models/ModelSim/Evolution/Bacteria Hunt Speeds.nlogox",
      go   = "go " +
             "if (ticks mod 5 = 0) [ ask one-of bacteria [ death ] ]",
      repetitions = 100
    ),
    Model(
      path = "models/Sample Models/Biology/Autumn.nlogox",
      repetitions = 60
    ),
    Model(
      path = "models/Sample Models/Biology/Evolution/Mimicry.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Sample Models/Art/Fireworks.nlogox",
      repetitions = 50
    ),
    Model(
      path = "models/Curricular Models/BEAGLE Evolution/DNA Replication Fork.nlogox",
      repetitions = 100
    ),
    Model(
      path = "models/Curricular Models/BEAGLE Evolution/Bug Hunt Coevolution.nlogox",
      repetitions = 60
    ),
    Model(
      path = "models/Curricular Models/BEAGLE Evolution/Fish Tank Genetic Drift.nlogox",
      repetitions = 60,
      // this model uses `every` when this value is `true`, which causes intermittent
      // fails when comparing to desktop.  -Jeremy B September 2022
      setup = "set auto-replace? false"
    ),
    Model(
      path = "models/Curricular Models/Connected Chemistry/Connected Chemistry Reversible Reaction.nlogox",
      repetitions = 30
    ),
    Model(
      path = "models/Sample Models/Computer Science/Hex Cell Aggregation.nlogox",
      repetitions = 30
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/GasLab/GasLab Circular Particles.nlogox",
      repetitions = 20
    ),
    Model(
      path = "models/Curricular Models/BEAGLE Evolution/DNA Protein Synthesis.nlogox",
      repetitions = 52, // This is the number of repetitions needed to finish the animation entirely --JAB (1/13/16)
      setup = """
                |setup
                |set event-1-triggered? true
                |set event-2-triggered? true
                |set event-3-triggered? true
                |set event-4-triggered? true
                |replicate-dna visualize-all-genes
                |set event-6-triggered? true
                |set event-7-triggered? true
                |set event-8-triggered? true
                |set event-9-triggered? true
              """.stripMargin
    ),
    Model(
      path = "models/Code Examples/Hill Climbing Example.nlogox",
      repetitions = 30
    ),
    Model(
      path = "models/Sample Models/Biology/Ants.nlogox",
      repetitions = 80
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Materials Science/Monte Carlo Lennard-Jones.nlogox",
      repetitions = 40
    ),
    Model(
      path = "models/Sample Models/Chemistry & Physics/Materials Science/Molecular Dynamics Lennard-Jones.nlogox",
      repetitions = 40
    ),
    Model(
      path = "models/Sample Models/Computer Science/Unverified/Simulated Annealing.nlogox",
      repetitions = 25
    ),
    Model(
      path = "models/Code Examples/Fully Connected Network Example.nlogox",
      repetitions = 0
    ),
    Model(
      path = "models/Code Examples/Network Example.nlogox",
      repetitions = 30
    ),
    Model(
      path = "models/Sample Models/Biology/Rock Paper Scissors.nlogox",
      repetitions = 20
    ),
    Model(
      path = "test/models/ImportATest.nlogox",
      repetitions = 9
    ),
    Model(
      path = "test/models/ColorsAndTransparency.nlogox",
      repetitions = 8
    )
  )
}
