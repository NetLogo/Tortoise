// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

// These dock agent-context checking against desktop.  Each case pins a context error to the message desktop produces
// for it.  -Jeremy B August 2026
class TestAgentContext extends DockingSuite {

  // These pass today, and they have to keep passing without picking up runtime checks along the way.

  test("known context: ask turtles") { implicit fixture => import fixture._
    testCommand("crt 3")
    testCommand("ask turtles [ fd 1 ]")
  }

  test("known context: ask patches") { implicit fixture => import fixture._
    testCommand("ask patches [ sprout 1 ]")
  }

  test("known context: turtle-only procedure from ask turtles") { implicit fixture => import fixture._
    declare("to t-only fd 1 end")
    testCommand("crt 3")
    testCommand("ask turtles [ t-only ]")
  }

  test("dynamic ask: turtle-set is fine") { implicit fixture => import fixture._
    testCommand("crt 3")
    testCommand("ask (turtle-set turtle 0) [ fd 1 ]")
  }

  test("dynamic ask: let-bound patches running a turtle-only prim") { implicit fixture => import fixture._
    testCommand("let a patches ask a [ fd 1 ]")
  }

  test("dynamic ask: global-held patch running a turtle-only prim") { implicit fixture => import fixture._
    declare("globals [g]")
    testCommand("set g one-of patches")
    testCommand("ask g [ die ]")
  }

  test("dynamic of: patch running a turtle-only reporter") { implicit fixture => import fixture._
    declare("globals [g]")
    testCommand("set g one-of patches")
    testCommand("__ignore [dx] of g")
  }

  test("dynamic with: patches running a turtle-only reporter") { implicit fixture => import fixture._
    testCommand("let p patches __ignore p with [who]")
  }

  test("lambda: observer runs a turtle-only command lambda") { implicit fixture => import fixture._
    testCommand("run [ -> fd 1 ]")
  }

  test("lambda: observer runs a turtle-only reporter lambda") { implicit fixture => import fixture._
    testCommand("__ignore runresult [ -> heading ]")
  }

  test("lambda: foreach with a turtle-only body from the observer") { implicit fixture => import fixture._
    testCommand("foreach [1] [ x -> fd x ]")
  }

  test("lambda: map with a turtle-only body from the observer") { implicit fixture => import fixture._
    testCommand("__ignore map [ x -> heading ] [1]")
  }

  test("lambda: turtle-only procedure called from an observer-run lambda") { implicit fixture => import fixture._
    declare("to t-only fd 1 end")
    testCommand("run [ -> t-only ]")
  }

  test("lambda: patch-only body run by a turtle") { implicit fixture => import fixture._
    testCommand("crt 1")
    testCommand("ask turtles [ run [ -> sprout 1 ] ]")
  }

  test("reporter block: sort-by with a turtle-only reporter from the observer") { implicit fixture => import fixture._
    testCommand("crt 3")
    testCommand("__ignore sort-by [who] turtles")
  }

  // Desktop compiles a `run` string in the caller's context, so it gives these a compiler-style message.  We raise the
  // right kind of error in the right place, but with the runtime wording: "this code can't be run by a patch, only by a
  // turtle".
  test("run string: patch context running a turtle-only prim") { implicit fixture => import fixture._
    declare("to test-patches [t] ask patches [ run t ] end")
    testCommand("test-patches \"hatch 1\"")
  }

  test("run string: turtle context running a patch-only prim") { implicit fixture => import fixture._
    declare("to test-turtles [t] ask turtles [ run t ] end")
    testCommand("crt 1")
    testCommand("test-turtles \"sprout 1\"")
  }

  // Asking the full turtles/patches agentsets from a non-observer context is a rule of its own, separate from the kind
  // masks.  These are also the only cases here where we used to raise nothing at all rather than a JS TypeError.

  test("ask all: turtle asks all turtles") { implicit fixture => import fixture._
    testCommand("crt 1")
    testCommand("ask one-of turtles [ ask turtles [ die ] ]")
  }

  test("ask all: patch asks all patches") { implicit fixture => import fixture._
    testCommand("ask one-of patches [ ask patches [ sprout 1 ] ]")
  }

  // Desktop says just "this code can't be run by the observer" here.  NEIGHBORS allows turtles and patches, and desktop
  // drops the "only by _" clause entirely once more than one kind is allowed.
  test("message format: multi-kind requirement (turtle or patch)") { implicit fixture => import fixture._
    testCommand("run [ -> __ignore neighbors ]")
  }

  // `SelfPrims._getSelfSafe` used to name the observer by the type of `SelfManager.self()`, which is the number 0, so
  // this once said "this code can't be run by a NUMBER, only by a link".
  test("message format: link-only requirement") { implicit fixture => import fixture._
    testCommand("run [ -> __ignore link-length ]")
  }

}
