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
    notify:  function(str) {}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
modelConfig.plots = [(function() {
  var name    = 'Average';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Average', 'average')(function() {
        plotManager.plotPoint(world.ticker.tickCount(), Prims.div(world.observer.getGlobal("total"), world.patches().size()));;
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Average', undefined)(function() {
        try {
          if (!world.observer.getGlobal("plot?")) {
            throw new Exception.StopInterrupt;
          }
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  };
  return new Plot(name, pens, plotOps, "", "", true, true, 0.0, 1.0, 2.0, 2.1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])(["plot?", "total", "result"], ["plot?"], ["n"], 0, 99, 0, 99, 3.0, false, false, turtleShapes, linkShapes, function(){});
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
  var benchmark = function() {
    workspace.rng.setSeed(0);
    workspace.timer.reset();
    procedures.setup();
    for (var _index_93_99 = 0, _repeatcount_93_99 = StrictMath.floor(5000); _index_93_99 < _repeatcount_93_99; _index_93_99++){
      procedures.go();
    }
    world.observer.setGlobal("result", workspace.timer.elapsed());
  };
  var setup = function() {
    world.clearAll();
    world.patches().ask(function() {
      SelfManager.self().setPatchVariable("n", 2);
      procedures.colorize();
    }, true);
    world.observer.setGlobal("total", (2 * world.patches().size()));
    world.ticker.reset();
  };
  var go = function() {
    var activePatches = Prims.patchSet(ListPrims.oneOf(world.patches()));
    activePatches.ask(function() {
      SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") + 1));
      world.observer.setGlobal("total", (world.observer.getGlobal("total") + 1));
      procedures.colorize();
    }, true);
    while (activePatches.nonEmpty()) {
      var overloadedPatches = activePatches.agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); });
      overloadedPatches.ask(function() {
        SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") - 4));
        world.observer.setGlobal("total", (world.observer.getGlobal("total") - 4));
        procedures.colorize();
        SelfManager.self().getNeighbors4().ask(function() {
          SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") + 1));
          world.observer.setGlobal("total", (world.observer.getGlobal("total") + 1));
          procedures.colorize();
        }, true);
      }, true);
      activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() { return SelfManager.self().getNeighbors4(); }));
    }
    world.ticker.tick();
  };
  var colorize = function() {
    if (Prims.lte(SelfManager.self().getPatchVariable("n"), 3)) {
      SelfManager.self().setPatchVariable("pcolor", ListPrims.item(SelfManager.self().getPatchVariable("n"), [83, 54, 45, 25]));
    }
    else {
      SelfManager.self().setPatchVariable("pcolor", 15);
    }
  };
  return {
    "BENCHMARK":benchmark,
    "COLORIZE":colorize,
    "GO":go,
    "SETUP":setup,
    "benchmark":benchmark,
    "colorize":colorize,
    "go":go,
    "setup":setup
  };
})();
world.observer.setGlobal("plot?", false);
