import AddSettings.sbtFiles
import bintray.Keys.{ bintray => bintrayTask, bintrayOrganization, repository => bintrayRepository }
import org.scalajs.sbtplugin.cross.{ CrossProject, CrossType }
import org.scalajs.sbtplugin.ScalaJSPlugin.autoImport.{ fullOptJS, packageJSDependencies }
import org.scalastyle.sbt.ScalastylePlugin.scalastyle

val nlDependencyVersion       = "5.2.0-bf59ee5"

val parserJsDependencyVersion = "0.0.1-bf59ee5"

val scalazVersion             = "7.2.2"

val commonSettings =
  // Keep this up here so things get published to the correct places
  bintraySettings ++
  Seq(
    organization  := "org.nlogo",
    licenses      += ("GPL-2.0", url("http://opensource.org/licenses/GPL-2.0")),
    version       := "1.0",
    // Compilation settings
    crossPaths    := false, // we're not cross-building for different Scala versions
    scalaVersion  := "2.11.8",
    scalacOptions ++=
      "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -target:jvm-1.7 -Xlint -Xfatal-warnings -Ywarn-value-discard -language:_".split(" ").toSeq,
    // Dependencies
    resolvers           += bintray.Opts.resolver.repo("netlogo", "NetLogoHeadless"),
    libraryDependencies ++= Seq(
      "org.nlogo" % "netlogoheadless" % nlDependencyVersion,
      "org.mozilla" % "rhino" % "1.7.7", // see jsengine/Rhino.scala for more information
      "org.json4s" %% "json4s-native" % "3.3.0",
      "org.scalaz" %% "scalaz-core" % scalazVersion,
      "com.lihaoyi" %% "scalatags" % "0.5.3" % "test",
      "org.scalatest" %% "scalatest" % "2.2.1" % "test",
      "org.skyscreamer" % "jsonassert" % "1.3.0" % "test",
      "org.reflections" % "reflections" % "0.9.10" % "test",
      "org.scalacheck" %% "scalacheck" % "1.12.1" % "test",
      // Bring in headless test code/framework for our tests
      "org.nlogo" % "netlogoheadless" % nlDependencyVersion % "test" classifier "tests"),
    ivyScala      := ivyScala.value map { _.copy(overrideScalaVersion = true) }, // needed to keep scala.js happy
    // Path Management
    resourceDirectory in Compile := (baseDirectory in root).value / "resources" / "main",
    resourceDirectory in Test    := (baseDirectory in root).value / "resources" / "test",
    // Build and publication settings
    isSnapshot                         := true, // Used by the publish-versioned plugin
    bintrayRepository in bintrayTask   := "TortoiseAux",
    bintrayOrganization in bintrayTask := Some("netlogo"),
    // Logging and Output settings
    ivyLoggingLevel                 := UpdateLogging.Quiet, // only log problems plz
    onLoadMessage                   := "",
    // show test failures again at end, after all tests complete.
    // T gives truncated stack traces; change to G if you need full.
    testOptions in Test += Tests.Argument("-oT"))

lazy val root = (project in file("."))

// These projects are just for scalastyle on shared sources
lazy val tortoiseCore = (project in file("tortoise")).
  settings(skip in (Compile, compile) := true)

lazy val macrosCore = (project in file("macros")).
  settings(skip in (Compile, compile) := true)

lazy val tortoise = CrossProject("tortoise", file("."), new CrossType {
    override def projectDir(crossBase: File, projectType: String): File =
      crossBase / projectType
    override def sharedSrcDir(projectBase: File, conf: String): Option[File] =
      Some(projectBase / ".." / "tortoise" / "src" / conf / "scala")
  }).
  dependsOn(macros % "compile-internal->compile;test-internal->test").
  settings(Depend.settings: _*).
  settings(commonSettings: _*).
  jvmConfigure(_.addSbtFiles(file("travis.sbt"))).
  jvmSettings(FastMediumSlow.settings: _*).
  jvmSettings(Depend.settings: _*).
  jvmSettings(
    name :=  "Tortoise",
    (resources in Compile) <<= (resources in Compile).dependsOn {
      Def.task[Seq[File]] {
        val _          = (fullOptJS in Compile in engineScalaJS).value
        val engineFile = (artifactPath in fullOptJS in Compile in engineScalaJS).value
        val destFile   = (classDirectory in Compile).value / "js" / "tortoise" / "shim" / "engine-scala.js"
        IO.copyFile(engineFile, destFile)
        val oldContents = IO.read(destFile)
        val newContents =
          s"""(function() {
             |
             |$oldContents
             |  module.exports = {
             |    MersenneTwisterFast: MersenneTwisterFast
             |  };
             |
             |}).call(this);""".stripMargin
        IO.write(destFile, newContents)
        Seq(destFile)
      }
    },
    // this ensures that generated test reports are updated each run
    (test in Test) <<= (test in Test).dependsOn {
      Def.task[Unit] {
        sbt.IO.delete(target.value / "last-test-run-reports")
      }
    }).
  jsSettings(
    name                                 := "TortoiseJS",
    artifactPath in (Compile, fullOptJS) := ((crossTarget in (Compile, fullOptJS)).value / "tortoise-compiler.js"),
    skip in packageJSDependencies        := false, // bundles all dependencies in with generated JS
    testFrameworks                       += new TestFramework("utest.runner.Framework"),
    libraryDependencies                  ++= {
      import org.scalajs.sbtplugin.ScalaJSPlugin.autoImport.toScalaJSGroupID
      Seq(
        "com.lihaoyi" %%%! "utest" % "0.3.1",
        "org.nlogo"   %%%! "parser-js" % parserJsDependencyVersion,
        "org.scalaz" %%% "scalaz-core" % scalazVersion)
    })

lazy val tortoiseJS  = tortoise.js

lazy val tortoiseJVM = tortoise.jvm

lazy val macros = CrossProject("macros", file("macros"), CrossType.Pure).
  settings(commonSettings: _*).
  settings(
    libraryDependencies ++= Seq(
      "org.scala-lang" % "scala-reflect" % scalaVersion.value,
      "org.scalaz" %% "scalaz-core" % scalazVersion),
    ivyScala := ivyScala.value map { _.copy(overrideScalaVersion = true) }
  )

lazy val macrosJS  = macros.js

lazy val macrosJVM = macros.jvm

lazy val cleanGeneratedSources = taskKey[Unit]("deletes generated resources")

lazy val netLogoWeb: Project = (project in file("netlogo-web")).
  dependsOn(tortoiseJVM % "compile-internal->compile;test-internal->test").
  dependsOn(tortoiseJS  % "compile-internal->compile").
  settings(commonSettings: _*).
  settings(
    name                  := "NetLogoWebJS",
    libraryDependencies   ++= Seq(
      "org.nlogo" % "netlogoheadless" % nlDependencyVersion % "test",
      "org.scalatest" %% "scalatest" % "2.2.1" % "test"),
    // these tasks force the regeneration of the tortoise.js source on each build
    resourceGenerators in Compile += Def.task {
      (fullOptJS in Compile in tortoiseJS).value
      val tortoiseJsFile = (artifactPath in fullOptJS in Compile in tortoiseJS).value
      val files          = Seq[File](tortoiseJsFile, tortoiseJsFile.getParentFile / (tortoiseJsFile.getName + ".map"))
      val copies         = files.map((f: File) => (f, resourceManaged.value / f.getName))
      IO.copy(copies)
      copies.map(_._2)
    }.taskValue,
    cleanGeneratedSources          := { IO.delete(resourceManaged.value) },
    cleanFiles                     <+= resourceManaged,
    compile                        <<= (compile in Compile) dependsOn(
      cleanGeneratedSources,
      managedResources in Compile,
      clean in tortoiseJS,
      fullOptJS in Compile in tortoiseJS))

lazy val engineScalaJS: Project =
  (project in file("jvm/src/main/scalajs")).
    enablePlugins(ScalaJSPlugin).
    settings(commonSettings: _*).
    settings(name := "EngineScalaJS")
