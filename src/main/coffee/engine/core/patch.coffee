# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_               = require('lodash')
Nobody          = require('./nobody')
TurtleSet       = require('./turtleset')
VariableManager = require('./structure/variablemanager')
ColorModel      = require('tortoise/util/colormodel')
Comparator      = require('tortoise/util/comparator')

{ DeathInterrupt: Death, TopologyInterrupt } = require('tortoise/util/exception')

module.exports =
  class Patch

    _updateVarsByName: undefined # (String*) => Unit
    _varManager:       undefined # VariableManager

    turtles: undefined # Array[Turtle]

    # (Number, Number, Number, World, (Updatable) => (String*) => Unit, () => Unit, () => Unit, () => Unit, (String) => LinkSet, Number, String, Number) => Patch
    constructor: (@id, @pxcor, @pycor, @world, genUpdate, @_declareNonBlackPatch, @_decrementPatchLabelCount
                , @_incrementPatchLabelCount, @_pcolor = 0.0, @_plabel = "", @_plabelcolor = 9.9) ->
      @_updateVarsByName = genUpdate(this)
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
    untrackTurtle: (turtle) ->
      @turtles.splice(@turtles.indexOf(turtle, 0), 1)
      return

    # (Turtle) => Unit
    trackTurtle: (turtle) ->
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

    # (() => Any) => Unit
    ask: (f) ->
      @world.selfManager.askAgent(f)(this)
      if @world.selfManager.self().id is -1
        throw new Death
      return

    # [Result] @ (() => Result) => Result
    projectionBy: (f) ->
      @world.selfManager.askAgent(f)(this)

    # () => PatchSet
    getNeighbors: ->
      @world.getNeighbors(@pxcor, @pycor)

    # () => PatchSet
    getNeighbors4: ->
      @world.getNeighbors4(@pxcor, @pycor)

    # (Number, String) => TurtleSet
    sprout: (n, breedName) ->
      @world.turtleManager.createTurtles(n, breedName, @pxcor, @pycor)

    # (String) => TurtleSet
    breedHere: (breedName) ->
      turtles = _(@turtles).filter((turtle) -> turtle.getBreedName() is breedName).value()
      new TurtleSet(turtles, breedName)

    # (Number, Number) => TurtleSet
    turtlesAt: (dx, dy) ->
      @patchAt(dx, dy).turtlesHere()

    # (Number, Number) => Agent
    patchAt: (dx, dy) ->
      try
        newX = @world.topology.wrapX(@pxcor + dx)
        newY = @world.topology.wrapY(@pycor + dy)
        @world.getPatchAt(newX, newY)
      catch error
        if error instanceof TopologyInterrupt then Nobody else throw error

    # () => Unit
    watchMe: ->
      @world.observer.watch(this)
      return

    # [T] @ (AbstractAgentSet[T], Number) => AbstractAgentSet[T]
    inRadius: (agents, radius) ->
      @world.topology.inRadius(@pxcor, @pycor, agents, radius)

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
      @_updateVarsByName(varName)
      return

    # (Number) => Unit
    _setPcolor: (color) ->
      wrappedColor = ColorModel.wrapColor(color)
      if @_pcolor isnt wrappedColor
        @_pcolor = wrappedColor
        @_genVarUpdate("pcolor")
        if wrappedColor isnt 0
          @_declareNonBlackPatch()
      return

    # (String) => Unit
    _setPlabel: (label) ->
      wasEmpty = @_plabel is ""
      isEmpty  = label is ""

      @_plabel = label
      @_genVarUpdate("plabel")

      if isEmpty and not wasEmpty
        @_decrementPatchLabelCount()
      else if not isEmpty and wasEmpty
        @_incrementPatchLabelCount()

      return


    # (Number) => Unit
    _setPlabelColor: (color) ->
      @_plabelcolor = ColorModel.wrapColor(color)
      @_genVarUpdate("plabel-color")
      return
