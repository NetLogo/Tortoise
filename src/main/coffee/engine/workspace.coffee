# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/dump', 'engine/updater', 'engine/core/breedmanager', 'engine/core/world'
      , 'engine/core/structure/selfmanager', 'engine/prim/layoutmanager', 'engine/prim/linkprims', 'engine/prim/prims'
      , 'util/timer']
     , ( Dump,          Updater,          BreedManager,               World
      ,  SelfManager,                         LayoutManager,               LinkPrims,               Prims
      ,  Timer) ->

  (breedObjs) -> () -> # World args; see constructor for `World` --JAB (4/17/14)

    worldArgs = arguments # If you want `Workspace` to take more parameters--parameters not related to `World`--just keep returning new functions

    selfManager  = new SelfManager
    breedManager = new BreedManager(breedObjs)
    timer        = new Timer
    updater      = new Updater

    world         = new World(selfManager, updater, breedManager, worldArgs...)
    layoutManager = new LayoutManager(world)
    linkPrims     = new LinkPrims(world)
    prims         = new Prims(world, Dump)

    {
      selfManager   : selfManager
      breedManager  : breedManager
      layoutManager : layoutManager
      linkPrims     : linkPrims
      prims         : prims
      timer         : timer
      updater       : updater
      world         : world
    }

)
