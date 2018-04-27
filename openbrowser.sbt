import scala.sys.process._

lazy val browsableFailureReport = settingKey[java.io.File]("location for browser failure report")

browsableFailureReport := {
  baseDirectory.value / "netlogo-web" / "target" / "last-test-run-reports" / "index.html"
}

TaskKey[Unit]("browseFailures") := {
  import scala.sys.process.Process
  s"./browsefailures ${browsableFailureReport.value.getAbsolutePath}" ! streams.value.log
}
