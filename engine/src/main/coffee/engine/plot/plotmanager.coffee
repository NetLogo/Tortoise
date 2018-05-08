# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ DisplayMode: { displayModeFromNum } } = require('./pen')

{ filter, forEach, map, toObject, zip }               = require('brazierjs/array')
{ flip, pipeline }                                    = require('brazierjs/function')
{ flatMap: flatMapMaybe, fold, map: mapMaybe, maybe } = require('brazierjs/maybe')
{ values }                                            = require('brazierjs/object')
{ isNumber }                                          = require('brazierjs/type')

module.exports = class PlotManager

  _currentPlotMaybe: undefined # Maybe[Plot]
  _plotMap:          undefined # Object[String, Plot]

  # (Array[Plot]) => PlotManager
  constructor: (plots) ->
    toName             = (p) -> p.name.toUpperCase()
    @_currentPlotMaybe = maybe(plots[plots.length - 1])
    @_plotMap          = pipeline(map(toName), flip(zip)(plots), toObject)(plots)

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

  # () => Maybe[Plot]
  getCurrentPlotMaybe: ->
    @_currentPlotMaybe

  # () => String
  getPlotName: ->
    @_withPlot((plot) -> plot.name)

  # () => Array[Plot]
  getPlots: ->
    values(@_plotMap)

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

  # (ExportedPlotManager) => Unit
  importState: ({ currentPlotNameOrNull, plots }) ->
    plots.forEach((plot) => @_plotMap[plot.name.toUpperCase()]?.importState(plot))
    @_currentPlotMaybe = flatMapMaybe((name) => maybe(@_plotMap[name.toUpperCase()]))(maybe(currentPlotNameOrNull))
    return

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
      @_currentPlotMaybe = maybe(plot)
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
    @_withPlot((plot) -> plot.updateDisplayMode(displayModeFromNum(num)))
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
    oldPlotMaybe       = @_currentPlotMaybe
    tempPlotMaybe      = maybe(@_plotMap[plotName.toUpperCase()])
    @_currentPlotMaybe = tempPlotMaybe
    result =
      if penName?
        mapMaybe((tempPlot) -> tempPlot.withTemporaryContext(penName)(f))(tempPlotMaybe)
      else
        f()
    @_currentPlotMaybe = oldPlotMaybe
    result

  # ((Plot) => Unit) => Unit
  _forAllPlots: (f) ->
    pipeline(values, forEach(f))(@_plotMap)
    return

  # [T] @ ((Plot) => T) => T
  _withPlot: (f) ->
    error = new Error("There is no current plot. Please select a current plot using the set-current-plot command.")
    fold(-> throw error)(f)(@_currentPlotMaybe)
