// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  java.{ io => jio, text, util },
    jio.{ File, FileWriter, PrintWriter },
    text.SimpleDateFormat,
    util.Date

import
  scala.{ io => sio, sys, collection => sc },
    sio.Source,
    sys.process.Process,
    sc.mutable.Queue

import
  scalaz.{ NonEmptyList, Validation },
    Validation.FlatMap.ValidationFlatMapRequested

import
  org.nlogo.tortoise.compiler.CompiledModel

import
  org.nlogo.tortoise.nlw.jsengine.JSEngineCompanion

object Benchmarker extends App {

  import jsengine.JSEngine._

  // The following benchmarks can be compiled but do not run here: Ants Benchmark; Bureaucrats Benchmark
  // The reason for this is that they cause both Nashorn and V8 to run out of memory when they are run.
  // In response to that, you might say, "But they run fine in `TestBenchmarks`!", but I suspect that
  // that is due to those tests not running the standard benchmarking commands (`ca benchmark result`) --JAB (2/4/14)
  private val benchmarkModels =
    // Seq(
    //   "BZ Benchmark",
    //   "FireBig Benchmark",
    //   "GridWalk Benchmark",
    //   "Wolf Benchmark",
    //   "Wealth Benchmark",
    //   "Erosion Benchmark",
    //   "Heatbugs Benchmark"
    // )

    Seq(
      "Connected Chemistry Gas Combustion",
      // "Connected Chemistry Reversible Reaction",
      // "DLA Simple",
      // "DNA Protein Synthesis",
      // "DNA Replication Fork",
      // "Dice Stalagmite",
      // "Fish Tank Genetic Drift",
      // "Fur",
      // "GasLab Free Gas",
      // "GasLabNew Benchmark",
      // "Plant Speciation",
      // "Team Assembly",
      // "Traffic Grid"
    )

  private val engineToEvalMap = Seq(Nashorn, SpiderMonkey, V8).map(engine => engine -> engine.freshEval _).toMap

  val (dirStr, models, numIterations, numTicks, enginesAndEvals, comment) = processArgs(args)

  val dir       = new File(dirStr)
  val benchFile = new File(dir, "engine-benchmarks.txt")
  val append    = (str: String) => {
    val writer = new PrintWriter(new FileWriter(benchFile, true))
    writer.append(str)
    writer.flush()
  }

  if (!benchFile.exists())
    benchFile.createNewFile()
  else
    append(s"""==========
              |
              |""".stripMargin)

  val timeStr = {
    val date   = new Date
    val format = new SimpleDateFormat("MM/dd/yyyy @ hh:mm:ss a zzz")
    format.format(date)
  }

  val versionStr = {
    val isClean  = Process("git diff --quiet --exit-code HEAD").! == 0
    val dirtyStr = if (isClean) "" else "-dirty"
    val sha      = Process("git rev-parse HEAD").lineStream.head take 7
    s"$sha$dirtyStr"
  }

  val commentStr = if (comment.nonEmpty) s"Comment:    $comment" else ""

  append(s"""Time:       $timeStr
            |Version:    $versionStr
            |Models:     ${models.mkString(", ")}
            |Iterations: $numIterations
            |Engines:    ${enginesAndEvals.map(_._1.getClass.getSimpleName.init).mkString(", ")}
            |$commentStr
            |
            |""".stripMargin)

  gatherBenchmarks(new File(dir, "models")) map {
    case Benchmark(name, results) =>
      results map {
        case Result(engineName, engineVersion, times) =>
          val str = s"""$name ($engineName $engineVersion):
                       |--Average: ${round(times.sum / times.size, 3)} seconds
                       |--Min:     ${times.min} seconds
                       |--Max:     ${times.max} seconds
                       |
                       |""".stripMargin
          append(str)
      }
  }

  private def gatherBenchmarks(modelsDir: File): Seq[Benchmark] = {

    val modelNameFilePairs = models map (model => (model, pathOfModel(modelsDir, model)))

    modelNameFilePairs map {
      case (name, file) =>
        println(s"Running $name")
        val source = Source.fromFile(file)
        val nlogo  = source.mkString
        source.close()

        val modelV = CompiledModel.fromNlogoContents(nlogo)

        val benchmarkPattern = """(?s).*\n\s*to\s+benchmark.*\n(?s).*\n\s*end(?s).*"""

        val jsV = if (nlogo.matches(benchmarkPattern)) {
          for {
            model       <- modelV
            caJS        <- model.compileRawCommand("ca")
            benchmarkJS <- model.compileRawCommand("benchmark")
            resultJS    <- model.compileReporter("result")
          } yield s"${model.compiledCode};$caJS;$benchmarkJS;$resultJS;"
        } else {
          println(s"No Benchmark procedure found. Running $numTicks ticks.")
          for {
            model       <- modelV
            caJS        <- model.compileRawCommand("ca")
            seedJS      <- model.compileRawCommand("random-seed 0")
            timerJS     <- model.compileRawCommand("reset-timer")
            setupJS     <- model.compileRawCommand("setup")
            repeatJS    <- model.compileRawCommand(s"repeat $numTicks [ go ]")
            resultJS    <- model.compileReporter("timer")
          } yield s"${model.compiledCode};$caJS;$seedJS;$timerJS;$setupJS;$repeatJS;$resultJS;"
        }

        val js = jsV valueOr { case NonEmptyList(head, _) => throw head }

        val results =
          enginesAndEvals.toSeq map {
            case (engine, f) => Result(engine.name, engine.version, 1 to numIterations map { _ => f(js).toDouble })
          }

        Benchmark(name, results)

    }

  }

  private def pathOfModel(dir: File, filename: String): File = {
    val queue = new Queue[File]
    queue.enqueue(dir)

    while (queue.length > 0) {
      val folder = queue.dequeue
      for (entry <- folder.listFiles()) {
        if (entry.isDirectory()) {
          queue.enqueue(entry)
        } else if (entry.getName() == s"$filename.nlogo") {
          return new File(s"${folder.getAbsolutePath}/$filename.nlogo")
        }
      }
    }

    throw new Exception(s"$filename.nlogo not found in models folder.")
  }

  private def round(num: Double, places: Int): Double =
    if (places >= 0)
      BigDecimal(num).setScale(places, BigDecimal.RoundingMode.HALF_UP).toDouble
    else
      throw new IllegalArgumentException("Invalid number of places")

  private def processArgs(args: Seq[String]): (String, Seq[String], Int, Int, Map[JSEngineCompanion, (String) => String], String) = {

    def buildArgPairings(as: Seq[String], pairs: Map[String, Seq[String]] = Map()): Map[String, Seq[String]] = {
      val delimFunc = (s: String) => !s.startsWith("--")
      val cleansed  = as.dropWhile(delimFunc)
      if (cleansed.nonEmpty) {
        val (marker, xs) = (cleansed.head, cleansed.tail.takeWhile(delimFunc))
        buildArgPairings(cleansed.tail.dropWhile(delimFunc), pairs + (marker -> xs))
      }
      else
        pairs
    }

    val dirStr :: others = args.toList

    val engineLookup = (companion: JSEngineCompanion) => engineToEvalMap filter { case (k, _) => k == companion }

    val pairings = buildArgPairings(others)

    val ticks = pairings.get("--ticks") map (_.head.toInt) getOrElse 100
    val comments = pairings.get("--comment") orElse pairings.get("--comments") map (_.head) getOrElse ""

    val (models, iters, engines) =
      if (others.contains("--quick"))
        (Seq("BZ Benchmark"), 1, engineLookup(V8))
      else {
        val chosenModels = pairings.get("--model") orElse pairings.get("--models") getOrElse benchmarkModels
        val iters        = pairings.get("--count") orElse pairings.get("--iters") orElse pairings.get("--num") map (_.head.toInt) getOrElse 3
        val engines      = pairings.get("--engine") map (seq => seq map (_.toLowerCase) flatMap {
          case "node" | "v8" | "google" | "chrome"     => engineLookup(V8)
          case "mozilla" | "firefox" | "spidermonkey"  => engineLookup(SpiderMonkey)
          case "java" | "oracle" | "rhino" | "nashorn" => engineLookup(Nashorn)
          case _                                       => Map[JSEngineCompanion, (String) => String]()
        }) map (_.distinct.toMap) getOrElse engineToEvalMap
        (chosenModels, iters, engines)
      }

    (dirStr, models, iters, ticks, engines, comments)

  }

  private case class Result(engineName: String, engineVersion: String, times: Seq[Double])
  private case class Benchmark(name: String, results: Seq[Result])

}
