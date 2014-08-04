# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.core.turtleset')

goog.require('engine.core.abstractagentset')
goog.require('engine.core.structure.deadskippingiterator')

  class TurtleSet extends AbstractAgentSet

    # [T <: Turtle] @ (Array[T], String) => TurtleSet
    constructor: (@_agents, @_breedName = "TURTLES") ->
      super(@_agents)

    # () => String
    getBreedName: ->
      @_breedName

    # () => Iterator
    iterator: ->
      new DeadSkippingIterator(@_agents)

    # () => String
    toString: ->
      "(agentset, #{@size()} #{@getBreedName().toLowerCase()})"

    # (Array[T], TurtleSet[T]) => TurtleSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new TurtleSet(newAgentArr, agents.getBreedName())

