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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
    exportView: function(filename) {}
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
  var name    = 'Average grain count';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Average grain count', 'average')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(Prims.div(world.observer.getGlobal("total"), world.patches().size()));
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
  return new Plot(name, pens, plotOps, "ticks", "grains", false, true, 0.0, 1.0, 2.0, 2.1, setup, update);
})(), (function() {
  var name    = 'Avalanche sizes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Avalanche sizes', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if ((Prims.equality(NLMath.mod(world.ticker.tickCount(), 100), 0) && !ListPrims.empty(world.observer.getGlobal("sizes")))) {
            plotManager.resetPen();
            let counts = Tasks.nValues((1 + ListPrims.max(world.observer.getGlobal("sizes"))), Tasks.reporterTask(function() { return 0; }, "[ 0 ]")); letVars['counts'] = counts;
            var _foreach_138_145 = Tasks.forEach(Tasks.commandTask(function(theSize) {
              if (arguments.length < 1) {
                throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
              }
              counts = ListPrims.replaceItem(theSize, counts, (1 + ListPrims.item(theSize, counts))); letVars['counts'] = counts;
            }, "[ the-size -> set counts replace-item the-size counts 1 + item the-size counts ]"), world.observer.getGlobal("sizes")); if(reporterContext && _foreach_138_145 !== undefined) { return _foreach_138_145; }
            let s = 0; letVars['s'] = s;
            var _foreach_253_260 = Tasks.forEach(Tasks.commandTask(function(c) {
              if (arguments.length < 1) {
                throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
              }
              if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {
                plotManager.plotPoint(NLMath.log(s, 10), NLMath.log(c, 10));
              }
              s = (s + 1); letVars['s'] = s;
            }, "[ c -> if s > 0 and c > 0 [ plotxy log s 10 log c 10 ] set s s + 1 ]"), counts); if(reporterContext && _foreach_253_260 !== undefined) { return _foreach_253_260; }
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
  return new Plot(name, pens, plotOps, "log size", "log count", false, true, 0.0, 1.0, 0.0, 1.0, setup, update);
})(), (function() {
  var name    = 'Avalanche lifetimes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Avalanche lifetimes', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if ((Prims.equality(NLMath.mod(world.ticker.tickCount(), 100), 0) && !ListPrims.empty(world.observer.getGlobal("lifetimes")))) {
            plotManager.resetPen();
            let counts = Tasks.nValues((1 + ListPrims.max(world.observer.getGlobal("lifetimes"))), Tasks.reporterTask(function() { return 0; }, "[ 0 ]")); letVars['counts'] = counts;
            var _foreach_146_153 = Tasks.forEach(Tasks.commandTask(function(lifetime) {
              if (arguments.length < 1) {
                throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
              }
              counts = ListPrims.replaceItem(lifetime, counts, (1 + ListPrims.item(lifetime, counts))); letVars['counts'] = counts;
            }, "[ lifetime -> set counts replace-item lifetime counts 1 + item lifetime counts ]"), world.observer.getGlobal("lifetimes")); if(reporterContext && _foreach_146_153 !== undefined) { return _foreach_146_153; }
            let l = 0; letVars['l'] = l;
            var _foreach_265_272 = Tasks.forEach(Tasks.commandTask(function(c) {
              if (arguments.length < 1) {
                throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
              }
              if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {
                plotManager.plotPoint(NLMath.log(l, 10), NLMath.log(c, 10));
              }
              l = (l + 1); letVars['l'] = l;
            }, "[ c -> if l > 0 and c > 0 [ plotxy log l 10 log c 10 ] set l l + 1 ]"), counts); if(reporterContext && _foreach_265_272 !== undefined) { return _foreach_265_272; }
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
  return new Plot(name, pens, plotOps, "log lifetime", "log count", false, true, 0.0, 1.0, 0.0, 1.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [\n  ;; By always keeping track of how much sand is on the table, we can compute the\n  ;; average number of grains per patch instantly, without having to count.\n  total\n  ;; We don\'t want the average monitor to updating wildly, so we only have it\n  ;; update every tick.\n  total-on-tick\n  ;; Keep track of avalanche sizes so we can histogram them\n  sizes\n  ;; Size of the most recent run\n  last-size\n  ;; Keep track of avalanche lifetimes so we can histogram them\n  lifetimes\n  ;; Lifetime of the most recent run\n  last-lifetime\n  ;; The patch the mouse hovers over while exploring\n  selected-patch\n  ;; These colors define how the patches look normally, after being fired, and in\n  ;; explore mode.\n  default-color\n  fired-color\n  selected-color\n]\n\npatches-own [\n  ;; how many grains of sand are on this patch\n  n\n  ;; A list of stored n so that we can easily pop back to a previous state. See\n  ;; the NETLOGO FEATURES section of the Info tab for a description of how stacks\n  ;; work\n  n-stack\n  ;; Determines what color to scale when coloring the patch.\n  base-color\n]\n\n;; The input task says what each patch should do at setup time\n;; to compute its initial value for n.  (See the Tasks section\n;; of the Programming Guide for information on tasks.)\nto setup [setup-task]\n  clear-all\n\n  set default-color blue\n  set fired-color red\n  set selected-color green\n\n  set selected-patch nobody\n  ask patches [\n    set n runresult setup-task\n    set n-stack []\n    set base-color default-color\n  ]\n  let ignore stabilize false\n  ask patches [ recolor ]\n  set total sum [ n ] of patches\n  ;; set this to the empty list so we can add items to it later\n  set sizes []\n  set lifetimes []\n  reset-ticks\nend\n\n;; For example, \"setup-uniform 2\" gives every patch a task which reports 2.\nto setup-uniform [initial]\n  setup [ -> initial ]\nend\n\n;; Every patch uses a task which reports a random value.\nto setup-random\n  setup [ -> random 4 ]\nend\n\n;; patch procedure; the colors are like a stoplight\nto recolor\n  set pcolor scale-color base-color n 0 4\nend\n\nto go\n  let drop drop-patch\n  if drop != nobody [\n    ask drop [\n      update-n 1\n      recolor\n    ]\n    let results stabilize animate-avalanches?\n    let avalanche-patches first results\n    let lifetime last results\n\n    ;; compute the size of the avalanche and throw it on the end of the sizes list\n    if any? avalanche-patches [\n      set sizes lput (count avalanche-patches) sizes\n      set lifetimes lput lifetime lifetimes\n    ]\n    ;; Display the avalanche and guarantee that the border of the avalanche is updated\n    ask avalanche-patches [ recolor ask neighbors4 [ recolor ] ]\n    display\n    ;; Erase the avalanche\n    ask avalanche-patches [ set base-color default-color recolor ]\n    ;; Updates the average monitor\n    set total-on-tick total\n    tick\n  ]\nend\n\nto explore\n  ifelse mouse-inside? [\n    let p patch mouse-xcor mouse-ycor\n    set selected-patch p\n    ask patches [ push-n ]\n    ask selected-patch [ update-n 1 ]\n    let results stabilize false\n    ask patches [ pop-n ]\n    ask patches [ set base-color default-color recolor ]\n    let avalanche-patches first results\n    ask avalanche-patches [ set base-color selected-color recolor ]\n    display\n  ] [\n    if selected-patch != nobody [\n      set selected-patch nobody\n      ask patches [ set base-color default-color recolor ]\n    ]\n  ]\nend\n\n;; Stabilizes the sandpile. Reports which sites fired and how many iterations it took to\n;; stabilize.\nto-report stabilize [animate?]\n  let active-patches patches with [ n > 3 ]\n\n  ;; The number iterations the avalanche has gone for. Use to calculate lifetimes.\n  let iters 0\n\n  ;; we want to count how many patches became overloaded at some point\n  ;; during the avalanche, and also flash those patches. so as we go, we\'ll\n  ;; keep adding more patches to to this initially empty set.\n  let avalanche-patches no-patches\n\n  while [ any? active-patches ] [\n    let overloaded-patches active-patches with [ n > 3 ]\n    if any? overloaded-patches [\n      set iters iters + 1\n    ]\n    ask overloaded-patches [\n      set base-color fired-color\n      ;; subtract 4 from this patch\n      update-n -4\n      if animate? [ recolor ]\n      ;; edge patches have less than four neighbors, so some sand may fall off the edge\n      ask neighbors4 [\n        update-n 1\n        if animate? [ recolor ]\n      ]\n    ]\n    if animate? [ display ]\n    ;; add the current round of overloaded patches to our record of the avalanche\n    ;; the patch-set primitive combines agentsets, removing duplicates\n    set avalanche-patches (patch-set avalanche-patches overloaded-patches)\n    ;; find the set of patches which *might* be overloaded, so we will check\n    ;; them the next time through the loop\n    set active-patches patch-set [ neighbors4 ] of overloaded-patches\n  ]\n  report (list avalanche-patches iters)\nend\n\n;; patch procedure. input might be positive or negative, to add or subtract sand\nto update-n [ how-much ]\n  set n n + how-much\n  set total total + how-much\nend\n\nto-report drop-patch\n  if drop-location = \"center\" [ report patch 0 0 ]\n  if drop-location = \"random\" [ report one-of patches ]\n  if drop-location = \"mouse-click\" and mouse-down? [\n    every 0.3 [ report patch mouse-xcor mouse-ycor ]\n  ]\n  report nobody\nend\n\n;; Save the patches state\nto push-n ;; patch procedure\n  set n-stack fput n n-stack\nend\n\n;; restore the patches state\nto pop-n ;; patch procedure\n  ; need to go through update-n to keep total statistic correct\n  update-n ((first n-stack) - n)\n  set n-stack but-last n-stack\nend\n\n\n; Public Domain:\n; To the extent possible under law, Uri Wilensky has waived all\n; copyright and related or neighboring rights to this model.')([{"left":330,"top":10,"right":742,"bottom":423,"dimensions":{"minPxcor":-50,"maxPxcor":50,"minPycor":-50,"maxPycor":50,"patchSize":4,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":90,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_46 = procedures[\"SETUP-UNIFORM\"](world.observer.getGlobal(\"grains-per-patch\"));\n  if (_maybestop_33_46 instanceof Exception.StopInterrupt) { return _maybestop_33_46; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup-uniform grains-per-patch","left":5,"top":45,"right":150,"bottom":79,"display":"setup uniform","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":5,"top":100,"right":150,"bottom":133,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Average grain count', 'average')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue(Prims.div(world.observer.getGlobal(\"total\"), world.patches().size()));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot total / count patches","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average grain count","left":0,"top":260,"right":310,"bottom":445,"xAxis":"ticks","yAxis":"grains","xmin":0,"xmax":1,"ymin":2,"ymax":2.1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot total / count patches","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"Prims.div(world.observer.getGlobal(\"total-on-tick\"), world.patches().size())","source":"total-on-tick / count patches","left":245,"top":215,"right":310,"bottom":260,"display":"average","precision":4,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"animate-avalanches?","left":155,"top":140,"right":325,"bottom":173,"display":"animate-avalanches?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"drop-location","left":5,"top":140,"right":150,"bottom":185,"display":"drop-location","choices":["center","random","mouse-click"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_45 = procedures[\"SETUP-RANDOM\"]();\n  if (_maybestop_33_45 instanceof Exception.StopInterrupt) { return _maybestop_33_45; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup-random","left":5,"top":10,"right":150,"bottom":43,"display":"setup random","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Avalanche sizes', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        if ((Prims.equality(NLMath.mod(world.ticker.tickCount(), 100), 0) && !ListPrims.empty(world.observer.getGlobal(\"sizes\")))) {\n          plotManager.resetPen();\n          let counts = Tasks.nValues((1 + ListPrims.max(world.observer.getGlobal(\"sizes\"))), Tasks.reporterTask(function() { return 0; }, \"[ 0 ]\")); letVars['counts'] = counts;\n          var _foreach_138_145 = Tasks.forEach(Tasks.commandTask(function(theSize) {\n            if (arguments.length < 1) {\n              throw new Error(\"anonymous procedure expected 1 input, but only got \" + arguments.length);\n            }\n            counts = ListPrims.replaceItem(theSize, counts, (1 + ListPrims.item(theSize, counts))); letVars['counts'] = counts;\n          }, \"[ the-size -> set counts replace-item the-size counts 1 + item the-size counts ]\"), world.observer.getGlobal(\"sizes\")); if(reporterContext && _foreach_138_145 !== undefined) { return _foreach_138_145; }\n          let s = 0; letVars['s'] = s;\n          var _foreach_253_260 = Tasks.forEach(Tasks.commandTask(function(c) {\n            if (arguments.length < 1) {\n              throw new Error(\"anonymous procedure expected 1 input, but only got \" + arguments.length);\n            }\n            if ((Prims.gt(s, 0) && Prims.gt(c, 0))) {\n              plotManager.plotPoint(NLMath.log(s, 10), NLMath.log(c, 10));\n            }\n            s = (s + 1); letVars['s'] = s;\n          }, \"[ c -> if s > 0 and c > 0 [ plotxy log s 10 log c 10 ] set s s + 1 ]\"), counts); if(reporterContext && _foreach_253_260 !== undefined) { return _foreach_253_260; }\n        }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? sizes [\n  plot-pen-reset\n  let counts n-values (1 + max sizes) [0]\n  foreach sizes [ the-size ->\n    set counts replace-item the-size counts (1 + item the-size counts)\n  ]\n  let s 0\n  foreach counts [ c ->\n    ; We only care about plotting avalanches (s > 0), but dropping s = 0\n    ; from the counts list is actually more awkward than just ignoring it\n    if (s > 0 and c > 0) [\n      plotxy (log s 10) (log c 10)\n    ]\n    set s s + 1\n  ]\n]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avalanche sizes","left":755,"top":240,"right":955,"bottom":390,"xAxis":"log size","yAxis":"log count","xmin":0,"xmax":1,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? sizes [\n  plot-pen-reset\n  let counts n-values (1 + max sizes) [0]\n  foreach sizes [ the-size ->\n    set counts replace-item the-size counts (1 + item the-size counts)\n  ]\n  let s 0\n  foreach counts [ c ->\n    ; We only care about plotting avalanches (s > 0), but dropping s = 0\n    ; from the counts list is actually more awkward than just ignoring it\n    if (s > 0 and c > 0) [\n      plotxy (log s 10) (log c 10)\n    ]\n    set s s + 1\n  ]\n]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  world.observer.setGlobal(\"sizes\", []);\n  world.observer.setGlobal(\"lifetimes\", []);\n  plotManager.setCurrentPlot(\"Avalanche lifetimes\");\n  plotManager.setYRange(0, 1);\n  plotManager.setXRange(0, 1);\n  plotManager.setCurrentPlot(\"Avalanche sizes\");\n  plotManager.setYRange(0, 1);\n  plotManager.setXRange(0, 1);\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"set sizes []\nset lifetimes []\nset-current-plot \"Avalanche lifetimes\"\nset-plot-y-range 0 1\nset-plot-x-range 0 1\nset-current-plot \"Avalanche sizes\"\nset-plot-y-range 0 1\nset-plot-x-range 0 1","left":755,"top":400,"right":955,"bottom":433,"display":"clear size and lifetime data","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Avalanche lifetimes', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        if ((Prims.equality(NLMath.mod(world.ticker.tickCount(), 100), 0) && !ListPrims.empty(world.observer.getGlobal(\"lifetimes\")))) {\n          plotManager.resetPen();\n          let counts = Tasks.nValues((1 + ListPrims.max(world.observer.getGlobal(\"lifetimes\"))), Tasks.reporterTask(function() { return 0; }, \"[ 0 ]\")); letVars['counts'] = counts;\n          var _foreach_146_153 = Tasks.forEach(Tasks.commandTask(function(lifetime) {\n            if (arguments.length < 1) {\n              throw new Error(\"anonymous procedure expected 1 input, but only got \" + arguments.length);\n            }\n            counts = ListPrims.replaceItem(lifetime, counts, (1 + ListPrims.item(lifetime, counts))); letVars['counts'] = counts;\n          }, \"[ lifetime -> set counts replace-item lifetime counts 1 + item lifetime counts ]\"), world.observer.getGlobal(\"lifetimes\")); if(reporterContext && _foreach_146_153 !== undefined) { return _foreach_146_153; }\n          let l = 0; letVars['l'] = l;\n          var _foreach_265_272 = Tasks.forEach(Tasks.commandTask(function(c) {\n            if (arguments.length < 1) {\n              throw new Error(\"anonymous procedure expected 1 input, but only got \" + arguments.length);\n            }\n            if ((Prims.gt(l, 0) && Prims.gt(c, 0))) {\n              plotManager.plotPoint(NLMath.log(l, 10), NLMath.log(c, 10));\n            }\n            l = (l + 1); letVars['l'] = l;\n          }, \"[ c -> if l > 0 and c > 0 [ plotxy log l 10 log c 10 ] set l l + 1 ]\"), counts); if(reporterContext && _foreach_265_272 !== undefined) { return _foreach_265_272; }\n        }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? lifetimes [\n  plot-pen-reset\n  let counts n-values (1 + max lifetimes) [0]\n  foreach lifetimes [ lifetime ->\n    set counts replace-item lifetime counts (1 + item lifetime counts)\n  ]\n  let l 0\n  foreach counts [ c ->\n    ; We only care about plotting avalanches (l > 0), but dropping l = 0\n    ; from the counts list is actually more awkward than just ignoring it\n    if (l > 0 and c > 0) [\n      plotxy (log l 10) (log c 10)\n    ]\n    set l l + 1\n  ]\n]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avalanche lifetimes","left":755,"top":80,"right":955,"bottom":230,"xAxis":"log lifetime","yAxis":"log count","xmin":0,"xmax":1,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks mod 100 = 0 and not empty? lifetimes [\n  plot-pen-reset\n  let counts n-values (1 + max lifetimes) [0]\n  foreach lifetimes [ lifetime ->\n    set counts replace-item lifetime counts (1 + item lifetime counts)\n  ]\n  let l 0\n  foreach counts [ c ->\n    ; We only care about plotting avalanches (l > 0), but dropping l = 0\n    ; from the counts list is actually more awkward than just ignoring it\n    if (l > 0 and c > 0) [\n      plotxy (log l 10) (log c 10)\n    ]\n    set l l + 1\n  ]\n]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_40 = procedures[\"EXPLORE\"]();\n  if (_maybestop_33_40 instanceof Exception.StopInterrupt) { return _maybestop_33_40; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"explore","left":5,"top":210,"right":150,"bottom":243,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":155,"top":100,"right":325,"bottom":133,"display":"go once","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"3","compiledStep":"1","variable":"grains-per-patch","left":155,"top":45,"right":325,"bottom":78,"display":"grains-per-patch","min":"0","max":"3","default":0,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["animate-avalanches?", "drop-location", "grains-per-patch", "total", "total-on-tick", "sizes", "last-size", "lifetimes", "last-lifetime", "selected-patch", "default-color", "fired-color", "selected-color"], ["animate-avalanches?", "drop-location", "grains-per-patch"], ["n", "n-stack", "base-color"], -50, 50, -50, 50, 4.0, false, false, turtleShapes, linkShapes, function(){});
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
  temp = (function(setupTask) {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      world.observer.setGlobal("default-color", 105);
      world.observer.setGlobal("fired-color", 15);
      world.observer.setGlobal("selected-color", 55);
      world.observer.setGlobal("selected-patch", Nobody);
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("n", Prims.runCode(
          true,
          (function() {
            let _run_1426_1435Vars = { }; for(var v in letVars) { _run_1426_1435Vars[v] = letVars[v]; }
            _run_1426_1435Vars["setupTask"] = setupTask;
            return _run_1426_1435Vars;
          })(),
          setupTask
        )
        
        );
        SelfManager.self().setPatchVariable("n-stack", []);
        SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
      }, true);
      let ignore = procedures["STABILIZE"](false); letVars['ignore'] = ignore;
      world.patches().ask(function() { procedures["RECOLOR"](); }, true);
      world.observer.setGlobal("total", ListPrims.sum(world.patches().projectionBy(function() { return SelfManager.self().getPatchVariable("n"); })));
      world.observer.setGlobal("sizes", []);
      world.observer.setGlobal("lifetimes", []);
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
  temp = (function(initial) {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SETUP"](Tasks.reporterTask(function() { return initial; }, "[ -> initial ]"));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupUniform"] = temp;
  procs["SETUP-UNIFORM"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SETUP"](Tasks.reporterTask(function() { return Prims.random(4); }, "[ -> random 4 ]"));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupRandom"] = temp;
  procs["SETUP-RANDOM"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("pcolor", ColorModel.scaleColor(SelfManager.self().getPatchVariable("base-color"), SelfManager.self().getPatchVariable("n"), 0, 4));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["recolor"] = temp;
  procs["RECOLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let drop = procedures["DROP-PATCH"](); letVars['drop'] = drop;
      if (!Prims.equality(drop, Nobody)) {
        drop.ask(function() {
          procedures["UPDATE-N"](1);
          procedures["RECOLOR"]();
        }, true);
        let results = procedures["STABILIZE"](world.observer.getGlobal("animate-avalanches?")); letVars['results'] = results;
        let avalanchePatches = ListPrims.first(results); letVars['avalanchePatches'] = avalanchePatches;
        let lifetime = ListPrims.last(results); letVars['lifetime'] = lifetime;
        if (!avalanchePatches.isEmpty()) {
          world.observer.setGlobal("sizes", ListPrims.lput(avalanchePatches.size(), world.observer.getGlobal("sizes")));
          world.observer.setGlobal("lifetimes", ListPrims.lput(lifetime, world.observer.getGlobal("lifetimes")));
        }
        avalanchePatches.ask(function() {
          procedures["RECOLOR"]();
          SelfManager.self().getNeighbors4().ask(function() { procedures["RECOLOR"](); }, true);
        }, true);
        notImplemented('display', undefined)();
        avalanchePatches.ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
          procedures["RECOLOR"]();
        }, true);
        world.observer.setGlobal("total-on-tick", world.observer.getGlobal("total"));
        world.ticker.tick();
      }
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
      if (MousePrims.isInside()) {
        let p = world.getPatchAt(MousePrims.getX(), MousePrims.getY()); letVars['p'] = p;
        world.observer.setGlobal("selected-patch", p);
        world.patches().ask(function() { procedures["PUSH-N"](); }, true);
        world.observer.getGlobal("selected-patch").ask(function() { procedures["UPDATE-N"](1); }, true);
        let results = procedures["STABILIZE"](false); letVars['results'] = results;
        world.patches().ask(function() { procedures["POP-N"](); }, true);
        world.patches().ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
          procedures["RECOLOR"]();
        }, true);
        let avalanchePatches = ListPrims.first(results); letVars['avalanchePatches'] = avalanchePatches;
        avalanchePatches.ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("selected-color"));
          procedures["RECOLOR"]();
        }, true);
        notImplemented('display', undefined)();
      }
      else {
        if (!Prims.equality(world.observer.getGlobal("selected-patch"), Nobody)) {
          world.observer.setGlobal("selected-patch", Nobody);
          world.patches().ask(function() {
            SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("default-color"));
            procedures["RECOLOR"]();
          }, true);
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
  procs["explore"] = temp;
  procs["EXPLORE"] = temp;
  temp = (function(animate_p) {
    try {
      var reporterContext = true;
      var letVars = { };
      let activePatches = world.patches().agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); }); letVars['activePatches'] = activePatches;
      let iters = 0; letVars['iters'] = iters;
      let avalanchePatches = new PatchSet([], world); letVars['avalanchePatches'] = avalanchePatches;
      while (!activePatches.isEmpty()) {
        let overloadedPatches = activePatches.agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); }); letVars['overloadedPatches'] = overloadedPatches;
        if (!overloadedPatches.isEmpty()) {
          iters = (iters + 1); letVars['iters'] = iters;
        }
        overloadedPatches.ask(function() {
          SelfManager.self().setPatchVariable("base-color", world.observer.getGlobal("fired-color"));
          procedures["UPDATE-N"](-4);
          if (animate_p) {
            procedures["RECOLOR"]();
          }
          SelfManager.self().getNeighbors4().ask(function() {
            procedures["UPDATE-N"](1);
            if (animate_p) {
              procedures["RECOLOR"]();
            }
          }, true);
        }, true);
        if (animate_p) {
          notImplemented('display', undefined)();
        }
        avalanchePatches = Prims.patchSet(avalanchePatches, overloadedPatches); letVars['avalanchePatches'] = avalanchePatches;
        activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() { return SelfManager.self().getNeighbors4(); })); letVars['activePatches'] = activePatches;
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return ListPrims.list(avalanchePatches, iters)
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
  procs["stabilize"] = temp;
  procs["STABILIZE"] = temp;
  temp = (function(howMuch) {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") + howMuch));
      world.observer.setGlobal("total", (world.observer.getGlobal("total") + howMuch));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateN"] = temp;
  procs["UPDATE-N"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("drop-location"), "center")) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return world.getPatchAt(0, 0)
        }
      }
      if (Prims.equality(world.observer.getGlobal("drop-location"), "random")) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return ListPrims.oneOf(world.patches())
        }
      }
      if ((Prims.equality(world.observer.getGlobal("drop-location"), "mouse-click") && MousePrims.isDown())) {
        if (Prims.isThrottleTimeElapsed("dropPatch_0", workspace.selfManager.self(), 0.3)) {
          Prims.resetThrottleTimerFor("dropPatch_0", workspace.selfManager.self());
          if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
            return world.getPatchAt(MousePrims.getX(), MousePrims.getY())
          }
        }
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Nobody
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
  procs["dropPatch"] = temp;
  procs["DROP-PATCH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("n-stack", ListPrims.fput(SelfManager.self().getPatchVariable("n"), SelfManager.self().getPatchVariable("n-stack")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["pushN"] = temp;
  procs["PUSH-N"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["UPDATE-N"]((ListPrims.first(SelfManager.self().getPatchVariable("n-stack")) - SelfManager.self().getPatchVariable("n")));
      SelfManager.self().setPatchVariable("n-stack", ListPrims.butLast(SelfManager.self().getPatchVariable("n-stack")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["popN"] = temp;
  procs["POP-N"] = temp;
  return procs;
})();
world.observer.setGlobal("animate-avalanches?", false);
world.observer.setGlobal("drop-location", "random");
world.observer.setGlobal("grains-per-patch", 0);
