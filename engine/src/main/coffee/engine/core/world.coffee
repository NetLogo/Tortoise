# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Patch           = require('./patch')
PatchSet        = require('./patchset')
topologyFactory = require('./topology/factory')
LinkManager     = require('./world/linkmanager')
Ticker          = require('./world/ticker')
TurtleManager   = require('./world/turtlemanager')
NLMath          = require('util/nlmath')

{ filter, flatMap } = require('brazier/array')
{ pipeline }        = require('brazier/function')
{ values }          = require('brazier/object')

{ Observer                                    } = require('./observer')
{ linkBuiltins, patchBuiltins, turtleBuiltins } = require('./structure/builtins')
{ worldDataToCSV                              } = require('serialize/exportcsv')
{ TopologyInterrupt                           } = require('util/exception')

{ exportWorld, exportPlot, exportAllPlots } = require('./world/export')
{ importWorld                             } = require('./world/import')

module.exports =
  class World

    # type ShapeMap = Object[Shape]

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
    _outputClear: undefined # () => Unit

    # Optimization-related variables
    _patchesAllBlack:          undefined # Boolean
    _patchesWithLabels:        undefined # Number

    # (MiniWorkspace, WorldConfig, () => String, () => Unit, () => String, (Any) => String, (String) => Unit, Array[String], Array[String], Array[String], Number, Number, Number, Number, Number, Boolean, Boolean, ShapeMap, ShapeMap, () => Unit) => World
    constructor: (miniWorkspace, @_config, @_getViewBase64, @_outputClear, @_getOutput, @_setOutput, @dump, globalNames, interfaceGlobalNames
                , @patchesOwnNames, minPxcor, maxPxcor, minPycor , maxPycor, @patchSize, wrappingAllowedInX, wrappingAllowedInY
                , @turtleShapeMap, @linkShapeMap, onTickFunction) ->
      { selfManager: @selfManager, updater: @_updater, rng: @rng
      , breedManager: @breedManager, plotManager: @_plotManager } = miniWorkspace

      @_patchesAllBlack   = true
      @_patchesWithLabels = 0

      @_updater.collectUpdates()
      @_updater.registerWorldState({
        worldWidth: maxPxcor - minPxcor + 1,
        worldHeight: maxPycor - minPycor + 1,
        minPxcor: minPxcor,
        minPycor: minPycor,
        maxPxcor: maxPxcor,
        maxPycor: maxPycor,
        linkBreeds: @breedManager.orderedLinkBreeds(),
        linkShapeList: @linkShapeMap,
        patchSize: @patchSize,
        patchesAllBlack: @_patchesAllBlack,
        patchesWithLabels: @_patchesWithLabels,
        ticks: -1,
        turtleBreeds: @breedManager.orderedTurtleBreeds(),
        turtleShapeList: @turtleShapeMap,
        unbreededLinksAreDirected: false
        wrappingAllowedInX: wrappingAllowedInX,
        wrappingAllowedInY: wrappingAllowedInY
      })

      onTick = =>
        @rng.withAux(onTickFunction)
        @_plotManager.updatePlots()

      @linkManager   = new LinkManager(this, @breedManager, @_updater, @_setUnbreededLinksDirected, @_setUnbreededLinksUndirected)
      @observer      = new Observer(@_updater.updated, globalNames, interfaceGlobalNames)
      @ticker        = new Ticker(@_plotManager.setupPlots, onTick, @_updater.updated(this))
      @topology      = null
      @turtleManager = new TurtleManager(this, @breedManager, @_updater, @rng.nextInt)

      @_patches = []

      @_resizeHelper(minPxcor, maxPxcor, minPycor, maxPycor, wrappingAllowedInX, wrappingAllowedInY)

    # () => LinkSet
    links: ->
      @linkManager.links()

    # () => TurtleSet
    turtles: ->
      @turtleManager.turtles()

    # () => PatchSet
    patches: =>
      new PatchSet(@_patches, this, "patches")

    # (Number, Number, Number, Number, Boolean, Boolean) => Unit
    resize: (minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX = @topology._wrapInX, wrapsInY = @topology._wrapInY) ->
      @_resizeHelper(minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX, wrapsInY)
      @clearDrawing()

    # (Number, Number, Number, Number, Boolean, Boolean) => Unit
    _resizeHelper: (minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX = @topology._wrapInX, wrapsInY = @topology._wrapInY) ->

      if not (minPxcor <= 0 <= maxPxcor and minPycor <= 0 <= maxPycor)
        throw new Error("You must include the point (0, 0) in the world.")

      if (minPxcor isnt @topology?.minPxcor or minPycor isnt @topology?.minPycor or
          maxPxcor isnt @topology?.maxPxcor or maxPycor isnt @topology?.maxPycor)

        @_config.resizeWorld()

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
      @topology = topologyFactory(wrapsInX, wrapsInY, minX, maxX, minY, maxY, @patches, @getPatchAt)
      @_updater.updated(this)("wrappingAllowedInX", "wrappingAllowedInY")
      return

    # (Number, Number) => Agent
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

    # (Number, Number) => Agent
    patchAtCoords: (x, y) ->
      try
        newX = @topology.wrapX(x)
        newY = @topology.wrapY(y)
        @getPatchAt(newX, newY)
      catch error
        if error instanceof TopologyInterrupt then Nobody else throw error

    # (Number, Number, Number, Number) => Agent
    patchAtHeadingAndDistanceFrom: (angle, distance, x, y) ->
      heading = NLMath.normalizeHeading(angle)
      targetX = x + distance * NLMath.squash(NLMath.sin(heading))
      targetY = y + distance * NLMath.squash(NLMath.cos(heading))
      @patchAtCoords(targetX, targetY)

    # (Number) => Unit
    setPatchSize: (@patchSize) ->
      @_updater.updated(this)("patchSize")
      @_updater.rescaleDrawing()
      return

    # () => Unit
    clearAll: ->
      @observer.clearCodeGlobals()
      @observer.resetPerspective()
      @turtleManager.clearTurtles()
      @clearPatches()
      @clearLinks()
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      @ticker.clear()
      @_plotManager.clearAllPlots()
      @_outputClear()
      @clearDrawing()
      return

    # () => Unit
    clearDrawing: ->
      @_updater.clearDrawing()
      return

    # (String) => Unit
    importDrawing: (imageBase64) ->
      @_updater.importDrawing(imageBase64)
      return

    # () => Unit
    clearLinks: ->
      @linkManager.clear()
      @turtles().ask((-> SelfManager.self().linkManager.clear()), false)
      return

    # () => Unit
    clearPatches: ->
      @patches().forEach((patch) -> patch.reset(); return)
      @_declarePatchesAllBlack()
      @_resetPatchLabelCount()
      return

    # () => Object[Any]
    exportState: ->
      exportWorld.call(this)

    # () => String
    exportAllPlotsCSV: ->
      allPlotsDataToCSV(exportAllPlots.call(this))

    # (String) => String
    exportPlotCSV: (name) ->
      plotDataToCSV(exportPlot.call(this, name))

    # () => String
    exportCSV: ->

      varNamesForBreedsMatching =
        (pred) =>
          pipeline(values, filter(pred), flatMap((x) -> x.varNames))(@breedManager.breeds())

      allTurtlesOwnsNames = varNamesForBreedsMatching((breed) -> not breed.isLinky())
      allLinksOwnsNames   = varNamesForBreedsMatching((breed) -> breed.isLinky())

      state = exportWorld.call(this)

      worldDataToCSV(allTurtlesOwnsNames, allLinksOwnsNames, patchBuiltins, turtleBuiltins, linkBuiltins)(state)

    # (Number, Number) => PatchSet
    getNeighbors: (pxcor, pycor) ->
      new PatchSet(@topology.getNeighbors(pxcor, pycor), this)

    # (Number, Number) => PatchSet
    getNeighbors4: (pxcor, pycor) ->
      new PatchSet(@topology.getNeighbors4(pxcor, pycor), this)

    # (WorldState) => Unit
    importState: ->
      importWorld.apply(this, arguments)

    # The wrapping and rounding below is setup to avoid creating extra anonymous functions.
    # We could just use @ and fat arrows => but CoffeeScript uses anon funcs to bind `this`.
    # Those anon funcs cause GC pressure and runtime slowdown, so we have to manually setup
    # the context somehow.  A lot of rounding and wrapping goes on in models.  -JMB 07/2017

    # (Number) => Number
    _thisWrapX: (x) =>
      @topology.wrapX(x)

    # (Number) => Number
    _thisWrapY: (y) =>
      @topology.wrapY(y)

    # (Number) => Number
    _roundXCor: (x) ->
      wrappedX = @_wrapC(x, @_thisWrapX)
      @_roundCoordinate(wrappedX)

    # (Number) => Number
    _roundYCor: (y) ->
      wrappedY = @_wrapC(y, @_thisWrapY)
      @_roundCoordinate(wrappedY)

    # Similarly, using try/catch as an expression creates extra anon funcs, so we get
    # this value manually as well.  -JMB 07/2017

    # (Number, (Number) => Number) => Number
    _wrapC: (c, wrapper) ->
      wrappedC = undefined
      try
        wrappedC = wrapper(c)
      catch error
        trueError =
          if error instanceof TopologyInterrupt
            new TopologyInterrupt("Cannot access patches beyond the limits of current world.")
          else
            error
        throw trueError
      wrappedC

    # Boy, oh, boy!  Headless has only this to say about this code: "floor() is slow so we
    # don't use it".  I have a lot more to say!  This code is kind of nuts, but we can't
    # live without it unless something is done about Headless' uses of `World.roundX` and
    # and `World.roundY`.  The previous Tortoise code was somewhat sensible about patch
    # boundaries, but had to be supplanted by this in order to become compliant with NL
    # Headless, which interprets `0.4999999999999999167333` as being one patch over from
    # `0` (whereas, sensically, we should only do that starting at `0.5`).  But... we
    # don't live in an ideal world, so I'll just replicate Headless' silly behavior here.
    # --JAB (12/6/14)
    # (Number) => Number
    _roundCoordinate: (wrappedC) ->
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

    # (Number) => PatchSet
    _optimalPatchCol: (xcor) ->
      { maxPxcor: maxX, maxPycor: maxY, minPxcor: minX, minPycor: minY } = @topology
      @_optimalPatchSequence(xcor, minX, maxX, minY, maxY, (y) => @getPatchAt(xcor, y))

    # (Number) => PatchSet
    _optimalPatchRow: (ycor) ->
      { maxPxcor: maxX, maxPycor: maxY, minPxcor: minX, minPycor: minY } = @topology
      @_optimalPatchSequence(ycor, minY, maxY, minX, maxX, (x) => @getPatchAt(x, ycor))

    # (Number, Number, Number, Number, Number, (Number) => Agent) => PatchSet
    _optimalPatchSequence: (cor, boundaryMin, boundaryMax, seqStart, seqEnd, getPatch) ->
      ret =
        if boundaryMin <= cor <= boundaryMax
          [].concat(getPatch(n) for n in [seqStart..seqEnd]...)
        else
          []
      new PatchSet(ret, this)

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
      if not @_patchesAllBlack
        @_patchesAllBlack = true
        @_updater.updated(this)("patchesAllBlack")
      return

    # () => Unit
    _declarePatchesNotAllBlack: =>
      if @_patchesAllBlack
        @_patchesAllBlack = false
        @_updater.updated(this)("patchesAllBlack")
      return
