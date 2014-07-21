# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/abstractagentset', 'engine/core/structure/deadskippingiterator']
     , ( AbstractAgentSet,               DeadSkippingIterator) ->

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

)
