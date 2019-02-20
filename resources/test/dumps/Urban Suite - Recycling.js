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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Population';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('recyclers', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Population', 'recyclers')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtleManager.turtlesOfBreed("RECYCLERS").size());
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
  new PenBundle.Pen('wastefuls', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Population', 'wastefuls')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtleManager.turtlesOfBreed("WASTEFULS").size());
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
  return new Plot(name, pens, plotOps, "ticks", "# of developers", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Land Use';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('new', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Land Use', 'new')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue((Prims.div(world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "new"); }).size(), world.patches().size()) * 100));
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
  new PenBundle.Pen('recycled', plotOps.makePenOps, false, new PenBundle.State(65, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Land Use', 'recycled')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue((Prims.div(world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "recycled"); }).size(), world.patches().size()) * 100));
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
  new PenBundle.Pen('waste', plotOps.makePenOps, false, new PenBundle.State(44, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Land Use', 'waste')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue((Prims.div(world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "waste"); }).size(), world.patches().size()) * 100));
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
  return new Plot(name, pens, plotOps, "ticks", "percent", false, true, 0, 10, 0, 100, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "RECYCLERS", singular: "recycler", varNames: [] }, { name: "WASTEFULS", singular: "wasteful", varNames: [] }])(["energy"], [])('turtles-own [ energy ] patches-own [ resource-type ]  breed [ recyclers recycler ] breed [ wastefuls wasteful ]  to setup   clear-all   set-default-shape turtles \"person\"   create-recyclers num-recyclers [     set color blue   ]   create-wastefuls num-wastefuls [     set color red   ]   ask turtles [     set size 1.5  ;; easier to see     setxy random-pxcor random-pycor     set energy max-stored-energy / 2   ]   ask patches [     set resource-type \"new\"     update-patch   ]   reset-ticks end   to go   ask recyclers [     recycler-process-patch   ]   ask wastefuls   [     wasteful-process-patch   ]   ask turtles [     move     if (energy > max-stored-energy)       [ set energy max-stored-energy ]     if energy < 0       [ die ]   ]    ifelse (show-energy?)     [ ask turtles [ set label (round energy) ] ]     [ ask turtles [ set label \"\" ] ]    update-environment   ask patches [ update-patch ]   tick end  to move  ;; turtle procedure   let target-patch one-of neighbors   if (agents-seek-resources?)   [     let candidate-moves neighbors with [ resource-type = \"new\" ]     ifelse any? candidate-moves       [ set target-patch one-of candidate-moves ]     [       set candidate-moves neighbors with [ resource-type = \"recycled\" ]       if any? candidate-moves         [ set target-patch one-of candidate-moves ]     ]   ]   face target-patch   move-to target-patch    set energy (energy - 1) end  to recycler-process-patch   ifelse (resource-type = \"new\" )   [     if (energy <= max-stored-energy - 2)       [ set energy energy + 2 ]   ]   [     ifelse (resource-type = \"recycled\" )     [       if (energy <= max-stored-energy - 1)       [         set energy energy + 1       ]     ]     [       set energy energy - recycling-waste-cost       set resource-type \"recycled\"     ]   ] end  to wasteful-process-patch   ifelse (resource-type = \"new\" )   [     if (energy <= max-stored-energy - 4)     [       set energy energy + 4      set resource-type \"waste\"     ]   ]   [     if (resource-type = \"recycled\")     [       if (energy <= max-stored-energy - 2)       [         set energy energy + 2         set resource-type \"waste\"       ]     ]   ]   ; if resource-type is \"waste\", then we gain nothing.  end  to update-patch   ifelse (resource-type = \"new\")     [ set pcolor green ]   [ ifelse (resource-type = \"recycled\")       [ set pcolor lime ]       [ set pcolor yellow - 1 ]   ] end  to update-environment   ask patches with [ resource-type = \"recycled\" ]   [     if random 100 < (resource-regeneration / 10)       [ set resource-type \"new\" ]   ]   ; waste is less likely to be renewed naturally by the environment   ; in this model, we arbitrarily assume 5 times less likely   ask patches with [ resource-type = \"waste\" ]   [     if (random 5 = 0) and (random 100 < (resource-regeneration / 10))       [ set resource-type \"new\" ]   ] end   ; Copyright 2007 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":195,"top":10,"right":623,"bottom":439,"dimensions":{"minPxcor":-17,"maxPxcor":17,"minPycor":-17,"maxPycor":17,"patchSize":12,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"setup","left":55,"top":30,"right":130,"bottom":63,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"go","left":105,"top":75,"right":180,"bottom":108,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"num-recyclers","left":5,"top":120,"right":180,"bottom":153,"display":"num-recyclers","min":"0","max":"50","default":25,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"num-wastefuls","left":5,"top":160,"right":180,"bottom":193,"display":"num-wastefuls","min":"0","max":"50","default":25,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"show-energy?","left":5,"top":410,"right":180,"bottom":443,"display":"show-energy?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"2","compiledStep":"0.25","variable":"recycling-waste-cost","left":5,"top":255,"right":180,"bottom":288,"display":"recycling-waste-cost","min":"0","max":"2","default":0.5,"step":"0.25","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"resource-regeneration","left":5,"top":295,"right":180,"bottom":328,"display":"resource-regeneration","min":"0","max":"100","default":25,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"10","compiledMax":"100","compiledStep":"5","variable":"max-stored-energy","left":5,"top":215,"right":180,"bottom":248,"display":"max-stored-energy","min":"10","max":"100","default":50,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"RECYCLERS\").size()","source":"count recyclers","left":635,"top":35,"right":732,"bottom":80,"display":"recyclers (blue)","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"WASTEFULS\").size()","source":"count wastefuls","left":740,"top":35,"right":840,"bottom":80,"display":"wastefuls (red)","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"agents-seek-resources?","left":0,"top":350,"right":185,"bottom":383,"display":"agents-seek-resources?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Population', 'recyclers')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtleManager.turtlesOfBreed(\"RECYCLERS\").size());       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"recyclers","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot count recyclers","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Population', 'wastefuls')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtleManager.turtlesOfBreed(\"WASTEFULS\").size());       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"wastefuls","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count wastefuls","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Population","left":635,"top":95,"right":840,"bottom":245,"xAxis":"ticks","yAxis":"# of developers","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"recyclers","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot count recyclers","type":"pen"},{"display":"wastefuls","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count wastefuls","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Land Use', 'new')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue((Prims.div(world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable(\"resource-type\"), \"new\"); }).size(), world.patches().size()) * 100));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"new","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot (count patches with [ resource-type = \"new\" ]) / count patches * 100","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Land Use', 'recycled')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue((Prims.div(world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable(\"resource-type\"), \"recycled\"); }).size(), world.patches().size()) * 100));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"recycled","interval":1,"mode":0,"color":-13840069,"inLegend":true,"setupCode":"","updateCode":"plot (count patches with [ resource-type = \"recycled\" ]) / count patches * 100","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Land Use', 'waste')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue((Prims.div(world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable(\"resource-type\"), \"waste\"); }).size(), world.patches().size()) * 100));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"waste","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plot (count patches with [ resource-type = \"waste\" ]) / count patches * 100","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Land Use","left":635,"top":270,"right":840,"bottom":420,"xAxis":"ticks","yAxis":"percent","xmin":0,"xmax":10,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"new","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot (count patches with [ resource-type = \"new\" ]) / count patches * 100","type":"pen"},{"display":"recycled","interval":1,"mode":0,"color":-13840069,"inLegend":true,"setupCode":"","updateCode":"plot (count patches with [ resource-type = \"recycled\" ]) / count patches * 100","type":"pen"},{"display":"waste","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plot (count patches with [ resource-type = \"waste\" ]) / count patches * 100","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"go","left":5,"top":75,"right":77,"bottom":108,"display":"go once","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["num-recyclers", "num-wastefuls", "show-energy?", "recycling-waste-cost", "resource-regeneration", "max-stored-energy", "agents-seek-resources?"], ["num-recyclers", "num-wastefuls", "show-energy?", "recycling-waste-cost", "resource-regeneration", "max-stored-energy", "agents-seek-resources?"], ["resource-type"], -17, 17, -17, 17, 12, true, true, turtleShapes, linkShapes, function(){});
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
      BreedManager.setDefaultShape(world.turtles().getSpecialName(), "person")
      world.turtleManager.createTurtles(world.observer.getGlobal("num-recyclers"), "RECYCLERS").ask(function() { SelfManager.self().setVariable("color", 105); }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("num-wastefuls"), "WASTEFULS").ask(function() { SelfManager.self().setVariable("color", 15); }, true);
      world.turtles().ask(function() {
        SelfManager.self().setVariable("size", 1.5);
        SelfManager.self().setXY(Prims.randomPatchCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomPatchCoord(world.topology.minPycor, world.topology.maxPycor));
        SelfManager.self().setVariable("energy", Prims.div(world.observer.getGlobal("max-stored-energy"), 2));
      }, true);
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("resource-type", "new");
        procedures["UPDATE-PATCH"]();
      }, true);
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
      world.turtleManager.turtlesOfBreed("RECYCLERS").ask(function() { procedures["RECYCLER-PROCESS-PATCH"](); }, true);
      world.turtleManager.turtlesOfBreed("WASTEFULS").ask(function() { procedures["WASTEFUL-PROCESS-PATCH"](); }, true);
      world.turtles().ask(function() {
        procedures["MOVE"]();
        if (Prims.gt(SelfManager.self().getVariable("energy"), world.observer.getGlobal("max-stored-energy"))) {
          SelfManager.self().setVariable("energy", world.observer.getGlobal("max-stored-energy"));
        }
        if (Prims.lt(SelfManager.self().getVariable("energy"), 0)) {
          SelfManager.self().die();
        }
      }, true);
      if (world.observer.getGlobal("show-energy?")) {
        world.turtles().ask(function() { SelfManager.self().setVariable("label", NLMath.round(SelfManager.self().getVariable("energy"))); }, true);
      }
      else {
        world.turtles().ask(function() { SelfManager.self().setVariable("label", ""); }, true);
      }
      procedures["UPDATE-ENVIRONMENT"]();
      world.patches().ask(function() { procedures["UPDATE-PATCH"](); }, true);
      world.ticker.tick();
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
      let targetPatch = ListPrims.oneOf(SelfManager.self().getNeighbors()); letVars['targetPatch'] = targetPatch;
      if (world.observer.getGlobal("agents-seek-resources?")) {
        let candidateMoves = SelfManager.self().getNeighbors().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "new"); }); letVars['candidateMoves'] = candidateMoves;
        if (!candidateMoves.isEmpty()) {
          targetPatch = ListPrims.oneOf(candidateMoves); letVars['targetPatch'] = targetPatch;
        }
        else {
          candidateMoves = SelfManager.self().getNeighbors().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "recycled"); }); letVars['candidateMoves'] = candidateMoves;
          if (!candidateMoves.isEmpty()) {
            targetPatch = ListPrims.oneOf(candidateMoves); letVars['targetPatch'] = targetPatch;
          }
        }
      }
      SelfManager.self().face(targetPatch);
      SelfManager.self().moveTo(targetPatch);
      SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") - 1));
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
      if (Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "new")) {
        if (Prims.lte(SelfManager.self().getVariable("energy"), (world.observer.getGlobal("max-stored-energy") - 2))) {
          SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") + 2));
        }
      }
      else {
        if (Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "recycled")) {
          if (Prims.lte(SelfManager.self().getVariable("energy"), (world.observer.getGlobal("max-stored-energy") - 1))) {
            SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") + 1));
          }
        }
        else {
          SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") - world.observer.getGlobal("recycling-waste-cost")));
          SelfManager.self().setPatchVariable("resource-type", "recycled");
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
  procs["recyclerProcessPatch"] = temp;
  procs["RECYCLER-PROCESS-PATCH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "new")) {
        if (Prims.lte(SelfManager.self().getVariable("energy"), (world.observer.getGlobal("max-stored-energy") - 4))) {
          SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") + 4));
          SelfManager.self().setPatchVariable("resource-type", "waste");
        }
      }
      else {
        if (Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "recycled")) {
          if (Prims.lte(SelfManager.self().getVariable("energy"), (world.observer.getGlobal("max-stored-energy") - 2))) {
            SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") + 2));
            SelfManager.self().setPatchVariable("resource-type", "waste");
          }
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
  procs["wastefulProcessPatch"] = temp;
  procs["WASTEFUL-PROCESS-PATCH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "new")) {
        SelfManager.self().setPatchVariable("pcolor", 55);
      }
      else {
        if (Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "recycled")) {
          SelfManager.self().setPatchVariable("pcolor", 65);
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", (45 - 1));
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
  procs["updatePatch"] = temp;
  procs["UPDATE-PATCH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "recycled"); }).ask(function() {
        if (Prims.lt(Prims.random(100), Prims.div(world.observer.getGlobal("resource-regeneration"), 10))) {
          SelfManager.self().setPatchVariable("resource-type", "new");
        }
      }, true);
      world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("resource-type"), "waste"); }).ask(function() {
        if ((Prims.equality(Prims.random(5), 0) && Prims.lt(Prims.random(100), Prims.div(world.observer.getGlobal("resource-regeneration"), 10)))) {
          SelfManager.self().setPatchVariable("resource-type", "new");
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
  procs["updateEnvironment"] = temp;
  procs["UPDATE-ENVIRONMENT"] = temp;
  return procs;
})();
world.observer.setGlobal("num-recyclers", 25);
world.observer.setGlobal("num-wastefuls", 25);
world.observer.setGlobal("show-energy?", true);
world.observer.setGlobal("recycling-waste-cost", 0.5);
world.observer.setGlobal("resource-regeneration", 25);
world.observer.setGlobal("max-stored-energy", 50);
world.observer.setGlobal("agents-seek-resources?", false);