// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise
package dock

import
  org.nlogo.{ core, api, headless, mirror, nvm },
  headless.lang._,
  headless.test.{ RuntimeError, TestMode, Command, Reporter, CompileError, Success },
  core.Model,
  org.scalatest.Assertions._,
  org.scalatest.exceptions.TestFailedException

import jsengine.Nashorn

import json.JSONSerializer

trait DockingSuite extends org.scalatest.fixture.FunSuite with TestLogger {
  type FixtureParam = DockingFixture

  override def withFixture(test: OneArgTest) = {
    val fixture = new DockingFixture(test.name, nashorn)
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

class DockingFixture(name: String, nashorn: Nashorn) extends Fixture(name) {

  def mirrorables: Iterable[mirror.Mirrorable] =
    mirror.Mirrorables.allMirrorables(workspace.world)
  var state: mirror.Mirroring.State = Map()
  var opened = false
  val netLogoCode = new StringBuilder

  workspace.flags =
    nvm.CompilerFlags(
      useOptimizer = false, // since the Tortoise compiler sees the unoptimized code
                            //   and some optimizations may affect results ordering
                            //   and/or RNG interaction -ST
                            // When the optimizer goes on, the code for `create-turtle*`
                            //  (and probably, `hatch`, `sprout` `create-link*`) needs to
                            //  stop shuffling through the agentset when the given block
                            //  is empty --JAB (12/5/14)
      useGenerator = false  // so we don't need ASM. also to save time
    )

  def compare(reporter: String) {
    runReporter(Reporter(reporter,
        try {
          Success(api.Dump.logoObject(workspace.report(reporter)))
        } catch {
          case ex : Exception => RuntimeError(ex.getMessage)
        }
        ))
  }

  override def runReporter(reporter: Reporter, mode: TestMode) {
    if (!opened) declare(Model())
    netLogoCode ++= s"${reporter.reporter}\n"
    val compiledJS = Compiler.compileReporter(
      reporter.reporter, workspace.procedures, workspace.world.program)
    reporter.result match {
      case Success(expected) =>
        withClue(reporter.reporter) {
          assertResult(expected) {
            api.Dump.logoObject(
              evalJS(compiledJS))
          }
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
    println("[View Result] " + api.Dump.logoObject(workspace.report(reporter)))
  }

  override def runCommand(command: Command, mode: TestMode) = {
    if (!opened) declare(Model())
    val logo = command.command
    netLogoCode ++= s"$logo\n"
    workspace.clearOutput()

    val (headlessException, exceptionOccurredInHeadless) =
      try {
        workspace.command(logo)
        (Unit, false)
      } catch {
        case ex: Exception =>
          (ex.getMessage, true)
      }
    val (newState, update) = mirror.Mirroring.diffs(state, mirrorables)
    state = newState
    val expectedJson = "[" + JSONSerializer.serialize(update) + "]"
    val expectedOutput = workspace.outputAreaBuffer.toString
    val compiledJS = Compiler.compileCommands(logo, workspace.procedures, workspace.world.program)
    val (exceptionOccurredInJS, (actualOutput, actualJson)) =
      try {
        (false, runJS(compiledJS))
      } catch {
        case e: javax.script.ScriptException =>
          e.getCause match {
            case inner: jdk.nashorn.internal.runtime.ECMAException =>
              inner.thrown match {
                case obj: jdk.nashorn.internal.runtime.ScriptObject =>
                  (true, (obj.get("message").toString, ""))
                case _ =>
                  if (!exceptionOccurredInHeadless)
                    e.printStackTrace()
                  (true, ("", ""))
              }
            case _ =>
              if (!exceptionOccurredInHeadless)
                e.printStackTrace()
              (true, ("", ""))
          }
      }
    if(exceptionOccurredInHeadless && !exceptionOccurredInJS) {
      throw new TestFailedException("Exception occurred in headless but not JS: " + headlessException, 7)
    } else if(!exceptionOccurredInHeadless && exceptionOccurredInJS) {
      throw new TestFailedException("Exception occurred in JS but not headless: " + actualOutput, 7)
    } else if(exceptionOccurredInHeadless && exceptionOccurredInJS) {
      if(headlessException != actualOutput)
        throw new TestFailedException(s"""Exception in JS was "$actualOutput" but exception in headless was "$headlessException" """, 7)
    } else {
      assertResult(expectedOutput)(actualOutput)
      val (expectedModel, actualModel) = updatedJsonModels(expectedJson, actualJson)
      org.skyscreamer.jsonassert.JSONAssert.assertEquals(
        expectedModel, actualModel, true)  // strict = true
      assert(workspace.world.mainRNG.save == nashorn.eval(
        """if (typeof Random == "undefined" || typeof Random.save == "undefined") { [] } else { Random.save() }"""),
        "divergent RNG state")
    }
  }

  private def updatedJsonModels(expectedJson: String, actualJson: String) : (String, String) = {
    nashorn.eval(s"""expectedUpdates = Denuller(JSON.parse("${expectedJson.replaceAll("\"", "\\\\\"")}"))""")
    nashorn.eval(s"""actualUpdates   = Denuller(JSON.parse("${actualJson.replaceAll("\"", "\\\\\"")}"))""")
    nashorn.eval("expectedModel.updates(expectedUpdates)")
    nashorn.eval("actualModel.updates(actualUpdates)")
    val expectedModel = nashorn.eval("JSON.stringify(expectedModel)").asInstanceOf[String]
    val actualModel = nashorn.eval("JSON.stringify(actualModel)").asInstanceOf[String]
    (expectedModel, actualModel)
  }

  // use single-patch world by default to keep generated JSON to a minimum
  override val defaultView = core.View.square(0)

  override def open(path: String) {
    require(!opened)
    super.open(path)
  }

  def open(path: String, dimensions: Option[(Int, Int, Int, Int)]) {
    require(!opened)
    super.open(path)
    val model = api.model.ModelReader.parseModel(api.FileIO.file2String(path), workspace)

    val finalModel = dimensions match {
      case None => model
      case Some((minx, maxx, miny, maxy)) =>
        model.copy(widgets = model.widgets.updated(model.widgets.indexOf(model.view),
          model.view.copy(minPxcor = minx, maxPxcor = maxx, minPycor = miny, maxPycor = maxy)))
    }
    workspace.setDimensions(finalModel.view.dimensions)

    declareHelper(finalModel)
  }

  override def open(model: Model) {
    require(!opened)
    super.open(model)
    declareHelper(model)
  }

  override def declare(model: Model) {
    require(!opened)
    super.declare(model)
    declareHelper(model)
  }

  def declareHelper(model: Model) {
    netLogoCode ++= s"${model.code}\n"
    val (js, _, _) = Compiler.compileProcedures(model)
    evalJS(js)
    state = Map()
    nashorn.eval("expectedModel = new AgentModel")
    nashorn.eval("actualModel = new AgentModel")
    opened = true
    runCommand(Command("clear-all random-seed 0"))
  }

  // these two are super helpful when running failing tests
  // the show the javascript before it gets executed.
  // TODO: what is the difference between eval and run?
  def evalJS(javascript: String) = {
    //println(javascript)
    nashorn.eval(javascript)
  }

  def runJS(javascript: String): (String, String) = {
    //println(javascript)
    nashorn.run(javascript)
  }

}
