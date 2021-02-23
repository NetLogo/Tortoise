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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"bird 1":{"name":"bird 1","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[2,2,270,297,299,187,279,276,100,31],"ycors":[6,39,298,298,271,160,75,22,67,0],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"bird 2":{"name":"bird 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[2,33,298,298,272,155,117,61,61,0],"ycors":[4,4,270,298,298,184,289,295,105,43],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"butterfly monarch":{"name":"butterfly monarch","editableColorIndex":15,"rotate":false,"elements":[{"x1":0,"y1":0,"x2":424,"y2":424,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":true},{"x1":299,"y1":1,"x2":-128,"y2":424,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":true}]},"butterfly viceroy":{"name":"butterfly viceroy","editableColorIndex":15,"rotate":false,"elements":[{"x":34,"y":34,"diam":232,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":false,"marked":true}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Average Colors Over Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Monarchs', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average Colors Over Time', 'Monarchs')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(PrimChecks.list.mean(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed("MONARCHS"), function() { return SelfManager.self().getVariable("color"); })));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('Viceroys', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average Colors Over Time', 'Viceroys')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(PrimChecks.list.mean(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed("VICEROYS"), function() { return SelfManager.self().getVariable("color"); })));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Average Color", true, true, 0, 100, 0, 105, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "monarchs", singular: "monarch", varNames: [] }, { name: "viceroys", singular: "viceroy", varNames: [] }, { name: "birds", singular: "bird", varNames: ["memory"] }])([], [])(';; two breeds of butterflies breed [ monarchs monarch ] breed [ viceroys viceroy ]  breed [ birds bird ] birds-own [ memory ]  globals [   carrying-capacity-monarchs  ;; maximum population of monarchs in the world   carrying-capacity-viceroys  ;; maximum population of viceroys in the world   carrying-capacity-birds     ;; maximum population of birds in the world   color-range-begin           ;; \"lowest\" color for a butterfly   color-range-end             ;; \"highest\" color for a butterfly   reproduction-chance         ;; The chance and individual has of                               ;; reproducing (0 - 100) *after*                               ;; the chance dependent on                               ;; carrying capacity is evaluated. ]  ;; ;; Setup Procedures ;;  to setup   clear-all   setup-variables   setup-turtles   reset-ticks end  ;; initialize constants to setup-variables   set carrying-capacity-monarchs 225   set carrying-capacity-viceroys 225   set carrying-capacity-birds 75   set reproduction-chance 4   set color-range-begin 15   set color-range-end 109 end  ;; create 75 birds and 450 butterflies of which half are ;; monarchs and half are viceroys.  Initially, the ;; monarchs are at the bottom of the color range and ;; the viceroys are at the top of the color range. ;; The patches are white for easy viewing.  to setup-turtles   ask patches [ set pcolor white ]   set-default-shape monarchs \"butterfly monarch\"   set-default-shape viceroys \"butterfly viceroy\"   create-birds carrying-capacity-birds   [     set color black     set memory []     set shape one-of [\"bird 1\" \"bird 2\"]   ]   create-monarchs carrying-capacity-monarchs [ set color red ]   create-viceroys carrying-capacity-viceroys [ set color blue ]   ;; scatter all three breeds around the world   ask turtles [ setxy random-xcor random-ycor ] end  ;; ;; Runtime Procedures ;;  to go   ask birds [ birds-move ]   ;; turtles that are not birds are butterflies   ask turtles with [breed != birds] [ butterflies-move ]   ask turtles with [breed != birds] [ butterflies-get-eaten ]   ask birds [ birds-forget ]   ask turtles with [breed != birds] [ butterflies-reproduce ]   tick end  to birds-move ;; birds procedure   ;; The birds are animated by alternating shapes   ifelse shape = \"bird 1\"   [ set shape \"bird 2\"]   [ set shape \"bird 1\" ]   set heading 180 + random 180   fd 1 end  to butterflies-move ;; butterflies procedure   rt random 100   lt random 100   fd 1 end  ;; If there is a bird on this patch check the bird\'s memory ;; to see if this butterfly seems edible based on the color. ;; If the butterfly\'s color is not in the bird\'s memory ;; the butterfly dies.  If it\'s a monarch the bird remembers ;; that its color was yucky to butterflies-get-eaten  ;; butterfly procedure   let bird-here one-of birds-here   if bird-here != nobody   [     if not [color-in-memory? [color] of myself] of bird-here     [       if breed = monarchs         [ ask bird-here [ remember-color [color] of myself ] ]       die     ]   ] end  ;; helper procedure that determines whether the given ;; color is in a bird\'s memory to-report color-in-memory? [c] ;; bird procedure   foreach memory [ i -> if item 0 i = c [ report true ] ]   report false end  ;; put a color that was yucky in memory to remember-color [c]  ;; bird procedure   ;; birds can only remember 3 colors at a time   ;; so if there are more than 3 in memory we   ;; need to remove 1 we know that the first item   ;; in the list will always be the oldest since   ;; we add items to the back of the list and only   ;; 1 item can be added per tick   if length memory >= memory-size   [ set memory but-first memory ]   ;; put the new memory on the end of the list   set memory lput (list c 0) memory end  ;; birds can only remember for so long, then ;; they forget. They remember colors for MEMORY-LENGTH to birds-forget ;; bird procedure   ;; first increment all of the times in memory   set memory map [ i -> list (item 0 i) (1 + item 1 i) ] memory   ;; then remove any entries whose times have hit memory-duration   set memory filter [ i -> item 1 i <= memory-duration ] memory end  ;; Each butterfly has an equal chance of reproducing ;; depending on how close to carrying capacity the ;; population is. to butterflies-reproduce ;; butterfly procedure   ifelse breed = monarchs   [ if random count monarchs < carrying-capacity-monarchs - count monarchs      [ hatch-butterfly ] ]   [ if random count viceroys < carrying-capacity-viceroys - count viceroys      [ hatch-butterfly ] ] end  to hatch-butterfly ;; butterfly procedure   if random-float 100 < reproduction-chance   [     hatch 1     [       fd 1       ;; the chance that the butterfly will       ;; have a random color is determined by       ;; the MUTATION slider. select a base-color       ;; between 15 and 105       if random-float 100 < mutation-rate       ;; make a list that contains only the base-color 15-105       [ set color one-of sublist base-colors 1 10 ]     ]  ] end   ; Copyright 1997 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":334,"top":10,"right":752,"bottom":429,"dimensions":{"minPxcor":-20,"maxPxcor":20,"minPycor":-20,"maxPycor":20,"patchSize":10,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":76,"top":10,"right":164,"bottom":43,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":166,"top":10,"right":254,"bottom":43,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"40","compiledStep":"1","variable":"memory-duration","left":71,"top":44,"right":259,"bottom":77,"display":"memory-duration","min":"0","max":"40","default":30,"step":"1","units":"ticks","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"mutation-rate","left":71,"top":78,"right":259,"bottom":111,"display":"mutation-rate","min":"0","max":"100","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.agentset.count_unchecked(world.turtleManager.turtlesOfBreed(\"MONARCHS\"))","source":"count monarchs","left":56,"top":146,"right":163,"bottom":191,"precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.list.max(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed(\"MONARCHS\"), function() { return SelfManager.self().getVariable(\"color\"); }))","source":"max [color] of monarchs","left":175,"top":413,"right":246,"bottom":458,"display":"maximum","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.list.mean(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed(\"MONARCHS\"), function() { return SelfManager.self().getVariable(\"color\"); }))","source":"mean [color] of monarchs","left":103,"top":413,"right":174,"bottom":458,"display":"average","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.agentset.count_unchecked(world.turtleManager.turtlesOfBreed(\"VICEROYS\"))","source":"count viceroys","left":164,"top":146,"right":271,"bottom":191,"precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.list.max(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed(\"VICEROYS\"), function() { return SelfManager.self().getVariable(\"color\"); }))","source":"max [color] of viceroys","left":175,"top":459,"right":246,"bottom":504,"display":"maximum","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.list.mean(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed(\"VICEROYS\"), function() { return SelfManager.self().getVariable(\"color\"); }))","source":"mean [color] of viceroys","left":103,"top":459,"right":174,"bottom":504,"display":"average","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Average Colors Over Time', 'Monarchs')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(PrimChecks.list.mean(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed(\"MONARCHS\"), function() { return SelfManager.self().getVariable(\"color\"); })));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"Monarchs","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot mean [color] of monarchs","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Average Colors Over Time', 'Viceroys')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(PrimChecks.list.mean(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed(\"VICEROYS\"), function() { return SelfManager.self().getVariable(\"color\"); })));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"Viceroys","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot mean [color] of viceroys","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average Colors Over Time","left":33,"top":192,"right":310,"bottom":412,"xAxis":"Time","yAxis":"Average Color","xmin":0,"xmax":100,"ymin":0,"ymax":105,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"Monarchs","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot mean [color] of monarchs","type":"pen"},{"display":"Viceroys","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot mean [color] of viceroys","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"display":"monarch colors:","left":12,"top":425,"right":162,"bottom":443,"fontSize":11,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"viceroy colors:","left":17,"top":470,"right":167,"bottom":488,"fontSize":11,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.list.min(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed(\"MONARCHS\"), function() { return SelfManager.self().getVariable(\"color\"); }))","source":"min [color] of monarchs","left":247,"top":413,"right":318,"bottom":458,"display":"minimum","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.list.min(PrimChecks.agentset.of_unchecked(world.turtleManager.turtlesOfBreed(\"VICEROYS\"), function() { return SelfManager.self().getVariable(\"color\"); }))","source":"min [color] of viceroys","left":247,"top":459,"right":318,"bottom":504,"display":"minimum","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10","compiledStep":"1","variable":"memory-size","left":71,"top":112,"right":259,"bottom":145,"display":"memory-size","min":"0","max":"10","default":3,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["memory-duration", "mutation-rate", "memory-size", "carrying-capacity-monarchs", "carrying-capacity-viceroys", "carrying-capacity-birds", "color-range-begin", "color-range-end", "reproduction-chance"], ["memory-duration", "mutation-rate", "memory-size"], [], -20, 20, -20, 20, 10, true, true, turtleShapes, linkShapes, function(){});
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
      procedures["SETUP-VARIABLES"]();
      procedures["SETUP-TURTLES"]();
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
      world.observer.setGlobal("carrying-capacity-monarchs", 225);
      world.observer.setGlobal("carrying-capacity-viceroys", 225);
      world.observer.setGlobal("carrying-capacity-birds", 75);
      world.observer.setGlobal("reproduction-chance", 4);
      world.observer.setGlobal("color-range-begin", 15);
      world.observer.setGlobal("color-range-end", 109);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupVariables"] = temp;
  procs["SETUP-VARIABLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.patches()).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("MONARCHS").getSpecialName(), "butterfly monarch")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("VICEROYS").getSpecialName(), "butterfly viceroy")
      world.turtleManager.createTurtles(world.observer.getGlobal("carrying-capacity-birds"), "BIRDS").ask(function() {
        SelfManager.self().setVariable("color", 0);
        SelfManager.self().setVariable("memory", []);
        SelfManager.self().setVariable("shape", PrimChecks.list.oneOf(["bird 1", "bird 2"]));
      }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("carrying-capacity-monarchs"), "MONARCHS").ask(function() { SelfManager.self().setVariable("color", 15); }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("carrying-capacity-viceroys"), "VICEROYS").ask(function() { SelfManager.self().setVariable("color", 105); }, true);
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        SelfManager.self().setXY(RandomPrims.randomFloatInRange(world.topology.minPxcor, world.topology.maxPxcor), RandomPrims.randomFloatInRange(world.topology.minPycor, world.topology.maxPycor));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupTurtles"] = temp;
  procs["SETUP-TURTLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("BIRDS")).ask(function() { procedures["BIRDS-MOVE"](); }, true);
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtles(), function() {
        return !Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("BIRDS"));
      })).ask(function() { procedures["BUTTERFLIES-MOVE"](); }, true);
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtles(), function() {
        return !Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("BIRDS"));
      })).ask(function() { procedures["BUTTERFLIES-GET-EATEN"](); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("BIRDS")).ask(function() { procedures["BIRDS-FORGET"](); }, true);
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtles(), function() {
        return !Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("BIRDS"));
      })).ask(function() { procedures["BUTTERFLIES-REPRODUCE"](); }, true);
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
      if (Prims.equality(SelfManager.self().getVariable("shape"), "bird 1")) {
        SelfManager.self().setVariable("shape", "bird 2");
      }
      else {
        SelfManager.self().setVariable("shape", "bird 1");
      }
      SelfManager.self().setVariable("heading", (180 + RandomPrims.randomLong(180)));
      SelfManager.self()._optimalFdOne();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["birdsMove"] = temp;
  procs["BIRDS-MOVE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().right(RandomPrims.randomLong(100));
      SelfManager.self().right(-(RandomPrims.randomLong(100)));
      SelfManager.self()._optimalFdOne();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["butterfliesMove"] = temp;
  procs["BUTTERFLIES-MOVE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let birdHere = PrimChecks.list.oneOf(SelfManager.self().breedHere("BIRDS")); letVars['birdHere'] = birdHere;
      if (!Prims.equality(birdHere, Nobody)) {
        if (!PrimChecks.agentset.of(birdHere, function() {
          return procedures["COLOR-IN-MEMORY?"](PrimChecks.agentset.of_unchecked(SelfManager.myself(), function() { return SelfManager.self().getVariable("color"); }));
        })) {
          if (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("MONARCHS"))) {
            Errors.askNobodyCheck(birdHere).ask(function() {
              procedures["REMEMBER-COLOR"](PrimChecks.agentset.of_unchecked(SelfManager.myself(), function() { return SelfManager.self().getVariable("color"); }));
            }, true);
          }
          SelfManager.self().die();
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["butterfliesGetEaten"] = temp;
  procs["BUTTERFLIES-GET-EATEN"] = temp;
  temp = (function(c) {
    try {
      var reporterContext = true;
      var letVars = { };
      var _foreach_3161_3168 = Tasks.forEach(Tasks.commandTask(function(i) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        if (Prims.equality(PrimChecks.list.item(0, i), c)) {
          Errors.reportInContextCheck(reporterContext);
          return true;
        }
      }, "[ i -> if item 0 i = c [ report true ] ]"), SelfManager.self().getVariable("memory")); if(reporterContext && _foreach_3161_3168 !== undefined) { return _foreach_3161_3168; }
      Errors.reportInContextCheck(reporterContext);
      return false;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["colorInMemory_p"] = temp;
  procs["COLOR-IN-MEMORY?"] = temp;
  temp = (function(c) {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gte(PrimChecks.list.length(SelfManager.self().getVariable("memory")), world.observer.getGlobal("memory-size"))) {
        SelfManager.self().setVariable("memory", PrimChecks.list.butFirst('but-first')(SelfManager.self().getVariable("memory")));
      }
      SelfManager.self().setVariable("memory", PrimChecks.list.lput(ListPrims.list(c, 0), SelfManager.self().getVariable("memory")));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["rememberColor"] = temp;
  procs["REMEMBER-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("memory", Tasks.map(Tasks.reporterTask(function(i) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        return ListPrims.list(PrimChecks.list.item(0, i), (1 + PrimChecks.list.item(1, i)));
      }, "[ i -> list item 0 i 1 + item 1 i ]"), SelfManager.self().getVariable("memory")));
      SelfManager.self().setVariable("memory", PrimChecks.list.filter(Tasks.reporterTask(function(i) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        return Prims.lte(PrimChecks.list.item(1, i), world.observer.getGlobal("memory-duration"));
      }, "[ i -> item 1 i <= memory-duration ]"), SelfManager.self().getVariable("memory")));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["birdsForget"] = temp;
  procs["BIRDS-FORGET"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("MONARCHS"))) {
        if (Prims.lt(PrimChecks.math.random(PrimChecks.agentset.count_unchecked(world.turtleManager.turtlesOfBreed("MONARCHS"))), (world.observer.getGlobal("carrying-capacity-monarchs") - PrimChecks.agentset.count_unchecked(world.turtleManager.turtlesOfBreed("MONARCHS"))))) {
          procedures["HATCH-BUTTERFLY"]();
        }
      }
      else {
        if (Prims.lt(PrimChecks.math.random(PrimChecks.agentset.count_unchecked(world.turtleManager.turtlesOfBreed("VICEROYS"))), (world.observer.getGlobal("carrying-capacity-viceroys") - PrimChecks.agentset.count_unchecked(world.turtleManager.turtlesOfBreed("VICEROYS"))))) {
          procedures["HATCH-BUTTERFLY"]();
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["butterfliesReproduce"] = temp;
  procs["BUTTERFLIES-REPRODUCE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(PrimChecks.math.randomFloat(100), world.observer.getGlobal("reproduction-chance"))) {
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self()._optimalFdOne();
          if (Prims.lt(PrimChecks.math.randomFloat(100), world.observer.getGlobal("mutation-rate"))) {
            SelfManager.self().setVariable("color", PrimChecks.list.oneOf(PrimChecks.list.sublist(ColorModel.BASE_COLORS, 1, 10)));
          }
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["hatchButterfly"] = temp;
  procs["HATCH-BUTTERFLY"] = temp;
  return procs;
})();
world.observer.setGlobal("memory-duration", 30);
world.observer.setGlobal("mutation-rate", 5);
world.observer.setGlobal("memory-size", 3);