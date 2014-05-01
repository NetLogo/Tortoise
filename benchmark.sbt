lazy val benchmark = inputKey[Unit]("Run the benchmarks")

benchmark := (runMain in Compile).fullInput(" org.nlogo.tortoise.Benchmarker").evaluated

// Screw you, SBT!  The code below doesn't work, at least in part related to
// https://github.com/sbt/sbt/issues/1090 --JAB (2/3/14)
//benchmark := (run in Compile).toTask(baseDirectory.value.getAbsolutePath).value
