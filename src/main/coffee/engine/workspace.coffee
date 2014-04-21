define(['engine/agentset', 'engine/globals', 'engine/layoutmanager', 'engine/linkprims', 'engine/linksown'
      , 'engine/patchesown', 'engine/prims', 'engine/turtlesown', 'engine/updater', 'engine/world', 'engine/call'
      , 'engine/tasks'] #@# `Call` and `Tasks` shouldn't be loaded like this
     , ( AgentSet,          Globals,          LayoutManager,          LinkPrims,          LinksOwn
      ,  PatchesOwn,          Prims,          TurtlesOwn,          Updater,          World,          []
      ,  []) ->

  () -> # World args; see constructor for `World` --JAB (4/17/14)

    worldArgs = arguments # If you want `Workspace` to take more parameters--parameters not related to `World`--just keep returning new functions

    agentSet = new AgentSet
    updater  = new Updater

    world         = new World(new Globals, new PatchesOwn, new TurtlesOwn, new LinksOwn, agentSet, updater, worldArgs...)
    layoutManager = new LayoutManager(world)
    linkPrims     = new LinkPrims(world)
    prims         = new Prims(world)

    {
      agentSet      : agentSet
      layoutManager : layoutManager
      linkPrims     : linkPrims
      prims         : prims
      updater       : updater
      world         : world
    }

)
