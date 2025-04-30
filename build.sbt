import sbtcrossproject.CrossPlugin.autoImport.CrossType
import sbtcrossproject.CrossProject
import org.scalajs.sbtplugin.ScalaJSCrossVersion

val nlDependencyVersion       = "7.0.0-internal1-a87d725"

val parserJsDependencyVersion = "0.4.0-a87d725"

val scalazVersion             = "7.2.35"

val playJsonVersion           = "2.9.4"

val commonSettings =
  Seq(
    organization  := "org.nlogo",
    licenses      += ("GPL-2.0", url("http://opensource.org/licenses/GPL-2.0")),
    version       := "1.0",

    crossPaths    := false, // we're not cross-building for different Scala versions
    scalaVersion  := "2.12.17",
    scalacOptions ++=
      "-deprecation -unchecked -feature -Xcheckinit -encoding us-ascii -Xlint -Xfatal-warnings -Ywarn-value-discard -language:_ -Xmax-classfile-name 240".split(" ").toSeq,

    resolvers     += "netlogoheadless" at "https://dl.cloudsmith.io/public/netlogo/netlogo/maven/",
    libraryDependencies ++= Seq(
      "org.nlogo"         %  "netlogoheadless" % nlDependencyVersion,
      "org.scalaz"        %% "scalaz-core"     % scalazVersion,
      "com.typesafe.play" %% "play-json"       % playJsonVersion,
      "com.lihaoyi"       %% "scalatags"       % "0.12.0"   % "test",
      "org.scalatest"     %% "scalatest"       % "3.2.16"   % "test",
      "org.scalatestplus" %% "scalacheck-1-15" % "3.2.11.0" % "test",
      "org.skyscreamer"   %  "jsonassert"      % "1.5.1"    % "test",
      "org.reflections"   %  "reflections"     % "0.9.12"   % "test",
      "org.nlogo"         %  "netlogoheadless" % nlDependencyVersion % "test" classifier "tests"
    ),

    Compile / resourceDirectory := (root / baseDirectory).value / "resources" / "main",
    Test    / resourceDirectory := (root / baseDirectory).value / "resources" / "test",

    isSnapshot := true, // Used by the publish-versioned plugin
    publishTo  := { Some("Cloudsmith API" at "https://maven.cloudsmith.io/netlogo/tortoise/") },

    ivyLoggingLevel := UpdateLogging.Quiet, // only log problems plz
    onLoadMessage   := "",

    Test / testOptions += Tests.Argument("-oT"),
    Compile / console / scalacOptions := scalacOptions.value.filterNot(_ == "-Xlint")
  )

lazy val stylecheck = taskKey[Unit]("Run all sub-project scalastyle checks.")

stylecheck := {
  (compilerCore / Compile / scalastyle).toTask("").value
  (macrosCore   / Compile / scalastyle).toTask("").value
  (compilerJVM  / Compile / scalastyle).toTask("").value
  (compilerJS   / Compile / scalastyle).toTask("").value
  (netLogoWeb   / Compile / scalastyle).toTask("").value
  (engine       / Compile / scalastyle).toTask("").value
}

lazy val rootFile = file(".")
lazy val root     = (project in rootFile)

// These projects are just for scalastyle on shared sources
lazy val compilerCore = (project in file("compiler/shared")).
  settings(Compile / compile / skip := true)

lazy val macrosCore = (project in file("macros")).
  settings(Compile / compile / skip := true)

lazy val compiler = CrossProject("compiler", file("compiler"))(JSPlatform, JVMPlatform).crossType(CrossType.Full).
  dependsOn(macros % "compile-internal->compile;test-internal->test").
  settings(Depend.settings: _*).
  settings(commonSettings: _*).
  jvmSettings(Depend.settings: _*).
  jvmSettings(
    name :=  "CompilerJVM",
    // this ensures that generated test reports are updated each run
    (Test / test) := ((Test / test).dependsOn {
      Def.task[Unit] {
        sbt.IO.delete(target.value / "last-test-run-reports")
      }
    }).value
  ).jsSettings(
    name                                 := "CompilerJS",
    Compile / fullOptJS / artifactPath := ((Compile / fullOptJS / crossTarget).value / "tortoise-compiler.js"),
    packageJSDependencies / skip         := false, // bundles all dependencies in with generated JS
    testFrameworks                       := List(new TestFramework("utest.runner.Framework")),
    libraryDependencies                  ++= {
      Seq(
        "com.lihaoyi"       %   "utest"       % "0.7.11" cross ScalaJSCrossVersion.binary,
        "org.nlogo"         %   "parser-js"   % parserJsDependencyVersion cross ScalaJSCrossVersion.binary,
        "com.typesafe.play" %%% "play-json"   % playJsonVersion,
        "org.scalaz"        %%% "scalaz-core" % scalazVersion)
    }
  )

lazy val compilerJS  = compiler.js

lazy val compilerJVM = compiler.jvm

lazy val recompileWhenExtensionsChange = taskKey[Unit]("Recompiles the macros when extension files change")

recompileWhenExtensionsChange := {
  val extensionsDir  = (root / baseDirectory).value / "engine" / "src" / "main" / "coffee" / "extensions"
  val extensionCache = streams.value.cacheStoreFactory.make("extensions_cache")
  val cleanMacros    = () => {
    // I would love to just do a `(macrosJVM / clean).value`, but such things are evaluated independently
    // of the actual running of this anonymous function, meaning the clean happens every time.  Perhaps a
    // more skilled sbt-wrangler will come along and improve this, but for now this works.
    // -Jeremy B August 2020
    IO.delete((macrosJVM / baseDirectory).value / "target" )
    IO.delete((macrosJS / baseDirectory).value / "target" )
  }
  val cacheCheck     = NonSourceCache.cached(extensionCache, FilesInfo.lastModified)(cleanMacros)
  val extensionFiles = (extensionsDir ** "*.json").get
  cacheCheck(extensionFiles.toSet)
}

lazy val macros = CrossProject("macros", file("macros"))(JSPlatform, JVMPlatform).crossType(CrossType.Pure).
  settings(commonSettings: _*).
  settings(
    libraryDependencies ++= Seq(
      "org.scala-lang" %  "scala-reflect" % scalaVersion.value,
      "org.scalaz"     %% "scalaz-core"   % scalazVersion),
    (Compile / compile) := ((Compile / compile) dependsOn (root / recompileWhenExtensionsChange)).value
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

    Test / javaOptions ++= Seq(
      "--add-opens", "java.base/sun.net.www.protocol.http=ALL-UNNAMED"
    , "-Xss8m"
    ),
    Test / baseDirectory := rootFile,
    Test / fork := true,

    // these tasks force the regeneration of the tortoise.js source on each build
    Compile / resourceGenerators += Def.task {
      (compilerJS / Compile / fullOptJS).value
      val tortoiseJsFile = (compilerJS / Compile / fullOptJS / artifactPath).value
      val files          = Seq[File](tortoiseJsFile, tortoiseJsFile.getParentFile / (tortoiseJsFile.getName + ".map"))
      val copies         = files.map((f: File) => (f, resourceManaged.value / f.getName))
      IO.copy(copies)
      copies.map(_._2)
    }.taskValue,

    Compile / resourceGenerators += Def.task {
      (engine / Compile / build).value
      val sourceFile = (engine / Compile / classDirectory).value / "js" / "tortoise" / "shim" / "engine-scala.js"
      val destFile   = (Compile / classDirectory).value / "engine-scala.js"
      IO.copyFile(sourceFile, destFile)
      val engineSource = (engine / Compile / classDirectory).value / "js" / "tortoise-engine.js"
      val engineDest   = (Compile / classDirectory).value / "tortoise-engine.js"
      IO.copyFile(engineSource, engineDest)
      Seq()
    }.taskValue,

    cleanGeneratedSources := { IO.delete(resourceManaged.value) },
    cleanFiles            += resourceManaged.value,
    compile               := ((Compile / compile).dependsOn(
      cleanGeneratedSources,
      Compile / managedResources,
      compilerJS / clean,
      compilerJS / Compile / fullOptJS)).value)

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
      val engineFile  = (Compile / fullOptJS / artifactPath).value
      val destFile    = (Compile / classDirectory).value / "js" / "tortoise" / "shim" / "engine-scala.js"
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
    build := build.dependsOn(Compile / fullOptJS).value,
    build := grunt.dependsOn(build).value
  )
