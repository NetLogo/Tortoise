Globals.init(2);
TurtlesOwn.init(2);
world = new World(-12, 12, -12, 12, 18.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 2);

function setup() {
  world.clearAll();
  AgentSet.ask(world.patches(), true, function() {
    if (Prims.lt(Prims.random(100), Globals.getGlobal(1))) {
      AgentSet.setPatchVariable(2, 45);
    }
  });
  AgentSet.ask(world.createTurtles(Globals.getGlobal(0), ""), true, function() {
    AgentSet.setTurtleVariable(1, 9.9);
    Prims.setXY(Prims.randomXcor(), Prims.randomYcor());
    AgentSet.setTurtleVariable(10, 1.5);
    AgentSet.setTurtleVariable(13, 1);
  });
  world.resetTicks();
}
function go() {
  AgentSet.ask(world.turtles(), true, function() {
    if (Prims.gt(AgentSet.getTurtleVariable(14), 0)) {
      AgentSet.setTurtleVariable(14, (AgentSet.getTurtleVariable(14) - 1));
    }
    else {
      action();
      wiggle();
    }
    Prims.fd(1);
  });
  world.tick();
}
function wiggle() {
  Prims.right(Prims.random(50));
  Prims.left(Prims.random(50));
}
function action() {
  if (Prims.equality(AgentSet.getTurtleVariable(13), 1)) {
    searchForChip();
  }
  else {
    if (Prims.equality(AgentSet.getTurtleVariable(13), 2)) {
      findNewPile();
    }
    else {
      if (Prims.equality(AgentSet.getTurtleVariable(13), 3)) {
        putDownChip();
      }
      else {
        getAway();
      }
    }
  }
}
function searchForChip() {
  if (Prims.equality(AgentSet.getPatchVariable(2), 45)) {
    AgentSet.setPatchVariable(2, 0);
    AgentSet.setTurtleVariable(1, 25);
    AgentSet.setTurtleVariable(14, 20);
    AgentSet.setTurtleVariable(13, 2);
  }
}
function findNewPile() {
  if (Prims.equality(AgentSet.getPatchVariable(2), 45)) {
    AgentSet.setTurtleVariable(13, 3);
  }
}
function putDownChip() {
  if (Prims.equality(AgentSet.getPatchVariable(2), 0)) {
    AgentSet.setPatchVariable(2, 45);
    AgentSet.setTurtleVariable(1, 9.9);
    AgentSet.setTurtleVariable(14, 20);
    AgentSet.setTurtleVariable(13, 4);
  }
}
function getAway() {
  if (Prims.equality(AgentSet.getPatchVariable(2), 0)) {
    AgentSet.setTurtleVariable(13, 1);
  }
}
Globals.setGlobal(0, 50);
Globals.setGlobal(1, 25);
