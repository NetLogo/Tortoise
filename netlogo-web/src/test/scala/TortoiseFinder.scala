// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.scalatest.{ Tag, BeforeAndAfterAll, exceptions },
    exceptions.TestPendingException

import
  org.nlogo.headless.test.{ AbstractFixture, Command, Finder, LanguageTest, NormalMode, TestMode }

import
  org.nlogo.tortoise.tags.{ LanguageTest => TortoiseLanguageTag}

private[tortoise] trait TortoiseFinder extends Finder with BeforeAndAfterAll with BrowserReporter with TestLogger {

  protected def freebies: Map[String, String]

  override def shouldRun(t: LanguageTest, mode: TestMode) =
    mode == NormalMode && super.shouldRun(t, mode)

  def genFixture(name: String): AbstractFixture = new TortoiseFixture(name, engine, notImplemented) {
    override def checkResult(mode: TestMode, reporter: String, expectedResult: String, actualResult: AnyRef): Unit = {
      annotatePrevious(s"""NetLogo reporter for: $reporter
                          |expected result: $expectedResult
                          |actualResult: $actualResult""".stripMargin)
      super.checkResult(mode, reporter, expectedResult, actualResult)
    }

    override def runCommand(command: Command, mode: TestMode): Unit = {
      annotate(s"NetLogo generated code for: ${command.command}")
      super.runCommand(command, mode)
    }
  }

  override def runTest(t: LanguageTest, mode: TestMode): Unit =
    loggingFailures(t.suiteName, t.testName, { super.runTest(t, mode) })

  override def extraTags: Seq[Tag] = Seq(TortoiseLanguageTag)

  override def withFixture[T](name: String)(body: (AbstractFixture) => T): T =
    freebies.get(name.stripSuffix(" (NormalMode)")) match {
      case None =>
        body(genFixture(name))
      case Some(excuse) =>
        try body(genFixture(name))
        catch {
          case _: TestPendingException => // ignore; we'll hit the fail() below
          case ex: Exception =>
            val message =
              if (excuse.contains("ASSUMES OPTIMIZATION"))
                excuse
              else
                s"$ex: LAME EXCUSE: $excuse"
            notImplemented(message)
        }
        fail(s"LAME EXCUSE WASN'T NEEDED: $excuse")
    }

  protected def notImplemented(s: String): Nothing = {
    info(s)
    throw new TestPendingException
  }

  // This silly little class exists to pull out language test files from dependencies, specifically headless and
  // netLogoWeb.  The language tests are shared from the NetLogo repo to here via this method.  The Reflections
  // dependency used to handle this, but it broke for unclear reasons during unrelated changes, and since it's
  // unsupported it seems best to just replace it with this quick-and-dirty function.  This probably all made way more
  // sense when headless was a seperate repo, too, but now it feels like there should be a much more straightforward
  // way.  -Jeremy B May 2025
  protected def getLanguageTestByClass[T](path: String, klass: Class[T]) = {
    import java.io.{ BufferedReader, File, InputStreamReader }
    import java.nio.file.{ Files, Path, Paths }
    import java.util.stream.Collectors
    import scala.jdk.CollectionConverters._
    import java.util.jar.{ JarFile }

    val loader = klass.getClassLoader()
    val jarUrl = klass.getProtectionDomain().getCodeSource().getLocation()
    val jarCheck = new File(jarUrl.getPath())

    val suites: Iterator[(String, String)] = if (jarCheck.isDirectory()) {
      val checkPath = Path.of(jarUrl.getPath(), path).toString()
      val testsDir = new File(checkPath)
      if (!testsDir.exists) {
        Seq().iterator
      } else {
        val files = testsDir.listFiles()
        val prefix = s"${checkPath}/"

        files.iterator
          .filter( (e) => !e.isDirectory() )
          .map   ( (e) => e.getPath() )
          .filter( (e) => e.endsWith(".txt") )
          .map   ( (e) => {
            (e.stripPrefix(prefix).stripSuffix(".txt"), Files.readString(Paths.get(e)))
          })
      }
    } else {
      val jarFile = new JarFile(new File(jarUrl.toURI()))
      val entries = jarFile.entries()
      val prefix = s"${path}/"

      entries.asScala
        .filter( (e) => !e.isDirectory() )
        .map   ( (e) => e.getName() )
        .filter( (e) => e.startsWith(prefix) && e.endsWith(".txt") )
        .map   ( (e) => {
          val stream = loader.getResourceAsStream(e)
          val reader = new BufferedReader(new InputStreamReader(stream))
          (e.stripPrefix(prefix).stripSuffix(".txt"), reader.lines().collect(Collectors.toList()).asScala.mkString("\n"))
        })
    }

    suites.toSeq.sorted
  }

  protected def getLanguageTestResources(path: String) = {
    val headlessSuites = getLanguageTestByClass(path, classOf[org.nlogo.headless.test.LanguageTest])
    val webSuites = getLanguageTestByClass(path, getClass())
    headlessSuites ++ webSuites
  }

}

class TestReporters extends Finder with TortoiseFinder {
  override def files = getLanguageTestResources("reporters")

  override val freebies = Map(
    "Version::Version_2D" -> "Assumes JVM NetLogo version numbers"
  )
}

class TestCommands extends Finder with TortoiseFinder {
  override def files = getLanguageTestResources("commands")

  import Freebies._
  override val freebies = Map[String, String](
    // requires handling of non-local exit (see in JVM NetLogo: `NonLocalExit`, `_report`, `_foreach`, `_run`)
    "Every::EveryLosesScope"  -> "NetLogo Web does not support distinct jobs"
  ) ++ incErrorDetectCommands ++ preferExtensionsCommands ++ headlessCommands ++ awaitingFixCommands
}

private[tortoise] object Freebies {

  def incErrorDetectCommands   = asFreebieMap(  incErrorDetectCommandNames,   incErrorDetectStr)
  def headlessCommands         = asFreebieMap(        headlessCommandNames,  headlessCommandStr)
  def preferExtensionsCommands = asFreebieMap(preferExtensionsCommandNames, preferExtensionsStr)
  def awaitingFixCommands      = asFreebieMap(     awaitingFixCommandNames,      awaitingFixStr)

  private def asFreebieMap(names: Seq[String], msg: String) = names.map(_ -> msg).toMap

  private val incErrorDetectStr = "Tortoise error detection and reporting not complete"
  private val incErrorDetectCommandNames = Seq(
    "Ask::AskAllTurtles",
    "Ask::AskAllPatches",
    "Breeds::SetBreedToNonBreed",
    "ComparingAgents::ComparingLinks",
    "DeadTurtles::DeadTurtles1",
    "DeadTurtles::DeadTurtles5",
    "DeadTurtles::DeadTurtles6",
    "Face::FaceAgentset",
    "Interaction::Interaction5",
    "Interaction::PatchTriesTurtleReporter",
    "Links::LinksNotAllowed",
    "Links::LinkNotAllowed_2D",
    "Links::LinkCreationTypeChecking_2D",
    "MoveTo::MoveTo_2D",
    "Random::OneOfWithAgentSets",
    "Sort::SortByBadReporter",
    "TypeChecking::AgentClassChecking1",
    "TypeChecking::AgentClassChecking3a",
    "TypeChecking::AgentClassChecking3b",
    "TypeChecking::RunRetainsAgentContext"
  )

  private val headlessCommandStr = "This test relies of behavior that only makes sense in Headless"
  private val headlessCommandNames = Seq(
    "UserPrimitives::UserReporters_Headless"
  )

  private val preferExtensionsStr = "Supplanted by extension-based tests (e.g. Fetch, Import-A)"
  private val preferExtensionsCommandNames =
    Seq(
      "ImportPatchesAndDrawing::ImportPcolors_2D"
    , "ImportPatchesAndDrawing::ImportPcolorsTopologyTest_2D"
    , "ImportWorld::RoundTripWithUTF8Chars"
    )

  private val awaitingFixStr = "Known issue waiting on a proper fix or implementation"
  private val awaitingFixCommandNames =
    Seq(
      "Timer::Timer1"
    )

}
