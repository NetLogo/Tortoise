import sbt._
import Keys._

object LanguageTests {

  // so e.g. `tr` is short for
  //   test-only org.nlogo.tortoise.TestReporters
  // and `tr Lists Strings` is short for
  //   test-only org.nlogo.tortoise.TestReporters -- -n "Lists Strings"

  val tr = inputKey[Unit]("org.nlogo.tortoise.TestReporters")
  val tc = inputKey[Unit]("org.nlogo.tortoise.TestCommands")

  val settings = inConfig(Test)(
    Seq(tr, tc).flatMap(key =>
      Defaults.defaultTestTasks(key) ++
      Defaults.testTaskOptions(key) ++
      Seq(key := oneTest(key.key.description.get).evaluated)))

  def oneTest(name: String): Def.Initialize[InputTask[Unit]] =
    Def.inputTaskDyn {
      val args = Def.spaceDelimited("<arg>").parsed
      val scalaTestArgs =
        if (args.isEmpty) ""
        else args.mkString(" -- -n \"", " ", "\"")
      (testOnly in Test).toTask(" " + name + scalaTestArgs)
    }

}
