# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Nobody          = require('./nobody')
Observer        = require('./observer')
Patch           = require('./patch')
PatchSet        = require('./patchset')
topologyFactory = require('./topology/factory')
LinkManager     = require('./world/linkmanager')
Ticker          = require('./world/ticker')
TurtleManager   = require('./world/turtlemanager')
StrictMath      = require('tortoise/shim/strictmath')
Exception       = require('tortoise/util/exception')

module.exports =
  class World

    id: 0 # Number

    linkManager:   undefined # LinkManager
    observer:      undefined # Observer
    ticker:        undefined # Ticker
    topology:      undefined # Topology
    turtleManager: undefined # TurtleManager

    _patches: undefined # Array[Patch]

    # Optimization-related variables
    unbreededLinksAreDirected: undefined # Boolean
    _patchesAllBlack:          undefined # Boolean
    _patchesWithLabels:        undefined # Number

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

      @linkManager   = new LinkManager(this, breedManager, _updater, @_setUnbreededLinksDirected, @_setUnbreededLinksUndirected)
      @observer      = new Observer(@_updater.updated, globalNames, interfaceGlobalNames)
      @ticker        = new Ticker(@_updater.updated(this))
      @topology      = null
      @turtleManager = new TurtleManager(this, breedManager, _updater, )

      @_patches         = []

      @unbreededLinksAreDirected = false
      @_patchesAllBlack          = true
      @_patchesWithLabels        = 0

      @unbreededLinksAreDirected = false
      @_patchesAllBlack          = true
      @_patchesWithLabels        = 0

      @resize(minPxcor, maxPxcor, minPycor, maxPycor, wrappingAllowedInX, wrappingAllowedInY)


    # () => Unit
    createPatches: ->
      nested =
        for y in [@topology.maxPycor..@topology.minPycor]
          for x in [@topology.minPxcor..@topology.maxPxcor]
            id = (@topology.width * (@topology.maxPycor - y)) + x - @topology.minPxcor
            new Patch(id, x, y, this, @_updater.updated, @_declarePatchesNotAllBlack, @_decrementPatchLabelCount, @_incrementPatchLabelCount)

      @_patches = [].concat(nested...)

      for patch in @_patches
        @_updater.updated(patch)("pxcor", "pycor", "pcolor", "plabel", "plabel-color")

      return

    # () => LinkSet
    links: ->
      @linkManager.links()

    # () => TurtleSet
    turtles: ->
      @turtleManager.turtles()

    # () => PatchSet
    patches: =>
      new PatchSet(@_patches, "patches")

    # (Number, Number, Number, Number, Boolean, Boolean) => Unit
    resize: (minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX = @topology._wrapInX, wrapsInY = @topology._wrapInY) ->

      if not (minPxcor <= 0 <= maxPxcor and minPycor <= 0 <= maxPycor)
        throw new Error("You must include the point (0, 0) in the world.")

      # For some reason, JVM NetLogo doesn't restart `who` ordering after `resize-world`; even the test for this is existentially confused. --JAB (4/3/14)
      @turtleManager._clearTurtlesSuspended()

      @changeTopology(wrapsInX, wrapsInY, minPxcor, maxPxcor, minPycor, maxPycor)
      @createPatches()
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      @_updater.updated(this)("width", "height", "minPxcor", "minPycor", "maxPxcor", "maxPycor")

      return

    # (Boolean, Boolean, Number, Number, Number, Number) => Unit
    changeTopology: (wrapsInX, wrapsInY, minX = @topology.minPxcor, maxX = @topology.maxPxcor, minY = @topology.minPycor, maxY = @topology.maxPycor) ->
      @topology = topologyFactory(wrapsInX, wrapsInY, minX, maxX, minY, maxY, @patches, @getPatchAt)
      return

    # (Number, Number) => Patch
    getPatchAt: (x, y) =>
      try
        trueX  = @topology.wrapX(x)
        trueY  = @topology.wrapY(y)
        index  = (@topology.maxPycor - StrictMath.round(trueY)) * @topology.width + (StrictMath.round(trueX) - @topology.minPxcor)
        @_patches[index]
      catch error
        if error instanceof Exception.TopologyInterrupt
          Nobody
        else
          throw error

    # () => Unit
    clearAll: ->
      @observer.clearCodeGlobals()
      @observer.resetPerspective()
      @turtleManager.clearTurtles()
      @createPatches()
      @linkManager._resetIDs()
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      @ticker.clear()
      return

    # () => Unit
    clearPatches: ->
      @patches().forEach((patch) -> patch.reset(); return)
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      return

    # (Number, Number) => PatchSet
    getNeighbors: (pxcor, pycor) ->
      new PatchSet(@topology.getNeighbors(pxcor, pycor))

    # (Number, Number) => PatchSet
    getNeighbors4: (pxcor, pycor) ->
      new PatchSet(@topology.getNeighbors4(pxcor, pycor))

    # () => Unit
    _incrementPatchLabelCount: =>
      @_setPatchLabelCount((count) -> count + 1)
      return

    # () => Unit
    _decrementPatchLabelCount: =>
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
    _setUnbreededLinksDirected: =>
      @unbreededLinksAreDirected = true
      @_updater.updated(this)("unbreededLinksAreDirected")
      return

    # () => Unit
    _setUnbreededLinksUndirected: =>
      @unbreededLinksAreDirected = false
      @_updater.updated(this)("unbreededLinksAreDirected")
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
