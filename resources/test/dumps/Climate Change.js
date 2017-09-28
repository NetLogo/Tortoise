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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cloud":{"name":"cloud","editableColorIndex":0,"rotate":false,"elements":[{"x":13,"y":118,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":86,"y":101,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":51,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":118,"y":43,"diam":95,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":158,"y":68,"diam":134,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"co2-molecule":{"name":"co2-molecule","editableColorIndex":0,"rotate":true,"elements":[{"x":183,"y":63,"diam":84,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":183,"y":63,"diam":84,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x":75,"y":75,"diam":150,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":75,"y":75,"diam":150,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x":33,"y":63,"diam":84,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":33,"y":63,"diam":84,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"molecule water":{"name":"molecule water","editableColorIndex":0,"rotate":true,"elements":[{"x":183,"y":63,"diam":84,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":183,"y":63,"diam":84,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x":75,"y":75,"diam":150,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":75,"y":75,"diam":150,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x":33,"y":63,"diam":84,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":33,"y":63,"diam":84,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"ray":{"name":"ray","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":315,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":150,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":225,"x2":180,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":165,"x2":150,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":75,"x2":150,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":135,"x2":180,"y2":165,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":45,"x2":180,"y2":75,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    input: function(str) { return 'dummy implementation'; },
    notify: function(str) {},
    yesOrNo: function(str) { return true; }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.exporting = {
    exportOutput: function(filename) {},
    exportView: function(filename) {}
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
  var name    = 'Global Temperature';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Global Temperature', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotValue(world.observer.getGlobal("temperature"));
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
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, 10.0, 20.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "RAYS", singular: "ray", varNames: [] }, { name: "IRS", singular: "ir", varNames: [] }, { name: "HEATS", singular: "heat", varNames: [] }, { name: "CO2S", singular: "co2", varNames: [] }, { name: "CLOUDS", singular: "cloud", varNames: ["cloud-speed", "cloud-id"] }])([], [])('globals [\n  sky-top      ;; y coordinate of top row of sky\n  earth-top    ;; y coordinate of top row of earth\n  temperature  ;; overall temperature\n]\n\nbreed [rays ray]     ;; packets of sunlight\nbreed [IRs IR]       ;; packets of infrared radiation\nbreed [heats heat]   ;; packets of heat energy\nbreed [CO2s CO2]     ;; packets of carbon dioxide\n\nbreed [clouds cloud]\nclouds-own [cloud-speed cloud-id]\n\n;;\n;; Setup Procedures\n;;\n\nto setup\n  clear-all\n  set-default-shape rays \"ray\"\n  set-default-shape IRs \"ray\"\n  set-default-shape clouds \"cloud\"\n  set-default-shape heats \"dot\"\n  set-default-shape CO2s \"CO2-molecule\"\n  setup-world\n  set temperature 12\n  reset-ticks\nend\n\nto setup-world\n  set sky-top max-pycor - 5\n  set earth-top 0\n  ask patches [  ;; set colors for the different sections of the world\n    if pycor > sky-top [  ;; space\n      set pcolor scale-color white pycor 22 15\n    ]\n    if pycor <= sky-top and pycor > earth-top [ ;; sky\n      set pcolor scale-color blue pycor -20 20\n    ]\n    if pycor < earth-top\n      [ set pcolor red + 3 ] ;; earth\n    if pycor = earth-top ;; earth surface\n      [ update-albedo ]\n  ]\nend\n\n;;\n;; Runtime Procedures\n;;\n\nto go\n  ask clouds [ fd cloud-speed ]  ; move clouds along\n  run-sunshine   ;; step sunshine\n  ;; if the albedo slider has moved update the color of the \"earth surface\" patches\n  ask patches with [pycor = earth-top]\n    [ update-albedo ]\n  run-heat  ;; step heat\n  run-IR    ;; step IR\n  run-CO2   ;; moves CO2 molecules\n  tick\nend\n\nto update-albedo ;; patch procedure\n  set pcolor scale-color green albedo 0 1\nend\n\nto add-cloud            ;; erase clouds and then create new ones, plus one\n  let sky-height sky-top - earth-top\n  ;; find a random altitude for the clouds but\n  ;; make sure to keep it in the sky area\n  let y earth-top + (random-float (sky-height - 4)) + 2\n  ;; no clouds should have speed 0\n  let speed (random-float 0.1) + 0.01\n  let x random-xcor\n  let id 0\n  ;; we don\'t care what the cloud-id is as long as\n  ;; all the turtles in this cluster have the same\n  ;; id and it is unique among cloud clusters\n  if any? clouds\n  [ set id max [cloud-id] of clouds + 1 ]\n\n  create-clouds 3 + random 20\n  [\n    set cloud-speed speed\n    set cloud-id id\n    ;; all the cloud turtles in each larger cloud should\n    ;; be nearby but not directly on top of the others so\n    ;; add a little wiggle room in the x and ycors\n    setxy x + random 9 - 4\n          ;; the clouds should generally be clustered around the\n          ;; center with occasional larger variations\n          y + 2.5 + random-float 2 - random-float 2\n    set color white\n    ;; varying size is also purely for visualization\n    ;; since we\'re only doing patch-based collisions\n    set size 2 + random 2\n    set heading 90\n  ]\nend\n\nto remove-cloud       ;; erase clouds and then create new ones, minus one\n  if any? clouds [\n    let doomed-id one-of remove-duplicates [cloud-id] of clouds\n    ask clouds with [cloud-id = doomed-id]\n      [ die ]\n  ]\nend\n\nto run-sunshine\n  ask rays [\n    if not can-move? 0.3 [ die ]  ;; kill them off at the edge\n    fd 0.3                        ;; otherwise keep moving\n  ]\n  create-sunshine  ;; start new sun rays from top\n  reflect-rays-from-clouds  ;; check for reflection off clouds\n  encounter-earth   ;; check for reflection off earth and absorption\nend\n\nto create-sunshine\n  ;; don\'t necessarily create a ray each tick\n  ;; as brightness gets higher make more\n  if 10 * sun-brightness > random 50 [\n    create-rays 1 [\n      set heading 160\n      set color yellow\n      ;; rays only come from a small area\n      ;; near the top of the world\n      setxy (random 10) + min-pxcor max-pycor\n    ]\n  ]\nend\n\nto reflect-rays-from-clouds\n ask rays with [any? clouds-here] [   ;; if ray shares patch with a cloud\n   set heading 180 - heading   ;; turn the ray around\n ]\nend\n\nto encounter-earth\n  ask rays with [ycor <= earth-top] [\n    ;; depending on the albedo either\n    ;; the earth absorbs the heat or reflects it\n    ifelse 100 * albedo > random 100\n      [ set heading 180 - heading  ] ;; reflect\n      [ rt random 45 - random 45 ;; absorb into the earth\n        set color red - 2 + random 4\n        set breed heats ]\n  ]\nend\n\nto run-heat    ;; advances the heat energy turtles\n  ;; the temperature is related to the number of heat turtles\n  set temperature 0.99 * temperature + 0.01 * (12 + 0.1 * count heats)\n  ask heats\n  [\n    let dist 0.5 * random-float 1\n    ifelse can-move? dist\n      [ fd dist ]\n      [ set heading 180 - heading ] ;; if we\'re hitting the edge of the world, turn around\n    if ycor >= earth-top [  ;; if heading back into sky\n      ifelse temperature > 20 + random 40\n              ;; heats only seep out of the earth from a small area\n              ;; this makes the model look nice but it also contributes\n              ;; to the rate at which heat can be lost\n              and xcor > 0 and xcor < max-pxcor - 8\n        [ set breed IRs                    ;; let some escape as IR\n          set heading 20\n          set color magenta ]\n        [ set heading 100 + random 160 ] ;; return them to earth\n    ]\n  ]\nend\n\nto run-IR\n  ask IRs [\n    if not can-move? 0.3 [ die ]\n    fd 0.3\n    if ycor <= earth-top [   ;; convert to heat if we hit the earth\'s surface again\n      set breed heats\n      rt random 45\n      lt random 45\n      set color red - 2 + random 4\n    ]\n    if any? CO2s-here    ;; check for collision with CO2\n      [ set heading 180 - heading ]\n  ]\nend\n\nto add-CO2  ;; randomly adds 25 CO2 molecules to atmosphere\n  let sky-height sky-top - earth-top\n  create-CO2s 25 [\n    set color green\n    ;; pick a random position in the sky area\n    setxy random-xcor\n          earth-top + random-float sky-height\n  ]\nend\n\nto remove-CO2 ;; randomly remove 25 CO2 molecules\n  repeat 25 [\n    if any? CO2s [\n      ask one-of CO2s [ die ]\n    ]\n  ]\nend\n\nto run-CO2\n  ask CO2s [\n    rt random 51 - 25 ;; turn a bit\n    let dist 0.05 + random-float 0.1\n    ;; keep the CO2 in the sky area\n    if [not shade-of? blue pcolor] of patch-ahead dist\n      [ set heading 180 - heading ]\n    fd dist ;; move forward a bit\n  ]\nend\n\n\n; Copyright 2007 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":317,"top":12,"right":864,"bottom":362,"dimensions":{"minPxcor":-24,"maxPxcor":24,"minPycor":-8,"maxPycor":22,"patchSize":11,"wrappingAllowedInX":true,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":6,"top":12,"right":101,"bottom":45,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":103,"top":12,"right":198,"bottom":45,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"5","compiledStep":"0.2","variable":"sun-brightness","left":18,"top":47,"right":191,"bottom":80,"display":"sun-brightness","min":"0","max":"5","default":1,"step":"0.2","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.05","variable":"albedo","left":18,"top":82,"right":191,"bottom":115,"display":"albedo","min":"0","max":"1","default":0.6,"step":"0.05","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  workspace.rng.withAux(function() {\n    plotManager.withTemporaryContext('Global Temperature', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotValue(world.observer.getGlobal(\"temperature\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot temperature","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Global Temperature","left":9,"top":212,"right":278,"bottom":423,"xmin":0,"xmax":10,"ymin":10,"ymax":20,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"plot temperature","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_40 = procedures[\"ADD-CO2\"]();\n  if (_maybestop_33_40 instanceof Exception.StopInterrupt) { return _maybestop_33_40; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"add-CO2","left":7,"top":152,"right":102,"bottom":185,"display":"add CO2","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_43 = procedures[\"REMOVE-CO2\"]();\n  if (_maybestop_33_43 instanceof Exception.StopInterrupt) { return _maybestop_33_43; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"remove-CO2","left":104,"top":152,"right":199,"bottom":185,"display":"remove CO2","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"temperature\")","source":"temperature","left":210,"top":87,"right":303,"bottom":132,"precision":1,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_42 = procedures[\"ADD-CLOUD\"]();\n  if (_maybestop_33_42 instanceof Exception.StopInterrupt) { return _maybestop_33_42; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"add-cloud","left":7,"top":118,"right":102,"bottom":151,"display":"add cloud","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_45 = procedures[\"REMOVE-CLOUD\"]();\n  if (_maybestop_33_45 instanceof Exception.StopInterrupt) { return _maybestop_33_45; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"remove-cloud","left":104,"top":118,"right":199,"bottom":151,"display":"remove cloud","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"CO2S\").size()","source":"count CO2s","left":210,"top":133,"right":303,"bottom":178,"display":"CO2 amount","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  world.observer.watch(ListPrims.oneOf(world.turtleManager.turtlesOfBreed(\"RAYS\")));\n  world.observer.subject().ask(function() { SelfManager.self().penManager.lowerPen(); }, true);\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"watch one-of rays\nask subject [ pen-down ]","left":208,"top":41,"right":309,"bottom":75,"display":"watch a ray","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["sun-brightness", "albedo", "sky-top", "earth-top", "temperature"], ["sun-brightness", "albedo"], [], -24, 24, -8, 22, 11.0, true, false, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ExportPrims = workspace.exportPrims;
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
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("RAYS").getSpecialName(), "ray")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("IRS").getSpecialName(), "ray")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("CLOUDS").getSpecialName(), "cloud")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("HEATS").getSpecialName(), "dot")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("CO2S").getSpecialName(), "CO2-molecule")
      procedures["SETUP-WORLD"]();
      world.observer.setGlobal("temperature", 12);
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
      world.observer.setGlobal("sky-top", (world.topology.maxPycor - 5));
      world.observer.setGlobal("earth-top", 0);
      world.patches().ask(function() {
        if (Prims.gt(SelfManager.self().getPatchVariable("pycor"), world.observer.getGlobal("sky-top"))) {
          SelfManager.self().setPatchVariable("pcolor", ColorModel.scaleColor(9.9, SelfManager.self().getPatchVariable("pycor"), 22, 15));
        }
        if ((Prims.lte(SelfManager.self().getPatchVariable("pycor"), world.observer.getGlobal("sky-top")) && Prims.gt(SelfManager.self().getPatchVariable("pycor"), world.observer.getGlobal("earth-top")))) {
          SelfManager.self().setPatchVariable("pcolor", ColorModel.scaleColor(105, SelfManager.self().getPatchVariable("pycor"), -20, 20));
        }
        if (Prims.lt(SelfManager.self().getPatchVariable("pycor"), world.observer.getGlobal("earth-top"))) {
          SelfManager.self().setPatchVariable("pcolor", (15 + 3));
        }
        if (Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.observer.getGlobal("earth-top"))) {
          procedures["UPDATE-ALBEDO"]();
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
  procs["setupWorld"] = temp;
  procs["SETUP-WORLD"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("CLOUDS").ask(function() { SelfManager.self().fd(SelfManager.self().getVariable("cloud-speed")); }, true);
      procedures["RUN-SUNSHINE"]();
      world._optimalPatchRow(world.observer.getGlobal("earth-top")).ask(function() { procedures["UPDATE-ALBEDO"](); }, true);
      procedures["RUN-HEAT"]();
      procedures["RUN-IR"]();
      procedures["RUN-CO2"]();
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
      SelfManager.self().setPatchVariable("pcolor", ColorModel.scaleColor(55, world.observer.getGlobal("albedo"), 0, 1));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateAlbedo"] = temp;
  procs["UPDATE-ALBEDO"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let skyHeight = (world.observer.getGlobal("sky-top") - world.observer.getGlobal("earth-top")); letVars['skyHeight'] = skyHeight;
      let y = ((world.observer.getGlobal("earth-top") + Prims.randomFloat((skyHeight - 4))) + 2); letVars['y'] = y;
      let speed = (Prims.randomFloat(0.1) + 0.01); letVars['speed'] = speed;
      let x = Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor); letVars['x'] = x;
      let id = 0; letVars['id'] = id;
      if (!world.turtleManager.turtlesOfBreed("CLOUDS").isEmpty()) {
        id = (ListPrims.max(world.turtleManager.turtlesOfBreed("CLOUDS").projectionBy(function() { return SelfManager.self().getVariable("cloud-id"); })) + 1); letVars['id'] = id;
      }
      world.turtleManager.createTurtles((3 + Prims.random(20)), "CLOUDS").ask(function() {
        SelfManager.self().setVariable("cloud-speed", speed);
        SelfManager.self().setVariable("cloud-id", id);
        SelfManager.self().setXY(((x + Prims.random(9)) - 4), (((y + 2.5) + Prims.randomFloat(2)) - Prims.randomFloat(2)));
        SelfManager.self().setVariable("color", 9.9);
        SelfManager.self().setVariable("size", (2 + Prims.random(2)));
        SelfManager.self().setVariable("heading", 90);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["addCloud"] = temp;
  procs["ADD-CLOUD"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!world.turtleManager.turtlesOfBreed("CLOUDS").isEmpty()) {
        let doomedId = ListPrims.oneOf(ListPrims.removeDuplicates(world.turtleManager.turtlesOfBreed("CLOUDS").projectionBy(function() { return SelfManager.self().getVariable("cloud-id"); }))); letVars['doomedId'] = doomedId;
        world.turtleManager.turtlesOfBreed("CLOUDS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("cloud-id"), doomedId); }).ask(function() { SelfManager.self().die(); }, true);
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["removeCloud"] = temp;
  procs["REMOVE-CLOUD"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("RAYS").ask(function() {
        if (!SelfManager.self().canMove(0.3)) {
          SelfManager.self().die();
        }
        SelfManager.self()._optimalFdLessThan1(0.3);
      }, true);
      procedures["CREATE-SUNSHINE"]();
      procedures["REFLECT-RAYS-FROM-CLOUDS"]();
      procedures["ENCOUNTER-EARTH"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["runSunshine"] = temp;
  procs["RUN-SUNSHINE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.gt((10 * world.observer.getGlobal("sun-brightness")), Prims.random(50))) {
        world.turtleManager.createTurtles(1, "RAYS").ask(function() {
          SelfManager.self().setVariable("heading", 160);
          SelfManager.self().setVariable("color", 45);
          SelfManager.self().setXY((Prims.random(10) + world.topology.minPxcor), world.topology.maxPycor);
        }, true);
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["createSunshine"] = temp;
  procs["CREATE-SUNSHINE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("RAYS").agentFilter(function() { return !SelfManager.self().breedHere("CLOUDS").isEmpty(); }).ask(function() { SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading"))); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["reflectRaysFromClouds"] = temp;
  procs["REFLECT-RAYS-FROM-CLOUDS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("RAYS").agentFilter(function() { return Prims.lte(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("earth-top")); }).ask(function() {
        if (Prims.gt((100 * world.observer.getGlobal("albedo")), Prims.random(100))) {
          SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading")));
        }
        else {
          SelfManager.self().right((Prims.random(45) - Prims.random(45)));
          SelfManager.self().setVariable("color", ((15 - 2) + Prims.random(4)));
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("HEATS"));
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
  procs["encounterEarth"] = temp;
  procs["ENCOUNTER-EARTH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("temperature", ((0.99 * world.observer.getGlobal("temperature")) + (0.01 * (12 + (0.1 * world.turtleManager.turtlesOfBreed("HEATS").size())))));
      world.turtleManager.turtlesOfBreed("HEATS").ask(function() {
        let dist = (0.5 * Prims.randomFloat(1)); letVars['dist'] = dist;
        if (SelfManager.self().canMove(dist)) {
          SelfManager.self().fd(dist);
        }
        else {
          SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading")));
        }
        if (Prims.gte(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("earth-top"))) {
          if (((Prims.gt(world.observer.getGlobal("temperature"), (20 + Prims.random(40))) && Prims.gt(SelfManager.self().getVariable("xcor"), 0)) && Prims.lt(SelfManager.self().getVariable("xcor"), (world.topology.maxPxcor - 8)))) {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("IRS"));
            SelfManager.self().setVariable("heading", 20);
            SelfManager.self().setVariable("color", 125);
          }
          else {
            SelfManager.self().setVariable("heading", (100 + Prims.random(160)));
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
  procs["runHeat"] = temp;
  procs["RUN-HEAT"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("IRS").ask(function() {
        if (!SelfManager.self().canMove(0.3)) {
          SelfManager.self().die();
        }
        SelfManager.self()._optimalFdLessThan1(0.3);
        if (Prims.lte(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("earth-top"))) {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("HEATS"));
          SelfManager.self().right(Prims.random(45));
          SelfManager.self().right(-Prims.random(45));
          SelfManager.self().setVariable("color", ((15 - 2) + Prims.random(4)));
        }
        if (!SelfManager.self().breedHere("CO2S").isEmpty()) {
          SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading")));
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
  procs["runIr"] = temp;
  procs["RUN-IR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let skyHeight = (world.observer.getGlobal("sky-top") - world.observer.getGlobal("earth-top")); letVars['skyHeight'] = skyHeight;
      world.turtleManager.createTurtles(25, "CO2S").ask(function() {
        SelfManager.self().setVariable("color", 55);
        SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), (world.observer.getGlobal("earth-top") + Prims.randomFloat(skyHeight)));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["addCo2"] = temp;
  procs["ADD-CO2"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      for (let _index_5794_5800 = 0, _repeatcount_5794_5800 = StrictMath.floor(25); _index_5794_5800 < _repeatcount_5794_5800; _index_5794_5800++){
        if (!world.turtleManager.turtlesOfBreed("CO2S").isEmpty()) {
          ListPrims.oneOf(world.turtleManager.turtlesOfBreed("CO2S")).ask(function() { SelfManager.self().die(); }, true);
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
  procs["removeCo2"] = temp;
  procs["REMOVE-CO2"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("CO2S").ask(function() {
        SelfManager.self().right((Prims.random(51) - 25));
        let dist = (0.05 + Prims.randomFloat(0.1)); letVars['dist'] = dist;
        if (SelfManager.self().patchAhead(dist).projectionBy(function() { return !ColorModel.areRelatedByShade(105, SelfManager.self().getPatchVariable("pcolor")); })) {
          SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading")));
        }
        SelfManager.self().fd(dist);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["runCo2"] = temp;
  procs["RUN-CO2"] = temp;
  return procs;
})();
world.observer.setGlobal("sun-brightness", 1);
world.observer.setGlobal("albedo", 0.6);
