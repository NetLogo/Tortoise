import scala.util.Try

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



lazy val grunt = taskKey[Seq[File]]("Runs `grunt` from within SBT")

grunt := {
  val targetJS = (classDirectory in Compile).value / "js" / "tortoise-engine.js"
  installGrunt.value
  if (coffeeSources.value exists (_.newerThan(targetJS)))
    Process("grunt").!(streams.value.log)
  Seq() // Wrong, but it works how I want it to...
}

grunt <<= grunt.dependsOn(npmInstall)

resourceGenerators in Compile <+= grunt

watchSources ++= coffeeSources.value



lazy val installGrunt = Def.task[Unit] {
  val versionStr = Try(Process(Seq("grunt", "--version")).!!).toOption getOrElse "Grunt's not there"
  if (!versionStr.contains("grunt-cli"))
    Process(Seq("npm", "install", "-g", "grunt-cli")).!(streams.value.log)
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

lazy val gruntSources = Def.task[Seq[File]] {
  listFilesRecursively((classDirectory in Compile).value / "js")
}

def listFilesRecursively(f: File): Seq[File] = {
  val (dirs, files) = f.listFiles.partition(_.isDirectory)
  (files ++ (dirs flatMap listFilesRecursively)).toSeq
}
