# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

#@# We won't need to call `toArray` each time in our own functions when this learns how to iterate over dead agents...
# Never instantiate this class directly --JAB (5/7/14)
define(['engine/core/nobody', 'shim/random', 'util/seq', 'util/shufflerator']
    ,  ( Nobody,               Random,        Seq,        Shufflerator) ->

  class AbstractAgentSet extends Seq

    @_askAgent: undefined # [U] @ (() => U) => (Agent) => U

    # [T <: Agent] @ (Array[T]) => AbstractAgentSet[T]
    constructor: (agents) ->
      super(agents)
      @_askAgent =
        if agents[0]?
          agents[0].world.selfManager.askAgent
        else
          () -> undefined

    # (() => Boolean) => AbstractAgentSet[T]
    agentFilter: (f) ->
      @filter(@_askAgent(f))

    # (() => Boolean) => Boolean
    agentAll: (f) ->
      @every(@_askAgent(f))

    # (() => Double) => Agent
    maxOneOf: (f) ->
      @_findBestOf(-Number.MAX_VALUE, ((result, currentBest) -> result > currentBest), f)

    # (() => Double) => Agent
    minOneOf: (f) ->
      @_findBestOf(Number.MAX_VALUE, ((result, currentBest) -> result < currentBest), f)

    # () => AbstractAgentSet[T]
    shuffled: ->
      result = []
      iter = new Shufflerator(@toArray())
      while iter.hasNext() #@# 1990 rears its ugly head again
        result.push(iter.next())
      @copyWithNewAgents(result)

    # () => Array[T]
    sort: ->
      if @isEmpty()
        @toArray()
      else
        @toArray().sort((x, y) -> x.compare(y).toInt)

    # (Array[T]) => AbstractAgentSet[T]
    copyWithNewAgents: (agents) ->
      @_generateFrom(agents, this)

    # [U] @ (U, (U, U) => Boolean, () => U) => Agent
    _findBestOf: (worstPossible, findIsBetter, f) ->
      winningValue = worstPossible #@# God awful.  Use `reduce` or _something_!
      winners = []
      for agent in @toArray()
        result = @_askAgent(f)(agent)
        if result is winningValue
          winners.push(agent)
        else if findIsBetter(result, winningValue)
          winningValue = result
          winners = []
          winners.push(agent)

      if winners.length is 0
        Nobody
      else
        winners[Random.nextInt(winners.length)]

)
