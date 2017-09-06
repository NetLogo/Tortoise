# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath     = require('util/nlmath')
JSType     = require('util/typechecker')
StrictMath = require('shim/strictmath')

{ foldl, map }  = require('brazierjs/array')
{ pipeline }    = require('brazierjs/function')
{ rangeUntil }  = require('brazierjs/number')
{ pairs }       = require('brazierjs/object')

# type ColorNumber = Number
# type ColorName   = String
# type HSB         = (Number, Number, Number)
# type RGB         = (Number, Number, Number)

# (Number, Number) => (Number) => Number
attenuate =
  (lowerBound, upperBound) -> (x) ->
    if x < lowerBound
      lowerBound
    else if x > upperBound
      upperBound
    else
      x

# (Number) => Number
attenuateRGB = attenuate(0, 255)

# (RGB...) => String
componentsToKey = (r, g, b) ->
  "#{r}_#{g}_#{b}"

# (String) => RGB
keyToComponents = (key) ->
  key.split('_').map(parseFloat)

ColorMax = 140

# Array[ColorNumber]
BaseColors = map((n) -> (n * 10) + 5)(rangeUntil(0)(ColorMax / 10))

# Object[ColorName, Number]
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

# (Array[RGB], Object[String, RGB])
[RGBCache, RGBMap] =
  (->
    rgbMap   = {}
    rgbCache =
      for colorTimesTen in [0...(ColorMax * 10)]

        # We do this branching to make sure that the right color
        # is used for white and black, which appear multiple times
        # in NetLogo's nonsensical color space --JAB (9/24/15)
        finalRGB =
          if colorTimesTen is 0
            [0, 0, 0]
          else if colorTimesTen is 99
            [255, 255, 255]
          else
            baseIndex = StrictMath.floor(colorTimesTen / 100)
            rgb       = BaseRGBs[baseIndex]
            step      = (colorTimesTen % 100 - 50) / 50.48 + 0.012
            clamp     = if step <= 0 then (x) -> x else (x) -> 0xFF - x
            rgb.map((x) -> x + StrictMath.truncate(clamp(x) * step))

        rgbMap[componentsToKey(finalRGB...)] = colorTimesTen / 10
        finalRGB

    [rgbCache, rgbMap]

  )()

module.exports = {

  COLOR_MAX:   ColorMax   # ColorNumber
  BASE_COLORS: BaseColors # Array[ColorNumber]

  # (ColorNumber, ColorNumber) => Boolean
  areRelatedByShade: (color1, color2) ->
    @_colorIntegral(color1) is @_colorIntegral(color2)

  # [T <: ColorNumber|RGB|ColorName] @ (T) => RGB
  colorToRGB: (color) ->
    type = JSType(color)
    if type.isNumber()
      RGBCache[StrictMath.floor(@wrapColor(color) * 10)]
    else if type.isArray()
      color.map(StrictMath.round)
    else if type.isString()
      @_nameToRGB(color)
    else
      throw new Error("Unrecognized color format: #{color}")

  # [T <: ColorNumber|RGB] @ (T) => HSB
  colorToHSB: (color) ->
    type = JSType(color)
    [r, g, b] =
      if type.isNumber()
        @colorToRGB(color)
      else if type.isArray()
        color
      else
        throw new Error("Unrecognized color format: #{color}")
    @rgbToHSB(r, g, b)

  # (RGB...) => RGB
  genRGBFromComponents: (r, g, b) ->
    [r, g, b].map(attenuateRGB)

  # Courtesy of Paul S. at http://stackoverflow.com/a/17243070/1116979 --JAB (9/23/15)
  # (HSB...) => RGB
  hsbToRGB: (rawH, rawS, rawB) ->

    h = attenuate(0, 360)(rawH) / 360
    s = attenuate(0, 100)(rawS) / 100
    b = attenuate(0, 100)(rawB) / 100

    i = StrictMath.floor(h * 6)

    f = h * 6 - i
    p = b * (1 - s)
    q = b * (1 - f * s)
    t = b * (1 - (1 - f) * s)

    rgb =
      switch i % 6
        when 0 then [b, t, p]
        when 1 then [q, b, p]
        when 2 then [p, b, t]
        when 3 then [p, q, b]
        when 4 then [t, p, b]
        when 5 then [b, p, q]

    rgb.map((x) -> StrictMath.round(x * 255))

  # (HSB...) => ColorNumber
  nearestColorNumberOfHSB: (h, s, b) ->
    @nearestColorNumberOfRGB(@hsbToRGB(h, s, b)...)

  # (RGB...) => ColorNumber
  nearestColorNumberOfRGB: (r, g, b) ->
    red   = attenuateRGB(r)
    green = attenuateRGB(g)
    blue  = attenuateRGB(b)

    colorNumber = RGBMap[componentsToKey(red, green, blue)] ? @_estimateColorNumber(red, green, blue)

    NLMath.validateNumber(colorNumber)

  # (Number) => ColorNumber
  nthColor: (n) ->
    index = n % BaseColors.length
    BaseColors[index]

  # ((Number) => Number) => ColorNumber
  randomColor: (nextInt) ->
    index = nextInt(BaseColors.length)
    BaseColors[index]

  # Courtesy of Paul S. at http://stackoverflow.com/a/17243070/1116979 --JAB (9/23/15)
  # (RGB...) => HSB
  rgbToHSB: (rawR, rawG, rawB) ->

    r = attenuateRGB(rawR)
    g = attenuateRGB(rawG)
    b = attenuateRGB(rawB)

    max = NLMath.max(r, g, b)
    min = NLMath.min(r, g, b)

    difference = max - min

    hue =
      switch max
        when min then 0
        when r   then ((g - b) + difference * (if g < b then 6 else 0)) / (6 * difference)
        when g   then ((b - r) + difference * 2) / (6 * difference)
        when b   then ((r - g) + difference * 4) / (6 * difference)

    saturation = if max is 0 then 0 else difference / max
    brightness = max / 255

    [hue * 360, saturation * 100, brightness * 100].map((x) -> NLMath.precision(x, 3))

  # [T <: ColorNumber|RGB] @ (T) => T
  wrapColor: (color) ->
    if JSType(color).isArray()
      color
    else # Bah!  This branch ought to be equivalent to `color %% ColorMax`, but that causes floating-point discrepancies. --JAB (7/30/14)
      modColor = color % ColorMax
      if modColor >= 0
        modColor
      else
        ColorMax + modColor

  # (ColorNumber, Number, Number, Number) => Number
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

  # (ColorNumber) => Number
  _colorIntegral: (color) ->
    StrictMath.floor(@wrapColor(color) / 10)

  # (ColorName) => RGB
  _nameToRGB: (name) ->
    BaseRGBs[NamesToIndicesMap[name]]

  # (RGB...) => ColorNumber
  _estimateColorNumber: (r, g, b) ->
    f =
      (acc, [k, v]) =>
        [cr, cg, cb] = keyToComponents(k)
        dist = @_colorDistance(r, g, b, cr, cg, cb)
        if dist < acc[1]
          [v, dist]
        else
          acc
    pipeline(pairs, foldl(f)([0, Number.MAX_VALUE]))(RGBMap)[0]

  # CoffeeScript code from the Scala code in Headless' './parser-core/src/main/core/Color.scala',
  # which was translated from Java code that came from a C snippet at www.compuphase.com/cmetric.htm
  # Dealwithit --JAB (9/24/15)
  # (Number, Number, Number, Number, Number, Number) => Number
  _colorDistance: (r1, g1, b1, r2, g2, b2) ->
    rMean = r1 + r2 / 2
    rDiff = r1 - r2
    gDiff = g1 - g2
    bDiff = b1 - b2
    (((512 + rMean) * rDiff * rDiff) >> 8) + 4 * gDiff * gDiff + (((767 - rMean) * bDiff * bDiff) >> 8)
    # I don't know what this code means.
    # Leave a comment on this webzone if you know what this code means --JAB (9/24/15)

}
