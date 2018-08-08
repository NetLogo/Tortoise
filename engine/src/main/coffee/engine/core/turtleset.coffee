# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet     = require('./abstractagentset')
DeadSkippingIterator = require('./structure/deadskippingiterator')

module.exports =
  class TurtleSet extends AbstractAgentSet

    # [T <: Turtle] @ (Array[T], World, String) => TurtleSet
    constructor: (@_agents, world, specialName) ->
      super(@_agents, world, "turtles", specialName)

    # () => Iterator[T]
    iterator: ->
      new DeadSkippingIterator(@_agents[..])
