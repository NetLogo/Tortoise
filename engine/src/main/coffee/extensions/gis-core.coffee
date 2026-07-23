# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

JSTS = require('jsts/dist/jsts.min.js')
{ exceptionFactory: exceptions } = require('util/exception')
{ checks } = require('../engine/core/typechecker')

{ Envelope, Coordinate, GeometryFactory, PrecisionModel } = JSTS.geom

noTransformationMessage = "you must define a coordinate transformation before using any other GIS features. You can use gis:set-transformation directly, or use `gis:set-world-envelope gis:envelope-of dataset` to automatically frame up a given dataset."

# (Any) => Boolean
isAgent    = (x) -> checks.isTurtle(x) or checks.isPatch(x) or checks.isLink(x)

# (Any) => Boolean
isAgentSet = (x) -> checks.isTurtleSet(x) or checks.isPatchSet(x) or checks.isLinkSet(x)

# Direct port of the desktop extension's CoordinateTransformation.java.  Scales
# are NetLogo units per GIS unit; the NetLogo envelope is padded by 0.5 on each
# side so patch centers on the world edge map to the envelope boundary.
class CoordinateTransformation

  # (Envelope, Envelope, Boolean)
  constructor: (gisSpaceEnvelope, netLogoSpaceEnvelope, equalizeScales) ->
    @gisEnvelope     = new Envelope(gisSpaceEnvelope)
    @netLogoEnvelope = new Envelope(netLogoSpaceEnvelope)
    @netLogoEnvelope.expandBy(0.5)
    sx = @netLogoEnvelope.getWidth()  / @gisEnvelope.getWidth()
    sy = @netLogoEnvelope.getHeight() / @gisEnvelope.getHeight()
    if equalizeScales
      @scaleX = Math.min(sx, sy)
      @scaleY = @scaleX
    else
      @scaleX = sx
      @scaleY = sy
    @gisSpaceCenter     = new Coordinate(@gisEnvelope.getMinX()     + (@gisEnvelope.getWidth()     / 2.0),
                                         @gisEnvelope.getMinY()     + (@gisEnvelope.getHeight()    / 2.0))
    @netLogoSpaceCenter = new Coordinate(@netLogoEnvelope.getMinX() + (@netLogoEnvelope.getWidth()  / 2.0),
                                         @netLogoEnvelope.getMinY() + (@netLogoEnvelope.getHeight() / 2.0))

  # (Coordinate) => Coordinate
  netLogoToGIS: (pt) ->
    new Coordinate(((pt.x - @netLogoSpaceCenter.x) / @scaleX) + @gisSpaceCenter.x,
                   ((pt.y - @netLogoSpaceCenter.y) / @scaleY) + @gisSpaceCenter.y)

  # (Coordinate) => Coordinate | null
  gisToNetLogo: (pt) ->
    result = @gisToNetLogoRaw(pt)
    if @netLogoEnvelope.contains(result)
      result
    else
      null

  # (Coordinate) => Coordinate — same transform without the world-envelope clip, for
  # drawing (which is bounded by the drawing layer, not the world envelope)
  gisToNetLogoRaw: (pt) ->
    new Coordinate(((pt.x - @gisSpaceCenter.x) * @scaleX) + @netLogoSpaceCenter.x,
                   ((pt.y - @gisSpaceCenter.y) * @scaleY) + @netLogoSpaceCenter.y)

  # (World) => Envelope
  getEnvelope: (world) ->
    t  = world.topology
    bl = @netLogoToGIS(new Coordinate(t.minPxcor - 0.5, t.minPycor - 0.5))
    tr = @netLogoToGIS(new Coordinate(t.maxPxcor + 0.5, t.maxPycor + 0.5))
    new Envelope(bl.x, tr.x, bl.y, tr.y)

# (Workspace) => GisCore
module.exports = (workspace) ->

  factory = new GeometryFactory(new PrecisionModel(PrecisionModel.FLOATING))

  state = {
    transformation:                null # CoordinateTransformation
    projection:                    null # Projection
    datasetCount:                  0
    nlColor:                       0    # NetLogo color number or RGB(A) list
    coverageSingleCellThreshold:   0.1
    coverageMultipleCellThreshold: 0.33
  }

  # () => CoordinateTransformation
  getTransformation = ->
    if state.transformation?
      state.transformation
    else
      throw exceptions.extension(noTransformationMessage)

  # (Coordinate) => Coordinate
  netLogoToGIS = (pt) ->
    getTransformation().netLogoToGIS(pt)

  # (Coordinate) => Coordinate | null
  gisToNetLogo = (pt) ->
    getTransformation().gisToNetLogo(pt)

  # (Coordinate) => Coordinate — unclipped, for drawing
  gisToNetLogoRaw = (pt) ->
    getTransformation().gisToNetLogoRaw(pt)

  # (List) => Envelope
  parseEnvelope = (list) ->
    if not checks.isList(list) or list.length isnt 4
      throw exceptions.extension("expected a four-element list: #{workspace.dump(list, true)}")
    # desktop concatenates the raw value into this message, so no readable-style quoting
    for value in list when not checks.isNumber(value)
      throw exceptions.extension("not a number: #{workspace.dump(value)}")
    new Envelope(list[0], list[1], list[2], list[3])

  # (Envelope) => List
  formatEnvelope = (envelope) ->
    [envelope.getMinX(), envelope.getMaxX(), envelope.getMinY(), envelope.getMaxY()]

  # () => Envelope
  worldNetLogoEnvelope = ->
    t = workspace.world.topology
    new Envelope(t.minPxcor, t.maxPxcor, t.minPycor, t.maxPycor)

  # (Agent) => Geometry
  agentGeometry = (agent) ->
    if checks.isTurtle(agent)
      factory.createPoint(netLogoToGIS(new Coordinate(agent.xcor, agent.ycor)))
    else if checks.isPatch(agent)
      bl = netLogoToGIS(new Coordinate(agent.pxcor - 0.5, agent.pycor - 0.5))
      tr = netLogoToGIS(new Coordinate(agent.pxcor + 0.5, agent.pycor + 0.5))
      factory.toGeometry(new Envelope(bl.x, tr.x, bl.y, tr.y))
    else if checks.isLink(agent)
      c1 = netLogoToGIS(new Coordinate(agent.end1.xcor, agent.end1.ycor))
      c2 = netLogoToGIS(new Coordinate(agent.end2.xcor, agent.end2.ycor))
      factory.createLineString([c1, c2])
    else
      throw exceptions.extension("unrecognized agent type: #{workspace.dump(agent, true)}")

  # (List, List, Boolean) => Unit
  setTransformation = (gisEnvelopeList, netLogoEnvelopeList, equalizeScales) ->
    state.transformation = new CoordinateTransformation(
      parseEnvelope(gisEnvelopeList), parseEnvelope(netLogoEnvelopeList), equalizeScales)
    return

  # (List, Boolean) => Unit
  setWorldEnvelope = (gisEnvelopeList, equalizeScales) ->
    state.transformation = new CoordinateTransformation(
      parseEnvelope(gisEnvelopeList), worldNetLogoEnvelope(), equalizeScales)
    return

  # () => List
  worldEnvelope = ->
    formatEnvelope(getTransformation().getEnvelope(workspace.world))

  # (Any) => List
  envelopeOf = (thing) ->
    if thing?.gisType is "VectorDataset" or thing?.gisType is "RasterDataset"
      formatEnvelope(thing.getEnvelope())
    else if thing?.gisType is "VectorFeature"
      formatEnvelope(thing.getGeometry().getEnvelopeInternal())
    else if isAgent(thing)
      formatEnvelope(agentGeometry(thing).getEnvelopeInternal())
    else if isAgentSet(thing)
      env = new Envelope()
      thing.toArray().forEach( (agent) ->
        env.expandToInclude(agentGeometry(agent).getEnvelopeInternal())
      )
      formatEnvelope(env)
    else
      throw exceptions.extension("not a RasterDataset, VectorDataset, VectorFeature, Agent, or Agentset: #{workspace.dump(thing, true)}")

  # (List*) => List
  envelopeUnionOf = (envelopeLists...) ->
    envelopes = envelopeLists.map(parseEnvelope)
    if envelopes.length is 0
      []
    else
      result = envelopes[0]
      for envelope in envelopes[1..]
        result.expandToInclude(envelope)
      formatEnvelope(result)

  prims = {
    "SET-TRANSFORMATION":             (gisList, nlList) -> setTransformation(gisList, nlList, true)
    "SET-TRANSFORMATION-DS":          (gisList, nlList) -> setTransformation(gisList, nlList, false)
    "SET-WORLD-ENVELOPE":             (gisList) -> setWorldEnvelope(gisList, true)
    "SET-WORLD-ENVELOPE-DS":          (gisList) -> setWorldEnvelope(gisList, false)
    "WORLD-ENVELOPE":                 worldEnvelope
    "ENVELOPE-OF":                    envelopeOf
    "ENVELOPE-UNION-OF":              envelopeUnionOf
    "DRAWING-COLOR":                  -> state.nlColor
    "SET-DRAWING-COLOR":              (color) -> state.nlColor = color; return
    "COVERAGE-MINIMUM-THRESHOLD":     -> state.coverageSingleCellThreshold
    "SET-COVERAGE-MINIMUM-THRESHOLD": (threshold) -> state.coverageSingleCellThreshold = threshold; return
    "COVERAGE-MAXIMUM-THRESHOLD":     -> state.coverageMultipleCellThreshold
    "SET-COVERAGE-MAXIMUM-THRESHOLD": (threshold) -> state.coverageMultipleCellThreshold = threshold; return
  }

  {
    prims
  , state
  , factory
  , getTransformation
  , netLogoToGIS
  , gisToNetLogo
  , gisToNetLogoRaw
  , agentGeometry
  , parseEnvelope
  , formatEnvelope
  , worldNetLogoEnvelope
  , CoordinateTransformation
  }
