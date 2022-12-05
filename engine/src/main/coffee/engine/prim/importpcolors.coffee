# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('../core/colormodel')
NLMath     = require('util/nlmath')
StrictMath = require('shim/strictmath')

{ map, toObject }     = require('brazier/array')
{ id, pipeline, tee } = require('brazier/function')

# type RGBA = (Number, Number, Number, Number)

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

# (Number, Number, Number, Number) => (Number, Number, Object[Number, Number])
genCoords = (patchSize, ratio, worldDim, imageDim) ->

  worldPixelDim  = patchSize * worldDim
  scaledImageDim = imageDim * ratio
  patchOffset    = (worldPixelDim  - scaledImageDim) / patchSize / 2
  startPatch     = StrictMath.floor(patchOffset)
  endPatch       = worldDim - StrictMath.ceil(patchOffset)
  dimRatio       = imageDim / (endPatch - startPatch)

  patchNumToPixel =
    (patchNum) ->
      StrictMath.floor((patchNum - startPatch) * dimRatio)

  startPixels = pipeline(map(tee(id)(patchNumToPixel)), toObject)([startPatch...endPatch])

  [startPatch, endPatch, startPixels]

# (Topology, Number, Array[RGBA], Number, Number) => Array[{ x, y, color }]
genPColorUpdates = ({ height: worldHeight, minPxcor, minPycor, width: worldWidth }, patchSize, rgbs, imageWidth, imageHeight) ->

  ratio = NLMath.min(patchSize * worldWidth / imageWidth, patchSize * worldHeight / imageHeight)

  [xStart, xEnd, xStarts] = genCoords(patchSize, ratio, worldWidth , imageWidth )
  [yStart, yEnd, yStarts] = genCoords(patchSize, ratio, worldHeight, imageHeight)

  updates =
    for xcor in [xStart...xEnd]
      for ycor in [yStart...yEnd]

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

  [].concat(updates...).filter(({ color: [r, g, b, a] }) -> a isnt 0)

# (() => Topology, () => Number, (Number, Number) => Agent, (String) => ImageData) => (Boolean) => (String) => Unit
importPColorsBase64 = (getTopology, getPatchSize, getPatchAt, base64ToImageData) -> (isNetLogoColorspace) -> (base64) ->
  importPColorsImage(getTopology, getPatchSize, getPatchAt, isNetLogoColorspace, base64ToImageData(base64))

# (() => Topology, () => Number, (Number, Number) => Agent, Boolean, ImageData) => Unit
importPColorsImage = (getTopology, getPatchSize, getPatchAt, isNetLogoColorspace, { data, height, width }) ->
  toArray = if Array.from? then ((xs) -> Array.from(xs)) else ((xs) -> Array.prototype.slice.call(xs))
  rgbas   = [0...(data.length / 4)].map((i) -> toArray(data.slice(i * 4, (i * 4) + 4)))
  updates = genPColorUpdates(getTopology(), getPatchSize(), rgbas, width, height)

  colorGetter =
    if isNetLogoColorspace
      (x) -> lookupNLColor(x)
    else
      (x) -> ColorModel.rgbList(x)

  updates.forEach(({ x, y, color }) -> getPatchAt(x, y).setVariable('pcolor', colorGetter(color)))

  return

module.exports = {
  importPColorsBase64
, importPColorsImage
}
