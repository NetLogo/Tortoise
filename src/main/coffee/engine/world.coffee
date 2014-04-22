define(['integration/random', 'integration/strictmath', 'engine/agentkind', 'engine/agents', 'engine/builtins'
      , 'engine/exception', 'engine/link', 'engine/nobody', 'engine/patch', 'engine/turtle', 'engine/worldlinks'
      , 'engine/topology/box', 'engine/topology/horizcylinder', 'engine/topology/torus'
      , 'engine/topology/vertcylinder']
     , ( Random,               StrictMath,               AgentKind,          Agents,          Builtins
      ,  Exception,          Link,          Nobody,          Patch,          Turtle,          WorldLinks
      ,  Box,                   HorizCylinder,                   Torus
      ,  VertCylinder) ->

  class World

    # any variables used in the constructor should come
    # before the constructor, else they get overwritten after it.
    _nextLinkId: 0
    _nextTurtleId: 0
    _turtles: []
    _turtlesById: {}
    _patches: []
    _links: new WorldLinks()
    _topology: null
    _ticks: -1
    _timer: Date.now()
    _patchesAllBlack: true
    _patchesWithLabels: 0

    #@# I'm aware that some of this stuff ought to not live on `World`
    constructor: (@globals, @patchesOwn, @turtlesOwn, @linksOwn, @agentSet, @updater, @breedManager, @minPxcor, @maxPxcor
                , @minPycor, @maxPycor, @patchSize, @wrappingAllowedInX, @wrappingAllowedInY, turtleShapeList
                , linkShapeList, @interfaceGlobalCount) ->
      @breedManager.reset()
      @agentSet.reset()
      @perspective = 0 #@# Out of constructor
      @targetAgent = null #@# Out of constructor
      @updater.collectUpdates()
      @updater.push(
        {
          world: {
            0: {
              worldWidth: Math.abs(@minPxcor - @maxPxcor) + 1,
              worldHeight: Math.abs(@minPycor - @maxPycor) + 1,
              minPxcor: @minPxcor,
              minPycor: @minPycor,
              maxPxcor: @maxPxcor,
              maxPycor: @maxPycor,
              linkBreeds: "XXX IMPLEMENT ME",
              linkShapeList: linkShapeList,
              patchSize: @patchSize,
              patchesAllBlack: @_patchesAllBlack,
              patchesWithLabels: @_patchesWithLabels,
              ticks: @_ticks,
              turtleBreeds: "XXX IMPLEMENT ME",
              turtleShapeList: turtleShapeList,
              unbreededLinksAreDirected: false
              wrappingAllowedInX: @wrappingAllowedInX,
              wrappingAllowedInY: @wrappingAllowedInY
            }
          }
        })
      @updatePerspective()
      @resize(@minPxcor, @maxPxcor, @minPycor, @maxPycor)
    createPatches: ->
      nested =
        for y in [@maxPycor..@minPycor] #@# Just build the damn matrix
          for x in [@minPxcor..@maxPxcor]
            new Patch((@width() * (@maxPycor - y)) + x - @minPxcor, x, y, this)
      # http://stackoverflow.com/questions/4631525/concatenating-an-array-of-arrays-in-coffeescript
      @_patches = [].concat nested... #@# I don't know what this mean, nor what that comment above is, so it's automatically awful
      for p in @_patches
        @updater.updated(p, "pxcor", "pycor", "pcolor", "plabel", "plabelcolor")
    topology: -> @_topology
    links: () ->
      new Agents(@_links.toArray(), @breedManager.get("LINKS"), AgentKind.Link) #@# How about we just provide `LinkSet`, `PatchSet`, and `TurtleSet` as shorthand with intelligent defaults?
    turtles: () -> new Agents(@_turtles, @breedManager.get("TURTLES"), AgentKind.Turtle)
    turtlesOfBreed: (breedName) ->
      breed = @breedManager.get(breedName)
      new Agents(breed.members, breed, AgentKind.Turtle)
    patches: => new Agents(@_patches, @breedManager.get("PATCHES"), AgentKind.Patch)
    resetTimer: ->
      @_timer = Date.now()
    resetTicks: ->
      @_ticks = 0
      @updater.push( world: { 0: { ticks: @_ticks } } ) #@# The fact that `@updater.push` is ever done manually seems fundamentally wrong to me
    clearTicks: ->
      @_ticks = -1
      @updater.push( world: { 0: { ticks: @_ticks } } )
    resize: (minPxcor, maxPxcor, minPycor, maxPycor) ->

      if(minPxcor > 0 || maxPxcor < 0 || minPycor > 0 || maxPycor < 0)
        throw new Exception.NetLogoException("You must include the point (0, 0) in the world.")

      # For some reason, JVM NetLogo doesn't restart `who` ordering after `resize-world`; even the test for this is existentially confused. --JAB (4/3/14)
      oldNextTId = @_nextTurtleId
      @clearTurtles()
      @_nextTurtleId = oldNextTId

      @minPxcor = minPxcor
      @maxPxcor = maxPxcor
      @minPycor = minPycor
      @maxPycor = maxPycor
      if(@wrappingAllowedInX && @wrappingAllowedInY) #@# `Topology.Companion` should know how to generate a topology from these values; what does `World` care?
        @_topology = new Torus(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt) #@# FP a-go-go
      else if(@wrappingAllowedInX)
        @_topology = new VertCylinder(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
      else if(@wrappingAllowedInY)
        @_topology = new HorzCylinder(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
      else
        @_topology = new Box(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
      @createPatches()
      @patchesAllBlack(true)
      @patchesWithLabels(0)
      @updater.push(
        world: {
          0: {
            worldWidth: Math.abs(@minPxcor - @maxPxcor) + 1,
            worldHeight: Math.abs(@minPycor - @maxPycor) + 1,
            minPxcor: @minPxcor,
            minPycor: @minPycor,
            maxPxcor: @maxPxcor,
            maxPycor: @maxPycor
          }
        }
      )
      return

    tick: ->
      if(@_ticks == -1)
        throw new Exception.NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.") #@# Bad men x4
      @_ticks++
      @updater.push( world: { 0: { ticks: @_ticks } } )
    tickAdvance: (n) ->
      if(@_ticks == -1)
        throw new Exception.NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.")
      if(n < 0)
        throw new Exception.NetLogoException("Cannot advance the tick counter by a negative amount.")
      @_ticks += n
      @updater.push( world: { 0: { ticks: @_ticks } } )
    timer: ->
      (Date.now() - @_timer) / 1000
    ticks: ->
      if(@_ticks == -1)
        throw new Exception.NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.")
      @_ticks
    # TODO: this needs to support all topologies
    width: () -> 1 + @maxPxcor - @minPxcor #@# Defer to topology x2
    height: () -> 1 + @maxPycor - @minPycor
    getPatchAt: (x, y) =>
      trueX  = (x - @minPxcor) % @width()  + @minPxcor # Handle negative coordinates and wrapping
      trueY  = (y - @minPycor) % @height() + @minPycor
      index  = (@maxPycor - StrictMath.round(trueY)) * @width() + (StrictMath.round(trueX) - @minPxcor)
      @_patches[index]
    getTurtle: (id) -> @_turtlesById[id] or Nobody
    getTurtleOfBreed: (breedName, id) ->
      turtle = @getTurtle(id)
      if turtle.breed.name.toUpperCase() == breedName.toUpperCase() then turtle else Nobody
    removeLink: (id) ->
      link = @_links.find((l) -> l.id is id)
      @_links = @_links.remove(link)
      if @_links.isEmpty()
        @unbreededLinksAreDirected = false
        @updater.push({ world: { 0: { unbreededLinksAreDirected: false } } })
      return
    removeTurtle: (id) -> #@# Having two different collections of turtles to manage seems avoidable
      turtle = @_turtlesById[id]
      @_turtles.splice(@_turtles.indexOf(turtle), 1)
      delete @_turtlesById[id]
    patchesAllBlack: (val) -> #@# Varname
      @_patchesAllBlack = val
      @updater.push( world: { 0: { patchesAllBlack: @_patchesAllBlack }})
    patchesWithLabels: (val) ->
      @_patchesWithLabels = val
      @updater.push( world: { 0: { patchesWithLabels: @_patchesWithLabels }})
    clearAll: ->
      @globals.clear(@interfaceGlobalCount)
      @clearTurtles()
      @createPatches()
      @_nextLinkId = 0
      @patchesAllBlack(true)
      @patchesWithLabels(0)
      @clearTicks()
      return
    clearTurtles: ->
      # We iterate through a copy of the array since it will be modified during
      # iteration.
      # A more efficient (but less readable) way of doing this is to iterate
      # backwards through the array.
      #@# I don't know what this is blathering about, but if it needs this comment, it can probably be written better
      for t in @turtles().items[..]
        try
          t.die()
        catch error
          throw error if !(error instanceof Exception.DeathInterrupt)
      @_nextTurtleId = 0
      return
    clearPatches: ->
      for p in @patches().items #@# Oh, yeah?
        p.setPatchVariable(2, 0)   # 2 = pcolor
        p.setPatchVariable(3, "")    # 3 = plabel
        p.setPatchVariable(4, 9.9)   # 4 = plabel-color
        for i in [Builtins.patchBuiltins.size...p.vars.length]
          p.setPatchVariable(i, 0)
      @patchesAllBlack(true)
      @patchesWithLabels(0)
      return
    createTurtle: (t) ->
      t.id = @_nextTurtleId++ #@# Why are we managing IDs at this level of the code?
      @updater.updated(t, Builtins.turtleBuiltins...)
      @_turtles.push(t)
      @_turtlesById[t.id] = t
      t
    ###
    #@# We shouldn't be looking up links in the tree everytime we create a link; JVM NL uses 2 `LinkedHashMap[Turtle, Buffer[Link]]`s (to, from) --JAB (2/7/14)
    #@# The return of `Nobody` followed by clients `filter`ing against it screams "flatMap!" --JAB (2/7/14)
    ###
    createLink: (directed, from, to) ->
      if(from.id < to.id or directed) #@# FP FTW
        end1 = from
        end2 = to
      else
        end1 = to
        end2 = from
      if Nobody == @getLink(end1.id, end2.id)
        l = new Link.Class(@_nextLinkId++, directed, end1, end2, this) #@# Managing IDs for yourself!
        @updater.updated(l, Builtins.linkBuiltins...)
        @updater.updated(l, Builtins.linkExtras...)
        @updater.updated(l, Builtins.turtleBuiltins.slice(1)...) #@# See, this update nonsense is awful
        @_links.insert(l)
        l
      else
        Nobody
    createOrderedTurtles: (n, breedName) -> #@# Clarity is a good thing
      newTurtles = [] #@# Anger, FP
      if n > 0
        for num in [0...n]
          newTurtles.push(@createTurtle(new Turtle((10 * num + 5) % 140, (360 * num) / n, 0, 0, @breedManager.get(breedName))))
      new Agents(newTurtles, @breedManager.get(breedName), AgentKind.Turtle)
    createTurtles: (n, breedName) -> #@# Clarity is still good
      newTurtles = [] #@# Bad, FP
      if n > 0
        for num in [0...n]
          newTurtles.push(@createTurtle(new Turtle(5 + 10 * Random.nextInt(14), Random.nextInt(360), 0, 0, @breedManager.get(breedName))))
      new Agents(newTurtles, @breedManager.get(breedName), AgentKind.Turtle)
    getNeighbors: (pxcor, pycor) -> @topology().getNeighbors(pxcor, pycor)
    getNeighbors4: (pxcor, pycor) -> @topology().getNeighbors4(pxcor, pycor)
    createDirectedLink: (from, to) ->
      @unbreededLinksAreDirected = true
      @updater.push({ world: { 0: { unbreededLinksAreDirected: true } } })
      @createLink(true, from, to)
    createDirectedLinks: (source, others) -> #@# Clarity
      @unbreededLinksAreDirected = true
      @updater.push({ world: { 0: { unbreededLinksAreDirected: true } } })
      new Agents((@createLink(true, source, t) for t in others.items).filter((o) -> o != Nobody), @breedManager.get("LINKS"), AgentKind.Link)
    createReverseDirectedLinks: (source, others) -> #@# Clarity
      @unbreededLinksAreDirected = true
      @updater.push({ world: { 0: { unbreededLinksAreDirected: true } } })
      new Agents((@createLink(true, t, source) for t in others.items).filter((o) -> o != Nobody), @breedManager.get("LINKS"), AgentKind.Link)
    createUndirectedLink: (source, other) ->
      @createLink(false, source, other)
    createUndirectedLinks: (source, others) -> #@# Clarity
      new Agents((@createLink(false, source, t) for t in others.items).filter((o) -> o != Nobody), @breedManager.get("LINKS"), AgentKind.Link)
    getLink: (fromId, toId) ->
      link = @_links.find((l) -> l.end1.id is fromId and l.end2.id is toId)
      if link?
        link
      else
        Nobody
    updatePerspective: ->
      @updater.push({ observer: { 0: { perspective: @perspective, targetAgent: @targetAgent } } })
    watch: (agent) ->
      @perspective = 3
      agentKind = 0
      agentId = -1
      if(agent instanceof Turtle)
        agentKind = 1
        agentId = agent.id
      else if(agent instanceof Patch)
        agentKind = 2
        agentId = agent.id
      @targetAgent = [agentKind, agentId]
      @updatePerspective()
    resetPerspective: ->
      @perspective = 0
      @targetAgent = null
      @updatePerspective()

)
