# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Nobody          = require('./nobody')
TurtleSet       = require('./turtleset')
VariableManager = require('./structure/variablemanager')
Comparator      = require('util/comparator')

{ filter, foldl } = require('brazierjs/array')

{ DeathInterrupt: Death, TopologyInterrupt } = require('util/exception')
{ Setters, VariableSpecs }                   = require('./patch/patchvariables')
{ ExtraVariableSpec }                        = require('./structure/variablespec')

module.exports =
  class Patch

    _turtles:    undefined # Array[Turtle]
    _varManager: undefined # VariableManager

    # (Number, Number, Number, World, (Updatable) => (String*) => Unit, () => Unit, () => Unit, () => Unit, (String) => LinkSet, Number, String, Number) => Patch
    constructor: (@id, @pxcor, @pycor, @world, @_genUpdate, @_declareNonBlackPatch, @_decrementPatchLabelCount
                , @_incrementPatchLabelCount, @_pcolor = 0.0, @_plabel = "", @_plabelcolor = 9.9) ->
      @_turtles          = []
      @_varManager       = @_genVarManager(@world.patchesOwnNames)

    getName: ->
      "patch #{@pxcor} #{@pycor}"

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
      new TurtleSet(@_turtles[..], @world)

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
      new TurtleSet(@breedHereArray(breedName), @world)

    # (String) => Array[Turtle]
    breedHereArray: (breedName) ->
      filter((turtle) -> turtle.getBreedName() is breedName)(@_turtles)

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

    # Unit -> Unit
    isDead: ->
      false

    # () => String
    toString: ->
      "(#{@getName()})"

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

    # (PatchSet, String) => Number
    _neighborSum: (nbs, varName) ->
      f = (acc, neighbor) ->
        x = neighbor.getVariable(varName)
        if NLType(x).isNumber()
          acc + x
        else
          throw new Exception("noSumOfListWithNonNumbers, #{x}")
      foldl(f)(0)(nbs.iterator().toArray())

    # (String) => Number
    _optimalNSum: (varName) ->
      @_neighborSum(@getNeighbors(), varName)

    # (String) => Number
    _optimalNSum4: (varName) ->
      @_neighborSum(@getNeighbors4(), varName)
