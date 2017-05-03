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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":16,"y":16,"diam":270,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":46,"y":46,"diam":210,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"clock":{"name":"clock","editableColorIndex":0,"rotate":true,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,128,143,143,158,158,173],"ycors":[31,75,75,150,150,75,75],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"hydrogen":{"name":"hydrogen","editableColorIndex":8,"rotate":true,"elements":[{"x":70,"y":70,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":130,"y":130,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false}]},"hydrogen-boosted":{"name":"hydrogen-boosted","editableColorIndex":8,"rotate":true,"elements":[{"x":70,"y":70,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":130,"y":130,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":0,"y":0,"diam":298,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"oxygen":{"name":"oxygen","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"oxygen-boosted":{"name":"oxygen-boosted","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"water":{"name":"water","editableColorIndex":0,"rotate":true,"elements":[{"x":75,"y":90,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"x":12,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":192,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false}]},"water-boosted":{"name":"water-boosted","editableColorIndex":0,"rotate":true,"elements":[{"x":75,"y":90,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"x":12,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":192,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
  var name    = 'Number of Molecules';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Oxygen', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Number of Molecules', 'Oxygen')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("number-oxygen-molecules"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('Hydrogen', plotOps.makePenOps, false, new PenBundle.State(5.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Number of Molecules', 'Hydrogen')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("number-hydrogen-molecules"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('Water', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Number of Molecules', 'Water')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("number-water-molecules"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
  return new Plot(name, pens, plotOps, "time", "count", true, true, 0.0, 10.0, 0.0, 50.0, setup, update);
})(), (function() {
  var name    = 'Gas Temp. vs. time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('gas temp.', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Gas Temp. vs. time', 'gas temp.')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("temperature"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
  return new Plot(name, pens, plotOps, "time", "temp.", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Pressure vs. time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('pressure', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Pressure vs. time', 'pressure')(function() {
        try {
          if (world.observer.getGlobal("box-intact?")) {
            plotManager.plotPoint(world.ticker.tickCount(), ListPrims.mean(world.observer.getGlobal("pressure-history")));
          }
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "GAS-MOLECULES", singular: "gas-molecule", varNames: ["speed", "mass", "energy", "last-collision", "molecule-type", "momentum-instant", "momentum-difference"] }, { name: "FLASHES", singular: "flash", varNames: ["birthday"] }, { name: "BROKEN-WALLS", singular: "broken-wall", varNames: [] }])([], [])(["initial-oxygen-molecules", "initial-gas-temperature", "bond-energy-released", "activation-energy", "initial-hydrogen-molecules", "pressure-limit-container", "show-wall-hits?", "highlight-product?", "tick-advance-amount", "max-tick-advance-amount", "box-edge", "avg-speed", "avg-energy", "length-horizontal-surface", "length-vertical-surface", "pressure-history", "pressure", "temperature", "box-intact?", "molecule-size", "margin-outside-box", "number-oxygen-molecules", "number-hydrogen-molecules", "number-water-molecules"], ["initial-oxygen-molecules", "initial-gas-temperature", "bond-energy-released", "activation-energy", "initial-hydrogen-molecules", "pressure-limit-container", "show-wall-hits?", "highlight-product?"], [], -20, 20, -20, 20, 10.0, false, false, turtleShapes, linkShapes, function(){});
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
      world.observer.setGlobal("max-tick-advance-amount", 0.01);
      world.observer.setGlobal("margin-outside-box", 4);
      world.observer.setGlobal("box-edge", (world.topology.maxPxcor - world.observer.getGlobal("margin-outside-box")));
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("FLASHES").getSpecialName(), "square")
      world.observer.setGlobal("molecule-size", 1.4);
      world.observer.setGlobal("pressure-history", [0, 0, 0, 0, 0, 0]);
      world.observer.setGlobal("box-intact?", true);
      world.observer.setGlobal("length-horizontal-surface", ((2 * (world.observer.getGlobal("box-edge") - 1)) + 1));
      world.observer.setGlobal("length-vertical-surface", ((2 * (world.observer.getGlobal("box-edge") - 1)) + 1));
      procedures["MAKE-BOX"]();
      procedures["MAKE-GAS-MOLECULES"]();
      procedures["UPDATE-VARIABLES"]();
      world.ticker.reset();
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      world.patches().agentFilter(function() {
        return ((Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (world.topology.maxPxcor - world.observer.getGlobal("margin-outside-box"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), (world.topology.maxPycor - world.observer.getGlobal("margin-outside-box")))) || (Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), (world.topology.maxPxcor - world.observer.getGlobal("margin-outside-box"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (world.topology.maxPycor - world.observer.getGlobal("margin-outside-box")))));
      }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 5); }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeBox"] = temp;
  procs["MAKE-BOX"] = temp;
  temp = (function() {
    try {
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-oxygen-molecules"), "GAS-MOLECULES").ask(function() {
        procedures["SETUP-INITIAL-OXYGEN-MOLECULES"]();
        procedures["RANDOM-POSITION"]();
      }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-hydrogen-molecules"), "GAS-MOLECULES").ask(function() {
        procedures["SETUP-INITIAL-HYDROGEN-MOLECULES"]();
        procedures["RANDOM-POSITION"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeGasMolecules"] = temp;
  procs["MAKE-GAS-MOLECULES"] = temp;
  temp = (function() {
    try {
      SelfManager.self().setVariable("size", world.observer.getGlobal("molecule-size"));
      SelfManager.self().setVariable("last-collision", Nobody);
      SelfManager.self().setVariable("shape", "hydrogen");
      SelfManager.self().setVariable("molecule-type", "hydrogen");
      SelfManager.self().setVariable("mass", 2);
      SelfManager.self().setVariable("momentum-difference", 0);
      SelfManager.self().setVariable("momentum-instant", 0);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupInitialHydrogenMolecules"] = temp;
  procs["SETUP-INITIAL-HYDROGEN-MOLECULES"] = temp;
  temp = (function() {
    try {
      SelfManager.self().setVariable("size", world.observer.getGlobal("molecule-size"));
      SelfManager.self().setVariable("last-collision", Nobody);
      SelfManager.self().setVariable("shape", "oxygen");
      SelfManager.self().setVariable("molecule-type", "oxygen");
      SelfManager.self().setVariable("mass", 16);
      SelfManager.self().setVariable("momentum-difference", 0);
      SelfManager.self().setVariable("momentum-instant", 0);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupInitialOxygenMolecules"] = temp;
  procs["SETUP-INITIAL-OXYGEN-MOLECULES"] = temp;
  temp = (function() {
    try {
      let openPatches = Nobody;
      let openPatch = Nobody;
      openPatches = world.patches().agentFilter(function() {
        return (Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (world.topology.maxPxcor - world.observer.getGlobal("margin-outside-box"))) && Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), (world.topology.maxPycor - world.observer.getGlobal("margin-outside-box"))));
      });
      openPatch = ListPrims.oneOf(openPatches);
      SelfManager.self().moveTo(openPatch);
      SelfManager.self().setVariable("heading", Prims.randomFloat(360));
      SelfManager.self().setVariable("energy", world.observer.getGlobal("initial-gas-temperature"));
      SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["randomPosition"] = temp;
  procs["RANDOM-POSITION"] = temp;
  temp = (function() {
    try {
      if (Prims.equality(world.turtleManager.turtlesOfBreed("GAS-MOLECULES").size(), 0)) {
        throw new Exception.StopInterrupt;
      }
      if (world.observer.getGlobal("box-intact?")) {
        world.turtleManager.turtlesOfBreed("GAS-MOLECULES").ask(function() { procedures["BOUNCE"](); }, true);
      }
      else {
        procedures["SHATTER-BOX"]();
      }
      world.turtleManager.turtlesOfBreed("GAS-MOLECULES").ask(function() {
        procedures["MOVE"]();
        procedures["CHECK-FOR-COLLISION"]();
      }, true);
      world.turtleManager.turtlesOfBreed("GAS-MOLECULES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "oxygen"); }).ask(function() { procedures["CHECK-FOR-REACTION"](); }, true);
      procedures["UPDATE-VARIABLES"]();
      procedures["CALCULATE-PRESSURE"]();
      if (Prims.gt(world.observer.getGlobal("pressure"), world.observer.getGlobal("pressure-limit-container"))) {
        world.observer.setGlobal("box-intact?", false);
      }
      procedures["CALCULATE-TICK-ADVANCE-AMOUNT"]();
      world.ticker.tickAdvance(world.observer.getGlobal("tick-advance-amount"));
      procedures["UPDATE-FLASH-VISUALIZATION"]();
      plotManager.updatePlots();
      notImplemented('display', undefined)();
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      if (!world.turtleManager.turtlesOfBreed("GAS-MOLECULES").isEmpty()) {
        world.observer.setGlobal("avg-speed", ListPrims.mean(world.turtleManager.turtlesOfBreed("GAS-MOLECULES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })));
        world.observer.setGlobal("avg-energy", ListPrims.mean(world.turtleManager.turtlesOfBreed("GAS-MOLECULES").projectionBy(function() { return SelfManager.self().getVariable("energy"); })));
        world.observer.setGlobal("temperature", world.observer.getGlobal("avg-energy"));
      }
      else {
        world.observer.setGlobal("avg-speed", 0);
        world.observer.setGlobal("avg-energy", 0);
        world.observer.setGlobal("temperature", 0);
      }
      world.observer.setGlobal("number-oxygen-molecules", world.turtleManager.turtlesOfBreed("GAS-MOLECULES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "oxygen"); }).size());
      world.observer.setGlobal("number-hydrogen-molecules", world.turtleManager.turtlesOfBreed("GAS-MOLECULES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"); }).size());
      world.observer.setGlobal("number-water-molecules", world.turtleManager.turtlesOfBreed("GAS-MOLECULES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "water"); }).size());
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      world.turtleManager.turtlesOfBreed("FLASHES").ask(function() {
        if (Prims.gt((world.ticker.tickCount() - SelfManager.self().getVariable("birthday")), 0.4)) {
          SelfManager.self().die();
        }
        SelfManager.self().setVariable("color", ListPrims.lput((255 - Prims.div((255 * (world.ticker.tickCount() - SelfManager.self().getVariable("birthday"))), 0.4)), [20, 20, 20]));
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateFlashVisualization"] = temp;
  procs["UPDATE-FLASH-VISUALIZATION"] = temp;
  temp = (function() {
    try {
      let newPatch = SelfManager.self().patchAhead(1);
      let newPx = newPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); });
      let newPy = newPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); });
      if ((!Prims.equality(NLMath.abs(newPx), world.observer.getGlobal("box-edge")) && !Prims.equality(NLMath.abs(newPy), world.observer.getGlobal("box-edge")))) {
        throw new Exception.StopInterrupt;
      }
      if (Prims.equality(NLMath.abs(newPx), world.observer.getGlobal("box-edge"))) {
        SelfManager.self().setVariable("heading",  -SelfManager.self().getVariable("heading"));
        SelfManager.self().setVariable("momentum-instant", Prims.div(NLMath.abs((((NLMath.sin(SelfManager.self().getVariable("heading")) * 2) * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed"))), world.observer.getGlobal("length-vertical-surface")));
        SelfManager.self().setVariable("momentum-difference", (SelfManager.self().getVariable("momentum-difference") + SelfManager.self().getVariable("momentum-instant")));
      }
      if (Prims.equality(NLMath.abs(newPy), world.observer.getGlobal("box-edge"))) {
        SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading")));
        SelfManager.self().setVariable("momentum-instant", Prims.div(NLMath.abs((((NLMath.cos(SelfManager.self().getVariable("heading")) * 2) * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed"))), world.observer.getGlobal("length-horizontal-surface")));
        SelfManager.self().setVariable("momentum-difference", (SelfManager.self().getVariable("momentum-difference") + SelfManager.self().getVariable("momentum-instant")));
      }
      if (world.observer.getGlobal("show-wall-hits?")) {
        world.getPatchAt(newPx, newPy).ask(function() { procedures["MAKE-A-FLASH"](); }, true);
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["bounce"] = temp;
  procs["BOUNCE"] = temp;
  temp = (function() {
    try {
      SelfManager.self().sprout(1, "TURTLES").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FLASHES"));
        SelfManager.self().setVariable("color", [20, 20, 20, 255]);
        SelfManager.self().setVariable("birthday", world.ticker.tickCount());
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeAFlash"] = temp;
  procs["MAKE-A-FLASH"] = temp;
  temp = (function() {
    try {
      let centerPatch = ListPrims.oneOf(world.patches().agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), 0) && Prims.equality(SelfManager.self().getPatchVariable("pycor"), 0));
      }));
      world.turtleManager.turtlesOfBreed("BROKEN-WALLS").ask(function() {
        SelfManager.self().setVariable("heading", SelfManager.self().towards(centerPatch));
        SelfManager.self().setVariable("heading", (SelfManager.self().getVariable("heading") + 180));
        if ((((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.maxPxcor) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.maxPycor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.minPxcor))) {
          SelfManager.self().die();
        }
        SelfManager.self().fd((world.observer.getGlobal("avg-speed") * world.observer.getGlobal("tick-advance-amount")));
      }, true);
      world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 5); }).ask(function() {
        SelfManager.self().sprout(1, "TURTLES").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("BROKEN-WALLS"));
          SelfManager.self().setVariable("color", 5);
          SelfManager.self().setVariable("shape", "square");
        }, true);
        SelfManager.self().setPatchVariable("pcolor", 0);
      }, true);
      world.turtleManager.turtlesOfBreed("FLASHES").ask(function() { SelfManager.self().die(); }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["shatterBox"] = temp;
  procs["SHATTER-BOX"] = temp;
  temp = (function() {
    try {
      if (!Prims.equality(SelfManager.self().patchAhead((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-advance-amount"))), SelfManager.self().getPatchHere())) {
        SelfManager.self().setVariable("last-collision", Nobody);
      }
      SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-advance-amount")));
      if ((((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.maxPxcor) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.minPxcor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.maxPycor))) {
        SelfManager.self().die();
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      world.observer.setGlobal("pressure", (100 * ListPrims.sum(world.turtleManager.turtlesOfBreed("GAS-MOLECULES").projectionBy(function() { return SelfManager.self().getVariable("momentum-difference"); }))));
      world.observer.setGlobal("pressure-history", ListPrims.lput(world.observer.getGlobal("pressure"), ListPrims.butFirst(world.observer.getGlobal("pressure-history"))));
      world.turtleManager.turtlesOfBreed("GAS-MOLECULES").ask(function() { SelfManager.self().setVariable("momentum-difference", 0); }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["calculatePressure"] = temp;
  procs["CALCULATE-PRESSURE"] = temp;
  temp = (function() {
    try {
      if (!world.turtleManager.turtlesOfBreed("GAS-MOLECULES").agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("speed"), 0); }).isEmpty()) {
        world.observer.setGlobal("tick-advance-amount", ListPrims.min(ListPrims.list(Prims.div(1, NLMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("GAS-MOLECULES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })))), world.observer.getGlobal("max-tick-advance-amount"))));
      }
      else {
        world.observer.setGlobal("tick-advance-amount", world.observer.getGlobal("max-tick-advance-amount"));
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["calculateTickAdvanceAmount"] = temp;
  procs["CALCULATE-TICK-ADVANCE-AMOUNT"] = temp;
  temp = (function() {
    try {
      world.clearDrawing();
      world.turtleManager.turtlesOfBreed("GAS-MOLECULES").ask(function() { SelfManager.self().penManager.raisePen(); }, true);
      ListPrims.oneOf(world.turtleManager.turtlesOfBreed("GAS-MOLECULES")).ask(function() {
        SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") * 10));
        SelfManager.self().setVariable("energy", procedures["ENERGY-FROM-SPEED"]());
        SelfManager.self().penManager.lowerPen();
      }, true);
      procedures["CALCULATE-TICK-ADVANCE-AMOUNT"]();
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["speedUpOneMolecule"] = temp;
  procs["SPEED-UP-ONE-MOLECULE"] = temp;
  temp = (function() {
    try {
      let hitHydrogen = SelfManager.self().breedHere("GAS-MOLECULES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"); });
      let thisInitialOxygenMoleculesEnergy = SelfManager.self().getVariable("energy");
      let totalEnergy = 0;
      if (Prims.gte(hitHydrogen.size(), 2)) {
        if (Prims.lt(SelfManager.self().getVariable("speed"), 0)) {
          SelfManager.self().setVariable("speed", 0);
        }
        let hydrogenReactants = ListPrims.nOf(2, hitHydrogen);
        let totalEnergyAllReactants = (thisInitialOxygenMoleculesEnergy + ListPrims.sum(hydrogenReactants.projectionBy(function() { return SelfManager.self().getVariable("energy"); })));
        if (Prims.gt(totalEnergyAllReactants, world.observer.getGlobal("activation-energy"))) {
          hydrogenReactants.ask(function() {
            if (world.observer.getGlobal("highlight-product?")) {
              SelfManager.self().setVariable("shape", "water-boosted");
            }
            else {
              SelfManager.self().setVariable("shape", "water");
            }
            SelfManager.self().setVariable("molecule-type", "water");
            SelfManager.self().setVariable("mass", 10);
            let totalEnergyProducts = (totalEnergyAllReactants + world.observer.getGlobal("bond-energy-released"));
            SelfManager.self().setVariable("energy", Prims.div(totalEnergyProducts, 2));
            SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
          }, true);
          SelfManager.self().die();
        }
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["checkForReaction"] = temp;
  procs["CHECK-FOR-REACTION"] = temp;
  temp = (function() {
    try {
      if (Prims.equality(SelfPrims._optimalCountOther(SelfManager.self().inRadius(SelfManager.self().breedHere("GAS-MOLECULES"), 1)), 1)) {
        let candidate = ListPrims.oneOf(SelfPrims.other(SelfManager.self().breedHere("GAS-MOLECULES").agentFilter(function() {
          return (Prims.lt(SelfManager.self(), SelfManager.myself()) && !Prims.equality(SelfManager.myself(), SelfManager.self().getVariable("last-collision")));
        })));
        if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfManager.self().getVariable("speed"), 0) || Prims.gt(candidate.projectionBy(function() { return SelfManager.self().getVariable("speed"); }), 0)))) {
          procedures["COLLIDE-WITH"](candidate);
          candidate.ask(function() { SelfManager.self().penManager.raisePen(); }, true);
          SelfManager.self().setVariable("last-collision", candidate);
          let thisCandidate = SelfManager.self();
          candidate.ask(function() { SelfManager.self().setVariable("last-collision", thisCandidate); }, true);
        }
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["checkForCollision"] = temp;
  procs["CHECK-FOR-COLLISION"] = temp;
  temp = (function(otherGasMolecules) {
    try {
      let mass2 = otherGasMolecules.projectionBy(function() { return SelfManager.self().getVariable("mass"); });
      let speed2 = otherGasMolecules.projectionBy(function() { return SelfManager.self().getVariable("speed"); });
      let heading2 = otherGasMolecules.projectionBy(function() { return SelfManager.self().getVariable("heading"); });
      let theta = Prims.randomFloat(360);
      let v1t = (SelfManager.self().getVariable("speed") * NLMath.cos((theta - SelfManager.self().getVariable("heading"))));
      let v1l = (SelfManager.self().getVariable("speed") * NLMath.sin((theta - SelfManager.self().getVariable("heading"))));
      let v2t = (speed2 * NLMath.cos((theta - heading2)));
      let v2l = (speed2 * NLMath.sin((theta - heading2)));
      let vcm = Prims.div(((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)), (SelfManager.self().getVariable("mass") + mass2));
      v1t = ((2 * vcm) - v1t);
      v2t = ((2 * vcm) - v2t);
      SelfManager.self().setVariable("speed", NLMath.sqrt((NLMath.pow(v1t, 2) + NLMath.pow(v1l, 2))));
      SelfManager.self().setVariable("energy", ((0.5 * SelfManager.self().getVariable("mass")) * NLMath.pow(SelfManager.self().getVariable("speed"), 2)));
      if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
        SelfManager.self().setVariable("heading", (theta - NLMath.atan(v1l, v1t)));
      }
      otherGasMolecules.ask(function() {
        SelfManager.self().setVariable("speed", NLMath.sqrt((NLMath.pow(v2t, 2) + NLMath.pow(v2l, 2))));
        SelfManager.self().setVariable("energy", ((0.5 * SelfManager.self().getVariable("mass")) * NLMath.pow(SelfManager.self().getVariable("speed"), 2)));
        if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
          SelfManager.self().setVariable("heading", (theta - NLMath.atan(v2l, v2t)));
        }
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      throw new Exception.ReportInterrupt(NLMath.sqrt(Prims.div((2 * SelfManager.self().getVariable("energy")), SelfManager.self().getVariable("mass"))));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["speedFromEnergy"] = temp;
  procs["SPEED-FROM-ENERGY"] = temp;
  temp = (function() {
    try {
      throw new Exception.ReportInterrupt((((0.5 * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed")) * SelfManager.self().getVariable("speed")));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["energyFromSpeed"] = temp;
  procs["ENERGY-FROM-SPEED"] = temp;
  return procs;
})();
world.observer.setGlobal("initial-oxygen-molecules", 64);
world.observer.setGlobal("initial-gas-temperature", 200);
world.observer.setGlobal("bond-energy-released", 3240);
world.observer.setGlobal("activation-energy", 2000);
world.observer.setGlobal("initial-hydrogen-molecules", 104);
world.observer.setGlobal("pressure-limit-container", 4000);
world.observer.setGlobal("show-wall-hits?", true);
world.observer.setGlobal("highlight-product?", true);
