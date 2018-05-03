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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"die 1":{"name":"die 1","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":45,"xmax":255,"ymax":255,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":129,"y":129,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"die 2":{"name":"die 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":45,"xmax":255,"ymax":255,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":69,"y":69,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":189,"y":189,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"die 3":{"name":"die 3","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":45,"xmax":255,"ymax":255,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":69,"y":69,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":129,"y":129,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":189,"y":189,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"die 4":{"name":"die 4","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":45,"xmax":255,"ymax":255,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":69,"y":69,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":69,"y":189,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":189,"y":69,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":189,"y":189,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"die 5":{"name":"die 5","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":45,"xmax":255,"ymax":255,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":69,"y":69,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":129,"y":129,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":69,"y":189,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":189,"y":69,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":189,"y":189,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"die 6":{"name":"die 6","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":45,"xmax":255,"ymax":255,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":84,"y":69,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":84,"y":129,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":84,"y":189,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":174,"y":69,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":174,"y":129,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":174,"y":189,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
    exportOutput: function(filename) {},
    exportView: function(filename) {},
    exportFile: function(str) {
      return function(filepath) {
        var Paths = Java.type('java.nio.file.Paths');
        var Files = Java.type('java.nio.file.Files');
        var UTF8  = Java.type('java.nio.charset.StandardCharsets').UTF_8;
        Files.createDirectories(Paths.get(filepath).getParent());
        var path  = Files.write(Paths.get(filepath), str.getBytes());
      }
},
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
}
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
  var name    = 'Single Dice';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Single Dice', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.observer.getGlobal("single-outcomes"));
          let maxbar = ListPrims.modes(world.observer.getGlobal("single-outcomes")); letVars['maxbar'] = maxbar;
          let maxrange = ListPrims.length(world.observer.getGlobal("single-outcomes").filter(Tasks.reporterTask(function(outcome) {
            if (arguments.length < 1) {
              throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
            }
            return Prims.equality(outcome, ListPrims.item(0, maxbar));
          }, "[ outcome -> outcome = item 0 maxbar ]"))); letVars['maxrange'] = maxrange;
          plotManager.setYRange(0, ListPrims.max(ListPrims.list(51, maxrange)));
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
  return new Plot(name, pens, plotOps, "Die Value", "Count", false, true, 1.0, 7.0, 0.0, 51.0, setup, update);
})(), (function() {
  var name    = 'Pair Sums';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Pair Sums', 'default')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.drawHistogramFrom(world.observer.getGlobal("pair-outcomes"));
          let maxbar = ListPrims.modes(world.observer.getGlobal("pair-outcomes")); letVars['maxbar'] = maxbar;
          let maxrange = ListPrims.length(world.observer.getGlobal("pair-outcomes").filter(Tasks.reporterTask(function(outcome) {
            if (arguments.length < 1) {
              throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
            }
            return Prims.equality(outcome, ListPrims.item(0, maxbar));
          }, "[ outcome -> outcome = item 0 maxbar ]"))); letVars['maxrange'] = maxrange;
          plotManager.setYRange(0, ListPrims.max(ListPrims.list(51, maxrange)));
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
  return new Plot(name, pens, plotOps, "Dice Total", "Count", false, true, 2.0, 13.0, 0.0, 51.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PAIRED-DICE", singular: "paired-die", varNames: ["pair-sum"] }, { name: "SINGLE-DICE", singular: "single-die", varNames: [] }, { name: "STACKED-DICE", singular: "stacked-die", varNames: [] }])(["die-value"], [])('globals [\n  generators        ;; agentset of two patches where the dice first appear\n  top-row           ;; agentset of just the top row of patches\n  single-outcomes   ;; list of single dice values\n  pair-outcomes     ;; list of dice pair sums\n]\n\npatches-own [\n  column            ;; what number (single die or sum of pair) this column of patches is for\n]\n\nbreed [paired-dice paired-die]   ;; dice considered as part of pairs\nbreed [single-dice single-die]   ;; dice considered singly\nbreed [stacked-dice stacked-die] ;; dice that have stopped moving\n\n;; all three breeds have this variable\nturtles-own [\n  die-value        ;; 1 through 6\n]\n\npaired-dice-own [\n  pair-sum         ;; 2 through 12\n]\n\nto setup\n  clear-all\n  set single-outcomes []\n  set pair-outcomes []\n  ;; assign outcomes to columns\n  ask patches with [pxcor > 4] [\n    set column floor ((pxcor - 1) / 2)\n  ]\n  ask patches with [pxcor < -4] [\n    set column pxcor - min-pxcor  + 1\n  ]\n  ;; color patches\n  ask patches [ set pcolor gray + 3 ]\n  ask patches with [column != 0] [\n    ifelse column mod 2 = 0\n      [ set pcolor gray ]\n      [ set pcolor brown - 1 ]\n  ]\n  ;; set up agentsets\n  set top-row patches with [pycor = max-pycor]\n  set generators top-row with [pxcor = -1 or pxcor = 0]\n  ;; start clock and plot initial state\n  reset-ticks\nend\n\nto go\n  if stop-at-top? and any? turtles-on top-row [\n    user-message \"The top has been reached. Turn STOP-AT-TOP? off to keep going.\"\n    stop\n  ]\n  if not stop-at-top? [\n    bump-down stacked-dice with [pxcor < 0]\n    bump-down stacked-dice with [pxcor > 0]\n  ]\n  roll-dice\n  while [any? single-dice or any? paired-dice] [\n    move-paired-dice\n    move-single-dice\n    display    ;; force the view to update, so we see the dice move smoothly\n  ]\n  tick\nend\n\n;; creates a new pair of dice (both singles and pairs)\nto roll-dice\n  ;; ask each generator patch to create two paired dice\n  ask generators [\n    sprout-paired-dice 1 [\n      set color white\n      set die-value 1 + random 6\n      set shape word \"die \" die-value\n      set heading 90\n    ]\n  ]\n  ;; clone the paired dice to make the single dice\n  ask paired-dice [\n    hatch-single-dice 1 [\n      set heading 270\n      ;; changing breeds resets our shape, so we must explicitly adopt\n      ;; our parent\'s shape\n      set shape [shape] of myself\n    ]\n  ]\n  ;; set the sum variable of the pairs\n  let total sum [die-value] of paired-dice\n  ask paired-dice [ set pair-sum total ]\n  ;; add to outcomes lists\n  set pair-outcomes lput total pair-outcomes\n  ask single-dice [ set single-outcomes lput die-value single-outcomes ]\nend\n\nto move-paired-dice\n  ;; if either of the two dice isn\'t at the right column yet,\n  ;; both dice move\n  ifelse any? paired-dice with [pair-sum != column]\n    [ ask paired-dice [ fd 1 ] ]\n    ;; otherwise both dice fall\n    [ ask paired-dice [\n        ;; if at the bottom of the view, check if we should go \"underwater\"\n        if pycor = min-pycor [ paired-die-check-visible ]\n        fall\n      ]\n    ]\nend\n\nto move-single-dice\n  ;; two single dice may be falling in the same column, so we have\n  ;; to make sure that the bottom one moves before the top one,\n  ;; otherwise they could get confused\n  let how-many count single-dice\n  if how-many > 0 [\n    ask min-one-of single-dice [pycor] [ move-single-die ]\n  ]\n  if how-many > 1 [\n    ask max-one-of single-dice [pycor] [ move-single-die ]\n  ]\nend\n\nto move-single-die  ;; single-die procedure\n  ifelse die-value != column\n    [ fd 1 ]\n    [ ;; if at the bottom of the view, check if we should go \"underwater\"\n      if pycor = min-pycor [ single-die-check-visible ]\n      fall\n    ]\nend\n\nto fall  ;; single-die or paired-die procedure\n  set heading 180\n  ifelse (pycor > min-pycor) and (not any? stacked-dice-on patch-ahead 1)\n    [ fd 1 ]\n    ;; stop falling\n    [ ;; changing breeds resets our shape, so we have to remember our old shape\n      let old-shape shape\n      set breed stacked-dice\n      set shape old-shape\n    ]\nend\n\n;; determines if my column is tall enough to be seen\nto single-die-check-visible  ;; single-die procedure\n  if single-outcomes = [] [ stop ]\n  let mode first modes single-outcomes\n  let height-of-tallest-column length filter [ outcome -> outcome = mode] single-outcomes\n  let height-of-my-column length filter [ outcome -> outcome = die-value] single-outcomes\n  if (height-of-tallest-column - height-of-my-column) >= world-height - 2 [ die ]\nend\n\n;; determines if my column is tall enough to be seen\nto paired-die-check-visible  ;; paired-die procedure\n  if pair-outcomes = [] [ stop ]\n  let mode first modes pair-outcomes\n  let height-of-tallest-column length filter [ outcome -> outcome = mode ] pair-outcomes\n  let height-of-my-column length filter [ outcome -> outcome = pair-sum ] pair-outcomes\n  if (height-of-tallest-column - height-of-my-column) >= world-height - 2 [ die ]\nend\n\nto bump-down [candidates]\n  while [any? candidates with [pycor = max-pycor - 2]] [\n    ask candidates [\n      if pycor = min-pycor [ die ]\n      fd 1\n    ]\n  ]\nend\n\n\n; Copyright 2005 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":177,"top":39,"right":555,"bottom":568,"dimensions":{"minPxcor":-10,"maxPxcor":26,"minPycor":0,"maxPycor":51,"patchSize":10,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":11,"top":10,"right":90,"bottom":43,"display":"Setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":92,"top":10,"right":171,"bottom":43,"display":"Go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Single Dice', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.observer.getGlobal(\"single-outcomes\"));\n        let maxbar = ListPrims.modes(world.observer.getGlobal(\"single-outcomes\")); letVars['maxbar'] = maxbar;\n        let maxrange = ListPrims.length(world.observer.getGlobal(\"single-outcomes\").filter(Tasks.reporterTask(function(outcome) {\n          if (arguments.length < 1) {\n            throw new Error(\"anonymous procedure expected 1 input, but only got \" + arguments.length);\n          }\n          return Prims.equality(outcome, ListPrims.item(0, maxbar));\n        }, \"[ outcome -> outcome = item 0 maxbar ]\"))); letVars['maxrange'] = maxrange;\n        plotManager.setYRange(0, ListPrims.max(ListPrims.list(51, maxrange)));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":1,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"histogram single-outcomes\nlet maxbar modes single-outcomes\nlet maxrange length filter [ outcome -> outcome = item 0 maxbar ] single-outcomes\nset-plot-y-range 0 max list 51 maxrange","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Single Dice","left":11,"top":48,"right":171,"bottom":590,"xAxis":"Die Value","yAxis":"Count","xmin":1,"xmax":7,"ymin":0,"ymax":51,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":1,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"histogram single-outcomes\nlet maxbar modes single-outcomes\nlet maxrange length filter [ outcome -> outcome = item 0 maxbar ] single-outcomes\nset-plot-y-range 0 max list 51 maxrange","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Pair Sums', 'default')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.drawHistogramFrom(world.observer.getGlobal(\"pair-outcomes\"));\n        let maxbar = ListPrims.modes(world.observer.getGlobal(\"pair-outcomes\")); letVars['maxbar'] = maxbar;\n        let maxrange = ListPrims.length(world.observer.getGlobal(\"pair-outcomes\").filter(Tasks.reporterTask(function(outcome) {\n          if (arguments.length < 1) {\n            throw new Error(\"anonymous procedure expected 1 input, but only got \" + arguments.length);\n          }\n          return Prims.equality(outcome, ListPrims.item(0, maxbar));\n        }, \"[ outcome -> outcome = item 0 maxbar ]\"))); letVars['maxrange'] = maxrange;\n        plotManager.setYRange(0, ListPrims.max(ListPrims.list(51, maxrange)));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"default","interval":1,"mode":1,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"histogram pair-outcomes\nlet maxbar modes pair-outcomes\nlet maxrange length filter [ outcome -> outcome = item 0 maxbar ] pair-outcomes\nset-plot-y-range 0 max list 51 maxrange","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Pair Sums","left":562,"top":49,"right":783,"bottom":593,"xAxis":"Dice Total","yAxis":"Count","xmin":2,"xmax":13,"ymin":0,"ymax":51,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"default","interval":1,"mode":1,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"histogram pair-outcomes\nlet maxbar modes pair-outcomes\nlet maxrange length filter [ outcome -> outcome = item 0 maxbar ] pair-outcomes\nset-plot-y-range 0 max list 51 maxrange","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"variable":"stop-at-top?","left":374,"top":4,"right":498,"bottom":37,"display":"stop-at-top?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["stop-at-top?", "generators", "top-row", "single-outcomes", "pair-outcomes"], ["stop-at-top?"], ["column"], -10, 26, 0, 51, 10.0, true, true, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
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
      world.observer.setGlobal("single-outcomes", []);
      world.observer.setGlobal("pair-outcomes", []);
      world.patches().agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("pxcor"), 4); }).ask(function() {
        SelfManager.self().setPatchVariable("column", NLMath.floor(Prims.div((SelfManager.self().getPatchVariable("pxcor") - 1), 2)));
      }, true);
      world.patches().agentFilter(function() { return Prims.lt(SelfManager.self().getPatchVariable("pxcor"), -4); }).ask(function() {
        SelfManager.self().setPatchVariable("column", ((SelfManager.self().getPatchVariable("pxcor") - world.topology.minPxcor) + 1));
      }, true);
      world.patches().ask(function() { SelfManager.self().setPatchVariable("pcolor", (5 + 3)); }, true);
      world.patches().agentFilter(function() { return !Prims.equality(SelfManager.self().getPatchVariable("column"), 0); }).ask(function() {
        if (Prims.equality(NLMath.mod(SelfManager.self().getPatchVariable("column"), 2), 0)) {
          SelfManager.self().setPatchVariable("pcolor", 5);
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", (35 - 1));
        }
      }, true);
      world.observer.setGlobal("top-row", world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.maxPycor); }));
      world.observer.setGlobal("generators", world.observer.getGlobal("top-row").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), -1) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), 0));
      }));
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
      if ((world.observer.getGlobal("stop-at-top?") && !Prims.turtlesOn(world.observer.getGlobal("top-row")).isEmpty())) {
        UserDialogPrims.confirm("The top has been reached. Turn STOP-AT-TOP? off to keep going.");
        throw new Exception.StopInterrupt;
      }
      if (!world.observer.getGlobal("stop-at-top?")) {
        procedures["BUMP-DOWN"](world.turtleManager.turtlesOfBreed("STACKED-DICE").agentFilter(function() { return Prims.lt(SelfManager.self().getPatchVariable("pxcor"), 0); }));
        procedures["BUMP-DOWN"](world.turtleManager.turtlesOfBreed("STACKED-DICE").agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("pxcor"), 0); }));
      }
      procedures["ROLL-DICE"]();
      while ((!world.turtleManager.turtlesOfBreed("SINGLE-DICE").isEmpty() || !world.turtleManager.turtlesOfBreed("PAIRED-DICE").isEmpty())) {
        procedures["MOVE-PAIRED-DICE"]();
        procedures["MOVE-SINGLE-DICE"]();
        notImplemented('display', undefined)();
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
      world.observer.getGlobal("generators").ask(function() {
        SelfManager.self().sprout(1, "PAIRED-DICE").ask(function() {
          SelfManager.self().setVariable("color", 9.9);
          SelfManager.self().setVariable("die-value", (1 + Prims.random(6)));
          SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("die ") + workspace.dump(SelfManager.self().getVariable("die-value"))));
          SelfManager.self().setVariable("heading", 90);
        }, true);
      }, true);
      world.turtleManager.turtlesOfBreed("PAIRED-DICE").ask(function() {
        SelfManager.self().hatch(1, "SINGLE-DICE").ask(function() {
          SelfManager.self().setVariable("heading", 270);
          SelfManager.self().setVariable("shape", SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("shape"); }));
        }, true);
      }, true);
      let total = ListPrims.sum(world.turtleManager.turtlesOfBreed("PAIRED-DICE").projectionBy(function() { return SelfManager.self().getVariable("die-value"); })); letVars['total'] = total;
      world.turtleManager.turtlesOfBreed("PAIRED-DICE").ask(function() { SelfManager.self().setVariable("pair-sum", total); }, true);
      world.observer.setGlobal("pair-outcomes", ListPrims.lput(total, world.observer.getGlobal("pair-outcomes")));
      world.turtleManager.turtlesOfBreed("SINGLE-DICE").ask(function() {
        world.observer.setGlobal("single-outcomes", ListPrims.lput(SelfManager.self().getVariable("die-value"), world.observer.getGlobal("single-outcomes")));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["rollDice"] = temp;
  procs["ROLL-DICE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (world.turtleManager.turtlesOfBreed("PAIRED-DICE")._optimalAnyWith(function() {
        return !Prims.equality(SelfManager.self().getVariable("pair-sum"), SelfManager.self().getPatchVariable("column"));
      })) {
        world.turtleManager.turtlesOfBreed("PAIRED-DICE").ask(function() { SelfManager.self()._optimalFdOne(); }, true);
      }
      else {
        world.turtleManager.turtlesOfBreed("PAIRED-DICE").ask(function() {
          if (Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) {
            procedures["PAIRED-DIE-CHECK-VISIBLE"]();
          }
          procedures["FALL"]();
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
  procs["movePairedDice"] = temp;
  procs["MOVE-PAIRED-DICE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let howMany = world.turtleManager.turtlesOfBreed("SINGLE-DICE").size(); letVars['howMany'] = howMany;
      if (Prims.gt(howMany, 0)) {
        world.turtleManager.turtlesOfBreed("SINGLE-DICE").minOneOf(function() { return SelfManager.self().getPatchVariable("pycor"); }).ask(function() { procedures["MOVE-SINGLE-DIE"](); }, true);
      }
      if (Prims.gt(howMany, 1)) {
        world.turtleManager.turtlesOfBreed("SINGLE-DICE").maxOneOf(function() { return SelfManager.self().getPatchVariable("pycor"); }).ask(function() { procedures["MOVE-SINGLE-DIE"](); }, true);
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["moveSingleDice"] = temp;
  procs["MOVE-SINGLE-DICE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!Prims.equality(SelfManager.self().getVariable("die-value"), SelfManager.self().getPatchVariable("column"))) {
        SelfManager.self()._optimalFdOne();
      }
      else {
        if (Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) {
          procedures["SINGLE-DIE-CHECK-VISIBLE"]();
        }
        procedures["FALL"]();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["moveSingleDie"] = temp;
  procs["MOVE-SINGLE-DIE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("heading", 180);
      if ((Prims.gt(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor) && !!Prims.breedOn("STACKED-DICE", SelfManager.self().patchAhead(1)).isEmpty())) {
        SelfManager.self()._optimalFdOne();
      }
      else {
        let oldShape = SelfManager.self().getVariable("shape"); letVars['oldShape'] = oldShape;
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("STACKED-DICE"));
        SelfManager.self().setVariable("shape", oldShape);
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["fall"] = temp;
  procs["FALL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("single-outcomes"), [])) {
        throw new Exception.StopInterrupt;
      }
      let mode = ListPrims.first(ListPrims.modes(world.observer.getGlobal("single-outcomes"))); letVars['mode'] = mode;
      let heightOfTallestColumn = ListPrims.length(world.observer.getGlobal("single-outcomes").filter(Tasks.reporterTask(function(outcome) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        return Prims.equality(outcome, mode);
      }, "[ outcome -> outcome = mode ]"))); letVars['heightOfTallestColumn'] = heightOfTallestColumn;
      let heightOfMyColumn = ListPrims.length(world.observer.getGlobal("single-outcomes").filter(Tasks.reporterTask(function(outcome) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        return Prims.equality(outcome, SelfManager.self().getVariable("die-value"));
      }, "[ outcome -> outcome = die-value ]"))); letVars['heightOfMyColumn'] = heightOfMyColumn;
      if (Prims.gte((heightOfTallestColumn - heightOfMyColumn), (world.topology.height - 2))) {
        SelfManager.self().die();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["singleDieCheckVisible"] = temp;
  procs["SINGLE-DIE-CHECK-VISIBLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("pair-outcomes"), [])) {
        throw new Exception.StopInterrupt;
      }
      let mode = ListPrims.first(ListPrims.modes(world.observer.getGlobal("pair-outcomes"))); letVars['mode'] = mode;
      let heightOfTallestColumn = ListPrims.length(world.observer.getGlobal("pair-outcomes").filter(Tasks.reporterTask(function(outcome) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        return Prims.equality(outcome, mode);
      }, "[ outcome -> outcome = mode ]"))); letVars['heightOfTallestColumn'] = heightOfTallestColumn;
      let heightOfMyColumn = ListPrims.length(world.observer.getGlobal("pair-outcomes").filter(Tasks.reporterTask(function(outcome) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        return Prims.equality(outcome, SelfManager.self().getVariable("pair-sum"));
      }, "[ outcome -> outcome = pair-sum ]"))); letVars['heightOfMyColumn'] = heightOfMyColumn;
      if (Prims.gte((heightOfTallestColumn - heightOfMyColumn), (world.topology.height - 2))) {
        SelfManager.self().die();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["pairedDieCheckVisible"] = temp;
  procs["PAIRED-DIE-CHECK-VISIBLE"] = temp;
  temp = (function(candidates) {
    try {
      var reporterContext = false;
      var letVars = { };
      while (candidates._optimalAnyWith(function() { return Prims.equality(SelfManager.self().getPatchVariable("pycor"), (world.topology.maxPycor - 2)); })) {
        candidates.ask(function() {
          if (Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) {
            SelfManager.self().die();
          }
          SelfManager.self()._optimalFdOne();
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
  procs["bumpDown"] = temp;
  procs["BUMP-DOWN"] = temp;
  return procs;
})();
world.observer.setGlobal("stop-at-top?", false);
