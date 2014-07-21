# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/abstractagentset', 'util/iterator'], (AbstractAgentSet, Iterator) ->

  class PatchSet extends AbstractAgentSet

    # [T <: Patch] @ (Array[T]) => PatchSet
    constructor: (@_agents) ->
      super(@_agents)

    # () => Iterator
    iterator: ->
      new Iterator(@_agents)

    # () => String
    toString: ->
      "(agentset, #{@size()} patches)"

    # (Array[T], PatchSet[T]) => PatchSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new PatchSet(newAgentArr)

)
