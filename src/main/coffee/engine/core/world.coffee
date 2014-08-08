# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/observer', 'engine/core/patch', 'engine/core/patchset', 'engine/core/topology/factory'
      , 'engine/core/worldstructure/linkmanager', 'engine/core/worldstructure/ticker', 'engine/core/worldstructure/turtlemanager',  'shim/strictmath'
      , 'util/exception']
     , ( Observer,               Patch,               PatchSet,               topologyFactory
      ,  LinkManager,                     Ticker,                     TurtleManager,                      StrictMath
      ,  Exception) ->

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
      new PatchSet(@_patches)

    # (Number, Number, Number, Number, Boolean, Boolean) => Unit
    resize: (minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX = @topology._wrapInX, wrapsInY = @topology._wrapInY) ->

      if not (minPxcor <= 0 <= maxPxcor and minPycor <= 0 <= maxPycor)
        throw new Exception.NetLogoException("You must include the point (0, 0) in the world.")

      # For some reason, JVM NetLogo doesn't restart `who` ordering after `resize-world`; even the test for this is existentially confused. --JAB (4/3/14)
      @turtleManager._clearTurtlesSuspended()

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

    # () => Unit
    clearAll: ->
      @observer.clearCodeGlobals()
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

)
