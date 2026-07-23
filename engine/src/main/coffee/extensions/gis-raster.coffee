# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Port of the desktop extension's RasterDataset.java, RasterDatasetMath.java, and
# GridDimensions.java.  Raster data is stored row-major with row 0 at the TOP, like
# desktop's WritableRaster; GIS y coordinates grow upward, hence the y-axis flips
# below.

JSTS = require('jsts/dist/jsts.min.js')
{ exceptionFactory: exceptions } = require('util/exception')
{ checks } = require('../engine/core/typechecker')

{ Envelope, Coordinate } = JSTS.geom

class GridDimensions

  # (Number, Number, Envelope)
  constructor: (@gridWidth, @gridHeight, envelope) ->
    @envelope = new Envelope(envelope)

  # () => Number
  getCellWidth:  -> @envelope.getWidth()  / @gridWidth

  # () => Number
  getCellHeight: -> @envelope.getHeight() / @gridHeight

  # each () => Number
  getLeft:   -> @envelope.getMinX()
  getRight:  -> @envelope.getMaxX()
  getBottom: -> @envelope.getMinY()
  getTop:    -> @envelope.getMaxY()

  # each (Number) => Number
  getColumnLeft:   (column) -> @envelope.getMinX() + (@getCellWidth() * column)
  getColumnCenter: (column) -> @envelope.getMinX() + (@getCellWidth() * column) + (@getCellWidth() * 0.5)
  getColumnRight:  (column) -> @envelope.getMinX() + (@getCellWidth() * (column + 1))
  getRowBottom:    (row)    -> @envelope.getMinY() + (@getCellHeight() * row)
  getRowCenter:    (row)    -> @envelope.getMinY() + (@getCellHeight() * row) + (@getCellHeight() * 0.5)
  getRowTop:       (row)    -> @envelope.getMinY() + (@getCellHeight() * (row + 1))

  # () => Envelope
  getEnvelope: -> new Envelope(@envelope)

  # (Coordinate) => Coordinate — components are NaN when out of range
  gisToGrid: (coord) ->
    gridX = (coord.x - @envelope.getMinX()) / @getCellWidth()
    gridY = (coord.y - @envelope.getMinY()) / @getCellHeight()
    new Coordinate(
      (if gridX >= 0 and gridX <= @gridWidth  then gridX else NaN)
      (if gridY >= 0 and gridY <= @gridHeight then gridY else NaN)
    )

  # (Any) => Boolean
  equals: (other) ->
    other instanceof GridDimensions and
      other.gridWidth is @gridWidth and other.gridHeight is @gridHeight and
      other.envelope.equals(@envelope)

# JAI-style interpolation kernels: [kernel width, height, left padding, top padding]
INTERPOLATIONS = {
  "NEAREST_NEIGHBOR": { width: 1, height: 1, left: 0, top: 0 }
  "BILINEAR":         { width: 2, height: 2, left: 0, top: 0 }
  "BICUBIC":          { width: 4, height: 4, left: 1, top: 1, a: -0.5 }
  "BICUBIC_2":        { width: 4, height: 4, left: 1, top: 1, a: -1.0 }
}

# (Number) => Number
# JAI's InterpolationTable quantizes fractions to 256 subsamples
quantizeFrac = (frac) ->
  Math.round(frac * 256) / 256

# (Number, Number) => Number
# Keys cubic kernel weight for offset t in [0, 2]
cubicWeight = (a, t) ->
  if t <= 1
    ((a + 2) * t * t * t) - ((a + 3) * t * t) + 1
  else
    (a * t * t * t) - (5 * a * t * t) + (8 * a * t) - (4 * a)

# (Array[Array[Number]], Number, Number, String) => Number
interpolate = (samples, xfrac, yfrac, method) ->
  switch method
    when "NEAREST_NEIGHBOR"
      samples[0][0]
    when "BILINEAR"
      top    = ((1 - xfrac) * samples[0][0]) + (xfrac * samples[0][1])
      bottom = ((1 - xfrac) * samples[1][0]) + (xfrac * samples[1][1])
      ((1 - yfrac) * top) + (yfrac * bottom)
    else
      { a } = INTERPOLATIONS[method]
      xf = quantizeFrac(xfrac)
      yf = quantizeFrac(yfrac)
      xWeights = [cubicWeight(a, xf + 1), cubicWeight(a, xf), cubicWeight(a, 1 - xf), cubicWeight(a, 2 - xf)]
      yWeights = [cubicWeight(a, yf + 1), cubicWeight(a, yf), cubicWeight(a, 1 - yf), cubicWeight(a, 2 - yf)]
      result = 0
      for row, iy in samples
        rowValue = 0
        rowValue += xWeights[ix] * value for value, ix in row
        result += yWeights[iy] * rowValue
      result

class RasterDataset
  gisType: "RasterDataset"

  # (GridDimensions, Float64Array, GisCore) — data is row-major, row 0 at top
  constructor: (@dimensions, @data, core) ->
    @interpolation = "NEAREST_NEIGHBOR"
    core.state.datasetCount += 1

  # () => Envelope
  getEnvelope: -> @dimensions.getEnvelope()

  # () => String
  dumpContents: -> ""

  # (Number, Number) => Unit
  checkBounds: (col, row) ->
    if col < 0 or col >= @dimensions.gridWidth or row < 0 or row >= @dimensions.gridHeight
      throw exceptions.extension("Coordinate out of bounds!")
    return

  # (Number, Number) => Number — row in raster space (0 = top)
  getSample: (col, row) ->
    @checkBounds(col, row)
    @data[(row * @dimensions.gridWidth) + col]

  # (Number, Number, Number) => Unit
  setSample: (col, row, value) ->
    @checkBounds(col, row)
    @data[(row * @dimensions.gridWidth) + col] = value
    return

  # (Coordinate) => Number — port of RasterDataset.getValue(Coordinate)
  getValueAtPoint: (gisLocation) ->
    gridLocation = @dimensions.gisToGrid(gisLocation)
    if isNaN(gridLocation.x) or isNaN(gridLocation.y)
      return NaN
    kernel = INTERPOLATIONS[@interpolation]
    rx = Math.floor(gridLocation.x)
    ry = Math.floor(gridLocation.y)
    # desktop casts the fractions to float before interpolating
    xfrac = Math.fround(gridLocation.x - rx)
    yfrac = Math.fround(gridLocation.y - ry)
    samples = []
    for iy in [0...kernel.height]
      sy = ry + iy - kernel.top
      row = []
      if sy >= 0 and sy < @dimensions.gridHeight
        flippedY = @dimensions.gridHeight - sy - 1 # reverse y axis
        for ix in [0...kernel.width]
          sx = rx + ix - kernel.left
          row.push(if sx >= 0 and sx < @dimensions.gridWidth then @data[(flippedY * @dimensions.gridWidth) + sx] else NaN)
      else
        row.push(NaN) for ix in [0...kernel.width]
      samples.push(row)
    interpolate(samples, xfrac, yfrac, @interpolation)

  # (Envelope) => Number — port of RasterDataset.getValue(Envelope): cell average
  getValueForEnvelope: (gisEnvelope) ->
    gridBL = @dimensions.gisToGrid(new Coordinate(gisEnvelope.getMinX(), gisEnvelope.getMinY()))
    gridTR = @dimensions.gisToGrid(new Coordinate(gisEnvelope.getMaxX(), gisEnvelope.getMaxY()))
    if isNaN(gridBL.y) and isNaN(gridTR.y)
      return NaN
    minY = if isNaN(gridBL.y) then 0 else Math.floor(gridBL.y)
    maxY = if isNaN(gridTR.y) then @dimensions.gridHeight else Math.ceil(gridTR.y)
    if isNaN(gridBL.x) and isNaN(gridTR.x)
      return NaN
    minX = if isNaN(gridBL.x) then 0 else Math.floor(gridBL.x)
    maxX = if isNaN(gridTR.x) then @dimensions.gridWidth else Math.ceil(gridTR.x)
    sum   = 0
    count = 0
    for y in [minY...maxY]
      for x in [minX...maxX]
        sum += @data[((@dimensions.gridHeight - y - 1) * @dimensions.gridWidth) + x]
        count += 1
    if count > 0 then sum / count else NaN

  # ({ width: Number, height: Number, xOrigin: Number, yOrigin: Number, data: Float32Array }, GisCore) => RasterDataset
  # port of RasterDataset.convolve: JAI's `convolve` op is true convolution (the kernel
  # is rotated 180 degrees), and its NaN border extender makes any output cell whose
  # kernel reaches outside the raster NaN.  The + 0.5 is JAI's (pure-Java, non-mediaLib)
  # ConvolveOpImage applying its integer-rounding offset to floating-point samples
  # without ever truncating — a JAI quirk kept for desktop parity.
  convolve: (kernel, core) ->
    { gridWidth: width, gridHeight: height } = @dimensions
    out = new Float64Array(width * height)
    for y in [0...height]
      for x in [0...width]
        sum = 0
        for j in [0...kernel.height]
          sy = y + kernel.yOrigin - j
          for i in [0...kernel.width]
            sx = x + kernel.xOrigin - i
            value =
              if sx >= 0 and sx < width and sy >= 0 and sy < height
                @data[(sy * width) + sx]
              else
                NaN
            sum += kernel.data[(j * kernel.width) + i] * value
        out[(y * width) + x] = sum + 0.5
    new RasterDataset(@dimensions, out, core)

  # (GridDimensions, GisCore) => RasterDataset — samples this raster (with its interpolation) at
  # each new cell's center.  Desktop scales via JAI's `scale` op instead; results match
  # for aligned grids but can differ at cell boundaries or off-alignment scalings.
  resample: (toDimensions, core) ->
    if toDimensions.equals(@dimensions)
      return this
    data = new Float64Array(toDimensions.gridWidth * toDimensions.gridHeight)
    for row in [0...toDimensions.gridHeight]
      gisY = toDimensions.getRowCenter(toDimensions.gridHeight - row - 1)
      for col in [0...toDimensions.gridWidth]
        gisX = toDimensions.getColumnCenter(col)
        data[(row * toDimensions.gridWidth) + col] = @getValueAtPoint(new Coordinate(gisX, gisY))
    new RasterDataset(toDimensions, data, core)

# (GisCore, Workspace) => GisRaster
module.exports = ({ core, workspace }) ->

  # (Any) => RasterDataset
  getDataset = (arg) ->
    if arg?.gisType is "RasterDataset"
      arg
    else
      throw exceptions.extension("not a RasterDataset: #{workspace.dump(arg)}")

  prims = {

    "CREATE-RASTER": (width, height, envelopeList) ->
      w = Math.trunc(width)
      h = Math.trunc(height)
      dimensions = new GridDimensions(w, h, core.parseEnvelope(envelopeList))
      new RasterDataset(dimensions, new Float64Array(w * h), core)

    "WIDTH-OF":  (arg) -> getDataset(arg).dimensions.gridWidth
    "HEIGHT-OF": (arg) -> getDataset(arg).dimensions.gridHeight

    "RASTER-VALUE": (arg, col, row) ->
      getDataset(arg).getSample(Math.trunc(col), Math.trunc(row))

    "SET-RASTER-VALUE": (arg, col, row, value) ->
      getDataset(arg).setSample(Math.trunc(col), Math.trunc(row), value)

    "MINIMUM-OF": (arg) ->
      result = Number.MAX_VALUE
      for value in getDataset(arg).data
        result = value if value < result and not isNaN(value)
      result

    "MAXIMUM-OF": (arg) ->
      result = -Number.MAX_VALUE
      for value in getDataset(arg).data
        result = value if value > result and not isNaN(value)
      result

    "SAMPLING-METHOD-OF": (arg) ->
      getDataset(arg).interpolation

    "SET-SAMPLING-METHOD": (arg, method) ->
      dataset = getDataset(arg)
      upper = method.toUpperCase()
      if not INTERPOLATIONS[upper]?
        throw exceptions.extension("Unknown interpolation type: #{workspace.dump(method, true)}")
      dataset.interpolation = upper
      return

    "RASTER-SAMPLE": (arg, location) ->
      dataset = getDataset(arg)
      if checks.isList(location)
        if location.length is 2
          dataset.getValueAtPoint(core.netLogoToGIS(new Coordinate(location[0], location[1])))
        else if location.length is 4
          dataset.getValueForEnvelope(new Envelope(location[0], location[1], location[2], location[3]))
        else
          throw exceptions.extension("list argument must have 2 elements (for a point), or 4 elements (for an envelope)")
      else if checks.isPatch(location)
        bl = core.netLogoToGIS(new Coordinate(location.pxcor - 0.5, location.pycor - 0.5))
        tr = core.netLogoToGIS(new Coordinate(location.pxcor + 0.5, location.pycor + 0.5))
        dataset.getValueForEnvelope(new Envelope(bl.x, tr.x, bl.y, tr.y))
      else if checks.isTurtle(location)
        dataset.getValueAtPoint(core.netLogoToGIS(new Coordinate(location.xcor, location.ycor)))
      else if location?.gisType is "Vertex"
        dataset.getValueAtPoint(location.coordinate)
      else
        throw exceptions.extension("not a list, patch, turtle, or Vertex: #{workspace.dump(location)}")

    "RASTER-WORLD-ENVELOPE": (arg, x, y) ->
      dataset = getDataset(arg)
      leftCol = Math.trunc(x)
      topRow  = dataset.dimensions.gridHeight - Math.trunc(y) - 1
      t = workspace.world.topology
      width  = t.maxPxcor - t.minPxcor
      height = t.maxPycor - t.minPycor
      core.formatEnvelope(new Envelope(
        dataset.dimensions.getColumnLeft(leftCol)
        dataset.dimensions.getColumnRight(leftCol + width)
        dataset.dimensions.getRowBottom(topRow - height)
        dataset.dimensions.getRowTop(topRow)
      ))

    "RESAMPLE": (arg, envelopeList, width, height) ->
      dimensions = new GridDimensions(Math.trunc(width), Math.trunc(height), core.parseEnvelope(envelopeList))
      getDataset(arg).resample(dimensions, core)

    # port of RasterDatasetMath.Convolve
    "CONVOLVE": (arg, kernelRows, kernelColumns, matrixElements, keyRow, keyColumn) ->
      dataset = getDataset(arg)
      rows = Math.trunc(kernelRows)
      cols = Math.trunc(kernelColumns)
      if matrixElements.length isnt rows * cols
        throw exceptions.extension("Convolution matrix is #{rows} by #{cols}, so it must have exactly #{rows * cols} elements (currently has #{matrixElements.length})")
      # reverse the order of the rows, since the convolution is computed in image
      # coordinates (reversed y axis); desktop stores the elements as floats
      data = new Float32Array(rows * cols)
      row = rows - 1
      col = 0
      for element in matrixElements
        data[(row * cols) + col] = element
        col += 1
        if col >= cols
          col = 0
          row -= 1
      kernel = {
        width:   cols
        height:  rows
        xOrigin: Math.trunc(keyColumn)
        yOrigin: rows - Math.trunc(keyRow) - 1
        data
      }
      dataset.convolve(kernel, core)
  }

  {
    prims
  , GridDimensions
  , RasterDataset
  , getDataset
  }
