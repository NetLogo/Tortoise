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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"clocker":{"name":"clocker","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,105,135,135,165,165,195],"ycors":[30,195,180,270,270,180,195],"type":"polygon","color":"rgba(167, 27, 106, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Pressure vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(25, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "pressure", false, true, 0, 20, 0, 100, setup, update);
})(), (function() {
  var name    = 'Wall Hits per Particle';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0, 20, 0, 1, setup, update);
})(), (function() {
  var name    = 'Energy Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15, 10, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55, 10, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105, 10, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('avg-energy', plotOps.makePenOps, false, new PenBundle.State(5, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('init-avg-energy', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Energy", "Number", true, false, 0, 400, 0, 10, setup, update);
})(), (function() {
  var name    = 'Speed Counts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "count", false, true, 0, 20, 0, 100, setup, update);
})(), (function() {
  var name    = 'Speed Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('fast', plotOps.makePenOps, false, new PenBundle.State(15, 5, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('medium', plotOps.makePenOps, false, new PenBundle.State(55, 5, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('slow', plotOps.makePenOps, false, new PenBundle.State(105, 5, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('avg-speed', plotOps.makePenOps, false, new PenBundle.State(5, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('init-avg-speed', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Speed", "Number", true, false, 0, 50, 0, 100, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "particles", singular: "particle", varNames: ["speed", "mass", "energy", "wall-hits", "momentum-difference", "last-collision"] }, { name: "flashes", singular: "flash", varNames: ["birthday"] }, { name: "clockers", singular: "clocker", varNames: [] }])([], [])('globals [   result   tick-length          ;; clock variable   box-edge                   ;; distance of box edge from axes   pressure   pressure-history   zero-pressure-count        ;; how many zero entries are in pressure-history   wall-hits-per-particle     ;; average number of wall hits per particle   length-horizontal-surface  ;; the size of the wall surfaces that run horizontally - the top and bottom of the box   length-vertical-surface    ;; the size of the wall surfaces that run vertically - the left and right of the box    init-avg-speed init-avg-energy  ;; initial averages   avg-speed avg-energy            ;; current averages   fast medium slow                ;; current counts    fade-needed? ]  breed [ particles particle ] breed [ flashes flash ] breed [clockers clocker ]  flashes-own [birthday]  particles-own [   speed mass energy          ;; particle info   wall-hits                  ;; # of wall hits during this clock cycle (\"big tick\")   momentum-difference        ;; used to calculate pressure from wall hits   last-collision ]  to benchmark   random-seed 361   reset-timer   setup   repeat 17000 [ go ]   set result timer end  to setup   ca reset-ticks   set-default-shape particles \"circle\"   set fade-needed? false   ;; box has constant size...   set box-edge (max-pxcor - 1)   ;;; the length of the horizontal or vertical surface of   ;;; the inside of the box must exclude the two patches   ;; that are the where the perpendicular walls join it,   ;;; but must also add in the axes as an additional patch   ;;; example:  a box with an box-edge of 10, is drawn with   ;;; 19 patches of wall space on the inside of the box   set length-horizontal-surface  ( 2 * (box-edge - 1) + 1)   set length-vertical-surface  ( 2 * (box-edge - 1) + 1)   make-box   make-particles   make-clocker   set pressure-history []   set zero-pressure-count 0   update-variables   set init-avg-speed avg-speed   set init-avg-energy avg-energy   setup-plotz   setup-histograms   do-plotting end  to update-variables   set medium count particles with [color = green]   set slow   count particles with [color = blue]   set fast   count particles with [color = red]   set avg-speed  mean [speed] of particles   set avg-energy mean [energy] of particles end  to go   ask particles [ bounce ]   ask particles [ move ]   ask particles [ if collide? [check-for-collision] ]   if trace?   [ ask particle 0      [ set pcolor gray set fade-needed? true ]   ]   let old-clock ticks   tick-advance tick-length   if floor ticks > floor (ticks - tick-length)   [     ifelse any? particles       [ set wall-hits-per-particle mean [wall-hits] of particles ]       [ set wall-hits-per-particle 0 ]     ask particles       [ set wall-hits 0 ]     if fade-needed? [fade-patches]     calculate-pressure     update-variables     do-plotting   ]   calculate-tick-length   ask clockers [ set heading ticks * 360 ]   ask flashes with [ticks - birthday > 0.4]   [     set pcolor yellow     die   ]   display end  to calculate-tick-length   ifelse any? particles with [speed > 0]     [ set tick-length 1 / (ceiling max [speed] of particles) ]     [ set tick-length 1 ] end  ;;; Pressure is defined as the force per unit area.  In this context, ;;; that means the total momentum per unit time transferred to the walls ;;; by particle hits, divided by the surface area of the walls.  (Here ;;; we\'re in a two dimensional world, so the \"surface area\" of the walls ;;; is just their length.)  Each wall contributes a different amount ;;; to the total pressure in the box, based on the number of collisions, the ;;; direction of each collision, and the length of the wall.  Conservation of momentum ;;; in hits ensures that the difference in momentum for the particles is equal to and ;;; opposite to that for the wall.  The force on each wall is the rate of change in ;;; momentum imparted to the wall, or the sum of change in momentum for each particle: ;;; F = SUM  [d(mv)/dt] = SUM [m(dv/dt)] = SUM [ ma ], in a direction perpendicular to ;;; the wall surface.  The pressure (P) on a given wall is the force (F) applied to that ;;; wall over its surface area.  The total pressure in the box is sum of each wall\'s ;;; pressure contribution.  to calculate-pressure   ;; by summing the momentum change for each particle,   ;; the wall\'s total momentum change is calculated   set pressure 15 * sum [momentum-difference] of particles   set pressure-history lput pressure pressure-history   set zero-pressure-count length filter [ [p] -> p = 0] pressure-history   ask particles     [ set momentum-difference 0 ]  ;; once the contribution to momentum has been calculated                                    ;; this value is reset to zero till the next wall hit end  to bounce  ;; particle procedure   ;; if we\'re not about to hit a wall (yellow patch), or if we\'re already on a   ;; wall, we don\'t need to do any further checks   if shade-of? yellow pcolor     [ stop ]   let new-patch patch-ahead 1   let new-px [pxcor] of new-patch   let new-py [pycor] of new-patch   if not shade-of? yellow [pcolor] of new-patch     [ stop ]   ;; get the coordinates of the patch we\'ll be on if we go forward 1   if (abs new-px != box-edge and abs new-py != box-edge)     [stop]   ;; if hitting left or right wall, reflect heading around x axis   if (abs new-px = box-edge)     [ set heading (- heading)       set wall-hits wall-hits + 1   ;;  if the particle is hitting a vertical wall, only the horizontal component of the speed   ;;  vector can change.  The change in velocity for this component is 2 * the speed of the particle,   ;; due to the reversing of direction of travel from the collision with the wall       set momentum-difference momentum-difference + (abs (sin heading * 2 * mass * speed) / length-vertical-surface) ]   ;; if hitting top or bottom wall, reflect heading around y axis   if (abs new-py = box-edge)     [ set heading (180 - heading)       set wall-hits wall-hits + 1   ;;  if the particle is hitting a horizontal wall, only the vertical component of the speed   ;;  vector can change.  The change in velocity for this component is 2 * the speed of the particle,   ;; due to the reversing of direction of travel from the collision with the wall       set momentum-difference momentum-difference + (abs (cos heading * 2 * mass * speed) / length-horizontal-surface)  ]     ask patch new-px new-py     [ sprout-flashes 1 [ ht                  set birthday ticks                  set pcolor yellow - 3 ] ] end  to move  ;; particle procedure   let old-patch patch-here   jump (speed * tick-length)   if patch-here != old-patch     [ set last-collision nobody ] end  to check-for-collision  ;; particle procedure   ;; Here we impose a rule that collisions only take place when there   ;; are exactly two particles per patch.  We do this because when the   ;; student introduces new particles from the side, we want them to   ;; form a uniform wavefront.   ;;   ;; Why do we want a uniform wavefront?  Because it is actually more   ;; realistic.  (And also because the curriculum uses the uniform   ;; wavefront to help teach the relationship between particle collisions,   ;; wall hits, and pressure.)   ;;   ;; Why is it realistic to assume a uniform wavefront?  Because in reality,   ;; whether a collision takes place would depend on the actual headings   ;; of the particles, not merely on their proximity.  Since the particles   ;; in the wavefront have identical speeds and near-identical headings,   ;; in reality they would not collide.  So even though the two-particles   ;; rule is not itself realistic, it produces a realistic result.  Also,   ;; unless the number of particles is extremely large, it is very rare   ;; for three or more particles to land on the same patch (for example,   ;; with 400 particles it happens less than 1% of the time).  So imposing   ;; this additional rule should have only a negligible effect on the   ;; aggregate behavior of the system.   ;;   ;; Why does this rule produce a uniform wavefront?  The particles all   ;; start out on the same patch, which means that without the only-two   ;; rule, they would all start colliding with each other immediately,   ;; resulting in much random variation of speeds and headings.  With   ;; the only-two rule, they are prevented from colliding with each other   ;; until they have spread out a lot.  (And in fact, if you observe   ;; the wavefront closely, you will see that it is not completely smooth,   ;; because some collisions eventually do start occurring when it thins out while fanning.)    if count other particles-here = 1   [     ;; the following conditions are imposed on collision candidates:     ;;   1. they must have a lower who number than my own, because collision     ;;      code is asymmetrical: it must always happen from the point of view     ;;      of just one particle.     ;;   2. they must not be the same particle that we last collided with on     ;;      this patch, so that we have a chance to leave the patch after we\'ve     ;;      collided with someone.     let candidate one-of other particles-here with       [who < [who] of myself and myself != last-collision]     ;; we also only collide if one of us has non-zero speed. It\'s useless     ;; (and incorrect, actually) for two particles with zero speed to collide.     if (candidate != nobody) and (speed > 0 or [speed] of candidate > 0)     [       collide-with candidate       set last-collision candidate       ask candidate [ set last-collision myself ]     ]   ] end  ;; implements a collision with another particle. ;; ;; THIS IS THE HEART OF THE PARTICLE SIMULATION, AND YOU ARE STRONGLY ADVISED ;; NOT TO CHANGE IT UNLESS YOU REALLY UNDERSTAND WHAT YOU\'RE DOING! ;; ;; The two particles colliding are self and other-particle, and while the ;; collision is performed from the point of view of self, both particles are ;; modified to reflect its effects. This is somewhat complicated, so I\'ll ;; give a general outline here: ;;   1. Do initial setup, and determine the heading between particle centers ;;      (call it theta). ;;   2. Convert the representation of the velocity of each particle from ;;      speed/heading to a theta-based vector whose first component is the ;;      particle\'s speed along theta, and whose second component is the speed ;;      perpendicular to theta. ;;   3. Modify the velocity vectors to reflect the effects of the collision. ;;      This involves: ;;        a. computing the velocity of the center of mass of the whole system ;;           along direction theta ;;        b. updating the along-theta components of the two velocity vectors. ;;   4. Convert from the theta-based vector representation of velocity back to ;;      the usual speed/heading representation for each particle. ;;   5. Perform final cleanup and update derived quantities. to collide-with [ other-particle ] ;; particle procedure    ;;; PHASE 1: initial setup    ;; for convenience, grab some quantities from other-particle   let mass2 [mass] of other-particle   let speed2 [speed] of other-particle   let heading2 [heading] of other-particle    ;; since particles are modeled as zero-size points, theta isn\'t meaningfully   ;; defined. we can assign it randomly without affecting the model\'s outcome.   let theta (random-float 360)      ;;; PHASE 2: convert velocities to theta-based vector representation    ;; now convert my velocity from speed/heading representation to components   ;; along theta and perpendicular to theta   let v1t (speed * cos (theta - heading))   let v1l (speed * sin (theta - heading))    ;; do the same for other-particle   let v2t (speed2 * cos (theta - heading2))   let v2l (speed2 * sin (theta - heading2))      ;;; PHASE 3: manipulate vectors to implement collision    ;; compute the velocity of the system\'s center of mass along theta   let vcm (((mass * v1t) + (mass2 * v2t)) / (mass + mass2) )    ;; now compute the new velocity for each particle along direction theta.   ;; velocity perpendicular to theta is unaffected by a collision along theta,   ;; so the next two lines actually implement the collision itself, in the   ;; sense that the effects of the collision are exactly the following changes   ;; in particle velocity.   set v1t (2 * vcm - v1t)   set v2t (2 * vcm - v2t)      ;;; PHASE 4: convert back to normal speed/heading    ;; now convert my velocity vector into my new speed and heading   set speed sqrt ((v1t * v1t) + (v1l * v1l))   set energy (0.5 * mass * speed * speed)   ;; if the magnitude of the velocity vector is 0, atan is undefined. but   ;; speed will be 0, so heading is irrelevant anyway. therefore, in that   ;; case we\'ll just leave it unmodified.   if v1l != 0 or v1t != 0     [ set heading (theta - (atan v1l v1t)) ]    ;; and do the same for other-particle   ask other-particle [ set speed sqrt ((v2t * v2t) + (v2l * v2l)) ]   ask other-particle [ set energy 0.5 * mass * speed * speed ]   if v2l != 0 or v2t != 0     [ ask other-particle [ set heading (theta - (atan v2l v2t)) ] ]      ;; PHASE 5: final updates    ;; now recolor, since color is based on quantities that may have changed   recolor   ask other-particle     [ recolor ] end  to recolor  ;; particle procedure   ifelse speed < (0.5 * 10)   [     set color blue   ]   [     ifelse speed > (1.5 * 10)       [ set color red ]       [ set color green ]   ] end  to fade-patches   let trace-patches patches with [(pcolor != yellow) and (pcolor != black)]   ifelse any? trace-patches     [ ask trace-patches       [ set pcolor ( pcolor - 0.4 )         if (not trace?) or (round pcolor = black)           [ set pcolor black ] ] ]     [ set fade-needed? false ] end  ;;; ;;; drawing procedures ;;;  ;; draws the box to make-box   ask patches with [ ((abs pxcor = box-edge) and (abs pycor <= box-edge)) or                      ((abs pycor = box-edge) and (abs pxcor <= box-edge)) ]     [ set pcolor yellow ] end  ;; creates initial particles to make-particles   create-ordered-particles number-of-particles   [     setup-particle     random-position     recolor   ]   calculate-tick-length end   to setup-particle  ;; particle procedure   set speed init-particle-speed   set mass particle-mass   set energy (0.5 * mass * speed * speed)   set last-collision nobody   set wall-hits 0   set momentum-difference 0 end  ;; place particle at random location inside the box. to random-position ;; particle procedure   setxy ((1 - box-edge) + random-float ((2 * box-edge) - 2))         ((1 - box-edge) + random-float ((2 * box-edge) - 2))   set heading random-float 360 end  ;;; plotting procedures  to setup-plotz   set-current-plot \"Speed Counts\"   set-plot-y-range 0 ceiling (number-of-particles / 6) end  to setup-histograms   set-current-plot \"Speed Histogram\"   set-plot-x-range 0 (init-particle-speed * 2)   set-plot-y-range 0 ceiling (number-of-particles / 6)   set-current-plot-pen \"medium\"   set-histogram-num-bars 40   set-current-plot-pen \"slow\"   set-histogram-num-bars 40   set-current-plot-pen \"fast\"   set-histogram-num-bars 40   set-current-plot-pen \"init-avg-speed\"   draw-vert-line init-avg-speed    set-current-plot \"Energy Histogram\"   set-plot-x-range 0 (0.5 * (init-particle-speed * 2) * (init-particle-speed * 2) * particle-mass)   set-plot-y-range 0 ceiling (number-of-particles / 6)   set-current-plot-pen \"medium\"   set-histogram-num-bars 40   set-current-plot-pen \"slow\"   set-histogram-num-bars 40   set-current-plot-pen \"fast\"   set-histogram-num-bars 40   set-current-plot-pen \"init-avg-energy\"   draw-vert-line init-avg-energy end   to do-plotting   set-current-plot \"Pressure vs. Time\"   if length pressure-history > 0     [ plotxy ticks (mean last-n 3 pressure-history) ]    set-current-plot \"Speed Counts\"   set-current-plot-pen \"fast\"   plot fast   set-current-plot-pen \"medium\"   plot medium   set-current-plot-pen \"slow\"   plot slow    if ticks > 1   [      set-current-plot \"Wall Hits per Particle\"      plotxy ticks wall-hits-per-particle   ]    plot-histograms end   to plot-histograms   set-current-plot \"Energy histogram\"   set-current-plot-pen \"fast\"   histogram [ energy ] of particles with [color = red]   set-current-plot-pen \"medium\"   histogram [ energy ] of particles with [color = green]   set-current-plot-pen \"slow\"   histogram [ energy ] of particles with [color = blue]   set-current-plot-pen \"avg-energy\"   plot-pen-reset   draw-vert-line avg-energy    set-current-plot \"Speed histogram\"   set-current-plot-pen \"fast\"   histogram [ speed ] of particles with [color = red]   set-current-plot-pen \"medium\"   histogram [ speed ] of particles with [color = green]   set-current-plot-pen \"slow\"   histogram [ speed ] of particles with [color = blue]   set-current-plot-pen \"avg-speed\"   plot-pen-reset   draw-vert-line avg-speed end  ;; histogram procedure to draw-vert-line [ xval ]   plotxy xval plot-y-min   plot-pen-down   plotxy xval plot-y-max   plot-pen-up end  to-report last-n [n the-list]   ifelse n >= length the-list     [ report the-list ]     [ report last-n n butfirst the-list ] end  to make-clocker   set-default-shape clockers \"clocker\"   create-ordered-clockers 1   [     setxy (box-edge - 5) (box-edge - 5)     set color violet + 2     set size 10     set heading 0   ] end')([{"left":325,"top":11,"right":737,"bottom":424,"dimensions":{"minPxcor":-50,"maxPxcor":50,"minPycor":-50,"maxPycor":50,"patchSize":4,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":7,"top":43,"right":93,"bottom":76,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":7,"top":10,"right":93,"bottom":43,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1000","compiledStep":"1","variable":"number-of-particles","left":95,"top":10,"right":302,"bottom":43,"display":"number-of-particles","min":"0","max":"1000","default":150,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"default","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Pressure vs. Time","left":742,"top":11,"right":980,"bottom":190,"xAxis":"time","yAxis":"pressure","xmin":0,"xmax":20,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"pressure\")","source":"pressure","left":155,"top":207,"right":239,"bottom":252,"display":"pressure","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"wall-hits-per-particle\")","source":"wall-hits-per-particle","left":9,"top":207,"right":149,"bottom":252,"display":"wall hits per particle","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Wall Hits per Particle","left":742,"top":192,"right":980,"bottom":361,"xmin":0,"xmax":20,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"avg-speed\")","source":"avg-speed","left":70,"top":154,"right":149,"bottom":199,"precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"fast","interval":10,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"medium","interval":10,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"slow","interval":10,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"avg-energy","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"init-avg-energy","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Energy Histogram","left":312,"top":455,"right":602,"bottom":651,"xAxis":"Energy","yAxis":"Number","xmin":0,"xmax":400,"ymin":0,"ymax":10,"autoPlotOn":false,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"fast","interval":10,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"medium","interval":10,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"slow","interval":10,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"avg-energy","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"init-avg-energy","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"avg-energy\")","source":"avg-energy","left":154,"top":154,"right":239,"bottom":199,"precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"fast","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"medium","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"slow","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed Counts","left":9,"top":264,"right":298,"bottom":449,"xAxis":"time","yAxis":"count","xmin":0,"xmax":20,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"fast","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"medium","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"slow","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"variable":"collide?","left":96,"top":44,"right":199,"bottom":77,"display":"collide?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"fast","interval":5,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"medium","interval":5,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"slow","interval":5,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"avg-speed","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"init-avg-speed","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed Histogram","left":10,"top":454,"right":304,"bottom":651,"xAxis":"Speed","yAxis":"Number","xmin":0,"xmax":50,"ymin":0,"ymax":100,"autoPlotOn":false,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"fast","interval":5,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"medium","interval":5,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"slow","interval":5,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"avg-speed","interval":1,"mode":0,"color":-7500403,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"init-avg-speed","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"variable":"trace?","left":199,"top":44,"right":302,"bottom":77,"display":"trace?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"20","compiledStep":"1","variable":"init-particle-speed","left":7,"top":80,"right":180,"bottom":113,"display":"init-particle-speed","min":"1","max":"20","default":10,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"20","compiledStep":"1","variable":"particle-mass","left":7,"top":114,"right":180,"bottom":147,"display":"particle-mass","min":"1","max":"20","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_42 = procedures[\"BENCHMARK\"]();   if (_maybestop_33_42 instanceof Exception.StopInterrupt) { return _maybestop_33_42; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"benchmark","left":609,"top":458,"right":780,"bottom":633,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"result\")","source":"result","left":628,"top":579,"right":767,"bottom":624,"precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["number-of-particles", "collide?", "trace?", "init-particle-speed", "particle-mass", "result", "tick-length", "box-edge", "pressure", "pressure-history", "zero-pressure-count", "wall-hits-per-particle", "length-horizontal-surface", "length-vertical-surface", "init-avg-speed", "init-avg-energy", "avg-speed", "avg-energy", "fast", "medium", "slow", "fade-needed?"], ["number-of-particles", "collide?", "trace?", "init-particle-speed", "particle-mass"], [], -50, 50, -50, 50, 4, true, true, turtleShapes, linkShapes, function(){});
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
      workspace.rng.setSeed(361);
      workspace.timer.reset();
      procedures["SETUP"]();
      for (let _index_1113_1119 = 0, _repeatcount_1113_1119 = StrictMath.floor(17000); _index_1113_1119 < _repeatcount_1113_1119; _index_1113_1119++){
        procedures["GO"]();
      }
      world.observer.setGlobal("result", workspace.timer.elapsed());
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["benchmark"] = temp;
  procs["BENCHMARK"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      world.ticker.reset();
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PARTICLES").getSpecialName(), "circle")
      world.observer.setGlobal("fade-needed?", false);
      world.observer.setGlobal("box-edge", (world.topology.maxPxcor - 1));
      world.observer.setGlobal("length-horizontal-surface", ((2 * (world.observer.getGlobal("box-edge") - 1)) + 1));
      world.observer.setGlobal("length-vertical-surface", ((2 * (world.observer.getGlobal("box-edge") - 1)) + 1));
      procedures["MAKE-BOX"]();
      procedures["MAKE-PARTICLES"]();
      procedures["MAKE-CLOCKER"]();
      world.observer.setGlobal("pressure-history", []);
      world.observer.setGlobal("zero-pressure-count", 0);
      procedures["UPDATE-VARIABLES"]();
      world.observer.setGlobal("init-avg-speed", world.observer.getGlobal("avg-speed"));
      world.observer.setGlobal("init-avg-energy", world.observer.getGlobal("avg-energy"));
      procedures["SETUP-PLOTZ"]();
      procedures["SETUP-HISTOGRAMS"]();
      procedures["DO-PLOTTING"]();
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
      world.observer.setGlobal("medium", world.turtleManager.turtlesOfBreed("PARTICLES")._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }));
      world.observer.setGlobal("slow", world.turtleManager.turtlesOfBreed("PARTICLES")._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }));
      world.observer.setGlobal("fast", world.turtleManager.turtlesOfBreed("PARTICLES")._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }));
      world.observer.setGlobal("avg-speed", ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })));
      world.observer.setGlobal("avg-energy", ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("energy"); })));
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
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { procedures["BOUNCE"](); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { procedures["MOVE"](); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() {
        if (world.observer.getGlobal("collide?")) {
          procedures["CHECK-FOR-COLLISION"]();
        }
      }, true);
      if (world.observer.getGlobal("trace?")) {
        Errors.askNobodyCheck(world.turtleManager.getTurtleOfBreed("PARTICLES", 0)).ask(function() {
          SelfManager.self().setPatchVariable("pcolor", 5);
          world.observer.setGlobal("fade-needed?", true);
        }, true);
      }
      let oldClock = world.ticker.tickCount(); letVars['oldClock'] = oldClock;
      world.ticker.tickAdvance(world.observer.getGlobal("tick-length"));
      if (Prims.gt(NLMath.floor(world.ticker.tickCount()), NLMath.floor((world.ticker.tickCount() - world.observer.getGlobal("tick-length"))))) {
        if (!world.turtleManager.turtlesOfBreed("PARTICLES").isEmpty()) {
          world.observer.setGlobal("wall-hits-per-particle", ListPrims.mean(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("wall-hits"); })));
        }
        else {
          world.observer.setGlobal("wall-hits-per-particle", 0);
        }
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().setVariable("wall-hits", 0); }, true);
        if (world.observer.getGlobal("fade-needed?")) {
          procedures["FADE-PATCHES"]();
        }
        procedures["CALCULATE-PRESSURE"]();
        procedures["UPDATE-VARIABLES"]();
        procedures["DO-PLOTTING"]();
      }
      procedures["CALCULATE-TICK-LENGTH"]();
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("CLOCKERS")).ask(function() { SelfManager.self().setVariable("heading", (world.ticker.tickCount() * 360)); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FLASHES").agentFilter(function() { return Prims.gt((world.ticker.tickCount() - SelfManager.self().getVariable("birthday")), 0.4); })).ask(function() {
        SelfManager.self().setPatchVariable("pcolor", 45);
        SelfManager.self().die();
      }, true);
      notImplemented('display', undefined)();
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
      if (world.turtleManager.turtlesOfBreed("PARTICLES")._optimalAnyWith(function() { return Prims.gt(SelfManager.self().getVariable("speed"), 0); })) {
        world.observer.setGlobal("tick-length", Prims.div(1, NLMath.ceil(ListPrims.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })))));
      }
      else {
        world.observer.setGlobal("tick-length", 1);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["calculateTickLength"] = temp;
  procs["CALCULATE-TICK-LENGTH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("pressure", (15 * ListPrims.sum(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("momentum-difference"); }))));
      world.observer.setGlobal("pressure-history", ListPrims.lput(world.observer.getGlobal("pressure"), world.observer.getGlobal("pressure-history")));
      world.observer.setGlobal("zero-pressure-count", ListPrims.length(world.observer.getGlobal("pressure-history").filter(Tasks.reporterTask(function(p) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        return Prims.equality(p, 0);
      }, "[ [p] -> p = 0 ]"))));
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().setVariable("momentum-difference", 0); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["calculatePressure"] = temp;
  procs["CALCULATE-PRESSURE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (ColorModel.areRelatedByShade(45, SelfManager.self().getPatchVariable("pcolor"))) {
        throw new Exception.StopInterrupt;
      }
      let newPatch = SelfManager.self().patchAhead(1); letVars['newPatch'] = newPatch;
      let newPx = newPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); }); letVars['newPx'] = newPx;
      let newPy = newPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }); letVars['newPy'] = newPy;
      if (!ColorModel.areRelatedByShade(45, newPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pcolor"); }))) {
        throw new Exception.StopInterrupt;
      }
      if ((!Prims.equality(NLMath.abs(newPx), world.observer.getGlobal("box-edge")) && !Prims.equality(NLMath.abs(newPy), world.observer.getGlobal("box-edge")))) {
        throw new Exception.StopInterrupt;
      }
      if (Prims.equality(NLMath.abs(newPx), world.observer.getGlobal("box-edge"))) {
        SelfManager.self().setVariable("heading",  -(SelfManager.self().getVariable("heading")));
        SelfManager.self().setVariable("wall-hits", (SelfManager.self().getVariable("wall-hits") + 1));
        SelfManager.self().setVariable("momentum-difference", (SelfManager.self().getVariable("momentum-difference") + Prims.div(NLMath.abs((((NLMath.sin(SelfManager.self().getVariable("heading")) * 2) * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed"))), world.observer.getGlobal("length-vertical-surface"))));
      }
      if (Prims.equality(NLMath.abs(newPy), world.observer.getGlobal("box-edge"))) {
        SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading")));
        SelfManager.self().setVariable("wall-hits", (SelfManager.self().getVariable("wall-hits") + 1));
        SelfManager.self().setVariable("momentum-difference", (SelfManager.self().getVariable("momentum-difference") + Prims.div(NLMath.abs((((NLMath.cos(SelfManager.self().getVariable("heading")) * 2) * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed"))), world.observer.getGlobal("length-horizontal-surface"))));
      }
      Errors.askNobodyCheck(world.getPatchAt(newPx, newPy)).ask(function() {
        SelfManager.self().sprout(1, "FLASHES").ask(function() {
          SelfManager.self().hideTurtle(true);;
          SelfManager.self().setVariable("birthday", world.ticker.tickCount());
          SelfManager.self().setPatchVariable("pcolor", (45 - 3));
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["bounce"] = temp;
  procs["BOUNCE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let oldPatch = SelfManager.self().getPatchHere(); letVars['oldPatch'] = oldPatch;
      SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-length")));
      if (!Prims.equality(SelfManager.self().getPatchHere(), oldPatch)) {
        SelfManager.self().setVariable("last-collision", Nobody);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["move"] = temp;
  procs["MOVE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(SelfPrims._optimalCountOther(SelfManager.self().breedHere("PARTICLES")), 1)) {
        let candidate = ListPrims.oneOf(SelfManager.self().breedHere("PARTICLES")._optimalOtherWith(function() {
          return (Prims.lt(SelfManager.self().getVariable("who"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("who"); })) && !Prims.equality(SelfManager.myself(), SelfManager.self().getVariable("last-collision")));
        })); letVars['candidate'] = candidate;
        if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfManager.self().getVariable("speed"), 0) || Prims.gt(candidate.projectionBy(function() { return SelfManager.self().getVariable("speed"); }), 0)))) {
          procedures["COLLIDE-WITH"](candidate);
          SelfManager.self().setVariable("last-collision", candidate);
          Errors.askNobodyCheck(candidate).ask(function() { SelfManager.self().setVariable("last-collision", SelfManager.myself()); }, true);
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkForCollision"] = temp;
  procs["CHECK-FOR-COLLISION"] = temp;
  temp = (function(otherParticle) {
    try {
      var reporterContext = false;
      var letVars = { };
      let mass2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("mass"); }); letVars['mass2'] = mass2;
      let speed2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("speed"); }); letVars['speed2'] = speed2;
      let heading2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("heading"); }); letVars['heading2'] = heading2;
      let theta = Prims.randomFloat(360); letVars['theta'] = theta;
      let v1t = (SelfManager.self().getVariable("speed") * NLMath.cos((theta - SelfManager.self().getVariable("heading")))); letVars['v1t'] = v1t;
      let v1l = (SelfManager.self().getVariable("speed") * NLMath.sin((theta - SelfManager.self().getVariable("heading")))); letVars['v1l'] = v1l;
      let v2t = (speed2 * NLMath.cos((theta - heading2))); letVars['v2t'] = v2t;
      let v2l = (speed2 * NLMath.sin((theta - heading2))); letVars['v2l'] = v2l;
      let vcm = Prims.div(((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)), (SelfManager.self().getVariable("mass") + mass2)); letVars['vcm'] = vcm;
      v1t = ((2 * vcm) - v1t); letVars['v1t'] = v1t;
      v2t = ((2 * vcm) - v2t); letVars['v2t'] = v2t;
      SelfManager.self().setVariable("speed", NLMath.sqrt(((v1t * v1t) + (v1l * v1l))));
      SelfManager.self().setVariable("energy", (((0.5 * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed")) * SelfManager.self().getVariable("speed")));
      if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
        SelfManager.self().setVariable("heading", (theta - NLMath.atan(v1l, v1t)));
      }
      Errors.askNobodyCheck(otherParticle).ask(function() { SelfManager.self().setVariable("speed", NLMath.sqrt(((v2t * v2t) + (v2l * v2l)))); }, true);
      Errors.askNobodyCheck(otherParticle).ask(function() {
        SelfManager.self().setVariable("energy", (((0.5 * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed")) * SelfManager.self().getVariable("speed")));
      }, true);
      if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
        Errors.askNobodyCheck(otherParticle).ask(function() { SelfManager.self().setVariable("heading", (theta - NLMath.atan(v2l, v2t))); }, true);
      }
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
      if (Prims.lt(SelfManager.self().getVariable("speed"), (0.5 * 10))) {
        SelfManager.self().setVariable("color", 105);
      }
      else {
        if (Prims.gt(SelfManager.self().getVariable("speed"), (1.5 * 10))) {
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
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let tracePatches = world.patches().agentFilter(function() {
        return (!Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 45) && !Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 0));
      }); letVars['tracePatches'] = tracePatches;
      if (!tracePatches.isEmpty()) {
        Errors.askNobodyCheck(tracePatches).ask(function() {
          SelfManager.self().setPatchVariable("pcolor", (SelfManager.self().getPatchVariable("pcolor") - 0.4));
          if ((!world.observer.getGlobal("trace?") || Prims.equality(NLMath.round(SelfManager.self().getPatchVariable("pcolor")), 0))) {
            SelfManager.self().setPatchVariable("pcolor", 0);
          }
        }, true);
      }
      else {
        world.observer.setGlobal("fade-needed?", false);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["fadePatches"] = temp;
  procs["FADE-PATCHES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.patches().agentFilter(function() {
        return ((Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge")) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge"))) || (Prims.equality(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge")) && Prims.lte(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge"))));
      })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeBox"] = temp;
  procs["MAKE-BOX"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createOrderedTurtles(world.observer.getGlobal("number-of-particles"), "PARTICLES").ask(function() {
        procedures["SETUP-PARTICLE"]();
        procedures["RANDOM-POSITION"]();
        procedures["RECOLOR"]();
      }, true);
      procedures["CALCULATE-TICK-LENGTH"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeParticles"] = temp;
  procs["MAKE-PARTICLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("speed", world.observer.getGlobal("init-particle-speed"));
      SelfManager.self().setVariable("mass", world.observer.getGlobal("particle-mass"));
      SelfManager.self().setVariable("energy", (((0.5 * SelfManager.self().getVariable("mass")) * SelfManager.self().getVariable("speed")) * SelfManager.self().getVariable("speed")));
      SelfManager.self().setVariable("last-collision", Nobody);
      SelfManager.self().setVariable("wall-hits", 0);
      SelfManager.self().setVariable("momentum-difference", 0);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupParticle"] = temp;
  procs["SETUP-PARTICLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setXY(((1 - world.observer.getGlobal("box-edge")) + Prims.randomFloat(((2 * world.observer.getGlobal("box-edge")) - 2))), ((1 - world.observer.getGlobal("box-edge")) + Prims.randomFloat(((2 * world.observer.getGlobal("box-edge")) - 2))));
      SelfManager.self().setVariable("heading", Prims.randomFloat(360));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["randomPosition"] = temp;
  procs["RANDOM-POSITION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      plotManager.setCurrentPlot("Speed Counts");
      plotManager.setYRange(0, NLMath.ceil(Prims.div(world.observer.getGlobal("number-of-particles"), 6)));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupPlotz"] = temp;
  procs["SETUP-PLOTZ"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      plotManager.setCurrentPlot("Speed Histogram");
      plotManager.setXRange(0, (world.observer.getGlobal("init-particle-speed") * 2));
      plotManager.setYRange(0, NLMath.ceil(Prims.div(world.observer.getGlobal("number-of-particles"), 6)));
      plotManager.setCurrentPen("medium");
      plotManager.setHistogramBarCount(40);
      plotManager.setCurrentPen("slow");
      plotManager.setHistogramBarCount(40);
      plotManager.setCurrentPen("fast");
      plotManager.setHistogramBarCount(40);
      plotManager.setCurrentPen("init-avg-speed");
      procedures["DRAW-VERT-LINE"](world.observer.getGlobal("init-avg-speed"));
      plotManager.setCurrentPlot("Energy Histogram");
      plotManager.setXRange(0, (((0.5 * (world.observer.getGlobal("init-particle-speed") * 2)) * (world.observer.getGlobal("init-particle-speed") * 2)) * world.observer.getGlobal("particle-mass")));
      plotManager.setYRange(0, NLMath.ceil(Prims.div(world.observer.getGlobal("number-of-particles"), 6)));
      plotManager.setCurrentPen("medium");
      plotManager.setHistogramBarCount(40);
      plotManager.setCurrentPen("slow");
      plotManager.setHistogramBarCount(40);
      plotManager.setCurrentPen("fast");
      plotManager.setHistogramBarCount(40);
      plotManager.setCurrentPen("init-avg-energy");
      procedures["DRAW-VERT-LINE"](world.observer.getGlobal("init-avg-energy"));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupHistograms"] = temp;
  procs["SETUP-HISTOGRAMS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      plotManager.setCurrentPlot("Pressure vs. Time");
      if (Prims.gt(ListPrims.length(world.observer.getGlobal("pressure-history")), 0)) {
        plotManager.plotPoint(world.ticker.tickCount(), ListPrims.mean(procedures["LAST-N"](3,world.observer.getGlobal("pressure-history"))));
      }
      plotManager.setCurrentPlot("Speed Counts");
      plotManager.setCurrentPen("fast");
      plotManager.plotValue(world.observer.getGlobal("fast"));
      plotManager.setCurrentPen("medium");
      plotManager.plotValue(world.observer.getGlobal("medium"));
      plotManager.setCurrentPen("slow");
      plotManager.plotValue(world.observer.getGlobal("slow"));
      if (Prims.gt(world.ticker.tickCount(), 1)) {
        plotManager.setCurrentPlot("Wall Hits per Particle");
        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("wall-hits-per-particle"));
      }
      procedures["PLOT-HISTOGRAMS"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["doPlotting"] = temp;
  procs["DO-PLOTTING"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      plotManager.setCurrentPlot("Energy histogram");
      plotManager.setCurrentPen("fast");
      plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).projectionBy(function() { return SelfManager.self().getVariable("energy"); }));
      plotManager.setCurrentPen("medium");
      plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).projectionBy(function() { return SelfManager.self().getVariable("energy"); }));
      plotManager.setCurrentPen("slow");
      plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).projectionBy(function() { return SelfManager.self().getVariable("energy"); }));
      plotManager.setCurrentPen("avg-energy");
      plotManager.resetPen();
      procedures["DRAW-VERT-LINE"](world.observer.getGlobal("avg-energy"));
      plotManager.setCurrentPlot("Speed histogram");
      plotManager.setCurrentPen("fast");
      plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
      plotManager.setCurrentPen("medium");
      plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
      plotManager.setCurrentPen("slow");
      plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("PARTICLES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
      plotManager.setCurrentPen("avg-speed");
      plotManager.resetPen();
      procedures["DRAW-VERT-LINE"](world.observer.getGlobal("avg-speed"));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["plotHistograms"] = temp;
  procs["PLOT-HISTOGRAMS"] = temp;
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
  temp = (function(n, theList) {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.gte(n, ListPrims.length(theList))) {
        Errors.reportInContextCheck(reporterContext);
        return theList;
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return procedures["LAST-N"](n,ListPrims.butFirst(theList));
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["lastN"] = temp;
  procs["LAST-N"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("CLOCKERS").getSpecialName(), "clocker")
      world.turtleManager.createOrderedTurtles(1, "CLOCKERS").ask(function() {
        SelfManager.self().setXY((world.observer.getGlobal("box-edge") - 5), (world.observer.getGlobal("box-edge") - 5));
        SelfManager.self().setVariable("color", (115 + 2));
        SelfManager.self().setVariable("size", 10);
        SelfManager.self().setVariable("heading", 0);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeClocker"] = temp;
  procs["MAKE-CLOCKER"] = temp;
  return procs;
})();
world.observer.setGlobal("number-of-particles", 150);
world.observer.setGlobal("collide?", true);
world.observer.setGlobal("trace?", true);
world.observer.setGlobal("init-particle-speed", 10);
world.observer.setGlobal("particle-mass", 5);