#@# We won't need to call `toArray` each time in our own functions when this learns how to iterate over dead agents...
# Never instantiate this class directly --JAB (5/7/14)
define(['integration/random', 'integration/seq', 'engine/nobody', 'engine/shufflerator']
    ,  ( Random,               Seq,               Nobody,          Shufflerator) ->

  # Type Parameter: T <: Agent - The type of agents within `_items`
  class AbstractAgents extends Seq

    @_askAgent: undefined # [U] @ (() => U) => (Agent) => U

    # (Array[T]) => AbstractAgents[T]
    constructor: (agents) ->
      super(agents)
      @_askAgent =
        if agents[0]?
          agents[0].world.selfManager.askAgent
        else
          () -> undefined

    # (() => Boolean) => AbstractAgents[T]
    agentFilter: (f) ->
      @filter(@_askAgent(f))

    # (() => Boolean) => Boolean
    agentAll: (f) ->
      @every(@_askAgent(f))

    # [U] @ (() => U) => T
    maxOneOf: (f) ->
      @_findBestOf(-Number.MAX_VALUE, ((result, currentBest) -> result > currentBest), f)

    # [U] @ (() => U) => T
    minOneOf: (f) ->
      @_findBestOf(Number.MAX_VALUE, ((result, currentBest) -> result < currentBest), f)

    # () => AbstractAgents[T]
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

    # (Array[U]) => AbstractAgents[U]
    copyWithNewAgents: (agents) ->
      @_generateFrom(agents, this)

    # [U, V] @ (U, (U, V) => Boolean, () => V) => T
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
