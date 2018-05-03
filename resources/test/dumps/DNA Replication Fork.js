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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[150,165,165,180,180,195,195,210,210,165,165,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,135,120,120,105,105,90,90,135,135,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"empty":{"name":"empty","editableColorIndex":0,"rotate":false,"elements":[]},"helicase":{"name":"helicase","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"helicase-expanded":{"name":"helicase-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"nucleoside-tri-a":{"name":"nucleoside-tri-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-c":{"name":"nucleoside-tri-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,135,165,165,135,60],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-g":{"name":"nucleoside-tri-g","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-t":{"name":"nucleoside-tri-t","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false}]},"nucleotide-a":{"name":"nucleotide-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"nucleotide-c":{"name":"nucleotide-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"nucleotide-g":{"name":"nucleotide-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleotide-t":{"name":"nucleotide-t","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"phosphate":{"name":"phosphate","editableColorIndex":0,"rotate":true,"elements":[{"x":129,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"phosphate-pair":{"name":"phosphate-pair","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":135,"x2":150,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":144,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":99,"y":120,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"polymerase-0":{"name":"polymerase-0","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,60,60,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":0,"xmax":120,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true}]},"polymerase-1":{"name":"polymerase-1","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true}]},"polymerase-2":{"name":"polymerase-2","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"x1":180,"y1":60,"x2":180,"y2":240,"type":"line","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true}]},"polymerase-3":{"name":"polymerase-3","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"primase":{"name":"primase","editableColorIndex":1,"rotate":true,"elements":[{"xcors":[90,75,90,120,150,150,180,180,225,285,285,270,240,210,195,195,180,150,105,75,60,60],"ycors":[195,240,270,255,270,300,300,270,255,195,180,165,150,165,165,135,90,90,90,120,150,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false},{"x":135,"y":135,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"target":{"name":"target","editableColorIndex":0,"rotate":true,"elements":[{"x":76,"y":76,"diam":146,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":60,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":195,"x2":150,"y2":240,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"topoisomerase":{"name":"topoisomerase","editableColorIndex":0,"rotate":true,"elements":[{"x":45,"y":45,"diam":210,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":129,"diam":44,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"topoisomerase-gears":{"name":"topoisomerase-gears","editableColorIndex":0,"rotate":true,"elements":[{"xmin":135,"ymin":15,"xmax":165,"ymax":60,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":240,"ymin":135,"xmax":285,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":135,"ymin":240,"xmax":165,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":15,"ymin":135,"xmax":60,"ymax":165,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[60,105,75,45],"ycors":[255,225,195,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[45,75,105,60],"ycors":[60,105,75,45],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[240,195,225,255],"ycors":[45,75,105,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,225,195,240],"ycors":[240,195,225,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "PHOSPHATES", singular: "phosphate", varNames: [] }, { name: "NUCLEOSIDES", singular: "nucleoside", varNames: ["class", "value", "place"] }, { name: "NUCLEOTIDES", singular: "nucleotide", varNames: ["class", "value", "place", "unwound?", "unzipped-stage"] }, { name: "POLYMERASES", singular: "polymerase", varNames: ["locked-state"] }, { name: "HELICASES", singular: "helicase", varNames: [] }, { name: "TOPOISOMERASES", singular: "topoisomerase", varNames: ["locked?"] }, { name: "TOPOISOMERASES-GEARS", singular: "topoisomerase-gear", varNames: [] }, { name: "PRIMASES", singular: "primase", varNames: [] }, { name: "NUCLEOTIDE-TAGS", singular: "nucleotide-tag", varNames: ["value"] }, { name: "ENZYME-TAGS", singular: "enzyme-tag", varNames: [] }, { name: "MOUSE-CURSORS", singular: "mouse-cursor", varNames: [] }, { name: "CHROMOSOME-BUILDERS", singular: "initial-chromosomes-builder", varNames: [] }, { name: "OLD-STAIRS", singular: "old-stair", varNames: [], isDirected: false }, { name: "NEW-STAIRS", singular: "new-stair", varNames: [], isDirected: false }, { name: "TAGLINES", singular: "tagline", varNames: [], isDirected: false }, { name: "GEARLINES", singular: "gearline", varNames: [], isDirected: true }, { name: "CURSOR-DRAGS", singular: "cursor-drag", varNames: [], isDirected: true }, { name: "BACKBONES", singular: "backbone", varNames: [], isDirected: true }])([], [])('                                                        ;;;;;;;;;;;;; small molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\nbreed [phosphates phosphate]                            ;; the free floating phosphates that are broken off a nucleoside-tri-phosphate when a nucleotide is formed\nbreed [nucleosides nucleoside]                          ;; the free floating nucleoside-tri-phosphates\nbreed [nucleotides nucleotide]                          ;; the pieces that are inside the DNA chain\n\n                                                        ;;;;;;;;;;;;enzymes ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\nbreed [polymerases polymerase]                          ;; for gearing a hydrogen \"old-stair\" bond of free nucleosides to existing nucleotides\nbreed [helicases helicase]                              ;; for unzipping a DNA strand\nbreed [topoisomerases topoisomerase]                    ;; for unwinding a DNA chromosome\nbreed [topoisomerases-gears topoisomerase-gear]         ;; for visualizing a spin in topoisomerases when unwinding a DNA chromosome\nbreed [primases primase]                                ;; for attaching to the first nucleotide on the top strand.\n                                                        ;;   It marks the location where the topoisomerase must be to unwind\n\n                                                        ;;;;;;;;;;;;; label turtles  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\nbreed [nucleotide-tags nucleotide-tag]                  ;; the turtle tied to the nucleotide that supports a fine tuned placement of the A, G, C, T lettering\nbreed [enzyme-tags enzyme-tag]                          ;; the turtle tied to the helicase and polymerase that supports a fine tuned placement of the label\n\n                                                        ;;;;;;;;;;;;; visualization turtles ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\nbreed [mouse-cursors mouse-cursor]                      ;; follows the cursor location\nbreed [chromosome-builders initial-chromosomes-builder] ;; initial temporary construction turtle\n\n                                                        ;;;;;;;;;;;;; links ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\nundirected-link-breed [old-stairs old-stair]            ;; links between nucleotide base pairs that made the old stairs of the \"spiral staircase\" in the DNA\nundirected-link-breed [new-stairs new-stair]            ;; links between nucleotide base pairs that makes the new stairs of the \"spiral staircase\" in the replicated DNA\nundirected-link-breed [taglines tagline]                ;; links between an agent and where its label agent is. This allows fine tuned placement of visualizing of labels\ndirected-link-breed [gearlines gearline]                ;; links between topoisomerase and its topoisomerases-gears\ndirected-link-breed [cursor-drags cursor-drag]          ;; links the mouse-cursor and any other agent it is dragging with it during a mouse-down? event\ndirected-link-breed [backbones backbone]                ;; links between adjacent nucleotides on the same side of the DNA strand -\n                                                        ;;   this represents the sugar backbone of the strand it allows the entire strand to be wound or unwound\n\n                                                        ;;;;;;;;;;;;;;;;;;;turtle variables ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\nnucleosides-own [class value place]                     ;; class is top or bottom and copy or original / value is A, G, C, or T /  place is a # of order in sequence\nnucleotides-own [                                       ;; nucleotides may be any of 4 unzipped-stages (how far the zipper is undone)\n  class value\n  place unwound?\n  unzipped-stage\n]\nnucleotide-tags-own [value]                             ;; the value for their label when visualized\npolymerases-own [locked-state]                          ;; locked-state can be four possible values for polymerase for when it is bound to a nucleotide and\n                                                        ;;   responding to confirmation of whether a matched nucleoside is nearby or not\ntopoisomerases-own [locked?]                            ;; locked? is true/false for when the topoisomerase is on the site of the primase\n\nglobals [                                               ;;;;;;;;;;;;;;;;;;;;globals ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n  initial-length-dna\n  mouse-continuous-down?\n\n  instruction ;; counter which keeps track of which instruction is being displayed in the output\n\n  ;; colors for various agents and states of agents\n  cursor-detect-color\n  cursor-drag-color\n  wound-dna-color\n  unwound-dna-color\n  nucleo-tag-color\n  enzyme-tag-color\n  nucleoside-color\n\n  ;; colors for the four different states the polymerase enzyme can be in\n  polymerase-color-0\n  polymerase-color-1\n  polymerase-color-2\n  polymerase-color-3\n\n  ;; colors for the two different states the helicase enzyme can be in\n  helicase-color-0\n  helicase-color-1\n\n  ;; colors for the two different states the topoisomerase enzyme can be in\n  topoisomerase-color-0\n  topoisomerase-color-1\n\n  ;; colors for the two different states the primase enzyme can be in\n  primase-color-0\n  primase-color-1\n\n  final-time\n\n  ;; for keeping track of the total number of mutations\n  total-deletion-mutations-top-strand\n  total-substitution-mutations-top-strand\n  total-correct-duplications-top-strand\n  total-deletion-mutations-bottom-strand\n  total-substitution-mutations-bottom-strand\n  total-correct-duplications-bottom-strand\n\n  lock-radius           ;; how far away an enzyme must be from a target interaction (with another molecule )\n                        ;;   for it to lock those molecules (or itself) into a confirmation state/site\n  mouse-drag-radius     ;; how far away a molecule must be in order for the mouse-cursor to link to it and the user to be able to drag it (with mouse-down?\n  molecule-step         ;; how far each molecules moves each tick\n  wind-angle            ;; angle of winding used for twisting up the DNA\n\n  length-of-simulation  ;; number of seconds for this simulation\n  time-remaining        ;; time-remaining in the simulation\n  current-instruction   ;; counter for keeping track of which instruction is displayed in output window\n  using-time-limit      ;; boolean for keeping track of whether this is a timed model run\n  simulation-started?   ;; boolean for keeping track of whether the simulation started\n  cell-divided?         ;; boolean for keeping track of whether the end of the simulation was cued\n  simulation-ended?     ;; boolean for keeping track of whether the end of the simulation ended\n  cell-message-shown?   ;; boolean for keep track of whether the cell message was shown\n  timer-message-shown?  ;; boolean for keeping track of whether the timer message was shown\n\n]\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;setup procedures;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto setup\n  clear-all\n\n  set polymerase-color-0    [150 150 150 150]\n  set polymerase-color-1    [75  200  75 200]\n  set polymerase-color-2    [0   255   0 220]\n  set polymerase-color-3    [255   0   0 220]\n  set nucleo-tag-color      [255 255 255 200]\n  set enzyme-tag-color      [255 255 255 200]\n  set primase-color-0       [255 255 255 150]\n  set primase-color-1       [255 255 255 200]\n  set helicase-color-1      [255 255 210 200]\n  set helicase-color-0      [255 255 210 150]\n  set topoisomerase-color-0 [210 255 255 150]\n  set topoisomerase-color-1 [180 255 180 220]\n  set nucleoside-color      [255 255 255 150]\n  set wound-dna-color       [255 255 255 150]\n  set unwound-dna-color     [255 255 255 255]\n  set cursor-detect-color   [255 255 255 150]\n  set cursor-drag-color     [255 255 255 200]\n  set instruction 0\n  set wind-angle 25\n  set lock-radius 0.3\n  set mouse-drag-radius 0.4\n  set molecule-step 0.025\n  set final-time 0\n  set current-instruction 0\n\n  set total-deletion-mutations-top-strand \"N/A\"\n  set total-substitution-mutations-top-strand  \"N/A\"\n  set total-correct-duplications-top-strand  \"N/A\"\n  set total-deletion-mutations-bottom-strand  \"N/A\"\n  set total-substitution-mutations-bottom-strand  \"N/A\"\n  set total-correct-duplications-bottom-strand  \"N/A\"\n\n  set-default-shape chromosome-builders \"empty\"\n  set-default-shape nucleotide-tags \"empty\"\n\n  set mouse-continuous-down? false\n  set simulation-started? false\n  set length-of-simulation 0\n  set using-time-limit false\n  set cell-divided? false\n  set simulation-ended? false\n  set cell-message-shown? false\n  set timer-message-shown? false\n  set initial-length-dna dna-strand-length\n\n  create-mouse-cursors 1 [set shape \"target\" set color [255 255 255 100] set hidden? true] ;; make turtle for mouse cursor\n  repeat free-nucleosides [make-a-nucleoside ] ;;make initial nucleosides\n  make-initial-dna-strip\n  make-polymerases\n  make-a-helicase\n  make-a-topoisomerase\n  wind-initial-dna-into-bundle\n  visualize-agents\n\n  initialize-length-of-time\n  show-instruction 1\n  reset-ticks\nend\n\nto initialize-length-of-time\n  set using-time-limit (time-limit != \"none\") ;*** replaces: ifelse time-limit = \"none\"  [set using-time-limit false] [set using-time-limit true]\n  if time-limit = \"2 minutes\" [set length-of-simulation 120 set time-remaining 120]\n  if time-limit = \"5 minutes\" [set length-of-simulation 300 set time-remaining 300]\nend\n\nto make-a-nucleoside\n  create-nucleosides 1 [\n    set value random-base-letter\n    set shape (word \"nucleoside-tri-\" value)\n    set color nucleoside-color\n    attach-nucleo-tag 0 0\n    setxy random-pxcor random-pycor ;*** replaces: setxy random 100 random 100 (see log for explanation)\n                                    ;*** removed: set heading random 360 (the heading is already random when the turtle is created)\n  ]\nend\n\n;; make two polymerases\nto make-polymerases\n  create-polymerases 1 [\n    set heading random (180 - random 20 + random 20)\n    setxy (((max-pxcor - min-pxcor) / 2) + 3) (max-pycor - 1)\n  ]\n  create-polymerases 1 [\n    set heading (90 - random 20 + random 20)\n    setxy (((max-pxcor - min-pxcor) / 2) - 5) (max-pycor - 1)\n  ]\n  ask polymerases [\n    attach-enzyme-tag 150 .85 \"polymerase\"\n    set locked-state 0\n    set shape \"polymerase-0\"\n    set color polymerase-color-0\n  ]\nend\n\nto make-a-helicase\n  create-helicases 1 [\n    set shape \"helicase\"\n    set color helicase-color-0\n    set size 3.2\n    set heading 90\n    attach-enzyme-tag 150 .85 \"helicase\"\n    setxy (((max-pxcor - min-pxcor) / 2)) (max-pycor - 1)\n  ]\nend\n\nto make-a-topoisomerase\n  create-topoisomerases 1 [\n    set shape \"topoisomerase\"\n    set locked? false\n    set color topoisomerase-color-0\n    set size 1.5\n    set heading -90 + random-float 10 - random-float 10\n    hatch 1 [set breed topoisomerases-gears set shape \"topoisomerase-gears\" create-gearline-from myself [set tie-mode \"fixed\" set hidden? true tie]]\n    attach-enzyme-tag 150 .85 \"topoisomerase\"\n    setxy (((max-pxcor - min-pxcor) / 2) - 3) (max-pycor - 1)\n  ]\nend\n\n;; primase is attached to the very first nucleotide in the initial DNA strand\nto make-and-attach-a-primase\n  hatch 1 [\n    set breed primases\n    set shape \"primase\"\n    set color primase-color-0\n    set size 1.7\n    set heading -13\n    fd 1.1\n    create-gearline-from myself [set tie-mode \"fixed\" set hidden? true tie]\n    attach-enzyme-tag 100 0 \"primase\"\n  ]\nend\n\nto make-initial-dna-strip\n  let last-nucleotide-top-strand nobody\n  let last-nucleotide-bottom-strand nobody\n  let place-counter 0\n  let first-base-pair-value \"\"\n  let is-this-the-first-base? true\n  create-turtles 1 [set breed chromosome-builders set heading 90 fd 1 ]\n\n  ask chromosome-builders [\n    repeat initial-length-dna [\n      set place-counter place-counter + 1\n      hatch 1 [\n        set breed nucleotides\n        set value random-base-letter\n        set first-base-pair-value value\n        set shape (word \"nucleotide-\" value)\n        set heading 0\n        set class \"original-dna-top\"\n        set unwound? true\n        set color unwound-dna-color\n        set place place-counter\n        set unzipped-stage 0\n        attach-nucleo-tag 5 0.5\n        if last-nucleotide-top-strand != nobody [create-backbone-to last-nucleotide-top-strand [set hidden? true tie]]\n        set last-nucleotide-top-strand self\n        if is-this-the-first-base? [make-and-attach-a-primase]\n        set is-this-the-first-base? false\n\n        ;; make complementary base side\n        hatch 1 [     ;*** removed \"if true\", which was probably a left over from some experimentation...\n          rt 180\n          set value complementary-base first-base-pair-value  ;; this second base pair value is based on the first base pair value\n          set shape (word \"nucleotide-\" value)\n          set class \"original-dna-bottom\"\n          create-old-stair-with last-nucleotide-top-strand [set hidden? false]\n          attach-nucleo-tag 175 0.7\n          if last-nucleotide-bottom-strand != nobody [create-backbone-to last-nucleotide-bottom-strand [set hidden? true tie]]\n          set last-nucleotide-bottom-strand self\n        ]\n      ]\n      fd .45\n    ]\n    die ;; remove the chromosome builder (a temporary construction turtle)\n  ]\nend\n\n;; fine tuned placement of the location of a label for a nucleoside or nucleotide\nto attach-nucleo-tag [direction displacement]\n  hatch 1 [\n    set heading direction\n    fd displacement\n    set breed nucleotide-tags\n    set label value\n    set size 0.1\n    set color nucleo-tag-color\n    create-tagline-with myself [set tie-mode \"fixed\" set hidden? true tie]\n  ]\nend\n\n;; fine tuned placement of the location of a label for any enzyme\nto attach-enzyme-tag [direction displacement label-value]\n  hatch 1 [\n    set heading direction\n    fd displacement\n    set breed enzyme-tags\n    set shape \"empty\"\n    set label label-value\n    set color enzyme-tag-color\n    set size 0.1\n    create-tagline-with myself [set tie-mode \"fixed\" set hidden? true tie]\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;; runtime procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto go\n  ;; run if the timer is being used and time remains, or if the timer is not being used and the cell division has not been cued by the user\n  if ((using-time-limit and time-remaining > 0) or (not using-time-limit and not cell-divided?)) [\n    check-timer\n    move-free-molecules\n    clean-up-free-phosphates\n    refill-or-remove-nucleosides\n    unzip-nucleotides\n    detect-mouse-selection-event\n    lock-polymerase-to-one-nucleotide\n    lock-topoisomerase-to-wound-primase\n    if all-base-pairs-unwound? [separate-base-pairs] ;; only check base pair separation once all base pairs are unwound\n    visualize-agents\n    tick\n  ]\n  if (cell-divided? and not cell-message-shown?) [\n    if final-time = 0 [ set final-time timer ]  ;; record final time\n    calculate-mutations\n    user-message (word \"You have cued the cell division.  Let\'s see how you did in replicating \"\n      \"an exact copy of the DNA.\")\n    user-message user-message-string-for-mutations\n    set cell-message-shown? true\n  ]\n  if ((using-time-limit and time-remaining <= 0) and not timer-message-shown?) [\n    if final-time = 0 [ set final-time length-of-simulation ]  ;; record final time\n    calculate-mutations\n    user-message (word \"The timer has expired.  Let\'s see how you did in replicating \"\n      \"an exact copy of it.\")\n    user-message  user-message-string-for-mutations\n    set timer-message-shown? true\n  ]\nend\n\nto check-timer\n  if not simulation-started? [\n    set simulation-started? true\n    reset-timer\n  ]\n  if using-time-limit [set time-remaining (length-of-simulation - timer)]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;; visualization procedures ;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto visualize-agents\n  ask enzyme-tags      [ set hidden? not enzyme-labels?]\n  ask nucleotide-tags  [ set hidden? not nucleo-labels?]\n  ask topoisomerases [\n    ;; spin at different speeds depending if you are locked into the primase location\n    ifelse locked?\n      [ask topoisomerases-gears [lt 10 set color topoisomerase-color-1]]\n      [ask topoisomerases-gears [lt 3  set color topoisomerase-color-0]]\n  ]\n  ask polymerases [\n    if locked-state = 0 [set shape \"polymerase-0\" set color polymerase-color-0]   ;; free floating polymerases not locked into a nucleotide\n    if locked-state = 1 [set shape \"polymerase-1\" set color polymerase-color-1]   ;; polymerase ready to lock onto nearest open nucleotide (or locked on)\n    if locked-state = 2 [set shape \"polymerase-2\" set color polymerase-color-2]   ;; polymerase ready to gear two nucleotides together\n    if locked-state = 3 [set shape \"polymerase-3\" set color polymerase-color-3]   ;; polymerase will reject the nucleoside you are trying to the nucleotide\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;; winding and unwinding chromosome procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto wind-initial-dna-into-bundle\n  repeat (initial-length-dna ) [ wind-dna ]\nend\n\nto unwind-dna\n  let wound-nucleotides nucleotides with [not unwound?]\n  if any? wound-nucleotides [\n    let max-wound-place max [place] of wound-nucleotides\n    ask wound-nucleotides with [place = max-wound-place] [\n      lt wind-angle  ;; left turn unwinds, right turn winds\n      set unwound? true\n      set color unwound-dna-color\n      display\n    ]\n  ]\nend\n\nto wind-dna\n  let unwound-nucleotides nucleotides with [unwound? and class != \"copy-of-dna-bottom\" and class != \"copy-of-dna-top\"]\n  if any? unwound-nucleotides [\n    let min-unwound-place min [place] of unwound-nucleotides\n    ask unwound-nucleotides with [place = min-unwound-place  ] [\n      rt wind-angle  ;; right turn winds, left turn unwinds\n      set unwound? false\n      set color wound-dna-color\n    ]\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;; procedures for zipping & unzipping DNA strand ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto unzip-nucleotides\n  let were-any-nucleotides-unzipped-further? false\n\n  ask nucleotides with [next-nucleotide-unzipped-the-same? and unzipped-stage > 0] [\n    let fractional-separation (unzipped-stage / 2)  ;; every unzipped stage will increment the fractional separation by 1/2 of a patch width\n    if unzipped-stage = 3 [ask my-old-stairs [die] ask my-out-backbones [die] ]  ;; break the linking between the nucleotide bases (the stairs of the staircase)\n    if unzipped-stage = 1 [ask my-out-backbones [untie]]                         ;; break the sugar backbone of the DNA strand\n    if unzipped-stage > 0 and unzipped-stage < 4 [\n      set unzipped-stage unzipped-stage + 1\n      set were-any-nucleotides-unzipped-further? true                            ;; if any nucleotide was unzipped partially this stage\n      if class = \"original-dna-top\"      [set ycor fractional-separation  ]      ;; move upward\n      if class = \"original-dna-bottom\"   [set ycor -1 * fractional-separation ]  ;; move downward\n    ]\n  ]\n  ask helicases [\n    ifelse were-any-nucleotides-unzipped-further? [set shape \"helicase-expanded\" ][set shape \"helicase\" ]  ;; show shape change in this enzyme\n  ]\nend\n\nto separate-base-pairs\n  let lowest-place 0\n  ask helicases  [\n    let this-helicase self\n    let unzipped-nucleotides nucleotides with [unzipped-stage = 0]\n    if any? unzipped-nucleotides [ set lowest-place min-one-of unzipped-nucleotides [place] ]  ;; any unzipped nucleotides\n    let available-nucleotides unzipped-nucleotides  with [distance this-helicase < 1  and are-previous-nucleotides-unzipped?]\n    if any? available-nucleotides [\n      let lowest-value-nucleotide min-one-of available-nucleotides [place]\n      ask lowest-value-nucleotide [\n        let base self\n        let base-place place\n        let other-base other nucleotides with [place = base-place]\n        if any? other-base  [\n          set unzipped-stage 1\n          ask other-base [set unzipped-stage 1]\n        ]\n      ]\n    ]\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;; procedures for adding and removing nucleosides and free phosphates and moving everything around ;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto move-free-molecules\n  let all-molecules (turtle-set nucleosides phosphates polymerases helicases topoisomerases)\n  ask all-molecules [\n    if not being-dragged-by-cursor? [\n      ;; only move the molecules that aren\'t being dragged by the users mouse cursor (during mouse-down?)\n      fd molecule-step\n    ]\n  ]\nend\n\nto clean-up-free-phosphates\n  ask phosphates [ if pxcor = min-pxcor or pxcor = max-pxcor or pycor = min-pycor or pycor = max-pycor [die]]  ;; get rid of phosphates at the edge of the screen\nend\n\nto refill-or-remove-nucleosides\n  if count nucleosides < free-nucleosides [make-a-nucleoside]\n  if count nucleosides > free-nucleosides [ask one-of nucleosides [ask tagline-neighbors [die] die]]  ;; get rid of label tags too\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;; procedures for setting polymerase states, aligning nucleosides to nucleotides & linking them  ;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto lock-polymerase-to-one-nucleotide\n  let target-xcor 0\n  let target-ycor 0\n  let target-class \"\"\n\n  ask polymerases  [\n    let nucleosides-ready-to-gear-to-polymerase nobody\n    let potential-nucleoside-ready-to-gear-to-polymerase nobody\n    let target-nucleotide-ready-to-gear-to-polymerase nobody\n    set nucleosides-ready-to-gear-to-polymerase nucleosides with [distance myself < lock-radius]  ;; find  nucleosides floating nearby\n    if count nucleosides-ready-to-gear-to-polymerase > 1 [\n      set potential-nucleoside-ready-to-gear-to-polymerase min-one-of nucleosides-ready-to-gear-to-polymerase [distance myself]\n    ]\n    if count nucleosides-ready-to-gear-to-polymerase = 1 [\n      set potential-nucleoside-ready-to-gear-to-polymerase nucleosides-ready-to-gear-to-polymerase\n    ]\n    let nucleotides-ready-to-gear-to-polymerase nucleotides with [\n      ;; nearby nucleotides (different than nucleosides) that are not stair lined to any other nucleotides\n      not any? my-old-stairs and not any? my-new-stairs and (class = \"original-dna-bottom\" or class = \"original-dna-top\") and distance myself < lock-radius\n    ]\n\n    if any? nucleotides-ready-to-gear-to-polymerase and all-base-pairs-unwound? and not being-dragged-by-cursor? [\n      set target-nucleotide-ready-to-gear-to-polymerase min-one-of nucleotides-ready-to-gear-to-polymerase [distance myself]\n      set target-xcor   [xcor] of target-nucleotide-ready-to-gear-to-polymerase\n      set target-ycor   [ycor] of target-nucleotide-ready-to-gear-to-polymerase\n      set target-class [class] of target-nucleotide-ready-to-gear-to-polymerase\n      setxy target-xcor target-ycor\n    ]\n\n    if not any? nucleotides-ready-to-gear-to-polymerase or any? other polymerases-here [set locked-state 0]   ;; if no open nucleotide are present then no gearing\n    if any? nucleotides-ready-to-gear-to-polymerase and\n      all-base-pairs-unwound? and\n      potential-nucleoside-ready-to-gear-to-polymerase = nobody and\n      not any? other polymerases-here [\n      ;; if an open nucleotide is present but no nucleosides\n      set locked-state 1\n    ]\n    if target-nucleotide-ready-to-gear-to-polymerase != nobody and\n      all-base-pairs-unwound?\n      and potential-nucleoside-ready-to-gear-to-polymerase != nobody\n      and not any? other polymerases-here [\n      set locked-state 2   ;; if an open nucleotide is present and a nucleosides is present\n\n      ifelse (\n        (would-these-nucleotides-pair-correctly? target-nucleotide-ready-to-gear-to-polymerase potential-nucleoside-ready-to-gear-to-polymerase) or\n        (substitutions?)\n      ) [\n        ask potential-nucleoside-ready-to-gear-to-polymerase  [\n          ask my-in-cursor-drags  [die]\n          ask tagline-neighbors [die]\n          set breed nucleotides\n          set shape (word \"nucleotide-\"  value)\n          set unwound? true\n          if target-class = \"original-dna-top\"     [ set heading 180 set class \"copy-of-dna-bottom\" attach-nucleo-tag 175 0.7]\n          if target-class = \"original-dna-bottom\"  [ set heading 0 set class \"copy-of-dna-top\" attach-nucleo-tag 5 0.5]\n          setxy target-xcor target-ycor\n          break-off-phosphates-from-nucleoside\n          create-new-stair-with target-nucleotide-ready-to-gear-to-polymerase [set hidden? false tie]\n        ]\n      ]\n      [ ;; if an open nucleotide is present, and a nucleoside is present, but it is not the correct nucleosides to pair\n        set locked-state 3\n      ]\n    ]\n  ]\nend\n\nto break-off-phosphates-from-nucleoside\n  hatch 1 [\n    set breed phosphates\n    set shape \"phosphate-pair\"\n    set heading random 360\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;; setting locking topoisomerases onto primase ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto lock-topoisomerase-to-wound-primase\n  let target-xcor 0\n  let target-ycor 0\n  let target-class \"\"\n  let wound-nucleotides  nucleotides with [not unwound?]\n  ask topoisomerases  [\n    ifelse any? wound-nucleotides [\n      let target-primases-ready-to-gear-to-topoisomerase primases  with [distance myself < lock-radius ]\n      ifelse any? target-primases-ready-to-gear-to-topoisomerase [\n        let target-primase-ready-to-gear-to-topoisomerase one-of target-primases-ready-to-gear-to-topoisomerase\n        set locked? true\n        if not mouse-down? [\n          unwind-dna\n          ask my-in-cursor-drags  [die]\n          set target-xcor   [xcor] of target-primase-ready-to-gear-to-topoisomerase\n          set target-ycor   [ycor] of target-primase-ready-to-gear-to-topoisomerase\n          setxy target-xcor target-ycor\n        ]\n      ]\n      [\n        set locked? false\n      ]\n    ]\n    [\n      set locked? false\n    ]\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;; statistics ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto calculate-mutations\n  set total-deletion-mutations-top-strand 0\n  set total-substitution-mutations-top-strand 0\n  set total-correct-duplications-top-strand 0\n  set total-deletion-mutations-bottom-strand 0\n  set total-substitution-mutations-bottom-strand 0\n  set total-correct-duplications-bottom-strand 0\n\n  let original-nucleotides nucleotides with [class = \"original-dna-top\" ]\n  ask original-nucleotides [\n    if not any? my-new-stairs [set total-deletion-mutations-top-strand total-deletion-mutations-top-strand + 1]\n    if count my-new-stairs >= 1 [\n      ifelse is-this-nucleotide-paired-correctly?\n        [set total-correct-duplications-top-strand total-correct-duplications-top-strand + 1]\n        [set total-substitution-mutations-top-strand total-substitution-mutations-top-strand + 1]\n    ]\n  ]\n\n  set original-nucleotides nucleotides with [class = \"original-dna-bottom\" ]\n  ask original-nucleotides [\n    if not any? my-new-stairs [set total-deletion-mutations-bottom-strand total-deletion-mutations-bottom-strand + 1]\n    if count my-new-stairs >= 1 [\n      ifelse is-this-nucleotide-paired-correctly?\n        [set total-correct-duplications-bottom-strand total-correct-duplications-bottom-strand + 1]\n        [set total-substitution-mutations-bottom-strand total-substitution-mutations-bottom-strand + 1]\n    ]\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;mouse cursor detection ;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto detect-mouse-selection-event\n  let p-mouse-xcor mouse-xcor\n  let p-mouse-ycor mouse-ycor\n  let current-mouse-down? mouse-down?\n  let target-turtle nobody\n  let current-mouse-inside? mouse-inside?\n  ask mouse-cursors [\n    setxy p-mouse-xcor p-mouse-ycor\n    ;;;;;;  cursor visualization ;;;;;;;;;;;;\n    set hidden? true\n    let all-moveable-molecules (turtle-set nucleosides polymerases helicases topoisomerases)\n    let draggable-molecules all-moveable-molecules with [not being-dragged-by-cursor? and distance myself <= mouse-drag-radius]\n\n    ;; when mouse button has not been down and you are hovering over a draggable molecules - then the mouse cursor appears and is rotating\n    if not current-mouse-down? and mouse-inside? and (any? draggable-molecules) [ set color cursor-detect-color  set hidden? false rt 4 ]\n    ;; when things are being dragged the mouse cursor is a different color and it is not rotating\n    if is-this-cursor-dragging-anything? and mouse-inside? [ set color cursor-drag-color set hidden? false]\n\n    if not mouse-continuous-down? and current-mouse-down? and not is-this-cursor-dragging-anything? and any? draggable-molecules [\n      set target-turtle min-one-of draggable-molecules  [distance myself]\n      ask target-turtle [setxy p-mouse-xcor p-mouse-ycor]\n      create-cursor-drag-to target-turtle [ set hidden? false tie ]\n    ] ;; create-link from cursor to one of the target turtles.  These links are called cursor-drags\n    if (not current-mouse-down? ) [ask my-out-cursor-drags  [die] ] ;; remove all drag links\n  ]\n  ifelse current-mouse-down? and mouse-down? [set mouse-continuous-down? true][set mouse-continuous-down? false]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto-report random-base-letter\n  let r random 4\n  let letter-to-report \"\"\n  if r = 0 [set letter-to-report \"A\"]\n  if r = 1 [set letter-to-report \"G\"]\n  if r = 2 [set letter-to-report \"T\"]\n  if r = 3 [set letter-to-report \"C\"]\n  report letter-to-report\nend\n\nto-report complementary-base [base]\n  let base-to-report \"\"\n  if base = \"A\" [set base-to-report \"T\"]\n  if base = \"T\" [set base-to-report \"A\"]\n  if base = \"G\" [set base-to-report \"C\"]\n  if base = \"C\" [set base-to-report \"G\"]\n  report base-to-report\nend\n\nto-report time-remaining-to-display\n  ifelse using-time-limit [report time-remaining][report \"\"]\nend\n\nto-report is-this-cursor-dragging-anything?\n  ifelse (any? out-cursor-drag-neighbors) [report true][report false]\nend\n\nto-report being-dragged-by-cursor?\n  ifelse any? my-in-cursor-drags [report true][report false]\nend\n\nto-report all-base-pairs-unwound?\n  ifelse any? nucleotides with [not unwound?] [report false][report true]\nend\n\nto-report would-these-nucleotides-pair-correctly? [nucleotide-1 nucleotide-2]\n  ifelse ( (complementary-base [value] of nucleotide-1) = item 0 [value] of nucleotide-2) [report true][report false ]\nend\n\nto-report is-this-nucleotide-paired-correctly?\n  let original-nucleotide self\n  let this-stair one-of my-new-stairs\n  let this-paired-nucleotide nobody\n  let overwrite? false\n  ask this-stair [set this-paired-nucleotide other-end\n    if this-paired-nucleotide != nobody [\n      if [class] of this-paired-nucleotide != \"copy-of-dna-bottom\" and [class] of this-paired-nucleotide  != \"copy-of-dna-top\" [set overwrite? true];; [set\n    ]\n  ]\n  ifelse (value = (complementary-base [value] of this-paired-nucleotide) and not overwrite?) [report true] [report false ]\nend\n\nto-report next-nucleotide-unzipped-the-same?\n  let my-unzipped-stage unzipped-stage\n  let my-place place\n  let my-class class\n  let next-nucleotides-available nucleotides with [class = my-class and place = (my-place + 1) and unzipped-stage = my-unzipped-stage]\n  let can-continue-to-unzip? false\n  ifelse my-place < dna-strand-length [\n    ifelse any? next-nucleotides-available and are-previous-nucleotides-unzipped?;;; is another nucleotides in the next sequence in the strand\n    [set can-continue-to-unzip? true] [set can-continue-to-unzip? false]\n  ]\n  [set can-continue-to-unzip? true]  ;; there is no other nucleotides in the next sequence in the strand so no nucleotides will prevent the zipper from opening\n  report can-continue-to-unzip?\nend\n\n\nto-report are-previous-nucleotides-unzipped?\n  let my-place place\n  let previous-nucleotides nucleotides with [place = (my-place - 1)]\n  let value-to-return false\n  ifelse not any? previous-nucleotides\n  [set value-to-return true]\n  [\n    let previous-nucleotides-are-unzipped previous-nucleotides  with [unzipped-stage > 0]\n    ifelse any? previous-nucleotides-are-unzipped [set value-to-return true] [set value-to-return false]\n  ]\n  report value-to-return\nend\n\nto-report user-message-string-for-mutations\n  let duplication-rate  precision ( (total-correct-duplications-top-strand + total-correct-duplications-bottom-strand)  / final-time) 4\n  report (word \"You had \" (total-correct-duplications-top-strand + total-correct-duplications-bottom-strand)\n    \" correct replications and \" (total-substitution-mutations-top-strand + total-substitution-mutations-bottom-strand)\n    \" substitutions and \"  (total-deletion-mutations-top-strand + total-deletion-mutations-bottom-strand)  \"  deletions.\"\n    \" That replication process took you \" final-time \" seconds.  This was a rate of \" duplication-rate\n    \" correct nucleotides duplicated per second.\" )\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;; instructions for players ;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\nto-report current-instruction-label\n  report ifelse-value (current-instruction = 0)\n    [ \"press setup\" ]\n    [ (word current-instruction \" / \" length instructions) ]\nend\n\nto next-instruction\n  show-instruction current-instruction + 1\nend\n\nto previous-instruction\n  show-instruction current-instruction - 1\nend\n\nto show-instruction [ i ]\n  if i >= 1 and i <= length instructions [\n    set current-instruction i\n    clear-output\n    foreach item (current-instruction - 1) instructions output-print\n  ]\nend\n\nto-report instructions\n  report [\n    [\n      \"You will be simulating the process\"\n      \"of DNA replication that occurs in\"\n      \"every cell in every living creature\"\n      \"as part of mitosis or meiosis.\"\n    ]\n    [\n      \"To do this you will need to complete\"\n      \"4 tasks in the shortest time you\"\n      \"can. Each of these tasks requires\"\n      \"you to drag a molecule using your\"\n      \"mouse, from one location to another.\"\n    ]\n    [\n      \"The 1st task will be to unwind a \"\n      \"twisted bundle of DNA by using your\"\n      \"mouse to place a topoisomerase \"\n      \"enzyme on top of the primase enzyme.\"\n    ]\n    [\n      \"The 2nd task will be to unzip the\"\n      \"DNA ladder structure by dragging\"\n      \"a helicase enzyme from the 1st \"\n      \"base pair to the last base pair.\"\n    ]\n    [\n      \"The 3rd task will be to first drag\"\n      \"a polymerase enzyme to an open\"\n      \"nucleotide and then drag a floating\"\n      \"nucleoside to the same location.\"\n    ]\n    [\n      \"The last task is to simply repeat\"\n      \"the previous task of connecting\"\n      \"nucleosides to open nucleotides\" ;\n      \"until as much of the DNA as\"\n      \"possible has been replicated.\"\n    ]\n    [\n      \"The simulation ends either when\"\n      \"the timer runs out (if the timer?\"\n      \"chooser is set to YES) or when you\"\n      \"press the DIVIDE THE CELL button\"\n    ]\n  ]\nend\n\n\n; Copyright 2012 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":330,"top":10,"right":1188,"bottom":519,"dimensions":{"minPxcor":0,"maxPxcor":16,"minPycor":-5,"maxPycor":4,"patchSize":50,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":14,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":4,"top":10,"right":74,"bottom":44,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"30","compiledStep":"1","variable":"dna-strand-length","left":4,"top":46,"right":152,"bottom":79,"display":"dna-strand-length","min":"1","max":"30","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"nucleo-labels?","left":5,"top":116,"right":151,"bottom":149,"display":"nucleo-labels?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":75,"top":10,"right":152,"bottom":43,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"enzyme-labels?","left":5,"top":81,"right":151,"bottom":114,"display":"enzyme-labels?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-deletion-mutations-top-strand\")","source":"total-deletion-mutations-top-strand","left":15,"top":255,"right":147,"bottom":300,"display":"# deletions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-substitution-mutations-top-strand\")","source":"total-substitution-mutations-top-strand","left":15,"top":298,"right":146,"bottom":343,"display":"# substitutions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Top Strand","left":38,"top":192,"right":147,"bottom":210,"fontSize":13,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-correct-duplications-top-strand\")","source":"total-correct-duplications-top-strand","left":15,"top":211,"right":147,"bottom":256,"display":"# correct duplications","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"substitutions?","left":170,"top":10,"right":305,"bottom":43,"display":"substitutions?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"200","compiledStep":"1","variable":"free-nucleosides","left":171,"top":47,"right":305,"bottom":80,"display":"free-nucleosides","min":"0","max":"200","default":50,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-correct-duplications-bottom-strand\")","source":"total-correct-duplications-bottom-strand","left":170,"top":210,"right":305,"bottom":255,"display":"# correct duplications","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-deletion-mutations-bottom-strand\")","source":"total-deletion-mutations-bottom-strand","left":170,"top":254,"right":305,"bottom":299,"display":"# deletions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"total-substitution-mutations-bottom-strand\")","source":"total-substitution-mutations-bottom-strand","left":170,"top":297,"right":305,"bottom":342,"display":"# substitutions","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Bottom Strand","left":192,"top":191,"right":297,"bottom":209,"fontSize":13,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"left":5,"top":345,"right":325,"bottom":492,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"variable":"time-limit","left":169,"top":85,"right":304,"bottom":130,"display":"time-limit","choices":["none","2 minutes","5 minutes"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"TIME-REMAINING-TO-DISPLAY\"]()","source":"time-remaining-to-display","left":169,"top":134,"right":304,"bottom":179,"display":"time remaining","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  world.observer.setGlobal(\"cell-divided?\", true);\n  world.observer.setGlobal(\"cell-message-shown?\", false);\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"set cell-divided? true\nset cell-message-shown? false","left":5,"top":150,"right":150,"bottom":184,"display":"divide the cell","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"CURRENT-INSTRUCTION-LABEL\"]()","source":"current-instruction-label","left":130,"top":495,"right":220,"bottom":540,"display":"instruction","precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_49 = procedures[\"NEXT-INSTRUCTION\"]();\n  if (_maybestop_33_49 instanceof Exception.StopInterrupt) { return _maybestop_33_49; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"next-instruction","left":220,"top":495,"right":325,"bottom":540,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_53 = procedures[\"PREVIOUS-INSTRUCTION\"]();\n  if (_maybestop_33_53 instanceof Exception.StopInterrupt) { return _maybestop_33_53; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"previous-instruction","left":5,"top":495,"right":130,"bottom":540,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit", "initial-length-dna", "mouse-continuous-down?", "instruction", "cursor-detect-color", "cursor-drag-color", "wound-dna-color", "unwound-dna-color", "nucleo-tag-color", "enzyme-tag-color", "nucleoside-color", "polymerase-color-0", "polymerase-color-1", "polymerase-color-2", "polymerase-color-3", "helicase-color-0", "helicase-color-1", "topoisomerase-color-0", "topoisomerase-color-1", "primase-color-0", "primase-color-1", "final-time", "total-deletion-mutations-top-strand", "total-substitution-mutations-top-strand", "total-correct-duplications-top-strand", "total-deletion-mutations-bottom-strand", "total-substitution-mutations-bottom-strand", "total-correct-duplications-bottom-strand", "lock-radius", "mouse-drag-radius", "molecule-step", "wind-angle", "length-of-simulation", "time-remaining", "current-instruction", "using-time-limit", "simulation-started?", "cell-divided?", "simulation-ended?", "cell-message-shown?", "timer-message-shown?"], ["dna-strand-length", "nucleo-labels?", "enzyme-labels?", "substitutions?", "free-nucleosides", "time-limit"], [], 0, 16, -5, 4, 50.0, true, true, turtleShapes, linkShapes, function(){});
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(1, "NUCLEOSIDES").ask(function() {
        SelfManager.self().setVariable("value", procedures["RANDOM-BASE-LETTER"]());
        SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("nucleoside-tri-") + workspace.dump(SelfManager.self().getVariable("value"))));
        SelfManager.self().setVariable("color", world.observer.getGlobal("nucleoside-color"));
        procedures["ATTACH-NUCLEO-TAG"](0,0);
        SelfManager.self().setXY(Prims.randomPatchCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomPatchCoord(world.topology.minPycor, world.topology.maxPycor));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(1, "HELICASES").ask(function() {
        SelfManager.self().setVariable("shape", "helicase");
        SelfManager.self().setVariable("color", world.observer.getGlobal("helicase-color-0"));
        SelfManager.self().setVariable("size", 3.2);
        SelfManager.self().setVariable("heading", 90);
        procedures["ATTACH-ENZYME-TAG"](150,0.85,"helicase");
        SelfManager.self().setXY(Prims.div((world.topology.maxPxcor - world.topology.minPxcor), 2), (world.topology.maxPycor - 1));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
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
      if (e instanceof Exception.StopInterrupt) {
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
      if (e instanceof Exception.StopInterrupt) {
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
      world.turtleManager.turtlesOfBreed("CHROMOSOME-BUILDERS").ask(function() {
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
      if (e instanceof Exception.StopInterrupt) {
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
      if (e instanceof Exception.StopInterrupt) {
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
      if (e instanceof Exception.StopInterrupt) {
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
      if (!world.observer.getGlobal("simulation-started?")) {
        world.observer.setGlobal("simulation-started?", true);
        workspace.timer.reset();
      }
      if (world.observer.getGlobal("using-time-limit")) {
        world.observer.setGlobal("time-remaining", (world.observer.getGlobal("length-of-simulation") - workspace.timer.elapsed()));
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      for (let _index_17643_17649 = 0, _repeatcount_17643_17649 = StrictMath.floor(world.observer.getGlobal("initial-length-dna")); _index_17643_17649 < _repeatcount_17643_17649; _index_17643_17649++){
        procedures["WIND-DNA"]();
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let woundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); }); letVars['woundNucleotides'] = woundNucleotides;
      if (!woundNucleotides.isEmpty()) {
        let maxWoundPlace = ListPrims.max(woundNucleotides.projectionBy(function() { return SelfManager.self().getVariable("place"); })); letVars['maxWoundPlace'] = maxWoundPlace;
        woundNucleotides.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), maxWoundPlace); }).ask(function() {
          SelfManager.self().right(-world.observer.getGlobal("wind-angle"));
          SelfManager.self().setVariable("unwound?", true);
          SelfManager.self().setVariable("color", world.observer.getGlobal("unwound-dna-color"));
          notImplemented('display', undefined)();
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
        unwoundNucleotides.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("place"), minUnwoundPlace); }).ask(function() {
          SelfManager.self().right(world.observer.getGlobal("wind-angle"));
          SelfManager.self().setVariable("unwound?", false);
          SelfManager.self().setVariable("color", world.observer.getGlobal("wound-dna-color"));
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
  procs["windDna"] = temp;
  procs["WIND-DNA"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let wereAnyNucleotidesUnzippedFurther_p = false; letVars['wereAnyNucleotidesUnzippedFurther_p'] = wereAnyNucleotidesUnzippedFurther_p;
      world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() {
        return (procedures["NEXT-NUCLEOTIDE-UNZIPPED-THE-SAME?"]() && Prims.gt(SelfManager.self().getVariable("unzipped-stage"), 0));
      }).ask(function() {
        let fractionalSeparation = Prims.div(SelfManager.self().getVariable("unzipped-stage"), 2); letVars['fractionalSeparation'] = fractionalSeparation;
        if (Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 3)) {
          LinkPrims.myLinks("OLD-STAIRS").ask(function() { SelfManager.self().die(); }, true);
          LinkPrims.myOutLinks("BACKBONES").ask(function() { SelfManager.self().die(); }, true);
        }
        if (Prims.equality(SelfManager.self().getVariable("unzipped-stage"), 1)) {
          LinkPrims.myOutLinks("BACKBONES").ask(function() { SelfManager.self().untie(); }, true);
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
      world.turtleManager.turtlesOfBreed("HELICASES").ask(function() {
        if (wereAnyNucleotidesUnzippedFurther_p) {
          SelfManager.self().setVariable("shape", "helicase-expanded");
        }
        else {
          SelfManager.self().setVariable("shape", "helicase");
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
  procs["unzipNucleotides"] = temp;
  procs["UNZIP-NUCLEOTIDES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let lowestPlace = 0; letVars['lowestPlace'] = lowestPlace;
      world.turtleManager.turtlesOfBreed("HELICASES").ask(function() {
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
          lowestValueNucleotide.ask(function() {
            let base = SelfManager.self(); letVars['base'] = base;
            let basePlace = SelfManager.self().getVariable("place"); letVars['basePlace'] = basePlace;
            let otherBase = world.turtleManager.turtlesOfBreed("NUCLEOTIDES")._optimalOtherWith(function() { return Prims.equality(SelfManager.self().getVariable("place"), basePlace); }); letVars['otherBase'] = otherBase;
            if (!otherBase.isEmpty()) {
              SelfManager.self().setVariable("unzipped-stage", 1);
              otherBase.ask(function() { SelfManager.self().setVariable("unzipped-stage", 1); }, true);
            }
          }, true);
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
  procs["separateBasePairs"] = temp;
  procs["SEPARATE-BASE-PAIRS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let allMolecules = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOSIDES"), world.turtleManager.turtlesOfBreed("PHOSPHATES"), world.turtleManager.turtlesOfBreed("POLYMERASES"), world.turtleManager.turtlesOfBreed("HELICASES"), world.turtleManager.turtlesOfBreed("TOPOISOMERASES")); letVars['allMolecules'] = allMolecules;
      allMolecules.ask(function() {
        if (!procedures["BEING-DRAGGED-BY-CURSOR?"]()) {
          SelfManager.self().fd(world.observer.getGlobal("molecule-step"));
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
  procs["moveFreeMolecules"] = temp;
  procs["MOVE-FREE-MOLECULES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("PHOSPHATES").ask(function() {
        if ((((Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.minPxcor) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.topology.maxPxcor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.maxPycor))) {
          SelfManager.self().die();
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
        ListPrims.oneOf(world.turtleManager.turtlesOfBreed("NUCLEOSIDES")).ask(function() {
          LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().die(); }, true);
          SelfManager.self().die();
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
  procs["refillOrRemoveNucleosides"] = temp;
  procs["REFILL-OR-REMOVE-NUCLEOSIDES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let targetXcor = 0; letVars['targetXcor'] = targetXcor;
      let targetYcor = 0; letVars['targetYcor'] = targetYcor;
      let targetClass = ""; letVars['targetClass'] = targetClass;
      world.turtleManager.turtlesOfBreed("POLYMERASES").ask(function() {
        let nucleosidesReadyToGearToPolymerase = Nobody; letVars['nucleosidesReadyToGearToPolymerase'] = nucleosidesReadyToGearToPolymerase;
        let potentialNucleosideReadyToGearToPolymerase = Nobody; letVars['potentialNucleosideReadyToGearToPolymerase'] = potentialNucleosideReadyToGearToPolymerase;
        let targetNucleotideReadyToGearToPolymerase = Nobody; letVars['targetNucleotideReadyToGearToPolymerase'] = targetNucleotideReadyToGearToPolymerase;
        nucleosidesReadyToGearToPolymerase = world.turtleManager.turtlesOfBreed("NUCLEOSIDES").agentFilter(function() {
          return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
        }); letVars['nucleosidesReadyToGearToPolymerase'] = nucleosidesReadyToGearToPolymerase;
        if (Prims.gt(nucleosidesReadyToGearToPolymerase.size(), 1)) {
          potentialNucleosideReadyToGearToPolymerase = nucleosidesReadyToGearToPolymerase.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); }); letVars['potentialNucleosideReadyToGearToPolymerase'] = potentialNucleosideReadyToGearToPolymerase;
        }
        if (Prims.equality(nucleosidesReadyToGearToPolymerase.size(), 1)) {
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
            potentialNucleosideReadyToGearToPolymerase.ask(function() {
              LinkPrims.myInLinks("CURSOR-DRAGS").ask(function() { SelfManager.self().die(); }, true);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().die(); }, true);
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PHOSPHATES"));
        SelfManager.self().setVariable("shape", "phosphate-pair");
        SelfManager.self().setVariable("heading", Prims.random(360));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let targetXcor = 0; letVars['targetXcor'] = targetXcor;
      let targetYcor = 0; letVars['targetYcor'] = targetYcor;
      let targetClass = ""; letVars['targetClass'] = targetClass;
      let woundNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return !SelfManager.self().getVariable("unwound?"); }); letVars['woundNucleotides'] = woundNucleotides;
      world.turtleManager.turtlesOfBreed("TOPOISOMERASES").ask(function() {
        if (!woundNucleotides.isEmpty()) {
          let targetPrimasesReadyToGearToTopoisomerase = world.turtleManager.turtlesOfBreed("PRIMASES").agentFilter(function() {
            return Prims.lt(SelfManager.self().distance(SelfManager.myself()), world.observer.getGlobal("lock-radius"));
          }); letVars['targetPrimasesReadyToGearToTopoisomerase'] = targetPrimasesReadyToGearToTopoisomerase;
          if (!targetPrimasesReadyToGearToTopoisomerase.isEmpty()) {
            let targetPrimaseReadyToGearToTopoisomerase = ListPrims.oneOf(targetPrimasesReadyToGearToTopoisomerase); letVars['targetPrimaseReadyToGearToTopoisomerase'] = targetPrimaseReadyToGearToTopoisomerase;
            SelfManager.self().setVariable("locked?", true);
            if (!MousePrims.isDown()) {
              procedures["UNWIND-DNA"]();
              LinkPrims.myInLinks("CURSOR-DRAGS").ask(function() { SelfManager.self().die(); }, true);
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("total-deletion-mutations-top-strand", 0);
      world.observer.setGlobal("total-substitution-mutations-top-strand", 0);
      world.observer.setGlobal("total-correct-duplications-top-strand", 0);
      world.observer.setGlobal("total-deletion-mutations-bottom-strand", 0);
      world.observer.setGlobal("total-substitution-mutations-bottom-strand", 0);
      world.observer.setGlobal("total-correct-duplications-bottom-strand", 0);
      let originalNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("class"), "original-dna-top"); }); letVars['originalNucleotides'] = originalNucleotides;
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
      originalNucleotides = world.turtleManager.turtlesOfBreed("NUCLEOTIDES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("class"), "original-dna-bottom"); }); letVars['originalNucleotides'] = originalNucleotides;
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let pMouseXcor = MousePrims.getX(); letVars['pMouseXcor'] = pMouseXcor;
      let pMouseYcor = MousePrims.getY(); letVars['pMouseYcor'] = pMouseYcor;
      let currentMouseDown_p = MousePrims.isDown(); letVars['currentMouseDown_p'] = currentMouseDown_p;
      let targetTurtle = Nobody; letVars['targetTurtle'] = targetTurtle;
      let currentMouseInside_p = MousePrims.isInside(); letVars['currentMouseInside_p'] = currentMouseInside_p;
      world.turtleManager.turtlesOfBreed("MOUSE-CURSORS").ask(function() {
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = true;
      var letVars = { };
      let r = Prims.random(4); letVars['r'] = r;
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
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return letterToReport
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
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return baseToReport
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
  procs["complementaryBase"] = temp;
  procs["COMPLEMENTARY-BASE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (world.observer.getGlobal("using-time-limit")) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return world.observer.getGlobal("time-remaining")
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return ""
        }
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
  procs["timeRemainingToDisplay"] = temp;
  procs["TIME-REMAINING-TO-DISPLAY"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (!LinkPrims.outLinkNeighbors("CURSOR-DRAGS").isEmpty()) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return true
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return false
        }
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
  procs["is_ThisCursorDraggingAnything_p"] = temp;
  procs["IS-THIS-CURSOR-DRAGGING-ANYTHING?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (!LinkPrims.myInLinks("CURSOR-DRAGS").isEmpty()) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return true
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return false
        }
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
  procs["beingDraggedByCursor_p"] = temp;
  procs["BEING-DRAGGED-BY-CURSOR?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (world.turtleManager.turtlesOfBreed("NUCLEOTIDES")._optimalAnyWith(function() { return !SelfManager.self().getVariable("unwound?"); })) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return false
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return true
        }
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
  procs["allBasePairsUnwound_p"] = temp;
  procs["ALL-BASE-PAIRS-UNWOUND?"] = temp;
  temp = (function(nucleotide1, nucleotide2) {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.equality(procedures["COMPLEMENTARY-BASE"](nucleotide1.projectionBy(function() { return SelfManager.self().getVariable("value"); })), ListPrims.item(0, nucleotide2.projectionBy(function() { return SelfManager.self().getVariable("value"); })))) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return true
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return false
        }
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
      thisStair.ask(function() {
        thisPairedNucleotide = SelfManager.self().otherEnd(); letVars['thisPairedNucleotide'] = thisPairedNucleotide;
        if (!Prims.equality(thisPairedNucleotide, Nobody)) {
          if ((!Prims.equality(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("class"); }), "copy-of-dna-bottom") && !Prims.equality(thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("class"); }), "copy-of-dna-top"))) {
            overwrite_p = true; letVars['overwrite_p'] = overwrite_p;
          }
        }
      }, true);
      if ((Prims.equality(SelfManager.self().getVariable("value"), procedures["COMPLEMENTARY-BASE"](thisPairedNucleotide.projectionBy(function() { return SelfManager.self().getVariable("value"); }))) && !overwrite_p)) {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return true
        }
      }
      else {
        if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
          return false
        }
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
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return canContinueToUnzip_p
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
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return valueToReturn
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
  procs["arePreviousNucleotidesUnzipped_p"] = temp;
  procs["ARE-PREVIOUS-NUCLEOTIDES-UNZIPPED?"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let duplicationRate = NLMath.precision(Prims.div((world.observer.getGlobal("total-correct-duplications-top-strand") + world.observer.getGlobal("total-correct-duplications-bottom-strand")), world.observer.getGlobal("final-time")), 4); letVars['duplicationRate'] = duplicationRate;
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return (workspace.dump('') + workspace.dump("You had ") + workspace.dump((world.observer.getGlobal("total-correct-duplications-top-strand") + world.observer.getGlobal("total-correct-duplications-bottom-strand"))) + workspace.dump(" correct replications and ") + workspace.dump((world.observer.getGlobal("total-substitution-mutations-top-strand") + world.observer.getGlobal("total-substitution-mutations-bottom-strand"))) + workspace.dump(" substitutions and ") + workspace.dump((world.observer.getGlobal("total-deletion-mutations-top-strand") + world.observer.getGlobal("total-deletion-mutations-bottom-strand"))) + workspace.dump("  deletions.") + workspace.dump(" That replication process took you ") + workspace.dump(world.observer.getGlobal("final-time")) + workspace.dump(" seconds.  This was a rate of ") + workspace.dump(duplicationRate) + workspace.dump(" correct nucleotides duplicated per second."))
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
  procs["userMessageStringForMutations"] = temp;
  procs["USER-MESSAGE-STRING-FOR-MUTATIONS"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return (Prims.equality(world.observer.getGlobal("current-instruction"), 0) ? "press setup" : (workspace.dump('') + workspace.dump(world.observer.getGlobal("current-instruction")) + workspace.dump(" / ") + workspace.dump(ListPrims.length(procedures["INSTRUCTIONS"]()))))
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
  procs["currentInstructionLabel"] = temp;
  procs["CURRENT-INSTRUCTION-LABEL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SHOW-INSTRUCTION"]((world.observer.getGlobal("current-instruction") + 1));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      procedures["SHOW-INSTRUCTION"]((world.observer.getGlobal("current-instruction") - 1));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      if ((Prims.gte(i, 1) && Prims.lte(i, ListPrims.length(procedures["INSTRUCTIONS"]())))) {
        world.observer.setGlobal("current-instruction", i);
        OutputPrims.clear();
        var _foreach_35146_35153 = Tasks.forEach(Tasks.commandTask(function(_0) {
          if (arguments.length < 1) {
            throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
          }
          OutputPrims.print(_0);
        }, "output-print"), ListPrims.item((world.observer.getGlobal("current-instruction") - 1), procedures["INSTRUCTIONS"]())); if(reporterContext && _foreach_35146_35153 !== undefined) { return _foreach_35146_35153; }
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return [["You will be simulating the process", "of DNA replication that occurs in", "every cell in every living creature", "as part of mitosis or meiosis."], ["To do this you will need to complete", "4 tasks in the shortest time you", "can. Each of these tasks requires", "you to drag a molecule using your", "mouse, from one location to another."], ["The 1st task will be to unwind a ", "twisted bundle of DNA by using your", "mouse to place a topoisomerase ", "enzyme on top of the primase enzyme."], ["The 2nd task will be to unzip the", "DNA ladder structure by dragging", "a helicase enzyme from the 1st ", "base pair to the last base pair."], ["The 3rd task will be to first drag", "a polymerase enzyme to an open", "nucleotide and then drag a floating", "nucleoside to the same location."], ["The last task is to simply repeat", "the previous task of connecting", "nucleosides to open nucleotides", "until as much of the DNA as", "possible has been replicated."], ["The simulation ends either when", "the timer runs out (if the timer?", "chooser is set to YES) or when you", "press the DIVIDE THE CELL button"]]
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
