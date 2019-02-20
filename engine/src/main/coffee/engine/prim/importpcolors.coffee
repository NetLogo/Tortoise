# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('../core/colormodel')
NLMath     = require('util/nlmath')
StrictMath = require('shim/strictmath')

# type RGB = (Number, Number, Number)

lookupNLColor = (->
  cache = {}
  (rgb) ->
    value = cache[rgb]
    if value?
      value
    else
      nlc = ColorModel.nearestColorNumberOfRGB(rgb...)
      cache[rgb] = nlc
      nlc
)()

# (Topology, Array[RGB], Number, Number) => Array[{ x, y, color }]
genPColorUpdates = ({ height: worldHeight, minPxcor, minPycor, width: worldWidth }, rgbs, imageWidth, imageHeight) ->

  xStarts =
    for x in [0...worldWidth]
      StrictMath.floor(x * imageWidth / worldWidth)

  yStarts =
    for y in [0...worldHeight]
      StrictMath.floor(y * imageHeight / worldHeight)

  updates =
    for xcor in [0...worldWidth]
      for ycor in [0...worldHeight]

        minX = xStarts[xcor]
        minY = yStarts[ycor]
        maxX = NLMath.max(minX + 1, xStarts[xcor + 1] ? imageWidth )
        maxY = NLMath.max(minY + 1, yStarts[ycor + 1] ? imageHeight)

        # I just use the color of the center pixel of the bitmap section.
        # I originally tried averaging the pixels in the bitmap section.  That is
        # also not what desktop does.  Desktop does this by scaling down and then
        # scaling back up, using a Java library.  How that library decides which
        # pixel to keep when shrinking a section, I do not know.  It's not
        # something simple like averaging or choosing the center pixel.  But I
        # don't really care to find out what it is.  Averaging would give grays
        # too often, so I went with center pixel. --JAB (11/19/18)
        x     = StrictMath.floor((minX + maxX) / 2)
        y     = StrictMath.floor((minY + maxY) / 2)
        pixel = rgbs[x + (y * imageWidth)]

        { x: minPxcor + xcor, y: minPycor + ((worldHeight - 1) - ycor), color: pixel }

  [].concat(updates...)

# (() => Topology, (Number, Number) => Agent, (String) => ImageData) => (Boolean) => (String) => Unit
module.exports =
  (getTopology, getPatchAt, base64ToImageData) -> (isNetLogoColorspace) -> (base64) ->

    { data, height, width } = base64ToImageData(base64)
    toArray = if Array.from? then ((xs) -> Array.from(xs)) else ((xs) -> Array.prototype.slice.call(xs))
    rgbs    = [0...(data.length / 4)].map((i) -> toArray(data.slice(i * 4, (i * 4) + 3)))
    updates = genPColorUpdates(getTopology(), rgbs, width, height)

    colorGetter =
      if isNetLogoColorspace
        (x) -> lookupNLColor(x)
      else
        (x) -> ColorModel.rgbList(x)

    updates.forEach(({ x, y, color }) -> getPatchAt(x, y).setVariable('pcolor', colorGetter(color)))

    return
