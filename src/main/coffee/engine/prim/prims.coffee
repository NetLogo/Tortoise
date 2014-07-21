# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/abstractagentset', 'engine/core/link', 'engine/core/nobody', 'engine/core/patch'
      , 'engine/core/patchset', 'engine/core/turtle', 'engine/core/turtleset', 'shim/lodash', 'shim/printer'
      , 'shim/random', 'shim/strictmath', 'util/comparator', 'util/exception', 'util/iterator', 'util/shufflerator'
      , 'util/typechecker']
     , ( AbstractAgentSet,               Link,               Nobody,               Patch
      ,  PatchSet,               Turtle,               TurtleSet,               _,             Printer
      ,  Random,        StrictMath,        Comparator,        Exception,        Iterator,        Shufflerator
      ,  Type) ->

  class Prims

    # type ListOrSet[T] = Array[T]|AbstractAgentSet[T]

    _getSelf: undefined # () => Agent

    # (World) => Prims
    constructor: (@_world, @_Dumper) ->
      @_getSelf = @_world.selfManager.self

    # (Number) => Unit
    fd: (n) ->
      @_getSelf().fd(n)
      return

    # (Number) => Unit
    bk: (n) ->
      @_getSelf().fd(-n)
      return

    # (Number) => Boolean
    jump: (n) ->
      @_getSelf().jump(n)

    # (Number) => Unit
    right: (n) ->
      @_getSelf().right(n)
      return

    # (Number) => Unit
    left: (n) ->
      @_getSelf().right(-n)
      return

    # (Number, Number) => Unit
    setXY: (x, y) ->
      @_getSelf().setXY(x, y)
      return

    # [T] @ (String|Array[T]) => Boolean
    empty: (xs) ->
      xs.length is 0

    # () => PatchSet
    getNeighbors: ->
      @_getSelf().getNeighbors()

    # () => PatchSet
    getNeighbors4: ->
      @_getSelf().getNeighbors4()

    # (Number, String) => TurtleSet
    sprout: (n, breedName) ->
      @_getSelf().sprout(n, breedName)

    # (Number, String) => TurtleSet
    hatch: (n, breedName) ->
      @_getSelf().hatch(n, breedName)

    # (Number, Number) => Patch
    patch: (x, y) ->
      @_world.getPatchAt(x, y)

    # () => Number
    randomXcor: ->
      @_world.topology.minPxcor - 0.5 + Random.nextDouble() * (@_world.topology.maxPxcor - @_world.topology.minPxcor + 1)

    # () => Number
    randomYcor: -> #@# Redundancy!
      @_world.topology.minPycor - 0.5 + Random.nextDouble() * (@_world.topology.maxPycor - @_world.topology.minPycor + 1)

    # (Number, Number) => Number
    shadeOf: (c1, c2) ->
      Math.floor(c1 / 10) is Math.floor(c2 / 10) #@# Varnames

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
      else if typeof(a) is typeof(b) and a.compare? and b.compare? #@# Use a class
        a.compare(b) is Comparator.LESS_THAN
      else
        throw new Exception.NetLogoException("Invalid operands to `lt`")

    # (Any, Any) => Boolean
    gt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a > b
      else if typeof(a) is typeof(b) and a.compare? and b.compare? #@# Use a class
        a.compare(b) is Comparator.GREATER_THAN
      else
        throw new Exception.NetLogoException("Invalid operands to `gt`")

    # (Any, Any) => Boolean
    lte: (a, b) -> @lt(a, b) or @equality(a, b)
    gte: (a, b) -> @gt(a, b) or @equality(a, b)

    # (Number, Number, Number, Number) => Number
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

    # [T] @ (T*) => Array[T]
    list: (xs...) ->
      xs

    # [Item] @ (Number, Array[Item]) => Item
    item: (n, xs) ->
      xs[n]

    # [Item] @ (Array[Item]) => Item
    first: (xs) ->
      xs[0]

    # [Item] @ (Array[Item]) => Item
    last: (xs) -> xs[xs.length - 1]

    # [Item] @ (Item, Array[Item]) => Array[Item]
    fput: (x, xs) ->
      [x].concat(xs) #@# Lodash, son

    # [Item] @ (Item, Array[Item]) => Array[Item]
    lput: (x, xs) -> #@# Lodash, son
      result = xs[..]
      result.push(x)
      result

    # [T] @ (Array[T]|String) => Array[T]|String
    butFirst: (xs) ->
      xs[1..] # Lodashing this stuff is no good, since it doesn't handle strings correctly.  Could use Underscore.string... --JAB (5/5/14)

    # [T] @ (Array[T]|String) => Array[T]|String
    butLast: (xs) ->
      xs[0...xs.length - 1]

    # [T] @ (Array[T]) => Number
    length: (xs) ->
      xs.length

    # (Number) => Number
    _int: (n) ->
      if n < 0 then Math.ceil(n) else Math.floor(n) #@# WTF is this?  Wouldn't `n|0` suffice?

    # (Number, Number) => Number
    mod: (a, b) ->
      ((a % b) + b) % b #@# WTF?

    # (Array[Number]) => Number
    max: (xs) ->
      Math.max(xs...)

    # (Array[Number]) => Number
    min: (xs) ->
      Math.min(xs...)

    # (Array[Number]) => Number
    mean: (xs) ->
      @sum(xs) / xs.length

    # (Array[Number]) => Number
    sum: (xs) ->
      xs.reduce(((a, b) -> a + b), 0)

    # (Number, Number) => Number
    precision: (n, places) ->
      multiplier = Math.pow(10, places)
      result = Math.floor(n * multiplier + .5) / multiplier
      if places > 0
        result
      else
        Math.round(result) #@# Huh?

    # [T] @ (Array[T]|String) => Array[T]|String
    reverse: (xs) -> #@# Lodash
      if Type(xs).isArray()
        xs[..].reverse()
      else if typeof(xs) is "string"
        xs.split("").reverse().join("")
      else
        throw new Exception.NetLogoException("can only reverse lists and strings")

    # [T] @ (ListOrSet[T]) => ListOrSet[T]
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
      else if xs instanceof AbstractAgentSet
        xs.sort()
      else
        throw new Exception.NetLogoException("can only sort lists and agentsets")

    # [T] @ (Array[T]) => Array[T]
    removeDuplicates: (xs) -> #@# Good use of data structures and actually trying could get this into reasonable time complexity
      if xs.length < 2
        xs
      else
        xs.filter(
          (elem, pos) => not _(xs.slice(0, pos)).some((x) => @equality(x, elem))
        )

    # (Any) => Unit
    outputPrint: (x) ->
      Printer(@_Dumper(x))
      return

    # [T <: (Array[T]|Patch|AbstractAgentSet[T])] @ (T*) => PatchSet
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

    # (Number, FunctionN) => Unit
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

    # [Item, Container <: (Array[Item]|String|AbstractAgentSet[Item])] @ (Item, Container) => Boolean
    member: (x, xs) ->
      if Type(xs).isArray()
        _(xs).some((y) => @equality(x, y))
      else if Type(x).isString()
        xs.indexOf(x) isnt -1
      else # agentset
        xs.exists((a) -> x is a)

    # [Item, Container <: (Array[Item]|String|AbstractAgentSet[Item])] @ (Item, Container) => Number|Boolean
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

    # [Item, Container <: (Array[Item]|String)] @ (Item, Container) => Container
    remove: (x, xs) ->
      if Type(xs).isArray()
        _(xs).filter((y) => not @equality(x, y)).value()
      else
        xs.replace(new RegExp(x, "g"), "") # Replace all occurences of `x` --JAB (5/26/14)

    # [Item, Container <: (Array[Item]|String)] @ (Number, Container) => Container
    removeItem: (n, xs) ->
      if Type(xs).isArray()
        temp = xs[..]
        temp.splice(n, 1) # Cryptic, but effective --JAB (5/26/14)
        temp
      else
        pre  = xs.slice(0, n)
        post = xs.slice(n + 1)
        pre + post

    # [Item, Container <: (Array[Item]|String)] @ (Number, Container, Item) => Container
    replaceItem: (n, xs, x) -> #@# Lodash
      if Type(xs).isArray()
        temp = xs[..]
        temp.splice(n, 1, x)
        temp
      else
        pre  = xs.slice(0, n)
        post = xs.slice(n + 1)
        pre + x + post

    # [T] @ (Array[T], Number, Number) => Array[T]
    sublist: (xs, n1, n2) ->
      xs.slice(n1, n2)

    # (String, Number, Number) => String
    substring: (xs, n1, n2) ->
      xs.substr(n1, n2 - n1)

    # [T] @ (Array[Array[T]|T]) => Array[T]
    sentence: (xs...) ->
      f =
        (acc, x) ->
          if Type(x).isArray()
            acc.concat(x)
          else
            acc.push(x)
            acc
      _(xs).foldl(f, [])

    # [T] @ (Array[T]) => Number
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

    # () => Unit
    die: ->
      @_getSelf().die()
      return

    # [T] @ (AbstractAgentSet[T]) => AbstractAgentSet[T]
    other: (agentSet) ->
      self = @_getSelf()
      agentSet.filter((agent) => agent isnt self)

    # (String) => Any
    getVariable: (varName) ->
      @_getSelf().getVariable(varName)

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_getSelf().setVariable(varName, value)
      return

    # (String) => Any
    getPatchVariable: (varName) ->
      @_getSelf().getPatchVariable(varName)

    # (String, Any) => Unit
    setPatchVariable: (varName, value) ->
      @_getSelf().setPatchVariable(varName, value)
      return

    # [Item] @ (ListOrSet[Item]) => Item
    oneOf: (agentsOrList) ->
      arr =
        if agentsOrList instanceof AbstractAgentSet #@# Stop this nonsense.  This code gives me such anxiety...
          agentsOrList.iterator().toArray()
        else
          agentsOrList
      if arr.length is 0
        Nobody
      else
        arr[Random.nextInt(arr.length)]

    # [Item] @ (ListOrSet[Item]) => Array[Item]
    nOf: (resultSize, agentsOrList) ->
      if not (agentsOrList instanceof AbstractAgentSet) #@# How does this even make sense?
        throw new Exception.NetLogoException("n-of not implemented on lists yet")
      items = agentsOrList.iterator().toArray()
      agentsOrList.copyWithNewAgents( #@# Oh, FFS
        switch resultSize
          when 0
            []
          when 1
            [items[Random.nextInt(items.length)]]
          when 2
            index1 = Random.nextInt(items.length)
            index2 = Random.nextInt(items.length - 1)
            [newIndex1, newIndex2] =
            if index2 >= index1
              [index1, index2 + 1]
            else
              [index2, index1]
            [items[newIndex1], items[newIndex2]]
          else
            i = 0
            j = 0
            result = []
            while j < resultSize #@# Lodash it!  And why not just use the general case?
              if Random.nextInt(items.length - i) < resultSize - j
                result.push(items[i])
                j += 1
              i += 1
            result
      )

)
