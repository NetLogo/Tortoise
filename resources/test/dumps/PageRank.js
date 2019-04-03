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

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]},"curved":{"name":"curved","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":105,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":195,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":1,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PAGES", singular: "page", varNames: ["rank", "new-rank", "visits"] }, { name: "SURFERS", singular: "surfer", varNames: ["current-page"] }])([], [])('breed [ pages page ] breed [ surfers surfer ]  pages-own [   rank new-rank ; for the diffusion approach   visits ; for the random-surfer approach ]  surfers-own [ current-page ]  globals [ total-rank max-rank ]  ;; ;; Setup Procedures ;;  to setup   clear-all   set-default-shape pages \"circle\"    ifelse network-choice = \"Example 1\"   [ create-network-example-1 ][     ifelse network-choice = \"Example 2\"     [ create-network-example-2 ][       ifelse network-choice = \"Preferential Attachment\"       [ create-network-preferential 100 2 ]       [ user-message word \"Error: unknown network-choice: \" network-choice ] ] ]    ask patches [ set pcolor white ]   ask pages   [ set rank 1 / count pages ]   update-globals   ask pages   [     setxy random-xcor random-ycor     set label-color black     update-page-appearance   ]    repeat 300 [ do-layout ]    ask links [ set shape \"curved\" ]   reset-ticks end  to create-network-example-1   create-pages 11   ask page 0 [ set color blue create-link-from page 3 ]   ask page 1 [ set color red create-links-from (turtle-set page 2 page 3 page 4 page 5 page 6 page 7 page 8 ) ]   ask page 2 [ set color orange create-link-from page 1 ]   ask page 3 [ set color green create-link-from page 4 ]   ask page 4 [ set color yellow create-links-from (turtle-set page 5 page 6 page 7 page 8 page 9 page 10) ]   ask page 5 [ set color green create-link-from page 4 ]   ask pages with [who > 5] [ set color violet ] end  to create-network-example-2   create-pages 8   ask page 0 [ die ]   ask page 1 [ create-links-from (turtle-set page 2 page 3 page 5 page 6) ]   ask page 2 [ create-links-from (turtle-set page 1 page 3 page 4) ]   ask page 3 [ create-links-from (turtle-set page 1 page 4 page 5) ]   ask page 4 [ create-links-from (turtle-set page 1 page 5) ]   ask page 5 [ create-links-from (turtle-set page 1 page 4 page 6 page 7) ]   ask page 6 [ create-links-from (turtle-set page 5) ]   ask page 7 [ create-links-from (turtle-set page 1) ] end  to create-network-preferential [ n k ]   create-pages n [ set color sky ]   link-preferentially pages k end  ; The parameter k (always an integer) gives the number of edges to add at ; each step (e.g. k=1 builds a tree) to link-preferentially [nodeset k]   ;; get the nodes in sorted order   let node-list sort nodeset    ;; get a sublist of the nodes from 0 to k   let neighbor-choice-list sublist node-list 0 k    ;; ask the kth node...   ask item k node-list   [     ;; to make a link either to or from each preceding     ;; node in the sorted list.     foreach neighbor-choice-list [ neighbor ->       ifelse random 2 = 0         [ create-link-to neighbor ]         [ create-link-from neighbor ]     ]     ;; add k copies of this node to the beginning of the sublist     set neighbor-choice-list sentence (n-values k [self]) neighbor-choice-list   ]    ;; ask each node after the kth node in order...   foreach sublist node-list (k + 1) (length node-list) [ node ->     ask node [       ;; ...to make k links       let temp-neighbor-list neighbor-choice-list       repeat k       [         ;; link to one of the nodes in the neighbor list         ;; we remove that node from the list once it\'s been linked to         ;; however, there may be more than one copy of some nodes         ;; since those nodes have a higher probability of being linked to         let neighbor one-of temp-neighbor-list         set temp-neighbor-list remove neighbor temp-neighbor-list         ;; when we\'ve linked to a node put another copy of it on the         ;; master neighbor choice list as it\'s now more likely to be         ;; linked to again         set neighbor-choice-list fput neighbor neighbor-choice-list         ifelse random 2 = 0           [ create-link-to neighbor ]           [ create-link-from neighbor ]       ]       set neighbor-choice-list sentence (n-values k [self]) neighbor-choice-list     ]   ] end  to do-layout   layout-spring pages links 0.2 20 / (sqrt count pages) 0.5 end  ;; ;; Runtime Procedures ;;  to go   ifelse calculation-method = \"diffusion\"   [     if any? surfers [ ask surfers [ die ] ] ;; remove surfers if the calculation-method is changed      ;; return links and pages to initial state     ask links [ set color gray set thickness 0 ]     ask pages [ set new-rank 0 ]      ask pages     [       ifelse any? out-link-neighbors       [         ;; if a node has any out-links divide current rank         ;; equally among them.         let rank-increment rank / count out-link-neighbors         ask out-link-neighbors [           set new-rank new-rank + rank-increment         ]       ]       [         ;; if a node has no out-links divide current         ;; rank equally among all the nodes         let rank-increment rank / count pages         ask pages [           set new-rank new-rank + rank-increment         ]       ]     ]      ask pages     [       ;; set current rank to the new-rank and take the damping-factor into account       set rank (1 - damping-factor) / count pages + damping-factor * new-rank     ]   ]   [ ;;; \"random-surfer\" calculation-method     ; surfers are created or destroyed on the fly if users move the     ; NUMBER-OF-SURFERS slider while the model is running.     if count surfers < number-of-surfers     [       create-surfers number-of-surfers - count surfers       [         set current-page one-of pages         ifelse watch-surfers?         [ move-surfer ]         [ hide-turtle ]       ]     ]     if count surfers > number-of-surfers     [       ask n-of (count surfers - number-of-surfers) surfers         [ die ]     ]     ;; return links to their initial state     ask links [ set color gray set thickness 0 ]      ask surfers [       let old-page current-page       ;; increment the visits on the page we\'re on       ask current-page [ set visits visits + 1 ]       ;; with a probability depending on the damping-factor either go to a       ;; random page or a random one of the pages that this page is linked to       ifelse random-float 1 <= damping-factor and any? [my-out-links] of current-page       [ set current-page one-of [out-link-neighbors] of current-page ]       [ set current-page one-of pages ]        ;; update the visualization       ifelse watch-surfers?       [         show-turtle         move-surfer         let surfer-color color         ask old-page [           let traveled-link out-link-to [current-page] of myself           if traveled-link != nobody [             ask traveled-link [ set color surfer-color set thickness 0.08 ]           ]         ]       ]       [ hide-turtle ]     ]     ;; update the rank of each page     let total-visits sum [visits] of pages     ask pages [       set rank visits / total-visits     ]   ]    update-globals   ask pages [ update-page-appearance ]   tick end  to move-surfer ;; surfer procedure   face current-page   move-to current-page end  to update-globals   set total-rank sum [rank] of pages   set max-rank max [rank] of pages end  to update-page-appearance ;; page procedure   ; keep size between 0.1 and 5   set size 0.2 + 4 * sqrt (rank / total-rank)   ifelse show-page-ranks?   [ set label word (precision rank 3) \"     \" ]   [ set label \"\" ] end   ; Copyright 2009 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":255,"top":10,"right":683,"bottom":439,"dimensions":{"minPxcor":-10,"maxPxcor":10,"minPycor":-10,"maxPycor":10,"patchSize":20,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"setup","left":15,"top":95,"right":90,"bottom":128,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"go","left":170,"top":95,"right":240,"bottom":128,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.01","variable":"damping-factor","left":25,"top":165,"right":225,"bottom":198,"display":"damping-factor","min":"0","max":"1.00","default":0.85,"step":"0.01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"calculation-method","left":25,"top":235,"right":225,"bottom":280,"display":"calculation-method","choices":["diffusion","random-surfer"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"watch-surfers?","left":35,"top":370,"right":215,"bottom":403,"display":"watch-surfers?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"100","compiledStep":"1","variable":"number-of-surfers","left":25,"top":285,"right":225,"bottom":318,"display":"number-of-surfers","min":"1","max":"100","default":5,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"network-choice","left":15,"top":35,"right":240,"bottom":80,"display":"network-choice","choices":["Example 1","Example 2","Preferential Attachment"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"show-page-ranks?","left":35,"top":415,"right":215,"bottom":448,"display":"show-page-ranks?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   if (e instanceof Exception.StopInterrupt) {     return e;   } else {     throw e;   } }","source":"go","left":95,"top":95,"right":165,"bottom":128,"display":"step","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["damping-factor", "calculation-method", "watch-surfers?", "number-of-surfers", "network-choice", "show-page-ranks?", "total-rank", "max-rank"], ["damping-factor", "calculation-method", "watch-surfers?", "number-of-surfers", "network-choice", "show-page-ranks?"], [], -10, 10, -10, 10, 20, false, false, turtleShapes, linkShapes, function(){});
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
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PAGES").getSpecialName(), "circle")
      if (Prims.equality(world.observer.getGlobal("network-choice"), "Example 1")) {
        procedures["CREATE-NETWORK-EXAMPLE-1"]();
      }
      else {
        if (Prims.equality(world.observer.getGlobal("network-choice"), "Example 2")) {
          procedures["CREATE-NETWORK-EXAMPLE-2"]();
        }
        else {
          if (Prims.equality(world.observer.getGlobal("network-choice"), "Preferential Attachment")) {
            procedures["CREATE-NETWORK-PREFERENTIAL"](100,2);
          }
          else {
            UserDialogPrims.confirm((workspace.dump('') + workspace.dump("Error: unknown network-choice: ") + workspace.dump(world.observer.getGlobal("network-choice"))));
          }
        }
      }
      world.patches().ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
      world.turtleManager.turtlesOfBreed("PAGES").ask(function() {
        SelfManager.self().setVariable("rank", Prims.div(1, world.turtleManager.turtlesOfBreed("PAGES").size()));
      }, true);
      procedures["UPDATE-GLOBALS"]();
      world.turtleManager.turtlesOfBreed("PAGES").ask(function() {
        SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor));
        SelfManager.self().setVariable("label-color", 0);
        procedures["UPDATE-PAGE-APPEARANCE"]();
      }, true);
      for (let _index_827_833 = 0, _repeatcount_827_833 = StrictMath.floor(300); _index_827_833 < _repeatcount_827_833; _index_827_833++){
        procedures["DO-LAYOUT"]();
      }
      world.links().ask(function() { SelfManager.self().setVariable("shape", "curved"); }, true);
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
      world.turtleManager.createTurtles(11, "PAGES");
      world.turtleManager.getTurtleOfBreed("PAGES", 0).ask(function() {
        SelfManager.self().setVariable("color", 105);
        LinkPrims.createLinkFrom(world.turtleManager.getTurtleOfBreed("PAGES", 3), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 1).ask(function() {
        SelfManager.self().setVariable("color", 15);
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 2), world.turtleManager.getTurtleOfBreed("PAGES", 3), world.turtleManager.getTurtleOfBreed("PAGES", 4), world.turtleManager.getTurtleOfBreed("PAGES", 5), world.turtleManager.getTurtleOfBreed("PAGES", 6), world.turtleManager.getTurtleOfBreed("PAGES", 7), world.turtleManager.getTurtleOfBreed("PAGES", 8)), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 2).ask(function() {
        SelfManager.self().setVariable("color", 25);
        LinkPrims.createLinkFrom(world.turtleManager.getTurtleOfBreed("PAGES", 1), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 3).ask(function() {
        SelfManager.self().setVariable("color", 55);
        LinkPrims.createLinkFrom(world.turtleManager.getTurtleOfBreed("PAGES", 4), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 4).ask(function() {
        SelfManager.self().setVariable("color", 45);
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 5), world.turtleManager.getTurtleOfBreed("PAGES", 6), world.turtleManager.getTurtleOfBreed("PAGES", 7), world.turtleManager.getTurtleOfBreed("PAGES", 8), world.turtleManager.getTurtleOfBreed("PAGES", 9), world.turtleManager.getTurtleOfBreed("PAGES", 10)), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 5).ask(function() {
        SelfManager.self().setVariable("color", 55);
        LinkPrims.createLinkFrom(world.turtleManager.getTurtleOfBreed("PAGES", 4), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.turtlesOfBreed("PAGES").agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("who"), 5); }).ask(function() { SelfManager.self().setVariable("color", 115); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["createNetworkExample1"] = temp;
  procs["CREATE-NETWORK-EXAMPLE-1"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(8, "PAGES");
      world.turtleManager.getTurtleOfBreed("PAGES", 0).ask(function() { SelfManager.self().die(); }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 1).ask(function() {
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 2), world.turtleManager.getTurtleOfBreed("PAGES", 3), world.turtleManager.getTurtleOfBreed("PAGES", 5), world.turtleManager.getTurtleOfBreed("PAGES", 6)), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 2).ask(function() {
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 1), world.turtleManager.getTurtleOfBreed("PAGES", 3), world.turtleManager.getTurtleOfBreed("PAGES", 4)), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 3).ask(function() {
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 1), world.turtleManager.getTurtleOfBreed("PAGES", 4), world.turtleManager.getTurtleOfBreed("PAGES", 5)), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 4).ask(function() {
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 1), world.turtleManager.getTurtleOfBreed("PAGES", 5)), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 5).ask(function() {
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 1), world.turtleManager.getTurtleOfBreed("PAGES", 4), world.turtleManager.getTurtleOfBreed("PAGES", 6), world.turtleManager.getTurtleOfBreed("PAGES", 7)), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 6).ask(function() {
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 5)), "LINKS").ask(function() {}, false);
      }, true);
      world.turtleManager.getTurtleOfBreed("PAGES", 7).ask(function() {
        LinkPrims.createLinksFrom(Prims.turtleSet(world.turtleManager.getTurtleOfBreed("PAGES", 1)), "LINKS").ask(function() {}, false);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["createNetworkExample2"] = temp;
  procs["CREATE-NETWORK-EXAMPLE-2"] = temp;
  temp = (function(n, k) {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(n, "PAGES").ask(function() { SelfManager.self().setVariable("color", 95); }, true);
      procedures["LINK-PREFERENTIALLY"](world.turtleManager.turtlesOfBreed("PAGES"),k);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["createNetworkPreferential"] = temp;
  procs["CREATE-NETWORK-PREFERENTIAL"] = temp;
  temp = (function(nodeset, k) {
    try {
      var reporterContext = false;
      var letVars = { };
      let nodeList = ListPrims.sort(nodeset); letVars['nodeList'] = nodeList;
      let neighborChoiceList = ListPrims.sublist(nodeList, 0, k); letVars['neighborChoiceList'] = neighborChoiceList;
      ListPrims.item(k, nodeList).ask(function() {
        var _foreach_2544_2551 = Tasks.forEach(Tasks.commandTask(function(neighbor) {
          if (arguments.length < 1) {
            throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
          }
          if (Prims.equality(Prims.random(2), 0)) {
            LinkPrims.createLinkTo(neighbor, "LINKS").ask(function() {}, false);
          }
          else {
            LinkPrims.createLinkFrom(neighbor, "LINKS").ask(function() {}, false);
          }
        }, "[ neighbor -> ifelse random 2 = 0 [ create-link-to neighbor ] [ create-link-from neighbor ] ]"), neighborChoiceList); if(reporterContext && _foreach_2544_2551 !== undefined) { return _foreach_2544_2551; }
        neighborChoiceList = ListPrims.sentence(Tasks.nValues(k, Tasks.reporterTask(function() { return SelfManager.self(); }, "[ self ]")), neighborChoiceList); letVars['neighborChoiceList'] = neighborChoiceList;
      }, true);
      var _foreach_2894_2901 = Tasks.forEach(Tasks.commandTask(function(node) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        node.ask(function() {
          let tempNeighborList = neighborChoiceList; letVars['tempNeighborList'] = tempNeighborList;
          for (let _index_3056_3062 = 0, _repeatcount_3056_3062 = StrictMath.floor(k); _index_3056_3062 < _repeatcount_3056_3062; _index_3056_3062++){
            let neighbor = ListPrims.oneOf(tempNeighborList); letVars['neighbor'] = neighbor;
            tempNeighborList = ListPrims.remove(neighbor, tempNeighborList); letVars['tempNeighborList'] = tempNeighborList;
            neighborChoiceList = ListPrims.fput(neighbor, neighborChoiceList); letVars['neighborChoiceList'] = neighborChoiceList;
            if (Prims.equality(Prims.random(2), 0)) {
              LinkPrims.createLinkTo(neighbor, "LINKS").ask(function() {}, false);
            }
            else {
              LinkPrims.createLinkFrom(neighbor, "LINKS").ask(function() {}, false);
            }
          }
          neighborChoiceList = ListPrims.sentence(Tasks.nValues(k, Tasks.reporterTask(function() { return SelfManager.self(); }, "[ self ]")), neighborChoiceList); letVars['neighborChoiceList'] = neighborChoiceList;
        }, true);
      }, "[ node -> ask node [ let neighbor-choice-list repeat k [ let one-of temp-neighbor-list set temp-neighbor-list remove neighbor temp-neighbor-list set neighbor-choice-list fput neighbor neighbor-choice-list ifelse random 2 = 0 [ create-link-to neighbor ] [ create-link-from neighbor ] ] set neighbor-choice-list sentence n-values k [ self ] neighbor-choice-list ] ]"), ListPrims.sublist(nodeList, (k + 1), ListPrims.length(nodeList))); if(reporterContext && _foreach_2894_2901 !== undefined) { return _foreach_2894_2901; }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["linkPreferentially"] = temp;
  procs["LINK-PREFERENTIALLY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      LayoutManager.layoutSpring(world.turtleManager.turtlesOfBreed("PAGES"), world.links(), 0.2, Prims.div(20, NLMath.sqrt(world.turtleManager.turtlesOfBreed("PAGES").size())), 0.5);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["doLayout"] = temp;
  procs["DO-LAYOUT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("calculation-method"), "diffusion")) {
        if (!world.turtleManager.turtlesOfBreed("SURFERS").isEmpty()) {
          world.turtleManager.turtlesOfBreed("SURFERS").ask(function() { SelfManager.self().die(); }, true);
        }
        world.links().ask(function() {
          SelfManager.self().setVariable("color", 5);
          SelfManager.self().setVariable("thickness", 0);
        }, true);
        world.turtleManager.turtlesOfBreed("PAGES").ask(function() { SelfManager.self().setVariable("new-rank", 0); }, true);
        world.turtleManager.turtlesOfBreed("PAGES").ask(function() {
          if (!LinkPrims.outLinkNeighbors("LINKS").isEmpty()) {
            let rankIncrement = Prims.div(SelfManager.self().getVariable("rank"), LinkPrims.outLinkNeighbors("LINKS").size()); letVars['rankIncrement'] = rankIncrement;
            LinkPrims.outLinkNeighbors("LINKS").ask(function() {
              SelfManager.self().setVariable("new-rank", (SelfManager.self().getVariable("new-rank") + rankIncrement));
            }, true);
          }
          else {
            let rankIncrement = Prims.div(SelfManager.self().getVariable("rank"), world.turtleManager.turtlesOfBreed("PAGES").size()); letVars['rankIncrement'] = rankIncrement;
            world.turtleManager.turtlesOfBreed("PAGES").ask(function() {
              SelfManager.self().setVariable("new-rank", (SelfManager.self().getVariable("new-rank") + rankIncrement));
            }, true);
          }
        }, true);
        world.turtleManager.turtlesOfBreed("PAGES").ask(function() {
          SelfManager.self().setVariable("rank", (Prims.div((1 - world.observer.getGlobal("damping-factor")), world.turtleManager.turtlesOfBreed("PAGES").size()) + (world.observer.getGlobal("damping-factor") * SelfManager.self().getVariable("new-rank"))));
        }, true);
      }
      else {
        if (Prims.lt(world.turtleManager.turtlesOfBreed("SURFERS").size(), world.observer.getGlobal("number-of-surfers"))) {
          world.turtleManager.createTurtles((world.observer.getGlobal("number-of-surfers") - world.turtleManager.turtlesOfBreed("SURFERS").size()), "SURFERS").ask(function() {
            SelfManager.self().setVariable("current-page", ListPrims.oneOf(world.turtleManager.turtlesOfBreed("PAGES")));
            if (world.observer.getGlobal("watch-surfers?")) {
              procedures["MOVE-SURFER"]();
            }
            else {
              SelfManager.self().hideTurtle(true);;
            }
          }, true);
        }
        if (Prims.gt(world.turtleManager.turtlesOfBreed("SURFERS").size(), world.observer.getGlobal("number-of-surfers"))) {
          ListPrims.nOf((world.turtleManager.turtlesOfBreed("SURFERS").size() - world.observer.getGlobal("number-of-surfers")), world.turtleManager.turtlesOfBreed("SURFERS")).ask(function() { SelfManager.self().die(); }, true);
        }
        world.links().ask(function() {
          SelfManager.self().setVariable("color", 5);
          SelfManager.self().setVariable("thickness", 0);
        }, true);
        world.turtleManager.turtlesOfBreed("SURFERS").ask(function() {
          let oldPage = SelfManager.self().getVariable("current-page"); letVars['oldPage'] = oldPage;
          SelfManager.self().getVariable("current-page").ask(function() { SelfManager.self().setVariable("visits", (SelfManager.self().getVariable("visits") + 1)); }, true);
          if ((Prims.lte(Prims.randomFloat(1), world.observer.getGlobal("damping-factor")) && !SelfManager.self().getVariable("current-page").projectionBy(function() { return LinkPrims.myOutLinks("LINKS"); }).isEmpty())) {
            SelfManager.self().setVariable("current-page", ListPrims.oneOf(SelfManager.self().getVariable("current-page").projectionBy(function() { return LinkPrims.outLinkNeighbors("LINKS"); })));
          }
          else {
            SelfManager.self().setVariable("current-page", ListPrims.oneOf(world.turtleManager.turtlesOfBreed("PAGES")));
          }
          if (world.observer.getGlobal("watch-surfers?")) {
            SelfManager.self().hideTurtle(false);;
            procedures["MOVE-SURFER"]();
            let surferColor = SelfManager.self().getVariable("color"); letVars['surferColor'] = surferColor;
            oldPage.ask(function() {
              let traveledLink = LinkPrims.outLinkTo("LINKS", SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("current-page"); })); letVars['traveledLink'] = traveledLink;
              if (!Prims.equality(traveledLink, Nobody)) {
                traveledLink.ask(function() {
                  SelfManager.self().setVariable("color", surferColor);
                  SelfManager.self().setVariable("thickness", 0.08);
                }, true);
              }
            }, true);
          }
          else {
            SelfManager.self().hideTurtle(true);;
          }
        }, true);
        let totalVisits = ListPrims.sum(world.turtleManager.turtlesOfBreed("PAGES").projectionBy(function() { return SelfManager.self().getVariable("visits"); })); letVars['totalVisits'] = totalVisits;
        world.turtleManager.turtlesOfBreed("PAGES").ask(function() {
          SelfManager.self().setVariable("rank", Prims.div(SelfManager.self().getVariable("visits"), totalVisits));
        }, true);
      }
      procedures["UPDATE-GLOBALS"]();
      world.turtleManager.turtlesOfBreed("PAGES").ask(function() { procedures["UPDATE-PAGE-APPEARANCE"](); }, true);
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
      SelfManager.self().face(SelfManager.self().getVariable("current-page"));
      SelfManager.self().moveTo(SelfManager.self().getVariable("current-page"));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["moveSurfer"] = temp;
  procs["MOVE-SURFER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("total-rank", ListPrims.sum(world.turtleManager.turtlesOfBreed("PAGES").projectionBy(function() { return SelfManager.self().getVariable("rank"); })));
      world.observer.setGlobal("max-rank", ListPrims.max(world.turtleManager.turtlesOfBreed("PAGES").projectionBy(function() { return SelfManager.self().getVariable("rank"); })));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateGlobals"] = temp;
  procs["UPDATE-GLOBALS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("size", (0.2 + (4 * NLMath.sqrt(Prims.div(SelfManager.self().getVariable("rank"), world.observer.getGlobal("total-rank"))))));
      if (world.observer.getGlobal("show-page-ranks?")) {
        SelfManager.self().setVariable("label", (workspace.dump('') + workspace.dump(NLMath.precision(SelfManager.self().getVariable("rank"), 3)) + workspace.dump("     ")));
      }
      else {
        SelfManager.self().setVariable("label", "");
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updatePageAppearance"] = temp;
  procs["UPDATE-PAGE-APPEARANCE"] = temp;
  return procs;
})();
world.observer.setGlobal("damping-factor", 0.85);
world.observer.setGlobal("calculation-method", "random-surfer");
world.observer.setGlobal("watch-surfers?", true);
world.observer.setGlobal("number-of-surfers", 5);
world.observer.setGlobal("network-choice", "Example 1");
world.observer.setGlobal("show-page-ranks?", true);