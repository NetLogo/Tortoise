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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"sheep":{"name":"sheep","editableColorIndex":15,"rotate":false,"elements":[{"xmin":90,"ymin":75,"xmax":270,"ymax":225,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":15,"y":75,"diam":150,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xmin":81,"ymin":225,"xmax":134,"ymax":286,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":180,"ymin":225,"xmax":238,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":1,"y":88,"diam":92,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"wolf":{"name":"wolf","editableColorIndex":0,"rotate":false,"elements":[{"xmin":15,"ymin":105,"xmax":105,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":45,"ymin":90,"xmax":105,"ymax":105,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[60,83,104],"ycors":[90,44,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[67,82,97],"ycors":[90,59,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":48,"ymin":93,"xmax":59,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xmin":51,"ymin":96,"xmax":55,"ymax":101,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":0,"ymin":121,"xmax":15,"ymax":135,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":15,"ymin":136,"xmax":60,"ymax":151,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,23,31],"ycors":[136,149,136],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,37,43],"ycors":[151,136,151],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xmin":105,"ymin":120,"xmax":263,"ymax":195,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":108,"ymin":195,"xmax":259,"ymax":201,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":114,"ymin":201,"xmax":252,"ymax":210,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":243,"ymax":214,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":115,"ymin":114,"xmax":255,"ymax":120,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":128,"ymin":108,"xmax":248,"ymax":114,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":150,"ymin":105,"xmax":225,"ymax":108,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":132,"ymin":214,"xmax":155,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":110,"ymin":260,"xmax":132,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":210,"ymin":214,"xmax":232,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":189,"ymin":260,"xmax":210,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":263,"y1":127,"x2":281,"y2":155,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":281,"y1":155,"x2":281,"y2":192,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'populations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('sheep', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('wolves', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('grass / 4', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "pop.", false, true, 0, 100, 0, 100, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "SHEEP", singular: "a-sheep", varNames: [] }, { name: "WOLVES", singular: "wolf", varNames: [] }])(["energy", "prey"], [])('globals [ result ] breed [ sheep a-sheep ] breed [ wolves wolf ] turtles-own [ energy prey ] patches-own [ countdown ]  to benchmark   random-seed 579   setup   reset-timer   repeat 10000 [ go ]   set result timer end  to setup   ca reset-ticks   ask patches [ set pcolor green ]   if grass? [       ;; indicates whether the grass switch is on       ;; if it is true, then grass grows and the sheep eat it       ;; if it false, then the sheep don\'t need to eat     ask patches [       set countdown random grass-delay ;; initialize grass grow clocks randomly       if (random 2) = 0  ;;half the patches start out with grass           [ set pcolor brown ]     ]   ]    create-ordered-sheep init-sheep  ;; create the sheep, then initialize their variables   ask sheep   [     set color white     set energy random-float (2 * sheep-metabolism)     set shape \"sheep\"     setxy random world-width random world-height   ]    create-ordered-wolves init-wolves  ;; create the wolves, then initialize their variables   ask wolves   [     set color black     set energy random-float (2 * wolf-metabolism)     set shape \"wolf\"     setxy random world-width random world-height   ]    if plot? [ graph ] end  to go   ask sheep [     move     if grass? [       set energy energy - 1  ;; deduct energy for sheep only if grass? switch is on       eat-grass     ]     reproduce-sheep     death   ]   ask wolves [     move     set energy energy - 1  ;; wolves lose energy as they move     catch-sheep     reproduce-wolves     death   ]   if grass? [ ask patches [ grow-grass ] ]   if plot? [ graph ] ;; plot populations   tick   if (count turtles = 0) [ stop ] end  to move  ;; turtle procedure   rt random 50 - random 50   fd 1 end  to eat-grass  ;; sheep procedure   ;; sheep eat grass, turn the patch brown   if pcolor = green [     set pcolor brown     set energy energy + sheep-metabolism  ;; sheep gain energy by eating   ] end  to reproduce-sheep  ;; sheep procedure   if random-float 100 < sheep-reproduce [  ;; throw \"dice\" to see if you will reproduce     set energy round (energy / 2 )   ;; divide energy between parent and offspring     hatch 1 [ rt random 360 fd 1 ]   ;; hatch an offspring and move it forward 1 step   ] end  to reproduce-wolves  ;; wolf procedure   if random-float 100 < wolf-reproduce [  ;; throw \"dice\" to see if you will reproduce     set energy round (energy / 2 )  ;; divide energy between parent and offspring     hatch 1 [ rt random 360 fd 1 ]  ;; hatch an offspring and move it forward 1 step   ] end  to catch-sheep  ;; wolf procedure   set prey one-of sheep-here  ;;set prey to ID of one of the sheep in your patch   if (prey != nobody) [              ;;check if prey represents a sheep (there is no sheep with ID = -1)     ask prey [ set energy -1 ]       ;; sheep will then die on next tick     set energy energy + wolf-metabolism    ;;get energy from sheep   ] end  to death  ;; turtle procedure   ;; when energy dips below zero, die   if energy < 0 [ die ] end  to grow-grass  ;; patch procedure   ;; countdown on brown patches, if reach 0, grow some grass   if pcolor = brown [     ifelse countdown <= 0       [ set pcolor green         set countdown grass-delay ]       [ set countdown (countdown - 1) ]   ] end  to graph   set-current-plot-pen \"sheep\"   plot count sheep   set-current-plot-pen \"wolves\"   plot count wolves   if grass? [     set-current-plot-pen \"grass / 4\"     plot count patches with [ pcolor = green ] / 4  ;; divide by four to keep it within similar                                                 ;; range as wolf and sheep populations   ] end')([{"left":331,"top":10,"right":669,"bottom":369,"dimensions":{"minPxcor":-20,"maxPxcor":20,"minPycor":-20,"maxPycor":20,"patchSize":8,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"250","compiledStep":"1","variable":"init-sheep","left":5,"top":213,"right":168,"bottom":246,"display":"init-sheep","min":"0","max":"250","default":82,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"sheep-metabolism","left":5,"top":244,"right":168,"bottom":277,"display":"sheep-metabolism","min":"0","max":"50","default":4,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"20","compiledStep":"1","variable":"sheep-reproduce","left":5,"top":275,"right":168,"bottom":308,"display":"sheep-reproduce","min":"1","max":"20","default":4,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"250","compiledStep":"1","variable":"init-wolves","left":172,"top":214,"right":326,"bottom":247,"display":"init-wolves","min":"0","max":"250","default":49,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"wolf-metabolism","left":172,"top":244,"right":326,"bottom":277,"display":"wolf-metabolism","min":"0","max":"100","default":20,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"20","compiledStep":"1","variable":"wolf-reproduce","left":172,"top":275,"right":326,"bottom":308,"display":"wolf-reproduce","min":"0","max":"20","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"grass?","left":6,"top":148,"right":100,"bottom":181,"display":"grass?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"grass-delay","left":104,"top":148,"right":317,"bottom":181,"display":"grass-delay","min":"0","max":"100","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":26,"top":53,"right":95,"bottom":86,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":108,"top":53,"right":168,"bottom":86,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"sheep","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"wolves","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"grass / 4","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"populations","left":18,"top":364,"right":319,"bottom":545,"xAxis":"time","yAxis":"pop.","xmin":0,"xmax":100,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"sheep","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"wolves","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"grass / 4","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"SHEEP\").size()","source":"count sheep","left":32,"top":311,"right":114,"bottom":356,"display":"sheep","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"WOLVES\").size()","source":"count wolves","left":125,"top":311,"right":207,"bottom":356,"display":"wolves","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Sheep settings","left":9,"top":191,"right":149,"bottom":210,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Wolf settings","left":178,"top":190,"right":291,"bottom":208,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Grass settings","left":10,"top":129,"right":162,"bottom":147,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_42 = procedures[\"BENCHMARK\"]();   if (_maybestop_33_42 instanceof Exception.StopInterrupt) { return _maybestop_33_42; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"benchmark","left":177,"top":10,"right":292,"bottom":143,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"plot?","left":224,"top":321,"right":314,"bottom":354,"display":"plot?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"result\")","source":"result","left":184,"top":92,"right":284,"bottom":137,"precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["init-sheep", "sheep-metabolism", "sheep-reproduce", "init-wolves", "wolf-metabolism", "wolf-reproduce", "grass?", "grass-delay", "plot?", "result"], ["init-sheep", "sheep-metabolism", "sheep-reproduce", "init-wolves", "wolf-metabolism", "wolf-reproduce", "grass?", "grass-delay", "plot?"], ["countdown"], -20, 20, -20, 20, 8, true, true, turtleShapes, linkShapes, function(){});
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
      workspace.rng.setSeed(579);
      procedures["SETUP"]();
      workspace.timer.reset();
      for (let _index_175_181 = 0, _repeatcount_175_181 = StrictMath.floor(10000); _index_175_181 < _repeatcount_175_181; _index_175_181++){
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
      Errors.askNobodyCheck(world.patches()).ask(function() { SelfManager.self().setPatchVariable("pcolor", 55); }, true);
      if (world.observer.getGlobal("grass?")) {
        Errors.askNobodyCheck(world.patches()).ask(function() {
          SelfManager.self().setPatchVariable("countdown", Prims.random(world.observer.getGlobal("grass-delay")));
          if (Prims.equality(Prims.randomLong(2), 0)) {
            SelfManager.self().setPatchVariable("pcolor", 35);
          }
        }, true);
      }
      world.turtleManager.createOrderedTurtles(world.observer.getGlobal("init-sheep"), "SHEEP");
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SHEEP")).ask(function() {
        SelfManager.self().setVariable("color", 9.9);
        SelfManager.self().setVariable("energy", Prims.randomFloat((2 * world.observer.getGlobal("sheep-metabolism"))));
        SelfManager.self().setVariable("shape", "sheep");
        SelfManager.self().setXY(Prims.random(world.topology.width), Prims.random(world.topology.height));
      }, true);
      world.turtleManager.createOrderedTurtles(world.observer.getGlobal("init-wolves"), "WOLVES");
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("WOLVES")).ask(function() {
        SelfManager.self().setVariable("color", 0);
        SelfManager.self().setVariable("energy", Prims.randomFloat((2 * world.observer.getGlobal("wolf-metabolism"))));
        SelfManager.self().setVariable("shape", "wolf");
        SelfManager.self().setXY(Prims.random(world.topology.width), Prims.random(world.topology.height));
      }, true);
      if (world.observer.getGlobal("plot?")) {
        procedures["GRAPH"]();
      }
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
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SHEEP")).ask(function() {
        procedures["MOVE"]();
        if (world.observer.getGlobal("grass?")) {
          SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") - 1));
          procedures["EAT-GRASS"]();
        }
        procedures["REPRODUCE-SHEEP"]();
        procedures["DEATH"]();
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("WOLVES")).ask(function() {
        procedures["MOVE"]();
        SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") - 1));
        procedures["CATCH-SHEEP"]();
        procedures["REPRODUCE-WOLVES"]();
        procedures["DEATH"]();
      }, true);
      if (world.observer.getGlobal("grass?")) {
        Errors.askNobodyCheck(world.patches()).ask(function() { procedures["GROW-GRASS"](); }, true);
      }
      if (world.observer.getGlobal("plot?")) {
        procedures["GRAPH"]();
      }
      world.ticker.tick();
      if (world.turtles()._optimalCheckCount(0, (a, b) => a === b)) {
        throw new Exception.StopInterrupt;
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
      SelfManager.self().right((Prims.randomLong(50) - Prims.randomLong(50)));
      SelfManager.self()._optimalFdOne();
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
      if (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 55)) {
        SelfManager.self().setPatchVariable("pcolor", 35);
        SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") + world.observer.getGlobal("sheep-metabolism")));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["eatGrass"] = temp;
  procs["EAT-GRASS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(Prims.randomFloat(100), world.observer.getGlobal("sheep-reproduce"))) {
        SelfManager.self().setVariable("energy", NLMath.round(Prims.div(SelfManager.self().getVariable("energy"), 2)));
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().right(Prims.randomLong(360));
          SelfManager.self()._optimalFdOne();
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["reproduceSheep"] = temp;
  procs["REPRODUCE-SHEEP"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(Prims.randomFloat(100), world.observer.getGlobal("wolf-reproduce"))) {
        SelfManager.self().setVariable("energy", NLMath.round(Prims.div(SelfManager.self().getVariable("energy"), 2)));
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().right(Prims.randomLong(360));
          SelfManager.self()._optimalFdOne();
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["reproduceWolves"] = temp;
  procs["REPRODUCE-WOLVES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("prey", ListPrims.oneOf(SelfManager.self().breedHere("SHEEP")));
      if (!Prims.equality(SelfManager.self().getVariable("prey"), Nobody)) {
        Errors.askNobodyCheck(SelfManager.self().getVariable("prey")).ask(function() { SelfManager.self().setVariable("energy", -1); }, true);
        SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") + world.observer.getGlobal("wolf-metabolism")));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["catchSheep"] = temp;
  procs["CATCH-SHEEP"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(SelfManager.self().getVariable("energy"), 0)) {
        SelfManager.self().die();
      }
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
      if (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 35)) {
        if (Prims.lte(SelfManager.self().getPatchVariable("countdown"), 0)) {
          SelfManager.self().setPatchVariable("pcolor", 55);
          SelfManager.self().setPatchVariable("countdown", world.observer.getGlobal("grass-delay"));
        }
        else {
          SelfManager.self().setPatchVariable("countdown", (SelfManager.self().getPatchVariable("countdown") - 1));
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["growGrass"] = temp;
  procs["GROW-GRASS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      plotManager.setCurrentPen("sheep");
      plotManager.plotValue(world.turtleManager.turtlesOfBreed("SHEEP").size());
      plotManager.setCurrentPen("wolves");
      plotManager.plotValue(world.turtleManager.turtlesOfBreed("WOLVES").size());
      if (world.observer.getGlobal("grass?")) {
        plotManager.setCurrentPen("grass / 4");
        plotManager.plotValue(Prims.div(world.patches()._optimalCountWith(function() { return Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 55); }), 4));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["graph"] = temp;
  procs["GRAPH"] = temp;
  return procs;
})();
world.observer.setGlobal("init-sheep", 82);
world.observer.setGlobal("sheep-metabolism", 4);
world.observer.setGlobal("sheep-reproduce", 4);
world.observer.setGlobal("init-wolves", 49);
world.observer.setGlobal("wolf-metabolism", 20);
world.observer.setGlobal("wolf-reproduce", 5);
world.observer.setGlobal("grass?", true);
world.observer.setGlobal("grass-delay", 30);
world.observer.setGlobal("plot?", false);