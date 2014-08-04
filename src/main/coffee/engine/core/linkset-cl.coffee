# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.core.linkset')

goog.require('engine.core.abstractagentset')
goog.require('engine.core.structure.deadskippingiterator')

class LinkSet extends AbstractAgentSet

  # [T <: Turtle] @ (Array[T], String) => TurtleSet
  constructor: (@_agents, @_breedName ="LINKS") ->
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

  # (Array[T], LinkSet[T]) => LinkSet[T]
  _generateFrom: (newAgentArr, agents) ->
    new LinkSet(newAgentArr, agents.getBreedName())

