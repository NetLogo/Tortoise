scalacOptions += "-deprecation"

libraryDependencies +=
  "classycle" % "classycle" % "1.4.2" from
    "http://ccl-artifacts.s3-website-us-east-1.amazonaws.com/classycle-1.4.2.jar"

addSbtPlugin("org.foundweekends" % "sbt-bintray" % "0.5.4")

resolvers += Resolver.bintrayIvyRepo("netlogo", "publish-versioned")

addSbtPlugin("org.nlogo" % "publish-versioned-plugin" % "2.2")

addSbtPlugin("org.scala-js" % "sbt-scalajs" % "0.6.22")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "1.0.0")

addSbtPlugin("com.timushev.sbt" % "sbt-updates" % "0.3.4")
