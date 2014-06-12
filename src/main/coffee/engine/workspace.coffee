define(['engine/breedmanager', 'engine/layoutmanager', 'engine/linkprims', 'engine/prims', 'engine/selfmanager'
      , 'engine/timer', 'engine/updater', 'engine/world']
     , ( BreedManager,          LayoutManager,          LinkPrims,          Prims,          SelfManager
      ,  Timer,          Updater,          World) ->

  (breedObjs) -> () -> # World args; see constructor for `World` --JAB (4/17/14)

    worldArgs = arguments # If you want `Workspace` to take more parameters--parameters not related to `World`--just keep returning new functions

    selfManager  = new SelfManager
    breedManager = new BreedManager(breedObjs)
    timer        = new Timer
    updater      = new Updater

    world         = new World(selfManager, updater, breedManager, worldArgs...)
    layoutManager = new LayoutManager(world)
    linkPrims     = new LinkPrims(world)
    prims         = new Prims(world)

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
