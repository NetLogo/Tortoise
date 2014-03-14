val root = project in file (".") configs(FastMediumSlow.configs: _*)

// Keep this up here so things get published to the correct places
bintraySettings

name := "Tortoise"

organization := "org.nlogo"

licenses += ("GPL-2.0", url("http://opensource.org/licenses/GPL-2.0"))

// Used by the publish-versioned plugin
isSnapshot := true

version := "0.1"

scalaVersion := "2.10.3"

scalacOptions ++=
  "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -target:jvm-1.7 -Xlint -Xfatal-warnings"
  .split(" ").toSeq

resourceDirectory in Test := baseDirectory.value / "resources" / "test"

// show test failures again at end, after all tests complete.
// T gives truncated stack traces; change to G if you need full.
testOptions in Test += Tests.Argument("-oT")

// only log problems plz
ivyLoggingLevel := UpdateLogging.Quiet

// we're not cross-building for different Scala versions
crossPaths := false

val nlDependencyVersion = "5.1.0-e5b375c"

resolvers += bintray.Opts.resolver.repo("netlogo", "NetLogoHeadless")

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
  "org.nlogo" % "netlogoheadless" % nlDependencyVersion,
  "org.json4s" %% "json4s-native" % "3.1.0",
  "org.webjars" % "json2" % "20110223",
  "org.scalacheck" %% "scalacheck" % "1.11.3" % "test",
  "org.scalatest" %% "scalatest" % "2.1.0" % "test",
  "org.skyscreamer" % "jsonassert" % "1.1.0" % "test",
  // Bring is headless test code/framework for our tests
  "org.nlogo" % "netlogoheadless" % nlDependencyVersion % "test" classifier "tests"
)

onLoadMessage := ""

bintray.Keys.repository in bintray.Keys.bintray := "Tortoise"

bintray.Keys.bintrayOrganization in bintray.Keys.bintray := Some("netlogo")

logBuffered in testOnly in Test := false

FastMediumSlow.settings

Coffee.settings

PublishVersioned.settings
