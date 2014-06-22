# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

#@# Extends `CanTalkToPatches`, `Agent`, `Vassal`
define(['integration/lodash', 'integration/random', 'engine/builtins', 'engine/colormodel', 'engine/comparator'
      , 'engine/exception', 'engine/nobody', 'engine/turtle', 'engine/turtleset', 'engine/variablemanager']
     , ( _,                    Random,               Builtins,          ColorModel,          Comparator
      ,  Exception,          Nobody,          Turtle,          TurtleSet,          VariableManager) ->

  class Patch

    _varManager: undefined # VariableManager

    turtles: undefined # Array[Turtle]

    # (Number, Number, Number, World, Number, String, Number) => Patch
    constructor: (@id, @pxcor, @pycor, @world, @_pcolor = 0.0, @_plabel = "", @_plabelcolor = 9.9) ->
      @turtles = []
      @_varManager = @_genVarManager(@world.patchesOwnNames)

    # (String) => Any
    getVariable: (varName) ->
      @_varManager[varName]

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_varManager[varName] = value
      return

    # (String) => Any
    getPatchVariable: (varName) ->
      @_varManager[varName]

    # (String, Any) => Unit
    setPatchVariable: (varName, value) ->
      @_varManager[varName] = value
      return

    # (Turtle) => Unit
    leave: (turtle) ->
      @turtles.splice(@turtles.indexOf(turtle, 0), 1) #@# These functions are named strangely (`patch.arrive(turtle0)` doesn't make a lot of sense to me as an English-speaker)
      return

    # (Turtle) => Unit
    arrive: (turtle) ->
      @turtles.push(turtle)
      return

    # () => (Number, Number)
    getCoords: ->
      [@pxcor, @pycor]

    # (Agent) => Number
    distance: (agent) ->
      @world.topology.distance(@pxcor, @pycor, agent)

    # (Number, Number) => Number
    distanceXY: (x, y) ->
      @world.topology.distanceXY(@pxcor, @pycor, x, y)

    # (Number, Number) => Number
    towardsXY: (x, y) ->
      @world.topology.towards(@pxcor, @pycor, x, y)

    # () => TurtleSet
    turtlesHere: ->
      new TurtleSet(@turtles[..])

    # () => PatchSet
    getNeighbors: ->
      @world.getNeighbors(@pxcor, @pycor)

    # () => PatchSet
    getNeighbors4: ->
      @world.getNeighbors4(@pxcor, @pycor)

    # (Number, String) => TurtleSet
    sprout: (n, breedName) ->
      breed   = if "" is breedName then @world.breedManager.turtles() else @world.breedManager.get(breedName) #@# This conditional is begging for a bug
      turtles = _(0).range(n).map(=> @world.createTurtle((id) => new Turtle(@world, id, 5 + 10 * Random.nextInt(14), Random.nextInt(360), @pxcor, @pycor, breed))).value() #@# Moar clarity, plox; and why do patches know how to create turtles?!
      new TurtleSet(turtles, breed)

    # (String) => TurtleSet
    breedHere: (breedName) ->
      turtles = _(@turtles).filter((turtle) -> turtle.getBreedName() is breedName).value()
      new TurtleSet(turtles, breedName)

    #@# Seems weird to me that you could ask a patch about the turtles/patch at coordinates other than its own...
    # (Number, Number) => TurtleSet
    turtlesAt: (dx, dy) ->
      @patchAt(dx, dy).turtlesHere()

    #@# Should be able to get rid of this and delegate to the `World`...
    # (Number, Number) => Patch
    patchAt: (dx, dy) ->
      try
        newX = @world.topology.wrapX(@pxcor + dx)
        newY = @world.topology.wrapY(@pycor + dy)
        return @world.getPatchAt(newX, newY) #@# Unnecessary `return`
      catch error
        if error instanceof Exception.TopologyInterrupt then Nobody else throw error

    # () => Unit
    watchme: ->
      @world.observer.watch(this)
      return

    # [T] @ (AbstractAgentSet[T], Number) => AbstractAgentSet[T]
    inRadius: (agents, radius) ->
      @world.topology.inRadius(this, @pxcor, @pycor, agents, radius)

    # (Patch) => { toInt: Number }
    compare: (x) ->
      Comparator.numericCompare(@id, x.id)

    # () => String
    toString: ->
      "(patch #{@pxcor} #{@pycor})"

    # () => Unit
    reset: ->
      @_varManager = @_genVarManager(@world.patchesOwnNames)
      @_setPcolor(0)
      @_setPlabel('')
      @_setPlabelColor(9.9)
      return

    # Array[String] => VariableManager
    _genVarManager: (extraVarNames) ->
      varBundles = [
        { name: 'id',           get: (=> @id),           set: (->)                         },
        { name: 'pcolor',       get: (=> @_pcolor),      set: ((x) => @_setPcolor(x))      },
        { name: 'plabel',       get: (=> @_plabel),      set: ((x) => @_setPlabel(x))      },
        { name: 'plabel-color', get: (=> @_plabelcolor), set: ((x) => @_setPlabelColor(x)) },
        { name: 'pxcor',        get: (=> @pxcor),        set: (->)                         },
        { name: 'pycor',        get: (=> @pycor),        set: (->)                         }
      ]

      new VariableManager(extraVarNames, varBundles)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @world.updater.updated(this)(varName)
      return

    # (Number) => Unit
    _setPcolor: (color) ->
      wrappedColor = ColorModel.wrapColor(color)
      if @_pcolor isnt wrappedColor
        @_pcolor = wrappedColor
        @_genVarUpdate("pcolor")
        if wrappedColor isnt 0
          @world.patchesAllBlack(false)
      return

    # (String) => Unit
    _setPlabel: (label) ->
      wasEmpty = @_plabel is ""
      isEmpty  = label is ""

      @_plabel = label
      @_genVarUpdate("plabel")

      if isEmpty and not wasEmpty
        @world.decrementPatchLabelCount()
      else if not isEmpty and wasEmpty
        @world.incrementPatchLabelCount()

      return


    # (Number) => Unit
    _setPlabelColor: (color) ->
      @_plabelcolor = ColorModel.wrapColor(color)
      @_genVarUpdate("plabel-color")
      return

)
