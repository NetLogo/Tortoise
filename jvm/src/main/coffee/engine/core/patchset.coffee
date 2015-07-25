# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('./abstractagentset')
Iterator         = require('util/iterator')

module.exports =
  class PatchSet extends AbstractAgentSet

    # [T <: Patch] @ (Array[T], String) => PatchSet
    constructor: (agents, @_specialName) ->
      super(agents)

    # () => String
    toString: ->
      @_specialName?.toLowerCase() ? "(agentset, #{@size()} patches)"

    # () => Boolean
    isBreedSet: ->
      false # I guess? Not clear what's correct here. BCH 7/24/2015

    # (Array[T], PatchSet[T]) => PatchSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new PatchSet(newAgentArr)
