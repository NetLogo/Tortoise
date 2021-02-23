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
  var name    = 'Power';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('power-rated', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Power', 'power-rated')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.observer.getGlobal("power-rated"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('avg-power', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Power', 'avg-power')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.observer.getGlobal("average-power"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Power', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, (3 * world.observer.getGlobal("power-rated")));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "power", false, true, 0, 250, 0, 105, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('patches-own [ x y rod? ]  globals [ power   old-power   old-power-2  ; Used to compute average-power   old-power-3  ; Used to compute average-power   old-power-4  ; Used to compute average-power   average-power   power-change   rod-length   n-rods   ; Number of rods   r ; Constant for half the reactor size ]   to setup   clear-all   set-default-shape turtles \"circle\"   setup-globals   ask patches   [ set x (abs pxcor)     set y (abs pycor)     set rod? false     build-reactor     setup-nuclear-fuel   ]   setup-control-rods   reset-ticks end  to setup-globals   set power   0   set old-power  0   set old-power-2  0   set old-power-3  0   set old-power-4  0   set r (reactor-size / 2)   set rod-length rod-depth   set n-rods (reactor-size / (rod-spacing + 1)) - 1 end  to build-reactor ;; Patch Procedure   if ((x = r) and (y <= r)) or ((y = r) and (x <= r))   [ set pcolor gray     set rod? false   ] end  to setup-nuclear-fuel ;; Patch Procedure   if (pcolor = black) and (x < r) and (y < r)   [ set pcolor red ] end  to setup-control-rods   if rod-depth > reactor-size [set rod-depth reactor-size]   if (rod-spacing = 5 or rod-spacing = 6 and reactor-size = 10)   [ user-message \"Spacing too large for reactor size.  Spacing set to 4.\"     set rod-spacing 4     set n-rods 1   ]   let rod-x 1 - r + rod-spacing    ;; Make the rods more evenly spaced at particular settings   if (rod-spacing = 2 and reactor-size != 30 and reactor-size != 60)   [ set rod-x rod-x + 1 ]   if (rod-spacing = 3 and (reactor-size mod 20) != 0)   [ set n-rods n-rods + 1     set rod-x rod-x - 1   ]   if (rod-spacing = 5 and (reactor-size = 20 or reactor-size = 40 or reactor-size = 70))   [ ifelse (reactor-size = 20)     [ set rod-x rod-x + 1 ]     [ set rod-x rod-x + 2 ]   ]   if (rod-spacing = 6 and (reactor-size mod 20) = 0)   [ set n-rods n-rods + 1     ifelse (reactor-size = 80)     [ set rod-x rod-x - 2 ]     [ set rod-x rod-x - 1 ]   ]    repeat n-rods   [ ask patches with [ pxcor = rod-x ]     [ set rod? true ]     set rod-x rod-x + rod-spacing + 1   ]   ask patches [ build-reactor ]   place-control-rods end  ;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;; Run Time Procedures ;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;;Forever Button to auto-react   if not any? turtles     [stop]   ifelse power-change >= 0   [ if (power - power-rated) >= 0     [ set rod-length ( rod-length + 50 ) ]   ]   [ if (power - power-rated) < 0     [ set rod-length ( rod-length - 10 ) ]   ]   if rod-length < 0   [ set rod-length 0 ]   if rod-length > reactor-size   [ set rod-length reactor-size ]   react end  ;;Forever Button to manu-react   if not any? turtles     [stop]   if rod-depth > reactor-size [set rod-depth reactor-size]   set rod-length rod-depth   react end  to react   place-control-rods   set power 0   ask turtles   [ fd  1     if (pcolor = gray)     [ die ]     if (pcolor = red)     [ fission ]   ]   set average-power ((power + old-power + old-power-2 + old-power-3 + old-power-4) / 5)   set power-change (power - old-power)   set old-power-4 old-power-3   set old-power-3 old-power-2   set old-power-2 old-power   set old-power power   tick end  to release-neutron ;; Button   let whom nobody   create-turtles 1   [ set color yellow     set xcor ((random (reactor-size - 2)) - r)     set ycor ((random (reactor-size - 2)) - r)     set whom self     if (pcolor = gray)     [ die ]   ]   if whom = nobody   [ release-neutron ] end  to place-control-rods   ask patches with [ rod? ]   [ ifelse (pycor >= (r - rod-length))     [ set pcolor  gray ]     [ set pcolor black ]   ] end  to fission ;; Turtle Procedure   rt random 360   if (pcolor = red)   [ if (spend-fuel?)     [ set pcolor brown ]     let gain (1 / count turtles-here)     set power power + gain     hatch ((2 + random 2) * gain)       [ rt random 360 ]   ] end   ; Copyright 1998 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":273,"top":10,"right":704,"bottom":442,"dimensions":{"minPxcor":-70,"maxPxcor":70,"minPycor":-70,"maxPycor":70,"patchSize":3,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":15,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"power-rated","left":7,"top":138,"right":157,"bottom":171,"display":"power-rated","min":"0","max":"100","default":35,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"10","compiledMax":"136","compiledStep":"2","variable":"reactor-size","left":7,"top":39,"right":157,"bottom":72,"display":"reactor-size","min":"10","max":"136","default":122,"step":"2","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":7,"top":261,"right":89,"bottom":294,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_43 = procedures[\"MANU-REACT\"]();   if (_maybestop_33_43 instanceof Exception.StopInterrupt) { return _maybestop_33_43; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"manu-react","left":181,"top":261,"right":267,"bottom":294,"display":"manual","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_43 = procedures[\"AUTO-REACT\"]();   if (_maybestop_33_43 instanceof Exception.StopInterrupt) { return _maybestop_33_43; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"auto-react","left":89,"top":261,"right":182,"bottom":294,"display":"automatic","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"power\")","source":"power","left":165,"top":39,"right":266,"bottom":84,"display":"Power","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"power-change\")","source":"power-change","left":165,"top":89,"right":266,"bottom":134,"display":"Power change","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Power', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setYRange(0, (3 * world.observer.getGlobal(\"power-rated\")));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Power', 'power-rated')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.observer.getGlobal(\"power-rated\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"power-rated","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot power-rated","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Power', 'avg-power')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.observer.getGlobal(\"average-power\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"avg-power","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot average-power","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Power","left":7,"top":299,"right":267,"bottom":464,"xAxis":"time","yAxis":"power","xmin":0,"xmax":250,"ymin":0,"ymax":105,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-y-range 0 (3 * power-rated)","updateCode":"","pens":[{"display":"power-rated","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot power-rated","type":"pen"},{"display":"avg-power","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot average-power","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"world.observer.getGlobal(\"reactor-size\")","compiledStep":"1","variable":"rod-depth","left":7,"top":179,"right":157,"bottom":212,"display":"rod-depth","min":"0","max":"reactor-size","default":0,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_48 = procedures[\"RELEASE-NEUTRON\"]();   if (_maybestop_33_48 instanceof Exception.StopInterrupt) { return _maybestop_33_48; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"release-neutron","left":104,"top":221,"right":267,"bottom":254,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"6","compiledStep":"1","variable":"rod-spacing","left":7,"top":72,"right":157,"bottom":105,"display":"rod-spacing","min":"1","max":"6","default":4,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"spend-fuel?","left":7,"top":105,"right":157,"bottom":138,"display":"spend-fuel?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["power-rated", "reactor-size", "rod-depth", "rod-spacing", "spend-fuel?", "power", "old-power", "old-power-2", "old-power-3", "old-power-4", "average-power", "power-change", "rod-length", "n-rods", "r"], ["power-rated", "reactor-size", "rod-depth", "rod-spacing", "spend-fuel?"], ["x", "y", "rod?"], -70, 70, -70, 70, 3, false, false, turtleShapes, linkShapes, function(){});
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
      BreedManager.setDefaultShape(world.turtles().getSpecialName(), "circle")
      procedures["SETUP-GLOBALS"]();
      Errors.askNobodyCheck(world.patches()).ask(function() {
        SelfManager.self().setPatchVariable("x", PrimChecks.math.abs(SelfManager.self().getPatchVariable("pxcor")));
        SelfManager.self().setPatchVariable("y", PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")));
        SelfManager.self().setPatchVariable("rod?", false);
        procedures["BUILD-REACTOR"]();
        procedures["SETUP-NUCLEAR-FUEL"]();
      }, true);
      procedures["SETUP-CONTROL-RODS"]();
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
      world.observer.setGlobal("power", 0);
      world.observer.setGlobal("old-power", 0);
      world.observer.setGlobal("old-power-2", 0);
      world.observer.setGlobal("old-power-3", 0);
      world.observer.setGlobal("old-power-4", 0);
      world.observer.setGlobal("r", PrimChecks.math.div(world.observer.getGlobal("reactor-size"), 2));
      world.observer.setGlobal("rod-length", world.observer.getGlobal("rod-depth"));
      world.observer.setGlobal("n-rods", (PrimChecks.math.div(world.observer.getGlobal("reactor-size"), (world.observer.getGlobal("rod-spacing") + 1)) - 1));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupGlobals"] = temp;
  procs["SETUP-GLOBALS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (((Prims.equality(SelfManager.self().getPatchVariable("x"), world.observer.getGlobal("r")) && Prims.lte(SelfManager.self().getPatchVariable("y"), world.observer.getGlobal("r"))) || (Prims.equality(SelfManager.self().getPatchVariable("y"), world.observer.getGlobal("r")) && Prims.lte(SelfManager.self().getPatchVariable("x"), world.observer.getGlobal("r"))))) {
        SelfManager.self().setPatchVariable("pcolor", 5);
        SelfManager.self().setPatchVariable("rod?", false);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["buildReactor"] = temp;
  procs["BUILD-REACTOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (((Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 0) && Prims.lt(SelfManager.self().getPatchVariable("x"), world.observer.getGlobal("r"))) && Prims.lt(SelfManager.self().getPatchVariable("y"), world.observer.getGlobal("r")))) {
        SelfManager.self().setPatchVariable("pcolor", 15);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupNuclearFuel"] = temp;
  procs["SETUP-NUCLEAR-FUEL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt(world.observer.getGlobal("rod-depth"), world.observer.getGlobal("reactor-size"))) {
        world.observer.setGlobal("rod-depth", world.observer.getGlobal("reactor-size"));
      }
      if (((Prims.equality(world.observer.getGlobal("rod-spacing"), 5) || Prims.equality(world.observer.getGlobal("rod-spacing"), 6)) && Prims.equality(world.observer.getGlobal("reactor-size"), 10))) {
        UserDialogPrims.confirm("Spacing too large for reactor size.  Spacing set to 4.");
        world.observer.setGlobal("rod-spacing", 4);
        world.observer.setGlobal("n-rods", 1);
      }
      let rodX = ((1 - world.observer.getGlobal("r")) + world.observer.getGlobal("rod-spacing")); letVars['rodX'] = rodX;
      if (((Prims.equality(world.observer.getGlobal("rod-spacing"), 2) && !Prims.equality(world.observer.getGlobal("reactor-size"), 30)) && !Prims.equality(world.observer.getGlobal("reactor-size"), 60))) {
        rodX = (rodX + 1); letVars['rodX'] = rodX;
      }
      if ((Prims.equality(world.observer.getGlobal("rod-spacing"), 3) && !Prims.equality(PrimChecks.math.mod(world.observer.getGlobal("reactor-size"), 20), 0))) {
        world.observer.setGlobal("n-rods", (world.observer.getGlobal("n-rods") + 1));
        rodX = (rodX - 1); letVars['rodX'] = rodX;
      }
      if ((Prims.equality(world.observer.getGlobal("rod-spacing"), 5) && ((Prims.equality(world.observer.getGlobal("reactor-size"), 20) || Prims.equality(world.observer.getGlobal("reactor-size"), 40)) || Prims.equality(world.observer.getGlobal("reactor-size"), 70)))) {
        if (Prims.equality(world.observer.getGlobal("reactor-size"), 20)) {
          rodX = (rodX + 1); letVars['rodX'] = rodX;
        }
        else {
          rodX = (rodX + 2); letVars['rodX'] = rodX;
        }
      }
      if ((Prims.equality(world.observer.getGlobal("rod-spacing"), 6) && Prims.equality(PrimChecks.math.mod(world.observer.getGlobal("reactor-size"), 20), 0))) {
        world.observer.setGlobal("n-rods", (world.observer.getGlobal("n-rods") + 1));
        if (Prims.equality(world.observer.getGlobal("reactor-size"), 80)) {
          rodX = (rodX - 2); letVars['rodX'] = rodX;
        }
        else {
          rodX = (rodX - 1); letVars['rodX'] = rodX;
        }
      }
      for (let _index_1937_1943 = 0, _repeatcount_1937_1943 = StrictMath.floor(world.observer.getGlobal("n-rods")); _index_1937_1943 < _repeatcount_1937_1943; _index_1937_1943++){
        Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("pxcor"), rodX); })).ask(function() { SelfManager.self().setPatchVariable("rod?", true); }, true);
        rodX = ((rodX + world.observer.getGlobal("rod-spacing")) + 1); letVars['rodX'] = rodX;
      }
      Errors.askNobodyCheck(world.patches()).ask(function() { procedures["BUILD-REACTOR"](); }, true);
      procedures["PLACE-CONTROL-RODS"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupControlRods"] = temp;
  procs["SETUP-CONTROL-RODS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!PrimChecks.agentset.any_unchecked(world.turtles())) {
        throw new Exception.StopInterrupt;
      }
      if (Prims.gte(world.observer.getGlobal("power-change"), 0)) {
        if (Prims.gte((world.observer.getGlobal("power") - world.observer.getGlobal("power-rated")), 0)) {
          world.observer.setGlobal("rod-length", (world.observer.getGlobal("rod-length") + 50));
        }
      }
      else {
        if (Prims.lt((world.observer.getGlobal("power") - world.observer.getGlobal("power-rated")), 0)) {
          world.observer.setGlobal("rod-length", (world.observer.getGlobal("rod-length") - 10));
        }
      }
      if (Prims.lt(world.observer.getGlobal("rod-length"), 0)) {
        world.observer.setGlobal("rod-length", 0);
      }
      if (Prims.gt(world.observer.getGlobal("rod-length"), world.observer.getGlobal("reactor-size"))) {
        world.observer.setGlobal("rod-length", world.observer.getGlobal("reactor-size"));
      }
      procedures["REACT"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["autoReact"] = temp;
  procs["AUTO-REACT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!PrimChecks.agentset.any_unchecked(world.turtles())) {
        throw new Exception.StopInterrupt;
      }
      if (Prims.gt(world.observer.getGlobal("rod-depth"), world.observer.getGlobal("reactor-size"))) {
        world.observer.setGlobal("rod-depth", world.observer.getGlobal("reactor-size"));
      }
      world.observer.setGlobal("rod-length", world.observer.getGlobal("rod-depth"));
      procedures["REACT"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["manuReact"] = temp;
  procs["MANU-REACT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["PLACE-CONTROL-RODS"]();
      world.observer.setGlobal("power", 0);
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        SelfManager.self()._optimalFdOne();
        if (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 5)) {
          SelfManager.self().die();
        }
        if (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 15)) {
          procedures["FISSION"]();
        }
      }, true);
      world.observer.setGlobal("average-power", PrimChecks.math.div(((((world.observer.getGlobal("power") + world.observer.getGlobal("old-power")) + world.observer.getGlobal("old-power-2")) + world.observer.getGlobal("old-power-3")) + world.observer.getGlobal("old-power-4")), 5));
      world.observer.setGlobal("power-change", (world.observer.getGlobal("power") - world.observer.getGlobal("old-power")));
      world.observer.setGlobal("old-power-4", world.observer.getGlobal("old-power-3"));
      world.observer.setGlobal("old-power-3", world.observer.getGlobal("old-power-2"));
      world.observer.setGlobal("old-power-2", world.observer.getGlobal("old-power"));
      world.observer.setGlobal("old-power", world.observer.getGlobal("power"));
      world.ticker.tick();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["react"] = temp;
  procs["REACT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let whom = Nobody; letVars['whom'] = whom;
      world.turtleManager.createTurtles(1, "").ask(function() {
        SelfManager.self().setVariable("color", 45);
        SelfManager.self().setVariable("xcor", (PrimChecks.math.random((world.observer.getGlobal("reactor-size") - 2)) - world.observer.getGlobal("r")));
        SelfManager.self().setVariable("ycor", (PrimChecks.math.random((world.observer.getGlobal("reactor-size") - 2)) - world.observer.getGlobal("r")));
        whom = SelfManager.self(); letVars['whom'] = whom;
        if (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 5)) {
          SelfManager.self().die();
        }
      }, true);
      if (Prims.equality(whom, Nobody)) {
        procedures["RELEASE-NEUTRON"]();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["releaseNeutron"] = temp;
  procs["RELEASE-NEUTRON"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(PrimChecks.agentset.with(world.patches(), function() { return SelfManager.self().getPatchVariable("rod?"); })).ask(function() {
        if (Prims.gte(SelfManager.self().getPatchVariable("pycor"), (world.observer.getGlobal("r") - world.observer.getGlobal("rod-length")))) {
          SelfManager.self().setPatchVariable("pcolor", 5);
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", 0);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["placeControlRods"] = temp;
  procs["PLACE-CONTROL-RODS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().right(RandomPrims.randomLong(360));
      if (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 15)) {
        if (world.observer.getGlobal("spend-fuel?")) {
          SelfManager.self().setPatchVariable("pcolor", 35);
        }
        let gain = PrimChecks.math.div(1, PrimChecks.agentset.count_unchecked(SelfManager.self().turtlesHere())); letVars['gain'] = gain;
        world.observer.setGlobal("power", (world.observer.getGlobal("power") + gain));
        SelfManager.self().hatch(((2 + RandomPrims.randomLong(2)) * gain), "").ask(function() { SelfManager.self().right(RandomPrims.randomLong(360)); }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["fission"] = temp;
  procs["FISSION"] = temp;
  return procs;
})();
world.observer.setGlobal("power-rated", 35);
world.observer.setGlobal("reactor-size", 122);
world.observer.setGlobal("rod-depth", 0);
world.observer.setGlobal("rod-spacing", 4);
world.observer.setGlobal("spend-fuel?", true);