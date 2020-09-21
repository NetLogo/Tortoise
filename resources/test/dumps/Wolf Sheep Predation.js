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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"sheep":{"name":"sheep","editableColorIndex":15,"rotate":false,"elements":[{"x":203,"y":65,"diam":88,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":70,"y":65,"diam":162,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":150,"y":105,"diam":120,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[218,240,255,278],"ycors":[120,165,165,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false},{"x":214,"y":72,"diam":67,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false},{"xmin":164,"ymin":223,"xmax":179,"ymax":298,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[45,30,30,15,45],"ycors":[285,285,240,195,210],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":3,"y":83,"diam":150,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xmin":65,"ymin":221,"xmax":80,"ymax":296,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[195,210,210,240,195],"ycors":[285,285,240,210,210],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[276,285,302,294],"ycors":[85,105,99,83],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false},{"xcors":[219,210,193,201],"ycors":[85,105,99,83],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"wolf":{"name":"wolf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[253,245,245],"ycors":[133,131,133],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[2,13,30,38,38,20,20,27,38,40,31,31,60,68,75,66,65,82,84,100,103,77,79,100,98,119,143,160,166,172,173,167,160,154,169,178,186,198,200,217,219,207,195,192,210,227,242,259,284,277,293,299,297,273,270],"ycors":[194,197,191,193,205,226,257,265,266,260,253,230,206,198,209,228,243,261,268,267,261,239,231,207,196,201,202,195,210,213,238,251,248,265,264,247,240,260,271,271,262,258,230,198,184,164,144,145,151,141,140,134,127,119,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[-1,14,36,40,53,82,134,159,188,227,236,238,268,269,281,269,269],"ycors":[195,180,166,153,140,131,133,126,115,108,102,98,86,92,87,103,113],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
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
  var pens    = [new PenBundle.Pen('sheep', plotOps.makePenOps, false, new PenBundle.State(27, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('populations', 'sheep')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtleManager.turtlesOfBreed("SHEEP").size());
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('wolves', plotOps.makePenOps, false, new PenBundle.State(10, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('populations', 'wolves')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.turtleManager.turtlesOfBreed("WOLVES").size());
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('grass / 4', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('populations', 'grass / 4')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (Prims.equality(world.observer.getGlobal("model-version"), "sheep-wolves-grass")) {
            plotManager.plotValue(Prims.div(procedures["GRASS"]().size(), 4));
          }
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "pop.", true, true, 0, 100, 0, 100, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "sheep", singular: "a-sheep", varNames: [] }, { name: "wolves", singular: "wolf", varNames: [] }])(["energy"], [])('globals [ max-sheep ]  ; don\'t let the sheep population grow too large  ; Sheep and wolves are both breeds of turtles breed [ sheep a-sheep ]  ; sheep is its own plural, so we use \"a-sheep\" as the singular breed [ wolves wolf ]  turtles-own [ energy ]       ; both wolves and sheep have energy  patches-own [ countdown ]    ; this is for the sheep-wolves-grass model version  to setup   clear-all   ifelse netlogo-web? [ set max-sheep 10000 ] [ set max-sheep 30000 ]    ; Check model-version switch   ; if we\'re not modeling grass, then the sheep don\'t need to eat to survive   ; otherwise each grass\' state of growth and growing logic need to be set up   ifelse model-version = \"sheep-wolves-grass\" [     ask patches [       set pcolor one-of [ green brown ]       ifelse pcolor = green         [ set countdown grass-regrowth-time ]       [ set countdown random grass-regrowth-time ] ; initialize grass regrowth clocks randomly for brown patches     ]   ]   [     ask patches [ set pcolor green ]   ]    create-sheep initial-number-sheep  ; create the sheep, then initialize their variables   [     set shape  \"sheep\"     set color white     set size 1.5  ; easier to see     set label-color blue - 2     set energy random (2 * sheep-gain-from-food)     setxy random-xcor random-ycor   ]    create-wolves initial-number-wolves  ; create the wolves, then initialize their variables   [     set shape \"wolf\"     set color black     set size 2  ; easier to see     set energy random (2 * wolf-gain-from-food)     setxy random-xcor random-ycor   ]   display-labels   reset-ticks end  to go   ; stop the model if there are no wolves and no sheep   if not any? turtles [ stop ]   ; stop the model if there are no wolves and the number of sheep gets very large   if not any? wolves and count sheep > max-sheep [ user-message \"The sheep have inherited the earth\" stop ]   ask sheep [     move      ; in this version, sheep eat grass, grass grows, and it costs sheep energy to move     if model-version = \"sheep-wolves-grass\" [       set energy energy - 1  ; deduct energy for sheep only if running sheep-wolves-grass model version       eat-grass  ; sheep eat grass only if running the sheep-wolves-grass model version       death ; sheep die from starvation only if running the sheep-wolves-grass model version     ]      reproduce-sheep  ; sheep reproduce at a random rate governed by a slider   ]   ask wolves [     move     set energy energy - 1  ; wolves lose energy as they move     eat-sheep ; wolves eat a sheep on their patch     death ; wolves die if they run out of energy     reproduce-wolves ; wolves reproduce at a random rate governed by a slider   ]    if model-version = \"sheep-wolves-grass\" [ ask patches [ grow-grass ] ]    tick   display-labels end  to move  ; turtle procedure   rt random 50   lt random 50   fd 1 end  to eat-grass  ; sheep procedure   ; sheep eat grass and turn the patch brown   if pcolor = green [     set pcolor brown     set energy energy + sheep-gain-from-food  ; sheep gain energy by eating   ] end  to reproduce-sheep  ; sheep procedure   if random-float 100 < sheep-reproduce [  ; throw \"dice\" to see if you will reproduce     set energy (energy / 2)                ; divide energy between parent and offspring     hatch 1 [ rt random-float 360 fd 1 ]   ; hatch an offspring and move it forward 1 step   ] end  to reproduce-wolves  ; wolf procedure   if random-float 100 < wolf-reproduce [  ; throw \"dice\" to see if you will reproduce     set energy (energy / 2)               ; divide energy between parent and offspring     hatch 1 [ rt random-float 360 fd 1 ]  ; hatch an offspring and move it forward 1 step   ] end  to eat-sheep  ; wolf procedure   let prey one-of sheep-here                    ; grab a random sheep   if prey != nobody  [                          ; did we get one? if so,     ask prey [ die ]                            ; kill it, and...     set energy energy + wolf-gain-from-food     ; get energy from eating   ] end  to death  ; turtle procedure (i.e. both wolf and sheep procedure)   ; when energy dips below zero, die   if energy < 0 [ die ] end  to grow-grass  ; patch procedure   ; countdown on brown patches: if you reach 0, grow some grass   if pcolor = brown [     ifelse countdown <= 0       [ set pcolor green         set countdown grass-regrowth-time ]       [ set countdown countdown - 1 ]   ] end  to-report grass   ifelse model-version = \"sheep-wolves-grass\" [     report patches with [pcolor = green]   ]   [ report 0 ] end   to display-labels   ask turtles [ set label \"\" ]   if show-energy? [     ask wolves [ set label round energy ]     if model-version = \"sheep-wolves-grass\" [ ask sheep [ set label round energy ] ]   ] end   ; Copyright 1997 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":355,"top":10,"right":873,"bottom":529,"dimensions":{"minPxcor":-25,"maxPxcor":25,"minPycor":-25,"maxPycor":25,"patchSize":10,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":14,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"250","compiledStep":"1","variable":"initial-number-sheep","left":5,"top":60,"right":179,"bottom":93,"display":"initial-number-sheep","min":"0","max":"250","default":100,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"50","compiledStep":"1","variable":"sheep-gain-from-food","left":5,"top":196,"right":179,"bottom":229,"display":"sheep-gain-from-food","min":"0","max":"50","default":4,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"20","compiledStep":"1","variable":"sheep-reproduce","left":5,"top":231,"right":179,"bottom":264,"display":"sheep-reproduce","min":"1","max":"20","default":4,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"250","compiledStep":"1","variable":"initial-number-wolves","left":185,"top":60,"right":350,"bottom":93,"display":"initial-number-wolves","min":"0","max":"250","default":50,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"wolf-gain-from-food","left":183,"top":195,"right":348,"bottom":228,"display":"wolf-gain-from-food","min":"0","max":"100","default":20,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"20","compiledStep":"1","variable":"wolf-reproduce","left":183,"top":231,"right":348,"bottom":264,"display":"wolf-reproduce","min":"0","max":"20","default":5,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"grass-regrowth-time","left":40,"top":100,"right":252,"bottom":133,"display":"grass-regrowth-time","min":"0","max":"100","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":40,"top":140,"right":109,"bottom":173,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":115,"top":140,"right":190,"bottom":173,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('populations', 'sheep')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtleManager.turtlesOfBreed(\"SHEEP\").size());       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"sheep","interval":1,"mode":0,"color":-612749,"inLegend":true,"setupCode":"","updateCode":"plot count sheep","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('populations', 'wolves')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotValue(world.turtleManager.turtlesOfBreed(\"WOLVES\").size());       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"wolves","interval":1,"mode":0,"color":-16449023,"inLegend":true,"setupCode":"","updateCode":"plot count wolves","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('populations', 'grass / 4')(function() {       try {         var reporterContext = false;         var letVars = { };         if (Prims.equality(world.observer.getGlobal(\"model-version\"), \"sheep-wolves-grass\")) {           plotManager.plotValue(Prims.div(procedures[\"GRASS\"]().size(), 4));         }       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"grass / 4","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"if model-version = \"sheep-wolves-grass\" [ plot count grass / 4 ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"populations","left":10,"top":360,"right":350,"bottom":530,"xAxis":"time","yAxis":"pop.","xmin":0,"xmax":100,"ymin":0,"ymax":100,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"sheep","interval":1,"mode":0,"color":-612749,"inLegend":true,"setupCode":"","updateCode":"plot count sheep","type":"pen"},{"display":"wolves","interval":1,"mode":0,"color":-16449023,"inLegend":true,"setupCode":"","updateCode":"plot count wolves","type":"pen"},{"display":"grass / 4","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"if model-version = \"sheep-wolves-grass\" [ plot count grass / 4 ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"SHEEP\").size()","source":"count sheep","left":41,"top":308,"right":111,"bottom":353,"display":"sheep","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"WOLVES\").size()","source":"count wolves","left":115,"top":308,"right":185,"bottom":353,"display":"wolves","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"Prims.div(procedures[\"GRASS\"]().size(), 4)","source":"count grass / 4","left":191,"top":308,"right":256,"bottom":353,"display":"grass","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Sheep settings","left":20,"top":178,"right":160,"bottom":196,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Wolf settings","left":198,"top":176,"right":311,"bottom":194,"fontSize":11,"color":0,"transparent":false,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"variable":"show-energy?","left":105,"top":270,"right":241,"bottom":303,"display":"show-energy?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"model-version","left":5,"top":10,"right":350,"bottom":55,"display":"model-version","choices":["sheep-wolves","sheep-wolves-grass"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["initial-number-sheep", "sheep-gain-from-food", "sheep-reproduce", "initial-number-wolves", "wolf-gain-from-food", "wolf-reproduce", "grass-regrowth-time", "show-energy?", "model-version", "max-sheep"], ["initial-number-sheep", "sheep-gain-from-food", "sheep-reproduce", "initial-number-wolves", "wolf-gain-from-food", "wolf-reproduce", "grass-regrowth-time", "show-energy?", "model-version"], ["countdown"], -25, 25, -25, 25, 10, true, true, turtleShapes, linkShapes, function(){});
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
      if (Meta.isWeb) {
        world.observer.setGlobal("max-sheep", 10000);
      }
      else {
        world.observer.setGlobal("max-sheep", 30000);
      }
      if (Prims.equality(world.observer.getGlobal("model-version"), "sheep-wolves-grass")) {
        Errors.askNobodyCheck(world.patches()).ask(function() {
          SelfManager.self().setPatchVariable("pcolor", ListPrims.oneOf([55, 35]));
          if (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 55)) {
            SelfManager.self().setPatchVariable("countdown", world.observer.getGlobal("grass-regrowth-time"));
          }
          else {
            SelfManager.self().setPatchVariable("countdown", Prims.random(world.observer.getGlobal("grass-regrowth-time")));
          }
        }, true);
      }
      else {
        Errors.askNobodyCheck(world.patches()).ask(function() { SelfManager.self().setPatchVariable("pcolor", 55); }, true);
      }
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-number-sheep"), "SHEEP").ask(function() {
        SelfManager.self().setVariable("shape", "sheep");
        SelfManager.self().setVariable("color", 9.9);
        SelfManager.self().setVariable("size", 1.5);
        SelfManager.self().setVariable("label-color", (105 - 2));
        SelfManager.self().setVariable("energy", Prims.random((2 * world.observer.getGlobal("sheep-gain-from-food"))));
        SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor));
      }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-number-wolves"), "WOLVES").ask(function() {
        SelfManager.self().setVariable("shape", "wolf");
        SelfManager.self().setVariable("color", 0);
        SelfManager.self().setVariable("size", 2);
        SelfManager.self().setVariable("energy", Prims.random((2 * world.observer.getGlobal("wolf-gain-from-food"))));
        SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor));
      }, true);
      procedures["DISPLAY-LABELS"]();
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
      if (!!world.turtles().isEmpty()) {
        throw new Exception.StopInterrupt;
      }
      if ((!!world.turtleManager.turtlesOfBreed("WOLVES").isEmpty() && Prims.gt(world.turtleManager.turtlesOfBreed("SHEEP").size(), world.observer.getGlobal("max-sheep")))) {
        UserDialogPrims.confirm("The sheep have inherited the earth");
        throw new Exception.StopInterrupt;
      }
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SHEEP")).ask(function() {
        procedures["MOVE"]();
        if (Prims.equality(world.observer.getGlobal("model-version"), "sheep-wolves-grass")) {
          SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") - 1));
          procedures["EAT-GRASS"]();
          procedures["DEATH"]();
        }
        procedures["REPRODUCE-SHEEP"]();
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("WOLVES")).ask(function() {
        procedures["MOVE"]();
        SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") - 1));
        procedures["EAT-SHEEP"]();
        procedures["DEATH"]();
        procedures["REPRODUCE-WOLVES"]();
      }, true);
      if (Prims.equality(world.observer.getGlobal("model-version"), "sheep-wolves-grass")) {
        Errors.askNobodyCheck(world.patches()).ask(function() { procedures["GROW-GRASS"](); }, true);
      }
      world.ticker.tick();
      procedures["DISPLAY-LABELS"]();
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
      SelfManager.self().right(Prims.randomLong(50));
      SelfManager.self().right(-(Prims.randomLong(50)));
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
        SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") + world.observer.getGlobal("sheep-gain-from-food")));
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
        SelfManager.self().setVariable("energy", Prims.div(SelfManager.self().getVariable("energy"), 2));
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().right(Prims.randomFloat(360));
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
        SelfManager.self().setVariable("energy", Prims.div(SelfManager.self().getVariable("energy"), 2));
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().right(Prims.randomFloat(360));
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
      let prey = ListPrims.oneOf(SelfManager.self().breedHere("SHEEP")); letVars['prey'] = prey;
      if (!Prims.equality(prey, Nobody)) {
        Errors.askNobodyCheck(prey).ask(function() { SelfManager.self().die(); }, true);
        SelfManager.self().setVariable("energy", (SelfManager.self().getVariable("energy") + world.observer.getGlobal("wolf-gain-from-food")));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["eatSheep"] = temp;
  procs["EAT-SHEEP"] = temp;
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
          SelfManager.self().setPatchVariable("countdown", world.observer.getGlobal("grass-regrowth-time"));
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
      var reporterContext = true;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("model-version"), "sheep-wolves-grass")) {
        Errors.reportInContextCheck(reporterContext);
        return world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 55); });
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return 0;
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["grass"] = temp;
  procs["GRASS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtles()).ask(function() { SelfManager.self().setVariable("label", ""); }, true);
      if (world.observer.getGlobal("show-energy?")) {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("WOLVES")).ask(function() { SelfManager.self().setVariable("label", NLMath.round(SelfManager.self().getVariable("energy"))); }, true);
        if (Prims.equality(world.observer.getGlobal("model-version"), "sheep-wolves-grass")) {
          Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SHEEP")).ask(function() { SelfManager.self().setVariable("label", NLMath.round(SelfManager.self().getVariable("energy"))); }, true);
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["displayLabels"] = temp;
  procs["DISPLAY-LABELS"] = temp;
  return procs;
})();
world.observer.setGlobal("initial-number-sheep", 100);
world.observer.setGlobal("sheep-gain-from-food", 4);
world.observer.setGlobal("sheep-reproduce", 4);
world.observer.setGlobal("initial-number-wolves", 50);
world.observer.setGlobal("wolf-gain-from-food", 20);
world.observer.setGlobal("wolf-reproduce", 5);
world.observer.setGlobal("grass-regrowth-time", 30);
world.observer.setGlobal("show-energy?", false);
world.observer.setGlobal("model-version", "sheep-wolves");