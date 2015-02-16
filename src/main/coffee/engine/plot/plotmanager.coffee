# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ SuperArray } = require('super/superarray')
SuperObject    = require('super/superobject')
Type           = require('tortoise/util/typechecker')

module.exports = class PlotManager

  _currentPlot: undefined # Plot
  _plotMap:     undefined # Object[String, Plot]

  # (Array[Plot]) => PlotManager
  constructor: (plots) ->
    @_currentPlot = plots[plots.length - 1]
    @_plotMap     = SuperArray(plots.map((p) -> p.name.toUpperCase())).zipToObject(plots)

  # () => Unit
  clearAllPlots: ->
    SuperObject(@_plotMap).values().forEach((plot) -> plot.clear())
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
        numbers = SuperArray(list).filter((x) -> Type(x).isNumber()).value()
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
    @_withPlot(
      (plot) ->
        switch num
          when 0 then plot.useLinePenMode()
          when 1 then plot.useBarPenMode()
          when 2 then plot.usePointPenMode()
          else throw new Error("#{num} is not a valid plot pen mode (valid modes are 0, 1, and 2)")
    )
    return

  # () => Unit
  setupPlots: =>
    SuperObject(@_plotMap).values().forEach((plot) -> plot.setup())
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
    SuperObject(@_plotMap).values().forEach((plot) -> plot.update())
    return

  # (String, String) => (() => Unit) => Unit
  withTemporaryContext: (plotName, penName) -> (f) =>
    oldPlot       = @_currentPlot
    tempPlot      = @_plotMap[plotName.toUpperCase()]
    @_currentPlot = tempPlot
    if penName?
      tempPlot.withTemporaryContext(penName)(f)
    else
      f()
    @_currentPlot = oldPlot
    return

  # [T] @ ((Plot) => T) => T
  _withPlot: (f) ->
    if @_currentPlot?
      f(@_currentPlot)
    else
      throw new Error("There is no current plot. Please select a current plot using the set-current-plot command.")
