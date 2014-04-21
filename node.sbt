lazy val npm = inputKey[Unit]("Runs NPM commands from within SBT")

npm := {
  val args = sbt.complete.Parsers.spaceDelimited("<arg>").parsed
  Process("npm" +: args).!(streams.value.log)
}

lazy val grunt = taskKey[Seq[File]]("Runs `grunt` from within SBT")

grunt := {
  val targetJS = (classDirectory in Compile).value / "js" / "tortoise-engine.js"
  if (coffeeSources.value exists (_.newerThan(targetJS)))
    Process("grunt").!(streams.value.log)
  Seq() // Wrong, but it works how I want it to...
}

resourceGenerators in Compile <+= grunt

watchSources ++= coffeeSources.value

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
