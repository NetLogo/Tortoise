import sbt._
import Keys._

object FastMediumSlow {
  lazy val fast     = taskKey[Unit]("fast tests")
  lazy val medium   = taskKey[Unit]("medium tests")
  lazy val slow     = taskKey[Unit]("slow tests")
  lazy val language = taskKey[Unit]("language tests")
  lazy val crawl    = taskKey[Unit]("extremely slow tests")

  lazy val settings = Seq(
    (Test / fast) := {
      (Test / testOnly).toTask(" -- -l org.nlogo.tortoise.tags.SlowTest -l org.nlogo.tortoise.tags.LanguageTest").value
    },
    (Test / medium) := {
      (Test / testOnly).toTask(" -- -l org.nlogo.tortoise.tags.SlowTest").value
    },
    (Test / language) := {
      (Test / testOnly).toTask(" -- -n org.nlogo.tortoise.tags.LanguageTest").value
    },
    (Test / crawl) := {
      (Test / testOnly).toTask(" -- -n org.nlogo.tortoise.tags.SlowTest").value
    },
    (Test / slow) := {
      (Test / testOnly).toTask(" -- -n org.nlogo.tortoise.tags.LanguageTest -n org.nlogo.tortoise.tags.SlowTest").value
    })
}
