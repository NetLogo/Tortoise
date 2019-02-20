# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('engine/core/colormodel')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')

{ all }               = require('brazierjs/array')
{ isArray, isNumber } = require('brazierjs/type')

# In this file: `this.type` is `Patch`

# (Number|(Number, Number, Number)) => Unit
setPcolor = (color) ->
  wrappedColor = ColorModel.wrapColor(color)
  if @_pcolor isnt wrappedColor
    @_pcolor = wrappedColor
    @_genVarUpdate("pcolor")
    if (isNumber(wrappedColor) and wrappedColor isnt 0) or
       ( isArray(wrappedColor) and not all((n) -> n % 10 is 0)(wrappedColor))
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
  new ImmutableVariableSpec('pxcor', -> @pxcor)
, new ImmutableVariableSpec('pycor', -> @pycor)
, new MutableVariableSpec('pcolor',       (-> @_pcolor),      setPcolor)
, new MutableVariableSpec('plabel',       (-> @_plabel),      setPlabel)
, new MutableVariableSpec('plabel-color', (-> @_plabelcolor), setPlabelColor)
]

module.exports = {
  Setters
  VariableSpecs
}
