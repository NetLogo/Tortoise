# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath = require('shim/strictmath')

{ countBy, filter, forEach, map } = require('brazierjs/array')
{ id, pipeline }                  = require('brazierjs/function')
{ pairs }                         = require('brazierjs/object')
{ isNumber }                      = require('brazierjs/type')
ColorModel                        = require('engine/core/colormodel')

{ exceptionFactory: exceptions } = require('util/exception')

# data PenMode =
Up   = {}
Down = {}

module.exports.PenMode = {
  Up,
  Down,
  penModeToBool: (penDown) -> if penDown is Up then false else true
}

# data DisplayMode =
Line  = {}
Bar   = {}
Point = {}

# (Number) => DisplayMode
displayModeFromNum = (num) ->
  switch num
    when 0 then Line
    when 1 then Bar
    when 2 then Point
    else        throw exceptions.internal("Pen display mode expected `0` (line), `1` (bar), or `2` (point), but got `#{num}`")

# (DisplayMode) => Number
displayModeToNum = (mode) ->
  switch mode
    when Line  then 0
    when Bar   then 1
    when Point then 2
    else           throw exceptions.internal("Invalid display mode: #{mode}")

# (String) => DisplayMode
displayModeFromString = (num) ->
  switch num
    when 'line'  then Line
    when 'bar'   then Bar
    when 'point' then Point
    else         throw exceptions.internal("Pen display mode expected 'line', 'bar', or 'point', but got `#{num}`")

# (DisplayMode) => String
displayModeToString = (mode) ->
  switch mode
    when Line  then 'line'
    when Bar   then 'bar'
    when Point then 'point'
    else           throw exceptions.internal("Invalid display mode: #{mode}")

module.exports.DisplayMode = {
  Line
, Bar
, Point
, displayModeFromNum
, displayModeFromString
, displayModeToNum
, displayModeToString
}

class PlotPoint
  # (Number, Number, PenMode, Number) => PlotPoint
  constructor: (@x, @y, @penMode, @color) ->

class Counter

  # Who's at first?  Me, ya punk!  --JAB (10/15/14)
  # I don't even know what that means....  --JAB (12/10/17)
  # (Number, Boolean) => Counter
  constructor: (@_count = 0, @_atFirst = true) ->

  # (Number) => Number
  next: (interval) ->
    if @_atFirst
      @_atFirst = false
      0
    else
      @_count += interval

module.exports.State = class State

  _counter: undefined # Counter

  # (Number, Number, DisplayMode, PenMode, Boolean) => State
  constructor: (@color = 0, @interval = 1, @displayMode = Line, @mode = Down) ->
    @resetCounter()

  # () => State
  clone: ->
    new State(@color, @interval, @displayMode, @mode)

  # (Number) => Unit
  leapCounterTo: (x) ->
    @_counter = new Counter(x, false)
    return

  # () => Number
  getPenX: ->
    @_counter._count

  # () => Number
  nextX: ->
    @_counter.next(@interval)

  # () => State
  partiallyReset: ->
    new State(@color, @interval, @displayMode, Down)

  # () => Unit
  resetCounter: ->
    @_counter = new Counter()
    return

module.exports.Pen = class Pen

  _bounds: undefined # (Number, Number, Number, Number)
  _ops:    undefined # PenOps
  _points: undefined # Array[PlotPoint]
  _state:  undefined # State

  # (String, (Pen) => PenOps, Boolean, State, () => (Unit|Stop), () => (Unit|Stop)) => Pen
  constructor: (@name, genOps, @isTemp = false, @_defaultState = new State(), @_setupThis = (->), @_updateThis = (->)) ->
    @_ops = genOps(this)
    @reset()

  # (Number) => Number
  addValue: (y) ->
    nextX = @_state.nextX()
    @_addPoint(nextX, y)
    nextX

  # (Number, Number) => Unit
  addXY: (x, y) ->
    @_addPoint(x, y)
    @_state.leapCounterTo(x)
    return

  # () => (Number, Number, Number, Number)
  bounds: ->
    @_bounds

  # (Array[Number], Number, Number) => Unit
  drawHistogramFrom: (ys, xMin, xMax) ->

    @reset(true)

    interval        = @getInterval()
    isValid         = (x) => (xMin / interval) <= x <= (xMax / interval)
    determineBucket = (x) -> StrictMath.floor((x / interval) * (1 + 3.2e-15)) # See 'Histogram.scala' in Headless for explanation --JAB (10/21/15)
    plotBucket      = (([bucketNum, count]) => @addXY(Number(bucketNum) * interval, count); return)

    pipeline(filter(isNumber)
           , map(determineBucket)
           , filter(isValid)
           , countBy(id)
           , pairs
           , forEach(plotBucket)
           )(ys)

    return

  # () => Number
  getColor: ->
    @_state.color

  # () => PenMode
  getPenMode: ->
    @_state.mode

  # () => DisplayMode
  getDisplayMode: ->
    @_state.displayMode

  # () => Number
  getInterval: ->
    @_state.interval

  # () => Number
  getPenX: ->
    @_state.getPenX()

  # () => Array[PlotPoint]
  getPoints: ->
    @_points

  # (ExportedPen) => Unit
  importState: ({ color: penColor, interval, mode, isPenDown, points, x: penX }) ->

    points.forEach(
      ({ color, isPenDown: isPointVisible, x, y }) =>
        penMode = if isPointVisible
          @lower()
          Down
        else
          @raise()
          Up
        @_points.push(new PlotPoint(x, y, penMode, color))
        @_ops.addPoint(x, y)
        return
    )

    xs = @_points.map((p) -> p.x)
    ys = @_points.map((p) -> p.y)
    @_bounds = [Math.min(xs...), Math.max(xs...), Math.min(ys...), Math.max(ys...)]

    if isPenDown
      @lower()
    else
      @raise()

    @setColor(penColor)
    @setInterval(interval)
    @_state.leapCounterTo(penX)
    @updateDisplayMode(displayModeFromString(mode))

    return

  # () => Unit
  lower: ->
    @_state.mode = Down
    return

  # () => Unit
  raise: ->
    @_state.mode = Up
    return

  # (Boolean) => Unit
  reset: (isSoftResetting = false) ->
    @_bounds = undefined
    @_state  = if @_state? and (isSoftResetting or @isTemp) then @_state.partiallyReset() else @_defaultState.clone()
    @_points = []
    @_ops.reset()
    @_ops.updateMode(@_state.displayMode)
    return

  # (Number|RGB) => Unit
  setColor: (color) ->
    trueColor = if isNumber(color) then color else ColorModel.nearestColorNumberOfRGB(color...)
    @_state.color = trueColor
    @_ops.updateColor(trueColor)
    return

  # P.S. I find it _hilarious_ that this can take '0' and negative numbers --JAB (9/22/14)
  # (Number) => Unit
  setInterval: (interval) ->
    @_state.interval = interval
    return

  # () => Unit
  setup: () ->
    @_setupThis()
    return

  # () => Unit
  update: () ->
    @_updateThis()
    return

  # (DisplayMode) => Unit
  updateDisplayMode: (newMode) ->
    @_state.displayMode = newMode
    @_ops.updateMode(newMode)
    return

  # (Number, Number) => Unit
  _addPoint: (x, y) ->
    @_points.push(new PlotPoint(x, y, @_state.mode, @_state.color))
    @_updateBounds(x, y)
    @_ops.addPoint(x, y)
    return

  # (Number, Number) => Unit
  _updateBounds: (x, y) ->
    @_bounds =
      if @_bounds?
        [minX, maxX, minY, maxY] = @_bounds
        [Math.min(minX, x), Math.max(maxX, x), Math.min(minY, y), Math.max(maxY, y)]
      else
        [x, x, y, y]
    return
