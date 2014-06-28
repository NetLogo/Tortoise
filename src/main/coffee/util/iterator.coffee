# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(->

  class Iterator

    _agents: undefined # AbstractAgentSet[T]
    _i:      undefined # Number

    # [T] @ (AbstractAgentSet) => Iterator[T]
    constructor: (agents) ->
      @_agents = agents[..]
      @_i      = 0

    # () => Boolean
    hasNext: ->
      @_i < @_agents.length

    # () => Agent
    next: ->
      @_agents[@_i++]

)
