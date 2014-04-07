Globals.init(3);
PatchesOwn.init(1);
world = new World(0, 99, 0, 99, 3.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 1);

function benchmark() {
  return Procedures.stoppably(function() {
    Random.setSeed(0);
    world.resetTimer();
    setup();
    Prims.repeat(5000, function () {
      go();
    });
    Globals.setGlobal(2, world.timer());
  });
}
function setup() {
  return Procedures.stoppably(function() {
    world.clearAll();
    AgentSet.ask(world.patches(), true, function() {
      AgentSet.setPatchVariable(5, 2);
      colorize();
    });
    Globals.setGlobal(1, (2 * AgentSet.count(world.patches())));
    world.resetTicks();
  });
}
function go() {
  return Procedures.stoppably(function() {
    var activePatches = Prims.patchSet(AgentSet.oneOf(world.patches()));
    AgentSet.ask(activePatches, true, function() {
      AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) + 1));
      Globals.setGlobal(1, (Globals.getGlobal(1) + 1));
      colorize();
    });
    while (AgentSet.any(activePatches)) {
      var overloadedPatches = AgentSet.agentFilter(activePatches, function() {
        return Prims.gt(AgentSet.getPatchVariable(5), 3)
      });
      AgentSet.ask(overloadedPatches, true, function() {
        AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) - 4));
        Globals.setGlobal(1, (Globals.getGlobal(1) - 4));
        colorize();
        AgentSet.ask(Prims.getNeighbors4(), true, function() {
          AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) + 1));
          Globals.setGlobal(1, (Globals.getGlobal(1) + 1));
          colorize();
        });
      });
      activePatches = Prims.patchSet(AgentSet.of(overloadedPatches, function() {
        return Prims.getNeighbors4()
      }));
    }
    world.tick();
  });
}
function colorize() {
  return Procedures.stoppably(function() {
    if (Prims.lte(AgentSet.getPatchVariable(5), 3)) {
      AgentSet.setPatchVariable(2, Prims.item(AgentSet.getPatchVariable(5), [83, 54, 45, 25]));
    }
    else {
      AgentSet.setPatchVariable(2, 15);
    }
  });
}
Procedures.stoppably(function() {Globals.setGlobal(0, false);})
