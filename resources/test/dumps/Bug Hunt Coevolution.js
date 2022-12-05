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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"bird":{"name":"bird","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[151,136,123,143,156,179,166],"ycors":[170,170,229,244,244,229,170],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[152,137,125,140,159,179,167],"ycors":[154,154,213,229,229,214,154],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[151,136,126,139,159,176,166],"ycors":[140,140,202,214,214,200,140],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,134,128,140,161,174,166],"ycors":[125,124,188,198,197,188,125],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[152,227,286,272,294,276,287,270,278,264,267,228,153],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[160,159,149,130,139,133,127,129,134,150,168,172,169],"ycors":[74,61,54,53,62,81,113,149,177,206,179,147,111],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":55,"diam":7,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[129,135,139],"ycors":[53,58,54],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[148,73,14,28,6,24,13,30,22,36,33,72,147],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"bird-stationary":{"name":"bird-stationary","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[151,136,123,143,156,179,166],"ycors":[170,170,229,244,244,229,170],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[152,137,125,140,159,179,167],"ycors":[154,154,213,229,229,214,154],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[151,136,126,139,159,176,166],"ycors":[140,140,202,214,214,200,140],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,134,128,140,161,174,166],"ycors":[125,124,188,198,197,188,125],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[152,227,286,272,294,276,287,270,278,264,267,228,153],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[160,159,149,130,139,133,127,129,134,150,168,172,169],"ycors":[74,61,54,53,62,81,113,149,177,206,179,147,111],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":55,"diam":7,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[129,135,139],"ycors":[53,58,54],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[148,73,14,28,6,24,13,30,22,36,33,72,147],"ycors":[86,72,97,101,117,118,131,131,141,138,145,150,147],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":2,"y":2,"diam":295,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"vision cone":{"name":"vision cone","editableColorIndex":2,"rotate":true,"elements":[{"xcors":[150,30,60,90,150,210,240,270],"ycors":[150,60,30,15,0,15,30,60],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":false,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Avg. Vision vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('bugs', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('birds', plotOps.makePenOps, false, new PenBundle.State(35, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "vision", false, true, 0, 1000, 0, 10, setup, update);
})(), (function() {
  var name    = 'Speed of Bugs';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('#', plotOps.makePenOps, false, new PenBundle.State(0, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen1', plotOps.makePenOps, false, new PenBundle.State(115, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen2', plotOps.makePenOps, false, new PenBundle.State(105, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen3', plotOps.makePenOps, false, new PenBundle.State(55, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen4', plotOps.makePenOps, false, new PenBundle.State(44.2, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen5', plotOps.makePenOps, false, new PenBundle.State(25, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('pen6', plotOps.makePenOps, false, new PenBundle.State(15, 0.1, PenBundle.DisplayMode.Bar), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "speed", "frequency", false, true, 0, 10, 0, 50, setup, update);
})(), (function() {
  var name    = 'Avg. Speed vs. Time';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('birds', plotOps.makePenOps, false, new PenBundle.State(35, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('bugs', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "rate", false, true, 0, 1000, 0, 10, setup, update);
})(), (function() {
  var name    = 'Speed of Birds';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('#', plotOps.makePenOps, false, new PenBundle.State(35, 1, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('speed=1', plotOps.makePenOps, false, new PenBundle.State(115, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=2', plotOps.makePenOps, false, new PenBundle.State(105, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=3', plotOps.makePenOps, false, new PenBundle.State(55, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=4', plotOps.makePenOps, false, new PenBundle.State(44.2, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=5', plotOps.makePenOps, false, new PenBundle.State(25, 1, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('speed=6', plotOps.makePenOps, false, new PenBundle.State(15, 1, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "speed", "frequency", false, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Vision of Bugs';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('#', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Bar), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "vision", "frequency", false, true, 0, 10, 0, 50, setup, update);
})(), (function() {
  var name    = 'Vision of Birds';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('#', plotOps.makePenOps, false, new PenBundle.State(35, 1, PenBundle.DisplayMode.Bar), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "vision", "birds", false, true, 0, 10, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "bugs", singular: "bug", varNames: ["speed", "vision"] }, { name: "players", singular: "player", varNames: [] }, { name: "birds", singular: "bird", varNames: ["speed", "target", "eaten", "vision"] }, { name: "vision-cones", singular: "vision-cone", varNames: [] }])([], [])('breed [bugs bug] breed [players player] breed [birds bird] breed [vision-cones vision-cone]   bugs-own [speed vision] birds-own [speed target eaten vision]   globals [     total-caught                 ;; keeps track of total number of bugs caught     total-speed-6-caught         ;; keeps track of the number of bugs caught with speed of 6     total-speed-5-caught         ;; keeps track of the number of bugs caught with speed of 5     total-speed-4-caught         ;; keeps track of the number of bugs caught with speed of 4     total-speed-3-caught         ;; keeps track of the number of bugs caught with speed of 3     total-speed-2-caught         ;; keeps track of the number of bugs caught with speed of 2     total-speed-1-caught         ;; keeps track of the number of bugs caught with speed of 1     old-color-map                ;; keeps track of the previous value of the SPEED-COLOR-MAP chooser     histogram-interval-size      ;; the value of the interval size for each bar of the histogram     max-vision                   ;; upper limit for the maximum vision allowable for birds or bugs     max-speed                    ;; upper limit for the maximum speed allowable for birds or bugs     old-show-initial-bug-vision-cone?     old-vision-cone-distance     avg-bug-speed     avg-bird-speed     avg-bug-vision     avg-bird-vision     reproduce-birds-after-eating     speed-factor                 ;; scalar used to adjust the speed of the all the bugs to make the catching of bugs appropriately difficult for different speed computers   ]   ;;;;;;;;;;;;;;;;;;;;; ;; Setup Procedures ;;;;;;;;;;;;;;;;;;;;;   to setup   clear-all   set total-caught 0   set histogram-interval-size 1   set old-show-initial-bug-vision-cone? 0   set old-vision-cone-distance initial-bug-vision   set reproduce-birds-after-eating 25   set speed-factor 0.05   set max-speed 10   set max-vision 10    ask patches [ set pcolor white ]   ;; white background   create-bugs number-bugs [ set speed initial-bug-speed attach-vision-cone]    ask bugs [     set vision initial-bug-vision     set shape \"bug\"     setxy random-xcor random-ycor   ]    ;; the player breed contains one turtle that is used to represent   ;;  a player of the bugs (a bird)   create-players 1 [     set shape \"bird\"     set color brown     set hidden? true   ]    create-birds number-birds [     set vision initial-bird-vision     set shape \"bird-stationary\"     set color brown     set hidden? false     setxy random 100 random 100     set speed initial-bird-speed     attach-vision-cone   ]    ask vision-cones [set-visualize-vision-cone]   reset-ticks   do-plots end   to attach-vision-cone   let parent-vision vision   hatch 1 [      set breed vision-cones     create-link-from myself [tie]     set shape \"vision cone\"     set color gray      set size parent-vision      set-visualize-vision-cone    ] end   ;;;;;;;;;;;;;;;;;;;;; ;; Runtime Procedures ;;;;;;;;;;;;;;;;;;;;;   to go   check-visualize-vision-cone-change   check-player-caught   check-bird-catch   move-player   move-bugs   move-birds   reproduce-birds    tick   update-variables   do-plots  end   to update-variables   ifelse any? bugs     [set avg-bug-speed mean [speed] of bugs   set avg-bug-vision mean [vision] of bugs ]     [set avg-bug-speed 0]   ifelse any? birds     [set avg-bird-speed mean [speed] of birds    set avg-bird-vision mean [vision] of birds]     [set avg-bird-speed 0] end  to reproduce-birds   let worst-bird nobody   if (total-caught mod  reproduce-birds-after-eating = 0 and total-caught > 0 and any? birds) [     set worst-bird min-one-of birds [eaten]     ask worst-bird [        ask out-link-neighbors [set color red die]        die]     reproduce-one-bird   ] end  to move-bugs   let target-heading 0   let candidate-predators nobody   let predator nobody   let all-predators (turtle-set birds players)   ;; the speed factor is a scaling number used to adjust the amount all the bugs move   ;; for example a speed-factor of 2, scales the speed of all the bugs so they are moving twice as fast   ;; it is a useful slider to change for slower and faster computers, that might have the bugs   ;; as a whole population moving too fast or too slow across the screen   ask bugs [     fd (speed * speed-factor)      ifelse any? all-predators in-cone vision 120 [        set candidate-predators all-predators in-cone vision  120         if bug-flee-strategy = \"any\" and any? candidate-predators          [set predator one-of candidate-predators]        if bug-flee-strategy = \"nearest\" and any? candidate-predators          [set predator min-one-of candidate-predators [distance myself]]         set target-heading 180 + towards predator         set heading target-heading        set label-color black        set label \"!\"     ]     [wiggle set label \"\"]    ] end  to move-birds   let prey-agent nobody   let candidate-bugs nobody   let closest-bug nobody   let assigned-target? false   ;; the speed factor is a scaling number used to adjust the amount all the bugs move   ;; for example a speed-factor of 2, scales the speed of all the bugs so they are moving twice as fast   ;; it is a useful slider to change for slower and faster computers, that might have the bugs   ;; as a whole population moving too fast or too slow across the screen   ask birds [     set candidate-bugs bugs in-cone initial-bird-vision  120      ifelse any? candidate-bugs [       set closest-bug min-one-of  candidate-bugs [distance myself]       if (target = nobody and bug-pursuit-strategy = \"lock on one\") [         set prey-agent closest-bug         set target prey-agent         set heading towards prey-agent         set label-color red - 2         set label \"!\"         set assigned-target? true       ]        if (bug-pursuit-strategy = \"closest\" and target != closest-bug) [         set prey-agent closest-bug         set target prey-agent                 set heading towards prey-agent         set label-color red - 2         set label \"!\"         set assigned-target? true       ]        if (assigned-target? != false) [         set target nobody         set label \"\"         wiggle       ]     ]     [       set target nobody       set label \"\"       wiggle     ]     fd (speed * speed-factor)   ]  end  to wiggle   if wiggle? [     right (random-float 30 * .05 / speed-factor)     left (random-float 30 * .05 / speed-factor)   ] end  to move-player   ifelse (mouse-inside?)     [ ask players [ setxy mouse-xcor mouse-ycor set hidden? false] ]     [ ask players [ set hidden? true]] end  to check-player-caught   let speed-of-caught 0   let local-bugs 0   ;; the mouse may move while we are doing calculations   ;; so keep track of the current mouse position so   ;; we do all the calculations with the same numbers   let snap-mouse-xcor mouse-xcor   let snap-mouse-ycor mouse-ycor   if mouse-down? and mouse-inside? [     set local-bugs bugs-on patch snap-mouse-xcor snap-mouse-ycor     if (any? local-bugs) [       set total-caught (total-caught + 1)       ;; eat only one of the bugs at the mouse location       ask one-of local-bugs  [         set speed-of-caught speed         if (speed-of-caught = 1) [ set total-speed-6-caught (total-speed-6-caught + 1) ]         if (speed-of-caught = 2) [ set total-speed-5-caught (total-speed-5-caught + 1) ]         if (speed-of-caught = 3) [ set total-speed-4-caught (total-speed-4-caught + 1) ]         if (speed-of-caught = 4) [ set total-speed-3-caught (total-speed-3-caught + 1) ]         if (speed-of-caught = 5) [ set total-speed-2-caught (total-speed-2-caught + 1) ]         if (speed-of-caught = 6) [ set total-speed-1-caught (total-speed-1-caught + 1) ]         ask out-link-neighbors [set color red die]         die       ]       reproduce-one-bug  ;; replace the eaten bug with a random offspring from the remaining population     ]   ] end   to check-bird-catch   let speed-of-caught 0   ask birds [    if (any? bugs-here) [       set total-caught (total-caught + 1)       set eaten (eaten + 1)       ;; eat only one of the bugs at the mouse location       ask one-of bugs-here [         set speed-of-caught speed         if (speed-of-caught = 1) [ set total-speed-6-caught (total-speed-6-caught + 1) ]         if (speed-of-caught = 2) [ set total-speed-5-caught (total-speed-5-caught + 1) ]         if (speed-of-caught = 3) [ set total-speed-4-caught (total-speed-4-caught + 1) ]         if (speed-of-caught = 4) [ set total-speed-3-caught (total-speed-3-caught + 1) ]         if (speed-of-caught = 5) [ set total-speed-2-caught (total-speed-2-caught + 1) ]         if (speed-of-caught = 6) [ set total-speed-1-caught (total-speed-1-caught + 1) ]          ask out-link-neighbors [set color red die]         die        ]       set target nobody       reproduce-one-bug  ;; replace the eaten bug with a random offspring from the remaining population     ]   ] end  ;; reproduce one identical offspring from one ;; of the bugs remaining in the population to reproduce-one-bug   ask one-of bugs [     hatch 1 [     mutate-offspring-bug     set heading (random-float 360)      attach-vision-cone     ]   ] end  to reproduce-one-bird   let bird-energy-split 0   if count birds > 0 [ask one-of birds [     set bird-energy-split (eaten / 2)     set eaten bird-energy-split     hatch 1 [     mutate-offspring-bird     set heading (random-float 360)      attach-vision-cone     ]   ]   ] end  to mutate-offspring-bug   ifelse random 2 = 0     [set vision (vision + random-float bug-vision-mutation)]     [set vision (vision - random-float bug-vision-mutation)]    if vision > max-vision [set vision max-vision]   if vision < 0 [set vision 0]    ifelse random 2 = 0     [set speed (speed + random-float bug-speed-mutation )]     [set speed (speed - random-float bug-speed-mutation )]    if speed > max-speed [set speed max-speed]   if speed < 0 [set speed 0] end   to mutate-offspring-bird   ifelse random 2 = 0     [set vision (vision + random-float bird-vision-mutation )]     [set vision (vision - random-float bird-vision-mutation )]    if vision > max-vision [set vision max-vision]   if vision < 0 [set vision 0]    ifelse random 2 = 0        [set speed (speed + random-float bird-speed-mutation)]        [set speed (speed - random-float bird-speed-mutation)]    if speed > max-speed [set speed max-speed]   if speed < 0 [set speed 0]  end  ;;;;;;;;;;;;;;;;;;;;; ;; Visualization Procedures ;;;;;;;;;;;;;;;;;;;;;     to check-visualize-vision-cone-change   if (old-show-initial-bug-vision-cone? != show-vision-cone?) [     set old-show-initial-bug-vision-cone? show-vision-cone?     ask vision-cones [set-visualize-vision-cone]   ]   if (old-vision-cone-distance != initial-bug-vision) [     set old-vision-cone-distance initial-bug-vision     ask vision-cones [set-visualize-vision-cone]   ] end   to set-visualize-vision-cone   let parent-vision [vision] of one-of in-link-neighbors     ifelse show-vision-cone?       [set hidden? false set size 2 * parent-vision]       [set hidden? true set size 2 * parent-vision]  end    to recolor-shade   ;; turtle procedure to set color of the bugs to various shapes of purple   set color (111 + speed ) end  to recolor-rainbow ;; turtle procedure   if (floor speed = 6) [ set color red ]   if (floor speed = 5) [ set color orange ]   if (floor speed = 4) [ set color (yellow - 1) ]  ;;  darken the yellow a bit for better visibility on white background   if (floor speed = 3) [ set color green ]   if (floor speed = 2) [ set color blue ]   if (floor speed = 1) [ set color violet ]   if (floor speed >= 7) [ set color gray - 2 ]   if (floor speed < 1) [ set color gray + 2 ] end  ;;;;;;;;;;;;;;;;;;;;;; ;; Plotting Procedures ;;;;;;;;;;;;;;;;;;;;;;  to do-plots   if ticks mod 100 = 1   [     set-current-plot \"Avg. Vision vs. Time\"     set-current-plot-pen \"bugs\"      if any? bugs [plotxy ticks avg-bug-vision]     set-current-plot-pen \"birds\"     if any? birds [plotxy ticks avg-bird-vision]      set-current-plot \"Avg. Speed vs. Time\"     set-current-plot-pen \"bugs\"     if any? bugs [plotxy ticks avg-bug-speed]     set-current-plot-pen \"birds\"     if any? birds [plotxy ticks avg-bird-speed]      set-current-plot \"Speed of Bugs\"     plot-histograms-bugs-speed      set-current-plot \"Vision of Bugs\"     plot-histograms-initial-bug-vision      set-current-plot \"Speed of Birds\"     plot-histograms-initial-bird-speed      set-current-plot \"Vision of Birds\"     plot-histograms-initial-bird-vision   ] end  to plot-caught   set-current-plot-pen \"speed=1\"   plotxy ticks total-speed-1-caught   set-current-plot-pen \"speed=2\"   plotxy ticks total-speed-2-caught   set-current-plot-pen \"speed=3\"   plotxy ticks total-speed-3-caught   set-current-plot-pen \"speed=4\"   plotxy ticks total-speed-4-caught   set-current-plot-pen \"speed=5\"   plotxy ticks total-speed-5-caught   set-current-plot-pen \"speed=6\"   plotxy ticks total-speed-6-caught end  to plot-populations    set-current-plot-pen \"speed=1\"   plot (count bugs with [ speed = 1 ])   set-current-plot-pen \"speed=2\"   plot (count bugs with [ speed = 2 ])   set-current-plot-pen \"speed=3\"   plot (count bugs with [ speed = 3 ])   set-current-plot-pen \"speed=4\"   plot (count bugs with [ speed = 4 ])   set-current-plot-pen \"speed=5\"   plot (count bugs with [ speed = 5 ])   set-current-plot-pen \"speed=6\"   plot (count bugs with [ speed = 6 ]) end  to plot-histograms-bugs-speed   ;; creates 6 different histograms of different colors in the same graph   ;; each histogram is color coded to the color mapping for when the   ;; SPEED-COLOR-MAP chooser is set to \"rainbow\" value.     set-histogram-num-bars 10   set-current-plot-pen \"#\"   set-plot-pen-interval histogram-interval-size   histogram [ speed ] of bugs ;;with [speed >= 0 and speed < 1]  end  to plot-histograms-initial-bug-vision   ;; creates 6 different histograms of different colors in the same graph   ;; each histogram is color coded to the color mapping for when the   ;; SPEED-COLOR-MAP chooser is set to \"rainbow\" value.    set-histogram-num-bars 10   set-current-plot-pen \"#\"   set-plot-pen-interval (histogram-interval-size )   histogram [ vision ] of bugs  end   to plot-histograms-initial-bird-speed   ;; creates 6 different histograms of different colors in the same graph   ;; each histogram is color coded to the color mapping for when the   ;; SPEED-COLOR-MAP chooser is set to \"rainbow\" value.    set-histogram-num-bars 10   set-current-plot-pen \"#\"   set-plot-pen-interval (histogram-interval-size )   histogram [ speed ] of birds  end  to plot-histograms-initial-bird-vision   ;; creates 6 different histograms of different colors in the same graph   ;; each histogram is color coded to the color mapping for when the   ;; SPEED-COLOR-MAP chooser is set to \"rainbow\" value.    set-histogram-num-bars 10   set-current-plot-pen \"#\"   set-plot-pen-interval (histogram-interval-size )   histogram [ vision ] of birds  end   ; Copyright 2007 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":500,"top":10,"right":940,"bottom":451,"dimensions":{"minPxcor":-13,"maxPxcor":13,"minPycor":-13,"maxPycor":13,"patchSize":16,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-caught\")","source":"total-caught","left":90,"top":52,"right":168,"bottom":97,"display":"total caught","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup\"); if (R === StopInterrupt) { return R; }","source":"setup","left":11,"top":16,"right":87,"bottom":49,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","left":90,"top":16,"right":167,"bottom":49,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"bugs","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"birds","interval":1,"mode":0,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avg. Vision vs. Time","left":10,"top":370,"right":170,"bottom":490,"xAxis":"time","yAxis":"vision","xmin":0,"xmax":1000,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"bugs","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"birds","interval":1,"mode":0,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"#","interval":0.1,"mode":1,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"pen1","interval":0.1,"mode":1,"color":-8630108,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"pen2","interval":0.1,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"pen3","interval":0.1,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"pen4","interval":0.1,"mode":1,"color":-3355648,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"pen5","interval":0.1,"mode":1,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"pen6","interval":0.1,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed of Bugs","left":170,"top":250,"right":330,"bottom":370,"xAxis":"speed","yAxis":"frequency","xmin":0,"xmax":10,"ymin":0,"ymax":50,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"#","interval":0.1,"mode":1,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"pen1","interval":0.1,"mode":1,"color":-8630108,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"pen2","interval":0.1,"mode":1,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"pen3","interval":0.1,"mode":1,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"pen4","interval":0.1,"mode":1,"color":-3355648,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"pen5","interval":0.1,"mode":1,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"pen6","interval":0.1,"mode":1,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"birds","interval":1,"mode":0,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"bugs","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Avg. Speed vs. Time","left":10,"top":250,"right":170,"bottom":370,"xAxis":"time","yAxis":"rate","xmin":0,"xmax":1000,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"birds","interval":1,"mode":0,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"bugs","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"#","interval":1,"mode":1,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"speed=1","interval":1,"mode":0,"color":-8630108,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"speed=2","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"speed=3","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"speed=4","interval":1,"mode":0,"color":-3355648,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"speed=5","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"speed=6","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Speed of Birds","left":330,"top":250,"right":490,"bottom":370,"xAxis":"speed","yAxis":"frequency","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"#","interval":1,"mode":1,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"speed=1","interval":1,"mode":0,"color":-8630108,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"speed=2","interval":1,"mode":0,"color":-13345367,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"speed=3","interval":1,"mode":0,"color":-10899396,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"speed=4","interval":1,"mode":0,"color":-3355648,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"speed=5","interval":1,"mode":0,"color":-955883,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"},{"display":"speed=6","interval":1,"mode":0,"color":-2674135,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed(\"BUGS\"))","source":"(count bugs)","left":11,"top":52,"right":87,"bottom":97,"display":"alive bugs","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"100","compiledStep":"1","variable":"number-bugs","left":30,"top":120,"right":160,"bottom":153,"display":"number-bugs","min":"1","max":"100","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10","compiledStep":"1","variable":"number-birds","left":30,"top":185,"right":160,"bottom":218,"display":"number-birds","min":"0","max":"10","default":10,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10","compiledStep":"1","variable":"initial-bird-speed","left":165,"top":175,"right":325,"bottom":208,"display":"initial-bird-speed","min":"0","max":"10","default":2,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"5","compiledStep":"0.5","variable":"initial-bird-vision","left":165,"top":210,"right":325,"bottom":243,"display":"initial-bird-vision","min":"0","max":"5","default":0,"step":".5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"6","compiledStep":"0.5","variable":"initial-bug-vision","left":165,"top":135,"right":325,"bottom":168,"display":"initial-bug-vision","min":"0","max":"6","default":0,"step":".5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"show-vision-cone?","left":300,"top":15,"right":470,"bottom":48,"display":"show-vision-cone?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"wiggle?","left":184,"top":15,"right":299,"bottom":48,"display":"wiggle?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.1","variable":"bird-vision-mutation","left":330,"top":210,"right":485,"bottom":243,"display":"bird-vision-mutation","min":"0","max":"1","default":0,"step":".1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.1","variable":"bird-speed-mutation","left":330,"top":175,"right":485,"bottom":208,"display":"bird-speed-mutation","min":"0","max":"1","default":1,"step":".1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.5","variable":"bug-vision-mutation","left":330,"top":135,"right":486,"bottom":168,"display":"bug-vision-mutation","min":"0","max":"1","default":0,"step":".5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"#","interval":1,"mode":1,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Vision of Bugs","left":170,"top":370,"right":330,"bottom":490,"xAxis":"vision","yAxis":"frequency","xmin":0,"xmax":10,"ymin":0,"ymax":50,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"#","interval":1,"mode":1,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","display":"#","interval":1,"mode":1,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Vision of Birds","left":330,"top":370,"right":490,"bottom":490,"xAxis":"vision","yAxis":"birds","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":false,"setupCode":"","updateCode":"","pens":[{"display":"#","interval":1,"mode":1,"color":-6459832,"inLegend":true,"setupCode":"","updateCode":"","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"1","compiledStep":"0.1","variable":"bug-speed-mutation","left":330,"top":100,"right":486,"bottom":133,"display":"bug-speed-mutation","min":"0","max":"1","default":1,"step":".1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"bug-pursuit-strategy","left":325,"top":50,"right":470,"bottom":95,"display":"bug-pursuit-strategy","choices":["lock on one","nearest","none"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"bug-flee-strategy","left":181,"top":50,"right":319,"bottom":95,"display":"bug-flee-strategy","choices":["any","nearest","none"],"currentChoice":1,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"10","compiledStep":"1","variable":"initial-bug-speed","left":165,"top":100,"right":325,"bottom":133,"display":"initial-bug-speed","min":"0","max":"10","default":2,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["number-bugs", "number-birds", "initial-bird-speed", "initial-bird-vision", "initial-bug-vision", "show-vision-cone?", "wiggle?", "bird-vision-mutation", "bird-speed-mutation", "bug-vision-mutation", "bug-speed-mutation", "bug-pursuit-strategy", "bug-flee-strategy", "initial-bug-speed", "total-caught", "total-speed-6-caught", "total-speed-5-caught", "total-speed-4-caught", "total-speed-3-caught", "total-speed-2-caught", "total-speed-1-caught", "old-color-map", "histogram-interval-size", "max-vision", "max-speed", "old-show-initial-bug-vision-cone?", "old-vision-cone-distance", "avg-bug-speed", "avg-bird-speed", "avg-bug-vision", "avg-bird-vision", "reproduce-birds-after-eating", "speed-factor"], ["number-bugs", "number-birds", "initial-bird-speed", "initial-bird-vision", "initial-bug-vision", "show-vision-cone?", "wiggle?", "bird-vision-mutation", "bird-speed-mutation", "bug-vision-mutation", "bug-speed-mutation", "bug-pursuit-strategy", "bug-flee-strategy", "initial-bug-speed"], [], -13, 13, -13, 13, 16, true, true, turtleShapes, linkShapes, function(){});
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
ProcedurePrims.defineCommand("setup", 1622, 2623, (function() {
  world.clearAll();
  world.observer.setGlobal("total-caught", 0);
  world.observer.setGlobal("histogram-interval-size", 1);
  world.observer.setGlobal("old-show-initial-bug-vision-cone?", 0);
  world.observer.setGlobal("old-vision-cone-distance", world.observer.getGlobal("initial-bug-vision"));
  world.observer.setGlobal("reproduce-birds-after-eating", 25);
  world.observer.setGlobal("speed-factor", 0.05);
  world.observer.setGlobal("max-speed", 10);
  world.observer.setGlobal("max-vision", 10);
  var R = ProcedurePrims.ask(world.patches(), function() { PrimChecks.patch.setVariable(1907, 1913, "pcolor", 9.9); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(1889, 1892, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(world.observer.getGlobal("number-bugs"), "BUGS"), function() {
    PrimChecks.turtle.setVariable(1976, 1981, "speed", world.observer.getGlobal("initial-bug-speed"));
    var R = ProcedurePrims.callCommand("attach-vision-cone"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(1946, 1957, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("BUGS"), function() {
    PrimChecks.turtle.setVariable(2042, 2048, "vision", world.observer.getGlobal("initial-bug-vision"));
    PrimChecks.turtleOrLink.setVariable(2076, 2081, "shape", "bug");
    PrimChecks.turtle.setXY(2092, 2097, RandomPrims.randomFloatInRange(world.topology.minPxcor, world.topology.maxPxcor), RandomPrims.randomFloatInRange(world.topology.minPycor, world.topology.maxPycor));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2023, 2026, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, "PLAYERS"), function() {
    PrimChecks.turtleOrLink.setVariable(2260, 2265, "shape", "bird");
    PrimChecks.turtleOrLink.setVariable(2281, 2286, "color", 35);
    PrimChecks.turtleOrLink.setVariable(2301, 2308, "hidden?", true);
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2233, 2247, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(world.observer.getGlobal("number-birds"), "BIRDS"), function() {
    PrimChecks.turtle.setVariable(2357, 2363, "vision", world.observer.getGlobal("initial-bird-vision"));
    PrimChecks.turtleOrLink.setVariable(2392, 2397, "shape", "bird-stationary");
    PrimChecks.turtleOrLink.setVariable(2424, 2429, "color", 35);
    PrimChecks.turtleOrLink.setVariable(2444, 2451, "hidden?", false);
    PrimChecks.turtle.setXY(2462, 2467, RandomPrims.randomLong(100), RandomPrims.randomLong(100));
    PrimChecks.turtle.setVariable(2498, 2503, "speed", world.observer.getGlobal("initial-bird-speed"));
    var R = ProcedurePrims.callCommand("attach-vision-cone"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2321, 2333, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("VISION-CONES"), function() {
    var R = ProcedurePrims.callCommand("set-visualize-vision-cone"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2553, 2556, R); return R; }
  world.ticker.reset();
  var R = ProcedurePrims.callCommand("do-plots"); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("attach-vision-cone", 2632, 2863, (function() {
  let parentHvision = PrimChecks.turtle.getVariable(2671, 2677, "vision"); ProcedurePrims.stack().currentContext().registerStringRunVar("PARENT-VISION", parentHvision);
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    PrimChecks.turtleOrLink.setVariable(2699, 2704, "breed", world.turtleManager.turtlesOfBreed("VISION-CONES"));
    var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(SelfManager.myself(), "LINKS"), function() { SelfManager.self().tie(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2722, 2738, R); return R; }
    PrimChecks.turtleOrLink.setVariable(2760, 2765, "shape", "vision cone");
    PrimChecks.turtleOrLink.setVariable(2788, 2793, "color", 5);
    PrimChecks.turtle.setVariable(2808, 2812, "size", parentHvision);
    var R = ProcedurePrims.callCommand("set-visualize-vision-cone"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(2680, 2685, R); return R; }
}))
ProcedurePrims.defineCommand("go", 2940, 3117, (function() {
  var R = ProcedurePrims.callCommand("check-visualize-vision-cone-change"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("check-player-caught"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("check-bird-catch"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("move-player"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("move-bugs"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("move-birds"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("reproduce-birds"); if (R === DeathInterrupt) { return R; }
  world.ticker.tick();
  var R = ProcedurePrims.callCommand("update-variables"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("do-plots"); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("update-variables", 3126, 3417, (function() {
  if (PrimChecks.agentset.any(world.turtleManager.turtlesOfBreed("BUGS"))) {
    world.observer.setGlobal("avg-bug-speed", PrimChecks.list.mean(3185, 3189, PrimChecks.validator.checkArg('MEAN', 3185, 3189, 8, PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("BUGS"), function() { return PrimChecks.turtle.getVariable(3191, 3196, "speed"); }))));
    world.observer.setGlobal("avg-bug-vision", PrimChecks.list.mean(3227, 3231, PrimChecks.validator.checkArg('MEAN', 3227, 3231, 8, PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("BUGS"), function() { return PrimChecks.turtle.getVariable(3233, 3239, "vision"); }))));
  }
  else {
    world.observer.setGlobal("avg-bug-speed", 0);
  }
  if (PrimChecks.agentset.any(world.turtleManager.turtlesOfBreed("BIRDS"))) {
    world.observer.setGlobal("avg-bird-speed", PrimChecks.list.mean(3321, 3325, PrimChecks.validator.checkArg('MEAN', 3321, 3325, 8, PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("BIRDS"), function() { return PrimChecks.turtle.getVariable(3327, 3332, "speed"); }))));
    world.observer.setGlobal("avg-bird-vision", PrimChecks.list.mean(3366, 3370, PrimChecks.validator.checkArg('MEAN', 3366, 3370, 8, PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("BIRDS"), function() { return PrimChecks.turtle.getVariable(3372, 3378, "vision"); }))));
  }
  else {
    world.observer.setGlobal("avg-bird-speed", 0);
  }
}))
ProcedurePrims.defineCommand("reproduce-birds", 3425, 3715, (function() {
  let worstHbird = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("WORST-BIRD", worstHbird);
  if (((Prims.equality(PrimChecks.math.mod(3484, 3487, PrimChecks.validator.checkArg('MOD', 3484, 3487, 1, world.observer.getGlobal("total-caught")), PrimChecks.validator.checkArg('MOD', 3484, 3487, 1, world.observer.getGlobal("reproduce-birds-after-eating"))), 0) && Prims.gt(world.observer.getGlobal("total-caught"), 0)) && PrimChecks.agentset.any(world.turtleManager.turtlesOfBreed("BIRDS")))) {
    worstHbird = PrimChecks.agentset.minOneOf(world.turtleManager.turtlesOfBreed("BIRDS"), function() { return PrimChecks.turtle.getVariable(3598, 3603, "eaten"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("WORST-BIRD", worstHbird);
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 3609, 3612, 1904, worstHbird), function() {
      var R = ProcedurePrims.ask(LinkPrims.outLinkNeighbors("LINKS"), function() {
        PrimChecks.turtleOrLink.setVariable(3661, 3666, "color", 15);
        return SelfManager.self().die();
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3633, 3636, R); return R; }
      return SelfManager.self().die();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(3609, 3612, R); return R; }
    var R = ProcedurePrims.callCommand("reproduce-one-bird"); if (R === DeathInterrupt) { return R; }
  }
}))
ProcedurePrims.defineCommand("move-bugs", 3723, 4807, (function() {
  let targetHheading = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-HEADING", targetHheading);
  let candidateHpredators = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("CANDIDATE-PREDATORS", candidateHpredators);
  let predator = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("PREDATOR", predator);
  let allHpredators = PrimChecks.agentset.turtleSet(3832, 3842, world.turtleManager.turtlesOfBreed("BIRDS"), world.turtleManager.turtlesOfBreed("PLAYERS")); ProcedurePrims.stack().currentContext().registerStringRunVar("ALL-PREDATORS", allHpredators);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("BUGS"), function() {
    SelfManager.self().fd(PrimChecks.math.mult(4243, 4244, PrimChecks.validator.checkArg('*', 4243, 4244, 1, PrimChecks.turtle.getVariable(4237, 4242, "speed")), PrimChecks.validator.checkArg('*', 4243, 4244, 1, world.observer.getGlobal("speed-factor"))));
    if (PrimChecks.agentset.any(SelfManager.self().inCone(allHpredators, PrimChecks.turtle.getVariable(4298, 4304, "vision"), 120))) {
      candidateHpredators = SelfManager.self().inCone(allHpredators, PrimChecks.turtle.getVariable(4364, 4370, "vision"), 120); ProcedurePrims.stack().currentContext().updateStringRunVar("CANDIDATE-PREDATORS", candidateHpredators);
      if ((Prims.equality(world.observer.getGlobal("bug-flee-strategy"), "any") && PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 4417, 4421, 112, candidateHpredators)))) {
        predator = PrimChecks.list.oneOf(4465, 4471, PrimChecks.validator.checkArg('ONE-OF', 4465, 4471, 120, candidateHpredators)); ProcedurePrims.stack().currentContext().updateStringRunVar("PREDATOR", predator);
      }
      if ((Prims.equality(world.observer.getGlobal("bug-flee-strategy"), "nearest") && PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 4537, 4541, 112, candidateHpredators)))) {
        predator = PrimChecks.agentset.minOneOf(PrimChecks.validator.checkArg('MIN-ONE-OF', 4585, 4595, 112, candidateHpredators), function() { return SelfManager.self().distance(SelfManager.myself()); }); ProcedurePrims.stack().currentContext().updateStringRunVar("PREDATOR", predator);
      }
      targetHheading = PrimChecks.math.plus(4666, 4667, 180, PrimChecks.turtle.towards(4668, 4675, PrimChecks.validator.checkArg('TOWARDS', 4668, 4675, 768, predator))); ProcedurePrims.stack().currentContext().updateStringRunVar("TARGET-HEADING", targetHheading);
      PrimChecks.turtle.setVariable(4697, 4704, "heading", targetHheading);
      PrimChecks.turtleOrLink.setVariable(4731, 4742, "label-color", 0);
      PrimChecks.turtleOrLink.setVariable(4760, 4765, "label", "!");
    }
    else {
      var R = ProcedurePrims.callCommand("wiggle"); if (R === DeathInterrupt) { return R; }
      PrimChecks.turtleOrLink.setVariable(4792, 4797, "label", "");
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(4218, 4221, R); return R; }
}))
ProcedurePrims.defineCommand("move-birds", 4815, 6236, (function() {
  let preyHagent = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("PREY-AGENT", preyHagent);
  let candidateHbugs = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("CANDIDATE-BUGS", candidateHbugs);
  let closestHbug = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("CLOSEST-BUG", closestHbug);
  let assignedHtarget_Q = false; ProcedurePrims.stack().currentContext().registerStringRunVar("ASSIGNED-TARGET?", assignedHtarget_Q);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("BIRDS"), function() {
    candidateHbugs = SelfManager.self().inCone(world.turtleManager.turtlesOfBreed("BUGS"), world.observer.getGlobal("initial-bird-vision"), 120); ProcedurePrims.stack().currentContext().updateStringRunVar("CANDIDATE-BUGS", candidateHbugs);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 5377, 5381, 112, candidateHbugs))) {
      closestHbug = PrimChecks.agentset.minOneOf(PrimChecks.validator.checkArg('MIN-ONE-OF', 5421, 5431, 112, candidateHbugs), function() { return SelfManager.self().distance(SelfManager.myself()); }); ProcedurePrims.stack().currentContext().updateStringRunVar("CLOSEST-BUG", closestHbug);
      if ((Prims.equality(PrimChecks.turtle.getVariable(5476, 5482, "target"), Nobody) && Prims.equality(world.observer.getGlobal("bug-pursuit-strategy"), "lock on one"))) {
        preyHagent = closestHbug; ProcedurePrims.stack().currentContext().updateStringRunVar("PREY-AGENT", preyHagent);
        PrimChecks.turtle.setVariable(5583, 5589, "target", preyHagent);
        PrimChecks.turtle.setVariable(5613, 5620, "heading", PrimChecks.turtle.towards(5621, 5628, PrimChecks.validator.checkArg('TOWARDS', 5621, 5628, 768, preyHagent)));
        PrimChecks.turtleOrLink.setVariable(5652, 5663, "label-color", PrimChecks.math.minus(5668, 5669, 15, 2));
        PrimChecks.turtleOrLink.setVariable(5684, 5689, "label", "!");
        assignedHtarget_Q = true; ProcedurePrims.stack().currentContext().updateStringRunVar("ASSIGNED-TARGET?", assignedHtarget_Q);
      }
      if ((Prims.equality(world.observer.getGlobal("bug-pursuit-strategy"), "closest") && !Prims.equality(PrimChecks.turtle.getVariable(5784, 5790, "target"), closestHbug))) {
        preyHagent = closestHbug; ProcedurePrims.stack().currentContext().updateStringRunVar("PREY-AGENT", preyHagent);
        PrimChecks.turtle.setVariable(5856, 5862, "target", preyHagent);
        PrimChecks.turtle.setVariable(5894, 5901, "heading", PrimChecks.turtle.towards(5902, 5909, PrimChecks.validator.checkArg('TOWARDS', 5902, 5909, 768, preyHagent)));
        PrimChecks.turtleOrLink.setVariable(5933, 5944, "label-color", PrimChecks.math.minus(5949, 5950, 15, 2));
        PrimChecks.turtleOrLink.setVariable(5965, 5970, "label", "!");
        assignedHtarget_Q = true; ProcedurePrims.stack().currentContext().updateStringRunVar("ASSIGNED-TARGET?", assignedHtarget_Q);
      }
      if (!Prims.equality(assignedHtarget_Q, false)) {
        PrimChecks.turtle.setVariable(6069, 6075, "target", Nobody);
        PrimChecks.turtleOrLink.setVariable(6095, 6100, "label", "");
        var R = ProcedurePrims.callCommand("wiggle"); if (R === DeathInterrupt) { return R; }
      }
    }
    else {
      PrimChecks.turtle.setVariable(6149, 6155, "target", Nobody);
      PrimChecks.turtleOrLink.setVariable(6173, 6178, "label", "");
      var R = ProcedurePrims.callCommand("wiggle"); if (R === DeathInterrupt) { return R; }
    }
    SelfManager.self().fd(PrimChecks.math.mult(6215, 6216, PrimChecks.validator.checkArg('*', 6215, 6216, 1, PrimChecks.turtle.getVariable(6209, 6214, "speed")), PrimChecks.validator.checkArg('*', 6215, 6216, 1, world.observer.getGlobal("speed-factor"))));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(5292, 5295, R); return R; }
}))
ProcedurePrims.defineCommand("wiggle", 6244, 6367, (function() {
  if (world.observer.getGlobal("wiggle?")) {
    SelfManager.self().right(PrimChecks.math.div(6299, 6300, PrimChecks.math.mult(6293, 6294, PrimChecks.math.randomFloat(30), 0.05), PrimChecks.validator.checkArg('/', 6299, 6300, 1, world.observer.getGlobal("speed-factor"))));
    SelfManager.self().right(-(PrimChecks.math.div(6347, 6348, PrimChecks.math.mult(6341, 6342, PrimChecks.math.randomFloat(30), 0.05), PrimChecks.validator.checkArg('/', 6347, 6348, 1, world.observer.getGlobal("speed-factor")))));
  }
}))
ProcedurePrims.defineCommand("move-player", 6375, 6520, (function() {
  if (MousePrims.isInside()) {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("PLAYERS"), function() {
      PrimChecks.turtle.setXY(6432, 6437, MousePrims.getX(), MousePrims.getY());
      PrimChecks.turtleOrLink.setVariable(6464, 6471, "hidden?", false);
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(6418, 6421, R); return R; }
  }
  else {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("PLAYERS"), function() { PrimChecks.turtleOrLink.setVariable(6505, 6512, "hidden?", true); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(6487, 6490, R); return R; }
  }
}))
ProcedurePrims.defineCommand("check-player-caught", 6528, 7830, (function() {
  let speedHofHcaught = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("SPEED-OF-CAUGHT", speedHofHcaught);
  let localHbugs = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("LOCAL-BUGS", localHbugs);
  let snapHmouseHxcor = MousePrims.getX(); ProcedurePrims.stack().currentContext().registerStringRunVar("SNAP-MOUSE-XCOR", snapHmouseHxcor);
  let snapHmouseHycor = MousePrims.getY(); ProcedurePrims.stack().currentContext().registerStringRunVar("SNAP-MOUSE-YCOR", snapHmouseHycor);
  if ((MousePrims.isDown() && MousePrims.isInside())) {
    localHbugs = PrimChecks.agentset.breedOn("BUGS", PrimChecks.validator.checkArg('BUGS-ON', 6875, 6882, 816, world.getPatchAt(PrimChecks.validator.checkArg('PATCH', 6883, 6888, 1, snapHmouseHxcor), PrimChecks.validator.checkArg('PATCH', 6883, 6888, 1, snapHmouseHycor)))); ProcedurePrims.stack().currentContext().updateStringRunVar("LOCAL-BUGS", localHbugs);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 6929, 6933, 112, localHbugs))) {
      world.observer.setGlobal("total-caught", PrimChecks.math.plus(6985, 6986, PrimChecks.validator.checkArg('+', 6985, 6986, 1, world.observer.getGlobal("total-caught")), 1));
      var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 7052, 7055, 1904, PrimChecks.list.oneOf(7056, 7062, PrimChecks.validator.checkArg('ONE-OF', 7056, 7062, 120, localHbugs))), function() {
        speedHofHcaught = PrimChecks.turtle.getVariable(7105, 7110, "speed"); ProcedurePrims.stack().currentContext().updateStringRunVar("SPEED-OF-CAUGHT", speedHofHcaught);
        if (Prims.equality(speedHofHcaught, 1)) {
          world.observer.setGlobal("total-speed-6-caught", PrimChecks.math.plus(7193, 7194, PrimChecks.validator.checkArg('+', 7193, 7194, 1, world.observer.getGlobal("total-speed-6-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 2)) {
          world.observer.setGlobal("total-speed-5-caught", PrimChecks.math.plus(7282, 7283, PrimChecks.validator.checkArg('+', 7282, 7283, 1, world.observer.getGlobal("total-speed-5-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 3)) {
          world.observer.setGlobal("total-speed-4-caught", PrimChecks.math.plus(7371, 7372, PrimChecks.validator.checkArg('+', 7371, 7372, 1, world.observer.getGlobal("total-speed-4-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 4)) {
          world.observer.setGlobal("total-speed-3-caught", PrimChecks.math.plus(7460, 7461, PrimChecks.validator.checkArg('+', 7460, 7461, 1, world.observer.getGlobal("total-speed-3-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 5)) {
          world.observer.setGlobal("total-speed-2-caught", PrimChecks.math.plus(7549, 7550, PrimChecks.validator.checkArg('+', 7549, 7550, 1, world.observer.getGlobal("total-speed-2-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 6)) {
          world.observer.setGlobal("total-speed-1-caught", PrimChecks.math.plus(7638, 7639, PrimChecks.validator.checkArg('+', 7638, 7639, 1, world.observer.getGlobal("total-speed-1-caught")), 1));
        }
        var R = ProcedurePrims.ask(LinkPrims.outLinkNeighbors("LINKS"), function() {
          PrimChecks.turtleOrLink.setVariable(7681, 7686, "color", 15);
          return SelfManager.self().die();
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(7653, 7656, R); return R; }
        return SelfManager.self().die();
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(7052, 7055, R); return R; }
      var R = ProcedurePrims.callCommand("reproduce-one-bug"); if (R === DeathInterrupt) { return R; }
    }
  }
}))
ProcedurePrims.defineCommand("check-bird-catch", 7839, 8853, (function() {
  let speedHofHcaught = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("SPEED-OF-CAUGHT", speedHofHcaught);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("BIRDS"), function() {
    if (PrimChecks.agentset.any(SelfManager.self().breedHere("BUGS"))) {
      world.observer.setGlobal("total-caught", PrimChecks.math.plus(7956, 7957, PrimChecks.validator.checkArg('+', 7956, 7957, 1, world.observer.getGlobal("total-caught")), 1));
      PrimChecks.turtle.setVariable(7971, 7976, "eaten", PrimChecks.math.plus(7984, 7985, PrimChecks.validator.checkArg('+', 7984, 7985, 1, PrimChecks.turtle.getVariable(7978, 7983, "eaten")), 1));
      var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 8051, 8054, 1904, PrimChecks.list.oneOf(8055, 8061, SelfManager.self().breedHere("BUGS"))), function() {
        speedHofHcaught = PrimChecks.turtle.getVariable(8102, 8107, "speed"); ProcedurePrims.stack().currentContext().updateStringRunVar("SPEED-OF-CAUGHT", speedHofHcaught);
        if (Prims.equality(speedHofHcaught, 1)) {
          world.observer.setGlobal("total-speed-6-caught", PrimChecks.math.plus(8190, 8191, PrimChecks.validator.checkArg('+', 8190, 8191, 1, world.observer.getGlobal("total-speed-6-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 2)) {
          world.observer.setGlobal("total-speed-5-caught", PrimChecks.math.plus(8279, 8280, PrimChecks.validator.checkArg('+', 8279, 8280, 1, world.observer.getGlobal("total-speed-5-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 3)) {
          world.observer.setGlobal("total-speed-4-caught", PrimChecks.math.plus(8368, 8369, PrimChecks.validator.checkArg('+', 8368, 8369, 1, world.observer.getGlobal("total-speed-4-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 4)) {
          world.observer.setGlobal("total-speed-3-caught", PrimChecks.math.plus(8457, 8458, PrimChecks.validator.checkArg('+', 8457, 8458, 1, world.observer.getGlobal("total-speed-3-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 5)) {
          world.observer.setGlobal("total-speed-2-caught", PrimChecks.math.plus(8546, 8547, PrimChecks.validator.checkArg('+', 8546, 8547, 1, world.observer.getGlobal("total-speed-2-caught")), 1));
        }
        if (Prims.equality(speedHofHcaught, 6)) {
          world.observer.setGlobal("total-speed-1-caught", PrimChecks.math.plus(8635, 8636, PrimChecks.validator.checkArg('+', 8635, 8636, 1, world.observer.getGlobal("total-speed-1-caught")), 1));
        }
        var R = ProcedurePrims.ask(LinkPrims.outLinkNeighbors("LINKS"), function() {
          PrimChecks.turtleOrLink.setVariable(8679, 8684, "color", 15);
          return SelfManager.self().die();
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8651, 8654, R); return R; }
        return SelfManager.self().die();
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8051, 8054, R); return R; }
      PrimChecks.turtle.setVariable(8725, 8731, "target", Nobody);
      var R = ProcedurePrims.callCommand("reproduce-one-bug"); if (R === DeathInterrupt) { return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(7882, 7885, R); return R; }
}))
ProcedurePrims.defineCommand("reproduce-one-bug", 8950, 9096, (function() {
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 8970, 8973, 1904, PrimChecks.list.oneOf(8974, 8980, world.turtleManager.turtlesOfBreed("BUGS"))), function() {
    var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
      var R = ProcedurePrims.callCommand("mutate-offspring-bug"); if (R === DeathInterrupt) { return R; }
      PrimChecks.turtle.setVariable(9035, 9042, "heading", PrimChecks.math.randomFloat(360));
      var R = ProcedurePrims.callCommand("attach-vision-cone"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8992, 8997, R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8970, 8973, R); return R; }
}))
ProcedurePrims.defineCommand("reproduce-one-bird", 9104, 9373, (function() {
  let birdHenergyHsplit = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("BIRD-ENERGY-SPLIT", birdHenergyHsplit);
  if (PrimChecks.agentset.optimizeCount(null, null, world.turtleManager.turtlesOfBreed("BIRDS"), 0, (a, b) => a > b)) {
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 9171, 9174, 1904, PrimChecks.list.oneOf(9175, 9181, world.turtleManager.turtlesOfBreed("BIRDS"))), function() {
      birdHenergyHsplit = PrimChecks.math.div(9223, 9224, PrimChecks.validator.checkArg('/', 9223, 9224, 1, PrimChecks.turtle.getVariable(9217, 9222, "eaten")), 2); ProcedurePrims.stack().currentContext().updateStringRunVar("BIRD-ENERGY-SPLIT", birdHenergyHsplit);
      PrimChecks.turtle.setVariable(9236, 9241, "eaten", birdHenergyHsplit);
      var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
        var R = ProcedurePrims.callCommand("mutate-offspring-bird"); if (R === DeathInterrupt) { return R; }
        PrimChecks.turtle.setVariable(9308, 9315, "heading", PrimChecks.math.randomFloat(360));
        var R = ProcedurePrims.callCommand("attach-vision-cone"); if (R === DeathInterrupt) { return R; }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(9264, 9269, R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(9171, 9174, R); return R; }
  }
}))
ProcedurePrims.defineCommand("mutate-offspring-bug", 9381, 9843, (function() {
  if (Prims.equality(RandomPrims.randomLong(2), 0)) {
    PrimChecks.turtle.setVariable(9433, 9439, "vision", PrimChecks.math.plus(9448, 9449, PrimChecks.validator.checkArg('+', 9448, 9449, 1, PrimChecks.turtle.getVariable(9441, 9447, "vision")), PrimChecks.math.randomFloat(PrimChecks.validator.checkArg('RANDOM-FLOAT', 9450, 9462, 1, world.observer.getGlobal("bug-vision-mutation")))));
  }
  else {
    PrimChecks.turtle.setVariable(9494, 9500, "vision", PrimChecks.math.minus(9509, 9510, PrimChecks.validator.checkArg('-', 9509, 9510, 1, PrimChecks.turtle.getVariable(9502, 9508, "vision")), PrimChecks.math.randomFloat(PrimChecks.validator.checkArg('RANDOM-FLOAT', 9511, 9523, 1, world.observer.getGlobal("bug-vision-mutation")))));
  }
  if (Prims.gt(PrimChecks.turtle.getVariable(9552, 9558, "vision"), world.observer.getGlobal("max-vision"))) {
    PrimChecks.turtle.setVariable(9577, 9583, "vision", world.observer.getGlobal("max-vision"));
  }
  if (Prims.lt(PrimChecks.turtle.getVariable(9601, 9607, "vision"), 0)) {
    PrimChecks.turtle.setVariable(9617, 9623, "vision", 0);
  }
  if (Prims.equality(RandomPrims.randomLong(2), 0)) {
    PrimChecks.turtle.setVariable(9659, 9664, "speed", PrimChecks.math.plus(9672, 9673, PrimChecks.validator.checkArg('+', 9672, 9673, 1, PrimChecks.turtle.getVariable(9666, 9671, "speed")), PrimChecks.math.randomFloat(PrimChecks.validator.checkArg('RANDOM-FLOAT', 9674, 9686, 1, world.observer.getGlobal("bug-speed-mutation")))));
  }
  else {
    PrimChecks.turtle.setVariable(9718, 9723, "speed", PrimChecks.math.minus(9731, 9732, PrimChecks.validator.checkArg('-', 9731, 9732, 1, PrimChecks.turtle.getVariable(9725, 9730, "speed")), PrimChecks.math.randomFloat(PrimChecks.validator.checkArg('RANDOM-FLOAT', 9733, 9745, 1, world.observer.getGlobal("bug-speed-mutation")))));
  }
  if (Prims.gt(PrimChecks.turtle.getVariable(9774, 9779, "speed"), world.observer.getGlobal("max-speed"))) {
    PrimChecks.turtle.setVariable(9797, 9802, "speed", world.observer.getGlobal("max-speed"));
  }
  if (Prims.lt(PrimChecks.turtle.getVariable(9819, 9824, "speed"), 0)) {
    PrimChecks.turtle.setVariable(9834, 9839, "speed", 0);
  }
}))
ProcedurePrims.defineCommand("mutate-offspring-bird", 9852, 10326, (function() {
  if (Prims.equality(RandomPrims.randomLong(2), 0)) {
    PrimChecks.turtle.setVariable(9905, 9911, "vision", PrimChecks.math.plus(9920, 9921, PrimChecks.validator.checkArg('+', 9920, 9921, 1, PrimChecks.turtle.getVariable(9913, 9919, "vision")), PrimChecks.math.randomFloat(PrimChecks.validator.checkArg('RANDOM-FLOAT', 9922, 9934, 1, world.observer.getGlobal("bird-vision-mutation")))));
  }
  else {
    PrimChecks.turtle.setVariable(9968, 9974, "vision", PrimChecks.math.minus(9983, 9984, PrimChecks.validator.checkArg('-', 9983, 9984, 1, PrimChecks.turtle.getVariable(9976, 9982, "vision")), PrimChecks.math.randomFloat(PrimChecks.validator.checkArg('RANDOM-FLOAT', 9985, 9997, 1, world.observer.getGlobal("bird-vision-mutation")))));
  }
  if (Prims.gt(PrimChecks.turtle.getVariable(10028, 10034, "vision"), world.observer.getGlobal("max-vision"))) {
    PrimChecks.turtle.setVariable(10053, 10059, "vision", world.observer.getGlobal("max-vision"));
  }
  if (Prims.lt(PrimChecks.turtle.getVariable(10077, 10083, "vision"), 0)) {
    PrimChecks.turtle.setVariable(10093, 10099, "vision", 0);
  }
  if (Prims.equality(RandomPrims.randomLong(2), 0)) {
    PrimChecks.turtle.setVariable(10138, 10143, "speed", PrimChecks.math.plus(10151, 10152, PrimChecks.validator.checkArg('+', 10151, 10152, 1, PrimChecks.turtle.getVariable(10145, 10150, "speed")), PrimChecks.math.randomFloat(PrimChecks.validator.checkArg('RANDOM-FLOAT', 10153, 10165, 1, world.observer.getGlobal("bird-speed-mutation")))));
  }
  else {
    PrimChecks.turtle.setVariable(10200, 10205, "speed", PrimChecks.math.minus(10213, 10214, PrimChecks.validator.checkArg('-', 10213, 10214, 1, PrimChecks.turtle.getVariable(10207, 10212, "speed")), PrimChecks.math.randomFloat(PrimChecks.validator.checkArg('RANDOM-FLOAT', 10215, 10227, 1, world.observer.getGlobal("bird-speed-mutation")))));
  }
  if (Prims.gt(PrimChecks.turtle.getVariable(10256, 10261, "speed"), world.observer.getGlobal("max-speed"))) {
    PrimChecks.turtle.setVariable(10279, 10284, "speed", world.observer.getGlobal("max-speed"));
  }
  if (Prims.lt(PrimChecks.turtle.getVariable(10301, 10306, "speed"), 0)) {
    PrimChecks.turtle.setVariable(10316, 10321, "speed", 0);
  }
}))
ProcedurePrims.defineCommand("check-visualize-vision-cone-change", 10410, 10783, (function() {
  if (!Prims.equality(world.observer.getGlobal("old-show-initial-bug-vision-cone?"), world.observer.getGlobal("show-vision-cone?"))) {
    world.observer.setGlobal("old-show-initial-bug-vision-cone?", world.observer.getGlobal("show-vision-cone?"));
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("VISION-CONES"), function() {
      var R = ProcedurePrims.callCommand("set-visualize-vision-cone"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(10573, 10576, R); return R; }
  }
  if (!Prims.equality(world.observer.getGlobal("old-vision-cone-distance"), world.observer.getGlobal("initial-bug-vision"))) {
    world.observer.setGlobal("old-vision-cone-distance", world.observer.getGlobal("initial-bug-vision"));
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("VISION-CONES"), function() {
      var R = ProcedurePrims.callCommand("set-visualize-vision-cone"); if (R === DeathInterrupt) { return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(10734, 10737, R); return R; }
  }
}))
ProcedurePrims.defineCommand("set-visualize-vision-cone", 10792, 11010, (function() {
  let parentHvision = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 10847, 10849, 1904, PrimChecks.list.oneOf(10850, 10856, LinkPrims.inLinkNeighbors("LINKS"))), function() { return PrimChecks.turtle.getVariable(10839, 10845, "vision"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("PARENT-VISION", parentHvision);
  if (world.observer.getGlobal("show-vision-cone?")) {
    PrimChecks.turtleOrLink.setVariable(10915, 10922, "hidden?", false);
    PrimChecks.turtle.setVariable(10933, 10937, "size", PrimChecks.math.mult(10940, 10941, 2, PrimChecks.validator.checkArg('*', 10940, 10941, 1, parentHvision)));
  }
  else {
    PrimChecks.turtleOrLink.setVariable(10968, 10975, "hidden?", true);
    PrimChecks.turtle.setVariable(10985, 10989, "size", PrimChecks.math.mult(10992, 10993, 2, PrimChecks.validator.checkArg('*', 10992, 10993, 1, parentHvision)));
  }
}))
ProcedurePrims.defineCommand("recolor-shade", 11020, 11136, (function() {
  PrimChecks.turtleOrLink.setVariable(11115, 11120, "color", PrimChecks.math.plus(11126, 11127, 111, PrimChecks.validator.checkArg('+', 11126, 11127, 1, PrimChecks.turtle.getVariable(11128, 11133, "speed"))));
}))
ProcedurePrims.defineCommand("recolor-rainbow", 11144, 11608, (function() {
  if (Prims.equality(PrimChecks.math.floor(PrimChecks.validator.checkArg('FLOOR', 11186, 11191, 1, PrimChecks.turtle.getVariable(11192, 11197, "speed"))), 6)) {
    PrimChecks.turtleOrLink.setVariable(11209, 11214, "color", 15);
  }
  if (Prims.equality(PrimChecks.math.floor(PrimChecks.validator.checkArg('FLOOR', 11227, 11232, 1, PrimChecks.turtle.getVariable(11233, 11238, "speed"))), 5)) {
    PrimChecks.turtleOrLink.setVariable(11250, 11255, "color", 25);
  }
  if (Prims.equality(PrimChecks.math.floor(PrimChecks.validator.checkArg('FLOOR', 11271, 11276, 1, PrimChecks.turtle.getVariable(11277, 11282, "speed"))), 4)) {
    PrimChecks.turtleOrLink.setVariable(11294, 11299, "color", PrimChecks.math.minus(11308, 11309, 45, 1));
  }
  if (Prims.equality(PrimChecks.math.floor(PrimChecks.validator.checkArg('FLOOR', 11392, 11397, 1, PrimChecks.turtle.getVariable(11398, 11403, "speed"))), 3)) {
    PrimChecks.turtleOrLink.setVariable(11415, 11420, "color", 55);
  }
  if (Prims.equality(PrimChecks.math.floor(PrimChecks.validator.checkArg('FLOOR', 11435, 11440, 1, PrimChecks.turtle.getVariable(11441, 11446, "speed"))), 2)) {
    PrimChecks.turtleOrLink.setVariable(11458, 11463, "color", 105);
  }
  if (Prims.equality(PrimChecks.math.floor(PrimChecks.validator.checkArg('FLOOR', 11477, 11482, 1, PrimChecks.turtle.getVariable(11483, 11488, "speed"))), 1)) {
    PrimChecks.turtleOrLink.setVariable(11500, 11505, "color", 115);
  }
  if (Prims.gte(PrimChecks.math.floor(PrimChecks.validator.checkArg('FLOOR', 11521, 11526, 1, PrimChecks.turtle.getVariable(11527, 11532, "speed"))), 7)) {
    PrimChecks.turtleOrLink.setVariable(11545, 11550, "color", PrimChecks.math.minus(11556, 11557, 5, 2));
  }
  if (Prims.lt(PrimChecks.math.floor(PrimChecks.validator.checkArg('FLOOR', 11568, 11573, 1, PrimChecks.turtle.getVariable(11574, 11579, "speed"))), 1)) {
    PrimChecks.turtleOrLink.setVariable(11591, 11596, "color", PrimChecks.math.plus(11602, 11603, 5, 2));
  }
}))
ProcedurePrims.defineCommand("do-plots", 11686, 12440, (function() {
  if (Prims.equality(PrimChecks.math.mod(11706, 11709, world.ticker.tickCount(), 100), 1)) {
    plotManager.setCurrentPlot("Avg. Vision vs. Time");
    plotManager.setCurrentPen("bugs");
    if (PrimChecks.agentset.any(world.turtleManager.turtlesOfBreed("BUGS"))) {
      plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("avg-bug-vision"));
    }
    plotManager.setCurrentPen("birds");
    if (PrimChecks.agentset.any(world.turtleManager.turtlesOfBreed("BIRDS"))) {
      plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("avg-bird-vision"));
    }
    plotManager.setCurrentPlot("Avg. Speed vs. Time");
    plotManager.setCurrentPen("bugs");
    if (PrimChecks.agentset.any(world.turtleManager.turtlesOfBreed("BUGS"))) {
      plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("avg-bug-speed"));
    }
    plotManager.setCurrentPen("birds");
    if (PrimChecks.agentset.any(world.turtleManager.turtlesOfBreed("BIRDS"))) {
      plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("avg-bird-speed"));
    }
    plotManager.setCurrentPlot("Speed of Bugs");
    var R = ProcedurePrims.callCommand("plot-histograms-bugs-speed"); if (R === DeathInterrupt) { return R; }
    plotManager.setCurrentPlot("Vision of Bugs");
    var R = ProcedurePrims.callCommand("plot-histograms-initial-bug-vision"); if (R === DeathInterrupt) { return R; }
    plotManager.setCurrentPlot("Speed of Birds");
    var R = ProcedurePrims.callCommand("plot-histograms-initial-bird-speed"); if (R === DeathInterrupt) { return R; }
    plotManager.setCurrentPlot("Vision of Birds");
    var R = ProcedurePrims.callCommand("plot-histograms-initial-bird-vision"); if (R === DeathInterrupt) { return R; }
  }
}))
ProcedurePrims.defineCommand("plot-caught", 12448, 12874, (function() {
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
}))
ProcedurePrims.defineCommand("plot-populations", 12882, 13332, (function() {
  plotManager.setCurrentPen("speed=1");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("BUGS"), function() { return Prims.equality(PrimChecks.turtle.getVariable(12959, 12964, "speed"), 1); }));
  plotManager.setCurrentPen("speed=2");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("BUGS"), function() { return Prims.equality(PrimChecks.turtle.getVariable(13031, 13036, "speed"), 2); }));
  plotManager.setCurrentPen("speed=3");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("BUGS"), function() { return Prims.equality(PrimChecks.turtle.getVariable(13103, 13108, "speed"), 3); }));
  plotManager.setCurrentPen("speed=4");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("BUGS"), function() { return Prims.equality(PrimChecks.turtle.getVariable(13175, 13180, "speed"), 4); }));
  plotManager.setCurrentPen("speed=5");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("BUGS"), function() { return Prims.equality(PrimChecks.turtle.getVariable(13247, 13252, "speed"), 5); }));
  plotManager.setCurrentPen("speed=6");
  plotManager.plotValue(PrimChecks.agentset.countWith(null, null, world.turtleManager.turtlesOfBreed("BUGS"), function() { return Prims.equality(PrimChecks.turtle.getVariable(13319, 13324, "speed"), 6); }));
}))
ProcedurePrims.defineCommand("plot-histograms-bugs-speed", 13340, 13736, (function() {
  plotManager.setHistogramBarCount(10);
  plotManager.setCurrentPen("#");
  plotManager.setPenInterval(world.observer.getGlobal("histogram-interval-size"));
  plotManager.drawHistogramFrom(PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("BUGS"), function() { return PrimChecks.turtle.getVariable(13685, 13690, "speed"); }));
}))
ProcedurePrims.defineCommand("plot-histograms-initial-bug-vision", 13744, 14117, (function() {
  plotManager.setHistogramBarCount(10);
  plotManager.setCurrentPen("#");
  plotManager.setPenInterval(world.observer.getGlobal("histogram-interval-size"));
  plotManager.drawHistogramFrom(PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("BUGS"), function() { return PrimChecks.turtle.getVariable(14099, 14105, "vision"); }));
}))
ProcedurePrims.defineCommand("plot-histograms-initial-bird-speed", 14126, 14499, (function() {
  plotManager.setHistogramBarCount(10);
  plotManager.setCurrentPen("#");
  plotManager.setPenInterval(world.observer.getGlobal("histogram-interval-size"));
  plotManager.drawHistogramFrom(PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("BIRDS"), function() { return PrimChecks.turtle.getVariable(14481, 14486, "speed"); }));
}))
ProcedurePrims.defineCommand("plot-histograms-initial-bird-vision", 14507, 14882, (function() {
  plotManager.setHistogramBarCount(10);
  plotManager.setCurrentPen("#");
  plotManager.setPenInterval(world.observer.getGlobal("histogram-interval-size"));
  plotManager.drawHistogramFrom(PrimChecks.agentset.of(world.turtleManager.turtlesOfBreed("BIRDS"), function() { return PrimChecks.turtle.getVariable(14863, 14869, "vision"); }));
}))
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