# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ version } = require('meta')

{ AgentReference
, BreedNamePair
, BreedReference
, ExportAllPlotsData
, ExportedAgent
, ExportedAgentSet
, ExportedColorNum
, ExportedCommandLambda
, ExportedExtension
, ExportedGlobals
, ExportedLink
, ExportedLinkSet
, ExportedPatch
, ExportedPatchSet
, ExportedPen
, ExportedPlot
, ExportedPlotManager
, ExportedPoint
, ExportedReporterLambda
, ExportedRGB
, ExportedRGBA
, ExportedTurtle
, ExportedTurtleSet
, ExportPlotData
, ExportWorldData
, LinkReference
, Metadata
, NobodyReference
, PatchReference
, TurtleReference
} = require('serialize/exportstructures')

{ Perspective: { perspectiveToString } }                             = require('../observer')
{ linkBuiltins, patchBuiltins, turtleBuiltins }                      = require('../structure/builtins')
{ DisplayMode: { displayModeToString }, PenMode: { penModeToBool } } = require('engine/plot/pen')

ExtensionsHandler = require('./extensionshandler')

{ difference, find, isEmpty, toObject } = require('brazierjs/array')
{ id, tee }                             = require('brazierjs/function')
{ fold, maybe, None }                   = require('brazierjs/maybe')

NLType = require('../typechecker')

# Yo!  This file expects that basically all of its functions will be called in the context
# of the `World` object.  That is, they should be called within methods on `World`, using
# `<function>.call(this)`. --JAB (12/10/17)

# (String|(Number, Number, Number)|(Number, Number, Number, Number)) => ExportedColor
exportColor = (color) ->
  if NLType(color).isNumber()
    new ExportedColorNum(color)
  else if NLType(color).isList()
    [r, g, b, a] = color
    if a?
      new ExportedRGBA(r, g, b, a)
    else
      new ExportedRGB(r, g, b)
  else
    throw new Error("Unrecognized color format: #{JSON.stringify(color)}")

# (String) => BreedReference
exportBreedReference = (breedName) ->
  new BreedReference(breedName.toLowerCase())

# (Patch) => PatchReference
exportPatchReference = (patch) ->
  new PatchReference(patch.pxcor, patch.pycor)

# (Turtle) => TurtleReference
exportTurtleReference = (turtle) ->
  breed = new BreedNamePair(turtle.getBreedNameSingular(), turtle.getBreedName().toLowerCase())
  new TurtleReference(breed, turtle.id)

# (Link) => LinkReference
exportLinkReference = (link) ->
  breed = new BreedNamePair(link.getBreedNameSingular(), link.getBreedName().toLowerCase())
  new LinkReference(breed, link.end1.id, link.end2.id)

# (Agent) => AgentReference
exportAgentReference = (agent) ->
  type = NLType(agent)
  if type.isNobody() or agent.isDead()
    NobodyReference
  else if type.isLink()
    exportLinkReference(agent)
  else if type.isPatch()
    exportPatchReference(agent)
  else if type.isTurtle()
    exportTurtleReference(agent)
  else
    throw new Error("Cannot make agent reference out of: #{JSON.stringify(agent)}")

# (Agent, ExtensionExports) => (String) => Any
exportWildcardVar = (agent, extensions) -> (varName) ->

  exportWildcardValue = (value) ->
    type = NLType(value)
    if type.isAgent() or type.isNobody()
      exportAgentReference(value)
    else if value.getSpecialName?()?
      new BreedReference(value.getSpecialName().toLowerCase())
    else if type.isLinkSet()
      new ExportedLinkSet(value.toArray().map(exportLinkReference))
    else if type.isPatchSet()
      new ExportedPatchSet(value.toArray().map(exportPatchReference))
    else if type.isTurtleSet()
      new ExportedTurtleSet(value.toArray().map(exportTurtleReference))
    else if type.isCommandLambda()
      new ExportedCommandLambda(value.nlogoBody)
    else if type.isReporterLambda()
      new ExportedReporterLambda(value.nlogoBody)
    else if type.isList()
      value.map(exportWildcardValue)
    else if extensions.canHandle(value)
      extensions.exportState(value, exportWildcardValue)
    else
      value

  exportWildcardValue(agent.getVariable(varName))

# () => Object[Any]
exportMetadata = ->
  # TODO: Get filename from metadata from compiler, once NetLogo/NetLogo#1547 has been merged --JAB (2/8/18)
  new Metadata(version, '[IMPLEMENT .NLOGO]', new Date())

# [T, U <: ExportedAgent[T]] @ (Class[U], Array[(String, (Any) => Any)], String, ExtensionExports) => (T) => U
exportAgent = (clazz, builtInsMappings, labelVarName, extensions) -> (agent) ->

  wildcard = exportWildcardVar(agent, extensions)

  builtInsValues = builtInsMappings.map(([name, f]) ->
    if name is labelVarName
      wildcard(name)
    else
      f(agent.getVariable(name))
  )
  builtInsNames  = builtInsMappings.map(([name]) -> name)
  extrasNames    = difference(agent.varNames())(builtInsNames)
  extras         = toObject(extrasNames.map(tee(id)(wildcard)))

  new clazz(builtInsValues..., extras)

# (Plot, ExtensionExports) => ExportedPlot
exportPlot = (plot, extensions) ->

  exportPen = (pen) ->

    exportPoint = ({ x, y, penMode, color }) ->
      new ExportedPoint(x, y, penModeToBool(penMode), color)

    color     = pen.getColor()
    interval  = pen.getInterval()
    isPenDown = penModeToBool(pen.getPenMode())
    mode      = displayModeToString(pen.getDisplayMode())
    name      = pen.name
    points    = pen.getPoints().map(exportPoint)
    x         = pen.getPenX()

    new ExportedPen(color, interval, isPenDown, mode, name, points, x)

  currentPenNameOrNull = fold(-> null)((cp) -> cp.name)(plot.getCurrentPenMaybe())
  isAutoplotting       = plot.isAutoplotting
  isLegendOpen         = plot.isLegendEnabled
  name                 = plot.name
  pens                 = plot.getPens().map(exportPen)
  xMax                 = plot.xMax
  xMin                 = plot.xMin
  yMax                 = plot.yMax
  yMin                 = plot.yMin

  new ExportedPlot(currentPenNameOrNull, isAutoplotting, isLegendOpen, name, pens, xMax, xMin, yMax, yMin)

# (ExtensionExports) => ExportedPlotManager
exportPlotManager = (extensions) ->

  currentPlotNameOrNull = fold(-> null)((cp) -> cp.name)(@_plotManager.getCurrentPlotMaybe())
  exporter              = (plot) -> exportPlot(plot, extensions)
  plots                 = @_plotManager.getPlots().map(exporter)

  new ExportedPlotManager(currentPlotNameOrNull, plots)

# (ExtensionExports) => Object[Any]
exportMiniGlobals = (extensions) ->
  namesNotDeleted = @observer.varNames().filter((name) => @observer.getVariable(name)?).sort()
  toObject(namesNotDeleted.map(tee(id)(exportWildcardVar(@observer, extensions))))

# (ExtensionExports) => ExportedGlobals
exportGlobals = (extensions) ->

  noUnbreededLinks = isEmpty(@links().toArray().filter((l) -> l.getBreedName().toUpperCase() is "LINKS"))

  linkDirectedness =
    if noUnbreededLinks
      'neither'
    else if @breedManager.links().isDirected()
      'directed'
    else
      'undirected'

  maxPxcor      = @topology.maxPxcor
  maxPycor      = @topology.maxPycor
  minPxcor      = @topology.minPxcor
  minPycor      = @topology.minPycor
  nextWhoNumber = @turtleManager.peekNextID()
  perspective   = perspectiveToString(@observer.getPerspective())
  subject       = exportAgentReference(@observer.subject())
  ticks         = if @ticker.ticksAreStarted() then @ticker.tickCount() else -1

  codeGlobals = exportMiniGlobals.call(this, extensions)

  new ExportedGlobals( linkDirectedness, maxPxcor, maxPycor, minPxcor, minPycor, nextWhoNumber
                     , perspective, subject, ticks, codeGlobals)

# () => ExportAllPlotsData
module.exports.exportAllPlots = ->

  metadata    = exportMetadata.call(this)
  extensions  = ExtensionsHandler.makeStateExporter(@extensionPorters)
  miniGlobals = exportMiniGlobals.call(this, extensions)
  plots       = @_plotManager.getPlots().map(exportPlot)

  new ExportAllPlotsData(metadata, miniGlobals, plots)

# (String) => ExportPlotData
module.exports.exportPlot = (plotName) ->

  desiredPlotMaybe = find((x) -> x.name is plotName)(@_plotManager.getPlots())

  metadata    = exportMetadata.call(this)
  extensions  = ExtensionsHandler.makeStateExporter(@extensionPorters)
  miniGlobals = exportMiniGlobals.call(this, extensions)
  exporter    = (plot) -> exportPlot(plot, extensions)
  plot        = fold(-> throw new Error("no such plot: \"#{plotName}\""))(exporter)(desiredPlotMaybe)

  new ExportPlotData(metadata, miniGlobals, plot)

# () => ExportWorldData
module.exports.exportWorld = ->

  makeMappings = (builtins) -> (mapper) ->
    builtins.map(tee(id)(mapper))

  exportExtensionState = ExtensionsHandler.makeStateExporter(@extensionPorters)

  labelExporter = (varName) => (agent) =>
    exportWildcardVar(agent, exportExtensionState)(varName)

  patchMapper = (varName) ->
    switch varName
      when "pcolor", "plabel-color" then (color) -> exportColor(color)
      else                               id

  turtleMapper = (varName) ->
    switch varName
      when "breed"                then (breed) -> exportBreedReference(breed.toString())
      when "color", "label-color" then (color) -> exportColor(color)
      else                             id

  linkMapper = (varName) ->
    switch varName
      when "breed"                then (breed) -> exportBreedReference(breed.toString())
      when "color", "label-color" then (color) -> exportColor(color)
      when "end1", "end2"         then (end)   -> exportTurtleReference(end)
      else                             id

  metadata    = exportMetadata.call(this)
  randomState = @rng.exportState()
  globals     = exportGlobals.call(this, exportExtensionState)
  patches     =               @patches().toArray().map(exportAgent(ExportedPatch , makeMappings( patchBuiltins)( patchMapper), "plabel", exportExtensionState))
  turtles     = @turtleManager.turtles().toArray().map(exportAgent(ExportedTurtle, makeMappings(turtleBuiltins)(turtleMapper), "label",  exportExtensionState))
  links       =     @linkManager.links().toArray().map(exportAgent(ExportedLink  , makeMappings(  linkBuiltins)(  linkMapper), "llabel", exportExtensionState))
  drawingM    = if not @_updater.drawingWasJustCleared() then maybe([@patchSize, @_getViewBase64()]) else None
  output      = @_getOutput()
  plotManager = exportPlotManager.call(this, exportExtensionState)
  extensions  = exportExtensionState.extensionObjects

  new ExportWorldData(metadata, randomState, globals, patches, turtles, links, drawingM, output, plotManager, extensions)
