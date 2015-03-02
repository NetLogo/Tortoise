var modelConfig  = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};

var PenBundle = tortoise_require('engine/plot/pen');
var Plot      = tortoise_require('engine/plot/plot');
var PlotOps   = tortoise_require('engine/plot/plotops');

modelConfig.plots = [];
if (javax !== undefined) { modelConfig.output = { clear: function(){}, write: function(str) { context.getWriter().print(str); } } }

var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: 'PARTICLES', singular: 'particle', varNames: ['speed', 'mass'] }])([], [])(['number', 'largest-particle-size', 'color-scheme', 'smallest-particle-size', 'result', 'tick-length', 'box-edge', 'colliding-particles', 'sorted-colliding-particles', 'colliding-particle-1', 'colliding-particle-2', 'original-tick-length', 'last-view-update', 'manage-view-updates?', 'view-update-rate'], ['number', 'largest-particle-size', 'color-scheme', 'smallest-particle-size'], [], -40, 40, -40, 40, 6.0, false, false, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"rotate":false,"elements":[{"x":1,"y":1,"diam":298,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"vector":{"rotate":true,"elements":[{"x1":150,"y1":15,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[120,150,180,120],"ycors":[30,0,30,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});

var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var ListPrims     = workspace.listPrims;
var MousePrims    = workspace.mousePrims;
var plotManager   = workspace.plotManager;
var Prims         = workspace.prims;
var PrintPrims    = workspace.printPrims;
var OutputPrims   = workspace.outputPrims;
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
function benchmark() {
  Random.setSeed(12345);
  workspace.timer.reset();
  Call(setup);
  world.observer.setGlobal('manage-view-updates?', false);
  for (var _index_664_670 = 0, _repeatcount_664_670 = StrictMath.floor(3500); _index_664_670 < _repeatcount_664_670; _index_664_670++){
    Call(go);
  }
  world.observer.setGlobal('result', workspace.timer.elapsed());
}
function setup() {
  world.clearAll();
  world.ticker.reset();
  BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PARTICLES").getBreedName(), "circle")
  world.observer.setGlobal('manage-view-updates?', true);
  world.observer.setGlobal('view-update-rate', 0.2);
  world.observer.setGlobal('box-edge', (world.topology.maxPxcor - 1));
  Call(makeBox);
  Call(makeParticles);
  world.observer.setGlobal('tick-length', (1 / StrictMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() {
    return SelfPrims.getVariable('speed');
  })))));
  world.observer.setGlobal('original-tick-length', world.observer.getGlobal('tick-length'));
  world.observer.setGlobal('colliding-particle-1', Nobody);
  world.observer.setGlobal('colliding-particle-2', Nobody);
  Call(rebuildCollisionList);
}
function rebuildCollisionList() {
  world.observer.setGlobal('colliding-particles', []);
  world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
    Call(checkForWallCollision);
  }, true);
  world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
    Call(checkForParticleCollision);
  }, true);
}
function go() {
  if ((world.observer.getGlobal('colliding-particle-2') instanceof Turtle)) {
    world.observer.setGlobal('colliding-particles', world.observer.getGlobal('colliding-particles').filter(Tasks.reporterTask(function() {
      var taskArguments = arguments;
      return (((!Prims.equality(ListPrims.item(1, taskArguments[0]), world.observer.getGlobal('colliding-particle-1')) && !Prims.equality(ListPrims.item(2, taskArguments[0]), world.observer.getGlobal('colliding-particle-1'))) && !Prims.equality(ListPrims.item(1, taskArguments[0]), world.observer.getGlobal('colliding-particle-2'))) && !Prims.equality(ListPrims.item(2, taskArguments[0]), world.observer.getGlobal('colliding-particle-2')));
    })));
    world.observer.getGlobal('colliding-particle-2').ask(function() {
      Call(checkForWallCollision);
    }, true);
    world.observer.getGlobal('colliding-particle-2').ask(function() {
      Call(checkForParticleCollision);
    }, true);
  }
  else {
    world.observer.setGlobal('colliding-particles', world.observer.getGlobal('colliding-particles').filter(Tasks.reporterTask(function() {
      var taskArguments = arguments;
      return (!Prims.equality(ListPrims.item(1, taskArguments[0]), world.observer.getGlobal('colliding-particle-1')) && !Prims.equality(ListPrims.item(2, taskArguments[0]), world.observer.getGlobal('colliding-particle-1')));
    })));
  }
  if (!Prims.equality(world.observer.getGlobal('colliding-particle-1'), Nobody)) {
    world.observer.getGlobal('colliding-particle-1').ask(function() {
      Call(checkForWallCollision);
    }, true);
  }
  if (!Prims.equality(world.observer.getGlobal('colliding-particle-1'), Nobody)) {
    world.observer.getGlobal('colliding-particle-1').ask(function() {
      Call(checkForParticleCollision);
    }, true);
  }
  Call(sortCollisions);
  world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
    SelfPrims.jump((SelfPrims.getVariable('speed') * world.observer.getGlobal('tick-length')));
  }, true);
  Call(collideWinners);
  world.ticker.tickAdvance(world.observer.getGlobal('tick-length'));
  if (world.observer.getGlobal('manage-view-updates?')) {
    if (Prims.gt((world.ticker.tickCount() - world.observer.getGlobal('last-view-update')), world.observer.getGlobal('view-update-rate'))) {
      notImplemented('display', undefined)();
      world.observer.setGlobal('last-view-update', world.ticker.tickCount());
    }
  }
}
function convertHeadingX(headingAngle) {
  return Trig.unsquashedSin(headingAngle);
}
function convertHeadingY(headingAngle) {
  return Trig.unsquashedCos(headingAngle);
}
function checkForParticleCollision() {
  var myX = SelfPrims.getVariable('xcor');
  var myY = SelfPrims.getVariable('ycor');
  var myParticleSize = SelfPrims.getVariable('size');
  var myXSpeed = (SelfPrims.getVariable('speed') * Call(convertHeadingX, SelfPrims.getVariable('heading')));
  var myYSpeed = (SelfPrims.getVariable('speed') * Call(convertHeadingY, SelfPrims.getVariable('heading')));
  SelfPrims.other(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() {
    var dpx = (SelfPrims.getVariable('xcor') - myX);
    var dpy = (SelfPrims.getVariable('ycor') - myY);
    var xSpeed = (SelfPrims.getVariable('speed') * Call(convertHeadingX, SelfPrims.getVariable('heading')));
    var ySpeed = (SelfPrims.getVariable('speed') * Call(convertHeadingY, SelfPrims.getVariable('heading')));
    var dvx = (xSpeed - myXSpeed);
    var dvy = (ySpeed - myYSpeed);
    var sumR = ((myParticleSize / 2) + (SelfManager.self().projectionBy(function() {
      return SelfPrims.getVariable('size');
    }) / 2));
    var pSquared = (((dpx * dpx) + (dpy * dpy)) - StrictMath.pow(sumR, 2));
    var pv = (2 * ((dpx * dvx) + (dpy * dvy)));
    var vSquared = ((dvx * dvx) + (dvy * dvy));
    var d1 = (StrictMath.pow(pv, 2) - ((4 * vSquared) * pSquared));
    var timeToCollision = -1;
    if (Prims.gte(d1, 0)) {
      timeToCollision = (( -pv - StrictMath.sqrt(d1)) / (2 * vSquared));
    }
    if (Prims.gt(timeToCollision, 0)) {
      var collidingPair = ListPrims.list((timeToCollision + world.ticker.tickCount()), SelfManager.self(), SelfManager.myself());
      world.observer.setGlobal('colliding-particles', ListPrims.fput(collidingPair, world.observer.getGlobal('colliding-particles')));
    }
  }, true);
}
function checkForWallCollision() {
  var xSpeed = (SelfPrims.getVariable('speed') * Call(convertHeadingX, SelfPrims.getVariable('heading')));
  var ySpeed = (SelfPrims.getVariable('speed') * Call(convertHeadingY, SelfPrims.getVariable('heading')));
  var xposPlane = (world.observer.getGlobal('box-edge') - 0.5);
  var xnegPlane = ( -world.observer.getGlobal('box-edge') + 0.5);
  var yposPlane = (world.observer.getGlobal('box-edge') - 0.5);
  var ynegPlane = ( -world.observer.getGlobal('box-edge') + 0.5);
  var contactPointXpos = (SelfPrims.getVariable('xcor') + (SelfPrims.getVariable('size') / 2));
  var contactPointXneg = (SelfPrims.getVariable('xcor') - (SelfPrims.getVariable('size') / 2));
  var contactPointYpos = (SelfPrims.getVariable('ycor') + (SelfPrims.getVariable('size') / 2));
  var contactPointYneg = (SelfPrims.getVariable('ycor') - (SelfPrims.getVariable('size') / 2));
  var dpxpos = (xposPlane - contactPointXpos);
  var dpxneg = (xnegPlane - contactPointXneg);
  var dpypos = (yposPlane - contactPointYpos);
  var dpyneg = (ynegPlane - contactPointYneg);
  var tPlaneXpos = 0;
  if (!Prims.equality(xSpeed, 0)) {
    tPlaneXpos = (dpxpos / xSpeed);
  }
  else {
    tPlaneXpos = 0;
  }
  if (Prims.gt(tPlaneXpos, 0)) {
    Call(assignCollidingWall, tPlaneXpos, "plane-xpos");
  }
  var tPlaneXneg = 0;
  if (!Prims.equality(xSpeed, 0)) {
    tPlaneXneg = (dpxneg / xSpeed);
  }
  else {
    tPlaneXneg = 0;
  }
  if (Prims.gt(tPlaneXneg, 0)) {
    Call(assignCollidingWall, tPlaneXneg, "plane-xneg");
  }
  var tPlaneYpos = 0;
  if (!Prims.equality(ySpeed, 0)) {
    tPlaneYpos = (dpypos / ySpeed);
  }
  else {
    tPlaneYpos = 0;
  }
  if (Prims.gt(tPlaneYpos, 0)) {
    Call(assignCollidingWall, tPlaneYpos, "plane-ypos");
  }
  var tPlaneYneg = 0;
  if (!Prims.equality(ySpeed, 0)) {
    tPlaneYneg = (dpyneg / ySpeed);
  }
  else {
    tPlaneYneg = 0;
  }
  if (Prims.gt(tPlaneYneg, 0)) {
    Call(assignCollidingWall, tPlaneYneg, "plane-yneg");
  }
}
function assignCollidingWall(timeToCollision, wall) {
  var collidingPair = ListPrims.list((timeToCollision + world.ticker.tickCount()), SelfManager.self(), wall);
  world.observer.setGlobal('colliding-particles', ListPrims.fput(collidingPair, world.observer.getGlobal('colliding-particles')));
}
function sortCollisions() {
  world.observer.setGlobal('colliding-particles', world.observer.getGlobal('colliding-particles').filter(Tasks.reporterTask(function() {
    var taskArguments = arguments;
    return (!Prims.equality(ListPrims.item(1, taskArguments[0]), world.observer.getGlobal('colliding-particle-1')) || !Prims.equality(ListPrims.item(2, taskArguments[0]), world.observer.getGlobal('colliding-particle-2')));
  })));
  world.observer.setGlobal('colliding-particle-1', Nobody);
  world.observer.setGlobal('colliding-particle-2', Nobody);
  world.observer.setGlobal('tick-length', world.observer.getGlobal('original-tick-length'));
  if (Prims.equality(world.observer.getGlobal('colliding-particles'), [])) {
    throw new Exception.StopInterrupt;
  }
  var winner = ListPrims.first(world.observer.getGlobal('colliding-particles'));
  Tasks.forEach(Tasks.commandTask(function() {
    var taskArguments = arguments;
    if (Prims.lt(ListPrims.first(taskArguments[0]), ListPrims.first(winner))) {
      winner = taskArguments[0];
    }
  }), world.observer.getGlobal('colliding-particles'));
  var dt = ListPrims.item(0, winner);
  if (Prims.gt(dt, 0)) {
    if (Prims.lte((dt - world.ticker.tickCount()), 1)) {
      world.observer.setGlobal('tick-length', (dt - world.ticker.tickCount()));
      world.observer.setGlobal('colliding-particle-1', ListPrims.item(1, winner));
      world.observer.setGlobal('colliding-particle-2', ListPrims.item(2, winner));
    }
    else {
      world.observer.setGlobal('tick-length', 1);
    }
  }
}
function collideWinners() {
  if (Prims.equality(world.observer.getGlobal('colliding-particle-1'), Nobody)) {
    throw new Exception.StopInterrupt;
  }
  if ((Prims.equality(world.observer.getGlobal('colliding-particle-2'), "plane-xpos") || Prims.equality(world.observer.getGlobal('colliding-particle-2'), "plane-xneg"))) {
    world.observer.getGlobal('colliding-particle-1').ask(function() {
      SelfPrims.setVariable('heading',  -SelfPrims.getVariable('heading'));
    }, true);
    throw new Exception.StopInterrupt;
  }
  if ((Prims.equality(world.observer.getGlobal('colliding-particle-2'), "plane-ypos") || Prims.equality(world.observer.getGlobal('colliding-particle-2'), "plane-yneg"))) {
    world.observer.getGlobal('colliding-particle-1').ask(function() {
      SelfPrims.setVariable('heading', (180 - SelfPrims.getVariable('heading')));
    }, true);
    throw new Exception.StopInterrupt;
  }
  world.observer.getGlobal('colliding-particle-1').ask(function() {
    Call(collideWith, world.observer.getGlobal('colliding-particle-2'));
  }, true);
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
  var theta = SelfManager.self().towards(otherParticle);
  var v1t = (SelfPrims.getVariable('speed') * Trig.unsquashedCos((theta - SelfPrims.getVariable('heading'))));
  var v1l = (SelfPrims.getVariable('speed') * Trig.unsquashedSin((theta - SelfPrims.getVariable('heading'))));
  var v2t = (speed2 * Trig.unsquashedCos((theta - heading2)));
  var v2l = (speed2 * Trig.unsquashedSin((theta - heading2)));
  var vcm = (((SelfPrims.getVariable('mass') * v1t) + (mass2 * v2t)) / (SelfPrims.getVariable('mass') + mass2));
  v1t = ((2 * vcm) - v1t);
  v2t = ((2 * vcm) - v2t);
  SelfPrims.setVariable('speed', StrictMath.sqrt(((v1t * v1t) + (v1l * v1l))));
  if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
    SelfPrims.setVariable('heading', (theta - Trig.atan(v1l, v1t)));
  }
  otherParticle.ask(function() {
    SelfPrims.setVariable('speed', StrictMath.sqrt(((v2t * v2t) + (v2l * v2l))));
  }, true);
  if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
    otherParticle.ask(function() {
      SelfPrims.setVariable('heading', (theta - Trig.atan(v2l, v2t)));
    }, true);
  }
  Call(recolor);
  otherParticle.ask(function() {
    Call(recolor);
  }, true);
}
function recolor() {
  if (Prims.equality(world.observer.getGlobal('color-scheme'), "red-green-blue")) {
    Call(recolorBanded);
  }
  if (Prims.equality(world.observer.getGlobal('color-scheme'), "blue shades")) {
    Call(recolorShaded);
  }
  if (Prims.equality(world.observer.getGlobal('color-scheme'), "one color")) {
    Call(recolorNone);
  }
}
function recolorBanded() {
  var avgSpeed = 1;
  if (Prims.lt(SelfPrims.getVariable('speed'), (0.5 * avgSpeed))) {
    SelfPrims.setVariable('color', 105);
  }
  else {
    if (Prims.gt(SelfPrims.getVariable('speed'), (1.5 * avgSpeed))) {
      SelfPrims.setVariable('color', 15);
    }
    else {
      SelfPrims.setVariable('color', 55);
    }
  }
}
function recolorShaded() {
  var avgSpeed = 1;
  if (Prims.lt(SelfPrims.getVariable('speed'), (3 * avgSpeed))) {
    SelfPrims.setVariable('color', ((95 - 3.001) + ((8 * SelfPrims.getVariable('speed')) / (3 * avgSpeed))));
  }
  else {
    SelfPrims.setVariable('color', (95 + 4.999));
  }
}
function recolorNone() {
  SelfPrims.setVariable('color', (55 - 1));
}
function makeBox() {
  world.patches().agentFilter(function() {
    return ((Prims.equality(StrictMath.abs(SelfPrims.getPatchVariable('pxcor')), world.observer.getGlobal('box-edge')) && Prims.lte(StrictMath.abs(SelfPrims.getPatchVariable('pycor')), world.observer.getGlobal('box-edge'))) || (Prims.equality(StrictMath.abs(SelfPrims.getPatchVariable('pycor')), world.observer.getGlobal('box-edge')) && Prims.lte(StrictMath.abs(SelfPrims.getPatchVariable('pxcor')), world.observer.getGlobal('box-edge'))));
  }).ask(function() {
    SelfPrims.setPatchVariable('pcolor', 45);
  }, true);
}
function makeParticles() {
  world.turtleManager.createOrderedTurtles(world.observer.getGlobal('number'), 'PARTICLES').ask(function() {
    SelfPrims.setVariable('speed', 1);
    SelfPrims.setVariable('size', (world.observer.getGlobal('smallest-particle-size') + Prims.randomFloat((world.observer.getGlobal('largest-particle-size') - world.observer.getGlobal('smallest-particle-size')))));
    SelfPrims.setVariable('mass', (SelfPrims.getVariable('size') * SelfPrims.getVariable('size')));
    Call(recolor);
    SelfPrims.setVariable('heading', Prims.randomFloat(360));
  }, true);
  Call(arrange, world.turtleManager.turtlesOfBreed("PARTICLES"));
}
function arrange(particleSet) {
  if (!particleSet.nonEmpty()) {
    throw new Exception.StopInterrupt;
  }
  particleSet.ask(function() {
    Call(randomPosition);
  }, true);
  Call(arrange, particleSet.agentFilter(function() {
    return Call(overlapping_p);
  }));
}
function overlapping_p() {
  return SelfPrims.other(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("PARTICLES"), ((SelfPrims.getVariable('size') + world.observer.getGlobal('largest-particle-size')) / 2)).agentFilter(function() {
    return Prims.lt(SelfManager.self().distance(SelfManager.myself()), ((SelfPrims.getVariable('size') + SelfManager.myself().projectionBy(function() {
      return SelfPrims.getVariable('size');
    })) / 2));
  })).nonEmpty();
}
function randomPosition() {
  SelfPrims.setXY((ListPrims.oneOf([1, -1]) * Prims.randomFloat(((world.observer.getGlobal('box-edge') - 0.5) - (SelfPrims.getVariable('size') / 2)))), (ListPrims.oneOf([1, -1]) * Prims.randomFloat(((world.observer.getGlobal('box-edge') - 0.5) - (SelfPrims.getVariable('size') / 2)))));
}
function reverseTime() {
  world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
    SelfPrims.right(180);
  }, true);
  Call(rebuildCollisionList);
  Call(collideWinners);
}
function testTimeReversal(n) {
  Call(setup);
  world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
    notImplemented('stamp', undefined)();
  }, true);
  while (Prims.lt(world.ticker.tickCount(), n)) {
    Call(go);
  }
  var oldClock = world.ticker.tickCount();
  Call(reverseTime);
  while (Prims.lt(world.ticker.tickCount(), (2 * oldClock))) {
    Call(go);
  }
  world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
    SelfPrims.setVariable('color', 9.9);
  }, true);
}
world.observer.setGlobal('number', 200);
world.observer.setGlobal('largest-particle-size', 4);
world.observer.setGlobal('color-scheme', "red-green-blue");
world.observer.setGlobal('smallest-particle-size', 1);
