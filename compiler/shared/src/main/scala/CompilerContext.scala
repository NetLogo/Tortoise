// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.{ Application, Instruction }

// `blockLevel` goes up each time we enter a block of statements.  `agentContext` is the set of agent kinds that could
// be running the code we're compiling, as a mask of `AgentContext` bits.  It starts as whatever the front end inferred
// for the procedure and narrows as we descend into blocks.  -Jeremy B August 2026
case class CompilerContext(blockLevel: Int = 0, agentContext: Int = AgentContext.All) {

  def inBlockOf(app: Application): CompilerContext =
    copy(agentContext = AgentContext.contextOfBlock(app, agentContext))

  // Once a statement has run, whatever it required has been proven of the agent running it, either because a guard
  // tested it or because the context already covered it.  And `self` can't change again until a block rebinds it, while
  // blocks get their context from `inBlockOf`.  So the rest of this statement list runs in the narrowed context, which
  // mirrors the forward propagation `parse.AgentTypeChecker` does at compile time.  -Jeremy B August 2026
  def provenBy(instruction: Instruction): CompilerContext =
    copy(agentContext = agentContext & AgentContext.requirementOf(instruction))
}
