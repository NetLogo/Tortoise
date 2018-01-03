# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ filter, forEach, map, toObject, zip } = require('brazierjs/array')
{ flip, pipeline }                      = require('brazierjs/function')
{ values }                              = require('brazierjs/object')
{ isNumber }                            = require('brazierjs/type')

module.exports = class PlotManager

  _currentPlot: undefined # Plot
  _plotMap:     undefined # Object[String, Plot]

  # (Array[Plot]) => PlotManager
  constructor: (plots) ->
    toName        = (p) -> p.name.toUpperCase()
    @_currentPlot = plots[plots.length - 1]
    @_plotMap     = pipeline(map(toName), flip(zip)(plots), toObject)(plots)

  # () => Unit
  clearAllPlots: ->
    @_forAllPlots((plot) -> plot.clear())
    return

  # () => Unit
  clearPlot: ->
    @_withPlot((plot) -> plot.clear())
    return

  # (String) => Unit
  createTemporaryPen: (name) ->
    @_withPlot((plot) -> plot.createTemporaryPen(name))
    return

  # () => Unit
  disableAutoplotting: ->
    @_withPlot((plot) -> plot.disableAutoplotting())
    return

  # (Array[Any]) => Unit
  drawHistogramFrom: (list) ->
    @_withPlot(
      (plot) ->
        numbers = filter(isNumber)(list)
        plot.drawHistogramFrom(numbers)
    )
    return

  # () => Unit
  enableAutoplotting: ->
    @_withPlot((plot) -> plot.enableAutoplotting())
    return

  # () => String
  getPlotName: ->
    @_withPlot((plot) -> plot.name)

  # () => Number
  getPlotXMax: ->
    @_withPlot((plot) -> plot.xMax)

  # () => Number
  getPlotXMin: ->
    @_withPlot((plot) -> plot.xMin)

  # () => Number
  getPlotYMax: ->
    @_withPlot((plot) -> plot.yMax)

  # () => Number
  getPlotYMin: ->
    @_withPlot((plot) -> plot.yMin)

  # (String) => Boolean
  hasPenWithName: (name) ->
    @_withPlot((plot) -> plot.hasPenWithName(name))

  # () => Boolean
  isAutoplotting: ->
    @_withPlot((plot) -> plot.isAutoplotting)

  # () => Unit
  lowerPen: ->
    @_withPlot((plot) -> plot.lowerPen())
    return

  plotPoint: (x, y) ->
    @_withPlot((plot) -> plot.plotPoint(x, y))
    return

  # (Number) => Unit
  plotValue: (value) ->
    @_withPlot((plot) -> plot.plotValue(value))
    return

  # () => Unit
  raisePen: ->
    @_withPlot((plot) -> plot.raisePen())
    return

  # () => Unit
  resetPen: ->
    @_withPlot((plot) -> plot.resetPen())
    return

  # (String) => Unit
  setCurrentPen: (name) ->
    @_withPlot((plot) -> plot.setCurrentPen(name))
    return

  # (String) => Unit
  setCurrentPlot: (name) ->
    plot = @_plotMap[name.toUpperCase()]
    if plot?
      @_currentPlot = plot
    else
      throw new Error("no such plot: \"#{name}\"")
    return

  # (Number) => Unit
  setHistogramBarCount: (num) ->
    if num > 0
      @_withPlot((plot) -> plot.setHistogramBarCount(num))
    else
      throw new Error("You cannot make a histogram with #{num} bars.")
    return

  # (Number) => Unit
  setPenColor: (color) ->
    @_withPlot((plot) -> plot.setPenColor(color))
    return

  # (Number) => Unit
  setPenInterval: (color) ->
    @_withPlot((plot) -> plot.setPenInterval(color))
    return

  # (Number) => Unit
  setPenMode: (num) ->
    @_withPlot((plot) -> plot.updateDisplayMode(plot.displayModeFromNumber(num)))
    return

  # () => Unit
  setupPlots: =>
    @_forAllPlots((plot) -> plot.setup())
    return

  # (Number, Number) => Unit
  setXRange: (min, max) ->
    @_withPlot((plot) -> plot.setXRange(min, max))
    return

  # (Number, Number) => Unit
  setYRange: (min, max) ->
    @_withPlot((plot) -> plot.setYRange(min, max))
    return

  # () => Unit
  updatePlots: =>
    @_forAllPlots((plot) -> plot.update())
    return

  # [T] @ (String, String) => (() => T) => T
  withTemporaryContext: (plotName, penName) -> (f) =>
    oldPlot       = @_currentPlot
    tempPlot      = @_plotMap[plotName.toUpperCase()]
    @_currentPlot = tempPlot
    result =
      if penName?
        tempPlot.withTemporaryContext(penName)(f)
      else
        f()
    @_currentPlot = oldPlot
    result

  # ((Plot) => Unit) => Unit
  _forAllPlots: (f) ->
    pipeline(values, forEach(f))(@_plotMap)
    return

  # [T] @ ((Plot) => T) => T
  _withPlot: (f) ->
    if @_currentPlot?
      f(@_currentPlot)
    else
      throw new Error("There is no current plot. Please select a current plot using the set-current-plot command.")
