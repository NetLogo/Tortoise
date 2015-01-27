val root = project in file (".") configs(FastMediumSlow.configs: _*)

// Keep this up here so things get published to the correct places
bintraySettings

name := "Tortoise"

organization := "org.nlogo"

licenses += ("GPL-2.0", url("http://opensource.org/licenses/GPL-2.0"))

// Used by the publish-versioned plugin
isSnapshot := true

version := "0.1"

scalaVersion := "2.11.5"

scalacOptions ++=
  "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -target:jvm-1.7 -Xlint -Xfatal-warnings -language:_"
  .split(" ").toSeq

resourceDirectory in Test := baseDirectory.value / "resources" / "test"

// show test failures again at end, after all tests complete.
// T gives truncated stack traces; change to G if you need full.
testOptions in Test += Tests.Argument("-oT")

// only log problems plz
ivyLoggingLevel := UpdateLogging.Quiet

// we're not cross-building for different Scala versions
crossPaths := false

val nlDependencyVersion = "5.2.0-fc260f2"

libraryDependencies ++= Seq(
  "org.nlogo" % "netlogoheadless" % nlDependencyVersion,
  "org.json4s" %% "json4s-native" % "3.2.11",
  "org.scalaz" %% "scalaz-core" % "7.1.0",
  "com.lihaoyi" %% "scalatags" % "0.4.5" % "test",
  "org.scalatest" %% "scalatest" % "2.2.1" % "test",
  "org.skyscreamer" % "jsonassert" % "1.2.3" % "test",
  "org.reflections" % "reflections" % "0.9.9" % "test",
  // Bring in headless test code/framework for our tests
  "org.nlogo" % "netlogoheadless" % nlDependencyVersion % "test" classifier "tests"
)

onLoadMessage := ""

bintray.Keys.repository in bintray.Keys.bintray := "Tortoise"

bintray.Keys.bintrayOrganization in bintray.Keys.bintray := Some("netlogo")

logBuffered in testOnly in Test := false

(test in Test) <<= (test in Test).dependsOn {
  Def.task[Unit] {
    sbt.IO.delete(target.value / "last-test-run-reports")
  }
}

FastMediumSlow.settings

PublishVersioned.settings

Depend.settings
