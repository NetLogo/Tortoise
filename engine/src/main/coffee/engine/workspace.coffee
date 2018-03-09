# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class WorldConfig
  # (() => Unit) => WorldConfig
  constructor: (@resizeWorld = (->)) ->

BreedManager  = require('./core/breedmanager')
Dump          = require('./dump')
EvalPrims     = require('./prim/evalprims')
Hasher        = require('./hasher')
LayoutManager = require('./prim/layoutmanager')
LinkPrims     = require('./prim/linkprims')
ListPrims     = require('./prim/listprims')
NLType        = require('./core/typechecker')
PlotManager   = require('./plot/plotmanager')
Prims         = require('./prim/prims')
RNG           = require('util/rng')
SelfManager   = require('./core/structure/selfmanager')
SelfPrims     = require('./prim/selfprims')
Timer         = require('util/timer')
Updater       = require('./updater')
World         = require('./core/world')

csvToWorldState = require('serialize/importcsv')

{ toObject }       = require('brazier/array')
{ fold }           = require('brazier/maybe')
{ id }             = require('brazier/function')
{ lookup, values } = require('brazier/object')

{ Config: ImportExportConfig, Prims: ImportExportPrims } = require('./prim/importexportprims')
{ Config: MouseConfig,        Prims: MousePrims }        = require('./prim/mouseprims')
{ Config: OutputConfig,       Prims: OutputPrims }       = require('./prim/outputprims')
{ Config: PrintConfig,        Prims: PrintPrims }        = require('./prim/printprims')
{ Config: UserDialogConfig,   Prims: UserDialogPrims }   = require('./prim/userdialogprims')

Meta = require('meta')

class MiniWorkspace
  # (SelfManager, Updater, BreedManager, RNG, PlotManager) => MiniWorkspace
  constructor: (@selfManager, @updater, @breedManager, @rng, @plotManager) ->

module.exports =
  (modelConfig) -> (breedObjs) -> (turtlesOwns, linksOwns) -> (code) -> (widgets) -> (extensionDumpers) -> () -> # World args; see constructor for `World` --JAB (4/17/14)

    worldArgs = arguments # If you want `Workspace` to take more parameters--parameters not related to `World`--just keep returning new functions

    dialogConfig       = modelConfig?.dialog       ? new UserDialogConfig
    importExportConfig = modelConfig?.importExport ? new ImportExportConfig
    mouseConfig        = modelConfig?.mouse        ? new MouseConfig
    outputConfig       = modelConfig?.output       ? new OutputConfig
    plots              = modelConfig?.plots        ? []
    printConfig        = modelConfig?.print        ? new PrintConfig
    worldConfig        = modelConfig?.world        ? new WorldConfig

    Meta.version = modelConfig?.version ? Meta.version

    dump        = Dump(extensionDumpers)
    rng         = new RNG
    typechecker = NLType
    outputStore = ""

    selfManager  = new SelfManager
    breedManager = new BreedManager(breedObjs, turtlesOwns, linksOwns)
    plotManager  = new PlotManager(plots)
    timer        = new Timer
    updater      = new Updater(dump)

    # The world is only given `dump` for stupid `atpoints` in `AbstractAgentSet`... --JAB (8/24/17)
    world           = new World(new MiniWorkspace(selfManager, updater, breedManager, rng, plotManager), worldConfig, (-> outputConfig.clear(); outputStore = ""), (-> outputStore), ((text) -> outputStore = text), dump, worldArgs...)
    layoutManager   = new LayoutManager(world, rng.nextDouble)

    evalPrims = new EvalPrims(code, widgets)
    prims     = new Prims(dump, Hasher, rng, world, evalPrims)
    selfPrims = new SelfPrims(selfManager.self)
    linkPrims = new LinkPrims(world)
    listPrims = new ListPrims(dump, Hasher, prims.equality.bind(prims), rng.nextInt)

    mousePrims      = new MousePrims(mouseConfig)
    outputPrims     = new OutputPrims(outputConfig, ((x) -> outputStore += x), (-> outputStore = ""), dump)
    printPrims      = new PrintPrims(printConfig, dump)
    userDialogPrims = new UserDialogPrims(dialogConfig)

    importWorldFromCSV = (csvText) ->

      functionify = (obj) -> (x) ->
        msg = "Cannot find corresponding breed name for #{x}!"
        fold(-> throw new Error(msg))(id)(lookup(x)(obj))

      breedNamePairs   = values(breedManager.breeds()).map(({ name, singular }) -> [name, singular])
      ptsObject        = toObject(breedNamePairs)
      stpObject        = toObject(breedNamePairs.map(([p, s]) -> [s, p]))
      pluralToSingular = functionify(ptsObject)
      singularToPlural = functionify(stpObject)

      worldState = csvToWorldState(singularToPlural, pluralToSingular)(csvText)
      world.importState(worldState)

    importExportPrims = new ImportExportPrims( importExportConfig
                                             , (-> world.exportCSV())
                                             , (-> world.exportAllPlotsCSV())
                                             , ((plot) -> world.exportPlotCSV(plot))
                                             , importWorldFromCSV
                                             )

    {
      selfManager
      breedManager
      dump
      importExportPrims
      layoutManager
      linkPrims
      listPrims
      mousePrims
      outputPrims
      plotManager
      evalPrims
      prims
      printPrims
      rng
      selfPrims
      timer
      typechecker
      updater
      userDialogPrims
      world
    }
