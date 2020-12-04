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
  var name    = 'Turtle Populations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('color5', plotOps.makePenOps, false, new PenBundle.State(5, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color5')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 5); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color15', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color15')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color25', plotOps.makePenOps, false, new PenBundle.State(25, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color25')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 25); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color35', plotOps.makePenOps, false, new PenBundle.State(35, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color35')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 35); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color45', plotOps.makePenOps, false, new PenBundle.State(45, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color45')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 45); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color55', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color55')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color65', plotOps.makePenOps, false, new PenBundle.State(65, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color65')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 65); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color125', plotOps.makePenOps, false, new PenBundle.State(125, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color125')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 75); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color85', plotOps.makePenOps, false, new PenBundle.State(85, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color85')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 85); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('color95', plotOps.makePenOps, false, new PenBundle.State(95, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', 'color95')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 95); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Turtle Populations', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, world.turtles().size());
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Number", false, true, 0, 100, 0, 70, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [   max-percent  ;; percent of the total population that is in the                ;; most populous group ]  to setup   ;; We don\'t use clear-all here because that would erase   ;; any walls the user drew.   clear-turtles   clear-all-plots   ;; create turtles with random colors and locations   create-turtles number [     set color item (random colors) [5 15 25 35 45 55 65 85 95 125]     setxy random-xcor random-ycor     move-off-wall   ]   reset-ticks end  to go   if (variance [color] of turtles) = 0     [ stop ]   ask turtles [     rt random 50 - random 50     meet     ;; move, but don\'t step on wall     ifelse [pcolor] of patch-ahead 0.5 = black       [ fd 0.5 ]       [ rt random 360 ]   ]   find-top-species   tick end  to meet    ;; turtle procedure - when two turtles are next door,            ;; the left one changes to the color of the right one   let candidate one-of turtles-at 1 0   if candidate != nobody [     set color [color] of candidate   ] end  to find-top-species  ;;find the percentage of the most populous species   let winning-amount 0   foreach base-colors [ c ->     let how-many count turtles with [color = c]     if how-many > winning-amount       [ set winning-amount how-many ]   ]   set max-percent (100 * winning-amount / count turtles) end  ;; --------------------------------------------------------------------------------- ;; Below this point are procedure definitions that have to do with \"walls,\" which ;; the user may create in order to separate groups of turtles from one another. ;; The use of walls is optional, and can be seen as a more advanced topic. ;; ---------------------------------------------------------------------------------  to place-wall   if mouse-down? [     ;; Note that when we place a wall, we must also place walls     ;; at the world boundaries, so turtles can\'t change rooms     ;; by wrapping around the edge of the world.     ask patches with [abs pycor = max-pycor or                       pycor = round mouse-ycor] [       set pcolor white       ;; There might be some turtles standing where the       ;; new walls is, so we need to move them into a room.       ask turtles-here [ move-off-wall ]     ]     display   ] end  to remove-wall   if mouse-down? [     ask patches with [pycor = round mouse-ycor]       [ set pcolor black ]     display   ] end  to remove-all-walls   clear-patches end  to move-off-wall  ;; turtle procedure   while [pcolor != black] [     move-to one-of neighbors   ] end   ; Copyright 1997 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":305,"top":10,"right":733,"bottom":439,"dimensions":{"minPxcor":-17,"maxPxcor":17,"minPycor":-17,"maxPycor":17,"patchSize":12,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":98,"top":80,"right":171,"bottom":113,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":18,"top":80,"right":95,"bottom":113,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"2","compiledMax":"10","compiledStep":"1","variable":"colors","left":158,"top":36,"right":287,"bottom":69,"display":"colors","min":"2","max":"10","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"1000","compiledStep":"1","variable":"number","left":15,"top":36,"right":156,"bottom":69,"display":"number","min":"1","max":"1000","default":300,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setYRange(0, world.turtles().size());       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color5')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 5); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color5","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 5]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color15')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 15); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color15","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 15]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color25')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 25); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color25","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 25]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color35')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 35); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color35","interval":1,"mode":0,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 35]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color45')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 45); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color45","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 45]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color55')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 55); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color55","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 55]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color65')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 65); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color65","interval":1,"mode":0,"color":-13840069,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 65]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color125')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 75); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color125","interval":1,"mode":0,"color":-5825686,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 75]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color85')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 85); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color85","interval":1,"mode":0,"color":-11221820,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 85]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Turtle Populations', 'color95')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 95); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"color95","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 95]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Turtle Populations","left":5,"top":130,"right":298,"bottom":353,"xAxis":"Time","yAxis":"Number","xmin":0,"xmax":100,"ymin":0,"ymax":70,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-y-range 0 count turtles","updateCode":"","pens":[{"display":"color5","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 5]","type":"pen"},{"display":"color15","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 15]","type":"pen"},{"display":"color25","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 25]","type":"pen"},{"display":"color35","interval":1,"mode":0,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 35]","type":"pen"},{"display":"color45","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 45]","type":"pen"},{"display":"color55","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 55]","type":"pen"},{"display":"color65","interval":1,"mode":0,"color":-13840069,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 65]","type":"pen"},{"display":"color125","interval":1,"mode":0,"color":-5825686,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 75]","type":"pen"},{"display":"color85","interval":1,"mode":0,"color":-11221820,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 85]","type":"pen"},{"display":"color95","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = 95]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"max-percent\")","source":"max-percent","left":35,"top":151,"right":152,"bottom":196,"display":"% most populous","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_43 = procedures[\"PLACE-WALL\"]();   if (_maybestop_33_43 instanceof Exception.StopInterrupt) { return _maybestop_33_43; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"place-wall","left":5,"top":421,"right":95,"bottom":454,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_44 = procedures[\"REMOVE-WALL\"]();   if (_maybestop_33_44 instanceof Exception.StopInterrupt) { return _maybestop_33_44; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"remove-wall","left":100,"top":421,"right":195,"bottom":454,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_49 = procedures[\"REMOVE-ALL-WALLS\"]();   if (_maybestop_33_49 instanceof Exception.StopInterrupt) { return _maybestop_33_49; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"remove-all-walls","left":200,"top":421,"right":300,"bottom":454,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"display":"As the model runs, you may optionally create and remove walls that separate groups of turtles.","left":24,"top":391,"right":281,"bottom":419,"fontSize":10,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["colors", "number", "max-percent"], ["colors", "number"], [], -17, 17, -17, 17, 12, true, true, turtleShapes, linkShapes, function(){});
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
      world.turtleManager.clearTurtles();
      plotManager.clearAllPlots();
      world.turtleManager.createTurtles(world.observer.getGlobal("number"), "").ask(function() {
        SelfManager.self().setVariable("color", ListPrims.item(PrimChecks.math.random(world.observer.getGlobal("colors")), [5, 15, 25, 35, 45, 55, 65, 85, 95, 125]));
        SelfManager.self().setXY(RandomPrims.randomFloatInRange(world.topology.minPxcor, world.topology.maxPxcor), RandomPrims.randomFloatInRange(world.topology.minPycor, world.topology.maxPycor));
        procedures["MOVE-OFF-WALL"]();
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
      if (Prims.equality(ListPrims.variance(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("color"); })), 0)) {
        throw new Exception.StopInterrupt;
      }
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        SelfManager.self().right((RandomPrims.randomLong(50) - RandomPrims.randomLong(50)));
        procedures["MEET"]();
        if (Prims.equality(SelfManager.self().patchAhead(0.5).projectionBy(function() { return SelfManager.self().getPatchVariable("pcolor"); }), 0)) {
          SelfManager.self()._optimalFdLessThan1(0.5);
        }
        else {
          SelfManager.self().right(RandomPrims.randomLong(360));
        }
      }, true);
      procedures["FIND-TOP-SPECIES"]();
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
      let candidate = ListPrims.oneOf(SelfManager.self().turtlesAt(1, 0)); letVars['candidate'] = candidate;
      if (!Prims.equality(candidate, Nobody)) {
        SelfManager.self().setVariable("color", candidate.projectionBy(function() { return SelfManager.self().getVariable("color"); }));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["meet"] = temp;
  procs["MEET"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let winningAmount = 0; letVars['winningAmount'] = winningAmount;
      var _foreach_1075_1082 = Tasks.forEach(Tasks.commandTask(function(c) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        let howMany = world.turtles()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), c); }); letVars['howMany'] = howMany;
        if (Prims.gt(howMany, winningAmount)) {
          winningAmount = howMany; letVars['winningAmount'] = winningAmount;
        }
      }, "[ c -> let count turtles with [ color = c ] if how-many > winning-amount [ set winning-amount how-many ] ]"), ColorModel.BASE_COLORS); if(reporterContext && _foreach_1075_1082 !== undefined) { return _foreach_1075_1082; }
      world.observer.setGlobal("max-percent", PrimChecks.math.div((100 * winningAmount), world.turtles().size()));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["findTopSpecies"] = temp;
  procs["FIND-TOP-SPECIES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (MousePrims.isDown()) {
        Errors.askNobodyCheck(world.patches().agentFilter(function() {
          return (Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.topology.maxPycor) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), NLMath.round(MousePrims.getY())));
        })).ask(function() {
          SelfManager.self().setPatchVariable("pcolor", 9.9);
          Errors.askNobodyCheck(SelfManager.self().turtlesHere()).ask(function() { procedures["MOVE-OFF-WALL"](); }, true);
        }, true);
        notImplemented('display', undefined)();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["placeWall"] = temp;
  procs["PLACE-WALL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (MousePrims.isDown()) {
        Errors.askNobodyCheck(world.patches().agentFilter(function() {
          return Prims.equality(SelfManager.self().getPatchVariable("pycor"), NLMath.round(MousePrims.getY()));
        })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
        notImplemented('display', undefined)();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["removeWall"] = temp;
  procs["REMOVE-WALL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearPatches();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["removeAllWalls"] = temp;
  procs["REMOVE-ALL-WALLS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      while (!Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 0)) {
        SelfManager.self().moveTo(ListPrims.oneOf(SelfManager.self().getNeighbors()));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["moveOffWall"] = temp;
  procs["MOVE-OFF-WALL"] = temp;
  return procs;
})();
world.observer.setGlobal("colors", 5);
world.observer.setGlobal("number", 300);