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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[150,165,165,180,180,195,195,210,210,165,165,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,135,120,120,105,105,90,90,135,135,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"empty":{"name":"empty","editableColorIndex":0,"rotate":false,"elements":[]},"helicase":{"name":"helicase","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":false,"marked":false}]},"helicase-expanded":{"name":"helicase-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":false,"marked":false}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"nucleoside-tri-a":{"name":"nucleoside-tri-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"nucleoside-tri-c":{"name":"nucleoside-tri-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,135,165,165,135,60],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false}]},"nucleoside-tri-g":{"name":"nucleoside-tri-g","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":false}]},"nucleoside-tri-t":{"name":"nucleoside-tri-t","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":false}]},"nucleotide-a":{"name":"nucleotide-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"nucleotide-c":{"name":"nucleotide-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false}]},"nucleotide-g":{"name":"nucleotide-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"nucleotide-t":{"name":"nucleotide-t","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"phosphate":{"name":"phosphate","editableColorIndex":0,"rotate":true,"elements":[{"x":129,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"phosphate-pair":{"name":"phosphate-pair","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":135,"x2":150,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":144,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":99,"y":120,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"polymerase-0":{"name":"polymerase-0","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,60,60,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":0,"xmax":120,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true}]},"polymerase-1":{"name":"polymerase-1","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true}]},"polymerase-2":{"name":"polymerase-2","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"x1":180,"y1":60,"x2":180,"y2":240,"type":"line","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true}]},"polymerase-3":{"name":"polymerase-3","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true}]},"primase":{"name":"primase","editableColorIndex":1,"rotate":true,"elements":[{"xcors":[90,75,90,120,150,150,180,180,225,285,285,270,240,210,195,195,180,150,105,75,60,60],"ycors":[195,240,270,255,270,300,300,270,255,195,180,165,150,165,165,135,90,90,90,120,150,165],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"target":{"name":"target","editableColorIndex":0,"rotate":true,"elements":[{"x":76,"y":76,"diam":146,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":60,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":195,"x2":150,"y2":240,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"topoisomerase":{"name":"topoisomerase","editableColorIndex":0,"rotate":true,"elements":[{"x":45,"y":45,"diam":210,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":129,"diam":44,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"topoisomerase-gears":{"name":"topoisomerase-gears","editableColorIndex":0,"rotate":true,"elements":[{"xmin":135,"ymin":15,"xmax":165,"ymax":60,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":240,"ymin":135,"xmax":285,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":135,"ymin":240,"xmax":165,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":15,"ymin":135,"xmax":60,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[60,105,75,45],"ycors":[255,225,195,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[45,75,105,60],"ycors":[60,105,75,45],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[240,195,225,255],"ycors":[45,75,105,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,225,195,240],"ycors":[240,195,225,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "phosphates", singular: "phosphate", varNames: [] }, { name: "nucleosides", singular: "nucleoside", varNames: ["class", "value", "place"] }, { name: "nucleotides", singular: "nucleotide", varNames: ["class", "value", "place", "unwound?", "unzipped-stage"] }, { name: "polymerases", singular: "polymerase", varNames: ["locked-state"] }, { name: "helicases", singular: "helicase", varNames: [] }, { name: "topoisomerases", singular: "topoisomerase", varNames: ["locked?"] }, { name: "topoisomerases-gears", singular: "topoisomerase-gear", varNames: [] }, { name: "primases", singular: "primase", varNames: [] }, { name: "nucleotide-tags", singular: "nucleotide-tag", varNames: ["value"] }, { name: "enzyme-tags", singular: "enzyme-tag", varNames: [] }, { name: "mouse-cursors", singular: "mouse-cursor", varNames: [] }, { name: "chromosome-builders", singular: "initial-chromosomes-builder", varNames: [] }, { name: "old-stairs", singular: "old-stair", varNames: [], isDirected: false }, { name: "new-stairs", singular: "new-stair", varNames: [], isDirected: false }, { name: "taglines", singular: "tagline", varNames: [], isDirected: false }, { name: "gearlines", singular: "gearline", varNames: [], isDirected: true }, { name: "cursor-drags", singular: "cursor-drag", varNames: [], isDirected: true }, { name: "backbones", singular: "backbone", varNames: [], isDirected: true }])([], [])('                                                        ;;;;;;;;;;;;; small molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [phosphates phosphate]                            ;; the free floating phosphates that are broken off a nucleoside-tri-phosphate when a nucleotide is formed breed [nucleosides nucleoside]                          ;; the free floating nucleoside-tri-phosphates breed [nucleotides nucleotide]                          ;; the pieces that are inside the DNA chain                                                          ;;;;;;;;;;;;enzymes ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [polymerases polymerase]                          ;; for gearing a hydrogen \"old-stair\" bond of free nucleosides to existing nucleotides breed [helicases helicase]                              ;; for unzipping a DNA strand breed [topoisomerases topoisomerase]                    ;; for unwinding a DNA chromosome breed [topoisomerases-gears topoisomerase-gear]         ;; for visualizing a spin in topoisomerases when unwinding a DNA chromosome breed [primases primase]                                ;; for attaching to the first nucleotide on the top strand.                                                         ;;   It marks the location where the topoisomerase must be to unwind                                                          ;;;;;;;;;;;;; label turtles  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [nucleotide-tags nucleotide-tag]                  ;; the turtle tied to the nucleotide that supports a fine tuned placement of the A, G, C, T lettering breed [enzyme-tags enzyme-tag]                          ;; the turtle tied to the helicase and polymerase that supports a fine tuned placement of the label                                                          ;;;;;;;;;;;;; visualization turtles ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [mouse-cursors mouse-cursor]                      ;; follows the cursor location breed [chromosome-builders initial-chromosomes-builder] ;; initial temporary construction turtle                                                          ;;;;;;;;;;;;; links ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; undirected-link-breed [old-stairs old-stair]            ;; links between nucleotide base pairs that made the old stairs of the \"spiral staircase\" in the DNA undirected-link-breed [new-stairs new-stair]            ;; links between nucleotide base pairs that makes the new stairs of the \"spiral staircase\" in the replicated DNA undirected-link-breed [taglines tagline]                ;; links between an agent and where its label agent is. This allows fine tuned placement of visualizing of labels directed-link-breed [gearlines gearline]                ;; links between topoisomerase and its topoisomerases-gears directed-link-breed [cursor-drags cursor-drag]          ;; links the mouse-cursor and any other agent it is dragging with it during a mouse-down? event directed-link-breed [backbones backbone]                ;; links between adjacent nucleotides on the same side of the DNA strand -                                                         ;;   this represents the sugar backbone of the strand it allows the entire strand to be wound or unwound                                                          ;;;;;;;;;;;;;;;;;;;turtle variables ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; nucleosides-own [class value place]                     ;; class is top or bottom and copy or original / value is A, G, C, or T /  place is a # of order in sequence nucleotides-own [                                       ;; nucleotides may be any of 4 unzipped-stages (how far the zipper is undone)   class value   place unwound?   unzipped-stage ] nucleotide-tags-own [value]                             ;; the value for their label when visualized polymerases-own [locked-state]                          ;; locked-state can be four possible values for polymerase for when it is bound to a nucleotide and                                                         ;;   responding to confirmation of whether a matched nucleoside is nearby or not topoisomerases-own [locked?]                            ;; locked? is true/false for when the topoisomerase is on the site of the primase  globals [                                               ;;;;;;;;;;;;;;;;;;;;globals ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   initial-length-dna   mouse-continuous-down?    instruction ;; counter which keeps track of which instruction is being displayed in the output    ;; colors for various agents and states of agents   cursor-detect-color   cursor-drag-color   wound-dna-color   unwound-dna-color   nucleo-tag-color   enzyme-tag-color   nucleoside-color    ;; colors for the four different states the polymerase enzyme can be in   polymerase-color-0   polymerase-color-1   polymerase-color-2   polymerase-color-3    ;; colors for the two different states the helicase enzyme can be in   helicase-color-0   helicase-color-1    ;; colors for the two different states the topoisomerase enzyme can be in   topoisomerase-color-0   topoisomerase-color-1    ;; colors for the two different states the primase enzyme can be in   primase-color-0   primase-color-1    final-time    ;; for keeping track of the total number of mutations   total-deletion-mutations-top-strand   total-substitution-mutations-top-strand   total-correct-duplications-top-strand   total-deletion-mutations-bottom-strand   total-substitution-mutations-bottom-strand   total-correct-duplications-bottom-strand    lock-radius           ;; how far away an enzyme must be from a target interaction (with another molecule )                         ;;   for it to lock those molecules (or itself) into a confirmation state/site   mouse-drag-radius     ;; how far away a molecule must be in order for the mouse-cursor to link to it and the user to be able to drag it (with mouse-down?   molecule-step         ;; how far each molecules moves each tick   wind-angle            ;; angle of winding used for twisting up the DNA    length-of-simulation  ;; number of seconds for this simulation   time-remaining        ;; time-remaining in the simulation   current-instruction   ;; counter for keeping track of which instruction is displayed in output window   using-time-limit      ;; boolean for keeping track of whether this is a timed model run   simulation-started?   ;; boolean for keeping track of whether the simulation started   cell-divided?         ;; boolean for keeping track of whether the end of the simulation was cued   simulation-ended?     ;; boolean for keeping track of whether the end of the simulation ended   cell-message-shown?   ;; boolean for keep track of whether the cell message was shown   timer-message-shown?  ;; boolean for keeping track of whether the timer message was shown  ]  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;setup procedures;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to setup   clear-all    set polymerase-color-0    [150 150 150 150]   set polymerase-color-1    [75  200  75 200]   set polymerase-color-2    [0   255   0 220]   set polymerase-color-3    [255   0   0 220]   set nucleo-tag-color      [255 255 255 200]   set enzyme-tag-color      [255 255 255 200]   set primase-color-0       [255 255 255 150]   set primase-color-1       [255 255 255 200]   set helicase-color-1      [255 255 210 200]   set helicase-color-0      [255 255 210 150]   set topoisomerase-color-0 [210 255 255 150]   set topoisomerase-color-1 [180 255 180 220]   set nucleoside-color      [255 255 255 150]   set wound-dna-color       [255 255 255 150]   set unwound-dna-color     [255 255 255 255]   set cursor-detect-color   [255 255 255 150]   set cursor-drag-color     [255 255 255 200]   set instruction 0   set wind-angle 25   set lock-radius 0.3   set mouse-drag-radius 0.4   set molecule-step 0.025   set final-time 0   set current-instruction 0    set total-deletion-mutations-top-strand \"N/A\"   set total-substitution-mutations-top-strand  \"N/A\"   set total-correct-duplications-top-strand  \"N/A\"   set total-deletion-mutations-bottom-strand  \"N/A\"   set total-substitution-mutations-bottom-strand  \"N/A\"   set total-correct-duplications-bottom-strand  \"N/A\"    set-default-shape chromosome-builders \"empty\"   set-default-shape nucleotide-tags \"empty\"    set mouse-continuous-down? false   set simulation-started? false   set length-of-simulation 0   set using-time-limit false   set cell-divided? false   set simulation-ended? false   set cell-message-shown? false   set timer-message-shown? false   set initial-length-dna dna-strand-length    create-mouse-cursors 1 [set shape \"target\" set color [255 255 255 100] set hidden? true] ;; make turtle for mouse cursor   repeat free-nucleosides [make-a-nucleoside ] ;;make initial nucleosides   make-initial-dna-strip   make-polymerases   make-a-helicase   make-a-topoisomerase   wind-initial-dna-into-bundle   visualize-agents    initialize-length-of-time   show-instruction 1   reset-ticks end  to initialize-length-of-time   set using-time-limit (time-limit != \"none\") ;*** replaces: ifelse time-limit = \"none\"  [set using-time-limit false] [set using-time-limit true]   if time-limit = \"2 minutes\" [set length-of-simulation 120 set time-remaining 120]   if time-limit = \"5 minutes\" [set length-of-simulation 300 set time-remaining 300] end  to make-a-nucleoside   create-nucleosides 1 [     set value random-base-letter     set shape (word \"nucleoside-tri-\" value)     set color nucleoside-color     attach-nucleo-tag 0 0     setxy random-pxcor random-pycor ;*** replaces: setxy random 100 random 100 (see log for explanation)                                     ;*** removed: set heading random 360 (the heading is already random when the turtle is created)   ] end  ;; make two polymerases to make-polymerases   create-polymerases 1 [     set heading random (180 - random 20 + random 20)     setxy (((max-pxcor - min-pxcor) / 2) + 3) (max-pycor - 1)   ]   create-polymerases 1 [     set heading (90 - random 20 + random 20)     setxy (((max-pxcor - min-pxcor) / 2) - 5) (max-pycor - 1)   ]   ask polymerases [     attach-enzyme-tag 150 .85 \"polymerase\"     set locked-state 0     set shape \"polymerase-0\"     set color polymerase-color-0   ] end  to make-a-helicase   create-helicases 1 [     set shape \"helicase\"     set color helicase-color-0     set size 3.2     set heading 90     attach-enzyme-tag 150 .85 \"helicase\"     setxy (((max-pxcor - min-pxcor) / 2)) (max-pycor - 1)   ] end  to make-a-topoisomerase   create-topoisomerases 1 [     set shape \"topoisomerase\"     set locked? false     set color topoisomerase-color-0     set size 1.5     set heading -90 + random-float 10 - random-float 10     hatch 1 [set breed topoisomerases-gears set shape \"topoisomerase-gears\" create-gearline-from myself [set tie-mode \"fixed\" set hidden? true tie]]     attach-enzyme-tag 150 .85 \"topoisomerase\"     setxy (((max-pxcor - min-pxcor) / 2) - 3) (max-pycor - 1)   ] end  ;; primase is attached to the very first nucleotide in the initial DNA strand to make-and-attach-a-primase   hatch 1 [     set breed primases     set shape \"primase\"     set color primase-color-0     set size 1.7     set heading -13     fd 1.1     create-gearline-from myself [set tie-mode \"fixed\" set hidden? true tie]     attach-enzyme-tag 100 0 \"primase\"   ] end  to make-initial-dna-strip   let last-nucleotide-top-strand nobody   let last-nucleotide-bottom-strand nobody   let place-counter 0   let first-base-pair-value \"\"   let is-this-the-first-base? true   create-turtles 1 [set breed chromosome-builders set heading 90 fd 1 ]    ask chromosome-builders [     repeat initial-length-dna [       set place-counter place-counter + 1       hatch 1 [         set breed nucleotides         set value random-base-letter         set first-base-pair-value value         set shape (word \"nucleotide-\" value)         set heading 0         set class \"original-dna-top\"         set unwound? true         set color unwound-dna-color         set place place-counter         set unzipped-stage 0         attach-nucleo-tag 5 0.5         if last-nucleotide-top-strand != nobody [create-backbone-to last-nucleotide-top-strand [set hidden? true tie]]         set last-nucleotide-top-strand self         if is-this-the-first-base? [make-and-attach-a-primase]         set is-this-the-first-base? false          ;; make complementary base side         hatch 1 [     ;*** removed \"if true\", which was probably a left over from some experimentation...           rt 180           set value complementary-base first-base-pair-value  ;; this second base pair value is based on the first base pair value           set shape (word \"nucleotide-\" value)           set class \"original-dna-bottom\"           create-old-stair-with last-nucleotide-top-strand [set hidden? false]           attach-nucleo-tag 175 0.7           if last-nucleotide-bottom-strand != nobody [create-backbone-to last-nucleotide-bottom-strand [set hidden? true tie]]           set last-nucleotide-bottom-strand self         ]       ]       fd .45     ]     die ;; remove the chromosome builder (a temporary construction turtle)   ] end  ;; fine tuned placement of the location of a label for a nucleoside or nucleotide to attach-nucleo-tag [direction displacement]   hatch 1 [     set heading direction     fd displacement     set breed nucleotide-tags     set label value     set size 0.1     set color nucleo-tag-color     create-tagline-with myself [set tie-mode \"fixed\" set hidden? true tie]   ] end  ;; fine tuned placement of the location of a label for any enzyme to attach-enzyme-tag [direction displacement label-value]   hatch 1 [     set heading direction     fd displacement     set breed enzyme-tags     set shape \"empty\"     set label label-value     set color enzyme-tag-color     set size 0.1     create-tagline-with myself [set tie-mode \"fixed\" set hidden? true tie]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;; runtime procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to go   ;; run if the timer is being used and time remains, or if the timer is not being used and the cell division has not been cued by the user   if ((using-time-limit and time-remaining > 0) or (not using-time-limit and not cell-divided?)) [     check-timer     move-free-molecules     clean-up-free-phosphates     refill-or-remove-nucleosides     unzip-nucleotides     detect-mouse-selection-event     lock-polymerase-to-one-nucleotide     lock-topoisomerase-to-wound-primase     if all-base-pairs-unwound? [separate-base-pairs] ;; only check base pair separation once all base pairs are unwound     visualize-agents     tick   ]   if (cell-divided? and not cell-message-shown?) [     if final-time = 0 [ set final-time timer ]  ;; record final time     calculate-mutations     user-message (word \"You have cued the cell division.  Let\'s see how you did in replicating \"       \"an exact copy of the DNA.\")     user-message user-message-string-for-mutations     set cell-message-shown? true   ]   if ((using-time-limit and time-remaining <= 0) and not timer-message-shown?) [     if final-time = 0 [ set final-time length-of-simulation ]  ;; record final time     calculate-mutations     user-message (word \"The timer has expired.  Let\'s see how you did in replicating \"       \"an exact copy of it.\")     user-message  user-message-string-for-mutations     set timer-message-shown? true   ] end  to check-timer   if not simulation-started? [     set simulation-started? true     reset-timer   ]   if using-time-limit [set time-remaining (length-of-simulation - timer)] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;; visualization procedures ;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to visualize-agents   ask enzyme-tags      [ set hidden? not enzyme-labels?]   ask nucleotide-tags  [ set hidden? not nucleo-labels?]   ask topoisomerases [     ;; spin at different speeds depending if you are locked into the primase location     ifelse locked?       [ask topoisomerases-gears [lt 10 set color topoisomerase-color-1]]       [ask topoisomerases-gears [lt 3  set color topoisomerase-color-0]]   ]   ask polymerases [     if locked-state = 0 [set shape \"polymerase-0\" set color polymerase-color-0]   ;; free floating polymerases not locked into a nucleotide     if locked-state = 1 [set shape \"polymerase-1\" set color polymerase-color-1]   ;; polymerase ready to lock onto nearest open nucleotide (or locked on)     if locked-state = 2 [set shape \"polymerase-2\" set color polymerase-color-2]   ;; polymerase ready to gear two nucleotides together     if locked-state = 3 [set shape \"polymerase-3\" set color polymerase-color-3]   ;; polymerase will reject the nucleoside you are trying to the nucleotide   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; winding and unwinding chromosome procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to wind-initial-dna-into-bundle   repeat (initial-length-dna ) [ wind-dna ] end  to unwind-dna   let wound-nucleotides nucleotides with [not unwound?]   if any? wound-nucleotides [     let max-wound-place max [place] of wound-nucleotides     ask wound-nucleotides with [place = max-wound-place] [       lt wind-angle  ;; left turn unwinds, right turn winds       set unwound? true       set color unwound-dna-color       display     ]   ] end  to wind-dna   let unwound-nucleotides nucleotides with [unwound? and class != \"copy-of-dna-bottom\" and class != \"copy-of-dna-top\"]   if any? unwound-nucleotides [     let min-unwound-place min [place] of unwound-nucleotides     ask unwound-nucleotides with [place = min-unwound-place  ] [       rt wind-angle  ;; right turn winds, left turn unwinds       set unwound? false       set color wound-dna-color     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; procedures for zipping & unzipping DNA strand ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to unzip-nucleotides   let were-any-nucleotides-unzipped-further? false    ask nucleotides with [next-nucleotide-unzipped-the-same? and unzipped-stage > 0] [     let fractional-separation (unzipped-stage / 2)  ;; every unzipped stage will increment the fractional separation by 1/2 of a patch width     if unzipped-stage = 3 [ask my-old-stairs [die] ask my-out-backbones [die] ]  ;; break the linking between the nucleotide bases (the stairs of the staircase)     if unzipped-stage = 1 [ask my-out-backbones [untie]]                         ;; break the sugar backbone of the DNA strand     if unzipped-stage > 0 and unzipped-stage < 4 [       set unzipped-stage unzipped-stage + 1       set were-any-nucleotides-unzipped-further? true                            ;; if any nucleotide was unzipped partially this stage       if class = \"original-dna-top\"      [set ycor fractional-separation  ]      ;; move upward       if class = \"original-dna-bottom\"   [set ycor -1 * fractional-separation ]  ;; move downward     ]   ]   ask helicases [     ifelse were-any-nucleotides-unzipped-further? [set shape \"helicase-expanded\" ][set shape \"helicase\" ]  ;; show shape change in this enzyme   ] end  to separate-base-pairs   let lowest-place 0   ask helicases  [     let this-helicase self     let unzipped-nucleotides nucleotides with [unzipped-stage = 0]     if any? unzipped-nucleotides [ set lowest-place min-one-of unzipped-nucleotides [place] ]  ;; any unzipped nucleotides     let available-nucleotides unzipped-nucleotides  with [distance this-helicase < 1  and are-previous-nucleotides-unzipped?]     if any? available-nucleotides [       let lowest-value-nucleotide min-one-of available-nucleotides [place]       ask lowest-value-nucleotide [         let base self         let base-place place         let other-base other nucleotides with [place = base-place]         if any? other-base  [           set unzipped-stage 1           ask other-base [set unzipped-stage 1]         ]       ]     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; procedures for adding and removing nucleosides and free phosphates and moving everything around ;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to move-free-molecules   let all-molecules (turtle-set nucleosides phosphates polymerases helicases topoisomerases)   ask all-molecules [     if not being-dragged-by-cursor? [       ;; only move the molecules that aren\'t being dragged by the users mouse cursor (during mouse-down?)       fd molecule-step     ]   ] end  to clean-up-free-phosphates   ask phosphates [ if pxcor = min-pxcor or pxcor = max-pxcor or pycor = min-pycor or pycor = max-pycor [die]]  ;; get rid of phosphates at the edge of the screen end  to refill-or-remove-nucleosides   if count nucleosides < free-nucleosides [make-a-nucleoside]   if count nucleosides > free-nucleosides [ask one-of nucleosides [ask tagline-neighbors [die] die]]  ;; get rid of label tags too end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; procedures for setting polymerase states, aligning nucleosides to nucleotides & linking them  ;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to lock-polymerase-to-one-nucleotide   let target-xcor 0   let target-ycor 0   let target-class \"\"    ask polymerases  [     let nucleosides-ready-to-gear-to-polymerase nobody     let potential-nucleoside-ready-to-gear-to-polymerase nobody     let target-nucleotide-ready-to-gear-to-polymerase nobody     set nucleosides-ready-to-gear-to-polymerase nucleosides with [distance myself < lock-radius]  ;; find  nucleosides floating nearby     if count nucleosides-ready-to-gear-to-polymerase > 1 [       set potential-nucleoside-ready-to-gear-to-polymerase min-one-of nucleosides-ready-to-gear-to-polymerase [distance myself]     ]     if count nucleosides-ready-to-gear-to-polymerase = 1 [       set potential-nucleoside-ready-to-gear-to-polymerase nucleosides-ready-to-gear-to-polymerase     ]     let nucleotides-ready-to-gear-to-polymerase nucleotides with [       ;; nearby nucleotides (different than nucleosides) that are not stair lined to any other nucleotides       not any? my-old-stairs and not any? my-new-stairs and (class = \"original-dna-bottom\" or class = \"original-dna-top\") and distance myself < lock-radius     ]      if any? nucleotides-ready-to-gear-to-polymerase and all-base-pairs-unwound? and not being-dragged-by-cursor? [       set target-nucleotide-ready-to-gear-to-polymerase min-one-of nucleotides-ready-to-gear-to-polymerase [distance myself]       set target-xcor   [xcor] of target-nucleotide-ready-to-gear-to-polymerase       set target-ycor   [ycor] of target-nucleotide-ready-to-gear-to-polymerase       set target-class [class] of target-nucleotide-ready-to-gear-to-polymerase       setxy target-xcor target-ycor     ]      if not any? nucleotides-ready-to-gear-to-polymerase or any? other polymerases-here [set locked-state 0]   ;; if no open nucleotide are present then no gearing     if any? nucleotides-ready-to-gear-to-polymerase and       all-base-pairs-unwound? and       potential-nucleoside-ready-to-gear-to-polymerase = nobody and       not any? other polymerases-here [       ;; if an open nucleotide is present but no nucleosides       set locked-state 1     ]     if target-nucleotide-ready-to-gear-to-polymerase != nobody and       all-base-pairs-unwound?       and potential-nucleoside-ready-to-gear-to-polymerase != nobody       and not any? other polymerases-here [       set locked-state 2   ;; if an open nucleotide is present and a nucleosides is present        ifelse (         (would-these-nucleotides-pair-correctly? target-nucleotide-ready-to-gear-to-polymerase potential-nucleoside-ready-to-gear-to-polymerase) or         (substitutions?)       ) [         ask potential-nucleoside-ready-to-gear-to-polymerase  [           ask my-in-cursor-drags  [die]           ask tagline-neighbors [die]           set breed nucleotides           set shape (word \"nucleotide-\"  value)           set unwound? true           if target-class = \"original-dna-top\"     [ set heading 180 set class \"copy-of-dna-bottom\" attach-nucleo-tag 175 0.7]           if target-class = \"original-dna-bottom\"  [ set heading 0 set class \"copy-of-dna-top\" attach-nucleo-tag 5 0.5]           setxy target-xcor target-ycor           break-off-phosphates-from-nucleoside           create-new-stair-with target-nucleotide-ready-to-gear-to-polymerase [set hidden? false tie]         ]       ]       [ ;; if an open nucleotide is present, and a nucleoside is present, but it is not the correct nucleosides to pair         set locked-state 3       ]     ]   ] end  to break-off-phosphates-from-nucleoside   hatch 1 [     set breed phosphates     set shape \"phosphate-pair\"     set heading random 360   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; setting locking topoisomerases onto primase ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to lock-topoisomerase-to-wound-primase   let target-xcor 0   let target-ycor 0   let target-class \"\"   let wound-nucleotides  nucleotides with [not unwound?]   ask topoisomerases  [     ifelse any? wound-nucleotides [       let target-primases-ready-to-gear-to-topoisomerase primases  with [distance myself < lock-radius ]       ifelse any? target-primases-ready-to-gear-to-topoisomerase [         let target-primase-ready-to-gear-to-topoisomerase one-of target-primases-ready-to-gear-to-topoisomerase         set locked? true         if not mouse-down? [           unwind-dna           ask my-in-cursor-drags  [die]           set target-xcor   [xcor] of target-primase-ready-to-gear-to-topoisomerase           set target-ycor   [ycor] of target-primase-ready-to-gear-to-topoisomerase           setxy target-xcor target-ycor         ]       ]       [         set locked? false       ]     ]     [       set locked? false     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;; statistics ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to calculate-mutations   set total-deletion-mutations-top-strand 0   set total-substitution-mutations-top-strand 0   set total-correct-duplications-top-strand 0   set total-deletion-mutations-bottom-strand 0   set total-substitution-mutations-bottom-strand 0   set total-correct-duplications-bottom-strand 0    let original-nucleotides nucleotides with [class = \"original-dna-top\" ]   ask original-nucleotides [     if not any? my-new-stairs [set total-deletion-mutations-top-strand total-deletion-mutations-top-strand + 1]     if count my-new-stairs >= 1 [       ifelse is-this-nucleotide-paired-correctly?         [set total-correct-duplications-top-strand total-correct-duplications-top-strand + 1]         [set total-substitution-mutations-top-strand total-substitution-mutations-top-strand + 1]     ]   ]    set original-nucleotides nucleotides with [class = \"original-dna-bottom\" ]   ask original-nucleotides [     if not any? my-new-stairs [set total-deletion-mutations-bottom-strand total-deletion-mutations-bottom-strand + 1]     if count my-new-stairs >= 1 [       ifelse is-this-nucleotide-paired-correctly?         [set total-correct-duplications-bottom-strand total-correct-duplications-bottom-strand + 1]         [set total-substitution-mutations-bottom-strand total-substitution-mutations-bottom-strand + 1]     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;mouse cursor detection ;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to detect-mouse-selection-event   let p-mouse-xcor mouse-xcor   let p-mouse-ycor mouse-ycor   let current-mouse-down? mouse-down?   let target-turtle nobody   let current-mouse-inside? mouse-inside?   ask mouse-cursors [     setxy p-mouse-xcor p-mouse-ycor     ;;;;;;  cursor visualization ;;;;;;;;;;;;     set hidden? true     let all-moveable-molecules (turtle-set nucleosides polymerases helicases topoisomerases)     let draggable-molecules all-moveable-molecules with [not being-dragged-by-cursor? and distance myself <= mouse-drag-radius]      ;; when mouse button has not been down and you are hovering over a draggable molecules - then the mouse cursor appears and is rotating     if not current-mouse-down? and mouse-inside? and (any? draggable-molecules) [ set color cursor-detect-color  set hidden? false rt 4 ]     ;; when things are being dragged the mouse cursor is a different color and it is not rotating     if is-this-cursor-dragging-anything? and mouse-inside? [ set color cursor-drag-color set hidden? false]      if not mouse-continuous-down? and current-mouse-down? and not is-this-cursor-dragging-anything? and any? draggable-molecules [       set target-turtle min-one-of draggable-molecules  [distance myself]       ask target-turtle [setxy p-mouse-xcor p-mouse-ycor]       create-cursor-drag-to target-turtle [ set hidden? false tie ]     ] ;; create-link from cursor to one of the target turtles.  These links are called cursor-drags     if (not current-mouse-down? ) [ask my-out-cursor-drags  [die] ] ;; remove all drag links   ]   ifelse current-mouse-down? and mouse-down? [set mouse-continuous-down? true][set mouse-continuous-down? false] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; reporters ;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to-report random-base-letter   let r random 4   let letter-to-report \"\"   if r = 0 [set letter-to-report \"A\"]   if r = 1 [set letter-to-report \"G\"]   if r = 2 [set letter-to-report \"T\"]   if r = 3 [set letter-to-report \"C\"]   report letter-to-report end  to-report complementary-base [base]   let base-to-report \"\"   if base = \"A\" [set base-to-report \"T\"]   if base = \"T\" [set base-to-report \"A\"]   if base = \"G\" [set base-to-report \"C\"]   if base = \"C\" [set base-to-report \"G\"]   report base-to-report end  to-report time-remaining-to-display   ifelse using-time-limit [report time-remaining][report \"\"] end  to-report is-this-cursor-dragging-anything?   ifelse (any? out-cursor-drag-neighbors) [report true][report false] end  to-report being-dragged-by-cursor?   ifelse any? my-in-cursor-drags [report true][report false] end  to-report all-base-pairs-unwound?   ifelse any? nucleotides with [not unwound?] [report false][report true] end  to-report would-these-nucleotides-pair-correctly? [nucleotide-1 nucleotide-2]   ifelse ( (complementary-base [value] of nucleotide-1) = item 0 [value] of nucleotide-2) [report true][report false ] end  to-report is-this-nucleotide-paired-correctly?   let original-nucleotide self   let this-stair one-of my-new-stairs   let this-paired-nucleotide nobody   let overwrite? false   ask this-stair [set this-paired-nucleotide other-end     if this-paired-nucleotide != nobody [       if [class] of this-paired-nucleotide != \"copy-of-dna-bottom\" and [class] of this-paired-nucleotide  != \"copy-of-dna-top\" [set overwrite? true];; [set     ]   ]   ifelse (value = (complementary-base [value] of this-paired-nucleotide) and not overwrite?) [report true] [report false ] end  to-report next-nucleotide-unzipped-the-same?   let my-unzipped-stage unzipped-stage   let my-place place   let my-class class   let next-nucleotides-available nucleotides with [class = my-class and place = (my-place + 1) and unzipped-stage = my-unzipped-stage]   let can-continue-to-unzip? false   ifelse my-place < dna-strand-length [     ifelse any? next-nucleotides-available and are-previous-nucleotides-unzipped?;;; is another nucleotides in the next sequence in the strand     [set can-continue-to-unzip? true] [set can-continue-to-unzip? false]   ]   [set can-continue-to-unzip? true]  ;; there is no other nucleotides in the next sequence in the strand so no nucleotides will prevent the zipper from opening   report can-continue-to-unzip? end   to-report are-previous-nucleotides-unzipped?   let my-place place   let previous-nucleotides nucleotides with [place = (my-place - 1)]   let value-to-return false   ifelse not any? previous-nucleotides   [set value-to-return true]   [     let previous-nucleotides-are-unzipped previous-nucleotides  with [unzipped-stage > 0]     ifelse any? previous-nucleotides-are-unzipped [set value-to-return true] [set value-to-return false]   ]   report value-to-return end  to-report user-message-string-for-mutations   let duplication-rate  precision ( (total-correct-duplications-top-strand + total-correct-duplications-bottom-strand)  / final-time) 4   report (word \"You had \" (total-correct-duplications-top-strand + total-correct-duplications-bottom-strand)     \" correct replications and \" (total-substitution-mutations-top-strand + total-substitution-mutations-bottom-strand)     \" substitutions and \"  (total-deletion-mutations-top-strand + total-deletion-mutations-bottom-strand)  \"  deletions.\"     \" That replication process took you \" final-time \" seconds.  This was a rate of \" duplication-rate     \" correct nucleotides duplicated per second.\" ) end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;; instructions for players ;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to-report current-instruction-label   report ifelse-value current-instruction = 0     [ \"press setup\" ]     [ (word current-instruction \" / \" length instructions) ] end  to next-instruction   show-instruction current-instruction + 1 end  to previous-instruction   show-instruction current-instruction - 1 end  to show-instruction [ i ]   if i >= 1 and i <= length instructions [     set current-instruction i     clear-output     foreach item (current-instruction - 1) instructions output-print   ] end  to-report instructions   report [     [       \"You will be simulating the process\"       \"of DNA replication that occurs in\"       \"every cell in every living creature\"       \"as part of mitosis or meiosis.\"     ]     [       \"To do this you will need to complete\"       \"4 tasks in the shortest time you\"       \"can. Each of these tasks requires\"       \"you to drag a molecule using your\"       \"mouse, from one location to another.\"     ]     [       \"The 1st task will be to unwind a \"       \"twisted bundle of DNA by using your\"       \"mouse to place a topoisomerase \"       \"enzyme on top of the primase enzyme.\"     ]     [       \"The 2nd task will be to unzip the\"       \"DNA ladder structure by dragging\"       \"a helicase enzyme from the 1st \"       \"base pair to the last base pair.\"     ]     [       \"The 3rd task will be to first drag\"       \"a polymerase enzyme to an open\"       \"nucleotide and then drag a floating\"       \"nucleoside to the same location.\"     ]     [       \"The last task is to simply repeat\"       \"the previous task of connecting\"       \"nucleosides to open nucleotides\" ;       \"until as much of the DNA as\"       \"possible has been replicated.\"     ]     [       \"The simulation ends either when\"       \"the timer runs out (if the timer?\"       \"chooser is set to YES) or when you\"       \"press the DIVIDE THE CELL button\"     ]   ] end   ; Copyright 2012 Uri Wilensky. ; See Info tab for full copyright and license.')([{"x":330,"y":10,"width":858,"height":509,"dimensions":{"minPxcor":0,"maxPxcor":16,"minPycor":-5,"maxPycor":4,"patchSize":50,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":14,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup\"); if (R === StopInterrupt) { return R; }","source":"setup","x":4,"y":10,"width":70,"height":34,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 1; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 30; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 1; })","variable":"dna-strand-length","x":4,"y":46,"width":148,"height":33,"oldSize":true,"display":"dna-strand-length","min":"1","max":"30","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"nucleo-labels?","x":5,"y":116,"width":146,"height":33,"oldSize":true,"display":"nucleo-labels?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","x":75,"y":10,"width":77,"height":33,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"enzyme-labels?","x":5,"y":81,"width":146,"height":33,"oldSize":true,"display":"enzyme-labels?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"total-deletion-mutations-top-strand\"); })","source":"total-deletion-mutations-top-strand","x":15,"y":255,"width":132,"height":45,"oldSize":true,"display":"# deletions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"total-substitution-mutations-top-strand\"); })","source":"total-substitution-mutations-top-strand","x":15,"y":298,"width":131,"height":45,"oldSize":true,"display":"# substitutions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Top Strand","x":38,"y":192,"width":109,"height":18,"fontSize":13,"markdown":false,"textColorLight":"-16777216","backgroundLight":"0","backgroundDark":"0","type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"total-correct-duplications-top-strand\"); })","source":"total-correct-duplications-top-strand","x":15,"y":211,"width":132,"height":45,"oldSize":true,"display":"# correct duplications","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"substitutions?","x":170,"y":10,"width":135,"height":33,"oldSize":true,"display":"substitutions?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"ProcedurePrims.rng.withAux(function() { return 0; })","compiledMax":"ProcedurePrims.rng.withAux(function() { return 200; })","compiledStep":"ProcedurePrims.rng.withAux(function() { return 1; })","variable":"free-nucleosides","x":171,"y":47,"width":134,"height":33,"oldSize":true,"display":"free-nucleosides","min":"0","max":"200","default":50,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"total-correct-duplications-bottom-strand\"); })","source":"total-correct-duplications-bottom-strand","x":170,"y":210,"width":135,"height":45,"oldSize":true,"display":"# correct duplications","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"total-deletion-mutations-bottom-strand\"); })","source":"total-deletion-mutations-bottom-strand","x":170,"y":254,"width":135,"height":45,"oldSize":true,"display":"# deletions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return world.observer.getGlobal(\"total-substitution-mutations-bottom-strand\"); })","source":"total-substitution-mutations-bottom-strand","x":170,"y":297,"width":135,"height":45,"oldSize":true,"display":"# substitutions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Bottom Strand","x":192,"y":191,"width":105,"height":18,"fontSize":13,"markdown":false,"textColorLight":"-16777216","backgroundLight":"0","backgroundDark":"0","type":"textBox","compilation":{"success":true,"messages":[]}}, {"x":5,"y":345,"width":320,"height":147,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"variable":"time-limit","x":169,"y":85,"width":135,"height":45,"oldSize":true,"display":"time-limit","choices":["none","2 minutes","5 minutes"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return PrimChecks.procedure.callReporter(49, 74, \"time-remaining-to-display\"); })","source":"time-remaining-to-display","x":169,"y":134,"width":135,"height":45,"oldSize":true,"display":"time remaining","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.setGlobal(\"cell-divided?\", true); world.observer.setGlobal(\"cell-message-shown?\", false);","source":"set cell-divided? true set cell-message-shown? false","x":5,"y":150,"width":145,"height":34,"display":"divide the cell","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"ProcedurePrims.rng.withAux(function() { return PrimChecks.procedure.callReporter(49, 74, \"current-instruction-label\"); })","source":"current-instruction-label","x":130,"y":495,"width":90,"height":45,"oldSize":true,"display":"instruction","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"next-instruction\"); if (R === StopInterrupt) { return R; }","source":"next-instruction","x":220,"y":495,"width":105,"height":45,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"previous-instruction\"); if (R === StopInterrupt) { return R; }","source":"previous-instruction","x":5,"y":495,"width":125,"height":45,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit", "initial-length-dna", "mouse-continuous-down?", "instruction", "cursor-detect-color", "cursor-drag-color", "wound-dna-color", "unwound-dna-color", "nucleo-tag-color", "enzyme-tag-color", "nucleoside-color", "polymerase-color-0", "polymerase-color-1", "polymerase-color-2", "polymerase-color-3", "helicase-color-0", "helicase-color-1", "topoisomerase-color-0", "topoisomerase-color-1", "primase-color-0", "primase-color-1", "final-time", "total-deletion-mutations-top-strand", "total-substitution-mutations-top-strand", "total-correct-duplications-top-strand", "total-deletion-mutations-bottom-strand", "total-substitution-mutations-bottom-strand", "total-correct-duplications-bottom-strand", "lock-radius", "mouse-drag-radius", "molecule-step", "wind-angle", "length-of-simulation", "time-remaining", "current-instruction", "using-time-limit", "simulation-started?", "cell-divided?", "simulation-ended?", "cell-message-shown?", "timer-message-shown?"], ["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit"], [], 0, 16, -5, 4, 50, true, true, turtleShapes, linkShapes, function(){});
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
ProcedurePrims.defineCommand("setup", 7160, 9219, (function() {
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
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, "MOUSE-CURSORS"), function() {
    PrimChecks.turtleOrLink.setVariable(8853, 8858, "shape", "target");
    PrimChecks.turtleOrLink.setVariable(8872, 8877, "color", [255, 255, 255, 100]);
    PrimChecks.turtleOrLink.setVariable(8900, 8907, "hidden?", true);
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(8825, 8845, R); return R; }
  for (let _index_8948_8954 = 0, _repeatcount_8948_8954 = StrictMath.floor(world.observer.getGlobal("free-nucleosides")); _index_8948_8954 < _repeatcount_8948_8954; _index_8948_8954++) {
    var R = ProcedurePrims.callCommand("make-a-nucleoside"); if (R === DeathInterrupt) { return R; }
  }
  var R = ProcedurePrims.callCommand("make-initial-dna-strip"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("make-polymerases"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("make-a-helicase"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("make-a-topoisomerase"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("wind-initial-dna-into-bundle"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("visualize-agents"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("initialize-length-of-time"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("show-instruction", 1); if (R === DeathInterrupt) { return R; }
  world.ticker.reset();
}))
ProcedurePrims.defineCommand("initialize-length-of-time", 9227, 9567, (function() {
  world.observer.setGlobal("using-time-limit", !Prims.equality(world.observer.getGlobal("time-limit"), "none"));
  if (Prims.equality(world.observer.getGlobal("time-limit"), "2 minutes")) {
    world.observer.setGlobal("length-of-simulation", 120);
    world.observer.setGlobal("time-remaining", 120);
  }
  if (Prims.equality(world.observer.getGlobal("time-limit"), "5 minutes")) {
    world.observer.setGlobal("length-of-simulation", 300);
    world.observer.setGlobal("time-remaining", 300);
  }
}))
ProcedurePrims.defineCommand("make-a-nucleoside", 9575, 9994, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, "NUCLEOSIDES"), function() {
    PrimChecks.turtle.setVariable(9626, 9631, "value", PrimChecks.procedure.callReporter(9632, 9650, "random-base-letter"));
    PrimChecks.turtleOrLink.setVariable(9659, 9664, "shape", StringPrims.word("nucleoside-tri-", PrimChecks.turtle.getVariable(9689, 9694, "value")));
    PrimChecks.turtleOrLink.setVariable(9704, 9709, "color", world.observer.getGlobal("nucleoside-color"));
    var R = ProcedurePrims.callCommand("attach-nucleo-tag", 0, 0); if (R === DeathInterrupt) { return R; }
    PrimChecks.turtle.setXY(9757, 9762, RandomPrims.randomInRange(world.topology.minPxcor, world.topology.maxPxcor), RandomPrims.randomInRange(world.topology.minPycor, world.topology.maxPycor));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(9595, 9613, R); return R; }
}))
ProcedurePrims.defineCommand("make-polymerases", 10026, 10475, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, "POLYMERASES"), function() {
    PrimChecks.turtle.setVariable(10076, 10083, "heading", PrimChecks.math.random(10084, 10090, PrimChecks.math.plus(10108, 10109, PrimChecks.math.minus(10096, 10097, 180, RandomPrims.randomLong(20)), RandomPrims.randomLong(20))));
    PrimChecks.turtle.setXY(10125, 10130, PrimChecks.math.plus(10162, 10163, PrimChecks.math.div(10157, 10158, PrimChecks.math.minus(10144, 10145, world.topology.maxPxcor, world.topology.minPxcor), 2), 3), PrimChecks.math.minus(10178, 10179, world.topology.maxPycor, 1));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(10045, 10063, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, "POLYMERASES"), function() {
    PrimChecks.turtle.setVariable(10220, 10227, "heading", PrimChecks.math.plus(10244, 10245, PrimChecks.math.minus(10232, 10233, 90, RandomPrims.randomLong(20)), RandomPrims.randomLong(20)));
    PrimChecks.turtle.setXY(10261, 10266, PrimChecks.math.minus(10298, 10299, PrimChecks.math.div(10293, 10294, PrimChecks.math.minus(10280, 10281, world.topology.maxPxcor, world.topology.minPxcor), 2), 5), PrimChecks.math.minus(10314, 10315, world.topology.maxPycor, 1));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(10189, 10207, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("POLYMERASES"), function() {
    var R = ProcedurePrims.callCommand("attach-enzyme-tag", 150, 0.85, "polymerase"); if (R === DeathInterrupt) { return R; }
    PrimChecks.turtle.setVariable(10394, 10406, "locked-state", 0);
    PrimChecks.turtleOrLink.setVariable(10417, 10422, "shape", "polymerase-0");
    PrimChecks.turtleOrLink.setVariable(10446, 10451, "color", world.observer.getGlobal("polymerase-color-0"));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(10325, 10328, R); return R; }
}))
ProcedurePrims.defineCommand("make-a-helicase", 10483, 10717, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, "HELICASES"), function() {
    PrimChecks.turtleOrLink.setVariable(10530, 10535, "shape", "helicase");
    PrimChecks.turtleOrLink.setVariable(10555, 10560, "color", world.observer.getGlobal("helicase-color-0"));
    PrimChecks.turtle.setVariable(10586, 10590, "size", 3.2);
    PrimChecks.turtle.setVariable(10603, 10610, "heading", 90);
    var R = ProcedurePrims.callCommand("attach-enzyme-tag", 150, 0.85, "helicase"); if (R === DeathInterrupt) { return R; }
    PrimChecks.turtle.setXY(10659, 10664, PrimChecks.math.div(10691, 10692, PrimChecks.math.minus(10678, 10679, world.topology.maxPxcor, world.topology.minPxcor), 2), PrimChecks.math.minus(10708, 10709, world.topology.maxPycor, 1));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(10501, 10517, R); return R; }
}))
ProcedurePrims.defineCommand("make-a-topoisomerase", 10725, 11196, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, "TOPOISOMERASES"), function() {
    PrimChecks.turtleOrLink.setVariable(10782, 10787, "shape", "topoisomerase");
    PrimChecks.turtle.setVariable(10812, 10819, "locked?", false);
    PrimChecks.turtleOrLink.setVariable(10834, 10839, "color", world.observer.getGlobal("topoisomerase-color-0"));
    PrimChecks.turtle.setVariable(10870, 10874, "size", 1.5);
    PrimChecks.turtle.setVariable(10887, 10894, "heading", PrimChecks.math.minus(10917, 10918, PrimChecks.math.plus(10899, 10900, -90, PrimChecks.math.randomFloat(10)), PrimChecks.math.randomFloat(10)));
    var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
      PrimChecks.turtleOrLink.setVariable(10952, 10957, "breed", world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS"));
      PrimChecks.turtleOrLink.setVariable(10983, 10988, "shape", "topoisomerase-gears");
      var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(SelfManager.myself(), "GEARLINES"), function() {
        PrimChecks.link.setVariable(11044, 11052, "tie-mode", "fixed");
        PrimChecks.turtleOrLink.setVariable(11065, 11072, "hidden?", true);
        SelfManager.self().tie();
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(11011, 11031, R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(10939, 10944, R); return R; }
    var R = ProcedurePrims.callCommand("attach-enzyme-tag", 150, 0.85, "topoisomerase"); if (R === DeathInterrupt) { return R; }
    PrimChecks.turtle.setXY(11134, 11139, PrimChecks.math.minus(11171, 11172, PrimChecks.math.div(11166, 11167, PrimChecks.math.minus(11153, 11154, world.topology.maxPxcor, world.topology.minPxcor), 2), 3), PrimChecks.math.minus(11187, 11188, world.topology.maxPycor, 1));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(10748, 10769, R); return R; }
}))
ProcedurePrims.defineCommand("make-and-attach-a-primase", 11282, 11563, (function() {
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    PrimChecks.turtleOrLink.setVariable(11328, 11333, "breed", world.turtleManager.turtlesOfBreed("PRIMASES"));
    PrimChecks.turtleOrLink.setVariable(11351, 11356, "shape", "primase");
    PrimChecks.turtleOrLink.setVariable(11375, 11380, "color", world.observer.getGlobal("primase-color-0"));
    PrimChecks.turtle.setVariable(11405, 11409, "size", 1.7);
    PrimChecks.turtle.setVariable(11422, 11429, "heading", -13);
    SelfManager.self().fd(1.1);
    var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(SelfManager.myself(), "GEARLINES"), function() {
      PrimChecks.link.setVariable(11482, 11490, "tie-mode", "fixed");
      PrimChecks.turtleOrLink.setVariable(11503, 11510, "hidden?", true);
      SelfManager.self().tie();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(11449, 11469, R); return R; }
    var R = ProcedurePrims.callCommand("attach-enzyme-tag", 100, 0, "primase"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(11310, 11315, R); return R; }
}))
ProcedurePrims.defineCommand("make-initial-dna-strip", 11571, 13381, (function() {
  let lastHnucleotideHtopHstrand = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("LAST-NUCLEOTIDE-TOP-STRAND", lastHnucleotideHtopHstrand);
  let lastHnucleotideHbottomHstrand = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("LAST-NUCLEOTIDE-BOTTOM-STRAND", lastHnucleotideHbottomHstrand);
  let placeHcounter = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("PLACE-COUNTER", placeHcounter);
  let firstHbaseHpairHvalue = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("FIRST-BASE-PAIR-VALUE", firstHbaseHpairHvalue);
  let IS_HthisHtheHfirstHbase_Q = true; ProcedurePrims.stack().currentContext().registerStringRunVar("IS-THIS-THE-FIRST-BASE?", IS_HthisHtheHfirstHbase_Q);
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, ""), function() {
    PrimChecks.turtleOrLink.setVariable(11789, 11794, "breed", world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS"));
    PrimChecks.turtle.setVariable(11819, 11826, "heading", 90);
    SelfManager.self()._optimalFdOne();
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(11767, 11781, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS"), function() {
    for (let _index_11870_11876 = 0, _repeatcount_11870_11876 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_11870_11876 < _repeatcount_11870_11876; _index_11870_11876++) {
      placeHcounter = PrimChecks.math.plus(11936, 11937, PrimChecks.validator.checkArg('+', 11936, 11937, 1, placeHcounter), 1); ProcedurePrims.stack().currentContext().updateStringRunVar("PLACE-COUNTER", placeHcounter);
      var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
        PrimChecks.turtleOrLink.setVariable(11968, 11973, "breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
        PrimChecks.turtle.setVariable(11998, 12003, "value", PrimChecks.procedure.callReporter(12004, 12022, "random-base-letter"));
        firstHbaseHpairHvalue = PrimChecks.turtle.getVariable(12057, 12062, "value"); ProcedurePrims.stack().currentContext().updateStringRunVar("FIRST-BASE-PAIR-VALUE", firstHbaseHpairHvalue);
        PrimChecks.turtleOrLink.setVariable(12075, 12080, "shape", StringPrims.word("nucleotide-", PrimChecks.turtle.getVariable(12101, 12106, "value")));
        PrimChecks.turtle.setVariable(12120, 12127, "heading", 0);
        PrimChecks.turtle.setVariable(12142, 12147, "class", "original-dna-top");
        PrimChecks.turtle.setVariable(12179, 12187, "unwound?", true);
        PrimChecks.turtleOrLink.setVariable(12205, 12210, "color", world.observer.getGlobal("unwound-dna-color"));
        PrimChecks.turtle.setVariable(12241, 12246, "place", placeHcounter);
        PrimChecks.turtle.setVariable(12273, 12287, "unzipped-stage", 0);
        var R = ProcedurePrims.callCommand("attach-nucleo-tag", 5, 0.5); if (R === DeathInterrupt) { return R; }
        if (!Prims.equality(lastHnucleotideHtopHstrand, Nobody)) {
          var R = ProcedurePrims.ask(LinkPrims.createLinkTo(lastHnucleotideHtopHstrand, "BACKBONES"), function() {
            PrimChecks.turtleOrLink.setVariable(12422, 12429, "hidden?", true);
            SelfManager.self().tie();
          }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(12371, 12389, R); return R; }
        }
        lastHnucleotideHtopHstrand = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("LAST-NUCLEOTIDE-TOP-STRAND", lastHnucleotideHtopHstrand);
        if (IS_HthisHtheHfirstHbase_Q) {
          var R = ProcedurePrims.callCommand("make-and-attach-a-primase"); if (R === DeathInterrupt) { return R; }
        }
        IS_HthisHtheHfirstHbase_Q = false; ProcedurePrims.stack().currentContext().updateStringRunVar("IS-THIS-THE-FIRST-BASE?", IS_HthisHtheHfirstHbase_Q);
        var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
          SelfManager.self().right(180);
          PrimChecks.turtle.setVariable(12768, 12773, "value", PrimChecks.procedure.callReporter(12774, 12792, "complementary-base", firstHbaseHpairHvalue));
          PrimChecks.turtleOrLink.setVariable(12899, 12904, "shape", StringPrims.word("nucleotide-", PrimChecks.turtle.getVariable(12925, 12930, "value")));
          PrimChecks.turtle.setVariable(12946, 12951, "class", "original-dna-bottom");
          var R = ProcedurePrims.ask(LinkPrims.createLinkWith(lastHnucleotideHtopHstrand, "OLD-STAIRS"), function() { PrimChecks.turtleOrLink.setVariable(13038, 13045, "hidden?", false); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(12984, 13005, R); return R; }
          var R = ProcedurePrims.callCommand("attach-nucleo-tag", 175, 0.7); if (R === DeathInterrupt) { return R; }
          if (!Prims.equality(lastHnucleotideHbottomHstrand, Nobody)) {
            var R = ProcedurePrims.ask(LinkPrims.createLinkTo(lastHnucleotideHbottomHstrand, "BACKBONES"), function() {
              PrimChecks.turtleOrLink.setVariable(13197, 13204, "hidden?", true);
              SelfManager.self().tie();
            }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(13143, 13161, R); return R; }
          }
          lastHnucleotideHbottomHstrand = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("LAST-NUCLEOTIDE-BOTTOM-STRAND", lastHnucleotideHbottomHstrand);
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(12639, 12644, R); return R; }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(11946, 11951, R); return R; }
      SelfManager.self()._optimalFdLessThan1(0.45);
    }
    return SelfManager.self().die();
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(11840, 11843, R); return R; }
}))
ProcedurePrims.defineCommand("attach-nucleo-tag", 13471, 13749, (function(direction, displacement) {
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    PrimChecks.turtle.setVariable(13534, 13541, "heading", direction);
    SelfManager.self().fd(displacement);
    PrimChecks.turtleOrLink.setVariable(13580, 13585, "breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDE-TAGS"));
    PrimChecks.turtleOrLink.setVariable(13610, 13615, "label", PrimChecks.turtle.getVariable(13616, 13621, "value"));
    PrimChecks.turtle.setVariable(13630, 13634, "size", 0.1);
    PrimChecks.turtleOrLink.setVariable(13647, 13652, "color", world.observer.getGlobal("nucleo-tag-color"));
    var R = ProcedurePrims.ask(LinkPrims.createLinkWith(SelfManager.myself(), "TAGLINES"), function() {
      PrimChecks.link.setVariable(13706, 13714, "tie-mode", "fixed");
      PrimChecks.turtleOrLink.setVariable(13727, 13734, "hidden?", true);
      SelfManager.self().tie();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(13674, 13693, R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(13516, 13521, R); return R; }
}))
ProcedurePrims.defineCommand("attach-enzyme-tag", 13823, 14137, (function(direction, displacement, labelHvalue) {
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    PrimChecks.turtle.setVariable(13898, 13905, "heading", direction);
    SelfManager.self().fd(displacement);
    PrimChecks.turtleOrLink.setVariable(13944, 13949, "breed", world.turtleManager.turtlesOfBreed("ENZYME-TAGS"));
    PrimChecks.turtleOrLink.setVariable(13970, 13975, "shape", "empty");
    PrimChecks.turtleOrLink.setVariable(13992, 13997, "label", labelHvalue);
    PrimChecks.turtleOrLink.setVariable(14018, 14023, "color", world.observer.getGlobal("enzyme-tag-color"));
    PrimChecks.turtle.setVariable(14049, 14053, "size", 0.1);
    var R = ProcedurePrims.ask(LinkPrims.createLinkWith(SelfManager.myself(), "TAGLINES"), function() {
      PrimChecks.link.setVariable(14094, 14102, "tie-mode", "fixed");
      PrimChecks.turtleOrLink.setVariable(14115, 14122, "hidden?", true);
      SelfManager.self().tie();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(14062, 14081, R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(13880, 13885, R); return R; }
}))
ProcedurePrims.defineCommand("go", 14461, 15852, (function() {
  if (((PrimChecks.validator.checkArg('AND', 14628, 14631, 2, world.observer.getGlobal("using-time-limit")) && Prims.gt(world.observer.getGlobal("time-remaining"), 0)) || (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 14656, 14659, 2, world.observer.getGlobal("using-time-limit"))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 14681, 14684, 2, world.observer.getGlobal("cell-divided?")))))) {
    var R = ProcedurePrims.callCommand("check-timer"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("move-free-molecules"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("clean-up-free-phosphates"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("refill-or-remove-nucleosides"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("unzip-nucleotides"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("detect-mouse-selection-event"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("lock-polymerase-to-one-nucleotide"); if (R === DeathInterrupt) { return R; }
    var R = ProcedurePrims.callCommand("lock-topoisomerase-to-wound-primase"); if (R === DeathInterrupt) { return R; }
    if (PrimChecks.procedure.callReporter(14945, 14968, "all-base-pairs-unwound?")) {
      var R = ProcedurePrims.callCommand("separate-base-pairs"); if (R === DeathInterrupt) { return R; }
    }
    var R = ProcedurePrims.callCommand("visualize-agents"); if (R === DeathInterrupt) { return R; }
    world.ticker.tick();
  }
  if ((PrimChecks.validator.checkArg('AND', 15112, 15115, 2, world.observer.getGlobal("cell-divided?")) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 15116, 15119, 2, world.observer.getGlobal("cell-message-shown?"))))) {
    if (Prims.equality(world.observer.getGlobal("final-time"), 0)) {
      world.observer.setGlobal("final-time", workspace.timer.elapsed());
    }
    var R = ProcedurePrims.callCommand("calculate-mutations"); if (R === DeathInterrupt) { return R; }
    UserDialogPrims.confirm(StringPrims.word("You have cued the cell division.  Let's see how you did in replicating ", "an exact copy of the DNA."));
    UserDialogPrims.confirm(PrimChecks.procedure.callReporter(15385, 15418, "user-message-string-for-mutations"));
    world.observer.setGlobal("cell-message-shown?", true);
  }
  if (((PrimChecks.validator.checkArg('AND', 15480, 15483, 2, world.observer.getGlobal("using-time-limit")) && Prims.lte(world.observer.getGlobal("time-remaining"), 0)) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 15509, 15512, 2, world.observer.getGlobal("timer-message-shown?"))))) {
    if (Prims.equality(world.observer.getGlobal("final-time"), 0)) {
      world.observer.setGlobal("final-time", world.observer.getGlobal("length-of-simulation"));
    }
    var R = ProcedurePrims.callCommand("calculate-mutations"); if (R === DeathInterrupt) { return R; }
    UserDialogPrims.confirm(StringPrims.word("The timer has expired.  Let's see how you did in replicating ", "an exact copy of it."));
    UserDialogPrims.confirm(PrimChecks.procedure.callReporter(15780, 15813, "user-message-string-for-mutations"));
    world.observer.setGlobal("timer-message-shown?", true);
  }
}))
ProcedurePrims.defineCommand("check-timer", 15860, 16030, (function() {
  if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 15877, 15880, 2, world.observer.getGlobal("simulation-started?")))) {
    world.observer.setGlobal("simulation-started?", true);
    workspace.timer.reset();
  }
  if (world.observer.getGlobal("using-time-limit")) {
    world.observer.setGlobal("time-remaining", PrimChecks.math.minus(16020, 16021, PrimChecks.validator.checkArg('-', 16020, 16021, 1, world.observer.getGlobal("length-of-simulation")), workspace.timer.elapsed()));
  }
}))
ProcedurePrims.defineCommand("visualize-agents", 16255, 17273, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("ENZYME-TAGS"), function() {
    PrimChecks.turtleOrLink.setVariable(16301, 16308, "hidden?", PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 16309, 16312, 2, world.observer.getGlobal("enzyme-labels?"))));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(16274, 16277, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("NUCLEOTIDE-TAGS"), function() {
    PrimChecks.turtleOrLink.setVariable(16358, 16365, "hidden?", PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 16366, 16369, 2, world.observer.getGlobal("nucleo-labels?"))));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(16331, 16334, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("TOPOISOMERASES"), function() {
    if (PrimChecks.turtle.getVariable(16506, 16513, "locked?")) {
      var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS"), function() {
        SelfManager.self().right(-(10));
        PrimChecks.turtleOrLink.setVariable(16557, 16562, "color", world.observer.getGlobal("topoisomerase-color-1"));
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(16521, 16524, R); return R; }
    }
    else {
      var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS"), function() {
        SelfManager.self().right(-(3));
        PrimChecks.turtleOrLink.setVariable(16630, 16635, "color", world.observer.getGlobal("topoisomerase-color-0"));
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(16594, 16597, R); return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(16388, 16391, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("POLYMERASES"), function() {
    if (Prims.equality(PrimChecks.turtle.getVariable(16691, 16703, "locked-state"), 0)) {
      PrimChecks.turtleOrLink.setVariable(16713, 16718, "shape", "polymerase-0");
      PrimChecks.turtleOrLink.setVariable(16738, 16743, "color", world.observer.getGlobal("polymerase-color-0"));
    }
    if (Prims.equality(PrimChecks.turtle.getVariable(16831, 16843, "locked-state"), 1)) {
      PrimChecks.turtleOrLink.setVariable(16853, 16858, "shape", "polymerase-1");
      PrimChecks.turtleOrLink.setVariable(16878, 16883, "color", world.observer.getGlobal("polymerase-color-1"));
    }
    if (Prims.equality(PrimChecks.turtle.getVariable(16985, 16997, "locked-state"), 2)) {
      PrimChecks.turtleOrLink.setVariable(17007, 17012, "shape", "polymerase-2");
      PrimChecks.turtleOrLink.setVariable(17032, 17037, "color", world.observer.getGlobal("polymerase-color-2"));
    }
    if (Prims.equality(PrimChecks.turtle.getVariable(17120, 17132, "locked-state"), 3)) {
      PrimChecks.turtleOrLink.setVariable(17142, 17147, "shape", "polymerase-3");
      PrimChecks.turtleOrLink.setVariable(17167, 17172, "color", world.observer.getGlobal("polymerase-color-3"));
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(16666, 16669, R); return R; }
}))
ProcedurePrims.defineCommand("wind-initial-dna-into-bundle", 17612, 17685, (function() {
  for (let _index_17643_17649 = 0, _repeatcount_17643_17649 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_17643_17649 < _repeatcount_17643_17649; _index_17643_17649++) {
    var R = ProcedurePrims.callCommand("wind-dna"); if (R === DeathInterrupt) { return R; }
  }
}))
ProcedurePrims.defineCommand("unwind-dna", 17693, 18048, (function() {
  let woundHnucleotides = PrimChecks.agentset.with(17740, 17744, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() {
    return PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 17746, 17749, 2, PrimChecks.turtle.getVariable(17750, 17758, "unwound?")));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("WOUND-NUCLEOTIDES", woundHnucleotides);
  if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 17765, 17769, 112, woundHnucleotides))) {
    let maxHwoundHplace = PrimChecks.list.max(17814, 17817, PrimChecks.validator.checkArg('MAX', 17814, 17817, 8, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 17826, 17828, 1904, woundHnucleotides), function() { return PrimChecks.turtle.getVariable(17819, 17824, "place"); }))); ProcedurePrims.stack().currentContext().registerStringRunVar("MAX-WOUND-PLACE", maxHwoundHplace);
    var R = ProcedurePrims.ask(PrimChecks.agentset.with(17873, 17877, PrimChecks.validator.checkArg('WITH', 17873, 17877, 112, woundHnucleotides), function() { return Prims.equality(PrimChecks.turtle.getVariable(17879, 17884, "place"), maxHwoundHplace); }), function() {
      SelfManager.self().right(-(world.observer.getGlobal("wind-angle")));
      PrimChecks.turtle.setVariable(17976, 17984, "unwound?", true);
      PrimChecks.turtleOrLink.setVariable(18000, 18005, "color", world.observer.getGlobal("unwound-dna-color"));
      Prims.display();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(17851, 17854, R); return R; }
  }
}))
ProcedurePrims.defineCommand("wind-dna", 18056, 18469, (function() {
  let unwoundHnucleotides = PrimChecks.agentset.with(18103, 18107, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() {
    return ((PrimChecks.validator.checkArg('AND', 18118, 18121, 2, PrimChecks.turtle.getVariable(18109, 18117, "unwound?")) && !Prims.equality(PrimChecks.turtle.getVariable(18122, 18127, "class"), "copy-of-dna-bottom")) && !Prims.equality(PrimChecks.turtle.getVariable(18156, 18161, "class"), "copy-of-dna-top"));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("UNWOUND-NUCLEOTIDES", unwoundHnucleotides);
  if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 18189, 18193, 112, unwoundHnucleotides))) {
    let minHunwoundHplace = PrimChecks.list.min(18242, 18245, PrimChecks.validator.checkArg('MIN', 18242, 18245, 8, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 18254, 18256, 1904, unwoundHnucleotides), function() { return PrimChecks.turtle.getVariable(18247, 18252, "place"); }))); ProcedurePrims.stack().currentContext().registerStringRunVar("MIN-UNWOUND-PLACE", minHunwoundHplace);
    var R = ProcedurePrims.ask(PrimChecks.agentset.with(18305, 18309, PrimChecks.validator.checkArg('WITH', 18305, 18309, 112, unwoundHnucleotides), function() { return Prims.equality(PrimChecks.turtle.getVariable(18311, 18316, "place"), minHunwoundHplace); }), function() {
      SelfManager.self().right(world.observer.getGlobal("wind-angle"));
      PrimChecks.turtle.setVariable(18412, 18420, "unwound?", false);
      PrimChecks.turtleOrLink.setVariable(18437, 18442, "color", world.observer.getGlobal("wound-dna-color"));
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(18281, 18284, R); return R; }
  }
}))
ProcedurePrims.defineCommand("unzip-nucleotides", 18808, 19992, (function() {
  let wereHanyHnucleotidesHunzippedHfurther_Q = false; ProcedurePrims.stack().currentContext().registerStringRunVar("WERE-ANY-NUCLEOTIDES-UNZIPPED-FURTHER?", wereHanyHnucleotidesHunzippedHfurther_Q);
  var R = ProcedurePrims.ask(PrimChecks.agentset.with(18896, 18900, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() {
    return (PrimChecks.validator.checkArg('AND', 18937, 18940, 2, PrimChecks.procedure.callReporter(18902, 18936, "next-nucleotide-unzipped-the-same?")) && Prims.gt(PrimChecks.turtle.getVariable(18941, 18955, "unzipped-stage"), 0));
  }), function() {
    let fractionalHseparation = PrimChecks.math.div(19009, 19010, PrimChecks.validator.checkArg('/', 19009, 19010, 1, PrimChecks.turtle.getVariable(18994, 19008, "unzipped-stage")), 2); ProcedurePrims.stack().currentContext().registerStringRunVar("FRACTIONAL-SEPARATION", fractionalHseparation);
    if (Prims.equality(PrimChecks.turtle.getVariable(19111, 19125, "unzipped-stage"), 3)) {
      var R = ProcedurePrims.ask(LinkPrims.myLinks("OLD-STAIRS"), function() { return SelfManager.self().die(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(19131, 19134, R); return R; }
      var R = ProcedurePrims.ask(LinkPrims.myOutLinks("BACKBONES"), function() { return SelfManager.self().die(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(19155, 19158, R); return R; }
    }
    if (Prims.equality(PrimChecks.turtle.getVariable(19272, 19286, "unzipped-stage"), 1)) {
      var R = ProcedurePrims.ask(LinkPrims.myOutLinks("BACKBONES"), function() { SelfManager.self().untie(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(19292, 19295, R); return R; }
    }
    if ((Prims.gt(PrimChecks.turtle.getVariable(19399, 19413, "unzipped-stage"), 0) && Prims.lt(PrimChecks.turtle.getVariable(19422, 19436, "unzipped-stage"), 4))) {
      PrimChecks.turtle.setVariable(19453, 19467, "unzipped-stage", PrimChecks.math.plus(19483, 19484, PrimChecks.validator.checkArg('+', 19483, 19484, 1, PrimChecks.turtle.getVariable(19468, 19482, "unzipped-stage")), 1));
      wereHanyHnucleotidesHunzippedHfurther_Q = true; ProcedurePrims.stack().currentContext().updateStringRunVar("WERE-ANY-NUCLEOTIDES-UNZIPPED-FURTHER?", wereHanyHnucleotidesHunzippedHfurther_Q);
      if (Prims.equality(PrimChecks.turtle.getVariable(19632, 19637, "class"), "original-dna-top")) {
        PrimChecks.turtle.setVariable(19669, 19673, "ycor", fractionalHseparation);
      }
      if (Prims.equality(PrimChecks.turtle.getVariable(19728, 19733, "class"), "original-dna-bottom")) {
        PrimChecks.turtle.setVariable(19765, 19769, "ycor", PrimChecks.math.mult(19773, 19774, -1, PrimChecks.validator.checkArg('*', 19773, 19774, 1, fractionalHseparation)));
      }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(18880, 18883, R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("HELICASES"), function() {
    if (wereHanyHnucleotidesHunzippedHfurther_Q) {
      PrimChecks.turtleOrLink.setVariable(19900, 19905, "shape", "helicase-expanded");
    }
    else {
      PrimChecks.turtleOrLink.setVariable(19932, 19937, "shape", "helicase");
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(19829, 19832, R); return R; }
}))
ProcedurePrims.defineCommand("separate-base-pairs", 20000, 20805, (function() {
  let lowestHplace = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("LOWEST-PLACE", lowestHplace);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("HELICASES"), function() {
    let thisHhelicase = SelfManager.self(); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-HELICASE", thisHhelicase);
    let unzippedHnucleotides = PrimChecks.agentset.with(20128, 20132, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() { return Prims.equality(PrimChecks.turtle.getVariable(20134, 20148, "unzipped-stage"), 0); }); ProcedurePrims.stack().currentContext().registerStringRunVar("UNZIPPED-NUCLEOTIDES", unzippedHnucleotides);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 20161, 20165, 112, unzippedHnucleotides))) {
      lowestHplace = PrimChecks.agentset.minOneOf(PrimChecks.validator.checkArg('MIN-ONE-OF', 20206, 20216, 112, unzippedHnucleotides), function() { return PrimChecks.turtle.getVariable(20239, 20244, "place"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("LOWEST-PLACE", lowestHplace);
    }
    let availableHnucleotides = PrimChecks.agentset.with(20329, 20333, PrimChecks.validator.checkArg('WITH', 20329, 20333, 112, unzippedHnucleotides), function() {
      return (Prims.lt(SelfManager.self().distance(thisHhelicase), 1) && PrimChecks.validator.checkArg('AND', 20363, 20366, 2, PrimChecks.procedure.callReporter(20367, 20401, "are-previous-nucleotides-unzipped?")));
    }); ProcedurePrims.stack().currentContext().registerStringRunVar("AVAILABLE-NUCLEOTIDES", availableHnucleotides);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 20410, 20414, 112, availableHnucleotides))) {
      let lowestHvalueHnucleotide = PrimChecks.agentset.minOneOf(PrimChecks.validator.checkArg('MIN-ONE-OF', 20473, 20483, 112, availableHnucleotides), function() { return PrimChecks.turtle.getVariable(20507, 20512, "place"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("LOWEST-VALUE-NUCLEOTIDE", lowestHvalueHnucleotide);
      var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 20520, 20523, 1904, lowestHvalueHnucleotide), function() {
        let base = SelfManager.self(); ProcedurePrims.stack().currentContext().registerStringRunVar("BASE", base);
        let baseHplace = PrimChecks.turtle.getVariable(20595, 20600, "place"); ProcedurePrims.stack().currentContext().registerStringRunVar("BASE-PLACE", baseHplace);
        let otherHbase = PrimChecks.agentset.otherWith(null, null, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() { return Prims.equality(PrimChecks.turtle.getVariable(20648, 20653, "place"), baseHplace); }); ProcedurePrims.stack().currentContext().registerStringRunVar("OTHER-BASE", otherHbase);
        if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 20679, 20683, 112, otherHbase))) {
          PrimChecks.turtle.setVariable(20712, 20726, "unzipped-stage", 1);
          var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 20739, 20742, 1904, otherHbase), function() { PrimChecks.turtle.setVariable(20759, 20773, "unzipped-stage", 1); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(20739, 20742, R); return R; }
        }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(20520, 20523, R); return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(20043, 20046, R); return R; }
}))
ProcedurePrims.defineCommand("move-free-molecules", 21198, 21510, (function() {
  let allHmolecules = PrimChecks.agentset.turtleSet(21239, 21249, world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("PHOSPHATES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES")); ProcedurePrims.stack().currentContext().registerStringRunVar("ALL-MOLECULES", allHmolecules);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 21313, 21316, 1904, allHmolecules), function() {
    if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 21340, 21343, 2, PrimChecks.procedure.callReporter(21344, 21368, "being-dragged-by-cursor?")))) {
      SelfManager.self().fd(world.observer.getGlobal("molecule-step"));
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(21313, 21316, R); return R; }
}))
ProcedurePrims.defineCommand("clean-up-free-phosphates", 21518, 21705, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("PHOSPHATES"), function() {
    if ((((Prims.equality(PrimChecks.patch.getVariable(21565, 21570, "pxcor"), world.topology.minPxcor) || Prims.equality(PrimChecks.patch.getVariable(21586, 21591, "pxcor"), world.topology.maxPxcor)) || Prims.equality(PrimChecks.patch.getVariable(21607, 21612, "pycor"), world.topology.minPycor)) || Prims.equality(PrimChecks.patch.getVariable(21628, 21633, "pycor"), world.topology.maxPycor))) {
      return SelfManager.self().die();
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(21545, 21548, R); return R; }
}))
ProcedurePrims.defineCommand("refill-or-remove-nucleosides", 21713, 21935, (function() {
  if (Prims.lt(PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("NUCLEOSIDES")), world.observer.getGlobal("free-nucleosides"))) {
    var R = ProcedurePrims.callCommand("make-a-nucleoside"); if (R === DeathInterrupt) { return R; }
  }
  if (Prims.gt(PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("NUCLEOSIDES")), world.observer.getGlobal("free-nucleosides"))) {
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 21847, 21850, 1904, PrimChecks.list.oneOf(21851, 21857, world.turtleManager.turtlesOfBreed("NUCLEOSIDES"))), function() {
      var R = ProcedurePrims.ask(LinkPrims.linkNeighbors("TAGLINES"), function() { return SelfManager.self().die(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(21871, 21874, R); return R; }
      return SelfManager.self().die();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(21847, 21850, R); return R; }
  }
}))
ProcedurePrims.defineCommand("lock-polymerase-to-one-nucleotide", 22304, 25777, (function() {
  let targetHxcor = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-XCOR", targetHxcor);
  let targetHycor = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-YCOR", targetHycor);
  let targetHclass = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-CLASS", targetHclass);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("POLYMERASES"), function() {
    let nucleosidesHreadyHtoHgearHtoHpolymerase = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("NUCLEOSIDES-READY-TO-GEAR-TO-POLYMERASE", nucleosidesHreadyHtoHgearHtoHpolymerase);
    let potentialHnucleosideHreadyHtoHgearHtoHpolymerase = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("POTENTIAL-NUCLEOSIDE-READY-TO-GEAR-TO-POLYMERASE", potentialHnucleosideHreadyHtoHgearHtoHpolymerase);
    let targetHnucleotideHreadyHtoHgearHtoHpolymerase = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-NUCLEOTIDE-READY-TO-GEAR-TO-POLYMERASE", targetHnucleotideHreadyHtoHgearHtoHpolymerase);
    nucleosidesHreadyHtoHgearHtoHpolymerase = PrimChecks.agentset.with(22662, 22666, world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), function() {
      return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
    }); ProcedurePrims.stack().currentContext().updateStringRunVar("NUCLEOSIDES-READY-TO-GEAR-TO-POLYMERASE", nucleosidesHreadyHtoHgearHtoHpolymerase);
    if (PrimChecks.agentset.optimizeCount(null, null, nucleosidesHreadyHtoHgearHtoHpolymerase, 1, (a, b) => a > b)) {
      potentialHnucleosideHreadyHtoHgearHtoHpolymerase = PrimChecks.agentset.minOneOf(PrimChecks.validator.checkArg('MIN-ONE-OF', 22855, 22865, 112, nucleosidesHreadyHtoHgearHtoHpolymerase), function() { return SelfManager.self().distance(SelfManager.myself()); }); ProcedurePrims.stack().currentContext().updateStringRunVar("POTENTIAL-NUCLEOSIDE-READY-TO-GEAR-TO-POLYMERASE", potentialHnucleosideHreadyHtoHgearHtoHpolymerase);
    }
    if (PrimChecks.agentset.optimizeCount(null, null, nucleosidesHreadyHtoHgearHtoHpolymerase, 1, (a, b) => a === b)) {
      potentialHnucleosideHreadyHtoHgearHtoHpolymerase = nucleosidesHreadyHtoHgearHtoHpolymerase; ProcedurePrims.stack().currentContext().updateStringRunVar("POTENTIAL-NUCLEOSIDE-READY-TO-GEAR-TO-POLYMERASE", potentialHnucleosideHreadyHtoHgearHtoHpolymerase);
    }
    let nucleotidesHreadyHtoHgearHtoHpolymerase = PrimChecks.agentset.with(23154, 23158, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() {
      return (((PrimChecks.math.not(PrimChecks.agentset.any(LinkPrims.myLinks("OLD-STAIRS"))) && PrimChecks.math.not(PrimChecks.agentset.any(LinkPrims.myLinks("NEW-STAIRS")))) && (Prims.equality(PrimChecks.turtle.getVariable(23329, 23334, "class"), "original-dna-bottom") || Prims.equality(PrimChecks.turtle.getVariable(23362, 23367, "class"), "original-dna-top"))) && Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius")));
    }); ProcedurePrims.stack().currentContext().registerStringRunVar("NUCLEOTIDES-READY-TO-GEAR-TO-POLYMERASE", nucleotidesHreadyHtoHgearHtoHpolymerase);
    if (((PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 23438, 23442, 112, nucleotidesHreadyHtoHgearHtoHpolymerase)) && PrimChecks.validator.checkArg('AND', 23483, 23486, 2, PrimChecks.procedure.callReporter(23487, 23510, "all-base-pairs-unwound?"))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 23515, 23518, 2, PrimChecks.procedure.callReporter(23519, 23543, "being-dragged-by-cursor?"))))) {
      targetHnucleotideHreadyHtoHgearHtoHpolymerase = PrimChecks.agentset.minOneOf(PrimChecks.validator.checkArg('MIN-ONE-OF', 23602, 23612, 112, nucleotidesHreadyHtoHgearHtoHpolymerase), function() { return SelfManager.self().distance(SelfManager.myself()); }); ProcedurePrims.stack().currentContext().updateStringRunVar("TARGET-NUCLEOTIDE-READY-TO-GEAR-TO-POLYMERASE", targetHnucleotideHreadyHtoHgearHtoHpolymerase);
      targetHxcor = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 23702, 23704, 1904, targetHnucleotideHreadyHtoHgearHtoHpolymerase), function() { return PrimChecks.turtle.getVariable(23696, 23700, "xcor"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("TARGET-XCOR", targetHxcor);
      targetHycor = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 23782, 23784, 1904, targetHnucleotideHreadyHtoHgearHtoHpolymerase), function() { return PrimChecks.turtle.getVariable(23776, 23780, "ycor"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("TARGET-YCOR", targetHycor);
      targetHclass = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 23862, 23864, 1904, targetHnucleotideHreadyHtoHgearHtoHpolymerase), function() { return PrimChecks.turtle.getVariable(23855, 23860, "class"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("TARGET-CLASS", targetHclass);
      PrimChecks.turtle.setXY(23917, 23922, PrimChecks.validator.checkArg('SETXY', 23917, 23922, 1, targetHxcor), PrimChecks.validator.checkArg('SETXY', 23917, 23922, 1, targetHycor));
    }
    if ((PrimChecks.math.not(PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 23965, 23969, 112, nucleotidesHreadyHtoHgearHtoHpolymerase))) || SelfPrims._optimalAnyOther(SelfManager.self().breedHere("POLYMERASES")))) {
      PrimChecks.turtle.setVariable(24046, 24058, "locked-state", 0);
    }
    if ((((PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 24124, 24128, 112, nucleotidesHreadyHtoHgearHtoHpolymerase)) && PrimChecks.validator.checkArg('AND', 24169, 24172, 2, PrimChecks.procedure.callReporter(24179, 24202, "all-base-pairs-unwound?"))) && Prims.equality(potentialHnucleosideHreadyHtoHgearHtoHpolymerase, Nobody)) && PrimChecks.math.not(SelfPrims._optimalAnyOther(SelfManager.self().breedHere("POLYMERASES"))))) {
      PrimChecks.turtle.setVariable(24386, 24398, "locked-state", 1);
    }
    if ((((!Prims.equality(targetHnucleotideHreadyHtoHgearHtoHpolymerase, Nobody) && PrimChecks.validator.checkArg('AND', 24470, 24473, 2, PrimChecks.procedure.callReporter(24480, 24503, "all-base-pairs-unwound?"))) && !Prims.equality(potentialHnucleosideHreadyHtoHgearHtoHpolymerase, Nobody)) && PrimChecks.math.not(SelfPrims._optimalAnyOther(SelfManager.self().breedHere("POLYMERASES"))))) {
      PrimChecks.turtle.setVariable(24627, 24639, "locked-state", 2);
      if ((PrimChecks.validator.checkArg('OR', 24870, 24872, 2, PrimChecks.procedure.callReporter(24734, 24773, "would-these-nucleotides-pair-correctly?", targetHnucleotideHreadyHtoHgearHtoHpolymerase, potentialHnucleosideHreadyHtoHgearHtoHpolymerase)) || PrimChecks.validator.checkArg('OR', 24870, 24872, 2, world.observer.getGlobal("substitutions?")))) {
        var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 24916, 24919, 1904, potentialHnucleosideHreadyHtoHgearHtoHpolymerase), function() {
          var R = ProcedurePrims.ask(LinkPrims.myInLinks("CURSOR-DRAGS"), function() { return SelfManager.self().die(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(24982, 24985, R); return R; }
          var R = ProcedurePrims.ask(LinkPrims.linkNeighbors("TAGLINES"), function() { return SelfManager.self().die(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(25022, 25025, R); return R; }
          PrimChecks.turtleOrLink.setVariable(25064, 25069, "breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
          PrimChecks.turtleOrLink.setVariable(25096, 25101, "shape", StringPrims.word("nucleotide-", PrimChecks.turtle.getVariable(25123, 25128, "value")));
          PrimChecks.turtle.setVariable(25144, 25152, "unwound?", true);
          if (Prims.equality(targetHclass, "original-dna-top")) {
            PrimChecks.turtle.setVariable(25215, 25222, "heading", 180);
            PrimChecks.turtle.setVariable(25231, 25236, "class", "copy-of-dna-bottom");
            var R = ProcedurePrims.callCommand("attach-nucleo-tag", 175, 0.7); if (R === DeathInterrupt) { return R; }
          }
          if (Prims.equality(targetHclass, "original-dna-bottom")) {
            PrimChecks.turtle.setVariable(25342, 25349, "heading", 0);
            PrimChecks.turtle.setVariable(25356, 25361, "class", "copy-of-dna-top");
            var R = ProcedurePrims.callCommand("attach-nucleo-tag", 5, 0.5); if (R === DeathInterrupt) { return R; }
          }
          PrimChecks.turtle.setXY(25415, 25420, PrimChecks.validator.checkArg('SETXY', 25415, 25420, 1, targetHxcor), PrimChecks.validator.checkArg('SETXY', 25415, 25420, 1, targetHycor));
          var R = ProcedurePrims.callCommand("break-off-phosphates-from-nucleoside"); if (R === DeathInterrupt) { return R; }
          var R = ProcedurePrims.ask(LinkPrims.createLinkWith(targetHnucleotideHreadyHtoHgearHtoHpolymerase, "NEW-STAIRS"), function() {
            PrimChecks.turtleOrLink.setVariable(25575, 25582, "hidden?", false);
            SelfManager.self().tie();
          }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(25502, 25523, R); return R; }
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(24916, 24919, R); return R; }
      }
      else {
        PrimChecks.turtle.setVariable(25744, 25756, "locked-state", 3);
      }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(22403, 22406, R); return R; }
}))
ProcedurePrims.defineCommand("break-off-phosphates-from-nucleoside", 25785, 25921, (function() {
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    PrimChecks.turtleOrLink.setVariable(25842, 25847, "breed", world.turtleManager.turtlesOfBreed("PHOSPHATES"));
    PrimChecks.turtleOrLink.setVariable(25867, 25872, "shape", "phosphate-pair");
    PrimChecks.turtle.setVariable(25898, 25905, "heading", RandomPrims.randomLong(360));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(25824, 25829, R); return R; }
}))
ProcedurePrims.defineCommand("lock-topoisomerase-to-wound-primase", 26290, 27218, (function() {
  let targetHxcor = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-XCOR", targetHxcor);
  let targetHycor = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-YCOR", targetHycor);
  let targetHclass = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-CLASS", targetHclass);
  let woundHnucleotides = PrimChecks.agentset.with(26425, 26429, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() {
    return PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 26431, 26434, 2, PrimChecks.turtle.getVariable(26435, 26443, "unwound?")));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("WOUND-NUCLEOTIDES", woundHnucleotides);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("TOPOISOMERASES"), function() {
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 26480, 26484, 112, woundHnucleotides))) {
      let targetHprimasesHreadyHtoHgearHtoHtopoisomerase = PrimChecks.agentset.with(26572, 26576, world.turtleManager.turtlesOfBreed("PRIMASES"), function() {
        return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
      }); ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-PRIMASES-READY-TO-GEAR-TO-TOPOISOMERASE", targetHprimasesHreadyHtoHgearHtoHtopoisomerase);
      if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 26623, 26627, 112, targetHprimasesHreadyHtoHgearHtoHtopoisomerase))) {
        let targetHprimaseHreadyHtoHgearHtoHtopoisomerase = PrimChecks.list.oneOf(26735, 26741, PrimChecks.validator.checkArg('ONE-OF', 26735, 26741, 120, targetHprimasesHreadyHtoHgearHtoHtopoisomerase)); ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-PRIMASE-READY-TO-GEAR-TO-TOPOISOMERASE", targetHprimaseHreadyHtoHgearHtoHtopoisomerase);
        PrimChecks.turtle.setVariable(26801, 26808, "locked?", true);
        if (PrimChecks.math.not(MousePrims.isDown())) {
          var R = ProcedurePrims.callCommand("unwind-dna"); if (R === DeathInterrupt) { return R; }
          var R = ProcedurePrims.ask(LinkPrims.myInLinks("CURSOR-DRAGS"), function() { return SelfManager.self().die(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(26874, 26877, R); return R; }
          targetHxcor = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 26939, 26941, 1904, targetHprimaseHreadyHtoHgearHtoHtopoisomerase), function() { return PrimChecks.turtle.getVariable(26933, 26937, "xcor"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("TARGET-XCOR", targetHxcor);
          targetHycor = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 27023, 27025, 1904, targetHprimaseHreadyHtoHgearHtoHtopoisomerase), function() { return PrimChecks.turtle.getVariable(27017, 27021, "ycor"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("TARGET-YCOR", targetHycor);
          PrimChecks.turtle.setXY(27082, 27087, PrimChecks.validator.checkArg('SETXY', 27082, 27087, 1, targetHxcor), PrimChecks.validator.checkArg('SETXY', 27082, 27087, 1, targetHycor));
        }
      }
      else {
        PrimChecks.turtle.setVariable(27150, 27157, "locked?", false);
      }
    }
    else {
      PrimChecks.turtle.setVariable(27194, 27201, "locked?", false);
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(26447, 26450, R); return R; }
}))
ProcedurePrims.defineCommand("calculate-mutations", 27443, 28773, (function() {
  world.observer.setGlobal("total-deletion-mutations-top-strand", 0);
  world.observer.setGlobal("total-substitution-mutations-top-strand", 0);
  world.observer.setGlobal("total-correct-duplications-top-strand", 0);
  world.observer.setGlobal("total-deletion-mutations-bottom-strand", 0);
  world.observer.setGlobal("total-substitution-mutations-bottom-strand", 0);
  world.observer.setGlobal("total-correct-duplications-bottom-strand", 0);
  let originalHnucleotides = PrimChecks.agentset.with(27788, 27792, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() { return Prims.equality(PrimChecks.turtle.getVariable(27794, 27799, "class"), "original-dna-top"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("ORIGINAL-NUCLEOTIDES", originalHnucleotides);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 27825, 27828, 1904, originalHnucleotides), function() {
    if (PrimChecks.math.not(PrimChecks.agentset.any(LinkPrims.myLinks("NEW-STAIRS")))) {
      world.observer.setGlobal("total-deletion-mutations-top-strand", PrimChecks.math.plus(27959, 27960, PrimChecks.validator.checkArg('+', 27959, 27960, 1, world.observer.getGlobal("total-deletion-mutations-top-strand")), 1));
    }
    if (Prims.gte(PrimChecks.agentset.count(LinkPrims.myLinks("NEW-STAIRS")), 1)) {
      if (PrimChecks.procedure.callReporter(28011, 28047, "is-this-nucleotide-paired-correctly?")) {
        world.observer.setGlobal("total-correct-duplications-top-strand", PrimChecks.math.plus(28137, 28138, PrimChecks.validator.checkArg('+', 28137, 28138, 1, world.observer.getGlobal("total-correct-duplications-top-strand")), 1));
      }
      else {
        world.observer.setGlobal("total-substitution-mutations-top-strand", PrimChecks.math.plus(28235, 28236, PrimChecks.validator.checkArg('+', 28235, 28236, 1, world.observer.getGlobal("total-substitution-mutations-top-strand")), 1));
      }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(27825, 27828, R); return R; }
  originalHnucleotides = PrimChecks.agentset.with(28290, 28294, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() { return Prims.equality(PrimChecks.turtle.getVariable(28296, 28301, "class"), "original-dna-bottom"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("ORIGINAL-NUCLEOTIDES", originalHnucleotides);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 28330, 28333, 1904, originalHnucleotides), function() {
    if (PrimChecks.math.not(PrimChecks.agentset.any(LinkPrims.myLinks("NEW-STAIRS")))) {
      world.observer.setGlobal("total-deletion-mutations-bottom-strand", PrimChecks.math.plus(28470, 28471, PrimChecks.validator.checkArg('+', 28470, 28471, 1, world.observer.getGlobal("total-deletion-mutations-bottom-strand")), 1));
    }
    if (Prims.gte(PrimChecks.agentset.count(LinkPrims.myLinks("NEW-STAIRS")), 1)) {
      if (PrimChecks.procedure.callReporter(28522, 28558, "is-this-nucleotide-paired-correctly?")) {
        world.observer.setGlobal("total-correct-duplications-bottom-strand", PrimChecks.math.plus(28654, 28655, PrimChecks.validator.checkArg('+', 28654, 28655, 1, world.observer.getGlobal("total-correct-duplications-bottom-strand")), 1));
      }
      else {
        world.observer.setGlobal("total-substitution-mutations-bottom-strand", PrimChecks.math.plus(28758, 28759, PrimChecks.validator.checkArg('+', 28758, 28759, 1, world.observer.getGlobal("total-substitution-mutations-bottom-strand")), 1));
      }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(28330, 28333, R); return R; }
}))
ProcedurePrims.defineCommand("detect-mouse-selection-event", 28998, 30666, (function() {
  let pHmouseHxcor = MousePrims.getX(); ProcedurePrims.stack().currentContext().registerStringRunVar("P-MOUSE-XCOR", pHmouseHxcor);
  let pHmouseHycor = MousePrims.getY(); ProcedurePrims.stack().currentContext().registerStringRunVar("P-MOUSE-YCOR", pHmouseHycor);
  let currentHmouseHdown_Q = MousePrims.isDown(); ProcedurePrims.stack().currentContext().registerStringRunVar("CURRENT-MOUSE-DOWN?", currentHmouseHdown_Q);
  let targetHturtle = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("TARGET-TURTLE", targetHturtle);
  let currentHmouseHinside_Q = MousePrims.isInside(); ProcedurePrims.stack().currentContext().registerStringRunVar("CURRENT-MOUSE-INSIDE?", currentHmouseHinside_Q);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("MOUSE-CURSORS"), function() {
    PrimChecks.turtle.setXY(29220, 29225, PrimChecks.validator.checkArg('SETXY', 29220, 29225, 1, pHmouseHxcor), PrimChecks.validator.checkArg('SETXY', 29220, 29225, 1, pHmouseHycor));
    PrimChecks.turtleOrLink.setVariable(29306, 29313, "hidden?", true);
    let allHmoveableHmolecules = PrimChecks.agentset.turtleSet(29351, 29361, world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES")); ProcedurePrims.stack().currentContext().registerStringRunVar("ALL-MOVEABLE-MOLECULES", allHmoveableHmolecules);
    let draggableHmolecules = PrimChecks.agentset.with(29463, 29467, PrimChecks.validator.checkArg('WITH', 29463, 29467, 112, allHmoveableHmolecules), function() {
      return (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 29469, 29472, 2, PrimChecks.procedure.callReporter(29473, 29497, "being-dragged-by-cursor?"))) && Prims.lte(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("mouse-drag-radius")));
    }); ProcedurePrims.stack().currentContext().registerStringRunVar("DRAGGABLE-MOLECULES", draggableHmolecules);
    if (((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 29687, 29690, 2, currentHmouseHdown_Q)) && MousePrims.isInside()) && PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 29734, 29738, 112, draggableHmolecules)))) {
      PrimChecks.turtleOrLink.setVariable(29766, 29771, "color", world.observer.getGlobal("cursor-detect-color"));
      PrimChecks.turtleOrLink.setVariable(29797, 29804, "hidden?", false);
      SelfManager.self().right(4);
    }
    if ((PrimChecks.validator.checkArg('AND', 29957, 29960, 2, PrimChecks.procedure.callReporter(29923, 29956, "is-this-cursor-dragging-anything?")) && MousePrims.isInside())) {
      PrimChecks.turtleOrLink.setVariable(29981, 29986, "color", world.observer.getGlobal("cursor-drag-color"));
      PrimChecks.turtleOrLink.setVariable(30009, 30016, "hidden?", false);
    }
    if ((((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 30032, 30035, 2, world.observer.getGlobal("mouse-continuous-down?"))) && PrimChecks.validator.checkArg('AND', 30059, 30062, 2, currentHmouseHdown_Q)) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 30087, 30090, 2, PrimChecks.procedure.callReporter(30091, 30124, "is-this-cursor-dragging-anything?")))) && PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 30129, 30133, 112, draggableHmolecules)))) {
      targetHturtle = PrimChecks.agentset.minOneOf(PrimChecks.validator.checkArg('MIN-ONE-OF', 30180, 30190, 112, draggableHmolecules), function() { return SelfManager.self().distance(SelfManager.myself()); }); ProcedurePrims.stack().currentContext().updateStringRunVar("TARGET-TURTLE", targetHturtle);
      var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 30236, 30239, 1904, targetHturtle), function() {
        PrimChecks.turtle.setXY(30255, 30260, PrimChecks.validator.checkArg('SETXY', 30255, 30260, 1, pHmouseHxcor), PrimChecks.validator.checkArg('SETXY', 30255, 30260, 1, pHmouseHycor));
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(30236, 30239, R); return R; }
      var R = ProcedurePrims.ask(LinkPrims.createLinkTo(targetHturtle, "CURSOR-DRAGS"), function() {
        PrimChecks.turtleOrLink.setVariable(30336, 30343, "hidden?", false);
        SelfManager.self().tie();
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(30294, 30315, R); return R; }
    }
    if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 30464, 30467, 2, currentHmouseHdown_Q))) {
      var R = ProcedurePrims.ask(LinkPrims.myOutLinks("CURSOR-DRAGS"), function() { return SelfManager.self().die(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(30491, 30494, R); return R; }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(29196, 29199, R); return R; }
  if ((PrimChecks.validator.checkArg('AND', 30582, 30585, 2, currentHmouseHdown_Q) && MousePrims.isDown())) {
    world.observer.setGlobal("mouse-continuous-down?", true);
  }
  else {
    world.observer.setGlobal("mouse-continuous-down?", false);
  }
}))
ProcedurePrims.defineReporter("random-base-letter", 30898, 31138, (function() {
  let r = RandomPrims.randomLong(4); ProcedurePrims.stack().currentContext().registerStringRunVar("R", r);
  let letterHtoHreport = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("LETTER-TO-REPORT", letterHtoHreport);
  if (Prims.equality(r, 0)) {
    letterHtoHreport = "A"; ProcedurePrims.stack().currentContext().updateStringRunVar("LETTER-TO-REPORT", letterHtoHreport);
  }
  if (Prims.equality(r, 1)) {
    letterHtoHreport = "G"; ProcedurePrims.stack().currentContext().updateStringRunVar("LETTER-TO-REPORT", letterHtoHreport);
  }
  if (Prims.equality(r, 2)) {
    letterHtoHreport = "T"; ProcedurePrims.stack().currentContext().updateStringRunVar("LETTER-TO-REPORT", letterHtoHreport);
  }
  if (Prims.equality(r, 3)) {
    letterHtoHreport = "C"; ProcedurePrims.stack().currentContext().updateStringRunVar("LETTER-TO-REPORT", letterHtoHreport);
  }
  return PrimChecks.procedure.report(31114, 31120, letterHtoHreport);
}))
ProcedurePrims.defineReporter("complementary-base", 31153, 31391, (function(base) {
  let baseHtoHreport = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("BASE-TO-REPORT", baseHtoHreport);
  if (Prims.equality(base, "A")) {
    baseHtoHreport = "T"; ProcedurePrims.stack().currentContext().updateStringRunVar("BASE-TO-REPORT", baseHtoHreport);
  }
  if (Prims.equality(base, "T")) {
    baseHtoHreport = "A"; ProcedurePrims.stack().currentContext().updateStringRunVar("BASE-TO-REPORT", baseHtoHreport);
  }
  if (Prims.equality(base, "G")) {
    baseHtoHreport = "C"; ProcedurePrims.stack().currentContext().updateStringRunVar("BASE-TO-REPORT", baseHtoHreport);
  }
  if (Prims.equality(base, "C")) {
    baseHtoHreport = "G"; ProcedurePrims.stack().currentContext().updateStringRunVar("BASE-TO-REPORT", baseHtoHreport);
  }
  return PrimChecks.procedure.report(31369, 31375, baseHtoHreport);
}))
ProcedurePrims.defineReporter("time-remaining-to-display", 31406, 31493, (function() {
  if (world.observer.getGlobal("using-time-limit")) {
    return PrimChecks.procedure.report(31459, 31465, world.observer.getGlobal("time-remaining"));
  }
  else {
    return PrimChecks.procedure.report(31482, 31488, "");
  }
}))
ProcedurePrims.defineReporter("is-this-cursor-dragging-anything?", 31508, 31612, (function() {
  if (PrimChecks.agentset.any(LinkPrims.outLinkNeighbors("CURSOR-DRAGS"))) {
    return PrimChecks.procedure.report(31585, 31591, true);
  }
  else {
    return PrimChecks.procedure.report(31598, 31604, false);
  }
}))
ProcedurePrims.defineReporter("being-dragged-by-cursor?", 31627, 31713, (function() {
  if (PrimChecks.agentset.any(LinkPrims.myInLinks("CURSOR-DRAGS"))) {
    return PrimChecks.procedure.report(31686, 31692, true);
  }
  else {
    return PrimChecks.procedure.report(31699, 31705, false);
  }
}))
ProcedurePrims.defineReporter("all-base-pairs-unwound?", 31728, 31826, (function() {
  if (PrimChecks.agentset.anyWith(null, null, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() {
    return PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 31784, 31787, 2, PrimChecks.turtle.getVariable(31788, 31796, "unwound?")));
  })) {
    return PrimChecks.procedure.report(31799, 31805, false);
  }
  else {
    return PrimChecks.procedure.report(31813, 31819, true);
  }
}))
ProcedurePrims.defineReporter("would-these-nucleotides-pair-correctly?", 31841, 32028, (function(nucleotideH1, nucleotideH2) {
  if (Prims.equality(PrimChecks.procedure.callReporter(31921, 31939, "complementary-base", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 31948, 31950, 1904, nucleotideH1), function() { return PrimChecks.turtle.getVariable(31941, 31946, "value"); })), PrimChecks.list.item(31967, 31971, 0, PrimChecks.validator.checkArg('ITEM', 31967, 31971, 12, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 31982, 31984, 1904, nucleotideH2), function() { return PrimChecks.turtle.getVariable(31975, 31980, "value"); }))))) {
    return PrimChecks.procedure.report(32000, 32006, true);
  }
  else {
    return PrimChecks.procedure.report(32013, 32019, false);
  }
}))
ProcedurePrims.defineReporter("is-this-nucleotide-paired-correctly?", 32043, 32594, (function() {
  let originalHnucleotide = SelfManager.self(); ProcedurePrims.stack().currentContext().registerStringRunVar("ORIGINAL-NUCLEOTIDE", originalHnucleotide);
  let thisHstair = PrimChecks.list.oneOf(32128, 32134, LinkPrims.myLinks("NEW-STAIRS")); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-STAIR", thisHstair);
  let thisHpairedHnucleotide = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-PAIRED-NUCLEOTIDE", thisHpairedHnucleotide);
  let overwrite_Q = false; ProcedurePrims.stack().currentContext().registerStringRunVar("OVERWRITE?", overwrite_Q);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 32210, 32213, 1904, thisHstair), function() {
    thisHpairedHnucleotide = SelfManager.self().otherEnd(); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-PAIRED-NUCLEOTIDE", thisHpairedHnucleotide);
    if (!Prims.equality(thisHpairedHnucleotide, Nobody)) {
      if ((!Prims.equality(PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 32322, 32324, 1904, thisHpairedHnucleotide), function() { return PrimChecks.turtle.getVariable(32315, 32320, "class"); }), "copy-of-dna-bottom") && !Prims.equality(PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 32384, 32386, 1904, thisHpairedHnucleotide), function() { return PrimChecks.turtle.getVariable(32377, 32382, "class"); }), "copy-of-dna-top"))) {
        overwrite_Q = true; ProcedurePrims.stack().currentContext().updateStringRunVar("OVERWRITE?", overwrite_Q);
      }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(32210, 32213, R); return R; }
  if ((Prims.equality(PrimChecks.turtle.getVariable(32481, 32486, "value"), PrimChecks.procedure.callReporter(32490, 32508, "complementary-base", PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 32517, 32519, 1904, thisHpairedHnucleotide), function() { return PrimChecks.turtle.getVariable(32510, 32515, "value"); }))) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 32548, 32551, 2, overwrite_Q)))) {
    return PrimChecks.procedure.report(32565, 32571, true);
  }
  else {
    return PrimChecks.procedure.report(32579, 32585, false);
  }
}))
ProcedurePrims.defineReporter("next-nucleotide-unzipped-the-same?", 32609, 33347, (function() {
  let myHunzippedHstage = PrimChecks.turtle.getVariable(32668, 32682, "unzipped-stage"); ProcedurePrims.stack().currentContext().registerStringRunVar("MY-UNZIPPED-STAGE", myHunzippedHstage);
  let myHplace = PrimChecks.turtle.getVariable(32698, 32703, "place"); ProcedurePrims.stack().currentContext().registerStringRunVar("MY-PLACE", myHplace);
  let myHclass = PrimChecks.turtle.getVariable(32719, 32724, "class"); ProcedurePrims.stack().currentContext().registerStringRunVar("MY-CLASS", myHclass);
  let nextHnucleotidesHavailable = PrimChecks.agentset.with(32770, 32774, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() {
    return ((Prims.equality(PrimChecks.turtle.getVariable(32776, 32781, "class"), myHclass) && Prims.equality(PrimChecks.turtle.getVariable(32797, 32802, "place"), PrimChecks.math.plus(32815, 32816, PrimChecks.validator.checkArg('+', 32815, 32816, 1, myHplace), 1))) && Prims.equality(PrimChecks.turtle.getVariable(32824, 32838, "unzipped-stage"), myHunzippedHstage));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("NEXT-NUCLEOTIDES-AVAILABLE", nextHnucleotidesHavailable);
  let canHcontinueHtoHunzip_Q = false; ProcedurePrims.stack().currentContext().registerStringRunVar("CAN-CONTINUE-TO-UNZIP?", canHcontinueHtoHunzip_Q);
  if (Prims.lt(myHplace, world.observer.getGlobal("dna-strand-length"))) {
    if ((PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 32946, 32950, 112, nextHnucleotidesHavailable)) && PrimChecks.validator.checkArg('AND', 32978, 32981, 2, PrimChecks.procedure.callReporter(32982, 33016, "are-previous-nucleotides-unzipped?")))) {
      canHcontinueHtoHunzip_Q = true; ProcedurePrims.stack().currentContext().updateStringRunVar("CAN-CONTINUE-TO-UNZIP?", canHcontinueHtoHunzip_Q);
    }
    else {
      canHcontinueHtoHunzip_Q = false; ProcedurePrims.stack().currentContext().updateStringRunVar("CAN-CONTINUE-TO-UNZIP?", canHcontinueHtoHunzip_Q);
    }
  }
  else {
    canHcontinueHtoHunzip_Q = true; ProcedurePrims.stack().currentContext().updateStringRunVar("CAN-CONTINUE-TO-UNZIP?", canHcontinueHtoHunzip_Q);
  }
  return PrimChecks.procedure.report(33317, 33323, canHcontinueHtoHunzip_Q);
}))
ProcedurePrims.defineReporter("are-previous-nucleotides-unzipped?", 33363, 33812, (function() {
  let myHplace = PrimChecks.turtle.getVariable(33413, 33418, "place"); ProcedurePrims.stack().currentContext().registerStringRunVar("MY-PLACE", myHplace);
  let previousHnucleotides = PrimChecks.agentset.with(33458, 33462, world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), function() {
    return Prims.equality(PrimChecks.turtle.getVariable(33464, 33469, "place"), PrimChecks.math.minus(33482, 33483, PrimChecks.validator.checkArg('-', 33482, 33483, 1, myHplace), 1));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("PREVIOUS-NUCLEOTIDES", previousHnucleotides);
  let valueHtoHreturn = false; ProcedurePrims.stack().currentContext().registerStringRunVar("VALUE-TO-RETURN", valueHtoHreturn);
  if (PrimChecks.math.not(PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 33529, 33533, 112, previousHnucleotides)))) {
    valueHtoHreturn = true; ProcedurePrims.stack().currentContext().updateStringRunVar("VALUE-TO-RETURN", valueHtoHreturn);
  }
  else {
    let previousHnucleotidesHareHunzipped = PrimChecks.agentset.with(33652, 33656, PrimChecks.validator.checkArg('WITH', 33652, 33656, 112, previousHnucleotides), function() { return Prims.gt(PrimChecks.turtle.getVariable(33658, 33672, "unzipped-stage"), 0); }); ProcedurePrims.stack().currentContext().registerStringRunVar("PREVIOUS-NUCLEOTIDES-ARE-UNZIPPED", previousHnucleotidesHareHunzipped);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 33689, 33693, 112, previousHnucleotidesHareHunzipped))) {
      valueHtoHreturn = true; ProcedurePrims.stack().currentContext().updateStringRunVar("VALUE-TO-RETURN", valueHtoHreturn);
    }
    else {
      valueHtoHreturn = false; ProcedurePrims.stack().currentContext().updateStringRunVar("VALUE-TO-RETURN", valueHtoHreturn);
    }
  }
  return PrimChecks.procedure.report(33789, 33795, valueHtoHreturn);
}))
ProcedurePrims.defineReporter("user-message-string-for-mutations", 33827, 34503, (function() {
  let duplicationHrate = PrimChecks.math.precision(PrimChecks.math.div(33981, 33982, PrimChecks.math.plus(33936, 33937, PrimChecks.validator.checkArg('+', 33936, 33937, 1, world.observer.getGlobal("total-correct-duplications-top-strand")), PrimChecks.validator.checkArg('+', 33936, 33937, 1, world.observer.getGlobal("total-correct-duplications-bottom-strand"))), PrimChecks.validator.checkArg('/', 33981, 33982, 1, world.observer.getGlobal("final-time"))), 4); ProcedurePrims.stack().currentContext().registerStringRunVar("DUPLICATION-RATE", duplicationHrate);
  return PrimChecks.procedure.report(33999, 34005, StringPrims.word("You had ", PrimChecks.math.plus(34062, 34063, PrimChecks.validator.checkArg('+', 34062, 34063, 1, world.observer.getGlobal("total-correct-duplications-top-strand")), PrimChecks.validator.checkArg('+', 34062, 34063, 1, world.observer.getGlobal("total-correct-duplications-bottom-strand"))), " correct replications and ", PrimChecks.math.plus(34180, 34181, PrimChecks.validator.checkArg('+', 34180, 34181, 1, world.observer.getGlobal("total-substitution-mutations-top-strand")), PrimChecks.validator.checkArg('+', 34180, 34181, 1, world.observer.getGlobal("total-substitution-mutations-bottom-strand"))), " substitutions and ", PrimChecks.math.plus(34290, 34291, PrimChecks.validator.checkArg('+', 34290, 34291, 1, world.observer.getGlobal("total-deletion-mutations-top-strand")), PrimChecks.validator.checkArg('+', 34290, 34291, 1, world.observer.getGlobal("total-deletion-mutations-bottom-strand"))), "  deletions.", " That replication process took you ", world.observer.getGlobal("final-time"), " seconds.  This was a rate of ", duplicationHrate, " correct nucleotides duplicated per second."));
}))
ProcedurePrims.defineReporter("current-instruction-label", 34724, 34879, (function() {
  return PrimChecks.procedure.report(34752, 34758, (Prims.ifElseValueBooleanCheck(Prims.equality(world.observer.getGlobal("current-instruction"), 0)) ? "press setup" : StringPrims.word(world.observer.getGlobal("current-instruction"), " / ", PrimChecks.list.length(PrimChecks.validator.checkArg('LENGTH', 34856, 34862, 12, PrimChecks.procedure.callReporter(34863, 34875, "instructions"))))));
}))
ProcedurePrims.defineCommand("next-instruction", 34887, 34947, (function() {
  var R = ProcedurePrims.callCommand("show-instruction", PrimChecks.math.plus(34943, 34944, PrimChecks.validator.checkArg('+', 34943, 34944, 1, world.observer.getGlobal("current-instruction")), 1)); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("previous-instruction", 34955, 35019, (function() {
  var R = ProcedurePrims.callCommand("show-instruction", PrimChecks.math.minus(35015, 35016, PrimChecks.validator.checkArg('-', 35015, 35016, 1, world.observer.getGlobal("current-instruction")), 1)); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("show-instruction", 35027, 35213, (function(i) {
  if ((Prims.gte(i, 1) && Prims.lte(i, PrimChecks.list.length(PrimChecks.validator.checkArg('LENGTH', 35071, 35077, 12, PrimChecks.procedure.callReporter(35078, 35090, "instructions")))))) {
    world.observer.setGlobal("current-instruction", i);
    OutputPrims.clear();
    var R = PrimChecks.task.forEach(35144, 35151, PrimChecks.validator.checkArg('FOREACH', 35144, 35151, 8, PrimChecks.list.item(35152, 35156, PrimChecks.math.minus(35178, 35179, PrimChecks.validator.checkArg('-', 35178, 35179, 1, world.observer.getGlobal("current-instruction")), 1), PrimChecks.validator.checkArg('ITEM', 35152, 35156, 12, PrimChecks.procedure.callReporter(35183, 35195, "instructions")))), PrimChecks.task.checked(35196, 35208, function(_0) {
      PrimChecks.procedure.runArgCountCheck('run', 35196, 35208, 1, arguments.length);
      OutputPrims.print(_0);
    }, "output-print", false, false)); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(35144, 35151, R); return R; }
  }
}))
ProcedurePrims.defineReporter("instructions", 35228, 36589, (function() {
  return PrimChecks.procedure.report(35243, 35249, [["You will be simulating the process", "of DNA replication that occurs in", "every cell in every living creature", "as part of mitosis or meiosis."], ["To do this you will need to complete", "4 tasks in the shortest time you", "can. Each of these tasks requires", "you to drag a molecule using your", "mouse, from one location to another."], ["The 1st task will be to unwind a ", "twisted bundle of DNA by using your", "mouse to place a topoisomerase ", "enzyme on top of the primase enzyme."], ["The 2nd task will be to unzip the", "DNA ladder structure by dragging", "a helicase enzyme from the 1st ", "base pair to the last base pair."], ["The 3rd task will be to first drag", "a polymerase enzyme to an open", "nucleotide and then drag a floating", "nucleoside to the same location."], ["The last task is to simply repeat", "the previous task of connecting", "nucleosides to open nucleotides", "until as much of the DNA as", "possible has been replicated."], ["The simulation ends either when", "the timer runs out (if the timer?", "chooser is set to YES) or when you", "press the DIVIDE THE CELL button"]]);
}))
world.observer.setGlobal("dna-strand-length", 30);
world.observer.setGlobal("nucleo-labels?", true);
world.observer.setGlobal("enzyme-labels?", true);
world.observer.setGlobal("substitutions?", false);
world.observer.setGlobal("free-nucleosides", 50);
world.observer.setGlobal("time-limit", "none");