# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                 = require('lodash')
AbstractAgentSet  = require('./abstractagentset')
ColorModel        = require('engine/core/colormodel')
Nobody            = require('./nobody')
TurtleLinkManager = require('./turtlelinkmanager')
TurtleSet         = require('./turtleset')
NLType            = require('./typechecker')
VariableManager   = require('./structure/variablemanager')
Comparator        = require('util/comparator')
NLMath            = require('util/nlmath')

{ PenManager, PenStatus: { Down, Erase } }   = require('./structure/penmanager')
{ DeathInterrupt: Death, TopologyInterrupt } = require('util/exception')

module.exports =
  class Turtle

    # type GenTurtleFunc      = (Number, Number, Number, Number, Breed, String, Number, Boolean, Number, String, PenManager) => Turtle
    # type RegLineDrawFunc    = (Number, Number, Number, Number, RGB, Number, String) => Unit
    # type RegTurtleStampFunc = (Number, Number, Number, Number, RGB, String) => Unit

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
      @_varManager = @_genVarManager(varNames, @world.turtleManager.turtlesOfBreed)

      @_setBreed(breed)

      if @_givenShape?
        @_setShape(@_givenShape)

      @getPatchHere().trackTurtle(this)

    # () => String
    getBreedName: ->
      @_breed.name

    # (Number, Turtle) => Unit
    _setXcor: (newX, tiedCaller = undefined) ->

      originPatch = @getPatchHere()
      oldX        = @xcor
      @xcor       = @world.topology.wrapX(newX)
      @_updateVarsByName("xcor")
      @_drawLine(oldX, @ycor, newX, @ycor)

      if originPatch isnt @getPatchHere()
        originPatch.untrackTurtle(this)
        @getPatchHere().trackTurtle(this)

      @linkManager._refresh()

      dx = @xcor - oldX
      @_tiedTurtles().forEach(
        (turtle) =>
          if turtle isnt tiedCaller
            turtle._setXcor(turtle.xcor + dx, this)
          return
      )

      return

    # (Number, Turtle) => Unit
    _setYcor: (newY, tiedCaller = undefined) ->

      originPatch = @getPatchHere()
      oldY        = @ycor
      @ycor       = @world.topology.wrapY(newY)
      @_updateVarsByName("ycor")
      @_drawLine(@xcor, oldY, @xcor, newY)

      if originPatch isnt @getPatchHere()
        originPatch.untrackTurtle(this)
        @getPatchHere().trackTurtle(this)

      @linkManager._refresh()

      dy = @ycor - oldY
      @_tiedTurtles().forEach(
        (turtle) =>
          if turtle isnt tiedCaller
            turtle._setYcor(turtle.ycor + dy, this)
          return
      )

      return

    # (Number, Number, Turtle) => Unit
    _setXandY: (newX, newY, tiedCaller = undefined) ->

      originPatch = @getPatchHere()
      oldX        = @xcor
      oldY        = @ycor
      @xcor       = @world.topology.wrapX(newX)
      @ycor       = @world.topology.wrapY(newY)
      @_updateVarsByName("xcor", "ycor")
      @_drawLine(oldX, oldY, newX, newY)

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
        @_setHeading(@world.topology.towards(@xcor, @ycor, x, y))
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
      try
        x = @world.topology.wrapX(@xcor + dx)
        y = @world.topology.wrapY(@ycor + dy)
        @world.getPatchAt(x, y)
      catch error
        if error instanceof TopologyInterrupt
          Nobody
        else
          throw error

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
      heading = @_normalizeHeading(@_heading + angle)
      try
        newX = @world.topology.wrapX(@xcor + distance * NLMath.squash(NLMath.sin(heading)))
        newY = @world.topology.wrapY(@ycor + distance * NLMath.squash(NLMath.cos(heading)))
        @world.getPatchAt(newX, newY)
      catch error
        if error instanceof TopologyInterrupt then Nobody else throw error

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
      @_setHeading(@_normalizeHeading(newHeading), tiedCaller)
      return

    # (Number, Number, Turtle) => Unit
    setXY: (x, y, tiedCaller = undefined) ->
      origXcor = @xcor
      origYcor = @ycor
      try
        @_setXandY(x, y, tiedCaller)
      catch error
        @_setXandY(origXcor, origYcor, tiedCaller)
        if error instanceof TopologyInterrupt
          throw new TopologyInterrupt("The point [ #{x} , #{y} ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.")
        else
          throw error
      return

    # (Boolean) => Unit
    hideTurtle: (shouldHide) ->
      @_setIsHidden(shouldHide)
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
      new TurtleSet(newTurtles, breed)

    # (Breed) => Turtle
    _makeTurtleCopy: (breed) ->
      turtle   = @_createTurtle(@_color, @_heading, @xcor, @ycor, breed, @_label, @_labelcolor, @_hidden, @_size, @_givenShape, (self) => @penManager.clone(@_genUpdate(self)))
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
      @_registerTurtleStamp(@xcor, @ycor, @_size, @_heading, ColorModel.colorToRGB(@_color), @_getShape())
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

    # (Number, Number, Number, Number) => Unit
    _drawLine: (oldX, oldY, newX, newY) ->
      penMode = @penManager.getMode()
      if (penMode is Down or penMode is Erase) and (oldX isnt newX or oldY isnt newY)
         @_registerLineDraw(oldX, oldY, newX, newY, ColorModel.colorToRGB(@_color), @penManager.getSize(), @penManager.getMode().toString())
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

    # (Number) => Number
    _normalizeHeading: (heading) ->
      if (0 <= heading < 360)
        heading
      else
        ((heading % 360) + 360) % 360

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

    # (Array[String], (String) => TurtleSet) => VariableManager
    _genVarManager: (extraVarNames, getTurtlesByBreedName) ->
      varBundles = [
        { name: 'breed',       get: (=> getTurtlesByBreedName(@_breed.name)), set: ((x) => @_setBreed(x))             },
        { name: 'color',       get: (=> @_color),                             set: ((x) => @_setColor(x))             },
        { name: 'heading',     get: (=> @_heading),                           set: ((x) => @_setHeading(x))           },
        { name: 'hidden?',     get: (=> @_hidden),                            set: ((x) => @_setIsHidden(x))          },
        { name: 'label',       get: (=> @_label),                             set: ((x) => @_setLabel(x))             },
        { name: 'label-color', get: (=> @_labelcolor),                        set: ((x) => @_setLabelColor(x))        },
        { name: 'pen-mode',    get: (=> @penManager.getMode().toString()),    set: ((x) => @penManager.setPenMode(x)) },
        { name: 'pen-size',    get: (=> @penManager.getSize()),               set: ((x) => @penManager.setSize(x))    },
        { name: 'shape',       get: (=> @_getShape()),                        set: ((x) => @_setShape(x))             },
        { name: 'size',        get: (=> @_size),                              set: ((x) => @_setSize(x))              },
        { name: 'who',         get: (=> @id),                                 set: (->)                               },
        { name: 'xcor',        get: (=> @xcor),                               set: ((x) => @_setXcor(x))              },
        { name: 'ycor',        get: (=> @ycor),                               set: ((x) => @_setYcor(x))              }
      ]

      new VariableManager(extraVarNames, varBundles)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @_updateVarsByName(varName)
      return


    ###
     "Jason, this is craziness!", you say.  "Not quite," I say.  It _is_ kind of lame, but changing turtle members
     needs to be controlled, so that all changes cause updates to be triggered.  And since the `VariableManager` needs
     to know how to set all of the variables, we may as well declare the code for that in a place where it can be
     easily reused. --JAB (6/2/14)
    ###

    # (AbstractAgentSet|Breed|String) => Unit
    _setBreed: (breed) ->

      type = NLType(breed)

      trueBreed =
        if type.isString()
          @world.breedManager.get(breed)
        else if type.isAgentSet()
          if breed.getBreedName?
            @world.breedManager.get(breed.getBreedName())
          else
            throw new Error("You can't set BREED to a non-breed agentset.")
        else
          breed

      if @_breed isnt trueBreed
        trueBreed.add(this)
        @_breed?.remove(this)

        newNames = @_varNamesForBreed(trueBreed)
        oldNames = @_varNamesForBreed(@_breed)

        obsoletedNames = _(oldNames).difference(newNames).value()
        freshNames     = _(newNames).difference(oldNames).value()

        @_varManager.refineBy(obsoletedNames)(freshNames)

      @_breed = trueBreed
      @_genVarUpdate("breed")

      @_setBreedShape(trueBreed.getShape())

      if trueBreed isnt @world.breedManager.turtles()
        @world.breedManager.turtles().add(this)

      return

    # (String) => Unit
    _setBreedShape: (shape) ->
      @_breedShape = shape.toLowerCase()
      if not @_givenShape?
        @_genVarUpdate("shape")
      return

    # (Number) => Unit
    _setColor: (color) ->
      @_color = ColorModel.wrapColor(color)
      @_genVarUpdate("color")
      return

    # (Number, Turtle) => Unit
    _setHeading: (heading, tiedCaller = undefined) ->

      oldHeading = @_heading
      @_heading  = @_normalizeHeading(heading)
      @_genVarUpdate("heading")

      dh      = @_heading - oldHeading
      [x, y]  = @getCoords()

      @_fixedTiedTurtles().forEach(
        (turtle) =>
          if turtle isnt tiedCaller
            turtle.right(dh, this)
          return
      )

      @_tiedTurtles().forEach(
        (turtle) =>
          if turtle isnt tiedCaller
            r        = @distance(turtle)
            [tx, ty] = turtle.getCoords()
            theta    = StrictMath.toDegrees(StrictMath.atan2(ty - y, x - tx)) - 90 + dh
            newX     = x + r * NLMath.squash(NLMath.sin(theta))
            newY     = y + r * NLMath.squash(NLMath.cos(theta))
            turtle.setXY(newX, newY, this)
          return
      )

      return

    # (Boolean) => Unit
    _setIsHidden: (isHidden) ->
      @_hidden = isHidden
      @_genVarUpdate("hidden?")
      return

    # (String) => Unit
    _setLabel: (label) ->
      @_label = label
      @_genVarUpdate("label")
      return

    # (Number) => Unit
    _setLabelColor: (color) ->
      @_labelcolor = ColorModel.wrapColor(color)
      @_genVarUpdate("label-color")
      return

    # (String) => Unit
    _setShape: (shape) ->
      @_givenShape = shape.toLowerCase()
      @_genVarUpdate("shape")
      return

    # (Number) => Unit
    _setSize: (size) ->
      @_size = size
      @_genVarUpdate("size")
      return
