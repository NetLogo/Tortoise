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
      plotManager.plotValue(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal("total")), PrimChecks.agentset.count(world.patches())));;
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
      if ((Prims.equality(PrimChecks.math.mod(world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 12, world.observer.getGlobal("sizes")))))) {
        plotManager.resetPen();
        let counts = PrimChecks.task.nValues(PrimChecks.math.plus(1, PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, world.observer.getGlobal("sizes")))), PrimChecks.task.checked(function() { return 0; }, "[ 0 ]", true, false)); ProcedurePrims.stack().currentContext().registerStringRunVar("COUNTS", counts);
        var R = PrimChecks.task.forEach(PrimChecks.validator.checkArg('FOREACH', 8, world.observer.getGlobal("sizes")), PrimChecks.task.checked(function(theHsize) {
          PrimChecks.procedure.runArgCountCheck('run', 1, arguments.length);
          counts = PrimChecks.list.replaceItem(PrimChecks.validator.checkArg('REPLACE-ITEM', 1, theHsize), PrimChecks.validator.checkArg('REPLACE-ITEM', 12, counts), PrimChecks.math.plus(1, PrimChecks.validator.checkArg('+', 1, PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, theHsize), PrimChecks.validator.checkArg('ITEM', 12, counts))))); ProcedurePrims.stack().currentContext().updateStringRunVar("COUNTS", counts);
        }, "[ the-size -> set counts replace-item the-size counts 1 + item the-size counts ]", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
        let s = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("S", s);
        var R = PrimChecks.task.forEach(PrimChecks.validator.checkArg('FOREACH', 8, counts), PrimChecks.task.checked(function(c) {
          PrimChecks.procedure.runArgCountCheck('run', 1, arguments.length);
          if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {
            plotManager.plotPoint(PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, s), 10), PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, c), 10));
          }
          s = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, s), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("S", s);
        }, "[ c -> if s > 0 and c > 0 [ plotxy log s 10 log c 10 ] set s s + 1 ]", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
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
      if ((Prims.equality(PrimChecks.math.mod(world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 12, world.observer.getGlobal("lifetimes")))))) {
        plotManager.resetPen();
        let counts = PrimChecks.task.nValues(PrimChecks.math.plus(1, PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, world.observer.getGlobal("lifetimes")))), PrimChecks.task.checked(function() { return 0; }, "[ 0 ]", true, false)); ProcedurePrims.stack().currentContext().registerStringRunVar("COUNTS", counts);
        var R = PrimChecks.task.forEach(PrimChecks.validator.checkArg('FOREACH', 8, world.observer.getGlobal("lifetimes")), PrimChecks.task.checked(function(lifetime) {
          PrimChecks.procedure.runArgCountCheck('run', 1, arguments.length);
          counts = PrimChecks.list.replaceItem(PrimChecks.validator.checkArg('REPLACE-ITEM', 1, lifetime), PrimChecks.validator.checkArg('REPLACE-ITEM', 12, counts), PrimChecks.math.plus(1, PrimChecks.validator.checkArg('+', 1, PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, lifetime), PrimChecks.validator.checkArg('ITEM', 12, counts))))); ProcedurePrims.stack().currentContext().updateStringRunVar("COUNTS", counts);
        }, "[ lifetime -> set counts replace-item lifetime counts 1 + item lifetime counts ]", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
        let l = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("L", l);
        var R = PrimChecks.task.forEach(PrimChecks.validator.checkArg('FOREACH', 8, counts), PrimChecks.task.checked(function(c) {
          PrimChecks.procedure.runArgCountCheck('run', 1, arguments.length);
          if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {
            plotManager.plotPoint(PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, l), 10), PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, c), 10));
          }
          l = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, l), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("L", l);
        }, "[ c -> if l > 0 and c > 0 [ plotxy log l 10 log c 10 ] set l l + 1 ]", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
      };
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "log lifetime", "log count", false, true, 0, 1, 0, 1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [   ;; By always keeping track of how much sand is on the table, we can compute the   ;; average number of grains per patch instantly, without having to count.   total   ;; We don\'t want the average monitor to updating wildly, so we only have it   ;; update every tick.   total-on-tick   ;; Keep track of avalanche sizes so we can histogram them   sizes   ;; Size of the most recent run   last-size   ;; Keep track of avalanche lifetimes so we can histogram them   lifetimes   ;; Lifetime of the most recent run   last-lifetime   ;; The patch the mouse hovers over while exploring   selected-patch   ;; These colors define how the patches look normally, after being fired, and in   ;; explore mode.   default-color   fired-color   selected-color ]  patches-own [   ;; how many grains of sand are on this patch   n   ;; A list of stored n so that we can easily pop back to a previous state. See   ;; the NETLOGO FEATURES section of the Info tab for a description of how stacks   ;; work   n-stack   ;; Determines what color to scale when coloring the patch.   base-color ]  ;; The input task says what each patch should do at setup time ;; to compute its initial value for n.  (See the Tasks section ;; of the Programming Guide for information on tasks.) to setup [setup-task]   clear-all    set default-color blue   set fired-color red   set selected-color green    set selected-patch nobody   ask patches [     set n runresult setup-task     set n-stack []     set base-color default-color   ]   let ignore stabilize false   ask patches [ recolor ]   set total sum [ n ] of patches   ;; set this to the empty list so we can add items to it later   set sizes []   set lifetimes []   reset-ticks end  ;; For example, \"setup-uniform 2\" gives every patch a task which reports 2. to setup-uniform [initial]   setup [ -> initial ] end  ;; Every patch uses a task which reports a random value. to setup-random   setup [ -> random 4 ] end  ;; patch procedure; the colors are like a stoplight to recolor   set pcolor scale-color base-color n 0 4 end  to go   let drop drop-patch   if drop != nobody [     ask drop [       update-n 1       recolor     ]     let results stabilize animate-avalanches?     let avalanche-patches first results     let lifetime last results      ;; compute the size of the avalanche and throw it on the end of the sizes list     if any? avalanche-patches [       set sizes lput (count avalanche-patches) sizes       set lifetimes lput lifetime lifetimes     ]     ;; Display the avalanche and guarantee that the border of the avalanche is updated     ask avalanche-patches [ recolor ask neighbors4 [ recolor ] ]     display     ;; Erase the avalanche     ask avalanche-patches [ set base-color default-color recolor ]     ;; Updates the average monitor     set total-on-tick total     tick   ] end  to explore   ifelse mouse-inside? [     let p patch mouse-xcor mouse-ycor     set selected-patch p     ask patches [ push-n ]     ask selected-patch [ update-n 1 ]     let results stabilize false     ask patches [ pop-n ]     ask patches [ set base-color default-color recolor ]     let avalanche-patches first results     ask avalanche-patches [ set base-color selected-color recolor ]     display   ] [     if selected-patch != nobody [       set selected-patch nobody       ask patches [ set base-color default-color recolor ]     ]   ] end  ;; Stabilizes the sandpile. Reports which sites fired and how many iterations it took to ;; stabilize. to-report stabilize [animate?]   let active-patches patches with [ n > 3 ]    ;; The number iterations the avalanche has gone for. Use to calculate lifetimes.   let iters 0    ;; we want to count how many patches became overloaded at some point   ;; during the avalanche, and also flash those patches. so as we go, we\'ll   ;; keep adding more patches to to this initially empty set.   let avalanche-patches no-patches    while [ any? active-patches ] [     let overloaded-patches active-patches with [ n > 3 ]     if any? overloaded-patches [       set iters iters + 1     ]     ask overloaded-patches [       set base-color fired-color       ;; subtract 4 from this patch       update-n -4       if animate? [ recolor ]       ;; edge patches have less than four neighbors, so some sand may fall off the edge       ask neighbors4 [         update-n 1         if animate? [ recolor ]       ]     ]     if animate? [ display ]     ;; add the current round of overloaded patches to our record of the avalanche     ;; the patch-set primitive combines agentsets, removing duplicates     set avalanche-patches (patch-set avalanche-patches overloaded-patches)     ;; find the set of patches which *might* be overloaded, so we will check     ;; them the next time through the loop     set active-patches patch-set [ neighbors4 ] of overloaded-patches   ]   report (list avalanche-patches iters) end  ;; patch procedure. input might be positive or negative, to add or subtract sand to update-n [ how-much ]   set n n + how-much   set total total + how-much end  to-report drop-patch   if drop-location = \"center\" [ report patch 0 0 ]   if drop-location = \"random\" [ report one-of patches ]   if drop-location = \"mouse-click\" and mouse-down? [     every 0.3 [ report patch mouse-xcor mouse-ycor ]   ]   report nobody end  ;; Save the patches state to push-n ;; patch procedure   set n-stack fput n n-stack end  ;; restore the patches state to pop-n ;; patch procedure   ; need to go through update-n to keep total statistic correct   update-n ((first n-stack) - n)   set n-stack but-last n-stack end   ; Public Domain: ; To the extent possible under law, Uri Wilensky has waived all ; copyright and related or neighboring rights to this model.')([{"left":330,"top":10,"right":742,"bottom":423,"dimensions":{"minPxcor":-50,"maxPxcor":50,"minPycor":-50,"maxPycor":50,"patchSize":4,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":90,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup-uniform\", world.observer.getGlobal(\"grains-per-patch\")); if (R === StopInterrupt) { return R; }","source":"setup-uniform grains-per-patch","left":5,"top":45,"right":150,"bottom":79,"display":"setup uniform","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","left":5,"top":100,"right":150,"bottom":133,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Average grain count', 'average', function() {     plotManager.plotValue(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal(\"total\")), PrimChecks.agentset.count(world.patches())));;   }); }","display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot total / count patches","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average grain count","left":0,"top":260,"right":310,"bottom":445,"xAxis":"ticks","yAxis":"grains","xmin":0,"xmax":1,"ymin":2,"ymax":2.1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot total / count patches","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal(\"total-on-tick\")), PrimChecks.agentset.count(world.patches()))","source":"total-on-tick / count patches","left":245,"top":215,"right":310,"bottom":260,"display":"average","precision":4,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"animate-avalanches?","left":155,"top":140,"right":325,"bottom":173,"display":"animate-avalanches?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"drop-location","left":5,"top":140,"right":150,"bottom":185,"display":"drop-location","choices":["center","random","mouse-click"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup-random\"); if (R === StopInterrupt) { return R; }","source":"setup-random","left":5,"top":10,"right":150,"bottom":43,"display":"setup random","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Avalanche sizes', 'default', function() {     if ((Prims.equality(PrimChecks.math.mod(world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 12, world.observer.getGlobal(\"sizes\")))))) {       plotManager.resetPen();       let counts = PrimChecks.task.nValues(PrimChecks.math.plus(1, PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, world.observer.getGlobal(\"sizes\")))), PrimChecks.task.checked(function() { return 0; }, \"[ 0 ]\", true, false)); ProcedurePrims.stack().currentContext().registerStringRunVar(\"COUNTS\", counts);       var R = PrimChecks.task.forEach(PrimChecks.validator.checkArg('FOREACH', 8, world.observer.getGlobal(\"sizes\")), PrimChecks.task.checked(function(theHsize) {         PrimChecks.procedure.runArgCountCheck('run', 1, arguments.length);         counts = PrimChecks.list.replaceItem(PrimChecks.validator.checkArg('REPLACE-ITEM', 1, theHsize), PrimChecks.validator.checkArg('REPLACE-ITEM', 12, counts), PrimChecks.math.plus(1, PrimChecks.validator.checkArg('+', 1, PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, theHsize), PrimChecks.validator.checkArg('ITEM', 12, counts))))); ProcedurePrims.stack().currentContext().updateStringRunVar(\"COUNTS\", counts);       }, \"[ the-size -> set counts replace-item the-size counts 1 + item the-size counts ]\", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }       let s = 0; ProcedurePrims.stack().currentContext().registerStringRunVar(\"S\", s);       var R = PrimChecks.task.forEach(PrimChecks.validator.checkArg('FOREACH', 8, counts), PrimChecks.task.checked(function(c) {         PrimChecks.procedure.runArgCountCheck('run', 1, arguments.length);         if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {           plotManager.plotPoint(PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, s), 10), PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, c), 10));         }         s = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, s), 1); ProcedurePrims.stack().currentContext().updateStringRunVar(\"S\", s);       }, \"[ c -> if s > 0 and c > 0 [ plotxy log s 10 log c 10 ] set s s + 1 ]\", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }     };   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? sizes [   plot-pen-reset   let counts n-values (1 + max sizes) [0]   foreach sizes [ the-size ->     set counts replace-item the-size counts (1 + item the-size counts)   ]   let s 0   foreach counts [ c ->     ; We only care about plotting avalanches (s > 0), but dropping s = 0     ; from the counts list is actually more awkward than just ignoring it     if (s > 0 and c > 0) [       plotxy (log s 10) (log c 10)     ]     set s s + 1   ] ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avalanche sizes","left":755,"top":240,"right":955,"bottom":390,"xAxis":"log size","yAxis":"log count","xmin":0,"xmax":1,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? sizes [   plot-pen-reset   let counts n-values (1 + max sizes) [0]   foreach sizes [ the-size ->     set counts replace-item the-size counts (1 + item the-size counts)   ]   let s 0   foreach counts [ c ->     ; We only care about plotting avalanches (s > 0), but dropping s = 0     ; from the counts list is actually more awkward than just ignoring it     if (s > 0 and c > 0) [       plotxy (log s 10) (log c 10)     ]     set s s + 1   ] ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.setGlobal(\"sizes\", []); world.observer.setGlobal(\"lifetimes\", []); plotManager.setCurrentPlot(\"Avalanche lifetimes\"); plotManager.setYRange(0, 1); plotManager.setXRange(0, 1); plotManager.setCurrentPlot(\"Avalanche sizes\"); plotManager.setYRange(0, 1); plotManager.setXRange(0, 1);","source":"set sizes [] set lifetimes [] set-current-plot \"Avalanche lifetimes\" set-plot-y-range 0 1 set-plot-x-range 0 1 set-current-plot \"Avalanche sizes\" set-plot-y-range 0 1 set-plot-x-range 0 1","left":755,"top":400,"right":955,"bottom":433,"display":"clear size and lifetime data","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Avalanche lifetimes', 'default', function() {     if ((Prims.equality(PrimChecks.math.mod(world.ticker.tickCount(), 100), 0) && PrimChecks.math.not(PrimChecks.list.empty(PrimChecks.validator.checkArg('EMPTY?', 12, world.observer.getGlobal(\"lifetimes\")))))) {       plotManager.resetPen();       let counts = PrimChecks.task.nValues(PrimChecks.math.plus(1, PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, world.observer.getGlobal(\"lifetimes\")))), PrimChecks.task.checked(function() { return 0; }, \"[ 0 ]\", true, false)); ProcedurePrims.stack().currentContext().registerStringRunVar(\"COUNTS\", counts);       var R = PrimChecks.task.forEach(PrimChecks.validator.checkArg('FOREACH', 8, world.observer.getGlobal(\"lifetimes\")), PrimChecks.task.checked(function(lifetime) {         PrimChecks.procedure.runArgCountCheck('run', 1, arguments.length);         counts = PrimChecks.list.replaceItem(PrimChecks.validator.checkArg('REPLACE-ITEM', 1, lifetime), PrimChecks.validator.checkArg('REPLACE-ITEM', 12, counts), PrimChecks.math.plus(1, PrimChecks.validator.checkArg('+', 1, PrimChecks.list.item(PrimChecks.validator.checkArg('ITEM', 1, lifetime), PrimChecks.validator.checkArg('ITEM', 12, counts))))); ProcedurePrims.stack().currentContext().updateStringRunVar(\"COUNTS\", counts);       }, \"[ lifetime -> set counts replace-item lifetime counts 1 + item lifetime counts ]\", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }       let l = 0; ProcedurePrims.stack().currentContext().registerStringRunVar(\"L\", l);       var R = PrimChecks.task.forEach(PrimChecks.validator.checkArg('FOREACH', 8, counts), PrimChecks.task.checked(function(c) {         PrimChecks.procedure.runArgCountCheck('run', 1, arguments.length);         if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {           plotManager.plotPoint(PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, l), 10), PrimChecks.math.log(PrimChecks.validator.checkArg('LOG', 1, c), 10));         }         l = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, l), 1); ProcedurePrims.stack().currentContext().updateStringRunVar(\"L\", l);       }, \"[ c -> if l > 0 and c > 0 [ plotxy log l 10 log c 10 ] set l l + 1 ]\", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }     };   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? lifetimes [   plot-pen-reset   let counts n-values (1 + max lifetimes) [0]   foreach lifetimes [ lifetime ->     set counts replace-item lifetime counts (1 + item lifetime counts)   ]   let l 0   foreach counts [ c ->     ; We only care about plotting avalanches (l > 0), but dropping l = 0     ; from the counts list is actually more awkward than just ignoring it     if (l > 0 and c > 0) [       plotxy (log l 10) (log c 10)     ]     set l l + 1   ] ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avalanche lifetimes","left":755,"top":80,"right":955,"bottom":230,"xAxis":"log lifetime","yAxis":"log count","xmin":0,"xmax":1,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? lifetimes [   plot-pen-reset   let counts n-values (1 + max lifetimes) [0]   foreach lifetimes [ lifetime ->     set counts replace-item lifetime counts (1 + item lifetime counts)   ]   let l 0   foreach counts [ c ->     ; We only care about plotting avalanches (l > 0), but dropping l = 0     ; from the counts list is actually more awkward than just ignoring it     if (l > 0 and c > 0) [       plotxy (log l 10) (log c 10)     ]     set l l + 1   ] ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"explore\"); if (R === StopInterrupt) { return R; }","source":"explore","left":5,"top":210,"right":150,"bottom":243,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","left":155,"top":100,"right":325,"bottom":133,"display":"go once","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"3","compiledStep":"1","variable":"grains-per-patch","left":155,"top":45,"right":325,"bottom":78,"display":"grains-per-patch","min":"0","max":"3","default":0,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["animate-avalanches?", "drop-location", "grains-per-patch", "total", "total-on-tick", "sizes", "last-size", "lifetimes", "last-lifetime", "selected-patch", "default-color", "fired-color", "selected-color"], ["animate-avalanches?", "drop-location", "grains-per-patch"], ["n", "n-stack", "base-color"], -50, 50, -50, 50, 4, false, false, turtleShapes, linkShapes, function(){});
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
    PrimChecks.patch.setVariable("n", (ProcedurePrims.stack().currentContext().registerStringRunArg("SETUP-TASK", setupHtask),
    PrimChecks.procedure.runResult(PrimChecks.validator.checkArg('RUNRESULT', 4100, setupHtask))));
    PrimChecks.patch.setVariable("n-stack", []);
    PrimChecks.patch.setVariable("base-color", world.observer.getGlobal("default-color"));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  let ignore = PrimChecks.procedure.callReporter("stabilize", false); ProcedurePrims.stack().currentContext().registerStringRunVar("IGNORE", ignore);
  var R = ProcedurePrims.ask(world.patches(), function() { var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  world.observer.setGlobal("total", PrimChecks.list.sum(PrimChecks.validator.checkArg('SUM', 8, PrimChecks.agentset.of(world.patches(), function() { return PrimChecks.patch.getVariable("n"); }))));
  world.observer.setGlobal("sizes", []);
  world.observer.setGlobal("lifetimes", []);
  world.ticker.reset();
}))
ProcedurePrims.defineCommand("setup-uniform", 1787, 1834, (function(initial) {
  var R = ProcedurePrims.callCommand("setup", PrimChecks.task.checked(function() { return initial; }, "[ -> initial ]", true, false)); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("setup-random", 1899, 1936, (function() {
  var R = ProcedurePrims.callCommand("setup", PrimChecks.task.checked(function() { return RandomPrims.randomLong(4); }, "[ -> random 4 ]", true, false)); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("recolor", 1996, 2046, (function() {
  PrimChecks.patch.setVariable("pcolor", ColorModel.scaleColor(PrimChecks.patch.getVariable("base-color"), PrimChecks.patch.getVariable("n"), 0, 4));
}))
ProcedurePrims.defineCommand("go", 2054, 2822, (function() {
  let drop = PrimChecks.procedure.callReporter("drop-patch"); ProcedurePrims.stack().currentContext().registerStringRunVar("DROP", drop);
  if (!Prims.equality(drop, Nobody)) {
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, drop), function() {
      var R = ProcedurePrims.callCommand("update-n", 1); if (R === DeathInterrupt) { return R; }
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    let results = PrimChecks.procedure.callReporter("stabilize", world.observer.getGlobal("animate-avalanches?")); ProcedurePrims.stack().currentContext().registerStringRunVar("RESULTS", results);
    let avalancheHpatches = PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, results)); ProcedurePrims.stack().currentContext().registerStringRunVar("AVALANCHE-PATCHES", avalancheHpatches);
    let lifetime = PrimChecks.list.last(PrimChecks.validator.checkArg('LAST', 12, results)); ProcedurePrims.stack().currentContext().registerStringRunVar("LIFETIME", lifetime);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, avalancheHpatches))) {
      world.observer.setGlobal("sizes", PrimChecks.list.lput(PrimChecks.agentset.count(PrimChecks.validator.checkArg('COUNT', 112, avalancheHpatches)), PrimChecks.validator.checkArg('LPUT', 8, world.observer.getGlobal("sizes"))));
      world.observer.setGlobal("lifetimes", PrimChecks.list.lput(lifetime, PrimChecks.validator.checkArg('LPUT', 8, world.observer.getGlobal("lifetimes"))));
    }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, avalancheHpatches), function() {
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
      var R = ProcedurePrims.ask(SelfManager.self().getNeighbors4(), function() { var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    Prims.display();
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, avalancheHpatches), function() {
      PrimChecks.patch.setVariable("base-color", world.observer.getGlobal("default-color"));
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    world.observer.setGlobal("total-on-tick", world.observer.getGlobal("total"));
    world.ticker.tick();
  }
}))
ProcedurePrims.defineCommand("explore", 2830, 3367, (function() {
  if (MousePrims.isInside()) {
    let p = world.getPatchAt(MousePrims.getX(), MousePrims.getY()); ProcedurePrims.stack().currentContext().registerStringRunVar("P", p);
    world.observer.setGlobal("selected-patch", p);
    var R = ProcedurePrims.ask(world.patches(), function() { var R = ProcedurePrims.callCommand("push-n"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, world.observer.getGlobal("selected-patch")), function() { var R = ProcedurePrims.callCommand("update-n", 1); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    let results = PrimChecks.procedure.callReporter("stabilize", false); ProcedurePrims.stack().currentContext().registerStringRunVar("RESULTS", results);
    var R = ProcedurePrims.ask(world.patches(), function() { var R = ProcedurePrims.callCommand("pop-n"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    var R = ProcedurePrims.ask(world.patches(), function() {
      PrimChecks.patch.setVariable("base-color", world.observer.getGlobal("default-color"));
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    let avalancheHpatches = PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, results)); ProcedurePrims.stack().currentContext().registerStringRunVar("AVALANCHE-PATCHES", avalancheHpatches);
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, avalancheHpatches), function() {
      PrimChecks.patch.setVariable("base-color", world.observer.getGlobal("selected-color"));
      var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    Prims.display();
  }
  else {
    if (!Prims.equality(world.observer.getGlobal("selected-patch"), Nobody)) {
      world.observer.setGlobal("selected-patch", Nobody);
      var R = ProcedurePrims.ask(world.patches(), function() {
        PrimChecks.patch.setVariable("base-color", world.observer.getGlobal("default-color"));
        var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }
  }
}))
ProcedurePrims.defineReporter("stabilize", 3485, 4862, (function(animate_Q) {
  let activeHpatches = PrimChecks.agentset.with(world.patches(), function() { return Prims.gt(PrimChecks.patch.getVariable("n"), 3); }); ProcedurePrims.stack().currentContext().registerStringRunVar("ACTIVE-PATCHES", activeHpatches);
  let iters = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("ITERS", iters);
  let avalancheHpatches = new PatchSet([], world); ProcedurePrims.stack().currentContext().registerStringRunVar("AVALANCHE-PATCHES", avalancheHpatches);
  while (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, activeHpatches))) {
    let overloadedHpatches = PrimChecks.agentset.with(PrimChecks.validator.checkArg('WITH', 112, activeHpatches), function() { return Prims.gt(PrimChecks.patch.getVariable("n"), 3); }); ProcedurePrims.stack().currentContext().registerStringRunVar("OVERLOADED-PATCHES", overloadedHpatches);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, overloadedHpatches))) {
      iters = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, iters), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("ITERS", iters);
    }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, overloadedHpatches), function() {
      PrimChecks.patch.setVariable("base-color", world.observer.getGlobal("fired-color"));
      var R = ProcedurePrims.callCommand("update-n", -4); if (R === DeathInterrupt) { return R; }
      if (animate_Q) {
        var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
      }
      var R = ProcedurePrims.ask(SelfManager.self().getNeighbors4(), function() {
        var R = ProcedurePrims.callCommand("update-n", 1); if (R === DeathInterrupt) { return R; }
        if (animate_Q) {
          var R = ProcedurePrims.callCommand("recolor"); if (R === DeathInterrupt) { return R; }
        }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    if (animate_Q) {
      Prims.display();
    }
    avalancheHpatches = PrimChecks.agentset.patchSet(avalancheHpatches, overloadedHpatches); ProcedurePrims.stack().currentContext().updateStringRunVar("AVALANCHE-PATCHES", avalancheHpatches);
    activeHpatches = PrimChecks.agentset.patchSet(PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, overloadedHpatches), function() { return SelfManager.self().getNeighbors4(); })); ProcedurePrims.stack().currentContext().updateStringRunVar("ACTIVE-PATCHES", activeHpatches);
  }
  return PrimChecks.procedure.report(ListPrims.list(avalancheHpatches, iters));
}))
ProcedurePrims.defineCommand("update-n", 4951, 5023, (function(howHmuch) {
  PrimChecks.patch.setVariable("n", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, PrimChecks.patch.getVariable("n")), PrimChecks.validator.checkArg('+', 1, howHmuch)));
  world.observer.setGlobal("total", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("total")), PrimChecks.validator.checkArg('+', 1, howHmuch)));
}))
ProcedurePrims.defineReporter("drop-patch", 5038, 5282, (function() {
  if (Prims.equality(world.observer.getGlobal("drop-location"), "center")) {
    return PrimChecks.procedure.report(world.getPatchAt(0, 0));
  }
  if (Prims.equality(world.observer.getGlobal("drop-location"), "random")) {
    return PrimChecks.procedure.report(PrimChecks.list.oneOf(world.patches()));
  }
  if ((Prims.equality(world.observer.getGlobal("drop-location"), "mouse-click") && MousePrims.isDown())) {
    if (Prims.isThrottleTimeElapsed("dropHpatch_0", workspace.selfManager.self(), 0.3)) {
      Prims.resetThrottleTimerFor("dropHpatch_0", workspace.selfManager.self());
      return PrimChecks.procedure.report(world.getPatchAt(MousePrims.getX(), MousePrims.getY()));
    }
  }
  return PrimChecks.procedure.report(Nobody);
}))
ProcedurePrims.defineCommand("push-n", 5316, 5371, (function() {
  PrimChecks.patch.setVariable("n-stack", PrimChecks.list.fput(PrimChecks.patch.getVariable("n"), PrimChecks.validator.checkArg('FPUT', 8, PrimChecks.patch.getVariable("n-stack"))));
}))
ProcedurePrims.defineCommand("pop-n", 5408, 5561, (function() {
  var R = ProcedurePrims.callCommand("update-n", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, PrimChecks.patch.getVariable("n-stack")))), PrimChecks.validator.checkArg('-', 1, PrimChecks.patch.getVariable("n")))); if (R === DeathInterrupt) { return R; }
  PrimChecks.patch.setVariable("n-stack", PrimChecks.list.butLast('but-last', PrimChecks.validator.checkArg('BUT-LAST', 12, PrimChecks.patch.getVariable("n-stack"))));
}))
world.observer.setGlobal("animate-avalanches?", false);
world.observer.setGlobal("drop-location", "random");
world.observer.setGlobal("grains-per-patch", 0);