# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/abstractagentset'], (AbstractAgentSet) ->

  class LinkSet extends AbstractAgentSet

    # [T <: Link] @ (Array[T]) => LinkSet
    constructor: (@_agents, @_breedName ="LINKS") ->
      super(@_agents)

    # () => String
    getBreedName: ->
      @_breedName

    # () => String
    toString: ->
      "(agentset, #{@size()} #{@getBreedName().toLowerCase()})"

    # (Array[T], TurtleSet[T]) => TurtleSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new LinkSet(newAgentArr, agents.getBreedName())

)
