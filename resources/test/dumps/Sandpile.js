var workspace     = require('engine/workspace')(-50, 50, -50, 50, 4.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 3);
var AgentSet      = workspace.agentSet;
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var Updater       = workspace.updater;
var world         = workspace.world;
var Globals       = world.globals;
var TurtlesOwn    = world.turtlesOwn;
var PatchesOwn    = world.patchesOwn;
var LinksOwn      = world.linksOwn;

var AgentKind  = require('engine/agentkind');
var Agents     = require('engine/agents');
var Call       = require('engine/call');
var ColorModel = require('engine/colormodel');
var Dump       = require('engine/dump');
var Exception  = require('engine/exception');
var Link       = require('engine/link');
var Nobody     = require('engine/nobody');
var noop       = require('engine/noop');
var Tasks      = require('engine/tasks');
var Trig       = require('engine/trig');
var Turtle     = require('engine/turtle');

var _              = require('ingration/lodash');
var AgentModel     = require('integration/agentmodel');
var Denuller       = require('integration/denuller');
var notImplemented = require('integration/notimplemented');
var Random         = require('integration/random');
var StrictMath     = require('integration/strictmath');
var typeIsArray    = require('integration/typeisarray');

Globals.init(13);
PatchesOwn.init(3);
function setup(setupTask) {
  world.clearAll();
  Globals.setGlobal(10, 105);
  Globals.setGlobal(11, 15);
  Globals.setGlobal(12, 55);
  Globals.setGlobal(9, Nobody);
  AgentSet.ask(world.patches(), true, function() {
    AgentSet.setPatchVariable(5, (setupTask)());
    AgentSet.setPatchVariable(6, []);
    AgentSet.setPatchVariable(7, Globals.getGlobal(10));
  });
  var ignore = Call(stabilize, false);
  AgentSet.ask(world.patches(), true, function() {
    Call(recolor);
  });
  Globals.setGlobal(3, Prims.sum(AgentSet.of(world.patches(), function() {
    return AgentSet.getPatchVariable(5);
  })));
  Globals.setGlobal(5, []);
  Globals.setGlobal(7, []);
  world.resetTicks();
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
  AgentSet.setPatchVariable(2, Prims.scaleColor(AgentSet.getPatchVariable(7), AgentSet.getPatchVariable(5), 0, 4));
}
function go() {
  var drop = Call(dropPatch);
  if (!Prims.equality(drop, Nobody)) {
    AgentSet.ask(drop, true, function() {
      Call(updateN, 1);
      Call(recolor);
    });
    var results = Call(stabilize, Globals.getGlobal(0));
    var avalanchePatches = Prims.first(results);
    var lifetime = Prims.last(results);
    if (AgentSet.any(avalanchePatches)) {
      Globals.setGlobal(5, Prims.lput(AgentSet.count(avalanchePatches), Globals.getGlobal(5)));
      Globals.setGlobal(7, Prims.lput(lifetime, Globals.getGlobal(7)));
    }
    AgentSet.ask(avalanchePatches, true, function() {
      Call(recolor);
      AgentSet.ask(Prims.getNeighbors4(), true, function() {
        Call(recolor);
      });
    });
    notImplemented('display', undefined)();
    AgentSet.ask(avalanchePatches, true, function() {
      AgentSet.setPatchVariable(7, Globals.getGlobal(10));
      Call(recolor);
    });
    Globals.setGlobal(4, Globals.getGlobal(3));
    world.tick();
  }
}
function explore() {
  if (notImplemented('mouse-inside?', false)) {
    var p = Prims.patch(notImplemented('mouse-xcor', 0)(), notImplemented('mouse-ycor', 0)());
    Globals.setGlobal(9, p);
    AgentSet.ask(world.patches(), true, function() {
      Call(pushN);
    });
    AgentSet.ask(Globals.getGlobal(9), true, function() {
      Call(updateN, 1);
    });
    var results = Call(stabilize, false);
    AgentSet.ask(world.patches(), true, function() {
      Call(popN);
    });
    AgentSet.ask(world.patches(), true, function() {
      AgentSet.setPatchVariable(7, Globals.getGlobal(10));
      Call(recolor);
    });
    var avalanchePatches = Prims.first(results);
    AgentSet.ask(avalanchePatches, true, function() {
      AgentSet.setPatchVariable(7, Globals.getGlobal(12));
      Call(recolor);
    });
    notImplemented('display', undefined)();
  }
  else {
    if (!Prims.equality(Globals.getGlobal(9), Nobody)) {
      Globals.setGlobal(9, Nobody);
      AgentSet.ask(world.patches(), true, function() {
        AgentSet.setPatchVariable(7, Globals.getGlobal(10));
        Call(recolor);
      });
    }
  }
}
function stabilize(animate_p) {
  var activePatches = AgentSet.agentFilter(world.patches(), function() {
    return Prims.gt(AgentSet.getPatchVariable(5), 3);
  });
  var iters = 0;
  var avalanchePatches = new Agents([], BreedManager.get('PATCHES'), AgentKind.Patch);
  while (AgentSet.any(activePatches)) {
    var overloadedPatches = AgentSet.agentFilter(activePatches, function() {
      return Prims.gt(AgentSet.getPatchVariable(5), 3);
    });
    if (AgentSet.any(overloadedPatches)) {
      iters = (iters + 1);
    }
    AgentSet.ask(overloadedPatches, true, function() {
      AgentSet.setPatchVariable(7, Globals.getGlobal(11));
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
  AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) + howMuch));
  Globals.setGlobal(3, (Globals.getGlobal(3) + howMuch));
}
function dropPatch() {
  if (Prims.equality(Globals.getGlobal(1), "center")) {
    return Prims.patch(0, 0);
  }
  if (Prims.equality(Globals.getGlobal(1), "random")) {
    return AgentSet.oneOf(world.patches());
  }
  if ((Prims.equality(Globals.getGlobal(1), "mouse-click") && notImplemented('mouse-down?', false))) {
    Prims.every(0.3, function () {
      return Prims.patch(notImplemented('mouse-xcor', 0)(), notImplemented('mouse-ycor', 0)());
    });
  }
  return Nobody;
}
function pushN() {
  AgentSet.setPatchVariable(6, Prims.fput(AgentSet.getPatchVariable(5), AgentSet.getPatchVariable(6)));
}
function popN() {
  Call(updateN, (Prims.first(AgentSet.getPatchVariable(6)) - AgentSet.getPatchVariable(5)));
  AgentSet.setPatchVariable(6, Prims.butLast(AgentSet.getPatchVariable(6)));
}
Globals.setGlobal(0, false);
Globals.setGlobal(1, "random");
Globals.setGlobal(2, 0);
