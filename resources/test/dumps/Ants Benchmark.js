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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"ant":{"name":"ant","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[136,129,144,119,124,114,97,132,93,111,127,172,189,208,171,202,204,186,177,180,159,170,165],"ycors":[61,46,30,45,60,82,37,10,36,84,105,105,84,35,11,35,37,82,60,44,32,44,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,139,125,137,135,150,166,161,174,158,164],"ycors":[95,103,117,149,180,196,204,195,180,150,116,102],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[149,128,114,134,149,166,185,171,149],"ycors":[186,197,232,270,282,270,232,195,186],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[225,230,159,161,234,236],"ycors":[66,107,122,127,111,106],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[78,99,139,137,95],"ycors":[58,116,123,128,119],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[48,90,129,130,86],"ycors":[103,147,147,151,151],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[65,92,134,135,95],"ycors":[224,171,160,164,175],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[235,210,163,161,208],"ycors":[222,170,162,166,174],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[249,211,168,168,213],"ycors":[107,147,147,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Food in each pile';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('food-in-pile1', plotOps.makePenOps, false, new PenBundle.State(85, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('food-in-pile2', plotOps.makePenOps, false, new PenBundle.State(95, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('food-in-pile3', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "Time", "Food", false, true, true, 0, 100, 0, 100, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["carrying-food?", "drop-size"], [])('globals [result] turtles-own [ carrying-food? drop-size ] patches-own [ chemical food nest? nest-scent food-source-number ]  ;;;;;;;;;;;;;;;;;;;;;;;; ;;; Setup Procedures ;;; ;;;;;;;;;;;;;;;;;;;;;;;; to setup   ca reset-ticks   setup-turtles   setup-patches   do-plotting end  to benchmark   random-seed 337   reset-timer   setup   repeat 800 [ go ]   set result timer end  to setup-turtles   set-default-shape turtles \"bug\"   cro ants [     set size 2  ;; easier to see this way     rt random-float 360     set color red     set carrying-food? false   ] end  to setup-patches   ask patches [     set chemical 0     set food 0     set food-source-number -1     setup-nest     setup-food     update-display   ] end  to setup-nest  ;; patch procedure   ;; set nest? variable to true inside the nest   set nest? ((distancexy 0 0) < 5)   ;; spread a nest-scent over the whole screen -- stronger near the nest   set nest-scent (200 - (distancexy 0 0)) end  to setup-food  ;; patch procedure   ;; setup food source one on the right of screen   if ((distancexy (0.6 * max-pxcor) 0) < 5)   [ set food-source-number 1 ]    ;; setup food source two on the lower-left of screen   if ((distancexy (-0.6 * max-pxcor) (-0.6 * max-pycor)) < 5)   [ set food-source-number 2 ]    ;; setup food source three on the upper-left of screen   if ((distancexy (-0.8 * max-pxcor) (0.8 * max-pycor)) < 5)   [ set food-source-number 3 ]    ;; set \"food\" at sources to either 1 or 2   if (food-source-number > 0)   [ set food (1 + random 2) ] end  to update-display  ;; patch procedure   ;; give color to nest and food sources   ifelse nest?   [ set pcolor violet ]   [ ifelse (food > 0)     [ if (food-source-number = 1) [ set pcolor cyan ]       if (food-source-number = 2) [ set pcolor sky  ]       if (food-source-number = 3) [ set pcolor blue ]     ]     [ set pcolor scale-color green chemical 0.1 5 ] ;; scale color to show chemical concentration   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;; ;;; Runtime Procedures ;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;  to go  ;; forever button   ask turtles [ go-turtles ]   diffuse chemical (diffusion-rate / 100)   ask patches [ go-patches ]   tick   do-plotting end  to go-turtles  ;; turtle procedure   if (who < ticks) ;; delay the initial departure of ants   [ ifelse carrying-food?     [set color orange + 1 return-to-nest ]  ;; if ant finds food, it returns to the nest     [set color red    look-for-food  ]  ;; otherwise it keeps looking   ] end  to go-patches  ;; patch procedure   set chemical (chemical * (100 - evaporation-rate) / 100)  ;;slowly evaporate chemical   update-display  ;; Refresh the Display end  to return-to-nest  ;; turtle procedure   ifelse nest?  ;; if ant is in the nest, it drops food and heads out again   [ set carrying-food? false     rt 180 fd 1   ]   [ set chemical (chemical + drop-size) ;; drop some chemical, but the amount decreases each time     set drop-size (drop-size - 1.5)     if (drop-size < 1) [set drop-size 1]     uphill-nest-scent   ;; head toward the greatest value of nest-scent     wiggle              ;; which is toward the nest     fd 1] end  to look-for-food  ;; turtle procedure   if (food > 0)   [ set carrying-food? true  ;; pick up food     set food (food - 1)      ;; and reduce the food source     set drop-size 60     rt 180 stop         ;; and turn around   ]   ifelse (chemical > 2)   [ fd 1 ]   [ ifelse (chemical < 0.05) ;; go in the direction where the chemical smell is strongest     [ wiggle       fd 1]     [ uphill-chemical       fd 1]   ] end  to uphill-chemical  ;; turtle procedure   wiggle   ;; sniff left and right, and go where the strongest smell is   let scent-ahead [chemical] of patch-ahead 1   let scent-right chemical-scent 45   let scent-left chemical-scent -45    if ((scent-right > scent-ahead) or (scent-left > scent-ahead))     [ ifelse (scent-right > scent-left)       [ rt 45 ]       [ lt 45 ]   ] end  to uphill-nest-scent  ;; turtle procedure   wiggle    ;; sniff left and right, and go where the strongest smell is   let scent-ahead [nest-scent] of patch-ahead 1   let scent-right get-nest-scent 45   let scent-left get-nest-scent -45    if ((scent-right > scent-ahead) or (scent-left > scent-ahead))   [ ifelse (scent-right > scent-left)     [ rt 45 ]     [ lt 45 ]   ] end  to wiggle  ;; turtle procedure   rt random 40 - random 40   if not can-move? 1   [ rt 180 ] end  to-report get-nest-scent [ angle ]   let p patch-right-and-ahead angle 1   if p != nobody   [ report [nest-scent] of p ]   report 0 end  to-report chemical-scent [ angle ]   let p patch-right-and-ahead angle 1   if p != nobody   [ report [chemical] of p ]   report 0 end  to do-plotting   if not plot? [ stop ]   set-current-plot \"Food in each pile\"   set-current-plot-pen \"food-in-pile1\"   plot count patches with [pcolor = cyan]   set-current-plot-pen \"food-in-pile2\"   plot count patches with [pcolor = sky]   set-current-plot-pen \"food-in-pile3\"   plot count patches with [pcolor = blue] end')([{"x":254,"y":10,"width":515,"height":536,"dimensions":{"minPxcor":-50,"maxPxcor":50,"minPycor":-50,"maxPycor":50,"patchSize":5,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup\"); if (R === StopInterrupt) { return R; }","type":"button","source":"setup","x":9,"y":38,"width":55,"height":33,"oldSize":true,"display":"Setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 99; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 1; })","type":"slider","variable":"diffusion-rate","x":9,"y":128,"width":179,"height":33,"oldSize":true,"display":"diffusion-rate","min":"0","max":"99","default":53,"step":"1","direction":"horizontal","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 99; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 1; })","type":"slider","variable":"evaporation-rate","x":9,"y":169,"width":179,"height":33,"oldSize":true,"display":"evaporation-rate","min":"0","max":"99","default":10,"step":"1","direction":"horizontal","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","type":"button","source":"go","x":88,"y":38,"width":55,"height":33,"oldSize":true,"display":"Go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"compilation":{"success":true,"messages":[]}}, {"variable":"plot?","x":160,"y":38,"width":90,"height":33,"oldSize":true,"display":"plot?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 300; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 1; })","type":"slider","variable":"ants","x":9,"y":87,"width":179,"height":33,"oldSize":true,"display":"ants","min":"0","max":"300","default":300,"step":"1","direction":"horizontal","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","type":"pen","display":"food-in-pile1","interval":1,"mode":0,"color":-11221820,"inLegend":true,"setupCode":"","updateCode":"","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","type":"pen","display":"food-in-pile2","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","type":"pen","display":"food-in-pile3","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","compilation":{"success":true,"messages":[]}}],"type":"plot","display":"Food in each pile","x":10,"y":360,"width":229,"height":164,"oldSize":true,"xAxis":"Time","yAxis":"Food","xmin":0,"xmax":100,"ymin":0,"ymax":100,"autoPlotX":true,"autoPlotY":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"food-in-pile1","interval":1,"mode":0,"color":-11221820,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"food-in-pile2","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"food-in-pile3","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"benchmark\"); if (R === StopInterrupt) { return R; }","type":"button","source":"benchmark","x":6,"y":211,"width":178,"height":128,"oldSize":true,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"result\"); })","type":"monitor","source":"result","x":20,"y":290,"width":151,"height":45,"oldSize":true,"precision":17,"fontSize":11,"compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["diffusion-rate", "evaporation-rate", "plot?", "ants", "result"], ["diffusion-rate", "evaporation-rate", "plot?", "ants"], ["chemical", "food", "nest?", "nest-scent", "food-source-number"], -50, 50, -50, 50, 5, false, false, turtleShapes, linkShapes, function(){});
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
ProcedurePrims.defineCommand("setup", 203, 272, (function() {
  world.clearAll();
  world.ticker.reset();
  var R = ProcedurePrims.callCommand("setup-turtles"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("setup-patches"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("do-plotting"); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("benchmark", 280, 369, (function() {
  PrimChecks.math.randomSeed(292, 303, 337);
  workspace.timer.reset();
  var R = ProcedurePrims.callCommand("setup"); if (R === DeathInterrupt) { return R; }
  for (let _index_332_338 = 0, _repeatcount_332_338 = StrictMath.floor(800); _index_332_338 < _repeatcount_332_338; _index_332_338++) {
    var R = ProcedurePrims.callCommand("go"); if (R === DeathInterrupt) { return R; }
  }
  world.observer.setGlobal("result", workspace.timer.elapsed());
}))
ProcedurePrims.defineCommand("setup-turtles", 377, 555, (function() {
  BreedManager.setDefaultShape(world.turtles().getSpecialName(), "bug")
  var R = ProcedurePrims.ask(world.turtleManager.createOrderedTurtles(world.observer.getGlobal("ants"), ""), function() {
    PrimChecks.turtle.setVariable(446, 450, "size", 2);
    SelfManager.self().right(PrimChecks.math.randomFloat(360));
    PrimChecks.turtleOrLink.setVariable(512, 517, "color", 15);
    PrimChecks.turtle.setVariable(530, 544, "carrying-food?", false);
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(427, 430, R); return R; }
}))
ProcedurePrims.defineCommand("setup-patches", 563, 710, (function() {
  var R = ProcedurePrims.ask(world.patches(), function() {
    PrimChecks.patch.setVariable(601, 609, "chemical", 0);
    PrimChecks.patch.setVariable(620, 624, "food", 0);
    PrimChecks.patch.setVariable(635, 653, "food-source-number", -1);
    var R = ProcedurePrims.callCommand("setup-nest"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("setup-food"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("update-display"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(579, 582, R); return R; }
}))
ProcedurePrims.defineCommand("setup-nest", 718, 947, (function() {
  PrimChecks.patch.setVariable(803, 808, "nest?", Prims.lt(SelfManager.self().distanceXY(0, 0), 5));
  PrimChecks.patch.setVariable(911, 921, "nest-scent", PrimChecks.math.minus(927, 928, 200, SelfManager.self().distanceXY(0, 0)));
}))
ProcedurePrims.defineCommand("setup-food", 955, 1515, (function() {
  if (Prims.lt(SelfManager.self().distanceXY(PrimChecks.math.mult(1059, 1060, 0.6, world.topology.maxPxcor), 0), 5)) {
    PrimChecks.patch.setVariable(1088, 1106, "food-source-number", 1);
  }
  if (Prims.lt(SelfManager.self().distanceXY(PrimChecks.math.mult(1191, 1192, -0.6, world.topology.maxPxcor), PrimChecks.math.mult(1210, 1211, -0.6, world.topology.maxPycor)), 5)) {
    PrimChecks.patch.setVariable(1237, 1255, "food-source-number", 2);
  }
  if (Prims.lt(SelfManager.self().distanceXY(PrimChecks.math.mult(1342, 1343, -0.8, world.topology.maxPxcor), PrimChecks.math.mult(1360, 1361, 0.8, world.topology.maxPycor)), 5)) {
    PrimChecks.patch.setVariable(1387, 1405, "food-source-number", 3);
  }
  if (Prims.gt(PrimChecks.patch.getVariable(1461, 1479, "food-source-number"), 0)) {
    PrimChecks.patch.setVariable(1493, 1497, "food", PrimChecks.math.plus(1501, 1502, 1, RandomPrims.randomLong(2)));
  }
}))
ProcedurePrims.defineCommand("update-display", 1523, 1930, (function() {
  if (PrimChecks.patch.getVariable(1608, 1613, "nest?")) {
    PrimChecks.patch.setVariable(1622, 1628, "pcolor", 115);
  }
  else {
    if (Prims.gt(PrimChecks.patch.getVariable(1650, 1654, "food"), 0)) {
      if (Prims.equality(PrimChecks.patch.getVariable(1670, 1688, "food-source-number"), 1)) {
        PrimChecks.patch.setVariable(1700, 1706, "pcolor", 85);
      }
      if (Prims.equality(PrimChecks.patch.getVariable(1724, 1742, "food-source-number"), 2)) {
        PrimChecks.patch.setVariable(1754, 1760, "pcolor", 95);
      }
      if (Prims.equality(PrimChecks.patch.getVariable(1778, 1796, "food-source-number"), 3)) {
        PrimChecks.patch.setVariable(1808, 1814, "pcolor", 105);
      }
    }
    else {
      PrimChecks.patch.setVariable(1838, 1844, "pcolor", ColorModel.scaleColor(55, PrimChecks.patch.getVariable(1863, 1871, "chemical"), 0.1, 5));
    }
  }
}))
ProcedurePrims.defineCommand("go", 2020, 2163, (function() {
  var R = ProcedurePrims.ask(world.turtles(), function() { var R = ProcedurePrims.callCommand("go-turtles"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2044, 2047, R); return R; }
  world.topology.diffuse("chemical", PrimChecks.math.div(2106, 2107, PrimChecks.validator.checkArg('/', 2106, 2107, 1, world.observer.getGlobal("diffusion-rate")), 100), false)
  var R = ProcedurePrims.ask(world.patches(), function() { var R = ProcedurePrims.callCommand("go-patches"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2115, 2118, R); return R; }
  world.ticker.tick();
  var R = ProcedurePrims.callCommand("do-plotting"); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("go-turtles", 2171, 2450, (function() {
  if (Prims.lt(PrimChecks.turtle.getVariable(2209, 2212, "who"), world.ticker.tickCount())) {
    if (PrimChecks.turtle.getVariable(2272, 2286, "carrying-food?")) {
      PrimChecks.turtleOrLink.setVariable(2296, 2301, "color", PrimChecks.math.plus(2309, 2310, 25, 1));
      var R = ProcedurePrims.callCommand("return-to-nest"); if (R === DeathInterrupt) { return R; }
    }
    else {
      PrimChecks.turtleOrLink.setVariable(2385, 2390, "color", 15);
      var R = ProcedurePrims.callCommand("look-for-food"); if (R === DeathInterrupt) { return R; }
    }
  }
}))
ProcedurePrims.defineCommand("go-patches", 2458, 2618, (function() {
  PrimChecks.patch.setVariable(2495, 2503, "chemical", PrimChecks.math.div(2541, 2542, PrimChecks.math.mult(2514, 2515, PrimChecks.validator.checkArg('*', 2514, 2515, 1, PrimChecks.patch.getVariable(2505, 2513, "chemical")), PrimChecks.math.minus(2521, 2522, 100, PrimChecks.validator.checkArg('-', 2521, 2522, 1, world.observer.getGlobal("evaporation-rate")))), 100));
  var R = ProcedurePrims.callCommand("update-display"); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("return-to-nest", 2626, 3096, (function() {
  if (PrimChecks.patch.getVariable(2671, 2676, "nest?")) {
    PrimChecks.turtle.setVariable(2746, 2760, "carrying-food?", false);
    SelfManager.self().right(180);
    SelfManager.self()._optimalFdOne();
  }
  else {
    PrimChecks.patch.setVariable(2795, 2803, "chemical", PrimChecks.math.plus(2814, 2815, PrimChecks.validator.checkArg('+', 2814, 2815, 1, PrimChecks.patch.getVariable(2805, 2813, "chemical")), PrimChecks.validator.checkArg('+', 2814, 2815, 1, PrimChecks.turtle.getVariable(2816, 2825, "drop-size"))));
    PrimChecks.turtle.setVariable(2893, 2902, "drop-size", PrimChecks.math.minus(2914, 2915, PrimChecks.validator.checkArg('-', 2914, 2915, 1, PrimChecks.turtle.getVariable(2904, 2913, "drop-size")), 1.5));
    if (Prims.lt(PrimChecks.turtle.getVariable(2929, 2938, "drop-size"), 1)) {
      PrimChecks.turtle.setVariable(2949, 2958, "drop-size", 1);
    }
    var R = ProcedurePrims.callCommand("uphill-nest-scent"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("wiggle"); if (R === DeathInterrupt) { return R; }
    SelfManager.self()._optimalFdOne();
  }
}))
ProcedurePrims.defineCommand("look-for-food", 3104, 3515, (function() {
  if (Prims.gt(PrimChecks.patch.getVariable(3145, 3149, "food"), 0)) {
    PrimChecks.turtle.setVariable(3163, 3177, "carrying-food?", true);
    PrimChecks.patch.setVariable(3208, 3212, "food", PrimChecks.math.minus(3219, 3220, PrimChecks.validator.checkArg('-', 3219, 3220, 1, PrimChecks.patch.getVariable(3214, 3218, "food")), 1));
    PrimChecks.turtle.setVariable(3267, 3276, "drop-size", 60);
    SelfManager.self().right(180);
    return PrimChecks.procedure.stop(3291, 3295);
  }
  if (Prims.gt(PrimChecks.patch.getVariable(3337, 3345, "chemical"), 2)) {
    SelfManager.self()._optimalFdOne();
  }
  else {
    if (Prims.lt(PrimChecks.patch.getVariable(3374, 3382, "chemical"), 0.05)) {
      var R = ProcedurePrims.callCommand("wiggle"); if (R === DeathInterrupt) { return R; }
      SelfManager.self()._optimalFdOne();
    }
    else {
      var R = ProcedurePrims.callCommand("uphill-chemical"); if (R === DeathInterrupt) { return R; }
      SelfManager.self()._optimalFdOne();
    }
  }
}))
ProcedurePrims.defineCommand("uphill-chemical", 3523, 3892, (function() {
  var R = ProcedurePrims.callCommand("wiggle"); if (R === DeathInterrupt) { return R; }
  let scentHahead = PrimChecks.agentset.of(SelfManager.self().patchAhead(1), function() { return PrimChecks.patch.getVariable(3651, 3659, "chemical"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("SCENT-AHEAD", scentHahead);
  let scentHright = PrimChecks.procedure.callReporter(3696, 3710, "chemical-scent", 45); ProcedurePrims.stack().currentContext().registerStringRunVar("SCENT-RIGHT", scentHright);
  let scentHleft = PrimChecks.procedure.callReporter(3731, 3745, "chemical-scent", -45); ProcedurePrims.stack().currentContext().registerStringRunVar("SCENT-LEFT", scentHleft);
  if ((Prims.gt(scentHright, scentHahead) || Prims.gt(scentHleft, scentHahead))) {
    if (Prims.gt(scentHright, scentHleft)) {
      SelfManager.self().right(45);
    }
    else {
      SelfManager.self().right(-(45));
    }
  }
}))
ProcedurePrims.defineCommand("uphill-nest-scent", 3900, 4268, (function() {
  var R = ProcedurePrims.callCommand("wiggle"); if (R === DeathInterrupt) { return R; }
  let scentHahead = PrimChecks.agentset.of(SelfManager.self().patchAhead(1), function() { return PrimChecks.patch.getVariable(4031, 4041, "nest-scent"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("SCENT-AHEAD", scentHahead);
  let scentHright = PrimChecks.procedure.callReporter(4078, 4092, "get-nest-scent", 45); ProcedurePrims.stack().currentContext().registerStringRunVar("SCENT-RIGHT", scentHright);
  let scentHleft = PrimChecks.procedure.callReporter(4113, 4127, "get-nest-scent", -45); ProcedurePrims.stack().currentContext().registerStringRunVar("SCENT-LEFT", scentHleft);
  if ((Prims.gt(scentHright, scentHahead) || Prims.gt(scentHleft, scentHahead))) {
    if (Prims.gt(scentHright, scentHleft)) {
      SelfManager.self().right(45);
    }
    else {
      SelfManager.self().right(-(45));
    }
  }
}))
ProcedurePrims.defineCommand("wiggle", 4276, 4365, (function() {
  SelfManager.self().right(PrimChecks.math.minus(4319, 4320, RandomPrims.randomLong(40), RandomPrims.randomLong(40)));
  if (PrimChecks.math.not(SelfManager.self().canMove(1))) {
    SelfManager.self().right(180);
  }
}))
ProcedurePrims.defineReporter("get-nest-scent", 4380, 4502, (function(angle) {
  let p = SelfManager.self().patchRightAndAhead(angle, 1); ProcedurePrims.stack().currentContext().registerStringRunVar("P", p);
  if (!Prims.equality(p, Nobody)) {
    return PrimChecks.procedure.report(4464, 4470, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 4484, 4486, 1904, p), function() { return PrimChecks.patch.getVariable(4472, 4482, "nest-scent"); }));
  }
  return PrimChecks.procedure.report(4493, 4499, 0);
}))
ProcedurePrims.defineReporter("chemical-scent", 4517, 4637, (function(angle) {
  let p = SelfManager.self().patchRightAndAhead(angle, 1); ProcedurePrims.stack().currentContext().registerStringRunVar("P", p);
  if (!Prims.equality(p, Nobody)) {
    return PrimChecks.procedure.report(4601, 4607, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 4619, 4621, 1904, p), function() { return PrimChecks.patch.getVariable(4609, 4617, "chemical"); }));
  }
  return PrimChecks.procedure.report(4628, 4634, 0);
}))
ProcedurePrims.defineCommand("do-plotting", 4645, 4962, (function() {
  if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 4662, 4665, 2, world.observer.getGlobal("plot?")))) {
    return PrimChecks.procedure.stop(4674, 4678);
  }
  plotManager.setCurrentPlot("Food in each pile");
  plotManager.setCurrentPen("food-in-pile1");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.patches(), function() { return Prims.equality(PrimChecks.patch.getVariable(4786, 4792, "pcolor"), 85); }));
  plotManager.setCurrentPen("food-in-pile2");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.patches(), function() { return Prims.equality(PrimChecks.patch.getVariable(4867, 4873, "pcolor"), 95); }));
  plotManager.setCurrentPen("food-in-pile3");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.patches(), function() { return Prims.equality(PrimChecks.patch.getVariable(4947, 4953, "pcolor"), 105); }));
}))
world.observer.setGlobal("diffusion-rate", 53);
world.observer.setGlobal("evaporation-rate", 10);
world.observer.setGlobal("plot?", true);
world.observer.setGlobal("ants", 300);