# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/link', 'engine/core/linkset', 'engine/core/nobody', 'engine/core/observer', 'engine/core/patch'
      , 'engine/core/patchset', 'engine/core/turtle', 'engine/core/turtleset', 'engine/core/structure/builtins'
      , 'engine/core/structure/idmanager', 'engine/core/structure/ticker', 'engine/core/structure/worldlinks'
      , 'engine/core/topology/factory', 'shim/lodash', 'shim/random', 'shim/strictmath', 'util/colormodel'
      , 'util/exception']
     , ( Link,               LinkSet,               Nobody,               Observer,               Patch
      ,  PatchSet,               Turtle,               TurtleSet,               Builtins
      ,  IDManager,                         Ticker,                         WorldLinks
      ,  topologyFactory,                _,             Random,        StrictMath,        ColorModel
      ,  Exception) ->

  class World

    id: 0 # Number

    observer: undefined # Observer
    ticker:   undefined # Ticker
    topology: undefined # Topology

    _links:             undefined # WorldLinks
    _linkIDManager:     undefined # IDManager
    _turtleIDManager:   undefined # IDManager
    _patches:           undefined # Array[Patch]
    _patchesAllBlack:   undefined # Boolean
    _patchesWithLabels: undefined # Number
    _turtles:           undefined # Array[Turtle]
    _turtlesById:       undefined # Object[Number, Turtle]

    #@# I'm aware that some of this stuff ought to not live on `World`
    # (SelfManager, Updater, BreedManager, Array[String], Array[String], Array[String], Array[String], Array[String], Number, Number, Number, Number, Number, Boolean, Boolean, Array[Object], Array[Object]) => World
    constructor: (@selfManager, @_updater, @breedManager, globalNames, interfaceGlobalNames, @turtlesOwnNames
                , @linksOwnNames, @patchesOwnNames, minPxcor, maxPxcor, minPycor, maxPycor, @_patchSize
                , wrappingAllowedInX, wrappingAllowedInY, turtleShapeList, linkShapeList) ->
      @_updater.collectUpdates()
      @_updater.registerWorldState({
        worldWidth: Math.abs(minPxcor - maxPxcor) + 1,
        worldHeight: Math.abs(minPycor - maxPycor) + 1,
        minPxcor: minPxcor,
        minPycor: minPycor,
        maxPxcor: maxPxcor,
        maxPycor: maxPycor,
        linkBreeds: "XXX IMPLEMENT ME",
        linkShapeList: linkShapeList,
        patchSize: @_patchSize,
        patchesAllBlack: @_patchesAllBlack,
        patchesWithLabels: @_patchesWithLabels,
        ticks: -1,
        turtleBreeds: "XXX IMPLEMENT ME",
        turtleShapeList: turtleShapeList,
        unbreededLinksAreDirected: false
        wrappingAllowedInX: wrappingAllowedInX,
        wrappingAllowedInY: wrappingAllowedInY
      })

      @observer = new Observer(@_updater.updated, globalNames, interfaceGlobalNames)
      @ticker   = new Ticker(@_updater.updated(this))
      @topology = null

      @_links           = new WorldLinks(@linkCompare)
      @_linkIDManager   = new IDManager #@# The fact that `World` even talks to ID managers (rather than a container for the type of agent) seems undesirable to me
      @_turtleIDManager = new IDManager
      @_patches         = []
      @_patchesAllBlack = true
      @_turtles         = []
      @_turtlesById     = {}

      @resize(minPxcor, maxPxcor, minPycor, maxPycor, wrappingAllowedInX, wrappingAllowedInY)


    # () => Unit
    createPatches: ->
      nested =
        for y in [@topology.maxPycor..@topology.minPycor]
          for x in [@topology.minPxcor..@topology.maxPxcor]
            id = (@topology.width * (@topology.maxPycor - y)) + x - @topology.minPxcor
            new Patch(id, x, y, this, @_updater.updated, @_declarePatchesNotAllBlack)

      @_patches = [].concat(nested...)

      for patch in @_patches
        @_updater.updated(patch)("pxcor", "pycor", "pcolor", "plabel", "plabel-color")

      return


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

    # (Number, Number, Number, Number, Boolean, Boolean) => Unit
    resize: (minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX = @topology._wrapInX, wrapsInY = @topology._wrapInY) ->

      if not (minPxcor <= 0 <= maxPxcor and minPycor <= 0 <= maxPycor)
        throw new Exception.NetLogoException("You must include the point (0, 0) in the world.")

      # For some reason, JVM NetLogo doesn't restart `who` ordering after `resize-world`; even the test for this is existentially confused. --JAB (4/3/14)
      @_turtleIDManager.suspendDuring(() => @clearTurtles())

      @topology = topologyFactory(wrapsInX, wrapsInY, minPxcor, maxPxcor, minPycor, maxPycor, @patches, @getPatchAt)

      @createPatches()
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      @_updater.updated(this)("width", "height", "minPxcor", "minPycor", "maxPxcor", "maxPycor")

      return


    # (Number, Number) => Patch
    getPatchAt: (x, y) =>
      trueX  = (x - @topology.minPxcor) % @topology.width  + @topology.minPxcor # Handle negative coordinates and wrapping
      trueY  = (y - @topology.minPycor) % @topology.height + @topology.minPycor
      index  = (@topology.maxPycor - StrictMath.round(trueY)) * @topology.width + (StrictMath.round(trueX) - @topology.minPxcor)
      @_patches[index]

    # (Number) => Agent
    getTurtle: (id) ->
      @_turtlesById[id] or Nobody

    # (String, Number) => Agent
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
        @_updater.updated(this)("unbreededLinksAreDirected")
      return

    # (Number) => Unit
    removeTurtle: (id) -> #@# Having two different collections of turtles to manage seems avoidable
      turtle = @_turtlesById[id]
      @_turtles.splice(@_turtles.indexOf(turtle), 1)
      delete @_turtlesById[id]
      return

    # () => Unit
    _declarePatchesAllBlack: ->
      @_patchesAllBlack = true
      @_updater.updated(this)("patchesAllBlack")
      return

    # () => Unit
    _declarePatchesNotAllBlack: =>
      @_patchesAllBlack = false
      @_updater.updated(this)("patchesAllBlack")
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
    _resetPatchLabelCount: ->
      @_setPatchLabelCount(-> 0)
      return

    # ((Number) => Number) => Unit
    _setPatchLabelCount: (updateCountFunc) ->
      @_patchesWithLabels = updateCountFunc(@_patchesWithLabels)
      @_updater.updated(this)("patchesWithLabels")
      return

    # () => Unit
    clearAll: ->
      @observer.clearCodeGlobals()
      @clearTurtles()
      @createPatches()
      @_linkIDManager.reset()
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
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
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      return

    # (Number, Number, Number, Number, Breed, String, Number, Boolean, Number, PenManager) => Turtle
    createTurtle: (color, heading, xcor, ycor, breed, label, lcolor, isHidden, size, penManager) ->
      id     = @_turtleIDManager.next()
      turtle = new Turtle(this, id, @_updater.updated, @_updater.registerDeadTurtle, color, heading, xcor, ycor, breed, label, lcolor, isHidden, size, penManager)
      @_updater.updated(turtle)(Builtins.turtleBuiltins...)
      @_turtles.push(turtle)
      @_turtlesById[id] = turtle
      turtle

    # (Number, String) => TurtleSet
    createOrderedTurtles: (n, breedName) ->
      turtles = _(0).range(n).map(
        (num) =>
          color   = ColorModel.nthColor(num)
          heading = (360 * num) / n
          @createTurtle(color, heading, 0, 0, @breedManager.get(breedName))
      ).value()
      new TurtleSet(turtles, @breedManager.get(breedName))

    # (Number, String, Number, Number) => TurtleSet
    createTurtles: (n, breedName, xcor = 0, ycor = 0) ->
      turtles = _(0).range(n).map(=>
        color   = ColorModel.randomColor()
        heading = Random.nextInt(360)
        @createTurtle(color, heading, xcor, ycor, @breedManager.get(breedName))
      ).value()
      new TurtleSet(turtles, @breedManager.get(breedName))

    # (Number, Number) => PatchSet
    getNeighbors: (pxcor, pycor) ->
      new PatchSet(@topology.getNeighbors(pxcor, pycor))

    # (Number, Number) => PatchSet
    getNeighbors4: (pxcor, pycor) ->
      new PatchSet(@topology.getNeighbors4(pxcor, pycor))

    # (Turtle, Turtle) => Link
    createDirectedLink: (from, to) ->
      @unbreededLinksAreDirected = true
      @_updater.updated(this)("unbreededLinksAreDirected")
      @_createLink(true, from, to)

    # (Turtle, TurtleSet) => LinkSet
    createDirectedLinks: (source, others) -> #@# Clarity
      @unbreededLinksAreDirected = true
      @_updater.updated(this)("unbreededLinksAreDirected")
      links = _(others.toArray()).map((turtle) => @_createLink(true, source, turtle)).filter((other) -> other isnt Nobody).value()
      new LinkSet(links)

    # (Turtle, TurtleSet) => LinkSet
    createReverseDirectedLinks: (source, others) -> #@# Clarity, duplication FTW
      @unbreededLinksAreDirected = true
      @_updater.updated(this)("unbreededLinksAreDirected")
      links = _(others.toArray()).map((turtle) => @_createLink(true, turtle, source)).filter((other) -> other isnt Nobody).value()
      new LinkSet(links)

    # (Turtle, Turtle) => Link
    createUndirectedLink: (source, other) ->
      @_createLink(false, source, other)

    #@# Should be able to call `map` directly, without juggling around with Lodash
    # (Turtle, TurtleSet) => LinkSet
    createUndirectedLinks: (source, others) -> #@# Clarity
      links = _(others.toArray()).map((turtle) => @_createLink(false, source, turtle)).filter((other) -> other isnt Nobody).value()
      new LinkSet(links)

    # (Number, Number) => Agent
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
        throw new Exception.NetLogoException("Unsure how Link #{a.id} differs from Link #{b.id}") # JVM NetLogo uses the order the breeds were declared in, but that incites my hatred --JAB (6/26/14)

    ###
    #@# We shouldn't be looking up links in the tree everytime we create a link; JVM NL uses 2 `LinkedHashMap[Turtle, Buffer[Link]]`s (to, from) --JAB (2/7/14)
    #@# The return of `Nobody` followed by clients `filter`ing against it screams "flatMap!" --JAB (2/7/14)
    ###
    # (Boolean, Turtle, Turtle) => Link
    _createLink: (directed, from, to) ->
      [end1, end2] =
      if from.id < to.id or directed
        [from, to]
      else
        [to, from]

      if @getLink(end1.id, end2.id) is Nobody
        link = new Link(@_linkIDManager.next(), directed, end1, end2, this, @_updater.updated, @_updater.registerDeadLink)
        @_updater.updated(link)(Builtins.linkBuiltins...)
        @_updater.updated(link)(Builtins.linkExtras...) #@# See, this update nonsense is awful.
        @_links.insert(link)
        link
      else
        Nobody

)
