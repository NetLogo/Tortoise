import scala.util.Try
import scala.sys.process._
import Process._
import Keys._

def runNpm(log: Logger, runDir: File, args: Seq[String], env: (String, String)*): Unit = {
  val npmArgs = Seq("npm") ++ args
  log.info(npmArgs.mkString(" "))
  val result = Process(npmArgs, runDir, env:_*).!(log)
  if (result != 0) {
    throw new MessageOnlyException("npm command indicated an unsuccessful result.")
  }
  ()
}

lazy val npmInstall = taskKey[Seq[File]]("Runs `npm install` from within SBT")
npmInstall := {
  val log = streams.value.log
  if (!npmIntegrity.value.exists || npmIntegrity.value.olderThan(packageJson.value))
    runNpm(
      log,
      baseDirectory.value,
      Seq("install", "--ignore-optional")
    )
  nodeDeps.value
}

watchSources += packageJson.value

lazy val coffeelint = taskKey[Unit]("lint coffeescript files")
coffeelint := Def.task {
  runNpm(
    streams.value.log,
    baseDirectory.value,
    Seq("exec", "--", "coffeelint", "-f", "coffeelint.json", (baseDirectory.value / "src" / "main" / "coffee").toString)
  )
}.dependsOn(npmInstall).value

lazy val grunt = taskKey[Unit]("Runs `grunt` from within SBT")
grunt := Def.task {
  val targetJS = (Compile / classDirectory).value / "js" / "tortoise-engine.js"
  val log = streams.value.log
  if (allJSSources.value exists (_.newerThan(targetJS)))
    runNpm(
      log,
      baseDirectory.value,
      Seq("exec", "--", "grunt")
    )
}.dependsOn(npmInstall).value

watchSources ++= allJSSources.value

lazy val packageJson = Def.task[File] {
  baseDirectory.value / "package.json"
}

lazy val npmIntegrity = Def.task[File] {
  baseDirectory.value / "node_modules" / ".package-lock.json"
}

lazy val nodeDeps = Def.task[Seq[File]] {
  val nodeModules = baseDirectory.value / "node_modules"
  if (nodeModules.exists)
    listFilesRecursively(nodeModules)
  else
    Seq()
}

lazy val allJSSources = Def.task[Seq[File]] {
  coffeeSources.value ++ scalaJSSources.value
}

lazy val coffeeSources = Def.task[Seq[File]] {
  listFilesRecursively(baseDirectory.value / "src" / "main" / "coffee")
}

lazy val scalaJSSources = Def.task[Seq[File]] {
  (baseDirectory.value / "src" / "main" / "scala").listFiles.filter(_.isFile)
}

lazy val gruntSources = Def.task[Seq[File]] {
  listFilesRecursively((Compile / classDirectory).value / "js")
}

def listFilesRecursively(f: File): Seq[File] = {
  val (dirs, files) = f.listFiles.partition(_.isDirectory)
  (files ++ (dirs flatMap listFilesRecursively)).toSeq
}
