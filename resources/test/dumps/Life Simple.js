PatchesOwn.init(2);
world = new World(-5, 5, -5, 5, 25.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 0);

function setup() {
  world.clearAll();
  AgentSet.ask(world.patches(), true, function() {
    Call(cellDeath);
  });
  AgentSet.ask(Prims.patch(0, 0), true, function() {
    Call(cellBirth);
  });
  AgentSet.ask(Prims.patch(-1, 0), true, function() {
    Call(cellBirth);
  });
  AgentSet.ask(Prims.patch(0, -1), true, function() {
    Call(cellBirth);
  });
  AgentSet.ask(Prims.patch(0, 1), true, function() {
    Call(cellBirth);
  });
  AgentSet.ask(Prims.patch(1, 1), true, function() {
    Call(cellBirth);
  });
  world.resetTicks();
}
function cellBirth() {
  AgentSet.setPatchVariable(5, true);
  AgentSet.setPatchVariable(2, 9.9);
}
function cellDeath() {
  AgentSet.setPatchVariable(5, false);
  AgentSet.setPatchVariable(2, 0);
}
function go() {
  AgentSet.ask(world.patches(), true, function() {
    AgentSet.setPatchVariable(6, AgentSet.count(AgentSet.agentFilter(Prims.getNeighbors(), function() {
      return AgentSet.getPatchVariable(5)
    })));
  });
  AgentSet.ask(world.patches(), true, function() {
    if (Prims.equality(AgentSet.getPatchVariable(6), 3)) {
      Call(cellBirth);
    }
    else {
      if (!Prims.equality(AgentSet.getPatchVariable(6), 2)) {
        Call(cellDeath);
      }
    }
  });
  world.tick();
}
