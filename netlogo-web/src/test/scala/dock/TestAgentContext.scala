// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock

// Agent-context checking, docked against desktop (see CONTEXT_RUNTIME_TYPE_CHECKING_PLAN.md).  Each case pins a
// context error against the message desktop produces for it.  -Jeremy B August 2026
class TestAgentContext extends DockingSuite {

  // Statically known contexts.  These pass today, and must keep passing without gaining runtime checks.

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

  // Dynamically typed agentsets.

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

  // Anonymous procedures run in the wrong context.

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

  // Reporter blocks in the wrong context.

  test("reporter block: sort-by with a turtle-only reporter from the observer") { implicit fixture => import fixture._
    testCommand("crt 3")
    testCommand("__ignore sort-by [who] turtles")
  }

  // `run` with a string, which desktop compiles in the caller's context, so these are compiler-style messages.

  // raise the right kind of error in the right place, but with the runtime wording:
  // "this code can't be run by a patch, only by a turtle".
  test("run string: patch context running a turtle-only prim") { implicit fixture => import fixture._
    declare("to test-patches [t] ask patches [ run t ] end")
    testCommand("test-patches \"hatch 1\"")
  }

  test("run string: turtle context running a patch-only prim") { implicit fixture => import fixture._
    declare("to test-turtles [t] ask turtles [ run t ] end")
    testCommand("crt 1")
    testCommand("test-turtles \"sprout 1\"")
  }

  // Asking the full turtles/patches agentsets from a non-observer context.  A separate rule from the kind masks, and
  // the only cases here where Tortoise used to raise no error at all rather than a JS TypeError.

  test("ask all: turtle asks all turtles") { implicit fixture => import fixture._
    testCommand("crt 1")
    testCommand("ask one-of turtles [ ask turtles [ die ] ]")
  }

  test("ask all: patch asks all patches") { implicit fixture => import fixture._
    testCommand("ask one-of patches [ ask patches [ sprout 1 ] ]")
  }

  // Message-format probes, pinning the exact wording.

  // desktop: this code can't be run by the observer -- note NEIGHBORS allows turtles and patches, and desktop drops
  // the "only by _" clause entirely when more than one kind is allowed.
  test("message format: multi-kind requirement (turtle or patch)") { implicit fixture => import fixture._
    testCommand("run [ -> __ignore neighbors ]")
  }

  // Fixed in phase 1: `SelfPrims._getSelfSafe` used to name the observer by the type of `SelfManager.self()`,
  // which is the number 0, so this said "this code can't be run by a NUMBER, only by a link".
  test("message format: link-only requirement") { implicit fixture => import fixture._
    testCommand("run [ -> __ignore link-length ]")
  }

}
