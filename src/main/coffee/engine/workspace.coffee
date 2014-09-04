# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Dump          = require('./dump')
Hasher        = require('./hasher')
Updater       = require('./updater')
BreedManager  = require('./core/breedmanager')
World         = require('./core/world')
SelfManager   = require('./core/structure/selfmanager')
LayoutManager = require('./prim/layoutmanager')
LinkPrims     = require('./prim/linkprims')
ListPrims     = require('./prim/listprims')
Prims         = require('./prim/prims')
SelfPrims     = require('./prim/selfprims')
Timer         = require('tortoise/util/timer')

module.exports =
  (breedObjs) -> () -> # World args; see constructor for `World` --JAB (4/17/14)

    worldArgs = arguments # If you want `Workspace` to take more parameters--parameters not related to `World`--just keep returning new functions

    selfManager  = new SelfManager
    breedManager = new BreedManager(breedObjs)
    prims        = new Prims(Dump, Hasher)
    selfPrims    = new SelfPrims(selfManager.self)
    timer        = new Timer
    updater      = new Updater

    world         = new World(selfManager, updater, breedManager, worldArgs...)
    layoutManager = new LayoutManager(world)
    linkPrims     = new LinkPrims(world)
    listPrims     = new ListPrims(Hasher, prims.equality.bind(prims))

    {
      selfManager   : selfManager
      breedManager  : breedManager
      layoutManager : layoutManager
      linkPrims     : linkPrims
      listPrims     : listPrims
      prims         : prims
      selfPrims     : selfPrims
      timer         : timer
      updater       : updater
      world         : world
    }
