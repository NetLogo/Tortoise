# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('engine/core/colormodel')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')

# (Number) => Unit
setPcolor = (color) ->
  wrappedColor = ColorModel.wrapColor(color)
  if @_pcolor isnt wrappedColor
    @_pcolor = wrappedColor
    @_genVarUpdate("pcolor")
    if wrappedColor isnt 0
      @_declareNonBlackPatch()
  return

# (String) => Unit
setPlabel = (label) ->
  wasEmpty = @_plabel is ""
  isEmpty  = label is ""

  @_plabel = label
  @_genVarUpdate("plabel")

  if isEmpty and not wasEmpty
    @_decrementPatchLabelCount()
  else if not isEmpty and wasEmpty
    @_incrementPatchLabelCount()

  return

# (Number) => Unit
setPlabelColor = (color) ->
  @_plabelcolor = ColorModel.wrapColor(color)
  @_genVarUpdate("plabel-color")
  return

Setters = {
  setPcolor
  setPlabel
  setPlabelColor
}

VariableSpecs = [
  new ImmutableVariableSpec('id',    -> @id)
, new ImmutableVariableSpec('pxcor', -> @pxcor)
, new ImmutableVariableSpec('pycor', -> @pycor)
, new MutableVariableSpec('pcolor',       (-> @_pcolor),      setPcolor)
, new MutableVariableSpec('plabel',       (-> @_plabel),      setPlabel)
, new MutableVariableSpec('plabel-color', (-> @_plabelcolor), setPlabelColor)
]

module.exports = {
  Setters
  VariableSpecs
}
