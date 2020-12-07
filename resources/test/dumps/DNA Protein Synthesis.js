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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[150,165,165,180,180,195,195,210,210,165,165,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,135,120,120,105,105,90,90,135,135,150],"ycors":[150,165,195,195,225,225,255,255,285,285,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"amino acid":{"name":"amino acid","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[105,150,195,195,150,105,105],"ycors":[135,165,135,90,60,90,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":90,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":135,"y":45,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-ala":{"name":"amino-ala","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"amino-arg":{"name":"amino-arg","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":75,"x2":150,"y2":75,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":108,"y":64,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":27,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"amino-asn":{"name":"amino-asn","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":187,"x2":150,"y2":187,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":106,"y":175,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false}]},"amino-asp":{"name":"amino-asp","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":120,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false}]},"amino-cys":{"name":"amino-cys","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(44, 209, 59, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false}]},"amino-gln":{"name":"amino-gln","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":150,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":120,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":108,"y":139,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false}]},"amino-glu":{"name":"amino-glu","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":75,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false}]},"amino-gly":{"name":"amino-gly","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"amino-his":{"name":"amino-his","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[195,240,255,217,180],"ycors":[225,225,180,154,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":225,"x2":195,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":225,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":183,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":228,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":243,"y":169,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":168,"y":169,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":206,"y":143,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-ile":{"name":"amino-ile","editableColorIndex":0,"rotate":true,"elements":[{"x1":121,"y1":226,"x2":151,"y2":226,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":106,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-leu":{"name":"amino-leu","editableColorIndex":0,"rotate":true,"elements":[{"x1":105,"y1":135,"x2":150,"y2":165,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":165,"x2":195,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-lys":{"name":"amino-lys","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":90,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":64,"diam":24,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-met":{"name":"amino-met","editableColorIndex":0,"rotate":true,"elements":[{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":102,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(44, 209, 59, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false}]},"amino-phe":{"name":"amino-phe","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[119,120,150,180,179,150,119],"ycors":[147,180,195,179,146,131,148],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":224,"x2":149,"y2":194,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":149,"y2":223,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":138,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":139,"y":120,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":109,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":109,"y":168,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":167,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":167,"y":168,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-pro":{"name":"amino-pro","editableColorIndex":0,"rotate":true,"elements":[{"x1":210,"y1":210,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":135,"y1":210,"x2":180,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":165,"y1":180,"x2":210,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":135,"y1":210,"x2":150,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":160,"y":166,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":120,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":195,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-ser":{"name":"amino-ser","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false}]},"amino-thr":{"name":"amino-thr","editableColorIndex":0,"rotate":true,"elements":[{"x1":118,"y1":190,"x2":148,"y2":190,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[247,232,187,172,187,232],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":137,"y":176,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":138,"y":139,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":105,"y":177,"diam":24,"type":"circle","color":"rgba(45, 141, 190, 1)","filled":true,"marked":false}]},"amino-trp":{"name":"amino-trp","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[204,181,181,225,226],"ycors":[137,163,194,195,161],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[224,225,255,285,284,255,224],"ycors":[162,195,210,195,161,146,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":224,"x2":180,"y2":197,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":119,"y1":259,"x2":194,"y2":259,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":149,"y1":253,"x2":149,"y2":223,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[248,233,188,173,188,233],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[53,68,113,128,113,68],"ycors":[259,274,274,259,244,244],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":138,"y":214,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":138,"y":248,"diam":24,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":243,"y":198,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":244,"y":135,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":214,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":214,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":272,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":272,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":169,"y":183,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":192,"y":125,"diam":24,"type":"circle","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false},{"x":169,"y":150,"diam":24,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-tyr":{"name":"amino-tyr","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[105,150,195,195,150,105,105],"ycors":[135,165,135,90,60,90,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":150,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":135,"y":150,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":90,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":90,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":135,"y":0,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":180,"y":120,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":135,"y":45,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"amino-val":{"name":"amino-val","editableColorIndex":0,"rotate":true,"elements":[{"x1":105,"y1":180,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":210,"x2":195,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":120,"y1":255,"x2":195,"y2":255,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":240,"x2":150,"y2":210,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":135,"y":240,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[255,240,195,180,195,240],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[45,60,105,120,105,60],"ycors":[255,270,270,255,240,240],"type":"polygon","color":"rgba(52, 93, 169, 1)","filled":true,"marked":false},{"x":135,"y":195,"diam":30,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":165,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x":180,"y":165,"diam":30,"type":"circle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"empty":{"name":"empty","editableColorIndex":0,"rotate":false,"elements":[]},"end":{"name":"end","editableColorIndex":2,"rotate":false,"elements":[{"xcors":[130,145,160,175,220,235,250,265,265,250,235,220,175,160,145,130],"ycors":[61,46,46,61,61,46,46,61,226,241,241,226,226,241,241,226],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":true},{"xcors":[130,145,160,175,220,235,250,265,265,250,235,220,175,160,145,130],"ycors":[61,46,46,61,61,46,46,61,226,241,241,226,226,241,241,226],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false}]},"helicase":{"name":"helicase","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,180,165,150,135,120,105,90,75,75,105,105],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":false,"marked":false}]},"helicase-expanded":{"name":"helicase-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[210,195,180,165,150,135,120,105,75,90,120,135],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":false,"marked":false}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"mrna-a":{"name":"mrna-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"mrna-c":{"name":"mrna-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false}]},"mrna-g":{"name":"mrna-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false}]},"mrna-start":{"name":"mrna-start","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,0,15,30,30,60,60,150],"ycors":[240,240,270,270,300,300,270,270],"type":"polygon","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false}]},"mrna-stop":{"name":"mrna-stop","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[180,30,30,105,105,135,135,165],"ycors":[240,240,270,270,300,300,270,270],"type":"polygon","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false}]},"mrna-u":{"name":"mrna-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false}]},"nucleoside-tri-a":{"name":"nucleoside-tri-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"nucleoside-tri-c":{"name":"nucleoside-tri-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,135,165,165,135,60],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false}]},"nucleoside-tri-g":{"name":"nucleoside-tri-g","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":false}]},"nucleoside-tri-t":{"name":"nucleoside-tri-t","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":false}]},"nucleoside-tri-u":{"name":"nucleoside-tri-u","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":90,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":75,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":69,"y":60,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":24,"y":45,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false}]},"nucleotide-a":{"name":"nucleotide-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"nucleotide-c":{"name":"nucleotide-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":61,"x2":90,"y2":31,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false}]},"nucleotide-g":{"name":"nucleotide-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"nucleotide-t":{"name":"nucleotide-t","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"nucleotide-u":{"name":"nucleotide-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":45,"y1":60,"x2":75,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":67,"y":17,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"nucleotide-x":{"name":"nucleotide-x","editableColorIndex":0,"rotate":true,"elements":[{"x1":75,"y1":30,"x2":45,"y2":60,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x1":120,"y1":60,"x2":90,"y2":30,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":69,"y":15,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xcors":[120,120,150,180,180],"ycors":[60,180,120,180,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"phosphate":{"name":"phosphate","editableColorIndex":0,"rotate":true,"elements":[{"x":129,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"phosphate-pair":{"name":"phosphate-pair","editableColorIndex":0,"rotate":true,"elements":[{"x1":120,"y1":135,"x2":150,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"x":144,"y":135,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"x":99,"y":120,"diam":30,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false}]},"polymerase-0":{"name":"polymerase-0","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,60,60,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":0,"xmax":120,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true},{"xmin":120,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true}]},"polymerase-1":{"name":"polymerase-1","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,240,240],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":240,"xmax":120,"ymax":300,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":60,"xmax":180,"ymax":240,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true},{"xmin":105,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true}]},"polymerase-2":{"name":"polymerase-2","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"x1":180,"y1":60,"x2":180,"y2":240,"type":"line","color":"rgba(215, 50, 41, 1)","filled":false,"marked":true},{"xmin":120,"ymin":135,"xmax":300,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true}]},"polymerase-3":{"name":"polymerase-3","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[120,120,90,75,30,0,0,30,75,90,120],"ycors":[150,30,45,60,60,120,180,240,240,255,270],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":30,"xmax":180,"ymax":60,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":120,"ymin":240,"xmax":180,"ymax":270,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true},{"xmin":90,"ymin":135,"xmax":315,"ymax":165,"type":"rectangle","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true}]},"promoter-expanded":{"name":"promoter-expanded","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,105,90,75,60,45,15,30,60,75],"ycors":[150,135,135,120,120,105,105,90,90,135,135,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,105,90,75,60,45,15,30,60,75],"ycors":[150,165,165,180,180,195,195,210,210,165,165,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":117,"y":117,"diam":66,"type":"circle","color":"rgba(237, 237, 49, 1)","filled":false,"marked":false}]},"start":{"name":"start","editableColorIndex":0,"rotate":false,"elements":[{"xmin":125,"ymin":46,"xmax":260,"ymax":240,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false},{"xmin":126,"ymin":47,"xmax":260,"ymax":239,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":true,"elements":[{"x":76,"y":76,"diam":146,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":60,"x2":150,"y2":105,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":195,"x2":150,"y2":240,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"trna-a":{"name":"trna-a","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"xcors":[180,150,120,120,180],"ycors":[180,120,180,60,60],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"trna-c":{"name":"trna-c","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":61,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false},{"xcors":[180,180,120,120,135,165],"ycors":[135,60,60,135,165,165],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false}]},"trna-core":{"name":"trna-core","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[15,285,300,300,195,195,210,225,240,240,225,210,195,195,180,180,285,285,270,30,15,15,105,105,90,90,75,60,45,45,60,75,90,90,0,0],"ycors":[300,300,270,240,210,150,165,165,150,135,120,120,135,75,75,225,255,270,285,285,270,255,225,135,135,165,150,150,165,180,195,195,180,210,240,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"trna-g":{"name":"trna-g","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,135,165,180,180],"ycors":[60,165,135,135,165,60],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":false},{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false}]},"trna-u":{"name":"trna-u","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[120,120,150,180,180],"ycors":[60,120,180,120,60],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":false},{"x1":150,"y1":60,"x2":150,"y2":30,"type":"line","color":"rgba(224, 127, 150, 1)","filled":false,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "genes", singular: "gene", varNames: ["gene-number", "strand", "code", "start-position", "end-position"] }, { name: "nucleotides", singular: "nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "promoters", singular: "promoter", varNames: ["gene-number", "strand"] }, { name: "terminators", singular: "terminator", varNames: ["gene-number", "strand"] }, { name: "mRNA-nucleotides", singular: "mRNA-nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "mRNAs", singular: "mRNA", varNames: ["gene-number", "strand", "code", "cap-type", "traveling?", "released?"] }, { name: "tRNAs", singular: "tRNA", varNames: ["gene-number", "strand"] }, { name: "tRNA-nucleotides", singular: "tRNA-nucleotide", varNames: ["gene-number", "strand", "value", "place"] }, { name: "amino-acids", singular: "amino-acid", varNames: ["gene-number", "strand", "value", "place"] }, { name: "proteins", singular: "protein", varNames: ["gene-number", "strand", "value"] }, { name: "tags", singular: "tag", varNames: ["value"] }, { name: "taglines", singular: "tagline", varNames: [], isDirected: false }, { name: "backbones", singular: "backbone", varNames: [], isDirected: true }])([], [])(';;;;;;;;;;;;; DNA molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;; keeps a list of the dna code for a given gene breed [genes gene]  ;; the pieces that are inside the dna chain breed [nucleotides nucleotide]  ;; a visualization agent (similar to a promoter protein) ;; that attaches to every start codon location in a DNA chain breed [promoters promoter]  ;; a visualization agent that attaches to every stop codon location in a DNA chain breed [terminators terminator]  ;;;;;;;;;;;;; mRNA molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;; the pieces that are inside the mRNA chain breed [mRNA-nucleotides mRNA-nucleotide]  ;; the tail ends of the mRNA chain breed [mRNAs mRNA]  ;;;;;;;;;;;;; tRNA molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;; the center piece of the tRNA complex breed [tRNAs tRNA]  ;; the pieces that are inside the tRNA complex breed [tRNA-nucleotides tRNA-nucleotide]  ;; the top part of the tRNA complex breed [amino-acids amino-acid]  ;;;;;;;;;;;;; protein molecules  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; breed [proteins protein]                    ;; holds proteins information  ;;;;;;;;;;;;; tags for supporting a fine tuned placement of labels ;;;;;;;;;;;;; breed [tags tag]  ;;;;;;;;;;;;; links ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;; the link between an agent and where its label agent is. ;; This allows fine tuned placement of visualizing of labels undirected-link-breed [taglines tagline]  ;; the link between adjacent amino acids in a protein. ;; It will allows the entire protein to be folded up ;; (not currently implemented) directed-link-breed   [backbones backbone]  ;;;;;;;;;;;;;;;;;;;turtle variables ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; genes-own            [gene-number strand code start-position end-position] mRNAs-own            [gene-number strand code cap-type traveling? released?] promoters-own        [gene-number strand] terminators-own      [gene-number strand] tRNAs-own            [gene-number strand] proteins-own         [gene-number strand value] amino-acids-own      [gene-number strand value place] nucleotides-own      [gene-number strand value place] mRNA-nucleotides-own [gene-number strand value place] tRNA-nucleotides-own [gene-number strand value place] tags-own [   value ; the value for the label of the agent it is linked to when visualized. ]    ;;;;;;;;;;;;;globals ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  globals [    current-instruction               ;; holds counter value for which instruction is being displayed   codon-to-amino-acid-key           ;; holds lookup table for codon triplet to amino acid   original-dna-string               ;; holds a string of the original DNA   duplicate-dna-string              ;; holds a string of the duplicate DNA.  This changes every time the replicate DNA button is pressed    ;; position values for visualization   duplicate-ribosome-ycor   original-ribosome-ycor   duplicate-dna-ycor   original-dna-ycor   nucleotide-spacing    ;; colors for various agents and states of agents   nucleo-tag-color   terminator-color   gene-color-counter    ;; counters for the number of genes   original-strand-gene-counter   duplicate-strand-gene-counter   original-display-mrna-counter   duplicate-display-mrna-counter    mRNAs-traveling                    ;; list of mRNAs traveling   mRNAs-released                     ;; list of mRNAs released    ;; for keeping track of user initiated events   replicate-dna-event?   show-genes-event?   event-1-triggered?   event-2-triggered?   event-3-triggered?   event-4-triggered?   event-6-triggered?   event-7-triggered?   event-8-triggered?   event-9-triggered?   event-1-completed?   event-2-completed?   event-3-completed?   event-4-completed?   event-6-completed?   event-7-completed?   event-8-completed?   event-9-completed? ]  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;setup procedures;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to setup   clear-all   set replicate-dna-event? false   set show-genes-event? false    set event-1-triggered? false   set event-2-triggered? false   set event-3-triggered? false   set event-4-triggered? false   set event-6-triggered? false   set event-7-triggered? false   set event-8-triggered? false   set event-9-triggered? false   set event-1-completed? false   set event-2-completed? false   set event-3-completed? false   set event-4-completed? false   set event-6-completed? false   set event-7-completed? false   set event-8-completed? false   set event-9-completed? false     set mRNAs-traveling []   set mRNAs-released  []   set codon-to-amino-acid-key []   set original-dna-string \"\"   set duplicate-dna-string \"\"    set duplicate-ribosome-ycor -7   set original-ribosome-ycor 4   set duplicate-dna-ycor -2   set original-dna-ycor 1   set gene-color-counter 1   set nucleotide-spacing .45    set original-strand-gene-counter 0   set duplicate-strand-gene-counter 0   set original-display-mrna-counter 0   set duplicate-display-mrna-counter 0    set-default-shape promoters \"start\"   set-default-shape terminators \"end\"   set-default-shape tags \"empty\"    set terminator-color      [255 0 0 150]   set nucleo-tag-color      [255 255 255 120]    initialize-codon-to-amino-acid-key   setup-starting-dna   visualize-all-genes   ask patches [set pcolor blue - 4]   ask patches with [pycor > 2]  [set pcolor blue - 3.5]   ask patches with [pycor < 0]  [set pcolor green - 4]   ask patches with [pycor < -3] [set pcolor green - 3.5]   show-instruction 1   reset-ticks end   to setup-starting-dna   setup-dna-string   build-genes-from-dna \"original\" original-dna-string   make-a-nucleotide-chain-for-dna-string \"original\" original-dna-string   place-dna \"original\"   build-mrna-for-each-gene \"original\"   build-protein-from-mrna  \"original\"   place-trnas \"original\"   hide-mrna   \"original\"   hide-trna   \"original\"   hide-genes  \"original\" end    ;; original-dna-string to setup-dna-string   if initial-dna-string = \"from user-created-code\" [set original-dna-string dna-string-with-non-nucleotide-characters-replaced user-created-code]   if initial-dna-string = \"random (short strand)\" [     let initial-length-dna 12     repeat initial-length-dna [set original-dna-string (word original-dna-string random-base-letter-DNA)]   ]   if initial-dna-string = \"random (long strand)\"  [     let initial-length-dna 56     repeat initial-length-dna [set original-dna-string (word original-dna-string random-base-letter-DNA)]   ]   if initial-dna-string = \"no genes (short strand)\" [set original-dna-string \"ATTATATCGTAG\"]   if initial-dna-string = \"no genes (long strand)\"  [set original-dna-string \"GATATTTGGTAGCCCGAGAAGTGGTTTTTCAGATAACAGAGGTGGAGCAGCTTTTAG\"]   if initial-dna-string = \"1 short gene\"            [set original-dna-string \"ATTATGTGGTAG\"]   if initial-dna-string = \"1 long gene\"             [set original-dna-string \"GGGATGGACACCTTATCATTTGCTACTAGCGACCAGTTTGAGTAGCTTCGTCGGTGA\"]   if initial-dna-string = \"2 sequential genes\"      [set original-dna-string \"AGTATGAAAACCCACGAGTGGTAGCCCGAGATTGAGATGTGGTTTTTCAGATAACAG\"]   if initial-dna-string = \"2 nested genes\"          [set original-dna-string \"GTTATGAGGGGGACCCGAGATGTGGTTTTTGAAATAGACAAGTAGACCCTAATAGAC\"]   if initial-dna-string = \"3 sequential genes\"      [set original-dna-string \"GATATGTGGTAGCCCGAGATGTGGTTTTTCAGATAACAGATGTGGAGCAGCTTTTAG\"] end   to place-dna [strand-type]   let dna (turtle-set genes nucleotides promoters terminators)   ask dna with [strand = strand-type][     if strand-type = \"original\"  [set ycor original-dna-ycor]     if strand-type = \"duplicate\" [set ycor duplicate-dna-ycor]   ] end   to place-trnas [strand-type]   ask tRNAs with [strand = strand-type] [     if strand-type = \"original\"   [set ycor original-ribosome-ycor + 1]     if strand-type = \"duplicate\"  [set ycor duplicate-ribosome-ycor + 1]   ] end   to make-a-nucleotide-chain-for-dna-string [strand-type dna-string]   let previous-nucleotide nobody   let place-counter 0   create-turtles 1 [     set heading 90     fd 1     repeat (length dna-string) [         hatch 1 [           set breed nucleotides           set strand strand-type           set value item place-counter dna-string           set shape (word \"nucleotide-\" value)           set heading 0           set place place-counter           attach-tag 5 0.5 value nucleo-tag-color           set place-counter place-counter + 1           ]        fd nucleotide-spacing        ]    die ;; remove the chromosome builder (a temporary construction turtle)   ] end    to build-genes-from-dna [strand-type dna-string]   let remaining-dna dna-string   let this-item \"\"   let last-item \"\"   let last-last-item \"\"   let triplet \"\"   let item-position 0   let last-item-kept length dna-string   repeat (length dna-string) [     let first-item item 0 remaining-dna     set remaining-dna remove-item 0 remaining-dna     set last-last-item last-item     set last-item this-item     set this-item first-item     set triplet (word last-last-item last-item this-item)     if triplet = \"ATG\" [       create-genes 1 [         set hidden? true         set strand strand-type         if strand = \"original\"  [           set original-strand-gene-counter original-strand-gene-counter + 1           set gene-number original-strand-gene-counter         ]         if strand = \"duplicate\" [           set duplicate-strand-gene-counter duplicate-strand-gene-counter + 1           set gene-number duplicate-strand-gene-counter         ]         set start-position item-position         set end-position ((length original-dna-string))         set code (word triplet substring dna-string (item-position + 1) ((length dna-string) ) )         ]      ]      set item-position item-position + 1   ]   ask genes [     let end-of-gene? false     let triplet-counter 0     let new-code code     repeat floor (length code / 3)  [       let this-triplet (word  (item (0 + (triplet-counter * 3)) code)  (item (1 + (triplet-counter * 3)) code)  (item (2 + (triplet-counter * 3)) code) )       if (this-triplet =  \"TAG\" or this-triplet = \"TGA\"  or this-triplet = \"TAA\") and not end-of-gene? [         set end-position triplet-counter * 3         set new-code substring code 0 end-position         set end-of-gene? true       ]       set triplet-counter triplet-counter + 1     ]     set triplet-counter 0     set end-of-gene? false     set code new-code   ]  end   to build-mRNA-for-each-gene [strand-type]   ask genes with [strand = strand-type] [     let this-code code     let this-gene self      set heading 90     fd .1     repeat start-position [fd .45] ;; move over to correct nucleotide location on dna      let gene-color next-gene-color     let gene-color-with-transparency (sentence (extract-rgb gene-color) 110)     let gene-color-label (sentence (extract-rgb gene-color) 250)     ;; make promoter for start codon     hatch 1 [       set breed promoters       set color gene-color-with-transparency       set size 3       set hidden? false       attach-tag 142 1.7 (word \"start:\" gene-number) gene-color-label       create-backbone-from this-gene [set hidden? true set tie-mode \"fixed\" tie]       ;; make terminator for end codon       hatch 1 [         set breed terminators         fd ((length this-code) * 0.45)         attach-tag 142 1.7 (word \"end:\" gene-number) gene-color-label         create-backbone-from this-gene [set hidden? true set tie-mode \"fixed\" tie]       ]     ]      ;; make start cap for mRNA molecule     hatch 1 [       let this-mRNA self       set breed mRNAs       set traveling? false       set released? false       set code mrna-string-from-dna-string code       set cap-type \"start\"       set shape \"mrna-start\"       set hidden? false       ;; associate the mRNA molecule with the parent gene       create-backbone-from this-gene [set hidden? true set tie-mode \"fixed\" tie]       ;; build a stop cap for the mRNA molecule       hatch 1 [         set cap-type \"stop\"         set shape \"mrna-stop\"         let nucleotide-counter 0         ;; associate the mRNA stop cap with the start cap         create-backbone-from this-mRNA  [set hidden? true set tie-mode \"fixed\" tie]         ;; use the stop cap turtle to construct the mRNA nucleotides         let code-to-transcribe code         repeat length code [           hatch 1 [             set breed mRNA-nucleotides             set value first code-to-transcribe             set shape (word \"mrna-\" value)             set heading 180             attach-tag 175 0.9 value nucleo-tag-color             create-backbone-from this-mRNA  [set hidden? true set tie-mode \"fixed\" tie]           ]           set code-to-transcribe remove-item 0 code-to-transcribe           fd nucleotide-spacing         ]       ]     ]   ] end   to build-protein-from-mrna [strand-type]   ask mRNAs with [cap-type = \"start\" and strand = strand-type] [     let number-of-triplets-in-list floor ((length code) / 3)     let this-triplet \"\"     let triplet-counter 0     repeat number-of-triplets-in-list   [       set this-triplet (word         complementary-mRNA-base  (item (0 + (triplet-counter * 3)) code)         complementary-mRNA-base  (item (1 + (triplet-counter * 3)) code)         complementary-mRNA-base  (item (2 + (triplet-counter * 3)) code)         )       build-tRNA-for-this-triplet  this-triplet triplet-counter       set triplet-counter triplet-counter + 1     ]   ] end    to build-tRNA-for-this-triplet [this-triplet triplet-counter]   let this-tRNA nobody   hatch 1 [     set breed tRNAs     set this-tRNA self     set shape \"tRNA-core\"     set size 1.2     set heading 0     hatch 1 [       set breed amino-acids       set value  (which-protein-for-this-codon this-triplet)       set shape (word \"amino-\" value)       set heading 0       set size 2       fd 1       create-backbone-from this-tRNA  [set hidden? true set tie-mode \"free\" tie]       attach-tag 20 .8 value nucleo-tag-color     ]     hatch 1 [       set breed tRNA-nucleotides       set shape (word \"trna-\" (item 0 this-triplet))       set heading -155       fd 1.1       set heading 0       create-backbone-from this-tRNA  [set hidden? true set tie-mode \"fixed\" tie]       hatch 1 [         set breed tRNA-nucleotides         set shape (word \"trna-\" (item 1 this-triplet))         set heading 90         fd .45         set heading 0         create-backbone-from this-tRNA  [set hidden? true set tie-mode \"fixed\" tie]       ]       hatch 1 [         set breed tRNA-nucleotides         set shape (word \"trna-\" (item 2 this-triplet))         set heading 90         fd .90         set heading 0         create-backbone-from this-tRNA  [set hidden? true set tie-mode \"fixed\" tie]       ]     ]     fd 1     set heading 90     fd nucleotide-spacing + ( nucleotide-spacing * 3 * triplet-counter )     set heading 0   ] end   ;; fine tuned placement of the location of a label for a nucleoside or nucleotide to attach-tag [direction displacement label-value color-value]   hatch 1 [     set heading direction     fd displacement     set breed tags     set label label-value     set size 0.1     set label-color color-value     create-tagline-with myself [set tie-mode \"fixed\" set hidden? true tie]   ] end    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;; visibility procedures ;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to visualize-all-genes    ask (turtle-set promoters terminators)[ask tagline-neighbors [set hidden? not show-genes?] set hidden? not show-genes?] end   to hide-genes  [strand-type]    ask (turtle-set promoters terminators)  with [strand = strand-type] [ask tagline-neighbors [set hidden? true] set hidden? true] end   to hide-mrna  [strand-type]    ask (turtle-set mRNAs mrna-nucleotides) with [strand = strand-type] [ask tagline-neighbors [set hidden? true] set hidden? true] end   to hide-trna  [strand-type]    ask (turtle-set tRNAs trna-nucleotides amino-acids) with [strand = strand-type] [ask tagline-neighbors [set hidden? true] set hidden? true] end   to show-next-mrna  [strand-type]   let these-genes genes with [strand = strand-type]   if count these-genes = 0 [display-user-message-no-genes]   if strand-type = \"original\" [     set original-display-mrna-counter original-display-mrna-counter + 1     if (original-display-mrna-counter > count these-genes) [set original-display-mrna-counter 1]     ask mRNAs with [strand = strand-type and cap-type = \"start\"] [       ifelse gene-number != original-display-mrna-counter         [ask out-backbone-neighbors [set hidden? true ask tagline-neighbors [set hidden? true] ] set hidden? true]         [ask out-backbone-neighbors [set hidden? false ask tagline-neighbors [set hidden? false] ] set hidden? false]       set traveling? false set released? false set ycor original-dna-ycor     ]   ]   if strand-type = \"duplicate\" [     set duplicate-display-mrna-counter duplicate-display-mrna-counter + 1     if (duplicate-display-mrna-counter > count these-genes) [set duplicate-display-mrna-counter 1]     ask mRNAs with [strand = strand-type and cap-type = \"start\"] [       ifelse gene-number != duplicate-display-mrna-counter         [ask out-backbone-neighbors [set hidden? true ask tagline-neighbors [set hidden? true] ] set hidden? true]         [ask out-backbone-neighbors [set hidden? false ask tagline-neighbors [set hidden? false]] set hidden? false]       set traveling? false set released? false set ycor duplicate-dna-ycor     ]   ] end   to show-next-trna  [strand-type]   let this-gene-number gene-number-for-this-strand strand-type   ask mRNAs with [strand = strand-type and cap-type = \"start\" and released? and gene-number = this-gene-number ] [     ask tRNAs with [strand = strand-type] [       ifelse gene-number = this-gene-number         [ask out-backbone-neighbors [set hidden? false ask tagline-neighbors [set hidden? false] ] set hidden? false]         [ask out-backbone-neighbors [set hidden? true ask tagline-neighbors [set hidden? true] ] set hidden? true]       ]   ] end   to display-user-message-no-genes   user-message \"There are no genes in this strand of DNA. A specific sequence of 3 nucleotides is required for a gene\" end   to release-next-protein  [strand-type]   let make-protein? false   let this-gene-number gene-number-for-this-strand strand-type   ask mRNAs with [strand = strand-type and cap-type = \"start\" and released?  and gene-number = this-gene-number ] [      ask tRNAs with [strand = strand-type] [       ifelse gene-number = this-gene-number         [ask out-backbone-neighbors [          set make-protein? true          set hidden? true            ifelse breed = amino-acids              [set hidden? false ask tagline-neighbors [set hidden? false] ]              [set hidden? true ask tagline-neighbors [set hidden? true] ]            ]          ]          [ask out-backbone-neighbors [set hidden? true ask tagline-neighbors [set hidden? true] ] set hidden? true]          set hidden? true     ]     if make-protein? [make-protein strand-type ]   ] end   to make-protein [strand-type]   let this-gene-number gene-number-for-this-strand strand-type   let this-protein-value \"\"   let these-amino-acids amino-acids with [breed = amino-acids and strand-type = strand and gene-number = this-gene-number]   let ordered-amino-acids sort-on [who] these-amino-acids   foreach ordered-amino-acids [ the-amino-acid ->     set this-protein-value (word   this-protein-value \"-\" ([value] of the-amino-acid))   ]   if not any? proteins with [strand = strand-type and value = this-protein-value] [       hatch 1 [set breed proteins set value this-protein-value set hidden? true setxy 0 0]   ] end   to release-next-mRNA-from-nucleus [strand-type]   ask mRNAs with [strand = strand-type][set traveling? true set released? false] end    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; runtime procedures ;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to go   visualize-all-genes   ;; these boolean variables keep track of button press events being cued by the user   if event-1-triggered? [     show-next-mrna \"original\"     set event-1-triggered? false     set event-1-completed? true     set event-2-completed? false     set event-3-completed? false     set event-4-completed? false   ]   if event-2-triggered? and event-1-completed? [     release-next-mRNA-from-nucleus \"original\"     set event-2-triggered? false     set event-3-completed? false     set event-4-completed? false   ]   if event-3-triggered? and event-2-completed? [     show-next-trna \"original\"     set event-3-triggered? false     set event-3-completed? true     set event-4-completed? false   ]   if event-4-triggered? and event-3-completed? [     release-next-protein \"original\"     set event-4-triggered? false     set event-4-completed? true   ]   if event-6-triggered? [     show-next-mrna \"duplicate\"     set event-6-triggered? false     set event-6-completed? true     set event-7-completed? false     set event-8-completed? false     set event-9-completed? false   ]   if event-7-triggered? and event-6-completed? [     release-next-mRNA-from-nucleus \"duplicate\"     set event-7-triggered? false     set event-8-completed? false     set event-9-completed? false   ]   if event-8-triggered? and event-7-completed? [     show-next-trna \"duplicate\"     set event-8-triggered? false     set event-8-completed? true     set event-9-completed? false   ]   if event-9-triggered? and event-8-completed? [     release-next-protein \"duplicate\"     set event-9-triggered? false     set event-9-completed? true   ]   move-mRNA-molecules-out-of-nucleus   tick end   to move-mRNA-molecules-out-of-nucleus   ask mRNAs with [traveling? and cap-type = \"start\"] [     if strand = \"original\" [       if ycor < original-ribosome-ycor [ set ycor ycor + .1 ]       if ycor >= original-ribosome-ycor [ set traveling? false set released? true set event-2-completed? true]     ]     if strand = \"duplicate\" [       if ycor > duplicate-ribosome-ycor [ set ycor ycor - .1]       if ycor <= duplicate-ribosome-ycor [ set traveling? false set released? true set event-7-completed? true]     ]   ] end   to show-protein-production   clear-output   let original-proteins proteins with [strand = \"original\"]   output-print \"Proteins Produced\"   output-print (word \"from original DNA  = \" count original-proteins)   output-print \"::::::::::::::::::\"   ask original-proteins [     output-print (word \"Orig.Gene #\" gene-number \" > Protein:\")     output-print value     output-print \"\"   ]   output-print \"==================\"   let duplicate-proteins  proteins with [strand = \"duplicate\"]   output-print \"Proteins Produced\"   output-print (word \"from copy of DNA = \" count duplicate-proteins)   output-print \"::::::::::::::::::\"   ask duplicate-proteins [     output-print (word \"Copy.Gene #\" gene-number \" > Protein:\")     output-print value     output-print \"\"   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;; make duplicate dna procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to make-duplicate-dna-string   let position-counter 0   set duplicate-strand-gene-counter 0   let clean-duplicate-dna-string original-dna-string   let mutating-copy-of-dna-string original-dna-string      let target-loci random ((length mutating-copy-of-dna-string) - #-nucleotides-affected)     let dna-at-target item target-loci mutating-copy-of-dna-string     let dna-before-target substring mutating-copy-of-dna-string 0 target-loci     let loci-counter 0     let dna-at-and-after-target substring mutating-copy-of-dna-string target-loci length mutating-copy-of-dna-string      if mutation-type = \"deletion\" [       repeat #-nucleotides-affected [         set  mutating-copy-of-dna-string remove-item target-loci mutating-copy-of-dna-string       ]     ]     if mutation-type  = \"substitution\" [       repeat #-nucleotides-affected [         set mutating-copy-of-dna-string (replace-item (target-loci + loci-counter) mutating-copy-of-dna-string random-base-letter-DNA)         set loci-counter loci-counter + 1       ]     ]     if mutation-type  = \"insertion\" [       repeat #-nucleotides-affected [         set  dna-at-and-after-target (word random-base-letter-DNA  dna-at-and-after-target)       ]       set mutating-copy-of-dna-string (word dna-before-target dna-at-and-after-target)     ]   set duplicate-dna-string mutating-copy-of-dna-string end   to replicate-dna   let turtles-to-remove (turtle-set nucleotides mRNAs tRNAs genes promoters terminators amino-acids mrna-nucleotides)   ;; (re)build the everything for the duplicate dna   ask turtles-to-remove with [strand = \"duplicate\" ][ask tagline-neighbors [die] die]            ;; wipe out old nucleotides   make-duplicate-dna-string   build-genes-from-dna \"duplicate\" duplicate-dna-string   make-a-nucleotide-chain-for-dna-string \"duplicate\" duplicate-dna-string   place-dna \"duplicate\"   build-mrna-for-each-gene \"duplicate\"   build-protein-from-mrna \"duplicate\"   place-trnas \"duplicate\"   hide-mrna   \"duplicate\"   hide-trna   \"duplicate\"   hide-genes  \"duplicate\" end    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;; initializing lists and strings ;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to initialize-codon-to-amino-acid-key    set codon-to-amino-acid-key [      ;;all triplets where the 2nd base is U      [\"UUU\" \"Phe\"] [\"UUC\" \"Phe\"] [\"UUA\" \"Leu\"] [\"UUG\" \"Leu\"]      [\"CUU\" \"Leu\"] [\"CUC\" \"Leu\"] [\"CUA\" \"Leu\"] [\"CUG\" \"Leu\"]      [\"AUU\" \"Ile\"] [\"AUC\" \"Ile\"] [\"AUA\" \"Ile\"] [\"AUG\" \"Met\"]      [\"GUU\" \"Val\"] [\"GUC\" \"Val\"] [\"GUA\" \"Val\"] [\"GUG\" \"Val\"]      ;;all triplets where the 2nd base is C      [\"UCU\" \"Ser\"] [\"UCC\" \"Ser\"] [\"UCA\" \"Ser\"] [\"UCG\" \"Ser\"]      [\"CCU\" \"Pro\"] [\"CCC\" \"Pro\"] [\"CCA\" \"Pro\"] [\"CCG\" \"Pro\"]      [\"ACU\" \"Thr\"] [\"ACC\" \"Thr\"] [\"ACA\" \"Thr\"] [\"ACG\" \"Thr\"]      [\"GCU\" \"Ala\"] [\"GCC\" \"Ala\"] [\"GCA\" \"Ala\"] [\"GCG\" \"Ala\"]      ;;all triplets where the 3rd base is A      [\"UAU\" \"Tyr\"] [\"UAC\" \"Tyr\"] [\"UAA\" \"Stop\"] [\"UAG\" \"Stop\"]      [\"CAU\" \"His\"] [\"CAC\" \"His\"] [\"CAA\" \"Gln\"] [\"CAG\" \"Gln\"]      [\"AAU\" \"Asn\"] [\"AAC\" \"Asn\"] [\"AAA\" \"Lys\"] [\"AAG\" \"Lys\"]      [\"GAU\" \"Asp\"] [\"GAC\" \"Asp\"] [\"GAA\" \"Glu\"] [\"GAG\" \"Glu\"]      ;;all triplets where the 4th base is G      [\"UGU\" \"Cys\"] [\"UGC\" \"Cys\"] [\"UGA\" \"Stop\"] [\"UGG\" \"Trp\"]      [\"CGU\" \"Arg\"] [\"CGC\" \"Arg\"] [\"CGA\" \"Arg\"] [\"CGG\" \"Arg\"]      [\"AGU\" \"Ser\"] [\"AGC\" \"Ser\"] [\"AGA\" \"Arg\"] [\"AGG\" \"Arg\"]      [\"GGU\" \"Gly\"] [\"GGC\" \"Gly\"] [\"GGA\" \"Gly\"] [\"GGG\" \"Gly\"]      ] end    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;; reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  ;;;;;; returns values such as \"Gly\" for \"GGA\" or \"Tyr\" for \"UAC\" using the codon-to-amino-acid-key to-report which-protein-for-this-codon [this-codon]  report item 1 (item 0 filter [ pair -> first pair = this-codon] codon-to-amino-acid-key ) end  ;;; reports a random base for a nucleotide in DNA to-report random-base-letter-DNA   let r random 4   let letter-to-report \"\"   if r = 0 [set letter-to-report \"A\"]   if r = 1 [set letter-to-report \"G\"]   if r = 2 [set letter-to-report \"T\"]   if r = 3 [set letter-to-report \"C\"]   report letter-to-report end  ;;; reports a complementary base for a base pairing given the nucleotide from DNA or mRNA to-report complementary-mRNA-base [base]   let base-to-report \"\"   if base = \"A\" [set base-to-report \"U\"]   if base = \"T\" [set base-to-report \"A\"]   if base = \"U\" [set base-to-report \"A\"]   if base = \"G\" [set base-to-report \"C\"]   if base = \"C\" [set base-to-report \"G\"]   report base-to-report end   ;; cycles through next color in base-color list to assign to the next gene to-report next-gene-color   ifelse gene-color-counter >= (length base-colors) - 1    [set gene-color-counter 0]    [set gene-color-counter gene-color-counter + 1 ]   report (item gene-color-counter base-colors) end   to-report gene-number-for-this-strand [strand-type]   let this-gene-number 0   if strand-type = \"original\"  [set this-gene-number original-display-mrna-counter]   if strand-type = \"duplicate\" [set this-gene-number duplicate-display-mrna-counter]   report this-gene-number end   ;; reports the mrna code that gets transcribed from the dna to-report mrna-string-from-dna-string [dna-string]   let new-string dna-string   let next-item 0   repeat length dna-string [     set new-string (replace-item next-item new-string (complementary-mRNA-base (item next-item new-string))  )     set next-item next-item + 1   ]   report new-string end  ;; reports a string of dna where any A, G, C, T letter is replaced with a random one of these, and any length beyond ;; characters is deprecated to-report dna-string-with-non-nucleotide-characters-replaced [dna-string]   let new-string dna-string   let next-item 0   repeat length dna-string [     set new-string (replace-item next-item new-string (replace-non-nucleotide-character (item next-item new-string))  )     set next-item next-item + 1   ]   if length dna-string > 64 [set new-string substring new-string 0 64]   report new-string end  ;; replaces any A, G, C, T letter is replaced with a random one of these to-report replace-non-nucleotide-character [nucleotide-character]    let character-to-return nucleotide-character    if nucleotide-character != \"A\" and nucleotide-character != \"T\" and nucleotide-character != \"C\" and nucleotide-character != \"G\"      [set character-to-return random-base-letter-DNA]    report character-to-return end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;; instructions for players ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to-report current-instruction-label   report ifelse-value current-instruction = 0     [ \"press setup\" ]     [ (word current-instruction \" of \" length instructions) ] end   to next-instruction   show-instruction current-instruction + 1 end   to previous-instruction   show-instruction current-instruction - 1 end   to show-instruction [ i ]   if i >= 1 and i <= length instructions [     set current-instruction i     clear-output     foreach item (current-instruction - 1) instructions output-print   ] end   to-report instructions   report [     [      \"You will be simulating the process\"      \"of protein synthesis from DNA that\"      \"occurs in every cell.  And you will\"      \"explore the effects of mutations\"      \"on the proteins that are produced.\"     ]     [      \"When you press SETUP, a single\"      \"strand of an unwound DNA molecule\"      \"appears. This represents the state\"       \"of DNA in the cell nucleus during\"      \"transcription.\"     ]     [      \"To produce proteins, each gene in\"      \"the original DNA strand must be\"      \"transcribed  into an mRNA molecule.\"      \"Do this by pressing GO/STOP and\"      \"then the 1-TRANSCRIBE button.\"     ]     [      \"For each mRNA molecule that was\"      \"transcribed, press the 2-RELEASE\"      \"button.  This releases the mRNA\"      \"from the nucleus  into the ribosome\"      \"of the cell.\"     ]     [      \"For each mRNA molecule in the\"      \"ribosome, press the 3-TRANSLATE\"      \"button.  This pairs up molecules\"      \"of tRNA with each set of three\"      \"nucleotides in the mRNA molecule.\"     ]     [       \"For each tRNA chain built, press\"       \"the 4-RELEASE button.  This\"       \"releases the amino acid chain\"       \"from the rest of the tRNA chain,\"       \"leaving behind the protein\"       \"molecule that is produced.\"     ]     [       \"Each time the 1-TRANSCRIBE\"       \"button is pressed, the next gene\"       \"in the original strand of DNA \"       \"will be transcribed.  Press the 1-,\"       \"2-, 3-, 4- buttons and repeat to\"       \"translate each subsequent gene.\"     ]     [       \"When you press the 5-REPLICATE\"       \"THE ORIGINAL DNA button a copy\"       \"of the original DNA will be \"       \"generated for a new cell\"       \"(as in mitosis or meiosis) and\"       \"it will appear in the green.\"     ]     [       \"The replicated DNA will have a\"       \"# of random mutations, set by\"       \"#-NUCLEOTIDES-AFFECTED, each\"       \"mutation of the type set by\"       \"MUTATION-TYPE. Press button 5)\"       \"again to explore possible outcomes.\"     ]     [       \"Now repeat the same transcription,\"       \"release, translation, and release\"       \"process for the DNA in this new\"       \"cell by pressing 6-, 7-, 8-, 9-.\"       \"Repeat that sequence again to\"       \"cycle through to the next gene.\"     ]     [       \"If you want to test the outcomes\"       \"for your own DNA code, type any\"       \"sequence of A, G, T, C in the\"       \"USER-CREATED-CODE box and set\"       \"the INITIAL-DNA-STRING to\"       \"“from-user-code”.  Then press\"       \"SETUP and start over again.\"     ]   ] end    to reset-completed-events    if event-1-triggered? or  event-2-triggered? or event-3-triggered? or event-4-triggered? [     set event-4-completed? false     if event-1-triggered? or  event-2-triggered? or event-3-triggered? [       set event-3-completed? false       if event-1-triggered? or  event-2-triggered?  [         set event-2-completed? false         if event-1-triggered?  [ set event-1-completed? false ]       ]     ]   ]   if event-6-triggered? or event-7-triggered? or event-8-triggered? or event-9-triggered? [     set event-9-completed? false     if event-6-triggered? or  event-7-triggered? or event-8-triggered? [       set event-8-completed? false       if event-6-triggered? or  event-7-triggered?  [         set event-7-completed? false         if event-6-triggered?  [ set event-6-completed? false ]       ]     ]    ]   end   ; Copyright 2012 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":465,"top":10,"right":1217,"bottom":403,"dimensions":{"minPxcor":0,"maxPxcor":30,"minPycor":-8,"maxPycor":7,"patchSize":24,"wrappingAllowedInX":true,"wrappingAllowedInY":true},"fontSize":9,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":5,"top":10,"right":75,"bottom":50,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":75,"top":10,"right":165,"bottom":50,"display":"go / stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"initial-dna-string","left":5,"top":285,"right":255,"bottom":330,"display":"initial-dna-string","choices":["from user-created-code","no genes (short strand)","no genes (long strand)","1 short gene","1 long gene","2 sequential genes","2 nested genes","3 sequential genes","random (short strand)","random (long strand)"],"currentChoice":4,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"variable":"user-created-code","left":5,"top":330,"right":255,"bottom":390,"boxedValue":{"value":"AAAAA","type":"String","multiline":false},"type":"inputBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_46 = procedures[\"REPLICATE-DNA\"]();   if (_maybestop_33_46 instanceof Exception.StopInterrupt) { return _maybestop_33_46; }   let _maybestop_47_66 = procedures[\"VISUALIZE-ALL-GENES\"]();   if (_maybestop_47_66 instanceof Exception.StopInterrupt) { return _maybestop_47_66; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"replicate-dna visualize-all-genes","left":265,"top":210,"right":455,"bottom":246,"display":"5. replicate the original DNA","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"6","compiledStep":"1","variable":"#-nucleotides-affected","left":5,"top":205,"right":255,"bottom":238,"display":"#-nucleotides-affected","min":"1","max":"6","default":1,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"mutation-type","left":5,"top":240,"right":125,"bottom":285,"display":"mutation-type","choices":["deletion","insertion","substitution"],"currentChoice":2,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   if (world.observer.getGlobal(\"event-2-completed?\")) {     world.observer.setGlobal(\"event-3-triggered?\", true);     procedures[\"RESET-COMPLETED-EVENTS\"]();   } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"if event-2-completed? [   set event-3-triggered? true   reset-completed-events ]","left":280,"top":145,"right":370,"bottom":179,"display":"3. translate","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   world.observer.setGlobal(\"event-1-triggered?\", true);   let _maybestop_61_83 = procedures[\"RESET-COMPLETED-EVENTS\"]();   if (_maybestop_61_83 instanceof Exception.StopInterrupt) { return _maybestop_61_83; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"set event-1-triggered? true reset-completed-events","left":280,"top":92,"right":370,"bottom":127,"display":"1. transcribe","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   if (world.observer.getGlobal(\"event-3-completed?\")) {     world.observer.setGlobal(\"event-4-triggered?\", true);     procedures[\"RESET-COMPLETED-EVENTS\"]();   } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"if event-3-completed? [   set event-4-triggered? true   reset-completed-events ]","left":370,"top":145,"right":446,"bottom":179,"display":"4. release","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"original-strand-gene-counter\")","source":"original-strand-gene-counter","left":295,"top":30,"right":352,"bottom":71,"display":"genes","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"PROTEINS\")._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"strand\"), \"duplicate\"); })","source":"count proteins with [strand = \"duplicate\"]","left":340,"top":280,"right":440,"bottom":321,"display":"proteins made","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"Replicated DNA in new cell","left":306,"top":263,"right":462,"bottom":281,"fontSize":11,"color":54,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   if (world.observer.getGlobal(\"event-1-completed?\")) {     world.observer.setGlobal(\"event-2-triggered?\", true);     procedures[\"RESET-COMPLETED-EVENTS\"]();   } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"if event-1-completed? [   set event-2-triggered? true   reset-completed-events ]","left":370,"top":92,"right":445,"bottom":127,"display":"2. release","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"left":5,"top":85,"right":255,"bottom":205,"fontSize":12,"type":"output","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"duplicate-strand-gene-counter\")","source":"duplicate-strand-gene-counter","left":291,"top":280,"right":341,"bottom":321,"display":"genes","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   world.observer.setGlobal(\"event-6-triggered?\", true);   let _maybestop_61_83 = procedures[\"RESET-COMPLETED-EVENTS\"]();   if (_maybestop_61_83 instanceof Exception.StopInterrupt) { return _maybestop_61_83; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"set event-6-triggered? true reset-completed-events","left":280,"top":340,"right":370,"bottom":373,"display":"6. transcribe","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   if (world.observer.getGlobal(\"event-6-completed?\")) {     world.observer.setGlobal(\"event-7-triggered?\", true);     procedures[\"RESET-COMPLETED-EVENTS\"]();   } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"if event-6-completed? [   set event-7-triggered? true   reset-completed-events ]","left":370,"top":340,"right":445,"bottom":373,"display":"7. release","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   if (world.observer.getGlobal(\"event-7-completed?\")) {     world.observer.setGlobal(\"event-8-triggered?\", true);     procedures[\"RESET-COMPLETED-EVENTS\"]();   } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"if event-7-completed? [   set event-8-triggered? true   reset-completed-events ]","left":280,"top":395,"right":365,"bottom":428,"display":"8. translate","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   if (world.observer.getGlobal(\"event-8-completed?\")) {     world.observer.setGlobal(\"event-9-triggered?\", true);     procedures[\"RESET-COMPLETED-EVENTS\"]();   } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"if event-8-completed? [   set event-9-triggered? true   reset-completed-events ]","left":365,"top":395,"right":445,"bottom":428,"display":"9. release","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"display":"DNA-->mRNA","left":336,"top":79,"right":426,"bottom":97,"fontSize":9,"color":103,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"mRNA-->protein","left":329,"top":382,"right":419,"bottom":400,"fontSize":9,"color":54,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"mRNA-->protein","left":331,"top":131,"right":424,"bottom":149,"fontSize":9,"color":103,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.turtleManager.turtlesOfBreed(\"PROTEINS\")._optimalCountWith(function() { return Prims.equality(SelfManager.self().getVariable(\"strand\"), \"original\"); })","source":"count proteins with [strand = \"original\"]","left":346,"top":30,"right":441,"bottom":71,"display":"proteins made","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"display":"DNA-->mRNA","left":334,"top":325,"right":421,"bottom":343,"fontSize":9,"color":54,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Original DNA in old cell","left":312,"top":12,"right":446,"bottom":40,"fontSize":11,"color":103,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"<--","left":272,"top":8,"right":322,"bottom":42,"fontSize":16,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"variable":"show-genes?","left":130,"top":245,"right":260,"bottom":278,"display":"show-genes?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_56 = procedures[\"SHOW-PROTEIN-PRODUCTION\"]();   if (_maybestop_33_56 instanceof Exception.StopInterrupt) { return _maybestop_33_56; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"show-protein-production","left":5,"top":395,"right":255,"bottom":428,"display":"10.  show protein production summary","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"display":" V","left":262,"top":195,"right":282,"bottom":216,"fontSize":16,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"| | | | | | | | | | |","left":270,"top":18,"right":285,"bottom":204,"fontSize":14,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"-->","left":274,"top":261,"right":317,"bottom":281,"fontSize":16,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"| ","left":270,"top":243,"right":285,"bottom":274,"fontSize":14,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"V","left":267,"top":256,"right":282,"bottom":276,"fontSize":16,"color":14,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_49 = procedures[\"NEXT-INSTRUCTION\"]();   if (_maybestop_33_49 instanceof Exception.StopInterrupt) { return _maybestop_33_49; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"next-instruction","left":145,"top":50,"right":255,"bottom":83,"display":"next instruction","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_53 = procedures[\"PREVIOUS-INSTRUCTION\"]();   if (_maybestop_33_53 instanceof Exception.StopInterrupt) { return _maybestop_33_53; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"previous-instruction","left":5,"top":50,"right":145,"bottom":83,"display":"previous instruction","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"CURRENT-INSTRUCTION-LABEL\"]()","source":"current-instruction-label","left":165,"top":10,"right":255,"bottom":51,"display":"instruction #","precision":17,"fontSize":10,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["initial-dna-string", "user-created-code", "#-nucleotides-affected", "mutation-type", "show-genes?", "current-instruction", "codon-to-amino-acid-key", "original-dna-string", "duplicate-dna-string", "duplicate-ribosome-ycor", "original-ribosome-ycor", "duplicate-dna-ycor", "original-dna-ycor", "nucleotide-spacing", "nucleo-tag-color", "terminator-color", "gene-color-counter", "original-strand-gene-counter", "duplicate-strand-gene-counter", "original-display-mrna-counter", "duplicate-display-mrna-counter", "mrnas-traveling", "mrnas-released", "replicate-dna-event?", "show-genes-event?", "event-1-triggered?", "event-2-triggered?", "event-3-triggered?", "event-4-triggered?", "event-6-triggered?", "event-7-triggered?", "event-8-triggered?", "event-9-triggered?", "event-1-completed?", "event-2-completed?", "event-3-completed?", "event-4-completed?", "event-6-completed?", "event-7-completed?", "event-8-completed?", "event-9-completed?"], ["initial-dna-string", "user-created-code", "#-nucleotides-affected", "mutation-type", "show-genes?"], [], 0, 30, -8, 7, 24, true, true, turtleShapes, linkShapes, function(){});
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
      Errors.askNobodyCheck(world.patches()).ask(function() { SelfManager.self().setPatchVariable("pcolor", (105 - 4)); }, true);
      Errors.askNobodyCheck(world.patches().agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("pycor"), 2); })).ask(function() { SelfManager.self().setPatchVariable("pcolor", (105 - 3.5)); }, true);
      Errors.askNobodyCheck(world.patches().agentFilter(function() { return Prims.lt(SelfManager.self().getPatchVariable("pycor"), 0); })).ask(function() { SelfManager.self().setPatchVariable("pcolor", (55 - 4)); }, true);
      Errors.askNobodyCheck(world.patches().agentFilter(function() { return Prims.lt(SelfManager.self().getPatchVariable("pycor"), -3); })).ask(function() { SelfManager.self().setPatchVariable("pcolor", (55 - 3.5)); }, true);
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
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupDnaString"] = temp;
  procs["SETUP-DNA-STRING"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      let dna = Prims.turtleSet(world.turtleManager.turtlesOfBreed("GENES"), world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS")); letVars['dna'] = dna;
      Errors.askNobodyCheck(dna.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
        if (Prims.equality(strandType, "original")) {
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("original-dna-ycor"));
        }
        if (Prims.equality(strandType, "duplicate")) {
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("duplicate-dna-ycor"));
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["placeDna"] = temp;
  procs["PLACE-DNA"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("TRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
        if (Prims.equality(strandType, "original")) {
          SelfManager.self().setVariable("ycor", (world.observer.getGlobal("original-ribosome-ycor") + 1));
        }
        if (Prims.equality(strandType, "duplicate")) {
          SelfManager.self().setVariable("ycor", (world.observer.getGlobal("duplicate-ribosome-ycor") + 1));
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
        for (let _index_8203_8209 = 0, _repeatcount_8203_8209 = StrictMath.floor(PrimChecks.list.length(dnaString)); _index_8203_8209 < _repeatcount_8203_8209; _index_8203_8209++){
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("NUCLEOTIDES"));
            SelfManager.self().setVariable("strand", strandType);
            SelfManager.self().setVariable("value", PrimChecks.list.item(placeCounter, dnaString));
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
      return Errors.stopInCommandCheck(e)
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
      let lastItemKept = PrimChecks.list.length(dnaString); letVars['lastItemKept'] = lastItemKept;
      for (let _index_8923_8929 = 0, _repeatcount_8923_8929 = StrictMath.floor(PrimChecks.list.length(dnaString)); _index_8923_8929 < _repeatcount_8923_8929; _index_8923_8929++){
        let firstItem = PrimChecks.list.item(0, remainingDna); letVars['firstItem'] = firstItem;
        remainingDna = PrimChecks.list.removeItem(0, remainingDna); letVars['remainingDna'] = remainingDna;
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
            SelfManager.self().setVariable("end-position", PrimChecks.list.length(world.observer.getGlobal("original-dna-string")));
            SelfManager.self().setVariable("code", (workspace.dump('') + workspace.dump(triplet) + workspace.dump(ListPrims.substring(dnaString, (itemPosition + 1), PrimChecks.list.length(dnaString)))));
          }, true);
        }
        itemPosition = (itemPosition + 1); letVars['itemPosition'] = itemPosition;
      }
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("GENES")).ask(function() {
        let endOfGene_p = false; letVars['endOfGene_p'] = endOfGene_p;
        let tripletCounter = 0; letVars['tripletCounter'] = tripletCounter;
        let newCode = SelfManager.self().getVariable("code"); letVars['newCode'] = newCode;
        for (let _index_9996_10002 = 0, _repeatcount_9996_10002 = StrictMath.floor(NLMath.floor(PrimChecks.math.div(PrimChecks.list.length(SelfManager.self().getVariable("code")), 3))); _index_9996_10002 < _repeatcount_9996_10002; _index_9996_10002++){
          let thisTriplet = (workspace.dump('') + workspace.dump(PrimChecks.list.item((0 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))) + workspace.dump(PrimChecks.list.item((1 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))) + workspace.dump(PrimChecks.list.item((2 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))); letVars['thisTriplet'] = thisTriplet;
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
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["buildGenesFromDna"] = temp;
  procs["BUILD-GENES-FROM-DNA"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("GENES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
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
            SelfManager.self().fd((PrimChecks.list.length(thisCode) * 0.45));
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
            for (let _index_12422_12428 = 0, _repeatcount_12422_12428 = StrictMath.floor(PrimChecks.list.length(SelfManager.self().getVariable("code"))); _index_12422_12428 < _repeatcount_12422_12428; _index_12422_12428++){
              SelfManager.self().hatch(1, "").ask(function() {
                SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES"));
                SelfManager.self().setVariable("value", PrimChecks.list.first(codeToTranscribe));
                SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("mrna-") + workspace.dump(SelfManager.self().getVariable("value"))));
                SelfManager.self().setVariable("heading", 180);
                procedures["ATTACH-TAG"](175,0.9,SelfManager.self().getVariable("value"),world.observer.getGlobal("nucleo-tag-color"));
                LinkPrims.createLinkFrom(thisMrna, "BACKBONES").ask(function() {
                  SelfManager.self().setVariable("hidden?", true);
                  SelfManager.self().setVariable("tie-mode", "fixed");
                  SelfManager.self().tie();
                }, true);
              }, true);
              codeToTranscribe = PrimChecks.list.removeItem(0, codeToTranscribe); letVars['codeToTranscribe'] = codeToTranscribe;
              SelfManager.self().fd(world.observer.getGlobal("nucleotide-spacing"));
            }
          }, true);
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["buildMrnaForEachGene"] = temp;
  procs["BUILD-MRNA-FOR-EACH-GENE"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("cap-type"), "start") && Prims.equality(SelfManager.self().getVariable("strand"), strandType));
      })).ask(function() {
        let numberOfTripletsInList = NLMath.floor(PrimChecks.math.div(PrimChecks.list.length(SelfManager.self().getVariable("code")), 3)); letVars['numberOfTripletsInList'] = numberOfTripletsInList;
        let thisTriplet = ""; letVars['thisTriplet'] = thisTriplet;
        let tripletCounter = 0; letVars['tripletCounter'] = tripletCounter;
        for (let _index_13127_13133 = 0, _repeatcount_13127_13133 = StrictMath.floor(numberOfTripletsInList); _index_13127_13133 < _repeatcount_13127_13133; _index_13127_13133++){
          thisTriplet = (workspace.dump('') + workspace.dump(procedures["COMPLEMENTARY-MRNA-BASE"](PrimChecks.list.item((0 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))) + workspace.dump(procedures["COMPLEMENTARY-MRNA-BASE"](PrimChecks.list.item((1 + (tripletCounter * 3)), SelfManager.self().getVariable("code")))) + workspace.dump(procedures["COMPLEMENTARY-MRNA-BASE"](PrimChecks.list.item((2 + (tripletCounter * 3)), SelfManager.self().getVariable("code"))))); letVars['thisTriplet'] = thisTriplet;
          procedures["BUILD-TRNA-FOR-THIS-TRIPLET"](thisTriplet,tripletCounter);
          tripletCounter = (tripletCounter + 1); letVars['tripletCounter'] = tripletCounter;
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
          SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("trna-") + workspace.dump(PrimChecks.list.item(0, thisTriplet))));
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
            SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("trna-") + workspace.dump(PrimChecks.list.item(1, thisTriplet))));
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
            SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("trna-") + workspace.dump(PrimChecks.list.item(2, thisTriplet))));
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
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["attachTag"] = temp;
  procs["ATTACH-TAG"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(Prims.turtleSet(world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS"))).ask(function() {
        Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("show-genes?")); }, true);
        SelfManager.self().setVariable("hidden?", !world.observer.getGlobal("show-genes?"));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["visualizeAllGenes"] = temp;
  procs["VISUALIZE-ALL-GENES"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(Prims.turtleSet(world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
        Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["hideGenes"] = temp;
  procs["HIDE-GENES"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(Prims.turtleSet(world.turtleManager.turtlesOfBreed("MRNAS"), world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
        Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["hideMrna"] = temp;
  procs["HIDE-MRNA"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(Prims.turtleSet(world.turtleManager.turtlesOfBreed("TRNAS"), world.turtleManager.turtlesOfBreed("TRNA-NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS")).agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
        Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        SelfManager.self().setVariable("hidden?", true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["hideTrna"] = temp;
  procs["HIDE-TRNA"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      let theseGenes = world.turtleManager.turtlesOfBreed("GENES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); }); letVars['theseGenes'] = theseGenes;
      if (theseGenes._optimalCheckCount(0, (a, b) => a === b)) {
        procedures["DISPLAY-USER-MESSAGE-NO-GENES"]();
      }
      if (Prims.equality(strandType, "original")) {
        world.observer.setGlobal("original-display-mrna-counter", (world.observer.getGlobal("original-display-mrna-counter") + 1));
        if (Prims.gt(world.observer.getGlobal("original-display-mrna-counter"), theseGenes.size())) {
          world.observer.setGlobal("original-display-mrna-counter", 1);
        }
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start"));
        })).ask(function() {
          if (!Prims.equality(SelfManager.self().getVariable("gene-number"), world.observer.getGlobal("original-display-mrna-counter"))) {
            Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("BACKBONES")).ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", true);
          }
          else {
            Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("BACKBONES")).ask(function() {
              SelfManager.self().setVariable("hidden?", false);
              Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
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
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start"));
        })).ask(function() {
          if (!Prims.equality(SelfManager.self().getVariable("gene-number"), world.observer.getGlobal("duplicate-display-mrna-counter"))) {
            Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("BACKBONES")).ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", true);
          }
          else {
            Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("BACKBONES")).ask(function() {
              SelfManager.self().setVariable("hidden?", false);
              Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", false);
          }
          SelfManager.self().setVariable("traveling?", false);
          SelfManager.self().setVariable("released?", false);
          SelfManager.self().setVariable("ycor", world.observer.getGlobal("duplicate-dna-ycor"));
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["showNextMrna"] = temp;
  procs["SHOW-NEXT-MRNA"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      let thisGeneNumber = procedures["GENE-NUMBER-FOR-THIS-STRAND"](strandType); letVars['thisGeneNumber'] = thisGeneNumber;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (((Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start")) && SelfManager.self().getVariable("released?")) && Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber));
      })).ask(function() {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("TRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
          if (Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber)) {
            Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("BACKBONES")).ask(function() {
              SelfManager.self().setVariable("hidden?", false);
              Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", false);
          }
          else {
            Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("BACKBONES")).ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
            }, true);
            SelfManager.self().setVariable("hidden?", true);
          }
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
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
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (((Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("cap-type"), "start")) && SelfManager.self().getVariable("released?")) && Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber));
      })).ask(function() {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("TRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
          if (Prims.equality(SelfManager.self().getVariable("gene-number"), thisGeneNumber)) {
            Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("BACKBONES")).ask(function() {
              makeProtein_p = true; letVars['makeProtein_p'] = makeProtein_p;
              SelfManager.self().setVariable("hidden?", true);
              if (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS"))) {
                SelfManager.self().setVariable("hidden?", false);
                Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
              }
              else {
                SelfManager.self().setVariable("hidden?", true);
                Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
              }
            }, true);
          }
          else {
            Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("BACKBONES")).ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
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
      return Errors.stopInCommandCheck(e)
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
        Errors.procedureArgumentsCheck(1, arguments.length);
        thisProteinValue = (workspace.dump('') + workspace.dump(thisProteinValue) + workspace.dump("-") + workspace.dump(theAminoAcid.projectionBy(function() { return SelfManager.self().getVariable("value"); }))); letVars['thisProteinValue'] = thisProteinValue;
      }, "[ the-amino-acid -> set this-protein-value word this-protein-value \"-\" [ value ] of the-amino-acid ]"), orderedAminoAcids); if(reporterContext && _foreach_19530_19537 !== undefined) { return _foreach_19530_19537; }
      if (!world.turtleManager.turtlesOfBreed("PROTEINS")._optimalAnyWith(function() {
        return (Prims.equality(SelfManager.self().getVariable("strand"), strandType) && Prims.equality(SelfManager.self().getVariable("value"), thisProteinValue));
      })) {
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("PROTEINS"));
          SelfManager.self().setVariable("value", thisProteinValue);
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().setXY(0, 0);
        }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeProtein"] = temp;
  procs["MAKE-PROTEIN"] = temp;
  temp = (function(strandType) {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), strandType); })).ask(function() {
        SelfManager.self().setVariable("traveling?", true);
        SelfManager.self().setVariable("released?", false);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MRNAS").agentFilter(function() {
        return (SelfManager.self().getVariable("traveling?") && Prims.equality(SelfManager.self().getVariable("cap-type"), "start"));
      })).ask(function() {
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
      return Errors.stopInCommandCheck(e)
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
      Errors.askNobodyCheck(originalProteins).ask(function() {
        OutputPrims.print((workspace.dump('') + workspace.dump("Orig.Gene #") + workspace.dump(SelfManager.self().getVariable("gene-number")) + workspace.dump(" > Protein:")));
        OutputPrims.print(SelfManager.self().getVariable("value"));
        OutputPrims.print("");
      }, true);
      OutputPrims.print("==================");
      let duplicateProteins = world.turtleManager.turtlesOfBreed("PROTEINS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), "duplicate"); }); letVars['duplicateProteins'] = duplicateProteins;
      OutputPrims.print("Proteins Produced");
      OutputPrims.print((workspace.dump('') + workspace.dump("from copy of DNA = ") + workspace.dump(duplicateProteins.size())));
      OutputPrims.print("::::::::::::::::::");
      Errors.askNobodyCheck(duplicateProteins).ask(function() {
        OutputPrims.print((workspace.dump('') + workspace.dump("Copy.Gene #") + workspace.dump(SelfManager.self().getVariable("gene-number")) + workspace.dump(" > Protein:")));
        OutputPrims.print(SelfManager.self().getVariable("value"));
        OutputPrims.print("");
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
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
      let targetLoci = PrimChecks.math.random((PrimChecks.list.length(mutatingCopyOfDnaString) - world.observer.getGlobal("#-nucleotides-affected"))); letVars['targetLoci'] = targetLoci;
      let dnaAtTarget = PrimChecks.list.item(targetLoci, mutatingCopyOfDnaString); letVars['dnaAtTarget'] = dnaAtTarget;
      let dnaBeforeTarget = ListPrims.substring(mutatingCopyOfDnaString, 0, targetLoci); letVars['dnaBeforeTarget'] = dnaBeforeTarget;
      let lociCounter = 0; letVars['lociCounter'] = lociCounter;
      let dnaAtAndAfterTarget = ListPrims.substring(mutatingCopyOfDnaString, targetLoci, PrimChecks.list.length(mutatingCopyOfDnaString)); letVars['dnaAtAndAfterTarget'] = dnaAtAndAfterTarget;
      if (Prims.equality(world.observer.getGlobal("mutation-type"), "deletion")) {
        for (let _index_24050_24056 = 0, _repeatcount_24050_24056 = StrictMath.floor(world.observer.getGlobal("#-nucleotides-affected")); _index_24050_24056 < _repeatcount_24050_24056; _index_24050_24056++){
          mutatingCopyOfDnaString = PrimChecks.list.removeItem(targetLoci, mutatingCopyOfDnaString); letVars['mutatingCopyOfDnaString'] = mutatingCopyOfDnaString;
        }
      }
      if (Prims.equality(world.observer.getGlobal("mutation-type"), "substitution")) {
        for (let _index_24236_24242 = 0, _repeatcount_24236_24242 = StrictMath.floor(world.observer.getGlobal("#-nucleotides-affected")); _index_24236_24242 < _repeatcount_24236_24242; _index_24236_24242++){
          mutatingCopyOfDnaString = PrimChecks.list.replaceItem((targetLoci + lociCounter), mutatingCopyOfDnaString, procedures["RANDOM-BASE-LETTER-DNA"]()); letVars['mutatingCopyOfDnaString'] = mutatingCopyOfDnaString;
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
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeDuplicateDnaString"] = temp;
  procs["MAKE-DUPLICATE-DNA-STRING"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let turtlesToRemove = Prims.turtleSet(world.turtleManager.turtlesOfBreed("NUCLEOTIDES"), world.turtleManager.turtlesOfBreed("MRNAS"), world.turtleManager.turtlesOfBreed("TRNAS"), world.turtleManager.turtlesOfBreed("GENES"), world.turtleManager.turtlesOfBreed("PROMOTERS"), world.turtleManager.turtlesOfBreed("TERMINATORS"), world.turtleManager.turtlesOfBreed("AMINO-ACIDS"), world.turtleManager.turtlesOfBreed("MRNA-NUCLEOTIDES")); letVars['turtlesToRemove'] = turtlesToRemove;
      Errors.askNobodyCheck(turtlesToRemove.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("strand"), "duplicate"); })).ask(function() {
        Errors.askNobodyCheck(LinkPrims.linkNeighbors("TAGLINES")).ask(function() { SelfManager.self().die(); }, true);
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
      return Errors.stopInCommandCheck(e)
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
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["initializeCodonToAminoAcidKey"] = temp;
  procs["INITIALIZE-CODON-TO-AMINO-ACID-KEY"] = temp;
  temp = (function(thisCodon) {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.list.item(1, PrimChecks.list.item(0, PrimChecks.list.filter(Tasks.reporterTask(function(pair) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        return Prims.equality(PrimChecks.list.first(pair), thisCodon);
      }, "[ pair -> first pair = this-codon ]"), world.observer.getGlobal("codon-to-amino-acid-key"))));
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["whichProteinForThisCodon"] = temp;
  procs["WHICH-PROTEIN-FOR-THIS-CODON"] = temp;
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
      Errors.reportInContextCheck(reporterContext);
      return baseToReport;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["complementaryMrnaBase"] = temp;
  procs["COMPLEMENTARY-MRNA-BASE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.gte(world.observer.getGlobal("gene-color-counter"), (PrimChecks.list.length(ColorModel.BASE_COLORS) - 1))) {
        world.observer.setGlobal("gene-color-counter", 0);
      }
      else {
        world.observer.setGlobal("gene-color-counter", (world.observer.getGlobal("gene-color-counter") + 1));
      }
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.list.item(world.observer.getGlobal("gene-color-counter"), ColorModel.BASE_COLORS);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
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
      Errors.reportInContextCheck(reporterContext);
      return thisGeneNumber;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
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
      for (let _index_28754_28760 = 0, _repeatcount_28754_28760 = StrictMath.floor(PrimChecks.list.length(dnaString)); _index_28754_28760 < _repeatcount_28754_28760; _index_28754_28760++){
        newString = PrimChecks.list.replaceItem(nextItem, newString, procedures["COMPLEMENTARY-MRNA-BASE"](PrimChecks.list.item(nextItem, newString))); letVars['newString'] = newString;
        nextItem = (nextItem + 1); letVars['nextItem'] = nextItem;
      }
      Errors.reportInContextCheck(reporterContext);
      return newString;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
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
      for (let _index_29220_29226 = 0, _repeatcount_29220_29226 = StrictMath.floor(PrimChecks.list.length(dnaString)); _index_29220_29226 < _repeatcount_29220_29226; _index_29220_29226++){
        newString = PrimChecks.list.replaceItem(nextItem, newString, procedures["REPLACE-NON-NUCLEOTIDE-CHARACTER"](PrimChecks.list.item(nextItem, newString))); letVars['newString'] = newString;
        nextItem = (nextItem + 1); letVars['nextItem'] = nextItem;
      }
      if (Prims.gt(PrimChecks.list.length(dnaString), 64)) {
        newString = ListPrims.substring(newString, 0, 64); letVars['newString'] = newString;
      }
      Errors.reportInContextCheck(reporterContext);
      return newString;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
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
      Errors.reportInContextCheck(reporterContext);
      return characterToReturn;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["replaceNonNucleotideCharacter"] = temp;
  procs["REPLACE-NON-NUCLEOTIDE-CHARACTER"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return (Prims.ifElseValueBooleanCheck(Prims.equality(world.observer.getGlobal("current-instruction"), 0)) ? "press setup" : (workspace.dump('') + workspace.dump(world.observer.getGlobal("current-instruction")) + workspace.dump(" of ") + workspace.dump(PrimChecks.list.length(procedures["INSTRUCTIONS"]()))));
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
        var _foreach_30596_30603 = Tasks.forEach(Tasks.commandTask(function(_0) {
          Errors.procedureArgumentsCheck(1, arguments.length);
          OutputPrims.print(_0);
        }, "output-print"), PrimChecks.list.item((world.observer.getGlobal("current-instruction") - 1), procedures["INSTRUCTIONS"]())); if(reporterContext && _foreach_30596_30603 !== undefined) { return _foreach_30596_30603; }
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
      return [["You will be simulating the process", "of protein synthesis from DNA that", "occurs in every cell.  And you will", "explore the effects of mutations", "on the proteins that are produced."], ["When you press SETUP, a single", "strand of an unwound DNA molecule", "appears. This represents the state", "of DNA in the cell nucleus during", "transcription."], ["To produce proteins, each gene in", "the original DNA strand must be", "transcribed  into an mRNA molecule.", "Do this by pressing GO/STOP and", "then the 1-TRANSCRIBE button."], ["For each mRNA molecule that was", "transcribed, press the 2-RELEASE", "button.  This releases the mRNA", "from the nucleus  into the ribosome", "of the cell."], ["For each mRNA molecule in the", "ribosome, press the 3-TRANSLATE", "button.  This pairs up molecules", "of tRNA with each set of three", "nucleotides in the mRNA molecule."], ["For each tRNA chain built, press", "the 4-RELEASE button.  This", "releases the amino acid chain", "from the rest of the tRNA chain,", "leaving behind the protein", "molecule that is produced."], ["Each time the 1-TRANSCRIBE", "button is pressed, the next gene", "in the original strand of DNA ", "will be transcribed.  Press the 1-,", "2-, 3-, 4- buttons and repeat to", "translate each subsequent gene."], ["When you press the 5-REPLICATE", "THE ORIGINAL DNA button a copy", "of the original DNA will be ", "generated for a new cell", "(as in mitosis or meiosis) and", "it will appear in the green."], ["The replicated DNA will have a", "# of random mutations, set by", "#-NUCLEOTIDES-AFFECTED, each", "mutation of the type set by", "MUTATION-TYPE. Press button 5)", "again to explore possible outcomes."], ["Now repeat the same transcription,", "release, translation, and release", "process for the DNA in this new", "cell by pressing 6-, 7-, 8-, 9-.", "Repeat that sequence again to", "cycle through to the next gene."], ["If you want to test the outcomes", "for your own DNA code, type any", "sequence of A, G, T, C in the", "USER-CREATED-CODE box and set", "the INITIAL-DNA-STRING to", "“from-user-code”.  Then press", "SETUP and start over again."]];
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
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
      return Errors.stopInCommandCheck(e)
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