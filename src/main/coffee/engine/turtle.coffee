#@# Extends: `Agent`, `Vassal`, `CanTalkToPatches`
define(['engine/agentkind', 'engine/agents', 'engine/builtins', 'engine/colormodel', 'engine/comparator'
      , 'engine/exception', 'engine/nobody', 'engine/patch', 'engine/trig']
     , ( AgentKind,          Agents,          Builtins,          ColorModel,          Comparator
      ,  Exception,          Nobody,          Patch,          Trig) ->

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
      @vars = (x for x in @world.turtlesOwn.vars) #@# Can be outside the constructor
      @getPatchHere().arrive(this)
    updateBreed: (breed) -> #@# This code is lunacy
      if @breed
        @breed.remove(@)
      @breed = breed
      breed.add(@)
      @shape = @breed.shape()
      if(@breed != @world.breedManager.get("TURTLES"))
        @world.breedManager.get("TURTLES").add(this)
        for x in @breed.vars
          if(@breedVars[x] == undefined) #@# Simplify
            @breedVars[x] = 0
    xcor: -> @_xcor
    setXcor: (newX) ->
      originPatch = @getPatchHere()
      @_xcor = @world.topology().wrapX(newX)
      if originPatch != @getPatchHere()
        originPatch.leave(this)
        @getPatchHere().arrive(this)
      @refreshLinks()
    ycor: -> @_ycor
    setYcor: (newY) ->
      originPatch = @getPatchHere()
      @_ycor = @world.topology().wrapY(newY)
      if originPatch != @getPatchHere()
        originPatch.leave(this)
        @getPatchHere().arrive(this)
      @refreshLinks()
    setBreed: (breed) ->
      @updateBreed(breed)
      @world.updater.updated(this, "breed")
      @world.updater.updated(this, "shape")
    toString: -> "(" + @breed.singular + " " + @id + ")" #@# Interpolate
    keepHeadingInRange: ->
      if (@heading < 0 || @heading >= 360) #@# Rewrite comparison with fun comparator syntax
        @heading = ((@heading % 360) + 360) % 360
      return
    canMove: (amount) -> @patchAhead(amount) != Nobody
    distanceXY: (x, y) -> @world.topology().distanceXY(@xcor(), @ycor(), x, y)
    distance: (agent) -> @world.topology().distance(@xcor(), @ycor(), agent)
    towardsXY: (x, y) -> @world.topology().towards(@xcor(), @ycor(), x, y)
    towards: (agent) -> #@# Unify, man!
      if(agent instanceof Turtle)
        @world.topology().towards(@xcor(), @ycor(), agent.xcor(), agent.ycor())
      else if (agent instanceof Patch)
        @world.topology().towards(@xcor(), @ycor(), agent.pxcor, agent.pycor)
    faceXY: (x, y) ->
      if(x != @xcor() or y != @ycor())
        @heading = @world.topology().towards(@xcor(), @ycor(), x, y)
        @world.updater.updated(this, "heading")
    face: (agent) ->
      if(agent instanceof Turtle)
        @faceXY(agent.xcor(), agent.ycor())
      else if (agent instanceof Patch)
        @faceXY(agent.pxcor, agent.pycor)
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
          if (l.directed and l.end1 == me and isSource) or (l.directed and l.end2 == me and !isSource)
            l
          else
            null).filter((o) -> o != null), @world.breedManager.get("LINKS"), AgentKind.Link) #@# I bet this comparison is wrong somehow...
      else
        new Agents(@world.links().items.map((l) ->
          if (!l.directed and l.end1 == me) or (!l.directed and l.end2 == me)
            l
          else
            null).filter((o) -> o != null), @world.breedManager.get("LINKS"), AgentKind.Link)
    refreshLinks: ->
      if @_links.length > 0
        l.updateEndRelatedVars() for l in (@connectedLinks(true, true).items) #@# Srsly?
        l.updateEndRelatedVars() for l in (@connectedLinks(true, false).items)
        l.updateEndRelatedVars() for l in (@connectedLinks(false, false).items)
    linkNeighbors: (directed, isSource) ->
      me = this #@# WTF, stop!
      if directed
        new Agents(@world.links().items.map((l) -> #@# Noisy, noisy nonsense
          if l.directed and l.end1 == me and isSource
            l.end2
          else if l.directed and l.end2 == me and !isSource
            l.end1
          else
            null).filter((o) -> o != null), @world.breedManager.get("TURTLES"), AgentKind.Turtle)
      else
        new Agents(@world.links().items.map((l) ->
          if !l.directed and l.end1 == me
            l.end2
          else if !l.directed and l.end2 == me
            l.end1
          else
            null).filter((o) -> o != null), @world.breedManager.get("TURTLES"), AgentKind.Turtle)
    isLinkNeighbor: (directed, isSource, other) -> #@# Other WHAT?
      @linkNeighbors(directed, isSource).items.filter((o) -> o == other).length > 0 #@# `_(derp).some(f)`
    findLinkViaNeighbor: (directed, isSource, other) -> #@# Other WHAT?
      me = this #@# No.
      links = [] #@# Bad
      if directed
        links = @world.links().items.map((l) -> #@# Noisy
          if ((l.directed and l.end1 == me and l.end2 == other and isSource) or (l.directed and l.end1 == other and l.end2 == me and !isSource))
            l
          else
            null).filter((o) -> o != null)
      else
        throw new Exception.NetLogoException("LINKS is a directed breed.") if @world.unbreededLinksAreDirected
        links = @world.links().items.map((l) ->
          if ((!l.directed and l.end1 == me and l.end2 == other) or (!l.directed and l.end2 == me and l.end1 == other))
            l
          else
            null).filter((o) -> o != null)
      if links.length == 0 then Nobody else links[0] #@# Code above is, thus, lame

    otherEnd: -> if this == @world.agentSet.myself().end1 then @world.agentSet.myself().end2 else @world.agentSet.myself().end1
    patchRightAndAhead: (angle, amount) ->
      heading = @heading + angle #@# Mutation is for bad people
      if (heading < 0 || heading >= 360) #@# Use cool comparator style
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
      @breed.name.toUpperCase() == breedName.toUpperCase()
    die: ->
      @breed.remove(@)
      if (@id != -1)
        @world.removeTurtle(@id)
        @seppuku()
        for l in @world.links().items
          try
            l.die() if (l.end1.id == @id or l.end2.id == @id)
          catch error
            throw error if !(error instanceof Exception.DeathInterrupt)
        @id = -1
        @getPatchHere().leave(this)
      throw new Exception.DeathInterrupt("Call only from inside an askAgent block")
    getTurtleVariable: (n) -> #@# Obviously, we're awful people and this can be improved
      if (n < Builtins.turtleBuiltins.length)
        if(n == 3) #xcor
          @xcor()
        else if(n == 4) #ycor
          @ycor()
        else if(n == 8) #breed
          @world.turtlesOfBreed(@breed.name) #@# Seems weird that I should need to do this...?
        else
          this[Builtins.turtleBuiltins[n]]
      else
        @vars[n - Builtins.turtleBuiltins.length]
    setTurtleVariable: (n, v) -> #@# Here we go again!
      if (n < Builtins.turtleBuiltins.length)
        if n is 1 # color
          this[Builtins.turtleBuiltins[n]] = ColorModel.wrapColor(v)
        else if(n == 3) #xcor
          @setXcor(v)
        else if(n == 4) #ycor
          @setYcor(v)
        else
          if (n == 5)  # shape
            v = v.toLowerCase()
          this[Builtins.turtleBuiltins[n]] = v
          if (n == 2)  # heading
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
      breed = if breedName then @world.breedManager.get(breedName) else @breed #@# Existential check?
      newTurtles = [] #@# Functional style or GTFO
      if n > 0
        for num in [0...n] #@# Nice unused variable; Lodash it!
          t = new Turtle(@world, @color, @heading, @xcor(), @ycor(), breed, @label, @labelcolor, @hidden, @size, @pensize, @penmode) #@# Sounds like we ought have some cloning system
          for v in [0..TurtlesOwn.vars.length]
            t.setTurtleVariable(Builtins.turtleBuiltins.length + v, @getTurtleVariable(Builtins.turtleBuiltins.length + v))
          newTurtles.push(@world.createTurtle(t))
        new Agents(newTurtles, breed, AgentKind.Turtle)
    moveTo: (agent) ->
      if (agent instanceof Turtle) #@# Checks for `Turtle`ism or `Patch`ism (etc.) should be on some `Agent` object
        @setXY(agent.xcor(), agent.ycor())
      else if(agent instanceof Patch)
        @setXY(agent.pxcor, agent.pycor)
    watchme: ->
      @world.watch(this) #@# Nice try; use `@`

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
