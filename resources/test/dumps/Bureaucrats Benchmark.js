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
  var name    = 'Average';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('average', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average', 'average')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), Prims.div(world.observer.getGlobal("total"), world.patches().size()));
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
  var update  = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (!world.observer.getGlobal("plot?")) {
            throw new Exception.StopInterrupt;
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
  };
  return new Plot(name, pens, plotOps, "", "", true, true, 0.0, 1.0, 2.0, 2.1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [total result]\npatches-own [n]\n\nto benchmark\n  random-seed 0\n  reset-timer\n  setup\n  repeat 5000 [ go ]\n  set result timer\nend\n\nto setup\n  clear-all\n  ask patches [\n    set n 2\n    colorize\n  ]\n  set total 2 * count patches\n  reset-ticks\nend\n\nto go\n  let active-patches patch-set one-of patches\n  ask active-patches [\n    set n n + 1\n    set total total + 1\n    colorize\n  ]\n  while [any? active-patches] [\n    let overloaded-patches active-patches with [n > 3]\n    ask overloaded-patches [\n      set n n - 4\n      set total total - 4\n      colorize\n      ask neighbors4 [\n        set n n + 1\n        set total total + 1\n        colorize\n      ]\n    ]\n    set active-patches patch-set [neighbors4] of overloaded-patches\n  ]\n  tick\nend\n\nto colorize  ;; patch procedure\n  ifelse n <= 3\n    [ set pcolor item n [83 54 45 25] ]\n    [ set pcolor red ]\nend')([{"left":415,"top":10,"right":725,"bottom":341,"dimensions":{"minPxcor":0,"maxPxcor":99,"minPycor":0,"maxPycor":99,"patchSize":3,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":100000,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":10,"top":25,"right":89,"bottom":58,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":95,"top":25,"right":173,"bottom":58,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Average', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        if (!world.observer.getGlobal(\"plot?\")) {\n          throw new Exception.StopInterrupt;\n        }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Average', 'average')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), Prims.div(world.observer.getGlobal(\"total\"), world.patches().size()));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (total / count patches)","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average","left":10,"top":165,"right":400,"bottom":340,"xmin":0,"xmax":1,"ymin":2,"ymax":2.1,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"if not plot? [ stop ]","pens":[{"display":"average","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (total / count patches)","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"variable":"plot?","left":40,"top":65,"right":143,"bottom":98,"display":"plot?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_42 = procedures[\"BENCHMARK\"]();\n  if (_maybestop_33_42 instanceof Exception.StopInterrupt) { return _maybestop_33_42; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"benchmark","left":10,"top":130,"right":170,"bottom":163,"display":"benchmark (5000 ticks)","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"left":175,"top":84,"right":400,"bottom":164,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"result\")","source":"result","left":200,"top":15,"right":285,"bottom":60,"precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["plot?", "total", "result"], ["plot?"], ["n"], 0, 99, 0, 99, 3.0, false, false, turtleShapes, linkShapes, function(){});
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
      workspace.rng.setSeed(0);
      workspace.timer.reset();
      procedures["SETUP"]();
      for (let _index_93_99 = 0, _repeatcount_93_99 = StrictMath.floor(5000); _index_93_99 < _repeatcount_93_99; _index_93_99++){
        procedures["GO"]();
      }
      world.observer.setGlobal("result", workspace.timer.elapsed());
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["benchmark"] = temp;
  procs["BENCHMARK"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("n", 2);
        procedures["COLORIZE"]();
      }, true);
      world.observer.setGlobal("total", (2 * world.patches().size()));
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
      let activePatches = Prims.patchSet(ListPrims.oneOf(world.patches())); letVars['activePatches'] = activePatches;
      activePatches.ask(function() {
        SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") + 1));
        world.observer.setGlobal("total", (world.observer.getGlobal("total") + 1));
        procedures["COLORIZE"]();
      }, true);
      while (!activePatches.isEmpty()) {
        let overloadedPatches = activePatches.agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("n"), 3); }); letVars['overloadedPatches'] = overloadedPatches;
        overloadedPatches.ask(function() {
          SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") - 4));
          world.observer.setGlobal("total", (world.observer.getGlobal("total") - 4));
          procedures["COLORIZE"]();
          SelfManager.self().getNeighbors4().ask(function() {
            SelfManager.self().setPatchVariable("n", (SelfManager.self().getPatchVariable("n") + 1));
            world.observer.setGlobal("total", (world.observer.getGlobal("total") + 1));
            procedures["COLORIZE"]();
          }, true);
        }, true);
        activePatches = Prims.patchSet(overloadedPatches.projectionBy(function() { return SelfManager.self().getNeighbors4(); })); letVars['activePatches'] = activePatches;
      }
      world.ticker.tick();
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
      if (Prims.lte(SelfManager.self().getPatchVariable("n"), 3)) {
        SelfManager.self().setPatchVariable("pcolor", ListPrims.item(SelfManager.self().getPatchVariable("n"), [83, 54, 45, 25]));
      }
      else {
        SelfManager.self().setPatchVariable("pcolor", 15);
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["colorize"] = temp;
  procs["COLORIZE"] = temp;
  return procs;
})();
world.observer.setGlobal("plot?", false);
