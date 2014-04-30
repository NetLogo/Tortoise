#@# CanTalkToPatches: { getPatchVariable(Int): Any, setPatchVariable(Int, Any): Unit }
#@# Extends `CanTalkToPatches`, `Agent`, `Vassal`
define(['engine/agentkind', 'engine/agents', 'engine/builtins', 'engine/colormodel', 'engine/comparator'
      , 'engine/exception', 'engine/nobody', 'engine/turtle', 'integration/random', 'integration/lodash']
     , ( AgentKind,          Agents,          Builtins,          ColorModel,          Comparator
      ,  Exception,          Nobody,          Turtle,          Random,               _) ->

  class Patch
    vars: []
    constructor: (@id, @pxcor, @pycor, @world, @pcolor = 0.0, @plabel = "", @plabelcolor = 9.9) ->
      @vars = _(@world.patchesOwn.vars).cloneDeep()
      @turtles = [] #@# Why put this in the constructor?
    toString: -> "(patch #{@pxcor} #{@pycor})"
    getPatchVariable: (n) ->
      if n < Builtins.patchBuiltins.length
        this[Builtins.patchBuiltins[n]]
      else
        @vars[n - Builtins.patchBuiltins.length]
    setPatchVariable: (n, v) ->
      if n < Builtins.patchBuiltins.length
        if Builtins.patchBuiltins[n] is "pcolor"
          newV = ColorModel.wrapColor(v)
          if newV isnt 0
            @world.patchesAllBlack(false)
          this[Builtins.patchBuiltins[n]] = newV
        else if Builtins.patchBuiltins[n] is "plabel"
          if v is "" #@# Lodash, weird code
            if this.plabel isnt ""
              world.patchesWithLabels(world._patchesWithLabels - 1)
          else
            if this.plabel is ""
              world.patchesWithLabels(world._patchesWithLabels + 1)
          this.plabel = v
        else
          this[Builtins.patchBuiltins[n]] = v
        @world.updater.updated(this, Builtins.patchBuiltins[n])
      else
        @vars[n - Builtins.patchBuiltins.length] = v
    leave: (t) -> @turtles.splice(@turtles.indexOf(t, 0), 1) #@# WTF is `t`?
    arrive: (t) -> #@# WTF is `t`?
      @turtles.push(t)
    getCoords: -> [@pxcor, @pycor]
    distanceXY: (x, y) -> @world.topology().distanceXY(@pxcor, @pycor, x, y)
    towardsXY: (x, y) -> @world.topology().towards(@pxcor, @pycor, x, y)
    distance: (agent) -> @world.topology().distance(@pxcor, @pycor, agent)
    turtlesHere: -> new Agents(@turtles[..], @world.breedManager.get("TURTLES"), AgentKind.Turtle) #@# What do the two dots even mean here...?
    getNeighbors: -> @world.getNeighbors(@pxcor, @pycor)
    getNeighbors4: -> @world.getNeighbors4(@pxcor, @pycor)
    sprout: (n, breedName) ->
      breed   = if "" is breedName then @world.breedManager.get("TURTLES") else @world.breedManager.get(breedName) #@# This conditional is begging for a bug
      turtles = _(0).range(n).map(=> @world.createTurtle(new Turtle(@world, 5 + 10 * Random.nextInt(14), Random.nextInt(360), @pxcor, @pycor, breed))).value() #@# Moar clarity, plox; and why do patches know how to create turtles?!
      new Agents(turtles, breed, AgentKind.Turtle)
    breedHere: (breedName) ->
      breed   = @world.breedManager.get(breedName)
      turtles = _(@turtles).filter((t) -> t.breed is breed).value()
      new Agents(turtles, breed, AgentKind.Turtle)
    turtlesAt: (dx, dy) ->
      @patchAt(dx, dy).turtlesHere()
    patchAt: (dx, dy) ->
      try
        newX = @world.topology().wrapX(@pxcor + dx)
        newY = @world.topology().wrapY(@pycor + dy)
        return @world.getPatchAt(newX, newY) #@# Unnecessary `return`
      catch error
        if error instanceof Exception.TopologyInterrupt then Nobody else throw error
    watchme: ->
      @world.watch(this)

    inRadius: (agents, radius) ->
      @world.topology().inRadius(this, @pxcor, @pycor, agents, radius)

    compare: (x) ->
      Comparator.numericCompare(@id, x.id)

)
