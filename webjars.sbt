import java.io.FileOutputStream
import java.util.jar.JarFile

// This file (namely, `extractJS`) makes it so that browsers and non-JVM JS engines can
// get at WebJar JS files --JAB (3/27/14)


lazy val listDeps  = Def.task[Seq[File]] {
  Classpaths.managedJars(Compile, classpathTypes.value, update.value) map (_.data)
}

lazy val extractJS = Def.task[Seq[File]] {
  val jarToFilenamesMap     = Map("lodash" -> Seq("lodash.js"), "mori" -> Seq("mori.js"), "requirejs" -> Seq("require.js"))
  val jars                  = listDeps.value
  val outDir                = (resourceManaged in Compile).value / "js"
  IO.createDirectory(outDir)
  val fileToFilenamesMap    = correlateJarFiles(jarToFilenamesMap, jars)
  val jarFileToFilenamesMap = fileToFilenamesMap map { case (k, v) => new JarFile(k) -> v }
  streams.value.log.info("Extracting JS files...")
  extractFiles(jarFileToFilenamesMap, outDir)
}

resourceGenerators in Compile <+= extractJS

def extractFiles(jarFileToFilenamesMap: Map[JarFile, Seq[String]], outDir: File): Seq[File] = {
  jarFileToFilenamesMap.flatMap {
    case (jar, fns) =>
      import scala.collection.JavaConverters._
      val entries      = jar.entries.asScala
      val entryFnPairs = fns flatMap (fn => entries.find(_.getName.endsWith(s"/$fn")).toSeq map ((_, fn)))
      entryFnPairs map {
        case (entry, fn) =>
          val file = outDir / fn
          file.createNewFile()
          val is = jar.getInputStream(entry)
          val os = new FileOutputStream(file)
          sbt.IO.transfer(is, os)
          file
      }
  }.toSeq
}

def correlateJarFiles(descToFilenamesMap: Map[String, Seq[String]], jars: Seq[File]): Map[File, Seq[String]] = {
  descToFilenamesMap flatMap {
    case (k, v) =>
      jars.find (
        _.getName.startsWith(k)
      ) map (
        newKey => Map(newKey -> v)
      ) getOrElse Map.empty
  }
}
