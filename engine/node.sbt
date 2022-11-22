import scala.util.Try
import scala.sys.process._
import Process._
import Keys._

lazy val npm = inputKey[Unit]("Runs npm commands from within SBT")

npm := {
  val args = sbt.complete.Parsers.spaceDelimited("<arg>").parsed
  Process("npm" +: args, baseDirectory.value).!(streams.value.log)
}

lazy val npmInstall = taskKey[Seq[File]]("Runs `npm install` from within SBT")

npmInstall := {
  val log = streams.value.log
  if (!npmIntegrity.value.exists || npmIntegrity.value.olderThan(packageJson.value))
    Process(Seq("npm", "install", "--ignore-optional"), baseDirectory.value).!(log)
  nodeDeps.value
}

watchSources += packageJson.value

lazy val grunt = taskKey[Unit]("Runs `grunt` from within SBT")

grunt := {
  val targetJS = (Compile / classDirectory).value / "js" / "tortoise-engine.js"
  val log = streams.value.log
  if (allJSSources.value exists (_.newerThan(targetJS)))
    Process("./node_modules/grunt-cli/bin/grunt", baseDirectory.value).!(log)
}

grunt := (grunt.dependsOn(npmInstall)).value

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
