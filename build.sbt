///
/// root project
///

val root = project in file (".") configs(Testing.configs: _*)

scalaVersion := "2.10.3"

scalacOptions ++=
  "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -target:jvm-1.7 -Xlint -Xfatal-warnings"
  .split(" ").toSeq

// only log problems plz
ivyLoggingLevel := UpdateLogging.Quiet

// we're not cross-building for different Scala versions
crossPaths := false

libraryDependencies ++= Seq(
  "org.nlogo" % "NetLogoHeadless" % "5.1.0-SNAPSHOT-d3d987ed" from
    "http://ccl.northwestern.edu/devel/NetLogoHeadless-d3d987ed.jar",
  "org.nlogo" % "NetLogoHeadlessTests" % "5.1.0-SNAPSHOT-d3d987ed" from
    "http://ccl.northwestern.edu/devel/NetLogoHeadlessTests-d3d987ed.jar",
  "asm" % "asm-all" % "3.3.1",
  "org.json4s" %% "json4s-native" % "3.1.0",
  "org.webjars" % "json2" % "20110223",
  "org.scalacheck" %% "scalacheck" % "1.10.1" % "test",
  "org.scalatest" %% "scalatest" % "2.0.RC3" % "test",
  "org.skyscreamer" % "jsonassert" % "1.1.0" % "test"
)

onLoadMessage := ""

resourceDirectory in Compile := baseDirectory.value / "resources"

scalaSource in Compile := baseDirectory.value / "src" / "main"

scalaSource in Test := baseDirectory.value / "src" / "test"

unmanagedResourceDirectories in Compile += baseDirectory.value / "resources"

seq(Testing.settings: _*)

seq(Scaladoc.settings: _*)

seq(Coffee.settings: _*)
