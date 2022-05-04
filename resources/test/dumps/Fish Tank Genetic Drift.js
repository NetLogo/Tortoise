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
var { DeathInterrupt, StopInterrupt } = tortoise_require('util/interrupts');

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
    return ProcedurePrims.runInPlotContext('Tail Shape Alleles', 'big-F', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-f-alleles"));; });
  }),
  new PenBundle.Pen('small-f', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Tail Shape Alleles', 'small-f', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-f-alleles"));; });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Tail Color Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-T', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Tail Color Alleles', 'big-T', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-t-alleles"));; });
  }),
  new PenBundle.Pen('small-t', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Tail Color Alleles', 'small-t', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-t-alleles"));; });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Dorsal Fin Color Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-G', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Dorsal Fin Color Alleles', 'big-G', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-g-alleles"));; });
  }),
  new PenBundle.Pen('small-g', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Dorsal Fin Color Alleles', 'small-g', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-g-alleles"));; });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Sex Chromosomes';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('X', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Sex Chromosomes', 'X', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-x-chromosomes"));; });
  }),
  new PenBundle.Pen('Y', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Sex Chromosomes', 'Y', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-y-chromosomes"));; });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'dorsal fin & spotting variations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('spots', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('dorsal fin & spotting variations', 'spots', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-spots"));; });
  }),
  new PenBundle.Pen('no spots', plotOps.makePenOps, false, new PenBundle.State(6, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('dorsal fin & spotting variations', 'no spots', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-spots"));; });
  }),
  new PenBundle.Pen('green dorsal', plotOps.makePenOps, false, new PenBundle.State(67, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('dorsal fin & spotting variations', 'green dorsal', function() {
      plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-green-dorsal-fins"));;
    });
  }),
  new PenBundle.Pen('no green', plotOps.makePenOps, false, new PenBundle.State(96, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('dorsal fin & spotting variations', 'no green', function() {
      plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-green-dorsal-fins"));;
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'Body Spot Alleles';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('big-B', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Body Spot Alleles', 'big-B', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-big-b-alleles"));; });
  }),
  new PenBundle.Pen('small-b', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('Body Spot Alleles', 'small-b', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-small-b-alleles"));; });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# alleles", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = 'tail fin variations';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('forked tail', plotOps.makePenOps, false, new PenBundle.State(0, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('tail fin variations', 'forked tail', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-forked-tails"));; });
  }),
  new PenBundle.Pen('no fork', plotOps.makePenOps, false, new PenBundle.State(7, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('tail fin variations', 'no fork', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-forked-tails"));; });
  }),
  new PenBundle.Pen('yellow tail', plotOps.makePenOps, false, new PenBundle.State(44, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('tail fin variations', 'yellow tail', function() {
      plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-yellow-tail-fins"));;
    });
  }),
  new PenBundle.Pen('no yellow', plotOps.makePenOps, false, new PenBundle.State(95, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('tail fin variations', 'no yellow', function() {
      plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-no-yellow-tail-fins"));;
    });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", true, true, 0, 10, 0, 10, setup, update);
})(), (function() {
  var name    = '# of males & females';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('females', plotOps.makePenOps, false, new PenBundle.State(134, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('# of males & females', 'females', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-females"));; });
  }),
  new PenBundle.Pen('males', plotOps.makePenOps, false, new PenBundle.State(96, 1, PenBundle.DisplayMode.Line), function() {}, function() {
    return ProcedurePrims.runInPlotContext('# of males & females', 'males', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal("#-of-males"));; });
  })];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "time", "# of", true, true, 0, 10, 0, 10, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "fish", singular: "a-fish", varNames: ["sex", "bearing"] }, { name: "fish-parts", singular: "a-fish-part", varNames: [] }, { name: "somatic-cells", singular: "somatic-cell", varNames: ["sex"] }, { name: "gamete-cells", singular: "gamete-cell", varNames: ["sex"] }, { name: "alleles", singular: "allele", varNames: ["gene", "value", "owned-by-fish?", "side"] }, { name: "fish-bones", singular: "a-fish-bones", varNames: ["countdown"] }, { name: "fish-zygotes", singular: "a-fish-zygote", varNames: [] }, { name: "mouse-cursors", singular: "mouse-cursor", varNames: [] }])([], [])('breed [fish a-fish]  ;; fish parts include fins, tails, and spots - all of ;; which are tied and attached to the main fish body breed [fish-parts a-fish-part]  ;; fish are tied to somatic-cells.  Fish are what ;; wander about (the body of the organism), ;; while the somatic cell contains all the ;; genetic information of the organism breed [somatic-cells somatic-cell]  ;; sex cells that are hatched from somatic cells ;; through a simplified form of meiosis breed [gamete-cells gamete-cell]  ;; alleles are tied to somatic cells or gamete ;; cells - 1 allele is assigned to one chromosome breed [alleles allele]  breed [fish-bones a-fish-bones]     ;; used for visualization of fish death breed [fish-zygotes a-fish-zygote]  ;; used for visualization of a fish mating event  ;; used for visualization of different types of mouse actions the user can do in the ;; fish tank - namely removing fish and adding/subtracting dividers breed [mouse-cursors mouse-cursor]  fish-own          [sex bearing] somatic-cells-own [sex] gamete-cells-own  [sex] fish-bones-own    [countdown] alleles-own       [gene value owned-by-fish? side]  patches-own [type-of-patch divider-here?]  globals [    ;; for keeping track of the # of alleles of each type   #-big-B-alleles  #-small-b-alleles   #-big-T-alleles  #-small-t-alleles   #-big-F-alleles  #-small-f-alleles   #-big-G-alleles  #-small-g-alleles   #-y-chromosomes  #-x-chromosomes    ;; globals for keeping track of default values for   ;; shapes and colors used for phenotypes   water-color   green-dorsal-fin-color  no-green-dorsal-fin-color   yellow-tail-fin-color   no-yellow-tail-fin-color   male-color              female-color   spots-shape             no-spots-shape   forked-tail-shape       no-forked-tail-shape    ;;  globals for keeping track of phenotypes   #-of-green-dorsal-fins  #-of-no-green-dorsal-fins   #-of-yellow-tail-fins   #-of-no-yellow-tail-fins   #-of-spots              #-of-no-spots   #-of-forked-tails       #-of-no-forked-tails   #-of-males              #-of-females    ;; keeps track of whether the mouse button was down on last tick   mouse-continuous-down?    num-fish-removed   num-fish-born   num-fish-in-tank   fish-forward-step      ;; size of movement steps each tick   gamete-forward-step    ;; size of movement steps each tick    ;; used for spacing the chromosomes out in the   ;; karyotypes of the somatic cells and gametes   intra-chromosome-pair-spacing   inter-chromosome-pair-spacing    size-of-karyotype-background-for-cells    initial-#-females   initial-#-males ]  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;; setup procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to setup   clear-all   set mouse-continuous-down? false   set intra-chromosome-pair-spacing 0.20   set inter-chromosome-pair-spacing 0.55   set fish-forward-step 0.04   set num-fish-removed 0   set num-fish-born 0   set num-fish-in-tank 0    ;; the size of the large pink rectangle used as the   ;; background for the cell or karyotype of the cell   set size-of-karyotype-background-for-cells 5.2    set initial-#-females (floor ((initial-females / 100) * carrying-capacity))   set initial-#-males carrying-capacity - initial-#-females    set green-dorsal-fin-color    [90 255 90 255]   set no-green-dorsal-fin-color [176 196 222 255]   set yellow-tail-fin-color     [255 255 0 255]   set no-yellow-tail-fin-color  [176 196 255 255]   set female-color              [255 150 150 255]   set male-color                [150 150 255 255]   set water-color               blue - 1.5    set spots-shape                 \"fish-spots\"   set no-spots-shape              \"none\"   set forked-tail-shape           \"fish-forked-tail\"   set no-forked-tail-shape        \"fish-no-forked-tail\"   set-default-shape fish          \"fish-body\"   set-default-shape somatic-cells \"cell-somatic\"   set-default-shape fish-bones    \"fish-bones\"    create-mouse-cursors 1 [     set shape \"x\"     set hidden? true     set color red     set heading 0   ]    set-tank-regions   create-initial-gene-pool   create-initial-fish   visualize-tank   visualize-fish-and-alleles   reset-ticks end   to set-tank-regions   let min-pycor-edge min-pycor  let max-pycor-edge max-pycor   let water-patches nobody   ask patches [     set divider-here? false     set type-of-patch \"water\"     ;; water edge are the patches right up against the tank wall on the inside of the     ;; tank - they are used to determine whether to turn the fish around as they are     ;; moving about the tank     if pycor =  (max-pycor-edge - 2) or       pycor = (min-pycor-edge + 2) or       pxcor = left-side-of-water-in-tank or       pxcor = right-side-of-water-in-tank [       set type-of-patch \"water-edge\"     ]     if pycor >= (max-pycor-edge - 1) [       set type-of-patch \"air\"     ]     if pxcor <= (left-side-of-water-in-tank - 1) or       pxcor >= (right-side-of-water-in-tank + 1) or       pycor <= (min-pycor-edge + 1) [       set type-of-patch \"tank-wall\"     ]     if pycor = (max-pycor-edge) or       pycor = (min-pycor-edge) or       pxcor = (left-side-of-water-in-tank - 2) or       pxcor >= (right-side-of-water-in-tank + 2) [       set type-of-patch \"air\"     ]   ]   set water-patches  patches with [type-of-patch = \"water\"] end   to create-initial-gene-pool   let num-big-alleles 0   let initial-number-fish (carrying-capacity)    set num-big-alleles  round ((initial-alleles-big-b * 2 *  initial-number-fish) / 100)   make-initial-alleles-for-gene 1 \"B\" \"b\" num-big-alleles   set num-big-alleles  round ((initial-alleles-big-t * 2 *  initial-number-fish) / 100)   make-initial-alleles-for-gene 2 \"T\" \"t\" num-big-alleles   set num-big-alleles  round ((initial-alleles-big-f * 2 *  initial-number-fish) / 100)   make-initial-alleles-for-gene 3 \"F\" \"f\" num-big-alleles   set num-big-alleles  round ((initial-alleles-big-g * 2 *  initial-number-fish) / 100)   make-initial-alleles-for-gene 4 \"G\" \"g\" num-big-alleles    make-initial-alleles-for-gene 5 \"Y\" \"X\" initial-#-males end   to create-initial-fish   ;; makes the cells for the initial fish   create-somatic-cells initial-#-males [set sex \"male\"]   create-somatic-cells initial-#-females [set sex \"female\"]   ask somatic-cells [setup-new-somatic-cell-attributes]   ;; randomly sorts out the gene pool to each somatic cell   distribute-gene-pool-to-somatic-cells   ;; grows the body parts from the resulting genotype, and distributes the fish   ask somatic-cells [grow-fish-parts-from-somatic-cell]   distribute-fish-in-tank end   to setup-new-somatic-cell-attributes   ;; somatic cells are the same as body cells - they are the rectangle shape that is   ;; tied to the fish and chromosomes that looks like a karyotype   set heading 0   set breed somatic-cells   set color [100 100 100 100]   set size size-of-karyotype-background-for-cells   set hidden? true end   to distribute-fish-in-tank    let water-patches patches with [type-of-patch = \"water\"]    let water-patch nobody    ask fish [      move-to one-of water-patches    ] end   to make-initial-alleles-for-gene [gene-number allele-1 allele-2 num-big-alleles ]   let initial-number-fish initial-#-males + initial-#-females   create-alleles 2 * (initial-number-fish) [     set gene gene-number     set shape (word \"gene-\" gene-number)     set heading 0     set owned-by-fish? false     set value allele-2     set color  [0 0 0 255]     set label-color color     set label (word value \"     \" )   ]   ;; after coloring all the alleles with black band on chromosomes with the   ;; dominant allele label, now go back and select the correct proportion of   ;; these to recolor code as recessive alleles with white bands on chromosomes   ;; and add recessive letter label   ask n-of num-big-alleles  alleles with [gene = gene-number] [     set value allele-1     set color [220 220 220 255]     set label (word value \"     \" )     set label-color color     ] end    to distribute-gene-pool-to-somatic-cells   ;; randomly selects some chromosomes for this cell   let this-somatic-cell nobody   let last-sex-allele \"\"    ask somatic-cells [     set this-somatic-cell self     foreach [ 1 2 3 4 ] [ n ->       ;; assign one of the alleles to appear on the left side of the chromosome pair       position-and-link-alleles self n \"left\"       ;; assign the other allele to appear on the right side       position-and-link-alleles self n \"right\"     ]      ;; now assign the sex chromosome pair, putting one of the Xs on the left,     ;; and the other chromosome (whether it is an X or } on the right     ask one-of alleles with [not owned-by-fish? and gene = 5 and value = \"X\"] [        set owned-by-fish? true        set size 1.2        set xcor ((inter-chromosome-pair-spacing * 4) + .1)        set ycor -0.4        set side \"left\"        create-link-from this-somatic-cell  [          set hidden? true          set tie-mode \"fixed\"          tie        ]     ]     ifelse sex = \"male\" [ set last-sex-allele \"Y\" ] [ set last-sex-allele \"X\" ]     ask one-of alleles with [       not owned-by-fish? and gene = 5 and value = last-sex-allele     ] [       set owned-by-fish? true       set size 1.2       set xcor ((inter-chromosome-pair-spacing * 4) + intra-chromosome-pair-spacing + .1)       set ycor -0.4       set side \"right\"       create-link-from this-somatic-cell [         set hidden? true         set tie-mode \"fixed\"         tie       ]     ]   ] end   to position-and-link-alleles [this-somatic-cell gene-number which-side]   let pair-shift-right 0   let side-shift 0    ;; adjusts the spacing between chromosome pairs (1-4( so that one of each pair   ;; is moved to the left and one of each pair is moved to the right   ifelse which-side = \"right\"     [ set side-shift intra-chromosome-pair-spacing ]     [ set side-shift 0 ]   set pair-shift-right ((inter-chromosome-pair-spacing * gene-number) - .45)    ask one-of alleles with [not owned-by-fish? and gene = gene-number] [     set owned-by-fish? true     set side which-side     set size 1.2     set xcor ([xcor] of this-somatic-cell + (pair-shift-right + side-shift))     set ycor ([ycor] of this-somatic-cell - 0.4)     create-link-from this-somatic-cell [       set hidden? true       set tie-mode \"fixed\"       tie     ]   ] end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;; runtime-procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to go    wander    update-statistics    detect-fish-outside-the-water    detect-and-move-fish-at-inside-tank-boundary    auto-selection    clean-up-fish-bones    if auto-replace? [find-potential-mates]    move-gametes-together    convert-zygote-into-somatic-cell    detect-mouse-selection-event    visualize-fish-and-alleles     visualize-tank    tick end   to auto-selection   if auto-replace? [     ;; use EVERY to limit the rate of selection     ;; to slow things down for visualization purposes     every 0.25 [       ;;let under-carrying-capacity carrying-capacity -  num-fish-in-tank       if any? fish [         ask one-of fish [           if both-sexes-in-this-fishs-tank-region? [             remove-this-fish           ]         ]       ]     ]   ] end    to move-gametes-together   ;; moves the male sex cell (gamete) toward its target   ;; female sex cell it will fertilize (zygote).   let my-zygote nobody   let distance-to-zygote 0   ;; if the user as the see-sex-cells? switch on then slow down their motion   ifelse see-sex-cells? [ set gamete-forward-step 0.08] [ set gamete-forward-step 1]     ask gamete-cells [      set my-zygote one-of fish-zygotes with [in-link-neighbor? myself]      set distance-to-zygote distance my-zygote      if distance-to-zygote > 0       [ face my-zygote         ifelse distance-to-zygote > gamete-forward-step [fd gamete-forward-step ] [fd distance-to-zygote]         set heading 0       ]    ] end   to convert-zygote-into-somatic-cell   ;; upon arriving at the female sex cell the male sex cell will fertilize   ;; it and disappear the zygote (shown as a heart) will convert into a   ;; somatic cell and a fish will immediately appear (skipping the time   ;; it takes for the embryo to form)   let female-sex-cell-alleles nobody   let male-sex-cell-alleles nobody   let male-gamete nobody   let female-gamete nobody   let this-somatic-cell nobody    ask fish-zygotes [    set male-gamete gamete-cells with [out-link-neighbor? myself and sex = \"male\"]    set female-gamete gamete-cells with [out-link-neighbor? myself and sex = \"female\"]    if any? male-gamete and any? female-gamete [      if distance one-of male-gamete <= .01 and distance one-of female-gamete <= .01  [        ;; close enough for fertilization to be complete        setup-new-somatic-cell-attributes        set this-somatic-cell self        ask male-gamete [          set male-sex-cell-alleles alleles-that-belong-to-this-gamete          die        ]        ask female-gamete [          set female-sex-cell-alleles alleles-that-belong-to-this-gamete          die        ]        ask male-sex-cell-alleles [          create-link-from this-somatic-cell [            set hidden? true            set tie-mode \"fixed\"            tie          ]        ]        ask female-sex-cell-alleles [          create-link-from this-somatic-cell [            set hidden? true            set tie-mode \"fixed\"            tie          ]        ]        align-alleles-for-this-somatic-cell this-somatic-cell        set sex sex-phenotype        grow-fish-parts-from-somatic-cell        set num-fish-born num-fish-born + 1      ]    ]  ] end   to align-alleles-for-this-somatic-cell [this-zygote]   ;; when gametes merge they may both have chromosomes on the right   ;; (for each matching pair) or both on the left   ;; this procedure moves one of them over if that is the case   let all-alleles alleles with [in-link-neighbor? this-zygote]   foreach [1 2 3 4 5] [ this-gene ->     if count all-alleles with [gene = this-gene and side = \"left\"]  > 1 [       ask one-of all-alleles with [gene = this-gene] [         set heading 90         forward intra-chromosome-pair-spacing         set side \"right\"       ]     ]     if count all-alleles with [gene = this-gene and side = \"right\"] > 1 [       ask one-of all-alleles with [gene = this-gene] [         set heading 90         back         intra-chromosome-pair-spacing         set side \"left\"       ]     ]   ] end   to find-potential-mates   let mom nobody   let dad nobody   let xcor-dad 0   let turtles-in-this-region nobody   let potential-mates nobody   let all-fish-and-fish-zygotes nobody    if any? somatic-cells with [sex = \"male\"] [     ask one-of somatic-cells with [ sex = \"male\" ] [       set dad self       set xcor-dad xcor     ]     ask dad [       ;; if  parent genetic information for sexual reproduction       ;; still exists in the gene pool in this region       set turtles-in-this-region other-turtles-in-this-turtles-tank-region     ]     set all-fish-and-fish-zygotes turtles-in-this-region with [       breed = fish or breed = fish-zygotes     ]     set potential-mates turtles-in-this-region with [       breed = somatic-cells and sex = \"female\"     ]     if any? potential-mates [        ask one-of potential-mates  [ set mom self ]        ;;; only reproduce up to the carrying capacity in this region allowed        let this-carrying-capacity  carrying-capacity-in-this-region xcor-dad        if count all-fish-and-fish-zygotes < this-carrying-capacity [          reproduce-offspring-from-these-two-parents mom dad        ]     ]   ] end   to reproduce-offspring-from-these-two-parents [mom dad]   let child nobody     ask mom [       hatch 1 [        set heading 0        set breed fish-zygotes        set size 1        set shape \"heart\"        set color red        set child self       ]      ]     ask mom [ link-alleles-to-gametes-and-gametes-to-zygote child ]     ask dad [ link-alleles-to-gametes-and-gametes-to-zygote child ] end   to link-alleles-to-gametes-and-gametes-to-zygote [child]   let this-new-gamete-cell nobody   hatch 1 [     set breed gamete-cells     set heading 0     create-link-to child [set hidden? false] ;; link these gametes to the child     ifelse sex = \"male\"       [set shape \"cell-gamete-male\"]       [set shape \"cell-gamete-female\"]         set this-new-gamete-cell self     ]    foreach [1 2 3 4 5] [ this-gene ->     ask n-of 1 alleles with [in-link-neighbor? myself and  gene = this-gene]     [hatch 1 [set owned-by-fish? false        create-link-from this-new-gamete-cell  [set hidden? true  set tie-mode \"fixed\" tie]       ]     ]   ]  end   to wander   ask fish [     set heading bearing     rt random-float 70 lt random-float 70     set bearing heading     fd fish-forward-step     set heading 0     ]   ask somatic-cells [set heading 0] end    to detect-fish-outside-the-water      ask fish with [type-of-patch != \"water\" and type-of-patch != \"water-edge\"] [  remove-this-fish  ] end   to detect-and-move-fish-at-inside-tank-boundary    let nearest-water-patch nobody    let water-patches patches with [type-of-patch = \"water\" and not divider-here?]    ask fish [     set nearest-water-patch  min-one-of water-patches [distance myself]     if type-of-patch = \"tank-wall\" or type-of-patch = \"water-edge\"   [       set heading towards nearest-water-patch       fd fish-forward-step * 2       set heading 0       set bearing  random-float 360     ]     if divider-here? [move-to nearest-water-patch]    ] end   to clean-up-fish-bones   let bone-transparency 0   let color-list []    ask fish-bones [  ;;; fade away progressively the fish bone shape until the countdown in complete      set countdown countdown - 1      set bone-transparency (countdown * 255 / 50)      set color-list lput bone-transparency [255 255 255]      set color color-list      if countdown <= 0 [die]    ] end   to remove-this-fish  set num-fish-removed num-fish-removed + 1  hatch 1 [    ;; make the fish bones for visualization of this fishes death    set breed fish-bones    set color white    set countdown 25  ]  ask out-link-neighbors [    ;; ask the somatic cells and the fish-parts and the alleles attached to this fish to die first    ask out-link-neighbors [ die ]    die  ]  die end   to detect-mouse-selection-event    let p-mouse-xcor mouse-xcor   let p-mouse-ycor mouse-ycor   let p-type-of-patch [type-of-patch] of patch p-mouse-xcor p-mouse-ycor   let mouse-was-just-down? mouse-down?    ask mouse-cursors [     setxy p-mouse-xcor p-mouse-ycor     ;;;;;;  cursor visualization ;;;;;;;;;;;;     if (p-type-of-patch = \"water\") [       set hidden? false       set shape \"x\"       set label-color white       set label \"remove fish\"     ]     if divider-here? and p-type-of-patch = \"tank-wall\" [       set hidden? false       set shape \"subtract divider\"       set label-color white       set label \"remove divider\"     ]     if not divider-here? and p-type-of-patch = \"tank-wall\" [       set hidden? false       set shape \"add divider\"       set label-color white       set label \"add divider\"     ]     if (p-type-of-patch != \"water\" and p-type-of-patch != \"tank-wall\") [       set hidden? true       set shape \"x\"       set label \"\"     ]     ;;;;; cursor actions ;;;;;;;;;;;;;;;     if mouse-was-just-down? [       ask fish-here [remove-this-fish]     ]     if (mouse-was-just-down? and       not mouse-continuous-down? and       p-type-of-patch = \"tank-wall\" and       pycor = (min-pycor + 1) and       pxcor > (min-pxcor + 1) and       pxcor < (max-pxcor - 1)) [       set divider-here? not divider-here?       let divider-xcor pxcor       ask patches with [         (type-of-patch = \"water\" or type-of-patch = \"water-edge\") and         pxcor = divider-xcor       ] [         set divider-here? not divider-here?       ]     ]     ifelse not mouse-inside? [set hidden? true][set hidden? false]   ]    ifelse mouse-was-just-down?     [ set mouse-continuous-down? true ]     [ set mouse-continuous-down? false ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;; calculate statistics procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to update-statistics   set num-fish-in-tank (count fish )    set #-big-B-alleles   count alleles with [value = \"B\"]   set #-small-b-alleles count alleles with [value = \"b\"]   set #-big-T-alleles   count alleles with [value = \"T\"]   set #-small-t-alleles count alleles with [value = \"t\"]   set #-big-F-alleles   count alleles with [value = \"F\"]   set #-small-f-alleles count alleles with [value = \"f\"]   set #-big-G-alleles   count alleles with [value = \"G\"]   set #-small-g-alleles count alleles with [value = \"g\"]   set #-y-chromosomes   count alleles with [value = \"Y\"]   set #-x-chromosomes   count alleles with [value = \"X\"]    set #-of-green-dorsal-fins     count fish-parts with [color = green-dorsal-fin-color]   set #-of-no-green-dorsal-fins  count fish-parts with [color = no-green-dorsal-fin-color]   set #-of-yellow-tail-fins      count fish-parts with [color = yellow-tail-fin-color]   set #-of-no-yellow-tail-fins   count fish-parts with [color = no-yellow-tail-fin-color]   set #-of-spots               count fish-parts with [shape = spots-shape and hidden? = false]   set #-of-no-spots            count fish-parts with [shape = spots-shape and hidden? = true]   set #-of-forked-tails        count fish-parts with [shape = forked-tail-shape]   set #-of-no-forked-tails     count fish-parts with [shape = no-forked-tail-shape]   set #-of-males               count fish with [sex = \"male\"]   set #-of-females             count fish with [sex = \"female\"]  end   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;; visualization-procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to visualize-tank    ask patches with [(type-of-patch = \"water\" or type-of-patch = \"water-edge\")] [      ifelse not divider-here?        [ set pcolor water-color ]        [ set pcolor gray - 3.5 ]    ]    ask patches with [type-of-patch = \"tank-wall\" ] [      ifelse not divider-here?        [ set pcolor gray - 3 ]        [ set pcolor gray - 4 ]      ]    ask patches with [type-of-patch = \"air\" ] [      set pcolor gray + 3    ] end   to visualize-fish-and-alleles   ifelse see-body-cells? [     ask somatic-cells [       set hidden? false       ask alleles with [ in-link-neighbor? myself ] [         set hidden? false       ]     ]   ] [     ask somatic-cells [       set hidden? true       ask alleles with [ in-link-neighbor? myself ] [         set hidden? true       ]     ]   ]   ifelse see-sex-cells? [     ask gamete-cells [       set hidden? false       ask alleles with [ in-link-neighbor? myself ] [         set hidden? false       ]     ]     ask fish-zygotes [       set hidden? false     ]   ] [     ask gamete-cells [       set hidden? true       ask alleles with [ in-link-neighbor? myself ] [         set hidden? true       ]     ]     ask fish-zygotes [       set hidden? true     ]   ]   ifelse see-fish? [     ask fish [       set hidden? false     ]     ask fish-parts [       set hidden? false     ]   ] [     ask fish [       set hidden? true     ]     ask fish-parts [       set hidden? true     ]   ] end   to grow-fish-parts-from-somatic-cell   let this-fish-body nobody    hatch 1 [     set breed fish     set bearing  random-float 360     set heading 0     set size 1     set this-fish-body self     if sex = \"male\" [set color male-color]     if sex = \"female\" [set color female-color]   ]   create-link-from  this-fish-body  [     ;; somatic cell will link to the fish body -     ;; thus following the fish body around as it moves     set hidden? true     set tie-mode \"fixed\"     tie   ]    hatch 1 [     set breed fish-parts  ;;;make tail     set breed fish-parts     set size 1     set shape tail-shape-phenotype     set color tail-color-phenotype     set heading -90 fd .4     create-link-from this-fish-body [       ;; fish-parts will link to the fish body -       ;; thus following the fish body around as it moves       set hidden? true       set tie-mode \"fixed\"       tie     ]   ]   hatch 1 [                      ;;;make fins     set breed fish-parts     set size 1     set shape \"fish-fins\"     set color dorsal-fin-color-phenotype     create-link-from this-fish-body  [       ;; fish-parts will link to the fish body -       ;; thus following the fish body around as it moves       set hidden? true       set tie-mode \"fixed\"       tie     ]   ]    hatch 1 [                      ;;;make spots     set breed fish-parts     set size 1     set shape rear-spots-phenotype     set color [ 0 0 0 255]     create-link-from this-fish-body [       ;; fish-parts will link to the fish body -       ;; thus following the fish body around as it moves       set hidden? true       set tie-mode \"fixed\"       tie     ]   ] end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;; phenotype reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;  to-report has-at-least-one-dominant-set-of-instructions-for [dominant-allele]   let this-somatic-cell self   let #-of-dominant-alleles count alleles with [in-link-neighbor? this-somatic-cell  and value = dominant-allele]   ifelse #-of-dominant-alleles > 0  [report true][report false]   ;; if it has at least one set of instructions (DNA) on how to build the protein reports true end   to-report tail-shape-phenotype   let this-shape \"\"   let this-fish  myself   ask myself ;; the somatic-cell   [     ifelse  has-at-least-one-dominant-set-of-instructions-for \"F\"        [set this-shape forked-tail-shape]      ;; tail fin forking results if protein is produced        [set this-shape no-forked-tail-shape]   ;; no tail fin forking results if protein is not produced (underlying tissue is continuous triangle shape)   ]   report this-shape end   to-report rear-spots-phenotype   let this-spots-shape \"\"   ask myself   [     ifelse has-at-least-one-dominant-set-of-instructions-for \"B\"        [set this-spots-shape spots-shape]    ;; spots on the rear of the fish result if protein is produced        [set this-spots-shape no-spots-shape]     ;; no spots on the rear of the fish result if protein is not produced   ]   report this-spots-shape end   to-report dorsal-fin-color-phenotype   let this-color []   ask myself   [     ifelse  has-at-least-one-dominant-set-of-instructions-for \"G\"       [set this-color green-dorsal-fin-color  ]      ;; green color results in dorsal fins if protein is produced       [set this-color no-green-dorsal-fin-color ]    ;; no green color results in dorsal fins if protein is not produced (underlying tissue color is grayish)   ]   report this-color end   to-report tail-color-phenotype   let this-color []   let this-fish  myself   ask myself   [     ifelse  has-at-least-one-dominant-set-of-instructions-for \"T\"        [set this-color yellow-tail-fin-color ]     ;; yellow color results in tail fins results if protein is produced        [set this-color no-yellow-tail-fin-color ]  ;; yellow color results in tail fins if protein is not produced (underlying tissue is continuous triangle shape)   ]   report this-color end   to-report sex-phenotype   let this-sex \"\"   let this-cell self   ifelse  has-at-least-one-dominant-set-of-instructions-for \"Y\"      [set this-sex \"male\"]      [set this-sex \"female\"]    report this-sex end  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;; other reporters ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   to-report alleles-that-belong-to-this-gamete   report alleles with [in-link-neighbor? myself] end   to-report left-side-of-water-in-tank   report (min-pxcor) + 2 end   to-report right-side-of-water-in-tank   report  (max-pxcor) - 2 end    to-report other-turtles-in-this-turtles-tank-region   ;; when dividers are up, it reports how many turtles are in this region for this turtle   let turtles-in-this-region nobody   let xcor-of-this-turtle xcor   let this-region-left-side left-side-of-water-in-tank   let this-region-right-side right-side-of-water-in-tank   let dividers-to-the-right patches with [divider-here? and pxcor > xcor-of-this-turtle]   let dividers-to-the-left  patches with [divider-here? and pxcor < xcor-of-this-turtle]    if any? dividers-to-the-right [set this-region-right-side min [pxcor] of dividers-to-the-right ]   if any? dividers-to-the-left  [set this-region-left-side max [pxcor] of dividers-to-the-left   ]    set turtles-in-this-region turtles with [xcor >= this-region-left-side and xcor <= this-region-right-side]   report turtles-in-this-region end   to-report both-sexes-in-this-fishs-tank-region?   let fish-in-this-region other-turtles-in-this-turtles-tank-region with [breed = fish]   let male-fish-in-this-region fish-in-this-region with [sex = \"male\"]   let female-fish-in-this-region fish-in-this-region with [sex = \"female\"]   ifelse (any? male-fish-in-this-region and any? female-fish-in-this-region ) [report true] [report false] end    to-report carrying-capacity-in-this-region [this-xcor]   let this-region-left-side left-side-of-water-in-tank   let this-region-right-side right-side-of-water-in-tank   let dividers-to-the-right patches with [divider-here? and pxcor > this-xcor]   let dividers-to-the-left  patches with [divider-here? and pxcor < this-xcor]    if any? dividers-to-the-right [ set this-region-right-side min [pxcor] of dividers-to-the-right ]   if any? dividers-to-the-left  [ set this-region-left-side max [pxcor] of dividers-to-the-left   ]   let tank-capacity-of-this-region (this-region-right-side - this-region-left-side) * carrying-capacity / 25   report tank-capacity-of-this-region end   ; Copyright 2011 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":610,"top":10,"right":1458,"bottom":467,"dimensions":{"minPxcor":0,"maxPxcor":29,"minPycor":0,"maxPycor":15,"patchSize":28,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-b","left":185,"top":150,"right":365,"bottom":183,"display":"initial-alleles-big-b","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"setup\"); if (R === StopInterrupt) { return R; }","source":"setup","left":15,"top":10,"right":93,"bottom":44,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"see-body-cells?","left":15,"top":135,"right":175,"bottom":168,"display":"see-body-cells?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.callCommand(\"go\"); if (R === StopInterrupt) { return R; }","source":"go","left":95,"top":10,"right":175,"bottom":44,"display":"go/stop","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-t","left":185,"top":505,"right":365,"bottom":538,"display":"initial-alleles-big-t","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-g","left":185,"top":270,"right":365,"bottom":303,"display":"initial-alleles-big-g","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-alleles-big-f","left":185,"top":390,"right":365,"bottom":423,"display":"initial-alleles-big-f","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Tail Shape Alleles', 'big-F', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-f-alleles\"));; }); }","display":"big-F","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-f-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Tail Shape Alleles', 'small-f', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-f-alleles\"));; }); }","display":"small-f","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-f-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Tail Shape Alleles","left":370,"top":370,"right":605,"bottom":490,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-F","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-f-alleles","type":"pen"},{"display":"small-f","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-f-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Tail Color Alleles', 'big-T', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-t-alleles\"));; }); }","display":"big-T","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-t-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Tail Color Alleles', 'small-t', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-t-alleles\"));; }); }","display":"small-t","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-t-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Tail Color Alleles","left":370,"top":490,"right":605,"bottom":610,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-T","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-t-alleles","type":"pen"},{"display":"small-t","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-t-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Dorsal Fin Color Alleles', 'big-G', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-g-alleles\"));; }); }","display":"big-G","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-g-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Dorsal Fin Color Alleles', 'small-g', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-g-alleles\"));; }); }","display":"small-g","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-g-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Dorsal Fin Color Alleles","left":370,"top":250,"right":605,"bottom":370,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-G","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-g-alleles","type":"pen"},{"display":"small-g","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-g-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Sex Chromosomes', 'X', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-x-chromosomes\"));; }); }","display":"X","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-x-chromosomes","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Sex Chromosomes', 'Y', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-y-chromosomes\"));; }); }","display":"Y","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-y-chromosomes","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Sex Chromosomes","left":370,"top":10,"right":605,"bottom":130,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"X","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-x-chromosomes","type":"pen"},{"display":"Y","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-y-chromosomes","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledMin":"2","compiledMax":"60","compiledStep":"1","variable":"carrying-capacity","left":15,"top":50,"right":175,"bottom":83,"display":"carrying-capacity","min":"2","max":"60","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"display":"TT / Tt / tT --> yellow tail               tt --> no yellow","left":201,"top":561,"right":357,"bottom":593,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype -->  Phenotype","left":200,"top":543,"right":365,"bottom":573,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype ---> Phenotype","left":200,"top":65,"right":366,"bottom":84,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype","left":194,"top":186,"right":356,"bottom":205,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype ","left":204,"top":303,"right":375,"bottom":321,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"Genotype --> Phenotype","left":200,"top":423,"right":364,"bottom":442,"fontSize":12,"color":37,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('dorsal fin & spotting variations', 'spots', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-spots\"));; }); }","display":"spots","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-spots","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('dorsal fin & spotting variations', 'no spots', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-spots\"));; }); }","display":"no spots","interval":1,"mode":0,"color":-5987164,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-spots","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('dorsal fin & spotting variations', 'green dorsal', function() {     plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-green-dorsal-fins\"));;   }); }","display":"green dorsal","interval":1,"mode":0,"color":-8330359,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-green-dorsal-fins","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('dorsal fin & spotting variations', 'no green', function() {     plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-green-dorsal-fins\"));;   }); }","display":"no green","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-green-dorsal-fins","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"dorsal fin & spotting variations","left":611,"top":490,"right":909,"bottom":610,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"spots","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-spots","type":"pen"},{"display":"no spots","interval":1,"mode":0,"color":-5987164,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-spots","type":"pen"},{"display":"green dorsal","interval":1,"mode":0,"color":-8330359,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-green-dorsal-fins","type":"pen"},{"display":"no green","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-green-dorsal-fins","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"display":"FF / Ff / fF --> forked tail              ff --> no fork","left":207,"top":444,"right":369,"bottom":478,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"GG / Gg / gG --> green dorsal fin                 gg --> no green fin","left":195,"top":320,"right":365,"bottom":348,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Body Spot Alleles', 'big-B', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-big-b-alleles\"));; }); }","display":"big-B","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-b-alleles","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('Body Spot Alleles', 'small-b', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-small-b-alleles\"));; }); }","display":"small-b","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-b-alleles","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"Body Spot Alleles","left":370,"top":130,"right":605,"bottom":250,"xAxis":"time","yAxis":"# alleles","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"big-B","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-big-b-alleles","type":"pen"},{"display":"small-b","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-small-b-alleles","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"display":"XX  --> female XY  --> male","left":241,"top":85,"right":355,"bottom":118,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"display":"BB / Bb / bB  -->  black spots               bb  --> no black spots","left":200,"top":205,"right":382,"bottom":246,"fontSize":10,"color":0,"transparent":true,"type":"textBox","compilation":{"success":true,"messages":[]}}, {"variable":"see-fish?","left":15,"top":100,"right":175,"bottom":133,"display":"see-fish?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"variable":"see-sex-cells?","left":15,"top":170,"right":175,"bottom":203,"display":"see-sex-cells?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('tail fin variations', 'forked tail', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-forked-tails\"));; }); }","display":"forked tail","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-forked-tails","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('tail fin variations', 'no fork', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-forked-tails\"));; }); }","display":"no fork","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-forked-tails","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('tail fin variations', 'yellow tail', function() {     plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-yellow-tail-fins\"));;   }); }","display":"yellow tail","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-yellow-tail-fins","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('tail fin variations', 'no yellow', function() {     plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-no-yellow-tail-fins\"));;   }); }","display":"no yellow","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-yellow-tail-fins","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"tail fin variations","left":911,"top":490,"right":1183,"bottom":610,"xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"forked tail","interval":1,"mode":0,"color":-16777216,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-forked-tails","type":"pen"},{"display":"no fork","interval":1,"mode":0,"color":-4539718,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-forked-tails","type":"pen"},{"display":"yellow tail","interval":1,"mode":0,"color":-4079321,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-yellow-tail-fins","type":"pen"},{"display":"no yellow","interval":1,"mode":0,"color":-13791810,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-no-yellow-tail-fins","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {}","compiledPens":[{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('# of males & females', 'females', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-females\"));; }); }","display":"females","interval":1,"mode":0,"color":-4757638,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-females","type":"pen","compilation":{"success":true,"messages":[]}},{"compiledSetupCode":"function() {}","compiledUpdateCode":"function() {   return ProcedurePrims.runInPlotContext('# of males & females', 'males', function() { plotManager.plotPoint(world.ticker.tickCount(), world.observer.getGlobal(\"#-of-males\"));; }); }","display":"males","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-males","type":"pen","compilation":{"success":true,"messages":[]}}],"display":"# of males & females","left":1186,"top":490,"right":1458,"bottom":610,"xAxis":"time","yAxis":"# of","xmin":0,"xmax":10,"ymin":0,"ymax":10,"autoPlotOn":true,"legendOn":true,"setupCode":"","updateCode":"","pens":[{"display":"females","interval":1,"mode":0,"color":-4757638,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-females","type":"pen"},{"display":"males","interval":1,"mode":0,"color":-11033397,"inLegend":true,"setupCode":"","updateCode":"plotxy ticks #-of-males","type":"pen"}],"type":"plot","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-removed\")","source":"num-fish-removed","left":45,"top":365,"right":145,"bottom":410,"display":"fish removed","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"auto-replace?","left":14,"top":268,"right":174,"bottom":301,"display":"auto-replace?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.list.oneOf(world.turtleManager.turtlesOfBreed(\"FISH\"))), function() { var R = ProcedurePrims.callCommand(\"remove-this-fish\"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; } var R = ProcedurePrims.callCommand(\"find-potential-mates\"); if (R === StopInterrupt) { return R; }","source":"ask one-of fish [ remove-this-fish] find-potential-mates","left":15,"top":230,"right":175,"bottom":264,"display":"Randomly replace a fish","forever":false,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-in-tank\")","source":"num-fish-in-tank","left":45,"top":320,"right":145,"bottom":365,"display":"fish in tank","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"initial-females","left":185,"top":30,"right":365,"bottom":63,"display":"initial-females","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"num-fish-born\")","source":"num-fish-born","left":45,"top":410,"right":145,"bottom":455,"display":"fish born","precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["initial-alleles-big-b", "see-body-cells?", "initial-alleles-big-t", "initial-alleles-big-g", "initial-alleles-big-f", "carrying-capacity", "see-fish?", "see-sex-cells?", "auto-replace?", "initial-females", "#-big-b-alleles", "#-small-b-alleles", "#-big-t-alleles", "#-small-t-alleles", "#-big-f-alleles", "#-small-f-alleles", "#-big-g-alleles", "#-small-g-alleles", "#-y-chromosomes", "#-x-chromosomes", "water-color", "green-dorsal-fin-color", "no-green-dorsal-fin-color", "yellow-tail-fin-color", "no-yellow-tail-fin-color", "male-color", "female-color", "spots-shape", "no-spots-shape", "forked-tail-shape", "no-forked-tail-shape", "#-of-green-dorsal-fins", "#-of-no-green-dorsal-fins", "#-of-yellow-tail-fins", "#-of-no-yellow-tail-fins", "#-of-spots", "#-of-no-spots", "#-of-forked-tails", "#-of-no-forked-tails", "#-of-males", "#-of-females", "mouse-continuous-down?", "num-fish-removed", "num-fish-born", "num-fish-in-tank", "fish-forward-step", "gamete-forward-step", "intra-chromosome-pair-spacing", "inter-chromosome-pair-spacing", "size-of-karyotype-background-for-cells", "initial-#-females", "initial-#-males"], ["initial-alleles-big-b", "see-body-cells?", "initial-alleles-big-t", "initial-alleles-big-g", "initial-alleles-big-f", "carrying-capacity", "see-fish?", "see-sex-cells?", "auto-replace?", "initial-females"], ["type-of-patch", "divider-here?"], 0, 29, 0, 15, 28, false, false, turtleShapes, linkShapes, function(){});
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
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
ProcedurePrims.defineCommand("setup", 2809, 4258, (function() {
  world.clearAll();
  world.observer.setGlobal("mouse-continuous-down?", false);
  world.observer.setGlobal("intra-chromosome-pair-spacing", 0.2);
  world.observer.setGlobal("inter-chromosome-pair-spacing", 0.55);
  world.observer.setGlobal("fish-forward-step", 0.04);
  world.observer.setGlobal("num-fish-removed", 0);
  world.observer.setGlobal("num-fish-born", 0);
  world.observer.setGlobal("num-fish-in-tank", 0);
  world.observer.setGlobal("size-of-karyotype-background-for-cells", 5.2);
  world.observer.setGlobal("initial-#-females", PrimChecks.math.floor(PrimChecks.math.mult(PrimChecks.math.div(PrimChecks.validator.checkArg('/', 1, world.observer.getGlobal("initial-females")), 100), PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("carrying-capacity")))));
  world.observer.setGlobal("initial-#-males", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("carrying-capacity")), PrimChecks.validator.checkArg('-', 1, world.observer.getGlobal("initial-#-females"))));
  world.observer.setGlobal("green-dorsal-fin-color", [90, 255, 90, 255]);
  world.observer.setGlobal("no-green-dorsal-fin-color", [176, 196, 222, 255]);
  world.observer.setGlobal("yellow-tail-fin-color", [255, 255, 0, 255]);
  world.observer.setGlobal("no-yellow-tail-fin-color", [176, 196, 255, 255]);
  world.observer.setGlobal("female-color", [255, 150, 150, 255]);
  world.observer.setGlobal("male-color", [150, 150, 255, 255]);
  world.observer.setGlobal("water-color", PrimChecks.math.minus(105, 1.5));
  world.observer.setGlobal("spots-shape", "fish-spots");
  world.observer.setGlobal("no-spots-shape", "none");
  world.observer.setGlobal("forked-tail-shape", "fish-forked-tail");
  world.observer.setGlobal("no-forked-tail-shape", "fish-no-forked-tail");
  BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("FISH").getSpecialName(), "fish-body")
  BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS").getSpecialName(), "cell-somatic")
  BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("FISH-BONES").getSpecialName(), "fish-bones")
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(1, "MOUSE-CURSORS"), function() {
    SelfManager.self().setVariable("shape", "x");
    SelfManager.self().setVariable("hidden?", true);
    SelfManager.self().setVariable("color", 15);
    PrimChecks.turtle.setVariable("heading", 0);
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.callCommand("set-tank-regions"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("create-initial-gene-pool"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("create-initial-fish"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("visualize-tank"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("visualize-fish-and-alleles"); if (R === DeathInterrupt) { return R; }
  world.ticker.reset();
}))
ProcedurePrims.defineCommand("set-tank-regions", 4267, 5384, (function() {
  let minHpycorHedge = world.topology.minPycor; ProcedurePrims.stack().currentContext().registerStringRunVar("MIN-PYCOR-EDGE", minHpycorHedge);
  let maxHpycorHedge = world.topology.maxPycor; ProcedurePrims.stack().currentContext().registerStringRunVar("MAX-PYCOR-EDGE", maxHpycorHedge);
  let waterHpatches = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("WATER-PATCHES", waterHpatches);
  var R = ProcedurePrims.ask(world.patches(), function() {
    SelfManager.self().setPatchVariable("divider-here?", false);
    SelfManager.self().setPatchVariable("type-of-patch", "water");
    if ((((Prims.equality(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, maxHpycorHedge), 2)) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, minHpycorHedge), 2))) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.procedure.callReporter("left-side-of-water-in-tank"))) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.procedure.callReporter("right-side-of-water-in-tank")))) {
      SelfManager.self().setPatchVariable("type-of-patch", "water-edge");
    }
    if (Prims.gte(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, maxHpycorHedge), 1))) {
      SelfManager.self().setPatchVariable("type-of-patch", "air");
    }
    if (((Prims.lte(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, PrimChecks.procedure.callReporter("left-side-of-water-in-tank")), 1)) || Prims.gte(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, PrimChecks.procedure.callReporter("right-side-of-water-in-tank")), 1))) || Prims.lte(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, minHpycorHedge), 1)))) {
      SelfManager.self().setPatchVariable("type-of-patch", "tank-wall");
    }
    if ((((Prims.equality(SelfManager.self().getPatchVariable("pycor"), maxHpycorHedge) || Prims.equality(SelfManager.self().getPatchVariable("pycor"), minHpycorHedge)) || Prims.equality(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, PrimChecks.procedure.callReporter("left-side-of-water-in-tank")), 2))) || Prims.gte(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, PrimChecks.procedure.callReporter("right-side-of-water-in-tank")), 2)))) {
      SelfManager.self().setPatchVariable("type-of-patch", "air");
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  waterHpatches = PrimChecks.agentset.with(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water"); }); ProcedurePrims.stack().currentContext().updateStringRunVar("WATER-PATCHES", waterHpatches);
}))
ProcedurePrims.defineCommand("create-initial-gene-pool", 5393, 6132, (function() {
  let numHbigHalleles = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("NUM-BIG-ALLELES", numHbigHalleles);
  let initialHnumberHfish = world.observer.getGlobal("carrying-capacity"); ProcedurePrims.stack().currentContext().registerStringRunVar("INITIAL-NUMBER-FISH", initialHnumberHfish);
  numHbigHalleles = PrimChecks.math.round(PrimChecks.math.div(PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("initial-alleles-big-b")), 2), PrimChecks.validator.checkArg('*', 1, initialHnumberHfish)), 100)); ProcedurePrims.stack().currentContext().updateStringRunVar("NUM-BIG-ALLELES", numHbigHalleles);
  var R = ProcedurePrims.callCommand("make-initial-alleles-for-gene", 1, "B", "b", numHbigHalleles); if (R === DeathInterrupt) { return R; }
  numHbigHalleles = PrimChecks.math.round(PrimChecks.math.div(PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("initial-alleles-big-t")), 2), PrimChecks.validator.checkArg('*', 1, initialHnumberHfish)), 100)); ProcedurePrims.stack().currentContext().updateStringRunVar("NUM-BIG-ALLELES", numHbigHalleles);
  var R = ProcedurePrims.callCommand("make-initial-alleles-for-gene", 2, "T", "t", numHbigHalleles); if (R === DeathInterrupt) { return R; }
  numHbigHalleles = PrimChecks.math.round(PrimChecks.math.div(PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("initial-alleles-big-f")), 2), PrimChecks.validator.checkArg('*', 1, initialHnumberHfish)), 100)); ProcedurePrims.stack().currentContext().updateStringRunVar("NUM-BIG-ALLELES", numHbigHalleles);
  var R = ProcedurePrims.callCommand("make-initial-alleles-for-gene", 3, "F", "f", numHbigHalleles); if (R === DeathInterrupt) { return R; }
  numHbigHalleles = PrimChecks.math.round(PrimChecks.math.div(PrimChecks.math.mult(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("initial-alleles-big-g")), 2), PrimChecks.validator.checkArg('*', 1, initialHnumberHfish)), 100)); ProcedurePrims.stack().currentContext().updateStringRunVar("NUM-BIG-ALLELES", numHbigHalleles);
  var R = ProcedurePrims.callCommand("make-initial-alleles-for-gene", 4, "G", "g", numHbigHalleles); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("make-initial-alleles-for-gene", 5, "Y", "X", world.observer.getGlobal("initial-#-males")); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("create-initial-fish", 6141, 6636, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(world.observer.getGlobal("initial-#-males"), "SOMATIC-CELLS"), function() { PrimChecks.turtle.setVariable("sex", "male"); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(world.observer.getGlobal("initial-#-females"), "SOMATIC-CELLS"), function() { PrimChecks.turtle.setVariable("sex", "female"); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() {
    var R = ProcedurePrims.callCommand("setup-new-somatic-cell-attributes"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.callCommand("distribute-gene-pool-to-somatic-cells"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() {
    var R = ProcedurePrims.callCommand("grow-fish-parts-from-somatic-cell"); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.callCommand("distribute-fish-in-tank"); if (R === DeathInterrupt) { return R; }
}))
ProcedurePrims.defineCommand("setup-new-somatic-cell-attributes", 6645, 6971, (function() {
  PrimChecks.turtle.setVariable("heading", 0);
  SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"));
  SelfManager.self().setVariable("color", [100, 100, 100, 100]);
  PrimChecks.turtle.setVariable("size", world.observer.getGlobal("size-of-karyotype-background-for-cells"));
  SelfManager.self().setVariable("hidden?", true);
}))
ProcedurePrims.defineCommand("distribute-fish-in-tank", 6980, 7143, (function() {
  let waterHpatches = PrimChecks.agentset.with(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("WATER-PATCHES", waterHpatches);
  let waterHpatch = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("WATER-PATCH", waterHpatch);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH"), function() {
    SelfManager.self().moveTo(PrimChecks.list.oneOf(PrimChecks.validator.checkArg('ONE-OF', 120, waterHpatches)));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("make-initial-alleles-for-gene", 7152, 8023, (function(geneHnumber, alleleH1, alleleH2, numHbigHalleles) {
  let initialHnumberHfish = PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("initial-#-males")), PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("initial-#-females"))); ProcedurePrims.stack().currentContext().registerStringRunVar("INITIAL-NUMBER-FISH", initialHnumberHfish);
  var R = ProcedurePrims.ask(world.turtleManager.createTurtles(PrimChecks.math.mult(2, PrimChecks.validator.checkArg('*', 1, initialHnumberHfish)), "ALLELES"), function() {
    PrimChecks.turtle.setVariable("gene", geneHnumber);
    SelfManager.self().setVariable("shape", (workspace.dump('') + workspace.dump("gene-") + workspace.dump(geneHnumber)));
    PrimChecks.turtle.setVariable("heading", 0);
    PrimChecks.turtle.setVariable("owned-by-fish?", false);
    PrimChecks.turtle.setVariable("value", alleleH2);
    SelfManager.self().setVariable("color", [0, 0, 0, 255]);
    SelfManager.self().setVariable("label-color", SelfManager.self().getVariable("color"));
    SelfManager.self().setVariable("label", (workspace.dump('') + workspace.dump(PrimChecks.turtle.getVariable("value")) + workspace.dump("     ")));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.list.nOf(PrimChecks.validator.checkArg('N-OF', 1, numHbigHalleles), PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("gene"), geneHnumber); }))), function() {
    PrimChecks.turtle.setVariable("value", alleleH1);
    SelfManager.self().setVariable("color", [220, 220, 220, 255]);
    SelfManager.self().setVariable("label", (workspace.dump('') + workspace.dump(PrimChecks.turtle.getVariable("value")) + workspace.dump("     ")));
    SelfManager.self().setVariable("label-color", SelfManager.self().getVariable("color"));
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("distribute-gene-pool-to-somatic-cells", 8033, 9515, (function() {
  let thisHsomaticHcell = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-SOMATIC-CELL", thisHsomaticHcell);
  let lastHsexHallele = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("LAST-SEX-ALLELE", lastHsexHallele);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() {
    thisHsomaticHcell = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-SOMATIC-CELL", thisHsomaticHcell);
    var R = Tasks.forEach(Tasks.commandTask(function(n) {
      PrimChecks.procedure.runArgCountCheck(1, arguments.length);
      var R = ProcedurePrims.callCommand("position-and-link-alleles", SelfManager.self(), n, "left"); if (R === DeathInterrupt) { return R; }
      var R = ProcedurePrims.callCommand("position-and-link-alleles", SelfManager.self(), n, "right"); if (R === DeathInterrupt) { return R; }
    }, "[ n -> position-and-link-alleles self n \"left\" position-and-link-alleles self n \"right\" ]"), [1, 2, 3, 4]); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
      return ((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, PrimChecks.turtle.getVariable("owned-by-fish?"))) && Prims.equality(PrimChecks.turtle.getVariable("gene"), 5)) && Prims.equality(PrimChecks.turtle.getVariable("value"), "X"));
    })), function() {
      PrimChecks.turtle.setVariable("owned-by-fish?", true);
      PrimChecks.turtle.setVariable("size", 1.2);
      PrimChecks.turtle.setVariable("xcor", PrimChecks.math.plus(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("inter-chromosome-pair-spacing")), 4), 0.1));
      PrimChecks.turtle.setVariable("ycor", -0.4);
      PrimChecks.turtle.setVariable("side", "left");
      var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHsomaticHcell, "LINKS"), function() {
        SelfManager.self().setVariable("hidden?", true);
        PrimChecks.link.setVariable("tie-mode", "fixed");
        SelfManager.self().tie();
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    if (Prims.equality(PrimChecks.turtle.getVariable("sex"), "male")) {
      lastHsexHallele = "Y"; ProcedurePrims.stack().currentContext().updateStringRunVar("LAST-SEX-ALLELE", lastHsexHallele);
    }
    else {
      lastHsexHallele = "X"; ProcedurePrims.stack().currentContext().updateStringRunVar("LAST-SEX-ALLELE", lastHsexHallele);
    }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
      return ((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, PrimChecks.turtle.getVariable("owned-by-fish?"))) && Prims.equality(PrimChecks.turtle.getVariable("gene"), 5)) && Prims.equality(PrimChecks.turtle.getVariable("value"), lastHsexHallele));
    })), function() {
      PrimChecks.turtle.setVariable("owned-by-fish?", true);
      PrimChecks.turtle.setVariable("size", 1.2);
      PrimChecks.turtle.setVariable("xcor", PrimChecks.math.plus(PrimChecks.math.plus(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("inter-chromosome-pair-spacing")), 4), PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("intra-chromosome-pair-spacing"))), 0.1));
      PrimChecks.turtle.setVariable("ycor", -0.4);
      PrimChecks.turtle.setVariable("side", "right");
      var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHsomaticHcell, "LINKS"), function() {
        SelfManager.self().setVariable("hidden?", true);
        PrimChecks.link.setVariable("tie-mode", "fixed");
        SelfManager.self().tie();
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("position-and-link-alleles", 9524, 10352, (function(thisHsomaticHcell, geneHnumber, whichHside) {
  let pairHshiftHright = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("PAIR-SHIFT-RIGHT", pairHshiftHright);
  let sideHshift = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("SIDE-SHIFT", sideHshift);
  if (Prims.equality(whichHside, "right")) {
    sideHshift = world.observer.getGlobal("intra-chromosome-pair-spacing"); ProcedurePrims.stack().currentContext().updateStringRunVar("SIDE-SHIFT", sideHshift);
  }
  else {
    sideHshift = 0; ProcedurePrims.stack().currentContext().updateStringRunVar("SIDE-SHIFT", sideHshift);
  }
  pairHshiftHright = PrimChecks.math.minus(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("inter-chromosome-pair-spacing")), PrimChecks.validator.checkArg('*', 1, geneHnumber)), 0.45); ProcedurePrims.stack().currentContext().updateStringRunVar("PAIR-SHIFT-RIGHT", pairHshiftHright);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
    return (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, PrimChecks.turtle.getVariable("owned-by-fish?"))) && Prims.equality(PrimChecks.turtle.getVariable("gene"), geneHnumber));
  })), function() {
    PrimChecks.turtle.setVariable("owned-by-fish?", true);
    PrimChecks.turtle.setVariable("side", whichHside);
    PrimChecks.turtle.setVariable("size", 1.2);
    PrimChecks.turtle.setVariable("xcor", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, thisHsomaticHcell), function() { return PrimChecks.turtle.getVariable("xcor"); })), PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, pairHshiftHright), PrimChecks.validator.checkArg('+', 1, sideHshift))));
    PrimChecks.turtle.setVariable("ycor", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, thisHsomaticHcell), function() { return PrimChecks.turtle.getVariable("ycor"); })), 0.4));
    var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHsomaticHcell, "LINKS"), function() {
      SelfManager.self().setVariable("hidden?", true);
      PrimChecks.link.setVariable("tie-mode", "fixed");
      SelfManager.self().tie();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("go", 10612, 10961, (function() {
  var R = ProcedurePrims.callCommand("wander"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("update-statistics"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("detect-fish-outside-the-water"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("detect-and-move-fish-at-inside-tank-boundary"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("auto-selection"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("clean-up-fish-bones"); if (R === DeathInterrupt) { return R; }
  if (world.observer.getGlobal("auto-replace?")) {
    var R = ProcedurePrims.callCommand("find-potential-mates"); if (R === DeathInterrupt) { return R; }
  }
  var R = ProcedurePrims.callCommand("move-gametes-together"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("convert-zygote-into-somatic-cell"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("detect-mouse-selection-event"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("visualize-fish-and-alleles"); if (R === DeathInterrupt) { return R; }
  var R = ProcedurePrims.callCommand("visualize-tank"); if (R === DeathInterrupt) { return R; }
  world.ticker.tick();
}))
ProcedurePrims.defineCommand("auto-selection", 10970, 11368, (function() {
  if (world.observer.getGlobal("auto-replace?")) {
    if (Prims.isThrottleTimeElapsed("autoHselection_0", workspace.selfManager.self(), 0.25)) {
      Prims.resetThrottleTimerFor("autoHselection_0", workspace.selfManager.self());
      if (PrimChecks.agentset.any(world.turtleManager.turtlesOfBreed("FISH"))) {
        var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.list.oneOf(world.turtleManager.turtlesOfBreed("FISH"))), function() {
          if (PrimChecks.procedure.callReporter("both-sexes-in-this-fishs-tank-region?")) {
            var R = ProcedurePrims.callCommand("remove-this-fish"); if (R === DeathInterrupt) { return R; }
          }
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
      }
    }
  }
}))
ProcedurePrims.defineCommand("move-gametes-together", 11378, 12055, (function() {
  let myHzygote = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("MY-ZYGOTE", myHzygote);
  let distanceHtoHzygote = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("DISTANCE-TO-ZYGOTE", distanceHtoHzygote);
  if (world.observer.getGlobal("see-sex-cells?")) {
    world.observer.setGlobal("gamete-forward-step", 0.08);
  }
  else {
    world.observer.setGlobal("gamete-forward-step", 1);
  }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("GAMETE-CELLS"), function() {
    myHzygote = PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }); ProcedurePrims.stack().currentContext().updateStringRunVar("MY-ZYGOTE", myHzygote);
    distanceHtoHzygote = SelfManager.self().distance(myHzygote); ProcedurePrims.stack().currentContext().updateStringRunVar("DISTANCE-TO-ZYGOTE", distanceHtoHzygote);
    if (Prims.gt(distanceHtoHzygote, 0)) {
      SelfManager.self().face(PrimChecks.validator.checkArg('FACE', 768, myHzygote));
      if (Prims.gt(distanceHtoHzygote, world.observer.getGlobal("gamete-forward-step"))) {
        SelfManager.self().fd(world.observer.getGlobal("gamete-forward-step"));
      }
      else {
        SelfManager.self().fd(distanceHtoHzygote);
      }
      PrimChecks.turtle.setVariable("heading", 0);
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("convert-zygote-into-somatic-cell", 12064, 13746, (function() {
  let femaleHsexHcellHalleles = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("FEMALE-SEX-CELL-ALLELES", femaleHsexHcellHalleles);
  let maleHsexHcellHalleles = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("MALE-SEX-CELL-ALLELES", maleHsexHcellHalleles);
  let maleHgamete = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("MALE-GAMETE", maleHgamete);
  let femaleHgamete = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("FEMALE-GAMETE", femaleHgamete);
  let thisHsomaticHcell = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-SOMATIC-CELL", thisHsomaticHcell);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"), function() {
    maleHgamete = PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("GAMETE-CELLS"), function() {
      return (LinkPrims.isOutLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(PrimChecks.turtle.getVariable("sex"), "male"));
    }); ProcedurePrims.stack().currentContext().updateStringRunVar("MALE-GAMETE", maleHgamete);
    femaleHgamete = PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("GAMETE-CELLS"), function() {
      return (LinkPrims.isOutLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(PrimChecks.turtle.getVariable("sex"), "female"));
    }); ProcedurePrims.stack().currentContext().updateStringRunVar("FEMALE-GAMETE", femaleHgamete);
    if ((PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, maleHgamete)) && PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, femaleHgamete)))) {
      if ((Prims.lte(SelfManager.self().distance(PrimChecks.list.oneOf(PrimChecks.validator.checkArg('ONE-OF', 120, maleHgamete))), 0.01) && Prims.lte(SelfManager.self().distance(PrimChecks.list.oneOf(PrimChecks.validator.checkArg('ONE-OF', 120, femaleHgamete))), 0.01))) {
        var R = ProcedurePrims.callCommand("setup-new-somatic-cell-attributes"); if (R === DeathInterrupt) { return R; }
        thisHsomaticHcell = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-SOMATIC-CELL", thisHsomaticHcell);
        var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, maleHgamete), function() {
          maleHsexHcellHalleles = PrimChecks.procedure.callReporter("alleles-that-belong-to-this-gamete"); ProcedurePrims.stack().currentContext().updateStringRunVar("MALE-SEX-CELL-ALLELES", maleHsexHcellHalleles);
          return SelfManager.self().die();
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
        var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, femaleHgamete), function() {
          femaleHsexHcellHalleles = PrimChecks.procedure.callReporter("alleles-that-belong-to-this-gamete"); ProcedurePrims.stack().currentContext().updateStringRunVar("FEMALE-SEX-CELL-ALLELES", femaleHsexHcellHalleles);
          return SelfManager.self().die();
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
        var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, maleHsexHcellHalleles), function() {
          var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHsomaticHcell, "LINKS"), function() {
            SelfManager.self().setVariable("hidden?", true);
            PrimChecks.link.setVariable("tie-mode", "fixed");
            SelfManager.self().tie();
          }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
        var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, femaleHsexHcellHalleles), function() {
          var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHsomaticHcell, "LINKS"), function() {
            SelfManager.self().setVariable("hidden?", true);
            PrimChecks.link.setVariable("tie-mode", "fixed");
            SelfManager.self().tie();
          }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
        var R = ProcedurePrims.callCommand("align-alleles-for-this-somatic-cell", thisHsomaticHcell); if (R === DeathInterrupt) { return R; }
        PrimChecks.turtle.setVariable("sex", PrimChecks.procedure.callReporter("sex-phenotype"));
        var R = ProcedurePrims.callCommand("grow-fish-parts-from-somatic-cell"); if (R === DeathInterrupt) { return R; }
        world.observer.setGlobal("num-fish-born", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("num-fish-born")), 1));
      }
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("align-alleles-for-this-somatic-cell", 13755, 14568, (function(thisHzygote) {
  let allHalleles = PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", thisHzygote); }); ProcedurePrims.stack().currentContext().registerStringRunVar("ALL-ALLELES", allHalleles);
  var R = Tasks.forEach(Tasks.commandTask(function(thisHgene) {
    PrimChecks.procedure.runArgCountCheck(1, arguments.length);
    if (Prims.gt(PrimChecks.agentset.countWith(allHalleles, function() {
      return (Prims.equality(PrimChecks.turtle.getVariable("gene"), thisHgene) && Prims.equality(PrimChecks.turtle.getVariable("side"), "left"));
    }), 1)) {
      var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.agentset.oneOfWith(allHalleles, function() { return Prims.equality(PrimChecks.turtle.getVariable("gene"), thisHgene); })), function() {
        PrimChecks.turtle.setVariable("heading", 90);
        SelfManager.self().fd(world.observer.getGlobal("intra-chromosome-pair-spacing"));
        PrimChecks.turtle.setVariable("side", "right");
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }
    if (Prims.gt(PrimChecks.agentset.countWith(allHalleles, function() {
      return (Prims.equality(PrimChecks.turtle.getVariable("gene"), thisHgene) && Prims.equality(PrimChecks.turtle.getVariable("side"), "right"));
    }), 1)) {
      var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.agentset.oneOfWith(allHalleles, function() { return Prims.equality(PrimChecks.turtle.getVariable("gene"), thisHgene); })), function() {
        PrimChecks.turtle.setVariable("heading", 90);
        SelfManager.self().fd(-(world.observer.getGlobal("intra-chromosome-pair-spacing")));
        PrimChecks.turtle.setVariable("side", "left");
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }
  }, "[ this-gene -> if count all-alleles with [ gene = this-gene and side = \"left\" ] > 1 [ ask one-of all-alleles with [ gene = this-gene ] [ set heading 90 forward intra-chromosome-pair-spacing set side \"right\" ] ] if count all-alleles with [ gene = this-gene and side = \"right\" ] > 1 [ ask one-of all-alleles with [ gene = this-gene ] [ set heading 90 back intra-chromosome-pair-spacing set side \"left\" ] ] ]"), [1, 2, 3, 4, 5]); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("find-potential-mates", 14577, 15719, (function() {
  let mom = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("MOM", mom);
  let dad = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("DAD", dad);
  let xcorHdad = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("XCOR-DAD", xcorHdad);
  let turtlesHinHthisHregion = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("TURTLES-IN-THIS-REGION", turtlesHinHthisHregion);
  let potentialHmates = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("POTENTIAL-MATES", potentialHmates);
  let allHfishHandHfishHzygotes = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("ALL-FISH-AND-FISH-ZYGOTES", allHfishHandHfishHzygotes);
  if (PrimChecks.agentset.anyWith(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() { return Prims.equality(PrimChecks.turtle.getVariable("sex"), "male"); })) {
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.agentset.oneOfWith(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() { return Prims.equality(PrimChecks.turtle.getVariable("sex"), "male"); })), function() {
      dad = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("DAD", dad);
      xcorHdad = PrimChecks.turtle.getVariable("xcor"); ProcedurePrims.stack().currentContext().updateStringRunVar("XCOR-DAD", xcorHdad);
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, dad), function() {
      turtlesHinHthisHregion = PrimChecks.procedure.callReporter("other-turtles-in-this-turtles-tank-region"); ProcedurePrims.stack().currentContext().updateStringRunVar("TURTLES-IN-THIS-REGION", turtlesHinHthisHregion);
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    allHfishHandHfishHzygotes = PrimChecks.agentset.with(PrimChecks.validator.checkArg('WITH', 112, turtlesHinHthisHregion), function() {
      return (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH")) || Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH-ZYGOTES")));
    }); ProcedurePrims.stack().currentContext().updateStringRunVar("ALL-FISH-AND-FISH-ZYGOTES", allHfishHandHfishHzygotes);
    potentialHmates = PrimChecks.agentset.with(PrimChecks.validator.checkArg('WITH', 112, turtlesHinHthisHregion), function() {
      return (Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("SOMATIC-CELLS")) && Prims.equality(PrimChecks.turtle.getVariable("sex"), "female"));
    }); ProcedurePrims.stack().currentContext().updateStringRunVar("POTENTIAL-MATES", potentialHmates);
    if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, potentialHmates))) {
      var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.list.oneOf(PrimChecks.validator.checkArg('ONE-OF', 120, potentialHmates))), function() { mom = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("MOM", mom); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
      let thisHcarryingHcapacity = PrimChecks.procedure.callReporter("carrying-capacity-in-this-region", xcorHdad); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-CARRYING-CAPACITY", thisHcarryingHcapacity);
      if (Prims.lt(PrimChecks.agentset.count(PrimChecks.validator.checkArg('COUNT', 112, allHfishHandHfishHzygotes)), thisHcarryingHcapacity)) {
        var R = ProcedurePrims.callCommand("reproduce-offspring-from-these-two-parents", mom, dad); if (R === DeathInterrupt) { return R; }
      }
    }
  }
}))
ProcedurePrims.defineCommand("reproduce-offspring-from-these-two-parents", 15728, 16118, (function(mom, dad) {
  let child = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("CHILD", child);
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, mom), function() {
    var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
      PrimChecks.turtle.setVariable("heading", 0);
      SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"));
      PrimChecks.turtle.setVariable("size", 1);
      SelfManager.self().setVariable("shape", "heart");
      SelfManager.self().setVariable("color", 15);
      child = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("CHILD", child);
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, mom), function() {
    var R = ProcedurePrims.callCommand("link-alleles-to-gametes-and-gametes-to-zygote", child); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, dad), function() {
    var R = ProcedurePrims.callCommand("link-alleles-to-gametes-and-gametes-to-zygote", child); if (R === DeathInterrupt) { return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("link-alleles-to-gametes-and-gametes-to-zygote", 16127, 16760, (function(child) {
  let thisHnewHgameteHcell = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-NEW-GAMETE-CELL", thisHnewHgameteHcell);
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("GAMETE-CELLS"));
    PrimChecks.turtle.setVariable("heading", 0);
    var R = ProcedurePrims.ask(LinkPrims.createLinkTo(child, "LINKS"), function() { SelfManager.self().setVariable("hidden?", false); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    if (Prims.equality(PrimChecks.turtle.getVariable("sex"), "male")) {
      SelfManager.self().setVariable("shape", "cell-gamete-male");
    }
    else {
      SelfManager.self().setVariable("shape", "cell-gamete-female");
    }
    thisHnewHgameteHcell = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-NEW-GAMETE-CELL", thisHnewHgameteHcell);
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = Tasks.forEach(Tasks.commandTask(function(thisHgene) {
    PrimChecks.procedure.runArgCountCheck(1, arguments.length);
    var R = ProcedurePrims.ask(PrimChecks.validator.checkArg('ASK', 1904, PrimChecks.list.nOf(1, PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
      return (LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()) && Prims.equality(PrimChecks.turtle.getVariable("gene"), thisHgene));
    }))), function() {
      var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
        PrimChecks.turtle.setVariable("owned-by-fish?", false);
        var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHnewHgameteHcell, "LINKS"), function() {
          SelfManager.self().setVariable("hidden?", true);
          PrimChecks.link.setVariable("tie-mode", "fixed");
          SelfManager.self().tie();
        }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }, "[ this-gene -> ask n-of 1 alleles with [ in-link-neighbor? myself and gene = this-gene ] [ hatch 1 [ set owned-by-fish? false create-link-from this-new-gamete-cell [ set hidden? true set tie-mode \"fixed\" tie ] ] ] ]"), [1, 2, 3, 4, 5]); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("wander", 16769, 16964, (function() {
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH"), function() {
    PrimChecks.turtle.setVariable("heading", PrimChecks.turtle.getVariable("bearing"));
    SelfManager.self().right(PrimChecks.math.randomFloat(70));
    SelfManager.self().right(-(PrimChecks.math.randomFloat(70)));
    PrimChecks.turtle.setVariable("bearing", PrimChecks.turtle.getVariable("heading"));
    SelfManager.self().fd(world.observer.getGlobal("fish-forward-step"));
    PrimChecks.turtle.setVariable("heading", 0);
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() { PrimChecks.turtle.setVariable("heading", 0); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("detect-fish-outside-the-water", 16974, 17107, (function() {
  var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("FISH"), function() {
    return (!Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") && !Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"));
  }), function() { var R = ProcedurePrims.callCommand("remove-this-fish"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("detect-and-move-fish-at-inside-tank-boundary", 17116, 17629, (function() {
  let nearestHwaterHpatch = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("NEAREST-WATER-PATCH", nearestHwaterHpatch);
  let waterHpatches = PrimChecks.agentset.with(world.patches(), function() {
    return (Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, SelfManager.self().getPatchVariable("divider-here?"))));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("WATER-PATCHES", waterHpatches);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH"), function() {
    nearestHwaterHpatch = PrimChecks.agentset.minOneOf(PrimChecks.validator.checkArg('MIN-ONE-OF', 112, waterHpatches), function() { return SelfManager.self().distance(SelfManager.myself()); }); ProcedurePrims.stack().currentContext().updateStringRunVar("NEAREST-WATER-PATCH", nearestHwaterHpatch);
    if ((Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "tank-wall") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"))) {
      PrimChecks.turtle.setVariable("heading", PrimChecks.turtle.towards(PrimChecks.validator.checkArg('TOWARDS', 768, nearestHwaterHpatch)));
      SelfManager.self().fd(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("fish-forward-step")), 2));
      PrimChecks.turtle.setVariable("heading", 0);
      PrimChecks.turtle.setVariable("bearing", PrimChecks.math.randomFloat(360));
    }
    if (SelfManager.self().getPatchVariable("divider-here?")) {
      SelfManager.self().moveTo(nearestHwaterHpatch);
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("clean-up-fish-bones", 17638, 18005, (function() {
  let boneHtransparency = 0; ProcedurePrims.stack().currentContext().registerStringRunVar("BONE-TRANSPARENCY", boneHtransparency);
  let colorHlist = []; ProcedurePrims.stack().currentContext().registerStringRunVar("COLOR-LIST", colorHlist);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH-BONES"), function() {
    PrimChecks.turtle.setVariable("countdown", PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, PrimChecks.turtle.getVariable("countdown")), 1));
    boneHtransparency = PrimChecks.math.div(PrimChecks.math.mult(PrimChecks.validator.checkArg('*', 1, PrimChecks.turtle.getVariable("countdown")), 255), 50); ProcedurePrims.stack().currentContext().updateStringRunVar("BONE-TRANSPARENCY", boneHtransparency);
    colorHlist = PrimChecks.list.lput(boneHtransparency, [255, 255, 255]); ProcedurePrims.stack().currentContext().updateStringRunVar("COLOR-LIST", colorHlist);
    SelfManager.self().setVariable("color", colorHlist);
    if (Prims.lte(PrimChecks.turtle.getVariable("countdown"), 0)) {
      return SelfManager.self().die();
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("remove-this-fish", 18014, 18389, (function() {
  world.observer.setGlobal("num-fish-removed", PrimChecks.math.plus(PrimChecks.validator.checkArg('+', 1, world.observer.getGlobal("num-fish-removed")), 1));
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-BONES"));
    SelfManager.self().setVariable("color", 9.9);
    PrimChecks.turtle.setVariable("countdown", 25);
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(LinkPrims.outLinkNeighbors("LINKS"), function() {
    var R = ProcedurePrims.ask(LinkPrims.outLinkNeighbors("LINKS"), function() { return SelfManager.self().die(); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    return SelfManager.self().die();
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  return SelfManager.self().die();
}))
ProcedurePrims.defineCommand("detect-mouse-selection-event", 18398, 20126, (function() {
  let pHmouseHxcor = MousePrims.getX(); ProcedurePrims.stack().currentContext().registerStringRunVar("P-MOUSE-XCOR", pHmouseHxcor);
  let pHmouseHycor = MousePrims.getY(); ProcedurePrims.stack().currentContext().registerStringRunVar("P-MOUSE-YCOR", pHmouseHycor);
  let pHtypeHofHpatch = PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, world.getPatchAt(PrimChecks.validator.checkArg('PATCH', 1, pHmouseHxcor), PrimChecks.validator.checkArg('PATCH', 1, pHmouseHycor))), function() { return SelfManager.self().getPatchVariable("type-of-patch"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("P-TYPE-OF-PATCH", pHtypeHofHpatch);
  let mouseHwasHjustHdown_Q = MousePrims.isDown(); ProcedurePrims.stack().currentContext().registerStringRunVar("MOUSE-WAS-JUST-DOWN?", mouseHwasHjustHdown_Q);
  var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("MOUSE-CURSORS"), function() {
    PrimChecks.turtle.setXY(PrimChecks.validator.checkArg('SETXY', 1, pHmouseHxcor), PrimChecks.validator.checkArg('SETXY', 1, pHmouseHycor));
    if (Prims.equality(pHtypeHofHpatch, "water")) {
      SelfManager.self().setVariable("hidden?", false);
      SelfManager.self().setVariable("shape", "x");
      SelfManager.self().setVariable("label-color", 9.9);
      SelfManager.self().setVariable("label", "remove fish");
    }
    if ((PrimChecks.validator.checkArg('AND', 2, SelfManager.self().getPatchVariable("divider-here?")) && Prims.equality(pHtypeHofHpatch, "tank-wall"))) {
      SelfManager.self().setVariable("hidden?", false);
      SelfManager.self().setVariable("shape", "subtract divider");
      SelfManager.self().setVariable("label-color", 9.9);
      SelfManager.self().setVariable("label", "remove divider");
    }
    if ((PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, SelfManager.self().getPatchVariable("divider-here?"))) && Prims.equality(pHtypeHofHpatch, "tank-wall"))) {
      SelfManager.self().setVariable("hidden?", false);
      SelfManager.self().setVariable("shape", "add divider");
      SelfManager.self().setVariable("label-color", 9.9);
      SelfManager.self().setVariable("label", "add divider");
    }
    if ((!Prims.equality(pHtypeHofHpatch, "water") && !Prims.equality(pHtypeHofHpatch, "tank-wall"))) {
      SelfManager.self().setVariable("hidden?", true);
      SelfManager.self().setVariable("shape", "x");
      SelfManager.self().setVariable("label", "");
    }
    if (mouseHwasHjustHdown_Q) {
      var R = ProcedurePrims.ask(SelfManager.self().breedHere("FISH"), function() { var R = ProcedurePrims.callCommand("remove-this-fish"); if (R === DeathInterrupt) { return R; } }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }
    if ((((((PrimChecks.validator.checkArg('AND', 2, mouseHwasHjustHdown_Q) && PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, world.observer.getGlobal("mouse-continuous-down?")))) && Prims.equality(pHtypeHofHpatch, "tank-wall")) && Prims.equality(SelfManager.self().getPatchVariable("pycor"), PrimChecks.math.plus(world.topology.minPycor, 1))) && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.plus(world.topology.minPxcor, 1))) && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), PrimChecks.math.minus(world.topology.maxPxcor, 1)))) {
      SelfManager.self().setPatchVariable("divider-here?", PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, SelfManager.self().getPatchVariable("divider-here?"))));
      let dividerHxcor = SelfManager.self().getPatchVariable("pxcor"); ProcedurePrims.stack().currentContext().registerStringRunVar("DIVIDER-XCOR", dividerHxcor);
      var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.patches(), function() {
        return ((Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge")) && Prims.equality(SelfManager.self().getPatchVariable("pxcor"), dividerHxcor));
      }), function() {
        SelfManager.self().setPatchVariable("divider-here?", PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, SelfManager.self().getPatchVariable("divider-here?"))));
      }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }
    if (PrimChecks.math.not(MousePrims.isInside())) {
      SelfManager.self().setVariable("hidden?", true);
    }
    else {
      SelfManager.self().setVariable("hidden?", false);
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  if (mouseHwasHjustHdown_Q) {
    world.observer.setGlobal("mouse-continuous-down?", true);
  }
  else {
    world.observer.setGlobal("mouse-continuous-down?", false);
  }
}))
ProcedurePrims.defineCommand("update-statistics", 20384, 21848, (function() {
  world.observer.setGlobal("num-fish-in-tank", PrimChecks.agentset.count(world.turtleManager.turtlesOfBreed("FISH")));
  world.observer.setGlobal("#-big-b-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "B"); }));
  world.observer.setGlobal("#-small-b-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "b"); }));
  world.observer.setGlobal("#-big-t-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "T"); }));
  world.observer.setGlobal("#-small-t-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "t"); }));
  world.observer.setGlobal("#-big-f-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "F"); }));
  world.observer.setGlobal("#-small-f-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "f"); }));
  world.observer.setGlobal("#-big-g-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "G"); }));
  world.observer.setGlobal("#-small-g-alleles", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "g"); }));
  world.observer.setGlobal("#-y-chromosomes", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "Y"); }));
  world.observer.setGlobal("#-x-chromosomes", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return Prims.equality(PrimChecks.turtle.getVariable("value"), "X"); }));
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
  world.observer.setGlobal("#-of-males", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH"), function() { return Prims.equality(PrimChecks.turtle.getVariable("sex"), "male"); }));
  world.observer.setGlobal("#-of-females", PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("FISH"), function() { return Prims.equality(PrimChecks.turtle.getVariable("sex"), "female"); }));
}))
ProcedurePrims.defineCommand("visualize-tank", 22108, 22536, (function() {
  var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.patches(), function() {
    return (Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water") || Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "water-edge"));
  }), function() {
    if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, SelfManager.self().getPatchVariable("divider-here?")))) {
      SelfManager.self().setPatchVariable("pcolor", world.observer.getGlobal("water-color"));
    }
    else {
      SelfManager.self().setPatchVariable("pcolor", PrimChecks.math.minus(5, 3.5));
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "tank-wall"); }), function() {
    if (PrimChecks.math.not(PrimChecks.validator.checkArg('NOT', 2, SelfManager.self().getPatchVariable("divider-here?")))) {
      SelfManager.self().setPatchVariable("pcolor", PrimChecks.math.minus(5, 3));
    }
    else {
      SelfManager.self().setPatchVariable("pcolor", PrimChecks.math.minus(5, 4));
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.patches(), function() { return Prims.equality(SelfManager.self().getPatchVariable("type-of-patch"), "air"); }), function() { SelfManager.self().setPatchVariable("pcolor", PrimChecks.math.plus(5, 3)); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineCommand("visualize-fish-and-alleles", 22545, 23533, (function() {
  if (world.observer.getGlobal("see-body-cells?")) {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() {
      SelfManager.self().setVariable("hidden?", false);
      var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }), function() { SelfManager.self().setVariable("hidden?", false); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }
  else {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("SOMATIC-CELLS"), function() {
      SelfManager.self().setVariable("hidden?", true);
      var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }), function() { SelfManager.self().setVariable("hidden?", true); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }
  if (world.observer.getGlobal("see-sex-cells?")) {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("GAMETE-CELLS"), function() {
      SelfManager.self().setVariable("hidden?", false);
      var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }), function() { SelfManager.self().setVariable("hidden?", false); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"), function() { SelfManager.self().setVariable("hidden?", false); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }
  else {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("GAMETE-CELLS"), function() {
      SelfManager.self().setVariable("hidden?", true);
      var R = ProcedurePrims.ask(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }), function() { SelfManager.self().setVariable("hidden?", true); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH-ZYGOTES"), function() { SelfManager.self().setVariable("hidden?", true); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }
  if (world.observer.getGlobal("see-fish?")) {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH"), function() { SelfManager.self().setVariable("hidden?", false); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() { SelfManager.self().setVariable("hidden?", false); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }
  else {
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH"), function() { SelfManager.self().setVariable("hidden?", true); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
    var R = ProcedurePrims.ask(world.turtleManager.turtlesOfBreed("FISH-PARTS"), function() { SelfManager.self().setVariable("hidden?", true); }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }
}))
ProcedurePrims.defineCommand("grow-fish-parts-from-somatic-cell", 23542, 25159, (function() {
  let thisHfishHbody = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-FISH-BODY", thisHfishHbody);
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH"));
    PrimChecks.turtle.setVariable("bearing", PrimChecks.math.randomFloat(360));
    PrimChecks.turtle.setVariable("heading", 0);
    PrimChecks.turtle.setVariable("size", 1);
    thisHfishHbody = SelfManager.self(); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-FISH-BODY", thisHfishHbody);
    if (Prims.equality(PrimChecks.turtle.getVariable("sex"), "male")) {
      SelfManager.self().setVariable("color", world.observer.getGlobal("male-color"));
    }
    if (Prims.equality(PrimChecks.turtle.getVariable("sex"), "female")) {
      SelfManager.self().setVariable("color", world.observer.getGlobal("female-color"));
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHfishHbody, "LINKS"), function() {
    SelfManager.self().setVariable("hidden?", true);
    PrimChecks.link.setVariable("tie-mode", "fixed");
    SelfManager.self().tie();
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-PARTS"));
    SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-PARTS"));
    PrimChecks.turtle.setVariable("size", 1);
    SelfManager.self().setVariable("shape", PrimChecks.procedure.callReporter("tail-shape-phenotype"));
    SelfManager.self().setVariable("color", PrimChecks.procedure.callReporter("tail-color-phenotype"));
    PrimChecks.turtle.setVariable("heading", -90);
    SelfManager.self()._optimalFdLessThan1(0.4);
    var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHfishHbody, "LINKS"), function() {
      SelfManager.self().setVariable("hidden?", true);
      PrimChecks.link.setVariable("tie-mode", "fixed");
      SelfManager.self().tie();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-PARTS"));
    PrimChecks.turtle.setVariable("size", 1);
    SelfManager.self().setVariable("shape", "fish-fins");
    SelfManager.self().setVariable("color", PrimChecks.procedure.callReporter("dorsal-fin-color-phenotype"));
    var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHfishHbody, "LINKS"), function() {
      SelfManager.self().setVariable("hidden?", true);
      PrimChecks.link.setVariable("tie-mode", "fixed");
      SelfManager.self().tie();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  var R = ProcedurePrims.ask(SelfManager.self().hatch(1, ""), function() {
    SelfManager.self().setVariable("breed", world.turtleManager.turtlesOfBreed("FISH-PARTS"));
    PrimChecks.turtle.setVariable("size", 1);
    SelfManager.self().setVariable("shape", PrimChecks.procedure.callReporter("rear-spots-phenotype"));
    SelfManager.self().setVariable("color", [0, 0, 0, 255]);
    var R = ProcedurePrims.ask(LinkPrims.createLinkFrom(thisHfishHbody, "LINKS"), function() {
      SelfManager.self().setVariable("hidden?", true);
      PrimChecks.link.setVariable("tie-mode", "fixed");
      SelfManager.self().tie();
    }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
}))
ProcedurePrims.defineReporter("has-at-least-one-dominant-set-of-instructions-for", 25424, 25794, (function(dominantHallele) {
  let thisHsomaticHcell = SelfManager.self(); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-SOMATIC-CELL", thisHsomaticHcell);
  let _POU_HofHdominantHalleles = PrimChecks.agentset.countWith(world.turtleManager.turtlesOfBreed("ALLELES"), function() {
    return (LinkPrims.isInLinkNeighbor("LINKS", thisHsomaticHcell) && Prims.equality(PrimChecks.turtle.getVariable("value"), dominantHallele));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("#-OF-DOMINANT-ALLELES", _POU_HofHdominantHalleles);
  if (Prims.gt(_POU_HofHdominantHalleles, 0)) {
    return PrimChecks.procedure.report(true);
  }
  else {
    return PrimChecks.procedure.report(false);
  }
}))
ProcedurePrims.defineReporter("tail-shape-phenotype", 25810, 26254, (function() {
  let thisHshape = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-SHAPE", thisHshape);
  let thisHfish = SelfManager.myself(); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-FISH", thisHfish);
  var R = ProcedurePrims.ask(SelfManager.myself(), function() {
    if (PrimChecks.procedure.callReporter("has-at-least-one-dominant-set-of-instructions-for", "F")) {
      thisHshape = world.observer.getGlobal("forked-tail-shape"); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-SHAPE", thisHshape);
    }
    else {
      thisHshape = world.observer.getGlobal("no-forked-tail-shape"); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-SHAPE", thisHshape);
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  return PrimChecks.procedure.report(thisHshape);
}))
ProcedurePrims.defineReporter("rear-spots-phenotype", 26270, 26656, (function() {
  let thisHspotsHshape = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-SPOTS-SHAPE", thisHspotsHshape);
  var R = ProcedurePrims.ask(SelfManager.myself(), function() {
    if (PrimChecks.procedure.callReporter("has-at-least-one-dominant-set-of-instructions-for", "B")) {
      thisHspotsHshape = world.observer.getGlobal("spots-shape"); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-SPOTS-SHAPE", thisHspotsHshape);
    }
    else {
      thisHspotsHshape = world.observer.getGlobal("no-spots-shape"); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-SPOTS-SHAPE", thisHspotsHshape);
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  return PrimChecks.procedure.report(thisHspotsHshape);
}))
ProcedurePrims.defineReporter("dorsal-fin-color-phenotype", 26672, 27098, (function() {
  let thisHcolor = []; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-COLOR", thisHcolor);
  var R = ProcedurePrims.ask(SelfManager.myself(), function() {
    if (PrimChecks.procedure.callReporter("has-at-least-one-dominant-set-of-instructions-for", "G")) {
      thisHcolor = world.observer.getGlobal("green-dorsal-fin-color"); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-COLOR", thisHcolor);
    }
    else {
      thisHcolor = world.observer.getGlobal("no-green-dorsal-fin-color"); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-COLOR", thisHcolor);
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  return PrimChecks.procedure.report(thisHcolor);
}))
ProcedurePrims.defineReporter("tail-color-phenotype", 27114, 27569, (function() {
  let thisHcolor = []; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-COLOR", thisHcolor);
  let thisHfish = SelfManager.myself(); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-FISH", thisHfish);
  var R = ProcedurePrims.ask(SelfManager.myself(), function() {
    if (PrimChecks.procedure.callReporter("has-at-least-one-dominant-set-of-instructions-for", "T")) {
      thisHcolor = world.observer.getGlobal("yellow-tail-fin-color"); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-COLOR", thisHcolor);
    }
    else {
      thisHcolor = world.observer.getGlobal("no-yellow-tail-fin-color"); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-COLOR", thisHcolor);
    }
  }, true); if (R !== undefined) { PrimChecks.procedure.preReturnCheck(R); return R; }
  return PrimChecks.procedure.report(thisHcolor);
}))
ProcedurePrims.defineReporter("sex-phenotype", 27585, 27777, (function() {
  let thisHsex = ""; ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-SEX", thisHsex);
  let thisHcell = SelfManager.self(); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-CELL", thisHcell);
  if (PrimChecks.procedure.callReporter("has-at-least-one-dominant-set-of-instructions-for", "Y")) {
    thisHsex = "male"; ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-SEX", thisHsex);
  }
  else {
    thisHsex = "female"; ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-SEX", thisHsex);
  }
  return PrimChecks.procedure.report(thisHsex);
}))
ProcedurePrims.defineReporter("alleles-that-belong-to-this-gamete", 28043, 28127, (function() {
  return PrimChecks.procedure.report(PrimChecks.agentset.with(world.turtleManager.turtlesOfBreed("ALLELES"), function() { return LinkPrims.isInLinkNeighbor("LINKS", SelfManager.myself()); }));
}))
ProcedurePrims.defineReporter("left-side-of-water-in-tank", 28143, 28195, (function() { return PrimChecks.procedure.report(PrimChecks.math.plus(world.topology.minPxcor, 2)); }))
ProcedurePrims.defineReporter("right-side-of-water-in-tank", 28211, 28265, (function() { return PrimChecks.procedure.report(PrimChecks.math.minus(world.topology.maxPxcor, 2)); }))
ProcedurePrims.defineReporter("other-turtles-in-this-turtles-tank-region", 28282, 29112, (function() {
  let turtlesHinHthisHregion = Nobody; ProcedurePrims.stack().currentContext().registerStringRunVar("TURTLES-IN-THIS-REGION", turtlesHinHthisHregion);
  let xcorHofHthisHturtle = PrimChecks.turtle.getVariable("xcor"); ProcedurePrims.stack().currentContext().registerStringRunVar("XCOR-OF-THIS-TURTLE", xcorHofHthisHturtle);
  let thisHregionHleftHside = PrimChecks.procedure.callReporter("left-side-of-water-in-tank"); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-REGION-LEFT-SIDE", thisHregionHleftHside);
  let thisHregionHrightHside = PrimChecks.procedure.callReporter("right-side-of-water-in-tank"); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-REGION-RIGHT-SIDE", thisHregionHrightHside);
  let dividersHtoHtheHright = PrimChecks.agentset.with(world.patches(), function() {
    return (PrimChecks.validator.checkArg('AND', 2, SelfManager.self().getPatchVariable("divider-here?")) && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), xcorHofHthisHturtle));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("DIVIDERS-TO-THE-RIGHT", dividersHtoHtheHright);
  let dividersHtoHtheHleft = PrimChecks.agentset.with(world.patches(), function() {
    return (PrimChecks.validator.checkArg('AND', 2, SelfManager.self().getPatchVariable("divider-here?")) && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), xcorHofHthisHturtle));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("DIVIDERS-TO-THE-LEFT", dividersHtoHtheHleft);
  if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, dividersHtoHtheHright))) {
    thisHregionHrightHside = PrimChecks.list.min(PrimChecks.validator.checkArg('MIN', 8, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, dividersHtoHtheHright), function() { return SelfManager.self().getPatchVariable("pxcor"); }))); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-REGION-RIGHT-SIDE", thisHregionHrightHside);
  }
  if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, dividersHtoHtheHleft))) {
    thisHregionHleftHside = PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, dividersHtoHtheHleft), function() { return SelfManager.self().getPatchVariable("pxcor"); }))); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-REGION-LEFT-SIDE", thisHregionHleftHside);
  }
  turtlesHinHthisHregion = PrimChecks.agentset.with(world.turtles(), function() {
    return (Prims.gte(PrimChecks.turtle.getVariable("xcor"), thisHregionHleftHside) && Prims.lte(PrimChecks.turtle.getVariable("xcor"), thisHregionHrightHside));
  }); ProcedurePrims.stack().currentContext().updateStringRunVar("TURTLES-IN-THIS-REGION", turtlesHinHthisHregion);
  return PrimChecks.procedure.report(turtlesHinHthisHregion);
}))
ProcedurePrims.defineReporter("both-sexes-in-this-fishs-tank-region?", 29128, 29507, (function() {
  let fishHinHthisHregion = PrimChecks.agentset.with(PrimChecks.validator.checkArg('WITH', 112, PrimChecks.procedure.callReporter("other-turtles-in-this-turtles-tank-region")), function() {
    return Prims.equality(SelfManager.self().getVariable("breed"), world.turtleManager.turtlesOfBreed("FISH"));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("FISH-IN-THIS-REGION", fishHinHthisHregion);
  let maleHfishHinHthisHregion = PrimChecks.agentset.with(PrimChecks.validator.checkArg('WITH', 112, fishHinHthisHregion), function() { return Prims.equality(PrimChecks.turtle.getVariable("sex"), "male"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("MALE-FISH-IN-THIS-REGION", maleHfishHinHthisHregion);
  let femaleHfishHinHthisHregion = PrimChecks.agentset.with(PrimChecks.validator.checkArg('WITH', 112, fishHinHthisHregion), function() { return Prims.equality(PrimChecks.turtle.getVariable("sex"), "female"); }); ProcedurePrims.stack().currentContext().registerStringRunVar("FEMALE-FISH-IN-THIS-REGION", femaleHfishHinHthisHregion);
  if ((PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, maleHfishHinHthisHregion)) && PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, femaleHfishHinHthisHregion)))) {
    return PrimChecks.procedure.report(true);
  }
  else {
    return PrimChecks.procedure.report(false);
  }
}))
ProcedurePrims.defineReporter("carrying-capacity-in-this-region", 29524, 30187, (function(thisHxcor) {
  let thisHregionHleftHside = PrimChecks.procedure.callReporter("left-side-of-water-in-tank"); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-REGION-LEFT-SIDE", thisHregionHleftHside);
  let thisHregionHrightHside = PrimChecks.procedure.callReporter("right-side-of-water-in-tank"); ProcedurePrims.stack().currentContext().registerStringRunVar("THIS-REGION-RIGHT-SIDE", thisHregionHrightHside);
  let dividersHtoHtheHright = PrimChecks.agentset.with(world.patches(), function() {
    return (PrimChecks.validator.checkArg('AND', 2, SelfManager.self().getPatchVariable("divider-here?")) && Prims.gt(SelfManager.self().getPatchVariable("pxcor"), thisHxcor));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("DIVIDERS-TO-THE-RIGHT", dividersHtoHtheHright);
  let dividersHtoHtheHleft = PrimChecks.agentset.with(world.patches(), function() {
    return (PrimChecks.validator.checkArg('AND', 2, SelfManager.self().getPatchVariable("divider-here?")) && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), thisHxcor));
  }); ProcedurePrims.stack().currentContext().registerStringRunVar("DIVIDERS-TO-THE-LEFT", dividersHtoHtheHleft);
  if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, dividersHtoHtheHright))) {
    thisHregionHrightHside = PrimChecks.list.min(PrimChecks.validator.checkArg('MIN', 8, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, dividersHtoHtheHright), function() { return SelfManager.self().getPatchVariable("pxcor"); }))); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-REGION-RIGHT-SIDE", thisHregionHrightHside);
  }
  if (PrimChecks.agentset.any(PrimChecks.validator.checkArg('ANY?', 112, dividersHtoHtheHleft))) {
    thisHregionHleftHside = PrimChecks.list.max(PrimChecks.validator.checkArg('MAX', 8, PrimChecks.agentset.of(PrimChecks.validator.checkArg('OF', 1904, dividersHtoHtheHleft), function() { return SelfManager.self().getPatchVariable("pxcor"); }))); ProcedurePrims.stack().currentContext().updateStringRunVar("THIS-REGION-LEFT-SIDE", thisHregionHleftHside);
  }
  let tankHcapacityHofHthisHregion = PrimChecks.math.div(PrimChecks.math.mult(PrimChecks.math.minus(PrimChecks.validator.checkArg('-', 1, thisHregionHrightHside), PrimChecks.validator.checkArg('-', 1, thisHregionHleftHside)), PrimChecks.validator.checkArg('*', 1, world.observer.getGlobal("carrying-capacity"))), 25); ProcedurePrims.stack().currentContext().registerStringRunVar("TANK-CAPACITY-OF-THIS-REGION", tankHcapacityHofHthisHregion);
  return PrimChecks.procedure.report(tankHcapacityHofHthisHregion);
}))
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