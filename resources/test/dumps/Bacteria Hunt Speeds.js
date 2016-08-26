var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Dump = tortoise_require('engine/dump');
var Exception = tortoise_require('util/exception');
var Link = tortoise_require('engine/core/link');
var LinkSet = tortoise_require('engine/core/linkset');
var Meta = tortoise_require('meta');
var NLMath = tortoise_require('util/nlmath');
var NLType = tortoise_require('engine/core/typechecker');
var Nobody = tortoise_require('engine/core/nobody');
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
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0.0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0.0,1.0]},{"x-offset":0.0,"is-visible":true,"dash-pattern":[1.0,0.0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0.0,1.0]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"1-flagella":{"name":"1-flagella","editableColorIndex":0,"rotate":true,"elements":[{"xmin":144,"ymin":150,"xmax":159,"ymax":225,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"bacteria":{"name":"bacteria","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[60,60,75,105,150,195,225,240,240,225,180,150,120,90],"ycors":[60,210,270,300,300,300,270,225,60,30,0,0,0,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[75,75,90,105,150,195,210,225,225,210,180,150,120,90],"ycors":[60,225,270,285,285,285,270,225,60,30,15,15,15,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"bird":{"name":"bird","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[151,136,123,143,156,179,166],"ycors":[170,170,229,244,244,229,170],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[152,137,125,140,159,179,167],"ycors":[154,154,213,229,229,214,154],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[151,136,126,139,159,176,166],"ycors":[140,140,202,214,214,200,140],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,134,128,140,161,174,166],"ycors":[125,124,188,198,197,188,125],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[152,227,286,272,294,276,287,270,278,264,267,228,153],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[160,159,149,130,139,133,127,129,134,150,168,172,169],"ycors":[74,61,54,53,62,81,113,149,177,206,179,147,111],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":55,"diam":7,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[129,135,139],"ycors":[53,58,54],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[148,73,14,28,6,24,13,30,22,36,33,72,147],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flagella":{"name":"flagella","editableColorIndex":0,"rotate":true,"elements":[{"xmin":144,"ymin":150,"xmax":159,"ymax":225,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"flagella-1":{"name":"flagella-1","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":150,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flagella-2":{"name":"flagella-2","editableColorIndex":0,"rotate":true,"elements":[{"x1":135,"y1":150,"x2":105,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":165,"y1":150,"x2":180,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flagella-3":{"name":"flagella-3","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":150,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":150,"x2":60,"y2":270,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":180,"y1":150,"x2":240,"y2":270,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flagella-4":{"name":"flagella-4","editableColorIndex":0,"rotate":true,"elements":[{"x1":135,"y1":150,"x2":105,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":165,"y1":150,"x2":180,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":195,"y1":135,"x2":255,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":105,"y1":135,"x2":45,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flagella-5":{"name":"flagella-5","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":150,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":150,"x2":60,"y2":270,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":210,"x2":105,"y2":120,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":180,"y1":150,"x2":240,"y2":270,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":285,"y1":210,"x2":195,"y2":120,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flagella-6":{"name":"flagella-6","editableColorIndex":0,"rotate":true,"elements":[{"x1":135,"y1":150,"x2":105,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":165,"y1":150,"x2":180,"y2":285,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":195,"y1":135,"x2":255,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":105,"y1":135,"x2":45,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":300,"y1":195,"x2":210,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":0,"y1":195,"x2":90,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    notify:  function(str) {},
    yesOrNo: function(str) { return true; }
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
modelConfig.plots = [(function() {
  var name    = '# of bacteria for each variation';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('1 ', plotOps.makePenOps, false, new PenBundle.State(115.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('2 ', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('3 ', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('4 ', plotOps.makePenOps, false, new PenBundle.State(44.2, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('5 ', plotOps.makePenOps, false, new PenBundle.State(25.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('6 ', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('# of bacteria for each variation', undefined)(function() {
        plotManager.clearPlot();
        Tasks.forEach(Tasks.commandTask(function() {
          var taskArguments = arguments;
          plotManager.setCurrentPen((Dump('') + Dump(taskArguments[0]) + Dump(" ")));
          plotManager.plotPoint(taskArguments[0], world.turtleManager.turtlesOfBreed("BACTERIA").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("variation"), taskArguments[0]); }).size());
        }), [1, 2, 3, 4, 5, 6]);;
      });
    });
  };
  return new Plot(name, pens, plotOps, "# of flagella", "# of bacteria", false, true, 0.0, 8.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Avg. # of flagella per bacteria';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('pen 1', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Avg. # of flagella per bacteria', 'pen 1')(function() {
        if (world.turtleManager.turtlesOfBreed("BACTERIA").nonEmpty()) {
          plotManager.plotPoint(world.ticker.tickCount(), ListPrims.mean(world.turtleManager.turtlesOfBreed("BACTERIA").projectionBy(function() { return SelfManager.self().getVariable("variation"); })));
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of flagella", false, true, 0.0, 1000.0, 1.0, 6.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "REMOVAL-SPOTS", singular: "removal-spot", varNames: ["countdown"] }, { name: "BACTERIA", singular: "bacterium", varNames: ["variation"] }, { name: "FLAGELLA", singular: "flagellum", varNames: [] }, { name: "PREDATORS", singular: "predator", varNames: [] }, { name: "CONNECTORS", singular: "connector", varNames: [], isDirected: true }])([], [])(["initial-bacteria-per-variation", "visualize-variation", "bacteria-caught", "wiggle?", "camouflage?", "tick-counter", "predator-location", "speed-scalar", "predator-color-visible", "predator-color-invisible", "bacteria-default-color", "flagella-size"], ["initial-bacteria-per-variation", "visualize-variation"], [], -14, 14, -14, 14, 16.0, true, true, turtleShapes, linkShapes, function(){});
var BreedManager = workspace.breedManager;
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
    world.clearAll();
    world.observer.setGlobal("predator-color-visible", [255, 0, 0, 100]);
    world.observer.setGlobal("predator-color-invisible", [200, 200, 200, 100]);
    world.observer.setGlobal("bacteria-default-color", [100, 100, 100, 200]);
    BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("BACTERIA").getSpecialName(), "bacteria")
    BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("FLAGELLA").getSpecialName(), "flagella")
    BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("REMOVAL-SPOTS").getSpecialName(), "x")
    world.observer.setGlobal("bacteria-caught", 0);
    world.observer.setGlobal("speed-scalar", 0.04);
    world.observer.setGlobal("flagella-size", 1.2);
    world.observer.setGlobal("wiggle?", true);
    world.observer.setGlobal("camouflage?", true);
    world.patches().ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    procedures["SETUP-BACTERIA"]();
    procedures["SETUP-PREDATOR"]();
    world.ticker.reset();
  });
  procs["setup"] = temp;
  procs["SETUP"] = temp;
  temp = (function() {
    Tasks.forEach(Tasks.commandTask(function() {
      var taskArguments = arguments;
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-bacteria-per-variation"), "BACTERIA").ask(function() {
        SelfManager.self().setVariable("label-color", 0);
        SelfManager.self().setVariable("size", 1);
        SelfManager.self().setVariable("variation", taskArguments[0]);
        procedures["MAKE-FLAGELLA"]();
        SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor));
      }, true);
    }), [1, 2, 3, 4, 5, 6]);
    procedures["VISUALIZE-BACTERIA"]();
  });
  procs["setupBacteria"] = temp;
  procs["SETUP-BACTERIA"] = temp;
  temp = (function() {
    world.turtleManager.createTurtles(1, "PREDATORS").ask(function() {
      SelfManager.self().setVariable("shape", "circle");
      SelfManager.self().setVariable("color", world.observer.getGlobal("predator-color-visible"));
      SelfManager.self().setVariable("size", 1);
      SelfManager.self().setVariable("heading", 315);
      SelfManager.self().fd(-1);
      SelfManager.self().hideTurtle(true);;
    }, true);
  });
  procs["setupPredator"] = temp;
  procs["SETUP-PREDATOR"] = temp;
  temp = (function() {
    var flagellaShape = (Dump('') + Dump("flagella-") + Dump(SelfManager.self().getVariable("variation")));
    SelfManager.self().hatch(1, "").ask(function() {
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FLAGELLA"));
      SelfManager.self().setVariable("color", world.observer.getGlobal("bacteria-default-color"));
      SelfManager.self().setVariable("label", "");
      SelfManager.self().setVariable("shape", flagellaShape);
      SelfManager.self().fd(-0.4);
      SelfManager.self().setVariable("size", world.observer.getGlobal("flagella-size"));
      LinkPrims.createLinkFrom(SelfManager.myself(), "CONNECTORS").ask(function() {
        SelfManager.self().setVariable("hidden?", true);
        SelfManager.self().tie();
      }, true);
    }, true);
  });
  procs["makeFlagella"] = temp;
  procs["MAKE-FLAGELLA"] = temp;
  temp = (function() {
    procedures["CHECK-CAUGHT"]();
    procedures["MOVE-PREDATOR"]();
    procedures["MOVE-BACTERIA"]();
    world.turtleManager.turtlesOfBreed("FLAGELLA").ask(function() { procedures["MOVE-FLAGELLA"](); }, true);
    procedures["VISUALIZE-BACTERIA"]();
    procedures["VISUALIZE-REMOVAL-SPOTS"]();
    world.ticker.tick();
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    world.observer.setGlobal("bacteria-caught", (world.observer.getGlobal("bacteria-caught") + 1));
    procedures["MAKE-A-REMOVAL-SPOT"]();
    LinkPrims.outLinkNeighbors("LINKS").ask(function() { SelfManager.self().die(); }, true);
    SelfManager.self().die();
  });
  procs["death"] = temp;
  procs["DEATH"] = temp;
  temp = (function() {
    SelfManager.self().hatch(1, "").ask(function() {
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("REMOVAL-SPOTS"));
      SelfManager.self().setVariable("size", 1.5);
      SelfManager.self().setVariable("countdown", 30);
    }, true);
  });
  procs["makeARemovalSpot"] = temp;
  procs["MAKE-A-REMOVAL-SPOT"] = temp;
  temp = (function() {
    world.turtleManager.turtlesOfBreed("BACTERIA").ask(function() {
      if (world.observer.getGlobal("wiggle?")) {
        SelfManager.self().right((Prims.randomFloat(25) - Prims.randomFloat(25)));
      }
      SelfManager.self().fd((SelfManager.self().getVariable("variation") * world.observer.getGlobal("speed-scalar")));
      var predatorsInFrontOfMe = SelfManager.self().inCone(world.turtleManager.turtlesOfBreed("PREDATORS"), 2, 120);
      if ((!world.observer.getGlobal("camouflage?") && predatorsInFrontOfMe.nonEmpty())) {
        SelfManager.self().face(ListPrims.oneOf(predatorsInFrontOfMe));
        SelfManager.self().right(180);
      }
    }, true);
  });
  procs["moveBacteria"] = temp;
  procs["MOVE-BACTERIA"] = temp;
  temp = (function() {
    if (Prims.equality(world.getPatchAt(MousePrims.getX(), MousePrims.getY()), world.observer.getGlobal("predator-location"))) {
      world.observer.setGlobal("tick-counter", (world.observer.getGlobal("tick-counter") + 1));
    }
    else {
      world.observer.setGlobal("predator-location", world.getPatchAt(MousePrims.getX(), MousePrims.getY()));
      world.observer.setGlobal("tick-counter", 0);
    }
    world.turtleManager.turtlesOfBreed("PREDATORS").ask(function() {
      if (Prims.lt(world.observer.getGlobal("tick-counter"), 100)) {
        world.observer.setGlobal("camouflage?", false);
        SelfManager.self().setVariable("color", world.observer.getGlobal("predator-color-visible"));
      }
      else {
        world.observer.setGlobal("camouflage?", true);
        SelfManager.self().setVariable("color", world.observer.getGlobal("predator-color-invisible"));
      }
      SelfManager.self().setXY(MousePrims.getX(), MousePrims.getY());
      world.observer.setGlobal("predator-location", world.getPatchAt(SelfManager.self().getVariable("xcor"), SelfManager.self().getVariable("ycor")));
      SelfManager.self().setVariable("hidden?", !MousePrims.isInside());
    }, true);
  });
  procs["movePredator"] = temp;
  procs["MOVE-PREDATOR"] = temp;
  temp = (function() {
    var flagellaSwing = 15;
    var flagellaSpeed = 60;
    var newSwing = (flagellaSwing * NLMath.sin((flagellaSpeed * world.ticker.tickCount())));
    var myBacteria = ListPrims.oneOf(LinkPrims.inLinkNeighbors("LINKS"));
    SelfManager.self().setVariable("heading", (myBacteria.projectionBy(function() { return SelfManager.self().getVariable("heading"); }) + newSwing));
  });
  procs["moveFlagella"] = temp;
  procs["MOVE-FLAGELLA"] = temp;
  temp = (function() {
    try {
      if ((!MousePrims.isDown() || !MousePrims.isInside())) {
        throw new Exception.StopInterrupt;
      }
      var prey = ListPrims.oneOf(world.turtleManager.turtlesOfBreed("PREDATORS")).projectionBy(function() {
        return SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("BACTERIA"), Prims.div(SelfManager.self().getVariable("size"), 2));
      });
      if (!prey.nonEmpty()) {
        throw new Exception.StopInterrupt;
      }
      ListPrims.oneOf(prey).ask(function() { procedures["DEATH"](); }, true);
      ListPrims.oneOf(world.turtleManager.turtlesOfBreed("BACTERIA")).ask(function() {
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().right(Prims.random(360));
          procedures["MAKE-FLAGELLA"]();
        }, true);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["checkCaught"] = temp;
  procs["CHECK-CAUGHT"] = temp;
  temp = (function() {
    world.turtleManager.turtlesOfBreed("BACTERIA").ask(function() {
      if (Prims.equality(world.observer.getGlobal("visualize-variation"), "# flagella as label")) {
        SelfManager.self().setVariable("label", (Dump('') + Dump(SelfManager.self().getVariable("variation")) + Dump("     ")));
      }
      else {
        SelfManager.self().setVariable("label", "");
      }
      if (ListPrims.member(world.observer.getGlobal("visualize-variation"), ["flagella and color", "as color only"])) {
        SelfManager.self().setVariable("color", ListPrims.item((SelfManager.self().getVariable("variation") - 1), [115, 105, 55, 35, 25, 15]));
      }
      else {
        SelfManager.self().setVariable("color", world.observer.getGlobal("bacteria-default-color"));
      }
    }, true);
    world.turtleManager.turtlesOfBreed("FLAGELLA").ask(function() {
      SelfManager.self().setVariable("hidden?", ListPrims.member(world.observer.getGlobal("visualize-variation"), ["as color only", "# flagella as label", "none"]));
    }, true);
  });
  procs["visualizeBacteria"] = temp;
  procs["VISUALIZE-BACTERIA"] = temp;
  temp = (function() {
    world.turtleManager.turtlesOfBreed("REMOVAL-SPOTS").ask(function() {
      SelfManager.self().setVariable("countdown", (SelfManager.self().getVariable("countdown") - 1));
      SelfManager.self().setVariable("color", ListPrims.lput((SelfManager.self().getVariable("countdown") * 4), [0, 100, 0]));
      if (Prims.lte(SelfManager.self().getVariable("countdown"), 0)) {
        SelfManager.self().die();
      }
    }, true);
  });
  procs["visualizeRemovalSpots"] = temp;
  procs["VISUALIZE-REMOVAL-SPOTS"] = temp;
  return procs;
})();
world.observer.setGlobal("initial-bacteria-per-variation", 5);
world.observer.setGlobal("visualize-variation", "flagella and color");
