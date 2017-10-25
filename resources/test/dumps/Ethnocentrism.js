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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
  var name    = 'Strategy Counts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('CC', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Strategy Counts', 'CC')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("shape"), "circle"); }).size());
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
  new PenBundle.Pen('CD', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Strategy Counts', 'CD')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("shape"), "circle 2"); }).size());
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
  new PenBundle.Pen('DC', plotOps.makePenOps, false, new PenBundle.State(44.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Strategy Counts', 'DC')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("shape"), "square"); }).size());
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
  new PenBundle.Pen('DD', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Strategy Counts', 'DD')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("shape"), "square 2"); }).size());
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
  return new Plot(name, pens, plotOps, "time", "count", true, true, 0.0, 10.0, 0.0, 1.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["ptr", "cooperate-with-same?", "cooperate-with-different?"], [])(';; agents have a probablity to reproduce and a strategy\nturtles-own [ ptr cooperate-with-same? cooperate-with-different? ]\n\nglobals [\n  ;; the remaining variables support the replication of published experiments\n  meet                  ;; how many interactions occurred this turn\n  meet-agg              ;; how many interactions occurred through the run\n  last100meet           ;; meet for the last 100 ticks\n  meetown               ;; what number of individuals met someone of their own color this turn\n  meetown-agg           ;; what number of individuals met someone of their own color throughout the run\n  last100meetown        ;; meetown for the last 100 ticks\n  meetother             ;; what number of individuals met someone of a different color this turn\n  meetother-agg         ;; what number of individuals met someone of a different color throughout the run\n  last100meetother      ;; meetother for the last 100 ticks\n  coopown               ;; how many interactions this turn were cooperating with the same color\n  coopown-agg           ;; how many interactions throughout the run were cooperating with the same color\n  last100coopown        ;; coopown for the last 100 ticks\n  coopother             ;; how many interactions this turn were cooperating with a different color\n  coopother-agg         ;; how many interactions throughout the run were cooperating with a different color\n  defother              ;; how many interactions this turn were defecting with a different color\n  defother-agg          ;; how many interactions throughout the run were defecting with a different color\n  last100defother       ;; defother for the last 100 ticks\n  last100cc             ;; how many cooperate-cooperate genotypes have there been in the last 100 ticks\n  last100cd             ;; how many cooperate-defect genotypes have there been in the last 100 ticks\n  last100dc             ;; how many defect-cooperate genotypes have there been in the last 100 ticks\n  last100dd             ;; how many defect-defect genotypes have there been in the last 100 ticks\n  last100consist-ethno  ;; how many interactions consistent with ethnocentrism in the last 100 ticks\n  last100coop           ;; how many interactions have been cooperation in the last 100 ticks\n]\n\nto setup-empty\n  clear-all\n  initialize-variables\n  reset-ticks\nend\n\n;; creates a world with an agent on each patch\nto setup-full\n  clear-all\n  initialize-variables\n  ask patches [ create-turtle ]\n  reset-ticks\nend\n\nto initialize-variables\n  ;; initialize all the variables\n  set meetown 0\n  set meetown-agg 0\n  set meet 0\n  set meet-agg 0\n  set coopown 0\n  set coopown-agg 0\n  set defother 0\n  set defother-agg 0\n  set meetother 0\n  set meetother-agg 0\n  set coopother 0\n  set coopother-agg 0\n  set last100dd []\n  set last100cd []\n  set last100cc []\n  set last100dc []\n  set last100coopown []\n  set last100defother []\n  set last100consist-ethno []\n  set last100meetown []\n  set last100meetother []\n  set last100meet []\n  set last100coop []\nend\n\n;; creates a new agent in the world\nto create-turtle  ;; patch procedure\n  sprout 1 [\n    set color random-color\n    ;; determine the strategy for interacting with someone of the same color\n    set cooperate-with-same? (random-float 1.0 < immigrant-chance-cooperate-with-same)\n    ;; determine the strategy for interacting with someone of a different color\n    set cooperate-with-different? (random-float 1.0 < immigrant-chance-cooperate-with-different)\n    ;; change the shape of the agent on the basis of the strategy\n    update-shape\n  ]\nend\n\nto-report random-color\n  report one-of [red blue yellow green]\nend\n\n;; this is used to clear stats that change between each tick\nto clear-stats\n  set meetown 0\n  set meet 0\n  set coopown 0\n  set defother 0\n  set meetother 0\n  set coopother 0\nend\n\n;; the main routine\nto go\n  clear-stats     ;; clear the turn based stats\n  immigrate       ;; new agents immigrate into the world\n\n  ;; reset the probability to reproduce\n  ask turtles [ set ptr initial-ptr ]\n\n  ;; have all of the agents interact with other agents if they can\n  ask turtles [ interact ]\n  ;; now they reproduce\n  ask turtles [ reproduce ]\n  death           ;; kill some of the agents\n  update-stats    ;; update the states for the aggregate and last 100 ticks\n  tick\nend\n\n;; random individuals enter the world on empty cells\nto immigrate\n  let empty-patches patches with [not any? turtles-here]\n  ;; we can\'t have more immigrants than there are empty patches\n  let how-many min list immigrants-per-day (count empty-patches)\n  ask n-of how-many empty-patches [ create-turtle ]\nend\n\nto interact  ;; turtle procedure\n\n  ;; interact with Von Neumann neighborhood\n  ask turtles-on neighbors4 [\n    ;; the commands inside the ASK are written from the point of view\n    ;; of the agent being interacted with.  To refer back to the agent\n    ;; that initiated the interaction, we use the MYSELF primitive.\n    set meet meet + 1\n    set meet-agg meet-agg + 1\n    ;; do one thing if the individual interacting is the same color as me\n    if color = [color] of myself [\n      ;; record the fact the agent met someone of the own color\n      set meetown meetown + 1\n      set meetown-agg meetown-agg + 1\n      ;; if I cooperate then I reduce my PTR and increase my neighbors\n      if [cooperate-with-same?] of myself [\n        set coopown coopown + 1\n        set coopown-agg coopown-agg + 1\n        ask myself [ set ptr ptr - cost-of-giving ]\n        set ptr ptr + gain-of-receiving\n      ]\n    ]\n    ;; if we are different colors we take a different strategy\n    if color != [color] of myself [\n      ;; record stats on encounters\n      set meetother meetother + 1\n      set meetother-agg meetother-agg + 1\n      ;; if we cooperate with different colors then reduce our PTR and increase our neighbors\n      ifelse [cooperate-with-different?] of myself [\n        set coopother coopother + 1\n        set coopother-agg coopother-agg + 1\n        ask myself [ set ptr ptr - cost-of-giving ]\n        set ptr ptr + gain-of-receiving\n      ]\n      [\n        set defother defother + 1\n        set defother-agg defother-agg + 1\n      ]\n    ]\n  ]\nend\n\n;; use PTR to determine if the agent gets to reproduce\nto reproduce  ;; turtle procedure\n  ;; if a random variable is less than the PTR the agent can reproduce\n  if random-float 1.0 < ptr [\n    ;; find an empty location to reproduce into\n    let destination one-of neighbors4 with [not any? turtles-here]\n    if destination != nobody [\n      ;; if the location exists hatch a copy of the current turtle in the new location\n      ;;  but mutate the child\n      hatch 1 [\n        move-to destination\n        mutate\n      ]\n    ]\n  ]\nend\n\n;; modify the children of agents according to the mutation rate\nto mutate  ;; turtle procedure\n  ;; mutate the color\n  if random-float 1.0 < mutation-rate [\n    let old-color color\n    while [color = old-color]\n      [ set color random-color ]\n  ]\n  ;; mutate the strategy flags;\n  ;; use NOT to toggle the flag\n  if random-float 1.0 < mutation-rate [\n    set cooperate-with-same? not cooperate-with-same?\n  ]\n  if random-float 1.0 < mutation-rate [\n    set cooperate-with-different? not cooperate-with-different?\n  ]\n  ;; make sure the shape of the agent reflects its strategy\n  update-shape\nend\n\nto death\n  ;; check to see if a random variable is less than the death rate for each agent\n  ask turtles [\n    if random-float 1.0 < death-rate [ die ]\n  ]\nend\n\n;; make sure the shape matches the strategy\nto update-shape\n  ;; if the agent cooperates with same they are a circle\n  ifelse cooperate-with-same? [\n    ifelse cooperate-with-different?\n      [ set shape \"circle\" ]    ;; filled in circle (altruist)\n      [ set shape \"circle 2\" ]  ;; empty circle (ethnocentric)\n  ]\n  ;; if the agent doesn\'t cooperate with same they are a square\n  [\n    ifelse cooperate-with-different?\n      [ set shape \"square\" ]    ;; filled in square (cosmopolitan)\n      [ set shape \"square 2\" ]  ;; empty square (egoist)\n  ]\nend\n\n;; this routine calculates a moving average of some stats over the last 100 ticks\nto update-stats\n  set last100dd        shorten lput (count turtles with [shape = \"square 2\"]) last100dd\n  set last100cc        shorten lput (count turtles with [shape = \"circle\"]) last100cc\n  set last100cd        shorten lput (count turtles with [shape = \"circle 2\"]) last100cd\n  set last100dc        shorten lput (count turtles with [shape = \"square\"]) last100dc\n  set last100coopown   shorten lput coopown last100coopown\n  set last100defother  shorten lput defother last100defother\n  set last100meetown   shorten lput meetown last100meetown\n  set last100coop      shorten lput (coopown + coopother) last100coop\n  set last100meet      shorten lput meet last100meet\n  set last100meetother shorten lput meetother last100meetother\nend\n\n;; this is used to keep all of the last100 lists the right length\nto-report shorten [the-list]\n  ifelse length the-list > 100\n    [ report butfirst the-list ]\n    [ report the-list ]\nend\n\n;; these are used in the BehaviorSpace experiments\n\nto-report meetown-percent\n  report meetown / max list 1 meet\nend\nto-report meetown-agg-percent\n  report meetown-agg / max list 1 meet-agg\nend\nto-report coopown-percent\n  report coopown / max list 1 meetown\nend\nto-report coopown-agg-percent\n  report coopown-agg / max list 1 meetown-agg\nend\nto-report defother-percent\n  report defother / max list 1 meetother\nend\nto-report defother-agg-percent\n  report defother-agg / max list 1 meetother-agg\nend\nto-report consist-ethno-percent\n  report (defother + coopown) / (max list 1 meet )\nend\nto-report consist-ethno-agg-percent\n  report (defother-agg + coopown-agg) / (max list 1 meet-agg )\nend\nto-report coop-percent\n  report (coopown + coopother) / (max list 1 meet )\nend\nto-report coop-agg-percent\n  report (coopown-agg + coopother-agg) / (max list 1 meet-agg)\nend\nto-report cc-count\n  report sum last100cc / max list 1 length last100cc\nend\nto-report cd-count\n  report sum last100cd / max list 1 length last100cd\nend\nto-report dc-count\n  report sum last100dc / max list 1 length last100dc\nend\nto-report dd-count\n  report sum last100dd / max list 1 length last100dd\nend\nto-report cc-percent\n  report cc-count / (max list 1 (cc-count + cd-count + dc-count + dd-count))\nend\nto-report cd-percent\n  report cd-count / (max list 1 (cc-count + cd-count + dc-count + dd-count))\nend\nto-report dc-percent\n  report dc-count / (max list 1 (cc-count + cd-count + dc-count + dd-count))\nend\nto-report dd-percent\n  report dd-count / (max list 1 (cc-count + cd-count + dc-count + dd-count))\nend\nto-report last100coopown-percent\n  report sum last100coopown / max list 1 sum last100meetown\nend\nto-report last100defother-percent\n  report sum last100defother / max list 1 sum last100meetother\nend\nto-report last100consist-ethno-percent\n  report (sum last100defother + sum last100coopown) / max list 1 sum last100meet\nend\nto-report last100meetown-percent\n  report sum last100meetown / max list 1 sum last100meet\nend\nto-report last100coop-percent\n  report sum last100coop / max list 1 sum last100meet\nend\n\n\n; Copyright 2003 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":323,"top":10,"right":790,"bottom":478,"dimensions":{"minPxcor":0,"maxPxcor":50,"minPycor":0,"maxPycor":50,"patchSize":9,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.001","variable":"mutation-rate","left":5,"top":150,"right":171,"bottom":183,"display":"mutation-rate","min":"0.0","max":"1.0","default":0.005,"step":"0.0010","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.05","variable":"death-rate","left":5,"top":184,"right":171,"bottom":217,"display":"death-rate","min":"0.0","max":"1.0","default":0.1,"step":"0.05","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"immigrants-per-day","left":5,"top":218,"right":171,"bottom":251,"display":"immigrants-per-day","min":"0.0","max":"100.0","default":1,"step":"1.0","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"initial-PTR","left":172,"top":150,"right":318,"bottom":183,"display":"initial-PTR","min":"0.0","max":"1.0","default":0.12,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"cost-of-giving","left":172,"top":184,"right":318,"bottom":217,"display":"cost-of-giving","min":"0.0","max":"1.0","default":0.01,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"gain-of-receiving","left":172,"top":218,"right":318,"bottom":251,"display":"gain-of-receiving","min":"0.0","max":"1.0","default":0.03,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_44 = procedures[\"SETUP-EMPTY\"]();\n  if (_maybestop_33_44 instanceof Exception.StopInterrupt) { return _maybestop_33_44; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup-empty","left":20,"top":29,"right":128,"bottom":62,"display":"setup empty","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":222,"top":29,"right":295,"bottom":62,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Strategy Counts', 'CC')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"shape\"), \"circle\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"CC","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"circle\"]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Strategy Counts', 'CD')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"shape\"), \"circle 2\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"CD","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"circle 2\"]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Strategy Counts', 'DC')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"shape\"), \"square\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"DC","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"square\"]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Strategy Counts', 'DD')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"shape\"), \"square 2\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"DD","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"square 2\"]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Strategy Counts","left":6,"top":323,"right":318,"bottom":525,"xAxis":"time","yAxis":"count","xmin":0,"xmax":10,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"CC","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"circle\"]","type":"pen"},{"display":"CD","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"circle 2\"]","type":"pen"},{"display":"DC","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"square\"]","type":"pen"},{"display":"DD","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"square 2\"]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_43 = procedures[\"SETUP-FULL\"]();\n  if (_maybestop_33_43 instanceof Exception.StopInterrupt) { return _maybestop_33_43; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup-full","left":130,"top":29,"right":219,"bottom":62,"display":"setup full","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"immigrant-chance-cooperate-with-same","left":5,"top":252,"right":318,"bottom":285,"display":"immigrant-chance-cooperate-with-same","min":"0.0","max":"1.0","default":0.5,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"immigrant-chance-cooperate-with-different","left":5,"top":286,"right":318,"bottom":319,"display":"immigrant-chance-cooperate-with-different","min":"0.0","max":"1.0","default":0.5,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"display":"Circles cooperate with same color\nSquares defect with same color\nFilled-in shapes cooperate with different color\nEmpty shapes defect with different color\n","left":9,"top":77,"right":304,"bottom":142,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["mutation-rate", "death-rate", "immigrants-per-day", "initial-ptr", "cost-of-giving", "gain-of-receiving", "immigrant-chance-cooperate-with-same", "immigrant-chance-cooperate-with-different", "meet", "meet-agg", "last100meet", "meetown", "meetown-agg", "last100meetown", "meetother", "meetother-agg", "last100meetother", "coopown", "coopown-agg", "last100coopown", "coopother", "coopother-agg", "defother", "defother-agg", "last100defother", "last100cc", "last100cd", "last100dc", "last100dd", "last100consist-ethno", "last100coop"], ["mutation-rate", "death-rate", "immigrants-per-day", "initial-ptr", "cost-of-giving", "gain-of-receiving", "immigrant-chance-cooperate-with-same", "immigrant-chance-cooperate-with-different"], [], 0, 50, 0, 50, 9.0, true, true, turtleShapes, linkShapes, function(){});
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
      procedures["INITIALIZE-VARIABLES"]();
      world.ticker.reset();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupEmpty"] = temp;
  procs["SETUP-EMPTY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      procedures["INITIALIZE-VARIABLES"]();
      world.patches().ask(function() { procedures["CREATE-TURTLE"](); }, true);
      world.ticker.reset();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupFull"] = temp;
  procs["SETUP-FULL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("meetown", 0);
      world.observer.setGlobal("meetown-agg", 0);
      world.observer.setGlobal("meet", 0);
      world.observer.setGlobal("meet-agg", 0);
      world.observer.setGlobal("coopown", 0);
      world.observer.setGlobal("coopown-agg", 0);
      world.observer.setGlobal("defother", 0);
      world.observer.setGlobal("defother-agg", 0);
      world.observer.setGlobal("meetother", 0);
      world.observer.setGlobal("meetother-agg", 0);
      world.observer.setGlobal("coopother", 0);
      world.observer.setGlobal("coopother-agg", 0);
      world.observer.setGlobal("last100dd", []);
      world.observer.setGlobal("last100cd", []);
      world.observer.setGlobal("last100cc", []);
      world.observer.setGlobal("last100dc", []);
      world.observer.setGlobal("last100coopown", []);
      world.observer.setGlobal("last100defother", []);
      world.observer.setGlobal("last100consist-ethno", []);
      world.observer.setGlobal("last100meetown", []);
      world.observer.setGlobal("last100meetother", []);
      world.observer.setGlobal("last100meet", []);
      world.observer.setGlobal("last100coop", []);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["initializeVariables"] = temp;
  procs["INITIALIZE-VARIABLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().sprout(1, "TURTLES").ask(function() {
        SelfManager.self().setVariable("color", procedures["RANDOM-COLOR"]());
        SelfManager.self().setVariable("cooperate-with-same?", Prims.lt(Prims.randomFloat(1), world.observer.getGlobal("immigrant-chance-cooperate-with-same")));
        SelfManager.self().setVariable("cooperate-with-different?", Prims.lt(Prims.randomFloat(1), world.observer.getGlobal("immigrant-chance-cooperate-with-different")));
        procedures["UPDATE-SHAPE"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["createTurtle"] = temp;
  procs["CREATE-TURTLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return ListPrims.oneOf([15, 105, 45, 55])
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
  procs["randomColor"] = temp;
  procs["RANDOM-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("meetown", 0);
      world.observer.setGlobal("meet", 0);
      world.observer.setGlobal("coopown", 0);
      world.observer.setGlobal("defother", 0);
      world.observer.setGlobal("meetother", 0);
      world.observer.setGlobal("coopother", 0);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["clearStats"] = temp;
  procs["CLEAR-STATS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["CLEAR-STATS"]();
      procedures["IMMIGRATE"]();
      world.turtles().ask(function() { SelfManager.self().setVariable("ptr", world.observer.getGlobal("initial-ptr")); }, true);
      world.turtles().ask(function() { procedures["INTERACT"](); }, true);
      world.turtles().ask(function() { procedures["REPRODUCE"](); }, true);
      procedures["DEATH"]();
      procedures["UPDATE-STATS"]();
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
      let emptyPatches = world.patches().agentFilter(function() { return !!SelfManager.self().turtlesHere().isEmpty(); }); letVars['emptyPatches'] = emptyPatches;
      let howMany = ListPrims.min(ListPrims.list(world.observer.getGlobal("immigrants-per-day"), emptyPatches.size())); letVars['howMany'] = howMany;
      ListPrims.nOf(howMany, emptyPatches).ask(function() { procedures["CREATE-TURTLE"](); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["immigrate"] = temp;
  procs["IMMIGRATE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Prims.turtlesOn(SelfManager.self().getNeighbors4()).ask(function() {
        world.observer.setGlobal("meet", (world.observer.getGlobal("meet") + 1));
        world.observer.setGlobal("meet-agg", (world.observer.getGlobal("meet-agg") + 1));
        if (Prims.equality(SelfManager.self().getVariable("color"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("color"); }))) {
          world.observer.setGlobal("meetown", (world.observer.getGlobal("meetown") + 1));
          world.observer.setGlobal("meetown-agg", (world.observer.getGlobal("meetown-agg") + 1));
          if (SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("cooperate-with-same?"); })) {
            world.observer.setGlobal("coopown", (world.observer.getGlobal("coopown") + 1));
            world.observer.setGlobal("coopown-agg", (world.observer.getGlobal("coopown-agg") + 1));
            SelfManager.myself().ask(function() {
              SelfManager.self().setVariable("ptr", (SelfManager.self().getVariable("ptr") - world.observer.getGlobal("cost-of-giving")));
            }, true);
            SelfManager.self().setVariable("ptr", (SelfManager.self().getVariable("ptr") + world.observer.getGlobal("gain-of-receiving")));
          }
        }
        if (!Prims.equality(SelfManager.self().getVariable("color"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("color"); }))) {
          world.observer.setGlobal("meetother", (world.observer.getGlobal("meetother") + 1));
          world.observer.setGlobal("meetother-agg", (world.observer.getGlobal("meetother-agg") + 1));
          if (SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("cooperate-with-different?"); })) {
            world.observer.setGlobal("coopother", (world.observer.getGlobal("coopother") + 1));
            world.observer.setGlobal("coopother-agg", (world.observer.getGlobal("coopother-agg") + 1));
            SelfManager.myself().ask(function() {
              SelfManager.self().setVariable("ptr", (SelfManager.self().getVariable("ptr") - world.observer.getGlobal("cost-of-giving")));
            }, true);
            SelfManager.self().setVariable("ptr", (SelfManager.self().getVariable("ptr") + world.observer.getGlobal("gain-of-receiving")));
          }
          else {
            world.observer.setGlobal("defother", (world.observer.getGlobal("defother") + 1));
            world.observer.setGlobal("defother-agg", (world.observer.getGlobal("defother-agg") + 1));
          }
        }
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["interact"] = temp;
  procs["INTERACT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(Prims.randomFloat(1), SelfManager.self().getVariable("ptr"))) {
        let destination = SelfManager.self().getNeighbors4()._optimalOneOfWith(function() { return !!SelfManager.self().turtlesHere().isEmpty(); }); letVars['destination'] = destination;
        if (!Prims.equality(destination, Nobody)) {
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().moveTo(destination);
            procedures["MUTATE"]();
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
  procs["reproduce"] = temp;
  procs["REPRODUCE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(Prims.randomFloat(1), world.observer.getGlobal("mutation-rate"))) {
        let oldColor = SelfManager.self().getVariable("color"); letVars['oldColor'] = oldColor;
        while (Prims.equality(SelfManager.self().getVariable("color"), oldColor)) {
          SelfManager.self().setVariable("color", procedures["RANDOM-COLOR"]());
        }
      }
      if (Prims.lt(Prims.randomFloat(1), world.observer.getGlobal("mutation-rate"))) {
        SelfManager.self().setVariable("cooperate-with-same?", !SelfManager.self().getVariable("cooperate-with-same?"));
      }
      if (Prims.lt(Prims.randomFloat(1), world.observer.getGlobal("mutation-rate"))) {
        SelfManager.self().setVariable("cooperate-with-different?", !SelfManager.self().getVariable("cooperate-with-different?"));
      }
      procedures["UPDATE-SHAPE"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["mutate"] = temp;
  procs["MUTATE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtles().ask(function() {
        if (Prims.lt(Prims.randomFloat(1), world.observer.getGlobal("death-rate"))) {
          SelfManager.self().die();
        }
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["death"] = temp;
  procs["DEATH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (SelfManager.self().getVariable("cooperate-with-same?")) {
        if (SelfManager.self().getVariable("cooperate-with-different?")) {
          SelfManager.self().setVariable("shape", "circle");
        }
        else {
          SelfManager.self().setVariable("shape", "circle 2");
        }
      }
      else {
        if (SelfManager.self().getVariable("cooperate-with-different?")) {
          SelfManager.self().setVariable("shape", "square");
        }
        else {
          SelfManager.self().setVariable("shape", "square 2");
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
  procs["updateShape"] = temp;
  procs["UPDATE-SHAPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("last100dd", procedures["SHORTEN"](ListPrims.lput(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("shape"), "square 2"); }).size(), world.observer.getGlobal("last100dd"))));
      world.observer.setGlobal("last100cc", procedures["SHORTEN"](ListPrims.lput(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("shape"), "circle"); }).size(), world.observer.getGlobal("last100cc"))));
      world.observer.setGlobal("last100cd", procedures["SHORTEN"](ListPrims.lput(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("shape"), "circle 2"); }).size(), world.observer.getGlobal("last100cd"))));
      world.observer.setGlobal("last100dc", procedures["SHORTEN"](ListPrims.lput(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("shape"), "square"); }).size(), world.observer.getGlobal("last100dc"))));
      world.observer.setGlobal("last100coopown", procedures["SHORTEN"](ListPrims.lput(world.observer.getGlobal("coopown"), world.observer.getGlobal("last100coopown"))));
      world.observer.setGlobal("last100defother", procedures["SHORTEN"](ListPrims.lput(world.observer.getGlobal("defother"), world.observer.getGlobal("last100defother"))));
      world.observer.setGlobal("last100meetown", procedures["SHORTEN"](ListPrims.lput(world.observer.getGlobal("meetown"), world.observer.getGlobal("last100meetown"))));
      world.observer.setGlobal("last100coop", procedures["SHORTEN"](ListPrims.lput((world.observer.getGlobal("coopown") + world.observer.getGlobal("coopother")), world.observer.getGlobal("last100coop"))));
      world.observer.setGlobal("last100meet", procedures["SHORTEN"](ListPrims.lput(world.observer.getGlobal("meet"), world.observer.getGlobal("last100meet"))));
      world.observer.setGlobal("last100meetother", procedures["SHORTEN"](ListPrims.lput(world.observer.getGlobal("meetother"), world.observer.getGlobal("last100meetother"))));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateStats"] = temp;
  procs["UPDATE-STATS"] = temp;
  temp = (function(theList) {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.gt(ListPrims.length(theList), 100)) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return ListPrims.butFirst(theList)
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return theList
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
  procs["shorten"] = temp;
  procs["SHORTEN"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(world.observer.getGlobal("meetown"), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meet"))))
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
  procs["meetownPercent"] = temp;
  procs["MEETOWN-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(world.observer.getGlobal("meetown-agg"), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meet-agg"))))
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
  procs["meetownAggPercent"] = temp;
  procs["MEETOWN-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(world.observer.getGlobal("coopown"), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meetown"))))
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
  procs["coopownPercent"] = temp;
  procs["COOPOWN-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(world.observer.getGlobal("coopown-agg"), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meetown-agg"))))
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
  procs["coopownAggPercent"] = temp;
  procs["COOPOWN-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(world.observer.getGlobal("defother"), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meetother"))))
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
  procs["defotherPercent"] = temp;
  procs["DEFOTHER-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(world.observer.getGlobal("defother-agg"), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meetother-agg"))))
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
  procs["defotherAggPercent"] = temp;
  procs["DEFOTHER-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div((world.observer.getGlobal("defother") + world.observer.getGlobal("coopown")), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meet"))))
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
  procs["consistEthnoPercent"] = temp;
  procs["CONSIST-ETHNO-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div((world.observer.getGlobal("defother-agg") + world.observer.getGlobal("coopown-agg")), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meet-agg"))))
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
  procs["consistEthnoAggPercent"] = temp;
  procs["CONSIST-ETHNO-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div((world.observer.getGlobal("coopown") + world.observer.getGlobal("coopother")), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meet"))))
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
  procs["coopPercent"] = temp;
  procs["COOP-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div((world.observer.getGlobal("coopown-agg") + world.observer.getGlobal("coopother-agg")), ListPrims.max(ListPrims.list(1, world.observer.getGlobal("meet-agg"))))
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
  procs["coopAggPercent"] = temp;
  procs["COOP-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.observer.getGlobal("last100cc")), ListPrims.max(ListPrims.list(1, ListPrims.length(world.observer.getGlobal("last100cc")))))
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
  procs["ccCount"] = temp;
  procs["CC-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.observer.getGlobal("last100cd")), ListPrims.max(ListPrims.list(1, ListPrims.length(world.observer.getGlobal("last100cd")))))
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
  procs["cdCount"] = temp;
  procs["CD-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.observer.getGlobal("last100dc")), ListPrims.max(ListPrims.list(1, ListPrims.length(world.observer.getGlobal("last100dc")))))
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
  procs["dcCount"] = temp;
  procs["DC-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.observer.getGlobal("last100dd")), ListPrims.max(ListPrims.list(1, ListPrims.length(world.observer.getGlobal("last100dd")))))
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
  procs["ddCount"] = temp;
  procs["DD-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(procedures["CC-COUNT"](), ListPrims.max(ListPrims.list(1, (((procedures["CC-COUNT"]() + procedures["CD-COUNT"]()) + procedures["DC-COUNT"]()) + procedures["DD-COUNT"]()))))
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
  procs["ccPercent"] = temp;
  procs["CC-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(procedures["CD-COUNT"](), ListPrims.max(ListPrims.list(1, (((procedures["CC-COUNT"]() + procedures["CD-COUNT"]()) + procedures["DC-COUNT"]()) + procedures["DD-COUNT"]()))))
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
  procs["cdPercent"] = temp;
  procs["CD-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(procedures["DC-COUNT"](), ListPrims.max(ListPrims.list(1, (((procedures["CC-COUNT"]() + procedures["CD-COUNT"]()) + procedures["DC-COUNT"]()) + procedures["DD-COUNT"]()))))
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
  procs["dcPercent"] = temp;
  procs["DC-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(procedures["DD-COUNT"](), ListPrims.max(ListPrims.list(1, (((procedures["CC-COUNT"]() + procedures["CD-COUNT"]()) + procedures["DC-COUNT"]()) + procedures["DD-COUNT"]()))))
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
  procs["ddPercent"] = temp;
  procs["DD-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.observer.getGlobal("last100coopown")), ListPrims.max(ListPrims.list(1, ListPrims.sum(world.observer.getGlobal("last100meetown")))))
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
  procs["last100coopownPercent"] = temp;
  procs["LAST100COOPOWN-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.observer.getGlobal("last100defother")), ListPrims.max(ListPrims.list(1, ListPrims.sum(world.observer.getGlobal("last100meetother")))))
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
  procs["last100defotherPercent"] = temp;
  procs["LAST100DEFOTHER-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div((ListPrims.sum(world.observer.getGlobal("last100defother")) + ListPrims.sum(world.observer.getGlobal("last100coopown"))), ListPrims.max(ListPrims.list(1, ListPrims.sum(world.observer.getGlobal("last100meet")))))
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
  procs["last100consistEthnoPercent"] = temp;
  procs["LAST100CONSIST-ETHNO-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.observer.getGlobal("last100meetown")), ListPrims.max(ListPrims.list(1, ListPrims.sum(world.observer.getGlobal("last100meet")))))
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
  procs["last100meetownPercent"] = temp;
  procs["LAST100MEETOWN-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.observer.getGlobal("last100coop")), ListPrims.max(ListPrims.list(1, ListPrims.sum(world.observer.getGlobal("last100meet")))))
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
  procs["last100coopPercent"] = temp;
  procs["LAST100COOP-PERCENT"] = temp;
  return procs;
})();
world.observer.setGlobal("mutation-rate", 0.005);
world.observer.setGlobal("death-rate", 0.1);
world.observer.setGlobal("immigrants-per-day", 1);
world.observer.setGlobal("initial-ptr", 0.12);
world.observer.setGlobal("cost-of-giving", 0.01);
world.observer.setGlobal("gain-of-receiving", 0.03);
world.observer.setGlobal("immigrant-chance-cooperate-with-same", 0.5);
world.observer.setGlobal("immigrant-chance-cooperate-with-different", 0.5);
