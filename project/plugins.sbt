scalacOptions += "-deprecation"

libraryDependencies +=
  "classycle" % "classycle" % "1.4.1" from
    "http://ccl.northwestern.edu/devel/classycle-1.4.1.jar"

resolvers += Resolver.url(
  "bintray-sbt-plugin-releases",
    url("http://dl.bintray.com/content/sbt/sbt-plugin-releases"))(
        Resolver.ivyStylePatterns)

addSbtPlugin("me.lessis" % "bintray-sbt" % "0.1.2")

// prevents noise from bintray stuff
libraryDependencies +=
  "org.slf4j" % "slf4j-nop" % "1.7.12"

resolvers += Resolver.url(
  "publish-versioned-plugin-releases",
    url("http://dl.bintray.com/content/netlogo/publish-versioned"))(
        Resolver.ivyStylePatterns)

addSbtPlugin("org.nlogo" % "publish-versioned-plugin" % "2.0")

addSbtPlugin("org.scala-js" % "sbt-scalajs" % "0.6.5")

resolvers += "sonatype-releases" at "https://oss.sonatype.org/content/repositories/releases/"

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.8.0")
