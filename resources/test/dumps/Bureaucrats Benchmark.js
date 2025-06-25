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
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');
var { DeathInterrupt, StopInterrupt } = tortoise_require('util/interrupts');

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var resources = {  };
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
      plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.math.div(53, 54, PrimChecks.validator.checkArg('/', 53, 54, 1, world.observer.getGlobal("total")), PrimChecks.agentset.count(world.patches())));;
    });
  })];
  var setup   = function() {};
  var update  = function() {
    return ProcedurePrims.runInPlotContext('Average', undefined, function() {
      if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 36, 39, 2, world.observer.getGlobal("plot?")))) {
        return PrimChecks.procedure.stop(48, 52);
      };
    });
  };
  return new Plot(name, pens, plotOps, "", "", true, true, true, 0, 1, 2, 2.1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [total result] patches-own [n]  to benchmark   random-seed 0   reset-timer   setup   repeat 5000 [ go ]   set result timer end  to setup   clear-all   ask patches [     set n 2     colorize   ]   set total 2 * count patches   reset-ticks end  to go   let active-patches patch-set one-of patches   ask active-patches [     set n n + 1     set total total + 1     colorize   ]   while [any? active-patches] [     let overloaded-patches active-patches with [n > 3]     ask overloaded-patches [       set n n - 4       set total total - 4       colorize       ask neighbors4 [         set n n + 1         set total total + 1         colorize       ]     ]     set active-patches patch-set [neighbors4] of overloaded-patches   ]   tick end  to colorize  ;; patch procedure   ifelse n <= 3     [ set pcolor item n [83 54 45 25] ]     [ set pcolor red ] end')([{"x":415,"y":10,"width":306,"height":326,"dimensions":{"minPxcor":0,"maxPxcor":99,"minPycor":0,"maxPycor":99,"patchSize":3,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":100000,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup\"); if (R === StopInterrupt) { return R; }","type":"button","source":"setup","x":10,"y":25,"width":79,"height":33,"oldSize":true,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","type":"button","source":"go","x":95,"y":25,"width":78,"height":33,"oldSize":true,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Average', undefined, function() {     if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 36, 39, 2, world.observer.getGlobal(\"plot?\")))) {       return PrimChecks.procedure.stop(48, 52);     };   }); }","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Average', 'average', function() {     plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.math.div(53, 54, PrimChecks.validator.checkArg('/', 53, 54, 1, world.observer.getGlobal(\"total\")), PrimChecks.agentset.count(world.patches())));;   }); }","type":"pen","display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (total / count patches)","compilation":{"success":true,"messages":[]}}],"type":"plot","display":"Average","x":10,"y":165,"width":390,"height":175,"oldSize":true,"xmin":0,"xmax":1,"ymin":2,"ymax":2.1,"autoPlotX":true,"autoPlotY":true,"legendOn":true,"setupCode":"","updateCode":"if not plot? [ stop ]","pens":[{"display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (total / count patches)","type":"pen"}],"compilation":{"success":true,"messages":[]}}, {"variable":"plot?","x":40,"y":65,"width":103,"height":33,"oldSize":true,"display":"plot?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"benchmark\"); if (R === StopInterrupt) { return R; }","type":"button","source":"benchmark","x":10,"y":130,"width":160,"height":33,"oldSize":true,"display":"benchmark (5000 ticks)","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"compilation":{"success":true,"messages":[]}}, {"x":175,"y":84,"width":225,"height":80,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"result\"); })","type":"monitor","source":"result","x":200,"y":15,"width":85,"height":45,"oldSize":true,"precision":17,"fontSize":11,"compilation":{"success":true,"messages":[]}}])(resources)(tortoise_require("extensions/all").porters())(["plot?", "total", "result"], ["plot?"], ["n"], 0, 99, 0, 99, 3, false, false, turtleShapes, linkShapes, function(){});
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
var StringPrims = workspace.stringPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
ProcedurePrims.defineCommand("benchmark", 43, 131, (function() {
  PrimChecks.math.randomSeed(55, 66, 0);
  workspace.timer.reset();
  var R = ProcedurePrims.callCommand("setup"); if (R === DeathInterrupt) { return R; }
  for (let _index_93_99 = 0, _repeatcount_93_99 = StrictMath.floor(5000); _index_93_99 < _repeatcount_93_99; _index_93_99++) {
    var R = ProcedurePrims.callCommand("go"); if (R === DeathInterrupt) { return R; }
  }
  world.observer.setGlobal("result", workspace.timer.elapsed());
}))
ProcedurePrims.defineCommand("setup", 139, 246, (function() {
  world.clearAll();
  var R = ProcedurePrims.ask(world.patches(), function() {
    PrimChecks.patch.setVariable(181, 182, "n", 2);
    var R = ProcedurePrims.callCommand("colorize"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(159, 162, R); return R; }
  world.observer.setGlobal("total", PrimChecks.math.mult(216, 217, 2, PrimChecks.agentset.count(world.patches())));
  world.ticker.reset();
}))
ProcedurePrims.defineCommand("go", 254, 739, (function() {
  let activeHpatches = PrimChecks.agentset.patchSet(278, 287, PrimChecks.list.oneOf(288, 294, world.patches())); ProcedurePrims.stack().currentContext().registerStringRunVar("ACTIVE-PATCHES", activeHpatches);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 305, 308, 1904, activeHpatches), function() {
    PrimChecks.patch.setVariable(334, 335, "n", PrimChecks.math.plus(338, 339, PrimChecks.validator.checkArg('+', 338, 339, 1, PrimChecks.patch.getVariable(336, 337, "n")), 1));
    world.observer.setGlobal("total", PrimChecks.math.plus(362, 363, PrimChecks.validator.checkArg('+', 362, 363, 1, world.observer.getGlobal("total")), 1));
    var R = ProcedurePrims.callCommand("colorize"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(305, 308, R); return R; }
  while (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 392, 396, 112, activeHpatches))) {
    let overloadedHpatches = PrimChecks.agentset.with(457, 461, PrimChecks.validator.checkArg('WITH', 457, 461, 112, activeHpatches), function() { return Prims.gt(PrimChecks.patch.getVariable(463, 464, "n"), 3); }); ProcedurePrims.stack().currentContext().registerStringRunVar("OVERLOADED-PATCHES", overloadedHpatches);
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 474, 477, 1904, overloadedHpatches), function() {
      PrimChecks.patch.setVariable(509, 510, "n", PrimChecks.math.minus(513, 514, PrimChecks.validator.checkArg('-', 513, 514, 1, PrimChecks.patch.getVariable(511, 512, "n")), 4));
      world.observer.setGlobal("total", PrimChecks.math.minus(539, 540, PrimChecks.validator.checkArg('-', 539, 540, 1, world.observer.getGlobal("total")), 4));
      var R = ProcedurePrims.callCommand("colorize"); if (R === DeathInterrupt) { return R; }
      var R = ProcedurePrims.ask(SelfManager.self().getNeighbors4(), function() {
        PrimChecks.patch.setVariable(593, 594, "n", PrimChecks.math.plus(597, 598, PrimChecks.validator.checkArg('+', 597, 598, 1, PrimChecks.patch.getVariable(595, 596, "n")), 1));
        world.observer.setGlobal("total", PrimChecks.math.plus(625, 626, PrimChecks.validator.checkArg('+', 625, 626, 1, world.observer.getGlobal("total")), 1));
        var R = ProcedurePrims.callCommand("colorize"); if (R === DeathInterrupt) { return R; }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(564, 567, R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(474, 477, R); return R; }
    activeHpatches = PrimChecks.agentset.patchSet(683, 692, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 706, 708, 1904, overloadedHpatches), function() { return SelfManager.self().getNeighbors4(); })); ProcedurePrims.stack().currentContext().updateStringRunVar("ACTIVE-PATCHES", activeHpatches);
  }
  world.ticker.tick();
}))
ProcedurePrims.defineCommand("colorize", 747, 855, (function() {
  if (Prims.lte(PrimChecks.patch.getVariable(785, 786, "n"), 3)) {
    PrimChecks.patch.setVariable(802, 808, "pcolor", PrimChecks.list.item(809, 813, PrimChecks.validator.checkArg('ITEM', 809, 813, 1, PrimChecks.patch.getVariable(814, 815, "n")), [83, 54, 45, 25]));
  }
  else {
    PrimChecks.patch.setVariable(842, 848, "pcolor", 15);
  }
}))
world.observer.setGlobal("plot?", false);