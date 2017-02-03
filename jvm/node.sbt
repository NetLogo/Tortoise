import scala.util.Try

// If you get an error like this: 'java.io.IOException: Cannot run program "npm": error=2, No such file or directory',
// install NPM onto your path (`apt install node npm` for Linux users), and then install the Grunt command line tools
// (`sudo npm install -g grunt-cli`).  Ensure that NodeJS is runnable by typing `node`, or Grunt will fail.  If Node
// Node isn't there, try something like `sudo ln -s /usr/bin/nodejs /usr/local/bin/node` and then try again. --JAB (7/21/14)

lazy val npm = inputKey[Unit]("Runs NPM commands from within SBT")

npm := {
  val args = sbt.complete.Parsers.spaceDelimited("<arg>").parsed
  Process("npm" +: args, baseDirectory.value).!(streams.value.log)
}



lazy val npmInstall = taskKey[Seq[File]]("Runs `npm install` from within SBT")

npmInstall := {
  if (nodeDeps.value.isEmpty || (nodeDeps.value exists (_.olderThan(packageJson.value))))
    Process(Seq("npm", "install"), baseDirectory.value).!(streams.value.log)
  nodeDeps.value
}

watchSources += packageJson.value



lazy val grunt = taskKey[Seq[File]]("Runs `grunt` from within SBT")

grunt := {
  val targetJS = (classDirectory in Compile).value / "js" / "tortoise-engine.js"
  installGrunt.value
  if (allJSSources.value exists (_.newerThan(targetJS)))
    Process("grunt", baseDirectory.value).!(streams.value.log)
  Seq()
}

grunt := (grunt.dependsOn(npmInstall)).value

resourceGenerators in Compile += grunt.taskValue

watchSources ++= allJSSources.value



lazy val installGrunt = Def.task[Unit] {
  val versionStr = Try(Process(Seq("grunt", "--version")).!!).toOption getOrElse "Grunt's not there"
  if (!versionStr.contains("grunt-cli"))
    Process(Seq("npm", "install", "-g", "grunt-cli"), baseDirectory.value).!(streams.value.log)
}

lazy val packageJson = Def.task[File] {
  baseDirectory.value / "package.json"
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
  (baseDirectory.value / "src" / "main" / "scalajs").listFiles.filter(_.isFile)
}

lazy val gruntSources = Def.task[Seq[File]] {
  listFilesRecursively((classDirectory in Compile).value / "js")
}

def listFilesRecursively(f: File): Seq[File] = {
  val (dirs, files) = f.listFiles.partition(_.isDirectory)
  (files ++ (dirs flatMap listFilesRecursively)).toSeq
}
