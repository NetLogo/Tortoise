# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet      = require('../core/abstractagentset')
Link                  = require('../core/link')
LinkSet               = require('../core/linkset')
Patch                 = require('../core/patch')
PatchSet              = require('../core/patchset')
Turtle                = require('../core/turtle')
TurtleSet             = require('../core/turtleset')
{ checks, getTypeOf } = require('../core/typechecker')
StrictMath            = require('shim/strictmath')
Timer                 = require('util/timer')
notImplemented        = require('util/notimplemented')

{ exceptionFactory: exceptions } = require('util/exception')

{ flatMap, flattenDeep, isEmpty, map } = require('brazierjs/array')

{ MersenneTwisterFast }                          = require('shim/engine-scala')
{ EQUALS: EQ, GREATER_THAN: GT, LESS_THAN: LT, } = require('util/comparator')

getNeighbors  = (patch) -> patch.getNeighbors()
getNeighbors4 = (patch) -> patch.getNeighbors4()
lessThan      = (a, b)  -> a < b
greaterThan   = (a, b)  -> a > b

module.exports =
  class Prims

    # type ListOrSet[T] = Array[T]|AbstractAgentSet[T]

    _everyMap: undefined # Object[String, Timer]

    # (Dump, Hasher, RNG, World) => Prims
    constructor: (@_dumper, @_hasher, @_rng, @_world, @_printPrims) ->
      @_everyMap = {}

    # () => Nothing
    boom: ->
      throw exceptions.runtime("boom!", "boom")

    # (String, Array[Patch]) -> TurtleSet
    breedOn: (breedName, patches) ->
      turtles = flatMap((p) -> p.breedHereArray(breedName))(patches)
      new TurtleSet(turtles, @_world)

    # (String, Patch) => TurtleSet
    breedOnPatch: (breedName, patch) ->
      @breedOn(breedName, [patch])

    # (String, Turtle) => TurtleSet
    breedOnTurtle: (breedName, turtle) ->
      @breedOn(breedName, [turtle.getPatchHere()])

    # (String, PatchSet) => TurtleSet
    breedOnPatchSet: (breedName, patchSet) ->
      @breedOn(breedName, patchSet.toArray())

    # (String, TurtleSet) => TurtleSet
    breedOnTurtleSet: (breedName, turtleSet) ->
      @breedOn(breedName, map((t) -> t.getPatchHere())(turtleSet.iterator().toArray()))

    # (Any, String) => Boolean
    booleanCheck: (b, primName) ->
      if checks.isBoolean(b)
        b
      else
        throw exceptions.runtime("#{primName} expected input to be a TRUE/FALSE but got the #{getTypeOf(b).niceName()} #{@_dumper(b)} instead.", primName)

    _hasDisplayed: false

    # () => Unit
    display: () ->
      if not @_hasDisplayed
        @_hasDisplayed = true
        notImplemented('display', undefined)
      return

    # (String) => Unit
    error: (message) ->
      throw exceptions.runtime(message, "error")
      return

    # (Any) => Boolean
    ifElseValueBooleanCheck: (b) ->
      @booleanCheck(b, "IFELSE-VALUE")

    # () => Unit
    ifElseValueMissingElse: () ->
      throw exceptions.runtime("IFELSE-VALUE found no true conditions and no else branch. If you don't wish to error when no conditions are true, add a final else branch.", "ifelse-value")

    # (Any, Any) => Boolean
    equality: (a, b) ->
      if a? and b?
        (a is b) or # This code has been purposely rewritten into a crude, optimized form --JAB (3/19/14)
          checks.isBreedSet(b.getSpecialName?(), a) or
          checks.isBreedSet(a.getSpecialName?(), b) or
          (checks.isNobody(a) and b.isDead?()) or
          (checks.isNobody(b) and a.isDead?()) or
          ((checks.isTurtle(a) or (checks.isLink(a) and not checks.isNobody(b))) and a.compare(b) is EQ) or
          (checks.isList(a) and checks.isList(b) and a.length is b.length and a.every((elem, i) => @equality(elem, b[i]))) or
          (checks.isAgentSet(a) and checks.isAgentSet(b) and a.size() is b.size() and Object.getPrototypeOf(a) is Object.getPrototypeOf(b) and (
            subsumes = (xs, ys) =>
              for x, index in xs
                if not @equality(ys[index], x)
                  return false
              true
            subsumes(a.sort(), b.sort())))
      else
        throw exceptions.internal("Checking equality on undefined is an invalid condition")

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
      if (checks.isString(a) and checks.isString(b)) or (checks.isNumber(a) and checks.isNumber(b))
        a > b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is GT
      else
        throw exceptions.internal("Invalid operands to `gt`")

    # (Any, Any) => Boolean
    gte: (a, b) ->
      @gt(a, b) or @equality(a, b)

    # [T <: (Array[Link]|Link|AbstractAgentSet[Link])] @ (T*) => LinkSet
    linkSet: (inputs) ->
      @_createAgentSet(inputs, Link, LinkSet)

    # (Any, Any) => Boolean
    lt: (a, b) ->
      if (checks.isString(a) and checks.isString(b)) or (checks.isNumber(a) and checks.isNumber(b))
        a < b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is LT
      else
        throw exceptions.internal("Invalid operands to `lt`")

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
      nanos = (performance?.now?() ? Date.now()) * 1e6
      StrictMath.floor(nanos)

    # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (T*) => PatchSet
    patchSet: (inputs) ->
      @_createAgentSet(inputs, Patch, PatchSet)

    # (Any) => Unit
    stdout: (x) ->
      dumpedX = @_dumper(x)
      if console?
        console.log(dumpedX)
      else if print?
        print(dumpedX)
      else
        throw exceptions.internal("We don't know how to output text on this platform.  \
                         But, if it helps you any, here's the thing you wanted to see: #{dumpedX}")
      return

    # [T <: (Array[Turtle]|Turtle|AbstractAgentSet[Turtle])] @ (T*) => TurtleSet
    turtleSet: (inputs) ->
      @_createAgentSet(inputs, Turtle, TurtleSet)

    # (Patch|Turtle) => TurtleSet
    turtlesOnAgent: (agent) ->
      agent.turtlesHere()

    # (PatchSet|TurtleSet) => TurtleSet
    turtlesOnAgentSet: (agents) ->
      turtles = flatMap((agent) -> agent.turtlesHere().toArray())(agents.iterator().toArray())
      new TurtleSet(turtles, @_world)

    _hasWaited: false

    # (Number) => Unit
    wait: (seconds) ->
      if not @_hasWaited
        @_hasWaited = true
        @_printPrims.print('NOTE: This model uses the `wait` primitive, but it is not yet properly implemented.\nUsing `wait` will not cause time to pass but the model will run normally.')
        notImplemented('wait', undefined)
      return

    # (String) => Unit
    uphill: (varName) ->
      @_moveUpOrDownhill(-Infinity, greaterThan, getNeighbors, varName)
      return

    # (String) => Unit
    uphill4: (varName) ->
      @_moveUpOrDownhill(-Infinity, greaterThan, getNeighbors4, varName)
      return

    # (String) => Unit
    downhill: (varName) ->
      @_moveUpOrDownhill(Infinity, lessThan, getNeighbors, varName)
      return

    # (String) => Unit
    downhill4: (varName) ->
      @_moveUpOrDownhill(Infinity, lessThan, getNeighbors4, varName)
      return

    # (Number, (Number, Number) => Boolean, (Patch) => PatchSet, String) => Unit
    _moveUpOrDownhill: (worstPossible, findIsBetter, getNeighbors, varName) ->

      turtle       = SelfManager.self()
      patch        = turtle.getPatchHere()
      winningValue = worstPossible
      winners      = []

      getNeighbors(patch).forEach(
        (neighbor) ->
          value = neighbor.getPatchVariable(varName)
          if checks.isNumber(value)
            if findIsBetter(value, winningValue)
              winningValue = value
              winners      = [neighbor]
            else if winningValue is value
              winners.push(neighbor)
      )

      if winners.length isnt 0 and findIsBetter(winningValue, patch.getPatchVariable(varName))
        winner = winners[@_rng.nextInt(winners.length)]
        turtle.face(winner)
        turtle.moveTo(winner)

      return

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
      makeOutie = (agents) => new outClass(agents, @_world)
      if isEmpty(flattened)
        makeOutie([])
      else if flattened.length is 1
        head = flattened[0]
        if head instanceof outClass
          makeOutie(head.toArray())
        else if head instanceof tClass
          makeOutie([head])
        else
          makeOutie([])
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
              if checks.isList(input)
                buildItems(input)
              else if input instanceof tClass
                addT(input)
              else if input isnt Nobody
                buildFromAgentSet(input)

        buildItems(flattened)
        makeOutie(result)
