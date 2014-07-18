var workspace     = require('engine/workspace')([])(['plot?', 'total', 'result'], ['plot?'], [], [], ['n'], 0, 99, 0, 99, 3.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var SelfManager   = workspace.selfManager;
var Updater       = workspace.updater;
var world         = workspace.world;

var Call           = require('util/call');
var ColorModel     = require('util/colormodel');
var Dump           = require('util/dump');
var Exception      = require('util/exception');
var Trig           = require('util/trig');
var Type           = require('util/typechecker');
var notImplemented = require('util/notimplemented');

var Link      = require('engine/core/link');
var LinkSet   = require('engine/core/linkset');
var Nobody    = require('engine/core/nobody');
var PatchSet  = require('engine/core/patchset');
var Turtle    = require('engine/core/turtle');
var TurtleSet = require('engine/core/turtleset');
var Tasks     = require('engine/prim/tasks');

var AgentModel     = require('agentmodel');
var Denuller       = require('nashorn/denuller');
var Random         = require('shim/random');
var StrictMath     = require('shim/strictmath');function benchmark() {
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
    Prims.setPatchVariable('n', 2);
    Call(colorize);
  }, true);
  world.observer.setGlobal('total', (2 * world.patches().size()));
  world.ticker.reset();
}
function go() {
  var activePatches = Prims.patchSet(Prims.oneOf(world.patches()));
  activePatches.ask(function() {
    Prims.setPatchVariable('n', (Prims.getPatchVariable('n') + 1));
    world.observer.setGlobal('total', (world.observer.getGlobal('total') + 1));
    Call(colorize);
  }, true);
  while (activePatches.nonEmpty()) {
    var overloadedPatches = activePatches.agentFilter(function() {
      return Prims.gt(Prims.getPatchVariable('n'), 3);
    });
    overloadedPatches.ask(function() {
      Prims.setPatchVariable('n', (Prims.getPatchVariable('n') - 4));
      world.observer.setGlobal('total', (world.observer.getGlobal('total') - 4));
      Call(colorize);
      Prims.getNeighbors4().ask(function() {
        Prims.setPatchVariable('n', (Prims.getPatchVariable('n') + 1));
        world.observer.setGlobal('total', (world.observer.getGlobal('total') + 1));
        Call(colorize);
      }, true);
    }, true);
    activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() {
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
