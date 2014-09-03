goog.provide('engine.workspace');
goog.require('engine.dump');
goog.require('engine.hasher');
goog.require('engine.updater');
goog.require('engine.core.breedmanager');
goog.require('engine.core.world');
goog.require('engine.core.structure.selfmanager');
// SHIV SELF-MAN
goog.require('agents.singletons.self_manager');
goog.require('engine.prim.layoutmanager');
goog.require('engine.prim.linkprims');
goog.require('engine.prim.prims');
goog.require('engine.prim.selfprims');
goog.require('util.timer');
engine.workspace = function (breedObjs) {
    return function () {
        var breedManager, layoutManager, linkPrims, prims, selfManager, selfPrims, timer, updater, world, worldArgs;
        worldArgs = arguments;
        // This is probably going to break! Hurrah!
        selfManager = agents.singletons.self_manager;
        breedManager = new engine.core.breedmanager(breedObjs);
        prims = new engine.prim.prims(engine.dump, engine.hasher);
        selfPrims = new engine.prim.selfprims(selfManager.self);
        timer = new util.timer();
        updater = new engine.updater();
        world = function (func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
        }(engine.core.world, [
            selfManager,
            updater,
            breedManager
        ].concat(__slice.call(worldArgs)), function () {
        });
        layoutManager = new engine.prim.layoutmanager(world);
        linkPrims = new engine.prim.linkprims(world);
        return {
            selfManager: selfManager,
            breedManager: breedManager,
            layoutManager: layoutManager,
            linkPrims: linkPrims,
            prims: prims,
            selfPrims: selfPrims,
            timer: timer,
            updater: updater,
            world: world
        };
    };
};
