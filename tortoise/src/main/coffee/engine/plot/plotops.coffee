# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('../core/colormodel')

class PenOps

  addPoint:   undefined # (Number, Number) => Unit
  reset:      undefined # () => Unit
  updateMode: undefined # (Pen.Mode) => Unit

  constructor: (plottingOps, pen) ->
    @addPoint   = plottingOps.addPoint(pen)
    @reset      = plottingOps.resetPen(pen)
    @updateMode = plottingOps.updatePenMode(pen)

module.exports = class PlottingOps

  # ((Number, Number, Number, Number) => Unit, (Plot) => Unit, (Pen) => Unit, (Pen) => () => Unit, (Pen) => (Number, Number) => Unit, (Pen) => (Pen.DisplayMode) => Unit) => PlotOps
  constructor: (@resize, @reset, @registerPen, @resetPen, @addPoint, @updatePenMode) ->

  # (Number) => String
  colorToRGBString: (color) ->
    [r, g, b] = ColorModel.colorToRGB(color)
    "rgb(#{r}, #{g}, #{b})"

  # (Pen) => PenOps
  makePenOps: (pen) =>
    new PenOps(this, pen)
