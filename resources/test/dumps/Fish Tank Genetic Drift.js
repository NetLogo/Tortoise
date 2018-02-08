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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"add divider":{"name":"add divider","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[0,45,150,255,300,150],"ycors":[180,225,135,240,195,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cell-gamete-female":{"name":"cell-gamete-female","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,300,300],"ycors":[210,210,150],"type":"polygon","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"cell-gamete-male":{"name":"cell-gamete-male","editableColorIndex":13,"rotate":false,"elements":[{"xcors":[150,150,300],"ycors":[150,210,150],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"cell-somatic":{"name":"cell-somatic","editableColorIndex":0,"rotate":false,"elements":[{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish-body":{"name":"fish-body","editableColorIndex":11,"rotate":false,"elements":[{"xcors":[15,151,226,280,292,292,287,270,195,151,15],"ycors":[135,92,96,134,161,175,185,210,225,227,165],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":true},{"x":236,"y":125,"diam":34,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":256,"y1":143,"x2":264,"y2":132,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"fish-bones":{"name":"fish-bones","editableColorIndex":15,"rotate":false,"elements":[{"xmin":45,"ymin":150,"xmax":210,"ymax":165,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[210,210,270,240,285,285,270,225,195,210],"ycors":[180,210,195,180,165,150,120,90,135,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":236,"y":110,"diam":34,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":180,"y1":90,"x2":195,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true},{"x1":150,"y1":90,"x2":180,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true},{"x1":120,"y1":105,"x2":150,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true},{"x1":90,"y1":120,"x2":120,"y2":195,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true},{"x1":60,"y1":135,"x2":75,"y2":180,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true}]},"fish-fins":{"name":"fish-fins","editableColorIndex":2,"rotate":false,"elements":[{"xcors":[45,75,71,75,165,120],"ycors":[0,45,103,120,105,30],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":true},{"xcors":[75,45,90,105,135],"ycors":[180,240,225,270,210],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":true}]},"fish-forked-tail":{"name":"fish-forked-tail","editableColorIndex":5,"rotate":false,"elements":[{"xcors":[150,105,45,75,105,75,45,105,150],"ycors":[135,75,0,90,150,195,300,225,165],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":true}]},"fish-no-forked-tail":{"name":"fish-no-forked-tail","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[150,120,75,60,60,60,75,120,150],"ycors":[135,60,0,75,150,210,300,240,165],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"fish-spots":{"name":"fish-spots","editableColorIndex":15,"rotate":false,"elements":[{"x":84,"y":129,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":66,"y":161,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":92,"y":162,"diam":22,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":114,"y":99,"diam":24,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":39,"y":129,"diam":24,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":129,"y":144,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"fish-ventral-fin":{"name":"fish-ventral-fin","editableColorIndex":11,"rotate":false,"elements":[{"xcors":[60,15,75,90,150],"ycors":[180,240,225,270,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false}]},"gene-1":{"name":"gene-1","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":165,"type":"rectangle","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false},{"xmin":135,"ymin":105,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-2":{"name":"gene-2","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xmin":135,"ymin":90,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-3":{"name":"gene-3","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"xmin":135,"ymin":75,"xmax":150,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-4":{"name":"gene-4","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":135,"ymin":105,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-5":{"name":"gene-5","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-y":{"name":"gene-y","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"heart":{"name":"heart","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[60,60,90,120,150,165],"ycors":[105,135,180,210,225,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":60,"diam":90,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":150,"y":60,"diam":90,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[240,240,210,180,150,150],"ycors":[105,135,180,210,225,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"none":{"name":"none","editableColorIndex":0,"rotate":true,"elements":[]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"sheep":{"name":"sheep","editableColorIndex":0,"rotate":false,"elements":[{"xmin":151,"ymin":225,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":47,"ymin":225,"xmax":75,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":15,"ymin":75,"xmax":210,"ymax":225,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":135,"y":75,"diam":150,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":165,"y":76,"diam":116,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":15,"ymin":15,"xmax":285,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"subtract divider":{"name":"subtract divider","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[0,45,150,255,300,150],"ycors":[120,75,165,60,105,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
modelConfig.plots = [(function() {
  var name    = 'Tail Shape Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-F', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Tail Shape Alleles', 'big-F')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-f-alleles"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('small-f', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Tail Shape Alleles', 'small-f')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-f-alleles"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Tail Color Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-T', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Tail Color Alleles', 'big-T')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-t-alleles"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('small-t', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Tail Color Alleles', 'small-t')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-t-alleles"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Dorsal Fin Color Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-G', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'big-G')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-g-alleles"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('small-g', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'small-g')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-g-alleles"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Sex Chromosomes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('X', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Sex Chromosomes', 'X')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-x-chromosomes"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('Y', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Sex Chromosomes', 'Y')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-y-chromosomes"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'dorsal fin & spotting variations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('spots', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'spots')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-spots"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('no spots', plotOps.makePenOps, false, new PenBundle.State(6.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no spots')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-spots"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('green dorsal', plotOps.makePenOps, false, new PenBundle.State(67.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'green dorsal')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-green-dorsal-fins"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('no green', plotOps.makePenOps, false, new PenBundle.State(96.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no green')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-green-dorsal-fins"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Body Spot Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-B', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Body Spot Alleles', 'big-B')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-b-alleles"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('small-b', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('Body Spot Alleles', 'small-b')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-b-alleles"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# alleles", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'tail fin variations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('forked tail', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tail fin variations', 'forked tail')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-forked-tails"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('no fork', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tail fin variations', 'no fork')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-forked-tails"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('yellow tail', plotOps.makePenOps, false, new PenBundle.State(44.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tail fin variations', 'yellow tail')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-yellow-tail-fins"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('no yellow', plotOps.makePenOps, false, new PenBundle.State(95.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('tail fin variations', 'no yellow')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-yellow-tail-fins"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = '# of males & females';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('females', plotOps.makePenOps, false, new PenBundle.State(134.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('# of males & females', 'females')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-females"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('males', plotOps.makePenOps, false, new PenBundle.State(96.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    return workspace.rng.withClone(function() {
      return plotManager.withTemporaryContext('# of males & females', 'males')(function() {
        try {
          var reporterContext = false;
          var letVars = { };
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-males"));
        } catch (e) {
          if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "FISH", singular: "a-fish", varNames: ["sex", "bearing"] }, { name: "FISH-PARTS", singular: "a-fish-part", varNames: [] }, { name: "SOMATIC-CELLS", singular: "somatic-cell", varNames: ["sex"] }, { name: "GAMETE-CELLS", singular: "gamete-cell", varNames: ["sex"] }, { name: "ALLELES", singular: "allele", varNames: ["gene", "value", "owned-by-fish?", "side"] }, { name: "FISH-BONES", singular: "a-fish-bones", varNames: ["countdown"] }, { name: "FISH-ZYGOTES", singular: "a-fish-zygote", varNames: [] }, { name: "MOUSE-CURSORS", singular: "mouse-cursor", varNames: [] }])([], [])('breed [fish a-fish]\n\n;; fish parts include fins, tails, and spots - all of\n;; which are tied and attached to the main fish body\nbreed [fish-parts a-fish-part]\n\n;; fish are tied to somatic-cells.  Fish are what\n;; wander about (the body of the organism),\n;; while the somatic cell contains all the\n;; genetic information of the organism\nbreed [somatic-cells somatic-cell]\n\n;; sex cells that are hatched from somatic cells\n;; through a simplified form of meiosis\nbreed [gamete-cells gamete-cell]\n\n;; alleles are tied to somatic cells or gamete\n;; cells - 1 allele is assigned to one chromosome\nbreed [alleles allele]\n\nbreed [fish-bones a-fish-bones]     ;; used for visualization of fish death\nbreed [fish-zygotes a-fish-zygote]  ;; used for visualization of a fish mating event\n\n;; used for visualization of different types of mouse actions the user can do in the\n;; fish tank - namely removing fish and adding/subtracting dividers\nbreed [mouse-cursors mouse-cursor]\n\nfish-own          [sex bearing]\nsomatic-cells-own [sex]\ngamete-cells-own  [sex]\nfish-bones-own    [countdown]\nalleles-own       [gene value owned-by-fish? side]\n\npatches-own [type-of-patch divider-here?]\n\nglobals [\n\n  ;; for keeping track of the # of alleles of each type\n  #-big-B-alleles  #-small-b-alleles\n  #-big-T-alleles  #-small-t-alleles\n  #-big-F-alleles  #-small-f-alleles\n  #-big-G-alleles  #-small-g-alleles\n  #-y-chromosomes  #-x-chromosomes\n\n  ;; globals for keeping track of default values for\n  ;; shapes and colors used for phenotypes\n  water-color\n  green-dorsal-fin-color  no-green-dorsal-fin-color\n  yellow-tail-fin-color   no-yellow-tail-fin-color\n  male-color              female-color\n  spots-shape             no-spots-shape\n  forked-tail-shape       no-forked-tail-shape\n\n  ;;  globals for keeping track of phenotypes\n  #-of-green-dorsal-fins  #-of-no-green-dorsal-fins\n  #-of-yellow-tail-fins   #-of-no-yellow-tail-fins\n  #-of-spots              #-of-no-spots\n  #-of-forked-tails       #-of-no-forked-tails\n  #-of-males              #-of-females\n\n  ;; keeps track of whether the mouse button was down on last tick\n  mouse-continuous-down?\n\n  num-fish-removed\n  num-fish-born\n  num-fish-in-tank\n  fish-forward-step      ;; size of movement steps each tick\n  gamete-forward-step    ;; size of movement steps each tick\n\n  ;; used for spacing the chromosomes out in the\n  ;; karyotypes of the somatic cells and gametes\n  intra-chromosome-pair-spacing\n  inter-chromosome-pair-spacing\n\n  size-of-karyotype-background-for-cells\n\n  initial-#-females\n  initial-#-males\n]\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;; setup procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto setup\n  clear-all\n  set mouse-continuous-down? false\n  set intra-chromosome-pair-spacing 0.20\n  set inter-chromosome-pair-spacing 0.55\n  set fish-forward-step 0.04\n  set num-fish-removed 0\n  set num-fish-born 0\n  set num-fish-in-tank 0\n\n  ;; the size of the large pink rectangle used as the\n  ;; background for the cell or karyotype of the cell\n  set size-of-karyotype-background-for-cells 5.2\n\n  set initial-#-females (floor ((initial-females / 100) * carrying-capacity))\n  set initial-#-males carrying-capacity - initial-#-females\n\n  set green-dorsal-fin-color    [90 255 90 255]\n  set no-green-dorsal-fin-color [176 196 222 255]\n  set yellow-tail-fin-color     [255 255 0 255]\n  set no-yellow-tail-fin-color  [176 196 255 255]\n  set female-color              [255 150 150 255]\n  set male-color                [150 150 255 255]\n  set water-color               blue - 1.5\n\n  set spots-shape                 \"fish-spots\"\n  set no-spots-shape              \"none\"\n  set forked-tail-shape           \"fish-forked-tail\"\n  set no-forked-tail-shape        \"fish-no-forked-tail\"\n  set-default-shape fish          \"fish-body\"\n  set-default-shape somatic-cells \"cell-somatic\"\n  set-default-shape fish-bones    \"fish-bones\"\n\n  create-mouse-cursors 1 [\n    set shape \"x\"\n    set hidden? true\n    set color red\n    set heading 0\n  ]\n\n  set-tank-regions\n  create-initial-gene-pool\n  create-initial-fish\n  visualize-tank\n  visualize-fish-and-alleles\n  reset-ticks\nend\n\n\nto set-tank-regions\n  let min-pycor-edge min-pycor  let max-pycor-edge max-pycor\n  let water-patches nobody\n  ask patches [\n    set divider-here? false\n    set type-of-patch \"water\"\n    ;; water edge are the patches right up against the tank wall on the inside of the\n    ;; tank - they are used to determine whether to turn the fish around as they are\n    ;; moving about the tank\n    if pycor =  (max-pycor-edge - 2) or\n      pycor = (min-pycor-edge + 2) or\n      pxcor = left-side-of-water-in-tank or\n      pxcor = right-side-of-water-in-tank [\n      set type-of-patch \"water-edge\"\n    ]\n    if pycor >= (max-pycor-edge - 1) [\n      set type-of-patch \"air\"\n    ]\n    if pxcor <= (left-side-of-water-in-tank - 1) or\n      pxcor >= (right-side-of-water-in-tank + 1) or\n      pycor <= (min-pycor-edge + 1) [\n      set type-of-patch \"tank-wall\"\n    ]\n    if pycor = (max-pycor-edge) or\n      pycor = (min-pycor-edge) or\n      pxcor = (left-side-of-water-in-tank - 2) or\n      pxcor >= (right-side-of-water-in-tank + 2) [\n      set type-of-patch \"air\"\n    ]\n  ]\n  set water-patches  patches with [type-of-patch = \"water\"]\nend\n\n\nto create-initial-gene-pool\n  let num-big-alleles 0\n  let initial-number-fish (carrying-capacity)\n\n  set num-big-alleles  round ((initial-alleles-big-b * 2 *  initial-number-fish) / 100)\n  make-initial-alleles-for-gene 1 \"B\" \"b\" num-big-alleles\n  set num-big-alleles  round ((initial-alleles-big-t * 2 *  initial-number-fish) / 100)\n  make-initial-alleles-for-gene 2 \"T\" \"t\" num-big-alleles\n  set num-big-alleles  round ((initial-alleles-big-f * 2 *  initial-number-fish) / 100)\n  make-initial-alleles-for-gene 3 \"F\" \"f\" num-big-alleles\n  set num-big-alleles  round ((initial-alleles-big-g * 2 *  initial-number-fish) / 100)\n  make-initial-alleles-for-gene 4 \"G\" \"g\" num-big-alleles\n\n  make-initial-alleles-for-gene 5 \"Y\" \"X\" initial-#-males\nend\n\n\nto create-initial-fish\n  ;; makes the cells for the initial fish\n  create-somatic-cells initial-#-males [set sex \"male\"]\n  create-somatic-cells initial-#-females [set sex \"female\"]\n  ask somatic-cells [setup-new-somatic-cell-attributes]\n  ;; randomly sorts out the gene pool to each somatic cell\n  distribute-gene-pool-to-somatic-cells\n  ;; grows the body parts from the resulting genotype, and distributes the fish\n  ask somatic-cells [grow-fish-parts-from-somatic-cell]\n  distribute-fish-in-tank\nend\n\n\nto setup-new-somatic-cell-attributes\n  ;; somatic cells are the same as body cells - they are the rectangle shape that is\n  ;; tied to the fish and chromosomes that looks like a karyotype\n  set heading 0\n  set breed somatic-cells\n  set color [100 100 100 100]\n  set size size-of-karyotype-background-for-cells\n  set hidden? true\nend\n\n\nto distribute-fish-in-tank\n   let water-patches patches with [type-of-patch = \"water\"]\n   let water-patch nobody\n   ask fish [\n     move-to one-of water-patches\n   ]\nend\n\n\nto make-initial-alleles-for-gene [gene-number allele-1 allele-2 num-big-alleles ]\n  let initial-number-fish initial-#-males + initial-#-females\n  create-alleles 2 * (initial-number-fish) [\n    set gene gene-number\n    set shape (word \"gene-\" gene-number)\n    set heading 0\n    set owned-by-fish? false\n    set value allele-2\n    set color  [0 0 0 255]\n    set label-color color\n    set label (word value \"     \" )\n  ]\n  ;; after coloring all the alleles with black band on chromosomes with the\n  ;; dominant allele label, now go back and select the correct proportion of\n  ;; these to recolor code as recessive alleles with white bands on chromosomes\n  ;; and add recessive letter label\n  ask n-of num-big-alleles  alleles with [gene = gene-number] [\n    set value allele-1\n    set color [220 220 220 255]\n    set label (word value \"     \" )\n    set label-color color\n    ]\nend\n\n\n\nto distribute-gene-pool-to-somatic-cells\n  ;; randomly selects some chromosomes for this cell\n  let this-somatic-cell nobody\n  let last-sex-allele \"\"\n\n  ask somatic-cells [\n    set this-somatic-cell self\n    foreach [ 1 2 3 4 ] [ n ->\n      ;; assign one of the alleles to appear on the left side of the chromosome pair\n      position-and-link-alleles self n \"left\"\n      ;; assign the other allele to appear on the right side\n      position-and-link-alleles self n \"right\"\n    ]\n\n    ;; now assign the sex chromosome pair, putting one of the Xs on the left,\n    ;; and the other chromosome (whether it is an X or } on the right\n    ask one-of alleles with [not owned-by-fish? and gene = 5 and value = \"X\"] [\n       set owned-by-fish? true\n       set size 1.2\n       set xcor ((inter-chromosome-pair-spacing * 4) + .1)\n       set ycor -0.4\n       set side \"left\"\n       create-link-from this-somatic-cell  [\n         set hidden? true\n         set tie-mode \"fixed\"\n         tie\n       ]\n    ]\n    ifelse sex = \"male\" [ set last-sex-allele \"Y\" ] [ set last-sex-allele \"X\" ]\n    ask one-of alleles with [\n      not owned-by-fish? and gene = 5 and value = last-sex-allele\n    ] [\n      set owned-by-fish? true\n      set size 1.2\n      set xcor ((inter-chromosome-pair-spacing * 4) + intra-chromosome-pair-spacing + .1)\n      set ycor -0.4\n      set side \"right\"\n      create-link-from this-somatic-cell [\n        set hidden? true\n        set tie-mode \"fixed\"\n        tie\n      ]\n    ]\n  ]\nend\n\n\nto position-and-link-alleles [this-somatic-cell gene-number which-side]\n  let pair-shift-right 0\n  let side-shift 0\n\n  ;; adjusts the spacing between chromosome pairs (1-4( so that one of each pair\n  ;; is moved to the left and one of each pair is moved to the right\n  ifelse which-side = \"right\"\n    [ set side-shift intra-chromosome-pair-spacing ]\n    [ set side-shift 0 ]\n  set pair-shift-right ((inter-chromosome-pair-spacing * gene-number) - .45)\n\n  ask one-of alleles with [not owned-by-fish? and gene = gene-number] [\n    set owned-by-fish? true\n    set side which-side\n    set size 1.2\n    set xcor ([xcor] of this-somatic-cell + (pair-shift-right + side-shift))\n    set ycor ([ycor] of this-somatic-cell - 0.4)\n    create-link-from this-somatic-cell [\n      set hidden? true\n      set tie-mode \"fixed\"\n      tie\n    ]\n  ]\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;; runtime-procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\nto go\n   wander\n   update-statistics\n   detect-fish-outside-the-water\n   detect-and-move-fish-at-inside-tank-boundary\n   auto-selection\n   clean-up-fish-bones\n   if auto-replace? [find-potential-mates]\n   move-gametes-together\n   convert-zygote-into-somatic-cell\n   detect-mouse-selection-event\n   visualize-fish-and-alleles\n\n   visualize-tank\n   tick\nend\n\n\nto auto-selection\n  if auto-replace? [\n    ;; use EVERY to limit the rate of selection\n    ;; to slow things down for visualization purposes\n    every 0.25 [\n      ;;let under-carrying-capacity carrying-capacity -  num-fish-in-tank\n      if any? fish [\n        ask one-of fish [\n          if both-sexes-in-this-fishs-tank-region? [\n            remove-this-fish\n          ]\n        ]\n      ]\n    ]\n  ]\nend\n\n\n\nto move-gametes-together\n  ;; moves the male sex cell (gamete) toward its target\n  ;; female sex cell it will fertilize (zygote).\n  let my-zygote nobody\n  let distance-to-zygote 0\n  ;; if the user as the see-sex-cells? switch on then slow down their motion\n  ifelse see-sex-cells? [ set gamete-forward-step 0.08] [ set gamete-forward-step 1.0]\n\n   ask gamete-cells [\n     set my-zygote one-of fish-zygotes with [in-link-neighbor? myself]\n     set distance-to-zygote distance my-zygote\n     if distance-to-zygote > 0\n      [ face my-zygote\n        ifelse distance-to-zygote > gamete-forward-step [fd gamete-forward-step ] [fd distance-to-zygote]\n        set heading 0\n      ]\n   ]\nend\n\n\nto convert-zygote-into-somatic-cell\n  ;; upon arriving at the female sex cell the male sex cell will fertilize\n  ;; it and disappear the zygote (shown as a heart) will convert into a\n  ;; somatic cell and a fish will immediately appear (skipping the time\n  ;; it takes for the embryo to form)\n  let female-sex-cell-alleles nobody\n  let male-sex-cell-alleles nobody\n  let male-gamete nobody\n  let female-gamete nobody\n  let this-somatic-cell nobody\n\n  ask fish-zygotes [\n   set male-gamete gamete-cells with [out-link-neighbor? myself and sex = \"male\"]\n   set female-gamete gamete-cells with [out-link-neighbor? myself and sex = \"female\"]\n   if any? male-gamete and any? female-gamete [\n     if distance one-of male-gamete <= .01 and distance one-of female-gamete <= .01  [\n       ;; close enough for fertilization to be complete\n       setup-new-somatic-cell-attributes\n       set this-somatic-cell self\n       ask male-gamete [\n         set male-sex-cell-alleles alleles-that-belong-to-this-gamete\n         die\n       ]\n       ask female-gamete [\n         set female-sex-cell-alleles alleles-that-belong-to-this-gamete\n         die\n       ]\n       ask male-sex-cell-alleles [\n         create-link-from this-somatic-cell [\n           set hidden? true\n           set tie-mode \"fixed\"\n           tie\n         ]\n       ]\n       ask female-sex-cell-alleles [\n         create-link-from this-somatic-cell [\n           set hidden? true\n           set tie-mode \"fixed\"\n           tie\n         ]\n       ]\n       align-alleles-for-this-somatic-cell this-somatic-cell\n       set sex sex-phenotype\n       grow-fish-parts-from-somatic-cell\n       set num-fish-born num-fish-born + 1\n     ]\n   ]\n ]\nend\n\n\nto align-alleles-for-this-somatic-cell [this-zygote]\n  ;; when gametes merge they may both have chromosomes on the right\n  ;; (for each matching pair) or both on the left\n  ;; this procedure moves one of them over if that is the case\n  let all-alleles alleles with [in-link-neighbor? this-zygote]\n  foreach [1 2 3 4 5] [ this-gene ->\n    if count all-alleles with [gene = this-gene and side = \"left\"]  > 1 [\n      ask one-of all-alleles with [gene = this-gene] [\n        set heading 90\n        forward intra-chromosome-pair-spacing\n        set side \"right\"\n      ]\n    ]\n    if count all-alleles with [gene = this-gene and side = \"right\"] > 1 [\n      ask one-of all-alleles with [gene = this-gene] [\n        set heading 90\n        back\n        intra-chromosome-pair-spacing\n        set side \"left\"\n      ]\n    ]\n  ]\nend\n\n\nto find-potential-mates\n  let mom nobody\n  let dad nobody\n  let xcor-dad 0\n  let turtles-in-this-region nobody\n  let potential-mates nobody\n  let all-fish-and-fish-zygotes nobody\n\n  if any? somatic-cells with [sex = \"male\"] [\n    ask one-of somatic-cells with [ sex = \"male\" ] [\n      set dad self\n      set xcor-dad xcor\n    ]\n    ask dad [\n      ;; if  parent genetic information for sexual reproduction\n      ;; still exists in the gene pool in this region\n      set turtles-in-this-region other-turtles-in-this-turtles-tank-region\n    ]\n    set all-fish-and-fish-zygotes turtles-in-this-region with [\n      breed = fish or breed = fish-zygotes\n    ]\n    set potential-mates turtles-in-this-region with [\n      breed = somatic-cells and sex = \"female\"\n    ]\n    if any? potential-mates [\n       ask one-of potential-mates  [ set mom self ]\n       ;;; only reproduce up to the carrying capacity in this region allowed\n       let this-carrying-capacity  carrying-capacity-in-this-region xcor-dad\n       if count all-fish-and-fish-zygotes < this-carrying-capacity [\n         reproduce-offspring-from-these-two-parents mom dad\n       ]\n    ]\n  ]\nend\n\n\nto reproduce-offspring-from-these-two-parents [mom dad]\n  let child nobody\n    ask mom [\n      hatch 1 [\n       set heading 0\n       set breed fish-zygotes\n       set size 1\n       set shape \"heart\"\n       set color red\n       set child self\n      ]\n\n    ]\n    ask mom [ link-alleles-to-gametes-and-gametes-to-zygote child ]\n    ask dad [ link-alleles-to-gametes-and-gametes-to-zygote child ]\nend\n\n\nto link-alleles-to-gametes-and-gametes-to-zygote [child]\n  let this-new-gamete-cell nobody\n  hatch 1 [\n    set breed gamete-cells\n    set heading 0\n    create-link-to child [set hidden? false] ;; link these gametes to the child\n    ifelse sex = \"male\"\n      [set shape \"cell-gamete-male\"]\n      [set shape \"cell-gamete-female\"]\n\n       set this-new-gamete-cell self\n    ]\n\n  foreach [1 2 3 4 5] [ this-gene ->\n    ask n-of 1 alleles with [in-link-neighbor? myself and  gene = this-gene]\n    [hatch 1 [set owned-by-fish? false\n       create-link-from this-new-gamete-cell  [set hidden? true  set tie-mode \"fixed\" tie]\n      ]\n    ]\n  ]\n\nend\n\n\nto wander\n  ask fish [\n    set heading bearing\n    rt random-float 70 lt random-float 70\n    set bearing heading\n    fd fish-forward-step\n    set heading 0\n    ]\n  ask somatic-cells [set heading 0]\nend\n\n\n\nto detect-fish-outside-the-water\n     ask fish with [type-of-patch != \"water\" and type-of-patch != \"water-edge\"] [  remove-this-fish  ]\nend\n\n\nto detect-and-move-fish-at-inside-tank-boundary\n   let nearest-water-patch nobody\n   let water-patches patches with [type-of-patch = \"water\" and not divider-here?]\n   ask fish [\n    set nearest-water-patch  min-one-of water-patches [distance myself]\n    if type-of-patch = \"tank-wall\" or type-of-patch = \"water-edge\"   [\n      set heading towards nearest-water-patch\n      fd fish-forward-step * 2\n      set heading 0\n      set bearing  random-float 360\n    ]\n    if divider-here? [move-to nearest-water-patch]\n   ]\nend\n\n\nto clean-up-fish-bones\n  let bone-transparency 0\n  let color-list []\n   ask fish-bones [  ;;; fade away progressively the fish bone shape until the countdown in complete\n     set countdown countdown - 1\n     set bone-transparency (countdown * 255 / 50)\n     set color-list lput bone-transparency [255 255 255]\n     set color color-list\n     if countdown <= 0 [die]\n   ]\nend\n\n\nto remove-this-fish\n set num-fish-removed num-fish-removed + 1\n hatch 1 [\n   ;; make the fish bones for visualization of this fishes death\n   set breed fish-bones\n   set color white\n   set countdown 25\n ]\n ask out-link-neighbors [\n   ;; ask the somatic cells and the fish-parts and the alleles attached to this fish to die first\n   ask out-link-neighbors [ die ]\n   die\n ]\n die\nend\n\n\nto detect-mouse-selection-event\n\n  let p-mouse-xcor mouse-xcor\n  let p-mouse-ycor mouse-ycor\n  let p-type-of-patch [type-of-patch] of patch p-mouse-xcor p-mouse-ycor\n  let mouse-was-just-down? mouse-down?\n\n  ask mouse-cursors [\n    setxy p-mouse-xcor p-mouse-ycor\n    ;;;;;;  cursor visualization ;;;;;;;;;;;;\n    if (p-type-of-patch = \"water\") [\n      set hidden? false\n      set shape \"x\"\n      set label-color white\n      set label \"remove fish\"\n    ]\n    if divider-here? and p-type-of-patch = \"tank-wall\" [\n      set hidden? false\n      set shape \"subtract divider\"\n      set label-color white\n      set label \"remove divider\"\n    ]\n    if not divider-here? and p-type-of-patch = \"tank-wall\" [\n      set hidden? false\n      set shape \"add divider\"\n      set label-color white\n      set label \"add divider\"\n    ]\n    if (p-type-of-patch != \"water\" and p-type-of-patch != \"tank-wall\") [\n      set hidden? true\n      set shape \"x\"\n      set label \"\"\n    ]\n    ;;;;; cursor actions ;;;;;;;;;;;;;;;\n    if mouse-was-just-down? [\n      ask fish-here [remove-this-fish]\n    ]\n    if (mouse-was-just-down? and\n      not mouse-continuous-down? and\n      p-type-of-patch = \"tank-wall\" and\n      pycor = (min-pycor + 1) and\n      pxcor > (min-pxcor + 1) and\n      pxcor < (max-pxcor - 1)) [\n      set divider-here? not divider-here?\n      let divider-xcor pxcor\n      ask patches with [\n        (type-of-patch = \"water\" or type-of-patch = \"water-edge\") and\n        pxcor = divider-xcor\n      ] [\n        set divider-here? not divider-here?\n      ]\n    ]\n    ifelse not mouse-inside? [set hidden? true][set hidden? false]\n  ]\n\n  ifelse mouse-was-just-down?\n    [ set mouse-continuous-down? true ]\n    [ set mouse-continuous-down? false ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;; calculate statistics procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto update-statistics\n  set num-fish-in-tank (count fish )\n\n  set #-big-B-alleles   count alleles with [value = \"B\"]\n  set #-small-b-alleles count alleles with [value = \"b\"]\n  set #-big-T-alleles   count alleles with [value = \"T\"]\n  set #-small-t-alleles count alleles with [value = \"t\"]\n  set #-big-F-alleles   count alleles with [value = \"F\"]\n  set #-small-f-alleles count alleles with [value = \"f\"]\n  set #-big-G-alleles   count alleles with [value = \"G\"]\n  set #-small-g-alleles count alleles with [value = \"g\"]\n  set #-y-chromosomes   count alleles with [value = \"Y\"]\n  set #-x-chromosomes   count alleles with [value = \"X\"]\n\n  set #-of-green-dorsal-fins     count fish-parts with [color = green-dorsal-fin-color]\n  set #-of-no-green-dorsal-fins  count fish-parts with [color = no-green-dorsal-fin-color]\n  set #-of-yellow-tail-fins      count fish-parts with [color = yellow-tail-fin-color]\n  set #-of-no-yellow-tail-fins   count fish-parts with [color = no-yellow-tail-fin-color]\n  set #-of-spots               count fish-parts with [shape = spots-shape and hidden? = false]\n  set #-of-no-spots            count fish-parts with [shape = spots-shape and hidden? = true]\n  set #-of-forked-tails        count fish-parts with [shape = forked-tail-shape]\n  set #-of-no-forked-tails     count fish-parts with [shape = no-forked-tail-shape]\n  set #-of-males               count fish with [sex = \"male\"]\n  set #-of-females             count fish with [sex = \"female\"]\n\nend\n\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;; visualization-procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\nto visualize-tank\n   ask patches with [(type-of-patch = \"water\" or type-of-patch = \"water-edge\")] [\n     ifelse not divider-here?\n       [ set pcolor water-color ]\n       [ set pcolor gray - 3.5 ]\n   ]\n   ask patches with [type-of-patch = \"tank-wall\" ] [\n     ifelse not divider-here?\n       [ set pcolor gray - 3 ]\n       [ set pcolor gray - 4 ]\n     ]\n   ask patches with [type-of-patch = \"air\" ] [\n     set pcolor gray + 3\n   ]\nend\n\n\nto visualize-fish-and-alleles\n  ifelse see-body-cells? [\n    ask somatic-cells [\n      set hidden? false\n      ask alleles with [ in-link-neighbor? myself ] [\n        set hidden? false\n      ]\n    ]\n  ] [\n    ask somatic-cells [\n      set hidden? true\n      ask alleles with [ in-link-neighbor? myself ] [\n        set hidden? true\n      ]\n    ]\n  ]\n  ifelse see-sex-cells? [\n    ask gamete-cells [\n      set hidden? false\n      ask alleles with [ in-link-neighbor? myself ] [\n        set hidden? false\n      ]\n    ]\n    ask fish-zygotes [\n      set hidden? false\n    ]\n  ] [\n    ask gamete-cells [\n      set hidden? true\n      ask alleles with [ in-link-neighbor? myself ] [\n        set hidden? true\n      ]\n    ]\n    ask fish-zygotes [\n      set hidden? true\n    ]\n  ]\n  ifelse see-fish? [\n    ask fish [\n      set hidden? false\n    ]\n    ask fish-parts [\n      set hidden? false\n    ]\n  ] [\n    ask fish [\n      set hidden? true\n    ]\n    ask fish-parts [\n      set hidden? true\n    ]\n  ]\nend\n\n\nto grow-fish-parts-from-somatic-cell\n  let this-fish-body nobody\n\n  hatch 1 [\n    set breed fish\n    set bearing  random-float 360\n    set heading 0\n    set size 1\n    set this-fish-body self\n    if sex = \"male\" [set color male-color]\n    if sex = \"female\" [set color female-color]\n  ]\n  create-link-from  this-fish-body  [\n    ;; somatic cell will link to the fish body -\n    ;; thus following the fish body around as it moves\n    set hidden? true\n    set tie-mode \"fixed\"\n    tie\n  ]\n\n  hatch 1 [\n    set breed fish-parts  ;;;make tail\n    set breed fish-parts\n    set size 1\n    set shape tail-shape-phenotype\n    set color tail-color-phenotype\n    set heading -90 fd .4\n    create-link-from this-fish-body [\n      ;; fish-parts will link to the fish body -\n      ;; thus following the fish body around as it moves\n      set hidden? true\n      set tie-mode \"fixed\"\n      tie\n    ]\n  ]\n  hatch 1 [                      ;;;make fins\n    set breed fish-parts\n    set size 1\n    set shape \"fish-fins\"\n    set color dorsal-fin-color-phenotype\n    create-link-from this-fish-body  [\n      ;; fish-parts will link to the fish body -\n      ;; thus following the fish body around as it moves\n      set hidden? true\n      set tie-mode \"fixed\"\n      tie\n    ]\n  ]\n\n  hatch 1 [                      ;;;make spots\n    set breed fish-parts\n    set size 1\n    set shape rear-spots-phenotype\n    set color [ 0 0 0 255]\n    create-link-from this-fish-body [\n      ;; fish-parts will link to the fish body -\n      ;; thus following the fish body around as it moves\n      set hidden? true\n      set tie-mode \"fixed\"\n      tie\n    ]\n  ]\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;; phenotype reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\nto-report has-at-least-one-dominant-set-of-instructions-for [dominant-allele]\n  let this-somatic-cell self\n  let #-of-dominant-alleles count alleles with [in-link-neighbor? this-somatic-cell  and value = dominant-allele]\n  ifelse #-of-dominant-alleles > 0  [report true][report false]   ;; if it has at least one set of instructions (DNA) on how to build the protein reports true\nend\n\n\nto-report tail-shape-phenotype\n  let this-shape \"\"\n  let this-fish  myself\n  ask myself ;; the somatic-cell\n  [\n    ifelse  has-at-least-one-dominant-set-of-instructions-for \"F\"\n       [set this-shape forked-tail-shape]      ;; tail fin forking results if protein is produced\n       [set this-shape no-forked-tail-shape]   ;; no tail fin forking results if protein is not produced (underlying tissue is continuous triangle shape)\n  ]\n  report this-shape\nend\n\n\nto-report rear-spots-phenotype\n  let this-spots-shape \"\"\n  ask myself\n  [\n    ifelse has-at-least-one-dominant-set-of-instructions-for \"B\"\n       [set this-spots-shape spots-shape]    ;; spots on the rear of the fish result if protein is produced\n       [set this-spots-shape no-spots-shape]     ;; no spots on the rear of the fish result if protein is not produced\n  ]\n  report this-spots-shape\nend\n\n\nto-report dorsal-fin-color-phenotype\n  let this-color []\n  ask myself\n  [\n    ifelse  has-at-least-one-dominant-set-of-instructions-for \"G\"\n      [set this-color green-dorsal-fin-color  ]      ;; green color results in dorsal fins if protein is produced\n      [set this-color no-green-dorsal-fin-color ]    ;; no green color results in dorsal fins if protein is not produced (underlying tissue color is grayish)\n  ]\n  report this-color\nend\n\n\nto-report tail-color-phenotype\n  let this-color []\n  let this-fish  myself\n  ask myself\n  [\n    ifelse  has-at-least-one-dominant-set-of-instructions-for \"T\"\n       [set this-color yellow-tail-fin-color ]     ;; yellow color results in tail fins results if protein is produced\n       [set this-color no-yellow-tail-fin-color ]  ;; yellow color results in tail fins if protein is not produced (underlying tissue is continuous triangle shape)\n  ]\n  report this-color\nend\n\n\nto-report sex-phenotype\n  let this-sex \"\"\n  let this-cell self\n  ifelse  has-at-least-one-dominant-set-of-instructions-for \"Y\"\n     [set this-sex \"male\"]\n     [set this-sex \"female\"]\n   report this-sex\nend\n\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;; other reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n\n\nto-report alleles-that-belong-to-this-gamete\n  report alleles with [in-link-neighbor? myself]\nend\n\n\nto-report left-side-of-water-in-tank\n  report (min-pxcor) + 2\nend\n\n\nto-report right-side-of-water-in-tank\n  report  (max-pxcor) - 2\nend\n\n\n\nto-report other-turtles-in-this-turtles-tank-region\n  ;; when dividers are up, it reports how many turtles are in this region for this turtle\n  let turtles-in-this-region nobody\n  let xcor-of-this-turtle xcor\n  let this-region-left-side left-side-of-water-in-tank\n  let this-region-right-side right-side-of-water-in-tank\n  let dividers-to-the-right patches with [divider-here? and pxcor > xcor-of-this-turtle]\n  let dividers-to-the-left  patches with [divider-here? and pxcor < xcor-of-this-turtle]\n\n  if any? dividers-to-the-right [set this-region-right-side min [pxcor] of dividers-to-the-right ]\n  if any? dividers-to-the-left  [set this-region-left-side max [pxcor] of dividers-to-the-left   ]\n\n  set turtles-in-this-region turtles with [xcor >= this-region-left-side and xcor <= this-region-right-side]\n  report turtles-in-this-region\nend\n\n\nto-report both-sexes-in-this-fishs-tank-region?\n  let fish-in-this-region other-turtles-in-this-turtles-tank-region with [breed = fish]\n  let male-fish-in-this-region fish-in-this-region with [sex = \"male\"]\n  let female-fish-in-this-region fish-in-this-region with [sex = \"female\"]\n  ifelse (any? male-fish-in-this-region and any? female-fish-in-this-region ) [report true] [report false]\nend\n\n\n\nto-report carrying-capacity-in-this-region [this-xcor]\n  let this-region-left-side left-side-of-water-in-tank\n  let this-region-right-side right-side-of-water-in-tank\n  let dividers-to-the-right patches with [divider-here? and pxcor > this-xcor]\n  let dividers-to-the-left  patches with [divider-here? and pxcor < this-xcor]\n\n  if any? dividers-to-the-right [ set this-region-right-side min [pxcor] of dividers-to-the-right ]\n  if any? dividers-to-the-left  [ set this-region-left-side max [pxcor] of dividers-to-the-left   ]\n  let tank-capacity-of-this-region (this-region-right-side - this-region-left-side) * carrying-capacity / 25\n  report tank-capacity-of-this-region\nend\n\n\n; Copyright 2011 Uri Wilensky.\n; See Info tab for full copyright and license.')([{"left":610,"top":10,"right":1458,"bottom":467,"dimensions":{"minPxcor":0,"maxPxcor":29,"minPycor":0,"maxPycor":15,"patchSize":28,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-b","left":185,"top":150,"right":365,"bottom":183,"display":"initial-alleles-big-b","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_38 = procedures[\"SETUP\"]();\n  if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"setup","left":15,"top":10,"right":93,"bottom":44,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"see-body-cells?","left":15,"top":135,"right":175,"bottom":168,"display":"see-body-cells?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  let _maybestop_33_35 = procedures[\"GO\"]();\n  if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"go","left":95,"top":10,"right":175,"bottom":44,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-t","left":185,"top":505,"right":365,"bottom":538,"display":"initial-alleles-big-t","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-g","left":185,"top":270,"right":365,"bottom":303,"display":"initial-alleles-big-g","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-f","left":185,"top":390,"right":365,"bottom":423,"display":"initial-alleles-big-f","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Tail Shape Alleles', 'big-F')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-f-alleles\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"big-F","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-f-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Tail Shape Alleles', 'small-f')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-f-alleles\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"small-f","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-f-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Tail Shape Alleles","left":370,"top":370,"right":605,"bottom":490,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-F","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-f-alleles","type":"pen"},{"display":"small-f","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-f-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Tail Color Alleles', 'big-T')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-t-alleles\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"big-T","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-t-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Tail Color Alleles', 'small-t')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-t-alleles\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"small-t","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-t-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Tail Color Alleles","left":370,"top":490,"right":605,"bottom":610,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-T","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-t-alleles","type":"pen"},{"display":"small-t","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-t-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'big-G')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-g-alleles\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"big-G","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-g-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'small-g')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-g-alleles\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"small-g","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-g-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Dorsal Fin Color Alleles","left":370,"top":250,"right":605,"bottom":370,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-G","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-g-alleles","type":"pen"},{"display":"small-g","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-g-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Sex Chromosomes', 'X')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-x-chromosomes\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"X","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-x-chromosomes","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Sex Chromosomes', 'Y')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-y-chromosomes\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"Y","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-y-chromosomes","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Sex Chromosomes","left":370,"top":10,"right":605,"bottom":130,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"X","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-x-chromosomes","type":"pen"},{"display":"Y","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-y-chromosomes","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"2","compiledMax":"60","compiledStep":"1","variable":"carrying-capacity","left":15,"top":50,"right":175,"bottom":83,"display":"carrying-capacity","min":"2","max":"60","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"display":"TT / Tt / tT --> yellow tail\n              tt --> no yellow","left":201,"top":561,"right":357,"bottom":593,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype -->  Phenotype","left":200,"top":543,"right":365,"bottom":573,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype ---> Phenotype","left":200,"top":65,"right":366,"bottom":84,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype","left":194,"top":186,"right":356,"bottom":205,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype\n","left":204,"top":303,"right":375,"bottom":321,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype","left":200,"top":423,"right":364,"bottom":442,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'spots')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-spots\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"spots","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-spots","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no spots')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-spots\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"no spots","interval":1,"mode":0,"color":-5987164,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-spots","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'green dorsal')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-green-dorsal-fins\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"green dorsal","interval":1,"mode":0,"color":-8330359,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-green-dorsal-fins","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no green')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-green-dorsal-fins\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"no green","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-green-dorsal-fins","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"dorsal fin & spotting variations","left":611,"top":490,"right":909,"bottom":610,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"spots","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-spots","type":"pen"},{"display":"no spots","interval":1,"mode":0,"color":-5987164,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-spots","type":"pen"},{"display":"green dorsal","interval":1,"mode":0,"color":-8330359,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-green-dorsal-fins","type":"pen"},{"display":"no green","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-green-dorsal-fins","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"display":"FF / Ff / fF --> forked tail\n             ff --> no fork","left":207,"top":444,"right":369,"bottom":478,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"GG / Gg / gG --> green dorsal fin\n                gg --> no green fin","left":195,"top":320,"right":365,"bottom":348,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Body Spot Alleles', 'big-B')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-b-alleles\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"big-B","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-b-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('Body Spot Alleles', 'small-b')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-b-alleles\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"small-b","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-b-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Body Spot Alleles","left":370,"top":130,"right":605,"bottom":250,"xAxis":"time","yAxis":"# alleles","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-B","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-b-alleles","type":"pen"},{"display":"small-b","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-b-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"display":"XX  --> female\nXY  --> male","left":241,"top":85,"right":355,"bottom":118,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"BB / Bb / bB  -->  black spots\n              bb  --> no black spots","left":200,"top":205,"right":382,"bottom":246,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"variable":"see-fish?","left":15,"top":100,"right":175,"bottom":133,"display":"see-fish?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"see-sex-cells?","left":15,"top":170,"right":175,"bottom":203,"display":"see-sex-cells?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('tail fin variations', 'forked tail')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-forked-tails\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"forked tail","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-forked-tails","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('tail fin variations', 'no fork')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-forked-tails\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"no fork","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-forked-tails","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('tail fin variations', 'yellow tail')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-yellow-tail-fins\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"yellow tail","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-yellow-tail-fins","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('tail fin variations', 'no yellow')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-yellow-tail-fins\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"no yellow","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-yellow-tail-fins","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"tail fin variations","left":911,"top":490,"right":1183,"bottom":610,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"forked tail","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-forked-tails","type":"pen"},{"display":"no fork","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-forked-tails","type":"pen"},{"display":"yellow tail","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-yellow-tail-fins","type":"pen"},{"display":"no yellow","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-yellow-tail-fins","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('# of males & females', 'females')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-females\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"females","interval":1,"mode":0,"color":-4757638,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-females","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {\n  return workspace.rng.withClone(function() {\n    return plotManager.withTemporaryContext('# of males & females', 'males')(function() {\n      try {\n        var reporterContext = false;\n        var letVars = { };\n        plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-males\"));\n      } catch (e) {\n        if (e instanceof Exception.StopInterrupt) {\n          return e;\n        } else {\n          throw e;\n        }\n      };\n    });\n  });\n}","display":"males","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-males","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"# of males & females","left":1186,"top":490,"right":1458,"bottom":610,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"females","interval":1,"mode":0,"color":-4757638,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-females","type":"pen"},{"display":"males","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-males","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-removed\")","source":"num-fish-removed","left":45,"top":365,"right":145,"bottom":410,"display":"fish removed","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"auto-replace?","left":14,"top":268,"right":174,"bottom":301,"display":"auto-replace?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {\n  var reporterContext = false;\n  var letVars = { };\n  ListPrims.oneOf(world.turtleManager.turtlesOfBreed(\"FISH\")).ask(function() { procedures[\"REMOVE-THIS-FISH\"](); }, true);\n  let _maybestop_69_89 = procedures[\"FIND-POTENTIAL-MATES\"]();\n  if (_maybestop_69_89 instanceof Exception.StopInterrupt) { return _maybestop_69_89; }\n} catch (e) {\n  if (e instanceof Exception.StopInterrupt) {\n    return e;\n  } else {\n    throw e;\n  }\n}","source":"ask one-of fish [ remove-this-fish]\nfind-potential-mates","left":15,"top":230,"right":175,"bottom":264,"display":"Randomly replace a fish","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-in-tank\")","source":"num-fish-in-tank","left":45,"top":320,"right":145,"bottom":365,"display":"fish in tank","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-females","left":185,"top":30,"right":365,"bottom":63,"display":"initial-females","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-born\")","source":"num-fish-born","left":45,"top":410,"right":145,"bottom":455,"display":"fish born","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["initial-alleles-big-b", "see-body-cells?", "initial-alleles-big-t", "initial-alleles-big-g", "initial-alleles-big-f", "carrying-capacity", "see-fish?", "see-sex-cells?", "auto-replace?", "initial-females", "#-big-b-alleles", "#-small-b-alleles", "#-big-t-alleles", "#-small-t-alleles", "#-big-f-alleles", "#-small-f-alleles", "#-big-g-alleles", "#-small-g-alleles", "#-y-chromosomes", "#-x-chromosomes", "water-color", "green-dorsal-fin-color", "no-green-dorsal-fin-color", "yellow-tail-fin-color", "no-yellow-tail-fin-color", "male-color", "female-color", "spots-shape", "no-spots-shape", "forked-tail-shape", "no-forked-tail-shape", "#-of-green-dorsal-fins", "#-of-no-green-dorsal-fins", "#-of-yellow-tail-fins", "#-of-no-yellow-tail-fins", "#-of-spots", "#-of-no-spots", "#-of-forked-tails", "#-of-no-forked-tails", "#-of-males", "#-of-females", "mouse-continuous-down?", "num-fish-removed", "num-fish-born", "num-fish-in-tank", "fish-forward-step", "gamete-forward-step", "intra-chromosome-pair-spacing", "inter-chromosome-pair-spacing", "size-of-karyotype-background-for-cells", "initial-#-females", "initial-#-males"], ["initial-alleles-big-b", "see-body-cells?", "initial-alleles-big-t", "initial-alleles-big-g", "initial-alleles-big-f", "carrying-capacity", "see-fish?", "see-sex-cells?", "auto-replace?", "initial-females"], ["type-of-patch", "divider-here?"], 0, 29, 0, 15, 28.0, false, false, turtleShapes, linkShapes, function(){});
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
      world.observer.setGlobal("mouse-continuous-down?", false);
      world.observer.setGlobal("intra-chromosome-pair-spacing", 0.2);
      world.observer.setGlobal("inter-chromosome-pair-spacing", 0.55);
      world.observer.setGlobal("fish-forward-step", 0.04);
      world.observer.setGlobal("num-fish-removed", 0);
      world.observer.setGlobal("num-fish-born", 0);
      world.observer.setGlobal("num-fish-in-tank", 0);
      world.observer.setGlobal("size-of-karyotype-background-for-cells", 5.2);
      world.observer.setGlobal("initial-#-females", NLMath.floor((Prims.div(world.observer.getGlobal("initial-females"), 100) * world.observer.getGlobal("carrying-capacity"))));
      world.observer.setGlobal("initial-#-males", (world.observer.getGlobal("carrying-capacity") - world.observer.getGlobal("initial-#-females")));
      world.observer.setGlobal("green-dorsal-fin-color", [90, 255, 90, 255]);
      world.observer.setGlobal("no-green-dorsal-fin-color", [176, 196, 222, 255]);
      world.observer.setGlobal("yellow-tail-fin-color", [255, 255, 0, 255]);
      world.observer.setGlobal("no-yellow-tail-fin-color", [176, 196, 255, 255]);
      world.observer.setGlobal("female-color", [255, 150, 150, 255]);
      world.observer.setGlobal("male-color", [150, 150, 255, 255]);
      world.observer.setGlobal("water-color", (105 - 1.5));
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
      let minPycorEdge = world.topology.minPycor; letVars['minPycorEdge'] = minPycorEdge;
      let maxPycorEdge = world.topology.maxPycor; letVars['maxPycorEdge'] = maxPycorEdge;
      let waterPatches = Nobody; letVars['waterPatches'] = waterPatches;
      world.patches().ask(function() {
        SelfManager.self().setPatchVariable("divider-here?", false);
        SelfManager.self().setPatchVariable("type-of-patch", "water");
        if ((((Prims.equality(SelfManager.self().getPatchVariable("pycor"), (maxPycorEdge - 2)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), (minPycorEdge + 2))) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), procedures["LEFT-SIDE-OF-WATER-IN-TANK"]())) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), procedures["RIGHT-SIDE-OF-WATER-IN-TANK"]()))) {
          SelfManager.self().setPatchVariable("type-of-patch", "water-edge");
        }
        if (Prims.gte(SelfManager.self().getPatchVariable("pycor"), (maxPycorEdge - 1))) {
          SelfManager.self().setPatchVariable("type-of-patch", "air");
        }
        if (((Prims.lte(SelfManager.self().getPatchVariable("pxcor"), (procedures["LEFT-SIDE-OF-WATER-IN-TANK"]() - 1)) || Prims.gte(SelfManager.self().getPatchVariable("pxcor"), (procedures["RIGHT-SIDE-OF-WATER-IN-TANK"]() + 1))) || Prims.lte(SelfManager.self().getPatchVariable("pycor"), (minPycorEdge + 1)))) {
          SelfManager.self().setPatchVariable("type-of-patch", "tank-wall");
        }
        if ((((Prims.equality(SelfManager.self().getPatchVariable("pycor"), maxPycorEdge) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), minPycorEdge)) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), (procedures["LEFT-SIDE-OF-WATER-IN-TANK"]() - 2))) || Prims.gte(SelfManager.self().getPatchVariable("pxcor"), (procedures["RIGHT-SIDE-OF-WATER-IN-TANK"]() + 2)))) {
          SelfManager.self().setPatchVariable("type-of-patch", "air");
        }
      }, true);
      waterPatches = world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water"); }); letVars['waterPatches'] = waterPatches;
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
      numBigAlleles = NLMath.round(Prims.div(((world.observer.getGlobal("initial-alleles-big-b") * 2) * initialNumberFish), 100)); letVars['numBigAlleles'] = numBigAlleles;
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](1,"B","b",numBigAlleles);
      numBigAlleles = NLMath.round(Prims.div(((world.observer.getGlobal("initial-alleles-big-t") * 2) * initialNumberFish), 100)); letVars['numBigAlleles'] = numBigAlleles;
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](2,"T","t",numBigAlleles);
      numBigAlleles = NLMath.round(Prims.div(((world.observer.getGlobal("initial-alleles-big-f") * 2) * initialNumberFish), 100)); letVars['numBigAlleles'] = numBigAlleles;
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](3,"F","f",numBigAlleles);
      numBigAlleles = NLMath.round(Prims.div(((world.observer.getGlobal("initial-alleles-big-g") * 2) * initialNumberFish), 100)); letVars['numBigAlleles'] = numBigAlleles;
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](4,"G","g",numBigAlleles);
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](5,"Y","X",world.observer.getGlobal("initial-#-males"));
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
      world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() { procedures["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"](); }, true);
      procedures["DISTRIBUTE-GENE-POOL-TO-SOMATIC-CELLS"]();
      world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() { procedures["GROW-FISH-PARTS-FROM-SOMATIC-CELL"](); }, true);
      procedures["DISTRIBUTE-FISH-IN-TANK"]();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["setupNewSomaticCellAttributes"] = temp;
  procs["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let waterPatches = world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water"); }); letVars['waterPatches'] = waterPatches;
      let waterPatch = Nobody; letVars['waterPatch'] = waterPatch;
      world.turtleManager.turtlesOfBreed("FISH").ask(function() { SelfManager.self().moveTo(ListPrims.oneOf(waterPatches)); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["distributeFishInTank"] = temp;
  procs["DISTRIBUTE-FISH-IN-TANK"] = temp;
  temp = (function(geneNumber, allele1, allele2, numBigAlleles) {
    try {
      var reporterContext = false;
      var letVars = { };
      let initialNumberFish = (world.observer.getGlobal("initial-#-males") + world.observer.getGlobal("initial-#-females")); letVars['initialNumberFish'] = initialNumberFish;
      world.turtleManager.createTurtles((2 * initialNumberFish), "ALLELES").ask(function() {
        SelfManager.self().setVariable("gene", geneNumber);
        SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("gene-") + workspace.dump(geneNumber)));
        SelfManager.self().setVariable("heading", 0);
        SelfManager.self().setVariable("owned-by-fish?", false);
        SelfManager.self().setVariable("value", allele2);
        SelfManager.self().setVariable("color", [0, 0, 0, 255]);
        SelfManager.self().setVariable("label-color", SelfManager.self().getVariable("color"));
        SelfManager.self().setVariable("label", (workspace.dump('') + workspace.dump(SelfManager.self().getVariable("value")) + workspace.dump("     ")));
      }, true);
      ListPrims.nOf(numBigAlleles, world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("gene"), geneNumber); })).ask(function() {
        SelfManager.self().setVariable("value", allele1);
        SelfManager.self().setVariable("color", [220, 220, 220, 255]);
        SelfManager.self().setVariable("label", (workspace.dump('') + workspace.dump(SelfManager.self().getVariable("value")) + workspace.dump("     ")));
        SelfManager.self().setVariable("label-color", SelfManager.self().getVariable("color"));
      }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
      world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() {
        thisSomaticCell = SelfManager.self(); letVars['thisSomaticCell'] = thisSomaticCell;
        var _foreach_8238_8245 = Tasks.forEach(Tasks.commandTask(function(n) {
          if (arguments.length < 1) {
            throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
          }
          procedures["POSITION-AND-LINK-ALLELES"](SelfManager.self(),n,"left");
          procedures["POSITION-AND-LINK-ALLELES"](SelfManager.self(),n,"right");
        }, "[ n -> position-and-link-alleles self n \"left\" position-and-link-alleles self n \"right\" ]"), [1, 2, 3, 4]); if(reporterContext && _foreach_8238_8245 !== undefined) { return _foreach_8238_8245; }
        world.turtleManager.turtlesOfBreed("ALLELES")._optimalOneOfWith(function() {
          return ((!SelfManager.self().getVariable("owned-by-fish?") && Prims.equality(SelfManager.self().getVariable("gene"), 5)) && Prims.equality(SelfManager.self().getVariable("value"), "X"));
        }).ask(function() {
          SelfManager.self().setVariable("owned-by-fish?", true);
          SelfManager.self().setVariable("size", 1.2);
          SelfManager.self().setVariable("xcor", ((world.observer.getGlobal("inter-chromosome-pair-spacing") * 4) + 0.1));
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
        world.turtleManager.turtlesOfBreed("ALLELES")._optimalOneOfWith(function() {
          return ((!SelfManager.self().getVariable("owned-by-fish?") && Prims.equality(SelfManager.self().getVariable("gene"), 5)) && Prims.equality(SelfManager.self().getVariable("value"), lastSexAllele));
        }).ask(function() {
          SelfManager.self().setVariable("owned-by-fish?", true);
          SelfManager.self().setVariable("size", 1.2);
          SelfManager.self().setVariable("xcor", (((world.observer.getGlobal("inter-chromosome-pair-spacing") * 4) + world.observer.getGlobal("intra-chromosome-pair-spacing")) + 0.1));
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
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
      pairShiftRight = ((world.observer.getGlobal("inter-chromosome-pair-spacing") * geneNumber) - 0.45); letVars['pairShiftRight'] = pairShiftRight;
      world.turtleManager.turtlesOfBreed("ALLELES")._optimalOneOfWith(function() {
        return (!SelfManager.self().getVariable("owned-by-fish?") && Prims.equality(SelfManager.self().getVariable("gene"), geneNumber));
      }).ask(function() {
        SelfManager.self().setVariable("owned-by-fish?", true);
        SelfManager.self().setVariable("side", whichSide);
        SelfManager.self().setVariable("size", 1.2);
        SelfManager.self().setVariable("xcor", (thisSomaticCell.projectionBy(function() { return SelfManager.self().getVariable("xcor"); }) + (pairShiftRight + sideShift)));
        SelfManager.self().setVariable("ycor", (thisSomaticCell.projectionBy(function() { return SelfManager.self().getVariable("ycor"); }) - 0.4));
        LinkPrims.createLinkFrom(thisSomaticCell, "LINKS").ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          SelfManager.self().setVariable("tie-mode", "fixed");
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
      if (world.observer.getGlobal("auto-replace?")) {
        if (Prims.isThrottleTimeElapsed("autoSelection_0", workspace.selfManager.self(), 0.25)) {
          Prims.resetThrottleTimerFor("autoSelection_0", workspace.selfManager.self());
          if (!world.turtleManager.turtlesOfBreed("FISH").isEmpty()) {
            ListPrims.oneOf(world.turtleManager.turtlesOfBreed("FISH")).ask(function() {
              if (procedures["BOTH-SEXES-IN-THIS-FISHS-TANK-REGION?"]()) {
                procedures["REMOVE-THIS-FISH"]();
              }
            }, true);
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
      world.turtleManager.turtlesOfBreed("GAMETE-CELLS").ask(function() {
        myZygote = world.turtleManager.turtlesOfBreed("FISH-ZYGOTES")._optimalOneOfWith(function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }); letVars['myZygote'] = myZygote;
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
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
      world.turtleManager.turtlesOfBreed("FISH-ZYGOTES").ask(function() {
        maleGamete = world.turtleManager.turtlesOfBreed("GAMETE-CELLS").agentFilter(function() {
          return (LinkPrims.isOutLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(SelfManager.self().getVariable("sex"), "male"));
        }); letVars['maleGamete'] = maleGamete;
        femaleGamete = world.turtleManager.turtlesOfBreed("GAMETE-CELLS").agentFilter(function() {
          return (LinkPrims.isOutLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(SelfManager.self().getVariable("sex"), "female"));
        }); letVars['femaleGamete'] = femaleGamete;
        if ((!maleGamete.isEmpty() && !femaleGamete.isEmpty())) {
          if ((Prims.lte(SelfManager.self().distance(ListPrims.oneOf(maleGamete)), 0.01) && Prims.lte(SelfManager.self().distance(ListPrims.oneOf(femaleGamete)), 0.01))) {
            procedures["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"]();
            thisSomaticCell = SelfManager.self(); letVars['thisSomaticCell'] = thisSomaticCell;
            maleGamete.ask(function() {
              maleSexCellAlleles = procedures["ALLELES-THAT-BELONG-TO-THIS-GAMETE"](); letVars['maleSexCellAlleles'] = maleSexCellAlleles;
              SelfManager.self().die();
            }, true);
            femaleGamete.ask(function() {
              femaleSexCellAlleles = procedures["ALLELES-THAT-BELONG-TO-THIS-GAMETE"](); letVars['femaleSexCellAlleles'] = femaleSexCellAlleles;
              SelfManager.self().die();
            }, true);
            maleSexCellAlleles.ask(function() {
              LinkPrims.createLinkFrom(thisSomaticCell, "LINKS").ask(function() {
                SelfManager.self().setVariable("hidden?", true);
                SelfManager.self().setVariable("tie-mode", "fixed");
                SelfManager.self().tie();
              }, true);
            }, true);
            femaleSexCellAlleles.ask(function() {
              LinkPrims.createLinkFrom(thisSomaticCell, "LINKS").ask(function() {
                SelfManager.self().setVariable("hidden?", true);
                SelfManager.self().setVariable("tie-mode", "fixed");
                SelfManager.self().tie();
              }, true);
            }, true);
            procedures["ALIGN-ALLELES-FOR-THIS-SOMATIC-CELL"](thisSomaticCell);
            SelfManager.self().setVariable("sex", procedures["SEX-PHENOTYPE"]());
            procedures["GROW-FISH-PARTS-FROM-SOMATIC-CELL"]();
            world.observer.setGlobal("num-fish-born", (world.observer.getGlobal("num-fish-born") + 1));
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
  procs["convertZygoteIntoSomaticCell"] = temp;
  procs["CONVERT-ZYGOTE-INTO-SOMATIC-CELL"] = temp;
  temp = (function(thisZygote) {
    try {
      var reporterContext = false;
      var letVars = { };
      let allAlleles = world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", thisZygote); }); letVars['allAlleles'] = allAlleles;
      var _foreach_14051_14058 = Tasks.forEach(Tasks.commandTask(function(thisGene) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        if (Prims.gt(allAlleles.agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("gene"), thisGene) && Prims.equality(SelfManager.self().getVariable("side"), "left"));
        }).size(), 1)) {
          allAlleles._optimalOneOfWith(function() { return Prims.equality(SelfManager.self().getVariable("gene"), thisGene); }).ask(function() {
            SelfManager.self().setVariable("heading", 90);
            SelfManager.self().fd(world.observer.getGlobal("intra-chromosome-pair-spacing"));
            SelfManager.self().setVariable("side", "right");
          }, true);
        }
        if (Prims.gt(allAlleles.agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("gene"), thisGene) && Prims.equality(SelfManager.self().getVariable("side"), "right"));
        }).size(), 1)) {
          allAlleles._optimalOneOfWith(function() { return Prims.equality(SelfManager.self().getVariable("gene"), thisGene); }).ask(function() {
            SelfManager.self().setVariable("heading", 90);
            SelfManager.self().fd(-world.observer.getGlobal("intra-chromosome-pair-spacing"));
            SelfManager.self().setVariable("side", "left");
          }, true);
        }
      }, "[ this-gene -> if count all-alleles with [ gene = this-gene and side = \"left\" ] > 1 [ ask one-of all-alleles with [ gene = this-gene ] [ set heading 90 forward intra-chromosome-pair-spacing set side \"right\" ] ] if count all-alleles with [ gene = this-gene and side = \"right\" ] > 1 [ ask one-of all-alleles with [ gene = this-gene ] [ set heading 90 back intra-chromosome-pair-spacing set side \"left\" ] ] ]"), [1, 2, 3, 4, 5]); if(reporterContext && _foreach_14051_14058 !== undefined) { return _foreach_14051_14058; }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
      if (!world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); }).isEmpty()) {
        world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")._optimalOneOfWith(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); }).ask(function() {
          dad = SelfManager.self(); letVars['dad'] = dad;
          xcorDad = SelfManager.self().getVariable("xcor"); letVars['xcorDad'] = xcorDad;
        }, true);
        dad.ask(function() {
          turtlesInThisRegion = procedures["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"](); letVars['turtlesInThisRegion'] = turtlesInThisRegion;
        }, true);
        allFishAndFishZygotes = turtlesInThisRegion.agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH")) || Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH-ZYGOTES")));
        }); letVars['allFishAndFishZygotes'] = allFishAndFishZygotes;
        potentialMates = turtlesInThisRegion.agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")) && Prims.equality(SelfManager.self().getVariable("sex"), "female"));
        }); letVars['potentialMates'] = potentialMates;
        if (!potentialMates.isEmpty()) {
          ListPrims.oneOf(potentialMates).ask(function() { mom = SelfManager.self(); letVars['mom'] = mom; }, true);
          let thisCarryingCapacity = procedures["CARRYING-CAPACITY-IN-THIS-REGION"](xcorDad); letVars['thisCarryingCapacity'] = thisCarryingCapacity;
          if (Prims.lt(allFishAndFishZygotes.size(), thisCarryingCapacity)) {
            procedures["REPRODUCE-OFFSPRING-FROM-THESE-TWO-PARENTS"](mom,dad);
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
  procs["findPotentialMates"] = temp;
  procs["FIND-POTENTIAL-MATES"] = temp;
  temp = (function(mom, dad) {
    try {
      var reporterContext = false;
      var letVars = { };
      let child = Nobody; letVars['child'] = child;
      mom.ask(function() {
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("heading", 0);
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"));
          SelfManager.self().setVariable("size", 1);
          SelfManager.self().setVariable("shape", "heart");
          SelfManager.self().setVariable("color", 15);
          child = SelfManager.self(); letVars['child'] = child;
        }, true);
      }, true);
      mom.ask(function() { procedures["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"](child); }, true);
      dad.ask(function() { procedures["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"](child); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        ListPrims.nOf(1, world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() {
          return (LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(SelfManager.self().getVariable("gene"), thisGene));
        })).ask(function() {
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
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["linkAllelesToGametesAndGametesToZygote"] = temp;
  procs["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("FISH").ask(function() {
        SelfManager.self().setVariable("heading", SelfManager.self().getVariable("bearing"));
        SelfManager.self().right(Prims.randomFloat(70));
        SelfManager.self().right(-Prims.randomFloat(70));
        SelfManager.self().setVariable("bearing", SelfManager.self().getVariable("heading"));
        SelfManager.self().fd(world.observer.getGlobal("fish-forward-step"));
        SelfManager.self().setVariable("heading", 0);
      }, true);
      world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() { SelfManager.self().setVariable("heading", 0); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["wander"] = temp;
  procs["WANDER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
        return (!Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") && !Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"));
      }).ask(function() { procedures["REMOVE-THIS-FISH"](); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["detectFishOutsideTheWater"] = temp;
  procs["DETECT-FISH-OUTSIDE-THE-WATER"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let nearestWaterPatch = Nobody; letVars['nearestWaterPatch'] = nearestWaterPatch;
      let waterPatches = world.patches().agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") && !SelfManager.self().getPatchVariable("divider-here?"));
      }); letVars['waterPatches'] = waterPatches;
      world.turtleManager.turtlesOfBreed("FISH").ask(function() {
        nearestWaterPatch = waterPatches.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); }); letVars['nearestWaterPatch'] = nearestWaterPatch;
        if ((Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "tank-wall") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"))) {
          SelfManager.self().setVariable("heading", SelfManager.self().towards(nearestWaterPatch));
          SelfManager.self().fd((world.observer.getGlobal("fish-forward-step") * 2));
          SelfManager.self().setVariable("heading", 0);
          SelfManager.self().setVariable("bearing", Prims.randomFloat(360));
        }
        if (SelfManager.self().getPatchVariable("divider-here?")) {
          SelfManager.self().moveTo(nearestWaterPatch);
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
  procs["detectAndMoveFishAtInsideTankBoundary"] = temp;
  procs["DETECT-AND-MOVE-FISH-AT-INSIDE-TANK-BOUNDARY"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let boneTransparency = 0; letVars['boneTransparency'] = boneTransparency;
      let colorList = []; letVars['colorList'] = colorList;
      world.turtleManager.turtlesOfBreed("FISH-BONES").ask(function() {
        SelfManager.self().setVariable("countdown", (SelfManager.self().getVariable("countdown") - 1));
        boneTransparency = Prims.div((SelfManager.self().getVariable("countdown") * 255), 50); letVars['boneTransparency'] = boneTransparency;
        colorList = ListPrims.lput(boneTransparency, [255, 255, 255]); letVars['colorList'] = colorList;
        SelfManager.self().setVariable("color", colorList);
        if (Prims.lte(SelfManager.self().getVariable("countdown"), 0)) {
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
  procs["cleanUpFishBones"] = temp;
  procs["CLEAN-UP-FISH-BONES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("num-fish-removed", (world.observer.getGlobal("num-fish-removed") + 1));
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-BONES"));
        SelfManager.self().setVariable("color", 9.9);
        SelfManager.self().setVariable("countdown", 25);
      }, true);
      LinkPrims.outLinkNeighbors("LINKS").ask(function() {
        LinkPrims.outLinkNeighbors("LINKS").ask(function() { SelfManager.self().die(); }, true);
        SelfManager.self().die();
      }, true);
      SelfManager.self().die();
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
      let pTypeOfPatch = world.getPatchAt(pMouseXcor, pMouseYcor).projectionBy(function() { return SelfManager.self().getPatchVariable("type-of-patch"); }); letVars['pTypeOfPatch'] = pTypeOfPatch;
      let mouseWasJustDown_p = MousePrims.isDown(); letVars['mouseWasJustDown_p'] = mouseWasJustDown_p;
      world.turtleManager.turtlesOfBreed("MOUSE-CURSORS").ask(function() {
        SelfManager.self().setXY(pMouseXcor, pMouseYcor);
        if (Prims.equality(pTypeOfPatch, "water")) {
          SelfManager.self().setVariable("hidden?", false);
          SelfManager.self().setVariable("shape", "x");
          SelfManager.self().setVariable("label-color", 9.9);
          SelfManager.self().setVariable("label", "remove fish");
        }
        if ((SelfManager.self().getPatchVariable("divider-here?") && Prims.equality(pTypeOfPatch, "tank-wall"))) {
          SelfManager.self().setVariable("hidden?", false);
          SelfManager.self().setVariable("shape", "subtract divider");
          SelfManager.self().setVariable("label-color", 9.9);
          SelfManager.self().setVariable("label", "remove divider");
        }
        if ((!SelfManager.self().getPatchVariable("divider-here?") && Prims.equality(pTypeOfPatch, "tank-wall"))) {
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
          SelfManager.self().breedHere("FISH").ask(function() { procedures["REMOVE-THIS-FISH"](); }, true);
        }
        if ((((((mouseWasJustDown_p && !world.observer.getGlobal("mouse-continuous-down?")) && Prims.equality(pTypeOfPatch, "tank-wall")) && Prims.equality(SelfManager.self().getPatchVariable("pycor"), (world.topology.minPycor + 1))) && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), (world.topology.minPxcor + 1))) && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), (world.topology.maxPxcor - 1)))) {
          SelfManager.self().setPatchVariable("divider-here?", !SelfManager.self().getPatchVariable("divider-here?"));
          let dividerXcor = SelfManager.self().getPatchVariable("pxcor"); letVars['dividerXcor'] = dividerXcor;
          world.patches().agentFilter(function() {
            return ((Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge")) && Prims.equality(SelfManager.self().getPatchVariable("pxcor"), dividerXcor));
          }).ask(function() {
            SelfManager.self().setPatchVariable("divider-here?", !SelfManager.self().getPatchVariable("divider-here?"));
          }, true);
        }
        if (!MousePrims.isInside()) {
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
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("num-fish-in-tank", world.turtleManager.turtlesOfBreed("FISH").size());
      world.observer.setGlobal("#-big-b-alleles", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "B"); }).size());
      world.observer.setGlobal("#-small-b-alleles", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "b"); }).size());
      world.observer.setGlobal("#-big-t-alleles", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "T"); }).size());
      world.observer.setGlobal("#-small-t-alleles", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "t"); }).size());
      world.observer.setGlobal("#-big-f-alleles", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "F"); }).size());
      world.observer.setGlobal("#-small-f-alleles", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "f"); }).size());
      world.observer.setGlobal("#-big-g-alleles", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "G"); }).size());
      world.observer.setGlobal("#-small-g-alleles", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "g"); }).size());
      world.observer.setGlobal("#-y-chromosomes", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "Y"); }).size());
      world.observer.setGlobal("#-x-chromosomes", world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("value"), "X"); }).size());
      world.observer.setGlobal("#-of-green-dorsal-fins", world.turtleManager.turtlesOfBreed("FISH-PARTS").agentFilter(function() {
        return Prims.equality(SelfManager.self().getVariable("color"), world.observer.getGlobal("green-dorsal-fin-color"));
      }).size());
      world.observer.setGlobal("#-of-no-green-dorsal-fins", world.turtleManager.turtlesOfBreed("FISH-PARTS").agentFilter(function() {
        return Prims.equality(SelfManager.self().getVariable("color"), world.observer.getGlobal("no-green-dorsal-fin-color"));
      }).size());
      world.observer.setGlobal("#-of-yellow-tail-fins", world.turtleManager.turtlesOfBreed("FISH-PARTS").agentFilter(function() {
        return Prims.equality(SelfManager.self().getVariable("color"), world.observer.getGlobal("yellow-tail-fin-color"));
      }).size());
      world.observer.setGlobal("#-of-no-yellow-tail-fins", world.turtleManager.turtlesOfBreed("FISH-PARTS").agentFilter(function() {
        return Prims.equality(SelfManager.self().getVariable("color"), world.observer.getGlobal("no-yellow-tail-fin-color"));
      }).size());
      world.observer.setGlobal("#-of-spots", world.turtleManager.turtlesOfBreed("FISH-PARTS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("spots-shape")) && Prims.equality(SelfManager.self().getVariable("hidden?"), false));
      }).size());
      world.observer.setGlobal("#-of-no-spots", world.turtleManager.turtlesOfBreed("FISH-PARTS").agentFilter(function() {
        return (Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("spots-shape")) && Prims.equality(SelfManager.self().getVariable("hidden?"), true));
      }).size());
      world.observer.setGlobal("#-of-forked-tails", world.turtleManager.turtlesOfBreed("FISH-PARTS").agentFilter(function() {
        return Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("forked-tail-shape"));
      }).size());
      world.observer.setGlobal("#-of-no-forked-tails", world.turtleManager.turtlesOfBreed("FISH-PARTS").agentFilter(function() {
        return Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("no-forked-tail-shape"));
      }).size());
      world.observer.setGlobal("#-of-males", world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); }).size());
      world.observer.setGlobal("#-of-females", world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "female"); }).size());
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["updateStatistics"] = temp;
  procs["UPDATE-STATISTICS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.patches().agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"));
      }).ask(function() {
        if (!SelfManager.self().getPatchVariable("divider-here?")) {
          SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("water-color"));
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", (5 - 3.5));
        }
      }, true);
      world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "tank-wall"); }).ask(function() {
        if (!SelfManager.self().getPatchVariable("divider-here?")) {
          SelfManager.self().setPatchVariable("pcolor", (5 - 3));
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", (5 - 4));
        }
      }, true);
      world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "air"); }).ask(function() { SelfManager.self().setPatchVariable("pcolor", (5 + 3)); }, true);
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["visualizeTank"] = temp;
  procs["VISUALIZE-TANK"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (world.observer.getGlobal("see-body-cells?")) {
        world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() {
          SelfManager.self().setVariable("hidden?", false);
          world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
        }, true);
      }
      else {
        world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        }, true);
      }
      if (world.observer.getGlobal("see-sex-cells?")) {
        world.turtleManager.turtlesOfBreed("GAMETE-CELLS").ask(function() {
          SelfManager.self().setVariable("hidden?", false);
          world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
        }, true);
        world.turtleManager.turtlesOfBreed("FISH-ZYGOTES").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
      }
      else {
        world.turtleManager.turtlesOfBreed("GAMETE-CELLS").ask(function() {
          SelfManager.self().setVariable("hidden?", true);
          world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }).ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        }, true);
        world.turtleManager.turtlesOfBreed("FISH-ZYGOTES").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
      }
      if (world.observer.getGlobal("see-fish?")) {
        world.turtleManager.turtlesOfBreed("FISH").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
        world.turtleManager.turtlesOfBreed("FISH-PARTS").ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
      }
      else {
        world.turtleManager.turtlesOfBreed("FISH").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
        world.turtleManager.turtlesOfBreed("FISH-PARTS").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
      }
    } catch (e) {
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
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
        SelfManager.self().setVariable("bearing", Prims.randomFloat(360));
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
      if (e instanceof Exception.StopInterrupt) {
        return e;
      } else {
        throw e;
      }
    }
  });
  procs["growFishPartsFromSomaticCell"] = temp;
  procs["GROW-FISH-PARTS-FROM-SOMATIC-CELL"] = temp;
  temp = (function(dominantAllele) {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisSomaticCell = SelfManager.self(); letVars['thisSomaticCell'] = thisSomaticCell;
      let _pound_OfDominantAlleles = world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() {
        return (LinkPrims.isInLinkNeighbor("LINKS", thisSomaticCell) && Prims.equality(SelfManager.self().getVariable("value"), dominantAllele));
      }).size(); letVars['_pound_OfDominantAlleles'] = _pound_OfDominantAlleles;
      if (Prims.gt(_pound_OfDominantAlleles, 0)) {
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
  procs["hasAtLeastOneDominantSetOfInstructionsFor"] = temp;
  procs["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisShape = ""; letVars['thisShape'] = thisShape;
      let thisFish = SelfManager.myself(); letVars['thisFish'] = thisFish;
      SelfManager.myself().ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("F")) {
          thisShape = world.observer.getGlobal("forked-tail-shape"); letVars['thisShape'] = thisShape;
        }
        else {
          thisShape = world.observer.getGlobal("no-forked-tail-shape"); letVars['thisShape'] = thisShape;
        }
      }, true);
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return thisShape
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
  procs["tailShapePhenotype"] = temp;
  procs["TAIL-SHAPE-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisSpotsShape = ""; letVars['thisSpotsShape'] = thisSpotsShape;
      SelfManager.myself().ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("B")) {
          thisSpotsShape = world.observer.getGlobal("spots-shape"); letVars['thisSpotsShape'] = thisSpotsShape;
        }
        else {
          thisSpotsShape = world.observer.getGlobal("no-spots-shape"); letVars['thisSpotsShape'] = thisSpotsShape;
        }
      }, true);
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return thisSpotsShape
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
  procs["rearSpotsPhenotype"] = temp;
  procs["REAR-SPOTS-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisColor = []; letVars['thisColor'] = thisColor;
      SelfManager.myself().ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("G")) {
          thisColor = world.observer.getGlobal("green-dorsal-fin-color"); letVars['thisColor'] = thisColor;
        }
        else {
          thisColor = world.observer.getGlobal("no-green-dorsal-fin-color"); letVars['thisColor'] = thisColor;
        }
      }, true);
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return thisColor
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
  procs["dorsalFinColorPhenotype"] = temp;
  procs["DORSAL-FIN-COLOR-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisColor = []; letVars['thisColor'] = thisColor;
      let thisFish = SelfManager.myself(); letVars['thisFish'] = thisFish;
      SelfManager.myself().ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("T")) {
          thisColor = world.observer.getGlobal("yellow-tail-fin-color"); letVars['thisColor'] = thisColor;
        }
        else {
          thisColor = world.observer.getGlobal("no-yellow-tail-fin-color"); letVars['thisColor'] = thisColor;
        }
      }, true);
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return thisColor
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
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return thisSex
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
  procs["sexPhenotype"] = temp;
  procs["SEX-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); })
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
  procs["allelesThatBelongToThisGamete"] = temp;
  procs["ALLELES-THAT-BELONG-TO-THIS-GAMETE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return (world.topology.minPxcor + 2)
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
  procs["leftSideOfWaterInTank"] = temp;
  procs["LEFT-SIDE-OF-WATER-IN-TANK"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return (world.topology.maxPxcor - 2)
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
      let dividersToTheRight = world.patches().agentFilter(function() {
        return (SelfManager.self().getPatchVariable("divider-here?") && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), xcorOfThisTurtle));
      }); letVars['dividersToTheRight'] = dividersToTheRight;
      let dividersToTheLeft = world.patches().agentFilter(function() {
        return (SelfManager.self().getPatchVariable("divider-here?") && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), xcorOfThisTurtle));
      }); letVars['dividersToTheLeft'] = dividersToTheLeft;
      if (!dividersToTheRight.isEmpty()) {
        thisRegionRightSide = ListPrims.min(dividersToTheRight.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); })); letVars['thisRegionRightSide'] = thisRegionRightSide;
      }
      if (!dividersToTheLeft.isEmpty()) {
        thisRegionLeftSide = ListPrims.max(dividersToTheLeft.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); })); letVars['thisRegionLeftSide'] = thisRegionLeftSide;
      }
      turtlesInThisRegion = world.turtles().agentFilter(function() {
        return (Prims.gte(SelfManager.self().getVariable("xcor"), thisRegionLeftSide) && Prims.lte(SelfManager.self().getVariable("xcor"), thisRegionRightSide));
      }); letVars['turtlesInThisRegion'] = turtlesInThisRegion;
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return turtlesInThisRegion
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
  procs["otherTurtlesInThisTurtlesTankRegion"] = temp;
  procs["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let fishInThisRegion = procedures["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"]().agentFilter(function() {
        return Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH"));
      }); letVars['fishInThisRegion'] = fishInThisRegion;
      let maleFishInThisRegion = fishInThisRegion.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); }); letVars['maleFishInThisRegion'] = maleFishInThisRegion;
      let femaleFishInThisRegion = fishInThisRegion.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "female"); }); letVars['femaleFishInThisRegion'] = femaleFishInThisRegion;
      if ((!maleFishInThisRegion.isEmpty() && !femaleFishInThisRegion.isEmpty())) {
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
  procs["bothSexesInThisFishsTankRegion_p"] = temp;
  procs["BOTH-SEXES-IN-THIS-FISHS-TANK-REGION?"] = temp;
  temp = (function(thisXcor) {
    try {
      var reporterContext = true;
      var letVars = { };
      let thisRegionLeftSide = procedures["LEFT-SIDE-OF-WATER-IN-TANK"](); letVars['thisRegionLeftSide'] = thisRegionLeftSide;
      let thisRegionRightSide = procedures["RIGHT-SIDE-OF-WATER-IN-TANK"](); letVars['thisRegionRightSide'] = thisRegionRightSide;
      let dividersToTheRight = world.patches().agentFilter(function() {
        return (SelfManager.self().getPatchVariable("divider-here?") && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), thisXcor));
      }); letVars['dividersToTheRight'] = dividersToTheRight;
      let dividersToTheLeft = world.patches().agentFilter(function() {
        return (SelfManager.self().getPatchVariable("divider-here?") && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), thisXcor));
      }); letVars['dividersToTheLeft'] = dividersToTheLeft;
      if (!dividersToTheRight.isEmpty()) {
        thisRegionRightSide = ListPrims.min(dividersToTheRight.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); })); letVars['thisRegionRightSide'] = thisRegionRightSide;
      }
      if (!dividersToTheLeft.isEmpty()) {
        thisRegionLeftSide = ListPrims.max(dividersToTheLeft.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); })); letVars['thisRegionLeftSide'] = thisRegionLeftSide;
      }
      let tankCapacityOfThisRegion = Prims.div(((thisRegionRightSide - thisRegionLeftSide) * world.observer.getGlobal("carrying-capacity")), 25); letVars['tankCapacityOfThisRegion'] = tankCapacityOfThisRegion;
      if(!reporterContext) { throw new Error("REPORT can only be used inside TO-REPORT.") } else {
        return tankCapacityOfThisRegion
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
