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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person lefty":{"name":"person lefty","editableColorIndex":0,"rotate":false,"elements":[{"x":170,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,180,150,165,195,210,225,255,270,240,255],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":187,"ymin":79,"xmax":232,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,300,285,225],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,120,135,195],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person righty":{"name":"person righty","editableColorIndex":0,"rotate":false,"elements":[{"x":50,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[45,60,30,45,75,90,105,135,150,120,135],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":67,"ymin":79,"xmax":112,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,180,165,105],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[45,0,15,75],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
  var name    = 'Populations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Infected', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Populations', 'Infected')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size());
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
  new PenBundle.Pen('Not Infected', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Populations', 'Not Infected')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles().agentFilter(function() { return !SelfManager.self().getVariable("infected?"); }).size());
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
  return new Plot(name, pens, plotOps, "hours", "# people", true, true, 0.0, 10.0, 0.0, 350.0, setup, update);
})(), (function() {
  var name    = 'Infection and Recovery Rates';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Infection Rate', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Infection and Recovery Rates', 'Infection Rate')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue((world.observer.getGlobal("beta-n") * world.observer.getGlobal("nb-infected-previous")));
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
  new PenBundle.Pen('Recovery Rate', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Infection and Recovery Rates', 'Recovery Rate')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue((world.observer.getGlobal("gamma") * world.observer.getGlobal("nb-infected-previous")));
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
  return new Plot(name, pens, plotOps, "hours", "rate", true, true, 0.0, 10.0, 0.0, 0.1, setup, update);
})(), (function() {
  var name    = 'Cumulative Infected and Recovered';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('% infected', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Cumulative Infected and Recovered', '% infected')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue((Prims.div((world.turtles().agentFilter(function() { return SelfManager.self().getVariable("cured?"); }).size() + world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size()), world.observer.getGlobal("initial-people")) * 100));
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
  new PenBundle.Pen('% recovered', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Cumulative Infected and Recovered', '% recovered')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue((Prims.div(world.turtles().agentFilter(function() { return SelfManager.self().getVariable("cured?"); }).size(), world.observer.getGlobal("initial-people")) * 100));
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
  return new Plot(name, pens, plotOps, "hours", "% total pop.", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["infected?", "cured?", "inoculated?", "isolated?", "hospitalized?", "infection-length", "recovery-time", "isolation-tendency", "hospital-going-tendency", "continent", "ambulance?", "susceptible?", "nb-infected", "nb-recovered"], [])('globals\n[\n  nb-infected-previous ;; Number of infected people at the previous tick\n  border               ;; The patches representing the yellow border\n  angle                ;; Heading for individuals\n  beta-n               ;; The average number of new secondary infections per infected this tick\n  gamma                ;; The average number of new recoveries per infected this tick\n  r0                   ;; The number of secondary infections that arise due to a single infective introduced in a wholly susceptible population\n]\n\nturtles-own\n[\n  infected?            ;; If true, the person is infected.\n  cured?               ;; If true, the person has lived through an infection. They cannot be re-infected.\n  inoculated?          ;; If true, the person has been inoculated.\n  isolated?            ;; If true, the person is isolated, unable to infect anyone.\n  hospitalized?        ;; If true, the person is hospitalized and will recovery in half the average-recovery-time.\n\n  infection-length     ;; How long the person has been infected.\n  recovery-time        ;; Time (in hours) it takes before the person has a chance to recover from the infection\n  isolation-tendency   ;; Chance the person will self-quarantine during any hour being infected.\n  hospital-going-tendency ;; Chance that an infected person will go to the hospital when infected\n\n  continent            ;; Which continent a person lives one, people on continent 1 are squares, people on continent 2 are circles.\n\n  ambulance?           ;; If true, the person is an ambulance and will transport infected people to the hospital.\n\n  susceptible?         ;; Tracks whether the person was initially susceptible\n  nb-infected          ;; Number of secondary infections caused by an infected person at the end of the tick\n  nb-recovered         ;; Number of recovered people at the end of the tick\n]\n\n;;;\n;;; SETUP PROCEDURES\n;;;\n\nto setup\n  clear-all\n  setup-globals\n  setup-people\n  setup-ambulance\n  reset-ticks\nend\n\nto setup-globals\n  ask patch (- max-pxcor / 2 ) 0 [ set pcolor white ]\n  ask patch (max-pxcor / 2 ) 0 [ set pcolor white ]\n\n  set border patches with [(pxcor =  0 and abs (pycor) >= 0)]\n  ask border [ set pcolor yellow ]\nend\n\n;; Create initial-people number of people.\n;; Those that live on the left are squares; those on the right, circles.\nto setup-people\n  create-turtles initial-people\n    [ setxy random-xcor random-ycor\n      ifelse xcor <= 0\n      [ set continent 1 ]\n      [ set continent 2 ]\n\n      set cured? false\n      set isolated? false\n      set hospitalized? false\n      set ambulance? false\n      set infected? false\n      set susceptible? true\n\n      assign-tendency\n\n      ifelse continent = 1\n        [ set shape \"square\" ]\n        [ set shape \"circle\" ]\n\n      set size 0.5\n\n      ;; Each individual has a 5% chance of starting out infected\n      if (random-float 100 < 5)\n      [ set infected? true\n        set susceptible? false\n        set infection-length random recovery-time\n      ]\n\n      ifelse (not infected?) and (random-float 100 < inoculation-chance)\n        [ set inoculated? true\n          set susceptible? false ]\n        [ set inoculated? false ]\n\n      assign-color\n      ]\n\n    if links? [ make-network ]\nend\n\nto setup-ambulance\n  create-turtles initial-ambulance\n  [\n    ifelse random 2 < 1\n    [\n      set continent 1\n      setxy (- max-pxcor / 2) 0\n    ]\n    [\n      set continent 2\n      setxy (max-pxcor / 2) 0\n    ]\n\n    set cured? false\n    set isolated? false\n    set hospitalized? false\n    set infected? false\n    set inoculated? false\n    set susceptible? false\n\n    set ambulance? true\n\n    set shape \"person\"\n    set color yellow\n  ]\nend\n\nto assign-tendency ;; Turtle procedure\n\n  set isolation-tendency random-normal average-isolation-tendency average-isolation-tendency / 4\n  set hospital-going-tendency random-normal average-hospital-going-tendency average-hospital-going-tendency / 4\n  set recovery-time random-normal average-recovery-time average-recovery-time / 4\n\n  ;; Make sure recovery-time lies between 0 and 2x average-recovery-time\n  if recovery-time > average-recovery-time * 2 [ set recovery-time average-recovery-time * 2 ]\n  if recovery-time < 0 [ set recovery-time 0 ]\n\n  ;; Similarly for isolation and hospital going tendencies\n  if isolation-tendency > average-isolation-tendency * 2 [ set isolation-tendency average-isolation-tendency * 2 ]\n  if isolation-tendency < 0 [ set isolation-tendency 0 ]\n\n  if hospital-going-tendency > average-hospital-going-tendency * 2 [ set hospital-going-tendency average-hospital-going-tendency * 2 ]\n  if hospital-going-tendency < 0 [ set hospital-going-tendency 0 ]\nend\n\n\n;; Different people are displayed in 5 different colors depending on health\n;; green is a survivor of the infection\n;; blue is a successful innoculation\n;; red is an infected person\n;; white is neither infected, innoculated, nor cured\n;; yellow is an ambulance\nto assign-color ;; turtle procedure\n\n  ifelse cured?\n    [ set color green ]\n    [ ifelse inoculated?\n      [ set color blue ]\n      [ ifelse infected?\n        [set color red ]\n        [set color white]]]\n  if ambulance?\n    [ set color yellow ]\nend\n\n\nto make-network\n  ask turtles\n  [\n    create-links-with turtles-on neighbors\n  ]\nend\n\n\n;;;\n;;; GO PROCEDURES\n;;;\n\n\nto go\n  if all? turtles [ not infected? ]\n    [ stop ]\n  ask turtles\n    [ clear-count ]\n\n  ask turtles\n    [ if not isolated? and not hospitalized? and not ambulance?\n        [ move ] ]\n\n  ask turtles\n    [ if infected? and not isolated? and not hospitalized?\n         [ infect ] ]\n\n  ask turtles\n    [ if not isolated? and not hospitalized? and infected? and (random 100 < isolation-tendency)\n        [ isolate ] ]\n\n  ask turtles\n    [ if not isolated? and not hospitalized? and infected? and (random 100 < hospital-going-tendency)\n        [ hospitalize ] ]\n\n  ask turtles\n  [\n    if ambulance?\n    [\n      move\n      ask turtles-on neighbors\n      [\n        if (ambulance? = false) and (infected? = true)\n        [ hospitalize ]\n      ]\n    ]\n  ]\n\n  ask turtles\n    [ if infected?\n       [ maybe-recover ]\n    ]\n\n  ask turtles\n    [ if (isolated? or hospitalized?) and cured?\n        [ unisolate ] ]\n\n  ask turtles\n    [ assign-color\n      calculate-r0 ]\n\n  tick\nend\n\n\nto move  ;; turtle procedure\n  if travel?\n  [\n    if random 100 < (travel-tendency) and not ambulance?  ;; up to 1% chance of travel\n    [ set xcor (- xcor) ]\n  ]\n\n  ifelse continent = 1\n  [\n    ifelse xcor > (- 0.5)  ;; and on border patch\n    [\n      set angle random-float 180\n      let new-patch patch-at-heading-and-distance angle (-1)\n      if new-patch != nobody\n      [\n        move-to new-patch\n      ]\n    ]\n    [ ;; if in continent 1 and not on border\n      ifelse xcor < (min-pxcor + 0.5)  ;; at the edge of world\n      [\n        set angle random-float 180\n      ]\n      [\n        set angle random-float 360  ;; inside world\n      ]\n      rt angle\n\n      ifelse ambulance?\n      [\n        fd intra-mobility * 5  ;; ambulances move 5 times as fast than the ppl\n      ]\n      [\n        fd intra-mobility\n      ]\n    ]\n\n  ]\n  [ ;; in continent 2\n    ifelse xcor < 1  ;; and on border patch\n    [\n      set angle random-float 180\n      let new-patch patch-at-heading-and-distance angle (1)\n      if new-patch != nobody\n      [\n        move-to new-patch\n      ]\n    ]\n    [ ;; if in continent 2 and not on border\n      ifelse xcor > (max-pxcor - 1) ;; at the edge of world\n      [\n        set angle random-float 180\n      ]\n      [\n        set angle random-float 360\n      ]\n      lt angle\n\n      ifelse ambulance?\n      [\n        fd intra-mobility * 5\n      ]\n      [\n        fd intra-mobility\n      ]\n    ]\n\n  ]\nend\n\nto clear-count\n  set nb-infected 0\n  set nb-recovered 0\nend\n\nto maybe-recover\n  set infection-length infection-length + 1\n\n      ;; If people have been infected for more than the recovery-time\n      ;; then there is a chance for recovery\n      ifelse not hospitalized?\n      [\n        if infection-length > recovery-time\n        [\n          if random-float 100 < recovery-chance\n          [\n            set infected? false\n            set cured? true\n            set nb-recovered (nb-recovered + 1)\n          ]\n        ]\n      ]\n      [ ;; If hospitalized, recover in a fifth of the recovery time\n        if infection-length > (recovery-time / 5)\n        [\n          set infected? false\n          set cured? true\n          set nb-recovered (nb-recovered + 1 )\n        ]\n      ]\nend\n\n;; To better show that isolation has occurred, the patch below the person turns gray\nto isolate ;; turtle procedure\n  set isolated? true\n  move-to patch-here ;; move to center of patch\n  ask (patch-at 0 0) [ set pcolor gray - 3 ]\nend\n\n;; After unisolating, patch turns back to normal color\nto unisolate  ;; turtle procedure\n  set isolated? false\n  set hospitalized? false\n\n  ask (patch-at 0 0) [ set pcolor black ]\n\n  ask border [ set pcolor yellow ]                      ;; patches on the border stay yellow\n  ask (patch (- max-pxcor / 2) 0) [ set pcolor white ]  ;; hospital patch on the left stays white\n  ask (patch (max-pxcor / 2) 0) [ set pcolor white ]    ;; hospital patch on the right stays white\nend\n\n;; To hospitalize, move to hospital patch in the continent of current residence\nto hospitalize ;; turtle procedure\n  set hospitalized? true\n  set pcolor black\n  ifelse continent = 1\n  [\n    move-to patch (- max-pxcor / 2) 0\n  ]\n  [\n    move-to patch (max-pxcor / 2) 0\n  ]\n  set pcolor white\nend\n\n;; Infected individuals who are not isolated or hospitalized have a chance of transmitting their disease to their susceptible neighbors.\n;; If the neighbor is linked, then the chance of disease transmission doubles.\n\nto infect  ;; turtle procedure\n\n    let caller self\n\n    let nearby-uninfected (turtles-on neighbors)\n    with [ not infected? and not cured? and not inoculated? ]\n    if nearby-uninfected != nobody\n    [\n       ask nearby-uninfected\n       [\n           ifelse link-neighbor? caller\n           [\n             if random 100 < infection-chance * 2 ;; twice as likely to infect a linked person\n             [\n               set infected? true\n               set nb-infected (nb-infected + 1)\n             ]\n           ]\n           [\n             if random 100 < infection-chance\n             [\n               set infected? true\n               set nb-infected (nb-infected + 1)\n             ]\n           ]\n       ]\n\n    ]\n\nend\n\n\nto calculate-r0\n\n  let new-infected sum [ nb-infected ] of turtles\n  let new-recovered sum [ nb-recovered ] of turtles\n  set nb-infected-previous (count turtles with [ infected? ] + new-recovered - new-infected)  ;; Number of infected people at the previous tick\n  let susceptible-t (initial-people - (count turtles with [ infected? ]) - (count turtles with [ cured? ]))  ;; Number of susceptibles now\n  let s0 count turtles with [ susceptible? ] ;; Initial number of susceptibles\n\n  ifelse nb-infected-previous < 10\n  [ set beta-n 0 ]\n  [\n    set beta-n (new-infected / nb-infected-previous)       ;; This is the average number of new secondary infections per infected this tick\n  ]\n\n  ifelse nb-infected-previous < 5\n  [ set gamma 0 ]\n  [\n    set gamma (new-recovered / nb-infected-previous)     ;; This is the average number of new recoveries per infected this tick\n  ]\n\n  if ((initial-people - susceptible-t) != 0 and (susceptible-t != 0))   ;; Prevent from dividing by 0\n  [\n    ;; This is derived from integrating dI / dS = (beta*SI - gamma*I) / (-beta*SI)\n    ;; Assuming one infected individual introduced in the beginning, and hence counting I(0) as negligible,\n    ;; we get the relation\n    ;; N - gamma*ln(S(0)) / beta = S(t) - gamma*ln(S(t)) / beta, where N is the initial \'susceptible\' population.\n    ;; Since N >> 1\n    ;; Using this, we have R_0 = beta*N / gamma = N*ln(S(0)/S(t)) / (K-S(t))\n    set r0 (ln (s0 / susceptible-t) / (initial-people - susceptible-t))\n    set r0 r0 * s0 ]\nend\n\n\n; Copyright 2011 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":646,"top":27,"right":1129,"bottom":511,"dimensions":{"minPxcor":-12,"maxPxcor":12,"minPycor":-12,"maxPycor":12,"patchSize":19,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"hours","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":339,"top":219,"right":422,"bottom":252,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":443,"top":219,"right":526,"bottom":252,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"50","compiledMax":"400","compiledStep":"10","variable":"initial-people","left":18,"top":22,"right":287,"bottom":55,"display":"initial-people","min":"50","max":"400","default":250,"step":"10","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"5","variable":"average-isolation-tendency","left":315,"top":22,"right":584,"bottom":55,"display":"average-isolation-tendency","min":"0","max":"50","default":5,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Populations', 'Infected')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue(world.turtles().agentFilter(function() { return SelfManager.self().getVariable(\"infected?\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"Infected","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [ infected? ]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Populations', 'Not Infected')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue(world.turtles().agentFilter(function() { return !SelfManager.self().getVariable(\"infected?\"); }).size());\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"Not Infected","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [ not infected? ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Populations","left":356,"top":299,"right":619,"bottom":442,"xAxis":"hours","yAxis":"# people","xmin":0,"xmax":10,"ymin":0,"ymax":350,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"Infected","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [ infected? ]","type":"pen"},{"display":"Not Infected","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [ not infected? ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"5","variable":"inoculation-chance","left":315,"top":95,"right":584,"bottom":128,"display":"inoculation-chance","min":"0","max":"50","default":10,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"4","compiledStep":"1","variable":"initial-ambulance","left":315,"top":134,"right":487,"bottom":167,"display":"initial-ambulance","min":"0","max":"4","default":2,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"5","variable":"average-hospital-going-tendency","left":315,"top":58,"right":584,"bottom":91,"display":"average-hospital-going-tendency","min":"0","max":"50","default":5,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Infection and Recovery Rates', 'Infection Rate')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue((world.observer.getGlobal(\"beta-n\") * world.observer.getGlobal(\"nb-infected-previous\")));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"Infection Rate","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot (beta-n * nb-infected-previous)","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Infection and Recovery Rates', 'Recovery Rate')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue((world.observer.getGlobal(\"gamma\") * world.observer.getGlobal(\"nb-infected-previous\")));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"Recovery Rate","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot (gamma * nb-infected-previous)","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Infection and Recovery Rates","left":11,"top":452,"right":344,"bottom":597,"xAxis":"hours","yAxis":"rate","xmin":0,"xmax":10,"ymin":0,"ymax":0.1,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"Infection Rate","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot (beta-n * nb-infected-previous)","type":"pen"},{"display":"Recovery Rate","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot (gamma * nb-infected-previous)","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"10","compiledMax":"100","compiledStep":"5","variable":"infection-chance","left":18,"top":59,"right":286,"bottom":92,"display":"infection-chance","min":"10","max":"100","default":55,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"10","compiledMax":"100","compiledStep":"5","variable":"recovery-chance","left":18,"top":97,"right":285,"bottom":130,"display":"recovery-chance","min":"10","max":"100","default":45,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"r0\")","source":"r0\n","left":356,"top":451,"right":437,"bottom":496,"display":"R0","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"links?","left":195,"top":199,"right":298,"bottom":232,"display":"links?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.1","variable":"intra-mobility","left":15,"top":199,"right":187,"bottom":232,"display":"intra-mobility","min":"0","max":"1","default":0.4,"step":"0.1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"travel?","left":196,"top":241,"right":299,"bottom":274,"display":"travel?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.1","variable":"travel-tendency","left":14,"top":240,"right":186,"bottom":273,"display":"travel-tendency","min":"0","max":"1","default":1,"step":".1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"50","compiledMax":"300","compiledStep":"10","variable":"average-recovery-time","left":18,"top":136,"right":286,"bottom":169,"display":"average-recovery-time","min":"50","max":"300","default":110,"step":"10","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Cumulative Infected and Recovered', '% infected')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue((Prims.div((world.turtles().agentFilter(function() { return SelfManager.self().getVariable(\"cured?\"); }).size() + world.turtles().agentFilter(function() { return SelfManager.self().getVariable(\"infected?\"); }).size()), world.observer.getGlobal(\"initial-people\")) * 100));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"% infected","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot (((count turtles with [ cured? ] + count turtles with [ infected? ]) / initial-people) * 100)","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Cumulative Infected and Recovered', '% recovered')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue((Prims.div(world.turtles().agentFilter(function() { return SelfManager.self().getVariable(\"cured?\"); }).size(), world.observer.getGlobal(\"initial-people\")) * 100));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"% recovered","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot ((count turtles with [ cured? ] / initial-people) * 100)","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Cumulative Infected and Recovered","left":11,"top":297,"right":343,"bottom":441,"xAxis":"hours","yAxis":"% total pop.","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"% infected","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot (((count turtles with [ cured? ] + count turtles with [ infected? ]) / initial-people) * 100)","type":"pen"},{"display":"% recovered","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot ((count turtles with [ cured? ] / initial-people) * 100)","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["initial-people", "average-isolation-tendency", "inoculation-chance", "initial-ambulance", "average-hospital-going-tendency", "infection-chance", "recovery-chance", "links?", "intra-mobility", "travel?", "travel-tendency", "average-recovery-time", "nb-infected-previous", "border", "angle", "beta-n", "gamma", "r0"], ["initial-people", "average-isolation-tendency", "inoculation-chance", "initial-ambulance", "average-hospital-going-tendency", "infection-chance", "recovery-chance", "links?", "intra-mobility", "travel?", "travel-tendency", "average-recovery-time"], [], -12, 12, -12, 12, 19.0, false, false, turtleShapes, linkShapes, function(){});
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
      procedures["SETUP-PEOPLE"]();
      procedures["SETUP-AMBULANCE"]();
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
      world.getPatchAt(Prims.div( -world.topology.maxPxcor, 2), 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
      world.getPatchAt(Prims.div(world.topology.maxPxcor, 2), 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
      world.observer.setGlobal("border", world.patches().agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), 0) && Prims.gte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), 0));
      }));
      world.observer.getGlobal("border").ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
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
        SelfManager.self().setVariable("susceptible?", true);
        procedures["ASSIGN-TENDENCY"]();
        if (Prims.equality(SelfManager.self().getVariable("continent"), 1)) {
          SelfManager.self().setVariable("shape", "square");
        }
        else {
          SelfManager.self().setVariable("shape", "circle");
        }
        SelfManager.self().setVariable("size", 0.5);
        if (Prims.lt(Prims.randomFloat(100), 5)) {
          SelfManager.self().setVariable("infected?", true);
          SelfManager.self().setVariable("susceptible?", false);
          SelfManager.self().setVariable("infection-length", Prims.random(SelfManager.self().getVariable("recovery-time")));
        }
        if ((!SelfManager.self().getVariable("infected?") && Prims.lt(Prims.randomFloat(100), world.observer.getGlobal("inoculation-chance")))) {
          SelfManager.self().setVariable("inoculated?", true);
          SelfManager.self().setVariable("susceptible?", false);
        }
        else {
          SelfManager.self().setVariable("inoculated?", false);
        }
        procedures["ASSIGN-COLOR"]();
      }, true);
      if (world.observer.getGlobal("links?")) {
        procedures["MAKE-NETWORK"]();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupPeople"] = temp;
  procs["SETUP-PEOPLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-ambulance"), "").ask(function() {
        if (Prims.lt(Prims.random(2), 1)) {
          SelfManager.self().setVariable("continent", 1);
          SelfManager.self().setXY(Prims.div( -world.topology.maxPxcor, 2), 0);
        }
        else {
          SelfManager.self().setVariable("continent", 2);
          SelfManager.self().setXY(Prims.div(world.topology.maxPxcor, 2), 0);
        }
        SelfManager.self().setVariable("cured?", false);
        SelfManager.self().setVariable("isolated?", false);
        SelfManager.self().setVariable("hospitalized?", false);
        SelfManager.self().setVariable("infected?", false);
        SelfManager.self().setVariable("inoculated?", false);
        SelfManager.self().setVariable("susceptible?", false);
        SelfManager.self().setVariable("ambulance?", true);
        SelfManager.self().setVariable("shape", "person");
        SelfManager.self().setVariable("color", 45);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupAmbulance"] = temp;
  procs["SETUP-AMBULANCE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("isolation-tendency", Prims.div(Prims.randomNormal(world.observer.getGlobal("average-isolation-tendency"), world.observer.getGlobal("average-isolation-tendency")), 4));
      SelfManager.self().setVariable("hospital-going-tendency", Prims.div(Prims.randomNormal(world.observer.getGlobal("average-hospital-going-tendency"), world.observer.getGlobal("average-hospital-going-tendency")), 4));
      SelfManager.self().setVariable("recovery-time", Prims.div(Prims.randomNormal(world.observer.getGlobal("average-recovery-time"), world.observer.getGlobal("average-recovery-time")), 4));
      if (Prims.gt(SelfManager.self().getVariable("recovery-time"), (world.observer.getGlobal("average-recovery-time") * 2))) {
        SelfManager.self().setVariable("recovery-time", (world.observer.getGlobal("average-recovery-time") * 2));
      }
      if (Prims.lt(SelfManager.self().getVariable("recovery-time"), 0)) {
        SelfManager.self().setVariable("recovery-time", 0);
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["assignTendency"] = temp;
  procs["ASSIGN-TENDENCY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["assignColor"] = temp;
  procs["ASSIGN-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtles().ask(function() {
        LinkPrims.createLinksWith(Prims.turtlesOn(SelfManager.self().getNeighbors()), "LINKS").ask(function() {}, false);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeNetwork"] = temp;
  procs["MAKE-NETWORK"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (world.turtles().agentAll(function() { return !SelfManager.self().getVariable("infected?"); })) {
        throw new Exception.StopInterrupt;
      }
      world.turtles().ask(function() { procedures["CLEAR-COUNT"](); }, true);
      world.turtles().ask(function() {
        if (((!SelfManager.self().getVariable("isolated?") && !SelfManager.self().getVariable("hospitalized?")) && !SelfManager.self().getVariable("ambulance?"))) {
          procedures["MOVE"]();
        }
      }, true);
      world.turtles().ask(function() {
        if (((SelfManager.self().getVariable("infected?") && !SelfManager.self().getVariable("isolated?")) && !SelfManager.self().getVariable("hospitalized?"))) {
          procedures["INFECT"]();
        }
      }, true);
      world.turtles().ask(function() {
        if ((((!SelfManager.self().getVariable("isolated?") && !SelfManager.self().getVariable("hospitalized?")) && SelfManager.self().getVariable("infected?")) && Prims.lt(Prims.random(100), SelfManager.self().getVariable("isolation-tendency")))) {
          procedures["ISOLATE"]();
        }
      }, true);
      world.turtles().ask(function() {
        if ((((!SelfManager.self().getVariable("isolated?") && !SelfManager.self().getVariable("hospitalized?")) && SelfManager.self().getVariable("infected?")) && Prims.lt(Prims.random(100), SelfManager.self().getVariable("hospital-going-tendency")))) {
          procedures["HOSPITALIZE"]();
        }
      }, true);
      world.turtles().ask(function() {
        if (SelfManager.self().getVariable("ambulance?")) {
          procedures["MOVE"]();
          Prims.turtlesOn(SelfManager.self().getNeighbors()).ask(function() {
            if ((Prims.equality(SelfManager.self().getVariable("ambulance?"), false) && Prims.equality(SelfManager.self().getVariable("infected?"), true))) {
              procedures["HOSPITALIZE"]();
            }
          }, true);
        }
      }, true);
      world.turtles().ask(function() {
        if (SelfManager.self().getVariable("infected?")) {
          procedures["MAYBE-RECOVER"]();
        }
      }, true);
      world.turtles().ask(function() {
        if (((SelfManager.self().getVariable("isolated?") || SelfManager.self().getVariable("hospitalized?")) && SelfManager.self().getVariable("cured?"))) {
          procedures["UNISOLATE"]();
        }
      }, true);
      world.turtles().ask(function() {
        procedures["ASSIGN-COLOR"]();
        procedures["CALCULATE-R0"]();
      }, true);
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
      if (world.observer.getGlobal("travel?")) {
        if ((Prims.lt(Prims.random(100), world.observer.getGlobal("travel-tendency")) && !SelfManager.self().getVariable("ambulance?"))) {
          SelfManager.self().setVariable("xcor",  -SelfManager.self().getVariable("xcor"));
        }
      }
      if (Prims.equality(SelfManager.self().getVariable("continent"), 1)) {
        if (Prims.gt(SelfManager.self().getVariable("xcor"),  -0.5)) {
          world.observer.setGlobal("angle", Prims.randomFloat(180));
          let newPatch = SelfManager.self().patchAtHeadingAndDistance(world.observer.getGlobal("angle"), -1); letVars['newPatch'] = newPatch;
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
          let newPatch = SelfManager.self().patchAtHeadingAndDistance(world.observer.getGlobal("angle"), 1); letVars['newPatch'] = newPatch;
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
      SelfManager.self().setVariable("nb-infected", 0);
      SelfManager.self().setVariable("nb-recovered", 0);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["clearCount"] = temp;
  procs["CLEAR-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("infection-length", (SelfManager.self().getVariable("infection-length") + 1));
      if (!SelfManager.self().getVariable("hospitalized?")) {
        if (Prims.gt(SelfManager.self().getVariable("infection-length"), SelfManager.self().getVariable("recovery-time"))) {
          if (Prims.lt(Prims.randomFloat(100), world.observer.getGlobal("recovery-chance"))) {
            SelfManager.self().setVariable("infected?", false);
            SelfManager.self().setVariable("cured?", true);
            SelfManager.self().setVariable("nb-recovered", (SelfManager.self().getVariable("nb-recovered") + 1));
          }
        }
      }
      else {
        if (Prims.gt(SelfManager.self().getVariable("infection-length"), Prims.div(SelfManager.self().getVariable("recovery-time"), 5))) {
          SelfManager.self().setVariable("infected?", false);
          SelfManager.self().setVariable("cured?", true);
          SelfManager.self().setVariable("nb-recovered", (SelfManager.self().getVariable("nb-recovered") + 1));
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
  procs["maybeRecover"] = temp;
  procs["MAYBE-RECOVER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("isolated?", true);
      SelfManager.self().moveTo(SelfManager.self().getPatchHere());
      SelfManager.self().patchAt(0, 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", (5 - 3)); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["isolate"] = temp;
  procs["ISOLATE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("isolated?", false);
      SelfManager.self().setVariable("hospitalized?", false);
      SelfManager.self().patchAt(0, 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
      world.observer.getGlobal("border").ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
      world.getPatchAt(Prims.div( -world.topology.maxPxcor, 2), 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
      world.getPatchAt(Prims.div(world.topology.maxPxcor, 2), 0).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["unisolate"] = temp;
  procs["UNISOLATE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("hospitalized?", true);
      SelfManager.self().setPatchVariable("pcolor", 0);
      if (Prims.equality(SelfManager.self().getVariable("continent"), 1)) {
        SelfManager.self().moveTo(world.getPatchAt(Prims.div( -world.topology.maxPxcor, 2), 0));
      }
      else {
        SelfManager.self().moveTo(world.getPatchAt(Prims.div(world.topology.maxPxcor, 2), 0));
      }
      SelfManager.self().setPatchVariable("pcolor", 9.9);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["hospitalize"] = temp;
  procs["HOSPITALIZE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let caller = SelfManager.self(); letVars['caller'] = caller;
      let nearbyUninfected = Prims.turtlesOn(SelfManager.self().getNeighbors()).agentFilter(function() {
        return ((!SelfManager.self().getVariable("infected?") && !SelfManager.self().getVariable("cured?")) && !SelfManager.self().getVariable("inoculated?"));
      }); letVars['nearbyUninfected'] = nearbyUninfected;
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
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["infect"] = temp;
  procs["INFECT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let newInfected = ListPrims.sum(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("nb-infected"); })); letVars['newInfected'] = newInfected;
      let newRecovered = ListPrims.sum(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("nb-recovered"); })); letVars['newRecovered'] = newRecovered;
      world.observer.setGlobal("nb-infected-previous", ((world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size() + newRecovered) - newInfected));
      let susceptibleT = ((world.observer.getGlobal("initial-people") - world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size()) - world.turtles().agentFilter(function() { return SelfManager.self().getVariable("cured?"); }).size()); letVars['susceptibleT'] = susceptibleT;
      let s0 = world.turtles().agentFilter(function() { return SelfManager.self().getVariable("susceptible?"); }).size(); letVars['s0'] = s0;
      if (Prims.lt(world.observer.getGlobal("nb-infected-previous"), 10)) {
        world.observer.setGlobal("beta-n", 0);
      }
      else {
        world.observer.setGlobal("beta-n", Prims.div(newInfected, world.observer.getGlobal("nb-infected-previous")));
      }
      if (Prims.lt(world.observer.getGlobal("nb-infected-previous"), 5)) {
        world.observer.setGlobal("gamma", 0);
      }
      else {
        world.observer.setGlobal("gamma", Prims.div(newRecovered, world.observer.getGlobal("nb-infected-previous")));
      }
      if ((!Prims.equality((world.observer.getGlobal("initial-people") - susceptibleT), 0) && !Prims.equality(susceptibleT, 0))) {
        world.observer.setGlobal("r0", Prims.div(NLMath.ln(Prims.div(s0, susceptibleT)), (world.observer.getGlobal("initial-people") - susceptibleT)));
        world.observer.setGlobal("r0", (world.observer.getGlobal("r0") * s0));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["calculateR0"] = temp;
  procs["CALCULATE-R0"] = temp;
  return procs;
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
