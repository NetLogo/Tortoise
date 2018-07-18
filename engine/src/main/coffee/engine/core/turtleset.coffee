# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet     = require('./abstractagentset')
DeadSkippingIterator = require('./structure/deadskippingiterator')

module.exports =
  class TurtleSet extends AbstractAgentSet

    # [T <: Turtle] @ (Array[T], World, String) => TurtleSet
    constructor: (agents, world, specialName) ->
      super(agents, world, "turtles", specialName)
      @_agents = agents

    # () => Iterator[T]
    iterator: ->
      new DeadSkippingIterator(@_agents)
