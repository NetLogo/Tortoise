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
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"sheep":{"name":"sheep","editableColorIndex":15,"rotate":false,"elements":[{"x":203,"y":65,"diam":88,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":70,"y":65,"diam":162,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":150,"y":105,"diam":120,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[218,240,255,278],"ycors":[120,165,165,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false},{"x":214,"y":72,"diam":67,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false},{"xmin":164,"ymin":223,"xmax":179,"ymax":298,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[45,30,30,15,45],"ycors":[285,285,240,195,210],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":3,"y":83,"diam":150,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xmin":65,"ymin":221,"xmax":80,"ymax":296,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[195,210,210,240,195],"ycors":[285,285,240,210,210],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[276,285,302,294],"ycors":[85,105,99,83],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false},{"xcors":[219,210,193,201],"ycors":[85,105,99,83],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"wolf":{"name":"wolf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[253,245,245],"ycors":[133,131,133],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[2,13,30,38,38,20,20,27,38,40,31,31,60,68,75,66,65,82,84,100,103,77,79,100,98,119,143,160,166,172,173,167,160,154,169,178,186,198,200,217,219,207,195,192,210,227,242,259,284,277,293,299,297,273,270],"ycors":[194,197,191,193,205,226,257,265,266,260,253,230,206,198,209,228,243,261,268,267,261,239,231,207,196,201,202,195,210,213,238,251,248,265,264,247,240,260,271,271,262,258,230,198,184,164,144,145,151,141,140,134,127,119,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[-1,14,36,40,53,82,134,159,188,227,236,238,268,269,281,269,269],"ycors":[195,180,166,153,140,131,133,126,115,108,102,98,86,92,87,103,113],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    input: function(str) { return 'dummy implementation'; },
    notify: function(str) {},
    yesOrNo: function(str) { return true; }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.importExport = {
    importWorld: function(trueImportWorld) {
      return function(filename) {
        var Paths = Java.type('java.nio.file.Paths');
        var Files = Java.type('java.nio.file.Files');
        var UTF8  = Java.type('java.nio.charset.StandardCharsets').UTF_8;
        var lines = Files.readAllLines(Paths.get(filename), UTF8);
        var out   = [];
        lines.forEach(function(line) { out.push(line); });
        var fileText = out.join("\n");
        trueImportWorld(fileText);
      }
},
    exportFile: function(str) {
      return function(filepath) {
        var Paths = Java.type('java.nio.file.Paths');
        var Files = Java.type('java.nio.file.Files');
        var UTF8  = Java.type('java.nio.charset.StandardCharsets').UTF_8;
        Files.createDirectories(Paths.get(filepath).getParent());
        var path  = Files.write(Paths.get(filepath), str.getBytes());
      }
},
    importDrawing: function(trueImportDrawing) { return function(filepath) {} },
    exportView: function(filename) {},
    exportOutput: function(filename) {}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.inspection = {
    inspect: function(agent) {},
    stopInspecting: function(agent) {},
    clearDead: function() {}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.world = {
    resizeWorld: function(agent) {}
  }
}
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'energy per particle';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('energy per particle', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          if (Prims.gt(world.ticker.tickCount(), 3)) {
            plotManager.plotValue(Prims.div(world.observer.getGlobal("v-total"), world.observer.getGlobal("num-atoms")));
          }
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
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, -2.0, 2.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])([], [])('globals [\n  max-move-dist\n  cutoff-dist\n  v-total\n  eps\n  total-move-attempts\n  total-successful-moves\n  diameter\n  pot-offset ; This offsets the LJ potential so that it is 0 at the cutoff distance\n  current-move-attempts\n  current-successful-moves\n]\n\nto setup\n  clear-all\n  reset-ticks\n  set eps 1\n  ;Set the diameter of particles based on density\n  set diameter sqrt(density * world-width * world-height / num-atoms)\n  set max-move-dist diameter\n  set cutoff-dist 2.5 * diameter\n  set pot-offset (- (4 * ((diameter / cutoff-dist) ^ 12 - (diameter / cutoff-dist) ^ 6)))\n  set v-total calc-v-total  ;calculate the initial energy\n  create-turtles num-atoms [\n    set shape \"circle\"\n    set size diameter\n    set color blue\n  ]\n  setup-atoms\nend\n\nto go\n  ;Each tick, attempt N moves. On average, every particle moves each tick\n  repeat num-atoms [\n    ask one-of turtles [\n      attempt-move\n    ]\n  ]\n\n  ;tune the move distance to adjust the acceptance rate every NUM-ATOMS ticks\n  if ticks mod num-atoms = 1 [\n    tune-acceptance-rate\n  ]\n\n  tick\nend\n\nto attempt-move\n  set total-move-attempts total-move-attempts + 1  ;the is the total running average\n  set current-move-attempts current-move-attempts + 1 ;this is just since the last max-move-distance adjustment\n  let v-old calc-v; calculate current energy\n  let delta-x (random-float 2 * max-move-dist) - max-move-dist  ; pick random x distance\n  let delta-y (random-float 2 * max-move-dist) - max-move-dist ; pick random y distance\n  setxy (xcor + delta-x) (ycor + delta-y) ;move the random x and y distances\n  let v-new calc-v ;Calculate the new energy\n\n  let delta-v v-new - v-old\n  ifelse (v-new < v-old) or (random-float 1 < exp( - delta-v / temperature) ) [\n    set total-successful-moves total-successful-moves + 1   ;the is the total running average\n    set current-successful-moves current-successful-moves + 1   ;this is just since the last max-move-distance adjustment\n    set v-total v-total + delta-v\n  ] [\n    setxy (xcor - delta-x) (ycor - delta-y) ;reset position\n  ]\nend\n\nto-report calc-v-total\n  report sum [ calc-v ] of turtles / 2 ;divide by two because each particle has been counted twice\nend\n\nto-report calc-v\n  let v 0\n\n  ask other turtles in-radius cutoff-dist [\n    let rsquare (distance myself) ^ 2\n    let dsquare diameter * diameter\n    let attract-term dsquare ^ 3 / rsquare ^ 3\n    let repel-term attract-term * attract-term\n    ;NOTE could do this a little faster by attract-term * (attract-term -1)\n    let vi 4 * eps * (repel-term - attract-term) + pot-offset\n    set v v + vi\n  ]\n  report v\nend\n\nto-report accept-rate\n  report current-successful-moves / current-move-attempts\nend\n\nto tune-acceptance-rate\n  ifelse accept-rate < 0.5 [\n    set max-move-dist max-move-dist * .95\n  ] [\n    set max-move-dist max-move-dist * 1.05\n    if max-move-dist > diameter [\n      set max-move-dist diameter\n    ]\n  ]\n  set current-successful-moves 0\n  set current-move-attempts 0\nend\n\nto-report energy-per-particle\n  report v-total / num-atoms\nend\n\n;*********setup procedures*************\n\nto setup-atoms\n  if initial-config = \"HCP\" [\n    let l sqrt(num-atoms) ;the # of atoms in a row\n    let row-dist (2 ^ (1 / 6)) * diameter ;this is the distance with minimum energy\n    let ypos (- l * row-dist / 2) ;the y position of the first atom\n    let xpos (- l * row-dist / 2) ;the x position of the first atom\n    let r-num 0  ;the row number\n    ask turtles [  ;set the atoms; positions\n      if xpos > (l * row-dist / 2)  [  ;condition to start a new row\n        set r-num r-num + 1\n        set xpos (- l * row-dist / 2) + (r-num mod 2) * row-dist / 2\n        set ypos ypos + row-dist\n      ]\n      setxy xpos ypos  ;if we are still in the same row\n      set xpos xpos + row-dist\n    ]\n  ]\n\n  if initial-config = \"random\" [\n    ask turtles [\n      setxy random-xcor random-ycor\n    ]\n    remove-overlap ;make sure atoms aren\'t overlapping\n  ]\nend\n\nto remove-overlap\n  let r-min 0.7 * diameter\n  ask turtles [\n    while [overlapping r-min] [\n      setxy random-xcor random-ycor\n    ]\n  ]\nend\n\nto-report overlapping [r-min]\n  report any? other turtles in-radius r-min\nend\n\n\n; Copyright 2015 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":239,"top":10,"right":742,"bottom":514,"dimensions":{"minPxcor":-16,"maxPxcor":16,"minPycor":-16,"maxPycor":16,"patchSize":15,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":30,"top":217,"right":204,"bottom":250,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":120,"top":353,"right":204,"bottom":386,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"1000","compiledStep":"1","variable":"num-atoms","left":30,"top":94,"right":202,"bottom":127,"display":"num-atoms","min":"1","max":"1000","default":250,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0.01","compiledMax":"2","compiledStep":"0.01","variable":"temperature","left":31,"top":316,"right":205,"bottom":349,"display":"temperature","min":".01","max":"2","default":0.45,"step":".01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0.01","compiledMax":"0.6","compiledStep":"0.01","variable":"density","left":30,"top":131,"right":202,"bottom":164,"display":"density","min":"0.01","max":".6","default":0.25,"step":".01","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"initial-config","left":30,"top":168,"right":203,"bottom":213,"display":"initial-config","choices":["HCP","random"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('energy per particle', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        if (Prims.gt(world.ticker.tickCount(), 3)) {\n          plotManager.plotValue(Prims.div(world.observer.getGlobal(\"v-total\"), world.observer.getGlobal(\"num-atoms\")));\n        }\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks > 3 [\n  plot v-total / num-atoms\n]","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"energy per particle","left":33,"top":390,"right":215,"bottom":535,"xmin":0,"xmax":10,"ymin":-2,"ymax":2,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"if ticks > 3 [\n  plot v-total / num-atoms\n]","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"display":"1","left":4,"top":10,"right":24,"bottom":46,"fontSize":30,"color":15,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Model starting point. You can\nchoose the number of atoms,\nthe density and the initial\nconfiguration (random or\nhexagonally-close-packed)","left":31,"top":10,"right":238,"bottom":81,"fontSize":11,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"_____________________________","left":31,"top":251,"right":223,"bottom":279,"fontSize":11,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":32,"top":353,"right":117,"bottom":386,"display":"go-once","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"display":"2","left":3,"top":263,"right":27,"bottom":299,"fontSize":30,"color":15,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Adjust the temperature and run\nthe model. The temperature can\nbe adjusted while the model runs\n","left":30,"top":270,"right":231,"bottom":312,"fontSize":11,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["num-atoms", "temperature", "density", "initial-config", "max-move-dist", "cutoff-dist", "v-total", "eps", "total-move-attempts", "total-successful-moves", "diameter", "pot-offset", "current-move-attempts", "current-successful-moves"], ["num-atoms", "temperature", "density", "initial-config"], [], -16, 16, -16, 16, 15.0, true, true, turtleShapes, linkShapes, function(){});
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
      world.ticker.reset();
      world.observer.setGlobal("eps", 1);
      world.observer.setGlobal("diameter", NLMath.sqrt(Prims.div(((world.observer.getGlobal("density") * world.topology.width) * world.topology.height), world.observer.getGlobal("num-atoms"))));
      world.observer.setGlobal("max-move-dist", world.observer.getGlobal("diameter"));
      world.observer.setGlobal("cutoff-dist", (2.5 * world.observer.getGlobal("diameter")));
      world.observer.setGlobal("pot-offset",  -(4 * (NLMath.pow(Prims.div(world.observer.getGlobal("diameter"), world.observer.getGlobal("cutoff-dist")), 12) - NLMath.pow(Prims.div(world.observer.getGlobal("diameter"), world.observer.getGlobal("cutoff-dist")), 6))));
      world.observer.setGlobal("v-total", procedures["CALC-V-TOTAL"]());
      world.turtleManager.createTurtles(world.observer.getGlobal("num-atoms"), "").ask(function() {
        SelfManager.self().setVariable("shape", "circle");
        SelfManager.self().setVariable("size", world.observer.getGlobal("diameter"));
        SelfManager.self().setVariable("color", 105);
      }, true);
      procedures["SETUP-ATOMS"]();
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
      for (let _index_827_833 = 0, _repeatcount_827_833 = StrictMath.floor(world.observer.getGlobal("num-atoms")); _index_827_833 < _repeatcount_827_833; _index_827_833++){
        ListPrims.oneOf(world.turtles()).ask(function() { procedures["ATTEMPT-MOVE"](); }, true);
      }
      if (Prims.equality(NLMath.mod(world.ticker.tickCount(), world.observer.getGlobal("num-atoms")), 1)) {
        procedures["TUNE-ACCEPTANCE-RATE"]();
      }
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
      world.observer.setGlobal("total-move-attempts", (world.observer.getGlobal("total-move-attempts") + 1));
      world.observer.setGlobal("current-move-attempts", (world.observer.getGlobal("current-move-attempts") + 1));
      let vOld = procedures["CALC-V"](); letVars['vOld'] = vOld;
      let deltaX = ((Prims.randomFloat(2) * world.observer.getGlobal("max-move-dist")) - world.observer.getGlobal("max-move-dist")); letVars['deltaX'] = deltaX;
      let deltaY = ((Prims.randomFloat(2) * world.observer.getGlobal("max-move-dist")) - world.observer.getGlobal("max-move-dist")); letVars['deltaY'] = deltaY;
      SelfManager.self().setXY((SelfManager.self().getVariable("xcor") + deltaX), (SelfManager.self().getVariable("ycor") + deltaY));
      let vNew = procedures["CALC-V"](); letVars['vNew'] = vNew;
      let deltaV = (vNew - vOld); letVars['deltaV'] = deltaV;
      if ((Prims.lt(vNew, vOld) || Prims.lt(Prims.randomFloat(1), NLMath.exp(Prims.div( -deltaV, world.observer.getGlobal("temperature")))))) {
        world.observer.setGlobal("total-successful-moves", (world.observer.getGlobal("total-successful-moves") + 1));
        world.observer.setGlobal("current-successful-moves", (world.observer.getGlobal("current-successful-moves") + 1));
        world.observer.setGlobal("v-total", (world.observer.getGlobal("v-total") + deltaV));
      }
      else {
        SelfManager.self().setXY((SelfManager.self().getVariable("xcor") - deltaX), (SelfManager.self().getVariable("ycor") - deltaY));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["attemptMove"] = temp;
  procs["ATTEMPT-MOVE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(ListPrims.sum(world.turtles().projectionBy(function() { return procedures["CALC-V"](); })), 2)
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
  procs["calcVTotal"] = temp;
  procs["CALC-V-TOTAL"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let v = 0; letVars['v'] = v;
      SelfPrims.other(SelfManager.self().inRadius(world.turtles(), world.observer.getGlobal("cutoff-dist"))).ask(function() {
        let rsquare = NLMath.pow(SelfManager.self().distance(SelfManager.myself()), 2); letVars['rsquare'] = rsquare;
        let dsquare = (world.observer.getGlobal("diameter") * world.observer.getGlobal("diameter")); letVars['dsquare'] = dsquare;
        let attractTerm = Prims.div(NLMath.pow(dsquare, 3), NLMath.pow(rsquare, 3)); letVars['attractTerm'] = attractTerm;
        let repelTerm = (attractTerm * attractTerm); letVars['repelTerm'] = repelTerm;
        let vi = (((4 * world.observer.getGlobal("eps")) * (repelTerm - attractTerm)) + world.observer.getGlobal("pot-offset")); letVars['vi'] = vi;
        v = (v + vi); letVars['v'] = v;
      }, true);
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return v
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
  procs["calcV"] = temp;
  procs["CALC-V"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(world.observer.getGlobal("current-successful-moves"), world.observer.getGlobal("current-move-attempts"))
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
  procs["acceptRate"] = temp;
  procs["ACCEPT-RATE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(procedures["ACCEPT-RATE"](), 0.5)) {
        world.observer.setGlobal("max-move-dist", (world.observer.getGlobal("max-move-dist") * 0.95));
      }
      else {
        world.observer.setGlobal("max-move-dist", (world.observer.getGlobal("max-move-dist") * 1.05));
        if (Prims.gt(world.observer.getGlobal("max-move-dist"), world.observer.getGlobal("diameter"))) {
          world.observer.setGlobal("max-move-dist", world.observer.getGlobal("diameter"));
        }
      }
      world.observer.setGlobal("current-successful-moves", 0);
      world.observer.setGlobal("current-move-attempts", 0);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["tuneAcceptanceRate"] = temp;
  procs["TUNE-ACCEPTANCE-RATE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return Prims.div(world.observer.getGlobal("v-total"), world.observer.getGlobal("num-atoms"))
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
  procs["energyPerParticle"] = temp;
  procs["ENERGY-PER-PARTICLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("initial-config"), "HCP")) {
        let l = NLMath.sqrt(world.observer.getGlobal("num-atoms")); letVars['l'] = l;
        let rowDist = (NLMath.pow(2, Prims.div(1, 6)) * world.observer.getGlobal("diameter")); letVars['rowDist'] = rowDist;
        let ypos = Prims.div(( -l * rowDist), 2); letVars['ypos'] = ypos;
        let xpos = Prims.div(( -l * rowDist), 2); letVars['xpos'] = xpos;
        let rNum = 0; letVars['rNum'] = rNum;
        world.turtles().ask(function() {
          if (Prims.gt(xpos, Prims.div((l * rowDist), 2))) {
            rNum = (rNum + 1); letVars['rNum'] = rNum;
            xpos = (Prims.div(( -l * rowDist), 2) + Prims.div((NLMath.mod(rNum, 2) * rowDist), 2)); letVars['xpos'] = xpos;
            ypos = (ypos + rowDist); letVars['ypos'] = ypos;
          }
          SelfManager.self().setXY(xpos, ypos);
          xpos = (xpos + rowDist); letVars['xpos'] = xpos;
        }, true);
      }
      if (Prims.equality(world.observer.getGlobal("initial-config"), "random")) {
        world.turtles().ask(function() {
          SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor));
        }, true);
        procedures["REMOVE-OVERLAP"]();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupAtoms"] = temp;
  procs["SETUP-ATOMS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let rMin = (0.7 * world.observer.getGlobal("diameter")); letVars['rMin'] = rMin;
      world.turtles().ask(function() {
        while (procedures["OVERLAPPING"](rMin)) {
          SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor));
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
  procs["removeOverlap"] = temp;
  procs["REMOVE-OVERLAP"] = temp;
  temp = (function(rMin) {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return SelfPrims._optimalAnyOther(SelfManager.self().inRadius(world.turtles(), rMin))
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
  procs["overlapping"] = temp;
  procs["OVERLAPPING"] = temp;
  return procs;
})();
world.observer.setGlobal("num-atoms", 250);
world.observer.setGlobal("temperature", 0.45);
world.observer.setGlobal("density", 0.25);
world.observer.setGlobal("initial-config", "HCP");
