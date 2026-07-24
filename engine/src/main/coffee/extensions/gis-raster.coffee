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

  # () => Number
  getLeft:   -> @envelope.getMinX()
  # () => Number
  getRight:  -> @envelope.getMaxX()
  # () => Number
  getBottom: -> @envelope.getMinY()
  # () => Number
  getTop:    -> @envelope.getMaxY()

  # (Number) => Number
  getColumnLeft:   (column) -> @envelope.getMinX() + (@getCellWidth() * column)
  # (Number) => Number
  getColumnCenter: (column) -> @envelope.getMinX() + (@getCellWidth() * column) + (@getCellWidth() * 0.5)
  # (Number) => Number
  getColumnRight:  (column) -> @envelope.getMinX() + (@getCellWidth() * (column + 1))
  # (Number) => Number
  getRowBottom:    (row)    -> @envelope.getMinY() + (@getCellHeight() * row)
  # (Number) => Number
  getRowCenter:    (row)    -> @envelope.getMinY() + (@getCellHeight() * row) + (@getCellHeight() * 0.5)
  # (Number) => Number
  getRowTop:       (row)    -> @envelope.getMinY() + (@getCellHeight() * (row + 1))

  # () => Envelope
  getEnvelope: -> new Envelope(@envelope)

  # components are NaN when out of range
  # (Coordinate) => Coordinate
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

# JAI's InterpolationTable quantizes fractions to 256 subsamples
# (Number) => Number
quantizeFrac = (frac) ->
  Math.round(frac * 256) / 256

# Keys cubic kernel weight for offset t in [0, 2]
# (Number, Number) => Number
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

# Port of KernelJAI.checkSeparable.  JAI's `convolve` dispatches on this: a separable
# (rank-1) kernel with width and height both > 1 goes through SeparableConvolveOpImage
# (two float-factored 1-D passes, no rounding offset), everything else through
# ConvolveOpImage (a direct sum that seeds its accumulator with 0.5).  Returns the
# rotated separable factors ({ dataH, dataV }) when separable, or null otherwise.  All
# arithmetic mirrors JAI's single-precision float ops (hence the `Math.fround`s), so the
# factors -- and thus the convolution -- match desktop bit-for-bit.
# ({ width: Number, height: Number, data: Float32Array }) => { dataH: Float32Array, dataV: Float32Array } | null
FLOAT_ZERO_TOL = Math.fround(1.0e-5)
kernelSeparation = ({ width, height, data }) ->
  fr = Math.fround
  return null if width <= 1 or height <= 1
  maxData = 0.0
  imax    = 0
  for k in [0...data.length]
    tmp = Math.abs(data[k])
    if tmp > maxData
      imax    = k
      maxData = tmp
  return null if maxData < fr(FLOAT_ZERO_TOL / data.length)
  fac    = fr(1.0 / data[imax])
  jmax   = imax % width
  maxRow = Math.trunc(imax / width)
  dataH  = new Float32Array(width)
  dataH[j] = fr(data[(maxRow * width) + j] * fac) for j in [0...width]
  # every row must be a multiple of the max row for the kernel to be rank 1
  for i in [0...height]
    i0 = i * width
    for j in [0...width]
      return null if Math.abs(fr(fr(data[i0 + jmax] * dataH[j]) - data[i0 + j])) > FLOAT_ZERO_TOL
  dataV = new Float32Array(height)
  dataV[i] = data[jmax + (i * width)] for i in [0...height]
  # normalize so the larger-summing factor vector sums to 1 (JAI does this so its
  # byte/short lookup tables stay in range; harmless but must be replicated for parity)
  sumH = 0.0
  sumH = fr(sumH + dataH[j]) for j in [0...width]
  sumV = 0.0
  sumV = fr(sumV + dataV[i]) for i in [0...height]
  if Math.abs(sumH) >= Math.abs(sumV) and Math.abs(sumH) > FLOAT_ZERO_TOL
    fac = fr(1.0 / sumH)
    dataH[j] = fr(dataH[j] * fac)  for j in [0...width]
    dataV[i] = fr(dataV[i] * sumH) for i in [0...height]
  else if Math.abs(sumH) < Math.abs(sumV) and Math.abs(sumV) > FLOAT_ZERO_TOL
    fac = fr(1.0 / sumV)
    dataH[j] = fr(dataH[j] * sumV) for j in [0...width]
    dataV[i] = fr(dataV[i] * fac)  for i in [0...height]
  # JAI convolves with the 180-degree-rotated kernel, which reverses each factor vector
  rotH = new Float32Array(width)
  rotV = new Float32Array(height)
  rotH[i] = dataH[width - 1 - i]  for i in [0...width]
  rotV[i] = dataV[height - 1 - i] for i in [0...height]
  { dataH: rotH, dataV: rotV }

class RasterDataset
  gisType: "RasterDataset"

  # data is row-major, row 0 at top
  # (GridDimensions, Float64Array, GisCore)
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

  # row in raster space (0 = top)
  # (Number, Number) => Number
  getSample: (col, row) ->
    @checkBounds(col, row)
    @data[(row * @dimensions.gridWidth) + col]

  # (Number, Number, Number) => Unit
  setSample: (col, row, value) ->
    @checkBounds(col, row)
    @data[(row * @dimensions.gridWidth) + col] = value
    return

  # port of RasterDataset.getValue(Coordinate)
  # (Coordinate) => Number
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

  # port of RasterDataset.getValue(Envelope): cell average
  # (Envelope) => Number
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

  # port of RasterDataset.convolve: JAI's `convolve` op is true convolution (the kernel
  # is rotated 180 degrees), and its NaN border extender makes any output cell whose
  # kernel reaches outside the raster NaN.  JAI splits into two code paths that DIFFER in
  # results (see kernelSeparation): the general ConvolveOpImage seeds its accumulator with
  # 0.5 (an integer-rounding offset it applies to doubles regardless), while
  # SeparableConvolveOpImage adds no offset and computes two float-factored 1-D passes.
  # Both are reproduced here for desktop parity.
  # ({ width: Number, height: Number, xOrigin: Number, yOrigin: Number, data: Float32Array }, GisCore) => RasterDataset
  convolve: (kernel, core) ->
    { gridWidth: width, gridHeight: height } = @dimensions
    { width: kw, height: kh } = kernel
    out = new Float64Array(width * height)
    # rotated-kernel origins become the left/top padding JAI positions the footprint by
    rxo = kw - 1 - kernel.xOrigin
    ryo = kh - 1 - kernel.yOrigin
    sample = (sx, sy) =>
      if sx >= 0 and sx < width and sy >= 0 and sy < height then @data[(sy * width) + sx] else NaN
    separation = kernelSeparation(kernel)
    for y in [0...height]
      for x in [0...width]
        out[(y * width) + x] =
          if separation?
            { dataH, dataV } = separation
            result = 0
            for u in [0...kh]
              sy = (y - ryo) + u
              rowSum = 0
              rowSum += sample((x - rxo) + v, sy) * dataH[v] for v in [0...kw]
              result += rowSum * dataV[u]
            result
          else
            sum = 0.5
            for u in [0...kh]
              sy = (y - ryo) + u
              sum += sample((x - rxo) + v, sy) * kernel.data[(kw * kh) - 1 - ((u * kw) + v)] for v in [0...kw]
            sum
    new RasterDataset(@dimensions, out, core)

  # samples this raster (with its interpolation) at each new cell's center.  Desktop scales via JAI's `scale` op
  # instead; results match for aligned grids but can differ at cell boundaries or off-alignment scalings.
  # (GridDimensions, GisCore) => RasterDataset
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
