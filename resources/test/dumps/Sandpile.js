var modelConfig  = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};

var PenBundle = tortoise_require('engine/plot/pen');
var Plot      = tortoise_require('engine/plot/plot');
var PlotOps   = tortoise_require('engine/plot/plotops');

modelConfig.plots = [(function() {
  var name    = 'Average grain count';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Average grain count', 'average')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Average grain count', 'average')(function() { plotManager.plotValue((world.observer.getGlobal('total') / world.patches().size()));; }); }); })];
  var setup   = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Average grain count', undefined)(function() {}); }); };
  var update  = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Average grain count', undefined)(function() {}); }); };
  return new Plot(name, pens, plotOps, 'ticks', 'grains', false, 0.0, 1.0, 2.0, 2.1, setup, update);
})(), (function() {
  var name    = 'Avalanche sizes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Avalanche sizes', 'default')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Avalanche sizes', 'default')(function() { if ((Prims.equality(Prims.mod(world.ticker.tickCount(), 100), 0) && !ListPrims.empty(world.observer.getGlobal('sizes')))) {
  plotManager.resetPen();
  var counts = Tasks.nValues((1 + ListPrims.max(world.observer.getGlobal('sizes'))), Tasks.reporterTask(function() { var taskArguments = arguments;
  return 0; }));
  Tasks.forEach(Tasks.commandTask(function() {
    var taskArguments = arguments;
    counts = ListPrims.replaceItem(taskArguments[0], counts, (1 + ListPrims.item(taskArguments[0], counts)));
  }), world.observer.getGlobal('sizes'));
  var s = 0;
  Tasks.forEach(Tasks.commandTask(function() {
    var taskArguments = arguments;
    var c = taskArguments[0];
    if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {
      plotManager.plotPoint(Prims.log(s, 10), Prims.log(c, 10));
    }
    s = (s + 1);
  }), counts);
}; }); }); })];
  var setup   = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Avalanche sizes', undefined)(function() {}); }); };
  var update  = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Avalanche sizes', undefined)(function() {}); }); };
  return new Plot(name, pens, plotOps, 'log size', 'log count', false, 0.0, 1.0, 0.0, 1.0, setup, update);
})(), (function() {
  var name    = 'Avalanche lifetimes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Avalanche lifetimes', 'default')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Avalanche lifetimes', 'default')(function() { if ((Prims.equality(Prims.mod(world.ticker.tickCount(), 100), 0) && !ListPrims.empty(world.observer.getGlobal('lifetimes')))) {
  plotManager.resetPen();
  var counts = Tasks.nValues((1 + ListPrims.max(world.observer.getGlobal('lifetimes'))), Tasks.reporterTask(function() { var taskArguments = arguments;
  return 0; }));
  Tasks.forEach(Tasks.commandTask(function() {
    var taskArguments = arguments;
    counts = ListPrims.replaceItem(taskArguments[0], counts, (1 + ListPrims.item(taskArguments[0], counts)));
  }), world.observer.getGlobal('lifetimes'));
  var l = 0;
  Tasks.forEach(Tasks.commandTask(function() {
    var taskArguments = arguments;
    var c = taskArguments[0];
    if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {
      plotManager.plotPoint(Prims.log(l, 10), Prims.log(c, 10));
    }
    l = (l + 1);
  }), counts);
}; }); }); })];
  var setup   = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Avalanche lifetimes', undefined)(function() {}); }); };
  var update  = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Avalanche lifetimes', undefined)(function() {}); }); };
  return new Plot(name, pens, plotOps, 'log lifetime', 'log count', false, 0.0, 1.0, 0.0, 1.0, setup, update);
})()];

var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])(['animate-avalanches?', 'drop-location', 'grains-per-patch', 'total', 'total-on-tick', 'sizes', 'last-size', 'lifetimes', 'last-lifetime', 'selected-patch', 'default-color', 'fired-color', 'selected-color'], ['animate-avalanches?', 'drop-location', 'grains-per-patch'], ['n', 'n-stack', 'base-color'], -50, 50, -50, 50, 4.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});

var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var ListPrims     = workspace.listPrims;
var MousePrims    = workspace.mousePrims;
var plotManager   = workspace.plotManager;
var Prims         = workspace.prims;
var SelfPrims     = workspace.selfPrims;
var SelfManager   = workspace.selfManager;
var Updater       = workspace.updater;
var world         = workspace.world;

var Call           = tortoise_require('util/call');
var ColorModel     = tortoise_require('util/colormodel');
var Exception      = tortoise_require('util/exception');
var Trig           = tortoise_require('util/trig');
var Type           = tortoise_require('util/typechecker');
var notImplemented = tortoise_require('util/notimplemented');

var Dump      = tortoise_require('engine/dump');
var Link      = tortoise_require('engine/core/link');
var LinkSet   = tortoise_require('engine/core/linkset');
var Nobody    = tortoise_require('engine/core/nobody');
var PatchSet  = tortoise_require('engine/core/patchset');
var Turtle    = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var Tasks     = tortoise_require('engine/prim/tasks');

var AgentModel = tortoise_require('agentmodel');
var Denuller   = tortoise_require('nashorn/denuller');
var Random     = tortoise_require('shim/random');
var StrictMath = tortoise_require('shim/strictmath');
function setup(setupTask) {
  world.clearAll();
  world.observer.setGlobal('default-color', 105);
  world.observer.setGlobal('fired-color', 15);
  world.observer.setGlobal('selected-color', 55);
  world.observer.setGlobal('selected-patch', Nobody);
  world.patches().ask(function() {
    SelfPrims.setPatchVariable('n', (setupTask)());
    SelfPrims.setPatchVariable('n-stack', []);
    SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
  }, true);
  var ignore = Call(stabilize, false);
  world.patches().ask(function() {
    Call(recolor);
  }, true);
  world.observer.setGlobal('total', ListPrims.sum(world.patches().projectionBy(function() {
    return SelfPrims.getPatchVariable('n');
  })));
  world.observer.setGlobal('sizes', []);
  world.observer.setGlobal('lifetimes', []);
  world.ticker.reset();
}
function setupUniform(initial) {
  Call(setup, Tasks.reporterTask(function() {
    var taskArguments = arguments;
    return initial;
  }));
}
function setupRandom() {
  Call(setup, Tasks.reporterTask(function() {
    var taskArguments = arguments;
    return Prims.random(4);
  }));
}
function recolor() {
  SelfPrims.setPatchVariable('pcolor', ColorModel.scaleColor(SelfPrims.getPatchVariable('base-color'), SelfPrims.getPatchVariable('n'), 0, 4));
}
function go() {
  var drop = Call(dropPatch);
  if (!Prims.equality(drop, Nobody)) {
    drop.ask(function() {
      Call(updateN, 1);
      Call(recolor);
    }, true);
    var results = Call(stabilize, world.observer.getGlobal('animate-avalanches?'));
    var avalanchePatches = ListPrims.first(results);
    var lifetime = ListPrims.last(results);
    if (avalanchePatches.nonEmpty()) {
      world.observer.setGlobal('sizes', ListPrims.lput(avalanchePatches.size(), world.observer.getGlobal('sizes')));
      world.observer.setGlobal('lifetimes', ListPrims.lput(lifetime, world.observer.getGlobal('lifetimes')));
    }
    avalanchePatches.ask(function() {
      Call(recolor);
      SelfPrims.getNeighbors4().ask(function() {
        Call(recolor);
      }, true);
    }, true);
    notImplemented('display', undefined)();
    avalanchePatches.ask(function() {
      SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
      Call(recolor);
    }, true);
    world.observer.setGlobal('total-on-tick', world.observer.getGlobal('total'));
    world.ticker.tick();
  }
}
function explore() {
  if (MousePrims.isInside()) {
    var p = world.getPatchAt(MousePrims.getX(), MousePrims.getY());
    world.observer.setGlobal('selected-patch', p);
    world.patches().ask(function() {
      Call(pushN);
    }, true);
    world.observer.getGlobal('selected-patch').ask(function() {
      Call(updateN, 1);
    }, true);
    var results = Call(stabilize, false);
    world.patches().ask(function() {
      Call(popN);
    }, true);
    world.patches().ask(function() {
      SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
      Call(recolor);
    }, true);
    var avalanchePatches = ListPrims.first(results);
    avalanchePatches.ask(function() {
      SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('selected-color'));
      Call(recolor);
    }, true);
    notImplemented('display', undefined)();
  }
  else {
    if (!Prims.equality(world.observer.getGlobal('selected-patch'), Nobody)) {
      world.observer.setGlobal('selected-patch', Nobody);
      world.patches().ask(function() {
        SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
        Call(recolor);
      }, true);
    }
  }
}
function stabilize(animate_p) {
  var activePatches = world.patches().agentFilter(function() {
    return Prims.gt(SelfPrims.getPatchVariable('n'), 3);
  });
  var iters = 0;
  var avalanchePatches = new PatchSet([]);
  while (activePatches.nonEmpty()) {
    var overloadedPatches = activePatches.agentFilter(function() {
      return Prims.gt(SelfPrims.getPatchVariable('n'), 3);
    });
    if (overloadedPatches.nonEmpty()) {
      iters = (iters + 1);
    }
    overloadedPatches.ask(function() {
      SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('fired-color'));
      Call(updateN, -4);
      if (animate_p) {
        Call(recolor);
      }
      SelfPrims.getNeighbors4().ask(function() {
        Call(updateN, 1);
        if (animate_p) {
          Call(recolor);
        }
      }, true);
    }, true);
    if (animate_p) {
      notImplemented('display', undefined)();
    }
    avalanchePatches = Prims.patchSet(avalanchePatches, overloadedPatches);
    activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() {
      return SelfPrims.getNeighbors4();
    }));
  }
  return ListPrims.list(avalanchePatches, iters);
}
function updateN(howMuch) {
  SelfPrims.setPatchVariable('n', (SelfPrims.getPatchVariable('n') + howMuch));
  world.observer.setGlobal('total', (world.observer.getGlobal('total') + howMuch));
}
function dropPatch() {
  if (Prims.equality(world.observer.getGlobal('drop-location'), "center")) {
    return world.getPatchAt(0, 0);
  }
  if (Prims.equality(world.observer.getGlobal('drop-location'), "random")) {
    return ListPrims.oneOf(world.patches());
  }
  if ((Prims.equality(world.observer.getGlobal('drop-location'), "mouse-click") && MousePrims.isDown())) {
    if (Prims.isThrottleTimeElapsed("dropPatch_0", workspace.selfManager.self(), 0.3)) {
      Prims.resetThrottleTimerFor("dropPatch_0", workspace.selfManager.self());
      return world.getPatchAt(MousePrims.getX(), MousePrims.getY());
    }
  }
  return Nobody;
}
function pushN() {
  SelfPrims.setPatchVariable('n-stack', ListPrims.fput(SelfPrims.getPatchVariable('n'), SelfPrims.getPatchVariable('n-stack')));
}
function popN() {
  Call(updateN, (ListPrims.first(SelfPrims.getPatchVariable('n-stack')) - SelfPrims.getPatchVariable('n')));
  SelfPrims.setPatchVariable('n-stack', ListPrims.butLast(SelfPrims.getPatchVariable('n-stack')));
}
world.observer.setGlobal('animate-avalanches?', false);
world.observer.setGlobal('drop-location', "random");
world.observer.setGlobal('grains-per-patch', 0);
