#@# Extends: `Agent`, `Vassal`, `CanTalkToPatches`
#@# Why do all of these function calls manage updates for themselves?  Why am I dreaming of an `@world.updater. monad?
define(['integration/lodash', 'engine/abstractagents', 'engine/builtins', 'engine/colormodel', 'engine/comparator'
      , 'engine/exception', 'engine/nobody', 'engine/penmanager', 'engine/turtleset', 'engine/trig'
      , 'engine/variablemanager']
     , ( _,                    AbstractAgents,          Builtins,          ColorModel,          Comparator
      ,  Exception,          Nobody,          PenManager,          TurtleSet,          Trig
      ,  VariableManager) ->

  class Turtle

    _breed:      undefined # Breed
    _links:      undefined # Array[Link]
    _varManager: undefined # VariableManager

    #@# Should guard against improperly-named breeds, including empty-string breed names
    constructor: (@world, @id, @color = 0, @heading = 0, @_xcor = 0, @_ycor = 0, breed = @world.breedManager.turtles(), @label = "", @labelcolor = 9.9, @hidden = false, @size = 1.0, @penManager = new PenManager(@world.updater.updated(this))) ->
      varNames     = @world.turtlesOwnNames.concat(breed.varNames)
      @_varManager = @_genVarManager(varNames)

      @_links = []
      @_setBreed(breed)

      @getPatchHere().arrive(this)

    # () => String
    getBreedName: ->
      @_breed.name

    xcor: -> @_xcor
    setXcor: (newX) ->
      originPatch = @getPatchHere()
      @_xcor = @world.topology().wrapX(newX)
      @world.updater.updated(this)("xcor")
      if originPatch isnt @getPatchHere()
        originPatch.leave(this)
        @getPatchHere().arrive(this)
      @refreshLinks()
    ycor: -> @_ycor
    setYcor: (newY) ->
      originPatch = @getPatchHere()
      @_ycor = @world.topology().wrapY(newY)
      @world.updater.updated(this)("ycor")
      if originPatch isnt @getPatchHere()
        originPatch.leave(this)
        @getPatchHere().arrive(this)
      @refreshLinks()
    toString: -> "(#{@_breed.singular} #{@id})"

    canMove: (distance) -> @patchAhead(distance) isnt Nobody
    distanceXY: (x, y) -> @world.topology().distanceXY(@xcor(), @ycor(), x, y)
    distance: (agent) -> @world.topology().distance(@xcor(), @ycor(), agent)
    towardsXY: (x, y) -> @world.topology().towards(@xcor(), @ycor(), x, y)
    getCoords: -> [@xcor(), @ycor()]
    towards: (agent) -> #@# Unify, man!
      [x, y] = agent.getCoords()
      @world.topology().towards(@xcor(), @ycor(), x, y)
    faceXY: (x, y) ->
      if x isnt @xcor() or y isnt @ycor()
        @_setHeading(@world.topology().towards(@xcor(), @ycor(), x, y))
    face: (agent) ->
      [x, y] = agent.getCoords()
      @faceXY(x, y)
    inRadius: (agents, radius) ->
      @world.topology().inRadius(this, @xcor(), @ycor(), agents, radius)
    patchAt: (dx, dy) -> #@# Make not silly
      try
        x = @world.topology().wrapX(@xcor() + dx)
        y = @world.topology().wrapY(@ycor() + dy)
        @world.getPatchAt(x, y)
      catch error
        if error instanceof Exception.TopologyInterrupt
          Nobody
        else
          throw error
    turtlesAt: (dx, dy) ->
      @getPatchHere().turtlesAt(dx, dy)
    connectedLinks: (isDirected, isSource) ->
      filterFunc =
        if isDirected #@# Conditional is unnecessary, really
          (link) => (link.directed and link.end1 is this and isSource) or (link.directed and link.end2 is this and not isSource)
        else
          (link) => (not link.directed and link.end1 is this) or (not link.directed and link.end2 is this)
      @world.links().filter(filterFunc)
    refreshLinks: ->
      if not _(@_links).isEmpty()
        linkTypes = [[true, true], [true, false], [false, false]]
        _(linkTypes).map(
          (typePair) =>
            [directed, isSource] = typePair
            @connectedLinks(directed, isSource).toArray()
        ).flatten().forEach(
          (link) -> link.updateEndRelatedVars(); return
        )
      return
    linkNeighbors: (isDirected, isSource) ->
      reductionFunc =
        if isDirected
          (acc, link) =>
            if link.directed and link.end1 is this and isSource
              acc.push(link.end2)
            else if link.directed and link.end2 is this and not isSource
              acc.push(link.end1)
            acc
        else
          (acc, link) =>
            if not link.directed and link.end1 is this
              acc.push(link.end2)
            else if not link.directed and link.end2 is this
              acc.push(link.end1)
            acc

      turtles = world.links().toArray().reduce(reductionFunc, [])
      new TurtleSet(turtles)

    isLinkNeighbor: (directed, isSource, other) -> #@# Other WHAT?
      @linkNeighbors(directed, isSource).filter((neighbor) -> neighbor is other).nonEmpty() #@# `_(derp).some(f)` (Lodash)
    findLinkViaNeighbor: (isDirected, isSource, other) -> #@# Other WHAT?
      findFunc =
        if isDirected
          (link) => (link.directed and link.end1 is this and link.end2 is other and isSource) or (link.directed and link.end1 is other and link.end2 is this and not isSource)
        else if not isDirected and not @world.unbreededLinksAreDirected
          (link) => (not link.directed and link.end1 is this and link.end2 is other) or (not link.directed and link.end2 is this and link.end1 is other)
        else
          throw new Exception.NetLogoException("LINKS is a directed breed.")

      link = @world.links().find(findFunc)

      if link?
        link
      else
        Nobody

    otherEnd: -> if this is @world.agentSet.myself().end1 then @world.agentSet.myself().end2 else @world.agentSet.myself().end1
    patchRightAndAhead: (angle, distance) ->
      heading = @heading + angle #@# Mutation is for bad people (FP)
      if not (0 <= heading < 360)
        heading = ((heading % 360) + 360) % 360
      try
        newX = @world.topology().wrapX(@xcor() + distance * Trig.sin(heading))
        newY = @world.topology().wrapY(@ycor() + distance * Trig.cos(heading))
        return @world.getPatchAt(newX, newY) #@# Unnecessary `return`
      catch error
        if error instanceof Exception.TopologyInterrupt then Nobody else throw error
    patchLeftAndAhead: (angle, distance) ->
      @patchRightAndAhead(-angle, distance)
    patchAhead: (distance) ->
      @patchRightAndAhead(0, distance)
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
    jump: (distance) ->
      if @canMove(distance)
        @setXcor(@xcor() + distance * Trig.sin(@heading))
        @setYcor(@ycor() + distance * Trig.cos(@heading))
        return true
      return false #@# Orly?
    dx: ->
      Trig.sin(@heading)
    dy: ->
      Trig.cos(@heading)
    right: (angle) ->
      newHeading = @heading + angle
      @_setHeading(@_normalizeHeading(newHeading))
      return
    setXY: (x, y) ->
      origXcor = @xcor()
      origYcor = @ycor()
      try
        @setXcor(x)
        @setYcor(y)
      catch error
        @setXcor(origXcor)
        @setYcor(origYcor)
        if error instanceof Exception.TopologyInterrupt
          throw new Exception.TopologyInterrupt("The point [ #{x} , #{y} ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.")
        else
          throw error
      return
    hideTurtle: (flag) -> #@# Varname
      @_setIsHidden(flag)
      return
    isBreed: (breedName) ->
      @_breed.name.toUpperCase() is breedName.toUpperCase()
    die: ->
      @_breed.remove(this)
      if @id isnt -1
        @world.removeTurtle(@id)
        @seppuku()
        @world.links().forEach((link) =>
          if link.end1.id is @id or link.end2.id is @id
            try
              link.die()
            catch error
              throw error if not (error instanceof Exception.DeathInterrupt)
          return
        )
        @id = -1
        @getPatchHere().leave(this)
      throw new Exception.DeathInterrupt("Call only from inside an askAgent block")

    # (String) => Any
    getVariable: (varName) ->
      @_varManager.get(varName)

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_varManager.set(varName, value)
      return

    # () => Patch
    getPatchHere: ->
      @world.getPatchAt(@xcor(), @ycor())

    # (String) => Any
    getPatchVariable: (varName) ->
      @getPatchHere().getVariable(varName)

    # (String, Any) => Unit
    setPatchVariable: (varName, value) ->
      @getPatchHere().setVariable(varName, value)
      return

    getNeighbors: -> @getPatchHere().getNeighbors()
    getNeighbors4: -> @getPatchHere().getNeighbors4()
    turtlesHere: -> @getPatchHere().turtlesHere()
    breedHere: (breedName) -> @getPatchHere().breedHere(breedName)
    hatch: (n, breedName) ->
      breed      = if breedName? and not _(breedName).isEmpty() then @world.breedManager.get(breedName) else @_breed #@# Why is this even a thing?
      newTurtles = _(0).range(n).map(=> @_makeTurtleCopy(breed)).value()
      new TurtleSet(newTurtles, breed)

    # () => Turtle
    _makeTurtleCopy: (breed) ->
      turtleGenFunc = (id) => new Turtle(@world, id, @color, @heading, @xcor(), @ycor(), breed, @label, @labelcolor, @hidden, @size, @penManager.clone()) #@# Sounds like we ought have some cloning system, of which this function is a first step
      turtle        = @world.createTurtle(turtleGenFunc)
      _(@world.turtlesOwnNames).forEach((varName) =>
        turtle.setVariable(varName, @getVariable(varName))
        return
      )
      turtle

    moveTo: (agent) ->
      [x, y] = agent.getCoords()
      @setXY(x, y)
    watchme: ->
      @world.observer.watch(this)

    _removeLink: (link) ->
      @_links.splice(@_links.indexOf(link)) #@# Surely there's a more-coherent way to write this

    compare: (x) ->
      if x instanceof Turtle
        Comparator.numericCompare(@id, x.id)
      else
        Comparator.NOT_EQUALS

    seppuku: ->
      @world.updater.update("turtles", @id, { WHO: -1 }) #@# If you're awful and you know it, clap your hands!

    # (Number) => Number
    _normalizeHeading: (heading) ->
      if (0 <= heading < 360)
        heading
      else
        ((heading % 360) + 360) % 360

    # Array[String] => VariableManager
    _genVarManager: (extraVarNames) ->

      varBundles = [
        { name: 'breed',       get: (=> @world.turtlesOfBreed(@_breed.name)), set: ((x) => @_setBreed(x))             },
        { name: 'color',       get: (=> @color),                              set: ((x) => @_setColor(x))             },
        { name: 'heading',     get: (=> @heading),                            set: ((x) => @_setHeading(x))           },
        { name: 'hidden?',     get: (=> @hidden),                             set: ((x) => @_setIsHidden(x))          },
        { name: 'label',       get: (=> @label),                              set: ((x) => @_setLabel(x))             },
        { name: 'label-color', get: (=> @labelcolor),                         set: ((x) => @_setLabelColor(x))        },
        { name: 'pen-mode',    get: (=> @penManager.getMode().toString()),    set: ((x) => @penManager.setPenMode(x)) },
        { name: 'pen-size',    get: (=> @penManager.getSize()),               set: ((x) => @penManager.setSize(x))    },
        { name: 'shape',       get: (=> @shape),                              set: ((x) => @_setShape(x))             },
        { name: 'size',        get: (=> @size),                               set: ((x) => @_setSize(x))              },
        { name: 'who',         get: (=> @id),                                 set: (->)                               },
        { name: 'xcor',        get: (=> @xcor()),                             set: ((x) => @setXcor(x))               },
        { name: 'ycor',        get: (=> @ycor()),                             set: ((x) => @setYcor(x))               }
      ]

      VariableManager.Companion.generate(extraVarNames, varBundles)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @world.updater.updated(this)(varName)
      return


    ###
     "Jason, this is craziness!", you say.  "Not quite," I say.  It _is_ kind of lame, but changing turtle members
     needs to be controlled, so that all changes cause updates to be triggered.  And since the `VariableManager` needs
     to know how to set all of the variables, we may as well declare the code for that in a place where it can be
     easily reused. --JAB (6/2/14)
    ###

    # (Breed) => Unit
    _setBreed: (breed) ->

      trueBreed =
        if _(breed).isString()
          @world.breedManager.get(breed)
        else if breed instanceof AbstractAgents
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

        @_varManager = @_varManager.refineBy(obsoletedNames)(freshNames)

      @_breed = trueBreed
      @_genVarUpdate("breed")

      @_setShape(trueBreed.getShape())

      if trueBreed isnt @world.breedManager.turtles()
        @world.breedManager.turtles().add(this)

      return


    # (Number) => Unit
    _setColor: (color) ->
      @color = ColorModel.wrapColor(color)
      @_genVarUpdate("color")
      return

    # (Number) => Unit
    _setHeading: (heading) ->
      @heading = @_normalizeHeading(heading)
      @_genVarUpdate("heading")
      return

    # (Boolean) => Unit
    _setIsHidden: (isHidden) ->
      @hidden = isHidden
      @_genVarUpdate("hidden?")
      return

    # (String) => Unit
    _setLabel: (label) ->
      @label = label
      @_genVarUpdate("label")
      return

    # (Number) => Unit
    _setLabelColor: (color) ->
      @labelcolor = ColorModel.wrapColor(color)
      @_genVarUpdate("label-color")
      return

    # (String) => Unit
    _setShape: (shape) ->
      @shape = shape.toLowerCase()
      @_genVarUpdate("shape")
      return

    # (Number) => Unit
    _setSize: (size) ->
      @size = size
      @_genVarUpdate("size")
      return

)
