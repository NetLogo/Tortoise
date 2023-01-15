# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('engine/core/colormodel')
{ checks } = require('engine/core/typechecker')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')

{ all }                      = require('brazierjs/array')
{ maybe, None, isSomething } = require('brazierjs/maybe')
{ isArray, isNumber }        = require('brazierjs/type')

# (Number|RGB|RGBA, Boolean) => Maybe[String]
validateColor = (color, isPcolor) ->

  hasBadLength    = (xs) -> xs.length isnt 3 and xs.length isnt 4
  isBadCompNumber = (x) -> not (0 <= x <= 255)
  isBadCompType   = (x) -> not checks.isNumber(x)

  if checks.isList(color) and (hasBadLength(color) or color.some(isBadCompType))
    maybe("Invalid RGB format")
  else if checks.isList(color) and (color.some(isBadCompNumber))
    maybe("Invalid RGB number")
  else if not checks.isList(color) and not checks.isNumber(color)
    maybe("Invalid color type")
  else
    None

# (Number|RGB|RGBA) => Maybe[String]
setPcolor = (color) ->

  errorMaybe = validateColor(color, true)

  if not isSomething(errorMaybe)
    wrappedColor = ColorModel.wrapColor(color)
    if @_pcolor isnt wrappedColor
      @_pcolor = wrappedColor
      @_genVarUpdate("pcolor")
      if (isNumber(wrappedColor) and wrappedColor isnt 0) or
         ( isArray(wrappedColor) and not all((n) -> n % 10 is 0)(wrappedColor))
        @_declareNonBlackPatch()

  errorMaybe

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

# (Number|RGB|RGBA) => Maybe[String]
setPlabelColor = (color) ->

  errorMaybe = validateColor(color, false)

  if not isSomething(errorMaybe)
    @_plabelcolor = ColorModel.wrapColor(color)
    @_genVarUpdate("plabel-color")

  errorMaybe

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
