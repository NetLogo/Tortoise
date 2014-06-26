# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['integration/random', 'integration/strictmath', 'engine/builtins', 'engine/colormodel', 'engine/exception'
      , 'engine/idmanager', 'engine/link', 'engine/linkset', 'engine/nobody', 'engine/observer', 'engine/patch'
      , 'engine/patchset', 'engine/ticker', 'engine/turtle', 'engine/turtleset', 'engine/worldlinks'
      , 'engine/topology/box', 'engine/topology/horizcylinder', 'engine/topology/torus', 'engine/topology/vertcylinder'
      , 'integration/lodash']
     , ( Random,               StrictMath,               Builtins,          ColorModel,          Exception
      ,  IDManager,          Link,          LinkSet,          Nobody,          Observer,          Patch
      ,  PatchSet,          Ticker,          Turtle,          TurtleSet,          WorldLinks
      ,  Box,                   HorizCylinder,                   Torus,                   VertCylinder
      ,  _) ->

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
    constructor: (@selfManager, @updater, @breedManager, globalNames, interfaceGlobalNames, @turtlesOwnNames
                , @linksOwnNames, @patchesOwnNames, @minPxcor, @maxPxcor, @minPycor, @maxPycor, @_patchSize
                , @_wrappingAllowedInX, @_wrappingAllowedInY, turtleShapeList, linkShapeList) ->
      @updater.collectUpdates()
      @updater.registerWorldState({
        worldWidth: Math.abs(@minPxcor - @maxPxcor) + 1,
        worldHeight: Math.abs(@minPycor - @maxPycor) + 1,
        minPxcor: @minPxcor,
        minPycor: @minPycor,
        maxPxcor: @maxPxcor,
        maxPycor: @maxPycor,
        linkBreeds: "XXX IMPLEMENT ME",
        linkShapeList: linkShapeList,
        patchSize: @_patchSize,
        patchesAllBlack: @_patchesAllBlack,
        patchesWithLabels: @_patchesWithLabels,
        ticks: -1,
        turtleBreeds: "XXX IMPLEMENT ME",
        turtleShapeList: turtleShapeList,
        unbreededLinksAreDirected: false
        wrappingAllowedInX: @_wrappingAllowedInX,
        wrappingAllowedInY: @_wrappingAllowedInY
      })

      @observer = new Observer(updater.updated, globalNames, interfaceGlobalNames)
      @ticker   = new Ticker(updater.updated(this))
      @topology = null

      @_links           = new WorldLinks(@linkCompare)
      @_linkIDManager   = new IDManager #@# The fact that `World` even talks to ID managers (rather than a container for the type of agent) seems undesirable to me
      @_turtleIDManager = new IDManager
      @_patches         = []
      @_patchesAllBlack = true
      @_turtles         = []
      @_turtlesById     = {}

      @resize(@minPxcor, @maxPxcor, @minPycor, @maxPycor)


    # () => Unit
    createPatches: ->
      nested =
        for y in [@maxPycor..@minPycor]
          for x in [@minPxcor..@maxPxcor]
            id = (@width() * (@maxPycor - y)) + x - @minPxcor
            new Patch(id, x, y, this, @updater.updated)

      @_patches = [].concat(nested...)

      for patch in @_patches
        @updater.updated(patch)("pxcor", "pycor", "pcolor", "plabel", "plabel-color")

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

      @topology =
        if @_wrappingAllowedInX and @_wrappingAllowedInY #@# `Topology.Companion` should know how to generate a topology from these values; what does `World` care?
          new Torus(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
        else if @_wrappingAllowedInX
          new VertCylinder(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
        else if @_wrappingAllowedInY
          new HorizCylinder(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)
        else
          new Box(@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patches, @getPatchAt)

      @createPatches()
      @patchesAllBlack(true)
      @_resetPatchLabelCount()
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
    _resetPatchLabelCount: ->
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
      @patchesAllBlack(true)
      @_resetPatchLabelCount()
      return

    # (Number, Number, Number, Number, Breed, String, Number, Boolean, Number, PenManager) => Turtle
    createTurtle: (color, heading, xcor, ycor, breed, label, lcolor, isHidden, size, penManager) ->
      id     = @_turtleIDManager.next()
      turtle = new Turtle(this, id, @updater.updated, @updater.registerDeadTurtle, color, heading, xcor, ycor, breed, label, lcolor, isHidden, size, penManager)
      @updater.updated(turtle)(Builtins.turtleBuiltins...)
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

    # (Number, String) => TurtleSet
    createTurtles: (n, breedName, xcor = 0, ycor = 0) ->
      turtles = _(0).range(n).map(=>
        color   = ColorModel.randomColor()
        heading = Random.nextInt(360)
        @createTurtle(color, heading, xcor, ycor, @breedManager.get(breedName))
      ).value()
      new TurtleSet(turtles, @breedManager.get(breedName))

    # (Number, Number) => PatchSet
    getNeighbors: (pxcor, pycor) ->
      @topology.getNeighbors(pxcor, pycor)

    # (Number, Number) => PatchSet
    getNeighbors4: (pxcor, pycor) ->
      @topology.getNeighbors4(pxcor, pycor)

    # (Turtle, Turtle) => Link
    createDirectedLink: (from, to) ->
      @unbreededLinksAreDirected = true
      @updater.updated(this)("unbreededLinksAreDirected")
      @_createLink(true, from, to)

    # (Turtle, TurtleSet) => LinkSet
    createDirectedLinks: (source, others) -> #@# Clarity
      @unbreededLinksAreDirected = true
      @updater.updated(this)("unbreededLinksAreDirected")
      links = _(others.toArray()).map((turtle) => @_createLink(true, source, turtle)).filter((other) -> other isnt Nobody).value()
      new LinkSet(links)

    # (Turtle, TurtleSet) => LinkSet
    createReverseDirectedLinks: (source, others) -> #@# Clarity
      @unbreededLinksAreDirected = true
      @updater.updated(this)("unbreededLinksAreDirected")
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
        link = new Link(@_linkIDManager.next(), directed, end1, end2, this, @updater.updated, @updater.registerDeadLink)
        @updater.updated(link)(Builtins.linkBuiltins...)
        @updater.updated(link)(Builtins.linkExtras...) #@# See, this update nonsense is awful.
        @_links.insert(link)
        link
      else
        Nobody

)
