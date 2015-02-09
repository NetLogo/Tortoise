import scala.util.Try

// If you get an error like this: 'java.io.IOException: Cannot run program "npm": error=2, No such file or directory',
// install NPM onto your path (`apt install node npm` for Linux users), and then install the Gulp command line tools
// (`sudo npm install -g gulp-cli`).  Ensure that NodeJS is runnable by typing `node`, or Gulp will fail.  If Node
// Node isn't there, try something like `sudo ln -s /usr/bin/nodejs /usr/local/bin/node` and then try again. --JAB (7/21/14)

lazy val npm = inputKey[Unit]("Runs NPM commands from within SBT")

npm := {
  val args = sbt.complete.Parsers.spaceDelimited("<arg>").parsed
  Process("npm" +: args).!(streams.value.log)
}



lazy val npmInstall = taskKey[Seq[File]]("Runs `npm install` from within SBT")

npmInstall := {
  if (nodeDeps.value.isEmpty || (nodeDeps.value exists (_.olderThan(packageJson.value))))
    Process(Seq("npm", "install")).!(streams.value.log)
  nodeDeps.value
}

watchSources += packageJson.value



lazy val gulp = taskKey[Seq[File]]("Runs `gulp` from within SBT")

gulp := {
  val targetJS = (classDirectory in Compile).value / "js" / "tortoise-engine.js"
  installGulp.value
  if (coffeeSources.value exists (_.newerThan(targetJS)))
    Process(Seq("gulp", "build")).!(streams.value.log)
  Seq() // Wrong, but it works how I want it to...
}

gulp <<= gulp.dependsOn(npmInstall)

resourceGenerators in Compile <+= gulp

watchSources ++= coffeeSources.value



lazy val installGulp = Def.task[Unit] {
  val versionStr = Try(Process(Seq("gulp", "--version")).!!).toOption getOrElse "Gulp's not there"
  if (!versionStr.contains("CLI version"))
    Process(Seq("npm", "install", "-g", "gulp-cli")).!(streams.value.log)
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

lazy val coffeeSources = Def.task[Seq[File]] {
  listFilesRecursively(baseDirectory.value / "src" / "main" / "coffee")
}

lazy val gulpSources = Def.task[Seq[File]] {
  listFilesRecursively((classDirectory in Compile).value / "js")
}

def listFilesRecursively(f: File): Seq[File] = {
  val (dirs, files) = f.listFiles.partition(_.isDirectory)
  (files ++ (dirs flatMap listFilesRecursively)).toSeq
}
