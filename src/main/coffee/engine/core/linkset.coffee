# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet     = require('./abstractagentset')
DeadSkippingIterator = require('./structure/deadskippingiterator')

module.exports =
  class LinkSet extends AbstractAgentSet

    # [T <: Turtle] @ (Array[T], String, String) => TurtleSet
    constructor: (@_agents, @_breedName = "LINKS", @_specialName) ->
      super(@_agents)

    # () => String
    getBreedName: ->
      @_breedName

    # () => Iterator[T]
    iterator: ->
      new DeadSkippingIterator(@_agents)

    # () => String
    toString: ->
      @_specialName.toLowerCase() ? "(agentset, #{@size()} #{@getBreedName().toLowerCase()})"

    # (Array[T], LinkSet[T]) => LinkSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new LinkSet(newAgentArr, agents.getBreedName())
