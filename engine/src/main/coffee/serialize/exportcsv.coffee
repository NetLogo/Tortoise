# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

JSType = require('util/typechecker')

{ flatMap, isEmpty, map, maxBy, toObject, unique } = require('brazierjs/array')
{ id, pipeline, tee }                              = require('brazierjs/function')
{ fold, maybe }                                    = require('brazierjs/maybe')
{ rangeUntil }                                     = require('brazierjs/number')
{ keys, pairs, values }                            = require('brazierjs/object')

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
  '""' + str.replace(/\n/g, "\\n").replace(/"/g, '""') + '""'

# (String) => String
formatString = (str) ->
  formatPlain(formatStringInner(str))

# (Boolean) => String
formatBoolean = (bool) ->
  formatPlain(bool)

# (Number) => String
formatNumberInner = (num) ->
  maxNetLogoInt = 9007199254740992
  base = # These negative exponent numbers are when Java will switch to scientific notation --JAB (12/25/17)
    if num > maxNetLogoInt or num < -maxNetLogoInt or (0 < num < 1e-3) or (0 > num > -1e-3)
      num.toExponential()
    else
      num.toString()
  base.replace(/e\+?/, 'E') # Java stringifies scientific notation with 'E' and 'E-', while JS uses 'e+' and 'e-'. --JAB (12/25/17)

# (Number) => String
formatNumber = (num) ->
  formatPlain(formatNumberInner(num))

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

# (Array[_]) => String
formatList = (xs) ->
  "[#{xs.map((x) -> formatAnyInner(x)).join(" ")}]"

# (ExportedColor) => String
formatColor = (color) ->
  if color instanceof ExportedColorNum
    formatNumber(color.value)
  else if color instanceof ExportedRGB
    formatPlain(formatList([color.r, color.g, color.b]))
  else if color instanceof ExportedRGBA
    formatPlain(formatList([color.r, color.g, color.b, color.a]))
  else
    throw new Error("Unknown color: #{JSON.stringify(color)}")

# (Any) => String
formatAnyInner = (x) ->

  type = JSType(x)

  if type.isArray()
    formatList(x)
  else if type.isBoolean()
    x
  else if type.isNumber()
    formatNumberInner(x)
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
  else
    throw new Error("I don't know how to CSVify this: #{JSON.stringify(x)}")

# (Any) => String
formatAny = (any) ->

  if not any?
    ""
  else
    formatPlain(formatAnyInner(any))

# (Object[String]) => String
formatKeys   = pipeline(keys  , map(formatPlain), joinCommaed)
formatValues = pipeline(values, map(formatPair ), joinCommaed)
# (Object[Any]) => String

# (ExportedTurtle) => Object[(Any, (Any) => String)]
schemafyTurtle = ({ who, color, heading, xcor, ycor, shape, label, labelColor, breed, isHidden, size, penSize, penMode }) ->
  formatWrapped = pipeline(formatBreedRef, formatPlain)
  {
    "who":         [who       , formatNumber ]
  , "color":       [color     , formatColor  ]
  , "heading":     [heading   , formatNumber ]
  , "xcor":        [xcor      , formatNumber ]
  , "ycor":        [ycor      , formatNumber ]
  , "shape":       [shape     , formatString ]
  , "label":       [label     , formatAny    ]
  , "label-color": [labelColor, formatColor  ]
  , "breed":       [breed     , formatWrapped]
  , "hidden?":     [isHidden  , formatBoolean]
  , "size":        [size      , formatNumber ]
  , "pen-size":    [penSize   , formatNumber ]
  , "pen-mode":    [penMode   , formatString ]
  }

# (ExportedPatch) => Object[(Any, (Any) => String)]
schemafyPatch = ({ pxcor, pycor, pcolor, plabel, plabelColor }) ->
  {
    "pxcor":        [pxcor      , formatNumber]
  , "pycor":        [pycor      , formatNumber]
  , "pcolor":       [pcolor     , formatColor ]
  , "plabel":       [plabel     , formatAny   ]
  , "plabel-color": [plabelColor, formatColor ]

  }

# (ExportedLink) => Object[(Any, (Any) => String)]
schemafyLink = ({ end1, end2, color, label, labelColor, isHidden, breed, thickness, shape, tieMode }) ->
  formatWrappedBreed  = pipeline(formatBreedRef , formatPlain)
  formatWrappedTurtle = pipeline(formatTurtleRef, formatPlain)
  {
    "end1":        [end1      , formatWrappedTurtle]
  , "end2":        [end2      , formatWrappedTurtle]
  , "color":       [color     , formatColor        ]
  , "label":       [label     , formatAny          ]
  , "label-color": [labelColor, formatColor        ]
  , "hidden?":     [isHidden  , formatBoolean      ]
  , "breed":       [breed     , formatWrappedBreed ]
  , "thickness":   [thickness , formatNumber       ]
  , "shape":       [shape     , formatString       ]
  , "tie-mode":    [tieMode   , formatString       ]
  }

# (Object[Any]) => Object[(Any, (Any) => String)]
schemafyAny = pipeline(pairs, map(([k, v]) -> [k, [v, formatAny]]), toObject)

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

# (ExportedGlobals) => String
formatGlobals = ({ linkDirectedness, maxPxcor, maxPycor, minPxcor, minPycor, nextWhoNumber
                 , perspective, subject, ticks, codeGlobals }) ->

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

  globals = Object.assign(builtins, schemafyAny(codeGlobals))

  """#{formatPlain('GLOBALS')}
#{formatKeys(  globals)}
#{formatValues(globals)}"""

# (Object[Any]) => String
formatMiniGlobals = (miniGlobals) ->
  """#{formatPlain('MODEL SETTINGS')}
#{formatKeys(              miniGlobals )}
#{formatValues(schemafyAny(miniGlobals))}"""

# (Metadata) => String
formatMetadata = ({ version, filename, date }) ->
  """export-world data (NetLogo Web #{version})
#{filename}
#{formatPlain(formatDate(date))}"""

# [T <: ExportedAgent] @ (Array[T], (T) => Object[(Any, (Any) => String)], Array[String], Array[String]) => String
formatAgents = (agents, schemafy, builtinsNames, ownsNames) ->

  keysRow = pipeline(unique, map(formatPlain), joinCommaed)(builtinsNames.concat(ownsNames))

  valuesRows =
    agents.map(
      (agent) ->
        lookup = (key) -> (agent.breedsOwns ? agent.patchesOwns)[key]
        base   = schemafy(agent)
        extras = pipeline(map(tee(id)(lookup)), toObject, schemafyAny)(ownsNames)
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

# (ExportPlotData) => String
plotDataToCSV = ({ metadata, miniGlobals, plot }) ->
  """#{formatMetadata(metadata)}

#{formatMiniGlobals(miniGlobals)}

#{formatPlotData(plot)}"""

# (ExportAllPlotsData) => String
allPlotsDataToCSV = ({ metadata, miniGlobals, plots }) ->
  """#{formatMetadata(metadata)}

#{formatMiniGlobals(miniGlobals)}

#{plots.map(formatPlotData).join("\n")}"""

# (Array[String], Array[String], Array[String], Array[String], Array[String]) => (ExportWorldData) => String
worldDataToCSV = (allTurtlesOwnsNames, allLinksOwnsNames, patchBuiltins, turtleBuiltins, linkBuiltins) -> (worldData) ->

  { metadata, randomState, globals, patches, turtles, links, plotManager, output, extensions } = worldData

  # Patches don't have a breed in the breed manager, and they all use the same exact set of vars,
  # so the best place to get the vars is from a patch, itself, and there must always be at least
  # one patch (`patch 0 0`), so we take the first patch and its varnames. --JAB (12/16/17)
  allPatchesOwnsNames = Object.keys(patches[0].patchesOwns)

  patchesStr = formatAgents(patches, schemafyPatch ,  patchBuiltins, allPatchesOwnsNames)
  turtlesStr = formatAgents(turtles, schemafyTurtle, turtleBuiltins, allTurtlesOwnsNames)
  linksStr   = formatAgents(  links, schemafyLink  ,   linkBuiltins, allLinksOwnsNames  )

  { currentPlotNameOrNull, plots } = plotManager
  currentPlotName  = currentPlotNameOrNull ? ''
  plotCSV          = plots.map(formatPlotData).join('\n\n')
  obnoxiousPlotCSV = if plotCSV.length > 0 then plotCSV + "\n" else plotCSV

  """#{formatMetadata(metadata)}

#{formatPlain('RANDOM STATE')}
#{formatPlain(randomState)}

#{formatGlobals(globals)}

#{formatPlain('TURTLES')}
#{turtlesStr}

#{formatPlain('PATCHES')}
#{patchesStr}

#{formatPlain('LINKS')}
#{linksStr}

#{formatPlain('OUTPUT')}#{onNextLineIfNotEmpty(if output is "" then "" else formatString(output))}
#{formatPlain('PLOTS')}
#{formatPlain(currentPlotName)}#{onNextLineIfNotEmpty(obnoxiousPlotCSV)}
#{formatPlain('EXTENSIONS')}\n\n"""

module.exports = { allPlotsDataToCSV, plotDataToCSV, worldDataToCSV }
