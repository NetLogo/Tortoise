package org.nlogo.tortoise

import
  java.{ io => jio, text, util },
    jio.{ File, FileWriter, PrintWriter },
    text.SimpleDateFormat,
    util.Date

import
  scala.{ io => sio, sys },
    sio.Source,
    sys.process.Process

import
  scalaz.NonEmptyList

import
  org.nlogo.tortoise.jsengine.JSEngineCompanion

object Benchmarker extends App {

  import jsengine.JSEngine._

  // The following benchmarks can be compiled but do not run here: Ants Benchmark; Bureaucrats Benchmark
  // The reason for this is that they cause both Nashorn and V8 to run out of memory when they are run.
  // In response to that, you might say, "But they run fine in `TestBenchmarks`!", but I suspect that
  // that is due to those tests not running the standard benchmarking commands (`ca benchmark result`) --JAB (2/4/14)
  private val benchmarkModels = Seq("BZ Benchmark")

  private val engineToEvalMap = Seq(Nashorn, SpiderMonkey, V8).map(engine => engine -> engine.freshEval _).toMap

  val (dirStr, models, numIterations, enginesAndEvals, comment) = processArgs(args)

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
    val sha      = Process("git rev-parse HEAD").lines.head take 7
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

        val source = Source.fromFile(file)
        val nlogo  = source.mkString
        source.close()

        val modelV = CompiledModel.fromNlogoContents(nlogo)

        val jsV =
          for {
            model       <- modelV
            caJS        <- model.compileCommand("ca")
            benchmarkJS <- model.compileCommand("benchmark")
            resultJS    <- model.compileReporter("result")
          } yield s"${model.compiledCode};$caJS;$benchmarkJS;$resultJS;"

        val js = jsV valueOr { case NonEmptyList(head) => throw head }

        val results =
          enginesAndEvals.toSeq map {
            case (engine, f) => Result(engine.name, engine.version, 1 to numIterations map { _ => f(js).toDouble })
          }

        Benchmark(name, results)

    }

  }

  private def pathOfModel(dir: File, filename: String): File = new File(s"${dir.getAbsolutePath}/test/benchmarks/$filename.nlogo")

  private def round(num: Double, places: Int): Double =
    if (places >= 0)
      BigDecimal(num).setScale(places, BigDecimal.RoundingMode.HALF_UP).toDouble
    else
      throw new IllegalArgumentException("Invalid number of places")

  private def processArgs(args: Seq[String]): (String, Seq[String], Int, Map[JSEngineCompanion, (String) => String], String) = {

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

    val comments = pairings.get("--comment") orElse pairings.get("--comments") map (_.head) getOrElse ""

    val (models, iters, engines) =
      if (others.contains("--quick"))
        (Seq("BZ Benchmark"), 1, engineLookup(V8))
      else {
        val iters    = pairings.get("--count") orElse pairings.get("--iters") orElse pairings.get("--num") map (_.head.toInt) getOrElse 3
        val engines  = pairings.get("--engine") map (seq => seq map (_.toLowerCase) flatMap {
          case "node" | "v8" | "google" | "chrome"     => engineLookup(V8)
          case "mozilla" | "firefox" | "spidermonkey"  => engineLookup(SpiderMonkey)
          case "java" | "oracle" | "rhino" | "nashorn" => engineLookup(Nashorn)
          case _                                       => Map[JSEngineCompanion, (String) => String]()
        }) map (_.distinct.toMap) getOrElse engineToEvalMap
        (benchmarkModels, iters, engines)
      }

    (dirStr, models, iters, engines, comments)

  }

  private case class Result(engineName: String, engineVersion: String, times: Seq[Double])
  private case class Benchmark(name: String, results: Seq[Result])

}

