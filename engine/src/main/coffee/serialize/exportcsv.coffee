# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

JSType = require('util/jstype')

{ flatMap, isEmpty, map, maxBy, toObject, unique } = require('brazierjs/array')
{ id, pipeline, tee }                              = require('brazierjs/function')
{ fold, map: mapMaybe, maybe }                     = require('brazierjs/maybe')
{ rangeUntil }                                     = require('brazierjs/number')
{ keys, pairs, values }                            = require('brazierjs/object')

ExtensionsHandler = require('../engine/core/world/extensionshandler')

formatFloat = require('util/formatfloat')

{ BreedReference
, ExportedColorNum
, ExportedCommandLambda
, ExportedLinkSet
, ExportedPatchSet
, ExportedReporterLambda
, ExportedRGB
, ExportedRGBA
, ExportedTurtleSet
, LinkReference
, NobodyReference
, PatchReference
, TurtleReference
} = require('./exportstructures')

# (String) => String
onNextLineIfNotEmpty = (x) ->
  if isEmpty(x) then '' else '\n' + x

# (Array[String]) => String
joinCommaed  = (x) -> x.join(',')

# (String) => String
formatPlain = (str) ->
  '"' + str + '"'

# (String) => String
formatStringInner = (str) ->
  '""' + str.replace(/\n/g, "\\n").replace(/"/g, '\\""') + '""'

# (String) => String
formatString = (str) ->
  formatPlain(formatStringInner(str))

# (Boolean) => String
formatBoolean = (bool) ->
  formatPlain(bool)

# (Number) => String
formatNumber = (num) ->
  formatPlain(formatFloat(num))

# (BreedReference) => String
formatBreedRef = ({ breedName }) ->
  lowered = breedName.toLowerCase()
  if lowered in ["turtles", "patches", "links"]
    "{all-#{lowered}}"
  else
    "{breed #{lowered}}"

# [T] @ ((T, (T) => String)) => String
formatPair = ([value, formatter]) ->
  formatter(value)

# (TurtleReference) => String
formatTurtleRef = ({ breed: { singular }, id: turtleID }) ->
  "{#{singular.toLowerCase()} #{turtleID}}"

# (PatchReference) => String
formatPatchRef = ({ pxcor, pycor }) ->
  "{patch #{pxcor} #{pycor}}"

# (LinkReference) => String
formatLinkRef = ({ breed: { singular }, id1, id2 }) ->
  "{#{singular.toLowerCase()} #{id1} #{id2}}"

# (AgentReference) => String
formatAgentRef = (ref) ->
  if ref is NobodyReference
    "nobody"
  else if ref instanceof LinkReference
    formatLinkRef(ref)
  else if ref instanceof PatchReference
    formatPatchRef(ref)
  else if ref instanceof TurtleReference
    formatTurtleRef(ref)
  else
    throw new Error("Unknown agent reference: #{JSON.stringify(ref)}")

# (Array[_], (Any) => String) => String
formatList = (xs, formatter) ->
  "[#{xs.map((x) -> formatter(x)).join(" ")}]"

# (ExportedColor) => String
formatColor = (color) ->
  if color instanceof ExportedColorNum
    formatNumber(color.value)
  else if color instanceof ExportedRGB
    formatPlain(formatList([color.r, color.g, color.b], formatFloat))
  else if color instanceof ExportedRGBA
    formatPlain(formatList([color.r, color.g, color.b, color.a], formatFloat))
  else
    throw new Error("Unknown color: #{JSON.stringify(color)}")

# (ExtensionsFormatter, Boolean) => (Any) => String
formatAny = (extensionFormatter, isOuterValue = true) -> (any) ->

  # (Any) => String
  formatter = (x) ->

    type = JSType(x)

    if type.isArray()
      formatList(x, formatter)
    else if type.isBoolean()
      x
    else if type.isNumber()
      formatFloat(x)
    else if type.isString()
      formatStringInner(x)
    else if x instanceof BreedReference
      formatBreedRef(x)
    else if x is NobodyReference
      "nobody"
    else if x instanceof LinkReference
      formatLinkRef(x)
    else if x instanceof PatchReference
      formatPatchRef(x)
    else if x instanceof TurtleReference
      formatTurtleRef(x)
    else if x instanceof ExportedCommandLambda
      "(anonymous command: #{x.source.replace(/"/g, '""')})"
    else if x instanceof ExportedReporterLambda
      "(anonymous reporter: #{x.source.replace(/"/g, '""')})"
    else if x instanceof ExportedLinkSet
      exportInnerLink =
        ({ breed: { plural }, id1, id2 }) ->
          " [#{id1} #{id2} #{formatBreedRef(new BreedReference(plural))}]"
      "{links#{x.references.map(exportInnerLink).join("")}}"
    else if x instanceof ExportedPatchSet
      exportInnerPatch = ({ pxcor, pycor }) -> " [#{pxcor} #{pycor}]"
      "{patches#{x.references.map(exportInnerPatch).join("")}}"
    else if x instanceof ExportedTurtleSet
      exportInnerTurtle = (ref) -> " #{ref.id}"
      "{turtles#{x.references.map(exportInnerTurtle).join("")}}"
    else if extensionFormatter.canHandle(x)
      extensionFormatter.formatPlaceholder(x, formatter)
    else
      throw new Error("I don't know how to CSVify this: #{JSON.stringify(x)}")

  if not any?
    ""
  else if isOuterValue
    formatPlain(formatter(any))
  else
    formatter(any)

# (Object[String]) => String
formatKeys   = pipeline(keys  , map(formatPlain), joinCommaed)
formatValues = pipeline(values, map(formatPair ), joinCommaed)
# (Object[Any]) => String

# ((Any) => String) => (ExportedTurtle) => Object[(Any, (Any) => String)]
schemafyTurtle = (formatAnyValue) -> ({ who, color, heading, xcor, ycor, shape, label, labelColor, breed, isHidden, size, penSize, penMode }) ->
  formatWrapped = pipeline(formatBreedRef, formatPlain)
  {
    "who":         [who       , formatNumber  ]
  , "color":       [color     , formatColor   ]
  , "heading":     [heading   , formatNumber  ]
  , "xcor":        [xcor      , formatNumber  ]
  , "ycor":        [ycor      , formatNumber  ]
  , "shape":       [shape     , formatString  ]
  , "label":       [label     , formatAnyValue]
  , "label-color": [labelColor, formatColor   ]
  , "breed":       [breed     , formatWrapped ]
  , "hidden?":     [isHidden  , formatBoolean ]
  , "size":        [size      , formatNumber  ]
  , "pen-size":    [penSize   , formatNumber  ]
  , "pen-mode":    [penMode   , formatString  ]
  }

# ((Any) => String) => (ExportedPatch) => Object[(Any, (Any) => String)]
schemafyPatch = (formatAnyValue) -> ({ pxcor, pycor, pcolor, plabel, plabelColor }) ->
  {
    "pxcor":        [pxcor      , formatNumber  ]
  , "pycor":        [pycor      , formatNumber  ]
  , "pcolor":       [pcolor     , formatColor   ]
  , "plabel":       [plabel     , formatAnyValue]
  , "plabel-color": [plabelColor, formatColor   ]

  }

# ((Any) => String) => (ExportedLink) => Object[(Any, (Any) => String)]
schemafyLink = (formatAnyValue) -> ({ end1, end2, color, label, labelColor, isHidden, breed, thickness, shape, tieMode }) ->
  formatWrappedBreed  = pipeline(formatBreedRef , formatPlain)
  formatWrappedTurtle = pipeline(formatTurtleRef, formatPlain)
  {
    "end1":        [end1      , formatWrappedTurtle]
  , "end2":        [end2      , formatWrappedTurtle]
  , "color":       [color     , formatColor        ]
  , "label":       [label     , formatAnyValue     ]
  , "label-color": [labelColor, formatColor        ]
  , "hidden?":     [isHidden  , formatBoolean      ]
  , "breed":       [breed     , formatWrappedBreed ]
  , "thickness":   [thickness , formatNumber       ]
  , "shape":       [shape     , formatString       ]
  , "tie-mode":    [tieMode   , formatString       ]
  }

# ((Any) => String) => (Object[Any]) => Object[(Any, (Any) => String)]
schemafyAny = (formatAnyValue) -> pipeline(pairs, map(([k, v]) -> [k, [v, formatAnyValue]]), toObject)

# Based on le_m's solution at https://codereview.stackexchange.com/a/164141/139601
# (Date) => String
formatDate = (date) ->

  format = (value, precision) -> value.toString().padStart(precision, '0')

  month     = format(date.getMonth() + 1                                , 2)
  day       = format(date.getDate()                                     , 2)
  year      = format(date.getFullYear()                                 , 4)
  hour      = format(date.getHours()                                    , 2)
  minute    = format(date.getMinutes()                                  , 2)
  second    = format(date.getSeconds()                                  , 2)
  milli     = format(date.getMilliseconds()                             , 3)
  tzSign    = format((if date.getTimezoneOffset() > 0 then '-' else '+'), 0)
  tzOffset1 = format(Math.abs(date.getTimezoneOffset() / 60)            , 2)
  tzOffset2 = format(Math.abs(date.getTimezoneOffset() % 60)            , 2)

  "#{month}/#{day}/#{year} #{hour}:#{minute}:#{second}:#{milli} #{tzSign}#{tzOffset1}#{tzOffset2}"

# (ExportedGlobals, (Any) => String) => String
formatGlobals = ({ linkDirectedness, maxPxcor, maxPycor, minPxcor, minPycor, nextWhoNumber
                 , perspective, subject, ticks, codeGlobals }, formatAnyValue) ->

  formatPerspective = (p) ->
    formatNumber(
      switch p.toLowerCase()
        when 'observe' then 0
        when 'ride'    then 1
        when 'follow'  then 2
        when 'watch'   then 3
        else                throw new Error("Unknown perspective: #{JSON.stringify(x)}")
    )

  formatDirectedness = pipeline(((s) -> s.toUpperCase()), formatString)

  formatSubject = pipeline(formatAgentRef, formatPlain)

  builtins =
    {
      'min-pxcor':      [minPxcor        , formatNumber      ]
      'max-pxcor':      [maxPxcor        , formatNumber      ]
      'min-pycor':      [minPycor        , formatNumber      ]
      'max-pycor':      [maxPycor        , formatNumber      ]
      'perspective':    [perspective     , formatPerspective ]
      'subject':        [subject         , formatSubject     ]
      'nextIndex':      [nextWhoNumber   , formatNumber      ]
      'directed-links': [linkDirectedness, formatDirectedness]
      'ticks':          [ticks           , formatNumber      ]
    }

  globals = Object.assign(builtins, schemafyAny(formatAnyValue)(codeGlobals))

  """#{formatPlain('GLOBALS')}
#{formatKeys(  globals)}
#{formatValues(globals)}"""

# (Object[Any], (Any) => String) => String
formatMiniGlobals = (miniGlobals, formatAnyValue) ->
  """#{formatPlain('MODEL SETTINGS')}
#{formatKeys(              miniGlobals )}
#{formatValues(schemafyAny(formatAnyValue)(miniGlobals))}"""

# (Metadata) => String
formatMetadata = ({ version, filename, date }) ->
  """export-world data (NetLogo Web #{version})
#{filename}
#{formatPlain(formatDate(date))}"""

# [T <: ExportedAgent] @ (Array[T], (T) => Object[(Any, (Any) => String)], Array[String], Array[String]) => String
formatAgents = (agents, schemafy, builtinsNames, ownsNames, formatAnyValue) ->

  keysRow = pipeline(unique, map(formatPlain), joinCommaed)(builtinsNames.concat(ownsNames))

  valuesRows =
    agents.map(
      (agent) ->
        lookup = (key) -> (agent.breedsOwns ? agent.patchesOwns)[key]
        base   = schemafy(agent)
        extras = pipeline(map(tee(id)(lookup)), toObject, schemafyAny(formatAnyValue))(ownsNames)
        formatValues(Object.assign(base, extras))
    ).join('\n')

  "#{keysRow}#{onNextLineIfNotEmpty(valuesRows)}"

# (ExportedPlot) => String
formatPlotData = ({ currentPenNameOrNull, isAutoplotting, isLegendOpen, name, pens, xMax, xMin, yMax, yMin }) ->

  currentPenStr = currentPenNameOrNull ? ''

  convertedPlot =
    {
      'x min':          [xMin          , formatNumber ]
      'x max':          [xMax          , formatNumber ]
      'y min':          [yMin          , formatNumber ]
      'y max':          [yMax          , formatNumber ]
      'autoplot?':      [isAutoplotting, formatBoolean]
      'current pen':    [currentPenStr , formatString ]
      'legend open?':   [isLegendOpen  , formatBoolean]
      'number of pens': [pens.length   , formatNumber ]
    }

  """#{formatString(name)}
#{formatKeys(  convertedPlot)}
#{formatValues(convertedPlot)}

#{formatPensData(pens)}

#{formatPointsData(pens)}"""

# (Array[ExportedPen]) => String
formatPensData = (pens) ->

  formatPenMode = (x) ->
    formatNumber(
      switch x.toLowerCase()
        when 'line'  then 0
        when 'bar'   then 1
        when 'point' then 2
        else              throw new Error("Unknown pen mode: #{JSON.stringify(x)}")
    )

  convertPen =
    ({ color, interval, isPenDown, mode, name, x }) ->
      {
        'pen name':  [name     , formatString ]
        'pen down?': [isPenDown, formatBoolean]
        'mode':      [mode     , formatPenMode]
        'interval':  [interval , formatNumber ]
        'color':     [color    , formatNumber ]
        'x':         [x        , formatNumber ]
      }

  convertedPens = pens.map(convertPen)
  pensKeys      = formatKeys(convertPen({}))
  pensValues    = convertedPens.map(pipeline(values, map(formatPair))).join('\n')

  "#{pensKeys}#{onNextLineIfNotEmpty(pensValues)}"

# (Array[ExportedPen]) => String
formatPointsData = (pens) ->

  convertPoint =
    ({ x, y, color, isPenDown }) ->
      {
        'x':         [x        , formatNumber ]
        'y':         [y        , formatNumber ]
        'color':     [color    , formatNumber ]
        'pen down?': [isPenDown, formatBoolean]
      }

  penNames = pens.map((pen) -> formatString(pen.name)).join(',,,,')

  baseKeys  = keys(convertPoint({})).map(formatPlain)
  pointKeys = flatMap(-> baseKeys)(rangeUntil(0)(pens.length)).join(',')

  penPointsRows = pens.map((pen) -> pen.points.map(pipeline(convertPoint, values)))
  formatRow     = (row) -> row.map(pipeline(maybe, fold(-> ['', '', '', ''])(map(formatPair)))).join(',')
  longest       = pipeline(maxBy((a) -> a.length), fold(-> [])(id))
  transposed    = (arrays) -> (longest(arrays)).map((_, i) -> arrays.map((array) -> array[i]))
  pointValues   = transposed(penPointsRows).map(formatRow).join('\n')

  """#{penNames}
#{pointKeys}#{onNextLineIfNotEmpty(pointValues)}"""

# (ExportPlotData, Array[ExtensionPorter]) => String
plotDataToCSV = ({ metadata, miniGlobals, plot }, extensionPorters) ->
  extensionFormatter = ExtensionsHandler.makeFormatter(extensionPorters)
  """#{formatMetadata(metadata)}

#{formatMiniGlobals(miniGlobals, formatAny(extensionFormatter))}

#{formatPlotData(plot)}"""

# (ExportedPlot) => String
rawPlotToCSV = (plot) ->
  """#{formatPlotData(plot)}\n"""

# (ExportAllPlotsData) => String
allPlotsDataToCSV = ({ metadata, miniGlobals, plots }, extensionPorters) ->
  extensionFormatter = ExtensionsHandler.makeFormatter(extensionPorters)
  """#{formatMetadata(metadata)}

#{formatMiniGlobals(miniGlobals, formatAny(extensionFormatter))}

#{plots.map(formatPlotData).join("\n")}"""

# ((Number, String)) => String
formatDrawingData = ([patchSize, drawing]) ->

  formatted    = formatFloat(patchSize)
  patchSizeStr = if Number.isInteger(patchSize) then "#{formatted}.0" else formatted

  """
#{formatPlain('DRAWING')}
#{formatPlain(patchSizeStr)}#{onNextLineIfNotEmpty(if drawing is "" then "" else formatPlain(drawing))}"""

# (Array[String], Array[String], Array[String], Array[String], Array[String], Array[ExtensionPorter]) => (ExportWorldData) => String
worldDataToCSV = (allTurtlesOwnsNames, allLinksOwnsNames, patchBuiltins, turtleBuiltins, linkBuiltins, extensionPorters) -> (worldData) ->

  extensionFormatter = ExtensionsHandler.makeFormatter(extensionPorters)

  { metadata, randomState, globals, patches, turtles, links, plotManager, drawingDataMaybe, output, extensions } = worldData

  # Patches don't have a breed in the breed manager, and they all use the same exact set of vars,
  # so the best place to get the vars is from a patch, itself, and there must always be at least
  # one patch (`patch 0 0`), so we take the first patch and its varnames. --JAB (12/16/17)
  allPatchesOwnsNames = Object.keys(patches[0].patchesOwns)

  formatAnyValue = formatAny(extensionFormatter)

  patchesStr = formatAgents(patches,  schemafyPatch(formatAnyValue),  patchBuiltins, allPatchesOwnsNames, formatAnyValue)
  turtlesStr = formatAgents(turtles, schemafyTurtle(formatAnyValue), turtleBuiltins, allTurtlesOwnsNames, formatAnyValue)
  linksStr   = formatAgents(  links,   schemafyLink(formatAnyValue),   linkBuiltins,   allLinksOwnsNames, formatAnyValue)

  { currentPlotNameOrNull, plots } = plotManager
  currentPlotName  = currentPlotNameOrNull ? ''
  plotCSV          = plots.map(formatPlotData).join('\n\n')
  obnoxiousPlotCSV = if plotCSV.length > 0 then plotCSV + "\n" else plotCSV

  drawingStr = pipeline(mapMaybe(formatDrawingData), fold(-> "")(id))(drawingDataMaybe)

  extensionsCSV = extensionFormatter.format(extensions, formatAny(extensionFormatter, isOuterValue = false))

  """#{formatMetadata(metadata)}

#{formatPlain('RANDOM STATE')}
#{formatPlain(randomState)}

#{formatGlobals(globals, formatAnyValue)}

#{formatPlain('TURTLES')}
#{turtlesStr}

#{formatPlain('PATCHES')}
#{patchesStr}

#{formatPlain('LINKS')}
#{linksStr}
#{drawingStr}

#{formatPlain('OUTPUT')}#{onNextLineIfNotEmpty(if output is "" then "" else formatString(output))}
#{formatPlain('PLOTS')}
#{formatPlain(currentPlotName)}#{onNextLineIfNotEmpty(obnoxiousPlotCSV)}
#{formatPlain('EXTENSIONS')}
#{onNextLineIfNotEmpty(extensionsCSV)}\n\n"""

module.exports = { allPlotsDataToCSV, plotDataToCSV, rawPlotToCSV, worldDataToCSV }
