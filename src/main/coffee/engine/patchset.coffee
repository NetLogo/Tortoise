define(['engine/abstractagentset'], (AbstractAgentSet) ->

  # Type Parameter: T <: Patch - The type of patches within `_agents`
  class PatchSet extends AbstractAgentSet

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
