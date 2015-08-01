# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet     = require('./abstractagentset')
DeadSkippingIterator = require('./structure/deadskippingiterator')

module.exports =
  class TurtleSet extends AbstractAgentSet

    # [T <: Turtle] @ (Array[T], String) => TurtleSet
    constructor: (@_agents, specialName) ->
      super(@_agents, "turtles", specialName)

    # () => Iterator[T]
    iterator: ->
      new DeadSkippingIterator(@_agents)
