# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Port of the desktop extension's LoadDatasetFromString.java, LoadDataset.java (the
# in-memory paths), and io/geojson/GeoJsonReader.java

JSTS = require('jsts/dist/jsts.min.js')
{ unzipSync, zipSync, strToU8, strFromU8 } = require('fflate')
{ exceptionFactory: exceptions } = require('util/exception')
{ checks } = require('../engine/core/typechecker')

{ Coordinate } = JSTS.geom

ADDED_Z_FIELD = "_Z"

GEOJSON_SHAPE_TYPES = {
  "Point":           "POINT"
  "MultiPoint":      "POINT"
  "LineString":      "LINE"
  "MultiLineString": "LINE"
  "Polygon":         "POLYGON"
  "MultiPolygon":    "POLYGON"
}

# (String) => String
normalizeFormat = (format) ->
  result = format.trim().toLowerCase()
  if result.startsWith(".") then result.substring(1) else result

# (Any) => "NUMBER" | "STRING"
propertyTypeForValue = (value) ->
  if checks.isNumber(value) then "NUMBER" else "STRING"

class PointZWrapper
  # (Point, Number)
  constructor: (@point, @z) ->

class GeoJsonReader

  # (Object, GeometryFactory)
  constructor: (json, @factory) ->
    @containsDefaultValues    = false
    @shouldAddZField          = false
    @shouldWarnUnusedZ        = false
    @propertyNamesToDatatypes = new Map()
    @geojson = json

    topLevelType = String(json.type)
    if topLevelType is "FeatureCollection"
      @parseFeatureCollection()
    else if topLevelType is "Feature"
      @parseSingleFeatureDataset()
    else if GEOJSON_SHAPE_TYPES[topLevelType]?
      @parseSingleGeometryDataset()
    else
      throw exceptions.extension("#{topLevelType} is not a supported GeoJSON type")

  # (Object) => Unit
  extractShapeInfo: (geometry) ->
    geometryTypeString = String(geometry.type)
    if not GEOJSON_SHAPE_TYPES[geometryTypeString]?
      throw exceptions.extension("#{geometryTypeString}is not a supported geojson geometry type")
    @shapeType        = GEOJSON_SHAPE_TYPES[geometryTypeString]
    @geojsonShapeType = geometryTypeString
    return

  # (Object) => Unit
  parseSchemaOfSingleFeature: (feature) ->
    for name, value of feature.properties
      newType = propertyTypeForValue(value)
      if @propertyNamesToDatatypes.has(name)
        existingType = @propertyNamesToDatatypes.get(name)
        if existingType isnt newType
          throw exceptions.extension("All features properties of the same name must be of the same datatype. The property #{name}has one value of type of #{existingType}and one property type of #{newType}")
      else
        @propertyNamesToDatatypes.set(name, newType)
    return

  # () => Unit
  finalizeSchema: ->
    @propertyNames = []
    @propertyTypes = []
    @propertyNamesToDatatypes.forEach( (type, name) =>
      @propertyNames.push(name)
      @propertyTypes.push(type)
    )
    return

  # (Object, Number) => Unit
  parseGeometryObject: (geometry, featureIndex) ->
    if String(geometry.type) isnt @geojsonShapeType
      throw exceptions.extension("Only homogenous FeatureCollections are supported")
    @geometries[featureIndex] = @parseCoordinates(geometry.coordinates, @geojsonShapeType)
    return

  # (Object, Number) => Unit
  parseFeatureObject: (feature, featureIndex) ->
    @parseGeometryObject(feature.geometry, featureIndex)
    values = []
    for name, i in @propertyNames
      if not Object.prototype.hasOwnProperty.call(feature.properties, name)
        @containsDefaultValues = true
        values.push(if @propertyTypes[i] is "NUMBER" then 0.0 else "")
      else
        value = feature.properties[name]
        if @propertyTypes[i] is "NUMBER"
          values.push(value)
        else if value? and typeof value is "object"
          values.push(JSON.stringify(value))
        else
          values.push(String(value))
    @propertyValues[featureIndex] = values
    return

  # () => Unit
  parseFeatureCollection: ->
    features = @geojson.features
    if not checks.isList(features) or features.length < 1
      throw exceptions.extension("Each FeatureCollection must have at least one feature.")
    @size           = features.length
    @geometries     = []
    @propertyValues = []
    @extractShapeInfo(features[0].geometry)
    @parseSchemaOfSingleFeature(feature) for feature in features
    @finalizeSchema()
    @parseFeatureObject(feature, i) for feature, i in features
    return

  # () => Unit
  parseSingleFeatureDataset: ->
    @size           = 1
    @geometries     = []
    @propertyValues = []
    @extractShapeInfo(@geojson.geometry)
    @parseSchemaOfSingleFeature(@geojson)
    @finalizeSchema()
    @parseFeatureObject(@geojson, 0)
    return

  # () => Unit
  parseSingleGeometryDataset: ->
    @size           = 1
    @geometries     = []
    @propertyValues = [[]]
    @extractShapeInfo(@geojson)
    @finalizeSchema()
    @parseGeometryObject(@geojson, 0)
    return

  # (Array[Number]) => Coordinate
  pairToCoordinate: (arr) ->
    if arr.length > 2
      @shouldWarnUnusedZ = true
    new Coordinate(arr[0], arr[1])

  # (Array[Array[Number]]) => LineString
  parseSingleLineString: (coordinates) ->
    @factory.createLineString(coordinates.map((pair) => @pairToCoordinate(pair)))

  # (Array[Array[Array[Number]]]) => Polygon
  parseSingleComplexPolygon: (coordinates) ->
    if coordinates.length < 1
      throw exceptions.extension("Empty polygon in geojson file")
    shell = @factory.createLinearRing(coordinates[0].map((pair) => @pairToCoordinate(pair)))
    holes = coordinates[1..].map((ring) => @factory.createLinearRing(ring.map((pair) => @pairToCoordinate(pair))))
    @factory.createPolygon(shell, holes)

  # (Any, String) => Geometry | PointZWrapper
  parseCoordinates: (coordinates, geojsonShapeType) ->
    switch geojsonShapeType
      when "Point"
        point = @factory.createPoint(@pairToCoordinate(coordinates))
        if coordinates.length is 3
          @shouldAddZField = true
          new PointZWrapper(point, coordinates[2])
        else
          point
      when "MultiPoint"
        @factory.createMultiPoint(coordinates.map((pair) => @factory.createPoint(@pairToCoordinate(pair))))
      when "LineString"
        @parseSingleLineString(coordinates)
      when "MultiLineString"
        @factory.createMultiLineString(coordinates.map((line) => @parseSingleLineString(line)))
      when "Polygon"
        @parseSingleComplexPolygon(coordinates)
      when "MultiPolygon"
        if coordinates.length < 1
          throw exceptions.extension("One of the MultiPolygons has no polygons within it")
        @factory.createMultiPolygon(coordinates.map((poly) => @parseSingleComplexPolygon(poly)))
      else
        throw exceptions.extension("#{geojsonShapeType} is not a supported geojson shape type")

# port of io/asciigrid/AsciiGridFileReader.java
# (String) => { columnCount: Number, rowCount: Number, originX: Number, originY: Number, cellSize: Number, data: Float64Array }
parseAsciiGrid = (text) ->
  lines     = text.split(/\r?\n/)
  lineIndex = 0
  # () => String | null
  readLine  = -> if lineIndex < lines.length then lines[lineIndex++] else null

  # (String, String, String) => Number
  parseHeader = (keyword, kind, errorMessage) ->
    tokens = (readLine() ? "").trim().split(/\s+/)
    if not (tokens[0] ? "").toUpperCase().startsWith(keyword)
      throw exceptions.extension(errorMessage)
    value = Number(tokens[1])
    if isNaN(value) or (kind is "int" and not Number.isInteger(value))
      throw exceptions.extension("error parsing number")
    value

  columnCount = parseHeader("NCOLS",     "int",    "invalid column count marker on line 1")
  rowCount    = parseHeader("NROWS",     "int",    "invalid row count marker on line 2")
  originX     = parseHeader("XLLCORNER", "double", "invalid corner x on line 3")
  originY     = parseHeader("YLLCORNER", "double", "invalid corner y on line 4")
  cellSize    = parseHeader("CELLSIZE",  "double", "invalid cell size on line 5")

  nanValue   = NaN
  cachedLine = null
  lastLine   = readLine() ? ""
  lastTokens = lastLine.trim().split(/\s+/)
  if (lastTokens[0] ? "").toUpperCase().startsWith("NODATA_VALUE")
    if lastTokens.length > 1
      nanValue = Number(lastTokens[1])
  else
    cachedLine = lastLine

  size = columnCount * rowCount
  data = new Float64Array(size)
  data.fill(NaN)
  index = 0
  loop
    line =
      if cachedLine?
        [l, cachedLine] = [cachedLine, null]
        l
      else
        readLine()
    break if not line?
    for token in line.trim().split(/\s+/) when token.length > 0
      parsed = parseFloat(token)
      value = if not isNaN(parsed) and parsed isnt nanValue then parsed else NaN
      data[index++] = value
      break if index >= size
    break if index >= size

  { columnCount, rowCount, originX, originY, cellSize, data }

SHAPE_TYPE_TO_INFO = {
  1:  { shapeType: "POINT" }                       # Point
  8:  { shapeType: "POINT" }                       # MultiPoint
  11: { shapeType: "POINT", shouldAddZ: true }     # PointZ
  18: { shapeType: "POINT" }                       # MultiPointZ (Z stripped)
  3:  { shapeType: "LINE" }                        # PolyLine
  13: { shapeType: "LINE" }                        # PolyLineZ (Z stripped)
  5:  { shapeType: "POLYGON" }                     # Polygon
  15: { shapeType: "POLYGON" }                     # PolygonZ (Z stripped)
}

# (GisCore, GisProjection, GisVector, GisRaster, Workspace) => GisIO
module.exports = ({ core, projection, vector, raster, workspace }) ->

  shapefile = require('extensions/gis-shapefile')

  { VectorDataset } = vector

  # port of LoadDatasetFromString.loadShapefileFromParts + LoadDataset.loadShapefile
  # (List) => VectorDataset
  loadShapefileFromParts = (parts) ->
    shpBytes = null
    dbfBytes = null
    prjText  = null
    for entry in parts
      if not checks.isList(entry) or entry.length isnt 2 or
         not checks.isString(entry[0]) or not checks.isString(entry[1])
        throw exceptions.extension("expected a two-element [extension content] list of strings, but got #{workspace.dump(entry, true)}")
      extension = normalizeFormat(entry[0])
      # (String) => Uint8Array
      decoded = (content) ->
        try
          shapefile.base64ToBytes(content)
        catch
          throw exceptions.extension("invalid base64 content for \"#{extension}\" entry")
      switch extension
        when "shp" then shpBytes = decoded(entry[1])
        when "dbf" then dbfBytes = decoded(entry[1])
        when "prj" then prjText = entry[1]
        # any other entries (like "shx") are not needed to read a shapefile
    if not shpBytes?
      throw exceptions.extension("missing \"shp\" entry in shapefile data list")
    if not dbfBytes?
      throw exceptions.extension("missing \"dbf\" entry in shapefile data list")
    loadShapefileData(shpBytes, dbfBytes, prjText)

  # metadata entries that macOS's built-in zip tool adds and that should never be
  # treated as shapefile contents
  # (String) => Boolean
  isMetadataEntry = (name) ->
    baseName = name.substring(name.lastIndexOf("/") + 1)
    name.startsWith("__MACOSX/") or baseName.startsWith(".")

  # port of LoadDatasetFromString.loadShapefileFromZip
  # (String) => VectorDataset
  loadShapefileFromZip = (base64) ->
    zipBytes =
      try
        shapefile.base64ToBytes(base64)
      catch
        throw exceptions.extension("invalid base64 content for shapefile zip data")
    rawEntries =
      try
        unzipSync(zipBytes)
      catch
        throw exceptions.extension("shapefile data is not a zip archive or the zip is empty")
    entries = new Map()
    for name, bytes of rawEntries
      if not name.endsWith("/") and not isMetadataEntry(name)
        entries.set(name.toLowerCase(), bytes)
    if entries.size is 0
      throw exceptions.extension("shapefile data is not a zip archive or the zip is empty")
    shpName = null
    entries.forEach( (_, name) ->
      if name.endsWith(".shp")
        if shpName?
          throw exceptions.extension("found more than one \".shp\" file in the shapefile zip data")
        shpName = name
    )
    if not shpName?
      throw exceptions.extension("no \".shp\" file found in the shapefile zip data")
    baseName = shpName.substring(0, shpName.length - "shp".length)
    dbfBytes = entries.get(baseName + "dbf")
    if not dbfBytes?
      throw exceptions.extension("no \".dbf\" file matching \"#{shpName}\" found in the shapefile zip data")
    prjBytes = entries.get(baseName + "prj")
    prjText  = if prjBytes? then strFromU8(prjBytes) else null
    loadShapefileData(entries.get(shpName), dbfBytes, prjText)

  # (Uint8Array, Uint8Array, String | null) => VectorDataset
  loadShapefileData = (shpBytes, dbfBytes, prjText) ->
    srcProj = if prjText? then projection.parseProjection(prjText) else null
    dstProj = core.state.projection
    reproject = srcProj? and dstProj? and not projection.projectionsEqual(srcProj, dstProj)

    shpData = shapefile.readShapefile(shpBytes, core.factory)
    dbfData = shapefile.readDbf(dbfBytes)

    info = SHAPE_TYPE_TO_INFO[shpData.shapeType]
    if not info?
      throw exceptions.extension("unsupported shape type #{shpData.shapeType}")

    propertyNames = dbfData.fields.map((field) -> field.name)
    propertyTypes = dbfData.fields.map((field) -> if field.type in ["N", "F"] then "NUMBER" else "STRING")
    if info.shouldAddZ
      propertyNames = propertyNames.concat([ADDED_Z_FIELD])
      propertyTypes = propertyTypes.concat(["NUMBER"])

    dataset = new VectorDataset(info.shapeType, propertyNames, propertyTypes, core)
    for geometry, i in shpData.geometries
      values = dbfData.records[i] ? []
      z = 0.0
      if geometry.point? # PointZWrapper
        z = geometry.z
        geometry = geometry.point
      if reproject
        geometry = projection.reprojectGeometry(core.factory, geometry, srcProj, dstProj)
      if info.shouldAddZ
        values = values.concat([z])
      dataset.add(geometry, values)
    dataset

  # port of LoadDataset.loadGeoJson.  The desktop's schema/default-value warnings go to
  # a GUI dialog or stderr, not model output, so they are not surfaced here.
  # (String, String) => VectorDataset
  loadGeoJson = (text, sourceName) ->
    json =
      try
        JSON.parse(text)
      catch
        throw exceptions.extension("Error parsing #{sourceName}")
    srcProj = new projection.Geographic(projection.Ellipsoid.WGS_84, new Coordinate(0.0, 0.0), projection.DEGREES_TO_RADIANS)
    dstProj = core.state.projection
    reproject = dstProj? and not projection.projectionsEqual(srcProj, dstProj)

    reader = new GeoJsonReader(json, core.factory)

    propertyNames = reader.propertyNames.slice()
    propertyTypes = reader.propertyTypes.slice()
    if reader.shouldAddZField
      propertyNames.push(ADDED_Z_FIELD)
      propertyTypes.push("NUMBER")

    dataset = new VectorDataset(reader.shapeType, propertyNames, propertyTypes, core)
    for geometry, i in reader.geometries
      values = reader.propertyValues[i]
      z = null
      if geometry instanceof PointZWrapper
        z = geometry.z
        geometry = geometry.point
      if reproject
        geometry = projection.reprojectGeometry(core.factory, geometry, srcProj, dstProj)
      if z?
        values = values.concat([z])
      dataset.add(geometry, values)
    dataset

  # port of LoadDataset.setDefaultTransformationIfUnset
  # (VectorDataset | RasterDataset) => Unit
  setDefaultTransformationIfUnset = (dataset) ->
    if not core.state.transformation?
      core.state.transformation =
        new core.CoordinateTransformation(dataset.getEnvelope(), core.worldNetLogoEnvelope(), true)
    return

  # Java DecimalFormat-style: up to maxDigits fraction digits, trailing zeros dropped.
  # (Rounding is JS default rather than Java's HALF_EVEN; differs only on exact ties.)
  # (Number, Number) => String
  decimalFormat = (value, maxDigits) ->
    s = value.toFixed(maxDigits)
    if s.indexOf(".") >= 0
      s = s.replace(/0+$/, "").replace(/\.$/, "")
    s

  # port of io/geojson/GeoJsonWriter.java
  # (VectorDataset) => String
  writeGeoJson = (dataset) ->
    # (Coordinate) => Array[Number]
    coordArray = (c) -> [c.x, c.y]
    # (LineString) => Array[Array[Number]]
    lineStringArray = (line) ->
      (coordArray(line.getCoordinateN(i)) for i in [0...line.getNumPoints()])
    # (Polygon) => Array[Array[Array[Number]]]
    polygonArray = (polygon) ->
      rings = [lineStringArray(polygon.getExteriorRing())]
      rings.push(lineStringArray(polygon.getInteriorRingN(i))) for i in [0...polygon.getNumInteriorRing()]
      rings
    # (Geometry) => Array[Geometry]
    childrenOf = (geom) -> (geom.getGeometryN(i) for i in [0...geom.getNumGeometries()])
    # (Geometry) => Object
    geometryObject = (geom) ->
      switch geom.getGeometryType()
        when "Point"           then { type: "Point",           coordinates: coordArray(geom.getCoordinate()) }
        when "MultiPoint"      then { type: "MultiPoint",      coordinates: childrenOf(geom).map((p) -> coordArray(p.getCoordinate())) }
        when "LineString"      then { type: "LineString",      coordinates: lineStringArray(geom) }
        when "MultiLineString" then { type: "MultiLineString", coordinates: childrenOf(geom).map(lineStringArray) }
        when "Polygon"         then { type: "Polygon",         coordinates: polygonArray(geom) }
        when "MultiPolygon"    then { type: "MultiPolygon",    coordinates: childrenOf(geom).map(polygonArray) }
        else {}
    features = dataset.features.map( (feature) ->
      properties = {}
      for property in dataset.properties
        properties[property.name] = feature.getProperty(property.name) ? null
      { type: "Feature", geometry: geometryObject(feature.geometry), properties }
    )
    JSON.stringify({ type: "FeatureCollection", features })

  # port of io/asciigrid/AsciiGridFileWriter.java (with NaN nodata, per StoreDataset)
  # (RasterDataset) => String
  writeAsciiGrid = (dataset) ->
    { dimensions, data } = dataset
    lines = [
      "NCOLS #{dimensions.gridWidth}"
      "NROWS #{dimensions.gridHeight}"
      "XLLCORNER #{decimalFormat(dimensions.getLeft(), 6)}"
      "YLLCORNER #{decimalFormat(dimensions.getBottom(), 6)}"
      "CELLSIZE #{decimalFormat(Math.min(dimensions.getCellWidth(), dimensions.getCellHeight()), 6)}"
      "NODATA_VALUE NaN"
    ]
    out = lines.join("\n") + "\n"
    for value, i in data
      if i > 0 and i % dimensions.gridWidth is 0
        out += "\n"
      out += (if isNaN(value) then "NaN" else decimalFormat(value, 10)) + " "
    out

  prims = {

    "STORE-DATASET-TO-STRING": (dataset, rawFormat) ->
      format = normalizeFormat(rawFormat)
      if format is "geojson" or format is "json"
        if dataset?.gisType isnt "VectorDataset"
          throw exceptions.extension("expected a VectorDataset to store as #{format}")
        writeGeoJson(dataset)
      else if format is "asc" or format is "grd"
        if dataset?.gisType isnt "RasterDataset"
          throw exceptions.extension("expected a RasterDataset to store as #{format}")
        writeAsciiGrid(dataset)
      else if format is "shp"
        if dataset?.gisType isnt "VectorDataset"
          throw exceptions.extension("expected a VectorDataset to store as #{format}")
        # port of StoreDatasetToString.storeShapefileToZipString; the base name only
        # matters if the zip is unpacked, since the loader finds the ".shp" by extension
        { shp, shx, dbf } = shapefile.writeShapefile(dataset)
        entries = {
          "dataset.shp": shp
          "dataset.shx": shx
          "dataset.dbf": dbf
        }
        if core.state.projection?.wktSource?
          entries["dataset.prj"] = strToU8(core.state.projection.wktSource)
        shapefile.bytesToBase64(zipSync(entries))
      else
        throw exceptions.extension("unsupported data format #{rawFormat}")

    "STORE-DATASET-TO-STRINGS": (dataset, rawFormat) ->
      format = normalizeFormat(rawFormat)
      if format is "shp"
        if dataset?.gisType isnt "VectorDataset"
          throw exceptions.extension("expected a VectorDataset to store as #{format}")
        { shp, shx, dbf } = shapefile.writeShapefile(dataset)
        result = [
          ["shp", shapefile.bytesToBase64(shp)]
          ["shx", shapefile.bytesToBase64(shx)]
          ["dbf", shapefile.bytesToBase64(dbf)]
        ]
        if core.state.projection?.wktSource?
          result.push(["prj", core.state.projection.wktSource])
        result
      else if format in ["geojson", "json", "asc", "grd"]
        throw exceptions.extension("#{format} produces a single string; use gis:store-dataset-to-string")
      else
        throw exceptions.extension("unsupported data format #{rawFormat}")

    "LOAD-DATASET-FROM-STRING": (rawFormat, data) ->
      format = normalizeFormat(rawFormat)
      result =
        if format is "shp"
          # a shapefile can come in as either a base64 zip string of its files or a
          # list of [extension content] pairs
          if checks.isList(data)
            loadShapefileFromParts(data)
          else
            loadShapefileFromZip(data)
        else if format is "geojson" or format is "json"
          loadGeoJson(data, "GeoJSON data string")
        else if format is "asc" or format is "grd"
          # like a missing .prj file, string data is assumed to be in the current projection
          grid = parseAsciiGrid(data)
          envelope = new JSTS.geom.Envelope(grid.originX, grid.originX + (grid.cellSize * grid.columnCount),
                                            grid.originY, grid.originY + (grid.cellSize * grid.rowCount))
          dimensions = new raster.GridDimensions(grid.columnCount, grid.rowCount, envelope)
          new raster.RasterDataset(dimensions, grid.data, core)
        else
          throw exceptions.extension("unsupported data format #{rawFormat}")
      setDefaultTransformationIfUnset(result)
      result
  }

  {
    prims
  , loadGeoJson
  , setDefaultTransformationIfUnset
  , normalizeFormat
  }
