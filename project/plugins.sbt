scalacOptions += "-deprecation"

libraryDependencies +=
  "classycle" % "classycle" % "1.4.2" from
    "https://s3.amazonaws.com/ccl-artifacts/classycle-1.4.2.jar"

addSbtPlugin("org.foundweekends" % "sbt-bintray" % "0.5.4")

resolvers += Resolver.bintrayIvyRepo("netlogo", "publish-versioned")

addSbtPlugin("org.nlogo" % "publish-versioned-plugin" % "2.2")

addSbtPlugin("org.portable-scala" % "sbt-scalajs-crossproject" % "0.6.1")

addSbtPlugin("org.scala-js" % "sbt-scalajs" % "0.6.29")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "1.0.0")

addSbtPlugin("com.timushev.sbt" % "sbt-updates" % "0.5.0")
