lazy val benchmark = taskKey[Unit]("Run the benchmarks")

benchmark := (run in Compile).toTask("").value

mainClass in (Compile, benchmark) := Option("org.nlogo.tortoise.Benchmarker")

// Screw you, SBT!  The code below doesn't work, at least in part related to
// https://github.com/sbt/sbt/issues/1090 --JAB (2/3/14)
//benchmark := (run in Compile).toTask(baseDirectory.value.getAbsolutePath).value
