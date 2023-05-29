# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

TurtleSet       = require('./turtleset')
{ checks }      = require('./typechecker')
VariableManager = require('./structure/variablemanager')
Comparator      = require('util/comparator')

{ filter, foldl } = require('brazierjs/array')

{ exceptionFactory: exceptions } = require('util/exception')
{ DeathInterrupt }               = require('util/interrupts')
{ Setters, VariableSpecs }       = require('./patch/patchvariables')
{ ExtraVariableSpec }            = require('./structure/variablespec')

module.exports =
  class Patch

    _turtles:    undefined # Array[Turtle]
    _varManager: undefined # VariableManager

    # (Number, Number, Number, World, (Updatable) => (String*) => Unit, () => Unit, () => Unit, () => Unit, (String) => LinkSet, Number, String, Number) => Patch
    constructor: (@id, @pxcor, @pycor, @world, @_genUpdate, @_declareNonBlackPatch, @_decrementPatchLabelCount
                , @_incrementPatchLabelCount, @_pcolor = 0.0, @_plabel = "", @_plabelcolor = 9.9) ->
      @_turtles          = []
      @_varManager       = @_genVarManager()

      # I am hoping that this would reduce layers of calls. --John Chen May 2023
      @getPatchVariable  = @_varManager.getVariable
      @getVariable  = @_varManager.getVariable
      @setPatchVariable  = @_varManager.setVariable
      @setVariable  = @_varManager.setVariable

    getName: ->
      "patch #{@pxcor} #{@pycor}"

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

    # (Turtle|Patch) => Number | TowardsInterrupt
    towards: (agent) ->
      [x, y] = agent.getCoords()
      @towardsXY(x, y)

    # (Number, Number) => Number | TowardsInterrupt
    towardsXY: (x, y) ->
      @world.topology.towards(@pxcor, @pycor, x, y)

    # () => TurtleSet
    turtlesHere: ->
      new TurtleSet(@_turtles[..], @world)

    # (() => Any) => Unit
    ask: (f) ->
      @world.selfManager.askAgent(f)(this)
      if @world.selfManager.self().isDead?()
        return DeathInterrupt
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
      @world.getPatchAt(x, y)

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
      @_varManager.reset()
      Setters.setPcolor.call(this, 0)
      Setters.setPlabel.call(this, '')
      Setters.setPlabelColor.call(this, 9.9)
      return

    # () => Boolean
    hasVariable: (varName) ->
      @world.patchesVariables.includes(varName)

    # () => Array[String]
    varNames: ->
      @world.patchesVariables

    # We no longer build a list of varspecs and store them for each variable. This should reduce n(agent number)*m(variable number)+1 object allocations/stores. --John Chen May 2023
    # Array[String] => VariableManager
    _genVarManager: () ->
      new VariableManager(this, VariableSpecs)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @_genUpdate(this)(varName)
      return

    # (PatchSet, String) => Number
    _neighborSum: (nbs, varName) ->
      f = (acc, neighbor) ->
        x = neighbor.getVariable(varName)
        if checks.isNumber(x)
          acc + x
        else
          throw exceptions.runtime("noSumOfListWithNonNumbers, #{x}", "sum")
      foldl(f)(0)(nbs.iterator().toArray())

    # (String) => Number
    _optimalNSum: (varName) ->
      @_neighborSum(@getNeighbors(), varName)

    # (String) => Number
    _optimalNSum4: (varName) ->
      @_neighborSum(@getNeighbors4(), varName)

    _ifFalse: (value, replacement) -> if (value is false) then replacement else value

    # () => Patch
    _optimalPatchHereInternal: -> this
    _optimalPatchNorth:        -> @world.topology._getPatchNorth(@pxcor, @pycor)     or Nobody
    _optimalPatchEast:         -> @world.topology._getPatchEast(@pxcor, @pycor)      or Nobody
    _optimalPatchSouth:        -> @world.topology._getPatchSouth(@pxcor, @pycor)     or Nobody
    _optimalPatchWest:         -> @world.topology._getPatchWest(@pxcor, @pycor)      or Nobody
    _optimalPatchNorthEast:    -> @world.topology._getPatchNorthEast(@pxcor, @pycor) or Nobody
    _optimalPatchSouthEast:    -> @world.topology._getPatchSouthEast(@pxcor, @pycor) or Nobody
    _optimalPatchSouthWest:    -> @world.topology._getPatchSouthWest(@pxcor, @pycor) or Nobody
    _optimalPatchNorthWest:    -> @world.topology._getPatchNorthWest(@pxcor, @pycor) or Nobody
