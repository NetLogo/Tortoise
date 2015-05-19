# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_          = require('lodash')
{ Pen }    = require('./pen')
StrictMath = require('shim/strictmath')

{ StopInterrupt: Stop } = require('util/exception')

module.exports = class Plot

  _currentPen:     undefined # Pen
  _originalBounds: undefined # (Number, Number, Number, Number)
  _penMap:         undefined # Object[String, Pen]

  isAutoplotting: undefined # Boolean
  name:           undefined # String

  # (String, Array[Pen], PlotOps, String, String, Boolean, Number, Number, Number, Number, () => Unit, () => Unit) => Plot
  constructor: (@name, pens = [], @_ops, @xLabel, @yLabel, @isLegendEnabled = true, @xMin = 0, @xMax = 10, @yMin = 0, @yMax = 10, @_setupThis = (->), @_updateThis = (->)) ->
    @isAutoplotting  = true
    @_currentPen     = pens[0]
    @_originalBounds = [@xMin, @xMax, @yMin, @yMax]
    @_penMap         = _(pens).map((p) -> p.name.toUpperCase()).zipObject(pens).value()
    @clear()

  # () => Unit
  clear: ->
    [@xMin, @xMax, @yMin, @yMax] = @_originalBounds
    @_ops.reset(this)
    @_resize()

    _(@_penMap).filter((x) -> x.isTemp).forEach((x) => delete @_penMap[x.name.toUpperCase()]; return).value()
    _(@_penMap).forEach((pen) => pen.reset(); @_ops.registerPen(pen); return).value()

    if @_currentPen?.isTemp
      @_currentPen =
        if _(@_penMap).size() is 0
          @_penMap.DEFAULT = new Pen("DEFAULT", @_ops.makePenOps)
          @_penMap.DEFAULT
        else
          _(@_penMap).toArray().value()[0]

    return

  # (String) => Unit
  createTemporaryPen: (name) ->
    existingPen = @_getPenByName(name)
    @_currentPen =
      if existingPen?
        existingPen
      else
        pen = new Pen(name, @_ops.makePenOps, true)
        @_penMap[pen.name.toUpperCase()] = pen
        @_ops.registerPen(pen)
        pen
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
          pen.drawHistogramFrom(list)
          @_verifyHistogramSize(pen)
        else
          throw new Error("You cannot histogram with a plot-pen-interval of #{pen.interval}.")
    )
    return

  # () => Unit
  enableAutoplotting: ->
    @isAutoplotting = true
    return

  # (String) => Boolean
  hasPenWithName: (name) ->
    @_getPenByName(name)?

  # () => Unit
  lowerPen: ->
    @_withPen((pen) -> pen.lower())
    return

  # (Number, Number) => Unit
  plotPoint: (x, y) ->
    @_withPen((pen) => pen.addPoint(x, y); @_verifySize(pen))
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
    @_withPen((pen) => pen.reset())
    return

  # (String) => Unit
  setCurrentPen: (name) ->
    pen = @_getPenByName(name)
    if pen?
      @_currentPen = pen
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

  # (Number) => Unit
  setPenColor: (color) ->
    @_withPen((pen) -> pen.setColor(color))
    return

  # (Number) => Unit
  setPenInterval: (num) ->
    @_withPen((pen) -> pen.setInterval(num))
    return

  # () => Unit
  setup: ->
    try @_setupThis()
    catch e
      if not (e instanceof Stop)
        throw e
    _(@_penMap).forEach((pen) -> pen.setup(); return).value()
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
    try @_updateThis()
    catch e
      if not (e instanceof Stop)
        throw e
    _(@_penMap).forEach((pen) -> pen.update(); return).value()
    return

  # () => Unit
  useBarPenMode: ->
    @_withPen((pen) => pen.useBarMode())
    return

  # () => Unit
  useLinePenMode: ->
    @_withPen((pen) => pen.useLineMode())
    return

  # () => Unit
  usePointPenMode: ->
    @_withPen((pen) => pen.usePointMode())
    return

  # (String) => (() => Unit) => Unit
  withTemporaryContext: (penName) -> (f) =>
    oldPen       = @_currentPen
    @_currentPen = @_getPenByName(penName)
    f()
    @_currentPlot = oldPen
    return

  # (String) => Pen
  _getPenByName: (name) ->
    @_penMap[name.toUpperCase()]

  # (Number, Number, Number, Number) => Unit
  _resize: ->
    @_ops.resize(@xMin, @xMax, @yMin, @yMax)

  # Histograms can only change the size of the plot by increasing the maximum Y value
  # (and only when autoplotting is on). --JAB (2/11/15)
  #
  # (Pen) => Unit
  _verifyHistogramSize: (pen) ->
    penYMax = _(pen.getPoints()).filter(({ x }) => x >= @xMin and x <= @xMax).max((p) -> p.y).y
    if penYMax > @yMax and @isAutoplotting
      @yMax = penYMax
    @_resize()
    return

  # (Pen) => Unit
  _verifySize: (pen) ->

    if pen.bounds()?

      bounds        = pen.bounds()
      currentBounds = [@xMin, @xMax, @yMin, @yMax]
      [minXs, maxXs, minYs, maxYs] = _(bounds).zip(currentBounds).value()

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
    if @_currentPen?
      f(@_currentPen)
    else
      throw new Error("Plot '#{@name}' has no pens!")
