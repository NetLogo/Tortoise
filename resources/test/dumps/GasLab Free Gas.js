var modelConfig  = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};

var PenBundle = tortoise_require('engine/plot/pen');
var Plot      = tortoise_require('engine/plot/plot');
var PlotOps   = tortoise_require('engine/plot/plotops');

modelConfig.plots = [(function() {
  var name    = 'Energy Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15.0, 10.0, PenBundle.DisplayMode.Bar), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'fast')(function() { plotManager.setHistogramBarCount(40);; }); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'fast')(function() { plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
  return Prims.equality(SelfPrims.getVariable('color'), 15);
}).projectionBy(function() {
  return SelfPrims.getVariable('energy');
}));; }); }); }),
new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55.0, 10.0, PenBundle.DisplayMode.Bar), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'medium')(function() { plotManager.setHistogramBarCount(40);; }); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'medium')(function() { plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
  return Prims.equality(SelfPrims.getVariable('color'), 55);
}).projectionBy(function() {
  return SelfPrims.getVariable('energy');
}));; }); }); }),
new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105.0, 10.0, PenBundle.DisplayMode.Bar), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'slow')(function() { plotManager.setHistogramBarCount(40);; }); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'slow')(function() { plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
  return Prims.equality(SelfPrims.getVariable('color'), 105);
}).projectionBy(function() {
  return SelfPrims.getVariable('energy');
}));; }); }); }),
new PenBundle.Pen('avg-energy', plotOps.makePenOps, false, new PenBundle.State(5.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'avg-energy')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'avg-energy')(function() { plotManager.resetPen();
Call(drawVertLine, world.observer.getGlobal('avg-energy'));; }); }); }),
new PenBundle.Pen('init-avg-energy', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'init-avg-energy')(function() { Call(drawVertLine, world.observer.getGlobal('init-avg-energy'));; }); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', 'init-avg-energy')(function() {}); }); })];
  var setup   = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', undefined)(function() {}); }); };
  var update  = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Energy Histogram', undefined)(function() { plotManager.setXRange(0, (((0.5 * (world.observer.getGlobal('init-particle-speed') * 2)) * (world.observer.getGlobal('init-particle-speed') * 2)) * world.observer.getGlobal('particle-mass')));
plotManager.setYRange(0, StrictMath.ceil((world.observer.getGlobal('number-of-particles') / 6)));; }); }); };
  return new Plot(name, pens, plotOps, 'Energy', 'Number', true, 0.0, 400.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Speed Counts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Counts', 'fast')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Counts', 'fast')(function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal('percent-fast'));; }); }); }),
new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Counts', 'medium')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Counts', 'medium')(function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal('percent-medium'));; }); }); }),
new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Counts', 'slow')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Counts', 'slow')(function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal('percent-slow'));; }); }); })];
  var setup   = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Counts', undefined)(function() {}); }); };
  var update  = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Counts', undefined)(function() { plotManager.setYRange(0, 100);; }); }); };
  return new Plot(name, pens, plotOps, 'time', 'count (%)', true, 0.0, 20.0, 0.0, 100.0, setup, update);
})(), (function() {
  var name    = 'Speed Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15.0, 5.0, PenBundle.DisplayMode.Bar), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() { plotManager.setHistogramBarCount(40);; }); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() { plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
  return Prims.equality(SelfPrims.getVariable('color'), 15);
}).projectionBy(function() {
  return SelfPrims.getVariable('speed');
}));; }); }); }),
new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55.0, 5.0, PenBundle.DisplayMode.Bar), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() { plotManager.setHistogramBarCount(40);; }); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() { plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
  return Prims.equality(SelfPrims.getVariable('color'), 55);
}).projectionBy(function() {
  return SelfPrims.getVariable('speed');
}));; }); }); }),
new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105.0, 5.0, PenBundle.DisplayMode.Bar), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() { plotManager.setHistogramBarCount(40);; }); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() { plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
  return Prims.equality(SelfPrims.getVariable('color'), 105);
}).projectionBy(function() {
  return SelfPrims.getVariable('speed');
}));; }); }); }),
new PenBundle.Pen('avg-speed', plotOps.makePenOps, false, new PenBundle.State(5.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'avg-speed')(function() {}); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'avg-speed')(function() { plotManager.resetPen();
Call(drawVertLine, world.observer.getGlobal('avg-speed'));; }); }); }),
new PenBundle.Pen('init-avg-speed', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'init-avg-speed')(function() { Call(drawVertLine, world.observer.getGlobal('init-avg-speed'));; }); }); }, function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', 'init-avg-speed')(function() {}); }); })];
  var setup   = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', undefined)(function() {}); }); };
  var update  = function() { workspace.rng.withAux(function() { plotManager.withTemporaryContext('Speed Histogram', undefined)(function() { plotManager.setXRange(0, (world.observer.getGlobal('init-particle-speed') * 2));
plotManager.setYRange(0, StrictMath.ceil((world.observer.getGlobal('number-of-particles') / 6)));; }); }); };
  return new Plot(name, pens, plotOps, 'Speed', 'Number', true, 0.0, 50.0, 0.0, 100.0, setup, update);
})()];

var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: 'PARTICLES', singular: 'particle', varNames: ['speed', 'mass', 'energy', 'last-collision'] }])([], [])(['number-of-particles', 'collide?', 'trace?', 'init-particle-speed', 'particle-mass', 'tick-delta', 'max-tick-delta', 'init-avg-speed', 'init-avg-energy', 'avg-speed', 'avg-energy', 'fast', 'medium', 'slow', 'percent-fast', 'percent-medium', 'percent-slow'], ['number-of-particles', 'collide?', 'trace?', 'init-particle-speed', 'particle-mass'], [], -40, 40, -40, 40, 4.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"clock":{"rotate":true,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,128,143,143,158,158,173],"ycors":[31,75,75,150,150,75,75],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});

var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var ListPrims     = workspace.listPrims;
var MousePrims    = workspace.mousePrims;
var plotManager   = workspace.plotManager;
var Prims         = workspace.prims;
var PrintPrims    = workspace.printPrims;
var SelfPrims     = workspace.selfPrims;
var SelfManager   = workspace.selfManager;
var Updater       = workspace.updater;
var world         = workspace.world;

var Call           = tortoise_require('util/call');
var ColorModel     = tortoise_require('util/colormodel');
var Exception      = tortoise_require('util/exception');
var Trig           = tortoise_require('util/trig');
var Type           = tortoise_require('util/typechecker');
var notImplemented = tortoise_require('util/notimplemented');

var Dump      = tortoise_require('engine/dump');
var Link      = tortoise_require('engine/core/link');
var LinkSet   = tortoise_require('engine/core/linkset');
var Nobody    = tortoise_require('engine/core/nobody');
var PatchSet  = tortoise_require('engine/core/patchset');
var Turtle    = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var Tasks     = tortoise_require('engine/prim/tasks');

var AgentModel = tortoise_require('agentmodel');
var Random     = tortoise_require('shim/random');
var StrictMath = tortoise_require('shim/strictmath');
function setup() {
  world.clearAll();
  BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PARTICLES").getBreedName(), "circle")
  world.observer.setGlobal('max-tick-delta', 0.1073);
  Call(makeParticles);
  Call(updateVariables);
  world.observer.setGlobal('init-avg-speed', world.observer.getGlobal('avg-speed'));
  world.observer.setGlobal('init-avg-energy', world.observer.getGlobal('avg-energy'));
  world.ticker.reset();
}
function go() {
  world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
    Call(move);
  }, true);
  world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
    if (world.observer.getGlobal('collide?')) {
      Call(checkForCollision);
    }
  }, true);
  if (world.observer.getGlobal('trace?')) {
    world.turtleManager.getTurtleOfBreed("PARTICLES", 0).ask(function() {
      SelfManager.self().penManager.lowerPen();
    }, true);
  }
  else {
    world.turtleManager.getTurtleOfBreed("PARTICLES", 0).ask(function() {
      SelfManager.self().penManager.raisePen();
    }, true);
  }
  world.ticker.tickAdvance(world.observer.getGlobal('tick-delta'));
  if (Prims.gt(StrictMath.floor(world.ticker.tickCount()), StrictMath.floor((world.ticker.tickCount() - world.observer.getGlobal('tick-delta'))))) {
    Call(updateVariables);
    plotManager.updatePlots();
  }
  Call(calculateTickDelta);
  notImplemented('display', undefined)();
}
function updateVariables() {
  world.observer.setGlobal('medium', world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 55);
  }).size());
  world.observer.setGlobal('slow', world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 105);
  }).size());
  world.observer.setGlobal('fast', world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 15);
  }).size());
  world.observer.setGlobal('percent-medium', ((world.observer.getGlobal('medium') / world.turtleManager.turtlesOfBreed("PARTICLES").size()) * 100));
  world.observer.setGlobal('percent-slow', ((world.observer.getGlobal('slow') / world.turtleManager.turtlesOfBreed("PARTICLES").size()) * 100));
  world.observer.setGlobal('percent-fast', ((world.observer.getGlobal('fast') / world.turtleManager.turtlesOfBreed("PARTICLES").size()) * 100));
  world.observer.setGlobal('avg-speed', ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() {
    return SelfPrims.getVariable('speed');
  })));
  world.observer.setGlobal('avg-energy', ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() {
    return SelfPrims.getVariable('energy');
  })));
}
function calculateTickDelta() {
  if (world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.gt(SelfPrims.getVariable('speed'), 0);
  }).nonEmpty()) {
    world.observer.setGlobal('tick-delta', ListPrims.min(ListPrims.list((1 / StrictMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() {
      return SelfPrims.getVariable('speed');
    })))), world.observer.getGlobal('max-tick-delta'))));
  }
  else {
    world.observer.setGlobal('tick-delta', world.observer.getGlobal('max-tick-delta'));
  }
}
function move() {
  if (!Prims.equality(SelfManager.self().patchAhead((SelfPrims.getVariable('speed') * world.observer.getGlobal('tick-delta'))), SelfManager.self().getPatchHere())) {
    SelfPrims.setVariable('last-collision', Nobody);
  }
  SelfPrims.jump((SelfPrims.getVariable('speed') * world.observer.getGlobal('tick-delta')));
}
function checkForCollision() {
  if (Prims.equality(SelfPrims.other(SelfManager.self().breedHere("PARTICLES")).size(), 1)) {
    var candidate = ListPrims.oneOf(SelfPrims.other(SelfManager.self().breedHere("PARTICLES").agentFilter(function() {
      return (Prims.lt(SelfPrims.getVariable('who'), SelfManager.myself().projectionBy(function() {
        return SelfPrims.getVariable('who');
      })) && !Prims.equality(SelfManager.myself(), SelfPrims.getVariable('last-collision')));
    })));
    if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfPrims.getVariable('speed'), 0) || Prims.gt(candidate.projectionBy(function() {
      return SelfPrims.getVariable('speed');
    }), 0)))) {
      Call(collideWith, candidate);
      SelfPrims.setVariable('last-collision', candidate);
      candidate.ask(function() {
        SelfPrims.setVariable('last-collision', SelfManager.myself());
      }, true);
    }
  }
}
function collideWith(otherParticle) {
  var mass2 = otherParticle.projectionBy(function() {
    return SelfPrims.getVariable('mass');
  });
  var speed2 = otherParticle.projectionBy(function() {
    return SelfPrims.getVariable('speed');
  });
  var heading2 = otherParticle.projectionBy(function() {
    return SelfPrims.getVariable('heading');
  });
  var theta = Prims.randomFloat(360);
  var v1t = (SelfPrims.getVariable('speed') * Trig.unsquashedCos((theta - SelfPrims.getVariable('heading'))));
  var v1l = (SelfPrims.getVariable('speed') * Trig.unsquashedSin((theta - SelfPrims.getVariable('heading'))));
  var v2t = (speed2 * Trig.unsquashedCos((theta - heading2)));
  var v2l = (speed2 * Trig.unsquashedSin((theta - heading2)));
  var vcm = (((SelfPrims.getVariable('mass') * v1t) + (mass2 * v2t)) / (SelfPrims.getVariable('mass') + mass2));
  v1t = ((2 * vcm) - v1t);
  v2t = ((2 * vcm) - v2t);
  SelfPrims.setVariable('speed', StrictMath.sqrt((StrictMath.pow(v1t, 2) + StrictMath.pow(v1l, 2))));
  SelfPrims.setVariable('energy', ((0.5 * SelfPrims.getVariable('mass')) * StrictMath.pow(SelfPrims.getVariable('speed'), 2)));
  if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
    SelfPrims.setVariable('heading', (theta - Trig.atan(v1l, v1t)));
  }
  otherParticle.ask(function() {
    SelfPrims.setVariable('speed', StrictMath.sqrt((StrictMath.pow(v2t, 2) + StrictMath.pow(v2l, 2))));
    SelfPrims.setVariable('energy', ((0.5 * SelfPrims.getVariable('mass')) * StrictMath.pow(SelfPrims.getVariable('speed'), 2)));
    if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
      SelfPrims.setVariable('heading', (theta - Trig.atan(v2l, v2t)));
    }
  }, true);
  Call(recolor);
  otherParticle.ask(function() {
    Call(recolor);
  }, true);
}
function recolor() {
  if (Prims.lt(SelfPrims.getVariable('speed'), (0.5 * 10))) {
    SelfPrims.setVariable('color', 105);
  }
  else {
    if (Prims.gt(SelfPrims.getVariable('speed'), (1.5 * 10))) {
      SelfPrims.setVariable('color', 15);
    }
    else {
      SelfPrims.setVariable('color', 55);
    }
  }
}
function makeParticles() {
  world.turtleManager.createTurtles(world.observer.getGlobal('number-of-particles'), 'PARTICLES').ask(function() {
    Call(setupParticle);
    Call(randomPosition);
    Call(recolor);
  }, true);
  Call(calculateTickDelta);
}
function setupParticle() {
  SelfPrims.setVariable('speed', world.observer.getGlobal('init-particle-speed'));
  SelfPrims.setVariable('mass', world.observer.getGlobal('particle-mass'));
  SelfPrims.setVariable('energy', ((0.5 * SelfPrims.getVariable('mass')) * StrictMath.pow(SelfPrims.getVariable('speed'), 2)));
  SelfPrims.setVariable('last-collision', Nobody);
}
function randomPosition() {
  SelfPrims.setXY(((1 + world.topology.minPxcor) + Prims.randomFloat(((2 * world.topology.maxPxcor) - 2))), ((1 + world.topology.minPycor) + Prims.randomFloat(((2 * world.topology.maxPycor) - 2))));
}
function lastN(n, theList) {
  if (Prims.gte(n, ListPrims.length(theList))) {
    return theList;
  }
  else {
    return Call(lastN, n, ListPrims.butFirst(theList));
  }
}
function drawVertLine(xval) {
  plotManager.plotPoint(xval, plotManager.getPlotYMin());
  plotManager.lowerPen();
  plotManager.plotPoint(xval, plotManager.getPlotYMax());
  plotManager.raisePen();
}
world.observer.setGlobal('number-of-particles', 100);
world.observer.setGlobal('collide?', true);
world.observer.setGlobal('trace?', true);
world.observer.setGlobal('init-particle-speed', 10);
world.observer.setGlobal('particle-mass', 1);
