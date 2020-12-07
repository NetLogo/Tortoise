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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[150,165,165,180,180,195,195,210,210,165,165,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,135,120,120,105,105,90,90,135,135,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"empty":{"name":"empty","editableColorIndex":0,"rotate":false,"elements":[]},"helicase":{"name":"helicase","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":false,"marked":false}]},"helicase-expanded":{"name":"helicase-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":false,"marked":false}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"nucleoside-tri-a":{"name":"nucleoside-tri-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"nucleoside-tri-c":{"name":"nucleoside-tri-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,135,165,165,135,60],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false}]},"nucleoside-tri-g":{"name":"nucleoside-tri-g","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":false}]},"nucleoside-tri-t":{"name":"nucleoside-tri-t","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":false}]},"nucleotide-a":{"name":"nucleotide-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"nucleotide-c":{"name":"nucleotide-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false}]},"nucleotide-g":{"name":"nucleotide-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"nucleotide-t":{"name":"nucleotide-t","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"phosphate":{"name":"phosphate","editableColorIndex":0,"rotate":true,"elements":[{"x":129,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"phosphate-pair":{"name":"phosphate-pair","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":135,"x2":150,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":144,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":99,"y":120,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"polymerase-0":{"name":"polymerase-0","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,60,60,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":0,"xmax":120,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true}]},"polymerase-1":{"name":"polymerase-1","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true}]},"polymerase-2":{"name":"polymerase-2","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"x1":180,"y1":60,"x2":180,"y2":240,"type":"line","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true}]},"polymerase-3":{"name":"polymerase-3","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true}]},"primase":{"name":"primase","editableColorIndex":1,"rotate":true,"elements":[{"xcors":[90,75,90,120,150,150,180,180,225,285,285,270,240,210,195,195,180,150,105,75,60,60],"ycors":[195,240,270,255,270,300,300,270,255,195,180,165,150,165,165,135,90,90,90,120,150,165],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"target":{"name":"target","editableColorIndex":0,"rotate":true,"elements":[{"x":76,"y":76,"diam":146,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":60,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":195,"x2":150,"y2":240,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"topoisomerase":{"name":"topoisomerase","editableColorIndex":0,"rotate":true,"elements":[{"x":45,"y":45,"diam":210,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":129,"diam":44,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"topoisomerase-gears":{"name":"topoisomerase-gears","editableColorIndex":0,"rotate":true,"elements":[{"xmin":135,"ymin":15,"xmax":165,"ymax":60,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":240,"ymin":135,"xmax":285,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":135,"ymin":240,"xmax":165,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":15,"ymin":135,"xmax":60,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[60,105,75,45],"ycors":[255,225,195,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[45,75,105,60],"ycors":[60,105,75,45],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[240,195,225,255],"ycors":[45,75,105,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,225,195,240],"ycors":[240,195,225,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "phosphates", singular: "phosphate", varNames: [] }, { name: "nucleosides", singular: "nucleoside", varNames: ["class", "value", "place"] }, { name: "nucleotides", singular: "nucleotide", varNames: ["class", "value", "place", "unwound?", "unzipped-stage"] }, { name: "polymerases", singular: "polymerase", varNames: ["locked-state"] }, { name: "helicases", singular: "helicase", varNames: [] }, { name: "topoisomerases", singular: "topoisomerase", varNames: ["locked?"] }, { name: "topoisomerases-gears", singular: "topoisomerase-gear", varNames: [] }, { name: "primases", singular: "primase", varNames: [] }, { name: "nucleotide-tags", singular: "nucleotide-tag", varNames: ["value"] }, { name: "enzyme-tags", singular: "enzyme-tag", varNames: [] }, { name: "mouse-cursors", singular: "mouse-cursor", varNames: [] }, { name: "chromosome-builders", singular: "initial-chromosomes-builder", varNames: [] }, { name: "old-stairs", singular: "old-stair", varNames: [], isDirected: false }, { name: "new-stairs", singular: "new-stair", varNames: [], isDirected: false }, { name: "taglines", singular: "tagline", varNames: [], isDirected: false }, { name: "gearlines", singular: "gearline", varNames: [], isDirected: true }, { name: "cursor-drags", singular: "cursor-drag", varNames: [], isDirected: true }, { name: "backbones", singular: "backbone", varNames: [], isDirected: true }])([], [])('                                                        ;;;;;;;;;;;;; small molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [phosphates phosphate]                            ;; the free floating phosphates that are broken off a nucleoside-tri-phosphate when a nucleotide is formed breed [nucleosides nucleoside]                          ;; the free floating nucleoside-tri-phosphates breed [nucleotides nucleotide]                          ;; the pieces that are inside the DNA chain                                                          ;;;;;;;;;;;;enzymes ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [polymerases polymerase]                          ;; for gearing a hydrogen \"old-stair\" bond of free nucleosides to existing nucleotides breed [helicases helicase]                              ;; for unzipping a DNA strand breed [topoisomerases topoisomerase]                    ;; for unwinding a DNA chromosome breed [topoisomerases-gears topoisomerase-gear]         ;; for visualizing a spin in topoisomerases when unwinding a DNA chromosome breed [primases primase]                                ;; for attaching to the first nucleotide on the top strand.                                                         ;;   It marks the location where the topoisomerase must be to unwind                                                          ;;;;;;;;;;;;; label turtles  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [nucleotide-tags nucleotide-tag]                  ;; the turtle tied to the nucleotide that supports a fine tuned placement of the A, G, C, T lettering breed [enzyme-tags enzyme-tag]                          ;; the turtle tied to the helicase and polymerase that supports a fine tuned placement of the label                                                          ;;;;;;;;;;;;; visualization turtles ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [mouse-cursors mouse-cursor]                      ;; follows the cursor location breed [chromosome-builders initial-chromosomes-builder] ;; initial temporary construction turtle                                                          ;;;;;;;;;;;;; links ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; undirected-link-breed [old-stairs old-stair]            ;; links between nucleotide base pairs that made the old stairs of the \"spiral staircase\" in the DNA undirected-link-breed [new-stairs new-stair]            ;; links between nucleotide base pairs that makes the new stairs of the \"spiral staircase\" in the replicated DNA undirected-link-breed [taglines tagline]                ;; links between an agent and where its label agent is. This allows fine tuned placement of visualizing of labels directed-link-breed [gearlines gearline]                ;; links between topoisomerase and its topoisomerases-gears directed-link-breed [cursor-drags cursor-drag]          ;; links the mouse-cursor and any other agent it is dragging with it during a mouse-down? event directed-link-breed [backbones backbone]                ;; links between adjacent nucleotides on the same side of the DNA strand -                                                         ;;   this represents the sugar backbone of the strand it allows the entire strand to be wound or unwound                                                          ;;;;;;;;;;;;;;;;;;;turtle variables ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; nucleosides-own [class value place]                     ;; class is top or bottom and copy or original / value is A, G, C, or T /  place is a # of order in sequence nucleotides-own [                                       ;; nucleotides may be any of 4 unzipped-stages (how far the zipper is undone)   class value   place unwound?   unzipped-stage ] nucleotide-tags-own [value]                             ;; the value for their label when visualized polymerases-own [locked-state]                          ;; locked-state can be four possible values for polymerase for when it is bound to a nucleotide and                                                         ;;   responding to confirmation of whether a matched nucleoside is nearby or not topoisomerases-own [locked?]                            ;; locked? is true/false for when the topoisomerase is on the site of the primase  globals [                                               ;;;;;;;;;;;;;;;;;;;;globals ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   initial-length-dna   mouse-continuous-down?    instruction ;; counter which keeps track of which instruction is being displayed in the output    ;; colors for various agents and states of agents   cursor-detect-color   cursor-drag-color   wound-dna-color   unwound-dna-color   nucleo-tag-color   enzyme-tag-color   nucleoside-color    ;; colors for the four different states the polymerase enzyme can be in   polymerase-color-0   polymerase-color-1   polymerase-color-2   polymerase-color-3    ;; colors for the two different states the helicase enzyme can be in   helicase-color-0   helicase-color-1    ;; colors for the two different states the topoisomerase enzyme can be in   topoisomerase-color-0   topoisomerase-color-1    ;; colors for the two different states the primase enzyme can be in   primase-color-0   primase-color-1    final-time    ;; for keeping track of the total number of mutations   total-deletion-mutations-top-strand   total-substitution-mutations-top-strand   total-correct-duplications-top-strand   total-deletion-mutations-bottom-strand   total-substitution-mutations-bottom-strand   total-correct-duplications-bottom-strand    lock-radius           ;; how far away an enzyme must be from a target interaction (with another molecule )                         ;;   for it to lock those molecules (or itself) into a confirmation state/site   mouse-drag-radius     ;; how far away a molecule must be in order for the mouse-cursor to link to it and the user to be able to drag it (with mouse-down?   molecule-step         ;; how far each molecules moves each tick   wind-angle            ;; angle of winding used for twisting up the DNA    length-of-simulation  ;; number of seconds for this simulation   time-remaining        ;; time-remaining in the simulation   current-instruction   ;; counter for keeping track of which instruction is displayed in output window   using-time-limit      ;; boolean for keeping track of whether this is a timed model run   simulation-started?   ;; boolean for keeping track of whether the simulation started   cell-divided?         ;; boolean for keeping track of whether the end of the simulation was cued   simulation-ended?     ;; boolean for keeping track of whether the end of the simulation ended   cell-message-shown?   ;; boolean for keep track of whether the cell message was shown   timer-message-shown?  ;; boolean for keeping track of whether the timer message was shown  ]  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;setup procedures;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to setup   clear-all    set polymerase-color-0    [150 150 150 150]   set polymerase-color-1    [75  200  75 200]   set polymerase-color-2    [0   255   0 220]   set polymerase-color-3    [255   0   0 220]   set nucleo-tag-color      [255 255 255 200]   set enzyme-tag-color      [255 255 255 200]   set primase-color-0       [255 255 255 150]   set primase-color-1       [255 255 255 200]   set helicase-color-1      [255 255 210 200]   set helicase-color-0      [255 255 210 150]   set topoisomerase-color-0 [210 255 255 150]   set topoisomerase-color-1 [180 255 180 220]   set nucleoside-color      [255 255 255 150]   set wound-dna-color       [255 255 255 150]   set unwound-dna-color     [255 255 255 255]   set cursor-detect-color   [255 255 255 150]   set cursor-drag-color     [255 255 255 200]   set instruction 0   set wind-angle 25   set lock-radius 0.3   set mouse-drag-radius 0.4   set molecule-step 0.025   set final-time 0   set current-instruction 0    set total-deletion-mutations-top-strand \"N/A\"   set total-substitution-mutations-top-strand  \"N/A\"   set total-correct-duplications-top-strand  \"N/A\"   set total-deletion-mutations-bottom-strand  \"N/A\"   set total-substitution-mutations-bottom-strand  \"N/A\"   set total-correct-duplications-bottom-strand  \"N/A\"    set-default-shape chromosome-builders \"empty\"   set-default-shape nucleotide-tags \"empty\"    set mouse-continuous-down? false   set simulation-started? false   set length-of-simulation 0   set using-time-limit false   set cell-divided? false   set simulation-ended? false   set cell-message-shown? false   set timer-message-shown? false   set initial-length-dna dna-strand-length    create-mouse-cursors 1 [set shape \"target\" set color [255 255 255 100] set hidden? true] ;; make turtle for mouse cursor   repeat free-nucleosides [make-a-nucleoside ] ;;make initial nucleosides   make-initial-dna-strip   make-polymerases   make-a-helicase   make-a-topoisomerase   wind-initial-dna-into-bundle   visualize-agents    initialize-length-of-time   show-instruction 1   reset-ticks end  to initialize-length-of-time   set using-time-limit (time-limit != \"none\") ;*** replaces: ifelse time-limit = \"none\"  [set using-time-limit false] [set using-time-limit true]   if time-limit = \"2 minutes\" [set length-of-simulation 120 set time-remaining 120]   if time-limit = \"5 minutes\" [set length-of-simulation 300 set time-remaining 300] end  to make-a-nucleoside   create-nucleosides 1 [     set value random-base-letter     set shape (word \"nucleoside-tri-\" value)     set color nucleoside-color     attach-nucleo-tag 0 0     setxy random-pxcor random-pycor ;*** replaces: setxy random 100 random 100 (see log for explanation)                                     ;*** removed: set heading random 360 (the heading is already random when the turtle is created)   ] end  ;; make two polymerases to make-polymerases   create-polymerases 1 [     set heading random (180 - random 20 + random 20)     setxy (((max-pxcor - min-pxcor) / 2) + 3) (max-pycor - 1)   ]   create-polymerases 1 [     set heading (90 - random 20 + random 20)     setxy (((max-pxcor - min-pxcor) / 2) - 5) (max-pycor - 1)   ]   ask polymerases [     attach-enzyme-tag 150 .85 \"polymerase\"     set locked-state 0     set shape \"polymerase-0\"     set color polymerase-color-0   ] end  to make-a-helicase   create-helicases 1 [     set shape \"helicase\"     set color helicase-color-0     set size 3.2     set heading 90     attach-enzyme-tag 150 .85 \"helicase\"     setxy (((max-pxcor - min-pxcor) / 2)) (max-pycor - 1)   ] end  to make-a-topoisomerase   create-topoisomerases 1 [     set shape \"topoisomerase\"     set locked? false     set color topoisomerase-color-0     set size 1.5     set heading -90 + random-float 10 - random-float 10     hatch 1 [set breed topoisomerases-gears set shape \"topoisomerase-gears\" create-gearline-from myself [set tie-mode \"fixed\" set hidden? true tie]]     attach-enzyme-tag 150 .85 \"topoisomerase\"     setxy (((max-pxcor - min-pxcor) / 2) - 3) (max-pycor - 1)   ] end  ;; primase is attached to the very first nucleotide in the initial DNA strand to make-and-attach-a-primase   hatch 1 [     set breed primases     set shape \"primase\"     set color primase-color-0     set size 1.7     set heading -13     fd 1.1     create-gearline-from myself [set tie-mode \"fixed\" set hidden? true tie]     attach-enzyme-tag 100 0 \"primase\"   ] end  to make-initial-dna-strip   let last-nucleotide-top-strand nobody   let last-nucleotide-bottom-strand nobody   let place-counter 0   let first-base-pair-value \"\"   let is-this-the-first-base? true   create-turtles 1 [set breed chromosome-builders set heading 90 fd 1 ]    ask chromosome-builders [     repeat initial-length-dna [       set place-counter place-counter + 1       hatch 1 [         set breed nucleotides         set value random-base-letter         set first-base-pair-value value         set shape (word \"nucleotide-\" value)         set heading 0         set class \"original-dna-top\"         set unwound? true         set color unwound-dna-color         set place place-counter         set unzipped-stage 0         attach-nucleo-tag 5 0.5         if last-nucleotide-top-strand != nobody [create-backbone-to last-nucleotide-top-strand [set hidden? true tie]]         set last-nucleotide-top-strand self         if is-this-the-first-base? [make-and-attach-a-primase]         set is-this-the-first-base? false          ;; make complementary base side         hatch 1 [     ;*** removed \"if true\", which was probably a left over from some experimentation...           rt 180           set value complementary-base first-base-pair-value  ;; this second base pair value is based on the first base pair value           set shape (word \"nucleotide-\" value)           set class \"original-dna-bottom\"           create-old-stair-with last-nucleotide-top-strand [set hidden? false]           attach-nucleo-tag 175 0.7           if last-nucleotide-bottom-strand != nobody [create-backbone-to last-nucleotide-bottom-strand [set hidden? true tie]]           set last-nucleotide-bottom-strand self         ]       ]       fd .45     ]     die ;; remove the chromosome builder (a temporary construction turtle)   ] end  ;; fine tuned placement of the location of a label for a nucleoside or nucleotide to attach-nucleo-tag [direction displacement]   hatch 1 [     set heading direction     fd displacement     set breed nucleotide-tags     set label value     set size 0.1     set color nucleo-tag-color     create-tagline-with myself [set tie-mode \"fixed\" set hidden? true tie]   ] end  ;; fine tuned placement of the location of a label for any enzyme to attach-enzyme-tag [direction displacement label-value]   hatch 1 [     set heading direction     fd displacement     set breed enzyme-tags     set shape \"empty\"     set label label-value     set color enzyme-tag-color     set size 0.1     create-tagline-with myself [set tie-mode \"fixed\" set hidden? true tie]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;; runtime procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to go   ;; run if the timer is being used and time remains, or if the timer is not being used and the cell division has not been cued by the user   if ((using-time-limit and time-remaining > 0) or (not using-time-limit and not cell-divided?)) [     check-timer     move-free-molecules     clean-up-free-phosphates     refill-or-remove-nucleosides     unzip-nucleotides     detect-mouse-selection-event     lock-polymerase-to-one-nucleotide     lock-topoisomerase-to-wound-primase     if all-base-pairs-unwound? [separate-base-pairs] ;; only check base pair separation once all base pairs are unwound     visualize-agents     tick   ]   if (cell-divided? and not cell-message-shown?) [     if final-time = 0 [ set final-time timer ]  ;; record final time     calculate-mutations     user-message (word \"You have cued the cell division.  Let\'s see how you did in replicating \"       \"an exact copy of the DNA.\")     user-message user-message-string-for-mutations     set cell-message-shown? true   ]   if ((using-time-limit and time-remaining <= 0) and not timer-message-shown?) [     if final-time = 0 [ set final-time length-of-simulation ]  ;; record final time     calculate-mutations     user-message (word \"The timer has expired.  Let\'s see how you did in replicating \"       \"an exact copy of it.\")     user-message  user-message-string-for-mutations     set timer-message-shown? true   ] end  to check-timer   if not simulation-started? [     set simulation-started? true     reset-timer   ]   if using-time-limit [set time-remaining (length-of-simulation - timer)] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;; visualization procedures ;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to visualize-agents   ask enzyme-tags      [ set hidden? not enzyme-labels?]   ask nucleotide-tags  [ set hidden? not nucleo-labels?]   ask topoisomerases [     ;; spin at different speeds depending if you are locked into the primase location     ifelse locked?       [ask topoisomerases-gears [lt 10 set color topoisomerase-color-1]]       [ask topoisomerases-gears [lt 3  set color topoisomerase-color-0]]   ]   ask polymerases [     if locked-state = 0 [set shape \"polymerase-0\" set color polymerase-color-0]   ;; free floating polymerases not locked into a nucleotide     if locked-state = 1 [set shape \"polymerase-1\" set color polymerase-color-1]   ;; polymerase ready to lock onto nearest open nucleotide (or locked on)     if locked-state = 2 [set shape \"polymerase-2\" set color polymerase-color-2]   ;; polymerase ready to gear two nucleotides together     if locked-state = 3 [set shape \"polymerase-3\" set color polymerase-color-3]   ;; polymerase will reject the nucleoside you are trying to the nucleotide   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; winding and unwinding chromosome procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to wind-initial-dna-into-bundle   repeat (initial-length-dna ) [ wind-dna ] end  to unwind-dna   let wound-nucleotides nucleotides with [not unwound?]   if any? wound-nucleotides [     let max-wound-place max [place] of wound-nucleotides     ask wound-nucleotides with [place = max-wound-place] [       lt wind-angle  ;; left turn unwinds, right turn winds       set unwound? true       set color unwound-dna-color       display     ]   ] end  to wind-dna   let unwound-nucleotides nucleotides with [unwound? and class != \"copy-of-dna-bottom\" and class != \"copy-of-dna-top\"]   if any? unwound-nucleotides [     let min-unwound-place min [place] of unwound-nucleotides     ask unwound-nucleotides with [place = min-unwound-place  ] [       rt wind-angle  ;; right turn winds, left turn unwinds       set unwound? false       set color wound-dna-color     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; procedures for zipping & unzipping DNA strand ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to unzip-nucleotides   let were-any-nucleotides-unzipped-further? false    ask nucleotides with [next-nucleotide-unzipped-the-same? and unzipped-stage > 0] [     let fractional-separation (unzipped-stage / 2)  ;; every unzipped stage will increment the fractional separation by 1/2 of a patch width     if unzipped-stage = 3 [ask my-old-stairs [die] ask my-out-backbones [die] ]  ;; break the linking between the nucleotide bases (the stairs of the staircase)     if unzipped-stage = 1 [ask my-out-backbones [untie]]                         ;; break the sugar backbone of the DNA strand     if unzipped-stage > 0 and unzipped-stage < 4 [       set unzipped-stage unzipped-stage + 1       set were-any-nucleotides-unzipped-further? true                            ;; if any nucleotide was unzipped partially this stage       if class = \"original-dna-top\"      [set ycor fractional-separation  ]      ;; move upward       if class = \"original-dna-bottom\"   [set ycor -1 * fractional-separation ]  ;; move downward     ]   ]   ask helicases [     ifelse were-any-nucleotides-unzipped-further? [set shape \"helicase-expanded\" ][set shape \"helicase\" ]  ;; show shape change in this enzyme   ] end  to separate-base-pairs   let lowest-place 0   ask helicases  [     let this-helicase self     let unzipped-nucleotides nucleotides with [unzipped-stage = 0]     if any? unzipped-nucleotides [ set lowest-place min-one-of unzipped-nucleotides [place] ]  ;; any unzipped nucleotides     let available-nucleotides unzipped-nucleotides  with [distance this-helicase < 1  and are-previous-nucleotides-unzipped?]     if any? available-nucleotides [       let lowest-value-nucleotide min-one-of available-nucleotides [place]       ask lowest-value-nucleotide [         let base self         let base-place place         let other-base other nucleotides with [place = base-place]         if any? other-base  [           set unzipped-stage 1           ask other-base [set unzipped-stage 1]         ]       ]     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; procedures for adding and removing nucleosides and free phosphates and moving everything around ;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to move-free-molecules   let all-molecules (turtle-set nucleosides phosphates polymerases helicases topoisomerases)   ask all-molecules [     if not being-dragged-by-cursor? [       ;; only move the molecules that aren\'t being dragged by the users mouse cursor (during mouse-down?)       fd molecule-step     ]   ] end  to clean-up-free-phosphates   ask phosphates [ if pxcor = min-pxcor or pxcor = max-pxcor or pycor = min-pycor or pycor = max-pycor [die]]  ;; get rid of phosphates at the edge of the screen end  to refill-or-remove-nucleosides   if count nucleosides < free-nucleosides [make-a-nucleoside]   if count nucleosides > free-nucleosides [ask one-of nucleosides [ask tagline-neighbors [die] die]]  ;; get rid of label tags too end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; procedures for setting polymerase states, aligning nucleosides to nucleotides & linking them  ;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to lock-polymerase-to-one-nucleotide   let target-xcor 0   let target-ycor 0   let target-class \"\"    ask polymerases  [     let nucleosides-ready-to-gear-to-polymerase nobody     let potential-nucleoside-ready-to-gear-to-polymerase nobody     let target-nucleotide-ready-to-gear-to-polymerase nobody     set nucleosides-ready-to-gear-to-polymerase nucleosides with [distance myself < lock-radius]  ;; find  nucleosides floating nearby     if count nucleosides-ready-to-gear-to-polymerase > 1 [       set potential-nucleoside-ready-to-gear-to-polymerase min-one-of nucleosides-ready-to-gear-to-polymerase [distance myself]     ]     if count nucleosides-ready-to-gear-to-polymerase = 1 [       set potential-nucleoside-ready-to-gear-to-polymerase nucleosides-ready-to-gear-to-polymerase     ]     let nucleotides-ready-to-gear-to-polymerase nucleotides with [       ;; nearby nucleotides (different than nucleosides) that are not stair lined to any other nucleotides       not any? my-old-stairs and not any? my-new-stairs and (class = \"original-dna-bottom\" or class = \"original-dna-top\") and distance myself < lock-radius     ]      if any? nucleotides-ready-to-gear-to-polymerase and all-base-pairs-unwound? and not being-dragged-by-cursor? [       set target-nucleotide-ready-to-gear-to-polymerase min-one-of nucleotides-ready-to-gear-to-polymerase [distance myself]       set target-xcor   [xcor] of target-nucleotide-ready-to-gear-to-polymerase       set target-ycor   [ycor] of target-nucleotide-ready-to-gear-to-polymerase       set target-class [class] of target-nucleotide-ready-to-gear-to-polymerase       setxy target-xcor target-ycor     ]      if not any? nucleotides-ready-to-gear-to-polymerase or any? other polymerases-here [set locked-state 0]   ;; if no open nucleotide are present then no gearing     if any? nucleotides-ready-to-gear-to-polymerase and       all-base-pairs-unwound? and       potential-nucleoside-ready-to-gear-to-polymerase = nobody and       not any? other polymerases-here [       ;; if an open nucleotide is present but no nucleosides       set locked-state 1     ]     if target-nucleotide-ready-to-gear-to-polymerase != nobody and       all-base-pairs-unwound?       and potential-nucleoside-ready-to-gear-to-polymerase != nobody       and not any? other polymerases-here [       set locked-state 2   ;; if an open nucleotide is present and a nucleosides is present        ifelse (         (would-these-nucleotides-pair-correctly? target-nucleotide-ready-to-gear-to-polymerase potential-nucleoside-ready-to-gear-to-polymerase) or         (substitutions?)       ) [         ask potential-nucleoside-ready-to-gear-to-polymerase  [           ask my-in-cursor-drags  [die]           ask tagline-neighbors [die]           set breed nucleotides           set shape (word \"nucleotide-\"  value)           set unwound? true           if target-class = \"original-dna-top\"     [ set heading 180 set class \"copy-of-dna-bottom\" attach-nucleo-tag 175 0.7]           if target-class = \"original-dna-bottom\"  [ set heading 0 set class \"copy-of-dna-top\" attach-nucleo-tag 5 0.5]           setxy target-xcor target-ycor           break-off-phosphates-from-nucleoside           create-new-stair-with target-nucleotide-ready-to-gear-to-polymerase [set hidden? false tie]         ]       ]       [ ;; if an open nucleotide is present, and a nucleoside is present, but it is not the correct nucleosides to pair         set locked-state 3       ]     ]   ] end  to break-off-phosphates-from-nucleoside   hatch 1 [     set breed phosphates     set shape \"phosphate-pair\"     set heading random 360   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; setting locking topoisomerases onto primase ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to lock-topoisomerase-to-wound-primase   let target-xcor 0   let target-ycor 0   let target-class \"\"   let wound-nucleotides  nucleotides with [not unwound?]   ask topoisomerases  [     ifelse any? wound-nucleotides [       let target-primases-ready-to-gear-to-topoisomerase primases  with [distance myself < lock-radius ]       ifelse any? target-primases-ready-to-gear-to-topoisomerase [         let target-primase-ready-to-gear-to-topoisomerase one-of target-primases-ready-to-gear-to-topoisomerase         set locked? true         if not mouse-down? [           unwind-dna           ask my-in-cursor-drags  [die]           set target-xcor   [xcor] of target-primase-ready-to-gear-to-topoisomerase           set target-ycor   [ycor] of target-primase-ready-to-gear-to-topoisomerase           setxy target-xcor target-ycor         ]       ]       [         set locked? false       ]     ]     [       set locked? false     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; statistics ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to calculate-mutations   set total-deletion-mutations-top-strand 0   set total-substitution-mutations-top-strand 0   set total-correct-duplications-top-strand 0   set total-deletion-mutations-bottom-strand 0   set total-substitution-mutations-bottom-strand 0   set total-correct-duplications-bottom-strand 0    let original-nucleotides nucleotides with [class = \"original-dna-top\" ]   ask original-nucleotides [     if not any? my-new-stairs [set total-deletion-mutations-top-strand total-deletion-mutations-top-strand + 1]     if count my-new-stairs >= 1 [       ifelse is-this-nucleotide-paired-correctly?         [set total-correct-duplications-top-strand total-correct-duplications-top-strand + 1]         [set total-substitution-mutations-top-strand total-substitution-mutations-top-strand + 1]     ]   ]    set original-nucleotides nucleotides with [class = \"original-dna-bottom\" ]   ask original-nucleotides [     if not any? my-new-stairs [set total-deletion-mutations-bottom-strand total-deletion-mutations-bottom-strand + 1]     if count my-new-stairs >= 1 [       ifelse is-this-nucleotide-paired-correctly?         [set total-correct-duplications-bottom-strand total-correct-duplications-bottom-strand + 1]         [set total-substitution-mutations-bottom-strand total-substitution-mutations-bottom-strand + 1]     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;mouse cursor detection ;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to detect-mouse-selection-event   let p-mouse-xcor mouse-xcor   let p-mouse-ycor mouse-ycor   let current-mouse-down? mouse-down?   let target-turtle nobody   let current-mouse-inside? mouse-inside?   ask mouse-cursors [     setxy p-mouse-xcor p-mouse-ycor     ;;;;;;  cursor visualization ;;;;;;;;;;;;     set hidden? true     let all-moveable-molecules (turtle-set nucleosides polymerases helicases topoisomerases)     let draggable-molecules all-moveable-molecules with [not being-dragged-by-cursor? and distance myself <= mouse-drag-radius]      ;; when mouse button has not been down and you are hovering over a draggable molecules - then the mouse cursor appears and is rotating     if not current-mouse-down? and mouse-inside? and (any? draggable-molecules) [ set color cursor-detect-color  set hidden? false rt 4 ]     ;; when things are being dragged the mouse cursor is a different color and it is not rotating     if is-this-cursor-dragging-anything? and mouse-inside? [ set color cursor-drag-color set hidden? false]      if not mouse-continuous-down? and current-mouse-down? and not is-this-cursor-dragging-anything? and any? draggable-molecules [       set target-turtle min-one-of draggable-molecules  [distance myself]       ask target-turtle [setxy p-mouse-xcor p-mouse-ycor]       create-cursor-drag-to target-turtle [ set hidden? false tie ]     ] ;; create-link from cursor to one of the target turtles.  These links are called cursor-drags     if (not current-mouse-down? ) [ask my-out-cursor-drags  [die] ] ;; remove all drag links   ]   ifelse current-mouse-down? and mouse-down? [set mouse-continuous-down? true][set mouse-continuous-down? false] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; reporters ;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to-report random-base-letter   let r random 4   let letter-to-report \"\"   if r = 0 [set letter-to-report \"A\"]   if r = 1 [set letter-to-report \"G\"]   if r = 2 [set letter-to-report \"T\"]   if r = 3 [set letter-to-report \"C\"]   report letter-to-report end  to-report complementary-base [base]   let base-to-report \"\"   if base = \"A\" [set base-to-report \"T\"]   if base = \"T\" [set base-to-report \"A\"]   if base = \"G\" [set base-to-report \"C\"]   if base = \"C\" [set base-to-report \"G\"]   report base-to-report end  to-report time-remaining-to-display   ifelse using-time-limit [report time-remaining][report \"\"] end  to-report is-this-cursor-dragging-anything?   ifelse (any? out-cursor-drag-neighbors) [report true][report false] end  to-report being-dragged-by-cursor?   ifelse any? my-in-cursor-drags [report true][report false] end  to-report all-base-pairs-unwound?   ifelse any? nucleotides with [not unwound?] [report false][report true] end  to-report would-these-nucleotides-pair-correctly? [nucleotide-1 nucleotide-2]   ifelse ( (complementary-base [value] of nucleotide-1) = item 0 [value] of nucleotide-2) [report true][report false ] end  to-report is-this-nucleotide-paired-correctly?   let original-nucleotide self   let this-stair one-of my-new-stairs   let this-paired-nucleotide nobody   let overwrite? false   ask this-stair [set this-paired-nucleotide other-end     if this-paired-nucleotide != nobody [       if [class] of this-paired-nucleotide != \"copy-of-dna-bottom\" and [class] of this-paired-nucleotide  != \"copy-of-dna-top\" [set overwrite? true];; [set     ]   ]   ifelse (value = (complementary-base [value] of this-paired-nucleotide) and not overwrite?) [report true] [report false ] end  to-report next-nucleotide-unzipped-the-same?   let my-unzipped-stage unzipped-stage   let my-place place   let my-class class   let next-nucleotides-available nucleotides with [class = my-class and place = (my-place + 1) and unzipped-stage = my-unzipped-stage]   let can-continue-to-unzip? false   ifelse my-place < dna-strand-length [     ifelse any? next-nucleotides-available and are-previous-nucleotides-unzipped?;;; is another nucleotides in the next sequence in the strand     [set can-continue-to-unzip? true] [set can-continue-to-unzip? false]   ]   [set can-continue-to-unzip? true]  ;; there is no other nucleotides in the next sequence in the strand so no nucleotides will prevent the zipper from opening   report can-continue-to-unzip? end   to-report are-previous-nucleotides-unzipped?   let my-place place   let previous-nucleotides nucleotides with [place = (my-place - 1)]   let value-to-return false   ifelse not any? previous-nucleotides   [set value-to-return true]   [     let previous-nucleotides-are-unzipped previous-nucleotides  with [unzipped-stage > 0]     ifelse any? previous-nucleotides-are-unzipped [set value-to-return true] [set value-to-return false]   ]   report value-to-return end  to-report user-message-string-for-mutations   let duplication-rate  precision ( (total-correct-duplications-top-strand + total-correct-duplications-bottom-strand)  / final-time) 4   report (word \"You had \" (total-correct-duplications-top-strand + total-correct-duplications-bottom-strand)     \" correct replications and \" (total-substitution-mutations-top-strand + total-substitution-mutations-bottom-strand)     \" substitutions and \"  (total-deletion-mutations-top-strand + total-deletion-mutations-bottom-strand)  \"  deletions.\"     \" That replication process took you \" final-time \" seconds.  This was a rate of \" duplication-rate     \" correct nucleotides duplicated per second.\" ) end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;; instructions for players ;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to-report current-instruction-label   report ifelse-value current-instruction = 0     [ \"press setup\" ]     [ (word current-instruction \" / \" length instructions) ] end  to next-instruction   show-instruction current-instruction + 1 end  to previous-instruction   show-instruction current-instruction - 1 end  to show-instruction [ i ]   if i >= 1 and i <= length instructions [     set current-instruction i     clear-output     foreach item (current-instruction - 1) instructions output-print   ] end  to-report instructions   report [     [       \"You will be simulating the process\"       \"of DNA replication that occurs in\"       \"every cell in every living creature\"       \"as part of mitosis or meiosis.\"     ]     [       \"To do this you will need to complete\"       \"4 tasks in the shortest time you\"       \"can. Each of these tasks requires\"       \"you to drag a molecule using your\"       \"mouse, from one location to another.\"     ]     [       \"The 1st task will be to unwind a \"       \"twisted bundle of DNA by using your\"       \"mouse to place a topoisomerase \"       \"enzyme on top of the primase enzyme.\"     ]     [       \"The 2nd task will be to unzip the\"       \"DNA ladder structure by dragging\"       \"a helicase enzyme from the 1st \"       \"base pair to the last base pair.\"     ]     [       \"The 3rd task will be to first drag\"       \"a polymerase enzyme to an open\"       \"nucleotide and then drag a floating\"       \"nucleoside to the same location.\"     ]     [       \"The last task is to simply repeat\"       \"the previous task of connecting\"       \"nucleosides to open nucleotides\" ;       \"until as much of the DNA as\"       \"possible has been replicated.\"     ]     [       \"The simulation ends either when\"       \"the timer runs out (if the timer?\"       \"chooser is set to YES) or when you\"       \"press the DIVIDE THE CELL button\"     ]   ] end   ; Copyright 2012 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":330,"top":10,"right":1188,"bottom":519,"dimensions":{"minPxcor":0,"maxPxcor":16,"minPycor":-5,"maxPycor":4,"patchSize":50,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":14,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":4,"top":10,"right":74,"bottom":44,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"30","compiledStep":"1","variable":"dna-strand-length","left":4,"top":46,"right":152,"bottom":79,"display":"dna-strand-length","min":"1","max":"30","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"nucleo-labels?","left":5,"top":116,"right":151,"bottom":149,"display":"nucleo-labels?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":75,"top":10,"right":152,"bottom":43,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"enzyme-labels?","left":5,"top":81,"right":151,"bottom":114,"display":"enzyme-labels?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-deletion-mutations-top-strand\")","source":"total-deletion-mutations-top-strand","left":15,"top":255,"right":147,"bottom":300,"display":"# deletions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-substitution-mutations-top-strand\")","source":"total-substitution-mutations-top-strand","left":15,"top":298,"right":146,"bottom":343,"display":"# substitutions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Top Strand","left":38,"top":192,"right":147,"bottom":210,"fontSize":13,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-correct-duplications-top-strand\")","source":"total-correct-duplications-top-strand","left":15,"top":211,"right":147,"bottom":256,"display":"# correct duplications","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"substitutions?","left":170,"top":10,"right":305,"bottom":43,"display":"substitutions?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"1","variable":"free-nucleosides","left":171,"top":47,"right":305,"bottom":80,"display":"free-nucleosides","min":"0","max":"200","default":50,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-correct-duplications-bottom-strand\")","source":"total-correct-duplications-bottom-strand","left":170,"top":210,"right":305,"bottom":255,"display":"# correct duplications","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-deletion-mutations-bottom-strand\")","source":"total-deletion-mutations-bottom-strand","left":170,"top":254,"right":305,"bottom":299,"display":"# deletions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-substitution-mutations-bottom-strand\")","source":"total-substitution-mutations-bottom-strand","left":170,"top":297,"right":305,"bottom":342,"display":"# substitutions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Bottom Strand","left":192,"top":191,"right":297,"bottom":209,"fontSize":13,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"left":5,"top":345,"right":325,"bottom":492,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"variable":"time-limit","left":169,"top":85,"right":304,"bottom":130,"display":"time-limit","choices":["none","2 minutes","5 minutes"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"TIME-REMAINING-TO-DISPLAY\"]()","source":"time-remaining-to-display","left":169,"top":134,"right":304,"bottom":179,"display":"time remaining","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   world.observer.setGlobal(\"cell-divided?\", true);   world.observer.setGlobal(\"cell-message-shown?\", false); } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"set cell-divided? true set cell-message-shown? false","left":5,"top":150,"right":150,"bottom":184,"display":"divide the cell","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"CURRENT-INSTRUCTION-LABEL\"]()","source":"current-instruction-label","left":130,"top":495,"right":220,"bottom":540,"display":"instruction","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_49 = procedures[\"NEXT-INSTRUCTION\"]();   if (_maybestop_33_49 instanceof Exception.StopInterrupt) { return _maybestop_33_49; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"next-instruction","left":220,"top":495,"right":325,"bottom":540,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_53 = procedures[\"PREVIOUS-INSTRUCTION\"]();   if (_maybestop_33_53 instanceof Exception.StopInterrupt) { return _maybestop_33_53; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"previous-instruction","left":5,"top":495,"right":130,"bottom":540,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit", "initial-length-dna", "mouse-continuous-down?", "instruction", "cursor-detect-color", "cursor-drag-color", "wound-dna-color", "unwound-dna-color", "nucleo-tag-color", "enzyme-tag-color", "nucleoside-color", "polymerase-color-0", "polymerase-color-1", "polymerase-color-2", "polymerase-color-3", "helicase-color-0", "helicase-color-1", "topoisomerase-color-0", "topoisomerase-color-1", "primase-color-0", "primase-color-1", "final-time", "total-deletion-mutations-top-strand", "total-substitution-mutations-top-strand", "total-correct-duplications-top-strand", "total-deletion-mutations-bottom-strand", "total-substitution-mutations-bottom-strand", "total-correct-duplications-bottom-strand", "lock-radius", "mouse-drag-radius", "molecule-step", "wind-angle", "length-of-simulation", "time-remaining", "current-instruction", "using-time-limit", "simulation-started?", "cell-divided?", "simulation-ended?", "cell-message-shown?", "timer-message-shown?"], ["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit"], [], 0, 16, -5, 4, 50, true, true, turtleShapes, linkShapes, function(){});
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
var RandomPrims = workspace.randomPrims;
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
      world.observer.setGlobal("polymerase-color-0", [150, 150, 150, 150]);
      world.observer.setGlobal("polymerase-color-1", [75, 200, 75, 200]);
      world.observer.setGlobal("polymerase-color-2", [0, 255, 0, 220]);
      world.observer.setGlobal("polymerase-color-3", [255, 0, 0, 220]);
      world.observer.setGlobal("nucleo-tag-color", [255, 255, 255, 200]);
      world.observer.setGlobal("enzyme-tag-color", [255, 255, 255, 200]);
      world.observer.setGlobal("primase-color-0", [255, 255, 255, 150]);
      world.observer.setGlobal("primase-color-1", [255, 255, 255, 200]);
      world.observer.setGlobal("helicase-color-1", [255, 255, 210, 200]);
      world.observer.setGlobal("helicase-color-0", [255, 255, 210, 150]);
      world.observer.setGlobal("topoisomerase-color-0", [210, 255, 255, 150]);
      world.observer.setGlobal("topoisomerase-color-1", [180, 255, 180, 220]);
      world.observer.setGlobal("nucleoside-color", [255, 255, 255, 150]);
      world.observer.setGlobal("wound-dna-color", [255, 255, 255, 150]);
      world.observer.setGlobal("unwound-dna-color", [255, 255, 255, 255]);
      world.observer.setGlobal("cursor-detect-color", [255, 255, 255, 150]);
      world.observer.setGlobal("cursor-drag-color", [255, 255, 255, 200]);
      world.observer.setGlobal("instruction", 0);
      world.observer.setGlobal("wind-angle", 25);
      world.observer.setGlobal("lock-radius", 0.3);
      world.observer.setGlobal("mouse-drag-radius", 0.4);
      world.observer.setGlobal("molecule-step", 0.025);
      world.observer.setGlobal("final-time", 0);
      world.observer.setGlobal("current-instruction", 0);
      world.observer.setGlobal("total-deletion-mutations-top-strand", "N/A");
      world.observer.setGlobal("total-substitution-mutations-top-strand", "N/A");
      world.observer.setGlobal("total-correct-duplications-top-strand", "N/A");
      world.observer.setGlobal("total-deletion-mutations-bottom-strand", "N/A");
      world.observer.setGlobal("total-substitution-mutations-bottom-strand", "N/A");
      world.observer.setGlobal("total-correct-duplications-bottom-strand", "N/A");
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS").getSpecialName(), "empty")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("NUCLEOTIDE-TAGS").getSpecialName(), "empty")
      world.observer.setGlobal("mouse-continuous-down?", false);
      world.observer.setGlobal("simulation-started?", false);
      world.observer.setGlobal("length-of-simulation", 0);
      world.observer.setGlobal("using-time-limit", false);
      world.observer.setGlobal("cell-divided?", false);
      world.observer.setGlobal("simulation-ended?", false);
      world.observer.setGlobal("cell-message-shown?", false);
      world.observer.setGlobal("timer-message-shown?", false);
      world.observer.setGlobal("initial-length-dna", world.observer.getGlobal("dna-strand-length"));
      world.turtleManager.createTurtles(1, "MOUSE-CURSORS").ask(function() {
        SelfManager.self().setVariable("shape", "target");
        SelfManager.self().setVariable("color", [255, 255, 255, 100]);
        SelfManager.self().setVariable("hidden?", true);
      }, true);
      for (let _index_8948_8954 = 0, _repeatcount_8948_8954 = StrictMath.floor(world.observer.getGlobal("free-nucleosides")); _index_8948_8954 < _repeatcount_8948_8954; _index_8948_8954++){
        procedures["MAKE-A-NUCLEOSIDE"]();
      }
      procedures["MAKE-INITIAL-DNA-STRIP"]();
      procedures["MAKE-POLYMERASES"]();
      procedures["MAKE-A-HELICASE"]();
      procedures["MAKE-A-TOPOISOMERASE"]();
      procedures["WIND-INITIAL-DNA-INTO-BUNDLE"]();
      procedures["VISUALIZE-AGENTS"]();
      procedures["INITIALIZE-LENGTH-OF-TIME"]();
      procedures["SHOW-INSTRUCTION"](1);
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
      world.observer.setGlobal("using-time-limit", !Prims.equality(world.observer.getGlobal("time-limit"), "none"));
      if (Prims.equality(world.observer.getGlobal("time-limit"), "2 minutes")) {
        world.observer.setGlobal("length-of-simulation", 120);
        world.observer.setGlobal("time-remaining", 120);
      }
      if (Prims.equality(world.observer.getGlobal("time-limit"), "5 minutes")) {
        world.observer.setGlobal("length-of-simulation", 300);
        world.observer.setGlobal("time-remaining", 300);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["initializeLengthOfTime"] = temp;
  procs["INITIALIZE-LENGTH-OF-TIME"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(1, "NUCLEOSIDES").ask(function() {
        SelfManager.self().setVariable("value", procedures["RANDOM-BASE-LETTER"]());
        SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("nucleoside-tri-") + workspace.dump(SelfManager.self().getVariable("value"))));
        SelfManager.self().setVariable("color", world.observer.getGlobal("nucleoside-color"));
        procedures["ATTACH-NUCLEO-TAG"](0,0);
        SelfManager.self().setXY(RandomPrims.randomInRange(world.topology.minPxcor, world.topology.maxPxcor), RandomPrims.randomInRange(world.topology.minPycor, world.topology.maxPycor));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeANucleoside"] = temp;
  procs["MAKE-A-NUCLEOSIDE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(1, "POLYMERASES").ask(function() {
        SelfManager.self().setVariable("heading", PrimChecks.math.random(((180 - RandomPrims.randomLong(20)) + RandomPrims.randomLong(20))));
        SelfManager.self().setXY((PrimChecks.math.div((world.topology.maxPxcor - world.topology.minPxcor), 2) + 3), (world.topology.maxPycor - 1));
      }, true);
      world.turtleManager.createTurtles(1, "POLYMERASES").ask(function() {
        SelfManager.self().setVariable("heading", ((90 - RandomPrims.randomLong(20)) + RandomPrims.randomLong(20)));
        SelfManager.self().setXY((PrimChecks.math.div((world.topology.maxPxcor - world.topology.minPxcor), 2) - 5), (world.topology.maxPycor - 1));
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("POLYMERASES")).ask(function() {
        procedures["ATTACH-ENZYME-TAG"](150,0.85,"polymerase");
        SelfManager.self().setVariable("locked-state", 0);
        SelfManager.self().setVariable("shape", "polymerase-0");
        SelfManager.self().setVariable("color", world.observer.getGlobal("polymerase-color-0"));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makePolymerases"] = temp;
  procs["MAKE-POLYMERASES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(1, "HELICASES").ask(function() {
        SelfManager.self().setVariable("shape", "helicase");
        SelfManager.self().setVariable("color", world.observer.getGlobal("helicase-color-0"));
        SelfManager.self().setVariable("size", 3.2);
        SelfManager.self().setVariable("heading", 90);
        procedures["ATTACH-ENZYME-TAG"](150,0.85,"helicase");
        SelfManager.self().setXY(PrimChecks.math.div((world.topology.maxPxcor - world.topology.minPxcor), 2), (world.topology.maxPycor - 1));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeAHelicase"] = temp;
  procs["MAKE-A-HELICASE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(1, "TOPOISOMERASES").ask(function() {
        SelfManager.self().setVariable("shape", "topoisomerase");
        SelfManager.self().setVariable("locked?", false);
        SelfManager.self().setVariable("color", world.observer.getGlobal("topoisomerase-color-0"));
        SelfManager.self().setVariable("size", 1.5);
        SelfManager.self().setVariable("heading", ((-90 + RandomPrims.randomFloat(10)) - RandomPrims.randomFloat(10)));
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS"));
          SelfManager.self().setVariable("shape", "topoisomerase-gears");
          LinkPrims.createLinkFrom(SelfManager.myself(), "GEARLINES").ask(function() {
            SelfManager.self().setVariable("tie-mode", "fixed");
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().tie();
          }, true);
        }, true);
        procedures["ATTACH-ENZYME-TAG"](150,0.85,"topoisomerase");
        SelfManager.self().setXY((PrimChecks.math.div((world.topology.maxPxcor - world.topology.minPxcor), 2) - 3), (world.topology.maxPycor - 1));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeATopoisomerase"] = temp;
  procs["MAKE-A-TOPOISOMERASE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PRIMASES"));
        SelfManager.self().setVariable("shape", "primase");
        SelfManager.self().setVariable("color", world.observer.getGlobal("primase-color-0"));
        SelfManager.self().setVariable("size", 1.7);
        SelfManager.self().setVariable("heading", -13);
        SelfManager.self().fd(1.1);
        LinkPrims.createLinkFrom(SelfManager.myself(), "GEARLINES").ask(function() {
          SelfManager.self().setVariable("tie-mode", "fixed");
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().tie();
        }, true);
        procedures["ATTACH-ENZYME-TAG"](100,0,"primase");
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeAndAttachAPrimase"] = temp;
  procs["MAKE-AND-ATTACH-A-PRIMASE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let lastNucleotideTopStrand = Nobody; letVars['lastNucleotideTopStrand'] = lastNucleotideTopStrand;
      let lastNucleotideBottomStrand = Nobody; letVars['lastNucleotideBottomStrand'] = lastNucleotideBottomStrand;
      let placeCounter = 0; letVars['placeCounter'] = placeCounter;
      let firstBasePairValue = ""; letVars['firstBasePairValue'] = firstBasePairValue;
      let is_ThisTheFirstBase_p = true; letVars['is_ThisTheFirstBase_p'] = is_ThisTheFirstBase_p;
      world.turtleManager.createTurtles(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS"));
        SelfManager.self().setVariable("heading", 90);
        SelfManager.self()._optimalFdOne();
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS")).ask(function() {
        for (let _index_11870_11876 = 0, _repeatcount_11870_11876 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_11870_11876 < _repeatcount_11870_11876; _index_11870_11876++){
          placeCounter = (placeCounter + 1); letVars['placeCounter'] = placeCounter;
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
            SelfManager.self().setVariable("value", procedures["RANDOM-BASE-LETTER"]());
            firstBasePairValue = SelfManager.self().getVariable("value"); letVars['firstBasePairValue'] = firstBasePairValue;
            SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("nucleotide-") + workspace.dump(SelfManager.self().getVariable("value"))));
            SelfManager.self().setVariable("heading", 0);
            SelfManager.self().setVariable("class", "original-dna-top");
            SelfManager.self().setVariable("unwound?", true);
            SelfManager.self().setVariable("color", world.observer.getGlobal("unwound-dna-color"));
            SelfManager.self().setVariable("place", placeCounter);
            SelfManager.self().setVariable("unzipped-stage", 0);
            procedures["ATTACH-NUCLEO-TAG"](5,0.5);
            if (!Prims.equality(lastNucleotideTopStrand, Nobody)) {
              LinkPrims.createLinkTo(lastNucleotideTopStrand, "BACKBONES").ask(function() {
                SelfManager.self().setVariable("hidden?", true);
                SelfManager.self().tie();
              }, true);
            }
            lastNucleotideTopStrand = SelfManager.self(); letVars['lastNucleotideTopStrand'] = lastNucleotideTopStrand;
            if (is_ThisTheFirstBase_p) {
              procedures["MAKE-AND-ATTACH-A-PRIMASE"]();
            }
            is_ThisTheFirstBase_p = false; letVars['is_ThisTheFirstBase_p'] = is_ThisTheFirstBase_p;
            SelfManager.self().hatch(1, "").ask(function() {
              SelfManager.self().right(180);
              SelfManager.self().setVariable("value", procedures["COMPLEMENTARY-BASE"](firstBasePairValue));
              SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("nucleotide-") + workspace.dump(SelfManager.self().getVariable("value"))));
              SelfManager.self().setVariable("class", "original-dna-bottom");
              LinkPrims.createLinkWith(lastNucleotideTopStrand, "OLD-STAIRS").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
              procedures["ATTACH-NUCLEO-TAG"](175,0.7);
              if (!Prims.equality(lastNucleotideBottomStrand, Nobody)) {
                LinkPrims.createLinkTo(lastNucleotideBottomStrand, "BACKBONES").ask(function() {
                  SelfManager.self().setVariable("hidden?", true);
                  SelfManager.self().tie();
                }, true);
              }
              lastNucleotideBottomStrand = SelfManager.self(); letVars['lastNucleotideBottomStrand'] = lastNucleotideBottomStrand;
            }, true);
          }, true);
          SelfManager.self()._optimalFdLessThan1(0.45);
        }
        SelfManager.self().die();
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeInitialDnaStrip"] = temp;
  procs["MAKE-INITIAL-DNA-STRIP"] = temp;
  temp = (function(direction, displacement) {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("heading", direction);
        SelfManager.self().fd(displacement);
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDE-TAGS"));
        SelfManager.self().setVariable("label", SelfManager.self().getVariable("value"));
        SelfManager.self().setVariable("size", 0.1);
        SelfManager.self().setVariable("color", world.observer.getGlobal("nucleo-tag-color"));
        LinkPrims.createLinkWith(SelfManager.myself(), "TAGLINES").ask(function() {
          SelfManager.self().setVariable("tie-mode", "fixed");
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().tie();
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["attachNucleoTag"] = temp;
  procs["ATTACH-NUCLEO-TAG"] = temp;
  temp = (function(direction, displacement, labelValue) {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("heading", direction);
        SelfManager.self().fd(displacement);
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("ENZYME-TAGS"));
        SelfManager.self().setVariable("shape", "empty");
        SelfManager.self().setVariable("label", labelValue);
        SelfManager.self().setVariable("color", world.observer.getGlobal("enzyme-tag-color"));
        SelfManager.self().setVariable("size", 0.1);
        LinkPrims.createLinkWith(SelfManager.myself(), "TAGLINES").ask(function() {
          SelfManager.self().setVariable("tie-mode", "fixed");
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().tie();
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["attachEnzymeTag"] = temp;
  procs["ATTACH-ENZYME-TAG"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (((world.observer.getGlobal("using-time-limit") && Prims.gt(world.observer.getGlobal("time-remaining"), 0)) || (!world.observer.getGlobal("using-time-limit") && !world.observer.getGlobal("cell-divided?")))) {
        procedures["CHECK-TIMER"]();
        procedures["MOVE-FREE-MOLECULES"]();
        procedures["CLEAN-UP-FREE-PHOSPHATES"]();
        procedures["REFILL-OR-REMOVE-NUCLEOSIDES"]();
        procedures["UNZIP-NUCLEOTIDES"]();
        procedures["DETECT-MOUSE-SELECTION-EVENT"]();
        procedures["LOCK-POLYMERASE-TO-ONE-NUCLEOTIDE"]();
        procedures["LOCK-TOPOISOMERASE-TO-WOUND-PRIMASE"]();
        if (procedures["ALL-BASE-PAIRS-UNWOUND?"]()) {
          procedures["SEPARATE-BASE-PAIRS"]();
        }
        procedures["VISUALIZE-AGENTS"]();
        world.ticker.tick();
      }
      if ((world.observer.getGlobal("cell-divided?") && !world.observer.getGlobal("cell-message-shown?"))) {
        if (Prims.equality(world.observer.getGlobal("final-time"), 0)) {
          world.observer.setGlobal("final-time", workspace.timer.elapsed());
        }
        procedures["CALCULATE-MUTATIONS"]();
        UserDialogPrims.confirm((workspace.dump('') + workspace.dump("You have cued the cell division.  Let's see how you did in replicating ") + workspace.dump("an exact copy of the DNA.")));
        UserDialogPrims.confirm(procedures["USER-MESSAGE-STRING-FOR-MUTATIONS"]());
        world.observer.setGlobal("cell-message-shown?", true);
      }
      if (((world.observer.getGlobal("using-time-limit") && Prims.lte(world.observer.getGlobal("time-remaining"), 0)) && !world.observer.getGlobal("timer-message-shown?"))) {
        if (Prims.equality(world.observer.getGlobal("final-time"), 0)) {
          world.observer.setGlobal("final-time", world.observer.getGlobal("length-of-simulation"));
        }
        procedures["CALCULATE-MUTATIONS"]();
        UserDialogPrims.confirm((workspace.dump('') + workspace.dump("The timer has expired.  Let's see how you did in replicating ") + workspace.dump("an exact copy of it.")));
        UserDialogPrims.confirm(procedures["USER-MESSAGE-STRING-FOR-MUTATIONS"]());
        world.observer.setGlobal("timer-message-shown?", true);
      }
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
      if (!world.observer.getGlobal("simulation-started?")) {
        world.observer.setGlobal("simulation-started?", true);
        workspace.timer.reset();
      }
      if (world.observer.getGlobal("using-time-limit")) {
        world.observer.setGlobal("time-remaining", (world.observer.getGlobal("length-of-simulation") - workspace.timer.elapsed()));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkTimer"] = temp;
  procs["CHECK-TIMER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("ENZYME-TAGS")).ask(function() { SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("enzyme-labels?")); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("NUCLEOTIDE-TAGS")).ask(function() { SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("nucleo-labels?")); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("TOPOISOMERASES")).ask(function() {
        if (SelfManager.self().getVariable("locked?")) {
          Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS")).ask(function() {
            SelfManager.self().right(-(10));
            SelfManager.self().setVariable("color", world.observer.getGlobal("topoisomerase-color-1"));
          }, true);
        }
        else {
          Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS")).ask(function() {
            SelfManager.self().right(-(3));
            SelfManager.self().setVariable("color", world.observer.getGlobal("topoisomerase-color-0"));
          }, true);
        }
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("POLYMERASES")).ask(function() {
        if (Prims.equality(SelfManager.self().getVariable("locked-state"), 0)) {
          SelfManager.self().setVariable("shape", "polymerase-0");
          SelfManager.self().setVariable("color", world.observer.getGlobal("polymerase-color-0"));
        }
        if (Prims.equality(SelfManager.self().getVariable("locked-state"), 1)) {
          SelfManager.self().setVariable("shape", "polymerase-1");
          SelfManager.self().setVariable("color", world.observer.getGlobal("polymerase-color-1"));
        }
        if (Prims.equality(SelfManager.self().getVariable("locked-state"), 2)) {
          SelfManager.self().setVariable("shape", "polymerase-2");
          SelfManager.self().setVariable("color", world.observer.getGlobal("polymerase-color-2"));
        }
        if (Prims.equality(SelfManager.self().getVariable("locked-state"), 3)) {
          SelfManager.self().setVariable("shape", "polymerase-3");
          SelfManager.self().setVariable("color", world.observer.getGlobal("polymerase-color-3"));
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["visualizeAgents"] = temp;
  procs["VISUALIZE-AGENTS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      for (let _index_17643_17649 = 0, _repeatcount_17643_17649 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_17643_17649 < _repeatcount_17643_17649; _index_17643_17649++){
        procedures["WIND-DNA"]();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["windInitialDnaIntoBundle"] = temp;
  procs["WIND-INITIAL-DNA-INTO-BUNDLE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let woundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); }); letVars['woundNucleotides'] = woundNucleotides;
      if (!woundNucleotides.isEmpty()) {
        let maxWoundPlace = ListPrims.max(woundNucleotides.projectionBy(function() { return SelfManager.self().getVariable("place"); })); letVars['maxWoundPlace'] = maxWoundPlace;
        Errors.askNobodyCheck(woundNucleotides.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), maxWoundPlace); })).ask(function() {
          SelfManager.self().right(-(world.observer.getGlobal("wind-angle")));
          SelfManager.self().setVariable("unwound?", true);
          SelfManager.self().setVariable("color", world.observer.getGlobal("unwound-dna-color"));
          notImplemented('display', undefined)();
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["unwindDna"] = temp;
  procs["UNWIND-DNA"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let unwoundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return ((SelfManager.self().getVariable("unwound?") && !Prims.equality(SelfManager.self().getVariable("class"), "copy-of-dna-bottom")) && !Prims.equality(SelfManager.self().getVariable("class"), "copy-of-dna-top"));
      }); letVars['unwoundNucleotides'] = unwoundNucleotides;
      if (!unwoundNucleotides.isEmpty()) {
        let minUnwoundPlace = ListPrims.min(unwoundNucleotides.projectionBy(function() { return SelfManager.self().getVariable("place"); })); letVars['minUnwoundPlace'] = minUnwoundPlace;
        Errors.askNobodyCheck(unwoundNucleotides.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), minUnwoundPlace); })).ask(function() {
          SelfManager.self().right(world.observer.getGlobal("wind-angle"));
          SelfManager.self().setVariable("unwound?", false);
          SelfManager.self().setVariable("color", world.observer.getGlobal("wound-dna-color"));
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["windDna"] = temp;
  procs["WIND-DNA"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let wereAnyNucleotidesUnzippedFurther_p = false; letVars['wereAnyNucleotidesUnzippedFurther_p'] = wereAnyNucleotidesUnzippedFurther_p;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return (procedures["NEXT-NUCLEOTIDE-UNZIPPED-THE-SAME?"]() && Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0));
      })).ask(function() {
        let fractionalSeparation = PrimChecks.math.div(SelfManager.self().getVariable("unzipped-stage"), 2); letVars['fractionalSeparation'] = fractionalSeparation;
        if (Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 3)) {
          Errors.askNobodyCheck(LinkPrims.myLinks("OLD-STAIRS")).ask(function() { SelfManager.self().die(); }, true);
          Errors.askNobodyCheck(LinkPrims.myOutLinks("BACKBONES")).ask(function() { SelfManager.self().die(); }, true);
        }
        if (Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 1)) {
          Errors.askNobodyCheck(LinkPrims.myOutLinks("BACKBONES")).ask(function() { SelfManager.self().untie(); }, true);
        }
        if ((Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0) && Prims.lt(SelfManager.self().getVariable("unzipped-stage"), 4))) {
          SelfManager.self().setVariable("unzipped-stage", (SelfManager.self().getVariable("unzipped-stage") + 1));
          wereAnyNucleotidesUnzippedFurther_p = true; letVars['wereAnyNucleotidesUnzippedFurther_p'] = wereAnyNucleotidesUnzippedFurther_p;
          if (Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top")) {
            SelfManager.self().setVariable("ycor", fractionalSeparation);
          }
          if (Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom")) {
            SelfManager.self().setVariable("ycor", (-1 * fractionalSeparation));
          }
        }
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("HELICASES")).ask(function() {
        if (wereAnyNucleotidesUnzippedFurther_p) {
          SelfManager.self().setVariable("shape", "helicase-expanded");
        }
        else {
          SelfManager.self().setVariable("shape", "helicase");
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["unzipNucleotides"] = temp;
  procs["UNZIP-NUCLEOTIDES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let lowestPlace = 0; letVars['lowestPlace'] = lowestPlace;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("HELICASES")).ask(function() {
        let thisHelicase = SelfManager.self(); letVars['thisHelicase'] = thisHelicase;
        let unzippedNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 0); }); letVars['unzippedNucleotides'] = unzippedNucleotides;
        if (!unzippedNucleotides.isEmpty()) {
          lowestPlace = unzippedNucleotides.minOneOf(function() { return SelfManager.self().getVariable("place"); }); letVars['lowestPlace'] = lowestPlace;
        }
        let availableNucleotides = unzippedNucleotides.agentFilter(function() {
          return (Prims.lt(SelfManager.self().distance(thisHelicase), 1) && procedures["ARE-PREVIOUS-NUCLEOTIDES-UNZIPPED?"]());
        }); letVars['availableNucleotides'] = availableNucleotides;
        if (!availableNucleotides.isEmpty()) {
          let lowestValueNucleotide = availableNucleotides.minOneOf(function() { return SelfManager.self().getVariable("place"); }); letVars['lowestValueNucleotide'] = lowestValueNucleotide;
          Errors.askNobodyCheck(lowestValueNucleotide).ask(function() {
            let base = SelfManager.self(); letVars['base'] = base;
            let basePlace = SelfManager.self().getVariable("place"); letVars['basePlace'] = basePlace;
            let otherBase = world.turtleManager.turtlesOfBreed("NUCLEOTIDES")._optimalOtherWith(function() { return Prims.equality(SelfManager.self().getVariable("place"), basePlace); }); letVars['otherBase'] = otherBase;
            if (!otherBase.isEmpty()) {
              SelfManager.self().setVariable("unzipped-stage", 1);
              Errors.askNobodyCheck(otherBase).ask(function() { SelfManager.self().setVariable("unzipped-stage", 1); }, true);
            }
          }, true);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["separateBasePairs"] = temp;
  procs["SEPARATE-BASE-PAIRS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let allMolecules = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("PHOSPHATES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES")); letVars['allMolecules'] = allMolecules;
      Errors.askNobodyCheck(allMolecules).ask(function() {
        if (!procedures["BEING-DRAGGED-BY-CURSOR?"]()) {
          SelfManager.self().fd(world.observer.getGlobal("molecule-step"));
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["moveFreeMolecules"] = temp;
  procs["MOVE-FREE-MOLECULES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PHOSPHATES")).ask(function() {
        if ((((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.minPxcor) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.maxPxcor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.maxPycor))) {
          SelfManager.self().die();
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["cleanUpFreePhosphates"] = temp;
  procs["CLEAN-UP-FREE-PHOSPHATES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.lt(world.turtleManager.turtlesOfBreed("NUCLEOSIDES").size(), world.observer.getGlobal("free-nucleosides"))) {
        procedures["MAKE-A-NUCLEOSIDE"]();
      }
      if (Prims.gt(world.turtleManager.turtlesOfBreed("NUCLEOSIDES").size(), world.observer.getGlobal("free-nucleosides"))) {
        Errors.askNobodyCheck(ListPrims.oneOf(world.turtleManager.turtlesOfBreed("NUCLEOSIDES"))).ask(function() {
          Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().die(); }, true);
          SelfManager.self().die();
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["refillOrRemoveNucleosides"] = temp;
  procs["REFILL-OR-REMOVE-NUCLEOSIDES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let targetXcor = 0; letVars['targetXcor'] = targetXcor;
      let targetYcor = 0; letVars['targetYcor'] = targetYcor;
      let targetClass = ""; letVars['targetClass'] = targetClass;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("POLYMERASES")).ask(function() {
        let nucleosidesReadyToGearToPolymerase = Nobody; letVars['nucleosidesReadyToGearToPolymerase'] = nucleosidesReadyToGearToPolymerase;
        let potentialNucleosideReadyToGearToPolymerase = Nobody; letVars['potentialNucleosideReadyToGearToPolymerase'] = potentialNucleosideReadyToGearToPolymerase;
        let targetNucleotideReadyToGearToPolymerase = Nobody; letVars['targetNucleotideReadyToGearToPolymerase'] = targetNucleotideReadyToGearToPolymerase;
        nucleosidesReadyToGearToPolymerase = world.turtleManager.turtlesOfBreed("NUCLEOSIDES").agentFilter(function() {
          return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
        }); letVars['nucleosidesReadyToGearToPolymerase'] = nucleosidesReadyToGearToPolymerase;
        if (nucleosidesReadyToGearToPolymerase._optimalCheckCount(1, (a, b) => a > b)) {
          potentialNucleosideReadyToGearToPolymerase = nucleosidesReadyToGearToPolymerase.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); }); letVars['potentialNucleosideReadyToGearToPolymerase'] = potentialNucleosideReadyToGearToPolymerase;
        }
        if (nucleosidesReadyToGearToPolymerase._optimalCheckCount(1, (a, b) => a === b)) {
          potentialNucleosideReadyToGearToPolymerase = nucleosidesReadyToGearToPolymerase; letVars['potentialNucleosideReadyToGearToPolymerase'] = potentialNucleosideReadyToGearToPolymerase;
        }
        let nucleotidesReadyToGearToPolymerase = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
          return (((!!LinkPrims.myLinks("OLD-STAIRS").isEmpty() && !!LinkPrims.myLinks("NEW-STAIRS").isEmpty()) && (Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom") || Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top"))) && Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius")));
        }); letVars['nucleotidesReadyToGearToPolymerase'] = nucleotidesReadyToGearToPolymerase;
        if (((!nucleotidesReadyToGearToPolymerase.isEmpty() && procedures["ALL-BASE-PAIRS-UNWOUND?"]()) && !procedures["BEING-DRAGGED-BY-CURSOR?"]())) {
          targetNucleotideReadyToGearToPolymerase = nucleotidesReadyToGearToPolymerase.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); }); letVars['targetNucleotideReadyToGearToPolymerase'] = targetNucleotideReadyToGearToPolymerase;
          targetXcor = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("xcor"); }); letVars['targetXcor'] = targetXcor;
          targetYcor = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("ycor"); }); letVars['targetYcor'] = targetYcor;
          targetClass = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("class"); }); letVars['targetClass'] = targetClass;
          SelfManager.self().setXY(targetXcor, targetYcor);
        }
        if ((!!nucleotidesReadyToGearToPolymerase.isEmpty() || SelfPrims._optimalAnyOther(SelfManager.self().breedHere("POLYMERASES")))) {
          SelfManager.self().setVariable("locked-state", 0);
        }
        if ((((!nucleotidesReadyToGearToPolymerase.isEmpty() && procedures["ALL-BASE-PAIRS-UNWOUND?"]()) && Prims.equality(potentialNucleosideReadyToGearToPolymerase, Nobody)) && !SelfPrims._optimalAnyOther(SelfManager.self().breedHere("POLYMERASES")))) {
          SelfManager.self().setVariable("locked-state", 1);
        }
        if ((((!Prims.equality(targetNucleotideReadyToGearToPolymerase, Nobody) && procedures["ALL-BASE-PAIRS-UNWOUND?"]()) && !Prims.equality(potentialNucleosideReadyToGearToPolymerase, Nobody)) && !SelfPrims._optimalAnyOther(SelfManager.self().breedHere("POLYMERASES")))) {
          SelfManager.self().setVariable("locked-state", 2);
          if ((procedures["WOULD-THESE-NUCLEOTIDES-PAIR-CORRECTLY?"](targetNucleotideReadyToGearToPolymerase,potentialNucleosideReadyToGearToPolymerase) || world.observer.getGlobal("substitutions?"))) {
            Errors.askNobodyCheck(potentialNucleosideReadyToGearToPolymerase).ask(function() {
              Errors.askNobodyCheck(LinkPrims.myInLinks("CURSOR-DRAGS")).ask(function() { SelfManager.self().die(); }, true);
              Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().die(); }, true);
              SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
              SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("nucleotide-") + workspace.dump(SelfManager.self().getVariable("value"))));
              SelfManager.self().setVariable("unwound?", true);
              if (Prims.equality(targetClass, "original-dna-top")) {
                SelfManager.self().setVariable("heading", 180);
                SelfManager.self().setVariable("class", "copy-of-dna-bottom");
                procedures["ATTACH-NUCLEO-TAG"](175,0.7);
              }
              if (Prims.equality(targetClass, "original-dna-bottom")) {
                SelfManager.self().setVariable("heading", 0);
                SelfManager.self().setVariable("class", "copy-of-dna-top");
                procedures["ATTACH-NUCLEO-TAG"](5,0.5);
              }
              SelfManager.self().setXY(targetXcor, targetYcor);
              procedures["BREAK-OFF-PHOSPHATES-FROM-NUCLEOSIDE"]();
              LinkPrims.createLinkWith(targetNucleotideReadyToGearToPolymerase, "NEW-STAIRS").ask(function() {
                SelfManager.self().setVariable("hidden?", false);
                SelfManager.self().tie();
              }, true);
            }, true);
          }
          else {
            SelfManager.self().setVariable("locked-state", 3);
          }
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["lockPolymeraseToOneNucleotide"] = temp;
  procs["LOCK-POLYMERASE-TO-ONE-NUCLEOTIDE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PHOSPHATES"));
        SelfManager.self().setVariable("shape", "phosphate-pair");
        SelfManager.self().setVariable("heading", RandomPrims.randomLong(360));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["breakOffPhosphatesFromNucleoside"] = temp;
  procs["BREAK-OFF-PHOSPHATES-FROM-NUCLEOSIDE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let targetXcor = 0; letVars['targetXcor'] = targetXcor;
      let targetYcor = 0; letVars['targetYcor'] = targetYcor;
      let targetClass = ""; letVars['targetClass'] = targetClass;
      let woundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); }); letVars['woundNucleotides'] = woundNucleotides;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("TOPOISOMERASES")).ask(function() {
        if (!woundNucleotides.isEmpty()) {
          let targetPrimasesReadyToGearToTopoisomerase = world.turtleManager.turtlesOfBreed("PRIMASES").agentFilter(function() {
            return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
          }); letVars['targetPrimasesReadyToGearToTopoisomerase'] = targetPrimasesReadyToGearToTopoisomerase;
          if (!targetPrimasesReadyToGearToTopoisomerase.isEmpty()) {
            let targetPrimaseReadyToGearToTopoisomerase = ListPrims.oneOf(targetPrimasesReadyToGearToTopoisomerase); letVars['targetPrimaseReadyToGearToTopoisomerase'] = targetPrimaseReadyToGearToTopoisomerase;
            SelfManager.self().setVariable("locked?", true);
            if (!MousePrims.isDown()) {
              procedures["UNWIND-DNA"]();
              Errors.askNobodyCheck(LinkPrims.myInLinks("CURSOR-DRAGS")).ask(function() { SelfManager.self().die(); }, true);
              targetXcor = targetPrimaseReadyToGearToTopoisomerase.projectionBy(function() { return SelfManager.self().getVariable("xcor"); }); letVars['targetXcor'] = targetXcor;
              targetYcor = targetPrimaseReadyToGearToTopoisomerase.projectionBy(function() { return SelfManager.self().getVariable("ycor"); }); letVars['targetYcor'] = targetYcor;
              SelfManager.self().setXY(targetXcor, targetYcor);
            }
          }
          else {
            SelfManager.self().setVariable("locked?", false);
          }
        }
        else {
          SelfManager.self().setVariable("locked?", false);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["lockTopoisomeraseToWoundPrimase"] = temp;
  procs["LOCK-TOPOISOMERASE-TO-WOUND-PRIMASE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("total-deletion-mutations-top-strand", 0);
      world.observer.setGlobal("total-substitution-mutations-top-strand", 0);
      world.observer.setGlobal("total-correct-duplications-top-strand", 0);
      world.observer.setGlobal("total-deletion-mutations-bottom-strand", 0);
      world.observer.setGlobal("total-substitution-mutations-bottom-strand", 0);
      world.observer.setGlobal("total-correct-duplications-bottom-strand", 0);
      let originalNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top"); }); letVars['originalNucleotides'] = originalNucleotides;
      Errors.askNobodyCheck(originalNucleotides).ask(function() {
        if (!!LinkPrims.myLinks("NEW-STAIRS").isEmpty()) {
          world.observer.setGlobal("total-deletion-mutations-top-strand", (world.observer.getGlobal("total-deletion-mutations-top-strand") + 1));
        }
        if (Prims.gte(LinkPrims.myLinks("NEW-STAIRS").size(), 1)) {
          if (procedures["IS-THIS-NUCLEOTIDE-PAIRED-CORRECTLY?"]()) {
            world.observer.setGlobal("total-correct-duplications-top-strand", (world.observer.getGlobal("total-correct-duplications-top-strand") + 1));
          }
          else {
            world.observer.setGlobal("total-substitution-mutations-top-strand", (world.observer.getGlobal("total-substitution-mutations-top-strand") + 1));
          }
        }
      }, true);
      originalNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom"); }); letVars['originalNucleotides'] = originalNucleotides;
      Errors.askNobodyCheck(originalNucleotides).ask(function() {
        if (!!LinkPrims.myLinks("NEW-STAIRS").isEmpty()) {
          world.observer.setGlobal("total-deletion-mutations-bottom-strand", (world.observer.getGlobal("total-deletion-mutations-bottom-strand") + 1));
        }
        if (Prims.gte(LinkPrims.myLinks("NEW-STAIRS").size(), 1)) {
          if (procedures["IS-THIS-NUCLEOTIDE-PAIRED-CORRECTLY?"]()) {
            world.observer.setGlobal("total-correct-duplications-bottom-strand", (world.observer.getGlobal("total-correct-duplications-bottom-strand") + 1));
          }
          else {
            world.observer.setGlobal("total-substitution-mutations-bottom-strand", (world.observer.getGlobal("total-substitution-mutations-bottom-strand") + 1));
          }
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["calculateMutations"] = temp;
  procs["CALCULATE-MUTATIONS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let pMouseXcor = MousePrims.getX(); letVars['pMouseXcor'] = pMouseXcor;
      let pMouseYcor = MousePrims.getY(); letVars['pMouseYcor'] = pMouseYcor;
      let currentMouseDown_p = MousePrims.isDown(); letVars['currentMouseDown_p'] = currentMouseDown_p;
      let targetTurtle = Nobody; letVars['targetTurtle'] = targetTurtle;
      let currentMouseInside_p = MousePrims.isInside(); letVars['currentMouseInside_p'] = currentMouseInside_p;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MOUSE-CURSORS")).ask(function() {
        SelfManager.self().setXY(pMouseXcor, pMouseYcor);
        SelfManager.self().setVariable("hidden?", true);
        let allMoveableMolecules = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES")); letVars['allMoveableMolecules'] = allMoveableMolecules;
        let draggableMolecules = allMoveableMolecules.agentFilter(function() {
          return (!procedures["BEING-DRAGGED-BY-CURSOR?"]() && Prims.lte(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("mouse-drag-radius")));
        }); letVars['draggableMolecules'] = draggableMolecules;
        if (((!currentMouseDown_p && MousePrims.isInside()) && !draggableMolecules.isEmpty())) {
          SelfManager.self().setVariable("color", world.observer.getGlobal("cursor-detect-color"));
          SelfManager.self().setVariable("hidden?", false);
          SelfManager.self().right(4);
        }
        if ((procedures["IS-THIS-CURSOR-DRAGGING-ANYTHING?"]() && MousePrims.isInside())) {
          SelfManager.self().setVariable("color", world.observer.getGlobal("cursor-drag-color"));
          SelfManager.self().setVariable("hidden?", false);
        }
        if ((((!world.observer.getGlobal("mouse-continuous-down?") && currentMouseDown_p) && !procedures["IS-THIS-CURSOR-DRAGGING-ANYTHING?"]()) && !draggableMolecules.isEmpty())) {
          targetTurtle = draggableMolecules.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); }); letVars['targetTurtle'] = targetTurtle;
          Errors.askNobodyCheck(targetTurtle).ask(function() { SelfManager.self().setXY(pMouseXcor, pMouseYcor); }, true);
          LinkPrims.createLinkTo(targetTurtle, "CURSOR-DRAGS").ask(function() {
            SelfManager.self().setVariable("hidden?", false);
            SelfManager.self().tie();
          }, true);
        }
        if (!currentMouseDown_p) {
          Errors.askNobodyCheck(LinkPrims.myOutLinks("CURSOR-DRAGS")).ask(function() { SelfManager.self().die(); }, true);
        }
      }, true);
      if ((currentMouseDown_p && MousePrims.isDown())) {
        world.observer.setGlobal("mouse-continuous-down?", true);
      }
      else {
        world.observer.setGlobal("mouse-continuous-down?", false);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["detectMouseSelectionEvent"] = temp;
  procs["DETECT-MOUSE-SELECTION-EVENT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let r = RandomPrims.randomLong(4); letVars['r'] = r;
      let letterToReport = ""; letVars['letterToReport'] = letterToReport;
      if (Prims.equality(r, 0)) {
        letterToReport = "A"; letVars['letterToReport'] = letterToReport;
      }
      if (Prims.equality(r, 1)) {
        letterToReport = "G"; letVars['letterToReport'] = letterToReport;
      }
      if (Prims.equality(r, 2)) {
        letterToReport = "T"; letVars['letterToReport'] = letterToReport;
      }
      if (Prims.equality(r, 3)) {
        letterToReport = "C"; letVars['letterToReport'] = letterToReport;
      }
      Errors.reportInContextCheck(reporterContext);
      return letterToReport;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["randomBaseLetter"] = temp;
  procs["RANDOM-BASE-LETTER"] = temp;
  temp = (function(base) {
    try {
      var reporterContext = true;
      var letVars = { };
      let baseToReport = ""; letVars['baseToReport'] = baseToReport;
      if (Prims.equality(base, "A")) {
        baseToReport = "T"; letVars['baseToReport'] = baseToReport;
      }
      if (Prims.equality(base, "T")) {
        baseToReport = "A"; letVars['baseToReport'] = baseToReport;
      }
      if (Prims.equality(base, "G")) {
        baseToReport = "C"; letVars['baseToReport'] = baseToReport;
      }
      if (Prims.equality(base, "C")) {
        baseToReport = "G"; letVars['baseToReport'] = baseToReport;
      }
      Errors.reportInContextCheck(reporterContext);
      return baseToReport;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["complementaryBase"] = temp;
  procs["COMPLEMENTARY-BASE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (world.observer.getGlobal("using-time-limit")) {
        Errors.reportInContextCheck(reporterContext);
        return world.observer.getGlobal("time-remaining");
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return "";
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["timeRemainingToDisplay"] = temp;
  procs["TIME-REMAINING-TO-DISPLAY"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (!LinkPrims.outLinkNeighbors("CURSOR-DRAGS").isEmpty()) {
        Errors.reportInContextCheck(reporterContext);
        return true;
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return false;
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["is_ThisCursorDraggingAnything_p"] = temp;
  procs["IS-THIS-CURSOR-DRAGGING-ANYTHING?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (!LinkPrims.myInLinks("CURSOR-DRAGS").isEmpty()) {
        Errors.reportInContextCheck(reporterContext);
        return true;
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return false;
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["beingDraggedByCursor_p"] = temp;
  procs["BEING-DRAGGED-BY-CURSOR?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (world.turtleManager.turtlesOfBreed("NUCLEOTIDES")._optimalAnyWith(function() { return !SelfManager.self().getVariable("unwound?"); })) {
        Errors.reportInContextCheck(reporterContext);
        return false;
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return true;
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["allBasePairsUnwound_p"] = temp;
  procs["ALL-BASE-PAIRS-UNWOUND?"] = temp;
  temp = (function(nucleotide1, nucleotide2) {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.equality(procedures["COMPLEMENTARY-BASE"](nucleotide1.projectionBy(function() { return SelfManager.self().getVariable("value"); })), PrimChecks.list.item(0, nucleotide2.projectionBy(function() { return SelfManager.self().getVariable("value"); })))) {
        Errors.reportInContextCheck(reporterContext);
        return true;
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return false;
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["wouldTheseNucleotidesPairCorrectly_p"] = temp;
  procs["WOULD-THESE-NUCLEOTIDES-PAIR-CORRECTLY?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let originalNucleotide = SelfManager.self(); letVars['originalNucleotide'] = originalNucleotide;
      let thisStair = ListPrims.oneOf(LinkPrims.myLinks("NEW-STAIRS")); letVars['thisStair'] = thisStair;
      let thisPairedNucleotide = Nobody; letVars['thisPairedNucleotide'] = thisPairedNucleotide;
      let overwrite_p = false; letVars['overwrite_p'] = overwrite_p;
      Errors.askNobodyCheck(thisStair).ask(function() {
        thisPairedNucleotide = SelfManager.self().otherEnd(); letVars['thisPairedNucleotide'] = thisPairedNucleotide;
        if (!Prims.equality(thisPairedNucleotide, Nobody)) {
          if ((!Prims.equality(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("class"); }), "copy-of-dna-bottom") && !Prims.equality(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("class"); }), "copy-of-dna-top"))) {
            overwrite_p = true; letVars['overwrite_p'] = overwrite_p;
          }
        }
      }, true);
      if ((Prims.equality(SelfManager.self().getVariable("value"), procedures["COMPLEMENTARY-BASE"](thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("value"); }))) && !overwrite_p)) {
        Errors.reportInContextCheck(reporterContext);
        return true;
      }
      else {
        Errors.reportInContextCheck(reporterContext);
        return false;
      }
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["is_ThisNucleotidePairedCorrectly_p"] = temp;
  procs["IS-THIS-NUCLEOTIDE-PAIRED-CORRECTLY?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let myUnzippedStage = SelfManager.self().getVariable("unzipped-stage"); letVars['myUnzippedStage'] = myUnzippedStage;
      let myPlace = SelfManager.self().getVariable("place"); letVars['myPlace'] = myPlace;
      let myClass = SelfManager.self().getVariable("class"); letVars['myClass'] = myClass;
      let nextNucleotidesAvailable = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return ((Prims.equality(SelfManager.self().getVariable("class"), myClass) && Prims.equality(SelfManager.self().getVariable("place"), (myPlace + 1))) && Prims.equality(SelfManager.self().getVariable("unzipped-stage"), myUnzippedStage));
      }); letVars['nextNucleotidesAvailable'] = nextNucleotidesAvailable;
      let canContinueToUnzip_p = false; letVars['canContinueToUnzip_p'] = canContinueToUnzip_p;
      if (Prims.lt(myPlace, world.observer.getGlobal("dna-strand-length"))) {
        if ((!nextNucleotidesAvailable.isEmpty() && procedures["ARE-PREVIOUS-NUCLEOTIDES-UNZIPPED?"]())) {
          canContinueToUnzip_p = true; letVars['canContinueToUnzip_p'] = canContinueToUnzip_p;
        }
        else {
          canContinueToUnzip_p = false; letVars['canContinueToUnzip_p'] = canContinueToUnzip_p;
        }
      }
      else {
        canContinueToUnzip_p = true; letVars['canContinueToUnzip_p'] = canContinueToUnzip_p;
      }
      Errors.reportInContextCheck(reporterContext);
      return canContinueToUnzip_p;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["nextNucleotideUnzippedTheSame_p"] = temp;
  procs["NEXT-NUCLEOTIDE-UNZIPPED-THE-SAME?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let myPlace = SelfManager.self().getVariable("place"); letVars['myPlace'] = myPlace;
      let previousNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), (myPlace - 1)); }); letVars['previousNucleotides'] = previousNucleotides;
      let valueToReturn = false; letVars['valueToReturn'] = valueToReturn;
      if (!!previousNucleotides.isEmpty()) {
        valueToReturn = true; letVars['valueToReturn'] = valueToReturn;
      }
      else {
        let previousNucleotidesAreUnzipped = previousNucleotides.agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0); }); letVars['previousNucleotidesAreUnzipped'] = previousNucleotidesAreUnzipped;
        if (!previousNucleotidesAreUnzipped.isEmpty()) {
          valueToReturn = true; letVars['valueToReturn'] = valueToReturn;
        }
        else {
          valueToReturn = false; letVars['valueToReturn'] = valueToReturn;
        }
      }
      Errors.reportInContextCheck(reporterContext);
      return valueToReturn;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["arePreviousNucleotidesUnzipped_p"] = temp;
  procs["ARE-PREVIOUS-NUCLEOTIDES-UNZIPPED?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let duplicationRate = NLMath.precision(PrimChecks.math.div((world.observer.getGlobal("total-correct-duplications-top-strand") + world.observer.getGlobal("total-correct-duplications-bottom-strand")), world.observer.getGlobal("final-time")), 4); letVars['duplicationRate'] = duplicationRate;
      Errors.reportInContextCheck(reporterContext);
      return (workspace.dump('') + workspace.dump("You had ") + workspace.dump((world.observer.getGlobal("total-correct-duplications-top-strand") + world.observer.getGlobal("total-correct-duplications-bottom-strand"))) + workspace.dump(" correct replications and ") + workspace.dump((world.observer.getGlobal("total-substitution-mutations-top-strand") + world.observer.getGlobal("total-substitution-mutations-bottom-strand"))) + workspace.dump(" substitutions and ") + workspace.dump((world.observer.getGlobal("total-deletion-mutations-top-strand") + world.observer.getGlobal("total-deletion-mutations-bottom-strand"))) + workspace.dump("  deletions.") + workspace.dump(" That replication process took you ") + workspace.dump(world.observer.getGlobal("final-time")) + workspace.dump(" seconds.  This was a rate of ") + workspace.dump(duplicationRate) + workspace.dump(" correct nucleotides duplicated per second."));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["userMessageStringForMutations"] = temp;
  procs["USER-MESSAGE-STRING-FOR-MUTATIONS"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return (Prims.ifElseValueBooleanCheck(Prims.equality(world.observer.getGlobal("current-instruction"), 0)) ? "press setup" : (workspace.dump('') + workspace.dump(world.observer.getGlobal("current-instruction")) + workspace.dump(" / ") + workspace.dump(PrimChecks.list.length(procedures["INSTRUCTIONS"]()))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["currentInstructionLabel"] = temp;
  procs["CURRENT-INSTRUCTION-LABEL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SHOW-INSTRUCTION"]((world.observer.getGlobal("current-instruction") + 1));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["nextInstruction"] = temp;
  procs["NEXT-INSTRUCTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SHOW-INSTRUCTION"]((world.observer.getGlobal("current-instruction") - 1));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["previousInstruction"] = temp;
  procs["PREVIOUS-INSTRUCTION"] = temp;
  temp = (function(i) {
    try {
      var reporterContext = false;
      var letVars = { };
      if ((Prims.gte(i, 1) && Prims.lte(i, PrimChecks.list.length(procedures["INSTRUCTIONS"]())))) {
        world.observer.setGlobal("current-instruction", i);
        OutputPrims.clear();
        var _foreach_35144_35151 = Tasks.forEach(Tasks.commandTask(function(_0) {
          Errors.procedureArgumentsCheck(1, arguments.length);
          OutputPrims.print(_0);
        }, "output-print"), PrimChecks.list.item((world.observer.getGlobal("current-instruction") - 1), procedures["INSTRUCTIONS"]())); if(reporterContext && _foreach_35144_35151 !== undefined) { return _foreach_35144_35151; }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["showInstruction"] = temp;
  procs["SHOW-INSTRUCTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return [["You will be simulating the process", "of DNA replication that occurs in", "every cell in every living creature", "as part of mitosis or meiosis."], ["To do this you will need to complete", "4 tasks in the shortest time you", "can. Each of these tasks requires", "you to drag a molecule using your", "mouse, from one location to another."], ["The 1st task will be to unwind a ", "twisted bundle of DNA by using your", "mouse to place a topoisomerase ", "enzyme on top of the primase enzyme."], ["The 2nd task will be to unzip the", "DNA ladder structure by dragging", "a helicase enzyme from the 1st ", "base pair to the last base pair."], ["The 3rd task will be to first drag", "a polymerase enzyme to an open", "nucleotide and then drag a floating", "nucleoside to the same location."], ["The last task is to simply repeat", "the previous task of connecting", "nucleosides to open nucleotides", "until as much of the DNA as", "possible has been replicated."], ["The simulation ends either when", "the timer runs out (if the timer?", "chooser is set to YES) or when you", "press the DIVIDE THE CELL button"]];
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["instructions"] = temp;
  procs["INSTRUCTIONS"] = temp;
  return procs;
})();
world.observer.setGlobal("dna-strand-length", 30);
world.observer.setGlobal("nucleo-labels?", true);
world.observer.setGlobal("enzyme-labels?", true);
world.observer.setGlobal("substitutions?", false);
world.observer.setGlobal("free-nucleosides", 50);
world.observer.setGlobal("time-limit", "none");