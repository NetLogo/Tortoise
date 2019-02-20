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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":16,"y":16,"diam":270,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":46,"y":46,"diam":210,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"clock":{"name":"clock","editableColorIndex":0,"rotate":true,"elements":[{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,128,143,143,158,158,173],"ycors":[31,75,75,150,150,75,75],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"hydrogen":{"name":"hydrogen","editableColorIndex":8,"rotate":true,"elements":[{"x":70,"y":70,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":130,"y":130,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false}]},"hydrogen-boosted":{"name":"hydrogen-boosted","editableColorIndex":8,"rotate":true,"elements":[{"x":70,"y":70,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":130,"y":130,"diam":100,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":0,"y":0,"diam":298,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"oxygen":{"name":"oxygen","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false}]},"oxygen-boosted":{"name":"oxygen-boosted","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":105,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false},{"x":45,"y":30,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"water":{"name":"water","editableColorIndex":0,"rotate":true,"elements":[{"x":75,"y":90,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false},{"x":12,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":192,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false}]},"water-boosted":{"name":"water-boosted","editableColorIndex":0,"rotate":true,"elements":[{"x":75,"y":90,"diam":150,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false},{"x":12,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":192,"y":48,"diam":102,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":false,"marked":false}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Number of Molecules';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Oxygen', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of Molecules', 'Oxygen')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("number-oxygen-molecules"));
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
  new PenBundle.Pen('Hydrogen', plotOps.makePenOps, false, new PenBundle.State(5, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of Molecules', 'Hydrogen')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("number-hydrogen-molecules"));
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
  new PenBundle.Pen('Water', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Number of Molecules', 'Water')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("number-water-molecules"));
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
  return new Plot(name, pens, plotOps, "time", "count", true, true, 0, 10, 0, 50, setup, update);
})(), (function() {
  var name    = 'Gas Temp. vs. time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('gas temp.', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Gas Temp. vs. time', 'gas temp.')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("temperature"));
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
  return new Plot(name, pens, plotOps, "time", "temp.", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Pressure vs. time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('pressure', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Pressure vs. time', 'pressure')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (world.observer.getGlobal("box-intact?")) {
            plotManager.plotPoint(world.ticker.tickCount(), ListPrims.mean(world.observer.getGlobal("pressure-history")));
          }
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
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 10, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "GAS-MOLECULES", singular: "gas-molecule", varNames: ["speed", "mass", "energy", "last-collision", "molecule-type", "momentum-instant", "momentum-difference"] }, { name: "FLASHES", singular: "flash", varNames: ["birthday"] }, { name: "BROKEN-WALLS", singular: "broken-wall", varNames: [] }])([], [])('globals [   tick-advance-amount                ;; clock variables   max-tick-advance-amount            ;; the largest a tick length is allowed to be   box-edge                   ;; distance of box edge from axes   avg-speed                  ;; current average speed of gas molecules   avg-energy                 ;; current average energy of gas molecules   length-horizontal-surface  ;; the size of the wall surfaces that run horizontally - the top and bottom of the box   length-vertical-surface    ;; the size of the wall surfaces that run vertically - the left and right of the box   pressure-history           ;; average pressure over last six time steps   pressure                   ;; pressure at this time step   temperature                ;; the average kinetic energy of all the molecules   box-intact?                ;; keeps track of whether the box will burst from too much pressure   molecule-size              ;; size of the molecules   margin-outside-box         ;; number of patches width between the edge of the box and the edge of the world   number-oxygen-molecules   number-hydrogen-molecules   number-water-molecules ]  breed [ gas-molecules gas-molecule ] breed [ flashes flash ]              ;; squares that are created temporarily to show a location of a wall hit breed [ broken-walls broken-wall ]   ;; pieces of broken walls that fly apart when pressure limit of container is reached   flashes-own [birthday]  gas-molecules-own [   speed mass energy          ;; gas-molecules info   last-collision             ;; what was the molecule that this molecule collided with?   molecule-type              ;; what type of molecule is this (hydrogen H2, water H20, oxygen O2)   momentum-instant           ;; used to calculate the momentum imparted to the wall at this time step   momentum-difference        ;; used to calculate pressure from wall hits over time ]  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;; SETUP PROCEDURES ;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to setup   clear-all   set max-tick-advance-amount 0.01   set margin-outside-box 4   set box-edge (max-pxcor - margin-outside-box)   set-default-shape flashes \"square\"   set molecule-size 1.4   set pressure-history [0 0 0 0 0 0]   ;; plotted pressure will be averaged over the past 6 entries   set box-intact? true   set length-horizontal-surface  ( 2 * (box-edge - 1) + 1)   set length-vertical-surface  ( 2 * (box-edge - 1) + 1)    make-box   make-gas-molecules   update-variables   reset-ticks end   to make-box   ask patches with   [ ((abs pxcor = (max-pxcor - margin-outside-box)) and (abs pycor <= (max-pycor - margin-outside-box))) or     ((abs pycor = (max-pxcor - margin-outside-box)) and (abs pxcor <= (max-pycor - margin-outside-box))) ]     [ set pcolor gray ] end   to make-gas-molecules   create-gas-molecules initial-oxygen-molecules   [     setup-initial-oxygen-molecules     random-position   ]    create-gas-molecules initial-hydrogen-molecules   [     setup-initial-hydrogen-molecules     random-position   ] end   to setup-initial-hydrogen-molecules  ;; gas-molecules procedure   set size molecule-size   set last-collision nobody   set shape \"hydrogen\"   set molecule-type \"hydrogen\"   set mass 2    ;; approximate atomic weight of H2   set momentum-difference 0   set momentum-instant 0 end   to setup-initial-oxygen-molecules  ;; gas-molecules procedure   set size molecule-size   set last-collision nobody   set shape \"oxygen\"   set molecule-type \"oxygen\"   set mass 16   ;;  approximate atomic weight of 02   set momentum-difference 0   set momentum-instant 0 end   ;; Place gas-molecules at random, but molecules must not be placed on top of other molecules at first. to random-position ;; gas-molecules procedure   let open-patches nobody   let open-patch nobody   set open-patches patches with [abs pxcor < (max-pxcor - margin-outside-box) and abs pycor < (max-pycor - margin-outside-box)]   set open-patch one-of open-patches   move-to open-patch   set heading random-float 360   set energy initial-gas-temperature   set speed speed-from-energy end    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;; RUNTIME PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to go   if count gas-molecules = 0 [stop]   ifelse box-intact? [ask gas-molecules [bounce]] [shatter-box]   ask gas-molecules [     move     check-for-collision   ]   ask gas-molecules with [molecule-type = \"oxygen\"] [check-for-reaction]   update-variables   calculate-pressure   if pressure > (pressure-limit-container) [set box-intact? false]   calculate-tick-advance-amount   tick-advance tick-advance-amount   update-flash-visualization   update-plots   display end   to update-variables ;; update gas molecules variables, as well as their counts   ifelse any? gas-molecules [     set avg-speed  mean [speed] of gas-molecules     set avg-energy mean [energy] of gas-molecules     set temperature avg-energy   ]   [ set avg-speed 0 set avg-energy 0 set temperature 0]   set number-oxygen-molecules   count gas-molecules with [molecule-type = \"oxygen\"]   set number-hydrogen-molecules count gas-molecules with [molecule-type = \"hydrogen\"]   set number-water-molecules    count gas-molecules with [molecule-type = \"water\"] end   to update-flash-visualization   ask flashes [     if (ticks - birthday > 0.4)  [ die ]     set color lput (255 - (255 * (ticks - birthday ) / 0.4)) [20 20 20]   ;; become progressively more transparent   ] end   to bounce  ;; particle procedure   ;; get the coordinates of the patch located forward 1   let new-patch patch-ahead 1   let new-px [pxcor] of new-patch   let new-py [pycor] of new-patch   ;; if we\'re not about to hit a wall, no need for any further checks   if (abs new-px != box-edge and abs new-py != box-edge)     [stop]   ;; if hitting left or right wall, reflect heading around x axis   if (abs new-px = box-edge)     [ set heading (- heading)   ;;  if the particle is hitting a vertical wall, only the horizontal component of the velocity   ;;  vector can change.  The change in momentum for this component is 2 * the speed of the particle,   ;;  due to the reversing of direction of travel from the collision with the wall       set momentum-instant  (abs (sin heading * 2 * mass * speed) / length-vertical-surface)       set momentum-difference momentum-difference + momentum-instant       ]    ;; if hitting top or bottom wall, reflect heading around y axis   if (abs new-py = box-edge)     [ set heading (180 - heading)   ;;  if the particle is hitting a horizontal wall, only the vertical component of the velocity   ;;  vector can change.  The change in momentum for this component is 2 * the speed of the particle,   ;;  due to the reversing of direction of travel from the collision with the wall       set momentum-instant  (abs (cos heading * 2 * mass * speed) / length-horizontal-surface)       set momentum-difference momentum-difference + momentum-instant     ]    if show-wall-hits? [     ask patch new-px new-py [make-a-flash]   ] end   to make-a-flash   sprout 1 [     set breed flashes     set color [20 20 20 255]     set birthday ticks   ] end   to shatter-box   let center-patch one-of patches with [pxcor = 0 and pycor = 0]   ask broken-walls  [     set heading towards center-patch     set heading (heading + 180)     if pxcor = max-pxcor or pycor = max-pycor or pycor = min-pycor or pxcor = min-pxcor [die]     fd avg-speed * tick-advance-amount   ]   ask patches with [pcolor = gray]   [ sprout 1 [set breed broken-walls set color gray set shape \"square\"] set pcolor black]   ask flashes [die] end   to move  ;; gas-molecules procedure   if patch-ahead (speed * tick-advance-amount) != patch-here     [ set last-collision nobody ]   jump (speed * tick-advance-amount)   ;; When particles reach the edge of the screen, it is because the box they were in has burst (failed) due   ;; to exceeding pressure limitations.  These particles should be removed from the simulation when they escape   ;; to the edge of the world.   if pxcor = max-pxcor or pxcor = min-pxcor or pycor = min-pycor or pycor = max-pycor [die] end   to calculate-pressure   ;; by summing the momentum change for each particle,   ;; the wall\'s total momentum change is calculated   ;; the 100 is an arbitrary scalar (constant)    set pressure 100 * sum [momentum-difference] of gas-molecules   set pressure-history lput pressure but-first pressure-history   ask gas-molecules     [ set momentum-difference 0 ]  ;; once the contribution to momentum has been calculated                                    ;; this value is reset to zero till the next wall hit end  to calculate-tick-advance-amount   ;; tick-advance-amount is calculated in such way that even the fastest   ;; gas-molecules will jump at most 1 patch length in a clock tick. As   ;; gas-molecules jump (speed * tick-advance-amount) at every clock tick, making   ;; tick length the inverse of the speed of the fastest gas-molecules   ;; (1/max speed) assures that. Having each gas-molecules advance at most   ;; one patch-length is necessary for it not to \"jump over\" a wall   ;; or another gas-molecules.   ifelse any? gas-molecules with [speed > 0]     [ set tick-advance-amount min list (1 / (ceiling max [speed] of gas-molecules)) max-tick-advance-amount ]     [ set tick-advance-amount max-tick-advance-amount ] end   to speed-up-one-molecule   clear-drawing   ask gas-molecules [penup]   ask one-of gas-molecules  [     set speed speed * 10     set energy energy-from-speed     pendown   ]   calculate-tick-advance-amount end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;; CHEMICAL REACTIONS PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to check-for-reaction   let hit-hydrogen gas-molecules-here with [molecule-type = \"hydrogen\"]   let this-initial-oxygen-molecules-energy energy   let total-energy 0    if count hit-hydrogen >= 2 [     if speed < 0 [set speed 0]       let hydrogen-reactants n-of 2 hit-hydrogen       let total-energy-all-reactants (this-initial-oxygen-molecules-energy + sum [energy] of hydrogen-reactants )       if total-energy-all-reactants > activation-energy [          ask hydrogen-reactants [   ;;two H2 turn into two water molecules           ifelse highlight-product?             [set shape  \"water-boosted\"]             [set shape  \"water\"]           set molecule-type \"water\"           set mass 10  ;; approximate atomic weight of H20           let total-energy-products (total-energy-all-reactants + bond-energy-released )           set energy total-energy-products / 2              ;; distribute half the kinetic energy of the reactants and the bond energy amongst the products (two water molecules)           set speed speed-from-energy         ]       die   ;; remove the oxygen molecule, as its atoms are now part of the water molecules       ]   ] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;; COLLISION PROCEDURES ;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;from GasLab to check-for-collision  ;; gas-molecules procedure   if count other gas-molecules-here in-radius 1 = 1   [     ;; the following conditions are imposed on collision candidates:     ;;   1. they must have a lower who number than my own, because collision     ;;      code is asymmetrical: it must always happen from the point of view     ;;      of just one gas-molecules.     ;;   2. they must not be the same gas-molecules that we last collided with on     ;;      this patch, so that we have a chance to leave the patch after we\'ve     ;;      collided with someone.     let candidate one-of other gas-molecules-here with       [self < myself and myself != last-collision]     ;; we also only collide if one of us has non-zero speed. It\'s useless     ;; (and incorrect, actually) for two gas-molecules with zero speed to collide.     if (candidate != nobody) and (speed > 0 or [speed] of candidate > 0)     [       collide-with candidate       ask candidate [penup]       set last-collision candidate       let this-candidate self       ask candidate [set last-collision this-candidate]     ]   ] end  ;; This procedure implements a collision with another gas-molecules. ;; ;; The two gas-molecules colliding are self and other-gas-molecules, and while the ;; collision is performed from the point of view of self, both gas-molecules are ;; modified to reflect its effects. This is somewhat complicated, so here is a ;; general outline: ;;   1. Do initial setup, and determine the heading between gas-molecules centers ;;      (call it theta). ;;   2. Convert the representation of the velocity of each gas-molecules from ;;      speed/heading to a theta-based vector whose first component is the ;;      gas-molecules\' speed along theta, and whose second component is the speed ;;      perpendicular to theta. ;;   3. Modify the velocity vectors to reflect the effects of the collision. ;;      This involves: ;;        a. computing the velocity of the center of mass of the whole system ;;           along direction theta ;;        b. updating the along-theta components of the two velocity vectors. ;;   4. Convert from the theta-based vector representation of velocity back to ;;      the usual speed/heading representation for each gas-molecules. ;;   5. Perform final cleanup and update derived quantities.  to collide-with [ other-gas-molecules ] ;; gas-molecules procedure   ;;; PHASE 1: initial setup    ;; for convenience, grab some quantities from other-gas-molecules   let mass2 [mass] of other-gas-molecules   let speed2 [speed] of other-gas-molecules   let heading2 [heading] of other-gas-molecules    ;; since gas-molecules are modeled as zero-size points, theta isn\'t meaningfully   ;; defined. we can assign it randomly without affecting the model\'s outcome.   let theta (random-float 360)     ;;; PHASE 2: convert velocities to theta-based vector representation    ;; convert velocity from speed/heading representation to components   ;; along theta and perpendicular to theta   let v1t (speed * cos (theta - heading))   let v1l (speed * sin (theta - heading))    ;; do the same for other-gas-molecules   let v2t (speed2 * cos (theta - heading2))   let v2l (speed2 * sin (theta - heading2))     ;;; PHASE 3: manipulate vectors to implement collision    ;; compute the velocity of the system\'s center of mass along theta   let vcm (((mass * v1t) + (mass2 * v2t)) / (mass + mass2) )    ;; now compute the new velocity for each gas-molecules along direction theta.   ;; Velocity perpendicular to theta is unaffected by a collision along theta,   ;; so the next two lines actually implement the collision itself, in the   ;; sense that the effects of the collision are exactly the following changes   ;; in gas-molecules velocity.   set v1t (2 * vcm - v1t)   set v2t (2 * vcm - v2t)    ;;; PHASE 4: convert back to normal speed/heading    ;; now convert velocity vector into new speed and heading   set speed sqrt ((v1t ^ 2) + (v1l ^ 2))   set energy (0.5 * mass * speed ^ 2)   ;; if the magnitude of the velocity vector is 0, atan is undefined. but   ;; speed will be 0, so heading is irrelevant anyway. therefore, in that   ;; case we\'ll just leave it unmodified.   if v1l != 0 or v1t != 0     [ set heading (theta - (atan v1l v1t)) ]    ;; and do the same for other-gas-molecules   ask other-gas-molecules [     set speed sqrt ((v2t ^ 2) + (v2l ^ 2))     set energy (0.5 * mass * (speed ^ 2))     if v2l != 0 or v2t != 0       [ set heading (theta - (atan v2l v2t)) ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;REPORTERS;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to-report speed-from-energy   report sqrt (2 * energy / mass) end  to-report energy-from-speed   report 0.5 * mass * speed * speed end   ; Copyright 2007 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":470,"top":10,"right":888,"bottom":429,"dimensions":{"minPxcor":-20,"maxPxcor":20,"minPycor":-20,"maxPycor":20,"patchSize":10,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"go","left":105,"top":10,"right":205,"bottom":43,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"setup","left":5,"top":10,"right":100,"bottom":43,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"1","variable":"initial-oxygen-molecules","left":5,"top":50,"right":205,"bottom":83,"display":"initial-oxygen-molecules","min":"0","max":"200","default":64,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Number of Molecules', 'Oxygen')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"number-oxygen-molecules\"));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"Oxygen","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks number-oxygen-molecules","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Number of Molecules', 'Hydrogen')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"number-hydrogen-molecules\"));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"Hydrogen","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks number-hydrogen-molecules","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Number of Molecules', 'Water')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"number-water-molecules\"));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"Water","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks number-water-molecules","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Number of Molecules","left":215,"top":10,"right":469,"bottom":144,"xAxis":"time","yAxis":"count","xmin":0,"xmax":10,"ymin":0,"ymax":50,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"Oxygen","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks number-oxygen-molecules","type":"pen"},{"display":"Hydrogen","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks number-hydrogen-molecules","type":"pen"},{"display":"Water","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks number-water-molecules","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"500","compiledStep":"1","variable":"initial-gas-temperature","left":5,"top":120,"right":205,"bottom":153,"display":"initial-gas-temperature","min":"0","max":"500","default":200,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10000","compiledStep":"10","variable":"bond-energy-released","left":5,"top":195,"right":205,"bottom":228,"display":"bond-energy-released","min":"0","max":"10000","default":3240,"step":"10","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"5000","compiledStep":"50","variable":"activation-energy","left":5,"top":160,"right":205,"bottom":193,"display":"activation-energy","min":"0","max":"5000","default":2000,"step":"50","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Gas Temp. vs. time', 'gas temp.')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"temperature\"));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"gas temp.","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks temperature","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Gas Temp. vs. time","left":215,"top":142,"right":469,"bottom":268,"xAxis":"time","yAxis":"temp.","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"gas temp.","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks temperature","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"2","variable":"initial-hydrogen-molecules","left":5,"top":85,"right":205,"bottom":118,"display":"initial-hydrogen-molecules","min":"0","max":"200","default":104,"step":"2","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"100","compiledMax":"10000","compiledStep":"100","variable":"pressure-limit-container","left":5,"top":230,"right":205,"bottom":263,"display":"pressure-limit-container","min":"100","max":"10000","default":4000,"step":"100","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_34_55 = procedures[\"SPEED-UP-ONE-MOLECULE\"]();   if (_maybestop_34_55 instanceof Exception.StopInterrupt) { return _maybestop_34_55; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":" speed-up-one-molecule","left":5,"top":305,"right":205,"bottom":339,"display":"speed up & trace one molecule","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"show-wall-hits?","left":15,"top":375,"right":190,"bottom":408,"display":"show-wall-hits?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"highlight-product?","left":15,"top":340,"right":190,"bottom":373,"display":"highlight-product?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Pressure vs. time', 'pressure')(function() {       try {         var reporterContext = false;         var letVars = { };         if (world.observer.getGlobal(\"box-intact?\")) {           plotManager.plotPoint(world.ticker.tickCount(), ListPrims.mean(world.observer.getGlobal(\"pressure-history\")));         }       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"pressure","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if box-intact? [plotxy ticks mean pressure-history]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Pressure vs. time","left":215,"top":268,"right":469,"bottom":408,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"pressure","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if box-intact? [plotxy ticks mean pressure-history]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["initial-oxygen-molecules", "initial-gas-temperature", "bond-energy-released", "activation-energy", "initial-hydrogen-molecules", "pressure-limit-container", "show-wall-hits?", "highlight-product?", "tick-advance-amount", "max-tick-advance-amount", "box-edge", "avg-speed", "avg-energy", "length-horizontal-surface", "length-vertical-surface", "pressure-history", "pressure", "temperature", "box-intact?", "molecule-size", "margin-outside-box", "number-oxygen-molecules", "number-hydrogen-molecules", "number-water-molecules"], ["initial-oxygen-molecules", "initial-gas-temperature", "bond-energy-released", "activation-energy", "initial-hydrogen-molecules", "pressure-limit-container", "show-wall-hits?", "highlight-product?"], [], -20, 20, -20, 20, 10, false, false, turtleShapes, linkShapes, function(){});
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
      world.patches().agentFilter(function() {
        return ((Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (world.topology.maxPxcor - world.observer.getGlobal("margin-outside-box"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), (world.topology.maxPycor - world.observer.getGlobal("margin-outside-box")))) || (Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), (world.topology.maxPxcor - world.observer.getGlobal("margin-outside-box"))) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (world.topology.maxPycor - world.observer.getGlobal("margin-outside-box")))));
      }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 5); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-oxygen-molecules"), "GAS-MOLECULES").ask(function() {
        procedures["SETUP-INITIAL-OXYGEN-MOLECULES"]();
        procedures["RANDOM-POSITION"]();
      }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-hydrogen-molecules"), "GAS-MOLECULES").ask(function() {
        procedures["SETUP-INITIAL-HYDROGEN-MOLECULES"]();
        procedures["RANDOM-POSITION"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("size", world.observer.getGlobal("molecule-size"));
      SelfManager.self().setVariable("last-collision", Nobody);
      SelfManager.self().setVariable("shape", "hydrogen");
      SelfManager.self().setVariable("molecule-type", "hydrogen");
      SelfManager.self().setVariable("mass", 2);
      SelfManager.self().setVariable("momentum-difference", 0);
      SelfManager.self().setVariable("momentum-instant", 0);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("size", world.observer.getGlobal("molecule-size"));
      SelfManager.self().setVariable("last-collision", Nobody);
      SelfManager.self().setVariable("shape", "oxygen");
      SelfManager.self().setVariable("molecule-type", "oxygen");
      SelfManager.self().setVariable("mass", 16);
      SelfManager.self().setVariable("momentum-difference", 0);
      SelfManager.self().setVariable("momentum-instant", 0);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let openPatches = Nobody; letVars['openPatches'] = openPatches;
      let openPatch = Nobody; letVars['openPatch'] = openPatch;
      openPatches = world.patches().agentFilter(function() {
        return (Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (world.topology.maxPxcor - world.observer.getGlobal("margin-outside-box"))) && Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), (world.topology.maxPycor - world.observer.getGlobal("margin-outside-box"))));
      }); letVars['openPatches'] = openPatches;
      openPatch = ListPrims.oneOf(openPatches); letVars['openPatch'] = openPatch;
      SelfManager.self().moveTo(openPatch);
      SelfManager.self().setVariable("heading", Prims.randomFloat(360));
      SelfManager.self().setVariable("energy", world.observer.getGlobal("initial-gas-temperature"));
      SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
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
      world.turtleManager.turtlesOfBreed("FLASHES").ask(function() {
        if (Prims.gt((world.ticker.tickCount() - SelfManager.self().getVariable("birthday")), 0.4)) {
          SelfManager.self().die();
        }
        SelfManager.self().setVariable("color", ListPrims.lput((255 - Prims.div((255 * (world.ticker.tickCount() - SelfManager.self().getVariable("birthday"))), 0.4)), [20, 20, 20]));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let newPatch = SelfManager.self().patchAhead(1); letVars['newPatch'] = newPatch;
      let newPx = newPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); }); letVars['newPx'] = newPx;
      let newPy = newPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }); letVars['newPy'] = newPy;
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().sprout(1, "TURTLES").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FLASHES"));
        SelfManager.self().setVariable("color", [20, 20, 20, 255]);
        SelfManager.self().setVariable("birthday", world.ticker.tickCount());
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let centerPatch = world.patches()._optimalOneOfWith(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), 0) && Prims.equality(SelfManager.self().getPatchVariable("pycor"), 0));
      }); letVars['centerPatch'] = centerPatch;
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      if (!Prims.equality(SelfManager.self().patchAhead((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-advance-amount"))), SelfManager.self().getPatchHere())) {
        SelfManager.self().setVariable("last-collision", Nobody);
      }
      SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-advance-amount")));
      if ((((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.maxPxcor) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.minPxcor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.maxPycor))) {
        SelfManager.self().die();
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
      world.observer.setGlobal("pressure", (100 * ListPrims.sum(world.turtleManager.turtlesOfBreed("GAS-MOLECULES").projectionBy(function() { return SelfManager.self().getVariable("momentum-difference"); }))));
      world.observer.setGlobal("pressure-history", ListPrims.lput(world.observer.getGlobal("pressure"), ListPrims.butFirst(world.observer.getGlobal("pressure-history"))));
      world.turtleManager.turtlesOfBreed("GAS-MOLECULES").ask(function() { SelfManager.self().setVariable("momentum-difference", 0); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      if (world.turtleManager.turtlesOfBreed("GAS-MOLECULES")._optimalAnyWith(function() { return Prims.gt(SelfManager.self().getVariable("speed"), 0); })) {
        world.observer.setGlobal("tick-advance-amount", ListPrims.min(ListPrims.list(Prims.div(1, NLMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("GAS-MOLECULES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })))), world.observer.getGlobal("max-tick-advance-amount"))));
      }
      else {
        world.observer.setGlobal("tick-advance-amount", world.observer.getGlobal("max-tick-advance-amount"));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.clearDrawing();
      world.turtleManager.turtlesOfBreed("GAS-MOLECULES").ask(function() { SelfManager.self().penManager.raisePen(); }, true);
      ListPrims.oneOf(world.turtleManager.turtlesOfBreed("GAS-MOLECULES")).ask(function() {
        SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") * 10));
        SelfManager.self().setVariable("energy", procedures["ENERGY-FROM-SPEED"]());
        SelfManager.self().penManager.lowerPen();
      }, true);
      procedures["CALCULATE-TICK-ADVANCE-AMOUNT"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let hitHydrogen = SelfManager.self().breedHere("GAS-MOLECULES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("molecule-type"), "hydrogen"); }); letVars['hitHydrogen'] = hitHydrogen;
      let thisInitialOxygenMoleculesEnergy = SelfManager.self().getVariable("energy"); letVars['thisInitialOxygenMoleculesEnergy'] = thisInitialOxygenMoleculesEnergy;
      let totalEnergy = 0; letVars['totalEnergy'] = totalEnergy;
      if (Prims.gte(hitHydrogen.size(), 2)) {
        if (Prims.lt(SelfManager.self().getVariable("speed"), 0)) {
          SelfManager.self().setVariable("speed", 0);
        }
        let hydrogenReactants = ListPrims.nOf(2, hitHydrogen); letVars['hydrogenReactants'] = hydrogenReactants;
        let totalEnergyAllReactants = (thisInitialOxygenMoleculesEnergy + ListPrims.sum(hydrogenReactants.projectionBy(function() { return SelfManager.self().getVariable("energy"); }))); letVars['totalEnergyAllReactants'] = totalEnergyAllReactants;
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
            let totalEnergyProducts = (totalEnergyAllReactants + world.observer.getGlobal("bond-energy-released")); letVars['totalEnergyProducts'] = totalEnergyProducts;
            SelfManager.self().setVariable("energy", Prims.div(totalEnergyProducts, 2));
            SelfManager.self().setVariable("speed", procedures["SPEED-FROM-ENERGY"]());
          }, true);
          SelfManager.self().die();
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
  procs["checkForReaction"] = temp;
  procs["CHECK-FOR-REACTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(SelfPrims._optimalCountOther(SelfManager.self().inRadius(SelfManager.self().breedHere("GAS-MOLECULES"), 1)), 1)) {
        let candidate = ListPrims.oneOf(SelfManager.self().breedHere("GAS-MOLECULES")._optimalOtherWith(function() {
          return (Prims.lt(SelfManager.self(), SelfManager.myself()) && !Prims.equality(SelfManager.myself(), SelfManager.self().getVariable("last-collision")));
        })); letVars['candidate'] = candidate;
        if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfManager.self().getVariable("speed"), 0) || Prims.gt(candidate.projectionBy(function() { return SelfManager.self().getVariable("speed"); }), 0)))) {
          procedures["COLLIDE-WITH"](candidate);
          candidate.ask(function() { SelfManager.self().penManager.raisePen(); }, true);
          SelfManager.self().setVariable("last-collision", candidate);
          let thisCandidate = SelfManager.self(); letVars['thisCandidate'] = thisCandidate;
          candidate.ask(function() { SelfManager.self().setVariable("last-collision", thisCandidate); }, true);
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
  procs["checkForCollision"] = temp;
  procs["CHECK-FOR-COLLISION"] = temp;
  temp = (function(otherGasMolecules) {
    try {
      var reporterContext = false;
      var letVars = { };
      let mass2 = otherGasMolecules.projectionBy(function() { return SelfManager.self().getVariable("mass"); }); letVars['mass2'] = mass2;
      let speed2 = otherGasMolecules.projectionBy(function() { return SelfManager.self().getVariable("speed"); }); letVars['speed2'] = speed2;
      let heading2 = otherGasMolecules.projectionBy(function() { return SelfManager.self().getVariable("heading"); }); letVars['heading2'] = heading2;
      let theta = Prims.randomFloat(360); letVars['theta'] = theta;
      let v1t = (SelfManager.self().getVariable("speed") * NLMath.cos((theta - SelfManager.self().getVariable("heading")))); letVars['v1t'] = v1t;
      let v1l = (SelfManager.self().getVariable("speed") * NLMath.sin((theta - SelfManager.self().getVariable("heading")))); letVars['v1l'] = v1l;
      let v2t = (speed2 * NLMath.cos((theta - heading2))); letVars['v2t'] = v2t;
      let v2l = (speed2 * NLMath.sin((theta - heading2))); letVars['v2l'] = v2l;
      let vcm = Prims.div(((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)), (SelfManager.self().getVariable("mass") + mass2)); letVars['vcm'] = vcm;
      v1t = ((2 * vcm) - v1t); letVars['v1t'] = v1t;
      v2t = ((2 * vcm) - v2t); letVars['v2t'] = v2t;
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
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return NLMath.sqrt(Prims.div((2 * SelfManager.self().getVariable("energy")), SelfManager.self().getVariable("mass")))
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
  procs["speedFromEnergy"] = temp;
  procs["SPEED-FROM-ENERGY"] = temp;
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