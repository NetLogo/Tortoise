var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Errors = tortoise_require('util/errors');
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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":6,"rotate":false,"elements":[{"x1":84,"y1":255,"x2":146,"y2":267,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":123,"y1":241,"x2":136,"y2":264,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":121,"y1":193,"x2":152,"y2":202,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":150,"y1":225,"x2":180,"y2":210,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":180,"y1":210,"x2":204,"y2":160,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":186,"y1":199,"x2":223,"y2":196,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":171,"y1":214,"x2":224,"y2":226,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":151,"y1":277,"x2":200,"y2":254,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":122,"y1":192,"x2":85,"y2":168,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":138,"y1":199,"x2":114,"y2":147,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":122,"y1":240,"x2":94,"y2":221,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":146,"y1":303,"x2":151,"y2":228,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":152,"y1":224,"x2":150,"y2":105,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x":103,"y":73,"diam":32,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":133,"y":103,"diam":32,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":133,"y":43,"diam":32,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":163,"y":73,"diam":32,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":116,"y":53,"diam":32,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":152,"y":53,"diam":32,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":153,"y":91,"diam":32,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":115,"y":91,"diam":32,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":135,"y":75,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":6,"rotate":false,"elements":[{"x1":84,"y1":255,"x2":146,"y2":267,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":123,"y1":241,"x2":136,"y2":264,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":121,"y1":193,"x2":152,"y2":202,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":150,"y1":225,"x2":180,"y2":210,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":180,"y1":210,"x2":204,"y2":160,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":186,"y1":199,"x2":223,"y2":196,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":171,"y1":214,"x2":224,"y2":226,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":151,"y1":277,"x2":200,"y2":254,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":122,"y1":192,"x2":85,"y2":168,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":138,"y1":199,"x2":114,"y2":147,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":122,"y1":240,"x2":94,"y2":221,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":146,"y1":303,"x2":151,"y2":228,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true},{"x1":152,"y1":224,"x2":150,"y2":105,"type":"line","color":"rgba(44, 209, 59, 1)","filled":false,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'tolerances';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('left', plotOps.makePenOps, false, new PenBundle.State(55, 5, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tolerances', 'left')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtles().agentFilter(function() {
            return Prims.lt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
          }).projectionBy(function() { return SelfManager.self().getVariable("tolerance"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('right', plotOps.makePenOps, false, new PenBundle.State(105, 5, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tolerances', 'right')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtles().agentFilter(function() {
            return Prims.gt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
          }).projectionBy(function() { return SelfManager.self().getVariable("tolerance"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "metal tolerance", "#", false, true, 0, 110, 0, 50, setup, update);
})(), (function() {
  var name    = 'flower-times';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('left', plotOps.makePenOps, false, new PenBundle.State(55, 15, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('flower-times', 'left')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtles().agentFilter(function() {
            return Prims.lt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
          }).projectionBy(function() { return SelfManager.self().getVariable("flower-time"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('right', plotOps.makePenOps, false, new PenBundle.State(105, 15, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('flower-times', 'right')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.turtles().agentFilter(function() {
            return Prims.gt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
          }).projectionBy(function() { return SelfManager.self().getVariable("flower-time"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "flowering time", "#", false, true, 0, 380, 0, 10, setup, update);
})(), (function() {
  var name    = 'avg. tolerance';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('left', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('avg. tolerance', 'left')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (world.turtles()._optimalAnyWith(function() {
            return Prims.lt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
          })) {
            plotManager.plotPoint(world.observer.getGlobal("year"), PrimChecks.list.mean(world.turtles().agentFilter(function() {
              return Prims.lt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
            }).projectionBy(function() { return SelfManager.self().getVariable("tolerance"); })));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('right', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('avg. tolerance', 'right')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (world.turtles()._optimalAnyWith(function() {
            return Prims.gt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
          })) {
            plotManager.plotPoint(world.observer.getGlobal("year"), PrimChecks.list.mean(world.turtles().agentFilter(function() {
              return Prims.gt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
            }).projectionBy(function() { return SelfManager.self().getVariable("tolerance"); })));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "generations", "tolerance", false, true, 0, 10, 0, 100, setup, update);
})(), (function() {
  var name    = 'simultaneous flowering';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('simultaneous flowering', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if ((world.turtles()._optimalAnyWith(function() {
            return Prims.gt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
          }) && world.turtles()._optimalAnyWith(function() {
            return Prims.lt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
          }))) {
            let n = 0; letVars['n'] = n;
            let m = 0; letVars['m'] = m;
            let avg = PrimChecks.list.mean(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("tolerance"); })); letVars['avg'] = avg;
            for (let _index_215_221 = 0, _repeatcount_215_221 = StrictMath.floor(500); _index_215_221 < _repeatcount_215_221; _index_215_221++){
              let r = world.turtles()._optimalOneOfWith(function() {
                return Prims.gt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
              }); letVars['r'] = r;
              let s = world.turtles()._optimalOneOfWith(function() {
                return Prims.lt(SelfManager.self().getVariable("xcor"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));
              }); letVars['s'] = s;
              if (Prims.lt(NLMath.abs((r.projectionBy(function() { return SelfManager.self().getVariable("flower-time"); }) - s.projectionBy(function() { return SelfManager.self().getVariable("flower-time"); }))), world.observer.getGlobal("flower-duration"))) {
                m = (m + 1); letVars['m'] = m;
              }
              n = (n + 1); letVars['n'] = n;
            }
            world.observer.setGlobal("percent-same-flowering-time", NLMath.precision((PrimChecks.math.div(m, n) * 100), 1));
            plotManager.plotPoint(world.observer.getGlobal("year"), (PrimChecks.math.div(m, n) * 100));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "generations", "%", false, true, 0, 10, 0, 100, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["tolerance", "fitness", "flower-time", "seedling?", "will-die?"], [])('turtles-own [ tolerance fitness flower-time seedling? will-die? ] patches-own [ metal barrier? ]  globals [    day                             ;; monitor value    year                            ;; current year    old-year                        ;; previous year    end-of-days-counter             ;;    transition-time?                ;;    old-visualize-time-steps-state  ;; allows for switching between visualization modes during model run    chance-death-per-year           ;; the probability that the plant will die this year    chance-seed-dispersal           ;; the probability that a newborn plant grows in a patch adjacent to its parents\', instead of in the same patch.    average-number-offspring        ;; avg. number of seeds dispersed by the plant when it does disperse them    percent-same-flowering-time ]  to setup   clear-all   ;; initialize globals   set day 0   set old-year 0   set year 0   set end-of-days-counter 0   set percent-same-flowering-time 0   set chance-death-per-year 10 ;; set to 10% by default   set chance-seed-dispersal 50 ;; set to 50% by default   set average-number-offspring 3   set transition-time? false   set old-visualize-time-steps-state visualize-time-steps    ;color the frontier   ask patches [     set barrier? false     setup-two-regions     set pcolor calc-patch-color metal   ]    ;spawn the initial population -- carrying-capacity-per-patch allows more than plant at this patch   ask patches with [pxcor = min-pxcor] [     sprout plants-per-patch [       if initial-tolerance = \"all no tolerance\" [set tolerance 0]       if initial-tolerance = \"all full tolerance\" [set tolerance 100]       if initial-tolerance = \"random tolerances\" [set tolerance random-float 100]       set flower-time (365 / 2)       set heading random 360       fd random-float .5       set fitness 1       set shape \"plant\"       set seedling? false       set will-die? false       set color calc-plant-color tolerance     ]   ]   reset-ticks end   to setup-two-regions   ;; set the metal value based on the width designated by the frontier-sharpness slider value   set metal precision (100 / (1 + exp (frontier-sharpness * ((max-pxcor + min-pxcor) / 2 - pxcor)))) 0 end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;; RUNTIME PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to go    check-labels    ;; if visualization switched during model run, redraw plants    if old-visualize-time-steps-state != visualize-time-steps [      ask turtles [        redraw-plants-as-full-sized-plants      ]    ]    if visualize-time-steps = \"years\" [     set day 0 ;; always at day 0 in years mode     set year year + 1     ask turtles [ redraw-plants-as-full-sized-plants  ]     do-start-of-new-year-events   ]    if visualize-time-steps = \"days\" [     visualize-bloom     do-end-of-days-events   ]   tick end  to do-start-of-new-year-events   if year > old-year [     do-reproduction     mark-turtles-to-kill     kill-marked-turtles     set old-year year   ] end  to do-end-of-days-events   ifelse day = 365 [  ;; at end of year     if transition-time? = false  [       do-reproduction       mark-turtles-to-kill       set transition-time? true     ]     ;; 10 ticks of transition time will elapse between years when visualize-time-steps is in \"day\" mode     ;; this transition time is for animation events to show death and growth of new plants before the next     ;; year begins. It is done before day 0 of the new year so that these visualizations do not interfere     ;; with flower time speciation mechanisms in the model      if transition-time? [       set end-of-days-counter end-of-days-counter + 1       ;; grow the new plants to be visible for the next season       ask turtles with [seedling?] [visualize-seedling-growth]       ;; shrink and fade the plants that are going to die       ask turtles with [will-die?] [set size (1 - (end-of-days-counter / 10))]        if end-of-days-counter > 9 [  ;; start a new year         set year year + 1         set end-of-days-counter 0         set transition-time? false         set day 0         ask turtles [turn-seedlings-into-full-plants]         kill-marked-turtles       ]     ]   ]    ;; the else event   [set day day + 1] end  ;; make babies to do-reproduction   ask turtles [     ;; construct list of potential mates based on pollen-radius slider     let potential-mates []     let nearby-turtles turtles     if (pollen-radius < (max-pxcor - min-pxcor)) [set nearby-turtles turtles in-radius pollen-radius]     let num-candidates 10     ifelse count nearby-turtles < 10 [ set potential-mates (sort nearby-turtles) ]                                      [ set potential-mates (sort (n-of 10 nearby-turtles))                                        set potential-mates (fput self potential-mates)]      ;; pick mate randomly weighted by compatibility     let compatibilities map [ potential-mate -> compatibility self potential-mate] potential-mates     let mate (pick-weighted (potential-mates) (compatibilities))      ;; spawn children     hatch (random-poisson average-number-offspring) [       set seedling? true       set will-die? false       ifelse visualize-time-steps = \"days\" [ set size 0] [set size 1]        ;combine parents\' genes and give average value of to the child       if genetics-model = \"avg. genotype\" [         set tolerance (tolerance + [tolerance] of mate) / 2         set flower-time (flower-time + [flower-time] of mate) / 2       ]        ;mutate tolerance gene       if (random-float 100) < chance-tolerance-mutation [         set tolerance (tolerance + (random-normal 0 tolerance-mutation-stdev))       ;; set tolerance (tolerance + random tolerance-mutation - random tolerance-mutation)       ]        ;mutate flowering time gene       if (random-float 100) < chance-flower-time-mutation [         set flower-time (flower-time + (random-normal 0 flower-time-mutation-stdev))       ]        ;; keeps values from going above a min and max       if tolerance < 0 [ set tolerance  0 ]       if tolerance > 100 [ set tolerance 100 ]       if flower-time < 0 [ set flower-time 0 ]       if flower-time > 365 [ set flower-time 365 ]        ;change color to reflect metal tolerance       set color calc-plant-color tolerance       migrate-this-plant     ]     if plant-type = \"annual\" [set will-die? true] ;end of the generation   ] end  ;kill ill-adapted turtles and fix solve overpopulation to mark-turtles-to-kill   ask turtles [     let t tolerance / 100     let m metal / 100     ;; Fitness is a linear function dependent on tolerance whose slope and y-intercept     ;; vary linearly with respect to an increases in metal amount.     ;; This linear function would have the following slopes in various metal levels:     ;; (i.e. negative slope in clean ground -> high tolerance is bad     ;;       positive slope in dirty ground -> high tolerance is good     ;;       zero     slope in between      -> no benefit or disadvantage to any level of tolerance )      ;; This is a model of a \"tradeoff\", where specializing in one variation of trait is advantageous     ;; in one environmental extreme, but specializing in another variation of the trait is advantageous in a different     ;; environmental extreme. Intermediate \"hybridization\" or averaging between both variations is disadvantageous     ;; in both environments or at the very least it is not advantageous in either extreme environment.     ;; Such tradeoff models can lead to speciation when other traits permit a population to reproductively     ;; fragment and isolate itself into non-interbreeding sub populations.      ;; This makes for a hyperbolic paraboloid or saddle shaped function that is dependent on metal amount and     ;; tolerance.  A general form of this fitness function would be the following:     ;; set fitness ((1 +  (A * t * m + B * t * m - C * t * m) - ( A * t + B * m) ) )     ;; where fitness is 1 at clean ground and no tolerance     ;; A is the penalty (0 to 1) for having tolerance in clean ground, therefore fitness is (1 - A)     ;; B is the penalty (0 to 1) for having the highest level of metal in the ground and no tolerance, therefore fitness is (1 - B)     ;; C is the penalty (0 to 1) for having the highest tolerance in the highest level of metal, therefore fitness is (1 - C)     ;; As long as C is less than both B and A, then you will have a fitness function that can be used in this section     ;; The fitness function has been hard coded here to use A = .4 and B = .4 and C = 0         set fitness (1 - m) * (1 - .4 * t) + m * (1 - .4 * (1 - t))      ;; survival probability based on fitness     if (random-float 1) > (fitness) [set will-die? true]     ;; survival probability based on fixed number of additional deaths-a-year     if random-float 100 < chance-death-per-year [set will-die? true]   ]    ;; In overpopulated patches, kill the least fit plant until we are down to the carrying capacity   ask patches [     let overpopulation ((count turtles-here) - plants-per-patch)     if overpopulation > 0 [       ask (min-n-of overpopulation turtles-here [fitness]) [         set will-die? true       ]     ]   ] end  to migrate-this-plant ;; turtle procedure   ;; Some plants grow in patch adjacent to the parent plant. This represents migration from seed dispersal   if (random-float 100) < chance-seed-dispersal [     move-to one-of neighbors     rt random 360  fd random-float 0.45  ;;spread out plants that are on the same patch   ] end  to kill-marked-turtles     ask turtles with [will-die?] [die] end  to turn-seedlings-into-full-plants          if seedling? [set seedling? false]          redraw-plants-as-full-sized-plants end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;; visualization procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to check-labels   ask patches [   ifelse show-labels-as = \"metal in soil\"     [set plabel metal]     [set plabel \"\"]   ]   ask turtles [     if show-labels-as = \"metal tolerance\" [set label precision tolerance 0]     if show-labels-as = \"flower time\"  [set label precision flower-time 0 ]     if show-labels-as = \"none\" [set label \"\"]   ] end  to redraw-plants-as-full-sized-plants ;; turtle procedure   set shape \"plant\"   set size 1 end  to visualize-seedling-growth ;; turtle procedure   if seedling? [set size (end-of-days-counter / 10) ] end  to visualize-bloom   ask turtles [     ;; If day of the year is greater than this plants flower time and less than the flower time plus the length of flower time, then it is in the     ;; the flowering time window and a flower should be located here     ifelse day >= (flower-time  ) and day <= (flower-time + (flower-duration)  )        [ set shape \"flower\"]        [ set shape \"plant\" ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;; reporters  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;; make a random choice from <options> weighted by <weights> ;; where highly weighted choices are more likely to be selected than others to-report pick-weighted [ options weights ]   let wsum 0   foreach weights [ weight ->     set wsum (wsum + weight)   ]   let wret wsum * (random-float 1)   let ret 0   set wsum 0   foreach weights [ weight ->     set wsum (wsum + weight)     if wsum > wret [ report (item ret options) ]     set ret (ret + 1)   ] end  ;; compatibility is a decreasing function of the difference in flowering times ;; since plants that have more of an overlap between flower-times are more likely ;; they will pollinate one another to-report compatibility [ t1 t2 ]   let diff abs ([flower-time] of t1 - [flower-time] of t2)   ifelse diff < flower-duration [ report (flower-duration - diff) ] [ report 0 ] end  ;; calculate the patch color based on the presence of metal in the soil to-report calc-patch-color [ m ]   report rgb 0 (255 * (1 - (m / 100)) / 2) (255 * (m / 100) / 2) end  to-report calc-plant-color [ t ]   let black-pcolor rgb 0 0 0   ifelse barrier?     [report black-pcolor]     [report rgb 0 (255 * (1 - (t / 100)) ) (255 * (t / 100) )] end   ; Copyright 2012 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":512,"top":10,"right":1196,"bottom":279,"dimensions":{"minPxcor":0,"maxPxcor":25,"minPycor":0,"maxPycor":9,"patchSize":26,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":8,"top":10,"right":71,"bottom":43,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":74,"top":10,"right":163,"bottom":43,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"chance-tolerance-mutation","left":385,"top":308,"right":587,"bottom":341,"display":"chance-tolerance-mutation","min":"0","max":"100","default":10,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"tolerance-mutation-stdev","left":385,"top":342,"right":587,"bottom":375,"display":"tolerance-mutation-stdev","min":"0","max":"50","default":20,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('tolerances', 'left')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.drawHistogramFrom(world.turtles().agentFilter(function() {           return Prims.lt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));         }).projectionBy(function() { return SelfManager.self().getVariable(\"tolerance\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"left","interval":5,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"histogram [tolerance] of turtles with [xcor < (min-pxcor + max-pxcor) / 2]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('tolerances', 'right')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.drawHistogramFrom(world.turtles().agentFilter(function() {           return Prims.gt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));         }).projectionBy(function() { return SelfManager.self().getVariable(\"tolerance\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"right","interval":5,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"histogram [tolerance] of turtles with [xcor > (min-pxcor + max-pxcor) / 2]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"tolerances","left":345,"top":60,"right":510,"bottom":180,"xAxis":"metal tolerance","yAxis":"#","xmin":0,"xmax":110,"ymin":0,"ymax":50,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"left","interval":5,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"histogram [tolerance] of turtles with [xcor < (min-pxcor + max-pxcor) / 2]","type":"pen"},{"display":"right","interval":5,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"histogram [tolerance] of turtles with [xcor > (min-pxcor + max-pxcor) / 2]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"5","compiledStep":"1","variable":"plants-per-patch","left":9,"top":273,"right":161,"bottom":306,"display":"plants-per-patch","min":"1","max":"5","default":2,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0.1","compiledMax":"2","compiledStep":"0.1","variable":"frontier-sharpness","left":9,"top":241,"right":162,"bottom":274,"display":"frontier-sharpness","min":".1","max":"2","default":1,"step":".1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('flower-times', 'left')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.drawHistogramFrom(world.turtles().agentFilter(function() {           return Prims.lt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));         }).projectionBy(function() { return SelfManager.self().getVariable(\"flower-time\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"left","interval":15,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"histogram [flower-time ] of turtles with [xcor < (min-pxcor + max-pxcor) / 2]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('flower-times', 'right')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.drawHistogramFrom(world.turtles().agentFilter(function() {           return Prims.gt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));         }).projectionBy(function() { return SelfManager.self().getVariable(\"flower-time\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"right","interval":15,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"histogram [flower-time ] of turtles with [xcor > (min-pxcor + max-pxcor) / 2]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"flower-times","left":167,"top":60,"right":345,"bottom":180,"xAxis":"flowering time","yAxis":"#","xmin":0,"xmax":380,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"left","interval":15,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"histogram [flower-time ] of turtles with [xcor < (min-pxcor + max-pxcor) / 2]","type":"pen"},{"display":"right","interval":15,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"histogram [flower-time ] of turtles with [xcor > (min-pxcor + max-pxcor) / 2]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"chance-flower-time-mutation","left":167,"top":307,"right":381,"bottom":340,"display":"chance-flower-time-mutation","min":"0","max":"100","default":10,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"flower-time-mutation-stdev","left":168,"top":342,"right":380,"bottom":375,"display":"flower-time-mutation-stdev","min":"0","max":"100","default":10,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"pollen-radius","left":8,"top":307,"right":162,"bottom":340,"display":"pollen-radius","min":"0","max":"50","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('avg. tolerance', 'left')(function() {       try {         var reporterContext = false;         var letVars = { };         if (world.turtles()._optimalAnyWith(function() {           return Prims.lt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));         })) {           plotManager.plotPoint(world.observer.getGlobal(\"year\"), PrimChecks.list.mean(world.turtles().agentFilter(function() {             return Prims.lt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));           }).projectionBy(function() { return SelfManager.self().getVariable(\"tolerance\"); })));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"left","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"if any? turtles with [ xcor < (min-pxcor + max-pxcor) / 2] [   plotxy year (mean [tolerance] of turtles with [xcor < (min-pxcor + max-pxcor) / 2])   ]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('avg. tolerance', 'right')(function() {       try {         var reporterContext = false;         var letVars = { };         if (world.turtles()._optimalAnyWith(function() {           return Prims.gt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));         })) {           plotManager.plotPoint(world.observer.getGlobal(\"year\"), PrimChecks.list.mean(world.turtles().agentFilter(function() {             return Prims.gt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));           }).projectionBy(function() { return SelfManager.self().getVariable(\"tolerance\"); })));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"right","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"if any? turtles with [ xcor > (min-pxcor + max-pxcor) / 2] [   plotxy year (mean [tolerance] of turtles with [xcor > (min-pxcor + max-pxcor) / 2])   ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"avg. tolerance","left":345,"top":179,"right":510,"bottom":299,"xAxis":"generations","yAxis":"tolerance","xmin":0,"xmax":10,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"left","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"if any? turtles with [ xcor < (min-pxcor + max-pxcor) / 2] [   plotxy year (mean [tolerance] of turtles with [xcor < (min-pxcor + max-pxcor) / 2])   ]","type":"pen"},{"display":"right","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"if any? turtles with [ xcor > (min-pxcor + max-pxcor) / 2] [   plotxy year (mean [tolerance] of turtles with [xcor > (min-pxcor + max-pxcor) / 2])   ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('simultaneous flowering', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         if ((world.turtles()._optimalAnyWith(function() {           return Prims.gt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));         }) && world.turtles()._optimalAnyWith(function() {           return Prims.lt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));         }))) {           let n = 0; letVars['n'] = n;           let m = 0; letVars['m'] = m;           let avg = PrimChecks.list.mean(world.turtles().projectionBy(function() { return SelfManager.self().getVariable(\"tolerance\"); })); letVars['avg'] = avg;           for (let _index_215_221 = 0, _repeatcount_215_221 = StrictMath.floor(500); _index_215_221 < _repeatcount_215_221; _index_215_221++){             let r = world.turtles()._optimalOneOfWith(function() {               return Prims.gt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));             }); letVars['r'] = r;             let s = world.turtles()._optimalOneOfWith(function() {               return Prims.lt(SelfManager.self().getVariable(\"xcor\"), PrimChecks.math.div((world.topology.minPxcor + world.topology.maxPxcor), 2));             }); letVars['s'] = s;             if (Prims.lt(NLMath.abs((r.projectionBy(function() { return SelfManager.self().getVariable(\"flower-time\"); }) - s.projectionBy(function() { return SelfManager.self().getVariable(\"flower-time\"); }))), world.observer.getGlobal(\"flower-duration\"))) {               m = (m + 1); letVars['m'] = m;             }             n = (n + 1); letVars['n'] = n;           }           world.observer.setGlobal(\"percent-same-flowering-time\", NLMath.precision((PrimChecks.math.div(m, n) * 100), 1));           plotManager.plotPoint(world.observer.getGlobal(\"year\"), (PrimChecks.math.div(m, n) * 100));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if any? turtles with [ xcor > (min-pxcor + max-pxcor) / 2] and any? turtles with [ xcor < (min-pxcor + max-pxcor) / 2]  [   let n 0   let m 0   let avg mean [tolerance] of turtles   repeat 500 [     let r one-of turtles with [xcor > (min-pxcor + max-pxcor) / 2]     let s one-of turtles with [xcor < (min-pxcor + max-pxcor) / 2]     if ( abs ([flower-time] of r - [flower-time] of s) < flower-duration ) [ set m (m + 1) ]     set n (n + 1)   ]   set percent-same-flowering-time precision ((m / n) * 100) 1   plotxy year (m / n) * 100 ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"simultaneous flowering","left":167,"top":180,"right":346,"bottom":300,"xAxis":"generations","yAxis":"%","xmin":0,"xmax":10,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if any? turtles with [ xcor > (min-pxcor + max-pxcor) / 2] and any? turtles with [ xcor < (min-pxcor + max-pxcor) / 2]  [   let n 0   let m 0   let avg mean [tolerance] of turtles   repeat 500 [     let r one-of turtles with [xcor > (min-pxcor + max-pxcor) / 2]     let s one-of turtles with [xcor < (min-pxcor + max-pxcor) / 2]     if ( abs ([flower-time] of r - [flower-time] of s) < flower-duration ) [ set m (m + 1) ]     set n (n + 1)   ]   set percent-same-flowering-time precision ((m / n) * 100) 1   plotxy year (m / n) * 100 ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"30","compiledStep":"1","variable":"flower-duration","left":8,"top":342,"right":163,"bottom":375,"display":"flower-duration","min":"0","max":"30","default":20,"step":"1","units":"days","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"day\")","source":"day","left":318,"top":10,"right":375,"bottom":55,"precision":1,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"year\")","source":"year","left":372,"top":10,"right":474,"bottom":55,"display":"years","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"show-labels-as","left":12,"top":187,"right":158,"bottom":232,"display":"show-labels-as","choices":["none","metal in soil","metal tolerance","flower time"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"visualize-time-steps","left":164,"top":10,"right":315,"bottom":55,"display":"visualize-time-steps","choices":["days","years"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"plant-type","left":11,"top":49,"right":157,"bottom":94,"display":"plant-type","choices":["perennial","annual"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"initial-tolerance","left":11,"top":95,"right":158,"bottom":140,"display":"initial-tolerance","choices":["all no tolerance","all full tolerance","random tolerances"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"genetics-model","left":11,"top":141,"right":158,"bottom":186,"display":"genetics-model","choices":["avg. genotype","sex linked genes"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["chance-tolerance-mutation", "tolerance-mutation-stdev", "plants-per-patch", "frontier-sharpness", "chance-flower-time-mutation", "flower-time-mutation-stdev", "pollen-radius", "flower-duration", "show-labels-as", "visualize-time-steps", "plant-type", "initial-tolerance", "genetics-model", "day", "year", "old-year", "end-of-days-counter", "transition-time?", "old-visualize-time-steps-state", "chance-death-per-year", "chance-seed-dispersal", "average-number-offspring", "percent-same-flowering-time"], ["chance-tolerance-mutation", "tolerance-mutation-stdev", "plants-per-patch", "frontier-sharpness", "chance-flower-time-mutation", "flower-time-mutation-stdev", "pollen-radius", "flower-duration", "show-labels-as", "visualize-time-steps", "plant-type", "initial-tolerance", "genetics-model"], ["metal", "barrier?"], 0, 25, 0, 9, 26, false, false, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
var InspectionPrims = workspace.inspectionPrims;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var PrimChecks = workspace.primChecks;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
var RandomPrims = workspace.randomPrims;
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
      world.observer.setGlobal("day", 0);
      world.observer.setGlobal("old-year", 0);
      world.observer.setGlobal("year", 0);
      world.observer.setGlobal("end-of-days-counter", 0);
      world.observer.setGlobal("percent-same-flowering-time", 0);
      world.observer.setGlobal("chance-death-per-year", 10);
      world.observer.setGlobal("chance-seed-dispersal", 50);
      world.observer.setGlobal("average-number-offspring", 3);
      world.observer.setGlobal("transition-time?", false);
      world.observer.setGlobal("old-visualize-time-steps-state", world.observer.getGlobal("visualize-time-steps"));
      Errors.askNobodyCheck(world.patches()).ask(function() {
        SelfManager.self().setPatchVariable("barrier?", false);
        procedures["SETUP-TWO-REGIONS"]();
        SelfManager.self().setPatchVariable("pcolor", procedures["CALC-PATCH-COLOR"](SelfManager.self().getPatchVariable("metal")));
      }, true);
      Errors.askNobodyCheck(world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.minPxcor); })).ask(function() {
        SelfManager.self().sprout(world.observer.getGlobal("plants-per-patch"), "TURTLES").ask(function() {
          if (Prims.equality(world.observer.getGlobal("initial-tolerance"), "all no tolerance")) {
            SelfManager.self().setVariable("tolerance", 0);
          }
          if (Prims.equality(world.observer.getGlobal("initial-tolerance"), "all full tolerance")) {
            SelfManager.self().setVariable("tolerance", 100);
          }
          if (Prims.equality(world.observer.getGlobal("initial-tolerance"), "random tolerances")) {
            SelfManager.self().setVariable("tolerance", RandomPrims.randomFloat(100));
          }
          SelfManager.self().setVariable("flower-time", PrimChecks.math.div(365, 2));
          SelfManager.self().setVariable("heading", RandomPrims.randomLong(360));
          SelfManager.self().fd(RandomPrims.randomFloat(0.5));
          SelfManager.self().setVariable("fitness", 1);
          SelfManager.self().setVariable("shape", "plant");
          SelfManager.self().setVariable("seedling?", false);
          SelfManager.self().setVariable("will-die?", false);
          SelfManager.self().setVariable("color", procedures["CALC-PLANT-COLOR"](SelfManager.self().getVariable("tolerance")));
        }, true);
      }, true);
      world.ticker.reset();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setup"] = temp;
  procs["SETUP"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("metal", NLMath.precision(PrimChecks.math.div(100, (1 + PrimChecks.math.exp((world.observer.getGlobal("frontier-sharpness") * (PrimChecks.math.div((world.topology.maxPxcor + world.topology.minPxcor), 2) - SelfManager.self().getPatchVariable("pxcor")))))), 0));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupTwoRegions"] = temp;
  procs["SETUP-TWO-REGIONS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["CHECK-LABELS"]();
      if (!Prims.equality(world.observer.getGlobal("old-visualize-time-steps-state"), world.observer.getGlobal("visualize-time-steps"))) {
        Errors.askNobodyCheck(world.turtles()).ask(function() { procedures["REDRAW-PLANTS-AS-FULL-SIZED-PLANTS"](); }, true);
      }
      if (Prims.equality(world.observer.getGlobal("visualize-time-steps"), "years")) {
        world.observer.setGlobal("day", 0);
        world.observer.setGlobal("year", (world.observer.getGlobal("year") + 1));
        Errors.askNobodyCheck(world.turtles()).ask(function() { procedures["REDRAW-PLANTS-AS-FULL-SIZED-PLANTS"](); }, true);
        procedures["DO-START-OF-NEW-YEAR-EVENTS"]();
      }
      if (Prims.equality(world.observer.getGlobal("visualize-time-steps"), "days")) {
        procedures["VISUALIZE-BLOOM"]();
        procedures["DO-END-OF-DAYS-EVENTS"]();
      }
      world.ticker.tick();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(world.observer.getGlobal("year"), world.observer.getGlobal("old-year"))) {
        procedures["DO-REPRODUCTION"]();
        procedures["MARK-TURTLES-TO-KILL"]();
        procedures["KILL-MARKED-TURTLES"]();
        world.observer.setGlobal("old-year", world.observer.getGlobal("year"));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["doStartOfNewYearEvents"] = temp;
  procs["DO-START-OF-NEW-YEAR-EVENTS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("day"), 365)) {
        if (Prims.equality(world.observer.getGlobal("transition-time?"), false)) {
          procedures["DO-REPRODUCTION"]();
          procedures["MARK-TURTLES-TO-KILL"]();
          world.observer.setGlobal("transition-time?", true);
        }
        if (world.observer.getGlobal("transition-time?")) {
          world.observer.setGlobal("end-of-days-counter", (world.observer.getGlobal("end-of-days-counter") + 1));
          Errors.askNobodyCheck(world.turtles().agentFilter(function() { return SelfManager.self().getVariable("seedling?"); })).ask(function() { procedures["VISUALIZE-SEEDLING-GROWTH"](); }, true);
          Errors.askNobodyCheck(world.turtles().agentFilter(function() { return SelfManager.self().getVariable("will-die?"); })).ask(function() {
            SelfManager.self().setVariable("size", (1 - PrimChecks.math.div(world.observer.getGlobal("end-of-days-counter"), 10)));
          }, true);
          if (Prims.gt(world.observer.getGlobal("end-of-days-counter"), 9)) {
            world.observer.setGlobal("year", (world.observer.getGlobal("year") + 1));
            world.observer.setGlobal("end-of-days-counter", 0);
            world.observer.setGlobal("transition-time?", false);
            world.observer.setGlobal("day", 0);
            Errors.askNobodyCheck(world.turtles()).ask(function() { procedures["TURN-SEEDLINGS-INTO-FULL-PLANTS"](); }, true);
            procedures["KILL-MARKED-TURTLES"]();
          }
        }
      }
      else {
        world.observer.setGlobal("day", (world.observer.getGlobal("day") + 1));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["doEndOfDaysEvents"] = temp;
  procs["DO-END-OF-DAYS-EVENTS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        let potentialMates = []; letVars['potentialMates'] = potentialMates;
        let nearbyTurtles = world.turtles(); letVars['nearbyTurtles'] = nearbyTurtles;
        if (Prims.lt(world.observer.getGlobal("pollen-radius"), (world.topology.maxPxcor - world.topology.minPxcor))) {
          nearbyTurtles = SelfManager.self().inRadius(world.turtles(), world.observer.getGlobal("pollen-radius")); letVars['nearbyTurtles'] = nearbyTurtles;
        }
        let numCandidates = 10; letVars['numCandidates'] = numCandidates;
        if (nearbyTurtles._optimalCheckCount(10, (a, b) => a < b)) {
          potentialMates = PrimChecks.list.sort(nearbyTurtles); letVars['potentialMates'] = potentialMates;
        }
        else {
          potentialMates = PrimChecks.list.sort(PrimChecks.list.nOf(10, nearbyTurtles)); letVars['potentialMates'] = potentialMates;
          potentialMates = ListPrims.fput(SelfManager.self(), potentialMates); letVars['potentialMates'] = potentialMates;
        }
        let compatibilities = Tasks.map(Tasks.reporterTask(function(potentialMate) {
          Errors.procedureArgumentsCheck(1, arguments.length);
          return procedures["COMPATIBILITY"](SelfManager.self(),potentialMate);
        }, "[ potential-mate -> compatibility self potential-mate ]"), potentialMates); letVars['compatibilities'] = compatibilities;
        let mate = procedures["PICK-WEIGHTED"](potentialMates,compatibilities); letVars['mate'] = mate;
        SelfManager.self().hatch(RandomPrims.randomPoisson(world.observer.getGlobal("average-number-offspring")), "").ask(function() {
          SelfManager.self().setVariable("seedling?", true);
          SelfManager.self().setVariable("will-die?", false);
          if (Prims.equality(world.observer.getGlobal("visualize-time-steps"), "days")) {
            SelfManager.self().setVariable("size", 0);
          }
          else {
            SelfManager.self().setVariable("size", 1);
          }
          if (Prims.equality(world.observer.getGlobal("genetics-model"), "avg. genotype")) {
            SelfManager.self().setVariable("tolerance", PrimChecks.math.div((SelfManager.self().getVariable("tolerance") + mate.projectionBy(function() { return SelfManager.self().getVariable("tolerance"); })), 2));
            SelfManager.self().setVariable("flower-time", PrimChecks.math.div((SelfManager.self().getVariable("flower-time") + mate.projectionBy(function() { return SelfManager.self().getVariable("flower-time"); })), 2));
          }
          if (Prims.lt(RandomPrims.randomFloat(100), world.observer.getGlobal("chance-tolerance-mutation"))) {
            SelfManager.self().setVariable("tolerance", (SelfManager.self().getVariable("tolerance") + PrimChecks.math.randomNormal(0, world.observer.getGlobal("tolerance-mutation-stdev"))));
          }
          if (Prims.lt(RandomPrims.randomFloat(100), world.observer.getGlobal("chance-flower-time-mutation"))) {
            SelfManager.self().setVariable("flower-time", (SelfManager.self().getVariable("flower-time") + PrimChecks.math.randomNormal(0, world.observer.getGlobal("flower-time-mutation-stdev"))));
          }
          if (Prims.lt(SelfManager.self().getVariable("tolerance"), 0)) {
            SelfManager.self().setVariable("tolerance", 0);
          }
          if (Prims.gt(SelfManager.self().getVariable("tolerance"), 100)) {
            SelfManager.self().setVariable("tolerance", 100);
          }
          if (Prims.lt(SelfManager.self().getVariable("flower-time"), 0)) {
            SelfManager.self().setVariable("flower-time", 0);
          }
          if (Prims.gt(SelfManager.self().getVariable("flower-time"), 365)) {
            SelfManager.self().setVariable("flower-time", 365);
          }
          SelfManager.self().setVariable("color", procedures["CALC-PLANT-COLOR"](SelfManager.self().getVariable("tolerance")));
          procedures["MIGRATE-THIS-PLANT"]();
        }, true);
        if (Prims.equality(world.observer.getGlobal("plant-type"), "annual")) {
          SelfManager.self().setVariable("will-die?", true);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["doReproduction"] = temp;
  procs["DO-REPRODUCTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        let t = PrimChecks.math.div(SelfManager.self().getVariable("tolerance"), 100); letVars['t'] = t;
        let m = PrimChecks.math.div(SelfManager.self().getPatchVariable("metal"), 100); letVars['m'] = m;
        SelfManager.self().setVariable("fitness", (((1 - m) * (1 - (0.4 * t))) + (m * (1 - (0.4 * (1 - t))))));
        if (Prims.gt(RandomPrims.randomFloat(1), SelfManager.self().getVariable("fitness"))) {
          SelfManager.self().setVariable("will-die?", true);
        }
        if (Prims.lt(RandomPrims.randomFloat(100), world.observer.getGlobal("chance-death-per-year"))) {
          SelfManager.self().setVariable("will-die?", true);
        }
      }, true);
      Errors.askNobodyCheck(world.patches()).ask(function() {
        let overpopulation = (SelfManager.self().turtlesHere().size() - world.observer.getGlobal("plants-per-patch")); letVars['overpopulation'] = overpopulation;
        if (Prims.gt(overpopulation, 0)) {
          Errors.askNobodyCheck(SelfManager.self().turtlesHere().minNOf(overpopulation, function() { return SelfManager.self().getVariable("fitness"); })).ask(function() { SelfManager.self().setVariable("will-die?", true); }, true);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["markTurtlesToKill"] = temp;
  procs["MARK-TURTLES-TO-KILL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(RandomPrims.randomFloat(100), world.observer.getGlobal("chance-seed-dispersal"))) {
        SelfManager.self().moveTo(PrimChecks.list.oneOf(SelfManager.self().getNeighbors()));
        SelfManager.self().right(RandomPrims.randomLong(360));
        SelfManager.self().fd(RandomPrims.randomFloat(0.45));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["migrateThisPlant"] = temp;
  procs["MIGRATE-THIS-PLANT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtles().agentFilter(function() { return SelfManager.self().getVariable("will-die?"); })).ask(function() { SelfManager.self().die(); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["killMarkedTurtles"] = temp;
  procs["KILL-MARKED-TURTLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (SelfManager.self().getVariable("seedling?")) {
        SelfManager.self().setVariable("seedling?", false);
      }
      procedures["REDRAW-PLANTS-AS-FULL-SIZED-PLANTS"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["turnSeedlingsIntoFullPlants"] = temp;
  procs["TURN-SEEDLINGS-INTO-FULL-PLANTS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.patches()).ask(function() {
        if (Prims.equality(world.observer.getGlobal("show-labels-as"), "metal in soil")) {
          SelfManager.self().setPatchVariable("plabel", SelfManager.self().getPatchVariable("metal"));
        }
        else {
          SelfManager.self().setPatchVariable("plabel", "");
        }
      }, true);
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        if (Prims.equality(world.observer.getGlobal("show-labels-as"), "metal tolerance")) {
          SelfManager.self().setVariable("label", NLMath.precision(SelfManager.self().getVariable("tolerance"), 0));
        }
        if (Prims.equality(world.observer.getGlobal("show-labels-as"), "flower time")) {
          SelfManager.self().setVariable("label", NLMath.precision(SelfManager.self().getVariable("flower-time"), 0));
        }
        if (Prims.equality(world.observer.getGlobal("show-labels-as"), "none")) {
          SelfManager.self().setVariable("label", "");
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkLabels"] = temp;
  procs["CHECK-LABELS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("shape", "plant");
      SelfManager.self().setVariable("size", 1);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["redrawPlantsAsFullSizedPlants"] = temp;
  procs["REDRAW-PLANTS-AS-FULL-SIZED-PLANTS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (SelfManager.self().getVariable("seedling?")) {
        SelfManager.self().setVariable("size", PrimChecks.math.div(world.observer.getGlobal("end-of-days-counter"), 10));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["visualizeSeedlingGrowth"] = temp;
  procs["VISUALIZE-SEEDLING-GROWTH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        if ((Prims.gte(world.observer.getGlobal("day"), SelfManager.self().getVariable("flower-time")) && Prims.lte(world.observer.getGlobal("day"), (SelfManager.self().getVariable("flower-time") + world.observer.getGlobal("flower-duration"))))) {
          SelfManager.self().setVariable("shape", "flower");
        }
        else {
          SelfManager.self().setVariable("shape", "plant");
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["visualizeBloom"] = temp;
  procs["VISUALIZE-BLOOM"] = temp;
  temp = (function(options, weights) {
    try {
      var reporterContext = true;
      var letVars = { };
      let wsum = 0; letVars['wsum'] = wsum;
      var _foreach_11551_11558 = Tasks.forEach(Tasks.commandTask(function(weight) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        wsum = (wsum + weight); letVars['wsum'] = wsum;
      }, "[ weight -> set wsum wsum + weight ]"), weights); if(reporterContext && _foreach_11551_11558 !== undefined) { return _foreach_11551_11558; }
      let wret = (wsum * RandomPrims.randomFloat(1)); letVars['wret'] = wret;
      let ret = 0; letVars['ret'] = ret;
      wsum = 0; letVars['wsum'] = wsum;
      var _foreach_11674_11681 = Tasks.forEach(Tasks.commandTask(function(weight) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        wsum = (wsum + weight); letVars['wsum'] = wsum;
        if (Prims.gt(wsum, wret)) {
          Errors.reportInContextCheck(reporterContext);
          return PrimChecks.list.item(ret, options);
        }
        ret = (ret + 1); letVars['ret'] = ret;
      }, "[ weight -> set wsum wsum + weight if wsum > wret [ report item ret options ] set ret ret + 1 ]"), weights); if(reporterContext && _foreach_11674_11681 !== undefined) { return _foreach_11674_11681; }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["pickWeighted"] = temp;
  procs["PICK-WEIGHTED"] = temp;
  temp = (function(t1, t2) {
    try {
      var reporterContext = true;
      var letVars = { };
      let diff = NLMath.abs((t1.projectionBy(function() { return SelfManager.self().getVariable("flower-time"); }) - t2.projectionBy(function() { return SelfManager.self().getVariable("flower-time"); }))); letVars['diff'] = diff;
      if (Prims.lt(diff, world.observer.getGlobal("flower-duration"))) {
        Errors.reportInContextCheck(reporterContext);
        return (world.observer.getGlobal("flower-duration") - diff);
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return 0;
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["compatibility"] = temp;
  procs["COMPATIBILITY"] = temp;
  temp = (function(m) {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return ColorModel.genRGBFromComponents(0, PrimChecks.math.div((255 * (1 - PrimChecks.math.div(m, 100))), 2), PrimChecks.math.div((255 * PrimChecks.math.div(m, 100)), 2));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["calcPatchColor"] = temp;
  procs["CALC-PATCH-COLOR"] = temp;
  temp = (function(t) {
    try {
      var reporterContext = true;
      var letVars = { };
      let blackPcolor = ColorModel.genRGBFromComponents(0, 0, 0); letVars['blackPcolor'] = blackPcolor;
      if (SelfManager.self().getPatchVariable("barrier?")) {
        Errors.reportInContextCheck(reporterContext);
        return blackPcolor;
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return ColorModel.genRGBFromComponents(0, (255 * (1 - PrimChecks.math.div(t, 100))), (255 * PrimChecks.math.div(t, 100)));
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["calcPlantColor"] = temp;
  procs["CALC-PLANT-COLOR"] = temp;
  return procs;
})();
world.observer.setGlobal("chance-tolerance-mutation", 10);
world.observer.setGlobal("tolerance-mutation-stdev", 20);
world.observer.setGlobal("plants-per-patch", 2);
world.observer.setGlobal("frontier-sharpness", 1);
world.observer.setGlobal("chance-flower-time-mutation", 10);
world.observer.setGlobal("flower-time-mutation-stdev", 10);
world.observer.setGlobal("pollen-radius", 30);
world.observer.setGlobal("flower-duration", 20);
world.observer.setGlobal("show-labels-as", "none");
world.observer.setGlobal("visualize-time-steps", "years");
world.observer.setGlobal("plant-type", "annual");
world.observer.setGlobal("initial-tolerance", "all no tolerance");
world.observer.setGlobal("genetics-model", "avg. genotype");