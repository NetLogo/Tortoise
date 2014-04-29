#@# CanTalkToPatches: { getPatchVariable(Int): Any, setPatchVariable(Int, Any): Unit }
#@# Extends `CanTalkToPatches`, `Agent`, `Vassal`
define(['engine/agentkind', 'engine/agents', 'engine/builtins', 'engine/colormodel', 'engine/comparator'
      , 'engine/exception', 'engine/nobody', 'engine/turtle', 'integration/random']
     , ( AgentKind,          Agents,          Builtins,          ColorModel,          Comparator
      ,  Exception,          Nobody,          Turtle,          Random) ->

  class Patch
    vars: []
    constructor: (@id, @pxcor, @pycor, @world, @pcolor = 0.0, @plabel = "", @plabelcolor = 9.9) ->
      @vars = (x for x in @world.patchesOwn.vars)
      @turtles = [] #@# Why put this in the constructor?
    toString: -> "(patch " + @pxcor + " " + @pycor + ")" #@# Interpolate
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
    getNeighbors: -> @world.getNeighbors(@pxcor, @pycor) # @world.getTopology().getNeighbors(this) #@# I _love_ commented-out code!
    getNeighbors4: -> @world.getNeighbors4(@pxcor, @pycor) # @world.getTopology().getNeighbors(this)
    sprout: (n, breedName) ->
      breed = if "" is breedName then @world.breedManager.get("TURTLES") else @world.breedManager.get(breedName) #@# This conditional is begging for a bug
      newTurtles = [] # I'm getting mad...
      if n > 0
        for num in [0...n]
          newTurtles.push(@world.createTurtle(new Turtle(@world, 5 + 10 * Random.nextInt(14), Random.nextInt(360), @pxcor, @pycor, breed))) #@# Moar clarity, plox; and why do patches know how to create turtles?!
      new Agents(newTurtles, breed, AgentKind.Turtle)
    breedHere: (breedName) ->
      breed = @world.breedManager.get(breedName)
      new Agents(t for t in @turtles when t.breed is breed, breed, AgentKind.Turtle) #@# Just use Lodash, you jackalope
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
