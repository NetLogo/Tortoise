# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('../core/abstractagentset')
Link             = require('../core/link')
LinkSet          = require('../core/linkset')
Nobody           = require('../core/nobody')
Patch            = require('../core/patch')
PatchSet         = require('../core/patchset')
Turtle           = require('../core/turtle')
TurtleSet        = require('../core/turtleset')
NLType           = require('../core/typechecker')
StrictMath       = require('shim/strictmath')
Exception        = require('util/exception')
NLMath           = require('util/nlmath')
Timer            = require('util/timer')

{ flatMap, flattenDeep, isEmpty, map } = require('brazierjs/array')

{ MersenneTwisterFast }                          = require('shim/engine-scala')
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
          map((t) -> t.getPatchHere())(x.iterator().toArray())
        else
          throw new Error("`breed-on` unsupported for class '#{typeof(x)}'")

      turtles = flatMap((p) -> p.breedHereArray(breedName))(patches)
      new TurtleSet(turtles)

    # (Number, Number) => Number
    div: (a, b) ->
      if b isnt 0
        a / b
      else
        throw new Error("Division by zero.")

    # (Any, Any) => Boolean
    equality: (a, b) ->
      if a? and b?
        typeA = NLType(a)
        typeB = NLType(b)
        (a is b) or # This code has been purposely rewritten into a crude, optimized form --JAB (3/19/14)
          typeA.isBreedSet(b.getSpecialName?()) or
          typeB.isBreedSet(a.getSpecialName?()) or
          (a is Nobody and b.isDead?()) or
          (b is Nobody and a.isDead?()) or
          ((typeA.isTurtle() or (typeA.isLink() and b isnt Nobody)) and a.compare(b) is EQ) or
          (typeA.isList() and typeB.isList() and a.length is b.length and a.every((elem, i) => @equality(elem, b[i]))) or
          (typeA.isAgentSet() and typeB.isAgentSet() and a.size() is b.size() and Object.getPrototypeOf(a) is Object.getPrototypeOf(b) and (
            subsumes = (xs, ys) =>
              for x, index in xs
                if not @equality(ys[index], x)
                  return false
              true
            subsumes(a.sort(), b.sort())))
      else
        throw new Error("Checking equality on undefined is an invalid condition")

    # () => String
    dateAndTime: ->

      withTwoDigits   = (x) -> (if x < 10 then "0" else "") + x
      withThreeDigits = (x) -> (if x < 10 then "00" else if x < 100 then "0" else "") + x
      numberToMonth   = { 1: "Jan",  2: "Feb", 3: "Mar",  4: "Apr",  5: "May",  6: "Jun"
                        , 7: "Jul",  8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" }

      d = new Date

      hoursNum  = d.getHours()
      modHours  = if hoursNum is 0 or hoursNum is 12 then 12 else hoursNum % 12
      hours     = withTwoDigits(modHours)
      minutes   = withTwoDigits(d.getMinutes())
      seconds   = withTwoDigits(d.getSeconds())
      clockTime = "#{hours}:#{minutes}:#{seconds}"

      millis = withThreeDigits(d.getMilliseconds())

      amOrPM = if hoursNum >= 12 then "PM" else "AM"

      date  = withTwoDigits(d.getDate())
      month = numberToMonth[d.getMonth() + 1]
      year  = d.getFullYear()
      calendarComponent = "#{date}-#{month}-#{year}"

      "#{clockTime}.#{millis} #{amOrPM} #{calendarComponent}"

    # (String, Agent|Number, Number) => Boolean
    isThrottleTimeElapsed: (commandID, agent, timeLimit) ->
      entry = @_everyMap[@_genEveryKey(commandID, agent)]
      (not entry?) or entry.elapsed() >= timeLimit

    # (String, Agent|Number) => Unit
    resetThrottleTimerFor: (commandID, agent) ->
      @_everyMap[@_genEveryKey(commandID, agent)] = new Timer()

    # () => Number
    generateNewSeed: (->
      lastSeed = 0 # Rather than adding a global, scope this permanent state here --JAB (9/25/15)
      helper = ->
        seed = (new MersenneTwisterFast).nextInt()
        if seed isnt lastSeed
          lastSeed = seed
          seed
        else
          helper()
      helper
    )()

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

    # Some complications here....
    #
    # First, this will not yield the same results as the equivalent primitive in JVM NetLogo.
    # The Java documentation for `System.nanoTime` explains that its nanotimes are set against an arbitrary origin time
    # that isn't even guaranteed to be consistent across JVM instances.  Naturally, JS engines can't reproduce it,
    # either.
    #
    # Secondly, the resolution here is inconsistent.  In any modern browser, we can use the "High Resolution Time" API
    # but, right now, it's only a "Recommendation" and not a "Standard", so it is actually not implemented yet in
    # Nashorn.  Because of that, we use `performance.now()` if we can, but fall back to `Date.now()` if High Performance
    # Time is not available.
    #
    # Thirdly, though, even when we have `performance.now()`, the time resolution is only guaranteed to be microsecond
    # precision.  When we use `Date.now()`, the time resolution is in milliseconds.  Regardless of the resolution,
    # though, the value is converted to nanoseconds.
    #
    # So, in summary, the resolution of this implementation of `__nano-time` is inconsistent and not actually
    # nanoseconds, and is not consistent with the times provided in JVM NetLogo, but the Java Docs for
    # `System.nanoTime()` state that it is only to be used for measuring elapsed time, and that should still be
    # reasonably possible with the prim behavior supplied here. --JAB (1/11/16)
    #
    # () => Number
    nanoTime: ->
      nanos =
        if performance?.now?
          performance.now() * 1e3
        else
          Date.now() * 1e6
      nanos | 0

    # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (T*) => PatchSet
    patchSet: (inputs...) ->
      @_createAgentSet(inputs, Patch, PatchSet)

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

    # (Number, Number) => Number
    randomCoord: (min, max) ->
      min - 0.5 + @_rng.nextDouble() * (max - min + 1)

    # (Number) => Number
    randomFloat: (n) ->
      n * @_rng.nextDouble()

    # (Number, Number) => Number
    randomNormal: (mean, stdDev) ->
      if stdDev >= 0
        NLMath.validateNumber(mean + stdDev * @_rng.nextGaussian())
      else
        throw new Error("random-normal's second input can't be negative.")

    # (Number) => Number
    randomExponential: (mean) ->
      NLMath.validateNumber(-mean * StrictMath.log(@_rng.nextDouble()))

    # (Number, Number) => Number
    randomPatchCoord: (min, max) ->
      min + @_rng.nextInt(max - min + 1)

    # (Number) => Number
    randomPoisson: (mean) ->
      q   = 0
      sum = -StrictMath.log(1 - @_rng.nextDouble())
      while sum <= mean
        q   += 1
        sum -= StrictMath.log(1 - @_rng.nextDouble())
      q

    # [T <: (Array[Turtle]|Turtle|AbstractAgentSet[Turtle])] @ (T*) => TurtleSet
    turtleSet: (inputs...) ->
      @_createAgentSet(inputs, Turtle, TurtleSet)

    # (PatchSet|TurtleSet|Patch|Turtle) => TurtleSet
    turtlesOn: (agentsOrAgent) ->
      type = NLType(agentsOrAgent)
      if type.isAgentSet()
        turtles = flatMap((agent) -> agent.turtlesHere().toArray())(agentsOrAgent.iterator().toArray())
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
      flattened = flattenDeep(inputs)
      if isEmpty(flattened)
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
