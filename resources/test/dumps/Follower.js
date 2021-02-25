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
  var name    = 'Turtle Count';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('unattached', plotOps.makePenOps, false, new PenBundle.State(125, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Count', 'unattached')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("color"), 125); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('heads', plotOps.makePenOps, false, new PenBundle.State(45, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Count', 'heads')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("color"), 45); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('bodies', plotOps.makePenOps, false, new PenBundle.State(95, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Count', 'bodies')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("color"), 95); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('tails', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Count', 'tails')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable("color"), 65); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Count', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, world.observer.getGlobal("population"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "#", true, true, 0, 50, 0, 350, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["leader", "follower"], [])('turtles-own [   leader    ;; the turtle this turtle is following,             ;; or nobody if not following   follower  ;; the turtle that is following this turtle,             ;; or nobody if not being followed ]  to setup   clear-all   create-turtles population   [ set color magenta     setxy random-xcor random-ycor     set leader nobody     set follower nobody ]   reset-ticks end  to go   ask turtles   [ if leader = nobody     [ attach-turtle ] ]   ask turtles [ turn-turtle ]   ask turtles [ fd 1 ]   tick end  to attach-turtle  ;; turtle procedure   ;; find a random patch to test inside the donut   let xd near-radius + random (far-radius - near-radius)   let yd near-radius + random (far-radius - near-radius)   if random 2 = 0 [ set xd (- xd) ]   if random 2 = 0 [ set yd (- yd) ]   ;; check for free turtles on that patch   let candidate one-of (turtles-at xd yd) with [follower = nobody]   ;; if we didn\'t find a suitable turtle, stop   if candidate = nobody [ stop ]   ;; we\'re all set, so latch on!   ask candidate [ set follower myself ]   set leader candidate   ;; change our color   ifelse follower = nobody   [ set color lime ]   [ set color sky     set shape \"line\" ]   ;; change our leader\'s color   ask candidate   [ ifelse leader = nobody     [ set color yellow ]     [ set color sky       set shape \"line\" ] ] end  to turn-turtle  ;; turtle procedure   ;; if we are still unattached...   ifelse leader = nobody   ;; do a somewhat random glide   [ rt random-float waver - random-float waver ]   ;; otherwise follow the leader   [ face leader ] end   ; Copyright 1998 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":318,"top":10,"right":814,"bottom":507,"dimensions":{"minPxcor":-30,"maxPxcor":30,"minPycor":-30,"maxPycor":30,"patchSize":8,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":153,"top":73,"right":240,"bottom":106,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":53,"top":73,"right":138,"bottom":106,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"359","compiledStep":"1","variable":"waver","left":73,"top":186,"right":223,"bottom":219,"display":"waver","min":"0","max":"359","default":70,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"far-radius","left":73,"top":151,"right":223,"bottom":184,"display":"far-radius","min":"0","max":"50","default":10,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10000","compiledStep":"10","variable":"population","left":52,"top":33,"right":240,"bottom":66,"display":"population","min":"0","max":"10000","default":1500,"step":"10","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"near-radius","left":73,"top":116,"right":223,"bottom":149,"display":"near-radius","min":"0","max":"50","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Count', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setYRange(0, world.observer.getGlobal(\"population\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Count', 'unattached')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 125); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"unattached","interval":1,"mode":0,"color":-5825686,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = magenta]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Count', 'heads')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 45); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"heads","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = yellow]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Count', 'bodies')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 95); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"bodies","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = sky]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Count', 'tails')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(PrimChecks.agentset.countWith(world.turtles(), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 65); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"tails","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = lime]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Turtle Count","left":5,"top":232,"right":313,"bottom":529,"xAxis":"time","yAxis":"#","xmin":0,"xmax":50,"ymin":0,"ymax":350,"autoPlotOn":true,"legendOn":true,"setupCode":"set-plot-y-range 0 population","updateCode":"","pens":[{"display":"unattached","interval":1,"mode":0,"color":-5825686,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = magenta]","type":"pen"},{"display":"heads","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = yellow]","type":"pen"},{"display":"bodies","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = sky]","type":"pen"},{"display":"tails","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = lime]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["waver", "far-radius", "population", "near-radius"], ["waver", "far-radius", "population", "near-radius"], [], -30, 30, -30, 30, 8, true, true, turtleShapes, linkShapes, function(){});
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
      world.turtleManager.createTurtles(world.observer.getGlobal("population"), "").ask(function() {
        SelfManager.self().setVariable("color", 125);
        SelfManager.self().setXY(RandomPrims.randomFloatInRange(world.topology.minPxcor, world.topology.maxPxcor), RandomPrims.randomFloatInRange(world.topology.minPycor, world.topology.maxPycor));
        SelfManager.self().setVariable("leader", Nobody);
        SelfManager.self().setVariable("follower", Nobody);
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
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        if (Prims.equality(SelfManager.self().getVariable("leader"), Nobody)) {
          procedures["ATTACH-TURTLE"]();
        }
      }, true);
      Errors.askNobodyCheck(world.turtles()).ask(function() { procedures["TURN-TURTLE"](); }, true);
      Errors.askNobodyCheck(world.turtles()).ask(function() { SelfManager.self()._optimalFdOne(); }, true);
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
      let xd = PrimChecks.math.plus(world.observer.getGlobal("near-radius"), PrimChecks.math.random_unchecked(PrimChecks.math.minus(world.observer.getGlobal("far-radius"), world.observer.getGlobal("near-radius")))); letVars['xd'] = xd;
      let yd = PrimChecks.math.plus(world.observer.getGlobal("near-radius"), PrimChecks.math.random_unchecked(PrimChecks.math.minus(world.observer.getGlobal("far-radius"), world.observer.getGlobal("near-radius")))); letVars['yd'] = yd;
      if (Prims.equality(RandomPrims.randomLong(2), 0)) {
        xd = PrimChecks.math.unaryminus(xd); letVars['xd'] = xd;
      }
      if (Prims.equality(RandomPrims.randomLong(2), 0)) {
        yd = PrimChecks.math.unaryminus(yd); letVars['yd'] = yd;
      }
      let candidate = PrimChecks.agentset.oneOfWith(SelfManager.self().turtlesAt(xd, yd), function() { return Prims.equality(SelfManager.self().getVariable("follower"), Nobody); }); letVars['candidate'] = candidate;
      if (Prims.equality(candidate, Nobody)) {
        throw new Exception.StopInterrupt;
      }
      Errors.askNobodyCheck(candidate).ask(function() { SelfManager.self().setVariable("follower", SelfManager.myself()); }, true);
      SelfManager.self().setVariable("leader", candidate);
      if (Prims.equality(SelfManager.self().getVariable("follower"), Nobody)) {
        SelfManager.self().setVariable("color", 65);
      }
      else {
        SelfManager.self().setVariable("color", 95);
        SelfManager.self().setVariable("shape", "line");
      }
      Errors.askNobodyCheck(candidate).ask(function() {
        if (Prims.equality(SelfManager.self().getVariable("leader"), Nobody)) {
          SelfManager.self().setVariable("color", 45);
        }
        else {
          SelfManager.self().setVariable("color", 95);
          SelfManager.self().setVariable("shape", "line");
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["attachTurtle"] = temp;
  procs["ATTACH-TURTLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(SelfManager.self().getVariable("leader"), Nobody)) {
        SelfManager.self().right(PrimChecks.math.minus_unchecked(PrimChecks.math.randomFloat(world.observer.getGlobal("waver")), PrimChecks.math.randomFloat(world.observer.getGlobal("waver"))));
      }
      else {
        SelfManager.self().face(SelfManager.self().getVariable("leader"));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["turnTurtle"] = temp;
  procs["TURN-TURTLE"] = temp;
  return procs;
})();
world.observer.setGlobal("waver", 70);
world.observer.setGlobal("far-radius", 10);
world.observer.setGlobal("population", 1500);
world.observer.setGlobal("near-radius", 5);