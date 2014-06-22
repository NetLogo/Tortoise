# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/abstractagentset'], (AbstractAgentSet) ->

  class TurtleSet extends AbstractAgentSet

    # [T <: Turtle] @ (Array[T]) => TurtleSet
    constructor: (@_agents, @_breedName = "TURTLES") ->
      super(@_agents)

    # () => String
    getBreedName: ->
      @_breedName

    # () => String
    toString: ->
      "(agentset, #{@size()} #{@getBreedName().toLowerCase()})"

    # (Array[T], TurtleSet[T]) => TurtleSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new TurtleSet(newAgentArr, agents.getBreedName())

)
