scalacOptions += "-deprecation"

addSbtPlugin("org.ensime" % "ensime-sbt-cmd" % "0.1.2")

resolvers += Resolver.url(
  "bintray-sbt-plugin-releases",
    url("http://dl.bintray.com/content/sbt/sbt-plugin-releases"))(
        Resolver.ivyStylePatterns)

addSbtPlugin("me.lessis" % "bintray-sbt" % "0.1.1")

// prevents noise from bintray stuff
libraryDependencies +=
  "org.slf4j" % "slf4j-nop" % "1.6.0"

resolvers += Resolver.url(
  "publish-versioned-plugin-releases",
    url("http://dl.bintray.com/content/netlogo/publish-versioned"))(
        Resolver.ivyStylePatterns)

addSbtPlugin("org.nlogo" % "publish-versioned-plugin" % "1.0")
