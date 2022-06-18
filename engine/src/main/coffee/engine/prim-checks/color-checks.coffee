# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('engine/core/colormodel')
{ checks } = require('engine/core/typechecker')

# (Array[_]) => Boolean
isProperlySized = (xs) ->
  xs.length is 3 or xs.length is 4

isInRange = (comp) ->
  comp >= 0 and comp <= 255

# (Any) => Boolean
isValidColor = (color) ->
  (checks.isNumber(color) and isInRange(color)) or
    (checks.isList(color) and isProperlySized(color) and color.every(isInRange))

invalidColorMsg =
  'Color must be a number or a valid RGB/A color list with 3 - 4 numbers that have \
values between 0 and 255.'

class ColorChecks

  # (Validator)
  constructor: (@validator) ->

  # (ColorNumber|RGB|ColorName) => RGB
  extractRGB: (color) ->
    if isValidColor(color)
      ColorModel.colorToRGB(color)
    else
      @validator.error('extract-rgb', invalidColorMsg)

module.exports = ColorChecks
