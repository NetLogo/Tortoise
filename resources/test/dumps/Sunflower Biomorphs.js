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
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "SPAWNERS", singular: "spawner", varNames: ["num-colors", "step-size", "turn-increment", "size-modifier"] }, { name: "PETALS", singular: "petal", varNames: ["step-size", "size-modifier", "parent"] }])([], [])(';; spawners are hidden turtles at the center of each \"flower\" that\n;; are always hatching the petals you actually see\nbreed [spawners spawner]\nbreed [petals petal]\n\nglobals [\n  first-parent     ;; the first parent chosen if sexual reproduction is being used\n]\n\nspawners-own [\n  num-colors       ;; how many colors the petals will have\n  step-size        ;; how fast petals move out (the flower\'s rate of growth)\n  turn-increment   ;; how much each petal is rotated before moving out from\n                   ;; the center; for example, a turn-increment of 0 will\n                   ;; cause all the petals to move out on the same line\n  size-modifier    ;; how quickly the petals grow as they move away from\n                   ;; their starting location\n]\n\npetals-own [\n  step-size        ;; same as for spawners\n  size-modifier    ;; same as for spawners\n  parent           ;; spawner that spawned this petal; distance from parent\n                   ;; is used for calculating the petal\'s size as it grows\n]\n\nto setup\n  clear-all\n  create-spawners rows * columns\n  [\n    set num-colors random 14 + 1\n    set step-size random-float 0.5\n    set turn-increment random-float 4.0\n    set size-modifier random-float 2.0\n    hide-turtle        ;; we don\'t want to see the spawners\n  ]\n  arrange-spawners\n  set first-parent nobody\n  reset-ticks\nend\n\nto arrange-spawners\n  ;; arrange the spawners around the world in a grid\n  let i 0\n  while [i < rows * columns]\n  [\n    ask turtle i\n    [\n      let x-int world-width / columns\n      let y-int world-height / rows\n      setxy (-1 * max-pxcor + x-int / 2 + (i mod columns) * x-int)\n            (max-pycor + min-pycor / rows - int (i / columns) * y-int)\n    ]\n    set i i + 1\n  ]\nend\n\nto go\n  ask spawners\n  [\n    hatch-petals 1\n    [\n      set parent myself\n      set color 10 * (ticks mod ([num-colors] of parent + 1)) + 15\n      rt ticks * [turn-increment] of parent * 360\n      set size 0\n      show-turtle  ;; the petal inherits the hiddenness of its parent,\n                   ;; so this makes it visible again\n    ]\n  ]\n  ask petals\n  [\n    fd step-size\n    set size size-modifier * sqrt distance parent\n    ;; Kill the petals when they would start interfering with petals from other flowers.\n    if abs (xcor - [xcor] of parent) > max-pxcor / (columns * 1.5) [ die ]\n    if abs (ycor - [ycor] of parent) > max-pycor / (rows * 1.5) [ die ]\n  ]\n  tick\n  if mouse-down? [ handle-mouse-down ]\nend\n\nto repopulate-from-two [parent1 parent2]\n  ask petals [ die ]\n  ask spawners\n  [\n    ;;if controlled-mutation? then the mutation a flower experiences is relative to its spawner\'s who number.\n    if controlled-mutation? [set mutation who * 1 / (rows * columns)]\n\n    ;; select one value from either parent for each of the four variables\n    set num-colors ([num-colors] of one-of list parent1 parent2) + int random-normal 0 (mutation * 10) mod 15 + 1\n    set step-size ([step-size] of one-of list parent1 parent2) + random-normal 0 (mutation / 5)\n    set turn-increment ([turn-increment] of one-of list parent1 parent2) + random-normal 0 (mutation / 20)\n    set size-modifier ([size-modifier] of one-of list parent1 parent2) + random-normal 0 mutation\n\n    ;;We clamp size-modifier so none of the sunflowers get too big.\n    if size-modifier > 1.5 [set size-modifier 1.5]\n  ]\nend\n\nto repopulate-from-one [parent1]\n  ask petals [ die ]\n  ask spawners\n  [\n    if controlled-mutation? [ set mutation who * 1 / (rows * columns) ]\n    set num-colors ([num-colors] of parent1 + int random-normal 0 (mutation * 10)) mod 15 + 1\n    set step-size [step-size] of parent1 + random-normal 0 (mutation / 5)\n    set turn-increment [turn-increment] of parent1 + random-normal 0 (mutation / 20)\n    set size-modifier [size-modifier] of parent1 + random-normal 0 mutation\n\n    ;;We clamp size-modifier so none of the sunflowers get too big.\n    if size-modifier > 1.5 [ set size-modifier 1.5 ]\n  ]\nend\n\nto handle-mouse-down\n  ;; get the spawner closest to where the user clicked\n  let new-parent min-one-of spawners [distancexy mouse-xcor mouse-ycor]\n  ifelse asexual?\n  [ repopulate-from-one new-parent ]\n  [\n    ifelse first-parent != nobody\n    [\n      repopulate-from-two first-parent new-parent\n      set first-parent nobody\n      ask patches [ set pcolor black ]\n    ]\n    [\n      set first-parent new-parent\n      ask patches\n      [\n        ;; This is a little tricky; some patches may be equidistant\n        ;; from more than one spawner, so we can\'t just ask for the\n        ;; closest spawner, we have to ask for all the closest spawners\n        ;; and then see if the clicked spawner is among them\n        if member? new-parent spawners with-min [distance myself]\n          [ set pcolor gray - 3 ]\n      ]\n    ]\n  ]\n  ;; wait for the user to release mouse button\n  while [mouse-down?] [ ]\nend\n\n\n; Copyright 2006 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":198,"top":10,"right":626,"bottom":439,"dimensions":{"minPxcor":-17,"maxPxcor":17,"minPycor":-17,"maxPycor":17,"patchSize":12,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":11,"top":107,"right":94,"bottom":140,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":97,"top":107,"right":177,"bottom":140,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"10","compiledStep":"1","variable":"rows","left":10,"top":33,"right":182,"bottom":66,"display":"rows","min":"1.0","max":"10.0","default":5,"step":"1.0","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"10","compiledStep":"1","variable":"columns","left":10,"top":67,"right":182,"bottom":100,"display":"columns","min":"1.0","max":"10.0","default":5,"step":"1.0","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.02","variable":"mutation","left":10,"top":145,"right":182,"bottom":178,"display":"mutation","min":"0.0","max":"1.0","default":0.14,"step":"0.02","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"asexual?","left":10,"top":193,"right":132,"bottom":226,"display":"asexual?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"controlled-mutation?","left":10,"top":227,"right":190,"bottom":260,"display":"controlled-mutation?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["rows", "columns", "mutation", "asexual?", "controlled-mutation?", "first-parent"], ["rows", "columns", "mutation", "asexual?", "controlled-mutation?"], [], -17, 17, -17, 17, 12.0, false, false, turtleShapes, linkShapes, function(){});
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
      world.clearAll();
      world.turtleManager.createTurtles((world.observer.getGlobal("rows") * world.observer.getGlobal("columns")), "SPAWNERS").ask(function() {
        SelfManager.self().setVariable("num-colors", (Prims.random(14) + 1));
        SelfManager.self().setVariable("step-size", Prims.randomFloat(0.5));
        SelfManager.self().setVariable("turn-increment", Prims.randomFloat(4));
        SelfManager.self().setVariable("size-modifier", Prims.randomFloat(2));
        SelfManager.self().hideTurtle(true);;
      }, true);
      procedures["ARRANGE-SPAWNERS"]();
      world.observer.setGlobal("first-parent", Nobody);
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
      let i = 0; letVars['i'] = i;
      while (Prims.lt(i, (world.observer.getGlobal("rows") * world.observer.getGlobal("columns")))) {
        world.turtleManager.getTurtle(i).ask(function() {
          let xInt = Prims.div(world.topology.width, world.observer.getGlobal("columns")); letVars['xInt'] = xInt;
          let yInt = Prims.div(world.topology.height, world.observer.getGlobal("rows")); letVars['yInt'] = yInt;
          SelfManager.self().setXY((((-1 * world.topology.maxPxcor) + Prims.div(xInt, 2)) + (NLMath.mod(i, world.observer.getGlobal("columns")) * xInt)), ((world.topology.maxPycor + Prims.div(world.topology.minPycor, world.observer.getGlobal("rows"))) - (NLMath.toInt(Prims.div(i, world.observer.getGlobal("columns"))) * yInt)));
        }, true);
        i = (i + 1); letVars['i'] = i;
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["arrangeSpawners"] = temp;
  procs["ARRANGE-SPAWNERS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("SPAWNERS").ask(function() {
        SelfManager.self().hatch(1, "PETALS").ask(function() {
          SelfManager.self().setVariable("parent", SelfManager.myself());
          SelfManager.self().setVariable("color", ((10 * NLMath.mod(world.ticker.tickCount(), (SelfManager.self().getVariable("parent").projectionBy(function() { return SelfManager.self().getVariable("num-colors"); }) + 1))) + 15));
          SelfManager.self().right(((world.ticker.tickCount() * SelfManager.self().getVariable("parent").projectionBy(function() { return SelfManager.self().getVariable("turn-increment"); })) * 360));
          SelfManager.self().setVariable("size", 0);
          SelfManager.self().hideTurtle(false);;
        }, true);
      }, true);
      world.turtleManager.turtlesOfBreed("PETALS").ask(function() {
        SelfManager.self().fd(SelfManager.self().getVariable("step-size"));
        SelfManager.self().setVariable("size", (SelfManager.self().getVariable("size-modifier") * NLMath.sqrt(SelfManager.self().distance(SelfManager.self().getVariable("parent")))));
        if (Prims.gt(NLMath.abs((SelfManager.self().getVariable("xcor") - SelfManager.self().getVariable("parent").projectionBy(function() { return SelfManager.self().getVariable("xcor"); }))), Prims.div(world.topology.maxPxcor, (world.observer.getGlobal("columns") * 1.5)))) {
          SelfManager.self().die();
        }
        if (Prims.gt(NLMath.abs((SelfManager.self().getVariable("ycor") - SelfManager.self().getVariable("parent").projectionBy(function() { return SelfManager.self().getVariable("ycor"); }))), Prims.div(world.topology.maxPycor, (world.observer.getGlobal("rows") * 1.5)))) {
          SelfManager.self().die();
        }
      }, true);
      world.ticker.tick();
      if (MousePrims.isDown()) {
        procedures["HANDLE-MOUSE-DOWN"]();
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
  temp = (function(parent1, parent2) {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("PETALS").ask(function() { SelfManager.self().die(); }, true);
      world.turtleManager.turtlesOfBreed("SPAWNERS").ask(function() {
        if (world.observer.getGlobal("controlled-mutation?")) {
          world.observer.setGlobal("mutation", Prims.div((SelfManager.self().getVariable("who") * 1), (world.observer.getGlobal("rows") * world.observer.getGlobal("columns"))));
        }
        SelfManager.self().setVariable("num-colors", ((ListPrims.oneOf(ListPrims.list(parent1, parent2)).projectionBy(function() { return SelfManager.self().getVariable("num-colors"); }) + NLMath.mod(NLMath.toInt(Prims.randomNormal(0, (world.observer.getGlobal("mutation") * 10))), 15)) + 1));
        SelfManager.self().setVariable("step-size", (ListPrims.oneOf(ListPrims.list(parent1, parent2)).projectionBy(function() { return SelfManager.self().getVariable("step-size"); }) + Prims.randomNormal(0, Prims.div(world.observer.getGlobal("mutation"), 5))));
        SelfManager.self().setVariable("turn-increment", (ListPrims.oneOf(ListPrims.list(parent1, parent2)).projectionBy(function() { return SelfManager.self().getVariable("turn-increment"); }) + Prims.randomNormal(0, Prims.div(world.observer.getGlobal("mutation"), 20))));
        SelfManager.self().setVariable("size-modifier", (ListPrims.oneOf(ListPrims.list(parent1, parent2)).projectionBy(function() { return SelfManager.self().getVariable("size-modifier"); }) + Prims.randomNormal(0, world.observer.getGlobal("mutation"))));
        if (Prims.gt(SelfManager.self().getVariable("size-modifier"), 1.5)) {
          SelfManager.self().setVariable("size-modifier", 1.5);
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
  procs["repopulateFromTwo"] = temp;
  procs["REPOPULATE-FROM-TWO"] = temp;
  temp = (function(parent1) {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("PETALS").ask(function() { SelfManager.self().die(); }, true);
      world.turtleManager.turtlesOfBreed("SPAWNERS").ask(function() {
        if (world.observer.getGlobal("controlled-mutation?")) {
          world.observer.setGlobal("mutation", Prims.div((SelfManager.self().getVariable("who") * 1), (world.observer.getGlobal("rows") * world.observer.getGlobal("columns"))));
        }
        SelfManager.self().setVariable("num-colors", (NLMath.mod((parent1.projectionBy(function() { return SelfManager.self().getVariable("num-colors"); }) + NLMath.toInt(Prims.randomNormal(0, (world.observer.getGlobal("mutation") * 10)))), 15) + 1));
        SelfManager.self().setVariable("step-size", (parent1.projectionBy(function() { return SelfManager.self().getVariable("step-size"); }) + Prims.randomNormal(0, Prims.div(world.observer.getGlobal("mutation"), 5))));
        SelfManager.self().setVariable("turn-increment", (parent1.projectionBy(function() { return SelfManager.self().getVariable("turn-increment"); }) + Prims.randomNormal(0, Prims.div(world.observer.getGlobal("mutation"), 20))));
        SelfManager.self().setVariable("size-modifier", (parent1.projectionBy(function() { return SelfManager.self().getVariable("size-modifier"); }) + Prims.randomNormal(0, world.observer.getGlobal("mutation"))));
        if (Prims.gt(SelfManager.self().getVariable("size-modifier"), 1.5)) {
          SelfManager.self().setVariable("size-modifier", 1.5);
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
  procs["repopulateFromOne"] = temp;
  procs["REPOPULATE-FROM-ONE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let newParent = world.turtleManager.turtlesOfBreed("SPAWNERS").minOneOf(function() { return SelfManager.self().distanceXY(MousePrims.getX(), MousePrims.getY()); }); letVars['newParent'] = newParent;
      if (world.observer.getGlobal("asexual?")) {
        procedures["REPOPULATE-FROM-ONE"](newParent);
      }
      else {
        if (!Prims.equality(world.observer.getGlobal("first-parent"), Nobody)) {
          procedures["REPOPULATE-FROM-TWO"](world.observer.getGlobal("first-parent"),newParent);
          world.observer.setGlobal("first-parent", Nobody);
          world.patches().ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
        }
        else {
          world.observer.setGlobal("first-parent", newParent);
          world.patches().ask(function() {
            if (ListPrims.member(newParent, world.turtleManager.turtlesOfBreed("SPAWNERS").minsBy(function() { return SelfManager.self().distance(SelfManager.myself()); }))) {
              SelfManager.self().setPatchVariable("pcolor", (5 - 3));
            }
          }, true);
        }
      }
      while (MousePrims.isDown()) {
      
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["handleMouseDown"] = temp;
  procs["HANDLE-MOUSE-DOWN"] = temp;
  return procs;
})();
world.observer.setGlobal("rows", 5);
world.observer.setGlobal("columns", 5);
world.observer.setGlobal("mutation", 0.14);
world.observer.setGlobal("asexual?", true);
world.observer.setGlobal("controlled-mutation?", false);
