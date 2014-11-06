
lazy val browsableFailureReport = settingKey[File]("location for browser failure report")

browsableFailureReport := {
  target.value / "last-test-run-reports" / "index.html"
}

TaskKey[Unit]("browseFailures") := {
  import scala.sys.process.Process
  s"./browsefailures ${browsableFailureReport.value.getAbsolutePath}" ! streams.value.log
}
