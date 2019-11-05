import sbtcrossproject.CrossPlugin.autoImport.CrossType
import sbtcrossproject.CrossProject
import org.scalajs.sbtplugin.ScalaJSPlugin.autoImport.{ fullOptJS, packageJSDependencies }
import org.scalajs.sbtplugin.ScalaJSCrossVersion
import org.scalastyle.sbt.ScalastylePlugin.projectSettings

val nlDependencyVersion       = "6.1.1-3ea64fc"

val parserJsDependencyVersion = "0.3.0"

val scalazVersion             = "7.2.29"

val commonSettings =
  Seq(
    organization  := "org.nlogo",
    licenses      += ("GPL-2.0", url("http://opensource.org/licenses/GPL-2.0")),
    version       := "1.0",
    // Compilation settings
    crossPaths    := false, // we're not cross-building for different Scala versions
    scalaVersion  := "2.12.10",
    scalacOptions ++=
      "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -Xlint -Xfatal-warnings -Ywarn-value-discard -language:_ -Xmax-classfile-name 240".split(" ").toSeq,
    // Dependencies
    resolvers           += sbt.Resolver.bintrayRepo("netlogo", "NetLogoHeadless"),
    libraryDependencies ++= Seq(
      "org.nlogo"         %  "netlogoheadless" % nlDependencyVersion,
      "org.scalaz"        %% "scalaz-core"     % scalazVersion,
      "com.lihaoyi"       %% "scalatags"       % "0.7.0"  % "test",
      "org.scalatest"     %% "scalatest"       % "3.0.8"  % "test",
      "org.skyscreamer"   %  "jsonassert"      % "1.5.0"  % "test",
      "org.reflections"   %  "reflections"     % "0.9.11" % "test",
      // Do not update scalacheck to 1.14.1+ until the fix for the below issue is released.
      // It breaks JsonShapeConversiontTest.scala -Jeremy B November 2019
      // https://github.com/typelevel/scalacheck/issues/577
      "org.scalacheck"    %% "scalacheck"      % "1.14.0" % "test",
      "com.typesafe.play" %% "play-json"       % "2.7.4",
      // Bring in headless test code/framework for our tests
      "org.nlogo"         %  "netlogoheadless" % nlDependencyVersion % "test" classifier "tests"),
    // Path Management
    resourceDirectory in Compile := (baseDirectory in root).value / "resources" / "main",
    resourceDirectory in Test    := (baseDirectory in root).value / "resources" / "test",
    // Build and publication settings
    isSnapshot                   := true, // Used by the publish-versioned plugin
    bintrayRepository            := "TortoiseAux",
    bintrayOrganization          := Option("netlogo"),
    // Logging and Output settings
    ivyLoggingLevel              := UpdateLogging.Quiet, // only log problems plz
    onLoadMessage                := "",
    // show test failures again at end, after all tests complete.
    // T gives truncated stack traces; change to G if you need full.
    testOptions in Test += Tests.Argument("-oT"),
    scalacOptions in Compile in console := scalacOptions.value.filterNot(_ == "-Xlint"))

lazy val stylecheck = taskKey[Unit]("Run all sub-project scalastyle checks.")

stylecheck := {
  (scalastyle in Compile in compilerCore).toTask("").value
  (scalastyle in Compile in macrosCore  ).toTask("").value
  (scalastyle in Compile in compilerJVM ).toTask("").value
  (scalastyle in Compile in compilerJS  ).toTask("").value
  (scalastyle in Compile in netLogoWeb  ).toTask("").value
  (scalastyle in Compile in engine      ).toTask("").value
}

lazy val root = (project in file("."))

// These projects are just for scalastyle on shared sources
lazy val compilerCore = (project in file("compiler/shared")).
  settings(skip in (Compile, compile) := true)

lazy val macrosCore = (project in file("macros")).
  settings(skip in (Compile, compile) := true)

lazy val compiler = CrossProject("compiler", file("compiler"))(JSPlatform, JVMPlatform).crossType(CrossType.Full).
  dependsOn(macros % "compile-internal->compile;test-internal->test").
  settings(Depend.settings: _*).
  settings(commonSettings: _*).
  jvmSettings(Depend.settings: _*).
  jvmSettings(
    name :=  "CompilerJVM",
    // this ensures that generated test reports are updated each run
    (test in Test) := ((test in Test).dependsOn {
      Def.task[Unit] {
        sbt.IO.delete(target.value / "last-test-run-reports")
      }
    }).value
  ).jsSettings(
    name                                 := "CompilerJS",
    artifactPath in (Compile, fullOptJS) := ((crossTarget in (Compile, fullOptJS)).value / "tortoise-compiler.js"),
    skip in packageJSDependencies        := false, // bundles all dependencies in with generated JS
    testFrameworks                       += new TestFramework("utest.runner.Framework"),
    libraryDependencies                  ++= {
      import org.scalajs.sbtplugin.ScalaJSPlugin.autoImport.toScalaJSGroupID
      Seq(
        "com.lihaoyi"       %   "utest"       % "0.4.8" cross ScalaJSCrossVersion.binary,
        "org.nlogo"         %   "parser-js"   % parserJsDependencyVersion cross ScalaJSCrossVersion.binary,
        "com.typesafe.play" %%% "play-json"   % "2.6.11",
        "org.scalaz"        %%% "scalaz-core" % scalazVersion)
    })

lazy val compilerJS  = compiler.js

lazy val compilerJVM = compiler.jvm

lazy val macros = CrossProject("macros", file("macros"))(JSPlatform, JVMPlatform).crossType(CrossType.Pure).
  settings(commonSettings: _*).
  settings(
    libraryDependencies ++= Seq(
      "org.scala-lang" %  "scala-reflect" % scalaVersion.value,
      "org.scalaz"     %% "scalaz-core"   % scalazVersion)
  )

lazy val macrosJS  = macros.js

lazy val macrosJVM = macros.jvm

lazy val cleanGeneratedSources = taskKey[Unit]("deletes generated resources")

lazy val netLogoWeb: Project = (project in file("netlogo-web")).
  dependsOn(compilerJVM % "compile-internal->compile;test-internal->test").
  dependsOn(compilerJS  % "compile-internal->compile").
  settings(commonSettings: _*).
  settings(FastMediumSlow.settings: _*).
  settings(
    name                :=  "NetLogoWebJS",
    libraryDependencies ++= Seq(
      "org.nlogo" % "netlogoheadless" % nlDependencyVersion % "test"
    ),
    // these tasks force the regeneration of the tortoise.js source on each build
    resourceGenerators in Compile += Def.task {
      (fullOptJS in Compile in compilerJS).value
      val tortoiseJsFile = (artifactPath in fullOptJS in Compile in compilerJS).value
      val files          = Seq[File](tortoiseJsFile, tortoiseJsFile.getParentFile / (tortoiseJsFile.getName + ".map"))
      val copies         = files.map((f: File) => (f, resourceManaged.value / f.getName))
      IO.copy(copies)
      copies.map(_._2)
    }.taskValue,
    resourceGenerators in Compile += Def.task {
      (build in Compile in engine).value
      val sourceFile = (classDirectory in Compile in engine).value / "js" / "tortoise" / "shim" / "engine-scala.js"
      val destFile   = (classDirectory in Compile).value / "engine-scala.js"
      IO.copyFile(sourceFile, destFile)
      val engineSource = (classDirectory in Compile in engine).value / "js" / "tortoise-engine.js"
      val engineDest   = (classDirectory in Compile).value / "tortoise-engine.js"
      IO.copyFile(engineSource, engineDest)
      Seq()
    }.taskValue,
    cleanGeneratedSources := { IO.delete(resourceManaged.value) },
    cleanFiles            += resourceManaged.value,
    compile               := ((compile in Compile).dependsOn(
      cleanGeneratedSources,
      managedResources in Compile,
      clean in compilerJS,
      fullOptJS in Compile in compilerJS)).value)

lazy val build = taskKey[Unit]("Does a full build of the engine Javascript artifact.")

// I want grunt to depend on our custom build task.  This is the easiest way I've found
// to get that to happen while keeping it's definition in a separate node.sbt file.
lazy val grunt = taskKey[Unit]("Runs `grunt` from within SBT")

lazy val engine: Project =
  (project in file("engine")).
  enablePlugins(ScalaJSPlugin).
  settings(commonSettings: _*).
  settings(
    name := "EngineScalaJS",
    libraryDependencies += "org.nlogo" % "parser-js" % parserJsDependencyVersion cross ScalaJSCrossVersion.binary,
    build := {
      val engineFile  = (artifactPath in fullOptJS in Compile).value
      val destFile    = (classDirectory in Compile).value / "js" / "tortoise" / "shim" / "engine-scala.js"
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
    },
    build := build.dependsOn(fullOptJS in Compile).value,
    build := grunt.dependsOn(build).value
  )
