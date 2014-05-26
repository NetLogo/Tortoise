#@# Extends: `Agent`, `Vassal`, `CanTalkToPatches`
define(['integration/lodash', 'engine/builtins', 'engine/colormodel', 'engine/comparator', 'engine/exception'
      , 'engine/nobody', 'engine/turtleset', 'engine/trig']
     , ( _,                    Builtins,          ColorModel,          Comparator,          Exception
      ,  Nobody,          TurtleSet,          Trig) ->

  class Turtle

    vars: undefined #@# You are the bane of your own existence

    _links: undefined
    _xcor:  undefined
    _ycor:  undefined

    #@# Should guard against improperly-named breeds, including empty-string breed names
    constructor: (@world, @id, @color = 0, @heading = 0, xcor = 0, ycor = 0, breed = @world.breedManager.turtles(), @label = "", @labelcolor = 9.9, @hidden = false, @size = 1.0, @pensize = 1.0, @penmode = "up") ->
      @_links = []
      @_xcor  = xcor
      @_ycor  = ycor

      @breedVars = {} #@# Can be outside the constructor
      @updateBreed(breed)

      @vars = _(@world.turtlesOwn.vars).cloneDeep() #@# Can be outside the constructor

      @getPatchHere().arrive(this)

    updateBreed: (breed) -> #@# This code is lunacy
      if @breed
        @breed.remove(this)
      @breed = breed
      breed.add(this)
      @shape = @breed.shape()
      if @breed isnt @world.breedManager.turtles()
        @world.breedManager.turtles().add(this)
        for x in @breed.vars
          if not @breedVars[x]?
            @breedVars[x] = 0
    xcor: -> @_xcor
    setXcor: (newX) ->
      originPatch = @getPatchHere()
      @_xcor = @world.topology().wrapX(newX)
      if originPatch isnt @getPatchHere()
        originPatch.leave(this)
        @getPatchHere().arrive(this)
      @refreshLinks()
    ycor: -> @_ycor
    setYcor: (newY) ->
      originPatch = @getPatchHere()
      @_ycor = @world.topology().wrapY(newY)
      if originPatch isnt @getPatchHere()
        originPatch.leave(this)
        @getPatchHere().arrive(this)
      @refreshLinks()
    setBreed: (breed) ->
      trueBreed =
        if _(breed).isString()
          @world.breedManager.get(breed)
        else
          breed
      @updateBreed(trueBreed)
      @world.updater.updated(this)("breed")
      @world.updater.updated(this)("shape")
    toString: -> "(#{@breed.singular} #{@id})"
    keepHeadingInRange: -> #@# Since this code is duplicated in `Turtle.patchRightAndAhead`, it should take a value and return a normalized one
      if not (0 <= @heading < 360)
        @heading = ((@heading % 360) + 360) % 360
      return
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
        @heading = @world.topology().towards(@xcor(), @ycor(), x, y)
        @world.updater.updated(this)("heading")
    face: (agent) ->
      [x, y] = agent.getCoords()
      @faceXY(x, y)
    inRadius: (agents, radius) ->
      @world.topology().inRadius(this, @xcor(), @ycor(), agents, radius)
    patchAt: (dx, dy) -> #@# Make not silly
      try
        world.getPatchAt(
          world.topology().wrapX(@xcor() + dx),
          world.topology().wrapY(@ycor() + dy))
      catch error
        if error instanceof Exception.TopologyInterrupt then Nobody else throw error
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
        @world.updater.updated(this)("xcor", "ycor")
        return true
      return false #@# Orly?
    dx: ->
      Trig.sin(@heading)
    dy: ->
      Trig.cos(@heading)
    right: (angle) ->
      @heading += angle
      @keepHeadingInRange()
      @world.updater.updated(this)("heading") #@# Why do all of these function calls manage updates for themselves?  Why am I dreaming of an `@world.updater. monad?
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
      @world.updater.updated(this)("xcor", "ycor")
      return
    hideTurtle: (flag) -> #@# Varname
      @hidden = flag
      @world.updater.updated(this)("hidden")
      return
    isBreed: (breedName) ->
      @breed.name.toUpperCase() is breedName.toUpperCase()
    die: ->
      @breed.remove(this)
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
    getTurtleVariable: (n) -> #@# Obviously, we're awful people and this can be improved
      if n < Builtins.turtleBuiltins.length
        if n is 3 #xcor
          @xcor()
        else if n is 4 #ycor
          @ycor()
        else if n is 8 #breed
          @world.turtlesOfBreed(@breed.name) #@# Seems weird that I should need to do this...?
        else
          this[Builtins.turtleBuiltins[n]]
      else
        @vars[n - Builtins.turtleBuiltins.length]
    setTurtleVariable: (n, value) -> #@# Here we go again!
      if n < Builtins.turtleBuiltins.length
        if n is 1 # color
          this[Builtins.turtleBuiltins[n]] = ColorModel.wrapColor(value)
        else if n is 3 #xcor
          @setXcor(value)
        else if n is 4 #ycor
          @setYcor(value)
        else
          if n is 5  # shape
            value = value.toLowerCase()
          this[Builtins.turtleBuiltins[n]] = value
          if n is 2  # heading
            @keepHeadingInRange()
        @world.updater.updated(this)(Builtins.turtleBuiltins[n])
      else
        @vars[n - Builtins.turtleBuiltins.length] = value
    getBreedVariable: (n) -> @breedVars[n]
    setBreedVariable: (n, value) -> @breedVars[n] = value
    getPatchHere: -> @world.getPatchAt(@xcor(), @ycor())
    getPatchVariable: (n)    -> @getPatchHere().getPatchVariable(n)
    setPatchVariable: (n, value) -> @getPatchHere().setPatchVariable(n, value)
    getNeighbors: -> @getPatchHere().getNeighbors()
    getNeighbors4: -> @getPatchHere().getNeighbors4()
    turtlesHere: -> @getPatchHere().turtlesHere()
    breedHere: (breedName) -> @getPatchHere().breedHere(breedName)
    hatch: (n, breedName) ->
      breed      = if breedName? and not _(breedName).isEmpty() then @world.breedManager.get(breedName) else @breed #@# Why is this even a thing?
      newTurtles = _(0).range(n).map(=> @_makeTurtleCopy(breed)).value()
      new TurtleSet(newTurtles, breed)

    # () => Turtle
    _makeTurtleCopy: (breed) ->
      turtleGenFunc = (id) => new Turtle(@world, id, @color, @heading, @xcor(), @ycor(), breed, @label, @labelcolor, @hidden, @size, @pensize, @penmode) #@# Sounds like we ought have some cloning system, of which this function is a first step
      turtle        = @world.createTurtle(turtleGenFunc)
      _(0).range(TurtlesOwn.vars.length).forEach((n) =>
        turtle.setTurtleVariable(Builtins.turtleBuiltins.length + n, @getTurtleVariable(Builtins.turtleBuiltins.length + n))
        return
      )
      turtle

    moveTo: (agent) ->
      [x, y] = agent.getCoords()
      @setXY(x, y)
    watchme: ->
      @world.observer.watch(this)

    penDown: -> #@# For shame!
      @penmode = "down"
      @world.updater.updated(this)("penmode")
      return
    penUp: ->
      @penmode = "up"
      @world.updater.updated(this)("penmode")
      return

    _removeLink: (link) ->
      @_links.splice(@_links.indexOf(link)) #@# Surely there's a more-coherent way to write this

    compare: (x) ->
      if x instanceof Turtle
        Comparator.numericCompare(@id, x.id)
      else
        Comparator.NOT_EQUALS

    seppuku: ->
      @world.updater.update("turtles", @id, { WHO: -1 }) #@# If you're awful and you know it, clap your hands!

)
