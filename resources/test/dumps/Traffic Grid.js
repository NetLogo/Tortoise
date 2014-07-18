var workspace     = require('engine/workspace')([])(['grid-size-y', 'grid-size-x', 'power?', 'num-cars', 'speed-limit', 'ticks-per-cycle', 'current-phase', 'current-auto?', 'grid-x-inc', 'grid-y-inc', 'acceleration', 'phase', 'num-cars-stopped', 'current-light', 'intersections', 'roads'], ['grid-size-y', 'grid-size-x', 'power?', 'num-cars', 'speed-limit', 'ticks-per-cycle', 'current-phase', 'current-auto?'], ['speed', 'up-car?', 'wait-time'], [], ['intersection?', 'green-light-up?', 'my-row', 'my-column', 'my-phase', 'auto?'], -18, 18, -18, 18, 9.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"rotate":true,"elements":[{"xcors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"ycors":[15,21,39,60,74,87,97,115,141,165,225,285,285,285,15,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":30,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[80,78,135,135,105,96,89],"ycors":[138,168,166,91,106,111,120],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":47,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var SelfManager   = workspace.selfManager;
var Updater       = workspace.updater;
var world         = workspace.world;

var Call           = require('util/call');
var ColorModel     = require('util/colormodel');
var Dump           = require('util/dump');
var Exception      = require('util/exception');
var Trig           = require('util/trig');
var Type           = require('util/typechecker');
var notImplemented = require('util/notimplemented');

var Link      = require('engine/core/link');
var LinkSet   = require('engine/core/linkset');
var Nobody    = require('engine/core/nobody');
var PatchSet  = require('engine/core/patchset');
var Turtle    = require('engine/core/turtle');
var TurtleSet = require('engine/core/turtleset');
var Tasks     = require('engine/prim/tasks');

var AgentModel     = require('agentmodel');
var Denuller       = require('nashorn/denuller');
var Random         = require('shim/random');
var StrictMath     = require('shim/strictmath');function setup() {
  world.clearAll();
  Call(setupGlobals);
  Call(setupPatches);
  Call(makeCurrent, Prims.oneOf(world.observer.getGlobal('intersections')));
  Call(labelCurrent);
  BreedManager.setDefaultShape(world.turtles().getBreedName(), "car")
  if (Prims.gt(world.observer.getGlobal('num-cars'), world.observer.getGlobal('roads').size())) {
    notImplemented('user-message', undefined)((Dump("") + Dump("There are too many cars for the amount of ") + Dump("road.  Either increase the amount of roads ") + Dump("by increasing the GRID-SIZE-X or ") + Dump("GRID-SIZE-Y sliders, or decrease the ") + Dump("number of cars by lowering the NUMBER slider.\n") + Dump("The setup has stopped.")));
    throw new Exception.StopInterrupt;
  }
  world.createTurtles(world.observer.getGlobal('num-cars'), '').ask(function() {
    Call(setupCars);
    Call(setCarColor);
    Call(recordData);
  }, true);
  world.turtles().ask(function() {
    Call(setCarSpeed);
  }, true);
  world.ticker.reset();
}
function setupGlobals() {
  world.observer.setGlobal('current-light', Nobody);
  world.observer.setGlobal('phase', 0);
  world.observer.setGlobal('num-cars-stopped', 0);
  world.observer.setGlobal('grid-x-inc', (world.topology.width / world.observer.getGlobal('grid-size-x')));
  world.observer.setGlobal('grid-y-inc', (world.topology.height / world.observer.getGlobal('grid-size-y')));
  world.observer.setGlobal('acceleration', 0.099);
}
function setupPatches() {
  world.patches().ask(function() {
    Prims.setPatchVariable('intersection?', false);
    Prims.setPatchVariable('auto?', false);
    Prims.setPatchVariable('green-light-up?', true);
    Prims.setPatchVariable('my-row', -1);
    Prims.setPatchVariable('my-column', -1);
    Prims.setPatchVariable('my-phase', -1);
    Prims.setPatchVariable('pcolor', (35 + 3));
  }, true);
  world.observer.setGlobal('roads', world.patches().agentFilter(function() {
    return (Prims.equality(StrictMath.floor(Prims.mod(((Prims.getPatchVariable('pxcor') + world.topology.maxPxcor) - StrictMath.floor((world.observer.getGlobal('grid-x-inc') - 1))), world.observer.getGlobal('grid-x-inc'))), 0) || Prims.equality(StrictMath.floor(Prims.mod((Prims.getPatchVariable('pycor') + world.topology.maxPycor), world.observer.getGlobal('grid-y-inc'))), 0));
  }));
  world.observer.setGlobal('intersections', world.observer.getGlobal('roads').agentFilter(function() {
    return (Prims.equality(StrictMath.floor(Prims.mod(((Prims.getPatchVariable('pxcor') + world.topology.maxPxcor) - StrictMath.floor((world.observer.getGlobal('grid-x-inc') - 1))), world.observer.getGlobal('grid-x-inc'))), 0) && Prims.equality(StrictMath.floor(Prims.mod((Prims.getPatchVariable('pycor') + world.topology.maxPycor), world.observer.getGlobal('grid-y-inc'))), 0));
  }));
  world.observer.getGlobal('roads').ask(function() {
    Prims.setPatchVariable('pcolor', 9.9);
  }, true);
  Call(setupIntersections);
}
function setupIntersections() {
  world.observer.getGlobal('intersections').ask(function() {
    Prims.setPatchVariable('intersection?', true);
    Prims.setPatchVariable('green-light-up?', true);
    Prims.setPatchVariable('my-phase', 0);
    Prims.setPatchVariable('auto?', true);
    Prims.setPatchVariable('my-row', StrictMath.floor(((Prims.getPatchVariable('pycor') + world.topology.maxPycor) / world.observer.getGlobal('grid-y-inc'))));
    Prims.setPatchVariable('my-column', StrictMath.floor(((Prims.getPatchVariable('pxcor') + world.topology.maxPxcor) / world.observer.getGlobal('grid-x-inc'))));
    Call(setSignalColors);
  }, true);
}
function setupCars() {
  Prims.setVariable('speed', 0);
  Prims.setVariable('wait-time', 0);
  Call(putOnEmptyRoad);
  if (Prims.getPatchVariable('intersection?')) {
    if (Prims.equality(Prims.random(2), 0)) {
      Prims.setVariable('up-car?', true);
    }
    else {
      Prims.setVariable('up-car?', false);
    }
  }
  else {
    if (Prims.equality(StrictMath.floor(Prims.mod(((Prims.getPatchVariable('pxcor') + world.topology.maxPxcor) - StrictMath.floor((world.observer.getGlobal('grid-x-inc') - 1))), world.observer.getGlobal('grid-x-inc'))), 0)) {
      Prims.setVariable('up-car?', true);
    }
    else {
      Prims.setVariable('up-car?', false);
    }
  }
  if (Prims.getVariable('up-car?')) {
    Prims.setVariable('heading', 180);
  }
  else {
    Prims.setVariable('heading', 90);
  }
}
function putOnEmptyRoad() {
  SelfManager.self().moveTo(Prims.oneOf(world.observer.getGlobal('roads').agentFilter(function() {
    return !Prims.turtlesOn(SelfManager.self()).nonEmpty();
  })));
}
function go() {
  Call(updateCurrent);
  Call(setSignals);
  world.observer.setGlobal('num-cars-stopped', 0);
  world.turtles().ask(function() {
    Call(setCarSpeed);
    Prims.fd(Prims.getVariable('speed'));
    Call(recordData);
    Call(setCarColor);
  }, true);
  Call(nextPhase);
  world.ticker.tick();
}
function chooseCurrent() {
  if (notImplemented('mouse-down?', false)) {
    var xMouse = notImplemented('mouse-xcor', 0)();
    var yMouse = notImplemented('mouse-ycor', 0)();
    if (Prims.patch(xMouse, yMouse).projectionBy(function() {
      return Prims.getPatchVariable('intersection?');
    })) {
      Call(updateCurrent);
      Call(unlabelCurrent);
      Call(makeCurrent, Prims.patch(xMouse, yMouse));
      Call(labelCurrent);
      throw new Exception.StopInterrupt;
    }
  }
}
function makeCurrent(light) {
  world.observer.setGlobal('current-light', light);
  world.observer.setGlobal('current-phase', world.observer.getGlobal('current-light').projectionBy(function() {
    return Prims.getPatchVariable('my-phase');
  }));
  world.observer.setGlobal('current-auto?', world.observer.getGlobal('current-light').projectionBy(function() {
    return Prims.getPatchVariable('auto?');
  }));
}
function updateCurrent() {
  world.observer.getGlobal('current-light').ask(function() {
    Prims.setPatchVariable('my-phase', world.observer.getGlobal('current-phase'));
    Prims.setPatchVariable('auto?', world.observer.getGlobal('current-auto?'));
  }, true);
}
function labelCurrent() {
  world.observer.getGlobal('current-light').ask(function() {
    SelfManager.self().patchAt(-1, 1).ask(function() {
      Prims.setPatchVariable('plabel-color', 0);
      Prims.setPatchVariable('plabel', "current");
    }, true);
  }, true);
}
function unlabelCurrent() {
  world.observer.getGlobal('current-light').ask(function() {
    SelfManager.self().patchAt(-1, 1).ask(function() {
      Prims.setPatchVariable('plabel', "");
    }, true);
  }, true);
}
function setSignals() {
  world.observer.getGlobal('intersections').agentFilter(function() {
    return (Prims.getPatchVariable('auto?') && Prims.equality(world.observer.getGlobal('phase'), StrictMath.floor(((Prims.getPatchVariable('my-phase') * world.observer.getGlobal('ticks-per-cycle')) / 100))));
  }).ask(function() {
    Prims.setPatchVariable('green-light-up?', !Prims.getPatchVariable('green-light-up?'));
    Call(setSignalColors);
  }, true);
}
function setSignalColors() {
  if (world.observer.getGlobal('power?')) {
    if (Prims.getPatchVariable('green-light-up?')) {
      SelfManager.self().patchAt(-1, 0).ask(function() {
        Prims.setPatchVariable('pcolor', 15);
      }, true);
      SelfManager.self().patchAt(0, 1).ask(function() {
        Prims.setPatchVariable('pcolor', 55);
      }, true);
    }
    else {
      SelfManager.self().patchAt(-1, 0).ask(function() {
        Prims.setPatchVariable('pcolor', 55);
      }, true);
      SelfManager.self().patchAt(0, 1).ask(function() {
        Prims.setPatchVariable('pcolor', 15);
      }, true);
    }
  }
  else {
    SelfManager.self().patchAt(-1, 0).ask(function() {
      Prims.setPatchVariable('pcolor', 9.9);
    }, true);
    SelfManager.self().patchAt(0, 1).ask(function() {
      Prims.setPatchVariable('pcolor', 9.9);
    }, true);
  }
}
function setCarSpeed() {
  if (Prims.equality(Prims.getPatchVariable('pcolor'), 15)) {
    Prims.setVariable('speed', 0);
  }
  else {
    if (Prims.getVariable('up-car?')) {
      Call(setSpeed, 0, -1);
    }
    else {
      Call(setSpeed, 1, 0);
    }
  }
}
function setSpeed(deltaX, deltaY) {
  var turtlesAhead = SelfManager.self().turtlesAt(deltaX, deltaY);
  if (turtlesAhead.nonEmpty()) {
    if (turtlesAhead.agentFilter(function() {
      return !Prims.equality(Prims.getVariable('up-car?'), SelfManager.myself().projectionBy(function() {
        return Prims.getVariable('up-car?');
      }));
    }).nonEmpty()) {
      Prims.setVariable('speed', 0);
    }
    else {
      Prims.setVariable('speed', Prims.oneOf(turtlesAhead).projectionBy(function() {
        return Prims.getVariable('speed');
      }));
      Call(slowDown);
    }
  }
  else {
    Call(speedUp);
  }
}
function slowDown() {
  if (Prims.lte(Prims.getVariable('speed'), 0)) {
    Prims.setVariable('speed', 0);
  }
  else {
    Prims.setVariable('speed', (Prims.getVariable('speed') - world.observer.getGlobal('acceleration')));
  }
}
function speedUp() {
  if (Prims.gt(Prims.getVariable('speed'), world.observer.getGlobal('speed-limit'))) {
    Prims.setVariable('speed', world.observer.getGlobal('speed-limit'));
  }
  else {
    Prims.setVariable('speed', (Prims.getVariable('speed') + world.observer.getGlobal('acceleration')));
  }
}
function setCarColor() {
  if (Prims.lt(Prims.getVariable('speed'), (world.observer.getGlobal('speed-limit') / 2))) {
    Prims.setVariable('color', 105);
  }
  else {
    Prims.setVariable('color', (85 - 2));
  }
}
function recordData() {
  if (Prims.equality(Prims.getVariable('speed'), 0)) {
    world.observer.setGlobal('num-cars-stopped', (world.observer.getGlobal('num-cars-stopped') + 1));
    Prims.setVariable('wait-time', (Prims.getVariable('wait-time') + 1));
  }
  else {
    Prims.setVariable('wait-time', 0);
  }
}
function changeCurrent() {
  world.observer.getGlobal('current-light').ask(function() {
    Prims.setPatchVariable('green-light-up?', !Prims.getPatchVariable('green-light-up?'));
    Call(setSignalColors);
  }, true);
}
function nextPhase() {
  world.observer.setGlobal('phase', (world.observer.getGlobal('phase') + 1));
  if (Prims.equality(Prims.mod(world.observer.getGlobal('phase'), world.observer.getGlobal('ticks-per-cycle')), 0)) {
    world.observer.setGlobal('phase', 0);
  }
}
world.observer.setGlobal('grid-size-y', 5);
world.observer.setGlobal('grid-size-x', 5);
world.observer.setGlobal('power?', true);
world.observer.setGlobal('num-cars', 200);
world.observer.setGlobal('speed-limit', 1);
world.observer.setGlobal('ticks-per-cycle', 20);
world.observer.setGlobal('current-phase', 0);
world.observer.setGlobal('current-auto?', true);
