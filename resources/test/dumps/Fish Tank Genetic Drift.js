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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"add divider":{"name":"add divider","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[0,45,150,255,300,150],"ycors":[180,225,135,240,195,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cell-gamete-female":{"name":"cell-gamete-female","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,300,300],"ycors":[210,210,150],"type":"polygon","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"cell-gamete-male":{"name":"cell-gamete-male","editableColorIndex":13,"rotate":false,"elements":[{"xcors":[150,150,300],"ycors":[150,210,150],"type":"polygon","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"cell-somatic":{"name":"cell-somatic","editableColorIndex":0,"rotate":false,"elements":[{"xmin":150,"ymin":150,"xmax":300,"ymax":210,"type":"rectangle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish-body":{"name":"fish-body","editableColorIndex":11,"rotate":false,"elements":[{"xcors":[15,151,226,280,292,292,287,270,195,151,15],"ycors":[135,92,96,134,161,175,185,210,225,227,165],"type":"polygon","color":"rgba(124, 80, 164, 1.0)","filled":true,"marked":true},{"x":236,"y":125,"diam":34,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":256,"y1":143,"x2":264,"y2":132,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"fish-bones":{"name":"fish-bones","editableColorIndex":15,"rotate":false,"elements":[{"xmin":45,"ymin":150,"xmax":210,"ymax":165,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[210,210,270,240,285,285,270,225,195,210],"ycors":[180,210,195,180,165,150,120,90,135,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":236,"y":110,"diam":34,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":180,"y1":90,"x2":195,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true},{"x1":150,"y1":90,"x2":180,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true},{"x1":120,"y1":105,"x2":150,"y2":210,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true},{"x1":90,"y1":120,"x2":120,"y2":195,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true},{"x1":60,"y1":135,"x2":75,"y2":180,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":true}]},"fish-fins":{"name":"fish-fins","editableColorIndex":2,"rotate":false,"elements":[{"xcors":[45,75,71,75,165,120],"ycors":[0,45,103,120,105,30],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":true},{"xcors":[75,45,90,105,135],"ycors":[180,240,225,270,210],"type":"polygon","color":"rgba(241, 106, 21, 1.0)","filled":true,"marked":true}]},"fish-forked-tail":{"name":"fish-forked-tail","editableColorIndex":5,"rotate":false,"elements":[{"xcors":[150,105,45,75,105,75,45,105,150],"ycors":[135,75,0,90,150,195,300,225,165],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":true}]},"fish-no-forked-tail":{"name":"fish-no-forked-tail","editableColorIndex":1,"rotate":false,"elements":[{"xcors":[150,120,75,60,60,60,75,120,150],"ycors":[135,60,0,75,150,210,300,240,165],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":true}]},"fish-spots":{"name":"fish-spots","editableColorIndex":15,"rotate":false,"elements":[{"x":84,"y":129,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":66,"y":161,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":92,"y":162,"diam":22,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":114,"y":99,"diam":24,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":39,"y":129,"diam":24,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":129,"y":144,"diam":12,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"fish-ventral-fin":{"name":"fish-ventral-fin","editableColorIndex":11,"rotate":false,"elements":[{"xcors":[60,15,75,90,150],"ycors":[180,240,225,270,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false}]},"gene-1":{"name":"gene-1","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":165,"type":"rectangle","color":"rgba(84, 196, 196, 1.0)","filled":true,"marked":false},{"xmin":135,"ymin":105,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-2":{"name":"gene-2","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xmin":135,"ymin":90,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-3":{"name":"gene-3","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(224, 127, 150, 1.0)","filled":true,"marked":false},{"xmin":135,"ymin":75,"xmax":150,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-4":{"name":"gene-4","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":75,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":135,"ymin":105,"xmax":150,"ymax":135,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-5":{"name":"gene-5","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"gene-y":{"name":"gene-y","editableColorIndex":15,"rotate":false,"elements":[{"xmin":135,"ymin":60,"xmax":150,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true}]},"heart":{"name":"heart","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[60,60,90,120,150,165],"ycors":[105,135,180,210,225,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":60,"diam":90,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":150,"y":60,"diam":90,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[240,240,210,180,150,150],"ycors":[105,135,180,210,225,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"none":{"name":"none","editableColorIndex":0,"rotate":true,"elements":[]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"sheep":{"name":"sheep","editableColorIndex":0,"rotate":false,"elements":[{"xmin":151,"ymin":225,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":47,"ymin":225,"xmax":75,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":15,"ymin":75,"xmax":210,"ymax":225,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":135,"y":75,"diam":150,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":165,"y":76,"diam":116,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":15,"ymin":15,"xmax":285,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"subtract divider":{"name":"subtract divider","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[0,45,150,255,300,150],"ycors":[120,75,165,60,105,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
modelConfig.plots = [(function() {
  var name    = 'Tail Shape Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('F', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Tail Shape Alleles', 'F')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-f-alleles"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('f', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Tail Shape Alleles', 'f')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-f-alleles"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
  var pens    = [new PenBundle.Pen('T', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Tail Color Alleles', 'T')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-t-alleles"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('t', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Tail Color Alleles', 't')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-t-alleles"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
  var pens    = [new PenBundle.Pen('G', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'G')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-g-alleles"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('g', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Dorsal Fin Color Alleles', 'g')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-g-alleles"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Sex Chromosomes', 'X')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-x-chromosomes"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('Y', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Sex Chromosomes', 'Y')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-y-chromosomes"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('dorsal fin & spotting variations', 'spots')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-spots"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('no spots', plotOps.makePenOps, false, new PenBundle.State(6.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no spots')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-spots"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('green dorsal', plotOps.makePenOps, false, new PenBundle.State(67.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('dorsal fin & spotting variations', 'green dorsal')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-green-dorsal-fins"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('no green', plotOps.makePenOps, false, new PenBundle.State(96.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('dorsal fin & spotting variations', 'no green')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-green-dorsal-fins"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
  var pens    = [new PenBundle.Pen('B', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Body Spot Alleles', 'B')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-b-alleles"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('b', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('Body Spot Alleles', 'b')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-b-alleles"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('tail fin variations', 'forked tail')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-forked-tails"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('no fork', plotOps.makePenOps, false, new PenBundle.State(7.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('tail fin variations', 'no fork')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-forked-tails"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('yellow tail', plotOps.makePenOps, false, new PenBundle.State(44.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('tail fin variations', 'yellow tail')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-yellow-tail-fins"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('no yellow', plotOps.makePenOps, false, new PenBundle.State(95.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('tail fin variations', 'no yellow')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-yellow-tail-fins"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('# of males & females', 'females')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-females"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        };
      });
    });
  }),
  new PenBundle.Pen('males', plotOps.makePenOps, false, new PenBundle.State(96.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('# of males & females', 'males')(function() {
        try {
          plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-males"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
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
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "FISH", singular: "a-fish", varNames: ["sex", "bearing"] }, { name: "FISH-PARTS", singular: "a-fish-part", varNames: [] }, { name: "SOMATIC-CELLS", singular: "somatic-cell", varNames: ["sex"] }, { name: "GAMETE-CELLS", singular: "gamete-cell", varNames: ["sex"] }, { name: "ALLELES", singular: "allele", varNames: ["gene", "value", "owned-by-fish?", "side"] }, { name: "FISH-BONES", singular: "a-fish-bones", varNames: ["countdown"] }, { name: "FISH-ZYGOTES", singular: "a-fish-zygote", varNames: [] }, { name: "MOUSE-CURSORS", singular: "mouse-cursor", varNames: [] }])([], [])(["initial-alleles-big-b", "see-body-cells?", "initial-alleles-big-t", "initial-alleles-big-g", "initial-alleles-big-f", "carrying-capacity", "see-fish?", "see-sex-cells?", "auto-replace?", "initial-females", "#-big-b-alleles", "#-small-b-alleles", "#-big-t-alleles", "#-small-t-alleles", "#-big-f-alleles", "#-small-f-alleles", "#-big-g-alleles", "#-small-g-alleles", "#-y-chromosomes", "#-x-chromosomes", "water-color", "green-dorsal-fin-color", "no-green-dorsal-fin-color", "yellow-tail-fin-color", "no-yellow-tail-fin-color", "male-color", "female-color", "spots-shape", "no-spots-shape", "forked-tail-shape", "no-forked-tail-shape", "#-of-green-dorsal-fins", "#-of-no-green-dorsal-fins", "#-of-yellow-tail-fins", "#-of-no-yellow-tail-fins", "#-of-spots", "#-of-no-spots", "#-of-forked-tails", "#-of-no-forked-tails", "#-of-males", "#-of-females", "mouse-continuous-down?", "num-fish-removed", "num-fish-born", "num-fish-in-tank", "fish-forward-step", "gamete-forward-step", "intra-chromosome-pair-spacing", "inter-chromosome-pair-spacing", "size-of-karyotype-background-for-cells", "initial-#-females", "initial-#-males"], ["initial-alleles-big-b", "see-body-cells?", "initial-alleles-big-t", "initial-alleles-big-g", "initial-alleles-big-f", "carrying-capacity", "see-fish?", "see-sex-cells?", "auto-replace?", "initial-females"], ["type-of-patch", "divider-here?"], 0, 29, 0, 15, 28.0, false, false, turtleShapes, linkShapes, function(){});
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
      let minPycorEdge = world.topology.minPycor;
      let maxPycorEdge = world.topology.maxPycor;
      let waterPatches = Nobody;
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
      waterPatches = world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water"); });
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
  procs["setTankRegions"] = temp;
  procs["SET-TANK-REGIONS"] = temp;
  temp = (function() {
    try {
      let numBigAlleles = 0;
      let initialNumberFish = world.observer.getGlobal("carrying-capacity");
      numBigAlleles = NLMath.round(Prims.div(((world.observer.getGlobal("initial-alleles-big-b") * 2) * initialNumberFish), 100));
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](1,"B","b",numBigAlleles);
      numBigAlleles = NLMath.round(Prims.div(((world.observer.getGlobal("initial-alleles-big-t") * 2) * initialNumberFish), 100));
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](2,"T","t",numBigAlleles);
      numBigAlleles = NLMath.round(Prims.div(((world.observer.getGlobal("initial-alleles-big-f") * 2) * initialNumberFish), 100));
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](3,"F","f",numBigAlleles);
      numBigAlleles = NLMath.round(Prims.div(((world.observer.getGlobal("initial-alleles-big-g") * 2) * initialNumberFish), 100));
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](4,"G","g",numBigAlleles);
      procedures["MAKE-INITIAL-ALLELES-FOR-GENE"](5,"Y","X",world.observer.getGlobal("initial-#-males"));
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
  procs["createInitialGenePool"] = temp;
  procs["CREATE-INITIAL-GENE-POOL"] = temp;
  temp = (function() {
    try {
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-#-males"), "SOMATIC-CELLS").ask(function() { SelfManager.self().setVariable("sex", "male"); }, true);
      world.turtleManager.createTurtles(world.observer.getGlobal("initial-#-females"), "SOMATIC-CELLS").ask(function() { SelfManager.self().setVariable("sex", "female"); }, true);
      world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() { procedures["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"](); }, true);
      procedures["DISTRIBUTE-GENE-POOL-TO-SOMATIC-CELLS"]();
      world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() { procedures["GROW-FISH-PARTS-FROM-SOMATIC-CELL"](); }, true);
      procedures["DISTRIBUTE-FISH-IN-TANK"]();
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
  procs["createInitialFish"] = temp;
  procs["CREATE-INITIAL-FISH"] = temp;
  temp = (function() {
    try {
      SelfManager.self().setVariable("heading", 0);
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"));
      SelfManager.self().setVariable("color", [100, 100, 100, 100]);
      SelfManager.self().setVariable("size", world.observer.getGlobal("size-of-karyotype-background-for-cells"));
      SelfManager.self().setVariable("hidden?", true);
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
  procs["setupNewSomaticCellAttributes"] = temp;
  procs["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"] = temp;
  temp = (function() {
    try {
      let waterPatches = world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water"); });
      let waterPatch = Nobody;
      world.turtleManager.turtlesOfBreed("FISH").ask(function() { SelfManager.self().moveTo(ListPrims.oneOf(waterPatches)); }, true);
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
  procs["distributeFishInTank"] = temp;
  procs["DISTRIBUTE-FISH-IN-TANK"] = temp;
  temp = (function(geneNumber, allele1, allele2, numBigAlleles) {
    try {
      let initialNumberFish = (world.observer.getGlobal("initial-#-males") + world.observer.getGlobal("initial-#-females"));
      world.turtleManager.createTurtles((2 * initialNumberFish), "ALLELES").ask(function() {
        SelfManager.self().setVariable("gene", geneNumber);
        SelfManager.self().setVariable("shape", (Dump('') + Dump("gene-") + Dump(geneNumber)));
        SelfManager.self().setVariable("heading", 0);
        SelfManager.self().setVariable("owned-by-fish?", false);
        SelfManager.self().setVariable("value", allele2);
        SelfManager.self().setVariable("color", [0, 0, 0, 255]);
        SelfManager.self().setVariable("label-color", SelfManager.self().getVariable("color"));
        SelfManager.self().setVariable("label", (Dump('') + Dump(SelfManager.self().getVariable("value")) + Dump("     ")));
      }, true);
      ListPrims.nOf(numBigAlleles, world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("gene"), geneNumber); })).ask(function() {
        SelfManager.self().setVariable("value", allele1);
        SelfManager.self().setVariable("color", [220, 220, 220, 255]);
        SelfManager.self().setVariable("label", (Dump('') + Dump(SelfManager.self().getVariable("value")) + Dump("     ")));
        SelfManager.self().setVariable("label-color", SelfManager.self().getVariable("color"));
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
  procs["makeInitialAllelesForGene"] = temp;
  procs["MAKE-INITIAL-ALLELES-FOR-GENE"] = temp;
  temp = (function() {
    try {
      let thisSomaticCell = Nobody;
      let lastSexAllele = "";
      world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").ask(function() {
        thisSomaticCell = SelfManager.self();
        Tasks.forEach(Tasks.commandTask(function(n) {
          if (arguments.length < 1) {
            throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
          }
          procedures["POSITION-AND-LINK-ALLELES"](SelfManager.self(),n,"left");
          procedures["POSITION-AND-LINK-ALLELES"](SelfManager.self(),n,"right");
        }), [1, 2, 3, 4]);
        ListPrims.oneOf(world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() {
          return ((!SelfManager.self().getVariable("owned-by-fish?") && Prims.equality(SelfManager.self().getVariable("gene"), 5)) && Prims.equality(SelfManager.self().getVariable("value"), "X"));
        })).ask(function() {
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
          lastSexAllele = "Y";
        }
        else {
          lastSexAllele = "X";
        }
        ListPrims.oneOf(world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() {
          return ((!SelfManager.self().getVariable("owned-by-fish?") && Prims.equality(SelfManager.self().getVariable("gene"), 5)) && Prims.equality(SelfManager.self().getVariable("value"), lastSexAllele));
        })).ask(function() {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      let pairShiftRight = 0;
      let sideShift = 0;
      if (Prims.equality(whichSide, "right")) {
        sideShift = world.observer.getGlobal("intra-chromosome-pair-spacing");
      }
      else {
        sideShift = 0;
      }
      pairShiftRight = ((world.observer.getGlobal("inter-chromosome-pair-spacing") * geneNumber) - 0.45);
      ListPrims.oneOf(world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() {
        return (!SelfManager.self().getVariable("owned-by-fish?") && Prims.equality(SelfManager.self().getVariable("gene"), geneNumber));
      })).ask(function() {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      let myZygote = Nobody;
      let distanceToZygote = 0;
      if (world.observer.getGlobal("see-sex-cells?")) {
        world.observer.setGlobal("gamete-forward-step", 0.08);
      }
      else {
        world.observer.setGlobal("gamete-forward-step", 1);
      }
      world.turtleManager.turtlesOfBreed("GAMETE-CELLS").ask(function() {
        myZygote = ListPrims.oneOf(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }));
        distanceToZygote = SelfManager.self().distance(myZygote);
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      let femaleSexCellAlleles = Nobody;
      let maleSexCellAlleles = Nobody;
      let maleGamete = Nobody;
      let femaleGamete = Nobody;
      let thisSomaticCell = Nobody;
      world.turtleManager.turtlesOfBreed("FISH-ZYGOTES").ask(function() {
        maleGamete = world.turtleManager.turtlesOfBreed("GAMETE-CELLS").agentFilter(function() {
          return (LinkPrims.isOutLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(SelfManager.self().getVariable("sex"), "male"));
        });
        femaleGamete = world.turtleManager.turtlesOfBreed("GAMETE-CELLS").agentFilter(function() {
          return (LinkPrims.isOutLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(SelfManager.self().getVariable("sex"), "female"));
        });
        if ((!maleGamete.isEmpty() && !femaleGamete.isEmpty())) {
          if ((Prims.lte(SelfManager.self().distance(ListPrims.oneOf(maleGamete)), 0.01) && Prims.lte(SelfManager.self().distance(ListPrims.oneOf(femaleGamete)), 0.01))) {
            procedures["SETUP-NEW-SOMATIC-CELL-ATTRIBUTES"]();
            thisSomaticCell = SelfManager.self();
            maleGamete.ask(function() {
              maleSexCellAlleles = procedures["ALLELES-THAT-BELONG-TO-THIS-GAMETE"]();
              SelfManager.self().die();
            }, true);
            femaleGamete.ask(function() {
              femaleSexCellAlleles = procedures["ALLELES-THAT-BELONG-TO-THIS-GAMETE"]();
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      let allAlleles = world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", thisZygote); });
      Tasks.forEach(Tasks.commandTask(function(thisGene) {
        if (arguments.length < 1) {
          throw new Error("anonymous procedure expected 1 input, but only got " + arguments.length);
        }
        if (Prims.gt(allAlleles.agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("gene"), thisGene) && Prims.equality(SelfManager.self().getVariable("side"), "left"));
        }).size(), 1)) {
          ListPrims.oneOf(allAlleles.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("gene"), thisGene); })).ask(function() {
            SelfManager.self().setVariable("heading", 90);
            SelfManager.self().fd(world.observer.getGlobal("intra-chromosome-pair-spacing"));
            SelfManager.self().setVariable("side", "right");
          }, true);
        }
        if (Prims.gt(allAlleles.agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("gene"), thisGene) && Prims.equality(SelfManager.self().getVariable("side"), "right"));
        }).size(), 1)) {
          ListPrims.oneOf(allAlleles.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("gene"), thisGene); })).ask(function() {
            SelfManager.self().setVariable("heading", 90);
            SelfManager.self().fd(-world.observer.getGlobal("intra-chromosome-pair-spacing"));
            SelfManager.self().setVariable("side", "left");
          }, true);
        }
      }), [1, 2, 3, 4, 5]);
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
  procs["alignAllelesForThisSomaticCell"] = temp;
  procs["ALIGN-ALLELES-FOR-THIS-SOMATIC-CELL"] = temp;
  temp = (function() {
    try {
      let mom = Nobody;
      let dad = Nobody;
      let xcorDad = 0;
      let turtlesInThisRegion = Nobody;
      let potentialMates = Nobody;
      let allFishAndFishZygotes = Nobody;
      if (!world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); }).isEmpty()) {
        ListPrims.oneOf(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); })).ask(function() {
          dad = SelfManager.self();
          xcorDad = SelfManager.self().getVariable("xcor");
        }, true);
        dad.ask(function() { turtlesInThisRegion = procedures["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"](); }, true);
        allFishAndFishZygotes = turtlesInThisRegion.agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH")) || Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH-ZYGOTES")));
        });
        potentialMates = turtlesInThisRegion.agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")) && Prims.equality(SelfManager.self().getVariable("sex"), "female"));
        });
        if (!potentialMates.isEmpty()) {
          ListPrims.oneOf(potentialMates).ask(function() { mom = SelfManager.self(); }, true);
          let thisCarryingCapacity = procedures["CARRYING-CAPACITY-IN-THIS-REGION"](xcorDad);
          if (Prims.lt(allFishAndFishZygotes.size(), thisCarryingCapacity)) {
            procedures["REPRODUCE-OFFSPRING-FROM-THESE-TWO-PARENTS"](mom,dad);
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
  procs["findPotentialMates"] = temp;
  procs["FIND-POTENTIAL-MATES"] = temp;
  temp = (function(mom, dad) {
    try {
      let child = Nobody;
      mom.ask(function() {
        SelfManager.self().hatch(1, "").ask(function() {
          SelfManager.self().setVariable("heading", 0);
          SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"));
          SelfManager.self().setVariable("size", 1);
          SelfManager.self().setVariable("shape", "heart");
          SelfManager.self().setVariable("color", 15);
          child = SelfManager.self();
        }, true);
      }, true);
      mom.ask(function() { procedures["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"](child); }, true);
      dad.ask(function() { procedures["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"](child); }, true);
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
  procs["reproduceOffspringFromTheseTwoParents"] = temp;
  procs["REPRODUCE-OFFSPRING-FROM-THESE-TWO-PARENTS"] = temp;
  temp = (function(child) {
    try {
      let thisNewGameteCell = Nobody;
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
        thisNewGameteCell = SelfManager.self();
      }, true);
      Tasks.forEach(Tasks.commandTask(function(thisGene) {
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
      }), [1, 2, 3, 4, 5]);
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
  procs["linkAllelesToGametesAndGametesToZygote"] = temp;
  procs["LINK-ALLELES-TO-GAMETES-AND-GAMETES-TO-ZYGOTE"] = temp;
  temp = (function() {
    try {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
        return (!Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") && !Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"));
      }).ask(function() { procedures["REMOVE-THIS-FISH"](); }, true);
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
  procs["detectFishOutsideTheWater"] = temp;
  procs["DETECT-FISH-OUTSIDE-THE-WATER"] = temp;
  temp = (function() {
    try {
      let nearestWaterPatch = Nobody;
      let waterPatches = world.patches().agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") && !SelfManager.self().getPatchVariable("divider-here?"));
      });
      world.turtleManager.turtlesOfBreed("FISH").ask(function() {
        nearestWaterPatch = waterPatches.minOneOf(function() { return SelfManager.self().distance(SelfManager.myself()); });
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      let boneTransparency = 0;
      let colorList = [];
      world.turtleManager.turtlesOfBreed("FISH-BONES").ask(function() {
        SelfManager.self().setVariable("countdown", (SelfManager.self().getVariable("countdown") - 1));
        boneTransparency = Prims.div((SelfManager.self().getVariable("countdown") * 255), 50);
        colorList = ListPrims.lput(boneTransparency, [255, 255, 255]);
        SelfManager.self().setVariable("color", colorList);
        if (Prims.lte(SelfManager.self().getVariable("countdown"), 0)) {
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
  procs["cleanUpFishBones"] = temp;
  procs["CLEAN-UP-FISH-BONES"] = temp;
  temp = (function() {
    try {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      let pMouseXcor = MousePrims.getX();
      let pMouseYcor = MousePrims.getY();
      let pTypeOfPatch = world.getPatchAt(pMouseXcor, pMouseYcor).projectionBy(function() { return SelfManager.self().getPatchVariable("type-of-patch"); });
      let mouseWasJustDown_p = MousePrims.isDown();
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
          let dividerXcor = SelfManager.self().getPatchVariable("pxcor");
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      let thisFishBody = Nobody;
      SelfManager.self().hatch(1, "").ask(function() {
        SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH"));
        SelfManager.self().setVariable("bearing", Prims.randomFloat(360));
        SelfManager.self().setVariable("heading", 0);
        SelfManager.self().setVariable("size", 1);
        thisFishBody = SelfManager.self();
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
      if (e instanceof Exception.ReportInterrupt) {
        throw new Error("REPORT can only be used inside TO-REPORT.");
      } else if (e instanceof Exception.StopInterrupt) {
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
      let thisSomaticCell = SelfManager.self();
      let _pound_OfDominantAlleles = world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() {
        return (LinkPrims.isInLinkNeighbor("LINKS", thisSomaticCell) && Prims.equality(SelfManager.self().getVariable("value"), dominantAllele));
      }).size();
      if (Prims.gt(_pound_OfDominantAlleles, 0)) {
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
  procs["hasAtLeastOneDominantSetOfInstructionsFor"] = temp;
  procs["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"] = temp;
  temp = (function() {
    try {
      let thisShape = "";
      let thisFish = SelfManager.myself();
      SelfManager.myself().ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("F")) {
          thisShape = world.observer.getGlobal("forked-tail-shape");
        }
        else {
          thisShape = world.observer.getGlobal("no-forked-tail-shape");
        }
      }, true);
      throw new Exception.ReportInterrupt(thisShape);
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
  procs["tailShapePhenotype"] = temp;
  procs["TAIL-SHAPE-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      let thisSpotsShape = "";
      SelfManager.myself().ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("B")) {
          thisSpotsShape = world.observer.getGlobal("spots-shape");
        }
        else {
          thisSpotsShape = world.observer.getGlobal("no-spots-shape");
        }
      }, true);
      throw new Exception.ReportInterrupt(thisSpotsShape);
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
  procs["rearSpotsPhenotype"] = temp;
  procs["REAR-SPOTS-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      let thisColor = [];
      SelfManager.myself().ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("G")) {
          thisColor = world.observer.getGlobal("green-dorsal-fin-color");
        }
        else {
          thisColor = world.observer.getGlobal("no-green-dorsal-fin-color");
        }
      }, true);
      throw new Exception.ReportInterrupt(thisColor);
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
  procs["dorsalFinColorPhenotype"] = temp;
  procs["DORSAL-FIN-COLOR-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      let thisColor = [];
      let thisFish = SelfManager.myself();
      SelfManager.myself().ask(function() {
        if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("T")) {
          thisColor = world.observer.getGlobal("yellow-tail-fin-color");
        }
        else {
          thisColor = world.observer.getGlobal("no-yellow-tail-fin-color");
        }
      }, true);
      throw new Exception.ReportInterrupt(thisColor);
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
  procs["tailColorPhenotype"] = temp;
  procs["TAIL-COLOR-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      let thisSex = "";
      let thisCell = SelfManager.self();
      if (procedures["HAS-AT-LEAST-ONE-DOMINANT-SET-OF-INSTRUCTIONS-FOR"]("Y")) {
        thisSex = "male";
      }
      else {
        thisSex = "female";
      }
      throw new Exception.ReportInterrupt(thisSex);
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
  procs["sexPhenotype"] = temp;
  procs["SEX-PHENOTYPE"] = temp;
  temp = (function() {
    try {
      throw new Exception.ReportInterrupt(world.turtleManager.turtlesOfBreed("ALLELES").agentFilter(function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }));
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
  procs["allelesThatBelongToThisGamete"] = temp;
  procs["ALLELES-THAT-BELONG-TO-THIS-GAMETE"] = temp;
  temp = (function() {
    try {
      throw new Exception.ReportInterrupt((world.topology.minPxcor + 2));
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
  procs["leftSideOfWaterInTank"] = temp;
  procs["LEFT-SIDE-OF-WATER-IN-TANK"] = temp;
  temp = (function() {
    try {
      throw new Exception.ReportInterrupt((world.topology.maxPxcor - 2));
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
  procs["rightSideOfWaterInTank"] = temp;
  procs["RIGHT-SIDE-OF-WATER-IN-TANK"] = temp;
  temp = (function() {
    try {
      let turtlesInThisRegion = Nobody;
      let xcorOfThisTurtle = SelfManager.self().getVariable("xcor");
      let thisRegionLeftSide = procedures["LEFT-SIDE-OF-WATER-IN-TANK"]();
      let thisRegionRightSide = procedures["RIGHT-SIDE-OF-WATER-IN-TANK"]();
      let dividersToTheRight = world.patches().agentFilter(function() {
        return (SelfManager.self().getPatchVariable("divider-here?") && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), xcorOfThisTurtle));
      });
      let dividersToTheLeft = world.patches().agentFilter(function() {
        return (SelfManager.self().getPatchVariable("divider-here?") && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), xcorOfThisTurtle));
      });
      if (!dividersToTheRight.isEmpty()) {
        thisRegionRightSide = ListPrims.min(dividersToTheRight.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); }));
      }
      if (!dividersToTheLeft.isEmpty()) {
        thisRegionLeftSide = ListPrims.max(dividersToTheLeft.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); }));
      }
      turtlesInThisRegion = world.turtles().agentFilter(function() {
        return (Prims.gte(SelfManager.self().getVariable("xcor"), thisRegionLeftSide) && Prims.lte(SelfManager.self().getVariable("xcor"), thisRegionRightSide));
      });
      throw new Exception.ReportInterrupt(turtlesInThisRegion);
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
  procs["otherTurtlesInThisTurtlesTankRegion"] = temp;
  procs["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"] = temp;
  temp = (function() {
    try {
      let fishInThisRegion = procedures["OTHER-TURTLES-IN-THIS-TURTLES-TANK-REGION"]().agentFilter(function() {
        return Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH"));
      });
      let maleFishInThisRegion = fishInThisRegion.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "male"); });
      let femaleFishInThisRegion = fishInThisRegion.agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("sex"), "female"); });
      if ((!maleFishInThisRegion.isEmpty() && !femaleFishInThisRegion.isEmpty())) {
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
  procs["bothSexesInThisFishsTankRegion_p"] = temp;
  procs["BOTH-SEXES-IN-THIS-FISHS-TANK-REGION?"] = temp;
  temp = (function(thisXcor) {
    try {
      let thisRegionLeftSide = procedures["LEFT-SIDE-OF-WATER-IN-TANK"]();
      let thisRegionRightSide = procedures["RIGHT-SIDE-OF-WATER-IN-TANK"]();
      let dividersToTheRight = world.patches().agentFilter(function() {
        return (SelfManager.self().getPatchVariable("divider-here?") && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), thisXcor));
      });
      let dividersToTheLeft = world.patches().agentFilter(function() {
        return (SelfManager.self().getPatchVariable("divider-here?") && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), thisXcor));
      });
      if (!dividersToTheRight.isEmpty()) {
        thisRegionRightSide = ListPrims.min(dividersToTheRight.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); }));
      }
      if (!dividersToTheLeft.isEmpty()) {
        thisRegionLeftSide = ListPrims.max(dividersToTheLeft.projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); }));
      }
      let tankCapacityOfThisRegion = Prims.div(((thisRegionRightSide - thisRegionLeftSide) * world.observer.getGlobal("carrying-capacity")), 25);
      throw new Exception.ReportInterrupt(tankCapacityOfThisRegion);
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
