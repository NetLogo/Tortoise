var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Errors = tortoise_require('util/errors');
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

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"clock":{"name":"clock","editableColorIndex":0,"rotate":true,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,128,143,143,158,158,173],"ycors":[31,75,75,150,150,75,75],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"hydrogen":{"name":"hydrogen","editableColorIndex":8,"rotate":true,"elements":[{"x":70,"y":70,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":130,"y":130,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false}]},"nh3":{"name":"nh3","editableColorIndex":0,"rotate":true,"elements":[{"x":75,"y":75,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":12,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":192,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":102,"y":198,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false}]},"nitrogen":{"name":"nitrogen","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false}]},"nothing":{"name":"nothing","editableColorIndex":0,"rotate":true,"elements":[]},"oxygen":{"name":"oxygen","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(241, 106, 21, 1)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(241, 106, 21, 1)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":297,"ymax":299,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Volume vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(25, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Volume vs. Time', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("volume"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "volume", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Pressure vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Pressure vs. Time', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (Prims.gt(PrimChecks.list.length(world.observer.getGlobal("pressure-history")), 10)) {
            plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.list.mean(world.observer.getGlobal("pressure-history")));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "press.", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Temperature vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Temperature vs. Time', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("temperature"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "temp.", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Number of molecules';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('H2', plotOps.makePenOps, false, new PenBundle.State(5, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of molecules', 'H2')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('N2', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of molecules', 'N2')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nitrogen"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('NH3', plotOps.makePenOps, false, new PenBundle.State(97, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of molecules', 'NH3')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "number", true, true, 0, 10, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "particles", singular: "particle", varNames: ["speed", "mass", "energy", "momentum-difference", "last-collision", "molecule-type"] }, { name: "flashes", singular: "flash", varNames: ["birthday"] }])([], [])('globals [   tick-advance-amount                  ;; actual tick length   max-tick-advance-amount              ;; the largest a tick length is allowed to be   box-edge-y                   ;; location of the end of the box   box-edge-x                   ;; location of the end of the box   number-forward-reactions     ;; keeps track number of forward reactions that occur   number-reverse-reactions     ;; keeps track number of backward reactions that occur   pressure                     ;; pressure at this point in time   pressure-history             ;; list of the last 10 pressure values    length-horizontal-surface    ;; the size of the wall surfaces that run horizontally - the top and bottom of the box - used for calculating pressure and volume   length-vertical-surface      ;; the size of the wall surfaces that run vertically - the left and right of the box - used for calculating pressure and volume   walls                        ;; agent set containing patches that are the walls of the box   heatable-walls               ;; the walls that could transfer heat into our out of the box when INSULATED-WALLS? is set to off   piston-wall                  ;; the patches of the right wall on the box (it is a moveable wall)   outside-energy               ;; energy level for isothermal walls   min-outside-energy           ;; minimum energy level for an isothermal wall   max-outside-energy           ;; minimum energy level for an isothermal wall   energy-increment             ;; the amount of energy added to or subtracted from the isothermal wall when the WARM UP WALL or COOL DOWN WALL buttons are pressed   piston-position              ;; xcor of piston wall   piston-color                 ;; color of piston   wall-color                   ;; color of wall   insulated-wall-color         ;; color of insulated walls   run-go?                      ;; flag of whether or not its safe for go to run - it is used to stop the simulation when the wall is moved   volume                       ;; volume of the box   scale-factor-temp-to-energy  ;; scale factor used to convert kinetic energy of particles to temperature   scale-factor-energy-to-temp  ;; scale factor used to convert temperature of gas convert to kinetic energy of particles   temperature                  ;; temperature of the gas   difference-bond-energies     ;; amount of energy released or absorbed in forward or reverse reaction   activation-energy            ;; amount of energy required to react   particle-size ]  breed [ particles particle ] breed [ flashes flash ]        ;; visualization of particle hits against the wall  particles-own [   speed mass energy          ;; particle info   momentum-difference        ;; used to calculate pressure from wall hits   last-collision             ;; last particle that this particle collided with   molecule-type              ;; type of molecule (H2, N2, or NH3) ]  flashes-own [birthday ]      ;; keeps track of when it was created (which tick)  patches-own [insulated? wall?]     ;; insulated patches do not transfer energy into or out of particles  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;SETUP PROCEDURES   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to setup   clear-all   set run-go? true   set number-forward-reactions 0   set number-reverse-reactions 0    set scale-factor-energy-to-temp 4   set scale-factor-temp-to-energy (1 / scale-factor-energy-to-temp)   set outside-energy initial-gas-temp * scale-factor-temp-to-energy    set difference-bond-energies 20    ;; describes how much energy is lost or gained in the transition from products to reactants.                                      ;; a negative value states that energy is lost (endothermic) for the forward reaction                                      ;; a positive value states that energy is gained (exothermic) for the forward reaction   set activation-energy 80   set energy-increment 5   set min-outside-energy 0   set max-outside-energy 100    set particle-size 1.3   set-default-shape particles \"circle\"   set-default-shape flashes \"square\"   set piston-color green   set insulated-wall-color yellow     set max-tick-advance-amount 0.1   ;; box has constant size...   set box-edge-y (max-pycor - 1)   set box-edge-x (max-pxcor - 1)   ;;; the length of the horizontal or vertical surface of   ;;; the inside of the box must exclude the two patches   ;;; that are the where the perpendicular walls join it,   ;;; but must also add in the axes as an additional patch   ;;; example:  a box with an box-edge of 10, is drawn with   ;;; 19 patches of wall space on the inside of the box   set piston-position init-wall-position - box-edge-x   draw-box-piston   recalculate-wall-color   calculate-volume   make-particles   set pressure-history []  ;; plotted pressure will be averaged over the past 3 entries   calculate-pressure-and-temperature   reset-ticks end   to make-particles   create-particles #-H2  [ setup-hydrogen-particle]   create-particles #-N2  [ setup-nitrogen-particle]   create-particles #-NH3 [ setup-ammonia-particle ]   calculate-tick-advance-amount end   to setup-hydrogen-particle   set shape \"hydrogen\"   set molecule-type \"hydrogen\"   set mass 2   set-other-particle-attributes end   to setup-nitrogen-particle   set size particle-size   set shape \"nitrogen\"   set molecule-type \"nitrogen\"   set mass 14   set-other-particle-attributes end   to setup-ammonia-particle   set shape \"nh3\"   set molecule-type \"nh3\"   set mass 10   set-other-particle-attributes end   to set-other-particle-attributes   set size particle-size   set last-collision nobody   set energy (initial-gas-temp * scale-factor-temp-to-energy)   set speed  speed-from-energy   random-position end   ;; place particle at random location inside the box. to random-position ;; particle procedure   setxy ((1 - box-edge-x)  + random-float (box-edge-x + piston-position - 3))         ((1 - box-edge-y) + random-float (2 * box-edge-y - 2))   set heading random-float 360 end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; RUNTIME PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to go   if not run-go? [stop]   ask particles [     bounce     move     check-for-collision   ]    if forward-react? [ ask particles with [molecule-type = \"nitrogen\"]  [check-for-forward-reaction]]   if reverse-react? [ ask particles with [molecule-type = \"nh3\"]       [check-for-reverse-reaction]]    calculate-pressure-and-temperature   calculate-tick-advance-amount   tick-advance tick-advance-amount   recalculate-wall-color   update-plots   display end   to calculate-tick-advance-amount   ifelse any? particles with [speed > 0]     [ set tick-advance-amount min list (1 / (ceiling max [speed] of particles)) max-tick-advance-amount ]     [ set tick-advance-amount max-tick-advance-amount ] end   to move  ;; particle procedure   if patch-ahead (speed * tick-advance-amount) != patch-here     [ set last-collision nobody ]   jump (speed * tick-advance-amount) end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;VISUALIZATION PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to recalculate-wall-color   ;; scale color of walls to dark red to bright red based on their isothermal value....if the wall isn\'t insulated   ;; set color of walls to all insulated-wall-color if the wall is insulated   ifelse insulated-walls?      [set wall-color insulated-wall-color ]      [set wall-color (scale-color red outside-energy -60 (max-outside-energy + 100))]      ask patches with [not insulated?] [set pcolor wall-color]      ask flashes with [ticks - birthday > 0.4] [die ]   ;; after 0.4 ticks recolor the wall correctly and remove the flash end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CHEMICAL REACTIONS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to check-for-forward-reaction   let hit-hydrogen particles with [distance myself <= 1 and molecule-type = \"hydrogen\"]    if count hit-hydrogen >= 3 and random 2 = 0 [  ;; 50/50 chance of a reaction     if speed < 0 [set speed 0]     let reactants n-of 3 hit-hydrogen     let total-input-energy (energy + sum [energy] of reactants )  ;; sum the kinetic energy of the N2 molecule and the three H2 molecules      if total-input-energy > activation-energy [       ;; an exothermic reaction       let total-output-energy (total-input-energy + difference-bond-energies )       ;; turn this N2 molecule into an NH3 molecule       set molecule-type \"nh3\"       set shape \"nh3\"       set mass 10       set energy (total-output-energy * 10 / 20)  ;; each of the two product molecules take half the output energy, scaled to masses out / mass in       set speed  sqrt (2 * (energy / mass))       ;; and also create another NH3 molecule       hatch 1 [set heading (heading + 180) ]       ask reactants [die] ;; reactants are used up       set number-forward-reactions (number-forward-reactions + 1)     ]   ]  end   to check-for-reverse-reaction   let hit-nh3 particles with [distance myself <= 1 and molecule-type = \"nh3\" and self != myself]    if count hit-nh3 >= 1 and random 2 = 0 [  ;;50/50 chance of a reaction     let reactants n-of 1 hit-nh3     let total-input-energy (energy + sum [energy] of reactants )  ;; sum the kinetic energy of both NH3 molecules      if total-input-energy > activation-energy [       let total-output-energy (total-input-energy - difference-bond-energies )       ;; make a nitrogen molecule as the one of the products        set molecule-type \"nitrogen\"       set shape \"nitrogen\"       set mass 14       set energy (total-output-energy * 14 / (20))   ;; take 14/20 th of the energy (proportional to masses of all the products)       set speed speed-from-energy        ;; make three H2 molecules as the rest of the products       hatch 3 [         set molecule-type \"hydrogen\"         set shape \"hydrogen\"         set mass 2         set energy (total-output-energy * 2 / (20))  ;; take 2/20 th of the energy (proportional to masses of all the products) for each of the 3 molecules         set speed  speed-from-energy         set heading random 360       ]       ask reactants [  die ]       set number-reverse-reactions (number-reverse-reactions + 1)     ]   ] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CHANGING ISOTHERMAL WALL PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to cool   ifelse ( outside-energy > 20 ) [ set outside-energy outside-energy - energy-increment ] [ set outside-energy 0 ]   if (outside-energy <= 0) [     set outside-energy min-outside-energy     user-message (word       \"You are currently trying to cool the walls of the container below \"       \"absolute zero (OK or -273C).  Absolute zero is the lowest theoretical \"       \"temperature for all matter in the universe and has never been \"       \"achieved in a real-world laboratory\")   ]   recalculate-wall-color   ask heatable-walls [set pcolor wall-color] end   to heat   set outside-energy outside-energy + energy-increment   if (outside-energy > max-outside-energy) [     set outside-energy max-outside-energy     user-message (word \"You have reached the maximum allowable temperature for the walls of the container in this model.\" )   ]   recalculate-wall-color   ask heatable-walls [set pcolor wall-color] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;; CALCULATIONS P, T, V PROCEDURES  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   ;;; Pressure is defined as the force per unit area.  In this context, ;;; that means the total momentum per unit time transferred to the walls ;;; by particle hits, divided by the surface area of the walls.  (Here ;;; we\'re in a two dimensional world, so the \"surface area\" of the walls ;;; is just their length.)  Each wall contributes a different amount ;;; to the total pressure in the box, based on the number of collisions, the ;;; direction of each collision, and the length of the wall.  Conservation of momentum ;;; in hits ensures that the difference in momentum for the particles is equal to and ;;; opposite to that for the wall.  The force on each wall is the rate of change in ;;; momentum imparted to the wall, or the sum of change in momentum for each particle: ;;; F = SUM  [d(mv)/dt] = SUM [m(dv/dt)] = SUM [ ma ], in a direction perpendicular to ;;; the wall surface.  The pressure (P) on a given wall is the force (F) applied to that ;;; wall over its surface area.  The total pressure in the box is sum of each wall\'s ;;; pressure contribution.  to calculate-pressure-and-temperature   ;; by summing the momentum change for each particle,   ;; the wall\'s total momentum change is calculated   set pressure 15 * sum [momentum-difference] of particles   ifelse length pressure-history > 10     [ set pressure-history lput pressure but-first pressure-history]     [ set pressure-history lput pressure pressure-history]   ask particles [ set momentum-difference 0]  ;; once the contribution to momentum has been calculated                                               ;; this value is reset to zero till the next wall hit   if any? particles [ set temperature (mean [energy] of particles  * scale-factor-energy-to-temp) ] end   to calculate-volume   set length-horizontal-surface  ( 2 * (box-edge-x - 1) + 1) - (abs (piston-position - box-edge-x))   set length-vertical-surface  ( 2 * (box-edge-y - 1) + 1)   set volume (length-horizontal-surface * length-vertical-surface * 1)  ;;depth of 1 end  to reset-reaction-counters   set number-forward-reactions 0   set number-reverse-reactions 0 end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;; PARTICLES BOUNCING OFF THE WALLS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to bounce  ;; particle procedure   let new-patch 0   let new-px 0   let new-py 0    ;; get the coordinates of the patch we\'ll be on if we go forward 1   if (not wall? and [not wall?] of patch-at dx dy)     [stop]   ;; get the coordinates of the patch we\'ll be on if we go forward 1   set new-px round (xcor + dx)   set new-py round (ycor + dy)   ;; if hitting left wall or piston (on right), reflect heading around x axis   if ((abs new-px = box-edge-x or new-px = piston-position))     [       set heading (- heading)   ;;  if the particle is hitting a vertical wall, only the horizontal component of the speed   ;;  vector can change.  The change in velocity for this component is 2 * the speed of the particle,   ;; due to the reversing of direction of travel from the collision with the wall       set momentum-difference momentum-difference + (abs (sin heading * 2 * mass * speed) / length-vertical-surface) ]   ;; if hitting top or bottom wall, reflect heading around y axis   if (abs new-py = box-edge-y)     [ set heading (180 - heading)   ;;  if the particle is hitting a horizontal wall, only the vertical component of the speed   ;;  vector can change.  The change in velocity for this component is 2 * the speed of the particle,   ;; due to the reversing of direction of travel from the collision with the wall       set momentum-difference momentum-difference + (abs (cos heading * 2 * mass * speed) / length-horizontal-surface)  ]    if [isothermal-wall?] of patch new-px new-py  [ ;; check if the patch ahead of us is isothermal      set energy ((energy +  outside-energy ) / 2)      set speed speed-from-energy   ]      ask patch new-px new-py [ make-a-flash ] end  to make-a-flash       sprout 1 [       set breed flashes       set birthday ticks       set color [0 0 0 100]     ] end      to check-for-collision  ;; particle procedure   let candidate 0    if count other particles-here = 1   [     ;; the following conditions are imposed on collision candidates:     ;;   1. they must have a lower who number than my own, because collision     ;;      code is asymmetrical: it must always happen from the point of view     ;;      of just one particle.     ;;   2. they must not be the same particle that we last collided with on     ;;      this patch, so that we have a chance to leave the patch after we\'ve     ;;      collided with someone.     set candidate one-of other particles-here with       [self < myself and myself != last-collision]     ;; we also only collide if one of us has non-zero speed. It\'s useless     ;; (and incorrect, actually) for two particles with zero speed to collide.    if (candidate != nobody) and (speed > 0 or [speed] of candidate > 0)     [       collide-with candidate       set last-collision candidate       ask candidate [ set last-collision myself ]     ]   ] end     ;; implements a collision with another particle. ;; ;; The two particles colliding are self and other-particle, and while the ;; collision is performed from the point of view of self, both particles are ;; modified to reflect its effects. This is somewhat complicated, so I\'ll ;; give a general outline here: ;;   1. Do initial setup, and determine the heading between particle centers ;;      (call it theta). ;;   2. Convert the representation of the velocity of each particle from ;;      speed/heading to a theta-based vector whose first component is the ;;      particle\'s speed along theta, and whose second component is the speed ;;      perpendicular to theta. ;;   3. Modify the velocity vectors to reflect the effects of the collision. ;;      This involves: ;;        a. computing the velocity of the center of mass of the whole system ;;           along direction theta ;;        b. updating the along-theta components of the two velocity vectors. ;;   4. Convert from the theta-based vector representation of velocity back to ;;      the usual speed/heading representation for each particle. ;;   5. Perform final cleanup and update derived quantities. to collide-with [ other-particle ] ;; particle procedure   let mass2 0   let speed2 0   let heading2 0   let theta 0   let v1t 0   let v1l 0   let v2t 0   let v2l 0   let vcm 0     ;;; PHASE 1: initial setup    ;; for convenience, grab some quantities from other-particle   set mass2 [mass] of other-particle   set speed2 [speed] of other-particle   set heading2 [heading] of other-particle    ;; since particles are modeled as zero-size points, theta isn\'t meaningfully   ;; defined. we can assign it randomly without affecting the model\'s outcome.   set theta (random-float 360)      ;;; PHASE 2: convert velocities to theta-based vector representation    ;; now convert my velocity from speed/heading representation to components   ;; along theta and perpendicular to theta   set v1t (speed * cos (theta - heading))   set v1l (speed * sin (theta - heading))    ;; do the same for other-particle   set v2t (speed2 * cos (theta - heading2))   set v2l (speed2 * sin (theta - heading2))      ;;; PHASE 3: manipulate vectors to implement collision    ;; compute the velocity of the system\'s center of mass along theta   set vcm (((mass * v1t) + (mass2 * v2t)) / (mass + mass2) )    ;; now compute the new velocity for each particle along direction theta.   ;; velocity perpendicular to theta is unaffected by a collision along theta,   ;; so the next two lines actually implement the collision itself, in the   ;; sense that the effects of the collision are exactly the following changes   ;; in particle velocity.   set v1t (2 * vcm - v1t)   set v2t (2 * vcm - v2t)      ;;; PHASE 4: convert back to normal speed/heading    ;; now convert my velocity vector into my new speed and heading   set speed sqrt ((v1t ^ 2) + (v1l ^ 2))   set energy (0.5 * mass * (speed ^ 2))   ;; if the magnitude of the velocity vector is 0, atan is undefined. but   ;; speed will be 0, so heading is irrelevant anyway. therefore, in that   ;; case we\'ll just leave it unmodified.   if v1l != 0 or v1t != 0     [ set heading (theta - (atan v1l v1t)) ]    ;; and do the same for other-particle   ask other-particle [     set speed sqrt ((v2t ^ 2) + (v2l ^ 2))     set energy (0.5 * mass * (speed ^ 2))     if v2l != 0 or v2t != 0       [ set heading (theta - (atan v2l v2t)) ]   ] end    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; Moveable wall procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;    to check-move-piston  set run-go? false   if ((mouse-down?) and (mouse-ycor < (max-pycor - 1))) [    ;;note: if user clicks too far to the right, nothing will happen     if (mouse-xcor >= piston-position and mouse-xcor < box-edge-x - 2)  [ piston-out ceiling (mouse-xcor - piston-position) ]     set run-go? true     stop   ] end   to piston-out [dist]   if (dist > 0) [     ifelse ((piston-position + dist) < box-edge-x - 1)     [  undraw-piston       set piston-position (piston-position + dist)       draw-box-piston ]     [ undraw-piston       set piston-position (box-edge-x - 1)       draw-box-piston ]     calculate-volume   ] end   to draw-box-piston   ask patches [set insulated? true set wall? false]   set heatable-walls patches with [ ((pxcor = -1 * box-edge-x) and (abs pycor <= box-edge-y)) or                      ((abs pycor = box-edge-y) and (pxcor <= piston-position) and (abs pxcor <= box-edge-x)) ]   ask heatable-walls  [ set pcolor wall-color set insulated? false  set wall? true]    set piston-wall patches with [ ((pxcor = (round piston-position)) and ((abs pycor) < box-edge-y)) ]   ask piston-wall  [ set pcolor piston-color set wall? true]   ;; make sides of box that are to right right of the piston grey      ask patches with [(pxcor > (round piston-position)) and (abs (pxcor) < box-edge-x) and ((abs pycor) = box-edge-y)]     [set pcolor grey set wall? true]   ask patches with [ ((pxcor = ( box-edge-x)) and (abs pycor <= box-edge-y))]     [set pcolor grey set wall? true] end   to undraw-piston   ask patches with [ (pxcor = round piston-position) and ((abs pycor) < box-edge-y) ]     [ set pcolor black ] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;REPORTERS;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to-report speed-from-energy   report sqrt (2 * energy / mass) end   to-report energy-from-speed   report (mass * speed * speed / 2) end   ;; reports true if there wall is at a fixed temperature to-report isothermal-wall?   report     (( abs pxcor = -1 * box-edge-x) and (abs pycor <= box-edge-y)) or     ((abs pycor = box-edge-y) and (abs pxcor <= box-edge-x)) and     not insulated? and     not insulated-walls? end   ; Copyright 2012 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":485,"top":10,"right":1013,"bottom":427,"dimensions":{"minPxcor":-32,"maxPxcor":32,"minPycor":-25,"maxPycor":25,"patchSize":8,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":95,"top":10,"right":195,"bottom":43,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":5,"top":10,"right":95,"bottom":43,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"5","compiledMax":"60","compiledStep":"1","variable":"init-wall-position","left":534,"top":455,"right":988,"bottom":488,"display":"init-wall-position","min":"5","max":"60","default":6,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_50 = procedures[\"CHECK-MOVE-PISTON\"]();   if (_maybestop_33_50 instanceof Exception.StopInterrupt) { return _maybestop_33_50; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"check-move-piston","left":140,"top":425,"right":285,"bottom":458,"display":"move wall out","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Volume vs. Time', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"volume\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"default","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks volume","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Volume vs. Time","left":285,"top":370,"right":485,"bottom":490,"xAxis":"time","yAxis":"volume","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks volume","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Pressure vs. Time', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         if (Prims.gt(PrimChecks.list.length(world.observer.getGlobal(\"pressure-history\")), 10)) {           plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.list.mean(world.observer.getGlobal(\"pressure-history\")));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if length pressure-history > 10     [ plotxy ticks (mean pressure-history) ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Pressure vs. Time","left":285,"top":130,"right":485,"bottom":250,"xAxis":"time","yAxis":"press.","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if length pressure-history > 10     [ plotxy ticks (mean pressure-history) ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Temperature vs. Time', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"temperature\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"default","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks temperature","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Temperature vs. Time","left":285,"top":250,"right":485,"bottom":370,"xAxis":"time","yAxis":"temp.","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks temperature","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"1","variable":"#-N2","left":5,"top":85,"right":97,"bottom":118,"display":"#-N2","min":"0","max":"200","default":0,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"5","variable":"#-H2","left":5,"top":130,"right":100,"bottom":163,"display":"#-H2","min":"0","max":"200","default":0,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"400","compiledStep":"5","variable":"initial-gas-temp","left":5,"top":45,"right":195,"bottom":78,"display":"initial-gas-temp","min":"0","max":"400","default":90,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"hydrogen\"); })","source":"count particles with [molecule-type = \"hydrogen\"]","left":100,"top":125,"right":195,"bottom":170,"display":"H2 molecules","precision":1,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"nitrogen\"); })","source":"count particles with [molecule-type = \"nitrogen\"]","left":100,"top":80,"right":195,"bottom":125,"display":"N2 molecules","precision":1,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"nh3\"); })","source":"count particles with [molecule-type = \"nh3\"]","left":100,"top":170,"right":195,"bottom":215,"display":"NH3 molecules","precision":1,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"forward-react?","left":5,"top":235,"right":135,"bottom":268,"display":"forward-react?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"reverse-react?","left":5,"top":340,"right":136,"bottom":373,"display":"reverse-react?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Number of molecules', 'H2')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"hydrogen\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"H2","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"hydrogen\"])","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Number of molecules', 'N2')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"nitrogen\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"N2","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"nitrogen\"])","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Number of molecules', 'NH3')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"molecule-type\"), \"nh3\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"NH3","interval":1,"mode":0,"color":-8275240,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"nh3\"])","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Number of molecules","left":205,"top":10,"right":485,"bottom":130,"xAxis":"time","yAxis":"number","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"H2","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"hydrogen\"])","type":"pen"},{"display":"N2","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"nitrogen\"])","type":"pen"},{"display":"NH3","interval":1,"mode":0,"color":-8275240,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (count particles with [molecule-type = \"nh3\"])","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.math.div_unchecked(PrimChecks.math.mult(100, world.observer.getGlobal(\"number-forward-reactions\")), PrimChecks.math.plus(world.observer.getGlobal(\"number-forward-reactions\"), world.observer.getGlobal(\"number-reverse-reactions\")))","source":"100 * number-forward-reactions / (number-forward-reactions + number-reverse-reactions)","left":5,"top":270,"right":134,"bottom":315,"display":"% forward reaction","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.math.div_unchecked(PrimChecks.math.mult(100, world.observer.getGlobal(\"number-reverse-reactions\")), PrimChecks.math.plus(world.observer.getGlobal(\"number-forward-reactions\"), world.observer.getGlobal(\"number-reverse-reactions\")))","source":"100 * number-reverse-reactions / (number-forward-reactions + number-reverse-reactions)","left":5,"top":375,"right":135,"bottom":420,"display":"% reverse reactions","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"N2 + 3H2 --> 2NH3","left":15,"top":220,"right":130,"bottom":240,"fontSize":11,"color":105,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"N2 + 3H2 <-- 2NH3","left":15,"top":320,"right":135,"bottom":354,"fontSize":11,"color":123,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"1","variable":"#-NH3","left":5,"top":175,"right":97,"bottom":208,"display":"#-NH3","min":"0","max":"200","default":200,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_56 = procedures[\"RESET-REACTION-COUNTERS\"]();   if (_maybestop_33_56 instanceof Exception.StopInterrupt) { return _maybestop_33_56; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"reset-reaction-counters","left":5,"top":425,"right":140,"bottom":458,"display":"reset reaction counters","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"insulated-walls?","left":140,"top":280,"right":285,"bottom":313,"display":"insulated-walls?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_37 = procedures[\"HEAT\"]();   if (_maybestop_33_37 instanceof Exception.StopInterrupt) { return _maybestop_33_37; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"heat","left":140,"top":315,"right":285,"bottom":348,"display":"warm walls","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_37 = procedures[\"COOL\"]();   if (_maybestop_33_37 instanceof Exception.StopInterrupt) { return _maybestop_33_37; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"cool","left":140,"top":350,"right":285,"bottom":383,"display":"cool walls","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["init-wall-position", "#-n2", "#-h2", "initial-gas-temp", "forward-react?", "reverse-react?", "#-nh3", "insulated-walls?", "tick-advance-amount", "max-tick-advance-amount", "box-edge-y", "box-edge-x", "number-forward-reactions", "number-reverse-reactions", "pressure", "pressure-history", "length-horizontal-surface", "length-vertical-surface", "walls", "heatable-walls", "piston-wall", "outside-energy", "min-outside-energy", "max-outside-energy", "energy-increment", "piston-position", "piston-color", "wall-color", "insulated-wall-color", "run-go?", "volume", "scale-factor-temp-to-energy", "scale-factor-energy-to-temp", "temperature", "difference-bond-energies", "activation-energy", "particle-size"], ["init-wall-position", "#-n2", "#-h2", "initial-gas-temp", "forward-react?", "reverse-react?", "#-nh3", "insulated-walls?"], ["insulated?", "wall?"], -32, 32, -25, 25, 8, true, true, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
var InspectionPrims = workspace.inspectionPrims;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var PrimChecks = workspace.primChecks;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
var RandomPrims = workspace.randomPrims;
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
      world.observer.setGlobal("scale-factor-temp-to-energy", PrimChecks.math.div(1, world.observer.getGlobal("scale-factor-energy-to-temp")));
      world.observer.setGlobal("outside-energy", PrimChecks.math.mult(world.observer.getGlobal("initial-gas-temp"), world.observer.getGlobal("scale-factor-temp-to-energy")));
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
      world.observer.setGlobal("box-edge-y", PrimChecks.math.minus_unchecked(world.topology.maxPycor, 1));
      world.observer.setGlobal("box-edge-x", PrimChecks.math.minus_unchecked(world.topology.maxPxcor, 1));
      world.observer.setGlobal("piston-position", PrimChecks.math.minus(world.observer.getGlobal("init-wall-position"), world.observer.getGlobal("box-edge-x")));
      procedures["DRAW-BOX-PISTON"]();
      procedures["RECALCULATE-WALL-COLOR"]();
      procedures["CALCULATE-VOLUME"]();
      procedures["MAKE-PARTICLES"]();
      world.observer.setGlobal("pressure-history", []);
      procedures["CALCULATE-PRESSURE-AND-TEMPERATURE"]();
      world.ticker.reset();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
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
      SelfManager.self().setVariable("energy", PrimChecks.math.mult(world.observer.getGlobal("initial-gas-temp"), world.observer.getGlobal("scale-factor-temp-to-energy")));
      SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
      procedures["RANDOM-POSITION"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setOtherParticleAttributes"] = temp;
  procs["SET-OTHER-PARTICLE-ATTRIBUTES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setXY(PrimChecks.math.plus_unchecked(PrimChecks.math.minus(1, world.observer.getGlobal("box-edge-x")), PrimChecks.math.randomFloat_unchecked(PrimChecks.math.minus_unchecked(PrimChecks.math.plus(world.observer.getGlobal("box-edge-x"), world.observer.getGlobal("piston-position")), 3))), PrimChecks.math.plus_unchecked(PrimChecks.math.minus(1, world.observer.getGlobal("box-edge-y")), PrimChecks.math.randomFloat_unchecked(PrimChecks.math.minus_unchecked(PrimChecks.math.mult(2, world.observer.getGlobal("box-edge-y")), 2))));
      SelfManager.self().setVariable("heading", PrimChecks.math.randomFloat_unchecked(360));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["randomPosition"] = temp;
  procs["RANDOM-POSITION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (PrimChecks.math.not(world.observer.getGlobal("run-go?"))) {
        throw new Exception.StopInterrupt;
      }
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() {
        procedures["BOUNCE"]();
        procedures["MOVE"]();
        procedures["CHECK-FOR-COLLISION"]();
      }, true);
      if (world.observer.getGlobal("forward-react?")) {
        Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nitrogen"); })).ask(function() { procedures["CHECK-FOR-FORWARD-REACTION"](); }, true);
      }
      if (world.observer.getGlobal("reverse-react?")) {
        Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3"); })).ask(function() { procedures["CHECK-FOR-REVERSE-REACTION"](); }, true);
      }
      procedures["CALCULATE-PRESSURE-AND-TEMPERATURE"]();
      procedures["CALCULATE-TICK-ADVANCE-AMOUNT"]();
      world.ticker.tickAdvance(world.observer.getGlobal("tick-advance-amount"));
      procedures["RECALCULATE-WALL-COLOR"]();
      plotManager.updatePlots();
      notImplemented('display', undefined)();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (PrimChecks.agentset.anyWith(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.gt(SelfManager.self().getVariable("speed"), 0); })) {
        world.observer.setGlobal("tick-advance-amount", PrimChecks.list.min_unchecked(ListPrims.list(PrimChecks.math.div_unchecked(1, PrimChecks.math.ceil_unchecked(PrimChecks.list.max(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return SelfManager.self().getVariable("speed"); })))), world.observer.getGlobal("max-tick-advance-amount"))));
      }
      else {
        world.observer.setGlobal("tick-advance-amount", world.observer.getGlobal("max-tick-advance-amount"));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["calculateTickAdvanceAmount"] = temp;
  procs["CALCULATE-TICK-ADVANCE-AMOUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!Prims.equality(SelfManager.self().patchAhead(PrimChecks.math.mult(SelfManager.self().getVariable("speed"), world.observer.getGlobal("tick-advance-amount"))), SelfManager.self().getPatchHere())) {
        SelfManager.self().setVariable("last-collision", Nobody);
      }
      SelfManager.self().jumpIfAble(PrimChecks.math.mult(SelfManager.self().getVariable("speed"), world.observer.getGlobal("tick-advance-amount")));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
        world.observer.setGlobal("wall-color", ColorModel.scaleColor(15, world.observer.getGlobal("outside-energy"), -60, PrimChecks.math.plus(world.observer.getGlobal("max-outside-energy"), 100)));
      }
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() { return PrimChecks.math.not(SelfManager.self().getPatchVariable("insulated?")); })).ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("FLASHES"), function() {
        return Prims.gt(PrimChecks.math.minus(world.ticker.tickCount(), SelfManager.self().getVariable("birthday")), 0.4);
      })).ask(function() { SelfManager.self().die(); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["recalculateWallColor"] = temp;
  procs["RECALCULATE-WALL-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let hitHydrogen = PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("PARTICLES"), function() {
        return (Prims.lte(SelfManager.self().distance(SelfManager.myself()), 1) && Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"));
      }); letVars['hitHydrogen'] = hitHydrogen;
      if ((Prims.gte(PrimChecks.agentset.count(hitHydrogen), 3) && Prims.equality(RandomPrims.randomLong(2), 0))) {
        if (Prims.lt(SelfManager.self().getVariable("speed"), 0)) {
          SelfManager.self().setVariable("speed", 0);
        }
        let reactants = PrimChecks.list.nOf(3, hitHydrogen); letVars['reactants'] = reactants;
        let totalInputEnergy = PrimChecks.math.plus(SelfManager.self().getVariable("energy"), PrimChecks.list.sum(PrimChecks.agentset.of(reactants, function() { return SelfManager.self().getVariable("energy"); }))); letVars['totalInputEnergy'] = totalInputEnergy;
        if (Prims.gt(totalInputEnergy, world.observer.getGlobal("activation-energy"))) {
          let totalOutputEnergy = PrimChecks.math.plus(totalInputEnergy, world.observer.getGlobal("difference-bond-energies")); letVars['totalOutputEnergy'] = totalOutputEnergy;
          SelfManager.self().setVariable("molecule-type", "nh3");
          SelfManager.self().setVariable("shape", "nh3");
          SelfManager.self().setVariable("mass", 10);
          SelfManager.self().setVariable("energy", PrimChecks.math.div_unchecked(PrimChecks.math.mult(totalOutputEnergy, 10), 20));
          SelfManager.self().setVariable("speed", PrimChecks.math.sqrt_unchecked(PrimChecks.math.mult_unchecked(2, PrimChecks.math.div(SelfManager.self().getVariable("energy"), SelfManager.self().getVariable("mass")))));
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("heading", PrimChecks.math.plus(SelfManager.self().getVariable("heading"), 180));
          }, true);
          Errors.askNobodyCheck(reactants).ask(function() { SelfManager.self().die(); }, true);
          world.observer.setGlobal("number-forward-reactions", PrimChecks.math.plus(world.observer.getGlobal("number-forward-reactions"), 1));
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkForForwardReaction"] = temp;
  procs["CHECK-FOR-FORWARD-REACTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let hitNh3 = PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("PARTICLES"), function() {
        return ((Prims.lte(SelfManager.self().distance(SelfManager.myself()), 1) && Prims.equality(SelfManager.self().getVariable("molecule-type"), "nh3")) && !Prims.equality(SelfManager.self(), SelfManager.myself()));
      }); letVars['hitNh3'] = hitNh3;
      if ((Prims.gte(PrimChecks.agentset.count(hitNh3), 1) && Prims.equality(RandomPrims.randomLong(2), 0))) {
        let reactants = PrimChecks.list.nOf(1, hitNh3); letVars['reactants'] = reactants;
        let totalInputEnergy = PrimChecks.math.plus(SelfManager.self().getVariable("energy"), PrimChecks.list.sum(PrimChecks.agentset.of(reactants, function() { return SelfManager.self().getVariable("energy"); }))); letVars['totalInputEnergy'] = totalInputEnergy;
        if (Prims.gt(totalInputEnergy, world.observer.getGlobal("activation-energy"))) {
          let totalOutputEnergy = PrimChecks.math.minus(totalInputEnergy, world.observer.getGlobal("difference-bond-energies")); letVars['totalOutputEnergy'] = totalOutputEnergy;
          SelfManager.self().setVariable("molecule-type", "nitrogen");
          SelfManager.self().setVariable("shape", "nitrogen");
          SelfManager.self().setVariable("mass", 14);
          SelfManager.self().setVariable("energy", PrimChecks.math.div_unchecked(PrimChecks.math.mult(totalOutputEnergy, 14), 20));
          SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
          SelfManager.self().hatch(3, "").ask(function() {
            SelfManager.self().setVariable("molecule-type", "hydrogen");
            SelfManager.self().setVariable("shape", "hydrogen");
            SelfManager.self().setVariable("mass", 2);
            SelfManager.self().setVariable("energy", PrimChecks.math.div_unchecked(PrimChecks.math.mult(totalOutputEnergy, 2), 20));
            SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
            SelfManager.self().setVariable("heading", RandomPrims.randomLong(360));
          }, true);
          Errors.askNobodyCheck(reactants).ask(function() { SelfManager.self().die(); }, true);
          world.observer.setGlobal("number-reverse-reactions", PrimChecks.math.plus(world.observer.getGlobal("number-reverse-reactions"), 1));
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkForReverseReaction"] = temp;
  procs["CHECK-FOR-REVERSE-REACTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(world.observer.getGlobal("outside-energy"), 20)) {
        world.observer.setGlobal("outside-energy", PrimChecks.math.minus(world.observer.getGlobal("outside-energy"), world.observer.getGlobal("energy-increment")));
      }
      else {
        world.observer.setGlobal("outside-energy", 0);
      }
      if (Prims.lte(world.observer.getGlobal("outside-energy"), 0)) {
        world.observer.setGlobal("outside-energy", world.observer.getGlobal("min-outside-energy"));
        UserDialogPrims.confirm((workspace.dump('') + workspace.dump("You are currently trying to cool the walls of the container below ") + workspace.dump("absolute zero (OK or -273C).  Absolute zero is the lowest theoretical ") + workspace.dump("temperature for all matter in the universe and has never been ") + workspace.dump("achieved in a real-world laboratory")));
      }
      procedures["RECALCULATE-WALL-COLOR"]();
      Errors.askNobodyCheck(world.observer.getGlobal("heatable-walls")).ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["cool"] = temp;
  procs["COOL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("outside-energy", PrimChecks.math.plus(world.observer.getGlobal("outside-energy"), world.observer.getGlobal("energy-increment")));
      if (Prims.gt(world.observer.getGlobal("outside-energy"), world.observer.getGlobal("max-outside-energy"))) {
        world.observer.setGlobal("outside-energy", world.observer.getGlobal("max-outside-energy"));
        UserDialogPrims.confirm((workspace.dump('') + workspace.dump("You have reached the maximum allowable temperature for the walls of the container in this model.")));
      }
      procedures["RECALCULATE-WALL-COLOR"]();
      Errors.askNobodyCheck(world.observer.getGlobal("heatable-walls")).ask(function() { SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color")); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["heat"] = temp;
  procs["HEAT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("pressure", PrimChecks.math.mult_unchecked(15, PrimChecks.list.sum(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return SelfManager.self().getVariable("momentum-difference"); }))));
      if (Prims.gt(PrimChecks.list.length(world.observer.getGlobal("pressure-history")), 10)) {
        world.observer.setGlobal("pressure-history", PrimChecks.list.lput(world.observer.getGlobal("pressure"), PrimChecks.list.butFirst('but-first', world.observer.getGlobal("pressure-history"))));
      }
      else {
        world.observer.setGlobal("pressure-history", PrimChecks.list.lput(world.observer.getGlobal("pressure"), world.observer.getGlobal("pressure-history")));
      }
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().setVariable("momentum-difference", 0); }, true);
      if (PrimChecks.agentset.any_unchecked(world.turtleManager.turtlesOfBreed("PARTICLES"))) {
        world.observer.setGlobal("temperature", PrimChecks.math.mult(PrimChecks.list.mean(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return SelfManager.self().getVariable("energy"); })), world.observer.getGlobal("scale-factor-energy-to-temp")));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["calculatePressureAndTemperature"] = temp;
  procs["CALCULATE-PRESSURE-AND-TEMPERATURE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("length-horizontal-surface", PrimChecks.math.minus_unchecked(PrimChecks.math.plus_unchecked(PrimChecks.math.mult_unchecked(2, PrimChecks.math.minus(world.observer.getGlobal("box-edge-x"), 1)), 1), PrimChecks.math.abs_unchecked(PrimChecks.math.minus(world.observer.getGlobal("piston-position"), world.observer.getGlobal("box-edge-x")))));
      world.observer.setGlobal("length-vertical-surface", PrimChecks.math.plus_unchecked(PrimChecks.math.mult_unchecked(2, PrimChecks.math.minus(world.observer.getGlobal("box-edge-y"), 1)), 1));
      world.observer.setGlobal("volume", PrimChecks.math.mult_unchecked(PrimChecks.math.mult(world.observer.getGlobal("length-horizontal-surface"), world.observer.getGlobal("length-vertical-surface")), 1));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
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
      if (PrimChecks.math.bool('AND', PrimChecks.math.not(SelfManager.self().getPatchVariable("wall?"))) && PrimChecks.math.bool('AND', PrimChecks.agentset.of(SelfManager.self().patchAt(SelfManager.self().dx(), SelfManager.self().dy()), function() { return PrimChecks.math.not(SelfManager.self().getPatchVariable("wall?")); }))) {
        throw new Exception.StopInterrupt;
      }
      newPx = PrimChecks.math.round_unchecked(PrimChecks.math.plus(SelfManager.self().getVariable("xcor"), SelfManager.self().dx())); letVars['newPx'] = newPx;
      newPy = PrimChecks.math.round_unchecked(PrimChecks.math.plus(SelfManager.self().getVariable("ycor"), SelfManager.self().dy())); letVars['newPy'] = newPy;
      if ((Prims.equality(PrimChecks.math.abs(newPx), world.observer.getGlobal("box-edge-x")) || Prims.equality(newPx, world.observer.getGlobal("piston-position")))) {
        SelfManager.self().setVariable("heading", PrimChecks.math.unaryminus(SelfManager.self().getVariable("heading")));
        SelfManager.self().setVariable("momentum-difference", PrimChecks.math.plus(SelfManager.self().getVariable("momentum-difference"), PrimChecks.math.div(PrimChecks.math.abs_unchecked(PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.math.mult_unchecked(PrimChecks.math.sin(SelfManager.self().getVariable("heading")), 2), SelfManager.self().getVariable("mass")), SelfManager.self().getVariable("speed"))), world.observer.getGlobal("length-vertical-surface"))));
      }
      if (Prims.equality(PrimChecks.math.abs(newPy), world.observer.getGlobal("box-edge-y"))) {
        SelfManager.self().setVariable("heading", PrimChecks.math.minus(180, SelfManager.self().getVariable("heading")));
        SelfManager.self().setVariable("momentum-difference", PrimChecks.math.plus(SelfManager.self().getVariable("momentum-difference"), PrimChecks.math.div(PrimChecks.math.abs_unchecked(PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.math.mult_unchecked(PrimChecks.math.cos(SelfManager.self().getVariable("heading")), 2), SelfManager.self().getVariable("mass")), SelfManager.self().getVariable("speed"))), world.observer.getGlobal("length-horizontal-surface"))));
      }
      if (PrimChecks.agentset.of(world.getPatchAt(newPx, newPy), function() { return procedures["ISOTHERMAL-WALL?"](); })) {
        SelfManager.self().setVariable("energy", PrimChecks.math.div_unchecked(PrimChecks.math.plus(SelfManager.self().getVariable("energy"), world.observer.getGlobal("outside-energy")), 2));
        SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
      }
      Errors.askNobodyCheck(world.getPatchAt(newPx, newPy)).ask(function() { procedures["MAKE-A-FLASH"](); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
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
        candidate = PrimChecks.list.oneOf_unchecked(PrimChecks.agentset.otherWith(SelfManager.self().breedHere("PARTICLES"), function() {
          return (Prims.lt(SelfManager.self(), SelfManager.myself()) && !Prims.equality(SelfManager.myself(), SelfManager.self().getVariable("last-collision")));
        })); letVars['candidate'] = candidate;
        if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfManager.self().getVariable("speed"), 0) || Prims.gt(PrimChecks.agentset.of(candidate, function() { return SelfManager.self().getVariable("speed"); }), 0)))) {
          procedures["COLLIDE-WITH"](candidate);
          SelfManager.self().setVariable("last-collision", candidate);
          Errors.askNobodyCheck(candidate).ask(function() { SelfManager.self().setVariable("last-collision", SelfManager.myself()); }, true);
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
      mass2 = PrimChecks.agentset.of(otherParticle, function() { return SelfManager.self().getVariable("mass"); }); letVars['mass2'] = mass2;
      speed2 = PrimChecks.agentset.of(otherParticle, function() { return SelfManager.self().getVariable("speed"); }); letVars['speed2'] = speed2;
      heading2 = PrimChecks.agentset.of(otherParticle, function() { return SelfManager.self().getVariable("heading"); }); letVars['heading2'] = heading2;
      theta = PrimChecks.math.randomFloat_unchecked(360); letVars['theta'] = theta;
      v1t = PrimChecks.math.mult(SelfManager.self().getVariable("speed"), PrimChecks.math.cos_unchecked(PrimChecks.math.minus(theta, SelfManager.self().getVariable("heading")))); letVars['v1t'] = v1t;
      v1l = PrimChecks.math.mult(SelfManager.self().getVariable("speed"), PrimChecks.math.sin_unchecked(PrimChecks.math.minus(theta, SelfManager.self().getVariable("heading")))); letVars['v1l'] = v1l;
      v2t = PrimChecks.math.mult(speed2, PrimChecks.math.cos_unchecked(PrimChecks.math.minus(theta, heading2))); letVars['v2t'] = v2t;
      v2l = PrimChecks.math.mult(speed2, PrimChecks.math.sin_unchecked(PrimChecks.math.minus(theta, heading2))); letVars['v2l'] = v2l;
      vcm = PrimChecks.math.div_unchecked(PrimChecks.math.plus_unchecked(PrimChecks.math.mult(SelfManager.self().getVariable("mass"), v1t), PrimChecks.math.mult(mass2, v2t)), PrimChecks.math.plus(SelfManager.self().getVariable("mass"), mass2)); letVars['vcm'] = vcm;
      v1t = PrimChecks.math.minus(PrimChecks.math.mult(2, vcm), v1t); letVars['v1t'] = v1t;
      v2t = PrimChecks.math.minus(PrimChecks.math.mult(2, vcm), v2t); letVars['v2t'] = v2t;
      SelfManager.self().setVariable("speed", PrimChecks.math.sqrt_unchecked(PrimChecks.math.plus_unchecked(PrimChecks.math.pow(v1t, 2), PrimChecks.math.pow(v1l, 2))));
      SelfManager.self().setVariable("energy", PrimChecks.math.mult_unchecked(PrimChecks.math.mult(0.5, SelfManager.self().getVariable("mass")), PrimChecks.math.pow(SelfManager.self().getVariable("speed"), 2)));
      if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
        SelfManager.self().setVariable("heading", PrimChecks.math.minus(theta, PrimChecks.math.atan(v1l, v1t)));
      }
      Errors.askNobodyCheck(otherParticle).ask(function() {
        SelfManager.self().setVariable("speed", PrimChecks.math.sqrt_unchecked(PrimChecks.math.plus_unchecked(PrimChecks.math.pow(v2t, 2), PrimChecks.math.pow(v2l, 2))));
        SelfManager.self().setVariable("energy", PrimChecks.math.mult_unchecked(PrimChecks.math.mult(0.5, SelfManager.self().getVariable("mass")), PrimChecks.math.pow(SelfManager.self().getVariable("speed"), 2)));
        if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
          SelfManager.self().setVariable("heading", PrimChecks.math.minus(theta, PrimChecks.math.atan(v2l, v2t)));
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["collideWith"] = temp;
  procs["COLLIDE-WITH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("run-go?", false);
      if ((MousePrims.isDown() && Prims.lt(MousePrims.getY(), PrimChecks.math.minus_unchecked(world.topology.maxPycor, 1)))) {
        if ((Prims.gte(MousePrims.getX(), world.observer.getGlobal("piston-position")) && Prims.lt(MousePrims.getX(), PrimChecks.math.minus(world.observer.getGlobal("box-edge-x"), 2)))) {
          procedures["PISTON-OUT"](PrimChecks.math.ceil_unchecked(PrimChecks.math.minus(MousePrims.getX(), world.observer.getGlobal("piston-position"))));
        }
        world.observer.setGlobal("run-go?", true);
        throw new Exception.StopInterrupt;
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkMovePiston"] = temp;
  procs["CHECK-MOVE-PISTON"] = temp;
  temp = (function(dist) {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(dist, 0)) {
        if (Prims.lt(PrimChecks.math.plus(world.observer.getGlobal("piston-position"), dist), PrimChecks.math.minus(world.observer.getGlobal("box-edge-x"), 1))) {
          procedures["UNDRAW-PISTON"]();
          world.observer.setGlobal("piston-position", PrimChecks.math.plus(world.observer.getGlobal("piston-position"), dist));
          procedures["DRAW-BOX-PISTON"]();
        }
        else {
          procedures["UNDRAW-PISTON"]();
          world.observer.setGlobal("piston-position", PrimChecks.math.minus(world.observer.getGlobal("box-edge-x"), 1));
          procedures["DRAW-BOX-PISTON"]();
        }
        procedures["CALCULATE-VOLUME"]();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["pistonOut"] = temp;
  procs["PISTON-OUT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.patches()).ask(function() {
        SelfManager.self().setPatchVariable("insulated?", true);
        SelfManager.self().setPatchVariable("wall?", false);
      }, true);
      world.observer.setGlobal("heatable-walls", PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return ((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.mult(-1, world.observer.getGlobal("box-edge-x"))) && Prims.lte(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y"))) || ((Prims.equality(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")) && Prims.lte(SelfManager.self().getPatchVariable("pxcor"), world.observer.getGlobal("piston-position"))) && Prims.lte(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge-x"))));
      }));
      Errors.askNobodyCheck(world.observer.getGlobal("heatable-walls")).ask(function() {
        SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("wall-color"));
        SelfManager.self().setPatchVariable("insulated?", false);
        SelfManager.self().setPatchVariable("wall?", true);
      }, true);
      world.observer.setGlobal("piston-wall", PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.round(world.observer.getGlobal("piston-position"))) && Prims.lt(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
      }));
      Errors.askNobodyCheck(world.observer.getGlobal("piston-wall")).ask(function() {
        SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("piston-color"));
        SelfManager.self().setPatchVariable("wall?", true);
      }, true);
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return ((Prims.gt(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.round(world.observer.getGlobal("piston-position"))) && Prims.lt(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge-x"))) && Prims.equality(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
      })).ask(function() {
        SelfManager.self().setPatchVariable("pcolor", 5);
        SelfManager.self().setPatchVariable("wall?", true);
      }, true);
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.observer.getGlobal("box-edge-x")) && Prims.lte(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
      })).ask(function() {
        SelfManager.self().setPatchVariable("pcolor", 5);
        SelfManager.self().setPatchVariable("wall?", true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["drawBoxPiston"] = temp;
  procs["DRAW-BOX-PISTON"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.round(world.observer.getGlobal("piston-position"))) && Prims.lt(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")));
      })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["undrawPiston"] = temp;
  procs["UNDRAW-PISTON"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.sqrt_unchecked(PrimChecks.math.div(PrimChecks.math.mult(2, SelfManager.self().getVariable("energy")), SelfManager.self().getVariable("mass")));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["speedFromEnergy"] = temp;
  procs["SPEED-FROM-ENERGY"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div_unchecked(PrimChecks.math.mult(PrimChecks.math.mult(SelfManager.self().getVariable("mass"), SelfManager.self().getVariable("speed")), SelfManager.self().getVariable("speed")), 2);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["energyFromSpeed"] = temp;
  procs["ENERGY-FROM-SPEED"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return ((((Prims.equality(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pxcor")), PrimChecks.math.mult(-1, world.observer.getGlobal("box-edge-x"))) && Prims.lte(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y"))) || (Prims.equality(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge-y")) && Prims.lte(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge-x")))) && PrimChecks.math.not(SelfManager.self().getPatchVariable("insulated?"))) && PrimChecks.math.not(world.observer.getGlobal("insulated-walls?")));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
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