# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/abstractagentset', 'engine/core/nobody', 'engine/core/turtleset', 'engine/core/structure/builtins'
      , 'engine/core/structure/penmanager', 'engine/core/structure/variablemanager', 'shim/lodash', 'util/colormodel'
      , 'util/comparator', 'util/exception', 'util/trig']
     , ( AbstractAgentSet,               Nobody,               TurtleSet,               Builtins
      ,  PenManager,                         VariableManager,                         _,             ColorModel
      ,  Comparator,        Exception,        Trig) ->

  class Turtle

    _breed:            undefined # Breed
    _links:            undefined # Array[Link]
    _shape:            undefined # String
    _updateVarsByName: undefined # (String*) => Unit
    _varManager:       undefined # VariableManager

    #@# Should guard against improperly-named breeds, including empty-string breed names
    # (World, Number, (Updatable) => (String*) => Unit, (Number) => Unit, Number, Number, Number, Number, Breed, String, Number, Boolean, Number, PenManager) => Turtle
    constructor: (@world, @id, genUpdate, @_registerDeath, @_color = 0, @_heading = 0, @xcor = 0, @ycor = 0, breed = @world.breedManager.turtles(), @_label = "", @_labelcolor = 9.9, @_hidden = false, @_size = 1.0, @penManager = new PenManager(genUpdate(this))) ->
      @_updateVarsByName = genUpdate(this)

      varNames     = @world.turtlesOwnNames.concat(breed.varNames)
      @_varManager = @_genVarManager(varNames)

      @_links = []
      @_setBreed(breed)

      @getPatchHere().trackTurtle(this)

    # () => String
    getBreedName: ->
      @_breed.name

    # (Number) => Unit
    _setXcor: (newX) ->
      originPatch = @getPatchHere()
      @xcor = @world.topology.wrapX(newX)
      @_updateVarsByName("xcor")
      if originPatch isnt @getPatchHere()
        originPatch.untrackTurtle(this)
        @getPatchHere().trackTurtle(this)
      @_refreshLinks()
      return

    # (Number) => Unit
    _setYcor: (newY) ->
      originPatch = @getPatchHere()
      @ycor = @world.topology.wrapY(newY)
      @_updateVarsByName("ycor")
      if originPatch isnt @getPatchHere()
        originPatch.untrackTurtle(this)
        @getPatchHere().trackTurtle(this)
      @_refreshLinks()
      return

    # (Link) => Unit
    addLink: (link) =>
      @_links.push(link)
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
    towards: (agent) -> #@# Unify, man!
      [x, y] = agent.getCoords()
      @world.topology.towards(@xcor, @ycor, x, y)

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

    #@# Boy, this code sure is familiar... (`Patch.patchAt`)
    # (Number, Number) => Patch
    patchAt: (dx, dy) -> #@# Make not silly
      try
        x = @world.topology.wrapX(@xcor + dx)
        y = @world.topology.wrapY(@ycor + dy)
        @world.getPatchAt(x, y)
      catch error
        if error instanceof Exception.TopologyInterrupt
          Nobody
        else
          throw error

    # (Number, Number) => TurtleSet
    turtlesAt: (dx, dy) ->
      @getPatchHere().turtlesAt(dx, dy)

    # (Boolean, Boolean) => LinkSet
    connectedLinks: (isDirected, isSource) ->
      filterFunc =
        if isDirected #@# Conditional is unnecessary, really
          (link) => (link.isDirected and link.end1 is this and isSource) or (link.isDirected and link.end2 is this and not isSource)
        else
          (link) => (not link.isDirected and link.end1 is this) or (not link.isDirected and link.end2 is this)
      @world.links().filter(filterFunc)

    # (Boolean, Boolean) => TurtleSet
    linkNeighbors: (isDirected, isSource) ->
      reductionFunc =
        if isDirected
          (acc, link) =>
            if link.isDirected and link.end1 is this and isSource
              acc.push(link.end2)
            else if link.isDirected and link.end2 is this and not isSource
              acc.push(link.end1)
            acc
        else
          (acc, link) =>
            if not link.isDirected and link.end1 is this
              acc.push(link.end2)
            else if not link.isDirected and link.end2 is this
              acc.push(link.end1)
            acc

      turtles = world.links().toArray().reduce(reductionFunc, [])
      new TurtleSet(turtles)

    # (Boolean, Boolean, Turtle) => Boolean
    isLinkNeighbor: (isDirected, isSource, otherTurtle) -> #@# Varname, other WHAT?
      @linkNeighbors(isDirected, isSource).filter((neighbor) -> neighbor is otherTurtle).nonEmpty() #@# `_(derp).contains(other)` (Lodash)

    # (Boolean, Boolean, Turtle) => Link
    findLinkViaNeighbor: (isDirected, isSource, other) -> #@# Other WHAT?
      findFunc =
        if isDirected
          (link) => (link.isDirected and link.end1 is this and link.end2 is other and isSource) or (link.isDirected and link.end1 is other and link.end2 is this and not isSource)
        else if not isDirected and not @world.unbreededLinksAreDirected
          (link) => (not link.isDirected and link.end1 is this and link.end2 is other) or (not link.isDirected and link.end2 is this and link.end1 is other)
        else
          throw new Exception.NetLogoException("LINKS is a directed breed.")

      link = @world.links().find(findFunc)

      if link?
        link
      else
        Nobody

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
        newX = @world.topology.wrapX(@xcor + distance * Trig.sin(heading))
        newY = @world.topology.wrapY(@ycor + distance * Trig.cos(heading))
        @world.getPatchAt(newX, newY)
      catch error
        if error instanceof Exception.TopologyInterrupt then Nobody else throw error

    # (Number, Number) => Agent
    patchLeftAndAhead: (angle, distance) ->
      @patchRightAndAhead(-angle, distance)

    # (Number) => Agent
    patchAhead: (distance) ->
      @patchRightAndAhead(0, distance)

    # (() => Any) => Unit
    ask: (f) ->
      @world.selfManager.askAgent(f)(this)
      if @world.selfManager.self().id is -1
        throw new Exception.DeathInterrupt
      return

    # [Result] @ (() => Result) => Result
    projectionBy: (f) ->
      @world.selfManager.askAgent(f)(this)

    # (Number) => Unit
    fd: (distance) ->
      if distance > 0
        while distance >= 1 and @jump(1) #@# Possible point of improvement
          distance -= 1
        @jump(distance)
      else if distance < 0
        while distance <= -1 and @jump(-1)
          distance += 1
        @jump(distance)
      return

    # (Number) => Boolean
    jump: (distance) ->
      if @canMove(distance)
        @_setXcor(@xcor + distance * Trig.sin(@_heading))
        @_setYcor(@ycor + distance * Trig.cos(@_heading))
        return true
      return false #@# Orly?

    # () => Number
    dx: ->
      Trig.sin(@_heading)

    # () => Number
    dy: ->
      Trig.cos(@_heading)

    # (Number) => Unit
    right: (angle) ->
      newHeading = @_heading + angle
      @_setHeading(@_normalizeHeading(newHeading))
      return

    # (Number, Number) => Unit
    setXY: (x, y) ->
      origXcor = @xcor
      origYcor = @ycor
      try
        @_setXcor(x)
        @_setYcor(y)
      catch error
        @_setXcor(origXcor)
        @_setYcor(origYcor)
        if error instanceof Exception.TopologyInterrupt
          throw new Exception.TopologyInterrupt("The point [ #{x} , #{y} ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.")
        else
          throw error
      return

    # (Boolean) => Unit
    hideTurtle: (flag) -> #@# Varname
      @_setIsHidden(flag)
      return

    # (String) => Boolean
    isBreed: (breedName) ->
      @_breed.name.toUpperCase() is breedName.toUpperCase()

    # () => Nothing
    die: ->
      @_breed.remove(this)
      if @id isnt -1
        @world.removeTurtle(@id)
        @_seppuku()
        @world.links().forEach((link) =>
          if link.end1.id is @id or link.end2.id is @id
            try
              link.die()
            catch error
              throw error if not (error instanceof Exception.DeathInterrupt)
          return
        )
        @id = -1
        @getPatchHere().untrackTurtle(this)
      throw new Exception.DeathInterrupt("Call only from inside an askAgent block")

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
      breed      = if breedName? and not _(breedName).isEmpty() then @world.breedManager.get(breedName) else @_breed #@# Why is this even a thing?
      newTurtles = _(0).range(n).map(=> @_makeTurtleCopy(breed)).value()
      new TurtleSet(newTurtles, breed)

    # (Breed) => Turtle
    _makeTurtleCopy: (breed) ->
      turtle = @world.createTurtle(@_color, @_heading, @xcor, @ycor, breed, @_label, @_labelcolor, @_hidden, @_size, @penManager.clone())
      _(@world.turtlesOwnNames).forEach((varName) =>
        turtle.setVariable(varName, @getVariable(varName))
        return
      )
      turtle

    # (Turtle|Patch) => Unit
    moveTo: (agent) ->
      [x, y] = agent.getCoords()
      @setXY(x, y)
      return

    # () => Unit
    watchme: ->
      @world.observer.watch(this)
      return

    # (Link) => Unit
    removeLink: (link) ->
      @_links.splice(@_links.indexOf(link)) #@# Surely there's a more-coherent way to write this
      return

    # (Any) => Comparator
    compare: (x) ->
      if x instanceof Turtle
        Comparator.numericCompare(@id, x.id)
      else
        Comparator.NOT_EQUALS

    # () => String
    toString: ->
      "(#{@_breed.singular} #{@id})"

    # (Number) => Number
    _normalizeHeading: (heading) ->
      if (0 <= heading < 360)
        heading
      else
        ((heading % 360) + 360) % 360

    # () => Unit
    _refreshLinks: ->
      if not _(@_links).isEmpty()
        linkTypes = [[true, true], [true, false], [false, false]]
        _(linkTypes).map(
          (typePair) =>
            [isDirected, isSource] = typePair
            @connectedLinks(isDirected, isSource).toArray()
        ).flatten().forEach(
          (link) -> link.updateEndRelatedVars(); return
        )
      return

    # () => Unit
    _seppuku: ->
      @_registerDeath(@id)
      return

    # Array[String] => VariableManager
    _genVarManager: (extraVarNames) ->

      varBundles = [
        { name: 'breed',       get: (=> @world.turtlesOfBreed(@_breed.name)), set: ((x) => @_setBreed(x))             },
        { name: 'color',       get: (=> @_color),                             set: ((x) => @_setColor(x))             },
        { name: 'heading',     get: (=> @_heading),                           set: ((x) => @_setHeading(x))           },
        { name: 'hidden?',     get: (=> @_hidden),                            set: ((x) => @_setIsHidden(x))          },
        { name: 'label',       get: (=> @_label),                             set: ((x) => @_setLabel(x))             },
        { name: 'label-color', get: (=> @_labelcolor),                        set: ((x) => @_setLabelColor(x))        },
        { name: 'pen-mode',    get: (=> @penManager.getMode().toString()),    set: ((x) => @penManager.setPenMode(x)) },
        { name: 'pen-size',    get: (=> @penManager.getSize()),               set: ((x) => @penManager.setSize(x))    },
        { name: 'shape',       get: (=> @_shape),                             set: ((x) => @_setShape(x))             },
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

      trueBreed =
        if _(breed).isString()
          @world.breedManager.get(breed)
        else if breed instanceof AbstractAgentSet
          @world.breedManager.get(breed.getBreedName())
        else
          breed

      if @_breed isnt trueBreed
        trueBreed.add(this)

        newNames = trueBreed.varNames
        oldNames =
          if @_breed?
            @_breed.remove(this)
            @_breed.varNames
          else
            []

        obsoletedNames = _(oldNames).difference(newNames).value()
        freshNames     = _(newNames).difference(oldNames).value()

        @_varManager.refineBy(obsoletedNames)(freshNames)

      @_breed = trueBreed
      @_genVarUpdate("breed")

      @_setShape(trueBreed.getShape())

      if trueBreed isnt @world.breedManager.turtles()
        @world.breedManager.turtles().add(this)

      return


    # (Number) => Unit
    _setColor: (color) ->
      @_color = ColorModel.wrapColor(color)
      @_genVarUpdate("color")
      return

    # (Number) => Unit
    _setHeading: (heading) ->
      @_heading = @_normalizeHeading(heading)
      @_genVarUpdate("heading")
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
      @_shape = shape.toLowerCase()
      @_genVarUpdate("shape")
      return

    # (Number) => Unit
    _setSize: (size) ->
      @_size = size
      @_genVarUpdate("size")
      return

)
