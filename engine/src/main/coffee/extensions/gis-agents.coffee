# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Port of the desktop extension's PatchDataset.java, TurtleDataset.java, LinkDataset.java,
# ApplyRaster.java, ApplyCoverage.java, CreateTurtlesFromPoints.java,
# CreateTurtlesInsidePolygon.java, and util/VectorFeaturesToTurtlesUtil.java

JSTS = require('jsts/dist/jsts.min.js')
{ exceptionFactory: exceptions } = require('util/exception')
{ checks }   = require('../engine/core/typechecker')
TurtleSet    = require('../engine/core/turtleset')
ColorModel   = require('../engine/core/colormodel')

{ Envelope, Coordinate } = JSTS.geom

# (Number) => Number — Java's Math.nextDown for positive doubles
nextDown = (x) ->
  floats = new Float64Array([x])
  ints   = new Uint32Array(floats.buffer)
  if ints[0] is 0
    if ints[1] is 0
      return -Number.MIN_VALUE
    ints[1] -= 1
    ints[0] = 0xFFFFFFFF
  else
    ints[0] -= 1
  floats[0]

# (GisCore, GisVector, GisRaster, Workspace) => GisAgents
module.exports = ({ core, vector, raster, workspace }) ->

  world = workspace.world

  # (TurtleSet) => { name: String, turtleSet: TurtleSet }
  resolveBreed = (turtleset) ->
    name = turtleset.getSpecialName?() ? null
    if not name?
      throw exceptions.extension("Expected breed, received non-breed turtleset")
    if name.toUpperCase() is "TURTLES"
      { name: "TURTLES", turtleSet: world.turtles() }
    else
      { name, turtleSet: world.turtleManager.turtlesOfBreed(name) }

  # (String) => Array[String] — uppercase names of built-in + turtles-own + breed vars
  variableNamesForBreed = (breedName) ->
    breed = world.breedManager.get(breedName)
    builtins = ["WHO", "COLOR", "HEADING", "XCOR", "YCOR", "SHAPE", "LABEL", "LABEL-COLOR",
                "BREED", "HIDDEN?", "SIZE", "PEN-SIZE", "PEN-MODE"]
    turtlesOwn = world.breedManager.turtles().varNames.map((name) -> name.toUpperCase())
    breedsOwn  = if breedName.toUpperCase() is "TURTLES" then [] else breed.varNames.map((name) -> name.toUpperCase())
    builtins.concat(turtlesOwn).concat(breedsOwn)

  # (Array[String], Array[String]) => Map[String, String]
  # port of getAutomaticPropertyNameToTurtleVarIndexMappings — maps property name to
  # turtle variable name
  automaticPropertyMappings = (variableNames, propertyNames) ->
    mappings = new Map()
    for propertyName in propertyNames
      variableName = propertyName.toUpperCase().replace(/ /g, "-")
      if variableNames.includes(variableName)
        mappings.set(propertyName.toUpperCase(), variableName)
    mappings

  manualMappingError = "The variable mapping must be of the form: [[\"property-name\" \"turtle-variable-name\"] [\"property-name\" \"turtle-variable-name\"] (etc.)]"

  # (Map[String, String], List, Array[String]) => Map[String, String]
  addManualMappings = (mappings, manualList, variableNames) ->
    for pairing in manualList
      if not checks.isList(pairing) or pairing.length isnt 2 or
         not checks.isString(pairing[0]) or not checks.isString(pairing[1])
        throw exceptions.extension(manualMappingError)
      propertyName = pairing[0].toUpperCase()
      variableName = pairing[1].toUpperCase()
      if variableNames.includes(variableName)
        mappings.set(propertyName, variableName)
      else
        throw exceptions.extension("There is no variable #{variableName} defined. use turtles-own or <breeds>-own to define one.")
    mappings

  # (String, Coordinate) => Turtle | null
  # port of CreateTurtleAtGISCoordinate; draws one color from the RNG per turtle and
  # leaves heading at 0, exactly like desktop.  Note desktop creates the turtle BEFORE
  # the envelope check, so a point outside the GIS envelope still leaves a turtle
  # sitting at the origin.
  createTurtleAtGISCoordinate = (breedName, coordinate) ->
    color = ColorModel.randomColor(workspace.rng.nextInt)
    breed = world.breedManager.get(breedName)
    turtle = world.turtleManager._createNewTurtle(color, 0, 0, 0, breed)
    nlogoPosition = core.gisToNetLogo(coordinate)
    if not nlogoPosition?
      return null # we tried to create a turtle outside of the GIS envelope
    t = world.topology
    if not t._wrapInX and nlogoPosition.x is t.maxPxcor + 0.5
      nlogoPosition.x = nextDown(nlogoPosition.x)
    if not t._wrapInY and nlogoPosition.y is t.maxPycor + 0.5
      nlogoPosition.y = nextDown(nlogoPosition.y)
    turtle.setVariable("xcor", nlogoPosition.x)
    turtle.setVariable("ycor", nlogoPosition.y)
    turtle

  # (Turtle, VectorFeature, Map[String, String]) => Unit
  setTurtleVariablesToFeatureProperties = (turtle, feature, mappings) ->
    mappings.forEach( (variableName, propertyName) ->
      value = feature.getProperty(propertyName)
      if value? and variableName isnt "BREED" and variableName isnt "XCOR" and variableName isnt "YCOR"
        if (variableName is "COLOR" or variableName is "LABEL-COLOR") and checks.isString(value)
          colorNumber = ColorModel.colorNameToNumber(value)
          if colorNumber?
            value = colorNumber
          else
            throw exceptions.extension("#{value} is not a supported color name. Only the default hues or netlogo color number representations are supported. see https://ccl.northwestern.edu/netlogo/docs/programming.html#colors for a list of default colors and a table of color number representations.")
        if variableName is "HIDDEN?"
          if checks.isString(value)
            if value.toLowerCase() is "true" or parseFloat(value) is 1
              value = true
            else if value.toLowerCase() is "false" or parseFloat(value) is 0
              value = false
            else
              throw exceptions.extension("#{value} is not a supported boolean value. Only true/false or 0/1 are accepted")
          else if checks.isNumber(value)
            if value is 1
              value = true
            else if value is 0
              value = false
            else
              throw exceptions.extension("#{value} is not a supported boolean value. Only true/false or 0/1 are accepted")
        turtle.setVariable(variableName.toLowerCase(), value)
      return
    )
    return

  # (VectorDataset, TurtleSet, List | null, CommandBlock | null) => Unit
  createTurtlesFromPoints = (dataset, turtleset, manualList, cmd) ->
    if dataset?.gisType isnt "VectorDataset"
      throw exceptions.extension("Not a VectorDataset")
    if dataset.shapeType isnt "POINT"
      throw exceptions.extension("Not a point dataset")
    { name: breedName, turtleSet: breedSet } = resolveBreed(turtleset)
    variableNames = variableNamesForBreed(breedName)
    mappings = automaticPropertyMappings(variableNames, dataset.properties.map((p) -> p.name))
    if manualList?
      addManualMappings(mappings, manualList, variableNames)
    for feature in dataset.features
      geom = feature.geometry
      for i in [0...geom.getNumGeometries()]
        point = geom.getGeometryN(i)
        continue if point.isEmpty()
        turtle = createTurtleAtGISCoordinate(breedName, point.getCoordinate())
        continue if not turtle? # outside the GIS envelope; desktop shows a warning dialog
        setTurtleVariablesToFeatureProperties(turtle, feature, mappings)
    if cmd?
      # like desktop, the command block runs over the whole breed, not just new turtles
      freshBreedSet = if breedName.toUpperCase() is "TURTLES" then world.turtles() else world.turtleManager.turtlesOfBreed(breedName)
      freshBreedSet.ask(cmd, true)
    return

  # (VectorFeature, TurtleSet, Number, List | null, CommandBlock | null) => Unit
  createTurtlesInsidePolygon = (feature, turtleset, n, manualList, cmd) ->
    if feature?.gisType isnt "VectorFeature"
      throw exceptions.extension("Not a VectorFeature")
    if feature.shapeType isnt "POLYGON"
      throw exceptions.extension("Not a polygon feature")
    { name: breedName } = resolveBreed(turtleset)
    variableNames = variableNamesForBreed(breedName)
    mappings = automaticPropertyMappings(variableNames, Array.from(feature.properties.keys()))
    if manualList?
      addManualMappings(mappings, manualList, variableNames)
    created = []
    for i in [0...Math.trunc(n)]
      coordinate = feature.getRandomPointInsidePolygon(workspace.rng)
      turtle = createTurtleAtGISCoordinate(breedName, coordinate)
      continue if not turtle?
      setTurtleVariablesToFeatureProperties(turtle, feature, mappings)
      created.push(turtle)
    if cmd?
      new TurtleSet(created, world).ask(cmd, true)
    return

  # (Any) => String | Number
  # value conversion shared by turtle-dataset and link-dataset; desktop uses Java
  # toString(), which has no parentheses around agent names
  agentValueToProperty = (value) ->
    if checks.isTurtleSet(value) or checks.isLinkSet(value) or checks.isPatchSet(value)
      (value.getSpecialName?() ? "").toLowerCase()
    else if checks.isTurtle(value)
      "turtle #{value.id}"
    else if checks.isPatch(value)
      "patch #{value.pxcor} #{value.pycor}"
    else if checks.isLink(value)
      "link #{value.end1.id} #{value.end2.id}"
    else if value? and not checks.isNumber(value) and not checks.isString(value)
      String(value)
    else
      value

  # (Array[Agent], Array[String], Array[String], String, (Agent) => Geometry) => VectorDataset
  agentDataset = (agents, builtinNames, ownNames, shape, makeGeometry) ->
    variableNames = builtinNames.concat(ownNames)
    variableTypes = variableNames.map( (name) ->
      hasNonNumber = agents.some( (agent) ->
        value = agent.getVariable(name.toLowerCase())
        value? and not checks.isNumber(value)
      )
      if hasNonNumber then "STRING" else "NUMBER"
    )
    dataset = new vector.VectorDataset(shape, variableNames, variableTypes, core)
    for agent in agents
      values = variableNames.map((name) -> agentValueToProperty(agent.getVariable(name.toLowerCase())))
      dataset.add(makeGeometry(agent), values)
    dataset

  prims = {

    "PATCH-DATASET": (varName) ->
      t = world.topology
      width  = t.maxPxcor - t.minPxcor + 1
      height = t.maxPycor - t.minPycor + 1
      envelope   = core.getTransformation().getEnvelope(world)
      dimensions = new raster.GridDimensions(width, height, envelope)
      data = new Float64Array(width * height)
      for px in [t.minPxcor..t.maxPxcor]
        ix = px - t.minPxcor
        for py in [t.minPycor..t.maxPycor]
          iy = (height - 1) - (py - t.minPycor)
          value = world.getPatchAt(px, py).getPatchVariable(varName)
          data[(iy * width) + ix] = if checks.isNumber(value) then value else NaN
      new raster.RasterDataset(dimensions, data, core)

    "APPLY-RASTER": (dataset, varName) ->
      rasterDataset = raster.getDataset(dataset)
      t = world.topology
      width  = t.maxPxcor - t.minPxcor + 1
      height = t.maxPycor - t.minPycor + 1
      envelope  = core.getTransformation().getEnvelope(world)
      resampled = rasterDataset.resample(new raster.GridDimensions(width, height, envelope), core)
      for px in [t.minPxcor..t.maxPxcor]
        ix = px - t.minPxcor
        for py in [t.minPycor..t.maxPycor]
          iy = (height - 1) - (py - t.minPycor)
          world.getPatchAt(px, py).setPatchVariable(varName, resampled.data[(iy * width) + ix])
      return

    "TURTLE-DATASET": (turtleset) ->
      turtles = turtleset.toArray()
      ownNames = world.breedManager.turtles().varNames.map((name) -> name.toUpperCase())
      breedNames = new Set(turtles.map((turtle) -> turtle.getBreedName().toUpperCase()))
      if breedNames.size is 1
        onlyBreed = Array.from(breedNames)[0]
        if onlyBreed isnt "TURTLES"
          ownNames = ownNames.concat(world.breedManager.get(onlyBreed).varNames.map((name) -> name.toUpperCase()))
      builtins = ["WHO", "COLOR", "HEADING", "XCOR", "YCOR", "SHAPE", "LABEL", "LABEL-COLOR",
                  "BREED", "HIDDEN?", "SIZE", "PEN-SIZE", "PEN-MODE"]
      agentDataset(turtles, builtins, ownNames, "POINT", (turtle) ->
        core.factory.createPoint(core.netLogoToGIS(new Coordinate(turtle.xcor, turtle.ycor)))
      )

    "LINK-DATASET": (linkset) ->
      links = linkset.toArray()
      ownNames = world.breedManager.links().varNames.map((name) -> name.toUpperCase())
      breedNames = new Set(links.map((link) -> link.getBreedName().toUpperCase()))
      if breedNames.size is 1
        onlyBreed = Array.from(breedNames)[0]
        if onlyBreed isnt "LINKS"
          ownNames = ownNames.concat(world.breedManager.get(onlyBreed).varNames.map((name) -> name.toUpperCase()))
      builtins = ["END1", "END2", "COLOR", "LABEL", "LABEL-COLOR", "HIDDEN?", "BREED",
                  "THICKNESS", "SHAPE", "TIE-MODE"]
      agentDataset(links, builtins, ownNames, "LINE", (link) ->
        start = core.netLogoToGIS(new Coordinate(link.end1.xcor, link.end1.ycor))
        end   = core.netLogoToGIS(new Coordinate(link.end2.xcor, link.end2.ycor))
        line  = core.factory.createLineString([start, end])
        core.factory.createMultiLineString([line])
      )

    "CREATE-TURTLES-FROM-POINTS": (dataset, turtleset, cmd) ->
      createTurtlesFromPoints(dataset, turtleset, null, cmd)

    "CREATE-TURTLES-FROM-POINTS-MANUAL": (dataset, turtleset, manualList, cmd) ->
      createTurtlesFromPoints(dataset, turtleset, manualList, cmd)

    "CREATE-TURTLES-INSIDE-POLYGON": (feature, turtleset, n, cmd) ->
      createTurtlesInsidePolygon(feature, turtleset, n, null, cmd)

    "CREATE-TURTLES-INSIDE-POLYGON-MANUAL": (feature, turtleset, n, manualList, cmd) ->
      createTurtlesInsidePolygon(feature, turtleset, n, manualList, cmd)

    "APPLY-COVERAGE": (dataset, propertyName, varName) ->
      applyCoverages(dataset, [propertyName], [varName])

    "APPLY-COVERAGES": (dataset, propertyNames, varNames...) ->
      if not checks.isList(propertyNames)
        throw exceptions.extension("number of properties must match the number of patch variables")
      if propertyNames.length isnt varNames.length
        throw exceptions.extension("number of properties must match the number of patch variables")
      applyCoverages(dataset, propertyNames, varNames)
  }

  # (VectorDataset, List, Array[String]) => Unit
  # port of ApplyCoverage.applyCoverages and its aggregation helpers
  applyCoverages = (dataset, propertyNames, varNames) ->
    if dataset?.gisType isnt "VectorDataset"
      throw exceptions.extension("not a VectorDataset: #{workspace.dump(dataset)}")
    for name in propertyNames when not dataset.isValidPropertyName(name)
      throw exceptions.extension("#{name} is not a valid property name")
    singleCellThreshold = core.state.coverageSingleCellThreshold
    t = world.topology
    for px in [t.minPxcor..t.maxPxcor]
      for py in [t.minPycor..t.maxPycor]
        patch = world.getPatchAt(px, py)
        patchGeometry = core.agentGeometry(patch)
        features = dataset.features.filter((f) -> patchGeometry.intersects(f.geometry))
        if features.length > 1
          values = aggregatePropertyValues(patchGeometry, propertyNames, features)
          for name, i in propertyNames
            patch.setPatchVariable(varNames[i], values[i])
        else if features.length is 1 and fastSharedAreaRatio(patchGeometry, features[0].geometry) > singleCellThreshold
          for name, i in propertyNames
            patch.setPatchVariable(varNames[i], features[0].getProperty(name))
        else
          for name, i in propertyNames
            patch.setPatchVariable(varNames[i], NaN)
    return

  # (Geometry, Geometry) => Number
  # port of JTSUtils.fastGetSharedAreaRatio: 10x10 interior-point sampling
  fastSharedAreaRatio = (rectGeom, geom) ->
    env = rectGeom.getEnvelopeInternal()
    interior = (x, y) -> geom.contains(core.factory.createPoint(new Coordinate(x, y)))
    if interior(env.getMinX(), env.getMinY()) and interior(env.getMaxX(), env.getMaxY()) and
       interior(env.getMaxX(), env.getMinY()) and interior(env.getMinX(), env.getMaxY())
      return 1.0
    xInc = env.getWidth()  / 9.0
    yInc = env.getHeight() / 9.0
    count = 0
    x = env.getMinX()
    for i in [0...10]
      y = env.getMinY()
      for j in [0...10]
        count += 1 if interior(x, y)
        y += yInc
      x += xInc
    count / 100.0

  # (Geometry, Geometry) => Number
  # port of JTSUtils.getSharedAreaRatio (without the desktop's TopologyException fallback)
  sharedAreaRatio = (geom1, geom2) ->
    geom1.intersection(geom2).getArea() / geom1.getArea()

  # (Geometry, List, Array[VectorFeature]) => Array[String | Number]
  aggregatePropertyValues = (patchGeometry, propertyNames, features) ->
    maxAreaIndex = -1
    maxAreaRatio = 0.0
    records = propertyNames.map(-> [])
    categorical = propertyNames.map(-> false)
    fillRecords = (ratioOf) ->
      for feature, i in features
        areaRatio = ratioOf(patchGeometry, feature.geometry)
        if areaRatio > maxAreaRatio
          maxAreaIndex = i
          maxAreaRatio = areaRatio
        for name, j in propertyNames
          value = feature.getProperty(name)
          categorical[j] = true if checks.isString(value)
          records[j][i] = { value, weight: areaRatio }
      return
    fillRecords(fastSharedAreaRatio)
    if maxAreaRatio is 0.0
      fillRecords(sharedAreaRatio)
    if maxAreaRatio is 0.0
      propertyNames.map(-> NaN)
    else if maxAreaRatio >= core.state.coverageMultipleCellThreshold
      records.map((propertyRecords) -> propertyRecords[maxAreaIndex].value)
    else
      records.map( (propertyRecords, j) ->
        if categorical[j]
          majority(propertyRecords)
        else
          weightedAverage(propertyRecords)
      )

  # (Array[{ value: Any, weight: Number }]) => Any
  majority = (records) ->
    weights = new Map()
    maxWeight = 0.0
    maxWeightValue = null
    for { value, weight } in records when value?
      total = (weights.get(value) ? 0) + weight
      weights.set(value, total)
      if total > maxWeight
        maxWeight = total
        maxWeightValue = value
    maxWeightValue

  # (Array[{ value: Any, weight: Number }]) => Number
  weightedAverage = (records) ->
    totalValue  = 0.0
    totalWeight = 0.0
    for { value, weight } in records when value?
      if not isNaN(value) and isFinite(value)
        totalValue  += value * weight
        totalWeight += weight
    totalValue / totalWeight

  { prims }
