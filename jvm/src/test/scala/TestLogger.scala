// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  javax.script.ScriptException

import
  org.scalatest.exceptions.TestFailedException

import
  jsengine.Nashorn

import
  scala.collection.mutable.ArrayBuffer

private[tortoise] trait TestLogger extends BrowserReporter {
  private val jsBlobs = ArrayBuffer[String]()

  protected val nashorn = new Nashorn {
    override def run(script: String): (String, String) = {
      jsBlobs.append(script)
      super.run(script)
    }

    override def eval(script: String): AnyRef = {
      // This removes noise on DockingFixture tests
      jsBlobs.append(script.
        replaceAll("""expectedUpdates = .+$""", "expectedUpdates = [];").
        replaceAll("""actualUpdates\s+= .+$""", "actualUpdates = [];"))
      super.eval(script)
    }
  }

  protected def annotate(note: String): Unit = {
    jsBlobs.append(s"/* $note */")
  }

  protected def noteAtStart(note: String): Unit = {
    s"/* $note */" +=: jsBlobs
    ()
  }

  protected def annotatePrevious(note: String): Unit = {
    val previous = jsBlobs.remove(jsBlobs.length - 1)
    annotate(note)
    jsBlobs.append(previous)
  }

  protected def loggingFailures[A](suite: String, name: String, runTest: => A): A = {
    try {
      jsBlobs.clear()
      runTest
    }
    catch {
      case e@(_: TestFailedException | _: ScriptException | _: AssertionError) =>
        testFailed(suite, name)
        throw e
    }
  }

  protected def testFailed(suite: String, name: String): Unit = {
    writeFixtureDocument(name, jsBlobs)
    FailureReporter(suite, name)
  }
}

// This is not an inner object of TestLogger because each suite (DockingFixture vs. TortoiseFinder)
// will overwrite the other
private object FailureReporter extends BrowserReporter {
  private var failures: Map[String, Seq[String]] = Map()

  def apply(suite: String, name: String): Unit = {
    failures += suite -> (name +: failures.get(suite).toSeq.flatten)
    writeReportDocument("index", failures)
  }
}
