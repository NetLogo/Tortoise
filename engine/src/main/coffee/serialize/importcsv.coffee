# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

parse = require('csv-parse/lib/sync')

JSType = require('util/jstype')

{ parseAgentRefMaybe, parseAny, parseBool, parseBreed, parseString, parseTurtleRefMaybe } = require('./readexportedvalue')

ExtensionsHandler = require('../engine/core/world/extensionshandler')

{ ExportedColorNum
, ExportedExtension
, ExportedGlobals
, ExportedLink
, ExportedPatch
, ExportedPen
, ExportedPlot
, ExportedPlotManager
, ExportedPoint
, ExportedRGB
, ExportedRGBA
, ExportedTurtle
, ExportWorldData
, Metadata
} = require('./exportstructures')

{ exceptionFactory: exceptions } = require('util/exception')

{ foldl       } = require('brazierjs/array')
{ id          } = require('brazierjs/function')
{ fold, maybe } = require('brazierjs/maybe')

# type ImpObj    = Object[Any]
# type Row       = Array[String]
# type Parser[T] = (Array[Row], Schema) => T
# type Schema    = Object[(String) => Any]

# (String) => String
csvNameToSaneName = (csvName) ->

  if csvName isnt "nextIndex"

    replaceAll = (str, regex, f) ->
      match = str.match(regex)
      if match?
        { 0: fullMatch, 1: group, index } = match
        prefix  = str.slice(0, index)
        postfix = str.slice(index + fullMatch.length)
        replaceAll("#{prefix}#{f(group)}#{postfix}", regex, f)
      else
        str

    lowered    = csvName.toLowerCase()
    camelCased = replaceAll(lowered, /[ \-]+([a-z0-9])/, (str) -> str.toUpperCase())

    qMatch = camelCased.match(/^(\w)(.*)\?$/)
    if qMatch?
      { 1: firstLetter, 2: remainder } = qMatch
      "is#{firstLetter.toUpperCase()}#{remainder}"
    else
      camelCased

  else

    csvName

# (String|(Number, Number, Number)|(Number, Number, Number, Number)) => ExportedColor
toExportedColor = (color) ->
  if JSType(color).isNumber()
    new ExportedColorNum(color)
  else if JSType(color).isArray()
    [r, g, b, a] = color
    if a?
      new ExportedRGBA(r, g, b, a)
    else
      new ExportedRGB(r, g, b)
  else
    throw exceptions.internal("Unrecognized CSVified color: #{JSON.stringify(color)}")

# (Object[Any]) => ExportedGlobals
toExportedGlobals = ({ directedLinks, maxPxcor, maxPycor, minPxcor, minPycor, nextIndex
                     , perspective, subject, ticks }, codeGlobals) ->
  new ExportedGlobals( directedLinks, maxPxcor, maxPycor, minPxcor, minPycor, nextIndex
                     , perspective, subject, ticks, codeGlobals)

# (Object[Any]) => ExportedLink
toExportedLink = ({ breed, color, end1, end2, isHidden, labelColor, label, shape
                  , thickness, tieMode, extraVars }) ->
  new ExportedLink( end1, end2, toExportedColor(color), label, toExportedColor(labelColor), isHidden, breed
                  , thickness, shape, tieMode, extraVars)

# (Object[Any]) => ExportedPatch
toExportedPatch = ({ pcolor, plabelColor, plabel, pxcor, pycor, extraVars }) ->
  new ExportedPatch(pxcor, pycor, toExportedColor(pcolor), plabel, toExportedColor(plabelColor), extraVars)

# (Object[Any]) => ExportedTurtle
toExportedTurtle = ({ breed, color, heading, isHidden, labelColor, label, penMode
                    , penSize, shape, size, who, xcor, ycor, extraVars }) ->
  new ExportedTurtle(who, toExportedColor(color), heading, xcor, ycor, shape, label
                    , toExportedColor(labelColor), breed, isHidden, size, penSize, penMode, extraVars)

# (Object[Any]) => ExportedPoint
toExportedPoint = ({ x, y, isPenDown, color }) ->
  new ExportedPoint(x, y, isPenDown, color)

# (Object[Any]) => ExportedPen
toExportedPen = ({ color, interval, isPenDown, mode, penName, points, x }) ->
  new ExportedPen( color, interval, isPenDown, mode, penName, points.map(toExportedPoint), x)

# (Object[Any]) => ExportedPlot
toExportedPlot = ({ currentPen, isAutoplot, isLegendOpen, name, pens, xMax, xMin, yMax, yMin }) ->
  new ExportedPlot( fold(-> null)(id)(currentPen), isAutoplot, isAutoplot, isLegendOpen
                  , name, pens.map(toExportedPen), xMax, xMin, yMax, yMin)

# (Object[Any]) => ExportedPlotManager
toExportedPlotManager = ({ default: defaultOrNull, plots }) ->
  new ExportedPlotManager(defaultOrNull, plots.map(toExportedPlot))

# START SCHEMA STUFF

# Only used to mark things that we should delay converting until later --JAB (4/6/17)
# [T] @ (T) => T
identity = (x) ->
  x

# (String) => String|(Number, Number, Number)|(Number, Number, Number, Number)
parseColor = (x) ->
  unpossible = -> throw exceptions.internal("Why is this even getting called?  We shouldn't be parsing breed names where colors are expected.")
  parseAny(unpossible, unpossible, { matchesPlaceholder: () -> false })(x)

# (String) => Number
parseDate = (x) ->
  [_, prefix, millis, postfix] = x.match(/(.*):(\d+) (.*)/)
  new Date(Date.parse("#{prefix} #{postfix}") + parseInt(millis))

# (String) => Maybe[String]
parseStringMaybe = (x) ->
  value = parseString(x)
  maybe(if value is "" then null else value)

parsePenMode = (x) ->
  switch parseInt(x)
    when 0 then 'line'
    when 1 then 'bar'
    when 2 then 'point'
    else        throw exceptions.internal("Unknown pen mode: #{x}")

# (String) => String
parsePerspective = (x) ->
  switch parseInt(x)
    when 0 then 'observe'
    when 1 then 'ride'
    when 2 then 'follow'
    when 3 then 'watch'
    else        throw exceptions.internal("Unknown perspective number: #{x}")

# (String) => String
parseVersion = (x) ->
  x.match(/export-world data \([^\)]+\)/)[1]

# [T] @ (String) => ((String) => Maybe[T]) => ((String) => T)
parseAndExtract = (typeOfEntry) -> (f) -> (x) ->
  fold((x) -> throw exceptions.internal("Unable to parse #{typeOfEntry}: #{JSON.stringify(x)}"))(id)(f(x))

# ((String) => String, (String) => String, ExtensionsReader) => Object[Schema]
nameToSchema = (singularToPlural, pluralToSingular, extensionReader) ->
  parseAnyLocal    = parseAny(singularToPlural, pluralToSingular, extensionReader)
  parseAgentLocal  = parseAndExtract("agent ref")(parseAgentRefMaybe(singularToPlural))
  parseTurtleLocal = parseAndExtract("turtle ref")(parseTurtleRefMaybe(singularToPlural))

  {
    plots: {
      color:        parseFloat
    , currentPen:   parseStringMaybe
    , interval:     parseFloat
    , isAutoplot:   parseBool
    , isLegendOpen: parseBool
    , isPenDown:    parseBool
    , mode:         parsePenMode
    , penName:      parseString
    , xMax:         parseFloat
    , xMin:         parseFloat
    , x:            parseFloat
    , yMax:         parseFloat
    , yMin:         parseFloat
    , y:            parseFloat
    }
    randomState: {
      value: identity
    }
    globals: {
      directedLinks: parseString
    , minPxcor:      parseInt
    , maxPxcor:      parseInt
    , minPycor:      parseInt
    , maxPycor:      parseInt
    , nextIndex:     parseInt
    , perspective:   parsePerspective
    , subject:       parseAgentLocal
    , ticks:         parseFloat
    }
    turtles: {
      breed:      parseBreed
    , color:      parseColor
    , heading:    parseFloat
    , isHidden:   parseBool
    , labelColor: parseColor
    , label:      parseAnyLocal
    , penMode:    parseString
    , penSize:    parseFloat
    , shape:      parseString
    , size:       parseFloat
    , who:        parseInt
    , xcor:       parseFloat
    , ycor:       parseFloat
    }
    patches: {
      pcolor:      parseColor
    , plabelColor: parseColor
    , plabel:      parseAnyLocal
    , pxcor:       parseInt
    , pycor:       parseInt
    }
    links: {
      breed:      parseBreed
    , color:      parseColor
    , end1:       parseTurtleLocal
    , end2:       parseTurtleLocal
    , isHidden:   parseBool
    , labelColor: parseColor
    , label:      parseAnyLocal
    , shape:      parseString
    , thickness:  parseFloat
    , tieMode:    parseString
    }
    output: {
      value: parseString
    }
    extensions: {}
  }

# END SCHEMA STUFF



# START PARSER STUFF

# Parser[String]
singletonParse = (x, schema) ->
  if x[0]?[0]?
    schema.value(x[0][0])
  else
    ''

# ((String) => String, (String) => String, ExtensionsReader) => Parser[Array[ImpObj]]
arrayParse = (singularToPlural, pluralToSingular, extensionReader) -> ([keys, rows...], schema) ->

  f =
    (acc, row) ->
      obj = { extraVars: {} }
      for rawKey, index in keys
        saneKey = csvNameToSaneName(rawKey)
        value   = row[index]
        if schema[saneKey]?
          obj[saneKey] = schema[saneKey](value)
        else if value isnt "" # DO NOT USE `saneKey`!  Do not touch user global names! --JAB (8/2/17)
          obj.extraVars[rawKey] = parseAny(singularToPlural, pluralToSingular, extensionReader)(value)
      acc.concat([obj])

  foldl(f)([])(rows)

# ((String) => String, (String) => String, ExtensionsReader) => Parser[ImpObj]
globalParse = (singularToPlural, pluralToSingular, extensionReader) -> (csvBucket, schema) ->
  arrayParse(singularToPlural, pluralToSingular, extensionReader)(csvBucket, schema)[0]

# Parser[ImpObj]
plotParse = (csvBucket, schema) ->

  parseEntity = (acc, rowIndex, upperBound, valueRowOffset, valueColumnOffset) ->
    for columnIndex in [0...upperBound]
      columnName        = csvNameToSaneName(csvBucket[rowIndex                 ][columnIndex])
      value             =                   csvBucket[rowIndex + valueRowOffset][columnIndex + valueColumnOffset]
      acc[columnName]   = (schema[columnName] ? parseInt)(value)
    acc

  output = { default: csvBucket[0]?[0] ? null, plots: [] }

  # Iterate over every plot
  csvIndex = 1

  while csvIndex < csvBucket.length

    plot     = parseEntity({ name: parseString(csvBucket[csvIndex++][0]) }, csvIndex, csvBucket[csvIndex].length, 1, 0)
    penCount = plot.numberOfPens
    delete plot.penCount
    csvIndex += 2

    plot.pens = [0...penCount].map((i) -> parseEntity({ points: [] }, csvIndex, csvBucket[csvIndex].length, 1 + i, 0))
    csvIndex += 2 + penCount

    # For each pen, parsing of the list of points associated with the pen
    pointsIndex = 1
    while csvIndex + pointsIndex < csvBucket.length and csvBucket[csvIndex + pointsIndex].length isnt 1
      length = csvBucket[csvIndex].length / penCount
      for penIndex in [0...penCount]
        if csvBucket[csvIndex + pointsIndex][penIndex * length] isnt ''
          point  = parseEntity({}, csvIndex, length, pointsIndex, penIndex * length)
          plot.pens[penIndex].points.push(point)
      pointsIndex++
    csvIndex += pointsIndex

    output.plots.push(plot)

  output

# (Array[String]) => Parser[Map[String, Array[String]]]
extensionParse = (extensionNames) -> (csvBucket, schema) ->
  if csvBucket.length is 0
    return {}

  [first] = csvBucket[0]
  if not extensionNames.includes(first.toUpperCase())
    throw exceptions.internal("Extension section must start with an extension name.")

  output        = {}
  current       = []
  output[first] = current

  for index in [1...csvBucket.length]
    [line] = csvBucket[index]
    if extensionNames.includes(line.toUpperCase())
      current      = []
      output[line] = current
    else
      current.push(line)

  output

# Parser[(Number, String)]
drawingParse = (csvBucket, schema) ->
  if csvBucket.length is 0
    ""
  else if csvBucket.length is 2
    [[patchSizeStr], [base64Str]] = csvBucket
    [parseFloat(patchSizeStr), base64Str]
  else
    throw exceptions.internal("NetLogo Web cannot parse `export-world` drawings from before NetLogo 6.1.")

# ((String) => String, (String) => String, ExtensionsReader) => Object[Parser[Any]]
buckets = (singularToPlural, pluralToSingular, extensionReader) -> {
  extensions:  extensionParse(extensionReader.extensionNames)
, drawing:     drawingParse
, globals:     globalParse(singularToPlural, pluralToSingular, extensionReader)
, links:       arrayParse(singularToPlural, pluralToSingular, extensionReader)
, output:      singletonParse
, patches:     arrayParse(singularToPlural, pluralToSingular, extensionReader)
, plots:       plotParse
, randomState: singletonParse
, turtles:     arrayParse(singularToPlural, pluralToSingular, extensionReader)
}

# END PARSER STUFF



# (ImpObj, Array[String]) => (ImpObj, Object[String])
extractGlobals = (globals, knownNames) ->
  builtIn = {}
  user    = {}
  for key, value of globals
    if key in knownNames
      builtIn[key] = value
    else
      user[key] = value
  [builtIn, user]


# ((String) => String, (String) => String, Array[ExtensionPorter]) => (String) => WorldState
module.exports =
  (singularToPlural, pluralToSingular, extensionPorters) -> (csvText) ->

    extensionReader = ExtensionsHandler.makeReader(extensionPorters)

    buckies   = buckets(singularToPlural, pluralToSingular, extensionReader)
    getSchema = nameToSchema(singularToPlural, pluralToSingular, extensionReader)

    parsedCSV = parse(csvText, {
      comment: '#'
      max_record_size: 1e12
      skip_empty_lines: true
      relax_column_count: true
    })

    clusterRows =
      ([acc, latestRows], row) ->

        saneName =
          try
            if row.length is 1
              csvNameToSaneName(row[0])
            else
              undefined
          catch ex
            undefined

        if saneName? and saneName of buckies
          rows = []
          acc[saneName] = rows
          [acc, rows]
        else if latestRows?
          latestRows.push(row)
          [acc, latestRows]
        else
          [acc, latestRows]


    [bucketToRows, _] = foldl(clusterRows)([{}, undefined])(parsedCSV)

    world = {}

    for name, bucketParser of buckies when bucketToRows[name]?
      world[name] = bucketParser(bucketToRows[name], getSchema[name])

    titleRow    = parsedCSV[0][0]
    filenameRow = parsedCSV[1][0]
    dateRow     = parsedCSV[2][0]

    { globals, randomState, turtles, patches, links, drawing, output, plots, extensions } = world

    codeGlobals = globals.extraVars
    delete globals.extraVars
    builtInGlobals = globals

    outMetadata    = new Metadata(parseVersion(titleRow), filenameRow, parseDate(dateRow))
    outGlobals     = toExportedGlobals(builtInGlobals, codeGlobals)
    outPatches     = patches.map(toExportedPatch)
    outTurtles     = turtles.map(toExportedTurtle)
    outLinks       = links.map(toExportedLink)
    outPlotManager = toExportedPlotManager(plots)
    parseAnyLocal  = parseAny(singularToPlural, pluralToSingular, extensionReader)
    outExtensions  = extensionReader.readExtensions(extensions, parseAnyLocal)

    new ExportWorldData( outMetadata, randomState, outGlobals, outPatches, outTurtles
                       , outLinks, maybe(drawing), output, outPlotManager, outExtensions)
