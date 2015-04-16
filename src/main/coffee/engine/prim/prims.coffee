# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_          = require('lodash')
Nobody     = require('../core/nobody')
TurtleSet  = require('../core/turtleset')
NLType     = require('../core/typechecker')
StrictMath = require('tortoise/shim/strictmath')
Timer      = require('tortoise/util/timer')

{ Type: { TurtleType, PatchType, TurtleSetType, PatchSetType }, Types: { throwIfNotCompatible }, TypeSet } = require('../core/typeinfo')

{ EQUALS: EQ, GREATER_THAN: GT, LESS_THAN: LT, } = require('tortoise/util/comparator')

module.exports =
  class Prims

    # type ListOrSet[T] = Array[T]|AbstractAgentSet[T]

    _everyMap: undefined # Object[String, Timer]

    # (Dump, Hasher, RNG) => Prims
    constructor: (@_dumper, @_hasher, @_rng) ->
      @_everyMap = {}

    # () => Nothing
    boom: ->
      throw new Error("boom!")

    # (String, Patch|Turtle|PatchSet|TurtleSet) => TurtleSet
    breedOn: (breedName, x) ->
      throwIfNotCompatible("#{breedName}-on", new TypeSet([TurtleSetType, PatchSetType, TurtleType, PatchType]), x)
      type = NLType(x)
      patches =
        if type.isPatch()
          [x]
        else if type.isTurtle()
          [x.askIfNotDead(-> x.getPatchHere())]
        else if type.isPatchSet()
          x.toArray()
        else if type.isTurtleSet()
          _(x.iterator().toArray()).map((t) -> t.getPatchHere()).value()
        else
          throw new Error("Unpossible for `breed-on` to throw this error!")

      turtles = _(patches).map((p) -> p.breedHereArray(breedName)).flatten().value()
      new TurtleSet(turtles, breedName)

    # (Any, Any) => Boolean
    equality: (a, b) ->
      if a? and b?
        typeA = NLType(a)
        typeB = NLType(b)
        (a is b) or ( # This code has been purposely rewritten into a crude, optimized form --JAB (3/19/14)
          if typeA.isList() and typeB.isList()
            a.length is b.length and a.every((elem, i) => @equality(elem, b[i]))
          else if typeA.isAgentSet() and typeB.isAgentSet()
            subsumes = (xs, ys) =>
              for x, index in xs
                if not @equality(ys[index], x)
                  return false
              true
            a.size() is b.size() and Object.getPrototypeOf(a) is Object.getPrototypeOf(b) and subsumes(a.sort(), b.sort())
          else
            typeA.isBreedSet(b.name) or typeB.isBreedSet(a.name) or
              (a is Nobody and b.isDead?()) or (b is Nobody and a.isDead?()) or ((typeA.isTurtle() or (typeA.isLink() and b isnt Nobody)) and a.compare(b) is EQ)
        )
      else
        throw new Error("Checking equality on undefined is an invalid condition")

    # (String, Agent|Number, Number) => Boolean
    isThrottleTimeElapsed: (commandID, agent, timeLimit) ->
      entry = @_everyMap[@_genEveryKey(commandID, agent)]
      (not entry?) or entry.elapsed() >= timeLimit

    # (String, Agent|Number) => Unit
    resetThrottleTimerFor: (commandID, agent) ->
      @_everyMap[@_genEveryKey(commandID, agent)] = new Timer()

    # (Any, Any) => Boolean
    gt: (a, b) ->
      typeA = NLType(a)
      typeB = NLType(b)
      if (typeA.isString() and typeB.isString()) or (typeA.isNumber() and typeB.isNumber())
        a > b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is GT
      else
        throw new Error("Invalid operands to `gt`")

    # (Any, Any) => Boolean
    gte: (a, b) ->
      @gt(a, b) or @equality(a, b)

    # (Any, Any) => Boolean
    lt: (a, b) ->
      typeA = NLType(a)
      typeB = NLType(b)
      if (typeA.isString() and typeB.isString()) or (typeA.isNumber() and typeB.isNumber())
        a < b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is LT
      else
        throw new Error("Invalid operands to `lt`")

    # (Any, Any) => Boolean
    lte: (a, b) ->
      @lt(a, b) or @equality(a, b)

    # (Number) => Number
    random: (n) ->
      truncated =
        if n >= 0
          StrictMath.ceil(n)
        else
          StrictMath.floor(n)
      if truncated is 0
        0
      else if truncated > 0
        @_rng.nextLong(truncated)
      else
        -@_rng.nextLong(-truncated)

    # (Number) => Number
    randomFloat: (n) ->
      n * @_rng.nextDouble()

    # (PatchSet|TurtleSet|Patch|Turtle) => TurtleSet
    turtlesOn: (agentsOrAgent) ->
      type = NLType(agentsOrAgent)
      if type.isAgentSet()
        turtles = _(agentsOrAgent.iterator().toArray()).map((agent) -> agent.turtlesHere().toArray()).flatten().value()
        new TurtleSet(turtles)
      else
        agentsOrAgent.turtlesHere()

    # (String, Agent|Number) => String
    _genEveryKey: (commandID, agent) ->
      agentID =
        if agent is 0
          "observer"
        else
          @_dumper(agent)
      "#{commandID}__#{agentID}"
