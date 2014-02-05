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

object Benchmarker extends App {

  import JSEngine._

  // The following benchmarks can be compiled but do not run here: Ants Benchmark; Bureaucrats Benchmark
  // The reason for this is that they cause both Nashorn and V8 to run out of memory when they are run.
  // In response to that, you might say, "But they run fine in `TestBenchmarks`!", but I suspect that
  // that is due to those tests not running the standard benchmarking commands (`ca benchmark result`) --JAB (2/4/14)
  private val benchmarkModels = Seq("BZ Benchmark")

  private val engineToEvalMap = Seq(Nashorn, V8).map(engine => engine -> engine.freshEval _).toMap


// See comments in 'benchmark.sbt' --JAB (2/3/14)
//  val dir       = new File(args(0))
  val dir       = new File(".")
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

  append(s"""Time:    $timeStr
            |Version: $versionStr
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

    val modelNameFilePairs = benchmarkModels map (model => (model, pathOfModel(modelsDir, model)))

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
          engineToEvalMap.toSeq map {
            case (engine, f) => Result(engine.name, engine.version, 1 to 3 map { _ => f(js).toDouble })
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

  private case class Result(engineName: String, engineVersion: String, times: Seq[Double])
  private case class Benchmark(name: String, results: Seq[Result])

}

