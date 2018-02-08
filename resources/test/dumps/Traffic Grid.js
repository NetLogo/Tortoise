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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"ycors":[15,21,39,60,74,87,97,115,141,165,225,285,285,285,15,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":30,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[80,78,135,135,105,96,89],"ycors":[138,168,166,91,106,111,120],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":47,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
modelConfig.plots = [(function() {
  var name    = 'Average Wait Time of Cars';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average Wait Time of Cars', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(ListPrims.mean(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("wait-time"); })));
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
  return new Plot(name, pens, plotOps, "Time", "Average Wait", false, true, 0.0, 100.0, 0.0, 5.0, setup, update);
})(), (function() {
  var name    = 'Average Speed of Cars';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average Speed of Cars', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(ListPrims.mean(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("speed"); })));
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
      return plotManager.withTemporaryContext('Average Speed of Cars', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, world.observer.getGlobal("speed-limit"));
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
  return new Plot(name, pens, plotOps, "Time", "Average Speed", false, true, 0.0, 100.0, 0.0, 1.0, setup, update);
})(), (function() {
  var name    = 'Stopped Cars';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Stopped Cars', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.observer.getGlobal("num-cars-stopped"));
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
      return plotManager.withTemporaryContext('Stopped Cars', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, world.observer.getGlobal("num-cars"));
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
  return new Plot(name, pens, plotOps, "Time", "Stopped Cars", false, true, 0.0, 100.0, 0.0, 100.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["speed", "up-car?", "wait-time"], [])('globals\n[\n  grid-x-inc               ;; the amount of patches in between two roads in the x direction\n  grid-y-inc               ;; the amount of patches in between two roads in the y direction\n  acceleration             ;; the constant that controls how much a car speeds up or slows down by if\n                           ;; it is to accelerate or decelerate\n  phase                    ;; keeps track of the phase\n  num-cars-stopped         ;; the number of cars that are stopped during a single pass thru the go procedure\n  current-light            ;; the currently selected light\n\n  ;; patch agentsets\n  intersections ;; agentset containing the patches that are intersections\n  roads         ;; agentset containing the patches that are roads\n]\n\nturtles-own\n[\n  speed     ;; the speed of the turtle\n  up-car?   ;; true if the turtle moves downwards and false if it moves to the right\n  wait-time ;; the amount of time since the last time a turtle has moved\n]\n\npatches-own\n[\n  intersection?   ;; true if the patch is at the intersection of two roads\n  green-light-up? ;; true if the green light is above the intersection.  otherwise, false.\n                  ;; false for a non-intersection patches.\n  my-row          ;; the row of the intersection counting from the upper left corner of the\n                  ;; world.  -1 for non-intersection patches.\n  my-column       ;; the column of the intersection counting from the upper left corner of the\n                  ;; world.  -1 for non-intersection patches.\n  my-phase        ;; the phase for the intersection.  -1 for non-intersection patches.\n  auto?           ;; whether or not this intersection will switch automatically.\n                  ;; false for non-intersection patches.\n]\n\n\n;;;;;;;;;;;;;;;;;;;;;;\n;; Setup Procedures ;;\n;;;;;;;;;;;;;;;;;;;;;;\n\n;; Initialize the display by giving the global and patch variables initial values.\n;; Create num-cars of turtles if there are enough road patches for one turtle to\n;; be created per road patch. Set up the plots.\nto setup\n  clear-all\n  setup-globals\n\n  ;; First we ask the patches to draw themselves and set up a few variables\n  setup-patches\n  make-current one-of intersections\n  label-current\n\n  set-default-shape turtles \"car\"\n\n  if (num-cars > count roads)\n  [\n    user-message (word \"There are too many cars for the amount of \"\n                       \"road.  Either increase the amount of roads \"\n                       \"by increasing the GRID-SIZE-X or \"\n                       \"GRID-SIZE-Y sliders, or decrease the \"\n                       \"number of cars by lowering the NUMBER slider.\\n\"\n                       \"The setup has stopped.\")\n    stop\n  ]\n\n  ;; Now create the turtles and have each created turtle call the functions setup-cars and set-car-color\n  create-turtles num-cars\n  [\n    setup-cars\n    set-car-color\n    record-data\n  ]\n\n  ;; give the turtles an initial speed\n  ask turtles [ set-car-speed ]\n\n  reset-ticks\nend\n\n;; Initialize the global variables to appropriate values\nto setup-globals\n  set current-light nobody ;; just for now, since there are no lights yet\n  set phase 0\n  set num-cars-stopped 0\n  set grid-x-inc world-width / grid-size-x\n  set grid-y-inc world-height / grid-size-y\n\n  ;; don\'t make acceleration 0.1 since we could get a rounding error and end up on a patch boundary\n  set acceleration 0.099\nend\n\n;; Make the patches have appropriate colors, set up the roads and intersections agentsets,\n;; and initialize the traffic lights to one setting\nto setup-patches\n  ;; initialize the patch-owned variables and color the patches to a base-color\n  ask patches\n  [\n    set intersection? false\n    set auto? false\n    set green-light-up? true\n    set my-row -1\n    set my-column -1\n    set my-phase -1\n    set pcolor brown + 3\n  ]\n\n  ;; initialize the global variables that hold patch agentsets\n  set roads patches with\n    [(floor((pxcor + max-pxcor - floor(grid-x-inc - 1)) mod grid-x-inc) = 0) or\n    (floor((pycor + max-pycor) mod grid-y-inc) = 0)]\n  set intersections roads with\n    [(floor((pxcor + max-pxcor - floor(grid-x-inc - 1)) mod grid-x-inc) = 0) and\n    (floor((pycor + max-pycor) mod grid-y-inc) = 0)]\n\n  ask roads [ set pcolor white ]\n  setup-intersections\nend\n\n;; Give the intersections appropriate values for the intersection?, my-row, and my-column\n;; patch variables.  Make all the traffic lights start off so that the lights are red\n;; horizontally and green vertically.\nto setup-intersections\n  ask intersections\n  [\n    set intersection? true\n    set green-light-up? true\n    set my-phase 0\n    set auto? true\n    set my-row floor((pycor + max-pycor) / grid-y-inc)\n    set my-column floor((pxcor + max-pxcor) / grid-x-inc)\n    set-signal-colors\n  ]\nend\n\n;; Initialize the turtle variables to appropriate values and place the turtle on an empty road patch.\nto setup-cars  ;; turtle procedure\n  set speed 0\n  set wait-time 0\n  put-on-empty-road\n  ifelse intersection?\n  [\n    ifelse random 2 = 0\n    [ set up-car? true ]\n    [ set up-car? false ]\n  ]\n  [\n    ; if the turtle is on a vertical road (rather than a horizontal one)\n    ifelse (floor((pxcor + max-pxcor - floor(grid-x-inc - 1)) mod grid-x-inc) = 0)\n    [ set up-car? true ]\n    [ set up-car? false ]\n  ]\n  ifelse up-car?\n  [ set heading 180 ]\n  [ set heading 90 ]\nend\n\n;; Find a road patch without any turtles on it and place the turtle there.\nto put-on-empty-road  ;; turtle procedure\n  move-to one-of roads with [not any? turtles-on self]\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;\n;; Runtime Procedures ;;\n;;;;;;;;;;;;;;;;;;;;;;;;\n\n;; Run the simulation\nto go\n\n  update-current\n\n  ;; have the intersections change their color\n  set-signals\n  set num-cars-stopped 0\n\n  ;; set the turtles speed for this time thru the procedure, move them forward their speed,\n  ;; record data for plotting, and set the color of the turtles to an appropriate color\n  ;; based on their speed\n  ask turtles [\n    set-car-speed\n    fd speed\n    record-data\n    set-car-color\n  ]\n\n  ;; update the phase and the global clock\n  next-phase\n  tick\nend\n\nto choose-current\n  if mouse-down?\n  [\n    let x-mouse mouse-xcor\n    let y-mouse mouse-ycor\n    if [intersection?] of patch x-mouse y-mouse\n    [\n      update-current\n      unlabel-current\n      make-current patch x-mouse y-mouse\n      label-current\n      stop\n    ]\n  ]\nend\n\n;; Set up the current light and the interface to change it.\nto make-current [light]\n  set current-light light\n  set current-phase [my-phase] of current-light\n  set current-auto? [auto?] of current-light\nend\n\n;; update the variables for the current light\nto update-current\n  ask current-light [\n    set my-phase current-phase\n    set auto? current-auto?\n  ]\nend\n\n;; label the current light\nto label-current\n  ask current-light\n  [\n    ask patch-at -1 1\n    [\n      set plabel-color black\n      set plabel \"current\"\n    ]\n  ]\nend\n\n;; unlabel the current light (because we\'ve chosen a new one)\nto unlabel-current\n  ask current-light\n  [\n    ask patch-at -1 1\n    [\n      set plabel \"\"\n    ]\n  ]\nend\n\n;; have the traffic lights change color if phase equals each intersections\' my-phase\nto set-signals\n  ask intersections with [auto? and phase = floor ((my-phase * ticks-per-cycle) / 100)]\n  [\n    set green-light-up? (not green-light-up?)\n    set-signal-colors\n  ]\nend\n\n;; This procedure checks the variable green-light-up? at each intersection and sets the\n;; traffic lights to have the green light up or the green light to the left.\nto set-signal-colors  ;; intersection (patch) procedure\n  ifelse power?\n  [\n    ifelse green-light-up?\n    [\n      ask patch-at -1 0 [ set pcolor red ]\n      ask patch-at 0 1 [ set pcolor green ]\n    ]\n    [\n      ask patch-at -1 0 [ set pcolor green ]\n      ask patch-at 0 1 [ set pcolor red ]\n    ]\n  ]\n  [\n    ask patch-at -1 0 [ set pcolor white ]\n    ask patch-at 0 1 [ set pcolor white ]\n  ]\nend\n\n;; set the turtles\' speed based on whether they are at a red traffic light or the speed of the\n;; turtle (if any) on the patch in front of them\nto set-car-speed  ;; turtle procedure\n  ifelse pcolor = red\n  [ set speed 0 ]\n  [\n    ifelse up-car?\n    [ set-speed 0 -1 ]\n    [ set-speed 1 0 ]\n  ]\nend\n\n;; set the speed variable of the car to an appropriate value (not exceeding the\n;; speed limit) based on whether there are cars on the patch in front of the car\nto set-speed [ delta-x delta-y ]  ;; turtle procedure\n  ;; get the turtles on the patch in front of the turtle\n  let turtles-ahead turtles-at delta-x delta-y\n\n  ;; if there are turtles in front of the turtle, slow down\n  ;; otherwise, speed up\n  ifelse any? turtles-ahead\n  [\n    ifelse any? (turtles-ahead with [ up-car? != [up-car?] of myself ])\n    [\n      set speed 0\n    ]\n    [\n      set speed [speed] of one-of turtles-ahead\n      slow-down\n    ]\n  ]\n  [ speed-up ]\nend\n\n;; decrease the speed of the turtle\nto slow-down  ;; turtle procedure\n  ifelse speed <= 0  ;;if speed < 0\n  [ set speed 0 ]\n  [ set speed speed - acceleration ]\nend\n\n;; increase the speed of the turtle\nto speed-up  ;; turtle procedure\n  ifelse speed > speed-limit\n  [ set speed speed-limit ]\n  [ set speed speed + acceleration ]\nend\n\n;; set the color of the turtle to a different color based on how fast the turtle is moving\nto set-car-color  ;; turtle procedure\n  ifelse speed < (speed-limit / 2)\n  [ set color blue ]\n  [ set color cyan - 2 ]\nend\n\n;; keep track of the number of stopped turtles and the amount of time a turtle has been stopped\n;; if its speed is 0\nto record-data  ;; turtle procedure\n  ifelse speed = 0\n  [\n    set num-cars-stopped num-cars-stopped + 1\n    set wait-time wait-time + 1\n  ]\n  [ set wait-time 0 ]\nend\n\nto change-current\n  ask current-light\n  [\n    set green-light-up? (not green-light-up?)\n    set-signal-colors\n  ]\nend\n\n;; cycles phase to the next appropriate value\nto next-phase\n  ;; The phase cycles from 0 to ticks-per-cycle, then starts over.\n  set phase phase + 1\n  if phase mod ticks-per-cycle = 0\n    [ set phase 0 ]\nend\n\n\n; Copyright 2003 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":327,"top":10,"right":668,"bottom":352,"dimensions":{"minPxcor":-18,"maxPxcor":18,"minPycor":-18,"maxPycor":18,"patchSize":9,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":12,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Average Wait Time of Cars', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue(ListPrims.mean(world.turtles().projectionBy(function() { return SelfManager.self().getVariable(\"wait-time\"); })));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot mean [wait-time] of turtles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average Wait Time of Cars","left":453,"top":377,"right":671,"bottom":541,"xAxis":"Time","yAxis":"Average Wait","xmin":0,"xmax":100,"ymin":0,"ymax":5,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot mean [wait-time] of turtles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Average Speed of Cars', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setYRange(0, world.observer.getGlobal(\"speed-limit\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Average Speed of Cars', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue(ListPrims.mean(world.turtles().projectionBy(function() { return SelfManager.self().getVariable(\"speed\"); })));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot mean [speed] of turtles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average Speed of Cars","left":228,"top":377,"right":444,"bottom":542,"xAxis":"Time","yAxis":"Average Speed","xmin":0,"xmax":100,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-y-range 0 speed-limit","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot mean [speed] of turtles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"9","compiledStep":"1","variable":"grid-size-y","left":108,"top":35,"right":205,"bottom":68,"display":"grid-size-y","min":"1","max":"9","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"9","compiledStep":"1","variable":"grid-size-x","left":12,"top":35,"right":106,"bottom":68,"display":"grid-size-x","min":"1","max":"9","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"power?","left":12,"top":107,"right":107,"bottom":140,"display":"power?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"400","compiledStep":"1","variable":"num-cars","left":12,"top":71,"right":293,"bottom":104,"display":"num-cars","min":"1","max":"400","default":200,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Stopped Cars', undefined)(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.setYRange(0, world.observer.getGlobal(\"num-cars\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Stopped Cars', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue(world.observer.getGlobal(\"num-cars-stopped\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot num-cars-stopped","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Stopped Cars","left":5,"top":376,"right":219,"bottom":540,"xAxis":"Time","yAxis":"Stopped Cars","xmin":0,"xmax":100,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-y-range 0 num-cars","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot num-cars-stopped","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":221,"top":184,"right":285,"bottom":217,"display":"Go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":208,"top":35,"right":292,"bottom":68,"display":"Setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0.1","compiledMax":"1","compiledStep":"0.1","variable":"speed-limit","left":11,"top":177,"right":165,"bottom":210,"display":"speed-limit","min":"0.1","max":"1","default":1,"step":"0.1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"phase\")","source":"phase","left":205,"top":132,"right":310,"bottom":177,"display":"Current Phase","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"100","compiledStep":"1","variable":"ticks-per-cycle","left":11,"top":143,"right":165,"bottom":176,"display":"ticks-per-cycle","min":"1","max":"100","default":20,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"99","compiledStep":"1","variable":"current-phase","left":146,"top":256,"right":302,"bottom":289,"display":"current-phase","min":"0","max":"99","default":0,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_47 = procedures[\"CHANGE-CURRENT\"]();\n  if (_maybestop_33_47 instanceof Exception.StopInterrupt) { return _maybestop_33_47; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"change-current","left":9,"top":292,"right":143,"bottom":325,"display":"Change light","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"current-auto?","left":9,"top":256,"right":144,"bottom":289,"display":"current-auto?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_47 = procedures[\"CHOOSE-CURRENT\"]();\n  if (_maybestop_33_47 instanceof Exception.StopInterrupt) { return _maybestop_33_47; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"choose-current","left":145,"top":292,"right":300,"bottom":325,"display":"Select intersection","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["grid-size-y", "grid-size-x", "power?", "num-cars", "speed-limit", "ticks-per-cycle", "current-phase", "current-auto?", "grid-x-inc", "grid-y-inc", "acceleration", "phase", "num-cars-stopped", "current-light", "intersections", "roads"], ["grid-size-y", "grid-size-x", "power?", "num-cars", "speed-limit", "ticks-per-cycle", "current-phase", "current-auto?"], ["intersection?", "green-light-up?", "my-row", "my-column", "my-phase", "auto?"], -18, 18, -18, 18, 9.0, true, true, turtleShapes, linkShapes, function(){});
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
      procedures["SETUP-GLOBALS"]();
      procedures["SETUP-PATCHES"]();
      procedures["MAKE-CURRENT"](ListPrims.oneOf(world.observer.getGlobal("intersections")));
      procedures["LABEL-CURRENT"]();
      BreedManager.setDefaultShape(world.turtles().getSpecialName(), "car")
      if (Prims.gt(world.observer.getGlobal("num-cars"), world.observer.getGlobal("roads").size())) {
        UserDialogPrims.confirm((workspace.dump('') + workspace.dump("There are too many cars for the amount of ") + workspace.dump("road.  Either increase the amount of roads ") + workspace.dump("by increasing the GRID-SIZE-X or ") + workspace.dump("GRID-SIZE-Y sliders, or decrease the ") + workspace.dump("number of cars by lowering the NUMBER slider.\n") + workspace.dump("The setup has stopped.")));
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
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("current-light", Nobody);
      world.observer.setGlobal("phase", 0);
      world.observer.setGlobal("num-cars-stopped", 0);
      world.observer.setGlobal("grid-x-inc", Prims.div(world.topology.width, world.observer.getGlobal("grid-size-x")));
      world.observer.setGlobal("grid-y-inc", Prims.div(world.topology.height, world.observer.getGlobal("grid-size-y")));
      world.observer.setGlobal("acceleration", 0.099);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupGlobals"] = temp;
  procs["SETUP-GLOBALS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.observer.getGlobal("intersections").ask(function() {
        SelfManager.self().setPatchVariable("intersection?", true);
        SelfManager.self().setPatchVariable("green-light-up?", true);
        SelfManager.self().setPatchVariable("my-phase", 0);
        SelfManager.self().setPatchVariable("auto?", true);
        SelfManager.self().setPatchVariable("my-row", NLMath.floor(Prims.div((SelfManager.self().getPatchVariable("pycor") + world.topology.maxPycor), world.observer.getGlobal("grid-y-inc"))));
        SelfManager.self().setPatchVariable("my-column", NLMath.floor(Prims.div((SelfManager.self().getPatchVariable("pxcor") + world.topology.maxPxcor), world.observer.getGlobal("grid-x-inc"))));
        procedures["SET-SIGNAL-COLORS"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupIntersections"] = temp;
  procs["SETUP-INTERSECTIONS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupCars"] = temp;
  procs["SETUP-CARS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().moveTo(world.observer.getGlobal("roads")._optimalOneOfWith(function() { return !!Prims.turtlesOn(SelfManager.self()).isEmpty(); }));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["putOnEmptyRoad"] = temp;
  procs["PUT-ON-EMPTY-ROAD"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
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
      if (MousePrims.isDown()) {
        let xMouse = MousePrims.getX(); letVars['xMouse'] = xMouse;
        let yMouse = MousePrims.getY(); letVars['yMouse'] = yMouse;
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
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("current-light", light);
      world.observer.setGlobal("current-phase", world.observer.getGlobal("current-light").projectionBy(function() { return SelfManager.self().getPatchVariable("my-phase"); }));
      world.observer.setGlobal("current-auto?", world.observer.getGlobal("current-light").projectionBy(function() { return SelfManager.self().getPatchVariable("auto?"); }));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeCurrent"] = temp;
  procs["MAKE-CURRENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.getGlobal("current-light").ask(function() {
        SelfManager.self().setPatchVariable("my-phase", world.observer.getGlobal("current-phase"));
        SelfManager.self().setPatchVariable("auto?", world.observer.getGlobal("current-auto?"));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateCurrent"] = temp;
  procs["UPDATE-CURRENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.getGlobal("current-light").ask(function() {
        SelfManager.self().patchAt(-1, 1).ask(function() {
          SelfManager.self().setPatchVariable("plabel-color", 0);
          SelfManager.self().setPatchVariable("plabel", "current");
        }, true);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["labelCurrent"] = temp;
  procs["LABEL-CURRENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.getGlobal("current-light").ask(function() {
        SelfManager.self().patchAt(-1, 1).ask(function() { SelfManager.self().setPatchVariable("plabel", ""); }, true);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["unlabelCurrent"] = temp;
  procs["UNLABEL-CURRENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.getGlobal("intersections").agentFilter(function() {
        return (SelfManager.self().getPatchVariable("auto?") && Prims.equality(world.observer.getGlobal("phase"), NLMath.floor(Prims.div((SelfManager.self().getPatchVariable("my-phase") * world.observer.getGlobal("ticks-per-cycle")), 100))));
      }).ask(function() {
        SelfManager.self().setPatchVariable("green-light-up?", !SelfManager.self().getPatchVariable("green-light-up?"));
        procedures["SET-SIGNAL-COLORS"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setSignals"] = temp;
  procs["SET-SIGNALS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setSignalColors"] = temp;
  procs["SET-SIGNAL-COLORS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setCarSpeed"] = temp;
  procs["SET-CAR-SPEED"] = temp;
  temp = (function(deltaX, deltaY) {
    try {
      var reporterContext = false;
      var letVars = { };
      let turtlesAhead = SelfManager.self().turtlesAt(deltaX, deltaY); letVars['turtlesAhead'] = turtlesAhead;
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setSpeed"] = temp;
  procs["SET-SPEED"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lte(SelfManager.self().getVariable("speed"), 0)) {
        SelfManager.self().setVariable("speed", 0);
      }
      else {
        SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") - world.observer.getGlobal("acceleration")));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["slowDown"] = temp;
  procs["SLOW-DOWN"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(SelfManager.self().getVariable("speed"), world.observer.getGlobal("speed-limit"))) {
        SelfManager.self().setVariable("speed", world.observer.getGlobal("speed-limit"));
      }
      else {
        SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") + world.observer.getGlobal("acceleration")));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["speedUp"] = temp;
  procs["SPEED-UP"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(SelfManager.self().getVariable("speed"), Prims.div(world.observer.getGlobal("speed-limit"), 2))) {
        SelfManager.self().setVariable("color", 105);
      }
      else {
        SelfManager.self().setVariable("color", (85 - 2));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setCarColor"] = temp;
  procs["SET-CAR-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(SelfManager.self().getVariable("speed"), 0)) {
        world.observer.setGlobal("num-cars-stopped", (world.observer.getGlobal("num-cars-stopped") + 1));
        SelfManager.self().setVariable("wait-time", (SelfManager.self().getVariable("wait-time") + 1));
      }
      else {
        SelfManager.self().setVariable("wait-time", 0);
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["recordData"] = temp;
  procs["RECORD-DATA"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.getGlobal("current-light").ask(function() {
        SelfManager.self().setPatchVariable("green-light-up?", !SelfManager.self().getPatchVariable("green-light-up?"));
        procedures["SET-SIGNAL-COLORS"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["changeCurrent"] = temp;
  procs["CHANGE-CURRENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("phase", (world.observer.getGlobal("phase") + 1));
      if (Prims.equality(NLMath.mod(world.observer.getGlobal("phase"), world.observer.getGlobal("ticks-per-cycle")), 0)) {
        world.observer.setGlobal("phase", 0);
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
