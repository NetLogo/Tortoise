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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"clock":{"name":"clock","editableColorIndex":0,"rotate":true,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,128,143,143,158,158,173],"ycors":[31,75,75,150,150,75,75],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    input: function(str) { return 'dummy implementation'; },
    notify: function(str) {},
    yesOrNo: function(str) { return true; }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.exporting = {
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
  var name    = 'Energy Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15.0, 10.0, PenBundle.DisplayMode.Bar), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', 'fast')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setHistogramBarCount(40);
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', 'fast')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).projectionBy(function() { return SelfManager.self().getVariable("energy"); }));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55.0, 10.0, PenBundle.DisplayMode.Bar), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', 'medium')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setHistogramBarCount(40);
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', 'medium')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).projectionBy(function() { return SelfManager.self().getVariable("energy"); }));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105.0, 10.0, PenBundle.DisplayMode.Bar), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', 'slow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setHistogramBarCount(40);
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', 'slow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).projectionBy(function() { return SelfManager.self().getVariable("energy"); }));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('avg-energy', plotOps.makePenOps, false, new PenBundle.State(5.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', 'avg-energy')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.resetPen();
          let _maybestop_49_63 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("avg-energy"));
          if (_maybestop_49_63 instanceof Exception.StopInterrupt) { return _maybestop_49_63; }
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('init-avg-energy', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', 'init-avg-energy')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          let _maybestop_33_47 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("init-avg-energy"));
          if (_maybestop_33_47 instanceof Exception.StopInterrupt) { return _maybestop_33_47; }
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {})];
  var setup   = function() {};
  var update  = function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Energy Histogram', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setXRange(0, (((0.5 * (world.observer.getGlobal("init-particle-speed") * 2)) * (world.observer.getGlobal("init-particle-speed") * 2)) * world.observer.getGlobal("particle-mass")));
          plotManager.setYRange(0, NLMath.ceil(Prims.div(world.observer.getGlobal("number-of-particles"), 6)));
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
  return new Plot(name, pens, plotOps, "Energy", "Number", true, false, 0.0, 400.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Speed Counts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Counts', 'fast')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("percent-fast"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Counts', 'medium')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("percent-medium"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Counts', 'slow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("percent-slow"));
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
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Counts', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, 100);
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
  return new Plot(name, pens, plotOps, "time", "count (%)", true, true, 0.0, 20.0, 0.0, 100.0, setup, update);
})(), (function() {
  var name    = 'Speed Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15.0, 5.0, PenBundle.DisplayMode.Bar), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setHistogramBarCount(40);
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55.0, 5.0, PenBundle.DisplayMode.Bar), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setHistogramBarCount(40);
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105.0, 5.0, PenBundle.DisplayMode.Bar), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setHistogramBarCount(40);
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('avg-speed', plotOps.makePenOps, false, new PenBundle.State(5.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', 'avg-speed')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.resetPen();
          let _maybestop_50_64 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("avg-speed"));
          if (_maybestop_50_64 instanceof Exception.StopInterrupt) { return _maybestop_50_64; }
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('init-avg-speed', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', 'init-avg-speed')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          let _maybestop_33_47 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("init-avg-speed"));
          if (_maybestop_33_47 instanceof Exception.StopInterrupt) { return _maybestop_33_47; }
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {})];
  var setup   = function() {};
  var update  = function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Speed Histogram', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setXRange(0, (world.observer.getGlobal("init-particle-speed") * 2));
          plotManager.setYRange(0, NLMath.ceil(Prims.div(world.observer.getGlobal("number-of-particles"), 6)));
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
  return new Plot(name, pens, plotOps, "Speed", "Number", true, false, 0.0, 50.0, 0.0, 100.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PARTICLES", singular: "particle", varNames: ["speed", "mass", "energy", "last-collision"] }])([], [])('globals\n[\n  tick-delta                      ;; how much we advance the tick counter this time through\n  max-tick-delta                  ;; the largest tick-delta is allowed to be\n  init-avg-speed init-avg-energy  ;; initial averages\n  avg-speed avg-energy            ;; current averages\n  fast medium slow                ;; current counts\n  percent-fast percent-medium     ;; percentage of the counts\n  percent-slow                    ;; percentage of the counts\n\n]\n\nbreed [ particles particle ]\n\nparticles-own\n[\n  speed mass energy          ;; particle info\n  last-collision\n]\n\n\nto setup\n  clear-all\n  set-default-shape particles \"circle\"\n  set max-tick-delta 0.1073\n  make-particles\n  update-variables\n  set init-avg-speed avg-speed\n  set init-avg-energy avg-energy\n  reset-ticks\nend\n\nto go\n  ask particles [ move ]\n  ask particles\n  [ if collide? [check-for-collision] ]\n  ifelse (trace?)\n    [ ask particle 0 [ pen-down ] ]\n    [ ask particle 0 [ pen-up ] ]\n  tick-advance tick-delta\n  if floor ticks > floor (ticks - tick-delta)\n  [\n    update-variables\n    update-plots\n  ]\n  calculate-tick-delta\n\n  display\nend\n\nto update-variables\n  set medium count particles with [color = green]\n  set slow count particles with [color = blue]\n  set fast count particles with [color = red]\n  set percent-medium (medium / count particles) * 100\n  set percent-slow (slow / count particles) * 100\n  set percent-fast (fast / count particles) * 100\n  set avg-speed  mean [speed] of particles\n  set avg-energy  mean [energy] of particles\nend\n\n\n\nto calculate-tick-delta\n  ;; tick-delta is calculated in such way that even the fastest\n  ;; particle will jump at most 1 patch length in a tick. As\n  ;; particles jump (speed * tick-delta) at every tick, making\n  ;; tick length the inverse of the speed of the fastest particle\n  ;; (1/max speed) assures that. Having each particle advance at most\n  ;; one patch-length is necessary for them not to jump over each other\n  ;; without colliding.\n  ifelse any? particles with [speed > 0]\n    [ set tick-delta min list (1 / (ceiling max [speed] of particles)) max-tick-delta ]\n    [ set tick-delta max-tick-delta ]\nend\n\n\n\nto move  ;; particle procedure\n  if patch-ahead (speed * tick-delta) != patch-here\n    [ set last-collision nobody ]\n  jump (speed * tick-delta)\nend\n\nto check-for-collision  ;; particle procedure\n  ;; Here we impose a rule that collisions only take place when there\n  ;; are exactly two particles per patch.\n\n  if count other particles-here = 1\n  [\n    ;; the following conditions are imposed on collision candidates:\n    ;;   1. they must have a lower who number than my own, because collision\n    ;;      code is asymmetrical: it must always happen from the point of view\n    ;;      of just one particle.\n    ;;   2. they must not be the same particle that we last collided with on\n    ;;      this patch, so that we have a chance to leave the patch after we\'ve\n    ;;      collided with someone.\n    let candidate one-of other particles-here with\n      [who < [who] of myself and myself != last-collision]\n    ;; we also only collide if one of us has non-zero speed. It\'s useless\n    ;; (and incorrect, actually) for two particles with zero speed to collide.\n    if (candidate != nobody) and (speed > 0 or [speed] of candidate > 0)\n    [\n      collide-with candidate\n      set last-collision candidate\n      ask candidate [ set last-collision myself ]\n    ]\n  ]\nend\n\n;; implements a collision with another particle.\n;;\n;; THIS IS THE HEART OF THE PARTICLE SIMULATION, AND YOU ARE STRONGLY ADVISED\n;; NOT TO CHANGE IT UNLESS YOU REALLY UNDERSTAND WHAT YOU\'RE DOING!\n;;\n;; The two particles colliding are self and other-particle, and while the\n;; collision is performed from the point of view of self, both particles are\n;; modified to reflect its effects. This is somewhat complicated, so I\'ll\n;; give a general outline here:\n;;   1. Do initial setup, and determine the heading between particle centers\n;;      (call it theta).\n;;   2. Convert the representation of the velocity of each particle from\n;;      speed/heading to a theta-based vector whose first component is the\n;;      particle\'s speed along theta, and whose second component is the speed\n;;      perpendicular to theta.\n;;   3. Modify the velocity vectors to reflect the effects of the collision.\n;;      This involves:\n;;        a. computing the velocity of the center of mass of the whole system\n;;           along direction theta\n;;        b. updating the along-theta components of the two velocity vectors.\n;;   4. Convert from the theta-based vector representation of velocity back to\n;;      the usual speed/heading representation for each particle.\n;;   5. Perform final cleanup and update derived quantities.\nto collide-with [ other-particle ] ;; particle procedure\n  ;;; PHASE 1: initial setup\n\n  ;; for convenience, grab some quantities from other-particle\n  let mass2 [mass] of other-particle\n  let speed2 [speed] of other-particle\n  let heading2 [heading] of other-particle\n\n  ;; since particles are modeled as zero-size points, theta isn\'t meaningfully\n  ;; defined. we can assign it randomly without affecting the model\'s outcome.\n  let theta (random-float 360)\n\n\n\n  ;;; PHASE 2: convert velocities to theta-based vector representation\n\n  ;; now convert my velocity from speed/heading representation to components\n  ;; along theta and perpendicular to theta\n  let v1t (speed * cos (theta - heading))\n  let v1l (speed * sin (theta - heading))\n\n  ;; do the same for other-particle\n  let v2t (speed2 * cos (theta - heading2))\n  let v2l (speed2 * sin (theta - heading2))\n\n\n\n  ;;; PHASE 3: manipulate vectors to implement collision\n\n  ;; compute the velocity of the system\'s center of mass along theta\n  let vcm (((mass * v1t) + (mass2 * v2t)) / (mass + mass2) )\n\n  ;; now compute the new velocity for each particle along direction theta.\n  ;; velocity perpendicular to theta is unaffected by a collision along theta,\n  ;; so the next two lines actually implement the collision itself, in the\n  ;; sense that the effects of the collision are exactly the following changes\n  ;; in particle velocity.\n  set v1t (2 * vcm - v1t)\n  set v2t (2 * vcm - v2t)\n\n\n\n  ;;; PHASE 4: convert back to normal speed/heading\n\n  ;; now convert my velocity vector into my new speed and heading\n  set speed sqrt ((v1t ^ 2) + (v1l ^ 2))\n  set energy (0.5 * mass * (speed ^ 2))\n  ;; if the magnitude of the velocity vector is 0, atan is undefined. but\n  ;; speed will be 0, so heading is irrelevant anyway. therefore, in that\n  ;; case we\'ll just leave it unmodified.\n  if v1l != 0 or v1t != 0\n    [ set heading (theta - (atan v1l v1t)) ]\n\n  ;; and do the same for other-particle\n  ask other-particle [\n    set speed sqrt ((v2t ^ 2) + (v2l ^ 2))\n    set energy (0.5 * mass * (speed ^ 2))\n    if v2l != 0 or v2t != 0\n      [ set heading (theta - (atan v2l v2t)) ]\n  ]\n\n  ;; PHASE 5: final updates\n\n  ;; now recolor, since color is based on quantities that may have changed\n  recolor\n  ask other-particle\n    [ recolor ]\nend\n\nto recolor  ;; particle procedure\n  ifelse speed < (0.5 * 10)\n  [\n    set color blue\n  ]\n  [\n    ifelse speed > (1.5 * 10)\n      [ set color red ]\n      [ set color green ]\n  ]\nend\n\n;;;\n;;; drawing procedures\n;;;\n\n\n;; creates initial particles\nto make-particles\n  create-particles number-of-particles\n  [\n    setup-particle\n    random-position\n    recolor\n  ]\n  calculate-tick-delta\nend\n\n\nto setup-particle  ;; particle procedure\n  set speed init-particle-speed\n  set mass particle-mass\n  set energy (0.5 * mass * (speed ^ 2))\n  set last-collision nobody\nend\n\n\n;; place particle at random location inside the box.\nto random-position ;; particle procedure\n  setxy ((1 + min-pxcor) + random-float ((2 * max-pxcor) - 2))\n        ((1 + min-pycor) + random-float ((2 * max-pycor) - 2))\nend\n\nto-report last-n [n the-list]\n  ifelse n >= length the-list\n    [ report the-list ]\n    [ report last-n n butfirst the-list ]\nend\n\n;; histogram procedure\nto draw-vert-line [ xval ]\n  plotxy xval plot-y-min\n  plot-pen-down\n  plotxy xval plot-y-max\n  plot-pen-up\nend\n\n\n; Copyright 1997 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":316,"top":11,"right":648,"bottom":344,"dimensions":{"minPxcor":-40,"maxPxcor":40,"minPycor":-40,"maxPycor":40,"patchSize":4,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":8,"top":43,"right":94,"bottom":76,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":8,"top":10,"right":94,"bottom":43,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"1000","compiledStep":"1","variable":"number-of-particles","left":97,"top":11,"right":303,"bottom":44,"display":"number-of-particles","min":"1","max":"1000","default":100,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"avg-speed\")","source":"avg-speed","left":18,"top":254,"right":150,"bottom":299,"display":"average speed","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setXRange(0, (((0.5 * (world.observer.getGlobal(\"init-particle-speed\") * 2)) * (world.observer.getGlobal(\"init-particle-speed\") * 2)) * world.observer.getGlobal(\"particle-mass\")));\n        plotManager.setYRange(0, NLMath.ceil(Prims.div(world.observer.getGlobal(\"number-of-particles\"), 6)));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledPens":[{"compiledSetupCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', 'fast')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setHistogramBarCount(40);\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', 'fast')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 15); }).projectionBy(function() { return SelfManager.self().getVariable(\"energy\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"fast","interval":10,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ energy ] of particles with [color = red]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', 'medium')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setHistogramBarCount(40);\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', 'medium')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 55); }).projectionBy(function() { return SelfManager.self().getVariable(\"energy\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"medium","interval":10,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ energy ] of particles with [color = green]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', 'slow')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setHistogramBarCount(40);\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', 'slow')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 105); }).projectionBy(function() { return SelfManager.self().getVariable(\"energy\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"slow","interval":10,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ energy ] of particles with [color = blue]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', 'avg-energy')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.resetPen();\n        let _maybestop_49_63 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"avg-energy\"));\n        if (_maybestop_49_63 instanceof Exception.StopInterrupt) { return _maybestop_49_63; }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"avg-energy","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset  draw-vert-line avg-energy","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Energy Histogram', 'init-avg-energy')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        let _maybestop_33_47 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"init-avg-energy\"));\n        if (_maybestop_33_47 instanceof Exception.StopInterrupt) { return _maybestop_33_47; }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {}","display":"init-avg-energy","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"draw-vert-line init-avg-energy","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Energy Histogram","left":614,"top":386,"right":904,"bottom":582,"xAxis":"Energy","yAxis":"Number","xmin":0,"xmax":400,"ymin":0,"ymax":10,"autoPlotOn":false,"legendOn":true,"setupCode":"","updateCode":"set-plot-x-range 0 (0.5 * (init-particle-speed * 2) * (init-particle-speed * 2) * particle-mass)\nset-plot-y-range 0 ceiling (number-of-particles / 6)","pens":[{"display":"fast","interval":10,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ energy ] of particles with [color = red]","type":"pen"},{"display":"medium","interval":10,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ energy ] of particles with [color = green]","type":"pen"},{"display":"slow","interval":10,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ energy ] of particles with [color = blue]","type":"pen"},{"display":"avg-energy","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset  draw-vert-line avg-energy","type":"pen"},{"display":"init-avg-energy","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"draw-vert-line init-avg-energy","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"avg-energy\")","source":"avg-energy","left":173,"top":254,"right":305,"bottom":299,"display":"average energy","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Counts', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setYRange(0, 100);\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Counts', 'fast')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-fast\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"fast","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-fast","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Counts', 'medium')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-medium\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"medium","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-medium","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Counts', 'slow')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-slow\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"slow","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-slow","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed Counts","left":15,"top":385,"right":304,"bottom":582,"xAxis":"time","yAxis":"count (%)","xmin":0,"xmax":20,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"set-plot-y-range 0 100","pens":[{"display":"fast","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-fast","type":"pen"},{"display":"medium","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-medium","type":"pen"},{"display":"slow","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-slow","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"variable":"collide?","left":97,"top":44,"right":200,"bottom":77,"display":"collide?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setXRange(0, (world.observer.getGlobal(\"init-particle-speed\") * 2));\n        plotManager.setYRange(0, NLMath.ceil(Prims.div(world.observer.getGlobal(\"number-of-particles\"), 6)));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledPens":[{"compiledSetupCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setHistogramBarCount(40);\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 15); }).projectionBy(function() { return SelfManager.self().getVariable(\"speed\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"fast","interval":5,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ speed ] of particles with [color = red]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setHistogramBarCount(40);\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 55); }).projectionBy(function() { return SelfManager.self().getVariable(\"speed\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"medium","interval":5,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ speed ] of particles with [color = green]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setHistogramBarCount(40);\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 105); }).projectionBy(function() { return SelfManager.self().getVariable(\"speed\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"slow","interval":5,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ speed ] of particles with [color = blue]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', 'avg-speed')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.resetPen();\n        let _maybestop_50_64 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"avg-speed\"));\n        if (_maybestop_50_64 instanceof Exception.StopInterrupt) { return _maybestop_50_64; }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"avg-speed","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-speed","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Speed Histogram', 'init-avg-speed')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        let _maybestop_33_47 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"init-avg-speed\"));\n        if (_maybestop_33_47 instanceof Exception.StopInterrupt) { return _maybestop_33_47; }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {}","display":"init-avg-speed","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"draw-vert-line init-avg-speed","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed Histogram","left":312,"top":385,"right":606,"bottom":582,"xAxis":"Speed","yAxis":"Number","xmin":0,"xmax":50,"ymin":0,"ymax":100,"autoPlotOn":false,"legendOn":true,"setupCode":"","updateCode":"set-plot-x-range 0 (init-particle-speed * 2)\nset-plot-y-range 0 ceiling (number-of-particles / 6)","pens":[{"display":"fast","interval":5,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ speed ] of particles with [color = red]","type":"pen"},{"display":"medium","interval":5,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ speed ] of particles with [color = green]","type":"pen"},{"display":"slow","interval":5,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"set-histogram-num-bars 40","updateCode":"histogram [ speed ] of particles with [color = blue]","type":"pen"},{"display":"avg-speed","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-speed","type":"pen"},{"display":"init-avg-speed","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"draw-vert-line init-avg-speed","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-fast\")","source":"percent-fast","left":17,"top":312,"right":104,"bottom":357,"display":"percent fast","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-medium\")","source":"percent-medium","left":108,"top":312,"right":205,"bottom":357,"display":"percent medium","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-slow\")","source":"percent-slow","left":208,"top":312,"right":306,"bottom":357,"display":"percent slow","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"trace?","left":200,"top":44,"right":303,"bottom":77,"display":"trace?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"20","compiledStep":"1","variable":"init-particle-speed","left":8,"top":88,"right":194,"bottom":121,"display":"init-particle-speed","min":"1","max":"20","default":10,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"20","compiledStep":"1","variable":"particle-mass","left":8,"top":128,"right":194,"bottom":161,"display":"particle-mass","min":"1","max":"20","default":1,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  world.clearDrawing();\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"clear-drawing","left":200,"top":77,"right":303,"bottom":110,"display":"clear trace","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["number-of-particles", "collide?", "trace?", "init-particle-speed", "particle-mass", "tick-delta", "max-tick-delta", "init-avg-speed", "init-avg-energy", "avg-speed", "avg-energy", "fast", "medium", "slow", "percent-fast", "percent-medium", "percent-slow"], ["number-of-particles", "collide?", "trace?", "init-particle-speed", "particle-mass"], [], -40, 40, -40, 40, 4.0, true, true, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
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
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PARTICLES").getSpecialName(), "circle")
      world.observer.setGlobal("max-tick-delta", 0.1073);
      procedures["MAKE-PARTICLES"]();
      procedures["UPDATE-VARIABLES"]();
      world.observer.setGlobal("init-avg-speed", world.observer.getGlobal("avg-speed"));
      world.observer.setGlobal("init-avg-energy", world.observer.getGlobal("avg-energy"));
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
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { procedures["MOVE"](); }, true);
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
        if (world.observer.getGlobal("collide?")) {
          procedures["CHECK-FOR-COLLISION"]();
        }
      }, true);
      if (world.observer.getGlobal("trace?")) {
        world.turtleManager.getTurtleOfBreed("PARTICLES", 0).ask(function() { SelfManager.self().penManager.lowerPen(); }, true);
      }
      else {
        world.turtleManager.getTurtleOfBreed("PARTICLES", 0).ask(function() { SelfManager.self().penManager.raisePen(); }, true);
      }
      world.ticker.tickAdvance(world.observer.getGlobal("tick-delta"));
      if (Prims.gt(NLMath.floor(world.ticker.tickCount()), NLMath.floor((world.ticker.tickCount() - world.observer.getGlobal("tick-delta"))))) {
        procedures["UPDATE-VARIABLES"]();
        plotManager.updatePlots();
      }
      procedures["CALCULATE-TICK-DELTA"]();
      notImplemented('display', undefined)();
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
      world.observer.setGlobal("medium", world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).size());
      world.observer.setGlobal("slow", world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).size());
      world.observer.setGlobal("fast", world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).size());
      world.observer.setGlobal("percent-medium", (Prims.div(world.observer.getGlobal("medium"), world.turtleManager.turtlesOfBreed("PARTICLES").size()) * 100));
      world.observer.setGlobal("percent-slow", (Prims.div(world.observer.getGlobal("slow"), world.turtleManager.turtlesOfBreed("PARTICLES").size()) * 100));
      world.observer.setGlobal("percent-fast", (Prims.div(world.observer.getGlobal("fast"), world.turtleManager.turtlesOfBreed("PARTICLES").size()) * 100));
      world.observer.setGlobal("avg-speed", ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })));
      world.observer.setGlobal("avg-energy", ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("energy"); })));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateVariables"] = temp;
  procs["UPDATE-VARIABLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("speed"), 0); }).isEmpty()) {
        world.observer.setGlobal("tick-delta", ListPrims.min(ListPrims.list(Prims.div(1, NLMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })))), world.observer.getGlobal("max-tick-delta"))));
      }
      else {
        world.observer.setGlobal("tick-delta", world.observer.getGlobal("max-tick-delta"));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["calculateTickDelta"] = temp;
  procs["CALCULATE-TICK-DELTA"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!Prims.equality(SelfManager.self().patchAhead((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-delta"))), SelfManager.self().getPatchHere())) {
        SelfManager.self().setVariable("last-collision", Nobody);
      }
      SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-delta")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["move"] = temp;
  procs["MOVE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(SelfPrims._optimalCountOther(SelfManager.self().breedHere("PARTICLES")), 1)) {
        let candidate = ListPrims.oneOf(SelfManager.self().breedHere("PARTICLES")._optimalOtherWith(function() {
          return (Prims.lt(SelfManager.self().getVariable("who"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("who"); })) && !Prims.equality(SelfManager.myself(), SelfManager.self().getVariable("last-collision")));
        })); letVars['candidate'] = candidate;
        if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfManager.self().getVariable("speed"), 0) || Prims.gt(candidate.projectionBy(function() { return SelfManager.self().getVariable("speed"); }), 0)))) {
          procedures["COLLIDE-WITH"](candidate);
          SelfManager.self().setVariable("last-collision", candidate);
          candidate.ask(function() { SelfManager.self().setVariable("last-collision", SelfManager.myself()); }, true);
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
  procs["checkForCollision"] = temp;
  procs["CHECK-FOR-COLLISION"] = temp;
  temp = (function(otherParticle) {
    try {
      var reporterContext = false;
      var letVars = { };
      let mass2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("mass"); }); letVars['mass2'] = mass2;
      let speed2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("speed"); }); letVars['speed2'] = speed2;
      let heading2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("heading"); }); letVars['heading2'] = heading2;
      let theta = Prims.randomFloat(360); letVars['theta'] = theta;
      let v1t = (SelfManager.self().getVariable("speed") * NLMath.cos((theta - SelfManager.self().getVariable("heading")))); letVars['v1t'] = v1t;
      let v1l = (SelfManager.self().getVariable("speed") * NLMath.sin((theta - SelfManager.self().getVariable("heading")))); letVars['v1l'] = v1l;
      let v2t = (speed2 * NLMath.cos((theta - heading2))); letVars['v2t'] = v2t;
      let v2l = (speed2 * NLMath.sin((theta - heading2))); letVars['v2l'] = v2l;
      let vcm = Prims.div(((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)), (SelfManager.self().getVariable("mass") + mass2)); letVars['vcm'] = vcm;
      v1t = ((2 * vcm) - v1t); letVars['v1t'] = v1t;
      v2t = ((2 * vcm) - v2t); letVars['v2t'] = v2t;
      SelfManager.self().setVariable("speed", NLMath.sqrt((NLMath.pow(v1t, 2) + NLMath.pow(v1l, 2))));
      SelfManager.self().setVariable("energy", ((0.5 * SelfManager.self().getVariable("mass")) * NLMath.pow(SelfManager.self().getVariable("speed"), 2)));
      if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
        SelfManager.self().setVariable("heading", (theta - NLMath.atan(v1l, v1t)));
      }
      otherParticle.ask(function() {
        SelfManager.self().setVariable("speed", NLMath.sqrt((NLMath.pow(v2t, 2) + NLMath.pow(v2l, 2))));
        SelfManager.self().setVariable("energy", ((0.5 * SelfManager.self().getVariable("mass")) * NLMath.pow(SelfManager.self().getVariable("speed"), 2)));
        if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
          SelfManager.self().setVariable("heading", (theta - NLMath.atan(v2l, v2t)));
        }
      }, true);
      procedures["RECOLOR"]();
      otherParticle.ask(function() { procedures["RECOLOR"](); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["collideWith"] = temp;
  procs["COLLIDE-WITH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(SelfManager.self().getVariable("speed"), (0.5 * 10))) {
        SelfManager.self().setVariable("color", 105);
      }
      else {
        if (Prims.gt(SelfManager.self().getVariable("speed"), (1.5 * 10))) {
          SelfManager.self().setVariable("color", 15);
        }
        else {
          SelfManager.self().setVariable("color", 55);
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
  procs["recolor"] = temp;
  procs["RECOLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(world.observer.getGlobal("number-of-particles"), "PARTICLES").ask(function() {
        procedures["SETUP-PARTICLE"]();
        procedures["RANDOM-POSITION"]();
        procedures["RECOLOR"]();
      }, true);
      procedures["CALCULATE-TICK-DELTA"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeParticles"] = temp;
  procs["MAKE-PARTICLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("speed", world.observer.getGlobal("init-particle-speed"));
      SelfManager.self().setVariable("mass", world.observer.getGlobal("particle-mass"));
      SelfManager.self().setVariable("energy", ((0.5 * SelfManager.self().getVariable("mass")) * NLMath.pow(SelfManager.self().getVariable("speed"), 2)));
      SelfManager.self().setVariable("last-collision", Nobody);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupParticle"] = temp;
  procs["SETUP-PARTICLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setXY(((1 + world.topology.minPxcor) + Prims.randomFloat(((2 * world.topology.maxPxcor) - 2))), ((1 + world.topology.minPycor) + Prims.randomFloat(((2 * world.topology.maxPycor) - 2))));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["randomPosition"] = temp;
  procs["RANDOM-POSITION"] = temp;
  temp = (function(n, theList) {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.gte(n, ListPrims.length(theList))) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return theList
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return procedures["LAST-N"](n,ListPrims.butFirst(theList))
        }
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
  procs["lastN"] = temp;
  procs["LAST-N"] = temp;
  temp = (function(xval) {
    try {
      var reporterContext = false;
      var letVars = { };
      plotManager.plotPoint(xval, plotManager.getPlotYMin());
      plotManager.lowerPen();
      plotManager.plotPoint(xval, plotManager.getPlotYMax());
      plotManager.raisePen();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["drawVertLine"] = temp;
  procs["DRAW-VERT-LINE"] = temp;
  return procs;
})();
world.observer.setGlobal("number-of-particles", 100);
world.observer.setGlobal("collide?", true);
world.observer.setGlobal("trace?", true);
world.observer.setGlobal("init-particle-speed", 10);
world.observer.setGlobal("particle-mass", 1);
