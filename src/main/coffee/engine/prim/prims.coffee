# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                = require('lodash')
AbstractAgentSet = require('../core/abstractagentset')
Link             = require('../core/link')
LinkSet          = require('../core/linkset')
Nobody           = require('../core/nobody')
Patch            = require('../core/patch')
PatchSet         = require('../core/patchset')
Turtle           = require('../core/turtle')
TurtleSet        = require('../core/turtleset')
Printer          = require('tortoise/shim/printer')
Exception        = require('tortoise/util/exception')
Timer            = require('tortoise/util/timer')
Type             = require('tortoise/util/typechecker')

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
      patches =
        if x instanceof Patch
          [x]
        else if x instanceof Turtle
          [x.getPatchHere()]
        else if x instanceof PatchSet
          x.toArray()
        else if x instanceof TurtleSet
          _(x.iterator().toArray()).map((t) -> t.getPatchHere()).value()
        else
          throw new Error("`breed-on` unsupported for class '#{typeof(x)}'")

      turtles = _(patches).map((p) -> p.breedHereArray(breedName)).flatten().value()
      new TurtleSet(turtles, breedName)

    # (Any, Any) => Boolean
    equality: (a, b) ->
      if a? and b?
        (a is b) or ( # This code has been purposely rewritten into a crude, optimized form --JAB (3/19/14)
          if Type(a).isArray() and Type(b).isArray()
            a.length is b.length and a.every((elem, i) => @equality(elem, b[i]))
          else if a instanceof AbstractAgentSet and b instanceof AbstractAgentSet
            subsumes = (xs, ys) =>
              for x, index in xs
                if not @equality(ys[index], x)
                  return false
              true
            a.size() is b.size() and Object.getPrototypeOf(a) is Object.getPrototypeOf(b) and subsumes(a.sort(), b.sort())
          else
            (a instanceof AbstractAgentSet and a.getBreedName? and a.getBreedName() is b.name) or (b instanceof AbstractAgentSet and b.getBreedName? and b.getBreedName() is a.name) or
              (a is Nobody and b.id is -1) or (b is Nobody and a.id is -1) or ((a instanceof Turtle or (a instanceof Link and b isnt Nobody)) and a.compare(b) is EQ)
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
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a > b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is GT
      else
        throw new Error("Invalid operands to `gt`")

    # (Any, Any) => Boolean
    gte: (a, b) ->
      @gt(a, b) or @equality(a, b)

    # (String, Any) => Boolean
    isBreed: (breedName, x) ->
      if x.isBreed? and x.id isnt -1 then x.isBreed(breedName) else false

    # [T <: (Array[Link]|Link|AbstractAgentSet[Link])] @ (T*) => LinkSet
    linkSet: (inputs...) ->
      @_createAgentSet(inputs, Link, LinkSet)

    # (Any, Any) => Boolean
    lt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a < b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is LT
      else
        throw new Error("Invalid operands to `lt`")

    # (Any, Any) => Boolean
    lte: (a, b) ->
      @lt(a, b) or @equality(a, b)

    # (Number, Number) => Number
    log: (num, base) ->
      Math.log(num) / Math.log(base)

    # (Number, Number) => Number
    mod: (a, b) ->
      a %% b

    # (Any) => Unit
    outputPrint: (x) ->
      Printer(@_dumper(x))
      return

    # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (T*) => PatchSet
    patchSet: (inputs...) ->
      @_createAgentSet(inputs, Patch, PatchSet)

    # (Number, Number) => Number
    precision: (n, places) ->
      multiplier = Math.pow(10, places)
      result = Math.floor(n * multiplier + .5) / multiplier
      if places > 0
        result
      else
        Math.round(result)

    # (Number) => Number
    random: (n) ->
      truncated =
        if n >= 0
          Math.ceil(n)
        else
          Math.floor(n)
      if truncated is 0
        0
      else if truncated > 0
        @_rng.nextLong(truncated)
      else
        -@_rng.nextLong(-truncated)

    # (Number) => Number
    randomFloat: (n) ->
      n * @_rng.nextDouble()

    # (Number, Number) => Number
    subtractHeadings: (h1, h2) ->
      diff = (h1 % 360) - (h2 % 360)
      if -180 < diff <= 180
        diff
      else if diff > 0
        diff - 360
      else
        diff + 360

    # (Number) => Number
    toInt: (n) ->
      n | 0

    # [T <: (Array[Turtle]|Turtle|AbstractAgentSet[Turtle])] @ (T*) => TurtleSet
    turtleSet: (inputs...) ->
      @_createAgentSet(inputs, Turtle, TurtleSet)

    # (PatchSet|TurtleSet|Patch|Turtle) => TurtleSet
    turtlesOn: (agentsOrAgent) ->
      if agentsOrAgent instanceof AbstractAgentSet
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

    # [T <: Agent, U <: AbstractAgentSet[T], V <: (Array[T]|T|AbstractAgentSet[T])] @ (Array[V], T.Class, U.Class) => U
    _createAgentSet: (inputs, tClass, outClass) ->
      flattened = _(inputs).flatten().value()
      if _(flattened).isEmpty()
        new outClass([])
      else if flattened.length is 1
        head = flattened[0]
        if head instanceof outClass
          head
        else if head instanceof tClass
          new outClass([head])
        else
          new outClass([])
      else
        result  = []
        hashSet = {}

        hashIt = @_hasher

        addT =
          (p) ->
            hash = hashIt(p)
            if not hashSet.hasOwnProperty(hash)
              result.push(p)
              hashSet[hash] = true
            return

        buildFromAgentSet = (agentSet) -> agentSet.forEach(addT)

        buildItems =
          (inputs) =>
            for input in inputs
              if Type(input).isArray()
                buildItems(input)
              else if input instanceof tClass
                addT(input)
              else if input isnt Nobody
                buildFromAgentSet(input)

        buildItems(flattened)
        new outClass(result)
