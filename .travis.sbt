// All Travis-Specific settings should go in this file
concurrentRestrictions in Global := Seq(
  Tags.limit(Tags.Test, 2),
  Tags.limitSum(2, Tags.CPU, Tags.Untagged)
)

logBuffered in Test := false
