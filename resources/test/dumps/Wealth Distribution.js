var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Dump = tortoise_require('engine/dump');
var Exception = tortoise_require('util/exception');
var Extensions = tortoise_require('extensions/all');
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
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":30,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":270,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0.0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0.0,1.0]},{"x-offset":0.0,"is-visible":true,"dash-pattern":[1.0,0.0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0.0,1.0]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    input: function(str) { return 'dummy implementation'; },
    notify: function(str) {},
    yesOrNo: function(str) { return true; }
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
modelConfig.plots = [(function() {
  var name    = 'Class Plot';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('low', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Class Plot', 'low')(function() {
        try {
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).size());
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('mid', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Class Plot', 'mid')(function() {
        try {
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).size());
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('up', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Class Plot', 'up')(function() {
        try {
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).size());
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Class Plot', undefined)(function() {
        try {
          plotManager.setYRange(0, world.observer.getGlobal("num-people"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Turtles", true, true, 0.0, 50.0, 0.0, 250.0, setup, update);
})(), (function() {
  var name    = 'Class Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Class Histogram', 'default')(function() {
        try {
          plotManager.resetPen();
          plotManager.setPenColor(15);
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).size());
          plotManager.setPenColor(55);
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).size());
          plotManager.setPenColor(105);
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).size());
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Class Histogram', undefined)(function() {
        try {
          plotManager.setYRange(0, world.observer.getGlobal("num-people"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Classes", "Turtles", false, false, 0.0, 3.0, 0.0, 250.0, setup, update);
})(), (function() {
  var name    = 'Lorenz Curve';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('lorenz', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Lorenz Curve', 'lorenz')(function() {
        try {
          plotManager.resetPen();
          plotManager.setPenInterval(Prims.div(100, world.observer.getGlobal("num-people")));
          plotManager.plotValue(0);
          Tasks.forEach(Tasks.commandTask(function(_0) {
            if (arguments.length < 1) {
              throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
            }
            plotManager.plotValue(_0);
          }), world.observer.getGlobal("lorenz-points"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('equal', plotOps.makePenOps, false, new PenBundle.State(0.0, 100.0, PenBundle.DisplayMode.Line), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Lorenz Curve', 'equal')(function() {
        try {
          plotManager.plotValue(0);
          plotManager.plotValue(100);
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Pop %", "Wealth %", true, false, 0.0, 100.0, 0.0, 100.0, setup, update);
})(), (function() {
  var name    = 'Gini-Index v. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Gini-Index v. Time', 'default')(function() {
        try {
          plotManager.plotValue(Prims.div(Prims.div(world.observer.getGlobal("gini-index-reserve"), world.observer.getGlobal("num-people")), 0.5));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
  return new Plot(name, pens, plotOps, "Time", "Gini", false, true, 0.0, 50.0, 0.0, 1.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["age", "wealth", "life-expectancy", "metabolism", "vision"], [])(["max-vision", "grain-growth-interval", "metabolism-max", "num-people", "percent-best-land", "life-expectancy-max", "num-grain-grown", "life-expectancy-min", "max-grain", "gini-index-reserve", "lorenz-points"], ["max-vision", "grain-growth-interval", "metabolism-max", "num-people", "percent-best-land", "life-expectancy-max", "num-grain-grown", "life-expectancy-min"], ["grain-here", "max-grain-here"], -25, 25, -25, 25, 8.0, true, true, turtleShapes, linkShapes, function(){});
var BreedManager = workspace.breedManager;
var ExportPrims = workspace.exportPrims;
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
      world.clearAll();
      world.observer.setGlobal("max-grain", 50);
      procedures["SETUP-PATCHES"]();
      procedures["SETUP-TURTLES"]();
      procedures["UPDATE-LORENZ-AND-GINI"]();
      world.ticker.reset();
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("max-grain-here", 0);
        if (Prims.lte(Prims.randomFloat(100), world.observer.getGlobal("percent-best-land"))) {
          SelfManager.self().setPatchVariable("max-grain-here", world.observer.getGlobal("max-grain"));
          SelfManager.self().setPatchVariable("grain-here", SelfManager.self().getPatchVariable("max-grain-here"));
        }
      }, true);
      for (let _index_1278_1284 = 0, _repeatcount_1278_1284 = StrictMath.floor(5); _index_1278_1284 < _repeatcount_1278_1284; _index_1278_1284++){
        world.patches().agentFilter(function() { return !Prims.equality(SelfManager.self().getPatchVariable("max-grain-here"), 0); }).ask(function() {
          SelfManager.self().setPatchVariable("grain-here", SelfManager.self().getPatchVariable("max-grain-here"));
        }, true);
        world.topology.diffuse("grain-here", 0.25)
      }
      for (let _index_1408_1414 = 0, _repeatcount_1408_1414 = StrictMath.floor(10); _index_1408_1414 < _repeatcount_1408_1414; _index_1408_1414++){
        world.topology.diffuse("grain-here", 0.25)
      }
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("grain-here", NLMath.floor(SelfManager.self().getPatchVariable("grain-here")));
        SelfManager.self().setPatchVariable("max-grain-here", SelfManager.self().getPatchVariable("grain-here"));
        procedures["RECOLOR-PATCH"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupPatches"] = temp;
  procs["SETUP-PATCHES"] = temp;
  temp = (function() {
    try {
      SelfManager.self().setPatchVariable("pcolor", ColorModel.scaleColor(45, SelfManager.self().getPatchVariable("grain-here"), 0, world.observer.getGlobal("max-grain")));
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["recolorPatch"] = temp;
  procs["RECOLOR-PATCH"] = temp;
  temp = (function() {
    try {
      BreedManager.setDefaultShape(world.turtles().getSpecialName(), "person")
      world.turtleManager.createTurtles(world.observer.getGlobal("num-people"), "").ask(function() {
        SelfManager.self().moveTo(ListPrims.oneOf(world.patches()));
        SelfManager.self().setVariable("size", 1.5);
        procedures["SET-INITIAL-TURTLE-VARS"]();
        SelfManager.self().setVariable("age", Prims.random(SelfManager.self().getVariable("life-expectancy")));
      }, true);
      procedures["RECOLOR-TURTLES"]();
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupTurtles"] = temp;
  procs["SETUP-TURTLES"] = temp;
  temp = (function() {
    try {
      SelfManager.self().setVariable("age", 0);
      SelfManager.self().face(ListPrims.oneOf(SelfManager.self().getNeighbors4()));
      SelfManager.self().setVariable("life-expectancy", (world.observer.getGlobal("life-expectancy-min") + Prims.random(((world.observer.getGlobal("life-expectancy-max") - world.observer.getGlobal("life-expectancy-min")) + 1))));
      SelfManager.self().setVariable("metabolism", (1 + Prims.random(world.observer.getGlobal("metabolism-max"))));
      SelfManager.self().setVariable("wealth", (SelfManager.self().getVariable("metabolism") + Prims.random(50)));
      SelfManager.self().setVariable("vision", (1 + Prims.random(world.observer.getGlobal("max-vision"))));
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setInitialTurtleVars"] = temp;
  procs["SET-INITIAL-TURTLE-VARS"] = temp;
  temp = (function() {
    try {
      let maxWealth = ListPrims.max(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("wealth"); }));
      world.turtles().ask(function() {
        if (Prims.lte(SelfManager.self().getVariable("wealth"), Prims.div(maxWealth, 3))) {
          SelfManager.self().setVariable("color", 15);
        }
        else {
          if (Prims.lte(SelfManager.self().getVariable("wealth"), Prims.div((maxWealth * 2), 3))) {
            SelfManager.self().setVariable("color", 55);
          }
          else {
            SelfManager.self().setVariable("color", 105);
          }
        }
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["recolorTurtles"] = temp;
  procs["RECOLOR-TURTLES"] = temp;
  temp = (function() {
    try {
      world.turtles().ask(function() { procedures["TURN-TOWARDS-GRAIN"](); }, true);
      procedures["HARVEST"]();
      world.turtles().ask(function() { procedures["MOVE-EAT-AGE-DIE"](); }, true);
      procedures["RECOLOR-TURTLES"]();
      if (Prims.equality(NLMath.mod(world.ticker.tickCount(), world.observer.getGlobal("grain-growth-interval")), 0)) {
        world.patches().ask(function() { procedures["GROW-GRAIN"](); }, true);
      }
      procedures["UPDATE-LORENZ-AND-GINI"]();
      world.ticker.tick();
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      SelfManager.self().setVariable("heading", 0);
      let bestDirection = 0;
      let bestAmount = procedures["GRAIN-AHEAD"]();
      SelfManager.self().setVariable("heading", 90);
      if (Prims.gt(procedures["GRAIN-AHEAD"](), bestAmount)) {
        bestDirection = 90;
        bestAmount = procedures["GRAIN-AHEAD"]();
      }
      SelfManager.self().setVariable("heading", 180);
      if (Prims.gt(procedures["GRAIN-AHEAD"](), bestAmount)) {
        bestDirection = 180;
        bestAmount = procedures["GRAIN-AHEAD"]();
      }
      SelfManager.self().setVariable("heading", 270);
      if (Prims.gt(procedures["GRAIN-AHEAD"](), bestAmount)) {
        bestDirection = 270;
        bestAmount = procedures["GRAIN-AHEAD"]();
      }
      SelfManager.self().setVariable("heading", bestDirection);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["turnTowardsGrain"] = temp;
  procs["TURN-TOWARDS-GRAIN"] = temp;
  temp = (function() {
    try {
      let total = 0;
      let howFar = 1;
      for (let _index_4005_4011 = 0, _repeatcount_4005_4011 = StrictMath.floor(SelfManager.self().getVariable("vision")); _index_4005_4011 < _repeatcount_4005_4011; _index_4005_4011++){
        total = (total + SelfManager.self().patchAhead(howFar).projectionBy(function() { return SelfManager.self().getPatchVariable("grain-here"); }));
        howFar = (howFar + 1);
      }
      throw new Exception.ReportInterrupt(total);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["grainAhead"] = temp;
  procs["GRAIN-AHEAD"] = temp;
  temp = (function() {
    try {
      if (Prims.lt(SelfManager.self().getPatchVariable("grain-here"), SelfManager.self().getPatchVariable("max-grain-here"))) {
        SelfManager.self().setPatchVariable("grain-here", (SelfManager.self().getPatchVariable("grain-here") + world.observer.getGlobal("num-grain-grown")));
        if (Prims.gt(SelfManager.self().getPatchVariable("grain-here"), SelfManager.self().getPatchVariable("max-grain-here"))) {
          SelfManager.self().setPatchVariable("grain-here", SelfManager.self().getPatchVariable("max-grain-here"));
        }
        procedures["RECOLOR-PATCH"]();
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["growGrain"] = temp;
  procs["GROW-GRAIN"] = temp;
  temp = (function() {
    try {
      world.turtles().ask(function() {
        SelfManager.self().setVariable("wealth", NLMath.floor((SelfManager.self().getVariable("wealth") + Prims.div(SelfManager.self().getPatchVariable("grain-here"), SelfManager.self().turtlesHere().size()))));
      }, true);
      world.turtles().ask(function() {
        SelfManager.self().setPatchVariable("grain-here", 0);
        procedures["RECOLOR-PATCH"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["harvest"] = temp;
  procs["HARVEST"] = temp;
  temp = (function() {
    try {
      SelfManager.self().fd(1);
      SelfManager.self().setVariable("wealth", (SelfManager.self().getVariable("wealth") - SelfManager.self().getVariable("metabolism")));
      SelfManager.self().setVariable("age", (SelfManager.self().getVariable("age") + 1));
      if ((Prims.lt(SelfManager.self().getVariable("wealth"), 0) || Prims.gte(SelfManager.self().getVariable("age"), SelfManager.self().getVariable("life-expectancy")))) {
        procedures["SET-INITIAL-TURTLE-VARS"]();
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["moveEatAgeDie"] = temp;
  procs["MOVE-EAT-AGE-DIE"] = temp;
  temp = (function() {
    try {
      let sortedWealths = ListPrims.sort(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("wealth"); }));
      let totalWealth = ListPrims.sum(sortedWealths);
      let wealthSumSoFar = 0;
      let index = 0;
      world.observer.setGlobal("gini-index-reserve", 0);
      world.observer.setGlobal("lorenz-points", []);
      for (let _index_6031_6037 = 0, _repeatcount_6031_6037 = StrictMath.floor(world.observer.getGlobal("num-people")); _index_6031_6037 < _repeatcount_6031_6037; _index_6031_6037++){
        wealthSumSoFar = (wealthSumSoFar + ListPrims.item(index, sortedWealths));
        world.observer.setGlobal("lorenz-points", ListPrims.lput((Prims.div(wealthSumSoFar, totalWealth) * 100), world.observer.getGlobal("lorenz-points")));
        index = (index + 1);
        world.observer.setGlobal("gini-index-reserve", ((world.observer.getGlobal("gini-index-reserve") + Prims.div(index, world.observer.getGlobal("num-people"))) - Prims.div(wealthSumSoFar, totalWealth)));
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateLorenzAndGini"] = temp;
  procs["UPDATE-LORENZ-AND-GINI"] = temp;
  return procs;
})();
world.observer.setGlobal("max-vision", 5);
world.observer.setGlobal("grain-growth-interval", 1);
world.observer.setGlobal("metabolism-max", 15);
world.observer.setGlobal("num-people", 250);
world.observer.setGlobal("percent-best-land", 10);
world.observer.setGlobal("life-expectancy-max", 83);
world.observer.setGlobal("num-grain-grown", 4);
world.observer.setGlobal("life-expectancy-min", 1);
