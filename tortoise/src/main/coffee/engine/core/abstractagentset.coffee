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

    # [T <: Agent] @ (Array[T]) => AbstractAgentSet[T]
    constructor: (agents) ->
      super(agents)

      @_nextInt =
        agents[0]?.world.rng.nextInt ? (-> throw new Error("How/why are you calling the RNG in an empty agentset?"))

      @_selfManager =
        agents[0]?.world.selfManager ? {
          askAgent: () -> () -> undefined
          self: -> { id: undefined }
        }

    # (() => Boolean) => AbstractAgentSet[T]
    agentFilter: (f) ->
      @filter(@_selfManager.askAgent(f))

    # (() => Boolean) => Boolean
    agentAll: (f) ->
      @every(@_selfManager.askAgent(f))

    # (() => Any, Boolean) => Unit
    ask: (f, shouldShuffle) ->

      iter =
        if shouldShuffle
          @shufflerator()
        else
          @iterator()

      iter.forEach(@_selfManager.askAgent(f))

      if @_selfManager.self().id is -1
        throw new Death

      return

    # [Result] @ (() => Result) => Array[Result]
    projectionBy: (f) ->
      @shufflerator().map(@_selfManager.askAgent(f))

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
      new Shufflerator(@toArray(), ((agent) -> agent?.id >= 0), @_nextInt)

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

    # (Array[T]) => AbstractAgentSet[T]
    copyWithNewAgents: (agents) ->
      @_generateFrom(agents, this)

    # [U] @ (U, (U, U) => Boolean, () => U) => Agent
    _findBestOf: (worstPossible, findIsBetter, f) ->
      foldFunc =
        ([currentBest, currentWinners], agent) =>

          result = @_selfManager.askAgent(f)(agent)

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
        winners[@_nextInt(winners.length)]
