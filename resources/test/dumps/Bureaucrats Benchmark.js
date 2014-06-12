var workspace     = require('engine/workspace')([])(['plot?', 'total', 'result'], ['plot?'], [], [], ['n'], 0, 99, 0, 99, 3.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
var AgentSet      = workspace.agentSet;
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var Updater       = workspace.updater;
var world         = workspace.world;

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
var StrictMath     = require('integration/strictmath');function benchmark() {
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
  Prims.ask(world.patches(), true, function() {
    Prims.setPatchVariable('n', 2);
    Call(colorize);
  });
  world.observer.setGlobal('total', (2 * world.patches().size()));
  world.ticker.reset();
}
function go() {
  var activePatches = Prims.patchSet(Prims.oneOf(world.patches()));
  Prims.ask(activePatches, true, function() {
    Prims.setPatchVariable('n', (Prims.getPatchVariable('n') + 1));
    world.observer.setGlobal('total', (world.observer.getGlobal('total') + 1));
    Call(colorize);
  });
  while (activePatches.nonEmpty()) {
    var overloadedPatches = activePatches.agentFilter(function() {
      return Prims.gt(Prims.getPatchVariable('n'), 3);
    });
    Prims.ask(overloadedPatches, true, function() {
      Prims.setPatchVariable('n', (Prims.getPatchVariable('n') - 4));
      world.observer.setGlobal('total', (world.observer.getGlobal('total') - 4));
      Call(colorize);
      Prims.ask(Prims.getNeighbors4(), true, function() {
        Prims.setPatchVariable('n', (Prims.getPatchVariable('n') + 1));
        world.observer.setGlobal('total', (world.observer.getGlobal('total') + 1));
        Call(colorize);
      });
    });
    activePatches = Prims.patchSet(Prims.of(overloadedPatches, function() {
      return Prims.getNeighbors4();
    }));
  }
  world.ticker.tick();
}
function colorize() {
  if (Prims.lte(Prims.getPatchVariable('n'), 3)) {
    Prims.setPatchVariable('pcolor', Prims.item(Prims.getPatchVariable('n'), [83, 54, 45, 25]));
  }
  else {
    Prims.setPatchVariable('pcolor', 15);
  }
}
world.observer.setGlobal('plot?', false);
