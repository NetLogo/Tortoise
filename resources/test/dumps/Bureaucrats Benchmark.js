var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
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
var { DeathInterrupt, StopInterrupt } = tortoise_require('util/interrupts');

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
    return ProcedurePrims.runInPlotContext('Average', 'average', function() {
      plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal("total")), PrimChecks.agentset.count(world.patches())));;
    });
  })];
  var setup   = function() {};
  var update  = function() {
    return ProcedurePrims.runInPlotContext('Average', undefined, function() {
      if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, world.observer.getGlobal("plot?")))) {
        return PrimChecks.procedure.stop();
      };
    });
  };
  return new Plot(name, pens, plotOps, "", "", true, true, 0, 1, 2, 2.1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [total result] patches-own [n]  to benchmark   random-seed 0   reset-timer   setup   repeat 5000 [ go ]   set result timer end  to setup   clear-all   ask patches [     set n 2     colorize   ]   set total 2 * count patches   reset-ticks end  to go   let active-patches patch-set one-of patches   ask active-patches [     set n n + 1     set total total + 1     colorize   ]   while [any? active-patches] [     let overloaded-patches active-patches with [n > 3]     ask overloaded-patches [       set n n - 4       set total total - 4       colorize       ask neighbors4 [         set n n + 1         set total total + 1         colorize       ]     ]     set active-patches patch-set [neighbors4] of overloaded-patches   ]   tick end  to colorize  ;; patch procedure   ifelse n <= 3     [ set pcolor item n [83 54 45 25] ]     [ set pcolor red ] end')([{"left":415,"top":10,"right":725,"bottom":341,"dimensions":{"minPxcor":0,"maxPxcor":99,"minPycor":0,"maxPycor":99,"patchSize":3,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":100000,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup\"); if (R === StopInterrupt) { return R; }","source":"setup","left":10,"top":25,"right":89,"bottom":58,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","left":95,"top":25,"right":173,"bottom":58,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Average', undefined, function() {     if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, world.observer.getGlobal(\"plot?\")))) {       return PrimChecks.procedure.stop();     };   }); }","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Average', 'average', function() {     plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal(\"total\")), PrimChecks.agentset.count(world.patches())));;   }); }","display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (total / count patches)","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average","left":10,"top":165,"right":400,"bottom":340,"xmin":0,"xmax":1,"ymin":2,"ymax":2.1,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"if not plot? [ stop ]","pens":[{"display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (total / count patches)","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"variable":"plot?","left":40,"top":65,"right":143,"bottom":98,"display":"plot?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"benchmark\"); if (R === StopInterrupt) { return R; }","source":"benchmark","left":10,"top":130,"right":170,"bottom":163,"display":"benchmark (5000 ticks)","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"left":175,"top":84,"right":400,"bottom":164,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"result\")","source":"result","left":200,"top":15,"right":285,"bottom":60,"precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["plot?", "total", "result"], ["plot?"], ["n"], 0, 99, 0, 99, 3, false, false, turtleShapes, linkShapes, function(){});
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
var ProcedurePrims = workspace.procedurePrims;
var RandomPrims = workspace.randomPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
ProcedurePrims.defineCommand("benchmark", (function() {
  PrimChecks.math.randomSeed(0);
  workspace.timer.reset();
  var R = ProcedurePrims.callCommand("setup"); if (R === DeathInterrupt) { return R; }
  for (let _index_93_99 = 0, _repeatcount_93_99 = StrictMath.floor(5000); _index_93_99 < _repeatcount_93_99; _index_93_99++){
    var R = ProcedurePrims.callCommand("go"); if (R === DeathInterrupt) { return R; }
  }
  world.observer.setGlobal("result", workspace.timer.elapsed());
}))
ProcedurePrims.defineCommand("setup", (function() {
  world.clearAll();
  var R = ProcedurePrims.ask(world.patches(), function() {
    SelfManager.self().setPatchVariable("n", 2);
    var R = ProcedurePrims.callCommand("colorize"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  world.observer.setGlobal("total", PrimChecks.math.mult(2, PrimChecks.agentset.count(world.patches())));
  world.ticker.reset();
}))
ProcedurePrims.defineCommand("go", (function() {
  let activeHpatches = PrimChecks.agentset.patchSet(PrimChecks.list.oneOf(world.patches())); ProcedurePrims.stack().currentContext().registerStringRunVar("ACTIVE-PATCHES", activeHpatches);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, activeHpatches), function() {
    SelfManager.self().setPatchVariable("n", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, SelfManager.self().getPatchVariable("n")), 1));
    world.observer.setGlobal("total", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("total")), 1));
    var R = ProcedurePrims.callCommand("colorize"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  while (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, activeHpatches))) {
    let overloadedHpatches = PrimChecks.agentset.with(PrimChecks.validator.checkArg('WITH', 112, activeHpatches), function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); }); ProcedurePrims.stack().currentContext().registerStringRunVar("OVERLOADED-PATCHES", overloadedHpatches);
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, overloadedHpatches), function() {
      SelfManager.self().setPatchVariable("n", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, SelfManager.self().getPatchVariable("n")), 4));
      world.observer.setGlobal("total", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("total")), 4));
      var R = ProcedurePrims.callCommand("colorize"); if (R === DeathInterrupt) { return R; }
      var R = ProcedurePrims.ask(SelfManager.self().getNeighbors4(), function() {
        SelfManager.self().setPatchVariable("n", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, SelfManager.self().getPatchVariable("n")), 1));
        world.observer.setGlobal("total", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("total")), 1));
        var R = ProcedurePrims.callCommand("colorize"); if (R === DeathInterrupt) { return R; }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    activeHpatches = PrimChecks.agentset.patchSet(PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, overloadedHpatches), function() { return SelfManager.self().getNeighbors4(); })); ProcedurePrims.stack().currentContext().updateStringRunVar("ACTIVE-PATCHES", activeHpatches);
  }
  world.ticker.tick();
}))
ProcedurePrims.defineCommand("colorize", (function() {
  if (Prims.lte(SelfManager.self().getPatchVariable("n"), 3)) {
    SelfManager.self().setPatchVariable("pcolor", PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, SelfManager.self().getPatchVariable("n")), [83, 54, 45, 25]));
  }
  else {
    SelfManager.self().setPatchVariable("pcolor", 15);
  }
}))
world.observer.setGlobal("plot?", false);