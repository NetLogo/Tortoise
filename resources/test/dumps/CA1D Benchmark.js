var modelConfig  = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};

var PenBundle = tortoise_require('engine/plot/pen');
var Plot      = tortoise_require('engine/plot/plot');
var PlotOps   = tortoise_require('engine/plot/plotops');

modelConfig.plots = [];
if (typeof javax !== "undefined") { modelConfig.output = { clear: function(){}, write: function(str) { context.getWriter().print(str); } } }

var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])(["ooo", "ooi", "oio", "oii", "ioo", "ioi", "iio", "iii", "foreground", "background", "rule", "density", "auto-continue?", "row", "old-rule", "rules-shown?", "gone?", "result"], ["ooo", "ooi", "oio", "oii", "ioo", "ioi", "iio", "iii", "foreground", "background", "rule", "density", "auto-continue?"], ["on?"], -400, 400, -300, 300, 1.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{"direction-indicator":{"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0.0,"lines":[{"x-offset":-0.2,"is-visible":false,"dashes":[0.0,1.0]},{"x-offset":0.0,"is-visible":true,"dashes":[1.0,0.0]},{"x-offset":0.2,"is-visible":false,"dashes":[0.0,1.0]}]}});

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
var Exception      = tortoise_require('util/exception');
var NLMath         = tortoise_require('util/nlmath');
var notImplemented = tortoise_require('util/notimplemented');

var Dump      = tortoise_require('engine/dump');
var ColorModel = tortoise_require('engine/core/colormodel');
var Link      = tortoise_require('engine/core/link');
var LinkSet   = tortoise_require('engine/core/linkset');
var Nobody    = tortoise_require('engine/core/nobody');
var PatchSet  = tortoise_require('engine/core/patchset');
var Turtle    = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var NLType    = tortoise_require('engine/core/typechecker');
var Tasks     = tortoise_require('engine/prim/tasks');

var AgentModel = tortoise_require('agentmodel');
var Meta       = tortoise_require('meta');
var Random     = tortoise_require('shim/random');
var StrictMath = tortoise_require('shim/strictmath');
function startup() {
  world.observer.setGlobal("rules-shown?", false);
  world.observer.setGlobal("gone?", false);
  world.observer.setGlobal("old-rule", world.observer.getGlobal("rule"));
}
function benchmark() {
  Random.setSeed(4378);
  Call(setupRandom);
  workspace.timer.reset();
  for (var _index_415_421 = 0, _repeatcount_415_421 = StrictMath.floor((10 * world.topology.height)); _index_415_421 < _repeatcount_415_421; _index_415_421++){
    Call(go);
  }
  world.observer.setGlobal("result", workspace.timer.elapsed());
}
function setupGeneral() {
  world.clearPatches();
  world.turtleManager.clearTurtles();
  world.observer.setGlobal("row", world.topology.maxPycor);
  Call(refreshRules);
  world.observer.setGlobal("gone?", false);
  world.observer.setGlobal("rules-shown?", false);
}
function singleCell() {
  Call(setupGeneral);
  world.patches().agentFilter(function() {
    return Prims.equality(SelfPrims.getPatchVariable("pycor"), world.observer.getGlobal("row"));
  }).ask(function() {
    SelfPrims.setPatchVariable("on?", false);
    SelfPrims.setPatchVariable("pcolor", world.observer.getGlobal("background"));
  }, true);
  world.getPatchAt(0, world.observer.getGlobal("row")).ask(function() {
    SelfPrims.setPatchVariable("pcolor", world.observer.getGlobal("foreground"));
    SelfPrims.setPatchVariable("on?", true);
  }, true);
  world.ticker.reset();
}
function setupRandom() {
  Call(setupGeneral);
  world.patches().agentFilter(function() {
    return Prims.equality(SelfPrims.getPatchVariable("pycor"), world.observer.getGlobal("row"));
  }).ask(function() {
    SelfPrims.setPatchVariable("on?", Prims.lt(Prims.random(100), world.observer.getGlobal("density")));
    Call(colorPatch);
  }, true);
  world.ticker.reset();
}
function setupContinue() {
  var on_pList = [];
  if (!world.observer.getGlobal("gone?")) {
    throw new Exception.StopInterrupt;
  }
  on_pList = Tasks.map(Tasks.reporterTask(function() {
    var taskArguments = arguments;
    return taskArguments[0].projectionBy(function() {
      return SelfPrims.getPatchVariable("on?");
    });
  }), ListPrims.sort(world.patches().agentFilter(function() {
    return Prims.equality(SelfPrims.getPatchVariable("pycor"), world.observer.getGlobal("row"));
  })));
  Call(setupGeneral);
  world.patches().agentFilter(function() {
    return Prims.equality(SelfPrims.getPatchVariable("pycor"), world.observer.getGlobal("row"));
  }).ask(function() {
    SelfPrims.setPatchVariable("on?", ListPrims.item((SelfPrims.getPatchVariable("pxcor") + world.topology.maxPxcor), on_pList));
    Call(colorPatch);
  }, true);
  world.observer.setGlobal("gone?", true);
}
function go() {
  if (world.observer.getGlobal("rules-shown?")) {
    throw new Exception.StopInterrupt;
  }
  if (Prims.equality(world.observer.getGlobal("row"), world.topology.minPycor)) {
    if (world.observer.getGlobal("auto-continue?")) {
      notImplemented('display', undefined)();
      Call(setupContinue);
    }
    else {
      throw new Exception.StopInterrupt;
    }
  }
  world.patches().agentFilter(function() {
    return Prims.equality(SelfPrims.getPatchVariable("pycor"), world.observer.getGlobal("row"));
  }).ask(function() {
    Call(doRule);
  }, true);
  world.observer.setGlobal("row", (world.observer.getGlobal("row") - 1));
  world.patches().agentFilter(function() {
    return Prims.equality(SelfPrims.getPatchVariable("pycor"), world.observer.getGlobal("row"));
  }).ask(function() {
    Call(colorPatch);
  }, true);
  world.observer.setGlobal("gone?", true);
  world.ticker.tick();
}
function doRule() {
  var leftOn_p = SelfManager.self().patchAt(-1, 0).projectionBy(function() {
    return SelfPrims.getPatchVariable("on?");
  });
  var rightOn_p = SelfManager.self().patchAt(1, 0).projectionBy(function() {
    return SelfPrims.getPatchVariable("on?");
  });
  var newValue = ((((((((((world.observer.getGlobal("iii") && leftOn_p) && SelfPrims.getPatchVariable("on?")) && rightOn_p) || (((world.observer.getGlobal("iio") && leftOn_p) && SelfPrims.getPatchVariable("on?")) && !rightOn_p)) || (((world.observer.getGlobal("ioi") && leftOn_p) && !SelfPrims.getPatchVariable("on?")) && rightOn_p)) || (((world.observer.getGlobal("ioo") && leftOn_p) && !SelfPrims.getPatchVariable("on?")) && !rightOn_p)) || (((world.observer.getGlobal("oii") && !leftOn_p) && SelfPrims.getPatchVariable("on?")) && rightOn_p)) || (((world.observer.getGlobal("oio") && !leftOn_p) && SelfPrims.getPatchVariable("on?")) && !rightOn_p)) || (((world.observer.getGlobal("ooi") && !leftOn_p) && !SelfPrims.getPatchVariable("on?")) && rightOn_p)) || (((world.observer.getGlobal("ooo") && !leftOn_p) && !SelfPrims.getPatchVariable("on?")) && !rightOn_p));
  SelfManager.self().patchAt(0, -1).ask(function() {
    SelfPrims.setPatchVariable("on?", newValue);
  }, true);
}
function colorPatch() {
  if (SelfPrims.getPatchVariable("on?")) {
    SelfPrims.setPatchVariable("pcolor", world.observer.getGlobal("foreground"));
  }
  else {
    SelfPrims.setPatchVariable("pcolor", world.observer.getGlobal("background"));
  }
}
function bindigit(number, powerOfTwo) {
  if (Prims.equality(powerOfTwo, 0)) {
    return NLMath.mod(NLMath.floor(number), 2);
  }
  else {
    return Call(bindigit, (NLMath.floor(number) / 2), (powerOfTwo - 1));
  }
}
function refreshRules() {
  if (Prims.equality(world.observer.getGlobal("rule"), world.observer.getGlobal("old-rule"))) {
    if (!Prims.equality(world.observer.getGlobal("rule"), Call(calculateRule))) {
      world.observer.setGlobal("rule", Call(calculateRule));
    }
  }
  else {
    Call(extrapolateSwitches);
  }
  world.observer.setGlobal("old-rule", world.observer.getGlobal("rule"));
}
function extrapolateSwitches() {
  world.observer.setGlobal("ooo", Prims.equality(Call(bindigit, world.observer.getGlobal("rule"), 0), 1));
  world.observer.setGlobal("ooi", Prims.equality(Call(bindigit, world.observer.getGlobal("rule"), 1), 1));
  world.observer.setGlobal("oio", Prims.equality(Call(bindigit, world.observer.getGlobal("rule"), 2), 1));
  world.observer.setGlobal("oii", Prims.equality(Call(bindigit, world.observer.getGlobal("rule"), 3), 1));
  world.observer.setGlobal("ioo", Prims.equality(Call(bindigit, world.observer.getGlobal("rule"), 4), 1));
  world.observer.setGlobal("ioi", Prims.equality(Call(bindigit, world.observer.getGlobal("rule"), 5), 1));
  world.observer.setGlobal("iio", Prims.equality(Call(bindigit, world.observer.getGlobal("rule"), 6), 1));
  world.observer.setGlobal("iii", Prims.equality(Call(bindigit, world.observer.getGlobal("rule"), 7), 1));
}
function calculateRule() {
  var rresult = 0;
  if (world.observer.getGlobal("ooo")) {
    rresult = (rresult + 1);
  }
  if (world.observer.getGlobal("ooi")) {
    rresult = (rresult + 2);
  }
  if (world.observer.getGlobal("oio")) {
    rresult = (rresult + 4);
  }
  if (world.observer.getGlobal("oii")) {
    rresult = (rresult + 8);
  }
  if (world.observer.getGlobal("ioo")) {
    rresult = (rresult + 16);
  }
  if (world.observer.getGlobal("ioi")) {
    rresult = (rresult + 32);
  }
  if (world.observer.getGlobal("iio")) {
    rresult = (rresult + 64);
  }
  if (world.observer.getGlobal("iii")) {
    rresult = (rresult + 128);
  }
  return rresult;
}
function showRules() {
  Call(setupGeneral);
  var rules = Call(listRules);
  world.patches().agentFilter(function() {
    return Prims.gt(SelfPrims.getPatchVariable("pycor"), (world.topology.maxPycor - 5));
  }).ask(function() {
    SelfPrims.setPatchVariable("pcolor", 5);
  }, true);
  world.patches().agentFilter(function() {
    return (Prims.equality(SelfPrims.getPatchVariable("pycor"), world.topology.maxPycor) && Prims.equality(NLMath.mod((SelfPrims.getPatchVariable("pxcor") + 1), NLMath.floor((world.topology.width / 8))), 0));
  }).ask(function() {
    SelfPrims.sprout(1, "TURTLES").ask(function() {
      SelfPrims.setVariable("heading", 270);
      SelfPrims.fd(18);
      Call(printBlock, ListPrims.item(0, ListPrims.item(SelfPrims.getVariable("who"), rules)));
      SelfPrims.fd(2);
      Call(printBlock, ListPrims.item(1, ListPrims.item(SelfPrims.getVariable("who"), rules)));
      SelfPrims.fd(2);
      Call(printBlock, ListPrims.item(2, ListPrims.item(SelfPrims.getVariable("who"), rules)));
      SelfPrims.bk(2);
      SelfPrims.setVariable("heading", 180);
      SelfPrims.fd(2);
      SelfPrims.setVariable("heading", 90);
      Call(printBlock, ListPrims.item(3, ListPrims.item(SelfPrims.getVariable("who"), rules)));
      SelfPrims.die();
    }, true);
  }, true);
  world.observer.setGlobal("rules-shown?", true);
}
function printBlock(state) {
  if (state) {
    SelfPrims.setVariable("color", world.observer.getGlobal("foreground"));
  }
  else {
    SelfPrims.setVariable("color", world.observer.getGlobal("background"));
  }
  SelfPrims.setVariable("heading", 90);
  for (var _index_5599_5605 = 0, _repeatcount_5599_5605 = StrictMath.floor(4); _index_5599_5605 < _repeatcount_5599_5605; _index_5599_5605++){
    SelfPrims.setPatchVariable("pcolor", SelfPrims.getVariable("color"));
    SelfPrims.right(90);
    SelfPrims.fd(1);
  }
}
function listRules() {
  var rules = [];
  rules = ListPrims.lput(ListPrims.lput(world.observer.getGlobal("ooo"), [false, false, false]), rules);
  rules = ListPrims.lput(ListPrims.lput(world.observer.getGlobal("ooi"), [false, false, true]), rules);
  rules = ListPrims.lput(ListPrims.lput(world.observer.getGlobal("oio"), [false, true, false]), rules);
  rules = ListPrims.lput(ListPrims.lput(world.observer.getGlobal("oii"), [false, true, true]), rules);
  rules = ListPrims.lput(ListPrims.lput(world.observer.getGlobal("ioo"), [true, false, false]), rules);
  rules = ListPrims.lput(ListPrims.lput(world.observer.getGlobal("ioi"), [true, false, true]), rules);
  rules = ListPrims.lput(ListPrims.lput(world.observer.getGlobal("iio"), [true, true, false]), rules);
  rules = ListPrims.lput(ListPrims.lput(world.observer.getGlobal("iii"), [true, true, true]), rules);
  return rules;
}
world.observer.setGlobal("ooo", true);
world.observer.setGlobal("ooi", false);
world.observer.setGlobal("oio", false);
world.observer.setGlobal("oii", true);
world.observer.setGlobal("ioo", false);
world.observer.setGlobal("ioi", true);
world.observer.setGlobal("iio", true);
world.observer.setGlobal("iii", false);
world.observer.setGlobal("foreground", 55);
world.observer.setGlobal("background", 0);
world.observer.setGlobal("rule", 105);
world.observer.setGlobal("density", 10);
world.observer.setGlobal("auto-continue?", true);
