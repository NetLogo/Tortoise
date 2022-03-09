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

{ exceptionFactory: exceptions } = require('util/exception')

{ difference, find, isEmpty, toObject } = require('brazierjs/array')
{ id, tee }                             = require('brazierjs/function')
{ fold, maybe, None }                   = require('brazierjs/maybe')

{ checks } = require('../typechecker')

# Yo!  This file expects that basically all of its functions will be called in the context
# of the `World` object.  That is, they should be called within methods on `World`, using
# `<function>.call(this)`. --JAB (12/10/17)

# (String|(Number, Number, Number)|(Number, Number, Number, Number)) => ExportedColor
exportColor = (color) ->
  if checks.isNumber(color)
    new ExportedColorNum(color)
  else if checks.isList(color)
    [r, g, b, a] = color
    if a?
      new ExportedRGBA(r, g, b, a)
    else
      new ExportedRGB(r, g, b)
  else
    throw exceptions.internal("Unrecognized color format: #{JSON.stringify(color)}")

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
  if checks.isNobody(agent) or agent.isDead()
    NobodyReference
  else if checks.isLink(agent)
    exportLinkReference(agent)
  else if checks.isPatch(agent)
    exportPatchReference(agent)
  else if checks.isTurtle(agent)
    exportTurtleReference(agent)
  else
    throw exceptions.internal("Cannot make agent reference out of: #{JSON.stringify(agent)}")

createExportWildcardValue = (extensionExporter) ->
  exportWildcardValue = (value) ->
    if checks.isAgent(value) or checks.isNobody(value)
      exportAgentReference(value)
    else if value.getSpecialName?()?
      new BreedReference(value.getSpecialName().toLowerCase())
    else if checks.isLinkSet(value)
      new ExportedLinkSet(value.toArray().map(exportLinkReference))
    else if checks.isPatchSet(value)
      new ExportedPatchSet(value.toArray().map(exportPatchReference))
    else if checks.isTurtleSet(value)
      new ExportedTurtleSet(value.toArray().map(exportTurtleReference))
    else if checks.isCommandLambda(value)
      new ExportedCommandLambda(value.nlogoBody)
    else if checks.isReporterLambda(value)
      new ExportedReporterLambda(value.nlogoBody)
    else if checks.isList(value)
      value.map(exportWildcardValue)
    else if extensionExporter.canHandle(value)
      extensionExporter.exportObject(value, exportWildcardValue)
    else
      value

  exportWildcardValue

# (Agent, ExtensionsExporter) => (String) => Any
exportWildcardVar = (agent, extensionExporter) -> (varName) ->
  exportWildcardValue = createExportWildcardValue(extensionExporter)
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

# (Plot) => ExportedPlot
exportPlot = (plot) ->

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

# (String) => ExportedPlot
exportRawPlot = (plotName) ->
  desiredPlotMaybe  = find((x) -> x.name is plotName)(@_plotManager.getPlots())
  exporter          = (plot) -> exportPlot(plot)
  plot              = fold(-> throw exceptions.runtime("no such plot: \"#{plotName}\""))(exporter)(desiredPlotMaybe)

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

  metadata          = exportMetadata.call(this)
  extensionExporter = ExtensionsHandler.makeExporter(@extensionPorters)
  miniGlobals       = exportMiniGlobals.call(this, extensionExporter)
  plots             = @_plotManager.getPlots().map(exportPlot)

  new ExportAllPlotsData(metadata, miniGlobals, plots)

# (String) => ExportedPlot
module.exports.exportRawPlot = exportRawPlot

# (String) => ExportPlotData
module.exports.exportPlot = (plotName) ->
  metadata          = exportMetadata.call(this)
  extensionExporter = ExtensionsHandler.makeExporter(@extensionPorters)
  miniGlobals       = exportMiniGlobals.call(this, extensionExporter)
  plot              = exportRawPlot.call(this, plotName)

  new ExportPlotData(metadata, miniGlobals, plot)

# (ExtensionExports) => AgentExports
createAgentExporters = (extensionExporter) ->
  makeMappings = (builtins) -> (mapper) ->
    builtins.map(tee(id)(mapper))

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

  patchExport  = exportAgent(ExportedPatch , makeMappings( patchBuiltins)( patchMapper), "plabel", extensionExporter)
  turtleExport = exportAgent(ExportedTurtle, makeMappings(turtleBuiltins)(turtleMapper), "label",  extensionExporter)
  linkExport   = exportAgent(ExportedLink  , makeMappings(  linkBuiltins)(  linkMapper), "llabel", extensionExporter)

  {
    patchExport
  , turtleExport
  , linkExport
  }

# (World) => (Any) => JSON
module.exports.createExportValue = (world) ->
  extensionExporter   = ExtensionsHandler.makeExporter(world.extensionPorters)
  agentExporters      = createAgentExporters(extensionExporter)
  exportWildcardValue = createExportWildcardValue(extensionExporter)

  exportAgentOrWildcard = (maybeAgent) ->
    if checks.isLink(maybeAgent)
      agentExporters.linkExport(maybeAgent)
    else if checks.isPatch(maybeAgent)
      agentExporters.patchExport(maybeAgent)
    else if checks.isTurtle(maybeAgent)
      agentExporters.turtleExport(maybeAgent)
    else
      exportWildcardValue(maybeAgent)

  (value) ->
    if checks.isLinkSet(value)
      value.toArray().map(agentExporters.linkExport)
    else if checks.isPatchSet(value)
      value.toArray().map(agentExporters.patchExport)
    else if checks.isTurtleSet(value)
      value.toArray().map(agentExporters.turtleExport)
    else if checks.isList(value)
      value.map(exportAgentOrWildcard)
    else
      exportAgentOrWildcard(value)

# () => ExportWorldData
module.exports.exportWorld = ->

  extensionExporter = ExtensionsHandler.makeExporter(@extensionPorters)
  agentExporters    = createAgentExporters(extensionExporter)

  metadata    = exportMetadata.call(this)
  randomState = @rng.exportState()
  globals     = exportGlobals.call(this, extensionExporter)
  patches     =               @patches().toArray().map(agentExporters.patchExport)
  turtles     = @turtleManager.turtles().toArray().map(agentExporters.turtleExport)
  links       =     @linkManager.links().toArray().map(agentExporters.linkExport)
  drawingM    = if not @_updater.drawingWasJustCleared() then maybe([@patchSize, @_getViewBase64()]) else None
  output      = @_getOutput()
  plotManager = exportPlotManager.call(this, extensionExporter)
  extensions  = extensionExporter.export()

  new ExportWorldData(metadata, randomState, globals, patches, turtles, links, drawingM, output, plotManager, extensions)
