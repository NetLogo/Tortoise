import scala.util.Try
import scala.sys.process._
import Process._
import Keys._

// If you get an error like this: 'java.io.IOException: Cannot run program "yarn": error=2, No such file or directory',
// install Yarn (see https://yarnpkg.com/en/docs/install), and then install the Grunt command line tools
// (`sudo yarn install -g grunt-cli`).  Ensure that NodeJS is runnable by typing `node`, or Grunt will fail.  If
// Node isn't there, try something like `sudo ln -s /usr/bin/nodejs /usr/local/bin/node` and then try again. --JAB (7/21/14) (10/18/16)

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

lazy val grunt = taskKey[Unit]("Runs `grunt` from within SBT")

grunt := {
  val targetJS = (classDirectory in Compile).value / "js" / "tortoise-engine.js"
  val log = streams.value.log
  installGrunt.value
  if (allJSSources.value exists (_.newerThan(targetJS)))
    Process("grunt", baseDirectory.value).!(log)
}

grunt := (grunt.dependsOn(yarnInstall)).value

watchSources ++= allJSSources.value

lazy val installGrunt = Def.task[Unit] {
  val versionStr = Try(Process(Seq("grunt", "--version")).!!).toOption getOrElse "Grunt's not there"
  val log = streams.value.log
  if (!versionStr.contains("grunt-cli"))
    Process(Seq("yarn", "global", "add", "grunt-cli"), baseDirectory.value).!(log)
}

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

lazy val gruntSources = Def.task[Seq[File]] {
  listFilesRecursively((classDirectory in Compile).value / "js")
}

def listFilesRecursively(f: File): Seq[File] = {
  val (dirs, files) = f.listFiles.partition(_.isDirectory)
  (files ++ (dirs flatMap listFilesRecursively)).toSeq
}
