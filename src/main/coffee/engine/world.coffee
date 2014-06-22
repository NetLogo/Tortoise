# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['integration/random', 'integration/strictmath', 'engine/builtins', 'engine/exception', 'engine/idmanager'
      , 'engine/link', 'engine/linkset', 'engine/nobody', 'engine/observer', 'engine/patch', 'engine/patchset'
      , 'engine/ticker', 'engine/turtle', 'engine/turtleset', 'engine/worldlinks', 'engine/topology/box'
      , 'engine/topology/horizcylinder', 'engine/topology/torus', 'engine/topology/vertcylinder', 'integration/lodash']
     , ( Random,               StrictMath,               Builtins,          Exception,          IDManager
      ,  Link,          LinkSet,          Nobody,          Observer,          Patch,          PatchSet
      ,  Ticker,          Turtle,          TurtleSet,          WorldLinks,          Box
      ,  HorizCylinder,                   Torus,                   VertCylinder,                   _) ->

  class World

    id: 0 # Number

    observer: undefined # Observer
    ticker:   undefined # Ticker

    _links:             undefined # WorldLinks
    _linkIDManager:     undefined # IDManager
    _turtleIDManager:   undefined # IDManager
    _patches:           undefined # Array[Patch]
    _patchesAllBlack:   undefined # Boolean
    _patchesWithLabels: undefined # Number
    _topology:          undefined # Topology
    _turtles:           undefined # Array[Turtle]
    _turtlesById:       undefined # Object[Number, Turtle]

    #@# I'm aware that some of this stuff ought to not live on `World`
    # (SelfManager, Updater, BreedManager, Array[String], Array[String], Array[String], Array[String], Array[String], Number, Number, Number, Number, Number, Boolean, Boolean, Array[Object], Array[Object]) => World
    constructor: (@selfManager, @updater, @breedManager, globalNames, interfaceGlobalNames, @turtlesOwnNames
                , @linksOwnNames, @patchesOwnNames, @minPxcor, @maxPxcor, @minPycor, @maxPycor, @patchSize
                , @wrappingAllowedInX, @wrappingAllowedInY, turtleShapeList, linkShapeList) ->
      @updater.collectUpdates()
      @updater.update("world", 0, {
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
        ticks: -1,
        turtleBreeds: "XXX IMPLEMENT ME",
        turtleShapeList: turtleShapeList,
        unbreededLinksAreDirected: false
        wrappingAllowedInX: @wrappingAllowedInX,
        wrappingAllowedInY: @wrappingAllowedInY
      })

      @observer = new Observer(updater, globalNames, interfaceGlobalNames)
      @ticker   = new Ticker(updater.updated(this))

      @_links           = new WorldLinks(@linkCompare)
      @_linkIDManager   = new IDManager #@# The fact that `World` even talks to ID managers (rather than a container for the type of agent) seems undesirable to me
      @_turtleIDManager = new IDManager
      @_patches         = []
      @_patchesAllBlack = true
      @_topology        = null
      @_turtles         = []
      @_turtlesById     = {}

      @resize(@minPxcor, @maxPxcor, @minPycor, @maxPycor)


    # () => Unit
    createPatches: ->
      nested =
        for y in [@maxPycor..@minPycor]
          for x in [@minPxcor..@maxPxcor]
            id = (@width() * (@maxPycor - y)) + x - @minPxcor
            new Patch(id, x, y, this)

      @_patches = [].concat(nested...)

      for patch in @_patches
        @updater.updated(patch)("pxcor", "pycor", "pcolor", "plabel", "plabel-color")

      return


    # () => Topology
    topology: ->
      @_topology

    # () => LinkSet
    links: () ->
      new LinkSet(@_links.toArray())

    # () => TurtleSet
    turtles: () ->
      new TurtleSet(@_turtles)

    # (String) => TurtleSet
    turtlesOfBreed: (breedName) ->
      breed = @breedManager.get(breedName)
      new TurtleSet(breed.members, breedName)

    # (String) => LinkSet
    linksOfBreed: (breedName) ->
      breed = @breedManager.get(breedName)
      new LinkSet(breed.members, breedName)

    # () => PatchSet
    patches: =>
      new PatchSet(@_patches)

    # (Number, Number, Number, Number) => Unit
    resize: (minPxcor, maxPxcor, minPycor, maxPycor) ->

      if not (minPxcor <= 0 <= maxPxcor and minPycor <= 0 <= maxPycor)
        throw new Exception.NetLogoException("You must include the point (0, 0) in the world.")

      # For some reason, JVM NetLogo doesn't restart `who` ordering after `resize-world`; even the test for this is existentially confused. --JAB (4/3/14)
      @_turtleIDManager.suspendDuring(() => @clearTurtles())

      @minPxcor = minPxcor
      @maxPxcor = maxPxcor
      @minPycor = minPycor
      @maxPycor = maxPycor

      @_topology =
        if @wrappingAllowedInX and @wrappingAllowedInY #@# `Topology.Companion` should know how to generate a topology from these values; what does `World` care?
          new Torus(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
        else if @wrappingAllowedInX
          new VertCylinder(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
        else if @wrappingAllowedInY
          new HorizCylinder(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
        else
          new Box(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)

      @createPatches()
      @patchesAllBlack(true)
      @resetPatchLabelCount()
      @updater.updated(this)("width", "height", "minPxcor", "minPycor", "maxPxcor", "maxPycor")

      return


    # () => Number
    width: ->
      1 + @maxPxcor - @minPxcor #@# Defer to topology x2

    # () => Number
    height: ->
      1 + @maxPycor - @minPycor

    # (Number, Number) => Patch
    getPatchAt: (x, y) =>
      trueX  = (x - @minPxcor) % @width()  + @minPxcor # Handle negative coordinates and wrapping
      trueY  = (y - @minPycor) % @height() + @minPycor
      index  = (@maxPycor - StrictMath.round(trueY)) * @width() + (StrictMath.round(trueX) - @minPxcor)
      @_patches[index]

    # (Number) => Turtle
    getTurtle: (id) ->
      @_turtlesById[id] or Nobody

    # (String, Number) => Turtle
    getTurtleOfBreed: (breedName, id) ->
      turtle = @getTurtle(id)
      if turtle.getBreedName().toUpperCase() is breedName.toUpperCase()
        turtle
      else
        Nobody

    # (Number) => Unit
    removeLink: (id) ->
      link = @_links.find((link) -> link.id is id)
      @_links = @_links.remove(link)
      if @_links.isEmpty()
        @unbreededLinksAreDirected = false
        @updater.updated(this)("unbreededLinksAreDirected")
      return

    # (Number) => Unit
    removeTurtle: (id) -> #@# Having two different collections of turtles to manage seems avoidable
      turtle = @_turtlesById[id]
      @_turtles.splice(@_turtles.indexOf(turtle), 1)
      delete @_turtlesById[id]
      return

    # (Boolean) => Unit
    patchesAllBlack: (val) -> #@# Varname
      @_patchesAllBlack = val
      @updater.updated(this)("patchesAllBlack")
      return

    # () => Unit
    incrementPatchLabelCount: ->
      @_setPatchLabelCount((count) -> count + 1)
      return

    # () => Unit
    decrementPatchLabelCount: ->
      @_setPatchLabelCount((count) -> count - 1)
      return

    # () => Unit
    resetPatchLabelCount: ->
      @_setPatchLabelCount(-> 0)
      return

    # ((Number) => Number) => Unit
    _setPatchLabelCount: (updateCountFunc) ->
      @_patchesWithLabels = updateCountFunc(@_patchesWithLabels)
      @updater.updated(this)("patchesWithLabels")
      return

    # () => Unit
    clearAll: ->
      @observer.clearCodeGlobals()
      @clearTurtles()
      @createPatches()
      @_linkIDManager.reset()
      @patchesAllBlack(true)
      @resetPatchLabelCount()
      @ticker.clear()
      return

    # () => Unit
    clearTurtles: ->
      # We iterate through a copy of the array since it will be modified during
      # iteration.
      # A more efficient (but less readable) way of doing this is to iterate
      # backwards through the array.
      #@# I don't know what this is blathering about, but if it needs this comment, it can probably be written better
      @turtles().forEach((turtle) ->
        try
          turtle.die()
        catch error
          throw error if not (error instanceof Exception.DeathInterrupt)
        return
      )
      @_turtleIDManager.reset()
      return

    # () => Unit
    clearPatches: ->
      @patches().forEach((patch) -> patch.reset(); return)
      @patchesAllBlack(true)
      @resetPatchLabelCount()
      return

    # ((Number) => Turtle) => Turtle
    createTurtle: (turtleGenFunc) ->
      id     = @_turtleIDManager.next()
      turtle = turtleGenFunc(id)
      @updater.updated(turtle)(Builtins.turtleBuiltins...)
      @_turtles.push(turtle)
      @_turtlesById[id] = turtle
      turtle

    ###
    #@# We shouldn't be looking up links in the tree everytime we create a link; JVM NL uses 2 `LinkedHashMap[Turtle, Buffer[Link]]`s (to, from) --JAB (2/7/14)
    #@# The return of `Nobody` followed by clients `filter`ing against it screams "flatMap!" --JAB (2/7/14)
    ###
    # (Boolean, Turtle, Turtle) => Link
    createLink: (directed, from, to) ->
      [end1, end2] =
        if from.id < to.id or directed
          [from, to]
        else
          [to, from]

      if @getLink(end1.id, end2.id) is Nobody
        link = new Link(@_linkIDManager.next(), directed, end1, end2, this)
        @updater.updated(link)(Builtins.linkBuiltins...)
        @updater.updated(link)(Builtins.linkExtras...) #@# See, this update nonsense is awful.
        @_links.insert(link)
        link
      else
        Nobody

    # (Number, String) => TurtleSet
    createOrderedTurtles: (n, breedName) -> #@# Clarity is a good thing
      turtles = _(0).range(n).map((num) => @createTurtle((id) => new Turtle(this, id, (10 * num + 5) % 140, (360 * num) / n, 0, 0, @breedManager.get(breedName)))).value()
      new TurtleSet(turtles, @breedManager.get(breedName))

    # (Number, String) => TurtleSet
    createTurtles: (n, breedName) -> #@# Clarity is still good
      turtles = _(0).range(n).map(=> @createTurtle((id) => new Turtle(this, id, 5 + 10 * Random.nextInt(14), Random.nextInt(360), 0, 0, @breedManager.get(breedName)))).value()
      new TurtleSet(turtles, @breedManager.get(breedName))

    # (Number, Number) => PatchSet
    getNeighbors: (pxcor, pycor) ->
      @topology().getNeighbors(pxcor, pycor)

    # (Number, Number) => PatchSet
    getNeighbors4: (pxcor, pycor) ->
      @topology().getNeighbors4(pxcor, pycor)

    # (Turtle, Turtle) => Link
    createDirectedLink: (from, to) ->
      @unbreededLinksAreDirected = true
      @updater.updated(this)("unbreededLinksAreDirected")
      @createLink(true, from, to)

    # (Turtle, TurtleSet) => LinkSet
    createDirectedLinks: (source, others) -> #@# Clarity
      @unbreededLinksAreDirected = true
      @updater.updated(this)("unbreededLinksAreDirected")
      links = _(others.toArray()).map((turtle) => @createLink(true, source, turtle)).filter((other) -> other isnt Nobody).value()
      new LinkSet(links)

    # (Turtle, TurtleSet) => LinkSet
    createReverseDirectedLinks: (source, others) -> #@# Clarity
      @unbreededLinksAreDirected = true
      @updater.updated(this)("unbreededLinksAreDirected")
      links = _(others.toArray()).map((turtle) => @createLink(true, turtle, source)).filter((other) -> other isnt Nobody).value()
      new LinkSet(links)

    # (Turtle, Turtle) => Link
    createUndirectedLink: (source, other) ->
      @createLink(false, source, other)

    #@# Should be able to call `map` directly, without juggling around with Lodash
    # (Turtle, TurtleSet) => LinkSet
    createUndirectedLinks: (source, others) -> #@# Clarity
      links = _(others.toArray()).map((turtle) => @createLink(false, source, turtle)).filter((other) -> other isnt Nobody).value()
      new LinkSet(links)

    # (Number, Number) => Link
    getLink: (fromId, toId) ->
      link = @_links.find((link) -> link.end1.id is fromId and link.end2.id is toId)
      if link?
        link
      else
        Nobody

    # (Link, Link) => Int
    linkCompare: (a, b) => #@# Heinous
      if a is b
        0
      else if a.id is -1 and b.id is -1
        0
      else if a.end1.id < b.end1.id
        -1
      else if a.end1.id > b.end1.id
        1
      else if a.end2.id < b.end2.id
        -1
      else if a.end2.id > b.end2.id
        1
      else if a.getBreedName() is b.getBreedName()
        0
      else if a.getBreedName() is "LINKS"
        -1
      else if b.getBreedName() is "LINKS"
        1
      else
        throw new Exception.NetLogoException("We have yet to implement link breed comparison")

)
