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
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');
var { DeathInterrupt, StopInterrupt } = tortoise_require('util/interrupts');

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person lefty":{"name":"person lefty","editableColorIndex":0,"rotate":false,"elements":[{"x":170,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,180,150,165,195,210,225,255,270,240,255],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":187,"ymin":79,"xmax":232,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,300,285,225],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,120,135,195],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person righty":{"name":"person righty","editableColorIndex":0,"rotate":false,"elements":[{"x":50,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[45,60,30,45,75,90,105,135,150,120,135],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":67,"ymin":79,"xmax":112,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,180,165,105],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[45,0,15,75],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Populations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Infected', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Populations', 'Infected', function() {
      plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(59, 68, "infected?"); }));;
    });
  }),
  new PenBundle.Pen('Not Infected', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Populations', 'Not Infected', function() {
      plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtles(), function() {
        return PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 59, 62, 2, PrimChecks.turtle.getVariable(63, 72, "infected?")));
      }));;
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "hours", "# people", true, true, true, 0, 10, 0, 350, setup, update);
})(), (function() {
  var name    = 'Infection and Recovery Rates';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Infection Rate', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Infection and Recovery Rates', 'Infection Rate', function() {
      plotManager.plotValue(PrimChecks.math.mult(46, 47, PrimChecks.validator.checkArg('*', 46, 47, 1, world.observer.getGlobal("beta-n")), PrimChecks.validator.checkArg('*', 46, 47, 1, world.observer.getGlobal("nb-infected-previous"))));;
    });
  }),
  new PenBundle.Pen('Recovery Rate', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Infection and Recovery Rates', 'Recovery Rate', function() {
      plotManager.plotValue(PrimChecks.math.mult(45, 46, PrimChecks.validator.checkArg('*', 45, 46, 1, world.observer.getGlobal("gamma")), PrimChecks.validator.checkArg('*', 45, 46, 1, world.observer.getGlobal("nb-infected-previous"))));;
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "hours", "rate", true, true, true, 0, 10, 0, 0.1, setup, update);
})(), (function() {
  var name    = 'Cumulative Infected and Recovered';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('% infected', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Cumulative Infected and Recovered', '% infected', function() {
      plotManager.plotValue(PrimChecks.math.mult(125, 126, PrimChecks.math.div(107, 108, PrimChecks.math.plus(71, 72, PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(62, 68, "cured?"); }), PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(94, 103, "infected?"); })), PrimChecks.validator.checkArg('/', 107, 108, 1, world.observer.getGlobal("initial-people"))), 100));;
    });
  }),
  new PenBundle.Pen('% recovered', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Cumulative Infected and Recovered', '% recovered', function() {
      plotManager.plotValue(PrimChecks.math.mult(88, 89, PrimChecks.math.div(70, 71, PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(61, 67, "cured?"); }), PrimChecks.validator.checkArg('/', 70, 71, 1, world.observer.getGlobal("initial-people"))), 100));;
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "hours", "% total pop.", true, true, true, 0, 10, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["infected?", "cured?", "inoculated?", "isolated?", "hospitalized?", "infection-length", "recovery-time", "isolation-tendency", "hospital-going-tendency", "continent", "ambulance?", "susceptible?", "nb-infected", "nb-recovered"], [])('globals [   nb-infected-previous ;; Number of infected people at the previous tick   border               ;; The patches representing the yellow border   angle                ;; Heading for individuals   beta-n               ;; The average number of new secondary infections per infected this tick   gamma                ;; The average number of new recoveries per infected this tick   r0                   ;; The number of secondary infections that arise due to a single infective introduced in a wholly susceptible population ]  turtles-own [   infected?            ;; If true, the person is infected.   cured?               ;; If true, the person has lived through an infection. They cannot be re-infected.   inoculated?          ;; If true, the person has been inoculated.   isolated?            ;; If true, the person is isolated, unable to infect anyone.   hospitalized?        ;; If true, the person is hospitalized and will recovery in half the average-recovery-time.    infection-length     ;; How long the person has been infected.   recovery-time        ;; Time (in hours) it takes before the person has a chance to recover from the infection   isolation-tendency   ;; Chance the person will self-quarantine during any hour being infected.   hospital-going-tendency ;; Chance that an infected person will go to the hospital when infected    continent            ;; Which continent a person lives one, people on continent 1 are squares, people on continent 2 are circles.    ambulance?           ;; If true, the person is an ambulance and will transport infected people to the hospital.    susceptible?         ;; Tracks whether the person was initially susceptible   nb-infected          ;; Number of secondary infections caused by an infected person at the end of the tick   nb-recovered         ;; Number of recovered people at the end of the tick ]  ;;; ;;; SETUP PROCEDURES ;;;  to setup   clear-all   setup-globals   setup-people   setup-ambulance   reset-ticks end  to setup-globals   ask patch (- max-pxcor / 2 ) 0 [ set pcolor white ]   ask patch (max-pxcor / 2 ) 0 [ set pcolor white ]    set border patches with [(pxcor =  0 and abs (pycor) >= 0)]   ask border [ set pcolor yellow ] end  ;; Create initial-people number of people. ;; Those that live on the left are squares; those on the right, circles. to setup-people   create-turtles initial-people     [ setxy random-xcor random-ycor       ifelse xcor <= 0       [ set continent 1 ]       [ set continent 2 ]        set cured? false       set isolated? false       set hospitalized? false       set ambulance? false       set infected? false       set susceptible? true        assign-tendency        ifelse continent = 1         [ set shape \"square\" ]         [ set shape \"circle\" ]        set size 0.5        ;; Each individual has a 5% chance of starting out infected       if (random-float 100 < 5)       [ set infected? true         set susceptible? false         set infection-length random recovery-time       ]        ifelse (not infected?) and (random-float 100 < inoculation-chance)         [ set inoculated? true           set susceptible? false ]         [ set inoculated? false ]        assign-color       ]      if links? [ make-network ] end  to setup-ambulance   create-turtles initial-ambulance   [     ifelse random 2 < 1     [       set continent 1       setxy (- max-pxcor / 2) 0     ]     [       set continent 2       setxy (max-pxcor / 2) 0     ]      set cured? false     set isolated? false     set hospitalized? false     set infected? false     set inoculated? false     set susceptible? false      set ambulance? true      set shape \"person\"     set color yellow   ] end  to assign-tendency ;; Turtle procedure    set isolation-tendency random-normal average-isolation-tendency average-isolation-tendency / 4   set hospital-going-tendency random-normal average-hospital-going-tendency average-hospital-going-tendency / 4   set recovery-time random-normal average-recovery-time average-recovery-time / 4    ;; Make sure recovery-time lies between 0 and 2x average-recovery-time   if recovery-time > average-recovery-time * 2 [ set recovery-time average-recovery-time * 2 ]   if recovery-time < 0 [ set recovery-time 0 ]    ;; Similarly for isolation and hospital going tendencies   if isolation-tendency > average-isolation-tendency * 2 [ set isolation-tendency average-isolation-tendency * 2 ]   if isolation-tendency < 0 [ set isolation-tendency 0 ]    if hospital-going-tendency > average-hospital-going-tendency * 2 [ set hospital-going-tendency average-hospital-going-tendency * 2 ]   if hospital-going-tendency < 0 [ set hospital-going-tendency 0 ] end   ;; Different people are displayed in 5 different colors depending on health ;; green is a survivor of the infection ;; blue is a successful innoculation ;; red is an infected person ;; white is neither infected, innoculated, nor cured ;; yellow is an ambulance to assign-color ;; turtle procedure    ifelse cured?     [ set color green ]     [ ifelse inoculated?       [ set color blue ]       [ ifelse infected?         [set color red ]         [set color white]]]   if ambulance?     [ set color yellow ] end   to make-network   ask turtles   [     create-links-with turtles-on neighbors   ] end   ;;; ;;; GO PROCEDURES ;;;   to go   if all? turtles [ not infected? ]     [ stop ]   ask turtles     [ clear-count ]    ask turtles     [ if not isolated? and not hospitalized? and not ambulance?         [ move ] ]    ask turtles     [ if infected? and not isolated? and not hospitalized?          [ infect ] ]    ask turtles     [ if not isolated? and not hospitalized? and infected? and (random 100 < isolation-tendency)         [ isolate ] ]    ask turtles     [ if not isolated? and not hospitalized? and infected? and (random 100 < hospital-going-tendency)         [ hospitalize ] ]    ask turtles   [     if ambulance?     [       move       ask turtles-on neighbors       [         if (ambulance? = false) and (infected? = true)         [ hospitalize ]       ]     ]   ]    ask turtles     [ if infected?        [ maybe-recover ]     ]    ask turtles     [ if (isolated? or hospitalized?) and cured?         [ unisolate ] ]    ask turtles     [ assign-color       calculate-r0 ]    tick end   to move  ;; turtle procedure   if travel?   [     if random 100 < (travel-tendency) and not ambulance?  ;; up to 1% chance of travel     [ set xcor (- xcor) ]   ]    ifelse continent = 1   [     ifelse xcor > (- 0.5)  ;; and on border patch     [       set angle random-float 180       let new-patch patch-at-heading-and-distance angle (-1)       if new-patch != nobody       [         move-to new-patch       ]     ]     [ ;; if in continent 1 and not on border       ifelse xcor < (min-pxcor + 0.5)  ;; at the edge of world       [         set angle random-float 180       ]       [         set angle random-float 360  ;; inside world       ]       rt angle        ifelse ambulance?       [         fd intra-mobility * 5  ;; ambulances move 5 times as fast than the ppl       ]       [         fd intra-mobility       ]     ]    ]   [ ;; in continent 2     ifelse xcor < 1  ;; and on border patch     [       set angle random-float 180       let new-patch patch-at-heading-and-distance angle (1)       if new-patch != nobody       [         move-to new-patch       ]     ]     [ ;; if in continent 2 and not on border       ifelse xcor > (max-pxcor - 1) ;; at the edge of world       [         set angle random-float 180       ]       [         set angle random-float 360       ]       lt angle        ifelse ambulance?       [         fd intra-mobility * 5       ]       [         fd intra-mobility       ]     ]    ] end  to clear-count   set nb-infected 0   set nb-recovered 0 end  to maybe-recover   set infection-length infection-length + 1        ;; If people have been infected for more than the recovery-time       ;; then there is a chance for recovery       ifelse not hospitalized?       [         if infection-length > recovery-time         [           if random-float 100 < recovery-chance           [             set infected? false             set cured? true             set nb-recovered (nb-recovered + 1)           ]         ]       ]       [ ;; If hospitalized, recover in a fifth of the recovery time         if infection-length > (recovery-time / 5)         [           set infected? false           set cured? true           set nb-recovered (nb-recovered + 1 )         ]       ] end  ;; To better show that isolation has occurred, the patch below the person turns gray to isolate ;; turtle procedure   set isolated? true   move-to patch-here ;; move to center of patch   ask (patch-at 0 0) [ set pcolor gray - 3 ] end  ;; After unisolating, patch turns back to normal color to unisolate  ;; turtle procedure   set isolated? false   set hospitalized? false    ask (patch-at 0 0) [ set pcolor black ]    ask border [ set pcolor yellow ]                      ;; patches on the border stay yellow   ask (patch (- max-pxcor / 2) 0) [ set pcolor white ]  ;; hospital patch on the left stays white   ask (patch (max-pxcor / 2) 0) [ set pcolor white ]    ;; hospital patch on the right stays white end  ;; To hospitalize, move to hospital patch in the continent of current residence to hospitalize ;; turtle procedure   set hospitalized? true   set pcolor black   ifelse continent = 1   [     move-to patch (- max-pxcor / 2) 0   ]   [     move-to patch (max-pxcor / 2) 0   ]   set pcolor white end  ;; Infected individuals who are not isolated or hospitalized have a chance of transmitting their disease to their susceptible neighbors. ;; If the neighbor is linked, then the chance of disease transmission doubles.  to infect  ;; turtle procedure      let caller self      let nearby-uninfected (turtles-on neighbors)     with [ not infected? and not cured? and not inoculated? ]     if nearby-uninfected != nobody     [        ask nearby-uninfected        [            ifelse link-neighbor? caller            [              if random 100 < infection-chance * 2 ;; twice as likely to infect a linked person              [                set infected? true                set nb-infected (nb-infected + 1)              ]            ]            [              if random 100 < infection-chance              [                set infected? true                set nb-infected (nb-infected + 1)              ]            ]        ]      ]  end   to calculate-r0    let new-infected sum [ nb-infected ] of turtles   let new-recovered sum [ nb-recovered ] of turtles   set nb-infected-previous (count turtles with [ infected? ] + new-recovered - new-infected)  ;; Number of infected people at the previous tick   let susceptible-t (initial-people - (count turtles with [ infected? ]) - (count turtles with [ cured? ]))  ;; Number of susceptibles now   let s0 count turtles with [ susceptible? ] ;; Initial number of susceptibles    ifelse nb-infected-previous < 10   [ set beta-n 0 ]   [     set beta-n (new-infected / nb-infected-previous)       ;; This is the average number of new secondary infections per infected this tick   ]    ifelse nb-infected-previous < 5   [ set gamma 0 ]   [     set gamma (new-recovered / nb-infected-previous)     ;; This is the average number of new recoveries per infected this tick   ]    if ((initial-people - susceptible-t) != 0 and (susceptible-t != 0))   ;; Prevent from dividing by 0   [     ;; This is derived from integrating dI / dS = (beta*SI - gamma*I) / (-beta*SI)     ;; Assuming one infected individual introduced in the beginning, and hence counting I(0) as negligible,     ;; we get the relation     ;; N - gamma*ln(S(0)) / beta = S(t) - gamma*ln(S(t)) / beta, where N is the initial \'susceptible\' population.     ;; Since N >> 1     ;; Using this, we have R_0 = beta*N / gamma = N*ln(S(0)/S(t)) / (K-S(t))     set r0 (ln (s0 / susceptible-t) / (initial-people - susceptible-t))     set r0 r0 * s0 ] end   ; Copyright 2011 Uri Wilensky. ; See Info tab for full copyright and license.')([{"x":646,"y":27,"width":483,"height":484,"dimensions":{"minPxcor":-12,"maxPxcor":12,"minPycor":-12,"maxPycor":12,"patchSize":19,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"hours","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup\"); if (R === StopInterrupt) { return R; }","source":"setup","x":339,"y":219,"width":83,"height":33,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","x":443,"y":219,"width":83,"height":33,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 50; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 400; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 10; })","variable":"initial-people","x":18,"y":22,"width":269,"height":33,"oldSize":true,"display":"initial-people","min":"50","max":"400","default":250,"step":"10","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 50; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 5; })","variable":"average-isolation-tendency","x":315,"y":22,"width":269,"height":33,"oldSize":true,"display":"average-isolation-tendency","min":"0","max":"50","default":5,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Populations', 'Infected', function() {     plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(59, 68, \"infected?\"); }));;   }); }","display":"Infected","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [ infected? ]","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Populations', 'Not Infected', function() {     plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtles(), function() {       return PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 59, 62, 2, PrimChecks.turtle.getVariable(63, 72, \"infected?\")));     }));;   }); }","display":"Not Infected","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [ not infected? ]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Populations","x":356,"y":299,"width":263,"height":143,"oldSize":true,"xAxis":"hours","yAxis":"# people","xmin":0,"xmax":10,"ymin":0,"ymax":350,"autoPlotX":true,"autoPlotY":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"Infected","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [ infected? ]","type":"pen"},{"display":"Not Infected","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot count turtles with [ not infected? ]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 50; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 5; })","variable":"inoculation-chance","x":315,"y":95,"width":269,"height":33,"oldSize":true,"display":"inoculation-chance","min":"0","max":"50","default":10,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 4; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 1; })","variable":"initial-ambulance","x":315,"y":134,"width":172,"height":33,"oldSize":true,"display":"initial-ambulance","min":"0","max":"4","default":2,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 50; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 5; })","variable":"average-hospital-going-tendency","x":315,"y":58,"width":269,"height":33,"oldSize":true,"display":"average-hospital-going-tendency","min":"0","max":"50","default":5,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Infection and Recovery Rates', 'Infection Rate', function() {     plotManager.plotValue(PrimChecks.math.mult(46, 47, PrimChecks.validator.checkArg('*', 46, 47, 1, world.observer.getGlobal(\"beta-n\")), PrimChecks.validator.checkArg('*', 46, 47, 1, world.observer.getGlobal(\"nb-infected-previous\"))));;   }); }","display":"Infection Rate","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot (beta-n * nb-infected-previous)","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Infection and Recovery Rates', 'Recovery Rate', function() {     plotManager.plotValue(PrimChecks.math.mult(45, 46, PrimChecks.validator.checkArg('*', 45, 46, 1, world.observer.getGlobal(\"gamma\")), PrimChecks.validator.checkArg('*', 45, 46, 1, world.observer.getGlobal(\"nb-infected-previous\"))));;   }); }","display":"Recovery Rate","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot (gamma * nb-infected-previous)","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Infection and Recovery Rates","x":11,"y":452,"width":333,"height":145,"oldSize":true,"xAxis":"hours","yAxis":"rate","xmin":0,"xmax":10,"ymin":0,"ymax":0.1,"autoPlotX":true,"autoPlotY":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"Infection Rate","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot (beta-n * nb-infected-previous)","type":"pen"},{"display":"Recovery Rate","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot (gamma * nb-infected-previous)","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 10; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 100; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 5; })","variable":"infection-chance","x":18,"y":59,"width":268,"height":33,"oldSize":true,"display":"infection-chance","min":"10","max":"100","default":55,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 10; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 100; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 5; })","variable":"recovery-chance","x":18,"y":97,"width":267,"height":33,"oldSize":true,"display":"recovery-chance","min":"10","max":"100","default":45,"step":"5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"r0\"); })","source":"r0 ","x":356,"y":451,"width":81,"height":45,"oldSize":true,"display":"R0","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"links?","x":195,"y":199,"width":103,"height":33,"oldSize":true,"display":"links?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 1; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 0.1; })","variable":"intra-mobility","x":15,"y":199,"width":172,"height":33,"oldSize":true,"display":"intra-mobility","min":"0","max":"1","default":0.4,"step":"0.1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"travel?","x":196,"y":241,"width":103,"height":33,"oldSize":true,"display":"travel?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 1; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 0.1; })","variable":"travel-tendency","x":14,"y":240,"width":172,"height":33,"oldSize":true,"display":"travel-tendency","min":"0","max":"1","default":1,"step":".1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 50; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 300; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 10; })","variable":"average-recovery-time","x":18,"y":136,"width":268,"height":33,"oldSize":true,"display":"average-recovery-time","min":"50","max":"300","default":110,"step":"10","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Cumulative Infected and Recovered', '% infected', function() {     plotManager.plotValue(PrimChecks.math.mult(125, 126, PrimChecks.math.div(107, 108, PrimChecks.math.plus(71, 72, PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(62, 68, \"cured?\"); }), PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(94, 103, \"infected?\"); })), PrimChecks.validator.checkArg('/', 107, 108, 1, world.observer.getGlobal(\"initial-people\"))), 100));;   }); }","display":"% infected","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot (((count turtles with [ cured? ] + count turtles with [ infected? ]) / initial-people) * 100)","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Cumulative Infected and Recovered', '% recovered', function() {     plotManager.plotValue(PrimChecks.math.mult(88, 89, PrimChecks.math.div(70, 71, PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(61, 67, \"cured?\"); }), PrimChecks.validator.checkArg('/', 70, 71, 1, world.observer.getGlobal(\"initial-people\"))), 100));;   }); }","display":"% recovered","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot ((count turtles with [ cured? ] / initial-people) * 100)","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Cumulative Infected and Recovered","x":11,"y":297,"width":332,"height":144,"oldSize":true,"xAxis":"hours","yAxis":"% total pop.","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotX":true,"autoPlotY":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"% infected","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot (((count turtles with [ cured? ] + count turtles with [ infected? ]) / initial-people) * 100)","type":"pen"},{"display":"% recovered","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"plot ((count turtles with [ cured? ] / initial-people) * 100)","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["initial-people", "average-isolation-tendency", "inoculation-chance", "initial-ambulance", "average-hospital-going-tendency", "infection-chance", "recovery-chance", "links?", "intra-mobility", "travel?", "travel-tendency", "average-recovery-time", "nb-infected-previous", "border", "angle", "beta-n", "gamma", "r0"], ["initial-people", "average-isolation-tendency", "inoculation-chance", "initial-ambulance", "average-hospital-going-tendency", "infection-chance", "recovery-chance", "links?", "intra-mobility", "travel?", "travel-tendency", "average-recovery-time"], [], -12, 12, -12, 12, 19, false, false, turtleShapes, linkShapes, function(){});
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
var ProcedurePrims = workspace.procedurePrims;
var RandomPrims = workspace.randomPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var StringPrims = workspace.stringPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
ProcedurePrims.defineCommand("setup", 1897, 1978, (function() {
  world.clearAll();
  var R = ProcedurePrims.callCommand("setup-globals"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("setup-people"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("setup-ambulance"); if (R === DeathInterrupt) { return R; }
  world.ticker.reset();
}))
ProcedurePrims.defineCommand("setup-globals", 1986, 2204, (function() {
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 2002, 2005, 1904, world.getPatchAt(PrimChecks.math.div(2025, 2026, PrimChecks.math.unaryminus(world.topology.maxPxcor), 2), 0)), function() { PrimChecks.patch.setVariable(2039, 2045, "pcolor", 9.9); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2002, 2005, R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 2056, 2059, 1904, world.getPatchAt(PrimChecks.math.div(2077, 2078, world.topology.maxPxcor, 2), 0)), function() { PrimChecks.patch.setVariable(2091, 2097, "pcolor", 9.9); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2056, 2059, R); return R; }
  world.observer.setGlobal("border", PrimChecks.agentset.with(2128, 2132, world.patches(), function() {
    return (Prims.equality(PrimChecks.patch.getVariable(2135, 2140, "pxcor"), 0) && Prims.gte(PrimChecks.math.abs(PrimChecks.validator.checkArg('ABS', 2150, 2153, 1, PrimChecks.patch.getVariable(2155, 2160, "pycor"))), 0));
  }));
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 2171, 2174, 1904, world.observer.getGlobal("border")), function() { PrimChecks.patch.setVariable(2188, 2194, "pcolor", 45); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2171, 2174, R); return R; }
}))
ProcedurePrims.defineCommand("setup-people", 2328, 3227, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(world.observer.getGlobal("initial-people"), ""), function() {
    PrimChecks.turtle.setXY(2379, 2384, RandomPrims.randomFloatInRange(world.topology.minPxcor, world.topology.maxPxcor), RandomPrims.randomFloatInRange(world.topology.minPycor, world.topology.maxPycor));
    if (Prims.lte(PrimChecks.turtle.getVariable(2422, 2426, "xcor"), 0)) {
      PrimChecks.turtle.setVariable(2444, 2453, "continent", 1);
    }
    else {
      PrimChecks.turtle.setVariable(2470, 2479, "continent", 2);
    }
    PrimChecks.turtle.setVariable(2495, 2501, "cured?", false);
    PrimChecks.turtle.setVariable(2518, 2527, "isolated?", false);
    PrimChecks.turtle.setVariable(2544, 2557, "hospitalized?", false);
    PrimChecks.turtle.setVariable(2574, 2584, "ambulance?", false);
    PrimChecks.turtle.setVariable(2601, 2610, "infected?", false);
    PrimChecks.turtle.setVariable(2627, 2639, "susceptible?", true);
    var R = ProcedurePrims.callCommand("assign-tendency"); if (R === DeathInterrupt) { return R; }
    if (Prims.equality(PrimChecks.turtle.getVariable(2682, 2691, "continent"), 1)) {
      PrimChecks.turtleOrLink.setVariable(2710, 2715, "shape", "square");
    }
    else {
      PrimChecks.turtleOrLink.setVariable(2741, 2746, "shape", "circle");
    }
    PrimChecks.turtle.setVariable(2769, 2773, "size", 0.5);
    if (Prims.lt(PrimChecks.math.randomFloat(100), 5)) {
      PrimChecks.turtle.setVariable(2889, 2898, "infected?", true);
      PrimChecks.turtle.setVariable(2916, 2928, "susceptible?", false);
      PrimChecks.turtle.setVariable(2947, 2963, "infection-length", PrimChecks.math.random(2964, 2970, PrimChecks.validator.checkArg('RANDOM', 2964, 2970, 1, PrimChecks.turtle.getVariable(2971, 2984, "recovery-time"))));
    }
    if ((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 3008, 3011, 2, PrimChecks.turtle.getVariable(3012, 3021, "infected?"))) && Prims.lt(PrimChecks.math.randomFloat(100), world.observer.getGlobal("inoculation-chance")))) {
      PrimChecks.turtle.setVariable(3081, 3092, "inoculated?", true);
      PrimChecks.turtle.setVariable(3112, 3124, "susceptible?", false);
    }
    else {
      PrimChecks.turtle.setVariable(3147, 3158, "inoculated?", false);
    }
    var R = ProcedurePrims.callCommand("assign-color"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2343, 2357, R); return R; }
  if (world.observer.getGlobal("links?")) {
    var R = ProcedurePrims.callCommand("make-network"); if (R === DeathInterrupt) { return R; }
  }
}))
ProcedurePrims.defineCommand("setup-ambulance", 3235, 3669, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(world.observer.getGlobal("initial-ambulance"), ""), function() {
    if (Prims.lt(RandomPrims.randomLong(2), 1)) {
      PrimChecks.turtle.setVariable(3330, 3339, "continent", 1);
      PrimChecks.turtle.setXY(3348, 3353, PrimChecks.math.div(3367, 3368, PrimChecks.math.unaryminus(world.topology.maxPxcor), 2), 0);
    }
    else {
      PrimChecks.turtle.setVariable(3396, 3405, "continent", 2);
      PrimChecks.turtle.setXY(3414, 3419, PrimChecks.math.div(3431, 3432, world.topology.maxPxcor, 2), 0);
    }
    PrimChecks.turtle.setVariable(3453, 3459, "cured?", false);
    PrimChecks.turtle.setVariable(3474, 3483, "isolated?", false);
    PrimChecks.turtle.setVariable(3498, 3511, "hospitalized?", false);
    PrimChecks.turtle.setVariable(3526, 3535, "infected?", false);
    PrimChecks.turtle.setVariable(3550, 3561, "inoculated?", false);
    PrimChecks.turtle.setVariable(3576, 3588, "susceptible?", false);
    PrimChecks.turtle.setVariable(3604, 3614, "ambulance?", true);
    PrimChecks.turtleOrLink.setVariable(3629, 3634, "shape", "person");
    PrimChecks.turtleOrLink.setVariable(3652, 3657, "color", 45);
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3253, 3267, R); return R; }
}))
ProcedurePrims.defineCommand("assign-tendency", 3677, 4656, (function() {
  PrimChecks.turtle.setVariable(3720, 3738, "isolation-tendency", PrimChecks.math.div(3807, 3808, PrimChecks.math.randomNormal(3739, 3752, PrimChecks.validator.checkArg('RANDOM-NORMAL', 3739, 3752, 1, world.observer.getGlobal("average-isolation-tendency")), PrimChecks.validator.checkArg('RANDOM-NORMAL', 3739, 3752, 1, world.observer.getGlobal("average-isolation-tendency"))), 4));
  PrimChecks.turtle.setVariable(3817, 3840, "hospital-going-tendency", PrimChecks.math.div(3919, 3920, PrimChecks.math.randomNormal(3841, 3854, PrimChecks.validator.checkArg('RANDOM-NORMAL', 3841, 3854, 1, world.observer.getGlobal("average-hospital-going-tendency")), PrimChecks.validator.checkArg('RANDOM-NORMAL', 3841, 3854, 1, world.observer.getGlobal("average-hospital-going-tendency"))), 4));
  PrimChecks.turtle.setVariable(3929, 3942, "recovery-time", PrimChecks.math.div(4001, 4002, PrimChecks.math.randomNormal(3943, 3956, PrimChecks.validator.checkArg('RANDOM-NORMAL', 3943, 3956, 1, world.observer.getGlobal("average-recovery-time")), PrimChecks.validator.checkArg('RANDOM-NORMAL', 3943, 3956, 1, world.observer.getGlobal("average-recovery-time"))), 4));
  if (Prims.gt(PrimChecks.turtle.getVariable(4084, 4097, "recovery-time"), PrimChecks.math.mult(4122, 4123, PrimChecks.validator.checkArg('*', 4122, 4123, 1, world.observer.getGlobal("average-recovery-time")), 2))) {
    PrimChecks.turtle.setVariable(4132, 4145, "recovery-time", PrimChecks.math.mult(4168, 4169, PrimChecks.validator.checkArg('*', 4168, 4169, 1, world.observer.getGlobal("average-recovery-time")), 2));
  }
  if (Prims.lt(PrimChecks.turtle.getVariable(4179, 4192, "recovery-time"), 0)) {
    PrimChecks.turtle.setVariable(4203, 4216, "recovery-time", 0);
  }
  if (Prims.gt(PrimChecks.turtle.getVariable(4286, 4304, "isolation-tendency"), PrimChecks.math.mult(4334, 4335, PrimChecks.validator.checkArg('*', 4334, 4335, 1, world.observer.getGlobal("average-isolation-tendency")), 2))) {
    PrimChecks.turtle.setVariable(4344, 4362, "isolation-tendency", PrimChecks.math.mult(4390, 4391, PrimChecks.validator.checkArg('*', 4390, 4391, 1, world.observer.getGlobal("average-isolation-tendency")), 2));
  }
  if (Prims.lt(PrimChecks.turtle.getVariable(4401, 4419, "isolation-tendency"), 0)) {
    PrimChecks.turtle.setVariable(4430, 4448, "isolation-tendency", 0);
  }
  if (Prims.gt(PrimChecks.turtle.getVariable(4459, 4482, "hospital-going-tendency"), PrimChecks.math.mult(4517, 4518, PrimChecks.validator.checkArg('*', 4517, 4518, 1, world.observer.getGlobal("average-hospital-going-tendency")), 2))) {
    PrimChecks.turtle.setVariable(4527, 4550, "hospital-going-tendency", PrimChecks.math.mult(4583, 4584, PrimChecks.validator.checkArg('*', 4583, 4584, 1, world.observer.getGlobal("average-hospital-going-tendency")), 2));
  }
  if (Prims.lt(PrimChecks.turtle.getVariable(4594, 4617, "hospital-going-tendency"), 0)) {
    PrimChecks.turtle.setVariable(4628, 4651, "hospital-going-tendency", 0);
  }
}))
ProcedurePrims.defineCommand("assign-color", 4926, 5169, (function() {
  if (PrimChecks.turtle.getVariable(4969, 4975, "cured?")) {
    PrimChecks.turtleOrLink.setVariable(4986, 4991, "color", 55);
  }
  else {
    if (PrimChecks.turtle.getVariable(5013, 5024, "inoculated?")) {
      PrimChecks.turtleOrLink.setVariable(5037, 5042, "color", 105);
    }
    else {
      if (PrimChecks.turtle.getVariable(5065, 5074, "infected?")) {
        PrimChecks.turtleOrLink.setVariable(5088, 5093, "color", 15);
      }
      else {
        PrimChecks.turtleOrLink.setVariable(5113, 5118, "color", 9.9);
      }
    }
  }
  if (PrimChecks.turtle.getVariable(5133, 5143, "ambulance?")) {
    PrimChecks.turtleOrLink.setVariable(5154, 5159, "color", 45);
  }
}))
ProcedurePrims.defineCommand("make-network", 5178, 5256, (function() {
  var R = ProcedurePrims.ask(world.turtles(), function() {
    var R = ProcedurePrims.ask(LinkPrims.createLinksWith(PrimChecks.agentset.turtlesOn(SelfManager.self().getNeighbors()), "LINKS"), function() {}, false); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5213, 5230, R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5193, 5196, R); return R; }
}))
ProcedurePrims.defineCommand("go", 5293, 6256, (function() {
  if (PrimChecks.agentset.all(5301, 5305, world.turtles(), function() {
    return PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5316, 5319, 2, PrimChecks.turtle.getVariable(5320, 5329, "infected?")));
  })) {
    return PrimChecks.procedure.stop(5338, 5342);
  }
  var R = ProcedurePrims.ask(world.turtles(), function() { var R = ProcedurePrims.callCommand("clear-count"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5347, 5350, R); return R; }
  var R = ProcedurePrims.ask(world.turtles(), function() {
    if (((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5403, 5406, 2, PrimChecks.turtle.getVariable(5407, 5416, "isolated?"))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5421, 5424, 2, PrimChecks.turtle.getVariable(5425, 5438, "hospitalized?")))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5443, 5446, 2, PrimChecks.turtle.getVariable(5447, 5457, "ambulance?"))))) {
      var R = ProcedurePrims.callCommand("move"); if (R === DeathInterrupt) { return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5382, 5385, R); return R; }
  var R = ProcedurePrims.ask(world.turtles(), function() {
    if (((PrimChecks.validator.checkArg('AND', 5511, 5514, 2, PrimChecks.turtle.getVariable(5501, 5510, "infected?")) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5515, 5518, 2, PrimChecks.turtle.getVariable(5519, 5528, "isolated?")))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5533, 5536, 2, PrimChecks.turtle.getVariable(5537, 5550, "hospitalized?"))))) {
      var R = ProcedurePrims.callCommand("infect"); if (R === DeathInterrupt) { return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5480, 5483, R); return R; }
  var R = ProcedurePrims.ask(world.turtles(), function() {
    if ((((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5597, 5600, 2, PrimChecks.turtle.getVariable(5601, 5610, "isolated?"))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5615, 5618, 2, PrimChecks.turtle.getVariable(5619, 5632, "hospitalized?")))) && PrimChecks.validator.checkArg('AND', 5633, 5636, 2, PrimChecks.turtle.getVariable(5637, 5646, "infected?"))) && Prims.lt(RandomPrims.randomLong(100), PrimChecks.turtle.getVariable(5665, 5683, "isolation-tendency")))) {
      var R = ProcedurePrims.callCommand("isolate"); if (R === DeathInterrupt) { return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5576, 5579, R); return R; }
  var R = ProcedurePrims.ask(world.turtles(), function() {
    if ((((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5731, 5734, 2, PrimChecks.turtle.getVariable(5735, 5744, "isolated?"))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 5749, 5752, 2, PrimChecks.turtle.getVariable(5753, 5766, "hospitalized?")))) && PrimChecks.validator.checkArg('AND', 5767, 5770, 2, PrimChecks.turtle.getVariable(5771, 5780, "infected?"))) && Prims.lt(RandomPrims.randomLong(100), PrimChecks.turtle.getVariable(5799, 5822, "hospital-going-tendency")))) {
      var R = ProcedurePrims.callCommand("hospitalize"); if (R === DeathInterrupt) { return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5710, 5713, R); return R; }
  var R = ProcedurePrims.ask(world.turtles(), function() {
    if (PrimChecks.turtle.getVariable(5876, 5886, "ambulance?")) {
      var R = ProcedurePrims.callCommand("move"); if (R === DeathInterrupt) { return R; }
      var R = ProcedurePrims.ask(PrimChecks.agentset.turtlesOn(SelfManager.self().getNeighbors()), function() {
        if ((Prims.equality(PrimChecks.turtle.getVariable(5955, 5965, "ambulance?"), false) && Prims.equality(PrimChecks.turtle.getVariable(5980, 5989, "infected?"), true))) {
          var R = ProcedurePrims.callCommand("hospitalize"); if (R === DeathInterrupt) { return R; }
        }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5910, 5913, R); return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5853, 5856, R); return R; }
  var R = ProcedurePrims.ask(world.turtles(), function() {
    if (PrimChecks.turtle.getVariable(6064, 6073, "infected?")) {
      var R = ProcedurePrims.callCommand("maybe-recover"); if (R === DeathInterrupt) { return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(6043, 6046, R); return R; }
  var R = ProcedurePrims.ask(world.turtles(), function() {
    if (((PrimChecks.validator.checkArg('OR', 6140, 6142, 2, PrimChecks.turtle.getVariable(6130, 6139, "isolated?")) || PrimChecks.validator.checkArg('OR', 6140, 6142, 2, PrimChecks.turtle.getVariable(6143, 6156, "hospitalized?"))) && PrimChecks.validator.checkArg('AND', 6158, 6161, 2, PrimChecks.turtle.getVariable(6162, 6168, "cured?")))) {
      var R = ProcedurePrims.callCommand("unisolate"); if (R === DeathInterrupt) { return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(6108, 6111, R); return R; }
  var R = ProcedurePrims.ask(world.turtles(), function() {
    var R = ProcedurePrims.callCommand("assign-color"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("calculate-r0"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(6196, 6199, R); return R; }
  world.ticker.tick();
}))
ProcedurePrims.defineCommand("move", 6265, 7683, (function() {
  if (world.observer.getGlobal("travel?")) {
    if ((Prims.lt(RandomPrims.randomLong(100), world.observer.getGlobal("travel-tendency")) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 6350, 6353, 2, PrimChecks.turtle.getVariable(6354, 6364, "ambulance?"))))) {
      PrimChecks.turtle.setVariable(6405, 6409, "xcor", PrimChecks.math.unaryminus(PrimChecks.validator.checkArg('-', 6411, 6412, 1, PrimChecks.turtle.getVariable(6413, 6417, "xcor"))));
    }
  }
  if (Prims.equality(PrimChecks.turtle.getVariable(6435, 6444, "continent"), 1)) {
    if (Prims.gt(PrimChecks.turtle.getVariable(6464, 6468, "xcor"), PrimChecks.math.unaryminus(0.5))) {
      world.observer.setGlobal("angle", PrimChecks.math.randomFloat(180));
      let newHpatch = SelfManager.self().patchAtHeadingAndDistance(world.observer.getGlobal("angle"), -1); ProcedurePrims.stack().currentContext().registerStringRunVar("NEW-PATCH", newHpatch);
      if (!Prims.equality(newHpatch, Nobody)) {
        SelfManager.self().moveTo(newHpatch);
      }
    }
    else {
      if (Prims.lt(PrimChecks.turtle.getVariable(6738, 6742, "xcor"), PrimChecks.math.plus(6756, 6757, world.topology.minPxcor, 0.5))) {
        world.observer.setGlobal("angle", PrimChecks.math.randomFloat(180));
      }
      else {
        world.observer.setGlobal("angle", PrimChecks.math.randomFloat(360));
      }
      SelfManager.self().right(world.observer.getGlobal("angle"));
      if (PrimChecks.turtle.getVariable(6936, 6946, "ambulance?")) {
        SelfManager.self().fd(PrimChecks.math.mult(6981, 6982, PrimChecks.validator.checkArg('*', 6981, 6982, 1, world.observer.getGlobal("intra-mobility")), 5));
      }
      else {
        SelfManager.self().fd(world.observer.getGlobal("intra-mobility"));
      }
    }
  }
  else {
    if (Prims.lt(PrimChecks.turtle.getVariable(7128, 7132, "xcor"), 1)) {
      world.observer.setGlobal("angle", PrimChecks.math.randomFloat(180));
      let newHpatch = SelfManager.self().patchAtHeadingAndDistance(world.observer.getGlobal("angle"), 1); ProcedurePrims.stack().currentContext().registerStringRunVar("NEW-PATCH", newHpatch);
      if (!Prims.equality(newHpatch, Nobody)) {
        SelfManager.self().moveTo(newHpatch);
      }
    }
    else {
      if (Prims.gt(PrimChecks.turtle.getVariable(7395, 7399, "xcor"), PrimChecks.math.minus(7413, 7414, world.topology.maxPxcor, 1))) {
        world.observer.setGlobal("angle", PrimChecks.math.randomFloat(180));
      }
      else {
        world.observer.setGlobal("angle", PrimChecks.math.randomFloat(360));
      }
      SelfManager.self().right(-(world.observer.getGlobal("angle")));
      if (PrimChecks.turtle.getVariable(7573, 7583, "ambulance?")) {
        SelfManager.self().fd(PrimChecks.math.mult(7618, 7619, PrimChecks.validator.checkArg('*', 7618, 7619, 1, world.observer.getGlobal("intra-mobility")), 5));
      }
      else {
        SelfManager.self().fd(world.observer.getGlobal("intra-mobility"));
      }
    }
  }
}))
ProcedurePrims.defineCommand("clear-count", 7691, 7744, (function() {
  PrimChecks.turtle.setVariable(7709, 7720, "nb-infected", 0);
  PrimChecks.turtle.setVariable(7729, 7741, "nb-recovered", 0);
}))
ProcedurePrims.defineCommand("maybe-recover", 7752, 8466, (function() {
  PrimChecks.turtle.setVariable(7772, 7788, "infection-length", PrimChecks.math.plus(7806, 7807, PrimChecks.validator.checkArg('+', 7806, 7807, 1, PrimChecks.turtle.getVariable(7789, 7805, "infection-length")), 1));
  if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 7939, 7942, 2, PrimChecks.turtle.getVariable(7943, 7956, "hospitalized?")))) {
    if (Prims.gt(PrimChecks.turtle.getVariable(7976, 7992, "infection-length"), PrimChecks.turtle.getVariable(7995, 8008, "recovery-time"))) {
      if (Prims.lt(PrimChecks.math.randomFloat(100), world.observer.getGlobal("recovery-chance"))) {
        PrimChecks.turtle.setVariable(8095, 8104, "infected?", false);
        PrimChecks.turtle.setVariable(8127, 8133, "cured?", true);
        PrimChecks.turtle.setVariable(8155, 8167, "nb-recovered", PrimChecks.math.plus(8182, 8183, PrimChecks.validator.checkArg('+', 8182, 8183, 1, PrimChecks.turtle.getVariable(8169, 8181, "nb-recovered")), 1));
      }
    }
  }
  else {
    if (Prims.gt(PrimChecks.turtle.getVariable(8296, 8312, "infection-length"), PrimChecks.math.div(8330, 8331, PrimChecks.validator.checkArg('/', 8330, 8331, 1, PrimChecks.turtle.getVariable(8316, 8329, "recovery-time")), 5))) {
      PrimChecks.turtle.setVariable(8359, 8368, "infected?", false);
      PrimChecks.turtle.setVariable(8389, 8395, "cured?", true);
      PrimChecks.turtle.setVariable(8415, 8427, "nb-recovered", PrimChecks.math.plus(8442, 8443, PrimChecks.validator.checkArg('+', 8442, 8443, 1, PrimChecks.turtle.getVariable(8429, 8441, "nb-recovered")), 1));
    }
  }
}))
ProcedurePrims.defineCommand("isolate", 8559, 8701, (function() {
  PrimChecks.turtle.setVariable(8593, 8602, "isolated?", true);
  SelfManager.self().moveTo(SelfManager.self().getPatchHere());
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 8658, 8661, 1904, SelfManager.self()._optimalPatchHereInternal()), function() { PrimChecks.patch.setVariable(8683, 8689, "pcolor", PrimChecks.math.minus(8695, 8696, 5, 3)); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8658, 8661, R); return R; }
}))
ProcedurePrims.defineCommand("unisolate", 8764, 9177, (function() {
  PrimChecks.turtle.setVariable(8801, 8810, "isolated?", false);
  PrimChecks.turtle.setVariable(8823, 8836, "hospitalized?", false);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 8846, 8849, 1904, SelfManager.self()._optimalPatchHereInternal()), function() { PrimChecks.patch.setVariable(8871, 8877, "pcolor", 0); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8846, 8849, R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 8889, 8892, 1904, world.observer.getGlobal("border")), function() { PrimChecks.patch.setVariable(8906, 8912, "pcolor", 45); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8889, 8892, R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 8982, 8985, 1904, world.getPatchAt(PrimChecks.math.div(9006, 9007, PrimChecks.math.unaryminus(world.topology.maxPxcor), 2), 0)), function() { PrimChecks.patch.setVariable(9020, 9026, "pcolor", 9.9); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8982, 8985, R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 9080, 9083, 1904, world.getPatchAt(PrimChecks.math.div(9102, 9103, world.topology.maxPxcor, 2), 0)), function() { PrimChecks.patch.setVariable(9116, 9122, "pcolor", 9.9); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(9080, 9083, R); return R; }
}))
ProcedurePrims.defineCommand("hospitalize", 9265, 9473, (function() {
  PrimChecks.turtle.setVariable(9303, 9316, "hospitalized?", true);
  PrimChecks.patch.setVariable(9328, 9334, "pcolor", 0);
  if (Prims.equality(PrimChecks.turtle.getVariable(9350, 9359, "continent"), 1)) {
    SelfManager.self().moveTo(world.getPatchAt(PrimChecks.math.div(9399, 9400, PrimChecks.math.unaryminus(world.topology.maxPxcor), 2), 0));
  }
  else {
    SelfManager.self().moveTo(world.getPatchAt(PrimChecks.math.div(9443, 9444, world.topology.maxPxcor, 2), 0));
  }
  PrimChecks.patch.setVariable(9460, 9466, "pcolor", 9.9);
}))
ProcedurePrims.defineCommand("infect", 9698, 10414, (function() {
  let _CALLER_ = SelfManager.self(); ProcedurePrims.stack().currentContext().registerStringRunVar("CALLER", _CALLER_);
  let nearbyHuninfected = PrimChecks.agentset.with(9801, 9805, PrimChecks.agentset.turtlesOn(SelfManager.self().getNeighbors()), function() {
    return ((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 9808, 9811, 2, PrimChecks.turtle.getVariable(9812, 9821, "infected?"))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 9826, 9829, 2, PrimChecks.turtle.getVariable(9830, 9836, "cured?")))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 9841, 9844, 2, PrimChecks.turtle.getVariable(9845, 9856, "inoculated?"))));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("NEARBY-UNINFECTED", nearbyHuninfected);
  if (!Prims.equality(nearbyHuninfected, Nobody)) {
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 9907, 9910, 1904, nearbyHuninfected), function() {
      if (LinkPrims.isLinkNeighbor("LINKS", _CALLER_)) {
        if (Prims.lt(RandomPrims.randomLong(100), PrimChecks.math.mult(10037, 10038, PrimChecks.validator.checkArg('*', 10037, 10038, 1, world.observer.getGlobal("infection-chance")), 2))) {
          PrimChecks.turtle.setVariable(10120, 10129, "infected?", true);
          PrimChecks.turtle.setVariable(10154, 10165, "nb-infected", PrimChecks.math.plus(10179, 10180, PrimChecks.validator.checkArg('+', 10179, 10180, 1, PrimChecks.turtle.getVariable(10167, 10178, "nb-infected")), 1));
        }
      }
      else {
        if (Prims.lt(RandomPrims.randomLong(100), world.observer.getGlobal("infection-chance"))) {
          PrimChecks.turtle.setVariable(10305, 10314, "infected?", true);
          PrimChecks.turtle.setVariable(10339, 10350, "nb-infected", PrimChecks.math.plus(10364, 10365, PrimChecks.validator.checkArg('+', 10364, 10365, 1, PrimChecks.turtle.getVariable(10352, 10363, "nb-infected")), 1));
        }
      }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(9907, 9910, R); return R; }
  }
}))
ProcedurePrims.defineCommand("calculate-r0", 10423, 11922, (function() {
  let newHinfected = PrimChecks.list.sum(10456, 10459, PrimChecks.validator.checkArg('SUM', 10456, 10459, 8, PrimChecks.agentset.of(world.turtles(), function() { return PrimChecks.turtle.getVariable(10462, 10473, "nb-infected"); }))); ProcedurePrims.stack().currentContext().registerStringRunVar("NEW-INFECTED", newHinfected);
  let newHrecovered = PrimChecks.list.sum(10507, 10510, PrimChecks.validator.checkArg('SUM', 10507, 10510, 8, PrimChecks.agentset.of(world.turtles(), function() { return PrimChecks.turtle.getVariable(10513, 10525, "nb-recovered"); }))); ProcedurePrims.stack().currentContext().registerStringRunVar("NEW-RECOVERED", newHrecovered);
  world.observer.setGlobal("nb-infected-previous", PrimChecks.math.minus(10616, 10617, PrimChecks.math.plus(10600, 10601, PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(10588, 10597, "infected?"); }), PrimChecks.validator.checkArg('+', 10600, 10601, 1, newHrecovered)), PrimChecks.validator.checkArg('-', 10616, 10617, 1, newHinfected)));
  let susceptibleHt = PrimChecks.math.minus(10756, 10757, PrimChecks.math.minus(10719, 10720, PrimChecks.validator.checkArg('-', 10719, 10720, 1, world.observer.getGlobal("initial-people")), PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(10743, 10752, "infected?"); })), PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(10780, 10786, "cured?"); })); ProcedurePrims.stack().currentContext().registerStringRunVar("SUSCEPTIBLE-T", susceptibleHt);
  let s0 = PrimChecks.agentset.countWith(null, null, world.turtles(), function() { return PrimChecks.turtle.getVariable(10852, 10864, "susceptible?"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("S0", s0);
  if (Prims.lt(world.observer.getGlobal("nb-infected-previous"), 10)) {
    world.observer.setGlobal("beta-n", 0);
  }
  else {
    world.observer.setGlobal("beta-n", PrimChecks.math.div(10989, 10990, PrimChecks.validator.checkArg('/', 10989, 10990, 1, newHinfected), PrimChecks.validator.checkArg('/', 10989, 10990, 1, world.observer.getGlobal("nb-infected-previous"))));
  }
  if (Prims.lt(world.observer.getGlobal("nb-infected-previous"), 5)) {
    world.observer.setGlobal("gamma", 0);
  }
  else {
    world.observer.setGlobal("gamma", PrimChecks.math.div(11190, 11191, PrimChecks.validator.checkArg('/', 11190, 11191, 1, newHrecovered), PrimChecks.validator.checkArg('/', 11190, 11191, 1, world.observer.getGlobal("nb-infected-previous"))));
  }
  if ((!Prims.equality(PrimChecks.math.minus(11316, 11317, PrimChecks.validator.checkArg('-', 11316, 11317, 1, world.observer.getGlobal("initial-people")), PrimChecks.validator.checkArg('-', 11316, 11317, 1, susceptibleHt)), 0) && !Prims.equality(susceptibleHt, 0))) {
    world.observer.setGlobal("r0", PrimChecks.math.div(11865, 11866, PrimChecks.math.ln(11841, 11843, PrimChecks.math.div(11848, 11849, PrimChecks.validator.checkArg('/', 11848, 11849, 1, s0), PrimChecks.validator.checkArg('/', 11848, 11849, 1, susceptibleHt))), PrimChecks.math.minus(11883, 11884, PrimChecks.validator.checkArg('-', 11883, 11884, 1, world.observer.getGlobal("initial-people")), PrimChecks.validator.checkArg('-', 11883, 11884, 1, susceptibleHt))));
    world.observer.setGlobal("r0", PrimChecks.math.mult(11915, 11916, PrimChecks.validator.checkArg('*', 11915, 11916, 1, world.observer.getGlobal("r0")), PrimChecks.validator.checkArg('*', 11915, 11916, 1, s0)));
  }
}))
world.observer.setGlobal("initial-people", 250);
world.observer.setGlobal("average-isolation-tendency", 5);
world.observer.setGlobal("inoculation-chance", 10);
world.observer.setGlobal("initial-ambulance", 2);
world.observer.setGlobal("average-hospital-going-tendency", 5);
world.observer.setGlobal("infection-chance", 55);
world.observer.setGlobal("recovery-chance", 45);
world.observer.setGlobal("links?", false);
world.observer.setGlobal("intra-mobility", 0.4);
world.observer.setGlobal("travel?", false);
world.observer.setGlobal("travel-tendency", 1);
world.observer.setGlobal("average-recovery-time", 110);