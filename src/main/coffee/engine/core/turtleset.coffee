# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet     = require('./abstractagentset')
DeadSkippingIterator = require('./structure/deadskippingiterator')

module.exports =
  class TurtleSet extends AbstractAgentSet

    # [T <: Turtle] @ (Array[T], String, String) => TurtleSet
    constructor: (@_agents, @_breedName = "TURTLES", @_specialName) ->
      super(@_agents)

    # () => String
    getBreedName: ->
      @_breedName

    # () => Iterator[T]
    iterator: ->
      new DeadSkippingIterator(@_agents)

    # () => String
    toString: ->
      @_specialName ? "(agentset, #{@size()} #{@getBreedName().toLowerCase()})"

    # (Array[T], TurtleSet[T]) => TurtleSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new TurtleSet(newAgentArr, agents.getBreedName())
