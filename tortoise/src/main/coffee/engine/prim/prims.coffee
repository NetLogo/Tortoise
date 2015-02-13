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
NLType           = require('../core/typechecker')
Exception        = require('util/exception')
Timer            = require('util/timer')

{ EQUALS: EQ, GREATER_THAN: GT, LESS_THAN: LT, } = require('util/comparator')

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
      type = NLType(x)
      patches =
        if type.isPatch()
          [x]
        else if type.isTurtle()
          [x.getPatchHere()]
        else if type.isPatchSet()
          x.toArray()
        else if type.isTurtleSet()
          _(x.iterator().toArray()).map((t) -> t.getPatchHere()).value()
        else
          throw new Error("`breed-on` unsupported for class '#{typeof(x)}'")

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

    # [T <: (Array[Link]|Link|AbstractAgentSet[Link])] @ (T*) => LinkSet
    linkSet: (inputs...) ->
      @_createAgentSet(inputs, Link, LinkSet)

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

    # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (T*) => PatchSet
    patchSet: (inputs...) ->
      @_createAgentSet(inputs, Patch, PatchSet)

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

    # [T <: (Array[Turtle]|Turtle|AbstractAgentSet[Turtle])] @ (T*) => TurtleSet
    turtleSet: (inputs...) ->
      @_createAgentSet(inputs, Turtle, TurtleSet)

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

    # [T <: Agent, U <: AbstractAgentSet[T], V <: (Array[T]|T|AbstractAgentSet[T])] @ (Array[V], T.Class, U.Class) => U
    _createAgentSet: (inputs, tClass, outClass) ->
      flattened = _(inputs).flattenDeep().value()
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
              if NLType(input).isList()
                buildItems(input)
              else if input instanceof tClass
                addT(input)
              else if input isnt Nobody
                buildFromAgentSet(input)

        buildItems(flattened)
        new outClass(result)
