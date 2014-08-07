# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/abstractagentset', 'engine/core/link', 'engine/core/nobody', 'engine/core/patch'
      , 'engine/core/patchset', 'engine/core/turtle', 'engine/core/turtleset', 'shim/lodash', 'shim/printer'
      , 'shim/random', 'shim/strictmath', 'util/comparator', 'util/exception', 'util/typechecker']
     , ( AbstractAgentSet,               Link,               Nobody,               Patch
      ,  PatchSet,               Turtle,               TurtleSet,               _,             Printer
      ,  Random,        StrictMath,        Comparator,        Exception,        Type) ->

  class Prims

    # type ListOrSet[T] = Array[T]|AbstractAgentSet[T]

    # (Dump, Hasher) => Prims
    constructor: (@_dumper, @_hasher) ->

    # (String, Any) => Boolean
    isBreed: (breedName, x) ->
      if x.isBreed? and x.id isnt -1 then x.isBreed(breedName) else false

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
            a.size() is b.size() and Object.getPrototypeOf(a) is Object.getPrototypeOf(b) and subsumes(a.toArray(), b.toArray())
          else
            (a instanceof AbstractAgentSet and a.getBreedName? and a.getBreedName() is b.name) or (b instanceof AbstractAgentSet and b.getBreedName? and b.getBreedName() is a.name) or
              (a is Nobody and b.id is -1) or (b is Nobody and a.id is -1) or ((a instanceof Turtle or a instanceof Link) and a.compare(b) is Comparator.EQUALS)
        )
      else
        throw new Exception.NetLogoException("Checking equality on undefined is an invalid condition")

    # (Any, Any) => Boolean
    lt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a < b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is Comparator.LESS_THAN
      else
        throw new Exception.NetLogoException("Invalid operands to `lt`")

    # (Any, Any) => Boolean
    gt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a > b
      else if typeof(a) is typeof(b) and a.compare? and b.compare?
        a.compare(b) is Comparator.GREATER_THAN
      else
        throw new Exception.NetLogoException("Invalid operands to `gt`")

    # (Any, Any) => Boolean
    lte: (a, b) -> @lt(a, b) or @equality(a, b)
    gte: (a, b) -> @gt(a, b) or @equality(a, b)

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

    # (Number) => Number
    _int: (n) ->
      n|0

    # (Number, Number) => Number
    mod: (a, b) ->
      a %% b

    # (Number, Number) => Number
    precision: (n, places) ->
      multiplier = Math.pow(10, places)
      result = Math.floor(n * multiplier + .5) / multiplier
      if places > 0
        result
      else
        Math.round(result)

    # (Any) => Unit
    outputPrint: (x) ->
      Printer(@_dumper(x))
      return

    # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (T*) => PatchSet
    patchSet: (inputs...) ->
      flattened = _(inputs).flatten().value()
      if _(flattened).isEmpty()
        new PatchSet([])
      else if flattened.length is 1
        head = flattened[0]
        if head instanceof PatchSet
          head
        else if head instanceof Patch
          new PatchSet([head])
        else
          new PatchSet([])
      else
        result  = []
        hashSet = {}

        hashIt = @_hasher

        addPatch =
          (p) ->
            hash = hashIt(p)
            if not hashSet.hasOwnProperty(hash)
              result.push(p)
              hashSet[hash] = true
            return

        buildFromAgentSet = (agentSet) -> agentSet.forEach(addPatch)

        buildItems =
          (inputs) =>
            for input in inputs
              if Type(input).isArray()
                buildItems(input)
              else if input instanceof Patch
                addPatch(input)
              else if input isnt Nobody
                buildFromAgentSet(input)

        buildItems(flattened)
        new PatchSet(result)

    # (Number, FunctionN) => Unit
    repeat: (n, fn) ->
      for [0...n]
        fn()
      return

    # (Number, FunctionN) => Unit
    # not a real implementation, always just runs body - ST 4/22/14
    every: (time, fn) ->
      Printer("Warning: The `every` primitive is not yet properly supported.")
      fn()
      return

    # (Number, Number) => Number
    subtractHeadings: (h1, h2) ->
      if h1 < 0 || h1 >= 360
        h1 = (h1 % 360 + 360) % 360
      if h2 < 0 || h2 >= 360
        h2 = (h2 % 360 + 360) % 360
      diff = h1 - h2
      if diff > -180 && diff <= 180
        diff
      else if diff > 0
        diff - 360
      else
        diff + 360

    # () => Nothing
    boom: ->
      throw new Exception.NetLogoException("boom!")

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
          throw new Exception.NetLogoException("`breed-on` unsupported for class '#{typeof(x)}'")

      turtles = _(patches).map((p) -> p.turtles).flatten().filter((t) -> t.getBreedName() is breedName).value()
      new TurtleSet(turtles, breedName)

    # (PatchSet|TurtleSet|Patch|Turtle) => TurtleSet
    turtlesOn: (agentsOrAgent) ->
      if agentsOrAgent instanceof AbstractAgentSet
        turtles = _(agentsOrAgent.iterator().toArray()).map((agent) -> agent.turtlesHere().toArray()).flatten().value()
        new TurtleSet(turtles)
      else
        agentsOrAgent.turtlesHere()


)
