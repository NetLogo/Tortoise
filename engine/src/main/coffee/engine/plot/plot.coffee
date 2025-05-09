# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ Pen }    = require('./pen')
StrictMath = require('shim/strictmath')

{ filter, forEach, isEmpty, map, maxBy, toObject, zip } = require('brazierjs/array')
{ flip, id, pipeline }                                  = require('brazierjs/function')
{ flatMap: flatMapMaybe, fold, isSomething, maybe }     = require('brazierjs/maybe')
{ lookup, values }                                      = require('brazierjs/object')

{ exceptionFactory: exceptions } = require('util/exception')
{ StopInterrupt }                = require('util/interrupts')

module.exports = class Plot

  _currentPenMaybe: undefined # Maybe[Pen]
  _originalBounds:  undefined # (Number, Number, Number, Number)
  _penMap:          undefined # Object[String, Pen]

  name: undefined # String

  # (String, Array[Pen], PlotOps, String, String, Boolean, Boolean, Boolean,
  #    Number, Number, Number, Number, () => (Unit | StopInterrupt), () => (Unit | StopInterrupt)) => Plot
  constructor: (@name, pens = [], @_ops, @xLabel, @yLabel, @isLegendEnabled = true, @isAutoPlotX = true, @isAutoPlotY = true,
    @xMin = 0, @xMax = 10, @yMin = 0, @yMax = 10, @_setupThis = (->), @_updateThis = (->)) ->

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

    if not @_currentPenMaybe? or fold(-> false)((cp) -> cp.isTemp)(@_currentPenMaybe)
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
    @isAutoPlotX = false
    @isAutoPlotY = false
    return

  # () => Unit
  disableAutoplotX: ->
    @isAutoPlotX = false
    return

  # () => Unit
  disableAutoplotY: ->
    @isAutoPlotY = false
    return

  # (Array[Number]) => Unit
  drawHistogramFrom: (list) ->
    @_withPen(
      (pen) =>
        if pen.getInterval() > 0
          pen.drawHistogramFrom(list, @xMin, @xMax)
          @_verifyHistogramSize(pen)
        else
          throw exceptions.runtime("You cannot histogram with a plot-pen-interval of #{pen.interval}.", "histogram")
    )
    return

  # () => Unit
  enableAutoplotting: ->
    @isAutoPlotX = true
    @isAutoPlotY = true
    return

  # () => Unit
  enableAutoplotX: ->
    @isAutoPlotX = true
    return

  # () => Unit
  enableAutoplotY: ->
    @isAutoPlotY = true
    return

  # () => Boolean
  isAutoPlotting: ->
    @isAutoPlotX and @isAutoPlotY

  # () => Maybe[Pen]
  getCurrentPenMaybe: ->
    @_currentPenMaybe

  # () => Array[Pen]
  getPens: ->
    values(@_penMap)

  # (String) => Boolean
  hasPenWithName: (name) ->
    pipeline(@_getPenMaybeByName, isSomething)(name)

  # (ExportedPlot) => Unit
  importState: ({ currentPenNameOrNull, @isAutoPlotX, @isAutoPlotY, isLegendOpen: @isLegendEnabled, pens
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
    @_withPen( (pen) =>
      pen.addXY(x, y)
      @_verifySize(x, y)
    )
    return

  # (Number) => Unit
  plotValue: (value) ->
    @_withPen( (pen) =>
      x = pen.addValue(value)
      @_verifySize(x, value)
    )
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
      throw exceptions.runtime("There is no pen named \"#{name}\" in the current plot", "set-current-plot-pen")
    return

  # (Number) => Unit
  setHistogramBarCount: (num) ->
    @_withPen(
      (pen) =>
        if num >= 1
          interval = (@xMax - @xMin) / num
          pen.setInterval(interval)
        else
          throw exceptions.runtime("You cannot make a histogram with #{num} bars.", "set-histogram-num-bars")
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
    if not (setupResult is StopInterrupt)
      @getPens().forEach((pen) -> pen.setup())
    return

  # (Number, Number) => Unit
  setXRange: (min, max) ->
    if min >= max
      throw exceptions.runtime("the minimum must be less than the maximum, but #{min} is greater than or equal to #{max}", "set-plot-x-range")
    @xMin = min
    @xMax = max
    @_resize()
    return

  # (Number, Number) => Unit
  setYRange: (min, max) ->
    if min >= max
      throw exceptions.runtime("the minimum must be less than the maximum, but #{min} is greater than or equal to #{max}", "set-plot-y-range")
    @yMin = min
    @yMax = max
    @_resize()
    return

  # () => Unit
  update: ->
    updateResult = @_updateThis()
    if not (updateResult is StopInterrupt)
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
    pipeline(@_getPenMaybeByName, fold(makeNew)(id))(name)

  # (String) => Maybe[Pen]
  _getPenMaybeByName: (name) =>
    flatMapMaybe((name) => lookup(name.toUpperCase())(@_penMap))(maybe(name))

  # (Number, Number, Number, Number) => Unit
  _resize: ->
    @_ops.resize(@xMin, @xMax, @yMin, @yMax)

  # The below functions `_prettyRange()` and `_expandRange()` are copied directly from the NetLogo desktop versions.
  # More comments on them are in that repo.  -Jeremy B May 2025

  # (Number) -> Number
  _prettyRange: (range) ->
    tmag = Math.pow(10, Math.floor(Math.log10(range)) - 1) * 2
    Math.ceil(range / tmag) * tmag

  # (Number, Number, Number) -> Number
  _expandRange: (min, max, newValue) ->
    shift = -min
    tempMin = 0
    tempMax = max + shift
    tempValue = newValue + shift
    if tempValue < 0
      tempRange = tempMax - tempValue
      newRange = @_prettyRange(tempRange)
      newMin = (tempMax - newRange) - shift
      newMin
    else
      tempRange = tempValue - tempMin
      newRange  = @_prettyRange(tempRange)
      newMax    = (newRange + tempMin) - shift
      newMax

  # Histograms can only change the size of the plot by increasing the maximum Y value
  # (and only when autoplotting is on). --JAB (2/11/15)
  #
  # (Pen) => Unit
  _verifyHistogramSize: (pen) ->
    isWithinBounds = ({ x }) => x >= @xMin and x <= @xMax
    if @isAutoPlotY
      penYMax = pipeline(filter(isWithinBounds), map((p) -> p.y), maxBy(id), fold(-> 0)(id))(pen.getPoints())
      if penYMax > @yMax
        @yMax = @_expandRange(@yMin, @yMax, penYMax)
    @_resize()
    return

  # (Number, Number) => Unit
  _verifySize: (x, y) ->

    bumpMin = (newMin, currentMin, currentMax) =>
      if newMin < currentMin
        @_expandRange(currentMin, currentMax, newMin)
      else
        currentMin

    bumpMax = (newMax, currentMin, currentMax) =>
      if newMax > currentMax
        @_expandRange(currentMin, currentMax, newMax)
      else
        currentMax

    newXMin = bumpMin(x, @xMin, @xMax)
    newXMax = bumpMax(x, @xMin, @xMax)
    newYMin = bumpMin(y, @yMin, @yMax)
    newYMax = bumpMax(y, @yMin, @yMax)

    # If bounds extended, we must resize, regardless of whether or not autoplotting is enabled, because some
    # libraries force autoscaling, but we only _expand_ the boundaries when autoplotting. --JAB (10/10/14)
    if newXMin isnt @xMin or newXMax isnt @xMax or newYMin isnt @yMin or newYMax isnt @yMax
      if @isAutoPlotX
        @xMin = newXMin
        @xMax = newXMax

      if @isAutoPlotY
        @yMin = newYMin
        @yMax = newYMax

      @_resize()

    return

  # [T] @ ((Pen) => T) => T
  _withPen: (f) ->
    fold(=> throw exceptions.runtime("Plot '#{@name}' has no pens!", "plot"))(f)(@_currentPenMaybe)
