import scala.util.Try
import scala.sys.process._
import Process._
import Keys._

// If you get an error like this: 'java.io.IOException: Cannot run program "yarn": error=2, No such file or directory',
// install Yarn (see https://yarnpkg.com/en/docs/install) --JAB (7/21/14) (10/18/16) --Ruoshui (01/15/21)

lazy val yarn = inputKey[Unit]("Runs Yarn commands from within SBT")

yarn := {
  val args = sbt.complete.Parsers.spaceDelimited("<arg>").parsed
  Process("yarn" +: args, baseDirectory.value).!(streams.value.log)
}

lazy val yarnInstall = taskKey[Seq[File]]("Runs `yarn install` from within SBT")

yarnInstall := {
  val log = streams.value.log
  if (!yarnIntegrity.value.exists || yarnIntegrity.value.olderThan(packageJson.value))
    Process(Seq("yarn", "install", "--ignore-optional"), baseDirectory.value).!(log)
  nodeDeps.value
}

watchSources += packageJson.value

lazy val yarnBuild = taskKey[Unit]("Runs `yarn run build` from within SBT")


yarnBuild := {
  val targetJS = (classDirectory in Compile).value / "js" / "tortoise-engine.js"
  val log = streams.value.log
  if (allJSSources.value exists (_.newerThan(targetJS)))
    Process(Seq("yarn", "run", "build:prod"), baseDirectory.value).!(log)
}

yarnBuild := (yarnBuild.dependsOn(yarnInstall)).value

watchSources ++= allJSSources.value

lazy val packageJson = Def.task[File] {
  baseDirectory.value / "package.json"
}

lazy val yarnIntegrity = Def.task[File] {
  baseDirectory.value / "node_modules" / ".yarn-integrity"
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

lazy val jsSources = Def.task[Seq[File]] {
  listFilesRecursively((classDirectory in Compile).value / "js")
}

def listFilesRecursively(f: File): Seq[File] = {
  val (dirs, files) = f.listFiles.partition(_.isDirectory)
  (files ++ (dirs flatMap listFilesRecursively)).toSeq
}
