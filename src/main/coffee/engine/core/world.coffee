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

{ TopologyInterrupt } = require('tortoise/util/exception')

module.exports =
  class World

    id: 0 # Number

    breedManager:  undefined # BreedManager
    linkManager:   undefined # LinkManager
    observer:      undefined # Observer
    rng:           undefined # RNG
    selfManager:   undefined # SelfManager
    ticker:        undefined # Ticker
    topology:      undefined # Topology
    turtleManager: undefined # TurtleManager

    _patches:     undefined # Array[Patch]
    _plotManager: undefined # PlotManager
    _updater:     undefined # Updater

    # Optimization-related variables
    _patchesAllBlack:          undefined # Boolean
    _patchesWithLabels:        undefined # Number

    # (MiniWorkspace, Array[String], Array[String], Array[String], Number, Number, Number, Number, Number, Boolean, Boolean, Array[Object], Array[Object]) => World
    constructor: (miniWorkspace, globalNames, interfaceGlobalNames, @patchesOwnNames, minPxcor, maxPxcor, minPycor
                , maxPycor, _patchSize, wrappingAllowedInX, wrappingAllowedInY, turtleShapeList, linkShapeList) ->
      { selfManager: @selfManager, updater: @_updater, rng: @rng
      , breedManager: @breedManager, plotManager: @_plotManager } = miniWorkspace
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

      @linkManager   = new LinkManager(this, @breedManager, @_updater, @_setUnbreededLinksDirected, @_setUnbreededLinksUndirected)
      @observer      = new Observer(@_updater.updated, globalNames, interfaceGlobalNames)
      @ticker        = new Ticker(@_plotManager.setupPlots, @_plotManager.updatePlots, @_updater.updated(this))
      @topology      = null
      @turtleManager = new TurtleManager(this, @breedManager, @_updater, @rng.nextInt)

      @_patches = []

      @_patchesAllBlack   = true
      @_patchesWithLabels = 0

      @_resizeHelper(minPxcor, maxPxcor, minPycor, maxPycor, wrappingAllowedInX, wrappingAllowedInY)


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
      @_resizeHelper(minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX, wrapsInY)
      @_updater.clearDrawing()

    # (Number, Number, Number, Number, Boolean, Boolean) => Unit
    _resizeHelper: (minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX = @topology._wrapInX, wrapsInY = @topology._wrapInY) ->

      if not (minPxcor <= 0 <= maxPxcor and minPycor <= 0 <= maxPycor)
        throw new Error("You must include the point (0, 0) in the world.")

      # For some reason, JVM NetLogo doesn't restart `who` ordering after `resize-world`; even the test for this is existentially confused. --JAB (4/3/14)
      @turtleManager._clearTurtlesSuspended()

      @changeTopology(wrapsInX, wrapsInY, minPxcor, maxPxcor, minPycor, maxPycor)
      @_createPatches()
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      @_updater.updated(this)("width", "height", "minPxcor", "minPycor", "maxPxcor", "maxPycor")

      return

    # (Boolean, Boolean, Number, Number, Number, Number) => Unit
    changeTopology: (wrapsInX, wrapsInY, minX = @topology.minPxcor, maxX = @topology.maxPxcor, minY = @topology.minPycor, maxY = @topology.maxPycor) ->
      @topology = topologyFactory(wrapsInX, wrapsInY, minX, maxX, minY, maxY, @patches, @getPatchAt, @rng.nextDouble)
      @_updater.updated(this)("wrappingAllowedInX", "wrappingAllowedInY")
      return

    # (Number, Number) => Patch
    getPatchAt: (x, y) =>
      try
        roundedX  = @_roundXCor(x)
        roundedY  = @_roundYCor(y)
        index     = (@topology.maxPycor - roundedY) * @topology.width + (roundedX - @topology.minPxcor)
        @_patches[index]
      catch error
        if error instanceof TopologyInterrupt
          Nobody
        else
          throw error

    # () => Unit
    clearAll: ->
      @observer.clearCodeGlobals()
      @observer.resetPerspective()
      @turtleManager.clearTurtles()
      @clearPatches()
      @linkManager.clear()
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      @ticker.clear()
      @_plotManager.clearAllPlots()
      @_updater.clearDrawing()
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

    # (Number) => Number
    _roundXCor: (x) ->
      @_roundCoordinate(x, (s) => @topology.wrapX(s))

      # (Number) => Number
    _roundYCor: (y) ->
      @_roundCoordinate(y, (s) => @topology.wrapY(s))

    # Boy, oh, boy!  Headless has only this to say about this code: "floor() is slow so we
    # don't use it".  I have a lot more to say!  This code is kind of nuts, but we can't
    # live without it unless something is done about Headless' uses of `World.roundX` and
    # and `World.roundY`.  The previous Tortoise code was somewhat sensible about patch
    # boundaries, but had to be supplanted by this in order to become compliant with NL
    # Headless, which interprets `0.4999999999999999167333` as being one patch over from
    # `0` (whereas, sensically, we should only do that starting at `0.5`).  But... we
    # don't live in an ideal world, so I'll just replicate Headless' silly behavior here.
    # --JAB (12/6/14)
    # (Number, (Number) => Number) => Number
    _roundCoordinate: (c, wrapFunc) ->
      wrappedC =
        try
          wrapFunc(c)
        catch error
          trueError =
            if error instanceof TopologyInterrupt
              new TopologyInterrupt("Cannot access patches beyond the limits of current world.")
            else
              error
          throw trueError

      if wrappedC > 0
        (wrappedC + 0.5) | 0
      else
        integral   = wrappedC | 0
        fractional = integral - wrappedC
        if fractional > 0.5 then integral - 1 else integral

    # () => Unit
    _createPatches: ->
      nested =
        for y in [@topology.maxPycor..@topology.minPycor]
          for x in [@topology.minPxcor..@topology.maxPxcor]
            id = (@topology.width * (@topology.maxPycor - y)) + x - @topology.minPxcor
            new Patch(id, x, y, this, @_updater.updated, @_declarePatchesNotAllBlack, @_decrementPatchLabelCount, @_incrementPatchLabelCount)

      @_patches = [].concat(nested...)

      for patch in @_patches
        @_updater.updated(patch)("pxcor", "pycor", "pcolor", "plabel", "plabel-color")

      return

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
      @breedManager.setUnbreededLinksDirected()
      @_updater.updated(this)("unbreededLinksAreDirected")
      return

    # () => Unit
    _setUnbreededLinksUndirected: =>
      @breedManager.setUnbreededLinksUndirected()
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
