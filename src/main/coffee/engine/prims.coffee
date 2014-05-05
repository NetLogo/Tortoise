#@# No more code golf
define(['integration/random', 'engine/agents', 'engine/agentkind', 'engine/comparator', 'engine/dump'
      , 'engine/exception', 'engine/link', 'engine/nobody', 'engine/patch', 'integration/printer', 'engine/turtle'
      , 'integration/lodash', 'engine/typechecker']
     , ( Random,               Agents,          AgentKind,          Comparator,          Dump
      ,  Exception,          Link,          Nobody,          Patch,          Printer,               Turtle
      ,  _,                    Type) ->

  class Prims

    constructor: (@world) ->

    fd: (n) -> @world.agentSet.self().fd(n)
    bk: (n) -> @world.agentSet.self().fd(-n)
    jump: (n) -> @world.agentSet.self().jump(n)
    right: (n) -> @world.agentSet.self().right(n)
    left: (n) -> @world.agentSet.self().right(-n)
    setXY: (x, y) -> @world.agentSet.self().setXY(x, y)
    empty: (l) -> l.length is 0 #@# Seems wrong
    getNeighbors: -> @world.agentSet.self().getNeighbors()
    getNeighbors4: -> @world.agentSet.self().getNeighbors4()
    sprout: (n, breedName) -> @world.agentSet.self().sprout(n, breedName)
    hatch: (n, breedName) -> @world.agentSet.self().hatch(n, breedName)
    patch: (x, y) -> @world.getPatchAt(x, y)
    randomXcor: -> @world.minPxcor - 0.5 + Random.nextDouble() * (@world.maxPxcor - @world.minPxcor + 1)
    randomYcor: -> @world.minPycor - 0.5 + Random.nextDouble() * (@world.maxPycor - @world.minPycor + 1)
    shadeOf: (c1, c2) -> Math.floor(c1 / 10) is Math.floor(c2 / 10) #@# Varnames
    isBreed: (breedName, x) -> if x.isBreed? and x.id isnt -1 then x.isBreed(breedName) else false
    equality: (a, b) ->
      if a is undefined or b is undefined
        throw new Error("Checking equality on undefined is an invalid condition") #@# Bad, bad Bizzle

      (a is b) or ( # This code has been purposely rewritten into a crude, optimized form --JAB (3/19/14)
        if Type(a).isArray() and Type(b).isArray()
          a.length is b.length and a.every((elem, i) => @equality(elem, b[i]))
        else if a instanceof Agents and b instanceof Agents #@# Could be sped up to O(n) (from O(n^2)) by zipping the two arrays
          a.items.length is b.items.length and a.kind is b.kind and a.items.every((elem) -> (elem in b.items)) #@# Wrong!
        else
          (a instanceof Agents and a.breed is b) or (b instanceof Agents and b.breed is a) or
            (a is Nobody and b.id is -1) or (b is Nobody and a.id is -1) or ((a instanceof Turtle or a instanceof Link) and a.compare(b) is Comparator.EQUALS)
      )

    lt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a < b
      else if typeof(a) is typeof(b) and a.compare? and b.compare? #@# Use a class
        a.compare(b) is Comparator.LESS_THAN
      else
        throw new Exception("Invalid operands to `lt`") #@# Nerp

    gt: (a, b) ->
      if (Type(a).isString() and Type(b).isString()) or (Type(a).isNumber() and Type(b).isNumber())
        a > b
      else if typeof(a) is typeof(b) and a.compare? and b.compare? #@# Use a class
        a.compare(b) is Comparator.GREATER_THAN
      else
        throw new Exception("Invalid operands to `gt`") #@# Nerp

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
    length: (xs) -> xs.length #@# Lodash
    _int: (n) -> if n < 0 then Math.ceil(n) else Math.floor(n) #@# WTF is this?  Wouldn't `n|0` suffice?
    mod: (a, b) -> ((a % b) + b) % b #@# WTF?
    max: (xs) -> Math.max(xs...) #@# Check Lodash on this
    min: (xs) -> Math.min(xs...) #@# Check Lodash
    mean: (xs) -> @sum(xs) / xs.length #@# Check Lodash
    sum: (xs) -> xs.reduce(((a, b) -> a + b), 0) #@# Check Lodash
    precision: (n, places) ->
      multiplier = Math.pow(10, places)
      result = Math.floor(n * multiplier + .5) / multiplier
      if places > 0
        result
      else
        Math.round(result) #@# Huh?
    reverse: (xs) -> #@# Lodash
      if Type(xs).isArray()
        _(xs).clone().reverse()
      else if typeof(xs) is "string"
        xs.split("").reverse().join("")
      else
        throw new Exception.NetLogoException("can only reverse lists and strings")
    sort: (xs) -> #@# Seems greatly improvable
      if Type(xs).isArray()
        wrappedItems = _(xs)
        clone        = wrappedItems.clone()
        if wrappedItems.isEmpty()
          xs
        else if wrappedItems.all((x) -> Type(x).isNumber())
          clone.sort((x, y) -> Comparator.numericCompare(x, y).toInt)
        else if wrappedItems.all((x) -> Type(x).isString())
          clone.sort()
        else if wrappedItems.all((x) -> x instanceof Turtle) or wrappedItems.all((x) -> x instanceof Patch)
          clone.sort((x, y) -> x.compare(y).toInt)
        else if wrappedItems.all((x) -> x instanceof Link)
          clone.sort(@world.linkCompare)
        else
          throw new Error("We don't know how to sort your kind here!") #@# Nerp
      else if xs instanceof Agents
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
            for agent in input.items
              if not (agent in result)
                result.push(agent)
      recurse(inputs)
      new Agents(result, undefined, AgentKind.Patch) #@# A great example of why we should have a `PatchSet`
    repeat: (n, fn) ->
      for i in [0...n] #@# Unused variable, which is lame
        fn()
      return
    #@# not a real implementation, always just runs body - ST 4/22/14
    every: (time, fn) ->
      fn()
      return
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
    boom: ->
      throw new Exception.NetLogoException("boom!")
    member: (x, xs) -> #@# Lodash
      if Type(xs).isArray()
        for y in xs
          if @equality(x, y)
            return true
        false
      else if Type(x).isString()
        xs.indexOf(x) != -1
      else  # agentset
        for a in xs.items
          if x == a
            return true
        false
    position: (x, xs) -> #@# Lodash
      if Type(xs).isArray()
        for y, i in xs
          if @equality(x, y)
            return i
        false
      else
        result = xs.indexOf(x)
        if result is -1
          false
        else
          result
    remove: (x, xs) -> #@# Lodash
      if Type(xs).isArray()
        result = []
        for y in xs
          if not @equality(x, y)
            result.push(y)
        result
      else
        xs.replaceAll(x, "")
    removeItem: (n, xs) -> #@# Lodash
      if Type(xs).isArray()
        xs = xs[..]
        xs[n..n] = []
        xs
      else
        xs.slice(0, n) + xs.slice(n + 1, xs.length)
    replaceItem: (n, xs, x) -> #@# Lodash
      if Type(xs).isArray()
        xs = xs[..]
        xs[n] = x
        xs
      else
        xs.slice(0, n) + x + xs.slice(n + 1, xs.length)
    sublist: (xs, n1, n2) ->
      xs[n1...n2]
    substring: (xs, n1, n2) ->
      xs.substr(n1, n2 - n1)
    sentence: (xs...) ->
      result = [] #@# Pushing is for poppers of pills
      for x in xs
        if Type(x).isArray()
          result.push(x...)
        else
          result.push(x)
      result
    variance: (xs) -> #@# Clarity
      sum = 0
      count = xs.length
      for x in xs
        if Type(x).isNumber()
          sum += x
        else
          --count
      if count < 2
        throw new Exception.NetLogoException("Can't find the variance of a list without at least two numbers")
      mean = sum / count
      squareOfDifference = 0
      for x in xs
        if Type(x).isNumber()
          squareOfDifference += StrictMath.pow(x - mean, 2)
      squareOfDifference / (count - 1)
    breedOn: (breedName, what) -> #@# Wat?
      breed = @world.breedManager.get(breedName)
      patches =
        if what instanceof Patch
          [what]
        else if what instanceof Turtle
          [what.getPatchHere()]
        else if what.items and what.kind is AgentKind.Patch
          what.items
        else if what.items and what.kind is AgentKind.Turtle
          t.getPatchHere() for t in what.items
        else
          throw new Exception.NetLogoException("`breed-on` unsupported for class '#{typeof(what)}'")
      result = [] #@# I hate this
      for p in patches
        for t in p.turtles
          if t.breed is breed
            result.push(t)
      new Agents(result, breed, AgentKind.Turtle)

    turtlesOn: (agentsOrAgent) ->
      if agentsOrAgent.items #@# FP
        agents = agentsOrAgent.items
      else
        agents = [agentsOrAgent]
      turtles = _(agents).map((x) -> x.turtlesHere().items).flatten().value()
      new Agents(turtles, @world.breedManager.get("TURTLES"), AgentKind.Turtle)

)
