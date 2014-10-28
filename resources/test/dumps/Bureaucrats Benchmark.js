var modelConfig  = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};

var PenBundle = tortoise_require('engine/plot/pen');
var Plot      = tortoise_require('engine/plot/plot');
var PlotOps   = tortoise_require('engine/plot/plotops');

modelConfig.plots = [(function() {
  var name    = 'Average';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Average', 'average')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Average', 'average')(function() { plotManager.plotPoint(world.ticker.tickCount(), (world.observer.getGlobal('total') / world.patches().size()));; }); }); })];
  var setup   = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Average', undefined)(function() {}); }); };
  var update  = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Average', undefined)(function() { if (!world.observer.getGlobal('plot?')) {
  throw new Exception.StopInterrupt;
}; }); }); };
  return new Plot(name, pens, plotOps, 'NIL', 'NIL', true, 0.0, 1.0, 2.0, 2.1, setup, update);
})()];

var workspace = tortoise_require('engine/workspace')(modelConfig)([])(['plot?', 'total', 'result'], ['plot?'], [], [], ['n'], 0, 99, 0, 99, 3.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});

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
function benchmark() {
  Random.setSeed(0);
  workspace.timer.reset();
  Call(setup);
  Prims.repeat(5000, function() {
    Call(go);
  });
  world.observer.setGlobal('result', workspace.timer.elapsed());
}
function setup() {
  world.clearAll();
  world.patches().ask(function() {
    SelfPrims.setPatchVariable('n', 2);
    Call(colorize);
  }, true);
  world.observer.setGlobal('total', (2 * world.patches().size()));
  world.ticker.reset();
}
function go() {
  var activePatches = Prims.patchSet(ListPrims.oneOf(world.patches()));
  activePatches.ask(function() {
    SelfPrims.setPatchVariable('n', (SelfPrims.getPatchVariable('n') + 1));
    world.observer.setGlobal('total', (world.observer.getGlobal('total') + 1));
    Call(colorize);
  }, true);
  while (activePatches.nonEmpty()) {
    var overloadedPatches = activePatches.agentFilter(function() {
      return Prims.gt(SelfPrims.getPatchVariable('n'), 3);
    });
    overloadedPatches.ask(function() {
      SelfPrims.setPatchVariable('n', (SelfPrims.getPatchVariable('n') - 4));
      world.observer.setGlobal('total', (world.observer.getGlobal('total') - 4));
      Call(colorize);
      SelfPrims.getNeighbors4().ask(function() {
        SelfPrims.setPatchVariable('n', (SelfPrims.getPatchVariable('n') + 1));
        world.observer.setGlobal('total', (world.observer.getGlobal('total') + 1));
        Call(colorize);
      }, true);
    }, true);
    activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() {
      return SelfPrims.getNeighbors4();
    }));
  }
  world.ticker.tick();
}
function colorize() {
  if (Prims.lte(SelfPrims.getPatchVariable('n'), 3)) {
    SelfPrims.setPatchVariable('pcolor', ListPrims.item(SelfPrims.getPatchVariable('n'), [83, 54, 45, 25]));
  }
  else {
    SelfPrims.setPatchVariable('pcolor', 15);
  }
}
world.observer.setGlobal('plot?', false);
