#@# Lame
define(['integration/random'], (Random) ->

  class Shufflerator #@# Maybe use my `Iterator` implementation, or maybe Mori has one?

    _agents:  undefined # AbstractAgents
    _i:       undefined # Number
    _nextOne: undefined # Agent

    # (AbstractAgents) => Shufflerator
    constructor: (_agents) ->
      @_agents  = _agents[..]
      @_i       = 0
      @_nextOne = null

      @_fetch()

    # () => Boolean
    hasNext: ->
      @_i <= @_agents.length

    # () => Agent
    next: ->
      result = @_nextOne
      @_fetch()
      result

    # () => Unit
    _fetch: ->
      if @hasNext()
        if @_i < @_agents.length - 1
          randNum = @_i + Random.nextInt(@_agents.length - @_i)
          @_nextOne = @_agents[randNum]
          @_agents[randNum] = @_agents[@_i]
        else
          @_nextOne = @_agents[@_i]
        @_i++
      else
        @_nextOne = null

      return

)
