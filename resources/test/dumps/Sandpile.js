var workspace     = require('engine/workspace')([])(['animate-avalanches?', 'drop-location', 'grains-per-patch', 'total', 'total-on-tick', 'sizes', 'last-size', 'lifetimes', 'last-lifetime', 'selected-patch', 'default-color', 'fired-color', 'selected-color'], ['animate-avalanches?', 'drop-location', 'grains-per-patch'], [], [], ['n', 'n-stack', 'base-color'], -50, 50, -50, 50, 4.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var SelfManager   = workspace.selfManager;
var Updater       = workspace.updater;
var world         = workspace.world;

var Call           = require('util/call');
var ColorModel     = require('util/colormodel');
var Exception      = require('util/exception');
var Trig           = require('util/trig');
var Type           = require('util/typechecker');
var notImplemented = require('util/notimplemented');

var Dump      = require('engine/dump');
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
var StrictMath     = require('shim/strictmath');function setup(setupTask) {
  world.clearAll();
  world.observer.setGlobal('default-color', 105);
  world.observer.setGlobal('fired-color', 15);
  world.observer.setGlobal('selected-color', 55);
  world.observer.setGlobal('selected-patch', Nobody);
  world.patches().ask(function() {
    Prims.setPatchVariable('n', (setupTask)());
    Prims.setPatchVariable('n-stack', []);
    Prims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
  }, true);
  var ignore = Call(stabilize, false);
  world.patches().ask(function() {
    Call(recolor);
  }, true);
  world.observer.setGlobal('total', Prims.sum(world.patches().projectionBy(function() {
    return Prims.getPatchVariable('n');
  })));
  world.observer.setGlobal('sizes', []);
  world.observer.setGlobal('lifetimes', []);
  world.ticker.reset();
}
function setupUniform(initial) {
  Call(setup, Tasks.reporterTask(function() {
    var taskArguments = arguments;
    return initial;
  }));
}
function setupRandom() {
  Call(setup, Tasks.reporterTask(function() {
    var taskArguments = arguments;
    return Prims.random(4);
  }));
}
function recolor() {
  Prims.setPatchVariable('pcolor', Prims.scaleColor(Prims.getPatchVariable('base-color'), Prims.getPatchVariable('n'), 0, 4));
}
function go() {
  var drop = Call(dropPatch);
  if (!Prims.equality(drop, Nobody)) {
    drop.ask(function() {
      Call(updateN, 1);
      Call(recolor);
    }, true);
    var results = Call(stabilize, world.observer.getGlobal('animate-avalanches?'));
    var avalanchePatches = Prims.first(results);
    var lifetime = Prims.last(results);
    if (avalanchePatches.nonEmpty()) {
      world.observer.setGlobal('sizes', Prims.lput(avalanchePatches.size(), world.observer.getGlobal('sizes')));
      world.observer.setGlobal('lifetimes', Prims.lput(lifetime, world.observer.getGlobal('lifetimes')));
    }
    avalanchePatches.ask(function() {
      Call(recolor);
      Prims.getNeighbors4().ask(function() {
        Call(recolor);
      }, true);
    }, true);
    notImplemented('display', undefined)();
    avalanchePatches.ask(function() {
      Prims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
      Call(recolor);
    }, true);
    world.observer.setGlobal('total-on-tick', world.observer.getGlobal('total'));
    world.ticker.tick();
  }
}
function explore() {
  if (notImplemented('mouse-inside?', false)()) {
    var p = Prims.patch(notImplemented('mouse-xcor', 0)(), notImplemented('mouse-ycor', 0)());
    world.observer.setGlobal('selected-patch', p);
    world.patches().ask(function() {
      Call(pushN);
    }, true);
    world.observer.getGlobal('selected-patch').ask(function() {
      Call(updateN, 1);
    }, true);
    var results = Call(stabilize, false);
    world.patches().ask(function() {
      Call(popN);
    }, true);
    world.patches().ask(function() {
      Prims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
      Call(recolor);
    }, true);
    var avalanchePatches = Prims.first(results);
    avalanchePatches.ask(function() {
      Prims.setPatchVariable('base-color', world.observer.getGlobal('selected-color'));
      Call(recolor);
    }, true);
    notImplemented('display', undefined)();
  }
  else {
    if (!Prims.equality(world.observer.getGlobal('selected-patch'), Nobody)) {
      world.observer.setGlobal('selected-patch', Nobody);
      world.patches().ask(function() {
        Prims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
        Call(recolor);
      }, true);
    }
  }
}
function stabilize(animate_p) {
  var activePatches = world.patches().agentFilter(function() {
    return Prims.gt(Prims.getPatchVariable('n'), 3);
  });
  var iters = 0;
  var avalanchePatches = new PatchSet([]);
  while (activePatches.nonEmpty()) {
    var overloadedPatches = activePatches.agentFilter(function() {
      return Prims.gt(Prims.getPatchVariable('n'), 3);
    });
    if (overloadedPatches.nonEmpty()) {
      iters = (iters + 1);
    }
    overloadedPatches.ask(function() {
      Prims.setPatchVariable('base-color', world.observer.getGlobal('fired-color'));
      Call(updateN, -4);
      if (animate_p) {
        Call(recolor);
      }
      Prims.getNeighbors4().ask(function() {
        Call(updateN, 1);
        if (animate_p) {
          Call(recolor);
        }
      }, true);
    }, true);
    if (animate_p) {
      notImplemented('display', undefined)();
    }
    avalanchePatches = Prims.patchSet(avalanchePatches, overloadedPatches);
    activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() {
      return Prims.getNeighbors4();
    }));
  }
  return Prims.list(avalanchePatches, iters);
}
function updateN(howMuch) {
  Prims.setPatchVariable('n', (Prims.getPatchVariable('n') + howMuch));
  world.observer.setGlobal('total', (world.observer.getGlobal('total') + howMuch));
}
function dropPatch() {
  if (Prims.equality(world.observer.getGlobal('drop-location'), "center")) {
    return Prims.patch(0, 0);
  }
  if (Prims.equality(world.observer.getGlobal('drop-location'), "random")) {
    return Prims.oneOf(world.patches());
  }
  if ((Prims.equality(world.observer.getGlobal('drop-location'), "mouse-click") && notImplemented('mouse-down?', false)())) {
    Prims.every(0.3, function () {
      return Prims.patch(notImplemented('mouse-xcor', 0)(), notImplemented('mouse-ycor', 0)());
    });
  }
  return Nobody;
}
function pushN() {
  Prims.setPatchVariable('n-stack', Prims.fput(Prims.getPatchVariable('n'), Prims.getPatchVariable('n-stack')));
}
function popN() {
  Call(updateN, (Prims.first(Prims.getPatchVariable('n-stack')) - Prims.getPatchVariable('n')));
  Prims.setPatchVariable('n-stack', Prims.butLast(Prims.getPatchVariable('n-stack')));
}
world.observer.setGlobal('animate-avalanches?', false);
world.observer.setGlobal('drop-location', "random");
world.observer.setGlobal('grains-per-patch', 0);
