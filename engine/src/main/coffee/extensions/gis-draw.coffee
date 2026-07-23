# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Port of the desktop extension's Painting.java.  Desktop draws straight onto a
# BufferedImage with Graphics2D; NetLogo Web has no such canvas in the engine, so these
# prims transform geometry into NetLogo coordinates and emit drawing events that the
# view (Galapagos) renders: gis:draw as `line` events, gis:fill as `gis-fill-polygon`,
# and gis:paint as `gis-draw-raster`.

JSTS = require('jsts/dist/jsts.min.js')
{ exceptionFactory: exceptions } = require('util/exception')
{ checks }  = require('../engine/core/typechecker')
ColorModel  = require('../engine/core/colormodel')
shapefile   = require('extensions/gis-shapefile')

{ Coordinate } = JSTS.geom

# (GisCore, GisRaster, Workspace) => GisDraw
module.exports = ({ core, raster, workspace }) ->

  { updater } = workspace

  # (Coordinate) => [Number, Number] — GIS coordinate to a NetLogo [x, y] pair
  toNetLogo = (c) ->
    nl = core.gisToNetLogoRaw(new Coordinate(c.x, c.y))
    [nl.x, nl.y]

  # (Geometry) => Array[Array[[Number, Number]]] — one NetLogo-coordinate path per ring
  # or line; points become single-element paths.  Used by both draw and fill.
  collectPaths = (geom, paths) ->
    switch geom.getGeometryType()
      when "Point"
        paths.push([toNetLogo(geom.getCoordinate())]) unless geom.isEmpty()
      when "LineString", "LinearRing"
        paths.push(geom.getCoordinates().map(toNetLogo))
      when "Polygon"
        paths.push(geom.getExteriorRing().getCoordinates().map(toNetLogo))
        paths.push(geom.getInteriorRingN(i).getCoordinates().map(toNetLogo)) for i in [0...geom.getNumInteriorRing()]
      else
        collectPaths(geom.getGeometryN(i), paths) for i in [0...geom.getNumGeometries()]
    paths

  # (Any) => Array[VectorFeature]
  featuresOf = (arg) ->
    if arg?.gisType is "VectorDataset"
      arg.features
    else if arg?.gisType is "VectorFeature"
      [arg]
    else
      throw exceptions.extension("not a VectorDataset or VectorFeature: #{workspace.dump(arg)}")

  # (Any, Number) => Unit — port of Painting.DrawVector: stroke every geometry outline.
  # A one-point path is emitted as a zero-length round-capped line, which renders as a
  # dot of diameter `thickness` (matching desktop's point-drawn-as-circle).
  draw = (arg, thickness) ->
    core.getTransformation()
    rgb = ColorModel.colorToList(core.state.nlColor)
    for feature in featuresOf(arg)
      for path in collectPaths(feature.geometry, [])
        if path.length is 1
          [x, y] = path[0]
          updater.registerPenTrail(x, y, x, y, rgb, thickness, "down")
        else
          for i in [1...path.length]
            [x1, y1] = path[i - 1]
            [x2, y2] = path[i]
            updater.registerPenTrail(x1, y1, x2, y2, rgb, thickness, "down")
    return

  # (Any, Number) => Unit — port of Painting.FillVector.  Polygons fill with their holes
  # (even-odd); non-polygon geometries have no interior, so they fall back to a stroke,
  # as desktop's g.fill of an open path effectively does.
  fill = (arg, thickness) ->
    rgb = ColorModel.colorToList(core.state.nlColor)
    for feature in featuresOf(arg)
      geom = feature.geometry
      if geom.getGeometryType().indexOf("Polygon") >= 0
        rings = collectPaths(geom, [])
        updater.registerFillPolygon(rings, rgb) if rings.length > 0
      else
        draw(feature, thickness)
    return

  # (RasterDataset, Number) => Unit — port of Painting.PaintRaster.  Renders the raster
  # as a grayscale image (min=black, max=white; RangeColorModel) with NaN cells fully
  # transparent, and `transparency` (0-255) reducing every real cell's alpha.
  paint = (dataset, transparency) ->
    if transparency < 0 or transparency > 255
      throw exceptions.extension("transparency must be between 0 and 255")
    { dimensions, data } = dataset
    min = Number.MAX_VALUE
    max = -Number.MAX_VALUE
    for value in data when not isNaN(value)
      min = value if value < min
      max = value if value > max
    scale = 1.0 / (max - min)
    alpha = 255 - transparency
    bytes = new Uint8Array(data.length * 4)
    for value, i in data
      j = i * 4
      if isNaN(value)
        bytes[j] = bytes[j + 1] = bytes[j + 2] = bytes[j + 3] = 0
      else
        gray = Math.round((value - min) * scale * 255)
        gray = 0 if isNaN(gray) # flat raster (max == min): scale is Infinity
        bytes[j] = bytes[j + 1] = bytes[j + 2] = gray
        bytes[j + 3] = alpha
    topLeft     = core.gisToNetLogoRaw(new Coordinate(dimensions.getLeft(), dimensions.getTop()))
    bottomRight = core.gisToNetLogoRaw(new Coordinate(dimensions.getRight(), dimensions.getBottom()))
    updater.registerDrawRaster({
      width:  dimensions.gridWidth
      height: dimensions.gridHeight
      xMin:   topLeft.x
      xMax:   bottomRight.x
      yMin:   bottomRight.y
      yMax:   topLeft.y
      base64: shapefile.bytesToBase64(bytes)
    })
    return

  prims = {
    "DRAW":  (arg, thickness) -> draw(arg, thickness)
    "FILL":  (arg, thickness) -> fill(arg, thickness)
    "PAINT": (arg, transparency) -> paint(raster.getDataset(arg), transparency)
  }

  { prims }
