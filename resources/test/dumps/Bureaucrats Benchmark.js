var workspace     = tortoise_engine.workspace([])(['plot?', 'total', 'result'], ['plot?'], [], [], ['n'], 0, 99, 0, 99, 3.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var SelfPrims     = workspace.selfPrims;
var SelfManager   = workspace.selfManager;
var Updater       = workspace.updater;
var world         = workspace.world;

var Call           = util.call;
var ColorModel     = util.colormodel;
var Exception      = util.exception;
var Trig           = util.trig;
var Type           = util.typechecker;
var notImplemented = util.notimplemented;

var Dump      = tortoise_engine.dump;
var Link      = tortoise_engine.core.link;
var LinkSet   = tortoise_engine.core.linkset;
var Nobody    = tortoise_engine.core.nobody;
var PatchSet  = tortoise_engine.core.patchset;
var Turtle    = tortoise_engine.core.turtle;
var TurtleSet = tortoise_engine.core.turtleset;
var Tasks     = tortoise_engine.prim.tasks;

var AgentModel     = agentmodel;
var Denuller       = nashorn.denuller;
var Random         = shim.random;
var StrictMath     = shim.strictmath;function benchmark() {
  Random.setSeed(0);
  workspace.timer.reset();
  Call(setup);
  Prims.repeat(5000, function () {
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
  var activePatches = Prims.patchSet(Prims.oneOf(world.patches()));
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
    SelfPrims.setPatchVariable('pcolor', Prims.item(SelfPrims.getPatchVariable('n'), [83, 54, 45, 25]));
  }
  else {
    SelfPrims.setPatchVariable('pcolor', 15);
  }
}
world.observer.setGlobal('plot?', false);
