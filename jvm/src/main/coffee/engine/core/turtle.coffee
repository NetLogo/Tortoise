# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                 = require('lodash')
AbstractAgentSet  = require('./abstractagentset')
ColorModel        = require('engine/core/colormodel')
makePenLines      = require('./makepenlines')
Nobody            = require('./nobody')
TurtleLinkManager = require('./turtlelinkmanager')
TurtleSet         = require('./turtleset')
NLType            = require('./typechecker')
VariableManager   = require('./structure/variablemanager')
Comparator        = require('util/comparator')
NLMath            = require('util/nlmath')

{ PenManager, PenStatus: { Down, Erase } }   = require('./structure/penmanager')
{ ExtraVariableSpec }                        = require('./structure/variablespec')
{ DeathInterrupt: Death, TopologyInterrupt } = require('util/exception')
{ Setters, VariableSpecs }                   = require('./turtle/turtlevariables')

class StampMode
  constructor: (@name) -> # (String) => StampMode

Stamp      = new StampMode("normal")
StampErase = new StampMode("erase")

module.exports =
  class Turtle

    # type GenTurtleFunc      = (Number, Number, Number, Number, Breed, String, Number, Boolean, Number, String, PenManager) => Turtle
    # type RegLineDrawFunc    = (Number, Number, Number, Number, Boolean, Boolean, RGB, Number, String, String) => Unit
    # type RegTurtleStampFunc = (Number, Number, Number, Number, RGB, String, String) => Unit

    _breed:            undefined # Breed
    _breedShape:       undefined # String
    _updateVarsByName: undefined # (String*) => Unit
    _varManager:       undefined # VariableManager

    linkManager: undefined # TurtleLinkManager

    # The type signatures here can be found to the right of the parameters. --JAB (4/13/15)
    constructor: (@world, @id, @_genUpdate, @_registerLineDraw, @_registerTurtleStamp, @_registerDeath, @_createTurtle   # World, Number, (Updatable) => (String*) => Unit, RegLinkDrawFunc, RegTurtleStampFunc, (Number) => Unit, GenTurtleType
                , @_removeTurtle, @_color = 0, @_heading = 0, @xcor = 0, @ycor = 0                                       # (Number) => Unit, Number, Number, Number, Number
                , breed = @world.breedManager.turtles(), @_label = "", @_labelcolor = 9.9, @_hidden = false              # Breed, String, Number, Boolean
                , @_size = 1.0, @_givenShape, genPenManager = (self) => new PenManager(@_genUpdate(self))) ->            # Number, Boolean, Number, String, (Updatable) => PenManager
      @_updateVarsByName = @_genUpdate(this)

      @penManager  = genPenManager(this)
      @linkManager = new TurtleLinkManager(@id, @world.breedManager)

      varNames     = @_varNamesForBreed(breed)
      @_varManager = @_genVarManager(varNames)

      Setters.setBreed.call(this, breed)

      if @_givenShape?
        Setters.setShape.call(this, @_givenShape)

      @getPatchHere().trackTurtle(this)

    # () => String
    getBreedName: ->
      @_breed.name

    # (Number) => Boolean
    canMove: (distance) ->
      @patchAhead(distance) isnt Nobody

    # (Turtle|Patch) => Number
    distance: (agent) ->
      @world.topology.distance(@xcor, @ycor, agent)

    # (Number, Number) => Number
    distanceXY: (x, y) ->
      @world.topology.distanceXY(@xcor, @ycor, x, y)

    # () => (Number, Number)
    getCoords: ->
      [@xcor, @ycor]

    # (Turtle|Patch) => Number
    towards: (agent) ->
      [x, y] = agent.getCoords()
      @towardsXY(x, y)

    # (Number, Number) => Number
    towardsXY: (x, y) ->
      @world.topology.towards(@xcor, @ycor, x, y)

    # (Number, Number) => Unit
    faceXY: (x, y) ->
      if x isnt @xcor or y isnt @ycor
        Setters.setHeading.call(this, @world.topology.towards(@xcor, @ycor, x, y))
      return

    # (Turtle|Patch) => Unit
    face: (agent) ->
      [x, y] = agent.getCoords()
      @faceXY(x, y)
      return

    # [T] @ (AbstractAgentSet[T], Number) => AbstractAgentSet[T]
    inRadius: (agents, radius) ->
      @world.topology.inRadius(@xcor, @ycor, agents, radius)

    # (Number, Number) => Patch
    patchAt: (dx, dy) ->
      @world.patchAtCoords(@xcor + dx, @ycor + dy)

    # (Number, Number) => TurtleSet
    turtlesAt: (dx, dy) ->
      @getPatchHere().turtlesAt(dx, dy)

    # () => Turtle
    otherEnd: ->
      if this is @world.selfManager.myself().end1
        @world.selfManager.myself().end2
      else
        @world.selfManager.myself().end1

    # (Number, Number) => Agent
    patchRightAndAhead: (angle, distance) ->
      @patchAtHeadingAndDistance(@_heading + angle, distance)

    # (Number, Number) => Agent
    patchLeftAndAhead: (angle, distance) ->
      @patchRightAndAhead(-angle, distance)

    # (Number) => Agent
    patchAhead: (distance) ->
      @patchRightAndAhead(0, distance)

    # (() => Any) => Unit
    ask: (f) ->
      @world.selfManager.askAgent(f)(this)
      if @world.selfManager.self().isDead?()
        throw new Death
      return

    # [Result] @ (() => Result) => Result
    projectionBy: (f) ->
      if not @isDead()
        @world.selfManager.askAgent(f)(this)
      else
        throw new Error("That #{@_breed.singular} is dead.")

    # Unfortunately, further attempts to streamline this code are very likely to lead to
    # floating point arithmetic mismatches with JVM NetLogo....  Beware. --JAB (7/28/14)
    # (Number) => Unit
    fd: (distance) ->
      increment = if distance > 0 then 1 else -1
      remaining = distance
      if distance > 0
        while remaining >= increment and @jumpIfAble(increment)
          remaining -= increment
      else if distance < 0
        while remaining <= increment and @jumpIfAble(increment)
          remaining -= increment
      @jumpIfAble(remaining)
      return

    # (Number) => Boolean
    jumpIfAble: (distance) ->
      canMove = @canMove(distance)
      if canMove then @_jump(distance)
      canMove

    # (Number) => Unit
    _jump: (distance) ->
      @_drawJumpLine(@xcor, @ycor, distance)
      @_setXandY(@xcor + distance * @dx(), @ycor + distance * @dy())
      return

    # () => Number
    dx: ->
      NLMath.squash(NLMath.sin(@_heading))

    # () => Number
    dy: ->
      NLMath.squash(NLMath.cos(@_heading))

    # (Number, Turtle) => Unit
    right: (angle, tiedCaller = undefined) ->
      newHeading = @_heading + angle
      Setters.setHeading.call(this, NLMath.normalizeHeading(newHeading), tiedCaller)
      return

    # (Number, Number, Turtle) => Unit
    setXY: (x, y, tiedCaller = undefined) ->
      origXcor = @xcor
      origYcor = @ycor
      try
        @_setXandY(x, y, tiedCaller)
        @_drawLine(origXcor, origYcor, x, y)
      catch error
        @_setXandY(origXcor, origYcor, tiedCaller)
        if error instanceof TopologyInterrupt
          throw new TopologyInterrupt("The point [ #{x} , #{y} ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.")
        else
          throw error
      return

    # Handy for when your turtles are drunk --JAB (8/18/15)
    # () => Unit
    goHome: ->
      @setXY(0, 0)
      return

    # (Boolean) => Unit
    hideTurtle: (shouldHide) ->
      Setters.setIsHidden.call(this, shouldHide)
      return

    # (String) => Boolean
    isBreed: (breedName) ->
      @_breed.name.toUpperCase() is breedName.toUpperCase()

    # () => Boolean
    isDead: ->
      @id is -1

    # () => Nothing
    die: ->
      @_breed.remove(this)
      if not @isDead()
        @_removeTurtle(@id)
        @_seppuku()
        @linkManager._clear()
        @id = -1
        @getPatchHere().untrackTurtle(this)
        @world.observer.unfocus(this)
      throw new Death("Call only from inside an askAgent block")

    # (String) => Any
    getVariable: (varName) ->
      @_varManager[varName]

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_varManager[varName] = value
      return

    # () => Patch
    getPatchHere: ->
      @world.getPatchAt(@xcor, @ycor)

    # (String) => Any
    getPatchVariable: (varName) ->
      @getPatchHere().getVariable(varName)

    # (String, Any) => Unit
    setPatchVariable: (varName, value) ->
      @getPatchHere().setVariable(varName, value)
      return

    # () => PatchSet
    getNeighbors: ->
      @getPatchHere().getNeighbors()

    # () => PatchSet
    getNeighbors4: ->
      @getPatchHere().getNeighbors4()

    # () => TurtleSet
    turtlesHere: ->
      @getPatchHere().turtlesHere()

    # (String) => TurtleSet
    breedHere: (breedName) ->
      @getPatchHere().breedHere(breedName)

    # (Number, String) => TurtleSet
    hatch: (n, breedName) ->
      isNameValid = breedName? and not _(breedName).isEmpty()
      breed       = if isNameValid then @world.breedManager.get(breedName) else @_breed
      newTurtles  = _(0).range(n).map(=> @_makeTurtleCopy(breed)).value()
      new TurtleSet(newTurtles)

    # (Breed) => Turtle
    _makeTurtleCopy: (breed) ->
      shape    = if breed is @_breed then @_givenShape else undefined
      turtle   = @_createTurtle(@_color, @_heading, @xcor, @ycor, breed, @_label, @_labelcolor, @_hidden, @_size, shape, (self) => @penManager.clone(@_genUpdate(self)))
      varNames = @_varNamesForBreed(breed)
      _(varNames).forEach((varName) =>
        turtle.setVariable(varName, @getVariable(varName))
        return
      ).value()
      turtle

    # (Breed) => Array[String]
    _varNamesForBreed: (breed) ->
      turtlesBreed = @world.breedManager.turtles()
      if breed is turtlesBreed or not breed?
        turtlesBreed.varNames
      else
        turtlesBreed.varNames.concat(breed.varNames)

    # (Turtle|Patch) => Unit
    moveTo: (agent) ->
      [x, y] = agent.getCoords()
      @setXY(x, y)
      return

    # () => Unit
    followMe: ->
      @world.observer.follow(this)
      return

    # () => Unit
    rideMe: ->
      @world.observer.ride(this)
      return

    # () => Unit
    watchMe: ->
      @world.observer.watch(this)
      return

    # () => Unit
    stamp: ->
      @_drawStamp(Stamp)
      return

    # () => Unit
    stampErase: ->
      @_drawStamp(StampErase)
      return

    # (Any) => Comparator
    compare: (x) ->
      if NLType(x).isTurtle()
        Comparator.numericCompare(@id, x.id)
      else
        Comparator.NOT_EQUALS

    # () => String
    toString: ->
      if not @isDead()
        "(#{@_breed.singular} #{@id})"
      else
        "nobody"

    # () => Array[String]
    varNames: ->
      @_varManager.names()

    # (StampMode) => Unit
    _drawStamp: (mode) ->
      @_registerTurtleStamp(@xcor, @ycor, @_size, @_heading, ColorModel.colorToRGB(@_color), @_getShape(), mode.name)
      return

    # (Number, Number, Number, Number) => Unit
    _drawLine: (oldX, oldY, newX, newY) ->
      penMode = @penManager.getMode()
      if (penMode is Down or penMode is Erase) and (oldX isnt newX or oldY isnt newY)
        wrappedX = @world.topology.wrapX(newX)
        wrappedY = @world.topology.wrapY(newY)
        @_registerLineDraw(oldX, oldY, wrappedX, wrappedY, ColorModel.colorToRGB(@_color), @penManager.getSize(), @penManager.getMode().toString())
      return

    # (Number, Number, Number) => Unit
    _drawJumpLine: (x, y, dist) ->
      penMode = @penManager.getMode()
      if (penMode is Down or penMode is Erase)
        color = ColorModel.colorToRGB(@_color)
        size  = @penManager.getSize()
        mode  = @penManager.getMode().toString()
        { minPxcor, maxPxcor, minPycor, maxPycor } = @world.topology
        lines = makePenLines(x, y, NLMath.normalizeHeading(@_heading), dist, minPxcor - 0.5, maxPxcor + 0.5, minPycor - 0.5, maxPycor + 0.5)
        _(lines).forEach(({ x1, y1, x2, y2 }) => @_registerLineDraw(x1, y1, x2, y2, color, size, mode); return).value()
      return

    # Unfortunately, we can't just throw out `_breedShape` and grab the shape from our
    # `Breed` object.  It would be pretty nice if we could, but the problem is that
    # `set-default-shape` only affects turtles created after its use, so turtles that
    # were using breed shape <X> before `set-default-shape` set the breed's shape to <Y>
    # still need to be using <X>. --JAB (12/5/14)
    # () => String
    _getShape: ->
      @_givenShape ? @_breedShape

    # (String) => (Link) => Boolean
    _linkBreedMatches: (breedName) -> (link) ->
      breedName is "LINKS" or breedName is link.getBreedName()

    # () => Unit
    _seppuku: ->
      @_registerDeath(@id)
      return

    # () => { "fixeds": Array[Turtle], "others": Array[Turtle] }
    _tiedTurtlesRaw: ->
      links = @linkManager.tieLinks().filter((l) -> l.tiemode isnt "none")
      f =
        ([fixeds, others], { end1, end2, tiemode }) =>
          turtle = if end1 is this then end2 else end1
          if tiemode is "fixed"
            [fixeds.concat([turtle]), others]
          else
            [fixeds, others.concat([turtle])]

      [fixeds, others] = _(links).foldl(f, [[], []])

      { fixeds: fixeds, others: others }

    # () => Array[Turtle]
    _tiedTurtles: ->
      { fixeds, others } = @_tiedTurtlesRaw()
      _(fixeds.concat(others)).unique(false, (x) -> x.id).value()

    _fixedTiedTurtles: ->
      _(@_tiedTurtlesRaw().fixeds).unique(false, (x) -> x.id).value()

    # (Array[String]) => VariableManager
    _genVarManager: (extraVarNames) ->
      extraSpecs = extraVarNames.map((name) -> new ExtraVariableSpec(name))
      allSpecs   = VariableSpecs.concat(extraSpecs)
      new VariableManager(this, allSpecs)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @_updateVarsByName(varName)
      return

    # (Number, Number, Turtle) => Unit
    _setXandY: (newX, newY, tiedCaller = undefined) ->

      originPatch = @getPatchHere()
      oldX        = @xcor
      oldY        = @ycor
      @xcor       = @world.topology.wrapX(newX)
      @ycor       = @world.topology.wrapY(newY)
      @_updateVarsByName("xcor", "ycor")

      if originPatch isnt @getPatchHere()
        originPatch.untrackTurtle(this)
        @getPatchHere().trackTurtle(this)

      @linkManager._refresh()

      dx = @xcor - oldX
      dy = @ycor - oldY
      @_tiedTurtles().forEach(
        (turtle) =>
          if turtle isnt tiedCaller
            turtle._setXandY(turtle.xcor + dx, turtle.ycor + dy, this)
          return
      )

      return
