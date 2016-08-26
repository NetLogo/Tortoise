var AgentModel = tortoise_require('agentmodel');
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
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    notify:  function(str) {},
    yesOrNo: function(str) { return true; }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.world = {
    resizeWorld: function(agent) {}
  }
}
modelConfig.plots = [(function() {
  var name    = 'Average grain count';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Average grain count', 'average')(function() { plotManager.plotValue(Prims.div(world.observer.getGlobal("total"), world.patches().size()));; });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "ticks", "grains", false, true, 0.0, 1.0, 2.0, 2.1, setup, update);
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
  return new Plot(name, pens, plotOps, "log size", "log count", false, true, 0.0, 1.0, 0.0, 1.0, setup, update);
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
  return new Plot(name, pens, plotOps, "log lifetime", "log count", false, true, 0.0, 1.0, 0.0, 1.0, setup, update);
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
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
var procedures = (function() {
  var procs = {};
  var temp = undefined;
  temp = (function(setupTask) {
    world.clearAll();
    world.observer.setGlobal("default-color", 105);
    world.observer.setGlobal("fired-color", 15);
    world.observer.setGlobal("selected-color", 55);
    world.observer.setGlobal("selected-patch", Nobody);
    world.patches().ask(function() {
      SelfManager.self().setPatchVariable("n", Prims.runResult(setupTask));
      SelfManager.self().setPatchVariable("n-stack", []);
      SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
    }, true);
    var ignore = procedures["STABILIZE"](false);
    world.patches().ask(function() { procedures["RECOLOR"](); }, true);
    world.observer.setGlobal("total", ListPrims.sum(world.patches().projectionBy(function() { return SelfManager.self().getPatchVariable("n"); })));
    world.observer.setGlobal("sizes", []);
    world.observer.setGlobal("lifetimes", []);
    world.ticker.reset();
  });
  procs["setup"] = temp;
  procs["SETUP"] = temp;
  temp = (function(initial) {
    procedures["SETUP"](Tasks.reporterTask(function() {
      var taskArguments = arguments;
      return initial;
    }));
  });
  procs["setupUniform"] = temp;
  procs["SETUP-UNIFORM"] = temp;
  temp = (function() {
    procedures["SETUP"](Tasks.reporterTask(function() {
      var taskArguments = arguments;
      return Prims.random(4);
    }));
  });
  procs["setupRandom"] = temp;
  procs["SETUP-RANDOM"] = temp;
  temp = (function() {
    SelfManager.self().setPatchVariable("pcolor", ColorModel.scaleColor(SelfManager.self().getPatchVariable("base-color"), SelfManager.self().getPatchVariable("n"), 0, 4));
  });
  procs["recolor"] = temp;
  procs["RECOLOR"] = temp;
  temp = (function() {
    var drop = procedures["DROP-PATCH"]();
    if (!Prims.equality(drop, Nobody)) {
      drop.ask(function() {
        procedures["UPDATE-N"](1);
        procedures["RECOLOR"]();
      }, true);
      var results = procedures["STABILIZE"](world.observer.getGlobal("animate-avalanches?"));
      var avalanchePatches = ListPrims.first(results);
      var lifetime = ListPrims.last(results);
      if (avalanchePatches.nonEmpty()) {
        world.observer.setGlobal("sizes", ListPrims.lput(avalanchePatches.size(), world.observer.getGlobal("sizes")));
        world.observer.setGlobal("lifetimes", ListPrims.lput(lifetime, world.observer.getGlobal("lifetimes")));
      }
      avalanchePatches.ask(function() {
        procedures["RECOLOR"]();
        SelfManager.self().getNeighbors4().ask(function() { procedures["RECOLOR"](); }, true);
      }, true);
      notImplemented('display', undefined)();
      avalanchePatches.ask(function() {
        SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
        procedures["RECOLOR"]();
      }, true);
      world.observer.setGlobal("total-on-tick", world.observer.getGlobal("total"));
      world.ticker.tick();
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    if (MousePrims.isInside()) {
      var p = world.getPatchAt(MousePrims.getX(), MousePrims.getY());
      world.observer.setGlobal("selected-patch", p);
      world.patches().ask(function() { procedures["PUSH-N"](); }, true);
      world.observer.getGlobal("selected-patch").ask(function() { procedures["UPDATE-N"](1); }, true);
      var results = procedures["STABILIZE"](false);
      world.patches().ask(function() { procedures["POP-N"](); }, true);
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
        procedures["RECOLOR"]();
      }, true);
      var avalanchePatches = ListPrims.first(results);
      avalanchePatches.ask(function() {
        SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("selected-color"));
        procedures["RECOLOR"]();
      }, true);
      notImplemented('display', undefined)();
    }
    else {
      if (!Prims.equality(world.observer.getGlobal("selected-patch"), Nobody)) {
        world.observer.setGlobal("selected-patch", Nobody);
        world.patches().ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
          procedures["RECOLOR"]();
        }, true);
      }
    }
  });
  procs["explore"] = temp;
  procs["EXPLORE"] = temp;
  temp = (function(animate_p) {
    try {
      var activePatches = world.patches().agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); });
      var iters = 0;
      var avalanchePatches = new PatchSet([]);
      while (activePatches.nonEmpty()) {
        var overloadedPatches = activePatches.agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); });
        if (overloadedPatches.nonEmpty()) {
          iters = (iters + 1);
        }
        overloadedPatches.ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("fired-color"));
          procedures["UPDATE-N"](-4);
          if (animate_p) {
            procedures["RECOLOR"]();
          }
          SelfManager.self().getNeighbors4().ask(function() {
            procedures["UPDATE-N"](1);
            if (animate_p) {
              procedures["RECOLOR"]();
            }
          }, true);
        }, true);
        if (animate_p) {
          notImplemented('display', undefined)();
        }
        avalanchePatches = Prims.patchSet(avalanchePatches, overloadedPatches);
        activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() { return SelfManager.self().getNeighbors4(); }));
      }
      throw new Exception.ReportInterrupt(ListPrims.list(avalanchePatches, iters));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  });
  procs["stabilize"] = temp;
  procs["STABILIZE"] = temp;
  temp = (function(howMuch) {
    SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") + howMuch));
    world.observer.setGlobal("total", (world.observer.getGlobal("total") + howMuch));
  });
  procs["updateN"] = temp;
  procs["UPDATE-N"] = temp;
  temp = (function() {
    try {
      if (Prims.equality(world.observer.getGlobal("drop-location"), "center")) {
        throw new Exception.ReportInterrupt(world.getPatchAt(0, 0));
      }
      if (Prims.equality(world.observer.getGlobal("drop-location"), "random")) {
        throw new Exception.ReportInterrupt(ListPrims.oneOf(world.patches()));
      }
      if ((Prims.equality(world.observer.getGlobal("drop-location"), "mouse-click") && MousePrims.isDown())) {
        if (Prims.isThrottleTimeElapsed("dropPatch_0", workspace.selfManager.self(), 0.3)) {
          Prims.resetThrottleTimerFor("dropPatch_0", workspace.selfManager.self());
          throw new Exception.ReportInterrupt(world.getPatchAt(MousePrims.getX(), MousePrims.getY()));
        }
      }
      throw new Exception.ReportInterrupt(Nobody);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  });
  procs["dropPatch"] = temp;
  procs["DROP-PATCH"] = temp;
  temp = (function() {
    SelfManager.self().setPatchVariable("n-stack", ListPrims.fput(SelfManager.self().getPatchVariable("n"), SelfManager.self().getPatchVariable("n-stack")));
  });
  procs["pushN"] = temp;
  procs["PUSH-N"] = temp;
  temp = (function() {
    procedures["UPDATE-N"]((ListPrims.first(SelfManager.self().getPatchVariable("n-stack")) - SelfManager.self().getPatchVariable("n")));
    SelfManager.self().setPatchVariable("n-stack", ListPrims.butLast(SelfManager.self().getPatchVariable("n-stack")));
  });
  procs["popN"] = temp;
  procs["POP-N"] = temp;
  return procs;
})();
world.observer.setGlobal("animate-avalanches?", false);
world.observer.setGlobal("drop-location", "random");
world.observer.setGlobal("grains-per-patch", 0);
