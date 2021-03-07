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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":1,"y":1,"diam":298,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"vector":{"name":"vector","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":15,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[120,150,180,120],"ycors":[30,0,30,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Speed Counts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Counts', 'fast')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("percent-fast"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Counts', 'medium')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("percent-medium"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Counts', 'slow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("percent-slow"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Counts', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, 100);
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Speed Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(PrimChecks.agentset.of(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }), function() { return SelfManager.self().getVariable("speed"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(PrimChecks.agentset.of(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }), function() { return SelfManager.self().getVariable("speed"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(PrimChecks.agentset.of(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }), function() { return SelfManager.self().getVariable("speed"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('avg-speed', plotOps.makePenOps, false, new PenBundle.State(5, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', 'avg-speed')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.resetPen();
          let _maybestop_50_64 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("avg-speed"));
          if (_maybestop_50_64 instanceof Exception.StopInterrupt) { return _maybestop_50_64; }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('init-avg-speed', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Speed Histogram', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setXRange(0, PrimChecks.math.ceil(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, procedures["INIT-PARTICLE-SPEED"]()), 2)));
          plotManager.setYRange(0, PrimChecks.math.ceil(PrimChecks.math.div(PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("PARTICLES")), 6)));
          plotManager.setCurrentPen("medium");
          plotManager.setHistogramBarCount(40);
          plotManager.setCurrentPen("slow");
          plotManager.setHistogramBarCount(40);
          plotManager.setCurrentPen("fast");
          plotManager.setHistogramBarCount(40);
          plotManager.setCurrentPen("init-avg-speed");
          let _maybestop_337_351 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("init-avg-speed"));
          if (_maybestop_337_351 instanceof Exception.StopInterrupt) { return _maybestop_337_351; }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Energy Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('particles', plotOps.makePenOps, false, new PenBundle.State(3, 1, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Energy Histogram', 'particles')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return SelfManager.self().getVariable("energy"); }));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('avg-energy', plotOps.makePenOps, false, new PenBundle.State(5, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Energy Histogram', 'avg-energy')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.resetPen();
          let _maybestop_50_64 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("avg-energy"));
          if (_maybestop_50_64 instanceof Exception.StopInterrupt) { return _maybestop_50_64; }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('init-avg-energy', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Energy Histogram', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setXRange(0, PrimChecks.math.ceil(PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.math.mult(0.5, PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, procedures["INIT-PARTICLE-SPEED"]()), 2)), PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, procedures["INIT-PARTICLE-SPEED"]()), 2)), PrimChecks.validator.checkArg('*', 1, procedures["MAX-PARTICLE-MASS"]()))));
          plotManager.setYRange(0, PrimChecks.math.ceil(PrimChecks.math.div(PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("PARTICLES")), 6)));
          plotManager.setCurrentPen("particles");
          plotManager.setHistogramBarCount(40);
          plotManager.setCurrentPen("init-avg-energy");
          let _maybestop_290_304 = procedures["DRAW-VERT-LINE"](world.observer.getGlobal("init-avg-energy"));
          if (_maybestop_290_304 instanceof Exception.StopInterrupt) { return _maybestop_290_304; }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 200, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "particles", singular: "particle", varNames: ["speed", "mass", "energy"] }])([], [])('globals [   tick-delta        ;; how much simulation time will pass in this step   box-edge          ;; distance of box edge from origin   collisions        ;; list used to keep track of future collisions   particle1         ;; first particle currently colliding   particle2         ;; second particle currently colliding   init-avg-speed init-avg-energy             ;; initial averages   avg-speed avg-energy                       ;; current averages   fast medium slow                           ;; current counts   percent-slow percent-medium percent-fast   ;; percentage of current counts ]  breed [particles particle]  particles-own [   speed   mass   energy ]    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;; setup procedures ;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to setup   clear-all   set-default-shape particles \"circle\"   set box-edge max-pxcor - 1   ask patches with [(abs pxcor = box-edge or abs pycor = box-edge) and                     abs pxcor <= box-edge and abs pycor <= box-edge]     [ set pcolor yellow ]   set avg-speed 1   make-particles   set particle1 nobody   set particle2 nobody   reset-ticks   set collisions []   ask particles [ check-for-wall-collision ]   ask particles [ check-for-particle-collision ]   update-variables   set init-avg-speed avg-speed   set init-avg-energy avg-energy end  to make-particles   create-particles initial-number-particles [     set speed 1      set size smallest-particle-size              + random-float (largest-particle-size - smallest-particle-size)     ;; set the mass proportional to the area of the particle     set mass (size * size)     set energy kinetic-energy      recolor   ]   ;; When space is tight, placing the big particles first improves   ;; our chances of eventually finding places for all of them.   foreach sort-by [ [a b] -> [ size ] of a > [ size ] of b ] particles [ the-particle ->     ask the-particle [       position-randomly       while [ overlapping? ] [ position-randomly ]     ]   ] end  to-report overlapping?  ;; particle procedure   ;; here, we use IN-RADIUS just for improved speed; the real testing   ;; is done by DISTANCE   report any? other particles in-radius ((size + largest-particle-size) / 2)                               with [distance myself < (size + [size] of myself) / 2] end  to position-randomly  ;; particle procedure   ;; place particle at random location inside the box   setxy one-of [1 -1] * random-float (box-edge - 0.5 - size / 2)         one-of [1 -1] * random-float (box-edge - 0.5 - size / 2) end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;; go procedures  ;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to go   choose-next-collision   ask particles [ jump speed * tick-delta ]   perform-next-collision   tick-advance tick-delta   recalculate-particles-that-just-collided   if floor ticks > floor (ticks - tick-delta)   [     update-variables     update-plots   ] end  to update-variables   set medium count particles with [color = green]   set slow   count particles with [color = blue]   set fast   count particles with [color = red]   set percent-medium (medium / ( count particles )) * 100   set percent-slow (slow / (count particles)) * 100   set percent-fast (fast / (count particles)) * 100   set avg-speed  mean [speed] of particles   set avg-energy mean [energy] of particles end   to recalculate-particles-that-just-collided   ;; Since only collisions involving the particles that collided most recently could be affected,   ;; we filter those out of collisions.  Then we recalculate all possible collisions for   ;; the particles that collided last.  The ifelse statement is necessary because   ;; particle2 can be either a particle or a string representing a wall.  If it is a   ;; wall, we don\'t want to invalidate all collisions involving that wall (because the wall\'s   ;; position wasn\'t affected, those collisions are still valid.   ifelse is-turtle? particle2     [       set collisions filter [ the-collision ->         item 1 the-collision != particle1 and         item 2 the-collision != particle1 and         item 1 the-collision != particle2 and         item 2 the-collision != particle2       ] collisions       ask particle2 [ check-for-wall-collision ]       ask particle2 [ check-for-particle-collision ]     ]     [       set collisions filter [ the-collision ->         item 1 the-collision != particle1 and         item 2 the-collision != particle1       ] collisions     ]   if particle1 != nobody [ ask particle1 [ check-for-wall-collision ] ]   if particle1 != nobody [ ask particle1 [ check-for-particle-collision ] ]   ;; Slight errors in floating point math can cause a collision that just   ;; happened to be calculated as happening again a very tiny amount of   ;; time into the future, so we remove any collisions that involves   ;; the same two particles (or particle and wall) as last time.   set collisions filter [ the-collision ->     item 1 the-collision != particle1 or     item 2 the-collision != particle2   ] collisions   ;; All done.   set particle1 nobody   set particle2 nobody end  ;; check-for-particle-collision is a particle procedure that determines the time it takes ;; to the collision between two particles (if one exists).  It solves for the time by representing ;; the equations of motion for distance, velocity, and time in a quadratic equation of the vector ;; components of the relative velocities and changes in position between the two particles and ;; solves for the time until the next collision to check-for-particle-collision   let my-x xcor   let my-y ycor   let my-particle-size size   let my-x-speed speed * dx   let my-y-speed speed * dy   ask other particles   [     let dpx (xcor - my-x)   ;; relative distance between particles in the x direction     let dpy (ycor - my-y)    ;; relative distance between particles in the y direction     let x-speed (speed * dx) ;; speed of other particle in the x direction     let y-speed (speed * dy) ;; speed of other particle in the x direction     let dvx (x-speed - my-x-speed) ;; relative speed difference between particles in x direction     let dvy (y-speed - my-y-speed) ;; relative speed difference between particles in y direction     let sum-r (((my-particle-size) / 2 ) + (([size] of self) / 2 )) ;; sum of both particle radii      ;; To figure out what the difference in position (P1) between two particles at a future     ;; time (t) will be, one would need to know the current difference in position (P0) between the     ;; two particles and the current difference in the velocity (V0) between the two particles.     ;;     ;; The equation that represents the relationship is:     ;;   P1 = P0 + t * V0     ;; we want find when in time (t), P1 would be equal to the sum of both the particle\'s radii     ;; (sum-r).  When P1 is equal to is equal to sum-r, the particles will just be touching each     ;; other at their edges (a single point of contact).     ;;     ;; Therefore we are looking for when:   sum-r =  P0 + t * V0     ;;     ;; This equation is not a simple linear equation, since P0 and V0 should both have x and y     ;; components in their two dimensional vector representation (calculated as dpx, dpy, and     ;; dvx, dvy).     ;;     ;; By squaring both sides of the equation, we get:     ;;   (sum-r) * (sum-r) =  (P0 + t * V0) * (P0 + t * V0)     ;; When expanded gives:     ;;   (sum-r ^ 2) = (P0 ^ 2) + (t * PO * V0) + (t * PO * V0) + (t ^ 2 * VO ^ 2)     ;; Which can be simplified to:     ;;   0 = (P0 ^ 2) - (sum-r ^ 2) + (2 * PO * V0) * t + (VO ^ 2) * t ^ 2     ;; Below, we will let p-squared represent:   (P0 ^ 2) - (sum-r ^ 2)     ;; and pv represent: (2 * PO * V0)     ;; and v-squared represent: (VO ^ 2)     ;;     ;;  then the equation will simplify to:     0 = p-squared + pv * t + v-squared * t^2      let p-squared   ((dpx * dpx) + (dpy * dpy)) - (sum-r ^ 2)   ;; p-squared represents difference     ;; of the square of the radii and the square of the initial positions      let pv  (2 * ((dpx * dvx) + (dpy * dvy)))  ;; vector product of the position times the velocity     let v-squared  ((dvx * dvx) + (dvy * dvy)) ;; the square of the difference in speeds     ;; represented as the sum of the squares of the x-component     ;; and y-component of relative speeds between the two particles      ;; p-squared, pv, and v-squared are coefficients in the quadratic equation shown above that     ;; represents how distance between the particles and relative velocity are related to the time,     ;; t, at which they will next collide (or when their edges will just be touching)      ;; Any quadratic equation that is a function of time (t) can be represented as:     ;;   a*t*t + b*t + c = 0,     ;; where a, b, and c are the coefficients of the three different terms, and has solutions for t     ;; that can be found by using the quadratic formula.  The quadratic formula states that if a is     ;; not 0, then there are two solutions for t, either real or complex.     ;; t is equal to (b +/- sqrt (b^2 - 4*a*c)) / 2*a     ;; the portion of this equation that is under a square root is referred to here     ;; as the determinant, d1.   d1 is equal to (b^2 - 4*a*c)     ;; and:   a = v-squared, b = pv, and c = p-squared.     let d1 pv ^ 2 -  (4 * v-squared * p-squared)      ;; the next test tells us that a collision will happen in the future if     ;; the determinant, d1 is > 0,  since a positive determinant tells us that there is a     ;; real solution for the quadratic equation.  Quadratic equations can have solutions     ;; that are not real (they are square roots of negative numbers).  These are referred     ;; to as imaginary numbers and for many real world systems that the equations represent     ;; are not real world states the system can actually end up in.      ;; Once we determine that a real solution exists, we want to take only one of the two     ;; possible solutions to the quadratic equation, namely the smaller of the two the solutions:     ;;  (b - sqrt (b^2 - 4*a*c)) / 2*a     ;;  which is a solution that represents when the particles first touching on their edges.     ;;  instead of (b + sqrt (b^2 - 4*a*c)) / 2*a     ;;  which is a solution that represents a time after the particles have penetrated     ;;  and are coming back out of each other and when they are just touching on their edges.      let time-to-collision  -1      if d1 > 0       [ set time-to-collision (- pv - sqrt d1) / (2 * v-squared) ]        ;; solution for time step      ;; if time-to-collision is still -1 there is no collision in the future - no valid solution     ;; note:  negative values for time-to-collision represent where particles would collide     ;; if allowed to move backward in time.     ;; if time-to-collision is greater than 1, then we continue to advance the motion     ;; of the particles along their current trajectories.  They do not collide yet.      if time-to-collision > 0     [       ;; time-to-collision is relative (ie, a collision will occur one second from now)       ;; We need to store the absolute time (ie, a collision will occur at time 48.5 seconds.       ;; So, we add clock to time-to-collision when we store it.       ;; The entry we add is a three element list of the time to collision and the colliding pair.       set collisions fput (list (time-to-collision + ticks) self myself)                           collisions     ]   ] end   ;; determines when a particle will hit any of the four walls to check-for-wall-collision  ;; particle procedure   ;; right & left walls   let x-speed (speed * dx)   if x-speed != 0     [ ;; solve for how long it will take particle to reach right wall       let right-interval (box-edge - 0.5 - xcor - size / 2) / x-speed       if right-interval > 0         [ assign-colliding-wall right-interval \"right wall\" ]       ;; solve for time it will take particle to reach left wall       let left-interval ((- box-edge) + 0.5 - xcor + size / 2) / x-speed       if left-interval > 0         [ assign-colliding-wall left-interval \"left wall\" ] ]   ;; top & bottom walls   let y-speed (speed * dy)   if y-speed != 0     [ ;; solve for time it will take particle to reach top wall       let top-interval (box-edge - 0.5 - ycor - size / 2) / y-speed       if top-interval > 0         [ assign-colliding-wall top-interval \"top wall\" ]       ;; solve for time it will take particle to reach bottom wall       let bottom-interval ((- box-edge) + 0.5 - ycor + size / 2) / y-speed       if bottom-interval > 0         [ assign-colliding-wall bottom-interval \"bottom wall\" ] ] end   to assign-colliding-wall [time-to-collision wall]  ;; particle procedure   ;; this procedure is used by the check-for-wall-collision procedure   ;; to assemble the correct particle-wall pair   ;; time-to-collision is relative (ie, a collision will occur one second from now)   ;; We need to store the absolute time (ie, a collision will occur at time 48.5 seconds.   ;; So, we add clock to time-to-collision when we store it.   let colliding-pair (list (time-to-collision + ticks) self wall)   set collisions fput colliding-pair collisions end  to choose-next-collision   if collisions = [] [ stop ]   ;; Sort the list of projected collisions between all the particles into an ordered list.   ;; Take the smallest time-step from the list (which represents the next collision that will   ;; happen in time).  Use this time step as the tick-delta for all the particles to move through   let winner first collisions   foreach collisions [ the-collision ->     if first the-collision < first winner [ set winner the-collision ]   ]   ;; winner is now the collision that will occur next   let dt item 0 winner   ;; If the next collision is more than 1 in the future,   ;; only advance the simulation one tick, for smoother animation.   set tick-delta dt - ticks   if tick-delta > 1     [ set tick-delta 1       set particle1 nobody       set particle2 nobody       stop ]   set particle1 item 1 winner   set particle2 item 2 winner end   to perform-next-collision   ;; deal with 3 possible cases:   ;; 1) no collision at all   if particle1 = nobody [ stop ]   ;; 2) particle meets wall   if is-string? particle2     [ if particle2 = \"left wall\" or particle2 = \"right wall\"         [ ask particle1 [ set heading (- heading) ]           stop ]       if particle2 = \"top wall\" or particle2 = \"bottom wall\"         [ ask particle1 [ set heading 180 - heading ]           stop ] ]   ;; 3) particle meets particle   ask particle1 [ collide-with particle2 ] end   to collide-with [other-particle]  ;; particle procedure   ;;; PHASE 1: initial setup   ;; for convenience, grab some quantities from other-particle   let mass2 [mass] of other-particle   let speed2 [speed] of other-particle   let heading2 [heading] of other-particle   ;; modified so that theta is heading toward other particle   let theta towards other-particle    ;;; PHASE 2: convert velocities to theta-based vector representation   ;; now convert my velocity from speed/heading representation to components   ;; along theta and perpendicular to theta   let v1t (speed * cos (theta - heading))   let v1l (speed * sin (theta - heading))   ;; do the same for other-particle   let v2t (speed2 * cos (theta - heading2))   let v2l (speed2 * sin (theta - heading2))    ;;; PHASE 3: manipulate vectors to implement collision   ;; compute the velocity of the system\'s center of mass along theta   let vcm (((mass * v1t) + (mass2 * v2t)) / (mass + mass2) )   ;; now compute the new velocity for each particle along direction theta.   ;; velocity perpendicular to theta is unaffected by a collision along theta,   ;; so the next two lines actually implement the collision itself, in the   ;; sense that the effects of the collision are exactly the following changes   ;; in particle velocity.   set v1t (2 * vcm - v1t)   set v2t (2 * vcm - v2t)    ;;; PHASE 4: convert back to normal speed/heading   ;; now convert my velocity vector into my new speed and heading   set speed sqrt ((v1t * v1t) + (v1l * v1l))   ;; if the magnitude of the velocity vector is 0, atan is undefined. but   ;; speed will be 0, so heading is irrelevant anyway. therefore, in that   ;; case we\'ll just leave it unmodified.   set energy kinetic-energy    if v1l != 0 or v1t != 0     [ set heading (theta - (atan v1l v1t)) ]   ;; and do the same for other-particle   ask other-particle [     set speed sqrt ((v2t ^ 2) + (v2l ^ 2))     set energy kinetic-energy      if v2l != 0 or v2t != 0       [ set heading (theta - (atan v2l v2t)) ]   ]    ;; PHASE 5: recolor   ;; since color is based on quantities that may have changed   recolor   ask other-particle [ recolor ] end    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;; particle coloring procedures ;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to recolor ;; particle procedure   ;;let avg-speed 1   ;; avg-speed is assumed to be 0.5, since particles are assigned a random speed between 0 and 1   ;; particle coloring procedures for visualizing speed with a color palette,   ;; red are fast particles, blue slow, and green in between.   ifelse speed < (0.5 * avg-speed) ;; at lower than 50% the average speed     [ set color blue ]      ;; slow particles colored blue     [ ifelse speed > (1.5 * avg-speed) ;; above 50% higher the average speed         [ set color red ]        ;; fast particles colored red         [ set color green ] ]    ;; medium speed particles colored green end    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;; time reversal procedure  ;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;; Here\'s a procedure that demonstrates time-reversing the model. ;; You can run it from the command center.  When it finishes, ;; the final particle positions may be slightly different because ;; the amount of time that passes after the reversal might not ;; be exactly the same as the amount that passed before; this ;; doesn\'t indicate a bug in the model. ;; For larger values of n, you will start to notice larger ;; discrepancies, eventually causing the behavior of the system ;; to diverge totally. Unless the model has some bug we don\'t know ;; about, this is due to accumulating tiny inaccuracies in the ;; floating point calculations.  Once these inaccuracies accumulate ;; to the point that a collision is missed or an extra collision ;; happens, after that the reversed model will diverge rapidly. to test-time-reversal [n]   setup   ask particles [ stamp ]   while [ticks < n] [ go ]   let old-ticks ticks   reverse-time   while [ticks < 2 * old-ticks] [ go ]   ask particles [ set color white ] end  to reverse-time   ask particles [ rt 180 ]   set collisions []   ask particles [ check-for-wall-collision ]   ask particles [ check-for-particle-collision ]   ;; the last collision that happened before the model was paused   ;; (if the model was paused immediately after a collision)   ;; won\'t happen again after time is reversed because of the   ;; \"don\'t do the same collision twice in a row\" rule.  We could   ;; try to fool that rule by setting particle1 and   ;; particle2 to nobody, but that might not always work,   ;; because the vagaries of floating point math means that the   ;; collision might be calculated to be slightly in the past   ;; (the past that used to be the future!) and be skipped.   ;; So to be sure, we force the collision to happen:   perform-next-collision end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;; reporters ;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to-report init-particle-speed   report 1 end  to-report max-particle-mass   report max [mass] of particles end  to-report kinetic-energy    report (0.5 * mass * speed * speed) end  to draw-vert-line [ xval ]   plotxy xval plot-y-min   plot-pen-down   plotxy xval plot-y-max   plot-pen-up end   ; Copyright 2005 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":272,"top":10,"right":685,"bottom":424,"dimensions":{"minPxcor":-40,"maxPxcor":40,"minPycor":-40,"maxPycor":40,"patchSize":5,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":20,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":4,"top":10,"right":97,"bottom":43,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"250","compiledStep":"1","variable":"initial-number-particles","left":0,"top":45,"right":190,"bottom":78,"display":"initial-number-particles","min":"1","max":"250","default":60,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":98,"top":10,"right":188,"bottom":43,"display":"go/pause","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"10","compiledStep":"0.5","variable":"largest-particle-size","left":0,"top":120,"right":190,"bottom":153,"display":"largest-particle-size","min":"1","max":"10","default":6,"step":"0.5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"5","compiledStep":"0.5","variable":"smallest-particle-size","left":0,"top":84,"right":190,"bottom":117,"display":"smallest-particle-size","min":"1","max":"5","default":2,"step":"0.5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"avg-speed\")","source":"avg-speed","left":5,"top":155,"right":101,"bottom":200,"display":"average speed","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Counts', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setYRange(0, 100);       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Counts', 'fast')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-fast\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"fast","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-fast","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Counts', 'medium')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-medium\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"medium","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-medium","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Counts', 'slow')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"percent-slow\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"slow","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-slow","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed Counts","left":5,"top":250,"right":268,"bottom":445,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-y-range 0 100","updateCode":"","pens":[{"display":"fast","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-fast","type":"pen"},{"display":"medium","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-medium","type":"pen"},{"display":"slow","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks percent-slow","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Histogram', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setXRange(0, PrimChecks.math.ceil(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, procedures[\"INIT-PARTICLE-SPEED\"]()), 2)));         plotManager.setYRange(0, PrimChecks.math.ceil(PrimChecks.math.div(PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed(\"PARTICLES\")), 6)));         plotManager.setCurrentPen(\"medium\");         plotManager.setHistogramBarCount(40);         plotManager.setCurrentPen(\"slow\");         plotManager.setHistogramBarCount(40);         plotManager.setCurrentPen(\"fast\");         plotManager.setHistogramBarCount(40);         plotManager.setCurrentPen(\"init-avg-speed\");         let _maybestop_337_351 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"init-avg-speed\"));         if (_maybestop_337_351 instanceof Exception.StopInterrupt) { return _maybestop_337_351; }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Histogram', 'fast')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.drawHistogramFrom(PrimChecks.agentset.of(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 15); }), function() { return SelfManager.self().getVariable(\"speed\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"fast","interval":1,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = red]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Histogram', 'medium')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.drawHistogramFrom(PrimChecks.agentset.of(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 55); }), function() { return SelfManager.self().getVariable(\"speed\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"medium","interval":1,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = green]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Histogram', 'slow')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.drawHistogramFrom(PrimChecks.agentset.of(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 105); }), function() { return SelfManager.self().getVariable(\"speed\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"slow","interval":1,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = blue]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Speed Histogram', 'avg-speed')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.resetPen();         let _maybestop_50_64 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"avg-speed\"));         if (_maybestop_50_64 instanceof Exception.StopInterrupt) { return _maybestop_50_64; }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"avg-speed","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-speed","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"init-avg-speed","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed Histogram","left":6,"top":449,"right":340,"bottom":604,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-x-range 0 ceiling (init-particle-speed * 2) set-plot-y-range 0 ceiling (count particles / 6) set-current-plot-pen \"medium\" set-histogram-num-bars 40 set-current-plot-pen \"slow\" set-histogram-num-bars 40 set-current-plot-pen \"fast\" set-histogram-num-bars 40 set-current-plot-pen \"init-avg-speed\" draw-vert-line init-avg-speed","updateCode":"","pens":[{"display":"fast","interval":1,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = red]","type":"pen"},{"display":"medium","interval":1,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = green]","type":"pen"},{"display":"slow","interval":1,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"histogram [speed] of particles with [color = blue]","type":"pen"},{"display":"avg-speed","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-speed","type":"pen"},{"display":"init-avg-speed","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Energy Histogram', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setXRange(0, PrimChecks.math.ceil(PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.math.mult(0.5, PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, procedures[\"INIT-PARTICLE-SPEED\"]()), 2)), PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, procedures[\"INIT-PARTICLE-SPEED\"]()), 2)), PrimChecks.validator.checkArg('*', 1, procedures[\"MAX-PARTICLE-MASS\"]()))));         plotManager.setYRange(0, PrimChecks.math.ceil(PrimChecks.math.div(PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed(\"PARTICLES\")), 6)));         plotManager.setCurrentPen(\"particles\");         plotManager.setHistogramBarCount(40);         plotManager.setCurrentPen(\"init-avg-energy\");         let _maybestop_290_304 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"init-avg-energy\"));         if (_maybestop_290_304 instanceof Exception.StopInterrupt) { return _maybestop_290_304; }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Energy Histogram', 'particles')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.drawHistogramFrom(PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed(\"PARTICLES\"), function() { return SelfManager.self().getVariable(\"energy\"); }));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"particles","interval":1,"mode":1,"color":-11053225,"inLegend":true,"setupCode":"","updateCode":"histogram [energy] of particles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Energy Histogram', 'avg-energy')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.resetPen();         let _maybestop_50_64 = procedures[\"DRAW-VERT-LINE\"](world.observer.getGlobal(\"avg-energy\"));         if (_maybestop_50_64 instanceof Exception.StopInterrupt) { return _maybestop_50_64; }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"avg-energy","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-energy","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"init-avg-energy","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Energy Histogram","left":343,"top":449,"right":687,"bottom":604,"xmin":0,"xmax":200,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"set-plot-x-range 0 ceiling (0.5 * (init-particle-speed * 2) * (init-particle-speed * 2) * max-particle-mass) set-plot-y-range 0 ceiling (count particles / 6)  set-current-plot-pen \"particles\" set-histogram-num-bars 40 set-current-plot-pen \"init-avg-energy\" draw-vert-line init-avg-energy","updateCode":"","pens":[{"display":"particles","interval":1,"mode":1,"color":-11053225,"inLegend":true,"setupCode":"","updateCode":"histogram [energy] of particles","type":"pen"},{"display":"avg-energy","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset   draw-vert-line avg-energy","type":"pen"},{"display":"init-avg-energy","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"avg-energy\")","source":"avg-energy","left":102,"top":154,"right":205,"bottom":199,"display":"average-energy","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-fast\")","source":"percent-fast","left":5,"top":205,"right":82,"bottom":250,"display":"% fast","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-medium\")","source":"percent-medium","left":85,"top":205,"right":181,"bottom":250,"display":"% medium","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"percent-slow\")","source":"percent-slow","left":185,"top":205,"right":268,"bottom":250,"display":"% slow","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["initial-number-particles", "largest-particle-size", "smallest-particle-size", "tick-delta", "box-edge", "collisions", "particle1", "particle2", "init-avg-speed", "init-avg-energy", "avg-speed", "avg-energy", "fast", "medium", "slow", "percent-slow", "percent-medium", "percent-fast"], ["initial-number-particles", "largest-particle-size", "smallest-particle-size"], [], -40, 40, -40, 40, 5, false, false, turtleShapes, linkShapes, function(){});
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
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PARTICLES").getSpecialName(), "circle")
      world.observer.setGlobal("box-edge", PrimChecks.math.minus(world.topology.maxPxcor, 1));
      Errors.askNobodyCheck(PrimChecks.agentset.with(world.patches(), function() {
        return (((Prims.equality(PrimChecks.math.abs(PrimChecks.validator.checkArg('ABS', 1, SelfManager.self().getPatchVariable("pxcor"))), world.observer.getGlobal("box-edge")) || Prims.equality(PrimChecks.math.abs(PrimChecks.validator.checkArg('ABS', 1, SelfManager.self().getPatchVariable("pycor"))), world.observer.getGlobal("box-edge"))) && Prims.lte(PrimChecks.math.abs(PrimChecks.validator.checkArg('ABS', 1, SelfManager.self().getPatchVariable("pxcor"))), world.observer.getGlobal("box-edge"))) && Prims.lte(PrimChecks.math.abs(PrimChecks.validator.checkArg('ABS', 1, SelfManager.self().getPatchVariable("pycor"))), world.observer.getGlobal("box-edge")));
      })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
      world.observer.setGlobal("avg-speed", 1);
      procedures["MAKE-PARTICLES"]();
      world.observer.setGlobal("particle1", Nobody);
      world.observer.setGlobal("particle2", Nobody);
      world.ticker.reset();
      world.observer.setGlobal("collisions", []);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      procedures["UPDATE-VARIABLES"]();
      world.observer.setGlobal("init-avg-speed", world.observer.getGlobal("avg-speed"));
      world.observer.setGlobal("init-avg-energy", world.observer.getGlobal("avg-energy"));
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
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-number-particles"), "PARTICLES").ask(function() {
        SelfManager.self().setVariable("speed", 1);
        SelfManager.self().setVariable("size", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("smallest-particle-size")), PrimChecks.math.randomFloat(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("largest-particle-size")), PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("smallest-particle-size"))))));
        SelfManager.self().setVariable("mass", PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("size")), PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("size"))));
        SelfManager.self().setVariable("energy", procedures["KINETIC-ENERGY"]());
        procedures["RECOLOR"]();
      }, true);
      var _foreach_1856_1863 = Tasks.forEach(Tasks.commandTask(function(theParticle) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        Errors.askNobodyCheck(theParticle).ask(function() {
          procedures["POSITION-RANDOMLY"]();
          while (procedures["OVERLAPPING?"]()) {
            procedures["POSITION-RANDOMLY"]();
          }
        }, true);
      }, "[ the-particle -> ask the-particle [ position-randomly while [ overlapping? ] [ position-randomly ] ] ]"), PrimChecks.list.sortBy(Tasks.reporterTask(function(a, b) {
        Errors.procedureArgumentsCheck(2, arguments.length);
        return Prims.gt(PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, a), function() { return SelfManager.self().getVariable("size"); }), PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, b), function() { return SelfManager.self().getVariable("size"); }));
      }, "[ [a b] -> [ size ] of a > [ size ] of b ]"), world.turtleManager.turtlesOfBreed("PARTICLES"))); if(reporterContext && _foreach_1856_1863 !== undefined) { return _foreach_1856_1863; }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeParticles"] = temp;
  procs["MAKE-PARTICLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.agentset.anyOtherWith(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("PARTICLES"), PrimChecks.math.div(PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, SelfManager.self().getVariable("size")), PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("largest-particle-size"))), 2)), function() {
        return Prims.lt(SelfManager.self().distance(SelfManager.myself()), PrimChecks.math.div(PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, SelfManager.self().getVariable("size")), PrimChecks.validator.checkArg('+', 1, PrimChecks.agentset.of(SelfManager.myself(), function() { return SelfManager.self().getVariable("size"); }))), 2));
      });
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["overlapping_p"] = temp;
  procs["OVERLAPPING?"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setXY(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, PrimChecks.list.oneOf([1, -1])), PrimChecks.math.randomFloat(PrimChecks.math.minus(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("box-edge")), 0.5), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, SelfManager.self().getVariable("size")), 2)))), PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, PrimChecks.list.oneOf([1, -1])), PrimChecks.math.randomFloat(PrimChecks.math.minus(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("box-edge")), 0.5), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, SelfManager.self().getVariable("size")), 2)))));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["positionRandomly"] = temp;
  procs["POSITION-RANDOMLY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["CHOOSE-NEXT-COLLISION"]();
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() {
        SelfManager.self().jumpIfAble(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("tick-delta"))));
      }, true);
      procedures["PERFORM-NEXT-COLLISION"]();
      world.ticker.tickAdvance(world.observer.getGlobal("tick-delta"));
      procedures["RECALCULATE-PARTICLES-THAT-JUST-COLLIDED"]();
      if (Prims.gt(PrimChecks.math.floor(world.ticker.tickCount()), PrimChecks.math.floor(PrimChecks.math.minus(world.ticker.tickCount(), PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("tick-delta")))))) {
        procedures["UPDATE-VARIABLES"]();
        plotManager.updatePlots();
      }
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
      world.observer.setGlobal("medium", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }));
      world.observer.setGlobal("slow", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }));
      world.observer.setGlobal("fast", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }));
      world.observer.setGlobal("percent-medium", PrimChecks.math.mult(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal("medium")), PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("PARTICLES"))), 100));
      world.observer.setGlobal("percent-slow", PrimChecks.math.mult(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal("slow")), PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("PARTICLES"))), 100));
      world.observer.setGlobal("percent-fast", PrimChecks.math.mult(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal("fast")), PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("PARTICLES"))), 100));
      world.observer.setGlobal("avg-speed", PrimChecks.list.mean(PrimChecks.validator.checkArg('MEAN', 8, PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return SelfManager.self().getVariable("speed"); }))));
      world.observer.setGlobal("avg-energy", PrimChecks.list.mean(PrimChecks.validator.checkArg('MEAN', 8, PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return SelfManager.self().getVariable("energy"); }))));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["updateVariables"] = temp;
  procs["UPDATE-VARIABLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (NLType.checks.isValidTurtle(world.observer.getGlobal("particle2"))) {
        world.observer.setGlobal("collisions", PrimChecks.list.filter(Tasks.reporterTask(function(theCollision) {
          Errors.procedureArgumentsCheck(1, arguments.length);
          return (((!Prims.equality(PrimChecks.list.item(1, PrimChecks.validator.checkArg('ITEM', 12, theCollision)), world.observer.getGlobal("particle1")) && !Prims.equality(PrimChecks.list.item(2, PrimChecks.validator.checkArg('ITEM', 12, theCollision)), world.observer.getGlobal("particle1"))) && !Prims.equality(PrimChecks.list.item(1, PrimChecks.validator.checkArg('ITEM', 12, theCollision)), world.observer.getGlobal("particle2"))) && !Prims.equality(PrimChecks.list.item(2, PrimChecks.validator.checkArg('ITEM', 12, theCollision)), world.observer.getGlobal("particle2")));
        }, "[ the-collision -> item 1 the-collision != particle1 and item 2 the-collision != particle1 and item 1 the-collision != particle2 and item 2 the-collision != particle2 ]"), PrimChecks.validator.checkArg('FILTER', 8, world.observer.getGlobal("collisions"))));
        Errors.askNobodyCheck(world.observer.getGlobal("particle2")).ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
        Errors.askNobodyCheck(world.observer.getGlobal("particle2")).ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      }
      else {
        world.observer.setGlobal("collisions", PrimChecks.list.filter(Tasks.reporterTask(function(theCollision) {
          Errors.procedureArgumentsCheck(1, arguments.length);
          return (!Prims.equality(PrimChecks.list.item(1, PrimChecks.validator.checkArg('ITEM', 12, theCollision)), world.observer.getGlobal("particle1")) && !Prims.equality(PrimChecks.list.item(2, PrimChecks.validator.checkArg('ITEM', 12, theCollision)), world.observer.getGlobal("particle1")));
        }, "[ the-collision -> item 1 the-collision != particle1 and item 2 the-collision != particle1 ]"), PrimChecks.validator.checkArg('FILTER', 8, world.observer.getGlobal("collisions"))));
      }
      if (!Prims.equality(world.observer.getGlobal("particle1"), Nobody)) {
        Errors.askNobodyCheck(world.observer.getGlobal("particle1")).ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      }
      if (!Prims.equality(world.observer.getGlobal("particle1"), Nobody)) {
        Errors.askNobodyCheck(world.observer.getGlobal("particle1")).ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      }
      world.observer.setGlobal("collisions", PrimChecks.list.filter(Tasks.reporterTask(function(theCollision) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        return (!Prims.equality(PrimChecks.list.item(1, PrimChecks.validator.checkArg('ITEM', 12, theCollision)), world.observer.getGlobal("particle1")) || !Prims.equality(PrimChecks.list.item(2, PrimChecks.validator.checkArg('ITEM', 12, theCollision)), world.observer.getGlobal("particle2")));
      }, "[ the-collision -> item 1 the-collision != particle1 or item 2 the-collision != particle2 ]"), PrimChecks.validator.checkArg('FILTER', 8, world.observer.getGlobal("collisions"))));
      world.observer.setGlobal("particle1", Nobody);
      world.observer.setGlobal("particle2", Nobody);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["recalculateParticlesThatJustCollided"] = temp;
  procs["RECALCULATE-PARTICLES-THAT-JUST-COLLIDED"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let myX = SelfManager.self().getVariable("xcor"); letVars['myX'] = myX;
      let myY = SelfManager.self().getVariable("ycor"); letVars['myY'] = myY;
      let myParticleSize = SelfManager.self().getVariable("size"); letVars['myParticleSize'] = myParticleSize;
      let myXSpeed = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), SelfManager.self().dx()); letVars['myXSpeed'] = myXSpeed;
      let myYSpeed = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), SelfManager.self().dy()); letVars['myYSpeed'] = myYSpeed;
      Errors.askNobodyCheck(SelfPrims.other(world.turtleManager.turtlesOfBreed("PARTICLES"))).ask(function() {
        let dpx = PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("xcor")), PrimChecks.validator.checkArg('-', 1, myX)); letVars['dpx'] = dpx;
        let dpy = PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("ycor")), PrimChecks.validator.checkArg('-', 1, myY)); letVars['dpy'] = dpy;
        let xSpeed = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), SelfManager.self().dx()); letVars['xSpeed'] = xSpeed;
        let ySpeed = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), SelfManager.self().dy()); letVars['ySpeed'] = ySpeed;
        let dvx = PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, xSpeed), PrimChecks.validator.checkArg('-', 1, myXSpeed)); letVars['dvx'] = dvx;
        let dvy = PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, ySpeed), PrimChecks.validator.checkArg('-', 1, myYSpeed)); letVars['dvy'] = dvy;
        let sumR = PrimChecks.math.plus(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, myParticleSize), 2), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, PrimChecks.agentset.of(SelfManager.self(), function() { return SelfManager.self().getVariable("size"); })), 2)); letVars['sumR'] = sumR;
        let pSquared = PrimChecks.math.minus(PrimChecks.math.plus(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, dpx), PrimChecks.validator.checkArg('*', 1, dpx)), PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, dpy), PrimChecks.validator.checkArg('*', 1, dpy))), PrimChecks.math.pow(PrimChecks.validator.checkArg('^', 1, sumR), 2)); letVars['pSquared'] = pSquared;
        let pv = PrimChecks.math.mult(2, PrimChecks.math.plus(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, dpx), PrimChecks.validator.checkArg('*', 1, dvx)), PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, dpy), PrimChecks.validator.checkArg('*', 1, dvy)))); letVars['pv'] = pv;
        let vSquared = PrimChecks.math.plus(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, dvx), PrimChecks.validator.checkArg('*', 1, dvx)), PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, dvy), PrimChecks.validator.checkArg('*', 1, dvy))); letVars['vSquared'] = vSquared;
        let d1 = PrimChecks.math.minus(PrimChecks.math.pow(PrimChecks.validator.checkArg('^', 1, pv), 2), PrimChecks.math.mult(PrimChecks.math.mult(4, PrimChecks.validator.checkArg('*', 1, vSquared)), PrimChecks.validator.checkArg('*', 1, pSquared))); letVars['d1'] = d1;
        let timeToCollision = -1; letVars['timeToCollision'] = timeToCollision;
        if (Prims.gt(d1, 0)) {
          timeToCollision = PrimChecks.math.div(PrimChecks.math.minus(PrimChecks.math.unaryminus(PrimChecks.validator.checkArg('-', 1, pv)), PrimChecks.math.sqrt(PrimChecks.validator.checkArg('SQRT', 1, d1))), PrimChecks.math.mult(2, PrimChecks.validator.checkArg('*', 1, vSquared))); letVars['timeToCollision'] = timeToCollision;
        }
        if (Prims.gt(timeToCollision, 0)) {
          world.observer.setGlobal("collisions", PrimChecks.list.fput(ListPrims.list(PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, timeToCollision), world.ticker.tickCount()), SelfManager.self(), SelfManager.myself()), PrimChecks.validator.checkArg('FPUT', 8, world.observer.getGlobal("collisions"))));
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkForParticleCollision"] = temp;
  procs["CHECK-FOR-PARTICLE-COLLISION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let xSpeed = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), SelfManager.self().dx()); letVars['xSpeed'] = xSpeed;
      if (!Prims.equality(xSpeed, 0)) {
        let rightInterval = PrimChecks.math.div(PrimChecks.math.minus(PrimChecks.math.minus(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("box-edge")), 0.5), PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("xcor"))), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, SelfManager.self().getVariable("size")), 2)), PrimChecks.validator.checkArg('/', 1, xSpeed)); letVars['rightInterval'] = rightInterval;
        if (Prims.gt(rightInterval, 0)) {
          procedures["ASSIGN-COLLIDING-WALL"](rightInterval,"right wall");
        }
        let leftInterval = PrimChecks.math.div(PrimChecks.math.plus(PrimChecks.math.minus(PrimChecks.math.plus(PrimChecks.math.unaryminus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("box-edge"))), 0.5), PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("xcor"))), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, SelfManager.self().getVariable("size")), 2)), PrimChecks.validator.checkArg('/', 1, xSpeed)); letVars['leftInterval'] = leftInterval;
        if (Prims.gt(leftInterval, 0)) {
          procedures["ASSIGN-COLLIDING-WALL"](leftInterval,"left wall");
        }
      }
      let ySpeed = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), SelfManager.self().dy()); letVars['ySpeed'] = ySpeed;
      if (!Prims.equality(ySpeed, 0)) {
        let topInterval = PrimChecks.math.div(PrimChecks.math.minus(PrimChecks.math.minus(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("box-edge")), 0.5), PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("ycor"))), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, SelfManager.self().getVariable("size")), 2)), PrimChecks.validator.checkArg('/', 1, ySpeed)); letVars['topInterval'] = topInterval;
        if (Prims.gt(topInterval, 0)) {
          procedures["ASSIGN-COLLIDING-WALL"](topInterval,"top wall");
        }
        let bottomInterval = PrimChecks.math.div(PrimChecks.math.plus(PrimChecks.math.minus(PrimChecks.math.plus(PrimChecks.math.unaryminus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("box-edge"))), 0.5), PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("ycor"))), PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, SelfManager.self().getVariable("size")), 2)), PrimChecks.validator.checkArg('/', 1, ySpeed)); letVars['bottomInterval'] = bottomInterval;
        if (Prims.gt(bottomInterval, 0)) {
          procedures["ASSIGN-COLLIDING-WALL"](bottomInterval,"bottom wall");
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkForWallCollision"] = temp;
  procs["CHECK-FOR-WALL-COLLISION"] = temp;
  temp = (function(timeToCollision, wall) {
    try {
      var reporterContext = false;
      var letVars = { };
      let collidingPair = ListPrims.list(PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, timeToCollision), world.ticker.tickCount()), SelfManager.self(), wall); letVars['collidingPair'] = collidingPair;
      world.observer.setGlobal("collisions", PrimChecks.list.fput(collidingPair, PrimChecks.validator.checkArg('FPUT', 8, world.observer.getGlobal("collisions"))));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["assignCollidingWall"] = temp;
  procs["ASSIGN-COLLIDING-WALL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("collisions"), [])) {
        throw new Exception.StopInterrupt;
      }
      let winner = PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, world.observer.getGlobal("collisions"))); letVars['winner'] = winner;
      var _foreach_13599_13606 = Tasks.forEach(Tasks.commandTask(function(theCollision) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        if (Prims.lt(PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, theCollision)), PrimChecks.list.first(PrimChecks.validator.checkArg('FIRST', 12, winner)))) {
          winner = theCollision; letVars['winner'] = winner;
        }
      }, "[ the-collision -> if first the-collision < first winner [ set winner the-collision ] ]"), world.observer.getGlobal("collisions")); if(reporterContext && _foreach_13599_13606 !== undefined) { return _foreach_13599_13606; }
      let dt = PrimChecks.list.item(0, PrimChecks.validator.checkArg('ITEM', 12, winner)); letVars['dt'] = dt;
      world.observer.setGlobal("tick-delta", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, dt), world.ticker.tickCount()));
      if (Prims.gt(world.observer.getGlobal("tick-delta"), 1)) {
        world.observer.setGlobal("tick-delta", 1);
        world.observer.setGlobal("particle1", Nobody);
        world.observer.setGlobal("particle2", Nobody);
        throw new Exception.StopInterrupt;
      }
      world.observer.setGlobal("particle1", PrimChecks.list.item(1, PrimChecks.validator.checkArg('ITEM', 12, winner)));
      world.observer.setGlobal("particle2", PrimChecks.list.item(2, PrimChecks.validator.checkArg('ITEM', 12, winner)));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["chooseNextCollision"] = temp;
  procs["CHOOSE-NEXT-COLLISION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("particle1"), Nobody)) {
        throw new Exception.StopInterrupt;
      }
      if (NLType.checks.isString(world.observer.getGlobal("particle2"))) {
        if ((Prims.equality(world.observer.getGlobal("particle2"), "left wall") || Prims.equality(world.observer.getGlobal("particle2"), "right wall"))) {
          Errors.askNobodyCheck(world.observer.getGlobal("particle1")).ask(function() {
            SelfManager.self().setVariable("heading", PrimChecks.math.unaryminus(PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("heading"))));
          }, true);
          throw new Exception.StopInterrupt;
        }
        if ((Prims.equality(world.observer.getGlobal("particle2"), "top wall") || Prims.equality(world.observer.getGlobal("particle2"), "bottom wall"))) {
          Errors.askNobodyCheck(world.observer.getGlobal("particle1")).ask(function() {
            SelfManager.self().setVariable("heading", PrimChecks.math.minus(180, PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("heading"))));
          }, true);
          throw new Exception.StopInterrupt;
        }
      }
      Errors.askNobodyCheck(world.observer.getGlobal("particle1")).ask(function() { procedures["COLLIDE-WITH"](world.observer.getGlobal("particle2")); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["performNextCollision"] = temp;
  procs["PERFORM-NEXT-COLLISION"] = temp;
  temp = (function(otherParticle) {
    try {
      var reporterContext = false;
      var letVars = { };
      let mass2 = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, otherParticle), function() { return SelfManager.self().getVariable("mass"); }); letVars['mass2'] = mass2;
      let speed2 = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, otherParticle), function() { return SelfManager.self().getVariable("speed"); }); letVars['speed2'] = speed2;
      let heading2 = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, otherParticle), function() { return SelfManager.self().getVariable("heading"); }); letVars['heading2'] = heading2;
      let theta = SelfManager.self().towards(otherParticle); letVars['theta'] = theta;
      let v1t = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), PrimChecks.math.cos(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, theta), PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("heading"))))); letVars['v1t'] = v1t;
      let v1l = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")), PrimChecks.math.sin(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, theta), PrimChecks.validator.checkArg('-', 1, SelfManager.self().getVariable("heading"))))); letVars['v1l'] = v1l;
      let v2t = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, speed2), PrimChecks.math.cos(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, theta), PrimChecks.validator.checkArg('-', 1, heading2)))); letVars['v2t'] = v2t;
      let v2l = PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, speed2), PrimChecks.math.sin(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, theta), PrimChecks.validator.checkArg('-', 1, heading2)))); letVars['v2l'] = v2l;
      let vcm = PrimChecks.math.div(PrimChecks.math.plus(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("mass")), PrimChecks.validator.checkArg('*', 1, v1t)), PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, mass2), PrimChecks.validator.checkArg('*', 1, v2t))), PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, SelfManager.self().getVariable("mass")), PrimChecks.validator.checkArg('+', 1, mass2))); letVars['vcm'] = vcm;
      v1t = PrimChecks.math.minus(PrimChecks.math.mult(2, PrimChecks.validator.checkArg('*', 1, vcm)), PrimChecks.validator.checkArg('-', 1, v1t)); letVars['v1t'] = v1t;
      v2t = PrimChecks.math.minus(PrimChecks.math.mult(2, PrimChecks.validator.checkArg('*', 1, vcm)), PrimChecks.validator.checkArg('-', 1, v2t)); letVars['v2t'] = v2t;
      SelfManager.self().setVariable("speed", PrimChecks.math.sqrt(PrimChecks.math.plus(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, v1t), PrimChecks.validator.checkArg('*', 1, v1t)), PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, v1l), PrimChecks.validator.checkArg('*', 1, v1l)))));
      SelfManager.self().setVariable("energy", procedures["KINETIC-ENERGY"]());
      if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
        SelfManager.self().setVariable("heading", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, theta), PrimChecks.math.atan(PrimChecks.validator.checkArg('ATAN', 1, v1l), PrimChecks.validator.checkArg('ATAN', 1, v1t))));
      }
      Errors.askNobodyCheck(otherParticle).ask(function() {
        SelfManager.self().setVariable("speed", PrimChecks.math.sqrt(PrimChecks.math.plus(PrimChecks.math.pow(PrimChecks.validator.checkArg('^', 1, v2t), 2), PrimChecks.math.pow(PrimChecks.validator.checkArg('^', 1, v2l), 2))));
        SelfManager.self().setVariable("energy", procedures["KINETIC-ENERGY"]());
        if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
          SelfManager.self().setVariable("heading", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, theta), PrimChecks.math.atan(PrimChecks.validator.checkArg('ATAN', 1, v2l), PrimChecks.validator.checkArg('ATAN', 1, v2t))));
        }
      }, true);
      procedures["RECOLOR"]();
      Errors.askNobodyCheck(otherParticle).ask(function() { procedures["RECOLOR"](); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["collideWith"] = temp;
  procs["COLLIDE-WITH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(SelfManager.self().getVariable("speed"), PrimChecks.math.mult(0.5, PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("avg-speed"))))) {
        SelfManager.self().setVariable("color", 105);
      }
      else {
        if (Prims.gt(SelfManager.self().getVariable("speed"), PrimChecks.math.mult(1.5, PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("avg-speed"))))) {
          SelfManager.self().setVariable("color", 15);
        }
        else {
          SelfManager.self().setVariable("color", 55);
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["recolor"] = temp;
  procs["RECOLOR"] = temp;
  temp = (function(n) {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SETUP"]();
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().stamp(); }, true);
      while (Prims.lt(world.ticker.tickCount(), n)) {
        procedures["GO"]();
      }
      let oldTicks = world.ticker.tickCount(); letVars['oldTicks'] = oldTicks;
      procedures["REVERSE-TIME"]();
      while (Prims.lt(world.ticker.tickCount(), PrimChecks.math.mult(2, PrimChecks.validator.checkArg('*', 1, oldTicks)))) {
        procedures["GO"]();
      }
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().setVariable("color", 9.9); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["testTimeReversal"] = temp;
  procs["TEST-TIME-REVERSAL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().right(180); }, true);
      world.observer.setGlobal("collisions", []);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      procedures["PERFORM-NEXT-COLLISION"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["reverseTime"] = temp;
  procs["REVERSE-TIME"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return 1;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["initParticleSpeed"] = temp;
  procs["INIT-PARTICLE-SPEED"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("PARTICLES"), function() { return SelfManager.self().getVariable("mass"); })));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["maxParticleMass"] = temp;
  procs["MAX-PARTICLE-MASS"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.math.mult(0.5, PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("mass"))), PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed"))), PrimChecks.validator.checkArg('*', 1, SelfManager.self().getVariable("speed")));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["kineticEnergy"] = temp;
  procs["KINETIC-ENERGY"] = temp;
  temp = (function(xval) {
    try {
      var reporterContext = false;
      var letVars = { };
      plotManager.plotPoint(xval, plotManager.getPlotYMin());
      plotManager.lowerPen();
      plotManager.plotPoint(xval, plotManager.getPlotYMax());
      plotManager.raisePen();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["drawVertLine"] = temp;
  procs["DRAW-VERT-LINE"] = temp;
  return procs;
})();
world.observer.setGlobal("initial-number-particles", 60);
world.observer.setGlobal("largest-particle-size", 6);
world.observer.setGlobal("smallest-particle-size", 2);