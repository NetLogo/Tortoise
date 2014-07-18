# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/abstractagentset'], (AbstractAgentSet) ->

  class LinkSet extends AbstractAgentSet

    # [T <: Turtle] @ (Array[T], String) => TurtleSet
    constructor: (@_agents, @_breedName ="LINKS") ->
      super(@_agents)

    # () => String
    getBreedName: ->
      @_breedName

    # () => String
    toString: ->
      "(agentset, #{@size()} #{@getBreedName().toLowerCase()})"

    # (Array[T], LinkSet[T]) => LinkSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new LinkSet(newAgentArr, agents.getBreedName())

)
