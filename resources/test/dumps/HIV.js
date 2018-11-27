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
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person lefty":{"name":"person lefty","editableColorIndex":0,"rotate":false,"elements":[{"x":170,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,180,150,165,195,210,225,255,270,240,255],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":187,"ymin":79,"xmax":232,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,300,285,225],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,120,135,195],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person righty":{"name":"person righty","editableColorIndex":0,"rotate":false,"elements":[{"x":50,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[45,60,30,45,75,90,105,135,150,120,135],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":67,"ymin":79,"xmax":112,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,180,165,105],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[45,0,15,75],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
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
        var fileText = out.join(" ");
        trueImportWorld(fileText);
      }
},
    exportFile: function(str) {
      return function(filepath) {
        var Paths = Java.type('java.nio.file.Paths');
        var Files = Java.type('java.nio.file.Files');
        var UTF8  = Java.type('java.nio.charset.StandardCharsets').UTF_8;
        Files.createDirectories(Paths.get(filepath).getParent());
        var StringClass = Java.type('java.lang.String');
        var path  = Files.write(Paths.get(filepath), (new StringClass(str)).getBytes());
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
    write: function(str) { console.log(str); }
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
  var pens    = [new PenBundle.Pen('HIV-', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Populations', 'HIV-')(function() {
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
  }),
  new PenBundle.Pen('HIV+', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Populations', 'HIV+')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles().agentFilter(function() { return SelfManager.self().getVariable("known?"); }).size());
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
  new PenBundle.Pen('HIV?', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Populations', 'HIV?')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue((world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size() - world.turtles().agentFilter(function() { return SelfManager.self().getVariable("known?"); }).size()));
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
      return plotManager.withTemporaryContext('Populations', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, (world.observer.getGlobal("initial-people") + 50));
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
  return new Plot(name, pens, plotOps, "weeks", "people", true, true, 0, 52, 0, 350, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["infected?", "known?", "infection-length", "coupled?", "couple-length", "commitment", "coupling-tendency", "condom-use", "test-frequency", "partner"], [])('globals [   infection-chance  ;; The chance out of 100 that an infected person will pass on                     ;;   infection during one week of couplehood.   symptoms-show     ;; How long a person will be infected before symptoms occur                     ;;   which may cause the person to get tested.   slider-check-1    ;; Temporary variables for slider values, so that if sliders   slider-check-2    ;;   are changed on the fly, the model will notice and   slider-check-3    ;;   change people\'s tendencies appropriately.   slider-check-4 ]  turtles-own [   infected?          ;; If true, the person is infected.  It may be known or unknown.   known?             ;; If true, the infection is known (and infected? must also be true).   infection-length   ;; How long the person has been infected.   coupled?           ;; If true, the person is in a sexually active couple.   couple-length      ;; How long the person has been in a couple.   ;; the next four values are controlled by sliders   commitment         ;; How long the person will stay in a couple-relationship.   coupling-tendency  ;; How likely the person is to join a couple.   condom-use         ;; The percent chance a person uses protection.   test-frequency     ;; Number of times a person will get tested per year.   partner            ;; The person that is our current partner in a couple. ]  ;;; ;;; SETUP PROCEDURES ;;;  to setup   clear-all   setup-globals   setup-people   reset-ticks end  to setup-globals   set infection-chance 50    ;; if you have unprotected sex with an infected partner,                              ;; you have a 50% chance of being infected   set symptoms-show 200    ;; symptoms show up 200 weeks after infection   set slider-check-1 average-commitment   set slider-check-2 average-coupling-tendency   set slider-check-3 average-condom-use   set slider-check-4 average-test-frequency end  ;; Create carrying-capacity number of people half are righty and half are lefty ;;   and some are sick.  Also assigns colors to people with the ASSIGN-COLORS routine.  to setup-people   create-turtles initial-people     [ setxy random-xcor random-ycor       set known? false       set coupled? false       set partner nobody       ifelse random 2 = 0         [ set shape \"person righty\" ]         [ set shape \"person lefty\" ]       ;; 2.5% of the people start out infected, but they don\'t know it       set infected? (who < initial-people * 0.025)       if infected?         [ set infection-length random-float symptoms-show ]       assign-commitment       assign-coupling-tendency       assign-condom-use       assign-test-frequency       assign-color ] end  ;; Different people are displayed in 3 different colors depending on health ;; green is not infected ;; blue is infected but doesn\'t know it ;; red is infected and knows it  to assign-color  ;; turtle procedure   ifelse not infected?     [ set color green ]     [ ifelse known?       [ set color red ]       [ set color blue ] ] end  ;; The following four procedures assign core turtle variables.  They use ;; the helper procedure RANDOM-NEAR so that the turtle variables have an ;; approximately \"normal\" distribution around the average values set by ;; the sliders.  to assign-commitment  ;; turtle procedure   set commitment random-near average-commitment end  to assign-coupling-tendency  ;; turtle procedure   set coupling-tendency random-near average-coupling-tendency end  to assign-condom-use  ;; turtle procedure   set condom-use random-near average-condom-use end  to assign-test-frequency  ;; turtle procedure   set test-frequency random-near average-test-frequency end  to-report random-near [center]  ;; turtle procedure   let result 0   repeat 40     [ set result (result + random-float center) ]   report result / 20 end  ;;; ;;; GO PROCEDURES ;;;  to go   if all? turtles [known?]     [ stop ]   check-sliders   ask turtles     [ if infected?         [ set infection-length infection-length + 1 ]       if coupled?         [ set couple-length couple-length + 1 ] ]   ask turtles     [ if not coupled?         [ move ] ]   ;; Righties are always the ones to initiate mating.  This is purely   ;; arbitrary choice which makes the coding easier.   ask turtles     [ if not coupled? and shape = \"person righty\" and (random-float 10 < coupling-tendency)         [ couple ] ]   ask turtles [ uncouple ]   ask turtles [ infect ]   ask turtles [ test ]   ask turtles [ assign-color ]   tick end  ;; Each tick a check is made to see if sliders have been changed. ;; If one has been, the corresponding turtle variable is adjusted  to check-sliders   if (slider-check-1 != average-commitment)     [ ask turtles [ assign-commitment ]       set slider-check-1 average-commitment ]   if (slider-check-2 != average-coupling-tendency)     [ ask turtles [ assign-coupling-tendency ]       set slider-check-2 average-coupling-tendency ]   if (slider-check-3 != average-condom-use)     [ ask turtles [ assign-condom-use ]       set slider-check-3 average-condom-use ]   if (slider-check-4 != average-test-frequency )     [ ask turtles [ assign-test-frequency ]       set slider-check-4 average-test-frequency ] end  ;; People move about at random.  to move  ;; turtle procedure   rt random-float 360   fd 1 end  ;; People have a chance to couple depending on their tendency to have sex and ;; if they meet.  To better show that coupling has occurred, the patches below ;; the couple turn gray.  to couple  ;; turtle procedure -- righties only!   let potential-partner one-of (turtles-at -1 0)                           with [not coupled? and shape = \"person lefty\"]   if potential-partner != nobody     [ if random-float 10 < [coupling-tendency] of potential-partner       [ set partner potential-partner         set coupled? true         ask partner [ set coupled? true ]         ask partner [ set partner myself ]         move-to patch-here ;; move to center of patch         ask potential-partner [move-to patch-here] ;; partner moves to center of patch         set pcolor gray - 3         ask (patch-at -1 0) [ set pcolor gray - 3 ] ] ] end  ;; If two peoples are together for longer than either person\'s commitment variable ;; allows, the couple breaks up.  to uncouple  ;; turtle procedure   if coupled? and (shape = \"person righty\")     [ if (couple-length > commitment) or          ([couple-length] of partner) > ([commitment] of partner)         [ set coupled? false           set couple-length 0           ask partner [ set couple-length 0 ]           set pcolor black           ask (patch-at -1 0) [ set pcolor black ]           ask partner [ set partner nobody ]           ask partner [ set coupled? false ]           set partner nobody ] ] end  ;; Infection can occur if either person is infected, but the infection is unknown. ;; This model assumes that people with known infections will continue to couple, ;; but will automatically practice safe sex, regardless of their condom-use tendency. ;; Note also that for condom use to occur, both people must want to use one.  If ;; either person chooses not to use a condom, infection is possible.  Changing the ;; primitive to AND in the third line will make it such that if either person ;; wants to use a condom, infection will not occur.  to infect  ;; turtle procedure   if coupled? and infected? and not known?     [ if random-float 10 > condom-use or          random-float 10 > ([condom-use] of partner)         [ if random-float 100 < infection-chance             [ ask partner [ set infected? true ] ] ] ] end  ;; People have a tendency to check out their health status based on a slider value. ;; This tendency is checked against a random number in this procedure. However, after being infected for ;; some amount of time called SYMPTOMS-SHOW, there is a 5% chance that the person will ;; become ill and go to a doctor and be tested even without the tendency to check.  to test  ;; turtle procedure   if random-float 52 < test-frequency     [ if infected?         [ set known? true ] ]   if infection-length > symptoms-show     [ if random-float 100 < 5         [ set known? true ] ] end  ;;; ;;; MONITOR PROCEDURES ;;;  to-report %infected   ifelse any? turtles     [ report (count turtles with [infected?] / count turtles) * 100 ]     [ report 0 ] end   ; Copyright 1997 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":288,"top":10,"right":721,"bottom":444,"dimensions":{"minPxcor":-12,"maxPxcor":12,"minPycor":-12,"maxPycor":12,"patchSize":17,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"weeks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"setup","left":12,"top":81,"right":95,"bottom":114,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"go","left":96,"top":81,"right":179,"bottom":114,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"%INFECTED\"]()","source":"%infected","left":184,"top":74,"right":267,"bottom":119,"display":"% infected","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"50","compiledMax":"500","compiledStep":"1","variable":"initial-people","left":7,"top":37,"right":276,"bottom":70,"display":"initial-people","min":"50","max":"500","default":300,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"200","compiledStep":"1","variable":"average-commitment","left":7,"top":162,"right":276,"bottom":195,"display":"average-commitment","min":"1","max":"200","default":50,"step":"1","units":"weeks","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10","compiledStep":"1","variable":"average-coupling-tendency","left":7,"top":127,"right":276,"bottom":160,"display":"average-coupling-tendency","min":"0","max":"10","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10","compiledStep":"1","variable":"average-condom-use","left":7,"top":197,"right":276,"bottom":230,"display":"average-condom-use","min":"0","max":"10","default":0,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"2","compiledStep":"0.01","variable":"average-test-frequency","left":7,"top":232,"right":276,"bottom":265,"display":"average-test-frequency","min":"0","max":"2","default":0,"step":"0.01","units":"times/year","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Populations', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setYRange(0, (world.observer.getGlobal(\"initial-people\") + 50));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Populations', 'HIV-')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles().agentFilter(function() { return !SelfManager.self().getVariable(\"infected?\"); }).size());       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"HIV-","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [not infected?]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Populations', 'HIV+')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles().agentFilter(function() { return SelfManager.self().getVariable(\"known?\"); }).size());       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"HIV+","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [known?]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Populations', 'HIV?')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue((world.turtles().agentFilter(function() { return SelfManager.self().getVariable(\"infected?\"); }).size() - world.turtles().agentFilter(function() { return SelfManager.self().getVariable(\"known?\"); }).size()));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"HIV?","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [infected?] - count turtles with [known?]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Populations","left":7,"top":268,"right":276,"bottom":467,"xAxis":"weeks","yAxis":"people","xmin":0,"xmax":52,"ymin":0,"ymax":350,"autoPlotOn":true,"legendOn":true,"setupCode":"set-plot-y-range 0 (initial-people + 50)","updateCode":"","pens":[{"display":"HIV-","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [not infected?]","type":"pen"},{"display":"HIV+","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [known?]","type":"pen"},{"display":"HIV?","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [infected?] - count turtles with [known?]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["initial-people", "average-commitment", "average-coupling-tendency", "average-condom-use", "average-test-frequency", "infection-chance", "symptoms-show", "slider-check-1", "slider-check-2", "slider-check-3", "slider-check-4"], ["initial-people", "average-commitment", "average-coupling-tendency", "average-condom-use", "average-test-frequency"], [], -12, 12, -12, 12, 17, true, true, turtleShapes, linkShapes, function(){});
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
      procedures["SETUP-GLOBALS"]();
      procedures["SETUP-PEOPLE"]();
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
      world.observer.setGlobal("infection-chance", 50);
      world.observer.setGlobal("symptoms-show", 200);
      world.observer.setGlobal("slider-check-1", world.observer.getGlobal("average-commitment"));
      world.observer.setGlobal("slider-check-2", world.observer.getGlobal("average-coupling-tendency"));
      world.observer.setGlobal("slider-check-3", world.observer.getGlobal("average-condom-use"));
      world.observer.setGlobal("slider-check-4", world.observer.getGlobal("average-test-frequency"));
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
        SelfManager.self().setVariable("known?", false);
        SelfManager.self().setVariable("coupled?", false);
        SelfManager.self().setVariable("partner", Nobody);
        if (Prims.equality(Prims.random(2), 0)) {
          SelfManager.self().setVariable("shape", "person righty");
        }
        else {
          SelfManager.self().setVariable("shape", "person lefty");
        }
        SelfManager.self().setVariable("infected?", Prims.lt(SelfManager.self().getVariable("who"), (world.observer.getGlobal("initial-people") * 0.025)));
        if (SelfManager.self().getVariable("infected?")) {
          SelfManager.self().setVariable("infection-length", Prims.randomFloat(world.observer.getGlobal("symptoms-show")));
        }
        procedures["ASSIGN-COMMITMENT"]();
        procedures["ASSIGN-COUPLING-TENDENCY"]();
        procedures["ASSIGN-CONDOM-USE"]();
        procedures["ASSIGN-TEST-FREQUENCY"]();
        procedures["ASSIGN-COLOR"]();
      }, true);
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
      if (!SelfManager.self().getVariable("infected?")) {
        SelfManager.self().setVariable("color", 55);
      }
      else {
        if (SelfManager.self().getVariable("known?")) {
          SelfManager.self().setVariable("color", 15);
        }
        else {
          SelfManager.self().setVariable("color", 105);
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
  procs["assignColor"] = temp;
  procs["ASSIGN-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("commitment", procedures["RANDOM-NEAR"](world.observer.getGlobal("average-commitment")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["assignCommitment"] = temp;
  procs["ASSIGN-COMMITMENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("coupling-tendency", procedures["RANDOM-NEAR"](world.observer.getGlobal("average-coupling-tendency")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["assignCouplingTendency"] = temp;
  procs["ASSIGN-COUPLING-TENDENCY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("condom-use", procedures["RANDOM-NEAR"](world.observer.getGlobal("average-condom-use")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["assignCondomUse"] = temp;
  procs["ASSIGN-CONDOM-USE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("test-frequency", procedures["RANDOM-NEAR"](world.observer.getGlobal("average-test-frequency")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["assignTestFrequency"] = temp;
  procs["ASSIGN-TEST-FREQUENCY"] = temp;
  temp = (function(center) {
    try {
      var reporterContext = true;
      var letVars = { };
      let result = 0; letVars['result'] = result;
      for (let _index_3704_3710 = 0, _repeatcount_3704_3710 = StrictMath.floor(40); _index_3704_3710 < _repeatcount_3704_3710; _index_3704_3710++){
        result = (result + Prims.randomFloat(center)); letVars['result'] = result;
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(result, 20)
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
  procs["randomNear"] = temp;
  procs["RANDOM-NEAR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (world.turtles().agentAll(function() { return SelfManager.self().getVariable("known?"); })) {
        throw new Exception.StopInterrupt;
      }
      procedures["CHECK-SLIDERS"]();
      world.turtles().ask(function() {
        if (SelfManager.self().getVariable("infected?")) {
          SelfManager.self().setVariable("infection-length", (SelfManager.self().getVariable("infection-length") + 1));
        }
        if (SelfManager.self().getVariable("coupled?")) {
          SelfManager.self().setVariable("couple-length", (SelfManager.self().getVariable("couple-length") + 1));
        }
      }, true);
      world.turtles().ask(function() {
        if (!SelfManager.self().getVariable("coupled?")) {
          procedures["MOVE"]();
        }
      }, true);
      world.turtles().ask(function() {
        if (((!SelfManager.self().getVariable("coupled?") && Prims.equality(SelfManager.self().getVariable("shape"), "person righty")) && Prims.lt(Prims.randomFloat(10), SelfManager.self().getVariable("coupling-tendency")))) {
          procedures["COUPLE"]();
        }
      }, true);
      world.turtles().ask(function() { procedures["UNCOUPLE"](); }, true);
      world.turtles().ask(function() { procedures["INFECT"](); }, true);
      world.turtles().ask(function() { procedures["TEST"](); }, true);
      world.turtles().ask(function() { procedures["ASSIGN-COLOR"](); }, true);
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
      if (!Prims.equality(world.observer.getGlobal("slider-check-1"), world.observer.getGlobal("average-commitment"))) {
        world.turtles().ask(function() { procedures["ASSIGN-COMMITMENT"](); }, true);
        world.observer.setGlobal("slider-check-1", world.observer.getGlobal("average-commitment"));
      }
      if (!Prims.equality(world.observer.getGlobal("slider-check-2"), world.observer.getGlobal("average-coupling-tendency"))) {
        world.turtles().ask(function() { procedures["ASSIGN-COUPLING-TENDENCY"](); }, true);
        world.observer.setGlobal("slider-check-2", world.observer.getGlobal("average-coupling-tendency"));
      }
      if (!Prims.equality(world.observer.getGlobal("slider-check-3"), world.observer.getGlobal("average-condom-use"))) {
        world.turtles().ask(function() { procedures["ASSIGN-CONDOM-USE"](); }, true);
        world.observer.setGlobal("slider-check-3", world.observer.getGlobal("average-condom-use"));
      }
      if (!Prims.equality(world.observer.getGlobal("slider-check-4"), world.observer.getGlobal("average-test-frequency"))) {
        world.turtles().ask(function() { procedures["ASSIGN-TEST-FREQUENCY"](); }, true);
        world.observer.setGlobal("slider-check-4", world.observer.getGlobal("average-test-frequency"));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["checkSliders"] = temp;
  procs["CHECK-SLIDERS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().right(Prims.randomFloat(360));
      SelfManager.self()._optimalFdOne();
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
      let potentialPartner = SelfManager.self().turtlesAt(-1, 0)._optimalOneOfWith(function() {
        return (!SelfManager.self().getVariable("coupled?") && Prims.equality(SelfManager.self().getVariable("shape"), "person lefty"));
      }); letVars['potentialPartner'] = potentialPartner;
      if (!Prims.equality(potentialPartner, Nobody)) {
        if (Prims.lt(Prims.randomFloat(10), potentialPartner.projectionBy(function() { return SelfManager.self().getVariable("coupling-tendency"); }))) {
          SelfManager.self().setVariable("partner", potentialPartner);
          SelfManager.self().setVariable("coupled?", true);
          SelfManager.self().getVariable("partner").ask(function() { SelfManager.self().setVariable("coupled?", true); }, true);
          SelfManager.self().getVariable("partner").ask(function() { SelfManager.self().setVariable("partner", SelfManager.myself()); }, true);
          SelfManager.self().moveTo(SelfManager.self().getPatchHere());
          potentialPartner.ask(function() { SelfManager.self().moveTo(SelfManager.self().getPatchHere()); }, true);
          SelfManager.self().setPatchVariable("pcolor", (5 - 3));
          SelfManager.self()._optimalPatchWest().ask(function() { SelfManager.self().setPatchVariable("pcolor", (5 - 3)); }, true);
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
  procs["couple"] = temp;
  procs["COUPLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if ((SelfManager.self().getVariable("coupled?") && Prims.equality(SelfManager.self().getVariable("shape"), "person righty"))) {
        if ((Prims.gt(SelfManager.self().getVariable("couple-length"), SelfManager.self().getVariable("commitment")) || Prims.gt(SelfManager.self().getVariable("partner").projectionBy(function() { return SelfManager.self().getVariable("couple-length"); }), SelfManager.self().getVariable("partner").projectionBy(function() { return SelfManager.self().getVariable("commitment"); })))) {
          SelfManager.self().setVariable("coupled?", false);
          SelfManager.self().setVariable("couple-length", 0);
          SelfManager.self().getVariable("partner").ask(function() { SelfManager.self().setVariable("couple-length", 0); }, true);
          SelfManager.self().setPatchVariable("pcolor", 0);
          SelfManager.self()._optimalPatchWest().ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
          SelfManager.self().getVariable("partner").ask(function() { SelfManager.self().setVariable("partner", Nobody); }, true);
          SelfManager.self().getVariable("partner").ask(function() { SelfManager.self().setVariable("coupled?", false); }, true);
          SelfManager.self().setVariable("partner", Nobody);
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
  procs["uncouple"] = temp;
  procs["UNCOUPLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (((SelfManager.self().getVariable("coupled?") && SelfManager.self().getVariable("infected?")) && !SelfManager.self().getVariable("known?"))) {
        if ((Prims.gt(Prims.randomFloat(10), SelfManager.self().getVariable("condom-use")) || Prims.gt(Prims.randomFloat(10), SelfManager.self().getVariable("partner").projectionBy(function() { return SelfManager.self().getVariable("condom-use"); })))) {
          if (Prims.lt(Prims.randomFloat(100), world.observer.getGlobal("infection-chance"))) {
            SelfManager.self().getVariable("partner").ask(function() { SelfManager.self().setVariable("infected?", true); }, true);
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
  procs["infect"] = temp;
  procs["INFECT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(Prims.randomFloat(52), SelfManager.self().getVariable("test-frequency"))) {
        if (SelfManager.self().getVariable("infected?")) {
          SelfManager.self().setVariable("known?", true);
        }
      }
      if (Prims.gt(SelfManager.self().getVariable("infection-length"), world.observer.getGlobal("symptoms-show"))) {
        if (Prims.lt(Prims.randomFloat(100), 5)) {
          SelfManager.self().setVariable("known?", true);
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
  procs["test"] = temp;
  procs["TEST"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (!world.turtles().isEmpty()) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return (Prims.div(world.turtles().agentFilter(function() { return SelfManager.self().getVariable("infected?"); }).size(), world.turtles().size()) * 100)
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return 0
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
  procs["_percent_infected"] = temp;
  procs["%INFECTED"] = temp;
  return procs;
})();
world.observer.setGlobal("initial-people", 300);
world.observer.setGlobal("average-commitment", 50);
world.observer.setGlobal("average-coupling-tendency", 5);
world.observer.setGlobal("average-condom-use", 0);
world.observer.setGlobal("average-test-frequency", 0);