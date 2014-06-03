var workspace     = require('engine/workspace')([])(['plot?', 'total', 'result'], ['plot?'], [], [], 0, 99, 0, 99, 3.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
var AgentSet      = workspace.agentSet;
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var Updater       = workspace.updater;
var world         = workspace.world;
var PatchesOwn    = world.patchesOwn;

var Call       = require('engine/call');
var ColorModel = require('engine/colormodel');
var Dump       = require('engine/dump');
var Exception  = require('engine/exception');
var Link       = require('engine/link');
var LinkSet    = require('engine/linkset');
var Nobody     = require('engine/nobody');
var PatchSet   = require('engine/patchset');
var Tasks      = require('engine/tasks');
var Trig       = require('engine/trig');
var Turtle     = require('engine/turtle');
var TurtleSet  = require('engine/turtleset');
var Type       = require('engine/typechecker');

var AgentModel     = require('integration/agentmodel');
var Denuller       = require('integration/denuller');
var notImplemented = require('integration/notimplemented');
var Random         = require('integration/random');
var StrictMath     = require('integration/strictmath');

PatchesOwn.init(1);
function benchmark() {
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
  AgentSet.ask(world.patches(), true, function() {
    AgentSet.setPatchVariable(5, 2);
    Call(colorize);
  });
  world.observer.setGlobal('total', (2 * AgentSet.count(world.patches())));
  world.ticker.reset();
}
function go() {
  var activePatches = Prims.patchSet(AgentSet.oneOf(world.patches()));
  AgentSet.ask(activePatches, true, function() {
    AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) + 1));
    world.observer.setGlobal('total', (world.observer.getGlobal('total') + 1));
    Call(colorize);
  });
  while (AgentSet.any(activePatches)) {
    var overloadedPatches = AgentSet.agentFilter(activePatches, function() {
      return Prims.gt(AgentSet.getPatchVariable(5), 3);
    });
    AgentSet.ask(overloadedPatches, true, function() {
      AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) - 4));
      world.observer.setGlobal('total', (world.observer.getGlobal('total') - 4));
      Call(colorize);
      AgentSet.ask(Prims.getNeighbors4(), true, function() {
        AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) + 1));
        world.observer.setGlobal('total', (world.observer.getGlobal('total') + 1));
        Call(colorize);
      });
    });
    activePatches = Prims.patchSet(AgentSet.of(overloadedPatches, function() {
      return Prims.getNeighbors4();
    }));
  }
  world.ticker.tick();
}
function colorize() {
  if (Prims.lte(AgentSet.getPatchVariable(5), 3)) {
    AgentSet.setPatchVariable(2, Prims.item(AgentSet.getPatchVariable(5), [83, 54, 45, 25]));
  }
  else {
    AgentSet.setPatchVariable(2, 15);
  }
}
world.observer.setGlobal('plot?', false);
