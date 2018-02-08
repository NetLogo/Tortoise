var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Exception = tortoise_require('util/exception');
var Link = tortoise_require('engine/core/link');
var LinkSet = tortoise_require('engine/core/linkset');
var Meta = tortoise_require('meta');
var NLMath = tortoise_require('util/nlmath');
var NLType = tortoise_require('engine/core/typechecker');
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
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"clock":{"name":"clock","editableColorIndex":0,"rotate":true,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,128,143,143,158,158,173],"ycors":[31,75,75,150,150,75,75],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"hydrogen":{"name":"hydrogen","editableColorIndex":8,"rotate":true,"elements":[{"x":70,"y":70,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":130,"y":130,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false}]},"nh3":{"name":"nh3","editableColorIndex":0,"rotate":true,"elements":[{"x":75,"y":75,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":12,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":192,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":102,"y":198,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false}]},"nitrogen":{"name":"nitrogen","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false}]},"nothing":{"name":"nothing","editableColorIndex":0,"rotate":true,"elements":[]},"oxygen":{"name":"oxygen","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":297,"ymax":299,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    input: function(str) { return 'dummy implementation'; },
    notify: function(str) {},
    yesOrNo: function(str) { return true; }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.importExport = {
    exportOutput: function(filename) {},
    exportView: function(filename) {},
    exportFile: function(str) {
      return function(filepath) {
        var Paths = Java.type('java.nio.file.Paths');
        var Files = Java.type('java.nio.file.Files');
        var UTF8  = Java.type('java.nio.charset.StandardCharsets').UTF_8;
        Files.createDirectories(Paths.get(filepath).getParent());
        var path  = Files.write(Paths.get(filepath), str.getBytes());
      }
},
    importWorld: function(trueImportWorld) {
      return function(filename) {
        var Paths = Java.type('java.nio.file.Paths');
        var Files = Java.type('java.nio.file.Files');
        var UTF8  = Java.type('java.nio.charset.StandardCharsets').UTF_8;
        var lines = Files.readAllLines(Paths.get(filename), UTF8);
        var out   = [];
        lines.forEach(function(line) { out.push(line); });
        var fileText = out.join("\n");
        trueImportWorld(fileText);
      }
}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.world = {
    resizeWorld: function(agent) {}
  }
}
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Volume vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(25.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Volume vs. Time', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("volume"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "volume", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Pressure vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Pressure vs. Time', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (Prims.gt(ListPrims.length(world.observer.getGlobal("pressure-history")), 10)) {
            plotManager.plotPoint(world.ticker.tickCount(), ListPrims.mean(world.observer.getGlobal("pressure-history")));
          }
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
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
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Temperature vs. Time', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("temperature"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "temp.", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Number of molecules';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('H2', plotOps.makePenOps, false, new PenBundle.State(5.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of molecules', 'H2')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"); }).size());
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('N2', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of molecules', 'N2')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nitrogen"); }).size());
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('NH3', plotOps.makePenOps, false, new PenBundle.State(97.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of molecules', 'NH3')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3"); }).size());
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "number", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PARTICLES", singular: "particle", varNames: ["speed", "mass", "energy", "momentum-difference", "last-collision", "molecule-type"] }, { name: "FLASHES", singular: "flash", varNames: ["birthday"] }])([], [])('globals\n[\n  tick-advance-amount                  ;; actual tick length\n  max-tick-advance-amount              ;; the largest a tick length is allowed to be\n  box-edge-y                   ;; location of the end of the box\n  box-edge-x                   ;; location of the end of the box\n  number-forward-reactions     ;; keeps track number of forward reactions that occur\n  number-reverse-reactions     ;; keeps track number of backward reactions that occur\n  pressure                     ;; pressure at this point in time\n  pressure-history             ;; list of the last 10 pressure values\n\n  length-horizontal-surface    ;; the size of the wall surfaces that run horizontally - the top and bottom of the box - used for calculating pressure and volume\n  length-vertical-surface      ;; the size of the wall surfaces that run vertically - the left and right of the box - used for calculating pressure and volume\n  walls                        ;; agent set containing patches that are the walls of the box\n  heatable-walls               ;; the walls that could transfer heat into our out of the box when INSULATED-WALLS? is set to off\n  piston-wall                  ;; the patches of the right wall on the box (it is a moveable wall)\n  outside-energy               ;; energy level for isothermal walls\n  min-outside-energy           ;; minimum energy level for an isothermal wall\n  max-outside-energy           ;; minimum energy level for an isothermal wall\n  energy-increment             ;; the amount of energy added to or subtracted from the isothermal wall when the WARM UP WALL or COOL DOWN WALL buttons are pressed\n  piston-position              ;; xcor of piston wall\n  piston-color                 ;; color of piston\n  wall-color                   ;; color of wall\n  insulated-wall-color         ;; color of insulated walls\n  run-go?                      ;; flag of whether or not its safe for go to run - it is used to stop the simulation when the wall is moved\n  volume                       ;; volume of the box\n  scale-factor-temp-to-energy  ;; scale factor used to convert kinetic energy of particles to temperature\n  scale-factor-energy-to-temp  ;; scale factor used to convert temperature of gas convert to kinetic energy of particles\n  temperature                  ;; temperature of the gas\n  difference-bond-energies     ;; amount of energy released or absorbed in forward or reverse reaction\n  activation-energy            ;; amount of energy required to react\n  particle-size\n]\n\nbreed [ particles particle ]\nbreed [ flashes flash ]        ;; visualization of particle hits against the wall\n\nparticles-own\n[\n  speed mass energy          ;; particle info\n  momentum-difference        ;; used to calculate pressure from wall hits\n  last-collision             ;; last particle that this particle collided with\n  molecule-type              ;; type of molecule (H2, N2, or NH3)\n]\n\nflashes-own [birthday ]      ;; keeps track of when it was created (which tick)\n\npatches-own [insulated? wall?]     ;; insulated patches do not transfer energy into or out of particles\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;SETUP PROCEDURES   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\nto setup\n  clear-all\n  set run-go? true\n  set number-forward-reactions 0\n  set number-reverse-reactions 0\n\n  set scale-factor-energy-to-temp 4\n  set scale-factor-temp-to-energy (1 / scale-factor-energy-to-temp)\n  set outside-energy initial-gas-temp * scale-factor-temp-to-energy\n\n  set difference-bond-energies 20    ;; describes how much energy is lost or gained in the transition from products to reactants.\n                                     ;; a negative value states that energy is lost (endothermic) for the forward reaction\n                                     ;; a positive value states that energy is gained (exothermic) for the forward reaction\n  set activation-energy 80\n  set energy-increment 5\n  set min-outside-energy 0\n  set max-outside-energy 100\n\n  set particle-size 1.3\n  set-default-shape particles \"circle\"\n  set-default-shape flashes \"square\"\n  set piston-color green\n  set insulated-wall-color yellow\n\n\n  set max-tick-advance-amount 0.1\n  ;; box has constant size...\n  set box-edge-y (max-pycor - 1)\n  set box-edge-x (max-pxcor - 1)\n  ;;; the length of the horizontal or vertical surface of\n  ;;; the inside of the box must exclude the two patches\n  ;;; that are the where the perpendicular walls join it,\n  ;;; but must also add in the axes as an additional patch\n  ;;; example:  a box with an box-edge of 10, is drawn with\n  ;;; 19 patches of wall space on the inside of the box\n  set piston-position init-wall-position - box-edge-x\n  draw-box-piston\n  recalculate-wall-color\n  calculate-volume\n  make-particles\n  set pressure-history []  ;; plotted pressure will be averaged over the past 3 entries\n  calculate-pressure-and-temperature\n  reset-ticks\nend\n\n\nto make-particles\n  create-particles #-H2  [ setup-hydrogen-particle]\n  create-particles #-N2  [ setup-nitrogen-particle]\n  create-particles #-NH3 [ setup-ammonia-particle ]\n  calculate-tick-advance-amount\nend\n\n\nto setup-hydrogen-particle\n  set shape \"hydrogen\"\n  set molecule-type \"hydrogen\"\n  set mass 2\n  set-other-particle-attributes\nend\n\n\nto setup-nitrogen-particle\n  set size particle-size\n  set shape \"nitrogen\"\n  set molecule-type \"nitrogen\"\n  set mass 14\n  set-other-particle-attributes\nend\n\n\nto setup-ammonia-particle\n  set shape \"nh3\"\n  set molecule-type \"nh3\"\n  set mass 10\n  set-other-particle-attributes\nend\n\n\nto set-other-particle-attributes\n  set size particle-size\n  set last-collision nobody\n  set energy (initial-gas-temp * scale-factor-temp-to-energy)\n  set speed  speed-from-energy\n  random-position\nend\n\n\n;; place particle at random location inside the box.\nto random-position ;; particle procedure\n  setxy ((1 - box-edge-x)  + random-float (box-edge-x + piston-position - 3))\n        ((1 - box-edge-y) + random-float (2 * box-edge-y - 2))\n  set heading random-float 360\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; RUNTIME PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\nto go\n  if not run-go? [stop]\n  ask particles [\n    bounce\n    move\n    check-for-collision\n  ]\n\n  if forward-react? [ ask particles with [molecule-type = \"nitrogen\"]  [check-for-forward-reaction]]\n  if reverse-react? [ ask particles with [molecule-type = \"nh3\"]       [check-for-reverse-reaction]]\n\n  calculate-pressure-and-temperature\n  calculate-tick-advance-amount\n  tick-advance tick-advance-amount\n  recalculate-wall-color\n  update-plots\n  display\nend\n\n\nto calculate-tick-advance-amount\n  ifelse any? particles with [speed > 0]\n    [ set tick-advance-amount min list (1 / (ceiling max [speed] of particles)) max-tick-advance-amount ]\n    [ set tick-advance-amount max-tick-advance-amount ]\nend\n\n\nto move  ;; particle procedure\n  if patch-ahead (speed * tick-advance-amount) != patch-here\n    [ set last-collision nobody ]\n  jump (speed * tick-advance-amount)\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;VISUALIZATION PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\nto recalculate-wall-color\n  ;; scale color of walls to dark red to bright red based on their isothermal value....if the wall isn\'t insulated\n  ;; set color of walls to all insulated-wall-color if the wall is insulated\n  ifelse insulated-walls?\n     [set wall-color insulated-wall-color ]\n     [set wall-color (scale-color red outside-energy -60 (max-outside-energy + 100))]\n     ask patches with [not insulated?] [set pcolor wall-color]\n     ask flashes with [ticks - birthday > 0.4] [die ]   ;; after 0.4 ticks recolor the wall correctly and remove the flash\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CHEMICAL REACTIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto check-for-forward-reaction\n  let hit-hydrogen particles with [distance myself <= 1 and molecule-type = \"hydrogen\"]\n\n  if count hit-hydrogen >= 3 and random 2 = 0 [  ;; 50/50 chance of a reaction\n    if speed < 0 [set speed 0]\n    let reactants n-of 3 hit-hydrogen\n    let total-input-energy (energy + sum [energy] of reactants )  ;; sum the kinetic energy of the N2 molecule and the three H2 molecules\n\n    if total-input-energy > activation-energy [\n      ;; an exothermic reaction\n      let total-output-energy (total-input-energy + difference-bond-energies )\n      ;; turn this N2 molecule into an NH3 molecule\n      set molecule-type \"nh3\"\n      set shape \"nh3\"\n      set mass 10\n      set energy (total-output-energy * 10 / 20)  ;; each of the two product molecules take half the output energy, scaled to masses out / mass in\n      set speed  sqrt (2 * (energy / mass))\n      ;; and also create another NH3 molecule\n      hatch 1 [set heading (heading + 180) ]\n      ask reactants [die] ;; reactants are used up\n      set number-forward-reactions (number-forward-reactions + 1)\n    ]\n  ]\n\nend\n\n\nto check-for-reverse-reaction\n  let hit-nh3 particles with [distance myself <= 1 and molecule-type = \"nh3\" and self != myself]\n\n  if count hit-nh3 >= 1 and random 2 = 0 [  ;;50/50 chance of a reaction\n    let reactants n-of 1 hit-nh3\n    let total-input-energy (energy + sum [energy] of reactants )  ;; sum the kinetic energy of both NH3 molecules\n\n    if total-input-energy > activation-energy [\n      let total-output-energy (total-input-energy - difference-bond-energies )\n      ;; make a nitrogen molecule as the one of the products\n\n      set molecule-type \"nitrogen\"\n      set shape \"nitrogen\"\n      set mass 14\n      set energy (total-output-energy * 14 / (20))   ;; take 14/20 th of the energy (proportional to masses of all the products)\n      set speed speed-from-energy\n\n      ;; make three H2 molecules as the rest of the products\n      hatch 3 [\n        set molecule-type \"hydrogen\"\n        set shape \"hydrogen\"\n        set mass 2\n        set energy (total-output-energy * 2 / (20))  ;; take 2/20 th of the energy (proportional to masses of all the products) for each of the 3 molecules\n        set speed  speed-from-energy\n        set heading random 360\n      ]\n      ask reactants [  die ]\n      set number-reverse-reactions (number-reverse-reactions + 1)\n    ]\n  ]\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CHANGING ISOTHERMAL WALL PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto cool\n  ifelse ( outside-energy > 20 ) [ set outside-energy outside-energy - energy-increment ] [ set outside-energy 0 ]\n  if (outside-energy <= 0) [\n    set outside-energy min-outside-energy\n    user-message (word\n      \"You are currently trying to cool the walls of the container below \"\n      \"absolute zero (OK or -273C).  Absolute zero is the lowest theoretical \"\n      \"temperature for all matter in the universe and has never been \"\n      \"achieved in a real-world laboratory\")\n  ]\n  recalculate-wall-color\n  ask heatable-walls [set pcolor wall-color]\nend\n\n\nto heat\n  set outside-energy outside-energy + energy-increment\n  if (outside-energy > max-outside-energy) [\n    set outside-energy max-outside-energy\n    user-message (word \"You have reached the maximum allowable temperature for the walls of the container in this model.\" )\n  ]\n  recalculate-wall-color\n  ask heatable-walls [set pcolor wall-color]\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;; CALCULATIONS P, T, V PROCEDURES  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\n;;; Pressure is defined as the force per unit area.  In this context,\n;;; that means the total momentum per unit time transferred to the walls\n;;; by particle hits, divided by the surface area of the walls.  (Here\n;;; we\'re in a two dimensional world, so the \"surface area\" of the walls\n;;; is just their length.)  Each wall contributes a different amount\n;;; to the total pressure in the box, based on the number of collisions, the\n;;; direction of each collision, and the length of the wall.  Conservation of momentum\n;;; in hits ensures that the difference in momentum for the particles is equal to and\n;;; opposite to that for the wall.  The force on each wall is the rate of change in\n;;; momentum imparted to the wall, or the sum of change in momentum for each particle:\n;;; F = SUM  [d(mv)/dt] = SUM [m(dv/dt)] = SUM [ ma ], in a direction perpendicular to\n;;; the wall surface.  The pressure (P) on a given wall is the force (F) applied to that\n;;; wall over its surface area.  The total pressure in the box is sum of each wall\'s\n;;; pressure contribution.\n\nto calculate-pressure-and-temperature\n  ;; by summing the momentum change for each particle,\n  ;; the wall\'s total momentum change is calculated\n  set pressure 15 * sum [momentum-difference] of particles\n  ifelse length pressure-history > 10\n    [ set pressure-history lput pressure but-first pressure-history]\n    [ set pressure-history lput pressure pressure-history]\n  ask particles [ set momentum-difference 0]  ;; once the contribution to momentum has been calculated\n                                              ;; this value is reset to zero till the next wall hit\n\n if any? particles [ set temperature (mean [energy] of particles  * scale-factor-energy-to-temp) ]\nend\n\n\nto calculate-volume\n  set length-horizontal-surface  ( 2 * (box-edge-x - 1) + 1) - (abs (piston-position - box-edge-x))\n  set length-vertical-surface  ( 2 * (box-edge-y - 1) + 1)\n  set volume (length-horizontal-surface * length-vertical-surface * 1)  ;;depth of 1\nend\n\nto reset-reaction-counters\n  set number-forward-reactions 0\n  set number-reverse-reactions 0\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;; PARTICLES BOUNCING OFF THE WALLS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto bounce  ;; particle procedure\n  let new-patch 0\n  let new-px 0\n  let new-py 0\n\n  ;; get the coordinates of the patch we\'ll be on if we go forward 1\n  if (not wall? and [not wall?] of patch-at dx dy)\n    [stop]\n  ;; get the coordinates of the patch we\'ll be on if we go forward 1\n  set new-px round (xcor + dx)\n  set new-py round (ycor + dy)\n  ;; if hitting left wall or piston (on right), reflect heading around x axis\n  if ((abs new-px = box-edge-x or new-px = piston-position))\n    [\n      set heading (- heading)\n  ;;  if the particle is hitting a vertical wall, only the horizontal component of the speed\n  ;;  vector can change.  The change in velocity for this component is 2 * the speed of the particle,\n  ;; due to the reversing of direction of travel from the collision with the wall\n      set momentum-difference momentum-difference + (abs (sin heading * 2 * mass * speed) / length-vertical-surface) ]\n  ;; if hitting top or bottom wall, reflect heading around y axis\n  if (abs new-py = box-edge-y)\n    [ set heading (180 - heading)\n  ;;  if the particle is hitting a horizontal wall, only the vertical component of the speed\n  ;;  vector can change.  The change in velocity for this component is 2 * the speed of the particle,\n  ;; due to the reversing of direction of travel from the collision with the wall\n      set momentum-difference momentum-difference + (abs (cos heading * 2 * mass * speed) / length-horizontal-surface)  ]\n\n  if [isothermal-wall?] of patch new-px new-py  [ ;; check if the patch ahead of us is isothermal\n     set energy ((energy +  outside-energy ) / 2)\n     set speed speed-from-energy\n  ]\n\n\n   ask patch new-px new-py [ make-a-flash ]\nend\n\nto make-a-flash\n      sprout 1 [\n      set breed flashes\n      set birthday ticks\n      set color [0 0 0 100]\n    ]\nend\n\n\n\n\n\nto check-for-collision  ;; particle procedure\n  let candidate 0\n\n  if count other particles-here = 1\n  [\n    ;; the following conditions are imposed on collision candidates:\n    ;;   1. they must have a lower who number than my own, because collision\n    ;;      code is asymmetrical: it must always happen from the point of view\n    ;;      of just one particle.\n    ;;   2. they must not be the same particle that we last collided with on\n    ;;      this patch, so that we have a chance to leave the patch after we\'ve\n    ;;      collided with someone.\n    set candidate one-of other particles-here with\n      [self < myself and myself != last-collision]\n    ;; we also only collide if one of us has non-zero speed. It\'s useless\n    ;; (and incorrect, actually) for two particles with zero speed to collide.\n   if (candidate != nobody) and (speed > 0 or [speed] of candidate > 0)\n    [\n      collide-with candidate\n      set last-collision candidate\n      ask candidate [ set last-collision myself ]\n    ]\n  ]\nend\n\n\n\n\n;; implements a collision with another particle.\n;;\n;; The two particles colliding are self and other-particle, and while the\n;; collision is performed from the point of view of self, both particles are\n;; modified to reflect its effects. This is somewhat complicated, so I\'ll\n;; give a general outline here:\n;;   1. Do initial setup, and determine the heading between particle centers\n;;      (call it theta).\n;;   2. Convert the representation of the velocity of each particle from\n;;      speed/heading to a theta-based vector whose first component is the\n;;      particle\'s speed along theta, and whose second component is the speed\n;;      perpendicular to theta.\n;;   3. Modify the velocity vectors to reflect the effects of the collision.\n;;      This involves:\n;;        a. computing the velocity of the center of mass of the whole system\n;;           along direction theta\n;;        b. updating the along-theta components of the two velocity vectors.\n;;   4. Convert from the theta-based vector representation of velocity back to\n;;      the usual speed/heading representation for each particle.\n;;   5. Perform final cleanup and update derived quantities.\nto collide-with [ other-particle ] ;; particle procedure\n  let mass2 0\n  let speed2 0\n  let heading2 0\n  let theta 0\n  let v1t 0\n  let v1l 0\n  let v2t 0\n  let v2l 0\n  let vcm 0\n\n\n  ;;; PHASE 1: initial setup\n\n  ;; for convenience, grab some quantities from other-particle\n  set mass2 [mass] of other-particle\n  set speed2 [speed] of other-particle\n  set heading2 [heading] of other-particle\n\n  ;; since particles are modeled as zero-size points, theta isn\'t meaningfully\n  ;; defined. we can assign it randomly without affecting the model\'s outcome.\n  set theta (random-float 360)\n\n\n\n  ;;; PHASE 2: convert velocities to theta-based vector representation\n\n  ;; now convert my velocity from speed/heading representation to components\n  ;; along theta and perpendicular to theta\n  set v1t (speed * cos (theta - heading))\n  set v1l (speed * sin (theta - heading))\n\n  ;; do the same for other-particle\n  set v2t (speed2 * cos (theta - heading2))\n  set v2l (speed2 * sin (theta - heading2))\n\n\n\n  ;;; PHASE 3: manipulate vectors to implement collision\n\n  ;; compute the velocity of the system\'s center of mass along theta\n  set vcm (((mass * v1t) + (mass2 * v2t)) / (mass + mass2) )\n\n  ;; now compute the new velocity for each particle along direction theta.\n  ;; velocity perpendicular to theta is unaffected by a collision along theta,\n  ;; so the next two lines actually implement the collision itself, in the\n  ;; sense that the effects of the collision are exactly the following changes\n  ;; in particle velocity.\n  set v1t (2 * vcm - v1t)\n  set v2t (2 * vcm - v2t)\n\n\n\n  ;;; PHASE 4: convert back to normal speed/heading\n\n  ;; now convert my velocity vector into my new speed and heading\n  set speed sqrt ((v1t ^ 2) + (v1l ^ 2))\n  set energy (0.5 * mass * (speed ^ 2))\n  ;; if the magnitude of the velocity vector is 0, atan is undefined. but\n  ;; speed will be 0, so heading is irrelevant anyway. therefore, in that\n  ;; case we\'ll just leave it unmodified.\n  if v1l != 0 or v1t != 0\n    [ set heading (theta - (atan v1l v1t)) ]\n\n  ;; and do the same for other-particle\n  ask other-particle [\n    set speed sqrt ((v2t ^ 2) + (v2l ^ 2))\n    set energy (0.5 * mass * (speed ^ 2))\n    if v2l != 0 or v2t != 0\n      [ set heading (theta - (atan v2l v2t)) ]\n  ]\nend\n\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; Moveable wall procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\n\nto check-move-piston\n set run-go? false\n  if ((mouse-down?) and (mouse-ycor < (max-pycor - 1))) [\n   ;;note: if user clicks too far to the right, nothing will happen\n    if (mouse-xcor >= piston-position and mouse-xcor < box-edge-x - 2)  [ piston-out ceiling (mouse-xcor - piston-position) ]\n    set run-go? true\n    stop\n  ]\nend\n\n\nto piston-out [dist]\n  if (dist > 0) [\n    ifelse ((piston-position + dist) < box-edge-x - 1)\n    [  undraw-piston\n      set piston-position (piston-position + dist)\n      draw-box-piston ]\n    [ undraw-piston\n      set piston-position (box-edge-x - 1)\n      draw-box-piston ]\n    calculate-volume\n  ]\nend\n\n\nto draw-box-piston\n  ask patches [set insulated? true set wall? false]\n  set heatable-walls patches with [ ((pxcor = -1 * box-edge-x) and (abs pycor <= box-edge-y)) or\n                     ((abs pycor = box-edge-y) and (pxcor <= piston-position) and (abs pxcor <= box-edge-x)) ]\n  ask heatable-walls  [ set pcolor wall-color set insulated? false  set wall? true]\n\n  set piston-wall patches with [ ((pxcor = (round piston-position)) and ((abs pycor) < box-edge-y)) ]\n  ask piston-wall  [ set pcolor piston-color set wall? true]\n  ;; make sides of box that are to right right of the piston grey\n\n\n\n  ask patches with [(pxcor > (round piston-position)) and (abs (pxcor) < box-edge-x) and ((abs pycor) = box-edge-y)]\n    [set pcolor grey set wall? true]\n  ask patches with [ ((pxcor = ( box-edge-x)) and (abs pycor <= box-edge-y))]\n    [set pcolor grey set wall? true]\nend\n\n\nto undraw-piston\n  ask patches with [ (pxcor = round piston-position) and ((abs pycor) < box-edge-y) ]\n    [ set pcolor black ]\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;REPORTERS;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto-report speed-from-energy\n  report sqrt (2 * energy / mass)\nend\n\n\nto-report energy-from-speed\n  report (mass * speed * speed / 2)\nend\n\n\n;; reports true if there wall is at a fixed temperature\nto-report isothermal-wall?\n  report\n    (( abs pxcor = -1 * box-edge-x) and (abs pycor <= box-edge-y)) or\n    ((abs pycor = box-edge-y) and (abs pxcor <= box-edge-x)) and\n    not insulated? and\n    not insulated-walls?\nend\n\n\n; Copyright 2012 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":485,"top":10,"right":1013,"bottom":427,"dimensions":{"minPxcor":-32,"maxPxcor":32,"minPycor":-25,"maxPycor":25,"patchSize":8,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":95,"top":10,"right":195,"bottom":43,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":5,"top":10,"right":95,"bottom":43,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"5","compiledMax":"60","compiledStep":"1","variable":"init-wall-position","left":534,"top":455,"right":988,"bottom":488,"display":"init-wall-position","min":"5","max":"60","default":6,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_50 = procedures[\"CHECK-MOVE-PISTON\"]();\n  if (_maybestop_33_50 instanceof Exception.StopInterrupt) { return _maybestop_33_50; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"check-move-piston","left":140,"top":425,"right":285,"bottom":458,"display":"move wall out","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Volume vs. Time', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"volume\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks volume","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Volume vs. Time","left":285,"top":370,"right":485,"bottom":490,"xAxis":"time","yAxis":"volume","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks volume","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Pressure vs. Time', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        if (Prims.gt(ListPrims.length(world.observer.getGlobal(\"pressure-history\")), 10)) {\n          plotManager.plotPoint(world.ticker.tickCount(), ListPrims.mean(world.observer.getGlobal(\"pressure-history\")));\n        }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if length pressure-history > 10\n    [ plotxy ticks (mean pressure-history) ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Pressure vs. Time","left":285,"top":130,"right":485,"bottom":250,"xAxis":"time","yAxis":"press.","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if length pressure-history > 10\n    [ plotxy ticks (mean pressure-history) ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Temperature vs. Time', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"temperature\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks temperature","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Temperature vs. Time","left":285,"top":250,"right":485,"bottom":370,"xAxis":"time","yAxis":"temp.","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks temperature","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"1","variable":"#-N2","left":5,"top":85,"right":97,"bottom":118,"display":"#-N2","min":"0","max":"200","default":0,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"5","variable":"#-H2","left":5,"top":130,"right":100,"bottom":163,"display":"#-H2","min":"0","max":"200","default":0,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"400","compiledStep":"5","variable":"initial-gas-temp","left":5,"top":45,"right":195,"bottom":78,"display":"initial-gas-temp","min":"0","max":"400","default":90,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"hydrogen\"); }).size()","source":"count particles with [molecule-type = \"hydrogen\"]","left":100,"top":125,"right":195,"bottom":170,"display":"H2 molecules","precision":1,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"nitrogen\"); }).size()","source":"count particles with [molecule-type = \"nitrogen\"]","left":100,"top":80,"right":195,"bottom":125,"display":"N2 molecules","precision":1,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"nh3\"); }).size()","source":"count particles with [molecule-type = \"nh3\"]","left":100,"top":170,"right":195,"bottom":215,"display":"NH3 molecules","precision":1,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"forward-react?","left":5,"top":235,"right":135,"bottom":268,"display":"forward-react?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"reverse-react?","left":5,"top":340,"right":136,"bottom":373,"display":"reverse-react?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Number of molecules', 'H2')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"hydrogen\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"H2","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"hydrogen\"])","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Number of molecules', 'N2')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"nitrogen\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"N2","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"nitrogen\"])","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Number of molecules', 'NH3')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"nh3\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"NH3","interval":1,"mode":0,"color":-8275240,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"nh3\"])","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Number of molecules","left":205,"top":10,"right":485,"bottom":130,"xAxis":"time","yAxis":"number","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"H2","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"hydrogen\"])","type":"pen"},{"display":"N2","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"nitrogen\"])","type":"pen"},{"display":"NH3","interval":1,"mode":0,"color":-8275240,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"nh3\"])","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"Prims.div((100 * world.observer.getGlobal(\"number-forward-reactions\")), (world.observer.getGlobal(\"number-forward-reactions\") + world.observer.getGlobal(\"number-reverse-reactions\")))","source":"100 * number-forward-reactions / (number-forward-reactions + number-reverse-reactions)","left":5,"top":270,"right":134,"bottom":315,"display":"% forward reaction","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"Prims.div((100 * world.observer.getGlobal(\"number-reverse-reactions\")), (world.observer.getGlobal(\"number-forward-reactions\") + world.observer.getGlobal(\"number-reverse-reactions\")))","source":"100 * number-reverse-reactions / (number-forward-reactions + number-reverse-reactions)","left":5,"top":375,"right":135,"bottom":420,"display":"% reverse reactions","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"N2 + 3H2 --> 2NH3","left":15,"top":220,"right":130,"bottom":240,"fontSize":11,"color":105,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"N2 + 3H2 <-- 2NH3","left":15,"top":320,"right":135,"bottom":354,"fontSize":11,"color":123,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"1","variable":"#-NH3","left":5,"top":175,"right":97,"bottom":208,"display":"#-NH3","min":"0","max":"200","default":200,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_56 = procedures[\"RESET-REACTION-COUNTERS\"]();\n  if (_maybestop_33_56 instanceof Exception.StopInterrupt) { return _maybestop_33_56; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"reset-reaction-counters","left":5,"top":425,"right":140,"bottom":458,"display":"reset reaction counters","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"insulated-walls?","left":140,"top":280,"right":285,"bottom":313,"display":"insulated-walls?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_37 = procedures[\"HEAT\"]();\n  if (_maybestop_33_37 instanceof Exception.StopInterrupt) { return _maybestop_33_37; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"heat","left":140,"top":315,"right":285,"bottom":348,"display":"warm walls","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_37 = procedures[\"COOL\"]();\n  if (_maybestop_33_37 instanceof Exception.StopInterrupt) { return _maybestop_33_37; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"cool","left":140,"top":350,"right":285,"bottom":383,"display":"cool walls","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["init-wall-position", "#-n2", "#-h2", "initial-gas-temp", "forward-react?", "reverse-react?", "#-nh3", "insulated-walls?", "tick-advance-amount", "max-tick-advance-amount", "box-edge-y", "box-edge-x", "number-forward-reactions", "number-reverse-reactions", "pressure", "pressure-history", "length-horizontal-surface", "length-vertical-surface", "walls", "heatable-walls", "piston-wall", "outside-energy", "min-outside-energy", "max-outside-energy", "energy-increment", "piston-position", "piston-color", "wall-color", "insulated-wall-color", "run-go?", "volume", "scale-factor-temp-to-energy", "scale-factor-energy-to-temp", "temperature", "difference-bond-energies", "activation-energy", "particle-size"], ["init-wall-position", "#-n2", "#-h2", "initial-gas-temp", "forward-react?", "reverse-react?", "#-nh3", "insulated-walls?"], ["insulated?", "wall?"], -32, 32, -25, 25, 8.0, true, true, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
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
  var procs = {};
  var temp = undefined;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      world.observer.setGlobal("run-go?", true);
      world.observer.setGlobal("number-forward-reactions", 0);
      world.observer.setGlobal("number-reverse-reactions", 0);
      world.observer.setGlobal("scale-factor-energy-to-temp", 4);
      world.observer.setGlobal("scale-factor-temp-to-energy", Prims.div(1, world.observer.getGlobal("scale-factor-energy-to-temp")));
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
      procedures["DRAW-BOX-PISTON"]();
      procedures["RECALCULATE-WALL-COLOR"]();
      procedures["CALCULATE-VOLUME"]();
      procedures["MAKE-PARTICLES"]();
      world.observer.setGlobal("pressure-history", []);
      procedures["CALCULATE-PRESSURE-AND-TEMPERATURE"]();
      world.ticker.reset();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setup"] = temp;
  procs["SETUP"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(world.observer.getGlobal("#-h2"), "PARTICLES").ask(function() { procedures["SETUP-HYDROGEN-PARTICLE"](); }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("#-n2"), "PARTICLES").ask(function() { procedures["SETUP-NITROGEN-PARTICLE"](); }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("#-nh3"), "PARTICLES").ask(function() { procedures["SETUP-AMMONIA-PARTICLE"](); }, true);
      procedures["CALCULATE-TICK-ADVANCE-AMOUNT"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeParticles"] = temp;
  procs["MAKE-PARTICLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("shape", "hydrogen");
      SelfManager.self().setVariable("molecule-type", "hydrogen");
      SelfManager.self().setVariable("mass", 2);
      procedures["SET-OTHER-PARTICLE-ATTRIBUTES"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupHydrogenParticle"] = temp;
  procs["SETUP-HYDROGEN-PARTICLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("size", world.observer.getGlobal("particle-size"));
      SelfManager.self().setVariable("shape", "nitrogen");
      SelfManager.self().setVariable("molecule-type", "nitrogen");
      SelfManager.self().setVariable("mass", 14);
      procedures["SET-OTHER-PARTICLE-ATTRIBUTES"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupNitrogenParticle"] = temp;
  procs["SETUP-NITROGEN-PARTICLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("shape", "nh3");
      SelfManager.self().setVariable("molecule-type", "nh3");
      SelfManager.self().setVariable("mass", 10);
      procedures["SET-OTHER-PARTICLE-ATTRIBUTES"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupAmmoniaParticle"] = temp;
  procs["SETUP-AMMONIA-PARTICLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("size", world.observer.getGlobal("particle-size"));
      SelfManager.self().setVariable("last-collision", Nobody);
      SelfManager.self().setVariable("energy", (world.observer.getGlobal("initial-gas-temp") * world.observer.getGlobal("scale-factor-temp-to-energy")));
      SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
      procedures["RANDOM-POSITION"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setOtherParticleAttributes"] = temp;
  procs["SET-OTHER-PARTICLE-ATTRIBUTES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setXY(((1 - world.observer.getGlobal("box-edge-x")) + Prims.randomFloat(((world.observer.getGlobal("box-edge-x") + world.observer.getGlobal("piston-position")) - 3))), ((1 - world.observer.getGlobal("box-edge-y")) + Prims.randomFloat(((2 * world.observer.getGlobal("box-edge-y")) - 2))));
      SelfManager.self().setVariable("heading", Prims.randomFloat(360));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["randomPosition"] = temp;
  procs["RANDOM-POSITION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!world.observer.getGlobal("run-go?")) {
        throw new Exception.StopInterrupt;
      }
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
        procedures["BOUNCE"]();
        procedures["MOVE"]();
        procedures["CHECK-FOR-COLLISION"]();
      }, true);
      if (world.observer.getGlobal("forward-react?")) {
        world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nitrogen"); }).ask(function() { procedures["CHECK-FOR-FORWARD-REACTION"](); }, true);
      }
      if (world.observer.getGlobal("reverse-react?")) {
        world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3"); }).ask(function() { procedures["CHECK-FOR-REVERSE-REACTION"](); }, true);
      }
      procedures["CALCULATE-PRESSURE-AND-TEMPERATURE"]();
      procedures["CALCULATE-TICK-ADVANCE-AMOUNT"]();
      world.ticker.tickAdvance(world.observer.getGlobal("tick-advance-amount"));
      procedures["RECALCULATE-WALL-COLOR"]();
      plotManager.updatePlots();
      notImplemented('display', undefined)();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("speed"), 0); }).isEmpty()) {
        world.observer.setGlobal("tick-advance-amount", ListPrims.min(ListPrims.list(Prims.div(1, NLMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })))), world.observer.getGlobal("max-tick-advance-amount"))));
      }
      else {
        world.observer.setGlobal("tick-advance-amount", world.observer.getGlobal("max-tick-advance-amount"));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["calculateTickAdvanceAmount"] = temp;
  procs["CALCULATE-TICK-ADVANCE-AMOUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!Prims.equality(SelfManager.self().patchAhead((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-advance-amount"))), SelfManager.self().getPatchHere())) {
        SelfManager.self().setVariable("last-collision", Nobody);
      }
      SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-advance-amount")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["move"] = temp;
  procs["MOVE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (world.observer.getGlobal("insulated-walls?")) {
        world.observer.setGlobal("wall-color", world.observer.getGlobal("insulated-wall-color"));
      }
      else {
        world.observer.setGlobal("wall-color", ColorModel.scaleColor(15, world.observer.getGlobal("outside-energy"), -60, (world.observer.getGlobal("max-outside-energy") + 100)));
      }
      world.patches().agentFilter(function() { return !SelfManager.self().getPatchVariable("insulated?"); }).ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
      world.turtleManager.turtlesOfBreed("FLASHES").agentFilter(function() { return Prims.gt((world.ticker.tickCount() - SelfManager.self().getVariable("birthday")), 0.4); }).ask(function() { SelfManager.self().die(); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["recalculateWallColor"] = temp;
  procs["RECALCULATE-WALL-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let hitHydrogen = world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
        return (Prims.lte(SelfManager.self().distance(SelfManager.myself()), 1) && Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"));
      }); letVars['hitHydrogen'] = hitHydrogen;
      if ((Prims.gte(hitHydrogen.size(), 3) && Prims.equality(Prims.random(2), 0))) {
        if (Prims.lt(SelfManager.self().getVariable("speed"), 0)) {
          SelfManager.self().setVariable("speed", 0);
        }
        let reactants = ListPrims.nOf(3, hitHydrogen); letVars['reactants'] = reactants;
        let totalInputEnergy = (SelfManager.self().getVariable("energy") + ListPrims.sum(reactants.projectionBy(function() { return SelfManager.self().getVariable("energy"); }))); letVars['totalInputEnergy'] = totalInputEnergy;
        if (Prims.gt(totalInputEnergy, world.observer.getGlobal("activation-energy"))) {
          let totalOutputEnergy = (totalInputEnergy + world.observer.getGlobal("difference-bond-energies")); letVars['totalOutputEnergy'] = totalOutputEnergy;
          SelfManager.self().setVariable("molecule-type", "nh3");
          SelfManager.self().setVariable("shape", "nh3");
          SelfManager.self().setVariable("mass", 10);
          SelfManager.self().setVariable("energy", Prims.div((totalOutputEnergy * 10), 20));
          SelfManager.self().setVariable("speed", NLMath.sqrt((2 * Prims.div(SelfManager.self().getVariable("energy"), SelfManager.self().getVariable("mass")))));
          SelfManager.self().hatch(1, "").ask(function() { SelfManager.self().setVariable("heading", (SelfManager.self().getVariable("heading") + 180)); }, true);
          reactants.ask(function() { SelfManager.self().die(); }, true);
          world.observer.setGlobal("number-forward-reactions", (world.observer.getGlobal("number-forward-reactions") + 1));
        }
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["checkForForwardReaction"] = temp;
  procs["CHECK-FOR-FORWARD-REACTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let hitNh3 = world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
        return ((Prims.lte(SelfManager.self().distance(SelfManager.myself()), 1) && Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3")) && !Prims.equality(SelfManager.self(), SelfManager.myself()));
      }); letVars['hitNh3'] = hitNh3;
      if ((Prims.gte(hitNh3.size(), 1) && Prims.equality(Prims.random(2), 0))) {
        let reactants = ListPrims.nOf(1, hitNh3); letVars['reactants'] = reactants;
        let totalInputEnergy = (SelfManager.self().getVariable("energy") + ListPrims.sum(reactants.projectionBy(function() { return SelfManager.self().getVariable("energy"); }))); letVars['totalInputEnergy'] = totalInputEnergy;
        if (Prims.gt(totalInputEnergy, world.observer.getGlobal("activation-energy"))) {
          let totalOutputEnergy = (totalInputEnergy - world.observer.getGlobal("difference-bond-energies")); letVars['totalOutputEnergy'] = totalOutputEnergy;
          SelfManager.self().setVariable("molecule-type", "nitrogen");
          SelfManager.self().setVariable("shape", "nitrogen");
          SelfManager.self().setVariable("mass", 14);
          SelfManager.self().setVariable("energy", Prims.div((totalOutputEnergy * 14), 20));
          SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
          SelfManager.self().hatch(3, "").ask(function() {
            SelfManager.self().setVariable("molecule-type", "hydrogen");
            SelfManager.self().setVariable("shape", "hydrogen");
            SelfManager.self().setVariable("mass", 2);
            SelfManager.self().setVariable("energy", Prims.div((totalOutputEnergy * 2), 20));
            SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
            SelfManager.self().setVariable("heading", Prims.random(360));
          }, true);
          reactants.ask(function() { SelfManager.self().die(); }, true);
          world.observer.setGlobal("number-reverse-reactions", (world.observer.getGlobal("number-reverse-reactions") + 1));
        }
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["checkForReverseReaction"] = temp;
  procs["CHECK-FOR-REVERSE-REACTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(world.observer.getGlobal("outside-energy"), 20)) {
        world.observer.setGlobal("outside-energy", (world.observer.getGlobal("outside-energy") - world.observer.getGlobal("energy-increment")));
      }
      else {
        world.observer.setGlobal("outside-energy", 0);
      }
      if (Prims.lte(world.observer.getGlobal("outside-energy"), 0)) {
        world.observer.setGlobal("outside-energy", world.observer.getGlobal("min-outside-energy"));
        UserDialogPrims.confirm((workspace.dump('') + workspace.dump("You are currently trying to cool the walls of the container below ") + workspace.dump("absolute zero (OK or -273C).  Absolute zero is the lowest theoretical ") + workspace.dump("temperature for all matter in the universe and has never been ") + workspace.dump("achieved in a real-world laboratory")));
      }
      procedures["RECALCULATE-WALL-COLOR"]();
      world.observer.getGlobal("heatable-walls").ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["cool"] = temp;
  procs["COOL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("outside-energy", (world.observer.getGlobal("outside-energy") + world.observer.getGlobal("energy-increment")));
      if (Prims.gt(world.observer.getGlobal("outside-energy"), world.observer.getGlobal("max-outside-energy"))) {
        world.observer.setGlobal("outside-energy", world.observer.getGlobal("max-outside-energy"));
        UserDialogPrims.confirm((workspace.dump('') + workspace.dump("You have reached the maximum allowable temperature for the walls of the container in this model.")));
      }
      procedures["RECALCULATE-WALL-COLOR"]();
      world.observer.getGlobal("heatable-walls").ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["heat"] = temp;
  procs["HEAT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("pressure", (15 * ListPrims.sum(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("momentum-difference"); }))));
      if (Prims.gt(ListPrims.length(world.observer.getGlobal("pressure-history")), 10)) {
        world.observer.setGlobal("pressure-history", ListPrims.lput(world.observer.getGlobal("pressure"), ListPrims.butFirst(world.observer.getGlobal("pressure-history"))));
      }
      else {
        world.observer.setGlobal("pressure-history", ListPrims.lput(world.observer.getGlobal("pressure"), world.observer.getGlobal("pressure-history")));
      }
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { SelfManager.self().setVariable("momentum-difference", 0); }, true);
      if (!world.turtleManager.turtlesOfBreed("PARTICLES").isEmpty()) {
        world.observer.setGlobal("temperature", (ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("energy"); })) * world.observer.getGlobal("scale-factor-energy-to-temp")));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["calculatePressureAndTemperature"] = temp;
  procs["CALCULATE-PRESSURE-AND-TEMPERATURE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("length-horizontal-surface", (((2 * (world.observer.getGlobal("box-edge-x") - 1)) + 1) - NLMath.abs((world.observer.getGlobal("piston-position") - world.observer.getGlobal("box-edge-x")))));
      world.observer.setGlobal("length-vertical-surface", ((2 * (world.observer.getGlobal("box-edge-y") - 1)) + 1));
      world.observer.setGlobal("volume", ((world.observer.getGlobal("length-horizontal-surface") * world.observer.getGlobal("length-vertical-surface")) * 1));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["calculateVolume"] = temp;
  procs["CALCULATE-VOLUME"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("number-forward-reactions", 0);
      world.observer.setGlobal("number-reverse-reactions", 0);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["resetReactionCounters"] = temp;
  procs["RESET-REACTION-COUNTERS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let newPatch = 0; letVars['newPatch'] = newPatch;
      let newPx = 0; letVars['newPx'] = newPx;
      let newPy = 0; letVars['newPy'] = newPy;
      if ((!SelfManager.self().getPatchVariable("wall?") && SelfManager.self().patchAt(SelfManager.self().dx(), SelfManager.self().dy()).projectionBy(function() { return !SelfManager.self().getPatchVariable("wall?"); }))) {
        throw new Exception.StopInterrupt;
      }
      newPx = NLMath.round((SelfManager.self().getVariable("xcor") + SelfManager.self().dx())); letVars['newPx'] = newPx;
      newPy = NLMath.round((SelfManager.self().getVariable("ycor") + SelfManager.self().dy())); letVars['newPy'] = newPy;
      if ((Prims.equality(NLMath.abs(newPx), world.observer.getGlobal("box-edge-x")) || Prims.equality(newPx, world.observer.getGlobal("piston-position")))) {
        SelfManager.self().setVariable("heading",  -SelfManager.self().getVariable("heading"));
        SelfManager.self().setVariable("momentum-difference", (SelfManager.self().getVariable("momentum-difference") + Prims.div(NLMath.abs((((NLMath.sin(SelfManager.self().getVariable("heading")) * 2) * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed"))), world.observer.getGlobal("length-vertical-surface"))));
      }
      if (Prims.equality(NLMath.abs(newPy), world.observer.getGlobal("box-edge-y"))) {
        SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading")));
        SelfManager.self().setVariable("momentum-difference", (SelfManager.self().getVariable("momentum-difference") + Prims.div(NLMath.abs((((NLMath.cos(SelfManager.self().getVariable("heading")) * 2) * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed"))), world.observer.getGlobal("length-horizontal-surface"))));
      }
      if (world.getPatchAt(newPx, newPy).projectionBy(function() { return procedures["ISOTHERMAL-WALL?"](); })) {
        SelfManager.self().setVariable("energy", Prims.div((SelfManager.self().getVariable("energy") + world.observer.getGlobal("outside-energy")), 2));
        SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
      }
      world.getPatchAt(newPx, newPy).ask(function() { procedures["MAKE-A-FLASH"](); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["bounce"] = temp;
  procs["BOUNCE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().sprout(1, "TURTLES").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FLASHES"));
        SelfManager.self().setVariable("birthday", world.ticker.tickCount());
        SelfManager.self().setVariable("color", [0, 0, 0, 100]);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeAFlash"] = temp;
  procs["MAKE-A-FLASH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let candidate = 0; letVars['candidate'] = candidate;
      if (Prims.equality(SelfPrims._optimalCountOther(SelfManager.self().breedHere("PARTICLES")), 1)) {
        candidate = ListPrims.oneOf(SelfManager.self().breedHere("PARTICLES")._optimalOtherWith(function() {
          return (Prims.lt(SelfManager.self(), SelfManager.myself()) && !Prims.equality(SelfManager.myself(), SelfManager.self().getVariable("last-collision")));
        })); letVars['candidate'] = candidate;
        if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfManager.self().getVariable("speed"), 0) || Prims.gt(candidate.projectionBy(function() { return SelfManager.self().getVariable("speed"); }), 0)))) {
          procedures["COLLIDE-WITH"](candidate);
          SelfManager.self().setVariable("last-collision", candidate);
          candidate.ask(function() { SelfManager.self().setVariable("last-collision", SelfManager.myself()); }, true);
        }
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["checkForCollision"] = temp;
  procs["CHECK-FOR-COLLISION"] = temp;
  temp = (function(otherParticle) {
    try {
      var reporterContext = false;
      var letVars = { };
      let mass2 = 0; letVars['mass2'] = mass2;
      let speed2 = 0; letVars['speed2'] = speed2;
      let heading2 = 0; letVars['heading2'] = heading2;
      let theta = 0; letVars['theta'] = theta;
      let v1t = 0; letVars['v1t'] = v1t;
      let v1l = 0; letVars['v1l'] = v1l;
      let v2t = 0; letVars['v2t'] = v2t;
      let v2l = 0; letVars['v2l'] = v2l;
      let vcm = 0; letVars['vcm'] = vcm;
      mass2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("mass"); }); letVars['mass2'] = mass2;
      speed2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("speed"); }); letVars['speed2'] = speed2;
      heading2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("heading"); }); letVars['heading2'] = heading2;
      theta = Prims.randomFloat(360); letVars['theta'] = theta;
      v1t = (SelfManager.self().getVariable("speed") * NLMath.cos((theta - SelfManager.self().getVariable("heading")))); letVars['v1t'] = v1t;
      v1l = (SelfManager.self().getVariable("speed") * NLMath.sin((theta - SelfManager.self().getVariable("heading")))); letVars['v1l'] = v1l;
      v2t = (speed2 * NLMath.cos((theta - heading2))); letVars['v2t'] = v2t;
      v2l = (speed2 * NLMath.sin((theta - heading2))); letVars['v2l'] = v2l;
      vcm = Prims.div(((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)), (SelfManager.self().getVariable("mass") + mass2)); letVars['vcm'] = vcm;
      v1t = ((2 * vcm) - v1t); letVars['v1t'] = v1t;
      v2t = ((2 * vcm) - v2t); letVars['v2t'] = v2t;
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["collideWith"] = temp;
  procs["COLLIDE-WITH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("run-go?", false);
      if ((MousePrims.isDown() && Prims.lt(MousePrims.getY(), (world.topology.maxPycor - 1)))) {
        if ((Prims.gte(MousePrims.getX(), world.observer.getGlobal("piston-position")) && Prims.lt(MousePrims.getX(), (world.observer.getGlobal("box-edge-x") - 2)))) {
          procedures["PISTON-OUT"](NLMath.ceil((MousePrims.getX() - world.observer.getGlobal("piston-position"))));
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
  });
  procs["checkMovePiston"] = temp;
  procs["CHECK-MOVE-PISTON"] = temp;
  temp = (function(dist) {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(dist, 0)) {
        if (Prims.lt((world.observer.getGlobal("piston-position") + dist), (world.observer.getGlobal("box-edge-x") - 1))) {
          procedures["UNDRAW-PISTON"]();
          world.observer.setGlobal("piston-position", (world.observer.getGlobal("piston-position") + dist));
          procedures["DRAW-BOX-PISTON"]();
        }
        else {
          procedures["UNDRAW-PISTON"]();
          world.observer.setGlobal("piston-position", (world.observer.getGlobal("box-edge-x") - 1));
          procedures["DRAW-BOX-PISTON"]();
        }
        procedures["CALCULATE-VOLUME"]();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["pistonOut"] = temp;
  procs["PISTON-OUT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["drawBoxPiston"] = temp;
  procs["DRAW-BOX-PISTON"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.patches().agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), NLMath.round(world.observer.getGlobal("piston-position"))) && Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
      }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["undrawPiston"] = temp;
  procs["UNDRAW-PISTON"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return NLMath.sqrt(Prims.div((2 * SelfManager.self().getVariable("energy")), SelfManager.self().getVariable("mass")))
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
     if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["speedFromEnergy"] = temp;
  procs["SPEED-FROM-ENERGY"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(((SelfManager.self().getVariable("mass") * SelfManager.self().getVariable("speed")) * SelfManager.self().getVariable("speed")), 2)
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
     if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["energyFromSpeed"] = temp;
  procs["ENERGY-FROM-SPEED"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return ((((Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (-1 * world.observer.getGlobal("box-edge-x"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y"))) || (Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge-x")))) && !SelfManager.self().getPatchVariable("insulated?")) && !world.observer.getGlobal("insulated-walls?"))
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
     if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["isothermalWall_p"] = temp;
  procs["ISOTHERMAL-WALL?"] = temp;
  return procs;
})();
world.observer.setGlobal("init-wall-position", 6);
world.observer.setGlobal("#-n2", 0);
world.observer.setGlobal("#-h2", 0);
world.observer.setGlobal("initial-gas-temp", 90);
world.observer.setGlobal("forward-react?", true);
world.observer.setGlobal("reverse-react?", true);
world.observer.setGlobal("#-nh3", 200);
world.observer.setGlobal("insulated-walls?", true);
