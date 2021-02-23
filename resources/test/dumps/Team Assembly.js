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
  var name    = 'Link counts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('newcomer-newcomer', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('newcomer-incumbent', plotOps.makePenOps, false, new PenBundle.State(75, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('incumbent-incumbent', plotOps.makePenOps, false, new PenBundle.State(45, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('previous collaborators', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Link counts', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          let total = 0; letVars['total'] = total;
          plotManager.setCurrentPen("previous collaborators");
          plotManager.raisePen();
          plotManager.plotPoint(world.ticker.tickCount(), total);
          total = (total + PrimChecks.agentset.countWith(world.links(), function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); })); letVars['total'] = total;
          plotManager.lowerPen();
          plotManager.plotPoint(world.ticker.tickCount(), total);
          plotManager.setCurrentPen("incumbent-incumbent");
          plotManager.raisePen();
          plotManager.plotPoint(world.ticker.tickCount(), total);
          total = (total + PrimChecks.agentset.countWith(world.links(), function() { return Prims.equality(SelfManager.self().getVariable("color"), 45); })); letVars['total'] = total;
          plotManager.lowerPen();
          plotManager.plotPoint(world.ticker.tickCount(), total);
          plotManager.setCurrentPen("newcomer-incumbent");
          plotManager.raisePen();
          plotManager.plotPoint(world.ticker.tickCount(), total);
          total = (total + PrimChecks.agentset.countWith(world.links(), function() { return Prims.equality(SelfManager.self().getVariable("color"), 75); })); letVars['total'] = total;
          plotManager.lowerPen();
          plotManager.plotPoint(world.ticker.tickCount(), total);
          plotManager.setCurrentPen("newcomer-newcomer");
          plotManager.raisePen();
          plotManager.plotPoint(world.ticker.tickCount(), total);
          total = (total + PrimChecks.agentset.countWith(world.links(), function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); })); letVars['total'] = total;
          plotManager.lowerPen();
          plotManager.plotPoint(world.ticker.tickCount(), total);
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  };
  return new Plot(name, pens, plotOps, "time", "cumulative count", false, true, 0, 300, 0, 10, setup, update);
})(), (function() {
  var name    = '% of agents in the giant component';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('% of agents in the giant component', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.math.div(world.observer.getGlobal("giant-component-size"), PrimChecks.agentset.count_unchecked(world.turtles())));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "% of all agents", false, true, 0, 10, 0, 1, setup, update);
})(), (function() {
  var name    = 'Average component size';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Average component size', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.list.mean(world.observer.getGlobal("components")));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Number of agents", false, true, 0, 10, 0, 1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["incumbent?", "in-team?", "downtime", "explored?"], ["new-collaboration?"])('globals [   newcomer              ;; an agent who has never collaborated   component-size        ;; current running size of component being explored   giant-component-size  ;; size of largest connected component   components            ;; list of connected components ]  turtles-own [   incumbent?   ;; true if an agent has collaborated before   in-team?     ;; true if an agent belongs to the new team being constructed   downtime     ;; the number of time steps passed since the agent last collaborated   explored?    ;; used to compute connected components in the graph ]  links-own [   new-collaboration?  ;; true if the link represents the first time two agents collaborated ]   ;;;;;;;;;;;;;;;;;;;;;;;; ;;; Setup Procedures ;;; ;;;;;;;;;;;;;;;;;;;;;;;;  to make-newcomer   create-turtles 1   [     set color blue + 1     set size 1.8     set incumbent? false     set in-team? false     set newcomer self     set downtime 0     set explored? false   ] end   to setup   clear-all   set-default-shape turtles \"circle\"    ;; assemble the first team   repeat team-size [ make-newcomer ]   ask turtles   [     set in-team? true     set incumbent? true   ]   tie-collaborators   color-collaborations    ask turtles  ;; arrange turtles in a regular polygon   [     set heading (360 / team-size) * who     fd 1.75     set in-team? false   ]   find-all-components   reset-ticks end   ;;;;;;;;;;;;;;;;;;;;;;; ;;; Main Procedures ;;; ;;;;;;;;;;;;;;;;;;;;;;;  to go   ;; all existing turtles are now considered incumbents   ask turtles [set incumbent? true set color gray - 1.5 set size 0.9]   ask links [set new-collaboration? false]    ;; assemble a new team   pick-team-members   tie-collaborators   color-collaborations    ;; age turtles   ask turtles   [     ;; agents drop out of the collaboration network when they become inactive for max-downtime steps     if downtime > max-downtime       [die]      set in-team? false     set downtime downtime + 1   ]    if layout? [ layout ]   find-all-components   tick end   ;; choose turtles to be in a new team to pick-team-members   let new-team-member nobody   repeat team-size   [     ifelse random-float 100 >= p  ;;with a probability P, make a newcomer     [       make-newcomer       set new-team-member newcomer     ]     [       ;; with a probability Q, choose a new team member who was a previous collaborator of an existing team member       ;; if the current team has at least one previous collaborator.       ;; otherwise collaborate with a previous incumbent       ifelse random-float 100 < q and any? (turtles with [in-team? and (any? link-neighbors with [not in-team?])])         [set new-team-member one-of turtles with [not in-team? and (any? link-neighbors with [in-team?])]]         [set new-team-member one-of turtles with [not in-team?]]     ]     ask new-team-member  ;; specify turtle to become a new team member     [       set in-team? true       set downtime 0       set size 1.8       set color ifelse-value incumbent? [yellow + 2] [blue + 1]     ]   ] end   ;; forms a link between all unconnected turtles with in-team? = true to tie-collaborators   ask turtles with [in-team?]   [     create-links-with other turtles with [in-team?]     [       set new-collaboration? true  ;; specifies newly-formed collaboration between two members       set thickness 0.3     ]   ] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;; Visualization Procedures ;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;; color links according to past experience to color-collaborations     ask links with [[in-team?] of end1 and [in-team?] of end2]     [       ifelse new-collaboration?       [         ifelse ([incumbent?] of end1) and ([incumbent?] of end2)         [           set color yellow       ;; both members are incumbents         ]         [           ifelse ([incumbent?] of end1) or ([incumbent?] of end2)             [ set color turquoise ]  ;; one member is an incumbent             [ set color blue ]   ;; both members are newcomers         ]       ]       [         set color red            ;; members are previous collaborators       ]     ] end  ;; perform spring layout on all turtles and links to layout   repeat 12 [     layout-spring turtles links 0.18 0.01 1.2     display   ] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;; Network Exploration ;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;; to find all the connected components in the network, their sizes and starting turtles to find-all-components   set components []   set giant-component-size 0    ask turtles [ set explored? false ]   ;; keep exploring till all turtles get explored   loop   [     ;; pick a turtle that has not yet been explored     let start one-of turtles with [ not explored? ]     if start = nobody [ stop ]     ;; reset the number of turtles found to 0     ;; this variable is updated each time we explore an     ;; unexplored turtle.     set component-size 0     ask start [ explore ]     ;; the explore procedure updates the component-size variable.     ;; so check, have we found a new giant component?     if component-size > giant-component-size     [       set giant-component-size component-size     ]     set components lput component-size components   ] end  ;; finds all turtles reachable from this turtle to explore ;; turtle procedure   if explored? [ stop ]   set explored? true   set component-size component-size + 1   ask link-neighbors [ explore ] end   ; Copyright 2007 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":347,"top":10,"right":759,"bottom":423,"dimensions":{"minPxcor":-50,"maxPxcor":50,"minPycor":-50,"maxPycor":50,"patchSize":4,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":9,"top":20,"right":114,"bottom":53,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":119,"top":20,"right":224,"bottom":53,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }   for (let _index_36_42 = 0, _repeatcount_36_42 = StrictMath.floor(3); _index_36_42 < _repeatcount_36_42; _index_36_42++){     procedures[\"LAYOUT\"]();   } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go repeat 3 [layout]","left":227,"top":20,"right":332,"bottom":53,"display":"go once","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"layout?","left":9,"top":65,"right":171,"bottom":98,"display":"layout?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_39 = procedures[\"LAYOUT\"]();   if (_maybestop_33_39 instanceof Exception.StopInterrupt) { return _maybestop_33_39; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"layout","left":175,"top":65,"right":335,"bottom":98,"display":"redo layout","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"p","left":10,"top":177,"right":269,"bottom":210,"display":"p","min":"0","max":"100","default":40,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"q","left":10,"top":236,"right":267,"bottom":269,"display":"q","min":"0","max":"100","default":65,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"3","compiledMax":"8","compiledStep":"1","variable":"team-size","left":230,"top":110,"right":332,"bottom":143,"display":"team-size","min":"3","max":"8","default":4,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"display":"probability of choosing an incumbent","left":14,"top":158,"right":323,"bottom":177,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"probability of choosing a previous collaborator","left":11,"top":218,"right":314,"bottom":236,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Link counts', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         let total = 0; letVars['total'] = total;         plotManager.setCurrentPen(\"previous collaborators\");         plotManager.raisePen();         plotManager.plotPoint(world.ticker.tickCount(), total);         total = (total + PrimChecks.agentset.countWith(world.links(), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 15); })); letVars['total'] = total;         plotManager.lowerPen();         plotManager.plotPoint(world.ticker.tickCount(), total);         plotManager.setCurrentPen(\"incumbent-incumbent\");         plotManager.raisePen();         plotManager.plotPoint(world.ticker.tickCount(), total);         total = (total + PrimChecks.agentset.countWith(world.links(), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 45); })); letVars['total'] = total;         plotManager.lowerPen();         plotManager.plotPoint(world.ticker.tickCount(), total);         plotManager.setCurrentPen(\"newcomer-incumbent\");         plotManager.raisePen();         plotManager.plotPoint(world.ticker.tickCount(), total);         total = (total + PrimChecks.agentset.countWith(world.links(), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 75); })); letVars['total'] = total;         plotManager.lowerPen();         plotManager.plotPoint(world.ticker.tickCount(), total);         plotManager.setCurrentPen(\"newcomer-newcomer\");         plotManager.raisePen();         plotManager.plotPoint(world.ticker.tickCount(), total);         total = (total + PrimChecks.agentset.countWith(world.links(), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 105); })); letVars['total'] = total;         plotManager.lowerPen();         plotManager.plotPoint(world.ticker.tickCount(), total);       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"newcomer-newcomer","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"newcomer-incumbent","interval":1,"mode":0,"color":-14835848,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"incumbent-incumbent","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"previous collaborators","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Link counts","left":12,"top":277,"right":334,"bottom":466,"xAxis":"time","yAxis":"cumulative count","xmin":0,"xmax":300,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":";; plot stacked histogram of link types let total 0 set-current-plot-pen \"previous collaborators\" plot-pen-up plotxy ticks total set total total + count links with [color = red] plot-pen-down plotxy ticks total set-current-plot-pen \"incumbent-incumbent\" plot-pen-up plotxy ticks total set total total + count links with [color = yellow] plot-pen-down plotxy ticks total set-current-plot-pen \"newcomer-incumbent\" plot-pen-up plotxy ticks total set total total + count links with [color = turquoise] plot-pen-down plotxy ticks total set-current-plot-pen \"newcomer-newcomer\" plot-pen-up plotxy ticks total set total total + count links with [color = blue] plot-pen-down plotxy ticks total","pens":[{"display":"newcomer-newcomer","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"newcomer-incumbent","interval":1,"mode":0,"color":-14835848,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"incumbent-incumbent","interval":1,"mode":0,"color":-1184463,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"previous collaborators","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"7","compiledMax":"100","compiledStep":"1","variable":"max-downtime","left":8,"top":110,"right":220,"bottom":143,"display":"max-downtime","min":"7","max":"100","default":40,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('% of agents in the giant component', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.math.div(world.observer.getGlobal(\"giant-component-size\"), PrimChecks.agentset.count_unchecked(world.turtles())));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (giant-component-size / (count turtles))","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"% of agents in the giant component","left":795,"top":35,"right":1060,"bottom":234,"xAxis":"Time","yAxis":"% of all agents","xmin":0,"xmax":10,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (giant-component-size / (count turtles))","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Average component size', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), PrimChecks.list.mean(world.observer.getGlobal(\"components\")));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (mean components)","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Average component size","left":795,"top":257,"right":1060,"bottom":456,"xAxis":"Time","yAxis":"Number of agents","xmin":0,"xmax":10,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks (mean components)","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["layout?", "p", "q", "team-size", "max-downtime", "newcomer", "component-size", "giant-component-size", "components"], ["layout?", "p", "q", "team-size", "max-downtime"], [], -50, 50, -50, 50, 4, true, true, turtleShapes, linkShapes, function(){});
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
      world.turtleManager.createTurtles(1, "").ask(function() {
        SelfManager.self().setVariable("color", (105 + 1));
        SelfManager.self().setVariable("size", 1.8);
        SelfManager.self().setVariable("incumbent?", false);
        SelfManager.self().setVariable("in-team?", false);
        world.observer.setGlobal("newcomer", SelfManager.self());
        SelfManager.self().setVariable("downtime", 0);
        SelfManager.self().setVariable("explored?", false);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeNewcomer"] = temp;
  procs["MAKE-NEWCOMER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      BreedManager.setDefaultShape(world.turtles().getSpecialName(), "circle")
      for (let _index_1053_1059 = 0, _repeatcount_1053_1059 = StrictMath.floor(world.observer.getGlobal("team-size")); _index_1053_1059 < _repeatcount_1053_1059; _index_1053_1059++){
        procedures["MAKE-NEWCOMER"]();
      }
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        SelfManager.self().setVariable("in-team?", true);
        SelfManager.self().setVariable("incumbent?", true);
      }, true);
      procedures["TIE-COLLABORATORS"]();
      procedures["COLOR-COLLABORATIONS"]();
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        SelfManager.self().setVariable("heading", (PrimChecks.math.div(360, world.observer.getGlobal("team-size")) * SelfManager.self().getVariable("who")));
        SelfManager.self().fd(1.75);
        SelfManager.self().setVariable("in-team?", false);
      }, true);
      procedures["FIND-ALL-COMPONENTS"]();
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
        SelfManager.self().setVariable("incumbent?", true);
        SelfManager.self().setVariable("color", (5 - 1.5));
        SelfManager.self().setVariable("size", 0.9);
      }, true);
      Errors.askNobodyCheck(world.links()).ask(function() { SelfManager.self().setVariable("new-collaboration?", false); }, true);
      procedures["PICK-TEAM-MEMBERS"]();
      procedures["TIE-COLLABORATORS"]();
      procedures["COLOR-COLLABORATIONS"]();
      Errors.askNobodyCheck(world.turtles()).ask(function() {
        if (Prims.gt(SelfManager.self().getVariable("downtime"), world.observer.getGlobal("max-downtime"))) {
          SelfManager.self().die();
        }
        SelfManager.self().setVariable("in-team?", false);
        SelfManager.self().setVariable("downtime", (SelfManager.self().getVariable("downtime") + 1));
      }, true);
      if (world.observer.getGlobal("layout?")) {
        procedures["LAYOUT"]();
      }
      procedures["FIND-ALL-COMPONENTS"]();
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
      let newTeamMember = Nobody; letVars['newTeamMember'] = newTeamMember;
      for (let _index_2105_2111 = 0, _repeatcount_2105_2111 = StrictMath.floor(world.observer.getGlobal("team-size")); _index_2105_2111 < _repeatcount_2105_2111; _index_2105_2111++){
        if (Prims.gte(PrimChecks.math.randomFloat(100), world.observer.getGlobal("p"))) {
          procedures["MAKE-NEWCOMER"]();
          newTeamMember = world.observer.getGlobal("newcomer"); letVars['newTeamMember'] = newTeamMember;
        }
        else {
          if ((Prims.lt(PrimChecks.math.randomFloat(100), world.observer.getGlobal("q")) && PrimChecks.agentset.anyWith(world.turtles(), function() {
            return (SelfManager.self().getVariable("in-team?") && PrimChecks.agentset.any_unchecked(PrimChecks.agentset.with_unchecked(LinkPrims.linkNeighbors("LINKS"), function() { return !SelfManager.self().getVariable("in-team?"); })));
          }))) {
            newTeamMember = PrimChecks.agentset.oneOfWith(world.turtles(), function() {
              return (!SelfManager.self().getVariable("in-team?") && PrimChecks.agentset.anyWith(LinkPrims.linkNeighbors("LINKS"), function() { return SelfManager.self().getVariable("in-team?"); }));
            }); letVars['newTeamMember'] = newTeamMember;
          }
          else {
            newTeamMember = PrimChecks.agentset.oneOfWith(world.turtles(), function() { return !SelfManager.self().getVariable("in-team?"); }); letVars['newTeamMember'] = newTeamMember;
          }
        }
        Errors.askNobodyCheck(newTeamMember).ask(function() {
          SelfManager.self().setVariable("in-team?", true);
          SelfManager.self().setVariable("downtime", 0);
          SelfManager.self().setVariable("size", 1.8);
          SelfManager.self().setVariable("color", (Prims.ifElseValueBooleanCheck(SelfManager.self().getVariable("incumbent?")) ? (45 + 2) : (105 + 1)));
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["pickTeamMembers"] = temp;
  procs["PICK-TEAM-MEMBERS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(PrimChecks.agentset.with(world.turtles(), function() { return SelfManager.self().getVariable("in-team?"); })).ask(function() {
        LinkPrims.createLinksWith(PrimChecks.agentset.otherWith(world.turtles(), function() { return SelfManager.self().getVariable("in-team?"); }), "LINKS").ask(function() {
          SelfManager.self().setVariable("new-collaboration?", true);
          SelfManager.self().setVariable("thickness", 0.3);
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["tieCollaborators"] = temp;
  procs["TIE-COLLABORATORS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.links(), function() {
        return (PrimChecks.agentset.of(SelfManager.self().getVariable("end1"), function() { return SelfManager.self().getVariable("in-team?"); }) && PrimChecks.agentset.of(SelfManager.self().getVariable("end2"), function() { return SelfManager.self().getVariable("in-team?"); }));
      })).ask(function() {
        if (SelfManager.self().getVariable("new-collaboration?")) {
          if ((PrimChecks.agentset.of(SelfManager.self().getVariable("end1"), function() { return SelfManager.self().getVariable("incumbent?"); }) && PrimChecks.agentset.of(SelfManager.self().getVariable("end2"), function() { return SelfManager.self().getVariable("incumbent?"); }))) {
            SelfManager.self().setVariable("color", 45);
          }
          else {
            if ((PrimChecks.agentset.of(SelfManager.self().getVariable("end1"), function() { return SelfManager.self().getVariable("incumbent?"); }) || PrimChecks.agentset.of(SelfManager.self().getVariable("end2"), function() { return SelfManager.self().getVariable("incumbent?"); }))) {
              SelfManager.self().setVariable("color", 75);
            }
            else {
              SelfManager.self().setVariable("color", 105);
            }
          }
        }
        else {
          SelfManager.self().setVariable("color", 15);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["colorCollaborations"] = temp;
  procs["COLOR-COLLABORATIONS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      for (let _index_4159_4165 = 0, _repeatcount_4159_4165 = StrictMath.floor(12); _index_4159_4165 < _repeatcount_4159_4165; _index_4159_4165++){
        LayoutManager.layoutSpring(world.turtles(), world.links(), 0.18, 0.01, 1.2);
        notImplemented('display', undefined)();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["layout"] = temp;
  procs["LAYOUT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("components", []);
      world.observer.setGlobal("giant-component-size", 0);
      Errors.askNobodyCheck(world.turtles()).ask(function() { SelfManager.self().setVariable("explored?", false); }, true);
      while (true) {
        let start = PrimChecks.agentset.oneOfWith(world.turtles(), function() { return !SelfManager.self().getVariable("explored?"); }); letVars['start'] = start;
        if (Prims.equality(start, Nobody)) {
          throw new Exception.StopInterrupt;
        }
        world.observer.setGlobal("component-size", 0);
        Errors.askNobodyCheck(start).ask(function() { procedures["EXPLORE"](); }, true);
        if (Prims.gt(world.observer.getGlobal("component-size"), world.observer.getGlobal("giant-component-size"))) {
          world.observer.setGlobal("giant-component-size", world.observer.getGlobal("component-size"));
        }
        world.observer.setGlobal("components", PrimChecks.list.lput(world.observer.getGlobal("component-size"), world.observer.getGlobal("components")));
      };
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["findAllComponents"] = temp;
  procs["FIND-ALL-COMPONENTS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (SelfManager.self().getVariable("explored?")) {
        throw new Exception.StopInterrupt;
      }
      SelfManager.self().setVariable("explored?", true);
      world.observer.setGlobal("component-size", (world.observer.getGlobal("component-size") + 1));
      Errors.askNobodyCheck(LinkPrims.linkNeighbors("LINKS")).ask(function() { procedures["EXPLORE"](); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["explore"] = temp;
  procs["EXPLORE"] = temp;
  return procs;
})();
world.observer.setGlobal("layout?", true);
world.observer.setGlobal("p", 40);
world.observer.setGlobal("q", 65);
world.observer.setGlobal("team-size", 4);
world.observer.setGlobal("max-downtime", 40);