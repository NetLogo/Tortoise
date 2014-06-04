var workspace     = require('engine/workspace')([])(['animate-avalanches?', 'drop-location', 'grains-per-patch', 'total', 'total-on-tick', 'sizes', 'last-size', 'lifetimes', 'last-lifetime', 'selected-patch', 'default-color', 'fired-color', 'selected-color'], ['animate-avalanches?', 'drop-location', 'grains-per-patch'], [], [], ['n', 'n-stack', 'base-color'], -50, 50, -50, 50, 4.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
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
var StrictMath     = require('integration/strictmath');function setup(setupTask) {
  world.clearAll();
  world.observer.setGlobal('default-color', 105);
  world.observer.setGlobal('fired-color', 15);
  world.observer.setGlobal('selected-color', 55);
  world.observer.setGlobal('selected-patch', Nobody);
  AgentSet.ask(world.patches(), true, function() {
    AgentSet.setPatchVariable('n', (setupTask)());
    AgentSet.setPatchVariable('n-stack', []);
    AgentSet.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
  });
  var ignore = Call(stabilize, false);
  AgentSet.ask(world.patches(), true, function() {
    Call(recolor);
  });
  world.observer.setGlobal('total', Prims.sum(AgentSet.of(world.patches(), function() {
    return AgentSet.getPatchVariable('n');
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
  AgentSet.setPatchVariable('pcolor', Prims.scaleColor(AgentSet.getPatchVariable('base-color'), AgentSet.getPatchVariable('n'), 0, 4));
}
function go() {
  var drop = Call(dropPatch);
  if (!Prims.equality(drop, Nobody)) {
    AgentSet.ask(drop, true, function() {
      Call(updateN, 1);
      Call(recolor);
    });
    var results = Call(stabilize, world.observer.getGlobal('animate-avalanches?'));
    var avalanchePatches = Prims.first(results);
    var lifetime = Prims.last(results);
    if (AgentSet.any(avalanchePatches)) {
      world.observer.setGlobal('sizes', Prims.lput(AgentSet.count(avalanchePatches), world.observer.getGlobal('sizes')));
      world.observer.setGlobal('lifetimes', Prims.lput(lifetime, world.observer.getGlobal('lifetimes')));
    }
    AgentSet.ask(avalanchePatches, true, function() {
      Call(recolor);
      AgentSet.ask(Prims.getNeighbors4(), true, function() {
        Call(recolor);
      });
    });
    notImplemented('display', undefined)();
    AgentSet.ask(avalanchePatches, true, function() {
      AgentSet.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
      Call(recolor);
    });
    world.observer.setGlobal('total-on-tick', world.observer.getGlobal('total'));
    world.ticker.tick();
  }
}
function explore() {
  if (notImplemented('mouse-inside?', false)()) {
    var p = Prims.patch(notImplemented('mouse-xcor', 0)(), notImplemented('mouse-ycor', 0)());
    world.observer.setGlobal('selected-patch', p);
    AgentSet.ask(world.patches(), true, function() {
      Call(pushN);
    });
    AgentSet.ask(world.observer.getGlobal('selected-patch'), true, function() {
      Call(updateN, 1);
    });
    var results = Call(stabilize, false);
    AgentSet.ask(world.patches(), true, function() {
      Call(popN);
    });
    AgentSet.ask(world.patches(), true, function() {
      AgentSet.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
      Call(recolor);
    });
    var avalanchePatches = Prims.first(results);
    AgentSet.ask(avalanchePatches, true, function() {
      AgentSet.setPatchVariable('base-color', world.observer.getGlobal('selected-color'));
      Call(recolor);
    });
    notImplemented('display', undefined)();
  }
  else {
    if (!Prims.equality(world.observer.getGlobal('selected-patch'), Nobody)) {
      world.observer.setGlobal('selected-patch', Nobody);
      AgentSet.ask(world.patches(), true, function() {
        AgentSet.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
        Call(recolor);
      });
    }
  }
}
function stabilize(animate_p) {
  var activePatches = AgentSet.agentFilter(world.patches(), function() {
    return Prims.gt(AgentSet.getPatchVariable('n'), 3);
  });
  var iters = 0;
  var avalanchePatches = new PatchSet([]);
  while (AgentSet.any(activePatches)) {
    var overloadedPatches = AgentSet.agentFilter(activePatches, function() {
      return Prims.gt(AgentSet.getPatchVariable('n'), 3);
    });
    if (AgentSet.any(overloadedPatches)) {
      iters = (iters + 1);
    }
    AgentSet.ask(overloadedPatches, true, function() {
      AgentSet.setPatchVariable('base-color', world.observer.getGlobal('fired-color'));
      Call(updateN, -4);
      if (animate_p) {
        Call(recolor);
      }
      AgentSet.ask(Prims.getNeighbors4(), true, function() {
        Call(updateN, 1);
        if (animate_p) {
          Call(recolor);
        }
      });
    });
    if (animate_p) {
      notImplemented('display', undefined)();
    }
    avalanchePatches = Prims.patchSet(avalanchePatches, overloadedPatches);
    activePatches = Prims.patchSet(AgentSet.of(overloadedPatches, function() {
      return Prims.getNeighbors4();
    }));
  }
  return Prims.list(avalanchePatches, iters);
}
function updateN(howMuch) {
  AgentSet.setPatchVariable('n', (AgentSet.getPatchVariable('n') + howMuch));
  world.observer.setGlobal('total', (world.observer.getGlobal('total') + howMuch));
}
function dropPatch() {
  if (Prims.equality(world.observer.getGlobal('drop-location'), "center")) {
    return Prims.patch(0, 0);
  }
  if (Prims.equality(world.observer.getGlobal('drop-location'), "random")) {
    return AgentSet.oneOf(world.patches());
  }
  if ((Prims.equality(world.observer.getGlobal('drop-location'), "mouse-click") && notImplemented('mouse-down?', false)())) {
    Prims.every(0.3, function () {
      return Prims.patch(notImplemented('mouse-xcor', 0)(), notImplemented('mouse-ycor', 0)());
    });
  }
  return Nobody;
}
function pushN() {
  AgentSet.setPatchVariable('n-stack', Prims.fput(AgentSet.getPatchVariable('n'), AgentSet.getPatchVariable('n-stack')));
}
function popN() {
  Call(updateN, (Prims.first(AgentSet.getPatchVariable('n-stack')) - AgentSet.getPatchVariable('n')));
  AgentSet.setPatchVariable('n-stack', Prims.butLast(AgentSet.getPatchVariable('n-stack')));
}
world.observer.setGlobal('animate-avalanches?', false);
world.observer.setGlobal('drop-location', "random");
world.observer.setGlobal('grains-per-patch', 0);
