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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person lefty":{"name":"person lefty","editableColorIndex":0,"rotate":false,"elements":[{"x":170,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,180,150,165,195,210,225,255,270,240,255],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":187,"ymin":79,"xmax":232,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,300,285,225],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,120,135,195],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person righty":{"name":"person righty","editableColorIndex":0,"rotate":false,"elements":[{"x":50,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[45,60,30,45,75,90,105,135,150,120,135],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":67,"ymin":79,"xmax":112,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,180,165,105],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[45,0,15,75],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    notify:  function(str) {}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
modelConfig.plots = [(function() {
  var name    = 'Populations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Infected', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Populations', 'Infected')(function() {
        plotManager.plotValue(world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size());;
      });
    });
  }),
  new PenBundle.Pen('Not Infected', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Populations', 'Not Infected')(function() {
        plotManager.plotValue(world.turtles().agentFilter(function() { return !SelfManager.self().getVariable("infected?"); }).size());;
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "hours", "# people", true, true, 0.0, 10.0, 0.0, 350.0, setup, update);
})(), (function() {
  var name    = 'Infection and Recovery Rates';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Infection Rate', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Infection and Recovery Rates', 'Infection Rate')(function() {
        plotManager.plotValue((world.observer.getGlobal("beta-n") * world.observer.getGlobal("nb-infected-previous")));;
      });
    });
  }),
  new PenBundle.Pen('Recovery Rate', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Infection and Recovery Rates', 'Recovery Rate')(function() {
        plotManager.plotValue((world.observer.getGlobal("gamma") * world.observer.getGlobal("nb-infected-previous")));;
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "hours", "rate", true, true, 0.0, 10.0, 0.0, 0.1, setup, update);
})(), (function() {
  var name    = 'Cumulative Infected and Recovered';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('% infected', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Cumulative Infected and Recovered', '% infected')(function() {
        plotManager.plotValue((((world.turtles().agentFilter(function() { return SelfManager.self().getVariable("cured?"); }).size() + world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size()) / world.observer.getGlobal("initial-people")) * 100));;
      });
    });
  }),
  new PenBundle.Pen('% recovered', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Cumulative Infected and Recovered', '% recovered')(function() {
        plotManager.plotValue(((world.turtles().agentFilter(function() { return SelfManager.self().getVariable("cured?"); }).size() / world.observer.getGlobal("initial-people")) * 100));;
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "hours", "% total pop.", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["infected?", "cured?", "inoculated?", "isolated?", "hospitalized?", "infection-length", "isolation-tendency", "hospital-going-tendency", "continent", "ambulance?", "susceptible-0", "nb-infected", "nb-recovered"], [])(["initial-people", "average-isolation-tendency", "inoculation-chance", "initial-ambulance", "average-hospital-going-tendency", "infection-chance", "recovery-chance", "links?", "intra-mobility", "travel?", "travel-tendency", "average-recovery-time", "recovery-time", "nb-infected-previous", "border", "angle", "beta-n", "gamma", "r0"], ["initial-people", "average-isolation-tendency", "inoculation-chance", "initial-ambulance", "average-hospital-going-tendency", "infection-chance", "recovery-chance", "links?", "intra-mobility", "travel?", "travel-tendency", "average-recovery-time"], [], -12, 12, -12, 12, 19.0, false, false, turtleShapes, linkShapes, function(){});
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
  var setup = function() {
    world.clearAll();
    procedures.setupGlobals();
    procedures.setupPeople();
    procedures.setupAmbulance();
    world.ticker.reset();
  };
  var setupGlobals = function() {
    world.getPatchAt(( -world.topology.maxPxcor / 2), 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    world.getPatchAt((world.topology.maxPxcor / 2), 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    world.observer.setGlobal("border", world.patches().agentFilter(function() {
      return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), 0) && Prims.gte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), 0));
    }));
    world.observer.getGlobal("border").ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
  };
  var setupPeople = function() {
    world.turtleManager.createTurtles(world.observer.getGlobal("initial-people"), "").ask(function() {
      SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor));
      if (Prims.lte(SelfManager.self().getVariable("xcor"), 0)) {
        SelfManager.self().setVariable("continent", 1);
      }
      else {
        SelfManager.self().setVariable("continent", 2);
      }
      SelfManager.self().setVariable("cured?", false);
      SelfManager.self().setVariable("isolated?", false);
      SelfManager.self().setVariable("hospitalized?", false);
      SelfManager.self().setVariable("ambulance?", false);
      SelfManager.self().setVariable("infected?", false);
      SelfManager.self().setVariable("susceptible-0", 1);
      procedures.assignTendency();
      if (Prims.equality(SelfManager.self().getVariable("continent"), 1)) {
        SelfManager.self().setVariable("shape", "square");
      }
      else {
        SelfManager.self().setVariable("shape", "circle");
      }
      SelfManager.self().setVariable("size", 0.5);
      if (Prims.lt(Prims.randomFloat(100), 5)) {
        SelfManager.self().setVariable("infected?", true);
        SelfManager.self().setVariable("susceptible-0", 0);
        SelfManager.self().setVariable("infection-length", Prims.random(world.observer.getGlobal("recovery-time")));
      }
      if ((!SelfManager.self().getVariable("infected?") && Prims.lt(Prims.randomFloat(100), world.observer.getGlobal("inoculation-chance")))) {
        SelfManager.self().setVariable("inoculated?", true);
        SelfManager.self().setVariable("susceptible-0", 0);
      }
      else {
        SelfManager.self().setVariable("inoculated?", false);
      }
      procedures.assignColor();
    }, true);
    if (world.observer.getGlobal("links?")) {
      procedures.makeNetwork();
    }
  };
  var setupAmbulance = function() {
    world.turtleManager.createTurtles(world.observer.getGlobal("initial-ambulance"), "").ask(function() {
      if (Prims.lt(Prims.random(2), 1)) {
        SelfManager.self().setVariable("continent", 1);
        SelfManager.self().setXY(( -world.topology.maxPxcor / 2), 0);
      }
      else {
        SelfManager.self().setVariable("continent", 2);
        SelfManager.self().setXY((world.topology.maxPxcor / 2), 0);
      }
      SelfManager.self().setVariable("cured?", false);
      SelfManager.self().setVariable("isolated?", false);
      SelfManager.self().setVariable("hospitalized?", false);
      SelfManager.self().setVariable("infected?", false);
      SelfManager.self().setVariable("inoculated?", false);
      SelfManager.self().setVariable("ambulance?", true);
      SelfManager.self().setVariable("shape", "person");
      SelfManager.self().setVariable("color", 45);
    }, true);
  };
  var assignTendency = function() {
    SelfManager.self().setVariable("isolation-tendency", (Prims.randomNormal(world.observer.getGlobal("average-isolation-tendency"), world.observer.getGlobal("average-isolation-tendency")) / 4));
    SelfManager.self().setVariable("hospital-going-tendency", (Prims.randomNormal(world.observer.getGlobal("average-hospital-going-tendency"), world.observer.getGlobal("average-hospital-going-tendency")) / 4));
    world.observer.setGlobal("recovery-time", (Prims.randomNormal(world.observer.getGlobal("average-recovery-time"), world.observer.getGlobal("average-recovery-time")) / 4));
    if (Prims.gt(world.observer.getGlobal("recovery-time"), (world.observer.getGlobal("average-recovery-time") * 2))) {
      world.observer.setGlobal("recovery-time", (world.observer.getGlobal("average-recovery-time") * 2));
    }
    if (Prims.lt(world.observer.getGlobal("recovery-time"), 0)) {
      world.observer.setGlobal("recovery-time", 0);
    }
    if (Prims.gt(SelfManager.self().getVariable("isolation-tendency"), (world.observer.getGlobal("average-isolation-tendency") * 2))) {
      SelfManager.self().setVariable("isolation-tendency", (world.observer.getGlobal("average-isolation-tendency") * 2));
    }
    if (Prims.lt(SelfManager.self().getVariable("isolation-tendency"), 0)) {
      SelfManager.self().setVariable("isolation-tendency", 0);
    }
    if (Prims.gt(SelfManager.self().getVariable("hospital-going-tendency"), (world.observer.getGlobal("average-hospital-going-tendency") * 2))) {
      SelfManager.self().setVariable("hospital-going-tendency", (world.observer.getGlobal("average-hospital-going-tendency") * 2));
    }
    if (Prims.lt(SelfManager.self().getVariable("hospital-going-tendency"), 0)) {
      SelfManager.self().setVariable("hospital-going-tendency", 0);
    }
  };
  var assignColor = function() {
    if (SelfManager.self().getVariable("cured?")) {
      SelfManager.self().setVariable("color", 55);
    }
    else {
      if (SelfManager.self().getVariable("inoculated?")) {
        SelfManager.self().setVariable("color", 105);
      }
      else {
        if (SelfManager.self().getVariable("infected?")) {
          SelfManager.self().setVariable("color", 15);
        }
        else {
          SelfManager.self().setVariable("color", 9.9);
        }
      }
    }
    if (SelfManager.self().getVariable("ambulance?")) {
      SelfManager.self().setVariable("color", 45);
    }
  };
  var makeNetwork = function() {
    world.turtles().ask(function() {
      LinkPrims.createLinksWith(Prims.turtlesOn(SelfManager.self().getNeighbors()), "LINKS").ask(function() {}, false);
    }, true);
  };
  var go = function() {
    try {
      if (world.turtles().agentAll(function() { return !SelfManager.self().getVariable("infected?"); })) {
        throw new Exception.StopInterrupt;
      }
      world.turtles().ask(function() { procedures.clearCount(); }, true);
      world.turtles().ask(function() {
        if (((!SelfManager.self().getVariable("isolated?") && !SelfManager.self().getVariable("hospitalized?")) && !SelfManager.self().getVariable("ambulance?"))) {
          procedures.move();
        }
      }, true);
      world.turtles().ask(function() {
        if (((SelfManager.self().getVariable("infected?") && !SelfManager.self().getVariable("isolated?")) && !SelfManager.self().getVariable("hospitalized?"))) {
          procedures.infect();
        }
      }, true);
      world.turtles().ask(function() {
        if ((((!SelfManager.self().getVariable("isolated?") && !SelfManager.self().getVariable("hospitalized?")) && SelfManager.self().getVariable("infected?")) && Prims.lt(Prims.random(100), SelfManager.self().getVariable("isolation-tendency")))) {
          procedures.isolate();
        }
      }, true);
      world.turtles().ask(function() {
        if ((((!SelfManager.self().getVariable("isolated?") && !SelfManager.self().getVariable("hospitalized?")) && SelfManager.self().getVariable("infected?")) && Prims.lt(Prims.random(100), SelfManager.self().getVariable("hospital-going-tendency")))) {
          procedures.hospitalize();
        }
      }, true);
      world.turtles().ask(function() {
        if (SelfManager.self().getVariable("ambulance?")) {
          procedures.move();
          Prims.turtlesOn(SelfManager.self().getNeighbors()).ask(function() {
            if ((Prims.equality(SelfManager.self().getVariable("ambulance?"), false) && Prims.equality(SelfManager.self().getVariable("infected?"), true))) {
              procedures.hospitalize();
            }
          }, true);
        }
      }, true);
      world.turtles().ask(function() {
        if (SelfManager.self().getVariable("infected?")) {
          procedures.maybeRecover();
        }
      }, true);
      world.turtles().ask(function() {
        if (((SelfManager.self().getVariable("isolated?") || SelfManager.self().getVariable("hospitalized?")) && SelfManager.self().getVariable("cured?"))) {
          procedures.unisolate();
        }
      }, true);
      world.turtles().ask(function() {
        procedures.assignColor();
        procedures.calculateR0();
      }, true);
      world.ticker.tick();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  };
  var move = function() {
    if (world.observer.getGlobal("travel?")) {
      if ((Prims.lt(Prims.random(100), world.observer.getGlobal("travel-tendency")) && !SelfManager.self().getVariable("ambulance?"))) {
        SelfManager.self().setVariable("xcor",  -SelfManager.self().getVariable("xcor"));
      }
    }
    if (Prims.equality(SelfManager.self().getVariable("continent"), 1)) {
      if (Prims.gt(SelfManager.self().getVariable("xcor"),  -0.5)) {
        world.observer.setGlobal("angle", Prims.randomFloat(180));
        var newPatch = SelfManager.self().patchAtHeadingAndDistance(world.observer.getGlobal("angle"), -1);
        if (!Prims.equality(newPatch, Nobody)) {
          SelfManager.self().moveTo(newPatch);
        }
      }
      else {
        if (Prims.lt(SelfManager.self().getVariable("xcor"), (world.topology.minPxcor + 0.5))) {
          world.observer.setGlobal("angle", Prims.randomFloat(180));
        }
        else {
          world.observer.setGlobal("angle", Prims.randomFloat(360));
        }
        SelfManager.self().right(world.observer.getGlobal("angle"));
        if (SelfManager.self().getVariable("ambulance?")) {
          SelfManager.self().fd((world.observer.getGlobal("intra-mobility") * 5));
        }
        else {
          SelfManager.self().fd(world.observer.getGlobal("intra-mobility"));
        }
      }
    }
    else {
      if (Prims.lt(SelfManager.self().getVariable("xcor"), 1)) {
        world.observer.setGlobal("angle", Prims.randomFloat(180));
        var newPatch = SelfManager.self().patchAtHeadingAndDistance(world.observer.getGlobal("angle"), 1);
        if (!Prims.equality(newPatch, Nobody)) {
          SelfManager.self().moveTo(newPatch);
        }
      }
      else {
        if (Prims.gt(SelfManager.self().getVariable("xcor"), (world.topology.maxPxcor - 1))) {
          world.observer.setGlobal("angle", Prims.randomFloat(180));
        }
        else {
          world.observer.setGlobal("angle", Prims.randomFloat(360));
        }
        SelfManager.self().right(-world.observer.getGlobal("angle"));
        if (SelfManager.self().getVariable("ambulance?")) {
          SelfManager.self().fd((world.observer.getGlobal("intra-mobility") * 5));
        }
        else {
          SelfManager.self().fd(world.observer.getGlobal("intra-mobility"));
        }
      }
    }
  };
  var clearCount = function() {
    SelfManager.self().setVariable("nb-infected", 0);
    SelfManager.self().setVariable("nb-recovered", 0);
  };
  var maybeRecover = function() {
    SelfManager.self().setVariable("infection-length", (SelfManager.self().getVariable("infection-length") + 1));
    if (!SelfManager.self().getVariable("hospitalized?")) {
      if (Prims.gt(SelfManager.self().getVariable("infection-length"), world.observer.getGlobal("recovery-time"))) {
        if (Prims.lt(Prims.randomFloat(100), world.observer.getGlobal("recovery-chance"))) {
          SelfManager.self().setVariable("infected?", false);
          SelfManager.self().setVariable("cured?", true);
          SelfManager.self().setVariable("nb-recovered", (SelfManager.self().getVariable("nb-recovered") + 1));
        }
      }
    }
    else {
      if (Prims.gt(SelfManager.self().getVariable("infection-length"), (world.observer.getGlobal("recovery-time") / 5))) {
        SelfManager.self().setVariable("infected?", false);
        SelfManager.self().setVariable("cured?", true);
        SelfManager.self().setVariable("nb-recovered", (SelfManager.self().getVariable("nb-recovered") + 1));
      }
    }
  };
  var isolate = function() {
    SelfManager.self().setVariable("isolated?", true);
    SelfManager.self().moveTo(SelfManager.self().getPatchHere());
    SelfManager.self().patchAt(0, 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", (5 - 3)); }, true);
  };
  var unisolate = function() {
    SelfManager.self().setVariable("isolated?", false);
    SelfManager.self().setVariable("hospitalized?", false);
    SelfManager.self().patchAt(0, 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
    world.observer.getGlobal("border").ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
    world.getPatchAt(( -world.topology.maxPxcor / 2), 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    world.getPatchAt((world.topology.maxPxcor / 2), 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
  };
  var hospitalize = function() {
    SelfManager.self().setVariable("hospitalized?", true);
    SelfManager.self().setPatchVariable("pcolor", 0);
    if (Prims.equality(SelfManager.self().getVariable("continent"), 1)) {
      SelfManager.self().moveTo(world.getPatchAt(( -world.topology.maxPxcor / 2), 0));
    }
    else {
      SelfManager.self().moveTo(world.getPatchAt((world.topology.maxPxcor / 2), 0));
    }
    SelfManager.self().setPatchVariable("pcolor", 9.9);
  };
  var infect = function() {
    var caller = SelfManager.self();
    var nearbyUninfected = Prims.turtlesOn(SelfManager.self().getNeighbors()).agentFilter(function() {
      return ((!SelfManager.self().getVariable("infected?") && !SelfManager.self().getVariable("cured?")) && !SelfManager.self().getVariable("inoculated?"));
    });
    if (!Prims.equality(nearbyUninfected, Nobody)) {
      nearbyUninfected.ask(function() {
        if (LinkPrims.isLinkNeighbor("LINKS", caller)) {
          if (Prims.lt(Prims.random(100), (world.observer.getGlobal("infection-chance") * 2))) {
            SelfManager.self().setVariable("infected?", true);
            SelfManager.self().setVariable("nb-infected", (SelfManager.self().getVariable("nb-infected") + 1));
          }
        }
        else {
          if (Prims.lt(Prims.random(100), world.observer.getGlobal("infection-chance"))) {
            SelfManager.self().setVariable("infected?", true);
            SelfManager.self().setVariable("nb-infected", (SelfManager.self().getVariable("nb-infected") + 1));
          }
        }
      }, true);
    }
  };
  var calculateR0 = function() {
    var newInfected = ListPrims.sum(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("nb-infected"); }));
    var newRecovered = ListPrims.sum(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("nb-recovered"); }));
    world.observer.setGlobal("nb-infected-previous", ((world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size() + newRecovered) - newInfected));
    var susceptibleT = ((world.observer.getGlobal("initial-people") - world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size()) - world.turtles().agentFilter(function() { return SelfManager.self().getVariable("cured?"); }).size());
    var s0 = ListPrims.sum(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("susceptible-0"); }));
    if (Prims.lt(world.observer.getGlobal("nb-infected-previous"), 10)) {
      world.observer.setGlobal("beta-n", 0);
    }
    else {
      world.observer.setGlobal("beta-n", (newInfected / world.observer.getGlobal("nb-infected-previous")));
    }
    if (Prims.lt(world.observer.getGlobal("nb-infected-previous"), 5)) {
      world.observer.setGlobal("gamma", 0);
    }
    else {
      world.observer.setGlobal("gamma", (newRecovered / world.observer.getGlobal("nb-infected-previous")));
    }
    if ((!Prims.equality((world.observer.getGlobal("initial-people") - susceptibleT), 0) && !Prims.equality(susceptibleT, 0))) {
      world.observer.setGlobal("r0", (NLMath.ln((s0 / susceptibleT)) / (world.observer.getGlobal("initial-people") - susceptibleT)));
      world.observer.setGlobal("r0", (world.observer.getGlobal("r0") * s0));
    }
  };
  return {
    "ASSIGN-COLOR":assignColor,
    "ASSIGN-TENDENCY":assignTendency,
    "CALCULATE-R0":calculateR0,
    "CLEAR-COUNT":clearCount,
    "GO":go,
    "HOSPITALIZE":hospitalize,
    "INFECT":infect,
    "ISOLATE":isolate,
    "MAKE-NETWORK":makeNetwork,
    "MAYBE-RECOVER":maybeRecover,
    "MOVE":move,
    "SETUP":setup,
    "SETUP-AMBULANCE":setupAmbulance,
    "SETUP-GLOBALS":setupGlobals,
    "SETUP-PEOPLE":setupPeople,
    "UNISOLATE":unisolate,
    "assignColor":assignColor,
    "assignTendency":assignTendency,
    "calculateR0":calculateR0,
    "clearCount":clearCount,
    "go":go,
    "hospitalize":hospitalize,
    "infect":infect,
    "isolate":isolate,
    "makeNetwork":makeNetwork,
    "maybeRecover":maybeRecover,
    "move":move,
    "setup":setup,
    "setupAmbulance":setupAmbulance,
    "setupGlobals":setupGlobals,
    "setupPeople":setupPeople,
    "unisolate":unisolate
  };
})();
world.observer.setGlobal("initial-people", 250);
world.observer.setGlobal("average-isolation-tendency", 5);
world.observer.setGlobal("inoculation-chance", 10);
world.observer.setGlobal("initial-ambulance", 2);
world.observer.setGlobal("average-hospital-going-tendency", 5);
world.observer.setGlobal("infection-chance", 55);
world.observer.setGlobal("recovery-chance", 45);
world.observer.setGlobal("links?", false);
world.observer.setGlobal("intra-mobility", 0.4);
world.observer.setGlobal("travel?", false);
world.observer.setGlobal("travel-tendency", 1);
world.observer.setGlobal("average-recovery-time", 110);
