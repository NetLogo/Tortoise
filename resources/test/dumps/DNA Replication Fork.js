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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[150,165,165,180,180,195,195,210,210,165,165,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,135,120,120,105,105,90,90,135,135,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"empty":{"name":"empty","editableColorIndex":0,"rotate":false,"elements":[]},"helicase":{"name":"helicase","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"helicase-expanded":{"name":"helicase-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"nucleoside-tri-a":{"name":"nucleoside-tri-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-c":{"name":"nucleoside-tri-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,135,165,165,135,60],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-g":{"name":"nucleoside-tri-g","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-t":{"name":"nucleoside-tri-t","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false}]},"nucleotide-a":{"name":"nucleotide-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"nucleotide-c":{"name":"nucleotide-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"nucleotide-g":{"name":"nucleotide-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleotide-t":{"name":"nucleotide-t","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"phosphate":{"name":"phosphate","editableColorIndex":0,"rotate":true,"elements":[{"x":129,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"phosphate-pair":{"name":"phosphate-pair","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":135,"x2":150,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":144,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":99,"y":120,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"polymerase-0":{"name":"polymerase-0","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,60,60,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":0,"xmax":120,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true}]},"polymerase-1":{"name":"polymerase-1","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true}]},"polymerase-2":{"name":"polymerase-2","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"x1":180,"y1":60,"x2":180,"y2":240,"type":"line","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true}]},"polymerase-3":{"name":"polymerase-3","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"primase":{"name":"primase","editableColorIndex":1,"rotate":true,"elements":[{"xcors":[90,75,90,120,150,150,180,180,225,285,285,270,240,210,195,195,180,150,105,75,60,60],"ycors":[195,240,270,255,270,300,300,270,255,195,180,165,150,165,165,135,90,90,90,120,150,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"target":{"name":"target","editableColorIndex":0,"rotate":true,"elements":[{"x":76,"y":76,"diam":146,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":60,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":195,"x2":150,"y2":240,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"topoisomerase":{"name":"topoisomerase","editableColorIndex":0,"rotate":true,"elements":[{"x":45,"y":45,"diam":210,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":129,"diam":44,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"topoisomerase-gears":{"name":"topoisomerase-gears","editableColorIndex":0,"rotate":true,"elements":[{"xmin":135,"ymin":15,"xmax":165,"ymax":60,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":240,"ymin":135,"xmax":285,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":135,"ymin":240,"xmax":165,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":15,"ymin":135,"xmax":60,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[60,105,75,45],"ycors":[255,225,195,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[45,75,105,60],"ycors":[60,105,75,45],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[240,195,225,255],"ycors":[45,75,105,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,225,195,240],"ycors":[240,195,225,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PHOSPHATES", singular: "phosphate", varNames: [] }, { name: "NUCLEOSIDES", singular: "nucleoside", varNames: ["class", "value", "place"] }, { name: "NUCLEOTIDES", singular: "nucleotide", varNames: ["class", "value", "place", "unwound?", "unzipped-stage"] }, { name: "POLYMERASES", singular: "polymerase", varNames: ["locked-state"] }, { name: "HELICASES", singular: "helicase", varNames: [] }, { name: "TOPOISOMERASES", singular: "topoisomerase", varNames: ["locked?"] }, { name: "TOPOISOMERASES-GEARS", singular: "topoisomerase-gear", varNames: [] }, { name: "PRIMASES", singular: "primase", varNames: [] }, { name: "NUCLEOTIDE-TAGS", singular: "nucleotide-tag", varNames: ["value"] }, { name: "ENZYME-TAGS", singular: "enzyme-tag", varNames: [] }, { name: "MOUSE-CURSORS", singular: "mouse-cursor", varNames: [] }, { name: "CHROMOSOME-BUILDERS", singular: "initial-chromosomes-builder", varNames: [] }, { name: "OLD-STAIRS", singular: "old-stair", varNames: [], isDirected: false }, { name: "NEW-STAIRS", singular: "new-stair", varNames: [], isDirected: false }, { name: "TAGLINES", singular: "tagline", varNames: [], isDirected: false }, { name: "GEARLINES", singular: "gearline", varNames: [], isDirected: true }, { name: "CURSOR-DRAGS", singular: "cursor-drag", varNames: [], isDirected: true }, { name: "BACKBONES", singular: "backbone", varNames: [], isDirected: true }])([], [])(["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit", "initial-length-dna", "mouse-continuous-down?", "instruction", "cursor-detect-color", "cursor-drag-color", "wound-dna-color", "unwound-dna-color", "nucleo-tag-color", "enzyme-tag-color", "nucleoside-color", "polymerase-color-0", "polymerase-color-1", "polymerase-color-2", "polymerase-color-3", "helicase-color-0", "helicase-color-1", "topoisomerase-color-0", "topoisomerase-color-1", "primase-color-0", "primase-color-1", "final-time", "total-deletion-mutations-top-strand", "total-substitution-mutations-top-strand", "total-correct-duplications-top-strand", "total-deletion-mutations-bottom-strand", "total-substitution-mutations-bottom-strand", "total-correct-duplications-bottom-strand", "lock-radius", "mouse-drag-radius", "molecule-step", "wind-angle", "length-of-simulation", "time-remaining", "current-instruction", "using-time-limit", "simulation-started?", "cell-divided?", "simulation-ended?", "cell-message-shown?", "timer-message-shown?"], ["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit"], [], 0, 16, -5, 4, 50.0, true, true, turtleShapes, linkShapes, function(){});
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
    for (var _index_8928_8934 = 0, _repeatcount_8928_8934 = StrictMath.floor(world.observer.getGlobal("free-nucleosides")); _index_8928_8934 < _repeatcount_8928_8934; _index_8928_8934++){
      procedures.makeANucleoside();
    }
    procedures.makeInitialDnaStrip();
    procedures.makePolymerases();
    procedures.makeAHelicase();
    procedures.makeATopoisomerase();
    procedures.windInitialDnaIntoBundle();
    procedures.visualizeAgents();
    procedures.initializeLengthOfTime();
    procedures.showInstruction(1);
    world.ticker.reset();
  };
  var initializeLengthOfTime = function() {
    world.observer.setGlobal("using-time-limit", !Prims.equality(world.observer.getGlobal("time-limit"), "none"));
    if (Prims.equality(world.observer.getGlobal("time-limit"), "2 minutes")) {
      world.observer.setGlobal("length-of-simulation", 120);
      world.observer.setGlobal("time-remaining", 120);
    }
    if (Prims.equality(world.observer.getGlobal("time-limit"), "5 minutes")) {
      world.observer.setGlobal("length-of-simulation", 300);
      world.observer.setGlobal("time-remaining", 300);
    }
  };
  var makeANucleoside = function() {
    world.turtleManager.createTurtles(1, "NUCLEOSIDES").ask(function() {
      SelfManager.self().setVariable("value", procedures.randomBaseLetter());
      SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleoside-tri-") + Dump(SelfManager.self().getVariable("value"))));
      SelfManager.self().setVariable("color", world.observer.getGlobal("nucleoside-color"));
      procedures.attachNucleoTag(0,0);
      SelfManager.self().setXY(Prims.randomPatchCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomPatchCoord(world.topology.minPycor, world.topology.maxPycor));
    }, true);
  };
  var makePolymerases = function() {
    world.turtleManager.createTurtles(1, "POLYMERASES").ask(function() {
      SelfManager.self().setVariable("heading", Prims.random(((180 - Prims.random(20)) + Prims.random(20))));
      SelfManager.self().setXY((Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2) + 3), (world.topology.maxPycor - 1));
    }, true);
    world.turtleManager.createTurtles(1, "POLYMERASES").ask(function() {
      SelfManager.self().setVariable("heading", ((90 - Prims.random(20)) + Prims.random(20)));
      SelfManager.self().setXY((Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2) - 5), (world.topology.maxPycor - 1));
    }, true);
    world.turtleManager.turtlesOfBreed("POLYMERASES").ask(function() {
      procedures.attachEnzymeTag(150,0.85,"polymerase");
      SelfManager.self().setVariable("locked-state", 0);
      SelfManager.self().setVariable("shape", "polymerase-0");
      SelfManager.self().setVariable("color", world.observer.getGlobal("polymerase-color-0"));
    }, true);
  };
  var makeAHelicase = function() {
    world.turtleManager.createTurtles(1, "HELICASES").ask(function() {
      SelfManager.self().setVariable("shape", "helicase");
      SelfManager.self().setVariable("color", world.observer.getGlobal("helicase-color-0"));
      SelfManager.self().setVariable("size", 3.2);
      SelfManager.self().setVariable("heading", 90);
      procedures.attachEnzymeTag(150,0.85,"helicase");
      SelfManager.self().setXY(Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2), (world.topology.maxPycor - 1));
    }, true);
  };
  var makeATopoisomerase = function() {
    world.turtleManager.createTurtles(1, "TOPOISOMERASES").ask(function() {
      SelfManager.self().setVariable("shape", "topoisomerase");
      SelfManager.self().setVariable("locked?", false);
      SelfManager.self().setVariable("color", world.observer.getGlobal("topoisomerase-color-0"));
      SelfManager.self().setVariable("size", 1.5);
      SelfManager.self().setVariable("heading", ((-90 + Prims.randomFloat(10)) - Prims.randomFloat(10)));
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS"));
        SelfManager.self().setVariable("shape", "topoisomerase-gears");
        LinkPrims.createLinkFrom(SelfManager.myself(), "GEARLINES").ask(function() {
          SelfManager.self().setVariable("tie-mode", "fixed");
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().tie();
        }, true);
      }, true);
      procedures.attachEnzymeTag(150,0.85,"topoisomerase");
      SelfManager.self().setXY((Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2) - 3), (world.topology.maxPycor - 1));
    }, true);
  };
  var makeAndAttachAPrimase = function() {
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
      procedures.attachEnzymeTag(100,0,"primase");
    }, true);
  };
  var makeInitialDnaStrip = function() {
    var lastNucleotideTopStrand = Nobody;
    var lastNucleotideBottomStrand = Nobody;
    var placeCounter = 0;
    var firstBasePairValue = "";
    var is_ThisTheFirstBase_p = true;
    world.turtleManager.createTurtles(1, "").ask(function() {
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS"));
      SelfManager.self().setVariable("heading", 90);
      SelfManager.self().fd(1);
    }, true);
    world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS").ask(function() {
      for (var _index_11850_11856 = 0, _repeatcount_11850_11856 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_11850_11856 < _repeatcount_11850_11856; _index_11850_11856++){
        placeCounter = (placeCounter + 1);
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
          SelfManager.self().setVariable("value", procedures.randomBaseLetter());
          firstBasePairValue = SelfManager.self().getVariable("value");
          SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleotide-") + Dump(SelfManager.self().getVariable("value"))));
          SelfManager.self().setVariable("heading", 0);
          SelfManager.self().setVariable("class", "original-dna-top");
          SelfManager.self().setVariable("unwound?", true);
          SelfManager.self().setVariable("color", world.observer.getGlobal("unwound-dna-color"));
          SelfManager.self().setVariable("place", placeCounter);
          SelfManager.self().setVariable("unzipped-stage", 0);
          procedures.attachNucleoTag(5,0.5);
          if (!Prims.equality(lastNucleotideTopStrand, Nobody)) {
            LinkPrims.createLinkTo(lastNucleotideTopStrand, "BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              SelfManager.self().tie();
            }, true);
          }
          lastNucleotideTopStrand = SelfManager.self();
          if (is_ThisTheFirstBase_p) {
            procedures.makeAndAttachAPrimase();
          }
          is_ThisTheFirstBase_p = false;
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().right(180);
            SelfManager.self().setVariable("value", procedures.complementaryBase(firstBasePairValue));
            SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleotide-") + Dump(SelfManager.self().getVariable("value"))));
            SelfManager.self().setVariable("class", "original-dna-bottom");
            LinkPrims.createLinkWith(lastNucleotideTopStrand, "OLD-STAIRS").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
            procedures.attachNucleoTag(175,0.7);
            if (!Prims.equality(lastNucleotideBottomStrand, Nobody)) {
              LinkPrims.createLinkTo(lastNucleotideBottomStrand, "BACKBONES").ask(function() {
                SelfManager.self().setVariable("hidden?", true);
                SelfManager.self().tie();
              }, true);
            }
            lastNucleotideBottomStrand = SelfManager.self();
          }, true);
        }, true);
        SelfManager.self().fd(0.45);
      }
      SelfManager.self().die();
    }, true);
  };
  var attachNucleoTag = function(direction, displacement) {
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
  };
  var attachEnzymeTag = function(direction, displacement, labelValue) {
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
  };
  var go = function() {
    if (((world.observer.getGlobal("using-time-limit") && Prims.gt(world.observer.getGlobal("time-remaining"), 0)) || (!world.observer.getGlobal("using-time-limit") && !world.observer.getGlobal("cell-divided?")))) {
      procedures.checkTimer();
      procedures.moveFreeMolecules();
      procedures.cleanUpFreePhosphates();
      procedures.refillOrRemoveNucleosides();
      procedures.unzipNucleotides();
      procedures.detectMouseSelectionEvent();
      procedures.lockPolymeraseToOneNucleotide();
      procedures.lockTopoisomeraseToWoundPrimase();
      if (procedures.allBasePairsUnwound_p()) {
        procedures.separateBasePairs();
      }
      procedures.visualizeAgents();
      world.ticker.tick();
    }
    if ((world.observer.getGlobal("cell-divided?") && !world.observer.getGlobal("cell-message-shown?"))) {
      procedures.calculateMutations();
      if (Prims.equality(world.observer.getGlobal("final-time"), 0)) {
        world.observer.setGlobal("final-time", workspace.timer.elapsed());
      }
      UserDialogPrims.confirm((Dump('') + Dump("You have cued the cell division.  Let's see how you did in replicating ") + Dump("an exact copy of the DNA.")));
      UserDialogPrims.confirm(procedures.userMessageStringForMutations());
      world.observer.setGlobal("cell-message-shown?", true);
    }
    if (((world.observer.getGlobal("using-time-limit") && Prims.lte(world.observer.getGlobal("time-remaining"), 0)) && !world.observer.getGlobal("timer-message-shown?"))) {
      procedures.calculateMutations();
      UserDialogPrims.confirm((Dump('') + Dump("The timer has expired.  Let's see how you did in replicating ") + Dump("an exact copy of it.")));
      UserDialogPrims.confirm(procedures.userMessageStringForMutations());
      world.observer.setGlobal("timer-message-shown?", true);
    }
  };
  var checkTimer = function() {
    if (!world.observer.getGlobal("simulation-started?")) {
      world.observer.setGlobal("simulation-started?", true);
      workspace.timer.reset();
    }
    if (world.observer.getGlobal("using-time-limit")) {
      world.observer.setGlobal("time-remaining", (world.observer.getGlobal("length-of-simulation") - workspace.timer.elapsed()));
    }
  };
  var visualizeAgents = function() {
    world.turtleManager.turtlesOfBreed("ENZYME-TAGS").ask(function() { SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("enzyme-labels?")); }, true);
    world.turtleManager.turtlesOfBreed("NUCLEOTIDE-TAGS").ask(function() { SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("nucleo-labels?")); }, true);
    world.turtleManager.turtlesOfBreed("TOPOISOMERASES").ask(function() {
      if (SelfManager.self().getVariable("locked?")) {
        world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS").ask(function() {
          SelfManager.self().right(-10);
          SelfManager.self().setVariable("color", world.observer.getGlobal("topoisomerase-color-1"));
        }, true);
      }
      else {
        world.turtleManager.turtlesOfBreed("TOPOISOMERASES-GEARS").ask(function() {
          SelfManager.self().right(-3);
          SelfManager.self().setVariable("color", world.observer.getGlobal("topoisomerase-color-0"));
        }, true);
      }
    }, true);
    world.turtleManager.turtlesOfBreed("POLYMERASES").ask(function() {
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
  };
  var windInitialDnaIntoBundle = function() {
    for (var _index_17539_17545 = 0, _repeatcount_17539_17545 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_17539_17545 < _repeatcount_17539_17545; _index_17539_17545++){
      procedures.windDna();
    }
  };
  var unwindDna = function() {
    var woundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); });
    if (woundNucleotides.nonEmpty()) {
      var maxWoundPlace = ListPrims.max(woundNucleotides.projectionBy(function() { return SelfManager.self().getVariable("place"); }));
      woundNucleotides.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), maxWoundPlace); }).ask(function() {
        SelfManager.self().right(-world.observer.getGlobal("wind-angle"));
        SelfManager.self().setVariable("unwound?", true);
        SelfManager.self().setVariable("color", world.observer.getGlobal("unwound-dna-color"));
        notImplemented('display', undefined)();
      }, true);
    }
  };
  var windDna = function() {
    var unwoundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
      return ((SelfManager.self().getVariable("unwound?") && !Prims.equality(SelfManager.self().getVariable("class"), "copy-of-dna-bottom")) && !Prims.equality(SelfManager.self().getVariable("class"), "copy-of-dna-top"));
    });
    if (unwoundNucleotides.nonEmpty()) {
      var minUnwoundPlace = ListPrims.min(unwoundNucleotides.projectionBy(function() { return SelfManager.self().getVariable("place"); }));
      unwoundNucleotides.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), minUnwoundPlace); }).ask(function() {
        SelfManager.self().right(world.observer.getGlobal("wind-angle"));
        SelfManager.self().setVariable("unwound?", false);
        SelfManager.self().setVariable("color", world.observer.getGlobal("wound-dna-color"));
      }, true);
    }
  };
  var unzipNucleotides = function() {
    var wereAnyNucleotidesUnzippedFurther_p = false;
    world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
      return (procedures.nextNucleotideUnzippedTheSame_p() && Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0));
    }).ask(function() {
      var fractionalSeparation = Prims.div(SelfManager.self().getVariable("unzipped-stage"), 2);
      if (Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 3)) {
        LinkPrims.myLinks("OLD-STAIRS").ask(function() { SelfManager.self().die(); }, true);
        LinkPrims.myOutLinks("BACKBONES").ask(function() { SelfManager.self().die(); }, true);
      }
      if (Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 1)) {
        LinkPrims.myOutLinks("BACKBONES").ask(function() { SelfManager.self().untie(); }, true);
      }
      if ((Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0) && Prims.lt(SelfManager.self().getVariable("unzipped-stage"), 4))) {
        SelfManager.self().setVariable("unzipped-stage", (SelfManager.self().getVariable("unzipped-stage") + 1));
        wereAnyNucleotidesUnzippedFurther_p = true;
        if (Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top")) {
          SelfManager.self().setVariable("ycor", fractionalSeparation);
        }
        if (Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom")) {
          SelfManager.self().setVariable("ycor", (-1 * fractionalSeparation));
        }
      }
    }, true);
    world.turtleManager.turtlesOfBreed("HELICASES").ask(function() {
      if (wereAnyNucleotidesUnzippedFurther_p) {
        SelfManager.self().setVariable("shape", "helicase-expanded");
      }
      else {
        SelfManager.self().setVariable("shape", "helicase");
      }
    }, true);
  };
  var separateBasePairs = function() {
    var lowestPlace = 0;
    world.turtleManager.turtlesOfBreed("HELICASES").ask(function() {
      var thisHelicase = SelfManager.self();
      var unzippedNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 0); });
      if (unzippedNucleotides.nonEmpty()) {
        lowestPlace = unzippedNucleotides.minOneOf(function() { return SelfManager.self().getVariable("place"); });
      }
      var availableNucleotides = unzippedNucleotides.agentFilter(function() {
        return (Prims.lt(SelfManager.self().distance(thisHelicase), 1) && procedures.arePreviousNucleotidesUnzipped_p());
      });
      if (availableNucleotides.nonEmpty()) {
        var lowestValueNucleotide = availableNucleotides.minOneOf(function() { return SelfManager.self().getVariable("place"); });
        lowestValueNucleotide.ask(function() {
          var base = SelfManager.self();
          var basePlace = SelfManager.self().getVariable("place");
          var otherBase = SelfPrims.other(world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), basePlace); }));
          if (otherBase.nonEmpty()) {
            SelfManager.self().setVariable("unzipped-stage", 1);
            otherBase.ask(function() { SelfManager.self().setVariable("unzipped-stage", 1); }, true);
          }
        }, true);
      }
    }, true);
  };
  var moveFreeMolecules = function() {
    var allMolecules = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("PHOSPHATES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES"));
    allMolecules.ask(function() {
      if (!procedures.beingDraggedByCursor_p()) {
        SelfManager.self().fd(world.observer.getGlobal("molecule-step"));
      }
    }, true);
  };
  var cleanUpFreePhosphates = function() {
    world.turtleManager.turtlesOfBreed("PHOSPHATES").ask(function() {
      if ((((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.minPxcor) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.maxPxcor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.maxPycor))) {
        SelfManager.self().die();
      }
    }, true);
  };
  var refillOrRemoveNucleosides = function() {
    if (Prims.lt(world.turtleManager.turtlesOfBreed("NUCLEOSIDES").size(), world.observer.getGlobal("free-nucleosides"))) {
      procedures.makeANucleoside();
    }
    if (Prims.gt(world.turtleManager.turtlesOfBreed("NUCLEOSIDES").size(), world.observer.getGlobal("free-nucleosides"))) {
      ListPrims.oneOf(world.turtleManager.turtlesOfBreed("NUCLEOSIDES")).ask(function() {
        LinkPrims.linkNeighbors("LINKS").ask(function() { SelfManager.self().die(); }, true);
        SelfManager.self().die();
      }, true);
    }
  };
  var lockPolymeraseToOneNucleotide = function() {
    var targetXcor = 0;
    var targetYcor = 0;
    var targetClass = "";
    world.turtleManager.turtlesOfBreed("POLYMERASES").ask(function() {
      var nucleosidesReadyToGearToPolymerase = Nobody;
      var potentialNucleosideReadyToGearToPolymerase = Nobody;
      var targetNucleotideReadyToGearToPolymerase = Nobody;
      nucleosidesReadyToGearToPolymerase = world.turtleManager.turtlesOfBreed("NUCLEOSIDES").agentFilter(function() {
        return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
      });
      if (Prims.gt(nucleosidesReadyToGearToPolymerase.size(), 1)) {
        potentialNucleosideReadyToGearToPolymerase = nucleosidesReadyToGearToPolymerase.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); });
      }
      if (Prims.equality(nucleosidesReadyToGearToPolymerase.size(), 1)) {
        potentialNucleosideReadyToGearToPolymerase = nucleosidesReadyToGearToPolymerase;
      }
      var nucleotidesReadyToGearToPolymerase = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return (((!LinkPrims.myLinks("OLD-STAIRS").nonEmpty() && !LinkPrims.myLinks("NEW-STAIRS").nonEmpty()) && (Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom") || Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top"))) && Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius")));
      });
      if (((nucleotidesReadyToGearToPolymerase.nonEmpty() && procedures.allBasePairsUnwound_p()) && !procedures.beingDraggedByCursor_p())) {
        targetNucleotideReadyToGearToPolymerase = nucleotidesReadyToGearToPolymerase.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); });
        targetXcor = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("xcor"); });
        targetYcor = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("ycor"); });
        targetClass = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("class"); });
        SelfManager.self().setXY(targetXcor, targetYcor);
      }
      if ((!nucleotidesReadyToGearToPolymerase.nonEmpty() || SelfPrims.other(SelfManager.self().breedHere("POLYMERASES")).nonEmpty())) {
        SelfManager.self().setVariable("locked-state", 0);
      }
      if ((((nucleotidesReadyToGearToPolymerase.nonEmpty() && procedures.allBasePairsUnwound_p()) && Prims.equality(potentialNucleosideReadyToGearToPolymerase, Nobody)) && !SelfPrims.other(SelfManager.self().breedHere("POLYMERASES")).nonEmpty())) {
        SelfManager.self().setVariable("locked-state", 1);
      }
      if ((((!Prims.equality(targetNucleotideReadyToGearToPolymerase, Nobody) && procedures.allBasePairsUnwound_p()) && !Prims.equality(potentialNucleosideReadyToGearToPolymerase, Nobody)) && !SelfPrims.other(SelfManager.self().breedHere("POLYMERASES")).nonEmpty())) {
        SelfManager.self().setVariable("locked-state", 2);
        if ((procedures.wouldTheseNucleotidesPairCorrectly_p(targetNucleotideReadyToGearToPolymerase,potentialNucleosideReadyToGearToPolymerase) || world.observer.getGlobal("substitutions?"))) {
          potentialNucleosideReadyToGearToPolymerase.ask(function() {
            LinkPrims.myInLinks("CURSOR-DRAGS").ask(function() { SelfManager.self().die(); }, true);
            LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().die(); }, true);
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
            SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleotide-") + Dump(SelfManager.self().getVariable("value"))));
            SelfManager.self().setVariable("unwound?", true);
            if (Prims.equality(targetClass, "original-dna-top")) {
              SelfManager.self().setVariable("heading", 180);
              SelfManager.self().setVariable("class", "copy-of-dna-bottom");
              procedures.attachNucleoTag(175,0.7);
            }
            if (Prims.equality(targetClass, "original-dna-bottom")) {
              SelfManager.self().setVariable("heading", 0);
              SelfManager.self().setVariable("class", "copy-of-dna-top");
              procedures.attachNucleoTag(5,0.5);
            }
            SelfManager.self().setXY(targetXcor, targetYcor);
            procedures.breakOffPhosphatesFromNucleoside();
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
  };
  var breakOffPhosphatesFromNucleoside = function() {
    SelfManager.self().hatch(1, "").ask(function() {
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PHOSPHATES"));
      SelfManager.self().setVariable("shape", "phosphate-pair");
      SelfManager.self().setVariable("heading", Prims.random(360));
    }, true);
  };
  var lockTopoisomeraseToWoundPrimase = function() {
    var targetXcor = 0;
    var targetYcor = 0;
    var targetClass = "";
    var woundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); });
    world.turtleManager.turtlesOfBreed("TOPOISOMERASES").ask(function() {
      if (woundNucleotides.nonEmpty()) {
        var targetPrimasesReadyToGearToTopoisomerase = world.turtleManager.turtlesOfBreed("PRIMASES").agentFilter(function() {
          return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
        });
        if (targetPrimasesReadyToGearToTopoisomerase.nonEmpty()) {
          var targetPrimaseReadyToGearToTopoisomerase = ListPrims.oneOf(targetPrimasesReadyToGearToTopoisomerase);
          SelfManager.self().setVariable("locked?", true);
          if (!MousePrims.isDown()) {
            procedures.unwindDna();
            LinkPrims.myInLinks("CURSOR-DRAGS").ask(function() { SelfManager.self().die(); }, true);
            targetXcor = targetPrimaseReadyToGearToTopoisomerase.projectionBy(function() { return SelfManager.self().getVariable("xcor"); });
            targetYcor = targetPrimaseReadyToGearToTopoisomerase.projectionBy(function() { return SelfManager.self().getVariable("ycor"); });
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
  };
  var calculateMutations = function() {
    world.observer.setGlobal("total-deletion-mutations-top-strand", 0);
    world.observer.setGlobal("total-substitution-mutations-top-strand", 0);
    world.observer.setGlobal("total-correct-duplications-top-strand", 0);
    world.observer.setGlobal("total-deletion-mutations-bottom-strand", 0);
    world.observer.setGlobal("total-substitution-mutations-bottom-strand", 0);
    world.observer.setGlobal("total-correct-duplications-bottom-strand", 0);
    var originalNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top"); });
    originalNucleotides.ask(function() {
      if (!LinkPrims.myLinks("NEW-STAIRS").nonEmpty()) {
        world.observer.setGlobal("total-deletion-mutations-top-strand", (world.observer.getGlobal("total-deletion-mutations-top-strand") + 1));
      }
      if (Prims.gte(LinkPrims.myLinks("NEW-STAIRS").size(), 1)) {
        if (procedures.is_ThisNucleotidePairedCorrectly_p()) {
          world.observer.setGlobal("total-correct-duplications-top-strand", (world.observer.getGlobal("total-correct-duplications-top-strand") + 1));
        }
        else {
          world.observer.setGlobal("total-substitution-mutations-top-strand", (world.observer.getGlobal("total-substitution-mutations-top-strand") + 1));
        }
      }
    }, true);
    originalNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom"); });
    originalNucleotides.ask(function() {
      if (!LinkPrims.myLinks("NEW-STAIRS").nonEmpty()) {
        world.observer.setGlobal("total-deletion-mutations-bottom-strand", (world.observer.getGlobal("total-deletion-mutations-bottom-strand") + 1));
      }
      if (Prims.gte(LinkPrims.myLinks("NEW-STAIRS").size(), 1)) {
        if (procedures.is_ThisNucleotidePairedCorrectly_p()) {
          world.observer.setGlobal("total-correct-duplications-bottom-strand", (world.observer.getGlobal("total-correct-duplications-bottom-strand") + 1));
        }
        else {
          world.observer.setGlobal("total-substitution-mutations-bottom-strand", (world.observer.getGlobal("total-substitution-mutations-bottom-strand") + 1));
        }
      }
    }, true);
  };
  var detectMouseSelectionEvent = function() {
    var pMouseXcor = MousePrims.getX();
    var pMouseYcor = MousePrims.getY();
    var currentMouseDown_p = MousePrims.isDown();
    var targetTurtle = Nobody;
    var currentMouseInside_p = MousePrims.isInside();
    world.turtleManager.turtlesOfBreed("MOUSE-CURSORS").ask(function() {
      SelfManager.self().setXY(pMouseXcor, pMouseYcor);
      SelfManager.self().setVariable("hidden?", true);
      var allMoveableMolecules = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES"));
      var draggableMolecules = allMoveableMolecules.agentFilter(function() {
        return (!procedures.beingDraggedByCursor_p() && Prims.lte(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("mouse-drag-radius")));
      });
      if (((!currentMouseDown_p && MousePrims.isInside()) && draggableMolecules.nonEmpty())) {
        SelfManager.self().setVariable("color", world.observer.getGlobal("cursor-detect-color"));
        SelfManager.self().setVariable("hidden?", false);
        SelfManager.self().right(4);
      }
      if ((procedures.is_ThisCursorDraggingAnything_p() && MousePrims.isInside())) {
        SelfManager.self().setVariable("color", world.observer.getGlobal("cursor-drag-color"));
        SelfManager.self().setVariable("hidden?", false);
      }
      if ((((!world.observer.getGlobal("mouse-continuous-down?") && currentMouseDown_p) && !procedures.is_ThisCursorDraggingAnything_p()) && draggableMolecules.nonEmpty())) {
        targetTurtle = draggableMolecules.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); });
        targetTurtle.ask(function() { SelfManager.self().setXY(pMouseXcor, pMouseYcor); }, true);
        LinkPrims.createLinkTo(targetTurtle, "CURSOR-DRAGS").ask(function() {
          SelfManager.self().setVariable("hidden?", false);
          SelfManager.self().tie();
        }, true);
      }
      if (!currentMouseDown_p) {
        LinkPrims.myOutLinks("CURSOR-DRAGS").ask(function() { SelfManager.self().die(); }, true);
      }
    }, true);
    if ((currentMouseDown_p && MousePrims.isDown())) {
      world.observer.setGlobal("mouse-continuous-down?", true);
    }
    else {
      world.observer.setGlobal("mouse-continuous-down?", false);
    }
  };
  var randomBaseLetter = function() {
    try {
      var r = Prims.random(4);
      var letterToReport = "";
      if (Prims.equality(r, 0)) {
        letterToReport = "A";
      }
      if (Prims.equality(r, 1)) {
        letterToReport = "G";
      }
      if (Prims.equality(r, 2)) {
        letterToReport = "T";
      }
      if (Prims.equality(r, 3)) {
        letterToReport = "C";
      }
      throw new Exception.ReportInterrupt(letterToReport);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var complementaryBase = function(base) {
    try {
      var baseToReport = "";
      if (Prims.equality(base, "A")) {
        baseToReport = "T";
      }
      if (Prims.equality(base, "T")) {
        baseToReport = "A";
      }
      if (Prims.equality(base, "G")) {
        baseToReport = "C";
      }
      if (Prims.equality(base, "C")) {
        baseToReport = "G";
      }
      throw new Exception.ReportInterrupt(baseToReport);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var timeRemainingToDisplay = function() {
    try {
      if (world.observer.getGlobal("using-time-limit")) {
        throw new Exception.ReportInterrupt(world.observer.getGlobal("time-remaining"));
      }
      else {
        throw new Exception.ReportInterrupt("");
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var is_ThisCursorDraggingAnything_p = function() {
    try {
      if (LinkPrims.outLinkNeighbors("CURSOR-DRAGS").nonEmpty()) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var beingDraggedByCursor_p = function() {
    try {
      if (LinkPrims.myInLinks("CURSOR-DRAGS").nonEmpty()) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var allBasePairsUnwound_p = function() {
    try {
      if (world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); }).nonEmpty()) {
        throw new Exception.ReportInterrupt(false);
      }
      else {
        throw new Exception.ReportInterrupt(true);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var wouldTheseNucleotidesPairCorrectly_p = function(nucleotide1, nucleotide2) {
    try {
      if (Prims.equality(procedures.complementaryBase(nucleotide1.projectionBy(function() { return SelfManager.self().getVariable("value"); })), ListPrims.item(0, nucleotide2.projectionBy(function() { return SelfManager.self().getVariable("value"); })))) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var is_ThisNucleotidePairedCorrectly_p = function() {
    try {
      var originalNucleotide = SelfManager.self();
      var thisStair = ListPrims.oneOf(LinkPrims.myLinks("NEW-STAIRS"));
      var thisPairedNucleotide = Nobody;
      var overwrite_p = false;
      thisStair.ask(function() {
        thisPairedNucleotide = SelfManager.self().otherEnd();
        if (!Prims.equality(thisPairedNucleotide, Nobody)) {
          if ((!Prims.equality(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("class"); }), "copy-of-dna-bottom") && !Prims.equality(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("class"); }), "copy-of-dna-top"))) {
            overwrite_p = true;
          }
        }
      }, true);
      if ((Prims.equality(SelfManager.self().getVariable("value"), procedures.complementaryBase(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("value"); }))) && !overwrite_p)) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var nextNucleotideUnzippedTheSame_p = function() {
    try {
      var myUnzippedStage = SelfManager.self().getVariable("unzipped-stage");
      var myPlace = SelfManager.self().getVariable("place");
      var myClass = SelfManager.self().getVariable("class");
      var nextNucleotidesAvailable = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return ((Prims.equality(SelfManager.self().getVariable("class"), myClass) && Prims.equality(SelfManager.self().getVariable("place"), (myPlace + 1))) && Prims.equality(SelfManager.self().getVariable("unzipped-stage"), myUnzippedStage));
      });
      var canContinueToUnzip_p = false;
      if (Prims.lt(myPlace, world.observer.getGlobal("dna-strand-length"))) {
        if ((nextNucleotidesAvailable.nonEmpty() && procedures.arePreviousNucleotidesUnzipped_p())) {
          canContinueToUnzip_p = true;
        }
        else {
          canContinueToUnzip_p = false;
        }
      }
      else {
        canContinueToUnzip_p = true;
      }
      throw new Exception.ReportInterrupt(canContinueToUnzip_p);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var arePreviousNucleotidesUnzipped_p = function() {
    try {
      var myPlace = SelfManager.self().getVariable("place");
      var previousNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), (myPlace - 1)); });
      var valueToReturn = false;
      if (!previousNucleotides.nonEmpty()) {
        valueToReturn = true;
      }
      else {
        var previousNucleotidesAreUnzipped = previousNucleotides.agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0); });
        if (previousNucleotidesAreUnzipped.nonEmpty()) {
          valueToReturn = true;
        }
        else {
          valueToReturn = false;
        }
      }
      throw new Exception.ReportInterrupt(valueToReturn);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var userMessageStringForMutations = function() {
    try {
      var duplicationRate = NLMath.precision(Prims.div((world.observer.getGlobal("total-correct-duplications-top-strand") + world.observer.getGlobal("total-correct-duplications-bottom-strand")), world.observer.getGlobal("final-time")), 4);
      throw new Exception.ReportInterrupt((Dump('') + Dump("You had ") + Dump((world.observer.getGlobal("total-correct-duplications-top-strand") + world.observer.getGlobal("total-correct-duplications-bottom-strand"))) + Dump(" correct replications and ") + Dump((world.observer.getGlobal("total-substitution-mutations-top-strand") + world.observer.getGlobal("total-substitution-mutations-bottom-strand"))) + Dump(" substitutions and ") + Dump((world.observer.getGlobal("total-deletion-mutations-top-strand") + world.observer.getGlobal("total-deletion-mutations-bottom-strand"))) + Dump("  deletions.") + Dump(" That replication process took you ") + Dump(world.observer.getGlobal("final-time")) + Dump(" seconds.  This was a rate of ") + Dump(duplicationRate) + Dump(" correct nucleotides duplicated per second.")));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var currentInstructionLabel = function() {
    try {
      throw new Exception.ReportInterrupt((Prims.equality(world.observer.getGlobal("current-instruction"), 0) ? "press setup" : (Dump('') + Dump(world.observer.getGlobal("current-instruction")) + Dump(" / ") + Dump(ListPrims.length(procedures.instructions())))));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var nextInstruction = function() { procedures.showInstruction((world.observer.getGlobal("current-instruction") + 1)); };
  var previousInstruction = function() { procedures.showInstruction((world.observer.getGlobal("current-instruction") - 1)); };
  var showInstruction = function(i) {
    if ((Prims.gte(i, 1) && Prims.lte(i, ListPrims.length(procedures.instructions())))) {
      world.observer.setGlobal("current-instruction", i);
      OutputPrims.clear();
      Tasks.forEach(Tasks.commandTask(function() {
        var taskArguments = arguments;
        OutputPrims.print(taskArguments[0]);
      }), ListPrims.item((world.observer.getGlobal("current-instruction") - 1), procedures.instructions()));
    }
  };
  var instructions = function() {
    try {
      throw new Exception.ReportInterrupt([["You will be simulating the process", "of DNA replication that occurs in", "every cell in every living creature", "as part of mitosis or meiosis."], ["To do this you will need to complete", "4 tasks in the shortest time you", "can. Each of these tasks requires", "you to drag a molecule using your", "mouse, from one location to another."], ["The 1st task will be to unwind a ", "twisted bundle of DNA by using your", "mouse to place a topoisomerase ", "enzyme on top of the primase enzyme."], ["The 2nd task will be to unzip the", "DNA ladder structure by dragging", "a helicase enzyme from the 1st ", "base pair to the last base pair."], ["The 3rd task will be to first drag", "a polymerase enzyme to an open", "nucleotide and then drag a floating", "nucleoside to the same location."], ["The last task is to simply repeat", "the previous task of connecting", "nucleosides to open nucleotides", "until as much of the DNA as", "possible has been replicated."], ["The simulation ends either when", "the timer runs out (if the timer?", "chooser is set to YES) or when you", "press the DIVIDE THE CELL button"]]);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  return {
    "ALL-BASE-PAIRS-UNWOUND?":allBasePairsUnwound_p,
    "ARE-PREVIOUS-NUCLEOTIDES-UNZIPPED?":arePreviousNucleotidesUnzipped_p,
    "ATTACH-ENZYME-TAG":attachEnzymeTag,
    "ATTACH-NUCLEO-TAG":attachNucleoTag,
    "BEING-DRAGGED-BY-CURSOR?":beingDraggedByCursor_p,
    "BREAK-OFF-PHOSPHATES-FROM-NUCLEOSIDE":breakOffPhosphatesFromNucleoside,
    "CALCULATE-MUTATIONS":calculateMutations,
    "CHECK-TIMER":checkTimer,
    "CLEAN-UP-FREE-PHOSPHATES":cleanUpFreePhosphates,
    "COMPLEMENTARY-BASE":complementaryBase,
    "CURRENT-INSTRUCTION-LABEL":currentInstructionLabel,
    "DETECT-MOUSE-SELECTION-EVENT":detectMouseSelectionEvent,
    "GO":go,
    "INITIALIZE-LENGTH-OF-TIME":initializeLengthOfTime,
    "INSTRUCTIONS":instructions,
    "IS-THIS-CURSOR-DRAGGING-ANYTHING?":is_ThisCursorDraggingAnything_p,
    "IS-THIS-NUCLEOTIDE-PAIRED-CORRECTLY?":is_ThisNucleotidePairedCorrectly_p,
    "LOCK-POLYMERASE-TO-ONE-NUCLEOTIDE":lockPolymeraseToOneNucleotide,
    "LOCK-TOPOISOMERASE-TO-WOUND-PRIMASE":lockTopoisomeraseToWoundPrimase,
    "MAKE-A-HELICASE":makeAHelicase,
    "MAKE-A-NUCLEOSIDE":makeANucleoside,
    "MAKE-A-TOPOISOMERASE":makeATopoisomerase,
    "MAKE-AND-ATTACH-A-PRIMASE":makeAndAttachAPrimase,
    "MAKE-INITIAL-DNA-STRIP":makeInitialDnaStrip,
    "MAKE-POLYMERASES":makePolymerases,
    "MOVE-FREE-MOLECULES":moveFreeMolecules,
    "NEXT-INSTRUCTION":nextInstruction,
    "NEXT-NUCLEOTIDE-UNZIPPED-THE-SAME?":nextNucleotideUnzippedTheSame_p,
    "PREVIOUS-INSTRUCTION":previousInstruction,
    "RANDOM-BASE-LETTER":randomBaseLetter,
    "REFILL-OR-REMOVE-NUCLEOSIDES":refillOrRemoveNucleosides,
    "SEPARATE-BASE-PAIRS":separateBasePairs,
    "SETUP":setup,
    "SHOW-INSTRUCTION":showInstruction,
    "TIME-REMAINING-TO-DISPLAY":timeRemainingToDisplay,
    "UNWIND-DNA":unwindDna,
    "UNZIP-NUCLEOTIDES":unzipNucleotides,
    "USER-MESSAGE-STRING-FOR-MUTATIONS":userMessageStringForMutations,
    "VISUALIZE-AGENTS":visualizeAgents,
    "WIND-DNA":windDna,
    "WIND-INITIAL-DNA-INTO-BUNDLE":windInitialDnaIntoBundle,
    "WOULD-THESE-NUCLEOTIDES-PAIR-CORRECTLY?":wouldTheseNucleotidesPairCorrectly_p,
    "allBasePairsUnwound_p":allBasePairsUnwound_p,
    "arePreviousNucleotidesUnzipped_p":arePreviousNucleotidesUnzipped_p,
    "attachEnzymeTag":attachEnzymeTag,
    "attachNucleoTag":attachNucleoTag,
    "beingDraggedByCursor_p":beingDraggedByCursor_p,
    "breakOffPhosphatesFromNucleoside":breakOffPhosphatesFromNucleoside,
    "calculateMutations":calculateMutations,
    "checkTimer":checkTimer,
    "cleanUpFreePhosphates":cleanUpFreePhosphates,
    "complementaryBase":complementaryBase,
    "currentInstructionLabel":currentInstructionLabel,
    "detectMouseSelectionEvent":detectMouseSelectionEvent,
    "go":go,
    "initializeLengthOfTime":initializeLengthOfTime,
    "instructions":instructions,
    "is_ThisCursorDraggingAnything_p":is_ThisCursorDraggingAnything_p,
    "is_ThisNucleotidePairedCorrectly_p":is_ThisNucleotidePairedCorrectly_p,
    "lockPolymeraseToOneNucleotide":lockPolymeraseToOneNucleotide,
    "lockTopoisomeraseToWoundPrimase":lockTopoisomeraseToWoundPrimase,
    "makeAHelicase":makeAHelicase,
    "makeANucleoside":makeANucleoside,
    "makeATopoisomerase":makeATopoisomerase,
    "makeAndAttachAPrimase":makeAndAttachAPrimase,
    "makeInitialDnaStrip":makeInitialDnaStrip,
    "makePolymerases":makePolymerases,
    "moveFreeMolecules":moveFreeMolecules,
    "nextInstruction":nextInstruction,
    "nextNucleotideUnzippedTheSame_p":nextNucleotideUnzippedTheSame_p,
    "previousInstruction":previousInstruction,
    "randomBaseLetter":randomBaseLetter,
    "refillOrRemoveNucleosides":refillOrRemoveNucleosides,
    "separateBasePairs":separateBasePairs,
    "setup":setup,
    "showInstruction":showInstruction,
    "timeRemainingToDisplay":timeRemainingToDisplay,
    "unwindDna":unwindDna,
    "unzipNucleotides":unzipNucleotides,
    "userMessageStringForMutations":userMessageStringForMutations,
    "visualizeAgents":visualizeAgents,
    "windDna":windDna,
    "windInitialDnaIntoBundle":windInitialDnaIntoBundle,
    "wouldTheseNucleotidesPairCorrectly_p":wouldTheseNucleotidesPairCorrectly_p
  };
})();
world.observer.setGlobal("dna-strand-length", 30);
world.observer.setGlobal("nucleo-labels?", true);
world.observer.setGlobal("enzyme-labels?", true);
world.observer.setGlobal("substitutions?", false);
world.observer.setGlobal("free-nucleosides", 50);
world.observer.setGlobal("time-limit", "none");
