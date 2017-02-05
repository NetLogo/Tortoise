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
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0.0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0.0,1.0]},{"x-offset":0.0,"is-visible":true,"dash-pattern":[1.0,0.0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0.0,1.0]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"ycors":[15,21,39,60,74,87,97,115,141,165,225,285,285,285,15,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":30,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[80,78,135,135,105,96,89],"ycors":[138,168,166,91,106,111,120],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":47,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
  var name    = 'Average Wait Time of Cars';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Average Wait Time of Cars', 'default')(function() {
        plotManager.plotValue(ListPrims.mean(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("wait-time"); })));;
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Average Wait", false, true, 0.0, 100.0, 0.0, 5.0, setup, update);
})(), (function() {
  var name    = 'Average Speed of Cars';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Average Speed of Cars', 'default')(function() {
        plotManager.plotValue(ListPrims.mean(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("speed"); })));;
      });
    });
  })];
  var setup   = function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Average Speed of Cars', undefined)(function() { plotManager.setYRange(0, world.observer.getGlobal("speed-limit"));; });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Average Speed", false, true, 0.0, 100.0, 0.0, 1.0, setup, update);
})(), (function() {
  var name    = 'Stopped Cars';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Stopped Cars', 'default')(function() { plotManager.plotValue(world.observer.getGlobal("num-cars-stopped"));; });
    });
  })];
  var setup   = function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Stopped Cars', undefined)(function() { plotManager.setYRange(0, world.observer.getGlobal("num-cars"));; });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Stopped Cars", false, true, 0.0, 100.0, 0.0, 100.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["speed", "up-car?", "wait-time"], [])(["grid-size-y", "grid-size-x", "power?", "num-cars", "speed-limit", "ticks-per-cycle", "current-phase", "current-auto?", "grid-x-inc", "grid-y-inc", "acceleration", "phase", "num-cars-stopped", "current-light", "intersections", "roads"], ["grid-size-y", "grid-size-x", "power?", "num-cars", "speed-limit", "ticks-per-cycle", "current-phase", "current-auto?"], ["intersection?", "green-light-up?", "my-row", "my-column", "my-phase", "auto?"], -18, 18, -18, 18, 9.0, true, true, turtleShapes, linkShapes, function(){});
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
      procedures["SETUP-GLOBALS"]();
      procedures["SETUP-PATCHES"]();
      procedures["MAKE-CURRENT"](ListPrims.oneOf(world.observer.getGlobal("intersections")));
      procedures["LABEL-CURRENT"]();
      BreedManager.setDefaultShape(world.turtles().getSpecialName(), "car")
      if (Prims.gt(world.observer.getGlobal("num-cars"), world.observer.getGlobal("roads").size())) {
        UserDialogPrims.confirm((Dump('') + Dump("There are too many cars for the amount of ") + Dump("road.  Either increase the amount of roads ") + Dump("by increasing the GRID-SIZE-X or ") + Dump("GRID-SIZE-Y sliders, or decrease the ") + Dump("number of cars by lowering the NUMBER slider.\n") + Dump("The setup has stopped.")));
        throw new Exception.StopInterrupt;
      }
      world.turtleManager.createTurtles(world.observer.getGlobal("num-cars"), "").ask(function() {
        procedures["SETUP-CARS"]();
        procedures["SET-CAR-COLOR"]();
        procedures["RECORD-DATA"]();
      }, true);
      world.turtles().ask(function() { procedures["SET-CAR-SPEED"](); }, true);
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
    world.observer.setGlobal("current-light", Nobody);
    world.observer.setGlobal("phase", 0);
    world.observer.setGlobal("num-cars-stopped", 0);
    world.observer.setGlobal("grid-x-inc", Prims.div(world.topology.width, world.observer.getGlobal("grid-size-x")));
    world.observer.setGlobal("grid-y-inc", Prims.div(world.topology.height, world.observer.getGlobal("grid-size-y")));
    world.observer.setGlobal("acceleration", 0.099);
  });
  procs["setupGlobals"] = temp;
  procs["SETUP-GLOBALS"] = temp;
  temp = (function() {
    world.patches().ask(function() {
      SelfManager.self().setPatchVariable("intersection?", false);
      SelfManager.self().setPatchVariable("auto?", false);
      SelfManager.self().setPatchVariable("green-light-up?", true);
      SelfManager.self().setPatchVariable("my-row", -1);
      SelfManager.self().setPatchVariable("my-column", -1);
      SelfManager.self().setPatchVariable("my-phase", -1);
      SelfManager.self().setPatchVariable("pcolor", (35 + 3));
    }, true);
    world.observer.setGlobal("roads", world.patches().agentFilter(function() {
      return (Prims.equality(NLMath.floor(NLMath.mod(((SelfManager.self().getPatchVariable("pxcor") + world.topology.maxPxcor) - NLMath.floor((world.observer.getGlobal("grid-x-inc") - 1))), world.observer.getGlobal("grid-x-inc"))), 0) || Prims.equality(NLMath.floor(NLMath.mod((SelfManager.self().getPatchVariable("pycor") + world.topology.maxPycor), world.observer.getGlobal("grid-y-inc"))), 0));
    }));
    world.observer.setGlobal("intersections", world.observer.getGlobal("roads").agentFilter(function() {
      return (Prims.equality(NLMath.floor(NLMath.mod(((SelfManager.self().getPatchVariable("pxcor") + world.topology.maxPxcor) - NLMath.floor((world.observer.getGlobal("grid-x-inc") - 1))), world.observer.getGlobal("grid-x-inc"))), 0) && Prims.equality(NLMath.floor(NLMath.mod((SelfManager.self().getPatchVariable("pycor") + world.topology.maxPycor), world.observer.getGlobal("grid-y-inc"))), 0));
    }));
    world.observer.getGlobal("roads").ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    procedures["SETUP-INTERSECTIONS"]();
  });
  procs["setupPatches"] = temp;
  procs["SETUP-PATCHES"] = temp;
  temp = (function() {
    world.observer.getGlobal("intersections").ask(function() {
      SelfManager.self().setPatchVariable("intersection?", true);
      SelfManager.self().setPatchVariable("green-light-up?", true);
      SelfManager.self().setPatchVariable("my-phase", 0);
      SelfManager.self().setPatchVariable("auto?", true);
      SelfManager.self().setPatchVariable("my-row", NLMath.floor(Prims.div((SelfManager.self().getPatchVariable("pycor") + world.topology.maxPycor), world.observer.getGlobal("grid-y-inc"))));
      SelfManager.self().setPatchVariable("my-column", NLMath.floor(Prims.div((SelfManager.self().getPatchVariable("pxcor") + world.topology.maxPxcor), world.observer.getGlobal("grid-x-inc"))));
      procedures["SET-SIGNAL-COLORS"]();
    }, true);
  });
  procs["setupIntersections"] = temp;
  procs["SETUP-INTERSECTIONS"] = temp;
  temp = (function() {
    SelfManager.self().setVariable("speed", 0);
    SelfManager.self().setVariable("wait-time", 0);
    procedures["PUT-ON-EMPTY-ROAD"]();
    if (SelfManager.self().getPatchVariable("intersection?")) {
      if (Prims.equality(Prims.random(2), 0)) {
        SelfManager.self().setVariable("up-car?", true);
      }
      else {
        SelfManager.self().setVariable("up-car?", false);
      }
    }
    else {
      if (Prims.equality(NLMath.floor(NLMath.mod(((SelfManager.self().getPatchVariable("pxcor") + world.topology.maxPxcor) - NLMath.floor((world.observer.getGlobal("grid-x-inc") - 1))), world.observer.getGlobal("grid-x-inc"))), 0)) {
        SelfManager.self().setVariable("up-car?", true);
      }
      else {
        SelfManager.self().setVariable("up-car?", false);
      }
    }
    if (SelfManager.self().getVariable("up-car?")) {
      SelfManager.self().setVariable("heading", 180);
    }
    else {
      SelfManager.self().setVariable("heading", 90);
    }
  });
  procs["setupCars"] = temp;
  procs["SETUP-CARS"] = temp;
  temp = (function() {
    SelfManager.self().moveTo(ListPrims.oneOf(world.observer.getGlobal("roads").agentFilter(function() { return !!Prims.turtlesOn(SelfManager.self()).isEmpty(); })));
  });
  procs["putOnEmptyRoad"] = temp;
  procs["PUT-ON-EMPTY-ROAD"] = temp;
  temp = (function() {
    procedures["UPDATE-CURRENT"]();
    procedures["SET-SIGNALS"]();
    world.observer.setGlobal("num-cars-stopped", 0);
    world.turtles().ask(function() {
      procedures["SET-CAR-SPEED"]();
      SelfManager.self().fd(SelfManager.self().getVariable("speed"));
      procedures["RECORD-DATA"]();
      procedures["SET-CAR-COLOR"]();
    }, true);
    procedures["NEXT-PHASE"]();
    world.ticker.tick();
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    try {
      if (MousePrims.isDown()) {
        var xMouse = MousePrims.getX();
        var yMouse = MousePrims.getY();
        if (world.getPatchAt(xMouse, yMouse).projectionBy(function() { return SelfManager.self().getPatchVariable("intersection?"); })) {
          procedures["UPDATE-CURRENT"]();
          procedures["UNLABEL-CURRENT"]();
          procedures["MAKE-CURRENT"](world.getPatchAt(xMouse, yMouse));
          procedures["LABEL-CURRENT"]();
          throw new Exception.StopInterrupt;
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
  procs["chooseCurrent"] = temp;
  procs["CHOOSE-CURRENT"] = temp;
  temp = (function(light) {
    world.observer.setGlobal("current-light", light);
    world.observer.setGlobal("current-phase", world.observer.getGlobal("current-light").projectionBy(function() { return SelfManager.self().getPatchVariable("my-phase"); }));
    world.observer.setGlobal("current-auto?", world.observer.getGlobal("current-light").projectionBy(function() { return SelfManager.self().getPatchVariable("auto?"); }));
  });
  procs["makeCurrent"] = temp;
  procs["MAKE-CURRENT"] = temp;
  temp = (function() {
    world.observer.getGlobal("current-light").ask(function() {
      SelfManager.self().setPatchVariable("my-phase", world.observer.getGlobal("current-phase"));
      SelfManager.self().setPatchVariable("auto?", world.observer.getGlobal("current-auto?"));
    }, true);
  });
  procs["updateCurrent"] = temp;
  procs["UPDATE-CURRENT"] = temp;
  temp = (function() {
    world.observer.getGlobal("current-light").ask(function() {
      SelfManager.self().patchAt(-1, 1).ask(function() {
        SelfManager.self().setPatchVariable("plabel-color", 0);
        SelfManager.self().setPatchVariable("plabel", "current");
      }, true);
    }, true);
  });
  procs["labelCurrent"] = temp;
  procs["LABEL-CURRENT"] = temp;
  temp = (function() {
    world.observer.getGlobal("current-light").ask(function() {
      SelfManager.self().patchAt(-1, 1).ask(function() { SelfManager.self().setPatchVariable("plabel", ""); }, true);
    }, true);
  });
  procs["unlabelCurrent"] = temp;
  procs["UNLABEL-CURRENT"] = temp;
  temp = (function() {
    world.observer.getGlobal("intersections").agentFilter(function() {
      return (SelfManager.self().getPatchVariable("auto?") && Prims.equality(world.observer.getGlobal("phase"), NLMath.floor(Prims.div((SelfManager.self().getPatchVariable("my-phase") * world.observer.getGlobal("ticks-per-cycle")), 100))));
    }).ask(function() {
      SelfManager.self().setPatchVariable("green-light-up?", !SelfManager.self().getPatchVariable("green-light-up?"));
      procedures["SET-SIGNAL-COLORS"]();
    }, true);
  });
  procs["setSignals"] = temp;
  procs["SET-SIGNALS"] = temp;
  temp = (function() {
    if (world.observer.getGlobal("power?")) {
      if (SelfManager.self().getPatchVariable("green-light-up?")) {
        SelfManager.self().patchAt(-1, 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 15); }, true);
        SelfManager.self().patchAt(0, 1).ask(function() { SelfManager.self().setPatchVariable("pcolor", 55); }, true);
      }
      else {
        SelfManager.self().patchAt(-1, 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 55); }, true);
        SelfManager.self().patchAt(0, 1).ask(function() { SelfManager.self().setPatchVariable("pcolor", 15); }, true);
      }
    }
    else {
      SelfManager.self().patchAt(-1, 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
      SelfManager.self().patchAt(0, 1).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    }
  });
  procs["setSignalColors"] = temp;
  procs["SET-SIGNAL-COLORS"] = temp;
  temp = (function() {
    if (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 15)) {
      SelfManager.self().setVariable("speed", 0);
    }
    else {
      if (SelfManager.self().getVariable("up-car?")) {
        procedures["SET-SPEED"](0,-1);
      }
      else {
        procedures["SET-SPEED"](1,0);
      }
    }
  });
  procs["setCarSpeed"] = temp;
  procs["SET-CAR-SPEED"] = temp;
  temp = (function(deltaX, deltaY) {
    var turtlesAhead = SelfManager.self().turtlesAt(deltaX, deltaY);
    if (!turtlesAhead.isEmpty()) {
      if (!turtlesAhead.agentFilter(function() {
        return !Prims.equality(SelfManager.self().getVariable("up-car?"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("up-car?"); }));
      }).isEmpty()) {
        SelfManager.self().setVariable("speed", 0);
      }
      else {
        SelfManager.self().setVariable("speed", ListPrims.oneOf(turtlesAhead).projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
        procedures["SLOW-DOWN"]();
      }
    }
    else {
      procedures["SPEED-UP"]();
    }
  });
  procs["setSpeed"] = temp;
  procs["SET-SPEED"] = temp;
  temp = (function() {
    if (Prims.lte(SelfManager.self().getVariable("speed"), 0)) {
      SelfManager.self().setVariable("speed", 0);
    }
    else {
      SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") - world.observer.getGlobal("acceleration")));
    }
  });
  procs["slowDown"] = temp;
  procs["SLOW-DOWN"] = temp;
  temp = (function() {
    if (Prims.gt(SelfManager.self().getVariable("speed"), world.observer.getGlobal("speed-limit"))) {
      SelfManager.self().setVariable("speed", world.observer.getGlobal("speed-limit"));
    }
    else {
      SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") + world.observer.getGlobal("acceleration")));
    }
  });
  procs["speedUp"] = temp;
  procs["SPEED-UP"] = temp;
  temp = (function() {
    if (Prims.lt(SelfManager.self().getVariable("speed"), Prims.div(world.observer.getGlobal("speed-limit"), 2))) {
      SelfManager.self().setVariable("color", 105);
    }
    else {
      SelfManager.self().setVariable("color", (85 - 2));
    }
  });
  procs["setCarColor"] = temp;
  procs["SET-CAR-COLOR"] = temp;
  temp = (function() {
    if (Prims.equality(SelfManager.self().getVariable("speed"), 0)) {
      world.observer.setGlobal("num-cars-stopped", (world.observer.getGlobal("num-cars-stopped") + 1));
      SelfManager.self().setVariable("wait-time", (SelfManager.self().getVariable("wait-time") + 1));
    }
    else {
      SelfManager.self().setVariable("wait-time", 0);
    }
  });
  procs["recordData"] = temp;
  procs["RECORD-DATA"] = temp;
  temp = (function() {
    world.observer.getGlobal("current-light").ask(function() {
      SelfManager.self().setPatchVariable("green-light-up?", !SelfManager.self().getPatchVariable("green-light-up?"));
      procedures["SET-SIGNAL-COLORS"]();
    }, true);
  });
  procs["changeCurrent"] = temp;
  procs["CHANGE-CURRENT"] = temp;
  temp = (function() {
    world.observer.setGlobal("phase", (world.observer.getGlobal("phase") + 1));
    if (Prims.equality(NLMath.mod(world.observer.getGlobal("phase"), world.observer.getGlobal("ticks-per-cycle")), 0)) {
      world.observer.setGlobal("phase", 0);
    }
  });
  procs["nextPhase"] = temp;
  procs["NEXT-PHASE"] = temp;
  return procs;
})();
world.observer.setGlobal("grid-size-y", 5);
world.observer.setGlobal("grid-size-x", 5);
world.observer.setGlobal("power?", true);
world.observer.setGlobal("num-cars", 200);
world.observer.setGlobal("speed-limit", 1);
world.observer.setGlobal("ticks-per-cycle", 20);
world.observer.setGlobal("current-phase", 0);
world.observer.setGlobal("current-auto?", true);
