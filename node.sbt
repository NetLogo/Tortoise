lazy val npm = inputKey[Unit]("Runs NPM commands from within SBT")

npm := {
  val args = sbt.complete.Parsers.spaceDelimited("<arg>").parsed
  Process("npm" +: args).!(streams.value.log)
}

lazy val grunt = inputKey[Unit]("Runs Grunt commands from within SBT")

grunt := {
  val args = sbt.complete.Parsers.spaceDelimited("<arg>").parsed
  Process("grunt" +: args).!(streams.value.log)
}
