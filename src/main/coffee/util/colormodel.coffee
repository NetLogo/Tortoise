# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_      = require('lodash')
Random = require('../shim/random')

ColorMax   = 140
BaseColors = _(0).range(ColorMax / 10).map((n) -> (n * 10) + 5).value()

module.exports = {

  COLOR_MAX:   ColorMax   # Number
  BASE_COLORS: BaseColors # Array[Number]

  # (Number) => Number
  nthColor: (n) ->
    index = n % BaseColors.length
    BaseColors[index]

  # () => Number
  randomColor: ->
    index = Random.nextInt(BaseColors.length)
    BaseColors[index]

  # (Number) => Number
  wrapColor: (color) ->
    if _(color).isArray()
      color
    else # Bah!  This branch ought to be equivalent to `color %% ColorMax`, but that causes floating-point discrepencies. --JAB (7/30/14)
      modColor = color % ColorMax
      if modColor >= 0
        modColor
      else
        ColorMax + modColor

  # (Number, Number) => Boolean
  areRelatedByShade: (color1, color2) ->
    @_colorIntegral(color1) is @_colorIntegral(color2)

  # (Number, Number, Number, Number) => Number
  scaleColor: (color, number, min, max) ->

    percent =
      if min > max
        if number < max
          1.0
        else if number > min
          0.0
        else
          tempval = min - number
          tempmax = min - max
          tempval / tempmax
      else
        if number > max
          1.0
        else if number < min
          0.0
        else
          tempval = number - min
          tempmax = max    - min
          tempval / tempmax

    percent10 = percent * 10

    finalPercent =
      if percent10 >= 9.9999
        9.9999
      else if percent10 < 0
        0
      else
        percent10

    @_colorIntegral(color) * 10 + finalPercent

  # (Number) => Number
  _colorIntegral: (color) ->
    Math.floor(color / 10)

}
