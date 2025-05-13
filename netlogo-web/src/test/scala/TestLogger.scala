// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw

import
  org.scalatest.exceptions.TestFailedException

import
  jsengine.GraalJS

import
  scala.collection.mutable.ArrayBuffer

private[tortoise] trait TestLogger extends BrowserReporter {
  private val jsBlobs = ArrayBuffer[String]()

  protected val engine = setupEngine()

  private def setupEngine(): GraalJS = {
    val e = new GraalJS {
      override def run(script: String): (String, String) = {
        val wrapped = wrapInFunction(script)
        jsBlobs.append(wrapped)
        runWithoutWrapping(wrapped)
      }

      override def eval(script: String): AnyRef = {
        jsBlobs.append(s"$script;".
          replaceAll("""expectedUpdates = .+$""", "expectedUpdates = [];").
          replaceAll("""actualUpdates\s+= .+$""", "actualUpdates = [];"))
        super.eval(script)
      }
    }
    e.setupTortoise()
    e
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
      case e@(
          _: TestFailedException
        | _: AssertionError
        | _: org.graalvm.polyglot.PolyglotException
      ) =>
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
