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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Strategy Counts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('CC', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Strategy Counts', 'CC')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("shape"), "circle"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('CD', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Strategy Counts', 'CD')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("shape"), "circle 2"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('DC', plotOps.makePenOps, false, new PenBundle.State(44, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Strategy Counts', 'DC')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("shape"), "square"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('DD', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Strategy Counts', 'DD')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("shape"), "square 2"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "count", true, true, 0, 10, 0, 1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["ptr", "cooperate-with-same?", "cooperate-with-different?"], [])(';; agents have a probablity to reproduce and a strategy turtles-own [ ptr cooperate-with-same? cooperate-with-different? ]  globals [   ;; the remaining variables support the replication of published experiments   meet                  ;; how many interactions occurred this turn   meet-agg              ;; how many interactions occurred through the run   last100meet           ;; meet for the last 100 ticks   meetown               ;; what number of individuals met someone of their own color this turn   meetown-agg           ;; what number of individuals met someone of their own color throughout the run   last100meetown        ;; meetown for the last 100 ticks   meetother             ;; what number of individuals met someone of a different color this turn   meetother-agg         ;; what number of individuals met someone of a different color throughout the run   last100meetother      ;; meetother for the last 100 ticks   coopown               ;; how many interactions this turn were cooperating with the same color   coopown-agg           ;; how many interactions throughout the run were cooperating with the same color   last100coopown        ;; coopown for the last 100 ticks   coopother             ;; how many interactions this turn were cooperating with a different color   coopother-agg         ;; how many interactions throughout the run were cooperating with a different color   defother              ;; how many interactions this turn were defecting with a different color   defother-agg          ;; how many interactions throughout the run were defecting with a different color   last100defother       ;; defother for the last 100 ticks   last100cc             ;; how many cooperate-cooperate genotypes have there been in the last 100 ticks   last100cd             ;; how many cooperate-defect genotypes have there been in the last 100 ticks   last100dc             ;; how many defect-cooperate genotypes have there been in the last 100 ticks   last100dd             ;; how many defect-defect genotypes have there been in the last 100 ticks   last100consist-ethno  ;; how many interactions consistent with ethnocentrism in the last 100 ticks   last100coop           ;; how many interactions have been cooperation in the last 100 ticks ]  to setup-empty   clear-all   initialize-variables   reset-ticks end  ;; creates a world with an agent on each patch to setup-full   clear-all   initialize-variables   ask patches [ create-turtle ]   reset-ticks end  to initialize-variables   ;; initialize all the variables   set meetown 0   set meetown-agg 0   set meet 0   set meet-agg 0   set coopown 0   set coopown-agg 0   set defother 0   set defother-agg 0   set meetother 0   set meetother-agg 0   set coopother 0   set coopother-agg 0   set last100dd []   set last100cd []   set last100cc []   set last100dc []   set last100coopown []   set last100defother []   set last100consist-ethno []   set last100meetown []   set last100meetother []   set last100meet []   set last100coop [] end  ;; creates a new agent in the world to create-turtle  ;; patch procedure   sprout 1 [     set color random-color     ;; determine the strategy for interacting with someone of the same color     set cooperate-with-same? (random-float 1 < immigrant-chance-cooperate-with-same)     ;; determine the strategy for interacting with someone of a different color     set cooperate-with-different? (random-float 1 < immigrant-chance-cooperate-with-different)     ;; change the shape of the agent on the basis of the strategy     update-shape   ] end  to-report random-color   report one-of [red blue yellow green] end  ;; this is used to clear stats that change between each tick to clear-stats   set meetown 0   set meet 0   set coopown 0   set defother 0   set meetother 0   set coopother 0 end  ;; the main routine to go   clear-stats     ;; clear the turn based stats   immigrate       ;; new agents immigrate into the world    ;; reset the probability to reproduce   ask turtles [ set ptr initial-ptr ]    ;; have all of the agents interact with other agents if they can   ask turtles [ interact ]   ;; now they reproduce   ask turtles [ reproduce ]   death           ;; kill some of the agents   update-stats    ;; update the states for the aggregate and last 100 ticks   tick end  ;; random individuals enter the world on empty cells to immigrate   let empty-patches patches with [not any? turtles-here]   ;; we can\'t have more immigrants than there are empty patches   let how-many min list immigrants-per-day (count empty-patches)   ask n-of how-many empty-patches [ create-turtle ] end  to interact  ;; turtle procedure    ;; interact with Von Neumann neighborhood   ask turtles-on neighbors4 [     ;; the commands inside the ASK are written from the point of view     ;; of the agent being interacted with.  To refer back to the agent     ;; that initiated the interaction, we use the MYSELF primitive.     set meet meet + 1     set meet-agg meet-agg + 1     ;; do one thing if the individual interacting is the same color as me     if color = [color] of myself [       ;; record the fact the agent met someone of the own color       set meetown meetown + 1       set meetown-agg meetown-agg + 1       ;; if I cooperate then I reduce my PTR and increase my neighbors       if [cooperate-with-same?] of myself [         set coopown coopown + 1         set coopown-agg coopown-agg + 1         ask myself [ set ptr ptr - cost-of-giving ]         set ptr ptr + gain-of-receiving       ]     ]     ;; if we are different colors we take a different strategy     if color != [color] of myself [       ;; record stats on encounters       set meetother meetother + 1       set meetother-agg meetother-agg + 1       ;; if we cooperate with different colors then reduce our PTR and increase our neighbors       ifelse [cooperate-with-different?] of myself [         set coopother coopother + 1         set coopother-agg coopother-agg + 1         ask myself [ set ptr ptr - cost-of-giving ]         set ptr ptr + gain-of-receiving       ]       [         set defother defother + 1         set defother-agg defother-agg + 1       ]     ]   ] end  ;; use PTR to determine if the agent gets to reproduce to reproduce  ;; turtle procedure   ;; if a random variable is less than the PTR the agent can reproduce   if random-float 1 < ptr [     ;; find an empty location to reproduce into     let destination one-of neighbors4 with [not any? turtles-here]     if destination != nobody [       ;; if the location exists hatch a copy of the current turtle in the new location       ;;  but mutate the child       hatch 1 [         move-to destination         mutate       ]     ]   ] end  ;; modify the children of agents according to the mutation rate to mutate  ;; turtle procedure   ;; mutate the color   if random-float 1 < mutation-rate [     let old-color color     while [color = old-color]       [ set color random-color ]   ]   ;; mutate the strategy flags;   ;; use NOT to toggle the flag   if random-float 1 < mutation-rate [     set cooperate-with-same? not cooperate-with-same?   ]   if random-float 1 < mutation-rate [     set cooperate-with-different? not cooperate-with-different?   ]   ;; make sure the shape of the agent reflects its strategy   update-shape end  to death   ;; check to see if a random variable is less than the death rate for each agent   ask turtles [     if random-float 1 < death-rate [ die ]   ] end  ;; make sure the shape matches the strategy to update-shape   ;; if the agent cooperates with same they are a circle   ifelse cooperate-with-same? [     ifelse cooperate-with-different?       [ set shape \"circle\" ]    ;; filled in circle (altruist)       [ set shape \"circle 2\" ]  ;; empty circle (ethnocentric)   ]   ;; if the agent doesn\'t cooperate with same they are a square   [     ifelse cooperate-with-different?       [ set shape \"square\" ]    ;; filled in square (cosmopolitan)       [ set shape \"square 2\" ]  ;; empty square (egoist)   ] end  ;; this routine calculates a moving average of some stats over the last 100 ticks to update-stats   set last100dd        shorten lput (count turtles with [shape = \"square 2\"]) last100dd   set last100cc        shorten lput (count turtles with [shape = \"circle\"]) last100cc   set last100cd        shorten lput (count turtles with [shape = \"circle 2\"]) last100cd   set last100dc        shorten lput (count turtles with [shape = \"square\"]) last100dc   set last100coopown   shorten lput coopown last100coopown   set last100defother  shorten lput defother last100defother   set last100meetown   shorten lput meetown last100meetown   set last100coop      shorten lput (coopown + coopother) last100coop   set last100meet      shorten lput meet last100meet   set last100meetother shorten lput meetother last100meetother end  ;; this is used to keep all of the last100 lists the right length to-report shorten [the-list]   ifelse length the-list > 100     [ report butfirst the-list ]     [ report the-list ] end  ;; these are used in the BehaviorSpace experiments  to-report meetown-percent   report meetown / max list 1 meet end to-report meetown-agg-percent   report meetown-agg / max list 1 meet-agg end to-report coopown-percent   report coopown / max list 1 meetown end to-report coopown-agg-percent   report coopown-agg / max list 1 meetown-agg end to-report defother-percent   report defother / max list 1 meetother end to-report defother-agg-percent   report defother-agg / max list 1 meetother-agg end to-report consist-ethno-percent   report (defother + coopown) / (max list 1 meet ) end to-report consist-ethno-agg-percent   report (defother-agg + coopown-agg) / (max list 1 meet-agg ) end to-report coop-percent   report (coopown + coopother) / (max list 1 meet ) end to-report coop-agg-percent   report (coopown-agg + coopother-agg) / (max list 1 meet-agg) end to-report cc-count   report sum last100cc / max list 1 length last100cc end to-report cd-count   report sum last100cd / max list 1 length last100cd end to-report dc-count   report sum last100dc / max list 1 length last100dc end to-report dd-count   report sum last100dd / max list 1 length last100dd end to-report cc-percent   report cc-count / (max list 1 (cc-count + cd-count + dc-count + dd-count)) end to-report cd-percent   report cd-count / (max list 1 (cc-count + cd-count + dc-count + dd-count)) end to-report dc-percent   report dc-count / (max list 1 (cc-count + cd-count + dc-count + dd-count)) end to-report dd-percent   report dd-count / (max list 1 (cc-count + cd-count + dc-count + dd-count)) end to-report last100coopown-percent   report sum last100coopown / max list 1 sum last100meetown end to-report last100defother-percent   report sum last100defother / max list 1 sum last100meetother end to-report last100consist-ethno-percent   report (sum last100defother + sum last100coopown) / max list 1 sum last100meet end to-report last100meetown-percent   report sum last100meetown / max list 1 sum last100meet end to-report last100coop-percent   report sum last100coop / max list 1 sum last100meet end   ; Copyright 2003 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":323,"top":10,"right":790,"bottom":478,"dimensions":{"minPxcor":0,"maxPxcor":50,"minPycor":0,"maxPycor":50,"patchSize":9,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.001","variable":"mutation-rate","left":5,"top":150,"right":171,"bottom":183,"display":"mutation-rate","min":"0","max":"1","default":0.005,"step":"0.0010","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.05","variable":"death-rate","left":5,"top":184,"right":171,"bottom":217,"display":"death-rate","min":"0","max":"1","default":0.1,"step":"0.05","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"immigrants-per-day","left":5,"top":218,"right":171,"bottom":251,"display":"immigrants-per-day","min":"0","max":"100","default":1,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"initial-PTR","left":172,"top":150,"right":318,"bottom":183,"display":"initial-PTR","min":"0","max":"1","default":0.12,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"cost-of-giving","left":172,"top":184,"right":318,"bottom":217,"display":"cost-of-giving","min":"0","max":"1","default":0.01,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"gain-of-receiving","left":172,"top":218,"right":318,"bottom":251,"display":"gain-of-receiving","min":"0","max":"1","default":0.03,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_44 = procedures[\"SETUP-EMPTY\"]();   if (_maybestop_33_44 instanceof Exception.StopInterrupt) { return _maybestop_33_44; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup-empty","left":20,"top":29,"right":128,"bottom":62,"display":"setup empty","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":222,"top":29,"right":295,"bottom":62,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Strategy Counts', 'CC')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable(\"shape\"), \"circle\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"CC","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"circle\"]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Strategy Counts', 'CD')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable(\"shape\"), \"circle 2\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"CD","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"circle 2\"]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Strategy Counts', 'DC')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable(\"shape\"), \"square\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"DC","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"square\"]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Strategy Counts', 'DD')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable(\"shape\"), \"square 2\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"DD","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"square 2\"]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Strategy Counts","left":6,"top":323,"right":318,"bottom":525,"xAxis":"time","yAxis":"count","xmin":0,"xmax":10,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"CC","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"circle\"]","type":"pen"},{"display":"CD","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"circle 2\"]","type":"pen"},{"display":"DC","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"square\"]","type":"pen"},{"display":"DD","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks count turtles with [shape = \"square 2\"]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_43 = procedures[\"SETUP-FULL\"]();   if (_maybestop_33_43 instanceof Exception.StopInterrupt) { return _maybestop_33_43; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup-full","left":130,"top":29,"right":219,"bottom":62,"display":"setup full","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"immigrant-chance-cooperate-with-same","left":5,"top":252,"right":318,"bottom":285,"display":"immigrant-chance-cooperate-with-same","min":"0","max":"1","default":0.5,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"immigrant-chance-cooperate-with-different","left":5,"top":286,"right":318,"bottom":319,"display":"immigrant-chance-cooperate-with-different","min":"0","max":"1","default":0.5,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"display":"Circles cooperate with same color Squares defect with same color Filled-in shapes cooperate with different color Empty shapes defect with different color ","left":9,"top":77,"right":304,"bottom":142,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["mutation-rate", "death-rate", "immigrants-per-day", "initial-ptr", "cost-of-giving", "gain-of-receiving", "immigrant-chance-cooperate-with-same", "immigrant-chance-cooperate-with-different", "meet", "meet-agg", "last100meet", "meetown", "meetown-agg", "last100meetown", "meetother", "meetother-agg", "last100meetother", "coopown", "coopown-agg", "last100coopown", "coopother", "coopother-agg", "defother", "defother-agg", "last100defother", "last100cc", "last100cd", "last100dc", "last100dd", "last100consist-ethno", "last100coop"], ["mutation-rate", "death-rate", "immigrants-per-day", "initial-ptr", "cost-of-giving", "gain-of-receiving", "immigrant-chance-cooperate-with-same", "immigrant-chance-cooperate-with-different"], [], 0, 50, 0, 50, 9, true, true, turtleShapes, linkShapes, function(){});
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
      procedures["INITIALIZE-VARIABLES"]();
      world.ticker.reset();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupEmpty"] = temp;
  procs["SETUP-EMPTY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      procedures["INITIALIZE-VARIABLES"]();
      Errors.askNobodyCheck(world.patches()).ask(function() { procedures["CREATE-TURTLE"](); }, true);
      world.ticker.reset();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupFull"] = temp;
  procs["SETUP-FULL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("meetown", 0);
      world.observer.setGlobal("meetown-agg", 0);
      world.observer.setGlobal("meet", 0);
      world.observer.setGlobal("meet-agg", 0);
      world.observer.setGlobal("coopown", 0);
      world.observer.setGlobal("coopown-agg", 0);
      world.observer.setGlobal("defother", 0);
      world.observer.setGlobal("defother-agg", 0);
      world.observer.setGlobal("meetother", 0);
      world.observer.setGlobal("meetother-agg", 0);
      world.observer.setGlobal("coopother", 0);
      world.observer.setGlobal("coopother-agg", 0);
      world.observer.setGlobal("last100dd", []);
      world.observer.setGlobal("last100cd", []);
      world.observer.setGlobal("last100cc", []);
      world.observer.setGlobal("last100dc", []);
      world.observer.setGlobal("last100coopown", []);
      world.observer.setGlobal("last100defother", []);
      world.observer.setGlobal("last100consist-ethno", []);
      world.observer.setGlobal("last100meetown", []);
      world.observer.setGlobal("last100meetother", []);
      world.observer.setGlobal("last100meet", []);
      world.observer.setGlobal("last100coop", []);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["initializeVariables"] = temp;
  procs["INITIALIZE-VARIABLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().sprout(1, "TURTLES").ask(function() {
        SelfManager.self().setVariable("color", procedures["RANDOM-COLOR"]());
        SelfManager.self().setVariable("cooperate-with-same?", Prims.lt(PrimChecks.math.randomFloat(1), world.observer.getGlobal("immigrant-chance-cooperate-with-same")));
        SelfManager.self().setVariable("cooperate-with-different?", Prims.lt(PrimChecks.math.randomFloat(1), world.observer.getGlobal("immigrant-chance-cooperate-with-different")));
        procedures["UPDATE-SHAPE"]();
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["createTurtle"] = temp;
  procs["CREATE-TURTLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.list.oneOf([15, 105, 45, 55]);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["randomColor"] = temp;
  procs["RANDOM-COLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("meetown", 0);
      world.observer.setGlobal("meet", 0);
      world.observer.setGlobal("coopown", 0);
      world.observer.setGlobal("defother", 0);
      world.observer.setGlobal("meetother", 0);
      world.observer.setGlobal("coopother", 0);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["clearStats"] = temp;
  procs["CLEAR-STATS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["CLEAR-STATS"]();
      procedures["IMMIGRATE"]();
      Errors.askNobodyCheck(world.turtles()).ask(function() { SelfManager.self().setVariable("ptr", world.observer.getGlobal("initial-ptr")); }, true);
      Errors.askNobodyCheck(world.turtles()).ask(function() { procedures["INTERACT"](); }, true);
      Errors.askNobodyCheck(world.turtles()).ask(function() { procedures["REPRODUCE"](); }, true);
      procedures["DEATH"]();
      procedures["UPDATE-STATS"]();
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
      let emptyPatches = PrimChecks.agentset.with_unchecked(world.patches(), function() { return !PrimChecks.agentset.any_unchecked(SelfManager.self().turtlesHere()); }); letVars['emptyPatches'] = emptyPatches;
      let howMany = PrimChecks.list.min(ListPrims.list(world.observer.getGlobal("immigrants-per-day"), PrimChecks.agentset.count(emptyPatches))); letVars['howMany'] = howMany;
      Errors.askNobodyCheck(PrimChecks.list.nOf(howMany, emptyPatches)).ask(function() { procedures["CREATE-TURTLE"](); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["immigrate"] = temp;
  procs["IMMIGRATE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(PrimChecks.agentset.turtlesOn_unchecked(SelfManager.self().getNeighbors4())).ask(function() {
        world.observer.setGlobal("meet", (world.observer.getGlobal("meet") + 1));
        world.observer.setGlobal("meet-agg", (world.observer.getGlobal("meet-agg") + 1));
        if (Prims.equality(SelfManager.self().getVariable("color"), PrimChecks.agentset.of_unchecked(SelfManager.myself(), function() { return SelfManager.self().getVariable("color"); }))) {
          world.observer.setGlobal("meetown", (world.observer.getGlobal("meetown") + 1));
          world.observer.setGlobal("meetown-agg", (world.observer.getGlobal("meetown-agg") + 1));
          if (PrimChecks.agentset.of_unchecked(SelfManager.myself(), function() { return SelfManager.self().getVariable("cooperate-with-same?"); })) {
            world.observer.setGlobal("coopown", (world.observer.getGlobal("coopown") + 1));
            world.observer.setGlobal("coopown-agg", (world.observer.getGlobal("coopown-agg") + 1));
            Errors.askNobodyCheck(SelfManager.myself()).ask(function() {
              SelfManager.self().setVariable("ptr", (SelfManager.self().getVariable("ptr") - world.observer.getGlobal("cost-of-giving")));
            }, true);
            SelfManager.self().setVariable("ptr", (SelfManager.self().getVariable("ptr") + world.observer.getGlobal("gain-of-receiving")));
          }
        }
        if (!Prims.equality(SelfManager.self().getVariable("color"), PrimChecks.agentset.of_unchecked(SelfManager.myself(), function() { return SelfManager.self().getVariable("color"); }))) {
          world.observer.setGlobal("meetother", (world.observer.getGlobal("meetother") + 1));
          world.observer.setGlobal("meetother-agg", (world.observer.getGlobal("meetother-agg") + 1));
          if (PrimChecks.agentset.of_unchecked(SelfManager.myself(), function() { return SelfManager.self().getVariable("cooperate-with-different?"); })) {
            world.observer.setGlobal("coopother", (world.observer.getGlobal("coopother") + 1));
            world.observer.setGlobal("coopother-agg", (world.observer.getGlobal("coopother-agg") + 1));
            Errors.askNobodyCheck(SelfManager.myself()).ask(function() {
              SelfManager.self().setVariable("ptr", (SelfManager.self().getVariable("ptr") - world.observer.getGlobal("cost-of-giving")));
            }, true);
            SelfManager.self().setVariable("ptr", (SelfManager.self().getVariable("ptr") + world.observer.getGlobal("gain-of-receiving")));
          }
          else {
            world.observer.setGlobal("defother", (world.observer.getGlobal("defother") + 1));
            world.observer.setGlobal("defother-agg", (world.observer.getGlobal("defother-agg") + 1));
          }
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["interact"] = temp;
  procs["INTERACT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(PrimChecks.math.randomFloat(1), SelfManager.self().getVariable("ptr"))) {
        let destination = PrimChecks.agentset.oneOfWith(SelfManager.self().getNeighbors4(), function() { return !PrimChecks.agentset.any_unchecked(SelfManager.self().turtlesHere()); }); letVars['destination'] = destination;
        if (!Prims.equality(destination, Nobody)) {
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().moveTo(destination);
            procedures["MUTATE"]();
          }, true);
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["reproduce"] = temp;
  procs["REPRODUCE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(PrimChecks.math.randomFloat(1), world.observer.getGlobal("mutation-rate"))) {
        let oldColor = SelfManager.self().getVariable("color"); letVars['oldColor'] = oldColor;
        while (Prims.equality(SelfManager.self().getVariable("color"), oldColor)) {
          SelfManager.self().setVariable("color", procedures["RANDOM-COLOR"]());
        }
      }
      if (Prims.lt(PrimChecks.math.randomFloat(1), world.observer.getGlobal("mutation-rate"))) {
        SelfManager.self().setVariable("cooperate-with-same?", !SelfManager.self().getVariable("cooperate-with-same?"));
      }
      if (Prims.lt(PrimChecks.math.randomFloat(1), world.observer.getGlobal("mutation-rate"))) {
        SelfManager.self().setVariable("cooperate-with-different?", !SelfManager.self().getVariable("cooperate-with-different?"));
      }
      procedures["UPDATE-SHAPE"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["mutate"] = temp;
  procs["MUTATE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        if (Prims.lt(PrimChecks.math.randomFloat(1), world.observer.getGlobal("death-rate"))) {
          SelfManager.self().die();
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["death"] = temp;
  procs["DEATH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (SelfManager.self().getVariable("cooperate-with-same?")) {
        if (SelfManager.self().getVariable("cooperate-with-different?")) {
          SelfManager.self().setVariable("shape", "circle");
        }
        else {
          SelfManager.self().setVariable("shape", "circle 2");
        }
      }
      else {
        if (SelfManager.self().getVariable("cooperate-with-different?")) {
          SelfManager.self().setVariable("shape", "square");
        }
        else {
          SelfManager.self().setVariable("shape", "square 2");
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["updateShape"] = temp;
  procs["UPDATE-SHAPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("last100dd", procedures["SHORTEN"](PrimChecks.list.lput(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("shape"), "square 2"); }), world.observer.getGlobal("last100dd"))));
      world.observer.setGlobal("last100cc", procedures["SHORTEN"](PrimChecks.list.lput(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("shape"), "circle"); }), world.observer.getGlobal("last100cc"))));
      world.observer.setGlobal("last100cd", procedures["SHORTEN"](PrimChecks.list.lput(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("shape"), "circle 2"); }), world.observer.getGlobal("last100cd"))));
      world.observer.setGlobal("last100dc", procedures["SHORTEN"](PrimChecks.list.lput(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("shape"), "square"); }), world.observer.getGlobal("last100dc"))));
      world.observer.setGlobal("last100coopown", procedures["SHORTEN"](PrimChecks.list.lput(world.observer.getGlobal("coopown"), world.observer.getGlobal("last100coopown"))));
      world.observer.setGlobal("last100defother", procedures["SHORTEN"](PrimChecks.list.lput(world.observer.getGlobal("defother"), world.observer.getGlobal("last100defother"))));
      world.observer.setGlobal("last100meetown", procedures["SHORTEN"](PrimChecks.list.lput(world.observer.getGlobal("meetown"), world.observer.getGlobal("last100meetown"))));
      world.observer.setGlobal("last100coop", procedures["SHORTEN"](PrimChecks.list.lput((world.observer.getGlobal("coopown") + world.observer.getGlobal("coopother")), world.observer.getGlobal("last100coop"))));
      world.observer.setGlobal("last100meet", procedures["SHORTEN"](PrimChecks.list.lput(world.observer.getGlobal("meet"), world.observer.getGlobal("last100meet"))));
      world.observer.setGlobal("last100meetother", procedures["SHORTEN"](PrimChecks.list.lput(world.observer.getGlobal("meetother"), world.observer.getGlobal("last100meetother"))));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["updateStats"] = temp;
  procs["UPDATE-STATS"] = temp;
  temp = (function(theList) {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.gt(PrimChecks.list.length(theList), 100)) {
        Errors.reportInContextCheck(reporterContext);
        return PrimChecks.list.butFirst('butfirst')(theList);
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return theList;
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["shorten"] = temp;
  procs["SHORTEN"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(world.observer.getGlobal("meetown"), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meet"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["meetownPercent"] = temp;
  procs["MEETOWN-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(world.observer.getGlobal("meetown-agg"), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meet-agg"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["meetownAggPercent"] = temp;
  procs["MEETOWN-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(world.observer.getGlobal("coopown"), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meetown"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["coopownPercent"] = temp;
  procs["COOPOWN-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(world.observer.getGlobal("coopown-agg"), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meetown-agg"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["coopownAggPercent"] = temp;
  procs["COOPOWN-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(world.observer.getGlobal("defother"), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meetother"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["defotherPercent"] = temp;
  procs["DEFOTHER-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(world.observer.getGlobal("defother-agg"), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meetother-agg"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["defotherAggPercent"] = temp;
  procs["DEFOTHER-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div((world.observer.getGlobal("defother") + world.observer.getGlobal("coopown")), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meet"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["consistEthnoPercent"] = temp;
  procs["CONSIST-ETHNO-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div((world.observer.getGlobal("defother-agg") + world.observer.getGlobal("coopown-agg")), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meet-agg"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["consistEthnoAggPercent"] = temp;
  procs["CONSIST-ETHNO-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div((world.observer.getGlobal("coopown") + world.observer.getGlobal("coopother")), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meet"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["coopPercent"] = temp;
  procs["COOP-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div((world.observer.getGlobal("coopown-agg") + world.observer.getGlobal("coopother-agg")), PrimChecks.list.max(ListPrims.list(1, world.observer.getGlobal("meet-agg"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["coopAggPercent"] = temp;
  procs["COOP-AGG-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(PrimChecks.list.sum(world.observer.getGlobal("last100cc")), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.length(world.observer.getGlobal("last100cc")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["ccCount"] = temp;
  procs["CC-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(PrimChecks.list.sum(world.observer.getGlobal("last100cd")), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.length(world.observer.getGlobal("last100cd")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["cdCount"] = temp;
  procs["CD-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(PrimChecks.list.sum(world.observer.getGlobal("last100dc")), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.length(world.observer.getGlobal("last100dc")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["dcCount"] = temp;
  procs["DC-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(PrimChecks.list.sum(world.observer.getGlobal("last100dd")), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.length(world.observer.getGlobal("last100dd")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["ddCount"] = temp;
  procs["DD-COUNT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(procedures["CC-COUNT"](), PrimChecks.list.max(ListPrims.list(1, (((procedures["CC-COUNT"]() + procedures["CD-COUNT"]()) + procedures["DC-COUNT"]()) + procedures["DD-COUNT"]()))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["ccPercent"] = temp;
  procs["CC-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(procedures["CD-COUNT"](), PrimChecks.list.max(ListPrims.list(1, (((procedures["CC-COUNT"]() + procedures["CD-COUNT"]()) + procedures["DC-COUNT"]()) + procedures["DD-COUNT"]()))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["cdPercent"] = temp;
  procs["CD-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(procedures["DC-COUNT"](), PrimChecks.list.max(ListPrims.list(1, (((procedures["CC-COUNT"]() + procedures["CD-COUNT"]()) + procedures["DC-COUNT"]()) + procedures["DD-COUNT"]()))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["dcPercent"] = temp;
  procs["DC-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(procedures["DD-COUNT"](), PrimChecks.list.max(ListPrims.list(1, (((procedures["CC-COUNT"]() + procedures["CD-COUNT"]()) + procedures["DC-COUNT"]()) + procedures["DD-COUNT"]()))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["ddPercent"] = temp;
  procs["DD-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(PrimChecks.list.sum(world.observer.getGlobal("last100coopown")), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.sum(world.observer.getGlobal("last100meetown")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["last100coopownPercent"] = temp;
  procs["LAST100COOPOWN-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(PrimChecks.list.sum(world.observer.getGlobal("last100defother")), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.sum(world.observer.getGlobal("last100meetother")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["last100defotherPercent"] = temp;
  procs["LAST100DEFOTHER-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div((PrimChecks.list.sum(world.observer.getGlobal("last100defother")) + PrimChecks.list.sum(world.observer.getGlobal("last100coopown"))), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.sum(world.observer.getGlobal("last100meet")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["last100consistEthnoPercent"] = temp;
  procs["LAST100CONSIST-ETHNO-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(PrimChecks.list.sum(world.observer.getGlobal("last100meetown")), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.sum(world.observer.getGlobal("last100meet")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["last100meetownPercent"] = temp;
  procs["LAST100MEETOWN-PERCENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.div(PrimChecks.list.sum(world.observer.getGlobal("last100coop")), PrimChecks.list.max(ListPrims.list(1, PrimChecks.list.sum(world.observer.getGlobal("last100meet")))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["last100coopPercent"] = temp;
  procs["LAST100COOP-PERCENT"] = temp;
  return procs;
})();
world.observer.setGlobal("mutation-rate", 0.005);
world.observer.setGlobal("death-rate", 0.1);
world.observer.setGlobal("immigrants-per-day", 1);
world.observer.setGlobal("initial-ptr", 0.12);
world.observer.setGlobal("cost-of-giving", 0.01);
world.observer.setGlobal("gain-of-receiving", 0.03);
world.observer.setGlobal("immigrant-chance-cooperate-with-same", 0.5);
world.observer.setGlobal("immigrant-chance-cooperate-with-different", 0.5);