import scala.scalajs.sbtplugin.ScalaJSPlugin.ScalaJSKeys.{ fullOptJS, packageJSDependencies }

val nlDependencyVersion = "5.2.0-051b1b8"

val parserJsDependencyVersion = "0.0.1-051b1b8"

val commonSettings =
  // Keep this up here so things get published to the correct places
  bintraySettings ++
  Seq(
    ivyScala := ivyScala.value map { _.copy(overrideScalaVersion = true) },
    organization := "org.nlogo",
    licenses += ("GPL-2.0", url("http://opensource.org/licenses/GPL-2.0")),
    // Used by the publish-versioned plugin
    isSnapshot := true,
    version := "0.1",
    scalaVersion := "2.11.5",
    scalacOptions ++=
      "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -target:jvm-1.7 -Xlint -Xfatal-warnings -language:_".split(" ").toSeq,
    resourceDirectory in Compile := (baseDirectory in root).value / "resources" / "main",
    resourceDirectory in Test := (baseDirectory in root).value / "resources" / "test",
    // show test failures again at end, after all tests complete.
    // T gives truncated stack traces; change to G if you need full.
    testOptions in Test += Tests.Argument("-oT"),
    // only log problems plz
    ivyLoggingLevel := UpdateLogging.Quiet,
    // we're not cross-building for different Scala versions
    crossPaths := false,
    resolvers += bintray.Opts.resolver.repo("netlogo", "NetLogoHeadless"),
    libraryDependencies ++= Seq(
      "org.nlogo" % "netlogoheadless" % nlDependencyVersion,
      "org.mozilla" % "rhino" % "1.7R5",
      "org.json4s" %% "json4s-native" % "3.2.11",
      "org.scalaz" %% "scalaz-core" % "7.1.0",
      "com.lihaoyi" %% "scalatags" % "0.4.5" % "test",
      "org.scalatest" %% "scalatest" % "2.2.1" % "test",
      "org.skyscreamer" % "jsonassert" % "1.2.3" % "test",
      "org.reflections" % "reflections" % "0.9.9" % "test",
      // Bring in headless test code/framework for our tests
      "org.nlogo" % "netlogoheadless" % nlDependencyVersion % "test" classifier "tests"
    ),
    onLoadMessage := "",
    bintray.Keys.repository in bintray.Keys.bintray := "Tortoise",
    bintray.Keys.bintrayOrganization in bintray.Keys.bintray := Some("netlogo"),
    logBuffered in testOnly in Test := false
)

(test in Test) <<= (test in Test).dependsOn {
  Def.task[Unit] {
    sbt.IO.delete(target.value / "last-test-run-reports")
  }
}

lazy val root = (project in file("."))

lazy val tortoise = (project in file ("tortoise")).
  dependsOn(macros % "compile->compile;test->test").
  configs(FastMediumSlow.configs: _*).
  settings(FastMediumSlow.settings: _*).
  settings(PublishVersioned.settings: _*).
  settings(Depend.settings: _*).
  settings(commonSettings: _*).
  settings(name := "Tortoise",
    ivyScala := ivyScala.value map { _.copy(overrideScalaVersion = true) }
    )

lazy val tortoiseJs = (project in file("js")).
  dependsOn(macros % "compile->compile;test->test").
  settings(commonSettings: _*).
  settings(scalaJSSettings: _*).
  settings(utest.jsrunner.Plugin.utestJsSettings: _*).
  settings(
    ivyScala := ivyScala.value map { _.copy(overrideScalaVersion = true) },
    artifactPath in (Compile, fullOptJS) := ((crossTarget in (Compile, fullOptJS)).value / "tortoise.js"),
    skip in packageJSDependencies := false,
    name := "TortoiseJS",
    testFrameworks += new TestFramework("utest.jsrunner.JsFramework"),
    libraryDependencies ++= Seq(
      "org.nlogo" %%% "parser-js" % parserJsDependencyVersion,
      "com.github.japgolly.fork.scalaz" %%% "scalaz-core" % "7.1.0-4"),
    unmanagedSources in Compile ++=
      ((baseDirectory in tortoise).value / "src" / "main" / "scala" * "*.scala" +++
        (baseDirectory in tortoise).value / "src" / "main" / "scala" / "json"  * "*.scala" ---
        (baseDirectory in tortoise).value / "src" / "main" / "scala" / "json" / "JsonLibrary.scala").get
  )

lazy val macros = (project in file ("macros")).
  settings(commonSettings: _*).
  settings(
    libraryDependencies += "org.scala-lang" % "scala-reflect" % scalaVersion.value,
    ivyScala := ivyScala.value map { _.copy(overrideScalaVersion = true) }
  )

lazy val netLogoWeb: Project = (project in file("netlogo-web")).
  dependsOn(tortoise % "compile->compile;test->test").
  settings(commonSettings: _*).
  settings(
    resourceGenerators in Compile += Def.task {
      IO.copy(Seq(((artifactPath in fullOptJS in Compile in tortoiseJs).value, resourceManaged.value / "tortoise.js")))
      Seq(resourceManaged.value / "tortoise.js")
    }.taskValue,
    compile <<= (compile in Compile) dependsOn (fullOptJS in Compile in tortoiseJs),
    name := "NetLogoWebJS",
    libraryDependencies ++= Seq(
      "org.nlogo" % "netlogoheadless" % nlDependencyVersion % "test",
      "org.scalatest" %% "scalatest" % "2.2.1" % "test"
    )
  )
