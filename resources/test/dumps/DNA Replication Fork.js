var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Dump = tortoise_require('engine/dump');
var Exception = tortoise_require('util/exception');
var Extensions = tortoise_require('extensions/all');
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
    input: function(str) { return 'dummy implementation'; },
    notify: function(str) {},
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
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PHOSPHATES", singular: "phosphate", varNames: [] }, { name: "NUCLEOSIDES", singular: "nucleoside", varNames: ["class", "value", "place"] }, { name: "NUCLEOTIDES", singular: "nucleotide", varNames: ["class", "value", "place", "unwound?", "unzipped-stage"] }, { name: "POLYMERASES", singular: "polymerase", varNames: ["locked-state"] }, { name: "HELICASES", singular: "helicase", varNames: [] }, { name: "TOPOISOMERASES", singular: "topoisomerase", varNames: ["locked?"] }, { name: "TOPOISOMERASES-GEARS", singular: "topoisomerase-gear", varNames: [] }, { name: "PRIMASES", singular: "primase", varNames: [] }, { name: "NUCLEOTIDE-TAGS", singular: "nucleotide-tag", varNames: ["value"] }, { name: "ENZYME-TAGS", singular: "enzyme-tag", varNames: [] }, { name: "MOUSE-CURSORS", singular: "mouse-cursor", varNames: [] }, { name: "CHROMOSOME-BUILDERS", singular: "initial-chromosomes-builder", varNames: [] }, { name: "OLD-STAIRS", singular: "old-stair", varNames: [], isDirected: false }, { name: "NEW-STAIRS", singular: "new-stair", varNames: [], isDirected: false }, { name: "TAGLINES", singular: "tagline", varNames: [], isDirected: false }, { name: "GEARLINES", singular: "gearline", varNames: [], isDirected: true }, { name: "CURSOR-DRAGS", singular: "cursor-drag", varNames: [], isDirected: true }, { name: "BACKBONES", singular: "backbone", varNames: [], isDirected: true }])([], [])(["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit", "initial-length-dna", "mouse-continuous-down?", "instruction", "cursor-detect-color", "cursor-drag-color", "wound-dna-color", "unwound-dna-color", "nucleo-tag-color", "enzyme-tag-color", "nucleoside-color", "polymerase-color-0", "polymerase-color-1", "polymerase-color-2", "polymerase-color-3", "helicase-color-0", "helicase-color-1", "topoisomerase-color-0", "topoisomerase-color-1", "primase-color-0", "primase-color-1", "final-time", "total-deletion-mutations-top-strand", "total-substitution-mutations-top-strand", "total-correct-duplications-top-strand", "total-deletion-mutations-bottom-strand", "total-substitution-mutations-bottom-strand", "total-correct-duplications-bottom-strand", "lock-radius", "mouse-drag-radius", "molecule-step", "wind-angle", "length-of-simulation", "time-remaining", "current-instruction", "using-time-limit", "simulation-started?", "cell-divided?", "simulation-ended?", "cell-message-shown?", "timer-message-shown?"], ["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit"], [], 0, 16, -5, 4, 50.0, true, true, turtleShapes, linkShapes, function(){});
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["initializeLengthOfTime"] = temp;
  procs["INITIALIZE-LENGTH-OF-TIME"] = temp;
  temp = (function() {
    try {
      world.turtleManager.createTurtles(1, "NUCLEOSIDES").ask(function() {
        SelfManager.self().setVariable("value", procedures["RANDOM-BASE-LETTER"]());
        SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleoside-tri-") + Dump(SelfManager.self().getVariable("value"))));
        SelfManager.self().setVariable("color", world.observer.getGlobal("nucleoside-color"));
        procedures["ATTACH-NUCLEO-TAG"](0,0);
        SelfManager.self().setXY(Prims.randomPatchCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomPatchCoord(world.topology.minPycor, world.topology.maxPycor));
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeANucleoside"] = temp;
  procs["MAKE-A-NUCLEOSIDE"] = temp;
  temp = (function() {
    try {
      world.turtleManager.createTurtles(1, "POLYMERASES").ask(function() {
        SelfManager.self().setVariable("heading", Prims.random(((180 - Prims.random(20)) + Prims.random(20))));
        SelfManager.self().setXY((Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2) + 3), (world.topology.maxPycor - 1));
      }, true);
      world.turtleManager.createTurtles(1, "POLYMERASES").ask(function() {
        SelfManager.self().setVariable("heading", ((90 - Prims.random(20)) + Prims.random(20)));
        SelfManager.self().setXY((Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2) - 5), (world.topology.maxPycor - 1));
      }, true);
      world.turtleManager.turtlesOfBreed("POLYMERASES").ask(function() {
        procedures["ATTACH-ENZYME-TAG"](150,0.85,"polymerase");
        SelfManager.self().setVariable("locked-state", 0);
        SelfManager.self().setVariable("shape", "polymerase-0");
        SelfManager.self().setVariable("color", world.observer.getGlobal("polymerase-color-0"));
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makePolymerases"] = temp;
  procs["MAKE-POLYMERASES"] = temp;
  temp = (function() {
    try {
      world.turtleManager.createTurtles(1, "HELICASES").ask(function() {
        SelfManager.self().setVariable("shape", "helicase");
        SelfManager.self().setVariable("color", world.observer.getGlobal("helicase-color-0"));
        SelfManager.self().setVariable("size", 3.2);
        SelfManager.self().setVariable("heading", 90);
        procedures["ATTACH-ENZYME-TAG"](150,0.85,"helicase");
        SelfManager.self().setXY(Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2), (world.topology.maxPycor - 1));
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeAHelicase"] = temp;
  procs["MAKE-A-HELICASE"] = temp;
  temp = (function() {
    try {
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
        procedures["ATTACH-ENZYME-TAG"](150,0.85,"topoisomerase");
        SelfManager.self().setXY((Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2) - 3), (world.topology.maxPycor - 1));
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeATopoisomerase"] = temp;
  procs["MAKE-A-TOPOISOMERASE"] = temp;
  temp = (function() {
    try {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeAndAttachAPrimase"] = temp;
  procs["MAKE-AND-ATTACH-A-PRIMASE"] = temp;
  temp = (function() {
    try {
      let lastNucleotideTopStrand = Nobody;
      let lastNucleotideBottomStrand = Nobody;
      let placeCounter = 0;
      let firstBasePairValue = "";
      let is_ThisTheFirstBase_p = true;
      world.turtleManager.createTurtles(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS"));
        SelfManager.self().setVariable("heading", 90);
        SelfManager.self().fdOne();
      }, true);
      world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS").ask(function() {
        for (let _index_11870_11876 = 0, _repeatcount_11870_11876 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_11870_11876 < _repeatcount_11870_11876; _index_11870_11876++){
          placeCounter = (placeCounter + 1);
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
            SelfManager.self().setVariable("value", procedures["RANDOM-BASE-LETTER"]());
            firstBasePairValue = SelfManager.self().getVariable("value");
            SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleotide-") + Dump(SelfManager.self().getVariable("value"))));
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
            lastNucleotideTopStrand = SelfManager.self();
            if (is_ThisTheFirstBase_p) {
              procedures["MAKE-AND-ATTACH-A-PRIMASE"]();
            }
            is_ThisTheFirstBase_p = false;
            SelfManager.self().hatch(1, "").ask(function() {
              SelfManager.self().right(180);
              SelfManager.self().setVariable("value", procedures["COMPLEMENTARY-BASE"](firstBasePairValue));
              SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleotide-") + Dump(SelfManager.self().getVariable("value"))));
              SelfManager.self().setVariable("class", "original-dna-bottom");
              LinkPrims.createLinkWith(lastNucleotideTopStrand, "OLD-STAIRS").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
              procedures["ATTACH-NUCLEO-TAG"](175,0.7);
              if (!Prims.equality(lastNucleotideBottomStrand, Nobody)) {
                LinkPrims.createLinkTo(lastNucleotideBottomStrand, "BACKBONES").ask(function() {
                  SelfManager.self().setVariable("hidden?", true);
                  SelfManager.self().tie();
                }, true);
              }
              lastNucleotideBottomStrand = SelfManager.self();
            }, true);
          }, true);
          SelfManager.self().fdLessThan1(0.45);
        }
        SelfManager.self().die();
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["makeInitialDnaStrip"] = temp;
  procs["MAKE-INITIAL-DNA-STRIP"] = temp;
  temp = (function(direction, displacement) {
    try {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["attachNucleoTag"] = temp;
  procs["ATTACH-NUCLEO-TAG"] = temp;
  temp = (function(direction, displacement, labelValue) {
    try {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["attachEnzymeTag"] = temp;
  procs["ATTACH-ENZYME-TAG"] = temp;
  temp = (function() {
    try {
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
        UserDialogPrims.confirm((Dump('') + Dump("You have cued the cell division.  Let's see how you did in replicating ") + Dump("an exact copy of the DNA.")));
        UserDialogPrims.confirm(procedures["USER-MESSAGE-STRING-FOR-MUTATIONS"]());
        world.observer.setGlobal("cell-message-shown?", true);
      }
      if (((world.observer.getGlobal("using-time-limit") && Prims.lte(world.observer.getGlobal("time-remaining"), 0)) && !world.observer.getGlobal("timer-message-shown?"))) {
        if (Prims.equality(world.observer.getGlobal("final-time"), 0)) {
          world.observer.setGlobal("final-time", world.observer.getGlobal("length-of-simulation"));
        }
        procedures["CALCULATE-MUTATIONS"]();
        UserDialogPrims.confirm((Dump('') + Dump("The timer has expired.  Let's see how you did in replicating ") + Dump("an exact copy of it.")));
        UserDialogPrims.confirm(procedures["USER-MESSAGE-STRING-FOR-MUTATIONS"]());
        world.observer.setGlobal("timer-message-shown?", true);
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      if (!world.observer.getGlobal("simulation-started?")) {
        world.observer.setGlobal("simulation-started?", true);
        workspace.timer.reset();
      }
      if (world.observer.getGlobal("using-time-limit")) {
        world.observer.setGlobal("time-remaining", (world.observer.getGlobal("length-of-simulation") - workspace.timer.elapsed()));
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["checkTimer"] = temp;
  procs["CHECK-TIMER"] = temp;
  temp = (function() {
    try {
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
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["visualizeAgents"] = temp;
  procs["VISUALIZE-AGENTS"] = temp;
  temp = (function() {
    try {
      for (let _index_17643_17649 = 0, _repeatcount_17643_17649 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_17643_17649 < _repeatcount_17643_17649; _index_17643_17649++){
        procedures["WIND-DNA"]();
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["windInitialDnaIntoBundle"] = temp;
  procs["WIND-INITIAL-DNA-INTO-BUNDLE"] = temp;
  temp = (function() {
    try {
      let woundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); });
      if (!woundNucleotides.isEmpty()) {
        let maxWoundPlace = ListPrims.max(woundNucleotides.projectionBy(function() { return SelfManager.self().getVariable("place"); }));
        woundNucleotides.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), maxWoundPlace); }).ask(function() {
          SelfManager.self().right(-world.observer.getGlobal("wind-angle"));
          SelfManager.self().setVariable("unwound?", true);
          SelfManager.self().setVariable("color", world.observer.getGlobal("unwound-dna-color"));
          notImplemented('display', undefined)();
        }, true);
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["unwindDna"] = temp;
  procs["UNWIND-DNA"] = temp;
  temp = (function() {
    try {
      let unwoundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return ((SelfManager.self().getVariable("unwound?") && !Prims.equality(SelfManager.self().getVariable("class"), "copy-of-dna-bottom")) && !Prims.equality(SelfManager.self().getVariable("class"), "copy-of-dna-top"));
      });
      if (!unwoundNucleotides.isEmpty()) {
        let minUnwoundPlace = ListPrims.min(unwoundNucleotides.projectionBy(function() { return SelfManager.self().getVariable("place"); }));
        unwoundNucleotides.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), minUnwoundPlace); }).ask(function() {
          SelfManager.self().right(world.observer.getGlobal("wind-angle"));
          SelfManager.self().setVariable("unwound?", false);
          SelfManager.self().setVariable("color", world.observer.getGlobal("wound-dna-color"));
        }, true);
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["windDna"] = temp;
  procs["WIND-DNA"] = temp;
  temp = (function() {
    try {
      let wereAnyNucleotidesUnzippedFurther_p = false;
      world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return (procedures["NEXT-NUCLEOTIDE-UNZIPPED-THE-SAME?"]() && Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0));
      }).ask(function() {
        let fractionalSeparation = Prims.div(SelfManager.self().getVariable("unzipped-stage"), 2);
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
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["unzipNucleotides"] = temp;
  procs["UNZIP-NUCLEOTIDES"] = temp;
  temp = (function() {
    try {
      let lowestPlace = 0;
      world.turtleManager.turtlesOfBreed("HELICASES").ask(function() {
        let thisHelicase = SelfManager.self();
        let unzippedNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 0); });
        if (!unzippedNucleotides.isEmpty()) {
          lowestPlace = unzippedNucleotides.minOneOf(function() { return SelfManager.self().getVariable("place"); });
        }
        let availableNucleotides = unzippedNucleotides.agentFilter(function() {
          return (Prims.lt(SelfManager.self().distance(thisHelicase), 1) && procedures["ARE-PREVIOUS-NUCLEOTIDES-UNZIPPED?"]());
        });
        if (!availableNucleotides.isEmpty()) {
          let lowestValueNucleotide = availableNucleotides.minOneOf(function() { return SelfManager.self().getVariable("place"); });
          lowestValueNucleotide.ask(function() {
            let base = SelfManager.self();
            let basePlace = SelfManager.self().getVariable("place");
            let otherBase = SelfPrims.other(world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), basePlace); }));
            if (!otherBase.isEmpty()) {
              SelfManager.self().setVariable("unzipped-stage", 1);
              otherBase.ask(function() { SelfManager.self().setVariable("unzipped-stage", 1); }, true);
            }
          }, true);
        }
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["separateBasePairs"] = temp;
  procs["SEPARATE-BASE-PAIRS"] = temp;
  temp = (function() {
    try {
      let allMolecules = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("PHOSPHATES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES"));
      allMolecules.ask(function() {
        if (!procedures["BEING-DRAGGED-BY-CURSOR?"]()) {
          SelfManager.self().fd(world.observer.getGlobal("molecule-step"));
        }
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["moveFreeMolecules"] = temp;
  procs["MOVE-FREE-MOLECULES"] = temp;
  temp = (function() {
    try {
      world.turtleManager.turtlesOfBreed("PHOSPHATES").ask(function() {
        if ((((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.minPxcor) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.maxPxcor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.maxPycor))) {
          SelfManager.self().die();
        }
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["cleanUpFreePhosphates"] = temp;
  procs["CLEAN-UP-FREE-PHOSPHATES"] = temp;
  temp = (function() {
    try {
      if (Prims.lt(world.turtleManager.turtlesOfBreed("NUCLEOSIDES").size(), world.observer.getGlobal("free-nucleosides"))) {
        procedures["MAKE-A-NUCLEOSIDE"]();
      }
      if (Prims.gt(world.turtleManager.turtlesOfBreed("NUCLEOSIDES").size(), world.observer.getGlobal("free-nucleosides"))) {
        ListPrims.oneOf(world.turtleManager.turtlesOfBreed("NUCLEOSIDES")).ask(function() {
          LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().die(); }, true);
          SelfManager.self().die();
        }, true);
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["refillOrRemoveNucleosides"] = temp;
  procs["REFILL-OR-REMOVE-NUCLEOSIDES"] = temp;
  temp = (function() {
    try {
      let targetXcor = 0;
      let targetYcor = 0;
      let targetClass = "";
      world.turtleManager.turtlesOfBreed("POLYMERASES").ask(function() {
        let nucleosidesReadyToGearToPolymerase = Nobody;
        let potentialNucleosideReadyToGearToPolymerase = Nobody;
        let targetNucleotideReadyToGearToPolymerase = Nobody;
        nucleosidesReadyToGearToPolymerase = world.turtleManager.turtlesOfBreed("NUCLEOSIDES").agentFilter(function() {
          return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
        });
        if (Prims.gt(nucleosidesReadyToGearToPolymerase.size(), 1)) {
          potentialNucleosideReadyToGearToPolymerase = nucleosidesReadyToGearToPolymerase.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); });
        }
        if (Prims.equality(nucleosidesReadyToGearToPolymerase.size(), 1)) {
          potentialNucleosideReadyToGearToPolymerase = nucleosidesReadyToGearToPolymerase;
        }
        let nucleotidesReadyToGearToPolymerase = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
          return (((!!LinkPrims.myLinks("OLD-STAIRS").isEmpty() && !!LinkPrims.myLinks("NEW-STAIRS").isEmpty()) && (Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom") || Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top"))) && Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius")));
        });
        if (((!nucleotidesReadyToGearToPolymerase.isEmpty() && procedures["ALL-BASE-PAIRS-UNWOUND?"]()) && !procedures["BEING-DRAGGED-BY-CURSOR?"]())) {
          targetNucleotideReadyToGearToPolymerase = nucleotidesReadyToGearToPolymerase.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); });
          targetXcor = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("xcor"); });
          targetYcor = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("ycor"); });
          targetClass = targetNucleotideReadyToGearToPolymerase.projectionBy(function() { return SelfManager.self().getVariable("class"); });
          SelfManager.self().setXY(targetXcor, targetYcor);
        }
        if ((!!nucleotidesReadyToGearToPolymerase.isEmpty() || SelfPrims.anyOther(SelfManager.self().breedHere("POLYMERASES")))) {
          SelfManager.self().setVariable("locked-state", 0);
        }
        if ((((!nucleotidesReadyToGearToPolymerase.isEmpty() && procedures["ALL-BASE-PAIRS-UNWOUND?"]()) && Prims.equality(potentialNucleosideReadyToGearToPolymerase, Nobody)) && !SelfPrims.anyOther(SelfManager.self().breedHere("POLYMERASES")))) {
          SelfManager.self().setVariable("locked-state", 1);
        }
        if ((((!Prims.equality(targetNucleotideReadyToGearToPolymerase, Nobody) && procedures["ALL-BASE-PAIRS-UNWOUND?"]()) && !Prims.equality(potentialNucleosideReadyToGearToPolymerase, Nobody)) && !SelfPrims.anyOther(SelfManager.self().breedHere("POLYMERASES")))) {
          SelfManager.self().setVariable("locked-state", 2);
          if ((procedures["WOULD-THESE-NUCLEOTIDES-PAIR-CORRECTLY?"](targetNucleotideReadyToGearToPolymerase,potentialNucleosideReadyToGearToPolymerase) || world.observer.getGlobal("substitutions?"))) {
            potentialNucleosideReadyToGearToPolymerase.ask(function() {
              LinkPrims.myInLinks("CURSOR-DRAGS").ask(function() { SelfManager.self().die(); }, true);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().die(); }, true);
              SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
              SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleotide-") + Dump(SelfManager.self().getVariable("value"))));
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["lockPolymeraseToOneNucleotide"] = temp;
  procs["LOCK-POLYMERASE-TO-ONE-NUCLEOTIDE"] = temp;
  temp = (function() {
    try {
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PHOSPHATES"));
        SelfManager.self().setVariable("shape", "phosphate-pair");
        SelfManager.self().setVariable("heading", Prims.random(360));
      }, true);
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["breakOffPhosphatesFromNucleoside"] = temp;
  procs["BREAK-OFF-PHOSPHATES-FROM-NUCLEOSIDE"] = temp;
  temp = (function() {
    try {
      let targetXcor = 0;
      let targetYcor = 0;
      let targetClass = "";
      let woundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); });
      world.turtleManager.turtlesOfBreed("TOPOISOMERASES").ask(function() {
        if (!woundNucleotides.isEmpty()) {
          let targetPrimasesReadyToGearToTopoisomerase = world.turtleManager.turtlesOfBreed("PRIMASES").agentFilter(function() {
            return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
          });
          if (!targetPrimasesReadyToGearToTopoisomerase.isEmpty()) {
            let targetPrimaseReadyToGearToTopoisomerase = ListPrims.oneOf(targetPrimasesReadyToGearToTopoisomerase);
            SelfManager.self().setVariable("locked?", true);
            if (!MousePrims.isDown()) {
              procedures["UNWIND-DNA"]();
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
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["lockTopoisomeraseToWoundPrimase"] = temp;
  procs["LOCK-TOPOISOMERASE-TO-WOUND-PRIMASE"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("total-deletion-mutations-top-strand", 0);
      world.observer.setGlobal("total-substitution-mutations-top-strand", 0);
      world.observer.setGlobal("total-correct-duplications-top-strand", 0);
      world.observer.setGlobal("total-deletion-mutations-bottom-strand", 0);
      world.observer.setGlobal("total-substitution-mutations-bottom-strand", 0);
      world.observer.setGlobal("total-correct-duplications-bottom-strand", 0);
      let originalNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top"); });
      originalNucleotides.ask(function() {
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
      originalNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom"); });
      originalNucleotides.ask(function() {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["calculateMutations"] = temp;
  procs["CALCULATE-MUTATIONS"] = temp;
  temp = (function() {
    try {
      let pMouseXcor = MousePrims.getX();
      let pMouseYcor = MousePrims.getY();
      let currentMouseDown_p = MousePrims.isDown();
      let targetTurtle = Nobody;
      let currentMouseInside_p = MousePrims.isInside();
      world.turtleManager.turtlesOfBreed("MOUSE-CURSORS").ask(function() {
        SelfManager.self().setXY(pMouseXcor, pMouseYcor);
        SelfManager.self().setVariable("hidden?", true);
        let allMoveableMolecules = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES"));
        let draggableMolecules = allMoveableMolecules.agentFilter(function() {
          return (!procedures["BEING-DRAGGED-BY-CURSOR?"]() && Prims.lte(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("mouse-drag-radius")));
        });
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
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["detectMouseSelectionEvent"] = temp;
  procs["DETECT-MOUSE-SELECTION-EVENT"] = temp;
  temp = (function() {
    try {
      let r = Prims.random(4);
      let letterToReport = "";
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
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["randomBaseLetter"] = temp;
  procs["RANDOM-BASE-LETTER"] = temp;
  temp = (function(base) {
    try {
      let baseToReport = "";
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
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["complementaryBase"] = temp;
  procs["COMPLEMENTARY-BASE"] = temp;
  temp = (function() {
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
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["timeRemainingToDisplay"] = temp;
  procs["TIME-REMAINING-TO-DISPLAY"] = temp;
  temp = (function() {
    try {
      if (!LinkPrims.outLinkNeighbors("CURSOR-DRAGS").isEmpty()) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["is_ThisCursorDraggingAnything_p"] = temp;
  procs["IS-THIS-CURSOR-DRAGGING-ANYTHING?"] = temp;
  temp = (function() {
    try {
      if (!LinkPrims.myInLinks("CURSOR-DRAGS").isEmpty()) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["beingDraggedByCursor_p"] = temp;
  procs["BEING-DRAGGED-BY-CURSOR?"] = temp;
  temp = (function() {
    try {
      if (!world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); }).isEmpty()) {
        throw new Exception.ReportInterrupt(false);
      }
      else {
        throw new Exception.ReportInterrupt(true);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["allBasePairsUnwound_p"] = temp;
  procs["ALL-BASE-PAIRS-UNWOUND?"] = temp;
  temp = (function(nucleotide1, nucleotide2) {
    try {
      if (Prims.equality(procedures["COMPLEMENTARY-BASE"](nucleotide1.projectionBy(function() { return SelfManager.self().getVariable("value"); })), ListPrims.item(0, nucleotide2.projectionBy(function() { return SelfManager.self().getVariable("value"); })))) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["wouldTheseNucleotidesPairCorrectly_p"] = temp;
  procs["WOULD-THESE-NUCLEOTIDES-PAIR-CORRECTLY?"] = temp;
  temp = (function() {
    try {
      let originalNucleotide = SelfManager.self();
      let thisStair = ListPrims.oneOf(LinkPrims.myLinks("NEW-STAIRS"));
      let thisPairedNucleotide = Nobody;
      let overwrite_p = false;
      thisStair.ask(function() {
        thisPairedNucleotide = SelfManager.self().otherEnd();
        if (!Prims.equality(thisPairedNucleotide, Nobody)) {
          if ((!Prims.equality(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("class"); }), "copy-of-dna-bottom") && !Prims.equality(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("class"); }), "copy-of-dna-top"))) {
            overwrite_p = true;
          }
        }
      }, true);
      if ((Prims.equality(SelfManager.self().getVariable("value"), procedures["COMPLEMENTARY-BASE"](thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("value"); }))) && !overwrite_p)) {
        throw new Exception.ReportInterrupt(true);
      }
      else {
        throw new Exception.ReportInterrupt(false);
      }
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["is_ThisNucleotidePairedCorrectly_p"] = temp;
  procs["IS-THIS-NUCLEOTIDE-PAIRED-CORRECTLY?"] = temp;
  temp = (function() {
    try {
      let myUnzippedStage = SelfManager.self().getVariable("unzipped-stage");
      let myPlace = SelfManager.self().getVariable("place");
      let myClass = SelfManager.self().getVariable("class");
      let nextNucleotidesAvailable = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return ((Prims.equality(SelfManager.self().getVariable("class"), myClass) && Prims.equality(SelfManager.self().getVariable("place"), (myPlace + 1))) && Prims.equality(SelfManager.self().getVariable("unzipped-stage"), myUnzippedStage));
      });
      let canContinueToUnzip_p = false;
      if (Prims.lt(myPlace, world.observer.getGlobal("dna-strand-length"))) {
        if ((!nextNucleotidesAvailable.isEmpty() && procedures["ARE-PREVIOUS-NUCLEOTIDES-UNZIPPED?"]())) {
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
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["nextNucleotideUnzippedTheSame_p"] = temp;
  procs["NEXT-NUCLEOTIDE-UNZIPPED-THE-SAME?"] = temp;
  temp = (function() {
    try {
      let myPlace = SelfManager.self().getVariable("place");
      let previousNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), (myPlace - 1)); });
      let valueToReturn = false;
      if (!!previousNucleotides.isEmpty()) {
        valueToReturn = true;
      }
      else {
        let previousNucleotidesAreUnzipped = previousNucleotides.agentFilter(function() { return Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0); });
        if (!previousNucleotidesAreUnzipped.isEmpty()) {
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
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["arePreviousNucleotidesUnzipped_p"] = temp;
  procs["ARE-PREVIOUS-NUCLEOTIDES-UNZIPPED?"] = temp;
  temp = (function() {
    try {
      let duplicationRate = NLMath.precision(Prims.div((world.observer.getGlobal("total-correct-duplications-top-strand") + world.observer.getGlobal("total-correct-duplications-bottom-strand")), world.observer.getGlobal("final-time")), 4);
      throw new Exception.ReportInterrupt((Dump('') + Dump("You had ") + Dump((world.observer.getGlobal("total-correct-duplications-top-strand") + world.observer.getGlobal("total-correct-duplications-bottom-strand"))) + Dump(" correct replications and ") + Dump((world.observer.getGlobal("total-substitution-mutations-top-strand") + world.observer.getGlobal("total-substitution-mutations-bottom-strand"))) + Dump(" substitutions and ") + Dump((world.observer.getGlobal("total-deletion-mutations-top-strand") + world.observer.getGlobal("total-deletion-mutations-bottom-strand"))) + Dump("  deletions.") + Dump(" That replication process took you ") + Dump(world.observer.getGlobal("final-time")) + Dump(" seconds.  This was a rate of ") + Dump(duplicationRate) + Dump(" correct nucleotides duplicated per second.")));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["userMessageStringForMutations"] = temp;
  procs["USER-MESSAGE-STRING-FOR-MUTATIONS"] = temp;
  temp = (function() {
    try {
      throw new Exception.ReportInterrupt((Prims.equality(world.observer.getGlobal("current-instruction"), 0) ? "press setup" : (Dump('') + Dump(world.observer.getGlobal("current-instruction")) + Dump(" / ") + Dump(ListPrims.length(procedures["INSTRUCTIONS"]())))));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
    }
  });
  procs["currentInstructionLabel"] = temp;
  procs["CURRENT-INSTRUCTION-LABEL"] = temp;
  temp = (function() {
    try {
      procedures["SHOW-INSTRUCTION"]((world.observer.getGlobal("current-instruction") + 1));
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["nextInstruction"] = temp;
  procs["NEXT-INSTRUCTION"] = temp;
  temp = (function() {
    try {
      procedures["SHOW-INSTRUCTION"]((world.observer.getGlobal("current-instruction") - 1));
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["previousInstruction"] = temp;
  procs["PREVIOUS-INSTRUCTION"] = temp;
  temp = (function(i) {
    try {
      if ((Prims.gte(i, 1) && Prims.lte(i, ListPrims.length(procedures["INSTRUCTIONS"]())))) {
        world.observer.setGlobal("current-instruction", i);
        OutputPrims.clear();
        Tasks.forEach(Tasks.commandTask(function(_0) {
          if (arguments.length < 1) {
            throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
          }
          OutputPrims.print(_0);
        }), ListPrims.item((world.observer.getGlobal("current-instruction") - 1), procedures["INSTRUCTIONS"]()));
      }
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["showInstruction"] = temp;
  procs["SHOW-INSTRUCTION"] = temp;
  temp = (function() {
    try {
      throw new Exception.ReportInterrupt([["You will be simulating the process", "of DNA replication that occurs in", "every cell in every living creature", "as part of mitosis or meiosis."], ["To do this you will need to complete", "4 tasks in the shortest time you", "can. Each of these tasks requires", "you to drag a molecule using your", "mouse, from one location to another."], ["The 1st task will be to unwind a ", "twisted bundle of DNA by using your", "mouse to place a topoisomerase ", "enzyme on top of the primase enzyme."], ["The 2nd task will be to unzip the", "DNA ladder structure by dragging", "a helicase enzyme from the 1st ", "base pair to the last base pair."], ["The 3rd task will be to first drag", "a polymerase enzyme to an open", "nucleotide and then drag a floating", "nucleoside to the same location."], ["The last task is to simply repeat", "the previous task of connecting", "nucleosides to open nucleotides", "until as much of the DNA as", "possible has been replicated."], ["The simulation ends either when", "the timer runs out (if the timer?", "chooser is set to YES) or when you", "press the DIVIDE THE CELL button"]]);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else if (e instanceof Exception.StopInterrupt) {
        throw new Error("STOP is not allowed inside TO-REPORT.");
      } else {
        throw e;
      }
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
