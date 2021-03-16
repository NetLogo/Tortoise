// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

import
  jsengine.GraalJS

import
  org.graalvm.polyglot.PolyglotException

import
  org.nlogo.tortoise.compiler.{ Compiler, CompilerFlags, WidgetCompiler, json },
    json.JsonSerializer

import
  org.nlogo.{ core, api, headless, mirror, nvm },
    api.{ Dump, FileIO, Workspace },
    headless.{ lang, test => headlessTest },
      lang.Fixture,
      headlessTest.{ RuntimeError, TestMode, NormalMode, Command, Reporter, Success },
    core.{ model, Model },
      model.ModelReader,
    nvm.Optimizations.{ Command => OCommand, Reporter => OReporter }

import
  org.skyscreamer.jsonassert.JSONAssert

import
  org.scalatest.{ Assertions, exceptions, fixture },
    Assertions._,
    exceptions.TestFailedException,
    fixture.FunSuite

trait DockingSuite extends FunSuite with TestLogger {
  type FixtureParam = DockingFixture

  override def withFixture(test: OneArgTest) = {
    val fixture = new DockingFixture(test.name, engine)
    try {
      loggingFailures(suiteName, test.name, {
        val outcome = withFixture(test.toNoArgTest(fixture))
        if (outcome.isFailed || outcome.isExceptional) {
          noteAtStart(s"NetLogo Code:${fixture.netLogoCode}")
          testFailed(this.getClass.getName, test.name)
        }
        outcome
      })
    }
    finally fixture.workspace.dispose()
  }
}

class DockingFixture(name: String, engine: GraalJS) extends Fixture(name) {

  private val tortoiseCompiler = new Compiler()

  def mirrorables: Iterable[mirror.Mirrorable] =
    mirror.Mirrorables.allMirrorables(workspace.world)
  var state: mirror.Mirroring.State = Map()
  var opened = false
  val netLogoCode = new StringBuilder

  val implementedOptimizations = {
    val commands  = (OCommand,  Seq(
      "CroFast",
      "CrtFast",
      "Fd1",
      "FdLessThan1",
      "HatchFast",
      "SproutFast"
    ))

    val reporters = (OReporter, Seq(
      "AnyOther",
      "AnyOtherWith",
      "AnyWith1",
      "AnyWith2",
      "AnyWith3",
      "AnyWith4",
      "AnyWith5",
      "CountOther",
      "CountOtherWith",
      "CountWith",
      "HasEqual",
      "HasGreaterThan",
      "HasLessThan",
      "HasNotEqual",
      "Nsum",
      "Nsum4",
      "OneOfWith",
      "OtherWith",
      "PatchAt",
      "PatchVariableDouble",
      "RandomConst",
      "TurtleVariableDouble",
      "With",
      "WithOther"
    ))
    Seq(commands, reporters).flatMap {
      case (typ, optNames) =>
        optNames.map(
          (optName) => typ -> s"org.nlogo.compile.middle.optimize.$optName"
        )
    } :+ (OReporter -> "org.nlogo.compile.optimize.Constants")
  }

  // so we don't need ASM, so no generator. also to save time
  workspace.flags = nvm.CompilerFlags(useOptimizer = true, useGenerator = false, optimizations = implementedOptimizations)

  def id[T](a: T): T = a

  def compare(reporter: String) =
    compareMunged(reporter, id, id)

  def compareMunged(reporter: String, mungeExpected: (String) => String, mungeActual: (String) => String) {
    runReporterMunged(Reporter(reporter,
        try {
          val expected = Dump.logoObject(workspace.report(reporter))
          val munged   = mungeExpected(expected)
          Success(munged)
        } catch {
          case ex : Exception => RuntimeError(ex.getMessage)
        }
      )
    , NormalMode
    , mungeActual
    )
  }

  override def runReporter(reporter: Reporter, mode: TestMode) =
    runReporterMunged(reporter, mode, id)

  def runReporterMunged(reporter: Reporter, mode: TestMode, mungeActual: (String) => String) {
    if (!opened) declare(Model())
    netLogoCode ++= s"${reporter.reporter}\n"
    val compiledJS = tortoiseCompiler.compileReporter(
      reporter.reporter, workspace.procedures, workspace.world.program)
    reporter.result match {
      case Success(expected) =>
        withClue(reporter.reporter) {
          assertResult(expected) {
            val actual = engine.evalAndDump(compiledJS)
            mungeActual(actual)
          }
          ()
        }
      case _: RuntimeError =>
        try {
          evalJS(compiledJS)
          throw new TestFailedException("Error in headless, not in JS", 7)
        } catch {
          case ex: TestFailedException => throw ex
          case _: Exception =>
        }
      case _ =>
        throw new TestFailedException("Unexpected error", 7)
    }
  }

  def viewResult(reporter: String) = {
    println("[View Result] " + Dump.logoObject(workspace.report(reporter)))
  }

  def runDocked(nldOp: (Workspace) => Unit)(nlwOp: (GraalJS) => (String, String)): Unit = {

    if (!opened) declare(Model())

    drawingActionBuffer.clear()
    val (headlessException, exceptionOccurredInHeadless) =
      try {
        nldOp(workspace)
        (Unit, false)
      } catch {
        case ex: Exception =>
          (ex.getMessage, true)
      }
    val (newState, update) = mirror.Mirroring.diffs(state, mirrorables)
    state = newState
    val expectedJson = "[" + JsonSerializer.serializeWithViewUpdates(update, drawingActionBuffer.grab()) + "]"
    val expectedOutput = workspace.outputAreaBuffer.toString
    val (exceptionOccurredInJS, (actualOutput, actualJson)) =
      try {
        (false, nlwOp(engine))
      } catch {
        case ex: PolyglotException =>
          val AfterFirstColonRegex   = "^.*?: (.*)".r
          val AfterFirstColonRegex(exMsg) = ex.getMessage
          (true, (exMsg, ""))

        case ex: Exception =>
          if (!exceptionOccurredInHeadless)
            ex.printStackTrace()
          (true, ("", ""))
      }
    if(exceptionOccurredInHeadless && !exceptionOccurredInJS) {
      throw new TestFailedException("Exception occurred in headless but not JS: " + headlessException, 7)
    } else if(!exceptionOccurredInHeadless && exceptionOccurredInJS) {
      throw new TestFailedException("Exception occurred in JS but not headless: " + actualOutput, 7)
    } else if(exceptionOccurredInHeadless && exceptionOccurredInJS) {
      if (!errorMessagesMatch(headlessException.asInstanceOf[String], actualOutput))
        throw new TestFailedException(s"""Exception in JS was "$actualOutput" but exception in headless was "$headlessException" """, 7)
    } else {
      assertResult(expectedOutput)(evalJS("world._getOutput()").asInstanceOf[String].replaceAllLiterally("\\n", "\n"))
      val removeB64 = (str: String) => str.replaceAll("""("imageBase64":\s*").*?"""", """$1"""")
      val (expectedModel, actualModel) = updatedJsonModels(removeB64(expectedJson), removeB64(actualJson))

      val headlessRNGState = workspace.world.mainRNG.save
      val engineRNGState  = engine.eval("Random.save();").asInstanceOf[String]

      assert(headlessRNGState == engineRNGState, "divergent RNG state")

      JSONAssert.assertEquals(expectedModel, actualModel, /* strict = */ true)

      ()

    }

  }

  def errorMessagesMatch(expected: String, actual: String) = {
    // NetLogo desktop prepends "Runtime error: " to some errors that happen at runtime, but not all.  I do not think
    // that information is particularly important, I think it's obvious when an error happens while the model is
    // running.  If it turns out other people really care about it, we can work to recreate the logic that desktop
    // uses to prepend the extra text. -Jeremy B November 2020
    expected == actual || (expected.startsWith("Runtime error: ") && expected.substring(15) == actual)
  }

  override def runCommand(command: Command, mode: TestMode) = {
    val logo = command.command
    netLogoCode ++= s"$logo\n"
    val compiledJS = tortoiseCompiler.compileRawCommands(logo, workspace.procedures, workspace.world.program)
    runDocked(_.command(logo))(_.run(compiledJS))
  }

  private def updatedJsonModels(expectedJson: String, actualJson: String) : (String, String) = {
    import play.api.libs.json.Json

    val processJSON = ((x: String) => Json.parse(x))// andThen render andThen compact
    engine.eval(s"expectedUpdates = JSON.parse('${processJSON(expectedJson)}');")
    engine.eval(s"actualUpdates   = JSON.parse('${processJSON(actualJson)}');")
    engine.eval("expectedModel.updates(expectedUpdates);")
    engine.eval("actualModel.updates(actualUpdates);")
    val expectedModel = engine.eval("JSON.stringify(expectedModel);").asInstanceOf[String]
    val actualModel   = engine.eval("JSON.stringify(actualModel);").asInstanceOf[String]
    (expectedModel, actualModel)
  }

  // use single-patch world by default to keep generated JSON to a minimum
  override val defaultView = core.View.square(0)

  override def open(path: String, shouldAutoInstallLibs: Boolean = false) {
    require(!opened)
    super.open(path, shouldAutoInstallLibs)
  }

  def open(path: String, dimensions: Option[(Int, Int, Int, Int)], shouldAutoInstallLibs: Boolean): Unit = {
    open(path, dimensions, shouldAutoInstallLibs, Set())
  }

  def open(path: String, dimensions: Option[(Int, Int, Int, Int)], shouldAutoInstallLibs: Boolean, requiredExts: Set[String]): Unit = {

    import scala.io.Codec.UTF8

    require(!opened)

    val source    = FileIO.fileToString(path)(UTF8)
    val newSource = addRequiredExtensions(source.replaceAll("""\sdisplay\s""", ""), requiredExts)
    val model     = ModelReader.parseModel(newSource, workspace.parser, Map())

    val finalModel = dimensions match {
      case None => model
      case Some((minx, maxx, miny, maxy)) =>
        model.copy(widgets = model.widgets.updated(model.widgets.indexOf(model.view),
          model.view.copy(dimensions = model.view.dimensions.copy(minPxcor = minx, maxPxcor = maxx, minPycor = miny, maxPycor = maxy))))
    }
    workspace.setDimensions(finalModel.view.dimensions)

    openModel(finalModel, shouldAutoInstallLibs)

  }

  override def openModel(model: Model, shouldAutoInstallLibs: Boolean = false) {
    require(!opened)
    super.openModel(model, shouldAutoInstallLibs)
    declareHelper(model)
  }

  override def declare(model: Model) {
    require(!opened)
    super.declare(model)
    declareHelper(model)
  }

  private val runMonitors =
    """|function() {
       |  widgets.forEach(function(w) {
       |    if (w.type == "monitor") {
       |      try { w.reporter(); }
       |      catch (error) { } // Shhh, no errors here.  What would give you that impression?  --JAB (2/22/16)
       |    }
       |  });
       |}""".stripMargin

  implicit val compilerFlags = CompilerFlags.Default.copy(onTickCallback = runMonitors)

  def declareHelper(model: Model) {
    netLogoCode ++= s"${model.code}\n"
    val result = tortoiseCompiler.compileProcedures(model)
    val js     = tortoiseCompiler.toJS(result)
    evalJS(js)
    evalJS(s"var widgets = ${WidgetCompiler.formatWidgets(result.widgets)};")
    state = Map()
    engine.eval("expectedModel = new AgentModel;")
    engine.eval("actualModel = new AgentModel;")
    opened = true
    runCommand(Command("clear-all random-seed 0"))
  }

  def getEngine: GraalJS = engine

  // these two are super helpful when running failing tests
  // to show the javascript before it gets executed.
  def evalJS(javascript: String) = {
    engine.eval(javascript)
  }

  def runJS(javascript: String): (String, String) = {
    engine.run(javascript)
  }

  private def addRequiredExtensions(source: String, requiredExts: Set[String]): String = {

    val ExtRegex = """(?s)(?i)(^|.*\n)(\s*extensions\s*\[)(.*?)(\].*?\Q@#$#@#$#@\E.*)""".r

    source match {
      case ExtRegex(prefix, extDirective, exts, suffix) =>
        val extensions = exts.trim.split("\\s+").toSet
        s"$prefix$extDirective${(extensions | requiredExts).mkString(" ")}$suffix"
      case _ =>
        s"extensions [${requiredExts.mkString(" ")}]\n$source"
    }

  }

}
