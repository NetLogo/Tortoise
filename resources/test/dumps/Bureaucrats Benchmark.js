var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Errors = tortoise_require('util/errors');
var Exception = tortoise_require('util/exception');
var Link = tortoise_require('engine/core/link');
var LinkSet = tortoise_require('engine/core/linkset');
var Meta = tortoise_require('meta');
var NLMath = tortoise_require('util/nlmath');
var NLType = tortoise_require('engine/core/typechecker');
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

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Average';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average', 'average')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.math.div(world.observer.getGlobal("total"), world.patches().size()));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (!world.observer.getGlobal("plot?")) {
            throw new Exception.StopInterrupt;
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  };
  return new Plot(name, pens, plotOps, "", "", true, true, 0, 1, 2, 2.1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [total result] patches-own [n]  to benchmark   random-seed 0   reset-timer   setup   repeat 5000 [ go ]   set result timer end  to setup   clear-all   ask patches [     set n 2     colorize   ]   set total 2 * count patches   reset-ticks end  to go   let active-patches patch-set one-of patches   ask active-patches [     set n n + 1     set total total + 1     colorize   ]   while [any? active-patches] [     let overloaded-patches active-patches with [n > 3]     ask overloaded-patches [       set n n - 4       set total total - 4       colorize       ask neighbors4 [         set n n + 1         set total total + 1         colorize       ]     ]     set active-patches patch-set [neighbors4] of overloaded-patches   ]   tick end  to colorize  ;; patch procedure   ifelse n <= 3     [ set pcolor item n [83 54 45 25] ]     [ set pcolor red ] end')([{"left":415,"top":10,"right":725,"bottom":341,"dimensions":{"minPxcor":0,"maxPxcor":99,"minPycor":0,"maxPycor":99,"patchSize":3,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":100000,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":10,"top":25,"right":89,"bottom":58,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":95,"top":25,"right":173,"bottom":58,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Average', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         if (!world.observer.getGlobal(\"plot?\")) {           throw new Exception.StopInterrupt;         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Average', 'average')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.math.div(world.observer.getGlobal(\"total\"), world.patches().size()));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (total / count patches)","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average","left":10,"top":165,"right":400,"bottom":340,"xmin":0,"xmax":1,"ymin":2,"ymax":2.1,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"if not plot? [ stop ]","pens":[{"display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (total / count patches)","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"variable":"plot?","left":40,"top":65,"right":143,"bottom":98,"display":"plot?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_42 = procedures[\"BENCHMARK\"]();   if (_maybestop_33_42 instanceof Exception.StopInterrupt) { return _maybestop_33_42; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"benchmark","left":10,"top":130,"right":170,"bottom":163,"display":"benchmark (5000 ticks)","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"left":175,"top":84,"right":400,"bottom":164,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"result\")","source":"result","left":200,"top":15,"right":285,"bottom":60,"precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["plot?", "total", "result"], ["plot?"], ["n"], 0, 99, 0, 99, 3, false, false, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
var InspectionPrims = workspace.inspectionPrims;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var PrimChecks = workspace.primChecks;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
var RandomPrims = workspace.randomPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
var procedures = (function() {
  var procs = {};
  var temp = undefined;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      PrimChecks.math.randomSeed(0);
      workspace.timer.reset();
      procedures["SETUP"]();
      for (let _index_93_99 = 0, _repeatcount_93_99 = StrictMath.floor(5000); _index_93_99 < _repeatcount_93_99; _index_93_99++){
        procedures["GO"]();
      }
      world.observer.setGlobal("result", workspace.timer.elapsed());
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["benchmark"] = temp;
  procs["BENCHMARK"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      Errors.askNobodyCheck(world.patches()).ask(function() {
        SelfManager.self().setPatchVariable("n", 2);
        procedures["COLORIZE"]();
      }, true);
      world.observer.setGlobal("total", (2 * world.patches().size()));
      world.ticker.reset();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setup"] = temp;
  procs["SETUP"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let activePatches = Prims.patchSet(PrimChecks.list.oneOf(world.patches())); letVars['activePatches'] = activePatches;
      Errors.askNobodyCheck(activePatches).ask(function() {
        SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") + 1));
        world.observer.setGlobal("total", (world.observer.getGlobal("total") + 1));
        procedures["COLORIZE"]();
      }, true);
      while (!activePatches.isEmpty()) {
        let overloadedPatches = activePatches.agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); }); letVars['overloadedPatches'] = overloadedPatches;
        Errors.askNobodyCheck(overloadedPatches).ask(function() {
          SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") - 4));
          world.observer.setGlobal("total", (world.observer.getGlobal("total") - 4));
          procedures["COLORIZE"]();
          Errors.askNobodyCheck(SelfManager.self().getNeighbors4()).ask(function() {
            SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") + 1));
            world.observer.setGlobal("total", (world.observer.getGlobal("total") + 1));
            procedures["COLORIZE"]();
          }, true);
        }, true);
        activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() { return SelfManager.self().getNeighbors4(); })); letVars['activePatches'] = activePatches;
      }
      world.ticker.tick();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lte(SelfManager.self().getPatchVariable("n"), 3)) {
        SelfManager.self().setPatchVariable("pcolor", PrimChecks.list.item(SelfManager.self().getPatchVariable("n"), [83, 54, 45, 25]));
      }
      else {
        SelfManager.self().setPatchVariable("pcolor", 15);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["colorize"] = temp;
  procs["COLORIZE"] = temp;
  return procs;
})();
world.observer.setGlobal("plot?", false);