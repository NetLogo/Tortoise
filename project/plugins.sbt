scalacOptions += "-deprecation"

libraryDependencies +=
  "classycle" % "classycle" % "1.4.2" from
    "http://ccl-artifacts.s3-website-us-east-1.amazonaws.com/classycle-1.4.2.jar"

resolvers += Resolver.url(
  "bintray-sbt-plugin-releases",
    url("http://dl.bintray.com/content/sbt/sbt-plugin-releases"))(
        Resolver.ivyStylePatterns)

addSbtPlugin("org.foundweekends" % "sbt-bintray" % "0.5.1")

resolvers += Resolver.url(
  "publish-versioned-plugin-releases",
    url("http://dl.bintray.com/content/netlogo/publish-versioned"))(
        Resolver.ivyStylePatterns)

addSbtPlugin("org.nlogo" % "publish-versioned-plugin" % "2.0")

addSbtPlugin("org.scala-js" % "sbt-scalajs" % "0.6.18")

resolvers += "sonatype-releases" at "https://oss.sonatype.org/content/repositories/releases/"

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.9.0")
