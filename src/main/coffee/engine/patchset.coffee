define(['engine/abstractagents'], (AbstractAgents) ->

  # Type Parameter: T <: Patch - The type of patches within `_agents`
  class PatchSet extends AbstractAgents

    # (Array[T]) => PatchSet
    constructor: (@_agents) ->
      super(@_agents)

    # () => String
    toString: ->
      "(agentset, #{@size()} patches)"

    # (Array[U <: Turtle], PatchSet[V]) => PatchSet[U]
    _generateFrom: (newAgentArr, agents) ->
      new PatchSet(newAgentArr)

)
