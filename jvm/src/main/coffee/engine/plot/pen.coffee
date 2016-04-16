# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath = require('shim/strictmath')

{ countBy, filter, forEach, map } = require('brazierjs/array')
{ id, pipeline }                  = require('brazierjs/function')
{ pairs }                         = require('brazierjs/object')
{ isNumber }                      = require('brazierjs/type')

# data PenMode =
Up   = {}
Down = {}

module.exports.PenMode = {
  Up,
  Down
}

# data DisplayMode =
Line  = {}
Bar   = {}
Point = {}

module.exports.DisplayMode = {
  Line,
  Bar,
  Point
}

class PlotPoint
  # (Number, Number, PenMode, Int) => PlotPoint
  constructor: (@x, @y, @penMode, @color) ->

class Counter

  # Who's at first?  Me, ya punk!  --JAB (10/15/14)
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

  # (Number) => Unit
  addValue: (y) ->
    @_addPoint(@_state.nextX(), y)
    return

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
    determineBucket = (x) -> StrictMath.round((x / interval) * (1 + 3.2e-15)) # See 'Histogram.scala' in Headless for explanation --JAB (10/21/15)
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

  # () => DisplayMode
  getDisplayMode: ->
    @_state.displayMode

  # () => Number
  getInterval: ->
    @_state.interval

  # () => Array[PlotPoint]
  getPoints: ->
    @_points

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

  # (Number) => Unit
  setColor: (color) ->
    @_state.color = color
    @_ops.updateColor(color)
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

  # () => Unit
  useBarMode: ->
    @_updateDisplayMode(Bar)
    return

  # () => Unit
  useLineMode: ->
    @_updateDisplayMode(Line)
    return

  # () => Unit
  usePointMode: ->
    @_updateDisplayMode(Point)
    return

  # (Number, Number) => Unit
  _addPoint: (x, y) ->
    @_points.push(new PlotPoint(x, y, @_state.mode, @_state.color))
    @_updateBounds(x, y)
    @_ops.addPoint(x, y)
    return

    # (x, y) => Unit
  _updateBounds: (x, y) ->
    @_bounds =
      if @_bounds?
        [minX, maxX, minY, maxY] = @_bounds
        [Math.min(minX, x), Math.max(maxX, x), Math.min(minY, y), Math.max(maxY, y)]
      else
        [x, x, y, y]

  _updateDisplayMode: (newMode) ->
    @_state.displayMode = newMode
    @_ops.updateMode(newMode)
    return
