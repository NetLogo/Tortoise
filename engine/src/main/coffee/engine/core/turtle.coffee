# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet  = require('./abstractagentset')
ColorModel        = require('engine/core/colormodel')
TurtleLinkManager = require('./turtlelinkmanager')
TurtleSet         = require('./turtleset')
NLType            = require('./typechecker')
VariableManager   = require('./structure/variablemanager')
makePenLines      = require('./turtle/makepenlines')
Comparator        = require('util/comparator')
NLMath            = require('util/nlmath')

{ foldl, forEach, map, uniqueBy } = require('brazierjs/array')
{ rangeUntil }                    = require('brazierjs/number')

{ PenManager, PenStatus: { Down, Erase } }             = require('./structure/penmanager')
{ ExtraVariableSpec }                                  = require('./structure/variablespec')
{ DeathInterrupt: Death, ignoring, TopologyInterrupt } = require('util/exception')
{ Setters, VariableSpecs }                             = require('./turtle/turtlevariables')

ignorantly = ignoring(TopologyInterrupt)

class StampMode
  constructor: (@name) -> # (String) => StampMode

Stamp      = new StampMode("normal")
StampErase = new StampMode("erase")

module.exports =
  class Turtle

    # type GenTurtleFunc      = (Number, Number, Number, Number, Breed, String, Number, Boolean, Number, String, PenManager) => Turtle
    # type IDSet              = Object[ID, Boolean]
    # type RegLineDrawFunc    = (Number, Number, Number, Number, Boolean, Boolean, RGB, Number, String, String) => Unit
    # type RegTurtleStampFunc = (Number, Number, Number, Number, RGB, String, String) => Unit

    _breed:            undefined # Breed
    _breedShape:       undefined # String
    _name:             undefined # String
    _updateVarsByName: undefined # (String*) => Unit
    _varManager:       undefined # VariableManager

    linkManager: undefined # TurtleLinkManager

    # The type signatures here can be found to the right of the parameters. --JAB (4/13/15)
    constructor: (@world, @id, @_genUpdate, @_registerLineDraw, @_registerTurtleStamp, @_registerDeath, @_createTurtle   # World, Number, (Updatable) => (String*) => Unit, RegLinkDrawFunc, RegTurtleStampFunc, (Number) => Unit, GenTurtleType
                , @_removeTurtle, @_color = 0, @_heading = 0, @xcor = 0, @ycor = 0                                       # (Number) => Unit, Number, Number, Number, Number
                , breed = null, @_label = "", @_labelcolor = 9.9, @_hidden = false                                       # Breed, String, Number, Boolean
                , @_size = 1.0, @_givenShape, genPenManager = (self) => new PenManager(@_genUpdate(self))) ->            # Number, Boolean, Number, String, (Updatable) => PenManager
      breed = breed ? @world.breedManager.turtles()
      @_updateVarsByName = @_genUpdate(this)

      @penManager  = genPenManager(this)
      @linkManager = new TurtleLinkManager(@id, @world)

      varNames     = @_varNamesForBreed(breed)
      @_varManager = @_genVarManager(varNames)

      Setters.setBreed.call(this, breed)

      if @_givenShape?
        Setters.setShape.call(this, @_givenShape)

      @getPatchHere().trackTurtle(this)

    # () => String
    getBreedName: ->
      @_breed.name

    # () => String
    getBreedNameSingular: ->
      @_breed.singular

    # Unit -> String
    getName: ->
      @_name

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

    # [T] @ (AbstractAgentSet[T], Number, Number) => AbstractAgentSet[T]
    inCone: (agents, distance, angle) ->
      if distance < 0
        throw new Error("IN-CONE cannot take a negative radius.")
      else if angle < 0
        throw new Error("IN-CONE cannot take a negative angle.")
      else if angle > 360
        throw new Error("IN-CONE cannot take an angle greater than 360.")
      else
        @world.topology.inCone(@xcor, @ycor, NLMath.normalizeHeading(@_heading), agents, distance, angle)

    # [T] @ (AbstractAgentSet[T], Number) => AbstractAgentSet[T]
    inRadius: (agents, radius) ->
      @world.topology.inRadius(@xcor, @ycor, agents, radius)

    # (Number, Number) => Patch
    patchAt: (dx, dy) =>
      @world.patchAtCoords(@xcor + dx, @ycor + dy)

    # (Number, Number) => TurtleSet
    turtlesAt: (dx, dy) ->
      @getPatchHere().turtlesAt(dx, dy)

    # (String, Number, Number) => TurtleSet
    breedAt: (breedName, dx, dy) ->
      @getPatchHere().breedAt(breedName, dx, dy)

    # () => Turtle
    otherEnd: ->
      if this is @world.selfManager.myself().end1
        @world.selfManager.myself().end2
      else
        @world.selfManager.myself().end1

    # (Number, Number) => Agent
    patchAtHeadingAndDistance: (angle, distance) ->
      @world.patchAtHeadingAndDistanceFrom(angle, distance, @xcor, @ycor)

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
      if not @isDead()
        @world.selfManager.askAgent(f)(this)
        if @world.selfManager.self().isDead?()
          throw new Death
      else
        throw new Error("That #{@getBreedNameSingular()} is dead.")
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
      if remaining isnt 0
        @jumpIfAble(remaining)
      return

    # (Number) => Unit
    _optimalFdOne: () ->
      @jumpIfAble(1)
      return

    # (Number) => Unit
    _optimalFdLessThan1: (distance) ->
      @jumpIfAble(distance)
      return

    # (String) => Number
    _optimalNSum: (varName) ->
      @getPatchHere()._optimalNSum(varName)

    # (String) => Number
    _optimalNSum4: (varName) ->
      @getPatchHere()._optimalNSum4(varName)

    # (Number) => Boolean
    jumpIfAble: (distance) ->
      canMove = @canMove(distance)
      if canMove then @_jump(distance)
      canMove

    # (Number) => Unit
    _jump: (distance) ->
      @_drawJumpLine(@xcor, @ycor, distance, @_heading)
      @_setXandY(@xcor + distance * @dx(), @ycor + distance * @dy())
      return

    # () => Number
    dx: ->
      NLMath.squash(NLMath.sin(@_heading))

    # () => Number
    dy: ->
      NLMath.squash(NLMath.cos(@_heading))

    # (Number, IDSet) => Unit
    right: (angle, seenTurtlesSet = {}) ->
      newHeading = @_heading + angle
      Setters.setHeading.call(this, newHeading, seenTurtlesSet)
      return

    # (Number, Number, IDSet) => Unit
    setXY: (x, y, seenTurtlesSet = {}) ->
      origXcor = @xcor
      origYcor = @ycor
      try
        @_setXandY(x, y, seenTurtlesSet)
        @_drawSetLine(origXcor, origYcor, x, y)
      catch error
        @_setXandY(origXcor, origYcor, seenTurtlesSet)
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
        @linkManager.clear()
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
      num         = if n >= 0 then n else 0
      isNameValid = breedName? and breedName isnt ""
      breed       = if isNameValid then @world.breedManager.get(breedName) else @_breed
      newTurtles  = map(=> @_makeTurtleCopy(breed))(rangeUntil(0)(num))
      new TurtleSet(newTurtles, @world)

    # (Breed) => Turtle
    _makeTurtleCopy: (breed) ->
      shape    = if breed is @_breed then @_givenShape else undefined
      turtle   = @_createTurtle(@_color, @_heading, @xcor, @ycor, breed, @_label, @_labelcolor, @_hidden, @_size, shape, (self) => @penManager.clone(@_genUpdate(self)))
      varNames = @_varNamesForBreed(breed)
      forEach((varName) =>
        turtle.setVariable(varName, @getVariable(varName) ? 0)
        return
      )(varNames)
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
        "(#{@getName()})"
      else
        "nobody"

    # () => Array[String]
    varNames: ->
      @_varManager.names()

    # (StampMode) => Unit
    _drawStamp: (mode) ->
      @_registerTurtleStamp(@xcor, @ycor, @_size, @_heading, ColorModel.colorToRGB(@_color), @_getShape(), mode.name)
      return

    # (Number, Number, Number) => Unit
    _drawJumpLine: (x, y, dist, head) ->
      penMode = @penManager.getMode()
      if (penMode is Down or penMode is Erase)
        @_drawLines(x, y, dist, head)
      return

    # (Number, Number, Number, Number) => Unit
    _drawSetLine: (oldX, oldY, newX, newY) ->
      penMode = @penManager.getMode()
      if (penMode is Down or penMode is Erase) and (oldX isnt newX or oldY isnt newY)
        wrappedX = oldX + @world.topology._shortestX(oldX, newX)
        wrappedY = oldY + @world.topology._shortestY(oldY, newY)
        { minPxcor, maxPxcor, minPycor, maxPycor } = @world.topology
        if (minPxcor < wrappedX and wrappedX < maxPxcor and minPycor < wrappedY and wrappedY < maxPycor)
          @_registerLineDraw(oldX, oldY, wrappedX, wrappedY, ColorModel.colorToRGB(@_color), @penManager.getSize(), @penManager.getMode().toString())
        else
          jumpDist = NLMath.sqrt(NLMath.pow(oldX - wrappedX, 2) + NLMath.pow(oldY - wrappedY, 2))
          jumpHead = @world.topology.towards(oldX, oldY, wrappedX, wrappedY)
          @_drawLines(oldX, oldY, jumpDist, jumpHead)
      return

    # (Number, Number, Number) => Unit
    _drawLines: (x, y, dist, head) ->
      color = ColorModel.colorToRGB(@_color)
      size  = @penManager.getSize()
      mode  = @penManager.getMode().toString()
      { minPxcor, maxPxcor, minPycor, maxPycor } = @world.topology
      lines = makePenLines(x, y, NLMath.normalizeHeading(head), dist, minPxcor - 0.5, maxPxcor + 0.5, minPycor - 0.5, maxPycor + 0.5)
      forEach(({ x1, y1, x2, y2 }) => @_registerLineDraw(x1, y1, x2, y2, color, size, mode); return)(lines)
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
      links = @linkManager.myOutLinks("LINKS").toArray().filter((l) -> l.tiemode isnt "none")
      f =
        ([fixeds, others], { end1, end2, tiemode }) =>
          turtle = if end1 is this then end2 else end1
          if tiemode is "fixed"
            [fixeds.concat([turtle]), others]
          else
            [fixeds, others.concat([turtle])]

      [fixeds, others] = foldl(f)([[], []])(links)

      { fixeds: fixeds, others: others }

    # () => Array[Turtle]
    _tiedTurtles: ->
      { fixeds, others } = @_tiedTurtlesRaw()
      @_uniqueTurtles(fixeds.concat(others))

    # () => Array[Turtle]
    _fixedTiedTurtles: ->
      @_uniqueTurtles(@_tiedTurtlesRaw().fixeds)

    # (Array[Turtle]) => Array[Turtle]
    _uniqueTurtles: (turtles) ->
      uniqueBy((t) -> t.id)(turtles)

    # (Array[String]) => VariableManager
    _genVarManager: (extraVarNames) ->
      extraSpecs = extraVarNames.map((name) -> new ExtraVariableSpec(name))
      allSpecs   = VariableSpecs.concat(extraSpecs)
      new VariableManager(this, allSpecs)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @_updateVarsByName(varName)
      return

    # Unit -> Unit
    _refreshName: ->
      @_name = "#{@_breed.singular} #{@id}"
      return

    # (Number, Number, IDSet) => Unit
    _setXandY: (newX, newY, seenTurtlesSet = {}) ->

      originPatch = @getPatchHere()
      oldX        = @xcor
      oldY        = @ycor
      xcor        = @world.topology.wrapX(newX)
      ycor        = @world.topology.wrapY(newY)

      # DO NOT SET `xcor` AND `ycor` DIRECTLY FROM `wrap*`.  `wrap*` can throw a `TopologyException`.
      # If we set only one of the coordinates and then bail with an exception (and without generating the View update),
      # it causes all sorts of bonkers stuff to happen. --JAB (10/17/17)
      @xcor = xcor
      @ycor = ycor
      @_updateVarsByName("xcor", "ycor")

      if originPatch isnt @getPatchHere()
        originPatch.untrackTurtle(this)
        @getPatchHere().trackTurtle(this)

      @linkManager._refresh()

      # It's important not to use the wrapped coordinates (`@xcor`, `@ycor`) here.
      # Using those will cause floating point arithmetic discrepancies. --JAB (10/22/15)
      dx = newX - oldX
      dy = newY - oldY
      f  = (seenTurtles) => (turtle) => ignorantly(() => turtle._setXandY(turtle.xcor + dx, turtle.ycor + dy, seenTurtles))
      @_withEachTiedTurtle(f, seenTurtlesSet)

      return

    # ((IDSet) => (Turtle) => Any, IDSet) => Unit
    _withEachTiedTurtle: (f, seenTurtlesSet) ->
      seenTurtlesSet[@id] = true
      turtles = @_tiedTurtles().filter(({ id }) -> not seenTurtlesSet[id]?)
      turtles.forEach(({ id }) -> seenTurtlesSet[id] = true)
      turtles.forEach(f(seenTurtlesSet))
      return

    # () => Patch
    _optimalPatchHereInternal: -> @getPatchHere()
    _optimalPatchNorth:        -> @getPatchHere()._optimalPatchNorth()
    _optimalPatchEast:         -> @getPatchHere()._optimalPatchEast()
    _optimalPatchSouth:        -> @getPatchHere()._optimalPatchSouth()
    _optimalPatchWest:         -> @getPatchHere()._optimalPatchWest()
    _optimalPatchNorthEast:    -> @getPatchHere()._optimalPatchNorthEast()
    _optimalPatchSouthEast:    -> @getPatchHere()._optimalPatchSouthEast()
    _optimalPatchSouthWest:    -> @getPatchHere()._optimalPatchSouthWest()
    _optimalPatchNorthWest:    -> @getPatchHere()._optimalPatchNorthWest()
