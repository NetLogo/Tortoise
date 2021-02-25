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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"add divider":{"name":"add divider","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[0,45,150,255,300,150],"ycors":[180,225,135,240,195,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cell-gamete-female":{"name":"cell-gamete-female","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,300,300],"ycors":[210,210,150],"type":"polygon","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false}]},"cell-gamete-male":{"name":"cell-gamete-male","editableColorIndex":13,"rotate":false,"elements":[{"xcors":[150,150,300],"ycors":[150,210,150],"type":"polygon","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false}]},"cell-somatic":{"name":"cell-somatic","editableColorIndex":0,"rotate":false,"elements":[{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish-body":{"name":"fish-body","editableColorIndex":11,"rotate":false,"elements":[{"xcors":[15,151,226,280,292,292,287,270,195,151,15],"ycors":[135,92,96,134,161,175,185,210,225,227,165],"type":"polygon","color":"rgba(124, 80, 164, 1)","filled":true,"marked":true},{"x":236,"y":125,"diam":34,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":256,"y1":143,"x2":264,"y2":132,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":false}]},"fish-bones":{"name":"fish-bones","editableColorIndex":15,"rotate":false,"elements":[{"xmin":45,"ymin":150,"xmax":210,"ymax":165,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"xcors":[210,210,270,240,285,285,270,225,195,210],"ycors":[180,210,195,180,165,150,120,90,135,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":236,"y":110,"diam":34,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":180,"y1":90,"x2":195,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":true},{"x1":150,"y1":90,"x2":180,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":true},{"x1":120,"y1":105,"x2":150,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":true},{"x1":90,"y1":120,"x2":120,"y2":195,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":true},{"x1":60,"y1":135,"x2":75,"y2":180,"type":"line","color":"rgba(255, 255, 255, 1)","filled":false,"marked":true}]},"fish-fins":{"name":"fish-fins","editableColorIndex":2,"rotate":false,"elements":[{"xcors":[45,75,71,75,165,120],"ycors":[0,45,103,120,105,30],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":true},{"xcors":[75,45,90,105,135],"ycors":[180,240,225,270,210],"type":"polygon","color":"rgba(241, 106, 21, 1)","filled":true,"marked":true}]},"fish-forked-tail":{"name":"fish-forked-tail","editableColorIndex":5,"rotate":false,"elements":[{"xcors":[150,105,45,75,105,75,45,105,150],"ycors":[135,75,0,90,150,195,300,225,165],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":true}]},"fish-no-forked-tail":{"name":"fish-no-forked-tail","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[150,120,75,60,60,60,75,120,150],"ycors":[135,60,0,75,150,210,300,240,165],"type":"polygon","color":"rgba(215, 50, 41, 1)","filled":true,"marked":true}]},"fish-spots":{"name":"fish-spots","editableColorIndex":15,"rotate":false,"elements":[{"x":84,"y":129,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":66,"y":161,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":92,"y":162,"diam":22,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":114,"y":99,"diam":24,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":39,"y":129,"diam":24,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true},{"x":129,"y":144,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true}]},"fish-ventral-fin":{"name":"fish-ventral-fin","editableColorIndex":11,"rotate":false,"elements":[{"xcors":[60,15,75,90,150],"ycors":[180,240,225,270,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":false}]},"gene-1":{"name":"gene-1","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":165,"type":"rectangle","color":"rgba(84, 196, 196, 1)","filled":true,"marked":false},{"xmin":135,"ymin":105,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true}]},"gene-2":{"name":"gene-2","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(237, 237, 49, 1)","filled":true,"marked":false},{"xmin":135,"ymin":90,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true}]},"gene-3":{"name":"gene-3","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(224, 127, 150, 1)","filled":true,"marked":false},{"xmin":135,"ymin":75,"xmax":150,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true}]},"gene-4":{"name":"gene-4","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(44, 209, 59, 1)","filled":true,"marked":false},{"xmin":135,"ymin":105,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true}]},"gene-5":{"name":"gene-5","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true}]},"gene-y":{"name":"gene-y","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":true}]},"heart":{"name":"heart","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[60,60,90,120,150,165],"ycors":[105,135,180,210,225,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":60,"diam":90,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":150,"y":60,"diam":90,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[240,240,210,180,150,150],"ycors":[105,135,180,210,225,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"none":{"name":"none","editableColorIndex":0,"rotate":true,"elements":[]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"sheep":{"name":"sheep","editableColorIndex":0,"rotate":false,"elements":[{"xmin":151,"ymin":225,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":47,"ymin":225,"xmax":75,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":15,"ymin":75,"xmax":210,"ymax":225,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":135,"y":75,"diam":150,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":165,"y":76,"diam":116,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":15,"ymin":15,"xmax":285,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"subtract divider":{"name":"subtract divider","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[0,45,150,255,300,150],"ycors":[120,75,165,60,105,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [(function() {
  var name    = 'Tail Shape Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-F', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Tail Shape Alleles', 'big-F')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-f-alleles"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('small-f', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Tail Shape Alleles', 'small-f')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-f-alleles"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Tail Color Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-T', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Tail Color Alleles', 'big-T')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-t-alleles"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('small-t', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Tail Color Alleles', 'small-t')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-t-alleles"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Dorsal Fin Color Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-G', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'big-G')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-g-alleles"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('small-g', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'small-g')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-g-alleles"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Sex Chromosomes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('X', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Sex Chromosomes', 'X')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-x-chromosomes"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('Y', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Sex Chromosomes', 'Y')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-y-chromosomes"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'dorsal fin & spotting variations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('spots', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'spots')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-spots"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('no spots', plotOps.makePenOps, false, new PenBundle.State(6, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no spots')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-spots"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('green dorsal', plotOps.makePenOps, false, new PenBundle.State(67, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'green dorsal')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-green-dorsal-fins"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('no green', plotOps.makePenOps, false, new PenBundle.State(96, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no green')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-green-dorsal-fins"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Body Spot Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-B', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Body Spot Alleles', 'big-B')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-b-alleles"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('small-b', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Body Spot Alleles', 'small-b')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-b-alleles"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# alleles", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'tail fin variations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('forked tail', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tail fin variations', 'forked tail')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-forked-tails"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('no fork', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tail fin variations', 'no fork')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-forked-tails"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('yellow tail', plotOps.makePenOps, false, new PenBundle.State(44, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tail fin variations', 'yellow tail')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-yellow-tail-fins"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('no yellow', plotOps.makePenOps, false, new PenBundle.State(95, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tail fin variations', 'no yellow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-yellow-tail-fins"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = '# of males & females';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('females', plotOps.makePenOps, false, new PenBundle.State(134, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('# of males & females', 'females')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-females"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  }),
  new PenBundle.Pen('males', plotOps.makePenOps, false, new PenBundle.State(96, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('# of males & females', 'males')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-males"));
        } catch (e) {
          return Errors.stopInCommandCheck(e)
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "fish", singular: "a-fish", varNames: ["sex", "bearing"] }, { name: "fish-parts", singular: "a-fish-part", varNames: [] }, { name: "somatic-cells", singular: "somatic-cell", varNames: ["sex"] }, { name: "gamete-cells", singular: "gamete-cell", varNames: ["sex"] }, { name: "alleles", singular: "allele", varNames: ["gene", "value", "owned-by-fish?", "side"] }, { name: "fish-bones", singular: "a-fish-bones", varNames: ["countdown"] }, { name: "fish-zygotes", singular: "a-fish-zygote", varNames: [] }, { name: "mouse-cursors", singular: "mouse-cursor", varNames: [] }])([], [])('breed [fish a-fish]  ;; fish parts include fins, tails, and spots - all of ;; which are tied and attached to the main fish body breed [fish-parts a-fish-part]  ;; fish are tied to somatic-cells.  Fish are what ;; wander about (the body of the organism), ;; while the somatic cell contains all the ;; genetic information of the organism breed [somatic-cells somatic-cell]  ;; sex cells that are hatched from somatic cells ;; through a simplified form of meiosis breed [gamete-cells gamete-cell]  ;; alleles are tied to somatic cells or gamete ;; cells - 1 allele is assigned to one chromosome breed [alleles allele]  breed [fish-bones a-fish-bones]     ;; used for visualization of fish death breed [fish-zygotes a-fish-zygote]  ;; used for visualization of a fish mating event  ;; used for visualization of different types of mouse actions the user can do in the ;; fish tank - namely removing fish and adding/subtracting dividers breed [mouse-cursors mouse-cursor]  fish-own          [sex bearing] somatic-cells-own [sex] gamete-cells-own  [sex] fish-bones-own    [countdown] alleles-own       [gene value owned-by-fish? side]  patches-own [type-of-patch divider-here?]  globals [    ;; for keeping track of the # of alleles of each type   #-big-B-alleles  #-small-b-alleles   #-big-T-alleles  #-small-t-alleles   #-big-F-alleles  #-small-f-alleles   #-big-G-alleles  #-small-g-alleles   #-y-chromosomes  #-x-chromosomes    ;; globals for keeping track of default values for   ;; shapes and colors used for phenotypes   water-color   green-dorsal-fin-color  no-green-dorsal-fin-color   yellow-tail-fin-color   no-yellow-tail-fin-color   male-color              female-color   spots-shape             no-spots-shape   forked-tail-shape       no-forked-tail-shape    ;;  globals for keeping track of phenotypes   #-of-green-dorsal-fins  #-of-no-green-dorsal-fins   #-of-yellow-tail-fins   #-of-no-yellow-tail-fins   #-of-spots              #-of-no-spots   #-of-forked-tails       #-of-no-forked-tails   #-of-males              #-of-females    ;; keeps track of whether the mouse button was down on last tick   mouse-continuous-down?    num-fish-removed   num-fish-born   num-fish-in-tank   fish-forward-step      ;; size of movement steps each tick   gamete-forward-step    ;; size of movement steps each tick    ;; used for spacing the chromosomes out in the   ;; karyotypes of the somatic cells and gametes   intra-chromosome-pair-spacing   inter-chromosome-pair-spacing    size-of-karyotype-background-for-cells    initial-#-females   initial-#-males ]  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;; setup procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to setup   clear-all   set mouse-continuous-down? false   set intra-chromosome-pair-spacing 0.20   set inter-chromosome-pair-spacing 0.55   set fish-forward-step 0.04   set num-fish-removed 0   set num-fish-born 0   set num-fish-in-tank 0    ;; the size of the large pink rectangle used as the   ;; background for the cell or karyotype of the cell   set size-of-karyotype-background-for-cells 5.2    set initial-#-females (floor ((initial-females / 100) * carrying-capacity))   set initial-#-males carrying-capacity - initial-#-females    set green-dorsal-fin-color    [90 255 90 255]   set no-green-dorsal-fin-color [176 196 222 255]   set yellow-tail-fin-color     [255 255 0 255]   set no-yellow-tail-fin-color  [176 196 255 255]   set female-color              [255 150 150 255]   set male-color                [150 150 255 255]   set water-color               blue - 1.5    set spots-shape                 \"fish-spots\"   set no-spots-shape              \"none\"   set forked-tail-shape           \"fish-forked-tail\"   set no-forked-tail-shape        \"fish-no-forked-tail\"   set-default-shape fish          \"fish-body\"   set-default-shape somatic-cells \"cell-somatic\"   set-default-shape fish-bones    \"fish-bones\"    create-mouse-cursors 1 [     set shape \"x\"     set hidden? true     set color red     set heading 0   ]    set-tank-regions   create-initial-gene-pool   create-initial-fish   visualize-tank   visualize-fish-and-alleles   reset-ticks end   to set-tank-regions   let min-pycor-edge min-pycor  let max-pycor-edge max-pycor   let water-patches nobody   ask patches [     set divider-here? false     set type-of-patch \"water\"     ;; water edge are the patches right up against the tank wall on the inside of the     ;; tank - they are used to determine whether to turn the fish around as they are     ;; moving about the tank     if pycor =  (max-pycor-edge - 2) or       pycor = (min-pycor-edge + 2) or       pxcor = left-side-of-water-in-tank or       pxcor = right-side-of-water-in-tank [       set type-of-patch \"water-edge\"     ]     if pycor >= (max-pycor-edge - 1) [       set type-of-patch \"air\"     ]     if pxcor <= (left-side-of-water-in-tank - 1) or       pxcor >= (right-side-of-water-in-tank + 1) or       pycor <= (min-pycor-edge + 1) [       set type-of-patch \"tank-wall\"     ]     if pycor = (max-pycor-edge) or       pycor = (min-pycor-edge) or       pxcor = (left-side-of-water-in-tank - 2) or       pxcor >= (right-side-of-water-in-tank + 2) [       set type-of-patch \"air\"     ]   ]   set water-patches  patches with [type-of-patch = \"water\"] end   to create-initial-gene-pool   let num-big-alleles 0   let initial-number-fish (carrying-capacity)    set num-big-alleles  round ((initial-alleles-big-b * 2 *  initial-number-fish) / 100)   make-initial-alleles-for-gene 1 \"B\" \"b\" num-big-alleles   set num-big-alleles  round ((initial-alleles-big-t * 2 *  initial-number-fish) / 100)   make-initial-alleles-for-gene 2 \"T\" \"t\" num-big-alleles   set num-big-alleles  round ((initial-alleles-big-f * 2 *  initial-number-fish) / 100)   make-initial-alleles-for-gene 3 \"F\" \"f\" num-big-alleles   set num-big-alleles  round ((initial-alleles-big-g * 2 *  initial-number-fish) / 100)   make-initial-alleles-for-gene 4 \"G\" \"g\" num-big-alleles    make-initial-alleles-for-gene 5 \"Y\" \"X\" initial-#-males end   to create-initial-fish   ;; makes the cells for the initial fish   create-somatic-cells initial-#-males [set sex \"male\"]   create-somatic-cells initial-#-females [set sex \"female\"]   ask somatic-cells [setup-new-somatic-cell-attributes]   ;; randomly sorts out the gene pool to each somatic cell   distribute-gene-pool-to-somatic-cells   ;; grows the body parts from the resulting genotype, and distributes the fish   ask somatic-cells [grow-fish-parts-from-somatic-cell]   distribute-fish-in-tank end   to setup-new-somatic-cell-attributes   ;; somatic cells are the same as body cells - they are the rectangle shape that is   ;; tied to the fish and chromosomes that looks like a karyotype   set heading 0   set breed somatic-cells   set color [100 100 100 100]   set size size-of-karyotype-background-for-cells   set hidden? true end   to distribute-fish-in-tank    let water-patches patches with [type-of-patch = \"water\"]    let water-patch nobody    ask fish [      move-to one-of water-patches    ] end   to make-initial-alleles-for-gene [gene-number allele-1 allele-2 num-big-alleles ]   let initial-number-fish initial-#-males + initial-#-females   create-alleles 2 * (initial-number-fish) [     set gene gene-number     set shape (word \"gene-\" gene-number)     set heading 0     set owned-by-fish? false     set value allele-2     set color  [0 0 0 255]     set label-color color     set label (word value \"     \" )   ]   ;; after coloring all the alleles with black band on chromosomes with the   ;; dominant allele label, now go back and select the correct proportion of   ;; these to recolor code as recessive alleles with white bands on chromosomes   ;; and add recessive letter label   ask n-of num-big-alleles  alleles with [gene = gene-number] [     set value allele-1     set color [220 220 220 255]     set label (word value \"     \" )     set label-color color     ] end    to distribute-gene-pool-to-somatic-cells   ;; randomly selects some chromosomes for this cell   let this-somatic-cell nobody   let last-sex-allele \"\"    ask somatic-cells [     set this-somatic-cell self     foreach [ 1 2 3 4 ] [ n ->       ;; assign one of the alleles to appear on the left side of the chromosome pair       position-and-link-alleles self n \"left\"       ;; assign the other allele to appear on the right side       position-and-link-alleles self n \"right\"     ]      ;; now assign the sex chromosome pair, putting one of the Xs on the left,     ;; and the other chromosome (whether it is an X or } on the right     ask one-of alleles with [not owned-by-fish? and gene = 5 and value = \"X\"] [        set owned-by-fish? true        set size 1.2        set xcor ((inter-chromosome-pair-spacing * 4) + .1)        set ycor -0.4        set side \"left\"        create-link-from this-somatic-cell  [          set hidden? true          set tie-mode \"fixed\"          tie        ]     ]     ifelse sex = \"male\" [ set last-sex-allele \"Y\" ] [ set last-sex-allele \"X\" ]     ask one-of alleles with [       not owned-by-fish? and gene = 5 and value = last-sex-allele     ] [       set owned-by-fish? true       set size 1.2       set xcor ((inter-chromosome-pair-spacing * 4) + intra-chromosome-pair-spacing + .1)       set ycor -0.4       set side \"right\"       create-link-from this-somatic-cell [         set hidden? true         set tie-mode \"fixed\"         tie       ]     ]   ] end   to position-and-link-alleles [this-somatic-cell gene-number which-side]   let pair-shift-right 0   let side-shift 0    ;; adjusts the spacing between chromosome pairs (1-4( so that one of each pair   ;; is moved to the left and one of each pair is moved to the right   ifelse which-side = \"right\"     [ set side-shift intra-chromosome-pair-spacing ]     [ set side-shift 0 ]   set pair-shift-right ((inter-chromosome-pair-spacing * gene-number) - .45)    ask one-of alleles with [not owned-by-fish? and gene = gene-number] [     set owned-by-fish? true     set side which-side     set size 1.2     set xcor ([xcor] of this-somatic-cell + (pair-shift-right + side-shift))     set ycor ([ycor] of this-somatic-cell - 0.4)     create-link-from this-somatic-cell [       set hidden? true       set tie-mode \"fixed\"       tie     ]   ] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;; runtime-procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to go    wander    update-statistics    detect-fish-outside-the-water    detect-and-move-fish-at-inside-tank-boundary    auto-selection    clean-up-fish-bones    if auto-replace? [find-potential-mates]    move-gametes-together    convert-zygote-into-somatic-cell    detect-mouse-selection-event    visualize-fish-and-alleles     visualize-tank    tick end   to auto-selection   if auto-replace? [     ;; use EVERY to limit the rate of selection     ;; to slow things down for visualization purposes     every 0.25 [       ;;let under-carrying-capacity carrying-capacity -  num-fish-in-tank       if any? fish [         ask one-of fish [           if both-sexes-in-this-fishs-tank-region? [             remove-this-fish           ]         ]       ]     ]   ] end    to move-gametes-together   ;; moves the male sex cell (gamete) toward its target   ;; female sex cell it will fertilize (zygote).   let my-zygote nobody   let distance-to-zygote 0   ;; if the user as the see-sex-cells? switch on then slow down their motion   ifelse see-sex-cells? [ set gamete-forward-step 0.08] [ set gamete-forward-step 1]     ask gamete-cells [      set my-zygote one-of fish-zygotes with [in-link-neighbor? myself]      set distance-to-zygote distance my-zygote      if distance-to-zygote > 0       [ face my-zygote         ifelse distance-to-zygote > gamete-forward-step [fd gamete-forward-step ] [fd distance-to-zygote]         set heading 0       ]    ] end   to convert-zygote-into-somatic-cell   ;; upon arriving at the female sex cell the male sex cell will fertilize   ;; it and disappear the zygote (shown as a heart) will convert into a   ;; somatic cell and a fish will immediately appear (skipping the time   ;; it takes for the embryo to form)   let female-sex-cell-alleles nobody   let male-sex-cell-alleles nobody   let male-gamete nobody   let female-gamete nobody   let this-somatic-cell nobody    ask fish-zygotes [    set male-gamete gamete-cells with [out-link-neighbor? myself and sex = \"male\"]    set female-gamete gamete-cells with [out-link-neighbor? myself and sex = \"female\"]    if any? male-gamete and any? female-gamete [      if distance one-of male-gamete <= .01 and distance one-of female-gamete <= .01  [        ;; close enough for fertilization to be complete        setup-new-somatic-cell-attributes        set this-somatic-cell self        ask male-gamete [          set male-sex-cell-alleles alleles-that-belong-to-this-gamete          die        ]        ask female-gamete [          set female-sex-cell-alleles alleles-that-belong-to-this-gamete          die        ]        ask male-sex-cell-alleles [          create-link-from this-somatic-cell [            set hidden? true            set tie-mode \"fixed\"            tie          ]        ]        ask female-sex-cell-alleles [          create-link-from this-somatic-cell [            set hidden? true            set tie-mode \"fixed\"            tie          ]        ]        align-alleles-for-this-somatic-cell this-somatic-cell        set sex sex-phenotype        grow-fish-parts-from-somatic-cell        set num-fish-born num-fish-born + 1      ]    ]  ] end   to align-alleles-for-this-somatic-cell [this-zygote]   ;; when gametes merge they may both have chromosomes on the right   ;; (for each matching pair) or both on the left   ;; this procedure moves one of them over if that is the case   let all-alleles alleles with [in-link-neighbor? this-zygote]   foreach [1 2 3 4 5] [ this-gene ->     if count all-alleles with [gene = this-gene and side = \"left\"]  > 1 [       ask one-of all-alleles with [gene = this-gene] [         set heading 90         forward intra-chromosome-pair-spacing         set side \"right\"       ]     ]     if count all-alleles with [gene = this-gene and side = \"right\"] > 1 [       ask one-of all-alleles with [gene = this-gene] [         set heading 90         back         intra-chromosome-pair-spacing         set side \"left\"       ]     ]   ] end   to find-potential-mates   let mom nobody   let dad nobody   let xcor-dad 0   let turtles-in-this-region nobody   let potential-mates nobody   let all-fish-and-fish-zygotes nobody    if any? somatic-cells with [sex = \"male\"] [     ask one-of somatic-cells with [ sex = \"male\" ] [       set dad self       set xcor-dad xcor     ]     ask dad [       ;; if  parent genetic information for sexual reproduction       ;; still exists in the gene pool in this region       set turtles-in-this-region other-turtles-in-this-turtles-tank-region     ]     set all-fish-and-fish-zygotes turtles-in-this-region with [       breed = fish or breed = fish-zygotes     ]     set potential-mates turtles-in-this-region with [       breed = somatic-cells and sex = \"female\"     ]     if any? potential-mates [        ask one-of potential-mates  [ set mom self ]        ;;; only reproduce up to the carrying capacity in this region allowed        let this-carrying-capacity  carrying-capacity-in-this-region xcor-dad        if count all-fish-and-fish-zygotes < this-carrying-capacity [          reproduce-offspring-from-these-two-parents mom dad        ]     ]   ] end   to reproduce-offspring-from-these-two-parents [mom dad]   let child nobody     ask mom [       hatch 1 [        set heading 0        set breed fish-zygotes        set size 1        set shape \"heart\"        set color red        set child self       ]      ]     ask mom [ link-alleles-to-gametes-and-gametes-to-zygote child ]     ask dad [ link-alleles-to-gametes-and-gametes-to-zygote child ] end   to link-alleles-to-gametes-and-gametes-to-zygote [child]   let this-new-gamete-cell nobody   hatch 1 [     set breed gamete-cells     set heading 0     create-link-to child [set hidden? false] ;; link these gametes to the child     ifelse sex = \"male\"       [set shape \"cell-gamete-male\"]       [set shape \"cell-gamete-female\"]         set this-new-gamete-cell self     ]    foreach [1 2 3 4 5] [ this-gene ->     ask n-of 1 alleles with [in-link-neighbor? myself and  gene = this-gene]     [hatch 1 [set owned-by-fish? false        create-link-from this-new-gamete-cell  [set hidden? true  set tie-mode \"fixed\" tie]       ]     ]   ]  end   to wander   ask fish [     set heading bearing     rt random-float 70 lt random-float 70     set bearing heading     fd fish-forward-step     set heading 0     ]   ask somatic-cells [set heading 0] end    to detect-fish-outside-the-water      ask fish with [type-of-patch != \"water\" and type-of-patch != \"water-edge\"] [  remove-this-fish  ] end   to detect-and-move-fish-at-inside-tank-boundary    let nearest-water-patch nobody    let water-patches patches with [type-of-patch = \"water\" and not divider-here?]    ask fish [     set nearest-water-patch  min-one-of water-patches [distance myself]     if type-of-patch = \"tank-wall\" or type-of-patch = \"water-edge\"   [       set heading towards nearest-water-patch       fd fish-forward-step * 2       set heading 0       set bearing  random-float 360     ]     if divider-here? [move-to nearest-water-patch]    ] end   to clean-up-fish-bones   let bone-transparency 0   let color-list []    ask fish-bones [  ;;; fade away progressively the fish bone shape until the countdown in complete      set countdown countdown - 1      set bone-transparency (countdown * 255 / 50)      set color-list lput bone-transparency [255 255 255]      set color color-list      if countdown <= 0 [die]    ] end   to remove-this-fish  set num-fish-removed num-fish-removed + 1  hatch 1 [    ;; make the fish bones for visualization of this fishes death    set breed fish-bones    set color white    set countdown 25  ]  ask out-link-neighbors [    ;; ask the somatic cells and the fish-parts and the alleles attached to this fish to die first    ask out-link-neighbors [ die ]    die  ]  die end   to detect-mouse-selection-event    let p-mouse-xcor mouse-xcor   let p-mouse-ycor mouse-ycor   let p-type-of-patch [type-of-patch] of patch p-mouse-xcor p-mouse-ycor   let mouse-was-just-down? mouse-down?    ask mouse-cursors [     setxy p-mouse-xcor p-mouse-ycor     ;;;;;;  cursor visualization ;;;;;;;;;;;;     if (p-type-of-patch = \"water\") [       set hidden? false       set shape \"x\"       set label-color white       set label \"remove fish\"     ]     if divider-here? and p-type-of-patch = \"tank-wall\" [       set hidden? false       set shape \"subtract divider\"       set label-color white       set label \"remove divider\"     ]     if not divider-here? and p-type-of-patch = \"tank-wall\" [       set hidden? false       set shape \"add divider\"       set label-color white       set label \"add divider\"     ]     if (p-type-of-patch != \"water\" and p-type-of-patch != \"tank-wall\") [       set hidden? true       set shape \"x\"       set label \"\"     ]     ;;;;; cursor actions ;;;;;;;;;;;;;;;     if mouse-was-just-down? [       ask fish-here [remove-this-fish]     ]     if (mouse-was-just-down? and       not mouse-continuous-down? and       p-type-of-patch = \"tank-wall\" and       pycor = (min-pycor + 1) and       pxcor > (min-pxcor + 1) and       pxcor < (max-pxcor - 1)) [       set divider-here? not divider-here?       let divider-xcor pxcor       ask patches with [         (type-of-patch = \"water\" or type-of-patch = \"water-edge\") and         pxcor = divider-xcor       ] [         set divider-here? not divider-here?       ]     ]     ifelse not mouse-inside? [set hidden? true][set hidden? false]   ]    ifelse mouse-was-just-down?     [ set mouse-continuous-down? true ]     [ set mouse-continuous-down? false ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;; calculate statistics procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to update-statistics   set num-fish-in-tank (count fish )    set #-big-B-alleles   count alleles with [value = \"B\"]   set #-small-b-alleles count alleles with [value = \"b\"]   set #-big-T-alleles   count alleles with [value = \"T\"]   set #-small-t-alleles count alleles with [value = \"t\"]   set #-big-F-alleles   count alleles with [value = \"F\"]   set #-small-f-alleles count alleles with [value = \"f\"]   set #-big-G-alleles   count alleles with [value = \"G\"]   set #-small-g-alleles count alleles with [value = \"g\"]   set #-y-chromosomes   count alleles with [value = \"Y\"]   set #-x-chromosomes   count alleles with [value = \"X\"]    set #-of-green-dorsal-fins     count fish-parts with [color = green-dorsal-fin-color]   set #-of-no-green-dorsal-fins  count fish-parts with [color = no-green-dorsal-fin-color]   set #-of-yellow-tail-fins      count fish-parts with [color = yellow-tail-fin-color]   set #-of-no-yellow-tail-fins   count fish-parts with [color = no-yellow-tail-fin-color]   set #-of-spots               count fish-parts with [shape = spots-shape and hidden? = false]   set #-of-no-spots            count fish-parts with [shape = spots-shape and hidden? = true]   set #-of-forked-tails        count fish-parts with [shape = forked-tail-shape]   set #-of-no-forked-tails     count fish-parts with [shape = no-forked-tail-shape]   set #-of-males               count fish with [sex = \"male\"]   set #-of-females             count fish with [sex = \"female\"]  end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;; visualization-procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to visualize-tank    ask patches with [(type-of-patch = \"water\" or type-of-patch = \"water-edge\")] [      ifelse not divider-here?        [ set pcolor water-color ]        [ set pcolor gray - 3.5 ]    ]    ask patches with [type-of-patch = \"tank-wall\" ] [      ifelse not divider-here?        [ set pcolor gray - 3 ]        [ set pcolor gray - 4 ]      ]    ask patches with [type-of-patch = \"air\" ] [      set pcolor gray + 3    ] end   to visualize-fish-and-alleles   ifelse see-body-cells? [     ask somatic-cells [       set hidden? false       ask alleles with [ in-link-neighbor? myself ] [         set hidden? false       ]     ]   ] [     ask somatic-cells [       set hidden? true       ask alleles with [ in-link-neighbor? myself ] [         set hidden? true       ]     ]   ]   ifelse see-sex-cells? [     ask gamete-cells [       set hidden? false       ask alleles with [ in-link-neighbor? myself ] [         set hidden? false       ]     ]     ask fish-zygotes [       set hidden? false     ]   ] [     ask gamete-cells [       set hidden? true       ask alleles with [ in-link-neighbor? myself ] [         set hidden? true       ]     ]     ask fish-zygotes [       set hidden? true     ]   ]   ifelse see-fish? [     ask fish [       set hidden? false     ]     ask fish-parts [       set hidden? false     ]   ] [     ask fish [       set hidden? true     ]     ask fish-parts [       set hidden? true     ]   ] end   to grow-fish-parts-from-somatic-cell   let this-fish-body nobody    hatch 1 [     set breed fish     set bearing  random-float 360     set heading 0     set size 1     set this-fish-body self     if sex = \"male\" [set color male-color]     if sex = \"female\" [set color female-color]   ]   create-link-from  this-fish-body  [     ;; somatic cell will link to the fish body -     ;; thus following the fish body around as it moves     set hidden? true     set tie-mode \"fixed\"     tie   ]    hatch 1 [     set breed fish-parts  ;;;make tail     set breed fish-parts     set size 1     set shape tail-shape-phenotype     set color tail-color-phenotype     set heading -90 fd .4     create-link-from this-fish-body [       ;; fish-parts will link to the fish body -       ;; thus following the fish body around as it moves       set hidden? true       set tie-mode \"fixed\"       tie     ]   ]   hatch 1 [                      ;;;make fins     set breed fish-parts     set size 1     set shape \"fish-fins\"     set color dorsal-fin-color-phenotype     create-link-from this-fish-body  [       ;; fish-parts will link to the fish body -       ;; thus following the fish body around as it moves       set hidden? true       set tie-mode \"fixed\"       tie     ]   ]    hatch 1 [                      ;;;make spots     set breed fish-parts     set size 1     set shape rear-spots-phenotype     set color [ 0 0 0 255]     create-link-from this-fish-body [       ;; fish-parts will link to the fish body -       ;; thus following the fish body around as it moves       set hidden? true       set tie-mode \"fixed\"       tie     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;; phenotype reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to-report has-at-least-one-dominant-set-of-instructions-for [dominant-allele]   let this-somatic-cell self   let #-of-dominant-alleles count alleles with [in-link-neighbor? this-somatic-cell  and value = dominant-allele]   ifelse #-of-dominant-alleles > 0  [report true][report false]   ;; if it has at least one set of instructions (DNA) on how to build the protein reports true end   to-report tail-shape-phenotype   let this-shape \"\"   let this-fish  myself   ask myself ;; the somatic-cell   [     ifelse  has-at-least-one-dominant-set-of-instructions-for \"F\"        [set this-shape forked-tail-shape]      ;; tail fin forking results if protein is produced        [set this-shape no-forked-tail-shape]   ;; no tail fin forking results if protein is not produced (underlying tissue is continuous triangle shape)   ]   report this-shape end   to-report rear-spots-phenotype   let this-spots-shape \"\"   ask myself   [     ifelse has-at-least-one-dominant-set-of-instructions-for \"B\"        [set this-spots-shape spots-shape]    ;; spots on the rear of the fish result if protein is produced        [set this-spots-shape no-spots-shape]     ;; no spots on the rear of the fish result if protein is not produced   ]   report this-spots-shape end   to-report dorsal-fin-color-phenotype   let this-color []   ask myself   [     ifelse  has-at-least-one-dominant-set-of-instructions-for \"G\"       [set this-color green-dorsal-fin-color  ]      ;; green color results in dorsal fins if protein is produced       [set this-color no-green-dorsal-fin-color ]    ;; no green color results in dorsal fins if protein is not produced (underlying tissue color is grayish)   ]   report this-color end   to-report tail-color-phenotype   let this-color []   let this-fish  myself   ask myself   [     ifelse  has-at-least-one-dominant-set-of-instructions-for \"T\"        [set this-color yellow-tail-fin-color ]     ;; yellow color results in tail fins results if protein is produced        [set this-color no-yellow-tail-fin-color ]  ;; yellow color results in tail fins if protein is not produced (underlying tissue is continuous triangle shape)   ]   report this-color end   to-report sex-phenotype   let this-sex \"\"   let this-cell self   ifelse  has-at-least-one-dominant-set-of-instructions-for \"Y\"      [set this-sex \"male\"]      [set this-sex \"female\"]    report this-sex end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;; other reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to-report alleles-that-belong-to-this-gamete   report alleles with [in-link-neighbor? myself] end   to-report left-side-of-water-in-tank   report (min-pxcor) + 2 end   to-report right-side-of-water-in-tank   report  (max-pxcor) - 2 end    to-report other-turtles-in-this-turtles-tank-region   ;; when dividers are up, it reports how many turtles are in this region for this turtle   let turtles-in-this-region nobody   let xcor-of-this-turtle xcor   let this-region-left-side left-side-of-water-in-tank   let this-region-right-side right-side-of-water-in-tank   let dividers-to-the-right patches with [divider-here? and pxcor > xcor-of-this-turtle]   let dividers-to-the-left  patches with [divider-here? and pxcor < xcor-of-this-turtle]    if any? dividers-to-the-right [set this-region-right-side min [pxcor] of dividers-to-the-right ]   if any? dividers-to-the-left  [set this-region-left-side max [pxcor] of dividers-to-the-left   ]    set turtles-in-this-region turtles with [xcor >= this-region-left-side and xcor <= this-region-right-side]   report turtles-in-this-region end   to-report both-sexes-in-this-fishs-tank-region?   let fish-in-this-region other-turtles-in-this-turtles-tank-region with [breed = fish]   let male-fish-in-this-region fish-in-this-region with [sex = \"male\"]   let female-fish-in-this-region fish-in-this-region with [sex = \"female\"]   ifelse (any? male-fish-in-this-region and any? female-fish-in-this-region ) [report true] [report false] end    to-report carrying-capacity-in-this-region [this-xcor]   let this-region-left-side left-side-of-water-in-tank   let this-region-right-side right-side-of-water-in-tank   let dividers-to-the-right patches with [divider-here? and pxcor > this-xcor]   let dividers-to-the-left  patches with [divider-here? and pxcor < this-xcor]    if any? dividers-to-the-right [ set this-region-right-side min [pxcor] of dividers-to-the-right ]   if any? dividers-to-the-left  [ set this-region-left-side max [pxcor] of dividers-to-the-left   ]   let tank-capacity-of-this-region (this-region-right-side - this-region-left-side) * carrying-capacity / 25   report tank-capacity-of-this-region end   ; Copyright 2011 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":610,"top":10,"right":1458,"bottom":467,"dimensions":{"minPxcor":0,"maxPxcor":29,"minPycor":0,"maxPycor":15,"patchSize":28,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-b","left":185,"top":150,"right":365,"bottom":183,"display":"initial-alleles-big-b","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":15,"top":10,"right":93,"bottom":44,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"see-body-cells?","left":15,"top":135,"right":175,"bottom":168,"display":"see-body-cells?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":95,"top":10,"right":175,"bottom":44,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-t","left":185,"top":505,"right":365,"bottom":538,"display":"initial-alleles-big-t","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-g","left":185,"top":270,"right":365,"bottom":303,"display":"initial-alleles-big-g","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-f","left":185,"top":390,"right":365,"bottom":423,"display":"initial-alleles-big-f","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Tail Shape Alleles', 'big-F')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-f-alleles\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"big-F","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-f-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Tail Shape Alleles', 'small-f')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-f-alleles\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"small-f","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-f-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Tail Shape Alleles","left":370,"top":370,"right":605,"bottom":490,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-F","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-f-alleles","type":"pen"},{"display":"small-f","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-f-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Tail Color Alleles', 'big-T')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-t-alleles\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"big-T","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-t-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Tail Color Alleles', 'small-t')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-t-alleles\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"small-t","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-t-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Tail Color Alleles","left":370,"top":490,"right":605,"bottom":610,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-T","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-t-alleles","type":"pen"},{"display":"small-t","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-t-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'big-G')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-g-alleles\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"big-G","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-g-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'small-g')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-g-alleles\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"small-g","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-g-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Dorsal Fin Color Alleles","left":370,"top":250,"right":605,"bottom":370,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-G","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-g-alleles","type":"pen"},{"display":"small-g","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-g-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Sex Chromosomes', 'X')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-x-chromosomes\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"X","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-x-chromosomes","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Sex Chromosomes', 'Y')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-y-chromosomes\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"Y","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-y-chromosomes","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Sex Chromosomes","left":370,"top":10,"right":605,"bottom":130,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"X","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-x-chromosomes","type":"pen"},{"display":"Y","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-y-chromosomes","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"2","compiledMax":"60","compiledStep":"1","variable":"carrying-capacity","left":15,"top":50,"right":175,"bottom":83,"display":"carrying-capacity","min":"2","max":"60","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"display":"TT / Tt / tT --> yellow tail               tt --> no yellow","left":201,"top":561,"right":357,"bottom":593,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype -->  Phenotype","left":200,"top":543,"right":365,"bottom":573,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype ---> Phenotype","left":200,"top":65,"right":366,"bottom":84,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype","left":194,"top":186,"right":356,"bottom":205,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype ","left":204,"top":303,"right":375,"bottom":321,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype","left":200,"top":423,"right":364,"bottom":442,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'spots')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-spots\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"spots","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-spots","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no spots')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-spots\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"no spots","interval":1,"mode":0,"color":-5987164,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-spots","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'green dorsal')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-green-dorsal-fins\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"green dorsal","interval":1,"mode":0,"color":-8330359,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-green-dorsal-fins","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no green')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-green-dorsal-fins\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"no green","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-green-dorsal-fins","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"dorsal fin & spotting variations","left":611,"top":490,"right":909,"bottom":610,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"spots","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-spots","type":"pen"},{"display":"no spots","interval":1,"mode":0,"color":-5987164,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-spots","type":"pen"},{"display":"green dorsal","interval":1,"mode":0,"color":-8330359,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-green-dorsal-fins","type":"pen"},{"display":"no green","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-green-dorsal-fins","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"display":"FF / Ff / fF --> forked tail              ff --> no fork","left":207,"top":444,"right":369,"bottom":478,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"GG / Gg / gG --> green dorsal fin                 gg --> no green fin","left":195,"top":320,"right":365,"bottom":348,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Body Spot Alleles', 'big-B')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-b-alleles\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"big-B","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-b-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('Body Spot Alleles', 'small-b')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-b-alleles\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"small-b","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-b-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Body Spot Alleles","left":370,"top":130,"right":605,"bottom":250,"xAxis":"time","yAxis":"# alleles","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-B","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-b-alleles","type":"pen"},{"display":"small-b","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-b-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"display":"XX  --> female XY  --> male","left":241,"top":85,"right":355,"bottom":118,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"BB / Bb / bB  -->  black spots               bb  --> no black spots","left":200,"top":205,"right":382,"bottom":246,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"variable":"see-fish?","left":15,"top":100,"right":175,"bottom":133,"display":"see-fish?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"see-sex-cells?","left":15,"top":170,"right":175,"bottom":203,"display":"see-sex-cells?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('tail fin variations', 'forked tail')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-forked-tails\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"forked tail","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-forked-tails","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('tail fin variations', 'no fork')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-forked-tails\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"no fork","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-forked-tails","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('tail fin variations', 'yellow tail')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-yellow-tail-fins\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"yellow tail","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-yellow-tail-fins","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('tail fin variations', 'no yellow')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-yellow-tail-fins\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"no yellow","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-yellow-tail-fins","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"tail fin variations","left":911,"top":490,"right":1183,"bottom":610,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"forked tail","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-forked-tails","type":"pen"},{"display":"no fork","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-forked-tails","type":"pen"},{"display":"yellow tail","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-yellow-tail-fins","type":"pen"},{"display":"no yellow","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-yellow-tail-fins","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('# of males & females', 'females')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-females\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"females","interval":1,"mode":0,"color":-4757638,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-females","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return workspace.rng.withClone(function() {     return plotManager.withTemporaryContext('# of males & females', 'males')(function() {       try {         var reporterContext = false;         var letVars = { };         plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-males\"));       } catch (e) {         return Errors.stopInCommandCheck(e)       };     });   }); }","display":"males","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-males","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"# of males & females","left":1186,"top":490,"right":1458,"bottom":610,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"females","interval":1,"mode":0,"color":-4757638,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-females","type":"pen"},{"display":"males","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-males","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-removed\")","source":"num-fish-removed","left":45,"top":365,"right":145,"bottom":410,"display":"fish removed","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"auto-replace?","left":14,"top":268,"right":174,"bottom":301,"display":"auto-replace?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   Errors.askNobodyCheck(PrimChecks.list.oneOf_unchecked(world.turtleManager.turtlesOfBreed(\"FISH\"))).ask(function() { procedures[\"REMOVE-THIS-FISH\"](); }, true);   let _maybestop_69_89 = procedures[\"FIND-POTENTIAL-MATES\"]();   if (_maybestop_69_89 instanceof Exception.StopInterrupt) { return _maybestop_69_89; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"ask one-of fish [ remove-this-fish] find-potential-mates","left":15,"top":230,"right":175,"bottom":264,"display":"Randomly replace a fish","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-in-tank\")","source":"num-fish-in-tank","left":45,"top":320,"right":145,"bottom":365,"display":"fish in tank","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-females","left":185,"top":30,"right":365,"bottom":63,"display":"initial-females","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-born\")","source":"num-fish-born","left":45,"top":410,"right":145,"bottom":455,"display":"fish born","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["initial-alleles-big-b", "see-body-cells?", "initial-alleles-big-t", "initial-alleles-big-g", "initial-alleles-big-f", "carrying-capacity", "see-fish?", "see-sex-cells?", "auto-replace?", "initial-females", "#-big-b-alleles", "#-small-b-alleles", "#-big-t-alleles", "#-small-t-alleles", "#-big-f-alleles", "#-small-f-alleles", "#-big-g-alleles", "#-small-g-alleles", "#-y-chromosomes", "#-x-chromosomes", "water-color", "green-dorsal-fin-color", "no-green-dorsal-fin-color", "yellow-tail-fin-color", "no-yellow-tail-fin-color", "male-color", "female-color", "spots-shape", "no-spots-shape", "forked-tail-shape", "no-forked-tail-shape", "#-of-green-dorsal-fins", "#-of-no-green-dorsal-fins", "#-of-yellow-tail-fins", "#-of-no-yellow-tail-fins", "#-of-spots", "#-of-no-spots", "#-of-forked-tails", "#-of-no-forked-tails", "#-of-males", "#-of-females", "mouse-continuous-down?", "num-fish-removed", "num-fish-born", "num-fish-in-tank", "fish-forward-step", "gamete-forward-step", "intra-chromosome-pair-spacing", "inter-chromosome-pair-spacing", "size-of-karyotype-background-for-cells", "initial-#-females", "initial-#-males"], ["initial-alleles-big-b", "see-body-cells?", "initial-alleles-big-t", "initial-alleles-big-g", "initial-alleles-big-f", "carrying-capacity", "see-fish?", "see-sex-cells?", "auto-replace?", "initial-females"], ["type-of-patch", "divider-here?"], 0, 29, 0, 15, 28, false, false, turtleShapes, linkShapes, function(){});
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
      world.observer.setGlobal("mouse-continuous-down?", false);
      world.observer.setGlobal("intra-chromosome-pair-spacing", 0.2);
      world.observer.setGlobal("inter-chromosome-pair-spacing", 0.55);
      world.observer.setGlobal("fish-forward-step", 0.04);
      world.observer.setGlobal("num-fish-removed", 0);
      world.observer.setGlobal("num-fish-born", 0);
      world.observer.setGlobal("num-fish-in-tank", 0);
      world.observer.setGlobal("size-of-karyotype-background-for-cells", 5.2);
      world.observer.setGlobal("initial-#-females", PrimChecks.math.floor_unchecked(PrimChecks.math.mult(PrimChecks.math.div(world.observer.getGlobal("initial-females"), 100), world.observer.getGlobal("carrying-capacity"))));
      world.observer.setGlobal("initial-#-males", PrimChecks.math.minus(world.observer.getGlobal("carrying-capacity"), world.observer.getGlobal("initial-#-females")));
      world.observer.setGlobal("green-dorsal-fin-color", [90, 255, 90, 255]);
      world.observer.setGlobal("no-green-dorsal-fin-color", [176, 196, 222, 255]);
      world.observer.setGlobal("yellow-tail-fin-color", [255, 255, 0, 255]);
      world.observer.setGlobal("no-yellow-tail-fin-color", [176, 196, 255, 255]);
      world.observer.setGlobal("female-color", [255, 150, 150, 255]);
      world.observer.setGlobal("male-color", [150, 150, 255, 255]);
      world.observer.setGlobal("water-color", PrimChecks.math.minus_unchecked(105, 1.5));
      world.observer.setGlobal("spots-shape", "fish-spots");
      world.observer.setGlobal("no-spots-shape", "none");
      world.observer.setGlobal("forked-tail-shape", "fish-forked-tail");
      world.observer.setGlobal("no-forked-tail-shape", "fish-no-forked-tail");
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("FISH").getSpecialName(), "fish-body")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").getSpecialName(), "cell-somatic")
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("FISH-BONES").getSpecialName(), "fish-bones")
      world.turtleManager.createTurtles(1, "MOUSE-CURSORS").ask(function() {
        SelfManager.self().setVariable("shape", "x");
        SelfManager.self().setVariable("hidden?", true);
        SelfManager.self().setVariable("color", 15);
        SelfManager.self().setVariable("heading", 0);
      }, true);
      procedures["SET-TANK-REGIONS"]();
      procedures["CREATE-INITIAL-GENE-POOL"]();
      procedures["CREATE-INITIAL-FISH"]();
      procedures["VISUALIZE-TANK"]();
      procedures["VISUALIZE-FISH-AND-ALLELES"]();
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
      let minPycorEdge = world.topology.minPycor; letVars['minPycorEdge'] = minPycorEdge;
      let maxPycorEdge = world.topology.maxPycor; letVars['maxPycorEdge'] = maxPycorEdge;
      let waterPatches = Nobody; letVars['waterPatches'] = waterPatches;
      Errors.askNobodyCheck(world.patches()).ask(function() {
        SelfManager.self().setPatchVariable("divider-here?", false);
        SelfManager.self().setPatchVariable("type-of-patch", "water");
        if ((((Prims.equality(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.minus(maxPycorEdge, 2)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.plus(minPycorEdge, 2))) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), procedures["LEFT-SIDE-OF-WATER-IN-TANK"]())) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), procedures["RIGHT-SIDE-OF-WATER-IN-TANK"]()))) {
          SelfManager.self().setPatchVariable("type-of-patch", "water-edge");
        }
        if (Prims.gte(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.minus(maxPycorEdge, 1))) {
          SelfManager.self().setPatchVariable("type-of-patch", "air");
        }
        if (((Prims.lte(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.minus(procedures["LEFT-SIDE-OF-WATER-IN-TANK"](), 1)) || Prims.gte(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.plus(procedures["RIGHT-SIDE-OF-WATER-IN-TANK"](), 1))) || Prims.lte(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.plus(minPycorEdge, 1)))) {
          SelfManager.self().setPatchVariable("type-of-patch", "tank-wall");
        }
        if ((((Prims.equality(SelfManager.self().getPatchVariable("pycor"), maxPycorEdge) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), minPycorEdge)) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.minus(procedures["LEFT-SIDE-OF-WATER-IN-TANK"](), 2))) || Prims.gte(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.plus(procedures["RIGHT-SIDE-OF-WATER-IN-TANK"](), 2)))) {
          SelfManager.self().setPatchVariable("type-of-patch", "air");
        }
      }, true);
      waterPatches = PrimChecks.agentset.with_unchecked(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water"); }); letVars['waterPatches'] = waterPatches;
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setTankRegions"] = temp;
  procs["SET-TANK-REGIONS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let numBigAlleles = 0; letVars['numBigAlleles'] = numBigAlleles;
      let initialNumberFish = world.observer.getGlobal("carrying-capacity"); letVars['initialNumberFish'] = initialNumberFish;
      numBigAlleles = PrimChecks.math.round_unchecked(PrimChecks.math.div_unchecked(PrimChecks.math.mult(PrimChecks.math.mult(world.observer.getGlobal("initial-alleles-big-b"), 2), initialNumberFish), 100)); letVars['numBigAlleles'] = numBigAlleles;
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](1,"B","b",numBigAlleles);
      numBigAlleles = PrimChecks.math.round_unchecked(PrimChecks.math.div_unchecked(PrimChecks.math.mult(PrimChecks.math.mult(world.observer.getGlobal("initial-alleles-big-t"), 2), initialNumberFish), 100)); letVars['numBigAlleles'] = numBigAlleles;
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](2,"T","t",numBigAlleles);
      numBigAlleles = PrimChecks.math.round_unchecked(PrimChecks.math.div_unchecked(PrimChecks.math.mult(PrimChecks.math.mult(world.observer.getGlobal("initial-alleles-big-f"), 2), initialNumberFish), 100)); letVars['numBigAlleles'] = numBigAlleles;
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](3,"F","f",numBigAlleles);
      numBigAlleles = PrimChecks.math.round_unchecked(PrimChecks.math.div_unchecked(PrimChecks.math.mult(PrimChecks.math.mult(world.observer.getGlobal("initial-alleles-big-g"), 2), initialNumberFish), 100)); letVars['numBigAlleles'] = numBigAlleles;
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](4,"G","g",numBigAlleles);
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](5,"Y","X",world.observer.getGlobal("initial-#-males"));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["createInitialGenePool"] = temp;
  procs["CREATE-INITIAL-GENE-POOL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-#-males"), "SOMATIC-CELLS").ask(function() { SelfManager.self().setVariable("sex", "male"); }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-#-females"), "SOMATIC-CELLS").ask(function() { SelfManager.self().setVariable("sex", "female"); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")).ask(function() { procedures["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"](); }, true);
      procedures["DISTRIBUTE-GENE-POOL-TO-SOMATIC-CELLS"]();
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")).ask(function() { procedures["GROW-FISH-PARTS-FROM-SOMATIC-CELL"](); }, true);
      procedures["DISTRIBUTE-FISH-IN-TANK"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["createInitialFish"] = temp;
  procs["CREATE-INITIAL-FISH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("heading", 0);
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"));
      SelfManager.self().setVariable("color", [100, 100, 100, 100]);
      SelfManager.self().setVariable("size", world.observer.getGlobal("size-of-karyotype-background-for-cells"));
      SelfManager.self().setVariable("hidden?", true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupNewSomaticCellAttributes"] = temp;
  procs["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let waterPatches = PrimChecks.agentset.with_unchecked(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water"); }); letVars['waterPatches'] = waterPatches;
      let waterPatch = Nobody; letVars['waterPatch'] = waterPatch;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH")).ask(function() { SelfManager.self().moveTo(PrimChecks.list.oneOf(waterPatches)); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["distributeFishInTank"] = temp;
  procs["DISTRIBUTE-FISH-IN-TANK"] = temp;
  temp = (function(geneNumber, allele1, allele2, numBigAlleles) {
    try {
      var reporterContext = false;
      var letVars = { };
      let initialNumberFish = PrimChecks.math.plus(world.observer.getGlobal("initial-#-males"), world.observer.getGlobal("initial-#-females")); letVars['initialNumberFish'] = initialNumberFish;
      world.turtleManager.createTurtles(PrimChecks.math.mult(2, initialNumberFish), "ALLELES").ask(function() {
        SelfManager.self().setVariable("gene", geneNumber);
        SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("gene-") + workspace.dump(geneNumber)));
        SelfManager.self().setVariable("heading", 0);
        SelfManager.self().setVariable("owned-by-fish?", false);
        SelfManager.self().setVariable("value", allele2);
        SelfManager.self().setVariable("color", [0, 0, 0, 255]);
        SelfManager.self().setVariable("label-color", SelfManager.self().getVariable("color"));
        SelfManager.self().setVariable("label", (workspace.dump('') + workspace.dump(SelfManager.self().getVariable("value")) + workspace.dump("     ")));
      }, true);
      Errors.askNobodyCheck(PrimChecks.list.nOf(numBigAlleles, PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("gene"), geneNumber); }))).ask(function() {
        SelfManager.self().setVariable("value", allele1);
        SelfManager.self().setVariable("color", [220, 220, 220, 255]);
        SelfManager.self().setVariable("label", (workspace.dump('') + workspace.dump(SelfManager.self().getVariable("value")) + workspace.dump("     ")));
        SelfManager.self().setVariable("label-color", SelfManager.self().getVariable("color"));
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeInitialAllelesForGene"] = temp;
  procs["MAKE-INITIAL-ALLELES-FOR-GENE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let thisSomaticCell = Nobody; letVars['thisSomaticCell'] = thisSomaticCell;
      let lastSexAllele = ""; letVars['lastSexAllele'] = lastSexAllele;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")).ask(function() {
        thisSomaticCell = SelfManager.self(); letVars['thisSomaticCell'] = thisSomaticCell;
        var _foreach_8238_8245 = Tasks.forEach(Tasks.commandTask(function(n) {
          Errors.procedureArgumentsCheck(1, arguments.length);
          procedures["POSITION-AND-LINK-ALLELES"](SelfManager.self(),n,"left");
          procedures["POSITION-AND-LINK-ALLELES"](SelfManager.self(),n,"right");
        }, "[ n -> position-and-link-alleles self n \"left\" position-and-link-alleles self n \"right\" ]"), [1, 2, 3, 4]); if(reporterContext && _foreach_8238_8245 !== undefined) { return _foreach_8238_8245; }
        Errors.askNobodyCheck(PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
          return ((PrimChecks.math.not(SelfManager.self().getVariable("owned-by-fish?")) && Prims.equality(SelfManager.self().getVariable("gene"), 5)) && Prims.equality(SelfManager.self().getVariable("value"), "X"));
        })).ask(function() {
          SelfManager.self().setVariable("owned-by-fish?", true);
          SelfManager.self().setVariable("size", 1.2);
          SelfManager.self().setVariable("xcor", PrimChecks.math.plus_unchecked(PrimChecks.math.mult(world.observer.getGlobal("inter-chromosome-pair-spacing"), 4), 0.1));
          SelfManager.self().setVariable("ycor", -0.4);
          SelfManager.self().setVariable("side", "left");
          LinkPrims.createLinkFrom(thisSomaticCell, "LINKS").ask(function() {
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().setVariable("tie-mode", "fixed");
            SelfManager.self().tie();
          }, true);
        }, true);
        if (Prims.equality(SelfManager.self().getVariable("sex"), "male")) {
          lastSexAllele = "Y"; letVars['lastSexAllele'] = lastSexAllele;
        }
        else {
          lastSexAllele = "X"; letVars['lastSexAllele'] = lastSexAllele;
        }
        Errors.askNobodyCheck(PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
          return ((PrimChecks.math.not(SelfManager.self().getVariable("owned-by-fish?")) && Prims.equality(SelfManager.self().getVariable("gene"), 5)) && Prims.equality(SelfManager.self().getVariable("value"), lastSexAllele));
        })).ask(function() {
          SelfManager.self().setVariable("owned-by-fish?", true);
          SelfManager.self().setVariable("size", 1.2);
          SelfManager.self().setVariable("xcor", PrimChecks.math.plus_unchecked(PrimChecks.math.plus(PrimChecks.math.mult(world.observer.getGlobal("inter-chromosome-pair-spacing"), 4), world.observer.getGlobal("intra-chromosome-pair-spacing")), 0.1));
          SelfManager.self().setVariable("ycor", -0.4);
          SelfManager.self().setVariable("side", "right");
          LinkPrims.createLinkFrom(thisSomaticCell, "LINKS").ask(function() {
            SelfManager.self().setVariable("hidden?", true);
            SelfManager.self().setVariable("tie-mode", "fixed");
            SelfManager.self().tie();
          }, true);
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["distributeGenePoolToSomaticCells"] = temp;
  procs["DISTRIBUTE-GENE-POOL-TO-SOMATIC-CELLS"] = temp;
  temp = (function(thisSomaticCell, geneNumber, whichSide) {
    try {
      var reporterContext = false;
      var letVars = { };
      let pairShiftRight = 0; letVars['pairShiftRight'] = pairShiftRight;
      let sideShift = 0; letVars['sideShift'] = sideShift;
      if (Prims.equality(whichSide, "right")) {
        sideShift = world.observer.getGlobal("intra-chromosome-pair-spacing"); letVars['sideShift'] = sideShift;
      }
      else {
        sideShift = 0; letVars['sideShift'] = sideShift;
      }
      pairShiftRight = PrimChecks.math.minus_unchecked(PrimChecks.math.mult(world.observer.getGlobal("inter-chromosome-pair-spacing"), geneNumber), 0.45); letVars['pairShiftRight'] = pairShiftRight;
      Errors.askNobodyCheck(PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
        return (PrimChecks.math.not(SelfManager.self().getVariable("owned-by-fish?")) && Prims.equality(SelfManager.self().getVariable("gene"), geneNumber));
      })).ask(function() {
        SelfManager.self().setVariable("owned-by-fish?", true);
        SelfManager.self().setVariable("side", whichSide);
        SelfManager.self().setVariable("size", 1.2);
        SelfManager.self().setVariable("xcor", PrimChecks.math.plus(PrimChecks.agentset.of(thisSomaticCell, function() { return SelfManager.self().getVariable("xcor"); }), PrimChecks.math.plus(pairShiftRight, sideShift)));
        SelfManager.self().setVariable("ycor", PrimChecks.math.minus(PrimChecks.agentset.of(thisSomaticCell, function() { return SelfManager.self().getVariable("ycor"); }), 0.4));
        LinkPrims.createLinkFrom(thisSomaticCell, "LINKS").ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().setVariable("tie-mode", "fixed");
          SelfManager.self().tie();
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["positionAndLinkAlleles"] = temp;
  procs["POSITION-AND-LINK-ALLELES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["WANDER"]();
      procedures["UPDATE-STATISTICS"]();
      procedures["DETECT-FISH-OUTSIDE-THE-WATER"]();
      procedures["DETECT-AND-MOVE-FISH-AT-INSIDE-TANK-BOUNDARY"]();
      procedures["AUTO-SELECTION"]();
      procedures["CLEAN-UP-FISH-BONES"]();
      if (world.observer.getGlobal("auto-replace?")) {
        procedures["FIND-POTENTIAL-MATES"]();
      }
      procedures["MOVE-GAMETES-TOGETHER"]();
      procedures["CONVERT-ZYGOTE-INTO-SOMATIC-CELL"]();
      procedures["DETECT-MOUSE-SELECTION-EVENT"]();
      procedures["VISUALIZE-FISH-AND-ALLELES"]();
      procedures["VISUALIZE-TANK"]();
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
      if (world.observer.getGlobal("auto-replace?")) {
        if (Prims.isThrottleTimeElapsed("autoSelection_0", workspace.selfManager.self(), 0.25)) {
          Prims.resetThrottleTimerFor("autoSelection_0", workspace.selfManager.self());
          if (PrimChecks.agentset.any_unchecked(world.turtleManager.turtlesOfBreed("FISH"))) {
            Errors.askNobodyCheck(PrimChecks.list.oneOf_unchecked(world.turtleManager.turtlesOfBreed("FISH"))).ask(function() {
              if (procedures["BOTH-SEXES-IN-THIS-FISHS-TANK-REGION?"]()) {
                procedures["REMOVE-THIS-FISH"]();
              }
            }, true);
          }
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["autoSelection"] = temp;
  procs["AUTO-SELECTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let myZygote = Nobody; letVars['myZygote'] = myZygote;
      let distanceToZygote = 0; letVars['distanceToZygote'] = distanceToZygote;
      if (world.observer.getGlobal("see-sex-cells?")) {
        world.observer.setGlobal("gamete-forward-step", 0.08);
      }
      else {
        world.observer.setGlobal("gamete-forward-step", 1);
      }
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("GAMETE-CELLS")).ask(function() {
        myZygote = PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }); letVars['myZygote'] = myZygote;
        distanceToZygote = SelfManager.self().distance(myZygote); letVars['distanceToZygote'] = distanceToZygote;
        if (Prims.gt(distanceToZygote, 0)) {
          SelfManager.self().face(myZygote);
          if (Prims.gt(distanceToZygote, world.observer.getGlobal("gamete-forward-step"))) {
            SelfManager.self().fd(world.observer.getGlobal("gamete-forward-step"));
          }
          else {
            SelfManager.self().fd(distanceToZygote);
          }
          SelfManager.self().setVariable("heading", 0);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["moveGametesTogether"] = temp;
  procs["MOVE-GAMETES-TOGETHER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let femaleSexCellAlleles = Nobody; letVars['femaleSexCellAlleles'] = femaleSexCellAlleles;
      let maleSexCellAlleles = Nobody; letVars['maleSexCellAlleles'] = maleSexCellAlleles;
      let maleGamete = Nobody; letVars['maleGamete'] = maleGamete;
      let femaleGamete = Nobody; letVars['femaleGamete'] = femaleGamete;
      let thisSomaticCell = Nobody; letVars['thisSomaticCell'] = thisSomaticCell;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES")).ask(function() {
        maleGamete = PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("GAMETE-CELLS"), function() {
          return (LinkPrims.isOutLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(SelfManager.self().getVariable("sex"), "male"));
        }); letVars['maleGamete'] = maleGamete;
        femaleGamete = PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("GAMETE-CELLS"), function() {
          return (LinkPrims.isOutLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(SelfManager.self().getVariable("sex"), "female"));
        }); letVars['femaleGamete'] = femaleGamete;
        if ((PrimChecks.agentset.any(maleGamete) && PrimChecks.agentset.any(femaleGamete))) {
          if ((Prims.lte(SelfManager.self().distance(PrimChecks.list.oneOf(maleGamete)), 0.01) && Prims.lte(SelfManager.self().distance(PrimChecks.list.oneOf(femaleGamete)), 0.01))) {
            procedures["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"]();
            thisSomaticCell = SelfManager.self(); letVars['thisSomaticCell'] = thisSomaticCell;
            Errors.askNobodyCheck(maleGamete).ask(function() {
              maleSexCellAlleles = procedures["ALLELES-THAT-BELONG-TO-THIS-GAMETE"](); letVars['maleSexCellAlleles'] = maleSexCellAlleles;
              SelfManager.self().die();
            }, true);
            Errors.askNobodyCheck(femaleGamete).ask(function() {
              femaleSexCellAlleles = procedures["ALLELES-THAT-BELONG-TO-THIS-GAMETE"](); letVars['femaleSexCellAlleles'] = femaleSexCellAlleles;
              SelfManager.self().die();
            }, true);
            Errors.askNobodyCheck(maleSexCellAlleles).ask(function() {
              LinkPrims.createLinkFrom(thisSomaticCell, "LINKS").ask(function() {
                SelfManager.self().setVariable("hidden?", true);
                SelfManager.self().setVariable("tie-mode", "fixed");
                SelfManager.self().tie();
              }, true);
            }, true);
            Errors.askNobodyCheck(femaleSexCellAlleles).ask(function() {
              LinkPrims.createLinkFrom(thisSomaticCell, "LINKS").ask(function() {
                SelfManager.self().setVariable("hidden?", true);
                SelfManager.self().setVariable("tie-mode", "fixed");
                SelfManager.self().tie();
              }, true);
            }, true);
            procedures["ALIGN-ALLELES-FOR-THIS-SOMATIC-CELL"](thisSomaticCell);
            SelfManager.self().setVariable("sex", procedures["SEX-PHENOTYPE"]());
            procedures["GROW-FISH-PARTS-FROM-SOMATIC-CELL"]();
            world.observer.setGlobal("num-fish-born", PrimChecks.math.plus(world.observer.getGlobal("num-fish-born"), 1));
          }
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["convertZygoteIntoSomaticCell"] = temp;
  procs["CONVERT-ZYGOTE-INTO-SOMATIC-CELL"] = temp;
  temp = (function(thisZygote) {
    try {
      var reporterContext = false;
      var letVars = { };
      let allAlleles = PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", thisZygote); }); letVars['allAlleles'] = allAlleles;
      var _foreach_14051_14058 = Tasks.forEach(Tasks.commandTask(function(thisGene) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        if (Prims.gt(PrimChecks.agentset.countWith(allAlleles, function() {
          return (Prims.equality(SelfManager.self().getVariable("gene"), thisGene) && Prims.equality(SelfManager.self().getVariable("side"), "left"));
        }), 1)) {
          Errors.askNobodyCheck(PrimChecks.agentset.oneOfWith(allAlleles, function() { return Prims.equality(SelfManager.self().getVariable("gene"), thisGene); })).ask(function() {
            SelfManager.self().setVariable("heading", 90);
            SelfManager.self().fd(world.observer.getGlobal("intra-chromosome-pair-spacing"));
            SelfManager.self().setVariable("side", "right");
          }, true);
        }
        if (Prims.gt(PrimChecks.agentset.countWith(allAlleles, function() {
          return (Prims.equality(SelfManager.self().getVariable("gene"), thisGene) && Prims.equality(SelfManager.self().getVariable("side"), "right"));
        }), 1)) {
          Errors.askNobodyCheck(PrimChecks.agentset.oneOfWith(allAlleles, function() { return Prims.equality(SelfManager.self().getVariable("gene"), thisGene); })).ask(function() {
            SelfManager.self().setVariable("heading", 90);
            SelfManager.self().fd(-(world.observer.getGlobal("intra-chromosome-pair-spacing")));
            SelfManager.self().setVariable("side", "left");
          }, true);
        }
      }, "[ this-gene -> if count all-alleles with [ gene = this-gene and side = \"left\" ] > 1 [ ask one-of all-alleles with [ gene = this-gene ] [ set heading 90 forward intra-chromosome-pair-spacing set side \"right\" ] ] if count all-alleles with [ gene = this-gene and side = \"right\" ] > 1 [ ask one-of all-alleles with [ gene = this-gene ] [ set heading 90 back intra-chromosome-pair-spacing set side \"left\" ] ] ]"), [1, 2, 3, 4, 5]); if(reporterContext && _foreach_14051_14058 !== undefined) { return _foreach_14051_14058; }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["alignAllelesForThisSomaticCell"] = temp;
  procs["ALIGN-ALLELES-FOR-THIS-SOMATIC-CELL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let mom = Nobody; letVars['mom'] = mom;
      let dad = Nobody; letVars['dad'] = dad;
      let xcorDad = 0; letVars['xcorDad'] = xcorDad;
      let turtlesInThisRegion = Nobody; letVars['turtlesInThisRegion'] = turtlesInThisRegion;
      let potentialMates = Nobody; letVars['potentialMates'] = potentialMates;
      let allFishAndFishZygotes = Nobody; letVars['allFishAndFishZygotes'] = allFishAndFishZygotes;
      if (PrimChecks.agentset.anyWith(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); })) {
        Errors.askNobodyCheck(PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); })).ask(function() {
          dad = SelfManager.self(); letVars['dad'] = dad;
          xcorDad = SelfManager.self().getVariable("xcor"); letVars['xcorDad'] = xcorDad;
        }, true);
        Errors.askNobodyCheck(dad).ask(function() {
          turtlesInThisRegion = procedures["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"](); letVars['turtlesInThisRegion'] = turtlesInThisRegion;
        }, true);
        allFishAndFishZygotes = PrimChecks.agentset.with(turtlesInThisRegion, function() {
          return (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH")) || Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH-ZYGOTES")));
        }); letVars['allFishAndFishZygotes'] = allFishAndFishZygotes;
        potentialMates = PrimChecks.agentset.with(turtlesInThisRegion, function() {
          return (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")) && Prims.equality(SelfManager.self().getVariable("sex"), "female"));
        }); letVars['potentialMates'] = potentialMates;
        if (PrimChecks.agentset.any(potentialMates)) {
          Errors.askNobodyCheck(PrimChecks.list.oneOf(potentialMates)).ask(function() { mom = SelfManager.self(); letVars['mom'] = mom; }, true);
          let thisCarryingCapacity = procedures["CARRYING-CAPACITY-IN-THIS-REGION"](xcorDad); letVars['thisCarryingCapacity'] = thisCarryingCapacity;
          if (Prims.lt(PrimChecks.agentset.count(allFishAndFishZygotes), thisCarryingCapacity)) {
            procedures["REPRODUCE-OFFSPRING-FROM-THESE-TWO-PARENTS"](mom,dad);
          }
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["findPotentialMates"] = temp;
  procs["FIND-POTENTIAL-MATES"] = temp;
  temp = (function(mom, dad) {
    try {
      var reporterContext = false;
      var letVars = { };
      let child = Nobody; letVars['child'] = child;
      Errors.askNobodyCheck(mom).ask(function() {
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("heading", 0);
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"));
          SelfManager.self().setVariable("size", 1);
          SelfManager.self().setVariable("shape", "heart");
          SelfManager.self().setVariable("color", 15);
          child = SelfManager.self(); letVars['child'] = child;
        }, true);
      }, true);
      Errors.askNobodyCheck(mom).ask(function() { procedures["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"](child); }, true);
      Errors.askNobodyCheck(dad).ask(function() { procedures["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"](child); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["reproduceOffspringFromTheseTwoParents"] = temp;
  procs["REPRODUCE-OFFSPRING-FROM-THESE-TWO-PARENTS"] = temp;
  temp = (function(child) {
    try {
      var reporterContext = false;
      var letVars = { };
      let thisNewGameteCell = Nobody; letVars['thisNewGameteCell'] = thisNewGameteCell;
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("GAMETE-CELLS"));
        SelfManager.self().setVariable("heading", 0);
        LinkPrims.createLinkTo(child, "LINKS").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
        if (Prims.equality(SelfManager.self().getVariable("sex"), "male")) {
          SelfManager.self().setVariable("shape", "cell-gamete-male");
        }
        else {
          SelfManager.self().setVariable("shape", "cell-gamete-female");
        }
        thisNewGameteCell = SelfManager.self(); letVars['thisNewGameteCell'] = thisNewGameteCell;
      }, true);
      var _foreach_16499_16506 = Tasks.forEach(Tasks.commandTask(function(thisGene) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        Errors.askNobodyCheck(PrimChecks.list.nOf_unchecked(1, PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
          return (LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(SelfManager.self().getVariable("gene"), thisGene));
        }))).ask(function() {
          SelfManager.self().hatch(1, "").ask(function() {
            SelfManager.self().setVariable("owned-by-fish?", false);
            LinkPrims.createLinkFrom(thisNewGameteCell, "LINKS").ask(function() {
              SelfManager.self().setVariable("hidden?", true);
              SelfManager.self().setVariable("tie-mode", "fixed");
              SelfManager.self().tie();
            }, true);
          }, true);
        }, true);
      }, "[ this-gene -> ask n-of 1 alleles with [ in-link-neighbor? myself and gene = this-gene ] [ hatch 1 [ set owned-by-fish? false create-link-from this-new-gamete-cell [ set hidden? true set tie-mode \"fixed\" tie ] ] ] ]"), [1, 2, 3, 4, 5]); if(reporterContext && _foreach_16499_16506 !== undefined) { return _foreach_16499_16506; }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["linkAllelesToGametesAndGametesToZygote"] = temp;
  procs["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH")).ask(function() {
        SelfManager.self().setVariable("heading", SelfManager.self().getVariable("bearing"));
        SelfManager.self().right(PrimChecks.math.randomFloat_unchecked(70));
        SelfManager.self().right(-(PrimChecks.math.randomFloat_unchecked(70)));
        SelfManager.self().setVariable("bearing", SelfManager.self().getVariable("heading"));
        SelfManager.self().fd(world.observer.getGlobal("fish-forward-step"));
        SelfManager.self().setVariable("heading", 0);
      }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")).ask(function() { SelfManager.self().setVariable("heading", 0); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["wander"] = temp;
  procs["WANDER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("FISH"), function() {
        return (!Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") && !Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"));
      })).ask(function() { procedures["REMOVE-THIS-FISH"](); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["detectFishOutsideTheWater"] = temp;
  procs["DETECT-FISH-OUTSIDE-THE-WATER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let nearestWaterPatch = Nobody; letVars['nearestWaterPatch'] = nearestWaterPatch;
      let waterPatches = PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") && PrimChecks.math.not(SelfManager.self().getPatchVariable("divider-here?")));
      }); letVars['waterPatches'] = waterPatches;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH")).ask(function() {
        nearestWaterPatch = PrimChecks.agentset.minOneOf(waterPatches, function() { return SelfManager.self().distance(SelfManager.myself()); }); letVars['nearestWaterPatch'] = nearestWaterPatch;
        if ((Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "tank-wall") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"))) {
          SelfManager.self().setVariable("heading", SelfManager.self().towards(nearestWaterPatch));
          SelfManager.self().fd(PrimChecks.math.mult(world.observer.getGlobal("fish-forward-step"), 2));
          SelfManager.self().setVariable("heading", 0);
          SelfManager.self().setVariable("bearing", PrimChecks.math.randomFloat_unchecked(360));
        }
        if (SelfManager.self().getPatchVariable("divider-here?")) {
          SelfManager.self().moveTo(nearestWaterPatch);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["detectAndMoveFishAtInsideTankBoundary"] = temp;
  procs["DETECT-AND-MOVE-FISH-AT-INSIDE-TANK-BOUNDARY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let boneTransparency = 0; letVars['boneTransparency'] = boneTransparency;
      let colorList = []; letVars['colorList'] = colorList;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH-BONES")).ask(function() {
        SelfManager.self().setVariable("countdown", PrimChecks.math.minus(SelfManager.self().getVariable("countdown"), 1));
        boneTransparency = PrimChecks.math.div_unchecked(PrimChecks.math.mult(SelfManager.self().getVariable("countdown"), 255), 50); letVars['boneTransparency'] = boneTransparency;
        colorList = PrimChecks.list.lput_unchecked(boneTransparency, [255, 255, 255]); letVars['colorList'] = colorList;
        SelfManager.self().setVariable("color", colorList);
        if (Prims.lte(SelfManager.self().getVariable("countdown"), 0)) {
          SelfManager.self().die();
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["cleanUpFishBones"] = temp;
  procs["CLEAN-UP-FISH-BONES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("num-fish-removed", PrimChecks.math.plus(world.observer.getGlobal("num-fish-removed"), 1));
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-BONES"));
        SelfManager.self().setVariable("color", 9.9);
        SelfManager.self().setVariable("countdown", 25);
      }, true);
      Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("LINKS")).ask(function() {
        Errors.askNobodyCheck(LinkPrims.outLinkNeighbors("LINKS")).ask(function() { SelfManager.self().die(); }, true);
        SelfManager.self().die();
      }, true);
      SelfManager.self().die();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["removeThisFish"] = temp;
  procs["REMOVE-THIS-FISH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let pMouseXcor = MousePrims.getX(); letVars['pMouseXcor'] = pMouseXcor;
      let pMouseYcor = MousePrims.getY(); letVars['pMouseYcor'] = pMouseYcor;
      let pTypeOfPatch = PrimChecks.agentset.of(world.getPatchAt(pMouseXcor, pMouseYcor), function() { return SelfManager.self().getPatchVariable("type-of-patch"); }); letVars['pTypeOfPatch'] = pTypeOfPatch;
      let mouseWasJustDown_p = MousePrims.isDown(); letVars['mouseWasJustDown_p'] = mouseWasJustDown_p;
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("MOUSE-CURSORS")).ask(function() {
        SelfManager.self().setXY(pMouseXcor, pMouseYcor);
        if (Prims.equality(pTypeOfPatch, "water")) {
          SelfManager.self().setVariable("hidden?", false);
          SelfManager.self().setVariable("shape", "x");
          SelfManager.self().setVariable("label-color", 9.9);
          SelfManager.self().setVariable("label", "remove fish");
        }
        if (PrimChecks.math.bool('AND', SelfManager.self().getPatchVariable("divider-here?")) && PrimChecks.math.bool('AND', Prims.equality(pTypeOfPatch, "tank-wall"))) {
          SelfManager.self().setVariable("hidden?", false);
          SelfManager.self().setVariable("shape", "subtract divider");
          SelfManager.self().setVariable("label-color", 9.9);
          SelfManager.self().setVariable("label", "remove divider");
        }
        if ((PrimChecks.math.not(SelfManager.self().getPatchVariable("divider-here?")) && Prims.equality(pTypeOfPatch, "tank-wall"))) {
          SelfManager.self().setVariable("hidden?", false);
          SelfManager.self().setVariable("shape", "add divider");
          SelfManager.self().setVariable("label-color", 9.9);
          SelfManager.self().setVariable("label", "add divider");
        }
        if ((!Prims.equality(pTypeOfPatch, "water") && !Prims.equality(pTypeOfPatch, "tank-wall"))) {
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().setVariable("shape", "x");
          SelfManager.self().setVariable("label", "");
        }
        if (mouseWasJustDown_p) {
          Errors.askNobodyCheck(SelfManager.self().breedHere("FISH")).ask(function() { procedures["REMOVE-THIS-FISH"](); }, true);
        }
        if (((((PrimChecks.math.bool('AND', mouseWasJustDown_p) && PrimChecks.math.bool('AND', PrimChecks.math.not(world.observer.getGlobal("mouse-continuous-down?"))) && Prims.equality(pTypeOfPatch, "tank-wall")) && Prims.equality(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.plus_unchecked(world.topology.minPycor, 1))) && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.plus_unchecked(world.topology.minPxcor, 1))) && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.minus_unchecked(world.topology.maxPxcor, 1)))) {
          SelfManager.self().setPatchVariable("divider-here?", PrimChecks.math.not(SelfManager.self().getPatchVariable("divider-here?")));
          let dividerXcor = SelfManager.self().getPatchVariable("pxcor"); letVars['dividerXcor'] = dividerXcor;
          Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() {
            return ((Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge")) && Prims.equality(SelfManager.self().getPatchVariable("pxcor"), dividerXcor));
          })).ask(function() {
            SelfManager.self().setPatchVariable("divider-here?", PrimChecks.math.not(SelfManager.self().getPatchVariable("divider-here?")));
          }, true);
        }
        if (PrimChecks.math.not_unchecked(MousePrims.isInside())) {
          SelfManager.self().setVariable("hidden?", true);
        }
        else {
          SelfManager.self().setVariable("hidden?", false);
        }
      }, true);
      if (mouseWasJustDown_p) {
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
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("num-fish-in-tank", PrimChecks.agentset.count_unchecked(world.turtleManager.turtlesOfBreed("FISH")));
      world.observer.setGlobal("#-big-b-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "B"); }));
      world.observer.setGlobal("#-small-b-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "b"); }));
      world.observer.setGlobal("#-big-t-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "T"); }));
      world.observer.setGlobal("#-small-t-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "t"); }));
      world.observer.setGlobal("#-big-f-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "F"); }));
      world.observer.setGlobal("#-small-f-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "f"); }));
      world.observer.setGlobal("#-big-g-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "G"); }));
      world.observer.setGlobal("#-small-g-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "g"); }));
      world.observer.setGlobal("#-y-chromosomes", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "Y"); }));
      world.observer.setGlobal("#-x-chromosomes", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(SelfManager.self().getVariable("value"), "X"); }));
      world.observer.setGlobal("#-of-green-dorsal-fins", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() {
        return Prims.equality(SelfManager.self().getVariable("color"), world.observer.getGlobal("green-dorsal-fin-color"));
      }));
      world.observer.setGlobal("#-of-no-green-dorsal-fins", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() {
        return Prims.equality(SelfManager.self().getVariable("color"), world.observer.getGlobal("no-green-dorsal-fin-color"));
      }));
      world.observer.setGlobal("#-of-yellow-tail-fins", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() {
        return Prims.equality(SelfManager.self().getVariable("color"), world.observer.getGlobal("yellow-tail-fin-color"));
      }));
      world.observer.setGlobal("#-of-no-yellow-tail-fins", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() {
        return Prims.equality(SelfManager.self().getVariable("color"), world.observer.getGlobal("no-yellow-tail-fin-color"));
      }));
      world.observer.setGlobal("#-of-spots", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() {
        return (Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("spots-shape")) && Prims.equality(SelfManager.self().getVariable("hidden?"), false));
      }));
      world.observer.setGlobal("#-of-no-spots", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() {
        return (Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("spots-shape")) && Prims.equality(SelfManager.self().getVariable("hidden?"), true));
      }));
      world.observer.setGlobal("#-of-forked-tails", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() {
        return Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("forked-tail-shape"));
      }));
      world.observer.setGlobal("#-of-no-forked-tails", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() {
        return Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("no-forked-tail-shape"));
      }));
      world.observer.setGlobal("#-of-males", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH"), function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); }));
      world.observer.setGlobal("#-of-females", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH"), function() { return Prims.equality(SelfManager.self().getVariable("sex"), "female"); }));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["updateStatistics"] = temp;
  procs["UPDATE-STATISTICS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"));
      })).ask(function() {
        if (PrimChecks.math.not(SelfManager.self().getPatchVariable("divider-here?"))) {
          SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("water-color"));
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", PrimChecks.math.minus_unchecked(5, 3.5));
        }
      }, true);
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "tank-wall"); })).ask(function() {
        if (PrimChecks.math.not(SelfManager.self().getPatchVariable("divider-here?"))) {
          SelfManager.self().setPatchVariable("pcolor", PrimChecks.math.minus_unchecked(5, 3));
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", PrimChecks.math.minus_unchecked(5, 4));
        }
      }, true);
      Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "air"); })).ask(function() { SelfManager.self().setPatchVariable("pcolor", PrimChecks.math.plus_unchecked(5, 3)); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["visualizeTank"] = temp;
  procs["VISUALIZE-TANK"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (world.observer.getGlobal("see-body-cells?")) {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")).ask(function() {
          SelfManager.self().setVariable("hidden?", false);
          Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); })).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
        }, true);
      }
      else {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")).ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); })).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        }, true);
      }
      if (world.observer.getGlobal("see-sex-cells?")) {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("GAMETE-CELLS")).ask(function() {
          SelfManager.self().setVariable("hidden?", false);
          Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); })).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
        }, true);
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES")).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
      }
      else {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("GAMETE-CELLS")).ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          Errors.askNobodyCheck(PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); })).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        }, true);
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
      }
      if (world.observer.getGlobal("see-fish?")) {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH")).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH-PARTS")).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
      }
      else {
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("FISH-PARTS")).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["visualizeFishAndAlleles"] = temp;
  procs["VISUALIZE-FISH-AND-ALLELES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let thisFishBody = Nobody; letVars['thisFishBody'] = thisFishBody;
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH"));
        SelfManager.self().setVariable("bearing", PrimChecks.math.randomFloat_unchecked(360));
        SelfManager.self().setVariable("heading", 0);
        SelfManager.self().setVariable("size", 1);
        thisFishBody = SelfManager.self(); letVars['thisFishBody'] = thisFishBody;
        if (Prims.equality(SelfManager.self().getVariable("sex"), "male")) {
          SelfManager.self().setVariable("color", world.observer.getGlobal("male-color"));
        }
        if (Prims.equality(SelfManager.self().getVariable("sex"), "female")) {
          SelfManager.self().setVariable("color", world.observer.getGlobal("female-color"));
        }
      }, true);
      LinkPrims.createLinkFrom(thisFishBody, "LINKS").ask(function() {
        SelfManager.self().setVariable("hidden?", true);
        SelfManager.self().setVariable("tie-mode", "fixed");
        SelfManager.self().tie();
      }, true);
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-PARTS"));
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-PARTS"));
        SelfManager.self().setVariable("size", 1);
        SelfManager.self().setVariable("shape", procedures["TAIL-SHAPE-PHENOTYPE"]());
        SelfManager.self().setVariable("color", procedures["TAIL-COLOR-PHENOTYPE"]());
        SelfManager.self().setVariable("heading", -90);
        SelfManager.self()._optimalFdLessThan1(0.4);
        LinkPrims.createLinkFrom(thisFishBody, "LINKS").ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().setVariable("tie-mode", "fixed");
          SelfManager.self().tie();
        }, true);
      }, true);
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-PARTS"));
        SelfManager.self().setVariable("size", 1);
        SelfManager.self().setVariable("shape", "fish-fins");
        SelfManager.self().setVariable("color", procedures["DORSAL-FIN-COLOR-PHENOTYPE"]());
        LinkPrims.createLinkFrom(thisFishBody, "LINKS").ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().setVariable("tie-mode", "fixed");
          SelfManager.self().tie();
        }, true);
      }, true);
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-PARTS"));
        SelfManager.self().setVariable("size", 1);
        SelfManager.self().setVariable("shape", procedures["REAR-SPOTS-PHENOTYPE"]());
        SelfManager.self().setVariable("color", [0, 0, 0, 255]);
        LinkPrims.createLinkFrom(thisFishBody, "LINKS").ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().setVariable("tie-mode", "fixed");
          SelfManager.self().tie();
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["growFishPartsFromSomaticCell"] = temp;
  procs["GROW-FISH-PARTS-FROM-SOMATIC-CELL"] = temp;
  temp = (function(dominantAllele) {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisSomaticCell = SelfManager.self(); letVars['thisSomaticCell'] = thisSomaticCell;
      let _pound_OfDominantAlleles = PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
        return (LinkPrims.isInLinkNeighbor("LINKS", thisSomaticCell) && Prims.equality(SelfManager.self().getVariable("value"), dominantAllele));
      }); letVars['_pound_OfDominantAlleles'] = _pound_OfDominantAlleles;
      if (Prims.gt(_pound_OfDominantAlleles, 0)) {
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
  procs["hasAtLeastOneDominantSetOfInstructionsFor"] = temp;
  procs["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisShape = ""; letVars['thisShape'] = thisShape;
      let thisFish = SelfManager.myself(); letVars['thisFish'] = thisFish;
      Errors.askNobodyCheck(SelfManager.myself()).ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("F")) {
          thisShape = world.observer.getGlobal("forked-tail-shape"); letVars['thisShape'] = thisShape;
        }
        else {
          thisShape = world.observer.getGlobal("no-forked-tail-shape"); letVars['thisShape'] = thisShape;
        }
      }, true);
      Errors.reportInContextCheck(reporterContext);
      return thisShape;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["tailShapePhenotype"] = temp;
  procs["TAIL-SHAPE-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisSpotsShape = ""; letVars['thisSpotsShape'] = thisSpotsShape;
      Errors.askNobodyCheck(SelfManager.myself()).ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("B")) {
          thisSpotsShape = world.observer.getGlobal("spots-shape"); letVars['thisSpotsShape'] = thisSpotsShape;
        }
        else {
          thisSpotsShape = world.observer.getGlobal("no-spots-shape"); letVars['thisSpotsShape'] = thisSpotsShape;
        }
      }, true);
      Errors.reportInContextCheck(reporterContext);
      return thisSpotsShape;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["rearSpotsPhenotype"] = temp;
  procs["REAR-SPOTS-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisColor = []; letVars['thisColor'] = thisColor;
      Errors.askNobodyCheck(SelfManager.myself()).ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("G")) {
          thisColor = world.observer.getGlobal("green-dorsal-fin-color"); letVars['thisColor'] = thisColor;
        }
        else {
          thisColor = world.observer.getGlobal("no-green-dorsal-fin-color"); letVars['thisColor'] = thisColor;
        }
      }, true);
      Errors.reportInContextCheck(reporterContext);
      return thisColor;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["dorsalFinColorPhenotype"] = temp;
  procs["DORSAL-FIN-COLOR-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisColor = []; letVars['thisColor'] = thisColor;
      let thisFish = SelfManager.myself(); letVars['thisFish'] = thisFish;
      Errors.askNobodyCheck(SelfManager.myself()).ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("T")) {
          thisColor = world.observer.getGlobal("yellow-tail-fin-color"); letVars['thisColor'] = thisColor;
        }
        else {
          thisColor = world.observer.getGlobal("no-yellow-tail-fin-color"); letVars['thisColor'] = thisColor;
        }
      }, true);
      Errors.reportInContextCheck(reporterContext);
      return thisColor;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["tailColorPhenotype"] = temp;
  procs["TAIL-COLOR-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisSex = ""; letVars['thisSex'] = thisSex;
      let thisCell = SelfManager.self(); letVars['thisCell'] = thisCell;
      if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("Y")) {
        thisSex = "male"; letVars['thisSex'] = thisSex;
      }
      else {
        thisSex = "female"; letVars['thisSex'] = thisSex;
      }
      Errors.reportInContextCheck(reporterContext);
      return thisSex;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["sexPhenotype"] = temp;
  procs["SEX-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.agentset.with_unchecked(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); });
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["allelesThatBelongToThisGamete"] = temp;
  procs["ALLELES-THAT-BELONG-TO-THIS-GAMETE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.plus_unchecked(world.topology.minPxcor, 2);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["leftSideOfWaterInTank"] = temp;
  procs["LEFT-SIDE-OF-WATER-IN-TANK"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.minus_unchecked(world.topology.maxPxcor, 2);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["rightSideOfWaterInTank"] = temp;
  procs["RIGHT-SIDE-OF-WATER-IN-TANK"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let turtlesInThisRegion = Nobody; letVars['turtlesInThisRegion'] = turtlesInThisRegion;
      let xcorOfThisTurtle = SelfManager.self().getVariable("xcor"); letVars['xcorOfThisTurtle'] = xcorOfThisTurtle;
      let thisRegionLeftSide = procedures["LEFT-SIDE-OF-WATER-IN-TANK"](); letVars['thisRegionLeftSide'] = thisRegionLeftSide;
      let thisRegionRightSide = procedures["RIGHT-SIDE-OF-WATER-IN-TANK"](); letVars['thisRegionRightSide'] = thisRegionRightSide;
      let dividersToTheRight = PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return PrimChecks.math.bool('AND', SelfManager.self().getPatchVariable("divider-here?")) && PrimChecks.math.bool('AND', Prims.gt(SelfManager.self().getPatchVariable("pxcor"), xcorOfThisTurtle));
      }); letVars['dividersToTheRight'] = dividersToTheRight;
      let dividersToTheLeft = PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return PrimChecks.math.bool('AND', SelfManager.self().getPatchVariable("divider-here?")) && PrimChecks.math.bool('AND', Prims.lt(SelfManager.self().getPatchVariable("pxcor"), xcorOfThisTurtle));
      }); letVars['dividersToTheLeft'] = dividersToTheLeft;
      if (PrimChecks.agentset.any(dividersToTheRight)) {
        thisRegionRightSide = PrimChecks.list.min(PrimChecks.agentset.of(dividersToTheRight, function() { return SelfManager.self().getPatchVariable("pxcor"); })); letVars['thisRegionRightSide'] = thisRegionRightSide;
      }
      if (PrimChecks.agentset.any(dividersToTheLeft)) {
        thisRegionLeftSide = PrimChecks.list.max(PrimChecks.agentset.of(dividersToTheLeft, function() { return SelfManager.self().getPatchVariable("pxcor"); })); letVars['thisRegionLeftSide'] = thisRegionLeftSide;
      }
      turtlesInThisRegion = PrimChecks.agentset.with_unchecked(world.turtles(), function() {
        return (Prims.gte(SelfManager.self().getVariable("xcor"), thisRegionLeftSide) && Prims.lte(SelfManager.self().getVariable("xcor"), thisRegionRightSide));
      }); letVars['turtlesInThisRegion'] = turtlesInThisRegion;
      Errors.reportInContextCheck(reporterContext);
      return turtlesInThisRegion;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["otherTurtlesInThisTurtlesTankRegion"] = temp;
  procs["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let fishInThisRegion = PrimChecks.agentset.with(procedures["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"](), function() {
        return Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH"));
      }); letVars['fishInThisRegion'] = fishInThisRegion;
      let maleFishInThisRegion = PrimChecks.agentset.with(fishInThisRegion, function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); }); letVars['maleFishInThisRegion'] = maleFishInThisRegion;
      let femaleFishInThisRegion = PrimChecks.agentset.with(fishInThisRegion, function() { return Prims.equality(SelfManager.self().getVariable("sex"), "female"); }); letVars['femaleFishInThisRegion'] = femaleFishInThisRegion;
      if ((PrimChecks.agentset.any(maleFishInThisRegion) && PrimChecks.agentset.any(femaleFishInThisRegion))) {
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
  procs["bothSexesInThisFishsTankRegion_p"] = temp;
  procs["BOTH-SEXES-IN-THIS-FISHS-TANK-REGION?"] = temp;
  temp = (function(thisXcor) {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisRegionLeftSide = procedures["LEFT-SIDE-OF-WATER-IN-TANK"](); letVars['thisRegionLeftSide'] = thisRegionLeftSide;
      let thisRegionRightSide = procedures["RIGHT-SIDE-OF-WATER-IN-TANK"](); letVars['thisRegionRightSide'] = thisRegionRightSide;
      let dividersToTheRight = PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return PrimChecks.math.bool('AND', SelfManager.self().getPatchVariable("divider-here?")) && PrimChecks.math.bool('AND', Prims.gt(SelfManager.self().getPatchVariable("pxcor"), thisXcor));
      }); letVars['dividersToTheRight'] = dividersToTheRight;
      let dividersToTheLeft = PrimChecks.agentset.with_unchecked(world.patches(), function() {
        return PrimChecks.math.bool('AND', SelfManager.self().getPatchVariable("divider-here?")) && PrimChecks.math.bool('AND', Prims.lt(SelfManager.self().getPatchVariable("pxcor"), thisXcor));
      }); letVars['dividersToTheLeft'] = dividersToTheLeft;
      if (PrimChecks.agentset.any(dividersToTheRight)) {
        thisRegionRightSide = PrimChecks.list.min(PrimChecks.agentset.of(dividersToTheRight, function() { return SelfManager.self().getPatchVariable("pxcor"); })); letVars['thisRegionRightSide'] = thisRegionRightSide;
      }
      if (PrimChecks.agentset.any(dividersToTheLeft)) {
        thisRegionLeftSide = PrimChecks.list.max(PrimChecks.agentset.of(dividersToTheLeft, function() { return SelfManager.self().getPatchVariable("pxcor"); })); letVars['thisRegionLeftSide'] = thisRegionLeftSide;
      }
      let tankCapacityOfThisRegion = PrimChecks.math.div_unchecked(PrimChecks.math.mult(PrimChecks.math.minus(thisRegionRightSide, thisRegionLeftSide), world.observer.getGlobal("carrying-capacity")), 25); letVars['tankCapacityOfThisRegion'] = tankCapacityOfThisRegion;
      Errors.reportInContextCheck(reporterContext);
      return tankCapacityOfThisRegion;
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["carryingCapacityInThisRegion"] = temp;
  procs["CARRYING-CAPACITY-IN-THIS-REGION"] = temp;
  return procs;
})();
world.observer.setGlobal("initial-alleles-big-b", 50);
world.observer.setGlobal("see-body-cells?", false);
world.observer.setGlobal("initial-alleles-big-t", 50);
world.observer.setGlobal("initial-alleles-big-g", 50);
world.observer.setGlobal("initial-alleles-big-f", 50);
world.observer.setGlobal("carrying-capacity", 30);
world.observer.setGlobal("see-fish?", true);
world.observer.setGlobal("see-sex-cells?", false);
world.observer.setGlobal("auto-replace?", true);
world.observer.setGlobal("initial-females", 50);