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
      @_specialName.toLowerCase() ? "(agentset, #{@size()} patches)"

    # (Array[T], PatchSet[T]) => PatchSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new PatchSet(newAgentArr)
