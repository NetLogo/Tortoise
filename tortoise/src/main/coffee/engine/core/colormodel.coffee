# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_      = require('lodash')
JSType = require('util/typechecker')

# type RGB = (Number, Number, Number)

ColorMax = 140

# Array[Number]
BaseColors = _(0).range(ColorMax / 10).map((n) -> (n * 10) + 5).value()

# Object[String, Number]
NamesToIndicesMap =
  (->
    temp = {}
    for color, i in ['gray', 'red', 'orange', 'brown', 'yellow', 'green', 'lime', 'turqoise', 'cyan', 'sky', 'blue', 'violet', 'magenta', 'pink', 'black', 'white']
      temp[color] = i
    temp
  )()

# copied from api/Color.scala. note these aren't the same numbers as
# `map extract-rgb base-colors` gives you; see comments in Scala source --BH
# Array[RGB]
BaseRGBs = [
  [140, 140, 140], # gray       (5)
  [215,  48,  39], # red       (15)
  [241, 105,  19], # orange    (25)
  [156, 109,  70], # brown     (35)
  [237, 237,  47], # yellow    (45)
  [ 87, 176,  58], # green     (55)
  [ 42, 209,  57], # lime      (65)
  [ 27, 158, 119], # turquoise (75)
  [ 82, 196, 196], # cyan      (85)
  [ 43, 140, 190], # sky       (95)
  [ 50,  92, 168], # blue     (105)
  [123,  78, 163], # violet   (115)
  [166,  25, 105], # magenta  (125)
  [224, 126, 149], # pink     (135)
  [ 0,    0,   0], # black
  [255, 255, 255]  # white
]

# Array[RGB]
RGBCache =
  for colorTimesTen in [0..1400]
    baseIndex = Math.floor(colorTimesTen / 100)
    rgb       = BaseRGBs[baseIndex]
    step      = (colorTimesTen % 100 - 50) / 50.48 + 0.012
    attenuate = if step < 0 then (x) -> x else (x) -> 0xFF - x
    rgb.map((x) -> x + Math.floor(attenuate(x) * step))

module.exports = {

  COLOR_MAX:   ColorMax   # Number
  BASE_COLORS: BaseColors # Array[Number]

  # (Number, Number) => Boolean
  areRelatedByShade: (color1, color2) ->
    @_colorIntegral(color1) is @_colorIntegral(color2)

  # (Number) => RGB
  colorToRGB: (color) ->
    type = JSType(color)
    if type.isNumber()
      RGBCache[Math.floor(color * 10)]
    else if type.isArray()
      color.map(Math.round)
    else if type.isString()
      @_nameToRGB(color)
    else
      throw new Error("Unrecognized color format: #{color}")

  # (Number) => Number
  nthColor: (n) ->
    index = n % BaseColors.length
    BaseColors[index]

  # ((Number) => Number) => Number
  randomColor: (nextInt) ->
    index = nextInt(BaseColors.length)
    BaseColors[index]

  # (Number) => Number
  wrapColor: (color) ->
    if JSType(color).isArray()
      color
    else # Bah!  This branch ought to be equivalent to `color %% ColorMax`, but that causes floating-point discrepencies. --JAB (7/30/14)
      modColor = color % ColorMax
      if modColor >= 0
        modColor
      else
        ColorMax + modColor

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

  # (String) => RGB
  _nameToRGB: (name) ->
    BaseRGBs[NamesToIndicesMap[name]]

}
