define(->

  class Iterator

    _agents: undefined # AbstractAgents
    _i:      undefined # Number

    # (AbstractAgents) => Iterator
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
