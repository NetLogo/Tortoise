lazy val benchmark = inputKey[Unit]("Run the benchmarks")

benchmark := {
  (runMain in Test).partialInput(s" org.nlogo.tortoise.Benchmarker .").evaluated
}

// Screw you, SBT!  This task can't reference values of other settings (like `baseDirectory`),
// thanks to https://github.com/sbt/sbt/issues/1090 --JAB (5/1/14)
