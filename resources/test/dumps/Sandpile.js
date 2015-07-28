var AgentModel = tortoise_require('agentmodel');
var Call = tortoise_require('util/call');
var ColorModel = tortoise_require('engine/core/colormodel');
var Dump = tortoise_require('engine/dump');
var Exception = tortoise_require('util/exception');
var Link = tortoise_require('engine/core/link');
var LinkSet = tortoise_require('engine/core/linkset');
var Meta = tortoise_require('meta');
var NLMath = tortoise_require('util/nlmath');
var NLType = tortoise_require('engine/core/typechecker');
var Nobody = tortoise_require('engine/core/nobody');
var PatchSet = tortoise_require('engine/core/patchset');
var PenBundle = tortoise_require('engine/plot/pen');
var Plot = tortoise_require('engine/plot/plot');
var PlotOps = tortoise_require('engine/plot/plotops');
var Random = tortoise_require('shim/random');
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0.0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0.0,1.0]},{"x-offset":0.0,"is-visible":true,"dash-pattern":[1.0,0.0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0.0,1.0]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
modelConfig.plots = [(function() {
  var name    = 'Average grain count';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Average grain count', 'average')(function() { plotManager.plotValue((world.observer.getGlobal("total") / world.patches().size()));; });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "ticks", "grains", false, 0.0, 1.0, 2.0, 2.1, setup, update);
})(), (function() {
  var name    = 'Avalanche sizes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Avalanche sizes', 'default')(function() {
        if ((Prims.equality(NLMath.mod(world.ticker.tickCount(), 100), 0) && !ListPrims.empty(world.observer.getGlobal("sizes")))) {
          plotManager.resetPen();
          var counts = Tasks.nValues((1 + ListPrims.max(world.observer.getGlobal("sizes"))), Tasks.reporterTask(function() {
            var taskArguments = arguments;
            return 0;
          }));
          Tasks.forEach(Tasks.commandTask(function() {
            var taskArguments = arguments;
            counts = ListPrims.replaceItem(taskArguments[0], counts, (1 + ListPrims.item(taskArguments[0], counts)));
          }), world.observer.getGlobal("sizes"));
          var s = 0;
          Tasks.forEach(Tasks.commandTask(function() {
            var taskArguments = arguments;
            var c = taskArguments[0];
            if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {
              plotManager.plotPoint(NLMath.log(s, 10), NLMath.log(c, 10));
            }
            s = (s + 1);
          }), counts);
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "log size", "log count", false, 0.0, 1.0, 0.0, 1.0, setup, update);
})(), (function() {
  var name    = 'Avalanche lifetimes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Avalanche lifetimes', 'default')(function() {
        if ((Prims.equality(NLMath.mod(world.ticker.tickCount(), 100), 0) && !ListPrims.empty(world.observer.getGlobal("lifetimes")))) {
          plotManager.resetPen();
          var counts = Tasks.nValues((1 + ListPrims.max(world.observer.getGlobal("lifetimes"))), Tasks.reporterTask(function() {
            var taskArguments = arguments;
            return 0;
          }));
          Tasks.forEach(Tasks.commandTask(function() {
            var taskArguments = arguments;
            counts = ListPrims.replaceItem(taskArguments[0], counts, (1 + ListPrims.item(taskArguments[0], counts)));
          }), world.observer.getGlobal("lifetimes"));
          var l = 0;
          Tasks.forEach(Tasks.commandTask(function() {
            var taskArguments = arguments;
            var c = taskArguments[0];
            if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {
              plotManager.plotPoint(NLMath.log(l, 10), NLMath.log(c, 10));
            }
            l = (l + 1);
          }), counts);
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "log lifetime", "log count", false, 0.0, 1.0, 0.0, 1.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])(["animate-avalanches?", "drop-location", "grains-per-patch", "total", "total-on-tick", "sizes", "last-size", "lifetimes", "last-lifetime", "selected-patch", "default-color", "fired-color", "selected-color"], ["animate-avalanches?", "drop-location", "grains-per-patch"], ["n", "n-stack", "base-color"], -50, 50, -50, 50, 4.0, false, false, turtleShapes, linkShapes, function(){});
var BreedManager = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var Updater = workspace.updater;
var plotManager = workspace.plotManager;
var world = workspace.world;
var procedures = (function() {
  var setup = function(setupTask) {
    world.clearAll();
    world.observer.setGlobal("default-color", 105);
    world.observer.setGlobal("fired-color", 15);
    world.observer.setGlobal("selected-color", 55);
    world.observer.setGlobal("selected-patch", Nobody);
    world.patches().ask(function() {
      SelfPrims.setPatchVariable("n", (setupTask)());
      SelfPrims.setPatchVariable("n-stack", []);
      SelfPrims.setPatchVariable("base-color", world.observer.getGlobal("default-color"));
    }, true);
    var ignore = Call(procedures.stabilize, false);
    world.patches().ask(function() { Call(procedures.recolor); }, true);
    world.observer.setGlobal("total", ListPrims.sum(world.patches().projectionBy(function() { return SelfPrims.getPatchVariable("n"); })));
    world.observer.setGlobal("sizes", []);
    world.observer.setGlobal("lifetimes", []);
    world.ticker.reset();
  };
  var setupUniform = function(initial) {
    Call(procedures.setup, Tasks.reporterTask(function() {
      var taskArguments = arguments;
      return initial;
    }));
  };
  var setupRandom = function() {
    Call(procedures.setup, Tasks.reporterTask(function() {
      var taskArguments = arguments;
      return Prims.random(4);
    }));
  };
  var recolor = function() {
    SelfPrims.setPatchVariable("pcolor", ColorModel.scaleColor(SelfPrims.getPatchVariable("base-color"), SelfPrims.getPatchVariable("n"), 0, 4));
  };
  var go = function() {
    var drop = Call(procedures.dropPatch);
    if (!Prims.equality(drop, Nobody)) {
      drop.ask(function() {
        Call(procedures.updateN, 1);
        Call(procedures.recolor);
      }, true);
      var results = Call(procedures.stabilize, world.observer.getGlobal("animate-avalanches?"));
      var avalanchePatches = ListPrims.first(results);
      var lifetime = ListPrims.last(results);
      if (avalanchePatches.nonEmpty()) {
        world.observer.setGlobal("sizes", ListPrims.lput(avalanchePatches.size(), world.observer.getGlobal("sizes")));
        world.observer.setGlobal("lifetimes", ListPrims.lput(lifetime, world.observer.getGlobal("lifetimes")));
      }
      avalanchePatches.ask(function() {
        Call(procedures.recolor);
        SelfPrims.getNeighbors4().ask(function() { Call(procedures.recolor); }, true);
      }, true);
      notImplemented('display', undefined)();
      avalanchePatches.ask(function() {
        SelfPrims.setPatchVariable("base-color", world.observer.getGlobal("default-color"));
        Call(procedures.recolor);
      }, true);
      world.observer.setGlobal("total-on-tick", world.observer.getGlobal("total"));
      world.ticker.tick();
    }
  };
  var explore = function() {
    if (MousePrims.isInside()) {
      var p = world.getPatchAt(MousePrims.getX(), MousePrims.getY());
      world.observer.setGlobal("selected-patch", p);
      world.patches().ask(function() { Call(procedures.pushN); }, true);
      world.observer.getGlobal("selected-patch").ask(function() { Call(procedures.updateN, 1); }, true);
      var results = Call(procedures.stabilize, false);
      world.patches().ask(function() { Call(procedures.popN); }, true);
      world.patches().ask(function() {
        SelfPrims.setPatchVariable("base-color", world.observer.getGlobal("default-color"));
        Call(procedures.recolor);
      }, true);
      var avalanchePatches = ListPrims.first(results);
      avalanchePatches.ask(function() {
        SelfPrims.setPatchVariable("base-color", world.observer.getGlobal("selected-color"));
        Call(procedures.recolor);
      }, true);
      notImplemented('display', undefined)();
    }
    else {
      if (!Prims.equality(world.observer.getGlobal("selected-patch"), Nobody)) {
        world.observer.setGlobal("selected-patch", Nobody);
        world.patches().ask(function() {
          SelfPrims.setPatchVariable("base-color", world.observer.getGlobal("default-color"));
          Call(procedures.recolor);
        }, true);
      }
    }
  };
  var stabilize = function(animate_p) {
    var activePatches = world.patches().agentFilter(function() { return Prims.gt(SelfPrims.getPatchVariable("n"), 3); });
    var iters = 0;
    var avalanchePatches = new PatchSet([]);
    while (activePatches.nonEmpty()) {
      var overloadedPatches = activePatches.agentFilter(function() { return Prims.gt(SelfPrims.getPatchVariable("n"), 3); });
      if (overloadedPatches.nonEmpty()) {
        iters = (iters + 1);
      }
      overloadedPatches.ask(function() {
        SelfPrims.setPatchVariable("base-color", world.observer.getGlobal("fired-color"));
        Call(procedures.updateN, -4);
        if (animate_p) {
          Call(procedures.recolor);
        }
        SelfPrims.getNeighbors4().ask(function() {
          Call(procedures.updateN, 1);
          if (animate_p) {
            Call(procedures.recolor);
          }
        }, true);
      }, true);
      if (animate_p) {
        notImplemented('display', undefined)();
      }
      avalanchePatches = Prims.patchSet(avalanchePatches, overloadedPatches);
      activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() { return SelfPrims.getNeighbors4(); }));
    }
    return ListPrims.list(avalanchePatches, iters);
  };
  var updateN = function(howMuch) {
    SelfPrims.setPatchVariable("n", (SelfPrims.getPatchVariable("n") + howMuch));
    world.observer.setGlobal("total", (world.observer.getGlobal("total") + howMuch));
  };
  var dropPatch = function() {
    if (Prims.equality(world.observer.getGlobal("drop-location"), "center")) {
      return world.getPatchAt(0, 0);
    }
    if (Prims.equality(world.observer.getGlobal("drop-location"), "random")) {
      return ListPrims.oneOf(world.patches());
    }
    if ((Prims.equality(world.observer.getGlobal("drop-location"), "mouse-click") && MousePrims.isDown())) {
      if (Prims.isThrottleTimeElapsed("dropPatch_0", workspace.selfManager.self(), 0.3)) {
        Prims.resetThrottleTimerFor("dropPatch_0", workspace.selfManager.self());
        return world.getPatchAt(MousePrims.getX(), MousePrims.getY());
      }
    }
    return Nobody;
  };
  var pushN = function() {
    SelfPrims.setPatchVariable("n-stack", ListPrims.fput(SelfPrims.getPatchVariable("n"), SelfPrims.getPatchVariable("n-stack")));
  };
  var popN = function() {
    Call(procedures.updateN, (ListPrims.first(SelfPrims.getPatchVariable("n-stack")) - SelfPrims.getPatchVariable("n")));
    SelfPrims.setPatchVariable("n-stack", ListPrims.butLast(SelfPrims.getPatchVariable("n-stack")));
  };
  return {
    "DROP-PATCH":dropPatch,
    "EXPLORE":explore,
    "GO":go,
    "POP-N":popN,
    "PUSH-N":pushN,
    "RECOLOR":recolor,
    "SETUP":setup,
    "SETUP-RANDOM":setupRandom,
    "SETUP-UNIFORM":setupUniform,
    "STABILIZE":stabilize,
    "UPDATE-N":updateN,
    "dropPatch":dropPatch,
    "explore":explore,
    "go":go,
    "popN":popN,
    "pushN":pushN,
    "recolor":recolor,
    "setup":setup,
    "setupRandom":setupRandom,
    "setupUniform":setupUniform,
    "stabilize":stabilize,
    "updateN":updateN
  };
})();
world.observer.setGlobal("animate-avalanches?", false);
world.observer.setGlobal("drop-location", "random");
world.observer.setGlobal("grains-per-patch", 0);
