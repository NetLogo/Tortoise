Globals.init(13);
PatchesOwn.init(3);
world = new World(-50, 50, -50, 50, 4.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 3);

function setup(setupTask) {
  return Procedures.stoppably(function() {
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
  });
}
function setupUniform(initial) {
  return Procedures.stoppably(function() {
    setup(Tasks.reporterTask(function() {
      return initial
    }));
  });
}
function setupRandom() {
  return Procedures.stoppably(function() {
    setup(Tasks.reporterTask(function() {
      return Prims.random(4)
    }));
  });
}
function recolor() {
  return Procedures.stoppably(function() {
    AgentSet.setPatchVariable(2, Prims.scaleColor(AgentSet.getPatchVariable(7), AgentSet.getPatchVariable(5), 0, 4));
  });
}
function go() {
  return Procedures.stoppably(function() {
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
      noop();
      AgentSet.ask(avalanchePatches, true, function() {
        AgentSet.setPatchVariable(7, Globals.getGlobal(10));
        recolor();
      });
      Globals.setGlobal(4, Globals.getGlobal(3));
      world.tick();
    }
  });
}
function explore() {
  return Procedures.stoppably(function() {

  });
}
function stabilize(animate_p) {
  return Procedures.stoppably(function() {
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
        AgentSet.setPatchVariable(7, Globals.getGlobal(11));
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
        noop();
      }
      avalanchePatches = Prims.patchSet(avalanchePatches, overloadedPatches);
      activePatches = Prims.patchSet(AgentSet.of(overloadedPatches, function() {
        return Prims.getNeighbors4()
      }));
    }
    return Prims.list(avalanchePatches, iters);
  });
}
function updateN(howMuch) {
  return Procedures.stoppably(function() {
    AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) + howMuch));
    Globals.setGlobal(3, (Globals.getGlobal(3) + howMuch));
  });
}
function dropPatch() {
  return Procedures.stoppably(function() {
    if (Prims.equality(Globals.getGlobal(1), "center")) {
      return Prims.patch(0, 0);
    }
    if (Prims.equality(Globals.getGlobal(1), "random")) {
      return AgentSet.oneOf(world.patches());
    }
    return Nobody;
  });
}
function pushN() {
  return Procedures.stoppably(function() {
    AgentSet.setPatchVariable(6, Prims.fput(AgentSet.getPatchVariable(5), AgentSet.getPatchVariable(6)));
  });
}
function popN() {
  return Procedures.stoppably(function() {
    updateN((Prims.first(AgentSet.getPatchVariable(6)) - AgentSet.getPatchVariable(5)));
    AgentSet.setPatchVariable(6, Prims.butLast(AgentSet.getPatchVariable(6)));
  });
}
Procedures.stoppably(function() {Globals.setGlobal(0, false);
Globals.setGlobal(1, "random");
Globals.setGlobal(2, 0);})
