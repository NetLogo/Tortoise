# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Port of the desktop extension's VectorDataset.java, VectorFeature.java, Vertex.java,
# VectorDatasetSearch.java, SpatialRelationship.java, and GetShapeType.java

JSTS   = require('jsts/dist/jsts.min.js')
earcut = require('earcut')
{ exceptionFactory: exceptions } = require('util/exception')
{ checks } = require('../engine/core/typechecker')
PatchSet   = require('../engine/core/patchset')
# `Nobody` is a runtime global, as elsewhere in the engine

{ Envelope, Coordinate, Location } = JSTS.geom
{ Centroid }                       = JSTS.algorithm
{ IndexedPointInAreaLocator }      = JSTS.algorithm.locate
{ STRtree }                        = JSTS.index.strtree

# (Any) => String — mimics Java's `String.valueOf` on property values (Double 5 -> "5.0"), which desktop
# uses for both wildcard matching and feature dumps
javaToString = (value) ->
  if checks.isNumber(value) and Number.isInteger(value) and Math.abs(value) < 1e7
    "#{value}.0"
  else
    String(value)

# (Array[Number], Number) => Number — Java's Arrays.binarySearch: index of match, or -(insertion point) - 1
javaBinarySearch = (arr, key) ->
  low  = 0
  high = arr.length - 1
  while low <= high
    mid = (low + high) >>> 1
    if arr[mid] < key
      low = mid + 1
    else if arr[mid] > key
      high = mid - 1
    else
      return mid
  -(low + 1)

# (String|Number, String|Number) => Number — Java's Double.compare / String.compareTo
compareValues = (a, b) ->
  if checks.isNumber(a) and checks.isNumber(b)
    if a < b then -1
    else if a > b then 1
    else if isNaN(a) then (if isNaN(b) then 0 else 1)
    else if isNaN(b) then -1
    else 0
  else
    if a < b then -1 else if a > b then 1 else 0

# (String) => (String) => Boolean
# port of StringUtils.WildcardMatcher: only `*` runs that produce empty splits become
# wildcards, exactly as desktop does
makeWildcardMatcher = (pattern) ->
  escapeRegExp = (s) -> s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  body = pattern.split("*").map((s) -> if s is "" then ".*" else escapeRegExp(s)).join("")
  regex = new RegExp("^(?:#{body})$")
  (str) -> regex.test(str)

class Vertex
  gisType: "Vertex"

  # (Coordinate)
  constructor: (@coordinate) ->

  # () => String
  dumpContents: -> ""

class VectorFeature
  gisType: "VectorFeature"

  # (String, Geometry, Array[{name, type}], Array[Any])
  constructor: (@shapeType, @geometry, properties, propertyValues) ->
    @properties = new Map()
    for property, i in properties
      @properties.set(property.name, propertyValues[i])
    @_triangles      = null
    @_cumativeAreas  = null
    @_totalArea      = 0

  # () => Envelope
  getEnvelope: -> @geometry.getEnvelopeInternal()

  # () => Geometry
  getGeometry: -> @geometry

  # (Coordinate) => Boolean — equivalent to geometry.contains(point) but backed by an
  # IndexedPointInAreaLocator, so repeated point-in-polygon tests (coverage samples
  # thousands against complex polygons) are O(log n) instead of O(edges).  Only polygonal
  # geometries have an interior to contain a point; others report false.
  containsPoint: (coord) ->
    if @_pointLocator is undefined
      type = @geometry.getGeometryType()
      @_pointLocator = if type is "Polygon" or type is "MultiPolygon" then new IndexedPointInAreaLocator(@geometry) else null
    @_pointLocator? and @_pointLocator.locate(coord) is Location.INTERIOR

  # (String) => Boolean
  hasProperty: (name) -> @properties.has(name)

  # (String) => Any
  getProperty: (name) -> @properties.get(name.toUpperCase())

  # () => String
  dumpContents: ->
    result = ""
    @properties.forEach( (value, name) ->
      result += "[\"#{name}\":\"#{javaToString(value)}\"]"
    )
    result

  _setupTriangulation: ->
    @_triangles     = []
    @_cumativeAreas = []
    for n in [0...@geometry.getNumGeometries()]
      polygon = @geometry.getGeometryN(n)
      continue if polygon.isEmpty()
      rings = [polygon.getExteriorRing().getCoordinates()]
      for i in [0...polygon.getNumInteriorRing()]
        rings.push(polygon.getInteriorRingN(i).getCoordinates())
      vertices  = []
      holes     = []
      for ring, r in rings
        holes.push(vertices.length / 2) if r > 0
        # drop each ring's closing coordinate; earcut expects open rings
        for c in ring[...-1]
          vertices.push(c.x, c.y)
      indices = earcut(vertices, holes, 2)
      for t in [0...indices.length] by 3
        [i1, i2, i3] = [indices[t], indices[t + 1], indices[t + 2]]
        triangle = [
          [vertices[i1 * 2], vertices[i1 * 2 + 1]]
          [vertices[i2 * 2], vertices[i2 * 2 + 1]]
          [vertices[i3 * 2], vertices[i3 * 2 + 1]]
        ]
        [a, b, c] = triangle
        area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2
        @_totalArea += area
        @_triangles.push(triangle)
        @_cumativeAreas.push(@_totalArea)
    if @_triangles.length is 0
      throw exceptions.extension("There was an error trying to generate a point inside the following polygon. Points can only be generated inside polygons with non-zero area *after* being projected into the current coordinate system. Did all of your data import and project how you expected it to?#{@dumpContents()}\n")
    return

  # (RNG) => Coordinate
  # matches desktop's RNG draw pattern exactly (one draw for the triangle, two for the
  # point) so the world RNG stays in sync with desktop even though the triangulations
  # differ (desktop uses Tinfour; we use earcut)
  getRandomPointInsidePolygon: (rng) ->
    if @shapeType isnt "POLYGON"
      throw exceptions.extension("Tried to get a point inside of a non-polygon vector feature")
    if not @_triangles?
      @_setupTriangulation()
    randBetween   = rng.nextDouble() * @_totalArea
    triangleIndex = (0 - javaBinarySearch(@_cumativeAreas, randBetween)) - 1
    [pA, pB, pC]  = @_triangles[triangleIndex]
    weightB = rng.nextDouble()
    weightC = rng.nextDouble()
    if weightB + weightC > 1.0
      weightB = 1.0 - weightB
      weightC = 1.0 - weightC
    x = weightB * (pB[0] - pA[0]) + weightC * (pC[0] - pA[0]) + pA[0]
    y = weightB * (pB[1] - pA[1]) + weightC * (pC[1] - pA[1]) + pA[1]
    new JSTS.geom.Coordinate(x, y)

class VectorDataset
  gisType: "VectorDataset"

  # (String, Array[String], Array[String], GisCore) — types are "STRING" | "NUMBER"
  constructor: (@shapeType, propertyNames, propertyTypes, core) ->
    @properties    = propertyNames.map((name, i) -> { name: name.toUpperCase(), type: propertyTypes[i] })
    @features      = []
    @envelope      = new Envelope()
    @spatialIndex  = new STRtree()
    core.state.datasetCount += 1

  # (Geometry, Array[Any]) => Unit
  add: (geometry, propertyValues) ->
    feature = new VectorFeature(@shapeType, geometry, @properties, propertyValues)
    feature.datasetIndex = @features.length
    @envelope.expandToInclude(feature.getEnvelope())
    @features.push(feature)
    @spatialIndex.insert(feature.getEnvelope(), feature)
    return

  # (Geometry) => Array[VectorFeature] — port of desktop's spatial-index lookup: the
  # STRtree prunes to features whose envelope overlaps, avoiding an intersects test
  # against every feature (which makes patch-by-patch coverage O(patches x features)).
  # For the common case of a patch sitting inside a feature, a cheap point-in-polygon on
  # the patch center short-circuits the expensive full intersects.  Results are returned
  # in dataset (insertion) order, since coverage aggregation is order-sensitive on ties,
  # whereas the index yields them in an arbitrary order.
  intersectingFeatures: (geom) ->
    env    = geom.getEnvelopeInternal()
    center = new Coordinate((env.getMinX() + env.getMaxX()) / 2.0, (env.getMinY() + env.getMaxY()) / 2.0)
    matches = (feature for feature in @spatialIndex.query(env).toArray() when feature.containsPoint(center) or geom.intersects(feature.geometry))
    matches.sort((a, b) -> a.datasetIndex - b.datasetIndex)

  # () => Envelope
  getEnvelope: -> new Envelope(@envelope)

  # (String) => Boolean
  isValidPropertyName: (name) ->
    @properties.some((p) -> p.name is name)

  # () => String
  dumpContents: -> ""

# (GisCore, Workspace) => GisVector
module.exports = ({ core, workspace }) ->

  { factory } = core

  # (Any) => Boolean
  isAgent    = (x) -> checks.isTurtle(x) or checks.isPatch(x) or checks.isLink(x)

  # (Any) => Boolean
  isAgentSet = (x) -> checks.isTurtleSet(x) or checks.isPatchSet(x) or checks.isLinkSet(x)

  # (Any) => VectorDataset
  getDataset = (arg) ->
    if arg?.gisType is "VectorDataset"
      arg
    else
      throw exceptions.extension("not a VectorDataset: #{workspace.dump(arg)}")

  # (Any) => VectorFeature
  getFeature = (arg) ->
    if arg?.gisType is "VectorFeature"
      arg
    else
      throw exceptions.extension("not a VectorFeature: #{workspace.dump(arg)}")

  # (VectorDataset, String) => String
  getPropertyName = (dataset, name) ->
    propertyName = name.toUpperCase()
    if dataset.isValidPropertyName(propertyName)
      propertyName
    else
      throw exceptions.extension("dataset does not have property: '#{propertyName}'")

  # (Array[Geometry]) => Geometry
  # port of JTSUtils.flatten: collects atomic geometries, preferring polygons over
  # lines over points, exactly as desktop does
  flatten = (geoms) ->
    points   = []
    lines    = []
    polygons = []
    walk = (geom) ->
      type = geom.getGeometryType()
      switch type
        when "Point"                  then points.push(geom)
        when "LineString", "LinearRing" then lines.push(geom)
        when "Polygon"                then polygons.push(geom)
        else
          walk(geom.getGeometryN(i)) for i in [0...geom.getNumGeometries()]
      return
    geoms.forEach(walk)
    if polygons.length > 0
      factory.createMultiPolygon(polygons)
    else if lines.length > 0
      factory.createMultiLineString(lines)
    else
      factory.createMultiPoint(points)

  # (Any) => Geometry — port of SpatialRelationship.getGeometry
  getGeometry = (arg) ->
    if arg?.gisType is "VectorDataset"
      flatten(arg.features.map((f) -> f.geometry))
    else if arg?.gisType is "VectorFeature"
      arg.geometry
    else if isAgent(arg)
      core.agentGeometry(arg)
    else if isAgentSet(arg)
      flatten(arg.toArray().map(core.agentGeometry))
    else if checks.isList(arg)
      flatten(arg.map(getGeometry))
    else
      throw exceptions.extension("not a VectorFeature, Agent, AgentSet, or List: #{workspace.dump(arg)}")

  # (VectorDataset, String, String|Number) => Array[VectorFeature]
  findMatching = (dataset, propertyName, target) ->
    if checks.isString(target)
      matches = makeWildcardMatcher(target)
      dataset.features.filter( (feature) ->
        value = feature.getProperty(propertyName)
        value? and matches(javaToString(value))
      )
    else
      dataset.features.filter( (feature) ->
        value = feature.getProperty(propertyName)
        value? and checks.isNumber(value) and value is target
      )

  # (VectorDataset, String, Number) => String|Number|null
  findExtreme = (dataset, name, direction) ->
    propertyName = getPropertyName(dataset, name)
    result = null
    for feature in dataset.features
      value = feature.getProperty(propertyName)
      if value? and (not result? or compareValues(result, value) is direction)
        continue if checks.isNumber(value) and isNaN(value) # careful! don't accept NaN values
        result = value
    result

  # (Geometry, Array[Array[Vertex]]) => Unit
  collectVertexLists = (geom, result) ->
    switch geom.getGeometryType()
      when "Point"
        result.push([new Vertex(geom.getCoordinate())])
      when "LineString", "LinearRing"
        result.push(geom.getCoordinates().map((c) -> new Vertex(c)))
      when "Polygon"
        collectVertexLists(geom.getExteriorRing(), result)
        collectVertexLists(geom.getInteriorRingN(i), result) for i in [0...geom.getNumInteriorRing()]
      else
        collectVertexLists(geom.getGeometryN(i), result) for i in [0...geom.getNumGeometries()]
    return

  prims = {

    "TYPE-OF": (arg) ->
      if arg?.gisType is "VectorDataset"
        "VECTOR"
      else if arg?.gisType is "RasterDataset"
        "RASTER"
      else
        throw exceptions.extension("not a GIS dataset: #{workspace.dump(arg)}")

    "SHAPE-TYPE-OF": (arg) ->
      if arg?.gisType is "VectorDataset" or arg?.gisType is "VectorFeature"
        arg.shapeType
      else
        throw exceptions.extension("not a VectorFeature or VectorDataset: #{workspace.dump(arg)}")

    "PROPERTY-NAMES": (arg) ->
      getDataset(arg).properties.map((p) -> p.name)

    "FEATURE-LIST-OF": (arg) ->
      getDataset(arg).features.slice()

    "VERTEX-LISTS-OF": (arg) ->
      result = []
      collectVertexLists(getFeature(arg).geometry, result)
      result

    "CENTROID-OF": (arg) ->
      new Vertex(Centroid.getCentroid(getFeature(arg).geometry))

    "RANDOM-POINT-INSIDE": (arg) ->
      new Vertex(getFeature(arg).getRandomPointInsidePolygon(workspace.rng))

    "LOCATION-OF": (arg) ->
      if arg?.gisType isnt "Vertex"
        throw exceptions.extension("not a Vertex: #{workspace.dump(arg)}")
      if arg.coordinate?
        c = core.gisToNetLogo(arg.coordinate)
        if c? then [c.x, c.y] else []
      else
        []

    "PROPERTY-VALUE": (arg, name) ->
      feature = getFeature(arg)
      key = name.toUpperCase()
      if feature.hasProperty(key)
        feature.getProperty(key) ? Nobody
      else
        throw exceptions.extension("feature does not have property '#{key}'")

    "SET-PROPERTY-VALUE": (arg, name, value) ->
      feature = getFeature(arg)
      key = name.toUpperCase()
      if not feature.hasProperty(key)
        throw exceptions.extension("feature does not have property '#{key}'")
      current = feature.getProperty(key)
      if checks.isString(value)
        if checks.isString(current)
          feature.properties.set(key, value)
        else
          throw exceptions.extension("Tried to set a string property to a number value")
      else
        if checks.isNumber(current)
          feature.properties.set(key, value)
        else
          throw exceptions.extension("Tried to set a numeric property to a string value")
      return

    "FIND-FEATURES": (arg, name, value) ->
      dataset = getDataset(arg)
      findMatching(dataset, getPropertyName(dataset, name), value)

    "FIND-ONE-FEATURE": (arg, name, value) ->
      dataset = getDataset(arg)
      findMatching(dataset, getPropertyName(dataset, name), value)[0] ? Nobody

    "FIND-LESS-THAN": (arg, name, max) ->
      dataset = getDataset(arg)
      propertyName = getPropertyName(dataset, name)
      dataset.features.filter( (feature) ->
        value = feature.getProperty(propertyName)
        value? and compareValues(max, value) > 0
      )

    "FIND-GREATER-THAN": (arg, name, min) ->
      dataset = getDataset(arg)
      propertyName = getPropertyName(dataset, name)
      dataset.features.filter( (feature) ->
        value = feature.getProperty(propertyName)
        value? and compareValues(min, value) < 0
      )

    "FIND-RANGE": (arg, name, min, max) ->
      dataset = getDataset(arg)
      propertyName = getPropertyName(dataset, name)
      dataset.features.filter( (feature) ->
        value = feature.getProperty(propertyName)
        value? and compareValues(min, value) < 0 and compareValues(max, value) > 0
      )

    "PROPERTY-MINIMUM": (arg, name) ->
      findExtreme(getDataset(arg), name, 1)

    "PROPERTY-MAXIMUM": (arg, name) ->
      findExtreme(getDataset(arg), name, -1)

    "INTERSECTS?": (x, y) ->
      getGeometry(x).intersects(getGeometry(y))

    "CONTAINS?": (x, y) ->
      getGeometry(x).covers(getGeometry(y))

    "CONTAINED-BY?": (x, y) ->
      getGeometry(x).coveredBy(getGeometry(y))

    "HAVE-RELATIONSHIP?": (x, y, pattern) ->
      getGeometry(x).relate(getGeometry(y)).matches(pattern)

    "RELATIONSHIP-OF": (x, y) ->
      getGeometry(x).relate(getGeometry(y)).toString()

    "INTERSECTING": (patches, data) ->
      geom = getGeometry(data)
      intersecting = patches.toArray().filter((patch) -> geom.intersects(core.agentGeometry(patch)))
      new PatchSet(intersecting, workspace.world)
  }

  {
    prims
  , VectorDataset
  , VectorFeature
  , Vertex
  , getGeometry
  }
