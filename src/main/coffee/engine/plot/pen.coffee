# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_    = require('lodash')
Type = require('tortoise/util/typechecker')

{ StopInterrupt: Stop } = require('tortoise/util/exception')

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

  _count:   undefined # Number
  _atFirst: undefined # Number   Who's at first?  Me, ya punk!  --JAB (10/15/14)

  constructor: ->
    @_count   = 0
    @_atFirst = true

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

  # () => Number
  nextX: ->
    @_counter.next(@interval)

  # () => State
  partiallyReset: ->
    new State(@color, @interval, @displayMode, Down)

  resetCounter: ->
    @_counter = new Counter()

module.exports.Pen = class Pen

  _bounds: undefined # (Number, Number, Number, Number)
  _ops:    undefined # PenOps
  _points: undefined # Array[PlotPoint]
  _state:  undefined # State

  # (String, (Pen) => PenOps, Boolean, State, () => Unit, () => Unit) => Pen
  constructor: (@name, genOps, @isTemp = false, @_defaultState = new State(), @_setupThis = (->), @_updateThis = (->)) ->
    @_ops = genOps(this)
    @reset()

  # (Number, Number) => Unit
  addPoint: (x, y) ->
    @_points.push(new PlotPoint(x, y, @_state.mode, @_state.color))
    @_updateBounds(x, y)
    @_ops.addPoint(x, y)
    return

  # (Number) => Unit
  addValue: (y) ->
    @addPoint(@_state.nextX(), y)
    return

  # () => (Number, Number, Number, Number)
  bounds: ->
    @_bounds

  # (Array[Number]) => Unit
  drawHistogramFrom: (ys) ->
    @reset(true)
    nums = ys.filter((y) -> Type(y).isNumber())
    _(nums).countBy().forEach((n, key) => @addPoint(Number(key), n); return).value()
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
    return

  # P.S. I find it _hilarious_ that this can take '0' and negative numbers --JAB (9/22/14)
  # (Number) => Unit
  setInterval: (interval) ->
    @_state.interval = interval
    return

  # () => Unit
  setup: () ->
    try @_setupThis()
    catch e
      if not (e instanceof Stop)
        throw e
    return

  # () => Unit
  update: () ->
    try @_updateThis()
    catch e
      if not (e instanceof Stop)
        throw e
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
