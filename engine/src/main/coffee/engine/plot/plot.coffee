# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ Pen }    = require('./pen')
StrictMath = require('shim/strictmath')

{ filter, forEach, isEmpty, map, maxBy, toObject, zip } = require('brazierjs/array')
{ flip, id, pipeline }                                  = require('brazierjs/function')
{ fold, isSomething, maybe }                            = require('brazierjs/maybe')
{ lookup, values }                                      = require('brazierjs/object')

{ StopInterrupt: Stop } = require('util/exception')

module.exports = class Plot

  _currentPenMaybe: undefined # Maybe[Pen]
  _originalBounds:  undefined # (Number, Number, Number, Number)
  _penMap:          undefined # Object[String, Pen]

  name: undefined # String

  # (String, Array[Pen], PlotOps, String, String, Boolean, Number, Number, Number, Number, () => (Unit | Stop), () => (Unit | Stop)) => Plot
  constructor: (@name, pens = [], @_ops, @xLabel, @yLabel, @isLegendEnabled = true, @isAutoplotting = true, @xMin = 0, @xMax = 10, @yMin = 0, @yMax = 10, @_setupThis = (->), @_updateThis = (->)) ->
    toName            = (p) -> p.name.toUpperCase()
    @_currentPenMaybe = maybe(pens[0])
    @_originalBounds  = [@xMin, @xMax, @yMin, @yMax]
    @_penMap          = pipeline(map(toName), flip(zip)(pens), toObject)(pens)
    @clear()

  # () => Unit
  clear: ->
    [@xMin, @xMax, @yMin, @yMax] = @_originalBounds
    @_ops.reset(this)
    @_resize()

    pens      = @getPens()
    deletePen = ((x) => delete @_penMap[x.name.toUpperCase()]; return)
    resetPen  = ((pen) => pen.reset(); @_ops.registerPen(pen); return)

    pipeline(filter((x) ->  x.isTemp), forEach(deletePen))(pens)
    pipeline(filter((x) -> not x.isTemp), forEach( resetPen))(pens)

    if fold(-> false)((cp) -> cp.isTemp)(@_currentPenMaybe)
      @_currentPenMaybe =
        maybe(
          if isEmpty(pens)
            @_penMap.DEFAULT = new Pen("DEFAULT", @_ops.makePenOps)
            @_penMap.DEFAULT
          else
            pens[0]
        )

    return

  # (String) => Unit
  createTemporaryPen: (name) ->
    @_currentPenMaybe = maybe(@_createAndReturnTemporaryPen(name))
    return

  # () => Unit
  disableAutoplotting: ->
    @isAutoplotting = false
    return

  # (Array[Number]) => Unit
  drawHistogramFrom: (list) ->
    @_withPen(
      (pen) =>
        if pen.getInterval() > 0
          pen.drawHistogramFrom(list, @xMin, @xMax)
          @_verifyHistogramSize(pen)
        else
          throw new Error("You cannot histogram with a plot-pen-interval of #{pen.interval}.")
    )
    return

  # () => Unit
  enableAutoplotting: ->
    @isAutoplotting = true
    return

  # () => Maybe[Pen]
  getCurrentPenMaybe: ->
    @_currentPenMaybe

  # () => Array[Pen]
  getPens: ->
    values(@_penMap)

  # (String) => Boolean
  hasPenWithName: (name) ->
    pipeline(@_getPenMaybeByName.bind(this), isSomething)(name)

  # (ExportedPlot) => Unit
  importState: ({ currentPenNameOrNull, @isAutoplotting, isLegendOpen: @isLegendEnabled, pens
                , @xMax, @xMin, @yMax, @yMin }) ->
    pens.forEach((pen) => @_createAndReturnTemporaryPen(pen.name).importState(pen))
    @_currentPenMaybe = @_getPenMaybeByName(currentPenNameOrNull)
    @_resize()
    return

  # () => Unit
  lowerPen: ->
    @_withPen((pen) -> pen.lower())
    return

  # (Number, Number) => Unit
  plotPoint: (x, y) ->
    @_withPen((pen) => pen.addXY(x, y); @_verifySize(pen))
    return

  # (Number) => Unit
  plotValue: (value) ->
    @_withPen((pen) => pen.addValue(value); @_verifySize(pen))
    return

  # () => Unit
  raisePen: ->
    @_withPen((pen) -> pen.raise())
    return

  # () => Unit
  resetPen: ->
    @_withPen((pen) -> pen.reset())
    return

  # (String) => Unit
  setCurrentPen: (name) ->
    penMaybe = @_getPenMaybeByName(name)
    if isSomething(penMaybe)
      @_currentPenMaybe = penMaybe
    else
      throw new Error("There is no pen named \"#{name}\" in the current plot")
    return

  # (Number) => Unit
  setHistogramBarCount: (num) ->
    @_withPen(
      (pen) =>
        if num >= 1
          interval = (@xMax - @xMin) / num
          pen.setInterval(interval)
        else
          throw new Error("You cannot make a histogram with #{num} bars.")
    )
    return

  # (Number|RGB) => Unit
  setPenColor: (color) ->
    @_withPen((pen) -> pen.setColor(color))
    return

  # (Number) => Unit
  setPenInterval: (num) ->
    @_withPen((pen) -> pen.setInterval(num))
    return

  # () => Unit
  setup: ->
    setupResult = @_setupThis()
    if not (setupResult instanceof Stop)
      @getPens().forEach((pen) -> pen.setup())
    return

  # (Number, Number) => Unit
  setXRange: (min, max) ->
    if min >= max
      throw new Error("the minimum must be less than the maximum, but #{min} is greater than or equal to #{max}")
    @xMin = min
    @xMax = max
    @_resize()
    return

  # (Number, Number) => Unit
  setYRange: (min, max) ->
    if min >= max
      throw new Error("the minimum must be less than the maximum, but #{min} is greater than or equal to #{max}")
    @yMin = min
    @yMax = max
    @_resize()
    return

  # () => Unit
  update: ->
    updateResult = @_updateThis()
    if not (updateResult instanceof Stop)
      @getPens().forEach((pen) -> pen.update())
    return

  # (DisplayMode) => Unit
  updateDisplayMode: (newMode) ->
    @_withPen((pen) -> pen.updateDisplayMode(newMode))
    return

  # (String) => (() => Unit) => Unit
  withTemporaryContext: (penName) -> (f) =>
    oldPenMaybe       = @_currentPenMaybe
    @_currentPenMaybe = @_getPenMaybeByName(penName)
    f()
    @_currentPenMaybe = oldPenMaybe
    return

  # (String) => Pen
  _createAndReturnTemporaryPen: (name) ->
    makeNew = =>
      pen = new Pen(name, @_ops.makePenOps, true)
      @_penMap[pen.name.toUpperCase()] = pen
      @_ops.registerPen(pen)
      pen
    pipeline(@_getPenMaybeByName.bind(this), fold(makeNew)(id))(name)

  # (String) => Pen
  _getPenMaybeByName: (name) ->
    lookup(name.toUpperCase())(@_penMap)

  # (Number, Number, Number, Number) => Unit
  _resize: ->
    @_ops.resize(@xMin, @xMax, @yMin, @yMax)

  # Histograms can only change the size of the plot by increasing the maximum Y value
  # (and only when autoplotting is on). --JAB (2/11/15)
  #
  # (Pen) => Unit
  _verifyHistogramSize: (pen) ->
    isWithinBounds = ({ x }) => x >= @xMin and x <= @xMax
    penYMax        = pipeline(filter(isWithinBounds), map((p) -> p.y), maxBy(id), fold(-> 0)(id))(pen.getPoints())
    if penYMax > @yMax and @isAutoplotting
      @yMax = penYMax
    @_resize()
    return

  # (Pen) => Unit
  _verifySize: (pen) ->

    if pen.bounds()?

      bounds        = pen.bounds()
      currentBounds = [@xMin, @xMax, @yMin, @yMax]
      [minXs, maxXs, minYs, maxYs] = zip(bounds)(currentBounds)

      bumpMin = ([newMin, currentMin], currentMax) ->
        if newMin < currentMin
          range         = currentMax - newMin
          expandedRange = range * 1.2
          newValue      = currentMax - expandedRange
          StrictMath.floor(newValue)
        else
          currentMin

      bumpMax = ([newMax, currentMax], currentMin) ->
        if newMax > currentMax
          range         = newMax - currentMin
          expandedRange = range * 1.2
          newValue      = currentMin + expandedRange
          StrictMath.ceil(newValue)
        else
          currentMax

      [newXMin, newXMax, newYMin, newYMax] = [bumpMin(minXs, @xMax), bumpMax(maxXs, @xMin), bumpMin(minYs, @yMax), bumpMax(maxYs, @yMin)]

      # If bounds extended, we must resize, regardless of whether or not autoplotting is enabled, because some
      # libraries force autoscaling, but we only _expand_ the boundaries when autoplotting. --JAB (10/10/14)
      if newXMin isnt @xMin or newXMax isnt @xMax or newYMin isnt @yMin or newYMax isnt @yMax
        if @isAutoplotting
          @xMin = newXMin
          @xMax = newXMax
          @yMin = newYMin
          @yMax = newYMax
        @_resize()

    return

  # [T] @ ((Pen) => T) => T
  _withPen: (f) ->
    fold(-> throw new Error("Plot '#{@name}' has no pens!"))(f)(@_currentPenMaybe)
