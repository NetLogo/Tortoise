# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Nobody         = require('./nobody')
projectionSort = require('./projectionsort')
NLType         = require('./typechecker')
Iterator       = require('util/iterator')
Shufflerator   = require('util/shufflerator')
stableSort     = require('util/stablesort')

{ all, contains, exists, filter, foldl, forEach, map } = require('brazierjs/array')
{ pipeline                                           } = require('brazierjs/function')
{ keys                                               } = require('brazierjs/object')

{ DeathInterrupt: Death } = require('util/exception')

# Never instantiate this class directly --JAB (5/7/14)
module.exports =
  class AbstractAgentSet

    @_nextInt:     undefined # (Number) => Number
    @_selfManager: undefined # SelfManager
    @_world:       undefined # World

    # (Array[T], String, String) => AbstractAgentSet
    constructor: (@_agentArr, @_agentTypeName, @_specialName) ->

    # (() => Boolean) => AbstractAgentSet[T]
    agentFilter: (f) ->
      @filter(@_lazyGetSelfManager().askAgent(f))

    # (() => Boolean) => Boolean
    agentAll: (f) ->
      all(@_lazyGetSelfManager().askAgent(f))(@toArray())

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

    # (Array[(Number, Number)]) => AbstractAgentSet[T]
    atPoints: (points) ->
      getSelf    =        => @_lazyGetSelfManager().self()
      getPatchAt = (x, y) => @_lazyGetWorld().getPatchAt(x, y)
      require('./agentset/atpoints')(getSelf, getPatchAt).call(this, points)

    # (T) => Boolean
    contains: (item) ->
      contains(item)(@toArray())

    # (Array[T]) => AbstractAgentSet[T]
    copyWithNewAgents: (agents) ->
      @_generateFrom(agents)

    # ((T) => Boolean) => Boolean
    exists: (pred) ->
      exists(pred)(@toArray())

    # ((T) => Boolean) => This[T]
    filter: (pred) ->
      @_generateFrom(filter(pred)(@toArray()))

    # ((T) => Unit) => Unit
    forEach: (f) ->
      forEach(f)(@toArray())
      return

    # () => String
    getSpecialName: ->
      @_specialName

    # () => Boolean
    isEmpty: ->
      @size() is 0

    # () => Iterator
    iterator: ->
      new Iterator(@_agentArr)

    # (() => Number) => AbstractAgentSet[T]
    maxesBy: (f) ->
      @copyWithNewAgents(@_findMaxesBy(f))

    # (Number, () => Number) => AbstractAgentSet[T]
    maxNOf: (n, f) ->

      if n > @size()
        throw new Error("Requested #{n} random agents from a set of only #{@size()} agents.")

      if n < 0
        throw new Error("First input to MAX-N-OF can't be negative.")

      @_findBestNOf(n, f, (x, y) -> if x is y then 0 else if x > y then -1 else 1)

    # (() => Number) => T
    maxOneOf: (f) ->
      @_randomOneOf(@_findMaxesBy(f))

    # (Number, () => Number) => AbstractAgentSet[T]
    minNOf: (n, f) ->

      if n > @size()
        throw new Error("Requested #{n} random agents from a set of only #{@size()} agents.")

      if n < 0
        throw new Error("First input to MIN-N-OF can't be negative.")

      @_findBestNOf(n, f, (x, y) -> if x is y then 0 else if x < y then -1 else 1)

    # (() => Number) => T
    minOneOf: (f) ->
      @_randomOneOf(@_findMinsBy(f))

    # (() => Number) => AbstractAgentSet[T]
    minsBy: (f) ->
      @copyWithNewAgents(@_findMinsBy(f))

    # [Result] @ (() => Result) => Array[Result]
    projectionBy: (f) ->
      @shufflerator().map(@_lazyGetSelfManager().askAgent(f))

    # () => AbstractAgentSet[T]
    shuffled: ->
      @copyWithNewAgents(@shufflerator().toArray())

    # () => Shufflerator[T]
    shufflerator: ->
      new Shufflerator(@toArray(), ((agent) -> agent?.id >= 0), @_lazyGetNextIntFunc())

    # () => Number
    size: ->
      @toArray().length

    # () => Array[T]
    sort: ->
      if @isEmpty()
        @toArray()
      else
        stableSort(@toArray())((x, y) -> x.compare(y).toInt)

    # [U] @ ((T) => U) => Array[T]
    sortOn: (f) ->
      projectionSort(@shufflerator().toArray())(f)

    # () => Array[T]
    toArray: ->
      @_agentArr = @iterator().toArray() # Prune out dead agents --JAB (7/21/14)
      @_agentArr[..]

    # () => String
    toString: ->
      @_specialName?.toLowerCase() ? "(agentset, #{@size()} #{@_agentTypeName})"

    # (Number, () => Number, (Number, Number) => Number) => AbstractAgentSet[T]
    _findBestNOf: (n, f, cStyleComparator) ->

      ask = @_lazyGetSelfManager().askAgent(f)

      groupByValue =
        (acc, agent) ->
          result = ask(agent)
          if NLType(result).isNumber()
            entry = acc[result]
            if entry?
              entry.push(agent)
            else
              acc[result] = [agent]
          acc

      appendAgent =
        ([winners, numAdded], agent) ->
          if numAdded < n
            winners.push(agent)
            [winners, numAdded + 1]
          else
            [winners, numAdded]

      collectWinners =
        ([winners, numAdded], agents) ->
          if numAdded < n
            foldl(appendAgent)([winners, numAdded])(agents)
          else
            [winners, numAdded]

      valueToAgentsMap = foldl(groupByValue)({})(@shufflerator().toArray())
      [best, []] =
        pipeline(keys
               , map(parseFloat)
               , ((x) -> x.sort(cStyleComparator))
               , map((value) -> valueToAgentsMap[value])
               , foldl(collectWinners)([[], 0])
               )(valueToAgentsMap)

      @_generateFrom(best)

    # (Array[T]) => T
    _randomOneOf: (agents) ->
      if agents.length is 0
        Nobody
      else
        agents[@_lazyGetNextIntFunc()(agents.length)]

    # (Number, (Number, Number) => Boolean, () => Number) => Array[T]
    _findBestOf: (worstPossible, findIsBetter, f) ->
      foldFunc =
        ([currentBest, currentWinners], agent) =>

          result = @_lazyGetSelfManager().askAgent(f)(agent)

          if result is currentBest
            currentWinners.push(agent)
            [currentBest, currentWinners]
          else if NLType(result).isNumber() and findIsBetter(result, currentBest)
            [result, [agent]]
          else
            [currentBest, currentWinners]

      [[], winners] = foldl(foldFunc)([worstPossible, []])(@toArray())
      winners

    # [U] @ (() => U) => Array[T]
    _findMaxesBy: (f) ->
      @_findBestOf(-Infinity, ((result, currentBest) -> result > currentBest), f)

    # [U] @ (() => U) => Array[T]
    _findMinsBy: (f) ->
      @_findBestOf(Infinity, ((result, currentBest) -> result < currentBest), f)

    # (Array[T]) => This[T]
    _generateFrom: (newAgentArr) ->
      new @constructor(newAgentArr)

    # () => (Number) => Number
    _lazyGetNextIntFunc: ->
      if @_nextInt?
        @_nextInt
      else if @_lazyGetWorld()?
        @_nextInt = @_lazyGetWorld().rng.nextInt
        @_nextInt
      else
        (-> throw new Error("How are you calling the RNG in an empty agentset?"))

    # () => SelfManager
    _lazyGetSelfManager: ->
      if @_selfManager?
        @_selfManager
      else if @_lazyGetWorld()?
        @_selfManager = @_lazyGetWorld().selfManager
        @_selfManager
      else
        {
          askAgent: () -> () -> undefined,
          self:     -> { id: undefined }
        }

    _lazyGetWorld: ->
      if @_world?
        @_world
      else if @_agentArr[0]?
        @_world = @_agentArr[0].world
        @_world
      else
        undefined
