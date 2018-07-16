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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":1,"y":1,"diam":298,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"vector":{"name":"vector","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":15,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[120,150,180,120],"ycors":[30,0,30,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
},
    exportFile: function(str) {
      return function(filepath) {
        var Paths = Java.type('java.nio.file.Paths');
        var Files = Java.type('java.nio.file.Files');
        var UTF8  = Java.type('java.nio.charset.StandardCharsets').UTF_8;
        Files.createDirectories(Paths.get(filepath).getParent());
        var path  = Files.write(Paths.get(filepath), str.getBytes());
      }
},
    importDrawing: function(trueImportDrawing) { return function(filepath) {} },
    exportView: function(filename) {},
    exportOutput: function(filename) {}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.inspection = {
    inspect: function(agent) {},
    stopInspecting: function(agent) {},
    clearDead: function() {}
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
  var name    = 'Speed Counts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Counts', 'fast')(function() {
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
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Counts', 'medium')(function() {
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
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Counts', 'slow')(function() {
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
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Counts', undefined)(function() {
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
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Speed Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() {
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
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() {
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
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() {
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
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', 'avg-speed')(function() {
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
  new PenBundle.Pen('init-avg-speed', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setXRange(0, NLMath.ceil((procedures["INIT-PARTICLE-SPEED"]() * 2)));
          plotManager.setYRange(0, NLMath.ceil(Prims.div(world.turtleManager.turtlesOfBreed("PARTICLES").size(), 6)));
          plotManager.setCurrentPen("medium");
          plotManager.setHistogramBarCount(40);
          plotManager.setCurrentPen("slow");
          plotManager.setHistogramBarCount(40);
          plotManager.setCurrentPen("fast");
          plotManager.setHistogramBarCount(40);
          plotManager.setCurrentPen("init-avg-speed");
          let _maybestop_337_351 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("init-avg-speed"));
          if (_maybestop_337_351 instanceof Exception.StopInterrupt) { return _maybestop_337_351; }
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
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Energy Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('particles', plotOps.makePenOps, false, new PenBundle.State(3.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Energy Histogram', 'particles')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("energy"); }));
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
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Energy Histogram', 'avg-energy')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.resetPen();
          let _maybestop_50_64 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("avg-energy"));
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
  new PenBundle.Pen('init-avg-energy', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Energy Histogram', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setXRange(0, NLMath.ceil((((0.5 * (procedures["INIT-PARTICLE-SPEED"]() * 2)) * (procedures["INIT-PARTICLE-SPEED"]() * 2)) * procedures["MAX-PARTICLE-MASS"]())));
          plotManager.setYRange(0, NLMath.ceil(Prims.div(world.turtleManager.turtlesOfBreed("PARTICLES").size(), 6)));
          plotManager.setCurrentPen("particles");
          plotManager.setHistogramBarCount(40);
          plotManager.setCurrentPen("init-avg-energy");
          let _maybestop_290_304 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("init-avg-energy"));
          if (_maybestop_290_304 instanceof Exception.StopInterrupt) { return _maybestop_290_304; }
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
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 200.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PARTICLES", singular: "particle", varNames: ["speed", "mass", "energy"] }])([], [])('globals [\n  tick-delta        ;; how much simulation time will pass in this step\n  box-edge          ;; distance of box edge from origin\n  collisions        ;; list used to keep track of future collisions\n  particle1         ;; first particle currently colliding\n  particle2         ;; second particle currently colliding\n  init-avg-speed init-avg-energy             ;; initial averages\n  avg-speed avg-energy                       ;; current averages\n  fast medium slow                           ;; current counts\n  percent-slow percent-medium percent-fast   ;; percentage of current counts\n]\n\nbreed [particles particle]\n\nparticles-own [\n  speed\n  mass\n  energy\n]\n\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;; setup procedures ;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto setup\n  clear-all\n  set-default-shape particles \"circle\"\n  set box-edge max-pxcor - 1\n  ask patches with [(abs pxcor = box-edge or abs pycor = box-edge) and\n                    abs pxcor <= box-edge and abs pycor <= box-edge]\n    [ set pcolor yellow ]\n  set avg-speed 1\n  make-particles\n  set particle1 nobody\n  set particle2 nobody\n  reset-ticks\n  set collisions []\n  ask particles [ check-for-wall-collision ]\n  ask particles [ check-for-particle-collision ]\n  update-variables\n  set init-avg-speed avg-speed\n  set init-avg-energy avg-energy\nend\n\nto make-particles\n  create-particles initial-number-particles [\n    set speed 1\n\n    set size smallest-particle-size\n             + random-float (largest-particle-size - smallest-particle-size)\n    ;; set the mass proportional to the area of the particle\n    set mass (size * size)\n    set energy kinetic-energy\n\n    recolor\n  ]\n  ;; When space is tight, placing the big particles first improves\n  ;; our chances of eventually finding places for all of them.\n  foreach sort-by [ [a b] -> [ size ] of a > [ size ] of b ] particles [ the-particle ->\n    ask the-particle [\n      position-randomly\n      while [ overlapping? ] [ position-randomly ]\n    ]\n  ]\nend\n\nto-report overlapping?  ;; particle procedure\n  ;; here, we use IN-RADIUS just for improved speed; the real testing\n  ;; is done by DISTANCE\n  report any? other particles in-radius ((size + largest-particle-size) / 2)\n                              with [distance myself < (size + [size] of myself) / 2]\nend\n\nto position-randomly  ;; particle procedure\n  ;; place particle at random location inside the box\n  setxy one-of [1 -1] * random-float (box-edge - 0.5 - size / 2)\n        one-of [1 -1] * random-float (box-edge - 0.5 - size / 2)\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;; go procedures  ;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto go\n  choose-next-collision\n  ask particles [ jump speed * tick-delta ]\n  perform-next-collision\n  tick-advance tick-delta\n  recalculate-particles-that-just-collided\n  if floor ticks > floor (ticks - tick-delta)\n  [\n    update-variables\n    update-plots\n  ]\nend\n\nto update-variables\n  set medium count particles with [color = green]\n  set slow   count particles with [color = blue]\n  set fast   count particles with [color = red]\n  set percent-medium (medium / ( count particles )) * 100\n  set percent-slow (slow / (count particles)) * 100\n  set percent-fast (fast / (count particles)) * 100\n  set avg-speed  mean [speed] of particles\n  set avg-energy mean [energy] of particles\nend\n\n\nto recalculate-particles-that-just-collided\n  ;; Since only collisions involving the particles that collided most recently could be affected,\n  ;; we filter those out of collisions.  Then we recalculate all possible collisions for\n  ;; the particles that collided last.  The ifelse statement is necessary because\n  ;; particle2 can be either a particle or a string representing a wall.  If it is a\n  ;; wall, we don\'t want to invalidate all collisions involving that wall (because the wall\'s\n  ;; position wasn\'t affected, those collisions are still valid.\n  ifelse is-turtle? particle2\n    [\n      set collisions filter [ the-collision ->\n        item 1 the-collision != particle1 and\n        item 2 the-collision != particle1 and\n        item 1 the-collision != particle2 and\n        item 2 the-collision != particle2\n      ] collisions\n      ask particle2 [ check-for-wall-collision ]\n      ask particle2 [ check-for-particle-collision ]\n    ]\n    [\n      set collisions filter [ the-collision ->\n        item 1 the-collision != particle1 and\n        item 2 the-collision != particle1\n      ] collisions\n    ]\n  if particle1 != nobody [ ask particle1 [ check-for-wall-collision ] ]\n  if particle1 != nobody [ ask particle1 [ check-for-particle-collision ] ]\n  ;; Slight errors in floating point math can cause a collision that just\n  ;; happened to be calculated as happening again a very tiny amount of\n  ;; time into the future, so we remove any collisions that involves\n  ;; the same two particles (or particle and wall) as last time.\n  set collisions filter [ the-collision ->\n    item 1 the-collision != particle1 or\n    item 2 the-collision != particle2\n  ] collisions\n  ;; All done.\n  set particle1 nobody\n  set particle2 nobody\nend\n\n;; check-for-particle-collision is a particle procedure that determines the time it takes\n;; to the collision between two particles (if one exists).  It solves for the time by representing\n;; the equations of motion for distance, velocity, and time in a quadratic equation of the vector\n;; components of the relative velocities and changes in position between the two particles and\n;; solves for the time until the next collision\nto check-for-particle-collision\n  let my-x xcor\n  let my-y ycor\n  let my-particle-size size\n  let my-x-speed speed * dx\n  let my-y-speed speed * dy\n  ask other particles\n  [\n    let dpx (xcor - my-x)   ;; relative distance between particles in the x direction\n    let dpy (ycor - my-y)    ;; relative distance between particles in the y direction\n    let x-speed (speed * dx) ;; speed of other particle in the x direction\n    let y-speed (speed * dy) ;; speed of other particle in the x direction\n    let dvx (x-speed - my-x-speed) ;; relative speed difference between particles in x direction\n    let dvy (y-speed - my-y-speed) ;; relative speed difference between particles in y direction\n    let sum-r (((my-particle-size) / 2 ) + (([size] of self) / 2 )) ;; sum of both particle radii\n\n    ;; To figure out what the difference in position (P1) between two particles at a future\n    ;; time (t) will be, one would need to know the current difference in position (P0) between the\n    ;; two particles and the current difference in the velocity (V0) between the two particles.\n    ;;\n    ;; The equation that represents the relationship is:\n    ;;   P1 = P0 + t * V0\n    ;; we want find when in time (t), P1 would be equal to the sum of both the particle\'s radii\n    ;; (sum-r).  When P1 is equal to is equal to sum-r, the particles will just be touching each\n    ;; other at their edges (a single point of contact).\n    ;;\n    ;; Therefore we are looking for when:   sum-r =  P0 + t * V0\n    ;;\n    ;; This equation is not a simple linear equation, since P0 and V0 should both have x and y\n    ;; components in their two dimensional vector representation (calculated as dpx, dpy, and\n    ;; dvx, dvy).\n    ;;\n    ;; By squaring both sides of the equation, we get:\n    ;;   (sum-r) * (sum-r) =  (P0 + t * V0) * (P0 + t * V0)\n    ;; When expanded gives:\n    ;;   (sum-r ^ 2) = (P0 ^ 2) + (t * PO * V0) + (t * PO * V0) + (t ^ 2 * VO ^ 2)\n    ;; Which can be simplified to:\n    ;;   0 = (P0 ^ 2) - (sum-r ^ 2) + (2 * PO * V0) * t + (VO ^ 2) * t ^ 2\n    ;; Below, we will let p-squared represent:   (P0 ^ 2) - (sum-r ^ 2)\n    ;; and pv represent: (2 * PO * V0)\n    ;; and v-squared represent: (VO ^ 2)\n    ;;\n    ;;  then the equation will simplify to:     0 = p-squared + pv * t + v-squared * t^2\n\n    let p-squared   ((dpx * dpx) + (dpy * dpy)) - (sum-r ^ 2)   ;; p-squared represents difference\n    ;; of the square of the radii and the square of the initial positions\n\n    let pv  (2 * ((dpx * dvx) + (dpy * dvy)))  ;; vector product of the position times the velocity\n    let v-squared  ((dvx * dvx) + (dvy * dvy)) ;; the square of the difference in speeds\n    ;; represented as the sum of the squares of the x-component\n    ;; and y-component of relative speeds between the two particles\n\n    ;; p-squared, pv, and v-squared are coefficients in the quadratic equation shown above that\n    ;; represents how distance between the particles and relative velocity are related to the time,\n    ;; t, at which they will next collide (or when their edges will just be touching)\n\n    ;; Any quadratic equation that is a function of time (t) can be represented as:\n    ;;   a*t*t + b*t + c = 0,\n    ;; where a, b, and c are the coefficients of the three different terms, and has solutions for t\n    ;; that can be found by using the quadratic formula.  The quadratic formula states that if a is\n    ;; not 0, then there are two solutions for t, either real or complex.\n    ;; t is equal to (b +/- sqrt (b^2 - 4*a*c)) / 2*a\n    ;; the portion of this equation that is under a square root is referred to here\n    ;; as the determinant, d1.   d1 is equal to (b^2 - 4*a*c)\n    ;; and:   a = v-squared, b = pv, and c = p-squared.\n    let d1 pv ^ 2 -  (4 * v-squared * p-squared)\n\n    ;; the next test tells us that a collision will happen in the future if\n    ;; the determinant, d1 is > 0,  since a positive determinant tells us that there is a\n    ;; real solution for the quadratic equation.  Quadratic equations can have solutions\n    ;; that are not real (they are square roots of negative numbers).  These are referred\n    ;; to as imaginary numbers and for many real world systems that the equations represent\n    ;; are not real world states the system can actually end up in.\n\n    ;; Once we determine that a real solution exists, we want to take only one of the two\n    ;; possible solutions to the quadratic equation, namely the smaller of the two the solutions:\n    ;;  (b - sqrt (b^2 - 4*a*c)) / 2*a\n    ;;  which is a solution that represents when the particles first touching on their edges.\n    ;;  instead of (b + sqrt (b^2 - 4*a*c)) / 2*a\n    ;;  which is a solution that represents a time after the particles have penetrated\n    ;;  and are coming back out of each other and when they are just touching on their edges.\n\n    let time-to-collision  -1\n\n    if d1 > 0\n      [ set time-to-collision (- pv - sqrt d1) / (2 * v-squared) ]        ;; solution for time step\n\n    ;; if time-to-collision is still -1 there is no collision in the future - no valid solution\n    ;; note:  negative values for time-to-collision represent where particles would collide\n    ;; if allowed to move backward in time.\n    ;; if time-to-collision is greater than 1, then we continue to advance the motion\n    ;; of the particles along their current trajectories.  They do not collide yet.\n\n    if time-to-collision > 0\n    [\n      ;; time-to-collision is relative (ie, a collision will occur one second from now)\n      ;; We need to store the absolute time (ie, a collision will occur at time 48.5 seconds.\n      ;; So, we add clock to time-to-collision when we store it.\n      ;; The entry we add is a three element list of the time to collision and the colliding pair.\n      set collisions fput (list (time-to-collision + ticks) self myself)\n                          collisions\n    ]\n  ]\nend\n\n\n;; determines when a particle will hit any of the four walls\nto check-for-wall-collision  ;; particle procedure\n  ;; right & left walls\n  let x-speed (speed * dx)\n  if x-speed != 0\n    [ ;; solve for how long it will take particle to reach right wall\n      let right-interval (box-edge - 0.5 - xcor - size / 2) / x-speed\n      if right-interval > 0\n        [ assign-colliding-wall right-interval \"right wall\" ]\n      ;; solve for time it will take particle to reach left wall\n      let left-interval ((- box-edge) + 0.5 - xcor + size / 2) / x-speed\n      if left-interval > 0\n        [ assign-colliding-wall left-interval \"left wall\" ] ]\n  ;; top & bottom walls\n  let y-speed (speed * dy)\n  if y-speed != 0\n    [ ;; solve for time it will take particle to reach top wall\n      let top-interval (box-edge - 0.5 - ycor - size / 2) / y-speed\n      if top-interval > 0\n        [ assign-colliding-wall top-interval \"top wall\" ]\n      ;; solve for time it will take particle to reach bottom wall\n      let bottom-interval ((- box-edge) + 0.5 - ycor + size / 2) / y-speed\n      if bottom-interval > 0\n        [ assign-colliding-wall bottom-interval \"bottom wall\" ] ]\nend\n\n\nto assign-colliding-wall [time-to-collision wall]  ;; particle procedure\n  ;; this procedure is used by the check-for-wall-collision procedure\n  ;; to assemble the correct particle-wall pair\n  ;; time-to-collision is relative (ie, a collision will occur one second from now)\n  ;; We need to store the absolute time (ie, a collision will occur at time 48.5 seconds.\n  ;; So, we add clock to time-to-collision when we store it.\n  let colliding-pair (list (time-to-collision + ticks) self wall)\n  set collisions fput colliding-pair collisions\nend\n\nto choose-next-collision\n  if collisions = [] [ stop ]\n  ;; Sort the list of projected collisions between all the particles into an ordered list.\n  ;; Take the smallest time-step from the list (which represents the next collision that will\n  ;; happen in time).  Use this time step as the tick-delta for all the particles to move through\n  let winner first collisions\n  foreach collisions [ the-collision ->\n    if first the-collision < first winner [ set winner the-collision ]\n  ]\n  ;; winner is now the collision that will occur next\n  let dt item 0 winner\n  ;; If the next collision is more than 1 in the future,\n  ;; only advance the simulation one tick, for smoother animation.\n  set tick-delta dt - ticks\n  if tick-delta > 1\n    [ set tick-delta 1\n      set particle1 nobody\n      set particle2 nobody\n      stop ]\n  set particle1 item 1 winner\n  set particle2 item 2 winner\nend\n\n\nto perform-next-collision\n  ;; deal with 3 possible cases:\n  ;; 1) no collision at all\n  if particle1 = nobody [ stop ]\n  ;; 2) particle meets wall\n  if is-string? particle2\n    [ if particle2 = \"left wall\" or particle2 = \"right wall\"\n        [ ask particle1 [ set heading (- heading) ]\n          stop ]\n      if particle2 = \"top wall\" or particle2 = \"bottom wall\"\n        [ ask particle1 [ set heading 180 - heading ]\n          stop ] ]\n  ;; 3) particle meets particle\n  ask particle1 [ collide-with particle2 ]\nend\n\n\nto collide-with [other-particle]  ;; particle procedure\n  ;;; PHASE 1: initial setup\n  ;; for convenience, grab some quantities from other-particle\n  let mass2 [mass] of other-particle\n  let speed2 [speed] of other-particle\n  let heading2 [heading] of other-particle\n  ;; modified so that theta is heading toward other particle\n  let theta towards other-particle\n\n  ;;; PHASE 2: convert velocities to theta-based vector representation\n  ;; now convert my velocity from speed/heading representation to components\n  ;; along theta and perpendicular to theta\n  let v1t (speed * cos (theta - heading))\n  let v1l (speed * sin (theta - heading))\n  ;; do the same for other-particle\n  let v2t (speed2 * cos (theta - heading2))\n  let v2l (speed2 * sin (theta - heading2))\n\n  ;;; PHASE 3: manipulate vectors to implement collision\n  ;; compute the velocity of the system\'s center of mass along theta\n  let vcm (((mass * v1t) + (mass2 * v2t)) / (mass + mass2) )\n  ;; now compute the new velocity for each particle along direction theta.\n  ;; velocity perpendicular to theta is unaffected by a collision along theta,\n  ;; so the next two lines actually implement the collision itself, in the\n  ;; sense that the effects of the collision are exactly the following changes\n  ;; in particle velocity.\n  set v1t (2 * vcm - v1t)\n  set v2t (2 * vcm - v2t)\n\n  ;;; PHASE 4: convert back to normal speed/heading\n  ;; now convert my velocity vector into my new speed and heading\n  set speed sqrt ((v1t * v1t) + (v1l * v1l))\n  ;; if the magnitude of the velocity vector is 0, atan is undefined. but\n  ;; speed will be 0, so heading is irrelevant anyway. therefore, in that\n  ;; case we\'ll just leave it unmodified.\n  set energy kinetic-energy\n\n  if v1l != 0 or v1t != 0\n    [ set heading (theta - (atan v1l v1t)) ]\n  ;; and do the same for other-particle\n  ask other-particle [\n    set speed sqrt ((v2t ^ 2) + (v2l ^ 2))\n    set energy kinetic-energy\n\n    if v2l != 0 or v2t != 0\n      [ set heading (theta - (atan v2l v2t)) ]\n  ]\n\n  ;; PHASE 5: recolor\n  ;; since color is based on quantities that may have changed\n  recolor\n  ask other-particle [ recolor ]\nend\n\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;; particle coloring procedures ;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto recolor ;; particle procedure\n  ;;let avg-speed 1\n  ;; avg-speed is assumed to be 0.5, since particles are assigned a random speed between 0 and 1\n  ;; particle coloring procedures for visualizing speed with a color palette,\n  ;; red are fast particles, blue slow, and green in between.\n  ifelse speed < (0.5 * avg-speed) ;; at lower than 50% the average speed\n    [ set color blue ]      ;; slow particles colored blue\n    [ ifelse speed > (1.5 * avg-speed) ;; above 50% higher the average speed\n        [ set color red ]        ;; fast particles colored red\n        [ set color green ] ]    ;; medium speed particles colored green\nend\n\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;; time reversal procedure  ;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n;; Here\'s a procedure that demonstrates time-reversing the model.\n;; You can run it from the command center.  When it finishes,\n;; the final particle positions may be slightly different because\n;; the amount of time that passes after the reversal might not\n;; be exactly the same as the amount that passed before; this\n;; doesn\'t indicate a bug in the model.\n;; For larger values of n, you will start to notice larger\n;; discrepancies, eventually causing the behavior of the system\n;; to diverge totally. Unless the model has some bug we don\'t know\n;; about, this is due to accumulating tiny inaccuracies in the\n;; floating point calculations.  Once these inaccuracies accumulate\n;; to the point that a collision is missed or an extra collision\n;; happens, after that the reversed model will diverge rapidly.\nto test-time-reversal [n]\n  setup\n  ask particles [ stamp ]\n  while [ticks < n] [ go ]\n  let old-ticks ticks\n  reverse-time\n  while [ticks < 2 * old-ticks] [ go ]\n  ask particles [ set color white ]\nend\n\nto reverse-time\n  ask particles [ rt 180 ]\n  set collisions []\n  ask particles [ check-for-wall-collision ]\n  ask particles [ check-for-particle-collision ]\n  ;; the last collision that happened before the model was paused\n  ;; (if the model was paused immediately after a collision)\n  ;; won\'t happen again after time is reversed because of the\n  ;; \"don\'t do the same collision twice in a row\" rule.  We could\n  ;; try to fool that rule by setting particle1 and\n  ;; particle2 to nobody, but that might not always work,\n  ;; because the vagaries of floating point math means that the\n  ;; collision might be calculated to be slightly in the past\n  ;; (the past that used to be the future!) and be skipped.\n  ;; So to be sure, we force the collision to happen:\n  perform-next-collision\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;; reporters ;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto-report init-particle-speed\n  report 1\nend\n\nto-report max-particle-mass\n  report max [mass] of particles\nend\n\nto-report kinetic-energy\n   report (0.5 * mass * speed * speed)\nend\n\nto draw-vert-line [ xval ]\n  plotxy xval plot-y-min\n  plot-pen-down\n  plotxy xval plot-y-max\n  plot-pen-up\nend\n\n\n; Copyright 2005 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":272,"top":10,"right":685,"bottom":424,"dimensions":{"minPxcor":-40,"maxPxcor":40,"minPycor":-40,"maxPycor":40,"patchSize":5,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":20,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":4,"top":10,"right":97,"bottom":43,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"250","compiledStep":"1","variable":"initial-number-particles","left":0,"top":45,"right":190,"bottom":78,"display":"initial-number-particles","min":"1","max":"250","default":60,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":98,"top":10,"right":188,"bottom":43,"display":"go/pause","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"10","compiledStep":"0.5","variable":"largest-particle-size","left":0,"top":120,"right":190,"bottom":153,"display":"largest-particle-size","min":"1","max":"10","default":6,"step":"0.5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"5","compiledStep":"0.5","variable":"smallest-particle-size","left":0,"top":84,"right":190,"bottom":117,"display":"smallest-particle-size","min":"1","max":"5","default":2,"step":"0.5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"avg-speed\")","source":"avg-speed","left":5,"top":155,"right":101,"bottom":200,"display":"average speed","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Counts', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setYRange(0, 100);\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Counts', 'fast')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-fast\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"fast","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-fast","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Counts', 'medium')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-medium\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"medium","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-medium","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Counts', 'slow')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-slow\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"slow","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-slow","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed Counts","left":5,"top":250,"right":268,"bottom":445,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-y-range 0 100","updateCode":"","pens":[{"display":"fast","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-fast","type":"pen"},{"display":"medium","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-medium","type":"pen"},{"display":"slow","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-slow","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Histogram', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setXRange(0, NLMath.ceil((procedures[\"INIT-PARTICLE-SPEED\"]() * 2)));\n        plotManager.setYRange(0, NLMath.ceil(Prims.div(world.turtleManager.turtlesOfBreed(\"PARTICLES\").size(), 6)));\n        plotManager.setCurrentPen(\"medium\");\n        plotManager.setHistogramBarCount(40);\n        plotManager.setCurrentPen(\"slow\");\n        plotManager.setHistogramBarCount(40);\n        plotManager.setCurrentPen(\"fast\");\n        plotManager.setHistogramBarCount(40);\n        plotManager.setCurrentPen(\"init-avg-speed\");\n        let _maybestop_337_351 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"init-avg-speed\"));\n        if (_maybestop_337_351 instanceof Exception.StopInterrupt) { return _maybestop_337_351; }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 15); }).projectionBy(function() { return SelfManager.self().getVariable(\"speed\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"fast","interval":1,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = red]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 55); }).projectionBy(function() { return SelfManager.self().getVariable(\"speed\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"medium","interval":1,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = green]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 105); }).projectionBy(function() { return SelfManager.self().getVariable(\"speed\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"slow","interval":1,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = blue]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Speed Histogram', 'avg-speed')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.resetPen();\n        let _maybestop_50_64 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"avg-speed\"));\n        if (_maybestop_50_64 instanceof Exception.StopInterrupt) { return _maybestop_50_64; }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"avg-speed","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-speed","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"init-avg-speed","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed Histogram","left":6,"top":449,"right":340,"bottom":604,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-x-range 0 ceiling (init-particle-speed * 2)\nset-plot-y-range 0 ceiling (count particles / 6)\nset-current-plot-pen \"medium\"\nset-histogram-num-bars 40\nset-current-plot-pen \"slow\"\nset-histogram-num-bars 40\nset-current-plot-pen \"fast\"\nset-histogram-num-bars 40\nset-current-plot-pen \"init-avg-speed\"\ndraw-vert-line init-avg-speed","updateCode":"","pens":[{"display":"fast","interval":1,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = red]","type":"pen"},{"display":"medium","interval":1,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = green]","type":"pen"},{"display":"slow","interval":1,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = blue]","type":"pen"},{"display":"avg-speed","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-speed","type":"pen"},{"display":"init-avg-speed","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Energy Histogram', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setXRange(0, NLMath.ceil((((0.5 * (procedures[\"INIT-PARTICLE-SPEED\"]() * 2)) * (procedures[\"INIT-PARTICLE-SPEED\"]() * 2)) * procedures[\"MAX-PARTICLE-MASS\"]())));\n        plotManager.setYRange(0, NLMath.ceil(Prims.div(world.turtleManager.turtlesOfBreed(\"PARTICLES\").size(), 6)));\n        plotManager.setCurrentPen(\"particles\");\n        plotManager.setHistogramBarCount(40);\n        plotManager.setCurrentPen(\"init-avg-energy\");\n        let _maybestop_290_304 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"init-avg-energy\"));\n        if (_maybestop_290_304 instanceof Exception.StopInterrupt) { return _maybestop_290_304; }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Energy Histogram', 'particles')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed(\"PARTICLES\").projectionBy(function() { return SelfManager.self().getVariable(\"energy\"); }));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"particles","interval":1,"mode":1,"color":-11053225,"inLegend":true,"setupCode":"","updateCode":"histogram [energy] of particles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Energy Histogram', 'avg-energy')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.resetPen();\n        let _maybestop_50_64 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"avg-energy\"));\n        if (_maybestop_50_64 instanceof Exception.StopInterrupt) { return _maybestop_50_64; }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"avg-energy","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-energy","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"init-avg-energy","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Energy Histogram","left":343,"top":449,"right":687,"bottom":604,"xmin":0,"xmax":200,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-x-range 0 ceiling (0.5 * (init-particle-speed * 2) * (init-particle-speed * 2) * max-particle-mass)\nset-plot-y-range 0 ceiling (count particles / 6)\n\nset-current-plot-pen \"particles\"\nset-histogram-num-bars 40\nset-current-plot-pen \"init-avg-energy\"\ndraw-vert-line init-avg-energy","updateCode":"","pens":[{"display":"particles","interval":1,"mode":1,"color":-11053225,"inLegend":true,"setupCode":"","updateCode":"histogram [energy] of particles","type":"pen"},{"display":"avg-energy","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-energy","type":"pen"},{"display":"init-avg-energy","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"avg-energy\")","source":"avg-energy","left":102,"top":154,"right":205,"bottom":199,"display":"average-energy","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-fast\")","source":"percent-fast","left":5,"top":205,"right":82,"bottom":250,"display":"% fast","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-medium\")","source":"percent-medium","left":85,"top":205,"right":181,"bottom":250,"display":"% medium","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-slow\")","source":"percent-slow","left":185,"top":205,"right":268,"bottom":250,"display":"% slow","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["initial-number-particles", "largest-particle-size", "smallest-particle-size", "tick-delta", "box-edge", "collisions", "particle1", "particle2", "init-avg-speed", "init-avg-energy", "avg-speed", "avg-energy", "fast", "medium", "slow", "percent-slow", "percent-medium", "percent-fast"], ["initial-number-particles", "largest-particle-size", "smallest-particle-size"], [], -40, 40, -40, 40, 5.0, false, false, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
var InspectionPrims = workspace.inspectionPrims;
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
      world.observer.setGlobal("box-edge", (world.topology.maxPxcor - 1));
      world.patches().agentFilter(function() {
        return (((Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge")) || Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge")));
      }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
      world.observer.setGlobal("avg-speed", 1);
      procedures["MAKE-PARTICLES"]();
      world.observer.setGlobal("particle1", Nobody);
      world.observer.setGlobal("particle2", Nobody);
      world.ticker.reset();
      world.observer.setGlobal("collisions", []);
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      procedures["UPDATE-VARIABLES"]();
      world.observer.setGlobal("init-avg-speed", world.observer.getGlobal("avg-speed"));
      world.observer.setGlobal("init-avg-energy", world.observer.getGlobal("avg-energy"));
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
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-number-particles"), "PARTICLES").ask(function() {
        SelfManager.self().setVariable("speed", 1);
        SelfManager.self().setVariable("size", (world.observer.getGlobal("smallest-particle-size") + Prims.randomFloat((world.observer.getGlobal("largest-particle-size") - world.observer.getGlobal("smallest-particle-size")))));
        SelfManager.self().setVariable("mass", (SelfManager.self().getVariable("size") * SelfManager.self().getVariable("size")));
        SelfManager.self().setVariable("energy", procedures["KINETIC-ENERGY"]());
        procedures["RECOLOR"]();
      }, true);
      var _foreach_1856_1863 = Tasks.forEach(Tasks.commandTask(function(theParticle) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        theParticle.ask(function() {
          procedures["POSITION-RANDOMLY"]();
          while (procedures["OVERLAPPING?"]()) {
            procedures["POSITION-RANDOMLY"]();
          }
        }, true);
      }, "[ the-particle -> ask the-particle [ position-randomly while [ overlapping? ] [ position-randomly ] ] ]"), ListPrims.sortBy(Tasks.reporterTask(function(a, b) {
        if (arguments.length < 2) {
          throw new Error("anonymous procedure expected 2 inputs, but only got " + arguments.length);
        }
        return Prims.gt(a.projectionBy(function() { return SelfManager.self().getVariable("size"); }), b.projectionBy(function() { return SelfManager.self().getVariable("size"); }));
      }, "[ [a b] -> [ size ] of a > [ size ] of b ]"), world.turtleManager.turtlesOfBreed("PARTICLES"))); if(reporterContext && _foreach_1856_1863 !== undefined) { return _foreach_1856_1863; }
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
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("PARTICLES"), Prims.div((SelfManager.self().getVariable("size") + world.observer.getGlobal("largest-particle-size")), 2))._optimalAnyOtherWith(function() {
        return Prims.lt(SelfManager.self().distance(SelfManager.myself()), Prims.div((SelfManager.self().getVariable("size") + SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("size"); })), 2));
      })
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
  procs["overlapping_p"] = temp;
  procs["OVERLAPPING?"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setXY((ListPrims.oneOf([1, -1]) * Prims.randomFloat(((world.observer.getGlobal("box-edge") - 0.5) - Prims.div(SelfManager.self().getVariable("size"), 2)))), (ListPrims.oneOf([1, -1]) * Prims.randomFloat(((world.observer.getGlobal("box-edge") - 0.5) - Prims.div(SelfManager.self().getVariable("size"), 2)))));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["positionRandomly"] = temp;
  procs["POSITION-RANDOMLY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["CHOOSE-NEXT-COLLISION"]();
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() {
        SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-delta")));
      }, true);
      procedures["PERFORM-NEXT-COLLISION"]();
      world.ticker.tickAdvance(world.observer.getGlobal("tick-delta"));
      procedures["RECALCULATE-PARTICLES-THAT-JUST-COLLIDED"]();
      if (Prims.gt(NLMath.floor(world.ticker.tickCount()), NLMath.floor((world.ticker.tickCount() - world.observer.getGlobal("tick-delta"))))) {
        procedures["UPDATE-VARIABLES"]();
        plotManager.updatePlots();
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
      if (NLType(world.observer.getGlobal("particle2")).isValidTurtle()) {
        world.observer.setGlobal("collisions", world.observer.getGlobal("collisions").filter(Tasks.reporterTask(function(theCollision) {
          if (arguments.length < 1) {
            throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
          }
          return (((!Prims.equality(ListPrims.item(1, theCollision), world.observer.getGlobal("particle1")) && !Prims.equality(ListPrims.item(2, theCollision), world.observer.getGlobal("particle1"))) && !Prims.equality(ListPrims.item(1, theCollision), world.observer.getGlobal("particle2"))) && !Prims.equality(ListPrims.item(2, theCollision), world.observer.getGlobal("particle2")));
        }, "[ the-collision -> item 1 the-collision != particle1 and item 2 the-collision != particle1 and item 1 the-collision != particle2 and item 2 the-collision != particle2 ]")));
        world.observer.getGlobal("particle2").ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
        world.observer.getGlobal("particle2").ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      }
      else {
        world.observer.setGlobal("collisions", world.observer.getGlobal("collisions").filter(Tasks.reporterTask(function(theCollision) {
          if (arguments.length < 1) {
            throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
          }
          return (!Prims.equality(ListPrims.item(1, theCollision), world.observer.getGlobal("particle1")) && !Prims.equality(ListPrims.item(2, theCollision), world.observer.getGlobal("particle1")));
        }, "[ the-collision -> item 1 the-collision != particle1 and item 2 the-collision != particle1 ]")));
      }
      if (!Prims.equality(world.observer.getGlobal("particle1"), Nobody)) {
        world.observer.getGlobal("particle1").ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      }
      if (!Prims.equality(world.observer.getGlobal("particle1"), Nobody)) {
        world.observer.getGlobal("particle1").ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      }
      world.observer.setGlobal("collisions", world.observer.getGlobal("collisions").filter(Tasks.reporterTask(function(theCollision) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        return (!Prims.equality(ListPrims.item(1, theCollision), world.observer.getGlobal("particle1")) || !Prims.equality(ListPrims.item(2, theCollision), world.observer.getGlobal("particle2")));
      }, "[ the-collision -> item 1 the-collision != particle1 or item 2 the-collision != particle2 ]")));
      world.observer.setGlobal("particle1", Nobody);
      world.observer.setGlobal("particle2", Nobody);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["recalculateParticlesThatJustCollided"] = temp;
  procs["RECALCULATE-PARTICLES-THAT-JUST-COLLIDED"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let myX = SelfManager.self().getVariable("xcor"); letVars['myX'] = myX;
      let myY = SelfManager.self().getVariable("ycor"); letVars['myY'] = myY;
      let myParticleSize = SelfManager.self().getVariable("size"); letVars['myParticleSize'] = myParticleSize;
      let myXSpeed = (SelfManager.self().getVariable("speed") * SelfManager.self().dx()); letVars['myXSpeed'] = myXSpeed;
      let myYSpeed = (SelfManager.self().getVariable("speed") * SelfManager.self().dy()); letVars['myYSpeed'] = myYSpeed;
      SelfPrims.other(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() {
        let dpx = (SelfManager.self().getVariable("xcor") - myX); letVars['dpx'] = dpx;
        let dpy = (SelfManager.self().getVariable("ycor") - myY); letVars['dpy'] = dpy;
        let xSpeed = (SelfManager.self().getVariable("speed") * SelfManager.self().dx()); letVars['xSpeed'] = xSpeed;
        let ySpeed = (SelfManager.self().getVariable("speed") * SelfManager.self().dy()); letVars['ySpeed'] = ySpeed;
        let dvx = (xSpeed - myXSpeed); letVars['dvx'] = dvx;
        let dvy = (ySpeed - myYSpeed); letVars['dvy'] = dvy;
        let sumR = (Prims.div(myParticleSize, 2) + Prims.div(SelfManager.self().projectionBy(function() { return SelfManager.self().getVariable("size"); }), 2)); letVars['sumR'] = sumR;
        let pSquared = (((dpx * dpx) + (dpy * dpy)) - NLMath.pow(sumR, 2)); letVars['pSquared'] = pSquared;
        let pv = (2 * ((dpx * dvx) + (dpy * dvy))); letVars['pv'] = pv;
        let vSquared = ((dvx * dvx) + (dvy * dvy)); letVars['vSquared'] = vSquared;
        let d1 = (NLMath.pow(pv, 2) - ((4 * vSquared) * pSquared)); letVars['d1'] = d1;
        let timeToCollision = -1; letVars['timeToCollision'] = timeToCollision;
        if (Prims.gt(d1, 0)) {
          timeToCollision = Prims.div(( -pv - NLMath.sqrt(d1)), (2 * vSquared)); letVars['timeToCollision'] = timeToCollision;
        }
        if (Prims.gt(timeToCollision, 0)) {
          world.observer.setGlobal("collisions", ListPrims.fput(ListPrims.list((timeToCollision + world.ticker.tickCount()), SelfManager.self(), SelfManager.myself()), world.observer.getGlobal("collisions")));
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
  procs["checkForParticleCollision"] = temp;
  procs["CHECK-FOR-PARTICLE-COLLISION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let xSpeed = (SelfManager.self().getVariable("speed") * SelfManager.self().dx()); letVars['xSpeed'] = xSpeed;
      if (!Prims.equality(xSpeed, 0)) {
        let rightInterval = Prims.div((((world.observer.getGlobal("box-edge") - 0.5) - SelfManager.self().getVariable("xcor")) - Prims.div(SelfManager.self().getVariable("size"), 2)), xSpeed); letVars['rightInterval'] = rightInterval;
        if (Prims.gt(rightInterval, 0)) {
          procedures["ASSIGN-COLLIDING-WALL"](rightInterval,"right wall");
        }
        let leftInterval = Prims.div(((( -world.observer.getGlobal("box-edge") + 0.5) - SelfManager.self().getVariable("xcor")) + Prims.div(SelfManager.self().getVariable("size"), 2)), xSpeed); letVars['leftInterval'] = leftInterval;
        if (Prims.gt(leftInterval, 0)) {
          procedures["ASSIGN-COLLIDING-WALL"](leftInterval,"left wall");
        }
      }
      let ySpeed = (SelfManager.self().getVariable("speed") * SelfManager.self().dy()); letVars['ySpeed'] = ySpeed;
      if (!Prims.equality(ySpeed, 0)) {
        let topInterval = Prims.div((((world.observer.getGlobal("box-edge") - 0.5) - SelfManager.self().getVariable("ycor")) - Prims.div(SelfManager.self().getVariable("size"), 2)), ySpeed); letVars['topInterval'] = topInterval;
        if (Prims.gt(topInterval, 0)) {
          procedures["ASSIGN-COLLIDING-WALL"](topInterval,"top wall");
        }
        let bottomInterval = Prims.div(((( -world.observer.getGlobal("box-edge") + 0.5) - SelfManager.self().getVariable("ycor")) + Prims.div(SelfManager.self().getVariable("size"), 2)), ySpeed); letVars['bottomInterval'] = bottomInterval;
        if (Prims.gt(bottomInterval, 0)) {
          procedures["ASSIGN-COLLIDING-WALL"](bottomInterval,"bottom wall");
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
  procs["checkForWallCollision"] = temp;
  procs["CHECK-FOR-WALL-COLLISION"] = temp;
  temp = (function(timeToCollision, wall) {
    try {
      var reporterContext = false;
      var letVars = { };
      let collidingPair = ListPrims.list((timeToCollision + world.ticker.tickCount()), SelfManager.self(), wall); letVars['collidingPair'] = collidingPair;
      world.observer.setGlobal("collisions", ListPrims.fput(collidingPair, world.observer.getGlobal("collisions")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["assignCollidingWall"] = temp;
  procs["ASSIGN-COLLIDING-WALL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("collisions"), [])) {
        throw new Exception.StopInterrupt;
      }
      let winner = ListPrims.first(world.observer.getGlobal("collisions")); letVars['winner'] = winner;
      var _foreach_13599_13606 = Tasks.forEach(Tasks.commandTask(function(theCollision) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        if (Prims.lt(ListPrims.first(theCollision), ListPrims.first(winner))) {
          winner = theCollision; letVars['winner'] = winner;
        }
      }, "[ the-collision -> if first the-collision < first winner [ set winner the-collision ] ]"), world.observer.getGlobal("collisions")); if(reporterContext && _foreach_13599_13606 !== undefined) { return _foreach_13599_13606; }
      let dt = ListPrims.item(0, winner); letVars['dt'] = dt;
      world.observer.setGlobal("tick-delta", (dt - world.ticker.tickCount()));
      if (Prims.gt(world.observer.getGlobal("tick-delta"), 1)) {
        world.observer.setGlobal("tick-delta", 1);
        world.observer.setGlobal("particle1", Nobody);
        world.observer.setGlobal("particle2", Nobody);
        throw new Exception.StopInterrupt;
      }
      world.observer.setGlobal("particle1", ListPrims.item(1, winner));
      world.observer.setGlobal("particle2", ListPrims.item(2, winner));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["chooseNextCollision"] = temp;
  procs["CHOOSE-NEXT-COLLISION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("particle1"), Nobody)) {
        throw new Exception.StopInterrupt;
      }
      if (NLType(world.observer.getGlobal("particle2")).isString()) {
        if ((Prims.equality(world.observer.getGlobal("particle2"), "left wall") || Prims.equality(world.observer.getGlobal("particle2"), "right wall"))) {
          world.observer.getGlobal("particle1").ask(function() { SelfManager.self().setVariable("heading",  -SelfManager.self().getVariable("heading")); }, true);
          throw new Exception.StopInterrupt;
        }
        if ((Prims.equality(world.observer.getGlobal("particle2"), "top wall") || Prims.equality(world.observer.getGlobal("particle2"), "bottom wall"))) {
          world.observer.getGlobal("particle1").ask(function() { SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading"))); }, true);
          throw new Exception.StopInterrupt;
        }
      }
      world.observer.getGlobal("particle1").ask(function() { procedures["COLLIDE-WITH"](world.observer.getGlobal("particle2")); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["performNextCollision"] = temp;
  procs["PERFORM-NEXT-COLLISION"] = temp;
  temp = (function(otherParticle) {
    try {
      var reporterContext = false;
      var letVars = { };
      let mass2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("mass"); }); letVars['mass2'] = mass2;
      let speed2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("speed"); }); letVars['speed2'] = speed2;
      let heading2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("heading"); }); letVars['heading2'] = heading2;
      let theta = SelfManager.self().towards(otherParticle); letVars['theta'] = theta;
      let v1t = (SelfManager.self().getVariable("speed") * NLMath.cos((theta - SelfManager.self().getVariable("heading")))); letVars['v1t'] = v1t;
      let v1l = (SelfManager.self().getVariable("speed") * NLMath.sin((theta - SelfManager.self().getVariable("heading")))); letVars['v1l'] = v1l;
      let v2t = (speed2 * NLMath.cos((theta - heading2))); letVars['v2t'] = v2t;
      let v2l = (speed2 * NLMath.sin((theta - heading2))); letVars['v2l'] = v2l;
      let vcm = Prims.div(((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)), (SelfManager.self().getVariable("mass") + mass2)); letVars['vcm'] = vcm;
      v1t = ((2 * vcm) - v1t); letVars['v1t'] = v1t;
      v2t = ((2 * vcm) - v2t); letVars['v2t'] = v2t;
      SelfManager.self().setVariable("speed", NLMath.sqrt(((v1t * v1t) + (v1l * v1l))));
      SelfManager.self().setVariable("energy", procedures["KINETIC-ENERGY"]());
      if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
        SelfManager.self().setVariable("heading", (theta - NLMath.atan(v1l, v1t)));
      }
      otherParticle.ask(function() {
        SelfManager.self().setVariable("speed", NLMath.sqrt((NLMath.pow(v2t, 2) + NLMath.pow(v2l, 2))));
        SelfManager.self().setVariable("energy", procedures["KINETIC-ENERGY"]());
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
      if (Prims.lt(SelfManager.self().getVariable("speed"), (0.5 * world.observer.getGlobal("avg-speed")))) {
        SelfManager.self().setVariable("color", 105);
      }
      else {
        if (Prims.gt(SelfManager.self().getVariable("speed"), (1.5 * world.observer.getGlobal("avg-speed")))) {
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
  temp = (function(n) {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SETUP"]();
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { SelfManager.self().stamp(); }, true);
      while (Prims.lt(world.ticker.tickCount(), n)) {
        procedures["GO"]();
      }
      let oldTicks = world.ticker.tickCount(); letVars['oldTicks'] = oldTicks;
      procedures["REVERSE-TIME"]();
      while (Prims.lt(world.ticker.tickCount(), (2 * oldTicks))) {
        procedures["GO"]();
      }
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { SelfManager.self().setVariable("color", 9.9); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["testTimeReversal"] = temp;
  procs["TEST-TIME-REVERSAL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { SelfManager.self().right(180); }, true);
      world.observer.setGlobal("collisions", []);
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      world.turtleManager.turtlesOfBreed("PARTICLES").ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      procedures["PERFORM-NEXT-COLLISION"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["reverseTime"] = temp;
  procs["REVERSE-TIME"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return 1
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
  procs["initParticleSpeed"] = temp;
  procs["INIT-PARTICLE-SPEED"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return ListPrims.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("mass"); }))
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
  procs["maxParticleMass"] = temp;
  procs["MAX-PARTICLE-MASS"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return (((0.5 * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed")) * SelfManager.self().getVariable("speed"))
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
  procs["kineticEnergy"] = temp;
  procs["KINETIC-ENERGY"] = temp;
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
world.observer.setGlobal("initial-number-particles", 60);
world.observer.setGlobal("largest-particle-size", 6);
world.observer.setGlobal("smallest-particle-size", 2);
