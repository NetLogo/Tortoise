var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Dump = tortoise_require('engine/dump');
var Exception = tortoise_require('util/exception');
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
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0.0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0.0,1.0]},{"x-offset":0.0,"is-visible":true,"dash-pattern":[1.0,0.0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0.0,1.0]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":1,"y":1,"diam":298,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"vector":{"name":"vector","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":15,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[120,150,180,120],"ycors":[30,0,30,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    notify:  function(str) {},
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
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PARTICLES", singular: "particle", varNames: ["speed", "mass"] }])([], [])(["number", "largest-particle-size", "color-scheme", "smallest-particle-size", "result", "tick-length", "box-edge", "colliding-particles", "sorted-colliding-particles", "colliding-particle-1", "colliding-particle-2", "original-tick-length", "last-view-update", "manage-view-updates?", "view-update-rate"], ["number", "largest-particle-size", "color-scheme", "smallest-particle-size"], [], -40, 40, -40, 40, 6.0, false, false, turtleShapes, linkShapes, function(){});
var BreedManager = workspace.breedManager;
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
    workspace.rng.setSeed(12345);
    workspace.timer.reset();
    procedures["SETUP"]();
    world.observer.setGlobal("manage-view-updates?", false);
    for (var _index_664_670 = 0, _repeatcount_664_670 = StrictMath.floor(3500); _index_664_670 < _repeatcount_664_670; _index_664_670++){
      procedures["GO"]();
    }
    world.observer.setGlobal("result", workspace.timer.elapsed());
  });
  procs["benchmark"] = temp;
  procs["BENCHMARK"] = temp;
  temp = (function() {
    world.clearAll();
    world.ticker.reset();
    BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PARTICLES").getSpecialName(), "circle")
    world.observer.setGlobal("manage-view-updates?", true);
    world.observer.setGlobal("view-update-rate", 0.2);
    world.observer.setGlobal("box-edge", (world.topology.maxPxcor - 1));
    procedures["MAKE-BOX"]();
    procedures["MAKE-PARTICLES"]();
    world.observer.setGlobal("tick-length", Prims.div(1, NLMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })))));
    world.observer.setGlobal("original-tick-length", world.observer.getGlobal("tick-length"));
    world.observer.setGlobal("colliding-particle-1", Nobody);
    world.observer.setGlobal("colliding-particle-2", Nobody);
    procedures["REBUILD-COLLISION-LIST"]();
  });
  procs["setup"] = temp;
  procs["SETUP"] = temp;
  temp = (function() {
    world.observer.setGlobal("colliding-particles", []);
    world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
    world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
  });
  procs["rebuildCollisionList"] = temp;
  procs["REBUILD-COLLISION-LIST"] = temp;
  temp = (function() {
    if (NLType(world.observer.getGlobal("colliding-particle-2")).isValidTurtle()) {
      world.observer.setGlobal("colliding-particles", world.observer.getGlobal("colliding-particles").filter(Tasks.reporterTask(function() {
        var taskArguments = arguments;
        return (((!Prims.equality(ListPrims.item(1, taskArguments[0]), world.observer.getGlobal("colliding-particle-1")) && !Prims.equality(ListPrims.item(2, taskArguments[0]), world.observer.getGlobal("colliding-particle-1"))) && !Prims.equality(ListPrims.item(1, taskArguments[0]), world.observer.getGlobal("colliding-particle-2"))) && !Prims.equality(ListPrims.item(2, taskArguments[0]), world.observer.getGlobal("colliding-particle-2")));
      })));
      world.observer.getGlobal("colliding-particle-2").ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      world.observer.getGlobal("colliding-particle-2").ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
    }
    else {
      world.observer.setGlobal("colliding-particles", world.observer.getGlobal("colliding-particles").filter(Tasks.reporterTask(function() {
        var taskArguments = arguments;
        return (!Prims.equality(ListPrims.item(1, taskArguments[0]), world.observer.getGlobal("colliding-particle-1")) && !Prims.equality(ListPrims.item(2, taskArguments[0]), world.observer.getGlobal("colliding-particle-1")));
      })));
    }
    if (!Prims.equality(world.observer.getGlobal("colliding-particle-1"), Nobody)) {
      world.observer.getGlobal("colliding-particle-1").ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
    }
    if (!Prims.equality(world.observer.getGlobal("colliding-particle-1"), Nobody)) {
      world.observer.getGlobal("colliding-particle-1").ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
    }
    procedures["SORT-COLLISIONS"]();
    world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
      SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-length")));
    }, true);
    procedures["COLLIDE-WINNERS"]();
    world.ticker.tickAdvance(world.observer.getGlobal("tick-length"));
    if (world.observer.getGlobal("manage-view-updates?")) {
      if (Prims.gt((world.ticker.tickCount() - world.observer.getGlobal("last-view-update")), world.observer.getGlobal("view-update-rate"))) {
        notImplemented('display', undefined)();
        world.observer.setGlobal("last-view-update", world.ticker.tickCount());
      }
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function(headingAngle) {
    try {
      throw new Exception.ReportInterrupt(NLMath.sin(headingAngle));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  });
  procs["convertHeadingX"] = temp;
  procs["CONVERT-HEADING-X"] = temp;
  temp = (function(headingAngle) {
    try {
      throw new Exception.ReportInterrupt(NLMath.cos(headingAngle));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  });
  procs["convertHeadingY"] = temp;
  procs["CONVERT-HEADING-Y"] = temp;
  temp = (function() {
    var myX = SelfManager.self().getVariable("xcor");
    var myY = SelfManager.self().getVariable("ycor");
    var myParticleSize = SelfManager.self().getVariable("size");
    var myXSpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-X"](SelfManager.self().getVariable("heading")));
    var myYSpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-Y"](SelfManager.self().getVariable("heading")));
    SelfPrims.other(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() {
      var dpx = (SelfManager.self().getVariable("xcor") - myX);
      var dpy = (SelfManager.self().getVariable("ycor") - myY);
      var xSpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-X"](SelfManager.self().getVariable("heading")));
      var ySpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-Y"](SelfManager.self().getVariable("heading")));
      var dvx = (xSpeed - myXSpeed);
      var dvy = (ySpeed - myYSpeed);
      var sumR = (Prims.div(myParticleSize, 2) + Prims.div(SelfManager.self().projectionBy(function() { return SelfManager.self().getVariable("size"); }), 2));
      var pSquared = (((dpx * dpx) + (dpy * dpy)) - NLMath.pow(sumR, 2));
      var pv = (2 * ((dpx * dvx) + (dpy * dvy)));
      var vSquared = ((dvx * dvx) + (dvy * dvy));
      var d1 = (NLMath.pow(pv, 2) - ((4 * vSquared) * pSquared));
      var timeToCollision = -1;
      if (Prims.gte(d1, 0)) {
        timeToCollision = Prims.div(( -pv - NLMath.sqrt(d1)), (2 * vSquared));
      }
      if (Prims.gt(timeToCollision, 0)) {
        var collidingPair = ListPrims.list((timeToCollision + world.ticker.tickCount()), SelfManager.self(), SelfManager.myself());
        world.observer.setGlobal("colliding-particles", ListPrims.fput(collidingPair, world.observer.getGlobal("colliding-particles")));
      }
    }, true);
  });
  procs["checkForParticleCollision"] = temp;
  procs["CHECK-FOR-PARTICLE-COLLISION"] = temp;
  temp = (function() {
    var xSpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-X"](SelfManager.self().getVariable("heading")));
    var ySpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-Y"](SelfManager.self().getVariable("heading")));
    var xposPlane = (world.observer.getGlobal("box-edge") - 0.5);
    var xnegPlane = ( -world.observer.getGlobal("box-edge") + 0.5);
    var yposPlane = (world.observer.getGlobal("box-edge") - 0.5);
    var ynegPlane = ( -world.observer.getGlobal("box-edge") + 0.5);
    var contactPointXpos = (SelfManager.self().getVariable("xcor") + Prims.div(SelfManager.self().getVariable("size"), 2));
    var contactPointXneg = (SelfManager.self().getVariable("xcor") - Prims.div(SelfManager.self().getVariable("size"), 2));
    var contactPointYpos = (SelfManager.self().getVariable("ycor") + Prims.div(SelfManager.self().getVariable("size"), 2));
    var contactPointYneg = (SelfManager.self().getVariable("ycor") - Prims.div(SelfManager.self().getVariable("size"), 2));
    var dpxpos = (xposPlane - contactPointXpos);
    var dpxneg = (xnegPlane - contactPointXneg);
    var dpypos = (yposPlane - contactPointYpos);
    var dpyneg = (ynegPlane - contactPointYneg);
    var tPlaneXpos = 0;
    if (!Prims.equality(xSpeed, 0)) {
      tPlaneXpos = Prims.div(dpxpos, xSpeed);
    }
    else {
      tPlaneXpos = 0;
    }
    if (Prims.gt(tPlaneXpos, 0)) {
      procedures["ASSIGN-COLLIDING-WALL"](tPlaneXpos,"plane-xpos");
    }
    var tPlaneXneg = 0;
    if (!Prims.equality(xSpeed, 0)) {
      tPlaneXneg = Prims.div(dpxneg, xSpeed);
    }
    else {
      tPlaneXneg = 0;
    }
    if (Prims.gt(tPlaneXneg, 0)) {
      procedures["ASSIGN-COLLIDING-WALL"](tPlaneXneg,"plane-xneg");
    }
    var tPlaneYpos = 0;
    if (!Prims.equality(ySpeed, 0)) {
      tPlaneYpos = Prims.div(dpypos, ySpeed);
    }
    else {
      tPlaneYpos = 0;
    }
    if (Prims.gt(tPlaneYpos, 0)) {
      procedures["ASSIGN-COLLIDING-WALL"](tPlaneYpos,"plane-ypos");
    }
    var tPlaneYneg = 0;
    if (!Prims.equality(ySpeed, 0)) {
      tPlaneYneg = Prims.div(dpyneg, ySpeed);
    }
    else {
      tPlaneYneg = 0;
    }
    if (Prims.gt(tPlaneYneg, 0)) {
      procedures["ASSIGN-COLLIDING-WALL"](tPlaneYneg,"plane-yneg");
    }
  });
  procs["checkForWallCollision"] = temp;
  procs["CHECK-FOR-WALL-COLLISION"] = temp;
  temp = (function(timeToCollision, wall) {
    var collidingPair = ListPrims.list((timeToCollision + world.ticker.tickCount()), SelfManager.self(), wall);
    world.observer.setGlobal("colliding-particles", ListPrims.fput(collidingPair, world.observer.getGlobal("colliding-particles")));
  });
  procs["assignCollidingWall"] = temp;
  procs["ASSIGN-COLLIDING-WALL"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("colliding-particles", world.observer.getGlobal("colliding-particles").filter(Tasks.reporterTask(function() {
        var taskArguments = arguments;
        return (!Prims.equality(ListPrims.item(1, taskArguments[0]), world.observer.getGlobal("colliding-particle-1")) || !Prims.equality(ListPrims.item(2, taskArguments[0]), world.observer.getGlobal("colliding-particle-2")));
      })));
      world.observer.setGlobal("colliding-particle-1", Nobody);
      world.observer.setGlobal("colliding-particle-2", Nobody);
      world.observer.setGlobal("tick-length", world.observer.getGlobal("original-tick-length"));
      if (Prims.equality(world.observer.getGlobal("colliding-particles"), [])) {
        throw new Exception.StopInterrupt;
      }
      var winner = ListPrims.first(world.observer.getGlobal("colliding-particles"));
      Tasks.forEach(Tasks.commandTask(function() {
        var taskArguments = arguments;
        if (Prims.lt(ListPrims.first(taskArguments[0]), ListPrims.first(winner))) {
          winner = taskArguments[0];
        }
      }), world.observer.getGlobal("colliding-particles"));
      var dt = ListPrims.item(0, winner);
      if (Prims.gt(dt, 0)) {
        if (Prims.lte((dt - world.ticker.tickCount()), 1)) {
          world.observer.setGlobal("tick-length", (dt - world.ticker.tickCount()));
          world.observer.setGlobal("colliding-particle-1", ListPrims.item(1, winner));
          world.observer.setGlobal("colliding-particle-2", ListPrims.item(2, winner));
        }
        else {
          world.observer.setGlobal("tick-length", 1);
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
  procs["sortCollisions"] = temp;
  procs["SORT-COLLISIONS"] = temp;
  temp = (function() {
    try {
      if (Prims.equality(world.observer.getGlobal("colliding-particle-1"), Nobody)) {
        throw new Exception.StopInterrupt;
      }
      if ((Prims.equality(world.observer.getGlobal("colliding-particle-2"), "plane-xpos") || Prims.equality(world.observer.getGlobal("colliding-particle-2"), "plane-xneg"))) {
        world.observer.getGlobal("colliding-particle-1").ask(function() { SelfManager.self().setVariable("heading",  -SelfManager.self().getVariable("heading")); }, true);
        throw new Exception.StopInterrupt;
      }
      if ((Prims.equality(world.observer.getGlobal("colliding-particle-2"), "plane-ypos") || Prims.equality(world.observer.getGlobal("colliding-particle-2"), "plane-yneg"))) {
        world.observer.getGlobal("colliding-particle-1").ask(function() { SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading"))); }, true);
        throw new Exception.StopInterrupt;
      }
      world.observer.getGlobal("colliding-particle-1").ask(function() { procedures["COLLIDE-WITH"](world.observer.getGlobal("colliding-particle-2")); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["collideWinners"] = temp;
  procs["COLLIDE-WINNERS"] = temp;
  temp = (function(otherParticle) {
    var mass2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("mass"); });
    var speed2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("speed"); });
    var heading2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("heading"); });
    var theta = SelfManager.self().towards(otherParticle);
    var v1t = (SelfManager.self().getVariable("speed") * NLMath.cos((theta - SelfManager.self().getVariable("heading"))));
    var v1l = (SelfManager.self().getVariable("speed") * NLMath.sin((theta - SelfManager.self().getVariable("heading"))));
    var v2t = (speed2 * NLMath.cos((theta - heading2)));
    var v2l = (speed2 * NLMath.sin((theta - heading2)));
    var vcm = Prims.div(((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)), (SelfManager.self().getVariable("mass") + mass2));
    v1t = ((2 * vcm) - v1t);
    v2t = ((2 * vcm) - v2t);
    SelfManager.self().setVariable("speed", NLMath.sqrt(((v1t * v1t) + (v1l * v1l))));
    if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
      SelfManager.self().setVariable("heading", (theta - NLMath.atan(v1l, v1t)));
    }
    otherParticle.ask(function() { SelfManager.self().setVariable("speed", NLMath.sqrt(((v2t * v2t) + (v2l * v2l)))); }, true);
    if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
      otherParticle.ask(function() { SelfManager.self().setVariable("heading", (theta - NLMath.atan(v2l, v2t))); }, true);
    }
    procedures["RECOLOR"]();
    otherParticle.ask(function() { procedures["RECOLOR"](); }, true);
  });
  procs["collideWith"] = temp;
  procs["COLLIDE-WITH"] = temp;
  temp = (function() {
    if (Prims.equality(world.observer.getGlobal("color-scheme"), "red-green-blue")) {
      procedures["RECOLOR-BANDED"]();
    }
    if (Prims.equality(world.observer.getGlobal("color-scheme"), "blue shades")) {
      procedures["RECOLOR-SHADED"]();
    }
    if (Prims.equality(world.observer.getGlobal("color-scheme"), "one color")) {
      procedures["RECOLOR-NONE"]();
    }
  });
  procs["recolor"] = temp;
  procs["RECOLOR"] = temp;
  temp = (function() {
    var avgSpeed = 1;
    if (Prims.lt(SelfManager.self().getVariable("speed"), (0.5 * avgSpeed))) {
      SelfManager.self().setVariable("color", 105);
    }
    else {
      if (Prims.gt(SelfManager.self().getVariable("speed"), (1.5 * avgSpeed))) {
        SelfManager.self().setVariable("color", 15);
      }
      else {
        SelfManager.self().setVariable("color", 55);
      }
    }
  });
  procs["recolorBanded"] = temp;
  procs["RECOLOR-BANDED"] = temp;
  temp = (function() {
    var avgSpeed = 1;
    if (Prims.lt(SelfManager.self().getVariable("speed"), (3 * avgSpeed))) {
      SelfManager.self().setVariable("color", ((95 - 3.001) + Prims.div((8 * SelfManager.self().getVariable("speed")), (3 * avgSpeed))));
    }
    else {
      SelfManager.self().setVariable("color", (95 + 4.999));
    }
  });
  procs["recolorShaded"] = temp;
  procs["RECOLOR-SHADED"] = temp;
  temp = (function() { SelfManager.self().setVariable("color", (55 - 1)); });
  procs["recolorNone"] = temp;
  procs["RECOLOR-NONE"] = temp;
  temp = (function() {
    world.patches().agentFilter(function() {
      return ((Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge")) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge"))) || (Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge")) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge"))));
    }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
  });
  procs["makeBox"] = temp;
  procs["MAKE-BOX"] = temp;
  temp = (function() {
    world.turtleManager.createOrderedTurtles(world.observer.getGlobal("number"), "PARTICLES").ask(function() {
      SelfManager.self().setVariable("speed", 1);
      SelfManager.self().setVariable("size", (world.observer.getGlobal("smallest-particle-size") + Prims.randomFloat((world.observer.getGlobal("largest-particle-size") - world.observer.getGlobal("smallest-particle-size")))));
      SelfManager.self().setVariable("mass", (SelfManager.self().getVariable("size") * SelfManager.self().getVariable("size")));
      procedures["RECOLOR"]();
      SelfManager.self().setVariable("heading", Prims.randomFloat(360));
    }, true);
    procedures["ARRANGE"](world.turtleManager.turtlesOfBreed("PARTICLES"));
  });
  procs["makeParticles"] = temp;
  procs["MAKE-PARTICLES"] = temp;
  temp = (function(particleSet) {
    try {
      if (!particleSet.nonEmpty()) {
        throw new Exception.StopInterrupt;
      }
      particleSet.ask(function() { procedures["RANDOM-POSITION"](); }, true);
      procedures["ARRANGE"](particleSet.agentFilter(function() { return procedures["OVERLAPPING?"](); }));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["arrange"] = temp;
  procs["ARRANGE"] = temp;
  temp = (function() {
    try {
      throw new Exception.ReportInterrupt(SelfPrims.other(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("PARTICLES"), Prims.div((SelfManager.self().getVariable("size") + world.observer.getGlobal("largest-particle-size")), 2)).agentFilter(function() {
        return Prims.lt(SelfManager.self().distance(SelfManager.myself()), Prims.div((SelfManager.self().getVariable("size") + SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("size"); })), 2));
      })).nonEmpty());
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  });
  procs["overlapping_p"] = temp;
  procs["OVERLAPPING?"] = temp;
  temp = (function() {
    SelfManager.self().setXY((ListPrims.oneOf([1, -1]) * Prims.randomFloat(((world.observer.getGlobal("box-edge") - 0.5) - Prims.div(SelfManager.self().getVariable("size"), 2)))), (ListPrims.oneOf([1, -1]) * Prims.randomFloat(((world.observer.getGlobal("box-edge") - 0.5) - Prims.div(SelfManager.self().getVariable("size"), 2)))));
  });
  procs["randomPosition"] = temp;
  procs["RANDOM-POSITION"] = temp;
  temp = (function() {
    world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { SelfManager.self().right(180); }, true);
    procedures["REBUILD-COLLISION-LIST"]();
    procedures["COLLIDE-WINNERS"]();
  });
  procs["reverseTime"] = temp;
  procs["REVERSE-TIME"] = temp;
  temp = (function(n) {
    procedures["SETUP"]();
    world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { SelfManager.self().stamp(); }, true);
    while (Prims.lt(world.ticker.tickCount(), n)) {
      procedures["GO"]();
    }
    var oldClock = world.ticker.tickCount();
    procedures["REVERSE-TIME"]();
    while (Prims.lt(world.ticker.tickCount(), (2 * oldClock))) {
      procedures["GO"]();
    }
    world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { SelfManager.self().setVariable("color", 9.9); }, true);
  });
  procs["testTimeReversal"] = temp;
  procs["TEST-TIME-REVERSAL"] = temp;
  return procs;
})();
world.observer.setGlobal("number", 200);
world.observer.setGlobal("largest-particle-size", 4);
world.observer.setGlobal("color-scheme", "red-green-blue");
world.observer.setGlobal("smallest-particle-size", 1);
