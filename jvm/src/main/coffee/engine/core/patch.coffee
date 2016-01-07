# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_               = require('lodash')
Nobody          = require('./nobody')
TurtleSet       = require('./turtleset')
VariableManager = require('./structure/variablemanager')
Comparator      = require('util/comparator')

{ DeathInterrupt: Death, TopologyInterrupt } = require('util/exception')
{ Setters, VariableSpecs }                   = require('./patch/patchvariables')
{ ExtraVariableSpec }                        = require('./structure/variablespec')

module.exports =
  class Patch

    _varManager:       undefined # VariableManager

    _turtles: undefined # Array[Turtle]

    # (Number, Number, Number, World, (Updatable) => (String*) => Unit, () => Unit, () => Unit, () => Unit, (String) => LinkSet, Number, String, Number) => Patch
    constructor: (@id, @pxcor, @pycor, @world, @_genUpdate, @_declareNonBlackPatch, @_decrementPatchLabelCount
                , @_incrementPatchLabelCount, @_pcolor = 0.0, @_plabel = "", @_plabelcolor = 9.9) ->
      @_turtles          = []
      @_varManager       = @_genVarManager(@world.patchesOwnNames)

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
      @_turtles.splice(@_turtles.indexOf(turtle, 0), 1)
      return

    # (Turtle) => Unit
    trackTurtle: (turtle) ->
      @_turtles.push(turtle)
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
      new TurtleSet(@_turtles[..])

    # (() => Any) => Unit
    ask: (f) ->
      @world.selfManager.askAgent(f)(this)
      if @world.selfManager.self().isDead?()
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
      new TurtleSet(@breedHereArray(breedName))

    # (String) => Array[Turtle]
    breedHereArray: (breedName) ->
      _(@_turtles).filter((turtle) -> turtle.getBreedName() is breedName).value()

    # (Number, Number) => TurtleSet
    turtlesAt: (dx, dy) ->
      @patchAt(dx, dy).turtlesHere()

    # (String, Number, Number) => TurtleSet
    breedAt: (breedName, dx, dy) ->
      @patchAt(dx, dy).breedHere(breedName)

    # (Number, Number) => Agent
    patchAt: (dx, dy) =>
      @patchAtCoords(@pxcor + dx, @pycor + dy)

    # (Number, Number) => Agent
    patchAtCoords: (x, y) ->
      @world.patchAtCoords(x, y)

    # (Number, Number) => Agent
    patchAtHeadingAndDistance: (angle, distance) ->
      @world.patchAtHeadingAndDistanceFrom(angle, distance, @pxcor, @pycor)

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
      Setters.setPcolor.call(this, 0)
      Setters.setPlabel.call(this, '')
      Setters.setPlabelColor.call(this, 9.9)
      return

    # () => Array[String]
    varNames: ->
      @_varManager.names()

    # Array[String] => VariableManager
    _genVarManager: (extraVarNames) ->
      extraSpecs = extraVarNames.map((name) -> new ExtraVariableSpec(name))
      allSpecs   = VariableSpecs.concat(extraSpecs)
      new VariableManager(this, allSpecs)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @_genUpdate(this)(varName)
      return
