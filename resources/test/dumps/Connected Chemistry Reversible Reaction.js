var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Dump = tortoise_require('engine/dump');
var Exception = tortoise_require('util/exception');
var Link = tortoise_require('engine/core/link');
var LinkSet = tortoise_require('engine/core/linkset');
var Meta = tortoise_require('meta');
var NLMath = tortoise_require('util/nlmath');
var NLType = tortoise_require('engine/core/typechecker');
var Nobody = tortoise_require('engine/core/nobody');
var PatchSet = tortoise_require('engine/core/patchset');
var PenBundle = tortoise_require('engine/plot/pen');
var Plot = tortoise_require('engine/plot/plot');
var PlotOps = tortoise_require('engine/plot/plotops');
var Random = tortoise_require('shim/random');
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0.0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0.0,1.0]},{"x-offset":0.0,"is-visible":true,"dash-pattern":[1.0,0.0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0.0,1.0]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"clock":{"name":"clock","editableColorIndex":0,"rotate":true,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,128,143,143,158,158,173],"ycors":[31,75,75,150,150,75,75],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"hydrogen":{"name":"hydrogen","editableColorIndex":8,"rotate":true,"elements":[{"x":70,"y":70,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":130,"y":130,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false}]},"nh3":{"name":"nh3","editableColorIndex":0,"rotate":true,"elements":[{"x":75,"y":75,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":12,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":192,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":102,"y":198,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false}]},"nitrogen":{"name":"nitrogen","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false}]},"nothing":{"name":"nothing","editableColorIndex":0,"rotate":true,"elements":[]},"oxygen":{"name":"oxygen","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":297,"ymax":299,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    notify:  function(str) {}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
modelConfig.plots = [(function() {
  var name    = 'Volume vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(25.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Volume vs. Time', 'default')(function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("volume"));; });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "volume", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Pressure vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Pressure vs. Time', 'default')(function() {
        if (Prims.gt(ListPrims.length(world.observer.getGlobal("pressure-history")), 10)) {
          plotManager.plotPoint(world.ticker.tickCount(), ListPrims.mean(world.observer.getGlobal("pressure-history")));
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "press.", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Temperature vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Temperature vs. Time', 'default')(function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("temperature"));; });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "temp.", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Number of molecules';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('H2', plotOps.makePenOps, false, new PenBundle.State(5.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Number of molecules', 'H2')(function() {
        plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"); }).size());;
      });
    });
  }),
  new PenBundle.Pen('N2', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Number of molecules', 'N2')(function() {
        plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nitrogen"); }).size());;
      });
    });
  }),
  new PenBundle.Pen('NH3', plotOps.makePenOps, false, new PenBundle.State(97.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Number of molecules', 'NH3')(function() {
        plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3"); }).size());;
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "number", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PARTICLES", singular: "particle", varNames: ["speed", "mass", "energy", "momentum-difference", "last-collision", "molecule-type"] }, { name: "FLASHES", singular: "flash", varNames: ["birthday"] }])([], [])(["init-wall-position", "#-n2", "#-h2", "initial-gas-temp", "forward-react?", "reverse-react?", "#-nh3", "insulated-walls?", "tick-advance-amount", "max-tick-advance-amount", "box-edge-y", "box-edge-x", "number-forward-reactions", "number-reverse-reactions", "pressure", "pressure-history", "length-horizontal-surface", "length-vertical-surface", "walls", "heatable-walls", "piston-wall", "outside-energy", "min-outside-energy", "max-outside-energy", "energy-increment", "piston-position", "piston-color", "wall-color", "insulated-wall-color", "run-go?", "volume", "scale-factor-temp-to-energy", "scale-factor-energy-to-temp", "temperature", "difference-bond-energies", "activation-energy", "particle-size"], ["init-wall-position", "#-n2", "#-h2", "initial-gas-temp", "forward-react?", "reverse-react?", "#-nh3", "insulated-walls?"], ["insulated?", "wall?"], -32, 32, -25, 25, 8.0, true, true, turtleShapes, linkShapes, function(){});
var BreedManager = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
var procedures = (function() {
  var setup = function() {
    world.clearAll();
    world.observer.setGlobal("run-go?", true);
    world.observer.setGlobal("number-forward-reactions", 0);
    world.observer.setGlobal("number-reverse-reactions", 0);
    world.observer.setGlobal("scale-factor-energy-to-temp", 4);
    world.observer.setGlobal("scale-factor-temp-to-energy", (1 / world.observer.getGlobal("scale-factor-energy-to-temp")));
    world.observer.setGlobal("outside-energy", (world.observer.getGlobal("initial-gas-temp") * world.observer.getGlobal("scale-factor-temp-to-energy")));
    world.observer.setGlobal("difference-bond-energies", 20);
    world.observer.setGlobal("activation-energy", 80);
    world.observer.setGlobal("energy-increment", 5);
    world.observer.setGlobal("min-outside-energy", 0);
    world.observer.setGlobal("max-outside-energy", 100);
    world.observer.setGlobal("particle-size", 1.3);
    BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PARTICLES").getSpecialName(), "circle")
    BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("FLASHES").getSpecialName(), "square")
    world.observer.setGlobal("piston-color", 55);
    world.observer.setGlobal("insulated-wall-color", 45);
    world.observer.setGlobal("max-tick-advance-amount", 0.1);
    world.observer.setGlobal("box-edge-y", (world.topology.maxPycor - 1));
    world.observer.setGlobal("box-edge-x", (world.topology.maxPxcor - 1));
    world.observer.setGlobal("piston-position", (world.observer.getGlobal("init-wall-position") - world.observer.getGlobal("box-edge-x")));
    procedures.drawBoxPiston();
    procedures.recalculateWallColor();
    procedures.calculateVolume();
    procedures.makeParticles();
    world.observer.setGlobal("pressure-history", []);
    procedures.calculatePressureAndTemperature();
    world.ticker.reset();
  };
  var makeParticles = function() {
    world.turtleManager.createTurtles(world.observer.getGlobal("#-h2"), "PARTICLES").ask(function() { procedures.setupHydrogenParticle(); }, true);
    world.turtleManager.createTurtles(world.observer.getGlobal("#-n2"), "PARTICLES").ask(function() { procedures.setupNitrogenParticle(); }, true);
    world.turtleManager.createTurtles(world.observer.getGlobal("#-nh3"), "PARTICLES").ask(function() { procedures.setupAmmoniaParticle(); }, true);
    procedures.calculateTickAdvanceAmount();
  };
  var setupHydrogenParticle = function() {
    SelfManager.self().setVariable("shape", "hydrogen");
    SelfManager.self().setVariable("molecule-type", "hydrogen");
    SelfManager.self().setVariable("mass", 2);
    procedures.setOtherParticleAttributes();
  };
  var setupNitrogenParticle = function() {
    SelfManager.self().setVariable("size", world.observer.getGlobal("particle-size"));
    SelfManager.self().setVariable("shape", "nitrogen");
    SelfManager.self().setVariable("molecule-type", "nitrogen");
    SelfManager.self().setVariable("mass", 14);
    procedures.setOtherParticleAttributes();
  };
  var setupAmmoniaParticle = function() {
    SelfManager.self().setVariable("shape", "nh3");
    SelfManager.self().setVariable("molecule-type", "nh3");
    SelfManager.self().setVariable("mass", 10);
    procedures.setOtherParticleAttributes();
  };
  var setOtherParticleAttributes = function() {
    SelfManager.self().setVariable("size", world.observer.getGlobal("particle-size"));
    SelfManager.self().setVariable("last-collision", Nobody);
    SelfManager.self().setVariable("energy", (world.observer.getGlobal("initial-gas-temp") * world.observer.getGlobal("scale-factor-temp-to-energy")));
    SelfManager.self().setVariable("speed", procedures.speedFromEnergy());
    procedures.randomPosition();
  };
  var randomPosition = function() {
    SelfManager.self().setXY(((1 - world.observer.getGlobal("box-edge-x")) + Prims.randomFloat(((world.observer.getGlobal("box-edge-x") + world.observer.getGlobal("piston-position")) - 3))), ((1 - world.observer.getGlobal("box-edge-y")) + Prims.randomFloat(((2 * world.observer.getGlobal("box-edge-y")) - 2))));
    SelfManager.self().setVariable("heading", Prims.randomFloat(360));
  };
  var go = function() {
    try {
      if (!world.observer.getGlobal("run-go?")) {
        throw new Exception.StopInterrupt;
      }
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
        procedures.bounce();
        procedures.move();
        procedures.checkForCollision();
      }, true);
      if (world.observer.getGlobal("forward-react?")) {
        world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nitrogen"); }).ask(function() { procedures.checkForForwardReaction(); }, true);
      }
      if (world.observer.getGlobal("reverse-react?")) {
        world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3"); }).ask(function() { procedures.checkForReverseReaction(); }, true);
      }
      procedures.calculatePressureAndTemperature();
      procedures.calculateTickAdvanceAmount();
      world.ticker.tickAdvance(world.observer.getGlobal("tick-advance-amount"));
      procedures.recalculateWallColor();
      plotManager.updatePlots();
      notImplemented('display', undefined)();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  };
  var calculateTickAdvanceAmount = function() {
    if (world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("speed"), 0); }).nonEmpty()) {
      world.observer.setGlobal("tick-advance-amount", ListPrims.min(ListPrims.list((1 / NLMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })))), world.observer.getGlobal("max-tick-advance-amount"))));
    }
    else {
      world.observer.setGlobal("tick-advance-amount", world.observer.getGlobal("max-tick-advance-amount"));
    }
  };
  var move = function() {
    if (!Prims.equality(SelfManager.self().patchAhead((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-advance-amount"))), SelfManager.self().getPatchHere())) {
      SelfManager.self().setVariable("last-collision", Nobody);
    }
    SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-advance-amount")));
  };
  var recalculateWallColor = function() {
    if (world.observer.getGlobal("insulated-walls?")) {
      world.observer.setGlobal("wall-color", world.observer.getGlobal("insulated-wall-color"));
    }
    else {
      world.observer.setGlobal("wall-color", ColorModel.scaleColor(15, world.observer.getGlobal("outside-energy"), -60, (world.observer.getGlobal("max-outside-energy") + 100)));
    }
    world.patches().agentFilter(function() { return !SelfManager.self().getPatchVariable("insulated?"); }).ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
    world.turtleManager.turtlesOfBreed("FLASHES").agentFilter(function() { return Prims.gt((world.ticker.tickCount() - SelfManager.self().getVariable("birthday")), 0.4); }).ask(function() { SelfManager.self().die(); }, true);
  };
  var checkForForwardReaction = function() {
    var hitHydrogen = world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
      return (Prims.lte(SelfManager.self().distance(SelfManager.myself()), 1) && Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"));
    });
    if ((Prims.gte(hitHydrogen.size(), 3) && Prims.equality(Prims.random(2), 0))) {
      if (Prims.lt(SelfManager.self().getVariable("speed"), 0)) {
        SelfManager.self().setVariable("speed", 0);
      }
      var reactants = ListPrims.nOf(3, hitHydrogen);
      var totalInputEnergy = (SelfManager.self().getVariable("energy") + ListPrims.sum(reactants.projectionBy(function() { return SelfManager.self().getVariable("energy"); })));
      if (Prims.gt(totalInputEnergy, world.observer.getGlobal("activation-energy"))) {
        var totalOutputEnergy = (totalInputEnergy + world.observer.getGlobal("difference-bond-energies"));
        SelfManager.self().setVariable("molecule-type", "nh3");
        SelfManager.self().setVariable("shape", "nh3");
        SelfManager.self().setVariable("mass", 10);
        SelfManager.self().setVariable("energy", ((totalOutputEnergy * 10) / 20));
        SelfManager.self().setVariable("speed", NLMath.sqrt((2 * (SelfManager.self().getVariable("energy") / SelfManager.self().getVariable("mass")))));
        SelfManager.self().hatch(1, "").ask(function() { SelfManager.self().setVariable("heading", (SelfManager.self().getVariable("heading") + 180)); }, true);
        reactants.ask(function() { SelfManager.self().die(); }, true);
        world.observer.setGlobal("number-forward-reactions", (world.observer.getGlobal("number-forward-reactions") + 1));
      }
    }
  };
  var checkForReverseReaction = function() {
    var hitNh3 = world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
      return ((Prims.lte(SelfManager.self().distance(SelfManager.myself()), 1) && Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3")) && !Prims.equality(SelfManager.self(), SelfManager.myself()));
    });
    if ((Prims.gte(hitNh3.size(), 1) && Prims.equality(Prims.random(2), 0))) {
      var reactants = ListPrims.nOf(1, hitNh3);
      var totalInputEnergy = (SelfManager.self().getVariable("energy") + ListPrims.sum(reactants.projectionBy(function() { return SelfManager.self().getVariable("energy"); })));
      if (Prims.gt(totalInputEnergy, world.observer.getGlobal("activation-energy"))) {
        var totalOutputEnergy = (totalInputEnergy - world.observer.getGlobal("difference-bond-energies"));
        SelfManager.self().setVariable("molecule-type", "nitrogen");
        SelfManager.self().setVariable("shape", "nitrogen");
        SelfManager.self().setVariable("mass", 14);
        SelfManager.self().setVariable("energy", ((totalOutputEnergy * 14) / 20));
        SelfManager.self().setVariable("speed", procedures.speedFromEnergy());
        SelfManager.self().hatch(3, "").ask(function() {
          SelfManager.self().setVariable("molecule-type", "hydrogen");
          SelfManager.self().setVariable("shape", "hydrogen");
          SelfManager.self().setVariable("mass", 2);
          SelfManager.self().setVariable("energy", ((totalOutputEnergy * 2) / 20));
          SelfManager.self().setVariable("speed", procedures.speedFromEnergy());
          SelfManager.self().setVariable("heading", Prims.random(360));
        }, true);
        reactants.ask(function() { SelfManager.self().die(); }, true);
        world.observer.setGlobal("number-reverse-reactions", (world.observer.getGlobal("number-reverse-reactions") + 1));
      }
    }
  };
  var cool = function() {
    if (Prims.gt(world.observer.getGlobal("outside-energy"), 20)) {
      world.observer.setGlobal("outside-energy", (world.observer.getGlobal("outside-energy") - world.observer.getGlobal("energy-increment")));
    }
    else {
      world.observer.setGlobal("outside-energy", 0);
    }
    if (Prims.lte(world.observer.getGlobal("outside-energy"), 0)) {
      world.observer.setGlobal("outside-energy", world.observer.getGlobal("min-outside-energy"));
      UserDialogPrims.confirm("You are currently trying to cool the walls of the container below absolute zero (OK or -273C).  Absolute zero is the lowest theoretical temperature for all matter in the universe and has never been achieved in a real-world laboratory");
    }
    procedures.recalculateWallColor();
    world.observer.getGlobal("heatable-walls").ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
  };
  var heat = function() {
    world.observer.setGlobal("outside-energy", (world.observer.getGlobal("outside-energy") + world.observer.getGlobal("energy-increment")));
    if (Prims.gt(world.observer.getGlobal("outside-energy"), world.observer.getGlobal("max-outside-energy"))) {
      world.observer.setGlobal("outside-energy", world.observer.getGlobal("max-outside-energy"));
      UserDialogPrims.confirm((Dump('') + Dump("You have reached the maximum allowable temperature for the walls of the container in this model.")));
    }
    procedures.recalculateWallColor();
    world.observer.getGlobal("heatable-walls").ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
  };
  var calculatePressureAndTemperature = function() {
    world.observer.setGlobal("pressure", (15 * ListPrims.sum(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("momentum-difference"); }))));
    if (Prims.gt(ListPrims.length(world.observer.getGlobal("pressure-history")), 10)) {
      world.observer.setGlobal("pressure-history", ListPrims.lput(world.observer.getGlobal("pressure"), ListPrims.butFirst(world.observer.getGlobal("pressure-history"))));
    }
    else {
      world.observer.setGlobal("pressure-history", ListPrims.lput(world.observer.getGlobal("pressure"), world.observer.getGlobal("pressure-history")));
    }
    world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { SelfManager.self().setVariable("momentum-difference", 0); }, true);
    if (world.turtleManager.turtlesOfBreed("PARTICLES").nonEmpty()) {
      world.observer.setGlobal("temperature", (ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("energy"); })) * world.observer.getGlobal("scale-factor-energy-to-temp")));
    }
  };
  var calculateVolume = function() {
    world.observer.setGlobal("length-horizontal-surface", (((2 * (world.observer.getGlobal("box-edge-x") - 1)) + 1) - NLMath.abs((world.observer.getGlobal("piston-position") - world.observer.getGlobal("box-edge-x")))));
    world.observer.setGlobal("length-vertical-surface", ((2 * (world.observer.getGlobal("box-edge-y") - 1)) + 1));
    world.observer.setGlobal("volume", ((world.observer.getGlobal("length-horizontal-surface") * world.observer.getGlobal("length-vertical-surface")) * 1));
  };
  var resetReactionCounters = function() {
    world.observer.setGlobal("number-forward-reactions", 0);
    world.observer.setGlobal("number-reverse-reactions", 0);
  };
  var bounce = function() {
    try {
      var newPatch = 0;
      var newPx = 0;
      var newPy = 0;
      if ((!SelfManager.self().getPatchVariable("wall?") && SelfManager.self().patchAt(SelfManager.self().dx(), SelfManager.self().dy()).projectionBy(function() { return !SelfManager.self().getPatchVariable("wall?"); }))) {
        throw new Exception.StopInterrupt;
      }
      newPx = NLMath.round((SelfManager.self().getVariable("xcor") + SelfManager.self().dx()));
      newPy = NLMath.round((SelfManager.self().getVariable("ycor") + SelfManager.self().dy()));
      if ((Prims.equality(NLMath.abs(newPx), world.observer.getGlobal("box-edge-x")) || Prims.equality(newPx, world.observer.getGlobal("piston-position")))) {
        SelfManager.self().setVariable("heading",  -SelfManager.self().getVariable("heading"));
        SelfManager.self().setVariable("momentum-difference", (SelfManager.self().getVariable("momentum-difference") + (NLMath.abs((((NLMath.sin(SelfManager.self().getVariable("heading")) * 2) * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed"))) / world.observer.getGlobal("length-vertical-surface"))));
      }
      if (Prims.equality(NLMath.abs(newPy), world.observer.getGlobal("box-edge-y"))) {
        SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading")));
        SelfManager.self().setVariable("momentum-difference", (SelfManager.self().getVariable("momentum-difference") + (NLMath.abs((((NLMath.cos(SelfManager.self().getVariable("heading")) * 2) * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed"))) / world.observer.getGlobal("length-horizontal-surface"))));
      }
      if (world.getPatchAt(newPx, newPy).projectionBy(function() { return procedures.isothermalWall_p(); })) {
        SelfManager.self().setVariable("energy", ((SelfManager.self().getVariable("energy") + world.observer.getGlobal("outside-energy")) / 2));
        SelfManager.self().setVariable("speed", procedures.speedFromEnergy());
      }
      world.getPatchAt(newPx, newPy).ask(function() { procedures.makeAFlash(); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  };
  var makeAFlash = function() {
    SelfManager.self().sprout(1, "TURTLES").ask(function() {
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FLASHES"));
      SelfManager.self().setVariable("birthday", world.ticker.tickCount());
      SelfManager.self().setVariable("color", [0, 0, 0, 100]);
    }, true);
  };
  var checkForCollision = function() {
    var candidate = 0;
    if (Prims.equality(SelfPrims.other(SelfManager.self().breedHere("PARTICLES")).size(), 1)) {
      candidate = ListPrims.oneOf(SelfPrims.other(SelfManager.self().breedHere("PARTICLES").agentFilter(function() {
        return (Prims.lt(SelfManager.self(), SelfManager.myself()) && !Prims.equality(SelfManager.myself(), SelfManager.self().getVariable("last-collision")));
      })));
      if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfManager.self().getVariable("speed"), 0) || Prims.gt(candidate.projectionBy(function() { return SelfManager.self().getVariable("speed"); }), 0)))) {
        procedures.collideWith(candidate);
        SelfManager.self().setVariable("last-collision", candidate);
        candidate.ask(function() { SelfManager.self().setVariable("last-collision", SelfManager.myself()); }, true);
      }
    }
  };
  var collideWith = function(otherParticle) {
    var mass2 = 0;
    var speed2 = 0;
    var heading2 = 0;
    var theta = 0;
    var v1t = 0;
    var v1l = 0;
    var v2t = 0;
    var v2l = 0;
    var vcm = 0;
    mass2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("mass"); });
    speed2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("speed"); });
    heading2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("heading"); });
    theta = Prims.randomFloat(360);
    v1t = (SelfManager.self().getVariable("speed") * NLMath.cos((theta - SelfManager.self().getVariable("heading"))));
    v1l = (SelfManager.self().getVariable("speed") * NLMath.sin((theta - SelfManager.self().getVariable("heading"))));
    v2t = (speed2 * NLMath.cos((theta - heading2)));
    v2l = (speed2 * NLMath.sin((theta - heading2)));
    vcm = (((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)) / (SelfManager.self().getVariable("mass") + mass2));
    v1t = ((2 * vcm) - v1t);
    v2t = ((2 * vcm) - v2t);
    SelfManager.self().setVariable("speed", NLMath.sqrt((NLMath.pow(v1t, 2) + NLMath.pow(v1l, 2))));
    SelfManager.self().setVariable("energy", ((0.5 * SelfManager.self().getVariable("mass")) * NLMath.pow(SelfManager.self().getVariable("speed"), 2)));
    if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
      SelfManager.self().setVariable("heading", (theta - NLMath.atan(v1l, v1t)));
    }
    otherParticle.ask(function() {
      SelfManager.self().setVariable("speed", NLMath.sqrt((NLMath.pow(v2t, 2) + NLMath.pow(v2l, 2))));
      SelfManager.self().setVariable("energy", ((0.5 * SelfManager.self().getVariable("mass")) * NLMath.pow(SelfManager.self().getVariable("speed"), 2)));
      if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
        SelfManager.self().setVariable("heading", (theta - NLMath.atan(v2l, v2t)));
      }
    }, true);
  };
  var checkMovePiston = function() {
    try {
      world.observer.setGlobal("run-go?", false);
      if ((MousePrims.isDown() && Prims.lt(MousePrims.getY(), (world.topology.maxPycor - 1)))) {
        if ((Prims.gte(MousePrims.getX(), world.observer.getGlobal("piston-position")) && Prims.lt(MousePrims.getX(), (world.observer.getGlobal("box-edge-x") - 2)))) {
          procedures.pistonOut(NLMath.ceil((MousePrims.getX() - world.observer.getGlobal("piston-position"))));
        }
        world.observer.setGlobal("run-go?", true);
        throw new Exception.StopInterrupt;
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  };
  var pistonOut = function(dist) {
    if (Prims.gt(dist, 0)) {
      if (Prims.lt((world.observer.getGlobal("piston-position") + dist), (world.observer.getGlobal("box-edge-x") - 1))) {
        procedures.undrawPiston();
        world.observer.setGlobal("piston-position", (world.observer.getGlobal("piston-position") + dist));
        procedures.drawBoxPiston();
      }
      else {
        procedures.undrawPiston();
        world.observer.setGlobal("piston-position", (world.observer.getGlobal("box-edge-x") - 1));
        procedures.drawBoxPiston();
      }
      procedures.calculateVolume();
    }
  };
  var drawBoxPiston = function() {
    world.patches().ask(function() {
      SelfManager.self().setPatchVariable("insulated?", true);
      SelfManager.self().setPatchVariable("wall?", false);
    }, true);
    world.observer.setGlobal("heatable-walls", world.patches().agentFilter(function() {
      return ((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), (-1 * world.observer.getGlobal("box-edge-x"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y"))) || ((Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")) && Prims.lte(SelfManager.self().getPatchVariable("pxcor"), world.observer.getGlobal("piston-position"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge-x"))));
    }));
    world.observer.getGlobal("heatable-walls").ask(function() {
      SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color"));
      SelfManager.self().setPatchVariable("insulated?", false);
      SelfManager.self().setPatchVariable("wall?", true);
    }, true);
    world.observer.setGlobal("piston-wall", world.patches().agentFilter(function() {
      return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), NLMath.round(world.observer.getGlobal("piston-position"))) && Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
    }));
    world.observer.getGlobal("piston-wall").ask(function() {
      SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("piston-color"));
      SelfManager.self().setPatchVariable("wall?", true);
    }, true);
    world.patches().agentFilter(function() {
      return ((Prims.gt(SelfManager.self().getPatchVariable("pxcor"), NLMath.round(world.observer.getGlobal("piston-position"))) && Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge-x"))) && Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
    }).ask(function() {
      SelfManager.self().setPatchVariable("pcolor", 5);
      SelfManager.self().setPatchVariable("wall?", true);
    }, true);
    world.patches().agentFilter(function() {
      return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.observer.getGlobal("box-edge-x")) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
    }).ask(function() {
      SelfManager.self().setPatchVariable("pcolor", 5);
      SelfManager.self().setPatchVariable("wall?", true);
    }, true);
  };
  var undrawPiston = function() {
    world.patches().agentFilter(function() {
      return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), NLMath.round(world.observer.getGlobal("piston-position"))) && Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
    }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
  };
  var speedFromEnergy = function() {
    try {
      throw new Exception.ReportInterrupt(NLMath.sqrt(((2 * SelfManager.self().getVariable("energy")) / SelfManager.self().getVariable("mass"))));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var energyFromSpeed = function() {
    try {
      throw new Exception.ReportInterrupt((((SelfManager.self().getVariable("mass") * SelfManager.self().getVariable("speed")) * SelfManager.self().getVariable("speed")) / 2));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var isothermalWall_p = function() {
    try {
      if (((((Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (-1 * world.observer.getGlobal("box-edge-x"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y"))) || (Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge-x")))) && !SelfManager.self().getPatchVariable("insulated?")) && !world.observer.getGlobal("insulated-walls?"))) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  return {
    "BOUNCE":bounce,
    "CALCULATE-PRESSURE-AND-TEMPERATURE":calculatePressureAndTemperature,
    "CALCULATE-TICK-ADVANCE-AMOUNT":calculateTickAdvanceAmount,
    "CALCULATE-VOLUME":calculateVolume,
    "CHECK-FOR-COLLISION":checkForCollision,
    "CHECK-FOR-FORWARD-REACTION":checkForForwardReaction,
    "CHECK-FOR-REVERSE-REACTION":checkForReverseReaction,
    "CHECK-MOVE-PISTON":checkMovePiston,
    "COLLIDE-WITH":collideWith,
    "COOL":cool,
    "DRAW-BOX-PISTON":drawBoxPiston,
    "ENERGY-FROM-SPEED":energyFromSpeed,
    "GO":go,
    "HEAT":heat,
    "ISOTHERMAL-WALL?":isothermalWall_p,
    "MAKE-A-FLASH":makeAFlash,
    "MAKE-PARTICLES":makeParticles,
    "MOVE":move,
    "PISTON-OUT":pistonOut,
    "RANDOM-POSITION":randomPosition,
    "RECALCULATE-WALL-COLOR":recalculateWallColor,
    "RESET-REACTION-COUNTERS":resetReactionCounters,
    "SET-OTHER-PARTICLE-ATTRIBUTES":setOtherParticleAttributes,
    "SETUP":setup,
    "SETUP-AMMONIA-PARTICLE":setupAmmoniaParticle,
    "SETUP-HYDROGEN-PARTICLE":setupHydrogenParticle,
    "SETUP-NITROGEN-PARTICLE":setupNitrogenParticle,
    "SPEED-FROM-ENERGY":speedFromEnergy,
    "UNDRAW-PISTON":undrawPiston,
    "bounce":bounce,
    "calculatePressureAndTemperature":calculatePressureAndTemperature,
    "calculateTickAdvanceAmount":calculateTickAdvanceAmount,
    "calculateVolume":calculateVolume,
    "checkForCollision":checkForCollision,
    "checkForForwardReaction":checkForForwardReaction,
    "checkForReverseReaction":checkForReverseReaction,
    "checkMovePiston":checkMovePiston,
    "collideWith":collideWith,
    "cool":cool,
    "drawBoxPiston":drawBoxPiston,
    "energyFromSpeed":energyFromSpeed,
    "go":go,
    "heat":heat,
    "isothermalWall_p":isothermalWall_p,
    "makeAFlash":makeAFlash,
    "makeParticles":makeParticles,
    "move":move,
    "pistonOut":pistonOut,
    "randomPosition":randomPosition,
    "recalculateWallColor":recalculateWallColor,
    "resetReactionCounters":resetReactionCounters,
    "setOtherParticleAttributes":setOtherParticleAttributes,
    "setup":setup,
    "setupAmmoniaParticle":setupAmmoniaParticle,
    "setupHydrogenParticle":setupHydrogenParticle,
    "setupNitrogenParticle":setupNitrogenParticle,
    "speedFromEnergy":speedFromEnergy,
    "undrawPiston":undrawPiston
  };
})();
world.observer.setGlobal("init-wall-position", 6);
world.observer.setGlobal("#-n2", 0);
world.observer.setGlobal("#-h2", 0);
world.observer.setGlobal("initial-gas-temp", 90);
world.observer.setGlobal("forward-react?", true);
world.observer.setGlobal("reverse-react?", true);
world.observer.setGlobal("#-nh3", 200);
world.observer.setGlobal("insulated-walls?", true);
