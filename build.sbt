val root = project in file (".") configs(FastMediumSlow.configs: _*)

scalaVersion := "2.10.3"

scalacOptions ++=
  "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -target:jvm-1.7 -Xlint -Xfatal-warnings"
  .split(" ").toSeq

// only log problems plz
ivyLoggingLevel := UpdateLogging.Quiet

// we're not cross-building for different Scala versions
crossPaths := false

// work around https://github.com/sbt/sbt/issues/979 ;
// remove once we move to 0.13.1-RC4
trapExit in Global := false

val netlogoSha = settingKey[String]("version of NetLogo we depend on")

netlogoSha := "4e3d730"

libraryDependencies ++= {
  val sha = netlogoSha.value
  val version = s"5.1.0-SNAPSHOT-$sha"
  Seq(
    "org.nlogo" % "NetLogoHeadless" % version from
      s"http://ccl.northwestern.edu/devel/NetLogoHeadless-$sha.jar",
    "org.nlogo" % "NetLogoHeadlessTests" % version % "test" from
      s"http://ccl.northwestern.edu/devel/NetLogoHeadlessTests-$sha.jar"
  )
}

libraryDependencies ++= Seq(
  "org.json4s" %% "json4s-native" % "3.1.0",
  "org.webjars" % "json2" % "20110223",
  "org.scalacheck" %% "scalacheck" % "1.10.1" % "test",
  "org.scalatest" %% "scalatest" % "2.0" % "test",
  "org.skyscreamer" % "jsonassert" % "1.1.0" % "test"
)

onLoadMessage := ""

FastMediumSlow.settings

Coffee.settings
