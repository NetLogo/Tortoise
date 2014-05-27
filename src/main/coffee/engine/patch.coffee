#@# CanTalkToPatches: { getPatchVariable(Int): Any, setPatchVariable(Int, Any): Unit }
#@# Extends `CanTalkToPatches`, `Agent`, `Vassal`
define(['integration/lodash', 'integration/random', 'engine/builtins', 'engine/colormodel', 'engine/comparator'
      , 'engine/exception', 'engine/nobody', 'engine/turtle', 'engine/turtleset']
     , ( _,                    Random,               Builtins,          ColorModel,          Comparator
      ,  Exception,          Nobody,          Turtle,          TurtleSet) ->

  class Patch
    vars: undefined
    constructor: (@id, @pxcor, @pycor, @world, @pcolor = 0.0, @plabel = "", @plabelcolor = 9.9) ->
      @vars = _(@world.patchesOwn.vars).cloneDeep()
      @turtles = [] #@# Why put this in the constructor?
    toString: -> "(patch #{@pxcor} #{@pycor})"
    getPatchVariable: (n) ->
      if n < Builtins.patchBuiltins.length
        this[Builtins.patchBuiltins[n]]
      else
        @vars[n - Builtins.patchBuiltins.length]

    setPatchVariable: (n, value) ->
      if n < Builtins.patchBuiltins.length
        @_setBuiltinVariable(n, value)
      else
        @vars[n - Builtins.patchBuiltins.length] = value

    # (Number, T) => Unit
    _setBuiltinVariable: (n, value) ->
      builtinVar = Builtins.patchBuiltins[n]
      finalValue =
        if builtinVar is "pcolor"
          newValue = ColorModel.wrapColor(value)
          if newValue isnt 0
            @world.patchesAllBlack(false)
          newValue

        else if builtinVar is "plabel"
          wasEmpty = @plabel is ""
          isEmpty  = value is ""
          if isEmpty and not wasEmpty
            @world.decrementPatchLabelCount()
          else if not isEmpty and wasEmpty
            @world.incrementPatchLabelCount()
          value

        else
          value

      this[builtinVar] = finalValue
      @world.updater.updated(this)(builtinVar)

      return

    leave: (turtle) -> @turtles.splice(@turtles.indexOf(turtle, 0), 1) #@# These functions are named strangely (`patch.arrive(turtle0)` doesn't make a lot of sense to me as an English-speaker)
    arrive: (turtle) ->
      @turtles.push(turtle)
    getCoords: -> [@pxcor, @pycor]
    distanceXY: (x, y) -> @world.topology().distanceXY(@pxcor, @pycor, x, y)
    towardsXY: (x, y) -> @world.topology().towards(@pxcor, @pycor, x, y)
    distance: (agent) -> @world.topology().distance(@pxcor, @pycor, agent)
    turtlesHere: -> new TurtleSet(@turtles[..])
    getNeighbors: -> @world.getNeighbors(@pxcor, @pycor)
    getNeighbors4: -> @world.getNeighbors4(@pxcor, @pycor)
    sprout: (n, breedName) ->
      breed   = if "" is breedName then @world.breedManager.turtles() else @world.breedManager.get(breedName) #@# This conditional is begging for a bug
      turtles = _(0).range(n).map(=> @world.createTurtle((id) => new Turtle(@world, id, 5 + 10 * Random.nextInt(14), Random.nextInt(360), @pxcor, @pycor, breed))).value() #@# Moar clarity, plox; and why do patches know how to create turtles?!
      new TurtleSet(turtles, breed)
    breedHere: (breedName) ->
      breed   = @world.breedManager.get(breedName)
      turtles = _(@turtles).filter((turtle) -> turtle.breed is breed).value()
      new TurtleSet(turtles, breed)
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
      @world.observer.watch(this)

    inRadius: (agents, radius) ->
      @world.topology().inRadius(this, @pxcor, @pycor, agents, radius)

    compare: (x) ->
      Comparator.numericCompare(@id, x.id)

)
