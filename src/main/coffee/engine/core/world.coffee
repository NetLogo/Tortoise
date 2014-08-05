# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/link', 'engine/core/linkset', 'engine/core/nobody', 'engine/core/observer', 'engine/core/patch'
      , 'engine/core/patchset', 'engine/core/turtle', 'engine/core/turtleset', 'engine/core/structure/builtins'
      , 'engine/core/topology/factory', 'engine/core/world/idmanager', 'engine/core/world/ticker'
      , 'engine/core/world/sortedlinks', 'shim/lodash', 'shim/random', 'shim/strictmath', 'util/colormodel'
      , 'util/exception']
     , ( Link,               LinkSet,               Nobody,               Observer,               Patch
      ,  PatchSet,               Turtle,               TurtleSet,               Builtins
      ,  topologyFactory,                IDManager,                     Ticker
      ,  SortedLinks,                     _,             Random,        StrictMath,        ColorModel
      ,  Exception) ->

  class World

    id: 0 # Number

    observer: undefined # Observer
    ticker:   undefined # Ticker
    topology: undefined # Topology

    _links:             undefined # SortedLinks
    _linkIDManager:     undefined # IDManager
    _turtleIDManager:   undefined # IDManager
    _patches:           undefined # Array[Patch]
    _patchesAllBlack:   undefined # Boolean
    _patchesWithLabels: undefined # Number
    _turtles:           undefined # Array[Turtle]
    _turtlesById:       undefined # Object[Number, Turtle]

    # (SelfManager, Updater, BreedManager, Array[String], Array[String], Array[String], Array[String], Array[String], Number, Number, Number, Number, Number, Boolean, Boolean, Array[Object], Array[Object]) => World
    constructor: (@selfManager, @_updater, @breedManager, globalNames, interfaceGlobalNames, @turtlesOwnNames
                , @linksOwnNames, @patchesOwnNames, minPxcor, maxPxcor, minPycor, maxPycor, _patchSize
                , wrappingAllowedInX, wrappingAllowedInY, turtleShapeList, linkShapeList) ->
      @_updater.collectUpdates()
      @_updater.registerWorldState({
        worldWidth: maxPxcor - minPxcor + 1,
        worldHeight: maxPycor - minPycor + 1,
        minPxcor: minPxcor,
        minPycor: minPycor,
        maxPxcor: maxPxcor,
        maxPycor: maxPycor,
        linkBreeds: "XXX IMPLEMENT ME",
        linkShapeList: linkShapeList,
        patchSize: _patchSize,
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

      @_links           = new SortedLinks
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
      new TurtleSet(turtles, breedName)

    # (Number, String, Number, Number) => TurtleSet
    createTurtles: (n, breedName, xcor = 0, ycor = 0) ->
      turtles = _(0).range(n).map(=>
        color   = ColorModel.randomColor()
        heading = Random.nextInt(360)
        @createTurtle(color, heading, xcor, ycor, @breedManager.get(breedName))
      ).value()
      new TurtleSet(turtles, breedName)

    # (Number, Number) => PatchSet
    getNeighbors: (pxcor, pycor) ->
      new PatchSet(@topology.getNeighbors(pxcor, pycor))

    # (Number, Number) => PatchSet
    getNeighbors4: (pxcor, pycor) ->
      new PatchSet(@topology.getNeighbors4(pxcor, pycor))

    # (Turtle, Turtle) => Link
    createDirectedLink: (from, to) ->
      @_setUnbreededLinksDirected()
      @_createLink(true, from, to)

    # (Turtle, TurtleSet) => LinkSet
    createDirectedLinks: (source, others) ->
      @_setUnbreededLinksDirected()
      @_createLinksBy((turtle) => @_createLink(true, source, turtle))(others)

    # (Turtle, TurtleSet) => LinkSet
    createReverseDirectedLinks: (source, others) ->
      @_setUnbreededLinksDirected()
      @_createLinksBy((turtle) => @_createLink(true, turtle, source))(others)

    # (Turtle, Turtle) => Link
    createUndirectedLink: (source, other) ->
      @_createLink(false, source, other)

    # (Turtle, TurtleSet) => LinkSet
    createUndirectedLinks: (source, others) ->
      @_createLinksBy((turtle) => @_createLink(false, source, turtle))(others)

    # () => Unit
    _setUnbreededLinksDirected: ->
      @unbreededLinksAreDirected = true
      @_updater.updated(this)("unbreededLinksAreDirected")
      return

    # ((Turtle) => Link) => TurtleSet => LinkSet
    _createLinksBy: (mkLink) -> (turtles) ->
      isLink = (other) -> other isnt Nobody
      links  = turtles.toArray().map(mkLink).filter(isLink)
      new LinkSet(links)

    # (Number, Number) => Agent
    getLink: (fromId, toId) ->
      link = @_links.find((link) -> link.end1.id is fromId and link.end2.id is toId)
      if link?
        link
      else
        Nobody

    ###
    #@# We shouldn't be looking up links in the tree everytime we create a link; JVM NL uses 2 `LinkedHashMap[Turtle, Buffer[Link]]`s (to, from) --JAB (2/7/14)
    ###
    # (Boolean, Turtle, Turtle) => Link
    _createLink: (isDirected, from, to) ->
      [end1, end2] =
        if from.id < to.id or isDirected
          [from, to]
        else
          [to, from]

      if @getLink(end1.id, end2.id) is Nobody
        link = new Link(@_linkIDManager.next(), isDirected, end1, end2, this, @_updater.updated, @_updater.registerDeadLink)
        @_updater.updated(link)(Builtins.linkBuiltins...)
        @_updater.updated(link)(Builtins.linkExtras...)
        @_links.insert(link)
        link
      else
        Nobody

)
