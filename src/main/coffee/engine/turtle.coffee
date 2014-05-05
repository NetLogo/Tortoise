#@# Extends: `Agent`, `Vassal`, `CanTalkToPatches`
define(['engine/agentkind', 'engine/agents', 'engine/builtins', 'engine/colormodel', 'engine/comparator'
      , 'engine/exception', 'engine/nobody', 'engine/trig', 'integration/lodash']
     , ( AgentKind,          Agents,          Builtins,          ColorModel,          Comparator
      ,  Exception,          Nobody,          Trig,          _) ->

  class Turtle
    vars: [] #@# You are the bane of your own existence
    _xcor: 0
    _ycor: 0
    _links: []
    #@# Should guard against improperly-named breeds, including empty-string breed names
    constructor: (@world, @color = 0, @heading = 0, xcor = 0, ycor = 0, breed = @world.breedManager.get("TURTLES"), @label = "", @labelcolor = 9.9, @hidden = false, @size = 1.0, @pensize = 1.0, @penmode = "up") ->
      @_xcor = xcor
      @_ycor = ycor
      @breedVars = {} #@# Can be outside the constructor
      @updateBreed(breed)
      @vars = _(@world.turtlesOwn.vars).cloneDeep() #@# Can be outside the constructor
      @getPatchHere().arrive(this)
    updateBreed: (breed) -> #@# This code is lunacy
      if @breed
        @breed.remove(@)
      @breed = breed
      breed.add(@)
      @shape = @breed.shape()
      if @breed isnt @world.breedManager.get("TURTLES")
        @world.breedManager.get("TURTLES").add(this)
        for x in @breed.vars
          if @breedVars[x] is undefined #@# Simplify
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
      @updateBreed(breed)
      @world.updater.updated(this, "breed")
      @world.updater.updated(this, "shape")
    toString: -> "(#{@breed.singular} #{@id})"
    keepHeadingInRange: -> #@# Since this code is duplicated in `Turtle.patchRightAndAhead`, it should take a value and return a normalized one
      if not (0 <= @heading < 360)
        @heading = ((@heading % 360) + 360) % 360
      return
    canMove: (amount) -> @patchAhead(amount) isnt Nobody
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
        @world.updater.updated(this, "heading")
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
    connectedLinks: (directed, isSource) ->
      me = this #@# Wath?
      if directed
        new Agents(@world.links().items.map((l) -> #@# Could this code be noisier?
          if (l.directed and l.end1 is me and isSource) or (l.directed and l.end2 is me and not isSource)
            l
          else
            null).filter((o) -> o isnt null), @world.breedManager.get("LINKS"), AgentKind.Link) #@# I bet this comparison is wrong somehow...
      else
        new Agents(@world.links().items.map((l) ->
          if (not l.directed and l.end1 is me) or (not l.directed and l.end2 is me)
            l
          else
            null).filter((o) -> o isnt null), @world.breedManager.get("LINKS"), AgentKind.Link)
    refreshLinks: ->
      if not _(@_links).isEmpty()
        linkTypes = [[true, true], [true, false], [false, false]]
        _(linkTypes).map(
          (t) =>
            [directed, isSource] = t
            @connectedLinks(directed, isSource).items
        ).flatten().forEach(
          (l) -> l.updateEndRelatedVars()
        )
      return
    linkNeighbors: (directed, isSource) ->
      me = this #@# WTF, stop!
      if directed
        new Agents(@world.links().items.map((l) -> #@# Noisy, noisy nonsense
          if l.directed and l.end1 is me and isSource
            l.end2
          else if l.directed and l.end2 is me and not isSource
            l.end1
          else
            null).filter((o) -> o isnt null), @world.breedManager.get("TURTLES"), AgentKind.Turtle)
      else
        new Agents(@world.links().items.map((l) ->
          if not l.directed and l.end1 is me
            l.end2
          else if not l.directed and l.end2 is me
            l.end1
          else
            null).filter((o) -> o isnt null), @world.breedManager.get("TURTLES"), AgentKind.Turtle)
    isLinkNeighbor: (directed, isSource, other) -> #@# Other WHAT?
      @linkNeighbors(directed, isSource).items.filter((o) -> o is other).length > 0 #@# `_(derp).some(f)` (Lodash)
    findLinkViaNeighbor: (directed, isSource, other) -> #@# Other WHAT?
      me = this #@# No.
      links = [] #@# Bad
      if directed
        links = @world.links().items.map((l) -> #@# Noisy
          if (l.directed and l.end1 is me and l.end2 is other and isSource) or (l.directed and l.end1 is other and l.end2 is me and not isSource)
            l
          else
            null).filter((o) -> o isnt null)
      else if @world.unbreededLinksAreDirected
        throw new Exception.NetLogoException("LINKS is a directed breed.")
      else
        links = @world.links().items.map((l) ->
          if (not l.directed and l.end1 is me and l.end2 is other) or (not l.directed and l.end2 is me and l.end1 is other)
            l
          else
            null).filter((o) -> o isnt null)
      if links.length is 0 then Nobody else links[0] #@# Code above is, thus, lame; `length is 0` is antipattern

    otherEnd: -> if this is @world.agentSet.myself().end1 then @world.agentSet.myself().end2 else @world.agentSet.myself().end1
    patchRightAndAhead: (angle, amount) ->
      heading = @heading + angle #@# Mutation is for bad people (FP)
      if not (0 <= heading < 360)
        heading = ((heading % 360) + 360) % 360
      try
        newX = @world.topology().wrapX(@xcor() + amount * Trig.sin(heading))
        newY = @world.topology().wrapY(@ycor() + amount * Trig.cos(heading))
        return @world.getPatchAt(newX, newY) #@# Unnecessary `return`
      catch error
        if error instanceof Exception.TopologyInterrupt then Nobody else throw error
    patchLeftAndAhead: (angle, amount) ->
      @patchRightAndAhead(-angle, amount)
    patchAhead: (amount) ->
      @patchRightAndAhead(0, amount)
    fd: (amount) ->
      if amount > 0
        while amount >= 1 and @jump(1) #@# Possible point of improvement
          amount -= 1
        @jump(amount)
      else if amount < 0
        while amount <= -1 and @jump(-1)
          amount += 1
        @jump(amount)
      return
    jump: (amount) ->
      if @canMove(amount)
        @setXcor(@xcor() + amount * Trig.sin(@heading))
        @setYcor(@ycor() + amount * Trig.cos(@heading))
        @world.updater.updated(this, "xcor", "ycor")
        return true
      return false #@# Orly?
    dx: ->
      Trig.sin(@heading)
    dy: ->
      Trig.cos(@heading)
    right: (amount) ->
      @heading += amount
      @keepHeadingInRange()
      @world.updater.updated(this, "heading") #@# Why do all of these function calls manage updates for themselves?  Why am I dreaming of an `@world.updater. monad?
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
      @world.updater.updated(this, "xcor", "ycor")
      return
    hideTurtle: (flag) -> #@# Varname
      @hidden = flag
      @world.updater.updated(this, "hidden")
      return
    isBreed: (breedName) ->
      @breed.name.toUpperCase() is breedName.toUpperCase()
    die: ->
      @breed.remove(@)
      if @id isnt -1
        @world.removeTurtle(@id)
        @seppuku()
        for l in @world.links().items
          if l.end1.id is @id or l.end2.id is @id
            try
              l.die()
            catch error
              throw error if not (error instanceof Exception.DeathInterrupt)
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
    setTurtleVariable: (n, v) -> #@# Here we go again!
      if n < Builtins.turtleBuiltins.length
        if n is 1 # color
          this[Builtins.turtleBuiltins[n]] = ColorModel.wrapColor(v)
        else if n is 3 #xcor
          @setXcor(v)
        else if n is 4 #ycor
          @setYcor(v)
        else
          if n is 5  # shape
            v = v.toLowerCase()
          this[Builtins.turtleBuiltins[n]] = v
          if n is 2  # heading
            @keepHeadingInRange()
        @world.updater.updated(this, Builtins.turtleBuiltins[n])
      else
        @vars[n - Builtins.turtleBuiltins.length] = v
    getBreedVariable: (n) -> @breedVars[n]
    setBreedVariable: (n, v) -> @breedVars[n] = v
    getPatchHere: -> @world.getPatchAt(@xcor(), @ycor())
    getPatchVariable: (n)    -> @getPatchHere().getPatchVariable(n)
    setPatchVariable: (n, v) -> @getPatchHere().setPatchVariable(n, v)
    getNeighbors: -> @getPatchHere().getNeighbors()
    getNeighbors4: -> @getPatchHere().getNeighbors4()
    turtlesHere: -> @getPatchHere().turtlesHere()
    breedHere: (breedName) -> @getPatchHere().breedHere(breedName)
    hatch: (n, breedName) ->
      breed      = if breedName then @world.breedManager.get(breedName) else @breed #@# Existential check?  Why is this even a thing?
      newTurtles = _(0).range(n).map(=> @_makeTurtleCopy(breed)).value()
      new Agents(newTurtles, breed, AgentKind.Turtle)

    # () => Turtle
    _makeTurtleCopy: (breed) =>
      t = new Turtle(@world, @color, @heading, @xcor(), @ycor(), breed, @label, @labelcolor, @hidden, @size, @pensize, @penmode) #@# Sounds like we ought have some cloning system, of which this function is a first step
      _(0).range(TurtlesOwn.vars.length).forEach((v) =>
        t.setTurtleVariable(Builtins.turtleBuiltins.length + v, @getTurtleVariable(Builtins.turtleBuiltins.length + v))
        return
      )
      @world.createTurtle(t)

    moveTo: (agent) ->
      [x, y] = agent.getCoords()
      @setXY(x, y)
    watchme: ->
      @world.watch(this)

    penDown: -> #@# For shame!
      @penmode = "down"
      @world.updater.updated(this, "penmode")
      return
    penUp: ->
      @penmode = "up"
      @world.updater.updated(this, "penmode")
      return

    _removeLink: (l) ->
      @_links.splice(@_links.indexOf(l)) #@# Surely there's a more-coherent way to write this

    compare: (x) ->
      if x instanceof Turtle
        Comparator.numericCompare(@id, x.id)
      else
        Comparator.NOT_EQUALS

    seppuku: ->
      @world.updater.update("turtles", @id, { WHO: -1 }) #@# If you're awful and you know it, clap your hands!

)
