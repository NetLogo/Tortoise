Globals.init(1);
world = new World(-10, 10, -10, 10, 18.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 1);

function setup() {
  world.clearAll();
  AgentSet.ask(world.patches(), true, function() {
    AgentSet.setPatchVariable(2, 9.9);
  });
  AgentSet.ask(world.createTurtles(Globals.getGlobal(0), ""), true, function() {
    AgentSet.setTurtleVariable(2, (90 * Prims.random(4)));
    AgentSet.setTurtleVariable(1, 15);
    AgentSet.setTurtleVariable(10, 6);
  });
  world.resetTicks();
}
function goForward() {
  var n = 0;
  while (Prims.lt(n, AgentSet.count(world.turtles()))) {
    AgentSet.ask(world.getTurtle(n), true, function() {
      Prims.fd(1);
      turn();
    });
    n = (n + 1);
  }
  world.tick();
}
function goReverse() {
  var n = AgentSet.count(world.turtles());
  while (Prims.gt(n, 0)) {
    n = (n - 1);
    AgentSet.ask(world.getTurtle(n), true, function() {
      turn();
      Prims.bk(1);
    });
  }
  world.tick();
}
function turn() {
  if (Prims.equality(AgentSet.getPatchVariable(2), 9.9)) {
    AgentSet.setPatchVariable(2, 0);
    Prims.right(90);
  }
  else {
    AgentSet.setPatchVariable(2, 9.9);
    Prims.left(90);
  }
}
Globals.setGlobal(0, 3);
