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

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":30,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":270,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Class Plot';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('low', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Class Plot', 'low')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).size());
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
  new PenBundle.Pen('mid', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Class Plot', 'mid')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).size());
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
  new PenBundle.Pen('up', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Class Plot', 'up')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).size());
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
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Class Plot', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, world.observer.getGlobal("num-people"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Turtles", true, true, 0, 50, 0, 250, setup, update);
})(), (function() {
  var name    = 'Class Histogram';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Class Histogram', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.resetPen();
          plotManager.setPenColor(15);
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 15); }).size());
          plotManager.setPenColor(55);
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 55); }).size());
          plotManager.setPenColor(105);
          plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("color"), 105); }).size());
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
  var setup   = function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Class Histogram', undefined)(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.setYRange(0, world.observer.getGlobal("num-people"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  };
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Classes", "Turtles", false, false, 0, 3, 0, 250, setup, update);
})(), (function() {
  var name    = 'Lorenz Curve';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('lorenz', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Lorenz Curve', 'lorenz')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.resetPen();
          plotManager.setPenInterval(Prims.div(100, world.observer.getGlobal("num-people")));
          plotManager.plotValue(0);
          var _foreach_94_101 = Tasks.forEach(Tasks.commandTask(function(_0) {
            if (arguments.length < 1) {
              throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
            }
            plotManager.plotValue(_0);
          }, "plot"), world.observer.getGlobal("lorenz-points")); if(reporterContext && _foreach_94_101 !== undefined) { return _foreach_94_101; }
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
  new PenBundle.Pen('equal', plotOps.makePenOps, false, new PenBundle.State(0, 100, PenBundle.DisplayMode.Line), function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Lorenz Curve', 'equal')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(0);
          plotManager.plotValue(100);
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Pop %", "Wealth %", true, false, 0, 100, 0, 100, setup, update);
})(), (function() {
  var name    = 'Gini-Index v. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Gini-Index v. Time', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(Prims.div(Prims.div(world.observer.getGlobal("gini-index-reserve"), world.observer.getGlobal("num-people")), 0.5));
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
  return new Plot(name, pens, plotOps, "Time", "Gini", false, true, 0, 50, 0, 1, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["age", "wealth", "life-expectancy", "metabolism", "vision"], [])('globals [   max-grain    ; maximum amount any patch can hold   gini-index-reserve   lorenz-points ]  patches-own [   grain-here      ; the current amount of grain on this patch   max-grain-here  ; the maximum amount of grain this patch can hold ]  turtles-own [   age              ; how old a turtle is   wealth           ; the amount of grain a turtle has   life-expectancy  ; maximum age that a turtle can reach   metabolism       ; how much grain a turtle eats each time   vision           ; how many patches ahead a turtle can see ]  ;;; ;;; SETUP AND HELPERS ;;;  to setup   clear-all   ;; set global variables to appropriate values   set max-grain 50   ;; call other procedures to set up various parts of the world   setup-patches   setup-turtles   update-lorenz-and-gini   reset-ticks end  ;; set up the initial amounts of grain each patch has to setup-patches   ;; give some patches the highest amount of grain possible --   ;; these patches are the \"best land\"   ask patches     [ set max-grain-here 0       if (random-float 100) <= percent-best-land         [ set max-grain-here max-grain           set grain-here max-grain-here ] ]   ;; spread that grain around the window a little and put a little back   ;; into the patches that are the \"best land\" found above   repeat 5     [ ask patches with [max-grain-here != 0]         [ set grain-here max-grain-here ]       diffuse grain-here 0.25 ]   repeat 10     [ diffuse grain-here 0.25 ]          ;; spread the grain around some more   ask patches     [ set grain-here floor grain-here    ;; round grain levels to whole numbers       set max-grain-here grain-here      ;; initial grain level is also maximum       recolor-patch ] end  to recolor-patch  ;; patch procedure -- use color to indicate grain level   set pcolor scale-color yellow grain-here 0 max-grain end  ;; set up the initial values for the turtle variables to setup-turtles   set-default-shape turtles \"person\"   create-turtles num-people     [ move-to one-of patches  ;; put turtles on patch centers       set size 1.5  ;; easier to see       set-initial-turtle-vars       set age random life-expectancy ]   recolor-turtles end  to set-initial-turtle-vars   set age 0   face one-of neighbors4   set life-expectancy life-expectancy-min +                         random (life-expectancy-max - life-expectancy-min + 1)   set metabolism 1 + random metabolism-max   set wealth metabolism + random 50   set vision 1 + random max-vision end  ;; Set the class of the turtles -- if a turtle has less than a third ;; the wealth of the richest turtle, color it red.  If between one ;; and two thirds, color it green.  If over two thirds, color it blue. to recolor-turtles   let max-wealth max [wealth] of turtles   ask turtles     [ ifelse (wealth <= max-wealth / 3)         [ set color red ]         [ ifelse (wealth <= (max-wealth * 2 / 3))             [ set color green ]             [ set color blue ] ] ] end  ;;; ;;; GO AND HELPERS ;;;  to go   ask turtles     [ turn-towards-grain ]  ;; choose direction holding most grain within the turtle\'s vision   harvest   ask turtles     [ move-eat-age-die ]   recolor-turtles    ;; grow grain every grain-growth-interval clock ticks   if ticks mod grain-growth-interval = 0     [ ask patches [ grow-grain ] ]    update-lorenz-and-gini   tick end  ;; determine the direction which is most profitable for each turtle in ;; the surrounding patches within the turtles\' vision to turn-towards-grain  ;; turtle procedure   set heading 0   let best-direction 0   let best-amount grain-ahead   set heading 90   if (grain-ahead > best-amount)     [ set best-direction 90       set best-amount grain-ahead ]   set heading 180   if (grain-ahead > best-amount)     [ set best-direction 180       set best-amount grain-ahead ]   set heading 270   if (grain-ahead > best-amount)     [ set best-direction 270       set best-amount grain-ahead ]   set heading best-direction end  to-report grain-ahead  ;; turtle procedure   let total 0   let how-far 1   repeat vision     [ set total total + [grain-here] of patch-ahead how-far       set how-far how-far + 1 ]   report total end  to grow-grain  ;; patch procedure   ;; if a patch does not have it\'s maximum amount of grain, add   ;; num-grain-grown to its grain amount   if (grain-here < max-grain-here)     [ set grain-here grain-here + num-grain-grown       ;; if the new amount of grain on a patch is over its maximum       ;; capacity, set it to its maximum       if (grain-here > max-grain-here)         [ set grain-here max-grain-here ]       recolor-patch ] end  ;; each turtle harvests the grain on its patch.  if there are multiple ;; turtles on a patch, divide the grain evenly among the turtles to harvest   ; have turtles harvest before any turtle sets the patch to 0   ask turtles     [ set wealth floor (wealth + (grain-here / (count turtles-here))) ]   ;; now that the grain has been harvested, have the turtles make the   ;; patches which they are on have no grain   ask turtles     [ set grain-here 0       recolor-patch ] end  to move-eat-age-die  ;; turtle procedure   fd 1   ;; consume some grain according to metabolism   set wealth (wealth - metabolism)   ;; grow older   set age (age + 1)   ;; check for death conditions: if you have no grain or   ;; you\'re older than the life expectancy or if some random factor   ;; holds, then you \"die\" and are \"reborn\" (in fact, your variables   ;; are just reset to new random values)   if (wealth < 0) or (age >= life-expectancy)     [ set-initial-turtle-vars ] end  ;; this procedure recomputes the value of gini-index-reserve ;; and the points in lorenz-points for the Lorenz and Gini-Index plots to update-lorenz-and-gini   let sorted-wealths sort [wealth] of turtles   let total-wealth sum sorted-wealths   let wealth-sum-so-far 0   let index 0   set gini-index-reserve 0   set lorenz-points []    ;; now actually plot the Lorenz curve -- along the way, we also   ;; calculate the Gini index.   ;; (see the Info tab for a description of the curve and measure)   repeat num-people [     set wealth-sum-so-far (wealth-sum-so-far + item index sorted-wealths)     set lorenz-points lput ((wealth-sum-so-far / total-wealth) * 100) lorenz-points     set index (index + 1)     set gini-index-reserve       gini-index-reserve +       (index / num-people) -       (wealth-sum-so-far / total-wealth)   ] end   ; Copyright 1998 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":184,"top":10,"right":600,"bottom":427,"dimensions":{"minPxcor":-25,"maxPxcor":25,"minPycor":-25,"maxPycor":25,"patchSize":8,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"setup","left":8,"top":256,"right":84,"bottom":289,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"go","left":105,"top":256,"right":175,"bottom":289,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"15","compiledStep":"1","variable":"max-vision","left":8,"top":72,"right":176,"bottom":105,"display":"max-vision","min":"1","max":"15","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"10","compiledStep":"1","variable":"grain-growth-interval","left":8,"top":301,"right":176,"bottom":334,"display":"grain-growth-interval","min":"1","max":"10","default":1,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"25","compiledStep":"1","variable":"metabolism-max","left":8,"top":106,"right":176,"bottom":139,"display":"metabolism-max","min":"1","max":"25","default":15,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"2","compiledMax":"1000","compiledStep":"1","variable":"num-people","left":8,"top":38,"right":176,"bottom":71,"display":"num-people","min":"2","max":"1000","default":250,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"5","compiledMax":"25","compiledStep":"1","variable":"percent-best-land","left":8,"top":208,"right":176,"bottom":241,"display":"percent-best-land","min":"5","max":"25","default":10,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"100","compiledStep":"1","variable":"life-expectancy-max","left":8,"top":174,"right":176,"bottom":207,"display":"life-expectancy-max","min":"1","max":"100","default":83,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Class Plot', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setYRange(0, world.observer.getGlobal(\"num-people\"));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Class Plot', 'low')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 15); }).size());       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"low","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = red]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Class Plot', 'mid')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 55); }).size());       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"mid","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = green]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Class Plot', 'up')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 105); }).size());       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"up","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = blue]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Class Plot","left":3,"top":454,"right":255,"bottom":634,"xAxis":"Time","yAxis":"Turtles","xmin":0,"xmax":50,"ymin":0,"ymax":250,"autoPlotOn":true,"legendOn":true,"setupCode":"set-plot-y-range 0 num-people","updateCode":"","pens":[{"display":"low","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = red]","type":"pen"},{"display":"mid","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = green]","type":"pen"},{"display":"up","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [color = blue]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"10","compiledStep":"1","variable":"num-grain-grown","left":8,"top":335,"right":176,"bottom":368,"display":"num-grain-grown","min":"1","max":"10","default":4,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"100","compiledStep":"1","variable":"life-expectancy-min","left":8,"top":140,"right":176,"bottom":173,"display":"life-expectancy-min","min":"1","max":"100","default":1,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Class Histogram', undefined)(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.setYRange(0, world.observer.getGlobal(\"num-people\"));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Class Histogram', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.resetPen();         plotManager.setPenColor(15);         plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 15); }).size());         plotManager.setPenColor(55);         plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 55); }).size());         plotManager.setPenColor(105);         plotManager.plotValue(world.turtles().agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"color\"), 105); }).size());       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"default","interval":1,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset set-plot-pen-color red plot count turtles with [color = red] set-plot-pen-color green plot count turtles with [color = green] set-plot-pen-color blue plot count turtles with [color = blue]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Class Histogram","left":257,"top":454,"right":469,"bottom":634,"xAxis":"Classes","yAxis":"Turtles","xmin":0,"xmax":3,"ymin":0,"ymax":250,"autoPlotOn":false,"legendOn":false,"setupCode":"set-plot-y-range 0 num-people","updateCode":"","pens":[{"display":"default","interval":1,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset set-plot-pen-color red plot count turtles with [color = red] set-plot-pen-color green plot count turtles with [color = green] set-plot-pen-color blue plot count turtles with [color = blue]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Lorenz Curve', 'lorenz')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.resetPen();         plotManager.setPenInterval(Prims.div(100, world.observer.getGlobal(\"num-people\")));         plotManager.plotValue(0);         var _foreach_94_101 = Tasks.forEach(Tasks.commandTask(function(_0) {           if (arguments.length < 1) {             throw new Error(\"anonymous procedure expected 1 input, but only got \" + arguments.length);           }           plotManager.plotValue(_0);         }, \"plot\"), world.observer.getGlobal(\"lorenz-points\")); if(reporterContext && _foreach_94_101 !== undefined) { return _foreach_94_101; }       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"lorenz","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset set-plot-pen-interval 100 / num-people plot 0 foreach lorenz-points plot","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Lorenz Curve', 'equal')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(0);         plotManager.plotValue(100);       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","compiledUpdateCode":"function() {}","display":"equal","interval":100,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"plot 0 plot 100","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Lorenz Curve","left":471,"top":454,"right":672,"bottom":634,"xAxis":"Pop %","yAxis":"Wealth %","xmin":0,"xmax":100,"ymin":0,"ymax":100,"autoPlotOn":false,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"lorenz","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot-pen-reset set-plot-pen-interval 100 / num-people plot 0 foreach lorenz-points plot","type":"pen"},{"display":"equal","interval":100,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"plot 0 plot 100","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Gini-Index v. Time', 'default')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(Prims.div(Prims.div(world.observer.getGlobal(\"gini-index-reserve\"), world.observer.getGlobal(\"num-people\")), 0.5));       } catch (e) {         if (e instanceof Exception.StopInterrupt) {           return e;         } else {           throw e;         }       };     });   }); }","display":"default","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot (gini-index-reserve / num-people) / 0.5","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Gini-Index v. Time","left":674,"top":454,"right":908,"bottom":634,"xAxis":"Time","yAxis":"Gini","xmin":0,"xmax":50,"ymin":0,"ymax":1,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"plot (gini-index-reserve / num-people) / 0.5","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["max-vision", "grain-growth-interval", "metabolism-max", "num-people", "percent-best-land", "life-expectancy-max", "num-grain-grown", "life-expectancy-min", "max-grain", "gini-index-reserve", "lorenz-points"], ["max-vision", "grain-growth-interval", "metabolism-max", "num-people", "percent-best-land", "life-expectancy-max", "num-grain-grown", "life-expectancy-min"], ["grain-here", "max-grain-here"], -25, 25, -25, 25, 8, true, true, turtleShapes, linkShapes, function(){});
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
      world.observer.setGlobal("max-grain", 50);
      procedures["SETUP-PATCHES"]();
      procedures["SETUP-TURTLES"]();
      procedures["UPDATE-LORENZ-AND-GINI"]();
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
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("max-grain-here", 0);
        if (Prims.lte(Prims.randomFloat(100), world.observer.getGlobal("percent-best-land"))) {
          SelfManager.self().setPatchVariable("max-grain-here", world.observer.getGlobal("max-grain"));
          SelfManager.self().setPatchVariable("grain-here", SelfManager.self().getPatchVariable("max-grain-here"));
        }
      }, true);
      for (let _index_1278_1284 = 0, _repeatcount_1278_1284 = StrictMath.floor(5); _index_1278_1284 < _repeatcount_1278_1284; _index_1278_1284++){
        world.patches().agentFilter(function() { return !Prims.equality(SelfManager.self().getPatchVariable("max-grain-here"), 0); }).ask(function() {
          SelfManager.self().setPatchVariable("grain-here", SelfManager.self().getPatchVariable("max-grain-here"));
        }, true);
        world.topology.diffuse("grain-here", 0.25, false)
      }
      for (let _index_1408_1414 = 0, _repeatcount_1408_1414 = StrictMath.floor(10); _index_1408_1414 < _repeatcount_1408_1414; _index_1408_1414++){
        world.topology.diffuse("grain-here", 0.25, false)
      }
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("grain-here", NLMath.floor(SelfManager.self().getPatchVariable("grain-here")));
        SelfManager.self().setPatchVariable("max-grain-here", SelfManager.self().getPatchVariable("grain-here"));
        procedures["RECOLOR-PATCH"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupPatches"] = temp;
  procs["SETUP-PATCHES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("pcolor", ColorModel.scaleColor(45, SelfManager.self().getPatchVariable("grain-here"), 0, world.observer.getGlobal("max-grain")));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["recolorPatch"] = temp;
  procs["RECOLOR-PATCH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      BreedManager.setDefaultShape(world.turtles().getSpecialName(), "person")
      world.turtleManager.createTurtles(world.observer.getGlobal("num-people"), "").ask(function() {
        SelfManager.self().moveTo(ListPrims.oneOf(world.patches()));
        SelfManager.self().setVariable("size", 1.5);
        procedures["SET-INITIAL-TURTLE-VARS"]();
        SelfManager.self().setVariable("age", Prims.random(SelfManager.self().getVariable("life-expectancy")));
      }, true);
      procedures["RECOLOR-TURTLES"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupTurtles"] = temp;
  procs["SETUP-TURTLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("age", 0);
      SelfManager.self().face(ListPrims.oneOf(SelfManager.self().getNeighbors4()));
      SelfManager.self().setVariable("life-expectancy", (world.observer.getGlobal("life-expectancy-min") + Prims.random(((world.observer.getGlobal("life-expectancy-max") - world.observer.getGlobal("life-expectancy-min")) + 1))));
      SelfManager.self().setVariable("metabolism", (1 + Prims.random(world.observer.getGlobal("metabolism-max"))));
      SelfManager.self().setVariable("wealth", (SelfManager.self().getVariable("metabolism") + Prims.random(50)));
      SelfManager.self().setVariable("vision", (1 + Prims.random(world.observer.getGlobal("max-vision"))));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setInitialTurtleVars"] = temp;
  procs["SET-INITIAL-TURTLE-VARS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let maxWealth = ListPrims.max(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("wealth"); })); letVars['maxWealth'] = maxWealth;
      world.turtles().ask(function() {
        if (Prims.lte(SelfManager.self().getVariable("wealth"), Prims.div(maxWealth, 3))) {
          SelfManager.self().setVariable("color", 15);
        }
        else {
          if (Prims.lte(SelfManager.self().getVariable("wealth"), Prims.div((maxWealth * 2), 3))) {
            SelfManager.self().setVariable("color", 55);
          }
          else {
            SelfManager.self().setVariable("color", 105);
          }
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
  procs["recolorTurtles"] = temp;
  procs["RECOLOR-TURTLES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtles().ask(function() { procedures["TURN-TOWARDS-GRAIN"](); }, true);
      procedures["HARVEST"]();
      world.turtles().ask(function() { procedures["MOVE-EAT-AGE-DIE"](); }, true);
      procedures["RECOLOR-TURTLES"]();
      if (Prims.equality(NLMath.mod(world.ticker.tickCount(), world.observer.getGlobal("grain-growth-interval")), 0)) {
        world.patches().ask(function() { procedures["GROW-GRAIN"](); }, true);
      }
      procedures["UPDATE-LORENZ-AND-GINI"]();
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
      SelfManager.self().setVariable("heading", 0);
      let bestDirection = 0; letVars['bestDirection'] = bestDirection;
      let bestAmount = procedures["GRAIN-AHEAD"](); letVars['bestAmount'] = bestAmount;
      SelfManager.self().setVariable("heading", 90);
      if (Prims.gt(procedures["GRAIN-AHEAD"](), bestAmount)) {
        bestDirection = 90; letVars['bestDirection'] = bestDirection;
        bestAmount = procedures["GRAIN-AHEAD"](); letVars['bestAmount'] = bestAmount;
      }
      SelfManager.self().setVariable("heading", 180);
      if (Prims.gt(procedures["GRAIN-AHEAD"](), bestAmount)) {
        bestDirection = 180; letVars['bestDirection'] = bestDirection;
        bestAmount = procedures["GRAIN-AHEAD"](); letVars['bestAmount'] = bestAmount;
      }
      SelfManager.self().setVariable("heading", 270);
      if (Prims.gt(procedures["GRAIN-AHEAD"](), bestAmount)) {
        bestDirection = 270; letVars['bestDirection'] = bestDirection;
        bestAmount = procedures["GRAIN-AHEAD"](); letVars['bestAmount'] = bestAmount;
      }
      SelfManager.self().setVariable("heading", bestDirection);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["turnTowardsGrain"] = temp;
  procs["TURN-TOWARDS-GRAIN"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let total = 0; letVars['total'] = total;
      let howFar = 1; letVars['howFar'] = howFar;
      for (let _index_4005_4011 = 0, _repeatcount_4005_4011 = StrictMath.floor(SelfManager.self().getVariable("vision")); _index_4005_4011 < _repeatcount_4005_4011; _index_4005_4011++){
        total = (total + SelfManager.self().patchAhead(howFar).projectionBy(function() { return SelfManager.self().getPatchVariable("grain-here"); })); letVars['total'] = total;
        howFar = (howFar + 1); letVars['howFar'] = howFar;
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return total
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
  procs["grainAhead"] = temp;
  procs["GRAIN-AHEAD"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(SelfManager.self().getPatchVariable("grain-here"), SelfManager.self().getPatchVariable("max-grain-here"))) {
        SelfManager.self().setPatchVariable("grain-here", (SelfManager.self().getPatchVariable("grain-here") + world.observer.getGlobal("num-grain-grown")));
        if (Prims.gt(SelfManager.self().getPatchVariable("grain-here"), SelfManager.self().getPatchVariable("max-grain-here"))) {
          SelfManager.self().setPatchVariable("grain-here", SelfManager.self().getPatchVariable("max-grain-here"));
        }
        procedures["RECOLOR-PATCH"]();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["growGrain"] = temp;
  procs["GROW-GRAIN"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtles().ask(function() {
        SelfManager.self().setVariable("wealth", NLMath.floor((SelfManager.self().getVariable("wealth") + Prims.div(SelfManager.self().getPatchVariable("grain-here"), SelfManager.self().turtlesHere().size()))));
      }, true);
      world.turtles().ask(function() {
        SelfManager.self().setPatchVariable("grain-here", 0);
        procedures["RECOLOR-PATCH"]();
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["harvest"] = temp;
  procs["HARVEST"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self()._optimalFdOne();
      SelfManager.self().setVariable("wealth", (SelfManager.self().getVariable("wealth") - SelfManager.self().getVariable("metabolism")));
      SelfManager.self().setVariable("age", (SelfManager.self().getVariable("age") + 1));
      if ((Prims.lt(SelfManager.self().getVariable("wealth"), 0) || Prims.gte(SelfManager.self().getVariable("age"), SelfManager.self().getVariable("life-expectancy")))) {
        procedures["SET-INITIAL-TURTLE-VARS"]();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["moveEatAgeDie"] = temp;
  procs["MOVE-EAT-AGE-DIE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let sortedWealths = ListPrims.sort(world.turtles().projectionBy(function() { return SelfManager.self().getVariable("wealth"); })); letVars['sortedWealths'] = sortedWealths;
      let totalWealth = ListPrims.sum(sortedWealths); letVars['totalWealth'] = totalWealth;
      let wealthSumSoFar = 0; letVars['wealthSumSoFar'] = wealthSumSoFar;
      let index = 0; letVars['index'] = index;
      world.observer.setGlobal("gini-index-reserve", 0);
      world.observer.setGlobal("lorenz-points", []);
      for (let _index_6031_6037 = 0, _repeatcount_6031_6037 = StrictMath.floor(world.observer.getGlobal("num-people")); _index_6031_6037 < _repeatcount_6031_6037; _index_6031_6037++){
        wealthSumSoFar = (wealthSumSoFar + ListPrims.item(index, sortedWealths)); letVars['wealthSumSoFar'] = wealthSumSoFar;
        world.observer.setGlobal("lorenz-points", ListPrims.lput((Prims.div(wealthSumSoFar, totalWealth) * 100), world.observer.getGlobal("lorenz-points")));
        index = (index + 1); letVars['index'] = index;
        world.observer.setGlobal("gini-index-reserve", ((world.observer.getGlobal("gini-index-reserve") + Prims.div(index, world.observer.getGlobal("num-people"))) - Prims.div(wealthSumSoFar, totalWealth)));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateLorenzAndGini"] = temp;
  procs["UPDATE-LORENZ-AND-GINI"] = temp;
  return procs;
})();
world.observer.setGlobal("max-vision", 5);
world.observer.setGlobal("grain-growth-interval", 1);
world.observer.setGlobal("metabolism-max", 15);
world.observer.setGlobal("num-people", 250);
world.observer.setGlobal("percent-best-land", 10);
world.observer.setGlobal("life-expectancy-max", 83);
world.observer.setGlobal("num-grain-grown", 4);
world.observer.setGlobal("life-expectancy-min", 1);