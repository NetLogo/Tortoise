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
var turtleShapes = {"1":{"name":"1","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,150,203],"ycors":[7,204,130],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":7,"x2":42,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":41,"y1":250,"x2":149,"y2":204,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":204,"x2":259,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":8,"x2":260,"y2":249,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[150,150,42],"ycors":[8,205,252],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"default empty":{"name":"default empty","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":7,"x2":42,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":41,"y1":250,"x2":149,"y2":204,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":204,"x2":259,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":8,"x2":260,"y2":249,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"default half":{"name":"default half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":7,"x2":42,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":41,"y1":250,"x2":149,"y2":204,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":204,"x2":259,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":8,"x2":260,"y2":249,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[150,150,42],"ycors":[7,204,251],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"default one-quarter":{"name":"default one-quarter","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":7,"x2":42,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":41,"y1":250,"x2":149,"y2":204,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":204,"x2":259,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":8,"x2":260,"y2":249,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[91,151,42],"ycors":[133,203,252],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"default three-quarter":{"name":"default three-quarter","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":7,"x2":42,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":41,"y1":250,"x2":149,"y2":204,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":204,"x2":259,"y2":248,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":8,"x2":260,"y2":249,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[150,150,211],"ycors":[7,204,140],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,150,42],"ycors":[7,204,251],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Leaves';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('leaves', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Leaves', 'leaves')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtleManager.turtlesOfBreed("LEAVES").size());
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('dead leaves', plotOps.makePenOps, false, new PenBundle.State(35, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Leaves', 'dead leaves')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtleManager.turtlesOfBreed("DEAD-LEAVES").size());
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "", true, true, 0, 10, 0, 100, setup, update);
})(), (function() {
  var name    = 'Weather conditions';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('temperature', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Weather conditions', 'temperature')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.observer.getGlobal("temperature"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('rain', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Weather conditions', 'rain')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.observer.getGlobal("rain-intensity"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('wind', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Weather conditions', 'wind')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.observer.getGlobal("wind-factor"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('sunlight', plotOps.makePenOps, false, new PenBundle.State(45, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Weather conditions', 'sunlight')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.observer.getGlobal("sun-intensity"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Leaf averages';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('chlorophyll', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Leaf averages', 'chlorophyll')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (!world.turtleManager.turtlesOfBreed("LEAVES").isEmpty()) {
            plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("chlorophyll"); })));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('water', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Leaf averages', 'water')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (!world.turtleManager.turtlesOfBreed("LEAVES").isEmpty()) {
            plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("water-level"); })));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('sugar', plotOps.makePenOps, false, new PenBundle.State(5, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Leaf averages', 'sugar')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (!world.turtleManager.turtlesOfBreed("LEAVES").isEmpty()) {
            plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("sugar-level"); })));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('carotene', plotOps.makePenOps, false, new PenBundle.State(45, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Leaf averages', 'carotene')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (!world.turtleManager.turtlesOfBreed("LEAVES").isEmpty()) {
            plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("carotene"); })));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('anthocyanin', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Leaf averages', 'anthocyanin')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (!world.turtleManager.turtlesOfBreed("LEAVES").isEmpty()) {
            plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("anthocyanin"); })));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('attachedness', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Leaf averages', 'attachedness')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (!world.turtleManager.turtlesOfBreed("LEAVES").isEmpty()) {
            plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("attachedness"); })));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "", true, true, 0, 10, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "leaves", singular: "leaf", varNames: ["water-level", "sugar-level", "attachedness", "chlorophyll", "carotene", "anthocyanin"] }, { name: "dead-leaves", singular: "dead-leaf", varNames: [] }, { name: "raindrops", singular: "raindrop", varNames: ["location", "amount-of-water"] }, { name: "suns", singular: "sun", varNames: [] }])([], [])('breed [ leaves leaf ] breed [ dead-leaves dead-leaf ] breed [ raindrops raindrop ] breed [ suns sun ]  leaves-own [   water-level       ;; amount of water in the leaf   sugar-level       ;; amount of sugar in the leaf   attachedness      ;; how attached the leaf is to the tree   chlorophyll       ;; level of chemical making the leaf green   carotene          ;; level of chemical making the leaf yellow   anthocyanin       ;; level of chemical making the leaf red ]  raindrops-own [   location          ;; either \"falling\", \"in root\", \"in trunk\", or \"in leaves\"   amount-of-water ]  globals [   bottom-line        ;; controls where the ground is   evaporation-temp   ;; temperature at which water evaporates ]  ;; --------------------------------------- ;; setup ;; ---------------------------------------  to setup   clear-all   set bottom-line min-pycor + 1   set evaporation-temp 30   set-default-shape raindrops \"circle\"   set-default-shape suns \"circle\"    ;; Create sky and grass   ask patches [     set pcolor blue - 2   ]   ask patches with [ pycor < min-pycor + 2 ] [     set pcolor green   ]    ;; Create leaves   create-leaves number-of-leaves [     set chlorophyll 50 + random 50     set water-level 75 + random 25     ;; the sugar level is drawn from a normal distribution based on user inputs     set sugar-level random-normal start-sugar-mean start-sugar-stddev     set carotene random 100     change-color     set attachedness 100 + random 50     ;; using sqrt in the next command makes the turtles be     ;; evenly distributed; if we just said \"fd random-float 10\"     ;; there\'d be more turtles near the center of the tree,     ;; which would look funny     fd sqrt random-float 100   ]    ;; Create trunk and branches   ask patches with [     pxcor = 0 and pycor <= 5 or     abs pxcor = (pycor + 2) and pycor < 4 or     abs pxcor = (pycor + 8) and pycor < 3   ] [     set pcolor brown   ]    ;; Create the sun   create-suns 1 [     setxy (max-pxcor - 2) (max-pycor - 3)     ;; change appearance based on intensity     show-intensity   ]    ;; plot the initial state   reset-ticks end   ;; --------------------------------------- ;; go ;; ---------------------------------------  to go   ;; Stop if all of the leaves are dead   if not any? leaves [ stop ]    ;; Have the wind blow and rain fall;   ;; move any water in the sky, on the ground, and in the tree;   ;; set the appearance of the sun on the basis of its intensity.   make-wind-blow   make-rain-fall   move-water   ask suns [ show-intensity ]    ;; Now our leaves respond accordingly   ask attached-leaves [     adjust-water     adjust-chlorophyll     adjust-sugar     change-color     change-shape   ]    ;; if the leaves are falling keep falling   ask leaves [ fall-if-necessary ]    ;; Leaves on the bottom should be killed off   ask leaves with [ ycor <= bottom-line ] [     set breed dead-leaves   ]    ;; Leaves without water should also be killed off   ask leaves with [ water-level < 1 ] [     set attachedness 0   ]    ;; Make sure that values remain between 0 - 100   ask leaves [     set chlorophyll (clip chlorophyll)     set water-level (clip water-level)     set sugar-level (clip sugar-level)     set carotene (clip carotene)     set anthocyanin (clip anthocyanin)     set attachedness (clip attachedness)   ]    ;; increment the tick counter   tick end  to-report clip [ value ]   if value < 0 [ report 0 ]   if value > 100 [ report 100 ]   report value end  ;; --------------------------------------- ;; make-wind-blow: When the wind blows, ;; the leaves move around a little bit ;; (for a nice visual effect), and ;; reduce their attachedness by the wind factor. ;; This means that leaves will fall off more ;; rapidly in stronger winds. ;; ---------------------------------------  to make-wind-blow   ask leaves [     ifelse random 2 = 1       [ rt 10 * wind-factor ]       [ lt 10 * wind-factor ]     set attachedness attachedness - wind-factor   ] end   ;; --------------------------------------- ;; make-rain-fall: rain is a separate breed ;; of small turtles that come from the top of the world. ;; ---------------------------------------  to make-rain-fall   ;; Create new raindrops at the top of the world   create-raindrops rain-intensity [     setxy random-xcor max-pycor     set heading 180     fd 0.5 - random-float 1     set size .3     set color gray     set location \"falling\"     set amount-of-water 10   ]   ;; Now move all the raindrops, including   ;; the ones we just created.   ask raindrops [ fd random-float 2 ] end   ;; -------------------------------------------------------- ;; move-water: water goes from raindrops -> ground, ;; ground -> trunk/branches, and trunk/branches to leaves. ;; --------------------------------------------------------  to move-water    ;; We assume that the roots extend under the entire grassy area; rain flows through   ;; the roots to the trunk   ask raindrops with [ location = \"falling\" and pcolor = green ] [     set location \"in roots\"     face patch 0 ycor   ]    ;; Water flows from the trunk up to the central part of the tree.   ask raindrops with [ location = \"in roots\" and pcolor = brown ] [     face patch 0 0     set location \"in trunk\"   ]    ;; Water flows out from the trunk to the leaves.  We\'re not going to   ;; simulate branches here in a serious way   ask raindrops with [ location = \"in trunk\" and patch-here = patch 0 0 ] [     set location \"in leaves\"     set heading random 360   ]    ;; if the raindrop is in the leaves and there is nothing left disappear   ask raindrops with [ location = \"in leaves\" and amount-of-water <= 0.5 ] [     die   ]    ;; if the raindrops are in the trunk or leaves and they are at a place   ;; where they can no longer flow into a leaf then disappear   ask raindrops with [     (location = \"in trunk\" or location = \"in leaves\")     and (ycor > max [ ycor ] of leaves or          xcor > max [ xcor ] of leaves or          xcor < min [ xcor ] of leaves)   ] [     die   ]  end  ;;--------------------------------------------------------- ;; Turtle Procedures ;; --------------------------------------------------------  ;; -------------------------------------------------------- ;; show-intensity: Change how the sun looks to indicate ;; intensity of sunshine. ;; --------------------------------------------------------  to show-intensity  ;; sun procedure   set color scale-color yellow sun-intensity 0 150   set size sun-intensity / 10   set label word sun-intensity \"%\"   ifelse sun-intensity < 50     [ set label-color yellow ]     [ set label-color black  ] end  ;; -------------------------------------------------------- ;; adjust-water: Handle the ups and downs of water within the leaf ;; --------------------------------------------------------  to adjust-water   ;; Below a certain temperature, the leaf does not absorb   ;; water any more.  Instead, it converts sugar and and water   ;; to anthocyanin, in a proportion   if temperature < 10 [ stop ]    ;; If there is a raindrop near this leaf with some water   ;; left in it, then absorb some of that water   let nearby-raindrops raindrops in-radius 2 with [ location = \"in leaves\" and amount-of-water >= 0 ]    if any? nearby-raindrops [     let my-raindrop min-one-of nearby-raindrops [ distance myself ]     set water-level water-level + ([ amount-of-water ] of my-raindrop * 0.20)     ask my-raindrop [       set amount-of-water (amount-of-water * 0.80)     ]   ]    ;; Reduce the water according to the temperature   if temperature > evaporation-temp [     set water-level water-level - (0.5 * (temperature - evaporation-temp))   ]    ;; If the water level goes too low, reduce the attachedness   if water-level < 25 [     set attachedness attachedness - 1   ]  end   ;; --------------------------------------- ;; adjust-chlorophyll: It\'s not easy being green. ;; Chlorophyll gets reduces when the temperature is ;; low, or when the sun is strong.  It increases when ;; the temperature is normal and the sun is shining. ;; ---------------------------------------  to adjust-chlorophyll    ;; If the temperature is low, then reduce the chlorophyll   if temperature < 15 [     set chlorophyll chlorophyll - (.5 * (15 - temperature))   ]    ;; If the sun is strong, then reduce the chlorophyll   if sun-intensity > 75 [     set chlorophyll chlorophyll - (.5 * (sun-intensity - 75))   ]    ;; New chlorophyll comes from water and sunlight   if temperature > 15 and sun-intensity > 20 [     set chlorophyll chlorophyll + 1   ]  end   ;; --------------------------------------- ;; adjust-sugar: water + sunlight + chlorophyll = sugar ;; ---------------------------------------  to adjust-sugar   ;; If there is enough water and sunlight, reduce the chlorophyll   ;; and water, and increase the sugar   if water-level > 1 and sun-intensity > 20 and chlorophyll > 1 [     set water-level water-level - 0.5     set chlorophyll chlorophyll - 0.5     set sugar-level sugar-level + 1     set attachedness attachedness + 5   ]    ;; Every tick of the clock, we reduce the sugar by 1   set sugar-level sugar-level - 0.5 end  ;; --------------------------------------- ;; fall-if-necessary:  If a leaf is above the bottom row, make it fall down ;; If it hits the bottom line, make it a dead-leaf ;; ---------------------------------------  to fall-if-necessary   if attachedness > 0 [ stop ]   if ycor > bottom-line [     let target-xcor (xcor + random-float wind-factor - random-float wind-factor)     facexy target-xcor bottom-line     fd random-float (.7 * max (list wind-factor .5))   ] end   ;; --------------------------------------- ;; change-color: Because NetLogo has a limited color scheme, ;; we need very simple rules ;; ---------------------------------------  to change-color   ;; If the temperature is low, then we turn the   ;; sugar into anthocyanin   if temperature < 20 and sugar-level > 0 and water-level > 0 [     set sugar-level sugar-level - 1     set water-level water-level - 1     set anthocyanin anthocyanin + 1   ]    ;; If we have more than 50 percent chlorophyll, then   ;; we are green, and scale the color accordingly   ifelse chlorophyll > 50 [     set color scale-color green chlorophyll 150 -50   ] [     ;; If we are lower than 50 percent chlorophyll, then     ;; we have yellow (according to the carotene), red (according     ;; to the anthocyanin), or orange (if they are about equal).      ;; If we have roughly equal anthocyanin and carotene,     ;; then the leaves should be in orange.     if abs (anthocyanin - carotene ) < 10 [       set color scale-color orange carotene 150 -50     ]     if anthocyanin > carotene + 10 [       set color scale-color red anthocyanin 170 -50     ]     if carotene > anthocyanin + 10 [       set color scale-color yellow carotene 150 -50     ]   ] end  to change-shape   ifelse leaf-display-mode = \"solid\" [     set shape \"default\"   ] [     if leaf-display-mode = \"chlorophyll\" [       set-shape-for-value chlorophyll     ]     if leaf-display-mode = \"water\" [       set-shape-for-value water-level     ]     if leaf-display-mode = \"sugar\" [       set-shape-for-value sugar-level     ]     if leaf-display-mode = \"carotene\" [       set-shape-for-value carotene     ]     if leaf-display-mode = \"anthocyanin\" [       set-shape-for-value anthocyanin     ]     if leaf-display-mode = \"attachedness\" [       set-shape-for-value attachedness     ]   ] end  ;; returns all leaves still attached to-report attached-leaves   report leaves with [attachedness > 0] end  ;; makes the leaf appear to be more or less filled depending on value to set-shape-for-value [ value ]   ifelse value > 75 [     set shape \"default\"   ] [     ifelse value <= 25 [       set shape \"default one-quarter\"     ] [       ifelse value <= 50 [         set shape \"default half\"       ] [         set shape \"default three-quarter\"       ]     ]   ] end   ; Copyright 2005 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":205,"top":10,"right":703,"bottom":509,"dimensions":{"minPxcor":-17,"maxPxcor":17,"minPycor":-17,"maxPycor":17,"patchSize":14,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":12,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"2500","compiledStep":"1","variable":"number-of-leaves","left":5,"top":10,"right":200,"bottom":43,"display":"number-of-leaves","min":"1","max":"2500","default":278,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":40,"top":125,"right":106,"bottom":158,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10","compiledStep":"1","variable":"wind-factor","left":5,"top":240,"right":200,"bottom":273,"display":"wind-factor","min":"0","max":"10","default":3,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":109,"top":125,"right":172,"bottom":158,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"40","compiledStep":"1","variable":"temperature","left":5,"top":171,"right":200,"bottom":204,"display":"temperature","min":"0","max":"40","default":11,"step":"1","units":"°C","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"30","compiledStep":"1","variable":"rain-intensity","left":5,"top":205,"right":200,"bottom":238,"display":"rain-intensity","min":"0","max":"30","default":19,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"sun-intensity","left":5,"top":275,"right":200,"bottom":308,"display":"sun-intensity","min":"0","max":"100","default":97,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Leaves', 'leaves')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtleManager.turtlesOfBreed(\"LEAVES\").size());       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"leaves","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count leaves","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Leaves', 'dead leaves')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtleManager.turtlesOfBreed(\"DEAD-LEAVES\").size());       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"dead leaves","interval":1,"mode":0,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"plot count dead-leaves","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Leaves","left":710,"top":10,"right":1041,"bottom":180,"xAxis":"Time","xmin":0,"xmax":10,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"leaves","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count leaves","type":"pen"},{"display":"dead leaves","interval":1,"mode":0,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"plot count dead-leaves","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Weather conditions', 'temperature')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.observer.getGlobal(\"temperature\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"temperature","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot temperature","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Weather conditions', 'rain')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.observer.getGlobal(\"rain-intensity\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"rain","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot rain-intensity","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Weather conditions', 'wind')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.observer.getGlobal(\"wind-factor\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"wind","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot wind-factor","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Weather conditions', 'sunlight')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.observer.getGlobal(\"sun-intensity\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"sunlight","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"plot sun-intensity","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Weather conditions","left":710,"top":185,"right":1042,"bottom":355,"xAxis":"Time","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"temperature","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot temperature","type":"pen"},{"display":"rain","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot rain-intensity","type":"pen"},{"display":"wind","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plot wind-factor","type":"pen"},{"display":"sunlight","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"plot sun-intensity","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Leaf averages', 'chlorophyll')(function() {       try {         var reporterContext = false;         var letVars = { };         if (!world.turtleManager.turtlesOfBreed(\"LEAVES\").isEmpty()) {           plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed(\"LEAVES\").projectionBy(function() { return SelfManager.self().getVariable(\"chlorophyll\"); })));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"chlorophyll","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [ plot mean [chlorophyll] of leaves ]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Leaf averages', 'water')(function() {       try {         var reporterContext = false;         var letVars = { };         if (!world.turtleManager.turtlesOfBreed(\"LEAVES\").isEmpty()) {           plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed(\"LEAVES\").projectionBy(function() { return SelfManager.self().getVariable(\"water-level\"); })));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"water","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [ plot mean [water-level] of leaves ]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Leaf averages', 'sugar')(function() {       try {         var reporterContext = false;         var letVars = { };         if (!world.turtleManager.turtlesOfBreed(\"LEAVES\").isEmpty()) {           plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed(\"LEAVES\").projectionBy(function() { return SelfManager.self().getVariable(\"sugar-level\"); })));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"sugar","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [  plot mean [sugar-level] of leaves ]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Leaf averages', 'carotene')(function() {       try {         var reporterContext = false;         var letVars = { };         if (!world.turtleManager.turtlesOfBreed(\"LEAVES\").isEmpty()) {           plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed(\"LEAVES\").projectionBy(function() { return SelfManager.self().getVariable(\"carotene\"); })));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"carotene","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [  plot mean [carotene] of leaves ]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Leaf averages', 'anthocyanin')(function() {       try {         var reporterContext = false;         var letVars = { };         if (!world.turtleManager.turtlesOfBreed(\"LEAVES\").isEmpty()) {           plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed(\"LEAVES\").projectionBy(function() { return SelfManager.self().getVariable(\"anthocyanin\"); })));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"anthocyanin","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [ plot mean [anthocyanin] of leaves ]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Leaf averages', 'attachedness')(function() {       try {         var reporterContext = false;         var letVars = { };         if (!world.turtleManager.turtlesOfBreed(\"LEAVES\").isEmpty()) {           plotManager.plotValue(ListPrims.mean(world.turtleManager.turtlesOfBreed(\"LEAVES\").projectionBy(function() { return SelfManager.self().getVariable(\"attachedness\"); })));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"attachedness","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [  plot mean [attachedness] of leaves ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Leaf averages","left":710,"top":360,"right":1041,"bottom":530,"xAxis":"Time","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"chlorophyll","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [ plot mean [chlorophyll] of leaves ]","type":"pen"},{"display":"water","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [ plot mean [water-level] of leaves ]","type":"pen"},{"display":"sugar","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [  plot mean [sugar-level] of leaves ]","type":"pen"},{"display":"carotene","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [  plot mean [carotene] of leaves ]","type":"pen"},{"display":"anthocyanin","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [ plot mean [anthocyanin] of leaves ]","type":"pen"},{"display":"attachedness","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if any? leaves [  plot mean [attachedness] of leaves ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"start-sugar-mean","left":5,"top":45,"right":200,"bottom":78,"display":"start-sugar-mean","min":"0","max":"100","default":50,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"start-sugar-stddev","left":5,"top":80,"right":200,"bottom":113,"display":"start-sugar-stddev","min":"0","max":"50","default":25,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"leaf-display-mode","left":5,"top":310,"right":200,"bottom":355,"display":"leaf-display-mode","choices":["solid","chlorophyll","water","sugar","carotene","anthocyanin","attachedness"],"currentChoice":6,"type":"chooser","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["number-of-leaves", "wind-factor", "temperature", "rain-intensity", "sun-intensity", "start-sugar-mean", "start-sugar-stddev", "leaf-display-mode", "bottom-line", "evaporation-temp"], ["number-of-leaves", "wind-factor", "temperature", "rain-intensity", "sun-intensity", "start-sugar-mean", "start-sugar-stddev", "leaf-display-mode"], [], -17, 17, -17, 17, 14, false, false, turtleShapes, linkShapes, function(){});
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
      world.observer.setGlobal("bottom-line", (world.topology.minPycor + 1));
      world.observer.setGlobal("evaporation-temp", 30);
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("RAINDROPS").getSpecialName(), "circle")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("SUNS").getSpecialName(), "circle")
      Errors.askNobodyCheck(world.patches()).ask(function() { SelfManager.self().setPatchVariable("pcolor", (105 - 2)); }, true);
      Errors.askNobodyCheck(world.patches().agentFilter(function() { return Prims.lt(SelfManager.self().getPatchVariable("pycor"), (world.topology.minPycor + 2)); })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 55); }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("number-of-leaves"), "LEAVES").ask(function() {
        SelfManager.self().setVariable("chlorophyll", (50 + RandomPrims.randomLong(50)));
        SelfManager.self().setVariable("water-level", (75 + RandomPrims.randomLong(25)));
        SelfManager.self().setVariable("sugar-level", PrimChecks.math.randomNormal(world.observer.getGlobal("start-sugar-mean"), world.observer.getGlobal("start-sugar-stddev")));
        SelfManager.self().setVariable("carotene", RandomPrims.randomLong(100));
        procedures["CHANGE-COLOR"]();
        SelfManager.self().setVariable("attachedness", (100 + RandomPrims.randomLong(50)));
        SelfManager.self().fd(PrimChecks.math.sqrt(RandomPrims.randomFloat(100)));
      }, true);
      Errors.askNobodyCheck(world.patches().agentFilter(function() {
        return (((((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), 0) && Prims.lte(SelfManager.self().getPatchVariable("pycor"), 5)) || Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (SelfManager.self().getPatchVariable("pycor") + 2))) && Prims.lt(SelfManager.self().getPatchVariable("pycor"), 4)) || Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (SelfManager.self().getPatchVariable("pycor") + 8))) && Prims.lt(SelfManager.self().getPatchVariable("pycor"), 3));
      })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 35); }, true);
      world.turtleManager.createTurtles(1, "SUNS").ask(function() {
        SelfManager.self().setXY((world.topology.maxPxcor - 2), (world.topology.maxPycor - 3));
        procedures["SHOW-INTENSITY"]();
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
      if (!!world.turtleManager.turtlesOfBreed("LEAVES").isEmpty()) {
        throw new Exception.StopInterrupt;
      }
      procedures["MAKE-WIND-BLOW"]();
      procedures["MAKE-RAIN-FALL"]();
      procedures["MOVE-WATER"]();
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SUNS")).ask(function() { procedures["SHOW-INTENSITY"](); }, true);
      Errors.askNobodyCheck(procedures["ATTACHED-LEAVES"]()).ask(function() {
        procedures["ADJUST-WATER"]();
        procedures["ADJUST-CHLOROPHYLL"]();
        procedures["ADJUST-SUGAR"]();
        procedures["CHANGE-COLOR"]();
        procedures["CHANGE-SHAPE"]();
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("LEAVES")).ask(function() { procedures["FALL-IF-NECESSARY"](); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("LEAVES").agentFilter(function() { return Prims.lte(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("bottom-line")); })).ask(function() { SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("DEAD-LEAVES")); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("LEAVES").agentFilter(function() { return Prims.lt(SelfManager.self().getVariable("water-level"), 1); })).ask(function() { SelfManager.self().setVariable("attachedness", 0); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("LEAVES")).ask(function() {
        SelfManager.self().setVariable("chlorophyll", procedures["CLIP"](SelfManager.self().getVariable("chlorophyll")));
        SelfManager.self().setVariable("water-level", procedures["CLIP"](SelfManager.self().getVariable("water-level")));
        SelfManager.self().setVariable("sugar-level", procedures["CLIP"](SelfManager.self().getVariable("sugar-level")));
        SelfManager.self().setVariable("carotene", procedures["CLIP"](SelfManager.self().getVariable("carotene")));
        SelfManager.self().setVariable("anthocyanin", procedures["CLIP"](SelfManager.self().getVariable("anthocyanin")));
        SelfManager.self().setVariable("attachedness", procedures["CLIP"](SelfManager.self().getVariable("attachedness")));
      }, true);
      world.ticker.tick();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function(value) {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.lt(value, 0)) {
        Errors.reportInContextCheck(reporterContext);
        return 0;
      }
      if (Prims.gt(value, 100)) {
        Errors.reportInContextCheck(reporterContext);
        return 100;
      }
      Errors.reportInContextCheck(reporterContext);
      return value;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["clip"] = temp;
  procs["CLIP"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("LEAVES")).ask(function() {
        if (Prims.equality(RandomPrims.randomLong(2), 1)) {
          SelfManager.self().right((10 * world.observer.getGlobal("wind-factor")));
        }
        else {
          SelfManager.self().right(-((10 * world.observer.getGlobal("wind-factor"))));
        }
        SelfManager.self().setVariable("attachedness", (SelfManager.self().getVariable("attachedness") - world.observer.getGlobal("wind-factor")));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeWindBlow"] = temp;
  procs["MAKE-WIND-BLOW"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(world.observer.getGlobal("rain-intensity"), "RAINDROPS").ask(function() {
        SelfManager.self().setXY(RandomPrims.randomFloatInRange(world.topology.minPxcor, world.topology.maxPxcor), world.topology.maxPycor);
        SelfManager.self().setVariable("heading", 180);
        SelfManager.self().fd((0.5 - RandomPrims.randomFloat(1)));
        SelfManager.self().setVariable("size", 0.3);
        SelfManager.self().setVariable("color", 5);
        SelfManager.self().setVariable("location", "falling");
        SelfManager.self().setVariable("amount-of-water", 10);
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("RAINDROPS")).ask(function() { SelfManager.self().fd(RandomPrims.randomFloat(2)); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeRainFall"] = temp;
  procs["MAKE-RAIN-FALL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("RAINDROPS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("location"), "falling") && Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 55));
      })).ask(function() {
        SelfManager.self().setVariable("location", "in roots");
        SelfManager.self().face(world.getPatchAt(0, SelfManager.self().getVariable("ycor")));
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("RAINDROPS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("location"), "in roots") && Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 35));
      })).ask(function() {
        SelfManager.self().face(world.getPatchAt(0, 0));
        SelfManager.self().setVariable("location", "in trunk");
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("RAINDROPS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("location"), "in trunk") && Prims.equality(SelfManager.self().getPatchHere(), world.getPatchAt(0, 0)));
      })).ask(function() {
        SelfManager.self().setVariable("location", "in leaves");
        SelfManager.self().setVariable("heading", RandomPrims.randomLong(360));
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("RAINDROPS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("location"), "in leaves") && Prims.lte(SelfManager.self().getVariable("amount-of-water"), 0.5));
      })).ask(function() { SelfManager.self().die(); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("RAINDROPS").agentFilter(function() {
        return ((Prims.equality(SelfManager.self().getVariable("location"), "in trunk") || Prims.equality(SelfManager.self().getVariable("location"), "in leaves")) && ((Prims.gt(SelfManager.self().getVariable("ycor"), ListPrims.max(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("ycor"); }))) || Prims.gt(SelfManager.self().getVariable("xcor"), ListPrims.max(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("xcor"); })))) || Prims.lt(SelfManager.self().getVariable("xcor"), ListPrims.min(world.turtleManager.turtlesOfBreed("LEAVES").projectionBy(function() { return SelfManager.self().getVariable("xcor"); })))));
      })).ask(function() { SelfManager.self().die(); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["moveWater"] = temp;
  procs["MOVE-WATER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("color", ColorModel.scaleColor(45, world.observer.getGlobal("sun-intensity"), 0, 150));
      SelfManager.self().setVariable("size", PrimChecks.math.div(world.observer.getGlobal("sun-intensity"), 10));
      SelfManager.self().setVariable("label", (workspace.dump('') + workspace.dump(world.observer.getGlobal("sun-intensity")) + workspace.dump("%")));
      if (Prims.lt(world.observer.getGlobal("sun-intensity"), 50)) {
        SelfManager.self().setVariable("label-color", 45);
      }
      else {
        SelfManager.self().setVariable("label-color", 0);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["showIntensity"] = temp;
  procs["SHOW-INTENSITY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(world.observer.getGlobal("temperature"), 10)) {
        throw new Exception.StopInterrupt;
      }
      let nearbyRaindrops = SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("RAINDROPS"), 2).agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("location"), "in leaves") && Prims.gte(SelfManager.self().getVariable("amount-of-water"), 0));
      }); letVars['nearbyRaindrops'] = nearbyRaindrops;
      if (!nearbyRaindrops.isEmpty()) {
        let myRaindrop = nearbyRaindrops.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); }); letVars['myRaindrop'] = myRaindrop;
        SelfManager.self().setVariable("water-level", (SelfManager.self().getVariable("water-level") + (myRaindrop.projectionBy(function() { return SelfManager.self().getVariable("amount-of-water"); }) * 0.2)));
        Errors.askNobodyCheck(myRaindrop).ask(function() {
          SelfManager.self().setVariable("amount-of-water", (SelfManager.self().getVariable("amount-of-water") * 0.8));
        }, true);
      }
      if (Prims.gt(world.observer.getGlobal("temperature"), world.observer.getGlobal("evaporation-temp"))) {
        SelfManager.self().setVariable("water-level", (SelfManager.self().getVariable("water-level") - (0.5 * (world.observer.getGlobal("temperature") - world.observer.getGlobal("evaporation-temp")))));
      }
      if (Prims.lt(SelfManager.self().getVariable("water-level"), 25)) {
        SelfManager.self().setVariable("attachedness", (SelfManager.self().getVariable("attachedness") - 1));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["adjustWater"] = temp;
  procs["ADJUST-WATER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(world.observer.getGlobal("temperature"), 15)) {
        SelfManager.self().setVariable("chlorophyll", (SelfManager.self().getVariable("chlorophyll") - (0.5 * (15 - world.observer.getGlobal("temperature")))));
      }
      if (Prims.gt(world.observer.getGlobal("sun-intensity"), 75)) {
        SelfManager.self().setVariable("chlorophyll", (SelfManager.self().getVariable("chlorophyll") - (0.5 * (world.observer.getGlobal("sun-intensity") - 75))));
      }
      if ((Prims.gt(world.observer.getGlobal("temperature"), 15) && Prims.gt(world.observer.getGlobal("sun-intensity"), 20))) {
        SelfManager.self().setVariable("chlorophyll", (SelfManager.self().getVariable("chlorophyll") + 1));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["adjustChlorophyll"] = temp;
  procs["ADJUST-CHLOROPHYLL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (((Prims.gt(SelfManager.self().getVariable("water-level"), 1) && Prims.gt(world.observer.getGlobal("sun-intensity"), 20)) && Prims.gt(SelfManager.self().getVariable("chlorophyll"), 1))) {
        SelfManager.self().setVariable("water-level", (SelfManager.self().getVariable("water-level") - 0.5));
        SelfManager.self().setVariable("chlorophyll", (SelfManager.self().getVariable("chlorophyll") - 0.5));
        SelfManager.self().setVariable("sugar-level", (SelfManager.self().getVariable("sugar-level") + 1));
        SelfManager.self().setVariable("attachedness", (SelfManager.self().getVariable("attachedness") + 5));
      }
      SelfManager.self().setVariable("sugar-level", (SelfManager.self().getVariable("sugar-level") - 0.5));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["adjustSugar"] = temp;
  procs["ADJUST-SUGAR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(SelfManager.self().getVariable("attachedness"), 0)) {
        throw new Exception.StopInterrupt;
      }
      if (Prims.gt(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("bottom-line"))) {
        let targetXcor = ((SelfManager.self().getVariable("xcor") + RandomPrims.randomFloat(world.observer.getGlobal("wind-factor"))) - RandomPrims.randomFloat(world.observer.getGlobal("wind-factor"))); letVars['targetXcor'] = targetXcor;
        SelfManager.self().faceXY(targetXcor, world.observer.getGlobal("bottom-line"));
        SelfManager.self().fd(RandomPrims.randomFloat((0.7 * ListPrims.max(ListPrims.list(world.observer.getGlobal("wind-factor"), 0.5)))));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["fallIfNecessary"] = temp;
  procs["FALL-IF-NECESSARY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (((Prims.lt(world.observer.getGlobal("temperature"), 20) && Prims.gt(SelfManager.self().getVariable("sugar-level"), 0)) && Prims.gt(SelfManager.self().getVariable("water-level"), 0))) {
        SelfManager.self().setVariable("sugar-level", (SelfManager.self().getVariable("sugar-level") - 1));
        SelfManager.self().setVariable("water-level", (SelfManager.self().getVariable("water-level") - 1));
        SelfManager.self().setVariable("anthocyanin", (SelfManager.self().getVariable("anthocyanin") + 1));
      }
      if (Prims.gt(SelfManager.self().getVariable("chlorophyll"), 50)) {
        SelfManager.self().setVariable("color", ColorModel.scaleColor(55, SelfManager.self().getVariable("chlorophyll"), 150, -50));
      }
      else {
        if (Prims.lt(NLMath.abs((SelfManager.self().getVariable("anthocyanin") - SelfManager.self().getVariable("carotene"))), 10)) {
          SelfManager.self().setVariable("color", ColorModel.scaleColor(25, SelfManager.self().getVariable("carotene"), 150, -50));
        }
        if (Prims.gt(SelfManager.self().getVariable("anthocyanin"), (SelfManager.self().getVariable("carotene") + 10))) {
          SelfManager.self().setVariable("color", ColorModel.scaleColor(15, SelfManager.self().getVariable("anthocyanin"), 170, -50));
        }
        if (Prims.gt(SelfManager.self().getVariable("carotene"), (SelfManager.self().getVariable("anthocyanin") + 10))) {
          SelfManager.self().setVariable("color", ColorModel.scaleColor(45, SelfManager.self().getVariable("carotene"), 150, -50));
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["changeColor"] = temp;
  procs["CHANGE-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("leaf-display-mode"), "solid")) {
        SelfManager.self().setVariable("shape", "default");
      }
      else {
        if (Prims.equality(world.observer.getGlobal("leaf-display-mode"), "chlorophyll")) {
          procedures["SET-SHAPE-FOR-VALUE"](SelfManager.self().getVariable("chlorophyll"));
        }
        if (Prims.equality(world.observer.getGlobal("leaf-display-mode"), "water")) {
          procedures["SET-SHAPE-FOR-VALUE"](SelfManager.self().getVariable("water-level"));
        }
        if (Prims.equality(world.observer.getGlobal("leaf-display-mode"), "sugar")) {
          procedures["SET-SHAPE-FOR-VALUE"](SelfManager.self().getVariable("sugar-level"));
        }
        if (Prims.equality(world.observer.getGlobal("leaf-display-mode"), "carotene")) {
          procedures["SET-SHAPE-FOR-VALUE"](SelfManager.self().getVariable("carotene"));
        }
        if (Prims.equality(world.observer.getGlobal("leaf-display-mode"), "anthocyanin")) {
          procedures["SET-SHAPE-FOR-VALUE"](SelfManager.self().getVariable("anthocyanin"));
        }
        if (Prims.equality(world.observer.getGlobal("leaf-display-mode"), "attachedness")) {
          procedures["SET-SHAPE-FOR-VALUE"](SelfManager.self().getVariable("attachedness"));
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["changeShape"] = temp;
  procs["CHANGE-SHAPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return world.turtleManager.turtlesOfBreed("LEAVES").agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("attachedness"), 0); });
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["attachedLeaves"] = temp;
  procs["ATTACHED-LEAVES"] = temp;
  temp = (function(value) {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(value, 75)) {
        SelfManager.self().setVariable("shape", "default");
      }
      else {
        if (Prims.lte(value, 25)) {
          SelfManager.self().setVariable("shape", "default one-quarter");
        }
        else {
          if (Prims.lte(value, 50)) {
            SelfManager.self().setVariable("shape", "default half");
          }
          else {
            SelfManager.self().setVariable("shape", "default three-quarter");
          }
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setShapeForValue"] = temp;
  procs["SET-SHAPE-FOR-VALUE"] = temp;
  return procs;
})();
world.observer.setGlobal("number-of-leaves", 278);
world.observer.setGlobal("wind-factor", 3);
world.observer.setGlobal("temperature", 11);
world.observer.setGlobal("rain-intensity", 19);
world.observer.setGlobal("sun-intensity", 97);
world.observer.setGlobal("start-sugar-mean", 50);
world.observer.setGlobal("start-sugar-stddev", 25);
world.observer.setGlobal("leaf-display-mode", "attachedness");