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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"bee":{"name":"bee","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[152,77,67,67,74,85,100,116,134,151,167,182,206,220,226,226,222],"ycors":[149,163,195,211,234,252,264,276,286,300,285,278,260,242,218,195,166],"type":"polygon","color":"rgba(237, 237, 49, 1.0)","filled":true,"marked":false},{"xcors":[150,128,114,98,80,80,81,95,117,141,151,177,195,207,211,211,204,189,171],"ycors":[149,151,151,145,122,103,83,67,58,54,53,55,66,82,94,116,139,149,152],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[151,119,96,81,78,87,103,115,121,150,180,189,197,210,222,222,212,192],"ycors":[54,59,60,50,39,25,18,23,13,1,14,23,17,19,30,44,57,58],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[70,74,223,224],"ycors":[185,171,172,186],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[67,71,224,225,67],"ycors":[211,226,226,211,211],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[91,106,195,211],"ycors":[257,269,269,255],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":144,"y1":100,"x2":70,"y2":87,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":70,"y1":87,"x2":45,"y2":87,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":86,"x2":26,"y2":97,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":26,"y1":96,"x2":22,"y2":115,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":22,"y1":115,"x2":25,"y2":130,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":26,"y1":131,"x2":37,"y2":141,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":37,"y1":141,"x2":55,"y2":144,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":55,"y1":143,"x2":143,"y2":101,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":141,"y1":100,"x2":227,"y2":138,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":227,"y1":138,"x2":241,"y2":137,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":241,"y1":137,"x2":249,"y2":129,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":249,"y1":129,"x2":254,"y2":110,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":253,"y1":108,"x2":248,"y2":97,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":249,"y1":95,"x2":235,"y2":82,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":235,"y1":82,"x2":144,"y2":100,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"sheep":{"name":"sheep","editableColorIndex":15,"rotate":false,"elements":[{"x":203,"y":65,"diam":88,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":70,"y":65,"diam":162,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":150,"y":105,"diam":120,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[218,240,255,278],"ycors":[120,165,165,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false},{"x":214,"y":72,"diam":67,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false},{"xmin":164,"ymin":223,"xmax":179,"ymax":298,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[45,30,30,15,45],"ycors":[285,285,240,195,210],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x":3,"y":83,"diam":150,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xmin":65,"ymin":221,"xmax":80,"ymax":296,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[195,210,210,240,195],"ycors":[285,285,240,210,210],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[276,285,302,294],"ycors":[85,105,99,83],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false},{"xcors":[219,210,193,201],"ycors":[85,105,99,83],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"wolf":{"name":"wolf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[253,245,245],"ycors":[133,131,133],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[2,13,30,38,38,20,20,27,38,40,31,31,60,68,75,66,65,82,84,100,103,77,79,100,98,119,143,160,166,172,173,167,160,154,169,178,186,198,200,217,219,207,195,192,210,227,242,259,284,277,293,299,297,273,270],"ycors":[194,197,191,193,205,226,257,265,266,260,253,230,206,198,209,228,243,261,268,267,261,239,231,207,196,201,202,195,210,213,238,251,248,265,264,247,240,260,271,271,262,258,230,198,184,164,144,145,151,141,140,134,127,119,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[-1,14,36,40,53,82,134,159,188,227,236,238,268,269,281,269,269],"ycors":[195,180,166,153,140,131,133,126,115,108,102,98,86,92,87,103,113],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
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
  var name    = 'piping-scouts';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('default', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('piping-scouts', 'default')(function() {
        try {
          plotManager.plotValue(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() { return SelfManager.self().getVariable("piping?"); }).size());
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
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'on-site';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'watching v.s. working';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('watching bees', plotOps.makePenOps, false, new PenBundle.State(136.7, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('watching v.s. working', 'watching bees')(function() {
        try {
          plotManager.plotValue(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("task-string"), "watching-dance"); }).size());
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
  new PenBundle.Pen('working bees', plotOps.makePenOps, false, new PenBundle.State(56.8, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {
    workspace.rng.withAux(function() {
      plotManager.withTemporaryContext('watching v.s. working', 'working bees')(function() {
        try {
          plotManager.plotValue((world.turtleManager.turtlesOfBreed("SCOUTS").size() - world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("task-string"), "watching-dance"); }).size()));
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
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'committed';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "", "", false, true, 0.0, 10.0, 0.0, 10.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "SITES", singular: "site", varNames: ["quality", "discovered?", "scouts-on-site"] }, { name: "SCOUTS", singular: "scout", varNames: ["my-home", "next-task", "task-string", "bee-timer", "target", "interest", "trips", "initial-scout?", "no-discovery?", "on-site?", "piping?", "dist-to-hive", "circle-switch", "temp-x-dance", "temp-y-dance"] }])([], [])(["hive-number", "initial-percentage", "initial-explore-time", "quorum", "color-list", "quality-list", "show-dance-path?", "scouts-visible?", "watch-dance-task", "discover-task", "inspect-hive-task", "go-home-task", "dance-task", "re-visit-task", "pipe-task", "take-off-task"], ["hive-number", "initial-percentage", "initial-explore-time", "quorum"], [], -32, 32, -24, 24, 11.0, false, false, turtleShapes, linkShapes, function(){});
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
      procedures["SETUP-HIVES"]();
      procedures["SETUP-TASKS"]();
      procedures["SETUP-BEES"]();
      world.observer.setGlobal("show-dance-path?", true);
      world.observer.setGlobal("scouts-visible?", true);
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
      world.observer.setGlobal("color-list", [97.9, 94.5, 57.5, 63.8, 17.6, 14.9, 27.5, 25.1, 117.9, 114.4]);
      world.observer.setGlobal("quality-list", [100, 75, 50, 1, 54, 48, 40, 32, 24, 16]);
      ListPrims.nOf(world.observer.getGlobal("hive-number"), world.patches().agentFilter(function() {
        return ((Prims.gt(SelfManager.self().distanceXY(0, 0), 16) && Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pxcor")), (world.topology.maxPxcor - 2))) && Prims.lt(NLMath.abs(SelfManager.self().getPatchVariable("pycor")), (world.topology.maxPycor - 2)));
      })).ask(function() {
        SelfManager.self().sprout(1, "SITES").ask(function() {
          SelfManager.self().setVariable("shape", "box");
          SelfManager.self().setVariable("size", 2);
          SelfManager.self().setVariable("color", 5);
          SelfManager.self().setVariable("discovered?", false);
        }, true);
      }, true);
      let i = 0;
      for (let _index_3202_3208 = 0, _repeatcount_3202_3208 = StrictMath.floor(world.turtleManager.turtlesOfBreed("SITES").size()); _index_3202_3208 < _repeatcount_3202_3208; _index_3202_3208++){
        world.turtleManager.getTurtleOfBreed("SITES", i).ask(function() {
          SelfManager.self().setVariable("quality", ListPrims.item(i, world.observer.getGlobal("quality-list")));
          SelfManager.self().setVariable("label", SelfManager.self().getVariable("quality"));
        }, true);
        plotManager.setCurrentPlot("on-site");
        plotManager.createTemporaryPen((Dump('') + Dump("site") + Dump(i)));
        plotManager.setPenColor(ListPrims.item(i, world.observer.getGlobal("color-list")));
        plotManager.setCurrentPlot("committed");
        plotManager.createTemporaryPen((Dump('') + Dump("target") + Dump(i)));
        plotManager.setPenColor(ListPrims.item(i, world.observer.getGlobal("color-list")));
        i = (i + 1);
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
  procs["setupHives"] = temp;
  procs["SETUP-HIVES"] = temp;
  temp = (function() {
    try {
      world.turtleManager.createTurtles(100, "SCOUTS").ask(function() {
        SelfManager.self().fd(Prims.randomFloat(4));
        SelfManager.self().setVariable("my-home", SelfManager.self().getPatchHere());
        SelfManager.self().setVariable("shape", "bee");
        SelfManager.self().setVariable("color", 5);
        SelfManager.self().setVariable("initial-scout?", false);
        SelfManager.self().setVariable("target", Nobody);
        SelfManager.self().setVariable("circle-switch", 1);
        SelfManager.self().setVariable("no-discovery?", false);
        SelfManager.self().setVariable("on-site?", false);
        SelfManager.self().setVariable("piping?", false);
        SelfManager.self().setVariable("next-task", world.observer.getGlobal("watch-dance-task"));
        SelfManager.self().setVariable("task-string", "watching-dance");
      }, true);
      ListPrims.nOf(world.observer.getGlobal("initial-percentage"), world.turtleManager.turtlesOfBreed("SCOUTS")).ask(function() {
        SelfManager.self().setVariable("initial-scout?", true);
        SelfManager.self().setVariable("bee-timer", Prims.random(100));
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
  procs["setupBees"] = temp;
  procs["SETUP-BEES"] = temp;
  temp = (function() {
    try {
      procedures["WATCH-DANCE"]();
      procedures["DISCOVER"]();
      procedures["INSPECT-HIVE"]();
      procedures["GO-HOME"]();
      procedures["DANCE"]();
      procedures["RE-VISIT"]();
      procedures["PIPE"]();
      procedures["TAKE-OFF"]();
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
  procs["setupTasks"] = temp;
  procs["SETUP-TASKS"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("watch-dance-task", Tasks.commandTask(function() {
        if (arguments.length < 0) {
          throw new Error("anonymous procedure expected 0 inputs, but only got " + arguments.length);
        }
        if (Prims.gt(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() { return SelfManager.self().getVariable("piping?"); }), 3).size(), 0)) {
          SelfManager.self().setVariable("target", ListPrims.oneOf(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() { return SelfManager.self().getVariable("piping?"); })).projectionBy(function() { return SelfManager.self().getVariable("target"); }));
          SelfManager.self().setVariable("color", SelfManager.self().getVariable("target").projectionBy(function() { return SelfManager.self().getVariable("color"); }));
          SelfManager.self().setVariable("next-task", world.observer.getGlobal("pipe-task"));
          SelfManager.self().setVariable("task-string", "piping");
          SelfManager.self().setVariable("bee-timer", 20);
          SelfManager.self().setVariable("piping?", true);
        }
        procedures["MOVE-AROUND"]();
        if ((SelfManager.self().getVariable("initial-scout?") && Prims.lt(SelfManager.self().getVariable("bee-timer"), 0))) {
          SelfManager.self().setVariable("next-task", world.observer.getGlobal("discover-task"));
          SelfManager.self().setVariable("task-string", "discovering");
          SelfManager.self().setVariable("bee-timer", world.observer.getGlobal("initial-explore-time"));
          SelfManager.self().setVariable("initial-scout?", false);
        }
        if (!SelfManager.self().getVariable("initial-scout?")) {
          if (Prims.lt(SelfManager.self().getVariable("bee-timer"), 0)) {
            if (Prims.gt(SelfPrims._optimalCountOther(SelfManager.self().inCone(world.turtleManager.turtlesOfBreed("SCOUTS"), 3, 60)), 0)) {
              let observed = ListPrims.oneOf(SelfManager.self().inCone(world.turtleManager.turtlesOfBreed("SCOUTS"), 3, 60));
              if (Prims.equality(observed.projectionBy(function() { return SelfManager.self().getVariable("next-task"); }), world.observer.getGlobal("dance-task"))) {
                if (Prims.lt(Prims.random((Prims.div(1, observed.projectionBy(function() { return SelfManager.self().getVariable("interest"); })) * 1000)), 1)) {
                  SelfManager.self().setVariable("target", observed.projectionBy(function() { return SelfManager.self().getVariable("target"); }));
                  SelfManager.self().setVariable("color", 9.9);
                  SelfManager.self().setVariable("next-task", world.observer.getGlobal("re-visit-task"));
                  SelfManager.self().setVariable("task-string", "revisiting");
                }
              }
            }
          }
        }
        SelfManager.self().setVariable("bee-timer", (SelfManager.self().getVariable("bee-timer") - 1));
      }, "[ ->\n    if count scouts with [piping?] in-radius 3 > 0 [\n      ; if detecting any piping scouts in the swarm, pipe too\n      set target [target] of one-of scouts with [piping?]\n      set color [color] of target\n      set next-task pipe-task\n      set task-string \"piping\"\n      set bee-timer 20\n      set piping? true\n    ]\n    move-around\n    if initial-scout? and bee-timer < 0 [\n      ; a initial scout, after the waiting period,\n      ; takes off to discover new hives.\n      ; it has limited time to do the initial exploration,\n      ; as specified by initial-explore-time.\n      set next-task discover-task\n      set task-string \"discovering\"\n      set bee-timer initial-explore-time\n      set initial-scout? false\n    ]\n    if not initial-scout? [\n      ; if a bee is not a initial scout (either born not to be\n      ; or lost its initial scout status due to the failure of\n      ; discovery in its initial exploration), it watches other\n      ; bees in its cone of vision\n      if bee-timer < 0 [\n        ; idle bees have bee-timer less than 0, usually as the\n        ; result of reducing bee-timer from executing other tasks,\n        ; such as dance\n        if count other scouts in-cone 3 60 > 0 [\n          let observed one-of scouts in-cone 3 60\n          if [ next-task ] of observed = dance-task [\n            ; randomly pick one dancing bee in its cone of vision\n            ; random x < 1 means a chance of 1 / x. in this case,\n            ; x = ((1 / [interest] of observed) * 1000), which is\n            ; a function to correlate interest, i.e. the enthusiasm\n            ; of a dance, with its probability of being followed:\n            ; the higher the interest, the smaller 1 / interest,\n            ; hence the smaller x, and larger 1 / x, which means\n            ; a higher probability of being seen.\n            if random ((1 / [interest] of observed) * 1000) < 1 [\n              ; follow the dance\n              set target [target] of observed\n              ; use white to a bee's state of having in mind\n              ; a target  without having visited it yet\n              set color white\n              set next-task re-visit-task\n              ; re-visit could be an initial scout's subsequent\n              ; visits of a hive after it discovered the hive,\n              ; or it could be a non-initial scout's first visit\n              ; and subsequent visits to a hive (because non-scouts\n              ; don't make initial visit, which is defined as the\n              ; discovering visit).\n              set task-string \"revisiting\"\n            ]\n          ]\n        ]\n      ]\n    ]\n    ; reduce bees' waiting time by 1 tick\n    set bee-timer bee-timer - 1\n  ]"));
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
  procs["watchDance"] = temp;
  procs["WATCH-DANCE"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("discover-task", Tasks.commandTask(function() {
        if (arguments.length < 0) {
          throw new Error("anonymous procedure expected 0 inputs, but only got " + arguments.length);
        }
        if (Prims.lt(SelfManager.self().getVariable("bee-timer"), 0)) {
          SelfManager.self().setVariable("next-task", world.observer.getGlobal("go-home-task"));
          SelfManager.self().setVariable("task-string", "going-home");
          SelfManager.self().setVariable("no-discovery?", true);
        }
        else {
          if (Prims.gt(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SITES"), 3).size(), 0)) {
            let tempTarget = ListPrims.oneOf(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SITES"), 3));
            if (!tempTarget.projectionBy(function() { return SelfManager.self().getVariable("discovered?"); })) {
              SelfManager.self().setVariable("target", tempTarget);
              SelfManager.self().getVariable("target").ask(function() {
                SelfManager.self().setVariable("discovered?", true);
                SelfManager.self().setVariable("color", ListPrims.item(SelfManager.self().getVariable("who"), world.observer.getGlobal("color-list")));
              }, true);
              SelfManager.self().setVariable("interest", SelfManager.self().getVariable("target").projectionBy(function() { return SelfManager.self().getVariable("quality"); }));
              SelfManager.self().setVariable("color", SelfManager.self().getVariable("target").projectionBy(function() { return SelfManager.self().getVariable("color"); }));
              SelfManager.self().setVariable("next-task", world.observer.getGlobal("inspect-hive-task"));
              SelfManager.self().setVariable("task-string", "inspecting-hive");
              SelfManager.self().setVariable("bee-timer", 100);
            }
            else {
              SelfManager.self().right((Prims.random(60) - Prims.random(60)));
              procedures["PROCEED"]();
              SelfManager.self().setVariable("bee-timer", (SelfManager.self().getVariable("bee-timer") - 1));
            }
          }
          else {
            SelfManager.self().right((Prims.random(60) - Prims.random(60)));
            procedures["PROCEED"]();
          }
          SelfManager.self().setVariable("bee-timer", (SelfManager.self().getVariable("bee-timer") - 1));
        }
      }, "[ ->\n    ifelse bee-timer < 0 [\n      ; if run out of time (a bee has limited time to make initial\n      ; discovery), go home, and admit no discovery was made\n      set next-task go-home-task\n      set task-string \"going-home\"\n      set no-discovery? true\n    ] [\n      ; if a bee finds sites around it (within a distance of 3) on its way\n      ifelse count sites in-radius 3 > 0 [\n        ; then randomly choose one to focus on\n        let temp-target one-of sites in-radius 3\n        ; if this one hive was not discovered by other bees previously\n        ifelse not [discovered?] of temp-target [\n          ; commit to this hive\n          set target temp-target\n          ask target [\n            ; make the target as discovered\n            set discovered? true\n            set color item who color-list\n          ]\n          ; collect info about the target\n          set interest [ quality ] of target\n          ; the bee changes its color to show its commitment to this hive\n          set color [ color ] of target\n          set next-task inspect-hive-task\n          set task-string \"inspecting-hive\"\n          ; will inspect the target for 100 ticks\n          set bee-timer 100\n        ] [\n          ; if no hive site is around, keep going forward\n          ; with a random heading between [-60, 60] degrees\n          rt (random 60 - random 60) proceed\n          set bee-timer bee-timer - 1\n        ]\n      ] [\n        rt (random 60 - random 60) proceed\n      ]\n      set bee-timer bee-timer - 1\n    ]\n  ]"));
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
  procs["discover"] = temp;
  procs["DISCOVER"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("inspect-hive-task", Tasks.commandTask(function() {
        if (arguments.length < 0) {
          throw new Error("anonymous procedure expected 0 inputs, but only got " + arguments.length);
        }
        if (Prims.lt(SelfManager.self().getVariable("bee-timer"), 0)) {
          SelfManager.self().setVariable("next-task", world.observer.getGlobal("go-home-task"));
          SelfManager.self().setVariable("task-string", "going-home");
          SelfManager.self().setVariable("on-site?", false);
          SelfManager.self().setVariable("trips", (SelfManager.self().getVariable("trips") + 1));
        }
        else {
          if (Prims.gt(SelfManager.self().distance(SelfManager.self().getVariable("target")), 2)) {
            SelfManager.self().face(SelfManager.self().getVariable("target"));
            SelfManager.self()._optimalFdOne();
          }
          SelfManager.self().setVariable("on-site?", true);
          let nearbyScouts = SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() {
            return (SelfManager.self().getVariable("on-site?") && Prims.equality(SelfManager.self().getVariable("target"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("target"); })));
          }), 3);
          if (Prims.gt(nearbyScouts.size(), world.observer.getGlobal("quorum"))) {
            SelfManager.self().setVariable("next-task", world.observer.getGlobal("go-home-task"));
            SelfManager.self().setVariable("task-string", "going-home");
            SelfManager.self().setVariable("on-site?", false);
            SelfManager.self().setVariable("piping?", true);
          }
          if (Prims.equality(Prims.random(3), 0)) {
            SelfManager.self().hideTurtle(true);;
          }
          else {
            SelfManager.self().hideTurtle(false);;
          }
          SelfManager.self().setVariable("dist-to-hive", SelfManager.self().distanceXY(0, 0));
          SelfManager.self().setVariable("bee-timer", (SelfManager.self().getVariable("bee-timer") - 1));
        }
      }, "[ ->\n    ; after spending certain time (as specified in bee-timer, see the\n    ; last comment of this task) on inspecting hives, they fly home.\n    ifelse bee-timer < 0 [\n      set next-task go-home-task\n      set task-string \"going-home\"\n      set on-site? false\n      set trips trips + 1\n    ] [\n      ; while on inspect-hive task,\n      if distance target > 2 [\n        face target fd 1 ; a bee flies to its target hive\n      ]\n      set on-site? true\n      ; if it counts more bees than what the quorum specifies, it starts to pipe.\n      let nearby-scouts scouts with [ on-site? and target = [ target ] of myself ] in-radius 3\n      if count nearby-scouts > quorum [\n        set next-task go-home-task\n        set task-string \"going-home\"\n        set on-site? false\n        set piping? true\n      ]\n      ; this line makes the visual effect of a bee showing up and disappearing,\n      ; representing the bee checks both outside and inside of the hive\n      ifelse random 3 = 0 [ hide-turtle ] [ show-turtle ]\n      ; a bee knows how far this hive is from its swarm\n      set dist-to-hive distancexy 0 0\n      ; the bee-timer keeps track of how long the bee has been inspecting\n      ; the hive. It lapses as the model ticks. it is set in either the\n      ; discover task (100 ticks) or the re-visit task (50 ticks).\n      set bee-timer bee-timer - 1\n    ]\n  ]"));
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
  procs["inspectHive"] = temp;
  procs["INSPECT-HIVE"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("go-home-task", Tasks.commandTask(function() {
        if (arguments.length < 0) {
          throw new Error("anonymous procedure expected 0 inputs, but only got " + arguments.length);
        }
        if (Prims.lt(SelfManager.self().distance(SelfManager.self().getVariable("my-home")), 1)) {
          if (SelfManager.self().getVariable("no-discovery?")) {
            SelfManager.self().setVariable("next-task", world.observer.getGlobal("watch-dance-task"));
            SelfManager.self().setVariable("task-string", "watching-dance");
            SelfManager.self().setVariable("no-discovery?", false);
            SelfManager.self().setVariable("initial-scout?", false);
          }
          else {
            if (SelfManager.self().getVariable("piping?")) {
              SelfManager.self().setVariable("next-task", world.observer.getGlobal("pipe-task"));
              SelfManager.self().setVariable("task-string", "piping");
              SelfManager.self().setVariable("bee-timer", 20);
            }
            else {
              SelfManager.self().setVariable("next-task", world.observer.getGlobal("dance-task"));
              SelfManager.self().setVariable("task-string", "dancing");
              SelfManager.self().setVariable("bee-timer", 0);
            }
          }
        }
        else {
          SelfManager.self().face(SelfManager.self().getVariable("my-home"));
          procedures["PROCEED"]();
        }
      }, "[ ->\n    ifelse distance my-home < 1 [ ; if back at home\n      ifelse no-discovery? [\n        ; if the bee is an initial scout that failed to discover a hive site\n        set next-task watch-dance-task\n        set task-string \"watching-dance\"\n        set no-discovery? false\n        ; it loses its initial scout status and becomes a\n        ; non-scout, who watches other bees' dances\n        set initial-scout? false\n      ] [\n        ifelse piping? [\n          ; if the bee saw enough bees on the target site,\n          ; it prepares to pipe for 20 ticks\n          set next-task pipe-task\n          set task-string \"piping\"\n          set bee-timer 20\n        ] [\n          ; if it didn't see enough bees on the target site,\n          ; it prepares to dance to advocate it. it resets\n          ; the bee-timer to 0 for the dance task\n          set next-task dance-task\n          set task-string \"dancing\"\n          set bee-timer 0\n        ]\n      ]\n    ] [\n      face my-home proceed\n    ]\n  ]"));
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
  procs["goHome"] = temp;
  procs["GO-HOME"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("dance-task", Tasks.commandTask(function() {
        if (arguments.length < 0) {
          throw new Error("anonymous procedure expected 0 inputs, but only got " + arguments.length);
        }
        if (Prims.gt(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() { return SelfManager.self().getVariable("piping?"); }), 3).size(), 0)) {
          SelfManager.self().penManager.raisePen();
          SelfManager.self().setVariable("next-task", world.observer.getGlobal("pipe-task"));
          SelfManager.self().setVariable("task-string", "piping");
          SelfManager.self().setVariable("bee-timer", 20);
          SelfManager.self().setVariable("target", ListPrims.oneOf(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() { return SelfManager.self().getVariable("piping?"); })).projectionBy(function() { return SelfManager.self().getVariable("target"); }));
          SelfManager.self().setVariable("color", SelfManager.self().getVariable("target").projectionBy(function() { return SelfManager.self().getVariable("color"); }));
          SelfManager.self().setVariable("piping?", true);
        }
        else {
          if ((Prims.gt(SelfManager.self().getVariable("bee-timer"), (SelfManager.self().getVariable("interest") - ((SelfManager.self().getVariable("trips") - 1) * (15 + Prims.random(5))))) && Prims.gt(SelfManager.self().getVariable("interest"), 0))) {
            SelfManager.self().setVariable("next-task", world.observer.getGlobal("re-visit-task"));
            SelfManager.self().setVariable("task-string", "revisiting");
            SelfManager.self().penManager.raisePen();
            SelfManager.self().setVariable("interest", (SelfManager.self().getVariable("interest") - (15 + Prims.random(5))));
            SelfManager.self().setVariable("bee-timer", 25);
          }
          if ((Prims.gt(SelfManager.self().getVariable("bee-timer"), (SelfManager.self().getVariable("interest") - ((SelfManager.self().getVariable("trips") - 1) * (15 + Prims.random(5))))) && Prims.lte(SelfManager.self().getVariable("interest"), 0))) {
            SelfManager.self().setVariable("next-task", world.observer.getGlobal("watch-dance-task"));
            SelfManager.self().setVariable("task-string", "watching-dance");
            SelfManager.self().setVariable("target", Nobody);
            SelfManager.self().setVariable("interest", 0);
            SelfManager.self().setVariable("trips", 0);
            SelfManager.self().setVariable("color", 5);
            SelfManager.self().setVariable("bee-timer", 50);
          }
          if (Prims.lte(SelfManager.self().getVariable("bee-timer"), (SelfManager.self().getVariable("interest") - ((SelfManager.self().getVariable("trips") - 1) * (15 + Prims.random(5)))))) {
            if ((Prims.lte(SelfManager.self().getVariable("interest"), 50) && Prims.lt(Prims.random(100), 43))) {
              SelfManager.self().setVariable("next-task", world.observer.getGlobal("re-visit-task"));
              SelfManager.self().setVariable("task-string", "revisiting");
              SelfManager.self().setVariable("interest", (SelfManager.self().getVariable("interest") - (15 + Prims.random(5))));
              SelfManager.self().setVariable("bee-timer", 10);
            }
            else {
              if (world.observer.getGlobal("show-dance-path?")) {
                SelfManager.self().penManager.lowerPen();
              }
              else {
                SelfManager.self().penManager.raisePen();
              }
              for (let _index_14583_14589 = 0, _repeatcount_14583_14589 = StrictMath.floor(2); _index_14583_14589 < _repeatcount_14583_14589; _index_14583_14589++){
                procedures["WAGGLE"]();
                procedures["MAKE-SEMICIRCLE"]();
              }
            }
          }
          SelfManager.self().setVariable("bee-timer", (SelfManager.self().getVariable("bee-timer") + 1));
        }
      }, "[ ->\n    ifelse count scouts with [piping?] in-radius 3 > 0 [\n      ; while dancing, if detecting any piping bee, start piping too\n      pen-up\n      set next-task pipe-task\n      set task-string \"piping\"\n      set bee-timer 20\n      set target [target] of one-of scouts with [piping?]\n      set color [color] of target\n      set piping? true\n    ] [\n      if bee-timer > interest - (trips - 1) * (15 + random 5) and interest > 0 [\n        ; if a bee dances longer than its current interest, and if it's still\n        ; interested in the target, go to revisit the target again\n        set next-task re-visit-task\n        set task-string \"revisiting\"\n        pen-up\n        set interest interest - (15 + random 5) ; interest decline by [15,19]\n        set bee-timer 25                        ; revisit 25 ticks\n      ]\n      if bee-timer > interest - (trips - 1) * (15 + random 5) and interest <= 0 [\n        ; if a bee dances longer than its current interest, and if it's no longer\n        ; interested in the target, as represented by interest <=0, stay in the\n        ; swarm, rest for 50 ticks, and then watch dance\n        set next-task watch-dance-task\n        set task-string \"watching-dance\"\n        set target nobody\n        set interest 0\n        set trips 0\n        set color gray\n        set bee-timer 50\n      ]\n      if bee-timer <=  interest - (trips - 1) * (15 + random 5) [\n        ; if a bee dances short than its current interest, keep dancing\n        ifelse interest <= 50 and random 100 < 43 [\n          set next-task re-visit-task\n          set task-string \"revisiting\"\n          set interest interest - (15 + random 5)\n          set bee-timer 10\n        ] [\n          ifelse show-dance-path? [pen-down][pen-up]\n          repeat 2 [\n            waggle\n            make-semicircle]\n        ]\n      ]\n      set bee-timer bee-timer + 1\n    ]\n  ]"));
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
  procs["dance"] = temp;
  procs["DANCE"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("re-visit-task", Tasks.commandTask(function() {
        if (arguments.length < 0) {
          throw new Error("anonymous procedure expected 0 inputs, but only got " + arguments.length);
        }
        if (Prims.gt(SelfManager.self().getVariable("bee-timer"), 0)) {
          SelfManager.self().setVariable("bee-timer", (SelfManager.self().getVariable("bee-timer") - 1));
        }
        else {
          SelfManager.self().penManager.raisePen();
          if (Prims.lt(SelfManager.self().distance(SelfManager.self().getVariable("target")), 1)) {
            if (Prims.equality(SelfManager.self().getVariable("interest"), 0)) {
              SelfManager.self().setVariable("interest", SelfManager.self().getVariable("target").projectionBy(function() { return SelfManager.self().getVariable("quality"); }));
              SelfManager.self().setVariable("color", SelfManager.self().getVariable("target").projectionBy(function() { return SelfManager.self().getVariable("color"); }));
            }
            SelfManager.self().setVariable("next-task", world.observer.getGlobal("inspect-hive-task"));
            SelfManager.self().setVariable("task-string", "inspecting-hive");
            SelfManager.self().setVariable("bee-timer", 50);
          }
          else {
            procedures["PROCEED"]();
            SelfManager.self().face(SelfManager.self().getVariable("target"));
          }
        }
      }, "[ ->\n    ifelse bee-timer > 0 [\n      ; wait a bit after the previous trip\n      set bee-timer bee-timer - 1\n    ] [\n      pen-up\n      ifelse distance target < 1 [\n        ; if on target, learn about the target\n        if interest = 0 [\n          set interest [ quality ] of target\n          set color [ color ] of target\n        ]\n        set next-task inspect-hive-task\n        set task-string \"inspecting-hive\"\n        set bee-timer 50\n      ] [\n        ; if hasn't reached target yet (distance > 1), keep flying\n        proceed\n        face target\n      ]\n    ]\n  ]"));
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
  procs["reVisit"] = temp;
  procs["RE-VISIT"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("pipe-task", Tasks.commandTask(function() {
        if (arguments.length < 0) {
          throw new Error("anonymous procedure expected 0 inputs, but only got " + arguments.length);
        }
        procedures["MOVE-AROUND"]();
        if (Prims.equality(SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() { return SelfManager.self().getVariable("piping?"); }), 5).size(), SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("SCOUTS"), 5).size())) {
          SelfManager.self().setVariable("bee-timer", (SelfManager.self().getVariable("bee-timer") - 1));
        }
        if (Prims.lt(SelfManager.self().getVariable("bee-timer"), 0)) {
          SelfManager.self().setVariable("next-task", world.observer.getGlobal("take-off-task"));
          SelfManager.self().setVariable("task-string", "taking-off");
        }
      }, "[ ->\n    move-around\n    if count scouts with [ piping? ] in-radius 5 = count scouts in-radius 5 [\n      ; if every surrounding bee is piping, wait a bit (20 ticks as\n      ; set in the watch-dance procedure) for bees to come back to\n      ; the swarm from the hive before taking off\n      set bee-timer bee-timer - 1\n    ]\n    if bee-timer < 0 [\n      set next-task take-off-task\n      set task-string \"taking-off\"\n    ]\n  ]"));
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
  procs["pipe"] = temp;
  procs["PIPE"] = temp;
  temp = (function() {
    try {
      world.observer.setGlobal("take-off-task", Tasks.commandTask(function() {
        if (arguments.length < 0) {
          throw new Error("anonymous procedure expected 0 inputs, but only got " + arguments.length);
        }
        if (Prims.gt(SelfManager.self().distance(SelfManager.self().getVariable("target")), 1)) {
          SelfManager.self().face(SelfManager.self().getVariable("target"));
          SelfManager.self()._optimalFdOne();
        }
        else {
          SelfManager.self().setVariable("on-site?", true);
        }
      }, "[ ->\n    ifelse distance target > 1 [\n      face target fd 1\n    ] [\n      set on-site? true\n    ]\n  ]"));
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
  procs["takeOff"] = temp;
  procs["TAKE-OFF"] = temp;
  temp = (function() {
    try {
      if ((world.turtleManager.turtlesOfBreed("SCOUTS").agentAll(function() { return SelfManager.self().getVariable("on-site?"); }) && Prims.equality(ListPrims.length(ListPrims.removeDuplicates(world.turtleManager.turtlesOfBreed("SCOUTS").projectionBy(function() { return SelfManager.self().getVariable("target"); }))), 1))) {
        throw new Exception.StopInterrupt;
      }
      world.turtleManager.turtlesOfBreed("SCOUTS").ask(function() {
        try {
          Prims.run(SelfManager.self().getVariable("next-task"));
        } catch (e) {
          if (e instanceof Exception.ReportInterrupt) {
            throw new Error("REPORT can only be used inside TO-REPORT.");
          } else if (e instanceof Exception.StopInterrupt) {
            return e;
          } else {
            throw e;
          }
        }
      }, true);
      procedures["PLOT-ON-SITE-SCOUTS"]();
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
      let numOfTurns = (Prims.div(1, SelfManager.self().getVariable("interest")) * 2600);
      let anglePerTurn = Prims.div(180, numOfTurns);
      let semicircle = Prims.div(((0.5 * SelfManager.self().getVariable("dist-to-hive")) * 3.141592653589793), 5);
      if (Prims.equality(SelfManager.self().getVariable("circle-switch"), 1)) {
        SelfManager.self().face(SelfManager.self().getVariable("target"));
        SelfManager.self().right(-90);
        for (let _index_17080_17086 = 0, _repeatcount_17080_17086 = StrictMath.floor(numOfTurns); _index_17080_17086 < _repeatcount_17080_17086; _index_17080_17086++){
          SelfManager.self().right(-anglePerTurn);
          SelfManager.self().fd((Prims.div(semicircle, 180) * anglePerTurn));
        }
      }
      if (Prims.equality(SelfManager.self().getVariable("circle-switch"), -1)) {
        SelfManager.self().face(SelfManager.self().getVariable("target"));
        SelfManager.self().right(90);
        for (let _index_17233_17239 = 0, _repeatcount_17233_17239 = StrictMath.floor(numOfTurns); _index_17233_17239 < _repeatcount_17233_17239; _index_17233_17239++){
          SelfManager.self().right(anglePerTurn);
          SelfManager.self().fd((Prims.div(semicircle, 180) * anglePerTurn));
        }
      }
      SelfManager.self().setVariable("circle-switch", (SelfManager.self().getVariable("circle-switch") * -1));
      SelfManager.self().setXY(SelfManager.self().getVariable("temp-x-dance"), SelfManager.self().getVariable("temp-y-dance"));
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
  procs["makeSemicircle"] = temp;
  procs["MAKE-SEMICIRCLE"] = temp;
  temp = (function() {
    try {
      SelfManager.self().face(SelfManager.self().getVariable("target"));
      SelfManager.self().setVariable("temp-x-dance", SelfManager.self().getVariable("xcor"));
      SelfManager.self().setVariable("temp-y-dance", SelfManager.self().getVariable("ycor"));
      let waggleSwitch = 1;
      SelfManager.self().right(-60);
      SelfManager.self()._optimalFdLessThan1(0.4);
      for (let _index_17897_17903 = 0, _repeatcount_17897_17903 = StrictMath.floor(Prims.div((SelfManager.self().getVariable("dist-to-hive") - 2), 2)); _index_17897_17903 < _repeatcount_17897_17903; _index_17897_17903++){
        if (Prims.equality(waggleSwitch, 1)) {
          SelfManager.self().right(120);
          SelfManager.self()._optimalFdLessThan1(0.8);
        }
        if (Prims.equality(waggleSwitch, -1)) {
          SelfManager.self().right(-120);
          SelfManager.self()._optimalFdLessThan1(0.8);
        }
        waggleSwitch = (waggleSwitch * -1);
      }
      if (Prims.equality(waggleSwitch, -1)) {
        SelfManager.self().right(-120);
        SelfManager.self()._optimalFdLessThan1(0.4);
      }
      else {
        SelfManager.self().right(120);
        SelfManager.self()._optimalFdLessThan1(0.4);
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
  procs["waggle"] = temp;
  procs["WAGGLE"] = temp;
  temp = (function() {
    try {
      SelfManager.self().right((Prims.random(20) - Prims.random(20)));
      if (!SelfManager.self().canMove(1)) {
        SelfManager.self().right(180);
      }
      SelfManager.self()._optimalFdOne();
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
  procs["proceed"] = temp;
  procs["PROCEED"] = temp;
  temp = (function() {
    try {
      SelfManager.self().right((Prims.random(60) - Prims.random(60)));
      SelfManager.self().fd(Prims.randomFloat(0.1));
      if (Prims.gt(SelfManager.self().distanceXY(0, 0), 4)) {
        SelfManager.self().faceXY(0, 0);
        SelfManager.self()._optimalFdOne();
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
  procs["moveAround"] = temp;
  procs["MOVE-AROUND"] = temp;
  temp = (function() {
    try {
      let i = 0;
      for (let _index_18472_18478 = 0, _repeatcount_18472_18478 = StrictMath.floor(world.turtleManager.turtlesOfBreed("SITES").size()); _index_18472_18478 < _repeatcount_18472_18478; _index_18472_18478++){
        plotManager.setCurrentPlot("on-site");
        plotManager.setCurrentPen((Dump('') + Dump("site") + Dump(i)));
        plotManager.plotValue(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() {
          return (SelfManager.self().getVariable("on-site?") && Prims.equality(SelfManager.self().getVariable("target"), world.turtleManager.getTurtleOfBreed("SITES", i)));
        }).size());
        plotManager.setCurrentPlot("committed");
        plotManager.setCurrentPen((Dump('') + Dump("target") + Dump(i)));
        plotManager.plotValue(world.turtleManager.turtlesOfBreed("SCOUTS").agentFilter(function() {
          return Prims.equality(SelfManager.self().getVariable("target"), world.turtleManager.getTurtleOfBreed("SITES", i));
        }).size());
        i = (i + 1);
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
  procs["plotOnSiteScouts"] = temp;
  procs["PLOT-ON-SITE-SCOUTS"] = temp;
  temp = (function() {
    try {
      if (world.observer.getGlobal("show-dance-path?")) {
        world.clearDrawing();
      }
      world.observer.setGlobal("show-dance-path?", !world.observer.getGlobal("show-dance-path?"));
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
  procs["showHideDancePath"] = temp;
  procs["SHOW-HIDE-DANCE-PATH"] = temp;
  temp = (function() {
    try {
      if (world.observer.getGlobal("scouts-visible?")) {
        world.turtleManager.turtlesOfBreed("SCOUTS").ask(function() { SelfManager.self().hideTurtle(true);; }, true);
      }
      else {
        world.turtleManager.turtlesOfBreed("SCOUTS").ask(function() { SelfManager.self().hideTurtle(false);; }, true);
      }
      world.observer.setGlobal("scouts-visible?", !world.observer.getGlobal("scouts-visible?"));
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
  procs["showHideScouts"] = temp;
  procs["SHOW-HIDE-SCOUTS"] = temp;
  return procs;
})();
world.observer.setGlobal("hive-number", 10);
world.observer.setGlobal("initial-percentage", 12);
world.observer.setGlobal("initial-explore-time", 200);
world.observer.setGlobal("quorum", 33);
