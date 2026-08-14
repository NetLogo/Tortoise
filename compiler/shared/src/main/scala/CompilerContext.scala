// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.Application

// `blockLevel` is incremented each time a block of statements is entered.  `agentContext` is the set of agent kinds
// that could be running the code being compiled, as a mask of `AgentContext` bits; it starts as whatever the front end
// inferred for the procedure and narrows as we descend into blocks.  -Jeremy B August 2026
case class CompilerContext(blockLevel: Int = 0, source: String = "", agentContext: Int = AgentContext.All) {
  def this(source: String) = this(0, source)

  def inBlockOf(app: Application): CompilerContext =
    copy(agentContext = AgentContext.contextOfBlock(app, agentContext))
}
