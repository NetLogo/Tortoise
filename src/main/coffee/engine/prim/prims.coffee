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
Random           = require('tortoise/shim/random')
Comparator       = require('tortoise/util/comparator')
Exception        = require('tortoise/util/exception')
Timer            = require('tortoise/util/timer')
Type             = require('tortoise/util/typechecker')

module.exports =
  class Prims

    # type ListOrSet[T] = Array[T]|AbstractAgentSet[T]

    _everyMap: undefined # Object[String, Timer]

    # (Dump, Hasher) => Prims
    constructor: (@_dumper, @_hasher) ->
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

      turtles = _(patches).map((p) -> p.turtles).flatten().filter((t) -> t.getBreedName() is breedName).value()
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
              (a is Nobody and b.id is -1) or (b is Nobody and a.id is -1) or ((a instanceof Turtle or a instanceof Link) and a.compare(b) is Comparator.EQUALS)
        )
      else
        throw new Error("Checking equality on undefined is an invalid condition")

    ###

      This implementation is closer than our original implementation, but still wrong. `every`'s dictionary entry claims:

      "Runs the given commands only if it's been more than number seconds since the last time this agent ran them in this context."

      But a more-accurate description of this implementation would be:

      "Runs the given commands only if it's been more than number seconds since the last time they were run in this context."

      Basically, there's no agent-checking yet. --JAB (9/12/14)

    ###
    # (Number, FunctionN, String) => Unit
    every: (time, fn, fid) ->
      existingEntry = @_everyMap[fid]
      if not existingEntry? or existingEntry.elapsed() >= time
        @_everyMap[fid] = new Timer()
        fn()
      return

    # (Any, Any) => Boolean
    gt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a > b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is Comparator.GREATER_THAN
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
        a.compare(b) is Comparator.LESS_THAN
      else
        throw new Error("Invalid operands to `lt`")

    # (Any, Any) => Boolean
    lte: (a, b) ->
      @lt(a, b) or @equality(a, b)

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
        Random.nextLong(truncated)
      else
        -Random.nextLong(-truncated)

    # (Number) => Number
    randomFloat: (n) ->
      n * Random.nextDouble()

    # (Number, FunctionN) => Unit
    repeat: (n, fn) ->
      for [0...n]
        fn()
      return

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
