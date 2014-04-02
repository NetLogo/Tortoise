Globals.init(11);
PatchesOwn.init(3);
world = new World(-50, 50, -50, 50, 4.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 3);

function setup(initial, random_p) {
  world.clearAll();
  Globals.setGlobal(9, 105);
  Globals.setGlobal(10, 15);
  AgentSet.ask(world.patches(), true, function() {
    if (random_p) {
      AgentSet.setPatchVariable(5, Prims.random(initial));
    }
    else {
      AgentSet.setPatchVariable(5, initial);
    }
    AgentSet.setPatchVariable(6, []);
    AgentSet.setPatchVariable(7, Globals.getGlobal(9));
  });
  var ignore = stabilize(false);
  AgentSet.ask(world.patches(), true, function() {
    recolor();
  });
  Globals.setGlobal(3, Prims.sum(AgentSet.of(world.patches(), function() {
    return AgentSet.getPatchVariable(5)
  })));
  Globals.setGlobal(5, []);
  Globals.setGlobal(7, []);
  world.resetTicks();
}
function setupUniform(initial) {
  setup(initial, false);
}
function setupRandom() {
  setup(4, true);
}
function recolor() {
  AgentSet.setPatchVariable(2, Prims.scaleColor(AgentSet.getPatchVariable(7), AgentSet.getPatchVariable(5), 0, 4));
}
function go() {
  var drop = dropPatch();
  if (!Prims.equality(drop, Nobody)) {
    AgentSet.ask(drop, true, function() {
      updateN(1);
      recolor();
    });
    var results = stabilize(Globals.getGlobal(0));
    var avalanchePatches = Prims.first(results);
    var lifetime = Prims.last(results);
    if (AgentSet.any(avalanchePatches)) {
      Globals.setGlobal(5, Prims.lput(AgentSet.count(avalanchePatches), Globals.getGlobal(5)));
      Globals.setGlobal(7, Prims.lput(lifetime, Globals.getGlobal(7)));
    }
    AgentSet.ask(avalanchePatches, true, function() {
      recolor();
      AgentSet.ask(Prims.getNeighbors4(), true, function() {
        recolor();
      });
    });
    AgentSet.ask(avalanchePatches, true, function() {
      AgentSet.setPatchVariable(7, Globals.getGlobal(9));
      recolor();
    });
    Globals.setGlobal(4, Globals.getGlobal(3));
    world.tick();
  }
}
function stabilize(animate_p) {
  var activePatches = AgentSet.agentFilter(world.patches(), function() {
    return Prims.gt(AgentSet.getPatchVariable(5), 3)
  });
  var iters = 0;
  var avalanchePatches = new Agents([], Breeds.get('PATCHES'), AgentKind.Patch);
  while (AgentSet.any(activePatches)) {
    var overloadedPatches = AgentSet.agentFilter(activePatches, function() {
      return Prims.gt(AgentSet.getPatchVariable(5), 3)
    });
    if (AgentSet.any(overloadedPatches)) {
      iters = (iters + 1);
    }
    AgentSet.ask(overloadedPatches, true, function() {
      AgentSet.setPatchVariable(7, Globals.getGlobal(10));
      updateN(-4);
      if (animate_p) {
        recolor();
      }
      AgentSet.ask(Prims.getNeighbors4(), true, function() {
        updateN(1);
        if (animate_p) {
          recolor();
        }
      });
    });
    if (animate_p) {
    
    }
    avalanchePatches = Prims.patchSet(avalanchePatches, overloadedPatches);
    activePatches = Prims.patchSet(AgentSet.of(overloadedPatches, function() {
      return Prims.getNeighbors4()
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
  return Nobody;
}
function pushN() {
  AgentSet.setPatchVariable(6, Prims.fput(AgentSet.getPatchVariable(5), AgentSet.getPatchVariable(6)));
}
function popN() {
  updateN((Prims.first(AgentSet.getPatchVariable(6)) - AgentSet.getPatchVariable(5)));
  AgentSet.setPatchVariable(6, Prims.butLast(AgentSet.getPatchVariable(6)));
}
Globals.setGlobal(0, false);
Globals.setGlobal(1, "center");
Globals.setGlobal(2, 0);
