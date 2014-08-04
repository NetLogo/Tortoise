# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.workspace')

goog.require('engine.dump')
goog.require('engine.updater')
goog.require('engine.core.breedmanager')
goog.require('engine.core.world')
goog.require('engine.core.structure.selfmanager')
goog.require('engine.prim.layoutmanager')
goog.require('engine.prim.linkprims')
goog.require('engine.prim.prims')
goog.require('util.timer')

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

