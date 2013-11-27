val root = project in file (".") configs(FastMediumSlow.configs: _*)

scalaVersion := "2.10.3"

scalacOptions ++=
  "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -target:jvm-1.7 -Xlint -Xfatal-warnings"
  .split(" ").toSeq

// only log problems plz
ivyLoggingLevel := UpdateLogging.Quiet

// we're not cross-building for different Scala versions
crossPaths := false

val netlogoSha = settingKey[String]("version of NetLogo we depend on")

netlogoSha := "07de0278"

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

// NetLogoHeadlessTests depends on reflections; reflections depends on some extra jars.
// but for some reason we need to explicitly list the transitive dependencies
libraryDependencies ++= Seq(
  "org.reflections" % "reflections" % "0.9.9-RC1" % "test",
  "com.google.code.findbugs" % "jsr305" % "2.0.1" % "test",
  "com.google.guava" % "guava" % "12.0"           % "test",
  "org.javassist" % "javassist" % "3.16.1-GA"     % "test",
  "org.slf4j" % "slf4j-nop" % "1.7.5"             % "test"
)

libraryDependencies ++= Seq(
  "org.json4s" %% "json4s-native" % "3.1.0",
  "org.webjars" % "json2" % "20110223",
  "org.scalacheck" %% "scalacheck" % "1.10.1" % "test",
  "org.scalatest" %% "scalatest" % "2.0" % "test",
  "org.skyscreamer" % "jsonassert" % "1.1.0" % "test"
)

onLoadMessage := ""

FastMediumSlow.settings

LanguageTests.settings

Coffee.settings
