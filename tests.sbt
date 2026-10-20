// so e.g. `tr` is short for
//   netLogoWeb / testOnly *TestReporters
// and `tr Lists Strings` is short for
//   netLogoWeb / testOnly *TestReporters -- -n "Lists Strings"
// where -n tells ScalaTest to look for the given Tag names.
// you can run individual tests too with e.g.:
//   tr Numbers::Sqrt1 Numbers::Sqrt2

val tr = inputKey[Unit]("*TestReporters")
val tc = inputKey[Unit]("*TestCommands")

def taggedTest(name: String): Def.Initialize[InputTask[Unit]] =
  Def.inputTaskDyn {
    val args = Def.spaceDelimited("<arg>").parsed
    val scalaTestArgs =
      if (args.isEmpty) ""
      else args.mkString(" -- -n \"", " ", "\"")
    (LocalProject("netLogoWeb") / Test / testOnly).toTask(" " + name + scalaTestArgs)
  }

inConfig(Test)(
  Seq(tr, tc).flatMap(key =>
    Defaults.defaultTestTasks(key) ++
    Defaults.testTaskOptions(key) ++
    Seq(key := taggedTest(key.key.description.get).evaluated)))
