var workspace     = require('engine/workspace')([{ name: 'PARTICLES', singular: 'particle', varNames: ['speed', 'mass', 'energy', 'wall-hits', 'momentum-difference', 'last-collision'] }, { name: 'FLASHES', singular: 'flash', varNames: ['birthday'] }, { name: 'CLOCKERS', singular: 'clocker', varNames: [] }])(['number-of-particles', 'collide?', 'trace?', 'init-particle-speed', 'particle-mass', 'result', 'tick-length', 'box-edge', 'pressure', 'pressure-history', 'zero-pressure-count', 'wall-hits-per-particle', 'length-horizontal-surface', 'length-vertical-surface', 'init-avg-speed', 'init-avg-energy', 'avg-speed', 'avg-energy', 'fast', 'medium', 'slow', 'fade-needed?'], ['number-of-particles', 'collide?', 'trace?', 'init-particle-speed', 'particle-mass'], [], [], [], -50, 50, -50, 50, 4.0, true, true, {"default":{"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"clocker":{"rotate":true,"elements":[{"xcors":[150,105,135,135,165,165,195],"ycors":[30,195,180,270,270,180,195],"type":"polygon","color":"rgba(167, 27, 106, 1.0)","filled":true,"marked":false}]},"cow":{"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"face happy":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"flag":{"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"house":{"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}}, {"default":{}});
var BreedManager  = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims     = workspace.linkPrims;
var Prims         = workspace.prims;
var SelfPrims     = workspace.selfPrims;
var SelfManager   = workspace.selfManager;
var Updater       = workspace.updater;
var world         = workspace.world;

var Call           = require('util/call');
var ColorModel     = require('util/colormodel');
var Exception      = require('util/exception');
var Trig           = require('util/trig');
var Type           = require('util/typechecker');
var notImplemented = require('util/notimplemented');

var Dump      = require('engine/dump');
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
var StrictMath     = require('shim/strictmath');function benchmark() {
  Random.setSeed(361);
  workspace.timer.reset();
  Call(setup);
  Prims.repeat(17000, function () {
    Call(go);
  });
  world.observer.setGlobal('result', workspace.timer.elapsed());
}
function setup() {
  world.clearAll();
  world.ticker.reset();
  BreedManager.setDefaultShape(world.turtlesOfBreed("PARTICLES").getBreedName(), "circle")
  world.observer.setGlobal('fade-needed?', false);
  world.observer.setGlobal('box-edge', (world.topology.maxPxcor - 1));
  world.observer.setGlobal('length-horizontal-surface', ((2 * (world.observer.getGlobal('box-edge') - 1)) + 1));
  world.observer.setGlobal('length-vertical-surface', ((2 * (world.observer.getGlobal('box-edge') - 1)) + 1));
  Call(makeBox);
  Call(makeParticles);
  Call(makeClocker);
  world.observer.setGlobal('pressure-history', []);
  world.observer.setGlobal('zero-pressure-count', 0);
  Call(updateVariables);
  world.observer.setGlobal('init-avg-speed', world.observer.getGlobal('avg-speed'));
  world.observer.setGlobal('init-avg-energy', world.observer.getGlobal('avg-energy'));
  Call(setupPlotz);
  Call(setupHistograms);
  Call(doPlotting);
}
function updateVariables() {
  world.observer.setGlobal('medium', world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 55);
  }).size());
  world.observer.setGlobal('slow', world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 105);
  }).size());
  world.observer.setGlobal('fast', world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 15);
  }).size());
  world.observer.setGlobal('avg-speed', Prims.mean(world.turtlesOfBreed("PARTICLES").projectionBy(function() {
    return SelfPrims.getVariable('speed');
  })));
  world.observer.setGlobal('avg-energy', Prims.mean(world.turtlesOfBreed("PARTICLES").projectionBy(function() {
    return SelfPrims.getVariable('energy');
  })));
}
function go() {
  world.turtlesOfBreed("PARTICLES").ask(function() {
    Call(bounce);
  }, true);
  world.turtlesOfBreed("PARTICLES").ask(function() {
    Call(move);
  }, true);
  world.turtlesOfBreed("PARTICLES").ask(function() {
    if (world.observer.getGlobal('collide?')) {
      Call(checkForCollision);
    }
  }, true);
  if (world.observer.getGlobal('trace?')) {
    world.getTurtleOfBreed("PARTICLES", 0).ask(function() {
      SelfPrims.setPatchVariable('pcolor', 5);
      world.observer.setGlobal('fade-needed?', true);
    }, true);
  }
  var oldClock = world.ticker.tickCount();
  world.ticker.tickAdvance(world.observer.getGlobal('tick-length'));
  if (Prims.gt(StrictMath.floor(world.ticker.tickCount()), StrictMath.floor((world.ticker.tickCount() - world.observer.getGlobal('tick-length'))))) {
    if (world.turtlesOfBreed("PARTICLES").nonEmpty()) {
      world.observer.setGlobal('wall-hits-per-particle', Prims.mean(world.turtlesOfBreed("PARTICLES").projectionBy(function() {
        return SelfPrims.getVariable('wall-hits');
      })));
    }
    else {
      world.observer.setGlobal('wall-hits-per-particle', 0);
    }
    world.turtlesOfBreed("PARTICLES").ask(function() {
      SelfPrims.setVariable('wall-hits', 0);
    }, true);
    if (world.observer.getGlobal('fade-needed?')) {
      Call(fadePatches);
    }
    Call(calculatePressure);
    Call(updateVariables);
    Call(doPlotting);
  }
  Call(calculateTickLength);
  world.turtlesOfBreed("CLOCKERS").ask(function() {
    SelfPrims.setVariable('heading', (world.ticker.tickCount() * 360));
  }, true);
  world.turtlesOfBreed("FLASHES").agentFilter(function() {
    return Prims.gt((world.ticker.tickCount() - SelfPrims.getVariable('birthday')), 0.4);
  }).ask(function() {
    SelfPrims.setPatchVariable('pcolor', 45);
    SelfPrims.die();
  }, true);
  notImplemented('display', undefined)();
}
function calculateTickLength() {
  if (world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.gt(SelfPrims.getVariable('speed'), 0);
  }).nonEmpty()) {
    world.observer.setGlobal('tick-length', (1 / StrictMath.ceil(Prims.max(world.turtlesOfBreed("PARTICLES").projectionBy(function() {
      return SelfPrims.getVariable('speed');
    })))));
  }
  else {
    world.observer.setGlobal('tick-length', 1);
  }
}
function calculatePressure() {
  world.observer.setGlobal('pressure', (15 * Prims.sum(world.turtlesOfBreed("PARTICLES").projectionBy(function() {
    return SelfPrims.getVariable('momentum-difference');
  }))));
  world.observer.setGlobal('pressure-history', Prims.lput(world.observer.getGlobal('pressure'), world.observer.getGlobal('pressure-history')));
  world.observer.setGlobal('zero-pressure-count', Prims.length(world.observer.getGlobal('pressure-history').filter(Tasks.reporterTask(function() {
    var taskArguments = arguments;
    return Prims.equality(taskArguments[0], 0);
  }))));
  world.turtlesOfBreed("PARTICLES").ask(function() {
    SelfPrims.setVariable('momentum-difference', 0);
  }, true);
}
function bounce() {
  if (ColorModel.areRelatedByShade(45, SelfPrims.getPatchVariable('pcolor'))) {
    throw new Exception.StopInterrupt;
  }
  var newPatch = SelfManager.self().patchAhead(1);
  var newPx = newPatch.projectionBy(function() {
    return SelfPrims.getPatchVariable('pxcor');
  });
  var newPy = newPatch.projectionBy(function() {
    return SelfPrims.getPatchVariable('pycor');
  });
  if (!ColorModel.areRelatedByShade(45, newPatch.projectionBy(function() {
    return SelfPrims.getPatchVariable('pcolor');
  }))) {
    throw new Exception.StopInterrupt;
  }
  if ((!Prims.equality(StrictMath.abs(newPx), world.observer.getGlobal('box-edge')) && !Prims.equality(StrictMath.abs(newPy), world.observer.getGlobal('box-edge')))) {
    throw new Exception.StopInterrupt;
  }
  if (Prims.equality(StrictMath.abs(newPx), world.observer.getGlobal('box-edge'))) {
    SelfPrims.setVariable('heading',  -SelfPrims.getVariable('heading'));
    SelfPrims.setVariable('wall-hits', (SelfPrims.getVariable('wall-hits') + 1));
    SelfPrims.setVariable('momentum-difference', (SelfPrims.getVariable('momentum-difference') + (StrictMath.abs((((Trig.unsquashedSin(SelfPrims.getVariable('heading')) * 2) * SelfPrims.getVariable('mass')) * SelfPrims.getVariable('speed'))) / world.observer.getGlobal('length-vertical-surface'))));
  }
  if (Prims.equality(StrictMath.abs(newPy), world.observer.getGlobal('box-edge'))) {
    SelfPrims.setVariable('heading', (180 - SelfPrims.getVariable('heading')));
    SelfPrims.setVariable('wall-hits', (SelfPrims.getVariable('wall-hits') + 1));
    SelfPrims.setVariable('momentum-difference', (SelfPrims.getVariable('momentum-difference') + (StrictMath.abs((((Trig.unsquashedCos(SelfPrims.getVariable('heading')) * 2) * SelfPrims.getVariable('mass')) * SelfPrims.getVariable('speed'))) / world.observer.getGlobal('length-horizontal-surface'))));
  }
  world.getPatchAt(newPx, newPy).ask(function() {
    SelfPrims.sprout(1, 'FLASHES').ask(function() {
      SelfManager.self().hideTurtle(true);;
      SelfPrims.setVariable('birthday', world.ticker.tickCount());
      SelfPrims.setPatchVariable('pcolor', (45 - 3));
    }, true);
  }, true);
}
function move() {
  var oldPatch = SelfManager.self().getPatchHere();
  SelfPrims.jump((SelfPrims.getVariable('speed') * world.observer.getGlobal('tick-length')));
  if (!Prims.equality(SelfManager.self().getPatchHere(), oldPatch)) {
    SelfPrims.setVariable('last-collision', Nobody);
  }
}
function checkForCollision() {
  if (Prims.equality(SelfPrims.other(SelfManager.self().breedHere("PARTICLES")).size(), 1)) {
    var candidate = Prims.oneOf(SelfPrims.other(SelfManager.self().breedHere("PARTICLES").agentFilter(function() {
      return (Prims.lt(SelfPrims.getVariable('who'), SelfManager.myself().projectionBy(function() {
        return SelfPrims.getVariable('who');
      })) && !Prims.equality(SelfManager.myself(), SelfPrims.getVariable('last-collision')));
    })));
    if ((!Prims.equality(candidate, Nobody) && (Prims.gt(SelfPrims.getVariable('speed'), 0) || Prims.gt(candidate.projectionBy(function() {
      return SelfPrims.getVariable('speed');
    }), 0)))) {
      Call(collideWith, candidate);
      SelfPrims.setVariable('last-collision', candidate);
      candidate.ask(function() {
        SelfPrims.setVariable('last-collision', SelfManager.myself());
      }, true);
    }
  }
}
function collideWith(otherParticle) {
  var mass2 = otherParticle.projectionBy(function() {
    return SelfPrims.getVariable('mass');
  });
  var speed2 = otherParticle.projectionBy(function() {
    return SelfPrims.getVariable('speed');
  });
  var heading2 = otherParticle.projectionBy(function() {
    return SelfPrims.getVariable('heading');
  });
  var theta = Prims.randomFloat(360);
  var v1t = (SelfPrims.getVariable('speed') * Trig.unsquashedCos((theta - SelfPrims.getVariable('heading'))));
  var v1l = (SelfPrims.getVariable('speed') * Trig.unsquashedSin((theta - SelfPrims.getVariable('heading'))));
  var v2t = (speed2 * Trig.unsquashedCos((theta - heading2)));
  var v2l = (speed2 * Trig.unsquashedSin((theta - heading2)));
  var vcm = (((SelfPrims.getVariable('mass') * v1t) + (mass2 * v2t)) / (SelfPrims.getVariable('mass') + mass2));
  v1t = ((2 * vcm) - v1t);
  v2t = ((2 * vcm) - v2t);
  SelfPrims.setVariable('speed', StrictMath.sqrt(((v1t * v1t) + (v1l * v1l))));
  SelfPrims.setVariable('energy', (((0.5 * SelfPrims.getVariable('mass')) * SelfPrims.getVariable('speed')) * SelfPrims.getVariable('speed')));
  if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
    SelfPrims.setVariable('heading', (theta - Trig.atan(v1l, v1t)));
  }
  otherParticle.ask(function() {
    SelfPrims.setVariable('speed', StrictMath.sqrt(((v2t * v2t) + (v2l * v2l))));
  }, true);
  otherParticle.ask(function() {
    SelfPrims.setVariable('energy', (((0.5 * SelfPrims.getVariable('mass')) * SelfPrims.getVariable('speed')) * SelfPrims.getVariable('speed')));
  }, true);
  if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
    otherParticle.ask(function() {
      SelfPrims.setVariable('heading', (theta - Trig.atan(v2l, v2t)));
    }, true);
  }
  Call(recolor);
  otherParticle.ask(function() {
    Call(recolor);
  }, true);
}
function recolor() {
  if (Prims.lt(SelfPrims.getVariable('speed'), (0.5 * 10))) {
    SelfPrims.setVariable('color', 105);
  }
  else {
    if (Prims.gt(SelfPrims.getVariable('speed'), (1.5 * 10))) {
      SelfPrims.setVariable('color', 15);
    }
    else {
      SelfPrims.setVariable('color', 55);
    }
  }
}
function fadePatches() {
  var tracePatches = world.patches().agentFilter(function() {
    return (!Prims.equality(SelfPrims.getPatchVariable('pcolor'), 45) && !Prims.equality(SelfPrims.getPatchVariable('pcolor'), 0));
  });
  if (tracePatches.nonEmpty()) {
    tracePatches.ask(function() {
      SelfPrims.setPatchVariable('pcolor', (SelfPrims.getPatchVariable('pcolor') - 0.4));
      if ((!world.observer.getGlobal('trace?') || Prims.equality(StrictMath.round(SelfPrims.getPatchVariable('pcolor')), 0))) {
        SelfPrims.setPatchVariable('pcolor', 0);
      }
    }, true);
  }
  else {
    world.observer.setGlobal('fade-needed?', false);
  }
}
function makeBox() {
  world.patches().agentFilter(function() {
    return ((Prims.equality(StrictMath.abs(SelfPrims.getPatchVariable('pxcor')), world.observer.getGlobal('box-edge')) && Prims.lte(StrictMath.abs(SelfPrims.getPatchVariable('pycor')), world.observer.getGlobal('box-edge'))) || (Prims.equality(StrictMath.abs(SelfPrims.getPatchVariable('pycor')), world.observer.getGlobal('box-edge')) && Prims.lte(StrictMath.abs(SelfPrims.getPatchVariable('pxcor')), world.observer.getGlobal('box-edge'))));
  }).ask(function() {
    SelfPrims.setPatchVariable('pcolor', 45);
  }, true);
}
function makeParticles() {
  world.createOrderedTurtles(world.observer.getGlobal('number-of-particles'), 'PARTICLES').ask(function() {
    Call(setupParticle);
    Call(randomPosition);
    Call(recolor);
  }, true);
  Call(calculateTickLength);
}
function setupParticle() {
  SelfPrims.setVariable('speed', world.observer.getGlobal('init-particle-speed'));
  SelfPrims.setVariable('mass', world.observer.getGlobal('particle-mass'));
  SelfPrims.setVariable('energy', (((0.5 * SelfPrims.getVariable('mass')) * SelfPrims.getVariable('speed')) * SelfPrims.getVariable('speed')));
  SelfPrims.setVariable('last-collision', Nobody);
  SelfPrims.setVariable('wall-hits', 0);
  SelfPrims.setVariable('momentum-difference', 0);
}
function randomPosition() {
  SelfPrims.setXY(((1 - world.observer.getGlobal('box-edge')) + Prims.randomFloat(((2 * world.observer.getGlobal('box-edge')) - 2))), ((1 - world.observer.getGlobal('box-edge')) + Prims.randomFloat(((2 * world.observer.getGlobal('box-edge')) - 2))));
  SelfPrims.setVariable('heading', Prims.randomFloat(360));
}
function setupPlotz() {
  notImplemented('set-current-plot', undefined)("Speed Counts");
  notImplemented('set-plot-y-range', undefined)(0, StrictMath.ceil((world.observer.getGlobal('number-of-particles') / 6)));
}
function setupHistograms() {
  notImplemented('set-current-plot', undefined)("Speed Histogram");
  notImplemented('set-plot-x-range', undefined)(0, (world.observer.getGlobal('init-particle-speed') * 2));
  notImplemented('set-plot-y-range', undefined)(0, StrictMath.ceil((world.observer.getGlobal('number-of-particles') / 6)));
  notImplemented('set-current-plot-pen', undefined)("medium");
  notImplemented('set-histrogram-num-bars', undefined)(40);
  notImplemented('set-current-plot-pen', undefined)("slow");
  notImplemented('set-histrogram-num-bars', undefined)(40);
  notImplemented('set-current-plot-pen', undefined)("fast");
  notImplemented('set-histrogram-num-bars', undefined)(40);
  notImplemented('set-current-plot-pen', undefined)("init-avg-speed");
  Call(drawVertLine, world.observer.getGlobal('init-avg-speed'));
  notImplemented('set-current-plot', undefined)("Energy Histogram");
  notImplemented('set-plot-x-range', undefined)(0, (((0.5 * (world.observer.getGlobal('init-particle-speed') * 2)) * (world.observer.getGlobal('init-particle-speed') * 2)) * world.observer.getGlobal('particle-mass')));
  notImplemented('set-plot-y-range', undefined)(0, StrictMath.ceil((world.observer.getGlobal('number-of-particles') / 6)));
  notImplemented('set-current-plot-pen', undefined)("medium");
  notImplemented('set-histrogram-num-bars', undefined)(40);
  notImplemented('set-current-plot-pen', undefined)("slow");
  notImplemented('set-histrogram-num-bars', undefined)(40);
  notImplemented('set-current-plot-pen', undefined)("fast");
  notImplemented('set-histrogram-num-bars', undefined)(40);
  notImplemented('set-current-plot-pen', undefined)("init-avg-energy");
  Call(drawVertLine, world.observer.getGlobal('init-avg-energy'));
}
function doPlotting() {
  notImplemented('set-current-plot', undefined)("Pressure vs. Time");
  if (Prims.gt(Prims.length(world.observer.getGlobal('pressure-history')), 0)) {
    notImplemented('plotxy', undefined)(world.ticker.tickCount(), Prims.mean(Call(lastN, 3, world.observer.getGlobal('pressure-history'))));
  }
  notImplemented('set-current-plot', undefined)("Speed Counts");
  notImplemented('set-current-plot-pen', undefined)("fast");
  notImplemented('plot', undefined)(world.observer.getGlobal('fast'));
  notImplemented('set-current-plot-pen', undefined)("medium");
  notImplemented('plot', undefined)(world.observer.getGlobal('medium'));
  notImplemented('set-current-plot-pen', undefined)("slow");
  notImplemented('plot', undefined)(world.observer.getGlobal('slow'));
  if (Prims.gt(world.ticker.tickCount(), 1)) {
    notImplemented('set-current-plot', undefined)("Wall Hits per Particle");
    notImplemented('plotxy', undefined)(world.ticker.tickCount(), world.observer.getGlobal('wall-hits-per-particle'));
  }
  Call(plotHistograms);
}
function plotHistograms() {
  notImplemented('set-current-plot', undefined)("Energy histogram");
  notImplemented('set-current-plot-pen', undefined)("fast");
  notImplemented('histogram', undefined)(world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 15);
  }).projectionBy(function() {
    return SelfPrims.getVariable('energy');
  }));
  notImplemented('set-current-plot-pen', undefined)("medium");
  notImplemented('histogram', undefined)(world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 55);
  }).projectionBy(function() {
    return SelfPrims.getVariable('energy');
  }));
  notImplemented('set-current-plot-pen', undefined)("slow");
  notImplemented('histogram', undefined)(world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 105);
  }).projectionBy(function() {
    return SelfPrims.getVariable('energy');
  }));
  notImplemented('set-current-plot-pen', undefined)("avg-energy");
  notImplemented('plot-pen-reset', undefined)();
  Call(drawVertLine, world.observer.getGlobal('avg-energy'));
  notImplemented('set-current-plot', undefined)("Speed histogram");
  notImplemented('set-current-plot-pen', undefined)("fast");
  notImplemented('histogram', undefined)(world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 15);
  }).projectionBy(function() {
    return SelfPrims.getVariable('speed');
  }));
  notImplemented('set-current-plot-pen', undefined)("medium");
  notImplemented('histogram', undefined)(world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 55);
  }).projectionBy(function() {
    return SelfPrims.getVariable('speed');
  }));
  notImplemented('set-current-plot-pen', undefined)("slow");
  notImplemented('histogram', undefined)(world.turtlesOfBreed("PARTICLES").agentFilter(function() {
    return Prims.equality(SelfPrims.getVariable('color'), 105);
  }).projectionBy(function() {
    return SelfPrims.getVariable('speed');
  }));
  notImplemented('set-current-plot-pen', undefined)("avg-speed");
  notImplemented('plot-pen-reset', undefined)();
  Call(drawVertLine, world.observer.getGlobal('avg-speed'));
}
function drawVertLine(xval) {
  notImplemented('plotxy', undefined)(xval, notImplemented('plot-y-min', 0)());
  notImplemented('plot-pen-down', undefined)();
  notImplemented('plotxy', undefined)(xval, notImplemented('plot-y-max', 0)());
  notImplemented('plot-pen-up', undefined)();
}
function lastN(n, theList) {
  if (Prims.gte(n, Prims.length(theList))) {
    return theList;
  }
  else {
    return Call(lastN, n, Prims.butFirst(theList));
  }
}
function makeClocker() {
  BreedManager.setDefaultShape(world.turtlesOfBreed("CLOCKERS").getBreedName(), "clocker")
  world.createOrderedTurtles(1, 'CLOCKERS').ask(function() {
    SelfPrims.setXY((world.observer.getGlobal('box-edge') - 5), (world.observer.getGlobal('box-edge') - 5));
    SelfPrims.setVariable('color', (115 + 2));
    SelfPrims.setVariable('size', 10);
    SelfPrims.setVariable('heading', 0);
  }, true);
}
world.observer.setGlobal('number-of-particles', 150);
world.observer.setGlobal('collide?', true);
world.observer.setGlobal('trace?', true);
world.observer.setGlobal('init-particle-speed', 10);
world.observer.setGlobal('particle-mass', 5);
