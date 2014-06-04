define(['engine/agentset', 'engine/breedmanager', 'engine/layoutmanager', 'engine/linkprims', 'engine/prims'
      , 'engine/timer', 'engine/updater', 'engine/world']
     , ( AgentSet,          BreedManager,          LayoutManager,          LinkPrims,          Prims
      ,  Timer,          Updater,          World) ->

  (breedObjs) -> () -> # World args; see constructor for `World` --JAB (4/17/14)

    worldArgs = arguments # If you want `Workspace` to take more parameters--parameters not related to `World`--just keep returning new functions

    agentSet     = new AgentSet
    breedManager = new BreedManager(breedObjs)
    timer        = new Timer
    updater      = new Updater

    world         = new World(agentSet, updater, breedManager, worldArgs...)
    layoutManager = new LayoutManager(world)
    linkPrims     = new LinkPrims(world)
    prims         = new Prims(world)

    {
      agentSet      : agentSet
      breedManager  : breedManager
      layoutManager : layoutManager
      linkPrims     : linkPrims
      prims         : prims
      timer         : timer
      updater       : updater
      world         : world
    }

)
