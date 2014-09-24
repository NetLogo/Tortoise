var workspace     = tortoise_require('engine/workspace')([])(['animate-avalanches?', 'drop-location', 'grains-per-patch', 'total', 'total-on-tick', 'sizes', 'last-size', 'lifetimes', 'last-lifetime', 'selected-patch', 'default-color', 'fired-color', 'selected-color'], ['animate-avalanches?', 'drop-location', 'grains-per-patch'], [], [], ['n', 'n-stack', 'base-color'], -50, 50, -50, 50, 4.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var ListPrims     = workspace.listPrims;
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

var AgentModel     = tortoise_require('agentmodel');
var Denuller       = tortoise_require('nashorn/denuller');
var Random         = tortoise_require('shim/random');
var StrictMath     = tortoise_require('shim/strictmath');
function setup(setupTask) {
  world.clearAll();
  world.observer.setGlobal('default-color', 105);
  world.observer.setGlobal('fired-color', 15);
  world.observer.setGlobal('selected-color', 55);
  world.observer.setGlobal('selected-patch', Nobody);
  world.patches().ask(function() {
    SelfPrims.setPatchVariable('n', (setupTask)());
    SelfPrims.setPatchVariable('n-stack', []);
    SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
  }, true);
  var ignore = Call(stabilize, false);
  world.patches().ask(function() {
    Call(recolor);
  }, true);
  world.observer.setGlobal('total', ListPrims.sum(world.patches().projectionBy(function() {
    return SelfPrims.getPatchVariable('n');
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
  SelfPrims.setPatchVariable('pcolor', ColorModel.scaleColor(SelfPrims.getPatchVariable('base-color'), SelfPrims.getPatchVariable('n'), 0, 4));
}
function go() {
  var drop = Call(dropPatch);
  if (!Prims.equality(drop, Nobody)) {
    drop.ask(function() {
      Call(updateN, 1);
      Call(recolor);
    }, true);
    var results = Call(stabilize, world.observer.getGlobal('animate-avalanches?'));
    var avalanchePatches = ListPrims.first(results);
    var lifetime = ListPrims.last(results);
    if (avalanchePatches.nonEmpty()) {
      world.observer.setGlobal('sizes', ListPrims.lput(avalanchePatches.size(), world.observer.getGlobal('sizes')));
      world.observer.setGlobal('lifetimes', ListPrims.lput(lifetime, world.observer.getGlobal('lifetimes')));
    }
    avalanchePatches.ask(function() {
      Call(recolor);
      SelfPrims.getNeighbors4().ask(function() {
        Call(recolor);
      }, true);
    }, true);
    notImplemented('display', undefined)();
    avalanchePatches.ask(function() {
      SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
      Call(recolor);
    }, true);
    world.observer.setGlobal('total-on-tick', world.observer.getGlobal('total'));
    world.ticker.tick();
  }
}
function explore() {
  if (notImplemented('mouse-inside?', false)()) {
    var p = world.getPatchAt(notImplemented('mouse-xcor', 0)(), notImplemented('mouse-ycor', 0)());
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
      SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
      Call(recolor);
    }, true);
    var avalanchePatches = ListPrims.first(results);
    avalanchePatches.ask(function() {
      SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('selected-color'));
      Call(recolor);
    }, true);
    notImplemented('display', undefined)();
  }
  else {
    if (!Prims.equality(world.observer.getGlobal('selected-patch'), Nobody)) {
      world.observer.setGlobal('selected-patch', Nobody);
      world.patches().ask(function() {
        SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('default-color'));
        Call(recolor);
      }, true);
    }
  }
}
function stabilize(animate_p) {
  var activePatches = world.patches().agentFilter(function() {
    return Prims.gt(SelfPrims.getPatchVariable('n'), 3);
  });
  var iters = 0;
  var avalanchePatches = new PatchSet([]);
  while (activePatches.nonEmpty()) {
    var overloadedPatches = activePatches.agentFilter(function() {
      return Prims.gt(SelfPrims.getPatchVariable('n'), 3);
    });
    if (overloadedPatches.nonEmpty()) {
      iters = (iters + 1);
    }
    overloadedPatches.ask(function() {
      SelfPrims.setPatchVariable('base-color', world.observer.getGlobal('fired-color'));
      Call(updateN, -4);
      if (animate_p) {
        Call(recolor);
      }
      SelfPrims.getNeighbors4().ask(function() {
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
      return SelfPrims.getNeighbors4();
    }));
  }
  return ListPrims.list(avalanchePatches, iters);
}
function updateN(howMuch) {
  SelfPrims.setPatchVariable('n', (SelfPrims.getPatchVariable('n') + howMuch));
  world.observer.setGlobal('total', (world.observer.getGlobal('total') + howMuch));
}
function dropPatch() {
  if (Prims.equality(world.observer.getGlobal('drop-location'), "center")) {
    return world.getPatchAt(0, 0);
  }
  if (Prims.equality(world.observer.getGlobal('drop-location'), "random")) {
    return ListPrims.oneOf(world.patches());
  }
  if ((Prims.equality(world.observer.getGlobal('drop-location'), "mouse-click") && notImplemented('mouse-down?', false)())) {
    Prims.every(0.3, function () {
      return world.getPatchAt(notImplemented('mouse-xcor', 0)(), notImplemented('mouse-ycor', 0)());
    }, 'auto-every-1');
  }
  return Nobody;
}
function pushN() {
  SelfPrims.setPatchVariable('n-stack', ListPrims.fput(SelfPrims.getPatchVariable('n'), SelfPrims.getPatchVariable('n-stack')));
}
function popN() {
  Call(updateN, (ListPrims.first(SelfPrims.getPatchVariable('n-stack')) - SelfPrims.getPatchVariable('n')));
  SelfPrims.setPatchVariable('n-stack', ListPrims.butLast(SelfPrims.getPatchVariable('n-stack')));
}
world.observer.setGlobal('animate-avalanches?', false);
world.observer.setGlobal('drop-location', "random");
world.observer.setGlobal('grains-per-patch', 0);
