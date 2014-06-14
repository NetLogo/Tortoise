# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/abstractagentset'], (AbstractAgentSet) ->

  # Type Parameter: T <: Turtle - The type of turtles within `_agents`
  class TurtleSet extends AbstractAgentSet

    # (Array[T]) => TurtleSet
    constructor: (@_agents, @_breedName = "TURTLES") ->
      super(@_agents)

    # () => String
    getBreedName: ->
      @_breedName

    # () => String
    toString: ->
      "(agentset, #{@size()} #{@getBreedName().toLowerCase()})"

    # (Array[U <: Turtle], TurtleSet[V]) => TurtleSet[U]
    _generateFrom: (newAgentArr, agents) ->
      new TurtleSet(newAgentArr, agents.getBreedName())

)
