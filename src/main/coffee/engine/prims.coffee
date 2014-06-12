#@# No more code golf
define(['integration/lodash', 'integration/printer', 'integration/random', 'integration/strictmath'
      , 'engine/abstractagents', 'engine/comparator', 'engine/dump', 'engine/exception', 'engine/link', 'engine/nobody'
      , 'engine/patch', 'engine/patchset', 'engine/turtle', 'engine/turtleset', 'engine/typechecker']
     , ( _,                    Printer,               Random,               StrictMath
      , AbstractAgents,          Comparator,           Dump,          Exception,          Link,          Nobody
      , Patch,          PatchSet,           Turtle,          TurtleSet,          Type) ->

  class Prims

    _getSelf: undefined # () => Agent

    constructor: (@_world) ->
      @_getSelf = @_world.agentSet.self

    fd: (n) -> @_getSelf().fd(n)
    bk: (n) -> @_getSelf().fd(-n)
    jump: (n) -> @_getSelf().jump(n)
    right: (n) -> @_getSelf().right(n)
    left: (n) -> @_getSelf().right(-n)
    setXY: (x, y) -> @_getSelf().setXY(x, y)
    empty: (xs) -> xs.length is 0
    getNeighbors: -> @_getSelf().getNeighbors()
    getNeighbors4: -> @_getSelf().getNeighbors4()
    sprout: (n, breedName) -> @_getSelf().sprout(n, breedName)
    hatch: (n, breedName) -> @_getSelf().hatch(n, breedName)
    patch: (x, y) -> @_world.getPatchAt(x, y)
    randomXcor: -> @_world.minPxcor - 0.5 + Random.nextDouble() * (@_world.maxPxcor - @_world.minPxcor + 1)
    randomYcor: -> @_world.minPycor - 0.5 + Random.nextDouble() * (@_world.maxPycor - @_world.minPycor + 1)
    shadeOf: (c1, c2) -> Math.floor(c1 / 10) is Math.floor(c2 / 10) #@# Varnames
    isBreed: (breedName, x) -> if x.isBreed? and x.id isnt -1 then x.isBreed(breedName) else false
    equality: (a, b) ->
      if a? and b?
        (a is b) or ( # This code has been purposely rewritten into a crude, optimized form --JAB (3/19/14)
          if Type(a).isArray() and Type(b).isArray()
            a.length is b.length and a.every((elem, i) => @equality(elem, b[i]))
          else if a instanceof AbstractAgents and b instanceof AbstractAgents #@# Could be sped up to O(n) (from O(n^2)) by zipping the two arrays
            a.size() is b.size() and Object.getPrototypeOf(a) is Object.getPrototypeOf(b) and a.toArray().every((elem) -> (elem in b.toArray())) #@# Wrong!
          else
            (a instanceof AbstractAgents and a.getBreedName? and a.getBreedName() is b.name) or (b instanceof AbstractAgents and b.getBreedName? and b.getBreedName() is a.name) or
              (a is Nobody and b.id is -1) or (b is Nobody and a.id is -1) or ((a instanceof Turtle or a instanceof Link) and a.compare(b) is Comparator.EQUALS)
        )
      else
        throw new Exception.NetLogoException("Checking equality on undefined is an invalid condition")


    lt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a < b
      else if typeof(a) is typeof(b) and a.compare? and b.compare? #@# Use a class
        a.compare(b) is Comparator.LESS_THAN
      else
        throw new Exception.NetLogoException("Invalid operands to `lt`")

    gt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a > b
      else if typeof(a) is typeof(b) and a.compare? and b.compare? #@# Use a class
        a.compare(b) is Comparator.GREATER_THAN
      else
        throw new Exception.NetLogoException("Invalid operands to `gt`")

    lte: (a, b) -> @lt(a, b) or @equality(a, b)
    gte: (a, b) -> @gt(a, b) or @equality(a, b)
    scaleColor: (color, number, min, max) -> #@# I don't know WTF this is, so it has to be wrong
      color = Math.floor(color / 10) * 10
      perc = 0.0
      if min > max
        if number < max
          perc = 1.0
        else if number > min
          perc = 0.0
        else
          tempval = min - number
          tempmax = min - max
          perc = tempval / tempmax
      else
        if number > max
          perc = 1.0
        else if number < min
          perc = 0.0
        else
          tempval = number - min
          tempmax = max - min
          perc = tempval / tempmax
      perc *= 10
      if perc >= 9.9999
        perc = 9.9999
      if perc < 0
        perc = 0
      color + perc
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
    randomFloat: (n) -> n * Random.nextDouble()
    list: (xs...) -> xs
    item: (n, xs) -> xs[n]
    first: (xs) -> xs[0]
    last: (xs) -> xs[xs.length - 1]
    fput: (x, xs) -> [x].concat(xs) #@# Lodash, son
    lput: (x, xs) -> #@# Lodash, son
      result = xs[..]
      result.push(x)
      result
    butFirst: (xs) -> xs[1..] # Lodashing this stuff is no good, since it doesn't handle strings correctly.  Could use Underscore.string... --JAB (5/5/14)
    butLast: (xs) -> xs[0...xs.length - 1]
    length: (xs) -> xs.length
    _int: (n) -> if n < 0 then Math.ceil(n) else Math.floor(n) #@# WTF is this?  Wouldn't `n|0` suffice?
    mod: (a, b) -> ((a % b) + b) % b #@# WTF?
    max: (xs) -> Math.max(xs...)
    min: (xs) -> Math.min(xs...)
    mean: (xs) -> @sum(xs) / xs.length
    sum: (xs) -> xs.reduce(((a, b) -> a + b), 0)
    precision: (n, places) ->
      multiplier = Math.pow(10, places)
      result = Math.floor(n * multiplier + .5) / multiplier
      if places > 0
        result
      else
        Math.round(result) #@# Huh?
    reverse: (xs) -> #@# Lodash
      if Type(xs).isArray()
        xs[..].reverse()
      else if typeof(xs) is "string"
        xs.split("").reverse().join("")
      else
        throw new Exception.NetLogoException("can only reverse lists and strings")
    sort: (xs) -> #@# Seems greatly improvable
      if Type(xs).isArray()
        wrappedItems = _(xs)
        if wrappedItems.isEmpty()
          xs
        else if wrappedItems.all((x) -> Type(x).isNumber())
          xs[..].sort((x, y) -> Comparator.numericCompare(x, y).toInt)
        else if wrappedItems.all((x) -> Type(x).isString())
          xs[..].sort()
        else if wrappedItems.all((x) -> x instanceof Turtle) or wrappedItems.all((x) -> x instanceof Patch)
          xs[..].sort((x, y) -> x.compare(y).toInt)
        else if wrappedItems.all((x) -> x instanceof Link)
          xs[..].sort(@_world.linkCompare)
        else
          throw new Exception.NetLogoException("We don't know how to sort your kind here!")
      else if xs instanceof AbstractAgents
        xs.sort()
      else
        throw new Exception.NetLogoException("can only sort lists and agentsets")
    removeDuplicates: (xs) -> #@# Good use of data structures and actually trying could get this into reasonable time complexity
      if xs.length < 2
        xs
      else
        xs.filter(
          (elem, pos) => not _(xs.slice(0, pos)).some((x) => @equality(x, elem))
        )
    outputPrint: (x) ->
      Printer(Dump(x))
    patchSet: (inputs...) ->
      #@# O(n^2) -- should be smarter (use hashing for contains check)
      result = []
      recurse = (inputs) ->
        for input in inputs
          if Type(input).isArray()
            recurse(input)
          else if input instanceof Patch
            result.push(input)
          else if input isnt Nobody
            input.forEach((agent) ->
              if not (agent in result)
                result.push(agent)
              return
            )
      recurse(inputs)
      new PatchSet(result)
    repeat: (n, fn) ->
      for [0...n]
        fn()
      return

    # (Number, FunctionN) => Unit
    #@# not a real implementation, always just runs body - ST 4/22/14
    every: (time, fn) ->
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

    # (T, (Array[T]|String|AgentSet)) => Boolean
    member: (x, xs) ->
      if Type(xs).isArray()
        _(xs).some((y) => @equality(x, y))
      else if Type(x).isString()
        xs.indexOf(x) != -1
      else # agentset
        xs.exists((a) -> x is a)

    # (T, (Array[T]|String|AgentSet)) => Number|Boolean
    position: (x, xs) ->
      index =
        if Type(xs).isArray()
          _(xs).findIndex((y) => @equality(x, y))
        else
          xs.indexOf(x)

      if index isnt -1
        index
      else
        false

    # (T, U <: (Array[T]|String)) => U
    remove: (x, xs) ->
      if Type(xs).isArray()
        _(xs).filter((y) => not @equality(x, y)).value()
      else
        xs.replace(new RegExp(x, "g"), "") # Replace all occurences of `x` --JAB (5/26/14)

    # (Number, U <: (Array[T]|String)) => U
    removeItem: (n, xs) ->
      if Type(xs).isArray()
        temp = xs[..]
        temp.splice(n, 1) # Cryptic, but effective --JAB (5/26/14)
        temp
      else
        pre  = xs.slice(0, n)
        post = xs.slice(n + 1)
        pre + post

    # (Number, U <: (Array[T]|String), T) => U
    replaceItem: (n, xs, x) -> #@# Lodash
      if Type(xs).isArray()
        temp = xs[..]
        temp.splice(n, 1, x)
        temp
      else
        pre  = xs.slice(0, n)
        post = xs.slice(n + 1)
        pre + x + post

    # (Array[T], Number, Number) => Array[T]
    sublist: (xs, n1, n2) ->
      xs.slice(n1, n2)

    # (String, Number, Number) => String
    substring: (xs, n1, n2) ->
      xs.substr(n1, n2 - n1)

    # (Array[Array[T]|T]) => Array[T]
    sentence: (xs...) ->
      f =
        (acc, x) ->
          if Type(x).isArray()
            acc.concat(x)
          else
            acc.push(x)
            acc
      _(xs).foldl(f, [])

    # (Array[T]) => Number
    variance: (xs) ->
      numbers = _(xs).filter((x) -> Type(x).isNumber())
      count   = numbers.size()

      if count < 2
        throw new Exception.NetLogoException("Can't find the variance of a list without at least two numbers")

      sum  = numbers.foldl(((acc, x) -> acc + x), 0)
      mean = sum / count
      squareOfDifference = numbers.foldl(((acc, x) -> acc + StrictMath.pow(x - mean, 2)), 0)
      squareOfDifference / (count - 1)

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
          _(x.toArray()).map((t) -> t.getPatchHere()).value()
        else
          throw new Exception.NetLogoException("`breed-on` unsupported for class '#{typeof(x)}'")

      turtles = _(patches).map((p) -> p.turtles).flatten().filter((t) -> t.getBreedName() is breedName).value()
      new TurtleSet(turtles, breedName)

    turtlesOn: (agentsOrAgent) -> #@# Lunacy
      agents =
        if agentsOrAgent instanceof AbstractAgents
          agentsOrAgent.toArray()
        else
          [agentsOrAgent]
      turtles = _(agents).map((agent) -> agent.turtlesHere().toArray()).flatten().value()
      new TurtleSet(turtles)

)
