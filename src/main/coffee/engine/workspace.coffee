# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/dump', 'engine/hasher', 'engine/updater', 'engine/core/breedmanager', 'engine/core/world'
      , 'engine/core/structure/selfmanager', 'engine/prim/layoutmanager', 'engine/prim/linkprims'
      , 'engine/prim/listprims', 'engine/prim/prims', 'engine/prim/selfprims', 'util/timer']
     , ( Dump,          Hasher,          Updater,          BreedManager,               World
      ,  SelfManager,                         LayoutManager,               LinkPrims
      ,  ListPrims,               Prims,               SelfPrims,               Timer) ->

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

)
