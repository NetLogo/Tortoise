# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Nobody         = require('./nobody')
Seq            = require('util/seq')
Shufflerator   = require('util/shufflerator')
stableSort     = require('util/stablesort')

{ DeathInterrupt: Death } = require('util/exception')

# Never instantiate this class directly --JAB (5/7/14)
module.exports =
  class AbstractAgentSet extends Seq

    @_nextInt:     undefined # (Number) => Number
    @_selfManager: undefined # SelfManager

    # (Array[T], String, String) => AbstractAgentSet
    constructor: (agents, @_agentTypeName, @_specialName) ->
      super(agents)

    # (() => Boolean) => AbstractAgentSet[T]
    agentFilter: (f) ->
      @filter(@_lazyGetSelfManager().askAgent(f))

    # (() => Boolean) => Boolean
    agentAll: (f) ->
      @every(@_lazyGetSelfManager().askAgent(f))

    # (() => Any, Boolean) => Unit
    ask: (f, shouldShuffle) ->

      iter =
        if shouldShuffle
          @shufflerator()
        else
          @iterator()

      selfManager = @_lazyGetSelfManager()

      iter.forEach(selfManager.askAgent(f))

      if selfManager.self().isDead?()
        throw new Death

      return

    # () => String
    getSpecialName: ->
      @_specialName

    # [Result] @ (() => Result) => Array[Result]
    projectionBy: (f) ->
      @shufflerator().map(@_lazyGetSelfManager().askAgent(f))

    # (() => Double) => Agent
    maxOneOf: (f) ->
      @_findBestOf(-Number.MAX_VALUE, ((result, currentBest) -> result > currentBest), f)

    # (() => Double) => Agent
    minOneOf: (f) ->
      @_findBestOf(Number.MAX_VALUE, ((result, currentBest) -> result < currentBest), f)

    # () => AbstractAgentSet[T]
    shuffled: ->
      @copyWithNewAgents(@shufflerator().toArray())

    # () => Shufflerator[T]
    shufflerator: ->
      new Shufflerator(@toArray(), ((agent) -> agent?.id >= 0), @_lazyGetNextIntFunc())

    # () => Array[T]
    sort: ->
      if @isEmpty()
        @toArray()
      else
        stableSort(@toArray())((x, y) -> x.compare(y).toInt)

    # () => Array[T]
    toArray: ->
      @_items = @iterator().toArray() # Prune out dead agents --JAB (7/21/14)
      @_items[..]

    # () => String
    toString: ->
      @_specialName?.toLowerCase() ? "(agentset, #{@size()} #{@_agentTypeName})"

    # (Array[T]) => AbstractAgentSet[T]
    copyWithNewAgents: (agents) ->
      @_generateFrom(agents)

    # [U] @ (U, (U, U) => Boolean, () => U) => Agent
    _findBestOf: (worstPossible, findIsBetter, f) ->
      foldFunc =
        ([currentBest, currentWinners], agent) =>

          result = @_lazyGetSelfManager().askAgent(f)(agent)

          if result is currentBest
            currentWinners.push(agent)
            [currentBest, currentWinners]
          else if findIsBetter(result, currentBest)
            [result, [agent]]
          else
            [currentBest, currentWinners]

      [[], winners] = @foldl(foldFunc, [worstPossible, []])

      if winners.length is 0
        Nobody
      else
        winners[@_lazyGetNextIntFunc()(winners.length)]

    # (Array[T]) => This[T]
    _generateFrom: (newAgentArr) ->
      new @constructor(newAgentArr)

    # () => (Number) => Number
    _lazyGetNextIntFunc: ->
      if @_nextInt?
        @_nextInt
      else if @_items[0]?
        @_nextInt = @_items[0].world.rng.nextInt
        @_nextInt
      else
        (-> throw new Error("How are you calling the RNG in an empty agentset?"))

    # () => SelfManager
    _lazyGetSelfManager: ->
      if @_selfManager?
        @_selfManager
      else if @_items[0]?
        @_selfManager = @_items[0].world.selfManager
        @_selfManager
      else
        {
          askAgent: () -> () -> undefined,
          self:     -> { id: undefined }
        }
