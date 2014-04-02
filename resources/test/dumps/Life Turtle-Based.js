Globals.init(1);
PatchesOwn.init(1);
world = new World(-35, 35, -35, 35, 7.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 1);
Breeds.add("CELLS", "cell");
Breeds.get("CELLS").vars =[""];
Breeds.add("BABIES", "baby");
Breeds.get("BABIES").vars =[""];
function setupBlank() {
  world.clearAll();
  Breeds.setDefaultShape(world.turtlesOfBreed("CELLS"), "circle");
  Breeds.setDefaultShape(world.turtlesOfBreed("BABIES"), "dot");
  AgentSet.ask(world.patches(), true, function() {
    AgentSet.setPatchVariable(5, 0);
  });
  world.resetTicks();
}
function setupRandom() {
  setupBlank();
  AgentSet.ask(world.patches(), true, function() {
    if ((Prims.randomFloat(100) < Globals.getGlobal(0))) {
      AgentSet.ask(Prims.sprout(1, "BABIES"), true, function() {});
    }
  });
  go();
  world.resetTicks();
}
function birth() {
  AgentSet.ask(Prims.sprout(1, "BABIES"), true, function() {
    AgentSet.setTurtleVariable(1, (65 + 1));
  });
}
function go() {
  AgentSet.ask(AgentSet.agentFilter(world.turtlesOfBreed("CELLS"), function() {
    return Prims.equality(AgentSet.getTurtleVariable(1), 5)
  }), true, function() {
    AgentSet.die();
  });
  AgentSet.ask(world.turtlesOfBreed("BABIES"), true, function() {
    AgentSet.setBreed(world.turtlesOfBreed("CELLS"));
    AgentSet.setTurtleVariable(1, 9.9);
  });
  AgentSet.ask(world.turtlesOfBreed("CELLS"), true, function() {
    AgentSet.ask(Prims.getNeighbors(), true, function() {
      AgentSet.setPatchVariable(5, (AgentSet.getPatchVariable(5) + 1));
    });
  });
  AgentSet.ask(world.turtlesOfBreed("CELLS"), true, function() {
    if ((Prims.equality(AgentSet.getPatchVariable(5), 2) || Prims.equality(AgentSet.getPatchVariable(5), 3))) {
      AgentSet.setTurtleVariable(1, 9.9);
    }
    else {
      AgentSet.setTurtleVariable(1, 5);
    }
  });
  AgentSet.ask(world.patches(), true, function() {
    if ((!(AgentSet.any(AgentSet.self().breedHere("CELLS"))) && Prims.equality(AgentSet.getPatchVariable(5), 3))) {
      birth();
    }
    AgentSet.setPatchVariable(5, 0);
  });
  world.tick();
}
Globals.setGlobal(0, 35);
