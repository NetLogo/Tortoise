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
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');
var { DeathInterrupt, StopInterrupt } = tortoise_require('util/interrupts');

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Average grain count';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Average grain count', 'average', function() {
      plotManager.plotValue(PrimChecks.math.div(44, 45, PrimChecks.validator.checkArg('/', 44, 45, 1, world.observer.getGlobal("total")), PrimChecks.agentset.count(world.patches())));;
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "ticks", "grains", false, true, 0, 1, 2, 2.1, setup, update);
})(), (function() {
  var name    = 'Avalanche sizes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Avalanche sizes', 'default', function() {
      if ((Prims.equality(PrimChecks.math.mod(42, 45, world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 62, 68, 12, world.observer.getGlobal("sizes")))))) {
        plotManager.resetPen();
        let counts = PrimChecks.task.nValues(107, 115, PrimChecks.math.plus(119, 120, 1, PrimChecks.list.max(121, 124, PrimChecks.validator.checkArg('MAX', 121, 124, 8, world.observer.getGlobal("sizes")))), PrimChecks.task.checked(132, 133, function() { return 0; }, "[ 0 ]", true, false)); ProcedurePrims.stack().currentContext().registerStringRunVar("COUNTS", counts);
        var R = PrimChecks.task.forEach(138, 145, PrimChecks.validator.checkArg('FOREACH', 138, 145, 8, world.observer.getGlobal("sizes")), PrimChecks.task.checked(152, 153, function(theHsize) {
          PrimChecks.procedure.runArgCountCheck('run', 152, 240, 1, arguments.length);
          counts = PrimChecks.list.replaceItem(181, 193, PrimChecks.validator.checkArg('REPLACE-ITEM', 181, 193, 1, theHsize), PrimChecks.validator.checkArg('REPLACE-ITEM', 181, 193, 12, counts), PrimChecks.math.plus(213, 214, 1, PrimChecks.validator.checkArg('+', 213, 214, 1, PrimChecks.list.item(215, 219, PrimChecks.validator.checkArg('ITEM', 215, 219, 1, theHsize), PrimChecks.validator.checkArg('ITEM', 215, 219, 12, counts))))); ProcedurePrims.stack().currentContext().updateStringRunVar("COUNTS", counts);
        }, "[ the-size -> set counts replace-item the-size counts 1 + item the-size counts ]", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(138, 145, R); return R; }
        let s = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("S", s);
        var R = PrimChecks.task.forEach(253, 260, PrimChecks.validator.checkArg('FOREACH', 253, 260, 8, counts), PrimChecks.task.checked(268, 269, function(c) {
          PrimChecks.procedure.runArgCountCheck('run', 268, 509, 1, arguments.length);
          if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {
            plotManager.plotPoint(PrimChecks.math.log(463, 466, PrimChecks.validator.checkArg('LOG', 463, 466, 1, s), 10), PrimChecks.math.log(474, 477, PrimChecks.validator.checkArg('LOG', 474, 477, 1, c), 10));
          }
          s = PrimChecks.math.plus(502, 503, PrimChecks.validator.checkArg('+', 502, 503, 1, s), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("S", s);
        }, "[ c -> if s > 0 and c > 0 [ plotxy log s 10 log c 10 ] set s s + 1 ]", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(253, 260, R); return R; }
      };
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "log size", "log count", false, true, 0, 1, 0, 1, setup, update);
})(), (function() {
  var name    = 'Avalanche lifetimes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Avalanche lifetimes', 'default', function() {
      if ((Prims.equality(PrimChecks.math.mod(42, 45, world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 62, 68, 12, world.observer.getGlobal("lifetimes")))))) {
        plotManager.resetPen();
        let counts = PrimChecks.task.nValues(111, 119, PrimChecks.math.plus(123, 124, 1, PrimChecks.list.max(125, 128, PrimChecks.validator.checkArg('MAX', 125, 128, 8, world.observer.getGlobal("lifetimes")))), PrimChecks.task.checked(140, 141, function() { return 0; }, "[ 0 ]", true, false)); ProcedurePrims.stack().currentContext().registerStringRunVar("COUNTS", counts);
        var R = PrimChecks.task.forEach(146, 153, PrimChecks.validator.checkArg('FOREACH', 146, 153, 8, world.observer.getGlobal("lifetimes")), PrimChecks.task.checked(164, 165, function(lifetime) {
          PrimChecks.procedure.runArgCountCheck('run', 164, 252, 1, arguments.length);
          counts = PrimChecks.list.replaceItem(193, 205, PrimChecks.validator.checkArg('REPLACE-ITEM', 193, 205, 1, lifetime), PrimChecks.validator.checkArg('REPLACE-ITEM', 193, 205, 12, counts), PrimChecks.math.plus(225, 226, 1, PrimChecks.validator.checkArg('+', 225, 226, 1, PrimChecks.list.item(227, 231, PrimChecks.validator.checkArg('ITEM', 227, 231, 1, lifetime), PrimChecks.validator.checkArg('ITEM', 227, 231, 12, counts))))); ProcedurePrims.stack().currentContext().updateStringRunVar("COUNTS", counts);
        }, "[ lifetime -> set counts replace-item lifetime counts 1 + item lifetime counts ]", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(146, 153, R); return R; }
        let l = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("L", l);
        var R = PrimChecks.task.forEach(265, 272, PrimChecks.validator.checkArg('FOREACH', 265, 272, 8, counts), PrimChecks.task.checked(280, 281, function(c) {
          PrimChecks.procedure.runArgCountCheck('run', 280, 521, 1, arguments.length);
          if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {
            plotManager.plotPoint(PrimChecks.math.log(475, 478, PrimChecks.validator.checkArg('LOG', 475, 478, 1, l), 10), PrimChecks.math.log(486, 489, PrimChecks.validator.checkArg('LOG', 486, 489, 1, c), 10));
          }
          l = PrimChecks.math.plus(514, 515, PrimChecks.validator.checkArg('+', 514, 515, 1, l), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("L", l);
        }, "[ c -> if l > 0 and c > 0 [ plotxy log l 10 log c 10 ] set l l + 1 ]", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(265, 272, R); return R; }
      };
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "log lifetime", "log count", false, true, 0, 1, 0, 1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [   ;; By always keeping track of how much sand is on the table, we can compute the   ;; average number of grains per patch instantly, without having to count.   total   ;; We don\'t want the average monitor to updating wildly, so we only have it   ;; update every tick.   total-on-tick   ;; Keep track of avalanche sizes so we can histogram them   sizes   ;; Size of the most recent run   last-size   ;; Keep track of avalanche lifetimes so we can histogram them   lifetimes   ;; Lifetime of the most recent run   last-lifetime   ;; The patch the mouse hovers over while exploring   selected-patch   ;; These colors define how the patches look normally, after being fired, and in   ;; explore mode.   default-color   fired-color   selected-color ]  patches-own [   ;; how many grains of sand are on this patch   n   ;; A list of stored n so that we can easily pop back to a previous state. See   ;; the NETLOGO FEATURES section of the Info tab for a description of how stacks   ;; work   n-stack   ;; Determines what color to scale when coloring the patch.   base-color ]  ;; The input task says what each patch should do at setup time ;; to compute its initial value for n.  (See the Tasks section ;; of the Programming Guide for information on tasks.) to setup [setup-task]   clear-all    set default-color blue   set fired-color red   set selected-color green    set selected-patch nobody   ask patches [     set n runresult setup-task     set n-stack []     set base-color default-color   ]   let ignore stabilize false   ask patches [ recolor ]   set total sum [ n ] of patches   ;; set this to the empty list so we can add items to it later   set sizes []   set lifetimes []   reset-ticks end  ;; For example, \"setup-uniform 2\" gives every patch a task which reports 2. to setup-uniform [initial]   setup [ -> initial ] end  ;; Every patch uses a task which reports a random value. to setup-random   setup [ -> random 4 ] end  ;; patch procedure; the colors are like a stoplight to recolor   set pcolor scale-color base-color n 0 4 end  to go   let drop drop-patch   if drop != nobody [     ask drop [       update-n 1       recolor     ]     let results stabilize animate-avalanches?     let avalanche-patches first results     let lifetime last results      ;; compute the size of the avalanche and throw it on the end of the sizes list     if any? avalanche-patches [       set sizes lput (count avalanche-patches) sizes       set lifetimes lput lifetime lifetimes     ]     ;; Display the avalanche and guarantee that the border of the avalanche is updated     ask avalanche-patches [ recolor ask neighbors4 [ recolor ] ]     display     ;; Erase the avalanche     ask avalanche-patches [ set base-color default-color recolor ]     ;; Updates the average monitor     set total-on-tick total     tick   ] end  to explore   ifelse mouse-inside? [     let p patch mouse-xcor mouse-ycor     set selected-patch p     ask patches [ push-n ]     ask selected-patch [ update-n 1 ]     let results stabilize false     ask patches [ pop-n ]     ask patches [ set base-color default-color recolor ]     let avalanche-patches first results     ask avalanche-patches [ set base-color selected-color recolor ]     display   ] [     if selected-patch != nobody [       set selected-patch nobody       ask patches [ set base-color default-color recolor ]     ]   ] end  ;; Stabilizes the sandpile. Reports which sites fired and how many iterations it took to ;; stabilize. to-report stabilize [animate?]   let active-patches patches with [ n > 3 ]    ;; The number iterations the avalanche has gone for. Use to calculate lifetimes.   let iters 0    ;; we want to count how many patches became overloaded at some point   ;; during the avalanche, and also flash those patches. so as we go, we\'ll   ;; keep adding more patches to to this initially empty set.   let avalanche-patches no-patches    while [ any? active-patches ] [     let overloaded-patches active-patches with [ n > 3 ]     if any? overloaded-patches [       set iters iters + 1     ]     ask overloaded-patches [       set base-color fired-color       ;; subtract 4 from this patch       update-n -4       if animate? [ recolor ]       ;; edge patches have less than four neighbors, so some sand may fall off the edge       ask neighbors4 [         update-n 1         if animate? [ recolor ]       ]     ]     if animate? [ display ]     ;; add the current round of overloaded patches to our record of the avalanche     ;; the patch-set primitive combines agentsets, removing duplicates     set avalanche-patches (patch-set avalanche-patches overloaded-patches)     ;; find the set of patches which *might* be overloaded, so we will check     ;; them the next time through the loop     set active-patches patch-set [ neighbors4 ] of overloaded-patches   ]   report (list avalanche-patches iters) end  ;; patch procedure. input might be positive or negative, to add or subtract sand to update-n [ how-much ]   set n n + how-much   set total total + how-much end  to-report drop-patch   if drop-location = \"center\" [ report patch 0 0 ]   if drop-location = \"random\" [ report one-of patches ]   if drop-location = \"mouse-click\" and mouse-down? [     every 0.3 [ report patch mouse-xcor mouse-ycor ]   ]   report nobody end  ;; Save the patches state to push-n ;; patch procedure   set n-stack fput n n-stack end  ;; restore the patches state to pop-n ;; patch procedure   ; need to go through update-n to keep total statistic correct   update-n ((first n-stack) - n)   set n-stack but-last n-stack end   ; Public Domain: ; To the extent possible under law, Uri Wilensky has waived all ; copyright and related or neighboring rights to this model.')([{"x":330,"y":10,"width":412,"height":413,"dimensions":{"minPxcor":-50,"maxPxcor":50,"minPycor":-50,"maxPycor":50,"patchSize":4,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":90,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup-uniform\", world.observer.getGlobal(\"grains-per-patch\")); if (R === StopInterrupt) { return R; }","source":"setup-uniform grains-per-patch","x":5,"y":45,"width":145,"height":34,"display":"setup uniform","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","x":5,"y":100,"width":145,"height":33,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Average grain count', 'average', function() {     plotManager.plotValue(PrimChecks.math.div(44, 45, PrimChecks.validator.checkArg('/', 44, 45, 1, world.observer.getGlobal(\"total\")), PrimChecks.agentset.count(world.patches())));;   }); }","display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot total / count patches","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average grain count","x":0,"y":260,"width":310,"height":185,"xAxis":"ticks","yAxis":"grains","xmin":0,"xmax":1,"ymin":2,"ymax":2.1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot total / count patches","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() {   return PrimChecks.math.div(63, 64, PrimChecks.validator.checkArg('/', 63, 64, 1, world.observer.getGlobal(\"total-on-tick\")), PrimChecks.agentset.count(world.patches())); })","source":"total-on-tick / count patches","x":245,"y":215,"width":65,"height":45,"display":"average","precision":4,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"animate-avalanches?","x":155,"y":140,"width":170,"height":33,"display":"animate-avalanches?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"drop-location","x":5,"y":140,"width":145,"height":45,"display":"drop-location","choices":["center","random","mouse-click"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup-random\"); if (R === StopInterrupt) { return R; }","source":"setup-random","x":5,"y":10,"width":145,"height":33,"display":"setup random","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Avalanche sizes', 'default', function() {     if ((Prims.equality(PrimChecks.math.mod(42, 45, world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 62, 68, 12, world.observer.getGlobal(\"sizes\")))))) {       plotManager.resetPen();       let counts = PrimChecks.task.nValues(107, 115, PrimChecks.math.plus(119, 120, 1, PrimChecks.list.max(121, 124, PrimChecks.validator.checkArg('MAX', 121, 124, 8, world.observer.getGlobal(\"sizes\")))), PrimChecks.task.checked(132, 133, function() { return 0; }, \"[ 0 ]\", true, false)); ProcedurePrims.stack().currentContext().registerStringRunVar(\"COUNTS\", counts);       var R = PrimChecks.task.forEach(138, 145, PrimChecks.validator.checkArg('FOREACH', 138, 145, 8, world.observer.getGlobal(\"sizes\")), PrimChecks.task.checked(152, 153, function(theHsize) {         PrimChecks.procedure.runArgCountCheck('run', 152, 240, 1, arguments.length);         counts = PrimChecks.list.replaceItem(181, 193, PrimChecks.validator.checkArg('REPLACE-ITEM', 181, 193, 1, theHsize), PrimChecks.validator.checkArg('REPLACE-ITEM', 181, 193, 12, counts), PrimChecks.math.plus(213, 214, 1, PrimChecks.validator.checkArg('+', 213, 214, 1, PrimChecks.list.item(215, 219, PrimChecks.validator.checkArg('ITEM', 215, 219, 1, theHsize), PrimChecks.validator.checkArg('ITEM', 215, 219, 12, counts))))); ProcedurePrims.stack().currentContext().updateStringRunVar(\"COUNTS\", counts);       }, \"[ the-size -> set counts replace-item the-size counts 1 + item the-size counts ]\", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(138, 145, R); return R; }       let s = 0; ProcedurePrims.stack().currentContext().registerStringRunVar(\"S\", s);       var R = PrimChecks.task.forEach(253, 260, PrimChecks.validator.checkArg('FOREACH', 253, 260, 8, counts), PrimChecks.task.checked(268, 269, function(c) {         PrimChecks.procedure.runArgCountCheck('run', 268, 509, 1, arguments.length);         if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {           plotManager.plotPoint(PrimChecks.math.log(463, 466, PrimChecks.validator.checkArg('LOG', 463, 466, 1, s), 10), PrimChecks.math.log(474, 477, PrimChecks.validator.checkArg('LOG', 474, 477, 1, c), 10));         }         s = PrimChecks.math.plus(502, 503, PrimChecks.validator.checkArg('+', 502, 503, 1, s), 1); ProcedurePrims.stack().currentContext().updateStringRunVar(\"S\", s);       }, \"[ c -> if s > 0 and c > 0 [ plotxy log s 10 log c 10 ] set s s + 1 ]\", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(253, 260, R); return R; }     };   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? sizes [   plot-pen-reset   let counts n-values (1 + max sizes) [0]   foreach sizes [ the-size ->     set counts replace-item the-size counts (1 + item the-size counts)   ]   let s 0   foreach counts [ c ->     ; We only care about plotting avalanches (s > 0), but dropping s = 0     ; from the counts list is actually more awkward than just ignoring it     if (s > 0 and c > 0) [       plotxy (log s 10) (log c 10)     ]     set s s + 1   ] ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avalanche sizes","x":755,"y":240,"width":200,"height":150,"xAxis":"log size","yAxis":"log count","xmin":0,"xmax":1,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? sizes [   plot-pen-reset   let counts n-values (1 + max sizes) [0]   foreach sizes [ the-size ->     set counts replace-item the-size counts (1 + item the-size counts)   ]   let s 0   foreach counts [ c ->     ; We only care about plotting avalanches (s > 0), but dropping s = 0     ; from the counts list is actually more awkward than just ignoring it     if (s > 0 and c > 0) [       plotxy (log s 10) (log c 10)     ]     set s s + 1   ] ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.setGlobal(\"sizes\", []); world.observer.setGlobal(\"lifetimes\", []); plotManager.setCurrentPlot(\"Avalanche lifetimes\"); plotManager.setYRange(0, 1); plotManager.setXRange(0, 1); plotManager.setCurrentPlot(\"Avalanche sizes\"); plotManager.setYRange(0, 1); plotManager.setXRange(0, 1);","source":"set sizes [] set lifetimes [] set-current-plot \"Avalanche lifetimes\" set-plot-y-range 0 1 set-plot-x-range 0 1 set-current-plot \"Avalanche sizes\" set-plot-y-range 0 1 set-plot-x-range 0 1","x":755,"y":400,"width":200,"height":33,"display":"clear size and lifetime data","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Avalanche lifetimes', 'default', function() {     if ((Prims.equality(PrimChecks.math.mod(42, 45, world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 62, 68, 12, world.observer.getGlobal(\"lifetimes\")))))) {       plotManager.resetPen();       let counts = PrimChecks.task.nValues(111, 119, PrimChecks.math.plus(123, 124, 1, PrimChecks.list.max(125, 128, PrimChecks.validator.checkArg('MAX', 125, 128, 8, world.observer.getGlobal(\"lifetimes\")))), PrimChecks.task.checked(140, 141, function() { return 0; }, \"[ 0 ]\", true, false)); ProcedurePrims.stack().currentContext().registerStringRunVar(\"COUNTS\", counts);       var R = PrimChecks.task.forEach(146, 153, PrimChecks.validator.checkArg('FOREACH', 146, 153, 8, world.observer.getGlobal(\"lifetimes\")), PrimChecks.task.checked(164, 165, function(lifetime) {         PrimChecks.procedure.runArgCountCheck('run', 164, 252, 1, arguments.length);         counts = PrimChecks.list.replaceItem(193, 205, PrimChecks.validator.checkArg('REPLACE-ITEM', 193, 205, 1, lifetime), PrimChecks.validator.checkArg('REPLACE-ITEM', 193, 205, 12, counts), PrimChecks.math.plus(225, 226, 1, PrimChecks.validator.checkArg('+', 225, 226, 1, PrimChecks.list.item(227, 231, PrimChecks.validator.checkArg('ITEM', 227, 231, 1, lifetime), PrimChecks.validator.checkArg('ITEM', 227, 231, 12, counts))))); ProcedurePrims.stack().currentContext().updateStringRunVar(\"COUNTS\", counts);       }, \"[ lifetime -> set counts replace-item lifetime counts 1 + item lifetime counts ]\", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(146, 153, R); return R; }       let l = 0; ProcedurePrims.stack().currentContext().registerStringRunVar(\"L\", l);       var R = PrimChecks.task.forEach(265, 272, PrimChecks.validator.checkArg('FOREACH', 265, 272, 8, counts), PrimChecks.task.checked(280, 281, function(c) {         PrimChecks.procedure.runArgCountCheck('run', 280, 521, 1, arguments.length);         if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {           plotManager.plotPoint(PrimChecks.math.log(475, 478, PrimChecks.validator.checkArg('LOG', 475, 478, 1, l), 10), PrimChecks.math.log(486, 489, PrimChecks.validator.checkArg('LOG', 486, 489, 1, c), 10));         }         l = PrimChecks.math.plus(514, 515, PrimChecks.validator.checkArg('+', 514, 515, 1, l), 1); ProcedurePrims.stack().currentContext().updateStringRunVar(\"L\", l);       }, \"[ c -> if l > 0 and c > 0 [ plotxy log l 10 log c 10 ] set l l + 1 ]\", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(265, 272, R); return R; }     };   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? lifetimes [   plot-pen-reset   let counts n-values (1 + max lifetimes) [0]   foreach lifetimes [ lifetime ->     set counts replace-item lifetime counts (1 + item lifetime counts)   ]   let l 0   foreach counts [ c ->     ; We only care about plotting avalanches (l > 0), but dropping l = 0     ; from the counts list is actually more awkward than just ignoring it     if (l > 0 and c > 0) [       plotxy (log l 10) (log c 10)     ]     set l l + 1   ] ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avalanche lifetimes","x":755,"y":80,"width":200,"height":150,"xAxis":"log lifetime","yAxis":"log count","xmin":0,"xmax":1,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? lifetimes [   plot-pen-reset   let counts n-values (1 + max lifetimes) [0]   foreach lifetimes [ lifetime ->     set counts replace-item lifetime counts (1 + item lifetime counts)   ]   let l 0   foreach counts [ c ->     ; We only care about plotting avalanches (l > 0), but dropping l = 0     ; from the counts list is actually more awkward than just ignoring it     if (l > 0 and c > 0) [       plotxy (log l 10) (log c 10)     ]     set l l + 1   ] ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"explore\"); if (R === StopInterrupt) { return R; }","source":"explore","x":5,"y":210,"width":145,"height":33,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","x":155,"y":100,"width":170,"height":33,"display":"go once","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 3; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 1; })","variable":"grains-per-patch","x":155,"y":45,"width":170,"height":33,"display":"grains-per-patch","min":"0","max":"3","default":0,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["animate-avalanches?", "drop-location", "grains-per-patch", "total", "total-on-tick", "sizes", "last-size", "lifetimes", "last-lifetime", "selected-patch", "default-color", "fired-color", "selected-color"], ["animate-avalanches?", "drop-location", "grains-per-patch"], ["n", "n-stack", "base-color"], -50, 50, -50, 50, 4, false, false, turtleShapes, linkShapes, function(){});
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
var ProcedurePrims = workspace.procedurePrims;
var RandomPrims = workspace.randomPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var StringPrims = workspace.stringPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
ProcedurePrims.defineCommand("setup", 1265, 1703, (function(setupHtask) {
  world.clearAll();
  world.observer.setGlobal("default-color", 105);
  world.observer.setGlobal("fired-color", 15);
  world.observer.setGlobal("selected-color", 55);
  world.observer.setGlobal("selected-patch", Nobody);
  var R = ProcedurePrims.ask(world.patches(), function() {
    PrimChecks.patch.setVariable(1424, 1425, "n", (ProcedurePrims.stack().currentContext().registerStringRunArg("SETUP-TASK", setupHtask),
    PrimChecks.procedure.runResult(1426, 1435, PrimChecks.validator.checkArg('RUNRESULT', 1426, 1435, 4100, setupHtask))));
    PrimChecks.patch.setVariable(1455, 1462, "n-stack", []);
    PrimChecks.patch.setVariable(1474, 1484, "base-color", world.observer.getGlobal("default-color"));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(1402, 1405, R); return R; }
  let ignore = PrimChecks.procedure.callReporter(1516, 1525, "stabilize", false); ProcedurePrims.stack().currentContext().registerStringRunVar("IGNORE", ignore);
  var R = ProcedurePrims.ask(world.patches(), function() { var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(1534, 1537, R); return R; }
  world.observer.setGlobal("total", PrimChecks.list.sum(1570, 1573, PrimChecks.validator.checkArg('SUM', 1570, 1573, 8, PrimChecks.agentset.of(world.patches(), function() { return PrimChecks.patch.getVariable(1576, 1577, "n"); }))));
  world.observer.setGlobal("sizes", []);
  world.observer.setGlobal("lifetimes", []);
  world.ticker.reset();
}))
ProcedurePrims.defineCommand("setup-uniform", 1787, 1834, (function(initial) {
  var R = ProcedurePrims.callCommand("setup", PrimChecks.task.checked(1819, 1820, function() { return initial; }, "[ -> initial ]", true, false)); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("setup-random", 1899, 1936, (function() {
  var R = ProcedurePrims.callCommand("setup", PrimChecks.task.checked(1920, 1921, function() { return RandomPrims.randomLong(4); }, "[ -> random 4 ]", true, false)); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("recolor", 1996, 2046, (function() {
  PrimChecks.patch.setVariable(2010, 2016, "pcolor", ColorModel.scaleColor(PrimChecks.patch.getVariable(2029, 2039, "base-color"), PrimChecks.patch.getVariable(2040, 2041, "n"), 0, 4));
}))
ProcedurePrims.defineCommand("go", 2054, 2822, (function() {
  let drop = PrimChecks.procedure.callReporter(2068, 2078, "drop-patch"); ProcedurePrims.stack().currentContext().registerStringRunVar("DROP", drop);
  if (!Prims.equality(drop, Nobody)) {
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 2105, 2108, 1904, drop), function() {
      var R = ProcedurePrims.callCommand("update-n", 1); if (R === DeathInterrupt) { return R; }
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2105, 2108, R); return R; }
    let results = PrimChecks.procedure.callReporter(2169, 2178, "stabilize", world.observer.getGlobal("animate-avalanches?")); ProcedurePrims.stack().currentContext().registerStringRunVar("RESULTS", results);
    let avalancheHpatches = PrimChecks.list.first(2225, 2230, PrimChecks.validator.checkArg('FIRST', 2225, 2230, 12, results)); ProcedurePrims.stack().currentContext().registerStringRunVar("AVALANCHE-PATCHES", avalancheHpatches);
    let lifetime = PrimChecks.list.last(2256, 2260, PrimChecks.validator.checkArg('LAST', 2256, 2260, 12, results)); ProcedurePrims.stack().currentContext().registerStringRunVar("LIFETIME", lifetime);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 2360, 2364, 112, avalancheHpatches))) {
      world.observer.setGlobal("sizes", PrimChecks.list.lput(PrimChecks.agentset.count(PrimChecks.validator.checkArg('COUNT', 2407, 2412, 112, avalancheHpatches)), PrimChecks.validator.checkArg('LPUT', 2401, 2405, 8, world.observer.getGlobal("sizes"))));
      world.observer.setGlobal("lifetimes", PrimChecks.list.lput(lifetime, PrimChecks.validator.checkArg('LPUT', 2458, 2462, 8, world.observer.getGlobal("lifetimes"))));
    }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 2579, 2582, 1904, avalancheHpatches), function() {
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
      var R = ProcedurePrims.ask(SelfManager.self().getNeighbors4(), function() { var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2611, 2614, R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2579, 2582, R); return R; }
    Prims.display();
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 2683, 2686, 1904, avalancheHpatches), function() {
      PrimChecks.patch.setVariable(2711, 2721, "base-color", world.observer.getGlobal("default-color"));
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2683, 2686, R); return R; }
    world.observer.setGlobal("total-on-tick", world.observer.getGlobal("total"));
    world.ticker.tick();
  }
}))
ProcedurePrims.defineCommand("explore", 2830, 3367, (function() {
  if (MousePrims.isInside()) {
    let p = world.getPatchAt(MousePrims.getX(), MousePrims.getY()); ProcedurePrims.stack().currentContext().registerStringRunVar("P", p);
    world.observer.setGlobal("selected-patch", p);
    var R = ProcedurePrims.ask(world.patches(), function() { var R = ProcedurePrims.callCommand("push-n"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2930, 2933, R); return R; }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 2957, 2960, 1904, world.observer.getGlobal("selected-patch")), function() { var R = ProcedurePrims.callCommand("update-n", 1); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2957, 2960, R); return R; }
    let results = PrimChecks.procedure.callReporter(3007, 3016, "stabilize", false); ProcedurePrims.stack().currentContext().registerStringRunVar("RESULTS", results);
    var R = ProcedurePrims.ask(world.patches(), function() { var R = ProcedurePrims.callCommand("pop-n"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3027, 3030, R); return R; }
    var R = ProcedurePrims.ask(world.patches(), function() {
      PrimChecks.patch.setVariable(3071, 3081, "base-color", world.observer.getGlobal("default-color"));
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3053, 3056, R); return R; }
    let avalancheHpatches = PrimChecks.list.first(3132, 3137, PrimChecks.validator.checkArg('FIRST', 3132, 3137, 12, results)); ProcedurePrims.stack().currentContext().registerStringRunVar("AVALANCHE-PATCHES", avalancheHpatches);
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 3150, 3153, 1904, avalancheHpatches), function() {
      PrimChecks.patch.setVariable(3178, 3188, "base-color", world.observer.getGlobal("selected-color"));
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3150, 3153, R); return R; }
    Prims.display();
  }
  else {
    if (!Prims.equality(world.observer.getGlobal("selected-patch"), Nobody)) {
      world.observer.setGlobal("selected-patch", Nobody);
      var R = ProcedurePrims.ask(world.patches(), function() {
        PrimChecks.patch.setVariable(3322, 3332, "base-color", world.observer.getGlobal("default-color"));
        var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3304, 3307, R); return R; }
    }
  }
}))
ProcedurePrims.defineReporter("stabilize", 3485, 4862, (function(animate_Q) {
  let activeHpatches = PrimChecks.agentset.with(3535, 3539, world.patches(), function() { return Prims.gt(PrimChecks.patch.getVariable(3542, 3543, "n"), 3); }); ProcedurePrims.stack().currentContext().registerStringRunVar("ACTIVE-PATCHES", activeHpatches);
  let iters = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("ITERS", iters);
  let avalancheHpatches = new PatchSet([], world); ProcedurePrims.stack().currentContext().registerStringRunVar("AVALANCHE-PATCHES", avalancheHpatches);
  while (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 3904, 3908, 112, activeHpatches))) {
    let overloadedHpatches = PrimChecks.agentset.with(3970, 3974, PrimChecks.validator.checkArg('WITH', 3970, 3974, 112, activeHpatches), function() { return Prims.gt(PrimChecks.patch.getVariable(3977, 3978, "n"), 3); }); ProcedurePrims.stack().currentContext().registerStringRunVar("OVERLOADED-PATCHES", overloadedHpatches);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 3992, 3996, 112, overloadedHpatches))) {
      iters = PrimChecks.math.plus(4040, 4041, PrimChecks.validator.checkArg('+', 4040, 4041, 1, iters), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("ITERS", iters);
    }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 4054, 4057, 1904, overloadedHpatches), function() {
      PrimChecks.patch.setVariable(4089, 4099, "base-color", world.observer.getGlobal("fired-color"));
      var R = ProcedurePrims.callCommand("update-n", -4); if (R === DeathInterrupt) { return R; }
      if (animate_Q) {
        var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
      }
      var R = ProcedurePrims.ask(SelfManager.self().getNeighbors4(), function() {
        var R = ProcedurePrims.callCommand("update-n", 1); if (R === DeathInterrupt) { return R; }
        if (animate_Q) {
          var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
        }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(4290, 4293, R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(4054, 4057, R); return R; }
    if (animate_Q) {
      Prims.display();
    }
    avalancheHpatches = PrimChecks.agentset.patchSet(4580, 4589, avalancheHpatches, overloadedHpatches); ProcedurePrims.stack().currentContext().updateStringRunVar("AVALANCHE-PATCHES", avalancheHpatches);
    activeHpatches = PrimChecks.agentset.patchSet(4771, 4780, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 4796, 4798, 1904, overloadedHpatches), function() { return SelfManager.self().getNeighbors4(); })); ProcedurePrims.stack().currentContext().updateStringRunVar("ACTIVE-PATCHES", activeHpatches);
  }
  return PrimChecks.procedure.report(4824, 4830, ListPrims.list(avalancheHpatches, iters));
}))
ProcedurePrims.defineCommand("update-n", 4951, 5023, (function(howHmuch) {
  PrimChecks.patch.setVariable(4979, 4980, "n", PrimChecks.math.plus(4983, 4984, PrimChecks.validator.checkArg('+', 4983, 4984, 1, PrimChecks.patch.getVariable(4981, 4982, "n")), PrimChecks.validator.checkArg('+', 4983, 4984, 1, howHmuch)));
  world.observer.setGlobal("total", PrimChecks.math.plus(5012, 5013, PrimChecks.validator.checkArg('+', 5012, 5013, 1, world.observer.getGlobal("total")), PrimChecks.validator.checkArg('+', 5012, 5013, 1, howHmuch)));
}))
ProcedurePrims.defineReporter("drop-patch", 5038, 5282, (function() {
  if (Prims.equality(world.observer.getGlobal("drop-location"), "center")) {
    return PrimChecks.procedure.report(5081, 5087, world.getPatchAt(0, 0));
  }
  if (Prims.equality(world.observer.getGlobal("drop-location"), "random")) {
    return PrimChecks.procedure.report(5132, 5138, PrimChecks.list.oneOf(5139, 5145, world.patches()));
  }
  if ((Prims.equality(world.observer.getGlobal("drop-location"), "mouse-click") && MousePrims.isDown())) {
    if (Prims.isThrottleTimeElapsed("dropHpatch_0", workspace.selfManager.self(), 0.3)) {
      Prims.resetThrottleTimerFor("dropHpatch_0", workspace.selfManager.self());
      return PrimChecks.procedure.report(5225, 5231, world.getPatchAt(MousePrims.getX(), MousePrims.getY()));
    }
  }
  return PrimChecks.procedure.report(5268, 5274, Nobody);
}))
ProcedurePrims.defineCommand("push-n", 5316, 5371, (function() {
  PrimChecks.patch.setVariable(5348, 5355, "n-stack", PrimChecks.list.fput(PrimChecks.patch.getVariable(5361, 5362, "n"), PrimChecks.validator.checkArg('FPUT', 5356, 5360, 8, PrimChecks.patch.getVariable(5363, 5370, "n-stack"))));
}))
ProcedurePrims.defineCommand("pop-n", 5408, 5561, (function() {
  var R = ProcedurePrims.callCommand("update-n", PrimChecks.math.minus(5525, 5526, PrimChecks.validator.checkArg('-', 5525, 5526, 1, PrimChecks.list.first(5510, 5515, PrimChecks.validator.checkArg('FIRST', 5510, 5515, 12, PrimChecks.patch.getVariable(5516, 5523, "n-stack")))), PrimChecks.validator.checkArg('-', 5525, 5526, 1, PrimChecks.patch.getVariable(5527, 5528, "n")))); if (R === DeathInterrupt) { return R; }
  PrimChecks.patch.setVariable(5536, 5543, "n-stack", PrimChecks.list.butLast('but-last', 5544, 5552, PrimChecks.validator.checkArg('BUT-LAST', 5544, 5552, 12, PrimChecks.patch.getVariable(5553, 5560, "n-stack"))));
}))
world.observer.setGlobal("animate-avalanches?", false);
world.observer.setGlobal("drop-location", "random");
world.observer.setGlobal("grains-per-patch", 0);