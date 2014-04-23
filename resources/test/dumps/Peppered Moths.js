var workspace     = require('engine/workspace')(-16, 16, -20, 20, 10.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"moth dark":{"rotate":false,"elements":[{"xcors":[150,105,76,46,14,0,0,16,30,61,29,1,1,16,46,18,59,105,121,150],"ycors":[61,16,2,2,16,45,89,122,135,151,166,196,239,273,287,275,299,299,286,256],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[150,196,226,254,286,299,299,285,271,240,271,299,299,286,242,196,151],"ycors":[61,16,1,1,16,45,91,121,136,151,167,196,242,271,299,299,258],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xmin":136,"ymin":16,"xmax":165,"ymax":286,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":true},{"xcors":[136,105,77,45,13,0,0,17,29,60,30,0,1,16,57,108,138],"ycors":[46,16,2,2,16,44,88,125,136,151,165,194,242,275,299,299,269],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":true},{"xcors":[164,195,225,255,287,299,299,285,270,241,269,299,299,286,243,195,164,164],"ycors":[49,17,1,1,15,41,93,121,138,151,165,193,245,272,299,299,272,49],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":true},{"x1":136,"y1":46,"x2":106,"y2":16,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":106,"y1":16,"x2":76,"y2":1,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":165,"y1":48,"x2":196,"y2":17,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":196,"y1":17,"x2":226,"y2":1,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":226,"y1":1,"x2":256,"y2":1,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":256,"y1":1,"x2":287,"y2":15,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":287,"y1":15,"x2":300,"y2":45,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":76,"y1":2,"x2":45,"y2":2,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":45,"y1":2,"x2":15,"y2":14,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":15,"y1":14,"x2":1,"y2":43,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":1,"y1":43,"x2":1,"y2":89,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":1,"y1":89,"x2":14,"y2":119,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":14,"y1":119,"x2":30,"y2":137,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":31,"y1":138,"x2":60,"y2":151,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":299,"y1":44,"x2":299,"y2":93,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":299,"y1":93,"x2":285,"y2":119,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":285,"y1":119,"x2":272,"y2":136,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":272,"y1":136,"x2":242,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":61,"y1":153,"x2":30,"y2":165,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":30,"y1":165,"x2":2,"y2":193,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":2,"y1":195,"x2":2,"y2":242,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":2,"y1":243,"x2":16,"y2":273,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":16,"y1":273,"x2":58,"y2":297,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":241,"y1":152,"x2":270,"y2":165,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":270,"y1":165,"x2":299,"y2":195,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":299,"y1":195,"x2":298,"y2":250,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":298,"y1":250,"x2":285,"y2":271,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":285,"y1":271,"x2":244,"y2":298,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":244,"y1":298,"x2":193,"y2":297,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":193,"y1":297,"x2":163,"y2":270,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":135,"y1":269,"x2":104,"y2":298,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":104,"y1":298,"x2":58,"y2":298,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xmin":136,"ymin":17,"xmax":164,"ymax":287,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false}]},"moth light":{"rotate":false,"elements":[{"xcors":[150,105,76,46,14,0,0,16,30,61,29,1,1,16,46,18,59,105,121,150],"ycors":[61,16,2,2,16,45,89,122,135,151,166,196,239,273,287,275,299,299,286,256],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"xcors":[150,196,226,254,286,299,299,285,271,240,271,299,299,286,242,196,151],"ycors":[61,16,1,1,16,45,91,121,136,151,167,196,242,271,299,299,258],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":true},{"x1":150,"y1":60,"x2":105,"y2":16,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":105,"y1":16,"x2":78,"y2":1,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":78,"y1":1,"x2":45,"y2":1,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":45,"y1":1,"x2":15,"y2":14,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":15,"y1":14,"x2":0,"y2":43,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":0,"y1":43,"x2":0,"y2":86,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":0,"y1":86,"x2":16,"y2":123,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":16,"y1":123,"x2":30,"y2":134,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":30,"y1":134,"x2":60,"y2":151,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":60,"y1":151,"x2":30,"y2":165,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":30,"y1":165,"x2":0,"y2":194,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":0,"y1":194,"x2":1,"y2":240,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":1,"y1":240,"x2":15,"y2":272,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":15,"y1":272,"x2":57,"y2":299,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":57,"y1":299,"x2":105,"y2":298,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":105,"y1":298,"x2":149,"y2":257,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":149,"y1":257,"x2":196,"y2":298,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":196,"y1":298,"x2":242,"y2":298,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":242,"y1":298,"x2":285,"y2":271,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":285,"y1":271,"x2":299,"y2":242,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":299,"y1":242,"x2":299,"y2":194,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":299,"y1":194,"x2":271,"y2":167,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":271,"y1":167,"x2":242,"y2":152,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":242,"y1":152,"x2":270,"y2":137,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":270,"y1":137,"x2":285,"y2":121,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":285,"y1":121,"x2":299,"y2":91,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":299,"y1":91,"x2":299,"y2":44,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":299,"y1":44,"x2":285,"y2":15,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":285,"y1":15,"x2":253,"y2":0,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":253,"y1":0,"x2":225,"y2":0,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":225,"y1":0,"x2":195,"y2":16,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":195,"y1":16,"x2":149,"y2":62,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"xmin":135,"ymin":16,"xmax":164,"ymax":286,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":false}]},"pentagon":{"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}}, 5);
var AgentSet      = workspace.agentSet;
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var Updater       = workspace.updater;
var world         = workspace.world;
var Globals       = world.globals;
var TurtlesOwn    = world.turtlesOwn;
var PatchesOwn    = world.patchesOwn;
var LinksOwn      = world.linksOwn;

var AgentKind  = require('engine/agentkind');
var Agents     = require('engine/agents');
var Call       = require('engine/call');
var ColorModel = require('engine/colormodel');
var Dump       = require('engine/dump');
var Exception  = require('engine/exception');
var Link       = require('engine/link');
var Nobody     = require('engine/nobody');
var noop       = require('engine/noop');
var Tasks      = require('engine/tasks');
var Trig       = require('engine/trig');
var Turtle     = require('engine/turtle');

var AgentModel     = require('integration/agentmodel');
var Denuller       = require('integration/denuller');
var notImplemented = require('integration/notimplemented');
var Random         = require('integration/random');
var StrictMath     = require('integration/strictmath');
var typeIsArray    = require('integration/typeisarray');

Globals.init(10);
BreedManager.add("MOTHS", "moth");
BreedManager.get("MOTHS").vars =["AGE"];function envColor() {
  return (9 - Globals.getGlobal(8));
}
function deltaEnv() {
  return (Globals.getGlobal(3) / 100);
}
function randomColor() {
  return (Prims.random(9) + 1);
}
function upperBound() {
  return (4 * Globals.getGlobal(0));
}
function setup() {
  world.clearAll();
  Call(setupWorld);
  Call(setupMoths);
  Call(updateMonitors);
  world.resetTicks();
}
function setupWorld() {
  Globals.setGlobal(8, 0);
  Globals.setGlobal(9, true);
  AgentSet.ask(world.patches(), true, function() {
    AgentSet.setPatchVariable(2, Call(envColor));
  });
}
function setupMoths() {
  AgentSet.ask(world.createTurtles(Globals.getGlobal(0), "MOTHS"), true, function() {
    AgentSet.setTurtleVariable(1, Call(randomColor));
    Call(mothsPickShape);
    AgentSet.setBreedVariable("AGE", Prims.random(3));
    Prims.setXY(Prims.randomXcor(), Prims.randomYcor());
  });
}
function go() {
  AgentSet.ask(world.turtlesOfBreed("MOTHS"), true, function() {
    Call(mothsMate);
    Call(mothsGrimReaper);
    Call(mothsGetEaten);
    Call(mothsAge);
  });
  if (Globals.getGlobal(4)) {
    Call(cyclePollution);
  }
  world.tick();
  Call(updateMonitors);
}
function mothsMate() {
  if ((Prims.equality(AgentSet.getBreedVariable("AGE"), 2) || Prims.equality(AgentSet.getBreedVariable("AGE"), 3))) {
    AgentSet.ask(Prims.hatch(2, ""), true, function() {
      if (Prims.lt(Prims.randomFloat(100), Globals.getGlobal(1))) {
        if (Prims.equality(Prims.random(2), 0)) {
          AgentSet.setTurtleVariable(1, StrictMath.round((AgentSet.getTurtleVariable(1) + (Prims.randomFloat(Globals.getGlobal(1)) / 12.5))));
          if (Prims.gte(AgentSet.getTurtleVariable(1), 9)) {
            AgentSet.setTurtleVariable(1, 9);
          }
        }
        else {
          AgentSet.setTurtleVariable(1, StrictMath.round((AgentSet.getTurtleVariable(1) - (Prims.randomFloat(Globals.getGlobal(1)) / 12.5))));
          if ((Prims.lte(AgentSet.getTurtleVariable(1), 1) || Prims.gte(AgentSet.getTurtleVariable(1), 130))) {
            AgentSet.setTurtleVariable(1, 1);
          }
        }
      }
      Call(mothsPickShape);
      AgentSet.setBreedVariable("AGE", 0);
      Prims.right(Prims.randomFloat(360));
      Prims.fd(1);
    });
  }
}
function mothsGetEaten() {
  if (Prims.lt(Prims.randomFloat(1000), ((Globals.getGlobal(2) * StrictMath.abs((Call(envColor) - AgentSet.getTurtleVariable(1)))) + 200))) {
    AgentSet.die();
  }
}
function mothsGrimReaper() {
  if (Prims.equality(Prims.random(13), 0)) {
    AgentSet.die();
  }
  if (Prims.gt(AgentSet.count(world.turtlesOfBreed("MOTHS")), Call(upperBound))) {
    if (Prims.equality(Prims.random(2), 0)) {
      AgentSet.die();
    }
  }
}
function mothsAge() {
  AgentSet.setBreedVariable("AGE", (AgentSet.getBreedVariable("AGE") + 1));
}
function mothsPickShape() {
  if (Prims.lt(AgentSet.getTurtleVariable(1), 5)) {
    AgentSet.setTurtleVariable(5, "moth dark");
  }
  else {
    AgentSet.setTurtleVariable(5, "moth light");
  }
}
function updateMonitors() {
  Globals.setGlobal(5, AgentSet.count(AgentSet.agentFilter(world.turtlesOfBreed("MOTHS"), function() {
    return Prims.gte(AgentSet.getTurtleVariable(1), 7);
  })));
  Globals.setGlobal(7, AgentSet.count(AgentSet.agentFilter(world.turtlesOfBreed("MOTHS"), function() {
    return Prims.lte(AgentSet.getTurtleVariable(1), 3);
  })));
  Globals.setGlobal(6, (AgentSet.count(world.turtlesOfBreed("MOTHS")) - (Globals.getGlobal(5) + Globals.getGlobal(7))));
}
function polluteWorld() {
  if (Prims.lte(Globals.getGlobal(8), (8 - Call(deltaEnv)))) {
    Globals.setGlobal(8, (Globals.getGlobal(8) + Call(deltaEnv)));
    AgentSet.ask(world.patches(), true, function() {
      AgentSet.setPatchVariable(2, Call(envColor));
    });
  }
  else {
    Globals.setGlobal(9, false);
  }
}
function cleanUpWorld() {
  if (Prims.gte(Globals.getGlobal(8), (0 + Call(deltaEnv)))) {
    Globals.setGlobal(8, (Globals.getGlobal(8) - Call(deltaEnv)));
    AgentSet.ask(world.patches(), true, function() {
      AgentSet.setPatchVariable(2, Call(envColor));
    });
  }
  else {
    Globals.setGlobal(9, true);
  }
}
function cyclePollution() {
  if (Prims.equality(Globals.getGlobal(9), true)) {
    Call(polluteWorld);
  }
  else {
    Call(cleanUpWorld);
  }
}
Globals.setGlobal(0, 100);
Globals.setGlobal(1, 15);
Globals.setGlobal(2, 50);
Globals.setGlobal(3, 10);
Globals.setGlobal(4, false);
