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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[150,165,165,180,180,195,195,210,210,165,165,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,135,120,120,105,105,90,90,135,135,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"amino acid":{"name":"amino acid","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[105,150,195,195,150,105,105],"ycors":[135,165,135,90,60,90,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":45,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-ala":{"name":"amino-ala","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"amino-arg":{"name":"amino-arg","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":75,"x2":150,"y2":75,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":108,"y":64,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":27,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"amino-asn":{"name":"amino-asn","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":187,"x2":150,"y2":187,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":106,"y":175,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"amino-asp":{"name":"amino-asp","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":120,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false}]},"amino-cys":{"name":"amino-cys","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false}]},"amino-gln":{"name":"amino-gln","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":150,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":120,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":108,"y":139,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"amino-glu":{"name":"amino-glu","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":75,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"amino-gly":{"name":"amino-gly","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"amino-his":{"name":"amino-his","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[195,240,255,217,180],"ycors":[225,225,180,154,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":225,"x2":195,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":183,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":228,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":243,"y":169,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":168,"y":169,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":206,"y":143,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-ile":{"name":"amino-ile","editableColorIndex":0,"rotate":true,"elements":[{"x1":121,"y1":226,"x2":151,"y2":226,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":106,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-leu":{"name":"amino-leu","editableColorIndex":0,"rotate":true,"elements":[{"x1":105,"y1":135,"x2":150,"y2":165,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":165,"x2":195,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-lys":{"name":"amino-lys","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":90,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-met":{"name":"amino-met","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false}]},"amino-phe":{"name":"amino-phe","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[119,120,150,180,179,150,119],"ycors":[147,180,195,179,146,131,148],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":224,"x2":149,"y2":194,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":149,"y2":223,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":138,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":139,"y":120,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":109,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":109,"y":168,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":167,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":167,"y":168,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-pro":{"name":"amino-pro","editableColorIndex":0,"rotate":true,"elements":[{"x1":210,"y1":210,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":135,"y1":210,"x2":180,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":165,"y1":180,"x2":210,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":135,"y1":210,"x2":150,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":160,"y":166,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":120,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":195,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-ser":{"name":"amino-ser","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"amino-thr":{"name":"amino-thr","editableColorIndex":0,"rotate":true,"elements":[{"x1":118,"y1":190,"x2":148,"y2":190,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":105,"y":177,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1.0)","filled":true,"marked":false}]},"amino-trp":{"name":"amino-trp","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[204,181,181,225,226],"ycors":[137,163,194,195,161],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[224,225,255,285,284,255,224],"ycors":[162,195,210,195,161,146,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":224,"x2":180,"y2":197,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":149,"y2":223,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":243,"y":198,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":244,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":214,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":214,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":272,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":272,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":169,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":192,"y":125,"diam":24,"type":"circle","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false},{"x":169,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-tyr":{"name":"amino-tyr","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"xcors":[105,150,195,195,150,105,105],"ycors":[135,165,135,90,60,90,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":90,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":0,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":135,"y":45,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"amino-val":{"name":"amino-val","editableColorIndex":0,"rotate":true,"elements":[{"x1":105,"y1":180,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":195,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":165,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":180,"y":165,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"empty":{"name":"empty","editableColorIndex":0,"rotate":false,"elements":[]},"end":{"name":"end","editableColorIndex":2,"rotate":false,"elements":[{"xcors":[130,145,160,175,220,235,250,265,265,250,235,220,175,160,145,130],"ycors":[61,46,46,61,61,46,46,61,226,241,241,226,226,241,241,226],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":true},{"xcors":[130,145,160,175,220,235,250,265,265,250,235,220,175,160,145,130],"ycors":[61,46,46,61,61,46,46,61,226,241,241,226,226,241,241,226],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"helicase":{"name":"helicase","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"helicase-expanded":{"name":"helicase-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"mrna-a":{"name":"mrna-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"mrna-c":{"name":"mrna-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"mrna-g":{"name":"mrna-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"mrna-start":{"name":"mrna-start","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,0,15,30,30,60,60,150],"ycors":[240,240,270,270,300,300,270,270],"type":"polygon","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"mrna-stop":{"name":"mrna-stop","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[180,30,30,105,105,135,135,165],"ycors":[240,240,270,270,300,300,270,270],"type":"polygon","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"mrna-u":{"name":"mrna-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-a":{"name":"nucleoside-tri-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-c":{"name":"nucleoside-tri-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,135,165,165,135,60],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-g":{"name":"nucleoside-tri-g","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-t":{"name":"nucleoside-tri-t","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false}]},"nucleoside-tri-u":{"name":"nucleoside-tri-u","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false}]},"nucleotide-a":{"name":"nucleotide-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"nucleotide-c":{"name":"nucleotide-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"nucleotide-g":{"name":"nucleotide-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleotide-t":{"name":"nucleotide-t","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleotide-u":{"name":"nucleotide-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"nucleotide-x":{"name":"nucleotide-x","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,180,120,180,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"phosphate":{"name":"phosphate","editableColorIndex":0,"rotate":true,"elements":[{"x":129,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"phosphate-pair":{"name":"phosphate-pair","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":135,"x2":150,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x":144,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"x":99,"y":120,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false}]},"polymerase-0":{"name":"polymerase-0","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,60,60,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":0,"xmax":120,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true},{"xmin":120,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"polymerase-1":{"name":"polymerase-1","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true},{"xmin":105,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"polymerase-2":{"name":"polymerase-2","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"x1":180,"y1":60,"x2":180,"y2":240,"type":"line","color":"rgba(215, 50, 41, 1.0)","filled":false,"marked":true},{"xmin":120,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"polymerase-3":{"name":"polymerase-3","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true},{"xmin":90,"ymin":135,"xmax":315,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"promoter-expanded":{"name":"promoter-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,105,90,75,60,45,15,30,60,75],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,105,90,75,60,45,15,30,60,75],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1.0)","filled":false,"marked":false}]},"start":{"name":"start","editableColorIndex":0,"rotate":false,"elements":[{"xmin":125,"ymin":46,"xmax":260,"ymax":240,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xmin":126,"ymin":47,"xmax":260,"ymax":239,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":true,"elements":[{"x":76,"y":76,"diam":146,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":60,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":195,"x2":150,"y2":240,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"trna-a":{"name":"trna-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"trna-c":{"name":"trna-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":61,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false}]},"trna-core":{"name":"trna-core","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[15,285,300,300,195,195,210,225,240,240,225,210,195,195,180,180,285,285,270,30,15,15,105,105,90,90,75,60,45,45,60,75,90,90,0,0],"ycors":[300,300,270,240,210,150,165,165,150,135,120,120,135,75,75,225,255,270,285,285,270,255,225,135,135,165,150,150,165,180,195,195,180,210,240,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"trna-g":{"name":"trna-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":false},{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false}]},"trna-u":{"name":"trna-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1.0)","filled":false,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    input: function(str) { return 'dummy implementation'; },
    notify: function(str) {},
    yesOrNo: function(str) { return true; }
  }
}
if (typeof javax !== "undefined") {
  modelConfig.exporting = {
    exportOutput: function(filename) {},
    exportView: function(filename) {}
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
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "GENES", singular: "gene", varNames: ["gene-number", "strand", "code", "start-position", "end-position"] }, { name: "NUCLEOTIDES", singular: "nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "PROMOTERS", singular: "promoter", varNames: ["gene-number", "strand"] }, { name: "TERMINATORS", singular: "terminator", varNames: ["gene-number", "strand"] }, { name: "MRNA-NUCLEOTIDES", singular: "mrna-nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "MRNAS", singular: "mrna", varNames: ["gene-number", "strand", "code", "cap-type", "traveling?", "released?"] }, { name: "TRNAS", singular: "trna", varNames: ["gene-number", "strand"] }, { name: "TRNA-NUCLEOTIDES", singular: "trna-nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "AMINO-ACIDS", singular: "amino-acid", varNames: ["gene-number", "strand", "value", "place"] }, { name: "PROTEINS", singular: "protein", varNames: ["gene-number", "strand", "value"] }, { name: "TAGS", singular: "tag", varNames: ["value"] }, { name: "TAGLINES", singular: "tagline", varNames: [], isDirected: false }, { name: "BACKBONES", singular: "backbone", varNames: [], isDirected: true }])([], [])(';;;;;;;;;;;;; DNA molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n;; keeps a list of the dna code for a given gene\nbreed [genes gene]\n\n;; the pieces that are inside the dna chain\nbreed [nucleotides nucleotide]\n\n;; a visualization agent (similar to a promoter protein)\n;; that attaches to every start codon location in a DNA chain\nbreed [promoters promoter]\n\n;; a visualization agent that attaches to every stop codon location in a DNA chain\nbreed [terminators terminator]\n\n;;;;;;;;;;;;; mRNA molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n;; the pieces that are inside the mRNA chain\nbreed [mRNA-nucleotides mRNA-nucleotide]\n\n;; the tail ends of the mRNA chain\nbreed [mRNAs mRNA]\n\n;;;;;;;;;;;;; tRNA molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n;; the center piece of the tRNA complex\nbreed [tRNAs tRNA]\n\n;; the pieces that are inside the tRNA complex\nbreed [tRNA-nucleotides tRNA-nucleotide]\n\n;; the top part of the tRNA complex\nbreed [amino-acids amino-acid]\n\n;;;;;;;;;;;;; protein molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\nbreed [proteins protein]                    ;; holds proteins information\n\n;;;;;;;;;;;;; tags for supporting a fine tuned placement of labels ;;;;;;;;;;;;;\nbreed [tags tag]\n\n;;;;;;;;;;;;; links ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n;; the link between an agent and where its label agent is.\n;; This allows fine tuned placement of visualizing of labels\nundirected-link-breed [taglines tagline]\n\n;; the link between adjacent amino acids in a protein.\n;; It will allows the entire protein to be folded up\n;; (not currently implemented)\ndirected-link-breed   [backbones backbone]\n\n;;;;;;;;;;;;;;;;;;;turtle variables ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\ngenes-own            [gene-number strand code start-position end-position]\nmRNAs-own            [gene-number strand code cap-type traveling? released?]\npromoters-own        [gene-number strand]\nterminators-own      [gene-number strand]\ntRNAs-own            [gene-number strand]\nproteins-own         [gene-number strand value]\namino-acids-own      [gene-number strand value place]\nnucleotides-own      [gene-number strand value place]\nmRNA-nucleotides-own [gene-number strand value place]\ntRNA-nucleotides-own [gene-number strand value place]\ntags-own [\n  value ; the value for the label of the agent it is linked to when visualized.\n]\n\n\n\n;;;;;;;;;;;;;globals ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nglobals [\n\n  current-instruction               ;; holds counter value for which instruction is being displayed\n  codon-to-amino-acid-key           ;; holds lookup table for codon triplet to amino acid\n  original-dna-string               ;; holds a string of the original DNA\n  duplicate-dna-string              ;; holds a string of the duplicate DNA.  This changes every time the replicate DNA button is pressed\n\n  ;; position values for visualization\n  duplicate-ribosome-ycor\n  original-ribosome-ycor\n  duplicate-dna-ycor\n  original-dna-ycor\n  nucleotide-spacing\n\n  ;; colors for various agents and states of agents\n  nucleo-tag-color\n  terminator-color\n  gene-color-counter\n\n  ;; counters for the number of genes\n  original-strand-gene-counter\n  duplicate-strand-gene-counter\n  original-display-mrna-counter\n  duplicate-display-mrna-counter\n\n  mRNAs-traveling                    ;; list of mRNAs traveling\n  mRNAs-released                     ;; list of mRNAs released\n\n  ;; for keeping track of user initiated events\n  replicate-dna-event?\n  show-genes-event?\n  event-1-triggered?\n  event-2-triggered?\n  event-3-triggered?\n  event-4-triggered?\n  event-6-triggered?\n  event-7-triggered?\n  event-8-triggered?\n  event-9-triggered?\n  event-1-completed?\n  event-2-completed?\n  event-3-completed?\n  event-4-completed?\n  event-6-completed?\n  event-7-completed?\n  event-8-completed?\n  event-9-completed?\n]\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;setup procedures;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto setup\n  clear-all\n  set replicate-dna-event? false\n  set show-genes-event? false\n\n  set event-1-triggered? false\n  set event-2-triggered? false\n  set event-3-triggered? false\n  set event-4-triggered? false\n  set event-6-triggered? false\n  set event-7-triggered? false\n  set event-8-triggered? false\n  set event-9-triggered? false\n  set event-1-completed? false\n  set event-2-completed? false\n  set event-3-completed? false\n  set event-4-completed? false\n  set event-6-completed? false\n  set event-7-completed? false\n  set event-8-completed? false\n  set event-9-completed? false\n\n\n  set mRNAs-traveling []\n  set mRNAs-released  []\n  set codon-to-amino-acid-key []\n  set original-dna-string \"\"\n  set duplicate-dna-string \"\"\n\n  set duplicate-ribosome-ycor -7\n  set original-ribosome-ycor 4\n  set duplicate-dna-ycor -2\n  set original-dna-ycor 1\n  set gene-color-counter 1\n  set nucleotide-spacing .45\n\n  set original-strand-gene-counter 0\n  set duplicate-strand-gene-counter 0\n  set original-display-mrna-counter 0\n  set duplicate-display-mrna-counter 0\n\n  set-default-shape promoters \"start\"\n  set-default-shape terminators \"end\"\n  set-default-shape tags \"empty\"\n\n  set terminator-color      [255 0 0 150]\n  set nucleo-tag-color      [255 255 255 120]\n\n  initialize-codon-to-amino-acid-key\n  setup-starting-dna\n  visualize-all-genes\n  ask patches [set pcolor blue - 4]\n  ask patches with [pycor > 2]  [set pcolor blue - 3.5]\n  ask patches with [pycor < 0]  [set pcolor green - 4]\n  ask patches with [pycor < -3] [set pcolor green - 3.5]\n  show-instruction 1\n  reset-ticks\nend\n\n\nto setup-starting-dna\n  setup-dna-string\n  build-genes-from-dna \"original\" original-dna-string\n  make-a-nucleotide-chain-for-dna-string \"original\" original-dna-string\n  place-dna \"original\"\n  build-mrna-for-each-gene \"original\"\n  build-protein-from-mrna  \"original\"\n  place-trnas \"original\"\n  hide-mrna   \"original\"\n  hide-trna   \"original\"\n  hide-genes  \"original\"\nend\n\n\n\n;; original-dna-string\nto setup-dna-string\n  if initial-dna-string = \"from user-created-code\" [set original-dna-string dna-string-with-non-nucleotide-characters-replaced user-created-code]\n  if initial-dna-string = \"random (short strand)\" [\n    let initial-length-dna 12\n    repeat initial-length-dna [set original-dna-string (word original-dna-string random-base-letter-DNA)]\n  ]\n  if initial-dna-string = \"random (long strand)\"  [\n    let initial-length-dna 56\n    repeat initial-length-dna [set original-dna-string (word original-dna-string random-base-letter-DNA)]\n  ]\n  if initial-dna-string = \"no genes (short strand)\" [set original-dna-string \"ATTATATCGTAG\"]\n  if initial-dna-string = \"no genes (long strand)\"  [set original-dna-string \"GATATTTGGTAGCCCGAGAAGTGGTTTTTCAGATAACAGAGGTGGAGCAGCTTTTAG\"]\n  if initial-dna-string = \"1 short gene\"            [set original-dna-string \"ATTATGTGGTAG\"]\n  if initial-dna-string = \"1 long gene\"             [set original-dna-string \"GGGATGGACACCTTATCATTTGCTACTAGCGACCAGTTTGAGTAGCTTCGTCGGTGA\"]\n  if initial-dna-string = \"2 sequential genes\"      [set original-dna-string \"AGTATGAAAACCCACGAGTGGTAGCCCGAGATTGAGATGTGGTTTTTCAGATAACAG\"]\n  if initial-dna-string = \"2 nested genes\"          [set original-dna-string \"GTTATGAGGGGGACCCGAGATGTGGTTTTTGAAATAGACAAGTAGACCCTAATAGAC\"]\n  if initial-dna-string = \"3 sequential genes\"      [set original-dna-string \"GATATGTGGTAGCCCGAGATGTGGTTTTTCAGATAACAGATGTGGAGCAGCTTTTAG\"]\nend\n\n\nto place-dna [strand-type]\n  let dna (turtle-set genes nucleotides promoters terminators)\n  ask dna with [strand = strand-type][\n    if strand-type = \"original\"  [set ycor original-dna-ycor]\n    if strand-type = \"duplicate\" [set ycor duplicate-dna-ycor]\n  ]\nend\n\n\nto place-trnas [strand-type]\n  ask tRNAs with [strand = strand-type] [\n    if strand-type = \"original\"   [set ycor original-ribosome-ycor + 1]\n    if strand-type = \"duplicate\"  [set ycor duplicate-ribosome-ycor + 1]\n  ]\nend\n\n\nto make-a-nucleotide-chain-for-dna-string [strand-type dna-string]\n  let previous-nucleotide nobody\n  let place-counter 0\n  create-turtles 1 [\n    set heading 90\n    fd 1\n    repeat (length dna-string) [\n        hatch 1 [\n          set breed nucleotides\n          set strand strand-type\n          set value item place-counter dna-string\n          set shape (word \"nucleotide-\" value)\n          set heading 0\n          set place place-counter\n          attach-tag 5 0.5 value nucleo-tag-color\n          set place-counter place-counter + 1\n          ]\n       fd nucleotide-spacing\n       ]\n   die ;; remove the chromosome builder (a temporary construction turtle)\n  ]\nend\n\n\n\nto build-genes-from-dna [strand-type dna-string]\n  let remaining-dna dna-string\n  let this-item \"\"\n  let last-item \"\"\n  let last-last-item \"\"\n  let triplet \"\"\n  let item-position 0\n  let last-item-kept length dna-string\n  repeat (length dna-string) [\n    let first-item item 0 remaining-dna\n    set remaining-dna remove-item 0 remaining-dna\n    set last-last-item last-item\n    set last-item this-item\n    set this-item first-item\n    set triplet (word last-last-item last-item this-item)\n    if triplet = \"ATG\" [\n      create-genes 1 [\n        set hidden? true\n        set strand strand-type\n        if strand = \"original\"  [\n          set original-strand-gene-counter original-strand-gene-counter + 1\n          set gene-number original-strand-gene-counter\n        ]\n        if strand = \"duplicate\" [\n          set duplicate-strand-gene-counter duplicate-strand-gene-counter + 1\n          set gene-number duplicate-strand-gene-counter\n        ]\n        set start-position item-position\n        set end-position ((length original-dna-string))\n        set code (word triplet substring dna-string (item-position + 1) ((length dna-string) ) )\n        ]\n     ]\n     set item-position item-position + 1\n  ]\n  ask genes [\n    let end-of-gene? false\n    let triplet-counter 0\n    let new-code code\n    repeat floor (length code / 3)  [\n      let this-triplet (word  (item (0 + (triplet-counter * 3)) code)  (item (1 + (triplet-counter * 3)) code)  (item (2 + (triplet-counter * 3)) code) )\n      if (this-triplet =  \"TAG\" or this-triplet = \"TGA\"  or this-triplet = \"TAA\") and not end-of-gene? [\n        set end-position triplet-counter * 3\n        set new-code substring code 0 end-position\n        set end-of-gene? true\n      ]\n      set triplet-counter triplet-counter + 1\n    ]\n    set triplet-counter 0\n    set end-of-gene? false\n    set code new-code\n  ]\n\nend\n\n\nto build-mRNA-for-each-gene [strand-type]\n  ask genes with [strand = strand-type] [\n    let this-code code\n    let this-gene self\n\n    set heading 90\n    fd .1\n    repeat start-position [fd .45] ;; move over to correct nucleotide location on dna\n\n    let gene-color next-gene-color\n    let gene-color-with-transparency (sentence (extract-rgb gene-color) 110)\n    let gene-color-label (sentence (extract-rgb gene-color) 250)\n    ;; make promoter for start codon\n    hatch 1 [\n      set breed promoters\n      set color gene-color-with-transparency\n      set size 3\n      set hidden? false\n      attach-tag 142 1.7 (word \"start:\" gene-number) gene-color-label\n      create-backbone-from this-gene [set hidden? true set tie-mode \"fixed\" tie]\n      ;; make terminator for end codon\n      hatch 1 [\n        set breed terminators\n        fd ((length this-code) * 0.45)\n        attach-tag 142 1.7 (word \"end:\" gene-number) gene-color-label\n        create-backbone-from this-gene [set hidden? true set tie-mode \"fixed\" tie]\n      ]\n    ]\n     ;; make start cap for mRNA molecule\n    hatch 1 [\n      let this-mRNA self\n      set breed mRNAs\n      set traveling? false\n      set released? false\n      set code mrna-string-from-dna-string code\n      set cap-type \"start\"\n      set shape \"mrna-start\"\n      set hidden? false\n      ;; associate the mRNA molecule with the parent gene\n      create-backbone-from this-gene [set hidden? true set tie-mode \"fixed\" tie]\n      ;; build a stop cap for the mRNA molecule\n      hatch 1 [\n        set cap-type \"stop\"\n        set shape \"mrna-stop\"\n        let nucleotide-counter 0\n        ;; associate the mRNA stop cap with the start cap\n        create-backbone-from this-mRNA  [set hidden? true set tie-mode \"fixed\" tie]\n        ;; use the stop cap turtle to construct the mRNA nucleotides\n        let code-to-transcribe code\n        repeat length code [\n          hatch 1 [\n            set breed mRNA-nucleotides\n            set value first code-to-transcribe\n            set shape (word \"mrna-\" value)\n            set heading 180\n            attach-tag 175 0.9 value nucleo-tag-color\n            create-backbone-from this-mRNA  [set hidden? true set tie-mode \"fixed\" tie]\n          ]\n          set code-to-transcribe remove-item 0 code-to-transcribe\n          fd nucleotide-spacing\n        ]\n      ]\n    ]\n  ]\nend\n\n\nto build-protein-from-mrna [strand-type]\n  ask mRNAs with [cap-type = \"start\" and strand = strand-type] [\n    let number-of-triplets-in-list floor ((length code) / 3)\n    let this-triplet \"\"\n    let triplet-counter 0\n    repeat number-of-triplets-in-list   [\n      set this-triplet (word\n        complementary-mRNA-base  (item (0 + (triplet-counter * 3)) code)\n        complementary-mRNA-base  (item (1 + (triplet-counter * 3)) code)\n        complementary-mRNA-base  (item (2 + (triplet-counter * 3)) code)\n        )\n      build-tRNA-for-this-triplet  this-triplet triplet-counter\n      set triplet-counter triplet-counter + 1\n    ]\n  ]\nend\n\n\n\nto build-tRNA-for-this-triplet [this-triplet triplet-counter]\n  let this-tRNA nobody\n  hatch 1 [\n    set breed tRNAs\n    set this-tRNA self\n    set shape \"tRNA-core\"\n    set size 1.2\n    set heading 0\n    hatch 1 [\n      set breed amino-acids\n      set value  (which-protein-for-this-codon this-triplet)\n      set shape (word \"amino-\" value)\n      set heading 0\n      set size 2\n      fd 1\n      create-backbone-from this-tRNA  [set hidden? true set tie-mode \"free\" tie]\n      attach-tag 20 .8 value nucleo-tag-color\n    ]\n    hatch 1 [\n      set breed tRNA-nucleotides\n      set shape (word \"trna-\" (item 0 this-triplet))\n      set heading -155\n      fd 1.1\n      set heading 0\n      create-backbone-from this-tRNA  [set hidden? true set tie-mode \"fixed\" tie]\n      hatch 1 [\n        set breed tRNA-nucleotides\n        set shape (word \"trna-\" (item 1 this-triplet))\n        set heading 90\n        fd .45\n        set heading 0\n        create-backbone-from this-tRNA  [set hidden? true set tie-mode \"fixed\" tie]\n      ]\n      hatch 1 [\n        set breed tRNA-nucleotides\n        set shape (word \"trna-\" (item 2 this-triplet))\n        set heading 90\n        fd .90\n        set heading 0\n        create-backbone-from this-tRNA  [set hidden? true set tie-mode \"fixed\" tie]\n      ]\n    ]\n    fd 1\n    set heading 90\n    fd nucleotide-spacing + ( nucleotide-spacing * 3 * triplet-counter )\n    set heading 0\n  ]\nend\n\n\n;; fine tuned placement of the location of a label for a nucleoside or nucleotide\nto attach-tag [direction displacement label-value color-value]\n  hatch 1 [\n    set heading direction\n    fd displacement\n    set breed tags\n    set label label-value\n    set size 0.1\n    set label-color color-value\n    create-tagline-with myself [set tie-mode \"fixed\" set hidden? true tie]\n  ]\nend\n\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;; visibility procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto visualize-all-genes\n   ask (turtle-set promoters terminators)[ask tagline-neighbors [set hidden? not show-genes?] set hidden? not show-genes?]\nend\n\n\nto hide-genes  [strand-type]\n   ask (turtle-set promoters terminators)  with [strand = strand-type] [ask tagline-neighbors [set hidden? true] set hidden? true]\nend\n\n\nto hide-mrna  [strand-type]\n   ask (turtle-set mRNAs mrna-nucleotides) with [strand = strand-type] [ask tagline-neighbors [set hidden? true] set hidden? true]\nend\n\n\nto hide-trna  [strand-type]\n   ask (turtle-set tRNAs trna-nucleotides amino-acids) with [strand = strand-type] [ask tagline-neighbors [set hidden? true] set hidden? true]\nend\n\n\nto show-next-mrna  [strand-type]\n  let these-genes genes with [strand = strand-type]\n  if count these-genes = 0 [display-user-message-no-genes]\n  if strand-type = \"original\" [\n    set original-display-mrna-counter original-display-mrna-counter + 1\n    if (original-display-mrna-counter > count these-genes) [set original-display-mrna-counter 1]\n    ask mRNAs with [strand = strand-type and cap-type = \"start\"] [\n      ifelse gene-number != original-display-mrna-counter\n        [ask out-backbone-neighbors [set hidden? true ask tagline-neighbors [set hidden? true] ] set hidden? true]\n        [ask out-backbone-neighbors [set hidden? false ask tagline-neighbors [set hidden? false] ] set hidden? false]\n      set traveling? false set released? false set ycor original-dna-ycor\n    ]\n  ]\n  if strand-type = \"duplicate\" [\n    set duplicate-display-mrna-counter duplicate-display-mrna-counter + 1\n    if (duplicate-display-mrna-counter > count these-genes) [set duplicate-display-mrna-counter 1]\n    ask mRNAs with [strand = strand-type and cap-type = \"start\"] [\n      ifelse gene-number != duplicate-display-mrna-counter\n        [ask out-backbone-neighbors [set hidden? true ask tagline-neighbors [set hidden? true] ] set hidden? true]\n        [ask out-backbone-neighbors [set hidden? false ask tagline-neighbors [set hidden? false]] set hidden? false]\n      set traveling? false set released? false set ycor duplicate-dna-ycor\n    ]\n  ]\nend\n\n\nto show-next-trna  [strand-type]\n  let this-gene-number gene-number-for-this-strand strand-type\n  ask mRNAs with [strand = strand-type and cap-type = \"start\" and released? and gene-number = this-gene-number ] [\n    ask tRNAs with [strand = strand-type] [\n      ifelse gene-number = this-gene-number\n        [ask out-backbone-neighbors [set hidden? false ask tagline-neighbors [set hidden? false] ] set hidden? false]\n        [ask out-backbone-neighbors [set hidden? true ask tagline-neighbors [set hidden? true] ] set hidden? true]\n      ]\n  ]\nend\n\n\nto display-user-message-no-genes\n  user-message \"There are no genes in this strand of DNA. A specific sequence of 3 nucleotides is required for a gene\"\nend\n\n\nto release-next-protein  [strand-type]\n  let make-protein? false\n  let this-gene-number gene-number-for-this-strand strand-type\n  ask mRNAs with [strand = strand-type and cap-type = \"start\" and released?  and gene-number = this-gene-number ] [\n\n    ask tRNAs with [strand = strand-type] [\n      ifelse gene-number = this-gene-number\n        [ask out-backbone-neighbors [\n         set make-protein? true\n         set hidden? true\n           ifelse breed = amino-acids\n             [set hidden? false ask tagline-neighbors [set hidden? false] ]\n             [set hidden? true ask tagline-neighbors [set hidden? true] ]\n           ]\n         ]\n         [ask out-backbone-neighbors [set hidden? true ask tagline-neighbors [set hidden? true] ] set hidden? true]\n         set hidden? true\n    ]\n    if make-protein? [make-protein strand-type ]\n  ]\nend\n\n\nto make-protein [strand-type]\n  let this-gene-number gene-number-for-this-strand strand-type\n  let this-protein-value \"\"\n  let these-amino-acids amino-acids with [breed = amino-acids and strand-type = strand and gene-number = this-gene-number]\n  let ordered-amino-acids sort-on [who] these-amino-acids\n  foreach ordered-amino-acids [ the-amino-acid ->\n    set this-protein-value (word   this-protein-value \"-\" ([value] of the-amino-acid))\n  ]\n  if not any? proteins with [strand = strand-type and value = this-protein-value] [\n      hatch 1 [set breed proteins set value this-protein-value set hidden? true setxy 0 0]\n  ]\nend\n\n\nto release-next-mRNA-from-nucleus [strand-type]\n  ask mRNAs with [strand = strand-type][set traveling? true set released? false]\nend\n\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; runtime procedures ;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto go\n  visualize-all-genes\n  ;; these boolean variables keep track of button press events being cued by the user\n  if event-1-triggered? [\n    show-next-mrna \"original\"\n    set event-1-triggered? false\n    set event-1-completed? true\n    set event-2-completed? false\n    set event-3-completed? false\n    set event-4-completed? false\n  ]\n  if event-2-triggered? and event-1-completed? [\n    release-next-mRNA-from-nucleus \"original\"\n    set event-2-triggered? false\n    set event-3-completed? false\n    set event-4-completed? false\n  ]\n  if event-3-triggered? and event-2-completed? [\n    show-next-trna \"original\"\n    set event-3-triggered? false\n    set event-3-completed? true\n    set event-4-completed? false\n  ]\n  if event-4-triggered? and event-3-completed? [\n    release-next-protein \"original\"\n    set event-4-triggered? false\n    set event-4-completed? true\n  ]\n  if event-6-triggered? [\n    show-next-mrna \"duplicate\"\n    set event-6-triggered? false\n    set event-6-completed? true\n    set event-7-completed? false\n    set event-8-completed? false\n    set event-9-completed? false\n  ]\n  if event-7-triggered? and event-6-completed? [\n    release-next-mRNA-from-nucleus \"duplicate\"\n    set event-7-triggered? false\n    set event-8-completed? false\n    set event-9-completed? false\n  ]\n  if event-8-triggered? and event-7-completed? [\n    show-next-trna \"duplicate\"\n    set event-8-triggered? false\n    set event-8-completed? true\n    set event-9-completed? false\n  ]\n  if event-9-triggered? and event-8-completed? [\n    release-next-protein \"duplicate\"\n    set event-9-triggered? false\n    set event-9-completed? true\n  ]\n  move-mRNA-molecules-out-of-nucleus\n  tick\nend\n\n\nto move-mRNA-molecules-out-of-nucleus\n  ask mRNAs with [traveling? and cap-type = \"start\"] [\n    if strand = \"original\" [\n      if ycor < original-ribosome-ycor [ set ycor ycor + .1 ]\n      if ycor >= original-ribosome-ycor [ set traveling? false set released? true set event-2-completed? true]\n    ]\n    if strand = \"duplicate\" [\n      if ycor > duplicate-ribosome-ycor [ set ycor ycor - .1]\n      if ycor <= duplicate-ribosome-ycor [ set traveling? false set released? true set event-7-completed? true]\n    ]\n  ]\nend\n\n\nto show-protein-production\n  clear-output\n  let original-proteins proteins with [strand = \"original\"]\n  output-print \"Proteins Produced\"\n  output-print (word \"from original DNA  = \" count original-proteins)\n  output-print \"::::::::::::::::::\"\n  ask original-proteins [\n    output-print (word \"Orig.Gene #\" gene-number \" > Protein:\")\n    output-print value\n    output-print \"\"\n  ]\n  output-print \"==================\"\n  let duplicate-proteins  proteins with [strand = \"duplicate\"]\n  output-print \"Proteins Produced\"\n  output-print (word \"from copy of DNA = \" count duplicate-proteins)\n  output-print \"::::::::::::::::::\"\n  ask duplicate-proteins [\n    output-print (word \"Copy.Gene #\" gene-number \" > Protein:\")\n    output-print value\n    output-print \"\"\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;; make duplicate dna procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto make-duplicate-dna-string\n  let position-counter 0\n  set duplicate-strand-gene-counter 0\n  let clean-duplicate-dna-string original-dna-string\n  let mutating-copy-of-dna-string original-dna-string\n\n    let target-loci random ((length mutating-copy-of-dna-string) - #-nucleotides-affected)\n    let dna-at-target item target-loci mutating-copy-of-dna-string\n    let dna-before-target substring mutating-copy-of-dna-string 0 target-loci\n    let loci-counter 0\n    let dna-at-and-after-target substring mutating-copy-of-dna-string target-loci length mutating-copy-of-dna-string\n\n    if mutation-type = \"deletion\" [\n      repeat #-nucleotides-affected [\n        set  mutating-copy-of-dna-string remove-item target-loci mutating-copy-of-dna-string\n      ]\n    ]\n    if mutation-type  = \"substitution\" [\n      repeat #-nucleotides-affected [\n        set mutating-copy-of-dna-string (replace-item (target-loci + loci-counter) mutating-copy-of-dna-string random-base-letter-DNA)\n        set loci-counter loci-counter + 1\n      ]\n    ]\n    if mutation-type  = \"insertion\" [\n      repeat #-nucleotides-affected [\n        set  dna-at-and-after-target (word random-base-letter-DNA  dna-at-and-after-target)\n      ]\n      set mutating-copy-of-dna-string (word dna-before-target dna-at-and-after-target)\n    ]\n\n set duplicate-dna-string mutating-copy-of-dna-string\nend\n\n\nto replicate-dna\n  let turtles-to-remove (turtle-set nucleotides mRNAs tRNAs genes promoters terminators amino-acids mrna-nucleotides)\n  ;; (re)build the everything for the duplicate dna\n  ask turtles-to-remove with [strand = \"duplicate\" ][ask tagline-neighbors [die] die]            ;; wipe out old nucleotides\n  make-duplicate-dna-string\n  build-genes-from-dna \"duplicate\" duplicate-dna-string\n  make-a-nucleotide-chain-for-dna-string \"duplicate\" duplicate-dna-string\n  place-dna \"duplicate\"\n  build-mrna-for-each-gene \"duplicate\"\n  build-protein-from-mrna \"duplicate\"\n  place-trnas \"duplicate\"\n  hide-mrna   \"duplicate\"\n  hide-trna   \"duplicate\"\n  hide-genes  \"duplicate\"\nend\n\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;; initializing lists and strings ;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto initialize-codon-to-amino-acid-key\n   set codon-to-amino-acid-key [\n     ;;all triplets where the 2nd base is U\n     [\"UUU\" \"Phe\"] [\"UUC\" \"Phe\"] [\"UUA\" \"Leu\"] [\"UUG\" \"Leu\"]\n     [\"CUU\" \"Leu\"] [\"CUC\" \"Leu\"] [\"CUA\" \"Leu\"] [\"CUG\" \"Leu\"]\n     [\"AUU\" \"Ile\"] [\"AUC\" \"Ile\"] [\"AUA\" \"Ile\"] [\"AUG\" \"Met\"]\n     [\"GUU\" \"Val\"] [\"GUC\" \"Val\"] [\"GUA\" \"Val\"] [\"GUG\" \"Val\"]\n     ;;all triplets where the 2nd base is C\n     [\"UCU\" \"Ser\"] [\"UCC\" \"Ser\"] [\"UCA\" \"Ser\"] [\"UCG\" \"Ser\"]\n     [\"CCU\" \"Pro\"] [\"CCC\" \"Pro\"] [\"CCA\" \"Pro\"] [\"CCG\" \"Pro\"]\n     [\"ACU\" \"Thr\"] [\"ACC\" \"Thr\"] [\"ACA\" \"Thr\"] [\"ACG\" \"Thr\"]\n     [\"GCU\" \"Ala\"] [\"GCC\" \"Ala\"] [\"GCA\" \"Ala\"] [\"GCG\" \"Ala\"]\n     ;;all triplets where the 3rd base is A\n     [\"UAU\" \"Tyr\"] [\"UAC\" \"Tyr\"] [\"UAA\" \"Stop\"] [\"UAG\" \"Stop\"]\n     [\"CAU\" \"His\"] [\"CAC\" \"His\"] [\"CAA\" \"Gln\"] [\"CAG\" \"Gln\"]\n     [\"AAU\" \"Asn\"] [\"AAC\" \"Asn\"] [\"AAA\" \"Lys\"] [\"AAG\" \"Lys\"]\n     [\"GAU\" \"Asp\"] [\"GAC\" \"Asp\"] [\"GAA\" \"Glu\"] [\"GAG\" \"Glu\"]\n     ;;all triplets where the 4th base is G\n     [\"UGU\" \"Cys\"] [\"UGC\" \"Cys\"] [\"UGA\" \"Stop\"] [\"UGG\" \"Trp\"]\n     [\"CGU\" \"Arg\"] [\"CGC\" \"Arg\"] [\"CGA\" \"Arg\"] [\"CGG\" \"Arg\"]\n     [\"AGU\" \"Ser\"] [\"AGC\" \"Ser\"] [\"AGA\" \"Arg\"] [\"AGG\" \"Arg\"]\n     [\"GGU\" \"Gly\"] [\"GGC\" \"Gly\"] [\"GGA\" \"Gly\"] [\"GGG\" \"Gly\"]\n     ]\nend\n\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;; reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n;;;;;; returns values such as \"Gly\" for \"GGA\" or \"Tyr\" for \"UAC\" using the codon-to-amino-acid-key\nto-report which-protein-for-this-codon [this-codon]\n report item 1 (item 0 filter [ pair -> first pair = this-codon] codon-to-amino-acid-key )\nend\n\n;;; reports a random base for a nucleotide in DNA\nto-report random-base-letter-DNA\n  let r random 4\n  let letter-to-report \"\"\n  if r = 0 [set letter-to-report \"A\"]\n  if r = 1 [set letter-to-report \"G\"]\n  if r = 2 [set letter-to-report \"T\"]\n  if r = 3 [set letter-to-report \"C\"]\n  report letter-to-report\nend\n\n;;; reports a complementary base for a base pairing given the nucleotide from DNA or mRNA\nto-report complementary-mRNA-base [base]\n  let base-to-report \"\"\n  if base = \"A\" [set base-to-report \"U\"]\n  if base = \"T\" [set base-to-report \"A\"]\n  if base = \"U\" [set base-to-report \"A\"]\n  if base = \"G\" [set base-to-report \"C\"]\n  if base = \"C\" [set base-to-report \"G\"]\n  report base-to-report\nend\n\n\n;; cycles through next color in base-color list to assign to the next gene\nto-report next-gene-color\n  ifelse gene-color-counter >= (length base-colors) - 1\n   [set gene-color-counter 0]\n   [set gene-color-counter gene-color-counter + 1 ]\n  report (item gene-color-counter base-colors)\nend\n\n\nto-report gene-number-for-this-strand [strand-type]\n  let this-gene-number 0\n  if strand-type = \"original\"  [set this-gene-number original-display-mrna-counter]\n  if strand-type = \"duplicate\" [set this-gene-number duplicate-display-mrna-counter]\n  report this-gene-number\nend\n\n\n;; reports the mrna code that gets transcribed from the dna\nto-report mrna-string-from-dna-string [dna-string]\n  let new-string dna-string\n  let next-item 0\n  repeat length dna-string [\n    set new-string (replace-item next-item new-string (complementary-mRNA-base (item next-item new-string))  )\n    set next-item next-item + 1\n  ]\n  report new-string\nend\n\n;; reports a string of dna where any A, G, C, T letter is replaced with a random one of these, and any length beyond\n;; characters is deprecated\nto-report dna-string-with-non-nucleotide-characters-replaced [dna-string]\n  let new-string dna-string\n  let next-item 0\n  repeat length dna-string [\n    set new-string (replace-item next-item new-string (replace-non-nucleotide-character (item next-item new-string))  )\n    set next-item next-item + 1\n  ]\n  if length dna-string > 64 [set new-string substring new-string 0 64]\n  report new-string\nend\n\n;; replaces any A, G, C, T letter is replaced with a random one of these\nto-report replace-non-nucleotide-character [nucleotide-character]\n   let character-to-return nucleotide-character\n   if nucleotide-character != \"A\" and nucleotide-character != \"T\" and nucleotide-character != \"C\" and nucleotide-character != \"G\"\n     [set character-to-return random-base-letter-DNA]\n   report character-to-return\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;; instructions for players ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\nto-report current-instruction-label\n  report ifelse-value (current-instruction = 0)\n    [ \"press setup\" ]\n    [ (word current-instruction \" of \" length instructions) ]\nend\n\n\nto next-instruction\n  show-instruction current-instruction + 1\nend\n\n\nto previous-instruction\n  show-instruction current-instruction - 1\nend\n\n\nto show-instruction [ i ]\n  if i >= 1 and i <= length instructions [\n    set current-instruction i\n    clear-output\n    foreach item (current-instruction - 1) instructions output-print\n  ]\nend\n\n\nto-report instructions\n  report [\n    [\n     \"You will be simulating the process\"\n     \"of protein synthesis from DNA that\"\n     \"occurs in every cell.  And you will\"\n     \"explore the effects of mutations\"\n     \"on the proteins that are produced.\"\n    ]\n    [\n     \"When you press SETUP, a single\"\n     \"strand of an unwound DNA molecule\"\n     \"appears. This represents the state\"\n      \"of DNA in the cell nucleus during\"\n     \"transcription.\"\n    ]\n    [\n     \"To produce proteins, each gene in\"\n     \"the original DNA strand must be\"\n     \"transcribed  into an mRNA molecule.\"\n     \"Do this by pressing GO/STOP and\"\n     \"then the 1-TRANSCRIBE button.\"\n    ]\n    [\n     \"For each mRNA molecule that was\"\n     \"transcribed, press the 2-RELEASE\"\n     \"button.  This releases the mRNA\"\n     \"from the nucleus  into the ribosome\"\n     \"of the cell.\"\n    ]\n    [\n     \"For each mRNA molecule in the\"\n     \"ribosome, press the 3-TRANSLATE\"\n     \"button.  This pairs up molecules\"\n     \"of tRNA with each set of three\"\n     \"nucleotides in the mRNA molecule.\"\n    ]\n    [\n      \"For each tRNA chain built, press\"\n      \"the 4-RELEASE button.  This\"\n      \"releases the amino acid chain\"\n      \"from the rest of the tRNA chain,\"\n      \"leaving behind the protein\"\n      \"molecule that is produced.\"\n    ]\n    [\n      \"Each time the 1-TRANSCRIBE\"\n      \"button is pressed, the next gene\"\n      \"in the original strand of DNA \"\n      \"will be transcribed.  Press the 1-,\"\n      \"2-, 3-, 4- buttons and repeat to\"\n      \"translate each subsequent gene.\"\n    ]\n    [\n      \"When you press the 5-REPLICATE\"\n      \"THE ORIGINAL DNA button a copy\"\n      \"of the original DNA will be \"\n      \"generated for a new cell\"\n      \"(as in mitosis or meiosis) and\"\n      \"it will appear in the green.\"\n    ]\n    [\n      \"The replicated DNA will have a\"\n      \"# of random mutations, set by\"\n      \"#-NUCLEOTIDES-AFFECTED, each\"\n      \"mutation of the type set by\"\n      \"MUTATION-TYPE. Press button 5)\"\n      \"again to explore possible outcomes.\"\n    ]\n    [\n      \"Now repeat the same transcription,\"\n      \"release, translation, and release\"\n      \"process for the DNA in this new\"\n      \"cell by pressing 6-, 7-, 8-, 9-.\"\n      \"Repeat that sequence again to\"\n      \"cycle through to the next gene.\"\n    ]\n    [\n      \"If you want to test the outcomes\"\n      \"for your own DNA code, type any\"\n      \"sequence of A, G, T, C in the\"\n      \"USER-CREATED-CODE box and set\"\n      \"the INITIAL-DNA-STRING to\"\n      \"“from-user-code”.  Then press\"\n      \"SETUP and start over again.\"\n    ]\n  ]\nend\n\n\n\nto reset-completed-events\n\n  if event-1-triggered? or  event-2-triggered? or event-3-triggered? or event-4-triggered? [\n    set event-4-completed? false\n    if event-1-triggered? or  event-2-triggered? or event-3-triggered? [\n      set event-3-completed? false\n      if event-1-triggered? or  event-2-triggered?  [\n        set event-2-completed? false\n        if event-1-triggered?  [ set event-1-completed? false ]\n      ]\n    ]\n  ]\n  if event-6-triggered? or event-7-triggered? or event-8-triggered? or event-9-triggered? [\n    set event-9-completed? false\n    if event-6-triggered? or  event-7-triggered? or event-8-triggered? [\n      set event-8-completed? false\n      if event-6-triggered? or  event-7-triggered?  [\n        set event-7-completed? false\n        if event-6-triggered?  [ set event-6-completed? false ]\n      ]\n    ]\n\n  ]\n\n\nend\n\n\n; Copyright 2012 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":465,"top":10,"right":1217,"bottom":403,"dimensions":{"minPxcor":0,"maxPxcor":30,"minPycor":-8,"maxPycor":7,"patchSize":24,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":9,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":5,"top":10,"right":75,"bottom":50,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":75,"top":10,"right":165,"bottom":50,"display":"go / stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"initial-dna-string","left":5,"top":285,"right":255,"bottom":330,"display":"initial-dna-string","choices":["from user-created-code","no genes (short strand)","no genes (long strand)","1 short gene","1 long gene","2 sequential genes","2 nested genes","3 sequential genes","random (short strand)","random (long strand)"],"currentChoice":4,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"user-created-code","left":5,"top":330,"right":255,"bottom":390,"boxedValue":{"value":"AAAAA","type":"String","multiline":false},"type":"inputBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_46 = procedures[\"REPLICATE-DNA\"]();\n  if (_maybestop_33_46 instanceof Exception.StopInterrupt) { return _maybestop_33_46; }\n  let _maybestop_47_66 = procedures[\"VISUALIZE-ALL-GENES\"]();\n  if (_maybestop_47_66 instanceof Exception.StopInterrupt) { return _maybestop_47_66; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"replicate-dna\nvisualize-all-genes","left":265,"top":210,"right":455,"bottom":246,"display":"5. replicate the original DNA","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"6","compiledStep":"1","variable":"#-nucleotides-affected","left":5,"top":205,"right":255,"bottom":238,"display":"#-nucleotides-affected","min":"1","max":"6","default":1,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"mutation-type","left":5,"top":240,"right":125,"bottom":285,"display":"mutation-type","choices":["deletion","insertion","substitution"],"currentChoice":2,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  if (world.observer.getGlobal(\"event-2-completed?\")) {\n    world.observer.setGlobal(\"event-3-triggered?\", true);\n    procedures[\"RESET-COMPLETED-EVENTS\"]();\n  }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"if event-2-completed? [\n  set event-3-triggered? true\n  reset-completed-events\n]","left":280,"top":145,"right":370,"bottom":179,"display":"3. translate","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  world.observer.setGlobal(\"event-1-triggered?\", true);\n  let _maybestop_61_83 = procedures[\"RESET-COMPLETED-EVENTS\"]();\n  if (_maybestop_61_83 instanceof Exception.StopInterrupt) { return _maybestop_61_83; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"set event-1-triggered? true\nreset-completed-events","left":280,"top":92,"right":370,"bottom":127,"display":"1. transcribe","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  if (world.observer.getGlobal(\"event-3-completed?\")) {\n    world.observer.setGlobal(\"event-4-triggered?\", true);\n    procedures[\"RESET-COMPLETED-EVENTS\"]();\n  }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"if event-3-completed? [\n  set event-4-triggered? true\n  reset-completed-events\n]","left":370,"top":145,"right":446,"bottom":179,"display":"4. release","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"original-strand-gene-counter\")","source":"original-strand-gene-counter","left":295,"top":30,"right":352,"bottom":71,"display":"genes","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"PROTEINS\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"strand\"), \"duplicate\"); }).size()","source":"count proteins with [strand = \"duplicate\"]","left":340,"top":280,"right":440,"bottom":321,"display":"proteins made","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Replicated DNA in new cell","left":306,"top":263,"right":461,"bottom":281,"fontSize":11,"color":54,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  if (world.observer.getGlobal(\"event-1-completed?\")) {\n    world.observer.setGlobal(\"event-2-triggered?\", true);\n    procedures[\"RESET-COMPLETED-EVENTS\"]();\n  }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"if event-1-completed? [\n  set event-2-triggered? true\n  reset-completed-events\n]","left":370,"top":92,"right":445,"bottom":127,"display":"2. release","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"left":5,"top":85,"right":255,"bottom":205,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"duplicate-strand-gene-counter\")","source":"duplicate-strand-gene-counter","left":291,"top":280,"right":341,"bottom":321,"display":"genes","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  world.observer.setGlobal(\"event-6-triggered?\", true);\n  let _maybestop_61_83 = procedures[\"RESET-COMPLETED-EVENTS\"]();\n  if (_maybestop_61_83 instanceof Exception.StopInterrupt) { return _maybestop_61_83; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"set event-6-triggered? true\nreset-completed-events","left":280,"top":340,"right":370,"bottom":373,"display":"6. transcribe","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  if (world.observer.getGlobal(\"event-6-completed?\")) {\n    world.observer.setGlobal(\"event-7-triggered?\", true);\n    procedures[\"RESET-COMPLETED-EVENTS\"]();\n  }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"if event-6-completed? [\n  set event-7-triggered? true\n  reset-completed-events\n]","left":370,"top":340,"right":445,"bottom":373,"display":"7. release","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  if (world.observer.getGlobal(\"event-7-completed?\")) {\n    world.observer.setGlobal(\"event-8-triggered?\", true);\n    procedures[\"RESET-COMPLETED-EVENTS\"]();\n  }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"if event-7-completed? [\n  set event-8-triggered? true\n  reset-completed-events\n]","left":280,"top":395,"right":365,"bottom":428,"display":"8. translate","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  if (world.observer.getGlobal(\"event-8-completed?\")) {\n    world.observer.setGlobal(\"event-9-triggered?\", true);\n    procedures[\"RESET-COMPLETED-EVENTS\"]();\n  }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"if event-8-completed? [\n  set event-9-triggered? true\n  reset-completed-events\n]","left":365,"top":395,"right":445,"bottom":428,"display":"9. release","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"display":"DNA-->mRNA","left":336,"top":79,"right":426,"bottom":97,"fontSize":9,"color":103,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"mRNA-->protein","left":329,"top":382,"right":419,"bottom":400,"fontSize":9,"color":54,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"mRNA-->protein","left":331,"top":131,"right":424,"bottom":149,"fontSize":9,"color":103,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"PROTEINS\").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable(\"strand\"), \"original\"); }).size()","source":"count proteins with [strand = \"original\"]","left":346,"top":30,"right":441,"bottom":71,"display":"proteins made","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"DNA-->mRNA","left":334,"top":325,"right":421,"bottom":343,"fontSize":9,"color":54,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Original DNA in old cell","left":312,"top":12,"right":446,"bottom":40,"fontSize":11,"color":103,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"<--","left":272,"top":8,"right":322,"bottom":42,"fontSize":16,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"variable":"show-genes?","left":130,"top":245,"right":260,"bottom":278,"display":"show-genes?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_56 = procedures[\"SHOW-PROTEIN-PRODUCTION\"]();\n  if (_maybestop_33_56 instanceof Exception.StopInterrupt) { return _maybestop_33_56; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"show-protein-production","left":5,"top":395,"right":255,"bottom":428,"display":"10.  show protein production summary","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"display":" V","left":262,"top":195,"right":282,"bottom":216,"fontSize":16,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|","left":270,"top":18,"right":285,"bottom":204,"fontSize":14,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"-->","left":274,"top":261,"right":317,"bottom":281,"fontSize":16,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"|\n","left":270,"top":243,"right":285,"bottom":274,"fontSize":14,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"V","left":267,"top":256,"right":282,"bottom":276,"fontSize":16,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_49 = procedures[\"NEXT-INSTRUCTION\"]();\n  if (_maybestop_33_49 instanceof Exception.StopInterrupt) { return _maybestop_33_49; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"next-instruction","left":145,"top":50,"right":255,"bottom":83,"display":"next instruction","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_53 = procedures[\"PREVIOUS-INSTRUCTION\"]();\n  if (_maybestop_33_53 instanceof Exception.StopInterrupt) { return _maybestop_33_53; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"previous-instruction","left":5,"top":50,"right":145,"bottom":83,"display":"previous instruction","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"CURRENT-INSTRUCTION-LABEL\"]()","source":"current-instruction-label","left":165,"top":10,"right":255,"bottom":51,"display":"instruction #","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["initial-dna-string", "user-created-code", "#-nucleotides-affected", "mutation-type", "show-genes?", "current-instruction", "codon-to-amino-acid-key", "original-dna-string", "duplicate-dna-string", "duplicate-ribosome-ycor", "original-ribosome-ycor", "duplicate-dna-ycor", "original-dna-ycor", "nucleotide-spacing", "nucleo-tag-color", "terminator-color", "gene-color-counter", "original-strand-gene-counter", "duplicate-strand-gene-counter", "original-display-mrna-counter", "duplicate-display-mrna-counter", "mrnas-traveling", "mrnas-released", "replicate-dna-event?", "show-genes-event?", "event-1-triggered?", "event-2-triggered?", "event-3-triggered?", "event-4-triggered?", "event-6-triggered?", "event-7-triggered?", "event-8-triggered?", "event-9-triggered?", "event-1-completed?", "event-2-completed?", "event-3-completed?", "event-4-completed?", "event-6-completed?", "event-7-completed?", "event-8-completed?", "event-9-completed?"], ["initial-dna-string", "user-created-code", "#-nucleotides-affected", "mutation-type", "show-genes?"], [], 0, 30, -8, 7, 24.0, true, true, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var AudioPrims = workspace.audioPrims;
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
      var reporterContext = false;
      var letVars = { };
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "from user-created-code")) {
        world.observer.setGlobal("original-dna-string", procedures["DNA-STRING-WITH-NON-NUCLEOTIDE-CHARACTERS-REPLACED"](world.observer.getGlobal("user-created-code")));
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "random (short strand)")) {
        let initialLengthDna = 12; letVars['initialLengthDna'] = initialLengthDna;
        for (let _index_6358_6364 = 0, _repeatcount_6358_6364 = StrictMath.floor(initialLengthDna); _index_6358_6364 < _repeatcount_6358_6364; _index_6358_6364++){
          world.observer.setGlobal("original-dna-string", (workspace.dump('') + workspace.dump(world.observer.getGlobal("original-dna-string")) + workspace.dump(procedures["RANDOM-BASE-LETTER-DNA"]())));
        }
      }
      if (Prims.equality(world.observer.getGlobal("initial-dna-string"), "random (long strand)")) {
        let initialLengthDna = 56; letVars['initialLengthDna'] = initialLengthDna;
        for (let _index_6550_6556 = 0, _repeatcount_6550_6556 = StrictMath.floor(initialLengthDna); _index_6550_6556 < _repeatcount_6550_6556; _index_6550_6556++){
          world.observer.setGlobal("original-dna-string", (workspace.dump('') + workspace.dump(world.observer.getGlobal("original-dna-string")) + workspace.dump(procedures["RANDOM-BASE-LETTER-DNA"]())));
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let dna = Prims.turtleSet(world.turtleManager.turtlesOfBreed("GENES"), world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS")); letVars['dna'] = dna;
      dna.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        if (Prims.equality(strandType, "original")) {
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("original-dna-ycor"));
        }
        if (Prims.equality(strandType, "duplicate")) {
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("duplicate-dna-ycor"));
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
  procs["placeDna"] = temp;
  procs["PLACE-DNA"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("TRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        if (Prims.equality(strandType, "original")) {
          SelfManager.self().setVariable("ycor", (world.observer.getGlobal("original-ribosome-ycor") + 1));
        }
        if (Prims.equality(strandType, "duplicate")) {
          SelfManager.self().setVariable("ycor", (world.observer.getGlobal("duplicate-ribosome-ycor") + 1));
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
  procs["placeTrnas"] = temp;
  procs["PLACE-TRNAS"] = temp;
  temp = (function(strandType, dnaString) {
    try {
      var reporterContext = false;
      var letVars = { };
      let previousNucleotide = Nobody; letVars['previousNucleotide'] = previousNucleotide;
      let placeCounter = 0; letVars['placeCounter'] = placeCounter;
      world.turtleManager.createTurtles(1, "").ask(function() {
        SelfManager.self().setVariable("heading", 90);
        SelfManager.self()._optimalFdOne();
        for (let _index_8203_8209 = 0, _repeatcount_8203_8209 = StrictMath.floor(ListPrims.length(dnaString)); _index_8203_8209 < _repeatcount_8203_8209; _index_8203_8209++){
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
            SelfManager.self().setVariable("strand", strandType);
            SelfManager.self().setVariable("value", ListPrims.item(placeCounter, dnaString));
            SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("nucleotide-") + workspace.dump(SelfManager.self().getVariable("value"))));
            SelfManager.self().setVariable("heading", 0);
            SelfManager.self().setVariable("place", placeCounter);
            procedures["ATTACH-TAG"](5,0.5,SelfManager.self().getVariable("value"),world.observer.getGlobal("nucleo-tag-color"));
            placeCounter = (placeCounter + 1); letVars['placeCounter'] = placeCounter;
          }, true);
          SelfManager.self().fd(world.observer.getGlobal("nucleotide-spacing"));
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
  procs["makeANucleotideChainForDnaString"] = temp;
  procs["MAKE-A-NUCLEOTIDE-CHAIN-FOR-DNA-STRING"] = temp;
  temp = (function(strandType, dnaString) {
    try {
      var reporterContext = false;
      var letVars = { };
      let remainingDna = dnaString; letVars['remainingDna'] = remainingDna;
      let thisItem = ""; letVars['thisItem'] = thisItem;
      let lastItem = ""; letVars['lastItem'] = lastItem;
      let lastLastItem = ""; letVars['lastLastItem'] = lastLastItem;
      let triplet = ""; letVars['triplet'] = triplet;
      let itemPosition = 0; letVars['itemPosition'] = itemPosition;
      let lastItemKept = ListPrims.length(dnaString); letVars['lastItemKept'] = lastItemKept;
      for (let _index_8923_8929 = 0, _repeatcount_8923_8929 = StrictMath.floor(ListPrims.length(dnaString)); _index_8923_8929 < _repeatcount_8923_8929; _index_8923_8929++){
        let firstItem = ListPrims.item(0, remainingDna); letVars['firstItem'] = firstItem;
        remainingDna = ListPrims.removeItem(0, remainingDna); letVars['remainingDna'] = remainingDna;
        lastLastItem = lastItem; letVars['lastLastItem'] = lastLastItem;
        lastItem = thisItem; letVars['lastItem'] = lastItem;
        thisItem = firstItem; letVars['thisItem'] = thisItem;
        triplet = (workspace.dump('') + workspace.dump(lastLastItem) + workspace.dump(lastItem) + workspace.dump(thisItem)); letVars['triplet'] = triplet;
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
            SelfManager.self().setVariable("code", (workspace.dump('') + workspace.dump(triplet) + workspace.dump(ListPrims.substring(dnaString, (itemPosition + 1), ListPrims.length(dnaString)))));
          }, true);
        }
        itemPosition = (itemPosition + 1); letVars['itemPosition'] = itemPosition;
      }
      world.turtleManager.turtlesOfBreed("GENES").ask(function() {
        let endOfGene_p = false; letVars['endOfGene_p'] = endOfGene_p;
        let tripletCounter = 0; letVars['tripletCounter'] = tripletCounter;
        let newCode = SelfManager.self().getVariable("code"); letVars['newCode'] = newCode;
        for (let _index_9996_10002 = 0, _repeatcount_9996_10002 = StrictMath.floor(NLMath.floor(Prims.div(ListPrims.length(SelfManager.self().getVariable("code")), 3))); _index_9996_10002 < _repeatcount_9996_10002; _index_9996_10002++){
          let thisTriplet = (workspace.dump('') + workspace.dump(ListPrims.item((0 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))) + workspace.dump(ListPrims.item((1 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))) + workspace.dump(ListPrims.item((2 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))); letVars['thisTriplet'] = thisTriplet;
          if ((((Prims.equality(thisTriplet, "TAG") || Prims.equality(thisTriplet, "TGA")) || Prims.equality(thisTriplet, "TAA")) && !endOfGene_p)) {
            SelfManager.self().setVariable("end-position", (tripletCounter * 3));
            newCode = ListPrims.substring(SelfManager.self().getVariable("code"), 0, SelfManager.self().getVariable("end-position")); letVars['newCode'] = newCode;
            endOfGene_p = true; letVars['endOfGene_p'] = endOfGene_p;
          }
          tripletCounter = (tripletCounter + 1); letVars['tripletCounter'] = tripletCounter;
        }
        tripletCounter = 0; letVars['tripletCounter'] = tripletCounter;
        endOfGene_p = false; letVars['endOfGene_p'] = endOfGene_p;
        SelfManager.self().setVariable("code", newCode);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("GENES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        let thisCode = SelfManager.self().getVariable("code"); letVars['thisCode'] = thisCode;
        let thisGene = SelfManager.self(); letVars['thisGene'] = thisGene;
        SelfManager.self().setVariable("heading", 90);
        SelfManager.self()._optimalFdLessThan1(0.1);
        for (let _index_10725_10731 = 0, _repeatcount_10725_10731 = StrictMath.floor(SelfManager.self().getVariable("start-position")); _index_10725_10731 < _repeatcount_10725_10731; _index_10725_10731++){
          SelfManager.self()._optimalFdLessThan1(0.45);
        }
        let geneColor = procedures["NEXT-GENE-COLOR"](); letVars['geneColor'] = geneColor;
        let geneColorWithTransparency = ListPrims.sentence(ColorModel.colorToRGB(geneColor), 110); letVars['geneColorWithTransparency'] = geneColorWithTransparency;
        let geneColorLabel = ListPrims.sentence(ColorModel.colorToRGB(geneColor), 250); letVars['geneColorLabel'] = geneColorLabel;
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PROMOTERS"));
          SelfManager.self().setVariable("color", geneColorWithTransparency);
          SelfManager.self().setVariable("size", 3);
          SelfManager.self().setVariable("hidden?", false);
          procedures["ATTACH-TAG"](142,1.7,(workspace.dump('') + workspace.dump("start:") + workspace.dump(SelfManager.self().getVariable("gene-number"))),geneColorLabel);
          LinkPrims.createLinkFrom(thisGene, "BACKBONES").ask(function() {
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().setVariable("tie-mode", "fixed");
            SelfManager.self().tie();
          }, true);
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TERMINATORS"));
            SelfManager.self().fd((ListPrims.length(thisCode) * 0.45));
            procedures["ATTACH-TAG"](142,1.7,(workspace.dump('') + workspace.dump("end:") + workspace.dump(SelfManager.self().getVariable("gene-number"))),geneColorLabel);
            LinkPrims.createLinkFrom(thisGene, "BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              SelfManager.self().setVariable("tie-mode", "fixed");
              SelfManager.self().tie();
            }, true);
          }, true);
        }, true);
        SelfManager.self().hatch(1, "").ask(function() {
          let thisMrna = SelfManager.self(); letVars['thisMrna'] = thisMrna;
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
            let nucleotideCounter = 0; letVars['nucleotideCounter'] = nucleotideCounter;
            LinkPrims.createLinkFrom(thisMrna, "BACKBONES").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              SelfManager.self().setVariable("tie-mode", "fixed");
              SelfManager.self().tie();
            }, true);
            let codeToTranscribe = SelfManager.self().getVariable("code"); letVars['codeToTranscribe'] = codeToTranscribe;
            for (let _index_12422_12428 = 0, _repeatcount_12422_12428 = StrictMath.floor(ListPrims.length(SelfManager.self().getVariable("code"))); _index_12422_12428 < _repeatcount_12422_12428; _index_12422_12428++){
              SelfManager.self().hatch(1, "").ask(function() {
                SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES"));
                SelfManager.self().setVariable("value", ListPrims.first(codeToTranscribe));
                SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("mrna-") + workspace.dump(SelfManager.self().getVariable("value"))));
                SelfManager.self().setVariable("heading", 180);
                procedures["ATTACH-TAG"](175,0.9,SelfManager.self().getVariable("value"),world.observer.getGlobal("nucleo-tag-color"));
                LinkPrims.createLinkFrom(thisMrna, "BACKBONES").ask(function() {
                  SelfManager.self().setVariable("hidden?", true);
                  SelfManager.self().setVariable("tie-mode", "fixed");
                  SelfManager.self().tie();
                }, true);
              }, true);
              codeToTranscribe = ListPrims.removeItem(0, codeToTranscribe); letVars['codeToTranscribe'] = codeToTranscribe;
              SelfManager.self().fd(world.observer.getGlobal("nucleotide-spacing"));
            }
          }, true);
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
  procs["buildMrnaForEachGene"] = temp;
  procs["BUILD-MRNA-FOR-EACH-GENE"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("cap-type"), "start") && Prims.equality(SelfManager.self().getVariable("strand"), strandType));
      }).ask(function() {
        let numberOfTripletsInList = NLMath.floor(Prims.div(ListPrims.length(SelfManager.self().getVariable("code")), 3)); letVars['numberOfTripletsInList'] = numberOfTripletsInList;
        let thisTriplet = ""; letVars['thisTriplet'] = thisTriplet;
        let tripletCounter = 0; letVars['tripletCounter'] = tripletCounter;
        for (let _index_13127_13133 = 0, _repeatcount_13127_13133 = StrictMath.floor(numberOfTripletsInList); _index_13127_13133 < _repeatcount_13127_13133; _index_13127_13133++){
          thisTriplet = (workspace.dump('') + workspace.dump(procedures["COMPLEMENTARY-MRNA-BASE"](ListPrims.item((0 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))) + workspace.dump(procedures["COMPLEMENTARY-MRNA-BASE"](ListPrims.item((1 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))) + workspace.dump(procedures["COMPLEMENTARY-MRNA-BASE"](ListPrims.item((2 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))))); letVars['thisTriplet'] = thisTriplet;
          procedures["BUILD-TRNA-FOR-THIS-TRIPLET"](thisTriplet,tripletCounter);
          tripletCounter = (tripletCounter + 1); letVars['tripletCounter'] = tripletCounter;
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
  procs["buildProteinFromMrna"] = temp;
  procs["BUILD-PROTEIN-FROM-MRNA"] = temp;
  temp = (function(thisTriplet, tripletCounter) {
    try {
      var reporterContext = false;
      var letVars = { };
      let thisTrna = Nobody; letVars['thisTrna'] = thisTrna;
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("TRNAS"));
        thisTrna = SelfManager.self(); letVars['thisTrna'] = thisTrna;
        SelfManager.self().setVariable("shape", "tRNA-core");
        SelfManager.self().setVariable("size", 1.2);
        SelfManager.self().setVariable("heading", 0);
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("AMINO-ACIDS"));
          SelfManager.self().setVariable("value", procedures["WHICH-PROTEIN-FOR-THIS-CODON"](thisTriplet));
          SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("amino-") + workspace.dump(SelfManager.self().getVariable("value"))));
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
          SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("trna-") + workspace.dump(ListPrims.item(0, thisTriplet))));
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
            SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("trna-") + workspace.dump(ListPrims.item(1, thisTriplet))));
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
            SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("trna-") + workspace.dump(ListPrims.item(2, thisTriplet))));
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      Prims.turtleSet(world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS")).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("show-genes?")); }, true);
        SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("show-genes?"));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      Prims.turtleSet(world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      Prims.turtleSet(world.turtleManager.turtlesOfBreed("MRNAS"), world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      Prims.turtleSet(world.turtleManager.turtlesOfBreed("TRNAS"), world.turtleManager.turtlesOfBreed("TRNA-NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        LinkPrims.linkNeighbors("TAGLINES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let theseGenes = world.turtleManager.turtlesOfBreed("GENES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }); letVars['theseGenes'] = theseGenes;
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let thisGeneNumber = procedures["GENE-NUMBER-FOR-THIS-STRAND"](strandType); letVars['thisGeneNumber'] = thisGeneNumber;
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      UserDialogPrims.confirm("There are no genes in this strand of DNA. A specific sequence of 3 nucleotides is required for a gene");
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let makeProtein_p = false; letVars['makeProtein_p'] = makeProtein_p;
      let thisGeneNumber = procedures["GENE-NUMBER-FOR-THIS-STRAND"](strandType); letVars['thisGeneNumber'] = thisGeneNumber;
      world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (((Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start")) && SelfManager.self().getVariable("released?")) && Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber));
      }).ask(function() {
        world.turtleManager.turtlesOfBreed("TRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
          if (Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber)) {
            LinkPrims.outLinkNeighbors("BACKBONES").ask(function() {
              makeProtein_p = true; letVars['makeProtein_p'] = makeProtein_p;
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let thisGeneNumber = procedures["GENE-NUMBER-FOR-THIS-STRAND"](strandType); letVars['thisGeneNumber'] = thisGeneNumber;
      let thisProteinValue = ""; letVars['thisProteinValue'] = thisProteinValue;
      let theseAminoAcids = world.turtleManager.turtlesOfBreed("AMINO-ACIDS").agentFilter(function() {
        return ((Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS")) && Prims.equality(strandType, SelfManager.self().getVariable("strand"))) && Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber));
      }); letVars['theseAminoAcids'] = theseAminoAcids;
      let orderedAminoAcids = theseAminoAcids.sortOn(function() { return SelfManager.self().getVariable("who"); }); letVars['orderedAminoAcids'] = orderedAminoAcids;
      var _foreach_19530_19537 = Tasks.forEach(Tasks.commandTask(function(theAminoAcid) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        thisProteinValue = (workspace.dump('') + workspace.dump(thisProteinValue) + workspace.dump("-") + workspace.dump(theAminoAcid.projectionBy(function() { return SelfManager.self().getVariable("value"); }))); letVars['thisProteinValue'] = thisProteinValue;
      }, "[ the-amino-acid -> set this-protein-value word this-protein-value \"-\" [ value ] of the-amino-acid ]"), orderedAminoAcids); if(reporterContext && _foreach_19530_19537 !== undefined) { return _foreach_19530_19537; }
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }).ask(function() {
        SelfManager.self().setVariable("traveling?", true);
        SelfManager.self().setVariable("released?", false);
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      OutputPrims.clear();
      let originalProteins = world.turtleManager.turtlesOfBreed("PROTEINS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), "original"); }); letVars['originalProteins'] = originalProteins;
      OutputPrims.print("Proteins Produced");
      OutputPrims.print((workspace.dump('') + workspace.dump("from original DNA  = ") + workspace.dump(originalProteins.size())));
      OutputPrims.print("::::::::::::::::::");
      originalProteins.ask(function() {
        OutputPrims.print((workspace.dump('') + workspace.dump("Orig.Gene #") + workspace.dump(SelfManager.self().getVariable("gene-number")) + workspace.dump(" > Protein:")));
        OutputPrims.print(SelfManager.self().getVariable("value"));
        OutputPrims.print("");
      }, true);
      OutputPrims.print("==================");
      let duplicateProteins = world.turtleManager.turtlesOfBreed("PROTEINS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), "duplicate"); }); letVars['duplicateProteins'] = duplicateProteins;
      OutputPrims.print("Proteins Produced");
      OutputPrims.print((workspace.dump('') + workspace.dump("from copy of DNA = ") + workspace.dump(duplicateProteins.size())));
      OutputPrims.print("::::::::::::::::::");
      duplicateProteins.ask(function() {
        OutputPrims.print((workspace.dump('') + workspace.dump("Copy.Gene #") + workspace.dump(SelfManager.self().getVariable("gene-number")) + workspace.dump(" > Protein:")));
        OutputPrims.print(SelfManager.self().getVariable("value"));
        OutputPrims.print("");
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let positionCounter = 0; letVars['positionCounter'] = positionCounter;
      world.observer.setGlobal("duplicate-strand-gene-counter", 0);
      let cleanDuplicateDnaString = world.observer.getGlobal("original-dna-string"); letVars['cleanDuplicateDnaString'] = cleanDuplicateDnaString;
      let mutatingCopyOfDnaString = world.observer.getGlobal("original-dna-string"); letVars['mutatingCopyOfDnaString'] = mutatingCopyOfDnaString;
      let targetLoci = Prims.random((ListPrims.length(mutatingCopyOfDnaString) - world.observer.getGlobal("#-nucleotides-affected"))); letVars['targetLoci'] = targetLoci;
      let dnaAtTarget = ListPrims.item(targetLoci, mutatingCopyOfDnaString); letVars['dnaAtTarget'] = dnaAtTarget;
      let dnaBeforeTarget = ListPrims.substring(mutatingCopyOfDnaString, 0, targetLoci); letVars['dnaBeforeTarget'] = dnaBeforeTarget;
      let lociCounter = 0; letVars['lociCounter'] = lociCounter;
      let dnaAtAndAfterTarget = ListPrims.substring(mutatingCopyOfDnaString, targetLoci, ListPrims.length(mutatingCopyOfDnaString)); letVars['dnaAtAndAfterTarget'] = dnaAtAndAfterTarget;
      if (Prims.equality(world.observer.getGlobal("mutation-type"), "deletion")) {
        for (let _index_24050_24056 = 0, _repeatcount_24050_24056 = StrictMath.floor(world.observer.getGlobal("#-nucleotides-affected")); _index_24050_24056 < _repeatcount_24050_24056; _index_24050_24056++){
          mutatingCopyOfDnaString = ListPrims.removeItem(targetLoci, mutatingCopyOfDnaString); letVars['mutatingCopyOfDnaString'] = mutatingCopyOfDnaString;
        }
      }
      if (Prims.equality(world.observer.getGlobal("mutation-type"), "substitution")) {
        for (let _index_24236_24242 = 0, _repeatcount_24236_24242 = StrictMath.floor(world.observer.getGlobal("#-nucleotides-affected")); _index_24236_24242 < _repeatcount_24236_24242; _index_24236_24242++){
          mutatingCopyOfDnaString = ListPrims.replaceItem((targetLoci + lociCounter), mutatingCopyOfDnaString, procedures["RANDOM-BASE-LETTER-DNA"]()); letVars['mutatingCopyOfDnaString'] = mutatingCopyOfDnaString;
          lociCounter = (lociCounter + 1); letVars['lociCounter'] = lociCounter;
        }
      }
      if (Prims.equality(world.observer.getGlobal("mutation-type"), "insertion")) {
        for (let _index_24503_24509 = 0, _repeatcount_24503_24509 = StrictMath.floor(world.observer.getGlobal("#-nucleotides-affected")); _index_24503_24509 < _repeatcount_24503_24509; _index_24503_24509++){
          dnaAtAndAfterTarget = (workspace.dump('') + workspace.dump(procedures["RANDOM-BASE-LETTER-DNA"]()) + workspace.dump(dnaAtAndAfterTarget)); letVars['dnaAtAndAfterTarget'] = dnaAtAndAfterTarget;
        }
        mutatingCopyOfDnaString = (workspace.dump('') + workspace.dump(dnaBeforeTarget) + workspace.dump(dnaAtAndAfterTarget)); letVars['mutatingCopyOfDnaString'] = mutatingCopyOfDnaString;
      }
      world.observer.setGlobal("duplicate-dna-string", mutatingCopyOfDnaString);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      let turtlesToRemove = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("MRNAS"), world.turtleManager.turtlesOfBreed("TRNAS"), world.turtleManager.turtlesOfBreed("GENES"), world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS"), world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES")); letVars['turtlesToRemove'] = turtlesToRemove;
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
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("codon-to-amino-acid-key", [["UUU", "Phe"], ["UUC", "Phe"], ["UUA", "Leu"], ["UUG", "Leu"], ["CUU", "Leu"], ["CUC", "Leu"], ["CUA", "Leu"], ["CUG", "Leu"], ["AUU", "Ile"], ["AUC", "Ile"], ["AUA", "Ile"], ["AUG", "Met"], ["GUU", "Val"], ["GUC", "Val"], ["GUA", "Val"], ["GUG", "Val"], ["UCU", "Ser"], ["UCC", "Ser"], ["UCA", "Ser"], ["UCG", "Ser"], ["CCU", "Pro"], ["CCC", "Pro"], ["CCA", "Pro"], ["CCG", "Pro"], ["ACU", "Thr"], ["ACC", "Thr"], ["ACA", "Thr"], ["ACG", "Thr"], ["GCU", "Ala"], ["GCC", "Ala"], ["GCA", "Ala"], ["GCG", "Ala"], ["UAU", "Tyr"], ["UAC", "Tyr"], ["UAA", "Stop"], ["UAG", "Stop"], ["CAU", "His"], ["CAC", "His"], ["CAA", "Gln"], ["CAG", "Gln"], ["AAU", "Asn"], ["AAC", "Asn"], ["AAA", "Lys"], ["AAG", "Lys"], ["GAU", "Asp"], ["GAC", "Asp"], ["GAA", "Glu"], ["GAG", "Glu"], ["UGU", "Cys"], ["UGC", "Cys"], ["UGA", "Stop"], ["UGG", "Trp"], ["CGU", "Arg"], ["CGC", "Arg"], ["CGA", "Arg"], ["CGG", "Arg"], ["AGU", "Ser"], ["AGC", "Ser"], ["AGA", "Arg"], ["AGG", "Arg"], ["GGU", "Gly"], ["GGC", "Gly"], ["GGA", "Gly"], ["GGG", "Gly"]]);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
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
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return ListPrims.item(1, ListPrims.item(0, world.observer.getGlobal("codon-to-amino-acid-key").filter(Tasks.reporterTask(function(pair) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        return Prims.equality(ListPrims.first(pair), thisCodon);
      }, "[ pair -> first pair = this-codon ]"))))
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
  procs["whichProteinForThisCodon"] = temp;
  procs["WHICH-PROTEIN-FOR-THIS-CODON"] = temp;
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
  procs["randomBaseLetterDna"] = temp;
  procs["RANDOM-BASE-LETTER-DNA"] = temp;
  temp = (function(base) {
    try {
      var reporterContext = true;
      var letVars = { };
      let baseToReport = ""; letVars['baseToReport'] = baseToReport;
      if (Prims.equality(base, "A")) {
        baseToReport = "U"; letVars['baseToReport'] = baseToReport;
      }
      if (Prims.equality(base, "T")) {
        baseToReport = "A"; letVars['baseToReport'] = baseToReport;
      }
      if (Prims.equality(base, "U")) {
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
  procs["complementaryMrnaBase"] = temp;
  procs["COMPLEMENTARY-MRNA-BASE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.gte(world.observer.getGlobal("gene-color-counter"), (ListPrims.length(ColorModel.BASE_COLORS) - 1))) {
        world.observer.setGlobal("gene-color-counter", 0);
      }
      else {
        world.observer.setGlobal("gene-color-counter", (world.observer.getGlobal("gene-color-counter") + 1));
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return ListPrims.item(world.observer.getGlobal("gene-color-counter"), ColorModel.BASE_COLORS)
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
  procs["nextGeneColor"] = temp;
  procs["NEXT-GENE-COLOR"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisGeneNumber = 0; letVars['thisGeneNumber'] = thisGeneNumber;
      if (Prims.equality(strandType, "original")) {
        thisGeneNumber = world.observer.getGlobal("original-display-mrna-counter"); letVars['thisGeneNumber'] = thisGeneNumber;
      }
      if (Prims.equality(strandType, "duplicate")) {
        thisGeneNumber = world.observer.getGlobal("duplicate-display-mrna-counter"); letVars['thisGeneNumber'] = thisGeneNumber;
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return thisGeneNumber
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
  procs["geneNumberForThisStrand"] = temp;
  procs["GENE-NUMBER-FOR-THIS-STRAND"] = temp;
  temp = (function(dnaString) {
    try {
      var reporterContext = true;
      var letVars = { };
      let newString = dnaString; letVars['newString'] = newString;
      let nextItem = 0; letVars['nextItem'] = nextItem;
      for (let _index_28754_28760 = 0, _repeatcount_28754_28760 = StrictMath.floor(ListPrims.length(dnaString)); _index_28754_28760 < _repeatcount_28754_28760; _index_28754_28760++){
        newString = ListPrims.replaceItem(nextItem, newString, procedures["COMPLEMENTARY-MRNA-BASE"](ListPrims.item(nextItem, newString))); letVars['newString'] = newString;
        nextItem = (nextItem + 1); letVars['nextItem'] = nextItem;
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return newString
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
  procs["mrnaStringFromDnaString"] = temp;
  procs["MRNA-STRING-FROM-DNA-STRING"] = temp;
  temp = (function(dnaString) {
    try {
      var reporterContext = true;
      var letVars = { };
      let newString = dnaString; letVars['newString'] = newString;
      let nextItem = 0; letVars['nextItem'] = nextItem;
      for (let _index_29220_29226 = 0, _repeatcount_29220_29226 = StrictMath.floor(ListPrims.length(dnaString)); _index_29220_29226 < _repeatcount_29220_29226; _index_29220_29226++){
        newString = ListPrims.replaceItem(nextItem, newString, procedures["REPLACE-NON-NUCLEOTIDE-CHARACTER"](ListPrims.item(nextItem, newString))); letVars['newString'] = newString;
        nextItem = (nextItem + 1); letVars['nextItem'] = nextItem;
      }
      if (Prims.gt(ListPrims.length(dnaString), 64)) {
        newString = ListPrims.substring(newString, 0, 64); letVars['newString'] = newString;
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return newString
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
  procs["dnaStringWithNonNucleotideCharactersReplaced"] = temp;
  procs["DNA-STRING-WITH-NON-NUCLEOTIDE-CHARACTERS-REPLACED"] = temp;
  temp = (function(nucleotideCharacter) {
    try {
      var reporterContext = true;
      var letVars = { };
      let characterToReturn = nucleotideCharacter; letVars['characterToReturn'] = characterToReturn;
      if ((((!Prims.equality(nucleotideCharacter, "A") && !Prims.equality(nucleotideCharacter, "T")) && !Prims.equality(nucleotideCharacter, "C")) && !Prims.equality(nucleotideCharacter, "G"))) {
        characterToReturn = procedures["RANDOM-BASE-LETTER-DNA"](); letVars['characterToReturn'] = characterToReturn;
      }
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return characterToReturn
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
  procs["replaceNonNucleotideCharacter"] = temp;
  procs["REPLACE-NON-NUCLEOTIDE-CHARACTER"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return (Prims.equality(world.observer.getGlobal("current-instruction"), 0) ? "press setup" : (workspace.dump('') + workspace.dump(world.observer.getGlobal("current-instruction")) + workspace.dump(" of ") + workspace.dump(ListPrims.length(procedures["INSTRUCTIONS"]()))))
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
        var _foreach_30598_30605 = Tasks.forEach(Tasks.commandTask(function(_0) {
          if (arguments.length < 1) {
            throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
          }
          OutputPrims.print(_0);
        }, "output-print"), ListPrims.item((world.observer.getGlobal("current-instruction") - 1), procedures["INSTRUCTIONS"]())); if(reporterContext && _foreach_30598_30605 !== undefined) { return _foreach_30598_30605; }
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
        return [["You will be simulating the process", "of protein synthesis from DNA that", "occurs in every cell.  And you will", "explore the effects of mutations", "on the proteins that are produced."], ["When you press SETUP, a single", "strand of an unwound DNA molecule", "appears. This represents the state", "of DNA in the cell nucleus during", "transcription."], ["To produce proteins, each gene in", "the original DNA strand must be", "transcribed  into an mRNA molecule.", "Do this by pressing GO/STOP and", "then the 1-TRANSCRIBE button."], ["For each mRNA molecule that was", "transcribed, press the 2-RELEASE", "button.  This releases the mRNA", "from the nucleus  into the ribosome", "of the cell."], ["For each mRNA molecule in the", "ribosome, press the 3-TRANSLATE", "button.  This pairs up molecules", "of tRNA with each set of three", "nucleotides in the mRNA molecule."], ["For each tRNA chain built, press", "the 4-RELEASE button.  This", "releases the amino acid chain", "from the rest of the tRNA chain,", "leaving behind the protein", "molecule that is produced."], ["Each time the 1-TRANSCRIBE", "button is pressed, the next gene", "in the original strand of DNA ", "will be transcribed.  Press the 1-,", "2-, 3-, 4- buttons and repeat to", "translate each subsequent gene."], ["When you press the 5-REPLICATE", "THE ORIGINAL DNA button a copy", "of the original DNA will be ", "generated for a new cell", "(as in mitosis or meiosis) and", "it will appear in the green."], ["The replicated DNA will have a", "# of random mutations, set by", "#-NUCLEOTIDES-AFFECTED, each", "mutation of the type set by", "MUTATION-TYPE. Press button 5)", "again to explore possible outcomes."], ["Now repeat the same transcription,", "release, translation, and release", "process for the DNA in this new", "cell by pressing 6-, 7-, 8-, 9-.", "Repeat that sequence again to", "cycle through to the next gene."], ["If you want to test the outcomes", "for your own DNA code, type any", "sequence of A, G, T, C in the", "USER-CREATED-CODE box and set", "the INITIAL-DNA-STRING to", "“from-user-code”.  Then press", "SETUP and start over again."]]
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
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
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
      if (e instanceof Exception.StopInterrupt) {
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
