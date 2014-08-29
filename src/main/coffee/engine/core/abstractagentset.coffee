# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Nobody         = require('./nobody')
Random         = require('tortoise/shim/random')
abstractMethod = require('tortoise/util/abstractmethoderror')
Exception      = require('tortoise/util/exception')
Iterator       = require('tortoise/util/iterator')
Seq            = require('tortoise/util/seq')
Shufflerator   = require('tortoise/util/shufflerator')
stableSort     = require('tortoise/util/stablesort')

# Never instantiate this class directly --JAB (5/7/14)
module.exports =
  class AbstractAgentSet extends Seq

    @_selfManager: undefined # SelfManager

    # [T <: Agent] @ (Array[T]) => AbstractAgentSet[T]
    constructor: (agents) ->
      super(agents)
      @_selfManager =
        if agents[0]?
          agents[0].world.selfManager
        else
          {
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
        throw new Exception.DeathInterrupt

      return

    # [Result] @ (() => Result) => Array[Result]
    projectionBy: (f) ->
      @shufflerator().map(@_selfManager.askAgent(f))

    # () => Iterator
    iterator: ->
      abstractMethod('AbstractAgentSet.iterator')

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
      new Shufflerator(@toArray())

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
        winners[Random.nextInt(winners.length)]
