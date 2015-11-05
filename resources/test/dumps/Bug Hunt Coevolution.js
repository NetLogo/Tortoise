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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"bird":{"name":"bird","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[151,136,123,143,156,179,166],"ycors":[170,170,229,244,244,229,170],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[152,137,125,140,159,179,167],"ycors":[154,154,213,229,229,214,154],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[151,136,126,139,159,176,166],"ycors":[140,140,202,214,214,200,140],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,134,128,140,161,174,166],"ycors":[125,124,188,198,197,188,125],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[152,227,286,272,294,276,287,270,278,264,267,228,153],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[160,159,149,130,139,133,127,129,134,150,168,172,169],"ycors":[74,61,54,53,62,81,113,149,177,206,179,147,111],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":55,"diam":7,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[129,135,139],"ycors":[53,58,54],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[148,73,14,28,6,24,13,30,22,36,33,72,147],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"bird-stationary":{"name":"bird-stationary","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[151,136,123,143,156,179,166],"ycors":[170,170,229,244,244,229,170],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[152,137,125,140,159,179,167],"ycors":[154,154,213,229,229,214,154],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[151,136,126,139,159,176,166],"ycors":[140,140,202,214,214,200,140],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,134,128,140,161,174,166],"ycors":[125,124,188,198,197,188,125],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[152,227,286,272,294,276,287,270,278,264,267,228,153],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[160,159,149,130,139,133,127,129,134,150,168,172,169],"ycors":[74,61,54,53,62,81,113,149,177,206,179,147,111],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":55,"diam":7,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[129,135,139],"ycors":[53,58,54],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[148,73,14,28,6,24,13,30,22,36,33,72,147],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":2,"y":2,"diam":295,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"vision cone":{"name":"vision cone","editableColorIndex":2,"rotate":true,"elements":[{"xcors":[150,30,60,90,150,210,240,270],"ycors":[150,60,30,15,0,15,30,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":false,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    notify:  function(str) {}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
modelConfig.plots = [(function() {
  var name    = 'Avg. Vision vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('bugs', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('birds', plotOps.makePenOps, false, new PenBundle.State(35.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "vision", false, true, 0.0, 1000.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Speed of Bugs';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('#', plotOps.makePenOps, false, new PenBundle.State(0.0, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen1', plotOps.makePenOps, false, new PenBundle.State(115.0, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen2', plotOps.makePenOps, false, new PenBundle.State(105.0, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen3', plotOps.makePenOps, false, new PenBundle.State(55.0, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen4', plotOps.makePenOps, false, new PenBundle.State(44.2, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen5', plotOps.makePenOps, false, new PenBundle.State(25.0, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen6', plotOps.makePenOps, false, new PenBundle.State(15.0, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "speed", "frequency", false, true, 0.0, 10.0, 0.0, 50.0, setup, update);
})(), (function() {
  var name    = 'Avg. Speed vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('birds', plotOps.makePenOps, false, new PenBundle.State(35.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('bugs', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "rate", false, true, 0.0, 1000.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Speed of Birds';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('#', plotOps.makePenOps, false, new PenBundle.State(35.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('speed=1', plotOps.makePenOps, false, new PenBundle.State(115.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=2', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=3', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=4', plotOps.makePenOps, false, new PenBundle.State(44.2, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=5', plotOps.makePenOps, false, new PenBundle.State(25.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=6', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "speed", "frequency", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Vision of Bugs';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('#', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "vision", "frequency", false, true, 0.0, 10.0, 0.0, 50.0, setup, update);
})(), (function() {
  var name    = 'Vision of Birds';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('#', plotOps.makePenOps, false, new PenBundle.State(35.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "vision", "birds", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "BUGS", singular: "bug", varNames: ["speed", "vision"] }, { name: "PLAYERS", singular: "player", varNames: [] }, { name: "BIRDS", singular: "bird", varNames: ["speed", "target", "eaten", "vision"] }, { name: "VISION-CONES", singular: "vision-cone", varNames: [] }])([], [])(["number-bugs", "number-birds", "initial-bird-speed", "initial-bird-vision", "initial-bug-vision", "show-vision-cone?", "wiggle?", "bird-vision-mutation", "bird-speed-mutation", "bug-vision-mutation", "bug-speed-mutation", "bug-pursuit-strategy", "bug-flee-strategy", "initial-bug-speed", "total-caught", "total-speed-6-caught", "total-speed-5-caught", "total-speed-4-caught", "total-speed-3-caught", "total-speed-2-caught", "total-speed-1-caught", "old-color-map", "histogram-interval-size", "max-vision", "max-speed", "old-show-initial-bug-vision-cone?", "old-vision-cone-distance", "avg-bug-speed", "avg-bird-speed", "avg-bug-vision", "avg-bird-vision", "reproduce-birds-after-eating", "speed-factor"], ["number-bugs", "number-birds", "initial-bird-speed", "initial-bird-vision", "initial-bug-vision", "show-vision-cone?", "wiggle?", "bird-vision-mutation", "bird-speed-mutation", "bug-vision-mutation", "bug-speed-mutation", "bug-pursuit-strategy", "bug-flee-strategy", "initial-bug-speed"], [], -13, 13, -13, 13, 16.0, true, true, turtleShapes, linkShapes, function(){});
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
  var setup = function() {
    world.clearAll();
    world.observer.setGlobal("total-caught", 0);
    world.observer.setGlobal("histogram-interval-size", 1);
    world.observer.setGlobal("old-show-initial-bug-vision-cone?", 0);
    world.observer.setGlobal("old-vision-cone-distance", world.observer.getGlobal("initial-bug-vision"));
    world.observer.setGlobal("reproduce-birds-after-eating", 25);
    world.observer.setGlobal("speed-factor", 0.05);
    world.observer.setGlobal("max-speed", 10);
    world.observer.setGlobal("max-vision", 10);
    world.patches().ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    world.turtleManager.createTurtles(world.observer.getGlobal("number-bugs"), "BUGS").ask(function() {
      SelfManager.self().setVariable("speed", world.observer.getGlobal("initial-bug-speed"));
      procedures.attachVisionCone();
    }, true);
    world.turtleManager.turtlesOfBreed("BUGS").ask(function() {
      SelfManager.self().setVariable("vision", world.observer.getGlobal("initial-bug-vision"));
      SelfManager.self().setVariable("shape", "bug");
      SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor));
    }, true);
    world.turtleManager.createTurtles(1, "PLAYERS").ask(function() {
      SelfManager.self().setVariable("shape", "bird");
      SelfManager.self().setVariable("color", 35);
      SelfManager.self().setVariable("hidden?", true);
    }, true);
    world.turtleManager.createTurtles(world.observer.getGlobal("number-birds"), "BIRDS").ask(function() {
      SelfManager.self().setVariable("vision", world.observer.getGlobal("initial-bird-vision"));
      SelfManager.self().setVariable("shape", "bird-stationary");
      SelfManager.self().setVariable("color", 35);
      SelfManager.self().setVariable("hidden?", false);
      SelfManager.self().setXY(Prims.random(100), Prims.random(100));
      SelfManager.self().setVariable("speed", world.observer.getGlobal("initial-bird-speed"));
      procedures.attachVisionCone();
    }, true);
    world.turtleManager.turtlesOfBreed("VISION-CONES").ask(function() { procedures.setVisualizeVisionCone(); }, true);
    world.ticker.reset();
    procedures.doPlots();
  };
  var attachVisionCone = function() {
    var parentVision = SelfManager.self().getVariable("vision");
    SelfManager.self().hatch(1, "").ask(function() {
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("VISION-CONES"));
      LinkPrims.createLinkFrom(SelfManager.myself(), "LINKS").ask(function() { SelfManager.self().tie(); }, true);
      SelfManager.self().setVariable("shape", "vision cone");
      SelfManager.self().setVariable("color", 5);
      SelfManager.self().setVariable("size", parentVision);
      procedures.setVisualizeVisionCone();
    }, true);
  };
  var go = function() {
    procedures.checkVisualizeVisionConeChange();
    procedures.checkPlayerCaught();
    procedures.checkBirdCatch();
    procedures.movePlayer();
    procedures.moveBugs();
    procedures.moveBirds();
    procedures.reproduceBirds();
    world.ticker.tick();
    procedures.updateVariables();
    procedures.doPlots();
  };
  var updateVariables = function() {
    if (world.turtleManager.turtlesOfBreed("BUGS").nonEmpty()) {
      world.observer.setGlobal("avg-bug-speed", ListPrims.mean(world.turtleManager.turtlesOfBreed("BUGS").projectionBy(function() { return SelfManager.self().getVariable("speed"); })));
      world.observer.setGlobal("avg-bug-vision", ListPrims.mean(world.turtleManager.turtlesOfBreed("BUGS").projectionBy(function() { return SelfManager.self().getVariable("vision"); })));
    }
    else {
      world.observer.setGlobal("avg-bug-speed", 0);
    }
    if (world.turtleManager.turtlesOfBreed("BIRDS").nonEmpty()) {
      world.observer.setGlobal("avg-bird-speed", ListPrims.mean(world.turtleManager.turtlesOfBreed("BIRDS").projectionBy(function() { return SelfManager.self().getVariable("speed"); })));
      world.observer.setGlobal("avg-bird-vision", ListPrims.mean(world.turtleManager.turtlesOfBreed("BIRDS").projectionBy(function() { return SelfManager.self().getVariable("vision"); })));
    }
    else {
      world.observer.setGlobal("avg-bird-speed", 0);
    }
  };
  var reproduceBirds = function() {
    var worstBird = Nobody;
    if (((Prims.equality(NLMath.mod(world.observer.getGlobal("total-caught"), world.observer.getGlobal("reproduce-birds-after-eating")), 0) && Prims.gt(world.observer.getGlobal("total-caught"), 0)) && world.turtleManager.turtlesOfBreed("BIRDS").nonEmpty())) {
      worstBird = world.turtleManager.turtlesOfBreed("BIRDS").minOneOf(function() { return SelfManager.self().getVariable("eaten"); });
      worstBird.ask(function() {
        LinkPrims.outLinkNeighbors("LINKS").ask(function() {
          SelfManager.self().setVariable("color", 15);
          SelfManager.self().die();
        }, true);
        SelfManager.self().die();
      }, true);
      procedures.reproduceOneBird();
    }
  };
  var moveBugs = function() {
    var targetHeading = 0;
    var candidatePredators = Nobody;
    var predator = Nobody;
    var allPredators = Prims.turtleSet(world.turtleManager.turtlesOfBreed("BIRDS"), world.turtleManager.turtlesOfBreed("PLAYERS"));
    world.turtleManager.turtlesOfBreed("BUGS").ask(function() {
      SelfManager.self().fd((SelfManager.self().getVariable("speed") * world.observer.getGlobal("speed-factor")));
      if (SelfManager.self().inCone(allPredators, SelfManager.self().getVariable("vision"), 120).nonEmpty()) {
        candidatePredators = SelfManager.self().inCone(allPredators, SelfManager.self().getVariable("vision"), 120);
        if ((Prims.equality(world.observer.getGlobal("bug-flee-strategy"), "any") && candidatePredators.nonEmpty())) {
          predator = ListPrims.oneOf(candidatePredators);
        }
        if ((Prims.equality(world.observer.getGlobal("bug-flee-strategy"), "nearest") && candidatePredators.nonEmpty())) {
          predator = candidatePredators.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); });
        }
        targetHeading = (180 + SelfManager.self().towards(predator));
        SelfManager.self().setVariable("heading", targetHeading);
        SelfManager.self().setVariable("label-color", 0);
        SelfManager.self().setVariable("label", "!");
      }
      else {
        procedures.wiggle();
        SelfManager.self().setVariable("label", "");
      }
    }, true);
  };
  var moveBirds = function() {
    var preyAgent = Nobody;
    var candidateBugs = Nobody;
    var closestBug = Nobody;
    var assignedTarget_p = false;
    world.turtleManager.turtlesOfBreed("BIRDS").ask(function() {
      candidateBugs = SelfManager.self().inCone(world.turtleManager.turtlesOfBreed("BUGS"), world.observer.getGlobal("initial-bird-vision"), 120);
      if (candidateBugs.nonEmpty()) {
        closestBug = candidateBugs.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); });
        if ((Prims.equality(SelfManager.self().getVariable("target"), Nobody) && Prims.equality(world.observer.getGlobal("bug-pursuit-strategy"), "lock on one"))) {
          preyAgent = closestBug;
          SelfManager.self().setVariable("target", preyAgent);
          SelfManager.self().setVariable("heading", SelfManager.self().towards(preyAgent));
          SelfManager.self().setVariable("label-color", (15 - 2));
          SelfManager.self().setVariable("label", "!");
          assignedTarget_p = true;
        }
        if ((Prims.equality(world.observer.getGlobal("bug-pursuit-strategy"), "closest") && !Prims.equality(SelfManager.self().getVariable("target"), closestBug))) {
          preyAgent = closestBug;
          SelfManager.self().setVariable("target", preyAgent);
          SelfManager.self().setVariable("heading", SelfManager.self().towards(preyAgent));
          SelfManager.self().setVariable("label-color", (15 - 2));
          SelfManager.self().setVariable("label", "!");
          assignedTarget_p = true;
        }
        if (!Prims.equality(assignedTarget_p, false)) {
          SelfManager.self().setVariable("target", Nobody);
          SelfManager.self().setVariable("label", "");
          procedures.wiggle();
        }
      }
      else {
        SelfManager.self().setVariable("target", Nobody);
        SelfManager.self().setVariable("label", "");
        procedures.wiggle();
      }
      SelfManager.self().fd((SelfManager.self().getVariable("speed") * world.observer.getGlobal("speed-factor")));
    }, true);
  };
  var wiggle = function() {
    if (world.observer.getGlobal("wiggle?")) {
      SelfManager.self().right(((Prims.randomFloat(30) * 0.05) / world.observer.getGlobal("speed-factor")));
      SelfManager.self().right(-((Prims.randomFloat(30) * 0.05) / world.observer.getGlobal("speed-factor")));
    }
  };
  var movePlayer = function() {
    if (MousePrims.isInside()) {
      world.turtleManager.turtlesOfBreed("PLAYERS").ask(function() {
        SelfManager.self().setXY(MousePrims.getX(), MousePrims.getY());
        SelfManager.self().setVariable("hidden?", false);
      }, true);
    }
    else {
      world.turtleManager.turtlesOfBreed("PLAYERS").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
    }
  };
  var checkPlayerCaught = function() {
    var speedOfCaught = 0;
    var localBugs = 0;
    var snapMouseXcor = MousePrims.getX();
    var snapMouseYcor = MousePrims.getY();
    if ((MousePrims.isDown() && MousePrims.isInside())) {
      localBugs = Prims.breedOn("BUGS", world.getPatchAt(snapMouseXcor, snapMouseYcor));
      if (localBugs.nonEmpty()) {
        world.observer.setGlobal("total-caught", (world.observer.getGlobal("total-caught") + 1));
        ListPrims.oneOf(localBugs).ask(function() {
          speedOfCaught = SelfManager.self().getVariable("speed");
          if (Prims.equality(speedOfCaught, 1)) {
            world.observer.setGlobal("total-speed-6-caught", (world.observer.getGlobal("total-speed-6-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 2)) {
            world.observer.setGlobal("total-speed-5-caught", (world.observer.getGlobal("total-speed-5-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 3)) {
            world.observer.setGlobal("total-speed-4-caught", (world.observer.getGlobal("total-speed-4-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 4)) {
            world.observer.setGlobal("total-speed-3-caught", (world.observer.getGlobal("total-speed-3-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 5)) {
            world.observer.setGlobal("total-speed-2-caught", (world.observer.getGlobal("total-speed-2-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 6)) {
            world.observer.setGlobal("total-speed-1-caught", (world.observer.getGlobal("total-speed-1-caught") + 1));
          }
          LinkPrims.outLinkNeighbors("LINKS").ask(function() {
            SelfManager.self().setVariable("color", 15);
            SelfManager.self().die();
          }, true);
          SelfManager.self().die();
        }, true);
        procedures.reproduceOneBug();
      }
    }
  };
  var checkBirdCatch = function() {
    var speedOfCaught = 0;
    world.turtleManager.turtlesOfBreed("BIRDS").ask(function() {
      if (SelfManager.self().breedHere("BUGS").nonEmpty()) {
        world.observer.setGlobal("total-caught", (world.observer.getGlobal("total-caught") + 1));
        SelfManager.self().setVariable("eaten", (SelfManager.self().getVariable("eaten") + 1));
        ListPrims.oneOf(SelfManager.self().breedHere("BUGS")).ask(function() {
          speedOfCaught = SelfManager.self().getVariable("speed");
          if (Prims.equality(speedOfCaught, 1)) {
            world.observer.setGlobal("total-speed-6-caught", (world.observer.getGlobal("total-speed-6-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 2)) {
            world.observer.setGlobal("total-speed-5-caught", (world.observer.getGlobal("total-speed-5-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 3)) {
            world.observer.setGlobal("total-speed-4-caught", (world.observer.getGlobal("total-speed-4-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 4)) {
            world.observer.setGlobal("total-speed-3-caught", (world.observer.getGlobal("total-speed-3-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 5)) {
            world.observer.setGlobal("total-speed-2-caught", (world.observer.getGlobal("total-speed-2-caught") + 1));
          }
          if (Prims.equality(speedOfCaught, 6)) {
            world.observer.setGlobal("total-speed-1-caught", (world.observer.getGlobal("total-speed-1-caught") + 1));
          }
          LinkPrims.outLinkNeighbors("LINKS").ask(function() {
            SelfManager.self().setVariable("color", 15);
            SelfManager.self().die();
          }, true);
          SelfManager.self().die();
        }, true);
        SelfManager.self().setVariable("target", Nobody);
        procedures.reproduceOneBug();
      }
    }, true);
  };
  var reproduceOneBug = function() {
    ListPrims.oneOf(world.turtleManager.turtlesOfBreed("BUGS")).ask(function() {
      SelfManager.self().hatch(1, "").ask(function() {
        procedures.mutateOffspringBug();
        SelfManager.self().setVariable("heading", Prims.randomFloat(360));
        procedures.attachVisionCone();
      }, true);
    }, true);
  };
  var reproduceOneBird = function() {
    var birdEnergySplit = 0;
    if (Prims.gt(world.turtleManager.turtlesOfBreed("BIRDS").size(), 0)) {
      ListPrims.oneOf(world.turtleManager.turtlesOfBreed("BIRDS")).ask(function() {
        birdEnergySplit = (SelfManager.self().getVariable("eaten") / 2);
        SelfManager.self().setVariable("eaten", birdEnergySplit);
        SelfManager.self().hatch(1, "").ask(function() {
          procedures.mutateOffspringBird();
          SelfManager.self().setVariable("heading", Prims.randomFloat(360));
          procedures.attachVisionCone();
        }, true);
      }, true);
    }
  };
  var mutateOffspringBug = function() {
    if (Prims.equality(Prims.random(2), 0)) {
      SelfManager.self().setVariable("vision", (SelfManager.self().getVariable("vision") + Prims.randomFloat(world.observer.getGlobal("bug-vision-mutation"))));
    }
    else {
      SelfManager.self().setVariable("vision", (SelfManager.self().getVariable("vision") - Prims.randomFloat(world.observer.getGlobal("bug-vision-mutation"))));
    }
    if (Prims.gt(SelfManager.self().getVariable("vision"), world.observer.getGlobal("max-vision"))) {
      SelfManager.self().setVariable("vision", world.observer.getGlobal("max-vision"));
    }
    if (Prims.lt(SelfManager.self().getVariable("vision"), 0)) {
      SelfManager.self().setVariable("vision", 0);
    }
    if (Prims.equality(Prims.random(2), 0)) {
      SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") + Prims.randomFloat(world.observer.getGlobal("bug-speed-mutation"))));
    }
    else {
      SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") - Prims.randomFloat(world.observer.getGlobal("bug-speed-mutation"))));
    }
    if (Prims.gt(SelfManager.self().getVariable("speed"), world.observer.getGlobal("max-speed"))) {
      SelfManager.self().setVariable("speed", world.observer.getGlobal("max-speed"));
    }
    if (Prims.lt(SelfManager.self().getVariable("speed"), 0)) {
      SelfManager.self().setVariable("speed", 0);
    }
  };
  var mutateOffspringBird = function() {
    if (Prims.equality(Prims.random(2), 0)) {
      SelfManager.self().setVariable("vision", (SelfManager.self().getVariable("vision") + Prims.randomFloat(world.observer.getGlobal("bird-vision-mutation"))));
    }
    else {
      SelfManager.self().setVariable("vision", (SelfManager.self().getVariable("vision") - Prims.randomFloat(world.observer.getGlobal("bird-vision-mutation"))));
    }
    if (Prims.gt(SelfManager.self().getVariable("vision"), world.observer.getGlobal("max-vision"))) {
      SelfManager.self().setVariable("vision", world.observer.getGlobal("max-vision"));
    }
    if (Prims.lt(SelfManager.self().getVariable("vision"), 0)) {
      SelfManager.self().setVariable("vision", 0);
    }
    if (Prims.equality(Prims.random(2), 0)) {
      SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") + Prims.randomFloat(world.observer.getGlobal("bird-speed-mutation"))));
    }
    else {
      SelfManager.self().setVariable("speed", (SelfManager.self().getVariable("speed") - Prims.randomFloat(world.observer.getGlobal("bird-speed-mutation"))));
    }
    if (Prims.gt(SelfManager.self().getVariable("speed"), world.observer.getGlobal("max-speed"))) {
      SelfManager.self().setVariable("speed", world.observer.getGlobal("max-speed"));
    }
    if (Prims.lt(SelfManager.self().getVariable("speed"), 0)) {
      SelfManager.self().setVariable("speed", 0);
    }
  };
  var checkVisualizeVisionConeChange = function() {
    if (!Prims.equality(world.observer.getGlobal("old-show-initial-bug-vision-cone?"), world.observer.getGlobal("show-vision-cone?"))) {
      world.observer.setGlobal("old-show-initial-bug-vision-cone?", world.observer.getGlobal("show-vision-cone?"));
      world.turtleManager.turtlesOfBreed("VISION-CONES").ask(function() { procedures.setVisualizeVisionCone(); }, true);
    }
    if (!Prims.equality(world.observer.getGlobal("old-vision-cone-distance"), world.observer.getGlobal("initial-bug-vision"))) {
      world.observer.setGlobal("old-vision-cone-distance", world.observer.getGlobal("initial-bug-vision"));
      world.turtleManager.turtlesOfBreed("VISION-CONES").ask(function() { procedures.setVisualizeVisionCone(); }, true);
    }
  };
  var setVisualizeVisionCone = function() {
    var parentVision = ListPrims.oneOf(LinkPrims.inLinkNeighbors("LINKS")).projectionBy(function() { return SelfManager.self().getVariable("vision"); });
    if (world.observer.getGlobal("show-vision-cone?")) {
      SelfManager.self().setVariable("hidden?", false);
      SelfManager.self().setVariable("size", (2 * parentVision));
    }
    else {
      SelfManager.self().setVariable("hidden?", true);
      SelfManager.self().setVariable("size", (2 * parentVision));
    }
  };
  var recolorShade = function() { SelfManager.self().setVariable("color", (111 + SelfManager.self().getVariable("speed"))); };
  var recolorRainbow = function() {
    if (Prims.equality(NLMath.floor(SelfManager.self().getVariable("speed")), 6)) {
      SelfManager.self().setVariable("color", 15);
    }
    if (Prims.equality(NLMath.floor(SelfManager.self().getVariable("speed")), 5)) {
      SelfManager.self().setVariable("color", 25);
    }
    if (Prims.equality(NLMath.floor(SelfManager.self().getVariable("speed")), 4)) {
      SelfManager.self().setVariable("color", (45 - 1));
    }
    if (Prims.equality(NLMath.floor(SelfManager.self().getVariable("speed")), 3)) {
      SelfManager.self().setVariable("color", 55);
    }
    if (Prims.equality(NLMath.floor(SelfManager.self().getVariable("speed")), 2)) {
      SelfManager.self().setVariable("color", 105);
    }
    if (Prims.equality(NLMath.floor(SelfManager.self().getVariable("speed")), 1)) {
      SelfManager.self().setVariable("color", 115);
    }
    if (Prims.gte(NLMath.floor(SelfManager.self().getVariable("speed")), 7)) {
      SelfManager.self().setVariable("color", (5 - 2));
    }
    if (Prims.lt(NLMath.floor(SelfManager.self().getVariable("speed")), 1)) {
      SelfManager.self().setVariable("color", (5 + 2));
    }
  };
  var doPlots = function() {
    if (Prims.equality(NLMath.mod(world.ticker.tickCount(), 100), 1)) {
      plotManager.setCurrentPlot("Avg. Vision vs. Time");
      plotManager.setCurrentPen("bugs");
      if (world.turtleManager.turtlesOfBreed("BUGS").nonEmpty()) {
        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("avg-bug-vision"));
      }
      plotManager.setCurrentPen("birds");
      if (world.turtleManager.turtlesOfBreed("BIRDS").nonEmpty()) {
        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("avg-bird-vision"));
      }
      plotManager.setCurrentPlot("Avg. Speed vs. Time");
      plotManager.setCurrentPen("bugs");
      if (world.turtleManager.turtlesOfBreed("BUGS").nonEmpty()) {
        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("avg-bug-speed"));
      }
      plotManager.setCurrentPen("birds");
      if (world.turtleManager.turtlesOfBreed("BIRDS").nonEmpty()) {
        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("avg-bird-speed"));
      }
      plotManager.setCurrentPlot("Speed of Bugs");
      procedures.plotHistogramsBugsSpeed();
      plotManager.setCurrentPlot("Vision of Bugs");
      procedures.plotHistogramsInitialBugVision();
      plotManager.setCurrentPlot("Speed of Birds");
      procedures.plotHistogramsInitialBirdSpeed();
      plotManager.setCurrentPlot("Vision of Birds");
      procedures.plotHistogramsInitialBirdVision();
    }
  };
  var plotCaught = function() {
    plotManager.setCurrentPen("speed=1");
    plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("total-speed-1-caught"));
    plotManager.setCurrentPen("speed=2");
    plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("total-speed-2-caught"));
    plotManager.setCurrentPen("speed=3");
    plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("total-speed-3-caught"));
    plotManager.setCurrentPen("speed=4");
    plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("total-speed-4-caught"));
    plotManager.setCurrentPen("speed=5");
    plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("total-speed-5-caught"));
    plotManager.setCurrentPen("speed=6");
    plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("total-speed-6-caught"));
  };
  var plotPopulations = function() {
    plotManager.setCurrentPen("speed=1");
    plotManager.plotValue(world.turtleManager.turtlesOfBreed("BUGS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("speed"), 1); }).size());
    plotManager.setCurrentPen("speed=2");
    plotManager.plotValue(world.turtleManager.turtlesOfBreed("BUGS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("speed"), 2); }).size());
    plotManager.setCurrentPen("speed=3");
    plotManager.plotValue(world.turtleManager.turtlesOfBreed("BUGS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("speed"), 3); }).size());
    plotManager.setCurrentPen("speed=4");
    plotManager.plotValue(world.turtleManager.turtlesOfBreed("BUGS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("speed"), 4); }).size());
    plotManager.setCurrentPen("speed=5");
    plotManager.plotValue(world.turtleManager.turtlesOfBreed("BUGS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("speed"), 5); }).size());
    plotManager.setCurrentPen("speed=6");
    plotManager.plotValue(world.turtleManager.turtlesOfBreed("BUGS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("speed"), 6); }).size());
  };
  var plotHistogramsBugsSpeed = function() {
    plotManager.setHistogramBarCount(10);
    plotManager.setCurrentPen("#");
    plotManager.setPenInterval(world.observer.getGlobal("histogram-interval-size"));
    plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("BUGS").projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
  };
  var plotHistogramsInitialBugVision = function() {
    plotManager.setHistogramBarCount(10);
    plotManager.setCurrentPen("#");
    plotManager.setPenInterval(world.observer.getGlobal("histogram-interval-size"));
    plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("BUGS").projectionBy(function() { return SelfManager.self().getVariable("vision"); }));
  };
  var plotHistogramsInitialBirdSpeed = function() {
    plotManager.setHistogramBarCount(10);
    plotManager.setCurrentPen("#");
    plotManager.setPenInterval(world.observer.getGlobal("histogram-interval-size"));
    plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("BIRDS").projectionBy(function() { return SelfManager.self().getVariable("speed"); }));
  };
  var plotHistogramsInitialBirdVision = function() {
    plotManager.setHistogramBarCount(10);
    plotManager.setCurrentPen("#");
    plotManager.setPenInterval(world.observer.getGlobal("histogram-interval-size"));
    plotManager.drawHistogramFrom(world.turtleManager.turtlesOfBreed("BIRDS").projectionBy(function() { return SelfManager.self().getVariable("vision"); }));
  };
  return {
    "ATTACH-VISION-CONE":attachVisionCone,
    "CHECK-BIRD-CATCH":checkBirdCatch,
    "CHECK-PLAYER-CAUGHT":checkPlayerCaught,
    "CHECK-VISUALIZE-VISION-CONE-CHANGE":checkVisualizeVisionConeChange,
    "DO-PLOTS":doPlots,
    "GO":go,
    "MOVE-BIRDS":moveBirds,
    "MOVE-BUGS":moveBugs,
    "MOVE-PLAYER":movePlayer,
    "MUTATE-OFFSPRING-BIRD":mutateOffspringBird,
    "MUTATE-OFFSPRING-BUG":mutateOffspringBug,
    "PLOT-CAUGHT":plotCaught,
    "PLOT-HISTOGRAMS-BUGS-SPEED":plotHistogramsBugsSpeed,
    "PLOT-HISTOGRAMS-INITIAL-BIRD-SPEED":plotHistogramsInitialBirdSpeed,
    "PLOT-HISTOGRAMS-INITIAL-BIRD-VISION":plotHistogramsInitialBirdVision,
    "PLOT-HISTOGRAMS-INITIAL-BUG-VISION":plotHistogramsInitialBugVision,
    "PLOT-POPULATIONS":plotPopulations,
    "RECOLOR-RAINBOW":recolorRainbow,
    "RECOLOR-SHADE":recolorShade,
    "REPRODUCE-BIRDS":reproduceBirds,
    "REPRODUCE-ONE-BIRD":reproduceOneBird,
    "REPRODUCE-ONE-BUG":reproduceOneBug,
    "SET-VISUALIZE-VISION-CONE":setVisualizeVisionCone,
    "SETUP":setup,
    "UPDATE-VARIABLES":updateVariables,
    "WIGGLE":wiggle,
    "attachVisionCone":attachVisionCone,
    "checkBirdCatch":checkBirdCatch,
    "checkPlayerCaught":checkPlayerCaught,
    "checkVisualizeVisionConeChange":checkVisualizeVisionConeChange,
    "doPlots":doPlots,
    "go":go,
    "moveBirds":moveBirds,
    "moveBugs":moveBugs,
    "movePlayer":movePlayer,
    "mutateOffspringBird":mutateOffspringBird,
    "mutateOffspringBug":mutateOffspringBug,
    "plotCaught":plotCaught,
    "plotHistogramsBugsSpeed":plotHistogramsBugsSpeed,
    "plotHistogramsInitialBirdSpeed":plotHistogramsInitialBirdSpeed,
    "plotHistogramsInitialBirdVision":plotHistogramsInitialBirdVision,
    "plotHistogramsInitialBugVision":plotHistogramsInitialBugVision,
    "plotPopulations":plotPopulations,
    "recolorRainbow":recolorRainbow,
    "recolorShade":recolorShade,
    "reproduceBirds":reproduceBirds,
    "reproduceOneBird":reproduceOneBird,
    "reproduceOneBug":reproduceOneBug,
    "setVisualizeVisionCone":setVisualizeVisionCone,
    "setup":setup,
    "updateVariables":updateVariables,
    "wiggle":wiggle
  };
})();
world.observer.setGlobal("number-bugs", 30);
world.observer.setGlobal("number-birds", 10);
world.observer.setGlobal("initial-bird-speed", 2);
world.observer.setGlobal("initial-bird-vision", 0);
world.observer.setGlobal("initial-bug-vision", 0);
world.observer.setGlobal("show-vision-cone?", true);
world.observer.setGlobal("wiggle?", true);
world.observer.setGlobal("bird-vision-mutation", 0);
world.observer.setGlobal("bird-speed-mutation", 1);
world.observer.setGlobal("bug-vision-mutation", 0);
world.observer.setGlobal("bug-speed-mutation", 1);
world.observer.setGlobal("bug-pursuit-strategy", "nearest");
world.observer.setGlobal("bug-flee-strategy", "nearest");
world.observer.setGlobal("initial-bug-speed", 2);
