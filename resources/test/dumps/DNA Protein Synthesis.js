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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[150,165,165,180,180,195,195,210,210,165,165,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,135,120,120,105,105,90,90,135,135,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"amino acid":{"name":"amino acid","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[105,150,195,195,150,105,105],"ycors":[135,165,135,90,60,90,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":45,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-ala":{"name":"amino-ala","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"amino-arg":{"name":"amino-arg","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":75,"x2":150,"y2":75,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":108,"y":64,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":27,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"amino-asn":{"name":"amino-asn","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":187,"x2":150,"y2":187,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":106,"y":175,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"amino-asp":{"name":"amino-asp","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":120,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false}]},"amino-cys":{"name":"amino-cys","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false}]},"amino-gln":{"name":"amino-gln","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":150,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":120,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":108,"y":139,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"amino-glu":{"name":"amino-glu","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":75,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"amino-gly":{"name":"amino-gly","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"amino-his":{"name":"amino-his","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[195,240,255,217,180],"ycors":[225,225,180,154,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":225,"x2":195,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":183,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":228,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":243,"y":169,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":168,"y":169,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":206,"y":143,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-ile":{"name":"amino-ile","editableColorIndex":0,"rotate":true,"elements":[{"x1":121,"y1":226,"x2":151,"y2":226,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":106,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-leu":{"name":"amino-leu","editableColorIndex":0,"rotate":true,"elements":[{"x1":105,"y1":135,"x2":150,"y2":165,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":165,"x2":195,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-lys":{"name":"amino-lys","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":90,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-met":{"name":"amino-met","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false}]},"amino-phe":{"name":"amino-phe","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[119,120,150,180,179,150,119],"ycors":[147,180,195,179,146,131,148],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":224,"x2":149,"y2":194,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":149,"y2":223,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":138,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":139,"y":120,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":109,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":109,"y":168,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":167,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":167,"y":168,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-pro":{"name":"amino-pro","editableColorIndex":0,"rotate":true,"elements":[{"x1":210,"y1":210,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":135,"y1":210,"x2":180,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":165,"y1":180,"x2":210,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":135,"y1":210,"x2":150,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":160,"y":166,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":120,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":195,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-ser":{"name":"amino-ser","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"amino-thr":{"name":"amino-thr","editableColorIndex":0,"rotate":true,"elements":[{"x1":118,"y1":190,"x2":148,"y2":190,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":105,"y":177,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"amino-trp":{"name":"amino-trp","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[204,181,181,225,226],"ycors":[137,163,194,195,161],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[224,225,255,285,284,255,224],"ycors":[162,195,210,195,161,146,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":224,"x2":180,"y2":197,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":149,"y2":223,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":243,"y":198,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":244,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":214,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":214,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":272,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":272,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":169,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":192,"y":125,"diam":24,"type":"circle","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false},{"x":169,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-tyr":{"name":"amino-tyr","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[105,150,195,195,150,105,105],"ycors":[135,165,135,90,60,90,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":0,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":45,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-val":{"name":"amino-val","editableColorIndex":0,"rotate":true,"elements":[{"x1":105,"y1":180,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":195,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":165,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":165,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"empty":{"name":"empty","editableColorIndex":0,"rotate":false,"elements":[]},"end":{"name":"end","editableColorIndex":2,"rotate":false,"elements":[{"xcors":[130,145,160,175,220,235,250,265,265,250,235,220,175,160,145,130],"ycors":[61,46,46,61,61,46,46,61,226,241,241,226,226,241,241,226],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":true},{"xcors":[130,145,160,175,220,235,250,265,265,250,235,220,175,160,145,130],"ycors":[61,46,46,61,61,46,46,61,226,241,241,226,226,241,241,226],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"helicase":{"name":"helicase","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"helicase-expanded":{"name":"helicase-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"mrna-a":{"name":"mrna-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"mrna-c":{"name":"mrna-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"mrna-g":{"name":"mrna-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"mrna-start":{"name":"mrna-start","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,0,15,30,30,60,60,150],"ycors":[240,240,270,270,300,300,270,270],"type":"polygon","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"mrna-stop":{"name":"mrna-stop","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[180,30,30,105,105,135,135,165],"ycors":[240,240,270,270,300,300,270,270],"type":"polygon","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"mrna-u":{"name":"mrna-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-a":{"name":"nucleoside-tri-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-c":{"name":"nucleoside-tri-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,135,165,165,135,60],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-g":{"name":"nucleoside-tri-g","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-t":{"name":"nucleoside-tri-t","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-u":{"name":"nucleoside-tri-u","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"nucleotide-a":{"name":"nucleotide-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"nucleotide-c":{"name":"nucleotide-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"nucleotide-g":{"name":"nucleotide-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleotide-t":{"name":"nucleotide-t","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleotide-u":{"name":"nucleotide-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleotide-x":{"name":"nucleotide-x","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,180,120,180,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"phosphate":{"name":"phosphate","editableColorIndex":0,"rotate":true,"elements":[{"x":129,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"phosphate-pair":{"name":"phosphate-pair","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":135,"x2":150,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":144,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":99,"y":120,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"polymerase-0":{"name":"polymerase-0","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,60,60,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":0,"xmax":120,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true},{"xmin":120,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"polymerase-1":{"name":"polymerase-1","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true},{"xmin":105,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"polymerase-2":{"name":"polymerase-2","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"x1":180,"y1":60,"x2":180,"y2":240,"type":"line","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true},{"xmin":120,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"polymerase-3":{"name":"polymerase-3","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":135,"xmax":315,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"promoter-expanded":{"name":"promoter-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,105,90,75,60,45,15,30,60,75],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,105,90,75,60,45,15,30,60,75],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"start":{"name":"start","editableColorIndex":0,"rotate":false,"elements":[{"xmin":125,"ymin":46,"xmax":260,"ymax":240,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xmin":126,"ymin":47,"xmax":260,"ymax":239,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":true,"elements":[{"x":76,"y":76,"diam":146,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":60,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":195,"x2":150,"y2":240,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"trna-a":{"name":"trna-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"trna-c":{"name":"trna-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":61,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"trna-core":{"name":"trna-core","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[15,285,300,300,195,195,210,225,240,240,225,210,195,195,180,180,285,285,270,30,15,15,105,105,90,90,75,60,45,45,60,75,90,90,0,0],"ycors":[300,300,270,240,210,150,165,165,150,135,120,120,135,75,75,225,255,270,285,285,270,255,225,135,135,165,150,150,165,180,195,195,180,210,240,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"trna-g":{"name":"trna-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false},{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false}]},"trna-u":{"name":"trna-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "GENES", singular: "gene", varNames: ["gene-number", "strand", "code", "start-position", "end-position"] }, { name: "NUCLEOTIDES", singular: "nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "PROMOTERS", singular: "promoter", varNames: ["gene-number", "strand"] }, { name: "TERMINATORS", singular: "terminator", varNames: ["gene-number", "strand"] }, { name: "MRNA-NUCLEOTIDES", singular: "mrna-nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "MRNAS", singular: "mrna", varNames: ["gene-number", "strand", "code", "cap-type", "traveling?", "released?"] }, { name: "TRNAS", singular: "trna", varNames: ["gene-number", "strand"] }, { name: "TRNA-NUCLEOTIDES", singular: "trna-nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "AMINO-ACIDS", singular: "amino-acid", varNames: ["gene-number", "strand", "value", "place"] }, { name: "PROTEINS", singular: "protein", varNames: ["gene-number", "strand", "value"] }, { name: "TAGS", singular: "tag", varNames: ["value"] }, { name: "TAGLINES", singular: "tagline", varNames: [], isDirected: false }, { name: "BACKBONES", singular: "backbone", varNames: [], isDirected: true }])([], [])(["initial-dna-string", "user-created-code", "#-nucleotides-affected", "mutation-type", "show-genes?", "current-instruction", "codon-to-amino-acid-key", "original-dna-string", "duplicate-dna-string", "duplicate-ribosome-ycor", "original-ribosome-ycor", "duplicate-dna-ycor", "original-dna-ycor", "nucleotide-spacing", "nucleo-tag-color", "terminator-color", "gene-color-counter", "original-strand-gene-counter", "duplicate-strand-gene-counter", "original-display-mrna-counter", "duplicate-display-mrna-counter", "mrnas-traveling", "mrnas-released", "replicate-dna-event?", "show-genes-event?", "event-1-triggered?", "event-2-triggered?", "event-3-triggered?", "event-4-triggered?", "event-6-triggered?", "event-7-triggered?", "event-8-triggered?", "event-9-triggered?", "event-1-completed?", "event-2-completed?", "event-3-completed?", "event-4-completed?", "event-6-completed?", "event-7-completed?", "event-8-completed?", "event-9-completed?"], ["initial-dna-string", "user-created-code", "#-nucleotides-affected", "mutation-type", "show-genes?"], [], 0, 30, -8, 7, 24.0, true, true, turtleShapes, linkShapes, function(){});
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
      world.observer.setGlobal("replicate-dna-event?", false);
      world.observer.setGlobal("show-genes-event?", false);
      world.observer.setGlobal("event-1-triggered?", false);
      world.observer.setGlobal("event-2-triggered?", false);
      world.observer.setGlobal("event-3-triggered?", false);
      world.observer.setGlobal("event-4-triggered?", false);
      world.observer.setGlobal("event-6-triggered?", false);
      world.observer.setGlobal("event-7-triggered?", false);
      world.observer.setGlobal("event-8-triggered?", false);
      world.observer.setGlobal("event-9-triggered?", false);
      world.observer.setGlobal("event-1-completed?", false);
      world.observer.setGlobal("event-2-completed?", false);
      world.observer.setGlobal("event-3-completed?", false);
      world.observer.setGlobal("event-4-completed?", false);
      world.observer.setGlobal("event-6-completed?", false);
      world.observer.setGlobal("event-7-completed?", false);
      world.observer.setGlobal("event-8-completed?", false);
      world.observer.setGlobal("event-9-completed?", false);
      world.observer.setGlobal("mrnas-traveling", []);
      world.observer.setGlobal("mrnas-released", []);
      world.observer.setGlobal("codon-to-amino-acid-key", []);
      world.observer.setGlobal("original-dna-string", "");
      world.observer.setGlobal("duplicate-dna-string", "");
      world.observer.setGlobal("duplicate-ribosome-ycor", -7);
      world.observer.setGlobal("original-ribosome-ycor", 4);
      world.observer.setGlobal("duplicate-dna-ycor", -2);
      world.observer.setGlobal("original-dna-ycor", 1);
      world.observer.setGlobal("gene-color-counter", 1);
      world.observer.setGlobal("nucleotide-spacing", 0.45);
      world.observer.setGlobal("original-strand-gene-counter", 0);
      world.observer.setGlobal("duplicate-strand-gene-counter", 0);
      world.observer.setGlobal("original-display-mrna-counter", 0);
      world.observer.setGlobal("duplicate-display-mrna-counter", 0);
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PROMOTERS").getSpecialName(), "start")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("TERMINATORS").getSpecialName(), "end")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("TAGS").getSpecialName(), "empty")
      world.observer.setGlobal("terminator-color", [255, 0, 0, 150]);
      world.observer.setGlobal("nucleo-tag-color", [255, 255, 255, 120]);
      procedures["INITIALIZE-CODON-TO-AMINO-ACID-KEY"]();
      procedures["SETUP-STARTING-DNA"]();
      procedures["VISUALIZE-ALL-GENES"]();
      world.patches().ask(function() { SelfManager.self().setPatchVariable("pcolor", (105 - 4)); }, true);
      world.patches().agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("pycor"), 2); }).ask(function() { SelfManager.self().setPatchVariable("pcolor", (105 - 3.5)); }, true);
      world.patches().agentFilter(function() { return Prims.lt(SelfManager.self().getPatchVariable("pycor"), 0); }).ask(function() { SelfManager.self().setPatchVariable("pcolor", (55 - 4)); }, true);
      world.patches().agentFilter(function() { return Prims.lt(SelfManager.self().getPatchVariable("pycor"), -3); }).ask(function() { SelfManager.self().setPatchVariable("pcolor", (55 - 3.5)); }, true);
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
      procedures["SETUP-DNA-STRING"]();
      procedures["BUILD-GENES-FROM-DNA"]("original",world.observer.getGlobal("original-dna-string"));
      procedures["MAKE-A-NUCLEOTIDE-CHAIN-FOR-DNA-STRING"]("original",world.observer.getGlobal("original-dna-string"));
      procedures["PLACE-DNA"]("original");
      procedures["BUILD-MRNA-FOR-EACH-GENE"]("original");
      procedures["BUILD-PROTEIN-FROM-MRNA"]("original");
      procedures["PLACE-TRNAS"]("original");
      procedures["HIDE-MRNA"]("original");
      procedures["HIDE-TRNA"]("original");
      procedures["HIDE-GENES"]("original");
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
  procs["setupStartingDna"] = temp;
  procs["SETUP-STARTING-DNA"] = temp;
  temp = (function() {
    try {
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "from user-created-code")) {
        world.observer.setGlobal("original-dna-string", procedures["DNA-STRING-WITH-NON-NUCLEOTIDE-CHARACTERS-REPLACED"](world.observer.getGlobal("user-created-code")));
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "random (short strand)")) {
        let initialLengthDna = 12;
        for (let _index_6358_6364 = 0, _repeatcount_6358_6364 = StrictMath.floor(initialLengthDna); _index_6358_6364 < _repeatcount_6358_6364; _index_6358_6364++){
          world.observer.setGlobal("original-dna-string", (Dump('') + Dump(world.observer.getGlobal("original-dna-string")) + Dump(procedures["RANDOM-BASE-LETTER-DNA"]())));
        }
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "random (long strand)")) {
        let initialLengthDna = 56;
        for (let _index_6550_6556 = 0, _repeatcount_6550_6556 = StrictMath.floor(initialLengthDna); _index_6550_6556 < _repeatcount_6550_6556; _index_6550_6556++){
          world.observer.setGlobal("original-dna-string", (Dump('') + Dump(world.observer.getGlobal("original-dna-string")) + Dump(procedures["RANDOM-BASE-LETTER-DNA"]())));
        }
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "no genes (short strand)")) {
        world.observer.setGlobal("original-dna-string", "ATTATATCGTAG");
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "no genes (long strand)")) {
        world.observer.setGlobal("original-dna-string", "GATATTTGGTAGCCCGAGAAGTGGTTTTTCAGATAACAGAGGTGGAGCAGCTTTTAG");
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "1 short gene")) {
        world.observer.setGlobal("original-dna-string", "ATTATGTGGTAG");
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "1 long gene")) {
        world.observer.setGlobal("original-dna-string", "GGGATGGACACCTTATCATTTGCTACTAGCGACCAGTTTGAGTAGCTTCGTCGGTGA");
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "2 sequential genes")) {
        world.observer.setGlobal("original-dna-string", "AGTATGAAAACCCACGAGTGGTAGCCCGAGATTGAGATGTGGTTTTTCAGATAACAG");
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "2 nested genes")) {
        world.observer.setGlobal("original-dna-string", "GTTATGAGGGGGACCCGAGATGTGGTTTTTGAAATAGACAAGTAGACCCTAATAGAC");
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "3 sequential genes")) {
        world.observer.setGlobal("original-dna-string", "GATATGTGGTAGCCCGAGATGTGGTTTTTCAGATAACAGATGTGGAGCAGCTTTTAG");
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
  procs["setupDnaString"] = temp;
  procs["SETUP-DNA-STRING"] = temp;
  temp = (function(strandType) {
    try {
      let dna = Prims.turtleSet(world.turtleManager.turtlesOfBreed("GENES"), world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS"));
      dna.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        if (Prims.equality(strandType, "original")) {
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("original-dna-ycor"));
        }
        if (Prims.equality(strandType, "duplicate")) {
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("duplicate-dna-ycor"));
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
  procs["placeDna"] = temp;
  procs["PLACE-DNA"] = temp;
  temp = (function(strandType) {
    try {
      world.turtleManager.turtlesOfBreed("TRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        if (Prims.equality(strandType, "original")) {
          SelfManager.self().setVariable("ycor", (world.observer.getGlobal("original-ribosome-ycor") + 1));
        }
        if (Prims.equality(strandType, "duplicate")) {
          SelfManager.self().setVariable("ycor", (world.observer.getGlobal("duplicate-ribosome-ycor") + 1));
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
  procs["placeTrnas"] = temp;
  procs["PLACE-TRNAS"] = temp;
  temp = (function(strandType, dnaString) {
    try {
      let previousNucleotide = Nobody;
      let placeCounter = 0;
      world.turtleManager.createTurtles(1, "").ask(function() {
        SelfManager.self().setVariable("heading", 90);
        SelfManager.self()._optimalFdOne();
        for (let _index_8203_8209 = 0, _repeatcount_8203_8209 = StrictMath.floor(ListPrims.length(dnaString)); _index_8203_8209 < _repeatcount_8203_8209; _index_8203_8209++){
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
            SelfManager.self().setVariable("strand", strandType);
            SelfManager.self().setVariable("value", ListPrims.item(placeCounter, dnaString));
            SelfManager.self().setVariable("shape", (Dump('') + Dump("nucleotide-") + Dump(SelfManager.self().getVariable("value"))));
            SelfManager.self().setVariable("heading", 0);
            SelfManager.self().setVariable("place", placeCounter);
            procedures["ATTACH-TAG"](5,0.5,SelfManager.self().getVariable("value"),world.observer.getGlobal("nucleo-tag-color"));
            placeCounter = (placeCounter + 1);
          }, true);
          SelfManager.self().fd(world.observer.getGlobal("nucleotide-spacing"));
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
  procs["makeANucleotideChainForDnaString"] = temp;
  procs["MAKE-A-NUCLEOTIDE-CHAIN-FOR-DNA-STRING"] = temp;
  temp = (function(strandType, dnaString) {
    try {
      let remainingDna = dnaString;
      let thisItem = "";
      let lastItem = "";
      let lastLastItem = "";
      let triplet = "";
      let itemPosition = 0;
      let lastItemKept = ListPrims.length(dnaString);
      for (let _index_8923_8929 = 0, _repeatcount_8923_8929 = StrictMath.floor(ListPrims.length(dnaString)); _index_8923_8929 < _repeatcount_8923_8929; _index_8923_8929++){
        let firstItem = ListPrims.item(0, remainingDna);
        remainingDna = ListPrims.removeItem(0, remainingDna);
        lastLastItem = lastItem;
        lastItem = thisItem;
        thisItem = firstItem;
        triplet = (Dump('') + Dump(lastLastItem) + Dump(lastItem) + Dump(thisItem));
        if (Prims.equality(triplet, "ATG")) {
          world.turtleManager.createTurtles(1, "GENES").ask(function() {
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().setVariable("strand", strandType);
            if (Prims.equality(SelfManager.self().getVariable("strand"), "original")) {
              world.observer.setGlobal("original-strand-gene-counter", (world.observer.getGlobal("original-strand-gene-counter") + 1));
              SelfManager.self().setVariable("gene-number", world.observer.getGlobal("original-strand-gene-counter"));
            }
            if (Prims.equality(SelfManager.self().getVariable("strand"), "duplicate")) {
              world.observer.setGlobal("duplicate-strand-gene-counter", (world.observer.getGlobal("duplicate-strand-gene-counter") + 1));
              SelfManager.self().setVariable("gene-number", world.observer.getGlobal("duplicate-strand-gene-counter"));
            }
            SelfManager.self().setVariable("start-position", itemPosition);
            SelfManager.self().setVariable("end-position", ListPrims.length(world.observer.getGlobal("original-dna-string")));
            SelfManager.self().setVariable("code", (Dump('') + Dump(triplet) + Dump(ListPrims.substring(dnaString, (itemPosition + 1), ListPrims.length(dnaString)))));
          }, true);
        }
        itemPosition = (itemPosition + 1);
      }
      world.turtleManager.turtlesOfBreed("GENES").ask(function() {
        let endOfGene_p = false;
        let tripletCounter = 0;
        let newCode = SelfManager.self().getVariable("code");
        for (let _index_9996_10002 = 0, _repeatcount_9996_10002 = StrictMath.floor(NLMath.floor(Prims.div(ListPrims.length(SelfManager.self().getVariable("code")), 3))); _index_9996_10002 < _repeatcount_9996_10002; _index_9996_10002++){
          let thisTriplet = (Dump('') + Dump(ListPrims.item((0 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))) + Dump(ListPrims.item((1 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))) + Dump(ListPrims.item((2 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))));
          if ((((Prims.equality(thisTriplet, "TAG") || Prims.equality(thisTriplet, "TGA")) || Prims.equality(thisTriplet, "TAA")) && !endOfGene_p)) {
            SelfManager.self().setVariable("end-position", (tripletCounter * 3));
            newCode = ListPrims.substring(SelfManager.self().getVariable("code"), 0, SelfManager.self().getVariable("end-position"));
            endOfGene_p = true;
          }
          tripletCounter = (tripletCounter + 1);
        }
        tripletCounter = 0;
        endOfGene_p = false;
        SelfManager.self().setVariable("code", newCode);
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
  procs["buildGenesFromDna"] = temp;
  procs["BUILD-GENES-FROM-DNA"] = temp;
  temp = (function(strandType) {
    try {
      world.turtleManager.turtlesOfBreed("GENES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        let thisCode = SelfManager.self().getVariable("code");
        let thisGene = SelfManager.self();
        SelfManager.self().setVariable("heading", 90);
        SelfManager.self()._optimalFdLessThan1(0.1);
        for (let _index_10725_10731 = 0, _repeatcount_10725_10731 = StrictMath.floor(SelfManager.self().getVariable("start-position")); _index_10725_10731 < _repeatcount_10725_10731; _index_10725_10731++){
          SelfManager.self()._optimalFdLessThan1(0.45);
        }
        let geneColor = procedures["NEXT-GENE-COLOR"]();
        let geneColorWithTransparency = ListPrims.sentence(ColorModel.colorToRGB(geneColor), 110);
        let geneColorLabel = ListPrims.sentence(ColorModel.colorToRGB(geneColor), 250);
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PROMOTERS"));
          SelfManager.self().setVariable("color", geneColorWithTransparency);
          SelfManager.self().setVariable("size", 3);
          SelfManager.self().setVariable("hidden?", false);
          procedures["ATTACH-TAG"](142,1.7,(Dump('') + Dump("start:") + Dump(SelfManager.self().getVariable("gene-number"))),geneColorLabel);
          LinkPrims.createLinkFrom(thisGene, "BACKBONES").ask(function() {
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().setVariable("tie-mode", "fixed");
            SelfManager.self().tie();
          }, true);
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TERMINATORS"));
            SelfManager.self().fd((ListPrims.length(thisCode) * 0.45));
            procedures["ATTACH-TAG"](142,1.7,(Dump('') + Dump("end:") + Dump(SelfManager.self().getVariable("gene-number"))),geneColorLabel);
            LinkPrims.createLinkFrom(thisGene, "BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              SelfManager.self().setVariable("tie-mode", "fixed");
              SelfManager.self().tie();
            }, true);
          }, true);
        }, true);
        SelfManager.self().hatch(1, "").ask(function() {
          let thisMrna = SelfManager.self();
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("MRNAS"));
          SelfManager.self().setVariable("traveling?", false);
          SelfManager.self().setVariable("released?", false);
          SelfManager.self().setVariable("code", procedures["MRNA-STRING-FROM-DNA-STRING"](SelfManager.self().getVariable("code")));
          SelfManager.self().setVariable("cap-type", "start");
          SelfManager.self().setVariable("shape", "mrna-start");
          SelfManager.self().setVariable("hidden?", false);
          LinkPrims.createLinkFrom(thisGene, "BACKBONES").ask(function() {
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().setVariable("tie-mode", "fixed");
            SelfManager.self().tie();
          }, true);
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("cap-type", "stop");
            SelfManager.self().setVariable("shape", "mrna-stop");
            let nucleotideCounter = 0;
            LinkPrims.createLinkFrom(thisMrna, "BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              SelfManager.self().setVariable("tie-mode", "fixed");
              SelfManager.self().tie();
            }, true);
            let codeToTranscribe = SelfManager.self().getVariable("code");
            for (let _index_12422_12428 = 0, _repeatcount_12422_12428 = StrictMath.floor(ListPrims.length(SelfManager.self().getVariable("code"))); _index_12422_12428 < _repeatcount_12422_12428; _index_12422_12428++){
              SelfManager.self().hatch(1, "").ask(function() {
                SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES"));
                SelfManager.self().setVariable("value", ListPrims.first(codeToTranscribe));
                SelfManager.self().setVariable("shape", (Dump('') + Dump("mrna-") + Dump(SelfManager.self().getVariable("value"))));
                SelfManager.self().setVariable("heading", 180);
                procedures["ATTACH-TAG"](175,0.9,SelfManager.self().getVariable("value"),world.observer.getGlobal("nucleo-tag-color"));
                LinkPrims.createLinkFrom(thisMrna, "BACKBONES").ask(function() {
                  SelfManager.self().setVariable("hidden?", true);
                  SelfManager.self().setVariable("tie-mode", "fixed");
                  SelfManager.self().tie();
                }, true);
              }, true);
              codeToTranscribe = ListPrims.removeItem(0, codeToTranscribe);
              SelfManager.self().fd(world.observer.getGlobal("nucleotide-spacing"));
            }
          }, true);
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
  procs["buildMrnaForEachGene"] = temp;
  procs["BUILD-MRNA-FOR-EACH-GENE"] = temp;
  temp = (function(strandType) {
    try {
      world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("cap-type"), "start") && Prims.equality(SelfManager.self().getVariable("strand"), strandType));
      }).ask(function() {
        let numberOfTripletsInList = NLMath.floor(Prims.div(ListPrims.length(SelfManager.self().getVariable("code")), 3));
        let thisTriplet = "";
        let tripletCounter = 0;
        for (let _index_13127_13133 = 0, _repeatcount_13127_13133 = StrictMath.floor(numberOfTripletsInList); _index_13127_13133 < _repeatcount_13127_13133; _index_13127_13133++){
          thisTriplet = (Dump('') + Dump(procedures["COMPLEMENTARY-MRNA-BASE"](ListPrims.item((0 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))) + Dump(procedures["COMPLEMENTARY-MRNA-BASE"](ListPrims.item((1 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))) + Dump(procedures["COMPLEMENTARY-MRNA-BASE"](ListPrims.item((2 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))));
          procedures["BUILD-TRNA-FOR-THIS-TRIPLET"](thisTriplet,tripletCounter);
          tripletCounter = (tripletCounter + 1);
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
  procs["buildProteinFromMrna"] = temp;
  procs["BUILD-PROTEIN-FROM-MRNA"] = temp;
  temp = (function(thisTriplet, tripletCounter) {
    try {
      let thisTrna = Nobody;
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TRNAS"));
        thisTrna = SelfManager.self();
        SelfManager.self().setVariable("shape", "tRNA-core");
        SelfManager.self().setVariable("size", 1.2);
        SelfManager.self().setVariable("heading", 0);
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("AMINO-ACIDS"));
          SelfManager.self().setVariable("value", procedures["WHICH-PROTEIN-FOR-THIS-CODON"](thisTriplet));
          SelfManager.self().setVariable("shape", (Dump('') + Dump("amino-") + Dump(SelfManager.self().getVariable("value"))));
          SelfManager.self().setVariable("heading", 0);
          SelfManager.self().setVariable("size", 2);
          SelfManager.self()._optimalFdOne();
          LinkPrims.createLinkFrom(thisTrna, "BACKBONES").ask(function() {
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().setVariable("tie-mode", "free");
            SelfManager.self().tie();
          }, true);
          procedures["ATTACH-TAG"](20,0.8,SelfManager.self().getVariable("value"),world.observer.getGlobal("nucleo-tag-color"));
        }, true);
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TRNA-NUCLEOTIDES"));
          SelfManager.self().setVariable("shape", (Dump('') + Dump("trna-") + Dump(ListPrims.item(0, thisTriplet))));
          SelfManager.self().setVariable("heading", -155);
          SelfManager.self().fd(1.1);
          SelfManager.self().setVariable("heading", 0);
          LinkPrims.createLinkFrom(thisTrna, "BACKBONES").ask(function() {
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().setVariable("tie-mode", "fixed");
            SelfManager.self().tie();
          }, true);
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TRNA-NUCLEOTIDES"));
            SelfManager.self().setVariable("shape", (Dump('') + Dump("trna-") + Dump(ListPrims.item(1, thisTriplet))));
            SelfManager.self().setVariable("heading", 90);
            SelfManager.self()._optimalFdLessThan1(0.45);
            SelfManager.self().setVariable("heading", 0);
            LinkPrims.createLinkFrom(thisTrna, "BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              SelfManager.self().setVariable("tie-mode", "fixed");
              SelfManager.self().tie();
            }, true);
          }, true);
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TRNA-NUCLEOTIDES"));
            SelfManager.self().setVariable("shape", (Dump('') + Dump("trna-") + Dump(ListPrims.item(2, thisTriplet))));
            SelfManager.self().setVariable("heading", 90);
            SelfManager.self()._optimalFdLessThan1(0.9);
            SelfManager.self().setVariable("heading", 0);
            LinkPrims.createLinkFrom(thisTrna, "BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              SelfManager.self().setVariable("tie-mode", "fixed");
              SelfManager.self().tie();
            }, true);
          }, true);
        }, true);
        SelfManager.self()._optimalFdOne();
        SelfManager.self().setVariable("heading", 90);
        SelfManager.self().fd((world.observer.getGlobal("nucleotide-spacing") + ((world.observer.getGlobal("nucleotide-spacing") * 3) * tripletCounter)));
        SelfManager.self().setVariable("heading", 0);
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
  procs["buildTrnaForThisTriplet"] = temp;
  procs["BUILD-TRNA-FOR-THIS-TRIPLET"] = temp;
  temp = (function(direction, displacement, labelValue, colorValue) {
    try {
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("heading", direction);
        SelfManager.self().fd(displacement);
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TAGS"));
        SelfManager.self().setVariable("label", labelValue);
        SelfManager.self().setVariable("size", 0.1);
        SelfManager.self().setVariable("label-color", colorValue);
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
  procs["attachTag"] = temp;
  procs["ATTACH-TAG"] = temp;
  temp = (function() {
    try {
      Prims.turtleSet(world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS")).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("show-genes?")); }, true);
        SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("show-genes?"));
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
  procs["visualizeAllGenes"] = temp;
  procs["VISUALIZE-ALL-GENES"] = temp;
  temp = (function(strandType) {
    try {
      Prims.turtleSet(world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
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
  procs["hideGenes"] = temp;
  procs["HIDE-GENES"] = temp;
  temp = (function(strandType) {
    try {
      Prims.turtleSet(world.turtleManager.turtlesOfBreed("MRNAS"), world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
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
  procs["hideMrna"] = temp;
  procs["HIDE-MRNA"] = temp;
  temp = (function(strandType) {
    try {
      Prims.turtleSet(world.turtleManager.turtlesOfBreed("TRNAS"), world.turtleManager.turtlesOfBreed("TRNA-NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
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
  procs["hideTrna"] = temp;
  procs["HIDE-TRNA"] = temp;
  temp = (function(strandType) {
    try {
      let theseGenes = world.turtleManager.turtlesOfBreed("GENES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); });
      if (Prims.equality(theseGenes.size(), 0)) {
        procedures["DISPLAY-USER-MESSAGE-NO-GENES"]();
      }
      if (Prims.equality(strandType, "original")) {
        world.observer.setGlobal("original-display-mrna-counter", (world.observer.getGlobal("original-display-mrna-counter") + 1));
        if (Prims.gt(world.observer.getGlobal("original-display-mrna-counter"), theseGenes.size())) {
          world.observer.setGlobal("original-display-mrna-counter", 1);
        }
        world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start"));
        }).ask(function() {
          if (!Prims.equality(SelfManager.self().getVariable("gene-number"), world.observer.getGlobal("original-display-mrna-counter"))) {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", true);
          }
          else {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", false);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", false);
          }
          SelfManager.self().setVariable("traveling?", false);
          SelfManager.self().setVariable("released?", false);
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("original-dna-ycor"));
        }, true);
      }
      if (Prims.equality(strandType, "duplicate")) {
        world.observer.setGlobal("duplicate-display-mrna-counter", (world.observer.getGlobal("duplicate-display-mrna-counter") + 1));
        if (Prims.gt(world.observer.getGlobal("duplicate-display-mrna-counter"), theseGenes.size())) {
          world.observer.setGlobal("duplicate-display-mrna-counter", 1);
        }
        world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start"));
        }).ask(function() {
          if (!Prims.equality(SelfManager.self().getVariable("gene-number"), world.observer.getGlobal("duplicate-display-mrna-counter"))) {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", true);
          }
          else {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", false);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", false);
          }
          SelfManager.self().setVariable("traveling?", false);
          SelfManager.self().setVariable("released?", false);
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("duplicate-dna-ycor"));
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
  procs["showNextMrna"] = temp;
  procs["SHOW-NEXT-MRNA"] = temp;
  temp = (function(strandType) {
    try {
      let thisGeneNumber = procedures["GENE-NUMBER-FOR-THIS-STRAND"](strandType);
      world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (((Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start")) && SelfManager.self().getVariable("released?")) && Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber));
      }).ask(function() {
        world.turtleManager.turtlesOfBreed("TRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
          if (Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber)) {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", false);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", false);
          }
          else {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", true);
          }
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
  procs["showNextTrna"] = temp;
  procs["SHOW-NEXT-TRNA"] = temp;
  temp = (function() {
    try {
      UserDialogPrims.confirm("There are no genes in this strand of DNA. A specific sequence of 3 nucleotides is required for a gene");
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
  procs["displayUserMessageNoGenes"] = temp;
  procs["DISPLAY-USER-MESSAGE-NO-GENES"] = temp;
  temp = (function(strandType) {
    try {
      let makeProtein_p = false;
      let thisGeneNumber = procedures["GENE-NUMBER-FOR-THIS-STRAND"](strandType);
      world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (((Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start")) && SelfManager.self().getVariable("released?")) && Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber));
      }).ask(function() {
        world.turtleManager.turtlesOfBreed("TRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
          if (Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber)) {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              makeProtein_p = true;
              SelfManager.self().setVariable("hidden?", true);
              if (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS"))) {
                SelfManager.self().setVariable("hidden?", false);
                LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
              }
              else {
                SelfManager.self().setVariable("hidden?", true);
                LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
              }
            }, true);
          }
          else {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", true);
          }
          SelfManager.self().setVariable("hidden?", true);
        }, true);
        if (makeProtein_p) {
          procedures["MAKE-PROTEIN"](strandType);
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
  procs["releaseNextProtein"] = temp;
  procs["RELEASE-NEXT-PROTEIN"] = temp;
  temp = (function(strandType) {
    try {
      let thisGeneNumber = procedures["GENE-NUMBER-FOR-THIS-STRAND"](strandType);
      let thisProteinValue = "";
      let theseAminoAcids = world.turtleManager.turtlesOfBreed("AMINO-ACIDS").agentFilter(function() {
        return ((Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS")) && Prims.equality(strandType, SelfManager.self().getVariable("strand"))) && Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber));
      });
      let orderedAminoAcids = theseAminoAcids.sortOn(function() { return SelfManager.self().getVariable("who"); });
      Tasks.forEach(Tasks.commandTask(function(theAminoAcid) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        thisProteinValue = (Dump('') + Dump(thisProteinValue) + Dump("-") + Dump(theAminoAcid.projectionBy(function() { return SelfManager.self().getVariable("value"); })));
      }, "[ the-amino-acid ->\n    set this-protein-value (word   this-protein-value \"-\" ([value] of the-amino-acid))\n  ]"), orderedAminoAcids);
      if (!!world.turtleManager.turtlesOfBreed("PROTEINS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("value"), thisProteinValue));
      }).isEmpty()) {
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PROTEINS"));
          SelfManager.self().setVariable("value", thisProteinValue);
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().setXY(0, 0);
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
  procs["makeProtein"] = temp;
  procs["MAKE-PROTEIN"] = temp;
  temp = (function(strandType) {
    try {
      world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        SelfManager.self().setVariable("traveling?", true);
        SelfManager.self().setVariable("released?", false);
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
  procs["releaseNextMrnaFromNucleus"] = temp;
  procs["RELEASE-NEXT-MRNA-FROM-NUCLEUS"] = temp;
  temp = (function() {
    try {
      procedures["VISUALIZE-ALL-GENES"]();
      if (world.observer.getGlobal("event-1-triggered?")) {
        procedures["SHOW-NEXT-MRNA"]("original");
        world.observer.setGlobal("event-1-triggered?", false);
        world.observer.setGlobal("event-1-completed?", true);
        world.observer.setGlobal("event-2-completed?", false);
        world.observer.setGlobal("event-3-completed?", false);
        world.observer.setGlobal("event-4-completed?", false);
      }
      if ((world.observer.getGlobal("event-2-triggered?") && world.observer.getGlobal("event-1-completed?"))) {
        procedures["RELEASE-NEXT-MRNA-FROM-NUCLEUS"]("original");
        world.observer.setGlobal("event-2-triggered?", false);
        world.observer.setGlobal("event-3-completed?", false);
        world.observer.setGlobal("event-4-completed?", false);
      }
      if ((world.observer.getGlobal("event-3-triggered?") && world.observer.getGlobal("event-2-completed?"))) {
        procedures["SHOW-NEXT-TRNA"]("original");
        world.observer.setGlobal("event-3-triggered?", false);
        world.observer.setGlobal("event-3-completed?", true);
        world.observer.setGlobal("event-4-completed?", false);
      }
      if ((world.observer.getGlobal("event-4-triggered?") && world.observer.getGlobal("event-3-completed?"))) {
        procedures["RELEASE-NEXT-PROTEIN"]("original");
        world.observer.setGlobal("event-4-triggered?", false);
        world.observer.setGlobal("event-4-completed?", true);
      }
      if (world.observer.getGlobal("event-6-triggered?")) {
        procedures["SHOW-NEXT-MRNA"]("duplicate");
        world.observer.setGlobal("event-6-triggered?", false);
        world.observer.setGlobal("event-6-completed?", true);
        world.observer.setGlobal("event-7-completed?", false);
        world.observer.setGlobal("event-8-completed?", false);
        world.observer.setGlobal("event-9-completed?", false);
      }
      if ((world.observer.getGlobal("event-7-triggered?") && world.observer.getGlobal("event-6-completed?"))) {
        procedures["RELEASE-NEXT-MRNA-FROM-NUCLEUS"]("duplicate");
        world.observer.setGlobal("event-7-triggered?", false);
        world.observer.setGlobal("event-8-completed?", false);
        world.observer.setGlobal("event-9-completed?", false);
      }
      if ((world.observer.getGlobal("event-8-triggered?") && world.observer.getGlobal("event-7-completed?"))) {
        procedures["SHOW-NEXT-TRNA"]("duplicate");
        world.observer.setGlobal("event-8-triggered?", false);
        world.observer.setGlobal("event-8-completed?", true);
        world.observer.setGlobal("event-9-completed?", false);
      }
      if ((world.observer.getGlobal("event-9-triggered?") && world.observer.getGlobal("event-8-completed?"))) {
        procedures["RELEASE-NEXT-PROTEIN"]("duplicate");
        world.observer.setGlobal("event-9-triggered?", false);
        world.observer.setGlobal("event-9-completed?", true);
      }
      procedures["MOVE-MRNA-MOLECULES-OUT-OF-NUCLEUS"]();
      world.ticker.tick();
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
      world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (SelfManager.self().getVariable("traveling?") && Prims.equality(SelfManager.self().getVariable("cap-type"), "start"));
      }).ask(function() {
        if (Prims.equality(SelfManager.self().getVariable("strand"), "original")) {
          if (Prims.lt(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("original-ribosome-ycor"))) {
            SelfManager.self().setVariable("ycor", (SelfManager.self().getVariable("ycor") + 0.1));
          }
          if (Prims.gte(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("original-ribosome-ycor"))) {
            SelfManager.self().setVariable("traveling?", false);
            SelfManager.self().setVariable("released?", true);
            world.observer.setGlobal("event-2-completed?", true);
          }
        }
        if (Prims.equality(SelfManager.self().getVariable("strand"), "duplicate")) {
          if (Prims.gt(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("duplicate-ribosome-ycor"))) {
            SelfManager.self().setVariable("ycor", (SelfManager.self().getVariable("ycor") - 0.1));
          }
          if (Prims.lte(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("duplicate-ribosome-ycor"))) {
            SelfManager.self().setVariable("traveling?", false);
            SelfManager.self().setVariable("released?", true);
            world.observer.setGlobal("event-7-completed?", true);
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
  procs["moveMrnaMoleculesOutOfNucleus"] = temp;
  procs["MOVE-MRNA-MOLECULES-OUT-OF-NUCLEUS"] = temp;
  temp = (function() {
    try {
      OutputPrims.clear();
      let originalProteins = world.turtleManager.turtlesOfBreed("PROTEINS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), "original"); });
      OutputPrims.print("Proteins Produced");
      OutputPrims.print((Dump('') + Dump("from original DNA  = ") + Dump(originalProteins.size())));
      OutputPrims.print("::::::::::::::::::");
      originalProteins.ask(function() {
        OutputPrims.print((Dump('') + Dump("Orig.Gene #") + Dump(SelfManager.self().getVariable("gene-number")) + Dump(" > Protein:")));
        OutputPrims.print(SelfManager.self().getVariable("value"));
        OutputPrims.print("");
      }, true);
      OutputPrims.print("==================");
      let duplicateProteins = world.turtleManager.turtlesOfBreed("PROTEINS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), "duplicate"); });
      OutputPrims.print("Proteins Produced");
      OutputPrims.print((Dump('') + Dump("from copy of DNA = ") + Dump(duplicateProteins.size())));
      OutputPrims.print("::::::::::::::::::");
      duplicateProteins.ask(function() {
        OutputPrims.print((Dump('') + Dump("Copy.Gene #") + Dump(SelfManager.self().getVariable("gene-number")) + Dump(" > Protein:")));
        OutputPrims.print(SelfManager.self().getVariable("value"));
        OutputPrims.print("");
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
  procs["showProteinProduction"] = temp;
  procs["SHOW-PROTEIN-PRODUCTION"] = temp;
  temp = (function() {
    try {
      let positionCounter = 0;
      world.observer.setGlobal("duplicate-strand-gene-counter", 0);
      let cleanDuplicateDnaString = world.observer.getGlobal("original-dna-string");
      let mutatingCopyOfDnaString = world.observer.getGlobal("original-dna-string");
      let targetLoci = Prims.random((ListPrims.length(mutatingCopyOfDnaString) - world.observer.getGlobal("#-nucleotides-affected")));
      let dnaAtTarget = ListPrims.item(targetLoci, mutatingCopyOfDnaString);
      let dnaBeforeTarget = ListPrims.substring(mutatingCopyOfDnaString, 0, targetLoci);
      let lociCounter = 0;
      let dnaAtAndAfterTarget = ListPrims.substring(mutatingCopyOfDnaString, targetLoci, ListPrims.length(mutatingCopyOfDnaString));
      if (Prims.equality(world.observer.getGlobal("mutation-type"), "deletion")) {
        for (let _index_24050_24056 = 0, _repeatcount_24050_24056 = StrictMath.floor(world.observer.getGlobal("#-nucleotides-affected")); _index_24050_24056 < _repeatcount_24050_24056; _index_24050_24056++){
          mutatingCopyOfDnaString = ListPrims.removeItem(targetLoci, mutatingCopyOfDnaString);
        }
      }
      if (Prims.equality(world.observer.getGlobal("mutation-type"), "substitution")) {
        for (let _index_24236_24242 = 0, _repeatcount_24236_24242 = StrictMath.floor(world.observer.getGlobal("#-nucleotides-affected")); _index_24236_24242 < _repeatcount_24236_24242; _index_24236_24242++){
          mutatingCopyOfDnaString = ListPrims.replaceItem((targetLoci + lociCounter), mutatingCopyOfDnaString, procedures["RANDOM-BASE-LETTER-DNA"]());
          lociCounter = (lociCounter + 1);
        }
      }
      if (Prims.equality(world.observer.getGlobal("mutation-type"), "insertion")) {
        for (let _index_24503_24509 = 0, _repeatcount_24503_24509 = StrictMath.floor(world.observer.getGlobal("#-nucleotides-affected")); _index_24503_24509 < _repeatcount_24503_24509; _index_24503_24509++){
          dnaAtAndAfterTarget = (Dump('') + Dump(procedures["RANDOM-BASE-LETTER-DNA"]()) + Dump(dnaAtAndAfterTarget));
        }
        mutatingCopyOfDnaString = (Dump('') + Dump(dnaBeforeTarget) + Dump(dnaAtAndAfterTarget));
      }
      world.observer.setGlobal("duplicate-dna-string", mutatingCopyOfDnaString);
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
  procs["makeDuplicateDnaString"] = temp;
  procs["MAKE-DUPLICATE-DNA-STRING"] = temp;
  temp = (function() {
    try {
      let turtlesToRemove = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("MRNAS"), world.turtleManager.turtlesOfBreed("TRNAS"), world.turtleManager.turtlesOfBreed("GENES"), world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS"), world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES"));
      turtlesToRemove.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), "duplicate"); }).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().die(); }, true);
        SelfManager.self().die();
      }, true);
      procedures["MAKE-DUPLICATE-DNA-STRING"]();
      procedures["BUILD-GENES-FROM-DNA"]("duplicate",world.observer.getGlobal("duplicate-dna-string"));
      procedures["MAKE-A-NUCLEOTIDE-CHAIN-FOR-DNA-STRING"]("duplicate",world.observer.getGlobal("duplicate-dna-string"));
      procedures["PLACE-DNA"]("duplicate");
      procedures["BUILD-MRNA-FOR-EACH-GENE"]("duplicate");
      procedures["BUILD-PROTEIN-FROM-MRNA"]("duplicate");
      procedures["PLACE-TRNAS"]("duplicate");
      procedures["HIDE-MRNA"]("duplicate");
      procedures["HIDE-TRNA"]("duplicate");
      procedures["HIDE-GENES"]("duplicate");
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
  procs["replicateDna"] = temp;
  procs["REPLICATE-DNA"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("codon-to-amino-acid-key", [["UUU", "Phe"], ["UUC", "Phe"], ["UUA", "Leu"], ["UUG", "Leu"], ["CUU", "Leu"], ["CUC", "Leu"], ["CUA", "Leu"], ["CUG", "Leu"], ["AUU", "Ile"], ["AUC", "Ile"], ["AUA", "Ile"], ["AUG", "Met"], ["GUU", "Val"], ["GUC", "Val"], ["GUA", "Val"], ["GUG", "Val"], ["UCU", "Ser"], ["UCC", "Ser"], ["UCA", "Ser"], ["UCG", "Ser"], ["CCU", "Pro"], ["CCC", "Pro"], ["CCA", "Pro"], ["CCG", "Pro"], ["ACU", "Thr"], ["ACC", "Thr"], ["ACA", "Thr"], ["ACG", "Thr"], ["GCU", "Ala"], ["GCC", "Ala"], ["GCA", "Ala"], ["GCG", "Ala"], ["UAU", "Tyr"], ["UAC", "Tyr"], ["UAA", "Stop"], ["UAG", "Stop"], ["CAU", "His"], ["CAC", "His"], ["CAA", "Gln"], ["CAG", "Gln"], ["AAU", "Asn"], ["AAC", "Asn"], ["AAA", "Lys"], ["AAG", "Lys"], ["GAU", "Asp"], ["GAC", "Asp"], ["GAA", "Glu"], ["GAG", "Glu"], ["UGU", "Cys"], ["UGC", "Cys"], ["UGA", "Stop"], ["UGG", "Trp"], ["CGU", "Arg"], ["CGC", "Arg"], ["CGA", "Arg"], ["CGG", "Arg"], ["AGU", "Ser"], ["AGC", "Ser"], ["AGA", "Arg"], ["AGG", "Arg"], ["GGU", "Gly"], ["GGC", "Gly"], ["GGA", "Gly"], ["GGG", "Gly"]]);
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
  procs["initializeCodonToAminoAcidKey"] = temp;
  procs["INITIALIZE-CODON-TO-AMINO-ACID-KEY"] = temp;
  temp = (function(thisCodon) {
    try {
      throw new Exception.ReportInterrupt(ListPrims.item(1, ListPrims.item(0, world.observer.getGlobal("codon-to-amino-acid-key").filter(Tasks.reporterTask(function(pair) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        return Prims.equality(ListPrims.first(pair), thisCodon);
      }, "[ pair -> first pair = this-codon]")))));
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
  procs["whichProteinForThisCodon"] = temp;
  procs["WHICH-PROTEIN-FOR-THIS-CODON"] = temp;
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
  procs["randomBaseLetterDna"] = temp;
  procs["RANDOM-BASE-LETTER-DNA"] = temp;
  temp = (function(base) {
    try {
      let baseToReport = "";
      if (Prims.equality(base, "A")) {
        baseToReport = "U";
      }
      if (Prims.equality(base, "T")) {
        baseToReport = "A";
      }
      if (Prims.equality(base, "U")) {
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
  procs["complementaryMrnaBase"] = temp;
  procs["COMPLEMENTARY-MRNA-BASE"] = temp;
  temp = (function() {
    try {
      if (Prims.gte(world.observer.getGlobal("gene-color-counter"), (ListPrims.length(ColorModel.BASE_COLORS) - 1))) {
        world.observer.setGlobal("gene-color-counter", 0);
      }
      else {
        world.observer.setGlobal("gene-color-counter", (world.observer.getGlobal("gene-color-counter") + 1));
      }
      throw new Exception.ReportInterrupt(ListPrims.item(world.observer.getGlobal("gene-color-counter"), ColorModel.BASE_COLORS));
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
  procs["nextGeneColor"] = temp;
  procs["NEXT-GENE-COLOR"] = temp;
  temp = (function(strandType) {
    try {
      let thisGeneNumber = 0;
      if (Prims.equality(strandType, "original")) {
        thisGeneNumber = world.observer.getGlobal("original-display-mrna-counter");
      }
      if (Prims.equality(strandType, "duplicate")) {
        thisGeneNumber = world.observer.getGlobal("duplicate-display-mrna-counter");
      }
      throw new Exception.ReportInterrupt(thisGeneNumber);
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
  procs["geneNumberForThisStrand"] = temp;
  procs["GENE-NUMBER-FOR-THIS-STRAND"] = temp;
  temp = (function(dnaString) {
    try {
      let newString = dnaString;
      let nextItem = 0;
      for (let _index_28754_28760 = 0, _repeatcount_28754_28760 = StrictMath.floor(ListPrims.length(dnaString)); _index_28754_28760 < _repeatcount_28754_28760; _index_28754_28760++){
        newString = ListPrims.replaceItem(nextItem, newString, procedures["COMPLEMENTARY-MRNA-BASE"](ListPrims.item(nextItem, newString)));
        nextItem = (nextItem + 1);
      }
      throw new Exception.ReportInterrupt(newString);
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
  procs["mrnaStringFromDnaString"] = temp;
  procs["MRNA-STRING-FROM-DNA-STRING"] = temp;
  temp = (function(dnaString) {
    try {
      let newString = dnaString;
      let nextItem = 0;
      for (let _index_29220_29226 = 0, _repeatcount_29220_29226 = StrictMath.floor(ListPrims.length(dnaString)); _index_29220_29226 < _repeatcount_29220_29226; _index_29220_29226++){
        newString = ListPrims.replaceItem(nextItem, newString, procedures["REPLACE-NON-NUCLEOTIDE-CHARACTER"](ListPrims.item(nextItem, newString)));
        nextItem = (nextItem + 1);
      }
      if (Prims.gt(ListPrims.length(dnaString), 64)) {
        newString = ListPrims.substring(newString, 0, 64);
      }
      throw new Exception.ReportInterrupt(newString);
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
  procs["dnaStringWithNonNucleotideCharactersReplaced"] = temp;
  procs["DNA-STRING-WITH-NON-NUCLEOTIDE-CHARACTERS-REPLACED"] = temp;
  temp = (function(nucleotideCharacter) {
    try {
      let characterToReturn = nucleotideCharacter;
      if ((((!Prims.equality(nucleotideCharacter, "A") && !Prims.equality(nucleotideCharacter, "T")) && !Prims.equality(nucleotideCharacter, "C")) && !Prims.equality(nucleotideCharacter, "G"))) {
        characterToReturn = procedures["RANDOM-BASE-LETTER-DNA"]();
      }
      throw new Exception.ReportInterrupt(characterToReturn);
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
  procs["replaceNonNucleotideCharacter"] = temp;
  procs["REPLACE-NON-NUCLEOTIDE-CHARACTER"] = temp;
  temp = (function() {
    try {
      throw new Exception.ReportInterrupt((Prims.equality(world.observer.getGlobal("current-instruction"), 0) ? "press setup" : (Dump('') + Dump(world.observer.getGlobal("current-instruction")) + Dump(" of ") + Dump(ListPrims.length(procedures["INSTRUCTIONS"]())))));
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
        }, "output-print"), ListPrims.item((world.observer.getGlobal("current-instruction") - 1), procedures["INSTRUCTIONS"]()));
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
      throw new Exception.ReportInterrupt([["You will be simulating the process", "of protein synthesis from DNA that", "occurs in every cell.  And you will", "explore the effects of mutations", "on the proteins that are produced."], ["When you press SETUP, a single", "strand of an unwound DNA molecule", "appears. This represents the state", "of DNA in the cell nucleus during", "transcription."], ["To produce proteins, each gene in", "the original DNA strand must be", "transcribed  into an mRNA molecule.", "Do this by pressing GO/STOP and", "then the 1-TRANSCRIBE button."], ["For each mRNA molecule that was", "transcribed, press the 2-RELEASE", "button.  This releases the mRNA", "from the nucleus  into the ribosome", "of the cell."], ["For each mRNA molecule in the", "ribosome, press the 3-TRANSLATE", "button.  This pairs up molecules", "of tRNA with each set of three", "nucleotides in the mRNA molecule."], ["For each tRNA chain built, press", "the 4-RELEASE button.  This", "releases the amino acid chain", "from the rest of the tRNA chain,", "leaving behind the protein", "molecule that is produced."], ["Each time the 1-TRANSCRIBE", "button is pressed, the next gene", "in the original strand of DNA ", "will be transcribed.  Press the 1-,", "2-, 3-, 4- buttons and repeat to", "translate each subsequent gene."], ["When you press the 5-REPLICATE", "THE ORIGINAL DNA button a copy", "of the original DNA will be ", "generated for a new cell", "(as in mitosis or meiosis) and", "it will appear in the green."], ["The replicated DNA will have a", "# of random mutations, set by", "#-NUCLEOTIDES-AFFECTED, each", "mutation of the type set by", "MUTATION-TYPE. Press button 5)", "again to explore possible outcomes."], ["Now repeat the same transcription,", "release, translation, and release", "process for the DNA in this new", "cell by pressing 6-, 7-, 8-, 9-.", "Repeat that sequence again to", "cycle through to the next gene."], ["If you want to test the outcomes", "for your own DNA code, type any", "sequence of A, G, T, C in the", "USER-CREATED-CODE box and set", "the INITIAL-DNA-STRING to", "“from-user-code”.  Then press", "SETUP and start over again."]]);
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
  temp = (function() {
    try {
      if ((((world.observer.getGlobal("event-1-triggered?") || world.observer.getGlobal("event-2-triggered?")) || world.observer.getGlobal("event-3-triggered?")) || world.observer.getGlobal("event-4-triggered?"))) {
        world.observer.setGlobal("event-4-completed?", false);
        if (((world.observer.getGlobal("event-1-triggered?") || world.observer.getGlobal("event-2-triggered?")) || world.observer.getGlobal("event-3-triggered?"))) {
          world.observer.setGlobal("event-3-completed?", false);
          if ((world.observer.getGlobal("event-1-triggered?") || world.observer.getGlobal("event-2-triggered?"))) {
            world.observer.setGlobal("event-2-completed?", false);
            if (world.observer.getGlobal("event-1-triggered?")) {
              world.observer.setGlobal("event-1-completed?", false);
            }
          }
        }
      }
      if ((((world.observer.getGlobal("event-6-triggered?") || world.observer.getGlobal("event-7-triggered?")) || world.observer.getGlobal("event-8-triggered?")) || world.observer.getGlobal("event-9-triggered?"))) {
        world.observer.setGlobal("event-9-completed?", false);
        if (((world.observer.getGlobal("event-6-triggered?") || world.observer.getGlobal("event-7-triggered?")) || world.observer.getGlobal("event-8-triggered?"))) {
          world.observer.setGlobal("event-8-completed?", false);
          if ((world.observer.getGlobal("event-6-triggered?") || world.observer.getGlobal("event-7-triggered?"))) {
            world.observer.setGlobal("event-7-completed?", false);
            if (world.observer.getGlobal("event-6-triggered?")) {
              world.observer.setGlobal("event-6-completed?", false);
            }
          }
        }
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
  procs["resetCompletedEvents"] = temp;
  procs["RESET-COMPLETED-EVENTS"] = temp;
  return procs;
})();
world.observer.setGlobal("initial-dna-string", "1 long gene");
world.observer.setGlobal("user-created-code", "AAAAA");
world.observer.setGlobal("#-nucleotides-affected", 1);
world.observer.setGlobal("mutation-type", "substitution");
world.observer.setGlobal("show-genes?", true);
